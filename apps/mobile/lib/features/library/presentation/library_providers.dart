import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/http/http_client.dart';
import '../../../core/storage/hive_service.dart';
import '../data/index_repository.dart';
import '../domain/index_models.dart';

final dioProvider = Provider((ref) => HttpClient.create());

final indexRepositoryProvider = Provider<IndexRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return IndexRepository(dio: dio);
});

/// Ensures hive is opened + kicks off initial background refresh.
final appBootstrapProvider = FutureProvider<void>((ref) async {
  await HiveService.init();

  try {
    await ref.read(indexRepositoryProvider).fetchIndex();
  } catch (_) {
    // ignore (offline)
  }
});

final appIndexProvider = FutureProvider<AppIndex>((ref) async {
  final repo = ref.watch(indexRepositoryProvider);

  final cached = await repo.getCachedIndex();
  if (cached != null) {
    // refresh in background
    repo.fetchIndex();
    return cached;
  }

  return repo.fetchIndex();
});
