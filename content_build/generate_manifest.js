/**
 * generate_manifest.js
 * 
 * Generates the index.json manifest for the content pack with:
 * - docs: all document metadata
 * - sidebarTree: minimal sidebar navigation (essentials only)
 * - indexGraph: deep navigation structure (index → children)
 * - relations.nextPrev: prev/next/up for sequential docs
 * - backlinksGraph: manual curated links (optional)
 * 
 * Usage: node generate_manifest.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const CONTENT_DIR = path.resolve(__dirname, '..', 'content');
const DOCS_DIR = path.join(CONTENT_DIR, 'docs');
const REGISTRY_PATH = path.join(__dirname, 'doc_registry.json');
const OUTPUT_PATH = path.join(CONTENT_DIR, 'index.json');

/**
 * Load the doc registry
 */
function loadRegistry() {
    if (!fs.existsSync(REGISTRY_PATH)) {
        throw new Error(`doc_registry.json not found at ${REGISTRY_PATH}`);
    }
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));
}

/**
 * Detect doc type from docId and path
 */
function detectDocType(docId, source) {
    const lowerDocId = docId.toLowerCase();
    const lowerSource = source.toLowerCase();
    
    // Check if it's an index page
    if (lowerDocId.endsWith('_index') || 
        lowerSource.match(/semester_?\d+[\\\/]index\.html$/i) ||
        lowerSource.match(/[\\\/]index\.html$/)) {
        return 'index';
    }
    
    // Check for units (unit1, unit2, etc.)
    if (lowerDocId.match(/unit\d+$/) || lowerDocId.match(/_u\d+$/)) {
        return 'unit';
    }
    
    // Check for specific types
    if (lowerDocId.includes('handout')) return 'handout';
    if (lowerDocId.includes('pyq')) return 'pyq';
    if (lowerDocId.includes('notes')) return 'notes';
    if (lowerDocId.includes('assignment')) return 'assignments';
    if (lowerDocId.includes('project')) return 'projects';
    
    return 'doc';
}

/**
 * Extract semester number from docId
 */
