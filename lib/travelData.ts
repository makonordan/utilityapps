/**
 * Static data shared by the Travel Tools — airlines, airports + cities (with
 * IANA time zones and coordinates).
 *
 * Sources: each airline's published baggage policy and the IATA airport
 * directory. Verify against the airline / airport website for travel — the
 * `LAST_UPDATED` constant is the last time these tables were reviewed.
 */

export const LAST_UPDATED = "2026-05-23";

// ---------- Airports + cities (great-circle and time-zone source) ----------

export interface TravelPlace {
  /** IATA 3-letter airport code. */
  iata: string;
  /** ICAO 4-letter airport code. */
  icao: string;
  /** Airport name. */
  airport: string;
  /** Display city. */
  city: string;
  /** ISO 3166-1 alpha-2 country code (uppercase). */
  country: string;
  /** Country display name. */
  countryName: string;
  /** IANA time zone, e.g. "America/New_York". */
  tz: string;
  /** Decimal latitude. */
  lat: number;
  /** Decimal longitude. */
  lng: number;
}

export const PLACES: TravelPlace[] = [
  // North America
  { iata: "ATL", icao: "KATL", airport: "Hartsfield-Jackson Atlanta International", city: "Atlanta", country: "US", countryName: "United States", tz: "America/New_York", lat: 33.6407, lng: -84.4277 },
  { iata: "LAX", icao: "KLAX", airport: "Los Angeles International", city: "Los Angeles", country: "US", countryName: "United States", tz: "America/Los_Angeles", lat: 33.9416, lng: -118.4085 },
  { iata: "ORD", icao: "KORD", airport: "O'Hare International", city: "Chicago", country: "US", countryName: "United States", tz: "America/Chicago", lat: 41.9742, lng: -87.9073 },
  { iata: "DFW", icao: "KDFW", airport: "Dallas/Fort Worth International", city: "Dallas", country: "US", countryName: "United States", tz: "America/Chicago", lat: 32.8998, lng: -97.0403 },
  { iata: "DEN", icao: "KDEN", airport: "Denver International", city: "Denver", country: "US", countryName: "United States", tz: "America/Denver", lat: 39.8561, lng: -104.6737 },
  { iata: "JFK", icao: "KJFK", airport: "John F. Kennedy International", city: "New York", country: "US", countryName: "United States", tz: "America/New_York", lat: 40.6413, lng: -73.7781 },
  { iata: "LGA", icao: "KLGA", airport: "LaGuardia", city: "New York", country: "US", countryName: "United States", tz: "America/New_York", lat: 40.7769, lng: -73.8740 },
  { iata: "SFO", icao: "KSFO", airport: "San Francisco International", city: "San Francisco", country: "US", countryName: "United States", tz: "America/Los_Angeles", lat: 37.6213, lng: -122.3790 },
  { iata: "SEA", icao: "KSEA", airport: "Seattle-Tacoma International", city: "Seattle", country: "US", countryName: "United States", tz: "America/Los_Angeles", lat: 47.4502, lng: -122.3088 },
  { iata: "MIA", icao: "KMIA", airport: "Miami International", city: "Miami", country: "US", countryName: "United States", tz: "America/New_York", lat: 25.7959, lng: -80.2870 },
  { iata: "BOS", icao: "KBOS", airport: "Boston Logan", city: "Boston", country: "US", countryName: "United States", tz: "America/New_York", lat: 42.3656, lng: -71.0096 },
  { iata: "EWR", icao: "KEWR", airport: "Newark Liberty International", city: "Newark", country: "US", countryName: "United States", tz: "America/New_York", lat: 40.6895, lng: -74.1745 },
  { iata: "LAS", icao: "KLAS", airport: "Harry Reid International", city: "Las Vegas", country: "US", countryName: "United States", tz: "America/Los_Angeles", lat: 36.0840, lng: -115.1537 },
  { iata: "YYZ", icao: "CYYZ", airport: "Toronto Pearson International", city: "Toronto", country: "CA", countryName: "Canada", tz: "America/Toronto", lat: 43.6777, lng: -79.6248 },
  { iata: "YVR", icao: "CYVR", airport: "Vancouver International", city: "Vancouver", country: "CA", countryName: "Canada", tz: "America/Vancouver", lat: 49.1967, lng: -123.1815 },
  { iata: "YUL", icao: "CYUL", airport: "Montréal-Trudeau International", city: "Montréal", country: "CA", countryName: "Canada", tz: "America/Toronto", lat: 45.4706, lng: -73.7408 },
  { iata: "MEX", icao: "MMMX", airport: "Mexico City International", city: "Mexico City", country: "MX", countryName: "Mexico", tz: "America/Mexico_City", lat: 19.4361, lng: -99.0719 },
  { iata: "CUN", icao: "MMUN", airport: "Cancún International", city: "Cancún", country: "MX", countryName: "Mexico", tz: "America/Cancun", lat: 21.0365, lng: -86.8771 },

  // South America
  { iata: "GRU", icao: "SBGR", airport: "São Paulo-Guarulhos International", city: "São Paulo", country: "BR", countryName: "Brazil", tz: "America/Sao_Paulo", lat: -23.4356, lng: -46.4731 },
  { iata: "GIG", icao: "SBGL", airport: "Rio de Janeiro-Galeão", city: "Rio de Janeiro", country: "BR", countryName: "Brazil", tz: "America/Sao_Paulo", lat: -22.8089, lng: -43.2436 },
  { iata: "EZE", icao: "SAEZ", airport: "Buenos Aires-Ezeiza", city: "Buenos Aires", country: "AR", countryName: "Argentina", tz: "America/Argentina/Buenos_Aires", lat: -34.8222, lng: -58.5358 },
  { iata: "BOG", icao: "SKBO", airport: "Bogotá-El Dorado International", city: "Bogotá", country: "CO", countryName: "Colombia", tz: "America/Bogota", lat: 4.7016, lng: -74.1469 },
  { iata: "LIM", icao: "SPJC", airport: "Lima-Jorge Chávez", city: "Lima", country: "PE", countryName: "Peru", tz: "America/Lima", lat: -12.0219, lng: -77.1143 },
  { iata: "SCL", icao: "SCEL", airport: "Santiago International", city: "Santiago", country: "CL", countryName: "Chile", tz: "America/Santiago", lat: -33.3930, lng: -70.7858 },

  // Europe
  { iata: "LHR", icao: "EGLL", airport: "London Heathrow", city: "London", country: "GB", countryName: "United Kingdom", tz: "Europe/London", lat: 51.4700, lng: -0.4543 },
  { iata: "LGW", icao: "EGKK", airport: "London Gatwick", city: "London", country: "GB", countryName: "United Kingdom", tz: "Europe/London", lat: 51.1537, lng: -0.1821 },
  { iata: "LCY", icao: "EGLC", airport: "London City", city: "London", country: "GB", countryName: "United Kingdom", tz: "Europe/London", lat: 51.5048, lng: 0.0495 },
  { iata: "STN", icao: "EGSS", airport: "London Stansted", city: "London", country: "GB", countryName: "United Kingdom", tz: "Europe/London", lat: 51.8860, lng: 0.2389 },
  { iata: "MAN", icao: "EGCC", airport: "Manchester", city: "Manchester", country: "GB", countryName: "United Kingdom", tz: "Europe/London", lat: 53.3537, lng: -2.2750 },
  { iata: "DUB", icao: "EIDW", airport: "Dublin", city: "Dublin", country: "IE", countryName: "Ireland", tz: "Europe/Dublin", lat: 53.4213, lng: -6.2701 },
  { iata: "CDG", icao: "LFPG", airport: "Paris-Charles de Gaulle", city: "Paris", country: "FR", countryName: "France", tz: "Europe/Paris", lat: 49.0097, lng: 2.5479 },
  { iata: "ORY", icao: "LFPO", airport: "Paris-Orly", city: "Paris", country: "FR", countryName: "France", tz: "Europe/Paris", lat: 48.7233, lng: 2.3794 },
  { iata: "AMS", icao: "EHAM", airport: "Amsterdam Schiphol", city: "Amsterdam", country: "NL", countryName: "Netherlands", tz: "Europe/Amsterdam", lat: 52.3105, lng: 4.7683 },
  { iata: "FRA", icao: "EDDF", airport: "Frankfurt", city: "Frankfurt", country: "DE", countryName: "Germany", tz: "Europe/Berlin", lat: 50.0379, lng: 8.5622 },
  { iata: "MUC", icao: "EDDM", airport: "Munich", city: "Munich", country: "DE", countryName: "Germany", tz: "Europe/Berlin", lat: 48.3537, lng: 11.7750 },
  { iata: "BER", icao: "EDDB", airport: "Berlin Brandenburg", city: "Berlin", country: "DE", countryName: "Germany", tz: "Europe/Berlin", lat: 52.3667, lng: 13.5033 },
  { iata: "MAD", icao: "LEMD", airport: "Madrid-Barajas", city: "Madrid", country: "ES", countryName: "Spain", tz: "Europe/Madrid", lat: 40.4983, lng: -3.5676 },
  { iata: "BCN", icao: "LEBL", airport: "Barcelona-El Prat", city: "Barcelona", country: "ES", countryName: "Spain", tz: "Europe/Madrid", lat: 41.2974, lng: 2.0833 },
  { iata: "FCO", icao: "LIRF", airport: "Rome-Fiumicino", city: "Rome", country: "IT", countryName: "Italy", tz: "Europe/Rome", lat: 41.8045, lng: 12.2508 },
  { iata: "MXP", icao: "LIMC", airport: "Milan-Malpensa", city: "Milan", country: "IT", countryName: "Italy", tz: "Europe/Rome", lat: 45.6306, lng: 8.7281 },
  { iata: "LIS", icao: "LPPT", airport: "Lisbon", city: "Lisbon", country: "PT", countryName: "Portugal", tz: "Europe/Lisbon", lat: 38.7813, lng: -9.1359 },
  { iata: "ATH", icao: "LGAV", airport: "Athens", city: "Athens", country: "GR", countryName: "Greece", tz: "Europe/Athens", lat: 37.9364, lng: 23.9445 },
  { iata: "CPH", icao: "EKCH", airport: "Copenhagen-Kastrup", city: "Copenhagen", country: "DK", countryName: "Denmark", tz: "Europe/Copenhagen", lat: 55.6181, lng: 12.6562 },
  { iata: "ARN", icao: "ESSA", airport: "Stockholm-Arlanda", city: "Stockholm", country: "SE", countryName: "Sweden", tz: "Europe/Stockholm", lat: 59.6519, lng: 17.9186 },
  { iata: "OSL", icao: "ENGM", airport: "Oslo-Gardermoen", city: "Oslo", country: "NO", countryName: "Norway", tz: "Europe/Oslo", lat: 60.1939, lng: 11.1004 },
  { iata: "HEL", icao: "EFHK", airport: "Helsinki-Vantaa", city: "Helsinki", country: "FI", countryName: "Finland", tz: "Europe/Helsinki", lat: 60.3172, lng: 24.9633 },
  { iata: "ZRH", icao: "LSZH", airport: "Zürich", city: "Zürich", country: "CH", countryName: "Switzerland", tz: "Europe/Zurich", lat: 47.4647, lng: 8.5492 },
  { iata: "GVA", icao: "LSGG", airport: "Geneva", city: "Geneva", country: "CH", countryName: "Switzerland", tz: "Europe/Zurich", lat: 46.2381, lng: 6.1090 },
  { iata: "VIE", icao: "LOWW", airport: "Vienna International", city: "Vienna", country: "AT", countryName: "Austria", tz: "Europe/Vienna", lat: 48.1102, lng: 16.5697 },
  { iata: "PRG", icao: "LKPR", airport: "Prague-Václav Havel", city: "Prague", country: "CZ", countryName: "Czech Republic", tz: "Europe/Prague", lat: 50.1008, lng: 14.2632 },
  { iata: "WAW", icao: "EPWA", airport: "Warsaw-Chopin", city: "Warsaw", country: "PL", countryName: "Poland", tz: "Europe/Warsaw", lat: 52.1657, lng: 20.9671 },
  { iata: "BUD", icao: "LHBP", airport: "Budapest-Ferenc Liszt", city: "Budapest", country: "HU", countryName: "Hungary", tz: "Europe/Budapest", lat: 47.4369, lng: 19.2556 },
  { iata: "IST", icao: "LTFM", airport: "Istanbul Airport", city: "Istanbul", country: "TR", countryName: "Turkey", tz: "Europe/Istanbul", lat: 41.2753, lng: 28.7519 },
  { iata: "MOW", icao: "UUEE", airport: "Moscow-Sheremetyevo", city: "Moscow", country: "RU", countryName: "Russia", tz: "Europe/Moscow", lat: 55.9728, lng: 37.4147 },

  // Middle East
  { iata: "DXB", icao: "OMDB", airport: "Dubai International", city: "Dubai", country: "AE", countryName: "United Arab Emirates", tz: "Asia/Dubai", lat: 25.2532, lng: 55.3657 },
  { iata: "AUH", icao: "OMAA", airport: "Abu Dhabi International", city: "Abu Dhabi", country: "AE", countryName: "United Arab Emirates", tz: "Asia/Dubai", lat: 24.4330, lng: 54.6511 },
  { iata: "DOH", icao: "OTHH", airport: "Doha-Hamad International", city: "Doha", country: "QA", countryName: "Qatar", tz: "Asia/Qatar", lat: 25.2731, lng: 51.6080 },
  { iata: "RUH", icao: "OERK", airport: "Riyadh-King Khalid International", city: "Riyadh", country: "SA", countryName: "Saudi Arabia", tz: "Asia/Riyadh", lat: 24.9576, lng: 46.6988 },
  { iata: "TLV", icao: "LLBG", airport: "Tel Aviv-Ben Gurion", city: "Tel Aviv", country: "IL", countryName: "Israel", tz: "Asia/Jerusalem", lat: 32.0114, lng: 34.8867 },

  // Africa
  { iata: "JNB", icao: "FAOR", airport: "Johannesburg-O.R. Tambo", city: "Johannesburg", country: "ZA", countryName: "South Africa", tz: "Africa/Johannesburg", lat: -26.1392, lng: 28.2460 },
  { iata: "CPT", icao: "FACT", airport: "Cape Town International", city: "Cape Town", country: "ZA", countryName: "South Africa", tz: "Africa/Johannesburg", lat: -33.9648, lng: 18.6017 },
  { iata: "NBO", icao: "HKJK", airport: "Nairobi-Jomo Kenyatta", city: "Nairobi", country: "KE", countryName: "Kenya", tz: "Africa/Nairobi", lat: -1.3192, lng: 36.9278 },
  { iata: "CAI", icao: "HECA", airport: "Cairo International", city: "Cairo", country: "EG", countryName: "Egypt", tz: "Africa/Cairo", lat: 30.1219, lng: 31.4056 },
  { iata: "CMN", icao: "GMMN", airport: "Casablanca-Mohammed V", city: "Casablanca", country: "MA", countryName: "Morocco", tz: "Africa/Casablanca", lat: 33.3675, lng: -7.5897 },
  { iata: "LOS", icao: "DNMM", airport: "Lagos-Murtala Muhammed", city: "Lagos", country: "NG", countryName: "Nigeria", tz: "Africa/Lagos", lat: 6.5774, lng: 3.3211 },
  { iata: "ABV", icao: "DNAA", airport: "Abuja-Nnamdi Azikiwe", city: "Abuja", country: "NG", countryName: "Nigeria", tz: "Africa/Lagos", lat: 9.0068, lng: 7.2631 },
  { iata: "ADD", icao: "HAAB", airport: "Addis Ababa-Bole", city: "Addis Ababa", country: "ET", countryName: "Ethiopia", tz: "Africa/Addis_Ababa", lat: 8.9779, lng: 38.7993 },

  // Asia
  { iata: "PEK", icao: "ZBAA", airport: "Beijing Capital", city: "Beijing", country: "CN", countryName: "China", tz: "Asia/Shanghai", lat: 40.0801, lng: 116.5846 },
  { iata: "PKX", icao: "ZBAD", airport: "Beijing Daxing", city: "Beijing", country: "CN", countryName: "China", tz: "Asia/Shanghai", lat: 39.5098, lng: 116.4108 },
  { iata: "PVG", icao: "ZSPD", airport: "Shanghai-Pudong", city: "Shanghai", country: "CN", countryName: "China", tz: "Asia/Shanghai", lat: 31.1443, lng: 121.8083 },
  { iata: "HKG", icao: "VHHH", airport: "Hong Kong International", city: "Hong Kong", country: "HK", countryName: "Hong Kong SAR", tz: "Asia/Hong_Kong", lat: 22.3080, lng: 113.9185 },
  { iata: "TPE", icao: "RCTP", airport: "Taipei-Taoyuan", city: "Taipei", country: "TW", countryName: "Taiwan", tz: "Asia/Taipei", lat: 25.0777, lng: 121.2328 },
  { iata: "ICN", icao: "RKSI", airport: "Seoul-Incheon", city: "Seoul", country: "KR", countryName: "South Korea", tz: "Asia/Seoul", lat: 37.4602, lng: 126.4407 },
  { iata: "HND", icao: "RJTT", airport: "Tokyo-Haneda", city: "Tokyo", country: "JP", countryName: "Japan", tz: "Asia/Tokyo", lat: 35.5494, lng: 139.7798 },
  { iata: "NRT", icao: "RJAA", airport: "Tokyo-Narita", city: "Tokyo", country: "JP", countryName: "Japan", tz: "Asia/Tokyo", lat: 35.7647, lng: 140.3863 },
  { iata: "KIX", icao: "RJBB", airport: "Osaka-Kansai", city: "Osaka", country: "JP", countryName: "Japan", tz: "Asia/Tokyo", lat: 34.4348, lng: 135.2440 },
  { iata: "SIN", icao: "WSSS", airport: "Singapore Changi", city: "Singapore", country: "SG", countryName: "Singapore", tz: "Asia/Singapore", lat: 1.3644, lng: 103.9915 },
  { iata: "BKK", icao: "VTBS", airport: "Bangkok-Suvarnabhumi", city: "Bangkok", country: "TH", countryName: "Thailand", tz: "Asia/Bangkok", lat: 13.6900, lng: 100.7501 },
  { iata: "DMK", icao: "VTBD", airport: "Bangkok-Don Mueang", city: "Bangkok", country: "TH", countryName: "Thailand", tz: "Asia/Bangkok", lat: 13.9126, lng: 100.6068 },
  { iata: "KUL", icao: "WMKK", airport: "Kuala Lumpur International", city: "Kuala Lumpur", country: "MY", countryName: "Malaysia", tz: "Asia/Kuala_Lumpur", lat: 2.7456, lng: 101.7099 },
  { iata: "MNL", icao: "RPLL", airport: "Manila-Ninoy Aquino", city: "Manila", country: "PH", countryName: "Philippines", tz: "Asia/Manila", lat: 14.5086, lng: 121.0194 },
  { iata: "CGK", icao: "WIII", airport: "Jakarta-Soekarno-Hatta", city: "Jakarta", country: "ID", countryName: "Indonesia", tz: "Asia/Jakarta", lat: -6.1256, lng: 106.6559 },
  { iata: "DPS", icao: "WADD", airport: "Bali-Ngurah Rai", city: "Denpasar", country: "ID", countryName: "Indonesia", tz: "Asia/Makassar", lat: -8.7482, lng: 115.1672 },
  { iata: "HAN", icao: "VVNB", airport: "Hanoi-Noi Bai", city: "Hanoi", country: "VN", countryName: "Vietnam", tz: "Asia/Ho_Chi_Minh", lat: 21.2212, lng: 105.8071 },
  { iata: "SGN", icao: "VVTS", airport: "Ho Chi Minh City-Tan Son Nhat", city: "Ho Chi Minh City", country: "VN", countryName: "Vietnam", tz: "Asia/Ho_Chi_Minh", lat: 10.8188, lng: 106.6519 },
  { iata: "DEL", icao: "VIDP", airport: "New Delhi-Indira Gandhi", city: "New Delhi", country: "IN", countryName: "India", tz: "Asia/Kolkata", lat: 28.5562, lng: 77.1000 },
  { iata: "BOM", icao: "VABB", airport: "Mumbai-Chhatrapati Shivaji Maharaj", city: "Mumbai", country: "IN", countryName: "India", tz: "Asia/Kolkata", lat: 19.0896, lng: 72.8656 },
  { iata: "BLR", icao: "VOBL", airport: "Bengaluru-Kempegowda", city: "Bengaluru", country: "IN", countryName: "India", tz: "Asia/Kolkata", lat: 13.1986, lng: 77.7066 },

  // Oceania
  { iata: "SYD", icao: "YSSY", airport: "Sydney Kingsford Smith", city: "Sydney", country: "AU", countryName: "Australia", tz: "Australia/Sydney", lat: -33.9399, lng: 151.1753 },
  { iata: "MEL", icao: "YMML", airport: "Melbourne Tullamarine", city: "Melbourne", country: "AU", countryName: "Australia", tz: "Australia/Melbourne", lat: -37.6690, lng: 144.8410 },
  { iata: "BNE", icao: "YBBN", airport: "Brisbane", city: "Brisbane", country: "AU", countryName: "Australia", tz: "Australia/Brisbane", lat: -27.3942, lng: 153.1218 },
  { iata: "AKL", icao: "NZAA", airport: "Auckland", city: "Auckland", country: "NZ", countryName: "New Zealand", tz: "Pacific/Auckland", lat: -37.0082, lng: 174.7917 },
];

