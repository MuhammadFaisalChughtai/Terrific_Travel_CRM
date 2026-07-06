const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const accommodations = await prisma.accommodationService.findMany();
  const vendors = await prisma.vendor.findMany();
  const vendorIds = new Set(vendors.map(v => v.id));

  let count = 0;
  for (const acc of accommodations) {
    if (acc.vendorId && !vendorIds.has(acc.vendorId)) {
       await prisma.accommodationService.update({
         where: { id: acc.id },
         data: { vendorId: null }
       });
       count++;
    }
  }
  console.log('Fixed ' + count + ' AccommodationServices');
  
  const flights = await prisma.flightService.findMany();
  let fcount = 0;
  for (const f of flights) {
    if (f.vendorId && !vendorIds.has(f.vendorId)) {
       await prisma.flightService.update({
         where: { id: f.id },
         data: { vendorId: null }
       });
       fcount++;
    }
  }
  console.log('Fixed ' + fcount + ' FlightServices');

  const transports = await prisma.transportService.findMany();
  let tcount = 0;
  for (const t of transports) {
    if (t.vendorId && !vendorIds.has(t.vendorId)) {
       await prisma.transportService.update({
         where: { id: t.id },
         data: { vendorId: null }
       });
       tcount++;
    }
  }
  console.log('Fixed ' + tcount + ' TransportServices');

  const visas = await prisma.visaService.findMany();
  let vcount = 0;
  for (const v of visas) {
    if (v.vendorId && !vendorIds.has(v.vendorId)) {
       await prisma.visaService.update({
         where: { id: v.id },
         data: { vendorId: null }
       });
       vcount++;
    }
  }
  console.log('Fixed ' + vcount + ' VisaServices');

  const others = await prisma.additionalService.findMany();
  let ocount = 0;
  for (const o of others) {
    if (o.vendorId && !vendorIds.has(o.vendorId)) {
       await prisma.additionalService.update({
         where: { id: o.id },
         data: { vendorId: null }
       });
       ocount++;
    }
  }
  console.log('Fixed ' + ocount + ' AdditionalServices');
}

fix().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
