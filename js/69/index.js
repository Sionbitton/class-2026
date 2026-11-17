const persist = true;
const status = document.querySelector('#status');
const results = document.querySelector('#results');
const storageKey = 'homework69-places';
let map, info, Marker, Bounds, username;
let places = [], markers = [], requestNumber = 0;
function validPlace(p) {
    return p && typeof p.title === 'string' && Number.isFinite(p.lat) && Math.abs(p.lat) <= 90 && Number.isFinite(p.lng) && Math.abs(p.lng) <= 180;
}
function safeUrl(value, wikiOnly = false) {
    try {
        const url = new URL(value.startsWith('http') ? value : 'https://' + value);
        if (url.protocol !== 'https:' || (wikiOnly && !/(^|\.)wikipedia\.org$/.test(url.hostname))) return '';
        return url.href;
    } catch { return ''; }
}
function storePlaces() {
    if (!persist) return;
    try { localStorage.setItem(storageKey, JSON.stringify(places)); }
    catch { status.textContent += ' Browser storage is unavailable; these results could not be saved.'; }
}
function render() {
    markers.forEach(marker => marker.map = null);
    markers = [];
    results.replaceChildren();
    info.close();
    const bounds = new Bounds();
    for (const place of places) {
        const position = { lat: place.lat, lng: place.lng };
        const marker = new Marker({map, position, title: place.title});
        const show = () => {
            const content = document.createElement('div');
            const title = document.createElement('h2');
            title.textContent = place.title;
            const summary = document.createElement('p');
            summary.textContent = place.summary;
            content.append(title, summary);
            const url = safeUrl(place.wikipediaUrl || '', true);
            if (url) {
                const link = document.createElement('a');
                link.href = url; link.textContent = 'Read on Wikipedia';
                link.target = '_blank'; link.rel = 'noopener noreferrer'; content.append(link);
            }
            info.setContent(content); info.open({map, anchor: marker});
        };
        marker.addListener('click', show);
        const button = document.createElement('button');
        const thumbnail = safeUrl(place.thumbnailImg || '');
        if (thumbnail) {
            const img = document.createElement('img'); img.src = thumbnail; img.alt = ''; img.onerror = () => img.remove(); button.append(img);
        }
        button.append(document.createTextNode(place.title));
        button.addEventListener('click', () => { map.panTo(position); map.setZoom(12); show(); });
        results.append(button); markers.push(marker); bounds.extend(position);
    }
    if (places.length) { map.fitBounds(bounds); if (places.length === 1) map.setZoom(12); }
}
window.gm_authFailure = () => { status.textContent = 'Google Maps rejected this key. Check its API and website restrictions.'; };
document.querySelector('#setup').addEventListener('submit', async event => {
    event.preventDefault();
    if (map) return;
    const button = event.submitter; button.disabled = true;
    username = document.querySelector('#username').value.trim();
    const keyInput = document.querySelector('#maps-key');
    try {
        await new Promise((resolve, reject) => {
            window.homeworkMapsReady = resolve;
            const script = document.createElement('script');
            const params = new URLSearchParams({key:keyInput.value.trim(), callback:'homeworkMapsReady', loading:'async', v:'weekly'});
            script.src = 'https://maps.googleapis.com/maps/api/js?' + params;
            script.onerror = () => reject(new Error('Could not download Google Maps. Check your connection.'));
            document.head.append(script);
            keyInput.value = '';
        });
        const [{Map, InfoWindow}, {AdvancedMarkerElement}, {LatLngBounds}] = await Promise.all([google.maps.importLibrary('maps'),google.maps.importLibrary('marker'),google.maps.importLibrary('core')]);
        Marker = AdvancedMarkerElement; Bounds = LatLngBounds;
        map = new Map(document.querySelector('#map'), {center:{lat:40,lng:-74}, zoom:5, mapId:'DEMO_MAP_ID'});
        info = new InfoWindow();
        status.textContent = 'Ready to search.';
        if (persist) {
            try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (!Array.isArray(saved) || !saved.every(validPlace)) throw new Error(); places = saved; }
            catch { status.textContent = 'Saved places could not be read. Use Clear to reset them.'; }
        }
        render(); document.querySelector('#search-button').disabled = false;
        document.querySelector('#setup').hidden = true;
    } catch(error) { status.textContent = error.message; button.disabled = false; }
});
document.querySelector('#search-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (!map) return;
    const query = document.querySelector('#query').value.trim();
    if (!query) return;
    const current = ++requestNumber;
    status.textContent = 'Searching…';
    try {
        const params = new URLSearchParams({q:query,maxRows:10,username});
        const response = await fetch('https://secure.geonames.org/wikipediaSearchJSON?' + params);
        if (!response.ok) throw new Error('Search failed: ' + response.status);
        const data = await response.json();
        if (current !== requestNumber) return;
        if (data.status) throw new Error(data.status.message);
        if (!Array.isArray(data.geonames)) throw new Error('Unexpected search response.');
        const found = data.geonames.map(p => ({title:p.title,lat:Number(p.lat),lng:Number(p.lng),summary:p.summary || '',wikipediaUrl:p.wikipediaUrl || '',thumbnailImg:p.thumbnailImg || ''})).filter(validPlace);
        const unique = new Map();
        for (const place of [...(persist ? places : []), ...found]) unique.set(place.title + ':' + place.lat + ':' + place.lng,place);
        places = [...unique.values()]; render();
        status.textContent = found.length ? `${found.length} found; ${places.length} displayed.` : 'No results found.';
        storePlaces();
    } catch(error) { if (current === requestNumber) status.textContent = error.message; }
});
document.querySelector('#clear')?.addEventListener('click', () => {
    ++requestNumber; places = [];
    if (map) render();
    status.textContent = 'Places cleared.';
    try { localStorage.removeItem(storageKey); }
    catch { status.textContent = 'Map cleared, but browser storage could not be cleared.'; }
});
