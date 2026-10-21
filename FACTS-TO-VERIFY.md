# Facts to verify before launch

Everything on the site that is a fact about Botswana, a rule, a price or a
season is listed here. The site was written from general knowledge and has
not been checked against primary sources. Tick each item once it is checked,
and note the source and date.

Most of the site avoids exact figures on purpose (no park fee amounts, no
flight prices). If you add figures, add them to this list too.

Where things live: `src/data/destinations.js`, `src/data/months.js`,
`src/data/journeys.js`, `src/data/journal.js`, `src/templates/components.js`
(luggage rule), `src/templates/pages.js` (page text).

## 1. Fees and money

- [ ] **Park entry fees.** The site says Department of Wildlife and National Parks (DWNP) fees are charged per person per day or night in Moremi, Chobe, Nxai Pan, Makgadikgadi Pans National Park and the Central Kalahari. It names no amounts. Check current non-resident rates and whether camps include them. Rates have changed in recent years.
- [ ] **CKGR camping fees** and the requirement for self-drive visitors to book campsites in advance and be self-sufficient (Central Kalahari page).
- [ ] **Tourism Development Levy.** Not mentioned on the site. Botswana has charged international visitors a levy (USD 30 when introduced). Decide whether to mention it, and check the current amount.
- [ ] **Enquiry form budget bands** (Under USD 8,000 / 8–15k / 15–25k / over 25k per person, excluding international flights). Check that these match real prices for the sample journeys.
- [ ] **"Green-season rates" / "lower rates"** at many camps from about November to March (months 2, 11, Green Season journey). Check against partner camps.

## 2. Seasons and the flood (`src/data/months.js`)

- [ ] Rain in the Angolan highlands falls roughly **November to March**.
- [ ] Flood timing: enters the Panhandle around **March–April**; reaches the central Delta around **May–June**; usually highest **June–August**; reaches Maun around **July–August**; recedes **September–November**.
- [ ] Local rains in northern Botswana roughly **November to March**.
- [ ] Pans and Kalahari green and busy roughly **December to March**; zebra and wildebeest on the Makgadikgadi and Nxai Pan grasslands in the rains; zebra move back to the **Boteti River** in the dry season (from about April–May).
- [ ] The 0–5 scores for Delta water, green pans and rain for every month. These drive the chooser bars and meters.
- [ ] Monthly **temperature ranges for Maun** (e.g. June/July 6–25°C, October 18–36°C).
- [ ] October "often above 35°C".
- [ ] Impala and tsessebe **lambing around November**.
- [ ] **Wild dog denning** "in some years" around August (Linyanti, Delta).
- [ ] **Elephant numbers** on the Chobe and Linyanti rivers peak late in the dry season (August–October).
- [ ] Migrant birds present November–March.
- [ ] Some camps **close in January/February** for maintenance.
- [ ] Springbok and gemsbok in the CKGR valleys (Deception Valley) give birth / gather in the rains.
- [ ] Best-month strips on each destination page (`best` in `destinations.js`).

## 3. Rules on the ground

- [ ] **No night drives and no off-road driving** inside national parks and game reserves (Moremi, Chobe incl. Savuti, Nxai Pan, Makgadikgadi Pans NP, CKGR).
- [ ] **Night drives, off-road driving and walking are allowed** in private and community concessions (Linyanti, Delta concessions, Khwai), subject to each lease.
- [ ] Mokoro and walking depend on concession and water level.
- [ ] Park hours restrict game drives (Chobe riverfront page).
- [ ] **Tsodilo Hills:** managed by the National Museum (Botswana National Museum and Monuments); visits to the paintings are with a guide; there is a small site museum; there is an airstrip usable by charter flights.
- [ ] **Victoria Falls day trip** from Kasane: border and visa rules for the nationalities you serve (Zimbabwe/Zambia, KAZA UNIVISA status).
- [ ] Quad biking on the pans: still offered and permitted? (Restrictions have changed in some areas.)

## 4. Light aircraft and luggage (`luggageRule()` in `src/templates/components.js`, Flying page, journal article)

- [ ] **20 kg per person, total**, including hand luggage and camera equipment. Check with the charter operators you use; some routes or aircraft allow less (often quoted as 15 kg on some services).
- [ ] **Soft bags only**, no wheels, no rigid frame.
- [ ] **Bag size about 25 × 30 × 62 cm.** Operators publish slightly different sizes.
- [ ] **Extra seat** can be bought for extra luggage, if booked in advance.
- [ ] Passengers are **weighed with luggage** at check-in.
- [ ] Aircraft are usually single-engine (e.g. Cessna 206/208) with **about 5–12 passenger seats**.
- [ ] Schedules are set the day before; shared flights may stop at other airstrips.
- [ ] Luggage storage in Maun and Kasane.
- [ ] **Flight times are estimates** calculated in `src/lib/geo.js` (straight line at ~260 km/h + 10 min, rounded to 5 min) from approximate map positions. Replace with operator figures if you have them.
- [ ] Airstrip names in "Getting there" (Xakanaxa, Khwai area, Savuti airstrip, Kasane International Airport, Tsodilo airstrip).
- [ ] International connections to Maun "usually through Johannesburg or another regional hub".