export const PLACES_BY_IATA: Record<string, TravelPlace> = Object.fromEntries(
  PLACES.map((p) => [p.iata, p])
);

export const PLACES_BY_ICAO: Record<string, TravelPlace> = Object.fromEntries(
  PLACES.map((p) => [p.icao, p])
);

/** Free-text search across IATA, ICAO, city, airport, country. */
export function searchPlaces(query: string, limit = 8): TravelPlace[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PLACES.filter((p) =>
    p.iata.toLowerCase().includes(q) ||
    p.icao.toLowerCase().includes(q) ||
    p.city.toLowerCase().includes(q) ||
    p.airport.toLowerCase().includes(q) ||
    p.countryName.toLowerCase().includes(q)
  ).slice(0, limit);
}

/** Great-circle distance in km between two coordinate pairs (Haversine). */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ---------- Airlines + carry-on / checked baggage ----------

export interface Airline {
  /** Display name. */
  name: string;
  /** IATA 2-letter code, where assigned. */
  iata: string;
  /** Carry-on max dimensions in cm (length × width × depth). */
  cabinCm: { l: number; w: number; d: number };
  /** Carry-on max weight in kg (some US airlines do not enforce a weight). */
  cabinKg: number | null;
  /** Checked bag max dimensions sum (length + width + depth) in cm. */
  checkedLinearCm: number;
  /** Checked bag max weight in kg for the most common Economy fare. */
  checkedKg: number;
  /** Notes shown beside the entry. */
  notes?: string;
}