function extractSemester(docId) {
    const match = docId.match(/semester_?(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
}

/**
 * Extract subject name from docId
 */
function extractSubject(docId) {
    // Pattern: semester_X_SUBJECT_...
    const parts = docId.split('_');
    if (parts.length >= 3 && parts[0] === 'semester') {
        return parts[2]; // e.g., "c" from "semester_1_c_programming"
    }
    return null;
}

/**
 * Build docs map with enhanced metadata
 */
function buildDocsMap(registry) {
    const docs = {};
    
    for (const [docId, meta] of Object.entries(registry)) {
        const type = detectDocType(docId, meta.source);
        const semester = extractSemester(docId);
        
        docs[docId] = {
            title: meta.title || docId.replace(/_/g, ' '),
            type,
            html: `docs/${docId}.html`,
            semester,
        };
        
        // Add unit metadata for unit docs
        if (type === 'unit') {
            const unitMatch = docId.match(/unit(\d+)/i) || docId.match(/_u(\d+)$/);
            if (unitMatch) {
                const courseMatch = docId.match(/^(.+?)_notes_unit/i) || docId.match(/^(.+?)_u\d+$/);
                docs[docId].unit = {
                    course: courseMatch ? courseMatch[1] : docId.split('_').slice(0, -1).join('_'),
                    number: parseInt(unitMatch[1], 10)
                };
            }
        }
    }
    
    return docs;
}

/**
 * Build sidebar tree (minimal - essentials only)
 * Structure: Semester → Subject → (Handout, Notes, PYQ)
 */
function buildSidebarTree(docs) {
    const semesters = {};
    
    for (const [docId, meta] of Object.entries(docs)) {
        const semester = meta.semester;
        if (!semester) continue;
        
        // Only include essential entry points
        const type = meta.type;
        if (!['index', 'handout', 'notes', 'pyq', 'assignments', 'projects'].includes(type)) {
            continue;
        }
        
        // Skip unit docs in sidebar
        if (type === 'unit') continue;
        
        // Extract subject from docId
        const parts = docId.split('_');
        if (parts.length < 3) continue;
        
        let subject = null;
        // Pattern: semester_X_SUBJECT_...
        if (parts[0] === 'semester' && !isNaN(parseInt(parts[1]))) {
            subject = parts[2];
        }
        if (!subject) continue;
        
        // Initialize semester
        if (!semesters[semester]) {
            semesters[semester] = {
                id: `sem${semester}`,
                title: `Semester ${semester}`,
                items: {}
            };
        }
        
        // Initialize subject
        if (!semesters[semester].items[subject]) {
            semesters[semester].items[subject] = {
                id: `s${semester}_${subject}`,
                title: formatTitle(subject),
                items: []
            };
        }
        
        // Add essential items (not index pages - those are entry points)
        if (type === 'index' && docId.match(/semester_\d+_[^_]+$/)) {
            // Subject index - make this the link for the subject
            semesters[semester].items[subject].docId = docId;
        } else if (['handout', 'notes', 'pyq', 'assignments', 'projects'].includes(type)) {
            semesters[semester].items[subject].items.push({
                id: docId,
                title: formatTitle(type),
                docId: docId
            });
        }
    }
    
    // Convert to array format
    return Object.values(semesters)
        .sort((a, b) => parseInt(a.id.replace('sem', '')) - parseInt(b.id.replace('sem', '')))
        .map(sem => ({
            id: sem.id,
            title: sem.title,
            items: Object.values(sem.items)
                .map(subj => ({
                    id: subj.id,
                    title: subj.title,
                    docId: subj.docId,
                    items: subj.items.length > 0 ? subj.items : undefined
                }))
        }));
}

/**
 * Build index graph (deep navigation)
 * Maps: indexDocId → [childDocIds]
 */
function buildIndexGraph(docs, registry) {
    const graph = {};
    
    for (const [docId, meta] of Object.entries(docs)) {
        if (meta.type !== 'index') continue;
        
        // Find children based on path hierarchy
        const children = findChildren(docId, docs, registry);
        if (children.length > 0) {
            graph[docId] = children;
        }
    }
    
    return graph;
}

/**
 * Find children of an index document
 */
function findChildren(indexDocId, docs, registry) {
    const children = [];
    const indexPath = registry[indexDocId]?.source || '';
    const indexDir = path.dirname(indexPath).replace(/\\/g, '/');
    
    for (const [docId, meta] of Object.entries(registry)) {
        if (docId === indexDocId) continue;
        
        const docPath = path.dirname(meta.source).replace(/\\/g, '/');
        
        // Direct children: parent dir matches and not deeper
        if (docPath.startsWith(indexDir + '/')) {
            const remaining = docPath.substring(indexDir.length + 1);
            const depth = remaining.split('/').filter(p => p).length;
            
            // Only immediate children (depth 0 or 1 for index pages)
            if (depth <= 1) {
                children.push(docId);
            }
        }
    }
    
    // Sort children
    return children.sort((a, b) => {
        // Units should be sorted by number
        const aUnit = a.match(/unit(\d+)/i);
        const bUnit = b.match(/unit(\d+)/i);
        if (aUnit && bUnit) {
            return parseInt(aUnit[1]) - parseInt(bUnit[1]);
        }
        return a.localeCompare(b);
    });
}

/**
 * Build relations (prev/next/up for units)
 */
function buildRelations(docs) {
    const nextPrev = {};
    
    // Group units by course
    const courseUnits = {};
    
    for (const [docId, meta] of Object.entries(docs)) {
        if (meta.type !== 'unit' || !meta.unit) continue;
        
        const course = meta.unit.course;
        if (!courseUnits[course]) {
            courseUnits[course] = [];
        }
        courseUnits[course].push({
            docId,
            number: meta.unit.number
        });
    }
    
    // Generate prev/next/up for each course
    for (const [course, units] of Object.entries(courseUnits)) {
        // Sort by unit number
        units.sort((a, b) => a.number - b.number);
        
        // Find the notes index for this course
        const notesIndex = findNotesIndex(course, docs);
        
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            nextPrev[unit.docId] = {
                prev: i > 0 ? units[i - 1].docId : null,
                next: i < units.length - 1 ? units[i + 1].docId : null,
                up: notesIndex
            };
        }
    }
    
    return { nextPrev };
}

/**
 * Find notes index for a course
 */
function findNotesIndex(course, docs) {
    // Try to find: course_notes or course_notes_index
    const candidates = [
        `${course}_notes`,
        `${course}_notes_index`,
        course.replace(/_[^_]+$/, '_notes')
    ];
    
    for (const candidate of candidates) {
        if (docs[candidate]) {
            return candidate;
        }
    }
    
    // Fallback: find any notes index that starts with course
    for (const docId of Object.keys(docs)) {
        if (docId.startsWith(course) && docId.includes('notes') && !docId.match(/unit\d+/i)) {
            return docId;
        }
    }
    
    return null;
}

/**
 * Format title from slug
 */
function formatTitle(slug) {
    return slug
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/Pyq/g, 'PYQ')
        .replace(/Cfoa/g, 'CFOA')
        .replace(/Dld/g, 'DLD');
}

