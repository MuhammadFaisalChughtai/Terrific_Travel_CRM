


import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import Modal from './Modal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface HotelReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: () => void;
  accommodationToEdit?: any | null;
}

export interface ParsedHotel {
  hotelName?: string;
  hotelAddress?: string;
  checkInDate?: string;
  checkOutDate?: string;
  roomType?: string;
  mealType?: string;
  price?: string;
  currency?: string;
  confirmationNumber?: string;
  city?: string;
}

export function parseHotelPNRText(text: string, defaultYear: number): ParsedHotel | null {
  if (!text) return null;

  const result: ParsedHotel = {};

  // Hotel Name: HN-
  const hnMatch = text.match(/\/HN-([^/]+)/i);
  if (hnMatch) {
    result.hotelName = hnMatch[1].trim();
  }

  // Hotel Address: AD-
  const adMatch = text.match(/\/AD-([^/]+)/i);
  if (adMatch) {
    result.hotelAddress = adMatch[1].trim();
  }

  // Room Type: RT-
  const rtMatch = text.match(/\/RT-([^/]+)/i);
  if (rtMatch) {
    result.roomType = rtMatch[1].trim();
  }

  // Rate/Price: RQ-
  const rqMatch = text.match(/\/RQ-([^/]+)/i);
  if (rqMatch) {
    const rawRate = rqMatch[1].trim();
    const priceMatch = rawRate.match(/([$£€A-Z]+)?\s*([0-9.]+)/i);
    if (priceMatch) {
      const curSymbol = priceMatch[1] ? priceMatch[1].toUpperCase() : '';
      if (curSymbol.includes('$') || curSymbol.includes('USD')) result.currency = 'USD';
      else if (curSymbol.includes('£') || curSymbol.includes('GBP')) result.currency = 'GBP';
      else if (curSymbol.includes('€') || curSymbol.includes('EUR')) result.currency = 'EUR';
      else if (curSymbol) result.currency = curSymbol;
      
      result.price = priceMatch[2];
    }
  }

  // Confirmation: CF-
  const cfMatch = text.match(/\/CF-([^/]+)/i);
  if (cfMatch) {
    result.confirmationNumber = cfMatch[1].trim();
  }

  // City: HC-
  const hcMatch = text.match(/\/HC-([^/]+)/i);
  if (hcMatch) {
    result.city = hcMatch[1].trim();
  }

  // Dates: e.g. 11JUL-14JUL
  const dateRangeMatch = text.match(/\b([0-9]{1,2})([A-Z]{3})-([0-9]{1,2})([A-Z]{3})\b/i);
  if (dateRangeMatch) {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    const checkInDay = parseInt(dateRangeMatch[1], 10);
    const checkInMonthStr = dateRangeMatch[2].toUpperCase();
    const checkOutDay = parseInt(dateRangeMatch[3], 10);
    const checkOutMonthStr = dateRangeMatch[4].toUpperCase();

    const checkInMonthIndex = monthNames.indexOf(checkInMonthStr);
    const checkOutMonthIndex = monthNames.indexOf(checkOutMonthStr);

    const formatDateStr = (day: number, monthIndex: number) => {
      const d = new Date(defaultYear, monthIndex, day);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    if (checkInMonthIndex !== -1) {
      result.checkInDate = formatDateStr(checkInDay, checkInMonthIndex);
    }
    if (checkOutMonthIndex !== -1) {
      const checkOutYear = checkOutMonthIndex < checkInMonthIndex ? defaultYear + 1 : defaultYear;
      const d = new Date(checkOutYear, checkOutMonthIndex, checkOutDay);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      result.checkOutDate = `${yyyy}-${mm}-${dd}`;
    }
  }

  // SI-TBO or similar for Supplier / Vendor (if we match existing vendor list, e.g. TBO)
  const siMatch = text.match(/\/SI-([^/]+)/i);
  if (siMatch) {
    const supplierCode = siMatch[1].trim().toLowerCase();
    if (supplierCode.includes("tbo")) {
      result.mealType = "Room Only";
    }
  }

  return result;
}

export default function HotelReservationModal({
  isOpen,
  onClose,
  bookingId,
  onSuccess,
  accommodationToEdit = null
}: HotelReservationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pnrText, setPnrText] = useState('');

  // Form States
  const [vendorId, setVendorId] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [city, setCity] = useState('');
  const [roomTypeSelect, setRoomTypeSelect] = useState('Quad Room');
  const [customRoomType, setCustomRoomType] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('16:00');
  const [checkOutTime, setCheckOutTime] = useState('12:00');
  const [mealTypeSelect, setMealTypeSelect] = useState('Room Only');
  const [customMealType, setCustomMealType] = useState('');
  const [price, setPrice] = useState('0');
  const [currency, setCurrency] = useState('');

  // Search suggestion states
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [reservationNumber, setReservationNumber] = useState('');
  const [qty, setQty] = useState('1');
  const [otherCurrency, setOtherCurrency] = useState('');
  const [conversionRate, setConversionRate] = useState('');

  const [refundAmount, setRefundAmount] = useState('0.0');
  const [fineAmount, setFineAmount] = useState('0.0');
  const [issueDate, setIssueDate] = useState('');
  const [hotelConfirmationNumber, setHotelConfirmationNumber] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [lastCancellationDate, setLastCancellationDate] = useState('');

  // Handle open state reset & edit population
  useEffect(() => {
    if (isOpen) {
      setPnrText('');
      if (accommodationToEdit) {
        setVendorId(accommodationToEdit.vendorId || '');
        setHotelName(accommodationToEdit.hotelName || '');
        setCity(accommodationToEdit.city || '');
        
        // Handle Room Type dropdown vs custom
        const standardRoomTypes = ['Single Room', 'Double Room', 'Triple Room', 'Quad Room'];
        if (standardRoomTypes.includes(accommodationToEdit.roomType)) {
          setRoomTypeSelect(accommodationToEdit.roomType);
          setCustomRoomType('');
        } else {
          setRoomTypeSelect('Custom');
          setCustomRoomType(accommodationToEdit.roomType || '');
        }

        // Check in date
        let formattedCheckIn = '';
        if (accommodationToEdit.checkInDate) {
          const d = new Date(accommodationToEdit.checkInDate);
          if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            formattedCheckIn = `${yyyy}-${mm}-${dd}`;
          }
        }
        setCheckInDate(formattedCheckIn);

        // Check out date
        let formattedCheckOut = '';
        if (accommodationToEdit.checkOutDate) {
          const d = new Date(accommodationToEdit.checkOutDate);
          if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            formattedCheckOut = `${yyyy}-${mm}-${dd}`;
          }
        }
        setCheckOutDate(formattedCheckOut);

        setCheckInTime(accommodationToEdit.checkInTime || '16:00');
        setCheckOutTime(accommodationToEdit.checkOutTime || '12:00');

        // Handle Meal Type dropdown vs custom
        const standardMealTypes = ['Room Only', 'Breakfast', 'Half Board', 'Full Board'];
        if (standardMealTypes.includes(accommodationToEdit.mealType)) {
          setMealTypeSelect(accommodationToEdit.mealType);
          setCustomMealType('');
        } else {
          setMealTypeSelect('Custom');
          setCustomMealType(accommodationToEdit.mealType || '');
        }

        setPrice(String(accommodationToEdit.price || '0'));
        setCurrency(accommodationToEdit.currency || '');
        setReservationNumber(accommodationToEdit.reservationNumber || '');
        setQty(String(accommodationToEdit.qty || '1'));
        setOtherCurrency(accommodationToEdit.otherCurrency || '');
        setConversionRate(accommodationToEdit.conversionRate ? String(accommodationToEdit.conversionRate) : '');

        setRefundAmount(String(accommodationToEdit.refundAmount ?? '0.0'));
        setFineAmount(String(accommodationToEdit.fineAmount ?? '0.0'));

        // Issue date
        let formattedIssue = '';
        if (accommodationToEdit.issueDate) {
          const d = new Date(accommodationToEdit.issueDate);
          if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            formattedIssue = `${yyyy}-${mm}-${dd}`;
          }
        }
        setIssueDate(formattedIssue);

        setHotelConfirmationNumber(accommodationToEdit.hotelConfirmationNumber || '');
        setHotelAddress(accommodationToEdit.hotelAddress || '');

        // Last cancellation date
        let formattedCancel = '';
        if (accommodationToEdit.lastCancellationDate) {
          const d = new Date(accommodationToEdit.lastCancellationDate);
          if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            formattedCancel = `${yyyy}-${mm}-${dd}`;
          }
        }
        setLastCancellationDate(formattedCancel);

      } else {
        // Reset states to defaults
        setVendorId('');
        setHotelName('');
        setCity('');
        setRoomTypeSelect('Quad Room');
        setCustomRoomType('');
        setCheckInDate('');
        setCheckOutDate('');
        setCheckInTime('16:00');
        setCheckOutTime('12:00');
        setMealTypeSelect('Room Only');
        setCustomMealType('');
        
        setPrice('0');
        setCurrency('');
        setReservationNumber('');
        setQty('1');
        setOtherCurrency('');
        setConversionRate('');

        setRefundAmount('0.0');
        setFineAmount('0.0');
        setIssueDate('');
        setHotelConfirmationNumber('');
        setHotelAddress('');
        setLastCancellationDate('');
      }
    }
  }, [isOpen, accommodationToEdit]);

  // Fetch Vendors
  const { data: vendorsData, isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors?limit=100');
      return res.data.data.items || [];
    },
    enabled: isOpen
  });

  const hotelVendors = vendorsData?.filter(
    (v: any) => v.vendorType?.toLowerCase() === 'accommodation' || v.vendorType?.toLowerCase() === 'hotel'
  ) || [];

  // Fetch existing hotels list
  const { data: existingHotelsData } = useQuery({
    queryKey: ['existing-hotels', hotelSearchQuery],
    queryFn: async () => {
      const res = await apiClient.get(`/bookings/accommodations/unique-hotels?search=${encodeURIComponent(hotelSearchQuery)}`);
      return res.data.data || [];
    },
    enabled: isOpen && hotelSearchQuery.trim().length > 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    if (!vendorId || !hotelName || !checkInDate || !checkOutDate) {
      toast.error('Please fill in all required fields (Vendor, Hotel Name, Check-in & Check-out dates)');
      return;
    }

    const finalRoomType = roomTypeSelect === 'Custom' ? customRoomType : roomTypeSelect;
    const finalMealType = mealTypeSelect === 'Custom' ? customMealType : mealTypeSelect;

    if (!finalRoomType) {
      toast.error('Please specify a room type');
      return;
    }
    if (!finalMealType) {
      toast.error('Please specify a meal type');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vendorId,
        hotelName,
        city: city || null,
        roomType: finalRoomType,
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
        checkInTime: checkInTime || '16:00',
        checkOutTime: checkOutTime || '12:00',
        mealType: finalMealType,
        price: Number(price) || 0,
        currency: currency || '',
        reservationNumber: reservationNumber || null,
        qty: Number(qty) || 1,
        otherCurrency: otherCurrency || null,
        conversionRate: conversionRate ? Number(conversionRate) : null,
        refundAmount: Number(refundAmount) || 0,
        fineAmount: Number(fineAmount) || 0,
        issueDate: issueDate ? new Date(issueDate).toISOString() : null,
        hotelConfirmationNumber: hotelConfirmationNumber || null,
        hotelAddress: hotelAddress || null,
        lastCancellationDate: lastCancellationDate ? new Date(lastCancellationDate).toISOString() : null,
      };

      if (accommodationToEdit) {
        await apiClient.patch(`/bookings/${bookingId}/accommodations/${accommodationToEdit.id}`, payload);
        toast.success('Hotel reservation updated successfully!');
      } else {
        await apiClient.post(`/bookings/${bookingId}/accommodations`, payload);
        toast.success('Hotel reservation added successfully!');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save hotel reservation');
} finally {
      setIsSubmitting(false);
    }
  };

  const handleParsePNR = () => {
    if (!pnrText.trim()) return;

    const currentYear = new Date().getFullYear();
    const parsed = parseHotelPNRText(pnrText, currentYear);

    if (parsed) {
      if (parsed.hotelName) setHotelName(parsed.hotelName);
      if (parsed.hotelAddress) setHotelAddress(parsed.hotelAddress);
      if (parsed.city) setCity(parsed.city);
      if (parsed.checkInDate) setCheckInDate(parsed.checkInDate);
      if (parsed.checkOutDate) setCheckOutDate(parsed.checkOutDate);
      if (parsed.confirmationNumber) setHotelConfirmationNumber(parsed.confirmationNumber);
      
      if (parsed.roomType) {
        const standardRoomTypes = ['Single Room', 'Double Room', 'Triple Room', 'Quad Room'];
        const matched = standardRoomTypes.find(r => r.toLowerCase() === parsed.roomType?.toLowerCase() || parsed.roomType?.toLowerCase().includes(r.toLowerCase()));
        if (matched) {
          setRoomTypeSelect(matched);
          setCustomRoomType('');
        } else {
          setRoomTypeSelect('Custom');
          setCustomRoomType(parsed.roomType);
        }
      }

      if (parsed.price) setPrice(parsed.price);
      if (parsed.currency) setCurrency(parsed.currency);

      toast.success("Hotel PNR segment successfully parsed and loaded!");
    } else {
      toast.error("Could not parse hotel PNR segment. Please check format.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={accommodationToEdit ? "Edit Accommodation Booking" : "Add Accommodation Booking"}
      maxWidth="4xl"
    >
      {isLoadingVendors ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
          <p className="text-xs font-bold text-muted-foreground">Loading hotel vendors...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs">
          
          {/* GDS PNR / Segment Auto-Fill */}
          <div className="bg-secondary/15 p-4 rounded-xl border border-border space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              GDS PNR / Segment Auto-Fill
            </label>
            <p className="text-[10px] text-muted-foreground">
              Paste the raw hotel PNR segment line here (e.g. from GDS) to automatically parse and fill the details.
            </p>
            <div className="flex gap-2">
              <textarea
                placeholder="e.g. HU 1A HK1 DXB 11JUL-14JUL/SI-TBO/HC-Dubai/HN-Howard Johnson by Wyndham Bur Dubai/AD-Khalid Bin Waleed Rd Bur Dubai Dubai United Arab Em/RT-Standard Queen Room-Non-Smoking/RQ-$72.13/CF-SA6U73"
                value={pnrText}
                onChange={(e) => setPnrText(e.target.value)}
                rows={2}
                className="flex-1 text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none font-mono"
              />
              <button
                type="button"
                onClick={handleParsePNR}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/95 transition-all text-xs flex items-center justify-center self-end"
              >
                Auto-Fill
              </button>
            </div>
          </div>
          
          {/* Section 1: Accommodation Service Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border pb-1.5 tracking-wider">
              Accommodation Service Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hotel Vendor */}
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Hotel Vendor *
                </label>
                <select
                  required
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">-- Select Hotel Vendor --</option>
                  {hotelVendors.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.phoneNumber || 'No phone'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hotel Name */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Madinah Hotel"
                  value={hotelName}
                  onChange={(e) => {
                    setHotelName(e.target.value);
                    setHotelSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    // Delay blur to allow clicking a suggestion
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />

                {showSuggestions && existingHotelsData && existingHotelsData.length > 0 && (
                  <div className="absolute top-[100%] left-0 right-0 z-50 mt-1 max-h-40 overflow-y-auto bg-card border border-border rounded-lg shadow-lg divide-y divide-border/50">
                    {existingHotelsData.map((h: any) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          setHotelName(h.name);
                          setCity(h.city || '');
                          if (h.address) {
                            setHotelAddress(h.address);
                          }
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-secondary/60 text-xs font-medium text-foreground transition-colors flex flex-col"
                      >
                        <span className="font-bold">{h.name}</span>
                        <span className="text-[10px] text-muted-foreground">{h.city}, {h.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* City */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Madinah"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Room Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Room Type *
                </label>
                <select
                  value={roomTypeSelect}
                  onChange={(e) => setRoomTypeSelect(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="Single Room">Single Room</option>
                  <option value="Double Room">Double Room</option>
                  <option value="Triple Room">Triple Room</option>
                  <option value="Quad Room">Quad Room</option>
                  <option value="Custom">Custom Room Type</option>
                </select>
              </div>

              {/* Custom Room Type input */}
              {roomTypeSelect === 'Custom' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Custom Room Type *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom room type"
                    value={customRoomType}
                    onChange={(e) => setCustomRoomType(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-primary rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

              {/* Meal Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Meal Type *
                </label>
                <select
                  value={mealTypeSelect}
                  onChange={(e) => setMealTypeSelect(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="Room Only">Room Only</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Half Board">Half Board</option>
                  <option value="Full Board">Full Board</option>
                  <option value="Custom">Custom Meal Type</option>
                </select>
              </div>

              {/* Custom Meal Type input */}
              {mealTypeSelect === 'Custom' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Custom Meal Type *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom meal type"
                    value={customMealType}
                    onChange={(e) => setCustomMealType(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-primary rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

              {/* Check-In Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Check-In Date *
                </label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Check-Out Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Check-Out Date *
                </label>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Check-In Time */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Check-In Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 16:00"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Check-Out Time */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Check-Out Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12:00"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Reservation Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border pb-1.5 tracking-wider">
              Pricing & Reservation Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Currency
                </label>
                <input
                  type="text"
                  placeholder="e.g. GBP, SAR"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Reservation Number */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Reservation Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. YF8144"
                  value={reservationNumber}
                  onChange={(e) => setReservationNumber(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Qty */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Qty *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Other Currency */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Other Currency
                </label>
                <input
                  type="text"
                  placeholder="e.g. USD, EUR"
                  value={otherCurrency}
                  onChange={(e) => setOtherCurrency(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                  placeholder="e.g. 1.25"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Fine Amount */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Fine Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Hotel Confirmation Number */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Hotel Confirmation Number
                </label>
                <input
                  type="text"
                  placeholder="Confirmation #"
                  value={hotelConfirmationNumber}
                  onChange={(e) => setHotelConfirmationNumber(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Last Cancellation Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Last Cancellation Date
                </label>
                <input
                  type="date"
                  value={lastCancellationDate}
                  onChange={(e) => setLastCancellationDate(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Hotel Address */}
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Hotel Address
                </label>
                <textarea
                  placeholder="Enter hotel full address"
                  value={hotelAddress}
                  onChange={(e) => setHotelAddress(e.target.value)}
                  className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary h-16 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-secondary text-foreground font-bold rounded-lg text-xs hover:bg-secondary/80 transition-all border border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary/95 disabled:opacity-50 transition-all shadow-md flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="animate-spin w-3.5 h-3.5" />}
              {accommodationToEdit ? 'Save Changes' : 'Add Reservation'}
            </button>
          </div>
          
        </form>
      )}
    </Modal>
  );
}
