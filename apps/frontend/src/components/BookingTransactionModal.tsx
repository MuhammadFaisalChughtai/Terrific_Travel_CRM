import React, { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency } from "@tms/shared-utils";
import {
  Loader2,
  CreditCard,
  Percent,
  Coins,
  FileText,
  Upload,
  Eye,
  Trash2,
  FileIcon,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "./Modal";

interface BookingTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingReference: string;
  booking: any;
  onSuccess: () => void;
}

export default function BookingTransactionModal({
  isOpen,
  onClose,
  bookingId,
  bookingReference,
  booking,
  onSuccess,
}: BookingTransactionModalProps) {
  const queryClient = useQueryClient();

  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Form State
  const [transactionType, setTransactionType] = useState<
    "CUSTOMER_PAYMENT" | "VENDOR_REFUND" | "CUSTOMER_REFUND" | "VENDOR_DISCOUNT"
  >("CUSTOMER_PAYMENT");

  const [transactionDate, setTransactionDate] =
    useState<string>(getTodayString());
  const [paymentMethod, setPaymentMethod] = useState<string>("Bank Transfer");
  const [vendorId, setVendorId] = useState<string>("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [cardPaymentCharges, setCardPaymentCharges] = useState<string>("");
  const [isPaidByCompany, setIsPaidByCompany] = useState<boolean>(true);
  const [bankAccount, setBankAccount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Receipt upload states
  const [isUploading, setIsUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [receiptFilename, setReceiptFilename] = useState<string>("");

  // Extract unique vendors from the booking's services
  const uniqueVendors = useMemo(() => {
    if (!booking) return [];
    const vendorsMap = new Map<string, string>();

    const checkService = (serviceList: any[]) => {
      if (!serviceList) return;
      serviceList.forEach((s) => {
        if (s.vendor && s.vendor.id && s.vendor.name) {
          vendorsMap.set(s.vendor.id, s.vendor.name);
        }
      });
    };

    checkService(booking.accommodations);
    checkService(booking.flightServices);
    checkService(booking.transportServices);
    checkService(booking.visaServices);
    checkService(booking.additionalServices);

    return Array.from(vendorsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [booking]);

  // Extract all services for service selection
  const bookingServices = useMemo(() => {
    if (!booking) return [];
    const services: Array<{
      id: string;
      name: string;
      type: string;
      vendorId?: string;
      vendorName?: string;
    }> = [];

    if (booking.accommodations) {
      booking.accommodations.forEach((s: any) => {
        services.push({
          id: s.id,
          name: `${s.hotelName || "Unknown Hotel"} (Hotel)`,
          type: "Accommodation",
          vendorId: s.vendor?.id,
          vendorName: s.vendor?.name,
        });
      });
    }
    if (booking.flightServices) {
      booking.flightServices.forEach((s: any) => {
        services.push({
          id: s.id,
          name: `${s.flightNo || "Flight"} (${s.departedFrom || "?"} to ${s.arrivedAt || "?"})`,
          type: "Flight",
          vendorId: s.vendor?.id,
          vendorName: s.vendor?.name,
        });
      });
    }
    if (booking.transportServices) {
      booking.transportServices.forEach((s: any) => {
        services.push({
          id: s.id,
          name: `${s.vehicleType || "Transport"} (${s.departureDestination || "?"} to ${s.arrivalDestination || "?"})`,
          type: "Transport",
          vendorId: s.vendor?.id,
          vendorName: s.vendor?.name,
        });
      });
    }
    if (booking.visaServices) {
      booking.visaServices.forEach((s: any) => {
        services.push({
          id: s.id,
          name: `${s.visaType || "Visa"} (${s.passportNumber || "No Passport"})`,
          type: "Visa",
          vendorId: s.vendor?.id,
          vendorName: s.vendor?.name,
        });
      });
    }
    if (booking.additionalServices) {
      booking.additionalServices.forEach((s: any) => {
        services.push({
          id: s.id,
          name: `${s.serviceName || "Additional Service"}`,
          type: "Additional",
          vendorId: s.vendor?.id,
          vendorName: s.vendor?.name,
        });
      });
    }

    return services;
  }, [booking]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTransactionType("CUSTOMER_PAYMENT");
      setTransactionDate(getTodayString());
      setPaymentMethod("Bank Transfer");
      setVendorId("");
      setServiceIds([]);
      setAmount("");
      setCardPaymentCharges("");
      setBankAccount("");
      setNotes("");
      setReceiptUrl("");
      setReceiptFilename("");
    }
  }, [isOpen]);

  // Automatically calculate credit card charges as 1% of the transaction amount
  useEffect(() => {
    if (paymentMethod === "Credit Card") {
      const baseAmount = Number(amount) || 0;
      const charges = (baseAmount * 0.01).toFixed(2);
      setCardPaymentCharges(charges);
    } else {
      setCardPaymentCharges("");
    }
  }, [paymentMethod, amount]);

  // Handle receipt upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiClient.post("/uploads/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
    return (
      urlLower.endsWith(".png") ||
      urlLower.endsWith(".jpg") ||
      urlLower.endsWith(".jpeg") ||
      urlLower.includes("users/")
    );
  }, [receiptUrl]);

  const transactionMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiClient.post("/payments/requests", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["global-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["payment-requests"] });
      toast.success("Payment request submitted for approval!");
      onSuccess();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amt = Number(amount) || 0;
    if (amt <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    // if (!receiptUrl) {
    //   toast.error("Receipt upload is required.");
    //   return;
    // }

    if (
      (transactionType === "VENDOR_REFUND" ||
        transactionType === "VENDOR_DISCOUNT") &&
      !vendorId
    ) {
      toast.error("Please select a vendor.");
      return;
    }

    if (
      (transactionType === "VENDOR_REFUND" ||
        transactionType === "VENDOR_DISCOUNT") &&
      serviceIds.length === 0
    ) {
      toast.error("Please select at least one service.");
      return;
    }

    let serviceNote = "";
    if (serviceIds.length > 0) {
      const selectedServices = bookingServices.filter((s) =>
        serviceIds.includes(s.id),
      );
      if (selectedServices.length > 0) {
        serviceNote = `Services: ${selectedServices.map((s) => s.name).join(", ")}`;
      }
    }

    const formattedNotes = [
      notes,
      serviceNote,
      receiptUrl ? `Receipt: ${receiptUrl}` : "",
    ]
      .filter(Boolean)
      .join(". ");

    const payload: any = {
      type: transactionType,
      amount: amt,
      bookingId,
      notes: formattedNotes,
      paymentMethod,
      bankAccount,
      receiptUrl,
      transactionDate: transactionDate
        ? new Date(transactionDate).toISOString()
        : undefined,
    };

    if (
      transactionType === "CUSTOMER_PAYMENT" &&
      paymentMethod === "Credit Card"
    ) {
      payload.cardPaymentCharges = Number(cardPaymentCharges) || 0;
      payload.isPaidByCompany = isPaidByCompany;
    }

    if (
      transactionType === "VENDOR_REFUND" ||
      transactionType === "VENDOR_DISCOUNT"
    ) {
      payload.vendorId = vendorId;
    }

    transactionMutation.mutate(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Booking Transaction (${bookingReference})`}
      maxWidth="5xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 py-2 font-sans text-xs"
      >
        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action/Type Selector */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Transaction Action *
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as any)}
              className="w-full px-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[36px]"
            >
              <option value="CUSTOMER_PAYMENT">
                Payment received from the customer
              </option>
              <option value="VENDOR_REFUND">Refund from Vendor</option>
              <option value="VENDOR_DISCOUNT">Discount from Vendor</option>
              <option value="CUSTOMER_REFUND">Refund to Customer</option>
            </select>
          </div>

          {/* Transaction Date */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Transaction Date *
            </label>
            <input
              type="date"
              required
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[36px]"
            />
          </div>

          {/* Vendor selector (Conditional for VENDOR_REFUND or VENDOR_DISCOUNT), otherwise Payment Method */}
          {transactionType === "VENDOR_REFUND" ||
          transactionType === "VENDOR_DISCOUNT" ? (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Select Vendor *
              </label>
              <select
                value={vendorId}
                required
                onChange={(e) => setVendorId(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[36px]"
              >
                <option value="">-- Choose Vendor --</option>
                {uniqueVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
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
          )}

          {/* Service Selector (For refunds and discounts) */}
          {(transactionType === "CUSTOMER_REFUND" ||
            transactionType === "VENDOR_REFUND" ||
            transactionType === "VENDOR_DISCOUNT") && (
            <div className="col-span-1 md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1 flex justify-between items-center">
                <span>
                  Select Services{" "}
                  {transactionType === "CUSTOMER_REFUND" ? "(Optional)" : "*"}
                </span>
                {serviceIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setServiceIds([])}
                    className="text-[9px] text-primary hover:underline"
                  >
                    Clear selection
                  </button>
                )}
              </label>
              <div className="w-full max-h-32 overflow-y-auto px-3 py-2 bg-secondary/10 border border-border rounded-lg space-y-1.5 custom-scrollbar">
                {bookingServices.filter((s) =>
                  transactionType === "CUSTOMER_REFUND"
                    ? true
                    : s.vendorId === vendorId,
                ).length === 0 ? (
                  <div className="text-xs text-muted-foreground italic py-1">
                    No services available for this vendor.
                  </div>
                ) : (
                  bookingServices
                    .filter((s) =>
                      transactionType === "CUSTOMER_REFUND"
                        ? true
                        : s.vendorId === vendorId,
                    )
                    .map((s) => (
                      <label
                        key={s.id}
                        className="flex items-start gap-2 cursor-pointer hover:bg-secondary/20 p-1 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={serviceIds.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setServiceIds((prev) => [...prev, s.id]);
                            } else {
                              setServiceIds((prev) =>
                                prev.filter((id) => id !== s.id),
                              );
                            }
                          }}
                          className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-xs text-foreground font-medium">
                          <span className="font-semibold text-muted-foreground">
                            {s.type}:
                          </span>{" "}
                          {s.name}
                        </span>
                      </label>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
              Amount (£) *
            </label>
            <div className="relative">
              <Coins
                size={14}
                className="absolute left-3 top-2.5 text-muted-foreground"
              />
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-secondary/10 border border-border rounded-lg text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[36px]"
              />
            </div>
          </div>

          {/* Payment method selector for VENDOR_REFUND and VENDOR_DISCOUNT so all views can have bank/cc fields */}
          {transactionType === "VENDOR_REFUND" ||
          transactionType === "VENDOR_DISCOUNT" ? (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                {transactionType === "VENDOR_DISCOUNT"
                  ? "Discount Method"
                  : "Refund Method"}
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
          ) : (
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
          )}

          {/* Row 3 helper: bank source input if vendor refund/discount selected */}
          {(transactionType === "VENDOR_REFUND" ||
            transactionType === "VENDOR_DISCOUNT") && (
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
          )}
        </div>

        {/* Credit Card Surcharges (Conditional for CC payment method across all types) */}
        {paymentMethod === "Credit Card" && (
          <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-xl space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-primary">
              <CreditCard size={14} />
              <span className="font-black uppercase tracking-wider text-[9px]">
                Credit Card Charges
              </span>
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Credit Card Charges (£)
              </label>
              <div className="relative max-w-xs">
                <Percent
                  size={12}
                  className="absolute left-3 top-2 text-primary"
                />
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
                Charges will be recorded separately inside this booking.
              </p>
            </div>

            <div className="flex items-center gap-2 select-none">
              <input
                type="checkbox"
                id="isPaidByCompany"
                checked={isPaidByCompany}
                onChange={(e) => setIsPaidByCompany(e.target.checked)}
                className="w-3.5 h-3.5 text-primary border-border rounded focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="isPaidByCompany"
                className="text-[10px] font-bold text-foreground cursor-pointer"
              >
                Paid by the Company (expense deduction)
              </label>
            </div>
          </div>
        )}

        {/* Receipt Upload & Preview */}
        <div className="border-t border-border/60 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className="text-[10px] font-bold text-foreground">
                    Click to upload file
                  </p>
                  <p className="text-[8px] text-muted-foreground">
                    PNG, JPG, or PDF up to 5MB
                  </p>
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

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Receipt Preview
            </label>
            {receiptUrl ? (
              <div className="flex items-start gap-4 p-3 bg-secondary/10 border border-border rounded-lg relative min-h-[96px]">
                {isImageReceipt ? (
                  <div
                    className="relative group w-20 h-20 border border-border rounded bg-card overflow-hidden cursor-pointer"
                    onClick={() => window.open(receiptUrl, "_blank")}
                  >
                    <img
                      src={receiptUrl}
                      alt="Receipt Thumbnail"
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
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
                  <p className="font-bold text-foreground text-[11px] truncate">
                    {receiptFilename || "Uploaded Receipt"}
                  </p>
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
                <span className="text-[10px] font-semibold text-muted-foreground/60">
                  No receipt uploaded yet
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
            Internal Notes / Description
          </label>
          <div className="relative">
            <FileText
              size={14}
              className="absolute left-3 top-2.5 text-muted-foreground"
            />
            <textarea
              rows={2}
              placeholder="Audit reference, cancellation receipt, or check numbers..."
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
            disabled={transactionMutation.isPending}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            {transactionMutation.isPending ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Recording...</span>
              </>
            ) : (
              <span>Submit Request</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
