import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../features/library/presentation/library_providers.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

class ReferenceLibraryApp extends ConsumerWidget {
  const ReferenceLibraryApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    // bootstrap: open hive + initial index fetch in background
    ref.watch(appBootstrapProvider);

    return MaterialApp.router(
      title: 'Reference Library',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      routerConfig: router,
    );
  }
}
