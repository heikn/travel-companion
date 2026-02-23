import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateStop } from '@/lib/query/stops.queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const createStopSchema = z.object({
  order: z.number().int().positive(),
  cityName: z.string().min(1, 'City name is required').max(100),
});

type CreateStopForm = z.infer<typeof createStopSchema>;

interface StopFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  nextOrder: number;
}

export function StopFormDialog({
  open,
  onOpenChange,
  tripId,
  nextOrder,
}: StopFormDialogProps) {
  const createStop = useCreateStop();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateStopForm>({
    resolver: zodResolver(createStopSchema),
    defaultValues: {
      order: nextOrder,
    },
  });

  const onSubmit = async (data: CreateStopForm) => {
    try {
      await createStop.mutateAsync({ tripId, data });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create stop:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              {...register('order', { valueAsNumber: true })}
            />
            {errors.order && (
              <p className="text-sm text-red-600 mt-1">{errors.order.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cityName">City Name</Label>
            <Input
              id="cityName"
              {...register('cityName')}
              placeholder="e.g., Paris"
            />
            {errors.cityName && (
              <p className="text-sm text-red-600 mt-1">{errors.cityName.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createStop.isPending}>
              {createStop.isPending ? 'Adding...' : 'Add Stop'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
