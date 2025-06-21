import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/api_service.dart';

class ShelterDetailPage extends StatelessWidget {
  final String name;
  final String location;
  final String capacity;
  final String status;
  final String contact;
  final double latitude;
  final double longitude;
  final String? floodName;
  final String? startDate;
  final String? endDate;
  final String shelterId;
  final String divisionalSecretariatId;
  final String? shelterHouseId;

  const ShelterDetailPage({
    super.key,
    required this.name,
    required this.location,
    required this.capacity,
    required this.status,
    required this.contact,
    required this.latitude,
    required this.longitude,
    this.floodName,
    this.startDate,
    this.endDate,
    required this.shelterId,
    required this.divisionalSecretariatId,
    this.shelterHouseId,
  });

  @override
  Widget build(BuildContext context) {
    final isAvailable = status == 'Available';
    return Scaffold(
      appBar: AppBar(
        title: Text(name),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0A2342),
        elevation: 1,
      ),
      backgroundColor: const Color(0xFFF6F8FA),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: FlutterMap(
                    options: MapOptions(
                      center: LatLng(latitude, longitude),
                      zoom: 15,
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        subdomains: const ['a', 'b', 'c'],
                        userAgentPackageName: 'com.example.app',
                      ),
                      MarkerLayer(
                        markers: [
                          Marker(
                            width: 40,
                            height: 40,
                            point: LatLng(latitude, longitude),
                            child: const Icon(Icons.location_on, color: Colors.red, size: 40),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Icon(Icons.location_on, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Expanded(child: Text(location, style: const TextStyle(fontSize: 16))),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.people, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Text('Capacity: $capacity'),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.phone, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Text(contact),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.verified, color: isAvailable ? Colors.green : Colors.red),
                  const SizedBox(width: 8),
                  Text(
                    status,
                    style: TextStyle(
                      color: isAvailable ? Colors.green : Colors.red,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.home, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Text('Shelter ID: $shelterId'),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.location_city, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Text('Divisional Secretariat ID: $divisionalSecretariatId'),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.house, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Text('Shelter House ID: ${shelterHouseId ?? "-"}'),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.water_drop, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Text(floodName != null ? 'Flood: $floodName' : 'No flood assigned'),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.calendar_today, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Text(startDate != null ? 'Start: $startDate' : 'No start date'),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.calendar_today, color: Colors.blue[700]),
                  const SizedBox(width: 8),
                  Text(endDate != null ? 'End: $endDate' : 'Ongoing'),
                ],
              ),
              const SizedBox(height: 32), // Add spacing before the button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isAvailable
                      ? () {
                          showDialog(
                            context: context,
                            builder: (context) {
                              final _titleController = TextEditingController();
                              final _reasonController = TextEditingController();
                              final _needsController = TextEditingController();
                              String? _emergencyLevel;
                              final _formKey = GlobalKey<FormState>();
                              return AlertDialog(
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                title: const Text('Apply for Shelter', style: TextStyle(fontWeight: FontWeight.bold)),
                                content: Form(
                                  key: _formKey,
                                  child: SingleChildScrollView(
                                    child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        TextFormField(
                                          controller: _titleController,
                                          decoration: const InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
                                          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                                        ),
                                        const SizedBox(height: 12),
                                        TextFormField(
                                          controller: _reasonController,
                                          decoration: const InputDecoration(labelText: 'Reason', border: OutlineInputBorder()),
                                          minLines: 2,
                                          maxLines: 4,
                                          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                                        ),
                                        const SizedBox(height: 12),
                                        TextFormField(
                                          controller: _needsController,
                                          decoration: const InputDecoration(labelText: 'Special Needs', border: OutlineInputBorder()),
                                          minLines: 1,
                                          maxLines: 3,
                                          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                                        ),
                                        const SizedBox(height: 12),
                                        DropdownButtonFormField<String>(
                                          value: _emergencyLevel,
                                          decoration: const InputDecoration(labelText: 'Emergency Level', border: OutlineInputBorder()),
                                          items: const [
                                            DropdownMenuItem(value: 'low', child: Text('Low')),
                                            DropdownMenuItem(value: 'medium', child: Text('Medium')),
                                            DropdownMenuItem(value: 'high', child: Text('High')),
                                          ],
                                          onChanged: (val) {
                                            _emergencyLevel = val;
                                          },
                                          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.of(context).pop(),
                                    child: const Text('Cancel'),
                                  ),
                                  ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF0A2342),
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                    ),
                                    onPressed: () async {
                                      if (_formKey.currentState!.validate()) {
                                        Navigator.of(context).pop();
                                        try {
                                          await ApiService().requestShelter(
                                            title: _titleController.text,
                                            message: _reasonController.text,
                                            needs: _needsController.text,
                                            emergencyLevel: _emergencyLevel!,
                                          );
                                          showDialog(
                                            context: context,
                                            builder: (context) => AlertDialog(
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                              title: const Text('Success', style: TextStyle(color: Color(0xFF0A2342), fontWeight: FontWeight.bold)),
                                              content: const Text('Your shelter application has been submitted.'),
                                              actions: [
                                                TextButton(
                                                  onPressed: () => Navigator.of(context).pop(),
                                                  child: const Text('OK'),
                                                ),
                                              ],
                                            ),
                                          );
                                        } catch (e) {
                                          showDialog(
                                            context: context,
                                            builder: (context) => AlertDialog(
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                              title: const Text('Error', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                                              content: Text('Failed to submit shelter request. $e'),
                                              actions: [
                                                TextButton(
                                                  onPressed: () => Navigator.of(context).pop(),
                                                  child: const Text('OK'),
                                                ),
                                              ],
                                            ),
                                          );
                                        }
                                      }
                                    },
                                    child: const Text('Submit'),
                                  ),
                                ],
                              );
                            },
                          );
                        }
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A2342),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text('Apply for Shelter', style: TextStyle(fontSize: 18)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
