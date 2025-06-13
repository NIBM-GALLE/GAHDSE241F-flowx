import 'package:flutter/material.dart';
import 'sidebar.dart';

class AppScaffold extends StatelessWidget {
  final int selectedIndex;
  final Widget child;
  final Function(int) onItemSelected;

  const AppScaffold({
    super.key,
    required this.selectedIndex,
    required this.child,
    required this.onItemSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        FlowXSidebar(
          selectedIndex: selectedIndex,
          onItemSelected: onItemSelected,
        ),
        Expanded(child: child),
      ],
    );
  }
}
