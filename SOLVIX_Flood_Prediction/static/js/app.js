/* =================================================================
   AI-Based Flood Prediction & Risk Mapping System
   Frontend JavaScript - Team SOLVIX (SY501)
   ================================================================= */

/* ===== RAIN EFFECT ===== */
(function () {
  var c = document.getElementById('rainContainer');
  if (!c) return;
  for (var i = 0; i < 80; i++) {
    var d = document.createElement('div');
    d.className = 'raindrop';
    d.style.left = Math.random() * 100 + '%';
    d.style.height = (Math.random() * 60 + 30) + 'px';
    d.style.animationDuration = (Math.random() * 1.5 + 0.8) + 's';
    d.style.animationDelay = (Math.random() * 3) + 's';
    d.style.opacity = Math.random() * 0.5 + 0.2;
    c.appendChild(d);
  }
})();

/* ===== NAVBAR ===== */
var navbar = document.getElementById('navbar');
var navLinks = document.getElementById('navLinks');
var navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', function () { navLinks.classList.toggle('open'); });
navLinks.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () { navLinks.classList.remove('open'); });
});
window.addEventListener('scroll', function () {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  var sections = document.querySelectorAll('section[id]');
  var current = '';
  sections.forEach(function (s) { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ===== FADE-UP OBSERVER ===== */
var fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(function (el) { fadeObserver.observe(el); });

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  var target = parseFloat(el.dataset.counter);
  var decimals = parseInt(el.dataset.decimals) || 0;
  var suffix = el.dataset.suffix || '';
  var duration = 1500, start = null;
  var unitHTML = el.querySelector('.dash-card-unit') ? el.querySelector('.dash-card-unit').outerHTML : '';
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    var val = target * ease;
    el.innerHTML = val.toFixed(decimals) + unitHTML + (suffix && !unitHTML ? suffix : '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(function (el) { counterObserver.observe(el); });

/* Animate bar fills */
var barObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { var f = e.target; setTimeout(function () { f.style.width = f.dataset.fill + '%'; }, 200); barObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.dash-card-bar-fill').forEach(function (el) { barObserver.observe(el); });

/* Stats bar counters */
function animateStatNum(el) {
  var target = parseInt(el.dataset.target);
  var suffix = el.dataset.suffix || '';
  var duration = 1800, start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * ease) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
var statObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { animateStatNum(e.target); statObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(function (el) { statObserver.observe(el); });

/* ===== DEMO LOCATIONS (fallback if API fails) ===== */
var demoLocations = [
  { name: 'Pune City Centre', lat: 18.5204, lng: 73.8567, rainfall: 85, floodDepth: 1.2, risk: 'high', riskScore: 68, waterLevel: 8.7, desc: 'High rainfall causing elevated river levels near Mula-Mutha basin.' },
  { name: 'Mumbai Coastal Area', lat: 19.0760, lng: 72.8777, rainfall: 120, floodDepth: 2.1, risk: 'vhigh', riskScore: 85, waterLevel: 11.2, desc: 'Very high risk due to heavy monsoon and low-lying coastal terrain.' },
  { name: 'Chennai Flood Zone', lat: 13.0827, lng: 80.2707, rainfall: 95, floodDepth: 1.5, risk: 'high', riskScore: 72, waterLevel: 9.4, desc: 'Cyclonic rainfall overwhelming urban drainage systems.' },
  { name: 'Kolkata Lowlands', lat: 22.5726, lng: 88.3639, rainfall: 70, floodDepth: 0.8, risk: 'moderate', riskScore: 52, waterLevel: 7.1, desc: 'Moderate risk with elevated Hooghly river levels after sustained rain.' },
  { name: 'Bengaluru Tech Corridor', lat: 12.9716, lng: 77.5946, rainfall: 45, floodDepth: 0.3, risk: 'low', riskScore: 28, waterLevel: 5.2, desc: 'Low risk - moderate rainfall with adequate drainage infrastructure.' },
  { name: 'Guwahati Riverside', lat: 26.1445, lng: 91.7362, rainfall: 110, floodDepth: 1.8, risk: 'vhigh', riskScore: 80, waterLevel: 10.5, desc: 'Brahmaputra swelling above warning level near urban settlements.' },
  { name: 'Hyderabad Core', lat: 17.3850, lng: 78.4867, rainfall: 55, floodDepth: 0.5, risk: 'moderate', riskScore: 45, waterLevel: 6.3, desc: 'Moderate risk due to occasional cloudburst activity.' },
  { name: 'Surat Flood Plains', lat: 21.1702, lng: 72.8311, rainfall: 75, floodDepth: 1.0, risk: 'moderate', riskScore: 55, waterLevel: 8.0, desc: 'Tapi river elevated after upstream releases from Ukai dam.' },
  { name: 'Patna Ganga Banks', lat: 25.5941, lng: 85.1376, rainfall: 100, floodDepth: 1.6, risk: 'high', riskScore: 75, waterLevel: 10.1, desc: 'Ganga flowing above danger mark in multiple ghats.' },
  { name: 'Jaipur Dry Zone', lat: 26.9124, lng: 75.7873, rainfall: 20, floodDepth: 0.1, risk: 'low', riskScore: 15, waterLevel: 3.5, desc: 'Low risk - arid terrain with minimal rainfall activity.' },
];

var demoAlerts = [
  { id: 1, level: 'vhigh', icon: 'fa-house-flood-water', location: 'Mumbai Coastal Area', title: 'Very High Flood Risk Alert', time: '2026-10-09 14:32 IST', desc: 'Very high risk detected due to 120mm rainfall and 2.1m flood depth in low-lying coastal areas. Tide levels compounding flood risk.', action: 'Evacuate low-lying areas immediately' },
  { id: 2, level: 'high', icon: 'fa-water', location: 'Guwahati Riverside', title: 'High Flood Risk Alert', time: '2026-10-09 13:15 IST', desc: 'Brahmaputra river at 10.5m, approaching danger level. 110mm rainfall recorded in last 24 hours. Risk of bank overflow.', action: 'Move to higher ground, avoid riverbanks' },
  { id: 3, level: 'high', icon: 'fa-cloud-rain', location: 'Patna Ganga Banks', title: 'High Flood Risk Alert', time: '2026-10-09 12:45 IST', desc: 'Ganga flowing above warning mark at multiple ghats. 100mm rainfall with 1.6m flood depth in floodplain areas.', action: 'Prepare for evacuation, monitor updates' },
  { id: 4, level: 'moderate', icon: 'fa-droplet', location: 'Kolkata Lowlands', title: 'Moderate Flood Risk Notification', time: '2026-10-09 10:20 IST', desc: 'Hooghly river at 7.1m after sustained rainfall. Urban waterlogging reported in low-lying neighborhoods. 70mm rainfall recorded.', action: 'Avoid waterlogged areas, stay informed' },
  { id: 5, level: 'low', icon: 'fa-sun', location: 'Jaipur Dry Zone', title: 'Low Risk Status', time: '2026-10-09 09:00 IST', desc: 'Conditions normal. Only 20mm rainfall recorded. River levels stable at 3.5m. No flood risk anticipated.', action: 'No action required - standard monitoring' },
];

var demoDatasets = [
  { name: 'Rainfall Records', category: 'Rainfall data', source: 'Sample dataset (demo)', status: 'Current', missing: 'None' },
  { name: 'River Water Levels', category: 'Water-level data', source: 'Sample dataset (demo)', status: 'Current', missing: 'None' },
  { name: 'Flood Depth Estimates', category: 'Flood-depth data', source: 'Sample dataset (demo)', status: 'Current', missing: 'Partial' },
  { name: 'Elevation Models', category: 'Elevation data', source: 'SRTM (public, demo)', status: 'Pending', missing: 'Partial' },
  { name: 'Terrain & GIS Layers', category: 'Terrain/GIS data', source: 'OpenStreetMap (demo)', status: 'Current', missing: 'None' },
  { name: 'Live Sensor Feed', category: 'Real-time data', source: 'Not connected', status: 'Unavailable', missing: 'All' },
];

/* ===== HELPER FUNCTIONS ===== */
function riskColor(r) { return r === 'low' ? '#22c55e' : r === 'moderate' ? '#eab308' : r === 'high' ? '#f97316' : '#ef4444'; }
function riskLabel(r) { return r === 'low' ? 'Low Risk' : r === 'moderate' ? 'Moderate Risk' : r === 'high' ? 'High Risk' : 'Very High Risk'; }

/* ===== FETCH DATA FROM FLASK API (with fallback) ===== */
function fetchLocations() {
  fetch('/api/locations')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.locations) {
        demoLocations = data.locations;
        initMapWithData();
      }
    })
    .catch(function () { initMapWithData(); });
}

function fetchAlerts() {
  fetch('/api/alerts')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.alerts) {
        demoAlerts = data.alerts;
        renderAlerts('all');
        updateAlertCount();
      }
    })
    .catch(function () { renderAlerts('all'); updateAlertCount(); });
}

function fetchDatasets() {
  fetch('/api/datasets')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.datasets) renderDatasets(data.datasets);
    })
    .catch(function () { renderDatasets(demoDatasets); });
}

