// Sample journeys. `route` is the order of stops used for the flight map;
// each stop is a destination slug or a hub key (see hubs below).
// Flight times shown on the site are estimates calculated from straight-line
// distance (see src/lib/geo.js); real routings and stops vary.

const hubs = {
  maun: { name: 'Maun', lon: 23.43, lat: -19.97, note: 'Main gateway for the Delta and the pans' },
  kasane: { name: 'Kasane', lon: 25.16, lat: -17.83, note: 'Gateway for Chobe; close to Victoria Falls' },
};

const journeys = [
  {
    slug: 'flood-season-circuit',
    photo: 'okavango-3',
    name: 'The Flood Season Circuit',
    nights: 9,
    season: 'June to September',
    months: [6, 7, 8, 9],
    pace: 'Three camps, three nights each',
    summary: 'Water, woodland and river: a mokoro camp in the Delta, the floodplains of Moremi, then a private stretch of the Linyanti.',
    route: ['maun', 'okavango-delta', 'moremi', 'linyanti', 'kasane'],
    days: [
      { d: 'Day 1', place: 'okavango-delta', title: 'Maun to the Delta', text: 'Arrive in Maun and transfer to the airstrip for a short light-aircraft flight over the floodplains to a water camp. Afternoon mokoro on the channels near camp.' },
      { d: 'Days 2–3', place: 'okavango-delta', title: 'Mokoro and island walks', text: 'Early starts by mokoro, a guided walk on a palm island, long middays in camp. A boat trip to a lagoon if water levels allow.' },
      { d: 'Day 4', place: 'moremi', title: 'Fly to the Moremi side', text: 'A short hop east to a camp near the reserve. Afternoon drive on the floodplains.' },
      { d: 'Days 5–6', place: 'moremi', title: 'Floodplains and lagoons', text: 'Full days exploring the reserve with a packed breakfast, back to camp for the hot hours. Night drive outside the reserve boundary where the camp is in a community area.' },
      { d: 'Day 7', place: 'linyanti', title: 'North to the Linyanti', text: 'Fly north over the mopane woodland to a private concession on the river.' },
      { d: 'Days 8–9', place: 'linyanti', title: 'A private river', text: 'Elephants coming down to drink, off-road tracking with your guide, a walk, a night drive. Very few other vehicles.' },
      { d: 'Day 10', place: 'kasane', title: 'Out via Kasane', text: 'Fly to Kasane for your onward flight, or add two nights at Victoria Falls.' },
    ],
  },
  {
    slug: 'green-season-pans-and-delta',
    photo: 'makgadikgadi-1',
    name: 'Green Season: Pans and Delta',
    nights: 10,
    season: 'December to March',
    months: [12, 1, 2, 3],
    pace: 'Four stays, two to three nights each',
    summary: 'The rains side of Botswana: zebra on green pans, springbok in the Kalahari valleys, then a land-based Delta camp at quiet rates.',
    route: ['maun', 'central-kalahari', 'makgadikgadi-pans', 'nxai-pan', 'okavango-delta', 'maun'],
    days: [
      { d: 'Day 1', place: 'central-kalahari', title: 'Into the Kalahari', text: 'Fly south-east from Maun to a small camp in or near the Central Kalahari. Sundowners as storms build over the plains.' },
      { d: 'Days 2–3', place: 'central-kalahari', title: 'Fossil valleys', text: 'Drives in Deception Valley in search of springbok, gemsbok and the lions that follow them. Long, silent nights.' },
      { d: 'Day 4', place: 'makgadikgadi-pans', title: 'To the pans', text: 'Fly north-east to the edge of the Makgadikgadi. Afternoon with a habituated meerkat colony, where offered.' },
      { d: 'Days 5–6', place: 'makgadikgadi-pans', title: 'Zebra on the grasslands', text: 'Game drives among the grazers and a walk with San guides, if the camp offers it.' },
      { d: 'Day 7', place: 'nxai-pan', title: 'Nxai Pan and the baobabs', text: 'Transfer north to Nxai Pan, stopping at Baines\' Baobabs on the way (roads permitting).' },
      { d: 'Day 8', place: 'nxai-pan', title: 'Green-season game', text: 'A full day on the grassed pans, where springbok and zebra draw cheetah and lion.' },
      { d: 'Day 9', place: 'okavango-delta', title: 'Fly to the Delta', text: 'Light aircraft to a land-based Delta camp. Green islands, migrant birds, quieter camps.' },
      { d: 'Days 10–11', place: 'okavango-delta', title: 'Delta in the rains', text: 'Game drives and walks. Depart on day 11 by air to Maun.' },
    ],
  },
  {
    slug: 'rivers-of-the-north',
    photo: 'chobe-1',
    name: 'Rivers of the North',
    nights: 7,
    season: 'July to October',
    months: [7, 8, 9, 10],
    pace: 'Three camps; easy start from Kasane',
    summary: 'A shorter route for elephant country: a quiet look at the Chobe riverfront, the predators of Savuti and a private Linyanti camp.',
    route: ['kasane', 'chobe-riverfront', 'savuti', 'linyanti', 'maun'],
    days: [
      { d: 'Day 1', place: 'chobe-riverfront', title: 'Kasane and the river', text: 'Arrive in Kasane. An afternoon on the Chobe River in a small boat as the herds come down to drink.' },
      { d: 'Day 2', place: 'chobe-riverfront', title: 'Morning on the riverfront', text: 'An early drive along the river before the day gets busy, then a quiet afternoon.' },
      { d: 'Day 3', place: 'savuti', title: 'South to Savuti', text: 'Fly to Savuti. Afternoon drive along the channel.' },
      { d: 'Days 4–5', place: 'savuti', title: 'Marsh and hills', text: 'Predator territories on the marsh; the rock paintings in the Gubatsa Hills.' },
      { d: 'Day 6', place: 'linyanti', title: 'To the Linyanti', text: 'A short flight to a private concession on the river.' },
      { d: 'Days 7–8', place: 'linyanti', title: 'Elephants and lagoons', text: 'Drives, a walk and an evening on the lagoon. Depart on day 8 by air to Maun.' },
    ],
  },
  {
    slug: 'tsodilo-and-panhandle',
    photo: 'panhandle-1',
    name: 'Tsodilo and the Panhandle',
    nights: 3,
    season: 'April to September',
    months: [4, 5, 6, 7, 8, 9],
    pace: 'One base; an add-on to any journey',
    summary: 'A short extension for people interested in the human story of the Kalahari: the rock art of Tsodilo and the river where it enters Botswana.',
    route: ['maun', 'tsodilo-hills', 'okavango-delta', 'maun'],
    days: [
      { d: 'Day 1', place: 'tsodilo-hills', title: 'Fly north-west', text: 'Light aircraft from Maun up the Okavango to the Panhandle. Afternoon on the river.' },
      { d: 'Day 2', place: 'tsodilo-hills', title: 'The hills', text: 'A day at Tsodilo with a local guide, walking the trails to the paintings while it is cool.' },
      { d: 'Day 3', place: 'okavango-delta', title: 'Papyrus and birds', text: 'A boat on the Panhandle among papyrus, looking for Pel\'s fishing owl and African skimmers.' },
      { d: 'Day 4', place: 'okavango-delta', title: 'Back to Maun', text: 'Fly to Maun to connect with the rest of your journey.' },
    ],
  },
];

module.exports = { hubs, journeys };
