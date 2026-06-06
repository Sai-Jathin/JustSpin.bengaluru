
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;
        if (filter === 'budget') {
            document.querySelectorAll('.chip[data-filter="budget"]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        } else {
            chip.classList.toggle('active');
        }
    });
});
 
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
    const categories = [...document.querySelectorAll('.chip[data-filter="category"].active')].map(c => c.dataset.val);
    const budgetChip = document.querySelector('.chip[data-filter="budget"].active')?.dataset.val;
 
    let query = client.from('places').select('*');
    if (area) query = query.eq('area', area);
    if (categories.length > 0) query = query.in('category', categories);
 
    if (budgetChip === 'under500')  query = query.lt('budget', 500);
    if (budgetChip === '500to1500') query = query.gte('budget', 500).lte('budget', 1500);
    if (budgetChip === '1500plus')  query = query.gt('budget', 1500);
 
    const { data, error } = await query;
 
    if (error) {
        showResult(`<div class="error">Error: ${error.message}</div>`);
        resetBtn(); return;
    }
 
    if (!data || data.length === 0) {
        showResult('<div class="error">No places found! Try different filters.</div>');
        resetBtn(); return;
    }
 
    const pick = data[Math.floor(Math.random() * data.length)];
    const mapsUrl = pick.maps_link && pick.maps_link !== 'https://maps.google.com'
        ? pick.maps_link
        : `https://www.google.com/maps/search/${encodeURIComponent(pick.place_name + ' ' + (pick.area || '') + ' Bangalore')}`;
 
    showResult(`
        <div class="result-badge">✨ Your pick</div>
        <div class="result-name">${pick.place_name}</div>
        <div class="meta-grid">
            <div class="meta-item">
                <div class="meta-key">Area</div>
                <div class="meta-val">${pick.area || '—'}</div>
            </div>
            <div class="meta-item">
                <div class="meta-key">Category</div>
                <div class="meta-val">${pick.category || '—'}</div>
            </div>
            <div class="meta-item">
                <div class="meta-key">Budget</div>
                <div class="meta-val">₹${pick.budget || '—'}</div>
            </div>
            <div class="meta-item">
                <div class="meta-key">Distance</div>
                <div class="meta-val">${pick.distance ? pick.distance + ' km' : '—'}</div>
            </div>
            ${pick.mood ? `<div class="meta-item" style="grid-column:span 2">
                <div class="meta-key">Mood</div>
                <div class="meta-val">${pick.mood}</div>
            </div>` : ''}
        </div>
        <a class="maps-btn" href="${mapsUrl}" target="_blank">📍 Open in Google Maps</a>
    `);
 
    resetBtn();
}
 
function showResult(html) {
    const el = document.getElementById('result');
    el.innerHTML = html;
    el.classList.add('visible');
}
 
function resetBtn() {
    const btn = document.getElementById('spinBtn');
    btn.classList.remove('spinning');
    btn.innerHTML = '🎲 SPIN AGAIN';
}