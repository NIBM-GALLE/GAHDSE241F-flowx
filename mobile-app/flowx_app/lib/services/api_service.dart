import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';


class ApiService {
  static String get baseUrl {
    final url = kIsWeb 
      ? 'http://localhost:8005/api' 
      : 'http://10.0.2.2:8005/api';
    
    debugPrint("🌐 Using base URL: $url (Web: $kIsWeb)");
    return url;
  }

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/auth/login');
    debugPrint("🔐 Attempting login to: $url");
    
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      debugPrint("📥 Received response: ${response.statusCode}");
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success'] == true) {
        debugPrint("✅ Login successful, storing token");
        await _storage.write(key: 'jwt_token', value: data['token']);
        return {
          'success': true, 
          'token': data['token'], 
          'user': data['user']
        };
      } else {
        debugPrint("❌ Login failed: ${data['message']}");
        return {
          'success': false, 
          'message': data['message'] ?? 'Login failed'
        };
      }
    } catch (e) {
      debugPrint("‼️ Network error: $e");
      return {
        'success': false, 
        'message': 'Network error: ${e.toString()}'
      };
    }
  }

  Future<String?> getToken() async {
    debugPrint("🔍 Retrieving stored JWT token");
    return await _storage.read(key: 'jwt_token');
  }

  Future<void> logout() async {
    debugPrint("🚪 Logging out - removing token");
    await _storage.delete(key: 'jwt_token');
  }
}