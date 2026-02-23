import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { TripsPage } from '@/features/trips/TripsPage';
import { TripDetailPage } from '@/features/trips/TripDetailPage';
import { StopDetailPage } from '@/features/stops/StopDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      {
        index: true,
        element: <TripsPage />,
      },
      {
        path: 'trips/:tripId',
        element: <TripDetailPage />,
      },
      {
        path: 'stops/:stopId',
        element: <StopDetailPage />,
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
