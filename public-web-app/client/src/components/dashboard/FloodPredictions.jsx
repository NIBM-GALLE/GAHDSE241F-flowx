import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Waves, CloudRain, ShieldCheck, Clock } from "lucide-react"

export function FloodPredictions({ floodData, floodRisk }) {
  const getRiskLevel = (percentage) => {
    if (percentage <= 40) return "Low";
    if (percentage <= 70) return "Medium";
    return "High";
  };

  const riskLevel = getRiskLevel(floodRisk);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-6 w-6" />
          Flood Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {riskLevel === "High" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Flood Warning!</AlertTitle>
            <AlertDescription>
              High flood risk detected. Please take necessary precautions.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Flood Risk Level</span>
            <span className="text-sm font-medium">{floodRisk}% ({riskLevel})</span>
          </div>
          <Progress value={floodRisk} className="h-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CloudRain className="h-4 w-4" />
                Predicted Flood Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {floodData?.floodArea?.toFixed(2) || "--"} sq km
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated affected area
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Safe Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {floodData?.safeZones?.toFixed(2) || "--"} sq km
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended evacuation areas
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
                {floodData?.recoveryTime ? `${floodData.recoveryTime.toFixed(1)} days` : "--"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Until normalcy returns
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}