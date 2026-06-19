import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import Modal from './Modal';
import { toast } from 'sonner';
import { Loader2, Database, Plus, Pencil, Trash2, Car } from 'lucide-react';

const PREDEFINED_ROUTES = [
  "JEDDAH AIRPORT TO MAKKAH",
  "MAKKAH TO MADINAH",
  "JEDDAH TO MADINAH",
  "MAK HOTEL TO MAK TRS",
  "MAD HOTEL TO MAD TRS",
  "ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO JEDDAH AIRPORT",
  "ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO JEDDAH AIRPORT WITH MAZARAT",
  "ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MADINAH AIRPORT",
  "ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MADINAH AIRPORT WITH MAZARAT",
  "ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MAKKAH TO JEDDAH",
  "ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MAKKAH TO JEDDAH WITH MAZARAT",
  "JEDDAH AIRPORT TO JEDDAH CITY TO JEDDAH AIRPORT",
  "MAKKAH ZIARAT",
  "MADINAH ZIARAT",
  "MADINAH AIRPORT TO MADINAH HOTEL",
  "MADINAH HOTEL TO MADINAH AIRPORT"
];

interface TransportReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  booking: any;
  onSuccess: () => void;
  transportToEdit?: any | null;
}

export default function TransportReservationModal({
  isOpen,
  onClose,
  bookingId,
  booking,
  onSuccess,
  transportToEdit = null
}: TransportReservationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Catalog Sub-modal States
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogVendorId, setCatalogVendorId] = useState('');
  const [isAddingOrEditingCatalogRate, setIsAddingOrEditingCatalogRate] = useState(false);
  const [editingCatalogRate, setEditingCatalogRate] = useState<any>(null);

  // Catalog Form States
  const [catRouteSelect, setCatRouteSelect] = useState('');
  const [catCustomRoute, setCatCustomRoute] = useState('');
  const [catCarPrice, setCatCarPrice] = useState('0');
  const [catH1Price, setCatH1Price] = useState('0');
  const [catGmcPrice, setCatGmcPrice] = useState('0');
  const [catHiacePrice, setCatHiacePrice] = useState('0');
  const [catCoasterPrice, setCatCoasterPrice] = useState('0');
  const [catBusPrice, setCatBusPrice] = useState('0');

  // Form States
  const [vendorId, setVendorId] = useState('');
  const [date, setDate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [departureDestination, setDepartureDestination] = useState('');
  const [arrivalDestination, setArrivalDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  
  // Flight selection dropdown states
  const [flightNoSelect, setFlightNoSelect] = useState('');
  const [customFlightNo, setCustomFlightNo] = useState('');

  const [price, setPrice] = useState('0');
  const [currency, setCurrency] = useState('');
  const [otherCurrency, setOtherCurrency] = useState('');
  const [conversionRate, setConversionRate] = useState('');

  const [refundAmount, setRefundAmount] = useState('0.0');
  const [fineAmount, setFineAmount] = useState('0.0');
  const [issueDate, setIssueDate] = useState('');

  // Format Helper: date object -> YYYY-MM-DD
  const formatDateToInput = (dateVal: any) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Populate form on Edit/Reset on Add
  useEffect(() => {
    if (isOpen) {
      if (transportToEdit) {
        setVendorId(transportToEdit.vendorId || '');
        setDate(formatDateToInput(transportToEdit.date));
        setVehicleType(transportToEdit.vehicleType || '');
        setDepartureDestination(transportToEdit.departureDestination || '');
        setArrivalDestination(transportToEdit.arrivalDestination || '');
        setDepartureTime(transportToEdit.departureTime || '');
        setArrivalTime(transportToEdit.arrivalTime || '');

        // Determine if flight number is in the booking list or needs to be custom
        const matchedFlight = booking?.flightServices?.find(
          (f: any) => f.flightNo === transportToEdit.flightNo
        );

        if (transportToEdit.flightNo) {
          if (matchedFlight) {
            setFlightNoSelect(transportToEdit.flightNo);
            setCustomFlightNo('');
          } else {
            setFlightNoSelect('Custom');
            setCustomFlightNo(transportToEdit.flightNo);
          }
        } else {
          setFlightNoSelect('');
          setCustomFlightNo('');
        }

        setPrice(String(transportToEdit.price || '0'));
        setCurrency(transportToEdit.currency || '');
        setOtherCurrency(transportToEdit.otherCurrency || '');
        setConversionRate(transportToEdit.conversionRate ? String(transportToEdit.conversionRate) : '');
        setRefundAmount(String(transportToEdit.refundAmount ?? '0.0'));
        setFineAmount(String(transportToEdit.fineAmount ?? '0.0'));
        setIssueDate(formatDateToInput(transportToEdit.issueDate));
      } else {
        // Reset states to defaults
        setVendorId('');
        setDate('');
        setVehicleType('');
        setDepartureDestination('');
        setArrivalDestination('');
        setDepartureTime('');
        setArrivalTime('');
        setFlightNoSelect('');
        setCustomFlightNo('');
        setPrice('0');
        setCurrency('');
        setOtherCurrency('');
        setConversionRate('');
        setRefundAmount('0.0');
        setFineAmount('0.0');
        setIssueDate('');
      }
    }
  }, [isOpen, transportToEdit, booking]);

  // Fetch Transport Rates
  const { data: catalogRates = [], refetch: refetchCatalogRates } = useQuery({
    queryKey: ['catalogRates'],
    queryFn: async () => {
      const res = await apiClient.get('/catalog/transports');
      return res.data.data || [];
    },
    enabled: isOpen
  });

  // Filter catalog rates for main modal dropdown selection
  const currentVendorRates = catalogRates.filter((r: any) => r.vendorId === vendorId);

  // Filter catalog rates for sub-modal vendor selection
  const subModalVendorRates = catalogRates.filter((r: any) => r.vendorId === catalogVendorId);

  // Save Transport Rate
  const saveCatalogMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingCatalogRate) {
        return apiClient.patch(`/catalog/transports/${editingCatalogRate.id}`, payload);
      } else {
        return apiClient.post('/catalog/transports', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogRates'] });
      toast.success(editingCatalogRate ? 'Catalog rate updated successfully!' : 'Catalog rate added successfully!');
      setIsAddingOrEditingCatalogRate(false);
      setEditingCatalogRate(null);
      refetchCatalogRates();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save catalog rate');
    }
  });

  // Delete Transport Rate
  const deleteCatalogMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/catalog/transports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogRates'] });
      toast.success('Catalog rate deleted successfully!');
      refetchCatalogRates();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete catalog rate');
    }
  });

  const handleCatalogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const route = catRouteSelect === 'Custom' ? catCustomRoute.trim() : catRouteSelect;

    if (!catalogVendorId || !route) {
      toast.error('Vendor and Route are required');
      return;
    }

    saveCatalogMutation.mutate({
      vendorId: catalogVendorId,
      route,
      carPrice: Number(catCarPrice) || 0,
      h1Price: Number(catH1Price) || 0,
      gmcPrice: Number(catGmcPrice) || 0,
      hiacePrice: Number(catHiacePrice) || 0,
      coasterPrice: Number(catCoasterPrice) || 0,
      busPrice: Number(catBusPrice) || 0,
    });
  };

  const openAddCatalog = () => {
    setEditingCatalogRate(null);
    setCatRouteSelect(PREDEFINED_ROUTES[0]);
    setCatCustomRoute('');
    setCatCarPrice('0');
    setCatH1Price('0');
    setCatGmcPrice('0');
    setCatHiacePrice('0');
    setCatCoasterPrice('0');
    setCatBusPrice('0');
    setIsAddingOrEditingCatalogRate(true);
  };

  const openEditCatalog = (rate: any) => {
    setEditingCatalogRate(rate);
    if (PREDEFINED_ROUTES.includes(rate.route)) {
      setCatRouteSelect(rate.route);
      setCatCustomRoute('');
    } else {
      setCatRouteSelect('Custom');
      setCatCustomRoute(rate.route);
    }
    setCatCarPrice(String(rate.carPrice));
    setCatH1Price(String(rate.h1Price));
    setCatGmcPrice(String(rate.gmcPrice));
    setCatHiacePrice(String(rate.hiacePrice));
    setCatCoasterPrice(String(rate.coasterPrice));
    setCatBusPrice(String(rate.busPrice));
    setIsAddingOrEditingCatalogRate(true);
  };

  // Lookup rate from catalog to auto-fill pricing
  useEffect(() => {
    const lookupRatePrice = async () => {
      if (!vendorId || !vehicleType || !departureDestination || !arrivalDestination) return;

      const routeQuery = `${departureDestination.trim().toUpperCase()} TO ${arrivalDestination.trim().toUpperCase()}`;
      const directRouteQuery = departureDestination.trim().toUpperCase();

      // Find rate locally first
      const localRate = catalogRates.find((r: any) => 
        r.vendorId === vendorId && 
        (r.route.toUpperCase() === routeQuery || r.route.toUpperCase() === directRouteQuery)
      );

      if (localRate) {
        const vType = vehicleType.toLowerCase();
        let priceVal = 0;
        if (vType.includes('car')) priceVal = localRate.carPrice;
        else if (vType.includes('h1')) priceVal = localRate.h1Price;
        else if (vType.includes('gmc')) priceVal = localRate.gmcPrice;
        else if (vType.includes('hiace')) priceVal = localRate.hiacePrice;
        else if (vType.includes('coaster')) priceVal = localRate.coasterPrice;
        else if (vType.includes('bus')) priceVal = localRate.busPrice;

        if (priceVal > 0) {
          setPrice(String(priceVal));
        }
        return;
      }
      
      try {
        const res = await apiClient.get('/catalog/transports/lookup', {
          params: {
            vendorId,
            route: routeQuery
          }
        });

        const rate = res.data.data;
        if (rate) {
          const vType = vehicleType.toLowerCase();
          let priceVal = 0;
          if (vType.includes('car')) priceVal = rate.carPrice;
          else if (vType.includes('h1')) priceVal = rate.h1Price;
          else if (vType.includes('gmc')) priceVal = rate.gmcPrice;
          else if (vType.includes('hiace')) priceVal = rate.hiacePrice;
          else if (vType.includes('coaster')) priceVal = rate.coasterPrice;
          else if (vType.includes('bus')) priceVal = rate.busPrice;

          if (priceVal > 0) {
            setPrice(String(priceVal));
          }
        }
      } catch (err) {
        console.error('Error looking up transport rate:', err);
      }
    };

    lookupRatePrice();
  }, [vendorId, vehicleType, departureDestination, arrivalDestination, catalogRates]);

  // Fetch Vendors
  const { data: vendorsData, isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors?limit=100');
      return res.data.data.items || [];
    },
    enabled: isOpen
  });

  // Filter vendors that are not flights/hotels (i.e. transport/other)
  const transportVendors = vendorsData?.filter((v: any) => {
    const type = v.vendorType?.toLowerCase() || '';
    return type !== 'flight' && type !== 'accommodation' && type !== 'hotel';
  }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorId || !vehicleType || !departureDestination || !arrivalDestination || !date) {
      toast.error('Please fill in all required fields (Vendor, Vehicle Type, Departure & Arrival destinations, Date)');
      return;
    }

    const finalFlightNo = flightNoSelect === 'Custom' ? customFlightNo.trim() : flightNoSelect;

    setIsSubmitting(true);
    try {
      const payload = {
        vendorId,
        vehicleType,
        departureDestination,
        arrivalDestination,
        date: new Date(date).toISOString(),
        departureTime: departureTime || '',
        arrivalTime: arrivalTime || '',
        flightNo: finalFlightNo || null,
        price: Number(price) || 0,
        currency: currency || 'GBP',
        otherCurrency: otherCurrency || null,
        conversionRate: conversionRate ? Number(conversionRate) : null,
        issueDate: issueDate ? new Date(issueDate).toISOString() : null,
        refundAmount: Number(refundAmount) || 0,
        fineAmount: Number(fineAmount) || 0,
      };

      if (transportToEdit) {
        await apiClient.patch(`/bookings/${bookingId}/transports/${transportToEdit.id}`, payload);
        toast.success('Transport service updated successfully!');
      } else {
        await apiClient.post(`/bookings/${bookingId}/transports`, payload);
        toast.success('Transport service added successfully!');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save transport service');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format flight display for select options
  const formatFlightOptionLabel = (f: any) => {
    const dateStr = f.date
      ? new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      : '';
    return `${f.flightNo} (${f.departedFrom} ➔ ${f.arrivedAt}${dateStr ? `, ${dateStr}` : ''})`;
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={transportToEdit ? 'Edit Transport Service' : 'Add Transport Service'}
        maxWidth="2xl"
      >
      {isLoadingVendors ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
          <p className="text-xs font-bold text-muted-foreground">Loading transport vendors...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs max-h-[75vh] overflow-y-auto px-1">
          
          {/* Section 1: Transport Service Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border pb-1.5 tracking-wider">
              Transport Service Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Route Template */}
              <div className="flex flex-col gap-1 col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Route Template (Quick Select)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCatalogVendorId(vendorId || (transportVendors[0]?.id || ''));
                      setIsCatalogOpen(true);
                    }}
                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 transition-all"
                  >
                    <Database size={10} />
                    Configure Rates
                  </button>
                </div>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    if (val.startsWith("CATALOG:")) {
                      const rateId = val.split(":")[1];
                      const matchedRate = currentVendorRates.find((r: any) => r.id === rateId);
                      if (matchedRate) {
                        const routeStr = matchedRate.route;
                        const parts = routeStr.split(" TO ");
                        if (parts.length === 2) {
                          setDepartureDestination(parts[0]);
                          setArrivalDestination(parts[1]);
                        } else {
                          setDepartureDestination(routeStr);
                          setArrivalDestination(routeStr);
                        }
                        
                        // Autofill price if vehicleType matches
                        const vType = vehicleType.toLowerCase();
                        let priceVal = 0;
                        if (vType.includes('car')) priceVal = matchedRate.carPrice;
                        else if (vType.includes('h1')) priceVal = matchedRate.h1Price;
                        else if (vType.includes('gmc')) priceVal = matchedRate.gmcPrice;
                        else if (vType.includes('hiace')) priceVal = matchedRate.hiacePrice;
                        else if (vType.includes('coaster')) priceVal = matchedRate.coasterPrice;
                        else if (vType.includes('bus')) priceVal = matchedRate.busPrice;
                        
                        if (priceVal > 0) {
                          setPrice(String(priceVal));
                        }
                      }
                    } else {
                      const route = val;
                      const parts = route.split(" TO ");
                      if (parts.length === 2) {
                        setDepartureDestination(parts[0]);
                        setArrivalDestination(parts[1]);
                      } else if (route.includes(" ZIARAT")) {
                        setDepartureDestination(route);
                        setArrivalDestination(route);
                      }
                    }
                  }}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer hover:bg-secondary/20 transition-colors"
                  defaultValue=""
                >
                  <option value="">-- Choose Predefined Route --</option>
                  
                  {/* Dynamic Catalog Routes */}
                  {currentVendorRates.length > 0 && (
                    <optgroup label="Catalog Configured Routes">
                      {currentVendorRates.map((r: any) => (
                        <option key={r.id} value={`CATALOG:${r.id}`}>
                          {r.route}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  
                  {/* Standard Static Routes */}
                  <optgroup label="Standard Templates">
                    {PREDEFINED_ROUTES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Transport Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Date *
                </label>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Vehicle Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Vehicle Type *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Hiace, GMC, Bus"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Departure Destination */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Departure Destination *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jeddah Airport"
                  value={departureDestination}
                  onChange={(e) => setDepartureDestination(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Arrival Destination */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Arrival Destination *
                </label>
                <div className="relative flex items-center">
                  <input
                    required
                    type="text"
                    placeholder="e.g. Marriott Hotel Makkah"
                    value={arrivalDestination}
                    onChange={(e) => setArrivalDestination(e.target.value)}
                    className="w-full text-xs py-1.5 pl-3 pr-[110px] bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  {booking?.accommodations?.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setArrivalDestination(e.target.value);
                        }
                      }}
                      className="absolute right-1.5 py-0.5 px-1 bg-secondary/80 border border-border rounded text-[9px] text-muted-foreground focus:outline-none cursor-pointer hover:bg-secondary transition-colors max-w-[100px] truncate"
                      defaultValue=""
                    >
                      <option value="" disabled>-- Select Hotel --</option>
                      {booking.accommodations.map((acc: any) => (
                        <option key={acc.id} value={acc.hotelName}>
                          {acc.hotelName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Departure Time */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Departure Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2315 or 11:15 PM"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Arrival Time */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Arrival Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0230 or 02:30 AM"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Flight Number Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Flight No
                </label>
                <select
                  value={flightNoSelect}
                  onChange={(e) => {
                    const selectedVal = e.target.value;
                    setFlightNoSelect(selectedVal);
                    if (selectedVal !== 'Custom') {
                      setCustomFlightNo('');
                      const selectedFlight = booking?.flightServices?.find(
                        (f: any) => f.flightNo === selectedVal
                      );
                      if (selectedFlight) {
                        setDate(formatDateToInput(selectedFlight.date));
                        setDepartureTime(selectedFlight.arrivalTime || selectedFlight.departTime || '');
                        setDepartureDestination(selectedFlight.arrivedAt || selectedFlight.departedFrom || '');
                      }
                    }
                  }}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">-- None / Select Booking Flight --</option>
                  {booking?.flightServices?.map((f: any) => (
                    <option key={f.id} value={f.flightNo}>
                      {formatFlightOptionLabel(f)}
                    </option>
                  ))}
                  <option value="Custom">Custom Flight Number...</option>
                </select>
              </div>

              {/* Custom Flight Number Input (if Custom selected) */}
              {flightNoSelect === 'Custom' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Custom Flight No *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter Custom Flight No"
                    value={customFlightNo}
                    onChange={(e) => setCustomFlightNo(e.target.value)}
                    className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

            </div>
          </div>

          {/* Section 2: Pricing & Reservation Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border pb-1.5 tracking-wider">
              Pricing & Reservation Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Price */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Price *
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Currency
                </label>
                <input
                  type="text"
                  placeholder="e.g. GBP, SAR, USD"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Other Currency */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Other Currency
                </label>
                <input
                  type="text"
                  placeholder="e.g. 350"
                  value={otherCurrency}
                  onChange={(e) => setOtherCurrency(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Conversion Rate */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Conversion Rate
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 4.8"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

            </div>
          </div>

          {/* Section 3: Financial & Administrative Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border pb-1.5 tracking-wider">
              Financial & Administrative Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Refund Amount */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Refund Amount
                </label>
                <input
                  type="number"
                  step="any"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Fine Amount */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Fine Amount
                </label>
                <input
                  type="number"
                  step="any"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Issue Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Vendor */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Vendor *
                </label>
                <select
                  required
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">-- Select Transport Vendor --</option>
                  {transportVendors.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.vendorType || 'Transport'})
                    </option>
                  ))}
                  {/* Fallback if no specific transport vendor exists yet to avoid blocking selection */}
                  {transportVendors.length === 0 && vendorsData?.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.vendorType})
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-border text-foreground hover:bg-secondary rounded-lg font-bold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="animate-spin w-3 h-3" />}
              {transportToEdit ? 'Save Changes' : 'Add Transport'}
            </button>
          </div>

        </form>
      )}
    </Modal>

    {/* Catalog Configuration Sub-modal */}
    <Modal
      isOpen={isCatalogOpen}
      onClose={() => {
        setIsCatalogOpen(false);
        setIsAddingOrEditingCatalogRate(false);
        setEditingCatalogRate(null);
        refetchCatalogRates();
      }}
      title="Manage Predefined Transport Rates"
      maxWidth="4xl"
    >
      <div className="space-y-6 font-sans text-xs max-h-[70vh] overflow-y-auto px-1">
        {isAddingOrEditingCatalogRate ? (
          /* Add/Edit Rate Form */
          <form onSubmit={handleCatalogSubmit} className="space-y-4">
            <div className="border-b border-border pb-2 mb-4">
              <h4 className="font-bold text-foreground text-[11px] uppercase tracking-wider text-primary">
                {editingCatalogRate ? 'Edit Route Rate' : 'Add Route Rate'}
              </h4>
              <p className="text-[10px] text-muted-foreground">
                Define vehicle rates for this vendor and route template.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Route Selector */}
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Route Template *
                </label>
                <select
                  required
                  value={catRouteSelect}
                  onChange={(e) => {
                    setCatRouteSelect(e.target.value);
                    if (e.target.value !== 'Custom') {
                      setCatCustomRoute('');
                    }
                  }}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="" disabled>-- Select Route Template --</option>
                  {PREDEFINED_ROUTES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="Custom">Custom Route...</option>
                </select>
              </div>

              {/* Custom Route Input */}
              {catRouteSelect === 'Custom' && (
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Custom Route Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. JEDDAH AIRPORT TO MECCAH HOTEL"
                    value={catCustomRoute}
                    onChange={(e) => setCatCustomRoute(e.target.value)}
                    className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

              {/* Rates Grid */}
              <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Car (GBP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={catCarPrice}
                    onChange={(e) => setCatCarPrice(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    H1 (GBP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={catH1Price}
                    onChange={(e) => setCatH1Price(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    GMC (GBP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={catGmcPrice}
                    onChange={(e) => setCatGmcPrice(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Hiace (GBP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={catHiacePrice}
                    onChange={(e) => setCatHiacePrice(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Coaster (GBP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={catCoasterPrice}
                    onChange={(e) => setCatCoasterPrice(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    Bus (GBP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={catBusPrice}
                    onChange={(e) => setCatBusPrice(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setIsAddingOrEditingCatalogRate(false);
                  setEditingCatalogRate(null);
                }}
                className="px-4 py-1.5 border border-border text-foreground hover:bg-secondary rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveCatalogMutation.isPending}
                className="flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg font-bold transition-all disabled:opacity-50"
              >
                {saveCatalogMutation.isPending && <Loader2 className="animate-spin w-3 h-3" />}
                {editingCatalogRate ? 'Update Rate' : 'Add Rate'}
              </button>
            </div>
          </form>
        ) : (
          /* View Rates List */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              {/* Vendor Dropdown */}
              <div className="flex flex-col gap-1 w-full sm:max-w-xs">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Select Transport Vendor
                </label>
                <select
                  value={catalogVendorId}
                  onChange={(e) => setCatalogVendorId(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="" disabled>-- Choose Vendor --</option>
                  {transportVendors.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={openAddCatalog}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg font-bold transition-all shadow-sm self-start sm:self-end text-[10px]"
              >
                <Plus size={12} /> Add Route Rate
              </button>
            </div>

            {/* Table of Rates */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border font-bold uppercase tracking-wider text-muted-foreground text-[9px]">
                      <th className="px-4 py-2">Transportation Route</th>
                      <th className="px-2 py-2 text-right">Car</th>
                      <th className="px-2 py-2 text-right">H1</th>
                      <th className="px-2 py-2 text-right">GMC</th>
                      <th className="px-2 py-2 text-right">Hiace</th>
                      <th className="px-2 py-2 text-right">Coaster</th>
                      <th className="px-2 py-2 text-right">Bus</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {subModalVendorRates.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground font-bold text-xs">
                          No rates configured for this vendor. Click "Add Route Rate" to add one.
                        </td>
                      </tr>
                    ) : (
                      subModalVendorRates.map((rate: any) => (
                        <tr key={rate.id} className="hover:bg-secondary/10 transition-colors">
                          <td className="px-4 py-2 font-bold text-foreground max-w-[200px] truncate" title={rate.route}>
                            {rate.route}
                          </td>
                          <td className="px-2 py-2 text-right font-medium text-foreground">£{rate.carPrice}</td>
                          <td className="px-2 py-2 text-right font-medium text-foreground">£{rate.h1Price}</td>
                          <td className="px-2 py-2 text-right font-medium text-foreground">£{rate.gmcPrice}</td>
                          <td className="px-2 py-2 text-right font-medium text-foreground">£{rate.hiacePrice}</td>
                          <td className="px-2 py-2 text-right font-medium text-foreground">£{rate.coasterPrice}</td>
                          <td className="px-2 py-2 text-right font-medium text-foreground">£{rate.busPrice}</td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditCatalog(rate)}
                                className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                                title="Edit Rate"
                              >
                                <Pencil size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this route rate from the catalog?')) {
                                    deleteCatalogMutation.mutate(rate.id);
                                  }
                                }}
                                className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                title="Delete Rate"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCatalogOpen(false);
                  refetchCatalogRates();
                }}
                className="px-4 py-1.5 bg-secondary text-foreground hover:bg-secondary/80 rounded-lg font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  </>
  );
}
