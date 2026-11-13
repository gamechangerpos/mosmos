import { TravelGuide, FAQItem } from '../types';

export const TRAVEL_GUIDES: TravelGuide[] = [
  {
    id: 'bwind-gorilla-trekking-guide',
    slug: 'bwind-gorilla-trekking-guide',
    title: 'The Definitive Guide to Mountain Gorilla Trekking in Bwindi',
    category: 'Wildlife & Conservation',
    readTime: '6 min read',
    publishDate: 'October 2026',
    author: 'MOS MOS Safari Field Specialists',
    heroImage: '/images/destinations/uganda-bwindi.jpg',
    excerpt: 'Everything you need to know about preparing for one of wildlife’s most sacred encounters: permit acquisition, physical fitness, forest etiquette, and what happens during the hour you share with the silverback.',
    content: [
      'Mountain gorilla trekking in Uganda’s Bwindi Impenetrable National Park is consistently cited by travelers as the most transformative natural encounter of their lives. Unlike a savanna game drive where you observe from the safety of a 4x4 cruiser, gorilla trekking places you on foot, brush-to-leaf, directly in their primordial mountain home.',
      'Permits: Permits are strictly limited by the Uganda Wildlife Authority (UWA) to only 8 visitors per habituated gorilla group per day to protect them from human pathogens and stress. As of 2026, the permit price is $800 per person in Uganda ($1,500 in Rwanda). Booking 4 to 8 months in advance is essential for the dry seasons (June to September and December to February).',
      'The Trek Experience: Treks can last anywhere from 1.5 to 6 hours depending on where the gorilla family nested the previous evening. Bwindi’s terrain involves steep slopes, thick vines, and altitude between 1,160 and 2,600 meters. Hiring a local porter ($20) is not only vital for assistance over steep mud but directly provides sustainable livelihood to surrounding community families.',
      'The Golden Hour: Once your ranger trackers locate the group, you deposit your daypacks and approach to within 7–10 meters. For one uninterrupted hour, you watch infants tumble over mossy logs, mothers groom each other, and the towering silverback observe you with deep, soulful brown eyes. Flash photography is strictly forbidden, and face masks are required to protect gorillas from respiratory viruses.'
    ],
    tags: ['Uganda', 'Gorillas', 'Bwindi', 'Eco-Tourism']
  },
  {
    id: 'serengeti-migration-timing-guide',
    slug: 'serengeti-migration-timing-guide',
    title: 'Serengeti vs. Maasai Mara: When & Where to Catch the Great Migration',
    category: 'Safari Planning',
    readTime: '7 min read',
    publishDate: 'October 2026',
    author: 'MOS MOS Naturalist Team',
    heroImage: '/media/images/Africa/Mahali_Mzuri/images/mahali-mzuri-sundowners-with-elephants.jpg',
    excerpt: 'The Great Migration never truly stops—it is a continuous, circular annual journey driven by rainfall and fresh sweet grass. Discover the exact monthly rhythms of the mega-herds.',
    content: [
      'Every year, over 1.5 million blue wildebeest, 250,000 zebras, and hundreds of thousands of gazelles trace a clock-wise 800-kilometer loop through Tanzania’s Serengeti and Kenya’s Maasai Mara ecosystems.',
      'January to March (Calving Season in Southern Serengeti & Ndutu): Half a million wildebeest calves are born within a brief 3-week window on the short-grass plains. This attracts the highest density of cheetahs, lions, and hyenas anywhere on the continent.',
      'April to June (The Western Corridor & Grumeti River): The herds move northwest following the rains. In June, the first dramatic river crossings occur at the Grumeti River, where giant prehistoric Nile crocodiles wait patiently in the shallows.',
      'July to October (The Iconic Mara River Crossings): The pinnacle of wildlife drama. The herds amass on the northern Serengeti and Maasai Mara banks before plunging into the treacherous currents of the Mara River. Dust clouds, snapping jaws, and panic create raw nature at its most intense.',
      'November to December (Return South): Brief rains trigger the herds to begin their march back through the eastern Serengeti toward the fertile southern volcanic soils, completing the timeless circle.'
    ],
    tags: ['Tanzania', 'Kenya', 'Serengeti', 'Great Migration']
  },
  {
    id: 'safari-photography-masterclass',
    slug: 'safari-photography-masterclass',
    title: 'Savanna Light: Essential Camera Gear & Techniques for Wildlife',
    category: 'Photography & Art',
    readTime: '5 min read',
    publishDate: 'October 2026',
    author: 'MOS MOS Photography Expedition Lead',
    heroImage: '/media/images/Africa/Ulusaba/images/image-12-ulusaba-safari-with-guest-_-elephant-2.jpg',
    excerpt: 'Capturing predator action, low-light dawn leopards, and intimate eye contact requires specific camera settings, lens selection, and beanbag discipline.',
    content: [
      'Lenses to Bring: A telephoto zoom like a 100-400mm or 150-600mm is your primary workhorse. While a fixed 600mm f/4 is magnificent for distant birds, animals frequently walk within 10 meters of your vehicle, making a zoom lens indispensable. A second body with a 24-70mm allows you to capture wildlife within its sweeping environmental context.',
      'Stability: Monopods and tripods are impractical inside a safari vehicle. Our custom MOS MOS 4x4 Land Cruisers provide beanbags filled with dry beans or rice that drape over the vehicle hatch and window frames, offering rock-solid vibration dampening.',
      'Shutter Speed is King: Never sacrifice shutter speed in wildlife photography. For stationary animals, 1/500s is safe; for running cheetahs or swooping eagles, 1/2000s or 1/3200s is required. Modern sensors handle ISO 1600–6400 with ease, so do not fear high ISO during the magical golden hour.'
    ],
    tags: ['Photography', 'Gear Tips', 'Wildlife']
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Gorilla Permits',
    question: 'How far in advance must I book gorilla trekking permits?',
    answer: 'We strongly recommend securing your mountain gorilla trekking permits 4 to 8 months in advance, especially for the dry travel windows (June to September and December to February). The Uganda Wildlife Authority and Rwanda Development Board strictly cap permits to 8 persons per gorilla family daily to safeguard the primates.'
  },
  {
    id: 'faq-2',
    category: 'Safaris & Wildlife',
    question: 'What is the best time of year for an African safari?',
    answer: 'East Africa offers spectacular year-round wildlife viewing. For the Great Migration Mara River crossings, visit between July and October. For gorilla and chimpanzee trekking in Uganda and Rwanda, the dry seasons (June–September and December–February) offer firmer trails. For southern Serengeti calving, visit January to March.'
  },
  {
    id: 'faq-3',
    category: 'Visas & Health',
    question: 'What vaccinations and visas do I need for Uganda, Kenya, and Tanzania?',
    answer: 'Yellow Fever vaccination is mandatory and proof of vaccination (Yellow Card) is checked on arrival. Malaria prophylactics are strongly advised throughout the region. For visas, Uganda requires an online e-Visa, Kenya requires an online electronic Travel Authorization (eTA), and Tanzania offers an online e-Visa. If visiting Uganda, Rwanda, and Kenya together, the East Africa Tourist Visa is an affordable multi-entry option.'
  },
  {
    id: 'faq-4',
    category: 'Booking & Payments',
    question: 'How does MOS MOS Safaris process bookings and payments?',
    answer: 'We follow an honest, multi-stage confirmation process: 1) You submit a trip or tour inquiry; 2) Our safari specialists curate a bespoke day-by-day itinerary with verified lodge allocations; 3) Once you review and approve the quotation, a 30% deposit secures all permits and lodge reservations. Full balance is settled 45 days prior to arrival via secure bank wire or authorized payment gateway.'
  },
  {
    id: 'faq-5',
    category: 'What to Pack',
    question: 'What clothing is recommended for bush safaris and gorilla trekking?',
    answer: 'Pack neutral safari colors (khaki, olive, tan, brown). Avoid bright blue and black in tsetse fly zones. For gorilla trekking in Bwindi, essential items include sturdy waterproof hiking boots with ankle support, long lightweight hiking trousers, gardening gloves (for gripping thorny vines), long wool socks (tuck your trousers into socks), and a lightweight rain jacket.'
  }
];