function renderDatasets(datasets) {
  var tbody = document.getElementById('dataTableBody');
  if (!tbody) return;
  tbody.innerHTML = datasets.map(function (d) {
    var statusClass = d.status === 'Current' ? 'status-ok' : d.status === 'Pending' ? 'status-pending' : 'status-missing';
    var missingClass = d.missing === 'None' ? 'status-ok' : d.missing === 'Partial' ? 'status-pending' : 'status-missing';
    return '<tr><td>' + d.name + '</td><td>' + d.category + '</td><td>' + d.source + '</td>' +
      '<td><span class="status-badge ' + statusClass + '">' + d.status + '</span></td>' +
      '<td><span class="status-badge ' + missingClass + '">' + d.missing + '</span></td></tr>';
  }).join('');
}

/* ===== LEAFLET MAP ===== */
var map, markerLayer, allMarkers = [];

function initMapWithData() {
  if (map) return;
  try {
    map = L.map('floodMap', { zoomControl: true }).setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
    demoLocations.forEach(function (loc) { addMarker(loc); });
    setTimeout(function () { map.invalidateSize(); }, 100);
  } catch (err) {
    document.getElementById('floodMap').style.display = 'none';
    document.getElementById('mapError').style.display = 'block';
  }
}

function addMarker(loc) {
  var color = riskColor(loc.risk);
  var icon = L.divIcon({
    className: 'custom-marker',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:' + color + ';border:2px solid #fff;box-shadow:0 0 10px ' + color + '"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  var m = L.marker([loc.lat, loc.lng], { icon: icon }).addTo(markerLayer);
  m.bindPopup(
    '<div style="font-family:Inter,sans-serif;min-width:180px">' +
    '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;color:#050505">' + loc.name + '</div>' +
    '<div style="display:inline-block;padding:2px 10px;border-radius:100px;font-size:.78rem;font-weight:600;background:' + color + '22;color:' + color + ';margin-bottom:8px">' + riskLabel(loc.risk) + '</div>' +
    '<div style="font-size:.82rem;color:#555;line-height:1.5">' +
    '<div><strong>Rainfall:</strong> ' + loc.rainfall + ' mm</div>' +
    '<div><strong>Flood Depth:</strong> ' + loc.floodDepth + ' m</div>' +
    '<div><strong>Water Level:</strong> ' + loc.waterLevel + ' m</div>' +
    '<div><strong>Risk Score:</strong> ' + loc.riskScore + '/100</div>' +
    '</div>' +
    '<div style="font-size:.8rem;color:#666;margin-top:8px;border-top:1px solid #eee;padding-top:8px">' + loc.desc + '</div>' +
    '<div style="font-size:.72rem;color:#999;margin-top:6px">Sample demonstration location</div>' +
    '</div>'
  );
  allMarkers.push(m);
}

function filterMarkers(filter) {
  markerLayer.clearLayers();
  allMarkers = [];
  demoLocations.forEach(function (loc) {
    if (filter === 'all' || loc.risk === filter) addMarker(loc);
  });
}

document.querySelectorAll('.map-controls .filter-btn[data-filter]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.map-controls .filter-btn[data-filter]').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    filterMarkers(btn.dataset.filter);
  });
});

