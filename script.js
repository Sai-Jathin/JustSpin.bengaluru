// ---------------- HERO SLIDESHOW ----------------
(function initHeroSlideshow() {
    const images = [
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80', // 🍺 Pub
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', // 🍽️ Restaurant
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80', // 🌿 Park
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80', // 🚗 Long Drive
        'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=1200&q=80', // 🤪 Zany
    ];

    const container = document.querySelector('.hero-slides');
    if (!container) return;

    // Inject slides
    images.forEach((url, i) => {
        const div = document.createElement('div');
        div.className = 'hero-slide' + (i === 0 ? ' active' : '');
        div.style.backgroundImage = `url('${url}')`;
        container.appendChild(div);
    });

    // Crossfade every 4 seconds
    let current = 0;
    setInterval(() => {
        const slides = container.querySelectorAll('.hero-slide');
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 4000);
})();

// ---------------- UI HANDLERS ----------------
document.querySelectorAll('.vibe-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
});

document.querySelectorAll('.b-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.b-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });
});

// ---------------- CONFIG ----------------
const SUPABASE_URL = "https://erylrdmhhlgvblcyuiup.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeWxyZG1oaGxndmJsY3l1aXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjMwNjksImV4cCI6MjA5NjIzOTA2OX0.qaSKKSSHrVO5B6ulb6hHD6LNrDT73piYqFhsJCsuRB0";

