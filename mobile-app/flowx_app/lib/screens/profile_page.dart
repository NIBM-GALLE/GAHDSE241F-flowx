import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';
import 'inform_victims_page.dart';
import 'subsidy_page.dart';
import 'contact_page.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Dummy user profile data
    final profile = {
      'firstName': 'Chamindu',
      'lastName': 'Induwara',
      'email': 'chamindu@example.com',
      'phone': '077-1234567',
      'address': '123 Main Street, Galle',
      'nic': '123456789V',
      'role': 'General User',
      'joinDate': '2024-01-15',
      'emergencyContact': '071-9876543',
      'houseId': 'H-001',
      'district': 'Galle',
      'division': 'Galle DS',
      'grama': 'Galle GN',
    };

    return AppScaffold(
      selectedIndex: 6, // Profile index
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
          // Already on Profile
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F6FA),
        appBar: AppBar(
          title: const Text('My Profile'),
          elevation: 0,
          centerTitle: true,
          backgroundColor: Colors.transparent,
        ),
        body: Center(
          child: SingleChildScrollView(
            child: Container(
              constraints: const BoxConstraints(maxWidth: 500),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 32),
              child: Card(
                elevation: 6,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                color: Colors.white,
                child: Stack(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // Avatar and Name
                          CircleAvatar(
                            radius: 54,
                            backgroundColor: Colors.blue[50],
                            child: Text(
                              profile['firstName']![0] + profile['lastName']![0],
                              style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Color(0xFF0A2342)),
                            ),
                          ),
                          const SizedBox(height: 18),
                          Text(
                            '${profile['firstName']} ${profile['lastName']}',
                            style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF0A2342)),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.blue[100],
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              profile['role']!,
                              style: const TextStyle(fontSize: 15, color: Color(0xFF0A2342), fontWeight: FontWeight.w600),
                            ),
                          ),
                          const SizedBox(height: 24),
                          const SizedBox(height: 12),
                          Divider(color: Colors.blue[50], thickness: 1.2),
                          const SizedBox(height: 18),
                          // Info grid
                          Wrap(
                            runSpacing: 18,
                            spacing: 24,
                            children: [
                              _ProfileInfoRow(icon: Icons.email, label: 'Email', value: profile['email']!),
                              _ProfileInfoRow(icon: Icons.phone, label: 'Phone', value: profile['phone']!),
                              _ProfileInfoRow(icon: Icons.contact_emergency, label: 'Emergency Contact', value: profile['emergencyContact']!),
                              _ProfileInfoRow(icon: Icons.badge, label: 'NIC', value: profile['nic']!),
                              _ProfileInfoRow(icon: Icons.home, label: 'House ID', value: profile['houseId']!),
                              _ProfileInfoRow(icon: Icons.location_on, label: 'Address', value: profile['address']!),
                              _ProfileInfoRow(icon: Icons.map, label: 'District', value: profile['district']!),
                              _ProfileInfoRow(icon: Icons.account_balance, label: 'Divisional Secretariat', value: profile['division']!),
                              _ProfileInfoRow(icon: Icons.account_tree, label: 'Grama Niladhari Division', value: profile['grama']!),
                              _ProfileInfoRow(icon: Icons.calendar_today, label: 'Member Since', value: profile['joinDate']!),
                            ],
                          ),
                        ],
                      ),
                    ),
                    // Floating circular edit button (top right, dark blue)
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Material(
                        color: Colors.transparent,
                        child: CircleAvatar(
                          radius: 22,
                          backgroundColor: Color(0xFF0A2342), // dark blue
                          child: IconButton(
                            icon: const Icon(Icons.edit, color: Colors.white), // white pencil
                            tooltip: 'Edit Profile',
                            onPressed: () {
                              showModalBottomSheet(
                                context: context,
                                isScrollControlled: true,
                                shape: const RoundedRectangleBorder(
                                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                                ),
                                builder: (context) => Padding(
                                  padding: EdgeInsets.only(
                                    left: 24,
                                    right: 24,
                                    top: 32,
                                    bottom: MediaQuery.of(context).viewInsets.bottom + 24,
                                  ),
                                  child: _EditProfileForm(profile: profile),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// Modern info row with icon
class _ProfileInfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _ProfileInfoRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 210,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.blueAccent, size: 22),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                const SizedBox(height: 2),
                Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Edit Profile Modal Form (demo, not persistent)
class _EditProfileForm extends StatefulWidget {
  final Map<String, String> profile;
  const _EditProfileForm({required this.profile});

  @override
  State<_EditProfileForm> createState() => _EditProfileFormState();
}

class _EditProfileFormState extends State<_EditProfileForm> {
  late TextEditingController firstName;
  late TextEditingController lastName;
  late TextEditingController email;
  late TextEditingController phone;
  late TextEditingController address;
  late TextEditingController emergencyContact;

  @override
  void initState() {
    super.initState();
    firstName = TextEditingController(text: widget.profile['firstName']);
    lastName = TextEditingController(text: widget.profile['lastName']);
    email = TextEditingController(text: widget.profile['email']);
    phone = TextEditingController(text: widget.profile['phone']);
    address = TextEditingController(text: widget.profile['address']);
    emergencyContact = TextEditingController(text: widget.profile['emergencyContact']);
  }

  @override
  void dispose() {
    firstName.dispose();
    lastName.dispose();
    email.dispose();
    phone.dispose();
    address.dispose();
    emergencyContact.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Edit Profile', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 18),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: firstName,
                  decoration: const InputDecoration(labelText: 'First Name'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: lastName,
                  decoration: const InputDecoration(labelText: 'Last Name'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: email,
            decoration: const InputDecoration(labelText: 'Email'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: phone,
            decoration: const InputDecoration(labelText: 'Phone Number'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: emergencyContact,
            decoration: const InputDecoration(labelText: 'Emergency Contact'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: address,
            decoration: const InputDecoration(labelText: 'Address'),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Cancel'),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: () {
                  // For demo: just pop and show a snackbar
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Profile updated (demo only)')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Save'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
