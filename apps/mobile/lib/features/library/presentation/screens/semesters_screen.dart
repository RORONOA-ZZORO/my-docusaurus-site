import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../library_providers.dart';

class SemestersScreen extends ConsumerWidget {
  const SemestersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncIndex = ref.watch(appIndexProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Reference Library')),
      body: asyncIndex.when(
        data: (index) {
          final semesters = index.semesters;
          if (semesters.isEmpty) {
            return const Center(child: Text('No semesters found.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemBuilder: (context, i) {
              final s = semesters[i];
              return ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                tileColor: Theme.of(
                  context,
                ).colorScheme.surfaceContainerHighest,
                title: Text(s.name),
                trailing: const Icon(Icons.chevron_right),
                onTap: () =>
                    context.go('/semester/${Uri.encodeComponent(s.name)}'),
              );
            },
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemCount: semesters.length,
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Text('Failed to load index.\n$e'),
          ),
        ),
      ),
    );
  }
}
