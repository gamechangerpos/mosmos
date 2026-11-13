import { SafariTour } from '../types';

export const SAFARI_TOURS: SafariTour[] = [
  {
    id: 'uganda-primates-wildlife-odyssey',
    slug: 'uganda-primates-wildlife-odyssey',
    title: '8-Day Uganda Ultimate Primates & Murchison Odyssey',
    destination: 'Uganda',
    destinationSlug: 'uganda',
    durationDays: 8,
    indicativePrice: 3850,
    priceNote: 'Indicative per person sharing (includes official $800 Gorilla & Chimpanzee permits)',
    heroImage: '/images/destinations/uganda.jpg',
    summary: 'A definitive Ugandan circuit combining mountain gorilla tracking in Bwindi, wild chimpanzee habituation in Kibale, Nile boat safaris in Murchison Falls, and tree-climbing lions in Queen Elizabeth.',
    highlights: [
      'Guaranteed official UWA Mountain Gorilla Trekking permit in Bwindi',
      'Wild chimpanzee tracking in the dense canopy of Kibale Forest',
      'Private boat cruise to the base of thundering Murchison Falls',
      'Savanna game drives in search of lions, leopards, and Rothschild giraffes',
      'Kazinga Channel boat cruise with the world’s highest hippo concentration'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Entebbe & Welcome Dinner',
        description: 'Meet your private MOS MOS safari guide at Entebbe International Airport. Transfer to your lakeside boutique retreat for safari briefing and sunset dinner.',
        accommodation: 'Hotel No.5 Entebbe',
        meals: 'Dinner'
      },
      {
        day: 2,
        title: 'Ziwa Rhino Sanctuary & Murchison Falls',
        description: 'Drive northwest to Ziwa Rhino Sanctuary for a guided bush walk tracking southern white rhinos. Continue to Murchison Falls National Park and visit the dramatic top of the falls.',
        accommodation: 'Paraa Safari Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Northern Delta Game Drive & River Nile Boat Safari',
        description: 'Early morning game drive in the Buligi grassland looking for lions, leopards, elephants, and Jackson’s hartebeests. Afternoon boat safari upstream to the base of the falls.',
        accommodation: 'Paraa Safari Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Scenic Transfer to Kibale Primate Capital',
        description: 'Travel through rolling tea plantation hills and Albertine Rift escarpments to Kibale Forest National Park. Afternoon nature walk in Bigodi Wetland Sanctuary.',
        accommodation: 'Ndali Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Chimpanzee Tracking & Queen Elizabeth Park',
        description: 'Morning chimpanzee tracking beneath the ancient forest canopy with expert trackers. Continue south crossing the Equator into Queen Elizabeth National Park.',
        accommodation: 'Kyambura Gorge Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 6,
        title: 'Kazinga Channel Boat Safari & Transfer to Bwindi',
        description: 'Morning boat safari along the Kazinga Channel fringed with herds of buffalos, elephants, and migratory birds. Journey through Ishasha to the misty ridge of Bwindi.',
        accommodation: 'Sanctuary Gorilla Forest Camp',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 7,
        title: 'The Mountain Gorilla Encounter in Bwindi',
        description: 'The defining moment of your journey: hike into the ancient misty forest with ranger guides to spend a transformative hour in the quiet presence of a wild mountain gorilla family.',
        accommodation: 'Sanctuary Gorilla Forest Camp',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 8,
        title: 'Scenic Flight or Transfer to Entebbe & Departure',
        description: 'Morning breakfast overlooking the forested valleys. Transfer to Kihihi airstrip for your domestic scenic flight back to Entebbe for international connections.',
        meals: 'Breakfast, Lunch'
      }
    ],
    inclusions: [
      'Official Uganda Wildlife Authority gorilla trekking permit ($800 value)',
      'Official chimpanzee tracking permit in Kibale Forest ($250 value)',
      'All national park entrance fees and boat safaris',
      'Exclusive 4x4 Land Cruiser with pop-up photography roof and unlimited bottled water',
      'Full-board luxury lodge accommodation',
      'Professional English-speaking senior safari guide',
      'Entebbe airport transfers and park game drives'
    ],
    exclusions: [
      'International flights',
      'Ugandan tourist entry visa',
      'Travel insurance and medical evacuation coverage',
      'Premium alcoholic spirits and vintage wines',
      'Gratuities for driver-guide, trackers, and lodge staff'
    ],
    physicalRating: 'Moderate',
    maxGroupSize: 6,
    featured: true
  },
  {
    id: 'serengeti-great-migration-safari',
    slug: 'serengeti-great-migration-safari',
    title: '7-Day Tanzania Great Migration & Ngorongoro Caldera',
    destination: 'Tanzania',
    destinationSlug: 'tanzania',
    durationDays: 7,
    indicativePrice: 4200,
    priceNote: 'Indicative per person sharing during peak migration season',
    heroImage: '/images/destinations/tanzania-serengeti.jpg',
    summary: 'Follow the legendary Great Migration across the endless plains of the Serengeti, witness predator interactions, and descend 600 meters into the volcanic sanctuary of Ngorongoro Crater.',
    highlights: [
      'Strategic luxury mobile camp positioned in the path of the Great Migration',
      'Full-day game drive inside the UNESCO World Heritage Ngorongoro Crater',
      'High predator densities: lions, leopards, cheetahs, and hyenas',
      'Optional sunrise hot air balloon flight over the savanna herds',
      'Tarangire baobab landscapes with massive elephant herds'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arusha to Tarangire National Park',
        description: 'Depart Arusha into Tarangire, famous for ancient baobabs and large elephant families along the Tarangire River.',
        accommodation: 'Tarangire Treetops',
        meals: 'Lunch, Dinner'
      },
      {
        day: 2,
        title: 'Lake Manyara to the Ngorongoro Highlands',
        description: 'Morning game drive in Lake Manyara renowned for flamingos and tree-climbing lions. Ascend into the cool green highlands of Ngorongoro.',
        accommodation: 'Ngorongoro Crater Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Descent into Ngorongoro Crater Bowl',
        description: 'Dawn descent into the 20km-wide caldera floor. Unrivaled Big Five game viewing around Lake Magadi and Lerai Forest.',
        accommodation: 'Ngorongoro Crater Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Into the Vast Serengeti Plains',
        description: 'Drive down through the Olduvai Gorge region into the boundless plains of the Serengeti. Afternoon game drive tracking big cats.',
        accommodation: 'Singita Grumeti Mobile Camp',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Full Day Following the Migration Herds',
        description: 'Spend dawn to dusk immersed in the movement of hundreds of thousands of wildebeest and zebras with picnic lunch under an acacia.',
        accommodation: 'Singita Grumeti Mobile Camp',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 6,
        title: 'Predator Tracking & Sunset Sundowner',
        description: 'Morning pursuit of cheetahs on the hunt and leopards in riverine woodlands. Evening sundowner drinks on a rocky granite kopje.',
        accommodation: 'Singita Grumeti Mobile Camp',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 7,
        title: 'Serengeti Bush Flight to Arusha or Zanzibar',
        description: 'Final sunrise game drive to the bush airstrip. Board your bush flight to Arusha for departure or onward beach extension to Zanzibar.',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      'All Serengeti and Ngorongoro national park and conservation fees',
      'Crater vehicle service fees',
      'Private custom 4x4 safari cruiser with pop-up roof',
      'Full-board luxury tented camp accommodations',
      'Unlimited game drives with professional naturalist',
      'Bush airstrip transfer and flight to Arusha'
    ],
    exclusions: [
      'International flights to Kilimanjaro (JRO)',
      'Tanzania tourist visa',
      'Hot air balloon safari (available as add-on)',
      'Personal travel insurance'
    ],
    physicalRating: 'Easy',
    maxGroupSize: 6,
    featured: true
  },
  {
    id: 'maasai-mara-amboseli-big-five',
    slug: 'maasai-mara-amboseli-big-five',
    title: '6-Day Kenya Big Five & Amboseli Kilimanjaro Quest',
    destination: 'Kenya',
    destinationSlug: 'kenya',
    durationDays: 6,
    indicativePrice: 3450,
    priceNote: 'Indicative per person sharing in boutique safari camps',
    heroImage: '/media/images/Africa/Finch_Hattons/images/finch-hattons-game-drive-with-elephants.jpg',
    summary: 'The quintessential safari romance: Amboseli’s famous elephant herds framed against snow-capped Kilimanjaro, followed by thrilling game drives across the golden savanna of the Maasai Mara.',
    highlights: [
      'Panoramic photography of giant tuskers beneath Mount Kilimanjaro',
      'Exclusive private conservancy game drives with night tracking',
      'High concentrations of pride lions and cheetah coalitions in the Mara',
      'Traditional cultural welcome by Maasai community leaders',
      'Luxury canvas suites with personal butler service'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Nairobi to Amboseli National Park',
        description: 'Depart Nairobi driving south towards the Tanzanian border. Arrive at Amboseli with stunning views of Kilimanjaro’s Kibo peak.',
        accommodation: 'Tortilis Camp Amboseli',
        meals: 'Lunch, Dinner'
      },
      {
        day: 2,
        title: 'Full Day in Amboseli Swamp & Savanna',
        description: 'Morning and afternoon game drives around Enkongo Narok marsh where elephants bathe and hippos wallow in clear springs.',
        accommodation: 'Tortilis Camp Amboseli',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Scenic Bush Flight to the Maasai Mara',
        description: 'Board your morning bush plane flying northwest over the Great Rift Valley into the Maasai Mara private conservancy.',
        accommodation: 'Angama Mara / Mara Plains Camp',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Mara River & Savanna Predator Safari',
        description: 'Full day exploring the open savanna where lions stalk grazing gazelles and leopards rest in sausage tree branches.',
        accommodation: 'Angama Mara / Mara Plains Camp',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Private Conservancy Walking Safari & Night Drive',
        description: 'Guided morning foot safari learning bush tracking and medicinal flora. Afternoon game drive extending into an exciting spotlight night drive.',
        accommodation: 'Angama Mara / Mara Plains Camp',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 6,
        title: 'Bush Flight to Nairobi & Departure',
        description: 'Final morning game drive and bush breakfast. Fly back to Wilson Airport Nairobi for afternoon shopping and evening international connection.',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      'Domestic scheduled flights Nairobi – Amboseli – Mara – Nairobi',
      'All conservancy and national reserve entry fees',
      'Open-sided 4WD safari vehicles optimized for photography',
      'Full-board accommodation with drinks included in camp',
      'Bush walks and night game drives in private conservancy'
    ],
    exclusions: [
      'International flights to Nairobi (NBO)',
      'Kenya eTA fee',
      'Hot air balloon safari',
      'Staff tips and personal items'
    ],
    physicalRating: 'Easy',
    maxGroupSize: 6,
    featured: true
  },
  {
    id: 'rwanda-silverback-quest',
    slug: 'rwanda-silverback-quest',
    title: '4-Day Rwanda Silverback & Volcanoes Sanctuary',
    destination: 'Rwanda',
    destinationSlug: 'rwanda',
    durationDays: 4,
    indicativePrice: 4100,
    priceNote: 'Includes official Rwanda Development Board gorilla permit ($1,500)',
    heroImage: '/images/destinations/rwanda-volcanoes.jpg',
    summary: 'An exclusive, high-comfort expedition to the emerald slopes of Volcanoes National Park in Rwanda, combining iconic gorilla encounters with golden monkey tracking and world-class eco-architecture.',
    highlights: [
      'Guaranteed official RDB Mountain Gorilla Trekking permit ($1,500 value)',
      'Rare golden monkey tracking through high bamboo zones',
      'Stay at pioneering luxury lodges like Bisate Lodge or Singita Kwitonda',
      'Private 4x4 safari cruiser and dedicated private guide throughout',
      'Kigali Genocide Memorial & cultural design district tour'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Kigali & Transfer to Volcanoes NP',
        description: 'Welcome at Kigali International Airport. Visit the Kigali Genocide Memorial, then take a picturesque drive through the rolling green hills to Musanze.',
        accommodation: 'Bisate Lodge / One&Only Gorillas Nest',
        meals: 'Lunch, Dinner'
      },
      {
        day: 2,
        title: 'The Silverback Gorilla Trekking Experience',
        description: 'Morning briefing at Kinigi headquarters. Trek into the misty rainforest to spend an unforgettable hour observing a silverback gorilla family in their natural sanctuary.',
        accommodation: 'Bisate Lodge / One&Only Gorillas Nest',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Golden Monkey Tracking & Dian Fossey Foundation',
        description: 'Hike into the lower bamboo slopes to encounter the acrobatic, golden-furred Cercopithecus mitis. Afternoon visit to the Ellen DeGeneres Campus of the Dian Fossey Gorilla Fund.',
        accommodation: 'Bisate Lodge / One&Only Gorillas Nest',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Twin Lakes Scenic Drive & Kigali Departure',
        description: 'Morning visit to scenic Twin Lakes Burera and Ruhondo. Scenic drive back to Kigali for artisan shopping and airport departure.',
        meals: 'Breakfast, Lunch'
      }
    ],
    inclusions: [
      'Official Rwanda Mountain Gorilla Permit ($1,500)',
      'Official Golden Monkey permit',
      'All park entrance fees and ranger guides',
      'Private luxury 4WD transport with English/French-speaking guide',
      'Full-board accommodation at premier eco-lodge',
      'All meals and selected fine beverages'
    ],
    exclusions: [
      'International flights',
      'Entry visa for Rwanda',
      'Staff tips and personal gratuities',
      'Travel and medical insurance'
    ],
    physicalRating: 'Moderate',
    maxGroupSize: 4,
    featured: true
  },
  {
    id: 'kruger-sabi-sands-safari',
    slug: 'kruger-sabi-sands-safari',
    title: '5-Day Greater Kruger & Sabi Sand Concession Immersion',
    destination: 'South Africa',
    destinationSlug: 'south-africa',
    durationDays: 5,
    indicativePrice: 3200,
    priceNote: 'Indicative per person sharing in private game reserves',
    heroImage: '/media/images/Africa/Ulusaba/images/image-13-ulusaba-safari-with-guest-_-leopard.jpg',
    summary: 'The gold standard of African luxury wildlife safari: unfenced private concessions in Sabi Sand and Kruger, where legendary leopard tracking and intimate Big Five sightings are second to none.',
    highlights: [
      'Unmatched leopard sightings in the famous Sabi Sand private concession',
      'Off-road tracking rights for sensitive close-up wildlife encounters',
      'Twice-daily open Land Cruiser game drives with tracker-and-guide team',
      'Exceptional South African wine pairings and open-air boma dining',
      'Scenic bush flight connections directly onto private reserve airstrips'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Fly Johannesburg to Sabi Sand Concession',
        description: 'Board your morning charter from O.R. Tambo directly to the private lodge airstrip. Afternoon debut game drive and sunset drinks in the bush.',
        accommodation: 'Royal Malewane / Lion Sands River Lodge',
        meals: 'Lunch, Dinner'
      },
      {
        day: 2,
        title: 'Dawn & Dusk Big Five Tracking',
        description: 'Morning tracking of wild dogs and rhinos followed by midday relaxation by your private plunge pool. Sunset game drive into the night with spotlights.',
        accommodation: 'Royal Malewane / Lion Sands River Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Walking Safari & Photography Focus',
        description: 'Guided morning bush walk learning animal spoor, birds, and insects. Late afternoon game drive targeting elusive predators.',
        accommodation: 'Royal Malewane / Lion Sands River Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Riverfront Wildlife & Starlit Boma Feast',
        description: 'Game drive along the Sand River where elephants drink. Evening traditional African boma feast roasted over open coals under the southern stars.',
        accommodation: 'Royal Malewane / Lion Sands River Lodge',
        meals: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Sunrise Game Drive & Departure',
        description: 'Final morning drive to capture the sunrise light. Hearty breakfast before your charter flight returns to Johannesburg.',
        meals: 'Breakfast'
      }
    ],
    inclusions: [
      'Round-trip charter flights from Johannesburg to lodge airstrip',
      'Luxury suite accommodation with private plunge pool',
      'Two daily game drives and bush walks with tracker and ranger',
      'All meals, high teas, and selected South African reserve wines',
      'All conservation fees and private reserve levies'
    ],
    exclusions: [
      'International flights',
      'Premium cellar vintage wines and champagnes',
      'Spa treatments',
      'Driver and lodge staff tips'
    ],
    physicalRating: 'Easy',
    maxGroupSize: 6,
    featured: true
  }
];
