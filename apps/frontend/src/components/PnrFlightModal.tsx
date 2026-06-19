import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import Modal from './Modal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PnrFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingYear: number;
  onSuccess: () => void;
  flightToEdit?: any | null;
}

interface ParsedFlight {
  flightNo: string;
  pnr: string;
  departedFrom: string;
  arrivedAt: string;
  departTime: string;
  arrivalTime: string;
  date: string; // YYYY-MM-DD
  flightClass: string;
}

export function parsePNRText(text: string, defaultYear: number): ParsedFlight | null {
  if (!text) return null;

  // Regex pattern for standard segment:
  // e.g. SV 116 Y 17JUN JEDRUH DK1 1230 1400
  const segmentRegex = /([A-Z0-9]{2})\s*([0-9]{1,4})\s+([A-Z])\s+([0-9]{1,2})([A-Z]{3})\s+([A-Z]{3})[\s/]*([A-Z]{3})\s*(?:[A-Z]{2}\d+)?\s*([0-9]{2}:?[0-9]{2})\s+([0-9]{2}:?[0-9]{2})/i;

  const match = text.match(segmentRegex);
  if (!match) return null;

  const airline = match[1].toUpperCase();
  const flightNum = match[2];
  const flightClass = match[3].toUpperCase();
  const day = parseInt(match[4], 10);
  const monthStr = match[5].toUpperCase();
  const departedFrom = match[6].toUpperCase();
  const arrivedAt = match[7].toUpperCase();
  const rawDepartTime = match[8];
  const rawArrivalTime = match[9];

  // Parse Month
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const monthIndex = monthNames.indexOf(monthStr);
  let formattedDate = '';
  if (monthIndex !== -1) {
    const d = new Date(defaultYear, monthIndex, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    formattedDate = `${yyyy}-${mm}-${dd}`;
  }

  // Format times: e.g. 1230 -> 12:30
  const formatTime = (t: string) => {
    const clean = t.replace(':', '');
    if (clean.length === 4) {
      return `${clean.substring(0, 2)}:${clean.substring(2, 4)}`;
    }
    return t;
  };

  // Try to find a 6-character PNR record locator
  let pnr = '';
  const rlMatch = text.match(/(?:RL|RECORD|LOCATOR|BOOKING REF|PNR)[:\s]+([A-Z0-9]{6})/i);
  if (rlMatch) {
    pnr = rlMatch[1].toUpperCase();
  } else {
    const allSixCharWords = text.match(/\b([A-Z0-9]{6})\b/g);
    if (allSixCharWords) {
      const candidate = allSixCharWords.find(w => {
        const isRoute = w === `${departedFrom}${arrivedAt}` || w === `${arrivedAt}${departedFrom}`;
        return !isRoute && !/^\d+$/.test(w);
      });
      if (candidate) {
        pnr = candidate.toUpperCase();
      }
    }
  }

  return {
    flightNo: `${airline} ${flightNum}`,
    pnr,
    departedFrom,
    arrivedAt,
    departTime: formatTime(rawDepartTime),
    arrivalTime: formatTime(rawArrivalTime),
    date: formattedDate,
    flightClass
  };
}

export default function PnrFlightModal({
  isOpen,
  onClose,
  bookingId,
  bookingYear,
  onSuccess,
  flightToEdit = null
}: PnrFlightModalProps) {
  const [step, setStep] = useState<'pnr' | 'form'>('pnr');
  const [pnrText, setPnrText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [vendorId, setVendorId] = useState('');
  const [flightNo, setFlightNo] = useState('');
  const [pnr, setPnr] = useState('');
  const [departedFrom, setDepartedFrom] = useState('');
  const [arrivedAt, setArrivedAt] = useState('');
  const [departTime, setDepartTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [date, setDate] = useState('');
  const [flightClass, setFlightClass] = useState('Y');
  const [price, setPrice] = useState('0');
  const [baggage, setBaggage] = useState('23 KG');
  const [carryOnBaggage, setCarryOnBaggage] = useState('7 KG');
  const [checkedBaggage, setCheckedBaggage] = useState('');
  const [issueDate, setIssueDate] = useState('');

  // Handle open state reset & edit population
  useEffect(() => {
    if (isOpen) {
      if (flightToEdit) {
        setStep('form');
        setVendorId(flightToEdit.vendorId || '');
        setFlightNo(flightToEdit.flightNo || '');
        setPnr(flightToEdit.pnr || '');
        const initialDeparted = flightToEdit.departedFrom || '';
        const initialArrived = flightToEdit.arrivedAt || '';
        setDepartedFrom(initialDeparted);
        setArrivedAt(initialArrived);

        if (initialDeparted.trim().length === 3) {
          apiClient.get(`/flights/airports/${initialDeparted.trim()}`)
            .then(res => {
              if (res.data?.success && res.data?.data?.name) {
                setDepartedFrom(`${res.data.data.name} (${res.data.data.code.toUpperCase()})`);
              }
            })
            .catch(err => console.warn(err));
        }

        if (initialArrived.trim().length === 3) {
          apiClient.get(`/flights/airports/${initialArrived.trim()}`)
            .then(res => {
              if (res.data?.success && res.data?.data?.name) {
                setArrivedAt(`${res.data.data.name} (${res.data.data.code.toUpperCase()})`);
              }
            })
            .catch(err => console.warn(err));
        }

        setDepartTime(flightToEdit.departTime || '');
        setArrivalTime(flightToEdit.arrivalTime || '');
        
        let formattedDate = '';
        if (flightToEdit.date) {
          const d = new Date(flightToEdit.date);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          formattedDate = `${yyyy}-${mm}-${dd}`;
        }
        setDate(formattedDate);
        
        setFlightClass(flightToEdit.flightClass || 'Y');
        setPrice(String(flightToEdit.price || '0'));
        setBaggage(flightToEdit.baggage || '');
        setCarryOnBaggage(flightToEdit.carryOnBaggage || '');
        setCheckedBaggage(flightToEdit.checkedBaggage || '');

        let formattedIssueDate = '';
        if (flightToEdit.issueDate) {
          const d = new Date(flightToEdit.issueDate);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          formattedIssueDate = `${yyyy}-${mm}-${dd}`;
        }
        setIssueDate(formattedIssueDate);
      } else {
        setStep('pnr');
        setPnrText('');
        setVendorId('');
        setFlightNo('');
        setPnr('');
        setDepartedFrom('');
        setArrivedAt('');
        setDepartTime('');
        setArrivalTime('');
        setDate('');
        setFlightClass('Y');
        setPrice('0');
        setBaggage('23 KG');
        setCarryOnBaggage('7 KG');
        setCheckedBaggage('');
        setIssueDate('');
      }
    }
  }, [isOpen, flightToEdit]);

  // Fetch Vendors
  const { data: vendorsData, isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors?limit=100');
      return res.data.data.items || [];
    },
    enabled: isOpen
  });

  const flightVendors = vendorsData?.filter((v: any) => v.vendorType?.toLowerCase() === 'flight') || [];

  const handleDepartedFromChange = async (val: string) => {
    setDepartedFrom(val);
    if (val.trim().length === 3) {
      try {
        const res = await apiClient.get(`/flights/airports/${val.trim()}`);
        if (res.data?.success && res.data?.data?.name) {
          setDepartedFrom(`${res.data.data.name} (${res.data.data.code.toUpperCase()})`);
        }
      } catch (err) {
        // Ignore lookup error when typing
      }
    }
  };

  const handleArrivedAtChange = async (val: string) => {
    setArrivedAt(val);
    if (val.trim().length === 3) {
      try {
        const res = await apiClient.get(`/flights/airports/${val.trim()}`);
        if (res.data?.success && res.data?.data?.name) {
          setArrivedAt(`${res.data.data.name} (${res.data.data.code.toUpperCase()})`);
        }
      } catch (err) {
        // Ignore lookup error when typing
      }
    }
  };

  const handleConvert = async () => {
    const parsed = parsePNRText(pnrText, bookingYear);
    if (parsed) {
      setFlightNo(parsed.flightNo);
      setPnr(parsed.pnr);
      
      let finalDeparted = parsed.departedFrom;
      let finalArrived = parsed.arrivedAt;

      try {
        const depRes = await apiClient.get(`/flights/airports/${parsed.departedFrom}`);
        if (depRes.data?.success && depRes.data?.data?.name) {
          finalDeparted = `${depRes.data.data.name} (${depRes.data.data.code.toUpperCase()})`;
        }
      } catch (err) {
        console.warn(`Failed to fetch departure airport for code: ${parsed.departedFrom}`, err);
      }

      try {
        const arrRes = await apiClient.get(`/flights/airports/${parsed.arrivedAt}`);
        if (arrRes.data?.success && arrRes.data?.data?.name) {
          finalArrived = `${arrRes.data.data.name} (${arrRes.data.data.code.toUpperCase()})`;
        }
      } catch (err) {
        console.warn(`Failed to fetch arrival airport for code: ${parsed.arrivedAt}`, err);
      }

      setDepartedFrom(finalDeparted);
      setArrivedAt(finalArrived);
      setDepartTime(parsed.departTime);
      setArrivalTime(parsed.arrivalTime);
      setDate(parsed.date);
      setFlightClass(parsed.flightClass);
      toast.success("PNR converted successfully!");
      setStep('form');
    } else {
      toast.error("Could not parse PNR format. You can fill the details manually.");
      setStep('form');
    }
  };

  const handleManualEntry = () => {
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) {
      toast.error("Please select a vendor");
      return;
    }
    if (!flightNo || !departedFrom || !arrivedAt || !date) {
      toast.error("Please fill in all required fields (Flight No, Route, Date)");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vendorId,
        flightNo,
        pnr,
        departedFrom,
        arrivedAt,
        departTime,
        arrivalTime,
        date: new Date(date).toISOString(),
        flightClass,
        price: Number(price) || 0,
        baggage: baggage || null,
        carryOnBaggage: carryOnBaggage || null,
        checkedBaggage: checkedBaggage || null,
        issueDate: issueDate ? new Date(issueDate).toISOString() : null,
      };

      if (flightToEdit) {
        await apiClient.patch(`/bookings/${bookingId}/flights/${flightToEdit.id}`, payload);
        toast.success("Flight service updated successfully!");
      } else {
        await apiClient.post(`/bookings/${bookingId}/flights`, payload);
        toast.success("Flight service added successfully!");
      }

      onSuccess();
      onClose();
      
      // Reset Modal State
      setStep('pnr');
      setPnrText('');
      setVendorId('');
      setFlightNo('');
      setPnr('');
      setDepartedFrom('');
      setArrivedAt('');
      setDepartTime('');
      setArrivalTime('');
      setDate('');
      setFlightClass('Y');
      setPrice('0');
      setBaggage('');
      setCarryOnBaggage('');
      setCheckedBaggage('');
      setIssueDate('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save flight service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={flightToEdit ? "Edit Flight Details" : "PNR Converter & Add Flight"}
      maxWidth="2xl"
    >
      {step === 'pnr' ? (
        <div className="space-y-4 font-sans text-xs">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <h4 className="font-bold text-foreground mb-1 uppercase tracking-wider text-[10px]">
              GDS PNR Raw Data
            </h4>
            <p className="text-[10px] text-muted-foreground mb-2">
              Paste your raw GDS PNR segment details (Amadeus, Sabre, Galileo format) to auto-populate the form.
            </p>
            <textarea
              className="w-full h-32 p-2.5 border border-border rounded-lg text-xs focus:ring-1 focus:ring-primary focus:border-primary bg-background text-foreground shadow-inner"
              placeholder="e.g. 1.SV 116 Y 17JUN JEDRUH DK1 1230 1400"
              value={pnrText}
              onChange={(e) => setPnrText(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center gap-2 pt-2">
            <button
              onClick={handleManualEntry}
              className="px-4 py-1.5 bg-secondary text-foreground font-bold rounded-lg text-xs hover:bg-secondary/80 transition-all border border-border"
            >
              Enter Manually
            </button>
            <button
              onClick={handleConvert}
              disabled={!pnrText.trim()}
              className="px-5 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary/95 disabled:opacity-50 transition-all shadow-md"
            >
              Convert & Continue
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 font-sans text-xs">
          {isLoadingVendors ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2">
              <Loader2 className="animate-spin text-primary w-6 h-6" />
              <p className="text-[10px] font-bold text-muted-foreground">Loading flight vendors...</p>
            </div>
          ) : (
            <>
              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Vendor Dropdown */}
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Flight Vendor *
                  </label>
                  <select
                    required
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">-- Select Flight Vendor --</option>
                    {flightVendors.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.phoneNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Flight Number */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Flight Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SV 116"
                    value={flightNo}
                    onChange={(e) => setFlightNo(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* PNR Code */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    PNR / Record Locator
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ABCD12"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Departed From */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Departed From *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. London Heathrow Airport"
                    value={departedFrom}
                    onChange={(e) => handleDepartedFromChange(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Arrived At */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Arrived At *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. King Abdulaziz International Airport"
                    value={arrivedAt}
                    onChange={(e) => handleArrivedAtChange(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Depart Time */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Departure Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12:30"
                    value={departTime}
                    onChange={(e) => setDepartTime(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Arrive Time */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Arrival Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 14:00"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Flight Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Flight Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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

                {/* Flight Class */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Flight Class
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Y"
                    value={flightClass}
                    onChange={(e) => setFlightClass(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1 bg-secondary/10 p-2.5 rounded-lg border border-border/40 col-span-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Vendor Cost Price (GBP) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-bold text-foreground w-full"
                  />
                </div>

                {/* Checked-in Bag */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Checked-in Bag
                  </label>
                  <input
                    type="text"
                    placeholder="23 KG"
                    value={baggage}
                    onChange={(e) => setBaggage(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Carry On Baggage */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Carry-on Baggage
                  </label>
                  <input
                    type="text"
                    placeholder="7 KG"
                    value={carryOnBaggage}
                    onChange={(e) => setCarryOnBaggage(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center gap-2 pt-3 border-t border-border/60">
                {!flightToEdit ? (
                  <button
                    type="button"
                    onClick={() => setStep('pnr')}
                    className="px-4 py-1.5 bg-secondary text-foreground font-bold rounded-lg text-xs hover:bg-secondary/80 transition-all border border-border"
                  >
                    Back to PNR
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary/95 disabled:opacity-50 transition-all shadow-md"
                >
                  {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                  {flightToEdit ? "Save Changes" : "Add Flight Service"}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </Modal>
  );
}
