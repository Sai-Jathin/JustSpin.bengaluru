const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

// ---------------- SUPABASE ----------------
const supabase = createClient(
  "https://erylrdmhhlgvblcyuiup.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeWxyZG1oaGxndmJsY3l1aXVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY2MzA2OSwiZXhwIjoyMDk2MjM5MDY5fQ.dvgK-ZFxu57MZaOvjpP9Ses-Hqx1kGD_S-i-ynfeyoI"
);

// ---------------- GOOGLE PLACES ----------------
const GOOGLE_API_KEY = "AIzaSyD9kjS1DrUVPWb4gi7Blj1vvEIK7oEwf50";

// ---------------- ALL AREA + CATEGORY QUERIES ----------------
const QUERIES = [
  // --- WHITEFIELD ---
  { area: "Whitefield", category: "Pub",        query: "pubs bars nightclubs in Whitefield Bangalore" },
  { area: "Whitefield", category: "Restaurant", query: "restaurants in Whitefield Bangalore" },
  { area: "Whitefield", category: "Park",       query: "parks gardens lakes in Whitefield Bangalore" },
  { area: "Whitefield", category: "Zany",       query: "go karting paintball adventure gaming Whitefield Bangalore" },
  { area: "Whitefield", category: "Long Drive", query: "scenic long drive places hills waterfalls near Bangalore" },
  { area: "Whitefield", category: "Petrol",     query: "petrol pump fuel station in Whitefield Bangalore" },
  { area: "Whitefield", category: "Hospital",   query: "hospitals in Whitefield Bangalore" },
  { area: "Whitefield", category: "Pharmacy",   query: "pharmacy medical store in Whitefield Bangalore" },

  // --- BROOKEFIELD ---
  { area: "Brookefield", category: "Pub",        query: "pubs bars nightclubs in Brookefield Bangalore" },
  { area: "Brookefield", category: "Restaurant", query: "restaurants cafes in Brookefield Bangalore" },
  { area: "Brookefield", category: "Park",       query: "parks gardens lakes in Brookefield Bangalore" },
  { area: "Brookefield", category: "Zany",       query: "go karting paintball adventure gaming Brookefield Bangalore" },
  { area: "Brookefield", category: "Long Drive", query: "scenic long drive places hills waterfalls near Bangalore" },
  { area: "Brookefield", category: "Petrol",     query: "petrol pump fuel station in Brookefield Bangalore" },
  { area: "Brookefield", category: "Hospital",   query: "hospitals in Brookefield Bangalore" },
  { area: "Brookefield", category: "Pharmacy",   query: "pharmacy medical store in Brookefield Bangalore" },

  // --- MARATHAHALLI ---
  { area: "Marathahalli", category: "Pub",        query: "pubs bars nightclubs in Marathahalli Bangalore" },
  { area: "Marathahalli", category: "Restaurant", query: "restaurants cafes in Marathahalli Bangalore" },
  { area: "Marathahalli", category: "Park",       query: "parks gardens lakes in Marathahalli Bangalore" },
  { area: "Marathahalli", category: "Zany",       query: "go karting paintball adventure gaming Marathahalli Bangalore" },
  { area: "Marathahalli", category: "Long Drive", query: "scenic long drive places hills waterfalls near Bangalore" },
  { area: "Marathahalli", category: "Petrol",     query: "petrol pump fuel station in Marathahalli Bangalore" },
  { area: "Marathahalli", category: "Hospital",   query: "hospitals in Marathahalli Bangalore" },
  { area: "Marathahalli", category: "Pharmacy",   query: "pharmacy medical store in Marathahalli Bangalore" },

  // --- BELLANDUR ---
  { area: "Bellandur", category: "Pub",        query: "pubs bars nightclubs in Bellandur Bangalore" },
  { area: "Bellandur", category: "Restaurant", query: "restaurants cafes in Bellandur Bangalore" },
  { area: "Bellandur", category: "Park",       query: "parks gardens lakes in Bellandur Bangalore" },
  { area: "Bellandur", category: "Zany",       query: "go karting paintball adventure gaming Bellandur Bangalore" },
  { area: "Bellandur", category: "Long Drive", query: "scenic long drive places hills waterfalls near Bangalore" },
  { area: "Bellandur", category: "Petrol",     query: "petrol pump fuel station in Bellandur Bangalore" },
  { area: "Bellandur", category: "Hospital",   query: "hospitals in Bellandur Bangalore" },
  { area: "Bellandur", category: "Pharmacy",   query: "pharmacy medical store in Bellandur Bangalore" },

  // --- INDIRANAGAR ---
  { area: "Indiranagar", category: "Pub",        query: "pubs bars nightclubs in Indiranagar Bangalore" },
  { area: "Indiranagar", category: "Restaurant", query: "restaurants cafes in Indiranagar Bangalore" },
  { area: "Indiranagar", category: "Park",       query: "parks gardens lakes in Indiranagar Bangalore" },
  { area: "Indiranagar", category: "Zany",       query: "go karting paintball adventure gaming Indiranagar Bangalore" },
  { area: "Indiranagar", category: "Long Drive", query: "scenic long drive places hills waterfalls near Bangalore" },
  { area: "Indiranagar", category: "Petrol",     query: "petrol pump fuel station in Indiranagar Bangalore" },
  { area: "Indiranagar", category: "Hospital",   query: "hospitals in Indiranagar Bangalore" },
  { area: "Indiranagar", category: "Pharmacy",   query: "pharmacy medical store in Indiranagar Bangalore" },
];

