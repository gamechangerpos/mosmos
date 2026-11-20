import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  TransportOperator, 
  TransportRoute, 
  TransportInquiry, 
  TransportInquiryStatus 
} from '../types';

// ============================================================================
// INITIAL VERIFIED REGIONAL OPERATORS
// Researched from official sources (Easy Coach, Kenya Railways, Azam Marine, etc.)
// ============================================================================
export const INITIAL_VERIFIED_OPERATORS: TransportOperator[] = [
  {
    id: 'op_easy_coach',
    name: 'Easy Coach Limited',
    transportType: 'bus',
    countries: ['Uganda', 'Kenya'],
    websiteUrl: 'https://www.easycoachkenya.com',
    bookingUrl: 'https://www.easycoachkenya.com',
    description: 'Premier executive intercity bus network in Kenya with cross-border connections between Kampala (De Winton Rd) and Nairobi, Kisumu, Eldoret, and Nakuru.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'Easy Coach official route directory & terminals (Kampala De Winton & Nairobi Haile Selassie Ave)',
    published: true
  },
  {
    id: 'op_mash_east_africa',
    name: 'Mash East Africa',
    transportType: 'bus',
    countries: ['Uganda', 'Kenya', 'Tanzania'],
    websiteUrl: 'https://masheastafrica.com',
    description: 'Long-distance VIP coach service operating daily cross-border services linking Kampala, Nairobi, Mombasa, and Malindi via the Busia/Malaba borders.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'Mash East Africa fleet scheduling and border operations registry',
    published: true
  },
  {
    id: 'op_kenya_railways_sgr',
    name: 'Kenya Railways (Madaraka Express SGR)',
    transportType: 'train',
    countries: ['Kenya'],
    websiteUrl: 'https://krc.co.ke',
    bookingUrl: 'https://metickets.krc.co.ke',
    description: 'Standard Gauge Railway passenger service between Nairobi Terminus (Syokimau) and Mombasa Terminus (Miritini), plus Phase 2A commuter extension to Suswa/Naivasha.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'Kenya Railways Corporation official timetable & ticketing portal',
    published: true
  },
  {
    id: 'op_azam_marine',
    name: 'Azam Marine (Kilimanjaro Fast Ferries)',
    transportType: 'ferry',
    countries: ['Tanzania'],
    websiteUrl: 'https://azammarine.com',
    description: 'Modern high-speed passenger catamaran fleet connecting Dar es Salaam mainland port to Zanzibar (Stone Town) and Pemba Island with multiple daily departures.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'Azam Marine official daily departure schedules',
    published: true
  },
  {
    id: 'op_trc_sgr',
    name: 'Tanzania Railways Corporation (TRC SGR)',
    transportType: 'train',
    countries: ['Tanzania'],
    websiteUrl: 'https://trc.co.tz',
    description: 'Electric Standard Gauge Railway operating between Dar es Salaam, Morogoro, and Dodoma administrative capital with modern air-conditioned carriages.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'TRC official passenger rail service announcements',
    published: true
  },
  {
    id: 'op_aerolink_uganda',
    name: 'Aerolink Uganda',
    transportType: 'flight',
    countries: ['Uganda', 'Kenya'],
    websiteUrl: 'https://www.aerolinkuganda.com',
    description: 'Scheduled domestic safari flight operator from Entebbe International Airport into Bwindi (Kihihi/Kisoro), Murchison Falls (Pakuba), and Queen Elizabeth (Mweya/Kasese). Cross-connecting to Maasai Mara via Kisumu.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'Aerolink Uganda flight schedules & Civil Aviation Authority licensing',
    published: true
  },
  {
    id: 'op_safarilink',
    name: 'Safarilink Aviation',
    transportType: 'flight',
    countries: ['Kenya', 'Tanzania'],
    websiteUrl: 'https://www.flysafarilink.com',
    description: 'Premier safari airline based at Wilson Airport Nairobi, serving Maasai Mara, Diani (Ukunda), Lamu, Amboseli, Samburu, and cross-border flights to Kilimanjaro/Zanzibar.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'Safarilink Aviation scheduled route matrix',
    published: true
  },
  {
    id: 'op_volcano_express',
    name: 'Volcano Express Rwanda',
    transportType: 'bus',
    countries: ['Rwanda', 'Uganda'],
    description: 'Licensed intercity express coach operator in Rwanda connecting Kigali Nyabugogo terminal with Musanze (Volcanoes National Park), Rubavu (Lake Kivu), and southern hubs.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'Rwanda Utilities Regulatory Authority (RURA) passenger operator roster',
    published: true
  },
  {
    id: 'op_ritco_rwanda',
    name: 'Ritco Rwanda',
    transportType: 'bus',
    countries: ['Rwanda'],
    websiteUrl: 'https://ritco.rw',
    description: 'National public and intercity transport company connecting all major provincial districts including Kigali to Huye, Nyungwe, and Akagera border regions.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'Ritco Rwanda official route networks',
    published: true
  },
  {
    id: 'op_mosmos_private',
    name: 'MOS MOS Private 4x4 Expeditions & Chauffeur Desk',
    transportType: 'private-transfer',
    countries: ['Uganda', 'Kenya', 'Tanzania', 'Rwanda'],
    description: 'Our proprietary fleet of custom-engineered 4x4 Toyota Land Cruisers, high-roof safari vans, and private executive vehicles with professional driver-guides and border clearance support.',
    verified: true,
    lastChecked: '2026-11-20',
    sourceReference: 'MOS MOS Safaris official fleet operations and private transfer arrangements',
    published: true
  }
];

