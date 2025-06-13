import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';
import 'inform_victims_page.dart';
import 'contact_page.dart';

class SubsidyPage extends StatelessWidget {
  const SubsidyPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final subsidies = [
      {
        'title': 'Flood Relief Grant',
        'amount': 'LKR 25,000',
        'status': 'Approved',
        'date': '2025-06-10',
      },
      {
        'title': 'Housing Repair Assistance',
        'amount': 'LKR 50,000',
        'status': 'Pending',
        'date': '2025-06-12',
      },
    ];

    return AppScaffold(
      selectedIndex: 4,
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
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const InformVictimsPage()),
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
          title: const Text('Subsidies'),
          elevation: 0,
          centerTitle: true,
        ),
        body: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Center(
              child: Container(
                constraints: const BoxConstraints(maxWidth: 500),
                child: Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                  elevation: 4,
                  color: Colors.white,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 28.0, horizontal: 22.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Assigned Subsidies',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1A237E),
                          ),
                        ),
                        const SizedBox(height: 18),
                        ...subsidies.map((subsidy) => Padding(
                              padding: const EdgeInsets.only(bottom: 18.0),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF5F6FA),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        subsidy['title']!,
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF1A237E),
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          const Icon(Icons.monetization_on, color: Colors.green, size: 18),
                                          const SizedBox(width: 6),
                                          Text(
                                            subsidy['amount']!,
                                            style: const TextStyle(fontSize: 15, color: Colors.black87),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: [
                                          const Icon(Icons.event, color: Colors.blueGrey, size: 18),
                                          const SizedBox(width: 6),
                                          Text(
                                            'Assigned: ${subsidy['date']}',
                                            style: const TextStyle(fontSize: 14, color: Colors.black54),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: [
                                          const Icon(Icons.verified, color: Colors.blue, size: 18),
                                          const SizedBox(width: 6),
                                          Text(
                                            'Status: ${subsidy['status']}',
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: subsidy['status'] == 'Approved'
                                                  ? Colors.green
                                                  : Colors.orange,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            )),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
