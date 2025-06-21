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

  // Fetch all districts
  Future<List<Map<String, dynamic>>> fetchDistricts() async {
    final url = Uri.parse('$baseUrl/area/districts');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['data'] ?? []);
    } else {
      throw Exception('Failed to load districts');
    }
  }

  // Fetch divisional secretariats for a district
  Future<List<Map<String, dynamic>>> fetchDivisionalSecretariats(String districtId) async {
    final url = Uri.parse('$baseUrl/area/divisional-secretariats?district_id=$districtId');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['data'] ?? []);
    } else {
      throw Exception('Failed to load divisional secretariats');
    }
  }

  // Fetch GN divisions for a divisional secretariat
  Future<List<Map<String, dynamic>>> fetchGramaNiladhariDivisions(String divSecId) async {
    final url = Uri.parse('$baseUrl/area/grama-niladhari-divisions?divisional_secretariat_id=$divSecId');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['data'] ?? []);
    } else {
      throw Exception('Failed to load GN divisions');
    }
  }

  // Register user (sign up)
  Future<Map<String, dynamic>> registerUser({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String phone,
    String? houseId,
    required String address,
    required int members,
    required double distanceToRiver,
    required String districtId,
    required String divSecId,
    required String gnDivId,
    required double latitude,
    required double longitude,
  }) async {
    final url = Uri.parse('$baseUrl/auth/register');
    final body = {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': password,
      'phone': phone,
      if (houseId != null && houseId.isNotEmpty) 'houseId': houseId,
      'address': address,
      'members': members,
      'distance_to_river': distanceToRiver,
      'district_id': districtId,
      'divisional_secretariat_id': divSecId,
      'grama_niladhari_division_id': gnDivId,
      'latitude': latitude,
      'longitude': longitude,
    };
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );
      final data = jsonDecode(response.body);
      if (response.statusCode == 201 && data['success'] == true) {
        return {'success': true, 'user': data['user']};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Registration failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: [31m${e.toString()}[0m'};
    }
  }

  // Fetch all current flood announcements for the user
  Future<List<Map<String, dynamic>>> fetchCurrentFloodAnnouncementsForUser() async {
    final url = Uri.parse('$baseUrl/announcement/current/user');
    try {
      final token = await getToken();
      final response = await http.get(
        url,
        headers: token != null ? {'Authorization': 'Bearer $token'} : {},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['announcements'] != null) {
          return List<Map<String, dynamic>>.from(data['announcements']);
        } else {
          return [];
        }
      } else {
        debugPrint('Failed to fetch announcements: ${response.body}');
        return [];
      }
    } catch (e) {
      debugPrint('Error fetching announcements: $e');
      return [];
    }
  }

  // Submit a new victim request (inform victims)
  Future<Map<String, dynamic>> submitVictimRequest({
    required String title,
    required String message,
    required String emergencyLevel,
    required String needs,
  }) async {
    final url = Uri.parse('$baseUrl/victim/request');
    final token = await getToken();
    // Map emergency level string to a number for backend
    final Map<String, int> emergencyLevelMap = {
      'critical': 1,
      'high': 2,
      'medium': 3,
      'low': 4,
    };
    final int? emergencyLevelNum = emergencyLevelMap[emergencyLevel];
    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'title': title,
          'message': message,
          'emergency_level': emergencyLevelNum, // send as number
          'needs': needs,
        }),
      );
      debugPrint('Victim request POST response: status=${response.statusCode}, body=${response.body}');
      final data = jsonDecode(response.body);
      if (response.statusCode == 201 && data['success'] == true) {
        return {'success': true, 'message': data['message'] ?? 'Request submitted successfully'};
      } else {
        // Try to extract a user-friendly error message
        String errorMsg = data['message'] ?? data['error'] ?? 'Failed to submit request';
        // If the backend returns a list of errors, join them
        if (data['errors'] is List) {
          errorMsg += ': ' + (data['errors'] as List).join(', ');
        }
        return {'success': false, 'message': errorMsg};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: [31m[0m${e.toString()}'};
    }
  }

  Future<Map<String, dynamic>?> fetchUserProfile() async {
    final url = Uri.parse('$baseUrl/auth/profile');
    final token = await getToken();
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['user'] != null) {
        return Map<String, dynamic>.from(data['user']);
      }
    }
    return null;
  }

  Future<bool> updateUserProfile({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String address,
    String? emergencyContact,
    String? latitude,
    String? longitude,
  }) async {
    final url = Uri.parse('$baseUrl/auth/profile');
    final token = await getToken();
    final body = {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'phone': phone,
      'address': address,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
    };
    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
    if (response.statusCode == 200) {
      return true;
    }
    return false;
  }
}