// ============================================================================
// INITIAL VERIFIED REGIONAL ROUTES
// Researched from official timetables, distances, and operational realities
// ============================================================================
export const INITIAL_VERIFIED_ROUTES: TransportRoute[] = [
  // 1. Cross-Border Routes (Uganda ⇄ Kenya)
  {
    id: 'rt_kampala_nairobi',
    origin: 'Kampala',
    destination: 'Nairobi',
    originCountry: 'Uganda',
    destinationCountry: 'Kenya',
    routeType: 'cross-border',
    operatorId: 'op_easy_coach',
    operatorName: 'Easy Coach / Mash East Africa',
    transportType: 'Executive Intercity Bus',
    typicalDuration: '12 – 14 hours (depending on border clearance)',
    description: 'Direct cross-border connection departing Kampala De Winton terminal, transiting the Busia or Malaba border, and arriving at Nairobi CBD.',
    verified: true,
    lastChecked: '2026-11-20',
    crossBorderRequirements: [
      'Valid passport with at least 6 months validity',
      'East Africa Tourist Visa or valid single-entry visas',
      'Yellow Fever vaccination certificate',
      'Kenya eTA authorization'
    ],
    recommendedFor: ['Budget-friendly travelers', 'Regional cross-country adventurers'],
    published: true
  },
  {
    id: 'rt_kampala_kisumu',
    origin: 'Kampala',
    destination: 'Kisumu',
    originCountry: 'Uganda',
    destinationCountry: 'Kenya',
    routeType: 'cross-border',
    operatorId: 'op_easy_coach',
    operatorName: 'Easy Coach Limited',
    transportType: 'Executive Intercity Bus / Private 4x4',
    typicalDuration: '7 – 9 hours',
    description: 'Scenic journey around the northern tip of Lake Victoria connecting Kampala to Kisumu city via Busia border.',
    verified: true,
    lastChecked: '2026-11-20',
    crossBorderRequirements: ['Valid passport', 'Yellow Fever card', 'Visa or East Africa Visa'],
    recommendedFor: ['Lake Victoria circuit travelers', 'Business & cultural travelers'],
    published: true
  },
  {
    id: 'rt_kampala_eldoret',
    origin: 'Kampala',
    destination: 'Eldoret',
    originCountry: 'Uganda',
    destinationCountry: 'Kenya',
    routeType: 'cross-border',
    operatorId: 'op_easy_coach',
    operatorName: 'Easy Coach / Private Van',
    transportType: 'Intercity Bus',
    typicalDuration: '8 – 10 hours',
    description: 'Direct transit across the Malaba border connecting Kampala to Eldoret in Kenya’s North Rift highlands.',
    verified: true,
    lastChecked: '2026-11-20',
    crossBorderRequirements: ['Valid passport', 'Yellow Fever certificate'],
    published: true
  },

  // 2. Kenya Strong Coverage (Cities, Coast, Islands, Safari)
  {
    id: 'rt_nairobi_mombasa_sgr',
    origin: 'Nairobi',
    destination: 'Mombasa',
    originCountry: 'Kenya',
    destinationCountry: 'Kenya',
    routeType: 'rail',
    operatorId: 'op_kenya_railways_sgr',
    operatorName: 'Kenya Railways (Madaraka Express SGR)',
    transportType: 'Standard Gauge Passenger Train',
    typicalDuration: '4.5 – 6 hours',
    description: 'Fast, scenic rail journey passing through Tsavo National Park plains with frequent wildlife viewing from passenger cars. Arrives at Mombasa Terminus (Miritini).',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Families', 'Couples', 'Comfortable overland travel', 'Scenic photography'],
    published: true
  },
  {
    id: 'rt_mombasa_diani',
    origin: 'Mombasa',
    destination: 'Diani Beach',
    originCountry: 'Kenya',
    destinationCountry: 'Kenya',
    routeType: 'domestic',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Private Coastal Transfer',
    transportType: 'Chauffeured Air-Conditioned Van / Car',
    typicalDuration: '1.5 – 2 hours',
    description: 'Direct road transfer connecting Mombasa SGR Terminus or Moi International Airport to Diani Beach resorts via the Dhow bypass road / Likoni corridor.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Beach vacationers', 'Resort guests', 'Honeymooners'],
    published: true
  },
  {
    id: 'rt_mombasa_watamu_malindi',
    origin: 'Mombasa',
    destination: 'Watamu & Malindi',
    originCountry: 'Kenya',
    destinationCountry: 'Kenya',
    routeType: 'domestic',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Private North Coast Transfer',
    transportType: 'Private Executive Van / Safari Vehicle',
    typicalDuration: '2 – 2.5 hours',
    description: 'North coast scenic highway transfer traversing Kilifi Creek bridge directly to Watamu marine park resorts and Malindi town.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Marine safari enthusiasts', 'Coastal beach lovers'],
    published: true
  },
  {
    id: 'rt_mokowe_lamu',
    origin: 'Mokowe Mainland / Manda Airport',
    destination: 'Lamu Old Town & Shela Village',
    originCountry: 'Kenya',
    destinationCountry: 'Kenya',
    routeType: 'ferry',
    operatorId: 'op_mosmos_private',
    operatorName: 'Lamu Archipelago Boat & Dhow Transfer',
    transportType: 'Private Motorized Boat / Traditional Dhow',
    typicalDuration: '15 – 35 minutes',
    description: 'Essential marine transfer linking Manda Airport or Mokowe road jetty across the tranquil channel to UNESCO-listed Lamu Island and Shela beaches (no cars on island).',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Island lovers', 'Cultural heritage travelers', 'Bespoke retreats'],
    published: true
  },
  {
    id: 'rt_nairobi_maasaimara_fly',
    origin: 'Nairobi (Wilson Airport)',
    destination: 'Maasai Mara (Keekorok, Ol Kiombo, Musiara)',
    originCountry: 'Kenya',
    destinationCountry: 'Kenya',
    routeType: 'flight',
    operatorId: 'op_safarilink',
    operatorName: 'Safarilink / Airkenya Bush Flights',
    transportType: 'Cessna Caravan / Dash 8 Bush Plane',
    typicalDuration: '45 minutes',
    description: 'Fly directly from Nairobi Wilson airport to your chosen conservancy bush airstrip with immediate 4x4 game-drive transfer to camp.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Luxury safari guests', 'Time-sensitive travelers', 'Photographers'],
    published: true
  },
  {
    id: 'rt_nairobi_maasaimara_drive',
    origin: 'Nairobi',
    destination: 'Maasai Mara National Reserve',
    originCountry: 'Kenya',
    destinationCountry: 'Kenya',
    routeType: 'safari-transfer',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Custom 4x4 Cruiser',
    transportType: 'Custom 4x4 Land Cruiser with Pop-Up Roof',
    typicalDuration: '5.5 – 6.5 hours',
    description: 'Scenic overland descent through the Great Rift Valley viewpoint, Narok town, and into the savanna plains of the Mara with your private guide.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Wildlife photography', 'Families wanting complete vehicle flexibility'],
    published: true
  },
  {
    id: 'rt_nairobi_amboseli',
    origin: 'Nairobi',
    destination: 'Amboseli National Park',
    originCountry: 'Kenya',
    destinationCountry: 'Kenya',
    routeType: 'safari-transfer',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Custom 4x4 Safari Cruiser',
    transportType: 'Custom 4x4 Land Cruiser',
    typicalDuration: '4 – 4.5 hours',
    description: 'Smooth highway drive past Emali towards the foot of Mount Kilimanjaro with game drives directly upon entering the park gate.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Elephant viewing', 'Mount Kilimanjaro photography'],
    published: true
  },
  {
    id: 'rt_nairobi_nakuru_naivasha',
    origin: 'Nairobi',
    destination: 'Lake Naivasha & Lake Nakuru',
    originCountry: 'Kenya',
    destinationCountry: 'Kenya',
    routeType: 'safari-transfer',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Executive Private Transfer',
    transportType: 'Private 4x4 / Safari Cruiser',
    typicalDuration: '2 – 3 hours',
    description: 'Direct Great Rift Valley transfer for boat safaris on Lake Naivasha, walking with wildlife on Crescent Island, or rhino tracking in Nakuru.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Weekend safaris', 'Birdwatchers', 'Family day trips'],
    published: true
  },

  // 3. Uganda Destinations
  {
    id: 'rt_kampala_entebbe',
    origin: 'Kampala',
    destination: 'Entebbe International Airport',
    originCountry: 'Uganda',
    destinationCountry: 'Uganda',
    routeType: 'domestic',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Executive Airport Chauffeur',
    transportType: 'Private Executive Car / Chauffeur Van',
    typicalDuration: '35 – 50 minutes (via Expressway)',
    description: 'Stress-free express transfer between Kampala hotels and Entebbe Airport via the Entebbe-Kampala Expressway with 24/7 flight tracking.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Airport arrivals/departures', 'Business executives'],
    published: true
  },
  {
    id: 'rt_kampala_jinja',
    origin: 'Kampala / Entebbe',
    destination: 'Jinja (Source of the Nile)',
    originCountry: 'Uganda',
    destinationCountry: 'Uganda',
    routeType: 'domestic',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Private Nile Transfer',
    transportType: 'Private Chauffeur Van / 4x4',
    typicalDuration: '2 – 2.5 hours',
    description: 'Eastward journey through tea and sugar plantations across the Nile River Bridge into Jinja for whitewater rafting, sunset boat cruises, or lodge stays.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Adventure seekers', 'Day excursions', 'River lovers'],
    published: true
  },
  {
    id: 'rt_entebbe_murchison_air',
    origin: 'Entebbe International Airport',
    destination: 'Murchison Falls (Pakuba / Chobe / Bugungu)',
    originCountry: 'Uganda',
    destinationCountry: 'Uganda',
    routeType: 'flight',
    operatorId: 'op_aerolink_uganda',
    operatorName: 'Aerolink Uganda Bush Flights',
    transportType: 'Cessna Grand Caravan Caravan',
    typicalDuration: '1 hour 10 minutes',
    description: 'Direct fly-in safari departing Entebbe over Lake Kyoga to Murchison Falls national park airstrips with immediate lodge 4x4 transfer.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Luxury travelers', 'Primate & falls combination'],
    published: true
  },
  {
    id: 'rt_kampala_murchison_drive',
    origin: 'Kampala / Entebbe',
    destination: 'Murchison Falls National Park',
    originCountry: 'Uganda',
    destinationCountry: 'Uganda',
    routeType: 'safari-transfer',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Custom 4x4 Safari Cruiser',
    transportType: 'Custom 4x4 Land Cruiser',
    typicalDuration: '5 – 6 hours',
    description: 'Overland safari journey via Ziwa Rhino Sanctuary for on-foot white rhino tracking, continuing to the thundering top of Murchison Falls.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Complete wildlife experience', 'Rhino tracking stopover'],
    published: true
  },
  {
    id: 'rt_entebbe_bwindi_air',
    origin: 'Entebbe International Airport',
    destination: 'Bwindi Impenetrable Forest (Kihihi / Kisoro)',
    originCountry: 'Uganda',
    destinationCountry: 'Uganda',
    routeType: 'flight',
    operatorId: 'op_aerolink_uganda',
    operatorName: 'Aerolink Uganda Scheduled Bush Flights',
    transportType: 'Scheduled Aircraft',
    typicalDuration: '1 hour 15 minutes',
    description: 'Spectacular aerial transfer saving 8–9 hours of road travel, landing at Kihihi (for Buhoma/Ruhija gorilla sectors) or Kisoro (for Nkuringo/Rushaga sectors).',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Gorilla trekking patrons', 'Luxury lodge guests'],
    published: true
  },
  {
    id: 'rt_kampala_bwindi_drive',
    origin: 'Kampala / Entebbe',
    destination: 'Bwindi Impenetrable & Lake Bunyonyi',
    originCountry: 'Uganda',
    destinationCountry: 'Uganda',
    routeType: 'safari-transfer',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Custom 4x4 Safari Cruiser',
    transportType: 'Custom 4x4 Land Cruiser with Inverter & Fridge',
    typicalDuration: '8 – 9 hours',
    description: 'Scenic overland expedition across the Equator monument, rolling hills of Ankole, and terraced mountains of Kigezi ("Switzerland of Africa").',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Panoramic road trippers', 'Equator photography enthusiasts'],
    published: true
  },

  // 4. Tanzania Routes
  {
    id: 'rt_dar_zanzibar_ferry',
    origin: 'Dar es Salaam',
    destination: 'Zanzibar (Stone Town)',
    originCountry: 'Tanzania',
    destinationCountry: 'Tanzania',
    routeType: 'ferry',
    operatorId: 'op_azam_marine',
    operatorName: 'Azam Marine (Kilimanjaro Fast Ferries)',
    transportType: 'High-Speed Passenger Catamaran',
    typicalDuration: '1 hour 45 minutes',
    description: 'Reliable, comfortable maritime service crossing the Zanzibar Channel between Dar es Salaam downtown terminal and Stone Town port with VIP & Royal class decks.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Overland travelers', 'Island explorers', 'Cost-effective sea crossing'],
    published: true
  },
  {
    id: 'rt_dar_dodoma_sgr',
    origin: 'Dar es Salaam',
    destination: 'Morogoro & Dodoma',
    originCountry: 'Tanzania',
    destinationCountry: 'Tanzania',
    routeType: 'rail',
    operatorId: 'op_trc_sgr',
    operatorName: 'Tanzania Railways Corporation (TRC SGR)',
    transportType: 'Electric Standard Gauge Passenger Train',
    typicalDuration: '3.5 – 4 hours',
    description: 'Modern high-speed electric rail service linking the coastal commercial hub to the interior national capital of Dodoma with business and economy lounges.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Fast overland transit', 'Comfortable inland exploration'],
    published: true
  },
  {
    id: 'rt_arusha_serengeti',
    origin: 'Arusha / Kilimanjaro',
    destination: 'Serengeti & Ngorongoro Crater',
    originCountry: 'Tanzania',
    destinationCountry: 'Tanzania',
    routeType: 'safari-transfer',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Custom 4x4 Safari Cruiser',
    transportType: 'Custom 4x4 Land Cruiser',
    typicalDuration: '4 – 6 hours',
    description: 'Traversing the Great Rift Valley escarpment, climbing into the misty volcanic highlands of Ngorongoro, and dropping onto the boundless Serengeti short-grass plains.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['The Great Migration', 'Big Five safaris', 'Crater expeditions'],
    published: true
  },

  // 5. Rwanda Routes
  {
    id: 'rt_kigali_volcanoes',
    origin: 'Kigali',
    destination: 'Musanze (Volcanoes National Park)',
    originCountry: 'Rwanda',
    destinationCountry: 'Rwanda',
    routeType: 'domestic',
    operatorId: 'op_mosmos_private',
    operatorName: 'MOS MOS Private Chauffeur / Volcano Express',
    transportType: 'Private Executive 4x4 / Intercity Coach',
    typicalDuration: '2 – 2.5 hours',
    description: 'Smooth, impeccably paved mountain highway winding through the terraced hills of northern Rwanda directly to the gorilla tracking headquarters at Kinigi.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Gorilla trekking patrons', 'Dian Fossey memorial pilgrims'],
    published: true
  },
  {
    id: 'rt_kigali_rubavu_kivu',
    origin: 'Kigali',
    destination: 'Rubavu (Lake Kivu)',
    originCountry: 'Rwanda',
    destinationCountry: 'Rwanda',
    routeType: 'domestic',
    operatorId: 'op_ritco_rwanda',
    operatorName: 'Ritco Rwanda / Private Van',
    transportType: 'Intercity Bus / Private Car',
    typicalDuration: '3 – 3.5 hours',
    description: 'Journey from the capital city across the western highlands to the sandy resort shores and lakeside promenades of Lake Kivu in Gisenyi/Rubavu.',
    verified: true,
    lastChecked: '2026-11-20',
    recommendedFor: ['Lakeside relaxation', 'Congo Nile Trail adventurers'],
    published: true
  }
];

