import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, '../../../data/airport.txt');
  console.log('Reading airports from:', filePath);
  
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  console.log(`Found ${lines.length} lines. Importing...`);
  
  const multiWordCountries = [
    'united kingdom', 'united states', 'saudi arabia', 'ivory coast', 
    'south australia', 'new zealand', 'south africa', 'costa rica', 
    'sri lanka', 'united arab emirates', 'puerto rico', 'papua new guinea', 
    'dominican republic', 'el salvador', 'czech republic', 'hong kong',
    'bosnia and herzegovina', 'trinidad and tobago', 'caboverde',
    'são tomé and príncipe', 'sao tome and principe'
  ];

  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || i === 0) continue; // Skip header/empty lines
    
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;
    
    const code = parts[0].toUpperCase();
    if (code.length !== 3) continue;
    
    const rest = parts.slice(1);
    const fullName = rest.join(' ');
    
    let country = '';
    let city = '';
    let name = '';
    
    const lowerName = fullName.toLowerCase();
    let foundCountry = '';
    for (const c of multiWordCountries) {
      if (lowerName.endsWith(c)) {
        foundCountry = c;
        break;
      }
    }
    
    if (foundCountry) {
      country = foundCountry.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const withoutCountry = fullName.slice(0, -foundCountry.length).trim();
      const subParts = withoutCountry.split(/\s+/);
      if (subParts.length > 0) {
        city = subParts[subParts.length - 1];
        city = city.charAt(0).toUpperCase() + city.slice(1);
        name = subParts.slice(0, -1).join(' ');
      } else {
        city = 'Unknown';
        name = withoutCountry;
      }
    } else {
      const len = rest.length;
      if (len >= 3) {
        country = rest[len - 1];
        country = country.charAt(0).toUpperCase() + country.slice(1);
        city = rest[len - 2];
        city = city.charAt(0).toUpperCase() + city.slice(1);
        name = rest.slice(0, len - 2).join(' ');
      } else if (len === 2) {
        country = rest[1];
        country = country.charAt(0).toUpperCase() + country.slice(1);
        city = rest[0];
        city = city.charAt(0).toUpperCase() + city.slice(1);
        name = rest.join(' ');
      } else {
        country = rest[0];
        country = country.charAt(0).toUpperCase() + country.slice(1);
        city = rest[0];
        city = city.charAt(0).toUpperCase() + city.slice(1);
        name = rest[0];
      }
    }
    
    name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (!name) name = fullName;
    
    let countryUpper = country.toUpperCase();
    if (countryUpper === 'UK') country = 'United Kingdom';
    else if (countryUpper === 'USA') country = 'United States';
    
    await prisma.airport.upsert({
      where: { code },
      update: { name, city, country },
      create: { code, name, city, country }
    });
    
    count++;
    if (count % 100 === 0) {
      console.log(`Upserted ${count} airports...`);
    }
  }
  
  console.log(`Done! Successfully imported ${count} airports into the database.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
