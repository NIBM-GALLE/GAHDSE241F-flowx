import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, Info, Megaphone } from "lucide-react";

export function Announcements() {
  const announcements = [
    {
      type: "warning",
      title: "Heavy Rainfall Alert",
      message: "Expect heavy rainfall in Colombo and surrounding areas within the next 24 hours.",
      date: "2025-05-09",
    },
    {
      type: "info",
      title: "Relief Camp Setup",
      message: "A new relief camp has been set up at Galle Town Hall. Supplies and shelter are available.",
      date: "2025-05-08",
    },
    {
      type: "general",
      title: "Donation Drive",
      message: "We are organizing a donation drive for flood-affected areas. Volunteers are welcome!",
      date: "2025-05-07",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Megaphone className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                  <div className="mt-1">{getIcon(announcement.type)}</div>
                  <div>
                    <h4 className="font-medium">{announcement.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(announcement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No announcements available
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
