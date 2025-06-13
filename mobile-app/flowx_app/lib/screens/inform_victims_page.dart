import 'package:flutter/material.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';

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

  void _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isSubmitting = true;
      _submitError = null;
    });
    await Future.delayed(const Duration(seconds: 1)); // Simulate API call
    setState(() {
      _isSubmitting = false;
      _submitSuccess = true;
    });
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
          child: Card(
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
                        child: Text(_submitError!, style: const TextStyle(color: Colors.red)),
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
        ),
      ),
    );
  }
}
