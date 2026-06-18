import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  Plane,
  User,
  Calendar,
  Globe,
  Phone,
  Mail,
  Check,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import Tesseract from "tesseract.js";

function deriveAgeCategory(dob: string): string {
  if (!dob) return "";
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return "";
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
  if (years < 2) return "Infant (0-2)";
  if (years < 12) return "Child (2-12)";
  if (years < 15) return "Youth (12-15)";
  return "Adult (15+)";
}

function ageBadgeColor(cat: string) {
  if (cat.startsWith("Infant"))
    return "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300";
  if (cat.startsWith("Child"))
    return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300";
  if (cat.startsWith("Youth"))
    return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300";
  return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300";
}

function fmt(iso?: string | null) {
  return iso ? iso.substring(0, 10) : "";
}

const countryCodeMap: Record<string, string> = {
  GBR: "United Kingdom",
  USA: "United States",
  CAN: "Canada",
  AUS: "Australia",
  NZL: "New Zealand",
  IND: "India",
  PAK: "Pakistan",
  BGD: "Bangladesh",
  LKA: "Sri Lanka",
  ZAF: "South Africa",
  FRA: "France",
  DEU: "Germany",
  ITA: "Italy",
  ESP: "Spain",
  PRT: "Portugal",
  NLD: "Netherlands",
  BEL: "Belgium",
  CHE: "Switzerland",
  SWE: "Sweden",
  NOR: "Norway",
  DNK: "Denmark",
  FIN: "Finland",
  IRL: "Ireland",
  POL: "Poland",
  TUR: "Turkey",
  ARE: "United Arab Emirates",
  SAU: "Saudi Arabia",
  SGP: "Singapore",
  MYS: "Malaysia",
  HKG: "Hong Kong",
  CHN: "China",
  JPN: "Japan",
  KOR: "South Korea",
  THA: "Thailand",
  VNM: "Vietnam",
  PHL: "Philippines",
  IDN: "Indonesia",
  BRA: "Brazil",
  MEX: "Mexico",
  ARG: "Argentina",
  EGY: "Egypt",
  NGA: "Nigeria",
  KEN: "Kenya",
};

function cleanOcrDigits(str: string): string {
  return str
    .replace(/[OQ]/g, "0")
    .replace(/[IL]/g, "1")
    .replace(/Z/g, "2")
    .replace(/S/g, "5")
    .replace(/B/g, "8")
    .replace(/G/g, "6")
    .replace(/[^0-9]/g, "");
}