export const AIRLINES: Airline[] = [
  { name: "Air Canada", iata: "AC", cabinCm: { l: 55, w: 40, d: 23 }, cabinKg: null, checkedLinearCm: 158, checkedKg: 23, notes: "No carry-on weight, but it must fit the sizer." },
  { name: "Air France", iata: "AF", cabinCm: { l: 55, w: 35, d: 25 }, cabinKg: 12, checkedLinearCm: 158, checkedKg: 23 },
  { name: "Air India", iata: "AI", cabinCm: { l: 55, w: 35, d: 25 }, cabinKg: 8, checkedLinearCm: 158, checkedKg: 23 },
  { name: "American Airlines", iata: "AA", cabinCm: { l: 56, w: 36, d: 23 }, cabinKg: null, checkedLinearCm: 157, checkedKg: 23, notes: "Carry-on weight not enforced on most flights." },
  { name: "ANA — All Nippon Airways", iata: "NH", cabinCm: { l: 55, w: 40, d: 25 }, cabinKg: 10, checkedLinearCm: 158, checkedKg: 23 },
  { name: "British Airways", iata: "BA", cabinCm: { l: 56, w: 45, d: 25 }, cabinKg: 23, checkedLinearCm: 207, checkedKg: 23, notes: "Generous carry-on weight but check sizer at the gate." },
  { name: "Cathay Pacific", iata: "CX", cabinCm: { l: 56, w: 36, d: 23 }, cabinKg: 7, checkedLinearCm: 158, checkedKg: 23 },
  { name: "Delta Air Lines", iata: "DL", cabinCm: { l: 56, w: 36, d: 23 }, cabinKg: null, checkedLinearCm: 157, checkedKg: 23 },
  { name: "EasyJet", iata: "U2", cabinCm: { l: 45, w: 36, d: 20 }, cabinKg: 15, checkedLinearCm: 275, checkedKg: 23, notes: "Free under-seat bag only. Larger cabin bag and checked bag are paid add-ons." },
  { name: "Emirates", iata: "EK", cabinCm: { l: 55, w: 38, d: 20 }, cabinKg: 7, checkedLinearCm: 300, checkedKg: 30 },
  { name: "Etihad Airways", iata: "EY", cabinCm: { l: 56, w: 36, d: 23 }, cabinKg: 7, checkedLinearCm: 158, checkedKg: 23 },
  { name: "Iberia", iata: "IB", cabinCm: { l: 56, w: 40, d: 25 }, cabinKg: 10, checkedLinearCm: 158, checkedKg: 23 },
  { name: "JetBlue", iata: "B6", cabinCm: { l: 55, w: 35, d: 22 }, cabinKg: null, checkedLinearCm: 157, checkedKg: 23 },
  { name: "KLM", iata: "KL", cabinCm: { l: 55, w: 35, d: 25 }, cabinKg: 12, checkedLinearCm: 158, checkedKg: 23 },
  { name: "Lufthansa", iata: "LH", cabinCm: { l: 55, w: 40, d: 23 }, cabinKg: 8, checkedLinearCm: 158, checkedKg: 23 },
  { name: "Qantas", iata: "QF", cabinCm: { l: 56, w: 36, d: 23 }, cabinKg: 7, checkedLinearCm: 158, checkedKg: 23 },
  { name: "Qatar Airways", iata: "QR", cabinCm: { l: 50, w: 37, d: 25 }, cabinKg: 7, checkedLinearCm: 158, checkedKg: 30 },
  { name: "Ryanair", iata: "FR", cabinCm: { l: 40, w: 20, d: 25 }, cabinKg: 10, checkedLinearCm: 275, checkedKg: 20, notes: "Larger cabin bag (55×40×20, 10 kg) requires Priority. Free bag must fit under seat." },
  { name: "SAS — Scandinavian Airlines", iata: "SK", cabinCm: { l: 55, w: 40, d: 23 }, cabinKg: 8, checkedLinearCm: 158, checkedKg: 23 },
  { name: "Singapore Airlines", iata: "SQ", cabinCm: { l: 55, w: 40, d: 20 }, cabinKg: 7, checkedLinearCm: 158, checkedKg: 30 },
  { name: "Southwest Airlines", iata: "WN", cabinCm: { l: 61, w: 41, d: 28 }, cabinKg: null, checkedLinearCm: 157, checkedKg: 23, notes: "Two free checked bags up to 50 lb / 23 kg each." },
  { name: "Turkish Airlines", iata: "TK", cabinCm: { l: 55, w: 40, d: 23 }, cabinKg: 8, checkedLinearCm: 158, checkedKg: 23 },
  { name: "United Airlines", iata: "UA", cabinCm: { l: 56, w: 35, d: 22 }, cabinKg: null, checkedLinearCm: 157, checkedKg: 23 },
  { name: "Virgin Atlantic", iata: "VS", cabinCm: { l: 56, w: 36, d: 23 }, cabinKg: 10, checkedLinearCm: 207, checkedKg: 23 },
];

