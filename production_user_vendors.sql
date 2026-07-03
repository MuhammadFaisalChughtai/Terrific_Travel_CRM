-- Adminer 5.4.2 PostgreSQL 15.18 dump

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


ALTER TABLE ONLY "public"."User" ADD CONSTRAINT "User_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- 2026-07-03 13:33:27 UTC