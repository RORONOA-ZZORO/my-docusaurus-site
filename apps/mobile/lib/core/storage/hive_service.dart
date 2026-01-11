import 'package:hive_flutter/hive_flutter.dart';

import 'hive_boxes.dart';

class HiveService {
  HiveService._();

  static bool _initialized = false;

  static Future<void> init() async {
    if (_initialized) return;
    await Hive.initFlutter();
    await Hive.openBox(HiveBoxes.app);
    _initialized = true;
  }

  static Box get appBox => Hive.box(HiveBoxes.app);

  static String? getIndexJson() => appBox.get(HiveKeys.indexJson) as String?;

  static Future<void> setIndexJson(String json) =>
      appBox.put(HiveKeys.indexJson, json);

  static String? getIndexUpdatedAt() =>
      appBox.get(HiveKeys.indexUpdatedAt) as String?;

  static Future<void> setIndexUpdatedAt(String value) =>
      appBox.put(HiveKeys.indexUpdatedAt, value);
}