const GOOGLE_API_KEY = "AIzaSyD9kjS1DrUVPWb4gi7Blj1vvEIK7oEwf50";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------- PHOTO URL ----------------
function photoUrl(ref, size = 800) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${size}&photoreference=${ref}&key=${GOOGLE_API_KEY}`;
}

// ---------------- LIGHTBOX ----------------
function openLightbox(refs, startIndex = 0) {
    let current = startIndex;

    const existing = document.getElementById('js-lightbox');
    if (existing) existing.remove();

    const lb = document.createElement('div');
    lb.id = 'js-lightbox';
    lb.innerHTML = `
        <div class="lb-overlay"></div>
        <div class="lb-container">
            <button class="lb-close">✕</button>
            <button class="lb-prev">‹</button>
            <button class="lb-next">›</button>
            <div class="lb-img-wrap">
                <img class="lb-img" src="" alt="Place photo" />
                <div class="lb-loader">Loading...</div>
            </div>
            <div class="lb-counter"></div>
            <div class="lb-thumbs">
                ${refs.map((r, i) => `
                    <img class="lb-thumb ${i === startIndex ? 'active' : ''}"
                         src="${photoUrl(r, 200)}"
                         data-index="${i}" alt="thumb" />
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';

    function goTo(index) {
        current = (index + refs.length) % refs.length;
        const img = lb.querySelector('.lb-img');
        const loader = lb.querySelector('.lb-loader');
        img.style.opacity = '0';
        loader.style.display = 'block';
        img.src = photoUrl(refs[current]);
        img.onload = () => {
            img.style.opacity = '1';
            loader.style.display = 'none';
        };
        lb.querySelectorAll('.lb-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === current);
        });
        lb.querySelector('.lb-counter').textContent = `${current + 1} / ${refs.length}`;
    }

    function closeLightbox() {
        lb.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
    }

    function handleKey(e) {
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowRight')  goTo(current + 1);
        if (e.key === 'ArrowLeft')   goTo(current - 1);
    }

    lb.querySelector('.lb-close').onclick   = closeLightbox;
    lb.querySelector('.lb-overlay').onclick = closeLightbox;
    lb.querySelector('.lb-next').onclick    = () => goTo(current + 1);
    lb.querySelector('.lb-prev').onclick    = () => goTo(current - 1);
    lb.querySelectorAll('.lb-thumb').forEach(t => {
        t.onclick = () => goTo(parseInt(t.dataset.index));
    });

    document.addEventListener('keydown', handleKey);
    goTo(startIndex);
}

// ---------------- RENDER PHOTOS STRIP ----------------
function renderPhotos(photos) {
    if (!photos || !photos.length) return '';
    const refs = Array.isArray(photos) ? photos : [];
    if (!refs.length) return '';

    return `
        <div class="photo-strip">
            ${refs.slice(0, 4).map((ref, i) => `
                <div class="photo-thumb-wrap" onclick="openLightbox(${JSON.stringify(refs)}, ${i})">
                    <img class="photo-thumb" src="${photoUrl(ref, 400)}" alt="photo" loading="lazy" />
                    ${i === 3 && refs.length > 4 ? `<div class="photo-more">+${refs.length - 4}</div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// ---------------- HAVERSINE DISTANCE ----------------
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------- FETCH BY CATEGORY ----------------
async function fetchByCategory(category, area, budget) {
    // DEBUG — remove after fix
    const { data: allPubs } = await client.from('justspin').select('*').eq('category', category);
    console.log('budget breakdown:', allPubs?.map(p => p.budget_for_two));
    console.log('ALL pubs ignoring filters:', allPubs?.length, allPubs);

    let query = client.from('justspin').select('*').eq('category', category);
    if (area) query = query.or(`area.ilike.%${area}%,address.ilike.%${area}%`);

    console.log('budget value received:', JSON.stringify(budget));
console.log('area value received:', JSON.stringify(area));

    if (budget === 'under500')       query = query.lt('budget_for_two', 500);
    else if (budget === '500to1500') query = query.gte('budget_for_two', 500).lte('budget_for_two', 1500);
    else if (budget === '1500plus')  query = query.gte('budget_for_two', 1500);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
}

// ---------------- FIND NEAREST ----------------
function findNearest(places, lat, lng) {
    return places.reduce((nearest, place) => {
        if (!place.latitude || !place.longitude) return nearest;
        const dist = getDistance(lat, lng, place.latitude, place.longitude);
        return (!nearest || dist < nearest._dist) ? { ...place, _dist: dist } : nearest;
    }, null);
}
// --------------- helper function---------------
// ---------------- PRICE LEVEL ----------------
function priceLevel(budget) {
    if (!budget || budget < 500)  return '₹';
    if (budget < 1000) return '₹₹';
    if (budget < 1500) return '₹₹₹';
    return '₹₹₹₹';
}
// ---------------- RENDER SINGLE ----------------
function renderSingle(pick) {
    const mapsUrl = pick.map_link ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pick.name} Bangalore`)}`;
    const refs = Array.isArray(pick.photos) ? pick.photos : [];
    const thumbUrl = refs.length ? photoUrl(refs[0], 400) : null;

return `
        <div class="result-header">
            <div class="result-badge">✨ Your Pick</div>
            <div class="rc-name">${pick.name}</div>
        </div>
        <div class="result-card">
            <div class="rc-left">
                <div class="rc-meta">
                    🌟 ${pick.rating || '—'}
                    &nbsp;•&nbsp; ${pick.category || '—'}
                    ${pick.category !== 'Park' ? `&nbsp;•&nbsp; ${priceLevel(pick.budget_for_two)}` : '&nbsp;•&nbsp; Free 🌿'}
                </div>
                <div class="rc-area">📍 ${pick.area || 'Bangalore'}, Bangalore</div>
                <a class="rc-map-btn" href="${mapsUrl}" target="_blank">🗺️ View on Map</a>
            </div>
            ${thumbUrl ? `
            <div class="rc-right" onclick="openLightbox(${JSON.stringify(refs)}, 0)">
                <img class="rc-img" src="${thumbUrl}" alt="${pick.name}" />
                ${refs.length > 1 ? `<div class="rc-img-count">+${refs.length - 1} 📷</div>` : ''}
            </div>` : ''}
        </div>
    `;
}
// ---------------- RENDER PAIR ----------------
function renderPair(place1, place2) {
    const dist = (place1.latitude && place2.latitude)
        ? getDistance(place1.latitude, place1.longitude, place2.latitude, place2.longitude).toFixed(1)
        : null;
    const maps1 = place1.map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place1.name} Bangalore`)}`;
    const maps2 = place2.map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place2.name} Bangalore`)}`;
    const directionsUrl = (place1.latitude && place2.latitude)
        ? `https://www.google.com/maps/dir/${place1.latitude},${place1.longitude}/${place2.latitude},${place2.longitude}`
        : null;

    function pairCardHtml(place, mapsUrl) {
        const refs = Array.isArray(place.photos) ? place.photos : [];
        const thumbUrl = refs.length ? photoUrl(refs[0], 400) : null;
        return `
            <div class="result-card">
                <div class="rc-left">
                    <div class="pair-label cat-${place.category.toLowerCase().replace(/\s/g, '-')}">${place.category}</div>
                    <div class="rc-name">${place.name}</div>
                    <div class="rc-meta">
                        ⭐ ${place.rating || '—'}
                        &nbsp;•&nbsp; ${place.category !== 'Park' ? priceLevel(place.budget_for_two) : 'Free 🌿'}
                    </div>
                    <div class="rc-area">📍 ${place.area || 'Bangalore'}, Bangalore</div>
                    <a class="rc-map-btn" href="${mapsUrl}" target="_blank">🗺️ View on Map</a>
                </div>
                ${thumbUrl ? `
                <div class="rc-right" onclick="openLightbox(${JSON.stringify(refs)}, 0)">
                    <img class="rc-img" src="${thumbUrl}" alt="${place.name}" />
                    ${refs.length > 1 ? `<div class="rc-img-count">+${refs.length - 1} 📷</div>` : ''}
                </div>` : ''}
            </div>
        `;
    }

    return `
        <div class="result-header">
            <div class="result-badge">✨ Perfect Combo</div>
            <div class="result-name">${place1.category} near ${place2.category}</div>
            ${dist ? `<div class="result-dist">📍 Only ${dist} km apart</div>` : ''}
        </div>
        <div class="result-body">
            ${pairCardHtml(place1, maps1)}
            <div class="pair-divider">↓ then head to ↓</div>
            ${pairCardHtml(place2, maps2)}
            ${directionsUrl ? `
            <a class="maps-link directions-link" href="${directionsUrl}" target="_blank">
                🗺️ Get Directions · ${dist} km between them
            </a>` : ''}
        </div>
    `;
}

// ---------------- HANDLE SPIN ----------------
window.handleSpin = async function () {
    const btn = document.getElementById('spinBtn');
    const resultEl = document.getElementById('result');

    const selectedCategories = [...document.querySelectorAll('.vibe-chip.active')].map(c => c.dataset.val);
    const area = document.getElementById('area').value;
    const budget = document.querySelector('.b-chip.active')?.dataset.val || 'any';

    console.log('selected budget:', budget);
console.log('selected categories:', selectedCategories);
console.log('selected area:', area);

    btn.classList.add('spinning');
    btn.innerHTML = '<span class="spin-dots">Finding your spot</span>';
    resultEl.classList.remove('visible');

    try {
        if (selectedCategories.length === 0) {
            const { data, error } = await client.from('justspin').select('*');
            if (error) throw new Error(error.message);
            if (!data?.length) throw new Error('No places found!');
            const pick = data[Math.floor(Math.random() * data.length)];
            resultEl.innerHTML = renderSingle(pick);

        } else if (selectedCategories.length === 1) {
            const places = await fetchByCategory(selectedCategories[0], area, budget);
            if (!places.length) {
                resultEl.innerHTML = `<div class="error-msg">No ${selectedCategories[0]} places found! Try different filters 🎯</div>`;
                resultEl.classList.add('visible');
                resetBtn();
                return;
            }
            const pick = places[Math.floor(Math.random() * places.length)];
            resultEl.innerHTML = renderSingle(pick);

        } else {
            const [cat1, cat2] = selectedCategories;
            const [places1, places2] = await Promise.all([
                fetchByCategory(cat1, area, budget),
                fetchByCategory(cat2, area, budget)
            ]);
            if (!places1.length) { resultEl.innerHTML = `<div class="error-msg">No ${cat1} places found! 🎯</div>`; resultEl.classList.add('visible'); resetBtn(); return; }
            if (!places2.length) { resultEl.innerHTML = `<div class="error-msg">No ${cat2} places found! 🎯</div>`; resultEl.classList.add('visible'); resetBtn(); return; }

            const pick1 = places1[Math.floor(Math.random() * places1.length)];
            const pick2 = (pick1.latitude && pick1.longitude)
                ? findNearest(places2, pick1.latitude, pick1.longitude)
                : places2[Math.floor(Math.random() * places2.length)];

            resultEl.innerHTML = renderPair(pick1, pick2);
        }

        resultEl.classList.add('visible');
    } catch (err) {
        resultEl.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
        resultEl.classList.add('visible');
    }

    resetBtn();
};

// ---------------- RESET ----------------
function resetBtn() {
    const btn = document.getElementById('spinBtn');
    btn.classList.remove('spinning');
    btn.innerHTML = '🎲 SPIN THE WHEEL';
}

