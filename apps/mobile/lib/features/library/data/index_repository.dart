import 'dart:convert';

import 'package:dio/dio.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/storage/hive_service.dart';
import '../domain/index_models.dart';

class IndexRepository {
  IndexRepository({required this.dio});
  final Dio dio;

  Future<AppIndex?> getCachedIndex() async {
    await HiveService.init();
    final cached = HiveService.getIndexJson();
    if (cached == null || cached.isEmpty) return null;
    final map = jsonDecode(cached) as Map<String, dynamic>;
    return AppIndex.fromJson(map);
  }

  Future<AppIndex> fetchIndex() async {
    final res = await dio.get(AppConstants.indexUrl);

    final map = res.data is Map<String, dynamic>
        ? res.data as Map<String, dynamic>
        : jsonDecode(jsonEncode(res.data)) as Map<String, dynamic>;

    final jsonString = jsonEncode(map);

    await HiveService.init();
    await HiveService.setIndexJson(jsonString);
    await HiveService.setIndexUpdatedAt(DateTime.now().toIso8601String());

    return AppIndex.fromJson(map);
  }
}
