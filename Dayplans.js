// ====================================================================
// A DAY IN BANGALORE — curated full-day itineraries
// ====================================================================
// To add/edit a plan, just edit the DAY_PLANS array below.
// Each stop's `photo` should be a direct image URL (Unsplash etc.)
// since these are hardcoded, not pulled from Google Places refs.
// ====================================================================

// --------------------------------------------------------------------
// THEMES — each plan picks one. To add a new theme, add an entry here
// then reference its key from a plan's `theme` field.
// --------------------------------------------------------------------
const DAY_PLAN_THEMES = {
    teal: {
        headingFont: "'Archivo Black', sans-serif",
        fontImport: null,
        accent: '#00d9c8',
        accentSoft: 'rgba(0, 217, 200, 0.18)',
        glow1: 'rgba(0, 217, 200, 0.40)',
        glow2: 'rgba(0, 150, 140, 0.30)',
        bgBase: '#04201f'
    },
    pink: {
        headingFont: "'Archivo Black', sans-serif",
        fontImport: null,
        accent: '#ff5fcf',
        accentSoft: 'rgba(255, 95, 207, 0.18)',
        glow1: 'rgba(255, 95, 207, 0.40)',
        glow2: 'rgba(180, 50, 140, 0.30)',
        bgBase: '#220a1c'
    },
    amber: {
        headingFont: "'Archivo Black', sans-serif",
        fontImport: null,
        accent: '#ffd23f',
        accentSoft: 'rgba(255, 210, 63, 0.18)',
        glow1: 'rgba(255, 210, 63, 0.38)',
        glow2: 'rgba(255, 140, 30, 0.28)',
        bgBase: '#2a1c04'
    },
    green: {
        headingFont: "'Archivo Black', sans-serif",
        fontImport: null,
        accent: '#00e5a0',
        accentSoft: 'rgba(0, 229, 160, 0.18)',
        glow1: 'rgba(0, 229, 160, 0.38)',
        glow2: 'rgba(0, 150, 100, 0.28)',
        bgBase: '#04221a'
    },
    heritage: {
        headingFont: "'Playfair Display', serif",
        fontImport: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap',
        accent: '#d4a85a',
        accentSoft: 'rgba(212, 168, 90, 0.18)',
        glow1: 'rgba(212, 168, 90, 0.35)',
        glow2: 'rgba(120, 70, 30, 0.30)',
        bgBase: '#1c1408'
    }
};

function loadThemeFont(theme) {
    if (!theme.fontImport) return;
    const id = 'dayplan-font-' + theme.fontImport.replace(/[^a-z0-9]/gi, '');
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = theme.fontImport;
    document.head.appendChild(link);
}

