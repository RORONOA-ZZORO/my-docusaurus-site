import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../library_providers.dart';

class SubjectsScreen extends ConsumerWidget {
  const SubjectsScreen({super.key, required this.semesterName});
  final String semesterName;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncIndex = ref.watch(appIndexProvider);

    return Scaffold(
      appBar: AppBar(title: Text(semesterName)),
      body: asyncIndex.when(
        data: (index) {
          final semester = index.semesters.firstWhere(
            (s) => s.name == semesterName,
            orElse: () => index.semesters.first,
          );

          final subjects = semester.subjects;
          if (subjects.isEmpty) {
            return const Center(child: Text('No subjects found.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemBuilder: (context, i) {
              final s = subjects[i];
              return ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                tileColor: Theme.of(
                  context,
                ).colorScheme.surfaceContainerHighest,
                title: Text(s.name),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => context.go(
                  '/semester/${Uri.encodeComponent(semesterName)}/subject/${Uri.encodeComponent(s.name)}',
                ),
              );
            },
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: subjects.length,
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('$e')),
      ),
    );
  }
}
