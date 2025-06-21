import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';

class ApiService {
  static String get baseUrl {
    final url = kIsWeb 
      ? 'http://localhost:8005/api' 
      : 'http://10.0.2.2:8005/api';
    return url;
  }

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<String?> getToken() async {
    return await _storage.read(key: 'jwt_token');
  }

  // Fetch user's assigned subsidies (pending/available for collection)
  Future<List<Map<String, dynamic>>> fetchMySubsidies() async {
    final url = Uri.parse('$baseUrl/subsidies/new');
    final token = await getToken();
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    print('Subsidy API response: ${response.body}');
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['data'] != null && data['data']['subsidies'] is List) {
        return List<Map<String, dynamic>>.from(data['data']['subsidies']);
      } else {
        return [];
      }
    } else {
      throw Exception('Failed to fetch subsidies');
    }
  }
}