const DAY_PLANS = [
    {
        id: 'classic-explorer',
        title: 'Essence of Cubbon park',
        subtitle: 'Eat. Walk. Wonder. Repeat. ',
        emoji: '🌤️',
        theme: 'teal',
        coverPhoto: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
        duration: 'Full Day · 8 AM – 4 PM',
        stops: [
{
    time: '08:00 AM',
    category: 'Breakfast',
    name: 'MTR (Mavalli Tiffin Rooms)',
    area: 'Lalbagh Road',
    note: 'Start your day with Bengaluru’s iconic dosa, idli, vada, and filter coffee.',
    photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    mapsQuery: 'MTR Mavalli Tiffin Rooms Bangalore'
},
{
    time: '09:00 AM',
    category: 'Landmark',
    name: 'Vidhana Soudha',
    area: 'Central Bengaluru',
    note: 'Admire Karnataka’s iconic legislative building and its grand Neo-Dravidian architecture.',
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    mapsQuery: 'Vidhana Soudha Bangalore'
},
{
    time: '09:30 AM',
    category: 'Nature',
    name: 'Cubbon Park',
    area: 'Central Bengaluru',
    note: 'Enjoy a peaceful walk through Bengaluru’s green lung surrounded by heritage buildings.',
    photo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    mapsQuery: 'Cubbon Park Bangalore'
},
{
    time: '11:30 AM',
    category: 'Attraction',
    name: 'Bangalore Aquarium',
    area: 'Cubbon Park',
    note: 'Explore one of India’s oldest aquariums featuring freshwater and ornamental fish species.',
    photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    mapsQuery: 'Bangalore Aquarium Cubbon Park'
},
{
    time: '12:00 PM',
    category: 'Museum',
    name: 'Visvesvaraya Industrial & Technological Museum',
    area: 'Kasturba Road',
    note: 'Discover interactive science exhibits, engineering marvels, and technology displays.',
    photo: 'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=800&q=80',
    mapsQuery: 'Visvesvaraya Industrial and Technological Museum Bangalore'
},
{
    time: '01:30 PM',
    category: 'Lunch / Coffee',
    name: 'Toscano Italian Restaurant or Over Coffee',
    area: 'UB City / Kasturba Road',
    note: 'Take a relaxing break with authentic Italian cuisine or freshly brewed coffee.',
    photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    mapsQuery: 'Toscano UB City Bangalore'
},
{
    time: '02:30 PM',
    category: 'Art & Culture',
    name: 'Venkatappa Art Gallery',
    area: 'Kasturba Road',
    note: 'End your trail exploring Bengaluru’s artistic heritage through paintings and sculptures.',
    photo: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
    mapsQuery: 'Venkatappa Art Gallery Bangalore'
}
        ]
    },
    {
        id: 'basavanagudi-trail',
        title: 'Basavanagudi Heritage & Food Trail',
        subtitle: 'Temples, gardens & street food through old Bengaluru',
        emoji: '🛕',
        theme: 'heritage',
        coverPhoto: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80',
        duration: 'Full Day · 8 AM – 6 PM',
        stops: [
    {
    time: '08:00 AM',
    category: 'Breakfast',
    name: 'Vidyarthi Bhavan',
    area: 'Basavanagudi',
    note: 'Start your day with Bengaluru’s most iconic crispy masala dosa and filter coffee.',
    photo: 'https://images.unsplash.com/photo-1630383249896-498f9bc04eb0?w=800&q=80',
    mapsQuery: 'Vidyarthi Bhavan Basavanagudi'
},
{
    time: '09:00 AM',
    category: 'Temple',
    name: 'Dodda Basavana Gudi (Bull Temple)',
    area: 'Basavanagudi',
    note: 'Visit the historic Bull Temple, home to one of the largest Nandi statues in India.',
    photo: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    mapsQuery: 'Bull Temple Basavanagudi'
},
{
    time: '09:45 AM',
    category: 'Park',
    name: 'Bugle Rock Park',
    area: 'Basavanagudi',
    note: 'Enjoy a peaceful walk through ancient rock formations and lush greenery next to the Bull Temple.',
    photo: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80',
    mapsQuery: 'Bugle Rock Park Bangalore'
},
{
    time: '10:45 AM',
    category: 'Market',
    name: 'Gandhi Bazaar',
    area: 'Basavanagudi',
    note: 'Experience the charm of old Bengaluru with flower stalls, traditional stores, local snacks, and vibrant street life.',
    photo: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    mapsQuery: 'Gandhi Bazaar Basavanagudi'
},
{
    time: '12:00 PM',
    category: 'Lunch',
    name: 'The Rogue Elephant',
    area: 'Basavanagudi',
    note: 'Relax with a leisurely lunch in a charming heritage-style garden café.',
    photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    mapsQuery: 'The Rogue Elephant Basavanagudi'
},
{
    time: '01:30 PM',
    category: 'Garden',
    name: 'Lalbagh Botanical Garden',
    area: 'Mavalli',
    note: 'Explore Bengaluru’s iconic botanical garden, famous for its Glass House and centuries-old trees.',
    photo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    mapsQuery: 'Lalbagh Botanical Garden Bangalore'
},
{
    time: '04:00 PM',
    category: 'Lake',
    name: 'Yediyur Lake Park',
    area: 'Jayanagar',
    note: 'Unwind with a lakeside walk and enjoy boating amidst scenic surroundings.',
    photo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    mapsQuery: 'Yediyur Lake Park Bangalore'
},
{
    time: '06:00 PM',
    category: 'Food Street',
    name: 'VV Puram Food Street',
    area: 'Basavanagudi',
    note: 'End the day sampling Bengaluru’s famous street food, chaats, dosas, sweets, and local delicacies.',
    photo: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80',
    mapsQuery: 'VV Puram Food Street Bangalore'
}
]
},

    {
        id: 'The-Chikkaballapur-Escape', 
        title: 'The Chikkaballapur Escape', 
        subtitle: 'Sunrise peaks, spiritual vibes & hidden waterfalls', 
        emoji: '⛰️', 
        theme: 'green', 
        coverPhoto: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80', 
        duration: 'Adventure · 5:30 AM – 6:00 PM',
        stops: [
            {
            time: '05:30 AM', 
            category: 'Trek', 
            name: 'Nandi Hills / Avalabetta Sunrise Trek', 
            area: 'Chikkaballapur', 
            note: 'Begin your day above the clouds with a breathtaking sunrise and panoramic hill views.', 
            mapsQuery: 'Nandi Hills Karnataka'
            },
            {
             time: '09:00 AM', 
             category: 'Breakfast', 
             name: 'Isha Foundation Food Court', 
             area: 'Nandi Hills', 
             note: 'Refuel with hot idlis, crispy dosas, vadas, and filter coffee at a local eatery.', 
            mapsQuery: 'Breakfast near Nandi Hills'
            },
           { 
            time: '09:30 AM', 
            category: 'Spiritual',
            name: 'Isha Foundation & Adiyogi', 
            area: 'Avalagurki', 
            note: 'Immerse yourself in the serene atmosphere of the Adiyogi statue, Yogeshwara Linga, and meditation spaces.', 
            mapsQuery: 'Isha Foundation Chikkaballapura' 
        },
        {
            time :'01:00 PM',
            category: 'Lunch',
            name: 'Kalyani Oota Hotel',
            area: 'Chikkaballapur',
            note: 'Enjoy a delicious meal at this popular local restaurant.',
            mapsQuery: 'Kalyani Oota Hotel'
        },
        { 
            time: '02:00 PM', 
            category: 'Waterfall Trek', 
            name: 'Kethanahalli Falls (Seasonal)', 
            area: 'Chikkaballapur', 
            note: 'Take a short nature trek to this hidden seasonal waterfall, best experienced after the monsoon.', 
            mapsQuery: 'Kethanahalli Falls' 
        },
        { 
            time: '05:00 PM', 
            category: 'Scenic Drive', 
            name: 'Countryside Sunset Drive', 
            area: 'Chikkaballapur', 
            note: 'Enjoy the scenic landscapes and golden-hour views as you make your way back toward Bengaluru.', 
            mapsQuery: 'Chikkaballapur Karnataka' 
        }
        
        ]
    }
];



