import 'package:flutter/material.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Container(
          width: 300,
          height: 300,
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: Padding(
            padding: EdgeInsets.all(20.0),
            child: Image.asset(
              'assets/images/flowx_logo.jpg',
              fit: BoxFit.contain,
            ),
          ),
        ),
      ),
    );
  }
}
