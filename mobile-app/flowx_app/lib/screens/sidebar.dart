import 'package:flutter/material.dart';
import 'app_scaffold.dart';
import 'login_page.dart';

class FlowXSidebar extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemSelected;

  const FlowXSidebar({
    super.key,
    required this.selectedIndex,
    required this.onItemSelected,
  });

  @override
  Widget build(BuildContext context) {
    final items = [
      _SidebarItem(icon: Icons.water_drop, label: 'Flood Prediction'), // Dashboard
      _SidebarItem(icon: Icons.announcement, label: 'Announcements'),
      _SidebarItem(icon: Icons.home, label: 'Safe Shelters'),
      // The rest are placeholders, not linked
      _SidebarItem(icon: Icons.people, label: 'Victim Requests'),
      _SidebarItem(icon: Icons.volunteer_activism, label: 'Subsidies'),
      _SidebarItem(icon: Icons.phone, label: 'Contact Info'),
      _SidebarItem(icon: Icons.person, label: 'Profile'),
    ];

    return Container(
      width: 80,
      decoration: const BoxDecoration(
        color: Color(0xFF0A2342),
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(height: 32),
          // Logo
          CircleAvatar(
            radius: 28,
            backgroundColor: Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(6.0),
              child: Image.asset('assets/images/flowx_logo.jpg'),
            ),
          ),
          const SizedBox(height: 24),
          // Menu items
          Expanded(
            child: ListView.builder(
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                final isSelected = index == selectedIndex;
                // Enable navigation for Dashboard, Announcements, Safe Shelters, Victim Requests, Subsidies, Contact Info, and Profile
                final isLinked = index == 0 || index == 1 || index == 2 || index == 3 || index == 4 || index == 5 || index == 6;
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6.0),
                  child: IconButton(
                    icon: Icon(item.icon, color: isSelected ? Colors.blueAccent : Colors.white, size: 30),
                    onPressed: isLinked ? () => onItemSelected(index) : null,
                    tooltip: item.label,
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 16),
          // User menu (profile icon with popup menu)
          _SidebarUserMenu(onProfile: () => onItemSelected(6)),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _SidebarItem {
  final IconData icon;
  final String label;
  const _SidebarItem({required this.icon, required this.label});
}

// User menu widget for sidebar bottom
class _SidebarUserMenu extends StatelessWidget {
  final VoidCallback onProfile;
  const _SidebarUserMenu({required this.onProfile});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (details) async {
        final RenderBox overlay = Overlay.of(context).context.findRenderObject() as RenderBox;
        final result = await showMenu<String>(
            context: context,
            color: Colors.white,
            position: RelativeRect.fromRect(
            details.globalPosition & const Size(40, 40),
            Offset.zero & overlay.size,
          ),
          items: [
            const PopupMenuItem<String>(
              value: 'profile',
              child: Row(
                children: [Icon(Icons.person, color: Colors.blueAccent), SizedBox(width: 8), Text('Profile')],
              ),
            ),
            const PopupMenuItem<String>(
              value: 'logout',
              child: Row(
                children: [Icon(Icons.logout, color: Colors.redAccent), SizedBox(width: 8), Text('Log out')],
              ),
            ),
          ],
        );
        if (result == 'profile') {
          onProfile();
        } else if (result == 'logout') {
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (context) => LoginPage()),
            (route) => false,
          );
        }
      },
      child: const CircleAvatar(
        radius: 18,
        backgroundColor: Colors.blueAccent,
        child: Icon(Icons.person, color: Colors.white),
      ),
    );
  }
}
