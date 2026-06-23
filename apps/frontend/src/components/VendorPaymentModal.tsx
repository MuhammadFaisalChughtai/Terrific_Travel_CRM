import React, { useState, useEffect, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency } from "@tms/shared-utils";
import {
  Loader2,
  ChevronDown,
  Check,
  CreditCard,
  Percent,
  Coins,
  FileText,
  Upload,
  Eye,
  Trash2,
  FileIcon,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import Modal from "./Modal";

interface Vendor {
  id: string;
  name: string;
  vendorType: string;
  walletBalance: number;
}

interface Booking {
  id: string;
  bookingReference: string;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  agent?: {
    id: string;
    name: string;
  } | null;
  accommodations?: any[];
  flightServices?: any[];
  transportServices?: any[];
  visaServices?: any[];
  additionalServices?: any[];
  bookingVendorPayments?: any[];
  passengers?: any[];
}

interface VendorPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultVendorId?: string;
}

export default function VendorPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  defaultVendorId
}: VendorPaymentModalProps) {
  const queryClient = useQueryClient();

  // Selection states
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Bank Transfer");
  const [cardPaymentCharges, setCardPaymentCharges] = useState<string>("");
  const [bankAccount, setBankAccount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Receipt upload states
  const [isUploading, setIsUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [receiptFilename, setReceiptFilename] = useState<string>("");

  // Dropdown open states
  const [bookingsDropdownOpen, setBookingsDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");

  const bookingsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bookingsRef.current && !bookingsRef.current.contains(event.target as Node)) {
        setBookingsDropdownOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedBookingIds([]);
      setSelectedVendorId("");
      setSelectedServiceIds([]);
      setPaymentAmount("");
      setPaymentMethod("Bank Transfer");
      setCardPaymentCharges("");
      setBankAccount("");
      setNotes("");
      setReceiptUrl("");
      setReceiptFilename("");
      setBookingSearchQuery("");
    } else if (defaultVendorId) {
      setSelectedVendorId(defaultVendorId);
    }
  }, [isOpen, defaultVendorId]);

  // Clear booking search query when dropdown closes
  useEffect(() => {
    if (!bookingsDropdownOpen) {
      setBookingSearchQuery("");
    }
  }, [bookingsDropdownOpen]);

  // Queries
  const { data: bookingsList, isLoading: isBookingsLoading } = useQuery({
    queryKey: ["bookings-all-list-modal"],
    queryFn: async () => {
      const res = await apiClient.get("/bookings?limit=1000");
      return res.data.data.items as Booking[];
    },
    enabled: isOpen
  });

  const filteredBookings = useMemo(() => {
    if (!bookingsList) return [];
    
    const query = bookingSearchQuery.trim().toLowerCase();
    
    const matches = bookingsList.filter(b => {
      if (!query) return true;
      const leader = b.passengers?.find((p: any) => p.role === "Leader");
      const leaderName = leader ? `${leader.firstName} ${leader.lastName}`.toLowerCase() : "";
      
      const matchesRef = b.bookingReference.toLowerCase().includes(query);
      const matchesAgent = (b.agent?.name || "").toLowerCase().includes(query);
      const matchesLeader = leaderName.includes(query);
      const matchesAnyPassenger = b.passengers?.some((p: any) => 
        `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase().includes(query)
      );

      return matchesRef || matchesAgent || matchesLeader || matchesAnyPassenger;
    });

    // Limit matching results to first 5
    const firstFive = matches.slice(0, 5);

    // Keep any selected ones visible
    const selectedBookings = bookingsList.filter(b => selectedBookingIds.includes(b.id));
    const finalResults = [...firstFive];
    selectedBookings.forEach(sb => {
      if (!finalResults.some(r => r.id === sb.id)) {
        finalResults.push(sb);
      }
    });

    return finalResults;
  }, [bookingsList, bookingSearchQuery, selectedBookingIds]);

  const { data: vendors } = useQuery({
    queryKey: ["vendors-list-modal"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      return res.data.data.items as Vendor[];
    },
    enabled: isOpen
  });

  // Find all custom vendors from additional services in selected bookings
  const customVendors = useMemo(() => {
    if (!bookingsList || selectedBookingIds.length === 0) return [];
    const list: any[] = [];
    const selectedBookings = bookingsList.filter(b => selectedBookingIds.includes(b.id));
    selectedBookings.forEach(b => {
      if (b.additionalServices) {
        b.additionalServices.forEach((s: any) => {
          if (!s.vendorId && s.customVendorName && s.customVendorName.trim()) {
            const name = s.customVendorName.trim();
            // Avoid duplicates
            if (!list.some(v => v.name.toLowerCase() === name.toLowerCase())) {
              list.push({
                id: `custom-${name}`, // Virtual ID prefixed with custom-
                name: name,
                vendorType: "Custom (Additional Service)"
              });
            }
          }
        });
      }
    });
    return list;
  }, [bookingsList, selectedBookingIds]);

  // Extract all services for selected bookings
  const availableServices = useMemo(() => {
    if (!bookingsList || selectedBookingIds.length === 0) return [];
    
    const list: any[] = [];
    const selectedBookings = bookingsList.filter(b => selectedBookingIds.includes(b.id));

    selectedBookings.forEach(b => {
      if (b.accommodations) {
        b.accommodations.forEach((s: any) => {
          list.push({
            id: s.id,
            bookingId: b.id,
            bookingReference: b.bookingReference,
            vendorId: s.vendorId,
            type: "Hotel",
            title: `[Hotel] ${s.hotelName || "N/A"} (${s.roomType || "N/A"}) - Booking: ${b.bookingReference}`,
            price: s.price
          });
        });
      }
      if (b.flightServices) {
        b.flightServices.forEach((s: any) => {
          const hasPnr = s.pnr && s.pnr.trim() !== "" && s.pnr.toLowerCase() !== "n/a";
          if (hasPnr) {
            list.push({
              id: s.id,
              bookingId: b.id,
              bookingReference: b.bookingReference,
              vendorId: s.vendorId,
              type: "Flight",
              title: `[Flight] ${s.flightNo || "N/A"} (PNR: ${s.pnr}) - Booking: ${b.bookingReference}`,
              price: s.price
            });
          }
        });
      }
      if (b.transportServices) {
        b.transportServices.forEach((s: any) => {
          list.push({
            id: s.id,
            bookingId: b.id,
            bookingReference: b.bookingReference,
            vendorId: s.vendorId,
            type: "Transport",
            title: `[Transport] ${s.vehicleType || "N/A"} (${s.departureDestination || ""} -> ${s.arrivalDestination || ""}) - Booking: ${b.bookingReference}`,
            price: s.price
          });
        });
      }
      if (b.visaServices) {
        b.visaServices.forEach((s: any) => {
          list.push({
            id: s.id,
            bookingId: b.id,
            bookingReference: b.bookingReference,
            vendorId: s.vendorId,
            type: "Visa",
            title: `[Visa] ${s.visaType || "N/A"} (${s.passportNumber || "N/A"}) - Booking: ${b.bookingReference}`,
            price: s.price
          });
        });
      }
      if (b.additionalServices) {
        b.additionalServices.forEach((s: any) => {
          const serviceVendorId = s.vendorId || (s.customVendorName ? `custom-${s.customVendorName.trim()}` : "");
          list.push({
            id: s.id,
            bookingId: b.id,
            bookingReference: b.bookingReference,
            vendorId: serviceVendorId,
            type: "Additional",
            title: `[Service] ${s.serviceName || "N/A"} - Booking: ${b.bookingReference}`,
            price: s.servicePrice
          });
        });
      }
    });

    return list;
  }, [bookingsList, selectedBookingIds]);

  // Filter services by selected vendor
  const filteredServices = useMemo(() => {
    if (!selectedVendorId) return [];
    return availableServices.filter(s => s.vendorId === selectedVendorId);
  }, [availableServices, selectedVendorId]);

  // Clear service selection if the filtered list changes
  useEffect(() => {
    setSelectedServiceIds([]);
  }, [selectedVendorId, selectedBookingIds]);

  // Calculate sum of selected services and pre-fill amount field
  useEffect(() => {
    const sum = filteredServices
      .filter(s => selectedServiceIds.includes(s.id))
      .reduce((acc, s) => acc + s.price, 0);
    if (sum > 0) {
      setPaymentAmount(sum.toString());
    }
  }, [selectedServiceIds, filteredServices]);

  // Handle receipt upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post("/uploads/single", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setReceiptUrl(res.data.data.url);
      setReceiptFilename(res.data.data.filename);
      toast.success("Receipt uploaded successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload receipt.");
    } finally {
      setIsUploading(false);
    }
  };

  // Check if receipt is an image
  const isImageReceipt = useMemo(() => {
    if (!receiptUrl) return false;
    const urlLower = receiptUrl.toLowerCase();
    return urlLower.endsWith(".png") || urlLower.endsWith(".jpg") || urlLower.endsWith(".jpeg") || urlLower.includes("users/");
  }, [receiptUrl]);

  // Mutation
  const recordTransactionMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiClient.post("/payments/transactions", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["global-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Transaction recorded successfully!");
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to record transaction.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedBookingIds.length === 0) {
      toast.error("Please select at least one booking.");
      return;
    }
    if (!selectedVendorId) {
      toast.error("Please select a vendor.");
      return;
    }

    const amount = Number(paymentAmount) || 0;
    if (amount <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }

    const serviceTitles = filteredServices
      .filter(s => selectedServiceIds.includes(s.id))
      .map(s => s.title)
      .join(", ");

    const formattedNotes = [
      notes,
      serviceTitles ? `Paid for services: ${serviceTitles}` : ""
    ].filter(Boolean).join(". ");

    const payload: any = {
      type: "VENDOR_PAYMENT",
      vendorId: selectedVendorId,
      amount,
      paymentMethod,
      bankAccount,
      notes: formattedNotes,
      bookingIds: selectedBookingIds,
      receiptUrl: receiptUrl || undefined,
      cardPaymentCharges: paymentMethod === "Credit Card" ? Number(cardPaymentCharges) || 0 : 0
    };

    recordTransactionMutation.mutate(payload);
  };

  const handleBookingSelect = (id: string) => {
    setSelectedBookingIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleServiceSelect = (id: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Render selected bookings text
  const selectedBookingsText = useMemo(() => {
    if (selectedBookingIds.length === 0) return "Choose Bookings...";
    const selectedRefs = bookingsList
      ?.filter(b => selectedBookingIds.includes(b.id))
      .map(b => {
        const leader = b.passengers?.find((p: any) => p.role === "Leader");
        const leaderPart = leader ? ` - Lead: ${leader.firstName} ${leader.lastName}` : "";
        return `${b.bookingReference} (${b.agent?.name || "Direct"})${leaderPart}`;
      });
    return selectedRefs?.join(", ") || "Choose Bookings...";
  }, [selectedBookingIds, bookingsList]);

  // Render selected services text
  const selectedServicesText = useMemo(() => {
    if (selectedServiceIds.length === 0) return "Choose Services...";
    return `${selectedServiceIds.length} service(s) selected`;
  }, [selectedServiceIds]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Transaction"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2 font-sans text-xs">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* Row 1, Col 1: Bookings */}
          <div ref={bookingsRef} className="relative">
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Bookings (Concatenated with Agent) *
            </label>
            <button
              type="button"
              onClick={() => setBookingsDropdownOpen(!bookingsDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-secondary/10 border border-border rounded-lg text-left text-foreground font-semibold cursor-pointer min-h-[36px]"
            >
              <span className="truncate max-w-[90%]">{selectedBookingsText}</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            
            {bookingsDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl flex flex-col overflow-hidden">
                <div className="p-2 border-b border-border/50 bg-card">
                  <input
                    type="text"
                    placeholder="Search by booking ref or agent..."
                    value={bookingSearchQuery}
                    onChange={(e) => setBookingSearchQuery(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-secondary/15 border border-border rounded text-[11px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-border/50">
                  {isBookingsLoading ? (
                    <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
                      <Loader2 size={12} className="animate-spin text-primary" />
                      <span>Loading bookings...</span>
                    </div>
                  ) : filteredBookings && filteredBookings.length > 0 ? (
                    filteredBookings.map(b => {
                      const isSelected = selectedBookingIds.includes(b.id);
                      return (
                        <div
                          key={b.id}
                          onClick={() => handleBookingSelect(b.id)}
                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-secondary/20 cursor-pointer select-none text-foreground font-medium"
                        >
                          <div className="flex items-center justify-center w-4 h-4 border border-border rounded bg-secondary/10">
                            {isSelected && <Check size={12} className="text-primary font-black" />}
                          </div>
                          <span className="truncate">
                            {b.bookingReference} — <span className="text-muted-foreground font-semibold">
                              {(() => {
                                const leader = b.passengers?.find((p: any) => p.role === "Leader");
                                const leaderPart = leader ? `${leader.firstName} ${leader.lastName}` : "";
                                const agentPart = b.agent?.name || "Direct";
                                return leaderPart ? `${leaderPart} (${agentPart})` : agentPart;
                              })()}
                            </span>
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-3 text-center text-muted-foreground font-semibold">No bookings found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Row 1, Col 2: Vendor */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Select Supplier / Vendor *
            </label>
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[36px]"
            >
              <option value="">-- Choose One Vendor --</option>
              {vendors?.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.vendorType})
                </option>
              ))}
              {customVendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.vendorType})
                </option>
              ))}
            </select>
          </div>

          {/* Row 2, Col 1: Services (Dependent on Vendor) */}
          <div ref={servicesRef} className="relative">
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Select Services from Same Vendor *
            </label>
            <button
              type="button"
              disabled={!selectedVendorId}
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-secondary/10 border border-border rounded-lg text-left text-foreground font-semibold cursor-pointer min-h-[36px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate max-w-[90%]">
                {selectedVendorId ? selectedServicesText : "Please select vendor first"}
              </span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            
            {selectedVendorId && servicesDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto divide-y divide-border/50">
                {filteredServices.length > 0 ? (
                  filteredServices.map(s => {
                    const isSelected = selectedServiceIds.includes(s.id);
                    const bookingObj = bookingsList?.find(b => b.id === s.bookingId);
                    const vendorPaymentObj = bookingObj?.bookingVendorPayments?.find((vp: any) => vp.vendorId === s.vendorId);
                    const isAlreadyPaid = vendorPaymentObj ? (vendorPaymentObj.status === 'PAID' || vendorPaymentObj.remainingBalance <= 0) : false;

                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (isAlreadyPaid && !isSelected) {
                            toast.warning("Warning: This service is already paid!");
                          }
                          handleServiceSelect(s.id);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 hover:bg-secondary/20 cursor-pointer select-none text-foreground font-medium"
                      >
                        <div className="flex items-center justify-center w-4 h-4 border border-border rounded bg-secondary/10">
                          {isSelected && <Check size={12} className="text-primary font-black" />}
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="truncate font-semibold flex items-center gap-2">
                            {s.title}
                            {isAlreadyPaid && (
                              <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                                Already Paid
                              </span>
                            )}
                          </span>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(s.price)}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-3 text-center text-muted-foreground font-semibold">
                    No services found for this vendor in the selected bookings.
                  </div>
                )}
              </div>
            )}

            {selectedServiceIds.some(id => {
              const s = filteredServices.find(x => x.id === id);
              if (!s) return false;
              const bookingObj = bookingsList?.find(b => b.id === s.bookingId);
              const vpObj = bookingObj?.bookingVendorPayments?.find((vp: any) => vp.vendorId === s.vendorId);
              return vpObj ? (vpObj.status === 'PAID' || vpObj.remainingBalance <= 0) : false;
            }) && (
              <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-800 dark:text-amber-300 text-[10px] font-semibold flex items-center gap-1.5 leading-tight">
                <AlertCircle size={12} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Warning: One or more selected services are already paid! Review before submitting to avoid double payment.</span>
              </div>
            )}
          </div>

          {/* Row 2, Col 2: Amount */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Payment Amount (£) *
            </label>
            <div className="relative">
              <Coins size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[36px]"
              />
            </div>
          </div>

          {/* Row 3, Col 1: Payment Method */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[36px]"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Row 3, Col 2: Bank Account */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Bank Source / Account
            </label>
            <input
              type="text"
              placeholder="e.g. Barclays"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[36px]"
            />
          </div>
        </div>

        {/* Credit Card Charges input (Condition) */}
        {paymentMethod === "Credit Card" && (
          <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-primary">
              <CreditCard size={14} />
              <span className="font-black uppercase tracking-wider text-[9px]">Credit Card Options</span>
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Credit Card Charges (£)
              </label>
              <div className="relative max-w-xs">
                <Percent size={12} className="absolute left-3 top-2.5 text-primary" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cardPaymentCharges}
                  onChange={(e) => setCardPaymentCharges(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-card border border-primary/20 rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs"
                />
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">
                Charges will be recorded separately inside the first selected booking.
              </p>
            </div>
          </div>
        )}

        {/* Row 4: Receipt Upload & Receipt Preview */}
        <div className="border-t border-border/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Widget */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Upload Receipt (Image / PDF)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border/80 hover:border-primary/50 rounded-lg cursor-pointer bg-secondary/5 hover:bg-secondary/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  )}
                  <p className="text-[10px] font-bold text-foreground">Click to upload file</p>
                  <p className="text-[8px] text-muted-foreground">PNG, JPG, or PDF up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, application/pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {/* Receipt Preview */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Receipt Preview & File Information
            </label>
            {receiptUrl ? (
              <div className="flex items-start gap-4 p-3 bg-secondary/10 border border-border rounded-lg relative min-h-[96px]">
                {isImageReceipt ? (
                  <div className="relative group w-20 h-20 border border-border rounded bg-card overflow-hidden cursor-pointer" onClick={() => window.open(receiptUrl, "_blank")}>
                    <img src={receiptUrl} alt="Receipt Thumbnail" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="text-white w-4 h-4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 border border-border rounded bg-card text-muted-foreground">
                    <FileIcon className="w-8 h-8 text-primary" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0 pr-8 space-y-1.5">
                  <p className="font-bold text-foreground text-[11px] truncate">{receiptFilename || "Uploaded Receipt"}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(receiptUrl, "_blank")}
                      className="px-2 py-1 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <Eye size={12} />
                      <span>View File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptUrl("");
                        setReceiptFilename("");
                      }}
                      className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 border border-dashed border-border/40 rounded-lg text-muted-foreground">
                <FileText className="w-6 h-6 text-muted-foreground/45 mb-1" />
                <span className="text-[10px] font-semibold text-muted-foreground/60">No receipt uploaded yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Row 5: Notes */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
            Internal Notes / Description
          </label>
          <div className="relative">
            <FileText size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
            <textarea
              rows={2}
              placeholder="Transaction references or audit notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 hover:bg-secondary/20 rounded-lg font-bold text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={recordTransactionMutation.isPending}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            {recordTransactionMutation.isPending ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Recording...</span>
              </>
            ) : (
              <span>Record Transaction</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
