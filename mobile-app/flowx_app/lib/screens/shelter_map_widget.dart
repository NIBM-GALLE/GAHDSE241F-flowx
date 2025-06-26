import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class ShelterMapWidget extends StatefulWidget {
  final LatLng? userLocation;
  final List<Map<String, dynamic>> shelters;
  final Map<String, dynamic>? assignedShelter;

  const ShelterMapWidget({
    super.key,
    required this.userLocation,
    required this.shelters,
    this.assignedShelter,
  });

  @override
  State<ShelterMapWidget> createState() => _ShelterMapWidgetState();
}

class _ShelterMapWidgetState extends State<ShelterMapWidget> {
  late final MapController _mapController;
  double _zoom = 12;

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
  }

  void _zoomIn() {
    setState(() {
      _zoom += 1;
      _mapController.move(_mapController.center, _zoom);
    });
  }

  void _zoomOut() {
    setState(() {
      _zoom -= 1;
      _mapController.move(_mapController.center, _zoom);
    });
  }

  @override
  Widget build(BuildContext context) {
    final assignedLat = widget.assignedShelter != null ? double.tryParse(widget.assignedShelter!["latitude"].toString()) : null;
    final assignedLng = widget.assignedShelter != null ? double.tryParse(widget.assignedShelter!["longitude"].toString()) : null;
    return Stack(
      children: [
        SizedBox(
          height: 300,
          child: FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              center: widget.userLocation ?? LatLng(6.5854, 79.9607),
              zoom: _zoom,
            ),
            children: [
              TileLayer(
                urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                subdomains: ['a', 'b', 'c'],
              ),
              if (widget.userLocation != null)
                MarkerLayer(
                  markers: [
                    Marker(
                      point: widget.userLocation!,
                      width: 40,
                      height: 40,
                      child: const Icon(Icons.person_pin_circle, color: Colors.blue, size: 36),
                    ),
                  ],
                ),
              MarkerLayer(
                markers: widget.shelters.map((shelter) {
                  final lat = double.tryParse(shelter["latitude"].toString());
                  final lng = double.tryParse(shelter["longitude"].toString());
                  if (lat == null || lng == null) return null;
                  final isAssigned = assignedLat == lat && assignedLng == lng;
                  return Marker(
                    point: LatLng(lat, lng),
                    width: 36,
                    height: 36,
                    child: Icon(
                      Icons.location_on,
                      color: isAssigned ? Colors.red : Colors.green,
                      size: isAssigned ? 38 : 32,
                    ),
                  );
                }).whereType<Marker>().toList(),
              ),
            ],
          ),
        ),
        Positioned(
          top: 16,
          right: 16,
          child: Column(
            children: [
              FloatingActionButton(
                heroTag: 'zoomIn',
                mini: true,
                onPressed: _zoomIn,
                child: const Icon(Icons.add),
              ),
              const SizedBox(height: 8),
              FloatingActionButton(
                heroTag: 'zoomOut',
                mini: true,
                onPressed: _zoomOut,
                child: const Icon(Icons.remove),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