## 5. History, culture and place facts

- [ ] **Moremi Game Reserve** set aside in the **1960s** at the initiative of the **Batawana** community and named after their chief (Moremi III).
- [ ] Moremi includes **Chief's Island**.
- [ ] **Baines' Baobabs** painted by **Thomas Baines in 1862**.
- [ ] **Nxai Pan National Park** is managed together with Makgadikgadi Pans National Park.
- [ ] The **Savute Channel** has stopped and restarted flowing over long periods (decades).
- [ ] **Gubatsa Hills** at Savuti have San rock paintings.
- [ ] **Linyanti** runs along the border with Namibia's Zambezi region (formerly Caprivi).
- [ ] **Tsodilo Hills**: UNESCO World Heritage Site; "four" hills (often described as three main hills plus smaller ones; check wording); sacred to the **San and Hambukushu**; UNESCO's phrase "Louvre of the Desert".
- [ ] **CKGR**: one of the largest protected areas in Africa; ancestral land of the San and Bakgalagadi; court cases on residents' rights.
- [ ] **Makgadikgadi**: bed of an ancient lake; Zu/'hoasi San guides offer walks in some areas; habituated meerkat colonies near some camps.
- [ ] **"High value, low volume"**: adopted in Botswana's tourism policy from the 1990s (Tourism Policy of 1990 is usually cited); concessions with bed limits; criticisms about access.
- [ ] **Mokoro**: plural "mekoro"; most tourism mekoro are now fibreglass; the pole is called a **ngashi**.
- [ ] Birds on the Panhandle: **Pel's fishing owl, African skimmer**.
- [ ] "Pula" means rain; national greeting; motto on the coat of arms; name of the currency (used in the alternative brand story in `site.config.js`).
- [ ] Botswana time is **UTC+2** (footer).

- [ ] **"A day in a water camp"** on the home page: the times (05:45 wake-up, 06:30 activity, 10:30 brunch, 15:30 tea, 16:00 outing, 19:30 dinner) are a typical rhythm, not a specific camp's schedule.
- [ ] Home page stats: "Jun–Aug" flood peak, "Dec–Mar" green pans, "20 kg" luggage.
- [ ] Map coordinates shown as labels (e.g. Maun 19°58′S 23°26′E) are approximate.

## 6. Business details (placeholders)

- [ ] Email, phone, WhatsApp, office location and hours in `site.config.js` are placeholders.
- [ ] `siteUrl` in `site.config.js` must match the real domain (used for canonical links and the sitemap).
- [ ] All **stay names are placeholders** (`src/data/stays.js`), and so are their sizes ("up to 8 tents" etc.).
- [ ] "We reply usually within two working days" and "we do not add you to a mailing list": make sure these are true.
- [ ] "Ask us for references" (About page): only keep if you can provide them.
- [ ] Sample journeys: check that the camp combinations and nights are bookable as described.

## 7. Photos

Every photo was checked on its Unsplash page for (a) a stated location that
matches where it is used and (b) the free Unsplash License (not Unsplash+).
The full list with page links is on `/credits/` and in `src/data/photos.js`.

Judgement calls to review:

- [ ] **Chobe River, Colin Watts** (`chobe-1`): the location field says only "Botswana"; the photographer's caption says "A herd of elephants drinking in the Chobe river in Botswana".
- [ ] **Botswana storm and sunset, Hans-Jurgen Mager** (`botswana-2`, `botswana-3`): no location field; the captions say "Botswana".
- [ ] **Okavango River near Shakawe, Wynand Uys** (`panhandle-1`): this is the Panhandle, not the Delta proper, so it is only used where the Panhandle is named (Tsodilo page "Nearby" section, Tsodilo journey).
- [ ] **Makgadikgadi meerkat, Ed Wingate** (`makgadikgadi-2`): location reads "Makadikadi Basin, Botswana".
- Excluded: Edmund Loh's elephants at "Abu Camp, Botswana" (the camp is in the Delta, but the page does not say so); a Chobe River sunset whose caption says it was taken from the Namibian side.

Gaps (an illustration is shown instead):

- [ ] No verified photo of **Tsodilo Hills** itself.
- [ ] No verified photo of **Baines' Baobabs** or of the **salt pan surface** (Ntwetwe, Sowa, Kubu Island).
- [ ] Only one verified photo of the **Central Kalahari**, and one of **Linyanti**.
- [ ] Before launch, re-check that each photo is still online and still under the Unsplash License.
