import React, { useState, useEffect, useRef } from "react";
import { apiClient } from "../api/client";
import Modal from "./Modal";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";
import {
  Loader2, Copy, Check, User, FileText, Trash2, Plus, Eye,
  ScanLine, Upload, X,
} from "lucide-react";
import Tesseract from "tesseract.js";

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: () => void;
  passengerToEdit?: any | null;
  bookingPassengers?: any[];
}

const TITLES = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"];
const ROLES  = ["Leader", "Family Member", "Passenger"];

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
  if (cat.startsWith("Infant"))  return "bg-pink-100 text-pink-700 border-pink-200";
  if (cat.startsWith("Child"))   return "bg-blue-100 text-blue-700 border-blue-200";
  if (cat.startsWith("Youth"))   return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

function fmt(iso?: string | null) { return iso ? iso.substring(0, 10) : ""; }

// ─── Passport OCR helpers (identical logic to PassengerForm) ─────────────────

const countryCodeMap: Record<string, string> = {
  GBR: "United Kingdom", USA: "United States", CAN: "Canada",
  AUS: "Australia", NZL: "New Zealand", IND: "India", PAK: "Pakistan",
  BGD: "Bangladesh", LKA: "Sri Lanka", ZAF: "South Africa",
  FRA: "France", DEU: "Germany", ITA: "Italy", ESP: "Spain",
  PRT: "Portugal", NLD: "Netherlands", BEL: "Belgium", CHE: "Switzerland",
  SWE: "Sweden", NOR: "Norway", DNK: "Denmark", FIN: "Finland",
  IRL: "Ireland", POL: "Poland", TUR: "Turkey",
  ARE: "United Arab Emirates", SAU: "Saudi Arabia",
  SGP: "Singapore", MYS: "Malaysia", HKG: "Hong Kong",
  CHN: "China", JPN: "Japan", KOR: "South Korea",
  THA: "Thailand", VNM: "Vietnam", PHL: "Philippines", IDN: "Indonesia",
  BRA: "Brazil", MEX: "Mexico", ARG: "Argentina",
  EGY: "Egypt", NGA: "Nigeria", KEN: "Kenya",
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

  // Strip ALL whitespace & uppercase — mirrors what PassengerForm does
  const lines = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, "").toUpperCase())
    .filter((line) => line.length > 20);

  let mrzLine1 = "";
  let mrzLine2 = "";
  let startIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if line looks like MRZ Line 1:
    // It should have length >= 30, contain '<', and either start with P/I/O/Q/< or contain 'P<' in the first few chars
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
    console.log("PassengerModal OCR — MRZ Line 1:", mrzLine1);
    console.log("PassengerModal OCR — MRZ Line 2:", mrzLine2);

    try {
      // Issuing country — chars 2-4 of line 1
      const countryCode = mrzLine1.substring(2, 5).replace(/</g, "");
      result.passportIssuingCountry = countryCodeMap[countryCode] || countryCode;
      result.nationality = countryCodeMap[countryCode] || countryCode;

      // Name — after char 5, split on <<
      const namePart = mrzLine1.substring(5);
      const nameSplit = namePart.split("<<");
      if (nameSplit.length >= 2) {
        result.lastName = nameSplit[0].replace(/</g, " ").trim();
        result.firstName = nameSplit[1].split("<")[0].replace(/</g, " ").trim();
      }

      // Passport number — chars 0-8 of line 2
      const passportNo = mrzLine2.substring(0, 9).replace(/</g, "");
      if (passportNo) result.passportNumber = passportNo;

      // Date of birth — chars 13-18 of line 2 (YYMMDD)
      const dobStr = cleanOcrDigits(mrzLine2.substring(13, 19));
      if (dobStr.length === 6) {
        const yy = parseInt(dobStr.substring(0, 2), 10);
        const mm = parseInt(dobStr.substring(2, 4), 10) - 1;
        const dd = parseInt(dobStr.substring(4, 6), 10);
        // If yy > current year + 10 → assume 1900s (i.e. someone born in 1985 shows as 85)
        const currentYear = new Date().getFullYear() % 100;
        const year = yy > currentYear + 10 ? 1900 + yy : 2000 + yy;
        const dobDate = new Date(year, mm, dd);
        if (!isNaN(dobDate.getTime())) {
          result.dateOfBirth = dobDate.toISOString().substring(0, 10);
        }
      }

      // Expiry date — chars 21-26 of line 2 (YYMMDD) — always 2000s
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
      console.error("PassengerModal OCR — MRZ parse error:", e);
    }
  }

  // Fallback: regex-based extraction from raw text if MRZ parsing yielded nothing
  if (!result.passportNumber) {
    const m = text.match(/(?:passport|doc|document)\s*(?:no|number|num)?\s*[:.-]?\s*([A-Z0-9]{8,9})/i);
    if (m) result.passportNumber = m[1].toUpperCase();
  }
  if (!result.firstName) {
    const m = text.match(/(?:given\s*names?|first\s*names?)\s*[:.-]?\s*([A-Z\s]{2,30})/i);
    if (m) result.firstName = m[1].trim();
  }
  if (!result.lastName) {
    const m = text.match(/(?:surname|last\s*names?)\s*[:.-]?\s*([A-Z\s]{2,30})/i);
    if (m) result.lastName = m[1].trim();
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PassengerModal({
  isOpen, onClose, bookingId, onSuccess,
  passengerToEdit = null, bookingPassengers = [],
}: PassengerModalProps) {
  const isEdit = !!passengerToEdit;

  // Personal info
  const [title,                  setTitle]                  = useState("Mr");
  const [firstName,              setFirstName]              = useState("");
  const [lastName,               setLastName]               = useState("");
  const [dateOfBirth,            setDateOfBirth]            = useState("");
  const [email,                  setEmail]                  = useState("");
  const [phoneNumber,            setPhoneNumber]            = useState("");
  const [nationality,            setNationality]            = useState("");
  const [passportNumber,         setPassportNumber]         = useState("");
  const [passportExpiryDate,     setPassportExpiryDate]     = useState("");
  const [passportIssuingCountry, setPassportIssuingCountry] = useState("");
  const [role,                   setRole]                   = useState("Passenger");
  const [isSubmitting,           setIsSubmitting]           = useState(false);
  const [linkCopied,             setLinkCopied]             = useState(false);
  const [isSendingEmail,         setIsSendingEmail]         = useState(false);
  const [addMode,                setAddMode]                = useState<"link" | "manual">("link");
  const [collectPassport,        setCollectPassport]        = useState(true);
  const [collectAdditional,      setCollectAdditional]      = useState(false);

  // Passport scan state
  const [passportScanKey,        setPassportScanKey]        = useState<string | null>(null);
  const [isOcrRunning,           setIsOcrRunning]           = useState(false);
  const [isUploadingPassport,    setIsUploadingPassport]    = useState(false);
  const [isDeletingPassport,     setIsDeletingPassport]     = useState(false);
  const passportFileRef = useRef<HTMLInputElement>(null);

  // Additional documents state
  const [documents,              setDocuments]              = useState<any[]>([]);
  const [docTitle,               setDocTitle]               = useState("");
  const [docDesc,                setDocDesc]                = useState("");
  const [docFile,                setDocFile]                = useState<File | null>(null);
  const [isAddingDoc,            setIsAddingDoc]            = useState(false);
  const docFileRef = useRef<HTMLInputElement>(null);

  // Local files/docs state for creation mode
  const [localPassportFile, setLocalPassportFile] = useState<File | null>(null);
  const [localDocuments, setLocalDocuments] = useState<any[]>([]);

  // Sub-modals visibility states
  const [isPassportScanModalOpen, setIsPassportScanModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Passenger search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const leaderPassenger = bookingPassengers?.find((p) => p.role === "Leader");
  const leaderEmail = leaderPassenger?.email || "";

  const ageCategory = deriveAgeCategory(dateOfBirth);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
      setShowSearchResults(false);
      if (passengerToEdit) {
        setTitle(passengerToEdit.title || "Mr");
        setFirstName(passengerToEdit.firstName || "");
        setLastName(passengerToEdit.lastName || "");
        setDateOfBirth(fmt(passengerToEdit.dateOfBirth));
        setEmail(passengerToEdit.email || "");
        setPhoneNumber(passengerToEdit.phoneNumber || "");
        setNationality(passengerToEdit.nationality || "");
        setPassportNumber(passengerToEdit.passportNumber || "");
        setPassportExpiryDate(fmt(passengerToEdit.passportExpiryDate));
        setPassportIssuingCountry(passengerToEdit.passportIssuingCountry || "");
        setRole(passengerToEdit.role || "Passenger");
        setCollectPassport(passengerToEdit.collectPassport !== false);
        setCollectAdditional(!!passengerToEdit.collectAdditional);
        setPassportScanKey(passengerToEdit.passportScanKey || null);
        setDocuments(passengerToEdit.documents || []);
        setLocalPassportFile(null);
        setLocalDocuments([]);
      } else {
        setTitle("Mr"); setFirstName(""); setLastName(""); setDateOfBirth("");
        setEmail(""); setPhoneNumber(""); setNationality(""); setPassportNumber("");
        setPassportExpiryDate(""); setPassportIssuingCountry(""); setRole("Passenger");
        setAddMode("link");
        setCollectPassport(true);
        setCollectAdditional(false);
        setPassportScanKey(null);
        setDocuments([]);
        setLocalPassportFile(null);
        setLocalDocuments([]);
      }
      setLinkCopied(false);
      setDocTitle(""); setDocDesc(""); setDocFile(null);
      setIsPassportScanModalOpen(false);
      setIsDocsModalOpen(false);
    }
  }, [isOpen, passengerToEdit]);

  // Click outside search container listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Autofill leader email for family members
  useEffect(() => {
    if (role === "Family Member" && !email && leaderEmail) {
      setEmail(leaderEmail);
    }
  }, [role, leaderEmail]);

  // ─── Passenger Search Handlers ─────────────────────────────────────────────

  const handlePassengerSearch = async (query: string) => {
    setSearchQuery(query);
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const res = await apiClient.get(`/bookings/passengers/global-search?q=${encodeURIComponent(trimmed)}`);
      setSearchResults(res.data.data || []);
    } catch (err) {
      console.error("Failed to search passengers:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchedPassenger = (p: any) => {
    setTitle(p.title || "Mr");
    setFirstName(p.firstName || "");
    setLastName(p.lastName || "");
    setDateOfBirth(p.dateOfBirth ? fmt(p.dateOfBirth) : "");
    setEmail(p.email || "");
    setPhoneNumber(p.phoneNumber || "");
    setNationality(p.nationality || "");
    setPassportNumber(p.passportNumber || "");
    setPassportExpiryDate(p.passportExpiryDate ? fmt(p.passportExpiryDate) : "");
    setPassportIssuingCountry(p.passportIssuingCountry || "");

    // Hide search results and query
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    toast.success("Passenger details imported!");
  };

  // ─── OCR autofill ──────────────────────────────────────────────────────────

  const autofillFromOcr = (fields: Record<string, string>) => {
    if (fields.firstName)              setFirstName(fields.firstName);
    if (fields.lastName)               setLastName(fields.lastName);
    if (fields.nationality)            setNationality(fields.nationality);
    if (fields.passportNumber)         setPassportNumber(fields.passportNumber.toUpperCase());
    if (fields.passportExpiryDate)     setPassportExpiryDate(fields.passportExpiryDate);
    if (fields.passportIssuingCountry) setPassportIssuingCountry(fields.passportIssuingCountry);
    if (fields.dateOfBirth)            setDateOfBirth(fields.dateOfBirth);
  };

  const runOcr = async (file: File) => {
    if (file.type === "application/pdf") {
      toast.info("OCR autofill works with image files (JPEG/PNG). PDF uploaded successfully but fields won't be auto-filled.");
      return;
    }
    setIsOcrRunning(true);
    const toastId = toast.loading("Scanning passport with OCR…");
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            toast.loading(`OCR scanning: ${Math.round(m.progress * 100)}%`, { id: toastId });
          }
        },
      });
      const rawText = result.data.text;
      console.log("PassengerModal OCR raw text:", rawText);
      const parsed = parsePassportOcr(rawText);
      console.log("PassengerModal OCR parsed fields:", parsed);
      const hasFields = Object.values(parsed).some((v) => v && v.trim() !== "");
      if (hasFields) {
        autofillFromOcr(parsed);
        toast.success("Passport fields autofilled from scan!", { id: toastId });
      } else {
        toast.info("OCR completed but no fields detected. Please enter manually.", { id: toastId });
      }
    } catch (err) {
      console.error("OCR error:", err);
      toast.error("OCR scan failed.", { id: toastId });
    } finally {
      setIsOcrRunning(false);
    }
  };


  // ─── Passport scan upload ───────────────────────────────────────────────────

  const handlePassportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !passengerToEdit?.id) return;

    setIsUploadingPassport(true);
    const toastId = toast.loading("Uploading passport scan…");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiClient.post(
        `/bookings/${bookingId}/passengers/${passengerToEdit.id}/passport-scan`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setPassportScanKey(res.data.data.passportScanKey);
      toast.success("Passport scan uploaded!", { id: toastId });
      // Run OCR on the uploaded image
      if (file.type.startsWith("image/")) {
        await runOcr(file);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed", { id: toastId });
    } finally {
      setIsUploadingPassport(false);
      if (passportFileRef.current) passportFileRef.current.value = "";
    }
  };

  const handleViewPassportScan = () => {
    if (!passengerToEdit?.id) return;
    const token = useAuthStore.getState().accessToken;
    window.open(
      `${apiClient.defaults.baseURL}/bookings/${bookingId}/passengers/${passengerToEdit.id}/passport-scan?token=${token}`,
      "_blank",
    );
  };

  const handleDeletePassportScan = async () => {
    if (!passengerToEdit?.id || !window.confirm("Remove passport scan?")) return;
    setIsDeletingPassport(true);
    try {
      await apiClient.delete(`/bookings/${bookingId}/passengers/${passengerToEdit.id}/passport-scan`);
      setPassportScanKey(null);
      toast.success("Passport scan removed");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove scan");
    } finally {
      setIsDeletingPassport(false);
    }
  };

  // ─── Additional documents ───────────────────────────────────────────────────

  const handleAddDocument = async () => {
    if (!docTitle.trim()) { toast.error("Document title is required"); return; }
    if (!passengerToEdit?.id) { toast.error("Save the passenger first before adding documents"); return; }

    setIsAddingDoc(true);
    const toastId = toast.loading("Adding document…");
    try {
      const form = new FormData();
      form.append("title", docTitle.trim());
      if (docDesc.trim()) form.append("description", docDesc.trim());
      if (docFile) form.append("file", docFile);

      const res = await apiClient.post(
        `/bookings/${bookingId}/passengers/${passengerToEdit.id}/documents`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setDocuments((prev) => [...prev, res.data.data]);
      setDocTitle(""); setDocDesc(""); setDocFile(null);
      if (docFileRef.current) docFileRef.current.value = "";
      toast.success("Document added!", { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add document", { id: toastId });
    } finally {
      setIsAddingDoc(false);
    }
  };

  const handleViewDocument = (docId: string) => {
    const token = useAuthStore.getState().accessToken;
    window.open(
      `${apiClient.defaults.baseURL}/bookings/${bookingId}/documents/${docId}/file?token=${token}`,
      "_blank",
    );
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!window.confirm("Remove this document?")) return;
    try {
      await apiClient.delete(`/bookings/${bookingId}/documents/${docId}`);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      toast.success("Document removed");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove document");
    }
  };

  // ─── Main form submit ───────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) { toast.error("First and last name are required"); return; }
    if (!email.trim()) { toast.error("Email is required"); return; }
    setIsSubmitting(true);
    try {
      if (isEdit) {
        const payload = {
          title, firstName: firstName.trim(), lastName: lastName.trim(),
          dateOfBirth: dateOfBirth || null, email: email.trim(),
          phoneNumber: phoneNumber || null, nationality: nationality || null,
          passportNumber: passportNumber || null, passportExpiryDate: passportExpiryDate || null,
          passportIssuingCountry: passportIssuingCountry || null,
          role, collectPassport, collectAdditional,
        };
        await apiClient.patch(`/bookings/${bookingId}/passengers/${passengerToEdit.id}`, payload);
        toast.success("Passenger updated");
      } else {
        if (addMode === "link") {
          const payload = { title, firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), role, collectPassport, collectAdditional };
          const res = await apiClient.post(`/bookings/${bookingId}/passengers`, payload);
          const newPassenger = res.data.data;
          await apiClient.post(`/bookings/${bookingId}/passengers/${newPassenger.id}/send-link`);
          toast.success("Passenger added and request link emailed!");
        } else {
          const payload = {
            title, firstName: firstName.trim(), lastName: lastName.trim(),
            dateOfBirth: dateOfBirth || null, email: email.trim(),
            phoneNumber: phoneNumber || null, nationality: nationality || null,
            passportNumber: passportNumber || null, passportExpiryDate: passportExpiryDate || null,
            passportIssuingCountry: passportIssuingCountry || null,
            role, collectPassport, collectAdditional,
          };
          const res = await apiClient.post(`/bookings/${bookingId}/passengers`, payload);
          const newPassenger = res.data.data;

          // Upload passport scan if selected
          if (localPassportFile) {
            try {
              const form = new FormData();
              form.append("file", localPassportFile);
              await apiClient.post(
                `/bookings/${bookingId}/passengers/${newPassenger.id}/passport-scan`,
                form,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
            } catch (pErr) {
              console.error("Failed to upload passport scan:", pErr);
              toast.error("Passenger added, but failed to upload passport scan.");
            }
          }

          // Upload additional documents if any
          if (localDocuments.length > 0) {
            for (const doc of localDocuments) {
              try {
                const form = new FormData();
                form.append("title", doc.title);
                if (doc.description) form.append("description", doc.description);
                if (doc.file) form.append("file", doc.file);
                await apiClient.post(
                  `/bookings/${bookingId}/passengers/${newPassenger.id}/documents`,
                  form,
                  { headers: { "Content-Type": "multipart/form-data" } }
                );
              } catch (dErr) {
                console.error("Failed to upload document:", doc.title, dErr);
                toast.error(`Failed to upload document "${doc.title}".`);
              }
            }
          }

          toast.success("Passenger added manually");
        }
      }
      onSuccess(); onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save passenger");
    } finally { setIsSubmitting(false); }
  };

  const handleCopyLink = () => {
    if (!passengerToEdit?.formToken) return;
    const link = `${window.location.origin}/passenger-form/${passengerToEdit.formToken}`;
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true); toast.success("Form link copied!");
      setTimeout(() => setLinkCopied(false), 3000);
    });
  };

  const handleSendEmail = async () => {
    if (!passengerToEdit?.id) return;
    if (!email.trim()) { toast.error("Please provide an email address first."); return; }
    setIsSendingEmail(true);
    try {
      await apiClient.post(`/bookings/${bookingId}/passengers/${passengerToEdit.id}/send-link`);
      toast.success(`Request link email sent to ${email}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally { setIsSendingEmail(false); }
  };

  const lbl = "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5";
  const inp = "text-[12px] py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full";
  const sectionHeader = "text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5";

  const showPassportSection = isEdit || addMode === "manual";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Passenger" : "Add Passenger"} maxWidth="5xl">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">

        {/* Mode tabs */}
        {!isEdit && (
          <div className="flex bg-secondary/35 p-1 rounded-lg gap-1 border border-border/60 mb-2">
            {(["link", "manual"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAddMode(mode)}
                className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-md transition-all ${
                  addMode === mode
                    ? "bg-background text-primary shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "link" ? "Request details via Link" : "Fill details Manually"}
              </button>
            ))}
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (Personal & Passport Info) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Age badge */}
            {showPassportSection && dateOfBirth && ageCategory && (
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${ageBadgeColor(ageCategory)}`}>{ageCategory}</span>
                <span className="text-[10px] text-muted-foreground">Auto-calculated from date of birth</span>
              </div>
            )}

            {/* Passenger Database Search */}
            {showPassportSection && (
              <div ref={searchContainerRef} className="relative bg-secondary/5 rounded-xl border border-border/40 p-4">
                <p className={sectionHeader}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  Import Existing Passenger
                </p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by first name, last name, email or passport..."
                    value={searchQuery}
                    onChange={(e) => handlePassengerSearch(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim().length >= 2) {
                        setShowSearchResults(true);
                      }
                    }}
                    className={inp}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-2.5">
                      <Loader2 size={14} className="animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Dropdown list of results */}
                {showSearchResults && (
                  <div className="absolute left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <div className="p-3 text-center text-xs text-muted-foreground">
                        {isSearching ? "Searching..." : "No matching passengers found"}
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {searchResults.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectSearchedPassenger(p)}
                            className="w-full text-left p-2.5 hover:bg-secondary/15 transition-all flex flex-col gap-0.5"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-foreground">
                                {p.title ? `${p.title} ` : ""}{p.firstName} {p.lastName}
                              </span>
                              {p.passportNumber && (
                                <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded font-mono text-muted-foreground uppercase">
                                  {p.passportNumber}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>{p.email}</span>
                              {p.dateOfBirth && <span>DOB: {fmt(p.dateOfBirth)}</span>}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-secondary/5 rounded-xl border border-border/40 p-4 space-y-3">
              <p className={sectionHeader}><User size={11} /> Personal Information</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Title</label><select value={title} onChange={e => setTitle(e.target.value)} className={inp}>{TITLES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className={lbl}>Role</label><select value={role} onChange={e => setRole(e.target.value)} className={inp}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
                <div><label className={lbl}>First Name *</label><input required type="text" placeholder="e.g. Faisal" value={firstName} onChange={e => setFirstName(e.target.value)} className={inp} /></div>
                <div><label className={lbl}>Last Name *</label><input required type="text" placeholder="e.g. Chughtai" value={lastName} onChange={e => setLastName(e.target.value)} className={inp} /></div>

                {showPassportSection && (
                  <>
                    <div><label className={lbl}>Date of Birth</label><input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className={inp} /></div>
                    <div><label className={lbl}>Nationality</label><input type="text" placeholder="e.g. British" value={nationality} onChange={e => setNationality(e.target.value)} className={inp} /></div>
                  </>
                )}

                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address *</label>
                    {leaderEmail && (
                      <button
                        type="button"
                        onClick={() => setEmail(leaderEmail)}
                        className="text-[9px] text-primary hover:underline font-bold"
                      >
                        Same as Leader
                      </button>
                    )}
                  </div>
                  <input required type="email" placeholder="passenger@email.com" value={email} onChange={e => setEmail(e.target.value)} className={inp} />
                </div>

                {showPassportSection && (
                  <div><label className={lbl}>Phone Number</label><input type="tel" placeholder="+44 7889 952013" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className={inp} /></div>
                )}
              </div>
            </div>

            {/* Passport Information */}
            {showPassportSection && (
              <div className="bg-secondary/5 rounded-xl border border-border/40 p-4 space-y-3">
                <p className={sectionHeader}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="2" width="18" height="20" rx="2"/><path d="M8 10h8M8 14h5"/><circle cx="12" cy="7" r="2"/></svg>
                  Passport Information
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div><label className={lbl}>Passport Number</label><input type="text" placeholder="e.g. GB123456" value={passportNumber} onChange={e => setPassportNumber(e.target.value.toUpperCase())} className={`${inp} font-mono uppercase`} /></div>
                  <div><label className={lbl}>Issuing Country</label><input type="text" placeholder="e.g. United Kingdom" value={passportIssuingCountry} onChange={e => setPassportIssuingCountry(e.target.value)} className={inp} /></div>
                  <div className="col-span-2"><label className={lbl}>Passport Expiry Date</label><input type="date" value={passportExpiryDate} onChange={e => setPassportExpiryDate(e.target.value)} className={inp} /></div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Documents trigger, scan trigger, self-fill link) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Documents to Collect */}
              <div className="bg-secondary/5 rounded-xl border border-border/40 p-4 space-y-2.5">
                <p className={sectionHeader}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Documents to Collect
                </p>
                <div className="flex flex-col gap-2 bg-background p-2.5 rounded-lg border border-border/40">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-foreground select-none">
                    <input type="checkbox" checked={collectPassport} onChange={e => setCollectPassport(e.target.checked)} className="rounded border-border text-primary h-3.5 w-3.5" />
                    Collect Passport details &amp; scan
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-foreground select-none">
                    <input type="checkbox" checked={collectAdditional} onChange={e => setCollectAdditional(e.target.checked)} className="rounded border-border text-primary h-3.5 w-3.5" />
                    Collect Additional documents
                  </label>
                </div>
              </div>

              {/* Passport Scan / Photo (Modal Trigger & Status) */}
              {(isEdit || addMode === "manual") && (
                <div className="bg-secondary/5 rounded-xl border border-border/40 p-4 space-y-2.5">
                  <p className={sectionHeader}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M12 2v2M12 18v2M2 12h2M18 12h2"/></svg>
                    Passport Scan / Photo
                  </p>
                  <div className="mt-1">
                    {isEdit ? (
                      passportScanKey ? (
                        <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50 rounded-lg p-2.5">
                          <div className="flex items-center gap-2 text-emerald-700 text-[11px] font-semibold">
                            <Check size={12} strokeWidth={3} className="shrink-0" />
                            <span>Passport Scan Uploaded</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleViewPassportScan}
                              className="flex items-center gap-1 text-[10px] text-orange-600 hover:text-orange-700 font-bold"
                            >
                              <Eye size={10} /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsPassportScanModalOpen(true)}
                              className="text-[10px] text-blue-600 hover:text-blue-700 font-bold"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={handleDeletePassportScan}
                              disabled={isDeletingPassport}
                              className="text-[10px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                            >
                              {isDeletingPassport ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsPassportScanModalOpen(true)}
                          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-border rounded-lg p-2.5 hover:border-primary hover:bg-primary/5 transition-all text-[11px] font-bold text-foreground"
                        >
                          <Upload size={12} className="text-muted-foreground" />
                          Upload &amp; Scan Passport
                        </button>
                      )
                    ) : (
                      // Adding new passenger manually
                      localPassportFile ? (
                        <div className="flex items-center justify-between border border-blue-200 bg-blue-50 rounded-lg p-2.5">
                          <div className="flex items-center gap-2 text-blue-700 text-[11px] font-semibold truncate max-w-[200px]">
                            <Check size={12} strokeWidth={3} className="shrink-0" />
                            <span className="truncate">Selected: {localPassportFile.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsPassportScanModalOpen(true)}
                              className="text-[10px] text-blue-600 hover:text-blue-700 font-bold"
                            >
                              Manage Scan
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLocalPassportFile(null);
                                if (passportFileRef.current) passportFileRef.current.value = "";
                              }}
                              className="text-[10px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                            >
                              <Trash2 size={10} /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsPassportScanModalOpen(true)}
                          className="w-full flex items-center justify-center gap-1.5 border border-dashed border-border rounded-lg p-2.5 hover:border-primary hover:bg-primary/5 transition-all text-[11px] font-bold text-foreground"
                        >
                          <Upload size={12} className="text-muted-foreground" />
                          Upload &amp; Scan Passport
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Additional Documents Trigger */}
              {(collectAdditional || (isEdit && documents.length > 0) || (!isEdit && localDocuments.length > 0)) && (
                <div className="bg-secondary/5 rounded-xl border border-border/40 p-4 space-y-2.5">
                  <p className={sectionHeader}>
                    <FileText size={11} /> Additional Documents
                  </p>
                  <div className="flex items-center justify-between border border-border bg-background hover:bg-secondary/10 rounded-lg p-2.5 transition-all">
                    <div className="flex items-center gap-2">
                      <FileText size={13} className="text-muted-foreground" />
                      <div>
                        <p className="text-[11px] font-bold text-foreground">
                          {isEdit ? `${documents.length} Document(s)` : `${localDocuments.length} Document(s)`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Visas, vouchers, insurance, etc.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDocsModalOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-[10px] font-bold transition-all shadow-sm"
                    >
                      <Plus size={10} /> Manage Documents
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Self-fill link (edit only, Leader only) */}
            {isEdit && passengerToEdit?.formToken && passengerToEdit?.role === "Leader" && (
              <div className="flex items-center justify-between border border-border bg-secondary/10 rounded-lg p-2.5 mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Self-Fill Link</span>
                  {passengerToEdit.formSubmittedAt && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold whitespace-nowrap">
                      ✓ Submitted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border hover:bg-secondary text-foreground rounded text-[10px] font-bold transition-all shadow-sm"
                  >
                    {linkCopied ? <Check size={10} /> : <Copy size={10} />}
                    {linkCopied ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || !email.trim()}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border hover:bg-secondary text-foreground rounded text-[10px] font-bold disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isSendingEmail ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    )}
                    Email Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 pt-4 border-t border-t-border/60">
          <button type="button" onClick={onClose} className="px-4 py-1.5 bg-secondary text-foreground font-bold rounded-lg text-[11px] hover:bg-secondary/80 border border-border">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-1.5 px-5 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg text-[11px] hover:bg-primary/95 disabled:opacity-50 shadow-md">
            {isSubmitting && <Loader2 size={11} className="animate-spin" />}
            {isEdit ? "Save Changes" : addMode === "link" ? "Add & Send Link" : "Add Passenger"}
          </button>
        </div>
      </form>

      {/* Passport OCR Sub-Modal */}
      <Modal
        isOpen={isPassportScanModalOpen}
        onClose={() => setIsPassportScanModalOpen(false)}
        title="Passport OCR Scanner"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Upload a high-quality scan or photo of the passport details page. The scanner will automatically extract personal information and fill out the fields.
          </p>

          {isEdit ? (
            passportScanKey ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center gap-2.5 text-emerald-700 text-sm font-semibold">
                    <Check size={16} strokeWidth={3} className="shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Passport Scan Active</p>
                      <p className="text-[10px] text-emerald-600 font-normal">Successfully uploaded to secure storage</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleViewPassportScan}
                      className="flex items-center gap-1 text-[11px] bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                    >
                      <Eye size={12} /> View Scan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPassportScanKey(null);
                        // Briefly defer triggering click so the input elements mount and register
                        setTimeout(() => {
                          if (passportFileRef.current) passportFileRef.current.click();
                        }, 50);
                      }}
                      className="text-[11px] bg-white border border-border hover:bg-secondary text-foreground font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleDeletePassportScan}
                      disabled={isDeletingPassport}
                      className="text-[11px] bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1"
                    >
                      {isDeletingPassport ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={12} />}
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <input
                  ref={passportFileRef}
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handlePassportFileChange}
                  className="hidden"
                  id="modal-passport-upload"
                />
                <label
                  htmlFor="modal-passport-upload"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center ${
                    isUploadingPassport || isOcrRunning
                      ? "border-orange-400 bg-orange-50/30 pointer-events-none"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {isUploadingPassport ? (
                    <>
                      <Loader2 size={24} className="animate-spin text-orange-500 mb-2" />
                      <span className="text-xs font-bold text-orange-600">Uploading to server...</span>
                    </>
                  ) : isOcrRunning ? (
                    <>
                      <ScanLine size={24} className="text-orange-500 mb-2 animate-pulse" />
                      <span className="text-xs font-bold text-orange-600">Running Tesseract OCR scan…</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-muted-foreground mb-2" />
                      <span className="text-xs font-bold text-foreground">Click to Upload Passport Scan</span>
                      <span className="text-[10px] text-muted-foreground mt-1">JPEG, PNG, or PDF · Max 5MB</span>
                      <span className="text-[10px] text-primary/80 font-semibold mt-2 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">Automatic OCR Autofill</span>
                    </>
                  )}
                </label>
              </div>
            )
          ) : (
            // Add Mode (New Passenger)
            localPassportFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2.5 text-blue-700 text-sm font-semibold">
                    <Check size={16} strokeWidth={3} className="shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Passport Scan Selected</p>
                      <p className="text-[10px] text-blue-600 font-mono truncate max-w-[200px]">{localPassportFile.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {localPassportFile.type.startsWith("image/") && (
                      <button
                        type="button"
                        onClick={() => runOcr(localPassportFile)}
                        disabled={isOcrRunning}
                        className="flex items-center gap-1 text-[11px] bg-white border border-orange-200 hover:bg-orange-50 text-orange-600 font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        <ScanLine size={12} /> {isOcrRunning ? "Scanning..." : "Scan OCR"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setLocalPassportFile(null);
                        if (passportFileRef.current) passportFileRef.current.value = "";
                      }}
                      className="text-[11px] bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <input
                  ref={passportFileRef}
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLocalPassportFile(file);
                      if (file.type.startsWith("image/")) {
                        await runOcr(file);
                      } else {
                        toast.info("OCR autofill works with image files (JPEG/PNG). PDF selected successfully but fields won't be auto-filled.");
                      }
                    }
                  }}
                  className="hidden"
                  id="modal-passport-local-upload"
                />
                <label
                  htmlFor="modal-passport-local-upload"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center ${
                    isOcrRunning
                      ? "border-orange-400 bg-orange-50/30 pointer-events-none"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {isOcrRunning ? (
                    <>
                      <ScanLine size={24} className="text-orange-500 mb-2 animate-pulse" />
                      <span className="text-xs font-bold text-orange-600">Running Tesseract OCR scan…</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-muted-foreground mb-2" />
                      <span className="text-xs font-bold text-foreground">Click to Upload Passport Scan</span>
                      <span className="text-[10px] text-muted-foreground mt-1">JPEG, PNG, or PDF · Max 5MB</span>
                      <span className="text-[10px] text-primary/80 font-semibold mt-2 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-full">Automatic OCR Autofill</span>
                    </>
                  )}
                </label>
              </div>
            )
          )}

          <div className="flex justify-end pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setIsPassportScanModalOpen(false)}
              className="px-5 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary/95 transition-all shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* Additional Documents Sub-Modal */}
      <Modal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        title="Manage Additional Documents"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Upload and organize visa letters, hotel vouchers, insurance policy documents, vaccination records, etc., for this passenger.
          </p>

          {/* List of documents */}
          {((isEdit && documents.length > 0) || (!isEdit && localDocuments.length > 0)) ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {isEdit ? (
                documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border/55 bg-secondary/10">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-xs font-bold text-foreground truncate">{doc.title}</p>
                      {doc.description && <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{doc.description}</p>}
                      {doc.fileName && <p className="text-[9px] text-primary/80 font-mono mt-0.5">📎 {doc.fileName}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {doc.fileKey && (
                        <button
                          type="button"
                          onClick={() => handleViewDocument(doc.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-primary/25 text-primary hover:bg-primary/5 rounded-lg text-[10px] font-bold shadow-sm"
                        >
                          <Eye size={12} /> View
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-bold shadow-sm"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                localDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border/55 bg-secondary/10">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-xs font-bold text-foreground truncate">{doc.title}</p>
                      {doc.description && <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{doc.description}</p>}
                      {doc.file && <p className="text-[9px] text-primary/80 font-mono mt-0.5">📎 {doc.file.name}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {doc.file && (
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(doc.file!);
                            window.open(url, "_blank");
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-primary/25 text-primary hover:bg-primary/5 rounded-lg text-[10px] font-bold shadow-sm"
                        >
                          <Eye size={12} /> View
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setLocalDocuments((prev) => prev.filter((d) => d.id !== doc.id));
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-bold shadow-sm"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-border rounded-xl bg-secondary/5">
              <FileText className="mx-auto text-muted-foreground mb-1.5 opacity-60" size={24} />
              <p className="text-xs font-semibold text-muted-foreground">No documents uploaded yet.</p>
            </div>
          )}

          {/* Add New Additional Document */}
          <div className="border-t border-border/60 pt-4">
            <p className={sectionHeader}>
              <Plus size={11} /> Add New Document
            </p>
            <div className="space-y-3 bg-secondary/15 rounded-xl border border-border/40 p-4">
              <div>
                <label className={lbl}>Document Title *</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className={inp}
                  placeholder="e.g. E-visa, Hotel Voucher, Travel Insurance"
                />
                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["E-visa", "Share Code", "Travel Insurance", "Hotel Voucher", "Vaccination Record"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDocTitle(s)}
                      className="px-2.5 py-1 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold rounded-lg transition-all"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={lbl}>Description / Details (Optional)</label>
                <textarea
                  value={docDesc}
                  onChange={e => setDocDesc(e.target.value)}
                  className={`${inp} min-h-[60px] resize-y`}
                  placeholder="e.g. Share code: S1234567G, policy number, notes…"
                />
              </div>
              <div>
                <label className={lbl}>File Attachment (Optional)</label>
                <input
                  ref={docFileRef}
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={e => setDocFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="modal-doc-file"
                />
                {docFile ? (
                  <div className="flex items-center justify-between border border-border rounded-lg p-2.5 bg-background shadow-sm">
                    <span className="text-xs text-foreground font-semibold truncate flex-1 mr-2">📎 {docFile.name}</span>
                    <button type="button" onClick={() => { setDocFile(null); if (docFileRef.current) docFileRef.current.value = ""; }} className="text-rose-500 hover:text-rose-700 p-1">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="modal-doc-file" className="flex items-center justify-center gap-2 border border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-xs text-muted-foreground font-semibold">
                    <Upload size={14} /> Attach a file (JPEG, PNG, PDF · Max 5MB)
                  </label>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isEdit) {
                    handleAddDocument();
                  } else {
                    if (!docTitle.trim()) { toast.error("Document title is required"); return; }
                    const newDoc = {
                      id: "temp-" + Date.now(),
                      title: docTitle.trim(),
                      description: docDesc.trim(),
                      file: docFile,
                    };
                    setLocalDocuments((prev) => [...prev, newDoc]);
                    setDocTitle("");
                    setDocDesc("");
                    setDocFile(null);
                    if (docFileRef.current) docFileRef.current.value = "";
                    toast.success("Document added locally!");
                  }
                }}
                disabled={!docTitle.trim() || isAddingDoc}
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
              >
                {isAddingDoc ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                Add Document
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setIsDocsModalOpen(false)}
              className="px-5 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary/95 transition-all shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </Modal>
  );
}
