import 'package:flutter/material.dart';
import 'app_scaffold.dart';
import 'sidebar.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';
import 'inform_victims_page.dart';
import 'subsidy_page.dart';
import 'contact_page.dart';
import 'profile_page.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      selectedIndex: 0, // Dashboard index
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
          title: Row(
            children: [
              Icon(Icons.water_drop, color: Colors.blue[800], size: 28),
              const SizedBox(width: 8),
              const Text(
                'Flood Risk Dashboard',
                style: TextStyle(color: Color(0xFF0A2342), fontWeight: FontWeight.bold, fontSize: 22),
              ),
            ],
          ),
          centerTitle: false,
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Flood Risk Card - Redesigned
                Center(
                  child: Container(
                    width: 340,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.blue.withOpacity(0.08),
                          blurRadius: 18,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Flexible(
                              child: Icon(Icons.water_drop, color: Colors.blue[700], size: 38),
                            ),
                            const SizedBox(width: 10),
                            const Flexible(
                              child: Text(
                                'Current Flood Risk',
                                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0A2342)),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 18),
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 24),
                          decoration: BoxDecoration(
                            color: Colors.orange.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Text(
                            'MODERATE',
                            style: TextStyle(
                              color: Colors.orange,
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                              letterSpacing: 2,
                            ),
                          ),
                        ),
                        const SizedBox(height: 18),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: const [
                            _RiskStat(icon: Icons.map, label: 'Flood Area', value: '2.5 km²', color: Colors.blue),
                            _RiskStat(icon: Icons.shield, label: 'Safe Area', value: '7.5 km²', color: Colors.green),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: const [
                            _RiskStat(icon: Icons.percent, label: 'Flood %', value: '25%', color: Colors.deepPurple),
                            _RiskStat(icon: Icons.timer, label: 'Recovery', value: '5 days', color: Colors.redAccent),
                          ],
                        ),
                        const SizedBox(height: 18),
                        const Text('Last updated: 2025-06-13', style: TextStyle(fontSize: 13, color: Colors.black54)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                // Tabs for Announcements and Subsidies
                DefaultTabController(
                  length: 2,
                  child: Column(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withOpacity(0.08),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const TabBar(
                          labelColor: Color(0xFF0A2342),
                          unselectedLabelColor: Colors.black54,
                          indicatorColor: Color(0xFF0A2342),
                          labelStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          tabs: [
                            Tab(text: 'Announcements'),
                            Tab(text: 'Subsidies'),
                          ],
                        ),
                      ),
                      SizedBox(
                        height: 260,
                        child: TabBarView(
                          children: [
                            // Announcements Tab
                            ListView(
                              padding: const EdgeInsets.only(top: 12),
                              children: [
                                _AnnouncementCard(
                                  type: 'warning',
                                  title: 'Heavy Rainfall Alert',
                                  message: 'Expect heavy rainfall in Colombo and surrounding areas within the next 24 hours.',
                                  date: '2025-06-10',
                                ),
                                _AnnouncementCard(
                                  type: 'info',
                                  title: 'Relief Camp Setup',
                                  message: 'A new relief camp has been set up at Galle Town Hall.',
                                  date: '2025-06-09',
                                ),
                                _AnnouncementCard(
                                  type: 'general',
                                  title: 'Donation Drive',
                                  message: 'We are organizing a donation drive. Volunteers are welcome!',
                                  date: '2025-06-08',
                                ),
                              ],
                            ),
                            // Subsidies Tab
                            ListView(
                              padding: const EdgeInsets.only(top: 12),
                              children: [
                                _SubsidyCard(
                                  title: 'Emergency Relief Fund',
                                  description: 'Immediate financial aid for affected families',
                                  amount: 'LKR 25,000',
                                  eligibility: 'Flood-affected residents of Galle',
                                ),
                                _SubsidyCard(
                                  title: 'Agricultural Loss Compensation',
                                  description: 'Compensation for crop damages due to flooding',
                                  amount: 'LKR 50,000',
                                  eligibility: 'Registered farmers in Southern Province',
                                ),
                                _SubsidyCard(
                                  title: 'Housing Repair Grant',
                                  description: 'Financial assistance for home repairs after flood damage',
                                  amount: 'LKR 75,000',
                                  eligibility: 'Homeowners with verified flood damage',
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AnnouncementCard extends StatelessWidget {
  final String type;
  final String title;
  final String message;
  final String date;

  const _AnnouncementCard({
    required this.type,
    required this.title,
    required this.message,
    required this.date,
  });

  @override
  Widget build(BuildContext context) {
    Color iconColor;
    IconData iconData;
    switch (type) {
      case 'warning':
        iconColor = Colors.orange;
        iconData = Icons.warning_amber_rounded;
        break;
      case 'info':
        iconColor = Colors.blue;
        iconData = Icons.info_outline;
        break;
      default:
        iconColor = Colors.green;
        iconData = Icons.campaign_outlined;
    }
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: Icon(iconData, color: iconColor, size: 32),
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

class _SubsidyCard extends StatelessWidget {
  final String title;
  final String description;
  final String amount;
  final String eligibility;

  const _SubsidyCard({
    required this.title,
    required this.description,
    required this.amount,
    required this.eligibility,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: Icon(Icons.volunteer_activism, color: Colors.blue[700], size: 32),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(description),
            const SizedBox(height: 4),
            Text('Amount: $amount', style: const TextStyle(fontSize: 13)),
            Text('Eligibility: $eligibility', style: const TextStyle(fontSize: 13)),
          ],
        ),
      ),
    );
  }
}

class _RiskStat extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _RiskStat({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: color, size: 22),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 13, color: Colors.black54)),
        Text(value, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: color)),
      ],
    );
  }
}
