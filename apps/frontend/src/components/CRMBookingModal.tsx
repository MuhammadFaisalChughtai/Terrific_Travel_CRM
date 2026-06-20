import React from "react";
import Modal from "./Modal";
import { formatCurrency } from "@tms/shared-utils";
import { format } from "date-fns";

interface CRMBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-[#2D1B2E] text-white p-3 text-xs font-bold rounded-t-sm uppercase tracking-wide">
    {title}
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary/40 border-b border-border/50">
    {children}
  </th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 text-xs text-foreground border-b border-border/30 whitespace-nowrap">
    {children}
  </td>
);

const EmptyRow = ({ colSpan }: { colSpan: number }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-6 text-center text-xs text-muted-foreground italic bg-secondary/10">
      No records found.
    </td>
  </tr>
);

export default function CRMBookingModal({ isOpen, onClose, booking }: CRMBookingModalProps) {
  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Booking: ${booking.bookingReference || booking.id.substring(0, 8).toUpperCase()}`} maxWidth="6xl">
      <div className="space-y-8 pr-2 pb-6">
        
        {/* Booking Details Section */}
        <section className="bg-card border border-border shadow-sm">
          <SectionHeader title="Booking Details" />
          <div className="p-0">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-border/30">
                <tr className="hover:bg-secondary/10">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Booking Reference</td>
                  <td className="py-3 px-4 font-bold">{booking.bookingReference || booking.id.substring(0, 8).toUpperCase()}</td>
                </tr>
                <tr className="hover:bg-secondary/10 bg-secondary/5">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Date</td>
                  <td className="py-3 px-4">{format(new Date(booking.createdAt), "MMMM dd, yyyy")}</td>
                </tr>
                <tr className="hover:bg-secondary/10">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Departure Date</td>
                  <td className="py-3 px-4">{booking.departureDate ? format(new Date(booking.departureDate), "MMMM dd, yyyy") : "EMPTY"}</td>
                </tr>
                <tr className="hover:bg-secondary/10 bg-secondary/5">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Agent</td>
                  <td className="py-3 px-4 text-primary font-semibold">{booking.agent?.name || "None"}</td>
                </tr>
                <tr className="hover:bg-secondary/10">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Customers</td>
                  <td className="py-3 px-4">
                    {booking.passengers && booking.passengers.length > 0 
                      ? booking.passengers.map((p: any) => `${p.firstName} ${p.lastName} (Age: ${p.age})`).join(", ") 
                      : "EMPTY"}
                  </td>
                </tr>
                <tr className="hover:bg-secondary/10 bg-secondary/5">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Total Price</td>
                  <td className="py-3 px-4 font-bold">{booking.totalPrice}</td>
                </tr>
                <tr className="hover:bg-secondary/10">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Status</td>
                  <td className="py-3 px-4 uppercase font-semibold">{booking.status}</td>
                </tr>
                <tr className="hover:bg-secondary/10 bg-secondary/5">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Paid Amount</td>
                  <td className="py-3 px-4 font-bold">{booking.paidAmount || 0}</td>
                </tr>
                <tr className="hover:bg-secondary/10">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Refund Amount</td>
                  <td className="py-3 px-4 text-muted-foreground">{booking.refundAmount || "EMPTY"}</td>
                </tr>
                <tr className="hover:bg-secondary/10 bg-secondary/5">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Card Payment Charges</td>
                  <td className="py-3 px-4 text-muted-foreground">{booking.cardPaymentCharges || "EMPTY"}</td>
                </tr>
                <tr className="hover:bg-secondary/10">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Cancellation Charges</td>
                  <td className="py-3 px-4 text-muted-foreground">{booking.cancellationCharges || "EMPTY"}</td>
                </tr>
                <tr className="hover:bg-secondary/10 bg-secondary/5">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Remaining Amount</td>
                  <td className="py-3 px-4 font-bold">{booking.remainingAmount || booking.totalPrice}</td>
                </tr>
                <tr className="hover:bg-secondary/10">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Payment Status</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-amber-500 text-white font-bold rounded-sm text-[10px]">{booking.paymentStatus || "UNPAID"}</span>
                  </td>
                </tr>
                <tr className="hover:bg-secondary/10 bg-secondary/5">
                  <td className="py-3 px-4 font-semibold text-muted-foreground w-1/4 uppercase text-[10px] tracking-wide">Locked Status</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded-sm text-[10px]">{booking.lockedStatus || "UNLOCKED"}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Booking Transactions */}
        <section className="bg-card border border-border shadow-sm overflow-x-auto">
          <SectionHeader title="Booking Transactions" />
          <table className="w-full text-xs">
            <thead>
              <tr>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Payment Method</TableHeader>
                <TableHeader>Paid On</TableHeader>
                <TableHeader>Notes</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {booking.transactions && booking.transactions.length > 0 ? (
                booking.transactions.map((tx: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/5" : ""}>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.paymentMethod}</TableCell>
                    <TableCell>{format(new Date(tx.paidOn), "MMMM dd, yyyy")}</TableCell>
                    <TableCell>{tx.notes || ""}</TableCell>
                  </tr>
                ))
              ) : <EmptyRow colSpan={4} />}
            </tbody>
          </table>
        </section>

        {/* Passengers */}
        <section className="bg-card border border-border shadow-sm overflow-x-auto">
          <SectionHeader title="Passengers" />
          <table className="w-full text-xs">
            <thead>
              <tr>
                <TableHeader>Title</TableHeader>
                <TableHeader>First Name</TableHeader>
                <TableHeader>Last Name</TableHeader>
                <TableHeader>Age</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Phone Number</TableHeader>
                <TableHeader>Passport Expiry Date</TableHeader>
                <TableHeader>Agent</TableHeader>
                <TableHeader>Role</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {booking.passengers && booking.passengers.length > 0 ? (
                booking.passengers.map((p: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/5" : ""}>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.firstName}</TableCell>
                    <TableCell>{p.lastName}</TableCell>
                    <TableCell>{p.age}</TableCell>
                    <TableCell>{p.email || "0"}</TableCell>
                    <TableCell>{p.phoneNumber || ""}</TableCell>
                    <TableCell>{p.passportExpiryDate ? format(new Date(p.passportExpiryDate), "MMMM dd, yyyy") : ""}</TableCell>
                    <TableCell><span className="text-primary font-semibold">{p.agent?.name || booking.agent?.name}</span></TableCell>
                    <TableCell>{p.role}</TableCell>
                  </tr>
                ))
              ) : <EmptyRow colSpan={9} />}
            </tbody>
          </table>
        </section>

        {/* Vendor Payments */}
        <section className="bg-card border border-border shadow-sm overflow-x-auto">
          <SectionHeader title="Vendor Payments" />
          <table className="w-full text-xs">
            <thead>
              <tr>
                <TableHeader>Vendor</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Payment Date</TableHeader>
                <TableHeader>Reference</TableHeader>
                <TableHeader>Status</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {booking.vendorPayments && booking.vendorPayments.length > 0 ? (
                booking.vendorPayments.map((vp: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/5" : ""}>
                    <TableCell>{vp.vendor?.name}</TableCell>
                    <TableCell>{vp.amount}</TableCell>
                    <TableCell>{format(new Date(vp.paymentDate), "MMMM dd, yyyy")}</TableCell>
                    <TableCell>{vp.reference || ""}</TableCell>
                    <TableCell>{vp.status}</TableCell>
                  </tr>
                ))
              ) : <EmptyRow colSpan={5} />}
            </tbody>
          </table>
        </section>

        {/* Accommodation Services */}
        <section className="bg-card border border-border shadow-sm overflow-x-auto">
          <SectionHeader title="Accommodation Services" />
          <table className="w-full text-xs">
            <thead>
              <tr>
                <TableHeader>Vendor</TableHeader>
                <TableHeader>Hotel Name</TableHeader>
                <TableHeader>Room Type</TableHeader>
                <TableHeader>Check In Date</TableHeader>
                <TableHeader>Check Out Date</TableHeader>
                <TableHeader>Meal Type</TableHeader>
                <TableHeader>Reservation Number</TableHeader>
                <TableHeader>Qty</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Currency</TableHeader>
                <TableHeader>Refund Amount</TableHeader>
                <TableHeader>Fine Amount</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {booking.accommodations && booking.accommodations.length > 0 ? (
                booking.accommodations.map((acc: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/5" : ""}>
                    <TableCell><span className="text-primary hover:underline cursor-pointer">{acc.vendor?.name}</span></TableCell>
                    <TableCell>{acc.hotelName}</TableCell>
                    <TableCell><span className="max-w-[150px] truncate block" title={acc.roomType}>{acc.roomType}</span></TableCell>
                    <TableCell>{format(new Date(acc.checkInDate), "MMMM dd, yyyy")}</TableCell>
                    <TableCell>{format(new Date(acc.checkOutDate), "MMMM dd, yyyy")}</TableCell>
                    <TableCell>{acc.mealType}</TableCell>
                    <TableCell>{acc.reservationNumber}</TableCell>
                    <TableCell>{acc.qty}</TableCell>
                    <TableCell>{acc.price}</TableCell>
                    <TableCell>{acc.currency}</TableCell>
                    <TableCell>{acc.refundAmount}</TableCell>
                    <TableCell>{acc.fineAmount}</TableCell>
                    <TableCell>
                      <button className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-[10px] font-bold">Voucher</button>
                    </TableCell>
                  </tr>
                ))
              ) : <EmptyRow colSpan={13} />}
            </tbody>
          </table>
        </section>

        {/* Flight Services */}
        <section className="bg-card border border-border shadow-sm overflow-x-auto">
          <SectionHeader title="Flight Services" />
          <table className="w-full text-xs">
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Vendor</TableHeader>
                <TableHeader>Flight No</TableHeader>
                <TableHeader>PNR</TableHeader>
                <TableHeader>Departed From</TableHeader>
                <TableHeader>Arrived At</TableHeader>
                <TableHeader>Depart Time</TableHeader>
                <TableHeader>Arrival Time</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Currency</TableHeader>
                <TableHeader>Refund Amount</TableHeader>
                <TableHeader>Fine Amount</TableHeader>
                <TableHeader>Baggage</TableHeader>
                <TableHeader>Flight Class</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {booking.flightServices && booking.flightServices.length > 0 ? (
                booking.flightServices.map((fs: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/5" : ""}>
                    <TableCell>{format(new Date(fs.date), "MMMM dd, yyyy")}</TableCell>
                    <TableCell><span className="text-primary hover:underline cursor-pointer">{fs.vendor?.name}</span></TableCell>
                    <TableCell>{fs.flightNo}</TableCell>
                    <TableCell>{fs.pnr}</TableCell>
                    <TableCell>{fs.departedFrom}</TableCell>
                    <TableCell>{fs.arrivedAt}</TableCell>
                    <TableCell>{fs.departTime}</TableCell>
                    <TableCell>{fs.arrivalTime}</TableCell>
                    <TableCell>{fs.price}</TableCell>
                    <TableCell>{fs.currency}</TableCell>
                    <TableCell>{fs.refundAmount}</TableCell>
                    <TableCell>{fs.fineAmount}</TableCell>
                    <TableCell>{fs.baggage}</TableCell>
                    <TableCell>{fs.flightClass}</TableCell>
                    <TableCell>
                      <button className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-[10px] font-bold">Voucher</button>
                    </TableCell>
                  </tr>
                ))
              ) : <EmptyRow colSpan={15} />}
            </tbody>
          </table>
        </section>

        {/* Transport Services */}
        <section className="bg-card border border-border shadow-sm overflow-x-auto">
          <SectionHeader title="Transport Services" />
          <table className="w-full text-xs">
            <thead>
              <tr>
                <TableHeader>Vendor</TableHeader>
                <TableHeader>Vehicle Type</TableHeader>
                <TableHeader>Departure Destination</TableHeader>
                <TableHeader>Arrival Destination</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Departure Time</TableHeader>
                <TableHeader>Arrival Time</TableHeader>
                <TableHeader>Flight No</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Currency</TableHeader>
                <TableHeader>Refund Amount</TableHeader>
                <TableHeader>Fine Amount</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {booking.transportServices && booking.transportServices.length > 0 ? (
                booking.transportServices.map((ts: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/5" : ""}>
                    <TableCell><span className="text-primary hover:underline cursor-pointer">{ts.vendor?.name}</span></TableCell>
                    <TableCell>{ts.vehicleType}</TableCell>
                    <TableCell>{ts.departureDestination}</TableCell>
                    <TableCell>{ts.arrivalDestination}</TableCell>
                    <TableCell>{format(new Date(ts.date), "MMMM dd, yyyy")}</TableCell>
                    <TableCell>{ts.departureTime}</TableCell>
                    <TableCell>{ts.arrivalTime}</TableCell>
                    <TableCell>{ts.flightNo}</TableCell>
                    <TableCell>{ts.price}</TableCell>
                    <TableCell>{ts.currency}</TableCell>
                    <TableCell>{ts.refundAmount}</TableCell>
                    <TableCell>{ts.fineAmount}</TableCell>
                    <TableCell>
                      <button className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-[10px] font-bold">Voucher</button>
                    </TableCell>
                  </tr>
                ))
              ) : <EmptyRow colSpan={13} />}
            </tbody>
          </table>
          <div className="p-3 bg-secondary/5 border-t border-border/50">
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-bold transition-colors">
              Generate Individual Vendor Transport Voucher
            </button>
          </div>
        </section>

        {/* Visa Services */}
        <section className="bg-card border border-border shadow-sm overflow-x-auto">
          <SectionHeader title="Visa Services" />
          <table className="w-full text-xs">
            <thead>
              <tr>
                <TableHeader>Vendor</TableHeader>
                <TableHeader>Passport Number</TableHeader>
                <TableHeader>Visa Type</TableHeader>
                <TableHeader>Visa Number</TableHeader>
                <TableHeader>Issue Date</TableHeader>
                <TableHeader>Expiry Date</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Currency</TableHeader>
                <TableHeader>Refund Amount</TableHeader>
                <TableHeader>Fine Amount</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {booking.visaServices && booking.visaServices.length > 0 ? (
                booking.visaServices.map((vs: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-secondary/5" : ""}>
                    <TableCell><span className="text-primary hover:underline cursor-pointer">{vs.vendor?.name}</span></TableCell>
                    <TableCell>{vs.passportNumber}</TableCell>
                    <TableCell>{vs.visaType}</TableCell>
                    <TableCell>{vs.visaNumber}</TableCell>
                    <TableCell>{vs.issueDate ? format(new Date(vs.issueDate), "MMMM dd, yyyy") : ""}</TableCell>
                    <TableCell>{vs.expiryDate ? format(new Date(vs.expiryDate), "MMMM dd, yyyy") : ""}</TableCell>
                    <TableCell>{vs.price}</TableCell>
                    <TableCell>{vs.currency}</TableCell>
                    <TableCell>{vs.refundAmount}</TableCell>
                    <TableCell>{vs.fineAmount}</TableCell>
                  </tr>
                ))
              ) : <EmptyRow colSpan={10} />}
            </tbody>
          </table>
        </section>

      </div>
    </Modal>
  );
}
