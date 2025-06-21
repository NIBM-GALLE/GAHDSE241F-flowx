import 'package:flutter/material.dart';
import 'sidebar.dart';
import 'app_scaffold.dart';
import 'dashboard_page.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';
import 'inform_victims_page.dart';
import 'subsidy_page.dart';
import 'contact_page.dart';
import '../services/api_service.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>?>(
      future: ApiService().fetchUserProfile(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            backgroundColor: Color(0xFFF5F6FA),
            body: Center(child: CircularProgressIndicator()),
          );
        }
        if (!snapshot.hasData || snapshot.data == null) {
          return Scaffold(
            backgroundColor: const Color(0xFFF5F6FA),
            body: const Center(child: Text('Failed to load profile')),
          );
        }
        final profile = snapshot.data!;

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
                                  (profile['first_name'] ?? ' ')[0] + (profile['last_name'] ?? ' ')[0],
                                  style: const TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Color(0xFF0A2342)),
                                ),
                              ),
                              const SizedBox(height: 18),
                              Text(
                                '${profile['first_name'] ?? ''} ${profile['last_name'] ?? ''}',
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
                                  profile['role'] ?? 'General User',
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
                                  _ProfileInfoRow(icon: Icons.email, label: 'Email', value: profile['member_email'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.phone, label: 'Phone', value: profile['member_phone_number'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.contact_emergency, label: 'Emergency Contact', value: profile['emergencyContact'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.badge, label: 'NIC', value: profile['nic'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.home, label: 'House ID', value: profile['house_id']?.toString() ?? '-'),
                                  _ProfileInfoRow(icon: Icons.location_on, label: 'Address', value: profile['address'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.map, label: 'District', value: profile['district_name'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.account_balance, label: 'Divisional Secretariat', value: profile['divisional_secretariat_name'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.account_tree, label: 'Grama Niladhari Division', value: profile['grama_niladhari_division_name'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.calendar_today, label: 'Member Since', value: profile['joinDate'] ?? '-'),
                                  _ProfileInfoRow(icon: Icons.language, label: 'Latitude', value: profile['latitude']?.toString() ?? '-'),
                                  _ProfileInfoRow(icon: Icons.language, label: 'Longitude', value: profile['longitude']?.toString() ?? '-'),
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
      },
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
  final Map<String, dynamic> profile;
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
  late TextEditingController latitude;
  late TextEditingController longitude;

  @override
  void initState() {
    super.initState();
    firstName = TextEditingController(text: widget.profile['first_name'] ?? '');
    lastName = TextEditingController(text: widget.profile['last_name'] ?? '');
    email = TextEditingController(text: widget.profile['member_email'] ?? '');
    phone = TextEditingController(text: widget.profile['member_phone_number'] ?? '');
    address = TextEditingController(text: widget.profile['address'] ?? '');
    emergencyContact = TextEditingController(text: widget.profile['emergencyContact'] ?? '');
    latitude = TextEditingController(text: widget.profile['latitude']?.toString() ?? '');
    longitude = TextEditingController(text: widget.profile['longitude']?.toString() ?? '');
  }

  @override
  void dispose() {
    firstName.dispose();
    lastName.dispose();
    email.dispose();
    phone.dispose();
    address.dispose();
    emergencyContact.dispose();
    latitude.dispose();
    longitude.dispose();
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
          const SizedBox(height: 12),
          TextField(
            controller: latitude,
            decoration: const InputDecoration(labelText: 'Latitude'),
            keyboardType: TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: longitude,
            decoration: const InputDecoration(labelText: 'Longitude'),
            keyboardType: TextInputType.numberWithOptions(decimal: true),
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
                onPressed: () async {
                  // Call API to update profile with latitude/longitude
                  // (You should implement this in ApiService)
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
