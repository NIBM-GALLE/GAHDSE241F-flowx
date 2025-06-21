import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';
import 'inform_victims_page.dart';
import 'contact_page.dart';
import 'profile_page.dart';
import '../services/subsidy_api_service.dart';

class SubsidyPage extends StatelessWidget {
  const SubsidyPage({Key? key}) : super(key: key);

  Future<List<Map<String, dynamic>>> _fetchSubsidies() async {
    final api = ApiService();
    try {
      return await api.fetchMySubsidies();
    } catch (_) {
      return [];
    }
  }

  void _showSubsidyDetails(BuildContext context, Map<String, dynamic> subsidy) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          backgroundColor: Colors.white,
          child: Container(
            constraints: const BoxConstraints(maxWidth: 400),
            padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 26),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.card_giftcard, color: Color(0xFF1A237E), size: 28),
                        const SizedBox(width: 10),
                        Text(
                          subsidy['subsidy_name'] ?? subsidy['title'] ?? '-',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1A237E),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.black54),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
                const Divider(height: 28, thickness: 1.2),
                _detailRow(Icons.monetization_on, 'Amount/Quantity',
                  subsidy['amount'] != null ? 'LKR ${subsidy['amount']}' : (subsidy['quantity'] != null ? 'Qty: ${subsidy['quantity']}' : '-'),
                  iconColor: Colors.green),
                _detailRow(Icons.event, 'Assigned Date', subsidy['assigned_date'] ?? subsidy['date'] ?? '-', iconColor: Colors.blueGrey),
                _detailRow(Icons.category, 'Category', subsidy['category'] ?? subsidy['subsidy_category'] ?? '-', iconColor: Colors.deepOrange),
                _detailRow(Icons.numbers, 'Quantity', subsidy['quantity']?.toString() ?? '-', iconColor: Colors.green),
                _detailRow(Icons.place, 'Collection Place', subsidy['collection_place'] ?? '-', iconColor: Colors.blue),
                _detailRow(Icons.verified, 'Status', subsidy['subsidies_status'] ?? subsidy['status'] ?? '-',
                  iconColor: (subsidy['subsidies_status'] == 'Approved' || subsidy['status'] == 'Approved') ? Colors.green : Colors.orange),
                _detailRow(Icons.home, 'House ID', subsidy['house_id']?.toString() ?? '-', iconColor: Colors.teal),
                _detailRow(Icons.confirmation_number, 'Subsidy ID', subsidy['subsidies_id']?.toString() ?? '-', iconColor: Colors.purple),
                _detailRow(Icons.person, 'Grama Sevaka',
                  (subsidy['grama_sevaka_first_name'] != null && subsidy['grama_sevaka_last_name'] != null)
                    ? '${subsidy['grama_sevaka_first_name']} ${subsidy['grama_sevaka_last_name']}'
                    : '-',
                  iconColor: Colors.indigo),
                _detailRow(Icons.phone, 'GS Phone', subsidy['grama_sevaka_phone_number'] ?? '-', iconColor: Colors.indigoAccent),
                _detailRow(Icons.location_city, 'House Address', subsidy['house_address'] ?? '-', iconColor: Colors.brown),
                _detailRow(Icons.water, 'Flood ID', subsidy['flood_id']?.toString() ?? '-', iconColor: Colors.lightBlue),
                if (subsidy['provider'] != null)
                  _detailRow(Icons.business, 'Provider', subsidy['provider'], iconColor: Colors.deepPurple),
                if (subsidy['location'] != null)
                  _detailRow(Icons.location_on, 'Location', subsidy['location'], iconColor: Colors.redAccent),
                if (subsidy['description'] != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 18.0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.info_outline, color: Colors.blueGrey, size: 22),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Description', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                              const SizedBox(height: 4),
                              Text(subsidy['description'], style: const TextStyle(fontSize: 14, color: Colors.black87)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 18),
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1A237E),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Close', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _detailRow(IconData icon, String label, String value, {Color iconColor = Colors.blueGrey}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Icon(icon, color: iconColor, size: 22),
          const SizedBox(width: 10),
          Text('$label: ', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          Expanded(
            child: Text(value, style: const TextStyle(fontSize: 15, color: Colors.black87)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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
        } else if (index == 6) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const ProfilePage()),
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
        body: FutureBuilder<List<Map<String, dynamic>>>(
          future: _fetchSubsidies(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              return const Center(child: Text('Failed to load subsidies'));
            }
            final subsidies = snapshot.data ?? [];
            if (subsidies.isEmpty) {
              return const Center(
                child: Text('No subsidies for you',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black54)),
              );
            }
            return ListView(
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
                                            subsidy['subsidy_name'] ?? subsidy['title'] ?? '-',
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
                                                (subsidy['amount'] != null ? 'LKR ${subsidy['amount']}' : subsidy['quantity'] != null ? 'Qty: ${subsidy['quantity']}' : '-'),
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
                                                'Assigned: ${subsidy['assigned_date'] ?? subsidy['date'] ?? '-'}',
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
                                                'Status: ${subsidy['subsidies_status'] ?? subsidy['status'] ?? '-'}',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  color: (subsidy['subsidies_status'] == 'Approved' || subsidy['status'] == 'Approved')
                                                      ? Colors.green
                                                      : Colors.orange,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 12),
                                          Align(
                                            alignment: Alignment.centerRight,
                                            child: ElevatedButton.icon(
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: const Color(0xFF1A237E),
                                                shape: RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.circular(10),
                                                ),
                                                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                                              ),
                                              icon: const Icon(Icons.visibility, color: Colors.white, size: 20),
                                              label: const Text('View', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                              onPressed: () => _showSubsidyDetails(context, subsidy),
                                            ),
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
            );
          },
        ),
      ),
    );
  }
}
