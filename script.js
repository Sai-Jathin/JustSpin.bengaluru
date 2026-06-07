document.querySelectorAll('.vibe-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
});

document.querySelectorAll('.b-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.b-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });
});

// Fixed the double quote format error on Marathahalli
const nearbyAreas = {
    Whitefield: ["Whitefield", "Brookefield", "Kadugodi", "Seegehalli", "Varthur", "Marathahalli"],
    Brookefield: ["Brookefield", "Whitefield", "Marathahalli"],
    Marathahalli: ["Marathahalli", "Bellandur", "Brookefield", "Domlur"],
    Bellandur: ["Bellandur", "Marathahalli", "Sarjapur Road", "HSR Layout", "Varthur"],
    Indiranagar: ["Indiranagar", "Domlur", "HAL"]
};

window.handleSpin = async function() {
    const btn = document.getElementById('spinBtn');
    const resultEl = document.getElementById('result');

    btn.classList.add('spinning');
    btn.innerHTML = '<span class="spin-dots">Finding your spot</span>';
    resultEl.classList.remove('visible');

    const SUPABASE_URL = "https://erylrdmhhlgvblcyuiup.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyeWxyZG1oaGxndmJsY3l1aXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjMwNjksImV4cCI6MjA5NjIzOTA2OX0.qaSKKSSHrVO5B6ulb6hHD6LNrDT73piYqFhsJCsuRB0";
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const area = document.getElementById('area').value;
    
    // Remaps 'Pub' chip value to match the exact standardized DB category 'Pub & Brewery'
    const categories = [...document.querySelectorAll('.vibe-chip.active')].map(c => {
        let val = c.dataset.val;
        if (val === 'Pub') return 'Pub & Brewery';
        return val;
    });
    
    const budgetChip = document.querySelector('.b-chip.active')?.dataset.val;

    let query = client.from('places').select('*');
    
    if (area) {
        const searchAreas = nearbyAreas[area] || [area];
        query = query.in('area', searchAreas);
    }
    
    if (categories.length > 0) {
        query = query.in('category', categories);
    }
    
    if (budgetChip === 'under500')   query = query.lt('budget', 500);
    if (budgetChip === '500to1500') query = query.gte('budget', 500).lte('budget', 1500);
    if (budgetChip === '1500plus')  query = query.gt('budget', 1500);

    const { data, error } = await query;

    if (error) {
        resultEl.innerHTML = `<div class="error-msg">Error: ${error.message}</div>`;
        resultEl.classList.add('visible');
        resetBtn(); return;
    }

    if (!data || data.length === 0) {
        resultEl.innerHTML = '<div class="error-msg">No places found! Try different filters.</div>';
        resultEl.classList.add('visible');
        resetBtn(); return;
    }

    const pick = data[Math.floor(Math.random() * data.length)];
    
    // Fixed missing $ syntax bug in template string string
    const mapsUrl = pick.maps_link && pick.maps_link !== 'https://maps.google.com'
        ? pick.maps_link
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pick.place_name + ' ' + (pick.area || '') + ' Bangalore')}`;

    resultEl.innerHTML = `
        <div class="result-header">
            <div class="result-badge">✨ Your Pick</div>
            <div class="result-name">${pick.place_name}</div>
        </div>
        <div class="result-body">
            <div class="meta-grid">
                <div class="meta-cell">
                    <div class="meta-k">Area</div>
                    <div class="meta-v">${pick.area || '—'}</div>
                </div>
                <div class="meta-cell">
                    <div class="meta-k">Category</div>
                    <div class="meta-v">${pick.category || '—'}</div>
                </div>
                <div class="meta-cell">
                    <div class="meta-k">Budget</div>
                    <div class="meta-v">₹${pick.budget || '—'}</div>
                </div>
                <div class="meta-cell">
                    <div class="meta-k">Distance</div>
                    <div class="meta-v">${pick.distance ? pick.distance + ' km' : '—'}</div>
                </div>

                <div class="meta-cell">
                    <div class="meta-k">Rating</div>
                    <div class="meta-v meta-rating">
                        ${"⭐".repeat(Math.round(pick.ratings || 0))} ${pick.ratings || '—'}/5
                    </div>
                </div>
                ${pick.mood ? `<div class="meta-cell">
                    <div class="meta-k">Mood</div>
                    <div class="meta-v">${pick.mood}</div>
                </div>` : ''}
            </div>
            <a class="maps-link" href="${mapsUrl}" target="_blank">📍 Open in Google Maps</a>
        </div>`;

    resultEl.classList.add('visible');
    resetBtn();
}

function resetBtn() {
    const btn = document.getElementById('spinBtn');
    btn.classList.remove('spinning');
    btn.innerHTML = '🎲 SPIN THE WHEEL';
}
