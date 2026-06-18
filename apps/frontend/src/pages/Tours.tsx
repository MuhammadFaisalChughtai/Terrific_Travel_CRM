import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/auth.store';
import { formatCurrency } from '@tms/shared-utils';
import { useBookingStore } from '../store/booking.store';
import { Compass, Plus, X, Calendar, DollarSign, Tag, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Tours() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setTour = useBookingStore((state) => state.setTour);

  // Search parameters
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');

  // Admin Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tourName, setTourName] = useState('');
  const [tourDesc, setTourDesc] = useState('');
  const [tourPrice, setTourPrice] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [tourCategory, setTourCategory] = useState('Leisure');
  const [destName, setDestName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [destDesc, setDestDesc] = useState('');

  const isAdminOrAgent = user?.roles?.some(r => ['SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT'].includes(r));

  // Query tours
  const { data: toursResult, isLoading } = useQuery({
    queryKey: ['tours', category, duration],
    queryFn: async () => {
      const res = await apiClient.get('/tours', {
        params: { category, duration },
      });
      return res.data.data;
    },
  });

  // Create tour mutation
  const createTourMutation = useMutation({
    mutationFn: async (newTour: any) => {
      const res = await apiClient.post('/tours', newTour);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Tour package created successfully!');
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      setIsModalOpen(false);
      // Reset form
      setTourName('');
      setTourDesc('');
      setTourPrice('');
      setDurationDays('');
      setTourCategory('Leisure');
      setDestName('');
      setDestCountry('');
      setDestDesc('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create tour package');
    },
  });

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault();
    createTourMutation.mutate({
      name: tourName,
      description: tourDesc,
      price: Number(tourPrice),
      durationDays: Number(durationDays),
      category: tourCategory,
      destinationName: destName,
      destinationCountry: destCountry,
      destinationDescription: destDesc,
    });
  };

  const handleSelectTour = (tour: any) => {
    setTour(tour);
    toast.success(`Selected tour ${tour.name}. Proceed to Bookings to checkout.`);
  };

  const tours = toursResult?.items || [];

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="p-6 bg-card border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="flex items-center gap-2 text-primary">
            <Compass size={20} />
            <span className="text-sm font-semibold">Categories:</span>
          </div>
          {['', 'Adventure', 'Leisure', 'Cultural'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                category === cat 
                  ? 'bg-primary border-primary text-primary-foreground shadow-md' 
                  : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat || 'All Categories'}
            </button>
          ))}
        </div>

        {isAdminOrAgent && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md shrink-0"
          >
            <Plus size={16} />
            Add Tour Package
          </button>
        )}
      </div>

      {/* Tours Grid */}
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Searching tour packages...</div>
      ) : tours.length === 0 ? (
        <div className="p-8 text-center bg-card border border-dashed border-border rounded-2xl text-muted-foreground">
          No tour packages matching selection.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour: any) => (
            <div key={tour.id} className="bg-card border border-border rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-lg hover:border-primary/30 transition-all">
              {/* Header Visual mock */}
              <div className="h-48 bg-gradient-to-tr from-primary/10 via-secondary to-accent/5 flex items-center justify-center border-b border-border relative">
                <Compass size={48} className="text-muted-foreground group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                  {tour.category}
                </span>
                <span className="absolute bottom-4 left-4 text-xs font-semibold bg-secondary/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-border flex items-center gap-1.5">
                  <Calendar size={12} />
                  {tour.durationDays} Days
                </span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">{tour.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{tour.description}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wide flex items-center gap-1">
                    <Tag size={12} />
                    Destination: {tour.destination?.name}, {tour.destination?.country}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Package Price</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(tour.price)}</p>
                  </div>
                  <button
                    onClick={() => handleSelectTour(tour)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md"
                  >
                    Select Tour
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add Tour Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-card border border-border p-8 rounded-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary text-muted-foreground">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Compass size={22} className="text-primary" />
              Configure Tour Package
            </h3>

            <form onSubmit={handleCreateTour} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Tour Name</label>
                <input type="text" required value={tourName} onChange={(e) => setTourName(e.target.value)} placeholder="Parisian Delights Getaway" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Description</label>
                <textarea required value={tourDesc} onChange={(e) => setTourDesc(e.target.value)} placeholder="Write package itineraries..." rows={3} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Price</label>
                  <input type="number" required value={tourPrice} onChange={(e) => setTourPrice(e.target.value)} placeholder="599" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Duration (Days)</label>
                  <input type="number" required value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="4" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Category</label>
                  <select value={tourCategory} onChange={(e) => setTourCategory(e.target.value)} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none">
                    <option value="Leisure">Leisure</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>

              {/* Destination info */}
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-6">
                <div className="col-span-2"><h4 className="text-xs font-bold text-primary uppercase">Destination Details</h4></div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Destination Name</label>
                  <input type="text" required value={destName} onChange={(e) => setDestName(e.target.value)} placeholder="Paris" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Country</label>
                  <input type="text" required value={destCountry} onChange={(e) => setDestCountry(e.target.value)} placeholder="France" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Destination Description</label>
                  <textarea required value={destDesc} onChange={(e) => setDestDesc(e.target.value)} placeholder="About the destination..." rows={2} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none resize-none" />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border mt-6">
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/95 transition-all">
                  Publish Tour Package
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-secondary text-foreground font-bold rounded-xl text-sm hover:bg-secondary/90 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
