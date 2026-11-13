import { TravelPackage } from '../types';

export const TRAVEL_PACKAGES: TravelPackage[] = [
  {
    id: 'uganda-wildlife-discovery',
    slug: 'uganda-wildlife-discovery',
    title: 'Uganda Wildlife & Primates Discovery',
    destinations: ['Uganda'],
    duration: '10 Days / 9 Nights',
    heroImage: '/images/destinations/uganda.jpg',
    overview: 'An all-encompassing circuit traversing the Albertine Rift: from Murchison Falls in the north to Kibale primate forest, Queen Elizabeth savanna, and mountain gorilla habitations in Bwindi.',
    highlights: [
      'Official Bwindi mountain gorilla tracking permit included',
      'Wild chimpanzee tracking in Kibale Forest',
      'Boat safari on the Kazinga Channel and River Nile',
      'Ishasha tree-climbing lions game drive',
      'Comfortable eco-lodges surrounded by national parks'
    ],
    inclusions: [
      'All national park entrance fees and wildlife permits',
      'Custom 4x4 safari vehicle with window seats and pop-up roof',
      'Full-board accommodation at selected lodges',
      'Professional certified Ugandan safari guide',
      'Airport meet, greet, and transfers'
    ],
    exclusions: [
      'International flights to/from Entebbe',
      'Ugandan visa',
      'Travel and emergency medical insurance',
      'Personal laundry, telephone calls, and tips'
    ],
    indicativePrice: 4250,
    priceNote: 'Indicative per person based on 2 guests sharing',
    category: 'Wildlife & Primates'
  },
  {
    id: 'tanzania-safari-zanzibar-escape',
    slug: 'tanzania-safari-zanzibar-escape',
    title: 'Tanzania Safari & Zanzibar Turquoise Escape',
    destinations: ['Tanzania'],
    duration: '11 Days / 10 Nights',
    heroImage: '/images/destinations/tanzania.jpg',
    overview: 'The quintessential bush-and-beach combination: thrilling Great Migration game drives in the Serengeti and Ngorongoro Crater, followed by a barefoot luxury beach retreat on Zanzibar island.',
    highlights: [
      'Full-day game drive in the Ngorongoro Crater caldera',
      'Serengeti plains wildlife tracking with big cats',
      '4 nights in a beachfront boutique resort in Zanzibar',
      'Private walking spice tour of historic Stone Town',
      'Domestic flight between Serengeti and Zanzibar'
    ],
    inclusions: [
      'All park entrance fees and concession fees',
      'Domestic scheduled flight from Serengeti to Zanzibar',
      'Full-board safari accommodations + half-board beach resort',
      'Stone Town cultural guided tour',
      'Private safari 4x4 Land Cruiser in northern circuit'
    ],
    exclusions: [
      'International flights',
      'Tanzania tourist visa ($50-$100)',
      'Water sports and diving gear in Zanzibar',
      'Driver-guide and lodge gratuities'
    ],
    indicativePrice: 4890,
    priceNote: 'Indicative per person sharing; rates vary by migration season',
    category: 'Bush & Beach'
  },
  {
    id: 'kenya-wildlife-safari',
    slug: 'kenya-wildlife-safari',
    title: 'Kenya Classic Wildlife Safari',
    destinations: ['Kenya'],
    duration: '8 Days / 7 Nights',
    heroImage: '/images/destinations/kenya.jpg',
    overview: 'From the dramatic flamingo-flecked waters of the Great Rift Valley to Amboseli’s Kilimanjaro vistas and the legendary predator plains of the Maasai Mara.',
    highlights: [
      'Amboseli elephant herds with Kilimanjaro backdrop',
      'Lake Nakuru rhino sanctuary & birding boat trip',
      'Three nights in a premier Maasai Mara conservancy camp',
      'Maasai warrior bush tracking and storytelling',
      'Sundowners overlooking the Mara savanna'
    ],
    inclusions: [
      'All reserve and conservancy fees',
      'Full-board safari lodge accommodation',
      '4x4 Land Cruiser with pop-up roof for photography',
      'Certified silver-level KPSGA safari guide',
      'Emergency medical evacuation coverage within Kenya'
    ],
    exclusions: [
      'International airfare',
      'Kenya electronic travel authorization (eTA)',
      'Hot air balloon flight over Mara',
      'Discretionary guide and staff tips'
    ],
    indicativePrice: 3600,
    priceNote: 'Indicative per person sharing double room',
    category: 'Classic Wildlife'
  },
  {
    id: 'rwanda-gorilla-nature-experience',
    slug: 'rwanda-gorilla-nature-experience',
    title: 'Rwanda Gorilla & Emerald Nature Experience',
    destinations: ['Rwanda'],
    duration: '6 Days / 5 Nights',
    heroImage: '/images/destinations/rwanda.jpg',
    overview: 'A scenic exploration of Rwanda’s natural sanctuaries, combining gorilla and golden monkey trekking in the Virungas with the pristine canopy walkways and chimpanzees of Nyungwe Forest.',
    highlights: [
      'Official Rwanda Mountain Gorilla Trekking permit',
      'Nyungwe National Park 70m high rainforest canopy walk',
      'Lake Kivu tranquil lakeside relaxation',
      'Guided Kigali historical and architectural highlights',
      'Eco-luxury mountain lodge stays'
    ],
    inclusions: [
      'Official gorilla permit ($1,500 value)',
      'All park entrance fees and canopy walkway permits',
      'Private 4x4 transport with personal chauffeur guide',
      'Full-board accommodation at premier lodges',
      'Airport VIP arrival assistance'
    ],
    exclusions: [
      'International flights',
      'Personal travel insurance',
      'Porter hire fees on treks',
      'Alcoholic beverages not listed on lodge plan'
    ],
    indicativePrice: 4750,
    priceNote: 'Indicative per person sharing',
    category: 'Conservation & Primates'
  },
  {
    id: 'south-africa-highlights',
    slug: 'south-africa-highlights',
    title: 'South Africa Splendors: Kruger, Cape & Vineyards',
    destinations: ['South Africa'],
    duration: '10 Days / 9 Nights',
    heroImage: '/images/destinations/south-africa.jpg',
    overview: 'The ultimate luxury South Africa itinerary: world-class Big Five safaris in Sabi Sand private game reserve, scenic coastal exploration in Cape Town, and private tastings in the Cape Winelands.',
    highlights: [
      '3 nights at a 5-star private safari lodge in Sabi Sand with off-road Big Five tracking',
      '4 nights in a boutique Cape Town waterfront hotel with Table Mountain cable car',
      '2 nights in Franschhoek wine valley with sommelier-led cellar tours',
      'Scenic Cape Peninsula drive visiting Boulders Beach African penguins'
    ],
    inclusions: [
      'Domestic flights Johannesburg – Kruger – Cape Town',
      'All luxury accommodations and daily breakfasts',
      'All meals and open-vehicle game drives at Kruger lodge',
      'Private guided touring in Cape Town and Winelands',
      'Table Mountain ticket and Boulders Beach entry'
    ],
    exclusions: [
      'International airfare',
      'Lunches and dinners in Cape Town & Winelands',
      'Personal purchases and gratuities'
    ],
    indicativePrice: 4600,
    priceNote: 'Indicative per person sharing',
    category: 'Luxury Safari & City'
  },
  {
    id: 'dubai-city-escape',
    slug: 'dubai-city-escape',
    title: 'Dubai City Elegance & Desert Sanctuary',
    destinations: ['Dubai'],
    duration: '5 Days / 4 Nights',
    heroImage: '/images/destinations/dubai.jpg',
    overview: 'A stylish Middle Eastern getaway blending Burj Khalifa views and yacht cruises with luxury tented hospitality in the Dubai Desert Conservation Reserve.',
    highlights: [
      'Burj Khalifa "At the Top" observation deck fast-track entry',
      'Heritage desert safari with falconry and Bedouin dinner',
      'Private sunset cruise around Palm Jumeirah and Burj Al Arab',
      'Shopping concierge in Dubai Mall and gold souks'
    ],
    inclusions: [
      '5-star hotel accommodations',
      'Private chauffeur transfers throughout',
      'Desert conservation safari with dinner',
      'All listed admission passes'
    ],
    exclusions: [
      'International flights',
      'Dubai Tourism Dirham fee',
      'Meals not specified'
    ],
    indicativePrice: 1850,
    priceNote: 'Indicative per person sharing',
    category: 'City & Desert'
  },
  {
    id: 'thailand-cultural-beach-holiday',
    slug: 'thailand-cultural-beach-holiday',
    title: 'Thailand Cultural Odyssey & Andaman Beach Haven',
    destinations: ['Thailand'],
    duration: '10 Days / 9 Nights',
    heroImage: '/images/destinations/thailand.jpg',
    overview: 'Experience the gilded temples of Bangkok, the lush mountain valleys and ethical elephant sanctuaries of Chiang Mai, and the turquoise waters of Phuket.',
    highlights: [
      'Private longtail boat tour of Bangkok canals and Grand Palace',
      'Full day at an ethical elephant rescue sanctuary in Chiang Mai',
      'Private island hopping in Phang Nga Bay by catamaran',
      'Thai cooking masterclass with master chef'
    ],
    inclusions: [
      'Domestic flights Bangkok – Chiang Mai – Phuket',
      'Boutique resort accommodations with breakfast',
      'Private English-speaking local tour guides',
      'Sanctuary visits and marine park fees'
    ],
    exclusions: ['International flights', 'Personal travel insurance', 'Gratuities'],
    indicativePrice: 2200,
    priceNote: 'Indicative per person sharing',
    category: 'Culture & Island'
  },
  {
    id: 'bali-island-retreat',
    slug: 'bali-island-retreat',
    title: 'Bali Island Retreat: Ubud Sanctuaries & Coastal Cliffs',
    destinations: ['Bali'],
    duration: '8 Days / 7 Nights',
    heroImage: '/images/destinations/bali.jpg',
    overview: 'Find rejuvenation in the emerald heart of Ubud with private infinity pool villas, spiritual water blessings, and clifftop sunsets in Uluwatu.',
    highlights: [
      '4 nights in a rainforest villa in Ubud + 3 nights in an oceanfront Uluwatu resort',
      'Tirta Empul water purification ceremony with Balinese priest',
      'Sunrise Mount Batur private jeep tour and volcanic breakfast',
      'Sunset Kecak fire dance on Uluwatu cliffs'
    ],
    inclusions: [
      'Private villa and resort accommodations',
      'Daily breakfast and scheduled wellness therapies',
      'Private driver and air-conditioned transport for tours',
      'All temple entry fees and sarong rentals'
    ],
    exclusions: ['International airfare', 'Indonesia e-VoA', 'Personal spa add-ons'],
    indicativePrice: 1950,
    priceNote: 'Indicative per person sharing',
    category: 'Wellness & Culture'
  },
  {
    id: 'ethiopia-heritage-journey',
    slug: 'ethiopia-heritage-journey',
    title: 'Ethiopia Ancient Civilizations & Simien Highlands',
    destinations: ['Ethiopia'],
    duration: '9 Days / 8 Nights',
    heroImage: '/images/destinations/ethiopia.jpg',
    overview: 'A profound journey through millennia of heritage: the 12th-century monolithic rock-cut churches of Lalibela, the castles of Gondar, and the dramatic precipices of the Simien Mountains.',
    highlights: [
      'Extensive private tour of Lalibela’s 11 rock-hewn churches',
      'Gentle hike in Simien Mountains with wild Gelada baboons',
      'Fasil Ghebbi medieval castles in Gondar',
      'Authentic coffee roasting ceremonies and injera tastings'
    ],
    inclusions: [
      'Domestic flights Addis Ababa – Gondar – Lalibela – Addis Ababa',
      'All World Heritage site entrance fees and local guides',
      'Comfortable lodge accommodations',
      'Full-board meal plan on circuit'
    ],
    exclusions: ['International flights', 'Ethiopia e-Visa', 'Tips and personal items'],
    indicativePrice: 2850,
    priceNote: 'Indicative per person sharing',
    category: 'Heritage & Trekking'
  },
  {
    id: 'egypt-ancient-wonders',
    slug: 'egypt-ancient-wonders',
    title: 'Egypt Pharaohs & Grand Nile Luxury Cruise',
    destinations: ['Egypt'],
    duration: '9 Days / 8 Nights',
    heroImage: '/images/destinations/egypt.jpg',
    overview: 'The wonder of antiquity unveiled: stand before the Great Pyramids and the Sphinx, then glide along the Nile from Luxor to Aswan aboard an intimate luxury cruise ship.',
    highlights: [
      'Private Egyptologist-guided tour of Giza Pyramids & Grand Egyptian Museum',
      '4 nights aboard a luxury 5-star Nile cruise ship with all meals',
      'Valley of the Kings, Karnak Temple, and Queen Hatshepsut Temple',
      'Excursion to colossal rock-cut temples of Abu Simbel'
    ],
    inclusions: [
      'Domestic flights Cairo – Luxor / Aswan – Cairo',
      'Luxury Cairo hotel (4 nights) + Nile Cruise (4 nights)',
      'Full-board on cruise ship, breakfast in Cairo',
      'All temple entry fees and private Egyptologist guide'
    ],
    exclusions: ['International airfare', 'Egypt entry visa', 'Abu Simbel charter flight if upgraded', 'Gratuities'],
    indicativePrice: 2650,
    priceNote: 'Indicative per person sharing',
    category: 'Ancient Heritage & Cruise'
  }
];
