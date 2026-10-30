// Photos, all from Unsplash under the Unsplash License (no Unsplash+).
// Rule: a photo is used only for a place that matches the location stated on
// its Unsplash page. `pageLocation` is copied from that page (spelling as
// shown); `location` is how we credit it. Images are hotlinked from
// images.unsplash.com as Unsplash's guidelines ask.
//
// To add a photo: open its Unsplash page, check the location, add an entry,
// then reference its key from a destination, journey or article.

const p = (id, src, page, photographer, username, pageLocation, location, alt) => ({
  id,
  src: `https://images.unsplash.com/${src}`,
  page,
  photographer,
  profile: `https://unsplash.com/@${username}`,
  pageLocation,
  location,
  alt,
});

const list = [
  // Okavango Delta
  p('okavango-1', 'photo-1627764409592-6c8e514e8ff5', 'https://unsplash.com/photos/VgQVWNTuQFg', 'Maria Baltazzi', 'happy1sojourn', 'Okavango Delta, Botswana', 'Okavango Delta', 'Still morning water in the Okavango Delta, with grass islands under a wide sky'),
  p('okavango-2', 'photo-1759252973832-617895b7ef4d', 'https://unsplash.com/photos/JUYMh-1k4yw', 'Ed Wingate', 'ed_wingate', 'Okavango Delta, Botswana', 'Okavango Delta', 'Mokoro canoes pulled up on a channel bank in the Okavango Delta, with two safari vehicles behind'),
  p('okavango-3', 'photo-1759252973843-957dc1b5e0e5', 'https://unsplash.com/photos/xG-gaNxYjFE', 'Ed Wingate', 'ed_wingate', 'Okavango Delta, Botswana', 'Okavango Delta', 'Polers standing at the back of mokoro canoes, pushing passengers through a grassy channel'),
  p('okavango-4', 'photo-1680430491780-1b971a5804d8', 'https://unsplash.com/photos/ruFG9syHEn4', 'Ulrico Zampa', 'ulricozampa', 'Okavango Delta, Botswana', 'Okavango Delta', 'Channels of water winding between green land in the Okavango Delta'),
  p('okavango-5', 'photo-1590214780567-b48c7c927b7c', 'https://unsplash.com/photos/ToNyXMOZxw8', 'Colin Watts', 'colinwatts', 'Okavango Delta, Botswana', 'Okavango Delta', 'Two hippos wading through shallow water in the Okavango Delta'),
  p('okavango-6', 'photo-1516799175873-1d0a42e4a668', 'https://unsplash.com/photos/J80d6RzkLz0', 'Colin Watts', 'colinwatts', 'Okavango Delta, Botswana', 'Okavango Delta', 'A leopard resting along a bare branch'),
  // Okavango Panhandle (Shakawe) – used only where the Panhandle is named
  p('panhandle-1', 'photo-1531208853003-c1ec1b8a81d7', 'https://unsplash.com/photos/4ZCA3xukIso', 'Wynand Uys', 'wynand_uys', 'Shakawe, Botswana', 'Okavango River near Shakawe (the Panhandle)', 'Aerial view of the Okavango River winding through papyrus near Shakawe'),
  // Moremi
  p('moremi-1', 'photo-1647642116954-756870208623', 'https://unsplash.com/photos/DcpLhoT5NvE', 'Duncan McNab', 'mcnabit', 'Moremi, Botswana', 'Moremi, Botswana', 'African wild dogs standing alert in long grass'),
  p('moremi-2', 'photo-1718722672389-f731b49b96da', 'https://unsplash.com/photos/rO8WCDvmq5Q', 'Samantha Burger', 'offtrackers', 'Moremi, Botswana', 'Moremi, Botswana', 'A leopard climbing along a tree branch'),
  p('moremi-3', 'photo-1648033750810-061170957430', 'https://unsplash.com/photos/GEEmkGkf5DU', 'Duncan McNab', 'mcnabit', 'Moremi, Botswana', 'Moremi, Botswana', 'Two antelope on a green floodplain'),
  p('moremi-4', 'photo-1705218237398-d8d1140512e8', 'https://unsplash.com/photos/i8xbsVmx2wY', 'Andreas Vonlanthen', 'vole73', 'Moremi, Botsuana', 'Moremi, Botswana', 'A male lion lying in the shade beside a tree'),
  p('moremi-5', 'photo-1706364740941-fe81b826283e', 'https://unsplash.com/photos/yv-yHCgjcOQ', 'Andreas Vonlanthen', 'vole73', 'Moremi, Botsuana', 'Moremi, Botswana', 'The sun setting behind a line of trees'),
  // Chobe riverfront
  p('chobe-1', 'photo-1590214820030-5da5f4e7f94e', 'https://unsplash.com/photos/9f0AchL0eqQ', 'Colin Watts', 'colinwatts', 'Botswana (caption: "A herd of elephants drinking in the Chobe river in Botswana.")', 'Chobe River, Botswana', 'A herd of elephants drinking at the edge of the Chobe River'),
  p('chobe-2', 'photo-1759215290881-cc6a8ccbb37e', 'https://unsplash.com/photos/5HJXNC5SWtE', 'Ed Wingate', 'ed_wingate', 'Chobe National Park, Botswana', 'Chobe National Park', 'An elephant herd walking up from the river past grazing antelope'),
  p('chobe-3', 'photo-1531210156519-af875520c158', 'https://unsplash.com/photos/DIMLOdrARaw', 'Wynand Uys', 'wynand_uys', 'Kasane, Botswana', 'Kasane, Botswana', 'Two elephants wading through river water'),
  p('chobe-4', 'photo-1597009255787-bbdeb81f087f', 'https://unsplash.com/photos/MDcAoB6dipU', 'Emily Dalamangas', 'edalamangas', 'Chobe River', 'Chobe River', 'Giraffes walking on sand near the river'),
  p('chobe-5', 'photo-1730444290056-57e50bdb24a7', 'https://unsplash.com/photos/8SrscEu9Bkw', 'Markus Kammermann', 'makabera', 'Chobe, Botsuana', 'Chobe, Botswana', 'A hippo in the water with its mouth wide open'),
  // Savuti
  p('savuti-1', 'photo-1635349842330-49c24fea8628', 'https://unsplash.com/photos/GzvsNPccoeE', 'Phil Howells', 'wolfhowells', 'Savuti, Botswana', 'Savuti, Botswana', 'An elephant standing in a waterhole with birds behind'),
  p('savuti-2', 'photo-1635349826951-b3a32b391384', 'https://unsplash.com/photos/UiU3r_v7Ejg', 'Phil Howells', 'wolfhowells', 'Savuti, Botswana', 'Savuti, Botswana', 'A giraffe beside a waterhole in open country'),
  p('savuti-3', 'photo-1605281969242-5a4a1a92e365', 'https://unsplash.com/photos/OUadwv31mE8', 'Graham Waterhouse', 'pangolingw', 'Savuti, Botswana', 'Savuti, Botswana', 'A group of elephants at a muddy waterhole'),
  // Linyanti
  p('linyanti-1', 'photo-1662378423860-f40ed6b0fd85', 'https://unsplash.com/photos/e83lcB2ExRk', 'Peter Strydom', 'peterstrydom', 'Linyanti, Botswana', 'Linyanti, Botswana', 'Two sable antelope bulls drinking'),
  // Makgadikgadi
  p('makgadikgadi-1', 'photo-1759216942506-76a56bcd79e8', 'https://unsplash.com/photos/t3mbI7dtGzM', 'Ed Wingate', 'ed_wingate', 'Makgadikgadi Pans, Botswana', 'Makgadikgadi Pans', 'A long line of wildebeest crossing dry grassland near the Makgadikgadi Pans'),
  p('makgadikgadi-2', 'photo-1759221947500-fa0d5d4e0e1d', 'https://unsplash.com/photos/v08oVTD7Vyc', 'Ed Wingate', 'ed_wingate', 'Makadikadi Basin, Botswana', 'Makgadikgadi basin', 'A meerkat standing upright and alert in dry grass'),
  p('makgadikgadi-3', 'photo-1759216942482-d4a344132fea', 'https://unsplash.com/photos/zmjoekNWffI', 'Ed Wingate', 'ed_wingate', 'Makgadikgadi Pans, Botswana', 'Makgadikgadi Pans', 'Wildebeest gathered near water'),
  // Nxai Pan
  p('nxai-1', 'photo-1612434133072-633382f6ca25', 'https://unsplash.com/photos/-QVP-79SeVE', 'Chris Koelewijn', 'chrissaidan', 'Nxai Pan, Botswana', 'Nxai Pan, Botswana', 'A group of elephants walking across a pale open pan'),
  p('nxai-2', 'photo-1612434140886-cc27133e4bd8', 'https://unsplash.com/photos/-k9rEheKfjk', 'Chris Koelewijn', 'chrissaidan', 'Nxai Pan, Botswana', 'Nxai Pan, Botswana', 'Zebra drinking at a waterhole'),
  // Central Kalahari
  p('ckgr-1', 'photo-1653684147709-83a1f8621cdd', 'https://unsplash.com/photos/Q_Kdahzgl-Y', 'Thomas Evans', 'thoeva', 'Central Kalahari Game Reserve, Botswana', 'Central Kalahari Game Reserve', 'A giraffe bending to the ground in dry Kalahari grassland'),
  // Botswana, no more specific location
  p('botswana-1', 'photo-1756820169276-607bee7c0e79', 'https://unsplash.com/photos/6Sll2TNKBi0', 'Edmund Loh', 'snapmund', 'Botswana', 'Botswana', 'A termite mound and an antelope reflected in still water at sunset'),
  p('botswana-2', 'photo-1614721023496-5bb8a36a88fa', 'https://unsplash.com/photos/8cH339sYtMA', 'Hans-Jurgen Mager', 'hansjurgen007', 'Botswana (caption: "Thunderstorm building up in late afternoon, Botswana")', 'Botswana', 'A thunderstorm building over green savanna in the late afternoon'),
  p('botswana-3', 'photo-1591046940577-5badf473537a', 'https://unsplash.com/photos/vcN7_lk91rM', 'Hans-Jurgen Mager', 'hansjurgen007', 'Botswana (caption: "Clouds just before sunset, Botswana")', 'Botswana', 'Clouds over open savanna just before sunset'),
  p('botswana-4', 'photo-1593507105697-ec89b79ca16e', 'https://unsplash.com/photos/cusbuH6PdTM', 'Birger Strahl', 'bist31', 'Botswana', 'Botswana', 'A male lion and a young lion standing in shallow water'),
];

module.exports = Object.fromEntries(list.map((x) => [x.id, x]));