// ---------------- TAB SWITCHING ----------------
function switchMainTab(tab) {
    document.querySelectorAll('.main-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    document.querySelectorAll('.main-tab-panel').forEach(p => {
        p.classList.toggle('active', p.id === `tab-${tab}`);
    });
    if (tab === 'dayplans') {
        renderDayPlanCards();
    }
}

// ---------------- CARD LIST RENDER ----------------
function renderDayPlanCards() {
    const listEl = document.getElementById('dayplanCardList');
    if (!listEl || listEl.dataset.rendered === 'true') return;

    listEl.innerHTML = DAY_PLANS.map(plan => {
        const theme = DAY_PLAN_THEMES[plan.theme];
        return `
        <div class="dayplan-card" style="--accent:${theme.accent}" onclick="openDayPlanDetail('${plan.id}')">
            <div class="dayplan-card-img" style="background-image:url('${plan.coverPhoto}')">
                <div class="dayplan-card-emoji">${plan.emoji}</div>
            </div>
            <div class="dayplan-card-body">
                <div class="dayplan-card-title">${plan.title}</div>
                <div class="dayplan-card-subtitle">${plan.subtitle}</div>
                <div class="dayplan-card-meta">
                    <span>${plan.duration}</span>
                    <span class="dayplan-card-stopcount">${plan.stops.length} stops</span>
                </div>
            </div>
            <div class="dayplan-card-arrow">→</div>
        </div>
    `;
    }).join('');

    listEl.dataset.rendered = 'true';
}

