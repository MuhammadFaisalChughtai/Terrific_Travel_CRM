-- Adminer 5.4.2 PostgreSQL 15.18 dump

DROP TABLE IF EXISTS "AccommodationService";
CREATE TABLE "public"."AccommodationService" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "vendorId" text NOT NULL,
    "hotelName" text NOT NULL,
    "roomType" text NOT NULL,
    "checkInDate" timestamp(3) NOT NULL,
    "checkOutDate" timestamp(3) NOT NULL,
    "mealType" text NOT NULL,
    "reservationNumber" text,
    "qty" integer DEFAULT '1' NOT NULL,
    "price" double precision NOT NULL,
    "currency" text NOT NULL,
    "otherCurrency" text,
    "conversionRate" double precision,
    "issueDate" timestamp(3),
    "refundAmount" double precision DEFAULT '0.0' NOT NULL,
    "fineAmount" double precision DEFAULT '0.0' NOT NULL,
    "hotelConfirmationNumber" text,
    "hotelAddress" text,
    "lastCancellationDate" timestamp(3),
    "city" text,
    "checkInTime" text DEFAULT '16:00',
    "checkOutTime" text DEFAULT '12:00',
    CONSTRAINT "AccommodationService_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "AccommodationService" ("id", "bookingId", "vendorId", "hotelName", "roomType", "checkInDate", "checkOutDate", "mealType", "reservationNumber", "qty", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount", "hotelConfirmationNumber", "hotelAddress", "lastCancellationDate", "city", "checkInTime", "checkOutTime") VALUES
('53328934-5210-4e58-b3c2-98d969e5a447',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'2',	'M Hotel Makkah by Millennium(',	'Single Room',	'2026-10-02 00:00:00',	'2026-10-06 00:00:00',	'Room Only',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Makkah',	'16:00',	'12:00'),
('753cc807-a919-4cb6-bcdd-4fd6361ad87a',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'2',	'Hayah Al Waha Hotel Madina',	'Single Room',	'2026-10-06 00:00:00',	'2026-10-08 00:00:00',	'Room Only',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Madinah',	'16:00',	'12:00'),
('a80da9d1-ca04-4908-8d0c-92e4f4ba1fb9',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'2',	'M Hotel Makkah ',	'Quad Room',	'2026-07-03 00:00:00',	'2026-07-04 00:00:00',	'Room Only',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Makkah',	'16:00',	'12:00'),
('22f34760-9d1c-428f-b844-d04b0f48f029',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'2',	'Mahd Al Resala 3 Hotel',	'Double Room',	'2026-09-20 00:00:00',	'2026-09-25 00:00:00',	'Room Only',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Makkah',	'16:00',	'12:00'),
('ecdb76d5-d835-4c05-a44a-7512858d8ab0',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'2',	'Hayah Al Waha Hotel',	'Double Room',	'2026-09-25 00:00:00',	'2026-09-28 00:00:00',	'Room Only',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Madinah',	'16:00',	'12:00'),
('85978396-6005-42d4-acb1-a4af46806da8',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'16',	' Le Meridien Makkah',	'Quad Room',	'2026-12-26 00:00:00',	'2026-12-31 00:00:00',	'Breakfast',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Makkah',	'16:00',	'12:00'),
('d58974e6-3b7c-4b4d-813c-61e14831184b',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'2',	' Millennium Al Aqeeq Hotel',	'Quad Room',	'2026-12-31 00:00:00',	'2027-01-05 00:00:00',	'Breakfast',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Madinah',	'16:00',	'12:00'),
('5185baac-4296-47a7-b91d-def658c699db',	'5e668417-02ad-40c0-8c73-723257ee4349',	'52',	'MAHD AL RESALA 3 ',	'Triple Room',	'2026-07-05 00:00:00',	'2026-07-08 00:00:00',	'Room Only',	'72076154613143',	1,	53.23,	'GBP',	NULL,	NULL,	'2026-06-30 00:00:00',	0,	0,	'497246',	'Al Hujoon St, Makkah, Makkah Province, 24231 Saudi Arabia',	'2026-07-04 00:00:00',	'MAKKAH',	'16:00',	'12:00'),
('aea43e18-4330-41db-8e75-56877e73d78c',	'5e668417-02ad-40c0-8c73-723257ee4349',	'52',	'MAHD AL RESALA 3',	'Double Room',	'2026-07-09 00:00:00',	'2026-07-10 00:00:00',	'Room Only',	'72076154979151',	1,	20.82,	'GBP',	NULL,	NULL,	'2026-06-30 00:00:00',	0,	0,	'497253',	'Al Hujoon St, Makkah, Makkah Province, 24231 Saudi Arabia',	'2026-07-08 00:00:00',	'MAKKAH ',	'16:00',	'12:00'),
('30540413-ae66-4bd2-b8e7-e239acaa9bc6',	'5e668417-02ad-40c0-8c73-723257ee4349',	'2',	'HAYA AL WAHA ',	'Double Room',	'2026-07-08 00:00:00',	'2026-07-09 00:00:00',	'Room Only',	'K2QQK7',	1,	41.37,	'GBP',	NULL,	NULL,	'2026-06-30 00:00:00',	0,	0,	NULL,	'2604 King Faisal Rd - 1st Ring Branch Rd, Al Madinah, Medina, Saudi Arabia',	NULL,	'MADINAH ',	'16:00',	'12:00'),
('a1d5f77f-3d59-4aca-9f0e-a00755a4c6c2',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'2',	'Valy Al Madinah',	'Quad Room',	'2026-07-17 00:00:00',	'2026-07-20 00:00:00',	'Breakfast',	'ZMZ-CE54C',	1,	324.47,	'GBP',	NULL,	NULL,	'2026-07-02 00:00:00',	0,	0,	NULL,	'443 Abdullah bin Haram Street، DMAA6119, Madinah 42311, Saudi Arabia',	NULL,	'Madinah',	'16:00',	'12:00'),
('2ac39d8b-aaf0-477b-90c8-2ddec7e5e3d2',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'16',	'Side Square Hotel',	'Double Room',	'2026-07-04 00:00:00',	'2026-07-08 00:00:00',	'All Inclusive',	'14ZZRQ',	1,	247.54,	'GBP',	NULL,	NULL,	'2026-07-02 00:00:00',	0,	0,	'2457706',	'Garden Double RoomSide Mah. 501. Sk. No:2, 07600, Manavgat, Turkey',	NULL,	'Antalya',	'16:00',	'12:00'),
('a44699bc-fd0d-44f5-91bd-a2c6f1a6d556',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'836f1aa6-7d5f-4b1f-a41c-246cb0132273',	'Nusk Alhijra Hotel',	'Standard Quadruple Room',	'2026-08-02 00:00:00',	'2026-08-06 00:00:00',	'Breakfast',	NULL,	1,	378,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Madinah',	'16:00',	'12:00'),
('cbb84170-c535-4574-bdd3-e959ca6dc4e5',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'2',	'Zaha Al Munawara Hotel',	'Double Room',	'2026-07-06 00:00:00',	'2026-07-10 00:00:00',	'Breakfast',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Madinah',	'16:00',	'12:00'),
('68ef2dee-9d1e-430a-8cea-8c30db717085',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'2',	'Emaar Elite Hotel',	'Double Room',	'2026-07-10 00:00:00',	'2026-07-14 00:00:00',	'Breakfast',	NULL,	1,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'Makkah',	'16:00',	'12:00'),
('9f049003-2f1f-468a-a66e-f8b759d5b2ca',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'16',	'City Premiere Marina Hotel Apartments',	'2 Bedroom Standard Apartment With Balcony',	'2026-08-06 00:00:00',	'2026-08-12 00:00:00',	'Breakfast',	'JF684X',	1,	521.33,	'GBP',	NULL,	NULL,	'2026-07-03 00:00:00',	0,	0,	NULL,	'Al-Suwayeb Street, Dubai Marina, Al Marsa Area, Near Marina Metro Station, Dubai',	'2026-07-30 00:00:00',	'Dubai',	'16:00',	'12:00'),
('6fb70f52-8058-43be-b219-e9e55f3c6801',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'24',	'Al Ebaa Hotel ',	'Triple and Double ',	'2026-07-19 00:00:00',	'2026-07-23 00:00:00',	'Breakfast',	'1661733, 1661734',	2,	520.83,	'GBP',	'5200',	4.8,	'2026-07-02 00:00:00',	0,	0,	'1661733, 1661734',	'Umm Al Qura Road Al- Ebaa hotel, Makkah',	NULL,	'Makkah',	'16:00',	'12:00'),
('d04a1dda-567e-4192-8d83-bf02cd3b28fb',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'13',	'Saja Al Madinah',	'Quint',	'2026-07-23 00:00:00',	'2026-07-28 00:00:00',	'Breakfast',	'100492',	1,	807.29,	'GBP',	'3,875.01',	4.8,	'2026-06-05 00:00:00',	0,	0,	NULL,	'King Faisal Rd, Bada''ah, Madinah 42311, Saudi Arabia',	NULL,	'Madinah',	'16:00',	'12:00'),
('93aaab25-f636-4bfd-989b-a861e2b2deab',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'12',	'Emaar Grand Hotel',	'Quad Room',	'2026-07-14 00:00:00',	'2026-07-17 00:00:00',	'Breakfast',	'URB/R/6/2026/21192',	1,	239.58,	'GBP',	'1150',	4.8,	'2026-05-18 00:00:00',	0,	0,	'BK/2026/Jun/H/19102',	' Ibrahim Al Khalil, Al Hajlah, Makkah 24231, Saudi Arabia',	NULL,	'Makkah',	'16:00',	'12:00'),
('fd0b0a50-2cc8-4a56-ad6e-a489d3f0d52e',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'2',	'Tilal Jabal Alkabah',	'Quad Room',	'2026-07-28 00:00:00',	'2026-08-02 00:00:00',	'Breakfast',	'2VRWJ2',	1,	648.94,	'GBP',	NULL,	NULL,	'2026-07-03 00:00:00',	0,	0,	NULL,	'Tilal Jabal Alkabah, 7569 Jabal Al Kaabah Road, P.O.Box 213566, Harrat Al Bab and Ash Shamiah, Mekka 24231',	'2026-07-24 00:00:00',	'Makkah',	'16:00',	'12:00'),
('1954a903-d683-48ce-b6af-bb56366b0cad',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'2',	'Al Shohada by Palm Rich Makkah',	'Quad Room',	'2026-07-26 00:00:00',	'2026-07-31 00:00:00',	'Breakfast',	NULL,	2,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'MAKKAH ',	'16:00',	'12:00'),
('a92591e8-d33b-41d6-9bf4-6f322a7eab14',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'2',	'SWISS INTERNATIONAL',	'Quad Room',	'2026-07-31 00:00:00',	'2026-08-05 00:00:00',	'Breakfast',	NULL,	2,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0,	NULL,	NULL,	NULL,	'MADINAH',	'16:00',	'12:00'),
('4d6ce601-2f9f-4cb8-a857-5716c9c42b69',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'13',	'Voco Hotel Makkah',	'quad',	'2025-12-18 00:00:00',	'2025-12-24 00:00:00',	'BB',	'80004',	1,	550,	'GBP',	'2640',	4.8,	'2025-12-08 00:00:00',	0,	0,	'1380260',	NULL,	NULL,	NULL,	'16:00',	'12:00'),
('912efcec-0f8f-4abe-b5fc-c8354cd3f6a9',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'b101d8cb-00b8-40c0-a4c3-93e2be8db81f',	'Artal Taiba Madinah',	'Quad',	'2025-12-24 00:00:00',	'2025-12-29 00:00:00',	'BB',	'ZMZ-GX20G',	1,	698.42,	'GBP',	NULL,	NULL,	'2025-12-08 00:00:00',	0,	0,	NULL,	NULL,	NULL,	NULL,	'16:00',	'12:00'),
('ee6250b7-4db6-416f-b47f-78c668aef99c',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'13',	'Zowar International Hotel',	'Tiple',	'2025-10-13 23:00:00',	'2025-10-16 23:00:00',	'N/A',	'NE77995',	1,	243.75,	'0',	'1170',	4.8,	'2025-09-25 23:00:00',	0,	0,	NULL,	NULL,	NULL,	NULL,	'16:00',	'12:00'),
('371887f6-03f8-40a6-b133-b51a9a0d1363',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'24',	'Al Ebaa Hotel',	'Tiple',	'2025-10-09 23:00:00',	'2025-10-13 23:00:00',	'N/A',	'1604521',	1,	245.83,	'0',	'1180',	4.8,	'2025-09-10 23:00:00',	0,	0,	NULL,	NULL,	NULL,	NULL,	'16:00',	'12:00'),
('112f0751-de27-49b8-9473-1a1b563c1d22',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'b101d8cb-00b8-40c0-a4c3-93e2be8db81f',	'Zowar International Hotel',	'Quad',	'2025-12-09 00:00:00',	'2025-12-14 00:00:00',	'With BREAKFAST',	'ZMZ-QE41Q',	1,	624.3,	'gbp',	'0',	0,	'2025-09-30 23:00:00',	0,	0,	NULL,	NULL,	NULL,	NULL,	'16:00',	'12:00'),
('c08ab121-06b4-41c4-b645-1e58c46227d3',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'24',	'Al Ebaa Hotel',	'Quad',	'2025-12-02 00:00:00',	'2025-12-09 00:00:00',	'BREAKFAST',	'1605632',	1,	619.79,	'0',	'2975',	0,	'2025-09-16 23:00:00',	0,	0,	NULL,	NULL,	NULL,	NULL,	'16:00',	'12:00'),
('1563bd92-24d4-44d5-a7a3-55653599c6ea',	'73eab461-94a8-47c6-913f-7eaa439426f5',	'14',	'Al Messila, a Luxury Collection Resort & Spa, Doha',	'Deluxe double room',	'2026-07-28 23:00:00',	'2026-08-07 23:00:00',	'Bed & Breakfast',	'126586503',	1,	1123,	'GBP',	NULL,	NULL,	'2026-06-04 23:00:00',	0,	0,	NULL,	'Um Al Saneem Street, Street Number 970 Zone 36',	'2026-07-19 23:00:00',	NULL,	'16:00',	'12:00'),
('669b46b8-3a93-4653-a398-c9fa370a1edb',	'13f9b680-5767-4616-ab5d-a40280b79890',	'17',	'Anjum Hotel Makkah',	'2 Tiple',	'2026-10-28 00:00:00',	'2026-11-03 00:00:00',	'Breakfast',	'BKS1GS',	2,	1600,	'gbp',	'0',	NULL,	'2026-06-20 23:00:00',	0,	0,	'BKS1GS',	'0',	NULL,	NULL,	'16:00',	'12:00'),
('370836af-4cac-4376-8731-5fa93ec36f84',	'13f9b680-5767-4616-ab5d-a40280b79890',	'17',	'Crowne Plaza Madinah by IHG',	'2 Tiple',	'2026-11-03 00:00:00',	'2026-11-07 00:00:00',	'BREAKFAST',	'FZK1GS',	2,	1075.68,	'gbp',	NULL,	NULL,	'2026-06-20 23:00:00',	0,	0,	'FZK1GS',	NULL,	NULL,	NULL,	'16:00',	'12:00');

DROP TABLE IF EXISTS "AdditionalService";
CREATE TABLE "public"."AdditionalService" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "vendorId" text,
    "customVendorName" text,
    "serviceName" text NOT NULL,
    "servicePrice" double precision NOT NULL,
    "serviceDescription" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "AdditionalService_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "Agent";
CREATE TABLE "public"."Agent" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "phoneNumber" text NOT NULL,
    "payrollEmail" text,
    "gdsSystem" text NOT NULL,
    "client" text NOT NULL,
    "pcc" text NOT NULL,
    "jobStatus" text DEFAULT 'Active' NOT NULL,
    "passwordHash" text NOT NULL,
    "walletBalance" double precision DEFAULT '0.0' NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Agent_email_key" ON public."Agent" USING btree (email);

INSERT INTO "Agent" ("id", "name", "email", "phoneNumber", "payrollEmail", "gdsSystem", "client", "pcc", "jobStatus", "passwordHash", "walletBalance", "createdAt", "updatedAt") VALUES
('d48c4fd9-7343-42c3-8241-613691bcdac7',	'Faisal Chughtai',	'faisal@terrifictravel.co.uk',	'+441474225',	'mfaisalchughtai12@gmail.com',	'Sabre',	'x1034w1',	'3j63',	'Active',	'$2b$10$6q01yYe64qVc48vokzulauN7Vrqy/JeiPbhEvQQW8yHZYm45NcMWO',	0,	'2026-06-23 17:41:47.058',	'2026-06-23 17:41:47.058'),
('455bbf6d-c482-408d-b449-7df76e15f696',	'RAYAN ALI',	'rayan@terrifictravel.co.uk',	'01215291638',	'rayan@terrifictravel.co.uk',	'Galileo, Sabre',	'x6127',	'3J63, 7FU6',	'Active',	'$2b$10$kGsoKaKvQrkCleFJCiZi2O/HmtrraSJ3F2tn.vIHVFtyElKJs4dOi',	0,	'2026-06-26 13:57:33.742',	'2026-06-26 13:57:49.456'),
('6ee97972-be10-4114-bcc2-fe9165be7714',	'Zain Malik',	'muhammad.zain@terrifictravel.co.uk',	'44 121 529 1670',	'muhammad.zain@terrifictravel.co.uk',	'Galileo',	'zxqwed',	'3j63',	'Active',	'$2b$10$rGS9HKmCCHPAudf3SLipw.2obcD91zNrUWTi6eAPFhgJhwRjfxN5G',	0,	'2026-06-26 14:21:07.237',	'2026-06-26 14:21:07.237'),
('f26e580f-26b1-447e-98b1-2ff5b6333e00',	'Hasnain Sanwal',	'hasnain@terrifictravel.co.uk',	'01215291631',	'hasnain.sanwal@hotmail.com',	'Galileo, Sabre',	'gopy3a0h, gqelxifb, gww47n7h',	'3J63, 7FU6 ,Z5L1O',	'Active',	'$2b$10$FXsrLkDsxclH3NA8kU2qAeia7TwBE3YJN1ccNr86nEMg/JgozktmG',	0,	'2026-06-26 13:56:26.885',	'2026-06-26 16:16:33.228'),
('e2f5808a-8809-4668-9e63-29444d0f988b',	'Hamza Choudary',	'hamza.choudary@terrifictravel.co.uk',	'441215291499',	'hamza.choudary@terrifictravel.co.uk',	'',	'',	'',	'Active',	'$2b$10$wfAwjm0MQ1eyjymHGJ0pw.NMLyXqgLNg7uiH2zRVqBfSdOBV7TaHW',	0,	'2026-06-26 17:00:59.817',	'2026-06-26 17:00:59.817'),
('0002b9e2-464a-4502-9a36-8cd0d911c289',	'Ali Ahmad',	'aly@terrifictravel.co.uk',	'44 121 529 1670',	'aly@terrifictravel.co.uk',	'',	'',	'',	'Active',	'$2b$10$a.tipyYMJCjmscWlb8Kpm.DVYLk9huk2VjVZE8UODRWM1bSfP6QAa',	0,	'2026-06-29 13:07:51.672',	'2026-06-29 13:07:51.672'),
('1e85f3e9-37fc-4704-8650-ce423408044e',	'Zain Ali',	'zain@terrifictravel.co.uk',	'01215291669',	'zain@terrifictravel.co.uk',	'',	'',	'',	'Active',	'$2b$10$6oWmn.ur1oh8iui3gLv97.zddo2tm2rPqojUdsZPoelqfiS98Ggrm',	0,	'2026-06-29 13:08:49.299',	'2026-06-29 13:08:49.299'),
('ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	'Maira Tanveer',	'maira@terrifictravel.co.uk',	'01216672229',	'maira@terrifictravel.co.uk',	'',	'',	'',	'Active',	'$2b$10$XqIY9wKaKBO7a4CCC3RsVuv8idnuahuYHpsbclEKUCgr72N2ByU7W',	0,	'2026-06-29 13:09:34.139',	'2026-06-29 13:09:34.139'),
('e1f168f7-0772-4e82-9011-6745efc8c59b',	'Sheikh Ebad',	'sheikh.ebad@terrifictravel.co.uk',	'441215292336',	'sheikh.ebad@terrifictravel.co.uk',	'',	'',	'',	'Inactive',	'$2b$10$YKoT6hcn7wHj3yBQM7opz.NBEy8CBV/JB/Vd0doB9cJteDyQ9dME6',	0,	'2026-06-29 13:05:15.745',	'2026-06-29 13:12:14.834');

DROP TABLE IF EXISTS "AgentMargin";
CREATE TABLE "public"."AgentMargin" (
    "id" text NOT NULL,
    "agentId" text NOT NULL,
    "bookingCount" integer NOT NULL,
    "totalProfit" double precision NOT NULL,
    "marginPercentage" double precision NOT NULL,
    "marginAmount" double precision NOT NULL,
    "status" text DEFAULT 'UNPAID' NOT NULL,
    "paidDate" timestamp(3),
    "paidById" text,
    "notes" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    "endDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "startDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "AgentMargin_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "AgentMargin_agentId_startDate_endDate_key" ON public."AgentMargin" USING btree ("agentId", "startDate", "endDate");

INSERT INTO "AgentMargin" ("id", "agentId", "bookingCount", "totalProfit", "marginPercentage", "marginAmount", "status", "paidDate", "paidById", "notes", "createdAt", "updatedAt", "endDate", "startDate") VALUES
('33456c81-ff1f-426b-8dfe-afcf91cd874f',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	4,	8688,	10,	868.8,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:02.773',	'2026-07-02 16:14:02.773',	'2026-07-04 23:59:59.999',	'2026-06-05 00:00:00'),
('68154d2b-9465-4cc2-848a-29b17b0847f6',	'e2f5808a-8809-4668-9e63-29444d0f988b',	1,	20,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:02.943',	'2026-07-02 16:14:02.943',	'2026-07-04 23:59:59.999',	'2026-06-05 00:00:00'),
('3469c1c2-ad52-45a2-a431-e8e149954f41',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	1,	625,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:28.244',	'2026-07-02 16:14:28.244',	'2026-07-01 23:59:59.999',	'2026-06-05 00:00:00'),
('275fa5b4-6d2b-4a7f-a98b-2da930f4395a',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:28.284',	'2026-07-02 16:14:28.284',	'2026-07-01 23:59:59.999',	'2026-06-05 00:00:00'),
('2e4c3aae-6122-41fd-a183-1848a0b91d4a',	'1e85f3e9-37fc-4704-8650-ce423408044e',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:28.31',	'2026-07-02 16:14:28.31',	'2026-07-01 23:59:59.999',	'2026-06-05 00:00:00'),
('6a3253a8-3cbe-4cdb-bbe5-5b590de0623f',	'6ee97972-be10-4114-bcc2-fe9165be7714',	5,	587,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:28.331',	'2026-07-02 16:14:28.331',	'2026-07-01 23:59:59.999',	'2026-06-05 00:00:00'),
('66698762-33a7-4632-9aa7-081238e3576d',	'455bbf6d-c482-408d-b449-7df76e15f696',	4,	2640,	6,	158.4,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:28.367',	'2026-07-02 16:14:28.367',	'2026-07-01 23:59:59.999',	'2026-06-05 00:00:00'),
('0b803c9a-4b70-4cb6-84a6-f7db6f595368',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	3,	2188,	6,	131.28,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:28.412',	'2026-07-02 16:14:28.412',	'2026-07-01 23:59:59.999',	'2026-06-05 00:00:00'),
('18eee7ec-f980-477a-bc0f-0c5cf4ba22d2',	'e2f5808a-8809-4668-9e63-29444d0f988b',	1,	20,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:28.431',	'2026-07-02 16:14:28.431',	'2026-07-01 23:59:59.999',	'2026-06-05 00:00:00'),
('e98fecde-d249-4b34-a840-d6b2d9b68e07',	'455bbf6d-c482-408d-b449-7df76e15f696',	1,	1138,	5,	56.9,	'PAID',	'2026-07-02 16:35:18.665',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Paid via system',	'2026-07-02 16:34:43.458',	'2026-07-02 16:35:18.67',	'2026-07-31 23:59:59.999',	'2026-06-01 00:00:00'),
('f30a6c01-4e32-4740-af45-782c4a0819f4',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	2,	2125,	6,	127.5,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:37:36.157',	'2026-07-02 16:37:36.157',	'2026-08-05 23:59:59.999',	'2026-05-01 00:00:00'),
('82753d7a-1f85-4e18-92ce-4507a55041d2',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:37:36.224',	'2026-07-02 16:37:36.224',	'2026-08-05 23:59:59.999',	'2026-05-01 00:00:00'),
('92f90d74-d94e-4212-a5e4-b25871caccf6',	'1e85f3e9-37fc-4704-8650-ce423408044e',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:37:36.249',	'2026-07-02 16:37:36.249',	'2026-08-05 23:59:59.999',	'2026-05-01 00:00:00'),
('11edf201-62be-4674-b639-c87e4c866142',	'6ee97972-be10-4114-bcc2-fe9165be7714',	5,	587,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:37:36.27',	'2026-07-02 16:37:36.27',	'2026-08-05 23:59:59.999',	'2026-05-01 00:00:00'),
('118f54cb-e1a0-45b8-89d9-519893ff7e8a',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	2,	2125,	6,	127.5,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:07:57.042',	'2026-07-02 16:11:17.16',	'2026-08-05 23:59:59.999',	'2026-06-05 00:00:00'),
('cf953206-0a2c-44d4-a848-68f149f459f2',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	4,	8688,	10,	868.8,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:07:57.177',	'2026-07-02 16:11:17.178',	'2026-08-05 23:59:59.999',	'2026-06-05 00:00:00'),
('06ec148e-b585-476f-82bf-d3432823c73e',	'e2f5808a-8809-4668-9e63-29444d0f988b',	1,	20,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:07:57.194',	'2026-07-02 16:11:17.203',	'2026-08-05 23:59:59.999',	'2026-06-05 00:00:00'),
('af3e7953-92ef-4ada-b16a-64d3610cf132',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:07:57.069',	'2026-07-02 16:11:17.22',	'2026-08-05 23:59:59.999',	'2026-06-05 00:00:00'),
('ae89fb27-2d43-4dec-bc5f-fa995c1c87ca',	'1e85f3e9-37fc-4704-8650-ce423408044e',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:07:57.103',	'2026-07-02 16:11:17.238',	'2026-08-05 23:59:59.999',	'2026-06-05 00:00:00'),
('0fadb4e2-0ef9-4748-9bca-d8558750ead7',	'6ee97972-be10-4114-bcc2-fe9165be7714',	5,	587,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:07:57.121',	'2026-07-02 16:11:17.262',	'2026-08-05 23:59:59.999',	'2026-06-05 00:00:00'),
('85ba75c5-d9a0-4de3-b66d-152102326706',	'455bbf6d-c482-408d-b449-7df76e15f696',	5,	3778,	7,	264.46,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:07:57.147',	'2026-07-02 16:11:17.282',	'2026-08-05 23:59:59.999',	'2026-06-05 00:00:00'),
('03b06ab5-2466-44e6-9f72-e8a3faa43ed5',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	2,	2125,	6,	127.5,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:11:52.695',	'2026-07-02 16:11:52.695',	'2026-07-05 23:59:59.999',	'2026-06-05 00:00:00'),
('8ee40683-e5a8-493b-9e4d-a633c15f3b9a',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:11:52.719',	'2026-07-02 16:11:52.719',	'2026-07-05 23:59:59.999',	'2026-06-05 00:00:00'),
('0715cb9a-c26b-480e-9b1f-0446eaa48768',	'1e85f3e9-37fc-4704-8650-ce423408044e',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:11:52.739',	'2026-07-02 16:11:52.739',	'2026-07-05 23:59:59.999',	'2026-06-05 00:00:00'),
('804d9e92-205d-4bee-baca-276a0a4294ca',	'6ee97972-be10-4114-bcc2-fe9165be7714',	5,	587,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:11:52.762',	'2026-07-02 16:11:52.762',	'2026-07-05 23:59:59.999',	'2026-06-05 00:00:00'),
('a1e7e7fb-01f7-4908-bbd4-094196375c1f',	'455bbf6d-c482-408d-b449-7df76e15f696',	4,	2640,	6,	158.4,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:11:52.799',	'2026-07-02 16:11:52.799',	'2026-07-05 23:59:59.999',	'2026-06-05 00:00:00'),
('7682349d-1351-4272-9add-1346eff8f795',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	4,	8688,	10,	868.8,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:11:52.824',	'2026-07-02 16:11:52.824',	'2026-07-05 23:59:59.999',	'2026-06-05 00:00:00'),
('adccee05-84e8-47a5-aecc-ede96826b21e',	'e2f5808a-8809-4668-9e63-29444d0f988b',	1,	20,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:11:52.863',	'2026-07-02 16:11:52.863',	'2026-07-05 23:59:59.999',	'2026-06-05 00:00:00'),
('12bcbab5-6d02-4a0a-b52b-3a1484a14fa3',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	2,	2125,	6,	127.5,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:02.303',	'2026-07-02 16:14:02.303',	'2026-07-04 23:59:59.999',	'2026-06-05 00:00:00'),
('58d3901e-395b-438a-a66e-7916800162ac',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:02.425',	'2026-07-02 16:14:02.425',	'2026-07-04 23:59:59.999',	'2026-06-05 00:00:00'),
('17461429-b5be-4a00-9cbe-1c13fbac4cb1',	'1e85f3e9-37fc-4704-8650-ce423408044e',	1,	0,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:02.499',	'2026-07-02 16:14:02.499',	'2026-07-04 23:59:59.999',	'2026-06-05 00:00:00'),
('7773d6a7-5da1-44ce-be20-72afe23a2c53',	'6ee97972-be10-4114-bcc2-fe9165be7714',	5,	587,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:02.599',	'2026-07-02 16:14:02.599',	'2026-07-04 23:59:59.999',	'2026-06-05 00:00:00'),
('576a3d16-4a1c-4548-8cb0-d3c9b9e92b27',	'455bbf6d-c482-408d-b449-7df76e15f696',	4,	2640,	6,	158.4,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:14:02.663',	'2026-07-02 16:14:02.663',	'2026-07-04 23:59:59.999',	'2026-06-05 00:00:00'),
('075814a2-715c-4556-b0f9-63d590ef661c',	'455bbf6d-c482-408d-b449-7df76e15f696',	4,	2640,	6,	158.4,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:37:36.289',	'2026-07-02 16:37:36.289',	'2026-08-05 23:59:59.999',	'2026-05-01 00:00:00'),
('a937726f-8566-4280-bcb3-326de88dc381',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	4,	8688,	10,	868.8,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:37:36.312',	'2026-07-02 16:37:36.312',	'2026-08-05 23:59:59.999',	'2026-05-01 00:00:00'),
('a3355dcd-53e8-45f1-a5b9-45ab62f8e05f',	'e2f5808a-8809-4668-9e63-29444d0f988b',	1,	20,	0,	0,	'UNPAID',	NULL,	NULL,	NULL,	'2026-07-02 16:37:36.34',	'2026-07-02 16:37:36.34',	'2026-08-05 23:59:59.999',	'2026-05-01 00:00:00');

DROP TABLE IF EXISTS "AgentSlab";
CREATE TABLE "public"."AgentSlab" (
    "id" text NOT NULL,
    "agentId" text NOT NULL,
    "minSales" double precision NOT NULL,
    "maxSales" double precision,
    "commissionRate" double precision NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "AgentSlab_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "AgentSlab" ("id", "agentId", "minSales", "maxSales", "commissionRate", "createdAt", "updatedAt") VALUES
('e92712e7-6f1d-46a4-884b-b89a8a5bf56e',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	1000,	2000,	5,	'2026-06-23 17:41:47.058',	'2026-06-23 17:41:47.058'),
('5afaf1c9-5837-45c0-941d-cb88157d81d3',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	2001,	3000,	6,	'2026-06-23 17:41:47.058',	'2026-06-23 17:41:47.058'),
('96cd3d25-74b8-4758-bb6e-ca3f05645ef1',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	3001,	4000,	7,	'2026-06-23 17:41:47.058',	'2026-06-23 17:41:47.058'),
('4d222244-b4e6-472d-9140-beea7a137342',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	4001,	5000,	8,	'2026-06-23 17:41:47.058',	'2026-06-23 17:41:47.058'),
('2a7b663e-7006-40bc-a88c-9ab9d2159381',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	5001,	NULL,	10,	'2026-06-23 17:41:47.058',	'2026-06-23 17:41:47.058'),
('5b15a96c-109d-4bb7-a7b7-174983197592',	'455bbf6d-c482-408d-b449-7df76e15f696',	1000,	2000,	5,	'2026-06-26 13:57:49.451',	'2026-06-26 13:57:49.451'),
('3aa382b7-feae-4216-b716-f9b7791cc7a5',	'455bbf6d-c482-408d-b449-7df76e15f696',	2001,	3000,	6,	'2026-06-26 13:57:49.451',	'2026-06-26 13:57:49.451'),
('93d2dc00-9a92-4e0d-af74-659551a083b2',	'455bbf6d-c482-408d-b449-7df76e15f696',	3001,	4000,	7,	'2026-06-26 13:57:49.451',	'2026-06-26 13:57:49.451'),
('793cceaf-dae0-49c4-af08-a7ab1bab0da4',	'455bbf6d-c482-408d-b449-7df76e15f696',	4001,	5000,	8,	'2026-06-26 13:57:49.451',	'2026-06-26 13:57:49.451'),
('a3d594ca-b8bf-4112-b08d-39d1a17db401',	'455bbf6d-c482-408d-b449-7df76e15f696',	5001,	NULL,	10,	'2026-06-26 13:57:49.451',	'2026-06-26 13:57:49.451'),
('fc8aab39-7d6b-4964-afec-e9cd757789fe',	'6ee97972-be10-4114-bcc2-fe9165be7714',	1000,	2000,	5,	'2026-06-26 14:21:07.237',	'2026-06-26 14:21:07.237'),
('5448d15b-f197-4fb1-ba3c-de36dc12e074',	'6ee97972-be10-4114-bcc2-fe9165be7714',	2001,	3000,	6,	'2026-06-26 14:21:07.237',	'2026-06-26 14:21:07.237'),
('5ab2de00-adfe-49e3-af1e-80b3fd3c4a98',	'6ee97972-be10-4114-bcc2-fe9165be7714',	3001,	4000,	7,	'2026-06-26 14:21:07.237',	'2026-06-26 14:21:07.237'),
('314cdc12-1a07-462d-8b22-fab053a9b80d',	'6ee97972-be10-4114-bcc2-fe9165be7714',	4001,	5000,	8,	'2026-06-26 14:21:07.237',	'2026-06-26 14:21:07.237'),
('0ed0e416-15e8-4b0e-8bea-1e74aba072b2',	'6ee97972-be10-4114-bcc2-fe9165be7714',	5001,	NULL,	10,	'2026-06-26 14:21:07.237',	'2026-06-26 14:21:07.237'),
('cd4fcbc8-8a66-4052-bc8a-1fdc48d4adff',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	1000,	2000,	5,	'2026-06-26 16:16:33.223',	'2026-06-26 16:16:33.223'),
('247e19c3-d29e-4241-a10c-928cf1aed523',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	2001,	3000,	6,	'2026-06-26 16:16:33.223',	'2026-06-26 16:16:33.223'),
('db994881-cb97-423a-87b3-7a4c7c4f6aeb',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	3001,	4000,	7,	'2026-06-26 16:16:33.223',	'2026-06-26 16:16:33.223'),
('af6170a0-2464-4075-b557-93fd517233ee',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	4001,	5000,	8,	'2026-06-26 16:16:33.223',	'2026-06-26 16:16:33.223'),
('b46c6bfa-e5ac-496e-aa28-f2fd1c3f6801',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	5001,	NULL,	10,	'2026-06-26 16:16:33.223',	'2026-06-26 16:16:33.223'),
('a6065f90-8123-4e39-8284-a5052dee22ee',	'e2f5808a-8809-4668-9e63-29444d0f988b',	1000,	2000,	5,	'2026-06-26 17:00:59.817',	'2026-06-26 17:00:59.817'),
('177ec3bc-c9f7-4ad6-97fb-2364c5198d14',	'e2f5808a-8809-4668-9e63-29444d0f988b',	2001,	3000,	6,	'2026-06-26 17:00:59.817',	'2026-06-26 17:00:59.817'),
('95c996dc-39ec-4314-a87c-6b8ec907b0e0',	'e2f5808a-8809-4668-9e63-29444d0f988b',	3001,	4000,	7,	'2026-06-26 17:00:59.817',	'2026-06-26 17:00:59.817'),
('170e174b-cb88-4d2d-8fc7-e30c92462805',	'e2f5808a-8809-4668-9e63-29444d0f988b',	4001,	5000,	8,	'2026-06-26 17:00:59.817',	'2026-06-26 17:00:59.817'),
('bde0c1f5-d884-48c1-9bdf-46ef7c5a0a4f',	'e2f5808a-8809-4668-9e63-29444d0f988b',	5001,	NULL,	10,	'2026-06-26 17:00:59.817',	'2026-06-26 17:00:59.817'),
('90c7dfff-eb3b-4b69-9725-278386a25d94',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	1000,	2000,	5,	'2026-06-29 13:07:51.672',	'2026-06-29 13:07:51.672'),
('3075c946-a4f5-4939-ae3e-7e289f2197fb',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	2001,	3000,	6,	'2026-06-29 13:07:51.672',	'2026-06-29 13:07:51.672'),
('9ae695bb-4189-468a-8d19-af7ad0e80057',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	3001,	4000,	7,	'2026-06-29 13:07:51.672',	'2026-06-29 13:07:51.672'),
('e2be81c0-ec68-40fa-b725-3b65c9931916',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	4001,	5000,	8,	'2026-06-29 13:07:51.672',	'2026-06-29 13:07:51.672'),
('b3bee79f-e2b4-4c2b-896a-115aa3cc6ddd',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	5001,	NULL,	10,	'2026-06-29 13:07:51.672',	'2026-06-29 13:07:51.672'),
('82597b24-9fcf-439f-9e11-baf1b4a1d13c',	'1e85f3e9-37fc-4704-8650-ce423408044e',	1000,	2000,	5,	'2026-06-29 13:08:49.299',	'2026-06-29 13:08:49.299'),
('0d52e52c-27c3-423a-bdcf-930ebefcb744',	'1e85f3e9-37fc-4704-8650-ce423408044e',	2001,	3000,	6,	'2026-06-29 13:08:49.299',	'2026-06-29 13:08:49.299'),
('8bd95347-18a3-4ab0-90c1-70ebadc129f9',	'1e85f3e9-37fc-4704-8650-ce423408044e',	3001,	4000,	7,	'2026-06-29 13:08:49.299',	'2026-06-29 13:08:49.299'),
('fa1e3333-9fca-4a17-9461-4e96dba9cc96',	'1e85f3e9-37fc-4704-8650-ce423408044e',	4001,	5000,	8,	'2026-06-29 13:08:49.299',	'2026-06-29 13:08:49.299'),
('eefd98b2-fdaf-4f50-996e-b0812ab5c5d3',	'1e85f3e9-37fc-4704-8650-ce423408044e',	5001,	NULL,	10,	'2026-06-29 13:08:49.299',	'2026-06-29 13:08:49.299'),
('e0a2ae0d-0c11-4819-809d-aaac5e8f6b63',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	1000,	2000,	5,	'2026-06-29 13:09:34.139',	'2026-06-29 13:09:34.139'),
('55362b84-c043-4013-82bd-c16d253f8ea4',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	2001,	3000,	6,	'2026-06-29 13:09:34.139',	'2026-06-29 13:09:34.139'),
('eed90887-da87-4bd6-8d64-99e0c2afdd23',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	3001,	4000,	7,	'2026-06-29 13:09:34.139',	'2026-06-29 13:09:34.139'),
('eb3fdf32-e8ca-4ea1-8606-f9b8b367431c',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	4001,	5000,	8,	'2026-06-29 13:09:34.139',	'2026-06-29 13:09:34.139'),
('640e0605-50f8-4acf-8552-d3a8e35943df',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	5001,	NULL,	10,	'2026-06-29 13:09:34.139',	'2026-06-29 13:09:34.139'),
('616bcb38-0e0d-4eb0-8251-d16b875ca88a',	'e1f168f7-0772-4e82-9011-6745efc8c59b',	1000,	2000,	5,	'2026-06-29 13:12:14.827',	'2026-06-29 13:12:14.827'),
('c682e206-cf10-4992-856f-679d4fcaea9d',	'e1f168f7-0772-4e82-9011-6745efc8c59b',	2001,	3000,	6,	'2026-06-29 13:12:14.827',	'2026-06-29 13:12:14.827'),
('ff87f7bc-8c5f-4ab4-b30f-26a730fd1706',	'e1f168f7-0772-4e82-9011-6745efc8c59b',	3001,	4000,	7,	'2026-06-29 13:12:14.827',	'2026-06-29 13:12:14.827'),
('cc0dcbca-0634-417d-ae4e-ee5a5037f4d4',	'e1f168f7-0772-4e82-9011-6745efc8c59b',	4001,	5000,	8,	'2026-06-29 13:12:14.827',	'2026-06-29 13:12:14.827'),
('4280d19a-d4cf-4548-aebb-431edd84ab2b',	'e1f168f7-0772-4e82-9011-6745efc8c59b',	5001,	NULL,	10,	'2026-06-29 13:12:14.827',	'2026-06-29 13:12:14.827');

DROP TABLE IF EXISTS "Airline";
CREATE TABLE "public"."Airline" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "code" text NOT NULL,
    "country" text NOT NULL,
    "logoUrl" text,
    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Airline_code_key" ON public."Airline" USING btree (code);

INSERT INTO "Airline" ("id", "name", "code", "country", "logoUrl") VALUES
('7baae0de-0d1b-4884-8f56-3bcb8c659627',	'Delta Air Lines',	'DL',	'United States',	NULL),
('1a6d7e47-290d-44c2-89e8-ba49a3bb0b25',	'Lufthansa',	'LH',	'Germany',	NULL);

DROP TABLE IF EXISTS "Airport";
CREATE TABLE "public"."Airport" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "code" text NOT NULL,
    "city" text NOT NULL,
    "country" text NOT NULL,
    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Airport_code_key" ON public."Airport" USING btree (code);

INSERT INTO "Airport" ("id", "name", "code", "city", "country") VALUES
('f88477f9-7ca1-4f3f-8eba-e768edca3206',	'Aeroporto Aracaju–santa Maria Santa Aracaju Sergipe',	'AJU',	'Se',	'Brazil'),
('74633c17-e093-4d22-aa8c-e89bedfce9b7',	'Al-jawf Domestic Airport Sakakah Al Jawf',	'AJF',	'Province',	'Saudi Arabia'),
('77d27fec-5638-422e-a7f6-8c9ea6dbab2e',	'Lengpui Airport Aizawl Aijal Mizoram',	'AJL',	'Mz',	'India'),
('04075c6f-17a5-44f8-9c4a-dd5e4b60c041',	'Akron Fulton International Airport Ohio',	'AKC',	'Oh',	'United States'),
('d7850ec8-05f6-4879-b6da-1f86231f9015',	'Auckland Airport',	'AKL',	'Mangere',	'New Zealand'),
('ce89adbb-83e2-4c42-9046-ac9ded32367d',	'Royal Air Force',	'AKT',	'Akrotiri',	'Cyprus'),
('97dac31c-0ff5-495e-8fdd-f3f168ddcde6',	'Aktobe',	'AKX',	'Airport',	'Kazakhstan'),
('f2543418-b18a-46c7-9f85-d97ee03a1c97',	'Almaty International',	'ALA',	'Airport',	'Kazakhstan'),
('5001576f-4454-44f5-95b8-56776b22205c',	'Albany International Airport Colonie New York',	'ALB',	'Ny',	'United States'),
('c74d343c-a323-4b46-8d09-e6c8d52dd8d5',	'Aeropuerto De Alicante-elche Alicante',	'ALC',	'Valencia',	'Spain'),
('8529699c-b7db-44d6-bce5-c5440015a46b',	'Houari Boumediene Airport',	'ALG',	'Algiers',	'Algeria'),
('b97485d4-1bb6-4fac-871a-178d25e40c92',	'Rick Husband Amarillo International Airport Texas',	'AMA',	'Tx',	'United States'),
('2e82f716-fbcf-4862-b726-727ef46348fd',	'Sardar Vallabhbhai Patel International Airport Ahmedabad Gujarat',	'AMD',	'Gj',	'India'),
('0992c5e0-ffbb-4163-bb54-83fe5e84ae32',	'Queen Alia International Airport Amman',	'AMM',	'Zizya',	'Jordan'),
('beae134a-d79d-495a-984e-6e28a907eb33',	'Bandar Udara Pattimura Airport Ambon',	'AMQ',	'Maluku',	'Indonesia'),
('c337e322-fd3a-4200-823d-7f19c5d50220',	'Luchthaven Schiphol',	'AMS',	'Amsterdam',	'Netherlands'),
('fee35fa0-354a-460c-aa7a-4122833c43ac',	'Ted Stevens Anchorage International Airport Alaska',	'ANC',	'Ak',	'United States'),
('12584b71-c182-4ab2-9955-1fa52e09b107',	'Aéroport International D''angoulême-cognac Angoulême',	'ANG',	'Champniers',	'France'),
('de45b61c-b7ac-4b28-9267-5970bcb470e6',	'Internationale Luchthaven Antwerpen Antwerp',	'ANR',	'Deurne',	'Belgium'),
('65326421-d021-43d8-b546-2be5025216ba',	'Aeropuerto Andahuaylas',	'ANS',	'Apurímac',	'Peru'),
('d59a60be-db6e-47da-b084-f0fc66641cfe',	'V. C. Bird International Airport Saint John’s Antigua',	'ANU',	'And',	'Barbuda'),
('ac389680-656a-407b-afe5-cbb666e6d69d',	'Aeroporto Raffaello Sanzio Di Ancona-falconara Ancona Falconara',	'AOI',	'Marittima',	'Italy'),
('1f112e23-1748-421a-911f-ea912295687a',	'Centennial Airport Denver Aurora Colorado',	'APA',	'Co',	'United States'),
('f86a2fa1-0eb1-43f2-9b1f-76f10056d174',	'Faleolo International Airport',	'APW',	'Apia',	'Samoa'),
('65d94400-37cd-4806-bdaf-5d1c60754737',	'King Hussein International Airport',	'AQJ',	'Aqaba',	'Jordan'),
('1371d22e-7ffe-4268-bada-c636199b47f9',	'Aeropuerto Internacional Alférez Alfredo Rodríguez Ballón International Airport',	'AQP',	'Arequipa',	'Peru'),
('d79005c6-d5da-4151-a5ad-dbd90e1d6168',	'Stockholm-arlanda Flygplats Stockholm',	'ARN',	'Arlanda',	'Sweden'),
('29d9d0d3-4332-4b3f-8c67-e2e873290b74',	'John F. Kennedy International Airport New York City',	'JFK',	'Ny',	'United States'),
('3bcc2813-65d7-480d-acad-2fcf48036028',	'Los Angeles International Airport California',	'LAX',	'Ca',	'United States'),
('72e77e14-e271-48dd-bb49-d3192b53d785',	'Aalborg Lufthavn',	'AAL',	'Nørresundby',	'Denmark'),
('fc7abdd8-8f2f-4b1e-a693-c5547552bd3c',	'Aarhus Airport',	'AAR',	'Tirstrup',	'Denmark'),
('ad16e808-f53f-4dde-825a-2350feb641a0',	'Abakan International',	'ABA',	'Airport',	'Russia'),
('99577a92-c29a-43bc-a393-dd465f96b77a',	'Aeropuerto De Albacete Castilla-la',	'ABC',	'Mancha',	'Spain'),
('5298c9a5-3f40-4044-afd9-3c2d29d3ad03',	'Sochi International',	'AER',	'Airport',	'Russia'),
('65c01229-bd7b-4f8d-b71c-f8b8d0a61eb7',	'Abilene Regional Airport Texas',	'ABI',	'Tx',	'United States'),
('5ea3c470-9d4e-4eb4-901a-29ddee7fe147',	'Aéroport International Félix Houphouët-boigny Airport Abidjan',	'ABJ',	'Port-bouet',	'Ivory Coast'),
('53c15bee-e530-4f44-b457-54c8b95071a7',	'Albuquerque International Sunport New Mexico',	'ABQ',	'Nm',	'United States'),
('a575b9f9-7fd6-404b-8c5d-b3a37e620ed8',	'Nnamdi Azikiwe International Airport',	'ABV',	'Abuja',	'Nigeria'),
('75f6bad7-9ce7-4e21-a524-95ff740792fb',	'Aberdeen International Airport Dyce',	'ABZ',	'Scotland',	'United Kingdom'),
('ec1aa8ed-b852-4835-91aa-2bc176ecab63',	'Aeropuerto Internacional General Juan N. Álvarez International Airport Acapulco Guerrero',	'ACA',	'Gr',	'Mexico'),
('be2ac6d7-6364-44d6-863f-ac3bb0d55496',	'Kotoka International Airport',	'ACC',	'Accra',	'Ghana'),
('f3659452-196b-48ca-9f43-67792da422cd',	'Aeropuerto De Lanzarote Arrecife Canary',	'ACE',	'Islands',	'Spain'),
('18860da6-32c7-43b5-9137-63d440af8459',	'Nantucket Memorial Airport Massachusetts',	'ACK',	'Ma',	'United States'),
('967285e5-d80b-47bf-8b09-cc31d86a3389',	'Atlantic City International Airport Egg Harbor Township New Jersey',	'ACY',	'Nj',	'United States'),
('e831ba45-5ae6-4c8d-859d-a14bcb165ae7',	'Adana Havalimanı',	'ADA',	'Çukurova',	'Turkey'),
('aa825b3e-3e16-41da-977c-677171b752f8',	'Addis Ababa Bole International',	'ADD',	'Airport',	'Ethiopia'),
('ac634360-8e9c-4b3c-a1a5-9a804a4ee676',	'Adelaide Airport South',	'ADL',	'Australia',	'Sa'),
('ad159ea3-1625-4cfd-869f-322748136730',	'Aeroparque Jorge Newbery Airfield Buenos Aires',	'AEP',	'Palermo',	'Argentina'),
('d937d00d-d7b3-4bbd-bedd-369a4469ae21',	'Ålesund Lufthavn, Vigra Alesund',	'AES',	'Airport,',	'Norway'),
('f7d99788-4d44-45db-b651-8ddbda59a215',	'Alexandria International Airport Louisiana',	'AEX',	'La',	'United States'),
('0764fe56-b90c-4fc7-b1a6-aa313acc0fc6',	'Akureyrarflugvöllur',	'AEY',	'Akureyri',	'Iceland'),
('60eecf81-a2db-47a9-bbd3-726a1b7af9d9',	'Fort Worth Alliance Airport Texas',	'AFW',	'Tx',	'United States'),
('32b05c94-4cf4-48a1-b021-f28223250df3',	'Agadir–al Massira Airport',	'AGA',	'Agadir',	'Morocco'),
('fcfd4b4c-5799-4b97-ad5c-3f56116ee77a',	'Flughafen Augsburg',	'AGB',	'Affing',	'Germany'),
('e8d96653-184b-4e7e-a1e2-c623ed877fce',	'Allegheny County Airport West Mifflin Pittsburgh Pennsylvania',	'AGC',	'Pa',	'United States'),
('07408454-873e-49a2-8724-0e4663706a17',	'Aeropuerto De Málaga-costa Del Sol Málaga',	'AGP',	'Costa',	'Spain'),
('a6def95b-1c14-4181-9225-00b9fd138628',	'Augusta Regional Airport Georgia',	'AGS',	'Ga',	'United States'),
('948bcc31-b41d-40b6-83ff-548318a16698',	'Aeropuerto Internacional Lic. Jesús Terán Peredo International Airport Aguascalientes',	'AGU',	'Ag',	'Mexico'),
('3b855e45-f9b1-4569-8101-9e47abdd118f',	'Abha Regional Airport Asir',	'AHB',	'Province',	'Saudi Arabia'),
('218cebcc-2faf-4665-84ab-16cd2da22e5b',	'Aéroport D’ajaccio-napoléon-bonaparte Ajaccio Napoleon Bonaparte',	'AJA',	'Airport',	'France'),
('3b3f7dba-89cc-4b4e-85a1-9930afef1f03',	'Aeroporto Internacional Júlio Cezar Ribeiro Belém Val De Cans Pará',	'BEL',	'Pa',	'Brazil'),
('bac9a50a-326c-4fc6-b8d6-a760488e4bf5',	'Flughafen Berlin',	'BER',	'Brandenburg',	'Germany'),
('0326663f-7649-49e8-aa55-b66514a05422',	'Brest Bretagne',	'BES',	'Airport',	'France'),
('bf8f53d4-5c55-4df1-a0a6-38db9c0f4f51',	'Beirut–rafic Hariri International Airport',	'BEY',	'Beirut',	'Lebanon'),
('a5c57907-c284-465d-91ac-807889f97e63',	'Western Nebraska Regional Airport Scottsbluff',	'BFF',	'Ne',	'United States'),
('5a69efba-a4ca-4415-8bb8-b7ec5c62ea83',	'King County International Airport / Boeing Field Seattle Washington',	'BFI',	'Wa',	'United States'),
('925ff3f3-46e0-4f1a-9a4b-c81ef00cbb94',	'Meadows Field Airport Bakersfield Oildale California',	'BFL',	'Ca',	'United States'),
('3a4354a4-8b7a-46ac-ac9f-dee916184b2c',	'Belfast International Airport Aldergrove Northern',	'BFS',	'Ireland',	'United Kingdom'),
('915eab40-3340-4924-afce-b2987378d131',	'Aeropuerto Internacional De Palonegro International Airport Bucaramanga',	'BGA',	'Lebrija',	'Colombia'),
('d6f27391-71e1-4a73-8f62-5631fca36e0a',	'Grantley Adams International Airport Bridgetown',	'BGI',	'Seawell',	'Barbados'),
('90c80af0-034f-4fb3-b358-b99bb9e6db9f',	'Bergen Lufthavn,',	'BGO',	'Flesland',	'Norway'),
('20296a2c-f76b-4cf1-9a7d-1d193b379f72',	'Bangor International Airport Maine',	'BGR',	'Me',	'United States'),
('a3d6997d-58e1-4193-9199-5857025e2d84',	'Baghdad International',	'BGW',	'Airport',	'Iraq'),
('18e1b16c-7743-4723-8803-b8919f38bd20',	'Aeroporto Di Bergamo-orio Al Serio Il Caravaggio International Airport Bergamo',	'BGY',	'Milan',	'Italy'),
('07c50471-fbc8-4f41-b39c-2f4f2a7b5680',	'George Best Belfast City Airport Northern',	'BHD',	'Ireland',	'United Kingdom'),
('86cac66b-a59c-40b5-9782-b33ccf791214',	'Birmingham–shuttlesworth International Airport Birmingham Alabama',	'BHM',	'Al',	'United States'),
('f44833de-2853-4688-aa2f-9b4531d3cc28',	'Raja Bhoj Airport Bhopal Madhya Pradesh',	'BHO',	'Mp',	'India'),
('7ef63757-5511-44ff-971f-98fb553a0472',	'Birmingham Airport',	'BHX',	'England',	'United Kingdom'),
('75157b7b-98e8-499e-b165-1cc1c5d71404',	'Bandar Udara Internasional Frans Kaisiepo International Airport',	'BIK',	'Biak',	'Indonesia'),
('53f17300-1447-4b0a-a7eb-ea22713cec6d',	'Billings Logan International Airport Montana',	'BIL',	'Mt',	'United States'),
('c3bb6770-ebba-4b55-a85c-5ccd4b9ae018',	'Aeropuerto De Bilbao',	'BIO',	'Biscay',	'Spain'),
('215a2902-7ea8-41ef-9ee8-b3b7839373fd',	'Rocky Mountain Metropolitan Airport Denver Colorado',	'BJC',	'Co',	'United States'),
('6fead47f-ef37-4763-bacf-5834dc447e7f',	'Banjul International Airport',	'BJL',	'The',	'Gambia'),
('d85da97a-47b7-44b5-aa5e-10afa77d9774',	'Aéroport International De',	'BJM',	'Bujumbura',	'Burundi'),
('f831459a-33b6-4edc-b1e1-75e69f84f35b',	'Aeropuerto Internacional De Guanajuato',	'BJX',	'Silao',	'Mexico'),
('a59e51a5-4a3b-46d3-9a8a-698351bf0461',	'Lake Brooks Seaplane Base Katmai National Park Camp Alaska',	'BKF',	'Ak',	'United States'),
('86b174c4-8557-493b-8cea-4e5984ce55ec',	'Ashgabat International',	'ASB',	'Airport',	'Turkmenistan'),
('fa7ceba8-92a5-4dde-a16e-439d0fc9444a',	'Aspen–pitkin County Airport Aspen Colorado',	'ASE',	'Co',	'United States'),
('a2cc27ea-f22c-4701-9b7f-4f81fb4c3e6a',	'Asmara International',	'ASM',	'Airport',	'Eritrea'),
('6e2a60ec-3fc7-4ecf-8b1d-86e578a50111',	'Aeropuerto Comandante Fap Germán Arias Graziani Airport Huaraz Anta',	'ATA',	'Ancash',	'Peru'),
('71393fb9-aecd-4ab9-a3c4-b0889fffe325',	'Athens International Airport, Eleftherios',	'ATH',	'Venizelos',	'Greece'),
('fcc793c7-bc99-4ca3-b8c0-cd84fbfc932b',	'Hartsfield–jackson International Airport Atlanta Georgia',	'ATL',	'Ga',	'United States'),
('b9745129-fb8a-42f5-aa9a-fd1612d9378d',	'Sri Guru Ram Das Jee International Airport Amritsar Punjab',	'ATQ',	'Pb',	'India'),
('ee589c7e-01bd-4b77-b8e3-038b6e6cc812',	'Appleton International Airport Greenville Wisconsin',	'ATW',	'Wi',	'United States'),
('29daf03b-7831-4bcb-ad30-66c850a9daec',	'Internationale Luchthaven Koningin Beatrix Queen Oranjestad',	'AUA',	'Aruba',	'Netherlands'),
('8fc32f9d-d08d-4567-8b2d-2f31e3f916c0',	'Abu Dhabi International',	'AUH',	'Airport',	'United Arab Emirates'),
('aaa054e3-d2d3-410c-a3c9-23a8a279c771',	'Austin–bergstrom International Airport Austin Texas',	'AUS',	'Tx',	'United States'),
('cb23cec2-707c-4b22-a701-4875cec47f6d',	'Asheville Regional Airport North Carolina',	'AVL',	'Nc',	'United States'),
('1b6a83d4-5dcd-46d1-a2b5-3807ed0aa9cc',	'Wilkes-barre/scranton International Airport Avoca Scranton Pennsylvania',	'AVP',	'Pa',	'United States'),
('9a8b9b1a-cdaf-48dd-af45-e8fd75ad18a8',	'Ahvaz International Airport',	'AWZ',	'Ahwaz',	'Iran'),
('69f6d68c-d9b6-4ad4-a52e-de10b1055a4b',	'Aeropuerto Coronel Fap Alfredo Mendívil Duarte Airport',	'AYP',	'Ayacucho',	'Peru'),
('4090f91f-9609-4536-a5ea-b9f4465bd27c',	'Antalya',	'AYT',	'Havalimanı',	'Turkey'),
('d8751629-a6bb-4204-b100-46376272948c',	'Mesa Gateway Airport Arizona',	'AZA',	'Az',	'United States'),
('79c76432-bc8b-42c3-a775-2f283320a5c0',	'Kalamazoo/battle Creek International Airport Kalamazoo Battle Michigan',	'AZO',	'Mi',	'United States'),
('4c52d145-c9e2-438d-9f21-96aac8dee43f',	'Bahrain International',	'BAH',	'Airport',	'Muharraq'),
('0b8770b3-863c-4849-9100-f77717a061be',	'Batman',	'BAL',	'Havaalanı',	'Turkey'),
('f43817c3-471c-4528-850c-d91e6f5ac4a7',	'Aeropuerto Internacional Ernesto Cortissoz International Airport Barranquilla',	'BAQ',	'Soledad',	'Colombia'),
('5679837b-b175-4c1b-85c5-c67cbdb58c8e',	'Aeroporto Chafei Amsei Airport Barretos Sao Paulo São',	'BAT',	'Sp',	'Brazil'),
('d2e1cb16-d582-41fd-81c7-7008c8a81258',	'Virginia Tech Montgomery Executive Airport Blacksburg Christiansburg',	'BCB',	'Va',	'United States'),
('34ddcb58-6f63-417e-a201-d03a7dc9149e',	'Paliparan Ng Bacolod–silay Airport',	'BCD',	'Bacolod',	'Philippines'),
('c568b00d-ed99-471f-a2c0-5d524c5de6d0',	'Aeropuerto De Barcelona-el Prat Barcelona El',	'BCN',	'Llobregat',	'Spain'),
('72519acd-6a37-43ba-b0d0-9ff972af7a25',	'L.f. Wade International Airport Bermuda St. David''s',	'BDA',	'Island',	'United Kingdom'),
('614d4f88-9de9-4cca-ac91-e2d72f198821',	'Bird Island',	'BDI',	'Airport',	'Seychelles'),
('a1411209-7a6e-4b76-889e-1563b707619b',	'Bradley International Airport Hartford Windsor Locks Connecticut',	'BDL',	'Ct',	'United States'),
('51789ab7-bdca-4b77-830e-9b3c34023831',	'Brindisi - Aeroporto Del',	'BDS',	'Salento',	'Italy'),
('9c36cd65-2df9-45da-aa3b-2610ad2f8808',	'Port-adhair Beinn Na Faoghla Benbecula Balivanich',	'BEB',	'Scotland',	'United Kingdom'),
('8db0ebfc-fb15-4644-a65a-9c49e169117b',	'Laurence G. Hanscom Field Bedford Massachusetts',	'BED',	'Ma',	'United States'),
('5c6b7363-d88f-41f8-9bea-a302d8bdd7f9',	'Aerodrom Beograd - Nikola Tesla',	'BEG',	'Belgrade',	'Serbia'),
('c493773b-8526-40d3-9200-534898c7c9b9',	'Luchthaven Brussel-nationaal',	'BRU',	'Brussels',	'Belgium'),
('e45ee3cb-7553-4e4d-9d14-4600e8ac8e8f',	'Wiley Post–will Rogers Memorial Airport Barrow Alaska',	'BRW',	'Ak',	'United States'),
('c508da1b-6e62-4bcd-a533-e6662d5b400d',	'Aeroporto Internacional De Brasília–pres. Juscelino Kubitschek Presidente International Airport',	'BSB',	'Brasília',	'Brazil'),
('d159c806-9eb4-44d3-8bc1-49e7ea80a4a1',	'Euroairport Basel–mulhouse–freiburg Basel Saint-louis',	'BSL',	'France',	'Switzerland'),
('a30ed956-943b-41c8-9801-ef559e230820',	'Bandar Udara Internasional Sultan Iskandar Muda Iskander International Airport Banda Aceh Blang',	'BTJ',	'Bintang',	'Indonesia'),
('c3373cf6-e0f1-4cfe-b414-b14fb4bf6bb4',	'Bert Mooney Airport Butte Montana',	'BTM',	'Mt',	'United States'),
('9f8c3dd0-5fb5-49b8-afdf-5091bae5f486',	'Baton Rouge Metropolitan Airport Louisiana',	'BTR',	'La',	'United States'),
('90601c34-d3ac-43f7-816d-476e9b7e688b',	'Letisko M. R. Štefánika Štefánik Airport',	'BTS',	'Bratislava',	'Slovakia'),
('65e6f466-cb66-4b78-a348-bf3aba0fce48',	'Burlington International Airport Vermont',	'BTV',	'Vt',	'United States'),
('504421f4-e4e7-4c95-95b2-1d318a89030d',	'Budapest Liszt Ferenc Nemzetközi',	'BUD',	'Repülőtér',	'Hungary'),
('b93f46b1-dbc9-47d0-bfdb-268f642e65ae',	'Buffalo Niagara International Airport Cheektowaga New York',	'BUF',	'Ny',	'United States'),
('d8713069-6a39-4959-ad5e-d147d6c67e20',	'Bob Hope Airport Burbank Los Angeles California',	'BUR',	'Ca',	'United States'),
('b6f96604-1639-44bd-9f05-b91b04f401dc',	'Bathpalathang Airport',	'BUT',	'Jakar',	'Bhutan'),
('e3903906-0858-4563-80e7-d11f9166aeef',	'Aéroport De Beauvais-tillé Beauvais',	'BVA',	'Tillé',	'France'),
('9653128a-35c4-4143-916c-f4ca7b5e8bc3',	'Aeroporto International Atlas Brasil Cantanhede Boa Vista Roraima',	'BVB',	'Rr',	'Brazil'),
('d02e8000-d69a-49d5-a462-b1a6b76f3e0c',	'Aeroporto Internacional Aristides Pereira International Airport Sal Rei Boa Vista',	'BVC',	'Cape',	'Verde'),
('15ca17db-e877-4678-99db-a24b9282334f',	'Flughafen Braunschweig-wolfsburg Braunschweig',	'BWE',	'Wolfsburg',	'Germany'),
('70791223-6cd7-47f2-aeee-3184b4c146bf',	'Barrow/walney Island Airport Barrow-in-furness',	'BWF',	'England',	'United Kingdom'),
('d0200a21-1deb-4a79-ae0c-beddf6478c50',	'Baltimore/washington International Thurgood Marshall Airport Baltimore Washington D.c. Maryland',	'BWI',	'Md',	'United States'),
('c6c4979f-a2cb-4dc8-ba65-8e130a78749a',	'Brunei International Airport Bandar',	'BWN',	'Seri',	'Begawan'),
('f74417ef-c29f-4167-99f1-04df4831df71',	'Aeroporto De',	'BYJ',	'Beja',	'Portugal'),
('a39ca29c-ac6e-43ec-a594-27db092517a9',	'Philip S. W. Goldson International Airport Belize',	'BZE',	'City',	'Ladyville'),
('5e46bea6-a940-4646-a480-4d8aa7ca4dd4',	'Bozeman Yellowstone International Airport Belgrade Montana',	'BZN',	'Mt',	'United States'),
('5349964c-2c79-45ae-9152-01de2c340f0c',	'Maya-maya Airport Brazzaville Congo Republic',	'BZV',	'Of',	'The'),
('4aee9ae2-97dd-4041-b05a-87efa1b71a53',	'Columbia Metropolitan Airport Cayce South Carolina',	'CAE',	'Sc',	'United States'),
('46238c68-c295-408a-9265-046a2c972d9a',	'Sembach',	'SEX',	'Kaserne',	'Germany'),
('e3e5b0e7-26ec-49ff-a01c-7461b722b0b5',	'Suvarnabhumi Airport',	'BKK',	'Bangkok',	'Thailand'),
('be5387e0-5aec-4f4e-babb-08c2fbff0afe',	'Burke Lakefront Airport Cleveland Ohio',	'BKL',	'Oh',	'United States'),
('978e5793-9a77-44b7-bce6-ffe524788523',	'Bellingham International Airport Washington',	'BLI',	'Wa',	'United States'),
('67c2d890-df7f-4d2f-b5b6-8c5a7f44fe64',	'Blackpool Airport',	'BLK',	'England',	'United Kingdom'),
('0d5f9e84-401d-4aa2-a77f-81a7e6db6d9f',	'Billund',	'BLL',	'Lufthavn',	'Denmark'),
('ac0770d4-7ca4-4659-831e-d6c5d97857e5',	'Aeroporto Di Bologna-guglielmo Marconi Guglielmo',	'BLQ',	'Bologna',	'Italy'),
('6b84e2d9-d156-49ab-9753-f11a59da6378',	'Kempegowda International Airport Bengaluru Devanahalli Karnataka',	'BLR',	'Ka',	'India'),
('4137b61f-f1c6-4347-a751-d3048ac30b5e',	'Stockholm-bromma Flygplats Stockholm',	'BMA',	'Bromma',	'Sweden'),
('aa9ff894-6495-4cce-8a64-ad3048a2d656',	'Central Illinois Regional Airport Bloomington',	'BMI',	'Il',	'United States'),
('2de5091d-84eb-44f9-a269-c01aed29ce49',	'Sân Bay Buôn Ma Thuột Buon',	'BMV',	'Thuot',	'Vietnam'),
('134523c0-d380-46c8-8eee-2864cb5b8f81',	'Nashville International Airport Tennessee',	'BNA',	'Tn',	'United States'),
('7bee17f5-db34-41b2-8698-4dede8bd0643',	'Bandar Abbas International',	'BND',	'Airport',	'Iran'),
('8c8ad170-923f-4e51-a7d9-b0751314efee',	'Brisbane Airport Queensland',	'BNE',	'Qld',	'Australia'),
('e99c5f95-820a-4d6c-b80f-de005552cbba',	'Banja Luka International Airport',	'BNX',	'Mahovljani',	'Bosnia And Herzegovina'),
('a813d42b-dfcc-400e-9d91-390429bc40bc',	'Bora Airport Motu Mute French',	'BOB',	'Polynesia',	'France'),
('95aaf3e7-d227-4342-8a53-73efdf24909c',	'Aéroport De Bordeaux-mérignac Bordeaux',	'BOD',	'Mérignac',	'France'),
('f93cbd46-66e3-465d-9a17-8c335d487c6e',	'Aeropuerto Internacional El Dorado International Airport',	'BOG',	'Bogotá',	'Colombia'),
('4b1cc476-3b8d-4192-8714-e3803c7a1da7',	'Bournemouth Airport Hurn',	'BOH',	'England',	'United Kingdom'),
('84150b84-2c29-4f03-adca-cd6230b4dfb1',	'Boise Airport Idaho',	'BOI',	'Id',	'United States'),
('218f5366-b780-4a0b-97d0-43f8e304daef',	'Chhatrapati Shivaji International Airport Mumbai Maharashtra',	'BOM',	'Mh',	'India'),
('484f24ee-aed2-4942-9224-27b985d847d7',	'Luchthaven Flamingo International Airport Bonaire Kralendijk Abc',	'BON',	'Islands',	'Netherlands'),
('c40f1e5e-8ab3-4cab-905e-e1c16bed8924',	'Logan International Airport Boston Paradise Massachusetts',	'BOS',	'Ma',	'United States'),
('b747a583-b2fb-403e-86ca-7272b6a464f4',	'Bandar Udara Internasional Sultan Aji Muhammad Sulaiman Balikpapan East',	'BPN',	'Kalimantan',	'Indonesia'),
('5c819cb1-666f-4f2e-800f-d948766e8817',	'Jack Brooks Regional Airport Beaumont Port Arthur Texas',	'BPT',	'Tx',	'United States'),
('6da7e8f5-0a52-48d9-b5b2-29a34757377b',	'Biggin Hill Airport London Bromley',	'BQH',	'England',	'United Kingdom'),
('03a5c0de-a0ca-4a14-9996-170e39c7213f',	'Aeroporto De Barreiras Bahia',	'BRA',	'Ba',	'Brazil'),
('a50986cf-7ddf-42c3-89d0-bc86619c9bf3',	'Aeropuerto De San Carlos Bariloche',	'BRC',	'Airport',	'Argentina'),
('8049b11f-4f61-4138-9f1c-fc3f98abd373',	'Flughafen',	'BRE',	'Bremen',	'Germany'),
('f7785297-09cc-4181-a329-7c04d46e500e',	'Aeroporto Di Bari-karol Wojtyła Bari',	'BRI',	'Palese',	'Italy'),
('a4b4edf8-e934-4c2d-9760-e3af8ef58d7f',	'Letiště Brno–tuřany Brno',	'BRQ',	'Tuřany',	'Czech Republic'),
('6e5cc335-759c-4d99-9727-9ace01189338',	'Port-adhair Bharraigh Barra Outer Hebrides',	'BRR',	'Scotland',	'United Kingdom'),
('a61ab15a-e606-4716-b08b-ad213de73507',	'Bristol Airport Lulsgate Bottom',	'BRS',	'England',	'United Kingdom'),
('6092db47-f16d-4c39-a08f-fa446ba51b13',	'Charleston International Airport North South Carolina',	'CHS',	'Sc',	'United States'),
('2b05fd8f-ae8d-468e-a8a0-990a1fa7ae6b',	'Ciampino–aeroporto Internazionale G. B. Pastine Rome',	'CIA',	'Ciampino',	'Italy'),
('b16237e9-ab1f-4b60-849b-7c0155739a86',	'The Eastern Iowa Airport Cedar Rapids',	'CID',	'Ia',	'United States'),
('8677c782-c0ae-4f7a-b1d5-ce929e85afcd',	'Shymkent International',	'CIT',	'Airport',	'Kazakhstan'),
('40321df7-6e15-4dd7-b27a-44e5ca270385',	'Chippewa County International Airport Sault Ste. Marie Michigan',	'CIU',	'Mi',	'United States'),
('832a8284-c233-42ed-a459-fa6e9c725d2c',	'Aeropuerto Internacional Capitán Fap José Abelardo Quiñones Gonzáles Chiclayo',	'CIX',	'Lambayeque',	'Peru'),
('5ee0acdf-dcc7-42b9-a29c-09fb02b8dd72',	'Aeropuerto Mayor General Fap Armando Revoredo Iglesias Airport',	'CJA',	'Cajamarca',	'Peru'),
('a6f84ae6-dadb-4326-8295-c2d555c4e097',	'Jeju International Airport Cheju',	'CJU',	'Korea',	'South'),
('c2d99a99-17e2-4575-aaf1-83cefe243bfe',	'North Central West Virginia Airport Clarksburg Bridgeport',	'CKB',	'Wv',	'United States'),
('bdde7458-f32b-47a5-8892-6ad71f114436',	'Chongqing Jiangbei International Airport Yubei',	'CKG',	'District',	'China'),
('10e928bc-a155-4477-84bd-fb4c7c313d68',	'Conakry International',	'CKY',	'Airport',	'Guinea'),
('2f941b31-c5bd-4d86-bfe0-240e937e8bae',	'Mcclellan-palomar Airport Carlsbad California',	'CLD',	'Ca',	'United States'),
('ad45b102-c664-4012-ab36-fa709d1bfb84',	'Hopkins International Airport Cleveland Ohio',	'CLE',	'Oh',	'United States'),
('782421cb-7f68-43be-b8f9-165a4a2a555b',	'Aeroportul International “avram Iancu” Cluj',	'CLJ',	'Cluj-napoca',	'Romania'),
('4070db95-2589-4311-8b76-28cc076613eb',	'Easterwood Airport College Station Texas',	'CLL',	'Tx',	'United States'),
('c4ce7644-5988-495b-b287-6a15f6e3b7e7',	'Aeropuerto Internacional Alfonso Bonilla Aragón International Airport Santiago De',	'CLO',	'Cali',	'Colombia'),
('5231f6a8-68b0-4ff0-b008-a339580349bb',	'Douglas International Airport Charlotte North Carolina',	'CLT',	'Nc',	'United States'),
('34062e67-6594-4dbc-bff8-25d5c28efaa9',	'Aéroport De Calvi – Sainte-catherine',	'CLY',	'Airport',	'France'),
('1d9c3adb-b48c-4b79-b2cf-6618c0bf2369',	'Bandaranaike International Airport Colombo Katunayake Western',	'CMB',	'Province',	'Sri Lanka'),
('c28b619a-ede9-4b21-b500-4bf1ee5acede',	'Port Columbus International Airport Ohio',	'CMH',	'Oh',	'United States'),
('fd375515-b69f-440a-98e1-68eb3db7f872',	'University Of Illinois Willard Airport Champaign-urbana Savoy',	'CMI',	'Il',	'United States'),
('74fd2084-912f-4d8c-8d83-27739c590085',	'Mohammed V International Airport Casablanca',	'CMN',	'Nouasseur',	'Morocco'),
('07883049-077f-4823-b635-b2ae134fc980',	'Houghton County Memorial Airport Calumet Michigan',	'CMX',	'Mi',	'United States'),
('fa6a9ea9-45e3-4717-b0d5-1bc5ce0732d4',	'Aeroporto Internacional Tancredo Neves - Confins Neves/confins Belo Horizonte Minas Gerais',	'CNF',	'Mg',	'Brazil'),
('813dd220-883b-4eb0-98c0-ffd50268804c',	'Base Aérienne 709 Cognac-châteaubernard Cognac',	'CNG',	'Châteaubernard',	'France'),
('dd212388-9697-4b60-a39c-6b152b9e48ef',	'Sân Bay Cà Mau Ca',	'CAH',	'Airport',	'Vietnam'),
('dd14a49f-f3b6-41cd-96a7-d035dd43e1d3',	'Cairo International',	'CAI',	'Airport',	'Egypt'),
('e963b38d-e81e-412e-a485-b59d733cf5ac',	'Akron–canton Airport Akron Canton Ohio',	'CAK',	'Oh',	'United States'),
('25d9ede0-add4-482c-bcc4-2c31fb610219',	'Guangzhou Baiyun International Airport Canton',	'CAN',	'Guangdong',	'China'),
('c606c370-6824-4ffd-b894-017eeea795e0',	'Aeropuerto Internacional Jorge Wilstermann',	'CBB',	'Cochabamba',	'Bolivia'),
('2ae3cecc-bf57-47a3-80bd-bd20f4a15ff0',	'Cambridge Airport Teversham',	'CBG',	'England',	'United Kingdom'),
('cf439460-1f02-4c1d-8a61-b39c423313ea',	'Margaret Ekpo International Airport',	'CBQ',	'Calabar',	'Nigeria'),
('c5a2ed36-dcb7-4b32-a798-ca7c73e1106f',	'Canberra International Airport Queanbeyan Australian Capital Territory',	'CBR',	'Act',	'Australia'),
('e6222f6c-20d7-461c-84ec-2c4b09e2b278',	'Aéroport De',	'CCF',	'Carcassonne',	'France'),
('a5841e20-273e-4e41-be52-aabba787ffa6',	'Calicut International Airport Karipur Kozhikode Kerala',	'CCJ',	'Kl',	'India'),
('b02c74bb-8cd0-4118-a06b-20f51b1e2e39',	'Cocos (keeling) Islands Airport West',	'CCK',	'Island',	'Australia'),
('2f90fef4-204f-44d6-a7e2-efec81ebaa9d',	'Aeropuerto Carriel Sur International Airport',	'CCP',	'Concepción',	'Chile'),
('33cedc9c-5d04-4d5d-bd39-9267e54205f9',	'Netaji Subhas Chandra Bose International Airport Kolkata Calcutta West Bengal',	'CCU',	'Wb',	'India'),
('f82e3ad2-51ac-4b5d-9ee3-cce71784e795',	'Cedar City Regional Airport Utah',	'CDC',	'Ut',	'United States'),
('29d969d2-bd3e-40ce-8afe-d5f48ce6b7d1',	'Maes Awyr Caerdydd Cardiff',	'CDF',	'Wales',	'United Kingdom'),
('01e40ac6-e402-45ee-98b9-b63e768b615b',	'Aéroport De Paris-charles-de-gaulle Charles Gaulle Airport',	'CDG',	'Paris',	'France'),
('e35b5745-b5c3-43ac-b077-24157d72783d',	'Paliparang Pandaigdig Ng Mactan–cebu International Airport Cebu Lapu-lapu',	'CEB',	'City',	'Philippines'),
('c7ce2525-265a-4692-adcb-fd4223e54be6',	'Chelyabinsk',	'CEK',	'Airport',	'Russia'),
('e9703930-bb06-4da4-97e2-e6d8315bd58a',	'Aeroporto Internacional De Cabo Frio Rio Janeiro',	'CFB',	'Rj',	'Brazil'),
('7870d9aa-90a5-4f0f-a12e-739be0772f56',	'Coulter Field Bryan Texas',	'CFD',	'Tx',	'United States'),
('9e3b59bf-a35b-4820-b17b-6e3f3c3c9827',	'Aerfort Dhún Na Ngall Carrickfinn',	'CFN',	'Donegal',	'Ireland'),
('480578ed-32af-4f8b-8b33-f50b3354aa22',	'Aeroporto De São Paulo/congonhas Congonhas Airport Paulo Sao',	'CGH',	'Sp',	'Brazil'),
('9d4d17ab-43b4-4e88-8bf0-9c51f2dda1c2',	'Bandar Udara Internasional Soekarno–hatta International Airport Jakarta Tangerang',	'CGK',	'Banten',	'Indonesia'),
('4daeea2a-3ada-440c-af66-5ce41fc13585',	'Flughafen Köln/bonn Cologne',	'CGN',	'Bonn',	'Germany'),
('3f5b62a8-6a8d-42ff-8595-044b082db71d',	'Zhengzhou Xinzheng International Airport',	'CGO',	'Henan',	'China'),
('c6e0ca47-9091-431b-873e-70c0411a230f',	'Shah Amanat International Airport Chittagong',	'CGP',	'Patenga',	'Bangladesh'),
('b212e3ed-9278-420b-8395-9c85a6d6a8b7',	'Aeroporto Internacional De Campo Grande Mato Grosso Do Sul',	'CGR',	'Ms',	'Brazil'),
('ea933eee-2686-4da3-8d4a-e7cd603015ab',	'Chattanooga Metropolitan Airport Tennessee',	'CHA',	'Tn',	'United States'),
('f0c53678-9a57-4251-964e-2e085ec54ecc',	'Christchurch International Airport',	'CHC',	'Harewood',	'New Zealand'),
('fd93b5de-daa9-4ca4-b1c1-cfeafdac22c4',	'Aeropuerto Teniente Fap Jaime Montreuil Morales Airport Chimbote',	'CHM',	'Ancash',	'Peru'),
('45f4a237-d66d-4043-95a4-eee04e800f5f',	'Charlottesville–albemarle Airport Charlottesville Virginia',	'CHO',	'Va',	'United States'),
('f2c46db2-de97-4dcf-8072-043b5a7d39ab',	'Aéroport De Châteauroux-centre',	'CHR',	'Châteauroux',	'France'),
('aaca6605-1517-40b6-9169-084041a76def',	'Sân Bay Quốc Tế Đà Nẵng Da',	'DAD',	'Nang',	'Vietnam'),
('9210347e-55fd-4be6-b34f-253b804aee91',	'Dallas Love Field Fort Worth Texas',	'DAL',	'Tx',	'United States'),
('25526d8c-1c0d-4491-b57b-3637da83ef81',	'Damascus International',	'DAM',	'Airport',	'Syria'),
('2e253f43-cdae-45df-bd04-ed8adbb6e3d1',	'Julius Nyerere International Airport Es',	'DAR',	'Salaam',	'Tanzania'),
('f1e9fa70-e751-4ca8-8b0c-f6094606e71f',	'James M. Cox Dayton International Airport Ohio',	'DAY',	'Oh',	'United States'),
('c6fc999a-87e3-4a84-877f-4a0708f00a25',	'Dubuque Regional Airport Iowa',	'DBQ',	'Ia',	'United States'),
('fa1f9027-cdfc-41e4-b65e-f763b0b94a4a',	'Zračna Luka Dubrovnik/čilipi Dubrovnik',	'DBV',	'Čilipi',	'Croatia'),
('614829cf-7d74-4f5a-a096-87798d3d88a3',	'Ronald Reagan Washington National Airport D.c. Arlington County Virginia',	'DCA',	'Va',	'United States'),
('4336064a-13d3-46af-bb77-7160ec8a7ed1',	'Debreceni Nemzetközi Repülőtér',	'DEB',	'Debrecen',	'Hungary'),
('46274e11-28b7-4c5a-9c51-f9d79707577f',	'Jolly Grant International Airport Dehradun Uttarakhand',	'DED',	'Uk',	'India'),
('836c2dda-eb91-4d69-adb4-6d1079dc9563',	'Indira Gandhi International Airport New Delhi',	'DEL',	'Dl',	'India'),
('8cd3ed52-9dc4-4513-9d3f-3ee0e846d56d',	'Denver International Airport Colorado',	'DEN',	'Co',	'United States'),
('ff76f68d-95b0-4948-bf88-d15041ad8664',	'Coleman A. Young International Airport Detroit Michigan',	'DET',	'Mi',	'United States'),
('85b63f7b-7564-49e2-bc27-d8de850e0cdb',	'Dallas/fort Worth International Airport Dallas–fort Fort Texas',	'DFW',	'Tx',	'United States'),
('254861cc-195d-4812-8b46-8170b513f294',	'Sân Bay Điện Biên Phủ Dien Bien',	'DIN',	'Phu',	'Vietnam'),
('4fcb4e7c-7dd2-4e88-8689-ef50f561313b',	'Léopold Sédar Senghor International Airport Dakar',	'DKR',	'Yoff',	'Senegal'),
('9f3de968-226c-40ac-9bb7-7f11871a410b',	'Aéroport International De',	'DLA',	'Douala',	'Cameroon'),
('46400f3c-ae64-47c7-a135-c34abfe2e633',	'Dalian Zhoushuizi International Airport',	'DLC',	'Liaoning',	'China'),
('f1448f87-e113-44c2-b51d-10161143490e',	'Duluth International Airport Minnesota',	'DLH',	'Mn',	'United States'),
('ec7a1468-655e-4eed-8616-d3ed0fe9035c',	'Lien Khuong Airport Dalat Đức Trọng Lâm',	'DLI',	'Đồng',	'Vietnam'),
('b3c76a17-d415-4d55-9b7d-335fa9f1caf3',	'Dalaman',	'DLM',	'Havalimanı',	'Turkey'),
('45a44707-0388-4a25-8bb7-32d50b80f683',	'Domodedovo International Airport',	'DME',	'Moscow',	'Russia'),
('06174366-d930-46a3-a874-a5e31f3b3c97',	'Don Mueang International Airport',	'DMK',	'Bangkok',	'Thailand'),
('fe8e91c5-d8c8-4654-b18b-fd712684cb58',	'King Fahd International Airport Dammam Eastern',	'DMM',	'Province',	'Saudi Arabia'),
('69e64608-d3bc-4e45-821f-9c744a93825f',	'Port-adhair Dhùn Dèagh Dundee',	'DND',	'Scotland',	'United Kingdom'),
('c5052028-8e61-4a4b-a8a2-b0f0dcceddab',	'Cairns Airport Queensland',	'CNS',	'Qld',	'Australia'),
('c37d5732-897a-4a0d-8a89-834282faaa5e',	'Chiang Mai International Airport',	'CNX',	'Lamphun',	'Thailand'),
('a92adcb2-e576-43e3-ac65-4d3cbf825596',	'Cochin International Airport Kochi Kerala',	'COK',	'Kl',	'India'),
('a44683bb-6633-4eba-b7c3-8a834ba38680',	'Aéroport International De',	'COO',	'Cotonou',	'Benin'),
('cf52eead-2234-4398-842f-edde480b71d3',	'Aeropuerto Internacional De Córdoba Ingeniero Aeronáutico Ambrosio L.v. Taravella',	'COR',	'Cordoba',	'Argentina'),
('3f6293d7-3706-484d-9b61-4c918682b89d',	'Colorado Springs Airport',	'COS',	'Co',	'United States'),
('bee87ce2-0723-4221-8aa5-484fe77babcc',	'Københavns Lufthavn, Kastrup Copenhagen',	'CPH',	'Tårnby',	'Denmark'),
('400f56fe-ee27-4c31-b040-c3537cb9a835',	'Casper–natrona County International Airport Casper Natrona Wyoming',	'CPR',	'Wy',	'United States'),
('31b57146-803e-4787-8380-2e65b99de704',	'Cape Town International',	'CPT',	'Airport',	'South Africa'),
('b745bc8f-5bef-4e00-b08d-1169a29cc700',	'Aeroporto Presidente João Suassuna Airport Campina Grande Paraíba',	'CPV',	'Pb',	'Brazil'),
('a3d1c3da-1614-4dd3-9e92-440132e9a31f',	'Aeropuerto Central Ciudad Real',	'CQM',	'Puertollano',	'Spain'),
('001e9f32-8a78-450c-b456-6a8eefda9d36',	'Paliparang Pandaigdig Ng Clark International Airport Manila Mabalacat',	'CRK',	'City',	'Philippines'),
('52ec390b-4f5c-4691-8eae-ef8a7a9c66e7',	'Aéroport De Charleroi Bruxelles Sud Brussels South Airport',	'CRL',	'Gosselies',	'Belgium'),
('bb66df2c-2b58-43ea-ac28-ef6635e2c323',	'Corpus Christi International Airport Texas',	'CRP',	'Tx',	'United States'),
('45b7f6b4-db43-4ef9-b40d-ac0713779d9a',	'Yeager Airport Charleston West Virginia',	'CRW',	'Wv',	'United States'),
('7b9a8616-b2bf-4cd4-ab9e-3eee36c142ec',	'Aeroporto Di Catania-fontanarossa',	'CTA',	'Catania',	'Italy'),
('590e1847-0c7c-4b85-99d5-46bd95a3bfc6',	'New Chitose Airport',	'CTS',	'Sapporo',	'Japan'),
('98efafa2-bbf9-4060-90db-392dfbd48a67',	'Chengdu Shuangliu International Airport',	'CTU',	'Sichuan',	'China'),
('f243078e-56d1-47b3-b2bf-c368f05d9fc2',	'Aeropuerto Internacional Federal De Bachigualato International Airport Culiacán Navolato Sinaloa',	'CUL',	'Si',	'Mexico'),
('8dcf2685-de2e-4dbd-b60a-2ae57f148a7d',	'Aeropuerto Internacional De Cancún Quintana Roo',	'CUN',	'Qr',	'Mexico'),
('c0374254-cb72-4a27-bd36-d25fc2b40ec1',	'Hato Internationale Luchthaven Curaçao International Airport',	'CUR',	'Willemstad',	'Netherlands'),
('c7aee8c9-464e-415d-8352-cc767af95c70',	'Aeropuerto Internacional Alejandro Velasco Astete International Airport',	'CUZ',	'Cusco',	'Peru'),
('666acd9f-8b42-4cce-a4a3-21547bc617d1',	'Altiport De Courchevel French',	'CVF',	'Alps',	'France'),
('8d67c48f-82c7-4f33-adfc-4a9ee7e0cdb8',	'Cincinnati/northern Kentucky International Airport Hebron Ohio',	'CVG',	'Ky',	'United States'),
('e0bbb450-0941-4dbc-a4d8-0fa41977bb25',	'Aeródromo De Corvo Vila Do',	'CVU',	'Azores',	'Portugal'),
('f6b3e53a-c55b-4ffb-ac33-1f508267dcd0',	'Aeroporto Internacional De Curitiba - Afonso Pena International Airport São José Dos Pinhais Paraná',	'CWB',	'Pr',	'Brazil'),
('9e0806e6-79ab-4ab4-8699-1e424195b5ef',	'Maes Awyr Caerdydd Cardiff',	'CWL',	'Wales',	'United Kingdom'),
('c6128c6f-6407-4e2e-8286-b640fb2a9906',	'Sân Bay Quốc Tế Cam Ranh International Airport Khanh',	'CXR',	'Hoa',	'Vietnam'),
('e226c6af-bfe9-40ce-a40a-e5e95ed9abf0',	'Aeropuerto Internacional De Cozumel International Airport Quintana Roo',	'CZM',	'Qr',	'Mexico'),
('b6be7e77-ac1a-40b8-b9f3-d7e6ed101cb6',	'Aeroporto Internacional De Cruzeiro Do Sul International Airport Acre',	'CZS',	'Ac',	'Brazil'),
('7522cf65-d6ba-4df7-9c3d-a5ad5c98060b',	'Daytona Beach International Airport Florida',	'DAB',	'Fl',	'United States'),
('ee8c7b5d-15d7-4d47-851c-91279b735d35',	'Hazrat Shahjalal International Airport Dhaka',	'DAC',	'Kurmitola',	'Bangladesh'),
('064e4876-6b86-4d04-ab8a-8bfcf020ebb3',	'Enschede Vliegbasis',	'ENS',	'Twente',	'Netherlands'),
('3c458862-27b4-44ce-b58a-8954de46ca45',	'Akanu Ibiam International Airport',	'ENU',	'Enugu',	'Nigeria'),
('455cb2c4-6d08-4ed5-b6fb-950129c405d2',	'Aeropuerto Olaya Herrera Airport',	'EOH',	'Medellín',	'Colombia'),
('df696fc3-f7b2-4382-967a-496c56d51fa0',	'Erie International Airport Pennsylvania',	'ERI',	'Pa',	'United States'),
('a9130b86-9064-49c1-b98e-cb1a12571da9',	'Esenboğa Uluslararası Havalimanı Ankara',	'ESB',	'Esenboga',	'Turkey'),
('01a2b137-04b6-48a8-a1fe-408488792998',	'Eugene Airport Oregon',	'EUG',	'Or',	'United States'),
('1a28c1aa-449c-45ff-bb19-a50c33c43de8',	'F. D. Roosevelt Airport Sint Eustatius',	'EUX',	'Oranjestad',	'Netherlands'),
('dd19c55f-d493-4002-a398-5a4de113dfa3',	'Harstad-narvik Lufthavn, Evenes',	'EVE',	'Narvik',	'Norway'),
('40f95258-5138-464c-a46a-84ea2fb14640',	'Zvart''nots'' Mijazgayin Odanavakayan Yerevan',	'EVN',	'Zvartnots',	'Armenia'),
('400c4990-674e-46b6-960b-a9ae53baf0df',	'Liberty International Airport Newark New Jersey',	'EWR',	'Nj',	'United States'),
('5a87bf4e-9eac-4a5c-ae61-844e8dce96f9',	'Exeter International Airport Devon',	'EXT',	'England',	'United Kingdom'),
('71d583c4-8b59-4d53-a847-a7c6987b4d1e',	'Key West International Airport Florida',	'EYW',	'Fl',	'United States'),
('057fa126-7d4a-4f4b-a89a-dd3b3c328cbc',	'Aeropuerto Internacional Ministro Pistarini Buenos Aires',	'EZE',	'Ezeiza',	'Argentina'),
('f7ae5ee4-971b-4180-bd75-d9e724279d81',	'Vága Floghavn Vágar Airport Sørvágur Tórshavn Faroe',	'FAE',	'Islands',	'Denmark'),
('adfa9590-e574-4b9c-9252-1027e4688b31',	'Aeroporto Internacional De Faro',	'FAO',	'Algarve',	'Portugal'),
('92ea0134-31c0-452f-8304-98bfb53ade82',	'Hector International Airport Fargo Moorhead North Dakota',	'FAR',	'Nd',	'United States'),
('0396155f-9e9e-44aa-b485-e0f0fd6f0daf',	'Fresno Yosemite International Airport California',	'FAT',	'Ca',	'United States'),
('df059b75-c4be-4393-8742-1cb6ff1a4f76',	'Glacier Park International Airport Kalispell Flathead County Montana',	'FCA',	'Mt',	'United States'),
('2cb4ad50-7728-4254-be0c-0b6e2d6ad560',	'Fiumicino – Aeroporto Internazionale Leonardo Da Vinci',	'FCO',	'Rome',	'Italy'),
('cc33e83e-b91a-4358-ba45-c2e56a34eab1',	'Aéroport International Martinique Aimé Césaire Fort-de-france Le',	'FDF',	'Lamentin',	'France'),
('b0d7f8c0-3282-47b6-a5c9-248e34d5d9b4',	'Flughafen Friedrichshafen Lake',	'FDH',	'Constance',	'Germany'),
('dcacd36e-4a55-4a20-b896-8444b005935b',	'Fes–saïss Airport Fes',	'FEZ',	'Saiss',	'Morocco'),
('4987a6ac-c5eb-4995-bfd3-1489cac5dfc1',	'First Flight Airport Kill Devil Hills North Carolina',	'FFA',	'Nc',	'United States'),
('9c513fa7-0b82-4db8-a0a2-413cc1b342b3',	'Fair Isle Airport Shetland',	'FIE',	'Scotland',	'United Kingdom'),
('e9ee8999-ce81-4b8c-838e-34c1cf12dc62',	'N''djili International Airport Kinshasa Congo Democratic Republic',	'FIH',	'Of',	'The'),
('0547abea-693c-422a-8c76-c49ea6af1f42',	'Flughafen Karlsruhe/baden-baden Baden Airpark Rheinmünster',	'FKB',	'Karlsruhe',	'Germany'),
('cc20cfe9-edf0-4540-a3b4-d50668090996',	'Hamad International Airport',	'DOH',	'Doha',	'Qatar'),
('74c4565a-2a5a-4dda-ba11-5475edc7f242',	'Bandar Udara Internasional Ngurah Rai International Airport Denpasar Badung',	'DPS',	'Bali',	'Indonesia'),
('2d00e674-d546-45d2-9bed-37f15b345569',	'Durango–la Plata County Airport Durango Colorado',	'DRO',	'Co',	'United States'),
('bad10875-0b71-42a5-9a9a-267c32d3e847',	'Flughafen Dresden Airport',	'DRS',	'Saxony',	'Germany'),
('2d34b6ff-b08b-4aad-8a3d-ef74369b344a',	'Darwin International Airport Darwn Marrara Northern Territory',	'DRW',	'Nt',	'Australia'),
('d4e581e3-7861-4ce0-b5c3-69b7771845dd',	'Robin Hood Airport Doncaster Sheffield Finningley',	'DSA',	'England',	'United Kingdom'),
('dc624333-4688-4f47-9be9-bd46f35c529e',	'Destin Executive Airport Florida',	'DSI',	'Fl',	'United States'),
('ac15ec90-a24a-4c12-ba7c-00e848289423',	'Des Moines International Airport Iowa',	'DSM',	'Ia',	'United States'),
('c66630e4-b39e-437d-af6d-4eec9dbba922',	'Blaise Diagne International Airport Dakar',	'DSS',	'Ndiass',	'Senegal'),
('05f58536-6afe-4990-89d0-c9a35450d5d4',	'Flughafen',	'DTM',	'Dortmund',	'Germany'),
('b6ca1522-0d80-4185-a128-9d0c96a8d785',	'Shreveport Downtown Airport Louisiana',	'DTN',	'La',	'United States'),
('7041a473-bba2-42cc-b4d3-b7f0380e9268',	'Detroit Metropolitan Wayne County Airport Michigan',	'DTW',	'Mi',	'United States'),
('a43f2d95-bb6d-4395-a7fd-3e3036d488d0',	'Aerfort Bhaile Átha Cliath Dublin',	'DUB',	'Collinstown',	'Ireland'),
('17ce298d-d7dc-4028-987e-26fc8cfe8d15',	'Dunedin International Airport',	'DUD',	'Momona',	'New Zealand'),
('307c33e6-87c0-4352-9afa-c53d078e9f28',	'Flughafen Düsseldorf',	'DUS',	'Dusseldorf',	'Germany'),
('0e2b0eae-79ea-41c3-9a78-7b0d1ed90864',	'Al Maktoum International Airport Dubai Jebel',	'DWC',	'Ali',	'United Arab Emirates'),
('9eea1646-fe09-44e4-807e-c42ec763333b',	'Dubai International Airport Al',	'DXB',	'Garhoud',	'United Arab Emirates'),
('cfe756f8-6867-4f2f-807e-97bbd59c6692',	'Danbury Municipal Airport Connecticut',	'DXR',	'Ct',	'United States'),
('ae82f41d-795b-4fce-bef4-ee2772fa4d4e',	'Dushanbe International',	'DYU',	'Airport',	'Tajikistan'),
('928a6290-d8c8-4f73-a337-f0ed35c53ba9',	'Aéroport De Dzaoudzi-pamandzi Dzaoudzi Pamandzi',	'DZA',	'Mayotte',	'France'),
('61fdf349-8790-4cad-9ba1-e54855c43d25',	'Aeropuerto De San Sebastián',	'EAS',	'Hondarribia',	'Spain'),
('b6b09e50-7925-4d0e-a017-9882273fa302',	'Pangborn Memorial Airport Wenatchee Washington',	'EAT',	'Wa',	'United States'),
('8c0ea5d7-fc27-4237-a61f-c1911d4661fb',	'Entebbe International Airport',	'EBB',	'Kampala',	'Uganda'),
('36f4e87a-bf7d-4d22-bf32-20a59911a08f',	'Erbil International',	'EBL',	'Airport',	'Iraq'),
('b1b93783-c578-4319-9f6c-ac626cb38769',	'Northwest Florida Beaches International Airport Panama City',	'ECP',	'Fl',	'United States'),
('2101300c-9e3f-4743-b64f-cf6825c9cde5',	'Port-adhair Dhùn Èideann Edinburgh',	'EDI',	'Scotland',	'United Kingdom'),
('d7506bf0-6635-4365-a64d-16cb9690ec75',	'Aéroport De Bergerac Dordogne',	'EGC',	'Périgord',	'France'),
('da4e48b3-8000-415c-8255-7ab178f790ff',	'Eagle County Regional Airport Gypsum Colorado',	'EGE',	'Co',	'United States'),
('b58cedcf-83fd-4ca7-8182-7b3a2226ab54',	'Vliegbasis',	'EIN',	'Eindhoven',	'Netherlands'),
('ecc444b4-6307-4f3a-b63d-389317db74d6',	'El Paso International Airport Texas',	'ELP',	'Tx',	'United States'),
('0f1e9cec-a499-4bae-b90d-b93d6cfeed31',	'Enniskillen St. Angelo Airport Northern',	'ENK',	'Ireland',	'United Kingdom'),
('852065ca-87e2-44a5-8bef-406e1eea044d',	'Douglas–charles Airport Melville Hall Marigot',	'DOM',	'Roseau',	'Dominica'),
('4f048b5b-7286-4aa5-985b-86c8e7ef3d9b',	'Owen Roberts International Airport George Town Grand Cayman England',	'GCM',	'Islands',	'United Kingdom'),
('7f50de26-bf45-4ba7-bf15-ed900d308a37',	'Grand Canyon West Airport Peach Springs Arizona',	'GCW',	'Az',	'United States'),
('b284c303-8db5-41ff-8f17-d8c90bcf2229',	'Aeropuerto Internacional De Guadalajara Jalisco',	'GDL',	'Jal',	'Mexico'),
('53290c3e-4e9d-480d-9d94-4cfd8b508bd3',	'Port Lotniczy Gdańsk Im. Lecha',	'GDN',	'Wałęsy',	'Poland'),
('1473109f-5030-4df9-a89d-fb53672ff088',	'Aeroporto De Angra Dos Reis - Carmelo Jordão Airport Rio Janeiro',	'GDR',	'Rj',	'Brazil'),
('a32888bc-473f-4120-94cf-c1b69a9786f5',	'Spokane International Airport Washington',	'GEG',	'Wa',	'United States'),
('96117a0f-3236-4b46-a864-f2e55f055d02',	'Cheddi Jagan International Airport Georgetown',	'GEO',	'Timehri',	'Guyana'),
('70925205-85b5-42e3-a707-8000011ab80a',	'East Texas Regional Airport Gregg County',	'GGG',	'Tx',	'United States'),
('73f8e098-6fb9-4f1b-b825-7ff3d6332362',	'Exuma International Airport Great Moss',	'GGT',	'Town',	'Bahamas'),
('8cffa8dd-abc0-4e52-9516-8c2c487b4008',	'Gibraltar International',	'GIB',	'Airport',	'United Kingdom'),
('3cc82cf2-daaf-4784-b69c-df60c9b5537d',	'King Abdullah Bin Abdulaziz Airport Jizan Gizan',	'GIZ',	'Province',	'Saudi Arabia'),
('1146bee8-d03e-4236-8e0c-14f3af920aa2',	'Grand Junction Regional Airport Colorado',	'GJT',	'Co',	'United States'),
('f01671e7-d9c7-4c88-b1c9-90c7d62c9ed0',	'Port-adhair Eadar-nàiseanta Ghlaschu Glasgow',	'GLA',	'Scotland',	'United Kingdom'),
('51cad877-8c70-4cc4-9f43-79cc207049c5',	'Gloucestershire Airport Gloucester Staverton',	'GLO',	'England',	'United Kingdom'),
('1c1a385f-8f3f-40f2-b7e8-7eef93af14e9',	'Gelephu',	'GLU',	'Airport',	'Bhutan'),
('06de9d22-7f73-4a5d-86d1-b53553398cbb',	'Gimpo International Airport Seoul Gangseo District',	'GMP',	'Korea',	'South'),
('5ea2a447-aac7-41da-99ce-893ae00ef1dd',	'Greenville Downtown Airport South Carolina',	'GMU',	'Sc',	'United States'),
('583f4632-6e23-4e01-87a6-253abf6d521e',	'Aeropuerto De La Gomera Playa Santiago Canary',	'GMZ',	'Islands',	'Spain'),
('dd23f033-0843-488d-bf9b-6a940a171786',	'Maurice Bishop International Airport St. George’s Point',	'GND',	'Salines',	'Grenada'),
('ae82a1cf-72ed-4e5d-8bc9-335a1a4bc483',	'Gainesville Regional Airport Florida',	'GNV',	'Fl',	'United States'),
('181e66d2-78d7-4162-9c0f-5ba204346504',	'Aeroporto Di Genova Cristoforo Colombo Airport',	'GOA',	'Genoa',	'Italy'),
('4f5f58fd-76b9-4af1-8149-7e223407d2f5',	'Nuuk Lufthavn',	'GOH',	'Greenland',	'Denmark'),
('754d5165-9d87-4898-94d8-0995927e8c78',	'Goa International Airport Dabolim',	'GOI',	'Ga',	'India'),
('05503413-a7ab-4de2-81ed-1325fe50f3f5',	'Strigino Nizhny Novgorod International Airport',	'GOJ',	'Gorky',	'Russia'),
('5f09f4f0-3cf6-455d-9237-008d42122b9b',	'Golmud Airport',	'GOQ',	'Qinghai',	'China'),
('344be191-e24e-418d-b402-35716d10e32e',	'Göteborg Landvetter Airport',	'GOT',	'Gothenburg',	'Sweden'),
('0fc91695-0d35-4866-bd60-87edaac256e7',	'Ilulissat Lufthavn Disko Bay',	'JAV',	'Greenland',	'Denmark'),
('270781d6-3da2-40b2-bc33-63f9a61a05c0',	'Flagstaff Pulliam Airport Arizona',	'FLG',	'Az',	'United States'),
('7ca3ec27-2f0f-4aec-a3f4-a27193231ade',	'Aeroporto Internacional De Florianópolis–hercílio Luz Hercílio Florianópolis Florianopolis Santa Catarina',	'FLN',	'Sc',	'Brazil'),
('28aeb9b5-e734-4fa9-a0b3-4577e58bc182',	'Aeroporto Di Firenze-peretola Florence Peretola',	'FLR',	'Tuscany',	'Italy'),
('e3cf726e-cc71-4b7a-9884-404e6f2b0f45',	'Aeroporto Das Flores Santa Cruz',	'FLW',	'Azores',	'Portugal'),
('845099c0-9752-4844-b899-f01e12b87516',	'Allgäu-airport',	'FMM',	'Memmingen',	'Germany'),
('94be629f-e653-4470-a7e5-f041d0743efc',	'Four Corners Regional Airport Farmington New Mexico',	'FMN',	'Nm',	'United States'),
('14d254df-2fa7-4097-99b1-b00e3c416db2',	'Flughafen Münster/osnabrück Münster Osnabrück',	'FMO',	'Nrw',	'Germany'),
('f0cff4ef-6ccb-46b0-babb-6060b5e02506',	'Lungi International Airport Freetown',	'FNA',	'Sierra',	'Leone'),
('b520fdd8-266a-4833-96a5-bef9d9dfaeb1',	'Aeroporto Da Madeira Cristiano Ronaldo International Airport Funchal Santa Catarina Região',	'FNC',	'Autónoma',	'Portugal'),
('6376b4f1-44e6-4a51-8cde-2d49da5f7c84',	'Pyongyang International Airport',	'FNJ',	'North',	'Korea'),
('efde168d-2e4f-482c-aa1a-122c076ed9c5',	'Bishop International Airport Flint Michigan',	'FNT',	'Mi',	'United States'),
('f2beaf46-c01a-456f-a67f-5f61b0f33796',	'Fuzhou Changle International Airport',	'FOC',	'Zhanggang',	'China'),
('8d3cb0ab-782d-4254-bb0d-6460d2accd21',	'Fort Dodge Regional Airport Iowa',	'FOD',	'Ia',	'United States'),
('6524b2a0-2722-4ced-bd40-9e6b507aeba4',	'Aeroporto Internacional Pinto Martins International Airport Fortaleza Ceará',	'FOR',	'Ce',	'Brazil'),
('5467395c-dbee-463e-806a-b5a07eed40e8',	'Grand Bahama International Airport',	'FPO',	'Freeport',	'Bahamas'),
('ca18e4a8-738b-46f1-9ea2-94a56cb85b49',	'Flughafen Frankfurt Am',	'FRA',	'Main',	'Germany'),
('50c2e4de-70ba-4fe5-861a-c474a13098c8',	'Aeropuerto Internacional Mundo Maya International Airport',	'FRS',	'Flores',	'Guatemala'),
('ee8697ad-ccff-402a-83ae-c551380bd894',	'Manas International Airport',	'FRU',	'Bishkek',	'Kyrgyzstan'),
('2e238cc1-dfc3-4732-864c-e3e4ab67b384',	'Aéroport Figari-sud Corse Porto-vecchio',	'FSC',	'Figari',	'France'),
('9770266f-f91d-4d02-9887-b7a117d774db',	'Sioux Falls Regional Airport South Dakota',	'FSD',	'Sd',	'United States'),
('069ad88a-d139-486f-a107-0c2009dbd2e7',	'Aéroport De Saint-pierre Saint-pierre, Saint Pierre And',	'FSP',	'Miquelon',	'France'),
('b105fb06-0697-461c-88c9-f7d4dbc9c769',	'Shizuoka Airport',	'FSZ',	'Makinohara',	'Japan'),
('abf17dbf-739b-40b8-8605-b93d0b3ff1e7',	'Aeropuerto De Fuerteventura El Matorral Canary',	'FUE',	'Islands',	'Spain'),
('1e582c8f-9f88-417e-a85d-f3b64368e8f9',	'Fukuoka',	'FUK',	'Airport',	'Japan'),
('b3d8d377-0678-4fdb-b51f-60b984ca5ec2',	'Funafuti International',	'FUN',	'Airport',	'Tuvalu'),
('da4d1e3e-d0d3-45c9-b653-336da9fb504e',	'Fort Wayne International Airport Indiana',	'FWA',	'In',	'United States'),
('7fab463c-15e3-4a58-b099-12c77f18a860',	'Montgomery County Airpark Gaithersburg Maryland',	'GAI',	'Md',	'United States'),
('365b67ef-f121-4483-b484-fc95a90568cf',	'International Airport Addu',	'GAN',	'Atoll',	'Maldives'),
('d4f44f89-0e45-43cd-a410-47844a22393b',	'Lokpriya Gopinath Bordoloi International Airport Guwahati Gowhatty Assam',	'GAU',	'As',	'India'),
('e4b77956-1e61-4c23-a8b9-9a460983f1a6',	'Sir Seretse Khama International Airport',	'GBE',	'Gaborone',	'Botswana'),
('35471b77-a840-44af-84ff-32c158a3cce0',	'Northeast Wyoming Regional Airport Gillette',	'GCC',	'Wy',	'United States'),
('b6945de3-b63b-4aeb-939f-16dce86f20de',	'Guernsey Airport Forest Channel',	'GCI',	'Islands',	'United Kingdom'),
('4f50c079-9a32-415b-b362-304e9a5d575b',	'Helsinki-vantaan Lentoasema Helsinki',	'HEL',	'Vantaa',	'Finland'),
('a1fd2d3a-bae0-4cf4-9bd5-208fb074164e',	'Heraklion International Airport, Nikos Kazantzakis',	'HER',	'Crete',	'Greece'),
('7ed4f25d-40d6-4e4c-967d-bd8118d2c8c3',	'Hammerfest',	'HFT',	'Lufthavn',	'Norway'),
('7f1924cd-0e87-462c-8c08-3e6f2950f88f',	'Hargeisa Egal International',	'HGA',	'Airport',	'Somalia'),
('40984f1a-46b9-4c5f-b461-62790dfbdc0d',	'Hangzhou Xiaoshan International Airport Zhejiang',	'HGH',	'District',	'China'),
('654a6f7d-0c3f-49f6-9c22-266f0689b292',	'Flughafen Helgoland-düne',	'HGL',	'Heligoland',	'Germany'),
('1374111a-e0ed-483e-b057-5290f8ae3168',	'Hilton Head Airport Island South Carolina',	'HHH',	'Sc',	'United States'),
('1b24e847-de15-4d2d-90f4-c275e9234766',	'Flughafen Frankfurt-hahn Frankfurt–hahn Airport Kirchberg',	'HHN',	'Rhineland-palatinate',	'Germany'),
('01187096-274c-4b3b-8969-a0ce3282e81c',	'Honiara International Airport Guadalcanal',	'HIR',	'Solomon',	'Islands'),
('0f75ccc4-6f9e-41f4-897e-59e1446d6c9f',	'Hakodate Airport',	'HKD',	'Hokkaido',	'Japan'),
('391c355a-3cb9-475c-81ec-54cdb81909f1',	'Hong Kong International Airport Chek Lap',	'HKG',	'Kok',	'China'),
('15b68b1a-5c8e-4596-8bb7-76f9e8455b44',	'Phuket International',	'HKT',	'Airport',	'Thailand'),
('996416f9-97df-4a5e-b2ef-758cb67069e7',	'Bandar Udara Halim Perdanakusuma Jakarta',	'HLP',	'East',	'Indonesia'),
('ce89029e-26c2-405c-9e06-b4498845b1a3',	'Aeropuerto Internacional General Ignacio Pesqueira García International Airport Hermosillo Sonora',	'HMO',	'So',	'Mexico'),
('2f7d4725-723a-410c-aceb-e18cc30ce29e',	'Tokyo International',	'HND',	'Airport',	'Japan'),
('a8d16839-e6ab-41df-baed-76603d34408f',	'Daniel K. Inouye International Airport Honolulu Oahu Hawaii',	'HNL',	'Hi',	'United States'),
('ed8d9b6b-e44b-4a97-8857-79ad34645ff4',	'Hana Airport Hawaii',	'HNM',	'Hi',	'United States'),
('6dc0a20e-4617-4b0e-9297-aa8b3a48bedc',	'Lea County Regional Airport Hobbes New Mexico',	'HOB',	'Nm',	'United States'),
('497aad4d-be1f-4c68-82a8-08d4df883efa',	'Al-ahsa International Airport Hofuf Eastern',	'HOF',	'Province',	'Saudi Arabia'),
('b4a3ce68-ca04-4a39-8251-9974a950937c',	'Frank País Airport Holguín',	'HOG',	'Holguin',	'Cuba'),
('5e9945ee-de1a-4d48-afd1-b01b953202d1',	'Aeroporto Internacional Da Horta Castelo Branco',	'HOR',	'Azores',	'Portugal'),
('32d2ee4b-98d3-40e8-86f2-f372b713131e',	'Memorial Field Airport Springs Arkansas',	'HOT',	'Ar',	'United States'),
('750844f9-fb28-46f6-998d-e5f73f15f5cb',	'William P. Hobby Airport Houston Texas',	'HOU',	'Tx',	'United States'),
('c43b3baa-efb9-4811-9295-9f7aa5eb465b',	'Ørsta–volda Lufthavn, Hovden Ørsta',	'HOV',	'Volda',	'Norway'),
('56483d94-f735-42c9-b2a1-5eb987a9b9e4',	'Sân Bay Quốc Tế Cát Bi Cat Hai',	'HPH',	'Phong',	'Vietnam'),
('30cfd8b5-5ecf-4dd3-a27d-5e323a5075e5',	'Westchester County Airport White Plains New York',	'HPN',	'Ny',	'United States'),
('ff0be37c-49cb-4508-934e-9a47741f3095',	'Seymour Airport Baltra Galápagos',	'GPS',	'Islands',	'Ecuador'),
('d4c0e76a-126f-45c6-bb54-187cb0aea77c',	'Austin Straubel International Airport Green Bay Wisconsin',	'GRB',	'Wi',	'United States'),
('84cd3202-89c7-4708-b9cc-f9f083a2e257',	'Killeen–fort Hood Regional Airport Killeen Fort Texas',	'GRK',	'Tx',	'United States'),
('f64a9c80-a801-498e-9f2f-73c0fd02322f',	'Aeropuerto De Girona-costa Brava Girona',	'GRO',	'Costa',	'Spain'),
('1aa5e47a-c4f0-4766-a434-dbfb946e677e',	'Gerald R. Ford International Airport Grand Rapids Michigan',	'GRR',	'Mi',	'United States'),
('c5a43268-9dcf-4590-9d70-308e11db0038',	'Aeroporto Internacional Guarulhos–governador André Franco Montoro International Airport São Paulo Sao',	'GRU',	'Sp',	'Brazil'),
('74025922-1504-4846-84e5-367cc9757180',	'Aeroporto De Graciosa Santa Cruz',	'GRW',	'Azores',	'Portugal'),
('800a0bf8-8f7c-4fae-86e4-78b51057dcc9',	'Aeropuerto Federico García Lorca Granada-jaén Airport Granada',	'GRX',	'Jaén',	'Spain'),
('8639baa8-771b-401b-8387-18da36b04a5a',	'Flughafen',	'GRZ',	'Graz',	'Austria'),
('e76a8fd4-729d-4c49-a4c1-2014c208d2a8',	'Piedmont Triad International Airport Greensboro North Carolina',	'GSO',	'Nc',	'United States'),
('bbc98a92-19f3-4c90-bcc0-6c526768faa2',	'Greenville–spartanburg International Airport Greenville Spartanburg South Carolina',	'GSP',	'Sc',	'United States'),
('2c307e11-c79a-4c21-989d-23f5fbdcd043',	'Gustavus Airport Alaska',	'GST',	'Ak',	'United States'),
('84ed04f2-4473-4a58-8ea2-7c2801f11e92',	'Golden Triangle Regional Airport Columbus Starkville Mississippi',	'GTR',	'Ms',	'United States'),
('c981dd6b-9cb5-4b13-848e-3c4f4fe5c5e0',	'Aeropuerto Internacional La Aurora International Airport',	'GUA',	'Guatemala',	'City'),
('50d41c0a-ac5e-434a-a391-ba6f6a3d3f16',	'Gunnison–crested Butte Regional Airport Gunnison Colorado',	'GUC',	'Co',	'United States'),
('28786c9c-92d0-40d8-bd0f-acbf9f971ed6',	'Antonio B. Won Pat International Airport Barrigada And Tamuning',	'GUM',	'Guam',	'United States'),
('31ce2008-76c4-4c4f-961b-b0d2f445f9d6',	'Gurney Airport',	'GUR',	'Alotau',	'Papua New Guinea'),
('79bf6d57-63c2-40a3-af1e-a74d9669e2f4',	'Atma Atyrau',	'GUW',	'Airport',	'Kazakhstan'),
('7d8a5e85-dee3-4f14-9e7a-d909c7f72344',	'Aéroport International De Genève Geneva',	'GVA',	'Meyrin',	'Switzerland'),
('58c29b04-fbd7-4bab-b03a-d773f3fd808b',	'Galway Airport',	'GWY',	'Carnmore',	'Ireland'),
('3e036bd7-be3f-4a38-960f-bc160a1056c4',	'Heydar Aliyev International Airport',	'GYD',	'Baku',	'Azerbaijan'),
('c948cd1a-aff6-4eb6-949f-fc68abd317f2',	'Aeroporto Internacional Santa Genoveva International Airport Goiânia Goiania Goiás',	'GYN',	'Go',	'Brazil'),
('f3fc4884-7c73-4b1d-829f-b59781c10472',	'Yasser Arafat International Airport',	'GZA',	'Gaza',	'Palestine'),
('9785e87a-6e4d-424c-8bb2-09db1a77c43f',	'Prince Said Ibrahim International Airport Moroni',	'HAH',	'Hahaya',	'Comoros'),
('671ac485-3522-4e54-bc04-96798e23ccd3',	'Flughafen Hannover-langenhagen Hannover',	'HAJ',	'Langenhagen',	'Germany'),
('bb7562bc-83c7-499f-a2e6-f4b84bd2a704',	'Haikou Meilan International Airport',	'HAK',	'Hainan',	'China'),
('e18d2239-a320-4cd4-9e1e-7e9e2a319802',	'Flughafen Hamburg Helmut',	'HAM',	'Schmidt',	'Germany'),
('0c380023-7ecf-4e6e-82f0-792d1994ae9d',	'Nội Bài International Airport',	'HAN',	'Hanoi',	'Vietnam'),
('94757c68-8cd5-4206-ac79-608b5680badb',	'Hanimaadhoo International Airport Haa Dhaalu',	'HAQ',	'Atoll',	'Maldives'),
('0fc13bad-56d2-4950-9868-0d2cc3f1d26f',	'Aeropuerto José Martí International Airport',	'HAV',	'Havana',	'Cuba'),
('eecff2e2-0fed-4dd7-9690-d638f5118994',	'Hobart Airport Cambridge Tasmania',	'HBA',	'Tas',	'Australia'),
('82d56e2b-2775-4e91-88af-e606c1681f78',	'Hat Yai International',	'HDY',	'Airport',	'Thailand'),
('4039d8b8-af2e-4b0b-aa0d-a626dfcabc3d',	'Flughafen',	'INN',	'Innsbruck',	'Austria'),
('b6aad77d-ef38-4b7f-a3d5-50dd36c61a9b',	'Aeradróm Inis Oírr',	'INQ',	'Inisheer',	'Ireland'),
('db98fe6b-b4bf-48ef-b438-3633391e990f',	'Nauru International',	'INU',	'Airport',	'Yaren'),
('e8ba0a26-1463-4f09-a2fe-0b17292f21dc',	'Port-adhair Inbhir Nis Inverness Dalcross',	'INV',	'Scotland',	'United Kingdom'),
('a6d86a3a-6714-45c2-957a-bc08adacd494',	'Isle Of Man Airport',	'IOM',	'Ronaldsway',	'United Kingdom'),
('9717d899-03da-48d2-a4cf-79190de719e3',	'Aeradróm Inis Mór Inishmore',	'IOR',	'Kilronan',	'Ireland'),
('2d349f2f-0eaf-49bc-9db6-c8299a220578',	'Mataveri International Airport Easter Island Rapa',	'IPC',	'Nui',	'Chile'),
('cde30c53-11c3-424b-8ef6-6f783f57a1d1',	'Sultan Azlan Shah Airport',	'IPH',	'Ipoh',	'Malaysia'),
('df0b2b5f-70fd-470a-85eb-ec29834e426c',	'Aeroporto Da Usiminas Airport Ipatinga Santana Do Paraíso Minas Gerais',	'IPN',	'Mg',	'Brazil'),
('27edba36-7b99-4f59-b678-7acf2a1a8ac5',	'Aeropuerto Internacional Diego Aracena International Airport',	'IQQ',	'Iquique',	'Chile'),
('ef40c819-4a0b-4c09-a5fe-bce5b6655ec7',	'Aeropuerto Internacional Coronel Fap Francisco Secada Vignetta',	'IQT',	'Iquitos',	'Peru'),
('dc5a29ea-a569-41de-bf72-2685e2eb9886',	'St Mary’s Airport Isles Of Scilly Cornwall',	'ISC',	'England',	'United Kingdom'),
('bc84ca1a-2550-423c-9e85-10fced89df14',	'Istanbul Atatürk Havalimanı',	'ISL',	'Yeşilköy',	'Turkey'),
('50e98535-4fd7-4a34-8a96-49963f048295',	'Long Island Macarthur Airport Islip New York',	'ISP',	'Ny',	'United States'),
('e79ed5f7-4095-4777-8dc8-e24919dedd83',	'Istanbul',	'IST',	'Airport',	'Turkey'),
('19001900-7c99-49b5-a463-bec2e1d3d4c4',	'Osaka International Airport',	'ITM',	'Itami',	'Japan'),
('16d38726-659e-43d0-816e-02dc49112b0b',	'Hilo International Airport Hawaii',	'ITO',	'Hi',	'United States'),
('a9a73c4b-2927-4fcf-bf1d-77499cb175ae',	'Aeroporto Ernani Do Amaral Peixoto Itaperuna Airport Rio De Janeiro',	'ITP',	'Rj',	'United States'),
('8c4846ac-e73d-45fd-8cd1-87fcfc6e989c',	'Ivanovo Yuzhny',	'IWA',	'Airport',	'Russia'),
('ddad8a2e-cc1d-4cb7-b29c-808483497111',	'Agartala Airport Tripura',	'IXA',	'Tr',	'India'),
('4b2ad812-77f1-499b-861c-453b6ce05ba6',	'Bagdogra Airport Siliguri West Bengal',	'IXB',	'Wb',	'India'),
('d33522e6-75ec-4648-98e6-4ca978fa9b19',	'Chandigarh International Airport',	'IXC',	'Ch',	'India'),
('9295bbf1-cc5a-495d-b253-fb29d65e0979',	'Madurai Airport Tamil Nadu',	'IXM',	'Tn',	'India'),
('70e5f05a-d514-407f-bf22-4078c4766dd7',	'Veer Savarkar International Airport Port Blair Andaman And Nicobar Islands',	'IXZ',	'An',	'India'),
('fe0f7eaf-34a7-47e6-bb3f-344382a350e6',	'Jackson Hole Airport Teton County Wyoming',	'JAC',	'Wy',	'United States'),
('9a51783d-2cba-4888-a668-087af9b5cd67',	'Jaipur International Airport Rajasthan',	'JAI',	'Rj',	'India'),
('6b4caeeb-e7ca-457c-84f7-26d9917fae18',	'Aeropuerto Francisco Carlé Airport Jauja',	'JAU',	'Junín',	'Peru'),
('618f2e06-467a-43f0-9632-481ffd8915f1',	'Islamabad International Airport',	'ISB',	'Pb',	'Pakistan'),
('3e44ea94-fec9-4093-969b-7de2583a7d11',	'Harbin Taiping International',	'HRB',	'Airport',	'China'),
('013b9f89-4de8-4f94-8431-e8233d0927f2',	'Harare International',	'HRE',	'Airport',	'Zimbabwe'),
('a019c726-6027-4449-b470-2c06a2e030ed',	'Hurghada International',	'HRG',	'Airport',	'Egypt'),
('6c074bb3-2c58-42b4-b798-f21beb40238d',	'Mattala Rajapaksa International Airport',	'HRI',	'Hambantota',	'Sri Lanka'),
('bb7bf985-eabb-4ecd-a5e1-642aaf2a9620',	'Valley International Airport Harlingen Texas',	'HRL',	'Tx',	'United States'),
('88ee6bd4-162e-4163-9ff1-e2589ee3dd1f',	'Huntsville International Airport Alabama',	'HSV',	'Al',	'United States'),
('e2d80300-9e1f-4e01-bbe2-52adda5b04c0',	'Terre Haute International Airport Indiana',	'HUF',	'In',	'United States'),
('c4eabfe5-b335-411b-8a13-4100fc233016',	'Huahine – Fare Airport French',	'HUH',	'Polynesia',	'France'),
('a53759ba-a896-466b-b7d7-3487a139e6bd',	'Phu Bai International Airport',	'HUI',	'Huế',	'Vietnam'),
('ba01b1d0-3871-4dd2-9be5-f50dd945ccee',	'Aeropuerto Alférez Fap David Figueroa Fernandini Airport',	'HUU',	'Huánuco',	'Peru'),
('efdc9829-68a2-4cea-a090-383e5d88be63',	'Humberside Airport Kirmington North',	'HUY',	'Lincolnshire',	'United Kingdom'),
('27bb4d71-3a92-48f7-866a-133b89375073',	'Tweed-new Haven Regional Airport New Connecticut',	'HVN',	'Ct',	'United States'),
('7221cb35-c7fb-4b87-8bbe-a2b5f2fcb5bf',	'Barnstable Municipal Airport Cape Cod Hyannis Massachusetts',	'HYA',	'Ma',	'United States'),
('7ab11b45-576e-4c3c-a17c-70adeb653903',	'Rajiv Gandhi International Airport Hyderabad Telangana',	'HYD',	'Tg',	'India'),
('52cbd278-d165-43aa-a393-550ddf16fccb',	'Hanzhong Chenggu',	'HZG',	'Airport',	'China'),
('acac9eff-5ec1-4bdb-87c1-0906669a8ef6',	'Dulles International Airport Washington D.c. Virginia',	'IAD',	'Va',	'United States'),
('247c994f-1b3d-4ea5-83d5-ccccd2478b72',	'George Bush Intercontinental Airport Houston Texas',	'IAH',	'Tx',	'United States'),
('54aa4cef-fece-4962-8939-9640eccf3c6d',	'Aeroportul Internațional Iași Iasi International',	'IAS',	'Airport',	'Romania'),
('fbe79340-0370-4a92-b531-ef04a000ec77',	'Aeropuerto De Ibiza',	'IBZ',	'Formentera',	'Spain'),
('26ceff76-cba7-43a9-b828-15521ff48685',	'Incheon International Airport Seoul Jung District',	'ICN',	'Korea',	'South'),
('8e3dc6a2-a10c-46b0-9a67-cc6c7ebf5dfe',	'Dwight D. Eisenhower National Airport Wichita Kansas',	'ICT',	'Ks',	'United States'),
('0b72300d-24b7-401e-9fd6-0a63fc1af160',	'Idaho Falls Regional Airport Bonneville County',	'IDA',	'Id',	'United States'),
('e55cfc4a-ba2f-4cad-884b-d9b02522b2be',	'Devi Ahilyabai Holkar Airport Indore Madhya Pradesh',	'IDR',	'Mp',	'India'),
('0355b0b2-f15e-497a-ac22-0578a21b6b92',	'Kyiv International Airport Kiev',	'IEV',	'Zhuliany',	'Ukraine'),
('a021850c-03c9-42b2-8f52-38e7e6fed12b',	'Aeroporto Internacional De Foz Do Iguaçu/cataratas Iguaçu Paraná',	'IGU',	'Pr',	'Brazil'),
('14cbf1ba-e75e-46c8-8e88-f59ef07c1570',	'Wright Brothers Field Jezero',	'IGY',	'Crater',	'Mars'),
('c0bd5d6c-b779-4af1-ab46-3714448915f8',	'Aeradróm Inis Meáin',	'IIA',	'Inishmaan',	'Ireland'),
('bb1cee58-139a-4a2a-8ee2-a5ca36b4e26a',	'Tehran Imam Khomeini International Airport',	'IKA',	'Ahmadabad',	'Iran'),
('1b3cc33e-d020-4dea-96bd-bca2b3778937',	'Irkutsk International',	'IKT',	'Airport',	'Russia'),
('df52ee81-8af2-4f57-8181-94b36e155bea',	'Aeroport Lleida-alguaire Lleida',	'ILD',	'Alguaire',	'Spain'),
('75bf5f78-2841-4285-8645-382115a7c21c',	'Wilmington Airport Delaware',	'ILG',	'De',	'United States'),
('7a64ed32-edeb-47ed-bcbe-f60700a55f08',	'Indianapolis International Airport Indiana',	'IND',	'In',	'United States'),
('80d0574a-7dd2-43a1-b504-a3ad836a3f85',	'Kalibo International',	'KLO',	'Airport',	'Philippines'),
('e4c87388-6edd-4148-81e2-3c1fb94c8deb',	'Airport',	'KLU',	'Klagenfurt',	'Austria'),
('879c8d2c-13df-4036-9b8a-939d500e6d7c',	'Kunming Changshui International Airport Guandu',	'KMG',	'District',	'China'),
('b72ca361-6f0e-4771-8cfe-bf17e451628c',	'Bandar Udara Internasional Kualanamu International Airport Medan Deli',	'KNO',	'Serdang',	'Indonesia'),
('8f766d86-888a-4920-894a-53e70ef04fec',	'Kona International Airport Kailua-kona Kalaoa Hawaii',	'KOA',	'Hi',	'United States'),
('e2b032bf-a7a9-4c8d-a780-7e67017bca35',	'Bandar Udara Internasional El Tari International Airport',	'KOE',	'Kupang',	'Indonesia'),
('bf2bd352-5dda-4294-85f2-ef597086ff38',	'Kokshetau',	'KOV',	'Airport',	'Kazakhstan'),
('7e218930-cb7c-4510-9819-d614898c62a4',	'Kraków Airport Im. Jana Pawła Ii John Paul International',	'KRK',	'Balice',	'Poland'),
('f74f9827-3669-4efc-9d0e-904e3d829a64',	'Kiruna Flygplats',	'KRN',	'Norrbotten',	'Sweden'),
('a4fc330f-e33a-43f6-8080-039228bcbf92',	'Krasnodar International',	'KRR',	'Airport',	'Russia'),
('eb17efd4-702d-4a24-9ecd-639912d12c64',	'Kristiansand Lufthavn,',	'KRS',	'Kjevik',	'Norway'),
('9606d827-3c80-47fd-9c53-6c79644e42b9',	'Khartoum International',	'KRT',	'Airport',	'Sudan'),
('cededdb5-84ef-4754-a1d5-2311377f5823',	'Kosrae International',	'KSA',	'Airport',	'Micronesia'),
('a8cf1e28-1089-4a36-8212-1f57b16c83d8',	'Medzinárodné Letisko Košice Kosice International Airport',	'KSC',	'Barca',	'Slovakia'),
('5737065a-3934-400b-87ef-cd1dfdd51a22',	'Shahid Ashrafi Esfahani Airport',	'KSH',	'Kermanshah',	'Iran'),
('4675bb79-4868-443d-aea6-104a12b398e4',	'Kostanay International',	'KSN',	'Airport',	'Kazakhstan'),
('668a0fb5-ab1c-4732-b922-fb009c14e9a5',	'Techo International Airport Phnom Penh Kandal',	'KTI',	'Stueng',	'Cambodia'),
('7cd71007-8c0f-46e2-b817-175ae5192af9',	'Tribhuvan International Airport',	'KTM',	'Kathmandu',	'Nepal'),
('1ca9a412-32cf-4894-9ed4-8fa8c0429b60',	'Kittilän Lentoasema',	'KTT',	'Kittilä',	'Finland'),
('bb8df994-b488-4700-96a3-188435e9a821',	'Sultan Haji Ahmad Shah Airport',	'KUA',	'Kuantan',	'Malaysia'),
('7b78bcb2-d5ec-4ae8-92d6-70d7a4a424d4',	'Kushiro Airport',	'KUH',	'Hokkaido',	'Japan'),
('a8a2b580-ed5e-441a-896d-9a8862829621',	'Lapangan Terbang Antarabangsa Kuala Lumpur',	'KUL',	'Sepang',	'Malaysia'),
('dc8355c5-a0c9-4e29-9932-3f161829d39c',	'Kauno Tarptautinis Oro Uostas',	'KUN',	'Kaunas',	'Lithuania'),
('b0183389-6222-46b2-853f-9247a7230ea0',	'Kuopion Lentoasema Kuopio',	'KUO',	'Siilinjärvi',	'Finland'),
('3977ffb3-3f28-49fd-891a-8b3e3031059d',	'Guiyang Longdongbao International Airport Guizhou',	'KWE',	'Province',	'China'),
('3b0ab53d-ea75-4844-8e2e-f4533bee36a3',	'Kuwait International Airport',	'KWI',	'City',	'Farwaniya'),
('44f7432c-5afc-4118-8b71-eea97a4ef080',	'Kazan International Airport',	'KZN',	'Tatarstan',	'Russia'),
('4b8a3fa6-a962-45e5-90e7-ddfa9c6ccb68',	'Kyzylorda',	'KZO',	'Airport',	'Kazakhstan'),
('6490918b-362a-43cc-a770-5750fe2540fd',	'Aeroporto Internacional 4 De Fevereiro Quatro International Airport',	'LAD',	'Luanda',	'Angola'),
('51bedb91-2fd8-462a-82a2-b37e68aded7b',	'Aeroporto Francisco Álvares De Assis Airport Juiz Fora Serrinha Minas Gerais',	'JDF',	'Mg',	'Brazil'),
('ff8a8550-af5d-4b91-8adf-0728d2a5f73e',	'King Abdulaziz International Airport',	'JED',	'Jeddah',	'Saudi Arabia'),
('8976e15f-4ae5-442c-a68e-d5859721c917',	'Jersey Airport Saint Peter',	'JER',	'Channel',	'Islands'),
('950f23d9-f645-4c25-a6fb-d1fe28d623a3',	'Kapalua Airport Lahaina Hawaii',	'JHM',	'Hi',	'United States'),
('8c9639e4-3f3c-4685-bdbc-f201bf72b269',	'Aéroport International De Djibouti–ambouli Djibouti',	'JIB',	'City',	'Ambouli'),
('3bc64d69-371a-4874-8527-504b4564ed3d',	'Quanzhou Jinjiang International Airport',	'JJN',	'Fujian',	'China'),
('eb386a2e-445e-4c4b-bd71-dc4cd41d5647',	'Chios Island National Airport North',	'JKH',	'Aegean',	'Greece'),
('32564f4f-a8b3-41b0-9f24-8c33ce69be42',	'O. R. Tambo International Airport Johannesburg Kempton',	'JNB',	'Park',	'South Africa'),
('a7c3a092-49ac-4c79-9c3f-85b00f81c701',	'Bandar Udara Internasional Adisucipto International Airport Yogyakarta Central',	'JOG',	'Java',	'Indonesia'),
('94fd414c-4057-45ef-be65-5841c75c8dd3',	'Aeroporto De Joinville-lauro Carneiro Loyola Lauro Joinville Santa Catarina',	'JOI',	'Sc',	'Brazil'),
('58ca89da-6bf0-4d00-9ac4-711b734f29d5',	'Aeroporto Internacional Presidente Castro Pinto International Airport João Pessoa Bayeux Paraíba',	'JPA',	'Pb',	'Brazil'),
('42933d90-9767-4c83-af22-d97e1fa69aa2',	'Kilimanjaro International Airport Arusha Moshi Hai',	'JRO',	'District',	'Tanzania'),
('398fbd1a-e9fd-43a4-823b-1db4b60f028c',	'Skiathos Airport, Alexandros Papadiamantis',	'JSI',	'Thessaly',	'Greece'),
('d2aa7ff6-22bb-4cf5-846f-1e6a31e485ef',	'Juba International Airport',	'JUB',	'South',	'Sudan'),
('4a69001f-19cc-41b3-9c31-a467f383c7c5',	'Aeropuerto Internacional Inca Manco Cápac International Airport Juliaca',	'JUL',	'Puno',	'Peru'),
('24fa88bd-0e55-4160-8479-3b65b61da7fb',	'Mallam Aminu Kano International',	'KAN',	'Airport',	'Nigeria'),
('71ca48f2-df23-42b5-9848-19815a38d908',	'Hamid Karzai International Airport',	'KBL',	'Kabul',	'Afghanistan'),
('d5b118bc-f8cb-4875-bd36-d51f227dcbe5',	'Boryspil International Airport',	'KBP',	'Kiev',	'Ukraine'),
('321e8403-482b-4a1c-81b7-04772b99c32d',	'Lapangan Terbang Sultan Ismail Petra Airport Kota Bharu',	'KBR',	'Kelantan',	'Malaysia'),
('47d3bb6b-2e84-4275-9b6f-7c4465319d0b',	'Krabi International',	'KBV',	'Airport',	'Thailand'),
('12ff0e24-2761-4dcd-b43b-7ca01c95279f',	'Kuching International',	'KCH',	'Airport',	'Malaysia'),
('5e569164-e7f0-4c2f-a19d-b8072fc06a84',	'Keflavíkurflugvöllur Keflavík',	'KEF',	'Reykjavík',	'Iceland'),
('abb273c7-c88d-4099-9dbb-d8a245821243',	'Kerman International',	'KER',	'Airport',	'Iran'),
('373631ed-14db-4c24-aca1-653c47e57d3e',	'Kukës International Airport Zayed-north',	'KFZ',	'Wings',	'Albania'),
('912b0a00-b729-41b0-9acd-70c94d9a833b',	'Kigali International',	'KGL',	'Airport',	'Rwanda'),
('4e5b1878-4171-4e7a-b9a3-5c168f57f768',	'Kaohsiung International',	'KHH',	'Airport',	'Taiwan'),
('98d2c297-5361-4b34-a2ef-daf999ebfce0',	'Jinnah International Airport Karachi Sindh',	'KHI',	'Sn',	'Pakistan'),
('5881d4db-85e2-4242-8912-85991635af00',	'Kish International Airport',	'KIH',	'Island',	'Iran'),
('6414d947-b02b-460e-a771-cee3a71a20dd',	'Norman Manley International Airport',	'KIN',	'Kingston',	'Jamaica'),
('2c092de2-9c28-47f2-9d54-4e39ce498772',	'Kerry Airport',	'KIR',	'Farranfore',	'Ireland'),
('95147cfe-c3a5-4089-8484-10a4e926ab07',	'Chișinău International Airport',	'KIV',	'Chisinau',	'Moldova'),
('358a418e-c23b-42bc-a5e7-b35b854fbfce',	'Kansai International Airport',	'KIX',	'Osaka',	'Japan'),
('4afa1543-087e-4eaf-8ecf-adfe897e58c9',	'Aeroporto Di Milano-linate Milan',	'LIN',	'Linate',	'Italy'),
('fe7ffa77-ace2-408a-878e-04c3b63ab110',	'Aeroporto Humberto Delgado Lisbon',	'LIS',	'Portela',	'Portugal'),
('a948cecf-2540-4c40-a62f-56b7e1a78b54',	'Bill And Hillary Clinton National Airport Little Rock Adams Field Arkansas',	'LIT',	'Ar',	'United States'),
('50240c98-9e51-4218-b7cf-030e35b5b90e',	'Letališče Jožeta Pučnika Ljubljana Zgornji',	'LJU',	'Brnik',	'Slovenia'),
('cb4f5b88-8b3b-45e2-a6c1-c5e937e97bd8',	'Chaudhary Charan Singh International Airport Lucknow Utter Pradesh',	'LKO',	'Up',	'India'),
('e8eb73ee-7307-4b1b-b969-99c524a45547',	'Lilongwe International',	'LLW',	'Airport',	'Malawi'),
('e50f9aed-b108-4889-99ce-d244a60d31b9',	'Lapangan Terbang Limbang',	'LMN',	'Sarawak',	'Malaysia'),
('bbdef389-41b5-4879-9204-a204a972c7c4',	'Crater Lake - Klamath Regional Airport Falls Oregon',	'LMT',	'Or',	'United States'),
('ca325bf0-5c03-4665-9d11-eaf3624c0049',	'Lincoln Airport Nebraska',	'LNK',	'Ne',	'United States'),
('8fc65808-1386-4c14-b0ec-fd0a41800581',	'Linz',	'LNZ',	'Airport',	'Austria'),
('9ce3b1ec-9be6-41f0-a204-fb9d3e4bee5d',	'Lombok International Airport Mataram West Nusa Tenggara',	'LOP',	'Ntb',	'Indonesia'),
('21f6db38-fa3b-4601-abab-4ef6ea0ee1d5',	'Murtala Muhammed International Airport Lagos',	'LOS',	'Ikeja',	'Nigeria'),
('7f6a438e-dd39-4238-a769-ad6a45f65663',	'Aeropuerto De Gran Canaria Las Palmas Canary',	'LPA',	'Islands',	'Spain'),
('f5cfa7a2-5bca-4d3a-b4e3-1a961580905b',	'Aeropuerto Internacional El Alto La',	'LPB',	'Paz',	'Bolivia'),
('653b2d9e-ea09-48a3-b312-4c80872234a5',	'Liverpool John Lennon Airport Speke',	'LPL',	'England',	'United Kingdom'),
('52ec407a-16e6-4679-a6c5-ec6ee6433763',	'Luang Prabang International',	'LPQ',	'Airport',	'Laos'),
('34353efa-3728-40e1-b1c5-a2341720a924',	'Aéroport De La Rochelle – Ile',	'LRH',	'Ré',	'France'),
('17036397-8c75-45e4-8426-b77be825cb25',	'La Crosse Regional Airport Wisconsin',	'LSE',	'Wi',	'United States'),
('785634b5-dc4f-4d1a-afe0-e0f43f31a840',	'London Luton Airport',	'LTN',	'England',	'United Kingdom'),
('eaaebb2b-3340-4b57-ac0d-f59e7e0dfa32',	'Cincinnati Municipal Airport Ohio',	'LUK',	'Oh',	'United States'),
('4844606c-7f27-4524-96c5-00aa57d4cef8',	'Kenneth Kaunda International Airport',	'LUN',	'Lusaka',	'Zambia'),
('a83bcf27-03c5-4b93-8e17-98179af45ea8',	'Aéroport De Luxembourg',	'LUX',	'City',	'Findel'),
('28268c7d-4e66-45d1-a01c-bcacb7295e4a',	'Harry Mwanga Nkumbula International Airport Livingstone Victoria',	'LVI',	'Falls',	'Zambia'),
('9d20ad90-0608-49eb-8880-a5e6ba7038c6',	'Greenbrier Valley Airport Lewisburg West Virginia',	'LWB',	'Wv',	'United States'),
('c1c2694c-c455-4386-9e8e-5ff3d7ad4ece',	'Lviv Danylo Halytskyi International',	'LWO',	'Airport',	'Ukraine'),
('27f581c5-8ba1-4283-bebc-7309a17acec1',	'Luxor International',	'LXR',	'Airport',	'Egypt'),
('8ef39116-7730-4fff-b5db-05da3a13920c',	'Svalbard Lufthavn, Longyear',	'LYR',	'Longyearbyen',	'Norway'),
('9988fb14-aa63-426b-bddd-72a719711d1f',	'Aéroport Lyon-saint-exupéry Saint Exupéry Lyon',	'LYS',	'Colombier-saugnieu',	'France'),
('408e5f8d-2d48-49a8-b9e7-2957849a8f62',	'Chennai International Airport Tirusulam Tamil Nadu',	'MAA',	'Tn',	'India'),
('22523c35-a5d0-49dd-bf26-995b5e45109b',	'Capital Region International Airport Lansing Dewitt Township Michigan',	'LAN',	'Mi',	'United States'),
('a22e07b8-bed2-4cce-bf20-d7b509702d36',	'Harry Reid International Airport Vegas Paradise Nevada',	'LAS',	'Nv',	'United States'),
('d7835e7c-3dea-49e4-be6e-4517314503ac',	'Leeds Bradford International Airport',	'LBA',	'England',	'United Kingdom'),
('0d80e02f-f1c4-4d82-a6e3-b4e7e449b093',	'Lubbock Preston Smith International Airport Texas',	'LBB',	'Tx',	'United States'),
('5466ad20-d6f7-4c16-ac70-15ba6021a34d',	'Flughafen Lübeck',	'LBC',	'Lubeck',	'Germany'),
('348f78e6-75da-4256-b10e-de4e300d05b7',	'North Platte Regional Airport Nebraska',	'LBF',	'Ne',	'United States'),
('6c11d2d5-bb67-41c5-8593-9f1f5fe5a3c0',	'Lapangan Terbang',	'LBU',	'Labuan',	'Malaysia'),
('a7ca40f6-2dd3-4d2d-95aa-dc17d9a54321',	'Aéroport De Libreville',	'LBV',	'Au',	'Gabon'),
('e5309c15-fde7-4669-a750-7a500d623faf',	'Larnaca International',	'LCA',	'Airport',	'Cyprus'),
('d6566380-d024-464d-a924-f1133022bd53',	'Aeroporto Da Coruña-alvedro A Coruña',	'LCG',	'Galicia',	'Spain'),
('11e59d4b-e74a-4a3b-9ccd-b1110332fb1c',	'Lake Charles Regional Airport Louisiana',	'LCH',	'La',	'United States'),
('bff2a4bb-8ea6-4471-bec1-e1b981c799cc',	'Rickenbacker International Airport Columbus Lockbourne Ohio',	'LCK',	'Oh',	'United States'),
('77484ec3-a322-409d-b24e-4319ab2acf06',	'London City Airport Silvertown',	'LCY',	'England',	'United Kingdom'),
('29ebd2f0-7f93-46c9-843c-3338bc0ac058',	'City Of Derry Airport Eglinton Northern',	'LDY',	'Ireland',	'United Kingdom'),
('901149f0-a728-493d-87bb-46e7247abce6',	'Aeroport Pulkovo Saint',	'LED',	'Petersburg',	'Russia'),
('0114e093-6cb1-4f45-823c-b52b82b37159',	'Aeropuerto De Almería',	'LEI',	'Almeria',	'Spain'),
('fb6e4e6b-fb98-4580-a819-beb6c3517351',	'Flughafen Leipzig/halle Leipzig',	'LEJ',	'Halle',	'Germany'),
('66369c6a-e567-4eea-9351-689b5d3a0787',	'Aeropuerto De León',	'LEN',	'Leon',	'Spain'),
('18ad9dd3-556c-4e8f-8067-81e5caa18318',	'Aeropuerto De La Seu D''urgell',	'LEU',	'Andorra',	'Spain'),
('1ef070be-a9ac-40fa-988e-85cd88822596',	'Blue Grass Airport Lexington Kentucky',	'LEX',	'Ky',	'United States'),
('f01eea3e-2974-4720-8bff-e9484997a619',	'Lafayette Regional Airport Louisiana',	'LFT',	'La',	'United States'),
('eaeff45a-247c-4b54-98d8-37fd9f6807bb',	'Lomé–tokoin Airport',	'LFW',	'Lomé',	'Togo'),
('3fa62c17-0b51-45eb-b16c-4bd63703c0d8',	'Laguardia Airport New York City',	'LGA',	'Ny',	'United States'),
('5457907c-eb3c-44f7-a51c-d54c52a5b28d',	'Long Beach Airport California',	'LGB',	'Ca',	'United States'),
('f9f4b6f5-298a-4f30-a95b-0ac780bffd4b',	'Liège Airport',	'LGG',	'Liege',	'Belgium'),
('cd038da7-61ac-4ffc-90ec-4b76138ec415',	'Lapangan Terbang Antarabangsa Langkawi',	'LGK',	'Perlis',	'Malaysia'),
('d1523ee2-090b-418c-be95-c282598ce652',	'Gatwick Airport London Crawley',	'LGW',	'England',	'United Kingdom'),
('df719244-a6a7-4e22-8ae6-5e49b8d7f455',	'Allama Iqbal International Airport Lahore Punjab',	'LHE',	'Pb',	'Pakistan'),
('dd722032-2b92-4268-88a4-43c35b8ee4db',	'London Heathrow Airport',	'LHR',	'England',	'United Kingdom'),
('4e4597b6-df74-4bda-950b-08c72552094a',	'Lihue Airport Kauai Hawaii',	'LIH',	'Hi',	'United States'),
('93e028df-03c6-48f7-9696-777bbfe9a696',	'Aéroport De',	'LIL',	'Lille',	'France'),
('9bb1f1d2-d5c0-4798-b528-5d03fec139d3',	'Aeropuerto Internacional Jorge Chávez International Airport Lima',	'LIM',	'Callao',	'Peru'),
('f383fdb9-8ac0-463a-846d-c1f5ed80165f',	'Aeropuerto De Murcia-san Javier Murcia',	'MJV',	'San',	'Spain'),
('8b9b21eb-b4c2-4e67-9837-975a0df49da9',	'Charles B. Wheeler Downtown Airport Kansas City Missouri',	'MKC',	'Mo',	'United States'),
('e482fd0c-6ffc-4f51-beb0-ca1ac7d5768b',	'General Mitchell International Airport Milwaukee Wisconsin',	'MKE',	'Wi',	'United States'),
('c9441d02-cc68-4284-b576-26629bc870dc',	'Muskegon County Airport Norton Shores Michigan',	'MKG',	'Mi',	'United States'),
('4d2d3d35-ed34-470a-bf2e-a9ea7d39208d',	'Ajruport Internazzjonali Ta ''malta Valletta',	'MLA',	'Luqa',	'Malta'),
('e89e5703-fbed-4637-a5ec-d3122dc8733f',	'Melbourne International Airport Florida',	'MLB',	'Fl',	'United States'),
('f8b7cc4c-c5d5-4ec3-b366-c9d506b1e75f',	'Ibrahim Nasir International Airport Male Kaafu',	'MLE',	'Atoll',	'Maldives'),
('f10c5ec3-1e03-4cd6-a0cd-e5f8a21db814',	'Euroairport Basel–mulhouse–freiburg Mulhouse Saint-louis',	'MLH',	'Switzerland',	'France'),
('405d5a9b-5522-456f-8df6-4ae27b47a9b9',	'Quad City International Airport Moline Illinois',	'MLI',	'Il',	'United States'),
('28452154-916f-4de3-a084-77c71d08176a',	'Aeropuerto De',	'MLN',	'Melilla',	'Spain'),
('4713b24e-efa8-48b4-aa26-15e2e636c2b3',	'Monroe Regional Airport Louisiana',	'MLU',	'La',	'United States'),
('9f32dad5-1944-4bb7-b6bc-d5a8d3a82e82',	'Durham Tees Valley Airport Darlington Middlesbrough',	'MME',	'England',	'United Kingdom'),
('af58ea68-7c1e-4f9b-b50a-fc1e731d8845',	'Mammoth Yosemite Airport Lakes California',	'MMH',	'Ca',	'United States'),
('fbcf8194-c441-4763-bab2-46d4b37ed76e',	'Murmansk Airport',	'MMK',	'Murmashi',	'Russia'),
('2e943f94-54ce-4a15-9651-b8f3a334f124',	'Malmö Flygplats',	'MMX',	'Svedala',	'Sweden'),
('d184fb2e-f644-4e12-ba65-0fb6108d778f',	'Paliparang Pandaigdig Ng Ninoy Aquino Manila',	'MNL',	'Pasay',	'Philippines'),
('69086629-25e7-4654-94f4-8d4ad0bc8be6',	'Mobile Regional Airport Alabama',	'MOB',	'Al',	'United States'),
('1f37aa2c-91ad-430e-ba3d-9636a4e9564d',	'Moomba Airport South',	'MOO',	'Australia',	'Sa'),
('639bd4f0-75cf-42dc-a3e1-23448664c989',	'Maputo International',	'MPM',	'Airport',	'Mozambique'),
('e6042cd9-d28e-44cb-b4d4-4c252e2039ea',	'Aéroport De Miquelon Saint Pierre',	'MQC',	'And',	'France'),
('22cac411-0d36-4e19-87f0-3b82d35436fd',	'Mildura Airport Victoria',	'MQL',	'Vic',	'Australia'),
('df87d494-5a16-4e34-b89e-ceb64ae4d2bc',	'Sir Seewoosagur Ramgoolam International Airport Plaine',	'MRU',	'Magnien',	'Mauritius'),
('67653de7-002d-421d-b296-a5358f98e3ef',	'Monterey Regional Airport California',	'MRY',	'Ca',	'United States'),
('5ccc38f5-d1a9-49f3-a47e-b8ce432f7117',	'Dane County Regional Airport Madison Wisconsin',	'MSN',	'Wi',	'United States'),
('59c591ca-15e8-4565-a986-6872a2c6b9f2',	'Missoula International Airport Montana',	'MSO',	'Mt',	'United States'),
('a32745da-cfb5-4f36-ad6f-e7dc0f7e52fa',	'Minneapolis–saint Paul International Airport Twin Cities St. Minnesota',	'MSP',	'Mn',	'United States'),
('7b42d0ab-20b7-4f6d-9a82-1142c4b724c5',	'Midland International Air And Space Port Odessa Texas',	'MAF',	'Tx',	'United States'),
('cc8f6327-23e5-424f-8e5c-b4cf3ec6364d',	'Aeropuerto De Menorca',	'MAH',	'Mahón',	'Spain'),
('a5fd1993-32b2-4b4d-b25d-6a4336132598',	'Marshall Islands International',	'MAJ',	'Airport',	'Majuro'),
('ba6988e4-5098-4abd-99b4-b1173d7eb800',	'Manchester Airport Ringway',	'MAN',	'England',	'United Kingdom'),
('688a7780-3872-4ead-b455-e8c966d213fc',	'Moi International Airport',	'MBA',	'Mombasa',	'Kenya'),
('f7a93de5-dc7c-4c75-9be6-ce7b4415ca43',	'Sangster International Airport Montego',	'MBJ',	'Bay',	'Jamaica'),
('ba7cf679-ca90-4bff-b6be-1e02227cb56a',	'International Airport Freeland Michigan',	'MBS',	'Mi',	'United States'),
('2e71150f-e756-491b-a52d-395cae12f77a',	'Merced Regional Airport California',	'MCE',	'Ca',	'United States'),
('8dd2ecf9-2534-4949-826d-56acd4b55c76',	'Kansas City International Airport Missouri',	'MCI',	'Mo',	'United States'),
('e5836444-f0a3-45ea-bc3e-21690ec5e3f2',	'Orlando International Airport Florida',	'MCO',	'Fl',	'United States'),
('48783991-fd68-4139-841b-9729c235af2c',	'Aeroporto Internacional De Macapá-alberto Alcolumbre Macapa International Airport Macapá Amapá',	'MCP',	'Ap',	'Brazil'),
('2fc2d192-f709-43d6-8bf3-3ecad1f0e77f',	'Muscat International',	'MCT',	'Airport',	'Oman'),
('d1ec1fb5-5e1a-4fc1-9e37-7ea513e3051c',	'Mason City Municipal Airport Iowa',	'MCW',	'Ia',	'United States'),
('12aeb5a7-055e-47f9-959e-b84989cafec9',	'Aeroporto Internacional Maceió/zumbi Dos Palmares Zumbi Maceió Alagoas',	'MCZ',	'Al',	'Brazil'),
('ef225444-6026-4d18-af4e-9f5cf542078d',	'Bandar Udara Internasional Sam Ratulangi Manado East',	'MDC',	'Kalimantan',	'Indonesia'),
('9cf90402-cea7-480c-98b4-3fe913a24ca2',	'Aeropuerto Internacional José María Córdova Medellín',	'MDE',	'Rionegro',	'Colombia'),
('fe603964-3ded-4af6-a293-02499f1203b7',	'Mandalay International Airport',	'MDL',	'Tada-u',	'Myanmar'),
('694e642a-522a-4726-a8ba-cff619f91638',	'Aeropuerto Internacional De Mar Del Plata “ástor Piazzolla” Astor',	'MDQ',	'Piazzolla',	'Argentina'),
('d6d47466-4924-4e15-9562-8932b6fe00c4',	'Harrisburg International Airport Middletown Pennsylvania',	'MDT',	'Pa',	'United States'),
('9d6b8a4b-92a3-476f-966a-316b075a4ac6',	'Midway International Airport Chicago Illinois',	'MDW',	'Il',	'United States'),
('d48c0f8c-f224-4369-b163-01fbd36431fd',	'Aeropuerto Internacional Gobernador Francisco Gabrielli Governor',	'MDZ',	'Mendoza',	'Argentina'),
('17bfd481-37f0-4874-bf59-0432bba46ae2',	'Prince Mohammad Bin Abdulaziz International Airport',	'MED',	'Medina',	'Saudi Arabia'),
('fe6ccf3d-9a25-46dd-8b09-4520dc524c9c',	'Melbourne Airport Tullamarine Victoria',	'MEL',	'Vic',	'Australia'),
('f95624c4-d0ce-469a-a915-0a739eb1e459',	'Memphis International Airport Tennessee',	'MEM',	'Tn',	'United States'),
('c4daf600-731f-49f5-9e2a-d2764fc11ecc',	'Aeropuerto Internacional Benito Juárez International Airport Mexico City Distrito',	'MEX',	'Federal',	'Df'),
('9a79c69b-e276-473f-84d5-234bd3ff5244',	'Mansfield Lahm Regional Airport Ohio',	'MFD',	'Oh',	'United States'),
('2dd7b7eb-eead-4a41-838b-bb431e452d47',	'Aeropuerto Internacional Augusto C. Sandino César International Airport',	'MGA',	'Managua',	'Nicaragua'),
('1fa73180-4477-41d7-bc1a-1c1ed2aa0440',	'Flughafen Düsseldorf Mönchengladbach',	'MGL',	'Dusseldorf',	'Germany'),
('8fc8cc77-1ce2-44bb-a854-7982e33dcba7',	'Montgomery Regional Airport Alabama',	'MGM',	'Al',	'United States'),
('cd75a537-99f0-4ca6-80c0-3ff30ae5f7f8',	'Shahid Hashemi Nejad Airport',	'MHD',	'Mashhad',	'Iran'),
('59edfd49-632d-4a54-b082-009c27b2be36',	'Manchester–boston Regional Airport Manchester Boston New Hampshire',	'MHT',	'Nh',	'United States'),
('72f4cc65-3edc-4db0-b596-048132b0b711',	'Miami International Airport Florida',	'MIA',	'Fl',	'United States'),
('ae13a158-df19-4ee2-a46a-179c6c7add88',	'Diori Hamani International Airport',	'NIM',	'Niamey',	'Niger'),
('d2e84b96-6125-4874-b3a1-405d8af97e4e',	'Nouakchott International',	'NKC',	'Airport',	'Mauritania'),
('db5167ef-3374-4f4e-a713-e92ce931ec4b',	'Nanjing Lukou International Airport',	'NKG',	'Jiangsu',	'China'),
('62438832-4038-4cc4-931f-211926fc6ea2',	'Simon Mwansa Kapwepwe International Airport',	'NLA',	'Ndola',	'Zambia'),
('9dafeae2-98fe-4d2e-affd-6f6c524ccc6c',	'Norfolk Island',	'NLK',	'Airport',	'Australia'),
('311b9c16-c852-4b0f-a28a-01357509203e',	'Nanning Wuxu International Airport',	'NNG',	'Guangxi',	'China'),
('74e23fff-36be-4f4b-a13a-29e00672560e',	'Aerfort Chonamara Inverin',	'NNR',	'Connemara',	'Ireland'),
('a7383730-6b64-4497-aaa0-439280ee1e40',	'Ireland West Airport',	'NOC',	'Knock',	'Charlestown'),
('8632ec4c-b0f5-4fa0-861e-1d9961facba7',	'Fascene Airport Nosy',	'NOS',	'Be',	'Madagascar'),
('e8e3ea81-8108-486c-89b6-4561c171e19f',	'Newquay Cornwall Airport',	'NQY',	'England',	'United Kingdom'),
('d38e8b7f-32b0-4c37-8d1c-243e3b729708',	'Nursultan Nazarbayev International Airport',	'NQZ',	'Astana',	'Kazakhstan'),
('4f8731a8-a88b-46b8-a315-404c4b7d8f56',	'Flughafen Weeze North',	'NRN',	'Rhine-westphalia',	'Germany'),
('8cee02d0-30f0-4766-a805-aca1e6e60a7d',	'Narita International Airport',	'NRT',	'Tokyo',	'Japan'),
('ce08fe43-61de-4c43-9a6b-34b3bf2b9a82',	'Alykel Airport Norilsk Krasnoyarsk',	'NSK',	'Krai',	'Russia'),
('20dd9b4d-9cfb-4ed3-9ab5-a59816b10fe4',	'Nelson Airport',	'NSN',	'Annesbrook',	'New Zealand'),
('411ebbc4-110a-4701-a192-1327f81ffd72',	'Aéroport Nantes Atlantique',	'NTE',	'Bouguenais',	'France'),
('26301c82-c492-4484-b869-b3a6b08ae689',	'Newcastle Airport Williamtown New South Wales',	'NTL',	'Nsw',	'Australia'),
('7d134658-efb7-4239-a1eb-9a4e6e09a14c',	'Flughafen Nürnberg Nuremberg',	'NUE',	'Bavaria',	'Germany'),
('70d1d053-a0e7-4d49-9826-bfa77786cd7a',	'Norwich International Airport Norfolk',	'NWI',	'England',	'United Kingdom'),
('62996d27-d93a-46e6-8986-697702653462',	'Stockholm Skavsta Flygplats',	'NYO',	'Nyköping',	'Sweden'),
('e0c8564b-a2a6-471c-b843-2a9666de312f',	'Maria Reiche Neuman Airport Nazca',	'NZC',	'Ica',	'Peru'),
('ae809379-c5f9-404a-bc58-15aaf17c5057',	'Oakland International Airport California',	'OAK',	'Ca',	'United States'),
('03ae02f5-6b6f-42f6-a913-a06baa70c0ad',	'Oban Airport North Connel',	'OBN',	'Scotland',	'United Kingdom'),
('131742e6-fa99-4304-aa65-2e0f29f6be15',	'Odessa International',	'ODS',	'Airport',	'Ukraine'),
('b65fe939-dc8b-45cb-93f8-862712e680fa',	'Kahului Airport Maui Hawaii',	'OGG',	'Hi',	'United States'),
('8b3d80d0-98f4-42e0-ad5c-13c9983e2e64',	'Ogdensburg International Airport Ottawa New York',	'OGS',	'Ny',	'United States'),
('5488bcae-ca90-42d5-9b1d-786ca719d88e',	'Worcester Regional Airport Massachusetts',	'ORH',	'Ma',	'United States'),
('876805f2-5994-40a4-b9cc-94cc58add4c5',	'Naha Airport',	'OKA',	'Okinawa',	'Japan'),
('e2fcdc8a-a334-4c9c-8d0c-665ef9ad2476',	'Will Rogers World Airport Oklahoma City',	'OKC',	'Ok',	'United States'),
('5a4ab410-b8cc-491d-a644-5c51a1679d8c',	'Eppley Airfield Omaha Nebraska',	'OMA',	'Ne',	'United States'),
('53c22932-a726-4b63-97eb-6ba0af092435',	'Maastricht Aachen Airport',	'MST',	'Beek',	'Netherlands'),
('2434a263-089c-4c1d-ab04-ade728960005',	'Moshoeshoe I International Airport Maseru',	'MSU',	'Mazenod',	'Lesotho'),
('94f1a35a-53fe-4921-b6a4-67ba53220057',	'Louis Armstrong International Airport New Orleans Louisiana',	'MSY',	'La',	'United States'),
('55f8fa40-4ad4-41e0-8ab1-ec315d4845d9',	'Montrose Regional Airport Colorado',	'MTJ',	'Co',	'United States'),
('35f4f3d8-9069-456c-ab95-f264e7bf8be4',	'Matsapha Airport',	'MTS',	'Manzini',	'Swaziland'),
('4f9cf8f5-f157-4ac2-b135-4cd3313a2c98',	'Aeropuerto Internacional Mariano Escobedo Monterrey Apodaca Nuevo León',	'MTY',	'Nl',	'Mexico'),
('7bd73bbf-c2b3-450a-b11e-73e9087225dd',	'Maun International',	'MUB',	'Airport',	'Botswana'),
('464c5584-d81a-45a1-a189-d1d20b934b78',	'Flughafen München Franz Josef Strauß Munich',	'MUC',	'Freising',	'Germany'),
('89c57b51-295e-4c21-ad1a-333c3bdb0dfb',	'Multan International Airport Punjab',	'MUX',	'Pb',	'Pakistan'),
('c6ec2e72-0724-43e0-a602-56607eddcfbe',	'Martha’s Vineyard Airport Massachusetts',	'MVY',	'Ma',	'United States'),
('5fbf397f-af4c-4327-b713-353a54a22dba',	'Laurinburg–maxton Airport Maxton Rockingham North Carolina',	'MXE',	'Nc',	'United States'),
('8d119b14-0c0d-4f10-99d4-b5aea0d0e99d',	'Aeroporto Di Milano-malpensa Malpensa Milan',	'MXP',	'Ferno',	'Italy'),
('71d859c9-3cdf-45a3-9dc6-faf0b3b9436a',	'Montgomery Field Airport San Diego California',	'MYF',	'Ca',	'United States'),
('1d93a948-6aa0-40ac-83c2-4722d432da16',	'Myrtle Beach International Airport South Carolina',	'MYR',	'Sc',	'United States'),
('170ddcd8-55e1-4c88-be4c-19b9cb63b3fc',	'Myitkyina',	'MYT',	'Airport',	'Myanmar'),
('db0ad392-c7fb-4de3-8fd5-191ff12adce9',	'Aeropuerto La Nubia',	'MZL',	'Manizales',	'Colombia'),
('5239524b-3332-415c-b15d-378bc2ace69e',	'Dr. Babasaheb Ambedkar International Airport Nagpur Maharashtra',	'NAG',	'Mh',	'India'),
('e6792dde-2026-4268-a005-cb0fff9c4ecb',	'Nadi International Airport Viti',	'NAN',	'Levu',	'Fiji'),
('dd175e16-2d41-4158-bef3-54788374f466',	'Aeroporto Internazionale Di Napoli',	'NAP',	'Naples',	'Italy'),
('d84e64ca-eab3-451f-ad51-7ba897d02728',	'Lynden Pindling International Airport',	'NAS',	'Nassau',	'Bahamas'),
('72eea16a-7415-4341-bb11-028c7699bf19',	'Aeroporto Internacional Augusto Severo Natal Parnamirim Rio Grande Do Norte',	'NAT',	'Rn',	'Brazil'),
('0bd7a3d3-3401-489d-a7b1-46587bad1d79',	'Jomo Kenyatta International Airport Nairobi',	'NBO',	'Embakasi',	'Kenya'),
('3fe5eb99-4f2e-433e-b5aa-b1e9390968ad',	'Aéroport Nice Côte',	'NCE',	'D''azur',	'France'),
('c9fe1406-b541-4e6c-aa93-8c45794dc61f',	'Newcastle International Airport Woolsington',	'NCL',	'England',	'United Kingdom'),
('219cc5c3-0918-4b6d-9507-e50a6e7bc705',	'N’djamena International Airport',	'NDJ',	'N''djamena',	'Chad'),
('f73f64d3-98e1-47e7-9ec9-041b7ed9c669',	'N’délé Airport Central',	'NDL',	'African',	'Republic'),
('4e44e0e5-1236-4e71-869a-30ede3b97006',	'Nador International',	'NDR',	'Airport',	'Morocco'),
('3e9fd765-54f5-4b5b-8bbd-656e27b26d40',	'Chulman Neryungri',	'NER',	'Airport',	'Russia'),
('d0896077-7c85-465f-918d-a75dcd374c1a',	'Ningbo Lishe International Airport',	'NGB',	'Zhejiang',	'China'),
('2476d106-ffe5-421b-9e10-1035d08d0312',	'Chūbu Centrair International Airport Nagoya Tokoname',	'NGO',	'City',	'Japan'),
('c13ee5e0-464c-4da2-9841-3481910f2bc0',	'Nagasaki Airport',	'NGS',	'Ōmura',	'Japan'),
('5a13423e-9264-453c-a784-1049349ce151',	'Nicosia International',	'NIC',	'Airport',	'Cyprus'),
('32b6db33-3c67-465f-8b37-7487ed599872',	'Aeropuerto Internacional Capitán De Corbeta Carlos A. Curbelo Punta Del Este',	'PDP',	'Piriápolis',	'Uruguay'),
('567aac5b-f130-45f7-a4d7-3ca57326d02a',	'Letishte Plovdiv',	'PDV',	'Krumovo',	'Bulgaria'),
('fb2b3cc0-f812-4033-b4db-dbb0699e991f',	'Portland International Airport Oregon',	'PDX',	'Or',	'United States'),
('78b1b69e-0d16-4190-8b74-b2164725d105',	'Perm International',	'PEE',	'Airport',	'Russia'),
('df9e3f42-df16-483d-8831-6a6298dce732',	'Aeropuerto Internacional Matecaña Matecana International Airport',	'PEI',	'Pereira',	'Colombia'),
('69112623-ef5a-4faa-9b9c-8853b63d531d',	'Beijing Capital International Airport Chaoyang',	'PEK',	'District',	'China'),
('bea92f91-5783-4cfa-b9ea-4a409b5848c4',	'Perth Airport Western',	'PER',	'Australia',	'Wa'),
('a9d5b5f3-6ed5-498b-b218-7ab30bbf865d',	'Aeroporto Internacional João Simões Lopes Neto International Airport Pelotas Rio Grande Do Sul',	'PET',	'Rs',	'Brazil'),
('ca43f619-7608-439f-af40-0314e273c2a6',	'Bacha Khan International Airport Peshawar Khyber Pakhtunkhwa',	'PEW',	'Kpk',	'Pakistan'),
('90ca8b5c-67e0-4e54-b432-324257799de0',	'Aeroporto Lauro Kurtz Airport Passo Fundo Rio Grande Do Sul',	'PFB',	'Rs',	'Brazil'),
('0c96a649-2e12-4038-9069-f71ed6affff5',	'Paphos International',	'PFO',	'Airport',	'Cyprus'),
('e9b4d253-fc8d-43f2-9b86-1227354b59cc',	'Port Harcourt International Airport',	'PHC',	'Omagwa',	'Nigeria'),
('70c08ed0-353f-4d5e-a321-4e0c7ed04605',	'Newport News/williamsburg International Airport News Williamsburg Virginia',	'PHF',	'Va',	'United States'),
('de4285e6-2433-4790-af6d-b589066fc815',	'Palm Beach County Glades Airport Pahokee Florida',	'PHK',	'Fl',	'United States'),
('cabe8709-ee39-48f9-90ec-23c0558c2c3b',	'Philadelphia International Airport Pennsylvania',	'PHL',	'Pa',	'United States'),
('6260c513-f7a5-4138-8cd2-914e77e4684d',	'Sky Harbor International Airport Phoenix Arizona',	'PHX',	'Az',	'United States'),
('a0d8b348-a5fd-4ae6-a844-2bbaf035acf5',	'Glasgow Prestwick Airport',	'PIK',	'Scotland',	'United Kingdom'),
('42844c50-81af-4b64-aabb-ec66cdf2e0ac',	'Aeropuerto Capitán Fap Renán Elías Olivera Pisco',	'PIO',	'Ica',	'Peru'),
('e71564f4-7ab8-49ea-81ef-cba84a460274',	'Sultan Syarif Kasim Ii International Airport',	'PKU',	'Pekanbaru',	'Indonesia'),
('93fa61b2-2713-4431-af45-7adcc5ccadc4',	'Omsk Tsentralny Airport',	'OMS',	'Siberia',	'Russia'),
('00499844-2264-4aec-a673-3f4bae2710e9',	'La/ontario International Airport Ontario California',	'ONT',	'Ca',	'United States'),
('c187a4a5-69c9-4258-bd03-bb4124460922',	'Gold Coast Airport Coolangatta Bilinga Queensland',	'OOL',	'Qld',	'Australia'),
('9452cedb-fa7b-4e07-9858-1415f5da1b2c',	'Aeroporto Francisco Sá Carneiro De Airport Porto',	'OPO',	'Oporto',	'Portugal'),
('ec7fa65d-ab1c-4b7d-8cc2-c3bfa43167bc',	'Örebro Flygplats',	'ORB',	'Orebro',	'Sweden'),
('be9a6fc9-0928-4d1a-87f2-245a8a3008d1',	'O’hare International Airport Chicago Illinois',	'ORD',	'Il',	'United States'),
('70b5ab5d-cb1d-4982-af5d-1da32589294e',	'Norfolk International Airport Virginia',	'ORF',	'Va',	'United States'),
('200e7464-71f1-4bd3-a2b5-c9bdfa6a07c7',	'Cork Airport',	'ORK',	'Ballygarvan',	'Ireland'),
('6db1cce9-4e92-4ba4-938f-4e8dc75b77cb',	'Aéroport De Paris-orly Paris',	'ORY',	'Orly',	'France'),
('a267190d-be0e-4b20-9518-922b71bcdd4e',	'Wittman Regional Airport Oshkosh Wisconsin',	'OSH',	'Wi',	'United States'),
('0c415330-a66a-4c54-8064-c050db44221f',	'Internationale Luchthaven Oostende-brugge Ostend',	'OST',	'Bruges',	'Belgium'),
('8aefbdcf-0385-46cf-98de-6601d38d805f',	'Ohio State University Airport Columbus',	'OSU',	'Oh',	'United States'),
('64936772-9241-4cb6-a0f5-fe6b7f4e50a2',	'Aeroportul Internațional Henri Coandă Bucharest',	'OTP',	'Otopeni',	'Romania'),
('549698da-b8bd-40f4-b95b-6dacd2dc91a2',	'Ralph Wien Memorial Airport Kotzebue Alaska',	'OTZ',	'Ak',	'United States'),
('cca16164-7765-4c93-b92b-7ae2a094bc02',	'Ouagadougou International Airport',	'OUA',	'Burkina',	'Faso'),
('17999b4a-881b-464f-b961-3bc6f7199428',	'Oujda Angads',	'OUD',	'Airport',	'Morocco'),
('b221db4f-2bdb-4d72-87b5-72ae93280095',	'Oulun Lentoasema',	'OUL',	'Oulu',	'Finland'),
('2acbfd1d-2ac8-4f65-872c-0c8950e5c325',	'Novosibirsk Tolmachevo',	'OVB',	'Airport',	'Russia'),
('e67d8f97-aa85-482b-ad77-c4751bbcaab4',	'Aeropuerto De Asturias',	'OVD',	'Oviedo',	'Spain'),
('d75bbfe7-8404-46d3-85a0-c8749b09931e',	'Norwood Memorial Airport Massachusetts',	'OWD',	'Ma',	'United States'),
('15778778-2f51-4677-8b42-dfd461db0b90',	'Aeroporto Internacional Osvaldo Vieira International Airport',	'OXB',	'Bissau',	'Guinea-bissau'),
('55c125da-9974-4680-a1b0-7b00efd5040c',	'London Oxford Airport Kidlington',	'OXF',	'England',	'United Kingdom'),
('0e83b1f8-e437-4d85-b97c-a98df1ece7e5',	'Snohomish County Airport Everett Mukilteo Washington',	'PAE',	'Wa',	'United States'),
('7431e2ae-0f08-45ca-a377-ebb05ea635ce',	'Paros National',	'PAS',	'Airport',	'Greece'),
('808eea8d-bbdd-4fe0-8263-460eefa51602',	'Plattsburgh International Airport New York',	'PBG',	'Ny',	'United States'),
('65c7be9d-d68f-40c6-a7c6-0426443a39c8',	'Paro International',	'PBH',	'Airport',	'Bhutan'),
('f25ebff7-03bd-4933-8f44-6e68bff83826',	'Palm Beach International Airport Miami Florida',	'PBI',	'Fl',	'United States'),
('71c70657-5ec5-427f-8a7a-72c1d4b049da',	'Johan Adolf Pengel International Airport Paramaribo',	'PBM',	'Zanderij',	'Suriname'),
('c3343ab5-290c-4afb-8bb5-2fb5f866bc76',	'Aeropuerto Internacional Capitán Fap David Abensur Rengifo Pucallpa',	'PCL',	'Ucayalí',	'Peru'),
('7481e057-6ba9-4fcd-b296-9aa9e6f9859f',	'Dekalb–peachtree Airport Chamblee Atlanta Georgia',	'PDK',	'Ga',	'United States'),
('b8ddb36a-b23e-42d9-86a3-fed1cbb7fcd9',	'Aeroporto João Paulo Ii John Paul Airport Ponta Delgada São Miguel',	'PDL',	'Azores',	'Portugal'),
('9fb05b81-db27-4c75-ac80-e7b976fc4498',	'Oslo Lufthavn',	'OSL',	'Gardermoen',	'Norway'),
('df8b64b3-80e7-4946-8f32-bb29b9750c8e',	'Pittsburgh International Airport Pennsylvania',	'PIT',	'Pa',	'United States'),
('f96d2dcc-1453-4eed-8eaa-cc74f3887954',	'Aeropuerto Internacional Capitán Fap Guillermo Concha Iberico International Airport',	'PIU',	'Piura',	'Peru'),
('6030cdbb-1bfd-4437-b0d1-9626d0b36c46',	'Aeroporto Do Pico Madalena',	'PIX',	'Azores',	'Portugal'),
('798cf07d-74e5-4914-8363-886afc916db5',	'Aérodrome De Pointe-à-pitre Le Raizet Grande-terre',	'PTP',	'Guadeloupe',	'France'),
('c8817a90-2e50-42d6-a2bf-9806506d9b44',	'Aeropuerto Internacional De Tocumen International Airport',	'PTY',	'Panama',	'City'),
('31b1302c-712c-4571-b690-802ae1896225',	'Pueblo Memorial Airport Colorado',	'PUB',	'Co',	'United States'),
('8b35ca19-6974-4755-9e74-3e1a6137ecf8',	'Aéroport Pau Pyrénées Airport',	'PUF',	'Uzein',	'France'),
('411a07cb-6671-43e2-8bce-01ea9699f113',	'Aeropuerto Internacional Presidente Carlos Ibáñez Punta',	'PUQ',	'Arenas',	'Chile'),
('35ad4882-9aa9-434f-ab32-3493bc4bae88',	'Gimhae International Airport Busan Pusan',	'PUS',	'Korea',	'South'),
('0a5f1dcd-b02f-485b-8df1-556f3f78ef7f',	'Theodore Francis Green Memorial State Airport Providence Warwick Rhode Island',	'PVD',	'Ri',	'United States'),
('5de51cd1-a9c8-4334-8834-60ff786db297',	'Shanghai Pudong International',	'PVG',	'Airport',	'China'),
('1530956b-823d-414c-accd-794da78c23c7',	'Aeropuerto Internacional Lic. Gustavo Díaz Ordaz International Airport Puerto Vallarta Jalisco',	'PVR',	'Ja',	'Mexico'),
('4c961b3b-a116-4ebb-bbf1-317dda4e8454',	'Provo Municipal Airport Utah',	'PVU',	'Ut',	'United States'),
('dc277bbb-61fe-468b-b43d-05bc3c1411c5',	'Chicago Executive Airport Wheeling Prospect Heights Illinois',	'PWK',	'Il',	'United States'),
('24b5065f-989c-4869-8579-f429522505a8',	'Portland International Jetport Westbrook Maine',	'PWM',	'Me',	'United States'),
('9981eb38-c84a-4895-a297-2b4941b1fe3b',	'Aeroporto De Porto Santo',	'PXO',	'Madeira',	'Portugal'),
('f1bdb174-1beb-4d54-ba6f-102981435f48',	'Sân Bay',	'PXU',	'Pleiku',	'Vietnam'),
('50875c14-5701-4c18-8394-143359352f66',	'Manuel Carlos Piar Guayana International Airport Ciudad Puerto Ordaz',	'PZO',	'Bolívar',	'Venezuela'),
('7881bc0f-11b6-48fe-938a-c08bf9364f02',	'Aeroporto Di Verona-boscomantico Airport',	'QBS',	'Verona',	'Italy'),
('44b4cd14-40a1-4e12-a23e-d0ffdccdd54d',	'Aeropuerto Intercontinental De Querétaro',	'QRO',	'Qe',	'Mexico'),
('a36f9b34-9fc3-4c2a-b6bc-2b17668164c4',	'Aeroporto Internacional Nelson Mandela International Airport Praia Santiago Island',	'RAI',	'Cape',	'Verde'),
('a7c0e2bc-4dec-476c-b547-cc3b0bfd7c4a',	'Marrakesh Menara',	'RAK',	'Airport',	'Morocco'),
('e70347cf-9ab2-4cfe-a339-f2570752a50b',	'Aeroporto Estadual De Ribeirão Preto - Doutor Leite Lopes State Airport Dr. Ribeirao São Paulo',	'RAO',	'Sp',	'Brazil'),
('595bc285-27ba-4862-82ba-439730734bc0',	'Papa Rererangi O Rarotonga International Airport Avarua',	'RAR',	'Cook',	'Islands'),
('345273b1-ac67-4957-af7f-0962871e6fe3',	'Rabat–salé Airport Rabat',	'RBA',	'Salé',	'Morocco'),
('86cfee74-a78a-4187-b5d1-d5b6f1c05188',	'Dallas Executive Airport Texas',	'RBD',	'Tx',	'United States'),
('8d013fa4-6f0b-4870-bdd4-334db2514ac1',	'Aeropuerto Roboré',	'RBO',	'Airport',	'Bolivia'),
('398fd5a6-18f5-453e-82d8-47c1a873f009',	'Redding Municipal Airport California',	'RDD',	'Ca',	'United States'),
('aad4fb4f-fb8d-4012-b5c1-bf581e283ec6',	'Sultan Mahmud Badaruddin Ii International Airport',	'PLM',	'Palembang',	'Indonesia'),
('ff215508-3856-4e9d-8467-ca77d47f9c78',	'Tarptautinis Palangos Oro Uostas Palanga',	'PLQ',	'Klaipėda',	'Lithuania'),
('fed9d404-a64e-4b82-ab68-25fa39652cc8',	'Aeroporto Carlos Drummond De Andrade Airport Belo Horizonte Pampulha Minas Gerais',	'PLU',	'Mg',	'Brazil'),
('76a45cbf-6a0a-49e9-83d3-16070a5fc2b0',	'Chief Dawid Stuurman International Airport Gqeberha Port',	'PLZ',	'Elizabeth',	'South Africa'),
('4a6a3aab-84da-4718-928b-97cd510e1611',	'Aeropuerto De Palma',	'PMI',	'Mallorca',	'Spain'),
('a370fbce-3792-49cc-b6a0-460af8bc8781',	'Aeroporto Falcone Borsellino Airport Palermo',	'PMO',	'Sicily',	'Italy'),
('627f7523-dadd-40cb-9a57-dbaebdcf5cee',	'Aeroporto De Palmas-brigadeiro Lysias Rodrigues Palmas Tocantins',	'PMW',	'To',	'Brazil'),
('8a4dd3a3-3fdb-4fee-a268-5c1fd3e7ae45',	'Aeropuerto De',	'PNA',	'Pamplona',	'Spain'),
('d58c6670-06ee-4fb7-b2fd-5c43db5ba18c',	'Phnom Penh International',	'PNH',	'Airport',	'Cambodia'),
('1c237d85-e017-4c7a-b5be-db9b2e8726b3',	'Pohnpei International Airport',	'PNI',	'Island',	'Micronesia'),
('62ad4ec0-622c-46f1-85af-52666a91e5df',	'Bandar Udara Internasional Supadio International Airport Pontianak West',	'PNK',	'Kalimantan',	'Indonesia'),
('e0907827-e3fa-4f16-90b3-6405e59fca03',	'Pune Airport Poona Maharashtra',	'PNQ',	'Mh',	'India'),
('b80c335c-8bda-46c2-a386-0bde62842abc',	'Pensacola International Airport Florida',	'PNS',	'Fl',	'United States'),
('4d0cd2ad-c693-45b3-88bb-77c19b3289cc',	'Aeródromo Teniente Julio Gallardo Airport Puerto',	'PNT',	'Natales',	'Chile'),
('f61e853d-ee40-4358-8550-4656d2bbf16a',	'Puducherry Airport',	'PNY',	'Pondicherry',	'India'),
('1af591d6-6333-4c8c-81ed-fa20876c6a53',	'Aeroporto De Petrolina–senador Nilo Coelho Petrolina Juazeiro Pernambuco',	'PNZ',	'Pe',	'Brazil'),
('22d9bec8-6b33-4f57-af0e-9544d0fc5775',	'Aeroporto Internacional Salgado Filho International Airport Porto Alegre São João Rio Grande Do Sul',	'POA',	'Rs',	'Brazil'),
('110ae0b3-764b-45be-ae67-f88ecab54e32',	'Jacksons International Airport Port',	'POM',	'Moresby',	'Papua New Guinea'),
('208635a3-e725-4ab3-97f0-d8e3f8d30235',	'Aeroporto Poços De Caldas Pocos Minas Gerais',	'POO',	'Mg',	'Brazil'),
('8758833a-ccb3-4a93-92a5-25676cd4f54c',	'Aeropuerto Internacional Gregorio Luperón International Airport Puerto',	'POP',	'Plata',	'Dominican Republic'),
('e5ebf6da-8a2a-4381-9ad4-b6c724e57b16',	'Piarco International Airport Port Of',	'POS',	'Spain',	'Trinidad And Tobago'),
('2b7506ad-a177-49af-ab20-e3fa496b18c2',	'Port Lotniczy Poznań–ławica Im. Henryka Wieniawskiego Henryk Wieniawski Airport',	'POZ',	'Poznań',	'Poland'),
('cf613183-52f1-4a3d-959b-25b53ee4239e',	'Pago International Airport Tafuna American',	'PPG',	'Samoa',	'United States'),
('5ef7fd60-a6f3-4491-a7ca-62637f20c540',	'Fa''a''ā International Airport Tahiti Pape''ete French',	'PPT',	'Polynesia',	'France'),
('fe157f3c-d579-4a70-9d42-f90199ac3304',	'Sân Bay Quốc Tế Phú Quôc Phu',	'PQC',	'Quoc',	'Vietnam'),
('01f097b8-325c-4204-8b1b-925eddf67c5d',	'Letiště Václava Havla Praha Vaclav Havel Airport Prague',	'PRG',	'Ruzyně',	'Czech Republic'),
('c4d5d172-4136-42e7-80f7-fbb8e1eb9185',	'Pristina International Airport Adem',	'PRN',	'Jashari',	'Kosovo'),
('4000074a-947c-4cfc-8283-dbf6d070ad7b',	'Aeroporto Internazionale Di',	'PSA',	'Pisa',	'Italy'),
('7759de62-51a0-4bde-a5a2-7889eb24f847',	'Tri-cities Airport Pasco Washington',	'PSC',	'Wa',	'United States'),
('7fcc55fd-c800-4aaa-9b11-f316ceec2e02',	'Aeropuerto Mercedita Airport Ponce Puerto',	'PSE',	'Rico',	'United States'),
('b62f54be-e899-4cdb-9a13-5519f28cfce5',	'Portsmouth International Airport At Pease New Hampshire',	'PSM',	'Nh',	'United States'),
('ca2fc574-00a1-4648-a6b1-d17cc0949737',	'Palm Springs International Airport California',	'PSP',	'Ca',	'United States'),
('1c05de26-1e9f-4ab1-9cd3-d317236669e7',	'Port Lotniczy Rzeszów-jasionka Rzeszów',	'RZE',	'Jasionka',	'Poland'),
('1b1b3d41-6136-449c-85f8-b3f6af404656',	'Juancho E. Yrausquin Airport',	'SAB',	'Saba',	'Netherlands'),
('efa1604b-ecb6-4dfe-9ce7-bda28002b435',	'Santa Fe Municipal Airport New Mexico',	'SAF',	'Nm',	'United States'),
('7b85c1e3-84d3-40ed-8843-0d5e197f2b84',	'Sana''a International',	'SAH',	'Airport',	'Yemen'),
('60a266dc-f5e6-47ac-9abe-f9b0c6dfdadb',	'Aeropuerto Internacional Monseñor Óscar Arnulfo Romero International Airport San Salvador La',	'SAL',	'Paz',	'El'),
('aed9ef7b-c13e-43f5-9685-0fa6087c2225',	'Lindbergh Field Diego California',	'SAN',	'Ca',	'United States'),
('3b4b4228-306e-486d-bf0a-ada585e03dd7',	'San Antonio International Airport Texas',	'SAT',	'Tx',	'United States'),
('c2f6c37f-f7ac-4e2b-8410-159cefe2663e',	'Savannah/hilton Head International Airport Savannah Hilton Island Georgia',	'SAV',	'Ga',	'United States'),
('855ced2e-b0a0-4afe-a82d-d4d1c0bfe939',	'Sabiha Gökçen Uluslararası Havalimanı',	'SAW',	'Istanbul',	'Turkey'),
('9ce4331d-6e95-4a66-92c7-cf6a35669a2c',	'Santa Barbara Municipal Airport California',	'SBA',	'Ca',	'United States'),
('99879288-5716-4110-937d-422541e44e1c',	'San Bernardino International Airport California',	'SBD',	'Ca',	'United States'),
('6907be86-e76b-4e64-9202-4bb5465edb97',	'South Bend International Airport Indiana',	'SBN',	'In',	'United States'),
('df27566c-2778-4a1c-bc1c-97adce3588a6',	'San Luis Obispo County Regional Airport California',	'SBP',	'Ca',	'United States'),
('b533bf2a-6319-4b9a-b311-bd47800c50b3',	'University Park Airport State College Bellefonte Pennsylvania',	'SCE',	'Pa',	'United States'),
('394f61ec-292b-4b1c-a096-b5946e60217e',	'Stockton Metropolitan Airport California',	'SCK',	'Ca',	'United States'),
('5c0b6738-3ec3-4022-8677-293895692eb0',	'Aeropuerto Internacional Comodoro Arturo Merino Benítez International Airport Santiago',	'SCL',	'Pudahuel',	'Chile'),
('1f155c0d-8edb-4067-ae1a-94fb2854d85a',	'International Airport',	'SCO',	'Aktau',	'Kazakhstan'),
('cab9d237-6104-4ba2-ac48-af55db574b4f',	'Aeroporto Internacional De Santiago Compostela',	'SCQ',	'Galicia',	'Spain'),
('da91f7c6-7071-4c7f-9d73-153f2b4cd730',	'Socotra Airport',	'SCT',	'Hadibu',	'Yemen'),
('88faa0c4-a8c9-49c3-abaa-d0ff50b27e5b',	'Louisville Muhammad Ali International Airport Kentucky',	'SDF',	'Ky',	'United States'),
('85457191-896a-4081-aba8-799ffb121c7a',	'Aeropuerto Seve Ballesteros - Santander Airport',	'SDR',	'Maliaño',	'Spain'),
('dddb4572-faf5-4b3a-b5af-da6afca7f817',	'Aeroporto Santos Dumont Airport Rio De Janeiro',	'SDU',	'Rj',	'Brazil'),
('c853c18a-2021-4ef5-a69d-d3f37c488311',	'Seattle–tacoma International Airport Seattle Tacoma Washington',	'SEA',	'Wa',	'United States'),
('ca3ffa9a-57b0-4c83-a485-03e5c135c749',	'London Southend Airport',	'SEN',	'England',	'United Kingdom'),
('dac84efa-5869-420a-94a6-547b80e75f4c',	'Aeroporto Internacional Do Recife/guararapes–gilberto Freyre Recife Pernambuco',	'REC',	'Pe',	'Brazil'),
('d7db9d45-1f77-4ba1-81bf-581184357c77',	'Siem Reap International',	'REP',	'Airport',	'Cambodia'),
('dd8e0960-e2c0-4e9d-9f40-c8e66997ddf3',	'Chicago Rockford International Airport Illinois',	'RFD',	'Il',	'United States'),
('f0cd5d88-a9ca-4add-8640-65fd997a3513',	'Rangiroa Airport French',	'RGI',	'Polynesia',	'France'),
('594ca7c1-f71b-4f99-b506-c267f2e334aa',	'Yangon International Airport',	'RGN',	'Rangoon',	'Myanmar'),
('81366e9b-4793-493d-8295-b24bf00d22a7',	'Rhodes International Airport',	'RHO',	'“diagoras”',	'Greece'),
('37eeab52-3323-48c0-826d-81007403e481',	'Richmond International Airport Sandston Virginia',	'RIC',	'Va',	'United States'),
('d8362d2e-cc11-41dd-83ed-e47e4124f38b',	'March Air Reserve Base Riverside California',	'RIV',	'Ca',	'United States'),
('ffa87f93-d9a2-4c7c-b4dc-238d3fb9be32',	'Riverton Regional Airport Wyoming',	'RIW',	'Wy',	'United States'),
('32c4c1c9-efc9-4a5a-9b1b-dfa4563abeca',	'Starptautiskā Lidosta “rīga”',	'RIX',	'Riga',	'Latvia'),
('3628da58-80c9-4155-87c3-401192d7e835',	'Aeropuerto De Logroño-agoncillo Logroño',	'RJL',	'Agoncillo',	'Spain'),
('fafebb4b-252b-464f-a79a-f095ed959dd8',	'Reykjavík',	'RKV',	'Airport',	'Iceland'),
('3eeeea4f-7182-4f87-b0ef-670613e9c41d',	'Ramstein Air Base Ramstein-miesenbach',	'RMS',	'Kaiserslautern',	'Germany'),
('d0d1e7b0-5504-42e8-bff0-c7e6c7922153',	'Reno–tahoe International Airport Reno Tahoe Nevada',	'RNO',	'Nv',	'United States'),
('c29d0033-c202-478c-838e-3db505fa2ace',	'Aéroport De Rennes -',	'RNS',	'Saint-jacques',	'France'),
('0430551c-cbb2-4313-9523-00f61aa7172b',	'Renton Municipal Airport Washington',	'RNT',	'Wa',	'United States'),
('39c42f50-a6f5-440a-808d-919702812066',	'Roanoke–blacksburg Regional Airport Roanoke Virginia',	'ROA',	'Va',	'United States'),
('5ac346ee-7326-430c-a307-c4cfc7349958',	'Roberts International Airport',	'ROB',	'Monrovia',	'Liberia'),
('ceecbd3b-5321-49e5-bc2a-bfdcfae9c320',	'Frederick Douglass Greater Rochester International Airport New York',	'ROC',	'Ny',	'United States'),
('c0483a22-9491-4c14-948e-50f019a17fbd',	'Roman Tmetuchl International Airport Melekeok',	'ROR',	'Airai',	'Palau'),
('75f44c51-eb5b-41bd-9f0c-8bdc2e22d523',	'Aeropuerto Internacional Rosario Islas Malvinas Funes Santa',	'ROS',	'Fe',	'Argentina'),
('db3d44b5-9f4a-43f4-8858-154658353dca',	'Aeroport Rostov-na-donu',	'ROV',	'Rostov-on-don',	'Russia'),
('9412d386-01b4-40f5-880b-71c7427fc169',	'Roswell International Air Center New Mexico',	'ROW',	'Nm',	'United States'),
('ba25450a-860a-42f2-b507-b61b2b6f5133',	'Swami Vivekananda International Airport Raipur Mana Chhattisgarh',	'RPR',	'Ct',	'India'),
('db4e09d4-c871-47f5-93ea-1c4360266ab6',	'Sir Gaëtan Duval Airport Plaine Corail',	'RRG',	'Rodrigues',	'Mauritius'),
('93959228-2e34-4d64-bde2-d1f574953e13',	'Rochester International Airport Minnesota',	'RST',	'Mn',	'United States'),
('fafcbb49-eb6b-4233-bb3a-68c04dbbfb37',	'Southwest Florida International Airport Fort Myers',	'RSW',	'Fl',	'United States'),
('ec611009-8a63-41f4-ab79-da15393a9a11',	'Rotterdam The Hague',	'RTM',	'Airport',	'Netherlands'),
('ee78e785-78d8-4062-8f74-dec18181c730',	'King Khalid International Airport',	'RUH',	'Riyadh',	'Saudi Arabia'),
('9e61c415-adb9-497d-846d-54e0bf7cedf3',	'Aéroport De La Réunion Roland Garros',	'RUN',	'Saint-denis',	'France'),
('f33c82e8-9021-47fe-bec5-ae1a0dc1e0bf',	'Rovaniemen Lentoasema',	'RVN',	'Rovaniemi',	'Finland'),
('4717764c-b4e9-45c7-98c3-f1c510119e6f',	'Moss Lufthavn,',	'RYG',	'Rygge',	'Norway'),
('89dae032-3274-4a75-afbb-f0cd83cf9ada',	'Shaikh Zayed International Airport Rahim Yar Khan Punjab',	'RYK',	'Pb',	'Pakistan'),
('b704b1ea-fa2d-4951-a451-21a266b5b11e',	'George F. L. Charles Airport Castries',	'SLU',	'Saint',	'Lucia'),
('ec40e5f4-0c6a-458a-b7dd-c5d5629c1f61',	'Aeroporto Internacional Marechal Cunha Machado International Airport São Luís Maranhão',	'SLZ',	'Ma',	'Brazil'),
('00a326b4-278a-4b64-9fb8-6eed63f991ec',	'Aeroporto De Santa Maria Vila Do Porto',	'SMA',	'Azores',	'Portugal'),
('67f2638a-2857-4f34-a2b9-5d1191f6f89a',	'Sacramento International Airport California',	'SMF',	'Ca',	'United States'),
('b353f031-465e-4758-ac57-304ee314a6f9',	'Samos International Airport, Aristarchos Of',	'SMI',	'Island',	'Greece'),
('78b15c0b-c94a-460e-b3a7-620e6a746c5b',	'John Wayne International Airport Orange County Santa Ana California',	'SNA',	'Ca',	'United States'),
('722a7d19-e7d7-4cb4-a51e-f16eac2a3142',	'Shannon',	'SNN',	'Airport',	'Ireland'),
('b3309242-669a-4800-96ed-0c6a0f327e35',	'Aéroport De Saint-nazaire - Montoir',	'SNR',	'Airport',	'France'),
('e45da181-fbea-485a-9215-f2f4b19a28c7',	'Hévíz-balaton Repülőtér Heviz-balaton Airport Balaton',	'SOB',	'Sarmellek',	'Hungary'),
('2358856f-ea28-4619-b49f-4cf069d012a9',	'Bandar Udara Internasional Adisumarmo International Airport Surakarta',	'SOC',	'Ngemplak',	'Indonesia'),
('2401ef69-ca33-4c71-8a91-e17aae7bce00',	'Letishte Sofiya Sofia',	'SOF',	'Vrazhdebna',	'Bulgaria'),
('380fbb90-333c-463a-803a-b4453fdfe772',	'Bandar Udara Domine Edward Osok Airport Sorong West',	'SOQ',	'Papua',	'Indonesia'),
('058f7eb1-fb0c-435c-b0b1-cf6728f1f75d',	'Southampton Airport Eastleigh',	'SOU',	'England',	'United Kingdom'),
('a7572668-279e-4b30-b0cf-db94e482e5f6',	'Stronsay Airport Orkney Islands',	'SOY',	'Scotland',	'United Kingdom'),
('8126497a-3884-4ac1-9517-8279410030d7',	'Aeropuerto De La Palma Airport Canary',	'SPC',	'Islands',	'Spain'),
('b32e550d-f055-491d-a8d0-793c380b9461',	'Albert Whitted Airport Saint Petersburg Tampa Bay Florida',	'SPG',	'Fl',	'United States'),
('86e3192a-f270-447e-8f9e-0e637e2512f8',	'Saipan International Airport Northern Mariana',	'SPN',	'Islands',	'United States'),
('d5ddb1d0-9a91-403d-8ea1-eb1525b43f27',	'Zračna Luka Split',	'SPU',	'Kastela',	'Croatia'),
('0ece9cce-fd41-42fe-b56d-80f7ab6c3199',	'San Carlos Airport California',	'SQL',	'Ca',	'United States'),
('15af7d06-7e55-4856-b673-d0d1c17dd897',	'Aeropuerto Internacional Juana Azurduy De Padilla International Airport',	'SRE',	'Sucre',	'Bolivia'),
('26d7074b-1bd6-4444-b640-00eb053847b6',	'Bandar Udara Internasional Ahmad Yani Semarang East',	'SRG',	'Java',	'Indonesia'),
('ee53d00e-3e69-4878-a9d5-d7a17af69bd5',	'Sarasota–bradenton International Airport Sarasota Bradenton Florida',	'SRQ',	'Fl',	'United States'),
('0bcd1dcb-857b-4332-a059-af5a12077bd6',	'Stinson Municipal Airport San Antonio Texas',	'SSF',	'Tx',	'United States'),
('5883f0b8-346b-4ebd-9bdf-367305d8df3d',	'Aeropuerto De Malabo Bioko',	'SSG',	'Equatorial',	'Guinea'),
('77e3e989-05f9-43f4-885c-8b869e26bb1b',	'Sharm El-sheikh International',	'SSH',	'Airport',	'Egypt'),
('f5d7c4d8-e804-4229-b9f7-bbca12e95109',	'Søndre Strømfjord Lufthavn Kangerlussuaq Qeqqata',	'SFJ',	'Greenland',	'Denmark'),
('721cd5a6-2723-4ccf-9f6a-787584ebf984',	'Aeropuerto De Santa Fe - Sauce Viejo',	'SFN',	'Airport',	'Argentina'),
('7984272d-788f-4121-be34-849a029fe782',	'San Francisco International Airport California',	'SFO',	'Ca',	'United States'),
('59d83deb-bbb0-48ec-8768-40394d7521d5',	'Surgut International',	'SGC',	'Airport',	'Russia'),
('230806fe-8285-46ae-b582-7632f54e50b3',	'Springfield–branson National Airport Springfield Missouri',	'SGF',	'Mo',	'United States'),
('45c3b678-0f5e-45f4-bcc4-5107d054701c',	'Sân Bay Quốc Tế Tân Sơn Nhất Ho Chi Minh City',	'SGN',	'Saigon',	'Vietnam'),
('33bfbada-4f98-4a55-9577-e8fcd4eca72b',	'St. George Regional Airport Utah',	'SGU',	'Ut',	'United States'),
('0d5ef712-a8d8-4743-a963-0e59e449c7a5',	'Skagway Airport Alaska',	'SGY',	'Ak',	'United States'),
('e6af060b-5e83-429c-8b31-c9d72a3ba300',	'Shanghai Hongqiao International',	'SHA',	'Airport',	'China'),
('6b6424de-b2bd-47d2-911c-416200a48c4f',	'Shenandoah Valley Regional Airport Staunton Weyers Cave Virginia',	'SHD',	'Va',	'United States'),
('9e9324d1-85f6-44d0-a622-bc95083a11f1',	'Shenyang Taoxian International Airport',	'SHE',	'Liaoning',	'China'),
('101a4a21-dab3-41b5-ba9c-28ce7de58cc5',	'Shreveport Regional Airport Louisiana',	'SHV',	'La',	'United States'),
('95a859c1-d95c-4cfc-9e84-603afa590b14',	'Aeroporto Internacional Amílcar Cabral International Airport Espargos Sal Island',	'SID',	'Cape',	'Verde'),
('700c7c38-8728-4af3-bc76-c7d581cfd372',	'Singapore',	'SIN',	'Changi',	'Airport'),
('58629dc8-9f81-4401-bd2e-5c4c022e90ea',	'Simferopol International',	'SIP',	'Airport',	'Russia'),
('cbe46a00-5cee-4b54-a783-26abea8edd47',	'Aéroport De Sion Rhone',	'SIR',	'Valley',	'Switzerland'),
('f88aab63-4b4b-43d8-9536-9d94db337ace',	'Norman Y. Mineta San Jose International Airport California',	'SJC',	'Ca',	'United States'),
('31ad2478-8ef9-4115-a08b-6905a7199d60',	'Sarajevo International Airport',	'SJJ',	'Butmir',	'Bosnia And Herzegovina'),
('898f3cae-4ccb-404b-a19e-d22c59456e08',	'Aeroporto De São José Dos Campos-professor Urbano Ernesto Stumpf Airport Campos Sao Paulo',	'SJK',	'Sp',	'Brazil'),
('862048fc-b23c-47f9-aa73-ebf833f67343',	'Aeropuerto Internacional Juan Santamaría San José',	'SJO',	'Alajuela',	'Costa Rica'),
('3ba2dc92-33c2-471e-8951-5ce6a69f5326',	'Aeropuerto Internacional Luis Muñoz Marín San Juan Carolina Puerto',	'SJU',	'Rico',	'United States'),
('61a3b76a-bb29-433e-bba7-283d68e51036',	'Aérodromo De São Jorge Velas',	'SJZ',	'Azores',	'Portugal'),
('4b71385e-998f-430c-b5e3-f5c6645e58af',	'Robert L. Bradshaw International Airport Basseterre Saint Kitts',	'SKB',	'And',	'Nevis'),
('b8770ef6-3054-410e-8f65-cb766fb4189a',	'Thessaloniki International Airport, Macedonia',	'SKG',	'Mikra',	'Greece'),
('aa8c43b5-ea76-47f6-bce4-aa54aa8cdf82',	'Aerodrom Skopje',	'SKP',	'Petrovec',	'Macedonia'),
('27f3f5b3-8e60-44a4-af17-85b958daf27a',	'Sialkot International Airport',	'SKT',	'Punjab',	'Pakistan'),
('161d2d44-6161-4117-92be-00da2b2fc01f',	'Sukkur Airport Sindh',	'SKZ',	'Sn',	'Pakistan'),
('f2c6eff8-d00d-4faf-a5a6-2641866a9d30',	'Salt Lake City International Airport Utah',	'SLC',	'Ut',	'United States'),
('93c82c2e-61cd-4419-8339-d052d6273624',	'Salem Municipal Airport - Mcnary Field Oregon',	'SLE',	'Or',	'United States'),
('3c19eaf0-a294-4513-9064-80342170c243',	'Adirondack Regional Airport Saranac Lake Placid New York',	'SLK',	'Ny',	'United States'),
('387227a2-7569-41e5-99a6-e2aea61e10bc',	'Aeropuerto De Salamanca-matacán Salamanca Matacán Castile And',	'SLM',	'León',	'Spain'),
('2dc27555-bef6-440b-a869-b79838e3da49',	'Salina Regional Airport Kansas',	'SLN',	'Ks',	'United States'),
('07fad8cf-dae5-473c-a939-bf2b22b5c767',	'Toshkent Xalqaro Aeroporti',	'TAS',	'Tashkent',	'Uzbekistan'),
('cd71daf9-0896-4aaa-a6be-9c0b7da242e9',	'Sân Bay Đông Tác Dong Tac Airport Tuy',	'TBB',	'Hoa',	'Vietnam'),
('c4fe7223-055c-4c13-81ed-095ed3c37baa',	'Aeropuerto Capitán Fap Pedro Canga Rodríguez Airport',	'TBP',	'Tumbes',	'Peru'),
('3d5d6dbe-6052-46ce-905f-46aafc290091',	'Tbilisi International',	'TBS',	'Airport',	'Georgia'),
('44a8d584-ee5f-4703-a0b6-cbefe6fa35e9',	'Tabriz International',	'TBZ',	'Airport',	'Iran'),
('61ddfbd4-9455-464a-9129-90af289bf8ef',	'Aeropuerto Internacional Coronel Fap Carlos Ciriani Santa Rosa International Airport',	'TCQ',	'Tacna',	'Peru'),
('5d9d4c3d-9b8e-441d-af82-294187dffcc8',	'Base Aérea Das Lajes Field Terceira',	'TER',	'Azores',	'Portugal'),
('0a4fc181-25f2-47fe-9428-77a0932a326e',	'Aeropuerto De Tenerife Norte Santa Cruz Canary',	'TFN',	'Islands',	'Spain'),
('7731510b-c472-4b57-bc3e-9c9eb1c7b58a',	'Podgorica Airport',	'TGD',	'Golubovci',	'Montenegro'),
('99d51d7d-8a1d-4397-b431-97947261f1a7',	'Aeroporto De Teresina–senador Petrônio Portella Teresina Airport Piauí',	'THE',	'Pi',	'Brazil'),
('6cc6d7db-db79-4600-8511-1aa4e1a45449',	'Mehrabad International Airport',	'THR',	'Tehran',	'Iran'),
('52cb76f0-a7d1-4944-aad0-9798cf5b0b1e',	'Tirana International Airport Nënë Tereza',	'TIA',	'Rinas',	'Albania'),
('55dfa08f-3616-43d9-9e99-4cecf84e3b84',	'Ta''if Regional Airport Mecca',	'TIF',	'Province',	'Saudi Arabia'),
('3be292ec-40fd-428f-9ddc-ab49f0126387',	'Aeropuerto Internacional De Tijuana Baja',	'TIJ',	'California',	'Mexico'),
('a5383e1e-4c22-4b76-81da-c8f9739c5037',	'Tripoli International Airport Qasr Bin',	'TIP',	'Ghashir',	'Libya'),
('4f3bde0d-4d6c-451c-be27-f8408d69c6c5',	'Aerodrom Tivat',	'TIV',	'Airport',	'Montenegro'),
('ebdb7576-2221-4266-b0ff-b32a039fb1f7',	'Roshchino International Airport',	'TJM',	'Tyumen',	'Russia'),
('facd4cf3-f036-490f-886a-bf5cb601cc54',	'Chuuk International Airport Weno',	'TKK',	'Truk',	'Micronesia'),
('123a5075-37e4-44af-ad91-14886fcc8a27',	'Lennart Meri Tallinna Lennujaam',	'TLL',	'Tallinn',	'Estonia'),
('9c6e8372-df7f-40ad-b566-433e57e7c00a',	'Ben Gurion Airport Tel',	'TLV',	'Aviv',	'Israel'),
('47b51ccc-a68c-4291-84aa-c08c5aef4bf6',	'Bandar Udara Tambolaka',	'TMC',	'Airport',	'Indonesia'),
('7a6b2863-d833-4b81-98ee-0c768407b4fb',	'Lambert–st. Louis International Airport St. Missouri',	'STL',	'Mo',	'United States'),
('61e759d5-b1b8-4b2a-b6b5-796087fa5fe7',	'Aeroporto De Santarém–maestro Wilson Fonseca Santarem-maestro Airport Santarém Pará',	'STM',	'Pa',	'Brazil'),
('bce33feb-f194-4a34-83f8-d9780f95bf9f',	'London Stansted Airport Mountfitchet',	'STN',	'England',	'United Kingdom'),
('386e120f-5671-482c-8aa9-ef687de5a584',	'St. Paul Downtown Airport Saint Twin Cities Minnesota',	'STP',	'Mn',	'United States'),
('9460e76f-53c3-4f70-915a-0b6af19ecbe8',	'Flughafen Stuttgart - Manfred',	'STR',	'Rommel',	'Germany'),
('58eb75e8-0c29-480d-bcee-f91728cfe721',	'Charles M. Schulz - Sonoma County Airport Santa Rosa California',	'STS',	'Ca',	'United States'),
('be96d9bc-1ee5-4956-bdb3-d04da459d4be',	'Cyril E. King Airport Saint Thomas St. Virgin',	'STT',	'Islands',	'United States'),
('ce949725-040b-447a-a8f2-acf77100cc38',	'Henry E. Rohlsen Airport Saint Croix St. Virgin',	'STX',	'Islands',	'United States'),
('6a07a9b7-b52c-48cd-83d7-583d27829628',	'Friedman Memorial Airport Hailey Valley Idaho',	'SUN',	'Id',	'United States'),
('f042ebcb-aec5-451e-96c4-d7d9c989dbbe',	'Nausori International Airport Suva Viti',	'SUV',	'Levu',	'Fiji'),
('94505922-4814-479f-9df9-b787a854d856',	'Sioux Gateway Airport City Iowa',	'SUX',	'Ia',	'United States'),
('45142468-cca0-42a4-82b2-6f45bed56b39',	'E. T. Joshua Airport Kingstown Arnos Vale Saint Vincent And',	'SVD',	'The',	'Grenadines'),
('02f38309-3d54-44ce-b20c-9a0506742553',	'Stavanger Lufthavn,',	'SVG',	'Sola',	'Norway'),
('7270b9fc-92db-4bd9-a356-3311e8880b8c',	'Sheremetyevo International Airport Moscow',	'SVO',	'Khimki',	'Russia'),
('b15364b2-6a4f-4f6d-8fc6-888e8001e704',	'Aeropuerto De Sevilla',	'SVQ',	'Seville',	'Spain'),
('865b0569-f1de-4d56-9af2-a49c8ef5d02c',	'Koltsovo International Airport Yekaterinburg',	'SVX',	'Sverdlovsk',	'Russia'),
('1e66bb99-8f23-4289-930a-d1ce85f90625',	'Stewart International Airport Newburgh Hudson Valley New York',	'SWF',	'Ny',	'United States'),
('3958bad3-49a8-4afe-b974-6078a7df147b',	'Aéroport International De Strasbourg',	'SXB',	'Entzheim',	'France'),
('dac98e73-035a-418b-9a5d-c78fe7f8e4a0',	'Flughafen Berlin-schönefeld Berlin',	'SXF',	'Schönefeld',	'Germany'),
('2be90dae-9ece-48b1-954e-7d0a4059c1b9',	'Sligo Airport',	'SXL',	'Strandhill',	'Ireland'),
('4c401d33-2f3d-4db0-82c5-6ede9ecb488f',	'Princess Juliana International Airport Simpson Bay Sint Maarten Saint',	'SXM',	'Martin',	'Netherlands'),
('c6db79fa-6238-403f-9bc7-7d1bfd388757',	'Srinagar International Airport Jammu And Kashmir',	'SXR',	'Jk',	'India'),
('7477ad28-7d8c-48bb-a613-fd129c1a2ea6',	'Sydney (kingsford Smith) Airport New South Wales',	'SYD',	'Nsw',	'Australia'),
('fa9af5a8-d969-4f3e-9236-b4c1fcc39e07',	'Syracuse Hancock International Airport New York',	'SYR',	'Ny',	'United States'),
('36210238-e1b5-4eb7-ac0a-7edc3e567047',	'Sanya Phoenix International Airport',	'SYX',	'Hainan',	'China'),
('c2b51655-4316-4033-a221-b0264e26db8d',	'Shiraz International',	'SYZ',	'Airport',	'Iran'),
('9aab28ec-a6ae-43e1-90a9-ff62874c2747',	'Lapangan Terbang Sultan Abdul Aziz Shah Airport Subang Kuala Lumpur',	'SZB',	'Selangor',	'Malaysia'),
('2f529cec-a114-4181-bd8c-3a03f398ef1d',	'Salzburg Airport W. A.',	'SZG',	'Mozart',	'Austria'),
('222ae435-b51a-4cee-9e23-56a1fd337114',	'Shenzhen Bao''an International Airport',	'SZX',	'Guangdong',	'China'),
('5bf537bb-815d-486c-9540-3dd7e6e43655',	'A.n.r. Robinson International Airport Scarborough Crown',	'TAB',	'Point',	'Trinidad And Tobago'),
('93851ae6-cbe7-45a3-8672-2d0beed6db9c',	'Takamatsu',	'TAK',	'Airport',	'Japan'),
('e28d75b0-4481-4e89-9711-9033e4d5c4c0',	'Qingdao Liuting International Airport Shandong Chengyang',	'TAO',	'District',	'China'),
('bd2b923b-8d6e-4064-99d8-a6f8dceeebc6',	'Aeroporto Internacional De São Tomé Sao Tome',	'TMS',	'And',	'Príncipe'),
('546ba075-2f09-46b4-b283-71e91f5fd3f8',	'Oskemen International Airport',	'UKK',	'Ust-kamenogorsk',	'Kazakhstan'),
('a99854c7-26de-41a7-97ab-1cf4dcb20260',	'Chinggis Khaan International Airport',	'ULN',	'Ulaanbaatar',	'Mongolia'),
('0fe86545-320b-41c3-a2dc-7c284a2d8faf',	'Bandar Udara Internasional Sultan Hasanuddin Makassar South',	'UPG',	'Sulawesi',	'Indonesia'),
('d02bc813-5038-4eda-8eeb-4f7100e3e5f2',	'Oral Ak Zhol Airport',	'URA',	'Uralsk',	'Kazakhstan'),
('dd830a20-9a15-408c-a81c-3cfd321d35de',	'Aeropuerto Internacional De Ushuaia Malvinas',	'USH',	'Argentinas',	'Argentina'),
('7e24d95f-7352-43cb-acdf-86ee16e54274',	'Samui International Airport',	'USM',	'Ko',	'Thailand'),
('169ccc07-3054-4f2d-b74f-ac37b9327093',	'Udon Thani International',	'UTH',	'Airport',	'Thailand'),
('3d0107de-bc61-4c81-bd40-a86358478991',	'Baikal International Airport',	'UUD',	'Ulan-ude',	'Russia'),
('02b43fe4-4cd4-4b32-8128-29286d990a53',	'Yuzhno-sakhalinsk',	'UUS',	'Airport',	'Russia'),
('87a45516-c244-4dc7-91fb-2ab58cef8572',	'Hewanorra International Airport Vieux Fort',	'UVF',	'Saint',	'Lucia'),
('38ed5faf-1de9-4c4c-ac47-a55851ae3263',	'Villa International Airport Maamigili Alif Dhaal',	'VAM',	'Atoll',	'Maldives'),
('de32b6c3-5480-4bba-a9fc-bf614d20538d',	'Letishte Varna',	'VAR',	'Aksakovo',	'Bulgaria'),
('7d0b93a0-ef20-40c0-841b-b6e74457dceb',	'Vava’u International Airport',	'VAV',	'Vava''u',	'Tonga'),
('6157ed08-f06a-4065-9828-e05f43368f0f',	'Sân Bay Quốc Tế Cần Thơ Can',	'VCA',	'Tho',	'Vietnam'),
('f77b25d9-d414-4563-9426-6ccaf3b6596e',	'Aeroporto Di Venezia Marco Polo Venice',	'VCE',	'Tessera',	'Italy'),
('90363487-9b18-467c-9112-c8a524f9dc61',	'Sân Bay Chu Lai Airport Tam',	'VCL',	'Ky',	'Vietnam'),
('0ed91924-0816-4440-9cb1-74ec43feab38',	'Sân Bay Côn Đảo Con Dao Son',	'VCS',	'Island',	'Vietnam'),
('2150cf9b-fdf4-405a-aa89-575c6db69675',	'Southern California Logistics Airport Victorville',	'VCV',	'Ca',	'United States'),
('b13ca7f7-e2ad-40eb-a6d9-c7bc6d6896f7',	'Aeropuerto De El Hierro Valverde Canary',	'VDE',	'Islands',	'Spain'),
('c74666bb-66a1-48df-9d98-a78da3659e52',	'Sân Bay Đồng Hới Dong',	'VDH',	'Hoi',	'Vietnam'),
('6eff2dfd-4879-4a17-9318-54c5a24973a3',	'Aeropuerto Internacional De Veracruz International Airport',	'VER',	'Ve',	'Mexico'),
('34fea670-ce62-4bc0-9f55-fda012661034',	'Aeropuerto De Vigo',	'VGO',	'Peinador',	'Spain'),
('d5c8a863-2b15-4818-8887-c7d3b2b407a9',	'North Las Vegas Airport Nevada',	'VGT',	'Nv',	'United States'),
('a69312ae-f14e-46cb-9620-371b3d3023be',	'Flughafen Wien-schwechat Vienna',	'VIE',	'Schwechat',	'Austria'),
('5d6197f2-53ff-4d27-a687-a72a91acfbb8',	'Sân Bay',	'VII',	'Vinh',	'Vietnam'),
('fc0b5316-3263-4a98-8f9b-850e194c5ea6',	'Aeroporto De Vitória-eurico Aguiar Salles Vitória Espírito Santo',	'VIX',	'Es',	'Brazil'),
('54f33c23-0319-468b-a5d3-98a33320833b',	'Sân Bay Rạch Giá Rach',	'VKG',	'Gia',	'Vietnam'),
('d5216d50-94ff-4513-af26-4b356706bc6e',	'Vnukovo International Airport',	'VKO',	'Moscow',	'Russia'),
('c88b5cc2-27e6-4e7d-831d-cbcfe637da7e',	'Tangier Ibn Battouta',	'TNG',	'Airport',	'Morocco'),
('8bf80d2e-ce2e-467d-afde-28754fed8eaf',	'Ivato International Airport',	'TNR',	'Antananarivo',	'Madagascar'),
('7ea6bfa5-c41f-4a00-82f5-937c90a81abb',	'Dade-collier Training And Transition Airport Miami Fort Lauderdale Florida',	'TNT',	'Fl',	'United States'),
('c832e996-b308-403a-83fc-ccea8be2805c',	'Toledo Express Airport Ohio',	'TOL',	'Oh',	'United States'),
('a9059c1c-b7cf-4959-a792-1ea9fea12b24',	'Tromsø Lufthavn, Langnes',	'TOS',	'Langes',	'Norway'),
('ab289cc7-46d9-4a12-843c-c354599de789',	'Tampa International Airport Florida',	'TPA',	'Fl',	'United States'),
('51172286-7c54-4f58-9554-05fcea9cbac4',	'Taiwan Taoyuan International Airport',	'TPE',	'Taipei',	'City'),
('d4f4bef0-1ba5-4579-aa52-00093d02b664',	'Aeropuerto Cadete Fap Guillermo Del Castillo Paredes Airport Tarapoto San',	'TPP',	'Martín',	'Peru'),
('bd0eb7f5-1cb7-407e-9520-6dfcaa6c8c4b',	'Trondheim Lufthavn,',	'TRD',	'Værnes',	'Norway'),
('f817b393-4d3f-404c-92ef-c05df60f0d6f',	'Port-adhair Thirioah Tiree Balemartine',	'TRE',	'Scotland',	'United Kingdom'),
('2fb6cc92-9b48-4a2d-9590-a24c765d83ea',	'Sandefjord Lufthavn,',	'TRF',	'Torp',	'Norway'),
('d83f559b-7259-46db-a8ee-e1660eab8de1',	'Tri-cities Regional Airport Blountville Bristol Tennessee',	'TRI',	'Tn',	'United States'),
('382572e3-dcac-41e2-98fa-756914912d8b',	'Aeroporto Di Torino Sandro Pertini',	'TRN',	'Turin',	'Italy'),
('e6dbc221-6258-4628-8371-bc7b73a7c763',	'Aeroporto Di Trieste–friuli Venezia Giulia Trieste Ronchi Dei',	'TRS',	'Legionari',	'Italy'),
('db4c2064-778f-49d3-ba76-ef1d78237e81',	'Aeropuerto Internacional Capitán Fap Carlos Martínez De Pinillos International Airport Trujillo La',	'TRU',	'Libertad',	'Peru'),
('5644cd51-8e8f-4199-9e9b-9f7fdc38a6b2',	'Trivandrum International Airport Thiruvananthapuram Kerala',	'TRV',	'Kl',	'India'),
('dfb96ede-96fd-4db0-b207-ceb59f95cdb2',	'Bonriki International Airport South',	'TRW',	'Tarawa',	'Kiribati'),
('9aa13cca-1dda-45cd-bac8-b8fb550f5948',	'Taipei Songshan Airport',	'TSA',	'District',	'Taiwan'),
('6040e6ba-0c69-4cbc-ad37-0019abcfe1ea',	'Tianjin Binhai International',	'TSN',	'Airport',	'China'),
('fd11806b-17f2-4e6e-9037-7bf1c2060963',	'Aeroportul Internațional „traian Vuia”',	'TSR',	'Timișoara',	'Romania'),
('e33fc0d4-10af-48a1-ad9b-684a091c04bb',	'Trenton–mercer Airport Trenton Ewing Township New Jersey',	'TTN',	'Nj',	'United States'),
('c0aba47b-56a1-40bb-9861-b5b3df14e16e',	'Tulsa International Airport Oklahoma',	'TUL',	'Ok',	'United States'),
('94bf07b0-74a7-4942-b527-1a6dfecda46c',	'Tunis–carthage International Airport Tunis',	'TUN',	'Carthage',	'Tunisia'),
('5e470198-cc0d-49b1-a59d-fe98c1503668',	'Tucson International Airport Arizona',	'TUS',	'Az',	'United States'),
('b21c60a8-3703-4de5-abbc-021c536c6017',	'Cherry Capital Airport Traverse City Michigan',	'TVC',	'Mi',	'United States'),
('a0348595-0a2f-4051-8131-6e141efba1f4',	'Flughafen Berlin-tegel “otto Lilienthal” Berlin',	'TXL',	'Tegel',	'Germany'),
('c3d2d3f8-432c-4c6d-84fe-0d58514ba3dc',	'Aeropuerto Capitán Fap Víctor Montes Arias Talara',	'TYL',	'Piura',	'Peru'),
('d28839dd-c6ee-4190-85b4-e8113c9c0e0a',	'Mcghee Tyson Airport Knoxville Alcoa Tennessee',	'TYS',	'Tn',	'United States'),
('ff7204b5-cd5e-4968-9510-030b75309cf9',	'Tuzla International Airport',	'TZL',	'Zivinice',	'Bosnia And Herzegovina'),
('5af7153f-5845-4ea5-b3a4-c7a75b911471',	'International Airport',	'UFA',	'Bashkortostan',	'Russia'),
('1e8d73f0-6937-49ec-baa7-8e897e844094',	'Sân Bay Phù Cát Phu Cat Airport Qui',	'UIH',	'Nhon',	'Vietnam'),
('ae974e56-696e-4ecd-b3cc-4e032004f971',	'Aeropuerto Internacional Mariscal Sucre International Airport Quito Tababela',	'UIO',	'Pichincha',	'Ecuador'),
('96706259-40bc-4a07-94e3-08dce0030991',	'Boundary Bay Airport Vancouver Delta British Columbia',	'YDT',	'Bc',	'Canada'),
('b36f8d27-be52-4377-8bb0-4a4fee14b32b',	'Edmonton International Airport Alberta',	'YEG',	'Ab',	'Canada'),
('3dd39424-ce1b-4e6a-abda-33b193db519a',	'Iqaluit Airport Nunavut',	'YFB',	'Nu',	'Canada'),
('e8002854-fca0-4189-a720-8237797ada51',	'Gods Lake Narrows Airport Manitoba',	'YGO',	'Mb',	'Canada'),
('d2cbdf7c-6bcd-4ed5-ba17-ade865ff40d9',	'Gjoa Haven Airport Nunavut',	'YHK',	'Nu',	'Canada'),
('3cec074b-9f51-4b24-be60-9e620eb48cb2',	'John C. Munro Hamilton International Airport Toronto Ontario',	'YHM',	'On',	'Canada'),
('42408105-fd8c-4096-8ffe-68f7d29bf69c',	'Halifax Stanfield International Airport Enfield Nova Scotia',	'YHZ',	'Ns',	'Canada'),
('a956e6d8-3147-480d-b6ac-45ff9ee13ea9',	'Willow Run Airport Ypsilanti Michigan',	'YIP',	'Mi',	'United States'),
('64a18cd3-f15e-410e-afd3-9b332fe2c058',	'Samjiyŏn Airport Ryanggang',	'YJS',	'Korea',	'North'),
('44e0d19e-05fd-434c-9bb1-86ae4a54bb8a',	'Alert Airport Nunavut',	'YLT',	'Nu',	'Canada'),
('5048ed50-5677-494e-8fda-a5db8e230774',	'Kelowna International Airport British Columbia',	'YLW',	'Bc',	'Canada'),
('b47a2111-3bba-46a1-a92f-d34b045de66b',	'Fort Mcmurray International Airport Alberta',	'YMM',	'Ab',	'Canada'),
('6aa7ece0-f500-4885-ae72-f1877a646123',	'Aéroport International Montréal–mirabel Montreal Mirabel Quebec',	'YMX',	'Qc',	'Canada'),
('9fbb7587-76be-4539-9186-fe9f68985dd3',	'Prince Abdul Mohsin Bin Abdulaziz Airport Yanbu'' Al Bahr Madinah',	'YNB',	'Province',	'Saudi Arabia'),
('de8cb3a0-74c6-4e5c-b2d8-1febac373eff',	'Youngstown–warren Regional Airport Youngstown Warren Ohio',	'YNG',	'Oh',	'United States'),
('c73d9fff-18c8-446b-99c3-61912e5d4b14',	'Yongphulla Airport',	'YON',	'Trashigang',	'Bhutan'),
('42454db6-3929-4861-9e1a-054868b08783',	'Oshawa Executive Airport Toronto Ontario',	'YOO',	'On',	'Canada'),
('793ba885-474d-4f3a-a7fa-18f4d56a2737',	'Ottawa Macdonald–cartier International Airport Ontario',	'YOW',	'On',	'Canada'),
('ab812e88-f405-4a1d-99c9-6a59d364e6d0',	'Aéroport International Jean-lesage De Québec City Quebec',	'YQB',	'Qc',	'Canada'),
('d246ccdf-ec48-4d14-bc8d-2cb5dbfbab16',	'Greater Moncton International Airport Dieppe New Brunswick',	'YQM',	'Nb',	'Canada'),
('16f94e89-c9b4-4922-8dda-c3f9376fc317',	'Regina International Airport Saskatchewan',	'YQR',	'Sk',	'Canada'),
('9c73e533-0c50-46c1-b852-da142b422279',	'Thunder Bay International Airport Ontario',	'YQT',	'On',	'Canada'),
('ed6797e7-0d2d-4d3f-a18a-fc19876da8d6',	'Gander International Airport Newfoundland And Labrador',	'YQX',	'Nl',	'Canada'),
('efc4ba35-2725-4768-b4d4-737960236550',	'Sydney/j.a. Douglas Mccurdy Airport Sydney Nova Scotia',	'YQY',	'Ns',	'Canada'),
('ed18ed3f-6d9c-4c3c-8742-20b6ca435f12',	'Sudbury Airport Ontario',	'YSB',	'On',	'Canada'),
('a4dd9974-5d22-4917-b3d8-66618bb2512e',	'Aéroport De Saint John New Brunswick',	'YSJ',	'Nb',	'Canada'),
('3b20c4cd-cb94-4022-ba34-e4e90602f917',	'Billy Bishop Toronto City Airport Division Ontario',	'YTZ',	'On',	'Canada'),
('438afad4-5553-4ee8-aecd-62b177332b77',	'Aeropuerto De Valladolid Villanubla Castile And',	'VLL',	'Leon',	'Spain'),
('16415328-12a4-48bd-98c4-54fe3db2ec1d',	'Aeropuerto Internacional Arturo Michelena',	'VLN',	'Valencia',	'Venezuela'),
('47a036d0-99e0-4c95-977e-69b6c5cac89c',	'Tarptautinis Vilniaus Oro Uostas',	'VNO',	'Vilnius',	'Lithuania'),
('c345e144-3b45-42d0-8dda-e7813f34588e',	'Lal Bahadur Shastri International Airport Varanasi Benares Utter Pradesh',	'VNS',	'Up',	'India'),
('6369511f-8454-4378-a18d-a1c2ebfe59c3',	'Van Nuys Airport Los Angeles California',	'VNY',	'Ca',	'United States'),
('88a04131-0c21-4b05-9ebd-5c3abefe9ba5',	'Volgograd International',	'VOG',	'Airport',	'Russia'),
('214c6a8e-00e8-48fa-bd49-0832d2be5048',	'Voronezh-chertovitskoye International Airport Voronezh',	'VOZ',	'Lipetsk',	'Russia'),
('cc046adf-c649-44f7-92aa-5015f62e7f05',	'Destin–fort Walton Beach Airport Fort Destin Florida',	'VPS',	'Fl',	'United States'),
('1fc23612-4442-4e11-95a7-00e4c2f16d02',	'Juan Gualberto Gómez Airport Varadero',	'VRA',	'Matanzas',	'Cuba'),
('febcf79a-e77b-49e8-8256-2af4d609f06c',	'Aeroporto Di Verona-villafranca Airport Verona',	'VRN',	'Villafranca',	'Italy'),
('7692f819-1b84-484b-8b39-544d70d4677e',	'Wattay International Airport',	'VTE',	'Vientiane',	'Laos'),
('40195e13-deac-407e-bbb9-30c92aea5c5c',	'Visakhapatnam International Airport Andhra Pradesh',	'VTZ',	'Ap',	'India'),
('6e228515-98f3-481b-9d69-05c96d03286f',	'Aeropuerto Internacional Viru International Airport Santa Cruz De La',	'VVI',	'Sierra',	'Bolivia'),
('12049fa1-b8a5-4b17-8248-5343922a27b0',	'Waterford',	'WAT',	'Airport',	'Ireland'),
('3e30e0c1-59da-46e8-b418-29dbc7672b83',	'Lotnisko Chopina W Warszawie Warsaw',	'WAW',	'Chopin',	'Poland'),
('f1f4decf-c032-45e3-ab89-a61f21ac75bb',	'Hosea Kutako International Airport',	'WDH',	'Windhoek',	'Namibia'),
('1bcf5823-4260-4b4e-a6fa-98750ce2a35b',	'Bandar Udara Umbu Mehang Kunda Airport Waingapu Sumba East Nusa',	'WGP',	'Tenggara',	'Indonesia'),
('87a4832b-2893-4934-b522-8859b6db6526',	'Wellington International Airport',	'WLG',	'Rongotai',	'New Zealand'),
('c5caee1e-2bd6-4662-899a-e98aa0900164',	'Mazowiecki Port Lotniczy Warsaw Nowy',	'WMI',	'Dwór',	'Poland'),
('111ed91e-7944-467b-a87a-653f4ad3ce7c',	'Wuhan Tianhe International',	'WUH',	'Airport',	'China'),
('1c4e3f91-2db3-4f14-93fd-795dd792a057',	'Sunan Shuofang International Airport Wuxi',	'WUX',	'Suzhou',	'China'),
('f9cd34c6-7694-495a-8834-6359c7f9ba78',	'Christmas Island',	'XCH',	'Airport',	'Australia'),
('bc1be061-ecc8-43d0-9b89-773769a29c1f',	'Airbus-werk Hamburg-finkenwerder Hamburg',	'XFW',	'Finkenwerder',	'Germany'),
('9a24f0fd-6a2a-4c6c-be2c-67a9e97d674b',	'Xi''an Xianyang International Airport',	'XIY',	'Shaanxi',	'China'),
('e16d166c-50be-42b8-b45a-6e70134bec1f',	'Xiamen Gaoqi International Airport Huli',	'XMN',	'District',	'China'),
('ce959abc-64a6-4f02-91a1-2c76948aef1f',	'Northwest Arkansas Regional Airport Fayetteville Springdale',	'XNA',	'Ar',	'United States'),
('7e3beca4-b6bd-4882-8d08-0c03a7d50c3d',	'Xining Caojiabao Airport Huzhu',	'XNN',	'Qinghai',	'China'),
('5e222a19-0e79-4f37-a50d-cda897825fc8',	'Aeropuerto De Jerez La',	'XRY',	'Frontera',	'Spain'),
('b61636ff-8f9f-4c1b-aa05-c9521e262c43',	'Sault Ste. Marie Airport Ontario',	'YAM',	'On',	'Canada'),
('c8020dc5-88f4-4165-a74f-b86d3874bad2',	'International',	'YAP',	'Airport',	'Micronesia'),
('480ebfef-0404-4feb-ae00-b3623747cfc0',	'Tofino/long Beach Airport Tofino Long British Columbia',	'YAZ',	'Bc',	'Canada'),
('23b409a9-b9c5-42bc-8d07-ccd63ef9a46c',	'Nanaimo Airport Cassidy British Columbia',	'YCD',	'Bc',	'Canada'),
('c90d8b7e-a49f-499a-8907-086fb4fdfb58',	'Kannur International Airport Thalassery Kerala',	'CNN',	'Kl',	'India'),
('90280870-8fff-47a3-bd42-5e3803da48a5',	'Aeropuerto Internacional Rafael Núñez Cartagena',	'CTG',	'Bolívar',	'Colombia'),
('4a59d493-980d-4dde-9e84-fb6478959e8d',	'Aeroporto Internacional Presidente Nicolau Lobato International Airport Dili Timor-leste',	'DIL',	'East',	'Timor'),
('684aa8b5-042c-44ec-9cf2-1ffaa86abe79',	'Dnipropetrovsk International',	'DNK',	'Airport',	'Ukraine'),
('c72c33ad-6feb-45ca-8741-842a127331bf',	'Aéroport De Dinard–pleurtuit–saint-malo Airport Saint-malo',	'DNR',	'Pleurtuit',	'France'),
('34a7f3d8-182f-493f-9294-f32e06588a03',	'East Midlands Airport Nottingham Castle Donington',	'EMA',	'England',	'United Kingdom'),
('1e740389-a052-4238-951f-70973651bbdf',	'Venango Regional Airport Franklin Oil City Pennsylvania',	'FKL',	'Pa',	'United States'),
('55b7d029-f23e-40c0-a971-b2fa318307a6',	'Fort Lauderdale–hollywood International Airport Lauderdale Miami Florida',	'FLL',	'Fl',	'United States'),
('80d05ca9-97f9-41bc-a499-c19464a45bba',	'Aeroporto Internacional Do Galeão–antonio Carlos Jobim International Airport Rio De Janeiro',	'GIG',	'Rj',	'Brazil'),
('21fc7389-bea9-4f31-95f4-614cc11d53d4',	'Aeropuerto Internacional José Joaquín De Olmedo Guayaquil',	'GYE',	'Guayas',	'Ecuador'),
('e88725c8-9c55-43ed-876b-033fb0670e89',	'Bowerman Airport Hoquiam Grays Harbor County Washington',	'HQM',	'Wa',	'United States'),
('53caac85-cdfe-4b4e-9cfb-4903cba3827c',	'Gove Airport Nhulunbuy Peninsula Northern Territory',	'GOV',	'Nt',	'Australia'),
('8e3035f0-d6d2-4f8d-94d7-52e17860db79',	'Laughlin/bullhead International Airport Bullhead City Nevada Arizona',	'IFP',	'Az',	'United States'),
('c41f76e3-af14-4206-8a3b-17611754c994',	'Jackson–medgar Wiley Evers International Airport Jackson Mississippi',	'JAN',	'Ms',	'United States'),
('893b7633-95a8-4bb8-ae3f-2c7f1048a811',	'Jacksonville International Airport Florida',	'JAX',	'Fl',	'United States'),
('9961e0ca-7f88-45f7-b798-4bb7c676b9c0',	'Aeroporto Regional Sul - Humberto Ghizzo Bortoluzzi Airport Jaguaruna Santa Catarina',	'JJG',	'Sc',	'Brazil'),
('bf258a48-4a14-44d2-9020-a77793bb9010',	'Międzynarodowy Port Lotniczy Katowice Pyrzowice Silesian',	'KTW',	'Voivodeship',	'Poland'),
('5d12a13c-c810-48f2-81d9-157a83af3ece',	'Purdue University Airport Lafayette West Indiana',	'LAF',	'In',	'United States'),
('a954c5df-9788-434c-ba67-c3da5013ca37',	'Bandar Udara Komodo Airport Labuan Bajo Flores',	'LBJ',	'Island',	'Indonesia'),
('bd105053-c7a0-4440-9731-2a1b99db6758',	'Aeropuerto Internacional Daniel Oduber Quirós International Airport',	'LIR',	'Liberia',	'Costa Rica'),
('d933c907-a189-4104-ade9-9196b9c05df0',	'Aeropuerto Adolfo Suárez Madrid-barajas Madrid–barajas Airport Madrid',	'MAD',	'Barajas',	'Spain'),
('13c9b220-b10e-443a-8aa7-1da5b3ae021b',	'Aeroporto Internacional Brigadeiro Eduardo Gomes International Airport Manaus Amazonas',	'MAO',	'Am',	'Brazil'),
('823e7cbd-d61b-4d4c-a663-ac104bbf6eca',	'Aéroport De Marseille Provence',	'MRS',	'Marignane',	'France'),
('ff40b936-fdc1-475f-a62d-6c322c3e9ee0',	'Minsk National Airport',	'MSQ',	'Kastrychnitski',	'Belarus'),
('ca43102b-2737-4d88-afd8-ea1301e6d071',	'Yuma International Airport Arizona',	'YUM',	'Az',	'United States'),
('fb3d4513-88bd-49d2-841e-f7e433b9324e',	'James Armstrong Richardson International Airport Winnipeg Manitoba',	'YWG',	'Mb',	'Canada'),
('f7b17550-623f-4e8a-81a8-28ff02018f47',	'Saskatoon John G. Diefenbaker International Airport Saskatchewan',	'YXE',	'Sk',	'Canada'),
('deaf391b-dace-469a-9a1f-bf3fc9fcff01',	'Medicine Hat Airport Alberta',	'YXH',	'Ab',	'Canada'),
('524fa105-05eb-430e-9f4e-fcfffe602cab',	'London International Airport Ontario',	'YXU',	'On',	'Canada'),
('cba1ff51-a9c1-4dbf-abc2-33b68dcfac61',	'Abbotsford International Airport British Columbia',	'YXX',	'Bc',	'Canada'),
('c2dab132-f2e3-4ea8-bd8a-a9e660b19d6f',	'Erik Nielsen Whitehorse International Airport Yukon',	'YXY',	'Yt',	'Canada'),
('97da81c9-8e06-4834-b989-fc3a339f8872',	'Calgary International Airport Alberta',	'YYC',	'Ab',	'Canada'),
('8a9668a8-339d-48f2-82e8-f86e04f58c45',	'Smithers Regional Airport British Columbia',	'YYD',	'Bc',	'Canada'),
('64a78e33-29ad-460a-ac31-fd4e13a99bf4',	'Victoria International Airport British Columbia',	'YYJ',	'Bc',	'Canada'),
('f3861e0e-a9b4-44a1-84b8-c261b17ed765',	'St. John’s International Airport Newfoundland And Labrador',	'YYT',	'Nl',	'Canada'),
('ef4c0a3e-3c81-485a-abd0-37bf81cb8e2f',	'Pearson International Airport Toronto Malton Ontario',	'YYZ',	'On',	'Canada'),
('6b78ab80-8f0a-4dcc-aa0a-95d94efd6498',	'Yellowknife Airport Northwest Territories',	'YZF',	'Nt',	'Canada'),
('4c2733dd-30ee-4227-878d-434ac2741034',	'Zračna Luka Zadar/zemunik',	'ZAD',	'Zadar',	'Croatia'),
('1f7bf04e-c906-4822-8f46-14c4f3e7d278',	'Međunarodna Zračna Luka Zagreb',	'ZAG',	'Pleso',	'Croatia'),
('6896f128-3d96-462e-886c-90f8ec1fbd72',	'Aeropuerto De',	'ZAZ',	'Zaragoza',	'Spain'),
('ba84a40d-4ed8-4cda-ae6b-3f53f2a22812',	'Aeropuerto Internacional General Leobardo C. Ruiz Zacatecas',	'ZCL',	'Fresnillo',	'Mexico'),
('811dfb4c-18bd-45ae-adc8-7e08a8ad4562',	'Zhukovsky International Airport',	'ZIA',	'Moscow',	'Russia'),
('40169ea9-5e68-4d0d-bac7-07cbff52dcc2',	'Aeropuerto Internacional De Ixtapa-zihuatanejo Zihuatanejo Ixtapa Guerrero',	'ZIH',	'Gr',	'Mexico'),
('45a59e20-0061-4f4e-900d-cf5728511f60',	'Aeropuerto Internacional Playa De Oro International Airport Manzanillo Colima',	'ZLO',	'Cl',	'Mexico'),
('3f667ba4-21cd-4b1f-8796-4d2909a5a07d',	'Queenstown Airport',	'ZQN',	'Frankton',	'New Zealand'),
('5c37ae7b-34f9-49a9-8216-f1fd4ea70907',	'Flughafen Zürich',	'ZRH',	'Zurich',	'Switzerland'),
('439feadf-65bf-4ce0-9a99-80ffc2ebda23',	'Lehigh Valley International Airport Allentown Pennsylvania',	'ABE',	'Pa',	'United States'),
('77b4ff96-aa8c-4db7-9d57-b9693d7a7445',	'San Luis Valley Regional Airport Alamosa Colorado',	'ALS',	'Co',	'United States'),
('8d47348a-8128-49a7-9f3b-5386ec9780a6',	'Watertown International Airport New York',	'ART',	'Ny',	'United States'),
('bf717ce7-4cd5-4d23-9968-530734b62a63',	'Aeropuerto Internacional Silvio Pettirossi Asunción',	'ASU',	'Luque',	'Paraguay'),
('2fba4214-dc09-43f7-815b-b4ff94ee2bc1',	'Lapangan Terbang Antarabangsa Kota Kinabalu',	'BKI',	'Sabah',	'Malaysia'),
('15541f92-d861-4d55-acfb-3638d1e44584',	'Aéroport International De Bamako–sénou Senou Airport',	'BKO',	'Bamako',	'Mali'),
('d2b31162-89c3-4610-b750-93870bdea4ed',	'Brownsville/south Padre Island International Airport Brownsville South Texas',	'BRO',	'Tx',	'United States'),
('4eba1c29-8042-4e1b-9da2-5f64e052fb8a',	'International Aeroporto Di Cagliari Elmas Airport',	'CAG',	'Sardinia',	'Italy'),
('40a2eb4e-7a66-4935-a300-b22b247b8f25',	'Aeropuerto Internacional De Maiquetia “simón Bolívar” Simón Bolívar International Airport Caracas',	'CCS',	'Maiquetía',	'Venezuela'),
('995d1c5b-54d2-4145-afbc-0b01270142e9',	'Aeropuerto Internacional De Carrasco/general Cesáreo L. Berisso International Airport Montevideo',	'MVD',	'Canelones',	'Uruguay'),
('9a689ebc-6ece-4803-a969-0191c865cbef',	'Oakland County International Airport Waterford Township Michigan',	'PTK',	'Mi',	'United States'),
('910f0deb-bca3-474f-8074-d13187570bad',	'Raleigh–durham International Airport Raleigh Durham North Carolina',	'RDU',	'Nc',	'United States'),
('1f3cf245-df22-49df-8a4a-1519c6e4dffb',	'Aeroporto Internazionale Federico Fellini International Airport Rimini San',	'RMI',	'Marino',	'Italy'),
('a1f8b461-544c-4d4b-a825-794b739971bc',	'Aeropuerto Internacional Las Américas International Airport Santo Domingo Punta',	'SDQ',	'Caucedo',	'Dominican Republic'),
('5d33a3c7-5659-4652-b8f9-9d02a8de153a',	'Aéroport International De Sfax-thyna Sfax',	'SFA',	'Thyna',	'Tunisia'),
('70e0b2e6-9a68-4bf2-8323-e2a1b70fff01',	'Aeropuerto Internacional De Los Cabos International Airport San José Del Cabo Lucas Baja California Sur',	'SJD',	'Bs',	'Mexico'),
('d304a2fd-a333-4eac-b4d3-ce9b699a736f',	'Aeropuerto Internacional Del Cibao Santiago De Los',	'STI',	'Caballeros',	'Dominican Republic'),
('4e5e2f8d-ff42-4c4b-8ccc-42dc4def6a3c',	'Bandar Udara Internasional Juanda International Airport Surabaya Sidoarjo East',	'SUB',	'Java',	'Indonesia'),
('fe217361-a91e-44cd-87f9-8a3ac224e869',	'Aéroport De Toulouse–blagnac Toulouse',	'TLS',	'Blagnac',	'France'),
('ea72677b-67ba-42ba-b457-c5b8e84ed260',	'Jinan Yaoqiang International Airport',	'TNA',	'Shandong',	'China'),
('356f5086-dc93-460e-af9d-eb275201761c',	'Aeropuerto Teniente Rodolfo Marsh Airport King George Island Villa Las',	'TNM',	'Estrellas',	'Antarctica'),
('3ef3bbe1-83a0-41eb-8ba6-3be6cd6322ab',	'Aeroporto Internacional De Viracopos/campinas Viracopos International Airport Campinas São Paulo',	'VCP',	'Sp',	'Brazil'),
('eca45ce3-9ecb-4d78-a8c9-723b64e14fba',	'Aeropuerto De Valencia',	'VLC',	'Manises',	'Spain'),
('795677e4-1483-4dff-8de5-3e5635d3d0ee',	'Bauerfield International Airport Port',	'VLI',	'Vila',	'Vanuatu'),
('081a98a4-e780-4a2c-ab12-1a10dcea9e79',	'Port Lotniczy Wrocław Im. Mikołaja Kopernika Wroclaw Lower Silesian',	'WRO',	'Voivodeship',	'Poland'),
('b0c9793f-2246-4d09-ba04-5e4300161156',	'Aéroport International Pierre-elliott-trudeau De Montréal Montréal–pierre Elliott Trudeau Montreal Dorval Quebec',	'YUL',	'Qc',	'Canada'),
('a9432a75-868e-4374-9547-2f5518ec160e',	'Vancouver International Airport Richmond British Columbia',	'YVR',	'Bc',	'Canada'),
('f2157698-0ed5-432f-a531-e72272826abd',	'Nome Airport Alaska',	'OME',	'Ak',	'United States'),
('25382696-37e0-42cb-95e4-023b646074fa',	'Mostar International Airport',	'OMO',	'Ortiješ',	'Bosnia And Herzegovina'),
('e0406e51-fe35-499c-bf06-f0bf8f4ce13e',	'Aéroport International Toussaint L''ouverture Airport Port-au-prince',	'PAP',	'Tabarre',	'Haiti'),
('d4493700-b6e5-4b0a-a917-eec06eb3b0d3',	'Bandar Udara Internasional Minangkabau International Airport Padang West',	'PDG',	'Sumatra',	'Indonesia'),
('b2a11a53-f3cc-41d8-bdab-41729035ae9a',	'Beijing Daxing International Airport Chaoyang',	'PKX',	'District',	'China'),
('197f087c-0126-459e-a572-454dd9002a83',	'Providenciales International Airport Caicos',	'PLS',	'Islands',	'United Kingdom'),
('497fbb67-6a7d-4c08-bad6-292a0bfc4545',	'Aeroporto Internacional De Salvador-deputado Luís Eduardo Magalhães Deputado Salvador Bahia',	'SSA',	'Ba',	'Brazil'),
('5848f9b4-7f68-4969-8702-d860569fe9a6',	'Bandar Udara Internasional Husein Sastranegara International Airport Bandung West',	'BDO',	'Java',	'Indonesia'),
('384e1b66-f709-4abf-b2d0-db7e5c3987c0',	'Paliparang Pandaigdig Ng Francisco Bangoy International Airport Davao City Catitipan',	'DVO',	'Mindanao',	'Philippines'),
('e2c37eda-c151-4dc6-947c-537b2c3026a7',	'Gulfport–biloxi International Airport Biloxi Mississippi',	'GPT',	'Ms',	'United States'),
('dd25145b-302e-407c-bea5-cb849a0fb18d',	'Aerodrom Ohrid “sv. Apostol Pavle” Saint Paul The Apostle',	'OHD',	'Orovnik',	'Macedonia'),
('71d3a355-7e68-4f0e-8802-41903630e6ae',	'Flughafen Rostock–laage Rostock',	'RLG',	'Laage',	'Germany'),
('3cbb9b5b-d3da-426a-bf28-91e4242b5024',	'Telluride Regional Airport Colorado',	'TEX',	'Co',	'United States'),
('8855d3d7-595c-4230-a4c7-55fbd120f505',	'Aeropuerto De Tenerife Sur Reina Sofía Playa Las Américas Canary',	'TFS',	'Islands',	'Spain'),
('6f593a05-f63d-4208-b229-563d827e36b3',	'Aeropuerto Tingo María',	'TGI',	'Huánuco',	'Peru'),
('0ce02ca3-3406-4493-8bb5-2644834ad02d',	'Aeroportul Transilvania Târgu Mureș Airport',	'TGM',	'Vidrasău',	'Romania'),
('3def5302-806b-48e4-804f-9cda84dd05ea',	'Aeropuerto Internacional Toncontín International Airport',	'TGU',	'Tegucigalpa',	'Honduras'),
('f5449255-e658-4d0e-995f-2f4703b0b5a1',	'Laredo International Airport Texas',	'LRD',	'Tx',	'United States'),
('9ade286f-dee3-4978-bd9f-6382a6b04628',	'Aeropuerto Internacional Padre Aldamiz International Airport Puerto Maldonado Madre De',	'PEM',	'Dios',	'Peru'),
('baff85a2-2364-442e-bd31-972bbae60ce3',	'Lapangan Terbang Antarabangsa Pulau Pinang Penang International Airport Bayan',	'PEN',	'Lepas',	'Malaysia'),
('e4ee145e-6163-4742-8661-40337c421a2b',	'St. Pete–clearwater International Airport Clearwater Pinellas County Florida',	'PIE',	'Fl',	'United States');

DROP TABLE IF EXISTS "Attendance";
CREATE TABLE "public"."Attendance" (
    "id" text NOT NULL,
    "agentId" text NOT NULL,
    "date" date NOT NULL,
    "checkInTime" timestamp(3),
    "checkOutTime" timestamp(3),
    "status" "AttendanceStatus" NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Attendance_agentId_date_key" ON public."Attendance" USING btree ("agentId", date);

INSERT INTO "Attendance" ("id", "agentId", "date", "checkInTime", "checkOutTime", "status", "createdAt", "updatedAt") VALUES
('8a927c54-c027-4be7-adef-d8ae82b2cff2',	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-06-30',	'2026-06-30 17:59:32.36',	'2026-06-30 17:59:37.374',	'PRESENT',	'2026-06-30 17:59:32.362',	'2026-06-30 17:59:37.375'),
('70f16bb7-d462-4fc7-a9d8-668946a62241',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	'2026-06-30',	NULL,	NULL,	'ABSENT',	'2026-06-30 23:59:00.233',	'2026-06-30 23:59:00.233'),
('815fc5f9-d7b6-4b7a-9576-ea67d3ddb285',	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-06-30',	NULL,	NULL,	'ABSENT',	'2026-06-30 23:59:00.429',	'2026-06-30 23:59:00.429'),
('4ab075c4-57c5-4e72-8dc8-0442bd250c5b',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	'2026-06-30',	NULL,	NULL,	'ABSENT',	'2026-06-30 23:59:00.455',	'2026-06-30 23:59:00.455'),
('833b6a72-6ad0-42c2-87a3-58f185da8734',	'e2f5808a-8809-4668-9e63-29444d0f988b',	'2026-06-30',	NULL,	NULL,	'ABSENT',	'2026-06-30 23:59:00.518',	'2026-06-30 23:59:00.518'),
('22f96ce2-9101-4c1a-ac73-da95fe4c768b',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'2026-06-30',	NULL,	NULL,	'ABSENT',	'2026-06-30 23:59:00.6',	'2026-06-30 23:59:00.6'),
('011f67e1-0876-4860-935f-9bb49f0d14d4',	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-06-30',	'2026-06-30 18:58:50.374',	NULL,	'ABSENT',	'2026-06-30 18:58:50.375',	'2026-06-30 23:59:00.623'),
('c77684c5-2f69-4e29-8c88-4c132fbc52ed',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	'2026-06-30',	NULL,	NULL,	'ABSENT',	'2026-06-30 23:59:00.653',	'2026-06-30 23:59:00.653'),
('3bc680a2-f539-4f8a-9c12-619393ec47d1',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	'2026-07-01',	'2026-07-01 15:31:44.952',	'2026-07-01 17:11:49.507',	'PRESENT',	'2026-07-01 15:31:44.953',	'2026-07-01 17:11:49.508'),
('e6be573d-44be-481b-98e8-6282b6b27df0',	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-07-01',	'2026-07-01 14:07:15.926',	'2026-07-01 21:21:48.832',	'PRESENT',	'2026-07-01 14:07:15.927',	'2026-07-01 21:21:48.833'),
('8511daac-0eab-462c-a49d-75e2bb26b4a4',	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-07-01',	'2026-07-01 14:09:00.446',	NULL,	'ABSENT',	'2026-07-01 14:09:00.447',	'2026-07-01 23:59:00.117'),
('e9b45cf9-011e-46ed-868b-bac3f901a784',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	'2026-07-01',	NULL,	NULL,	'ABSENT',	'2026-07-01 23:59:00.13',	'2026-07-01 23:59:00.13'),
('831a1c86-1edd-4588-8eda-f822b860b90f',	'e2f5808a-8809-4668-9e63-29444d0f988b',	'2026-07-01',	NULL,	NULL,	'ABSENT',	'2026-07-01 23:59:00.138',	'2026-07-01 23:59:00.138'),
('0d232971-2087-4a15-a857-032276eb69b5',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'2026-07-01',	'2026-07-01 10:33:33.689',	NULL,	'ABSENT',	'2026-07-01 10:33:33.69',	'2026-07-01 23:59:00.151'),
('aff9c146-586d-4f5d-84c0-49b22190a7a7',	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-01',	NULL,	NULL,	'ABSENT',	'2026-07-01 23:59:00.163',	'2026-07-01 23:59:00.163'),
('d7745bec-85f6-4cb3-ae45-7e37140bcac9',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	'2026-07-01',	'2026-07-01 09:00:00',	'2026-07-01 18:00:00',	'PRESENT',	'2026-07-01 23:59:00.088',	'2026-07-02 14:30:46.917'),
('5cddce38-a7f9-4812-9c18-6d1105aedfb2',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	'2026-07-02',	'2026-07-02 08:00:34.301',	'2026-07-02 17:44:41.931',	'PRESENT',	'2026-07-02 08:00:34.303',	'2026-07-02 17:44:41.934'),
('597ea6d4-e6df-464d-8bab-41c7df4bba2f',	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-07-02',	'2026-07-02 12:13:59.611',	'2026-07-02 19:25:41.582',	'PRESENT',	'2026-07-02 12:13:59.613',	'2026-07-02 19:25:41.583'),
('b485a683-d583-45f6-8cfc-f83d405acfd9',	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-07-02',	'2026-07-02 11:49:15.71',	'2026-07-02 20:09:02.818',	'PRESENT',	'2026-07-02 11:49:15.712',	'2026-07-02 20:09:02.82'),
('d3fba964-5111-410c-83f6-e05d97af1bdd',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	'2026-07-02',	'2026-07-02 09:00:00',	NULL,	'ABSENT',	'2026-07-02 11:29:49.845',	'2026-07-02 23:59:00.082'),
('1271271b-f3e4-4222-bf8d-a22d171f5ef9',	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	'2026-07-02',	NULL,	NULL,	'ABSENT',	'2026-07-02 23:59:00.134',	'2026-07-02 23:59:00.134'),
('6a434f7a-0eac-475b-8fec-95ae967c0e47',	'e2f5808a-8809-4668-9e63-29444d0f988b',	'2026-07-02',	NULL,	NULL,	'ABSENT',	'2026-07-02 23:59:00.154',	'2026-07-02 23:59:00.154'),
('f8e2375d-a241-4e3e-83aa-d6ebc2a2bafd',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'2026-07-02',	'2026-07-02 10:29:04.672',	NULL,	'ABSENT',	'2026-07-02 10:29:04.675',	'2026-07-02 23:59:00.167'),
('9ae9dd24-1715-4721-8e97-62c84b70cfae',	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-02',	'2026-07-02 10:22:51.797',	NULL,	'ABSENT',	'2026-07-02 10:22:51.799',	'2026-07-02 23:59:00.188'),
('29b5cc25-02a7-4830-855d-db307cbe1e3f',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	'2026-07-03',	'2026-07-03 08:00:14.296',	NULL,	'PRESENT',	'2026-07-03 08:00:14.297',	'2026-07-03 08:00:14.297'),
('d4a6fdfe-f4c8-4ea5-9af9-bee6b2f9b2f1',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	'2026-07-03',	'2026-07-03 09:07:02.493',	NULL,	'PRESENT',	'2026-07-03 09:07:02.495',	'2026-07-03 09:07:02.495'),
('640892e9-badf-443e-a54d-9ea51bfc783e',	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03',	'2026-07-03 09:44:04.283',	NULL,	'PRESENT',	'2026-07-03 09:44:04.285',	'2026-07-03 09:44:04.285'),
('2bdf57aa-dd94-4555-8a5a-7e527bd72e21',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'2026-07-03',	'2026-07-03 11:08:40.535',	NULL,	'PRESENT',	'2026-07-03 11:08:40.537',	'2026-07-03 11:08:40.537'),
('43559116-5609-4c85-bfd8-5a8da9a70e28',	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-07-03',	'2026-07-03 11:08:42.492',	NULL,	'PRESENT',	'2026-07-03 11:08:42.493',	'2026-07-03 11:08:42.493'),
('ac2ae70d-cd20-4893-8d1b-c88e43853cf1',	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-07-03',	'2026-07-03 12:07:00.429',	NULL,	'PRESENT',	'2026-07-03 12:07:00.431',	'2026-07-03 12:07:00.431');

DROP TABLE IF EXISTS "AuditLog";
CREATE TABLE "public"."AuditLog" (
    "id" text NOT NULL,
    "userId" text,
    "action" text NOT NULL,
    "ipAddress" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "module" text NOT NULL,
    "newValue" jsonb,
    "oldValue" jsonb,
    "recordId" text,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "AuditLog" ("id", "userId", "action", "ipAddress", "createdAt", "module", "newValue", "oldValue", "recordId") VALUES
('6c6c2ebd-ae35-4bea-aa8f-61cd9e49236c',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 12:54:57.141',	'Users',	'{"id": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "email": "admin@terrifictravel.co.uk", "roles": ["SUPER_ADMIN"], "agentId": null, "isActive": true, "lastName": "Sanwal", "createdAt": "2026-06-19T17:09:20.816Z", "firstName": "Hasnain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage"], "isEmailVerified": true}',	'{"id": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "email": "admin@tms.com", "roles": ["SUPER_ADMIN"], "agentId": null, "isActive": true, "lastName": "Administrator", "createdAt": "2026-06-19T17:09:20.816Z", "firstName": "System", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage"], "isEmailVerified": true}',	'baf4459c-aeb3-464e-b39e-7a1b26430b59'),
('3d396edd-665e-4e9f-aaca-b63a2b61b000',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 12:55:29.236',	'Users',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own"], "isEmailVerified": true}',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "agent@tms.com", "roles": ["Agent", "TRAVEL_AGENT"], "agentId": null, "isActive": true, "lastName": "Agent", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Jane", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "flights:read", "hotels:read", "tours:read", "bookings:write", "payments:write"], "isEmailVerified": true}',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('332f033e-4432-40b8-9eb2-3f451dc1cd6e',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 12:55:38.719',	'Users',	'{"message": "Password reset by operator. Temporary password assigned: y031bvbp"}',	'null',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('ea1d65cd-fd17-49fe-b3e8-bbba2b2bfbc5',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 12:57:39.929',	'Users',	'{"id": "55409749-d91c-4cd6-a2e3-e4c329915383", "email": "customer@terrifictravel.co.uk", "roles": ["Customer"], "agentId": null, "isActive": true, "lastName": "Customer", "createdAt": "2026-06-26T12:53:31.197Z", "firstName": "John", "permissions": [], "isEmailVerified": true}',	'{"id": "55409749-d91c-4cd6-a2e3-e4c329915383", "email": "customer@tms.com", "roles": ["Customer", "CUSTOMER"], "agentId": null, "isActive": true, "lastName": "Customer", "createdAt": "2026-06-26T12:53:31.197Z", "firstName": "John", "permissions": [], "isEmailVerified": true}',	'55409749-d91c-4cd6-a2e3-e4c329915383'),
('0fb8c868-8585-45bf-aaa4-d9747b839559',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 12:57:43.917',	'Users',	'{"id": "2de1a44c-4c5b-4113-8c59-62b42916a171", "email": "manager@terrifictravel.co.uk", "roles": ["Manager"], "agentId": null, "isActive": true, "lastName": "Manager", "createdAt": "2026-06-26T12:53:31.163Z", "firstName": "System", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own"], "isEmailVerified": true}',	'{"id": "2de1a44c-4c5b-4113-8c59-62b42916a171", "email": "manager@tms.com", "roles": ["Manager"], "agentId": null, "isActive": true, "lastName": "Manager", "createdAt": "2026-06-26T12:53:31.163Z", "firstName": "System", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own"], "isEmailVerified": true}',	'2de1a44c-4c5b-4113-8c59-62b42916a171'),
('c0cadf9f-a647-4238-9f78-65dcdf303b0f',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 13:15:18.955',	'Bookings',	'{"id": "c3e90e57-40d7-4fbf-aa2b-caa746b42ab9", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "createdAt": "2026-06-19T17:11:20.041Z", "updatedAt": "2026-06-26T13:15:18.934Z", "paidAmount": 0, "totalPrice": 1500, "createdById": null, "assignedToId": null, "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-19T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 0, "bookingReference": "TT1101", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "c3e90e57-40d7-4fbf-aa2b-caa746b42ab9", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": null, "createdAt": "2026-06-19T17:11:20.041Z", "updatedAt": "2026-06-19T17:11:20.041Z", "paidAmount": 0, "totalPrice": 1500, "createdById": null, "assignedToId": null, "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-19T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 0, "bookingReference": "TT1101", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'c3e90e57-40d7-4fbf-aa2b-caa746b42ab9'),
('5bef1671-d49b-4959-963e-3de095d931f6',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 13:17:55.42',	'Bookings',	'{"id": "c3e90e57-40d7-4fbf-aa2b-caa746b42ab9", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "createdAt": "2026-06-19T17:11:20.041Z", "updatedAt": "2026-06-26T13:17:55.399Z", "paidAmount": 0, "totalPrice": 1500, "createdById": null, "assignedToId": null, "lockedStatus": "LOCKED", "refundAmount": 0, "departureDate": "2026-06-19T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 0, "bookingReference": "TT1101", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "c3e90e57-40d7-4fbf-aa2b-caa746b42ab9", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "createdAt": "2026-06-19T17:11:20.041Z", "updatedAt": "2026-06-26T13:15:18.934Z", "paidAmount": 0, "totalPrice": 1500, "createdById": null, "assignedToId": null, "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-19T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 0, "bookingReference": "TT1101", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'c3e90e57-40d7-4fbf-aa2b-caa746b42ab9'),
('14b3a6d8-a182-49a5-b578-e9d7e44be929',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 13:17:56.42',	'Bookings',	'{"id": "c3e90e57-40d7-4fbf-aa2b-caa746b42ab9", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "createdAt": "2026-06-19T17:11:20.041Z", "updatedAt": "2026-06-26T13:17:56.406Z", "paidAmount": 0, "totalPrice": 1500, "createdById": null, "assignedToId": null, "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-19T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 0, "bookingReference": "TT1101", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "c3e90e57-40d7-4fbf-aa2b-caa746b42ab9", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "createdAt": "2026-06-19T17:11:20.041Z", "updatedAt": "2026-06-26T13:17:55.399Z", "paidAmount": 0, "totalPrice": 1500, "createdById": null, "assignedToId": null, "lockedStatus": "LOCKED", "refundAmount": 0, "departureDate": "2026-06-19T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 0, "bookingReference": "TT1101", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'c3e90e57-40d7-4fbf-aa2b-caa746b42ab9'),
('7396b23a-b191-4c64-a3ca-82a26f2000e6',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 13:39:34.435',	'Users',	'{"message": "Password reset by operator. Temporary password assigned: dab307w9"}',	'null',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('aa960e2a-ac5b-4951-8b93-120280733570',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-26 14:21:43.214',	'Users',	'{"id": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "email": "muhammad.zain@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "isActive": true, "lastName": "Malik", "createdAt": "2026-06-26T14:21:43.165Z", "firstName": "Zain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own"], "isEmailVerified": true}',	'null',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1'),
('09dacc35-3d13-48cd-a323-9bcebdc31647',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 14:21:55.152',	'Users',	'{"message": "Password reset by operator. Temporary password assigned: krk6qxsx"}',	'null',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1'),
('6b749eff-c3dd-4b0f-8cb2-b038a2c776bd',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 14:51:25.726',	'Users',	'{"id": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "email": "muhammad.zain@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "isActive": true, "lastName": "Malik", "createdAt": "2026-06-26T14:21:43.165Z", "firstName": "Zain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own"], "isEmailVerified": true}',	'{"id": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "email": "muhammad.zain@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "isActive": true, "lastName": "Malik", "createdAt": "2026-06-26T14:21:43.165Z", "firstName": "Zain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own"], "isEmailVerified": true}',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1'),
('7e82ebd0-001c-4ab9-97d2-b3eae3692caf',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-26 15:56:57.138',	'Bookings',	'{"id": "32ba5865-c826-4c7c-b4c7-33537b639330", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-26T15:56:57.047Z", "updatedAt": "2026-06-26T15:56:57.047Z", "paidAmount": 0, "passengers": [], "totalPrice": 1260, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-08-13T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 1260, "bookingReference": "TT00964", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'32ba5865-c826-4c7c-b4c7-33537b639330'),
('f0c977b8-8be2-4a11-8eda-69ea795ec6aa',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 16:15:38.329',	'Bookings',	'{"id": "32ba5865-c826-4c7c-b4c7-33537b639330", "status": "CONFIRMED", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-26T15:56:57.047Z", "updatedAt": "2026-06-26T16:15:38.305Z", "paidAmount": 1260, "totalPrice": 1260, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-08-13T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00964", "cardPaymentCharges": 12.6, "cancellationCharges": 0}',	'{"id": "32ba5865-c826-4c7c-b4c7-33537b639330", "status": "CONFIRMED", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-26T15:56:57.047Z", "updatedAt": "2026-06-26T15:59:49.732Z", "paidAmount": 1260, "totalPrice": 1247.4, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-08-13T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00964", "cardPaymentCharges": 12.6, "cancellationCharges": 0}',	'32ba5865-c826-4c7c-b4c7-33537b639330'),
('5dac104b-f97b-4e5c-bb96-5a11757e74b6',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-26 17:01:11.016',	'Users',	'{"id": "fb69c410-7863-4086-9763-1c9d771fdbd3", "email": "hamza.choudary@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "isActive": true, "lastName": "Choudary", "createdAt": "2026-06-26T17:01:10.869Z", "firstName": "Hamza", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own"], "isEmailVerified": true}',	'null',	'fb69c410-7863-4086-9763-1c9d771fdbd3'),
('b5467964-c7ad-40bd-86a9-2ba263b1190a',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 17:01:16.588',	'Users',	'{"message": "Password reset by operator. Temporary password assigned: 1aaif82m"}',	'null',	'fb69c410-7863-4086-9763-1c9d771fdbd3'),
('b7280723-895d-4c16-a781-ec95dda8ed3f',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 17:04:28.873',	'Settings',	'["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read"]',	'["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage"]',	'523a0325-a5dd-4148-b9d4-c822ad4f8824'),
('3d2787d5-a939-48c6-8cdb-e8c31f408f93',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 17:28:10.734',	'Users',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Manager"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own"], "isEmailVerified": true}',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own"], "isEmailVerified": true}',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('c02834e7-9839-459d-8cd5-930f68085ace',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 17:28:44.959',	'Settings',	'["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "bookings:write"]',	'["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own"]',	'14955e7b-4106-4e8b-83c0-11e278280425'),
('7434c961-7fc6-455b-88ff-766d2639621d',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 17:28:46.035',	'Settings',	'["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read", "bookings:write"]',	'["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read"]',	'523a0325-a5dd-4148-b9d4-c822ad4f8824'),
('4b7a6a3d-affa-4a2b-962f-49daa69f7755',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 17:28:50.227',	'Settings',	'["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"]',	'["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own"]',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a'),
('c9c845e7-4728-49b2-a5e5-7c9efbf11714',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 17:39:59.408',	'Users',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Admin"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read", "bookings:write"], "isEmailVerified": true}',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Manager"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('0977cdc9-360a-4f1e-847f-94580f3e0337',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-26 17:40:19.804',	'Users',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Admin"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read", "bookings:write"], "isEmailVerified": true}',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('30523f7a-7cac-4741-96d5-5086ba755125',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'Create',	NULL,	'2026-06-26 22:42:36.366',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "PENDING", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-06-26T22:42:36.265Z", "paidAmount": 0, "passengers": [], "totalPrice": 2560, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 2560, "bookingReference": "TT00965", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9'),
('e270b014-ccaf-4d67-a892-7d48d4b557de',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Create',	NULL,	'2026-06-28 15:48:30.236',	'Bookings',	'{"id": "59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-28T15:48:30.004Z", "updatedAt": "2026-06-28T15:48:30.004Z", "paidAmount": 0, "passengers": [], "totalPrice": 470, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-07-05T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 470, "bookingReference": "TT00963", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7'),
('505efbba-7d7f-444d-9852-eafe66c7903f',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-29 13:04:25.942',	'Users',	'{"id": "420d80dc-2d84-4454-aa76-e22b50f01213", "email": "rayan@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "isActive": true, "lastName": "ALI", "createdAt": "2026-06-29T13:04:25.915Z", "firstName": "RAYAN", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'null',	'420d80dc-2d84-4454-aa76-e22b50f01213'),
('c6be0b16-f444-497f-b8bf-c0b1a6847e56',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-29 13:04:39.184',	'Users',	'{"message": "Password reset by operator. Temporary password assigned: 9k1ez54s"}',	'null',	'420d80dc-2d84-4454-aa76-e22b50f01213'),
('172ceafe-9a90-4424-9108-c6b441a2f372',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-29 13:06:10.187',	'Users',	'{"id": "b82a98bd-f24d-4ff1-af51-53e3ebdca9e5", "email": "sheikh.ebad@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "e1f168f7-0772-4e82-9011-6745efc8c59b", "isActive": true, "lastName": "Ebad", "createdAt": "2026-06-29T13:06:10.143Z", "firstName": "Sheikh", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'null',	'b82a98bd-f24d-4ff1-af51-53e3ebdca9e5'),
('cb02097a-c921-4756-b5c2-f98cfe030938',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-29 13:06:17.309',	'Users',	'{"message": "Password reset by operator. Temporary password assigned: tieyaxis"}',	'null',	'b82a98bd-f24d-4ff1-af51-53e3ebdca9e5'),
('119968c7-8550-4321-8a93-3d9cefbcb94b',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-29 13:08:07.714',	'Users',	'{"id": "1738f420-d4af-4928-8e33-eeceb35b8c3c", "email": "aly@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "0002b9e2-464a-4502-9a36-8cd0d911c289", "isActive": true, "lastName": "Ahmad", "createdAt": "2026-06-29T13:08:07.679Z", "firstName": "Ali", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'null',	'1738f420-d4af-4928-8e33-eeceb35b8c3c'),
('df0f1517-7784-4405-83be-e712ebc27aab',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-29 13:09:46.956',	'Users',	'{"id": "e0b6c8d8-c11f-4682-af07-be0a017926a5", "email": "maira@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "ea4b8e68-8db4-4aa1-b110-0d85bae85be2", "isActive": true, "lastName": "Tanveer", "createdAt": "2026-06-29T13:09:46.926Z", "firstName": "Maira", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'null',	'e0b6c8d8-c11f-4682-af07-be0a017926a5'),
('4891acd7-25e9-43ea-bf10-45a28a7ebe9e',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-29 13:09:57.093',	'Users',	'{"message": "Password reset by operator. Temporary password assigned: zt306af7"}',	'null',	'e0b6c8d8-c11f-4682-af07-be0a017926a5'),
('0a971f6f-e72c-4640-99d9-5015e9d0fe69',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Create',	NULL,	'2026-06-29 14:33:35.087',	'Bookings',	'{"id": "cadd4698-8b26-4cf2-9b9e-891a9f29fdac", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-29T14:33:34.953Z", "updatedAt": "2026-06-29T14:33:34.953Z", "paidAmount": 0, "passengers": [], "totalPrice": 4200, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-08-27T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 4200, "bookingReference": "TT00943", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac'),
('dd115f4a-04db-4529-a8b9-087ea8cfb8b8',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Create',	NULL,	'2026-06-29 15:48:48.253',	'Bookings',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-29T15:48:48.185Z", "paidAmount": 0, "passengers": [], "totalPrice": 780, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-08-01T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 780, "bookingReference": "TT00945", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'5e668417-02ad-40c0-8c73-723257ee4349'),
('67b249fc-9203-4fa0-a47e-da4095b044f8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-29 17:11:38.601',	'Bookings',	'{"id": "28d19384-d41c-4d6d-b47e-2317e11ace06", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-29T17:11:38.493Z", "updatedAt": "2026-06-29T17:11:38.493Z", "paidAmount": 0, "passengers": [], "totalPrice": 898, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-06-30T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 898, "bookingReference": "TT00967", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'28d19384-d41c-4d6d-b47e-2317e11ace06'),
('283ee1a7-08c9-4c7f-b7e1-eb687b81795b',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Create',	NULL,	'2026-06-29 18:56:34.396',	'Bookings',	'{"id": "2a147b32-17a3-424e-8368-10978e3d5de7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T18:56:34.322Z", "updatedAt": "2026-06-29T18:56:34.322Z", "paidAmount": 0, "passengers": [], "totalPrice": 2865, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-05-10T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 2865, "bookingReference": "TT00925", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'2a147b32-17a3-424e-8368-10978e3d5de7'),
('e053e81d-c91e-4905-9e25-04dde568de65',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Create',	NULL,	'2026-06-29 18:58:08.832',	'Bookings',	'{"id": "407ecf89-910e-429b-9b6f-2a366eed0f5c", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T18:58:08.687Z", "updatedAt": "2026-06-29T18:58:08.687Z", "paidAmount": 0, "passengers": [], "totalPrice": 2850, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-05-12T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 2850, "bookingReference": "TT00924", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'407ecf89-910e-429b-9b6f-2a366eed0f5c'),
('877c76d6-160e-410a-b458-a6a4a1dd6245',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Create',	NULL,	'2026-06-29 18:59:18.917',	'Bookings',	'{"id": "63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T18:59:18.866Z", "updatedAt": "2026-06-29T18:59:18.866Z", "paidAmount": 0, "passengers": [], "totalPrice": 1055, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-06-29T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 1055, "bookingReference": "TT00968", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7'),
('4cafa889-0b25-4d35-8ad5-cd619d9ea2e1',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-29 20:40:55.976',	'Bookings',	'{"id": "63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7", "status": "CONFIRMED", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T18:59:18.866Z", "updatedAt": "2026-06-29T19:10:31.960Z", "paidAmount": 40, "totalPrice": 1055, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-29T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 1015, "bookingReference": "TT00968", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7", "status": "CONFIRMED", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T18:59:18.866Z", "updatedAt": "2026-06-29T19:10:31.960Z", "paidAmount": 40, "totalPrice": 1055, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-29T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 1015, "bookingReference": "TT00968", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7'),
('bacdbdff-701f-4c0b-89e2-29c4e4bc2d30',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-30 13:05:16.935',	'Bookings',	'{"id": "45965037-7ab0-4cb6-844d-2cd30628dc6c", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-30T13:05:16.814Z", "updatedAt": "2026-06-30T13:05:16.814Z", "paidAmount": 0, "passengers": [], "totalPrice": 1000, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-07-26T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 1000, "bookingReference": "TT00969", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'45965037-7ab0-4cb6-844d-2cd30628dc6c'),
('0285aeae-941d-4269-84df-7f024b7faea9',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-06-30 15:18:56.303',	'Bookings',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-30T15:18:56.287Z", "paidAmount": 0, "totalPrice": 920, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-08-01T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 920, "bookingReference": "TT00945", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-29T15:48:48.185Z", "paidAmount": 0, "totalPrice": 780, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-08-01T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 780, "bookingReference": "TT00945", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'5e668417-02ad-40c0-8c73-723257ee4349'),
('c80c7501-7083-405a-afb0-9a3d39fda285',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Update',	NULL,	'2026-06-30 15:20:20.822',	'Bookings',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-30T15:18:56.287Z", "paidAmount": 0, "totalPrice": 920, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-08-01T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 920, "bookingReference": "TT00945", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-30T15:18:56.287Z", "paidAmount": 0, "totalPrice": 920, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-08-01T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 920, "bookingReference": "TT00945", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'5e668417-02ad-40c0-8c73-723257ee4349'),
('c033f5a5-a203-4b8e-8474-f3443e07c0aa',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Update',	NULL,	'2026-06-30 15:21:03.945',	'Bookings',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-30T15:21:03.929Z", "paidAmount": 0, "totalPrice": 920, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-10-01T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 920, "bookingReference": "TT00945", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-30T15:18:56.287Z", "paidAmount": 0, "totalPrice": 920, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-08-01T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 920, "bookingReference": "TT00945", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'5e668417-02ad-40c0-8c73-723257ee4349'),
('b7e71aec-993e-431f-b13e-0b8bfce58535',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Create',	NULL,	'2026-06-30 16:35:23.564',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:35:23.465Z", "paidAmount": 0, "passengers": [], "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 1670, "bookingReference": "TT00970", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('e882e3a3-f2ca-4fd6-b7c5-8fd6c52d8f4f',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:35:55.202',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:35:23.465Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:35:23.465Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('a8877b80-d555-4755-9f0a-85e7d71160a1',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:36:03.711',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:36:03.683Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-19T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:35:23.465Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('9703cd47-b6b2-45d1-b5f6-fd34f7c2f5c1',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:37:23.4',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:37:23.386Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-21T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:36:30.670Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('b44447aa-8efb-4e31-82d7-c78abd33f9a6',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:37:52.336',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:37:23.386Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-21T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:37:23.386Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-21T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('c40449d4-bed9-47ef-9eda-488e2f27175b',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:36:30.684',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:36:30.670Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:36:03.683Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-19T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('77b58e21-d5db-44cb-985d-3f0d26f79819',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:39:05.851',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:37:23.386Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-21T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:37:23.386Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-21T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('8a344854-d0ab-4310-81ea-e174bc8ee5ee',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:39:14.091',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:39:14.006Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:37:23.386Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-21T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('ca6db568-92f6-4802-bf39-56dda97b1833',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:39:31.606',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:39:14.006Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:39:14.006Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('3d2ba31a-9e0b-4090-ad37-46be2ae1e5fc',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:40:29.59',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:39:14.006Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:39:14.006Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('b02f4b37-1256-49de-af6f-59241926ec08',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:40:42.932',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:40:42.921Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-21T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:39:14.006Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('ba65973b-3c1a-449e-8561-8c994db54eeb',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-06-30 16:40:49.693',	'Bookings',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:40:49.678Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-20T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "2cc7284b-affa-4eec-9a56-af93962c223b", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-06-30T16:35:23.465Z", "updatedAt": "2026-06-30T16:40:42.921Z", "paidAmount": 0, "totalPrice": 1670, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-09-21T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1670, "bookingReference": "TT00970", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'2cc7284b-affa-4eec-9a56-af93962c223b'),
('71cc327b-0a40-4edc-9d5c-455b5f47f5f2',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-06-30 16:45:00.109',	'Users',	'{"id": "c8fb18b0-04ae-4460-9267-a321aac805c6", "email": "zain@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "1e85f3e9-37fc-4704-8650-ce423408044e", "isActive": true, "lastName": "Ali", "createdAt": "2026-06-30T16:44:59.806Z", "firstName": "Zain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'null',	'c8fb18b0-04ae-4460-9267-a321aac805c6'),
('128048f6-de4a-43ff-9135-8b9a8a40b478',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Update',	NULL,	'2026-06-30 18:04:30.779',	'Bookings',	'{"id": "63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7", "status": "CONFIRMED", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T18:59:18.866Z", "updatedAt": "2026-06-30T18:04:30.756Z", "paidAmount": 547, "totalPrice": 1055, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-10-01T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 508, "bookingReference": "TT00968", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7", "status": "CONFIRMED", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T18:59:18.866Z", "updatedAt": "2026-06-30T15:15:46.941Z", "paidAmount": 547, "totalPrice": 1055, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-29T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 508, "bookingReference": "TT00968", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7'),
('b7b87692-1930-4b69-ad8d-bb9d28ed6660',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Update',	NULL,	'2026-06-30 18:08:46.357',	'Bookings',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-30T18:08:46.340Z", "paidAmount": 0, "totalPrice": 920, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-07-05T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 920, "bookingReference": "TT00945", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "5e668417-02ad-40c0-8c73-723257ee4349", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-29T15:48:48.185Z", "updatedAt": "2026-06-30T15:21:03.929Z", "paidAmount": 0, "totalPrice": 920, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-10-01T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 920, "bookingReference": "TT00945", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'5e668417-02ad-40c0-8c73-723257ee4349'),
('c4f40061-dae5-4d36-bb98-b4edfede9983',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'Create',	NULL,	'2026-07-01 10:37:54.561',	'Bookings',	'{"id": "575da188-44f7-467b-83a6-ee1cbb5b2797", "status": "PENDING", "userId": "1738f420-d4af-4928-8e33-eeceb35b8c3c", "agentId": "0002b9e2-464a-4502-9a36-8cd0d911c289", "createdAt": "2026-07-01T10:37:54.476Z", "updatedAt": "2026-07-01T10:37:54.476Z", "paidAmount": 0, "passengers": [], "totalPrice": 827, "createdById": "1738f420-d4af-4928-8e33-eeceb35b8c3c", "assignedToId": "1738f420-d4af-4928-8e33-eeceb35b8c3c", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-07-02T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 827, "bookingReference": "TT00971", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'575da188-44f7-467b-83a6-ee1cbb5b2797'),
('fec0507d-d9b2-4648-bc23-e417c5ba6be0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-01 13:46:39.355',	'Bookings',	'{"id": "28d19384-d41c-4d6d-b47e-2317e11ace06", "status": "CONFIRMED", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-29T17:11:38.493Z", "updatedAt": "2026-07-01T13:46:39.342Z", "paidAmount": 928, "totalPrice": 928, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-30T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00967", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28d19384-d41c-4d6d-b47e-2317e11ace06", "status": "CONFIRMED", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-29T17:11:38.493Z", "updatedAt": "2026-07-01T13:40:47.449Z", "paidAmount": 928, "totalPrice": 898, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-06-30T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00967", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28d19384-d41c-4d6d-b47e-2317e11ace06'),
('979ea400-7c47-45e3-9b66-54d6c3f81f1f',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Create',	NULL,	'2026-07-01 13:58:29.104',	'Bookings',	'{"id": "b3a47523-0c58-4c53-9eea-d6bcb3420600", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-01T13:58:29.000Z", "updatedAt": "2026-07-01T13:58:29.000Z", "paidAmount": 0, "passengers": [], "totalPrice": 6000, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-04-10T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 6000, "bookingReference": "TT00905", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'b3a47523-0c58-4c53-9eea-d6bcb3420600'),
('edef6523-df13-4616-982a-b32dbb2c0b7a',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-07-01 13:59:27.68',	'Bookings',	'{"id": "b3a47523-0c58-4c53-9eea-d6bcb3420600", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-01T13:58:29.000Z", "updatedAt": "2026-07-01T13:59:27.665Z", "paidAmount": 0, "totalPrice": 6000, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-07-28T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 6000, "bookingReference": "TT00905", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "b3a47523-0c58-4c53-9eea-d6bcb3420600", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-01T13:58:29.000Z", "updatedAt": "2026-07-01T13:58:29.000Z", "paidAmount": 0, "totalPrice": 6000, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-04-10T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 6000, "bookingReference": "TT00905", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'b3a47523-0c58-4c53-9eea-d6bcb3420600'),
('5ebeb6f9-da22-40d0-9052-2fef44475b7d',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Update',	NULL,	'2026-07-01 14:43:02.942',	'Bookings',	'{"id": "59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-28T15:48:30.004Z", "updatedAt": "2026-07-01T14:43:02.894Z", "paidAmount": 0, "totalPrice": 780, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-07-05T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 780, "bookingReference": "TT00963", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-28T15:48:30.004Z", "updatedAt": "2026-06-28T15:48:30.004Z", "paidAmount": 0, "totalPrice": 470, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "departureDate": "2026-07-05T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 470, "bookingReference": "TT00963", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7'),
('a7a78580-129a-43b7-aaef-7bf48f81cc47',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-01 14:57:30.908',	'Users',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": false, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('4dd1595d-a76d-41b2-b2d9-c34793ff1ebb',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'Create',	NULL,	'2026-07-01 22:44:10.564',	'Bookings',	'{"id": "e3da6462-67d7-4098-b88e-6fd2a4bd78ac", "status": "PENDING", "userId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "agentId": "1e85f3e9-37fc-4704-8650-ce423408044e", "createdAt": "2026-07-01T22:44:10.395Z", "updatedAt": "2026-07-01T22:44:10.395Z", "paidAmount": 0, "passengers": [], "totalPrice": 830, "createdById": "c8fb18b0-04ae-4460-9267-a321aac805c6", "assignedToId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "agentMarginId": null, "departureDate": "2026-07-02T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 830, "bookingReference": "TT00972", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac'),
('3c063717-e2b9-47c3-bd3a-6ad5369f8b2f',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-01 14:58:17.435',	'Users',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": false, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('85719751-ba41-41d9-846e-e5027e12389b',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-01 14:58:49.525',	'Users',	'{"id": "b82a98bd-f24d-4ff1-af51-53e3ebdca9e5", "email": "sheikh.ebad@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "e1f168f7-0772-4e82-9011-6745efc8c59b", "isActive": false, "lastName": "Ebad", "createdAt": "2026-06-29T13:06:10.143Z", "firstName": "Sheikh", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'{"id": "b82a98bd-f24d-4ff1-af51-53e3ebdca9e5", "email": "sheikh.ebad@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "e1f168f7-0772-4e82-9011-6745efc8c59b", "isActive": true, "lastName": "Ebad", "createdAt": "2026-06-29T13:06:10.143Z", "firstName": "Sheikh", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'b82a98bd-f24d-4ff1-af51-53e3ebdca9e5'),
('18fc7fc4-83a5-446d-a249-878b6c93c30b',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-07-01 15:35:10.873',	'Bookings',	'{"id": "b9baff9b-fd5c-45b4-9e16-392cad8ef9dc", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "ea4b8e68-8db4-4aa1-b110-0d85bae85be2", "createdAt": "2026-07-01T15:35:10.761Z", "updatedAt": "2026-07-01T15:35:10.761Z", "paidAmount": 0, "passengers": [], "totalPrice": 5860, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "departureDate": "2026-12-26T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 5860, "bookingReference": "TT00957", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc'),
('7c085bc4-de50-49cf-80c7-19d6e8d5ddbe',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-01 17:34:39.115',	'Bookings',	'{"id": "45965037-7ab0-4cb6-844d-2cd30628dc6c", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-30T13:05:16.814Z", "updatedAt": "2026-07-01T17:34:39.100Z", "paidAmount": 0, "totalPrice": 0, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2027-03-18T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 0, "bookingReference": "TT00969", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "45965037-7ab0-4cb6-844d-2cd30628dc6c", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-06-30T13:05:16.814Z", "updatedAt": "2026-06-30T13:05:16.814Z", "paidAmount": 0, "totalPrice": 1000, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-26T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1000, "bookingReference": "TT00969", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'45965037-7ab0-4cb6-844d-2cd30628dc6c'),
('f1c68a82-ca7c-4fa1-a2ec-b0f79616cacb',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Create',	NULL,	'2026-07-01 19:36:59.553',	'Bookings',	'{"id": "0c1b1779-27c5-4469-8215-f0e0776a8b3a", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-01T19:36:59.483Z", "updatedAt": "2026-07-01T19:36:59.483Z", "paidAmount": 0, "passengers": [], "totalPrice": 950, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "agentMarginId": null, "departureDate": "2026-07-04T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 950, "bookingReference": "TT00971", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a'),
('0c950b7f-d9df-464b-ae84-ef6683588ef4',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-07-01 20:10:50.086',	'Bookings',	'{"id": "0c1b1779-27c5-4469-8215-f0e0776a8b3a", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-01T19:36:59.483Z", "updatedAt": "2026-07-01T20:10:50.020Z", "paidAmount": 0, "totalPrice": 1020, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-04T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1020, "bookingReference": "TT00971", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "0c1b1779-27c5-4469-8215-f0e0776a8b3a", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-01T19:36:59.483Z", "updatedAt": "2026-07-01T19:36:59.483Z", "paidAmount": 0, "totalPrice": 950, "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-04T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 950, "bookingReference": "TT00971", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a'),
('0d5d6ceb-f014-42d6-aeb8-43994b63eff9',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'Create',	NULL,	'2026-07-02 11:34:23.454',	'Bookings',	'{"id": "8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43", "status": "PENDING", "userId": "1738f420-d4af-4928-8e33-eeceb35b8c3c", "agentId": "0002b9e2-464a-4502-9a36-8cd0d911c289", "createdAt": "2026-07-02T11:34:23.385Z", "updatedAt": "2026-07-02T11:34:23.385Z", "paidAmount": 0, "passengers": [], "totalPrice": 6692, "createdById": "1738f420-d4af-4928-8e33-eeceb35b8c3c", "assignedToId": "1738f420-d4af-4928-8e33-eeceb35b8c3c", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "agentMarginId": null, "departureDate": "2026-07-01T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 6692, "bookingReference": "TT00973", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43'),
('c69978f2-f15e-4d5b-839f-9eece5e8ecd3',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Create',	NULL,	'2026-07-02 11:57:07.385',	'Bookings',	'{"id": "939de709-1e07-45e5-b3d9-1439a9de3bec", "status": "PENDING", "userId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "agentId": "f26e580f-26b1-447e-98b1-2ff5b6333e00", "createdAt": "2026-07-02T11:57:07.339Z", "updatedAt": "2026-07-02T11:57:07.339Z", "paidAmount": 0, "passengers": [], "totalPrice": 7180, "createdById": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "assignedToId": "baf4459c-aeb3-464e-b39e-7a1b26430b59", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "agentMarginId": null, "departureDate": "2026-07-19T00:00:00.000Z", "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 7180, "bookingReference": "TT00803", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'939de709-1e07-45e5-b3d9-1439a9de3bec'),
('84d784ee-4215-43b5-9031-6f6932bdde46',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Create',	NULL,	'2026-07-02 15:26:24.426',	'Bookings',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T15:26:24.343Z", "paidAmount": 0, "passengers": [], "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "agentMarginId": null, "departureDate": null, "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 1138, "bookingReference": "TT00929", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'50a38298-9eb0-4018-a854-639091dbe9b3'),
('4ee17304-1344-4bdd-b153-f7c7e24d6894',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-07-02 15:45:14.058',	'Bookings',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T15:45:14.032Z", "paidAmount": 0, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1138, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T15:26:24.343Z", "paidAmount": 0, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": null, "paymentStatus": "UNPAID", "remainingAmount": 1138, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'50a38298-9eb0-4018-a854-639091dbe9b3'),
('d326d3de-eba8-4774-8016-f6c71d8808b6',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-02 15:45:25.296',	'Bookings',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T15:45:14.032Z", "paidAmount": 0, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1138, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T15:45:14.032Z", "paidAmount": 0, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1138, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'50a38298-9eb0-4018-a854-639091dbe9b3'),
('1f956856-3d77-4d18-9eb0-71b70a7ad99f',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-02 16:16:08.739',	'Bookings',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "CONFIRMED", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T16:16:08.661Z", "paidAmount": 1138, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "85ba75c5-d9a0-4de3-b66d-152102326706", "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "CONFIRMED", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T16:11:17.297Z", "paidAmount": 1138, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "85ba75c5-d9a0-4de3-b66d-152102326706", "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'50a38298-9eb0-4018-a854-639091dbe9b3'),
('94028bfb-3ff5-45d9-94d0-9926c8f45e1c',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-02 17:16:14.955',	'Users',	'{"id": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "email": "muhammad.zain@terrifictravel.co.uk", "roles": ["Admin"], "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "isActive": true, "lastName": "Malik", "createdAt": "2026-06-26T14:21:43.165Z", "firstName": "Zain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read", "bookings:write"], "isEmailVerified": true}',	'{"id": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "email": "muhammad.zain@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "isActive": true, "lastName": "Malik", "createdAt": "2026-06-26T14:21:43.165Z", "firstName": "Zain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1'),
('007e115a-a55e-4498-9d83-d5fc635b9d8e',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-02 17:16:26.412',	'Users',	'{"id": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "email": "muhammad.zain@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "isActive": true, "lastName": "Malik", "createdAt": "2026-06-26T14:21:43.165Z", "firstName": "Zain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'{"id": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "email": "muhammad.zain@terrifictravel.co.uk", "roles": ["Admin"], "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "isActive": true, "lastName": "Malik", "createdAt": "2026-06-26T14:21:43.165Z", "firstName": "Zain", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read", "bookings:write"], "isEmailVerified": true}',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1'),
('d38fb2ef-ceec-4dfc-8b4f-1cfa4e33b313',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-02 17:16:43.626',	'Users',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Admin"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read", "bookings:write"], "isEmailVerified": true}',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('94c9d521-1420-406d-9949-aa01043387b5',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Create',	NULL,	'2026-07-02 17:34:50.365',	'Bookings',	'{"id": "10d1d925-f85f-499f-9de5-feec5b465c44", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T17:34:50.284Z", "updatedAt": "2026-07-02T17:34:50.284Z", "paidAmount": 0, "passengers": [], "totalPrice": 1000, "bookingDate": "2026-07-06T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "agentMarginId": null, "departureDate": null, "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 1000, "bookingReference": "TT00936", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'10d1d925-f85f-499f-9de5-feec5b465c44'),
('4336a501-b920-4481-a0bc-f17eb3a4ba63',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-07-02 17:47:07.93',	'Bookings',	'{"id": "10d1d925-f85f-499f-9de5-feec5b465c44", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T17:34:50.284Z", "updatedAt": "2026-07-02T17:47:07.888Z", "paidAmount": 0, "totalPrice": 1000, "bookingDate": "2026-07-06T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-06T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 1000, "bookingReference": "TT00936", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "10d1d925-f85f-499f-9de5-feec5b465c44", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T17:34:50.284Z", "updatedAt": "2026-07-02T17:34:50.284Z", "paidAmount": 0, "totalPrice": 1000, "bookingDate": "2026-07-06T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": null, "paymentStatus": "UNPAID", "remainingAmount": 1000, "bookingReference": "TT00936", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'10d1d925-f85f-499f-9de5-feec5b465c44'),
('835e1116-1d53-4781-99b7-90dc49e035b2',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-02 18:25:04.295',	'Bookings',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "CONFIRMED", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T18:25:04.275Z", "paidAmount": 1138, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "e98fecde-d249-4b34-a840-d6b2d9b68e07", "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "CONFIRMED", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T16:34:43.505Z", "paidAmount": 1138, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "e98fecde-d249-4b34-a840-d6b2d9b68e07", "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'50a38298-9eb0-4018-a854-639091dbe9b3'),
('163cbbe7-dd3b-4b97-b2fb-b52547b50f4e',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-02 18:25:05.133',	'Bookings',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "CONFIRMED", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T18:25:05.103Z", "paidAmount": 1138, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "e98fecde-d249-4b34-a840-d6b2d9b68e07", "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "CONFIRMED", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T18:25:04.275Z", "paidAmount": 1138, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "e98fecde-d249-4b34-a840-d6b2d9b68e07", "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'50a38298-9eb0-4018-a854-639091dbe9b3'),
('4a6663f8-d3cf-4186-b233-fddfd02f4d0a',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-02 18:25:08.508',	'Bookings',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "CONFIRMED", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T18:25:08.499Z", "paidAmount": 1138, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "e98fecde-d249-4b34-a840-d6b2d9b68e07", "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "50a38298-9eb0-4018-a854-639091dbe9b3", "status": "CONFIRMED", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T15:26:24.343Z", "updatedAt": "2026-07-02T18:25:05.103Z", "paidAmount": 1138, "totalPrice": 1138, "bookingDate": "2026-07-14T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "e98fecde-d249-4b34-a840-d6b2d9b68e07", "departureDate": "2026-07-14T00:00:00.000Z", "paymentStatus": "PAID", "remainingAmount": 0, "bookingReference": "TT00929", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'50a38298-9eb0-4018-a854-639091dbe9b3'),
('334bdfd9-cfed-4876-ab0a-802f5de049db',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Create',	NULL,	'2026-07-02 18:34:54.1',	'Bookings',	'{"id": "78871a43-43e5-46e2-b96c-8db80a1de236", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T18:34:54.004Z", "updatedAt": "2026-07-02T18:34:54.004Z", "paidAmount": 0, "passengers": [], "totalPrice": 730, "bookingDate": "2026-07-09T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "agentMarginId": null, "departureDate": null, "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 730, "bookingReference": "TT00959", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'78871a43-43e5-46e2-b96c-8db80a1de236'),
('44e66508-9179-4dd8-bd55-5c51adaddf42',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Update',	NULL,	'2026-07-02 18:52:46.137',	'Bookings',	'{"id": "78871a43-43e5-46e2-b96c-8db80a1de236", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T18:34:54.004Z", "updatedAt": "2026-07-02T18:52:46.122Z", "paidAmount": 0, "totalPrice": 730, "bookingDate": "2026-07-09T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-09T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 730, "bookingReference": "TT00959", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "78871a43-43e5-46e2-b96c-8db80a1de236", "status": "PENDING", "userId": "420d80dc-2d84-4454-aa76-e22b50f01213", "agentId": "455bbf6d-c482-408d-b449-7df76e15f696", "createdAt": "2026-07-02T18:34:54.004Z", "updatedAt": "2026-07-02T18:34:54.004Z", "paidAmount": 0, "totalPrice": 730, "bookingDate": "2026-07-09T00:00:00.000Z", "createdById": "420d80dc-2d84-4454-aa76-e22b50f01213", "assignedToId": "420d80dc-2d84-4454-aa76-e22b50f01213", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": null, "paymentStatus": "UNPAID", "remainingAmount": 730, "bookingReference": "TT00959", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'78871a43-43e5-46e2-b96c-8db80a1de236'),
('6cccf99a-63a8-42ba-9738-95584c982ef7',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'Update',	NULL,	'2026-07-02 20:04:06.257',	'Bookings',	'{"id": "e3da6462-67d7-4098-b88e-6fd2a4bd78ac", "status": "PENDING", "userId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "agentId": "1e85f3e9-37fc-4704-8650-ce423408044e", "createdAt": "2026-07-01T22:44:10.395Z", "updatedAt": "2026-07-02T20:04:06.243Z", "paidAmount": 0, "totalPrice": 810, "bookingDate": null, "createdById": "c8fb18b0-04ae-4460-9267-a321aac805c6", "assignedToId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "92f90d74-d94e-4212-a5e4-b25871caccf6", "departureDate": "2026-07-02T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 810, "bookingReference": "TT00972", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "e3da6462-67d7-4098-b88e-6fd2a4bd78ac", "status": "PENDING", "userId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "agentId": "1e85f3e9-37fc-4704-8650-ce423408044e", "createdAt": "2026-07-01T22:44:10.395Z", "updatedAt": "2026-07-02T16:37:36.259Z", "paidAmount": 0, "totalPrice": 830, "bookingDate": null, "createdById": "c8fb18b0-04ae-4460-9267-a321aac805c6", "assignedToId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "92f90d74-d94e-4212-a5e4-b25871caccf6", "departureDate": "2026-07-02T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 830, "bookingReference": "TT00972", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac'),
('83a922e9-91ed-4340-8cba-4974357f1cd7',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 09:06:49.958',	'Users',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Agent"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_own", "invoices:read", "invoices:download", "invoices:print", "customers:read", "customers:create", "reports:read_own", "bookings:write"], "isEmailVerified": true}',	'{"id": "278b9ff0-cf41-41b1-a5a6-070294f9c191", "email": "faisal@terrifictravel.co.uk", "roles": ["Admin"], "agentId": "d48c4fd9-7343-42c3-8241-613691bcdac7", "isActive": true, "lastName": "Chughtai", "createdAt": "2026-06-26T12:53:31.185Z", "firstName": "Faisal", "permissions": ["bookings:read", "bookings:create", "bookings:edit_any", "bookings:edit_own", "invoices:read", "invoices:edit", "invoices:download", "invoices:print", "customers:read", "customers:create", "customers:edit", "reports:read_all", "reports:read_own", "users:manage", "roles:assign", "permissions:manage", "settings:manage", "users:read", "bookings:write"], "isEmailVerified": true}',	'278b9ff0-cf41-41b1-a5a6-070294f9c191'),
('62ece462-1d17-4e10-afdc-851336059e5e',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'Create',	NULL,	'2026-07-03 09:57:59.697',	'Bookings',	'{"id": "cde8c177-b89c-41d2-bb25-97b321e8308c", "status": "PENDING", "userId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "agentId": "1e85f3e9-37fc-4704-8650-ce423408044e", "createdAt": "2026-07-03T09:57:59.625Z", "updatedAt": "2026-07-03T09:57:59.625Z", "paidAmount": 0, "passengers": [], "totalPrice": 9475, "bookingDate": "2026-04-24T00:00:00.000Z", "createdById": "c8fb18b0-04ae-4460-9267-a321aac805c6", "assignedToId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "bookingItems": [], "lockedStatus": "UNLOCKED", "refundAmount": 0, "transactions": [], "visaServices": [], "agentMarginId": null, "departureDate": null, "paymentStatus": "UNPAID", "accommodations": [], "flightServices": [], "remainingAmount": 9475, "bookingReference": "TT00TT00912", "transportServices": [], "cardPaymentCharges": 0, "cancellationCharges": 0, "bookingVendorPayments": [], "vendorPaymentAllocations": []}',	'null',	'cde8c177-b89c-41d2-bb25-97b321e8308c'),
('0e82fef6-0829-4713-a7af-3ab0094f1666',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'Update',	NULL,	'2026-07-03 09:59:30.478',	'Bookings',	'{"id": "cde8c177-b89c-41d2-bb25-97b321e8308c", "status": "PENDING", "userId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "agentId": "1e85f3e9-37fc-4704-8650-ce423408044e", "createdAt": "2026-07-03T09:57:59.625Z", "updatedAt": "2026-07-03T09:59:30.460Z", "paidAmount": 0, "totalPrice": 9475, "bookingDate": "2026-04-24T00:00:00.000Z", "createdById": "c8fb18b0-04ae-4460-9267-a321aac805c6", "assignedToId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": "2026-07-26T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 9475, "bookingReference": "TT00TT00912", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "cde8c177-b89c-41d2-bb25-97b321e8308c", "status": "PENDING", "userId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "agentId": "1e85f3e9-37fc-4704-8650-ce423408044e", "createdAt": "2026-07-03T09:57:59.625Z", "updatedAt": "2026-07-03T09:57:59.625Z", "paidAmount": 0, "totalPrice": 9475, "bookingDate": "2026-04-24T00:00:00.000Z", "createdById": "c8fb18b0-04ae-4460-9267-a321aac805c6", "assignedToId": "c8fb18b0-04ae-4460-9267-a321aac805c6", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": null, "departureDate": null, "paymentStatus": "UNPAID", "remainingAmount": 9475, "bookingReference": "TT00TT00912", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'cde8c177-b89c-41d2-bb25-97b321e8308c'),
('65acdacb-54f3-4e01-a2e1-d889eaffc760',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:41.612',	'Bookings',	'{"id": "59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-28T15:48:30.004Z", "updatedAt": "2026-07-03T11:23:41.585Z", "paidAmount": 0, "totalPrice": 780, "bookingDate": null, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "11edf201-62be-4674-b639-c87e4c866142", "departureDate": "2026-07-05T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 780, "bookingReference": "TT00963", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-28T15:48:30.004Z", "updatedAt": "2026-07-02T16:37:36.282Z", "paidAmount": 0, "totalPrice": 780, "bookingDate": null, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "11edf201-62be-4674-b639-c87e4c866142", "departureDate": "2026-07-05T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 780, "bookingReference": "TT00963", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7'),
('fe7451e5-2e69-4cdb-8a0f-c0885b16474c',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:44.615',	'Bookings',	'{"id": "59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-28T15:48:30.004Z", "updatedAt": "2026-07-03T11:23:44.536Z", "paidAmount": 0, "totalPrice": 780, "bookingDate": null, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "11edf201-62be-4674-b639-c87e4c866142", "departureDate": "2026-07-05T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 780, "bookingReference": "TT00963", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7", "status": "PENDING", "userId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "agentId": "6ee97972-be10-4114-bcc2-fe9165be7714", "createdAt": "2026-06-28T15:48:30.004Z", "updatedAt": "2026-07-03T11:23:41.585Z", "paidAmount": 0, "totalPrice": 780, "bookingDate": null, "createdById": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "assignedToId": "d47ce6c4-c1b3-4c59-b609-b3082061aff1", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "11edf201-62be-4674-b639-c87e4c866142", "departureDate": "2026-07-05T00:00:00.000Z", "paymentStatus": "UNPAID", "remainingAmount": 780, "bookingReference": "TT00963", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7'),
('028d8477-51a9-4168-b14c-03d80f5f5a30',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:48.353',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:48.341Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-02T16:37:36.372Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9'),
('a37cdb17-d8d9-4f1a-ba31-9279ab54422e',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:50.69',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:50.681Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:48.341Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9'),
('e677aef1-cfc4-468c-8d61-0d0fcfe666b0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:51.511',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:51.501Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:50.681Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9'),
('f5ecacb4-019e-486d-8a8c-7fb3b8805b8b',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:53.882',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:53.872Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:52.990Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9'),
('287e5df4-dcb5-40d6-93d7-72870d693605',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:54.768',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:54.756Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:53.872Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9'),
('688c1b63-ba1e-46b2-acf8-591ff77116e6',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:52.326',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:52.314Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:51.501Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9'),
('eaccad41-6840-4bed-a9c2-0929d65709a7',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:52.999',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:52.990Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:52.314Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9'),
('6a959ab6-3952-47e1-b7d2-35845e7e5de9',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Update',	NULL,	'2026-07-03 11:23:55.726',	'Bookings',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:55.717Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "UNLOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'{"id": "28226c92-d76d-4cfb-ba4c-31f17208dfb9", "status": "CONFIRMED", "userId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "agentId": "e2f5808a-8809-4668-9e63-29444d0f988b", "createdAt": "2026-06-26T22:42:36.265Z", "updatedAt": "2026-07-03T11:23:54.756Z", "paidAmount": 20, "totalPrice": 2560, "bookingDate": null, "createdById": "fb69c410-7863-4086-9763-1c9d771fdbd3", "assignedToId": "fb69c410-7863-4086-9763-1c9d771fdbd3", "lockedStatus": "LOCKED", "refundAmount": 0, "agentMarginId": "a3355dcd-53e8-45f1-a5b9-45ab62f8e05f", "departureDate": "2027-02-03T00:00:00.000Z", "paymentStatus": "PARTIALLY_PAID", "remainingAmount": 2540, "bookingReference": "TT00964", "cardPaymentCharges": 0, "cancellationCharges": 0}',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9');

DROP TABLE IF EXISTS "Booking";
CREATE TABLE "public"."Booking" (
    "id" text NOT NULL,
    "userId" text NOT NULL,
    "status" "BookingStatus" DEFAULT PENDING NOT NULL,
    "totalPrice" double precision NOT NULL,
    "agentId" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    "bookingReference" text NOT NULL,
    "departureDate" timestamp(3),
    "paidAmount" double precision DEFAULT '0.0' NOT NULL,
    "refundAmount" double precision DEFAULT '0.0' NOT NULL,
    "cardPaymentCharges" double precision DEFAULT '0.0' NOT NULL,
    "cancellationCharges" double precision DEFAULT '0.0' NOT NULL,
    "remainingAmount" double precision DEFAULT '0.0' NOT NULL,
    "paymentStatus" text DEFAULT 'UNPAID' NOT NULL,
    "lockedStatus" text DEFAULT 'UNLOCKED' NOT NULL,
    "assignedToId" text,
    "createdById" text,
    "agentMarginId" text,
    "bookingDate" timestamp(3),
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Booking_bookingReference_key" ON public."Booking" USING btree ("bookingReference");

CREATE INDEX "Booking_bookingReference_idx" ON public."Booking" USING btree ("bookingReference");

INSERT INTO "Booking" ("id", "userId", "status", "totalPrice", "agentId", "createdAt", "updatedAt", "bookingReference", "departureDate", "paidAmount", "refundAmount", "cardPaymentCharges", "cancellationCharges", "remainingAmount", "paymentStatus", "lockedStatus", "assignedToId", "createdById", "agentMarginId", "bookingDate") VALUES
('2a147b32-17a3-424e-8368-10978e3d5de7',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'PENDING',	2865,	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-06-29 18:56:34.322',	'2026-07-02 16:37:36.282',	'TT00925',	'2026-05-10 00:00:00',	0,	0,	0,	0,	2865,	'UNPAID',	'UNLOCKED',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'11edf201-62be-4674-b639-c87e4c866142',	NULL),
('cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'CONFIRMED',	4200,	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-06-29 14:33:34.953',	'2026-07-02 16:37:36.301',	'TT00943',	'2026-08-27 00:00:00',	1600,	0,	0,	0,	2600,	'PARTIALLY_PAID',	'UNLOCKED',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'075814a2-715c-4556-b0f9-63d590ef661c',	NULL),
('2cc7284b-affa-4eec-9a56-af93962c223b',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'CONFIRMED',	1670,	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-06-30 16:35:23.465',	'2026-07-02 16:37:36.301',	'TT00970',	'2026-09-20 00:00:00',	20,	0,	0,	0,	1650,	'PARTIALLY_PAID',	'UNLOCKED',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'075814a2-715c-4556-b0f9-63d590ef661c',	NULL),
('50a38298-9eb0-4018-a854-639091dbe9b3',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'CONFIRMED',	1138,	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-07-02 15:26:24.343',	'2026-07-02 18:25:08.499',	'TT00929',	'2026-07-14 00:00:00',	1138,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'e98fecde-d249-4b34-a840-d6b2d9b68e07',	'2026-07-14 00:00:00'),
('407ecf89-910e-429b-9b6f-2a366eed0f5c',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'PENDING',	2850,	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-06-29 18:58:08.687',	'2026-07-02 16:37:36.282',	'TT00924',	'2026-05-12 00:00:00',	0,	0,	0,	0,	2850,	'UNPAID',	'UNLOCKED',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'11edf201-62be-4674-b639-c87e4c866142',	NULL),
('e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'PENDING',	810,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-01 22:44:10.395',	'2026-07-02 20:04:06.243',	'TT00972',	'2026-07-02 00:00:00',	0,	0,	0,	0,	810,	'UNPAID',	'UNLOCKED',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'92f90d74-d94e-4212-a5e4-b25871caccf6',	NULL),
('59e1ad2d-9aa0-41b6-ab9e-50a6f24cdec7',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'PENDING',	780,	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-06-28 15:48:30.004',	'2026-07-03 11:23:44.536',	'TT00963',	'2026-07-05 00:00:00',	0,	0,	0,	0,	780,	'UNPAID',	'UNLOCKED',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'11edf201-62be-4674-b639-c87e4c866142',	NULL),
('28226c92-d76d-4cfb-ba4c-31f17208dfb9',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'CONFIRMED',	2560,	'e2f5808a-8809-4668-9e63-29444d0f988b',	'2026-06-26 22:42:36.265',	'2026-07-03 11:23:55.717',	'TT00964',	'2027-02-03 00:00:00',	20,	0,	0,	0,	2540,	'PARTIALLY_PAID',	'UNLOCKED',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'a3355dcd-53e8-45f1-a5b9-45ab62f8e05f',	NULL),
('575da188-44f7-467b-83a6-ee1cbb5b2797',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'CONFIRMED',	827,	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'2026-07-01 10:37:54.476',	'2026-07-02 16:37:36.194',	'TT00939',	'2026-07-02 00:00:00',	625,	0,	0,	0,	202,	'PARTIALLY_PAID',	'UNLOCKED',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'f30a6c01-4e32-4740-af45-782c4a0819f4',	NULL),
('b3a47523-0c58-4c53-9eea-d6bcb3420600',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'PENDING',	6000,	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-07-01 13:58:29',	'2026-07-02 16:37:36.301',	'TT00905',	'2026-07-28 00:00:00',	0,	0,	0,	0,	6000,	'UNPAID',	'UNLOCKED',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'075814a2-715c-4556-b0f9-63d590ef661c',	NULL),
('0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'CONFIRMED',	1020,	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-07-01 19:36:59.483',	'2026-07-02 16:37:36.301',	'TT00971',	'2026-07-04 00:00:00',	1020,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'075814a2-715c-4556-b0f9-63d590ef661c',	NULL),
('8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'CONFIRMED',	6692,	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'2026-07-02 11:34:23.385',	'2026-07-02 16:37:36.194',	'TT00973',	'2026-07-01 00:00:00',	1500,	0,	0,	0,	5192,	'PARTIALLY_PAID',	'UNLOCKED',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'f30a6c01-4e32-4740-af45-782c4a0819f4',	NULL),
('b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'PENDING',	5860,	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	'2026-07-01 15:35:10.761',	'2026-07-02 16:37:36.241',	'TT00957',	'2026-12-26 00:00:00',	0,	0,	0,	0,	5860,	'UNPAID',	'UNLOCKED',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'82753d7a-1f85-4e18-92ce-4507a55041d2',	NULL),
('28d19384-d41c-4d6d-b47e-2317e11ace06',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'CONFIRMED',	928,	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	'2026-06-29 17:11:38.493',	'2026-07-02 16:37:36.329',	'TT00967',	'2026-06-30 00:00:00',	928,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'a937726f-8566-4280-bcb3-326de88dc381',	NULL),
('32ba5865-c826-4c7c-b4c7-33537b639330',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'CONFIRMED',	1260,	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	'2026-06-26 15:56:57.047',	'2026-07-02 16:37:36.329',	'TT00966',	'2026-08-13 00:00:00',	1260,	0,	12.6,	0,	0,	'PAID',	'UNLOCKED',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'a937726f-8566-4280-bcb3-326de88dc381',	NULL),
('45965037-7ab0-4cb6-844d-2cd30628dc6c',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'PENDING',	0,	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	'2026-06-30 13:05:16.814',	'2026-07-02 16:37:36.329',	'TT00969',	'2027-03-18 00:00:00',	0,	0,	0,	0,	0,	'UNPAID',	'UNLOCKED',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'a937726f-8566-4280-bcb3-326de88dc381',	NULL),
('cde8c177-b89c-41d2-bb25-97b321e8308c',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'PENDING',	9475,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03 09:57:59.625',	'2026-07-03 09:59:30.46',	'TT00912',	'2026-07-26 00:00:00',	0,	0,	0,	0,	9475,	'UNPAID',	'UNLOCKED',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'2026-04-24 00:00:00'),
('78871a43-43e5-46e2-b96c-8db80a1de236',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'CONFIRMED',	730,	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-07-02 18:34:54.004',	'2026-07-03 12:06:47.051',	'TT00959',	'2026-07-09 00:00:00',	730,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'2026-07-09 00:00:00'),
('62bbc9b7-e986-482f-b135-9aa9942b847a',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'CONFIRMED',	6820,	NULL,	'2026-07-03 13:43:50.517',	'2026-07-03 13:43:50.517',	'TT00640',	'2025-12-18 00:00:00',	6820,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	NULL,	NULL,	NULL,	'2025-09-10 23:00:00'),
('d0729aaa-738f-467b-82cd-d52e508657ba',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'CONFIRMED',	2990,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03 13:43:50.709',	'2026-07-03 13:43:50.709',	'TT00641',	'2025-10-09 23:00:00',	2990,	0,	0,	0,	0,	'PAID',	'LOCKED',	NULL,	NULL,	NULL,	'2025-09-10 23:00:00'),
('601d79fa-fd05-403b-8dcf-35b75039db6b',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'CONFIRMED',	4590,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03 13:43:51.072',	'2026-07-03 13:43:51.072',	'TT00645',	'2025-12-02 00:00:00',	4590,	0,	0,	0,	0,	'PAID',	'LOCKED',	NULL,	NULL,	NULL,	'2025-09-14 23:00:00'),
('66814ef2-1e4e-4a61-acdd-b278a910034d',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'CONFIRMED',	904,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03 13:44:01.86',	'2026-07-03 13:44:01.86',	'TT00883',	'2026-03-25 00:00:00',	904,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	NULL,	NULL,	NULL,	'2026-03-05 00:00:00'),
('ff948b46-5c06-4fb6-82c4-4dff4a9d6495',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'CONFIRMED',	502,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03 13:44:03.78',	'2026-07-03 13:44:03.78',	'TT00933',	'2026-07-01 23:00:00',	502,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	NULL,	NULL,	NULL,	'2026-05-26 23:00:00'),
('63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'CONFIRMED',	1055,	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-06-29 18:59:18.866',	'2026-07-02 16:37:36.282',	'TT00968',	'2026-10-01 00:00:00',	547,	0,	0,	0,	508,	'PARTIALLY_PAID',	'UNLOCKED',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'11edf201-62be-4674-b639-c87e4c866142',	NULL),
('5e668417-02ad-40c0-8c73-723257ee4349',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'CONFIRMED',	920,	'6ee97972-be10-4114-bcc2-fe9165be7714',	'2026-06-29 15:48:48.185',	'2026-07-02 16:37:36.282',	'TT00945',	'2026-07-05 00:00:00',	40,	0,	0,	0,	880,	'PARTIALLY_PAID',	'UNLOCKED',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'11edf201-62be-4674-b639-c87e4c866142',	NULL),
('939de709-1e07-45e5-b3d9-1439a9de3bec',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'CONFIRMED',	7180,	'f26e580f-26b1-447e-98b1-2ff5b6333e00',	'2026-07-02 11:57:07.339',	'2026-07-02 16:37:36.329',	'TT00803',	'2026-07-19 00:00:00',	6500,	0,	0,	0,	680,	'PARTIALLY_PAID',	'UNLOCKED',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'a937726f-8566-4280-bcb3-326de88dc381',	NULL),
('951259e2-8ec8-4a9c-8b55-be727e3e1885',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'CONFIRMED',	266,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03 13:44:03.833',	'2026-07-03 13:44:03.833',	'TT00934',	'2026-06-06 23:00:00',	266,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	NULL,	NULL,	NULL,	'2026-05-28 23:00:00'),
('10d1d925-f85f-499f-9de5-feec5b465c44',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'CONFIRMED',	1000,	'455bbf6d-c482-408d-b449-7df76e15f696',	'2026-07-02 17:34:50.284',	'2026-07-02 17:47:39.184',	'TT00936',	'2026-07-06 00:00:00',	1000,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'2026-07-06 00:00:00'),
('73eab461-94a8-47c6-913f-7eaa439426f5',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'CONFIRMED',	2418,	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'2026-07-03 13:44:04.102',	'2026-07-03 13:44:04.102',	'TT00944',	'2026-07-28 23:00:00',	855,	0,	0,	0,	1563,	'UNPAID',	'UNLOCKED',	NULL,	NULL,	NULL,	'2026-06-03 23:00:00'),
('c297180e-838b-4604-a79a-0fe024ee7d4e',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'CONFIRMED',	255,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03 13:44:04.729',	'2026-07-03 13:44:04.729',	'TT00958',	'2026-07-02 23:00:00',	255,	0,	0,	0,	0,	'PAID',	'UNLOCKED',	NULL,	NULL,	NULL,	'2026-06-18 23:00:00'),
('13f9b680-5767-4616-ab5d-a40280b79890',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'CONFIRMED',	8370,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'2026-07-03 13:44:04.845',	'2026-07-03 13:44:04.845',	'TT00960',	'2026-10-27 00:00:00',	4989.34,	0,	0,	0,	3380.66,	'UNPAID',	'UNLOCKED',	NULL,	NULL,	NULL,	'2026-06-21 23:00:00');

DROP TABLE IF EXISTS "BookingItem";
CREATE TABLE "public"."BookingItem" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "itemType" "BookingItemType" NOT NULL,
    "price" double precision NOT NULL,
    "flightId" text,
    "roomId" text,
    "tourId" text,
    "details" jsonb,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "BookingItem_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "BookingTransaction";
CREATE TABLE "public"."BookingTransaction" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "amount" double precision NOT NULL,
    "paymentMethod" text NOT NULL,
    "paidOn" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "notes" text,
    CONSTRAINT "BookingTransaction_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "BookingTransaction" ("id", "bookingId", "amount", "paymentMethod", "paidOn", "notes") VALUES
('6bda649f-c41d-48fe-888b-90fe167fd0fe',	'32ba5865-c826-4c7c-b4c7-33537b639330',	1260,	'Credit Card',	'2026-06-26 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782489585560-WhatsApp Image 2026-06-26 at 16.46.24.jpeg'),
('f8b4b862-5e22-49a5-adfd-69ee7c0d1eca',	'32ba5865-c826-4c7c-b4c7-33537b639330',	-12.6,	'Credit Card',	'2026-06-26 00:00:00',	'Credit Card Charges for customer payment (Paid by Company)'),
('9a579afc-44a9-4789-a308-a3987bfa201a',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9',	20,	'Bank Transfer',	'2026-06-27 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782514062050-payment.png'),
('8f9b55e6-8e91-44ac-88d3-13cf22424658',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	40,	'Bank Transfer',	'2026-06-29 00:00:00',	'Customer payment received'),
('5578fcf7-cd5d-42ed-9b1b-914eecc51e4c',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	507,	'Bank Transfer',	'2026-06-30 00:00:00',	'Customer payment received'),
('69c6226d-0930-457a-8b32-714ac442d6bd',	'2cc7284b-affa-4eec-9a56-af93962c223b',	20,	'Bank Transfer',	'2026-06-30 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782837838863-Recipt.jpeg'),
('53131554-c0fd-4be7-86fd-99738eba6468',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	600,	'Bank Transfer',	'2026-07-01 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782910708254-aftabbbb.png'),
('b968ff68-e94e-4b9e-8d9f-0a0f2317d0eb',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	1000,	'Bank Transfer',	'2026-07-01 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782910767024-aftabbshjsh.png'),
('99634b29-0e4c-445a-ab10-b2cbd6169d98',	'575da188-44f7-467b-83a6-ee1cbb5b2797',	625,	'Bank Transfer',	'2026-07-01 00:00:00',	'He paid £625 via bank transfer and remaining £150 into our office. Receipt: https://cdn.terrifictravel.co.uk/users/1782902326576-WhatsApp Image 2026-06-02 at 19.00.03.jpeg'),
('140e3a88-13d8-4e35-9506-e96fc0d18a3f',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	928,	'Bank Transfer',	'2026-06-29 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782913232700-WhatsApp Image 2026-06-29 at 19.23.34.jpeg'),
('59c0fa21-d951-4f43-a2a4-9183c3547566',	'5e668417-02ad-40c0-8c73-723257ee4349',	40,	'Bank Transfer',	'2026-07-01 00:00:00',	'Customer payment received'),
('c08d5fc1-51f4-496b-bce2-3acd37f9d35e',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	20,	'Bank Transfer',	'2026-07-02 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782936706907-payment 2.jpeg'),
('90248a55-a094-4e9a-9e60-8b5359abdc43',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	1000,	'Bank Transfer',	'2026-07-02 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782936727318-payment 1 .jpeg'),
('b71bc72a-e694-409d-9b4c-e76acbc58fbb',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	1500,	'Bank Transfer',	'2026-07-01 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782993092146-WhatsApp Image 2026-07-01 at 19.59.28.jpeg'),
('ef0b0946-4b67-47a4-bf85-a371933d5851',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	2500,	'Cash',	'2026-01-09 00:00:00',	'Customer payment received'),
('a1642aed-9357-43e7-8130-a00489786707',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	1000,	'Cash',	'2026-02-13 00:00:00',	'Customer payment received'),
('64fdfa12-15fc-46a7-afd2-3a14227029c1',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	800,	'Cash',	'2026-03-26 00:00:00',	'Customer payment received'),
('3063dfa0-7cb7-45ba-80e8-78d2ba3b8628',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	500,	'Cash',	'2026-05-09 00:00:00',	'Customer payment received'),
('7227fbb4-f0b0-42c6-8650-51f9c08dca18',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	1400,	'Cash',	'2026-05-31 00:00:00',	'Customer payment received'),
('49f0989a-7bd3-4ce0-b017-f776c802b99a',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	300,	'Cash',	'2026-06-01 00:00:00',	'Customer payment received'),
('1f8bf761-6d8b-4f82-879e-6c3c7a6ac3f5',	'50a38298-9eb0-4018-a854-639091dbe9b3',	1040,	'Bank Transfer',	'2026-07-02 00:00:00',	'Customer payment received'),
('3051936c-1cdf-42c2-9878-ae7a9aef9546',	'50a38298-9eb0-4018-a854-639091dbe9b3',	98,	'Bank Transfer',	'2026-07-01 00:00:00',	'Customer payment received'),
('101fe44f-fc47-4818-98d3-1228597d736f',	'50a38298-9eb0-4018-a854-639091dbe9b3',	-56.9,	'AGENT PAYOUT',	'2026-07-02 16:35:18.67',	'Agent Margin Payout for 2026-06-01 to 2026-07-31'),
('b27bf480-db85-4814-87e1-68f0fc361862',	'50a38298-9eb0-4018-a854-639091dbe9b3',	324.47,	'Credit Card',	'2026-07-02 16:56:39.814',	'Vendor Payment (Ref: VP-20260702-000001). Allocated amount: £324.47. Notes: Paid for services: [Hotel] Valy Al Madinah (Quad Room) - Booking: TT00929'),
('abd1507e-af2d-4127-afe5-ca0b1bee2292',	'10d1d925-f85f-499f-9de5-feec5b465c44',	1000,	'Bank Transfer',	'2026-07-02 00:00:00',	'Receipt: https://cdn.terrifictravel.co.uk/users/1783013726508-Alishbah booking.png'),
('1e685763-8da9-47f2-b12e-0756fe3fc9aa',	'78871a43-43e5-46e2-b96c-8db80a1de236',	550,	'Bank Transfer',	'2026-06-20 00:00:00',	'Customer payment received'),
('22b2f9c1-175d-416b-ab1f-e4d146c55b8c',	'78871a43-43e5-46e2-b96c-8db80a1de236',	180,	'Bank Transfer',	'2026-06-29 00:00:00',	'Customer payment received'),
('807ab996-7ebc-493e-96c1-409c0311aadc',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	443.4,	'Bank Transfer',	'2026-07-03 13:31:48.557',	'Vendor Payment (Ref: VP-20260703-000001). Allocated amount: £443.40. Notes: Paid for services: [Flight] QR 621 (PNR: HBPPGQ) - Booking: TT00972'),
('50287c72-2f11-4690-a27c-3e9f628c5a61',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	4140,	'Cash',	'2025-09-14 23:00:00',	'Total paid balance was 6620. But we are adjust 2480 amount on previous credit. Date is 11 Oct 2025'),
('f048ac2f-7940-4aac-abf6-53e24b4a0a37',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	100,	'Bank Transfer',	'2025-12-08 00:00:00',	'AAA Birmingham Limited Paid 1500 Adjust 100 Here 1400 Adjust in Haider Zada'),
('3ae5136a-3a3d-4b86-83bb-5fc4b213ae5e',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	2200,	'Bank Transfer',	'2025-12-14 00:00:00',	'AAAbirmingham lim'),
('79d504a6-6d00-47dd-b18d-b73b4bd09652',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	380,	'Cash',	'2025-12-21 00:00:00',	NULL),
('4852ef1f-bdb7-49ef-85f1-8e3c29556ba9',	'd0729aaa-738f-467b-82cd-d52e508657ba',	2400,	'Cash',	'2025-09-10 23:00:00',	NULL),
('cb783298-5140-4e03-b2f8-b5d4fed0a817',	'd0729aaa-738f-467b-82cd-d52e508657ba',	590,	'Cash',	'2025-09-14 23:00:00',	NULL),
('f76d0b11-d18f-4a6a-b81b-a753148685e5',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	4590,	'Cash',	'2025-09-25 23:00:00',	NULL),
('fdda3ab6-ad47-4e10-be0a-754bd3d94826',	'66814ef2-1e4e-4a61-acdd-b278a910034d',	904,	'Cash',	'2026-03-25 00:00:00',	NULL),
('cd2af956-45c9-4383-a6e0-b3b91a6109a8',	'ff948b46-5c06-4fb6-82c4-4dff4a9d6495',	502,	'Cash',	'2026-05-30 23:00:00',	NULL),
('7124c35e-e283-403e-812b-8ac4c43ea117',	'951259e2-8ec8-4a9c-8b55-be727e3e1885',	266,	'Cash',	'2026-05-30 23:00:00',	NULL),
('482706c3-e273-4208-9868-d54b7dd00af4',	'73eab461-94a8-47c6-913f-7eaa439426f5',	855,	'Bank Transfer',	'2026-06-03 23:00:00',	NULL),
('821f8ed7-2616-4540-838f-6cd19355b03f',	'c297180e-838b-4604-a79a-0fe024ee7d4e',	255,	'Bank Transfer',	'2026-06-18 23:00:00',	NULL),
('48339730-7ad9-4f5c-b2cf-946e96f1ab0c',	'13f9b680-5767-4616-ab5d-a40280b79890',	1289.34,	'Bank Transfer',	'2026-06-21 23:00:00',	NULL),
('c293cf3d-3197-426a-8730-f0284419eabf',	'13f9b680-5767-4616-ab5d-a40280b79890',	3700,	'Cash',	'2026-06-24 23:00:00',	NULL);

DROP TABLE IF EXISTS "BookingVendorPayment";
CREATE TABLE "public"."BookingVendorPayment" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "vendorId" text NOT NULL,
    "originalCost" double precision NOT NULL,
    "amountPaid" double precision DEFAULT '0.0' NOT NULL,
    "remainingBalance" double precision NOT NULL,
    "status" text DEFAULT 'PENDING' NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "BookingVendorPayment_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "BookingVendorPayment_bookingId_vendorId_key" ON public."BookingVendorPayment" USING btree ("bookingId", "vendorId");

INSERT INTO "BookingVendorPayment" ("id", "bookingId", "vendorId", "originalCost", "amountPaid", "remainingBalance", "status", "createdAt", "updatedAt") VALUES
('1b92695a-4df3-461f-83d7-61ded0374629',	'5e668417-02ad-40c0-8c73-723257ee4349',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	180.53,	0,	180.53,	'PENDING',	'2026-07-01 16:51:14.496',	'2026-07-01 16:52:55.481'),
('ca33d8ec-4fa7-470b-85aa-e1d112aeb9ce',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'65b28593-f9ef-4473-b562-eea75c88316c',	0,	0,	0,	'PENDING',	'2026-07-01 20:22:14.018',	'2026-07-01 20:22:14.018'),
('b316be0d-c301-44b9-b5de-b2254d005aa5',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'2',	0,	0,	0,	'PENDING',	'2026-07-01 20:24:24.279',	'2026-07-01 20:24:24.279'),
('0a940974-495d-4d91-8efc-67d4d0fc9f68',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'4',	0,	0,	0,	'PENDING',	'2026-07-01 20:24:57.526',	'2026-07-01 20:24:57.526'),
('c1d64fad-e7ac-48eb-918b-40fd9bc255ca',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'36',	51.44,	0,	51.44,	'PENDING',	'2026-07-01 21:44:18.522',	'2026-07-01 21:44:18.522'),
('4396d28b-86c2-4176-8d9c-296c7747418c',	'32ba5865-c826-4c7c-b4c7-33537b639330',	'65b28593-f9ef-4473-b562-eea75c88316c',	0,	0,	0,	'PENDING',	'2026-06-26 16:12:28.734',	'2026-06-26 16:12:28.734'),
('b65ec35e-86f3-4f1c-b70e-1e5a9bffbeb9',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'1',	0,	0,	0,	'PENDING',	'2026-06-29 19:47:59.42',	'2026-06-29 19:47:59.42'),
('bd7ff57e-effe-48b0-89ee-8d82a2fb5e05',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'2',	0,	0,	0,	'PENDING',	'2026-06-29 19:51:53.883',	'2026-06-29 19:51:53.883'),
('c3528aaa-6b56-4bcd-966b-a2d962e89e95',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'6',	0,	0,	0,	'PENDING',	'2026-06-29 19:55:05.098',	'2026-06-29 19:55:05.098'),
('3e8d7660-f3b6-459a-8992-e585c5d3805d',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	35,	0,	35,	'PENDING',	'2026-06-29 20:17:41.863',	'2026-06-29 20:17:41.863'),
('eb8e806b-890c-43c1-a7a5-52a8aacf5f6c',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'5',	0,	0,	0,	'PENDING',	'2026-06-29 20:21:36.999',	'2026-06-29 20:21:36.999'),
('532c6557-94c6-450b-936d-859694fcdc65',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'5',	0,	0,	0,	'PENDING',	'2026-06-30 13:08:14.322',	'2026-06-30 13:08:14.322'),
('d30dec23-cab2-4b5e-bde7-82a328eb3a9a',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'2',	0,	0,	0,	'PENDING',	'2026-06-30 13:12:50.544',	'2026-06-30 13:12:50.544'),
('ebb7400a-9c72-43ce-8713-7219935d5f7d',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'4',	0,	0,	0,	'PENDING',	'2026-06-30 13:13:40.525',	'2026-06-30 13:13:40.525'),
('85c37c74-b3bd-4a9c-b8de-b6cbd91f4f52',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'34',	0,	0,	0,	'PENDING',	'2026-06-30 13:13:57.221',	'2026-06-30 13:13:57.221'),
('6407d8a1-fb9d-4e2b-80a0-7924654b5ec8',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	0,	0,	0,	'PENDING',	'2026-06-30 14:07:18.209',	'2026-06-30 14:07:18.209'),
('bc3a90ce-46fe-40a7-b62b-4c44a9c6d7e1',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'65b28593-f9ef-4473-b562-eea75c88316c',	0,	0,	0,	'PENDING',	'2026-06-30 17:07:58.311',	'2026-06-30 17:07:58.311'),
('74efc4c2-f26f-4296-af30-525deedc6780',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'5',	0,	0,	0,	'PENDING',	'2026-06-30 17:08:16.987',	'2026-06-30 17:08:16.987'),
('33b58601-9bd6-418f-a7b2-63e26c378775',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'bfa00e59-3d57-48bd-89d6-9d3a4625a650',	0,	0,	0,	'PENDING',	'2026-06-30 17:08:23.61',	'2026-06-30 17:08:23.61'),
('b77f6b58-023f-412f-815f-5b2a975e0284',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'2',	0,	0,	0,	'PENDING',	'2026-06-30 17:10:54.041',	'2026-06-30 17:10:54.041'),
('8213a49d-29f3-4058-8766-c405b18c5307',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	0,	0,	0,	'PENDING',	'2026-06-30 17:21:51.506',	'2026-06-30 17:21:51.506'),
('60df9211-9311-4396-9bb1-625b4e40a065',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	0,	0,	0,	'PENDING',	'2026-06-30 17:23:37.563',	'2026-06-30 17:23:37.563'),
('16664ec7-499c-4028-905a-0d9f541e50c0',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	0,	0,	0,	'PENDING',	'2026-06-30 17:28:55.274',	'2026-06-30 17:28:55.274'),
('2aa21866-cd5e-4d9a-bf75-d50cf955edef',	'5e668417-02ad-40c0-8c73-723257ee4349',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	0,	0,	0,	'PENDING',	'2026-07-01 11:30:45.651',	'2026-07-01 11:30:45.651'),
('4a9a59af-301e-4317-bd45-680dc42276d5',	'5e668417-02ad-40c0-8c73-723257ee4349',	'5',	0,	0,	0,	'PENDING',	'2026-07-01 12:08:19.046',	'2026-07-01 12:08:19.046'),
('0c5e092d-4d9a-460d-a319-136655e52872',	'5e668417-02ad-40c0-8c73-723257ee4349',	'19',	467.13,	0,	467.13,	'PENDING',	'2026-07-01 13:06:08.672',	'2026-07-01 13:06:08.672'),
('31fd2096-1a55-40ff-afe8-b9bb59d47287',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'65b28593-f9ef-4473-b562-eea75c88316c',	0,	0,	0,	'PENDING',	'2026-07-01 13:07:08.182',	'2026-07-01 13:07:08.182'),
('6405defb-c262-4c00-9261-7fa66083c834',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'1',	0,	0,	0,	'PENDING',	'2026-07-01 13:08:27.744',	'2026-07-01 13:08:27.744'),
('aff6ec62-9ddf-4354-9189-ea05ac0a5557',	'5e668417-02ad-40c0-8c73-723257ee4349',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	0,	0,	0,	'PENDING',	'2026-07-01 13:11:33.135',	'2026-07-01 13:11:33.135'),
('90ddb7b9-c569-442f-aeff-4b0bf40b5f7a',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	'5',	886.78,	0,	886.78,	'PENDING',	'2026-07-01 13:44:01.621',	'2026-07-01 13:44:01.621'),
('8fc5c1b4-f4c6-41c9-a08e-49bc9fbdefa6',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'1',	0,	0,	0,	'PENDING',	'2026-07-01 15:41:08.5',	'2026-07-01 15:41:08.5'),
('fdd5f0a2-155a-4269-be7a-8a014d9f87a1',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'16',	0,	0,	0,	'PENDING',	'2026-07-01 15:44:36.314',	'2026-07-01 15:44:36.314'),
('2fb6dd92-aa85-484c-b31a-1a559bc5625a',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'2',	0,	0,	0,	'PENDING',	'2026-07-01 15:45:15.947',	'2026-07-01 15:45:15.947'),
('f4cf8b9c-80a0-40d9-8955-993b520be9c0',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'3',	0,	0,	0,	'PENDING',	'2026-07-01 15:46:07.831',	'2026-07-01 15:46:07.831'),
('d559ca3c-6836-444d-a4df-5fbad6e88450',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'4',	0,	0,	0,	'PENDING',	'2026-07-01 15:47:44.024',	'2026-07-01 15:47:44.024'),
('51a193fd-2f72-4680-b73e-0b192070153c',	'5e668417-02ad-40c0-8c73-723257ee4349',	'52',	74.05,	0,	74.05,	'PENDING',	'2026-07-01 16:45:44.285',	'2026-07-01 16:47:50.081'),
('32137977-9b02-40ff-80ef-4d06f8e82538',	'5e668417-02ad-40c0-8c73-723257ee4349',	'2',	41.37,	0,	41.37,	'PENDING',	'2026-07-01 13:14:49.169',	'2026-07-01 16:49:51.327'),
('264e6cdf-7815-4873-a358-0e6f47ce5a93',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'19',	0,	0,	0,	'PENDING',	'2026-07-01 22:32:22.112',	'2026-07-01 22:32:22.112'),
('17ee7767-facd-4176-961f-6ea96ec28466',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'16',	247.54,	0,	247.54,	'PENDING',	'2026-07-01 23:41:08.391',	'2026-07-01 23:41:08.391'),
('3e765d0e-a3c3-4913-8e40-004caa982db6',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'5',	0,	0,	0,	'PENDING',	'2026-07-02 12:29:22.005',	'2026-07-02 12:29:22.005'),
('8bb46dd1-ce30-4eaf-a253-4c3e07a7db47',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'16',	521.33,	0,	521.33,	'PENDING',	'2026-07-02 12:42:52.5',	'2026-07-03 00:22:30.185'),
('f8a60167-e5ec-4631-9fd8-583bca313516',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'24',	520.83,	0,	520.83,	'PENDING',	'2026-07-02 12:17:06.239',	'2026-07-02 15:33:49.406'),
('ec10cd42-7a50-4e35-bcfc-c637e11e0168',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'13',	807.29,	0,	807.29,	'PENDING',	'2026-07-02 12:18:22.693',	'2026-07-02 15:35:42.68'),
('db85bae0-af37-4789-9ab5-1a9b47121be2',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'5',	443.4,	443.4,	0,	'PAID',	'2026-07-01 23:05:26.012',	'2026-07-03 13:31:48.538'),
('9f9d513d-8e6e-467f-b5f5-483237e7d564',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	0,	0,	0,	'PENDING',	'2026-07-02 12:50:37.854',	'2026-07-02 12:50:37.854'),
('f1d71fcb-b498-47ce-929a-ce8a5b3a14d9',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'27',	0,	0,	0,	'PENDING',	'2026-07-02 18:50:50.224',	'2026-07-02 18:50:50.224'),
('5afaf7a5-9306-455c-98f4-1086ef15a8f3',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	0,	0,	0,	'PENDING',	'2026-07-02 18:51:12.892',	'2026-07-02 18:51:12.892'),
('e0cab2b8-5a2d-435e-8b65-308163981bd9',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'2',	648.94,	0,	648.94,	'PENDING',	'2026-07-03 00:22:21.425',	'2026-07-03 00:22:21.425'),
('2a015745-4d5d-408f-ac21-af6fad8f9268',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'836f1aa6-7d5f-4b1f-a41c-246cb0132273',	378,	0,	378,	'PENDING',	'2026-07-02 12:44:57.415',	'2026-07-03 00:22:30.219'),
('fc3abc50-c072-4b06-9673-701d9274cdf3',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'5',	0,	0,	0,	'PENDING',	'2026-07-03 10:32:07.44',	'2026-07-03 10:32:07.44'),
('550a9077-509b-41a1-a341-47e2a4d67ec2',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'2',	0,	0,	0,	'PENDING',	'2026-07-03 11:00:16.275',	'2026-07-03 11:00:16.275'),
('2fa4c1d1-876c-4c83-bf71-1e26e6626c59',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	0,	0,	0,	'PENDING',	'2026-07-03 11:15:18.219',	'2026-07-03 11:15:18.219'),
('8e2d22d8-1c78-4906-8d7f-7619463b82ce',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	0,	0,	0,	'PENDING',	'2026-07-03 12:08:15.119',	'2026-07-03 12:08:15.119'),
('8c954c7c-d4de-4888-be3b-e26ca472becc',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	0,	0,	0,	'PENDING',	'2026-07-03 13:03:26.731',	'2026-07-03 13:03:26.731'),
('fc810f49-0c67-40d7-b878-3f6031a6896a',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	420,	0,	420,	'PENDING',	'2026-07-02 12:55:27.734',	'2026-07-02 13:53:42.737'),
('30e3e409-5997-41bf-b6a8-a3179c32f904',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'19',	2007.1,	0,	2007.1,	'PENDING',	'2026-07-02 12:13:06.791',	'2026-07-02 15:27:23.105'),
('6cebd284-6e0f-4c06-9348-e8913911ca75',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'1',	2613.5,	0,	2613.5,	'PENDING',	'2026-07-02 15:29:20.826',	'2026-07-02 15:29:20.826'),
('09a5a94d-3f5b-435d-a07b-ce42158c9169',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	322.91,	0,	322.91,	'PENDING',	'2026-07-02 12:21:09.974',	'2026-07-02 15:40:38.085'),
('62554b1d-1f86-4fef-a3d8-75d9d7a6011e',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	175,	0,	175,	'PENDING',	'2026-07-02 12:47:57.284',	'2026-07-02 15:41:05.907'),
('1ca328a8-3ec2-4d44-bde2-d829bac53ad2',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'12',	239.58,	0,	239.58,	'PENDING',	'2026-07-02 15:37:11.134',	'2026-07-02 15:51:26.394'),
('d17cde63-6665-4633-b581-75dd2998ad0c',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'3',	395,	0,	395,	'PENDING',	'2026-07-02 16:12:54.218',	'2026-07-02 16:15:48.566'),
('86b1906d-0761-4985-a18b-40c0f940a5db',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'2',	324.47,	324.47,	0,	'PAID',	'2026-07-02 15:37:54.75',	'2026-07-02 16:56:39.807'),
('a81d88c0-4208-4999-a5f4-179d8c772df1',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'2',	0,	0,	0,	'PENDING',	'2026-07-02 17:41:19.39',	'2026-07-02 17:41:19.39'),
('0780d1d9-5c8e-449d-a85b-088c118e0a36',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	0,	0,	0,	'PENDING',	'2026-07-02 17:42:47.574',	'2026-07-02 17:42:47.574'),
('32d4d923-9607-408e-b05b-68d223e40480',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	0,	0,	0,	'PENDING',	'2026-07-02 17:44:53.892',	'2026-07-02 17:44:53.892'),
('e357c115-921b-4e63-9c5a-d58f4c6bb4f1',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	0,	0,	0,	'PENDING',	'2026-07-02 17:45:35.688',	'2026-07-02 17:45:35.688'),
('e1b2c838-1280-4356-9e18-f25dea0fd0de',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'65b28593-f9ef-4473-b562-eea75c88316c',	0,	0,	0,	'PENDING',	'2026-07-02 18:43:13.959',	'2026-07-02 18:43:13.959'),
('4b0085b6-060e-4d22-be55-a580721cd810',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'1',	0,	0,	0,	'PENDING',	'2026-07-02 18:45:13.341',	'2026-07-02 18:45:13.341'),
('b94a298e-4a14-4efd-856c-cafb9b8d882f',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	595,	245,	350,	'PAID',	'2026-07-03 13:43:50.682',	'2026-07-03 13:43:50.682'),
('e8333764-4d9b-4f17-926f-8e2b74d305de',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'b101d8cb-00b8-40c0-a4c3-93e2be8db81f',	698.42,	0,	698.42,	'PAID',	'2026-07-03 13:43:50.687',	'2026-07-03 13:43:50.687'),
('3c94163e-9227-4b08-ac94-4b46a991ce13',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'1',	4604.42,	4604.42,	0,	'PAID',	'2026-07-03 13:43:50.691',	'2026-07-03 13:43:50.691'),
('f4dc9752-b567-461a-aad5-952e8e635ffd',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'3',	270.83,	0,	270.83,	'PENDING',	'2026-07-03 13:43:50.699',	'2026-07-03 13:43:50.699'),
('06322a6d-cfec-4e86-9da2-9d7dc8d62cd5',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'13',	550,	0,	550,	'PENDING',	'2026-07-03 13:43:50.704',	'2026-07-03 13:43:50.704'),
('f065aebf-21cf-4162-a994-3f62be62c9e5',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'13',	243.75,	0,	243.75,	'PENDING',	'2026-07-03 13:43:50.8',	'2026-07-03 13:43:50.8'),
('c6b3acb5-ad84-4b17-84ca-6cec7ff63406',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'24',	245.83,	245.83,	0,	'PAID',	'2026-07-03 13:43:50.804',	'2026-07-03 13:43:50.804'),
('24e29b1d-769e-432c-89aa-d2b7398c2e19',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'1',	1894.88,	1894.88,	0,	'PAID',	'2026-07-03 13:43:50.81',	'2026-07-03 13:43:50.81'),
('3c5014a4-17de-452f-9789-9c1ea40d0d20',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	140,	0,	140,	'PENDING',	'2026-07-03 13:43:50.816',	'2026-07-03 13:43:50.816'),
('a25ce306-d482-45e3-a9fe-b2ae91e1f69d',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'3',	218.75,	218.75,	0,	'PAID',	'2026-07-03 13:43:50.824',	'2026-07-03 13:43:50.824'),
('59866e7e-c3fe-4996-b2f1-c1602e6836d1',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'24',	619.79,	0,	619.79,	'PENDING',	'2026-07-03 13:43:51.185',	'2026-07-03 13:43:51.185'),
('b23c7bfb-a8c4-4e47-b10f-5d144498c8d4',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'5',	2599.6,	868.89,	1730.71,	'PAID',	'2026-07-03 13:43:51.188',	'2026-07-03 13:43:51.188'),
('3b7d7c95-2926-4476-ad04-23568f878203',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	175,	0,	175,	'PENDING',	'2026-07-03 13:43:51.193',	'2026-07-03 13:43:51.193'),
('28553810-41d6-4a5f-afc6-30cc3fd41ada',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'3',	218.75,	0,	218.75,	'PENDING',	'2026-07-03 13:43:51.196',	'2026-07-03 13:43:51.196'),
('a2b549ff-40dc-42ad-9123-d8670bb3c3ac',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'b101d8cb-00b8-40c0-a4c3-93e2be8db81f',	624.3,	0,	624.3,	'PENDING',	'2026-07-03 13:43:51.199',	'2026-07-03 13:43:51.199'),
('092f377d-a1a8-4705-b362-57810be17426',	'66814ef2-1e4e-4a61-acdd-b278a910034d',	'5',	819.8,	819.8,	0,	'PAID',	'2026-07-03 13:44:01.986',	'2026-07-03 13:44:01.986'),
('ee0dc417-2c59-429d-a63e-40e2c890cc40',	'73eab461-94a8-47c6-913f-7eaa439426f5',	'14',	1123,	0,	1123,	'PENDING',	'2026-07-03 13:44:04.154',	'2026-07-03 13:44:04.154'),
('bf00c44b-7989-472b-b1b6-c51decee1344',	'c297180e-838b-4604-a79a-0fe024ee7d4e',	'5',	245.3,	0,	245.3,	'PENDING',	'2026-07-03 13:44:04.762',	'2026-07-03 13:44:04.762'),
('70d6eecd-f61f-453a-9485-78cc79e91e29',	'13f9b680-5767-4616-ab5d-a40280b79890',	'17',	2675.68,	0,	2675.68,	'PENDING',	'2026-07-03 13:44:04.978',	'2026-07-03 13:44:04.978');

DROP TABLE IF EXISTS "Destination";
CREATE TABLE "public"."Destination" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "country" text NOT NULL,
    "description" text NOT NULL,
    "imageKey" text,
    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "Destination" ("id", "name", "country", "description", "imageKey") VALUES
('63473d0c-6f7e-42e5-9ffc-d44d9db000ce',	'Paris',	'France',	'The City of Lights, famous for arts, fashion, and history.',	NULL);

DROP TABLE IF EXISTS "DocumentTemplate";
CREATE TABLE "public"."DocumentTemplate" (
    "id" text NOT NULL,
    "templateType" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "htmlContent" text NOT NULL,
    "updatedBy" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "DocumentTemplate_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "DocumentTemplate_templateType_key" ON public."DocumentTemplate" USING btree ("templateType");

INSERT INTO "DocumentTemplate" ("id", "templateType", "name", "description", "htmlContent", "updatedBy", "createdAt", "updatedAt") VALUES
('7af60f3e-3f86-4527-aea7-b3d1ea022b1c',	'FLIGHT_TICKET',	'Flight Ticket',	'E-ticket itinerary with route, PNR, baggage and passenger details — one ticket per passenger.',	'{{FLIGHT_TICKET_PAGES}}',	NULL,	'2026-06-26 12:53:58.247',	'2026-06-26 12:53:58.247'),
('39619f09-48da-44f3-b6e9-c70a703e27d8',	'HOTEL_VOUCHER',	'Hotel Voucher',	'Hotel accommodation voucher with check-in/out, room type, and guest list.',	'<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Hotel Voucher Template</title>
<style>

  @import url(''https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'');
  
  @media print {
    body {
      background: #FFFFFF !important;
      color: #000000 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }

  * { box-sizing: border-box; }
  body {
    font-family: ''Plus Jakarta Sans'', sans-serif;
    color: #1E293B;
    background: #F8FAFC;
    margin: 0;
    padding: 20px;
    font-size: 11px;
    line-height: 1.5;
  }

  .document-container {
    max-width: 800px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  /* Header grid */
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #F1F5F9;
    padding-bottom: 20px;
    margin-bottom: 24px;
  }

  .brand-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .logos-block {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* Title & Reference */
  .doc-title-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .doc-title {
    font-family: ''Outfit'', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #0F172A;
    text-transform: uppercase;
    margin: 0;
  }

  .doc-meta {
    text-align: right;
  }

  .doc-meta p {
    margin: 2px 0;
    color: #475569;
  }

  .doc-meta strong {
    color: #0F172A;
  }

  /* Customer/Vendor Blocks */
  .info-grid {
    display: grid;
    grid-template-cols: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
    background: #F8FAFC;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #F1F5F9;
  }

  .info-box h3 {
    font-family: ''Outfit'', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    color: #0EA5E9;
    margin-top: 0;
    margin-bottom: 8px;
    letter-spacing: 1px;
    font-weight: 700;
  }

  .info-box p {
    margin: 3px 0;
    color: #334155;
  }

  /* Detail Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
  }

  table.data-table th {
    background: #0F172A;
    color: #FFFFFF;
    font-family: ''Outfit'', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    letter-spacing: 0.5px;
    padding: 8px 12px;
    text-align: left;
    border: 1px solid #0F172A;
  }

  table.data-table td {
    padding: 8px 12px;
    border: 1px solid #E2E8F0;
    vertical-align: top;
  }

  table.data-table tr:nth-child(even) {
    background: #F8FAFC;
  }

  .text-right { text-align: right !important; }
  .text-center { text-align: center !important; }

  /* Financial Breakdown Panel */
  .financial-panel {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 24px;
  }

  .financial-table {
    width: 300px;
    border-collapse: collapse;
  }

  .financial-table td {
    padding: 6px 12px;
    border-bottom: 1px solid #E2E8F0;
  }

  .financial-table tr.total-row td {
    font-size: 13px;
    font-weight: 700;
    color: #0F172A;
    border-bottom: 2px double #0F172A;
    background: #F8FAFC;
  }

  .financial-table tr.due-row td {
    font-size: 14px;
    font-weight: 900;
    color: #E11D48;
    background: #FFF1F2;
    border: 1px solid #FFE4E6;
  }

  /* Footer Details */
  .doc-footer {
    border-top: 2px dashed #E2E8F0;
    padding-top: 20px;
    margin-top: 30px;
    text-align: center;
    color: #64748B;
    font-size: 9px;
  }

  .doc-footer p {
    margin: 4px 0;
  }

  /* Section Title badge style */
  .section-badge {
    display: inline-block;
    padding: 2px 6px;
    background: #E0F2FE;
    color: #0369A1;
    font-weight: 700;
    border-radius: 4px;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  /* E-ticket / Voucher Specifics */
  .ticket-card {
    border: 1.5px solid #0F172A;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  /* Timeline component styles */
  .timeline-container {
    position: relative;
    padding-left: 28px;
    margin: 20px 0 20px 8px;
    border-left: 2px solid #E2E8F0;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 20px;
  }
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  .timeline-badge {
    position: absolute;
    left: -40px;
    top: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 2px solid #64748B;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    z-index: 10;
  }
  .timeline-badge.flight { border-color: #0284C7; color: #0284C7; }
  .timeline-badge.hotel { border-color: #10B981; color: #10B981; }
  .timeline-badge.transfer { border-color: #F59E0B; color: #F59E0B; }
  .timeline-badge.visa { border-color: #8B5CF6; color: #8B5CF6; }
  .timeline-badge.special { border-color: #EC4899; color: #EC4899; }
  
  .timeline-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px 16px;
    text-align: left;
  }
  .timeline-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    border-bottom: 1px dashed #E2E8F0;
    padding-bottom: 6px;
  }
  .timeline-title {
    font-family: ''Outfit'', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #0F172A;
  }
  .timeline-date {
    font-size: 9.5px;
    color: #64748B;
    font-weight: 600;
  }
  .timeline-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 16px;
    font-size: 10px;
  }
  .timeline-detail-item {
    color: #475569;
  }
  .timeline-detail-item strong {
    color: #0F172A;
  }
  .timeline-badge-status {
    font-size: 8px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 99px;
    text-transform: uppercase;
  }
  .timeline-badge-status.confirmed { background: #DCFCE7; color: #15803D; }
  .timeline-badge-status.pending { background: #FEF3C7; color: #D97706; }
  .timeline-badge-status.cancelled { background: #FEE2E2; color: #991B1B; }

  /* Terms Grid styling */
  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 24px;
    font-size: 8.5px;
    color: #64748B;
    text-align: left;
  }
  .terms-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px;
  }
  .terms-card h4 {
    margin: 0 0 6px 0;
    color: #0F172A;
    font-family: ''Outfit'', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .terms-card p {
    margin: 0;
    line-height: 1.4;
  }

.voucher-header { background: linear-gradient(135deg, #0F172A, #1E3A5F); color: white; border-radius: 12px 12px 0 0; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
.voucher-body { border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; }
.hotel-name { font-size: 20px; font-weight: 900; margin: 0 0 4px; }
.badge { display: inline-block; font-size: 8px; font-weight: 800; padding: 3px 10px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(255,255,255,0.15); color: white; }
.checkin-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; margin: 16px 0; text-align: center; }
.date-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; }
.date-label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.date-value { font-size: 16px; font-weight: 900; color: #0F172A; }
.nights-badge { display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0EA5E9; color: white; border-radius: 50%; width: 48px; height: 48px; font-weight: 900; font-size: 18px; margin: auto; }
.nights-label { font-size: 8px; font-weight: 700; margin-top: -2px; }
.info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.info-cell { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; }
.info-cell label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 4px; }
.info-cell span { font-size: 12px; font-weight: 700; color: #0F172A; }
.passenger-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 10px; }
.passenger-table th { background: #1E293B; color: white; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
.passenger-table td { padding: 7px 10px; border-bottom: 1px solid #F1F5F9; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      
    <img src="/Logo.svg" alt="Terrific Travel Logo" style="height: 60px; width: auto; max-width: 250px; display: block;" />
  
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
      </p>
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
      <div class="logos-block">
        
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#0054A6"/>
      <circle cx="32" cy="20" r="14" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>
      <path d="M15 12H21M18 12V28M15 28H21" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <text x="21" y="26" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="-0.5">IATA</text>
      <text x="18" y="34" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#FFFFFF" letter-spacing="1">MEMBER AGENT</text>
    </svg>
  
        
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#D97706"/>
      <circle cx="32" cy="20" r="15" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M22 17L32 12L42 17L32 28L22 17Z" fill="#FFFFFF" opacity="0.2"/>
      <text x="32" y="19" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="9" fill="#FFFFFF" text-anchor="middle">ATOL</text>
      <text x="32" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">PROTECTED</text>
      <text x="32" y="35" font-family="Arial, sans-serif" font-size="4" fill="#FFFFFF" text-anchor="middle" opacity="0.8">REG. NO 11492</text>
    </svg>
  
      </div>
      <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
        <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
        <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
      </svg>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Hotel Booking Voucher</h1>
      <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: Confirmed</span>
    </div>
    <div class="doc-meta">
      <p>Voucher No: <strong>{{VOUCHER_NO}}</strong></p>
      <p>Issue Date: <strong>{{ISSUE_DATE}}</strong></p>
      <p>Booking Reference: <strong>{{BOOKING_REF}}</strong></p>
      <p>Hotel Confirmation #: <strong style="font-size: 12px; color: #10B981;">{{HOTEL_CONFIRMATION_NO}}</strong></p>
      <p>GDS Reservation Code: <strong>{{GDS_CODE}}</strong></p>
    </div>
  </div>

  <div class="voucher-body" style="border:none; padding:0;">
    <div class="checkin-row">
      {{HOTEL_STAY_ROW}}
    </div>

    <div class="info-row">
      <div class="info-cell"><label>Hotel Confirmation #</label><span>{{HOTEL_CONFIRMATION_NO}}</span></div>
      <div class="info-cell"><label>GDS Reservation Code</label><span>{{GDS_CODE}}</span></div>
      <div class="info-cell"><label>Guest / Lead Client Details</label><span>{{LEAD_PASSENGER_BLOCK}}</span></div>
      <div class="info-cell"><label>Total Guests</label><span>{{TOTAL_GUESTS}} Guest(s)</span></div>
      <div class="info-cell" style="grid-column: span 2;">
        <label>Property &amp; Vendor Information</label>
        <span>City/Region: {{HOTEL_CITY}}<br>Address: {{HOTEL_ADDRESS}}</span>
        <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 8px 0;" />
        <label>Fulfillment Vendor</label>
        <span><strong>{{VENDOR_NAME}}</strong><br>Phone: {{VENDOR_PHONE}}<br>Email: {{VENDOR_EMAIL}}</span>
      </div>
    </div>

    <h3 style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 6px;">Guest List</h3>
    <table class="passenger-table">
      <thead><tr><th>No.</th><th>Guest Name</th><th>Age Category</th><th>Nationality</th></tr></thead>
      <tbody>
        {{GUESTS_TABLE_ROWS}}
      </tbody>
    </table>

    <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px; margin-top: 16px;">
      <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Important Check-In Information</p>
      <p style="margin: 0;">1. Present this printable voucher at the hotel reception desk along with a valid photo ID of all adult guests for verification.</p>
      <p style="margin: 0;">2. A security deposit via credit card or cash may be requested by the hotel reception at check-in for incidental charges.</p>
      <p style="margin: 0;">3. Early check-in and late check-out requests are subject to availability and hotel convenience.</p>
      <p style="margin: 0;">4. Cancellation and modifications are strictly governed by hotel policies. Pre-paid booking voucher cannot be refunded directly.</p>
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · ATOL Protected · Reg No: 11492 · office@terrifictravel.co.uk<br>
      Please present this voucher at check-in. All special requests are subject to availability.
    </div>
  </div>
</div>
</body>
</html>',	NULL,	'2026-06-26 12:53:58.272',	'2026-06-26 12:53:58.272'),
('bcd6fc9f-c71f-4fd4-9e5e-e830ff7e0e93',	'TRANSPORT_VOUCHER',	'Transfer Voucher',	'Ground transport voucher with route, pickup time, vehicle and driver details.',	'<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Transport Voucher Template</title>
<style>

  @import url(''https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'');
  
  @media print {
    body {
      background: #FFFFFF !important;
      color: #000000 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }

  * { box-sizing: border-box; }
  body {
    font-family: ''Plus Jakarta Sans'', sans-serif;
    color: #1E293B;
    background: #F8FAFC;
    margin: 0;
    padding: 20px;
    font-size: 11px;
    line-height: 1.5;
  }

  .document-container {
    max-width: 800px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  /* Header grid */
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #F1F5F9;
    padding-bottom: 20px;
    margin-bottom: 24px;
  }

  .brand-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .logos-block {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* Title & Reference */
  .doc-title-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .doc-title {
    font-family: ''Outfit'', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #0F172A;
    text-transform: uppercase;
    margin: 0;
  }

  .doc-meta {
    text-align: right;
  }

  .doc-meta p {
    margin: 2px 0;
    color: #475569;
  }

  .doc-meta strong {
    color: #0F172A;
  }

  /* Customer/Vendor Blocks */
  .info-grid {
    display: grid;
    grid-template-cols: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
    background: #F8FAFC;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #F1F5F9;
  }

  .info-box h3 {
    font-family: ''Outfit'', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    color: #0EA5E9;
    margin-top: 0;
    margin-bottom: 8px;
    letter-spacing: 1px;
    font-weight: 700;
  }

  .info-box p {
    margin: 3px 0;
    color: #334155;
  }

  /* Detail Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
  }

  table.data-table th {
    background: #0F172A;
    color: #FFFFFF;
    font-family: ''Outfit'', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    letter-spacing: 0.5px;
    padding: 8px 12px;
    text-align: left;
    border: 1px solid #0F172A;
  }

  table.data-table td {
    padding: 8px 12px;
    border: 1px solid #E2E8F0;
    vertical-align: top;
  }

  table.data-table tr:nth-child(even) {
    background: #F8FAFC;
  }

  .text-right { text-align: right !important; }
  .text-center { text-align: center !important; }

  /* Financial Breakdown Panel */
  .financial-panel {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 24px;
  }

  .financial-table {
    width: 300px;
    border-collapse: collapse;
  }

  .financial-table td {
    padding: 6px 12px;
    border-bottom: 1px solid #E2E8F0;
  }

  .financial-table tr.total-row td {
    font-size: 13px;
    font-weight: 700;
    color: #0F172A;
    border-bottom: 2px double #0F172A;
    background: #F8FAFC;
  }

  .financial-table tr.due-row td {
    font-size: 14px;
    font-weight: 900;
    color: #E11D48;
    background: #FFF1F2;
    border: 1px solid #FFE4E6;
  }

  /* Footer Details */
  .doc-footer {
    border-top: 2px dashed #E2E8F0;
    padding-top: 20px;
    margin-top: 30px;
    text-align: center;
    color: #64748B;
    font-size: 9px;
  }

  .doc-footer p {
    margin: 4px 0;
  }

  /* Section Title badge style */
  .section-badge {
    display: inline-block;
    padding: 2px 6px;
    background: #E0F2FE;
    color: #0369A1;
    font-weight: 700;
    border-radius: 4px;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  /* E-ticket / Voucher Specifics */
  .ticket-card {
    border: 1.5px solid #0F172A;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  /* Timeline component styles */
  .timeline-container {
    position: relative;
    padding-left: 28px;
    margin: 20px 0 20px 8px;
    border-left: 2px solid #E2E8F0;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 20px;
  }
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  .timeline-badge {
    position: absolute;
    left: -40px;
    top: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 2px solid #64748B;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    z-index: 10;
  }
  .timeline-badge.flight { border-color: #0284C7; color: #0284C7; }
  .timeline-badge.hotel { border-color: #10B981; color: #10B981; }
  .timeline-badge.transfer { border-color: #F59E0B; color: #F59E0B; }
  .timeline-badge.visa { border-color: #8B5CF6; color: #8B5CF6; }
  .timeline-badge.special { border-color: #EC4899; color: #EC4899; }
  
  .timeline-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px 16px;
    text-align: left;
  }
  .timeline-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    border-bottom: 1px dashed #E2E8F0;
    padding-bottom: 6px;
  }
  .timeline-title {
    font-family: ''Outfit'', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #0F172A;
  }
  .timeline-date {
    font-size: 9.5px;
    color: #64748B;
    font-weight: 600;
  }
  .timeline-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 16px;
    font-size: 10px;
  }
  .timeline-detail-item {
    color: #475569;
  }
  .timeline-detail-item strong {
    color: #0F172A;
  }
  .timeline-badge-status {
    font-size: 8px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 99px;
    text-transform: uppercase;
  }
  .timeline-badge-status.confirmed { background: #DCFCE7; color: #15803D; }
  .timeline-badge-status.pending { background: #FEF3C7; color: #D97706; }
  .timeline-badge-status.cancelled { background: #FEE2E2; color: #991B1B; }

  /* Terms Grid styling */
  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 24px;
    font-size: 8.5px;
    color: #64748B;
    text-align: left;
  }
  .terms-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px;
  }
  .terms-card h4 {
    margin: 0 0 6px 0;
    color: #0F172A;
    font-family: ''Outfit'', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .terms-card p {
    margin: 0;
    line-height: 1.4;
  }

.transport-header { background: linear-gradient(135deg, #064E3B, #065F46); color: white; border-radius: 12px 12px 0 0; padding: 20px 24px; }
.transport-body { border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; }
.route-visual { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
.route-point { flex: 1; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 16px; }
.route-point label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 4px; }
.route-point span { font-size: 13px; font-weight: 800; color: #0F172A; }
.route-arrow { font-size: 20px; color: #10B981; font-weight: 900; flex-shrink: 0; }
.details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px; }
.detail-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; }
.detail-box label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 4px; }
.detail-box span { font-size: 12px; font-weight: 700; }
.passenger-table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 10px; }
.passenger-table th { background: #064E3B; color: white; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; }
.passenger-table td { padding: 7px 10px; border-bottom: 1px solid #F1F5F9; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      
    <img src="/Logo.svg" alt="Terrific Travel Logo" style="height: 60px; width: auto; max-width: 250px; display: block;" />
  
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
      </p>
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
      <div class="logos-block">
        
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#0054A6"/>
      <circle cx="32" cy="20" r="14" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>
      <path d="M15 12H21M18 12V28M15 28H21" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <text x="21" y="26" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="-0.5">IATA</text>
      <text x="18" y="34" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#FFFFFF" letter-spacing="1">MEMBER AGENT</text>
    </svg>
  
        
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#D97706"/>
      <circle cx="32" cy="20" r="15" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M22 17L32 12L42 17L32 28L22 17Z" fill="#FFFFFF" opacity="0.2"/>
      <text x="32" y="19" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="9" fill="#FFFFFF" text-anchor="middle">ATOL</text>
      <text x="32" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">PROTECTED</text>
      <text x="32" y="35" font-family="Arial, sans-serif" font-size="4" fill="#FFFFFF" text-anchor="middle" opacity="0.8">REG. NO 11492</text>
    </svg>
  
      </div>
      <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
        <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
        <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
      </svg>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Transfer Voucher</h1>
      <span class="section-badge" style="background: #FEF3C7; color: #D97706;">Service: Scheduled</span>
    </div>
    <div class="doc-meta">
      <p>Voucher No: <strong>{{VOUCHER_NO}}</strong></p>
      <p>Issue Date: <strong>{{ISSUE_DATE}}</strong></p>
      <p>Booking Reference: <strong>{{BOOKING_REF}}</strong></p>
    </div>
  </div>

  <div class="transport-body" style="border:none; padding:0;">
    <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
      <div class="info-box">
        <h3>Lead Passenger / Guest</h3>
        {{LEAD_PASSENGER_BLOCK}}
      </div>
      <div class="info-box">
        <h3>Booking Summary</h3>
        <p>Total Scheduled Transfers: <strong>{{TOTAL_TRANSFERS}} Leg(s)</strong></p>
        <p>Ground Status: <strong>Confirmed &amp; Secured</strong></p>
      </div>
      <div class="info-box">
        <h3>Fulfillment Vendor Details</h3>
        <p><strong>Vendor Name:</strong> {{VENDOR_NAME}}</p>
        <p><strong>Phone:</strong> {{VENDOR_PHONE}}</p>
        <p><strong>Email:</strong> {{VENDOR_EMAIL}}</p>
      </div>
    </div>

    <h3 style="font-family: ''Outfit'', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Route &amp; Service Details</h3>
    <table class="data-table" style="margin-bottom: 24px;">
      <thead>
        <tr>
          <th>Date &amp; Time</th>
          <th>Pick-up Location</th>
          <th>Drop-off Destination</th>
          <th>Vehicle &amp; Transfer Details</th>
          <th class="text-right">Price</th>
        </tr>
      </thead>
      <tbody>
        {{TRANSFERS_TABLE_ROWS}}
      </tbody>
    </table>

    <div class="financial-panel">
      <table class="financial-table">
        <tr class="total-row">
          <td><strong>Total Ground Cost:</strong></td>
          <td class="text-right"><strong>{{TOTAL_GROUND_COST}}</strong></td>
        </tr>
      </table>
    </div>

    <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px;">
      <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Important Transfer Notices</p>
      <p style="margin: 0;">1. Driver will hold a sign with the lead passenger''s name at the designated arrivals exit or hotel lobby.</p>
      <p style="margin: 0;">2. Maximum waiting time for flight arrivals is 60 minutes after actual landing. Contact support if delayed in customs.</p>
      <p style="margin: 0;">3. For departure transfers, please be present at the hotel lobby 10 minutes prior to scheduled pickup time.</p>
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd | Ground Operations and VIP Client Transfers<br>
      We wish you a pleasant and comfortable ride!
    </div>
  </div>
</div>
</body>
</html>',	NULL,	'2026-06-26 12:53:58.298',	'2026-06-26 12:53:58.298'),
('d0caff11-f497-4282-ae8d-eebf3718446e',	'VISA_INVOICE',	'Visa Services Invoice',	'Per-passenger visa processing invoice with consular details and fees.',	'<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Visa Invoice Template</title>
<style>

  @import url(''https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'');
  
  @media print {
    body {
      background: #FFFFFF !important;
      color: #000000 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }

  * { box-sizing: border-box; }
  body {
    font-family: ''Plus Jakarta Sans'', sans-serif;
    color: #1E293B;
    background: #F8FAFC;
    margin: 0;
    padding: 20px;
    font-size: 11px;
    line-height: 1.5;
  }

  .document-container {
    max-width: 800px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  /* Header grid */
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #F1F5F9;
    padding-bottom: 20px;
    margin-bottom: 24px;
  }

  .brand-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .logos-block {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* Title & Reference */
  .doc-title-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .doc-title {
    font-family: ''Outfit'', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #0F172A;
    text-transform: uppercase;
    margin: 0;
  }

  .doc-meta {
    text-align: right;
  }

  .doc-meta p {
    margin: 2px 0;
    color: #475569;
  }

  .doc-meta strong {
    color: #0F172A;
  }

  /* Customer/Vendor Blocks */
  .info-grid {
    display: grid;
    grid-template-cols: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
    background: #F8FAFC;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #F1F5F9;
  }

  .info-box h3 {
    font-family: ''Outfit'', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    color: #0EA5E9;
    margin-top: 0;
    margin-bottom: 8px;
    letter-spacing: 1px;
    font-weight: 700;
  }

  .info-box p {
    margin: 3px 0;
    color: #334155;
  }

  /* Detail Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
  }

  table.data-table th {
    background: #0F172A;
    color: #FFFFFF;
    font-family: ''Outfit'', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    letter-spacing: 0.5px;
    padding: 8px 12px;
    text-align: left;
    border: 1px solid #0F172A;
  }

  table.data-table td {
    padding: 8px 12px;
    border: 1px solid #E2E8F0;
    vertical-align: top;
  }

  table.data-table tr:nth-child(even) {
    background: #F8FAFC;
  }

  .text-right { text-align: right !important; }
  .text-center { text-align: center !important; }

  /* Financial Breakdown Panel */
  .financial-panel {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 24px;
  }

  .financial-table {
    width: 300px;
    border-collapse: collapse;
  }

  .financial-table td {
    padding: 6px 12px;
    border-bottom: 1px solid #E2E8F0;
  }

  .financial-table tr.total-row td {
    font-size: 13px;
    font-weight: 700;
    color: #0F172A;
    border-bottom: 2px double #0F172A;
    background: #F8FAFC;
  }

  .financial-table tr.due-row td {
    font-size: 14px;
    font-weight: 900;
    color: #E11D48;
    background: #FFF1F2;
    border: 1px solid #FFE4E6;
  }

  /* Footer Details */
  .doc-footer {
    border-top: 2px dashed #E2E8F0;
    padding-top: 20px;
    margin-top: 30px;
    text-align: center;
    color: #64748B;
    font-size: 9px;
  }

  .doc-footer p {
    margin: 4px 0;
  }

  /* Section Title badge style */
  .section-badge {
    display: inline-block;
    padding: 2px 6px;
    background: #E0F2FE;
    color: #0369A1;
    font-weight: 700;
    border-radius: 4px;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  /* E-ticket / Voucher Specifics */
  .ticket-card {
    border: 1.5px solid #0F172A;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  /* Timeline component styles */
  .timeline-container {
    position: relative;
    padding-left: 28px;
    margin: 20px 0 20px 8px;
    border-left: 2px solid #E2E8F0;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 20px;
  }
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  .timeline-badge {
    position: absolute;
    left: -40px;
    top: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 2px solid #64748B;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    z-index: 10;
  }
  .timeline-badge.flight { border-color: #0284C7; color: #0284C7; }
  .timeline-badge.hotel { border-color: #10B981; color: #10B981; }
  .timeline-badge.transfer { border-color: #F59E0B; color: #F59E0B; }
  .timeline-badge.visa { border-color: #8B5CF6; color: #8B5CF6; }
  .timeline-badge.special { border-color: #EC4899; color: #EC4899; }
  
  .timeline-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px 16px;
    text-align: left;
  }
  .timeline-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    border-bottom: 1px dashed #E2E8F0;
    padding-bottom: 6px;
  }
  .timeline-title {
    font-family: ''Outfit'', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #0F172A;
  }
  .timeline-date {
    font-size: 9.5px;
    color: #64748B;
    font-weight: 600;
  }
  .timeline-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 16px;
    font-size: 10px;
  }
  .timeline-detail-item {
    color: #475569;
  }
  .timeline-detail-item strong {
    color: #0F172A;
  }
  .timeline-badge-status {
    font-size: 8px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 99px;
    text-transform: uppercase;
  }
  .timeline-badge-status.confirmed { background: #DCFCE7; color: #15803D; }
  .timeline-badge-status.pending { background: #FEF3C7; color: #D97706; }
  .timeline-badge-status.cancelled { background: #FEE2E2; color: #991B1B; }

  /* Terms Grid styling */
  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 24px;
    font-size: 8.5px;
    color: #64748B;
    text-align: left;
  }
  .terms-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px;
  }
  .terms-card h4 {
    margin: 0 0 6px 0;
    color: #0F172A;
    font-family: ''Outfit'', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .terms-card p {
    margin: 0;
    line-height: 1.4;
  }

.visa-header { background: linear-gradient(135deg, #4C1D95, #5B21B6); color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; }
.visa-body { border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; }
table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 14px; }
thead tr { background: #4C1D95; color: white; }
th { padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; }
tbody tr:nth-child(even) { background: #F8FAFC; }
.total-row td { font-weight: 800; background: #EDE9FE; color: #5B21B6; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      
    <img src="/Logo.svg" alt="Terrific Travel Logo" style="height: 60px; width: auto; max-width: 250px; display: block;" />
  
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
      </p>
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
      <div class="logos-block">
        
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#0054A6"/>
      <circle cx="32" cy="20" r="14" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>
      <path d="M15 12H21M18 12V28M15 28H21" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <text x="21" y="26" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="-0.5">IATA</text>
      <text x="18" y="34" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#FFFFFF" letter-spacing="1">MEMBER AGENT</text>
    </svg>
  
        
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#D97706"/>
      <circle cx="32" cy="20" r="15" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M22 17L32 12L42 17L32 28L22 17Z" fill="#FFFFFF" opacity="0.2"/>
      <text x="32" y="19" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="9" fill="#FFFFFF" text-anchor="middle">ATOL</text>
      <text x="32" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">PROTECTED</text>
      <text x="32" y="35" font-family="Arial, sans-serif" font-size="4" fill="#FFFFFF" text-anchor="middle" opacity="0.8">REG. NO 11492</text>
    </svg>
  
      </div>
      <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
        <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
        <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
      </svg>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Visa Services Invoice</h1>
      <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: Completed</span>
    </div>
    <div class="doc-meta">
      <p>Invoice No: <strong>{{INVOICE_NO}}</strong></p>
      <p>Issue Date: <strong>{{ISSUE_DATE}}</strong></p>
      <p>Booking Reference: <strong>{{BOOKING_REF}}</strong></p>
    </div>
  </div>

  <div class="visa-body" style="border:none; padding:0;">
    <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
      <div class="info-box">
        <h3>Applicant / Client Info</h3>
        {{LEAD_PASSENGER_BLOCK}}
      </div>
      <div class="info-box">
        <h3>Services Desk</h3>
        <p><strong>Terrific Travel Visas &amp; Consular Services</strong></p>
        <p>Consular Desk Support</p>
        <p>Total Visa Applications: <strong>{{TOTAL_VISAS}}</strong></p>
      </div>
      <div class="info-box">
        <h3>Consular Fulfillment Vendor</h3>
        <p><strong>Vendor Name:</strong> {{VENDOR_NAME}}</p>
        <p><strong>Phone:</strong> {{VENDOR_PHONE}}</p>
        <p><strong>Email:</strong> {{VENDOR_EMAIL}}</p>
      </div>
    </div>

    <h3 style="font-family: ''Outfit'', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Consular &amp; Processing Services Summary</h3>
    <table class="data-table" style="margin-bottom: 24px;">
      <thead>
        <tr>
          <th>Consular Visa Category</th>
          <th>Issue Date</th>
          <th class="text-right">Visa Fee</th>
        </tr>
      </thead>
      <tbody>
        {{VISAS_TABLE_ROWS}}
      </tbody>
    </table>

    <div class="financial-panel">
      <table class="financial-table">
        <tr class="total-row">
          <td><strong>Total Visa Charges:</strong></td>
          <td class="text-right"><strong>{{TOTAL_VISA_COST}}</strong></td>
        </tr>
      </table>
    </div>

    <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px;">
      <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Visa Consular Notice</p>
      <p style="margin: 0;">1. Travelers must verify that all details on their visa match their passport data precisely. Inform consular desk of errors immediately.</p>
      <p style="margin: 0;">2. Possession of a valid visa does not guarantee entry into sovereign territory. Final decision remains with border authorities.</p>
      <p style="margin: 0;">3. Visa fees are completely non-refundable once the application is registered with consulate departments.</p>
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · ATOL Protected · Reg No: 11492 · office@terrifictravel.co.uk
    </div>
  </div>
</div>
</body>
</html>',	NULL,	'2026-06-26 12:53:58.32',	'2026-06-26 12:53:58.32'),
('2a132672-0b21-4bbb-8ece-3f89002717ae',	'SPECIAL_SERVICES',	'Special Services Invoice',	'Invoice for additional/ancillary services like extra baggage, meals, and special requests.',	'<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Special Services Invoice Template</title>
<style>
${SHARED_CSS}
.special-header { background: linear-gradient(135deg, #7C2D12, #9A3412); color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; }
.special-body { border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; }
table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 14px; }
thead tr { background: #7C2D12; color: white; }
th { padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; }
tbody tr:nth-child(even) { background: #FFF7F0; }
.total-row td { font-weight: 800; background: #FEE2E2; color: #991B1B; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      
    <img src="/Logo.svg" alt="Terrific Travel Logo" style="height: 60px; width: auto; max-width: 250px; display: block;" />
  
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
      </p>
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
      <div class="logos-block">
        
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#0054A6"/>
      <circle cx="32" cy="20" r="14" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>
      <path d="M15 12H21M18 12V28M15 28H21" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <text x="21" y="26" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="-0.5">IATA</text>
      <text x="18" y="34" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#FFFFFF" letter-spacing="1">MEMBER AGENT</text>
    </svg>
  
        
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#D97706"/>
      <circle cx="32" cy="20" r="15" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M22 17L32 12L42 17L32 28L22 17Z" fill="#FFFFFF" opacity="0.2"/>
      <text x="32" y="19" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="9" fill="#FFFFFF" text-anchor="middle">ATOL</text>
      <text x="32" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">PROTECTED</text>
      <text x="32" y="35" font-family="Arial, sans-serif" font-size="4" fill="#FFFFFF" text-anchor="middle" opacity="0.8">REG. NO 11492</text>
    </svg>
  
      </div>
      <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
        <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
        <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
      </svg>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Special Service Invoice</h1>
      <span class="section-badge" style="background: #FCE7F3; color: #BE185D;">Status: Confirmed</span>
    </div>
    <div class="doc-meta">
      <p>Invoice No: <strong>{{INVOICE_NO}}</strong></p>
      <p>Date: <strong>{{TODAY}}</strong></p>
      <p>Booking Reference: <strong>{{BOOKING_REF}}</strong></p>
    </div>
  </div>

  <div class="special-body" style="border:none; padding:0;">
    <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
      <div class="info-box">
        <h3>Lead Passenger / Guest</h3>
        {{LEAD_PASSENGER_BLOCK}}
      </div>
      <div class="info-box">
        <h3>Fulfillment Details</h3>
        <p>Special Service Type: Additional / Custom Element</p>
        <p>Total Items: <strong>{{TOTAL_SERVICES}}</strong></p>
      </div>
      <div class="info-box">
        <h3>Fulfillment Vendor Details</h3>
        <p><strong>Vendor Name:</strong> {{VENDOR_NAME}}</p>
        <p><strong>Phone:</strong> {{VENDOR_PHONE}}</p>
        <p><strong>Email:</strong> {{VENDOR_EMAIL}}</p>
      </div>
    </div>

    <h3 style="font-family: ''Outfit'', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Special Request &amp; Service Details</h3>
    <table class="data-table" style="margin-bottom: 24px;">
      <thead>
        <tr>
          <th>Service Name</th>
          <th>Fulfillment Vendor</th>
          <th>Service Description</th>
          <th class="text-right">Price</th>
        </tr>
      </thead>
      <tbody>
        {{SERVICES_TABLE_ROWS}}
      </tbody>
    </table>

    <div class="financial-panel">
      <table class="financial-table">
        <tr class="total-row">
          <td><strong>Total Special Service Price:</strong></td>
          <td class="text-right"><strong>{{TOTAL_COST}}</strong></td>
        </tr>
      </table>
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · office@terrifictravel.co.uk<br>
      All special service requests are subject to vendor availability and confirmation.
    </div>
  </div>
</div>
</body>
</html>',	NULL,	'2026-06-26 12:53:58.347',	'2026-06-26 12:53:58.347'),
('62239c0a-129e-4bd8-969e-7744bac15bac',	'BOOKING_INVOICE',	'Booking Invoice',	'Full client-facing booking invoice with passenger list, itemized services and financial totals.',	'<!DOCTYPE html> 
<html lang="en"> 
<head> 
<meta charset="UTF-8" /> 
<title>Booking Invoice Template</title> 
<style> 
@import url(''https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap''); 

@media print { 
    body { 
        background: #FFFFFF !important; 
        color: #000000 !important; 
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important; 
    } 
    .no-print { 
        display: none !important; 
    } 
    .page-break { 
        page-break-before: always; 
    } 
} 

* { 
    box-sizing: border-box; 
} 

body { 
    font-family: ''Plus Jakarta Sans'', sans-serif; 
    color: #1E293B; 
    background: #F8FAFC; 
    margin: 0; 
    padding: 20px; 
    font-size: 11px; 
    line-height: 1.5; 
} 

.document-container { 
    max-width: 800px; 
    margin: 0 auto; 
    background: #FFFFFF; 
    border: 1px solid #E2E8F0; 
    border-radius: 12px; 
    padding: 30px; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
} 

/* Header grid */ 
.doc-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    border-bottom: 2px solid #F1F5F9; 
    padding-bottom: 20px; 
    margin-bottom: 24px; 
} 

.brand-block { 
    display: flex; 
    flex-direction: column; 
    gap: 4px; 
} 

.logos-block { 
    display: flex; 
    gap: 8px; 
    align-items: center; 
} 

/* Title & Reference */ 
.doc-title-section { 
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 20px; 
} 

.doc-title { 
    font-family: ''Outfit'', sans-serif; 
    font-size: 20px; 
    font-weight: 900; 
    color: #0F172A; 
    text-transform: uppercase; 
    margin: 0; 
} 

.doc-meta { 
    text-align: right; 
} 

.doc-meta p { 
    margin: 2px 0; 
    color: #475569; 
} 

.doc-meta strong { 
    color: #0F172A; 
} 

/* Customer/Vendor Blocks */ 
.info-grid { 
    display: grid; 
    grid-template-cols: 1fr 1fr; 
    gap: 20px; 
    margin-bottom: 24px; 
    background: #F8FAFC; 
    padding: 16px; 
    border-radius: 8px; 
    border: 1px solid #F1F5F9; 
} 

.info-box h3 { 
    font-family: ''Outfit'', sans-serif; 
    font-size: 11px; 
    text-transform: uppercase; 
    color: #0EA5E9; 
    margin-top: 0; 
    margin-bottom: 8px; 
    letter-spacing: 1px; 
    font-weight: 700; 
} 

.info-box p { 
    margin: 3px 0; 
    color: #334155; 
} 

/* Detail Tables */ 
table.data-table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-bottom: 24px; 
} 

table.data-table th { 
    background: #0F172A; 
    color: #FFFFFF; 
    font-family: ''Outfit'', sans-serif; 
    font-weight: 700; 
    text-transform: uppercase; 
    font-size: 9px; 
    letter-spacing: 0.5px; 
    padding: 8px 12px; 
    text-align: left; 
    border: 1px solid #0F172A; 
} 

table.data-table td { 
    padding: 8px 12px; 
    border: 1px solid #E2E8F0; 
    vertical-align: top; 
} 

table.data-table tr:nth-child(even) { 
    background: #F8FAFC; 
} 

.text-right { 
    text-align: right !important; 
} 

.text-center { 
    text-align: center !important; 
} 

/* Financial Breakdown Panel */ 
.financial-panel { 
    display: flex; 
    justify-content: flex-end; 
    margin-top: 20px; 
    margin-bottom: 24px; 
} 

.financial-table { 
    width: 300px; 
    border-collapse: collapse; 
} 

.financial-table td { 
    padding: 6px 12px; 
    border-bottom: 1px solid #E2E8F0; 
} 

.financial-table tr.total-row td { 
    font-size: 13px; 
    font-weight: 700; 
    color: #0F172A; 
    border-bottom: 2px double #0F172A; 
    background: #F8FAFC; 
} 

.financial-table tr.due-row td { 
    font-size: 14px; 
    font-weight: 900; 
    color: #E11D48; 
    background: #FFF1F2; 
    border: 1px solid #FFE4E6; 
} 

/* Signature Section */
.signature-section {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    margin-bottom: 20px;
    padding: 0 20px;
}

.signature-box {
    width: 40%;
    text-align: left;
}

.signature-line {
    border-bottom: 1px solid #0F172A;
    height: 40px;
    margin-bottom: 8px;
}

.signature-text {
    font-family: ''Outfit'', sans-serif;
    font-weight: 700;
    font-size: 10px;
    color: #0F172A;
    text-transform: uppercase;
    margin: 0;
}

/* Footer Details */ 
.doc-footer { 
    border-top: 2px dashed #E2E8F0; 
    padding-top: 20px; 
    margin-top: 10px; 
    text-align: center; 
    color: #64748B; 
    font-size: 9px; 
} 

.doc-footer p { 
    margin: 4px 0; 
} 

/* Section Title badge style */ 
.section-badge { 
    display: inline-block; 
    padding: 2px 6px; 
    background: #E0F2FE; 
    color: #0369A1; 
    font-weight: 700; 
    border-radius: 4px; 
    font-size: 8px; 
    text-transform: uppercase; 
    letter-spacing: 0.5px; 
    margin-bottom: 10px; 
} 

/* E-ticket / Voucher Specifics */ 
.ticket-card { 
    border: 1.5px solid #0F172A; 
    border-radius: 8px; 
    overflow: hidden; 
    margin-bottom: 20px; 
} 

/* Timeline component styles */ 
.timeline-container { 
    position: relative; 
    padding-left: 28px; 
    margin: 20px 0 20px 8px; 
    border-left: 2px solid #E2E8F0; 
} 

.timeline-item { 
    position: relative; 
    margin-bottom: 20px; 
} 

.timeline-item:last-child { 
    margin-bottom: 0; 
} 

.timeline-badge { 
    position: absolute; 
    left: -40px; 
    top: 2px; 
    width: 22px; 
    height: 22px; 
    border-radius: 50%; 
    background: #FFFFFF; 
    border: 2px solid #64748B; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 10px; 
    z-index: 10; 
} 

.timeline-badge.flight { 
    border-color: #0284C7; 
    color: #0284C7; 
} 

.timeline-badge.hotel { 
    border-color: #10B981; 
    color: #10B981; 
} 

.timeline-badge.transfer { 
    border-color: #F59E0B; 
    color: #F59E0B; 
} 

.timeline-badge.visa { 
    border-color: #8B5CF6; 
    color: #8B5CF6; 
} 

.timeline-badge.special { 
    border-color: #EC4899; 
    color: #EC4899; 
} 

.timeline-card { 
    background: #F8FAFC; 
    border: 1px solid #E2E8F0; 
    border-radius: 8px; 
    padding: 12px 16px; 
    text-align: left; 
} 

.timeline-card-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 8px; 
    border-bottom: 1px dashed #E2E8F0; 
    padding-bottom: 6px; 
} 

.timeline-title { 
    font-family: ''Outfit'', sans-serif; 
    font-size: 12px; 
    font-weight: 700; 
    color: #0F172A; 
} 

.timeline-date { 
    font-size: 9.5px; 
    color: #64748B; 
    font-weight: 600; 
} 

.timeline-grid { 
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    gap: 8px 16px; 
    font-size: 10px; 
} 

.timeline-detail-item { 
    color: #475569; 
} 

.timeline-detail-item strong { 
    color: #0F172A; 
} 

.timeline-badge-status { 
    font-size: 8px; 
    font-weight: 800; 
    padding: 1px 6px; 
    border-radius: 99px; 
    text-transform: uppercase; 
} 

.timeline-badge-status.confirmed { 
    background: #DCFCE7; 
    color: #15803D; 
} 

.timeline-badge-status.pending { 
    background: #FEF3C7; 
    color: #D97706; 
} 

.timeline-badge-status.cancelled { 
    background: #FEE2E2; 
    color: #991B1B; 
} 

/* Terms Grid styling */ 
.terms-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 16px; 
    margin-top: 24px; 
    font-size: 8.5px; 
    color: #64748B; 
    text-align: left; 
} 

.terms-card { 
    background: #F8FAFC; 
    border: 1px solid #E2E8F0; 
    border-radius: 8px; 
    padding: 12px; 
} 

.terms-card h4 { 
    margin: 0 0 6px 0; 
    color: #0F172A; 
    font-family: ''Outfit'', sans-serif; 
    font-weight: 700; 
    text-transform: uppercase; 
    font-size: 9px; 
    display: flex; 
    align-items: center; 
    gap: 4px; 
} 

.terms-card p { 
    margin: 0; 
    line-height: 1.4; 
} 

/* ── Extra Template-Specific Styles ── */ 
.doc-title { 
    font-size: 22px; 
    font-weight: 900; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    margin: 0 0 4px; 
} 

.doc-meta p { 
    margin: 2px 0; 
    font-size: 10px; 
    text-align: right; 
} 

.doc-meta strong { 
    font-weight: 700; 
} 

.info-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 16px; 
    margin-bottom: 20px; 
} 

.info-box { 
    background: #F8FAFC; 
    border: 1px solid #E2E8F0; 
    border-radius: 8px; 
    padding: 14px; 
} 

.info-box h3 { 
    font-size: 10px; 
    font-weight: 800; 
    color: #0EA5E9; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    margin: 0 0 8px; 
} 

.info-box p { 
    margin: 3px 0; 
    font-size: 10.5px; 
} 

.section-badge { 
    display: inline-block; 
    font-size: 9px; 
    font-weight: 800; 
    padding: 3px 10px; 
    border-radius: 99px; 
    text-transform: uppercase; 
    letter-spacing: 0.5px; 
} 

.doc-title-section { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 20px; 
} 

table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: 10px; 
} 

thead tr { 
    background: #1E293B; 
    color: #fff; 
} 

th { 
    padding: 8px 10px; 
    text-align: left; 
    font-size: 9px; 
    text-transform: uppercase; 
    letter-spacing: 0.5px; 
    font-weight: 700; 
} 

td { 
    padding: 8px 10px; 
    border-bottom: 1px solid #F1F5F9; 
} 

tbody tr:nth-child(even) { 
    background: #F8FAFC; 
} 

.total-row td { 
    font-weight: 800; 
    background: #EFF6FF; 
} 

.grand-total td { 
    font-weight: 900; 
    font-size: 12px; 
    background: #DBEAFE; 
    color: #1D4ED8; 
} 

.footer-bar { 
    margin-top: 28px; 
    padding-top: 14px; 
    border-top: 2px solid #F1F5F9; 
    font-size: 9px; 
    color: #94A3B8; 
    text-align: center; 
} 

.logos-block { 
    display: flex; 
    gap: 8px; 
    align-items: flex-start; 
} 
</style> 
</head> 
<body> 
<div class="document-container"> 
    <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;"> 
        <div class="brand-block"> 
            <img src="/Logo.svg" alt="Terrific Travel Logo" style="height: 60px; width: auto; max-width: 250px; display: block;" /> 
            <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;"> 
                <strong>Terrific Travel Ltd</strong><br> 
                Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br> 
                Phone: 0121 529 1630 | Emergency: +44 7888 461474<br> 
                Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br> 
                IATA: 91263712
            </p> 
        </div> 
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;"> 
            <div class="logos-block"> 
                <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                    <rect width="65" height="40" rx="4" fill="#0054A6"/> 
                    <circle cx="32" cy="20" r="14" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/> 
                    <path d="M15 12H21M18 12V28M15 28H21" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/> 
                    <text x="21" y="26" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="-0.5">IATA</text> 
                    <text x="18" y="34" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#FFFFFF" letter-spacing="1">MEMBER AGENT</text> 
                </svg> 
                <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg"> 
                    <rect width="65" height="40" rx="4" fill="#D97706"/> 
                    <circle cx="32" cy="20" r="15" stroke="#FFFFFF" stroke-width="1.5"/> 
                    <path d="M22 17L32 12L42 17L32 28L22 17Z" fill="#FFFFFF" opacity="0.2"/> 
                    <text x="32" y="19" font-family="''Arial Black'', sans-serif" font-weight="900" font-size="9" fill="#FFFFFF" text-anchor="middle">ATOL</text> 
                    <text x="32" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">PROTECTED</text> 
                </svg> 
            </div> 
        </div> 
    </div> 

    <div class="doc-title-section"> 
        <div> 
            <h1 class="doc-title">Booking Invoice</h1> 
            <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: {{PAYMENT_STATUS}}</span> 
        </div> 
        <div class="doc-meta"> 
            <p>Invoice No: <strong>{{INVOICE_NO}}</strong></p> 
            <p>Date: <strong>{{TODAY}}</strong></p> 
            <p>Booking Ref: <strong>{{BOOKING_REF}}</strong></p> 
            <p>Departure Date: <strong>{{DEPARTURE_DATE}}</strong></p> 
        </div> 
    </div> 

    <div class="info-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;"> 
        <div class="info-box"> 
            <h3>Lead Passenger / Client</h3> 
            {{LEAD_PASSENGER_BLOCK}} 
        </div> 
        <div class="info-box"> 
            <h3>Agent / Account Executive</h3> 
            {{AGENT_BLOCK}} 
        </div> 
    </div> 

    <h3 style="font-family: ''Outfit'', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Booking Passenger List</h3> 
    <table class="data-table" style="margin-bottom: 24px;"> 
        <thead> 
            <tr> 
                <th>Passenger Name</th> 
                <th>Type/Age</th> 
                <th>Nationality</th> 
            </tr> 
        </thead> 
        <tbody> 
            {{PASSENGERS_TABLE_ROWS}} 
        </tbody> 
    </table> 

    <h3 style="font-family: ''Outfit'', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 16px;">Dynamic Trip Itinerary &amp; Timeline</h3> 
    {{SERVICES_TIMELINE}} 

    <div class="financial-panel"> 
        <table class="financial-table"> 
            <tr><td>Total Invoice Amount:</td><td class="text-right"><strong>{{TOTAL_PRICE}}</strong></td></tr> 
            <tr><td>Total Amount Received:</td><td class="text-right" style="color: #16A34A; font-weight: bold;">{{PAID_AMOUNT}}</td></tr> 
            <tr class="due-row"><td><strong>Remaining Balance Due:</strong></td><td class="text-right"><strong>{{BALANCE_DUE}}</strong></td></tr> 
        </table> 
    </div> 

    <div class="terms-grid"> 
        <div class="terms-card"> 
            <h4>💼 General Booking Terms</h4> 
            <p>All bookings are subject to availability at the time of reservation. The client must ensure that all passenger names match their passport details exactly. Terrific Travel acts as an agent for respective service providers.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>💳 Payment Terms</h4> 
            <p>Deposits must be paid immediately to secure reservations. Final balances are due in full no later than 7 days prior to departure. Failure to complete payment may result in automated release of GDS bookings.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>⚠️ Cancellation Policy</h4> 
            <p>Cancellations must be requested in writing. All deposits are non-refundable. Additional airline, hotel, or GDS cancellation charges apply dynamically depending on supplier terms and time remaining before travel.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>✈️ Flight Conditions</h4> 
            <p>Flight times and schedules are subject to change by airlines. Baggage allowances are subject to carrier rules. Passengers should check in online 24 hours prior to departure and arrive at terminals 3 hours early.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>🏨 Hotel Conditions</h4> 
            <p>Hotel ratings are based on local standards. Check-in/check-out times must be respected. Special requests (bed type, high floors, views) are subject to availability and cannot be guaranteed by Terrific Travel.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>🛂 Visa Conditions</h4> 
            <p>It is the sole responsibility of the customer to obtain valid visa clearances. Visa approval remains at the absolute discretion of border authorities and national consulates. Visa fees are strictly non-refundable.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>🚗 Transportation Conditions</h4> 
            <p>Transfers are scheduled according to booking details. Drivers will wait up to 60 minutes after flight arrival. Customers must contact the emergency helpline immediately if they cannot locate their driver.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>🕋 Hajj &amp; Umrah Conditions</h4> 
            <p>Pilgrimage packages are subject to Saudi Ministry of Hajj &amp; Umrah regulations. E-visas and transportation booking are fully subject to local rules. Accommodation and transportation upgrades are subject to availability.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>ℹ️ Important Travel Information</h4> 
            <p>Flight bookings are protected under the UK Civil Aviation Authority ATOL scheme and fully backed by our IATA credentials. Travel insurance is highly recommended for all overseas bookings.</p> 
        </div> 
        <div class="terms-card"> 
            <h4>⚖️ Disclaimer</h4> 
            <p>Terrific Travel acts as an intermediary agent and shall not be held liable for personal injury, property loss, delays, cancellations, or defaults caused by airlines, hotels, or other service providers.</p> 
        </div> 
    </div> 

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-text">Authorized Signature</p>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <p class="signature-text">Customer Signature</p>
        </div>
    </div>

    <div class="doc-footer"> 
        <p>Terrific Travel Ltd | Registered in England &amp; Wales</p> 
        <p>Thank you for choosing Terrific Travel. We wish you an amazing journey!</p> 
    </div> 
</div> 
</body> 
</html>',	'Hasnain Sanwal (admin@terrifictravel.co.uk)',	'2026-06-26 12:53:58.218',	'2026-07-01 09:58:11.235');

DROP TABLE IF EXISTS "FileUpload";
CREATE TABLE "public"."FileUpload" (
    "id" text NOT NULL,
    "filename" text NOT NULL,
    "originalname" text NOT NULL,
    "size" integer NOT NULL,
    "mimetype" text NOT NULL,
    "bucket" text NOT NULL,
    "key" text NOT NULL,
    "userId" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "FileUpload_key_key" ON public."FileUpload" USING btree (key);

INSERT INTO "FileUpload" ("id", "filename", "originalname", "size", "mimetype", "bucket", "key", "userId", "createdAt") VALUES
('f0a16f1d-d358-40c0-82ec-15287f1cff7b',	'WhatsApp Image 2026-06-19 at 14.43.57.jpeg',	'WhatsApp Image 2026-06-19 at 14.43.57.jpeg',	47159,	'image/jpeg',	'users',	'1782236951252-WhatsApp Image 2026-06-19 at 14.43.57.jpeg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-23 17:49:11.286'),
('acf4232d-a2b6-40a9-aa20-bbdc4529ceab',	'WhatsApp Image 2026-06-19 at 14.43.57.jpeg',	'WhatsApp Image 2026-06-19 at 14.43.57.jpeg',	47159,	'image/jpeg',	'users',	'1782236966101-WhatsApp Image 2026-06-19 at 14.43.57.jpeg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-23 17:49:26.117'),
('19fd04f8-1274-410f-a02c-2862b2305033',	'WhatsApp Image 2026-06-26 at 16.46.24.jpeg',	'WhatsApp Image 2026-06-26 at 16.46.24.jpeg',	127925,	'image/jpeg',	'users',	'1782489585560-WhatsApp Image 2026-06-26 at 16.46.24.jpeg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 15:59:45.591'),
('8ab9f26f-c379-4fb4-9868-40ed7a0ff4ce',	'payment.png',	'payment.png',	89485,	'image/png',	'users',	'1782514062050-payment.png',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-06-26 22:47:42.174'),
('c27bce8c-cc94-44f3-bc14-fdefd0bc0d11',	'Recipt.jpeg',	'Recipt.jpeg',	101864,	'image/jpeg',	'users',	'1782837838863-Recipt.jpeg',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-06-30 16:43:58.941'),
('6ac822d6-53be-479a-a44c-42e71fb00db1',	'WhatsApp Image 2026-06-02 at 19.00.03.jpeg',	'WhatsApp Image 2026-06-02 at 19.00.03.jpeg',	47297,	'image/jpeg',	'users',	'1782902326576-WhatsApp Image 2026-06-02 at 19.00.03.jpeg',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-01 10:38:46.625'),
('932bf527-f83f-47e1-9b73-9c618500a980',	'aftabbbb.png',	'aftabbbb.png',	5511,	'image/png',	'users',	'1782910708254-aftabbbb.png',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 12:58:28.278'),
('97b53581-fde8-4bca-bcad-4adb056bfe28',	'aftabbshjsh.png',	'aftabbshjsh.png',	8695,	'image/png',	'users',	'1782910767024-aftabbshjsh.png',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 12:59:27.046'),
('d851ed4b-d881-4612-8a12-a770a9c08c7c',	'WhatsApp Image 2026-06-29 at 19.23.34.jpeg',	'WhatsApp Image 2026-06-29 at 19.23.34.jpeg',	245343,	'image/jpeg',	'users',	'1782913232700-WhatsApp Image 2026-06-29 at 19.23.34.jpeg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 13:40:32.743'),
('7ea0a1c7-58f1-46ee-a22b-dac3578de004',	'payment 2.jpeg',	'payment 2.jpeg',	88089,	'image/jpeg',	'users',	'1782936706907-payment 2.jpeg',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 20:11:46.951'),
('f21d33e4-c3f7-40fd-a1cd-c4164e8118cb',	'payment 1 .jpeg',	'payment 1 .jpeg',	89478,	'image/jpeg',	'users',	'1782936727318-payment 1 .jpeg',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 20:12:07.341'),
('b6cd7a04-4133-419e-bf88-1baddd7c3b03',	'WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	76133,	'image/jpeg',	'users',	'1782992125537-WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 11:35:25.572'),
('210030d6-2092-40e8-bd64-73c3d1739fcc',	'WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	76133,	'image/jpeg',	'users',	'1782993040897-WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 11:50:40.924'),
('9a322fa4-e6f5-42bd-9834-5a35e5d0aeb6',	'WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	76133,	'image/jpeg',	'users',	'1782993092146-WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 11:51:32.17'),
('5d93be13-314a-4fe9-aab3-8d138e5da50f',	'saif paymetn.png',	'saif paymetn.png',	40171,	'image/png',	'users',	'1783006068425-saif paymetn.png',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 15:27:48.47'),
('d534d5b0-481e-4852-9b04-119a0a655297',	'Alishbah booking.png',	'Alishbah booking.png',	39879,	'image/png',	'users',	'1783013726508-Alishbah booking.png',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 17:35:26.565'),
('8dc4a137-4955-457d-8b22-2848903550c6',	'Maham;;s receipt.png',	'Maham;;s receipt.png',	45203,	'image/png',	'users',	'1783017344768-Maham;;s receipt.png',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 18:35:44.796'),
('578dddda-b6a9-435e-a111-f0ccb8250740',	'WhatsApp Image 2026-07-03 at 13.04.05.jpeg',	'WhatsApp Image 2026-07-03 at 13.04.05.jpeg',	47300,	'image/jpeg',	'users',	'1783085506354-WhatsApp Image 2026-07-03 at 13.04.05.jpeg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:31:46.39');

DROP TABLE IF EXISTS "Flight";
CREATE TABLE "public"."Flight" (
    "id" text NOT NULL,
    "flightNumber" text NOT NULL,
    "airlineId" text NOT NULL,
    "departureAirportId" text NOT NULL,
    "arrivalAirportId" text NOT NULL,
    "departureTime" timestamp(3) NOT NULL,
    "arrivalTime" timestamp(3) NOT NULL,
    "price" double precision NOT NULL,
    "availableSeats" integer NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Flight_flightNumber_key" ON public."Flight" USING btree ("flightNumber");

INSERT INTO "Flight" ("id", "flightNumber", "airlineId", "departureAirportId", "arrivalAirportId", "departureTime", "arrivalTime", "price", "availableSeats", "createdAt", "updatedAt") VALUES
('f188b9dc-9027-4a71-92b4-d7eac2916cf4',	'DL102',	'7baae0de-0d1b-4884-8f56-3bcb8c659627',	'29d9d0d3-4332-4b3f-8c67-e2e873290b74',	'3bcc2813-65d7-480d-acad-2fcf48036028',	'2026-06-20 17:09:20.881',	'2026-06-20 23:09:20.881',	350,	120,	'2026-06-19 17:09:20.884',	'2026-06-19 17:09:20.884'),
('a80629ea-9337-40e8-b7af-66f389d2b6d9',	'LH430',	'1a6d7e47-290d-44c2-89e8-ba49a3bb0b25',	'ca18e4a8-738b-46f1-9ea2-94a56cb85b49',	'29d9d0d3-4332-4b3f-8c67-e2e873290b74',	'2026-06-21 17:09:20.898',	'2026-06-22 01:09:20.898',	680,	85,	'2026-06-19 17:09:20.899',	'2026-06-19 17:09:20.899');

DROP TABLE IF EXISTS "FlightReservation";
CREATE TABLE "public"."FlightReservation" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "vendorId" text NOT NULL,
    "pnr" text NOT NULL,
    "issueDate" timestamp(3),
    "currency" text DEFAULT 'GBP' NOT NULL,
    "price" double precision DEFAULT '0.0' NOT NULL,
    "notes" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "FlightReservation_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE INDEX "FlightReservation_bookingId_idx" ON public."FlightReservation" USING btree ("bookingId");


DROP TABLE IF EXISTS "FlightService";
CREATE TABLE "public"."FlightService" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "flightReservationId" text,
    "date" timestamp(3) NOT NULL,
    "vendorId" text NOT NULL,
    "flightNo" text NOT NULL,
    "pnr" text DEFAULT '' NOT NULL,
    "departedFrom" text NOT NULL,
    "arrivedAt" text NOT NULL,
    "departTime" text NOT NULL,
    "arrivalTime" text NOT NULL,
    "price" double precision NOT NULL,
    "currency" text NOT NULL,
    "issueDate" timestamp(3),
    "refundAmount" double precision DEFAULT '0.0' NOT NULL,
    "fineAmount" double precision DEFAULT '0.0' NOT NULL,
    "baggage" text,
    "carryOnBaggage" text,
    "checkedBaggage" text,
    "flightClass" text,
    "notes" text,
    CONSTRAINT "FlightService_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "FlightService" ("id", "bookingId", "flightReservationId", "date", "vendorId", "flightNo", "pnr", "departedFrom", "arrivedAt", "departTime", "arrivalTime", "price", "currency", "issueDate", "refundAmount", "fineAmount", "baggage", "carryOnBaggage", "checkedBaggage", "flightClass", "notes") VALUES
('56b448c8-e905-426d-b212-f3b69106bf37',	'2cc7284b-affa-4eec-9a56-af93962c223b',	NULL,	'2026-09-29 00:00:00',	'bfa00e59-3d57-48bd-89d6-9d3a4625a650',	'EK 612',	'',	'Dubai International Airport Al (DXB)',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'03:20',	'07:30',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-09-29"}'),
('55be6046-b089-4037-8722-e3cc23fe878a',	'32ba5865-c826-4c7c-b4c7-33537b639330',	NULL,	'2026-08-13 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'SV 110',	'',	'London Heathrow Airport (LHR)',	'King Khalid International Airport (RUH)',	'10:00',	'18:40',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":""}'),
('d184434b-253c-4399-9939-5a3f534e8575',	'32ba5865-c826-4c7c-b4c7-33537b639330',	NULL,	'2026-08-14 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'SV 724',	'',	'King Khalid International Airport (RUH)',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'02:00',	'08:05',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":""}'),
('d32bb997-91f9-466a-ae20-3e74585bb64b',	'32ba5865-c826-4c7c-b4c7-33537b639330',	NULL,	'2026-09-14 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'SV 723',	'',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'King Abdulaziz International Airport (JED)',	'10:35',	'13:40',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":""}'),
('132c4467-eb30-457b-8d15-31414e509bd3',	'32ba5865-c826-4c7c-b4c7-33537b639330',	NULL,	'2026-09-14 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'SV 117',	'',	'King Abdulaziz International Airport (JED)',	'London Heathrow Airport (LHR)',	'16:00',	'20:30',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":""}'),
('57e16c6d-20f2-4d61-96fb-b510c4806abb',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	NULL,	'2026-10-09 00:00:00',	'5',	'GF 7',	'',	'Bahrain International (BAH)',	'London Heathrow Airport (LHR)',	'02:00',	'06:55',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-09"}'),
('065b22c6-bbc8-4f83-8037-8c7e3c0d5587',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	NULL,	'2026-10-20 00:00:00',	'5',	'GF 2',	'',	'London Heathrow Airport (LHR)',	'Bahrain International (BAH)',	'10:00',	'18:40',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-20"}'),
('4f691418-17f3-4258-afc1-d678f69bea5b',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	NULL,	'2026-10-21 00:00:00',	'5',	'GF 181',	'',	'Bahrain International (BAH)',	'King Abdulaziz International Airport (JED)',	'01:30',	'03:55',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-21"}'),
('00cfd29f-7fb3-458c-bc2a-b35f5c482675',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	NULL,	'2026-10-02 00:00:00',	'5',	'GF 183',	'',	'Bahrain International (BAH)',	'King Abdulaziz International Airport (JED)',	'13:25',	'15:40',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-02"}'),
('8f27de74-705f-49cb-86c3-f2a4593d6375',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	NULL,	'2026-10-01 00:00:00',	'5',	'GF 6',	'H9MYWB',	'London Heathrow Airport (LHR)',	'Bahrain International (BAH)',	'22:05',	'06:45',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-02"}'),
('ad935973-54ef-4fc8-b905-254bf2cc849c',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	NULL,	'2026-10-08 00:00:00',	'5',	'GF 178',	'',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'Bahrain International (BAH)',	'19:10',	'21:15',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-08"}'),
('3f685275-daef-4212-8caf-927239dd80d0',	'2cc7284b-affa-4eec-9a56-af93962c223b',	NULL,	'2026-09-20 00:00:00',	'bfa00e59-3d57-48bd-89d6-9d3a4625a650',	'EK 615',	'',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'Dubai International Airport Al (DXB)',	'03:05',	'05:25',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-09-20"}'),
('67bb6622-8643-450d-932b-a5b656eb11c4',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	NULL,	'2026-08-28 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'QR24',	'',	'Manchester Airport Ringway (MAN)',	'Hamad International Airport (DOH)',	'21:15',	'06:00',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-28"}'),
('1843bcd1-f68c-43f7-8707-9da410aa6408',	'2cc7284b-affa-4eec-9a56-af93962c223b',	NULL,	'2026-09-28 00:00:00',	'bfa00e59-3d57-48bd-89d6-9d3a4625a650',	'EK 804',	'',	'King Abdulaziz International Airport (JED)',	'Dubai International Airport Al (DXB)',	'20:10',	'00:10',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-09-29"}'),
('aa0a26d4-aff0-47db-a9f9-45f92a2e857d',	'2cc7284b-affa-4eec-9a56-af93962c223b',	NULL,	'2026-09-20 00:00:00',	'5',	'EK 805',	'',	'Dubai International Airport Al (DXB)',	'King Abdulaziz International Airport (JED)',	'06:55',	'08:45',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-09-20"}'),
('5b51a7fc-1fc4-4555-94d2-26a7a2dd0b3c',	'5e668417-02ad-40c0-8c73-723257ee4349',	NULL,	'2026-07-05 00:00:00',	'19',	'SV 124',	'896HBK',	'Manchester Airport Ringway (MAN)',	'King Abdulaziz International Airport (JED)',	'14:45',	'23:15',	467.13,	'GBP',	'2026-06-26 00:00:00',	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"TERMINAL 2","arrTerminal":"TERMINAL 1","actualNotes":"","arrivalDate":"2026-07-05"}'),
('c5d70c0f-53b6-4cb7-bf4a-7f42e6ef593a',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	NULL,	'2026-08-28 00:00:00',	'1',	'QR1178',	'',	'Hamad International Airport (DOH)',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'07:40',	'09:55',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-28"}'),
('3e60973d-e2a0-4a4b-8f72-093329e600ba',	'5e668417-02ad-40c0-8c73-723257ee4349',	NULL,	'2026-07-10 00:00:00',	'19',	'SV 726',	'896HBK',	'King Abdulaziz International Airport (JED)',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'18:10',	'01:10',	0,	'GBP',	'2026-06-26 00:00:00',	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"TERMINAL 1","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-11"}'),
('4c60c172-c03b-49b0-aa05-85cdb942b190',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	NULL,	'2026-09-19 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'BG207',	'',	'Sylhet Airport',	'Manchester Airport Ringway (MAN)',	'12:50',	'19:15',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-09-19"}'),
('41607414-8309-45a0-94b9-ac552c86752f',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	NULL,	'2026-09-01 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'BG236',	'',	'King Abdulaziz International Airport (JED)',	'Osmani International Airport, Sylhet',	'01:00',	'11:00',	0,	'GBP',	NULL,	0,	0,	'50 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-09-01"}'),
('a8fb2179-7ff2-4a33-b361-841825b1cc91',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	NULL,	'2026-06-30 00:00:00',	'5',	'QR 36',	'H9MQ2T',	'Birmingham Airport (BHX)',	'Hamad International Airport (DOH)',	'08:10',	'16:55',	886.78,	'GBP',	'2026-06-29 00:00:00',	0,	0,	'46 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-06-30"}'),
('7f244565-3d77-42bd-8e99-ac1442b698f7',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	NULL,	'2026-06-30 00:00:00',	'5',	'QR 632',	'',	'Hamad International Airport (DOH)',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'20:20',	'01:50',	0,	'GBP',	NULL,	0,	0,	'46 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-01"}'),
('64c90710-1680-493b-9856-9bd400718334',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	NULL,	'2026-07-20 00:00:00',	'5',	'QR 633',	'',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'Hamad International Airport (DOH)',	'03:30',	'05:00',	0,	'GBP',	NULL,	0,	0,	'46 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-20"}'),
('59faebfc-3d0f-4767-91f4-70123cade8d4',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	NULL,	'2026-07-20 00:00:00',	'5',	'QR 33',	'',	'Hamad International Airport (DOH)',	'Birmingham Airport (BHX)',	'08:25',	'13:40',	0,	'GBP',	NULL,	0,	0,	'46 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-20"}'),
('ea23a8e7-25b7-4c4c-908d-1c472cf6289f',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	NULL,	'2026-12-26 00:00:00',	'1',	'RJ 116',	'H6LLWV',	'Manchester Airport Ringway (MAN)',	'Queen Alia International Airport Amman (AMM)',	'14:40',	'23:10',	0,	'GBP',	'2026-06-24 00:00:00',	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-12-26"}'),
('e50cec6c-c146-4db1-9c42-5040cc4391a9',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	NULL,	'2026-12-27 00:00:00',	'1',	'RJ 704',	'',	'Queen Alia International Airport Amman (AMM)',	'King Abdulaziz International Airport (JED)',	'01:35',	'03:45',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-12-27"}'),
('2449c6b7-deac-4de0-90a8-e11ef298d330',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	NULL,	'2026-01-04 00:00:00',	'1',	'RJ 723',	'',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'Queen Alia International Airport Amman (AMM)',	'07:00',	'08:50',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2027-01-04"}'),
('4a77af97-2680-4962-8dcd-2d711c3e475e',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	NULL,	'2026-01-04 00:00:00',	'1',	'RJ 115',	'',	'Queen Alia International Airport Amman (AMM)',	'Manchester Airport Ringway (MAN)',	'10:30',	'13:30',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2027-01-04"}'),
('b716cac9-700e-4baf-8659-e4d9747e615d',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	NULL,	'2026-07-04 00:00:00',	'19',	'XQ 595',	'U2TAZ5',	'Manchester Airport Ringway (MAN)',	'Antalya (AYT)',	'18:25',	'00:55',	0,	'GBP',	'2026-07-01 00:00:00',	0,	0,	'25KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"T2","arrTerminal":"T2","actualNotes":"","arrivalDate":"2026-07-05"}'),
('3645f98f-2db2-421c-acff-2ff2074afb09',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	NULL,	'2026-07-08 00:00:00',	'19',	'XQ 594',	'U2TAZ5',	'Antalya (AYT)',	'Manchester Airport Ringway (MAN)',	'14:25',	'17:25',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"T2","arrTerminal":"T2","actualNotes":"","arrivalDate":"2026-07-08"}'),
('07fe644b-f959-4156-a039-54f69be35081',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	NULL,	'2026-07-19 00:00:00',	'19',	'PC 1184',	'254XHJ',	'Birmingham Airport (BHX)',	'Sabiha Gökçen Uluslararası Havalimanı (SAW)',	'12:50',	'18:40',	2007.1,	'GBP',	'2026-06-21 00:00:00',	0,	0,	'20 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-19"}'),
('1b8055b7-bec3-446f-877f-41be5ea013ac',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	NULL,	'2026-08-30 00:00:00',	'1',	'PK 785',	'SAPEFM',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'London Heathrow Airport (LHR)',	'12:15',	'16:55',	0,	'GBP',	NULL,	0,	0,	'30 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-30"}'),
('25b6327d-80a0-47ff-a9b6-84728a18f941',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	NULL,	'2026-07-28 00:00:00',	'1',	'PK 714',	'SAPEFM',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'16:50',	'00:15',	2613.5,	'GBP',	'2026-01-10 00:00:00',	0,	0,	'30 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-29"}'),
('8a158564-f146-428c-b5f7-3bd4f57c001e',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	NULL,	'2026-07-19 00:00:00',	'19',	'PC 694',	'',	'Sabiha Gökçen Uluslararası Havalimanı (SAW)',	'King Abdulaziz International Airport (JED)',	'21:25',	'01:10',	0,	'GBP',	NULL,	0,	0,	'20 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-20"}'),
('eb3af37e-fd6f-4296-a160-544614f25ce1',	'78871a43-43e5-46e2-b96c-8db80a1de236',	NULL,	'2026-07-24 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'GF9',	'ARFLMK',	'Bahrain International (BAH)',	'Gatwick Airport London Crawley (LGW)',	'01:45',	'06:55',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-24"}'),
('3bb2b7ad-f8e9-470d-998d-66944970b92c',	'78871a43-43e5-46e2-b96c-8db80a1de236',	NULL,	'2026-07-23 00:00:00',	'1',	'GF178',	'ARFLMK',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'Bahrain International (BAH)',	'19:10',	'21:15',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-23"}'),
('050755ea-a9c6-4c87-be2e-e25fa0558e9e',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	NULL,	'2026-07-28 00:00:00',	'5',	'EK 36',	'EUJVJH',	'Newcastle International Airport Woolsington (NCL)',	'Dubai International Airport Al (DXB)',	'14:15',	'00:30',	0,	'GBP',	NULL,	0,	0,	'30 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-29"}'),
('c8ae0e2d-b2d0-4eea-85b6-5c6f2da701e2',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	NULL,	'2026-07-29 00:00:00',	'5',	'EK 805',	'EUJVJH',	'Dubai International Airport Al (DXB)',	'King Abdulaziz International Airport (JED)',	'06:55',	'08:45',	0,	'GBP',	NULL,	0,	0,	'30 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2028-11-20"}'),
('78741e3c-deab-4ea8-961d-6c54a0abd8d5',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	NULL,	'2026-08-06 00:00:00',	'5',	'EK 810',	'EUJVJH',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'Dubai International Airport Al (DXB)',	'17:35',	'21:15',	0,	'GBP',	NULL,	0,	0,	'30KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2029-02-06"}'),
('82db0d76-f8f7-4cc7-a01e-9512206de1b7',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	NULL,	'2026-08-12 00:00:00',	'5',	'EK 35',	'EUJVJH',	'Dubai International Airport Al (DXB)',	'Newcastle International Airport Woolsington (NCL)',	'07:25',	'12:05',	0,	'GBP',	NULL,	0,	0,	'30 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-12"}'),
('6a3198e6-2eaa-4297-a747-94a6587553b8',	'78871a43-43e5-46e2-b96c-8db80a1de236',	NULL,	'2026-07-09 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'PC1166',	'H764FC',	'London Stansted Airport Mountfitchet (STN)',	'Sabiha Gökçen Uluslararası Havalimanı (SAW)',	'16:45',	'22:30',	0,	'GBP',	NULL,	0,	0,	'20 KG',	'8 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-09"}'),
('530b840a-2a74-45aa-a9b2-d661db6225e1',	'78871a43-43e5-46e2-b96c-8db80a1de236',	NULL,	'2026-07-10 00:00:00',	'65b28593-f9ef-4473-b562-eea75c88316c',	'PC698',	'PC698',	'Sabiha Gökçen Uluslararası Havalimanı (SAW)',	'King Abdulaziz International Airport (JED)',	'00:50',	'04:35',	0,	'GBP',	NULL,	0,	0,	'20KG',	'78KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-10"}'),
('ec4f7f3b-9a28-45d3-9461-e7f1c64f845c',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-07-26 00:00:00',	'5',	'EK 805',	'',	'Dubai International Airport Al (DXB)',	'King Abdulaziz International Airport (JED)',	'06:55',	'08:45',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-26"}'),
('72827884-4088-415d-90d1-3eb47cadfaf6',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-07-26 00:00:00',	'5',	'GF 8',	'',	'Gatwick Airport London Crawley (LGW)',	'Bahrain International (BAH)',	'10:40',	'19:15',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-26"}'),
('8dedac11-5201-4488-947e-6d29e4fabead',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-07-27 00:00:00',	'5',	'GF 181',	'',	'Bahrain International (BAH)',	'King Abdulaziz International Airport (JED)',	'01:30',	'03:55',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-27"}'),
('3a194911-0d0f-43f8-a99a-dd8b51883ca6',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-08-05 00:00:00',	'5',	'GF 178',	'',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'Bahrain International (BAH)',	'19:10',	'21:15',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-05"}'),
('4b1beb99-bfa4-44c0-9ed1-aedb06020372',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-08-06 00:00:00',	'5',	'GF 7',	'',	'Bahrain International (BAH)',	'London Heathrow Airport (LHR)',	'02:00',	'06:55',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-06"}'),
('3701b74d-cab0-4f37-a7b8-d1a494963212',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-07-26 00:00:00',	'5',	'GF 8',	'',	'Gatwick Airport London Crawley (LGW)',	'Bahrain International (BAH)',	'10:40',	'19:15',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-26"}'),
('9a37aa52-be99-4b50-b123-ff3071cf2d47',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-07-27 00:00:00',	'5',	'GF 181',	'',	'Bahrain International (BAH)',	'King Abdulaziz International Airport (JED)',	'01:30',	'03:55',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-27"}'),
('a9626b80-726c-4574-bf64-dd8399b68181',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-08-05 00:00:00',	'5',	'EK 810',	'',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'Dubai International Airport Al (DXB)',	'17:35',	'21:15',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-05"}'),
('190fb9b1-557f-400b-bdc3-7502e6c77b07',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-08-06 00:00:00',	'5',	'EK 612',	'',	'Dubai International Airport Al (DXB)',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'03:20',	'07:30',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-06"}'),
('0dd5c323-ef7c-4999-b68e-52803404ec9d',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-07-26 00:00:00',	'5',	'EK 615',	'',	'Islamabad International Airport (ISB)',	'Dubai International Airport Al (DXB)',	'03:05',	'05:25',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-07-26"}'),
('1a7107bd-c5e5-4456-8e04-f994209a61ae',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-08-21 00:00:00',	'5',	'SV 727',	'',	'Benazir Bhutto International Airport Islamabad Rawalpindi Punjab (ISB)',	'King Abdulaziz International Airport (JED)',	'02:55',	'06:00',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-21"}'),
('d685194c-77f1-4e1b-a29c-33174251f06b',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	NULL,	'2026-08-21 00:00:00',	'5',	'SV 119',	'',	'King Abdulaziz International Airport (JED)',	'London Heathrow Airport (LHR)',	'08:10',	'12:40',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-08-21"}'),
('f6bde7e1-3163-4944-a392-cdce1912dc85',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	NULL,	'2026-09-22 00:00:00',	'5',	'QR 621',	'HBPPGQ',	'Allama Iqbal International Airport Lahore Punjab (LHE)',	'Hamad International Airport (DOH)',	'03:10',	'04:40',	443.4,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-09-22"}'),
('c8ecdf82-2811-4c2c-a4e2-82b309f118d6',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	NULL,	'2026-09-22 00:00:00',	'5',	'QR 167',	'',	'Hamad International Airport (DOH)',	'Stockholm-arlanda Flygplats Stockholm (ARN)',	'08:30',	'14:10',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	NULL,	'Economy Class',	'{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-09-22"}'),
('8b5dbb27-6274-48e8-9020-95a179083086',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	NULL,	'2025-12-18 00:00:00',	'1',	'114',	'DDL6YF',	'London Stansted Airport (STN)',	'Queen Alia Airport, Amman (AMM)',	'14:45',	'23:00',	4604.42,	'gbp',	'2025-09-13 23:00:00',	0,	0,	'1x baggage',	NULL,	NULL,	'Economy',	NULL),
('6c5f4e02-11f0-462b-9ed4-d60e66dd434c',	'd0729aaa-738f-467b-82cd-d52e508657ba',	NULL,	'2025-10-09 23:00:00',	'1',	'PC 1184',	'HGIPVH',	'BIRMIINGHAM',	'Istanbul Sabiha Gökçen',	'13:40',	'19:35',	834.48,	'0',	'2025-10-09 23:00:00',	0,	0,	'20 KG',	NULL,	NULL,	'Economy',	NULL),
('21652953-55df-4b35-963f-5dbad0fb5015',	'd0729aaa-738f-467b-82cd-d52e508657ba',	NULL,	'2025-10-09 23:00:00',	'1',	'PC 694',	'GJLOTT',	'Istanbul Sabiha Gökçen',	'Jeddah',	'21:20',	'01:10',	1060.4,	'GBP',	'2025-09-10 23:00:00',	0,	0,	'20 KG',	NULL,	NULL,	'Economy',	NULL),
('8347cf0d-76eb-4f19-ae51-8cc61948bedc',	'd0729aaa-738f-467b-82cd-d52e508657ba',	NULL,	'2025-10-16 23:00:00',	'1',	'QR 1175',	'0',	'Madinah Abdulaziz',	'DOHA',	'04:45',	'07:00',	0,	'GBP',	NULL,	0,	0,	'30 KG',	NULL,	NULL,	'Economy',	NULL),
('4614a052-c866-4d64-a5c1-24c599ae4448',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	NULL,	'2025-12-02 00:00:00',	'5',	'TK 1968',	'QYJOMP',	'BIRMIINGHAM',	'Istanbul',	'11:05',	'18:15',	2599.6,	'0',	'2025-09-16 23:00:00',	0,	0,	'46KG',	NULL,	NULL,	'Economy',	NULL),
('d157668f-aec3-4a9a-b9c3-1ebf62eee5c2',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	NULL,	'2025-12-03 00:00:00',	'5',	'TK 94',	'0',	'Istanbul',	'Jeddah',	'21:10',	'00:50',	0,	'GBP',	NULL,	0,	0,	'46 KG',	NULL,	NULL,	'Economy',	NULL),
('68adb093-616a-4844-9819-ec3c92064648',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	NULL,	'2025-12-14 00:00:00',	'5',	'TK 137',	'0',	'Madinah Abdulaziz',	'Istanbul',	'02:00',	'05:50',	0,	'0',	NULL,	0,	0,	'46 KG',	NULL,	NULL,	'Economy',	NULL),
('064bb424-f353-4e79-9316-f3ea7a949fa0',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	NULL,	'2025-12-14 00:00:00',	'5',	'TK 1967',	'0',	'Istanbul',	'Birmingham',	'08:50',	'10:05',	0,	'0',	NULL,	0,	0,	'46 KG',	NULL,	NULL,	'Economy',	NULL),
('e381d1c5-53e3-44cb-aea8-390be4e90574',	'ff948b46-5c06-4fb6-82c4-4dff4a9d6495',	NULL,	'2026-07-04 23:00:00',	'5',	'GF 767',	'H02392',	'LAHORE',	'Athens',	'22:00',	'01:55',	0,	'GBP',	NULL,	0,	0,	'35 KG',	'7 KG',	NULL,	'Economy',	NULL),
('caa89812-4e33-42bf-b57e-ea5d5a8b4124',	'951259e2-8ec8-4a9c-8b55-be727e3e1885',	NULL,	'2026-06-06 23:00:00',	'19',	'SV 729',	'EUIDLM',	'ISLAMABAD',	'Riyadh',	'17:50',	'00:45',	0,	'GBP',	NULL,	0,	0,	'23 KG',	'7 KG',	'0',	'Economy',	NULL),
('b6a07d35-4a0d-428e-9377-1524521dfeaa',	'66814ef2-1e4e-4a61-acdd-b278a910034d',	NULL,	'2026-03-25 00:00:00',	'5',	'EK 158',	'2RTKWU',	'Stockholm Arlanda (ARN)',	'Dubai International Airport',	'1430',	'0005',	819.8,	'gbp',	'2026-03-06 00:00:00',	0,	0,	'25 KG',	'7 KG',	'0',	'Economy',	NULL),
('79079e36-4842-4f07-ad54-59c0eafdb47b',	'66814ef2-1e4e-4a61-acdd-b278a910034d',	NULL,	'2026-05-10 23:00:00',	'5',	'EK 157',	'EUIDLM',	'Sialkot (SKT)',	'Dubai International Airport',	'02:40',	'0455',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy',	NULL),
('c39e3cd3-0626-4485-bedd-d912b0b2ef1d',	'ff948b46-5c06-4fb6-82c4-4dff4a9d6495',	NULL,	'2026-06-01 23:00:00',	'5',	'EY188',	'EUIDLM',	'Athens',	'LAHORE',	'07:20',	'18:25',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy',	NULL),
('a64fb16e-1042-41e4-81af-22e7cc8bb8c6',	'ff948b46-5c06-4fb6-82c4-4dff4a9d6495',	NULL,	'2026-08-01 23:00:00',	'5',	'GF47',	'EUIDLM',	'LAHORE',	'Athens',	'22:00',	'06:25',	0,	'GBP',	NULL,	0,	0,	'35 KG',	'7 KG',	NULL,	'Economy',	NULL),
('50c7c34c-c5e3-4399-b89b-3838fa47cc86',	'73eab461-94a8-47c6-913f-7eaa439426f5',	NULL,	'2026-07-28 23:00:00',	'5',	'QR34',	'QSTGVR',	'Birmingham',	'Doha',	'15:10',	'23:55',	0,	'GBP',	NULL,	0,	0,	'25kg',	'7kg',	'25kg',	'Economy',	NULL),
('2a106d07-440b-48e0-b380-ee8200096266',	'73eab461-94a8-47c6-913f-7eaa439426f5',	NULL,	'2026-08-07 23:00:00',	'5',	'QR35',	'QSTGVR',	'Doha',	'Birmingham',	'01:25',	'06:40',	0,	'GBP',	NULL,	0,	0,	'25kg',	'7kg',	'25kg',	'Economy',	NULL),
('c0754232-0310-4e9c-8a6f-93c4cb1fd1f8',	'c297180e-838b-4604-a79a-0fe024ee7d4e',	NULL,	'2026-07-02 23:00:00',	'5',	'PK 181',	'H6XNQZ',	'ISLAMABAD',	'Sharjah',	'12:10',	'14:15',	245.3,	'gbp',	'2026-06-18 23:00:00',	0,	0,	'30 KG',	'7 KG',	'0',	'Economy',	NULL),
('582befe4-0607-4cd8-ac08-d9355cc3286b',	'13f9b680-5767-4616-ab5d-a40280b79890',	NULL,	'2026-10-27 00:00:00',	'5',	'EK 40',	'H7D6JW',	'BIRMIINGHAM',	'DUBAI',	'13:40',	'00:45',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy',	NULL),
('e3e9009a-dae3-4657-a50f-c5ae4f53b028',	'13f9b680-5767-4616-ab5d-a40280b79890',	NULL,	'2026-10-28 00:00:00',	'5',	'EK 805',	'H7D6JW',	'DUBAI',	'Jeddah Airport',	'07:05',	'09:20',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	NULL,	'Economy',	NULL),
('26dade77-a7b0-4a2e-a18e-db5605c921b3',	'13f9b680-5767-4616-ab5d-a40280b79890',	NULL,	'2026-11-07 00:00:00',	'5',	'EK 2337',	'H7D6JW',	'Madinah Abdulaziz (MED)',	'Birmingham',	'01:15',	'11:40',	0,	'GBP',	NULL,	0,	0,	'25 KG',	'7 KG',	'0',	'Economy',	NULL);

DROP TABLE IF EXISTS "Hotel";
CREATE TABLE "public"."Hotel" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "description" text NOT NULL,
    "address" text NOT NULL,
    "city" text NOT NULL,
    "country" text NOT NULL,
    "rating" double precision DEFAULT '0.0' NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "Hotel" ("id", "name", "description", "address", "city", "country", "rating", "createdAt", "updatedAt") VALUES
('1a14fc24-4c18-4546-914f-66198c1314bc',	'Grand Hyatt Regency',	'Ultra-luxurious 5-star lodging with majestic city vistas.',	'109 Park Avenue',	'New York',	'United States',	4.8,	'2026-06-26 15:44:30.221',	'2026-06-26 15:44:30.221');

DROP TABLE IF EXISTS "Invoice";
CREATE TABLE "public"."Invoice" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "invoiceNumber" text NOT NULL,
    "pdfUrl" text,
    "amount" double precision NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON public."Invoice" USING btree ("invoiceNumber");

INSERT INTO "Invoice" ("id", "bookingId", "invoiceNumber", "pdfUrl", "amount", "createdAt") VALUES
('f345b2c6-621d-4abf-975f-7786440c1c70',	'32ba5865-c826-4c7c-b4c7-33537b639330',	'INV-1782489589753-946',	'/storage/invoices/INV-1782489589753-946.pdf',	1260,	'2026-06-26 00:00:00'),
('c4ad5c36-8912-4d9f-af97-ea08f81fd0dd',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9',	'INV-1782514078521-829',	'/storage/invoices/INV-1782514078521-829.pdf',	20,	'2026-06-27 00:00:00'),
('1c9b136a-f3cb-4cb9-9c97-969772310290',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'INV-1782760231994-319',	'/storage/invoices/INV-1782760231994-319.pdf',	40,	'2026-06-29 00:00:00'),
('101a36f2-864d-4ef2-b7df-8de0d8688a86',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'INV-1782832546985-657',	'/storage/invoices/INV-1782832546985-657.pdf',	507,	'2026-06-30 00:00:00'),
('807733cb-2a9c-4b55-b558-1c64b762e4e2',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'INV-1782837843881-206',	'/storage/invoices/INV-1782837843881-206.pdf',	20,	'2026-06-30 00:00:00'),
('ab5e64f9-d6d3-4f89-9152-47be6978be48',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'INV-1782913058547-432',	'/storage/invoices/INV-1782913058547-432.pdf',	600,	'2026-07-01 00:00:00'),
('fe381a10-0f1b-470f-aab1-72c6194a55d1',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'INV-1782913061015-783',	'/storage/invoices/INV-1782913061015-783.pdf',	1000,	'2026-07-01 00:00:00'),
('148c0b60-4598-402c-958a-54f4abd5e265',	'575da188-44f7-467b-83a6-ee1cbb5b2797',	'INV-1782913068602-484',	'/storage/invoices/INV-1782913068602-484.pdf',	625,	'2026-07-01 00:00:00'),
('e9126460-07f1-4ec7-899d-fe7b6e934c81',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	'INV-1782913247609-206',	'/storage/invoices/INV-1782913247609-206.pdf',	928,	'2026-06-29 00:00:00'),
('ca5a2331-fe4c-4b0f-b5c6-d5eef7ef6fa6',	'5e668417-02ad-40c0-8c73-723257ee4349',	'INV-1782927180840-955',	'/storage/invoices/INV-1782927180840-955.pdf',	40,	'2026-07-01 00:00:00'),
('a4b4d93b-65d2-4a9b-90d6-cd60d582dabc',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'INV-1782936832756-316',	'/storage/invoices/INV-1782936832756-316.pdf',	20,	'2026-07-02 00:00:00'),
('7e942a3c-4fb2-4c20-8aec-a6cd696a2bfa',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'INV-1782936834859-970',	'/storage/invoices/INV-1782936834859-970.pdf',	1000,	'2026-07-02 00:00:00'),
('2a0ea716-9e70-4292-b3f0-330a729f99bc',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'INV-1782993326358-469',	'/storage/invoices/INV-1782993326358-469.pdf',	1500,	'2026-07-01 00:00:00'),
('d8120a02-e83e-4c30-b2a8-e9e0f8fa83c9',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'INV-1783005692580-796',	'/storage/invoices/INV-1783005692580-796.pdf',	2500,	'2026-01-09 00:00:00'),
('8a735125-30a3-418e-96c2-260239798faa',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'INV-1783005716855-740',	'/storage/invoices/INV-1783005716855-740.pdf',	1000,	'2026-02-13 00:00:00'),
('b2e49623-0355-4c22-bc47-d8e8e44a0fba',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'INV-1783005735097-633',	'/storage/invoices/INV-1783005735097-633.pdf',	800,	'2026-03-26 00:00:00'),
('3e8390af-ea73-4b6b-a67f-907bcdb8ca71',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'INV-1783005776837-53',	'/storage/invoices/INV-1783005776837-53.pdf',	500,	'2026-05-09 00:00:00'),
('b32fb927-d45c-4997-bc00-8a173ad6aa0f',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'INV-1783005798055-424',	'/storage/invoices/INV-1783005798055-424.pdf',	1400,	'2026-05-31 00:00:00'),
('6ee4f675-f13f-46a4-8bb5-c6c60e3c2fbc',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'INV-1783005819462-910',	'/storage/invoices/INV-1783005819462-910.pdf',	300,	'2026-06-01 00:00:00'),
('80662278-d7c0-44cc-afb7-e46d133cba5b',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'INV-1783007308471-696',	'/storage/invoices/INV-1783007308471-696.pdf',	1040,	'2026-07-02 00:00:00'),
('b11a8423-60ae-4dfe-b196-332f8c594274',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'INV-1783007320663-610',	'/storage/invoices/INV-1783007320663-610.pdf',	98,	'2026-07-01 00:00:00'),
('1a833aa9-bd34-464d-8405-9e6d4d2ebf87',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'INV-1783014459206-817',	'/storage/invoices/INV-1783014459206-817.pdf',	1000,	'2026-07-02 00:00:00'),
('7c5235d5-eb5f-4a75-9a36-2f27050f56b1',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'INV-1783080387255-981',	'/storage/invoices/INV-1783080387255-981.pdf',	550,	'2026-06-20 00:00:00'),
('446fec21-a9a6-4c9a-a7e9-2ac86d88c249',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'INV-1783080407076-652',	'/storage/invoices/INV-1783080407076-652.pdf',	180,	'2026-06-29 00:00:00');

DROP TABLE IF EXISTS "Notification";
CREATE TABLE "public"."Notification" (
    "id" text NOT NULL,
    "userId" text NOT NULL,
    "title" text NOT NULL,
    "message" text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "Notification" ("id", "userId", "title", "message", "isRead", "createdAt") VALUES
('5f8b1aad-9adb-42fd-8a1f-4fc9571c3bbc',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Payment Request Approved',	'Your payment request of £600 for booking TT00943 has been approved.',	'0',	'2026-07-01 13:37:38.574'),
('262039df-eaad-4ca2-8a9e-e4ed128418d8',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Payment Request Approved',	'Your payment request of £1000 for booking TT00943 has been approved.',	'0',	'2026-07-01 13:37:41.034'),
('389597b3-9e25-4059-9b3b-5070a0cc2005',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'Payment Request Approved',	'Your payment request of £625 for booking TT00939 has been approved.',	'0',	'2026-07-01 13:37:48.625'),
('fa2c692c-8408-46fe-b93a-77e365fe37a1',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'Payment Request Approved',	'Your payment request of £40 for booking TT00945 has been approved.',	'0',	'2026-07-01 17:33:00.91'),
('501e9870-dc94-43d1-a6df-d39acf004b58',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Payment Request Approved',	'Your payment request of £20 for booking TT00971 has been approved.',	'0',	'2026-07-01 20:13:52.778'),
('5bc8b5a6-bf6e-4b81-9f3e-904c219a8142',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Payment Request Approved',	'Your payment request of £1000 for booking TT00971 has been approved.',	'0',	'2026-07-01 20:13:54.879'),
('f4cc4997-e8e8-40d3-b338-adbe585e29f6',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'Payment Request Rejected',	'Your payment request of £1500 for booking TT00973 has been rejected. Reason: double payment.',	'0',	'2026-07-02 11:54:09.37'),
('272538a2-2be8-4230-a75c-e0942270e383',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'Payment Request Approved',	'Your payment request of £1500 for booking TT00973 has been approved.',	'0',	'2026-07-02 11:55:26.387'),
('ca5cab2b-5a64-4d24-ae40-d58d409c8ea1',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'New Payment Request',	'Ali Ahmad submitted a payment request of £1500 for booking TT00973.',	'1',	'2026-07-02 11:52:15.66'),
('b9103308-3c29-4d60-a27a-fb20c772b1d7',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'New Payment Request',	'Ali Ahmad submitted a payment request of £1500 for booking TT00973.',	'1',	'2026-07-02 11:50:59.746'),
('1d71ec5d-5413-4f3e-b5dd-b53a3315d06a',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'New Payment Request',	'RAYAN ALI submitted a payment request of £1000 for booking TT00971.',	'1',	'2026-07-01 20:12:09.809'),
('458c8001-7e2e-4794-8b22-014e93021e21',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'New Payment Request',	'RAYAN ALI submitted a payment request of £20 for booking TT00971.',	'1',	'2026-07-01 20:11:51.08'),
('2718b0e9-d4df-460d-92d3-854f15526c1b',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'New Payment Request',	'Zain Malik submitted a payment request of £40 for booking TT00945.',	'1',	'2026-07-01 14:45:24.739'),
('026c5fd6-1dea-4ce3-9675-cd08f3b3f6c1',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £928 for booking TT00967 has been approved.',	'1',	'2026-07-01 13:40:47.846'),
('459867c5-b7fe-4ec3-a9d7-4460b685381e',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'New Payment Request',	'RAYAN ALI submitted a payment request of £1000 for booking TT00943.',	'1',	'2026-07-01 12:59:31.575'),
('d5f0e11f-d9ea-4438-a40c-3c000536594b',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'New Payment Request',	'RAYAN ALI submitted a payment request of £600 for booking TT00943.',	'1',	'2026-07-01 12:58:32.553'),
('395e2f13-24b9-4204-b0b4-3e063b82de29',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'New Payment Request',	'Ali Ahmad submitted a payment request of £625 for booking TT00971.',	'1',	'2026-07-01 10:40:00.286'),
('f32581f9-f084-4830-a76f-8a1fc3d634c6',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £2500 for booking TT00803 has been approved.',	'0',	'2026-07-02 15:21:32.607'),
('f3e078b5-fa2f-4824-894e-7634035b411f',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £1000 for booking TT00803 has been approved.',	'0',	'2026-07-02 15:21:56.887'),
('6a79127f-5bf6-40ed-b783-b78d45bf6302',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £800 for booking TT00803 has been approved.',	'0',	'2026-07-02 15:22:15.126'),
('d9d493ba-aa45-4928-88e8-69942c59f950',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £500 for booking TT00803 has been approved.',	'0',	'2026-07-02 15:22:56.859'),
('d1ebb2ef-ddf5-46cb-b105-77432e8d6359',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £1400 for booking TT00803 has been approved.',	'0',	'2026-07-02 15:23:18.082'),
('57e4e8f3-3992-4725-89af-2df96f76a497',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £300 for booking TT00803 has been approved.',	'0',	'2026-07-02 15:23:39.494'),
('17c65f2f-16bc-4e4d-aebb-0f34abe42684',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Payment Request Rejected',	'Your payment request of £1138 for booking TT00929 has been rejected. Reason: wrong amount .',	'0',	'2026-07-02 15:47:44.557'),
('1cfa6267-ad9f-4fbf-8b99-24a858a154a2',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £1040 for booking TT00929 has been approved.',	'0',	'2026-07-02 15:48:28.516'),
('7eea0aa1-38c1-4bb7-9751-d2e93faf224b',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £98 for booking TT00929 has been approved.',	'0',	'2026-07-02 15:48:40.719'),
('c80b8f81-3958-4a8b-aa9a-cd4dc34968c1',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Payment Request Approved',	'Your payment request of £1000 for booking TT00936 has been approved.',	'1',	'2026-07-02 17:47:39.238'),
('57caa905-1bac-475a-b7ee-8fc4612a558b',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'Payment Request Rejected',	'Your payment request of £730 for booking TT00959 has been rejected. Reason: wrong payment.',	'0',	'2026-07-03 12:05:50.061'),
('5c991d16-6d58-4537-ad91-2489081d8ed4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £550 for booking TT00959 has been approved.',	'0',	'2026-07-03 12:06:27.282'),
('bb5c9644-1b27-4b58-abff-68bb634a139b',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'Payment Request Approved',	'Your payment request of £180 for booking TT00959 has been approved.',	'0',	'2026-07-03 12:06:47.1');

DROP TABLE IF EXISTS "Passenger";
CREATE TABLE "public"."Passenger" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "title" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "dateOfBirth" timestamp(3),
    "age" text NOT NULL,
    "email" text,
    "phoneNumber" text,
    "nationality" text,
    "passportNumber" text,
    "passportExpiryDate" timestamp(3),
    "passportIssuingCountry" text,
    "agentId" text,
    "role" text NOT NULL,
    "formToken" text,
    "formSubmittedAt" timestamp(3),
    "passportScanKey" text,
    "collectPassport" boolean DEFAULT true NOT NULL,
    "collectAdditional" boolean DEFAULT false NOT NULL,
    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Passenger_formToken_key" ON public."Passenger" USING btree ("formToken");

INSERT INTO "Passenger" ("id", "bookingId", "title", "firstName", "lastName", "dateOfBirth", "age", "email", "phoneNumber", "nationality", "passportNumber", "passportExpiryDate", "passportIssuingCountry", "agentId", "role", "formToken", "formSubmittedAt", "passportScanKey", "collectPassport", "collectAdditional") VALUES
('20ff3bf5-f4c6-45b8-a855-b4d5429518c9',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'Mr',	'MUHAMMAD OWAIS',	'AFZAL',	'2002-01-08 00:00:00',	'Adult',	'Bilalshahk4435@gmail.com',	'+44 7932 577905',	'Pakistan',	'NN1518801',	'2035-07-09 00:00:00',	'Pakistan',	NULL,	'Leader',	'03c1c524-49a9-4f69-ba17-5c7225c804ec',	NULL,	'passport-20ff3bf5-f4c6-45b8-a855-b4d5429518c9-1782824846736-Screenshot 2026-06-26 170103.png',	'1',	'0'),
('2d5844c7-e6bf-428e-9601-87ffa723ea4b',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'Mrs',	'FEROZA',	'AFZAL',	'1981-12-25 00:00:00',	'Adult',	'feroza_81@hotmail.com',	'+44 7891 424988',	'United Kingdom',	'123785018',	'2030-11-09 00:00:00',	'United Kingdom',	NULL,	'Leader',	'da389432-4421-40a9-92d6-65c0ee2ea0c9',	NULL,	'passport-2d5844c7-e6bf-428e-9601-87ffa723ea4b-1782920395288-WhatsApp Image 2026-07-01 at 16.38.20.jpeg',	'1',	'0'),
('4d325643-55d5-41e2-9e7c-820ef6e0b114',	'32ba5865-c826-4c7c-b4c7-33537b639330',	'Mr',	'Bilal',	'Shah',	'2003-10-13 00:00:00',	'Adult',	'Bilalshahk4435@gmail.com',	'+44 7932 577905',	'Pakistan',	'ZG5156871',	'2033-07-23 00:00:00',	'Pakistan',	NULL,	'Leader',	'97668fe3-d2c3-4d2c-a135-870b7a4523e0',	NULL,	'passport-4d325643-55d5-41e2-9e7c-820ef6e0b114-1782489906493-Screenshot 2026-06-26 170040.png',	'1',	'0'),
('ab845afa-4366-4a24-9c06-13c0a7f0f38d',	'32ba5865-c826-4c7c-b4c7-33537b639330',	'Mr',	'MUHAMMAD OWAIS',	'AFZAL',	'2002-01-08 00:00:00',	'Adult',	'Bilalshahk4435@gmail.com',	'+44 7932 577905',	'Pakistan',	'NN1518801',	'2035-07-09 00:00:00',	'Pakistan',	NULL,	'Passenger',	'b4db19be-c1dc-4bfe-a184-6acbb3ebf027',	NULL,	'passport-ab845afa-4366-4a24-9c06-13c0a7f0f38d-1782490046216-Screenshot 2026-06-26 170103.png',	'1',	'0'),
('93e7aeca-d3b3-4052-b514-e6442e471863',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9',	'Mr',	'Khalil',	'Ahmed',	NULL,	'Adult',	'ahadkhalil50@gmail.com',	'+44 7591 762150',	'Pakistani ',	NULL,	NULL,	NULL,	NULL,	'Leader',	'e783222c-2510-4ec4-8446-e2625c8ccf00',	NULL,	NULL,	'0',	'0'),
('33cc9e74-9242-4829-b74e-3dd0c1c6f0ef',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9',	'Mrs',	'Humera',	'Khalil',	NULL,	'Adult',	'ahadkhalil50@gmail.com',	'+44 7591 762150',	NULL,	NULL,	NULL,	NULL,	NULL,	'Family Member',	'4129e7f0-7dd9-4276-8907-a8a84065df05',	NULL,	NULL,	'0',	'0'),
('c88b78d7-5346-4fe5-a111-7f9440cc4a00',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'Mr',	'Intikhab Alam',	'Khan',	'1970-04-30 00:00:00',	'Adult',	'muskankhanx666@gmail.comm',	'+447542959049',	'Pakistani',	'RM4134672',	'2035-07-21 00:00:00',	'Pakistan',	NULL,	'Leader',	'828fa0f9-dd76-4040-bcfb-b83d0ac61484',	NULL,	'passport-c88b78d7-5346-4fe5-a111-7f9440cc4a00-1782838378777-WhatsApp Image 2026-06-29 at 23.07.47.jpeg',	'0',	'0'),
('6d0a7f69-8a3b-4ca4-bae4-a3a335fe05b2',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'Mr',	'AFTAB',	'MIAH',	NULL,	'Adult',	'amberkingx7@gmail.com',	'+44 7500 804503',	'United Kingdom',	'TEDEDÉLIV',	'2033-01-20 00:00:00',	'United Kingdom',	NULL,	'Leader',	'65a0db46-88e0-4444-8fef-d01795cddb8f',	NULL,	'passport-6d0a7f69-8a3b-4ca4-bae4-a3a335fe05b2-1782744868861-MicrosoftTeams-image.png',	'0',	'0'),
('4b02eccf-9a9e-4925-bf93-80fce487f270',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'Mrs',	'Farzana',	'Intikhab',	NULL,	'Adult',	'muskankhanx666@gmail.comm',	'+447542959049',	'Pakistani',	'HH8911432',	'2035-07-24 00:00:00',	'Pakistan',	NULL,	'Passenger',	'697b7800-c91d-4ecd-af40-8fd7d49825da',	NULL,	'passport-4b02eccf-9a9e-4925-bf93-80fce487f270-1782838551905-WhatsApp Image 2026-06-29 at 23.07.50.jpeg',	'1',	'0'),
('71620203-9f4a-4ff5-93eb-d80694b3b525',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'Mr',	'Shiraz',	'Miah',	NULL,	'Adult',	'amberkingx7@gmail.com',	'+44 7500 804503',	'British',	'138958329',	'2033-02-28 00:00:00',	'United Kingdom',	NULL,	'Family Member',	'7cd2a901-92a0-4edb-ba01-d3f884d664ad',	NULL,	'passport-71620203-9f4a-4ff5-93eb-d80694b3b525-1782745833375-MicrosoftTeams-image (2).png',	'0',	'0'),
('fada835a-9907-4a9c-8d2b-b957a1c761c8',	'575da188-44f7-467b-83a6-ee1cbb5b2797',	'Mr',	'HAFIZ MALIK WAQAS',	'ALI',	'1987-11-12 00:00:00',	'Adult',	'Malikwaqasali9188@gmail.com',	'07466 015742',	'Pakistan',	'HA1799483',	'2031-10-10 00:00:00',	'Pakistan',	NULL,	'Leader',	'bec8ec93-9469-476c-891f-0b97c2a96a58',	NULL,	'passport-fada835a-9907-4a9c-8d2b-b957a1c761c8-1782903026978-3.jpeg',	'1',	'0'),
('88daf5a3-fe7a-4b96-88be-0a073bb8f68d',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'Mrs',	'Nurun',	'Nessa',	'1943-01-10 00:00:00',	'Adult',	'amberkingx7@gmail.com',	'+44 7500 804503',	'United Kingdom',	'122328844',	'2032-02-22 00:00:00',	'United Kingdom',	NULL,	'Passenger',	'acb489a7-676f-4b90-9318-2931ebf0bb04',	NULL,	'passport-88daf5a3-fe7a-4b96-88be-0a073bb8f68d-1782745854633-MicrosoftTeams-image (4).png',	'0',	'0'),
('30eefa7c-d32f-4bb9-a8d8-eb3ce8330063',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'Mr',	'Mahammad Aminul',	'Islam',	NULL,	'Adult',	'aminul2412@gmail.com',	NULL,	NULL,	'551122572',	'2027-12-12 00:00:00',	'United Kingdom',	NULL,	'Leader',	'b7e31f1d-771c-4eea-b87f-7aff1f350f31',	NULL,	NULL,	'0',	'0'),
('ccb91db7-9bb1-4856-92e6-01fd78124471',	'575da188-44f7-467b-83a6-ee1cbb5b2797',	'Mrs',	'EESHA',	'WAQAS',	'1990-04-19 00:00:00',	'Adult',	'Malikwaqasali9188@gmail.com',	'07466 015742',	'Pakistani',	'BU6310812',	'2033-06-06 00:00:00',	'Pakistan',	NULL,	'Passenger',	'b151b0bc-101e-418b-9516-8fc593aee38c',	NULL,	'passport-ccb91db7-9bb1-4856-92e6-01fd78124471-1782903229862-3.jpeg',	'1',	'0'),
('346c1f4c-957d-4abb-b41a-b0184438c049',	'5e668417-02ad-40c0-8c73-723257ee4349',	'Mr',	'Gauhar',	'Ali',	'1996-04-16 00:00:00',	'Adult',	'gauharali719@gmail.com',	'+44 7852 570175',	'Pakistani',	'PL1837631',	'2028-03-20 00:00:00',	NULL,	NULL,	'Leader',	'b53740cf-be0c-4519-8364-e9af3bfe216a',	NULL,	NULL,	'1',	'0'),
('f7ac194a-3356-4c3c-aefe-8781f1b77ab8',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	'Mr',	'FOZIA',	'YASMEEN',	'1982-01-01 00:00:00',	'Adult',	'sajid.ali@hotmail.com',	'+44 7497 155556',	'Lore IN ITALIANA F',	'YB3837055',	'2028-11-04 00:00:00',	'Lore IN ITALIANA F',	NULL,	'Leader',	'50bff313-c08b-4aa6-b866-ed105378333b',	NULL,	'passport-f7ac194a-3356-4c3c-aefe-8781f1b77ab8-1782913374675-WhatsApp Image 2026-06-29 at 18.06.43.jpeg',	'1',	'0'),
('bd05d3dd-75ed-4c0c-84c6-d7510cbaa262',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'Mr',	'Ehsan',	'Munir',	'2001-10-22 00:00:00',	'Adult',	'ehsan.munir9@gmail.com',	'+44 7975 887515',	'British',	'552726797',	'2028-07-28 00:00:00',	'United Kingdom',	NULL,	'Leader',	'cd1afa32-1943-49a9-b2d1-62987562efb6',	NULL,	NULL,	'0',	'0'),
('14602fe4-a3f4-40f4-94f9-562f56846381',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'Mr',	'Jamal',	'Fasial',	'2003-05-05 00:00:00',	'Adult',	'ehsan.munir9@gmail.com',	'+44 7975 887515',	'Pakistani',	'CK8913433',	'2029-12-19 00:00:00',	'Pakistan',	NULL,	'Passenger',	'37131291-35ff-403e-8b9a-72e80f0a26df',	NULL,	NULL,	'0',	'0'),
('bfd796e7-4b47-4848-9a42-17b8e6e6db01',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'Mr',	'SAFDAR',	'HUSSAIN',	'1979-07-10 00:00:00',	'Adult',	'zyan.ali1221@gmail.com',	'03490907453',	'Pakistan',	'HF6907992',	'2035-05-05 00:00:00',	'Pakistan',	NULL,	'Leader',	'358e14e8-8f0f-4ecc-b9b7-7aaacd0890bf',	NULL,	'passport-bfd796e7-4b47-4848-9a42-17b8e6e6db01-1782946917986-Screenshot 2026-07-02 035917.png',	'0',	'0'),
('89f98218-b835-4b2a-bbad-cb95149823c8',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'Mr',	'IBRAR',	'AHMED',	'1985-04-18 00:00:00',	'Adult',	'ibrar.ahmed@hotmail.com',	'07400661667',	'United Kingdom',	'146260192',	'2034-04-19 00:00:00',	'United Kingdom',	NULL,	'Leader',	'e96e36dc-79ac-4e4a-80a0-743a4f5d8737',	NULL,	'passport-89f98218-b835-4b2a-bbad-cb95149823c8-1782993683172-WhatsApp Image 2026-06-19 at 16.14.17 (1).jpeg',	'1',	'0'),
('d0fa2abd-36cc-4f6f-8b61-3eebbd5637e0',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'Mrs',	'Farzana',	'Kausar',	'1984-04-16 00:00:00',	'Adult',	'ibrar.ahmed@hotmail.com',	'07400661667',	'United Kingdom',	'160377465',	'2036-04-04 00:00:00',	'United Kingdom',	NULL,	'Passenger',	'c45ae3d1-ff96-4d5e-8d24-181f970ce66a',	NULL,	'passport-d0fa2abd-36cc-4f6f-8b61-3eebbd5637e0-1782993798366-WhatsApp Image 2026-06-19 at 16.14.17 (3).jpeg',	'1',	'0'),
('900f195a-1a16-457e-a9bc-1b4e47820c02',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'Mr',	'MOHAMMAD ZEESHAN',	'AHMED',	'2008-12-21 00:00:00',	'Adult',	'ibrar.ahmed@hotmail.com',	'07400661667',	'United Kingdom',	'151910425',	'2034-12-23 00:00:00',	'United Kingdom',	NULL,	'Passenger',	'ec9157ed-6b29-4d4e-9d7a-781706003f54',	NULL,	'passport-900f195a-1a16-457e-a9bc-1b4e47820c02-1782993888556-WhatsApp Image 2026-06-19 at 16.14.17 (2).jpeg',	'1',	'0'),
('1e9b4df0-6575-47de-8c10-bd73e76d911e',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'Mr',	'ABDUL',	'RAHEEM',	'2015-10-18 00:00:00',	'Child',	'ibrar.ahmed@hotmail.com',	'07400661667',	'United Kingdom',	'160406857',	'2031-03-19 00:00:00',	'United Kingdom',	NULL,	'Passenger',	'a672f943-36ae-402c-98cb-5fa54ca6ffe4',	NULL,	'passport-1e9b4df0-6575-47de-8c10-bd73e76d911e-1782993950127-WhatsApp Image 2026-06-19 at 16.14.17.jpeg',	'1',	'0'),
('fd5a47c1-1cf5-49bd-8158-1e1f04d618b2',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'Mr',	'MUHAMMED',	'IBRAHIM',	'2011-01-11 00:00:00',	'Adult',	'ibrar.ahmed@hotmail.com',	'07400661667',	'United Kingdom',	'160379492',	'2031-03-11 00:00:00',	'United Kingdom',	NULL,	'Passenger',	'0acbd847-5c67-46e9-a81c-352a5331d29f',	NULL,	'passport-fd5a47c1-1cf5-49bd-8158-1e1f04d618b2-1782994186100-WhatsApp Image 2026-06-19 at 16.14.16.jpeg',	'1',	'0'),
('200d37b4-bac2-419d-8470-fe407cc89ba6',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'Mr',	'MUFTI ASHRAFUR',	'CHOUDHURY',	'1976-09-15 00:00:00',	'Adult',	'muftichoudhury@gmail.com',	'+44 7946 472132',	'GB',	'555603338',	'2028-11-04 00:00:00',	'GB',	NULL,	'Leader',	'c2399d05-71c5-4fac-b51b-348d9dceb1f7',	NULL,	'passport-200d37b4-bac2-419d-8470-fe407cc89ba6-1782994229027-1.jpeg',	'1',	'0'),
('53cf29b3-4222-4b3a-a352-b4c24f6adbc7',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'Miss',	'AMAYAH',	'CHOUDHURY',	'2017-03-30 00:00:00',	'Child',	'muftichoudhury@gmail.com',	'+44 7946 472132',	'GB',	'310558956',	'2031-06-09 00:00:00',	'GB',	NULL,	'Family Member',	'3f58b9ec-9e3b-4a28-84cb-579e41ffe27e',	NULL,	NULL,	'1',	'0'),
('c043e68b-5bbe-4b77-86de-a334f59090fc',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'Mrs',	'MST TANZINA SULTANA',	'CHOWDHURY',	'1989-02-20 00:00:00',	'Adult',	'muftichoudhury@gmail.com',	'+44 7946 472132',	'GB',	'148190613',	'2034-08-06 00:00:00',	'GB',	NULL,	'Family Member',	'744fe56d-520f-4521-9145-c773d3200e29',	NULL,	NULL,	'1',	'0'),
('51e61c94-d3db-4665-8d0c-7afd7ab89210',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'MSTR',	'ADYAAN AHMED',	'CHOUDHURY',	'2014-12-22 00:00:00',	'Child',	'muftichoudhury@gmail.com',	'+44 7946 472132',	'GB',	'152683978',	'2029-09-13 00:00:00',	'GB',	NULL,	'Family Member',	'6544ea73-21f9-47c7-a366-693a6bc7af0e',	NULL,	NULL,	'1',	'0'),
('b21b66a7-12e8-462d-8870-7b69fdad346a',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'MSTR',	'IZHAAN',	'CHOUDHURY',	'2022-12-28 00:00:00',	'Child',	'muftichoudhury@gmail.com',	'+44 7946 472132',	'GB',	'138677097',	'2028-03-07 00:00:00',	'GB',	NULL,	'Family Member',	'b43ba451-9612-4dce-9236-e82c77abf3ae',	NULL,	NULL,	'1',	'0'),
('a140ca83-fb14-4e01-a1a6-6d05137c85fe',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'MSTR',	'RAIYAN',	'CHOUDHURY',	'2026-02-22 00:00:00',	'Infant',	'muftichoudhury@gmail.com',	'+44 7946 472132',	'GB',	'310757841',	'2031-06-13 00:00:00',	'GB',	NULL,	'Family Member',	'88964ff6-8aee-4cc6-8291-0faf5721ee9b',	NULL,	NULL,	'1',	'0'),
('91fae09d-16a8-4a25-918a-b63cdffe7c49',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'Mr',	'SAIFUR RAHMAN',	'KHAN',	'1976-07-21 00:00:00',	'Adult',	'madihakhan07@gmail.com',	'+44 7917 305221',	'British',	NULL,	NULL,	NULL,	NULL,	'Leader',	'7b87d352-57b0-4541-9ec1-fa9d143163d2',	NULL,	NULL,	'1',	'0'),
('e00c4fdd-5e21-449c-b75b-40f21b02910f',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'Mr',	'Suleman Saifur',	'Rahman Khan',	'2010-10-12 00:00:00',	'Adult',	'madihakhan07@gmail.com',	'+44 7917 305221',	'British',	NULL,	NULL,	NULL,	NULL,	'Family Member',	'a5f56b12-7960-4c4e-abce-1c1e826f91d0',	NULL,	NULL,	'1',	'0'),
('a95a7c2f-b08e-494f-9faf-1416af4a513d',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'Mrs',	'RANA',	'ANJUM',	'1986-08-14 00:00:00',	'Adult',	'madihakhan07@gmail.com',	'+44 7917 305221',	'British',	NULL,	NULL,	NULL,	NULL,	'Family Member',	'e379c6ac-5f06-47fe-9148-cdd152be55d8',	NULL,	NULL,	'0',	'0'),
('20629b93-d40e-4664-b3ba-57cbe02cdae8',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'MSTR',	'Mohammed Saifur',	'Rahman Khan',	'2010-09-28 00:00:00',	'Adult',	'madihakhan07@gmail.com',	'+44 7917 305221',	'British',	NULL,	NULL,	NULL,	NULL,	'Family Member',	'1c4db72b-0b86-40de-9b83-ed9100eb2421',	NULL,	NULL,	'0',	'0'),
('b1479f34-cdee-4661-bba3-15b38ddb072f',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'Ms',	'Alishba',	'Farrukh',	'1998-05-27 00:00:00',	'Adult',	'docwaseemahmad@gmail.com',	'07584339918',	'Pakistani',	'JH8960041',	'2027-01-20 00:00:00',	'Pakistan',	NULL,	'Family Member',	'15119255-153e-4c06-9bc5-9d5eeae5e6f5',	NULL,	NULL,	'0',	'0'),
('359d8aea-4efb-4371-bea3-8e58c20a56f3',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'Mr',	'Waseem',	'Ahmad',	'1996-09-14 00:00:00',	'Adult',	'docwaseemahmad@gmail.com',	'07584339918',	'Pakistani',	'MT1174502',	'2028-08-15 00:00:00',	'Pakistan',	NULL,	'Leader',	'09582165-b5ad-4f28-b933-0b168d6dc74d',	NULL,	NULL,	'0',	'0'),
('40a0c6e1-ba5a-4868-82cc-6cbc5efc998d',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'Miss',	'MAHAM',	'FATIMA',	'2003-03-03 00:00:00',	'Adult',	'mahamf788@gmail.com',	'+44 7311 379561',	'Pakistan',	'BX8458893',	'2029-09-19 00:00:00',	'Pakistan',	NULL,	'Leader',	'2af403bc-dfb6-4679-a799-74aa2f381ac6',	NULL,	'passport-40a0c6e1-ba5a-4868-82cc-6cbc5efc998d-1783017609950-WhatsApp Image 2026-06-20 at 20.45.08.jpeg',	'0',	'0'),
('3c96304b-b34f-4df9-af00-8bd82f030b39',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'Mr',	'IBTISAM',	'HUSSAIN',	NULL,	'Adult',	'ihbhati@gmail.com',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'Passenger',	'78bf12f1-f232-4661-8cf7-737bce0a2e1f',	NULL,	NULL,	'1',	'0'),
('e8fa615a-81bf-46c8-9035-e1122a17aed0',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'Miss',	'AIMAN',	'BILAL',	NULL,	'Adult',	'ihbhati@gmail.com',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'Passenger',	'268a7840-3b7c-42f0-9f7a-23bbbf7c7f05',	NULL,	NULL,	'1',	'0'),
('90a02f6b-6497-4284-8481-c77bede8a633',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'Ms',	'SHAZIA',	'BIBI',	NULL,	'Adult',	'ihbhati@gmail.com',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'Passenger',	'1c609a2d-9d6c-4141-b9ed-283930b0c88a',	NULL,	NULL,	'1',	'0'),
('fc9702cb-f849-43b7-8cf7-dc6c5aac02f6',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'Mr',	'MUHAMMAD',	'ABDULLAH BIN MAZHAR',	NULL,	'Adult',	'ihbhati@gmail.com',	'+44 7389 090236',	NULL,	NULL,	NULL,	NULL,	NULL,	'Leader',	'5e792abb-6a3f-4fba-a951-631f8a19274a',	NULL,	NULL,	'0',	'1'),
('be0d041f-38cb-4ac3-846f-ca9934fe551f',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'Miss',	'ALEENA',	'MISHALL HUSSAIN',	NULL,	'Adult',	'ihbhati@gmail.com',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'Passenger',	'b8a70594-76e0-4ef8-93d9-acb294bf5e4c',	NULL,	NULL,	'1',	'1'),
('8779b3ed-c0ab-45e1-b528-8d9e54352dd3',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'Miss',	'AFZA',	'BIBI',	NULL,	'Adult',	'ihbhati@gmail.com',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'Passenger',	'0a94b6ac-2bc8-40d1-ac65-be36248055b3',	NULL,	NULL,	'1',	'0'),
('3b8ce1bd-f061-4c78-abde-7dd244d75864',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'Miss',	'SHAHEEN',	'NAZMA',	NULL,	'Adult',	'ihbhati@gmail.com',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'Passenger',	'4ed6c7ae-3827-4499-ac24-ea024abbc163',	NULL,	NULL,	'1',	'0'),
('72ca6bd0-96e8-435e-af36-6d67d5b17cfb',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'Miss',	'KHALIDA',	'BIBI',	NULL,	'Adult',	'ihbhati@gmail.com',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'Passenger',	'a1be72bf-928e-431e-af34-a697ee249e04',	NULL,	NULL,	'1',	'0'),
('854f8c89-e610-4d80-bf00-c0c588bd8084',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'MR',	'NOOR SHAH',	'KHALID',	NULL,	'44',	'NOORSHAH00@GMAIL.COM',	'+44 7492 854856',	NULL,	NULL,	NULL,	NULL,	NULL,	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('e4b91699-14f3-4531-b178-0552a164b587',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'MISS',	'SUMAYA',	'KHAN',	NULL,	'33',	'SUMAYAKHAN@mail.com',	'+44 7492 854856',	NULL,	NULL,	NULL,	NULL,	NULL,	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('6d73b5b8-5d08-4109-86cd-10afa77229d0',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'mstr',	'muhammad',	'umer',	NULL,	'9',	'muhammadumer@gmail.com',	'+44 7492 854856',	NULL,	NULL,	NULL,	NULL,	NULL,	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('f94edbc8-81fd-44e8-b55c-4e76cd9ac259',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'MSTR',	'ANAYA KHALID',	'KHAN',	NULL,	'07',	'ANAYAKHAN@GMAIL.COM',	'+44 7492 854856',	NULL,	NULL,	NULL,	NULL,	NULL,	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('040481fa-0457-46a5-bf01-5fc6f51c7106',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'MSTR',	'MARIHA KHALID',	'KHAN',	NULL,	'13',	'MAHIRA@GMAIL.COM',	'+44 7492 854856',	NULL,	NULL,	NULL,	NULL,	NULL,	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('7de32a6c-01ed-4330-84c0-80e2cab6607a',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'MSTR',	'MAYLA KHALID',	'KHAN',	NULL,	'14',	'MAYLA@GMAIL.COM',	'+44 7492 854856',	NULL,	NULL,	NULL,	NULL,	NULL,	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('464fa8a3-7038-4400-b94d-fe73cf9365bb',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'MSTR',	'MUHAMMAD HASSAN',	'AMMAR',	NULL,	'8 MONTHS',	'MHASSAN@GMAIL.COM',	'+44 7492 854856',	NULL,	NULL,	NULL,	NULL,	NULL,	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('0030f3a2-2ada-40fa-881f-49bb1a0a24ad',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'Mr',	'SHAHJEE AZAM',	'KHAN',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	'+44 7427 057020',	NULL,	NULL,	NULL,	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('f7ec2c07-7ea0-485d-aa9d-b1efa875d0b2',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'MISS',	'TWAHEARA',	'BEGUM',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	'+44 7427 057020',	NULL,	NULL,	NULL,	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('e7cf3033-034f-4aeb-96f7-d5f2c425f52c',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'MISS',	'SAFIA',	'BIBI',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	'+44 7427 057020',	NULL,	NULL,	NULL,	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('fc9a0e0e-e7ce-4253-993c-5b77c0f62413',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'MR',	'IBRAR',	'MUHAMMAD',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	'+44 7427 057020',	NULL,	NULL,	NULL,	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('e15b14b8-dc18-4e66-97a1-cb84da35689b',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'MISS',	'KULSOOM',	'BI',	NULL,	'ADULT',	'0',	'00447417530180',	NULL,	NULL,	'2026-08-06 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('01b968d5-ff96-429e-943d-f0d204943afb',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'MR',	'SUDAIS ULLAH',	'KHAN',	NULL,	'ADULT',	'0',	'0',	NULL,	NULL,	'2026-09-18 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('e017bdf7-2f33-4ad6-b072-047c39bce3fe',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'MISS',	'ASMA',	'BIBI',	NULL,	'ADULT',	'0',	'0',	NULL,	NULL,	'2026-12-19 00:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('d2c077e0-3d60-40b8-9361-0c1cfdf435ec',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'MR',	'AYAAN ULLAH',	'KHAN',	NULL,	'YOUTH',	'0',	'0',	NULL,	NULL,	'2026-12-26 00:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('11da4656-fcc1-495a-8b9f-1734fe5dccc1',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'MISS',	'AYAT',	'USMAN',	NULL,	'CHILD',	'0',	'0',	NULL,	NULL,	'2027-03-05 00:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('22de99ff-e0ce-419e-8857-a7aa72893d6a',	'66814ef2-1e4e-4a61-acdd-b278a910034d',	'MR',	'AMJID',	'PERVAIZ',	NULL,	'ADULT',	'zain@terrifictravel.co.uk',	'+3490907453',	NULL,	NULL,	'2033-11-14 00:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('9b3629b2-0117-48a0-9f49-f4b7c1b8a34d',	'ff948b46-5c06-4fb6-82c4-4dff4a9d6495',	'MR',	'IJAZ',	'ANWAR',	NULL,	'ADULT',	'zyan.ali1221@gmail.com',	'+92 3490907453',	NULL,	NULL,	'2032-05-05 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('c08da0f4-50a4-442c-ac2b-05aa148b1b60',	'951259e2-8ec8-4a9c-8b55-be727e3e1885',	'MR',	'ABDUL WAHAB',	'KHAN',	NULL,	'ADULT',	'zain@terrifictravel.co.uk',	'+3490907453',	NULL,	NULL,	'2033-07-25 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('ab8d2ebc-ca49-4a23-af00-a1c62125ea9e',	'73eab461-94a8-47c6-913f-7eaa439426f5',	'Mr',	'Moneek',	'Shabir',	NULL,	'Adult',	'sana.mahmood@hotmail.com',	'+44 7814 818090',	NULL,	NULL,	'2034-10-10 23:00:00',	NULL,	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('6dc01748-5100-4b41-babd-6dd7547cd9f4',	'73eab461-94a8-47c6-913f-7eaa439426f5',	'Mrs',	'Sana',	'Mahmood',	NULL,	'Adult',	'sana.mahmood@hotmail.com',	'+44 7814 818090',	NULL,	NULL,	'2034-04-08 23:00:00',	NULL,	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('36796721-63ce-4d13-8936-b926b4e73bc7',	'c297180e-838b-4604-a79a-0fe024ee7d4e',	'MR',	'JAHANGIR ALI',	'AYYAZ',	NULL,	'ADULT',	'zain@terrifictravel.co.uk',	NULL,	NULL,	NULL,	'2033-07-25 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('caab10d8-b3ce-41e5-9fdb-7f9069da1f12',	'13f9b680-5767-4616-ab5d-a40280b79890',	'MR',	'ISHTIAQ',	'AHMAD',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	NULL,	NULL,	NULL,	'2031-07-15 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Leader',	NULL,	NULL,	NULL,	'1',	'0'),
('50aeab84-570a-4b3a-9335-c6d80809dda3',	'13f9b680-5767-4616-ab5d-a40280b79890',	'MISS',	'KHADIJA',	'BEGUM',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	NULL,	NULL,	NULL,	'2028-06-14 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('fafb4be4-bf2e-40e9-aed7-8a4984a48fc0',	'13f9b680-5767-4616-ab5d-a40280b79890',	'MR',	'JAVED',	'IQBAL',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	NULL,	NULL,	NULL,	'2030-06-11 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('056143e5-35e5-482e-9623-7970878243fc',	'13f9b680-5767-4616-ab5d-a40280b79890',	'MISS',	'SAIMA',	'BEGUM',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	NULL,	NULL,	NULL,	'2027-06-22 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('b09c98f4-a46b-4524-ba3a-087c38ece2c7',	'13f9b680-5767-4616-ab5d-a40280b79890',	'MISS',	'KALSOOM',	'PARVEEN',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	NULL,	NULL,	NULL,	'2029-05-30 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0'),
('202ce938-7f17-4f08-80c1-0c77d0db6d21',	'13f9b680-5767-4616-ab5d-a40280b79890',	'MR',	'SIDRA',	'PARVEEN',	NULL,	'ADULT',	'Ayaz13801@gmail.com',	NULL,	NULL,	NULL,	'2029-06-06 23:00:00',	NULL,	'1e85f3e9-37fc-4704-8650-ce423408044e',	'Family Member',	NULL,	NULL,	NULL,	'1',	'0');

DROP TABLE IF EXISTS "PassengerDocument";
CREATE TABLE "public"."PassengerDocument" (
    "id" text NOT NULL,
    "passengerId" text NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "fileKey" text,
    "fileName" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "PassengerDocument_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


DROP TABLE IF EXISTS "Payment";
CREATE TABLE "public"."Payment" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "amount" double precision NOT NULL,
    "status" "PaymentStatus" DEFAULT PENDING NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "transactionId" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Payment_transactionId_key" ON public."Payment" USING btree ("transactionId");

INSERT INTO "Payment" ("id", "bookingId", "amount", "status", "provider", "transactionId", "createdAt", "updatedAt") VALUES
('8f48dfbc-e996-4e77-9f0e-cb3d4f79ed70',	'32ba5865-c826-4c7c-b4c7-33537b639330',	1260,	'SUCCESS',	'MANUAL',	'manual_tx_1782489589695_o1ik',	'2026-06-26 00:00:00',	'2026-06-26 15:59:49.697'),
('71358dc2-a0c1-4c86-bb1b-37b3acad142f',	'28226c92-d76d-4cfb-ba4c-31f17208dfb9',	20,	'SUCCESS',	'MANUAL',	'manual_tx_1782514078479_k6xx',	'2026-06-27 00:00:00',	'2026-06-26 22:47:58.481'),
('e6e2a7c2-ca06-4d07-bab0-3752c0018a75',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	40,	'SUCCESS',	'MANUAL',	'manual_tx_1782760231920_utam',	'2026-06-29 00:00:00',	'2026-06-29 19:10:31.925'),
('fec8f7e9-632a-4be5-8426-08f6d347fc0d',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	507,	'SUCCESS',	'MANUAL',	'manual_tx_1782832546893_zwdz',	'2026-06-30 00:00:00',	'2026-06-30 15:15:46.895'),
('c47070a8-2760-4ccd-b5a5-bdc8cf17f42f',	'2cc7284b-affa-4eec-9a56-af93962c223b',	20,	'SUCCESS',	'MANUAL',	'manual_tx_1782837843742_j3r5',	'2026-06-30 00:00:00',	'2026-06-30 16:44:03.794'),
('22386754-1a18-4c84-a8ea-adc38cc5f27d',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	600,	'SUCCESS',	'MANUAL',	'manual_tx_1782913058508_5w1d',	'2026-07-01 00:00:00',	'2026-07-01 13:37:38.51'),
('fdb43620-e14d-4edb-8c3a-a50b39387242',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	1000,	'SUCCESS',	'MANUAL',	'manual_tx_1782913060990_u5lm',	'2026-07-01 00:00:00',	'2026-07-01 13:37:40.991'),
('68d278ef-8b6b-46e6-bf4c-a4c6dd4dd389',	'575da188-44f7-467b-83a6-ee1cbb5b2797',	625,	'SUCCESS',	'MANUAL',	'manual_tx_1782913068580_mmxq',	'2026-07-01 00:00:00',	'2026-07-01 13:37:48.582'),
('7ce1cfff-07a4-4948-a8df-31b12ea3c95c',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	928,	'SUCCESS',	'MANUAL',	'manual_tx_1782913247443_vct4',	'2026-06-29 00:00:00',	'2026-07-01 13:40:47.444'),
('a7956863-97c1-4de4-af4c-917744d37eb2',	'5e668417-02ad-40c0-8c73-723257ee4349',	40,	'SUCCESS',	'MANUAL',	'manual_tx_1782927180668_05pv',	'2026-07-01 00:00:00',	'2026-07-01 17:33:00.669'),
('85550a1e-10db-4d81-8c87-0bb4f96fc01f',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	20,	'SUCCESS',	'MANUAL',	'manual_tx_1782936832721_kg22',	'2026-07-02 00:00:00',	'2026-07-01 20:13:52.723'),
('46f8bfba-1b5f-4746-b7af-4c5c904bfb4d',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	1000,	'SUCCESS',	'MANUAL',	'manual_tx_1782936834838_es2m',	'2026-07-02 00:00:00',	'2026-07-01 20:13:54.84'),
('ebd9f584-78d8-46e9-b221-5dff679010b9',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	1500,	'SUCCESS',	'MANUAL',	'manual_tx_1782993326303_0nkk',	'2026-07-01 00:00:00',	'2026-07-02 11:55:26.306'),
('560a4353-ef19-4060-9527-baf477479650',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	2500,	'SUCCESS',	'MANUAL',	'manual_tx_1783005692545_jwdv',	'2026-01-09 00:00:00',	'2026-07-02 15:21:32.547'),
('d0534b52-dd40-4678-a4ef-81076ac52d16',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	1000,	'SUCCESS',	'MANUAL',	'manual_tx_1783005716792_25yi',	'2026-02-13 00:00:00',	'2026-07-02 15:21:56.795'),
('6e586418-096f-4451-8538-ea034509574f',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	800,	'SUCCESS',	'MANUAL',	'manual_tx_1783005735070_nnvu',	'2026-03-26 00:00:00',	'2026-07-02 15:22:15.071'),
('c209370f-15d0-4f9f-81b0-f882e245bb5b',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	500,	'SUCCESS',	'MANUAL',	'manual_tx_1783005776806_ob01',	'2026-05-09 00:00:00',	'2026-07-02 15:22:56.807'),
('62ab9988-7ec5-4cac-98bb-6e6d6a35acda',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	1400,	'SUCCESS',	'MANUAL',	'manual_tx_1783005798025_9ezd',	'2026-05-31 00:00:00',	'2026-07-02 15:23:18.026'),
('cc9e45f1-7b39-4ab0-a87e-2f7a83502048',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	300,	'SUCCESS',	'MANUAL',	'manual_tx_1783005819424_59x6',	'2026-06-01 00:00:00',	'2026-07-02 15:23:39.425'),
('2471af68-29a6-476d-97c4-fa65a5c13966',	'50a38298-9eb0-4018-a854-639091dbe9b3',	1040,	'SUCCESS',	'MANUAL',	'manual_tx_1783007308437_rak3',	'2026-07-02 00:00:00',	'2026-07-02 15:48:28.438'),
('4b1ef240-fc6e-49b9-a70f-3ff57c5d53d8',	'50a38298-9eb0-4018-a854-639091dbe9b3',	98,	'SUCCESS',	'MANUAL',	'manual_tx_1783007320624_00hk',	'2026-07-01 00:00:00',	'2026-07-02 15:48:40.625'),
('aa4d513d-0d5b-4ff3-b3f2-430ced22f2ad',	'10d1d925-f85f-499f-9de5-feec5b465c44',	1000,	'SUCCESS',	'MANUAL',	'manual_tx_1783014459175_d96u',	'2026-07-02 00:00:00',	'2026-07-02 17:47:39.177'),
('fb93fb2d-9c11-4687-a625-33d59f6e6d7f',	'78871a43-43e5-46e2-b96c-8db80a1de236',	550,	'SUCCESS',	'MANUAL',	'manual_tx_1783080387228_ck6q',	'2026-06-20 00:00:00',	'2026-07-03 12:06:27.23'),
('45a54927-36bf-41c4-9a3f-c05d38a99f21',	'78871a43-43e5-46e2-b96c-8db80a1de236',	180,	'SUCCESS',	'MANUAL',	'manual_tx_1783080407044_vd8q',	'2026-06-29 00:00:00',	'2026-07-03 12:06:47.045');

DROP TABLE IF EXISTS "PaymentRequest";
CREATE TABLE "public"."PaymentRequest" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "type" text NOT NULL,
    "amount" double precision NOT NULL,
    "paymentMethod" text NOT NULL,
    "receiptUrl" text NOT NULL,
    "notes" text,
    "bankAccount" text,
    "vendorId" text,
    "cardPaymentCharges" double precision,
    "isPaidByCompany" boolean,
    "transactionDate" timestamp(3),
    "status" text DEFAULT 'PENDING' NOT NULL,
    "rejectionReason" text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reviewedById" text,
    "reviewedAt" timestamp(3),
    CONSTRAINT "PaymentRequest_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "PaymentRequest" ("id", "bookingId", "type", "amount", "paymentMethod", "receiptUrl", "notes", "bankAccount", "vendorId", "cardPaymentCharges", "isPaidByCompany", "transactionDate", "status", "rejectionReason", "createdById", "createdAt", "reviewedById", "reviewedAt") VALUES
('bfadbf5b-3b2e-4f09-b776-486ab7341a34',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'CUSTOMER_PAYMENT',	600,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1782910708254-aftabbbb.png',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782910708254-aftabbbb.png',	'',	NULL,	NULL,	NULL,	'2026-07-01 00:00:00',	'APPROVED',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 12:58:32.534',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 13:37:38.566'),
('5ffc8a6d-9b06-47cb-952a-9b1560a9f311',	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'CUSTOMER_PAYMENT',	1000,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1782910767024-aftabbshjsh.png',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782910767024-aftabbshjsh.png',	'',	NULL,	NULL,	NULL,	'2026-07-01 00:00:00',	'APPROVED',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 12:59:31.551',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 13:37:41.026'),
('75360882-85bf-4b4e-bdd7-f9c9b8c9dfad',	'575da188-44f7-467b-83a6-ee1cbb5b2797',	'CUSTOMER_PAYMENT',	625,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1782902326576-WhatsApp Image 2026-06-02 at 19.00.03.jpeg',	'He paid £625 via bank transfer and remaining £150 into our office. Receipt: https://cdn.terrifictravel.co.uk/users/1782902326576-WhatsApp Image 2026-06-02 at 19.00.03.jpeg',	'HSBC Transfer',	NULL,	NULL,	NULL,	'2026-07-01 00:00:00',	'APPROVED',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-01 10:40:00.23',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 13:37:48.616'),
('d87b94e8-0fb0-47c8-af5d-c57c58dccf63',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	'CUSTOMER_PAYMENT',	928,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1782913232700-WhatsApp Image 2026-06-29 at 19.23.34.jpeg',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782913232700-WhatsApp Image 2026-06-29 at 19.23.34.jpeg',	'LLoyds',	NULL,	NULL,	NULL,	'2026-06-29 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 13:40:47.408',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 13:40:47.695'),
('08439fe6-5d4f-4e6d-8ec6-c936961dc494',	'5e668417-02ad-40c0-8c73-723257ee4349',	'CUSTOMER_PAYMENT',	40,	'Bank Transfer',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-07-01 00:00:00',	'APPROVED',	NULL,	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-01 14:45:24.712',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 17:33:00.884'),
('6b24d340-3a81-4986-9fb8-85d2f3c770a5',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'CUSTOMER_PAYMENT',	20,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1782936706907-payment 2.jpeg',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782936706907-payment 2.jpeg',	'',	NULL,	NULL,	NULL,	'2026-07-02 00:00:00',	'APPROVED',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 20:11:51.041',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 20:13:52.771'),
('57b1a40b-6fce-41f5-bf85-9d009fd10f4b',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'CUSTOMER_PAYMENT',	1000,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1782936727318-payment 1 .jpeg',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782936727318-payment 1 .jpeg',	'',	NULL,	NULL,	NULL,	'2026-07-02 00:00:00',	'APPROVED',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 20:12:09.785',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 20:13:54.871'),
('701a1a76-6e8a-46ec-8924-446966c8a473',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'CUSTOMER_PAYMENT',	1500,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1782993040897-WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782993040897-WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'',	NULL,	NULL,	NULL,	'2026-07-01 00:00:00',	'REJECTED',	'double payment',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 11:50:59.721',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 11:54:09.357'),
('1ca0e923-a813-4e52-9156-916beff4f67f',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'CUSTOMER_PAYMENT',	1500,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1782993092146-WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'Receipt: https://cdn.terrifictravel.co.uk/users/1782993092146-WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'',	NULL,	NULL,	NULL,	'2026-07-01 00:00:00',	'APPROVED',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 11:52:15.633',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 11:55:26.38'),
('663f661f-3920-40f6-8c28-191f7628a839',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'CUSTOMER_PAYMENT',	2500,	'Cash',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-01-09 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:21:32.492',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:21:32.593'),
('e9a9c33c-a1c8-4b3c-bec5-1e6d4f0f9aef',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'CUSTOMER_PAYMENT',	1000,	'Cash',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-02-13 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:21:56.759',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:21:56.87'),
('1b8512fb-1dd9-49ce-8d1f-cf9a567d19e3',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'CUSTOMER_PAYMENT',	800,	'Cash',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-03-26 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:22:15.021',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:22:15.109'),
('72d2de80-70fd-411e-890b-8debe5f2a0a0',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'CUSTOMER_PAYMENT',	500,	'Cash',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-05-09 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:22:56.773',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:22:56.846'),
('ce42e436-94f1-431a-833b-9b746f1d4b1c',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'CUSTOMER_PAYMENT',	1400,	'Cash',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-05-31 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:23:17.984',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:23:18.066'),
('430ed08d-70ce-4378-8e25-ad660cd4d00e',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'CUSTOMER_PAYMENT',	300,	'Cash',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-06-01 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:23:39.391',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:23:39.475'),
('ee38e89c-c88d-46e1-aac2-28c962127771',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'CUSTOMER_PAYMENT',	1138,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1783006068425-saif paymetn.png',	'Receipt: https://cdn.terrifictravel.co.uk/users/1783006068425-saif paymetn.png',	'',	NULL,	NULL,	NULL,	'2026-07-02 00:00:00',	'REJECTED',	'wrong amount ',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 15:28:06.148',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:47:44.462'),
('c1d1b828-75ed-4082-aea8-87051de575b5',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'CUSTOMER_PAYMENT',	1040,	'Bank Transfer',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-07-02 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:48:28.396',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:48:28.498'),
('c226cd01-20c5-46c6-8a13-45adfb6c0495',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'CUSTOMER_PAYMENT',	98,	'Bank Transfer',	'',	'',	'',	NULL,	NULL,	NULL,	'2026-07-01 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:48:40.579',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:48:40.688'),
('c1edb00d-3c65-44af-983e-af4a08946320',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'CUSTOMER_PAYMENT',	1000,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1783013726508-Alishbah booking.png',	'Receipt: https://cdn.terrifictravel.co.uk/users/1783013726508-Alishbah booking.png',	'',	NULL,	NULL,	NULL,	'2026-07-02 00:00:00',	'APPROVED',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 17:35:31.463',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 17:47:39.221'),
('bb27de5c-7c79-40f2-8876-858bf381af29',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'CUSTOMER_PAYMENT',	730,	'Bank Transfer',	'https://cdn.terrifictravel.co.uk/users/1783017344768-Maham;;s receipt.png',	'Receipt: https://cdn.terrifictravel.co.uk/users/1783017344768-Maham;;s receipt.png',	'',	NULL,	NULL,	NULL,	'2026-07-02 00:00:00',	'REJECTED',	'wrong payment',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 18:35:53.273',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 12:05:50.019'),
('2ab8b1dc-cdc7-4e67-aa91-30fb5bc3feb3',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'CUSTOMER_PAYMENT',	550,	'Bank Transfer',	'',	'',	'Llloyds',	NULL,	NULL,	NULL,	'2026-06-20 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 12:06:27.198',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 12:06:27.267'),
('327a42a6-692e-48db-8b4e-e9be95e531b9',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'CUSTOMER_PAYMENT',	180,	'Bank Transfer',	'',	'',	'LLoyds',	NULL,	NULL,	NULL,	'2026-06-29 00:00:00',	'APPROVED',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 12:06:47.013',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 12:06:47.089');

DROP TABLE IF EXISTS "Permission";
CREATE TABLE "public"."Permission" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Permission_name_key" ON public."Permission" USING btree (name);

INSERT INTO "Permission" ("id", "name", "description") VALUES
('3042414f-1a22-4b8f-8611-9b18de47b74a',	'users:read',	'Read users'),
('4bf7ae11-b31f-414b-b54b-d310c3ca3c4e',	'users:write',	'Manage users'),
('8447b19b-54de-4846-81a7-cfb2a1db2e83',	'flights:read',	'View flights'),
('9bccd15c-c3db-4bbd-a31d-ae969624d63f',	'flights:write',	'Manage flights'),
('ac4968de-e84d-4986-bbda-42b20222c902',	'hotels:read',	'View hotels'),
('ca922e5b-161f-4803-94f6-92f92f60b736',	'hotels:write',	'Manage hotels'),
('12f92156-b26c-46db-a0a5-f39352810702',	'tours:read',	'View tours'),
('ed22f612-d4b2-48ba-b7f9-7c4ad4091d0e',	'tours:write',	'Manage tours'),
('448fbea7-ce51-46ae-8ae0-cbdfde56fe30',	'bookings:write',	'Create bookings'),
('69a756da-7c51-412a-9b04-afd2dc206935',	'payments:read',	'View transactions'),
('ff0ba5fe-3e2e-4434-aa16-2ea910d77231',	'payments:write',	'Checkout bookings'),
('bd4a0800-9e0f-475e-b2ee-9366061108ce',	'reports:read',	'View analytics'),
('b20deb66-4b09-4712-b2e3-4a22ac7e621d',	'roles:assign',	'Assign roles'),
('e15e79aa-a58d-432f-a2de-0ab55d175832',	'permissions:manage',	'Manage permissions'),
('342af2e8-a184-4c57-9168-83a8e40e5712',	'settings:manage',	'Full system settings access'),
('632ecb35-f629-4c09-bb29-e5ada3038eaa',	'bookings:read',	'View all bookings'),
('b987414c-2d6e-4e2e-af62-bbb84abb0dcf',	'bookings:create',	'Create bookings'),
('4b157283-6936-4331-a59d-579b1860a6e8',	'bookings:edit_any',	'Edit any booking'),
('dac59677-99a6-4860-ab18-a8249ef9ad0e',	'bookings:edit_own',	'Edit own booking'),
('e863060e-420e-4fbd-8c89-b12f9db62fe6',	'bookings:delete',	'Delete booking (soft-delete/archive)'),
('e04bc163-f11b-4990-9bef-2f059c863ed9',	'invoices:read',	'View all invoices'),
('2ceb9b53-9036-4352-bc2a-e03d6e36f0af',	'invoices:edit',	'Edit invoices'),
('21eb0930-5b76-40c6-b4a7-7024b8789403',	'invoices:delete',	'Delete invoices (soft-delete/archive)'),
('84daa03b-b6e8-4344-ac87-3dca183030bf',	'invoices:download',	'Download invoices'),
('f04449ce-3b3c-4c63-9fe0-149ec1f5cc98',	'invoices:print',	'Print invoices'),
('d8b2e2e4-5f91-4ae5-8091-8125a3a6407d',	'customers:read',	'View customers'),
('9cda2327-bb7a-490b-a769-c1803a5cc917',	'customers:create',	'Create customers'),
('7e32008f-a50b-424b-b215-e0acf13597df',	'customers:edit',	'Edit customers'),
('24d1b0b9-aa0f-4c30-8804-bf61e5065300',	'customers:delete',	'Delete customers (deactivate)'),
('f0d63ae6-42d6-4f49-bc42-aa440903dcd9',	'reports:read_all',	'View all company financial reports'),
('f3ca63ec-136e-4924-b9ca-e32053d465cd',	'reports:read_own',	'View personal performance reports'),
('7d25bfa9-5e95-4302-af8e-8ab5602e0b5b',	'users:manage',	'Create and edit users, reset passwords, activate/deactivate users');

DROP TABLE IF EXISTS "RefreshToken";
CREATE TABLE "public"."RefreshToken" (
    "id" text NOT NULL,
    "token" text NOT NULL,
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) NOT NULL,
    "isRevoked" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "RefreshToken_token_key" ON public."RefreshToken" USING btree (token);

INSERT INTO "RefreshToken" ("id", "token", "userId", "expiresAt", "isRevoked", "createdAt") VALUES
('a88e67ee-1614-44a0-983f-e91e411ca4bd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE4ODk2NTUsImV4cCI6MTc4MjQ5NDQ1NX0.fXaAFV5Uo6HIcRY4VcZ596i5jyKNzR4ZajEnjCCOWzQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 17:20:55.741',	'0',	'2026-06-19 17:20:55.743'),
('ce8ec904-202b-4add-8cee-9b9b3420d269',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE4ODkwMzEsImV4cCI6MTc4MjQ5MzgzMX0._yMHTW-aO3knmTmk89S_D9Q7DluUH1xi8YsS-qJCFTM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 17:10:31.689',	'1',	'2026-06-19 17:10:31.691'),
('f60bea25-45e8-4e57-9f15-274b288a5a8f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE4ODk5NzAsImV4cCI6MTc4MjQ5NDc3MH0.9egsZLHPt1BYcVAoYdmc79SNxS7guIf1-f6d7QuhVxg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 17:26:10.554',	'0',	'2026-06-19 17:26:10.556'),
('636c6a82-6d62-4d3e-bf35-703599fc3865',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE4ODk5NzEsImV4cCI6MTc4MjQ5NDc3MX0.uidZZgkAIn_Hz1ja4R29stDYFlBl47GtE7hx815Abts',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 17:26:11.804',	'1',	'2026-06-19 17:26:11.806'),
('73145eb7-256b-4533-82fc-417d3ef06350',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE4OTIwMjksImV4cCI6MTc4MjQ5NjgyOX0.2chwmrtzR-O86F77Zzjsitynru9L2IcvxqcSrIIk0vk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 18:00:29.927',	'0',	'2026-06-19 18:00:29.928'),
('99322aa0-665b-4b32-a332-213d78770fbf',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjEzODksImV4cCI6MTc4MzM2NjE4OX0.ByC7P1RetRmn9A5XJArGiavbroOTRjIcH8JV9V7Sqx0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 19:29:49.079',	'0',	'2026-06-29 19:29:49.081'),
('d44b4b36-7002-4bf5-a64f-f339c706cb9b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5NjY1MTIsImV4cCI6MTc4MjU3MTMxMn0.94Vs2hQIcGzat_sNliFIMRccKWOVx0ZLn-KjG9EHGwI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 14:41:52.376',	'1',	'2026-06-20 14:41:52.378'),
('1ea1e58c-b618-495f-a1f2-33bbd37ac763',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5MDQ4ODksImV4cCI6MTc4MjUwOTY4OX0.6mN5wFnM84IpYJjka-899NK5WFaOKIr0mnICp8L2LoE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 21:34:49.46',	'1',	'2026-06-19 21:34:49.462'),
('d6127959-893c-4e64-abbf-4340ea96d709',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5MDYwNTgsImV4cCI6MTc4MjUxMDg1OH0.3u-CHtOMnu3U-cSS-HBSiGTqLlHOqiEzjoizr2-pnbM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 21:54:18.511',	'0',	'2026-06-19 21:54:18.512'),
('9ecf3e90-b65a-4c71-b4e4-608069a64755',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4NDQwMDUsImV4cCI6MTc4MzQ0ODgwNX0.ayyaylzJ3l-FTGJsZrpY05je4DQCUY44VTrpt5tVatQ',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 18:26:45.593',	'0',	'2026-06-30 18:26:45.611'),
('0cac01cb-f604-44b7-abfc-3a4409e93150',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5NjE3ODYsImV4cCI6MTc4MjU2NjU4Nn0.kXQ4eQDLZr-lt1Ggn-Sdy7ThR7NykQMBJFwEQJhd5Rw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 13:23:06.28',	'1',	'2026-06-20 13:23:06.282'),
('8fedfb4a-3de1-4783-ba39-39a7a18c254a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5NjQ0NzcsImV4cCI6MTc4MjU2OTI3N30._sEXliCckK3PLPPAu6sSgsDxPJN3baOQoHx0Wef0DT4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 14:07:57.136',	'0',	'2026-06-20 14:07:57.137'),
('2c225c43-2cb7-4313-8df5-dc4b5c8f892b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4NDYxMDIsImV4cCI6MTc4MzQ1MDkwMn0.LiE076MKj3kT5CN2PuBwnPK3fbxL2jYD8OUyT2AhaJc',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 19:01:42.773',	'0',	'2026-06-30 19:01:42.779'),
('6ffd9525-864d-4b8e-a523-6a41fc5c694d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5Njc5ODEsImV4cCI6MTc4MjU3Mjc4MX0.S07gdMHlLs0D5p5emEqExMjZpstN76AYWxXTEckdM10',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 15:06:21.751',	'1',	'2026-06-20 15:06:21.753'),
('7fd75eb8-64e8-43e4-9098-0d545ff6b188',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5NjQ0NzksImV4cCI6MTc4MjU2OTI3OX0.0-e83BHMkUxxUhwyC9duSyq5Yh71GJFMHNh6hxoPXlA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 14:07:59.125',	'1',	'2026-06-20 14:07:59.126'),
('47617090-4ff4-4238-8f2f-e8d4fee52c4d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5NjYxMzEsImV4cCI6MTc4MjU3MDkzMX0.NoZZ3G5eldK6vzYLdOOGJhj1a1h1K6K6fQhdblkFSW0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 14:35:31.047',	'0',	'2026-06-20 14:35:31.048'),
('bd125336-50e9-4d4b-819f-7bcec2eed49d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5NzI2NjIsImV4cCI6MTc4MjU3NzQ2Mn0.8ix3bJ_BU_ET9NFutoTzEnWFWwPaKGAisVOX-dLOsPs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 16:24:22.677',	'1',	'2026-06-20 16:24:22.678'),
('8c148d20-45dc-4c67-be9d-c1f200b14750',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5NzQ3MDIsImV4cCI6MTc4MjU3OTUwMn0.qONeegloyQj2DgKyp3am-0JXN_vFFbY8ec69mEFj6-A',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 16:58:22.564',	'1',	'2026-06-20 16:58:22.566'),
('ca3d1cef-3262-464c-81c4-d577a11f6d31',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5Nzc0MDEsImV4cCI6MTc4MjU4MjIwMX0.4uh_LTXa6tJTaqN2mQfn4oSGd95pI1FyJIEz7k5Tw2s',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 17:43:21.621',	'1',	'2026-06-20 17:43:21.622'),
('f2b7a4cb-9446-4be6-8a9e-f7cb2603313b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5Nzk2ODEsImV4cCI6MTc4MjU4NDQ4MX0.PJcFPIZDdT6M5qSRZ3uOsxT4lwXDJ3MVnplWz9M1QV4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 18:21:21.628',	'1',	'2026-06-20 18:21:21.629'),
('791d6262-3be3-49f9-a9ec-2c800692089f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5ODMyODEsImV4cCI6MTc4MjU4ODA4MX0.KB-VXNAfa49ya6HmDvmkv12mRPWgSfobAeBBx_93BZg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 19:21:21.753',	'1',	'2026-06-20 19:21:21.755'),
('8356eaf1-8713-454f-9949-15b9e472bae3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5ODU2MjEsImV4cCI6MTc4MjU5MDQyMX0.EGm0wkw0--w4gJZxPS1aG6ELfrYwbmaEPrg8Y5EVGEo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 20:00:21.648',	'1',	'2026-06-20 20:00:21.654'),
('9129c1bc-a559-4cca-be4a-231358adc08b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5ODczNjEsImV4cCI6MTc4MjU5MjE2MX0.Z2OMpTjPWj97RwLDAWaeWnUSb7ZHvli_zPtcF71cNyQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 20:29:21.96',	'1',	'2026-06-20 20:29:21.962'),
('61ed8ac4-9674-4156-9953-3c4559d4c327',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5MDYwNjAsImV4cCI6MTc4MjUxMDg2MH0.idNAsLgCUOqgAPBmO5D7WdRoukVTahu1EZCLsw9bc0U',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 21:54:20.469',	'1',	'2026-06-19 21:54:20.471'),
('7b35fac4-daf9-40f9-8970-d0e826a1af0d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5ODkyMTIsImV4cCI6MTc4MjU5NDAxMn0.TgQeNv0Vq8v64OLdVnOCLGnjc8QMw8dEtMVhIvOF6Tg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 21:00:12.137',	'0',	'2026-06-20 21:00:12.14'),
('de0bb688-9254-49cf-b6b5-1f8ad9144c75',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5ODk0NjEsImV4cCI6MTc4MjU5NDI2MX0.aFTT11S4MoYC1-UdFYi9f4zp1Z2NM7ltlvqzma4SamY',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 21:04:21.694',	'1',	'2026-06-20 21:04:21.696'),
('4863ec35-544a-487f-a167-898f971c2d96',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5OTA3ODEsImV4cCI6MTc4MjU5NTU4MX0.6wfqetyRpdDiU2R9BSvLrusPxyCYI2wE-SMUVhirrbo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 21:26:21.785',	'1',	'2026-06-20 21:26:21.787'),
('8f683fee-15a1-4e5a-9e3e-e48e905dc829',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5OTIxNjEsImV4cCI6MTc4MjU5Njk2MX0.i6Zb46OHscM1Pv8xNLUeB2XsiG1O2ru5DR6e2SZvY9Q',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 21:49:21.947',	'1',	'2026-06-20 21:49:21.948'),
('0713b077-0516-411c-b9a7-ea7b76cce5dc',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5OTM1NDEsImV4cCI6MTc4MjU5ODM0MX0.uILo3HeuG3Q3G-1G-IRFPH1SXod6Oyc03IwhQ4OX_Sw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 22:12:21.707',	'1',	'2026-06-20 22:12:21.709'),
('7b9257c8-44bf-4ab7-9856-1c069465fbcd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5OTUwNDEsImV4cCI6MTc4MjU5OTg0MX0.qF-utfwfRHyehYc0UieGQfGNMSW1u4UFpcpIJ_EIEQ4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 22:37:21.71',	'1',	'2026-06-20 22:37:21.711'),
('adf5de66-2565-450a-89c1-9e2e0f94fdd6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5OTYyNDEsImV4cCI6MTc4MjYwMTA0MX0.g5ZLoq5x0yzUI2-TqRE8LtIMxr4wddSTUKZu3J9_n7c',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 22:57:21.734',	'1',	'2026-06-20 22:57:21.736'),
('b2a0beac-b415-4ef5-8574-1f098d1ef711',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODE5OTgzNDEsImV4cCI6MTc4MjYwMzE0MX0.x9bxn13bBmxkRbI-JF5fxdIx3MEsT5hFbyECZLZbr5o',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-27 23:32:21.786',	'1',	'2026-06-20 23:32:21.788'),
('412f884b-a87a-40c8-9b22-8442fd9b8b39',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMDE2NDEsImV4cCI6MTc4MjYwNjQ0MX0.F0fxY4Vr9JV33Vvwk_JDPUlh3s18CX1yVtP8hnMmeEA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 00:27:21.803',	'1',	'2026-06-21 00:27:21.804'),
('4b543fad-1969-4e42-a4a1-178ee613a047',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMDM2ODEsImV4cCI6MTc4MjYwODQ4MX0.cn0xfhYoyCd-QuUOWVAiaJqpptWWHxrKexxNFW3uh3I',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 01:01:21.943',	'1',	'2026-06-21 01:01:21.944'),
('3f5bc613-b540-4247-b8a4-63fb232842ba',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMDQ4MjEsImV4cCI6MTc4MjYwOTYyMX0.CReAPh5QEWd6c-zmmXj7pQcrqjtDWfjr_tP3-zCFKP0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 01:20:21.921',	'1',	'2026-06-21 01:20:21.922'),
('3166f29e-adb3-4ca0-98ae-148c0c10afa3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMDcxNjEsImV4cCI6MTc4MjYxMTk2MX0.VMk7Uw5TRciQzHB5mxrjQwqAtVya-NAtixke6FgGZUE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 01:59:21.785',	'1',	'2026-06-21 01:59:21.786'),
('6fb2578c-adff-4284-8cda-1014a8e2ab45',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMDkyNjEsImV4cCI6MTc4MjYxNDA2MX0.Ruj3Pi2Rqx6bvFoG65NP4B8jYWK_gRuofUWv6vozXZg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 02:34:21.844',	'1',	'2026-06-21 02:34:21.845'),
('c42aa89d-50fe-4cc7-8f42-b957ec6a1c0f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMTAyMjEsImV4cCI6MTc4MjYxNTAyMX0.AdnSMFvq9GWv-s2CjiTNanT3jQjhn0JM_zeEBT4V4Gk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 02:50:21.978',	'1',	'2026-06-21 02:50:21.979'),
('620dd0ec-f701-4118-922d-9f194c14d069',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMTIzODEsImV4cCI6MTc4MjYxNzE4MX0.VKVkr9Pswwqscd5-goBGZUX2AWeILP3mXG5EN3L3_v0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 03:26:21.925',	'1',	'2026-06-21 03:26:21.927'),
('32b9a10c-60c5-4b52-bfe4-a28cffcdf6dd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMTUyMDIsImV4cCI6MTc4MjYyMDAwMn0.GbZEC6ArkByVX4G2gnoMQEzBY_L_X0zjp_wbHEYWvhs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 04:13:22.325',	'1',	'2026-06-21 04:13:22.326'),
('696b01df-dc93-428f-af15-b8af41f36923',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMTY1MjEsImV4cCI6MTc4MjYyMTMyMX0.PHtWaDRe7zcJrgKvtUhRF5Y9w9s2fG6N89JuCc5nSP0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 04:35:21.902',	'1',	'2026-06-21 04:35:21.903'),
('d4b0790f-719c-4208-ade5-bc6d46cf1fa6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMTg1NjEsImV4cCI6MTc4MjYyMzM2MX0.vGluaflgrSd-zkzR29IAs_lUP1B5lpbXmqKkhhXxDnA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 05:09:21.815',	'1',	'2026-06-21 05:09:21.816'),
('4d4d788a-8d0f-42fc-8bbb-c36a10220198',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMjA0ODEsImV4cCI6MTc4MjYyNTI4MX0.Q5Ta_E1L-iKmBeqKeKFnLB8fcdHM7Aip1Zt8r8-MGy4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 05:41:21.953',	'1',	'2026-06-21 05:41:21.954'),
('39881c4a-3648-4e49-86ac-ff3bdff8118b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMjI1MjEsImV4cCI6MTc4MjYyNzMyMX0.Sx-LGJkK1hplJQcGq0DvbGanMhpILaxbovByCG6i8DY',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 06:15:21.895',	'1',	'2026-06-21 06:15:21.896'),
('62f87c16-4ca6-4334-bf97-877f56cf55da',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMjM0ODEsImV4cCI6MTc4MjYyODI4MX0.adUSCCh6yspLuxFo23-vEKFKcnvZ2jofMGd35nIHSuM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 06:31:21.967',	'1',	'2026-06-21 06:31:21.971'),
('48030eac-74a9-4fb7-8b0a-f2faf5096e47',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMjU4ODEsImV4cCI6MTc4MjYzMDY4MX0.EsSL7IG_bcCKdByLKX9Zvla_4Lhm-q1FFo45ovTGAIo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 07:11:21.903',	'1',	'2026-06-21 07:11:21.906'),
('93da5cd3-6c32-4c4a-99be-e16512ccf1a9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMzE1MjMsImV4cCI6MTc4MjYzNjMyM30.a5sXtjD8-VM4Lmfx035ywsSjcP09Qmt5N3itDKq19RQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 08:45:23.605',	'1',	'2026-06-21 08:45:23.607'),
('e17ab259-e637-45cf-a9ef-be8d943ea872',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMzQ5NDMsImV4cCI6MTc4MjYzOTc0M30.jmY3C6wCwRR4bL2iIeXfRfKPhouuge9O-xDovcXLCNg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 09:42:23.454',	'1',	'2026-06-21 09:42:23.455'),
('fdfc962f-f09f-4ad3-ac16-ae132d0f0743',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3MzI1NTQsImV4cCI6MTc4MzMzNzM1NH0.tN2BLzhoDSP6eAA0_D1er7jzOW56AdjOMxlMM6JPBcw',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 11:29:14.267',	'0',	'2026-06-29 11:29:14.269'),
('56422c23-f647-4b2b-a6ba-261d9c71ba6a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMzYyNjEsImV4cCI6MTc4MjY0MTA2MX0.XIUFiDAQ69qoYXJdnzmiSEUdXF0XirHGFyJ64HSI2Xw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 10:04:21.926',	'1',	'2026-06-21 10:04:21.927'),
('fc894d0b-8017-4448-910d-263bfce04386',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMzcyMjEsImV4cCI6MTc4MjY0MjAyMX0.58QUIaHcUeWmww6xPf554Ajzf2qGhFTZmDDj9WaCNTk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 10:20:21.916',	'1',	'2026-06-21 10:20:21.918'),
('a0ee6fdb-6171-44a3-8880-cec7bd38bde7',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwMzk1MDIsImV4cCI6MTc4MjY0NDMwMn0.xFvtlQV5_437w6UZmIPY3y9YX3IpItdTwHnsGWF7Y1E',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 10:58:22.19',	'1',	'2026-06-21 10:58:22.191'),
('e02e91bc-4875-4551-b4a0-582b14219dc3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDEwOTgsImV4cCI6MTc4MjY0NTg5OH0.VHKHq6IN8qn62xewFyehmgki6RFmxW-BOwU6S3vCcyE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 11:24:58.308',	'0',	'2026-06-21 11:24:58.311'),
('6887e632-1308-4c22-950d-06fe0703c364',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDkxNjIsImV4cCI6MTc4MjY1Mzk2Mn0.Q9NUoXtU8J2nmtHIiHFio2AIPa4POlmlJ3ZmYnL6sBM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 13:39:22.167',	'1',	'2026-06-21 13:39:22.169'),
('e67de66c-454a-475b-a205-c54d31a9ecd3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDExNjIsImV4cCI6MTc4MjY0NTk2Mn0.hgpBKx7UvqmgPBSP20wE0COQs3uH9rZAro-dNZxwkuU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 11:26:02.261',	'1',	'2026-06-21 11:26:02.262'),
('7b884eb7-d8fd-4b57-9904-df923cf68537',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDIyNjEsImV4cCI6MTc4MjY0NzA2MX0.itDJ4fMrRciijoHuRG37piimGjYWXNpexwOc6SFeuWQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 11:44:21.953',	'0',	'2026-06-21 11:44:21.957'),
('41744523-3dbd-4588-900a-68413ba70589',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDA1ODEsImV4cCI6MTc4MjY0NTM4MX0.YAAbsoNGX7tf9-omiOF3PiqD0BJBrush5bR9krPHtXk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 11:16:21.929',	'1',	'2026-06-21 11:16:21.931'),
('84b7b86d-033e-4808-9d0f-b748ae51b67e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDI3NDMsImV4cCI6MTc4MjY0NzU0M30.TeOf2uO6BnxyDgAa3HH4Z6WtiotDPSH-c3qIdyvDqdA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 11:52:23.45',	'1',	'2026-06-21 11:52:23.452'),
('9680a7db-44d4-4908-9996-2e794d1f6160',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDM5NDIsImV4cCI6MTc4MjY0ODc0Mn0.dV2pE_uQJQFEyXtBybolL7huVPMgMwsxKnJ3vQebYFM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 12:12:22.722',	'1',	'2026-06-21 12:12:22.725'),
('982cd39c-2b32-4139-ab94-0e5676e9d38b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDU0NDIsImV4cCI6MTc4MjY1MDI0Mn0.oM4Qcz6Q4OgA_hKlZS3DgMKYnUk75JHO-lYPzcGEHjU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 12:37:22.25',	'1',	'2026-06-21 12:37:22.253'),
('90022438-638e-44dd-8691-da88605654a7',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNDY5NDIsImV4cCI6MTc4MjY1MTc0Mn0.1aRIwSpEN7UWe8mUO0OQedxAYDwHJa4ukLMkg-Tu9K4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 13:02:22.255',	'1',	'2026-06-21 13:02:22.256'),
('de11667d-afdf-451f-aacd-b51f6bc4f61b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNTA0ODIsImV4cCI6MTc4MjY1NTI4Mn0.Y9Sq7Oaws03BQxx2GmfR3w3LyoLtBUpdbZO134-eTn4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 14:01:22.472',	'1',	'2026-06-21 14:01:22.474'),
('0ea7f17b-b63a-4722-b699-7d5298e4be2e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNTEzODIsImV4cCI6MTc4MjY1NjE4Mn0.YWdGcRAOCo8wdRKb_PEo_SXEBnFWu11_mKIKUKKH_9c',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 14:16:22.262',	'1',	'2026-06-21 14:16:22.264'),
('baa5fbd0-6d66-4d1f-b934-0b03916dd280',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNTI1ODIsImV4cCI6MTc4MjY1NzM4Mn0.NcURnxVKHyXJRr9QETfovn2pQodpgbb_4KC3lxLteEA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 14:36:22.895',	'1',	'2026-06-21 14:36:22.897'),
('d4f1e2f6-2ece-43fc-be0b-e38f654fe788',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNTM3ODIsImV4cCI6MTc4MjY1ODU4Mn0.Xd0nhWZmymlNfyVQoYNd3BoWU-svmn1hWFyJhhh3sX0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 14:56:22.583',	'1',	'2026-06-21 14:56:22.585'),
('b6d6eef4-94e4-4ce8-8fbe-2ae0f53af98d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNTQ5MjIsImV4cCI6MTc4MjY1OTcyMn0.bIkkyko9Uvd6RJMMDzjcAR2BfVNyZZEKeluBU_Y_fMo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 15:15:22.587',	'1',	'2026-06-21 15:15:22.589'),
('e016529b-0704-41c8-be11-cbdeece00225',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNTYwNjIsImV4cCI6MTc4MjY2MDg2Mn0.DGsA-s4UB0URdO3da2MAUDB7-Wj68jlv1P9VDT9_lts',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 15:34:22.335',	'1',	'2026-06-21 15:34:22.337'),
('ac8b5635-ab8f-46eb-b157-7879139762f9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNTczODIsImV4cCI6MTc4MjY2MjE4Mn0.pJQCWzY8kd5V4PkeGWsMsRHhMiWcx2w9UACAMUPLccc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 15:56:22.498',	'1',	'2026-06-21 15:56:22.499'),
('ae1d49bd-6a11-4943-b02e-f9b275156392',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIwNTkwNTYsImV4cCI6MTc4MjY2Mzg1Nn0.yot81EzZrarh7PeA0Zt4aoB-jItQHjhQxYPtpa8pBAs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-28 16:24:16.033',	'0',	'2026-06-21 16:24:16.034'),
('76cd948b-07d3-40f6-bbb3-110a74da68eb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIyMjE2ODksImV4cCI6MTc4MjgyNjQ4OX0.4xXvAw0xslYWittEr8-CDW66HX1whbAhD-V9Pfk55S4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-30 13:34:49.358',	'0',	'2026-06-23 13:34:49.36'),
('6f70d068-4f32-49e8-99d0-8eff1259771a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIyMjMxNDYsImV4cCI6MTc4MjgyNzk0Nn0.Ck0neYQvuMi1iHE25gDAAbRIUsTVGJZI-AHUX3Ru9gg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-30 13:59:06.331',	'1',	'2026-06-23 13:59:06.335'),
('6ced529e-3bdb-4c4e-87c9-336824743e56',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIyMjQyMjMsImV4cCI6MTc4MjgyOTAyM30.BA1hT4xtZclCI1XjwayCp8niyEsg6iIHgbSdcHYuh-A',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-30 14:17:03.594',	'0',	'2026-06-23 14:17:03.599'),
('dc69d79b-ef2d-4c51-98da-d346c955ff6d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIyMzU4NzYsImV4cCI6MTc4Mjg0MDY3Nn0.sTtzD8--278KdKbrSsa_Yf2OUNTc0oDg6IqnvOmmgcI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-30 17:31:16.031',	'1',	'2026-06-23 17:31:16.033'),
('592ff52b-7b0e-4d38-a9b0-71dbfd31883c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIyMzY3NzgsImV4cCI6MTc4Mjg0MTU3OH0.9Xw-4P0jgAYq5-Z53zOm1sKetR-RovkwgJGC8-0aKqA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-30 17:46:18.537',	'1',	'2026-06-23 17:46:18.538'),
('0296ecc8-41f6-47c4-9052-47710a8f1836',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODIyMzgyNzcsImV4cCI6MTc4Mjg0MzA3N30.PnekLDMckicr_0nNWqIeODAngzpbTVzRbYZBQNc7wP0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-30 18:11:17.113',	'0',	'2026-06-23 18:11:17.114'),
('0f6eaea2-9b06-4d9a-8fb0-d76b18d3d735',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0Nzg0MzUsImV4cCI6MTc4MzA4MzIzNX0.xvSW0PgOQNlkeTFrXJ99cl9Lgv0oIoEeREIqxykkkHc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 12:53:55.499',	'0',	'2026-06-26 12:53:55.501'),
('2b4d2ed2-f0cf-452a-9fb1-6c903071a978',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0Nzg2NzAsImV4cCI6MTc4MzA4MzQ3MH0.n1FITP4mFrXQWOkiJUREpoCzhaiPYcNMA2djoEqRv-E',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 12:57:50.897',	'0',	'2026-06-26 12:57:50.898'),
('74c5102f-fe17-4397-a035-af329f78eb53',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0Nzk4NTQsImV4cCI6MTc4MzA4NDY1NH0.R0aRYk4P1442POLAO5QtgtVCI3_v-RGASdvsjsElSDg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:17:34.171',	'0',	'2026-06-26 13:17:34.173'),
('52dbeb5b-07ae-4ba8-ad64-b4303b652a1f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0Nzg4ODYsImV4cCI6MTc4MzA4MzY4Nn0.YD4Hdz1VrgaJWKY3ZkwwCvLPE26kw0R5AqdciAv-vZ0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:01:26.759',	'1',	'2026-06-26 13:01:26.768'),
('826be845-fdc1-498f-b5cc-51aabe3192b8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI3Mzk3MDYsImV4cCI6MTc4MzM0NDUwNn0.qq90lRQsddDvfZGbtmB7wKjHXBdV0lQBypluoOy4P20',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-06 13:28:26.011',	'1',	'2026-06-29 13:28:26.016'),
('3b967c53-0980-47d4-825e-55e84a8981ce',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0Nzk4NTYsImV4cCI6MTc4MzA4NDY1Nn0.GYpaxohCxLW4NOFsVU3_0ZjhLCHkttrJzpUkBmGbMoM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:17:36.279',	'0',	'2026-06-26 13:17:36.281'),
('ea93bd1b-2f89-4acf-b22a-072096d05bbd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0Nzk4NjksImV4cCI6MTc4MzA4NDY2OX0.2tmMVjRfGVPGRjo35yyA1PzHFrKdaREX1vbezb2wDBc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:17:49.452',	'0',	'2026-06-26 13:17:49.455'),
('0b42f92b-398e-4fee-abc2-ce35d208c487',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzcwNjEsImV4cCI6MTc4MzM0MTg2MX0.DF0yBssGeia3BYAGiSyb3JL1CUPvuos6zlVTNs9zaxQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 12:44:21.906',	'1',	'2026-06-29 12:44:21.907'),
('5d83eb29-a1b6-4625-9df8-fc8d0e8c403a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI0ODM4NTcsImV4cCI6MTc4MzA4ODY1N30.k4EXooIn4ERmchw8O5hCTjLLsTFbLkF2-pJQHc3I3jc',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-03 14:24:17.681',	'1',	'2026-06-26 14:24:17.682'),
('2a64dd35-fae9-4bb2-ab8b-136ffa4c5a1c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODIyNzgsImV4cCI6MTc4MzA4NzA3OH0.QZwoaRZeCbxjYHxvcG0Ae_BwFYL0Dt1hkz_j1ydsCXA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:57:58.068',	'0',	'2026-06-26 13:57:58.069'),
('e00b1eb4-3dcd-4456-a60d-adec386be3c3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0NzkwODUsImV4cCI6MTc4MzA4Mzg4NX0.6DdRyZHJKvpLy-4tfWDGSML_WewqqIpzyGACnlE9Co4',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 13:04:45.042',	'1',	'2026-06-26 13:04:45.043'),
('b5adaef7-8756-4a2f-8fad-049b3b74ca6c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0ODE1NTMsImV4cCI6MTc4MzA4NjM1M30.X0sG-4F-9iu34saVQsJGKGesQOHIVnsWaljtLNQh07Q',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 13:45:53.398',	'0',	'2026-06-26 13:45:53.399'),
('4006ee3d-7c68-4da9-af16-af10e2f78550',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzkyMTAsImV4cCI6MTc4MzM0NDAxMH0.Tk50x5St-Q0wV4MT_nq16ZKsENDE3E5XPvUYG-PLyxI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 13:20:10.834',	'0',	'2026-06-29 13:20:10.844'),
('cd5d2a49-b684-4141-87c8-f1ecba37c5c0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODE2MDEsImV4cCI6MTc4MzA4NjQwMX0.AtQDgc-XH85Ov4D9qEWdiv21YOr-razCHhlU_Kr3fpw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:46:41.52',	'1',	'2026-06-26 13:46:41.522'),
('2478ebc2-eb81-422a-ba9d-796e36512014',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODExNjAsImV4cCI6MTc4MzA4NTk2MH0.pGqWztQ1lR9N5ws3mpHi_W4CxSDwb9Qdrh0eqpAKU4s',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:39:20.704',	'1',	'2026-06-26 13:39:20.706'),
('82d2a65b-a39d-477d-8156-7502ee818cd1',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODI3ODYsImV4cCI6MTc4MzA4NzU4Nn0.RHJkgMugXLuVdsLxTKc31Vpp4XJoVQK9pUdDIQhYAr8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 14:06:26.47',	'0',	'2026-06-26 14:06:26.472'),
('ec0ab36a-816d-4896-9d5e-437aee123f78',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODMzOTQsImV4cCI6MTc4MzA4ODE5NH0.29IhZD5YJE41oLKyJ1u91nwaR-w83UZi6XABmaEC6j8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 14:16:34.623',	'1',	'2026-06-26 14:16:34.624'),
('c5bb3771-797a-475a-9d40-43d9afece19a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI0ODUyMTYsImV4cCI6MTc4MzA5MDAxNn0.UmOGtEa0c5hmMzH2iQDZe2LvUxJRBiQlp-th3nNklUc',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-03 14:46:56.699',	'0',	'2026-06-26 14:46:56.7'),
('37bc5526-8070-4e60-98c7-afe7f6c9d3dd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODUyNDYsImV4cCI6MTc4MzA5MDA0Nn0.O5TL6zm0qPU4KSE5-GiYPT4yBR0KCzPZe-zYijSQSeE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 14:47:26.668',	'0',	'2026-06-26 14:47:26.669'),
('b0d42c65-1aa6-47ac-b98a-75bb63e78941',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODQzMDksImV4cCI6MTc4MzA4OTEwOX0.50uoNXettV_1Hy7WTAubw3qo4UjbFcnTcBWjL_Eequs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 14:31:49.558',	'1',	'2026-06-26 14:31:49.56'),
('9637663a-3048-49a9-bd69-78f4bfebb73a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzIwODMsImV4cCI6MTc4MzMzNjg4M30.RDywbMVTlOHrJjQ_Pp1sLOMXVtj_iZRbVa2Vg547Dw8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 11:21:23.413',	'1',	'2026-06-29 11:21:23.416'),
('1fcf1002-190b-4f39-9035-55a676e74e84',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODU0MjksImV4cCI6MTc4MzA5MDIyOX0.AwFgYvE3SVPsrIt4QvM9gaNndG8CNpisCJ1KvnrKk4s',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 14:50:29.287',	'1',	'2026-06-26 14:50:29.288'),
('cc729fc2-8812-4bf9-9a57-686c21b10e4c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjE1MjIsImV4cCI6MTc4MzM2NjMyMn0.i4f5ASfyVDKFtATeR0hErPikH4sYHW8jGCd6bbKTbjc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 19:32:02.401',	'0',	'2026-06-29 19:32:02.403'),
('6cbfe191-7eeb-4bf0-aea6-1e02897ca9f6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzgwNjUsImV4cCI6MTc4MzM0Mjg2NX0._MPc-WX8qPe15WT4qh6qusIKKzbpXaj1YWSWNsihaKU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 13:01:05.739',	'0',	'2026-06-29 13:01:05.741'),
('84075ff9-a9fc-4fdf-bf17-b02b7a08e11f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjUyODMsImV4cCI6MTc4MzM3MDA4M30.0Hdyadr2nZMVfW8AdMAXHLr36mFxeNd0Tj94PVnlF4I',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:34:43.6',	'0',	'2026-06-29 20:34:43.603'),
('0af149f3-5ecb-44ef-a0ef-b45b13c8ce6a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjEzOTAsImV4cCI6MTc4MzM2NjE5MH0.CpJqxzoltrJXvX2Jk17kUNVJjx3jMe_aSlqeVf6oxY4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 19:29:50.555',	'1',	'2026-06-29 19:29:50.558'),
('0bc8e286-3384-4fdf-816b-5ff6f9a62624',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3Mzg0NjksImV4cCI6MTc4MzM0MzI2OX0.9763wKcy_pZR1rROKkQz7iODxjukGLBOG2bEoAj9DiA',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 13:07:49.232',	'1',	'2026-06-29 13:07:49.233'),
('937358c3-1a0e-4b85-9531-3a795137401f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDA2MjQsImV4cCI6MTc4MzM0NTQyNH0.QXDoBa6JKzSEqAOdV-D_4hDG8HJgYSjxNwWrxZJGDwg',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 13:43:44.132',	'0',	'2026-06-29 13:43:44.133'),
('0ac750d1-6996-401b-8d94-8b695f5e26f3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzgxNzEsImV4cCI6MTc4MzM0Mjk3MX0.7rQCSd6h4qPtFK_0HJwkCm9c6HDLPwDBC0rIqx5_IvY',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 13:02:51.483',	'1',	'2026-06-29 13:02:51.489'),
('8089f32a-1df8-4f50-aa47-bb07f114b460',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI3Mzg5MzYsImV4cCI6MTc4MzM0MzczNn0.vC3MDmYj6cXBYySNtIb1_K6NYiIdfdJhAQgO8jGEETo',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-06 13:15:36.819',	'1',	'2026-06-29 13:15:36.82'),
('0d2faf9a-d5a8-43f3-b9d0-ae04e4b594ee',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI3Mzk5MTQsImV4cCI6MTc4MzM0NDcxNH0.FyGB0pP6vd2wPmnwdv685itP2BFBcJSboKhucWe-C4w',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-06 13:31:54.574',	'0',	'2026-06-29 13:31:54.575'),
('1c9505e0-4c61-4aba-a4f0-4da9c15785da',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTEwNjYsImV4cCI6MTc4MzA5NTg2Nn0.EkPdXmSfuw8AbWdKF3vk-CKmKQa5sh3kSVFV7FhMwEk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 16:24:26.195',	'1',	'2026-06-26 16:24:26.197'),
('0410529d-dc9e-4828-af45-784ab0f7df1e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4OTk0MTksImV4cCI6MTc4MzUwNDIxOX0.NoqcqYC2g3-NavQELZpml0Iw9OWXfYPA0a2TUJTqBRg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 09:50:19.952',	'0',	'2026-07-01 09:50:19.955'),
('19e3ad0a-0f47-4b68-a87b-e1403eb1eb9c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDEzNjMsImV4cCI6MTc4MzM0NjE2M30.C71uN3HbWI7SzWLBhHb2Y6_4dkZL1McfVeyBsGBBnyA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 13:56:03.032',	'0',	'2026-06-29 13:56:03.048'),
('8bae5cb9-e0a7-452a-91a7-65b3d873f7c1',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MDEzNTUsImV4cCI6MTc4MzUwNjE1NX0.OAuLDUXNZnX_U-pp1cAnO1hecdhSaGIwfrpIypWbX7s',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 10:22:35.62',	'0',	'2026-07-01 10:22:35.622'),
('5efcb4c4-47fc-420a-ac28-393b258618c1',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDQ1NjAsImV4cCI6MTc4MzM0OTM2MH0.ifOHk3Qva3loPSyMnz0DU1o0oYqdbt4YLlDxEdjBKHQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 14:49:20.095',	'1',	'2026-06-29 14:49:20.097'),
('c6b38f3b-6fd1-4165-a911-4ef1e04d2ab4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDI1MDYsImV4cCI6MTc4MzM0NzMwNn0.YLUwEV_iq2QKn-NORAG83r9OmvRoz97xU_s8rq5rboo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 14:15:06.734',	'0',	'2026-06-29 14:15:06.736'),
('28c53ea1-d390-4b3f-8b85-8f8b09e1bf24',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI3NDIzNzgsImV4cCI6MTc4MzM0NzE3OH0.H4J0TXPeivyBXcQB7GbDGySp2qPzWRW0lWeLoa2OHGc',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-06 14:12:58.377',	'0',	'2026-06-29 14:12:58.381'),
('dd4fa208-f39d-4d4b-9d86-194637dbf791',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDEzNjQsImV4cCI6MTc4MzM0NjE2NH0.J-Y-bjc2rn10nxvgdKAWBqi856ge7nA5GuvOCIKj5U4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 13:56:04.443',	'1',	'2026-06-29 13:56:04.445'),
('66222c23-4fe1-497f-8a4b-be81fa4090d4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI3NDE0MjYsImV4cCI6MTc4MzM0NjIyNn0.-tdxiH9ELCJl_xFgtNBVTYIASlrekRn_h_mR2aO694U',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-06 13:57:06.537',	'1',	'2026-06-29 13:57:06.539'),
('e856f8cb-486d-4100-a6cf-dba8d5a053b5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDI0MDAsImV4cCI6MTc4MzM0NzIwMH0.gCGe631NVi27cndbYRtnbGasvVAow-uCHqVyPh8Euc0',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 14:13:20.756',	'0',	'2026-06-29 14:13:20.757'),
('fe90e3f9-e31c-48eb-b0bd-d3955a9fbad1',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI5MDE3NjksImV4cCI6MTc4MzUwNjU2OX0.5LH2P08rA2FAPV0aFH5rtZQhr4JK8JZr8EPY7BPPRY8',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-08 10:29:29.167',	'0',	'2026-07-01 10:29:29.168'),
('2bed9300-7a7a-4a7e-bbc1-5bd2ff1f820c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI5MDI3NzUsImV4cCI6MTc4MzUwNzU3NX0.Qojo5nyBYHoC2D20ndzHcnF4yPmDlHTz46zLN4bUwQM',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-08 10:46:15.486',	'0',	'2026-07-01 10:46:15.488'),
('adcf34fb-b6b8-4b4a-be37-933693753ef3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDYyODUsImV4cCI6MTc4MzM1MTA4NX0.HWG0T3CYtmOG23Q5zv0Cg2JqZn2gi2SRggV1Fbwxg7A',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 15:18:05.112',	'1',	'2026-06-29 15:18:05.114'),
('c4a98419-6b49-4a68-a274-d464cdf10377',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODY0NDYsImV4cCI6MTc4MzA5MTI0Nn0.mqOQITRPEK8LNkFAvRlhFn9COdLy5tfen2ej2XXsNz8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 15:07:26.159',	'0',	'2026-06-26 15:07:26.16'),
('5d074188-82d5-4dc5-8555-03d6cf6ab7bd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzI5ODgsImV4cCI6MTc4MzMzNzc4OH0.ibSyyjQ1vJ9dedjvkfHU4Mi8EASE-kxBq03WkDWicFA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 11:36:28.75',	'0',	'2026-06-29 11:36:28.752'),
('57d0fd69-4570-4919-81d6-ed460a289c0d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0ODU1MDYsImV4cCI6MTc4MzA5MDMwNn0.dDrEwn9he2av4vuQEpepJ369siDBV83fy08sOuZr1AI',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 14:51:46.544',	'1',	'2026-06-26 14:51:46.545'),
('7faf4d14-38fb-4fc4-a876-fd86403626b8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODcyOTksImV4cCI6MTc4MzA5MjA5OX0.pQxvAHunVMRU1AhstKAPFX_OYd68uGAG59iiGDMHneA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 15:21:39.942',	'1',	'2026-06-26 15:21:39.944'),
('e24ec34e-4a3a-4be4-b423-7ca3c9041080',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI0ODcwNDcsImV4cCI6MTc4MzA5MTg0N30.UF8ckZW5a8Q3nQCPDn8zk-c4nSRyG4SLotdQipFwlCo',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-03 15:17:27.155',	'0',	'2026-06-26 15:17:27.156'),
('97fdf51d-0cff-404f-8a24-a9096f5741dc',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjM4MDYsImV4cCI6MTc4MzM2ODYwNn0._XUfoqABYrZDFAGKBjw6rYgzchG2zU5l6lx-4igYXhw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:10:06.193',	'0',	'2026-06-29 20:10:06.195'),
('cc91d58c-efca-407e-9fc8-99850e0e3a66',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI0ODUyNTcsImV4cCI6MTc4MzA5MDA1N30.V84GM4xm4Z6W6OYN40-sk2Q8TRBZKGOaDo0TX-qYgZo',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-03 14:47:37.578',	'1',	'2026-06-26 14:47:37.579'),
('318015ef-6487-4fd3-bc7d-d54486d92d65',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODYzNzgsImV4cCI6MTc4MzA5MTE3OH0.-MymDXNm6nzlg6kwEVF1HmtNRivxrIW9CJGTMbj_R7o',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 15:06:18.592',	'1',	'2026-06-26 15:06:18.593'),
('80379406-1c36-4ada-99e4-553e158a63ec',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTAwODIsImV4cCI6MTc4MzA5NDg4Mn0.-WXAR4cx1Ih5_MZ_3wVcwiGRc9lMmx-rp-wuSdxq3so',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 16:08:02.255',	'1',	'2026-06-26 16:08:02.256'),
('ffb72ccf-4a76-477c-b470-2c991ff1b7f4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0ODY2ODYsImV4cCI6MTc4MzA5MTQ4Nn0.wG4SezUEsmfbBs2ibDJuzWrt2hjrh-tGqPUcgGW6p4o',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 15:11:26.203',	'1',	'2026-06-26 15:11:26.205'),
('82e05c3b-4d03-4cf1-a234-205469fdd57d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0ODc2NzgsImV4cCI6MTc4MzA5MjQ3OH0.VOMXvsSXgdSjeC2pb5n6Tdaz9HxzWqX7QLoAEuDWpug',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 15:27:58.449',	'0',	'2026-06-26 15:27:58.451'),
('b112818c-2aba-4544-a70b-03dfcea663da',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODk4MTAsImV4cCI6MTc4MzA5NDYxMH0.whvO5SpS2CcskPnHgSOdttFpQvrLpj8k5lP011S0j_Y',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 16:03:30.323',	'0',	'2026-06-26 16:03:30.325'),
('e2e21b70-6077-4351-b5ad-f3f3603ea209',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODg3MjMsImV4cCI6MTc4MzA5MzUyM30.fcEbXFet5pekTQvMK78xll_QbCg75HvEKGb0Ba4j6zo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 15:45:23.714',	'1',	'2026-06-26 15:45:23.716'),
('708b67e2-7710-46d6-abe6-2d4bbfd8678d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODg3MjEsImV4cCI6MTc4MzA5MzUyMX0.dgdjBh8MOXonKKVR2VpfPtrGvxAA321nfjswINNizOo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 15:45:21.831',	'0',	'2026-06-26 15:45:21.832'),
('c077aef3-6269-4501-84d6-6f0a642fc3f6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODcxOTYsImV4cCI6MTc4MzA5MTk5Nn0.CRA8lA8CD0aPE5bXJODL5MCNppcQuanmaOzQmNiQOZM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 15:19:56.753',	'1',	'2026-06-26 15:19:56.755'),
('761ecb55-8dbd-4d49-9a41-c40179424f84',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODgyMTAsImV4cCI6MTc4MzA5MzAxMH0.Bt61c1qXbsdeRh9TCFjognr-15Q6iI7evyUkS1dA5pw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 15:36:50.917',	'1',	'2026-06-26 15:36:50.922'),
('a9a772ac-0d8f-4262-b2f5-4ccd14a39372',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0ODkxNjUsImV4cCI6MTc4MzA5Mzk2NX0.w2NrhnwCkE2eHBgTC6x34yyTBTAqKSS6RbFd5N-sQGY',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 15:52:45.883',	'1',	'2026-06-26 15:52:45.885'),
('a5256d1e-757e-410c-b53d-9a76ba8982b4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTAxMjEsImV4cCI6MTc4MzA5NDkyMX0.hSLARKx0VEUEZmSRXMPoXcHgdeJFwpifArBztY3Qe9A',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 16:08:41.467',	'0',	'2026-06-26 16:08:41.469'),
('4f1135d9-a883-4416-a1e2-edf3f9f36087',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTEwNjQsImV4cCI6MTc4MzA5NTg2NH0.hlKUjmGZj9cu90fBN-IdpR7LsWliIoEEw4wpJgbQiTc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 16:24:24.509',	'0',	'2026-06-26 16:24:24.511'),
('0533d202-e8f2-4db5-b313-0edb65f7823d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0OTI1MzksImV4cCI6MTc4MzA5NzMzOX0.FsqB4ZzyZzLTKFTWYwKXajiI7734H53b8gLYs1VLANg',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 16:48:59.811',	'0',	'2026-06-26 16:48:59.813'),
('11a090f1-2737-4c01-8f48-3646f8326365',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0OTA0NjYsImV4cCI6MTc4MzA5NTI2Nn0.jEKHrfTs4MybdM-eMB6PMT3XGNbXfQ53OMWCorwcG3g',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 16:14:26.962',	'1',	'2026-06-26 16:14:26.963'),
('4f33686f-5e75-4000-8249-9c2549632733',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI0ODcwNDksImV4cCI6MTc4MzA5MTg0OX0.meAnKPMxCgi8FAZ-cYiP2u0YR5MEG729ndm8_v8b7s8',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-03 15:17:29.196',	'1',	'2026-06-26 15:17:29.197'),
('3dadd425-204b-4f8e-bc34-2089afff55d8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjM1NDAsImV4cCI6MTc4MzM2ODM0MH0.YHWxmYqNKKvNSLdhcaJ2-5AgOqOcd-JWr6pFZdWmm1M',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:05:40.16',	'1',	'2026-06-29 20:05:40.163'),
('2e0d710e-77b5-440c-8e90-b94ae46c0bcf',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzM5MjEsImV4cCI6MTc4MzMzODcyMX0.swfZdTSGX2PqnqhVu0eEQLvcjw4EDg8uYmptT-6y6jw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 11:52:01.592',	'1',	'2026-06-29 11:52:01.597'),
('f97fba87-8eb7-4cda-8881-f58efc1174c3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4NDUyNTEsImV4cCI6MTc4MzQ1MDA1MX0.ZbQ52XLmgqaL8Y5uLwVNwtrEjfDhnh4blw9r2k-nU3k',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 18:47:31.95',	'0',	'2026-06-30 18:47:31.951'),
('31be8f17-d4e2-4f53-9e45-91d311c6a400',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDA0NTUsImV4cCI6MTc4MzM0NTI1NX0.n1WuZhhbE2HpM1NY8mtbkPjwT6Yype5rG7lwNlGxml8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 13:40:55.584',	'0',	'2026-06-29 13:40:55.587'),
('c7fbd03b-d1f7-45bc-8194-cf882d7177a9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI3NDE0MjIsImV4cCI6MTc4MzM0NjIyMn0.Sx9HKfKhOUzH0eJh4EQCtSk21IThrfK5YkZqLdf5ijs',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-06 13:57:02.627',	'0',	'2026-06-29 13:57:02.628'),
('30a71f66-cfb6-414c-8ebd-09cf60a8ef21',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDMyMDcsImV4cCI6MTc4MzM0ODAwN30.9mL7PL8a_0YSFstsPkVqQDrX262GBytHAUllnVLGED4',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 14:26:47.023',	'1',	'2026-06-29 14:26:47.025'),
('bf153432-12f2-4e9a-bd6d-e965214cace0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDE2ODcsImV4cCI6MTc4MzM0NjQ4N30.qXtReEV36Jc6aKMbOzRArVm0z89tap6yzGOmuyMtbPc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 14:01:27.559',	'0',	'2026-06-29 14:01:27.562'),
('fabfe53d-7d73-4558-be3c-a29fb1272ec5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDA3ODQsImV4cCI6MTc4MzM0NTU4NH0.AUIib1F5pv4FM4-l3WV34h9EUZVp-WC77UCUfO6ln5g',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 13:46:24.209',	'1',	'2026-06-29 13:46:24.211'),
('9a6ebc15-6554-45d4-adb1-e4a24304381c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDczMDcsImV4cCI6MTc4MzM1MjEwN30.jPJ2juvc-O_vIu2hq3J42CLBCGmzJFNifG-aFww9DU0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 15:35:07.556',	'0',	'2026-06-29 15:35:07.557'),
('53b01546-6bd6-4dc5-a3d1-da4bbb0eb06f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDQzMzIsImV4cCI6MTc4MzM0OTEzMn0.J2mL_H0iFFQfroI1A25YKl99INJdEGfLLx5pcOCdles',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 14:45:32.013',	'0',	'2026-06-29 14:45:32.018'),
('f61a2bf9-52d5-43e6-9835-6dbe1694680a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDI5NTMsImV4cCI6MTc4MzM0Nzc1M30.Sxgcb01LEz8Hro_w7QL8YZ-1dLEanF2D_QavFsuncYA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 14:22:33.694',	'1',	'2026-06-29 14:22:33.697'),
('bfb0e8eb-b397-422d-a726-a142693279f5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDQ1MzUsImV4cCI6MTc4MzM0OTMzNX0.a3OsgOz9eFKawVLf85b0xRX0dlh-1agDi4yICuyZfWs',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 14:48:55.1',	'1',	'2026-06-29 14:48:55.101'),
('d83b4e46-4063-464d-aca7-3c7d5321d92d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDY4MDQsImV4cCI6MTc4MzM1MTYwNH0.AtUEZbAlTdBU9-uxXmvbV4MWQjqFq3QE01J3bSnHFzA',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 15:26:44.443',	'0',	'2026-06-29 15:26:44.445'),
('02bd0b84-95e9-4d9d-a77e-ef37d51674d9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDcyMDksImV4cCI6MTc4MzM1MjAwOX0.yZpTFkEjU5B9FMXUUf6UyMvRv4Oy_7r9jNqJQffG-zc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 15:33:29.234',	'0',	'2026-06-29 15:33:29.238'),
('0e9b0440-eb42-4822-ba92-ab8382921fe0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDczMTMsImV4cCI6MTc4MzM1MjExM30.geX4ck6elrZxmAvgljPEkUKow2EXMJxFaZqzZovJyrE',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 15:35:13.475',	'1',	'2026-06-29 15:35:13.477'),
('bf8e92cf-2aa5-471c-881a-ddd82c0030ef',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NTE5ODMsImV4cCI6MTc4MzM1Njc4M30.Pm8tVfIfvaiWWs3H38Hceb41ZAQoLaz1tKftQjSp5vk',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 16:53:03.41',	'0',	'2026-06-29 16:53:03.412'),
('ae41adf2-4edf-42b2-a8f4-dcf21bd06621',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTE2OTYsImV4cCI6MTc4MzM1NjQ5Nn0.G8wJ-EKDrUYbrCL2ehtPaDfhwGHtY0ixc_j9F28WlN8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 16:48:16.649',	'1',	'2026-06-29 16:48:16.651'),
('6cbf9959-862c-4ffc-a7fc-70bea7fd18fa',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTI3ODYsImV4cCI6MTc4MzM1NzU4Nn0.9w4DopLJDKSQSkevWQ6VWbWjykQgzzKzlw-bHEwjU-w',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 17:06:26.789',	'0',	'2026-06-29 17:06:26.791'),
('818d1b94-8e8b-425d-a8ee-ed2187e7f660',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NTI5NjAsImV4cCI6MTc4MzM1Nzc2MH0.UY1yeXrkcIGRqIbmJjYklY1EI84wzzVu5vE-crVuwDk',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 17:09:20.778',	'0',	'2026-06-29 17:09:20.78'),
('fd2e748f-1ee0-4dad-8852-4c98cabcae7a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NTE5ODksImV4cCI6MTc4MzM1Njc4OX0.yP4i1IcRHUT6jDhe3n_KCrGSrBg4wdPU9mtXUAYinY0',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 16:53:09.365',	'1',	'2026-06-29 16:53:09.366'),
('a414c37e-460a-4125-be1c-6b14ffe4276b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTI5ODUsImV4cCI6MTc4MzM1Nzc4NX0.xQcfEjbISV7AkSG7h7BpHLkqbwJlKQZAOIMiUA46AZ8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 17:09:45.475',	'1',	'2026-06-29 17:09:45.479'),
('01491deb-887b-4129-99a8-64ac527089b6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTM5MDYsImV4cCI6MTc4MzM1ODcwNn0.ENWTpFp8KZqHEEFCnnFHflgcOqZ7_9hQccAiDdf0kXs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 17:25:06.83',	'0',	'2026-06-29 17:25:06.831'),
('0a914ee1-537a-497e-ac38-f686a0c8a932',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NDc3MTcsImV4cCI6MTc4MzM1MjUxN30.-_JarFr7H3DgGUyHacHToBmR3Q4AnB1DR67IbNFKJ0g',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 15:41:57.93',	'1',	'2026-06-29 15:41:57.931'),
('53904949-d91b-41f4-9694-b93801e029bc',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTI5NDgsImV4cCI6MTc4MzM1Nzc0OH0.Evsrn5vSnmVNesCutk4wcbN5yDqDz8KCcmHxCFGB8ck',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 17:09:08.526',	'1',	'2026-06-29 17:09:08.528'),
('4cf8ddf2-600d-422d-af03-b87287dc05fa',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzUwMzQsImV4cCI6MTc4MzMzOTgzNH0.AF4zswOy35SY09cMSj_GqhtU77UDCQ5wYCkK229gI28',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 12:10:34.195',	'0',	'2026-06-29 12:10:34.197'),
('5cca7481-2b3e-47ff-b34d-91cdd5acff2e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTI3NjAsImV4cCI6MTc4MzA5NzU2MH0.T5P887mOt58J4odCbeNCS4J2vqbYmsdsYa9WwO8B-cg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 16:52:40.53',	'0',	'2026-06-26 16:52:40.531'),
('647ba73a-ec31-4ff9-8314-c0f5fe73f908',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTA5NzQsImV4cCI6MTc4MzA5NTc3NH0.wTiC_CXUu4L4VlCWHa0YJNzYuEfmc_HfwQEAP7Voa3Y',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 16:22:54.791',	'1',	'2026-06-26 16:22:54.793'),
('efff476c-8dde-4f2d-aa8d-1b1c7fb371a8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4NDUyODEsImV4cCI6MTc4MzQ1MDA4MX0.TnNarQoGp89Rq2JKg45IhdAqBz8gvn3DRi9L5RZSYwM',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 18:48:01.62',	'0',	'2026-06-30 18:48:01.622'),
('6704e939-132a-4d41-9e2b-b60560a14760',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3Mzk2NzAsImV4cCI6MTc4MzM0NDQ3MH0.ZxDE1UGpQ4vjtgBm4SR5nGmo-yIpA2id32VbAWrNtOk',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 13:27:50.257',	'0',	'2026-06-29 13:27:50.258'),
('e1491b3b-ac50-4dc9-87c2-495e4fed2aa8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0OTQzOTAsImV4cCI6MTc4MzA5OTE5MH0.zy_P5oNx1E0fTDBooDovXcYGLcBLafuvrTg0BBjS0J8',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 17:19:50.235',	'0',	'2026-06-26 17:19:50.236'),
('5e04f020-18f7-4f62-af87-c5546169eba9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0OTQ4OTgsImV4cCI6MTc4MzA5OTY5OH0.PgWX1Z5oTK77skVvcJ-pLoOoU52dHaVUx-fUB-NYRuA',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 17:28:18.669',	'0',	'2026-06-26 17:28:18.671'),
('e4b96f33-14df-4711-819c-5a2d438a6f53',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTM3NTQsImV4cCI6MTc4MzA5ODU1NH0.Ec26uPYnO2Y3oJF2SD11k55n-7Z_O5e5LfQ1dPaxDUY',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 17:09:14.692',	'0',	'2026-06-26 17:09:14.694'),
('76a1c816-1777-4d1f-9506-5b9e2f3e78f6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4OTg3OTgsImV4cCI6MTc4MzUwMzU5OH0.k16961WNLtwy4GooTJ-mPWuAQDNyjv5hP-c0yNdTpYE',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 09:39:58.091',	'0',	'2026-07-01 09:39:58.092'),
('6929d992-66a0-4d44-b509-d70c7e4317cf',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTI3NjIsImV4cCI6MTc4MzA5NzU2Mn0.MTz2QGFZyOy0fhLyuzEopNDjMv4ygGingGoJItXM7GI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 16:52:42.836',	'1',	'2026-06-26 16:52:42.838'),
('e5a4c17b-fa9a-41ea-9f11-2cbd8c578a5f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTQzNzgsImV4cCI6MTc4MzA5OTE3OH0.pm9vRgSHWMtkODwMxfpw5hcMt97m-KBZU_cpLv8sw7Y',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 17:19:38.661',	'1',	'2026-06-26 17:19:38.663'),
('9641eeec-27a1-4a69-bc49-fdf8a9fb285c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0OTI1NDEsImV4cCI6MTc4MzA5NzM0MX0.9HccxXdtXKL7w3B_gXaQqwsEQrH0DpE6kRcC6XbwLQg',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 16:49:01.26',	'1',	'2026-06-26 16:49:01.262'),
('ce1074d2-667c-4821-9e82-b9e513d05d6a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0OTM5NzIsImV4cCI6MTc4MzA5ODc3Mn0.MerWeX_u9_hRmULCO95_ZDvULULtjxLj6WLjrQWcJZs',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 17:12:52.304',	'0',	'2026-06-26 17:12:52.305'),
('561103d7-a5cb-46b4-a55e-d8265200b5cf',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTU1NTYsImV4cCI6MTc4MzEwMDM1Nn0.58GZd3nvq-1_yRgmeN-GCBboS4Pzjkaj6-QhTLIkSJI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 17:39:16.94',	'0',	'2026-06-26 17:39:16.942'),
('8738ca38-fc40-4d01-9745-aa40edebaaf5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTU1NTgsImV4cCI6MTc4MzEwMDM1OH0.ydJbniYuVdJTAMmf72lPd-I-E-sF_HLaSnAPojCZRjE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 17:39:18.542',	'0',	'2026-06-26 17:39:18.543'),
('8eae7a4e-9588-49f6-aaa4-835ef7627698',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI0OTQzNTEsImV4cCI6MTc4MzA5OTE1MX0.FZX1zxikG8mWVb6bty8MaL0Vcr31GLhBF849qkfAK-U',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-03 17:19:11.221',	'1',	'2026-06-26 17:19:11.224'),
('f8947363-874c-40a0-89ca-3cfbd82b2216',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI0OTU1NjgsImV4cCI6MTc4MzEwMDM2OH0.z_NPkLKNhiTOWxSVucdoggVw1E1nk2HCPixuDDg4Q74',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-03 17:39:28.346',	'0',	'2026-06-26 17:39:28.347'),
('6281113c-55c3-4e1e-8929-5a7baa166107',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0OTU2NDIsImV4cCI6MTc4MzEwMDQ0Mn0.U9BAx3QwrBgjAWAwxD-wZE-1HNdYssZYrRq6C2hZrwQ',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 17:40:42.677',	'1',	'2026-06-26 17:40:42.678'),
('c2fb3d78-45ad-49cc-a4af-766414a3c841',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTU2MzcsImV4cCI6MTc4MzEwMDQzN30.bhnUXAyczNOQzY7ildTbzP6VDrtDgVYejLopSY-9jOU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 17:40:37.598',	'1',	'2026-06-26 17:40:37.599'),
('ac7297f0-856d-40ca-bf9a-e7fd3d1b0b63',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI0OTY3OTcsImV4cCI6MTc4MzEwMTU5N30.Z0qKG3m4NOfDkeqrZf0xLlNX-ehZryIG_h2Espnetpw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 17:59:57.159',	'0',	'2026-06-26 17:59:57.16'),
('1aed523e-2b6c-422d-91b7-de42ebc6021b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI0OTU2MTAsImV4cCI6MTc4MzEwMDQxMH0.sso9Tx04Xn5VXtxB7Com-xoHavrXmDAwNqF22bzKKoc',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-03 17:40:10.026',	'1',	'2026-06-26 17:40:10.027'),
('699128e1-356d-4b17-bb3d-6273232d7828',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI1MTM2NzUsImV4cCI6MTc4MzExODQ3NX0.kut6K6eZBJWyUfY5N2dEXAJGyhwbgJELKLUNxDKRNuA',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-03 22:41:15.403',	'0',	'2026-06-26 22:41:15.404'),
('176f6b70-ee28-476d-8dda-7b4c783799ab',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI0OTY2MDgsImV4cCI6MTc4MzEwMTQwOH0._h_l4nacy2qFo4pAEVbNmWY0eDKcLK_rDeGJqDOrt38',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-03 17:56:48.382',	'1',	'2026-06-26 17:56:48.383'),
('b045b765-9b75-46f2-800f-7a88474278ba',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3Mzg2MTEsImV4cCI6MTc4MzM0MzQxMX0.EslVFgKsCIS5HOaPe2X7_jlKh7rkXXsD266tPpV29DA',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 13:10:11.088',	'1',	'2026-06-29 13:10:11.09'),
('af45a68c-ce5e-42b2-9a6b-ed3bfd9de504',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI3MjczODMsImV4cCI6MTc4MzMzMjE4M30.mKvQiv_85mm_1w6gCbU4jaI8DxO6HzKGvRSCSL3YEiM',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-06 10:03:03.561',	'0',	'2026-06-29 10:03:03.562'),
('c70bb7e3-1590-452f-baeb-174993159b5e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI1MTM2NzgsImV4cCI6MTc4MzExODQ3OH0.CbKzfETFA1ENUwLteqyfALn4dxsVdNdcMtgU6yP0mTo',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-03 22:41:18.075',	'1',	'2026-06-26 22:41:18.076'),
('83554d45-8183-4c39-bef4-ecb08136f6fb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI1MTUwMTYsImV4cCI6MTc4MzExOTgxNn0.MCtgNU-xWZHuuyUqa6ot-UpNtt-T1dEYK8dQwntb-zI',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-03 23:03:36.046',	'0',	'2026-06-26 23:03:36.048'),
('bdad520b-6365-429c-a2a3-40849e366c91',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI2NjE1OTAsImV4cCI6MTc4MzI2NjM5MH0.0h0vjnHBbsmFyBwMpg17xqwv6ranZDTE7oPEBoJuRUg',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-05 15:46:30.26',	'1',	'2026-06-28 15:46:30.261'),
('e5db931f-b679-460e-931e-436a6406007c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI2NTg1MjYsImV4cCI6MTc4MzI2MzMyNn0.drvWva_kR1RMZD4BssrJ4pu1RBbJ6dM0B6HIasW-n-k',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-05 14:55:26.065',	'0',	'2026-06-28 14:55:26.067'),
('39af6957-bd3e-4d01-9f3e-7c2c27ca407c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjM1NDMsImV4cCI6MTc4MzM2ODM0M30.0b5k4dpIlC4BjMORirJ9j2kA0xMdtmhAMqoaGMi9Y2k',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:05:43.791',	'1',	'2026-06-29 20:05:43.796'),
('bf63635d-5b42-4613-9e39-c5508866225d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI2NTkwNjIsImV4cCI6MTc4MzI2Mzg2Mn0.feY8h8ieGUJjxSnN715ym1Mjp3O41d3Asmi-7Tru378',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-05 15:04:22.276',	'0',	'2026-06-28 15:04:22.278'),
('d912fe33-b4a0-4370-9b87-83774875278a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3MzA5NTEsImV4cCI6MTc4MzMzNTc1MX0.PWi1zWuaEkWXULJaxZOxofcz1hJsDc_r1BBohM5N30I',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 11:02:31.181',	'0',	'2026-06-29 11:02:31.184'),
('d21053ca-3389-4cd1-a673-4335107d9d6f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI2NTk3NTksImV4cCI6MTc4MzI2NDU1OX0.JArEUw_yJcyMf3Qhtn0wmHx7DMDVpmnNU0LaVhEClK0',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-05 15:15:59.019',	'0',	'2026-06-28 15:15:59.021'),
('433c42ea-bb63-4c7d-ad64-937953d9852b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjM4MDcsImV4cCI6MTc4MzM2ODYwN30.eL4EM84ZvvyJY-cVfAtAisNTJUzSpJoWdMNYOtY1UMM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:10:07.858',	'1',	'2026-06-29 20:10:07.876'),
('3863e9fa-210d-41a6-a2d9-f3573b533786',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI2NTg1MzYsImV4cCI6MTc4MzI2MzMzNn0.mjCIFSDSdiNiIHnE2h8ZNcNs3_x1vD29G69NfdXBr34',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-05 14:55:36.386',	'1',	'2026-06-28 14:55:36.388'),
('4f11ff6e-f474-4cc4-87ae-23c6f9affb49',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3Mjg0NTUsImV4cCI6MTc4MzMzMzI1NX0.sqpiQjmYydqJZsUjzDJHcYTw9ZwfwykoY9uDtiVziP4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 10:20:55.888',	'1',	'2026-06-29 10:20:55.889'),
('712503ed-ac4e-4ec1-80fe-a587c01d1dbb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3Mjk3ODYsImV4cCI6MTc4MzMzNDU4Nn0.I08Mf38k3HY5XDIjF9RWnVB6vyyIp5Naww5BtaT39tM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 10:43:06.299',	'0',	'2026-06-29 10:43:06.302'),
('47ec87aa-4f43-44d6-9c72-4e4bff6c6477',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDA0NTcsImV4cCI6MTc4MzM0NTI1N30.XZSmwAEkKTJhQmY93YCR4cVFXxW4QU8YEY0atJMzyS8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 13:40:57.258',	'1',	'2026-06-29 13:40:57.259'),
('fdd61197-a6d8-4e04-a1e0-90a7773d9da8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI1MTUwMTgsImV4cCI6MTc4MzExOTgxOH0.cBtu6g0nPEEEyYXr7PMBS51wjFIbk8BkSRcJHmBDlp4',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-03 23:03:38.549',	'1',	'2026-06-26 23:03:38.552'),
('1846a8ee-c447-435c-a6a7-87e6eb626944',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3Mjk3ODcsImV4cCI6MTc4MzMzNDU4N30.Jghv_V2QFHsV_2k43BKQxXVL4DAaOxp8Vkfh9_Ngxmk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 10:43:07.855',	'1',	'2026-06-29 10:43:07.86'),
('efc1500c-095c-4791-8e75-90e567a18e4a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDQ0NTUsImV4cCI6MTc4MzM0OTI1NX0.tT8KN0eLRuxSvj_2FtQTi56v_ES6OA3WWoLU7f58JLE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 14:47:35.856',	'0',	'2026-06-29 14:47:35.858'),
('f8e13bc9-3f21-430e-8b77-f7c8727855dd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDEzMzIsImV4cCI6MTc4MzM0NjEzMn0.FRtAS24zuuVgcCRrpsIVJFPUdZHxr1wuPN7uFEuUuUA',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 13:55:32.24',	'1',	'2026-06-29 13:55:32.242'),
('24cd73c0-d391-4f8b-b5e6-ba721b543c13',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDQzMzEsImV4cCI6MTc4MzM0OTEzMX0.YmPdf7uDRZyPEvieQRbkrBpF9Ij4c0tLGrPUM4BqOtI',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 14:45:31.972',	'0',	'2026-06-29 14:45:31.973'),
('8d1d52e8-c705-4fea-a78c-b1aa0fa1f315',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NDYwMDcsImV4cCI6MTc4MzM1MDgwN30.KAjVB4y69KPP3Wuo4m6fxNc4x9TXfkOYKWuwjIJDYpI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 15:13:27.776',	'0',	'2026-06-29 15:13:27.783'),
('deb54f9f-d3aa-46c8-9e3e-e32768fdc5b9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI3NDU3OTUsImV4cCI6MTc4MzM1MDU5NX0.fqs9UL2vzEt3PSAkHkIzyDySlkcllq14sdHQ14TPDzs',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-06 15:09:55.305',	'1',	'2026-06-29 15:09:55.306'),
('e78e7368-e9c8-4be2-aa83-464c035dae7a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI4NDU4NDQsImV4cCI6MTc4MzQ1MDY0NH0.eBcsSf8B95cq3iJ2zKQE6QHSPwl9MAeCBvnBwMBxanw',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-07 18:57:24.302',	'0',	'2026-06-30 18:57:24.304'),
('fe35378d-d1cb-46f6-8ad6-62644fdc19cb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTM5MjcsImV4cCI6MTc4MzM1ODcyN30.azCoRTn5-dvrwipajl738S2h3b3dWZcHK5_M9gffhpI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 17:25:27.134',	'0',	'2026-06-29 17:25:27.135'),
('1cb87dfb-ef5a-4eaf-8261-90f44acc6e80',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NjM4NzcsImV4cCI6MTc4MzM2ODY3N30.xAQZLZFTMS-BkiiDeJTiTzBLoBq7g4JbL83-ShCF764',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 20:11:17.131',	'0',	'2026-06-29 20:11:17.133'),
('e51007d9-cd51-45f9-87ca-48510f6e654a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjAxODMsImV4cCI6MTc4MzM2NDk4M30.eK3nZdDFaDR7Dn9WILCqPC8ULiiJKdQZZU4MkYuRR_M',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 19:09:43.562',	'1',	'2026-06-29 19:09:43.563'),
('c08c6820-9dee-4229-a37f-0a7de72c6c8e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4NDg2NjYsImV4cCI6MTc4MzQ1MzQ2Nn0.Q1EHQ_0t6xf-8tPh9rc6yiy_bPzqU36519z3f0om3xQ',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 19:44:26.582',	'0',	'2026-06-30 19:44:26.585'),
('bde50df5-809d-4fe6-b060-9d5b61a91b70',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NTUzMjIsImV4cCI6MTc4MzM2MDEyMn0.IY1I7C2GEwb2NJrRSSeBCZFmTzkWtUyrrVdDWa9oPcs',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 17:48:42.693',	'0',	'2026-06-29 17:48:42.701'),
('6d454831-74e9-4b3d-8e9e-a0de03c1d65f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4NDg2NjgsImV4cCI6MTc4MzQ1MzQ2OH0.pbSJSCr3WOeJO3ZLhlvYKe0KSMdFH0oCIyFKNtrN-DE',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 19:44:28.262',	'0',	'2026-06-30 19:44:28.263'),
('f9c4dcfa-5f54-4b94-86bf-907b61c0a88a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTU0MzUsImV4cCI6MTc4MzM2MDIzNX0.5KMu-xJyEjYjM5E1nH8ptWRWCiv3ekvprLJ1hPyP_Oo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 17:50:35.431',	'1',	'2026-06-29 17:50:35.435'),
('652ab249-c59c-4865-99ee-b9400ce27795',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4OTg4NTksImV4cCI6MTc4MzUwMzY1OX0.NiZJCiP3vhfw0qFJdPCJL-waIzGHAt5MC3r899U7aCk',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 09:40:59.051',	'0',	'2026-07-01 09:40:59.052'),
('e35ff7f5-78da-4c78-a8f4-33d01a88d144',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTU0MzMsImV4cCI6MTc4MzM2MDIzM30.5LIBEPT256R1KXrD5cBJnkcm4vkVCVNHbT-xThreWxA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 17:50:33.921',	'0',	'2026-06-29 17:50:33.922'),
('1609683e-ac96-4df1-a1c4-6eff158fdadb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTQxMjUsImV4cCI6MTc4MzM1ODkyNX0._8BEpKaSEwQxOFWN4v0isEcBpCofQkqcd8qSzM8BHuk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 17:28:45.148',	'1',	'2026-06-29 17:28:45.151'),
('27afe4b0-8d80-452e-9539-0eae28a0b377',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NjEyNDUsImV4cCI6MTc4MzM2NjA0NX0.sYYXyrKxDFBzeDHPucNai4bSxiHHCJQ0iAtdCaop0m8',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 19:27:25.015',	'1',	'2026-06-29 19:27:25.017'),
('38bd256b-b9a0-47f3-9a5b-f7418648d1dc',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NTc4NzcsImV4cCI6MTc4MzM2MjY3N30.dKUOsLB4vLQpyScF3ag89_KFPFk3YUJHV0aNnifmrx4',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 18:31:17.77',	'1',	'2026-06-29 18:31:17.771'),
('2e46364a-fd15-45ec-8816-c186eb6626de',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NTUzMjYsImV4cCI6MTc4MzM2MDEyNn0.h_kOorPrs0Fm_9ThdHO9oEhfVjUe4b8Pznsr2cWmK8o',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 17:48:46.62',	'1',	'2026-06-29 17:48:46.622'),
('c4ed7a65-7b2a-4794-aa65-f73383de4bfa',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NTc4NzYsImV4cCI6MTc4MzM2MjY3Nn0.riWto1pz-gmBVFaxjB3MvEWGRKVglgvX_Gm23SBAXwY',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 18:31:16.346',	'0',	'2026-06-29 18:31:16.347'),
('53d1fefa-1731-4e9b-b0f0-9ecd9e1c4176',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjIxNDcsImV4cCI6MTc4MzM2Njk0N30.cHEx-KHw1EQWh9xPAX0F0yhGYjTj--r9ytUZGohkHZU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 19:42:27.95',	'1',	'2026-06-29 19:42:27.952'),
('0c3982fb-3fc3-4b00-a311-4c93ba686a7a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjU0ODMsImV4cCI6MTc4MzM3MDI4M30._tOeMjkrgUHYR7MJozmRz9WxSkNIbWYuTwbzy8TPMhs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:38:03.209',	'0',	'2026-06-29 20:38:03.21'),
('a3551104-b140-4df4-aeab-46845b70b226',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTc3MzQsImV4cCI6MTc4MzM2MjUzNH0.NACzeLoAoWHDRSrP8QspFcif7nbuOExJcm8vsgPrdpc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 18:28:54.646',	'1',	'2026-06-29 18:28:54.648'),
('6cc586b4-3f8e-44dc-a09f-93d6c864b445',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NTg3OTQsImV4cCI6MTc4MzM2MzU5NH0.BJ2Rtx1DUnh0ni0sH6KmkqZ46pE6GSohrae8CNBioog',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 18:46:34.621',	'0',	'2026-06-29 18:46:34.625'),
('b86853c5-a1db-4b53-9b57-079018ae3883',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjQ0NTQsImV4cCI6MTc4MzM2OTI1NH0.Hr8qCIDB4hfeaMjl4fJehBr88_E9m5410nKa0VQ0_yE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:20:54.161',	'1',	'2026-06-29 20:20:54.162'),
('bf716597-d088-4569-82ce-1605a51de890',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NjAzMTMsImV4cCI6MTc4MzM2NTExM30.vgpmz65oBM32tdjF8vN-4Gs3eiUIqsEUBh7ziz2rujw',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 19:11:53.234',	'1',	'2026-06-29 19:11:53.236'),
('5ab0ef5c-66ea-469e-a997-a36bb7bb8690',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NTkyOTUsImV4cCI6MTc4MzM2NDA5NX0.pykampnzMeyvwRsEWQA-aJLjtBGIyNbPHQj88KQXSI0',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 18:54:55.051',	'0',	'2026-06-29 18:54:55.057'),
('0f40c508-b1be-42fe-af24-308cbd1d0b69',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NTkyOTYsImV4cCI6MTc4MzM2NDA5Nn0.hXeH6DYrmKkajJ7xzGoxBYMsJKpVJkeFNut56-fH-Ss',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 18:54:56.528',	'1',	'2026-06-29 18:54:56.53'),
('d8aae616-1f51-40f2-bee3-68799b89ca58',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NjEyNDMsImV4cCI6MTc4MzM2NjA0M30.pyCN17fSQaUF1gP3oZ2eERHBmR0LqwIQPdSFWm_FLl4',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 19:27:23.528',	'0',	'2026-06-29 19:27:23.53'),
('804bd53f-05ae-4672-9878-28dfb0a89e29',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4NDYxNjksImV4cCI6MTc4MzQ1MDk2OX0.qajB2Z-mnJUBOi10Ni1RUpBrrFmnGIRLLLhvhBjIYA4',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 19:02:49.72',	'1',	'2026-06-30 19:02:49.721'),
('15e6b214-0d7e-4179-ac6c-3064496ec7bc',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjU0ODksImV4cCI6MTc4MzM3MDI4OX0.riUM_zmYXv8kF2Zq7GHR_eYC-c9lf6v8vsAQvto_0b0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:38:09.309',	'0',	'2026-06-29 20:38:09.31'),
('95208767-df80-41a4-88b9-91367693b4e5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjUyODQsImV4cCI6MTc4MzM3MDA4NH0.5b3X14g_0o0rIOCIAAmX-Icy0TR03O6ht8irHYTsMrM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:34:44.836',	'1',	'2026-06-29 20:34:44.837'),
('580c7ccd-e8c4-427d-bdc8-1896dc4cd1a8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3NjYyMzMsImV4cCI6MTc4MzM3MTAzM30.B7EihaIQ1npJvtyv-43H0_u6Ix_SjRtzDMQXXz0R3oA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 20:50:33.237',	'0',	'2026-06-29 20:50:33.238'),
('7dbe5e1c-de6d-4aa0-927a-9f529ba88755',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NjM4NzgsImV4cCI6MTc4MzM2ODY3OH0.xE8rMjIfJiU5flArK8-lcAkhRUiQhxSFNQbWnwDSQGs',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 20:11:18.815',	'1',	'2026-06-29 20:11:18.816'),
('9aac7155-5a27-4e86-8604-ca88b5ffca50',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI3NjY4MTMsImV4cCI6MTc4MzM3MTYxM30.LKKdeRRw8h3MXjm17Jv6lGBDM_txPWdMHR9JY0aXLAk',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-06 21:00:13.531',	'0',	'2026-06-29 21:00:13.541'),
('1e0aa7d7-8ddb-4ebb-8dbc-e85913b8dd36',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI3Njc3NTcsImV4cCI6MTc4MzM3MjU1N30.bQRr00nUlJvgBpxsXtzPk5urHexVuoxwC12ao5ph09M',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-06 21:15:57.26',	'0',	'2026-06-29 21:15:57.262'),
('06430632-41ef-4257-b952-f69a42d55d30',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MTAxODUsImV4cCI6MTc4MzQxNDk4NX0.01MoMuLT5hoNxf9a55pOLqgINWyaVeOAWsHwFc4uyjc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 09:03:05.92',	'0',	'2026-06-30 09:03:05.923'),
('2fe0d911-d328-4693-8416-d86444fe80e3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MTc1NjcsImV4cCI6MTc4MzQyMjM2N30.DtMVuIeNm6f2jQXaL13s8-wvqoLgKwx21VgChgJTudw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 11:06:07.59',	'0',	'2026-06-30 11:06:07.591'),
('c435774d-246e-403b-a925-b28152dd3dd2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MTY0OTgsImV4cCI6MTc4MzQyMTI5OH0.SJ_6Hr0J6Li8H71xb7ln1E_1FzHUADG61Y9OKK6m8lY',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 10:48:18.159',	'1',	'2026-06-30 10:48:18.165'),
('ca8699fa-67d0-4ec9-88fd-ab3bf4cafcf4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI4MTY3NDgsImV4cCI6MTc4MzQyMTU0OH0.gzBO2QOYh_n5KxqUcpfkhzzfJzbE-CZaxYhOh2ipjeo',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-07 10:52:28.858',	'1',	'2026-06-30 10:52:28.86'),
('0cd5a0f7-d565-4658-a247-2fc5b90f27a7',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI4MTc5ODEsImV4cCI6MTc4MzQyMjc4MX0.vyLqbGtPxntA6AYSpPg0vG5vIfbds0ZBVShRHn5gttE',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-07 11:13:01.042',	'0',	'2026-06-30 11:13:01.047'),
('3edabbaf-bd1c-44b7-9de1-168d91c6c600',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI4MTgyMDUsImV4cCI6MTc4MzQyMzAwNX0._c2zdiFPozYdzyHBhu5mu584YZouOYsdUJP_5Xs9yJg',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-07 11:16:45.499',	'1',	'2026-06-30 11:16:45.501'),
('34c0eaed-e759-4e4e-b60e-3dde74d062b4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MTgzNjYsImV4cCI6MTc4MzQyMzE2Nn0.D0YB7tsxrdJCn6MhsBZJbrd2mtTu28lQGSPM1D34szg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 11:19:26.599',	'0',	'2026-06-30 11:19:26.6'),
('dc09d4f4-6990-4f15-91f6-1b749c729d1d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MTcyMjEsImV4cCI6MTc4MzQyMjAyMX0.th-681HsJb7bNVId_b4VHlxno9TBTr7oCyJgjyZbzBQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 11:00:21.661',	'1',	'2026-06-30 11:00:21.679'),
('31f150f0-7dbd-48c6-b731-7e8266da609a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4MTk5OTksImV4cCI6MTc4MzQyNDc5OX0.bvGKXMQKVZLNNJ4bEacswzhVAX7b6ydVQCg8BZWrfrw',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-07 11:46:39.15',	'1',	'2026-06-30 11:46:39.151'),
('951fc406-814a-4f23-961b-9c006a3cc0f9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjE2NzksImV4cCI6MTc4MzQyNjQ3OX0.PReeMGcBXJRlyq_6L6eJXqdQSTnaWjrWAqK4FNmY-Uc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 12:14:39.463',	'0',	'2026-06-30 12:14:39.465'),
('1dfb8fe5-9272-41b9-a91d-0d15943cd988',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4MjA5NzgsImV4cCI6MTc4MzQyNTc3OH0.o8SRye0thbuE_pc08lx9mXx65LvUUIcazzJy1spHZwk',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-07 12:02:58.751',	'0',	'2026-06-30 12:02:58.753'),
('ced5a10d-7c29-4197-9600-4435e4ab2a08',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjAwNDMsImV4cCI6MTc4MzQyNDg0M30.2BvMVbDLmT_CJizRJw8mQi4mfAjCg_Xa-LMmda7G0H4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 11:47:23.165',	'1',	'2026-06-30 11:47:23.166'),
('a152abab-30d9-4083-b92d-abfa1c830baa',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjE2OTUsImV4cCI6MTc4MzQyNjQ5NX0.06yL5GPFknVq8xqQuCgFucdQwVCX-rSab0avrASv6JA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 12:14:55.241',	'0',	'2026-06-30 12:14:55.244'),
('bf7e1650-07ff-4b37-9d9a-dcf2c48780fb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4OTkzMDcsImV4cCI6MTc4MzUwNDEwN30.cJ-cBQwYL9ZVn2JwcmQoLKv5aqGYlNOQ1xjknD8akl8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 09:48:27.343',	'0',	'2026-07-01 09:48:27.344'),
('8111c19f-3f5f-47dc-b701-d33ed1358f65',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjIwNjIsImV4cCI6MTc4MzQyNjg2Mn0.4KD3m5iMt7IutUnMNdFRvoy7z1yd5wzqWPW6bzHvrI8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 12:21:02.983',	'0',	'2026-06-30 12:21:02.989'),
('b3dc3642-22f4-49ec-b8ed-aae08a58170b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI4MjQ2MTgsImV4cCI6MTc4MzQyOTQxOH0.ovn2C-af9mIiJtcZvMSAzIhgnQUNs1kAxN0qdJr362M',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-07 13:03:38.324',	'0',	'2026-06-30 13:03:38.325'),
('d9a0ec24-16d5-4171-8db9-7e000fa1b110',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4MjQ1ODIsImV4cCI6MTc4MzQyOTM4Mn0.kyRsdPVOGNppjgStsE7cVj58-PdO3owiBj6bl2wgw2M',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 13:03:02.333',	'1',	'2026-06-30 13:03:02.335'),
('f1e1eaf4-d4ad-4458-a873-622579e8e8f1',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4MjU1MjYsImV4cCI6MTc4MzQzMDMyNn0.czUCdhNlo_SvpkNV9TRwDF7n-c8GsqY7rWzSfptyyJU',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 13:18:46.597',	'0',	'2026-06-30 13:18:46.598'),
('df7be6d2-b3c7-41f0-8569-757de4417588',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI4MjQ2MjAsImV4cCI6MTc4MzQyOTQyMH0.sYXCKNPyHqt3e_cDvf7yolqzicllpd_qyCPXlAlmPgI',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-07 13:03:40.822',	'1',	'2026-06-30 13:03:40.823'),
('c82fe171-35b5-41d1-959e-051299d38030',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjQ2MTUsImV4cCI6MTc4MzQyOTQxNX0.XtL68EAonP3LU3UzmD_hDVnGRp1JVsBG2eOB8_GpINo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 13:03:35.271',	'1',	'2026-06-30 13:03:35.272'),
('7f035d72-bf9e-4d02-b1aa-280c2f4fc26b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjU1MzEsImV4cCI6MTc4MzQzMDMzMX0.GSZzrzLdpxJn1m5L_wzore8GPFZot2rE5G_71C4qxX8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 13:18:51.917',	'0',	'2026-06-30 13:18:51.919'),
('53f4f4ab-9783-4bad-bbc7-1620af351c43',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI4MjU2MzMsImV4cCI6MTc4MzQzMDQzM30.DUnFPUn106adU7xtU9zsFJE2e_yqRGMYoTQlsoc-HTo',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-07 13:20:33.638',	'0',	'2026-06-30 13:20:33.639'),
('fb2fafd6-734a-4183-8165-40e5c9be06d6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjY2MzQsImV4cCI6MTc4MzQzMTQzNH0.d4dZ5e9Z1R_Ij3ZhojhVQhSTB6Ov551UR8qU8vRC8VY',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 13:37:14.54',	'0',	'2026-06-30 13:37:14.541'),
('ebd3546a-80fe-412f-bca2-8aff6f479c7b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjgzNzUsImV4cCI6MTc4MzQzMzE3NX0.gUfy8TVbYQFy_OMXLMmMhJJ8dIITGcc4LNWwm385_5M',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 14:06:15.713',	'1',	'2026-06-30 14:06:15.714'),
('29b8e953-c927-4afc-acb5-dd772331d1a6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjY3MDcsImV4cCI6MTc4MzQzMTUwN30.K-nf7v_igwGB8N_cdmn33NRQLRu1jmru3BxAFNFsDzM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 13:38:27.401',	'0',	'2026-06-30 13:38:27.402'),
('757947b7-4bb7-4369-bf8a-4e123f8dce80',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjU1MzIsImV4cCI6MTc4MzQzMDMzMn0.UxylAyu_OeN2xOk4Z_rZfjk8UwUad4t45uTp27thdKE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 13:18:52.994',	'1',	'2026-06-30 13:18:52.995'),
('c286eb50-113a-4263-a063-8348a2e2b4ef',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MjU2NDgsImV4cCI6MTc4MzQzMDQ0OH0.cTaXPo3wYIvUvHrkuLh6RpsdILwIfzpnSjw5uhbQ0PA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 13:20:48.539',	'1',	'2026-06-30 13:20:48.54'),
('c828995d-213d-4cbe-bb75-b998da473bac',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4Mjk0NzgsImV4cCI6MTc4MzQzNDI3OH0.G_ia4u9ofyGoy1vyzjNCCq9_GO8S6fM0omvWW2rqSfQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 14:24:38.239',	'1',	'2026-06-30 14:24:38.24'),
('8c345f92-40ac-47cb-8d67-b6ee510eb68b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MzA0MDAsImV4cCI6MTc4MzQzNTIwMH0.BSYD2_nT4lia1mB3ek0aXLKIRGeN2V9Bzr5xDDQzMlg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 14:40:00.796',	'0',	'2026-06-30 14:40:00.799'),
('adf15b44-4e4e-4b9d-bedc-2920648a2d13',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MzEwOTksImV4cCI6MTc4MzQzNTg5OX0.6z_ZW8ZuUPWHo03qYRsTdoIeLWotA29yvUUxKbmmvZQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 14:51:39.259',	'0',	'2026-06-30 14:51:39.262'),
('990723f0-cd12-45a9-9e8c-778942589ead',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4MjE3OTAsImV4cCI6MTc4MzQyNjU5MH0.-NDDQePwjgZ0vNnwROd4lMM7pVhiypjzNwD8VIOdaYc',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 12:16:30.465',	'1',	'2026-06-30 12:16:30.473'),
('5cf19c08-d317-419b-a4e7-192b32fb853e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MzEyNzksImV4cCI6MTc4MzQzNjA3OX0.DCnxrisBB9-R9dYFwPE7MZgp9mF1Y_XuYkRaq0xwvY0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 14:54:39.979',	'1',	'2026-06-30 14:54:39.981'),
('36a7ccf9-e3b3-4201-abeb-e02064e3322d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MzExMDEsImV4cCI6MTc4MzQzNTkwMX0.KF8HYerX9a9kHV_z6MNSy-XSQ80WKHoaRBGjSSGPFHg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 14:51:41.01',	'1',	'2026-06-30 14:51:41.012'),
('df4b8795-d8e0-4137-a71c-60ad91d0f86f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4MjU1MzIsImV4cCI6MTc4MzQzMDMzMn0.oG2x8kkEXaiaedlcELH_HsSTWBbiHKi3o5lyNRCFgzI',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 13:18:52.686',	'1',	'2026-06-30 13:18:52.688'),
('6d6214ec-ac10-4051-bf9c-0c91fe13fd56',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4MzExMzgsImV4cCI6MTc4MzQzNTkzOH0.aYlselcnvecIZ8D551aNspOVgjOQxM77yExQZbC3gPY',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-07 14:52:18.706',	'1',	'2026-06-30 14:52:18.708'),
('a51f78a5-3778-413d-9319-fbcae649542f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4MzIwNjEsImV4cCI6MTc4MzQzNjg2MX0.U3iQ0pb53yEw8_paHxr6wR3QB5gLZSiQdUEPXbeuHbE',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 15:07:41.292',	'0',	'2026-06-30 15:07:41.293'),
('2388aa19-6f0f-442c-8f44-b4e97b383610',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI4NDU4NDUsImV4cCI6MTc4MzQ1MDY0NX0.OeE9998TLlJsZiolYA8R4LFmtnouL9wxdIR2lwZrdlA',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-07 18:57:25.919',	'0',	'2026-06-30 18:57:25.921'),
('ab1d87ca-8565-4d5a-8cde-78572321465d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4OTc2MjEsImV4cCI6MTc4MzUwMjQyMX0.QE1erUO90APiy4QEvL7C37sX6pqp1okj-z5JfGwV6Uc',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 09:20:21.864',	'0',	'2026-07-01 09:20:21.865'),
('c1c4a260-b75f-4732-a16e-2e87a2739c44',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MzIyOTYsImV4cCI6MTc4MzQzNzA5Nn0.j8QowTnACrjliI2lr3s2NC5YuIwQxFoYif9wVrbLFqc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 15:11:36.677',	'0',	'2026-06-30 15:11:36.68'),
('6d4a8bc3-ec7c-4e54-b165-4ba71b09814c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4MzMwNDUsImV4cCI6MTc4MzQzNzg0NX0.0lfrX-L0yZcapgawcdE43eUI6-4ab7UzAD6z9IhAn2M',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 15:24:05.791',	'0',	'2026-06-30 15:24:05.794'),
('3d15f2dc-5a88-491b-8d3d-7c146d2d005f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4MzIwNjIsImV4cCI6MTc4MzQzNjg2Mn0.-zongaMzcKmOxIspEGeq79O_aCatpSzE2QTSnG1W0wk',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 15:07:42.652',	'1',	'2026-06-30 15:07:42.653'),
('755752ac-2fed-4d6a-b1f6-634dfb62a784',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4MzMxNDUsImV4cCI6MTc4MzQzNzk0NX0.FZ7_76LU2PzEvIXBWXLsopmX3hLUlNupl5sjmDbKOGs',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 15:25:45.842',	'1',	'2026-06-30 15:25:45.843'),
('d70a86ae-3ed9-40dd-8dcc-26e51571fcb7',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI4MzQ3MTgsImV4cCI6MTc4MzQzOTUxOH0.CErPkmNbOHcJIpvqOmZKo4t1I_NxpMkKNNzvnGjXMgs',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-07 15:51:58.324',	'0',	'2026-06-30 15:51:58.326'),
('6d3a3874-ef6e-413b-91cc-d88ed7f28f13',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MzQzMzYsImV4cCI6MTc4MzQzOTEzNn0.wD5oVLP7imlI3t13Kpo5-IJfqY70_JtY8kO3YWAk-Pw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 15:45:36.779',	'0',	'2026-06-30 15:45:36.786'),
('80b6a137-2b1f-4c14-a87b-6dafa0e740b2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4MzI0NzQsImV4cCI6MTc4MzQzNzI3NH0.bL8_OMH40le9-9z6zXQXmv-ieQcLcCDunClPHKgH-1w',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 15:14:34.697',	'1',	'2026-06-30 15:14:34.699'),
('7bd20061-6a54-4ffa-bd3c-892b20564dba',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4MzY1NzUsImV4cCI6MTc4MzQ0MTM3NX0.s0aWnct_zu8ph2q8T1eYomc6AGN-CEu6yn30qDCSNeM',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 16:22:55.759',	'0',	'2026-06-30 16:22:55.761'),
('0261540f-4030-48a6-a2c7-3aa1cf9842a2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4MzMxNDYsImV4cCI6MTc4MzQzNzk0Nn0.rL6p6pWIgDEAF3V9WH7k9lZaCxAY5P6_8Jk7gEB4C_4',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 15:25:46.068',	'1',	'2026-06-30 15:25:46.07'),
('324a807e-47f7-4338-ad6b-5932a9d07ea0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4Mzc4NjYsImV4cCI6MTc4MzQ0MjY2Nn0.4zN1hnojp0HcTfaXb51RxQYrUf2XKIWU9s37iqW-XiI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 16:44:26.532',	'0',	'2026-06-30 16:44:26.533'),
('74a5c098-5a97-44be-8414-41ea3e05d91a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4Mzc1NDMsImV4cCI6MTc4MzQ0MjM0M30.zr90BJRl1oPhoUL5Orv-olPTxIGzwd-PoulDGYs-Rws',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 16:39:03.469',	'0',	'2026-06-30 16:39:03.472'),
('4124eea8-739d-4bd9-8344-cb14eec2a204',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4MzY1OTMsImV4cCI6MTc4MzQ0MTM5M30.BtLbSfeYo6725_3Tw2iuSuePd0KVLuo4af3bea1CbLg',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 16:23:13.757',	'1',	'2026-06-30 16:23:13.766'),
('726f456a-02ca-4b47-8b48-63ae6a71310f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4MzczMDcsImV4cCI6MTc4MzQ0MjEwN30.At2OguRL4v7lmUfsZek8uIsqXhSWym6rF2UbeqoYqec',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 16:35:07.136',	'1',	'2026-06-30 16:35:07.139'),
('52664118-d32f-4e52-b203-43fc0904eb2d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4Mzc1NDUsImV4cCI6MTc4MzQ0MjM0NX0.SX9F6gyGGaWNRiqeNNC_4e2MoagFN7BhVsTAKP4VJBM',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 16:39:05.363',	'1',	'2026-06-30 16:39:05.366'),
('1c2c5a77-4bfa-43e1-bfa7-018a0148c2e0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4Mzg1OTgsImV4cCI6MTc4MzQ0MzM5OH0.g-bTKzjkzs94RvH6R91NZTvKsZ9i32t3fhkFuqgJvS8',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-07 16:56:38.742',	'0',	'2026-06-30 16:56:38.745'),
('b90386dd-70c3-48c3-b220-2f306b5e0156',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4MzgzNzcsImV4cCI6MTc4MzQ0MzE3N30._Xdp5Y7WomLxs0ULcjHJf7nNqkyo1q83jxnhsvEqxYY',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 16:52:57.224',	'1',	'2026-06-30 16:52:57.226'),
('49cc0fef-2365-4253-a86c-5fcade18c096',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4Mzc4NjgsImV4cCI6MTc4MzQ0MjY2OH0.SSKQFPizXTgn_ANhs3Z5qP63yb_PSUYykqbH1b16Blc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 16:44:28.319',	'1',	'2026-06-30 16:44:28.321'),
('04006b9d-7021-4eb1-93af-1ae61737c81e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4Mzg5MTksImV4cCI6MTc4MzQ0MzcxOX0.ah9jk8zSGeluB5ZBNrZsF4AVbYPABwh-54R1sUasUYo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 17:01:59.544',	'0',	'2026-06-30 17:01:59.546'),
('18e2fb1d-936a-4b21-ad18-4577761e97ba',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI4MzgxNDksImV4cCI6MTc4MzQ0Mjk0OX0.De54oG6jBL4mPqepwdCCOxe3W5hx3btuLxa83x8Doqg',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-07 16:49:09.764',	'1',	'2026-06-30 16:49:09.765'),
('dc0efe70-2b07-41ac-bbec-60781312f6be',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4Mzg0NTcsImV4cCI6MTc4MzQ0MzI1N30.uxDzERiZssPQKT2bBGfIrbjiXMTjsmDvkT_PlFd8_1M',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 16:54:17.912',	'1',	'2026-06-30 16:54:17.93'),
('89898426-ac29-406f-a045-6dc5655c1dce',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4NDI0NDQsImV4cCI6MTc4MzQ0NzI0NH0.F1rcLCeVOxnaKPlV-yQhvRvvtkKiByNm4VIi8L78yUE',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 18:00:44.378',	'1',	'2026-06-30 18:00:44.38'),
('5d97a4de-491a-4198-bbba-e85a5a2219c5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4Mzk2MjcsImV4cCI6MTc4MzQ0NDQyN30.nfdxflaAAmdzxkVfGjOyC3MyFM-pCWkeUT0L_gJVIMI',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 17:13:47.26',	'0',	'2026-06-30 17:13:47.262'),
('29281727-4edf-4466-9a80-3160eaf2e01d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4MzkyNzgsImV4cCI6MTc4MzQ0NDA3OH0.nUAKF5DkNKbYbjEmw5i9U4BPS05TDq0gTS_HV1QKBpk',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 17:07:58.041',	'1',	'2026-06-30 17:07:58.043'),
('fad320dc-53ef-4b73-99c9-783978f6ea03',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI4NDA0NzgsImV4cCI6MTc4MzQ0NTI3OH0._H9mFYEVHQLnoalzKrx4KphGhOcEJn128hkCDjaAZw8',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-07 17:27:58.808',	'0',	'2026-06-30 17:27:58.81'),
('7f2abed2-76f3-4781-a05b-419b394aeed4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4NDAyMTcsImV4cCI6MTc4MzQ0NTAxN30.i-iEV8SVBy2MbmmdizYXbCo80CS2KKbF1ZcDMtxqL-4',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 17:23:37.095',	'1',	'2026-06-30 17:23:37.097'),
('06547a9c-fb8f-4b73-9fac-f2879240fe27',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4NDE0MTUsImV4cCI6MTc4MzQ0NjIxNX0.QrOdge8vbUiP65Jx_Mmw2vbiBSi6f_s6npc1wCWbkic',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 17:43:35.991',	'0',	'2026-06-30 17:43:35.993'),
('edb2e63d-c63d-40f8-b7a8-2aa710379caa',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4NDUwNTIsImV4cCI6MTc4MzQ0OTg1Mn0.oW9L6xiLR2Xywb5_l8RTauuCkA_fl4JYXOY2keqo8Sc',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 18:44:12.5',	'1',	'2026-06-30 18:44:12.501'),
('e182d741-1892-424d-b35c-a297aafc0b48',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4NDE0MTYsImV4cCI6MTc4MzQ0NjIxNn0.vKPbF-S1WBw5q1CikRNz9R40R48zp82Ea_JcuCpN6t8',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 17:43:36.002',	'0',	'2026-06-30 17:43:36.004'),
('7a80c168-dce3-4efc-abf1-86754c056f66',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI4NDE1ODUsImV4cCI6MTc4MzQ0NjM4NX0.wKgJOcOTgv8W9-dZvo5kBETqc2fZqEViuoPz-PKJb_c',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-07 17:46:25.542',	'0',	'2026-06-30 17:46:25.543'),
('479ad0bc-ffcf-452e-bec4-a4bf44fc1b2b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI4NDI0MDMsImV4cCI6MTc4MzQ0NzIwM30.QUdqglFZ4jKe6sk8OGgI8d87Jb4ERsBvFQTy2bbTduM',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-07 18:00:03.53',	'1',	'2026-06-30 18:00:03.533'),
('b440b178-3f49-464a-88ef-c04d360b73dd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4NDIzNjYsImV4cCI6MTc4MzQ0NzE2Nn0.dRtuBSIO22MUen7Xy7gjknEbUQODY7tUb_KqltIUj-k',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 17:59:26.752',	'1',	'2026-06-30 17:59:26.753'),
('93463d19-3f24-4e2b-a5ee-adf4e4e09af6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4NDE0MjMsImV4cCI6MTc4MzQ0NjIyM30.fNKz_azy75lsviWt5FMCEjaI7vMQ2DBZMLyP-z2NqGQ',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-07 17:43:43.18',	'1',	'2026-06-30 17:43:43.183'),
('464b7ec2-54ab-4cc6-be05-0a0ab46a9b50',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4OTgzODEsImV4cCI6MTc4MzUwMzE4MX0.ZgkUTpnJQ_OE7Djeqe0AWSpxhqIMm2drbmyWxaWY1UU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 09:33:01.449',	'1',	'2026-07-01 09:33:01.451'),
('6c3d7db8-7070-4bf7-ae49-7c36633f7002',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4NDIyOTAsImV4cCI6MTc4MzQ0NzA5MH0.4aLnSMjX37mpQeq6ElNXRherf1NvZnrZQ-jtqIHQfrM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 17:58:10.463',	'0',	'2026-06-30 17:58:10.48'),
('16994525-ac5d-4a96-a8c5-f8037f40a2e6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4NDA4NTMsImV4cCI6MTc4MzQ0NTY1M30.QYL5ui0Jut2rJlLnHgrw_b5nWi36RihWbGtsLpL7dWg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 17:34:13.195',	'1',	'2026-06-30 17:34:13.198'),
('92a79db1-2fa2-4722-bd08-91a20dcd5433',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI4OTc3NDUsImV4cCI6MTc4MzUwMjU0NX0.aOrNHgPVfqnBvLgQV86ItkN_pG6rLo-WmhlCMtwrtQ8',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 09:22:25.036',	'1',	'2026-07-01 09:22:25.037'),
('4f567e9c-4534-4b83-9b97-59c5bc24f391',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4Mzk2MjgsImV4cCI6MTc4MzQ0NDQyOH0.nb8jCNGy3mXg0Qhiu2kdksSpL9tlFrezWLX_ofgdZW0',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 17:13:48.765',	'1',	'2026-06-30 17:13:48.766'),
('297a341b-56d0-44df-8f59-a893002fed62',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4NDIzNTksImV4cCI6MTc4MzQ0NzE1OX0.A-HTXJyt2SnYxiDmL5SWOJ9Xo8AhiGTeBkIEvOtvkpM',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 17:59:19.543',	'0',	'2026-06-30 17:59:19.546'),
('0d7e14f0-e6d1-4a0b-a517-078627a1f007',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI4NDE0MzAsImV4cCI6MTc4MzQ0NjIzMH0.StU7zk3SSAhjnJTc0DFltCJqR4LDTEqZpWPMlq_SlRQ',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-07 17:43:50.637',	'1',	'2026-06-30 17:43:50.638'),
('75b7deeb-5e4b-498b-bf36-f56df72941b8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4OTk1MzQsImV4cCI6MTc4MzUwNDMzNH0._KdDiAv4x_qpg6gBv_XMKgu5UfHENkQnP7SDRstKcF8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 09:52:14.056',	'0',	'2026-07-01 09:52:14.058'),
('59d3f934-7f61-4b08-9189-58284d749a77',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI4NDI0MzQsImV4cCI6MTc4MzQ0NzIzNH0.v5s2aWvb0mNXOpLruerySIsmYeWuHVUQkGeoCdD4pyM',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-07 18:00:34.001',	'1',	'2026-06-30 18:00:34.002'),
('86affd10-7ba5-4a09-b20a-9311101e49a2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4NDIyOTIsImV4cCI6MTc4MzQ0NzA5Mn0.eUxqVzUuoanSEDVDLa9sjwAVaXrovyk0GNBMQfwbPxE',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 17:58:12.135',	'1',	'2026-06-30 17:58:12.136'),
('cbcbfeb8-5410-451d-8a72-6b77e2d15c7a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4NDMyNTUsImV4cCI6MTc4MzQ0ODA1NX0.k-Hzb8btNkHoNrMmdKEWpkBP6aqMg3lnSmkaGA7cers',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 18:14:15.388',	'0',	'2026-06-30 18:14:15.389'),
('7dbd7f42-9526-4891-b59b-0b971dacde84',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MDM1MTUsImV4cCI6MTc4MzUwODMxNX0.aDPFHVv1SfswBD6w99yxDvcbB2lPrnlsbw7deWSX70A',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 10:58:35.213',	'0',	'2026-07-01 10:58:35.214'),
('64dec7a5-1ea6-4086-b6c1-e626427a125d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI5MDQzOTEsImV4cCI6MTc4MzUwOTE5MX0.g5r_F22RtWqgBMOxwdgDrhDUo8uPNZ93jF3zs7JE_b8',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-08 11:13:11.775',	'0',	'2026-07-01 11:13:11.782'),
('2c06cf39-dd53-4058-8d80-010974a7e20e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MDQ2NjUsImV4cCI6MTc4MzUwOTQ2NX0.WTZKzUS_eRCdUC_1gjnOEureXb0U8P-ik_3ISkvo67U',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 11:17:45.2',	'0',	'2026-07-01 11:17:45.201'),
('e7f29520-c340-409a-aab4-7551925e26da',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MDU3MTksImV4cCI6MTc4MzUxMDUxOX0.hrTA6ij4-rkJs2B3njqCmo_d10F-N5bK1H7fsez6G4w',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 11:35:19.031',	'0',	'2026-07-01 11:35:19.033'),
('f4b53b0a-cbea-4253-ad72-f51102d1d00b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MDU3NzQsImV4cCI6MTc4MzUxMDU3NH0.qwup_mYT6z_LDCNmnOT3qpICnWh_phPH3v5A-PUO9D8',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 11:36:14.249',	'0',	'2026-07-01 11:36:14.251'),
('76300fc6-a026-49d6-bb82-8b6cbb99731e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MDY4NDgsImV4cCI6MTc4MzUxMTY0OH0.XQojxpZtn7IZlnPq2X7VTds1mu7hxLTabQnZHTreubY',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 11:54:08.099',	'0',	'2026-07-01 11:54:08.102'),
('9dc810a9-568b-4b76-927d-8eedc40321d0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MDgxMzYsImV4cCI6MTc4MzUxMjkzNn0.o_VCtwHKzfP46mzgLG6uVuaXR-I5igpLYiJcjK1CJKs',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 12:15:36.689',	'0',	'2026-07-01 12:15:36.691'),
('99b8d106-480a-4c00-bff4-cc93217e0bd9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MDgzNTMsImV4cCI6MTc4MzUxMzE1M30.rHKUgs1fwDS3b4bQr1XLXIGdUFvHVT_GOHljOyFWBms',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 12:19:13.393',	'0',	'2026-07-01 12:19:13.395'),
('6505aced-e2ec-431a-b5f5-dea39091b35e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MDg0NTcsImV4cCI6MTc4MzUxMzI1N30.5ApkNREDrNC_lQPSEjFlE9N0zosbiyvXSOD1PG_cvN8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 12:20:57.984',	'0',	'2026-07-01 12:20:57.985'),
('2667226f-5240-48d5-bc63-d0e6ae5a31bb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MDg5MjEsImV4cCI6MTc4MzUxMzcyMX0.T_SvSMFN9ERF7QcwY8cBY45Pno-FNIS9a1W0DJX6VaM',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 12:28:41.447',	'0',	'2026-07-01 12:28:41.449'),
('24776a42-2dd0-458e-bd3a-7898ac951fa3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MDk0MjIsImV4cCI6MTc4MzUxNDIyMn0.Silna898PSACGed0Q9jxA84PUSs4tFtLxxO8uoALQ18',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 12:37:02.685',	'0',	'2026-07-01 12:37:02.687'),
('47e25e1e-99b6-41b9-a6d5-d9832cdd18b8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MDk1NjQsImV4cCI6MTc4MzUxNDM2NH0.nNa--SPcWVv4XXfZZ5qXaB0XIs-x-1fAn2XQKpq2cXc',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 12:39:24.269',	'0',	'2026-07-01 12:39:24.271'),
('fd5a3834-e857-46fa-9d71-364afef402ce',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTAyODYsImV4cCI6MTc4MzUxNTA4Nn0.eUaSVIqMFFXriw3x6hir4GERBfoFgL9FQesyjodugH4',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 12:51:26.091',	'0',	'2026-07-01 12:51:26.093'),
('aff1a179-44c4-4c91-85f3-d81a92a17cdd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTA0NzksImV4cCI6MTc4MzUxNTI3OX0.jjJO_U8eG48i6CPUWP5d845VodlqoHVVogpHBcFwoKQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 12:54:39.726',	'0',	'2026-07-01 12:54:39.728'),
('5a4aff51-c22a-4745-9cd5-ce405d08d8f9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTA1NTYsImV4cCI6MTc4MzUxNTM1Nn0.N6xaf734oqNr5dQQ5ClDFAKK_lIImO71DN6GisAmUOQ',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 12:55:56.743',	'0',	'2026-07-01 12:55:56.745'),
('ff0af962-ea14-497b-9558-ff5666b455c5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTA1OTAsImV4cCI6MTc4MzUxNTM5MH0.2tGzSxY6vVNiQboTDkcwY9BO7A11LdXSAFVBSofX2cU',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 12:56:30.95',	'0',	'2026-07-01 12:56:30.951'),
('b964bb09-49fe-4bfb-b4af-ce64f987eefb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTE2NDgsImV4cCI6MTc4MzUxNjQ0OH0.0jfVqShcu7modc4UVnZKoiiQcXI9SNBt8_GUU5oilRE',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 13:14:08.863',	'1',	'2026-07-01 13:14:08.865'),
('67bf47b1-b8a3-4d79-9b28-9996ed08ffcd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTE0MTAsImV4cCI6MTc4MzUxNjIxMH0.mz5HJyyTpf7gKvWHqiPMMq_pFkKAvHhTFxErxutWX3c',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 13:10:10.803',	'1',	'2026-07-01 13:10:10.805'),
('f9025ded-be07-408e-9cc3-4968287431f4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTIxMDQsImV4cCI6MTc4MzUxNjkwNH0.mDGY6Je6YbzxNxuNc82hkzwbbsDu7psNBKsBDQHRhN8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 13:21:44.685',	'1',	'2026-07-01 13:21:44.687'),
('e719a0a5-7961-4878-ba81-2b85a7b4a60d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MDk0MDcsImV4cCI6MTc4MzUxNDIwN30.J0NDRZzaBY0UP0wp5gca9Lr41Jec4yDXIwVibMAtuuQ',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 12:36:47.984',	'1',	'2026-07-01 12:36:47.985'),
('c43093cf-50b7-42b3-9930-bdb5cb32c40c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTI1NjIsImV4cCI6MTc4MzUxNzM2Mn0.D4JgTf66R1pH9bpagINrHv2cDdy6q4RHFUwr6OqMlEk',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 13:29:22.118',	'1',	'2026-07-01 13:29:22.12'),
('a4c887b9-5c1c-4c64-980b-6122cb32cd73',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MDY2NjMsImV4cCI6MTc4MzUxMTQ2M30.CypEuRT4GxJPegOToMQlPcKplf_vxaQn-BzRfrAHDzE',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 11:51:03.29',	'1',	'2026-07-01 11:51:03.292'),
('e8687add-cddf-49f6-8e14-dcbf8c55318f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTExOTAsImV4cCI6MTc4MzUxNTk5MH0.pKeVhBG1dAP3P71KjWNv7MQE-J8N8PL09izRUD4Yjic',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 13:06:30.797',	'1',	'2026-07-01 13:06:30.799'),
('b29fbc05-e885-46a5-b5b5-d7e73dd831f8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MTAwMzYsImV4cCI6MTc4MzUxNDgzNn0.hxG1XIxZMBZQWlsJF5_YDtrksrIgbuG5i4yuVWAxtlU',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 12:47:16.141',	'1',	'2026-07-01 12:47:16.143'),
('b5e6809b-6ba9-4ba7-9edd-1a0a8cbceac7',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MTMyNDMsImV4cCI6MTc4MzUxODA0M30.4AbG5FHsp1-jfXBUbIjf3qTwkGYkl9MaPMO_t1DZ9HE',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 13:40:43.877',	'0',	'2026-07-01 13:40:43.879'),
('7676e537-ad69-4f38-a5fd-1564c43e35ac',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTI4NzEsImV4cCI6MTc4MzUxNzY3MX0.BJ-KgV2ShlD31SO-x6JCZI0iS2eITr2VoEymwc3gRC0',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 13:34:31.015',	'1',	'2026-07-01 13:34:31.017'),
('3c597637-787e-4503-bea7-2e69e4e7a136',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTMwMTgsImV4cCI6MTc4MzUxNzgxOH0.8Wt4X5CdwenJt1goKcnitUFPAKDOwoSC6GybKcmTlBI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 13:36:58.792',	'1',	'2026-07-01 13:36:58.794'),
('220487bb-a4ba-4f4c-84ec-a1a060da2c45',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MTMxNDUsImV4cCI6MTc4MzUxNzk0NX0.ntdX5jM4nU5fa6lGtAkz0FswD_Sw8w_MccEuZMcRWVE',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 13:39:05.658',	'1',	'2026-07-01 13:39:05.66'),
('5a62c5bd-43b3-4ec4-afa1-5882efa85c92',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MTQwOTgsImV4cCI6MTc4MzUxODg5OH0.DnVjke00ngwuioLh-crkUmXiMbYcNzM2Cw3495lV_V4',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 13:54:58.978',	'0',	'2026-07-01 13:54:58.98'),
('b6934be7-e44f-4118-8627-e306db7e4c01',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MTQxMTMsImV4cCI6MTc4MzUxODkxM30.wdO3-r-sq9naJ8P-DZlPowUaCT1YMshlsO_EYKxExaU',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 13:55:13.463',	'0',	'2026-07-01 13:55:13.465'),
('ba053e7c-dc52-4c6e-8ca8-49db7c1af004',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTM0NjIsImV4cCI6MTc4MzUxODI2Mn0.yuOVqMG_b4MxYr1Ea5PJ_0VQGNS6-hyySbPK08JT09c',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 13:44:22.355',	'1',	'2026-07-01 13:44:22.356'),
('6a5bf648-8190-4598-86a2-0c2235c91b5d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTM3ODYsImV4cCI6MTc4MzUxODU4Nn0.JvKwU7w10tu0NSE7cgaE8p5DTphkDjq_VGwAK3o44s4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 13:49:46.943',	'1',	'2026-07-01 13:49:46.945'),
('c9964828-4675-4238-a0c9-c081e5587e4d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTM5NDUsImV4cCI6MTc4MzUxODc0NX0.OLjMkPWWZ3eNGKdRt2IT-pRzAhkWvd8i-kroSHwKOAM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 13:52:25.878',	'1',	'2026-07-01 13:52:25.88'),
('15ad2693-e6d6-4995-ae59-ff0d4aa76ee3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTQ4NDYsImV4cCI6MTc4MzUxOTY0Nn0.kP65MNfiL13Rrk8y3Kj8vUnE2LoOQ1lL7D-kfxcMQGM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:07:26.172',	'1',	'2026-07-01 14:07:26.173'),
('ae9527e9-6b36-4856-bd7c-8d2e3e2c5202',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MTQxNjcsImV4cCI6MTc4MzUxODk2N30.Y6pdA9DDlioJcOKj1PahKXQHF0vzICcFq2qW-p3Ece0',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 13:56:07.53',	'1',	'2026-07-01 13:56:07.532'),
('f7b17986-00a2-482a-acba-32d3e0ebb5cc',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTQzNTksImV4cCI6MTc4MzUxOTE1OX0.gQzL66cdzuIIiNBelwDeOA943c_qnu6n7AwRu-jpVAQ',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 13:59:19.172',	'1',	'2026-07-01 13:59:19.174'),
('7f58d5a7-1e60-4926-802f-d8fce0346453',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTQzNjcsImV4cCI6MTc4MzUxOTE2N30.Cua4vIv-frqBk5P09jOtsbw5DyCkPwVVKlhl_rrzT2k',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 13:59:27.468',	'1',	'2026-07-01 13:59:27.469'),
('475a80cf-0e61-4c99-9b61-3ac5f3a521f5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MTU0MzAsImV4cCI6MTc4MzUyMDIzMH0.zjcu_e46kuuhkbu1KmVRd5vo9TundRHLLcprwb2IMQI',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 14:17:10.115',	'1',	'2026-07-01 14:17:10.117'),
('dba67c69-084e-42f6-b210-7a9ee4f93aff',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTQ2OTgsImV4cCI6MTc4MzUxOTQ5OH0.ORi6mrTCAMFE1_i5oNVSprWmXt0-bAwp-60NxSW404Y',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:04:58.959',	'1',	'2026-07-01 14:04:58.96'),
('9211bb4f-0667-43db-8951-44f11ff21d92',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTQ4NDcsImV4cCI6MTc4MzUxOTY0N30.DCs9z7pIv4c0nM9IQtOiPp0kJ2FTHKkB5dHAIlJ4_n8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:07:27.559',	'1',	'2026-07-01 14:07:27.56'),
('bf1e8dfd-1ac2-433f-82d4-2055146a0da1',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTUyNzYsImV4cCI6MTc4MzUyMDA3Nn0.icAyF3XCIglSExH7nVZrG3zCKCD4nAiRQ_do9XRNl0M',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 14:14:36.498',	'1',	'2026-07-01 14:14:36.5'),
('4523ff09-f12e-48db-a2a6-c0e5d3b777a4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTUzMjIsImV4cCI6MTc4MzUyMDEyMn0.D-CfmgekQiNF69J9fGcCs_gXYblr1pbKDQb0_yCU778',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 14:15:22.098',	'1',	'2026-07-01 14:15:22.1'),
('136ac024-f930-421a-aae6-c7ce139f224f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTU3NzksImV4cCI6MTc4MzUyMDU3OX0.8OBEbFJlzV0shZlGlqIblE_gXRK6QMyO-GbDyzw7QOA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:22:59.058',	'1',	'2026-07-01 14:22:59.06'),
('ab7edcc7-72f1-4f79-9039-4c97196621ec',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTYxNzksImV4cCI6MTc4MzUyMDk3OX0.X0qDjfMIvjqbRKxnICsCDgJniwULZ8vsGjaiVP5KJOw',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 14:29:39.753',	'1',	'2026-07-01 14:29:39.755'),
('03ffd73c-a02a-4d16-80d0-513e0268eae9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTYyODIsImV4cCI6MTc4MzUyMTA4Mn0.JS69uuCrum7cNFqdPZvezNCxHcVznoNqpaMXNKkVhU8',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 14:31:22.086',	'1',	'2026-07-01 14:31:22.087'),
('1d8a9ceb-2fd4-4192-b07f-181ed8d6634e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MTUxNDYsImV4cCI6MTc4MzUxOTk0Nn0.WW6v9IA-49cDDK0-b_4lFHs2uMQTAVXF8d2Rj60HTGA',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 14:12:26.199',	'1',	'2026-07-01 14:12:26.201'),
('bd9880fd-356e-4c9c-8c1c-0f7de9f8a2e7',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTU2MzUsImV4cCI6MTc4MzUyMDQzNX0.1oX79sMlo58whXCpYmrL16wmcxR9JBs_19ArCuxeRsQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:20:35.903',	'1',	'2026-07-01 14:20:35.905'),
('a85e6fe8-6931-474d-ac29-8747f6d589b6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTY1MzUsImV4cCI6MTc4MzUyMTMzNX0.JZgnSbi-ZYRMmK7mXF3gHLpNjNtXoT8By2h-GivY2IA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:35:35.884',	'1',	'2026-07-01 14:35:35.886'),
('e4dd3814-ee48-49a5-8094-d84b22d96df2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTY2ODMsImV4cCI6MTc4MzUyMTQ4M30.EqhauJldcUWmOnbN2qRSmUnfZW0ufO6KvGXk5m5_Ypk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:38:03.971',	'1',	'2026-07-01 14:38:03.974'),
('be4e63e4-7df7-4879-ba7a-21a760aca2a2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MTc4NjYsImV4cCI6MTc4MzUyMjY2Nn0.p63VDS0XzygKhM0PBq-JbjQ4vIJFVSxfDOWl7AobQqA',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 14:57:46.663',	'0',	'2026-07-01 14:57:46.665'),
('938ec47f-ecfe-435d-a180-9cae42256c7a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MTQ4OTIsImV4cCI6MTc4MzUxOTY5Mn0.t4U_SVZ9FjEcZzkcOrtEDFtz7O_5X0aWgkLyT0qs894',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 14:08:12.779',	'1',	'2026-07-01 14:08:12.781'),
('91c0aaa5-1d20-4adf-a4ad-83e113cf2aa5',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MTc5NDgsImV4cCI6MTc4MzUyMjc0OH0.HRYbtw-JYBKPoCWl_UrFFuGKOuPrErwxEygRjckMBnQ',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 14:59:08.99',	'0',	'2026-07-01 14:59:08.991'),
('79d4ac5c-f78b-44c5-a362-5c40dd9d70e2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTcxMDQsImV4cCI6MTc4MzUyMTkwNH0.RZjv9IJyC5EBA5ikBgD7d6n7ANU3tHtfMNl-smhPl6A',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 14:45:04.157',	'1',	'2026-07-01 14:45:04.159'),
('3da8ab85-265f-44d6-ad23-3be1cb51a332',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTcxODYsImV4cCI6MTc4MzUyMTk4Nn0.AaP2ujOSg10tUvDSWuUFN4OzCQeP2kgqkbkNjwRvX50',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 14:46:26.042',	'1',	'2026-07-01 14:46:26.044'),
('0a176897-036e-4b00-881c-8c3a3363e356',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTc0MzgsImV4cCI6MTc4MzUyMjIzOH0.rvlTqflJ7dZAh2js1TQwWqo72Xs-kMO2oZzI7o8ZvLw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:50:38.883',	'1',	'2026-07-01 14:50:38.884'),
('8991267e-312c-40cb-80ce-49be5de2601b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MTc1MjMsImV4cCI6MTc4MzUyMjMyM30.YtCvhDTvTqXPc_k3oQBjiKI_OrI1drlEnhrUnwy2FB4',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 14:52:03.316',	'1',	'2026-07-01 14:52:03.317'),
('112196ed-aa89-414e-968f-cac54c153a98',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTc4NDAsImV4cCI6MTc4MzUyMjY0MH0.BQtKNRMKM2VoWPfj38ZXauOLLKNtCPb9qeGxTLdFTZs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 14:57:20.636',	'1',	'2026-07-01 14:57:20.638'),
('396bb458-2658-425d-87e7-b3f4e7a4980d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTgwMzYsImV4cCI6MTc4MzUyMjgzNn0.YkYObgFqagK4YtfkM9ZVkg09-U0DWzCU-7UiM4B99ks',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 15:00:36.578',	'1',	'2026-07-01 15:00:36.58'),
('ca197744-7f8a-453f-b5ee-a576774215af',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTgzNjcsImV4cCI6MTc4MzUyMzE2N30.Fe3abBodEml6bXX-Jv4M02NYEOiu2kNjRPmp1GofnAk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 15:06:07.947',	'1',	'2026-07-01 15:06:07.949'),
('ee449f68-7be0-49a1-89f4-8b9fc170dfff',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MTg0NTEsImV4cCI6MTc4MzUyMzI1MX0.D-PNNW39kbMCGh0KGN3IP_iPwhoVpvASdsm898Kl8bw',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 15:07:31.593',	'1',	'2026-07-01 15:07:31.594'),
('6b2db02f-0f28-4683-b939-848e955750f8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MTk1MTEsImV4cCI6MTc4MzUyNDMxMX0.RStzoME99q8lDh-0Mzty9DXPlviVAxuCgMbT_BBhRtA',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 15:25:11.617',	'0',	'2026-07-01 15:25:11.619'),
('6905f80e-53aa-455e-ac50-9f692123b8c8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MTc4NzQsImV4cCI6MTc4MzUyMjY3NH0.j15BUG6ECFUUJ0CDP26wOlC-Q6aYF9DfJ_iYMd-glQQ',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 14:57:54.251',	'1',	'2026-07-01 14:57:54.252'),
('2e54850e-b42e-4b80-824d-ba55fd743e12',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MTk1OTAsImV4cCI6MTc4MzUyNDM5MH0.5_nKP2X5oXa43pE1kwCz8xvBF93WuWkEuGmE863Vw5I',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 15:26:30.966',	'0',	'2026-07-01 15:26:30.967'),
('ceef4f68-96ab-44c3-ac40-48b3e98b2871',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTgxNDIsImV4cCI6MTc4MzUyMjk0Mn0.C7Afmsljj0Q2Fz3DQfOuYu61RhrofrcfUccEQy8g0TA',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 15:02:22.065',	'1',	'2026-07-01 15:02:22.067'),
('e74c2a5b-876c-437c-b1f0-570d88df4aa2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTg3NDAsImV4cCI6MTc4MzUyMzU0MH0.hdVHzjtN3sbS0ilGsEfMstYdjKY57z8YlwPoUQ_B_vU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 15:12:20.789',	'1',	'2026-07-01 15:12:20.791'),
('9457008f-58ee-4f97-bde8-b1537e3ac42b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTkyNjcsImV4cCI6MTc4MzUyNDA2N30.AXlEjdkgDpRmK2ED_r0Bk7KtN4R-Wp1botxxX4rrUig',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 15:21:07.943',	'1',	'2026-07-01 15:21:07.944'),
('d3429067-5b8d-49c3-9cb7-470e62c75f00',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MTk1MzMsImV4cCI6MTc4MzUyNDMzM30.pVFnebpBlleUqu4JbZUWqBZqEQnuZAQe08AX9yxLAO4',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 15:25:33.327',	'1',	'2026-07-01 15:25:33.329'),
('816ddfa4-7f9a-4455-88ab-6bfd2646f42d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTg5NDMsImV4cCI6MTc4MzUyMzc0M30.D1ezybQaXHU8_2fqElb9T3lBuwt1rXYfoDPO9hJmn_M',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 15:15:43.482',	'1',	'2026-07-01 15:15:43.484'),
('cb24e4a7-7cc8-486a-956f-073926d0e722',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MTkzNzcsImV4cCI6MTc4MzUyNDE3N30.NI_hUzQUauYDIqjBGvV1kblZMzuQK5sRaRaHjaXHMgs',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 15:22:57.45',	'1',	'2026-07-01 15:22:57.452'),
('eac066a2-a87d-4969-bc1c-84e6b2f7a997',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MTk2NjgsImV4cCI6MTc4MzUyNDQ2OH0.bQFE7tOeItvjXJZpIHRNpegEeOIccYJsP5HFhQZxNi4',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 15:27:48.932',	'0',	'2026-07-01 15:27:48.934'),
('cd9ab682-fa67-46f1-ab98-7c89ef1b4aa0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MTk3OTYsImV4cCI6MTc4MzUyNDU5Nn0.zdjvI6O_lRsXwxayfGUetumcG8WjnWUj_ORpEVIhXJA',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 15:29:56.487',	'0',	'2026-07-01 15:29:56.488'),
('5e34f9e6-624b-4041-9693-85dfc7ce59f6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MTk2MjgsImV4cCI6MTc4MzUyNDQyOH0.DE6v4HH28NXFg76eNrvf-3J9WlHMuuJfpPMi3_SfgJg',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 15:27:08.273',	'1',	'2026-07-01 15:27:08.274'),
('021c56d1-7e86-4add-8865-4713597ffd75',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MTk2NDcsImV4cCI6MTc4MzUyNDQ0N30.2wBv5F77E9uY29jM35ll24fMHvHpj02p6K8O6zDMOTo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 15:27:27.83',	'1',	'2026-07-01 15:27:27.831'),
('de653e20-4ce9-4888-847e-931628bc3fcb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MTk4MzIsImV4cCI6MTc4MzUyNDYzMn0.GiR_2D61mbBmxHYv4Eo5uC_WWsq6ntW9KIaIaofSQ2k',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 15:30:32.639',	'1',	'2026-07-01 15:30:32.641'),
('4cdcc93e-9f36-4fa4-9cfc-603bdbf34c97',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjAxNjgsImV4cCI6MTc4MzUyNDk2OH0.eRD-WZ8D4_XK9lzrPTZou7aH7TFr2KdEco9_gl3UtuI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 15:36:08.064',	'1',	'2026-07-01 15:36:08.065'),
('8518936a-bd52-48ae-80ea-31f00c064d54',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjA1NDcsImV4cCI6MTc4MzUyNTM0N30.dqDtwIVuN94v8d4dnAfS_R57B5SDSwBYP0-VrPKS36k',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 15:42:27.225',	'1',	'2026-07-01 15:42:27.227'),
('b2c9fa2e-9626-4df3-96b5-12ccae767d30',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MjA3NDksImV4cCI6MTc4MzUyNTU0OX0.CFGFqfufbqZZNAL3yRLJSEjirLE9MwF-4s_JXldZZqQ',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 15:45:49.606',	'1',	'2026-07-01 15:45:49.608'),
('a56cc88d-899a-4fb1-9f85-65a788007419',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjEwNzgsImV4cCI6MTc4MzUyNTg3OH0.QXV9lp_2tB_rLxn0C_uUkzbmX1lwwsEY3oEkqeoFrYo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 15:51:18.11',	'1',	'2026-07-01 15:51:18.111'),
('58515f49-19f3-444a-bca9-777f4545f7b0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjE1MDUsImV4cCI6MTc4MzUyNjMwNX0.D4ixzsWQOLAzyyCp9hkyNLDjrjTcldmydPBFgCKP-Jg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 15:58:25.84',	'1',	'2026-07-01 15:58:25.842'),
('d756e740-fbff-4cb9-94ed-78fdf8e06039',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjI0MDcsImV4cCI6MTc4MzUyNzIwN30.viF_x_S3PWSHzlJctv2YVAQ_Cnul-TkdHXEaCMv_hxA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 16:13:27.068',	'0',	'2026-07-01 16:13:27.069'),
('9d1267a9-b15a-4d0b-bc64-a6ec788f7cde',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MjE1MzIsImV4cCI6MTc4MzUyNjMzMn0.zeb77pRkTA-LnHAvyDbR1qdfIC8AqSeJcQ210vctqb8',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 15:58:52.399',	'1',	'2026-07-01 15:58:52.4'),
('7a1a2970-a5be-4b9b-a32e-c5b0bf1ef4bc',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjE5OTcsImV4cCI6MTc4MzUyNjc5N30.LiBRWgTXPgqwfzpN9XVV6tQbg7VaFvXp0XtAVRNbmbo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 16:06:37.919',	'1',	'2026-07-01 16:06:37.92'),
('fda7c9f0-4c5b-4b08-b105-5fba877fe7a9',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MjA1NDEsImV4cCI6MTc4MzUyNTM0MX0.J3-6QhiSwyRGkeZN6sPOk19AzPUwypKVTQ9NRVBLPcI',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 15:42:21.26',	'1',	'2026-07-01 15:42:21.261'),
('21919d23-c8eb-4808-ae26-c841d82d725f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MjI0MzYsImV4cCI6MTc4MzUyNzIzNn0.UgeCpA-rDtNOftp5C0EfE_4JkEH5Kq1ikyPERufvARI',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 16:13:56.905',	'1',	'2026-07-01 16:13:56.907'),
('b58e769f-74b4-4624-ad2a-5b7227c288ac',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjI4OTcsImV4cCI6MTc4MzUyNzY5N30.VOqeIKsbBcVmhMl-Y-MI9e1hqcmtHcUAOsDP4VPn8TM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 16:21:37.947',	'1',	'2026-07-01 16:21:37.948'),
('0661c41a-6d83-46a8-b060-55345036bab2',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MjI5MTYsImV4cCI6MTc4MzUyNzcxNn0.QKFLm9uoTXCAeu8Ozn44k3TR33pVjh_8HaW7EUmTL2Y',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 16:21:56.232',	'1',	'2026-07-01 16:21:56.234'),
('fdb1db98-30a7-431d-81ff-3527262bcd3a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MjMzMzksImV4cCI6MTc4MzUyODEzOX0.36BSuEGcFV5KiTarDq7i6OUQL6pX1BBXXk99disc1-w',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 16:28:59.763',	'1',	'2026-07-01 16:28:59.764'),
('d5f1b279-c2d0-482a-a61f-4c1a3c4b3585',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjM3OTcsImV4cCI6MTc4MzUyODU5N30.gklyZx0vyu2rJaTzTuSb7vpLUlYMe3M-he9sXWcFlKA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 16:36:37.93',	'1',	'2026-07-01 16:36:37.935'),
('975d92e2-e508-4152-b11a-e4753b8e3af1',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MjM4NDEsImV4cCI6MTc4MzUyODY0MX0.elDDEoUaY9K8xap8jRrD6_G0LfXxwNqu80G222ykrVQ',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 16:37:21.407',	'1',	'2026-07-01 16:37:21.408'),
('d3eb85d0-5aaa-47bd-bc57-871271b12d6b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MjI5MzAsImV4cCI6MTc4MzUyNzczMH0.CHFE77Q-gFdgUUXoLN2pXJ87uK-5rZvfUTrycnLVwhg',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 16:22:10.021',	'1',	'2026-07-01 16:22:10.022'),
('581d0f02-a55b-4460-9ad4-76006cb54492',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MjE2NTAsImV4cCI6MTc4MzUyNjQ1MH0.F-06L5cSntpN8juzeK6rrSLF8-rZVmDpPxC1LP76lBM',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 16:00:50.495',	'1',	'2026-07-01 16:00:50.497'),
('e86952fb-bd70-4c73-8b23-d958448adee1',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5MjQxODksImV4cCI6MTc4MzUyODk4OX0.yP14WfruDonwbDH9tJnPi-yraCMPzz5Fi0uTuga7asU',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 16:43:09.331',	'1',	'2026-07-01 16:43:09.332'),
('aaced7c5-69a4-4ecb-8f09-5a4843068c24',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MjQ5NjgsImV4cCI6MTc4MzUyOTc2OH0.8q02RZesV73TuVRY7FdnaeA2w3z6oTwuvc_-tHo1xcQ',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 16:56:08.888',	'0',	'2026-07-01 16:56:08.89'),
('02636b70-b50a-41f2-a807-2f57bc7ab875',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjQyOTksImV4cCI6MTc4MzUyOTA5OX0.tcwMCdxFVizPp8oesfyYe3G85drkpWy8ocaMNdtsbuA',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 16:44:59.038',	'1',	'2026-07-01 16:44:59.04'),
('5a57a1f8-eef7-4d10-8370-5582fd437366',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjQ3MjQsImV4cCI6MTc4MzUyOTUyNH0.5Ieyt2s9-dsyx4-_cnoHHHGcwqtgX26zhzAzq6e8MN4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 16:52:04.441',	'1',	'2026-07-01 16:52:04.444'),
('ca26be0b-30d5-43c3-8bd0-9659ef02a606',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MjQ3NDEsImV4cCI6MTc4MzUyOTU0MX0.TfwKDMwV3aH6p1xG28AL26G8jejurMdx7u110MIvPPQ',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 16:52:21.326',	'1',	'2026-07-01 16:52:21.327'),
('bf620e2d-c75f-4b57-9167-5219460c2626',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MjQ1OTYsImV4cCI6MTc4MzUyOTM5Nn0.rzqERzITdzqDV5xgfDxjjU0OnMBG9wEergJXHejRBaw',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 16:49:56.298',	'1',	'2026-07-01 16:49:56.3'),
('53fb17bf-c8d9-4fbb-9e3b-287d18011af7',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MjU4NTcsImV4cCI6MTc4MzUzMDY1N30.p4TPZALBKrFld-pbqI8i-ZgVblMkST_sqJoj0QUHYIs',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 17:10:57.104',	'0',	'2026-07-01 17:10:57.106'),
('6b257d03-3c19-46df-bc47-243d2b0f374c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MjQ5NzMsImV4cCI6MTc4MzUyOTc3M30.HHkyXt-f_n3US0wbnwoCYH6Os5wbzSFQ13m-i86DFsE',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 16:56:13.528',	'1',	'2026-07-01 16:56:13.529'),
('61e7fda4-e70b-4f04-aafa-7139ea325592',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MTY1NTUsImV4cCI6MTc4MzUyMTM1NX0.pEsVVtzPP2XRMhk4_cD9hcNKXwvwIT12rw_S-magyFE',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 14:35:55.681',	'1',	'2026-07-01 14:35:55.682'),
('54271a87-3aaf-4ff3-a307-30247e4d7523',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MjYxMTksImV4cCI6MTc4MzUzMDkxOX0.VpXMq19qaUCA_W3XLeF2JkvervaDiT2vKwYfGiGx3N0',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 17:15:19.802',	'0',	'2026-07-01 17:15:19.804'),
('92caa3c1-ecb2-4115-a59b-a6ccb2d93afb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjUyMjgsImV4cCI6MTc4MzUzMDAyOH0.H0ju5_3-6hlHCFd4PpHUpOusFiik9QCtbelY28pbdOU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 17:00:28.791',	'1',	'2026-07-01 17:00:28.792'),
('8c1d394b-798f-4981-a278-c457742fd953',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjU2NTUsImV4cCI6MTc4MzUzMDQ1NX0.MeQ7gHuwU71hCDEfBT4idl69s-S4C7f2ihRI1VLYvkU',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 17:07:35.131',	'1',	'2026-07-01 17:07:35.132'),
('f48a22b4-6d37-4f37-a486-f416e6c4b39d',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MjU3MDEsImV4cCI6MTc4MzUzMDUwMX0.nWlWqiJTwXFbhuJ7JJskdUW20L-JWPW3CoP6Na1jGs4',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 17:08:21.103',	'1',	'2026-07-01 17:08:21.105'),
('83201812-5ff1-4c08-84b8-8c5f7cc17606',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MjU4ODEsImV4cCI6MTc4MzUzMDY4MX0.UmnwCAdHNf9a0VK0G17CS8M8tmtEcofulzHOCtx0GuQ',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 17:11:21.638',	'1',	'2026-07-01 17:11:21.645'),
('fc4a33f9-7bb3-4dda-b754-1163ee5d9c3c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjYxNzIsImV4cCI6MTc4MzUzMDk3Mn0.RrRO3hW2gxEqf_BQeR865jQBKZ4o-zNDVFhoOSsNQgY',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 17:16:12.862',	'1',	'2026-07-01 17:16:12.863'),
('31812724-764e-4b0a-9c4e-df3d0cc7f4e7',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MjU3NTUsImV4cCI6MTc4MzUzMDU1NX0.lFlzX6eaOgJaEGyhJLbxknjsbcmhO3Uq_pEkegRJpK0',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 17:09:15.816',	'1',	'2026-07-01 17:09:15.819'),
('37b20ccd-da00-432b-8e1b-15b301f98df3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjY1NTUsImV4cCI6MTc4MzUzMTM1NX0.jIyR2LGW8QN29xN3qi2R7bD97qBOs4aGx4A3NdittJI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 17:22:35.312',	'1',	'2026-07-01 17:22:35.315'),
('326f82f3-f795-40bd-ac6f-1607cef151a8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MjY2NjEsImV4cCI6MTc4MzUzMTQ2MX0.XWsZYgF263JCQRtA7k2LEXRA2MGHVZBN1XDJbQPW1pA',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 17:24:21.046',	'1',	'2026-07-01 17:24:21.047'),
('ee8e1a40-a0c8-473c-b951-02547f99a355',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MjY3OTYsImV4cCI6MTc4MzUzMTU5Nn0.awaHZVfrD5s59LXyVstcMl6S1-D1LbPDQCsKKoqlZyQ',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 17:26:36.414',	'1',	'2026-07-01 17:26:36.415'),
('299386e6-1064-464f-9356-a60c34cd0c09',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MjcwNzUsImV4cCI6MTc4MzUzMTg3NX0.QSfmti5BbFJjTh5Ln_S2ziQwPjbOhM68Y_oVT3E7ZdM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 17:31:15.604',	'1',	'2026-07-01 17:31:15.606'),
('0376d4c3-2692-404c-aeb6-e195feaa6629',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5Mjc0NTgsImV4cCI6MTc4MzUzMjI1OH0.lgW9ct36xd4xR9sW9_mKGqJXuKBfQc0bTHg3w2MeXrw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 17:37:38.101',	'1',	'2026-07-01 17:37:38.102'),
('e2db3803-95a2-4e0f-92da-f40bcfb69cc0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5Mjc1NjUsImV4cCI6MTc4MzUzMjM2NX0.fsX0FiKVIiwSlZDjQ4Gdexy6vBmOxzqZ18SL63fWwgE',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 17:39:25.04',	'1',	'2026-07-01 17:39:25.042'),
('d2aca84c-fba8-43d7-af1b-08237239a3b3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5Mjc3MDcsImV4cCI6MTc4MzUzMjUwN30.hNJLAc6y2T1U_TBgnr1SRqkPcr9pb-k7ZIrXq4H2g64',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 17:41:47.352',	'1',	'2026-07-01 17:41:47.354'),
('833d2bff-633b-4ffb-bdf8-e6e4c8b861dd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5MjczMzEsImV4cCI6MTc4MzUzMjEzMX0.rjU0UqM4gqiGzkr35c1YoN_DuZwn1uP1ouYqO1OS_wk',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-08 17:35:31.328',	'1',	'2026-07-01 17:35:31.329'),
('c274df8c-6dd4-458b-a9a5-2006733448d8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5Mjg0MTUsImV4cCI6MTc4MzUzMzIxNX0.el7VZotSd5DMlf8PLFf2d2DRqhRjgEqCQTLLtXs2rUs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 17:53:35.11',	'0',	'2026-07-01 17:53:35.111'),
('5ccf50e5-edbc-4623-839c-7ee1289b4521',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5Mjc5ODAsImV4cCI6MTc4MzUzMjc4MH0.mSD_3_ikfKgFU3YsGs9nDo0xzbHaIzO1mi5BwAL0-Qg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 17:46:20.694',	'1',	'2026-07-01 17:46:20.695'),
('8f6b1316-913b-4094-8945-0736ab4fa61f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5Mjg1MjEsImV4cCI6MTc4MzUzMzMyMX0.S_-tGDhLbcyHfSQbEC0QcPJcSRXXdsyv-nq6EwyUmYc',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 17:55:21.157',	'1',	'2026-07-01 17:55:21.159'),
('9a8bf05d-a87e-428c-913e-789231b8ca35',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5Mjg2MzIsImV4cCI6MTc4MzUzMzQzMn0.jcjUMkgpcWNzgoSAULPXFIHd1lhECEFYlhuq3dmFXzY',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 17:57:12.861',	'1',	'2026-07-01 17:57:12.863'),
('011865db-f5b5-4d51-aeb8-b7b9b0e1f18b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5Mjg4ODMsImV4cCI6MTc4MzUzMzY4M30.UcefPqgOHTQwSTNf3yoEOOQ-3LpQ_G4iCyRlgrJH8K8',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 18:01:23.99',	'1',	'2026-07-01 18:01:23.992'),
('25f0aa46-4f08-4392-a47c-b9071ff3bb5a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5Mjk1NTYsImV4cCI6MTc4MzUzNDM1Nn0.TbtwiZemiqBka-gcwlpLfQkeOhmYObz7aSfv0ZOUXI8',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 18:12:36.67',	'1',	'2026-07-01 18:12:36.671'),
('d5e5183b-aee1-4312-8e8b-8a4c1aaff2c0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5Mjk0MjQsImV4cCI6MTc4MzUzNDIyNH0.RZt5Kgi86_N7MKGV6PI4EnCU3cCeQ_0W6eWo_q4eKZo',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 18:10:24.662',	'1',	'2026-07-01 18:10:24.663'),
('ff76e205-5163-4660-8840-b2c04a0fcf91',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5Mjk3ODUsImV4cCI6MTc4MzUzNDU4NX0.UDEknWMGlQ4FBIMQjGnDNYGMNmcIYBMYIzOqtRr5m7c',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 18:16:25.782',	'1',	'2026-07-01 18:16:25.784'),
('0d801473-a760-400f-9050-fdc061946fdd',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MzA0NTYsImV4cCI6MTc4MzUzNTI1Nn0.AO810JbcOj2YXeZc0PlxmTVerZWafw6CmCiq2Npl2Vg',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 18:27:36.352',	'1',	'2026-07-01 18:27:36.357'),
('de21af37-5d5b-4e53-b7d5-165e4e9ae25e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MzA1ODQsImV4cCI6MTc4MzUzNTM4NH0.rszyU-rhufdRZr17qxjOEopAnwzm8INyhQz-scHRTDQ',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 18:29:44.678',	'1',	'2026-07-01 18:29:44.679'),
('2b51aaab-a326-487b-8c4e-1bafa11e5108',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MzA2ODUsImV4cCI6MTc4MzUzNTQ4NX0.6v5CBZhFGb5pw535DW_xewqANfS9ueHUoUzKXlF-y8U',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 18:31:25.799',	'1',	'2026-07-01 18:31:25.8'),
('fac98989-1ca0-49f5-8efa-9f83a3f8a50a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MzEzNTYsImV4cCI6MTc4MzUzNjE1Nn0.tGy_gjCcj2w7cwSlSF9BaLAJmnISBeYN8meBWvBq1L0',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 18:42:36.422',	'1',	'2026-07-01 18:42:36.424'),
('ba222c56-5a0c-4cf7-a1b0-cd893d496a1c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MzE1MjAsImV4cCI6MTc4MzUzNjMyMH0.3c6r17yfklDKFFNLUjxMOsTcQHkpautAMNdDadSdi0M',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 18:45:20.876',	'1',	'2026-07-01 18:45:20.877'),
('975f18ff-7a3d-44ba-9863-fbb13c51eddb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MzE1ODcsImV4cCI6MTc4MzUzNjM4N30.zU1xSFBclR7JjY3tbk0NYNmunJnolEt0FdC9yZ1JrDc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 18:46:27.77',	'1',	'2026-07-01 18:46:27.772'),
('1e9e0d48-e800-43a0-99a2-39d7c574172a',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI5MzE5NzgsImV4cCI6MTc4MzUzNjc3OH0.fgwWRDUwLR8loj8FIivfJfDYyJJpiiJsV680U6_PpJI',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-08 18:52:58.447',	'1',	'2026-07-01 18:52:58.448'),
('bbe1afb1-baa2-4c70-abc3-adc8e3d5655b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI5MzI4NzksImV4cCI6MTc4MzUzNzY3OX0.oJnG9J--FIzSdaSSo39QSQ6AHP0o5bQ3aPFkKxsF1Xw',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-08 19:07:59.122',	'0',	'2026-07-01 19:07:59.123'),
('87053137-4391-4b5a-bb5f-fb09e463dba6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MzIyNTYsImV4cCI6MTc4MzUzNzA1Nn0.rvYeGgaOjZTYLwXQH1fS4WpagAGO4qEMHjhOrXqLJuA',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 18:57:36.466',	'1',	'2026-07-01 18:57:36.467'),
('a8853f20-1bee-4489-92f8-8e206e3cabb0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MzI0MjEsImV4cCI6MTc4MzUzNzIyMX0.HHxUYGZDXSY9b98nEVQy3Pcw2PNeQtfewYccWO_Zepg',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 19:00:21.254',	'1',	'2026-07-01 19:00:21.256'),
('6a635c01-ba10-42eb-964b-0129d1b4d7e3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MzI0ODcsImV4cCI6MTc4MzUzNzI4N30.uhvlikw95d_Hu8A_ZIPBQmzv_Gw8al7HacZxghom7nM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 19:01:27.236',	'1',	'2026-07-01 19:01:27.237'),
('ce10aff8-48f4-4efe-aba4-509e21b5df86',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MzMxNTYsImV4cCI6MTc4MzUzNzk1Nn0.d5afiRTp9nGCrkIcbZWUrMxXkec4HYHv0x8eEJD9QXk',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 19:12:36.567',	'1',	'2026-07-01 19:12:36.569'),
('fce8bdb2-d3c5-4f3c-a3d3-f24066f6fcd0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MzMzODAsImV4cCI6MTc4MzUzODE4MH0.Ar8RelDwMRlV7GF0-AOaqudbt_rsHiFofVojkod2TYM',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 19:16:20.888',	'1',	'2026-07-01 19:16:20.889'),
('1a6ac9dd-32ae-452a-942e-6ade1e808b36',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MzM0NDUsImV4cCI6MTc4MzUzODI0NX0.58N4l-aMPkDlCYin36Qtc4jJnkPogUG7yrryVT3tbdg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 19:17:25.828',	'1',	'2026-07-01 19:17:25.83'),
('bbda57d6-80f3-423e-9389-246631315e92',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MzQwNTYsImV4cCI6MTc4MzUzODg1Nn0.MX5bt3cuq_5nf3G0yn9zp-05IcwE3jQCCpRAuv3GJlc',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 19:27:36.618',	'1',	'2026-07-01 19:27:36.619'),
('30f48bd0-f87e-4de5-9da5-93ee47a8818e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MzQzNDYsImV4cCI6MTc4MzUzOTE0Nn0.47IoLOhj1OXXyr2BtuGvimqOykQHPgpqZz_9KGT326Q',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 19:32:26.015',	'0',	'2026-07-01 19:32:26.016'),
('2a851f9f-ec24-4b21-882f-1614eeecdaf8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MzQyODEsImV4cCI6MTc4MzUzOTA4MX0.0bzEnUOJ3O-wKQv9d0c8EyehsKESWm-Xn8zhxDutqBg',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 19:31:21.038',	'1',	'2026-07-01 19:31:21.039'),
('3bc4cac7-ac23-4119-8e8a-c09c4152a7fb',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MzQ5NTYsImV4cCI6MTc4MzUzOTc1Nn0.EYFbWVaNDRNSQmxLrV2OH4Hrim_MB0UJPG9VksY7S7Q',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 19:42:36.471',	'1',	'2026-07-01 19:42:36.473'),
('58ad3311-d752-41ad-86ff-6e26c6aa5d0f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MzUyNDAsImV4cCI6MTc4MzU0MDA0MH0.nZaaYxTpERnw2llh2zQftmm-lxvHpquOlTGJ7-wluKY',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 19:47:20.955',	'1',	'2026-07-01 19:47:20.956'),
('693d69ed-d950-423b-8606-ece04a8a3e0c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MzU4NTYsImV4cCI6MTc4MzU0MDY1Nn0.hBK1iDt6tg1G8NFC2laG0LYzntUR6AcJA2FXPlLSCBE',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 19:57:36.512',	'1',	'2026-07-01 19:57:36.515'),
('c5233b9b-b1a2-4c91-ae50-3cb1b8f7a064',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODI5MzY3NjAsImV4cCI6MTc4MzU0MTU2MH0.53oLPckIGw-tzg0Ua9czScfTG9SMSv2ZxHyshIfrDPU',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-08 20:12:40.473',	'0',	'2026-07-01 20:12:40.474'),
('159aba54-0f07-4e72-be64-2d6531892494',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI4NDI2MDcsImV4cCI6MTc4MzQ0NzQwN30.Af2Jdof8OIgii22jR5oH-kXdTjwX0jAGi_Wy7wtl034',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-07 18:03:27.158',	'1',	'2026-06-30 18:03:27.16'),
('de6fe160-3ab3-4353-b18b-e924496185a0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MzYxNDAsImV4cCI6MTc4MzU0MDk0MH0.gQD19hBR2_-feBiwMb_5abE_jiR8TxPvYhRREhbCLDc',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 20:02:20.936',	'1',	'2026-07-01 20:02:20.94'),
('d68f4338-23e2-420b-96d5-a98e75f3c6db',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5MzY4MTYsImV4cCI6MTc4MzU0MTYxNn0.bJFdQ0x5bxM5Lj_yiOGlHklRNcohPz600u1KVTtGi30',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 20:13:36.126',	'1',	'2026-07-01 20:13:36.127'),
('cb52a5ae-c272-454e-a2a8-674803e4d698',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5MzcwNDgsImV4cCI6MTc4MzU0MTg0OH0.nx0ir3gJWv9WC1mI4M7PqxtMBsQVulg8MnLYTAdmIME',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 20:17:28.373',	'1',	'2026-07-01 20:17:28.376'),
('6583aadb-3d1d-4dc8-90d0-904499d3945b',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5Mzc5NzcsImV4cCI6MTc4MzU0Mjc3N30.okUx3FpJGNJMHEIJcrBRoa7tc1NW7IYnXdd2sE_srtw',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 20:32:57.932',	'1',	'2026-07-01 20:32:57.933'),
('ddc0c883-efa0-4997-9a41-0ba9271b2fca',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5Mzg4ODIsImV4cCI6MTc4MzU0MzY4Mn0.2fY6I-fIkTX8fQSgC3Az-8mePM-y1xv5eOPg-6UAWhQ',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 20:48:02.963',	'1',	'2026-07-01 20:48:02.964'),
('87562f6d-578f-4328-a760-7487d0b116ef',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5Mzk3OTEsImV4cCI6MTc4MzU0NDU5MX0.8S02ytCjPjMdDOPRa0IJdI8uls5A0tDO4qh3bSinsNE',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 21:03:11.957',	'1',	'2026-07-01 21:03:11.959'),
('d0d10374-8872-457b-a152-ced1b11d0b08',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5NDA3MDMsImV4cCI6MTc4MzU0NTUwM30.cF62gX5hKunbodk4jiH9meZe8MTeINIla_NTXbUNx3U',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 21:18:23.61',	'1',	'2026-07-01 21:18:23.611'),
('7a9366c9-ebde-4e61-8bc4-a6a046ce025c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5NDA3MDQsImV4cCI6MTc4MzU0NTUwNH0.JgXE1x7LOdqnKRsUwcWeeeeBCmx7Fx2H4SxyXQgsOq0',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 21:18:24.001',	'0',	'2026-07-01 21:18:24.003'),
('0533f298-1a05-41e9-b98b-50f6b664eb81',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5Mzc4MDMsImV4cCI6MTc4MzU0MjYwM30.IMcei5xwwPsTkRvOz5IYPr15ZDQ-5iFaN5ShJOCSmjs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 20:30:03.227',	'1',	'2026-07-01 20:30:03.229'),
('e11c4d29-b7e7-4f2e-bfc5-a3e9f6028228',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5NDE1MzUsImV4cCI6MTc4MzU0NjMzNX0.y13y4IWA-7RFxCbcQpoikldJTsCdIc2IJzi-2B4S2Pw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 21:32:15.543',	'1',	'2026-07-01 21:32:15.545'),
('a2333717-a9d4-4c91-8fed-add79a6da4fc',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5NDI4NzgsImV4cCI6MTc4MzU0NzY3OH0.glzziYdgDiSsLfw6BwuDk79Yn0TlPwHApAIdk6n6phg',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 21:54:38.381',	'1',	'2026-07-01 21:54:38.383'),
('b905834c-1daa-4eba-8080-a9b03574fb83',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5NDQxMzMsImV4cCI6MTc4MzU0ODkzM30.mj3hFmejAAaIxKqzfWopBBg7TFi6I5oPL-IpWMTN2JM',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 22:15:33.481',	'1',	'2026-07-01 22:15:33.482'),
('b72b00ce-2785-4141-a509-87fa76f17b69',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI5MzgzNTYsImV4cCI6MTc4MzU0MzE1Nn0.a8w4GFKN6AwQaNhRwJrjndtSDwMwVA5g-bgmxuRDgsU',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-08 20:39:16.438',	'1',	'2026-07-01 20:39:16.439'),
('6ddce33e-8b76-4fcb-93f7-8df162fd2700',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5NDU4MDcsImV4cCI6MTc4MzU1MDYwN30.xghMeHBILbGlnUV6_Fybg-694Ngou4s7q1sZlm6hzmQ',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 22:43:27.527',	'1',	'2026-07-01 22:43:27.529'),
('ef6b7c37-732f-4e19-8572-271967ba88c6',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5NDUwMzUsImV4cCI6MTc4MzU0OTgzNX0.f2qig9ZNDZsNnI6DbIYNjgjTm2svgZCgDN0ieV3bRRo',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 22:30:35.988',	'1',	'2026-07-01 22:30:35.99'),
('49b40714-c5b9-4121-98f4-473270b0cc05',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI5NDU2OTMsImV4cCI6MTc4MzU1MDQ5M30.KlSbW3EUjxrtY0Q6dBQxP5qwMif6xO9Kjt54ybSK3PI',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-08 22:41:33.504',	'1',	'2026-07-01 22:41:33.507'),
('9dfc3d53-13c8-458c-a3b9-adcf094c99e4',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5NDY3MTAsImV4cCI6MTc4MzU1MTUxMH0.hicEM71DJHchumMi9KkzAr-5d0inwzBhVzRxRnimtVY',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 22:58:30.114',	'1',	'2026-07-01 22:58:30.115'),
('5e4bdcfe-31f5-42a6-b7d5-c9b098e929be',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5NDc4MjgsImV4cCI6MTc4MzU1MjYyOH0.lUmEmeCEsABQa_QXQxosGCoXxrwTq58XRkzKqsHrmrk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 23:17:08.139',	'0',	'2026-07-01 23:17:08.14'),
('16a9d59e-74a6-4562-8025-4d60ffeef342',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5NDc2MTQsImV4cCI6MTc4MzU1MjQxNH0.jaQZw8zteElroY6eK57BPrZEH0wHyKECeT3kYEzEWcg',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 23:13:34.087',	'1',	'2026-07-01 23:13:34.088'),
('83695d0e-485f-4bb0-8cba-945a10a06d67',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5NDg1NjgsImV4cCI6MTc4MzU1MzM2OH0.SL2BJzzJbbH7Yy8znkPRkHEBZMT20xx4KIz_wyG16mE',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-08 23:29:28.168',	'0',	'2026-07-01 23:29:28.17'),
('dbc284b8-bf6d-451f-9203-da902964cc1c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5NDc4MzAsImV4cCI6MTc4MzU1MjYzMH0.y4t4VlISurrNyhry2JC1xFyi2VDYsNgLsLCI8j3LRSs',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 23:17:10.132',	'1',	'2026-07-01 23:17:10.133'),
('5af00356-9956-463e-be35-893b9def9400',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5NDkwMTYsImV4cCI6MTc4MzU1MzgxNn0.3hV6pxCE4Ki4Q8gKVtCpPv4tcW67zjGeYsu1yJEbElQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-08 23:36:56.774',	'0',	'2026-07-01 23:36:56.775'),
('0c368521-41e4-421d-bd71-743513e84d9c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5MjU4OTMsImV4cCI6MTc4MzUzMDY5M30.IJN6DpEn6uLWGoQGu3wd1AYJt4y11NnBKJzDVRMCsjc',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-08 17:11:33.814',	'1',	'2026-07-01 17:11:33.815'),
('4d694721-e321-4ea5-8ee7-cfec1432fe93',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMGI2YzhkOC1jMTFmLTQ2ODItYWYwNy1iZTBhMDE3OTI2YTUiLCJpYXQiOjE3ODI5NzkyMjYsImV4cCI6MTc4MzU4NDAyNn0.m286SinX5WehYwFS-HrY0V8EHwRVyJeHHXqOg-L-FAw',	'e0b6c8d8-c11f-4682-af07-be0a017926a5',	'2026-07-09 08:00:26.17',	'0',	'2026-07-02 08:00:26.172'),
('e9a87262-1c06-4888-9edb-2ea09928acd3',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5NDIxNjgsImV4cCI6MTc4MzU0Njk2OH0.b8aBlfi7cg6TxRo8Y9SflicrPc7a1PZXv1v-WjJfkDE',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-08 21:42:48.024',	'1',	'2026-07-01 21:42:48.025'),
('62d3350c-b182-46fe-9774-58328487f2ae',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MjBkODBkYy0yZDg0LTQ0NTQtYWE3Ni1lMjJiNTBmMDEyMTMiLCJpYXQiOjE3ODI5ODAwMzcsImV4cCI6MTc4MzU4NDgzN30.ztcVnLeR4UvWputVBj4sUaxn5xR9yvhKUabdtCrPTtA',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-09 08:13:57.859',	'0',	'2026-07-02 08:13:57.86'),
('2d71620f-eba0-4e1c-a838-4992523df23e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5ODM5MTIsImV4cCI6MTc4MzU4ODcxMn0.5fG2sU_NsxvVsQ8wboGVGnWHXohg0hCp8oOOoscEdvA',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-09 09:18:32.801',	'0',	'2026-07-02 09:18:32.802'),
('380ebc8b-fd6b-4b7f-bb62-e32396f14956',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYjY5YzQxMC03ODYzLTQwODYtOTc2My0xYzlkNzcxZmRiZDMiLCJpYXQiOjE3ODI5ODQ2NDAsImV4cCI6MTc4MzU4OTQ0MH0.C9tQRjDrttOaEr3QlR40BPQakfmST5oDNs8fkdhFS3U',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-07-09 09:30:40.063',	'0',	'2026-07-02 09:30:40.064'),
('639ae903-bf0c-451d-abbc-5d197498ddef',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5ODM5MTUsImV4cCI6MTc4MzU4ODcxNX0.UAE-UhE-eZNcGH__dlcWSK7dO5dZpRd9Nd3yu5VeyJc',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-09 09:18:35.638',	'1',	'2026-07-02 09:18:35.639'),
('62ab1a07-1fac-48cc-a6c7-a1f39e84657c',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzhiOWZmMC1jZjQxLTQxYjEtYTVhNi0wNzAyOTRmOWMxOTEiLCJpYXQiOjE3ODI5ODQ4MjgsImV4cCI6MTc4MzU4OTYyOH0.rWA5kBB60fQ9u-CrlgdTAxWHR2pHeM0oe6FKZOU1fP0',	'278b9ff0-cf41-41b1-a5a6-070294f9c191',	'2026-07-09 09:33:48.957',	'0',	'2026-07-02 09:33:48.958'),
('5a405a1d-29cb-40e2-b182-df9873faa2c8',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODI5ODc2NTQsImV4cCI6MTc4MzU5MjQ1NH0.t9ugpd2ULWPMzDzj1Zxd29FuxaB5NGiuIQaWG8CHg5I',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-08-01 10:20:54.001',	'0',	'2026-07-02 10:20:54.004'),
('dbc7127b-dd33-40e4-9012-581cbd770300',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjOGZiMThiMC0wNGFlLTQ0NjAtOTI2Ny1hMzIxYWFjODA1YzYiLCJpYXQiOjE3ODI5ODc3NTcsImV4cCI6MTc4MzU5MjU1N30.f8AfdwKm0B89PnCZspxZpPyE6xEVNhc1Rw8RpyYAbOM',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-08-01 10:22:37.838',	'0',	'2026-07-02 10:22:37.84'),
('7941df5a-0677-4e8f-9c60-046cd29c4727',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzM4ZjQyMC1kNGFmLTQ5MjgtOGUzMy1lZWNlYjM1YjhjM2MiLCJpYXQiOjE3ODI5ODgxMzksImV4cCI6MTc4MzU5MjkzOX0.ybfRogbaGXGC3HXZfmaAOeW_IGUqIXWAikP-p3HoXNM',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-08-01 10:28:59.667',	'0',	'2026-07-02 10:28:59.669'),
('94807119-e478-43b1-bb86-a0001ffb1a4e',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODMwMDcwMDEsImV4cCI6MTc4MzYxMTgwMX0.1PAqBee-YFyc454aQcB-cERbf3pT-KqgnWc7UvpOdrQ',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-08-01 15:43:21.513',	'0',	'2026-07-02 15:43:21.514'),
('d0bfef36-5a03-4a4d-adf0-889136c4786f',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODMwMTAyMDksImV4cCI6MTc4MzYxNTAwOX0.mtODz__olJcDPHqJHF51VrC2z4ldZGyD7TSQ0a16pYI',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-08-01 16:36:49.528',	'0',	'2026-07-02 16:36:49.531'),
('88daddb6-2804-4e8e-bfe5-37ad2c23c7f0',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWY0NDU5Yy1hZWIzLTQ2NGUtYjM5ZS03YTFiMjY0MzBiNTkiLCJpYXQiOjE3ODMwMTA4NjcsImV4cCI6MTc4MzYxNTY2N30.2d5Q2vFJ52W70XpbvtMx-8pYpSz7fpdNXMfDrRYAgGw',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-08-01 16:47:47.418',	'0',	'2026-07-02 16:47:47.419'),
('db374c35-cd55-456d-b9ce-b7bbc3fc58cf',	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNDdjZTZjNC1jMWIzLTRjNTktYjYwOS1iMzA4MjA2MWFmZjEiLCJpYXQiOjE3ODMwNzY5MzAsImV4cCI6MTc4MzY4MTczMH0.BHfF2xUIIth6MmHZE61vjpil0-jICz_6QUygIPVkLw0',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-08-02 11:08:50.929',	'0',	'2026-07-03 11:08:50.93');

DROP TABLE IF EXISTS "Role";
CREATE TABLE "public"."Role" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);

INSERT INTO "Role" ("id", "name", "description") VALUES
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'SUPER_ADMIN',	'System Root Administrator'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'ADMIN',	'Enterprise Admin'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'TRAVEL_AGENT',	'Travel Booking Agent'),
('30c231c6-aef9-4330-8913-a1d01cb9b9d9',	'CUSTOMER',	'Client Account'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'Admin',	'System Administrator'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'Manager',	'Operations Manager'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'Agent',	'Booking Agent'),
('06cedad2-e99b-4b2b-915d-e3e170a65d90',	'Customer',	'Client Account');

DROP TABLE IF EXISTS "RolePermission";
CREATE TABLE "public"."RolePermission" (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId")
)
WITH (oids = false);

INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'3042414f-1a22-4b8f-8611-9b18de47b74a'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'4bf7ae11-b31f-414b-b54b-d310c3ca3c4e'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'8447b19b-54de-4846-81a7-cfb2a1db2e83'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'8447b19b-54de-4846-81a7-cfb2a1db2e83'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'9bccd15c-c3db-4bbd-a31d-ae969624d63f'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'ac4968de-e84d-4986-bbda-42b20222c902'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'ac4968de-e84d-4986-bbda-42b20222c902'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'ca922e5b-161f-4803-94f6-92f92f60b736'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'12f92156-b26c-46db-a0a5-f39352810702'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'12f92156-b26c-46db-a0a5-f39352810702'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'ed22f612-d4b2-48ba-b7f9-7c4ad4091d0e'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'632ecb35-f629-4c09-bb29-e5ada3038eaa'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'632ecb35-f629-4c09-bb29-e5ada3038eaa'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'448fbea7-ce51-46ae-8ae0-cbdfde56fe30'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'448fbea7-ce51-46ae-8ae0-cbdfde56fe30'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'69a756da-7c51-412a-9b04-afd2dc206935'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'ff0ba5fe-3e2e-4434-aa16-2ea910d77231'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'ff0ba5fe-3e2e-4434-aa16-2ea910d77231'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'bd4a0800-9e0f-475e-b2ee-9366061108ce'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'632ecb35-f629-4c09-bb29-e5ada3038eaa'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'b987414c-2d6e-4e2e-af62-bbb84abb0dcf'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'b987414c-2d6e-4e2e-af62-bbb84abb0dcf'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'b987414c-2d6e-4e2e-af62-bbb84abb0dcf'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'4b157283-6936-4331-a59d-579b1860a6e8'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'4b157283-6936-4331-a59d-579b1860a6e8'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'dac59677-99a6-4860-ab18-a8249ef9ad0e'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'dac59677-99a6-4860-ab18-a8249ef9ad0e'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'dac59677-99a6-4860-ab18-a8249ef9ad0e'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'e04bc163-f11b-4990-9bef-2f059c863ed9'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'e04bc163-f11b-4990-9bef-2f059c863ed9'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'e04bc163-f11b-4990-9bef-2f059c863ed9'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'2ceb9b53-9036-4352-bc2a-e03d6e36f0af'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'2ceb9b53-9036-4352-bc2a-e03d6e36f0af'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'84daa03b-b6e8-4344-ac87-3dca183030bf'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'84daa03b-b6e8-4344-ac87-3dca183030bf'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'84daa03b-b6e8-4344-ac87-3dca183030bf'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'f04449ce-3b3c-4c63-9fe0-149ec1f5cc98'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'f04449ce-3b3c-4c63-9fe0-149ec1f5cc98'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'f04449ce-3b3c-4c63-9fe0-149ec1f5cc98'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'd8b2e2e4-5f91-4ae5-8091-8125a3a6407d'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'd8b2e2e4-5f91-4ae5-8091-8125a3a6407d'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'd8b2e2e4-5f91-4ae5-8091-8125a3a6407d'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'9cda2327-bb7a-490b-a769-c1803a5cc917'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'9cda2327-bb7a-490b-a769-c1803a5cc917'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'9cda2327-bb7a-490b-a769-c1803a5cc917'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'7e32008f-a50b-424b-b215-e0acf13597df'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'7e32008f-a50b-424b-b215-e0acf13597df'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'f0d63ae6-42d6-4f49-bc42-aa440903dcd9'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'f0d63ae6-42d6-4f49-bc42-aa440903dcd9'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'f3ca63ec-136e-4924-b9ca-e32053d465cd'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'f3ca63ec-136e-4924-b9ca-e32053d465cd'),
('726e119c-8ec9-466a-aa9c-5ea83c3bbfc2',	'f3ca63ec-136e-4924-b9ca-e32053d465cd'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'7d25bfa9-5e95-4302-af8e-8ab5602e0b5b'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'7d25bfa9-5e95-4302-af8e-8ab5602e0b5b'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'b20deb66-4b09-4712-b2e3-4a22ac7e621d'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'b20deb66-4b09-4712-b2e3-4a22ac7e621d'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'e15e79aa-a58d-432f-a2de-0ab55d175832'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'e15e79aa-a58d-432f-a2de-0ab55d175832'),
('5fc839c3-7cf3-4276-bb05-7b492b6e2258',	'342af2e8-a184-4c57-9168-83a8e40e5712'),
('e262147d-ac6e-4140-bb76-c7605d54ba1b',	'342af2e8-a184-4c57-9168-83a8e40e5712'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'632ecb35-f629-4c09-bb29-e5ada3038eaa'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'b987414c-2d6e-4e2e-af62-bbb84abb0dcf'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'4b157283-6936-4331-a59d-579b1860a6e8'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'dac59677-99a6-4860-ab18-a8249ef9ad0e'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'e04bc163-f11b-4990-9bef-2f059c863ed9'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'2ceb9b53-9036-4352-bc2a-e03d6e36f0af'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'84daa03b-b6e8-4344-ac87-3dca183030bf'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'f04449ce-3b3c-4c63-9fe0-149ec1f5cc98'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'd8b2e2e4-5f91-4ae5-8091-8125a3a6407d'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'9cda2327-bb7a-490b-a769-c1803a5cc917'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'7e32008f-a50b-424b-b215-e0acf13597df'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'f0d63ae6-42d6-4f49-bc42-aa440903dcd9'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'f3ca63ec-136e-4924-b9ca-e32053d465cd'),
('14955e7b-4106-4e8b-83c0-11e278280425',	'448fbea7-ce51-46ae-8ae0-cbdfde56fe30'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'632ecb35-f629-4c09-bb29-e5ada3038eaa'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'b987414c-2d6e-4e2e-af62-bbb84abb0dcf'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'4b157283-6936-4331-a59d-579b1860a6e8'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'dac59677-99a6-4860-ab18-a8249ef9ad0e'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'e04bc163-f11b-4990-9bef-2f059c863ed9'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'2ceb9b53-9036-4352-bc2a-e03d6e36f0af'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'84daa03b-b6e8-4344-ac87-3dca183030bf'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'f04449ce-3b3c-4c63-9fe0-149ec1f5cc98'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'd8b2e2e4-5f91-4ae5-8091-8125a3a6407d'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'9cda2327-bb7a-490b-a769-c1803a5cc917'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'7e32008f-a50b-424b-b215-e0acf13597df'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'f0d63ae6-42d6-4f49-bc42-aa440903dcd9'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'f3ca63ec-136e-4924-b9ca-e32053d465cd'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'7d25bfa9-5e95-4302-af8e-8ab5602e0b5b'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'b20deb66-4b09-4712-b2e3-4a22ac7e621d'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'e15e79aa-a58d-432f-a2de-0ab55d175832'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'342af2e8-a184-4c57-9168-83a8e40e5712'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'3042414f-1a22-4b8f-8611-9b18de47b74a'),
('523a0325-a5dd-4148-b9d4-c822ad4f8824',	'448fbea7-ce51-46ae-8ae0-cbdfde56fe30'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'632ecb35-f629-4c09-bb29-e5ada3038eaa'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'b987414c-2d6e-4e2e-af62-bbb84abb0dcf'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'dac59677-99a6-4860-ab18-a8249ef9ad0e'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'e04bc163-f11b-4990-9bef-2f059c863ed9'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'84daa03b-b6e8-4344-ac87-3dca183030bf'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'f04449ce-3b3c-4c63-9fe0-149ec1f5cc98'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'd8b2e2e4-5f91-4ae5-8091-8125a3a6407d'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'9cda2327-bb7a-490b-a769-c1803a5cc917'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'f3ca63ec-136e-4924-b9ca-e32053d465cd'),
('b12692f4-9df2-4b4f-9e03-71aafdfdc36a',	'448fbea7-ce51-46ae-8ae0-cbdfde56fe30');

DROP TABLE IF EXISTS "Room";
CREATE TABLE "public"."Room" (
    "id" text NOT NULL,
    "hotelId" text NOT NULL,
    "roomType" text NOT NULL,
    "price" double precision NOT NULL,
    "maxOccupancy" integer NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "Room" ("id", "hotelId", "roomType", "price", "maxOccupancy", "isAvailable", "createdAt", "updatedAt") VALUES
('42d369c7-44ec-4766-ae17-c1e680e0ea00',	'1a14fc24-4c18-4546-914f-66198c1314bc',	'Deluxe Suite',	450,	2,	'1',	'2026-06-26 15:44:30.221',	'2026-06-26 15:44:30.221'),
('21a13411-d954-437f-b88e-d5c15fb7b36f',	'1a14fc24-4c18-4546-914f-66198c1314bc',	'Executive Room',	320,	2,	'1',	'2026-06-26 15:44:30.221',	'2026-06-26 15:44:30.221');

DROP TABLE IF EXISTS "SystemSetting";
CREATE TABLE "public"."SystemSetting" (
    "id" text NOT NULL,
    "key" text NOT NULL,
    "value" text NOT NULL,
    "description" text,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "SystemSetting_key_key" ON public."SystemSetting" USING btree (key);


DROP TABLE IF EXISTS "Tour";
CREATE TABLE "public"."Tour" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "description" text NOT NULL,
    "durationDays" integer NOT NULL,
    "price" double precision NOT NULL,
    "imageKey" text,
    "category" text NOT NULL,
    "destinationId" text NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "Tour" ("id", "name", "description", "durationDays", "price", "imageKey", "category", "destinationId", "createdAt", "updatedAt") VALUES
('71598bad-7aae-4c09-b42a-acb78db20a8d',	'Classic Paris Sightseeing',	'A comprehensive guided tour of the Eiffel Tower, Louvre, and Seine Cruise.',	4,	599,	NULL,	'Cultural',	'63473d0c-6f7e-42e5-9ffc-d44d9db000ce',	'2026-06-19 17:09:20.927',	'2026-06-19 17:09:20.927');

DROP TABLE IF EXISTS "TransportService";
CREATE TABLE "public"."TransportService" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "vendorId" text NOT NULL,
    "vehicleType" text NOT NULL,
    "departureDestination" text NOT NULL,
    "arrivalDestination" text NOT NULL,
    "date" timestamp(3) NOT NULL,
    "departureTime" text NOT NULL,
    "arrivalTime" text NOT NULL,
    "flightNo" text,
    "price" double precision NOT NULL,
    "currency" text NOT NULL,
    "otherCurrency" text,
    "conversionRate" double precision,
    "issueDate" timestamp(3),
    "refundAmount" double precision DEFAULT '0.0' NOT NULL,
    "fineAmount" double precision DEFAULT '0.0' NOT NULL,
    CONSTRAINT "TransportService_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "TransportService" ("id", "bookingId", "vendorId", "vehicleType", "departureDestination", "arrivalDestination", "date", "departureTime", "arrivalTime", "flightNo", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount") VALUES
('3609b78c-6e0a-4383-8520-aa5741efecac',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'6',	'Saloon',	'King Abdulaziz International Airport (JED)',	'M Hotel Makkah by Millennium',	'2026-10-02 00:00:00',	'15:40',	'',	'GF 183',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('dc726f5d-becc-4015-b2d5-5c2c957efec8',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'6',	'Saloon',	'M Hotel Makkah by Millennium',	'Hayah Al Waha Hotel Madina',	'2026-10-06 00:00:00',	'1200',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('b45f569e-06d8-4856-9b0c-bd33aed8f1c7',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'6',	'Saloon',	'Hayah Al Waha Hotel Madina',	'Madinah Airport',	'2026-10-08 00:00:00',	'1400',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('0808cf97-e1d3-4474-b54f-7122821255b5',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'Saloon',	'King Abdulaziz International Airport (JED)',	'M Hotel Makkah ',	'2026-10-21 00:00:00',	'03:55',	'',	'GF 181',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('9a22efeb-186f-438a-94a9-a0834d802427',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'Private Saloon Car',	'Jeddah Airport',	'Mahd Al Resala 3 Hotel',	'2026-09-20 00:00:00',	'08:45',	'',	'EK 615',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('90468068-aefa-418a-a158-3ae16f8079a2',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	'Private Saloon Car',	'Mahd Al Resala 3 Hotel',	'Hayah Al Waha Hotel',	'2026-09-25 00:00:00',	'12pm',	'4pm',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('182b1a65-b930-4b9f-ae08-b300bc0cd725',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'Private Saloon Car',	'Hayah Al Waha Hotel',	'King Abdulaziz International Airport (JED)',	'2026-09-28 00:00:00',	'15:00',	'20:10',	'EK 804',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('0abef9eb-553c-4c4d-a186-91901fed1e1e',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'3',	'H1 Car',	'King Abdulaziz International Airport (JED)',	' Le Meridien Makkah',	'2026-12-27 00:00:00',	'03:45',	'',	'RJ 704',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('2f03273c-0061-48ab-8f59-459a9057d7df',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'3',	'H1 Car',	' Le Meridien Makkah',	' Millennium Al Aqeeq Hotel',	'2026-12-30 00:00:00',	'1200',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('d4235a7e-3dd8-4968-8389-c9e4b75cfe12',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'3',	'H1 Car',	' Millennium Al Aqeeq Hotel',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'2026-01-04 00:00:00',	'',	'07:00',	'RJ 723',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('b6e6073c-3d26-4493-98b0-4c0a8a13f81d',	'5e668417-02ad-40c0-8c73-723257ee4349',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	'Saloon Car ',	'Jeddah Airport ',	'Mahd al Resala makkah hotel ',	'2026-07-05 00:00:00',	'23:15',	'00',	'SV 124',	55,	'GBP',	'260',	4.7,	'2026-07-01 00:00:00',	0,	0),
('237d134d-787f-42c5-972a-0d196f3d79bc',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'3',	'Private H1 Car',	'Makkah',	'Makkah Ziyarat',	'2026-07-15 00:00:00',	'',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('ddd7eadd-e085-47b4-96e9-47c4e8aedd21',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'H1 Car',	'Al Ebaa Hotel ',	'Makkah Ziarat',	'2026-07-21 00:00:00',	'1600',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('5283c6c2-4f87-452b-a41f-7cf638a4b553',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'H1 Car',	'Saja Al Madinah',	'Madinah Ziarat',	'2026-07-26 00:00:00',	'1600',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('ffbdf6a5-f7e9-4794-90ec-20a8d54bc9d4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'H1',	'Tilal Jabal Alkabah',	'Nusk Alhijra Hotel',	'2026-08-02 00:00:00',	'12:00P',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('f8027078-3a11-4be5-86cf-cade406261d1',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'H1',	'King Abdulaziz International Airport (JED)',	'Tilal Jabal Alkabah',	'2026-07-29 00:00:00',	'08:45',	'',	'EK 805',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('5dc0adde-0391-475e-ab05-feaf7b917bc6',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'H1',	'Nusk Alhijra Hotel',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'2026-08-06 00:00:00',	'',	'17:35',	'EK 810',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('5f13f170-417f-4507-afb1-c4b98fcadbf8',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'H1',	'Makkah',	'Makkah Zairaats',	'2026-07-31 00:00:00',	'',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('33c99231-3494-4012-8fe6-9edf27b93ee6',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'H1 Car',	'King Abdulaziz International Airport (JED)',	'Al Ebaa Hotel ',	'2026-07-19 00:00:00',	'01:10',	'',	'PC 694',	322.91,	'GBP',	'1550',	4.8,	'2026-07-19 00:00:00',	0,	0),
('85b3e831-657f-4eb6-82f4-a30aa08a31db',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'3',	'H1 Car',	'Al Ebaa Hotel ',	'Saja Al Madinah',	'2026-07-23 00:00:00',	'1200',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('ade335e8-7763-4832-9d56-a46415977c70',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'H1 Car',	'Saja Al Madinah',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'2026-07-28 00:00:00',	'1200',	'',	'PK 714',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('c6b08293-afae-4dd3-9c83-bd86de0c6e94',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'3',	'Private H1 Car',	'Emaar Grand Hotel',	'Valy Al Madinah',	'2026-07-17 00:00:00',	'16:00',	'12:00',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('8980d953-cf30-4e1e-9080-9f0059836318',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'Private H1 Car',	'Madinah',	'Madinah Ziyarat',	'2026-07-18 00:00:00',	'',	'',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('1917f605-e095-46ff-a28b-df4b8570b005',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'3',	'Private H1 Car',	'Jeddah Airport',	'Emaar Grand Hotel',	'2026-07-14 00:00:00',	'22:50',	'23:50',	'SV120',	395,	'GBP',	'1900',	4.8,	'2026-07-14 00:00:00',	0,	0),
('643b4ea1-18af-4e05-8334-72d27dcfed77',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'Private Saloon Car',	'Zaha Al Munawara Hotel',	'Emaar Elite Hotel',	'2026-07-10 00:00:00',	'12:00',	'16:00',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('f89358e2-d558-4fb1-91e0-f1502d81629c',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'27',	'Private Saloon Car',	'Jeddah Airport',	'Makkah hotel',	'2026-07-10 00:00:00',	'04:35',	'07:00',	'PC698',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('5c2518f2-384e-4034-a643-ce5dae2be499',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'CAR ',	'Jeddah Airport',	'Al Shohada by Palm Rich Makkah',	'2026-07-26 00:00:00',	'',	'08:45',	'EK 805',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('52c4d4b0-3c1a-4b57-8952-bfcd11b0eeb2',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'HIACE',	'King Abdulaziz International Airport (JED)',	'Al Shohada by Palm Rich Makkah',	'2026-07-27 00:00:00',	'',	'03:55',	'GF 181',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('7a2f659f-5882-4e53-916d-960bc3db44b5',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'HIACE',	'Al Shohada by Palm Rich Makkah',	'SWISS INTERNATIONAL',	'2026-07-31 00:00:00',	'12:00 PM ',	'04 ;00 PM ',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('d2663d37-6c55-476f-b300-89f9486c959f',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'Private Saloon car',	'Emaar Elite Hotel',	'Jeddah Airport',	'2026-07-14 00:00:00',	'18:00',	'21:30',	'GF174',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('f6a9e8a9-37b5-44f6-b624-f335219c5d90',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'H1',	'SWISS INTERNATIONAL',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'2026-08-05 00:00:00',	'14:35',	'',	'EK 810',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('e41a5ce7-5a57-41ad-b2b1-e70fb3b07936',	'cde8c177-b89c-41d2-bb25-97b321e8308c',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'H1',	'SWISS INTERNATIONAL',	'Prince Mohammad Bin Abdulaziz International Airport (MED)',	'2026-08-05 00:00:00',	'16:10 PM ',	'',	'GF 178',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('acbede6f-8dc7-4c52-a275-b9c1c1c92293',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'Private H1 Car',	'Valy Al Madinah',	'Jeddah Airport',	'2026-07-20 00:00:00',	'09:00',	'17:00',	'SV752',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('8760cc32-776a-45f4-a3ca-5bdbcb1ebd4e',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'Private Saloon Car',	'Madinah Airport',	'Zaha Al Munawara Hotel',	'2026-07-06 00:00:00',	'12:10',	'14:00',	'GF179',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('398d35e4-0eec-4a79-a009-3c18840f8e83',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'3',	'HIACE',	'Jeddah King Abdulaziz Intl Airport (JED)',	'Voco Makkah an IHG Hotel',	'2025-12-19 00:00:00',	'04:20',	'06:00',	'704',	270.83,	'gbp',	'1300',	4.8,	'2025-12-18 00:00:00',	0,	0),
('c917b0f8-3eb6-46b8-b9f0-2bd51098f0db',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'3',	'HIACE',	'Voco Hotel Makkah',	'Artal Taiba Madinah',	'2025-12-24 00:00:00',	'12:00',	'17:00',	NULL,	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('ae1e9985-1d8f-4027-a42f-c819b327f63b',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'3',	'HIACE',	'Artal Taibah Madinah',	'Prince Mohammad Bin Abdulaziz Airport, Madinah (MED)',	'2025-12-29 00:00:00',	'04:00',	'17:20',	'723',	0,	'GBP',	NULL,	NULL,	NULL,	0,	0),
('9a4cf1c6-4957-49a1-a2b3-17b58e01fdee',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'3',	'H1',	'Jeddah Airport',	'Al Ebaa Hotel',	'2025-10-10 23:00:00',	'01:10',	'01:10',	'PC 694',	218.75,	'0',	'1050',	4.8,	'2025-09-10 23:00:00',	0,	0),
('fe2f8156-7613-474c-90bc-dfa3972b7291',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'3',	'H1',	'Al Ebaa Hotel',	'Zowar International Hotel',	'2025-10-13 23:00:00',	'12:00',	'12:00',	NULL,	0,	'0',	NULL,	NULL,	NULL,	0,	0),
('b16ca397-2cc6-4802-aa87-846d2f17427b',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'3',	'H1',	'Zowar International Hotel',	'Madinah Airport',	'2025-10-16 23:00:00',	'01:30',	'12:00',	'QR 1175',	0,	'0',	'0',	NULL,	NULL,	0,	0),
('e2a709a0-4c69-44b7-b976-d624e35a312f',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'3',	'H1',	'Jeddah Airport',	'Al Ebaa Hotel',	'2025-12-03 00:00:00',	'00:50',	'14:55',	'TK 94',	218.75,	'gbp',	'0',	4.8,	'2025-12-02 00:00:00',	0,	0),
('b725bcf8-0f42-4e66-8588-726a590f7f39',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'3',	'H1',	'Al Ebaa Hotel',	'Zowar International Hotel',	'2025-12-09 00:00:00',	'12:00',	'12:00',	NULL,	0,	'0',	'0',	0,	NULL,	0,	0),
('f4c702c8-11bc-467b-8f6e-a15c95e25252',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'3',	'H1',	'Zowar International Hotel',	'Madinah Airport',	'2025-12-14 00:00:00',	'23:30',	'01:05',	'TK 137',	0,	'0',	'0',	0,	NULL,	0,	0);

DROP TABLE IF EXISTS "User";
CREATE TABLE "public"."User" (
    "id" text NOT NULL,
    "email" text NOT NULL,
    "passwordHash" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "isEmailVerified" boolean DEFAULT false NOT NULL,
    "emailVerificationToken" text,
    "forgotPasswordToken" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    "agentId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

INSERT INTO "User" ("id", "email", "passwordHash", "firstName", "lastName", "isEmailVerified", "emailVerificationToken", "forgotPasswordToken", "createdAt", "updatedAt", "agentId", "isActive") VALUES
('b82a98bd-f24d-4ff1-af51-53e3ebdca9e5',	'sheikh.ebad@terrifictravel.co.uk',	'$2b$10$UwH0RKZuUDkY.qpvTR3BEuNt.Anwze1j9/Dw5K8dgrL4i3.DbldQq',	'Sheikh',	'Ebad',	'1',	NULL,	NULL,	'2026-06-29 13:06:10.143',	'2026-07-01 14:58:49.495',	'e1f168f7-0772-4e82-9011-6745efc8c59b',	'0'),
('baf4459c-aeb3-464e-b39e-7a1b26430b59',	'admin@terrifictravel.co.uk',	'$2b$10$c4obfizfQqyXoZKGhylBd.WT5tgthqPUaXTls5HDjqjAk9s2emTA.',	'Hasnain',	'Sanwal',	'1',	NULL,	NULL,	'2026-06-19 17:09:20.816',	'2026-06-26 12:54:57.1',	NULL,	'1'),
('d47ce6c4-c1b3-4c59-b609-b3082061aff1',	'muhammad.zain@terrifictravel.co.uk',	'$2b$10$Q6SAQKlTX3I8hvoKuYP0sOr6cqZhchyv0lIdJ1A3AhXFEp9/RQIlu',	'Zain',	'Malik',	'1',	NULL,	NULL,	'2026-06-26 14:21:43.165',	'2026-07-02 17:16:26.346',	'6ee97972-be10-4114-bcc2-fe9165be7714',	'1'),
('fb69c410-7863-4086-9763-1c9d771fdbd3',	'hamza.choudary@terrifictravel.co.uk',	'$2b$10$fE1Y4c948vVXG667EVnoq..V/D5rGTF2R1PX0B4KloOHU0iLG4cNa',	'Hamza',	'Choudary',	'1',	NULL,	NULL,	'2026-06-26 17:01:10.869',	'2026-06-26 17:01:16.577',	'e2f5808a-8809-4668-9e63-29444d0f988b',	'1'),
('278b9ff0-cf41-41b1-a5a6-070294f9c191',	'faisal@terrifictravel.co.uk',	'$2b$10$5iHdSlPmBTu6IPBlF3s/qu//f51fj10OcPjV9vJFuY/XNnL5vBT3u',	'Faisal',	'Chughtai',	'1',	NULL,	NULL,	'2026-06-26 12:53:31.185',	'2026-07-03 09:06:49.897',	'd48c4fd9-7343-42c3-8241-613691bcdac7',	'1'),
('420d80dc-2d84-4454-aa76-e22b50f01213',	'rayan@terrifictravel.co.uk',	'$2b$10$H3yL1P5xEvxrvMYhI8Uhn.fM848KpY3AH25haH7lxiANWYYCgmV/2',	'RAYAN',	'ALI',	'1',	NULL,	NULL,	'2026-06-29 13:04:25.915',	'2026-06-29 13:04:39.173',	'455bbf6d-c482-408d-b449-7df76e15f696',	'1'),
('1738f420-d4af-4928-8e33-eeceb35b8c3c',	'aly@terrifictravel.co.uk',	'$2b$10$N/3EDnCQxmfHO4upV3CCz.6roVJd/3EG2dBCMXmr0sDZObe1.2aPm',	'Ali',	'Ahmad',	'1',	NULL,	NULL,	'2026-06-29 13:08:07.679',	'2026-06-29 13:08:07.679',	'0002b9e2-464a-4502-9a36-8cd0d911c289',	'1'),
('e0b6c8d8-c11f-4682-af07-be0a017926a5',	'maira@terrifictravel.co.uk',	'$2b$10$W0vYQQ3vcR7M1yYNKOP..OsDp8Pd9/O/5bdkAxRCyY7r/k.c/SdX.',	'Maira',	'Tanveer',	'1',	NULL,	NULL,	'2026-06-29 13:09:46.926',	'2026-06-29 13:09:57.071',	'ea4b8e68-8db4-4aa1-b110-0d85bae85be2',	'1'),
('c8fb18b0-04ae-4460-9267-a321aac805c6',	'zain@terrifictravel.co.uk',	'$2b$10$qupRi0PpN88u2UK8mGVHme25bCHMCJjdCq2H5bP.u1PuiJfmMYYi2',	'Zain',	'Ali',	'1',	NULL,	NULL,	'2026-06-30 16:44:59.806',	'2026-06-30 16:44:59.806',	'1e85f3e9-37fc-4704-8650-ce423408044e',	'1');

DROP TABLE IF EXISTS "UserRole";
CREATE TABLE "public"."UserRole" (
    "userId" text NOT NULL,
    "roleId" text NOT NULL,
    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId", "roleId")
)
WITH (oids = false);

INSERT INTO "UserRole" ("userId", "roleId") VALUES
('baf4459c-aeb3-464e-b39e-7a1b26430b59',	'5fc839c3-7cf3-4276-bb05-7b492b6e2258'),
('fb69c410-7863-4086-9763-1c9d771fdbd3',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a'),
('420d80dc-2d84-4454-aa76-e22b50f01213',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a'),
('1738f420-d4af-4928-8e33-eeceb35b8c3c',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a'),
('e0b6c8d8-c11f-4682-af07-be0a017926a5',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a'),
('c8fb18b0-04ae-4460-9267-a321aac805c6',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a'),
('b82a98bd-f24d-4ff1-af51-53e3ebdca9e5',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a'),
('d47ce6c4-c1b3-4c59-b609-b3082061aff1',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a'),
('278b9ff0-cf41-41b1-a5a6-070294f9c191',	'b12692f4-9df2-4b4f-9e03-71aafdfdc36a');

DROP TABLE IF EXISTS "Vendor";
CREATE TABLE "public"."Vendor" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "phoneNumber" text NOT NULL,
    "website" text,
    "supportEmail" text,
    "vendorType" text NOT NULL,
    "walletBalance" double precision DEFAULT '0.0' NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "Vendor" ("id", "name", "phoneNumber", "website", "supportEmail", "vendorType", "walletBalance", "createdAt", "updatedAt") VALUES
('5b1c3814-1aea-42f5-8d66-b1028793c018',	'MOFA',	'+447412558',	'https://mofa.com',	'support@mofa.com',	'VISA',	0,	'2026-06-23 17:46:51.148',	'2026-06-23 17:49:34.69'),
('bfa00e59-3d57-48bd-89d6-9d3a4625a650',	'Polani Travels LTD',	'020 8814 6052',	'https://www.polanitravel.com/',	'support@polanitravel.com',	'Flight',	0,	'2026-06-23 17:43:07.98',	'2026-06-26 15:22:34.528'),
('65b28593-f9ef-4473-b562-eea75c88316c',	'Brightsun Travel ',	'02088191212',	'https://www.btres.com',	'Call.Centre@brightsun.travel',	'Flight',	0,	'2026-06-26 15:25:04.633',	'2026-06-26 15:25:04.633'),
('b101d8cb-00b8-40c0-a4c3-93e2be8db81f',	'TBO',	'0330 818 6434',	'https://hotels.tboholidays.com/hotels/en-US/search',	'support@tbo.com',	'Accommodation',	0,	'2026-06-26 15:27:34.902',	'2026-06-26 15:27:34.902'),
('50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	'Basma Transport',	'00966 54 512 1968',	'https://basmaemaargroup.com/',	'Info@basmaemaargroup.com',	'Transportation',	0,	'2026-06-26 15:30:31.767',	'2026-06-26 15:30:31.767'),
('40011580-afe3-43e7-8c03-a6ad7fa710ac',	'Al Sultan Travel',	'+966 58 007 2972',	'https://sultan-logistics.com/',	'info@sultantransport.com',	'Transportation',	0,	'2026-06-26 15:32:53.51',	'2026-06-26 15:32:53.51'),
('41fbbab7-4296-4ee9-8ebe-020699b98e47',	'Basma Group',	'00966 54 512 1968',	'https://basmaemaargroup.com/umrah-visa/',	'Info@basmaemaargroup.com',	'VISA',	0,	'2026-06-26 15:34:09.811',	'2026-06-26 15:34:09.811'),
('58',	'insurte',	'447844455456',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('57',	'Harmain Trians',	'',	NULL,	NULL,	'Transport',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('56',	'Mishwark',	'',	NULL,	NULL,	'Transport',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('55',	'RA LTD',	'',	NULL,	NULL,	'Flight',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('54',	'webbeds',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('53',	'Travel Insurence (confused.com)',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('52',	'Expedia',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('51',	'GM Hotel',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('49',	'Umrah Hotel',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('48',	'saudi airline',	'',	NULL,	NULL,	'Flight',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('47',	'Funadiq',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('46',	'Morroco Visa',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('45',	'Kanan',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('44',	'umrah hotel',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('43',	'agoda',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('42',	'Serb',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('41',	'Mukhtara',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('40',	'Jet2.com',	'',	NULL,	NULL,	'Transport',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('39',	'Jet2.com',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('38',	'Jet2.com',	'',	NULL,	NULL,	'Flight',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('37',	'ASDAF VISA',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('36',	'Turkey Visa',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('35',	'Wosol',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('34',	'NADRA',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('33',	'VFS',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('32',	'wizz airline',	'',	NULL,	NULL,	'Flight',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('31',	'Mishwarak',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('30',	'Areotel Jeddah',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('29',	'UHI',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('28',	'Flix Bus',	'',	NULL,	NULL,	'Transport',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('27',	'Al Sultan Visa',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('26',	'Rates Hawk Transfer',	'',	NULL,	NULL,	'Transport',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('25',	'Riseway',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('24',	'Al Ebaa Makkah',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('23',	'MHT Visa',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('22',	'MHT',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('21',	'Hami Tour',	'+212673522754',	NULL,	NULL,	'Transport',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('20',	'Easy Jet',	'',	NULL,	NULL,	'Flight',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('19',	'Trip.com',	'',	NULL,	NULL,	'Flight',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('18',	'Halal Booking',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('17',	'Emstay',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('16',	'B2B Bookings',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('15',	'Stuba',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('14',	'Rates Hawk',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('13',	'Al Nazway Group',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('12',	'Emaar Group',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('11',	'Maysan Group',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('10',	'Marriot Hotel Makkah',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('9',	'Asdaf',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('8',	'Rezlive',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('7',	'Masterfare',	'',	NULL,	NULL,	'Flight',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('6',	'TBO Transfer',	'',	NULL,	NULL,	'Transport',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('4',	'Mofa',	'',	NULL,	NULL,	'VISA',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('3',	'Al Sultan',	'+966 58 007 2972',	NULL,	NULL,	'Transport',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('1',	'Brightsun Travel Ltd',	'',	NULL,	NULL,	'Flight',	0,	'2026-06-29 15:07:23.661',	'2026-06-29 15:07:23.661'),
('836f1aa6-7d5f-4b1f-a41c-246cb0132273',	'GRN',	'0121 565 1613',	NULL,	NULL,	'Accommodation',	0,	'2026-07-02 12:38:29.852',	'2026-07-02 12:38:29.852'),
('5f298e6a-ca20-4742-9a73-13f5d9abde00',	'Golden Crown Umrah Transport',	'+966500000000',	NULL,	NULL,	'Transport',	0,	'2026-06-30 11:41:24.309',	'2026-07-02 16:06:42.309'),
('2',	'TBO',	'',	NULL,	NULL,	'Accommodation',	0,	'2026-06-29 15:07:23.661',	'2026-07-02 16:56:39.879'),
('5',	'Polani Travel Ltd',	'',	NULL,	NULL,	'Flight',	1.60000000000002,	'2026-06-29 15:07:23.661',	'2026-07-03 13:31:48.628');

DROP TABLE IF EXISTS "VendorAuditLog";
CREATE TABLE "public"."VendorAuditLog" (
    "id" text NOT NULL,
    "action" text NOT NULL,
    "adminName" text NOT NULL,
    "adminId" text NOT NULL,
    "ipAddress" text,
    "oldValues" jsonb,
    "newValues" jsonb,
    "reason" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "VendorAuditLog_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "VendorAuditLog" ("id", "action", "adminName", "adminId", "ipAddress", "oldValues", "newValues", "reason", "createdAt") VALUES
('dc3bf2f5-a2be-4027-ac64-e4190634b1c7',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "bfa00e59-3d57-48bd-89d6-9d3a4625a650", "originalCost": 0}',	'Added services for vendor bfa00e59-3d57-48bd-89d6-9d3a4625a650 in booking #TT1101',	'2026-06-23 17:44:14.352'),
('0dae531c-8971-4125-917b-0710e0a5cec5',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 1200, "remainingBalance": 1200}',	'Service segment cost adjustment inside booking #TT1101',	'2026-06-23 17:44:40.321'),
('8350cc0e-27d6-4a9a-a70a-704ae47f87b5',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5b1c3814-1aea-42f5-8d66-b1028793c018", "originalCost": 32}',	'Added services for vendor 5b1c3814-1aea-42f5-8d66-b1028793c018 in booking #TT1101',	'2026-06-23 17:47:35.624'),
('f35719b5-3aff-4914-ae60-fd02406210e6',	'Payment Created',	'System Administrator',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"amount": 1200, "paymentId": "50ac1cef-2bac-49df-a221-5977663d7ba1", "allocations": [{"status": "PAID", "fromCash": 1200, "bookingId": "c3e90e57-40d7-4fbf-aa2b-caa746b42ab9", "fromWallet": 0, "allocatedAmount": 1200, "bookingReference": "TT1101"}], "walletCredited": 0, "walletDeducted": 0, "referenceNumber": "VP-20260623-000001"}',	'Paid for services: [Flight] PC 1166 (PNR: H764FC) - Booking: TT1101',	'2026-06-23 17:49:13.768'),
('7249785f-60f9-4447-8111-7d04d8c74bcb',	'Payment Created',	'System Administrator',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"amount": 32, "paymentId": "1b51eead-75fc-49f7-9f42-61755975e298", "allocations": [{"status": "PAID", "fromCash": 32, "bookingId": "c3e90e57-40d7-4fbf-aa2b-caa746b42ab9", "fromWallet": 0, "allocatedAmount": 32, "bookingReference": "TT1101"}], "walletCredited": 0, "walletDeducted": 0, "referenceNumber": "VP-20260623-000002"}',	'Paid for services: [Visa] E Wavier  (149009674) - Booking: TT1101',	'2026-06-23 17:49:34.696'),
('86948bab-5eb0-4521-b020-e404e345ec5a',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PAID", "originalCost": 1200, "remainingBalance": 0}',	'{"status": "PAID", "originalCost": 0, "remainingBalance": 0}',	'Service segment cost adjustment inside booking #TT1101',	'2026-06-26 13:52:23.177'),
('88c7f2a4-d93c-44f6-9a2f-fd1c4ae1e2c1',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "ecbd464e-04ab-46f4-bfd1-5e4d9d67c650", "originalCost": 100}',	'Added services for vendor ecbd464e-04ab-46f4-bfd1-5e4d9d67c650 in booking #TT1101',	'2026-06-26 13:52:23.21'),
('80dd9784-4e44-4c8e-9a61-286139c025e0',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"originalCost": 32}',	'{"status": "PARTIAL", "originalCost": 0}',	'Removed all services for vendor 5b1c3814-1aea-42f5-8d66-b1028793c018 in booking #TT1101',	'2026-06-26 13:52:29.949'),
('4f2862e3-7a49-49ba-898c-df7ae9f6ecb7',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"originalCost": 100}',	'{"status": "PAID", "originalCost": 0}',	'Removed all services for vendor ecbd464e-04ab-46f4-bfd1-5e4d9d67c650 in booking #TT1101',	'2026-06-26 13:52:32.671'),
('e6a21063-c8ef-44ce-9e4d-f24fc8d45ddc',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "65b28593-f9ef-4473-b562-eea75c88316c", "originalCost": 0}',	'Added services for vendor 65b28593-f9ef-4473-b562-eea75c88316c in booking #TT00964',	'2026-06-26 16:12:28.744'),
('3e5a5706-9581-4dc5-8670-50d7f779030b',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "1", "originalCost": 0}',	'Added services for vendor 1 in booking #TT00968',	'2026-06-29 19:47:59.444'),
('6a4720c0-16d9-4b1a-8c7e-231292cd6c14',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00968',	'2026-06-29 19:51:53.899'),
('86b70a2f-f194-447d-82ea-24dbd5eb32c0',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "6", "originalCost": 0}',	'Added services for vendor 6 in booking #TT00968',	'2026-06-29 19:55:05.115'),
('c904a0f6-e5bf-40f8-9a45-e932b5f69e89',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5b1c3814-1aea-42f5-8d66-b1028793c018", "originalCost": 35}',	'Added services for vendor 5b1c3814-1aea-42f5-8d66-b1028793c018 in booking #TT00968',	'2026-06-29 20:17:41.89'),
('ee4ae190-9054-4353-b4b7-e527e2ecbc90',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 0}',	'Added services for vendor 5 in booking #TT00968',	'2026-06-29 20:21:37.006'),
('99f5d085-ca4f-4b17-b88f-6e33691bcddc',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 0}',	'Added services for vendor 5 in booking #TT00969',	'2026-06-30 13:08:14.332'),
('870d0c5b-0b78-44c2-acf1-26945949271f',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00969',	'2026-06-30 13:12:50.558'),
('ae20f47b-1cf0-4ee9-8112-f3a5dbf7d6b7',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "4", "originalCost": 0}',	'Added services for vendor 4 in booking #TT00969',	'2026-06-30 13:13:40.538'),
('4595e629-ec52-4c88-b161-9b28e3200e25',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "34", "originalCost": 0}',	'Added services for vendor 34 in booking #TT00969',	'2026-06-30 13:13:57.234'),
('f847a150-c1ac-4ee8-b5ee-eab145cd4cf7',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "50fd9f2d-4964-4b67-bfa9-9bc09d46282b", "originalCost": 0}',	'Added services for vendor 50fd9f2d-4964-4b67-bfa9-9bc09d46282b in booking #TT00969',	'2026-06-30 14:07:18.219'),
('c27ab9bf-52a6-47c6-a594-d9b247c62e77',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "65b28593-f9ef-4473-b562-eea75c88316c", "originalCost": 0}',	'Added services for vendor 65b28593-f9ef-4473-b562-eea75c88316c in booking #TT00970',	'2026-06-30 17:07:58.334'),
('96c16830-b81b-4cc0-81f6-5a90c875ce49',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 0}',	'Added services for vendor 5 in booking #TT00970',	'2026-06-30 17:08:16.992'),
('27c419c1-e819-454f-b842-9f2e45719ecb',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "bfa00e59-3d57-48bd-89d6-9d3a4625a650", "originalCost": 0}',	'Added services for vendor bfa00e59-3d57-48bd-89d6-9d3a4625a650 in booking #TT00970',	'2026-06-30 17:08:23.616'),
('57ba8d26-8d91-4dae-bbb6-e94cae6630fe',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00970',	'2026-06-30 17:10:54.048'),
('973fe654-346b-4a94-8478-b99ffa3b30bd',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "50fd9f2d-4964-4b67-bfa9-9bc09d46282b", "originalCost": 0}',	'Added services for vendor 50fd9f2d-4964-4b67-bfa9-9bc09d46282b in booking #TT00970',	'2026-06-30 17:21:51.515'),
('bd9d4064-0b07-4bfa-a4ae-193a624b3160',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "41fbbab7-4296-4ee9-8ebe-020699b98e47", "originalCost": 0}',	'Added services for vendor 41fbbab7-4296-4ee9-8ebe-020699b98e47 in booking #TT00970',	'2026-06-30 17:23:37.584'),
('d9066bc9-ca72-46ee-b6cb-41282a1a742f',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5b1c3814-1aea-42f5-8d66-b1028793c018", "originalCost": 0}',	'Added services for vendor 5b1c3814-1aea-42f5-8d66-b1028793c018 in booking #TT00970',	'2026-06-30 17:28:55.312'),
('cf60deb8-b4f4-4f11-b4d3-387b2ec72846',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "50fd9f2d-4964-4b67-bfa9-9bc09d46282b", "originalCost": 0}',	'Added services for vendor 50fd9f2d-4964-4b67-bfa9-9bc09d46282b in booking #TT00945',	'2026-07-01 11:30:45.664'),
('6ed0c882-f8b5-4367-885e-90c4717fbd06',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 0}',	'Added services for vendor 5 in booking #TT00945',	'2026-07-01 12:08:19.056'),
('30db3814-8c31-41b3-a5ed-17af9482611e',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "19", "originalCost": 467.13}',	'Added services for vendor 19 in booking #TT00945',	'2026-07-01 13:06:08.695'),
('973b0f02-cf85-46a5-b489-280ec3549dcf',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "65b28593-f9ef-4473-b562-eea75c88316c", "originalCost": 0}',	'Added services for vendor 65b28593-f9ef-4473-b562-eea75c88316c in booking #TT00943',	'2026-07-01 13:07:08.19'),
('c0af3bbb-79ff-4bdd-bc71-6be0c6107851',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "1", "originalCost": 0}',	'Added services for vendor 1 in booking #TT00943',	'2026-07-01 13:08:27.752'),
('5b2a8487-ad29-4fdf-bf28-cb904829d14d',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5b1c3814-1aea-42f5-8d66-b1028793c018", "originalCost": 0}',	'Added services for vendor 5b1c3814-1aea-42f5-8d66-b1028793c018 in booking #TT00945',	'2026-07-01 13:11:33.143'),
('53794a41-736f-4e2a-93b9-2fc380e3df1c',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00945',	'2026-07-01 13:14:49.203'),
('72fb0112-4b0f-4fd5-9ea0-9d2e1805e70a',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 886.78}',	'Added services for vendor 5 in booking #TT00967',	'2026-07-01 13:44:01.775'),
('c2883181-d92f-451b-b764-82437fdc1b47',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "1", "originalCost": 0}',	'Added services for vendor 1 in booking #TT00957',	'2026-07-01 15:41:08.51'),
('d123088b-d63a-4968-862d-9acad3755903',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "16", "originalCost": 0}',	'Added services for vendor 16 in booking #TT00957',	'2026-07-01 15:44:36.32'),
('d9f1ae62-4cc2-4fd8-93e8-f21e30e5e423',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00957',	'2026-07-01 15:45:15.953'),
('f31055cc-9249-456c-ac92-c228b5eaf8de',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "3", "originalCost": 0}',	'Added services for vendor 3 in booking #TT00957',	'2026-07-01 15:46:07.84'),
('c562457d-29a0-47f7-b469-022f60b63a86',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "4", "originalCost": 0}',	'Added services for vendor 4 in booking #TT00957',	'2026-07-01 15:47:44.034'),
('68087cdb-43c4-472f-ac42-b179fee96df3',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "52", "originalCost": 53.23}',	'Added services for vendor 52 in booking #TT00945',	'2026-07-01 16:45:44.313'),
('e6f5d949-6f95-49c2-ad32-abd88466ac39',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'{"status": "PENDING", "originalCost": 53.23, "remainingBalance": 53.23}',	'{"status": "PENDING", "originalCost": 74.05, "remainingBalance": 74.05}',	'Service segment cost adjustment inside booking #TT00945',	'2026-07-01 16:47:50.216'),
('fff009ed-7189-4270-9dd7-bd4099a11822',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 41.37, "remainingBalance": 41.37}',	'Service segment cost adjustment inside booking #TT00945',	'2026-07-01 16:49:51.377'),
('02a2216c-9bd1-4158-8202-f67641b29f82',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'null',	'{"status": "PENDING", "vendorId": "41fbbab7-4296-4ee9-8ebe-020699b98e47", "originalCost": 125.53}',	'Added services for vendor 41fbbab7-4296-4ee9-8ebe-020699b98e47 in booking #TT00945',	'2026-07-01 16:51:14.526'),
('e1c38e56-1c84-479c-b051-b3d567a941af',	'Booking Updated',	'System',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	NULL,	'{"status": "PENDING", "originalCost": 125.53, "remainingBalance": 125.53}',	'{"status": "PENDING", "originalCost": 180.53, "remainingBalance": 180.53}',	'Service segment cost adjustment inside booking #TT00945',	'2026-07-01 16:52:55.51'),
('1c2ed820-49f5-494d-b394-3b1a6bb77a26',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "65b28593-f9ef-4473-b562-eea75c88316c", "originalCost": 0}',	'Added services for vendor 65b28593-f9ef-4473-b562-eea75c88316c in booking #TT00971',	'2026-07-01 20:22:14.029'),
('1e7ce0a2-17a3-4f5b-a771-565ed1648cc2',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00971',	'2026-07-01 20:24:24.287'),
('7104d988-483d-4b2d-a8d7-28b9a7f9243c',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "4", "originalCost": 0}',	'Added services for vendor 4 in booking #TT00971',	'2026-07-01 20:24:57.539'),
('d05e6562-b9d0-4729-8be3-73e7e61b6ec9',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "36", "originalCost": 51.44}',	'Added services for vendor 36 in booking #TT00971',	'2026-07-01 21:44:18.546'),
('5d1798b0-8f22-4a9a-847a-278bc336ba84',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "19", "originalCost": 0}',	'Added services for vendor 19 in booking #TT00971',	'2026-07-01 22:32:22.125'),
('f559a0c5-b48a-4358-980a-3eeb14623954',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 0}',	'Added services for vendor 5 in booking #TT00972',	'2026-07-01 23:05:26.02'),
('afc4568c-b8a3-406e-8fa0-ce8bb84c35ba',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "16", "originalCost": 247.54}',	'Added services for vendor 16 in booking #TT00971',	'2026-07-01 23:41:08.423'),
('f4a8fb85-b080-450c-a624-f870ed81669e',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "19", "originalCost": 0}',	'Added services for vendor 19 in booking #TT00803',	'2026-07-02 12:13:06.798'),
('319c6818-f6f0-437f-b75e-ddbcafb252c7',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 0}',	'Added services for vendor 5 in booking #TT00803',	'2026-07-02 12:13:50.064'),
('1b2fba2b-29c9-4e49-b834-bfe3127c92dd',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "24", "originalCost": 0}',	'Added services for vendor 24 in booking #TT00803',	'2026-07-02 12:17:06.323'),
('d2257d97-ec34-4d25-9a50-aad5360aa7bc',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "13", "originalCost": 0}',	'Added services for vendor 13 in booking #TT00803',	'2026-07-02 12:18:22.698'),
('c2950528-548f-4ad5-a13e-5a38de8d4ed6',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "27", "originalCost": 0}',	'Added services for vendor 27 in booking #TT00803',	'2026-07-02 12:19:09.265'),
('885d1483-6c43-4719-9bc7-525d42356db0',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "3", "originalCost": 0}',	'Added services for vendor 3 in booking #TT00803',	'2026-07-02 12:19:41.51'),
('2c44d75c-fa69-4ee4-8bd9-6803aa55d3a7',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "40011580-afe3-43e7-8c03-a6ad7fa710ac", "originalCost": 0}',	'Added services for vendor 40011580-afe3-43e7-8c03-a6ad7fa710ac in booking #TT00803',	'2026-07-02 12:21:09.999'),
('7caf1898-e451-4d38-9ec9-551e70f8647b',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 1, "remainingBalance": 1}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 12:22:39.606'),
('b7da6cfe-0acc-4460-9e3e-61d37867e86c',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 1, "remainingBalance": 1}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 12:23:33.853'),
('ae3248d0-cc56-4348-a771-27d0df2ef81c',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 1, "remainingBalance": 1}',	'{"status": "PENDING", "originalCost": 2, "remainingBalance": 2}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 12:23:44.84'),
('ede0d040-c3bf-4303-9e11-2130b31c8625',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 0}',	'Added services for vendor 5 in booking #TT00973',	'2026-07-02 12:29:22.013'),
('6e2abda8-e140-4224-90d9-2c462a700282',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'null',	'{"status": "PENDING", "vendorId": "16", "originalCost": 559}',	'Added services for vendor 16 in booking #TT00973',	'2026-07-02 12:42:52.523'),
('06fb830f-4666-4014-a575-b4f48c7fb1d2',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'null',	'{"status": "PENDING", "vendorId": "836f1aa6-7d5f-4b1f-a41c-246cb0132273", "originalCost": 378}',	'Added services for vendor 836f1aa6-7d5f-4b1f-a41c-246cb0132273 in booking #TT00973',	'2026-07-02 12:44:57.44'),
('a40caee0-a5c7-4680-bf10-1eb75be45e8b',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 378, "remainingBalance": 378}',	'{"status": "PENDING", "originalCost": 877, "remainingBalance": 877}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:47:06.83'),
('4ccac490-3dc8-459a-9387-edf4d6609124',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5b1c3814-1aea-42f5-8d66-b1028793c018", "originalCost": 0}',	'Added services for vendor 5b1c3814-1aea-42f5-8d66-b1028793c018 in booking #TT00803',	'2026-07-02 12:47:57.297'),
('1854653c-7794-4710-987a-5826fcf8636d',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'null',	'{"status": "PENDING", "vendorId": "50fd9f2d-4964-4b67-bfa9-9bc09d46282b", "originalCost": 0}',	'Added services for vendor 50fd9f2d-4964-4b67-bfa9-9bc09d46282b in booking #TT00973',	'2026-07-02 12:50:37.859'),
('1cb42005-a546-4684-9543-7b9c92bf8e87',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'null',	'{"status": "PENDING", "vendorId": "4", "originalCost": 840}',	'Added services for vendor 4 in booking #TT00973',	'2026-07-02 12:55:27.93'),
('8b61043c-e049-4c6e-ac83-600000e5e801',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 840, "remainingBalance": 840}',	'{"status": "PENDING", "originalCost": 1260, "remainingBalance": 1260}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:55:27.939'),
('191c44bb-88ae-4046-87b9-3fd26bf2f6f6',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 840, "remainingBalance": 840}',	'{"status": "PENDING", "originalCost": 1260, "remainingBalance": 1260}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:55:27.952'),
('b6c34cd9-7f66-4dda-9a45-4d0366bd3d50',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 840, "remainingBalance": 840}',	'{"status": "PENDING", "originalCost": 1260, "remainingBalance": 1260}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:55:27.974'),
('212f0228-ffb3-4b86-91dd-52cc18dbadc1',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 1260, "remainingBalance": 1260}',	'{"status": "PENDING", "originalCost": 2310, "remainingBalance": 2310}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:55:35.93'),
('4c6214bc-bc5b-4832-948a-beb2a1df953f',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 2310, "remainingBalance": 2310}',	'{"status": "PENDING", "originalCost": 2520, "remainingBalance": 2520}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:55:35.935'),
('78a38d01-d044-4a6b-b62e-b12e4911cadc',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 2310, "remainingBalance": 2310}',	'{"status": "PENDING", "originalCost": 2520, "remainingBalance": 2520}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:55:35.933'),
('9ee5a403-604a-48a3-9de2-9fe56a1775c8',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 2310, "remainingBalance": 2310}',	'{"status": "PENDING", "originalCost": 2520, "remainingBalance": 2520}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:55:35.938'),
('0e939dfb-9e7c-4e0d-8eac-c3987702e81a',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 2520, "remainingBalance": 2520}',	'{"status": "PENDING", "originalCost": 2346, "remainingBalance": 2346}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:55:54.306'),
('c96920b5-0ff5-4313-aa07-a801849a5e96',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 2346, "remainingBalance": 2346}',	'{"status": "PENDING", "originalCost": 2345, "remainingBalance": 2345}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:56:05.229'),
('49178a4d-d3cc-4e5d-8369-8bc80ec89533',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 2345, "remainingBalance": 2345}',	'{"status": "PENDING", "originalCost": 2170, "remainingBalance": 2170}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:56:11.966'),
('46248050-f35e-4cea-aff0-e41c478b5d3a',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 2170, "remainingBalance": 2170}',	'{"status": "PENDING", "originalCost": 1995, "remainingBalance": 1995}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:56:16.212'),
('b2088dd4-99d6-4ca1-b434-a8a971463b3d',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 1995, "remainingBalance": 1995}',	'{"status": "PENDING", "originalCost": 1820, "remainingBalance": 1820}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:56:25.336'),
('7772c71e-e3a3-469b-b55e-e2c47b8fb10f',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 1820, "remainingBalance": 1820}',	'{"status": "PENDING", "originalCost": 1645, "remainingBalance": 1645}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:56:29.251'),
('b5888c97-fbbc-4bcf-ac3d-00e4558dc56b',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 1645, "remainingBalance": 1645}',	'{"status": "PENDING", "originalCost": 1470, "remainingBalance": 1470}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:56:35.008'),
('1dc8ddf9-b19d-4535-8dc2-5242c9649e35',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 1470, "remainingBalance": 1470}',	'{"status": "PENDING", "originalCost": 1295, "remainingBalance": 1295}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:56:39.324'),
('ccd4f5d9-59c8-461e-965b-dee586ea0186',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 1295, "remainingBalance": 1295}',	'{"status": "PENDING", "originalCost": 1120, "remainingBalance": 1120}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 12:56:43.086'),
('ced48075-19c5-4fea-8e24-7dca48243512',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 1120, "remainingBalance": 1120}',	'{"status": "PENDING", "originalCost": 945, "remainingBalance": 945}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 13:53:29.209'),
('a945d9e8-4668-4475-81ec-0aaee37e95f7',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 945, "remainingBalance": 945}',	'{"status": "PENDING", "originalCost": 770, "remainingBalance": 770}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 13:53:34.341'),
('9f890fa9-5ff3-4dbc-9b37-4bf5b0016147',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 770, "remainingBalance": 770}',	'{"status": "PENDING", "originalCost": 595, "remainingBalance": 595}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 13:53:38.57'),
('0827a952-b177-47df-b0ee-accbcd1520f6',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 595, "remainingBalance": 595}',	'{"status": "PENDING", "originalCost": 420, "remainingBalance": 420}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-02 13:53:42.753'),
('8f81d07d-990d-4f27-8030-0c64c42a58ab',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 2007.1, "remainingBalance": 2007.1}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 15:27:23.134'),
('08c46deb-1f3e-414f-9d37-4dd7c2bee6d1',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"status": "PENDING", "vendorId": "1", "originalCost": 2613.5}',	'Added services for vendor 1 in booking #TT00803',	'2026-07-02 15:29:20.848'),
('f5db4324-211d-495a-a0e3-202e800e99e2',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 520.83, "remainingBalance": 520.83}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 15:33:49.425'),
('67651d8f-3144-4713-8776-8f32363dddd4',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 807.29, "remainingBalance": 807.29}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 15:35:42.708'),
('784857b8-4b3f-45ce-a9e4-70cfe4c7a4d5',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "12", "originalCost": 0}',	'Added services for vendor 12 in booking #TT00929',	'2026-07-02 15:37:11.14'),
('33843362-026b-47e0-a914-9c297917162c',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00929',	'2026-07-02 15:37:54.755'),
('3f41e40d-d9e0-4a7a-a1f0-df34dbe523a6',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 2, "remainingBalance": 2}',	'{"status": "PENDING", "originalCost": 323.91, "remainingBalance": 323.91}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 15:40:06.552'),
('2b20b4a7-3b21-498e-beff-5878073d4920',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 1, "remainingBalance": 1}',	'{"status": "PAID", "originalCost": 0, "remainingBalance": 0}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 15:40:33.563'),
('b06e472e-5abb-4971-9ecc-d3240402ce8f',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 323.91, "remainingBalance": 323.91}',	'{"status": "PENDING", "originalCost": 322.91, "remainingBalance": 322.91}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 15:40:38.103'),
('32be9104-869c-48ef-948e-d8b386620de7',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "50fd9f2d-4964-4b67-bfa9-9bc09d46282b", "originalCost": 0}',	'Added services for vendor 50fd9f2d-4964-4b67-bfa9-9bc09d46282b in booking #TT00929',	'2026-07-02 15:40:39.073'),
('f11fa940-1f6c-4692-87d2-e83d7d0b1829',	'Booking Updated',	'System',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 175, "remainingBalance": 175}',	'Service segment cost adjustment inside booking #TT00803',	'2026-07-02 15:41:05.922'),
('dd0a1a95-785b-4a64-95d3-cf4dad9228e8',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 239.58, "remainingBalance": 239.58}',	'Service segment cost adjustment inside booking #TT00929',	'2026-07-02 15:51:26.423'),
('4c000fb5-c66d-4b08-92ec-1e3170e771f8',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 324.47, "remainingBalance": 324.47}',	'Service segment cost adjustment inside booking #TT00929',	'2026-07-02 16:12:30.447'),
('e547d5cc-9d4e-4f44-82b8-754f2e654b3f',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "3", "originalCost": 0}',	'Added services for vendor 3 in booking #TT00929',	'2026-07-02 16:12:54.228'),
('b404f9f7-0df7-4d9e-b8b7-e19a6f29f3cd',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "40011580-afe3-43e7-8c03-a6ad7fa710ac", "originalCost": 0}',	'Added services for vendor 40011580-afe3-43e7-8c03-a6ad7fa710ac in booking #TT00929',	'2026-07-02 16:13:23.896'),
('80d70801-8c9b-4401-b244-2222f547fd63',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 395, "remainingBalance": 395}',	'Service segment cost adjustment inside booking #TT00929',	'2026-07-02 16:15:48.61'),
('3dd00b82-768b-4c84-8ad0-4be5dede5ac7',	'Payment Created',	'Hasnain Sanwal',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"amount": 324.47, "paymentId": "e4db8cf6-5b80-4bdd-a9c4-c2a56f52aa8a", "allocations": [{"status": "PAID", "fromCash": 324.47, "bookingId": "50a38298-9eb0-4018-a854-639091dbe9b3", "fromWallet": 0, "allocatedAmount": 324.47, "bookingReference": "TT00929"}], "walletCredited": 0, "walletDeducted": 0, "referenceNumber": "VP-20260702-000001"}',	'Paid for services: [Hotel] Valy Al Madinah (Quad Room) - Booking: TT00929',	'2026-07-02 16:56:39.886'),
('4f397c43-4acc-4f01-af26-88824769e31a',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00936',	'2026-07-02 17:41:19.411'),
('055a43e2-76bc-4c2f-8275-2639426f9578',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "50fd9f2d-4964-4b67-bfa9-9bc09d46282b", "originalCost": 0}',	'Added services for vendor 50fd9f2d-4964-4b67-bfa9-9bc09d46282b in booking #TT00936',	'2026-07-02 17:42:47.579'),
('a12e11d7-311d-4c90-bf32-8687693eb301',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "41fbbab7-4296-4ee9-8ebe-020699b98e47", "originalCost": 0}',	'Added services for vendor 41fbbab7-4296-4ee9-8ebe-020699b98e47 in booking #TT00936',	'2026-07-02 17:44:53.906'),
('e366ce75-a145-4149-b9d7-950d0e4ea2ca',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5b1c3814-1aea-42f5-8d66-b1028793c018", "originalCost": 0}',	'Added services for vendor 5b1c3814-1aea-42f5-8d66-b1028793c018 in booking #TT00936',	'2026-07-02 17:45:35.696'),
('9c7824d0-df79-4ca8-86b4-4fe9800a8012',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "65b28593-f9ef-4473-b562-eea75c88316c", "originalCost": 0}',	'Added services for vendor 65b28593-f9ef-4473-b562-eea75c88316c in booking #TT00959',	'2026-07-02 18:43:13.965'),
('bef99cc0-8d12-4b02-93ba-8ffe345a77c4',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "1", "originalCost": 0}',	'Added services for vendor 1 in booking #TT00959',	'2026-07-02 18:45:13.35'),
('4405becb-f62b-48c1-8a61-a0ae702bb83e',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "27", "originalCost": 0}',	'Added services for vendor 27 in booking #TT00959',	'2026-07-02 18:50:50.231'),
('b44541d1-406b-4ad2-aa8c-4a4905f274b0',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5b1c3814-1aea-42f5-8d66-b1028793c018", "originalCost": 0}',	'Added services for vendor 5b1c3814-1aea-42f5-8d66-b1028793c018 in booking #TT00959',	'2026-07-02 18:51:12.898'),
('92f31382-77e2-42d2-86ef-ad96d3a11006',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 559, "remainingBalance": 559}',	'{"status": "PENDING", "originalCost": 648.94, "remainingBalance": 648.94}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-03 00:11:17.814'),
('b13ac8d8-2c18-48ef-92e3-f6bfad19a8ed',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 877, "remainingBalance": 877}',	'{"status": "PENDING", "originalCost": 899.33, "remainingBalance": 899.33}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-03 00:20:56.491'),
('1b0eb40f-6957-4acc-b7c6-0aeaf53154f7',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 648.94}',	'Added services for vendor 2 in booking #TT00973',	'2026-07-03 00:22:21.474'),
('f090d5ad-cc07-4765-8699-974e05b58bb9',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"originalCost": 648.94}',	'{"status": "PAID", "originalCost": 0}',	'Removed all services for vendor 16 in booking #TT00973',	'2026-07-03 00:22:21.513'),
('4a110f72-70f8-4814-860d-56837b7f059f',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PAID", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 521.33, "remainingBalance": 521.33}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-03 00:22:30.213'),
('0ed22897-21e8-4232-9a79-e01937a9d838',	'Booking Updated',	'System',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	NULL,	'{"status": "PENDING", "originalCost": 899.33, "remainingBalance": 899.33}',	'{"status": "PENDING", "originalCost": 378, "remainingBalance": 378}',	'Service segment cost adjustment inside booking #TT00973',	'2026-07-03 00:22:30.234'),
('7e27e0e3-b3e1-4542-a85f-12d98edf920d',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'null',	'{"status": "PENDING", "vendorId": "5", "originalCost": 0}',	'Added services for vendor 5 in booking #TT00TT00912',	'2026-07-03 10:32:07.447'),
('a185b290-f58c-47f6-b6b3-35c38a84316b',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'null',	'{"status": "PENDING", "vendorId": "2", "originalCost": 0}',	'Added services for vendor 2 in booking #TT00TT00912',	'2026-07-03 11:00:16.284'),
('ca04a76c-f2c8-4dc8-90b0-72f5adfde3b2',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'null',	'{"status": "PENDING", "vendorId": "50fd9f2d-4964-4b67-bfa9-9bc09d46282b", "originalCost": 0}',	'Added services for vendor 50fd9f2d-4964-4b67-bfa9-9bc09d46282b in booking #TT00TT00912',	'2026-07-03 11:15:18.226'),
('5df3b5ca-34ff-401a-8906-d4b4748a33b1',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'{"status": "PENDING", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 443.4, "remainingBalance": 443.4}',	'Service segment cost adjustment inside booking #TT00972',	'2026-07-03 11:19:25.331'),
('c342d551-fba5-4471-a716-befbf6f62787',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'{"status": "PENDING", "originalCost": 443.4, "remainingBalance": 443.4}',	'{"status": "PENDING", "originalCost": 886.8, "remainingBalance": 886.8}',	'Service segment cost adjustment inside booking #TT00972',	'2026-07-03 11:19:32.662'),
('009ea907-7833-4f2a-b7a2-c8dab2bf0bd3',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'{"status": "PENDING", "originalCost": 886.8, "remainingBalance": 886.8}',	'{"status": "PENDING", "originalCost": 443.4, "remainingBalance": 443.4}',	'Service segment cost adjustment inside booking #TT00972',	'2026-07-03 11:20:30.21'),
('63a15894-7bf0-4289-96a7-c1e810949fef',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'{"originalCost": 443.4}',	'{"status": "PAID", "originalCost": 0}',	'Removed all services for vendor 5 in booking #TT00972',	'2026-07-03 11:20:56.385'),
('89db765e-0e2a-48c3-8fc5-ae95f5500c55',	'Booking Updated',	'System',	'c8fb18b0-04ae-4460-9267-a321aac805c6',	NULL,	'{"status": "PAID", "originalCost": 0, "remainingBalance": 0}',	'{"status": "PENDING", "originalCost": 443.4, "remainingBalance": 443.4}',	'Service segment cost adjustment inside booking #TT00972',	'2026-07-03 11:21:27.391'),
('c8bccbe7-a4e0-4209-be8b-41aa03fe8344',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "40011580-afe3-43e7-8c03-a6ad7fa710ac", "originalCost": 0}',	'Added services for vendor 40011580-afe3-43e7-8c03-a6ad7fa710ac in booking #TT00929',	'2026-07-03 12:08:15.128'),
('0cb5501c-7895-47e1-85d5-c5e34bdbb95e',	'Booking Updated',	'System',	'420d80dc-2d84-4454-aa76-e22b50f01213',	NULL,	'null',	'{"status": "PENDING", "vendorId": "40011580-afe3-43e7-8c03-a6ad7fa710ac", "originalCost": 0}',	'Added services for vendor 40011580-afe3-43e7-8c03-a6ad7fa710ac in booking #TT00936',	'2026-07-03 13:03:26.738'),
('44436754-cf2f-444e-8c92-94fd707518f5',	'Payment Created',	'Hasnain Sanwal',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	NULL,	'null',	'{"amount": 445, "paymentId": "3a77753c-7e32-42c4-8235-909818e1670c", "allocations": [{"status": "PAID", "fromCash": 443.4, "bookingId": "e3da6462-67d7-4098-b88e-6fd2a4bd78ac", "fromWallet": 0, "allocatedAmount": 443.4, "bookingReference": "TT00972"}], "walletCredited": 1.600000000000023, "walletDeducted": 0, "referenceNumber": "VP-20260703-000001"}',	'Paid for services: [Flight] QR 621 (PNR: HBPPGQ) - Booking: TT00972',	'2026-07-03 13:31:48.633');

DROP TABLE IF EXISTS "VendorLedger";
CREATE TABLE "public"."VendorLedger" (
    "id" text NOT NULL,
    "vendorId" text,
    "bookingId" text,
    "bookingReference" text,
    "eventType" text NOT NULL,
    "debit" double precision DEFAULT '0.0' NOT NULL,
    "credit" double precision DEFAULT '0.0' NOT NULL,
    "runningBalance" double precision NOT NULL,
    "notes" text,
    "referenceNumber" text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "agentId" text,
    CONSTRAINT "VendorLedger_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "VendorLedger" ("id", "vendorId", "bookingId", "bookingReference", "eventType", "debit", "credit", "runningBalance", "notes", "referenceNumber", "createdById", "createdAt", "agentId") VALUES
('82da2d8b-86cf-47ef-88c0-613d70452ef8',	NULL,	'32ba5865-c826-4c7c-b4c7-33537b639330',	'TT00964',	'CUSTOMER_PAYMENT',	1260,	0,	1260,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782489585560-WhatsApp Image 2026-06-26 at 16.46.24.jpeg',	'manual_tx_1782489589695_o1ik',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 00:00:00',	NULL),
('713264ef-2d67-4dee-9316-fd59b20242a9',	NULL,	'32ba5865-c826-4c7c-b4c7-33537b639330',	'TT00964',	'CUSTOMER_PAYMENT',	0,	12.6,	1247.4,	'Credit Card Charges for customer payment (Paid by Company)',	'manual_tx_1782489589695_o1ik-cc',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-26 00:00:00',	NULL),
('e0c429d1-0e91-460e-ac1c-4a3bbcde0552',	NULL,	'28226c92-d76d-4cfb-ba4c-31f17208dfb9',	'TT00965',	'CUSTOMER_PAYMENT',	20,	0,	1280,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782514062050-payment.png',	'manual_tx_1782514078479_k6xx',	'fb69c410-7863-4086-9763-1c9d771fdbd3',	'2026-06-27 00:00:00',	NULL),
('70b5a03c-462d-46a0-8028-e58279689f66',	NULL,	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'TT00968',	'CUSTOMER_PAYMENT',	40,	0,	1320,	'Customer payment received',	'manual_tx_1782760231920_utam',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-29 00:00:00',	NULL),
('85277080-2d9f-4b17-b28e-a4d99211436a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'TT00968',	'INVOICE_CREATED',	35,	0,	35,	'Initial vendor invoice cost recorded for booking #TT00968',	NULL,	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-06-29 20:17:41.88',	NULL),
('be66e833-89ec-42f7-b9f4-2b4ee901ca8a',	NULL,	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'TT00968',	'CUSTOMER_PAYMENT',	507,	0,	1827,	'Customer payment received',	'manual_tx_1782832546893_zwdz',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-30 00:00:00',	NULL),
('53b9be39-854c-4c64-8db1-21908a40176f',	NULL,	'2cc7284b-affa-4eec-9a56-af93962c223b',	'TT00970',	'CUSTOMER_PAYMENT',	20,	0,	1847,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782837838863-Recipt.jpeg',	'manual_tx_1782837843742_j3r5',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-06-30 00:00:00',	NULL),
('d31e19b3-037b-4386-813f-5fff9fd37ad7',	'19',	'5e668417-02ad-40c0-8c73-723257ee4349',	'TT00945',	'INVOICE_CREATED',	467.13,	0,	467.13,	'Initial vendor invoice cost recorded for booking #TT00945',	NULL,	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-01 13:06:08.687',	NULL),
('f9eaab74-2e00-44be-9973-825b8bfdd742',	NULL,	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'TT00943',	'CUSTOMER_PAYMENT',	600,	0,	2427,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782910708254-aftabbbb.png',	'manual_tx_1782913058508_5w1d',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 00:00:00',	NULL),
('b7907162-443b-4368-bee0-8e4b6dad23fd',	NULL,	'cadd4698-8b26-4cf2-9b9e-891a9f29fdac',	'TT00943',	'CUSTOMER_PAYMENT',	1000,	0,	3427,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782910767024-aftabbshjsh.png',	'manual_tx_1782913060990_u5lm',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 00:00:00',	NULL),
('dc5daba6-4a25-4b57-821c-58a208bbdbf6',	NULL,	'575da188-44f7-467b-83a6-ee1cbb5b2797',	'TT00939',	'CUSTOMER_PAYMENT',	625,	0,	3052,	'He paid £625 via bank transfer and remaining £150 into our office. Receipt: https://cdn.terrifictravel.co.uk/users/1782902326576-WhatsApp Image 2026-06-02 at 19.00.03.jpeg',	'manual_tx_1782913068580_mmxq',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-01 00:00:00',	NULL),
('a020e901-6a59-4105-b26f-e66e05ec14b8',	NULL,	'28d19384-d41c-4d6d-b47e-2317e11ace06',	'TT00967',	'CUSTOMER_PAYMENT',	928,	0,	3355,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782913232700-WhatsApp Image 2026-06-29 at 19.23.34.jpeg',	'manual_tx_1782913247443_vct4',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-29 00:00:00',	NULL),
('1803583f-b679-4fb5-8116-c84bec0be688',	'5',	'28d19384-d41c-4d6d-b47e-2317e11ace06',	'TT00967',	'INVOICE_CREATED',	886.78,	0,	886.78,	'Initial vendor invoice cost recorded for booking #TT00967',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 13:44:01.739',	NULL),
('88a8ed33-0ced-4dac-9bee-17817407b37b',	'52',	'5e668417-02ad-40c0-8c73-723257ee4349',	'TT00945',	'INVOICE_CREATED',	53.23,	0,	53.23,	'Initial vendor invoice cost recorded for booking #TT00945',	NULL,	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-01 16:45:44.306',	NULL),
('16b1c26a-61f7-4e69-92ac-679da79842ff',	'52',	'5e668417-02ad-40c0-8c73-723257ee4349',	'TT00945',	'INVOICE_CREATED',	20.82,	0,	74.05,	'Booking vendor invoice adjustment: original cost updated from 53.23 to 74.05',	NULL,	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-01 16:47:50.195',	NULL),
('aff1aaa5-2614-43d5-8d34-608a3535c7a0',	'2',	'5e668417-02ad-40c0-8c73-723257ee4349',	'TT00945',	'INVOICE_CREATED',	41.37,	0,	41.37,	'Initial vendor invoice cost recorded for booking #TT00945',	NULL,	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-01 16:49:51.37',	NULL),
('2c98f32d-82ee-40e0-b584-6772c8068e1e',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	'5e668417-02ad-40c0-8c73-723257ee4349',	'TT00945',	'INVOICE_CREATED',	125.53,	0,	125.53,	'Initial vendor invoice cost recorded for booking #TT00945',	NULL,	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-01 16:51:14.518',	NULL),
('f052714e-4444-4302-bfe1-49e1bdf5af85',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	'5e668417-02ad-40c0-8c73-723257ee4349',	'TT00945',	'INVOICE_CREATED',	55,	0,	180.53,	'Booking vendor invoice adjustment: original cost updated from 125.53 to 180.53',	NULL,	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-01 16:52:55.5',	NULL),
('89285e26-b368-4610-8c8e-f6eec075eb70',	NULL,	'5e668417-02ad-40c0-8c73-723257ee4349',	'TT00945',	'CUSTOMER_PAYMENT',	40,	0,	2467,	'Customer payment received',	'manual_tx_1782927180668_05pv',	'd47ce6c4-c1b3-4c59-b609-b3082061aff1',	'2026-07-01 00:00:00',	NULL),
('628c23f4-1bb9-496f-9e42-8289c4b8de43',	NULL,	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'TT00971',	'CUSTOMER_PAYMENT',	20,	0,	2447,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782936706907-payment 2.jpeg',	'manual_tx_1782936832721_kg22',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 00:00:00',	NULL),
('aaf7f698-4fda-409e-ba46-9082e8f2281b',	NULL,	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'TT00971',	'CUSTOMER_PAYMENT',	1000,	0,	3447,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782936727318-payment 1 .jpeg',	'manual_tx_1782936834838_es2m',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 00:00:00',	NULL),
('caaf4a09-1aaa-45d2-98ae-531f2787a34e',	'36',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'TT00971',	'INVOICE_CREATED',	51.44,	0,	51.44,	'Initial vendor invoice cost recorded for booking #TT00971',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 21:44:18.538',	NULL),
('6fa30ed0-7abd-48da-a023-d58fb1ef43d8',	'16',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'TT00971',	'INVOICE_CREATED',	247.54,	0,	247.54,	'Initial vendor invoice cost recorded for booking #TT00971',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-01 23:41:08.412',	NULL),
('e4422dd8-5218-42b8-8ead-27d94e82fd32',	NULL,	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'CUSTOMER_PAYMENT',	1500,	0,	3947,	'Receipt: https://cdn.terrifictravel.co.uk/users/1782993092146-WhatsApp Image 2026-07-01 at 19.59.28.jpeg',	'manual_tx_1782993326303_0nkk',	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-01 00:00:00',	NULL),
('cd346517-989b-4ecc-abca-ce211a79e82a',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	1,	0,	1,	'Initial vendor invoice cost recorded for booking #TT00803',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 12:22:39.599',	NULL),
('a3b8f030-797d-4b3f-a3ae-0825505fe855',	'3',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	1,	0,	1,	'Initial vendor invoice cost recorded for booking #TT00803',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 12:23:33.842',	NULL),
('85aef6a5-a813-4592-8af0-b4af09be93a8',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	1,	0,	2,	'Booking vendor invoice adjustment: original cost updated from 1 to 2',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 12:23:44.824',	NULL),
('e677b31f-16cf-4ef4-8c48-3346a87df582',	'16',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	559,	0,	806.54,	'Initial vendor invoice cost recorded for booking #TT00973',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:42:52.516',	NULL),
('a292dd35-ffd0-4527-8201-8d38b40bf28e',	'836f1aa6-7d5f-4b1f-a41c-246cb0132273',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	378,	0,	378,	'Initial vendor invoice cost recorded for booking #TT00973',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:44:57.432',	NULL),
('edf86cd1-3aeb-4bc5-9437-b6e298b24ed4',	'836f1aa6-7d5f-4b1f-a41c-246cb0132273',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	499,	0,	877,	'Booking vendor invoice adjustment: original cost updated from 378 to 877',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:47:06.822',	NULL),
('dec7b0e8-7be8-4733-865b-3f8c8d238085',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	840,	0,	840,	'Initial vendor invoice cost recorded for booking #TT00973',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:27.901',	NULL),
('f36704e1-0f1d-4fe3-8245-b91557be8fb9',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	420,	0,	420,	'Booking vendor invoice adjustment: original cost updated from 840 to 1260',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:27.927',	NULL),
('0e3484d6-7f51-4657-aa38-26ae90e8d2c9',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	420,	0,	1260,	'Booking vendor invoice adjustment: original cost updated from 840 to 1260',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:27.938',	NULL),
('40062aa5-dd98-48a4-b11f-cc09ef05d469',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	420,	0,	1260,	'Booking vendor invoice adjustment: original cost updated from 840 to 1260',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:27.94',	NULL),
('6f3563f7-8bac-4ef5-89e9-421f185c84fe',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	1050,	0,	2310,	'Booking vendor invoice adjustment: original cost updated from 1260 to 2310',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:35.917',	NULL),
('abe44f3a-94ca-474d-b9ec-13e1e650440f',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	210,	0,	1470,	'Booking vendor invoice adjustment: original cost updated from 2310 to 2520',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:35.925',	NULL),
('66dd5cf4-8f34-4a40-b67b-7f7dafc513a7',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	210,	0,	1470,	'Booking vendor invoice adjustment: original cost updated from 2310 to 2520',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:35.927',	NULL),
('172240b8-3770-468b-bb53-444af2c6dd92',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	210,	0,	2520,	'Booking vendor invoice adjustment: original cost updated from 2310 to 2520',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:35.931',	NULL),
('7e695597-58ea-4c00-89e3-54bb4cea6648',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	174,	2346,	'Booking vendor invoice adjustment: original cost updated from 2520 to 2346',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:55:54.294',	NULL),
('e6f4f7bf-9883-44d6-9fbd-7ad59c80a57a',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	1,	2345,	'Booking vendor invoice adjustment: original cost updated from 2346 to 2345',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:56:05.221',	NULL),
('c7a6ee12-8731-4ebc-9ed1-8b23668bfee0',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	2170,	'Booking vendor invoice adjustment: original cost updated from 2345 to 2170',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:56:11.961',	NULL),
('5dfd066a-1876-4696-bd19-4c16d91704b2',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	1995,	'Booking vendor invoice adjustment: original cost updated from 2170 to 1995',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:56:16.208',	NULL),
('71536e5d-cb5d-4fa2-b771-d6302cf5c73e',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	1820,	'Booking vendor invoice adjustment: original cost updated from 1995 to 1820',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:56:25.33',	NULL),
('40ebff21-0562-47a7-bd54-1decd52ba5b7',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	1645,	'Booking vendor invoice adjustment: original cost updated from 1820 to 1645',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:56:29.247',	NULL),
('ca8f5bf5-147c-43a5-a46a-b4c895abcd9a',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	1470,	'Booking vendor invoice adjustment: original cost updated from 1645 to 1470',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:56:34.999',	NULL),
('35c75c42-a519-4c51-9e7f-4393c207be1b',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	1295,	'Booking vendor invoice adjustment: original cost updated from 1470 to 1295',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:56:39.314',	NULL),
('943b9f20-ab1b-4028-ad2a-c2f92b76d6cb',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	1120,	'Booking vendor invoice adjustment: original cost updated from 1295 to 1120',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 12:56:43.078',	NULL),
('54cb5de3-7fdc-4b78-bc77-43b0946bf381',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	945,	'Booking vendor invoice adjustment: original cost updated from 1120 to 945',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 13:53:29.2',	NULL),
('804d9843-ee78-467a-ab8f-d9063e31afb4',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	770,	'Booking vendor invoice adjustment: original cost updated from 945 to 770',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 13:53:34.335',	NULL),
('03eee92c-28f6-431e-a933-f8cf66010f7d',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	595,	'Booking vendor invoice adjustment: original cost updated from 770 to 595',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 13:53:38.555',	NULL),
('463342a5-13d0-4d61-a773-669b6e01bc97',	'4',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	175,	420,	'Booking vendor invoice adjustment: original cost updated from 595 to 420',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-02 13:53:42.747',	NULL),
('abd73697-9833-40af-b89f-401c6120bc3c',	NULL,	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'CUSTOMER_PAYMENT',	2500,	0,	4947,	'Customer payment received',	'manual_tx_1783005692545_jwdv',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-01-09 00:00:00',	NULL),
('c4127bb9-fe1a-4d4c-a50d-2f0568b8df29',	NULL,	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'CUSTOMER_PAYMENT',	1000,	0,	3447,	'Customer payment received',	'manual_tx_1783005716792_25yi',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-02-13 00:00:00',	NULL),
('3ad8291b-7e7e-4ac2-9b91-325a59207728',	NULL,	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'CUSTOMER_PAYMENT',	800,	0,	3247,	'Customer payment received',	'manual_tx_1783005735070_nnvu',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-03-26 00:00:00',	NULL),
('d7ed02fa-2eb5-4d58-a93e-87771a362606',	NULL,	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'CUSTOMER_PAYMENT',	500,	0,	2947,	'Customer payment received',	'manual_tx_1783005776806_ob01',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-05-09 00:00:00',	NULL),
('d951ff1e-c486-4ee7-b0a4-6a5f97f7f38d',	NULL,	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'CUSTOMER_PAYMENT',	1400,	0,	3847,	'Customer payment received',	'manual_tx_1783005798025_9ezd',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-05-31 00:00:00',	NULL),
('2ab875c2-90c5-4a0d-a07f-1e50166a52f8',	NULL,	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'CUSTOMER_PAYMENT',	300,	0,	2747,	'Customer payment received',	'manual_tx_1783005819424_59x6',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-01 00:00:00',	NULL),
('60376ef7-8ca8-4073-a43a-b9924fc61cf6',	'19',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	2007.1,	0,	2474.23,	'Initial vendor invoice cost recorded for booking #TT00803',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:27:23.123',	NULL),
('9f3b811e-b3fe-4d18-8628-ec518943f41e',	'1',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	2613.5,	0,	2613.5,	'Initial vendor invoice cost recorded for booking #TT00803',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:29:20.838',	NULL),
('109b0673-070e-45eb-bd5a-88fa85152911',	'24',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	520.83,	0,	520.83,	'Initial vendor invoice cost recorded for booking #TT00803',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:33:49.418',	NULL),
('0db9dfec-fe2d-43fa-969a-158e5d4c5147',	'13',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	807.29,	0,	807.29,	'Initial vendor invoice cost recorded for booking #TT00803',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:35:42.698',	NULL),
('4dc4b38a-4ea4-4d3a-94c6-a12e1ece56e8',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	321.91,	0,	323.91,	'Booking vendor invoice adjustment: original cost updated from 2 to 323.91',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:40:06.53',	NULL),
('fdec0aae-e05a-45dc-9307-f971cd961fb4',	'3',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	0,	1,	0,	'Booking vendor invoice adjustment: original cost updated from 1 to 0',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:40:33.556',	NULL),
('57626926-496b-4e0d-9aa4-a9b29ec86e29',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	0,	1,	322.91,	'Booking vendor invoice adjustment: original cost updated from 323.91 to 322.91',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:40:38.096',	NULL),
('ebd30dd2-25d7-4a05-bb11-676cd7f6b4be',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'TT00803',	'INVOICE_CREATED',	175,	0,	210,	'Initial vendor invoice cost recorded for booking #TT00803',	NULL,	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 15:41:05.913',	NULL),
('4a958522-ef96-48ab-8393-2571ec509cf8',	NULL,	'50a38298-9eb0-4018-a854-639091dbe9b3',	'TT00929',	'CUSTOMER_PAYMENT',	1040,	0,	3487,	'Customer payment received',	'manual_tx_1783007308437_rak3',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 00:00:00',	NULL),
('89354d91-214d-4007-a6bb-669ddee4c244',	NULL,	'50a38298-9eb0-4018-a854-639091dbe9b3',	'TT00929',	'CUSTOMER_PAYMENT',	98,	0,	2545,	'Customer payment received',	'manual_tx_1783007320624_00hk',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-01 00:00:00',	NULL),
('e9b2324d-3e25-4fde-a06d-1975200fcc51',	'12',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'TT00929',	'INVOICE_CREATED',	239.58,	0,	239.58,	'Initial vendor invoice cost recorded for booking #TT00929',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 15:51:26.406',	NULL),
('5d885150-ecc9-4114-a984-41622f4f1315',	'2',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'TT00929',	'INVOICE_CREATED',	324.47,	0,	365.84,	'Initial vendor invoice cost recorded for booking #TT00929',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 16:12:30.436',	NULL),
('08737de2-1998-4a40-8dd5-c8744e9c7921',	'3',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'TT00929',	'INVOICE_CREATED',	395,	0,	395,	'Initial vendor invoice cost recorded for booking #TT00929',	NULL,	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 16:15:48.584',	NULL),
('36c4f370-63a0-41c2-b7fc-f07a02478141',	NULL,	NULL,	NULL,	'AGENT_PAYOUT',	56.9,	0,	0,	'Agent Margin Payout for 2026-06-01 to 2026-07-31 | Bookings: TT00929',	'MARGIN-B68E07',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 16:35:18.67',	'455bbf6d-c482-408d-b449-7df76e15f696'),
('348d397a-bff4-432a-bc88-bc1e57f80ec9',	'2',	'50a38298-9eb0-4018-a854-639091dbe9b3',	'TT00929',	'VENDOR_PAYMENT',	0,	324.47,	41.3699999999999,	'Cash payment allocation from reference VP-20260702-000001',	'VP-20260702-000001',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-02 16:56:39.865',	NULL),
('ac94a58a-8220-46b9-96f0-f378491934d9',	NULL,	'10d1d925-f85f-499f-9de5-feec5b465c44',	'TT00936',	'CUSTOMER_PAYMENT',	1000,	0,	1000,	'Receipt: https://cdn.terrifictravel.co.uk/users/1783013726508-Alishbah booking.png',	'manual_tx_1783014459175_d96u',	'420d80dc-2d84-4454-aa76-e22b50f01213',	'2026-07-02 00:00:00',	NULL),
('9b343cb4-e65d-4728-8df8-d131e686663a',	'16',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	89.9400000000001,	0,	896.48,	'Booking vendor invoice adjustment: original cost updated from 559 to 648.94',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-03 00:11:17.805',	NULL),
('a2f4b503-6597-4fa7-8d69-820cbb352b7e',	'836f1aa6-7d5f-4b1f-a41c-246cb0132273',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	22.33,	0,	899.33,	'Booking vendor invoice adjustment: original cost updated from 877 to 899.33',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-03 00:20:56.475',	NULL),
('7bf99c9a-f265-439d-bfcf-c4937586a5c3',	'2',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	648.94,	0,	690.31,	'Initial vendor invoice cost recorded for booking #TT00973',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-03 00:22:21.454',	NULL),
('67de70e7-56c1-40dc-a222-b1b5079673d6',	'16',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	648.94,	247.54,	'Services removed for this vendor from booking #TT00973',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-03 00:22:21.498',	NULL),
('6133105a-23cc-4590-8d2d-ff4a1d99ee90',	'16',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	521.33,	0,	768.87,	'Initial vendor invoice cost recorded for booking #TT00973',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-03 00:22:30.206',	NULL),
('7b2a812b-4d45-4658-a911-07b60101317f',	'836f1aa6-7d5f-4b1f-a41c-246cb0132273',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'TT00973',	'INVOICE_CREATED',	0,	521.33,	378,	'Booking vendor invoice adjustment: original cost updated from 899.33 to 378',	NULL,	'1738f420-d4af-4928-8e33-eeceb35b8c3c',	'2026-07-03 00:22:30.227',	NULL),
('eed72f16-f368-4428-9840-dac6a4edbfc6',	'5',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'TT00972',	'INVOICE_CREATED',	443.4,	0,	1330.18,	'Initial vendor invoice cost recorded for booking #TT00972',	NULL,	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-03 11:19:25.324',	NULL),
('af5ae034-9cbf-4b7a-ac25-3ad64574a478',	'5',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'TT00972',	'INVOICE_CREATED',	443.4,	0,	1773.58,	'Booking vendor invoice adjustment: original cost updated from 443.4 to 886.8',	NULL,	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-03 11:19:32.65',	NULL),
('d1fecdad-9017-4df7-9547-8aa916d9eb2e',	'5',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'TT00972',	'INVOICE_CREATED',	0,	443.4,	1330.18,	'Booking vendor invoice adjustment: original cost updated from 886.8 to 443.4',	NULL,	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-03 11:20:30.201',	NULL),
('3cf643e2-df0c-437b-993c-2a411ba244cd',	'5',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'TT00972',	'INVOICE_CREATED',	0,	443.4,	886.78,	'Services removed for this vendor from booking #TT00972',	NULL,	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-03 11:20:56.379',	NULL),
('66c7ee20-ced3-4daf-af11-684cbf6f8a70',	'5',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'TT00972',	'INVOICE_CREATED',	443.4,	0,	1330.18,	'Initial vendor invoice cost recorded for booking #TT00972',	NULL,	'c8fb18b0-04ae-4460-9267-a321aac805c6',	'2026-07-03 11:21:27.381',	NULL),
('405b02f5-2dd7-4e29-a942-dc13097ac02a',	NULL,	'78871a43-43e5-46e2-b96c-8db80a1de236',	'TT00959',	'CUSTOMER_PAYMENT',	550,	0,	550,	'Customer payment received',	'manual_tx_1783080387228_ck6q',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-20 00:00:00',	NULL),
('48648eca-358c-4767-b8b4-99d1630fb291',	NULL,	'78871a43-43e5-46e2-b96c-8db80a1de236',	'TT00959',	'CUSTOMER_PAYMENT',	180,	0,	180,	'Customer payment received',	'manual_tx_1783080407044_vd8q',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-06-29 00:00:00',	NULL),
('226976ea-9ff7-41d7-b311-b7e01ddc910f',	'5',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	'TT00972',	'VENDOR_PAYMENT',	0,	443.4,	886.78,	'Cash payment allocation from reference VP-20260703-000001',	'VP-20260703-000001',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:31:48.58',	NULL),
('1d691275-b24a-497d-96f4-a884b8a40457',	'5',	NULL,	NULL,	'VENDOR_PAYMENT',	0,	1.60000000000002,	885.18,	'Overpayment cash processed from payment VP-20260703-000001',	'VP-20260703-000001',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:31:48.601',	NULL),
('dc662e31-40ad-4e66-9f48-cfcb854f1f9b',	'5',	NULL,	NULL,	'WALLET_CREDIT',	1.60000000000002,	0,	886.78,	'Surplus cash transferred to wallet credit',	'VP-20260703-000001',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:31:48.614',	NULL);

DROP TABLE IF EXISTS "VendorPayment";
CREATE TABLE "public"."VendorPayment" (
    "id" text NOT NULL,
    "vendorId" text NOT NULL,
    "amount" double precision NOT NULL,
    "bankAccount" text,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdById" text NOT NULL,
    "isReversed" boolean DEFAULT false NOT NULL,
    "notes" text,
    "paymentMethod" text NOT NULL,
    "receiptUrl" text,
    "referenceNumber" text NOT NULL,
    "reversedAt" timestamp(3),
    "reversedById" text,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "VendorPayment_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "VendorPayment_referenceNumber_key" ON public."VendorPayment" USING btree ("referenceNumber");

INSERT INTO "VendorPayment" ("id", "vendorId", "amount", "bankAccount", "createdAt", "createdById", "isReversed", "notes", "paymentMethod", "receiptUrl", "referenceNumber", "reversedAt", "reversedById", "updatedAt") VALUES
('50ac1cef-2bac-49df-a221-5977663d7ba1',	'bfa00e59-3d57-48bd-89d6-9d3a4625a650',	1200,	NULL,	'2026-06-23 17:49:13.672',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'0',	'Paid for services: [Flight] PC 1166 (PNR: H764FC) - Booking: TT1101',	'Bank Transfer',	NULL,	'VP-20260623-000001',	NULL,	NULL,	'2026-06-23 17:49:13.672'),
('1b51eead-75fc-49f7-9f42-61755975e298',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	32,	NULL,	'2026-06-23 17:49:34.655',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'0',	'Paid for services: [Visa] E Wavier  (149009674) - Booking: TT1101',	'Bank Transfer',	NULL,	'VP-20260623-000002',	NULL,	NULL,	'2026-06-23 17:49:34.655'),
('e4db8cf6-5b80-4bdd-a9c4-c2a56f52aa8a',	'2',	324.47,	'Capital on tap',	'2026-07-02 16:56:39.767',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'0',	'Paid for services: [Hotel] Valy Al Madinah (Quad Room) - Booking: TT00929',	'Credit Card',	NULL,	'VP-20260702-000001',	NULL,	NULL,	'2026-07-02 16:56:39.767'),
('3a77753c-7e32-42c4-8235-909818e1670c',	'5',	445,	NULL,	'2026-07-03 13:31:48.482',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'0',	'Paid for services: [Flight] QR 621 (PNR: HBPPGQ) - Booking: TT00972',	'Bank Transfer',	NULL,	'VP-20260703-000001',	NULL,	NULL,	'2026-07-03 13:31:48.482');

DROP TABLE IF EXISTS "VendorPaymentAllocation";
CREATE TABLE "public"."VendorPaymentAllocation" (
    "id" text NOT NULL,
    "vendorPaymentId" text NOT NULL,
    "bookingId" text NOT NULL,
    "amount" double precision NOT NULL,
    "isReversed" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "VendorPaymentAllocation_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "VendorPaymentAllocation" ("id", "vendorPaymentId", "bookingId", "amount", "isReversed", "createdAt") VALUES
('58ef03aa-e192-487e-b32b-4817086ab94b',	'e4db8cf6-5b80-4bdd-a9c4-c2a56f52aa8a',	'50a38298-9eb0-4018-a854-639091dbe9b3',	324.47,	'0',	'2026-07-02 16:56:39.822'),
('2bc405ea-4a15-4339-a0c3-74014d004478',	'3a77753c-7e32-42c4-8235-909818e1670c',	'e3da6462-67d7-4098-b88e-6fd2a4bd78ac',	443.4,	'0',	'2026-07-03 13:31:48.567');

DROP TABLE IF EXISTS "VendorWallet";
CREATE TABLE "public"."VendorWallet" (
    "id" text NOT NULL,
    "vendorId" text NOT NULL,
    "balance" double precision DEFAULT '0.0' NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) NOT NULL,
    CONSTRAINT "VendorWallet_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX "VendorWallet_vendorId_key" ON public."VendorWallet" USING btree ("vendorId");

INSERT INTO "VendorWallet" ("id", "vendorId", "balance", "createdAt", "updatedAt") VALUES
('9a40e6db-ca88-449a-8f14-c8622b014d6e',	'bfa00e59-3d57-48bd-89d6-9d3a4625a650',	0,	'2026-06-23 17:43:07.986',	'2026-06-23 17:49:13.75'),
('e0af621d-6ce8-4f19-a447-5e362f7d4baa',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	0,	'2026-06-23 17:46:51.156',	'2026-06-23 17:49:34.684'),
('2918e408-63bd-40c1-9982-c83a563935f3',	'65b28593-f9ef-4473-b562-eea75c88316c',	0,	'2026-06-26 15:25:04.642',	'2026-06-26 15:25:04.642'),
('54a92e2f-7f06-4288-ad91-5b7d4ec43a60',	'b101d8cb-00b8-40c0-a4c3-93e2be8db81f',	0,	'2026-06-26 15:27:34.912',	'2026-06-26 15:27:34.912'),
('d308109e-53f8-428e-affb-1b4c69af2c85',	'50fd9f2d-4964-4b67-bfa9-9bc09d46282b',	0,	'2026-06-26 15:30:31.778',	'2026-06-26 15:30:31.778'),
('78664cf3-9e01-4b74-9f1a-d246c17e93e0',	'40011580-afe3-43e7-8c03-a6ad7fa710ac',	0,	'2026-06-26 15:32:53.517',	'2026-06-26 15:32:53.517'),
('1c8691b8-8c72-4bb5-8387-7d307f39dd48',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	0,	'2026-06-26 15:34:09.832',	'2026-06-26 15:34:09.832'),
('9f30cced-8a7e-43ff-b20b-3753e98a0029',	'836f1aa6-7d5f-4b1f-a41c-246cb0132273',	0,	'2026-07-02 12:38:29.859',	'2026-07-02 12:38:29.859'),
('8c24e7e4-156d-4f96-9cc2-fc949a73e044',	'2',	0,	'2026-07-02 16:56:39.748',	'2026-07-02 16:56:39.872'),
('2181346b-4c1d-40c6-b79c-b37e563a4689',	'5',	1.60000000000002,	'2026-07-03 13:31:48.46',	'2026-07-03 13:31:48.619');

DROP TABLE IF EXISTS "VendorWalletTransaction";
CREATE TABLE "public"."VendorWalletTransaction" (
    "id" text NOT NULL,
    "walletId" text NOT NULL,
    "amount" double precision NOT NULL,
    "type" text NOT NULL,
    "reference" text,
    "notes" text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "VendorWalletTransaction_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "VendorWalletTransaction" ("id", "walletId", "amount", "type", "reference", "notes", "createdById", "createdAt") VALUES
('b826fbe1-9339-47dc-be47-5fe3b0694d3b',	'2181346b-4c1d-40c6-b79c-b37e563a4689',	1.60000000000002,	'CREDIT_OVERPAYMENT',	'VP-20260703-000001',	'Overpayment credit allocation',	'baf4459c-aeb3-464e-b39e-7a1b26430b59',	'2026-07-03 13:31:48.587');

DROP TABLE IF EXISTS "VisaService";
CREATE TABLE "public"."VisaService" (
    "id" text NOT NULL,
    "bookingId" text NOT NULL,
    "vendorId" text NOT NULL,
    "passportNumber" text NOT NULL,
    "visaType" text NOT NULL,
    "visaNumber" text,
    "issueDate" timestamp(3),
    "expiryDate" timestamp(3),
    "price" double precision NOT NULL,
    "currency" text NOT NULL,
    "otherCurrency" text,
    "conversionRate" double precision,
    "refundAmount" double precision DEFAULT '0.0' NOT NULL,
    "fineAmount" double precision DEFAULT '0.0' NOT NULL,
    CONSTRAINT "VisaService_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

INSERT INTO "VisaService" ("id", "bookingId", "vendorId", "passportNumber", "visaType", "visaNumber", "issueDate", "expiryDate", "price", "currency", "otherCurrency", "conversionRate", "refundAmount", "fineAmount") VALUES
('ace62bfd-60de-4a72-b192-4df2e1a31334',	'63c9f7b2-5bee-42cd-8ce0-2c5cb63768c7',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'551122572',	'E Wavier VISA',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('9124fe6d-c54d-4045-8cb0-f8eb09da94ee',	'45965037-7ab0-4cb6-844d-2cd30628dc6c',	'34',	'NN1518801',	'E Waiver Visa',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('fe581ec8-7ec1-4c59-b57b-a5b58328137d',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'148190613',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('22e336ff-b6ec-4764-8dd8-97170ebabb5c',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'310757841',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('daf2445c-4886-4a77-9bd6-0f2e7fbe12bb',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'RM4134672',	'Umrah Visa',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('a9a893cc-9f14-447a-b2d5-9ee62109bb9a',	'2cc7284b-affa-4eec-9a56-af93962c223b',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	'HH8911432',	'Umrah Visa',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('06e1705e-37ae-4e97-8477-6868ad6330fb',	'b9baff9b-fd5c-45b4-9e16-392cad8ef9dc',	'4',	'123785018',	'Tourist ',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('797fcedf-7694-4619-a9f2-f9881633641b',	'5e668417-02ad-40c0-8c73-723257ee4349',	'41fbbab7-4296-4ee9-8ebe-020699b98e47',	'PL1837631',	'UMRAH VISA ',	'6168603923',	'2026-07-01 00:00:00',	'2026-09-29 00:00:00',	125.53,	'GBP',	'590',	4.7,	0,	0),
('32ad16df-25b4-4d70-ab50-9b452fd2cdae',	'0c1b1779-27c5-4469-8215-f0e0776a8b3a',	'36',	'CK8913433',	'Tourist Visa',	'',	NULL,	NULL,	51.44,	'GBP',	NULL,	NULL,	0,	0),
('62ebd41e-745f-4457-b176-1bdd7be5680a',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'151910425',	'210',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('ee360d9b-81ce-4380-b6f3-70a462187b91',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'160377465',	'210',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('f53f3d94-a294-4404-8214-1170bbd41c6b',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'160379492',	'210',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('f2b81955-416c-4fe6-a652-40e4603c3621',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'146260192',	'210',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('f5117700-245e-400b-8167-380e95cdbc38',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'310558956',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('736ff94f-aeac-4aed-b839-1321dcd4a174',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'152683978',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('47455c19-3026-4ce4-a715-0820863a3525',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'555603338',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('39f41d3b-2ab8-4533-9506-193f956d37ae',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'148190613',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('cceaa583-ef61-4353-aaf6-d6d6a7ce8c9b',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'310757841',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('5e316fea-708d-4761-b308-1b9cf7eff203',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'138677097',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('c4078d19-dea2-462a-9ab1-61c71c16a48a',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'310558956',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('281cc877-f31b-45d3-8131-cd35119befb8',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'152683978',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('aed9b0bd-d116-4923-ba59-ea0c30858f30',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'138677097',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('7790d214-2f11-43be-b8b5-4172425dd7aa',	'8aa6c76b-b7a4-47fd-bc85-7031c3cb6d43',	'4',	'555603338',	'E-Visa Waiver',	'',	NULL,	NULL,	35,	'GBP',	NULL,	NULL,	0,	0),
('c6010383-15da-4f9d-a5ea-24f544f21433',	'939de709-1e07-45e5-b3d9-1439a9de3bec',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'160406857',	'210',	'',	NULL,	NULL,	175,	'GBP',	NULL,	NULL,	0,	0),
('508c33d9-0d58-4a6b-9717-6b215cc8ac17',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'MT1174502',	'Umrah Visa',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('11490838-b3b3-4ec1-bf7a-8ac9eecb6304',	'10d1d925-f85f-499f-9de5-feec5b465c44',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'JH8960041',	'Umrah Visa',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('1609d698-8732-40f5-8d0d-eaa3187e0bbf',	'78871a43-43e5-46e2-b96c-8db80a1de236',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'BX8458893',	'Umrah Visa',	'',	NULL,	NULL,	0,	'GBP',	NULL,	NULL,	0,	0),
('79a6f541-e0ce-4f7a-8fd7-9665a61550ed',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'133906079',	'e waiver visa',	NULL,	'2022-07-05 23:00:00',	'2032-07-05 23:00:00',	35,	'GBP',	NULL,	NULL,	0,	0),
('24743907-162b-4eaf-91e1-8d592cb9ac5a',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'141905973',	'e waiver visa',	NULL,	'2023-07-31 23:00:00',	'2033-07-31 23:00:00',	35,	'GBP',	NULL,	NULL,	0,	0),
('c2d6f5fe-2daf-44e4-b98d-8e7892a7c6ac',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'134148219',	'e waiver visa',	NULL,	'2022-06-30 23:00:00',	'2027-06-30 23:00:00',	35,	'GBP',	NULL,	NULL,	0,	0),
('ae608d45-3390-47eb-b1a9-40ac17f5cbdc',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'135000232',	'e waiver visa',	NULL,	'2022-09-19 23:00:00',	'2027-09-19 23:00:00',	35,	'GBP',	NULL,	NULL,	0,	0),
('b790cf5d-f7a4-4f6a-8fe6-d4fdead366ef',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'124727575',	'e waiver visa',	NULL,	'2021-02-06 00:00:00',	'2026-02-06 00:00:00',	35,	'GBP',	NULL,	NULL,	0,	0),
('798d2cdf-6631-4c08-94a3-c4e61e2b4cd7',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'123210552',	'e waiver visa',	NULL,	'2021-02-04 00:00:00',	'2026-02-04 00:00:00',	35,	'GBP',	NULL,	NULL,	0,	0),
('11eb4c1c-e83c-4542-ba01-dc9f066163fc',	'62bbc9b7-e986-482f-b135-9aa9942b847a',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'154504314',	'e waiver visa',	NULL,	'2025-03-26 00:00:00',	'2030-03-26 00:00:00',	35,	'GBP',	NULL,	NULL,	0,	0),
('3587c315-9edf-4d3f-8af3-d613843bcd4b',	'd0729aaa-738f-467b-82cd-d52e508657ba',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'',	'4 E Wavier visa',	NULL,	NULL,	NULL,	140,	'GBP',	NULL,	NULL,	0,	0),
('871ed3b0-c52c-4943-82a5-684ab522bd56',	'601d79fa-fd05-403b-8dcf-35b75039db6b',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'British',	'E-VISA',	'5',	NULL,	NULL,	175,	'gbp',	NULL,	NULL,	0,	0),
('61c2e50c-6627-4c7a-9b1b-bb28b06747a1',	'73eab461-94a8-47c6-913f-7eaa439426f5',	'5b1c3814-1aea-42f5-8d66-b1028793c018',	'EF5136512',	'TOURIST VISA',	NULL,	'2024-10-10 23:00:00',	'2034-10-10 23:00:00',	0,	'£',	NULL,	NULL,	0,	0);

DROP TABLE IF EXISTS "_prisma_migrations";
CREATE TABLE "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamptz,
    "migration_name" character varying(255) NOT NULL,
    "logs" text,
    "rolled_back_at" timestamptz,
    "started_at" timestamptz DEFAULT now() NOT NULL,
    "applied_steps_count" integer DEFAULT '0' NOT NULL,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);


ALTER TABLE ONLY "public"."AccommodationService" ADD CONSTRAINT "AccommodationService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."AccommodationService" ADD CONSTRAINT "AccommodationService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."AdditionalService" ADD CONSTRAINT "AdditionalService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."AdditionalService" ADD CONSTRAINT "AdditionalService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."AgentMargin" ADD CONSTRAINT "AgentMargin_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."AgentMargin" ADD CONSTRAINT "AgentMargin_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."AgentSlab" ADD CONSTRAINT "AgentSlab_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Attendance" ADD CONSTRAINT "Attendance_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."Booking" ADD CONSTRAINT "Booking_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."Booking" ADD CONSTRAINT "Booking_agentMarginId_fkey" FOREIGN KEY ("agentMarginId") REFERENCES "AgentMargin"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."Booking" ADD CONSTRAINT "Booking_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."Booking" ADD CONSTRAINT "Booking_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."BookingItem" ADD CONSTRAINT "BookingItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."BookingItem" ADD CONSTRAINT "BookingItem_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."BookingItem" ADD CONSTRAINT "BookingItem_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."BookingItem" ADD CONSTRAINT "BookingItem_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."BookingTransaction" ADD CONSTRAINT "BookingTransaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."BookingVendorPayment" ADD CONSTRAINT "BookingVendorPayment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."BookingVendorPayment" ADD CONSTRAINT "BookingVendorPayment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."FileUpload" ADD CONSTRAINT "FileUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."Flight" ADD CONSTRAINT "Flight_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."Flight" ADD CONSTRAINT "Flight_arrivalAirportId_fkey" FOREIGN KEY ("arrivalAirportId") REFERENCES "Airport"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."Flight" ADD CONSTRAINT "Flight_departureAirportId_fkey" FOREIGN KEY ("departureAirportId") REFERENCES "Airport"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."FlightReservation" ADD CONSTRAINT "FlightReservation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."FlightReservation" ADD CONSTRAINT "FlightReservation_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."FlightService" ADD CONSTRAINT "FlightService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."FlightService" ADD CONSTRAINT "FlightService_flightReservationId_fkey" FOREIGN KEY ("flightReservationId") REFERENCES "FlightReservation"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."FlightService" ADD CONSTRAINT "FlightService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Invoice" ADD CONSTRAINT "Invoice_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Passenger" ADD CONSTRAINT "Passenger_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."Passenger" ADD CONSTRAINT "Passenger_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."PassengerDocument" ADD CONSTRAINT "PassengerDocument_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."PaymentRequest" ADD CONSTRAINT "PaymentRequest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."PaymentRequest" ADD CONSTRAINT "PaymentRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."PaymentRequest" ADD CONSTRAINT "PaymentRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."Tour" ADD CONSTRAINT "Tour_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."TransportService" ADD CONSTRAINT "TransportService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."TransportService" ADD CONSTRAINT "TransportService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."User" ADD CONSTRAINT "User_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."VendorLedger" ADD CONSTRAINT "VendorLedger_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."VendorLedger" ADD CONSTRAINT "VendorLedger_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."VendorLedger" ADD CONSTRAINT "VendorLedger_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."VendorLedger" ADD CONSTRAINT "VendorLedger_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."VendorPayment" ADD CONSTRAINT "VendorPayment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."VendorPayment" ADD CONSTRAINT "VendorPayment_reversedById_fkey" FOREIGN KEY ("reversedById") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY "public"."VendorPayment" ADD CONSTRAINT "VendorPayment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."VendorPaymentAllocation" ADD CONSTRAINT "VendorPaymentAllocation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."VendorPaymentAllocation" ADD CONSTRAINT "VendorPaymentAllocation_vendorPaymentId_fkey" FOREIGN KEY ("vendorPaymentId") REFERENCES "VendorPayment"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."VendorWallet" ADD CONSTRAINT "VendorWallet_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."VendorWalletTransaction" ADD CONSTRAINT "VendorWalletTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY "public"."VendorWalletTransaction" ADD CONSTRAINT "VendorWalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "VendorWallet"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."VisaService" ADD CONSTRAINT "VisaService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY "public"."VisaService" ADD CONSTRAINT "VisaService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

-- 2026-07-03 13:49:30 UTC
