import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/auth.store';
import { formatCurrency } from '@tms/shared-utils';
import { useBookingStore } from '../store/booking.store';
import { Hotel, Search, Plus, X, MapPin, Star, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function Hotels() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setHotelRoom = useBookingStore((state) => state.setHotelRoom);

  // Search parameters
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState('');

  // Admin Modals
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [hotelName, setHotelName] = useState('');
  const [hotelDesc, setHotelDesc] = useState('');
  const [hotelAddr, setHotelAddr] = useState('');
  const [hotelCity, setHotelCity] = useState('');
  const [hotelCountry, setHotelCountry] = useState('');
  const [hotelRating, setHotelRating] = useState('');

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [roomType, setRoomType] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [maxOccupancy, setMaxOccupancy] = useState('');

  const isAdminOrAgent = user?.roles?.some(r => ['SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT'].includes(r));

  // Query hotels
  const { data: hotelsResult, isLoading } = useQuery({
    queryKey: ['hotels', city, country, rating],
    queryFn: async () => {
      const res = await apiClient.get('/hotels', {
        params: { city, country, rating },
      });
      return res.data.data;
    },
  });

  // Create hotel mutation
  const createHotelMutation = useMutation({
    mutationFn: async (newHotel: any) => {
      const res = await apiClient.post('/hotels', newHotel);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Hotel created successfully!');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      setIsHotelModalOpen(false);
      // Reset form
      setHotelName('');
      setHotelDesc('');
      setHotelAddr('');
      setHotelCity('');
      setHotelCountry('');
      setHotelRating('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create hotel');
    },
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: async ({ hotelId, room }: { hotelId: string; room: any }) => {
      const res = await apiClient.post(`/hotels/${hotelId}/rooms`, room);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Room created successfully!');
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      setIsRoomModalOpen(false);
      // Reset form
      setRoomType('');
      setRoomPrice('');
      setMaxOccupancy('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create room');
    },
  });

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    createHotelMutation.mutate({
      name: hotelName,
      description: hotelDesc,
      address: hotelAddr,
      city: hotelCity,
      country: hotelCountry,
      rating: Number(hotelRating || 0),
    });
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId) return;
    createRoomMutation.mutate({
      hotelId: selectedHotelId,
      room: {
        roomType,
        price: Number(roomPrice),
        maxOccupancy: Number(maxOccupancy),
        isAvailable: true,
      },
    });
  };

  const handleSelectRoom = (hotel: any, room: any) => {
    setHotelRoom(hotel, room);
    toast.success(`Selected room ${room.roomType} at ${hotel.name}. Proceed to Bookings to checkout.`);
  };

  const hotels = hotelsResult?.items || [];

  return (
    <div className="space-y-6">
      {/* Search Filter Panel */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Search size={18} className="text-primary" />
            Search Lodgings & Resorts
          </h3>
          {isAdminOrAgent && (
            <button
              onClick={() => setIsHotelModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md shadow-primary/15"
            >
              <Plus size={16} />
              Add Hotel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Destination City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Paris or New York"
              className="w-full px-3 py-2 bg-secondary/40 border border-border rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Destination Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. France or USA"
              className="w-full px-3 py-2 bg-secondary/40 border border-border rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Minimum Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/40 border border-border rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="">Any Rating</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars & up</option>
              <option value="3">3 Stars & up</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hotels List */}
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Searching lodgings...</div>
      ) : hotels.length === 0 ? (
        <div className="p-8 text-center bg-card border border-dashed border-border rounded-2xl text-muted-foreground">
          No hotel lodgings matching search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {hotels.map((hotel: any) => (
            <div key={hotel.id} className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
              {/* Hotel Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xl">{hotel.name}</h4>
                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Star size={12} fill="currentColor" />
                      {hotel.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin size={14} className="text-muted-foreground" />
                    {hotel.address}, {hotel.city}, {hotel.country}
                  </p>
                  <p className="text-sm pt-2 text-muted-foreground leading-relaxed">{hotel.description}</p>
                </div>

                {isAdminOrAgent && (
                  <button
                    onClick={() => {
                      setSelectedHotelId(hotel.id);
                      setIsRoomModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-border text-muted-foreground hover:text-foreground rounded-xl text-xs font-semibold hover:bg-secondary transition-all shrink-0"
                  >
                    <Plus size={14} />
                    Add Room Type
                  </button>
                )}
              </div>

              {/* Rooms List */}
              <div className="border-t border-border pt-4">
                <h5 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Available Room Configurations</h5>
                {(!hotel.rooms || hotel.rooms.length === 0) ? (
                  <p className="text-xs text-muted-foreground italic">No room configurations declared for this hotel lodging.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotel.rooms.map((room: any) => (
                      <div key={room.id} className="p-4 bg-secondary/35 border border-border rounded-xl flex flex-col justify-between gap-4">
                        <div>
                          <h6 className="font-bold text-sm">{room.roomType}</h6>
                          <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 mt-1">
                            <UserPlus size={12} />
                            Max occupancy: {room.maxOccupancy} persons
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/60 pt-3">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Nightly Price</p>
                            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(room.price)}</p>
                          </div>
                          <button
                            onClick={() => handleSelectRoom(hotel, room)}
                            className="px-4 py-2 bg-primary/90 hover:bg-primary text-primary-foreground font-bold rounded-lg text-xs transition-all"
                          >
                            Book Room
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add Hotel Modal */}
      {isHotelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-border p-8 rounded-2xl shadow-2xl relative">
            <button onClick={() => setIsHotelModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary text-muted-foreground">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Hotel size={22} className="text-primary" />
              Configure Hotel Lodging
            </h3>

            <form onSubmit={handleCreateHotel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Hotel Name</label>
                <input type="text" required value={hotelName} onChange={(e) => setHotelName(e.target.value)} placeholder="Grand Hyatt" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Description</label>
                <textarea required value={hotelDesc} onChange={(e) => setHotelDesc(e.target.value)} placeholder="Write something about the hotel..." rows={3} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Street Address</label>
                <input type="text" required value={hotelAddr} onChange={(e) => setHotelAddr(e.target.value)} placeholder="109 Park Avenue" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">City</label>
                  <input type="text" required value={hotelCity} onChange={(e) => setHotelCity(e.target.value)} placeholder="New York" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Rating</label>
                  <input type="number" step="0.1" max="5" min="1" required value={hotelRating} onChange={(e) => setHotelRating(e.target.value)} placeholder="4.5" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Country</label>
                <input type="text" required value={hotelCountry} onChange={(e) => setHotelCountry(e.target.value)} placeholder="United States" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
              </div>

              <div className="flex gap-4 pt-4 border-t border-border mt-6">
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/95 transition-all">
                  Register Hotel
                </button>
                <button type="button" onClick={() => setIsHotelModalOpen(false)} className="px-6 py-3 bg-secondary text-foreground font-bold rounded-xl text-sm hover:bg-secondary/90 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-2xl relative">
            <button onClick={() => setIsRoomModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary text-muted-foreground">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Hotel size={22} className="text-primary" />
              Configure Room Options
            </h3>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Room Type / Name</label>
                <input type="text" required value={roomType} onChange={(e) => setRoomType(e.target.value)} placeholder="e.g. Presidential Suite" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Nightly Price</label>
                <input type="number" required value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} placeholder="280" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Max Occupancy (Persons)</label>
                <input type="number" required value={maxOccupancy} onChange={(e) => setMaxOccupancy(e.target.value)} placeholder="2" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
              </div>

              <div className="flex gap-4 pt-4 border-t border-border mt-6">
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/95 transition-all">
                  Publish Room Options
                </button>
                <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-6 py-3 bg-secondary text-foreground font-bold rounded-xl text-sm hover:bg-secondary/90 transition-all">
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
