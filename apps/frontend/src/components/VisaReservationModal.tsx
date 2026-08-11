import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/auth.store';
import Modal from './Modal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface VisaReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  booking: any;
  onSuccess: () => void;
  visaToEdit?: any | null;
}

export default function VisaReservationModal({
  isOpen,
  onClose,
  bookingId,
  booking,
  onSuccess,
  visaToEdit = null
}: VisaReservationModalProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles?.some(r => ['ADMIN', 'SUPER_ADMIN', 'Admin', 'Super Admin'].includes(r));
  const isPriceDisabled = !!visaToEdit && !isAdmin;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [vendorId, setVendorId] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [isManualPassport, setIsManualPassport] = useState(true);
  const [selectedPassports, setSelectedPassports] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visaType, setVisaType] = useState('');
  const [visaNumber, setVisaNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [price, setPrice] = useState('0');
  const [agentQuotedPrice, setAgentQuotedPrice] = useState('');
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [otherCurrencyType, setOtherCurrencyType] = useState('SAR');
  const [otherCurrencyAmount, setOtherCurrencyAmount] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [refundAmount, setRefundAmount] = useState('0.0');
  const [fineAmount, setFineAmount] = useState('0.0');

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

  // Populate form on Edit / Reset on Add
  useEffect(() => {
    if (isOpen) {
      if (visaToEdit) {
        setVendorId(visaToEdit.vendorId || '');
        setPassportNumber(visaToEdit.passportNumber || '');
        setIsManualPassport(true);
        setSelectedPassports([]);
        setSearchQuery('');
        setVisaType(visaToEdit.visaType || '');
        setVisaNumber(visaToEdit.visaNumber || '');
        setIssueDate(formatDateToInput(visaToEdit.issueDate));
        setExpiryDate(formatDateToInput(visaToEdit.expiryDate));
        setPrice(String(visaToEdit.price || '0'));
        setAgentQuotedPrice(visaToEdit.agentQuotedPrice !== undefined && visaToEdit.agentQuotedPrice !== null ? String(visaToEdit.agentQuotedPrice) : '');
        setConfirmationNumber(visaToEdit.confirmationNumber || '');
        setCurrency(visaToEdit.currency || '');
        setOtherCurrencyType(visaToEdit.otherCurrencyType || visaToEdit.otherCurrency || 'SAR');
        setOtherCurrencyAmount(visaToEdit.otherCurrencyAmount ? String(visaToEdit.otherCurrencyAmount) : (visaToEdit.otherCurrency && !isNaN(Number(visaToEdit.otherCurrency)) ? visaToEdit.otherCurrency : ''));
        setConversionRate(visaToEdit.conversionRate ? String(visaToEdit.conversionRate) : '');
        setRefundAmount(String(visaToEdit.refundAmount ?? '0.0'));
        setFineAmount(String(visaToEdit.fineAmount ?? '0.0'));
      } else {
        // Reset states to defaults
        setVendorId('');
        setPassportNumber('');
        setIsManualPassport(!booking?.passengers || booking.passengers.length === 0);
        setSelectedPassports([]);
        setSearchQuery('');
        setVisaType('');
        setVisaNumber('');
        setIssueDate('');
        setExpiryDate('');
        setPrice('0');
        setAgentQuotedPrice('');
        setConfirmationNumber('');
        setCurrency('GBP');
        setOtherCurrencyType('SAR');
        setOtherCurrencyAmount('');
        setConversionRate('');
        setRefundAmount('0.0');
        setFineAmount('0.0');
      }
    }
  }, [isOpen, visaToEdit, booking]);

  const filteredPassengers = (booking?.passengers || []).filter((p: any) => {
    const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           (p.passportNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Fetch Vendors
  const { data: vendorsData, isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors?limit=100');
      return res.data.data.items || [];
    },
    enabled: isOpen
  });

  // Filter vendors that are Visa vendors
  const visaVendors = vendorsData?.filter((v: any) => {
    const type = v.vendorType?.toLowerCase() || '';
    return type === 'visa' || type === 'other' || type === 'custom';
  }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorId || !visaType || !price) {
      toast.error('Please fill in all required fields (Vendor, Visa Type, Price)');
      return;
    }

    if (visaToEdit || isManualPassport) {
      if (!passportNumber.trim()) {
        toast.error('Please enter a passport number');
        return;
      }
    } else {
      if (selectedPassports.length === 0) {
        toast.error('Please select at least one passenger or enter a passport manually.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const basePayload = {
        vendorId,
        visaType,
        visaNumber: visaNumber || '',
        issueDate: issueDate ? new Date(issueDate).toISOString() : null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        price: Number(price) || 0,
        currency: currency || 'GBP',
        otherCurrencyAmount: otherCurrencyAmount ? Number(otherCurrencyAmount) : null,
        otherCurrencyType: otherCurrencyType || null,
        otherCurrency: otherCurrencyAmount ? String(otherCurrencyAmount) : (otherCurrencyType || null),
        conversionRate: conversionRate ? Number(conversionRate) : null,
        refundAmount: Number(refundAmount) || 0,
        fineAmount: Number(fineAmount) || 0,
        agentQuotedPrice: agentQuotedPrice ? Number(agentQuotedPrice) : null,
        confirmationNumber: confirmationNumber || null,
      };

      if (visaToEdit) {
        await apiClient.patch(`/bookings/${bookingId}/visas/${visaToEdit.id}`, {
          ...basePayload,
          passportNumber: passportNumber.trim(),
        });
        toast.success('Visa service updated successfully!');
      } else if (isManualPassport) {
        await apiClient.post(`/bookings/${bookingId}/visas`, {
          ...basePayload,
          passportNumber: passportNumber.trim(),
        });
        toast.success('Visa service added successfully!');
      } else {
        // Multi mode
        const promises = selectedPassports.map((sp) => {
          return apiClient.post(`/bookings/${bookingId}/visas`, {
            ...basePayload,
            passportNumber: sp.passportNumber,
          });
        });
        await Promise.all(promises);
        toast.success(`${selectedPassports.length} Visa services added successfully!`);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save visa service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={visaToEdit ? 'Edit Visa Service' : 'Add Visa Service'}
      maxWidth="4xl"
    >
      {isLoadingVendors ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-primary w-6 h-6" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          
          {/* Section 1: Visa Service Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border pb-1.5 tracking-wider">
              Visa Service Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Passport Selection */}
              {visaToEdit ? (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Passport Number *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter Passport Number"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              ) : (
                <div className="md:col-span-2 flex flex-col gap-2 p-3 bg-secondary/5 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Passport / Passenger Selection
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        id="manual-passport-toggle"
                        checked={isManualPassport}
                        onChange={(e) => {
                          setIsManualPassport(e.target.checked);
                          if (e.target.checked) {
                            setSelectedPassports([]);
                          }
                        }}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20"
                      />
                      <label htmlFor="manual-passport-toggle" className="text-[11px] font-bold text-foreground cursor-pointer">
                        Enter Passport manually
                      </label>
                    </div>
                  </div>

                  {isManualPassport ? (
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Passport Number *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Enter Passport Number"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        placeholder="Search Passenger by Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      
                      <div className="max-h-28 overflow-y-auto border border-border rounded-lg p-2 bg-background space-y-1 custom-scrollbar">
                        {filteredPassengers.length > 0 ? (
                          <>
                             <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                              <input
                                type="checkbox"
                                id="select-all-passengers"
                                checked={selectedPassports.length === filteredPassengers.filter((p: any) => p.passportNumber).length && filteredPassengers.filter((p: any) => p.passportNumber).length > 0}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedPassports(filteredPassengers.filter((p: any) => p.passportNumber));
                                  } else {
                                    setSelectedPassports([]);
                                  }
                                }}
                                className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20"
                              />
                              <label htmlFor="select-all-passengers" className="text-[11px] font-bold text-foreground cursor-pointer">
                                Select All Matching ({filteredPassengers.filter((p: any) => p.passportNumber).length})
                              </label>
                            </div>
                            {filteredPassengers.map((p: any) => {
                              const isSelected = selectedPassports.some((sp) => sp.id === p.id);
                              return (
                                <div key={p.id} className="flex items-center gap-2 hover:bg-secondary/20 p-1 rounded transition-colors">
                                  <input
                                    type="checkbox"
                                    id={`passenger-${p.id}`}
                                    checked={isSelected}
                                    disabled={!p.passportNumber}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedPassports((prev) => [...prev, p]);
                                      } else {
                                        setSelectedPassports((prev) => prev.filter((sp) => sp.id !== p.id));
                                      }
                                    }}
                                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20"
                                  />
                                  <label
                                    htmlFor={`passenger-${p.id}`}
                                    className={`text-xs cursor-pointer flex-1 flex justify-between items-center ${!p.passportNumber ? 'text-muted-foreground' : 'text-foreground'}`}
                                  >
                                    <span>{p.title ? `${p.title} ` : ''}{p.firstName} {p.lastName}</span>
                                    <span className="font-mono text-[10px] bg-secondary/40 px-1 rounded">
                                      {p.passportNumber || 'No Passport Number'}
                                    </span>
                                  </label>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <p className="text-center py-2 text-muted-foreground italic text-xs">
                            No passengers matching "{searchQuery}" found in this booking.
                          </p>
                        )}
                      </div>
                      
                      {selectedPassports.length > 0 && (
                        <div className="text-[11px] text-muted-foreground mt-1 flex flex-wrap gap-1 items-center">
                          <span className="font-bold text-foreground">Selected ({selectedPassports.length}):</span>
                          {selectedPassports.map((sp) => (
                            <span key={sp.id} className="bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              {sp.firstName} ({sp.passportNumber})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Visa Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Visa Type *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. E Wavier visa"
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Visa Number */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Visa Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Visa Number"
                  value={visaNumber}
                  onChange={(e) => setVisaNumber(e.target.value)}
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

              {/* Expiry Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

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
                  disabled={isPriceDisabled}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                    isPriceDisabled ? 'opacity-65 cursor-not-allowed bg-secondary/30' : ''
                  }`}
                />
                {isPriceDisabled && (
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                    🔒 Price can only be edited by Admin / Super Admin
                  </span>
                )}
              </div>

              {/* Agent Quoted Price */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Agent Quoted Price
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={agentQuotedPrice}
                  onChange={(e) => setAgentQuotedPrice(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Confirmation Number */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Confirmation Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Confirmation Number"
                  value={confirmationNumber}
                  onChange={(e) => setConfirmationNumber(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              {/* Other Currency Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Other Currency Type
                </label>
                <select
                  value={otherCurrencyType}
                  onChange={(e) => setOtherCurrencyType(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              {/* Other Currency Amount */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Other Currency Amount
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={otherCurrencyAmount}
                  onChange={(e) => setOtherCurrencyAmount(e.target.value)}
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
                  <option value="">-- Select Visa Vendor --</option>
                  {visaVendors.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.vendorType || 'Visa'})
                    </option>
                  ))}
                  {/* Fallback to show all vendors if no specific Visa vendor exists */}
                  {visaVendors.length === 0 && vendorsData?.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.vendorType})
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky -bottom-5 bg-card flex justify-end gap-2 py-3 px-5 border-t border-border -mx-5 z-10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-1.5 border border-border text-foreground bg-white hover:bg-secondary rounded-lg font-bold text-[11px] transition-all disabled:opacity-50 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg font-bold text-[11px] transition-all disabled:opacity-50 shadow-md"
            >
              {isSubmitting && <Loader2 className="animate-spin w-3 h-3" />}
              {visaToEdit ? 'Save Changes' : 'Add Visa'}
            </button>
          </div>

        </form>
      )}
    </Modal>
  );
}