/**
 * Generate the complete manifest
 */
function generateManifest() {
    console.log('🚀 Generating manifest...');
    
    const registry = loadRegistry();
    console.log(`📚 Loaded ${Object.keys(registry).length} docs from registry`);
    
    // Build docs map
    const docs = buildDocsMap(registry);
    console.log(`📄 Built docs map with ${Object.keys(docs).length} entries`);
    
    // Build sidebar tree
    const sidebarTree = buildSidebarTree(docs);
    console.log(`📂 Built sidebar tree with ${sidebarTree.length} semesters`);
    
    // Build index graph
    const indexGraph = buildIndexGraph(docs, registry);
    console.log(`🔗 Built index graph with ${Object.keys(indexGraph).length} index pages`);
    
    // Build relations
    const relations = buildRelations(docs);
    console.log(`↔️  Built relations for ${Object.keys(relations.nextPrev).length} units`);
    
    // Generate pack version from date
    const now = new Date();
    const packVersion = now.toISOString().split('T')[0].replace(/-/g, '.');
    
    // Build manifest
    const manifest = {
        packVersion,
        generatedAt: now.toISOString(),
        docs,
        sidebarTree,
        indexGraph,
        relations,
        backlinksGraph: {} // Placeholder for manual links
    };
    
    // Validate: check all referenced docIds exist
    validateManifest(manifest);
    
    // Write manifest
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`✅ Manifest written to ${OUTPUT_PATH}`);
    
    return manifest;
}

/**
 * Validate manifest - ensure all referenced docIds exist
 */
function validateManifest(manifest) {
    const errors = [];
    const docIds = new Set(Object.keys(manifest.docs));
    
    // Check indexGraph
    for (const [indexId, children] of Object.entries(manifest.indexGraph)) {
        if (!docIds.has(indexId)) {
            errors.push(`indexGraph: index "${indexId}" not in docs`);
        }
        for (const childId of children) {
            if (!docIds.has(childId)) {
                errors.push(`indexGraph: child "${childId}" of "${indexId}" not in docs`);
            }
        }
    }
    
    // Check relations
    for (const [docId, rel] of Object.entries(manifest.relations.nextPrev)) {
        if (!docIds.has(docId)) {
            errors.push(`relations: doc "${docId}" not in docs`);
        }
        if (rel.prev && !docIds.has(rel.prev)) {
            errors.push(`relations: prev "${rel.prev}" of "${docId}" not in docs`);
        }
        if (rel.next && !docIds.has(rel.next)) {
            errors.push(`relations: next "${rel.next}" of "${docId}" not in docs`);
        }
        if (rel.up && !docIds.has(rel.up)) {
            errors.push(`relations: up "${rel.up}" of "${docId}" not in docs`);
        }
    }
    
    // Check sidebarTree
    function checkSidebarNode(node) {
        if (node.docId && !docIds.has(node.docId)) {
            errors.push(`sidebarTree: docId "${node.docId}" not in docs`);
        }
        if (node.items) {
            for (const item of node.items) {
                checkSidebarNode(item);
            }
        }
    }
    for (const semester of manifest.sidebarTree) {
        checkSidebarNode(semester);
    }
    
    if (errors.length > 0) {
        console.warn('⚠️  Validation warnings:');
        errors.forEach(e => console.warn(`   - ${e}`));
    } else {
        console.log('✅ Manifest validation passed');
    }
}

// Run if called directly
if (require.main === module) {
    generateManifest();
}

module.exports = { generateManifest };
