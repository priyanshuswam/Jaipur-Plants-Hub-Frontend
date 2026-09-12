import type { Metadata } from 'next';
import GardenDesignClientPage from './GardenDesignClientPage';

export const metadata: Metadata = {
  title: 'Garden Design Services – Villa, Farmhouse & Resort Landscaping',
  description: 'Expert landscape design for villas, farmhouses, resorts, and offices. Get a free consultation and 3D design preview.',
};

export default function GardenDesignPage() {
  return <GardenDesignClientPage />;
}