// ---------- Cabin class amenity comparison ----------

export interface CabinClassRow {
  airline: string;
  /** Seat pitch in inches per class. */
  economy: { pitch: number; width: number };
  premium?: { pitch: number; width: number };
  business?: { pitch: number; width: number; lieFlat: boolean; suite?: boolean };
  first?: { pitch: number; width: number; lieFlat: boolean; suite?: boolean };
}

export const CABIN_COMPARISON: CabinClassRow[] = [
  { airline: "Emirates A380",         economy: { pitch: 32, width: 18 }, premium: { pitch: 40, width: 19.5 }, business: { pitch: 72, width: 20, lieFlat: true },  first: { pitch: 86, width: 23, lieFlat: true, suite: true } },
  { airline: "Singapore Airlines A380", economy: { pitch: 32, width: 19 }, premium: { pitch: 38, width: 19.5 }, business: { pitch: 80, width: 25, lieFlat: true },  first: { pitch: 80, width: 26, lieFlat: true, suite: true } },
  { airline: "Qatar Airways A350",    economy: { pitch: 32, width: 18 }, business: { pitch: 79, width: 21, lieFlat: true } },
  { airline: "Cathay Pacific A350",   economy: { pitch: 32, width: 18 }, premium: { pitch: 40, width: 19.5 }, business: { pitch: 82, width: 21, lieFlat: true } },
  { airline: "British Airways 777",   economy: { pitch: 31, width: 17.5 }, premium: { pitch: 38, width: 19 }, business: { pitch: 79, width: 20, lieFlat: true }, first: { pitch: 80, width: 22, lieFlat: true, suite: true } },
  { airline: "American Airlines 777", economy: { pitch: 31, width: 17 }, premium: { pitch: 38, width: 19 }, business: { pitch: 78, width: 20.5, lieFlat: true } },
  { airline: "Delta One 767",         economy: { pitch: 31, width: 17.9 }, premium: { pitch: 38, width: 18.5 }, business: { pitch: 79, width: 20.5, lieFlat: true, suite: true } },
  { airline: "United Polaris 787",    economy: { pitch: 31, width: 17 }, premium: { pitch: 38, width: 19 }, business: { pitch: 78, width: 20.6, lieFlat: true } },
  { airline: "Lufthansa A350",        economy: { pitch: 31, width: 18 }, premium: { pitch: 38, width: 19 }, business: { pitch: 79, width: 20, lieFlat: true }, first: { pitch: 90, width: 26, lieFlat: true } },
  { airline: "ANA 777 'The Room'",    economy: { pitch: 34, width: 17 }, premium: { pitch: 38, width: 19.3 }, business: { pitch: 96, width: 38, lieFlat: true, suite: true } },
];

// ---------- Flight CO2 factors ----------

/**
 * Grams of CO2 per passenger-kilometre by cabin class.
 * Order-of-magnitude figures matching common offset-provider calculators
 * (BA / Lufthansa / ICAO). The class multiplier reflects the larger floor
 * space each higher-class passenger occupies.
 */
export const CO2_FACTORS = {
  economy: 120,
  premium: 180,
  business: 240,
  first: 320,
} as const;

export type CabinClass = keyof typeof CO2_FACTORS;