// ---------------- DETAIL VIEW RENDER ----------------
function openDayPlanDetail(planId) {
    const plan = DAY_PLANS.find(p => p.id === planId);
    if (!plan) return;

    const theme = DAY_PLAN_THEMES[plan.theme];
    loadThemeFont(theme);

    const listView = document.getElementById('dayplans-list-view');
    const detailView = document.getElementById('dayplans-detail-view');
    const content = document.getElementById('dayplanDetailContent');

    detailView.style.setProperty('--accent', theme.accent);
    detailView.style.setProperty('--accent-soft', theme.accentSoft);
    detailView.style.setProperty('--glow-1', theme.glow1);
    detailView.style.setProperty('--glow-2', theme.glow2);
    detailView.style.setProperty('--bg-base', theme.bgBase);
    detailView.style.setProperty('--heading-font', theme.headingFont);

    content.innerHTML = `
        <div class="dayplan-detail-header">
            <div class="dayplan-detail-cover" style="background-image:url('${plan.coverPhoto}')"></div>
            <div class="dayplan-detail-headtext">
                <div class="dayplan-detail-emoji">${plan.emoji}</div>
                <div class="dayplan-detail-title">${plan.title}</div>
                <div class="dayplan-detail-subtitle">${plan.subtitle}</div>
                <div class="dayplan-detail-duration">${plan.duration}</div>
            </div>
        </div>

        <div class="dayplan-timeline">
            ${plan.stops.map((stop, i) => `
                <div class="dayplan-stop">
                    <div class="dayplan-stop-rail">
                        <div class="dayplan-stop-dot"></div>
                        ${i < plan.stops.length - 1 ? '<div class="dayplan-stop-line"></div>' : ''}
                    </div>
                    <div class="dayplan-stop-card">
                        <div class="dayplan-stop-time">${stop.time}</div>
                        <div class="dayplan-stop-top">
                            <div class="dayplan-stop-textcol">
                                <div class="dayplan-stop-category">${stop.category}</div>
                                <div class="dayplan-stop-name">${stop.name}</div>
                                <div class="dayplan-stop-area">📍 ${stop.area}, Bangalore</div>
                                <div class="dayplan-stop-note">${stop.note}</div>
                                <a class="dayplan-stop-mapbtn"
                                   href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.mapsQuery)}"
                                   target="_blank">🗺️ View on Map</a>
                            </div>
                            <div class="dayplan-stop-imgwrap">
                                <img class="dayplan-stop-img" src="${stop.photo}" alt="${stop.name}" loading="lazy" />
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    listView.classList.add('dayplans-list-hidden');
    detailView.classList.remove('dayplans-detail-hidden');
    detailView.classList.add('dayplan-themed');
}

function closeDayPlanDetail() {
    document.getElementById('dayplans-list-view').classList.remove('dayplans-list-hidden');
    const detailView = document.getElementById('dayplans-detail-view');
    detailView.classList.add('dayplans-detail-hidden');
    detailView.classList.remove('dayplan-themed');
}