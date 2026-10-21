// ---------------------------------------------------------------------------
// Brand config. Everything that makes this "Mokoro Journeys" lives here:
// name, tagline, contact details, palette, form endpoint and site URL.
// Swap these values (e.g. to "Pula Safaris") and run `npm run build`.
// The build checks the palette against WCAG AA and stops if a pair fails.
// ---------------------------------------------------------------------------

module.exports = {
  brand: {
    name: 'Mokoro Journeys',
    shortName: 'Mokoro',
    // One line, used in the header area, meta descriptions and the footer.
    tagline: 'Quiet camps, few vehicles, Botswana by water and by sand.',
    // Explains the name. Shown on the About page.
    nameStory:
      'A mokoro is the dugout canoe poled through the channels of the Okavango Delta. ' +
      'It is slow, silent and leaves no trace, which is how we think a safari should feel.',
    // Alternative brand kept here for reference. To switch, copy these values
    // into the fields above.
    alternative: {
      name: 'Pula Safaris',
      shortName: 'Pula',
      tagline: 'Rain is luck in a desert country. Quiet safaris in Botswana.',
      nameStory:
        '"Pula" means rain in Setswana. It is the national greeting, the motto on the coat of arms and ' +
        'the name of the currency, because in a dry country rain is luck.',
    },
  },

  // Placeholder contact details. Replace before launch.
  contact: {
    email: 'hello@example.com',
    phone: '+267 00 000 000',
    whatsapp: '', // e.g. '26700000000' (digits only). Leave empty to hide.
    office: 'Maun, Botswana',
    hours: 'Monday to Friday, 08:00 to 17:00 (Botswana time, UTC+2)',
  },

  // Public URL of the deployed site, no trailing slash. Used for canonical
  // links and sitemap.xml.
  siteUrl: 'https://mokoro-journeys.vercel.app',

  // Enquiry form. A static site cannot send email by itself, so either:
  //  - set `endpoint` to a form service URL that accepts a POST
  //    (Formspree, Basin, Getform, your own API...), or
  //  - leave it empty and the form opens the visitor's email app with the
  //    enquiry filled in, addressed to contact.email.
  enquiry: {
    endpoint: '',
  },

  // Palette. Names are used as CSS custom properties: --sand, --ink, etc.
  palette: {
    sand: '#F3ECDF', // page background (Kalahari sand, light)
    sandDeep: '#E6D8BF', // bands, cards
    dune: '#C9B48E', // borders, rules
    ink: '#24211C', // body text
    inkSoft: '#544B3F', // secondary text
    papyrus: '#3F5B2E', // papyrus green: buttons, accents
    papyrusLight: '#DCE3CC',
    flood: '#1C5670', // floodwater blue: links, water
    floodLight: '#D4E3E8',
    ochre: '#8C4213', // ochre: highlights, small labels
    ochreBright: '#B8691F', // ochre for large shapes only (not text)
    white: '#FFFFFF',
  },

  // Text/background pairs the CSS actually uses. The build fails if any pair
  // is below the WCAG AA ratio given (4.5 for normal text, 3 for large text
  // and UI shapes). If you change the palette, keep this list honest.
  contrastPairs: [
    ['ink', 'sand', 4.5],
    ['ink', 'sandDeep', 4.5],
    ['inkSoft', 'sand', 4.5],
    ['inkSoft', 'sandDeep', 4.5],
    ['flood', 'sand', 4.5],
    ['flood', 'white', 4.5],
    ['papyrus', 'sand', 4.5],
    ['ochre', 'sand', 4.5],
    ['ochre', 'sandDeep', 4.5],
    ['white', 'papyrus', 4.5],
    ['white', 'flood', 4.5],
    ['white', 'ink', 4.5],
    ['sand', 'ink', 4.5],
    ['ink', 'papyrusLight', 4.5],
    ['ink', 'floodLight', 4.5],
    ['flood', 'floodLight', 4.5],
    ['papyrus', 'papyrusLight', 4.5],
    ['ochreBright', 'sand', 3],
    ['dune', 'ink', 3],
  ],
};
