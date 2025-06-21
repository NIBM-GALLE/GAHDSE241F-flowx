import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../services/api_service.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  int _step = 1;
  final _formKey1 = GlobalKey<FormState>();
  final _formKey2 = GlobalKey<FormState>();

  //step 1 controllers
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _homeIdController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  bool _showPassword = false;
  bool _showConfirmPassword = false;

  //step 2 controllers
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _membersController = TextEditingController();
  final TextEditingController _distanceToRiverController = TextEditingController();
  String? _district;
  String? _divSec;
  String? _gnDiv;
  LatLng? _selectedLocation;

  //dynamic data for dropdowns
  List<Map<String, dynamic>> _districts = [];
  List<Map<String, dynamic>> _divSecs = [];
  List<Map<String, dynamic>> _gnDivs = [];
  bool _loadingDistricts = false;
  bool _loadingDivSecs = false;
  bool _loadingGnDivs = false;

  @override
  void initState() {
    super.initState();
    _fetchDistricts();
  }

  Future<void> _fetchDistricts() async {
    setState(() => _loadingDistricts = true);
    try {
      _districts = await ApiService().fetchDistricts();
    } catch (_) {
      _districts = [];
    }
    setState(() => _loadingDistricts = false);
  }

  Future<void> _fetchDivSecs(String districtId) async {
    setState(() => _loadingDivSecs = true);
    try {
      _divSecs = await ApiService().fetchDivisionalSecretariats(districtId);
    } catch (_) {
      _divSecs = [];
    }
    setState(() => _loadingDivSecs = false);
  }

  Future<void> _fetchGnDivs(String divSecId) async {
    setState(() => _loadingGnDivs = true);
    try {
      _gnDivs = await ApiService().fetchGramaNiladhariDivisions(divSecId);
    } catch (_) {
      _gnDivs = [];
    }
    setState(() => _loadingGnDivs = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF0A2342)),
        title: const Text('Sign Up', style: TextStyle(color: Color(0xFF0A2342), fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Image.asset('assets/images/flowx_logo.jpg', fit: BoxFit.contain),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                _step == 1 ? 'Create your account' : 'Address & Area Details',
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0A2342)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              if (_step == 1) _buildStep1(context),
              if (_step == 2) _buildStep2(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep1(BuildContext context) {
    return Form(
      key: _formKey1,
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _firstNameController,
                  decoration: const InputDecoration(labelText: 'First Name'),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextFormField(
                  controller: _lastNameController,
                  decoration: const InputDecoration(labelText: 'Last Name'),
                  validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _emailController,
            decoration: const InputDecoration(labelText: 'Email'),
            keyboardType: TextInputType.emailAddress,
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _phoneController,
            decoration: const InputDecoration(labelText: 'Phone'),
            keyboardType: TextInputType.phone,
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _homeIdController,
            decoration: const InputDecoration(labelText: 'Home ID'),
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _passwordController,
            obscureText: !_showPassword,
            decoration: InputDecoration(
              labelText: 'Password',
              suffixIcon: IconButton(
                icon: Icon(_showPassword ? Icons.visibility : Icons.visibility_off),
                onPressed: () => setState(() => _showPassword = !_showPassword),
              ),
            ),
            validator: (v) => v == null || v.length < 6 ? 'Min 6 characters' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _confirmPasswordController,
            obscureText: !_showConfirmPassword,
            decoration: InputDecoration(
              labelText: 'Confirm Password',
              suffixIcon: IconButton(
                icon: Icon(_showConfirmPassword ? Icons.visibility : Icons.visibility_off),
                onPressed: () => setState(() => _showConfirmPassword = !_showConfirmPassword),
              ),
            ),
            validator: (v) => v != _passwordController.text ? 'Passwords do not match' : null,
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Cancel'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey1.currentState!.validate()) {
                      setState(() => _step = 2);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A2342),
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Next'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep2(BuildContext context) {
    return Form(
      key: _formKey2,
      child: Column(
        children: [
          TextFormField(
            controller: _addressController,
            decoration: const InputDecoration(labelText: 'Address'),
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _membersController,
            decoration: const InputDecoration(labelText: 'Number of Members'),
            keyboardType: TextInputType.number,
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _distanceToRiverController,
            decoration: const InputDecoration(labelText: 'Distance to River (meters)'),
            keyboardType: TextInputType.number,
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            value: _district,
            items: _districts.map((d) => DropdownMenuItem(
              value: d['district_id'].toString(),
              child: Text(d['district_name']),
            )).toList(),
            onChanged: (v) {
              setState(() {
                _district = v;
                _divSec = null;
                _gnDiv = null;
                _divSecs = [];
                _gnDivs = [];
              });
              if (v != null) _fetchDivSecs(v);
            },
            decoration: const InputDecoration(labelText: 'District'),
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            isExpanded: true,
          ),
          if (_loadingDivSecs) const LinearProgressIndicator(),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            value: _divSec,
            items: _divSecs.map((d) => DropdownMenuItem(
              value: d['divisional_secretariat_id'].toString(),
              child: Text(d['divisional_secretariat_name']),
            )).toList(),
            onChanged: (v) {
              setState(() {
                _divSec = v;
                _gnDiv = null;
                _gnDivs = [];
              });
              if (v != null) _fetchGnDivs(v);
            },
            decoration: const InputDecoration(labelText: 'Divisional Secretariat'),
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            isExpanded: true,
          ),
          if (_loadingGnDivs) const LinearProgressIndicator(),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            value: _gnDiv,
            items: _gnDivs.map((d) => DropdownMenuItem(
              value: d['grama_niladhari_division_id'].toString(),
              child: Text(d['grama_niladhari_division_name']),
            )).toList(),
            onChanged: (v) => setState(() => _gnDiv = v),
            decoration: const InputDecoration(labelText: 'Grama Niladhari Division'),
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            isExpanded: true,
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 220,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: FlutterMap(
                options: MapOptions(
                  center: LatLng(7.8731, 80.7718), // Sri Lanka center
                  zoom: 7.5,
                  onTap: (tapPosition, point) {
                    setState(() => _selectedLocation = point);
                  },
                ),
                children: [
                  TileLayer(
                    urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    subdomains: const ['a', 'b', 'c'],
                  ),
                  if (_selectedLocation != null)
                    MarkerLayer(
                      markers: [
                        Marker(
                          width: 40,
                          height: 40,
                          point: _selectedLocation!,
                          child: const Icon(Icons.location_on, color: Colors.red, size: 36),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ),
          if (_selectedLocation != null)
            Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Text(
                'Selected: ${_selectedLocation!.latitude.toStringAsFixed(5)}, ${_selectedLocation!.longitude.toStringAsFixed(5)}',
                style: const TextStyle(fontSize: 14, color: Colors.black54),
              ),
            ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _step = 1),
                  child: const Text('Back'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey2.currentState!.validate() && _selectedLocation != null) {
                      // TODO: Implement sign up logic with _selectedLocation.latitude & longitude
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Sign up successful! Location: '
                          '${_selectedLocation!.latitude}, ${_selectedLocation!.longitude}')),
                      );
                    } else if (_selectedLocation == null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Please select a location on the map.')),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A2342),
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Sign Up'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
