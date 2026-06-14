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

    images.forEach((url, i) => {
        const div = document.createElement('div');
        div.className = 'hero-slide' + (i === 0 ? ' active' : '');
        div.style.backgroundImage = `url('${url}')`;
        container.appendChild(div);
    });

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
    chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        document.getElementById('result').classList.remove('visible');
        toggleRestaurantFilters();
    });
});
document.querySelectorAll('.b-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.b-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });
});

// ---------------- RESTAURANT FILTERS ----------------
function toggleRestaurantFilters() {
    const isRestaurantSelected = !!document.querySelector('.vibe-chip[data-val="Restaurant"].active');
    const panel = document.getElementById('restaurantFilters');
    if (!panel) return;
    panel.classList.toggle('visible', isRestaurantSelected);
}

document.querySelectorAll('.diet-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.diet-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        document.getElementById('result').classList.remove('visible');
    });
});

document.querySelectorAll('.cuisine-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        if (chip.dataset.val === 'any') {
            document.querySelectorAll('.cuisine-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        } else {
            document.querySelector('.cuisine-chip[data-val="any"]')?.classList.remove('active');
            chip.classList.toggle('active');

            const anyActive = ![...document.querySelectorAll('.cuisine-chip')]
                .some(c => c.dataset.val !== 'any' && c.classList.contains('active'));
            if (anyActive) {
                document.querySelector('.cuisine-chip[data-val="any"]')?.classList.add('active');
            }
        }
        document.getElementById('result').classList.remove('visible');
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

// ---------------- REVIEWS ----------------
let currentReviewRating = 0;

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

function starsInputHtml() {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="star" data-star="${i}" onclick="setReviewRating(${i})">★</span>`;
    }
    return html;
}

function setReviewRating(rating) {
    currentReviewRating = rating;
    document.querySelectorAll('#review-modal .star').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.star, 10) <= rating);
    });
}

window.openReviewModal = function (placeId, placeName) {
    currentReviewRating = 0;

    const existing = document.getElementById('review-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'review-modal';
    modal.innerHTML = `
        <div class="review-overlay"></div>
        <div class="review-container">
            <button class="review-close">✕</button>
            <div class="review-title">${escapeHtml(placeName)}</div>
            <div class="review-subtitle">Write a Review</div>

            <div class="star-rating">${starsInputHtml()}</div>
            <input class="review-input" id="review-name" type="text" placeholder="Your name" maxlength="40" />
            <textarea class="review-textarea" id="review-comment" placeholder="Share your experience..." maxlength="500"></textarea>
            <button class="review-submit" id="review-submit-btn">Submit Review</button>

            <div class="review-list-label">Reviews</div>
            <div id="review-list"><div class="review-loading">Loading reviews...</div></div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    function closeModal() {
        modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
    }

    function handleKey(e) {
        if (e.key === 'Escape') closeModal();
    }

    modal.querySelector('.review-close').onclick = closeModal;
    modal.querySelector('.review-overlay').onclick = closeModal;
    modal.querySelector('#review-submit-btn').onclick = () => submitReview(placeId);
    document.addEventListener('keydown', handleKey);

    loadReviews(placeId);
};

async function loadReviews(placeId) {
    const listEl = document.getElementById('review-list');
    if (!listEl) return;

    try {
        const { data, error } = await client
            .from('reviews')
            .select('*')
            .eq('place_id', placeId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        if (!data || !data.length) {
            listEl.innerHTML = '<div class="review-empty">No reviews yet — be the first! 🎉</div>';
            return;
        }

        listEl.innerHTML = data.map(r => `
            <div class="review-item">
                <div class="review-item-head">
                    <span class="review-item-name">${escapeHtml(r.name)}</span>
                    <span class="review-item-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                </div>
                ${r.comment ? `<div class="review-item-comment">${escapeHtml(r.comment)}</div>` : ''}
                <div class="review-item-date">${new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
        `).join('');
    } catch (err) {
        listEl.innerHTML = `<div class="review-empty">Couldn't load reviews: ${err.message}</div>`;
    }
}

async function submitReview(placeId) {
    const nameInput = document.getElementById('review-name');
    const commentInput = document.getElementById('review-comment');
    const submitBtn = document.getElementById('review-submit-btn');

    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();

    if (!currentReviewRating) {
        alert('Please select a star rating');
        return;
    }
    if (!name) {
        alert('Please enter your name');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        const { error } = await client.from('reviews').insert({
            place_id: placeId,
            name,
            rating: currentReviewRating,
            comment: comment || null
        });

        if (error) throw new Error(error.message);

        nameInput.value = '';
        commentInput.value = '';
        setReviewRating(0);
        await loadReviews(placeId);
    } catch (err) {
        alert(`Failed to submit review: ${err.message}`);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Review';
}


function renderPhotos(photos) {
    if (!photos || !photos.length) return '';
    const refs = Array.isArray(photos) ? photos : [];
    if (!refs.length) return '';

    return `
        <div class="photo-strip">
            ${refs.slice(0, 4).map((ref, i) => `
                <div class="photo-thumb-wrap" onclick='openLightbox(${JSON.stringify(refs)}, ${i})'>
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
async function fetchByCategory(category, area, budget, diet = 'any', cuisines = []) {
    let query = client.from('justspin').select('*').eq('category', category);
    if (area) query = query.eq('area', area);

    if (budget === 'under1000')       query = query.lt('budget_for_two', 1000);
    else if (budget === '1000to2500') query = query.gte('budget_for_two', 1000).lte('budget_for_two', 2500);
    else if (budget === '2500plus')   query = query.gte('budget_for_two', 2500);

    if (category === 'Restaurant') {
        if (diet === 'veg')    query = query.eq('is_veg', true);
        else if (diet === 'nonveg') query = query.eq('is_veg', false);

        if (cuisines.length) query = query.overlaps('cuisine', cuisines);
    }

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

// ---------------- PRICE LEVEL ----------------
function priceLevel(budget) {
    if (!budget || budget < 500)  return '₹';
    if (budget < 1000) return '₹₹';
    if (budget < 1500) return '₹₹₹';
    return '₹₹₹₹';
}

function priceDisplay(category, budget) {
    if (category === 'Park') return 'Free 🌿';
    return `₹${budget?.toLocaleString('en-IN')} for two`;
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
                    &nbsp;•&nbsp; ${priceDisplay(pick.category, pick.budget_for_two)}
                </div>
                <div class="rc-area">📍 ${pick.area || 'Bangalore'}, Bangalore</div>
                <div class="rc-actions">
                    <a class="rc-map-btn" href="${mapsUrl}" target="_blank">🗺️ View on Map</a>
                    <button class="review-btn" onclick='openReviewModal(${pick.id}, ${JSON.stringify(pick.name)})'>✍️ Review</button>
                </div>
            </div>
            ${thumbUrl ? `
            <div class="rc-right" onclick='openLightbox(${JSON.stringify(refs)}, 0)'>
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
                        &nbsp;•&nbsp; ${priceDisplay(place.category, place.budget_for_two)}
                    </div>
                    <div class="rc-area">📍 ${place.area || 'Bangalore'}, Bangalore</div>
                    <div class="rc-actions">
                        <a class="rc-map-btn" href="${mapsUrl}" target="_blank">🗺️ View on Map</a>
                        <button class="review-btn" onclick='openReviewModal(${place.id}, ${JSON.stringify(place.name)})'>✍️ Review</button>
                    </div>
                </div>
                ${thumbUrl ? `
                <div class="rc-right" onclick='openLightbox(${JSON.stringify(refs)}, 0)'>
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

// ---------------- EMERGENCY ----------------
function toggleEmergencyFilters() {
    document.getElementById('emergencyFilters')?.classList.toggle('visible');
}

const EMERGENCY_CONFIG = {
    Petrol:   { type: 'gas_station',  icon: '⛽', label: 'Petrol Pump' },
    Hospital: { type: 'hospital',     icon: '🏥', label: 'Hospital' },
    Pharmacy: { type: 'pharmacy',     icon: '💊', label: 'Pharmacy' },
};

window.handleEmergency = async function (category, chipEl) {
    const resultEl = document.getElementById('result');
    const config = EMERGENCY_CONFIG[category];

    document.querySelectorAll('.emergency-chip').forEach(c => c.classList.remove('active'));
    chipEl.classList.add('active');

    resultEl.classList.remove('visible');
    resultEl.innerHTML = `<div class="error-msg">📍 Finding nearest ${config.label}...</div>`;
    resultEl.classList.add('visible');

    if (!navigator.geolocation) {
        resultEl.innerHTML = `<div class="error-msg">Geolocation isn't supported on this device 😕</div>`;
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
            // Call Google Places via our local proxy (avoids CORS)
            const PROXY = 'http://localhost:3001';
            const res = await fetch(`${PROXY}/nearby?lat=${latitude}&lng=${longitude}&type=${config.type}`);
            if (!res.ok) throw new Error('proxy_fail');

            const data = await res.json();
            const places = data.results || [];

            if (!places.length) throw new Error(`No ${config.label} found nearby`);

            // Show top 3 nearest
            resultEl.innerHTML = renderEmergencyList(places.slice(0, 3), config, latitude, longitude);
            resultEl.classList.add('visible');

        } catch (err) {
            // Fallback: open Google Maps directly in a new tab
            const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(config.label)}/@${latitude},${longitude},15z`;
            resultEl.innerHTML = `
                <div class="result-header emergency-header">
                    <div class="result-badge emergency-badge">🚨 ${config.label}</div>
                    <div class="rc-name">Opening Google Maps...</div>
                </div>
                <div class="result-body" style="padding:1rem">
                    <p style="color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:12px">
                        We found your location! Tap below to see all nearby ${config.label.toLowerCase()}s on Google Maps.
                    </p>
                    <a href="${mapsUrl}" target="_blank" class="rc-map-btn" style="display:block;text-align:center;padding:14px;font-size:15px">
                        ${config.icon} Find Nearest ${config.label} →
                    </a>
                </div>
            `;
            resultEl.classList.add('visible');
        }
    }, (err) => {
        // Permission denied — give a direct Google Maps search link without coordinates
        const fallbackUrl = `https://www.google.com/maps/search/${encodeURIComponent(config.label + ' near me')}`;
        resultEl.innerHTML = `
            <div class="result-header emergency-header">
                <div class="result-badge emergency-badge">🚨 ${config.label}</div>
                <div class="rc-name">Location access needed</div>
            </div>
            <div class="result-body" style="padding:1rem">
                <p style="color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:12px">
                    Please allow location access in your browser, or tap below to search on Google Maps.
                </p>
                <a href="${fallbackUrl}" target="_blank" class="rc-map-btn" style="display:block;text-align:center;padding:14px;font-size:15px">
                    ${config.icon} Search ${config.label} on Maps →
                </a>
            </div>
        `;
        resultEl.classList.add('visible');
    }, { timeout: 8000 });
};

function renderEmergencyList(places, config, userLat, userLng) {
    const cards = places.map(place => {
        const lat = place.geometry?.location?.lat;
        const lng = place.geometry?.location?.lng;
        const dist = (lat && lng) ? getDistance(userLat, userLng, lat, lng).toFixed(1) : null;
        const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
        const isOpen = place.opening_hours?.open_now;
        const openBadge = isOpen === true
            ? '<span style="color:#00e5a0;font-size:12px;font-weight:700">● Open Now</span>'
            : isOpen === false
            ? '<span style="color:#ff5078;font-size:12px;font-weight:700">● Closed</span>'
            : '';

        return `
            <div class="result-card" style="border-bottom:1px solid rgba(255,255,255,0.06)">
                <div class="rc-left">
                    <div class="rc-name" style="font-size:1rem">${escapeHtml(place.name)}</div>
                    <div class="rc-meta">
                        ${config.icon} ${dist ? `${dist} km away` : ''}
                        ${place.rating ? `&nbsp;•&nbsp; 🌟 ${place.rating}` : ''}
                        ${openBadge ? `&nbsp;•&nbsp; ${openBadge}` : ''}
                    </div>
                    <div class="rc-area">📍 ${escapeHtml(place.vicinity || 'Bangalore')}</div>
                    <div class="rc-actions">
                        <a class="rc-map-btn" href="${mapsUrl}" target="_blank">🗺️ Directions</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="result-header emergency-header">
            <div class="result-badge emergency-badge">🚨 Nearest ${config.label}</div>
            <div class="rc-name">Top 3 closest to you</div>
        </div>
        <div class="result-body" style="padding:0">
            ${cards}
        </div>
    `;
}


window.handleSpin = async function () {
    const btn = document.getElementById('spinBtn');
    const resultEl = document.getElementById('result');

    const selectedCategories = [...document.querySelectorAll('.vibe-chip.active')].map(c => c.dataset.val);
    const area = document.getElementById('area').value;
    const budget = document.querySelector('.b-chip.active')?.dataset.val || 'any';
    const diet = document.querySelector('.diet-chip.active')?.dataset.val || 'any';
    const cuisines = [...document.querySelectorAll('.cuisine-chip.active')]
        .map(c => c.dataset.val)
        .filter(v => v !== 'any');

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
            const places = await fetchByCategory(selectedCategories[0], area, budget, diet, cuisines);
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
                fetchByCategory(cat1, area, budget, diet, cuisines),
                fetchByCategory(cat2, area, budget, diet, cuisines)
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
