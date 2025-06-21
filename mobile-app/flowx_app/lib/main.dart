import 'package:flutter/material.dart';
import 'screens/landing_page.dart';
import 'screens/login_page.dart';

void main() {
  debugPrint("🔄 Starting Flutter application on web/mobile");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    debugPrint("🎨 Building main application widget");
    return MaterialApp(
      title: 'FlowX App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const SplashToLogin(),
    );
  }
}

class SplashToLogin extends StatefulWidget {
  const SplashToLogin({super.key});

  @override
  State<SplashToLogin> createState() {
    debugPrint("⏳ Initializing splash screen state");
    return _SplashToLoginState();
  }
}

class _SplashToLoginState extends State<SplashToLogin> {
  @override
  void initState() {
    super.initState();
    debugPrint("⏱️ Starting 3-second splash timer");
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        debugPrint("➡️ Navigating from splash to login screen");
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    debugPrint("🖼️ Rendering landing page");
    return const LandingPage();
  }
}