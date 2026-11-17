import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main";

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (quoted) {
      if (character === '"' && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  if (quoted) {
    throw new Error("OurAirports CSV ended inside a quoted field.");
  }

  return rows;
}

async function downloadCsv(filename) {
  const response = await fetch(`${source}/${filename}`);
  if (!response.ok) {
    throw new Error(`Could not download ${filename}: HTTP ${response.status}`);
  }
  return response.text();
}

function toRecords(csv) {
  const [header, ...rows] = parseCsv(csv);
  if (!header || rows.length === 0) {
    throw new Error("OurAirports returned an empty CSV.");
  }

  return rows.map((row) =>
    Object.fromEntries(header.map((column, index) => [column, row[index] ?? ""]))
  );
}

async function main() {
  const [airportsCsv, countriesCsv] = await Promise.all([
    downloadCsv("airports.csv"),
    downloadCsv("countries.csv")
  ]);
  const countries = new Map(
    toRecords(countriesCsv).map((country) => [country.code, country.name])
  );

  const typePriority = {
    large_airport: 3,
    medium_airport: 2,
    small_airport: 1,
    seaplane_base: 0
  };

  const candidates = toRecords(airportsCsv)
    .filter((airport) =>
      /^[A-Z]{3}$/.test(airport.iata_code) &&
      Object.hasOwn(typePriority, airport.type) &&
      airport.name
    )
    .sort((left, right) => {
      const priorityDifference =
        (right.scheduled_service === "yes" ? 1 : 0) -
        (left.scheduled_service === "yes" ? 1 : 0) ||
        typePriority[right.type] - typePriority[left.type];
      return priorityDifference ||
        left.iata_code.localeCompare(right.iata_code) ||
        left.name.localeCompare(right.name);
    });

  const seenIataCodes = new Set();
  const airports = candidates
    .filter((airport) => {
      if (seenIataCodes.has(airport.iata_code)) return false;
      seenIataCodes.add(airport.iata_code);
      return true;
    })
    .map((airport) => ({
      icao: airport.icao_code || airport.gps_code || airport.ident,
      iata: airport.iata_code,
      name: airport.name,
      city: airport.municipality || airport.name,
      country: countries.get(airport.iso_country) || airport.iso_country
    }));

  if (airports.length === 0) {
    throw new Error("No airports with valid IATA codes were found.");
  }

  const outputPath = fileURLToPath(new URL("../public/airports.json", import.meta.url));
  await writeFile(outputPath, `${JSON.stringify(airports)}\n`, "utf8");
  console.log(`Wrote ${airports.length} airports to ${outputPath}`);
}

main().catch((error) => {
  console.error(`Failed to update airport data: ${error.message}`);
  process.exitCode = 1;
});