function parsePassportOcr(text: string) {
  const result: {
    passportNumber?: string;
    nationality?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    passportExpiryDate?: string;
    passportIssuingCountry?: string;
  } = {};

  const lines = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, "").toUpperCase())
    .filter((line) => line.length > 20);

  let mrzLine1 = "";
  let mrzLine2 = "";
  let startIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasManyChevrons = (line.match(/</g) || []).length >= 5;
    const startsWithMRZType = /^[PIOQ<]/.test(line) || line.includes("P<");
    if (line.length >= 30 && hasManyChevrons && startsWithMRZType) {
      const pIdx = line.indexOf("P<");
      if (pIdx !== -1) {
        startIdx = pIdx;
      } else {
        const matchP = line.match(/P[A-Z<]{10,}/);
        if (matchP && matchP.index !== undefined) {
          startIdx = matchP.index;
        }
      }
      
      mrzLine1 = line.substring(startIdx);
      if (i + 1 < lines.length) {
        mrzLine2 = lines[i + 1].substring(startIdx);
      }
      break;
    }
  }

  if (mrzLine1 && mrzLine2) {
    console.log("Found MRZ Line 1:", mrzLine1);
    console.log("Found MRZ Line 2:", mrzLine2);

    try {
      const countryCode = mrzLine1.substring(2, 5).replace(/</g, "");
      result.passportIssuingCountry =
        countryCodeMap[countryCode] || countryCode;
      result.nationality = countryCodeMap[countryCode] || countryCode;

      const namePart = mrzLine1.substring(5);
      const nameSplit = namePart.split("<<");
      if (nameSplit.length >= 2) {
        result.lastName = nameSplit[0].replace(/</g, " ").trim();
        result.firstName = nameSplit[1].split("<")[0].replace(/</g, " ").trim();
      }

      const passportNo = mrzLine2.substring(0, 9).replace(/</g, "");
      if (passportNo) {
        result.passportNumber = passportNo;
      }

      const dobStr = cleanOcrDigits(mrzLine2.substring(13, 19));
      if (dobStr.length === 6) {
        const yy = parseInt(dobStr.substring(0, 2), 10);
        const mm = parseInt(dobStr.substring(2, 4), 10) - 1;
        const dd = parseInt(dobStr.substring(4, 6), 10);
        const currentYear = new Date().getFullYear() % 100;
        const year = yy > currentYear + 10 ? 1900 + yy : 2000 + yy;
        const dobDate = new Date(year, mm, dd);
        if (!isNaN(dobDate.getTime())) {
          result.dateOfBirth = dobDate.toISOString().substring(0, 10);
        }
      }

      const expStr = cleanOcrDigits(mrzLine2.substring(21, 27));
      if (expStr.length === 6) {
        const yy = parseInt(expStr.substring(0, 2), 10);
        const mm = parseInt(expStr.substring(2, 4), 10) - 1;
        const dd = parseInt(expStr.substring(4, 6), 10);
        const year = 2000 + yy;
        const expDate = new Date(year, mm, dd);
        if (!isNaN(expDate.getTime())) {
          result.passportExpiryDate = expDate.toISOString().substring(0, 10);
        }
      }
    } catch (e) {
      console.error("Failed to parse MRZ:", e);
    }
  }

  if (!result.passportNumber) {
    const passNoMatch = text.match(
      /(?:passport|doc|document)\s*(?:no|number|num)?\s*[:.-]?\s*([A-Z0-9]{8,9})/i,
    );
    if (passNoMatch) {
      result.passportNumber = passNoMatch[1].toUpperCase();
    }
  }

  if (!result.firstName) {
    const givenNamesMatch = text.match(
      /(?:given\s*names?|first\s*names?)\s*[:.-]?\s*([A-Z\s]{2,30})/i,
    );
    if (givenNamesMatch) {
      result.firstName = givenNamesMatch[1].trim();
    }
  }

  if (!result.lastName) {
    const surnameMatch = text.match(
      /(?:surname|last\s*names?)\s*[:.-]?\s*([A-Z\s]{2,30})/i,
    );
    if (surnameMatch) {
      result.lastName = surnameMatch[1].trim();
    }
  }

  return result;
}

interface FormPassenger {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  nationality: string;
  passportNumber: string;
  passportExpiryDate: string;
  passportIssuingCountry: string;
  role: string;
  age: string;
  passportScanKey?: string | null;
  collectPassport: boolean;
  collectAdditional: boolean;
  documents: Array<{
    id: string;
    title: string;
    description?: string;
    fileKey?: string | null;
    fileName?: string | null;
  }>;
}

