import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../library_providers.dart';

class SectionsScreen extends ConsumerWidget {
  const SectionsScreen({
    super.key,
    required this.semesterName,
    required this.subjectName,
  });

  final String semesterName;
  final String subjectName;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncIndex = ref.watch(appIndexProvider);

    return Scaffold(
      appBar: AppBar(title: Text(subjectName)),
      body: asyncIndex.when(
        data: (index) {
          final semester =
              index.semesters.firstWhere((s) => s.name == semesterName);
          final subject =
              semester.subjects.firstWhere((s) => s.name == subjectName);

          final sections = subject.sections;
          if (sections.isEmpty) {
            return const Center(child: Text('No sections found.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemBuilder: (context, i) {
              final sec = sections[i];
              return ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                tileColor:
                    Theme.of(context).colorScheme.surfaceContainerHighest,
                title: Text(sec.name),
                subtitle: Text('${sec.items.length} items'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => context.go(
                  '/semester/${Uri.encodeComponent(semesterName)}/subject/${Uri.encodeComponent(subjectName)}/section/${Uri.encodeComponent(sec.name)}',
                ),
              );
            },
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: sections.length,
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('$e')),
      ),
    );
  }
}