document.getElementById('mapSearch').addEventListener('input', function () {
  var q = this.value.toLowerCase();
  markerLayer.clearLayers(); allMarkers = [];
  var activeFilter = document.querySelector('.map-controls .filter-btn.active');
  var af = activeFilter ? activeFilter.dataset.filter : 'all';
  demoLocations.forEach(function (loc) {
    if ((af === 'all' || loc.risk === af) && loc.name.toLowerCase().indexOf(q) !== -1) addMarker(loc);
  });
});

document.getElementById('mapReset').addEventListener('click', function () {
  document.getElementById('mapSearch').value = '';
  document.querySelectorAll('.map-controls .filter-btn[data-filter]').forEach(function (b) { b.classList.remove('active'); });
  document.querySelector('.map-controls .filter-btn[data-filter="all"]').classList.add('active');
  filterMarkers('all');
  if (map) { map.setView([20.5937, 78.9629], 5); }
});

/* ===== RISK ASSESSMENT (calls Flask API) ===== */
function validateForm() {
  var fields = [
    { id: 'inLocation', check: function (v) { return v.trim().length >= 2; } },
    { id: 'inRainfall', check: function (v) { return v !== '' && parseFloat(v) >= 0 && parseFloat(v) <= 500; } },
    { id: 'inTemp', check: function (v) { return v !== '' && parseFloat(v) >= -20 && parseFloat(v) <= 60; } },
    { id: 'inHumidity', check: function (v) { return v !== '' && parseFloat(v) >= 0 && parseFloat(v) <= 100; } },
    { id: 'inRiver', check: function (v) { return v !== '' && parseFloat(v) >= 0 && parseFloat(v) <= 50; } },
    { id: 'inFloodDepth', check: function (v) { return v !== '' && parseFloat(v) >= 0 && parseFloat(v) <= 20; } },
    { id: 'inElevation', check: function (v) { return v !== '' && parseFloat(v) >= 0 && parseFloat(v) <= 9000; } },
  ];
  var valid = true;
  fields.forEach(function (f) {
    var el = document.getElementById(f.id);
    var group = el.closest('.form-group');
    if (!f.check(el.value)) { group.classList.add('error'); valid = false; }
    else { group.classList.remove('error'); }
  });
  return valid;
}

