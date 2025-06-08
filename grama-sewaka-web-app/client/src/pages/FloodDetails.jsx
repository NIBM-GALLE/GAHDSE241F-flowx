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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function FloodDetails() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [date, setDate] = useState(new Date());

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      date: format(date, 'yyyy-MM-dd'),
      rainfall: parseFloat(data.rainfall),
      riverLevel: parseFloat(data.riverLevel),
      reservoirRate: parseFloat(data.reservoirRate)
    };
    
    console.log('Submitted data:', formattedData);
    toast.success('Flood data recorded successfully!');
    reset();
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Flood Monitoring Data Entry</CardTitle>
          <p className="text-sm text-muted-foreground">
            Record water measurements and flood affected areas
          </p>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Date Selection */}
            <div>
              <Label htmlFor="date">Measurement Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mt-2"
              />
            </div>

            {/* Water Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  type="number"
                  step="0.1"
                  {...register('rainfall', { required: 'Rainfall measurement is required' })}
                />
                {errors.rainfall && (
                  <p className="text-sm text-red-500 mt-1">{errors.rainfall.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="riverLevel">River Water Level (m)</Label>
                <Input
                  id="riverLevel"
                  type="number"
                  step="0.01"
                  {...register('riverLevel', { required: 'River level is required' })}
                />
                {errors.riverLevel && (
                  <p className="text-sm text-red-500 mt-1">{errors.riverLevel.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reservoirRate">Reservoir Rate (%)</Label>
                <Input
                  id="reservoirRate"
                  type="number"
                  min="0"
                  max="100"
                  {...register('reservoirRate', { 
                    required: 'Reservoir rate is required',
                    min: { value: 0, message: 'Minimum 0%' },
                    max: { value: 100, message: 'Maximum 100%' }
                  })}
                />
                {errors.reservoirRate && (
                  <p className="text-sm text-red-500 mt-1">{errors.reservoirRate.message}</p>
                )}
              </div>
            </div>

            {/* Flood Severity */}
            <div>
              <Label htmlFor="severity">Flood Severity</Label>
              <Select {...register('severity')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="danger">Danger</SelectItem>
                  <SelectItem value="extreme">Extreme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Affected Areas */}
            <div>
              <Label htmlFor="affectedAreas">Flood Affected Areas</Label>
              <Textarea
                id="affectedAreas"
                {...register('affectedAreas', { required: 'Affected areas are required' })}
                placeholder="List affected districts, villages, or regions"
                className="min-h-[100px]"
              />
              {errors.affectedAreas && (
                <p className="text-sm text-red-500 mt-1">{errors.affectedAreas.message}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any additional observations or comments"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Clear Form
            </Button>
            <Button type="submit">Submit Data</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}