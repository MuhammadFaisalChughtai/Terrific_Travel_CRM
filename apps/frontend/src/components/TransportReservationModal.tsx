import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import Modal from './Modal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';


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
  const [isReturnFlight, setIsReturnFlight] = useState(false);

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
            // Check if this transport matches return flight pattern (e.g. arrival matches flight departedFrom)
            const isRet = transportToEdit.arrivalDestination?.toUpperCase() === matchedFlight.departedFrom?.toUpperCase();
            setIsReturnFlight(isRet);
          } else {
            setFlightNoSelect('Custom');
            setCustomFlightNo(transportToEdit.flightNo);
            setIsReturnFlight(false);
          }
        } else {
          setFlightNoSelect('');
          setCustomFlightNo('');
          setIsReturnFlight(false);
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
        setIsReturnFlight(false);
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
                <div className="relative flex items-center">
                  <input
                    required
                    type="text"
                    placeholder="e.g. Jeddah Airport"
                    value={departureDestination}
                    onChange={(e) => setDepartureDestination(e.target.value)}
                    className={`w-full text-xs py-1.5 pl-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                      isReturnFlight && booking?.accommodations?.length > 0
                        ? 'pr-[110px]'
                        : 'pr-3'
                    }`}
                  />
                  {isReturnFlight && booking?.accommodations?.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setDepartureDestination(e.target.value);
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
                    className={`w-full text-xs py-1.5 pl-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                      !isReturnFlight && booking?.accommodations?.length > 0
                        ? 'pr-[110px]'
                        : 'pr-3'
                    }`}
                  />
                  {!isReturnFlight && booking?.accommodations?.length > 0 && (
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
                        
                        // Auto-detect return flight: if selected flight is not the first flight in booking
                        const flightIdx = booking?.flightServices?.findIndex(
                          (f: any) => f.flightNo === selectedVal
                        );
                        const isRet = flightIdx > 0;
                        setIsReturnFlight(isRet);

                        const hotelName = booking?.accommodations?.[0]?.hotelName || '';

                        if (isRet) {
                          setDepartureDestination(hotelName);
                          setArrivalDestination(selectedFlight.departedFrom || '');
                          setDepartureTime('');
                          setArrivalTime(selectedFlight.departTime || '');
                        } else {
                          setDepartureDestination(selectedFlight.arrivedAt || '');
                          setArrivalDestination(hotelName);
                          setDepartureTime(selectedFlight.arrivalTime || selectedFlight.departTime || '');
                          setArrivalTime('');
                        }
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

              {/* Is Return Flight Toggle */}
              {flightNoSelect && flightNoSelect !== 'Custom' && (
                <div className="flex items-center gap-2 col-span-2 py-1">
                  <input
                    type="checkbox"
                    id="isReturnFlight"
                    checked={isReturnFlight}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsReturnFlight(checked);
                      
                      const selectedFlight = booking?.flightServices?.find(
                        (f: any) => f.flightNo === flightNoSelect
                      );
                      if (selectedFlight) {
                        const hotelName = booking?.accommodations?.[0]?.hotelName || '';
                        if (checked) {
                          setDepartureDestination(hotelName);
                          setArrivalDestination(selectedFlight.departedFrom || '');
                          setDepartureTime('');
                          setArrivalTime(selectedFlight.departTime || '');
                        } else {
                          setDepartureDestination(selectedFlight.arrivedAt || '');
                          setArrivalDestination(hotelName);
                          setDepartureTime(selectedFlight.arrivalTime || selectedFlight.departTime || '');
                          setArrivalTime('');
                        }
                      }
                    }}
                    className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                  />
                  <label htmlFor="isReturnFlight" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer select-none">
                    This is a return flight transport (Hotel ➔ Airport)
                  </label>
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
  );
}