document.getElementById('predictBtn').addEventListener('click', function () {
  if (!validateForm()) return;
  var btn = this, spinner = document.getElementById('predictSpinner'), text = document.getElementById('predictText');
  btn.disabled = true; text.style.opacity = 0.5; spinner.style.display = 'inline-block';

  var payload = {
    location: document.getElementById('inLocation').value.trim(),
    rainfall: parseFloat(document.getElementById('inRainfall').value),
    temperature: parseFloat(document.getElementById('inTemp').value),
    humidity: parseFloat(document.getElementById('inHumidity').value),
    river_level: parseFloat(document.getElementById('inRiver').value),
    flood_depth: parseFloat(document.getElementById('inFloodDepth').value),
    elevation: parseFloat(document.getElementById('inElevation').value),
  };

  /* Call Flask backend API */
  fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(function (r) { return r.json(); })
    .then(function (result) {
      if (result.error) {
        alert('Error: ' + result.error);
        return;
      }
      showResult(payload, result);
      updateDashboardRisk(result);
      saveHistory(payload, result);
    })
    .catch(function (err) {
      /* Fallback: calculate client-side if API fails */
      var data = {
        location: payload.location,
        rainfall: payload.rainfall,
        temperature: payload.temperature,
        humidity: payload.humidity,
        river: payload.river_level,
        floodDepth: payload.flood_depth,
        elevation: payload.elevation,
      };
      var r = calculateRiskClient(data);
      showResult(payload, r);
      updateDashboardRisk(r);
      saveHistory(payload, r);
    })
    .finally(function () {
      btn.disabled = false; text.style.opacity = 1; spinner.style.display = 'none';
    });
});

