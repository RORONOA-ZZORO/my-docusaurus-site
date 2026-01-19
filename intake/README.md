# 📥 Intake Folder

Drop your documents (PDF, PPT, PPTX) here for processing by AI.

---

## How It Works

1. Place your document in this folder
2. Ask the AI: *"Process `filename.pptx` and place in Semester X, Subject Y"*
3. AI reads the content, splits into units, and creates MDX files

---

## Output Structure

```
website/docs/Semester {N}/{Subject}/Notes/
├── index.mdx          ← Lists all units (links to unit1, unit2, etc.)
├── unit1.mdx          ← Unit 1 content
├── unit2.mdx          ← Unit 2 content
├── unit3.mdx          ← Unit 3 content
└── unit4.mdx          ← Unit 4 content
```

### Navigation Flow
```
Semester 1 index → ECS index → Notes index → unit1.mdx, unit2.mdx...
```

---

## Example

**Input:** `professional_communication.pptx` (4 units)

**Output:**
```
website/docs/Semester 1/English-Communication-Skills/Notes/
├── index.mdx          ← "Notes" page listing all units
├── unit1.mdx          ← Unit 1: Introduction to Communication
├── unit2.mdx          ← Unit 2: Verbal Communication
├── unit3.mdx          ← Unit 3: Written Communication
└── unit4.mdx          ← Unit 4: Professional Skills
```

---

## Subject Folder Names

| Subject | Folder Name |
|---------|-------------|
| English Communication Skills | `English-Communication-Skills` |
| C Programming | `C-Programming` |
| Digital Logic & Design | `Digital-Logic&Design` |
| Psychology | `Psychology` |
| Environmental Science | `Environmental-Science` |
| FMCA | `FMCA` |
| CFOA | `CFOA` |
| Understanding India | `Understanding-India` |

---

## MDX Format for Units

```mdx
---
id: unit1
title: "Unit 1: [Title from content]"
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Quiz from '@site/src/components/Quiz/Quiz';
import Calculator from '@site/src/components/Calculator/Calculator';
import CodeChecker from '@site/src/components/CodeChecker/CodeChecker';

# Unit 1: [Title]

[Content converted to markdown...]

---

## 🎯 Quick Quiz

<Quiz questions={[
  { question: "What is...?", options: ["A", "B", "C"], answer: 1 }
]} />
```

---

## Notes Index Format

```mdx
---
id: notes
title: "📝 Notes"
sidebar_position: 2
---

# Notes

| Unit | Topic |
|------|-------|
| [Unit 1](./unit1) | Introduction to Communication |
| [Unit 2](./unit2) | Verbal Communication |
| [Unit 3](./unit3) | Written Communication |
| [Unit 4](./unit4) | Professional Skills |
```

---

## Interactive Components Available

| Component | Usage |
|-----------|-------|
| `<Quiz />` | MCQ with instant feedback |
| `<Calculator />` | Live formula calculations |
| `<CodeChecker />` | Code syntax validation |

---

## Example Prompt

> "Process `professional_communication.pptx` - it has 4 units. Place in Semester 1, English Communication Skills. Add quizzes at the end of each unit."
