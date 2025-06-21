import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'shelters_page.dart';
import 'inform_victims_page.dart';
import 'subsidy_page.dart';
import 'contact_page.dart';
import 'profile_page.dart';
import '../services/api_service.dart';

class AnnouncementsPage extends StatefulWidget {
  const AnnouncementsPage({super.key});

  @override
  State<AnnouncementsPage> createState() => _AnnouncementsPageState();
}

class _AnnouncementsPageState extends State<AnnouncementsPage> {
  late Future<List<Map<String, dynamic>>> _announcementsFuture;

  @override
  void initState() {
    super.initState();
    _announcementsFuture = ApiService().fetchCurrentFloodAnnouncementsForUser();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      selectedIndex: 1, // Announcements index
      onItemSelected: (index) {
        if (index == 0) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const DashboardPage()),
          );
        } else if (index == 1) {
          // Already on Announcements
        } else if (index == 2) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const SheltersPage()),
          );
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
          backgroundColor: Colors.white,
          elevation: 1,
          title: LayoutBuilder(
            builder: (context, constraints) {
              return Row(
                children: [
                  Flexible(child: Icon(Icons.announcement, color: Colors.blue[800], size: 28)),
                  const SizedBox(width: 8),
                  const Flexible(
                    child: Text(
                      'All Announcements',
                      style: TextStyle(color: Color(0xFF0A2342), fontWeight: FontWeight.bold, fontSize: 22),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              );
            },
          ),
          centerTitle: false,
        ),
        body: FutureBuilder<List<Map<String, dynamic>>>(
          future: _announcementsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return Center(child: Text('Failed to load announcements'));
            }
            final announcements = snapshot.data ?? [];
            if (announcements.isEmpty) {
              return const Center(child: Text('No announcements available.'));
            }
            // Group announcements by type
            final Map<String, List<Map<String, dynamic>>> grouped = {
              'Irrigation Department': announcements.where((a) => a['type'] == 'admin').toList(),
              'Gov Officer': announcements.where((a) => a['type'] == 'government_officer').toList(),
              'Grama Sevaka': announcements.where((a) => a['type'] == 'grama_sevaka').toList(),
            };
            return Padding(
              padding: const EdgeInsets.all(24.0),
              child: ListView.separated(
                itemCount: grouped.keys.length,
                separatorBuilder: (context, i) => const SizedBox(height: 28),
                itemBuilder: (context, i) {
                  final category = grouped.keys.elementAt(i);
                  final annList = grouped[category]!;
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        category,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0A2342),
                        ),
                      ),
                      const SizedBox(height: 10),
                      if (annList.isEmpty)
                        const Text('No announcements.'),
                      ...annList.map((ann) => _AnnouncementCard(
                            title: ann['title'] ?? '',
                            message: ann['description'] ?? '',
                            date: ann['date'] ?? '',
                          )),
                    ],
                  );
                },
              ),
            );
          },
        ),
      ),
    );
  }
}

class _AnnouncementCard extends StatelessWidget {
  final String title;
  final String message;
  final String date;

  const _AnnouncementCard({
    required this.title,
    required this.message,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: ListTile(
        leading: Icon(Icons.announcement, color: Colors.blue[700], size: 32),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(message),
            const SizedBox(height: 4),
            Text(date, style: const TextStyle(fontSize: 12, color: Colors.black54)),
          ],
        ),
      ),
    );
  }
}