/* Client-side fallback risk calculation */
function calculateRiskClient(d) {
  var score = 0;
  if (d.rainfall > 150) score += 60; else if (d.rainfall > 100) score += 45; else if (d.rainfall > 60) score += 30; else if (d.rainfall > 30) score += 15; else score += 5;
  if (d.humidity > 85) score += 15; else if (d.humidity > 70) score += 10; else if (d.humidity > 50) score += 5;
  if (d.river > 10) score += 20; else if (d.river > 7) score += 15; else if (d.river > 4) score += 8; else score += 2;
  if (d.floodDepth > 2) score += 20; else if (d.floodDepth > 1) score += 15; else if (d.floodDepth > 0.5) score += 8; else score += 3;
  if (d.elevation < 100) score += 15; else if (d.elevation < 300) score += 10; else if (d.elevation < 600) score += 5;
  if (d.temperature > 30 && d.humidity > 80) score += 5; else if (d.temperature > 35) score += 3;

  var category, label, color, barColor;
  if (score >= 75) { category = 'vhigh'; label = 'Very High Risk'; color = 'var(--red)'; barColor = '#ef4444'; }
  else if (score >= 50) { category = 'high'; label = 'High Risk'; color = 'var(--orange)'; barColor = '#f97316'; }
  else if (score >= 30) { category = 'moderate'; label = 'Moderate Risk'; color = 'var(--yellow)'; barColor = '#eab308'; }
  else { category = 'low'; label = 'Low Risk'; color = 'var(--green)'; barColor = '#22c55e'; }

  return {
    score: score, category: category, label: label, color: color, barColor: barColor,
    risk_category: category, risk_label: label, risk_score: score,
    safety_recommendations: getSafetyRecs(category),
  };
}

function getSafetyRecs(cat) {
  var recs = {
    vhigh: ['Evacuate immediately to higher ground', 'Do not attempt to drive through flooded roads', 'Follow official emergency instructions', 'Move to designated relief shelters', 'Keep emergency supplies and documents ready'],
    high: ['Stay alert and monitor weather updates', 'Avoid low-lying areas and riverbanks', 'Prepare for possible evacuation', 'Keep emergency contacts accessible', 'Secure important belongings on upper floors'],
    moderate: ['Stay informed about weather conditions', 'Avoid unnecessary travel during heavy rain', 'Check local drainage and flood barriers', 'Keep emergency kit prepared', 'Monitor river water levels'],
    low: ['Conditions are relatively safe', 'Continue monitoring weather updates', 'Maintain standard preparedness', 'Report any unusual water level changes', 'Keep drainage systems clear'],
  };
  return recs[cat] || recs.low;
}

function showResult(data, r) {
  var score = r.risk_score || r.score;
  var category = r.risk_category || r.category;
  var label = r.risk_label || r.label;
  var recs = r.safety_recommendations || getSafetyRecs(category);
  var color = category === 'low' ? 'var(--green)' : category === 'moderate' ? 'var(--yellow)' : category === 'high' ? 'var(--orange)' : 'var(--red)';
  var barColor = category === 'low' ? '#22c55e' : category === 'moderate' ? '#eab308' : category === 'high' ? '#f97316' : '#ef4444';
  var barWidth = Math.min(score, 100);

  document.getElementById('resultContent').innerHTML =
    '<div class="result-risk-display">' +
    '<div class="result-risk-label">Calculated Risk Category</div>' +
    '<div class="result-risk-level" style="color:' + color + '">' + label + '</div>' +
    '<div class="result-risk-bar"><div class="result-risk-bar-fill" style="width:' + barWidth + '%;background:' + barColor + '"></div></div>' +
    '<div style="font-size:.82rem;color:var(--muted)">Risk Score: ' + score + '/100 (Demonstration)</div>' +
    '</div>' +
    '<div class="result-vals">' +
    '<div class="result-val"><div class="lbl">Location</div><div class="val">' + (data.location || '') + '</div></div>' +
    '<div class="result-val"><div class="lbl">Rainfall</div><div class="val">' + (data.rainfall || 0) + ' mm</div></div>' +
    '<div class="result-val"><div class="lbl">Temperature</div><div class="val">' + (data.temperature || 0) + ' &deg;C</div></div>' +
    '<div class="result-val"><div class="lbl">Humidity</div><div class="val">' + (data.humidity || 0) + '%</div></div>' +
    '<div class="result-val"><div class="lbl">River Level</div><div class="val">' + (data.river_level || data.river || 0) + ' m</div></div>' +
    '<div class="result-val"><div class="lbl">Flood Depth</div><div class="val">' + (data.flood_depth || data.floodDepth || 0) + ' m</div></div>' +
    '<div class="result-val"><div class="lbl">Elevation</div><div class="val">' + (data.elevation || 0) + ' m</div></div>' +
    '<div class="result-val"><div class="lbl">Risk Score</div><div class="val" style="color:' + color + '">' + score + '/100</div></div>' +
    '</div>' +
    '<div class="result-summary"><strong style="color:var(--white)">Summary:</strong> Based on the entered parameters, ' + (data.location || '') + ' has a <strong style="color:' + color + '">' + label.toLowerCase() + '</strong>. The assessment weighted rainfall, river water level, flood depth, elevation, and humidity to compute a demonstration risk score of ' + score + '/100.</div>' +
    '<div class="result-safety"><h4><i class="fa-solid fa-shield-halved" style="color:var(--blue);margin-right:6px"></i> Safety Recommendations</h4><ul>' + recs.map(function (rec) { return '<li>' + rec + '</li>'; }).join('') + '</ul></div>' +
    '<div class="disclaimer" style="margin-top:14px"><i class="fa-solid fa-circle-exclamation"></i> This is a rule-based demonstration assessment, not a trained AI prediction or an official flood warning.</div>';
}

