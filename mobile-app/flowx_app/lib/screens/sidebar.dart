import 'package:flutter/material.dart';

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
                // Enable navigation for Dashboard, Announcements, Safe Shelters, Victim Requests, and Subsidies
                final isLinked = index == 0 || index == 1 || index == 2 || index == 3 || index == 4;
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
          // User (dummy)
          const CircleAvatar(
            radius: 18,
            backgroundColor: Colors.blueAccent,
            child: Icon(Icons.person, color: Colors.white),
          ),
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
