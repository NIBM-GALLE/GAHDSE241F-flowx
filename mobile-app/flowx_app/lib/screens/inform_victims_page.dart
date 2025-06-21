import 'package:flutter/material.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';
import 'subsidy_page.dart';
import 'contact_page.dart';
import 'profile_page.dart';
import '../services/api_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class InformVictimsPage extends StatefulWidget {
  const InformVictimsPage({super.key});

  @override
  State<InformVictimsPage> createState() => _InformVictimsPageState();
}

class _InformVictimsPageState extends State<InformVictimsPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _messageController = TextEditingController();
  String? _urgencyLevel;
  String? _assistanceType;
  bool _isSubmitting = false;
  bool _submitSuccess = false;
  String? _submitError;

  final ApiService _apiService = ApiService();

  final List<Map<String, String>> urgencyLevels = [
    { 'value': 'critical', 'label': 'Critical - Immediate danger' },
    { 'value': 'high', 'label': 'High - Need help within hours' },
    { 'value': 'medium', 'label': 'Medium - Need help today' },
    { 'value': 'low', 'label': 'Low - Need help soon' },
  ];

  final List<Map<String, String>> assistanceTypes = [
    { 'value': 'rescue', 'label': 'Rescue/Evacuation' },
    { 'value': 'shelter', 'label': 'Shelter/Housing' },
    { 'value': 'food', 'label': 'Food Supplies' },
    { 'value': 'medical', 'label': 'Medical Assistance' },
    { 'value': 'water', 'label': 'Clean Water' },
    { 'value': 'other', 'label': 'Other Assistance' },
  ];

  List<Map<String, dynamic>> _myRequests = [];
  bool _loadingRequests = false;
  Map<String, dynamic>? _selectedRequest;

  Future<void> _fetchMyRequests() async {
    setState(() { _loadingRequests = true; });
    final token = await _apiService.getToken();
    final url = Uri.parse('${ApiService.baseUrl}/victim/requests');
    try {
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        debugPrint('Fetched my requests: ' + data.toString()); // Debug print
        // Use currentFloodRequests from backend response
        final requests = (data['data'] != null && data['data']['currentFloodRequests'] is List)
            ? List<Map<String, dynamic>>.from(data['data']['currentFloodRequests'])
            : [];
        setState(() {
          _myRequests = List<Map<String, dynamic>>.from(requests);
        });
      } else {
        debugPrint('Failed to fetch my requests: status=${response.statusCode}, body=${response.body}');
      }
    } catch (e, st) {
      debugPrint('Failed to fetch my requests: $e\n$st');
    } finally {
      setState(() { _loadingRequests = false; });
    }
  }

  void _submitForm() async {
    debugPrint('Submitting victim request...');
    debugPrint('Title: "+_titleController.text.trim()+"');
    debugPrint('Message: "+_messageController.text.trim()+"');
    debugPrint('Urgency Level: "+(_urgencyLevel ?? "null")+"');
    debugPrint('Assistance Type: "+(_assistanceType ?? "null")+"');
    if (!_formKey.currentState!.validate()) {
      debugPrint('Form validation failed');
      return;
    }
    setState(() {
      _isSubmitting = true;
      _submitError = null;
    });
    final result = await _apiService.submitVictimRequest(
      title: _titleController.text.trim(),
      message: _messageController.text.trim(),
      emergencyLevel: _urgencyLevel!,
      needs: _assistanceType!,
    );
    debugPrint('API result: "+result.toString()+"');
    if (result['success'] == true) {
      setState(() {
        _isSubmitting = false;
        _submitSuccess = true;
        _titleController.clear();
        _messageController.clear();
        _urgencyLevel = null;
        _assistanceType = null;
      });
      await _fetchMyRequests();
    } else {
      setState(() {
        _isSubmitting = false;
        _submitError = result['message'] ?? 'Failed to submit request';
      });
      debugPrint('Submit error: "+(_submitError ?? "Unknown error")+"');
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchMyRequests();
  }

  Widget _buildMyRequestsCard(BuildContext context) {
    if (_loadingRequests) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_myRequests.isEmpty) {
      return const Center(child: Text('No requests placed yet.'));
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('My Requests', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ..._myRequests.map((req) => Card(
          margin: const EdgeInsets.symmetric(vertical: 8),
          color: Colors.white,
          child: ListTile(
            title: Text(req['victim_request_title'] ?? 'No Title'),
            subtitle: Text('Status: ${req['victim_request_status'] ?? 'N/A'}'),
            trailing: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0A2342), // dark blue
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                textStyle: const TextStyle(fontWeight: FontWeight.bold),
              ),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (ctx) => _buildRequestDetailsDialog(ctx, req),
                );
              },
              child: const Text('View'),
            ),
          ),
        )),
      ],
    );
  }

  Widget _buildRequestDetailsDialog(BuildContext context, Map<String, dynamic> req) {
    return AlertDialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: Row(
        children: [
          Icon(Icons.info_outline, color: Color(0xFF0A2342)),
          const SizedBox(width: 8),
          const Text('Request Details', style: TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
      content: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _detailRow('Title', req['victim_request_title']),
            _detailRow('Message', req['victim_request_message']),
            _detailRow('Urgency Level', req['emergency_level']),
            _detailRow('Needs', req['needs']),
            _detailRow('Status', req['victim_request_status']),
            _detailRow('Date', req['victim_request_date'] != null ? req['victim_request_date'].toString().split('T').first : ''),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          style: TextButton.styleFrom(
            foregroundColor: const Color(0xFF0A2342),
            textStyle: const TextStyle(fontWeight: FontWeight.bold),
          ),
          child: const Text('Close'),
        ),
      ],
    );
  }

  Widget _detailRow(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text('$label:', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0A2342))),
          ),
          Expanded(
            child: Text(value != null && value.toString().isNotEmpty ? value.toString() : '-', style: const TextStyle(color: Colors.black87)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      selectedIndex: 3,
      onItemSelected: (index) {
        if (index == 0) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const DashboardPage()),
          );
        } else if (index == 1) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const AnnouncementsPage()),
          );
        } else if (index == 2) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const SheltersPage()),
          );
        } else if (index == 3) {
          // Already on Inform Victims
        } else if (index == 4) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const SubsidyPage()),
          );
        } else if (index == 5) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const ContactPage()),
          );
        } else if (index == 6) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const ProfilePage()),
          );
        }
      },
      child: _buildInformVictimsContent(context),
    );
  }

  Widget _buildInformVictimsContent(BuildContext context) {
    if (_submitSuccess) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Inform Victims'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              if (Navigator.of(context).canPop()) {
                Navigator.of(context).pop();
              } else {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (context) => const DashboardPage()),
                );
              }
            },
          ),
        ),
        backgroundColor: const Color(0xFFF6F8FA), // light gray
        body: Center(
          child: Card(
            margin: const EdgeInsets.all(32),
            color: Colors.white, // card to white
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.check_circle, color: Colors.green[700], size: 48),
                  const SizedBox(height: 16),
                  const Text('Information Sent Successfully', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('Victims will be notified as soon as possible.'),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (context) => const DashboardPage()),
                    ),
                    child: const Text('Back to Home'),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inform Victims'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (context) => const DashboardPage()),
              );
            }
          },
        ),
      ),
      backgroundColor: const Color(0xFFF6F8FA), // light gray
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: Column(
            children: [
              _buildMyRequestsCard(context),
              const SizedBox(height: 32),
              Card(
                elevation: 2,
                color: Colors.white, // card to white
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Send Information to Victims', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 16),
                        if (_submitError != null)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Text(
                              _submitError == 'You already have a pending or approved request for this flood event'
                                  ? 'You have already placed a request for this flood event.'
                                  : _submitError!,
                              style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 16),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        TextFormField(
                          controller: _titleController,
                          decoration: const InputDecoration(labelText: 'Title *'),
                          validator: (v) => v == null || v.isEmpty ? 'Title is required' : null,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _messageController,
                          decoration: const InputDecoration(labelText: 'Message *'),
                          minLines: 3,
                          maxLines: 6,
                          validator: (v) => v == null || v.isEmpty ? 'Message is required' : null,
                        ),
                        const SizedBox(height: 16),
                        DropdownButtonFormField<String>(
                          value: _urgencyLevel,
                          decoration: const InputDecoration(labelText: 'Urgency Level *'),
                          isExpanded: true, // fix overflow
                          items: urgencyLevels.map((level) => DropdownMenuItem(
                            value: level['value'],
                            child: Text(level['label']!),
                          )).toList(),
                          onChanged: (v) => setState(() => _urgencyLevel = v),
                          validator: (v) => v == null || v.isEmpty ? 'Urgency level is required' : null,
                        ),
                        const SizedBox(height: 16),
                        DropdownButtonFormField<String>(
                          value: _assistanceType,
                          decoration: const InputDecoration(labelText: 'Type of Assistance *'),
                          isExpanded: true, // fix overflow
                          items: assistanceTypes.map((type) => DropdownMenuItem(
                            value: type['value'],
                            child: Text(type['label']!),
                          )).toList(),
                          onChanged: (v) => setState(() => _assistanceType = v),
                          validator: (v) => v == null || v.isEmpty ? 'Type of assistance is required' : null,
                        ),
                        const SizedBox(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            OutlinedButton(
                              onPressed: () => Navigator.of(context).pushReplacement(
                                MaterialPageRoute(builder: (context) => const DashboardPage()),
                              ),
                              child: const Text('Cancel'),
                            ),
                            const SizedBox(width: 12),
                            ElevatedButton(
                              onPressed: _isSubmitting ? null : _submitForm,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF0A2342),
                                foregroundColor: Colors.white,
                              ),
                              child: _isSubmitting
                                  ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                                  : const Text('Send'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