function updateDashboardRisk(r) {
  var category = r.risk_category || r.category;
  var score = r.risk_score || r.score;
  var pill = document.getElementById('dashRiskPill');
  var note = document.getElementById('dashRiskNote');
  var cls = category === 'low' ? 'risk-low' : category === 'moderate' ? 'risk-mod' : category === 'high' ? 'risk-high' : 'risk-vhigh';
  var label = category === 'low' ? 'LOW' : category === 'moderate' ? 'MODERATE' : category === 'high' ? 'HIGH' : 'VERY HIGH';
  var dotColor = category === 'low' ? '#22c55e' : category === 'moderate' ? '#eab308' : category === 'high' ? '#f97316' : '#ef4444';
  pill.className = 'risk-pill ' + cls;
  pill.innerHTML = '<span class="badge-dot" style="background:' + dotColor + ';box-shadow:0 0 8px ' + dotColor + '"></span> ' + label;
  note.textContent = 'Risk score: ' + score + '/100 (from latest assessment)';
}

function saveHistory(data, r) {
  var history = JSON.parse(localStorage.getItem('floodAssessHistory') || '[]');
  history.unshift({
    location: data.location,
    risk: r.risk_label || r.label,
    score: r.risk_score || r.score,
    category: r.risk_category || r.category,
    time: new Date().toLocaleString(),
  });
  if (history.length > 10) history = history.slice(0, 10);
  localStorage.setItem('floodAssessHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  var history = JSON.parse(localStorage.getItem('floodAssessHistory') || '[]');
  var sec = document.getElementById('historySection');
  var list = document.getElementById('historyList');
  if (history.length === 0) { sec.style.display = 'none'; return; }
  sec.style.display = 'block';
  list.innerHTML = history.map(function (h) {
    var cls = h.category === 'low' ? 'risk-low' : h.category === 'moderate' ? 'risk-mod' : h.category === 'high' ? 'risk-high' : 'risk-vhigh';
    return '<div class="history-item"><div><span class="h-loc">' + h.location + '</span> &mdash; <span class="risk-pill ' + cls + '" style="font-size:.72rem">' + h.risk + '</span></div><div class="h-time">' + h.time + ' &middot; ' + h.score + '/100</div></div>';
  }).join('');
}

/* ===== ALERTS ===== */
function renderAlerts(filter) {
  var list = document.getElementById('alertList');
  var dismissed = JSON.parse(localStorage.getItem('dismissedAlerts') || '[]');
  var filtered = filter === 'all' ? demoAlerts : demoAlerts.filter(function (a) { return a.level === filter; });
  if (filtered.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted)"><i class="fa-solid fa-bell-slash" style="font-size:2rem;margin-bottom:12px;opacity:.3"></i><p>No alerts in this category.</p></div>';
    return;
  }
  list.innerHTML = filtered.map(function (a) {
    if (dismissed.indexOf(a.id) !== -1) return '';
    var levelLabel = a.level === 'vhigh' ? 'Very High' : a.level === 'high' ? 'High' : a.level === 'moderate' ? 'Moderate' : 'Low';
    return '<div class="alert-card ' + a.level + '" data-id="' + a.id + '">' +
      '<div class="alert-icon"><i class="fa-solid ' + a.icon + '"></i></div>' +
      '<div class="alert-body">' +
      '<div class="alert-head"><h4>' + a.title + '</h4><span class="alert-pulse"></span><span class="risk-pill risk-' + (a.level === 'vhigh' ? 'vhigh' : a.level) + '">' + levelLabel + ' Risk</span><span class="alert-sim-tag"><i class="fa-solid fa-flask"></i> Simulated</span></div>' +
      '<div class="alert-meta"><i class="fa-solid fa-location-dot"></i> ' + a.location + ' &middot; <i class="fa-regular fa-clock"></i> ' + a.time + '</div>' +
      '<p>' + a.desc + '</p>' +
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="alert-action"><i class="fa-solid fa-shield" style="margin-right:4px;color:var(--blue)"></i> ' + a.action + '</span></div>' +
      '</div>' +
      '<button class="alert-dismiss" data-dismiss="' + a.id + '" aria-label="Dismiss alert"><i class="fa-solid fa-xmark"></i></button>' +
      '</div>';
  }).join('');

  document.querySelectorAll('[data-dismiss]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = parseInt(this.dataset.dismiss);
      var d = JSON.parse(localStorage.getItem('dismissedAlerts') || '[]');
      d.push(id);
      localStorage.setItem('dismissedAlerts', JSON.stringify(d));
      var card = this.closest('.alert-card');
      card.classList.add('dismissed');
      setTimeout(function () { card.style.display = 'none'; updateAlertCount(); }, 400);
    });
  });
}