export default function PassengerForm() {
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [passengers, setPassengers] = useState<FormPassenger[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const [docTitle, setDocTitle] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  useEffect(() => {
    setDocTitle("");
    setDocDesc("");
    setDocFile(null);
  }, [activeIdx]);

  useEffect(() => {
    if (!token) return;
    apiClient
      .get(`/bookings/passenger-form/${token}`)
      .then((res) => {
        const data = res.data.data;
        setBooking(data.booking);

        // Populate passenger forms
        const list = data.passengers.map((p: any) => ({
          id: p.id,
          title: p.title || "Mr",
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          dateOfBirth: fmt(p.dateOfBirth),
          email: p.email || "",
          phoneNumber: p.phoneNumber || "",
          nationality: p.nationality || "",
          passportNumber: p.passportNumber || "",
          passportExpiryDate: fmt(p.passportExpiryDate),
          passportIssuingCountry: p.passportIssuingCountry || "",
          role: p.role || "Passenger",
          age: p.age || "",
          passportScanKey: p.passportScanKey || null,
          collectPassport: p.collectPassport !== false,
          collectAdditional: !!p.collectAdditional,
          documents: p.documents || [],
        }));
        setPassengers(list);

        // Set active passenger to the one matching token
        const idx = list.findIndex((p: any) => p.id === data.passenger.id);
        if (idx !== -1) {
          setActiveIdx(idx);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  // Check if passenger's passport/DOB fields are complete
  const isPassengerComplete = (p: FormPassenger) => {
    const basicComplete =
      p.firstName.trim() !== "" &&
      p.lastName.trim() !== "" &&
      p.email.trim() !== "" &&
      p.dateOfBirth !== "";

    const passportComplete =
      !p.collectPassport ||
      (p.passportNumber.trim() !== "" &&
        p.passportExpiryDate !== "" &&
        p.passportIssuingCountry.trim() !== "");

    const additionalComplete = true; // since additional documents are fully custom and optional

    return basicComplete && passportComplete && additionalComplete;
  };

  const handleFieldChange = (field: keyof FormPassenger, val: string) => {
    setPassengers((prev) =>
      prev.map((p, idx) => {
        if (idx === activeIdx) {
          const updated = { ...p, [field]: val };
          if (field === "dateOfBirth") {
            updated.age = deriveAgeCategory(val);
          }
          return updated;
        }
        return p;
      }),
    );
  };

  const autofillPassengerFields = (fields: Partial<FormPassenger>) => {
    setPassengers((prev) =>
      prev.map((p, idx) => {
        if (idx === activeIdx) {
          const updated = { ...p, ...fields };
          if (fields.dateOfBirth) {
            updated.age = deriveAgeCategory(fields.dateOfBirth);
          }
          return updated;
        }
        return p;
      }),
    );
  };

  const handleAddPassenger = async () => {
    const toastId = toast.loading("Adding another passenger...");
    try {
      const res = await apiClient.post(
        `/bookings/passenger-form/${token}/passenger`,
      );
      const newPassenger = res.data.data;

      const formatted: FormPassenger = {
        id: newPassenger.id,
        title: newPassenger.title || "Mr",
        firstName: newPassenger.firstName || "",
        lastName: newPassenger.lastName || "",
        dateOfBirth: fmt(newPassenger.dateOfBirth),
        email: newPassenger.email || "",
        phoneNumber: newPassenger.phoneNumber || "",
        nationality: newPassenger.nationality || "",
        passportNumber: newPassenger.passportNumber || "",
        passportExpiryDate: fmt(newPassenger.passportExpiryDate),
        passportIssuingCountry: newPassenger.passportIssuingCountry || "",
        role: newPassenger.role || "Passenger",
        age: newPassenger.age || "",
        passportScanKey: newPassenger.passportScanKey || null,
        collectPassport: newPassenger.collectPassport !== false,
        collectAdditional: !!newPassenger.collectAdditional,
        documents: newPassenger.documents || [],
      };

      setPassengers((prev) => [...prev, formatted]);
      setActiveIdx(passengers.length);
      toast.success("New passenger added! Please fill in their details.", {
        id: toastId,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add passenger", {
        id: toastId,
      });
    }
  };

  const handleRemovePassenger = async (passengerId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this passenger from the booking?"
    );
    if (!confirmDelete) return;

    const toastId = toast.loading("Removing passenger...");
    try {
      await apiClient.delete(
        `/bookings/passenger-form/${token}/passenger/${passengerId}`,
      );

      setPassengers((prev) => {
        const list = prev.filter((p) => p.id !== passengerId);
        // Adjust activeIdx if necessary
        if (activeIdx >= list.length) {
          setActiveIdx(Math.max(0, list.length - 1));
        }
        return list;
      });
      toast.success("Passenger removed successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove passenger", {
        id: toastId,
      });
    }
  };

  const runOcrAndAutofill = async (file: File) => {
    const ocrToastId = toast.loading(
      "Scanning passport image with OCR (Tesseract.js)...",
    );
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            toast.loading(`OCR scanning: ${Math.round(m.progress * 100)}%`, {
              id: ocrToastId,
            });
          }
        },
      });

      const text = result.data.text;
      console.log("OCR Extracted Text:", text);
      const parsed = parsePassportOcr(text);
      console.log("Parsed OCR Fields:", parsed);

      if (Object.keys(parsed).length > 0) {
        autofillPassengerFields(parsed);
        toast.success("Passport fields autofilled from scan!", {
          id: ocrToastId,
        });
      } else {
        toast.info(
          "OCR completed, but no passport fields could be matching. Please check or enter manually.",
          { id: ocrToastId },
        );
      }
    } catch (err: any) {
      console.error("OCR scan error:", err);
      toast.error("OCR scanning failed. Please enter details manually.", {
        id: ocrToastId,
      });
    }
  };

  const handleFileUpload = async (
    passengerId: string,
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading passport scan...");
    try {
      const res = await apiClient.post(
        `/bookings/passenger-form/${token}/upload/${passengerId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      const { passportScanKey } = res.data.data;
      setPassengers((prev) =>
        prev.map((p) => (p.id === passengerId ? { ...p, passportScanKey } : p)),
      );
      toast.success("Passport scan uploaded successfully", { id: toastId });

      // Trigger OCR scanner if it is an image
      if (file.type.startsWith("image/")) {
        runOcrAndAutofill(file);
      } else {
        toast.info(
          "OCR autofill is only supported for image files (JPEG, PNG). For PDFs, please enter details manually.",
        );
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to upload passport scan",
        { id: toastId },
      );
    }
  };

  const handleRemoveScan = async (passengerId: string) => {
    const toastId = toast.loading("Removing passport scan...");
    try {
      await apiClient.delete(
        `/bookings/passenger-form/${token}/passport-scan/${passengerId}`,
      );
      setPassengers((prev) =>
        prev.map((p) =>
          p.id === passengerId ? { ...p, passportScanKey: null } : p,
        ),
      );
      toast.success("Passport scan removed", { id: toastId });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to remove passport scan",
        { id: toastId },
      );
    }
  };

  const handleAddCustomDocument = async (
    e: React.FormEvent,
    passengerId: string,
  ) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      toast.error("Please enter a document title");
      return;
    }

    setIsAddingDoc(true);
    const toastId = toast.loading("Adding custom document...");
    try {
      const formData = new FormData();
      formData.append("title", docTitle.trim());
      if (docDesc.trim()) {
        formData.append("description", docDesc.trim());
      }
      if (docFile) {
        formData.append("file", docFile);
      }

      const res = await apiClient.post(
        `/bookings/passenger-form/${token}/documents/${passengerId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const newDoc = res.data.data;
      setPassengers((prev) =>
        prev.map((p) =>
          p.id === passengerId
            ? { ...p, documents: [...(p.documents || []), newDoc] }
            : p,
        ),
      );

      toast.success("Document added successfully", { id: toastId });
      setDocTitle("");
      setDocDesc("");
      setDocFile(null);
      const fileInput = document.getElementById(
        `custom-doc-file-${passengerId}`,
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add document", {
        id: toastId,
      });
    } finally {
      setIsAddingDoc(false);
    }
  };

  const handleDeleteCustomDocument = async (
    passengerId: string,
    documentId: string,
  ) => {
    const toastId = toast.loading("Removing document...");
    try {
      await apiClient.delete(
        `/bookings/passenger-form/${token}/documents/${documentId}`,
      );
      setPassengers((prev) =>
        prev.map((p) =>
          p.id === passengerId
            ? {
                ...p,
                documents: (p.documents || []).filter(
                  (d) => d.id !== documentId,
                ),
              }
            : p,
        ),
      );
      toast.success("Document removed", { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove document", {
        id: toastId,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consentChecked) {
      toast.error(
        "Please check the consent box to confirm the information is correct.",
      );
      return;
    }

    // Validate active passenger fields
    const activePassenger = passengers[activeIdx];
    if (
      !activePassenger.firstName.trim() ||
      !activePassenger.lastName.trim() ||
      !activePassenger.email.trim()
    ) {
      toast.error(
        `Please fill in all required fields for ${activePassenger.firstName || "current passenger"}`,
      );
      return;
    }

    // Warn if some passengers are incomplete
    const incompleteCount = passengers.filter(
      (p) => !isPassengerComplete(p),
    ).length;
    if (incompleteCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${incompleteCount} passenger(s) with incomplete document details. Do you still want to submit?`,
      );
      if (!confirmSubmit) return;
    }

    setSaving(true);
    try {
      await apiClient.put(`/bookings/passenger-form/${token}`, {
        passengers: passengers.map((p) => ({
          id: p.id,
          firstName: p.firstName.trim(),
          lastName: p.lastName.trim(),
          dateOfBirth: p.dateOfBirth || null,
          email: p.email.trim(),
          phoneNumber: p.phoneNumber || null,
          nationality: p.nationality || null,
          passportNumber: p.passportNumber || null,
          passportExpiryDate: p.passportExpiryDate || null,
          passportIssuingCountry: p.passportIssuingCountry || null,
        })),
      });
      toast.success("Thank you! All passenger details have been saved.");
      setSubmitted(true);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to submit. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const activeP = passengers[activeIdx];
  const lbl =
    "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1";
  const inp =
    "w-full text-sm py-2 px-3 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white transition-all";

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
      </div>
    );

  if (notFound)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
          <p className="text-4xl mb-3">😕</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Link Not Found
          </h1>
          <p className="text-gray-500 text-sm">
            This form link is invalid or has already expired. Please contact
            your travel agent.
          </p>
        </div>
      </div>
    );

  if (submitted)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <CheckCircle2 className="text-emerald-500 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-gray-600 text-sm mb-4">
            Your travel details have been successfully submitted. Your travel
            agent has been notified.
          </p>
          {booking && (
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 mb-2">
              <span className="font-bold">Booking Ref:</span>{" "}
              {booking.bookingReference}
            </div>
          )}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
            <Plane className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-gray-800 text-lg leading-tight">
              Terrific Travel
            </h1>
            <p className="text-xs text-gray-500">Document Collection Portal</p>
          </div>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl shadow-sm text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
              Completing Details For
            </p>
            <h2 className="text-white font-black text-xl">
              Booking {booking?.bookingReference}
            </h2>
          </div>
          {booking?.departureDate && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white border border-white/10">
              ✈ Departs{" "}
              {new Date(booking.departureDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-b-2xl shadow-md border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-3">
          {/* Passenger Selector Sidebar */}
          <div className="bg-gray-50/50 border-r border-gray-100 p-4 space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">
              Passengers List
            </h3>
            <div className="space-y-1.5">
              {passengers.map((p, idx) => {
                const complete = isPassengerComplete(p);
                const active = idx === activeIdx;
                const ageCat = p.age || deriveAgeCategory(p.dateOfBirth);

                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveIdx(idx)}
                    type="button"
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      active
                        ? "bg-white border-orange-200 shadow-sm ring-1 ring-orange-500/10"
                        : "bg-transparent border-transparent hover:bg-gray-100/50"
                    }`}
                  >
                    <div className="truncate">
                      <p
                        className={`text-xs font-bold truncate ${active ? "text-orange-600" : "text-gray-700"}`}
                      >
                        {p.title} {p.firstName || "New"}{" "}
                        {p.lastName || "Passenger"}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {p.role}
                      </p>
                      {ageCat && (
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold mt-1 ${ageBadgeColor(ageCat)}`}
                        >
                          {ageCat}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {p.role !== "Leader" && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(p.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Remove Passenger"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      {complete ? (
                        <div
                          className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"
                          title="Completed"
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-500"
                          title="Pending documents"
                        >
                          <AlertCircle size={12} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleAddPassenger}
              className="w-full mt-3 py-2.5 px-3 border-2 border-dashed border-orange-200 hover:border-orange-500 hover:bg-orange-50/20 text-orange-600 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus size={13} strokeWidth={2.5} />
              Add Passenger
            </button>
          </div>

          {/* Form Content Panel */}
          <div className="col-span-2 p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Section Header */}
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Form for {activeP?.title} {activeP?.firstName}{" "}
                    {activeP?.lastName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Please provide your details below.
                  </p>
                </div>
                <span className="text-xs text-gray-400 font-semibold">
                  Passenger {activeIdx + 1} of {passengers.length}
                </span>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
                  <User size={13} />
                  Personal Information
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={lbl}>Title *</label>
                      <select
                        value={activeP?.title || "Mr"}
                        onChange={(e) =>
                          handleFieldChange("title", e.target.value)
                        }
                        className={inp}
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>First Name *</label>
                      <input
                        required
                        type="text"
                        value={activeP?.firstName}
                        onChange={(e) =>
                          handleFieldChange("firstName", e.target.value)
                        }
                        className={inp}
                        placeholder="e.g. John"
                      />
                    </div>
                    <div>
                      <label className={lbl}>Last Name *</label>
                      <input
                        required
                        type="text"
                        value={activeP?.lastName}
                        onChange={(e) =>
                          handleFieldChange("lastName", e.target.value)
                        }
                        className={inp}
                        placeholder="e.g. Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Date of Birth *</label>
                      <input
                        required
                        type="date"
                        value={activeP?.dateOfBirth}
                        onChange={(e) =>
                          handleFieldChange("dateOfBirth", e.target.value)
                        }
                        className={inp}
                      />
                    </div>
                    <div>
                      <label className={lbl}>Nationality</label>
                      <input
                        type="text"
                        value={activeP?.nationality}
                        onChange={(e) =>
                          handleFieldChange("nationality", e.target.value)
                        }
                        className={inp}
                        placeholder="e.g. British"
                      />
                    </div>
                    <div>
                      <label className={lbl}>Email Address *</label>
                      <input
                        required
                        type="email"
                        value={activeP?.email}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        className={inp}
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className={lbl}>Phone Number</label>
                      <input
                        type="tel"
                        value={activeP?.phoneNumber}
                        onChange={(e) =>
                          handleFieldChange("phoneNumber", e.target.value)
                        }
                        className={inp}
                        placeholder="+44 7000 000000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Passport Information */}
              {activeP?.collectPassport && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-1.5">
                    <FileText size={13} />
                    Passport Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Passport Number</label>
                      <input
                        type="text"
                        value={activeP?.passportNumber}
                        onChange={(e) =>
                          handleFieldChange(
                            "passportNumber",
                            e.target.value.toUpperCase(),
                          )
                        }
                        className={`${inp} font-mono uppercase`}
                        placeholder="e.g. GB123456"
                      />
                    </div>
                    <div>
                      <label className={lbl}>Issuing Country</label>
                      <input
                        type="text"
                        value={activeP?.passportIssuingCountry}
                        onChange={(e) =>
                          handleFieldChange(
                            "passportIssuingCountry",
                            e.target.value,
                          )
                        }
                        className={inp}
                        placeholder="e.g. United Kingdom"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={lbl}>Passport Expiry Date</label>
                      <input
                        type="date"
                        value={activeP?.passportExpiryDate}
                        onChange={(e) =>
                          handleFieldChange(
                            "passportExpiryDate",
                            e.target.value,
                          )
                        }
                        className={inp}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={lbl}>Passport Scan / Photo</label>
                      <div className="mt-1">
                        {activeP?.passportScanKey ? (
                          <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50 rounded-lg p-3 w-full">
                            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                              <Check size={14} className="stroke-[3]" />
                              <span>Passport Scan Uploaded</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <a
                                href={`${apiClient.defaults.baseURL}/bookings/passenger-form/${token}/passport-scan/${activeP.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                              >
                                View Document
                              </a>
                              <button
                                type="button"
                                onClick={() => handleRemoveScan(activeP.id)}
                                className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                              >
                                Replace
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,application/pdf"
                              onChange={(e) =>
                                handleFileUpload(activeP.id, e.target.files)
                              }
                              className="hidden"
                              id={`passport-upload-${activeP.id}`}
                            />
                            <label
                              htmlFor={`passport-upload-${activeP.id}`}
                              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-orange-500 hover:bg-orange-50/20 transition-all text-center"
                            >
                              <svg
                                className="w-6 h-6 text-gray-400 mb-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <span className="text-xs font-bold text-gray-600">
                                Click to upload Passport Scan (JPEG, PNG, PDF)
                              </span>
                              <span className="text-[10px] text-gray-400 mt-0.5">
                                Max file size: 5MB
                              </span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Documents */}
              {activeP?.collectAdditional && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Additional Documents
                  </h4>

                  {/* List of existing documents */}
                  {activeP.documents && activeP.documents.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Uploaded Documents ({activeP.documents.length})
                      </p>
                      <div className="space-y-2">
                        {activeP.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between border border-emerald-100 bg-emerald-50/30 rounded-xl p-3 shadow-sm"
                          >
                            <div className="flex-1 min-w-0 pr-3">
                              <p className="text-xs font-bold text-emerald-800 truncate">
                                {doc.title}
                              </p>
                              {doc.description && (
                                <p className="text-[11px] text-emerald-700/80 mt-0.5 whitespace-pre-wrap">
                                  {doc.description}
                                </p>
                              )}
                              {doc.fileName && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
                                  📎 {doc.fileName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {doc.fileKey && (
                                <a
                                  href={`${apiClient.defaults.baseURL}/bookings/passenger-form/${token}/documents/${doc.id}/file`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-orange-600 hover:text-orange-700 font-bold"
                                >
                                  View File
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCustomDocument(activeP.id, doc.id)
                                }
                                className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form to add a new document */}
                  <div className="border border-gray-100 bg-gray-50/50 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Add Custom Document (e.g. e-visa, insurance, voucher)
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className={lbl}>Document Title *</label>
                        <input
                          type="text"
                          value={docTitle}
                          onChange={(e) => setDocTitle(e.target.value)}
                          className={inp}
                          placeholder="e.g. E-visa, Hotel Voucher, Travel Insurance"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                            Quick Suggestions:
                          </span>
                          {[
                            "E-visa",
                            "Share Code",
                            "Travel Insurance",
                            "Hotel Voucher",
                          ].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setDocTitle(s)}
                              className="px-2 py-0.5 border border-orange-200/60 bg-orange-50/50 hover:bg-orange-100 text-orange-700 text-[10px] font-bold rounded transition-all shadow-sm"
                            >
                              + {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={lbl}>
                          Description / Details (Optional)
                        </label>
                        <textarea
                          value={docDesc}
                          onChange={(e) => setDocDesc(e.target.value)}
                          className={`${inp} min-h-[60px] resize-y`}
                          placeholder="e.g. Share code: S1234567G, or policy number/notes..."
                        />
                      </div>

                      <div>
                        <label className={lbl}>
                          File Attachment (Optional)
                        </label>
                        <div className="mt-1">
                          {docFile ? (
                            <div className="flex items-center justify-between border border-orange-200 bg-orange-50/30 rounded-lg p-2.5 text-xs">
                              <span className="text-orange-800 font-medium truncate flex-1 pr-2">
                                📎 {docFile.name} (
                                {(docFile.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                              <button
                                type="button"
                                onClick={() => setDocFile(null)}
                                className="text-[11px] text-rose-600 hover:text-rose-700 font-bold shrink-0"
                              >
                                Remove File
                              </button>
                            </div>
                          ) : (
                            <div>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,application/pdf"
                                onChange={(e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    setDocFile(e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                                id={`custom-doc-file-${activeP.id}`}
                              />
                              <label
                                htmlFor={`custom-doc-file-${activeP.id}`}
                                className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-orange-500 hover:bg-orange-50/10 transition-all text-center"
                              >
                                <span className="text-[11px] font-bold text-gray-500">
                                  Attach a file (JPEG, PNG, PDF - Max 5MB)
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          disabled={isAddingDoc || !docTitle.trim()}
                          onClick={(e) =>
                            handleAddCustomDocument(e, activeP.id)
                          }
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                        >
                          {isAddingDoc && (
                            <Loader2 size={11} className="animate-spin" />
                          )}
                          Add Document
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Consent Checkbox */}
              <div className="border-t border-gray-100 pt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:border-orange-500 h-4 w-4 transition-all"
                  />
                  <span className="text-xs text-gray-600 select-none group-hover:text-gray-800 transition-colors">
                    I confirm that all the information provided above is
                    correct. I understand that providing incorrect information
                    may lead to the cancellation of flights, hotels, and visas.{" "}
                    <span className="text-rose-500">*</span>
                  </span>
                </label>
              </div>

              {/* Bottom Actions inside form panel */}
              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-2 justify-between items-center">
                <span className="text-[10px] text-gray-400 text-center sm:text-left">
                  Please fill in passport and DOB fields for all passengers.
                </span>

                <div className="flex gap-2 w-full sm:w-auto">
                  {activeIdx < passengers.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveIdx((idx) => idx + 1)}
                      className="flex-1 sm:flex-none px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all text-center"
                    >
                      Next Passenger
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={saving || !consentChecked}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/15 disabled:opacity-50 transition-all text-center"
                  >
                    {saving && <Loader2 size={13} className="animate-spin" />}
                    Submit All Details
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-5">
          🔒 Secure Data Collection. Your details are encrypted and stored in
          compliance with GDPR.
        </p>
      </div>
    </div>
  );
}
