import 'package:flutter/material.dart';
import 'app_scaffold.dart';
import 'sidebar.dart';
import 'announcements_page.dart';
import 'shelters_page.dart';
import 'inform_victims_page.dart';
import 'subsidy_page.dart';
import 'contact_page.dart';
import 'profile_page.dart';
import '../services/api_service.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> with TickerProviderStateMixin {
  Map<String, dynamic>? floodData;
  bool loading = true;
  String? error;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    fetchFloodRisk();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> fetchFloodRisk() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final data = await ApiService().fetchUserFloodRisk();
      setState(() {
        floodData = data;
        loading = false;
      });
      _animationController.forward();
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final userLoc = floodData?['user_location'] ?? {};
    final floodInfo = floodData?['flood_info'] ?? {};
    final risk = floodData?['risk_assessment'] ?? {};
    final alert = floodData?['alert'] ?? {};
    final pred = floodData?['predictions'] ?? {};
    final lastUpdated = floodData?['last_updated'] ?? '';

    return AppScaffold(
      selectedIndex: 0,
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
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => const ProfilePage()),
          );
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFB),
        appBar: AppBar(
          backgroundColor: Colors.white,
          elevation: 0,
          shadowColor: Colors.transparent,
          title: Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.blue[600]!, Colors.blue[800]!],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.water_drop, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 12),
                const Text(
                  'FlowX Dashboard',
                  style: TextStyle(
                    color: Color(0xFF1A2B3D),
                    fontWeight: FontWeight.w700,
                    fontSize: 24,
                    letterSpacing: -0.5,
                  ),
                ),
              ],
            ),
          ),
          centerTitle: false,
        ),
        body: loading
            ? Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.blue[50]!, Colors.white],
                  ),
                ),
                child: const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF2563EB)),
                        strokeWidth: 3,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'Loading flood data...',
                        style: TextStyle(
                          color: Color(0xFF64748B),
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              )
            : error != null
                ? Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.red[50]!, Colors.white],
                      ),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.error_outline, size: 64, color: Colors.red[400]),
                          const SizedBox(height: 16),
                          Text(
                            'Error loading data',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              color: Colors.red[700],
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            error!,
                            style: const TextStyle(color: Color(0xFF64748B)),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton.icon(
                            onPressed: fetchFloodRisk,
                            icon: const Icon(Icons.refresh),
                            label: const Text('Retry'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red[600],
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                : Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.blue[50]!, Colors.white],
                        stops: const [0.0, 0.3],
                      ),
                    ),
                    child: RefreshIndicator(
                      onRefresh: fetchFloodRisk,
                      color: const Color(0xFF2563EB),
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        child: FadeTransition(
                          opacity: _fadeAnimation,
                          child: Padding(
                            padding: const EdgeInsets.all(20.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Location Header Card
                                _buildLocationCard(userLoc),
                                const SizedBox(height: 24),
                                
                                // Main Flood Risk Card
                                _buildFloodRiskCard(floodInfo, risk, alert, pred, lastUpdated),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildLocationCard(Map<String, dynamic> userLoc) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOut,
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.grey[50]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: Colors.blue.withOpacity(0.08),
            blurRadius: 40,
            offset: const Offset(0, 16),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.blue[100],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.location_on, color: Colors.blue[700], size: 20),
              ),
              const SizedBox(width: 12),
              const Text(
                'Your Location',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1A2B3D),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _LocationDetail(
            icon: Icons.location_city,
            label: 'District',
            value: userLoc['district_name'] ?? 'Not available',
            color: Colors.purple,
          ),
          const SizedBox(height: 12),
          _LocationDetail(
            icon: Icons.account_balance,
            label: 'Divisional Secretariat',
            value: userLoc['ds_name'] ?? 'Not available',
            color: Colors.indigo,
          ),
          const SizedBox(height: 12),
          _LocationDetail(
            icon: Icons.person_pin_circle,
            label: 'Grama Niladhari Division',
            value: userLoc['gn_name'] ?? 'Not available',
            color: Colors.teal,
          ),
        ],
      ),
    );
  }

  Widget _buildFloodRiskCard(Map<String, dynamic> floodInfo, Map<String, dynamic> risk, 
      Map<String, dynamic> alert, Map<String, dynamic> pred, String lastUpdated) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 800),
      curve: Curves.easeInOut,
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.grey[50]!],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 30,
            offset: const Offset(0, 12),
          ),
          BoxShadow(
            color: _riskColor(risk['risk_level']).withOpacity(0.1),
            blurRadius: 40,
            offset: const Offset(0, 20),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header with icon and title
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue[500]!, Colors.blue[700]!],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.waves, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 16),
              const Flexible(
                child: Text(
                  'Flood Risk Status',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1A2B3D),
                    letterSpacing: -0.5,
                  ),
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Risk Level Badge
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 32),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  _riskColor(risk['risk_level']).withOpacity(0.1),
                  _riskColor(risk['risk_level']).withOpacity(0.05),
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: _riskColor(risk['risk_level']).withOpacity(0.3),
                width: 1.5,
              ),
            ),
            child: Text(
              risk['risk_level']?.toString().toUpperCase() ?? 'UNKNOWN',
              style: TextStyle(
                color: _riskColor(risk['risk_level']),
                fontWeight: FontWeight.w900,
                fontSize: 22,
                letterSpacing: 2,
              ),
            ),
          ),
          
          const SizedBox(height: 28),
          
          // Statistics Grid
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _EnhancedRiskStat(
                        icon: Icons.water_damage,
                        label: 'Flood Area',
                        value: '${floodInfo['flood_area'] ?? '0'} km²',
                        color: Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _EnhancedRiskStat(
                        icon: Icons.shield_outlined,
                        label: 'Safe Zones',
                        value: '${pred['safe_zones'] ?? '0'} km²',
                        color: Colors.green,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _EnhancedRiskStat(
                        icon: Icons.analytics_outlined,
                        label: 'Risk Level',
                        value: '${risk['risk_percentage'] ?? '0'}%',
                        color: Colors.orange,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _EnhancedRiskStat(
                        icon: Icons.schedule,
                        label: 'Recovery Time',
                        value: '${pred['recovery_time'] ?? '0'} days',
                        color: Colors.purple,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Last Updated
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                const SizedBox(width: 8),
                Text(
                  'Updated: $lastUpdated',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          
          // Alert Section
          if (alert['message'] != null) ...[
            const SizedBox(height: 24),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.red[50]!,
                    Colors.red[100]!.withOpacity(0.3),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Colors.red[200]!,
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: Colors.red[100],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(Icons.warning_amber, color: Colors.red[700], size: 20),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Emergency Alert',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF991B1B),
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    alert['message'] ?? '',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: Colors.red[800],
                      fontSize: 15,
                    ),
                  ),
                  if (alert['recommendation'] != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      alert['recommendation'] ?? '',
                      style: const TextStyle(
                        color: Color(0xFF374151),
                        fontSize: 14,
                        height: 1.4,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Color _riskColor(String? riskLevel) {
    switch (riskLevel) {
      case 'critical':
        return Colors.red;
      case 'very_high':
        return Colors.deepOrange;
      case 'high':
        return Colors.orange;
      case 'medium':
        return Colors.amber;
      case 'low':
        return Colors.green;
      case 'minimal':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }
}

class _LocationDetail extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _LocationDetail({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: color.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _EnhancedRiskStat extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _EnhancedRiskStat({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF64748B),
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 16,
              color: color,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
