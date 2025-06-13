import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelter_detail_page.dart';
import 'inform_victims_page.dart';
import 'subsidy_page.dart';
import 'contact_page.dart';

class SheltersPage extends StatelessWidget {
  const SheltersPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Dummy shelter data
    final List<Map<String, String>> shelters = [
      {
        'name': 'Galle Town Hall Shelter',
        'location': 'Galle Town Hall, Main Street, Galle',
        'capacity': '150',
        'status': 'Available',
        'contact': '077-1234567',
      },
      {
        'name': 'Community Center Shelter',
        'location': 'Community Center, Matara Road, Galle',
        'capacity': '100',
        'status': 'Full',
        'contact': '077-9876543',
      },
      {
        'name': 'School Auditorium Shelter',
        'location': 'School Auditorium, Colombo Road, Galle',
        'capacity': '200',
        'status': 'Available',
        'contact': '071-5555555',
      },
    ];

    return AppScaffold(
      selectedIndex: 2, // Shelters index (0: Dashboard, 1: Announcements, 2: Safe Shelters)
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
          // Already on Shelters, do nothing
        } else if (index == 3) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const InformVictimsPage()),
          );
        } else if (index == 4) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const SubsidyPage()),
          );
        } else if (index == 5) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const ContactPage()),
          );
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF6F8FA),
        appBar: AppBar(
          title: const Text('Safe Shelters'),
          centerTitle: true,
          elevation: 0,
        ),
        body: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: shelters.length,
          itemBuilder: (context, index) {
            final shelter = shelters[index];
            return _ShelterCard(
              name: shelter['name']!,
              location: shelter['location']!,
              capacity: shelter['capacity']!,
              status: shelter['status']!,
              contact: shelter['contact']!,
              onView: () {
                // Dummy coordinates for demo
                final coords = {
                  'Galle Town Hall Shelter': [6.0367, 80.2170],
                  'Community Center Shelter': [6.0400, 80.2100],
                  'School Auditorium Shelter': [6.0450, 80.2200],
                };
                final latLng = coords[shelter['name']!] ?? [6.0367, 80.2170];
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => ShelterDetailPage(
                      name: shelter['name']!,
                      location: shelter['location']!,
                      capacity: shelter['capacity']!,
                      status: shelter['status']!,
                      contact: shelter['contact']!,
                      latitude: latLng[0],
                      longitude: latLng[1],
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}

class _ShelterCard extends StatelessWidget {
  final String name;
  final String location;
  final String capacity;
  final String status;
  final String contact;
  final VoidCallback onView;

  const _ShelterCard({
    required this.name,
    required this.location,
    required this.capacity,
    required this.status,
    required this.contact,
    required this.onView,
  });

  @override
  Widget build(BuildContext context) {
    final isAvailable = status == 'Available';
    return Card(
      color: Colors.white, // card background white
      margin: const EdgeInsets.symmetric(vertical: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(18.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.home, color: isAvailable ? Colors.blue[700] : Colors.grey[600], size: 32),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    name,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isAvailable ? Colors.blue[50] : Colors.grey[200],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    status,
                    style: TextStyle(
                      color: isAvailable ? Colors.blue[800] : Colors.grey[700],
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                const Icon(Icons.location_on, size: 18, color: Colors.black54),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(location, style: const TextStyle(color: Colors.black87)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.people, size: 18, color: Colors.black54),
                const SizedBox(width: 6),
                Text('Capacity: $capacity'),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.phone, size: 18, color: Colors.black54),
                const SizedBox(width: 6),
                Text(contact),
              ],
            ),
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                onPressed: onView,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0A2342),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                ),
                child: const Text('View'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