function updateAlertCount() {
  var dismissed = JSON.parse(localStorage.getItem('dismissedAlerts') || '[]');
  var active = demoAlerts.filter(function (a) { return dismissed.indexOf(a.id) === -1; }).length;
  document.getElementById('dashAlertCount').textContent = active;
}

document.querySelectorAll('[data-alert-filter]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('[data-alert-filter]').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderAlerts(btn.dataset.alertFilter);
  });
});

/* ===== GALLERY ===== */
var galleryImages = [
  { url: 'https://images.pexels.com/photos/8568720/pexels-photo-8568720.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Flooded City Street', caption: 'Cars navigating through flooded urban road' },
  { url: 'https://images.pexels.com/photos/37293704/pexels-photo-37293704.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Heavy Rainfall', caption: 'Intense rain hitting pavement surface' },
  { url: 'https://images.pexels.com/photos/8770486/pexels-photo-8770486.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Overflowing River', caption: 'Aerial view of river flood overwhelming structures' },
  { url: 'https://images.pexels.com/photos/26202091/pexels-photo-26202091.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Urban Waterlogging', caption: 'Flooded street in Kolkata during monsoon' },
  { url: 'https://images.pexels.com/photos/6471927/pexels-photo-6471927.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Flooded Village', caption: 'Aerial view of submerged residential buildings' },
  { url: 'https://images.pexels.com/photos/14562092/pexels-photo-14562092.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Water-Covered Road', caption: 'Flooded road with submerged bridge' },
  { url: 'https://images.pexels.com/photos/4028958/pexels-photo-4028958.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Storm Clouds', caption: 'Dense dark clouds before a major storm' },
  { url: 'https://images.pexels.com/photos/17264716/pexels-photo-17264716.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Night Rain', caption: 'Heavy nighttime rain in an urban area' },
  { url: 'https://images.pexels.com/photos/13865772/pexels-photo-13865772.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Road Closed', caption: 'Flooded street with road closure signs' },
  { url: 'https://images.pexels.com/photos/39457988/pexels-photo-39457988.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Rapid River Flow', caption: 'Muddy river flowing rapidly after heavy rain' },
  { url: 'https://images.pexels.com/photos/24705693/pexels-photo-24705693.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Aerial Flood View', caption: 'Cars navigate flooded street from above' },
  { url: 'https://images.pexels.com/photos/30309542/pexels-photo-30309542.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Monsoon Flooding', caption: 'Motorcyclist rides through waterlogged streets' },
];

