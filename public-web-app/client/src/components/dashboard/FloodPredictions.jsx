import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Waves, CloudRain, ShieldCheck, Clock, MapPin, AlertTriangle } from "lucide-react"

function FloodPredictions({ floodRiskData, loading }) {
  // Handle the new data structure
  const riskAssessment = floodRiskData?.data?.risk_assessment || {};
  const floodInfo = floodRiskData?.data?.flood_info || {};
  const userLocation = floodRiskData?.data?.user_location || {};
  const alert = floodRiskData?.data?.alert || {};
  const predictions = floodRiskData?.data?.predictions || {};

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'very_high': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'default';
      case 'minimal': return 'default';
      default: return 'default';
    }
  };

  const formatRiskLevel = (level) => {
    return level?.replace('_', ' ').toUpperCase() || 'UNKNOWN';
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return <AlertCircle className="h-4 w-4" />;
      case 'very_high': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-6 w-6" />
            Flood Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle no data case
  if (!floodRiskData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-6 w-6" />
            Flood Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>
              Unable to load flood risk data. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-6 w-6" />
            Flood Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Critical Alert */}
          {(riskAssessment.risk_level === 'critical' || riskAssessment.risk_level === 'very_high') && (
            <Alert variant={getRiskColor(riskAssessment.risk_level)}>
              {getRiskIcon(riskAssessment.risk_level)}
              <AlertTitle>
                {riskAssessment.evacuation_needed ? 'EVACUATION REQUIRED!' : 'HIGH FLOOD RISK!'}
              </AlertTitle>
              <AlertDescription>
                {alert.message}
              </AlertDescription>
            </Alert>
          )}

          {/* User Location Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Your Location Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Distance to River:</span>
                  <span className="font-medium">{userLocation.distance_to_river} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Flood Reach:</span>
                  <span className="font-medium">{floodInfo.flood_area} km from river</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Your Safety Distance:</span>
                  <span className={`font-medium ${riskAssessment.distance_from_flood === 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {riskAssessment.distance_from_flood === 0 ? 'IN FLOOD ZONE' : `${riskAssessment.distance_from_flood} km from flood`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Risk Level</span>
              <span className={`text-sm font-bold ${
                riskAssessment.risk_percentage >= 75 ? 'text-red-600' : 
                riskAssessment.risk_percentage >= 50 ? 'text-orange-600' : 
                'text-green-600'
              }`}>
                {riskAssessment.risk_percentage}% ({formatRiskLevel(riskAssessment.risk_level)})
              </span>
            </div>
            <Progress 
              value={riskAssessment.risk_percentage || 0} 
              className={`h-3 ${
                riskAssessment.risk_percentage >= 75 ? 'bg-red-100' : 
                riskAssessment.risk_percentage >= 50 ? 'bg-orange-100' : 
                'bg-green-100'
              }`} 
            />
          </div>

          {/* Recommendation */}
          {alert.recommendation && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Recommendation</AlertTitle>
              <AlertDescription>
                {alert.recommendation}
              </AlertDescription>
            </Alert>
          )}

          {/* Flood Predictions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CloudRain className="h-4 w-4" />
                  Flood Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {predictions.flood_area?.toFixed(1) || floodInfo.flood_area?.toFixed(1) || "--"} km
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From river banks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Safe Zone Distance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {predictions.safe_zones?.toFixed(1) || "--"} km
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended safe distance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recovery Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {predictions.recovery_time ? `${predictions.recovery_time} days` : "--"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimated recovery period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Conditions */}
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Flood Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>River Level:</span>
                  <span className="font-medium">{floodInfo.river_level} m</span>
                </div>
                <div className="flex justify-between">
                  <span>Rainfall:</span>
                  <span className="font-medium">{floodInfo.rain_fall} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium capitalize ${
                    riskAssessment.status === 'flooded' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {riskAssessment.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium">
                    {floodInfo.date ? new Date(floodInfo.date).toLocaleDateString() : 'Today'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export { FloodPredictions };