const STORAGE_KEY_OPERATORS = 'mos_transport_operators_v1';
const STORAGE_KEY_ROUTES = 'mos_transport_routes_v1';
const STORAGE_KEY_INQUIRIES = 'mos_transport_inquiries_v1';

export const TransportService = {
  // ============================================================================
  // 1. OPERATORS (Firestore + Cache)
  // ============================================================================
  async getOperators(includeUnpublished = false): Promise<TransportOperator[]> {
    try {
      const q = query(collection(db, 'cms_transport_operators'));
      const snap = await getDocs(q);
      const list: TransportOperator[] = [];
      snap.forEach(d => list.push(d.data() as TransportOperator));

      if (list.length > 0) {
        localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(list));
        return includeUnpublished ? list : list.filter(op => op.published !== false);
      }
    } catch (err) {
      console.warn('[TransportService] getOperators Firestore fallback to local:', err);
    }

    try {
      const cached = localStorage.getItem(STORAGE_KEY_OPERATORS);
      if (cached) {
        const list: TransportOperator[] = JSON.parse(cached);
        return includeUnpublished ? list : list.filter(op => op.published !== false);
      }
    } catch {
      // silent
    }

    return includeUnpublished ? INITIAL_VERIFIED_OPERATORS : INITIAL_VERIFIED_OPERATORS.filter(op => op.published !== false);
  },

  async saveOperator(operator: TransportOperator): Promise<void> {
    try {
      const docRef = doc(db, 'cms_transport_operators', operator.id);
      await setDoc(docRef, {
        ...operator,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[TransportService] saveOperator Firestore write error:', err);
    }

    // Update local cache
    try {
      const existing = await this.getOperators(true);
      const idx = existing.findIndex(o => o.id === operator.id);
      if (idx >= 0) existing[idx] = operator;
      else existing.push(operator);
      localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(existing));
    } catch {
      // silent
    }
  },

  async deleteOperator(operatorId: string): Promise<void> {
    try {
      const docRef = doc(db, 'cms_transport_operators', operatorId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[TransportService] deleteOperator Firestore error:', err);
    }

    try {
      const existing = await this.getOperators(true);
      const filtered = existing.filter(o => o.id !== operatorId);
      localStorage.setItem(STORAGE_KEY_OPERATORS, JSON.stringify(filtered));
    } catch {
      // silent
    }
  },

  // ============================================================================
  // 2. ROUTES (Firestore + Cache)
  // ============================================================================
  async getRoutes(country?: string, includeUnpublished = false): Promise<TransportRoute[]> {
    let routes: TransportRoute[] = [];
    try {
      const q = query(collection(db, 'cms_transport_routes'));
      const snap = await getDocs(q);
      snap.forEach(d => routes.push(d.data() as TransportRoute));

      if (routes.length > 0) {
        localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(routes));
      }
    } catch (err) {
      console.warn('[TransportService] getRoutes Firestore fallback to local:', err);
    }

    if (routes.length === 0) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY_ROUTES);
        if (cached) routes = JSON.parse(cached);
        else routes = [...INITIAL_VERIFIED_ROUTES];
      } catch {
        routes = [...INITIAL_VERIFIED_ROUTES];
      }
    }

    if (!includeUnpublished) {
      routes = routes.filter(r => r.published !== false);
    }

    if (country && country !== 'all') {
      const c = country.toLowerCase();
      routes = routes.filter(r => 
        r.originCountry.toLowerCase().includes(c) || 
        r.destinationCountry.toLowerCase().includes(c)
      );
    }

    return routes;
  },

  async saveRoute(route: TransportRoute): Promise<void> {
    try {
      const docRef = doc(db, 'cms_transport_routes', route.id);
      await setDoc(docRef, {
        ...route,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[TransportService] saveRoute Firestore write error:', err);
    }

    try {
      const existing = await this.getRoutes('all', true);
      const idx = existing.findIndex(r => r.id === route.id);
      if (idx >= 0) existing[idx] = route;
      else existing.push(route);
      localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(existing));
    } catch {
      // silent
    }
  },

  async deleteRoute(routeId: string): Promise<void> {
    try {
      const docRef = doc(db, 'cms_transport_routes', routeId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('[TransportService] deleteRoute Firestore error:', err);
    }

    try {
      const existing = await this.getRoutes('all', true);
      const filtered = existing.filter(r => r.id !== routeId);
      localStorage.setItem(STORAGE_KEY_ROUTES, JSON.stringify(filtered));
    } catch {
      // silent
    }
  },

  // ============================================================================
  // 3. TRANSPORT & CUSTOM TRIP INQUIRIES
  // Confidential budget & personalized quotation pipeline
  // ============================================================================
  async submitTransportInquiry(inquiryData: Omit<TransportInquiry, 'id' | 'reference' | 'createdAt' | 'status'>): Promise<TransportInquiry> {
    const reference = `TRP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: TransportInquiry = {
      ...inquiryData,
      id: `inq_trp_${Date.now()}`,
      reference,
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    // 1. Write to Firestore `transport_inquiries`
    try {
      const docRef = doc(db, 'transport_inquiries', newInquiry.id);
      await setDoc(docRef, {
        ...newInquiry,
        serverCreatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('[TransportService] submitTransportInquiry Firestore write error:', err);
    }

    // 2. Also write to unified `inquiries` collection so it shows in existing Ops dashboard
    try {
      const unifiedRef = doc(db, 'inquiries', newInquiry.id);
      await setDoc(unifiedRef, {
        id: newInquiry.id,
        reference: newInquiry.reference,
        createdAt: newInquiry.createdAt,
        customerName: newInquiry.customerName,
        customerEmail: newInquiry.customerEmail,
        customerPhone: newInquiry.customerPhone,
        preferredContact: newInquiry.preferredContactMethod,
        destinations: [
          `${newInquiry.departureCity} (${newInquiry.departureCountry}) → ${newInquiry.destinationCity} (${newInquiry.destinationCountry})`
        ],
        packageName: `Regional Transport: ${newInquiry.inquiryType.replace('_', ' ').toUpperCase()}`,
        travelDates: `${newInquiry.departureDate} ${newInquiry.returnDate ? 'to ' + newInquiry.returnDate : '(One-way)'}`,
        adultsCount: newInquiry.adultsCount,
        childrenCount: newInquiry.childrenCount,
        budgetRange: `${newInquiry.privateBudget.currency} ${newInquiry.privateBudget.estimatedAmount} (${newInquiry.privateBudget.budgetType}) [CONFIDENTIAL]`,
        travelStyle: `Transport Modes: ${newInquiry.preferredTransportModes.join(', ')}`,
        preferredExperiences: newInquiry.travelPreferences,
        accommodationType: newInquiry.accommodationRequired ? `Category: ${newInquiry.hotelCategory || 'Recommended'}` : 'None requested',
        notes: `[TRANSPORT & TRAVEL REQUEST]\nJourney: ${newInquiry.departureCity} to ${newInquiry.destinationCity}\nFlexible Dates: ${newInquiry.flexibleDates ? 'Yes' : 'No'}\nLuggage Notes: ${newInquiry.luggageNotes || 'Standard'}\nBudget Notes: ${newInquiry.privateBudget.notes || 'None'}\nClient Notes: ${newInquiry.notes || 'None'}`.trim(),
        status: 'PENDING_REVIEW',
        journeyStage: 'Inquiry received',
        serverCreatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('[TransportService] unified inquiries sync warning:', err);
    }

    // 3. Update local cache
    try {
      const existing = await this.getTransportInquiries();
      existing.unshift(newInquiry);
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(existing));
    } catch {
      // silent
    }

    // 4. Trigger dual-email dispatch via serverless route `/api/inquire`
    try {
      fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newInquiry.customerName,
          email: newInquiry.customerEmail,
          phone: newInquiry.customerPhone,
          category: `Regional Transport & Travel Arrangement (${newInquiry.inquiryType})`,
          destination: `${newInquiry.departureCity} to ${newInquiry.destinationCity}`,
          travelDates: newInquiry.departureDate,
          travelers: newInquiry.travelersCount,
          budget: `${newInquiry.privateBudget.currency} ${newInquiry.privateBudget.estimatedAmount}`,
          message: `Regional Transportation Inquiry Reference: ${newInquiry.reference}\nOrigin: ${newInquiry.departureCity}, ${newInquiry.departureCountry}\nDestination: ${newInquiry.destinationCity}, ${newInquiry.destinationCountry}\nTransport Modes: ${newInquiry.preferredTransportModes.join(', ')}\nPreferences: ${newInquiry.travelPreferences.join(', ')}\nHotel Arrangements: ${newInquiry.accommodationRequired ? (newInquiry.hotelCategory || 'Yes') : 'No'}\nPrivate Budget (Confidential): ${newInquiry.privateBudget.currency} ${newInquiry.privateBudget.estimatedAmount} (${newInquiry.privateBudget.budgetType})\nAdditional Notes: ${newInquiry.notes || 'None'}`,
          reference: newInquiry.reference
        })
      }).catch(e => console.warn('[TransportService] email notification background dispatch notice:', e));
    } catch {
      // non-blocking
    }

    return newInquiry;
  },

  async getTransportInquiries(): Promise<TransportInquiry[]> {
    try {
      const q = query(collection(db, 'transport_inquiries'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: TransportInquiry[] = [];
      snap.forEach(d => list.push(d.data() as TransportInquiry));
      if (list.length > 0) {
        localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('[TransportService] getTransportInquiries Firestore fallback:', err);
    }

    try {
      const cached = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (cached) return JSON.parse(cached);
    } catch {
      // silent
    }

    return [];
  },

  async updateInquiryStatus(
    inquiryId: string, 
    status: TransportInquiryStatus, 
    adminNote?: string, 
    quotedAmount?: number, 
    assignedConsultant?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, 'transport_inquiries', inquiryId);
      const updates: Record<string, any> = {
        status,
        updatedAt: serverTimestamp()
      };
      if (assignedConsultant) updates.assignedConsultant = assignedConsultant;
      if (quotedAmount !== undefined) {
        updates['privateQuotationDetails.quotedAmount'] = quotedAmount;
        updates['privateQuotationDetails.sentAt'] = new Date().toISOString();
      }
      await updateDoc(docRef, updates);
    } catch (err) {
      console.warn('[TransportService] updateInquiryStatus Firestore write error:', err);
    }

    // Update local cache
    try {
      const existing = await this.getTransportInquiries();
      const item = existing.find(i => i.id === inquiryId);
      if (item) {
        item.status = status;
        if (assignedConsultant) item.assignedConsultant = assignedConsultant;
        if (adminNote) {
          item.privateAdminNotes = item.privateAdminNotes || [];
          item.privateAdminNotes.push(`${new Date().toLocaleDateString()}: ${adminNote}`);
        }
        if (quotedAmount !== undefined) {
          item.privateQuotationDetails = item.privateQuotationDetails || {};
          item.privateQuotationDetails.quotedAmount = quotedAmount;
        }
        localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(existing));
      }
    } catch {
      // silent
    }
  }
};
