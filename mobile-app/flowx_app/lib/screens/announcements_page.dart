import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'shelters_page.dart';

class AnnouncementsPage extends StatelessWidget {
  const AnnouncementsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = [
      'Irrigation Department',
      'Gov Officer',
      'Grama Sevaka',
    ];
    final Map<String, List<Map<String, String>>> announcements = {
      'Irrigation Department': [
        {
          'title': 'Water Level Rising',
          'message': 'Water level in Kelani river is rising rapidly. Stay alert.',
          'date': '2025-06-13',
        },
        {
          'title': 'Flood Gate Release',
          'message': 'Flood gates will be opened at 3pm today.',
          'date': '2025-06-12',
        },
      ],
      'Gov Officer': [
        {
          'title': 'Relief Camp Setup',
          'message': 'New relief camp at Galle Town Hall.',
          'date': '2025-06-11',
        },
        {
          'title': 'Medical Camp',
          'message': 'Free medical camp for flood victims.',
          'date': '2025-06-10',
        },
      ],
      'Grama Sevaka': [
        {
          'title': 'Food Distribution',
          'message': 'Food packs will be distributed at the community center.',
          'date': '2025-06-09',
        },
        {
          'title': 'Volunteer Meeting',
          'message': 'Meeting for all volunteers at 5pm.',
          'date': '2025-06-08',
        },
      ],
    };

    return AppScaffold(
      selectedIndex: 1, // Announcements index
      onItemSelected: (index) {
        if (index == 0) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const DashboardPage()),
          );
        } else if (index == 1) {
          // Already on Shelters, do nothing
        } else if (index == 2) {
            Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (context) => const SheltersPage()),
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
        body: Padding(
          padding: const EdgeInsets.all(24.0),
          child: ListView.separated(
            itemCount: categories.length,
            separatorBuilder: (context, i) => const SizedBox(height: 28),
            itemBuilder: (context, i) {
              final category = categories[i];
              final annList = announcements[category]!;
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
                  ...annList.map((ann) => _AnnouncementCard(
                        title: ann['title']!,
                        message: ann['message']!,
                        date: ann['date']!,
                      )),
                ],
              );
            },
          ),
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
