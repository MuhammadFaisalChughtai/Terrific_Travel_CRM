import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/auth.store';
import { formatCurrency } from '@tms/shared-utils';
import { useBookingStore } from '../store/booking.store';
import { Plane, Calendar, Search, Plus, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Flights() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setFlight = useBookingStore((state) => state.setFlight);

  // Search parameters
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureTime, setDepartureTime] = useState('');

  // Admin Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flightNumber, setFlightNumber] = useState('');
  const [price, setPrice] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [deptTime, setDeptTime] = useState('');
  const [arrTime, setArrTime] = useState('');
  const [airlineCode, setAirlineCode] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [airlineCountry, setAirlineCountry] = useState('');
  const [deptAirportCode, setDeptAirportCode] = useState('');
  const [deptAirportName, setDeptAirportName] = useState('');
  const [deptCountry, setDeptCountry] = useState('');
  const [arrAirportCode, setArrAirportCode] = useState('');
  const [arrAirportName, setArrAirportName] = useState('');
  const [arrCountry, setArrCountry] = useState('');

  const isAdminOrAgent = user?.roles?.some(r => ['Admin', 'Manager', 'Agent', 'SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT'].includes(r));

  // Query flights
  const { data: flightsResult, isLoading } = useQuery({
    queryKey: ['flights', departureCity, arrivalCity, departureTime],
    queryFn: async () => {
      const res = await apiClient.get('/flights', {
        params: { departureCity, arrivalCity, departureTime },
      });
      return res.data.data;
    },
  });

  // Create flight mutation
  const createFlightMutation = useMutation({
    mutationFn: async (newFlight: any) => {
      const res = await apiClient.post('/flights', newFlight);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Flight created successfully!');
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      setIsModalOpen(false);
      // Reset form
      setFlightNumber('');
      setPrice('');
      setAvailableSeats('');
      setDeptTime('');
      setArrTime('');
      setAirlineCode('');
      setAirlineName('');
      setAirlineCountry('');
      setDeptAirportCode('');
      setDeptAirportName('');
      setDeptCountry('');
      setArrAirportCode('');
      setArrAirportName('');
      setArrCountry('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create flight');
    },
  });

  const handleCreateFlight = (e: React.FormEvent) => {
    e.preventDefault();
    createFlightMutation.mutate({
      flightNumber,
      price: Number(price),
      availableSeats: Number(availableSeats),
      departureTime: deptTime,
      arrivalTime: arrTime,
      airlineCode,
      airlineName,
      airlineCountry,
      departureAirportCode: deptAirportCode,
      departureAirportName: deptAirportName,
      departureCity: deptAirportCode, // simplifycity
      departureCountry: deptCountry,
      arrivalAirportCode: arrAirportCode,
      arrivalAirportName: arrAirportName,
      arrivalCity: arrAirportCode, // simplifycity
      arrivalCountry: arrCountry,
    });
  };

  const handleBookFlight = (flight: any) => {
    setFlight(flight);
    toast.success(`Selected flight ${flight.flightNumber}. Proceed to Bookings to checkout.`);
  };

  const flights = flightsResult?.items || [];

  return (
    <div className="space-y-6">
      {/* Search Filter Panel */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Search size={18} className="text-primary" />
            Search Outbound Flights
          </h3>
          {isAdminOrAgent && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md shadow-primary/15"
            >
              <Plus size={16} />
              Add Flight
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Departure City</label>
            <input
              type="text"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              placeholder="e.g. JFK or New York"
              className="w-full px-3 py-2 bg-secondary/40 border border-border rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Arrival City</label>
            <input
              type="text"
              value={arrivalCity}
              onChange={(e) => setArrivalCity(e.target.value)}
              placeholder="e.g. LAX or Los Angeles"
              className="w-full px-3 py-2 bg-secondary/40 border border-border rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground uppercase mb-1">Departure Date</label>
            <input
              type="date"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/40 border border-border rounded-xl text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Flights Listing */}
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Searching flights...</div>
      ) : flights.length === 0 ? (
        <div className="p-8 text-center bg-card border border-dashed border-border rounded-2xl text-muted-foreground">
          No flights matching search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {flights.map((flight: any) => (
            <div key={flight.id} className="p-6 bg-card border border-border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <Plane size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{flight.flightNumber}</h4>
                  <p className="text-xs text-muted-foreground">{flight.airline?.name}</p>
                </div>
              </div>

              {/* Time details */}
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="font-bold text-sm">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-xs text-muted-foreground font-semibold">{flight.departureAirport?.code}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Direct</span>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-xs text-muted-foreground font-semibold">{flight.arrivalAirport?.code}</p>
                </div>
              </div>

              {/* Price & Book */}
              <div className="flex items-center gap-6 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-border">
                <div className="text-left md:text-right">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Price</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(flight.price)}</p>
                  <p className="text-[10px] text-muted-foreground">{flight.availableSeats} seats left</p>
                </div>
                <button
                  onClick={() => handleBookFlight(flight)}
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/95 transition-all shadow-md"
                >
                  Book Flight
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add Flight Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-card border border-border p-8 rounded-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary text-muted-foreground">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plane size={22} className="text-primary" />
              Configure Flight Logistics
            </h3>

            <form onSubmit={handleCreateFlight} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Flight Number</label>
                  <input type="text" required value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="e.g. DL102" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Price</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="350.00" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Available Seats</label>
                  <input type="number" required value={availableSeats} onChange={(e) => setAvailableSeats(e.target.value)} placeholder="150" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Airline Code</label>
                  <input type="text" required value={airlineCode} onChange={(e) => setAirlineCode(e.target.value)} placeholder="e.g. DL" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                <div className="col-span-3"><h4 className="text-xs font-bold text-primary uppercase">Airline Info</h4></div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Airline Name</label>
                  <input type="text" required value={airlineName} onChange={(e) => setAirlineName(e.target.value)} placeholder="Delta Air Lines" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Airline Country</label>
                  <input type="text" required value={airlineCountry} onChange={(e) => setAirlineCountry(e.target.value)} placeholder="United States" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="col-span-2"><h4 className="text-xs font-bold text-primary uppercase">Departure Terminal Details</h4></div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Airport Code</label>
                  <input type="text" required value={deptAirportCode} onChange={(e) => setDeptAirportCode(e.target.value)} placeholder="e.g. JFK" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Airport Name</label>
                  <input type="text" required value={deptAirportName} onChange={(e) => setDeptAirportName(e.target.value)} placeholder="John F. Kennedy" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Departure Country</label>
                  <input type="text" required value={deptCountry} onChange={(e) => setDeptCountry(e.target.value)} placeholder="United States" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Departure Time</label>
                  <input type="datetime-local" required value={deptTime} onChange={(e) => setDeptTime(e.target.value)} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="col-span-2"><h4 className="text-xs font-bold text-primary uppercase">Arrival Terminal Details</h4></div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Airport Code</label>
                  <input type="text" required value={arrAirportCode} onChange={(e) => setArrAirportCode(e.target.value)} placeholder="e.g. LAX" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Airport Name</label>
                  <input type="text" required value={arrAirportName} onChange={(e) => setArrAirportName(e.target.value)} placeholder="Los Angeles International" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Arrival Country</label>
                  <input type="text" required value={arrCountry} onChange={(e) => setArrCountry(e.target.value)} placeholder="United States" className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Arrival Time</label>
                  <input type="datetime-local" required value={arrTime} onChange={(e) => setArrTime(e.target.value)} className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none" />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/95 transition-all">
                  Publish Flight
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
