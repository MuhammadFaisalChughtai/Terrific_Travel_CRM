import React, { useState, useEffect } from "react";

export const COMMON_NATIONALITIES = [
  "British",
  "Pakistani",
  "Saudi",
  "Indian",
  "American",
  "Canadian",
  "Emirati",
  "Turkish",
  "Egyptian",
  "Omani",
  "Qatari",
  "Kuwaiti",
  "Bahraini",
  "Jordanian",
  "Bangladeshi",
];

export const ALL_NATIONALITIES = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Antiguan",
  "Argentine",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian",
  "Brazilian",
  "British",
  "Bruneian",
  "Bulgarian",
  "Burkinabe",
  "Burundian",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Cape Verdean",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comoran",
  "Congolese",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djiboutian",
  "Dominican",
  "Dutch",
  "East Timorese",
  "Ecuadorian",
  "Egyptian",
  "Emirati",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Ethiopian",
  "Fijian",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Honduran",
  "Hungarian",
  "Icelandic",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakh",
  "Kenyan",
  "Kuwaiti",
  "Kyrgyz",
  "Lao",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Liechtenstein",
  "Lithuanian",
  "Luxembourger",
  "Macedonian",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivian",
  "Malian",
  "Maltese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Montenegrin",
  "Moroccan",
  "Mozambican",
  "Burmese",
  "Namibian",
  "Nepalese",
  "New Zealander",
  "Nicaraguan",
  "Nigerian",
  "Nigerien",
  "North Korean",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Palestinian",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Filipino",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Lucian",
  "Samoan",
  "San Marino",
  "Saudi",
  "Saudi Arabian",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovak",
  "Slovenian",
  "Somali",
  "South African",
  "South Korean",
  "South Sudanese",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamese",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Togolese",
  "Tongan",
  "Trinidadian",
  "Tunisian",
  "Turkish",
  "Turkmen",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbek",
  "Vanuatu",
  "Venezuelan",
  "Vietnamese",
  "Yemeni",
  "Zambian",
  "Zimbabwean"
];

interface NationalitySelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export const NationalitySelect: React.FC<NationalitySelectProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "Select nationality...",
}) => {
  const isPredefined = ALL_NATIONALITIES.some(
    (n) => n.toLowerCase() === (value || "").trim().toLowerCase()
  );

  const [isCustom, setIsCustom] = useState(!isPredefined && !!value);
  const [customValue, setCustomValue] = useState(isPredefined ? "" : value || "");

  useEffect(() => {
    const isValPredefined = ALL_NATIONALITIES.some(
      (n) => n.toLowerCase() === (value || "").trim().toLowerCase()
    );
    if (!isValPredefined && value) {
      setIsCustom(true);
      setCustomValue(value);
    } else if (isValPredefined) {
      setIsCustom(false);
    }
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__CUSTOM__") {
      setIsCustom(true);
      onChange(customValue);
    } else {
      setIsCustom(false);
      onChange(val);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange(val);
  };

  const toggleMode = () => {
    if (isCustom) {
      setIsCustom(false);
      onChange("British");
    } else {
      setIsCustom(true);
      onChange(customValue || "");
    }
  };

  return (
    <div className="space-y-1">
      {!isCustom ? (
        <div className="relative flex items-center gap-1">
          <select
            value={
              ALL_NATIONALITIES.find(
                (n) => n.toLowerCase() === (value || "").trim().toLowerCase()
              ) || (value ? "__CUSTOM__" : "")
            }
            onChange={handleSelectChange}
            className={`${className} w-full pr-8`}
          >
            <option value="">{placeholder}</option>

            <optgroup label="Popular Nationalities">
              {COMMON_NATIONALITIES.map((n) => (
                <option key={`common-${n}`} value={n}>
                  {n}
                </option>
              ))}
            </optgroup>

            <optgroup label="All Nationalities (A-Z)">
              {ALL_NATIONALITIES.map((n) => (
                <option key={`all-${n}`} value={n}>
                  {n}
                </option>
              ))}
            </optgroup>

            <optgroup label="Custom Option">
              <option value="__CUSTOM__">✏️ + Add Custom Nationality...</option>
            </optgroup>
          </select>

          <button
            type="button"
            onClick={toggleMode}
            title="Switch to custom text input"
            className="px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/10 rounded transition-colors whitespace-nowrap border border-primary/20 shrink-0"
          >
            Custom
          </button>
        </div>
      ) : (
        <div className="relative flex items-center gap-1">
          <input
            type="text"
            placeholder="Type custom nationality..."
            value={customValue}
            onChange={handleCustomInputChange}
            className={`${className} w-full font-medium`}
            autoFocus
          />
          <button
            type="button"
            onClick={toggleMode}
            title="Switch back to nationality dropdown"
            className="px-2 py-1 text-[10px] font-bold text-muted-foreground hover:bg-secondary rounded transition-colors whitespace-nowrap border border-border shrink-0"
          >
            List
          </button>
        </div>
      )}
    </div>
  );
};
