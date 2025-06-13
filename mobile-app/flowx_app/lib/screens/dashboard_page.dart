import 'package:flutter/material.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Flood Risk Dashboard',
          style: TextStyle(color: Color(0xFF0A2342), fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Flood Risk Card
            Card(
              color: const Color(0xFFe3eafc),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    Icon(Icons.water_drop, color: Colors.blue[800], size: 40),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('Current Flood Risk', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0A2342))),
                          SizedBox(height: 8),
                          Text('Moderate risk in your area', style: TextStyle(fontSize: 16, color: Colors.orange)),
                          SizedBox(height: 4),
                          Text('Predicted Flood Area: 2.5 km²', style: TextStyle(fontSize: 14, color: Colors.black87)),
                          SizedBox(height: 2),
                          Text('Safe Area: 7.5 km²', style: TextStyle(fontSize: 14, color: Colors.black87)),
                          SizedBox(height: 2),
                          Text('Flood Percentage: 25%', style: TextStyle(fontSize: 14, color: Colors.black87)),
                          SizedBox(height: 2),
                          Text('Estimated Recovery Days: 5', style: TextStyle(fontSize: 14, color: Colors.black87)),
                          SizedBox(height: 4),
                          Text('Last updated: 2025-06-13', style: TextStyle(fontSize: 12, color: Colors.black54)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Tabs for Announcements and Subsidies
            DefaultTabController(
              length: 2,
              child: Column(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const TabBar(
                      labelColor: Color(0xFF0A2342),
                      unselectedLabelColor: Colors.black54,
                      indicatorColor: Color(0xFF0A2342),
                      tabs: [
                        Tab(text: 'Announcements'),
                        Tab(text: 'Subsidies'),
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 220,
                    child: TabBarView(
                      children: [
                        // Announcements Tab
                        ListView(
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