// ---------------- FETCH PLACES ----------------
async function fetchPlaces(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
  const res = await axios.get(url);
  console.log("\n🔍 Query:", query);
  console.log("📦 Results:", res.data.results?.length || 0);
  return res.data.results || [];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------- FETCH RICHER PHOTO LIST (Place Details) ----------------
// Text Search usually returns only 1 photo per place. Place Details returns
// up to 10, so we fetch it separately and use it to overwrite place.photos.
const PHOTOS_PER_PLACE = 6;
const PLACE_DETAILS_DELAY_MS = 150;

async function fetchPlacePhotos(placeId) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`;
    const res = await axios.get(url);
    if (res.data.status !== "OK") return [];
    const photos = res.data.result?.photos || [];
    return photos.slice(0, PHOTOS_PER_PLACE);
  } catch (err) {
    console.log(`   ⚠️ Failed to fetch photos for ${placeId}: ${err.message}`);
    return [];
  }
}

// ---------------- CATEGORY DETECTION ----------------
function detectCategory(place) {
  const types = place.types || [];
  if (types.includes("gas_station")) return "Petrol";
  if (types.includes("hospital")) return "Hospital";
  if (types.includes("pharmacy") || types.includes("drugstore")) return "Pharmacy";
  if (types.includes("park") || types.includes("natural_feature")) return "Park";
  if (types.includes("night_club") || types.includes("bar")) return "Pub";
  if (types.includes("restaurant") || types.includes("meal_takeaway")) return "Restaurant";
  if (types.includes("amusement_park") || types.includes("tourist_attraction")) return "Zany";
  return null;
}

function isValidForCategory(place, category) {
  const detected = detectCategory(place);
  if (detected && detected !== category) return false;
  return true;
}

// ---------------- STRICT NAME CHECK ----------------
function strictNameCheck(place, category) {
  const name = (place.name || "").toLowerCase();
  const isRestaurant = name.includes("restaurant") || name.includes("dining") || name.includes("eatery");
  const isPub        = name.includes("pub") || name.includes("bar") || name.includes("brew") || name.includes("lounge");
  const isPark       = name.includes("park") || name.includes("garden") || name.includes("lake") || name.includes("green");
  const isAdventure  = name.includes("kart") || name.includes("paintball") || name.includes("escape") || name.includes("adventure");

  if (category === "Park")       return !isRestaurant && !isPub && !isAdventure;
  if (category === "Restaurant") return !isPark && !isAdventure;
  if (category === "Pub")        return !isPark && !isAdventure;
  if (category === "Zany")       return !isRestaurant && !isPub && !isPark;
  return true;
}

// ---------------- BUDGET ----------------
function estimateBudget(place) {
  const rating = place.rating || 3;
  if (rating >= 4.5) return 1500;
  if (rating >= 4.0) return 1000;
  if (rating >= 3.5) return 700;
  return 500;
}

// ---------------- CUISINE DETECTION ----------------
// Google Places "types" sometimes includes cuisine-specific types for restaurants.
// Map the ones we care about to our cuisine chip values.
const CUISINE_TYPE_MAP = {
  japanese_restaurant:   "Japanese",
  sushi_restaurant:      "Japanese",
  ramen_restaurant:      "Japanese",
  thai_restaurant:       "Thai",
  chinese_restaurant:    "Chinese",
  mexican_restaurant:    "Mexican",
  italian_restaurant:    "Italian",
  pizza_restaurant:      "Italian",
  indian_restaurant:     "Indian",
  asian_restaurant:      "Asian",
  vietnamese_restaurant: "Asian",
  korean_restaurant:     "Asian",
  indonesian_restaurant: "Asian",
};

function detectCuisine(place) {
  const types = place.types || [];
  const name = (place.name || "").toLowerCase();
  const cuisines = new Set();

  // 1. Try Google's place types first
  types.forEach(t => {
    if (CUISINE_TYPE_MAP[t]) cuisines.add(CUISINE_TYPE_MAP[t]);
  });

  // 2. Fall back to keyword matching on the name
  if (cuisines.size === 0) {
    if (name.includes("thai")) cuisines.add("Thai");
    if (name.includes("japan") || name.includes("sushi") || name.includes("ramen") || name.includes("izakaya")) cuisines.add("Japanese");
    if (name.includes("mexic") || name.includes("taco") || name.includes("burrito") || name.includes("cantina")) cuisines.add("Mexican");
    if (name.includes("italia") || name.includes("pizza") || name.includes("pasta") || name.includes("trattoria")) cuisines.add("Italian");
    if (name.includes("chin") || name.includes("wok") || name.includes("dim sum") || name.includes("dimsum")) cuisines.add("Chinese");
    if (name.includes("pan asia") || name.includes("pan-asia") || name.includes(" asian")) cuisines.add("Asian");
    if (name.includes("dhaba") || name.includes("punjab") || name.includes("biryani") || name.includes("tiffin") || name.includes("udupi") || name.includes("thali") || name.includes("south indian") || name.includes("north indian")) cuisines.add("Indian");
  }

  // 3. Default bucket for everything else (cafes, multi-cuisine, etc.)
  if (cuisines.size === 0) cuisines.add("Continental");

  return Array.from(cuisines);
}

// ---------------- VEG / NON-VEG DETECTION ----------------
function detectIsVeg(place) {
  const types = place.types || [];
  const name = (place.name || "").toLowerCase();

  if (types.includes("vegetarian_restaurant")) return true;
  if (name.includes("pure veg") || name.includes("vegetarian")) return true;
  if (/\bveg\b/.test(name)) return true;

  // Can't reliably tell non-veg vs "serves both" from Google data alone —
  // leave as false (your default) and review manually for accuracy.
  return false;
}

// ---------------- TRANSFORM ----------------
function transform(place, category, fallbackArea) {
  const addr = (place.formatted_address || "").toLowerCase();
  let area = fallbackArea;

  if (addr.includes("indiranagar"))       area = "Indiranagar";
  else if (addr.includes("bellandur"))    area = "Bellandur";
  else if (addr.includes("marathahalli")) area = "Marathahalli";
  else if (addr.includes("brookefield"))  area = "Brookefield";
  else if (addr.includes("whitefield"))   area = "Whitefield";

  const result = {
    name: place.name,
    category,
    city: "Bangalore",
    area,
    rating: place.rating || null,
    address: place.formatted_address || null,
    latitude: place.geometry?.location?.lat || null,
    longitude: place.geometry?.location?.lng || null,
    source: "google_places",
    source_id: place.place_id,
    budget_for_two: estimateBudget(place),
    map_link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    photos: place.photos?.slice(0, 6).map(p => p.photo_reference) || []
  };

  // Only restaurants get cuisine/diet tags
  if (category === "Restaurant") {
    result.cuisine = detectCuisine(place);
    result.is_veg = detectIsVeg(place);
  }

  return result;
}

// ---------------- IMPORT DATA ----------------
async function importData({ area, category, query }) {
  const places = await fetchPlaces(query);

  if (!places.length) {
    console.log(`⚠️ No data for ${area} - ${category}`);
    return;
  }

  const typeFiltered = places.filter(p => isValidForCategory(p, category));
  const filtered     = typeFiltered.filter(p => strictNameCheck(p, category));

  console.log(`🔒 After filtering: ${filtered.length}/${places.length}`);

  if (!filtered.length) {
    console.log(`⚠️ All results filtered out for ${area} - ${category}`);
    return;
  }

  const formatted = [];
  for (const p of filtered) {
    const richPhotos = await fetchPlacePhotos(p.place_id);
    if (richPhotos.length > 1) p.photos = richPhotos; // overwrite only if we got more than the default 1
    formatted.push(transform(p, category, area));
    await sleep(PLACE_DETAILS_DELAY_MS);
  }

  const { error } = await supabase
    .from("justspin")
    .upsert(formatted, { onConflict: "source_id" });

  if (error) {
    console.log(`❌ Error for ${area} - ${category}:`, error.message);
  } else {
    console.log(`✅ Inserted ${formatted.length} places for ${area} - ${category}`);
  }
}

// ---------------- MANUAL RESTAURANTS (researched separately) ----------------
// These didn't come from a Google Places query, so we give each one a
// synthetic source_id (so re-running this script won't create duplicates).
const MANUAL_RESTAURANTS = [
  { name: "Mango Chili Cafe",                    area: "Whitefield",   budget_for_two: 600,  is_veg: false, cuisine: ["Thai", "Asian"] },
  { name: "The Fatty Bao - Pan Asian Eatery",    area: "Indiranagar",  budget_for_two: 1500, is_veg: false, cuisine: ["Chinese", "Japanese", "Asian"] },
  { name: "Lucky Chan - Dimsum & Sushi Parlour", area: "Indiranagar",  budget_for_two: 1900, is_veg: false, cuisine: ["Japanese", "Chinese", "Thai", "Asian"] },
  { name: "Izanagi",                             area: "Indiranagar",  budget_for_two: 3000, is_veg: false, cuisine: ["Japanese"] },
  { name: "Taiki",                               area: "Indiranagar",  budget_for_two: 1800, is_veg: false, cuisine: ["Japanese"] },
  { name: "Chinita Real Mexican Food",           area: "Indiranagar",  budget_for_two: 1200, is_veg: false, cuisine: ["Mexican"] },
  { name: "Maiz Mexican Kitchen",                area: "Indiranagar",  budget_for_two: 1000, is_veg: false, cuisine: ["Mexican"] },
  { name: "Taco Street",                         area: "Indiranagar",  budget_for_two: 700,  is_veg: false, cuisine: ["Mexican"] },
  { name: "A2B Pure Veg",                        area: "Bellandur",    budget_for_two: 650,  is_veg: true,  cuisine: ["Indian", "Chinese"] },
  { name: "The Bhojan - Pure Veg Delights",      area: "Marathahalli", budget_for_two: 700,  is_veg: true,  cuisine: ["Indian"] },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

async function importManualRestaurants() {
  const formatted = MANUAL_RESTAURANTS.map(r => ({
    name: r.name,
    category: "Restaurant",
    city: "Bangalore",
    area: r.area,
    rating: null,
    address: null,
    latitude: null,
    longitude: null,
    source: "manual",
    source_id: `manual_${slugify(r.name)}`,
    budget_for_two: r.budget_for_two,
    map_link: null,
    photos: [],
    is_veg: r.is_veg,
    cuisine: r.cuisine,
  }));

  const { error } = await supabase
    .from("justspin")
    .upsert(formatted, { onConflict: "source_id" });

  if (error) {
    console.log("❌ Error inserting manual restaurants:", error.message);
  } else {
    console.log(`✅ Inserted ${formatted.length} manually-curated restaurants`);
  }
}

// ---------------- RUN ALL ----------------
async function run() {
  console.log("🚀 Starting import for ALL areas...\n");
  for (const entry of QUERIES) {
    await importData(entry);
  }

  console.log("\n🍽️ Adding manually-curated restaurants...");
  await importManualRestaurants();

  console.log("\n🎉 All done! Run this in Supabase SQL Editor to verify:");
  console.log("SELECT area, COUNT(*) FROM justspin GROUP BY area;");
  console.log("SELECT id, name, is_veg, cuisine FROM justspin WHERE category = 'Restaurant' ORDER BY id DESC LIMIT 15;");
}

run();