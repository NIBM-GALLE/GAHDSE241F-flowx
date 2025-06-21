import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelter_detail_page.dart';
import 'inform_victims_page.dart';
import 'subsidy_page.dart';
import 'contact_page.dart';
import 'profile_page.dart';
import '../services/api_service.dart';

class SheltersPage extends StatelessWidget {
  const SheltersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Map<String, dynamic>>>(
      future: ApiService().fetchShelters(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            backgroundColor: Color(0xFFF6F8FA),
            body: Center(child: CircularProgressIndicator()),
          );
        }
        if (snapshot.hasError) {
          print('SheltersPage error: \\${snapshot.error}');
          return const Scaffold(
            backgroundColor: Color(0xFFF6F8FA),
            body: Center(child: Text('Failed to load shelters')),
          );
        }
        final shelters = snapshot.data ?? [];
        return AppScaffold(
          selectedIndex: 2,
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
            } else if (index == 6) {
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (context) => const ProfilePage()),
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
                  name: shelter['shelter_name'] ?? '-',
                  location: shelter['shelter_address'] ?? '-',
                  capacity: (shelter['shelter_size'] ?? '').toString(),
                  status: (shelter['available'] == 1 || shelter['available'] == true) ? 'Available' : 'Full',
                  contact: shelter['contact'] ?? '-',
                  onView: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => ShelterDetailPage(
                          name: shelter['shelter_name'] ?? '-',
                          location: shelter['shelter_address'] ?? '-',
                          capacity: (shelter['shelter_size'] ?? '').toString(),
                          status: (shelter['available'] == 1 || shelter['available'] == true) ? 'Available' : 'Full',
                          contact: shelter['contact'] ?? '-',
                          latitude: shelter['latitude'] ?? 0.0,
                          longitude: shelter['longitude'] ?? 0.0,
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        );
      },
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
