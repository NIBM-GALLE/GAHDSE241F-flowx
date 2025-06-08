import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useFloodStore } from '@/stores/useFloodStore';
import { useUserStore } from '@/stores/useUserStore';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';

export default function CreateFloodDetails() {
  const { createFloodDetails, loading } = useFloodStore();
  const { token } = useUserStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [date, setDate] = useState(new Date());

  // Only required fields for backend
  const onSubmit = async (data) => {
    const payload = {
      flood_details_date: format(date, 'yyyy-MM-dd'),
      river_level: parseFloat(data.river_level),
      rain_fall: parseFloat(data.rain_fall),
      water_rising_rate: parseFloat(data.water_rising_rate),
      flood_area: data.flood_area,
    };
    try {
      await createFloodDetails(payload, token);
      toast.success('Flood details recorded successfully!');
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to record flood details');
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />
            <span className="font-semibold text-lg">Create Flood Details</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-muted/40 min-h-[calc(100vh-4rem)]">
          <Card className="max-w-3xl mx-auto shadow-lg border-0 bg-white/90 dark:bg-zinc-900/80">
            <CardHeader>
              <CardTitle className="text-2xl mb-1">Flood Monitoring Data Entry</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">
                Record water measurements and flood affected areas for ongoing flood events.
              </p>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-8">
                {/* Date Selection */}
                <section>
                  <Label htmlFor="date" className="font-semibold">Measurement Date</Label>
                  <div className="mt-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border bg-background"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Select the date of the measurement.</p>
                </section>
                {/* Water Measurements */}
                <section>
                  <h3 className="font-semibold text-base mb-2">Water Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/60 rounded-lg p-4">
                    <div>
                      <Label htmlFor="rain_fall">Rainfall (mm)</Label>
                      <Input
                        id="rain_fall"
                        type="number"
                        step="0.1"
                        placeholder="e.g. 25.5"
                        {...register('rain_fall', { required: 'Rainfall is required', min: { value: 0, message: 'Must be >= 0' } })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Total rainfall in millimeters.</p>
                      {errors.rain_fall && (
                        <p className="text-xs text-red-500 mt-1">{errors.rain_fall.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="river_level">River Water Level (m)</Label>
                      <Input
                        id="river_level"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 3.42"
                        {...register('river_level', { required: 'River level is required', min: { value: 0, message: 'Must be >= 0' } })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Current river water level in meters.</p>
                      {errors.river_level && (
                        <p className="text-xs text-red-500 mt-1">{errors.river_level.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="water_rising_rate">Water Rising Rate (m/h)</Label>
                      <Input
                        id="water_rising_rate"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 0.15"
                        {...register('water_rising_rate', { required: 'Water rising rate is required', min: { value: 0, message: 'Must be >= 0' } })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Rate at which water is rising (meters per hour).</p>
                      {errors.water_rising_rate && (
                        <p className="text-xs text-red-500 mt-1">{errors.water_rising_rate.message}</p>
                      )}
                    </div>
                  </div>
                </section>
                {/* Flood Area */}
                <section>
                  <Label htmlFor="flood_area" className="font-semibold">Flood Area (km²)</Label>
                  <Input
                    id="flood_area"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 12.5"
                    {...register('flood_area', { required: 'Flood area is required', min: { value: 0, message: 'Must be >= 0' } })}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter the total area affected by the flood in square kilometers.</p>
                  {errors.flood_area && (
                    <p className="text-xs text-red-500 mt-1">{errors.flood_area.message}</p>
                  )}
                </section>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 mt-4">
                <Button type="button" variant="outline" onClick={() => reset()} className="rounded-full px-6">
                  Clear Form
                </Button>
                <Button type="submit" disabled={loading} className="rounded-full px-6 font-semibold shadow-md">
                  {loading ? 'Submitting...' : 'Submit Data'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}