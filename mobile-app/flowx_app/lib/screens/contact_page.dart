import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';
import 'inform_victims_page.dart';
import 'subsidy_page.dart';
import 'profile_page.dart';

class ContactPage extends StatelessWidget {
  const ContactPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final emergencyContacts = [
      {
        'name': 'National Emergency Hotline',
        'number': '1190',
        'description': 'For all life-threatening emergencies',
        'available': '24/7',
        'icon': Icons.warning,
        'iconColor': Colors.red,
      },
      {
        'name': 'Disaster Management Center',
        'number': '117',
        'description': 'Flood-related emergencies and information',
        'available': '24/7',
        'icon': Icons.shield,
        'iconColor': Colors.blue,
      },
      {
        'name': 'Red Cross Ambulance',
        'number': '1100',
        'description': 'Medical emergencies and ambulance service',
        'available': '24/7',
        'icon': Icons.favorite,
        'iconColor': Colors.red,
      },
    ];

    final supportServices = [
      {
        'service': 'Psychological Support',
        'contact': '1333',
        'description': 'Mental health support for disaster victims',
        'available': '8:00 AM - 8:00 PM',
        'icon': Icons.groups,
        'iconColor': Colors.purple,
      },
      {
        'service': 'Women & Child Protection',
        'contact': '1938',
        'description': 'Support for vulnerable women and children',
        'available': '24/7',
        'icon': Icons.shield,
        'iconColor': Colors.pink,
      },
      {
        'service': 'Elderly Care Hotline',
        'contact': '1920',
        'description': 'Special assistance for elderly citizens',
        'available': '8:00 AM - 8:00 PM',
        'icon': Icons.favorite,
        'iconColor': Colors.orange,
      },
    ];

    return AppScaffold(
      selectedIndex: 5, // Contact Info index
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
          // Already on Contact Info
        } else if (index == 6) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const ProfilePage()),
          );
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F6FA),
        appBar: AppBar(
          title: const Text('Emergency Contacts'),
          elevation: 0,
          centerTitle: true,
        ),
        body: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Center(
              child: Container(
                constraints: const BoxConstraints(maxWidth: 700),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Contact Information',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1A237E),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Important numbers and contacts for flood emergencies',
                      style: TextStyle(fontSize: 15, color: Colors.black54),
                    ),
                    const SizedBox(height: 24),
                    // Emergency Contacts
                    Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 2,
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(18.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: const [
                                Icon(Icons.warning, color: Colors.red, size: 24),
                                SizedBox(width: 8),
                                Flexible(
                                  child: Text('Emergency Hotlines', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18), overflow: TextOverflow.ellipsis),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            ...emergencyContacts.map((contact) => Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Icon(contact['icon'] as IconData, color: contact['iconColor'] as Color, size: 20),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(contact['name'] as String, style: const TextStyle(fontWeight: FontWeight.w600)),
                                            Text(contact['description'] as String, style: const TextStyle(fontSize: 13, color: Colors.black54)),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Text(contact['number'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                          Text(contact['available'] as String, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                                        ],
                                      ),
                                    ],
                                  ),
                                )),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Support Services
                    Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 2,
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(18.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: const [
                                Icon(Icons.groups, color: Colors.green, size: 24),
                                SizedBox(width: 8),
                                Flexible(
                                  child: Text('Support Services', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18), overflow: TextOverflow.ellipsis),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            ...supportServices.map((service) => Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Icon(service['icon'] as IconData, color: service['iconColor'] as Color, size: 20),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(service['service'] as String, style: const TextStyle(fontWeight: FontWeight.w600)),
                                            Text(service['description'] as String, style: const TextStyle(fontSize: 13, color: Colors.black54)),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Text(service['contact'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                          Text(service['available'] as String, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                                        ],
                                      ),
                                    ],
                                  ),
                                )),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Additional Information
                    Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(18.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: const [
                                Icon(Icons.info, color: Colors.blue, size: 24),
                                SizedBox(width: 8),
                                Text('Additional Information', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: const [
                                Icon(Icons.email, color: Colors.blue, size: 18),
                                SizedBox(width: 6),
                                Text('Email Contacts', style: TextStyle(fontWeight: FontWeight.w600)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text('General Inquiries: floodhelp@disaster.gov.lk', style: TextStyle(fontSize: 13)),
                            const Text('Volunteer Coordination: floodvolunteers@redcross.lk', style: TextStyle(fontSize: 13)),
                            const Text('Donations: flooddonations@disaster.gov.lk', style: TextStyle(fontSize: 13)),
                            const SizedBox(height: 12),
                            Row(
                              children: const [
                                Icon(Icons.location_on, color: Colors.blue, size: 18),
                                SizedBox(width: 6),
                                Text('Regional Offices', style: TextStyle(fontWeight: FontWeight.w600)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text('Western Province: 123 Disaster Management Rd, Colombo', style: TextStyle(fontSize: 13)),
                            const Text('Southern Province: 456 Flood Relief Ave, Galle', style: TextStyle(fontSize: 13)),
                            const Text('Central Province: 789 Emergency Lane, Kandy', style: TextStyle(fontSize: 13)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
