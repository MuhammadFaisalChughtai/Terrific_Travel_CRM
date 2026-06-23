import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import Modal from './Modal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AdditionalServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: () => void;
  serviceToEdit?: any | null;
}

export default function AdditionalServiceModal({
  isOpen,
  onClose,
  bookingId,
  onSuccess,
  serviceToEdit = null
}: AdditionalServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [vendorId, setVendorId] = useState('');
  const [isCustomVendor, setIsCustomVendor] = useState(false);
  const [customVendorName, setCustomVendorName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('0');
  const [serviceDescription, setServiceDescription] = useState('');

  // Populate form on Edit / Reset on Add
  useEffect(() => {
    if (isOpen) {
      if (serviceToEdit) {
        if (serviceToEdit.vendorId) {
          setVendorId(serviceToEdit.vendorId);
          setIsCustomVendor(false);
          setCustomVendorName('');
        } else {
          setVendorId('');
          setIsCustomVendor(true);
          setCustomVendorName(serviceToEdit.customVendorName || '');
        }
        setServiceName(serviceToEdit.serviceName || '');
        setServicePrice(String(serviceToEdit.servicePrice || '0'));
        setServiceDescription(serviceToEdit.serviceDescription || '');
      } else {
        // Reset states to defaults
        setVendorId('');
        setIsCustomVendor(false);
        setCustomVendorName('');
        setServiceName('');
        setServicePrice('0');
        setServiceDescription('');
      }
    }
  }, [isOpen, serviceToEdit]);

  // Fetch Vendors
  const { data: vendorsData, isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors?limit=100');
      return res.data.data.items || [];
    },
    enabled: isOpen
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCustomVendor && !vendorId) {
      toast.error('Please select a vendor or check the custom vendor option');
      return;
    }
    if (isCustomVendor && !customVendorName.trim()) {
      toast.error('Please enter a custom vendor name');
      return;
    }
    if (!serviceName.trim()) {
      toast.error('Please enter the service name');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vendorId: isCustomVendor ? null : vendorId,
        customVendorName: isCustomVendor ? customVendorName.trim() : null,
        serviceName: serviceName.trim(),
        servicePrice: Number(servicePrice) || 0,
        serviceDescription: serviceDescription.trim() || null,
      };

      if (serviceToEdit) {
        await apiClient.patch(`/bookings/${bookingId}/additional-services/${serviceToEdit.id}`, payload);
        toast.success('Additional service updated successfully!');
      } else {
        await apiClient.post(`/bookings/${bookingId}/additional-services`, payload);
        toast.success('Additional service added successfully!');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save additional service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={serviceToEdit ? 'Edit Additional Service' : 'Add Additional Service'}
      maxWidth="lg"
    >
      {isLoadingVendors ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-primary w-6 h-6" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          
          {/* Section: Additional Service Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase border-b border-border pb-1.5 tracking-wider">
              Service Details
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              
              {/* Vendor Selection & Toggle */}
              <div className="flex flex-col gap-2 p-3 bg-secondary/5 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="custom-vendor-toggle"
                    checked={isCustomVendor}
                    onChange={(e) => setIsCustomVendor(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <label htmlFor="custom-vendor-toggle" className="text-[11px] font-bold text-foreground cursor-pointer">
                    Vendor not in list? Add custom vendor
                  </label>
                </div>

                {!isCustomVendor ? (
                  <div className="flex flex-col gap-1 mt-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Vendor *
                    </label>
                    <select
                      required={!isCustomVendor}
                      value={vendorId}
                      onChange={(e) => setVendorId(e.target.value)}
                      className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="">-- Select Vendor --</option>
                      {vendorsData?.map((v: any) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.vendorType || 'Other'})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 mt-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Custom Vendor Name *
                    </label>
                    <input
                      required={isCustomVendor}
                      type="text"
                      placeholder="Enter Custom Vendor Name"
                      value={customVendorName}
                      onChange={(e) => setCustomVendorName(e.target.value)}
                      className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}
              </div>

              {/* Service Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Service Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Extra Baggage, Special Meal, Tour Guide"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Service Price */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Service Price *
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  placeholder="e.g. 50"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Service Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Service Description
                </label>
                <textarea
                  placeholder="Enter details or remarks about this additional service..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                />
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
              {serviceToEdit ? 'Save Changes' : 'Add Service'}
            </button>
          </div>

        </form>
      )}
    </Modal>
  );
}
