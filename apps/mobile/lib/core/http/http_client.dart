import 'package:dio/dio.dart';

class HttpClient {
  HttpClient._();

  static Dio create() {
    return Dio(
      BaseOptions(
        connectTimeout: const Duration(seconds: 20),
        receiveTimeout: const Duration(seconds: 20),
        sendTimeout: const Duration(seconds: 20),
        responseType: ResponseType.json,
        headers: const {'Accept': 'application/json'},
      ),
    );
  }
}