function renderGallery() {
  var grid = document.getElementById('galleryGrid');
  grid.innerHTML = galleryImages.map(function (img) {
    return '<div class="gallery-item">' +
      '<img src="' + img.url + '" alt="' + img.title + ' - ' + img.caption + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
      '<div class="gallery-fallback" style="display:none"><i class="fa-solid fa-image"></i></div>' +
      '<div class="gallery-overlay"><h4>' + img.title + '</h4><p>' + img.caption + '</p></div>' +
      '</div>';
  }).join('');
}

/* ===== CHARTS ===== */
var chartFontColor = '#B8B8B8';
var chartGridColor = 'rgba(41,41,41,.5)';

function chartOpts(isBar) {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: isBar ? false : true, labels: { color: chartFontColor } } },
    scales: {
      x: { grid: { color: chartGridColor }, ticks: { color: chartFontColor } },
      y: { grid: { color: chartGridColor }, ticks: { color: chartFontColor }, beginAtZero: true },
    },
  };
}

function initCharts() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.color = chartFontColor;
  Chart.defaults.borderColor = chartGridColor;
  Chart.defaults.font.family = 'Inter, sans-serif';

  new Chart(document.getElementById('chartRainfall').getContext('2d'), {
    type: 'line',
    data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Rainfall (mm)', data: [45, 62, 38, 85, 110, 72, 55], borderColor: '#00BFFF', backgroundColor: 'rgba(0,191,255,.1)', fill: true, tension: 0.4, pointBackgroundColor: '#00E5FF', pointRadius: 5, pointHoverRadius: 8 }] },
    options: chartOpts(),
  });

  new Chart(document.getElementById('chartRiver').getContext('2d'), {
    type: 'line',
    data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Water Level (m)', data: [5.2, 6.1, 6.8, 7.5, 8.7, 9.2, 8.4], borderColor: '#00E5FF', backgroundColor: 'rgba(0,229,255,.1)', fill: true, tension: 0.4, pointBackgroundColor: '#00BFFF', pointRadius: 5, pointHoverRadius: 8 }] },
    options: chartOpts(),
  });

  new Chart(document.getElementById('chartFloodDepth').getContext('2d'), {
    type: 'bar',
    data: { labels: ['Pune', 'Mumbai', 'Chennai', 'Kolkata', 'Bengaluru', 'Guwahati'], datasets: [{ label: 'Flood Depth (m)', data: [1.2, 2.1, 1.5, 0.8, 0.3, 1.8], backgroundColor: ['#00BFFF', '#ef4444', '#f97316', '#eab308', '#22c55e', '#ef4444'], borderRadius: 6 }] },
    options: chartOpts(true),
  });

  new Chart(document.getElementById('chartRiskDist').getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk'], datasets: [{ data: [3, 3, 3, 2], backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444'], borderColor: '#121212', borderWidth: 3 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 16, color: chartFontColor } } } },
  });

  new Chart(document.getElementById('chartLocationRisk').getContext('2d'), {
    type: 'bar',
    data: { labels: demoLocations.map(function (l) { return l.name; }), datasets: [{ label: 'Risk Score (/100)', data: demoLocations.map(function (l) { return l.riskScore; }), backgroundColor: demoLocations.map(function (l) { return riskColor(l.risk); }), borderRadius: 6 }] },
    options: Object.assign({}, chartOpts(true), { indexAxis: 'y' }),
  });
}

/* ===== INITIALIZATION ===== */
renderGallery();
renderHistory();
fetchLocations();
fetchAlerts();
fetchDatasets();
window.addEventListener('load', function () { setTimeout(initCharts, 200); });
