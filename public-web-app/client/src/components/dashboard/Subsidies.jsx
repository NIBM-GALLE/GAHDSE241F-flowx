import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HandCoins, CalendarCheck, CircleDollarSign } from "lucide-react"

export function Subsidies({ subsidies }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HandCoins className="h-6 w-6" />
          Available Subsidies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {subsidies?.length > 0 ? (
              subsidies.map((subsidy, index) => (
                <div key={index} className="flex flex-col gap-2 pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{subsidy.name}</h4>
                    <Badge variant={subsidy.status === 'active' ? 'default' : 'secondary'}>
                      {subsidy.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CircleDollarSign className="h-4 w-4" />
                    <span>Amount: {subsidy.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Deadline: {new Date(subsidy.deadline).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm mt-1">{subsidy.description}</p>
                  <Button size="sm" className="mt-2 w-full sm:w-auto">
                    Apply Now
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No subsidies available at this time
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}