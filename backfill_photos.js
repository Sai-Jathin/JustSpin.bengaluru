const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

// ---------------- SUPABASE ----------------
const supabase = createClient(
  "https://erylrdmhhlgvblcyuiup.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeWxyZG1oaGxndmJsY3l1aXVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY2MzA2OSwiZXhwIjoyMDk2MjM5MDY5fQ.dvgK-ZFxu57MZaOvjpP9Ses-Hqx1kGD_S-i-ynfeyoI"
);

// ---------------- GOOGLE PLACES ----------------
const GOOGLE_API_KEY = "AIzaSyD9kjS1DrUVPWb4gi7Blj1vvEIK7oEwf50";

const PHOTOS_PER_PLACE = 6;
const DELAY_MS = 150; // pause between requests to stay within rate limits

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------- FETCH PHOTOS VIA PLACE DETAILS ----------------
async function fetchPlacePhotos(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`;
  const res = await axios.get(url);

  if (res.data.status !== "OK") {
    console.log(`   ⚠️ Place Details status: ${res.data.status}`);
    return null;
  }

  const photos = res.data.result?.photos || [];
  return photos.slice(0, PHOTOS_PER_PLACE).map(p => p.photo_reference);
}

// ---------------- MAIN ----------------
async function run() {
  console.log("🚀 Fetching rows with 0-1 photos...\n");

  // jsonb array length: photos is jsonb, so use jsonb_array_length via a filter on raw SQL isn't
  // directly possible through the JS client, so we fetch rows with source_id set and check length client-side.
  const { data: rows, error } = await supabase
    .from("justspin")
    .select("id, name, source, source_id, photos")
    .not("source_id", "is", null);

  if (error) {
    console.log("❌ Failed to fetch rows:", error.message);
    return;
  }

  const targets = rows.filter(r => {
    const photos = Array.isArray(r.photos) ? r.photos : [];
    return photos.length <= 1 && r.source === "google_places";
  });

  console.log(`📦 ${targets.length} rows need backfilling (out of ${rows.length} total)\n`);

  let updated = 0;
  let skipped = 0;

  for (const row of targets) {
    try {
      const refs = await fetchPlacePhotos(row.source_id);

      if (!refs || refs.length <= 1) {
        console.log(`⏭️  ${row.name} — no extra photos found`);
        skipped++;
      } else {
        const { error: updateError } = await supabase
          .from("justspin")
          .update({ photos: refs })
          .eq("id", row.id);

        if (updateError) {
          console.log(`❌ ${row.name} — update failed: ${updateError.message}`);
        } else {
          console.log(`✅ ${row.name} — updated with ${refs.length} photos`);
          updated++;
        }
      }
    } catch (err) {
      console.log(`❌ ${row.name} — error: ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n🎉 Done. Updated: ${updated}, Skipped (no extra photos): ${skipped}`);
}

run();