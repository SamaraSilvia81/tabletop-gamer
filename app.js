// ════════════════════════════════════════
//  THEME SYSTEM
// ════════════════════════════════════════
const THEMES = [
  { id: 'prateleira', name: 'Prateleira de Jogos', desc: 'Ivory · Dourado · Verde · Vinho',
    swatches: ['#FFF3D6', '#D9A441', '#4A9B7F', '#8E3542'] },
  { id: 'picnic',     name: 'Retro Picnic', desc: 'Areia · Vermelho · Azul · Amarelo',
    swatches: ['#FAF6EE', '#BB240A', '#322470', '#EDCC4D'] },
  { id: 'retrogame',  name: 'Retro Videogame', desc: 'Mostarda · Coral · Roxo · Verde',
    swatches: ['#FFC567', '#FD5A46', '#552CB7', '#00995E'] },
];

let currentTheme = localStorage.getItem('tt_theme') || 'prateleira';

function applyTheme(id) {
  currentTheme = id;
  document.body.setAttribute('data-theme', id);
  document.getElementById('splash').setAttribute('data-theme', id);
  localStorage.setItem('tt_theme', id);
}

function selectTheme(id, el) {
  SFX.tap();
  applyTheme(id);
  // Update splash grid
  document.querySelectorAll('.theme-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.themeId === id);
  });
}

function buildThemeGrid(containerId, small) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = THEMES.map(t => `
    <div class="theme-card ${t.id === currentTheme ? 'selected' : ''}"
         data-theme-id="${t.id}"
         onclick="selectThemeModal('${t.id}', this)">
      <div class="theme-swatches">
        ${t.swatches.map((s,i) => `<div class="theme-swatch" style="background:${s};${s==='#F5EDD6'||s==='#F0F4F8'||s==='#FAF6EE'||s==='#EAF4F4'||s==='#F9F7F4' ? 'border:1px solid rgba(0,0,0,0.08);' : ''}"></div>`).join('')}
      </div>
      <div class="theme-name">${t.name}</div>
      <div class="theme-desc">${t.desc}</div>
      <div class="theme-check">✓</div>
    </div>`).join('');
}

function selectThemeModal(id, el) {
  selectTheme(id, el);
  document.querySelectorAll('#settings-theme-grid .theme-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.themeId === id);
  });
}

function openThemePicker() {
  navTo('settings');
}

// Apply saved theme on load
applyTheme(currentTheme);

// ════════════════════════════════════════
//  SPLASH
// ════════════════════════════════════════
function enterApp() {
  SFX.confirm();
  const splash = document.getElementById('splash');
  splash.classList.add('hiding');
  setTimeout(() => { splash.style.display = 'none'; }, 500);
}

// ════════════════════════════════════════
//  SOUND ENGINE
// ════════════════════════════════════════
const SFX = (() => {
  let ctx;
  const getCtx = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); return ctx; };
  const play = (freq, type, dur, vol = 0.1) => {
    try {
      const c = getCtx(), o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, c.currentTime);
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur);
    } catch(e) {}
  };
  return {
    tap()     { play(660, 'sine', 0.07, 0.06); },
    confirm() { play(523,'sine',0.12,0.09); setTimeout(()=>play(659,'sine',0.12,0.09),70); setTimeout(()=>play(784,'sine',0.18,0.09),140); },
    win()     { [523,659,784,1047].forEach((n,i) => setTimeout(()=>play(n,'sine',0.3,0.1), i*110)); },
    error()   { play(200, 'square', 0.18, 0.07); },
    click()   { play(520, 'sine', 0.04, 0.04); },
    score()   { play(880, 'sine', 0.09, 0.08); },
    remove()  { play(300, 'sine', 0.14, 0.06); },
  };
})();

// ════════════════════════════════════════
//  STATE
// ════════════════════════════════════════
// Pixel art SVG game icons — colorful, uses theme palette dynamically
// Each icon has a primary color role (filled with theme color at render time)
const PIXEL_ICONS = [
  { id:'dice',    label:'Dado',      color:'primary' },
  { id:'cards',   label:'Cartas',    color:'accent' },
  { id:'trophy',  label:'Troféu',    color:'primary' },
  { id:'crown',   label:'Coroa',     color:'primary' },
  { id:'sword',   label:'Espada',    color:'accent' },
  { id:'shield',  label:'Escudo',    color:'secondary' },
  { id:'star',    label:'Estrela',   color:'primary' },
  { id:'fire',    label:'Fogo',      color:'accent' },
  { id:'gem',     label:'Gema',      color:'info' },
  { id:'moon',    label:'Lua',       color:'purple' },
  { id:'dragon',  label:'Dragão',    color:'accent' },
  { id:'puzzle',  label:'Quebra-cabeça', color:'secondary' },
  { id:'chess',   label:'Xadrez',    color:'info' },
  { id:'target',  label:'Alvo',      color:'accent' },
  { id:'controller', label:'Controle', color:'info' },
  { id:'potion',  label:'Poção',     color:'purple' },
  { id:'coin',    label:'Moeda',     color:'primary' },
  { id:'flag',    label:'Bandeira',  color:'accent' },
  { id:'clover',  label:'Trevo',     color:'secondary' },
  { id:'heart',   label:'Coração',   color:'accent' },
];

// Pixel art SVG paths (shape only — colors applied dynamically)
const ICON_PATHS = {
  dice:       (f,s) => `<rect x="2" y="2" width="12" height="12" rx="2" fill="${f}" /><rect x="2" y="2" width="12" height="12" rx="2" stroke="${s}" stroke-width="1.5" fill="none"/><circle cx="5.5" cy="5.5" r="1.3" fill="${s}"/><circle cx="10.5" cy="5.5" r="1.3" fill="${s}"/><circle cx="8" cy="8" r="1.3" fill="${s}"/><circle cx="5.5" cy="10.5" r="1.3" fill="${s}"/><circle cx="10.5" cy="10.5" r="1.3" fill="${s}"/>`,
  cards:      (f,s) => `<rect x="1" y="3" width="9" height="11" rx="1.5" fill="${s}" opacity="0.3" transform="rotate(-10 5 8)"/><rect x="5" y="1" width="10" height="13" rx="1.5" fill="${f}"/><rect x="5" y="1" width="10" height="13" rx="1.5" stroke="${s}" stroke-width="1.2" fill="none"/><text x="8" y="6.5" font-size="4.5" font-weight="900" fill="${s}" font-family="monospace">A</text><text x="8" y="12.5" font-size="5.5" fill="${s}" font-family="serif" opacity="0.7">♠</text>`,
  trophy:     (f,s) => `<path d="M4 3h8v5c0 2.2-1.8 4-4 4s-4-1.8-4-4V3z" fill="${f}" stroke="${s}" stroke-width="1.2"/><path d="M4 5H2c0 2.2 1 3.2 2 3.5" stroke="${s}" stroke-width="1.2" fill="none"/><path d="M12 5h2c0 2.2-1 3.2-2 3.5" stroke="${s}" stroke-width="1.2" fill="none"/><rect x="7" y="12" width="2" height="2" rx="0.5" fill="${s}"/><rect x="5" y="14" width="6" height="1.2" rx="0.6" fill="${s}"/>`,
  crown:      (f,s) => `<path d="M2 12L1 5l3.5 3L8 2.5l3.5 5.5L15 5l-1 7z" fill="${f}" stroke="${s}" stroke-width="1.2"/><circle cx="8" cy="2.5" r="1.2" fill="${s}"/><circle cx="1" cy="5" r="1" fill="${s}"/><circle cx="15" cy="5" r="1" fill="${s}"/><rect x="2" y="12" width="12" height="2" rx="1" fill="${s}" opacity="0.35"/>`,
  sword:      (f,s) => `<line x1="3" y1="13" x2="12" y2="4" stroke="${s}" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="4" x2="14" y2="2" stroke="${f}" stroke-width="2.5" stroke-linecap="round"/><line x1="5" y1="9.5" x2="9" y2="13" stroke="${s}" stroke-width="1.5" stroke-linecap="round"/><circle cx="14" cy="2" r="1.2" fill="${f}"/>`,
  shield:     (f,s) => `<path d="M8 2L3 4v4c0 3 2.5 5 5 6 2.5-1 5-3 5-6V4z" fill="${f}" stroke="${s}" stroke-width="1.2"/><path d="M8 5v6M6 8h4" stroke="${s}" stroke-width="1.5" stroke-linecap="round"/>`,
  star:       (f,s) => `<path d="M8 1.5l2 4.5 5 0.5-3.7 3.3 1 4.7L8 12l-4.3 2.5 1-4.7L1 6.5 6 6z" fill="${f}" stroke="${s}" stroke-width="1.2"/>`,
  fire:       (f,s) => `<path d="M8 1C6 4 4 6 4 9c0 2.2 1.8 4 4 4s4-1.8 4-4c0-2-1-3.5-2-5-.5 1-1.5 2-2 1.5S8 1 8 1z" fill="${f}" stroke="${s}" stroke-width="1.2"/><path d="M8 7c-1 1.5-1.5 2.5-1.5 3.5 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-1-.5-2-1.5-3.5z" fill="${s}" opacity="0.3"/>`,
  gem:        (f,s) => `<path d="M4 3h8l3 4-7 8-7-8z" fill="${f}" stroke="${s}" stroke-width="1.2"/><path d="M1 7h14" stroke="${s}" stroke-width="0.8" opacity="0.5"/><path d="M4 3l4 12M12 3L8 15" stroke="${s}" stroke-width="0.8" opacity="0.3"/>`,
  moon:       (f,s) => `<path d="M10 2A6 6 0 1 0 10 14 5 5 0 0 1 10 2z" fill="${f}" stroke="${s}" stroke-width="1.2"/>`,
  dragon:     (f,s) => `<path d="M3 13C3 8 5 5 8 4c1-.3 2 0 3 1l2-3c0 2-0.5 3.5-1 4.5.5.5 1 1.5 1 3 0 2-1 3-3 3.5H5" fill="${f}" stroke="${s}" stroke-width="1.2"/><circle cx="10.5" cy="7" r="1" fill="${s}"/>`,
  puzzle:     (f,s) => `<path d="M2 2h5v2a2 2 0 0 1 0 4v2h-5z" fill="${f}" stroke="${s}" stroke-width="1"/><path d="M7 2h5v2h2a2 2 0 0 1 0 4h-2v2h-5" fill="${f}" opacity="0.7" stroke="${s}" stroke-width="1"/><path d="M7 10v4h5v-2a2 2 0 0 1 0-4" stroke="${s}" stroke-width="1" fill="${f}" opacity="0.4"/>`,
  chess:      (f,s) => `<path d="M8 2L6 5h1v3H5l-1 3h8l-1-3H9V5h1z" fill="${f}" stroke="${s}" stroke-width="1.2"/><rect x="4" y="12" width="8" height="2" rx="1" fill="${s}" opacity="0.4" stroke="${s}" stroke-width="0.8"/>`,
  target:     (f,s) => `<circle cx="8" cy="8" r="6" fill="none" stroke="${s}" stroke-width="1.2"/><circle cx="8" cy="8" r="3.5" fill="${f}" stroke="${s}" stroke-width="1"/><circle cx="8" cy="8" r="1.5" fill="${s}"/>`,
  controller: (f,s) => `<path d="M2 7c0-1.5 1-3 3-3h6c2 0 3 1.5 3 3v2c0 2-1 4-3 4h-1l-1-2H7l-1 2H5c-2 0-3-2-3-4z" fill="${f}" stroke="${s}" stroke-width="1.2"/><rect x="4" y="7.5" width="3" height="1" rx="0.5" fill="${s}"/><rect x="5" y="6.5" width="1" height="3" rx="0.5" fill="${s}"/><circle cx="11" cy="7" r="0.9" fill="${s}"/><circle cx="11" cy="9" r="0.9" fill="${s}"/>`,
  potion:     (f,s) => `<rect x="6" y="1.5" width="4" height="3" rx="1" stroke="${s}" stroke-width="1.2" fill="none"/><path d="M6 4.5L4 9.5c-0.5 1.5 0.5 4 4 4s4.5-2.5 4-4L10 4.5z" fill="${f}" stroke="${s}" stroke-width="1.2"/><circle cx="7" cy="11" r="0.9" fill="${s}" opacity="0.4"/><circle cx="9" cy="9" r="0.7" fill="${s}" opacity="0.4"/>`,
  coin:       (f,s) => `<circle cx="8" cy="8" r="6" fill="${f}" stroke="${s}" stroke-width="1.2"/><text x="8" y="11.5" text-anchor="middle" font-size="8" font-weight="900" fill="${s}" opacity="0.5" font-family="monospace">$</text>`,
  flag:       (f,s) => `<line x1="4" y1="2" x2="4" y2="14" stroke="${s}" stroke-width="1.5"/><path d="M4 2.5h8l-2.5 3 2.5 3H4z" fill="${f}" stroke="${s}" stroke-width="1.2"/>`,
  clover:     (f,s) => `<circle cx="8" cy="5.5" r="2.5" fill="${f}" stroke="${s}" stroke-width="0.9"/><circle cx="5.5" cy="8" r="2.5" fill="${f}" stroke="${s}" stroke-width="0.9"/><circle cx="10.5" cy="8" r="2.5" fill="${f}" stroke="${s}" stroke-width="0.9"/><circle cx="8" cy="10.5" r="2.5" fill="${f}" stroke="${s}" stroke-width="0.9"/><line x1="8" y1="11" x2="8" y2="15" stroke="${s}" stroke-width="1.2"/>`,
  heart:      (f,s) => `<path d="M8 14s-6-4-6-8a3 3 0 0 1 6 0 3 3 0 0 1 6 0c0 4-6 8-6 8z" fill="${f}" stroke="${s}" stroke-width="1.2"/>`,
};

// Color palette map: CSS var name → actual hex values per theme
const THEME_COLORS = {
  prateleira: { primary:'#D9A441', secondary:'#4A9B7F', accent:'#8E3542', info:'#3B62B8', purple:'#6846C6', text:'#241A0E' },
  picnic:     { primary:'#BB240A', secondary:'#322470', accent:'#EDCC4D', info:'#5A7A30', purple:'#7A3560', text:'#2A1A08' },
  retrogame:  { primary:'#FD5A46', secondary:'#552CB7', accent:'#FFC567', info:'#00995E', purple:'#552CB7', text:'#1A1208' },
};
const EMOJIS = PIXEL_ICONS.map(p => p.id);

const FONTS = [
  { id: 'playfair',  name: 'Playfair',  css: "'Playfair Display', serif",   preview: 'Aa' },
  { id: 'fredoka',   name: 'Fredoka',   css: "'Fredoka', sans-serif",         preview: 'Aa' },
  { id: 'unbounded', name: 'Unbounded', css: "'Unbounded', sans-serif",       preview: 'Aa' },
  { id: 'syne',      name: 'Syne',      css: "'Syne', sans-serif",            preview: 'Aa' },
  { id: 'mono',      name: 'Mono',      css: "'JetBrains Mono', monospace",   preview: 'Aa' },
  { id: 'pixel',     name: 'Pixel',     css: "'Silkscreen', cursive",         preview: 'Aa' },
];

let state = { games: [], matches: [], currentMatch: null, editingGameId: null };
const LS = 'tabletop_v4';

const load = () => {
  try {
    const d = JSON.parse(localStorage.getItem(LS) || localStorage.getItem('tabletop_v3') || '{}');
    state.games   = d.games   || [];
    state.matches = d.matches || [];
  } catch(e) {}
};

const save = () => localStorage.setItem(LS, JSON.stringify({ games: state.games, matches: state.matches }));

// ════════════════════════════════════════
//  SETUP STATE
// ════════════════════════════════════════
let setup = { emoji:'dice', type:'cartas', scoring:'high', playerCount:2, font:'playfair', wallpaper:'', wpPosX:50, wpPosY:50, wpZoom:100, formulas:[] };

// ════════════════════════════════════════
//  NAV
// ════════════════════════════════════════
function navTo(v) {
  SFX.click();
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === v));
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById(`view-${v}`).classList.add('active');
  document.getElementById('fab-btn').style.display = v === 'library' ? 'grid' : 'none';
  if (v === 'settings') buildThemeGrid('settings-theme-grid');
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function spawnConfetti() {
  const c = document.getElementById('confetti');
  const colors = ['#D4A843','#4A9B8D','#C43B39','#C87533','#6B7B3A','#7B5EA7','#F67234','#60DCC4'];
  c.innerHTML = '';
  for (let i = 0; i < 55; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `left:${Math.random()*100}%;top:-10px;background:${colors[~~(Math.random()*colors.length)]};animation-delay:${Math.random()*0.8}s;animation-duration:${1.5+Math.random()}s;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;
    c.appendChild(p);
  }
  setTimeout(() => c.innerHTML = '', 3200);
}

// ════════════════════════════════════════
//  FONT PICKER
// ════════════════════════════════════════
function initFontGrid() {
  document.getElementById('font-grid').innerHTML = FONTS.map(f => `
    <div class="font-option ${f.id === setup.font ? 'selected' : ''}"
         style="font-family:${f.css}"
         onclick="selectFont('${f.id}', this)">
      <div class="font-preview">${f.preview}</div>
      <div style="font-size:0.65rem;font-family:'DM Sans',sans-serif;">${f.name}</div>
    </div>`).join('');
}

function selectFont(id, el) {
  SFX.tap();
  document.querySelectorAll('.font-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  setup.font = id;
}

function getFontCSS(fontId) {
  return (FONTS.find(f => f.id === fontId) || FONTS[0]).css;
}

// ════════════════════════════════════════
//  WALLPAPER
// ════════════════════════════════════════
function previewWallpaper() {
  const url = document.getElementById('setup-wallpaper').value.trim();
  setup.wallpaper = url;
  applyWallpaperPreview(url);
}

function handleWallpaperFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    setup.wallpaper = ev.target.result;
    document.getElementById('setup-wallpaper').value = '(arquivo local)';
    applyWallpaperPreview(ev.target.result);
  };
  reader.readAsDataURL(file);
}

function applyWallpaperPreview(src) {
  const prev = document.getElementById('wp-preview');
  const controls = document.getElementById('wp-position-controls');
  if (src && src !== '(arquivo local)') {
    const posX = setup.wpPosX ?? 50;
    const posY = setup.wpPosY ?? 50;
    const zoom = setup.wpZoom ?? 100;
    prev.innerHTML = `<img src="${src}" style="object-position:${posX}% ${posY}%;transform:scale(${zoom/100});" onerror="this.parentElement.innerHTML='<div class=wp-label>URL inválida</div>'"><div class="wp-label" style="color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.8);"><i class='ph ph-check'></i> Fundo definido</div>`;
    if (controls) {
      controls.style.display = '';
      document.getElementById('wp-pos-x').value = posX;
      document.getElementById('wp-pos-y').value = posY;
      document.getElementById('wp-zoom').value = zoom;
    }
  } else {
    prev.innerHTML = `<div class="wp-label"><i class="ph ph-image" style="font-size:1.2rem;"></i> Sem imagem</div>`;
    if (controls) controls.style.display = 'none';
  }
}

function updateWpPosition() {
  setup.wpPosX = parseInt(document.getElementById('wp-pos-x').value);
  setup.wpPosY = parseInt(document.getElementById('wp-pos-y').value);
  setup.wpZoom = parseInt(document.getElementById('wp-zoom').value);
  applyWallpaperPreview(setup.wallpaper);
}

// ════════════════════════════════════════
//  SMART RULES / FORMULAS
// ════════════════════════════════════════
function renderFormulaEditor() {
  const ed = document.getElementById('formula-editor');
  if (setup.formulas.length === 0) { ed.innerHTML = ''; return; }
  ed.innerHTML = setup.formulas.map((f, i) => `
    <div class="formula-row">
      <input type="text" class="formula-label-input" placeholder="Nome da regra (ex: Carta preta)" value="${f.label}" oninput="updateFormula(${i},'label',this.value)">
      <input type="number" class="formula-val-input" placeholder="pts" value="${f.value}" oninput="updateFormula(${i},'value',this.value)">
      <button class="del-formula-btn" onclick="removeFormula(${i})">✕</button>
    </div>`).join('');
}

function addFormulaRow() {
  SFX.tap();
  setup.formulas.push({ label: '', value: 0 });
  renderFormulaEditor();
  const inputs = document.querySelectorAll('.formula-label-input');
  if (inputs.length) inputs[inputs.length - 1].focus();
}

function updateFormula(i, key, val) {
  setup.formulas[i][key] = key === 'value' ? (parseInt(val) || 0) : val;
}

function removeFormula(i) {
  SFX.remove();
  setup.formulas.splice(i, 1);
  renderFormulaEditor();
}

// ════════════════════════════════════════
//  SETUP MODAL
// ════════════════════════════════════════
function getIconSVG(id, size) {
  const icon = PIXEL_ICONS.find(p => p.id === id);
  if (!icon) return id; // fallback to raw string (legacy emoji)
  const s = size || 24;
  const pathFn = ICON_PATHS[id];
  if (!pathFn) return id;
  // Get theme colors
  const tc = THEME_COLORS[currentTheme] || THEME_COLORS.prateleira;
  const fillColor = tc[icon.color] || tc.primary;
  const strokeColor = tc.text;
  const svg = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated;">${pathFn(fillColor, strokeColor)}</svg>`;
  return `<span class="pixel-icon" style="width:${s}px;height:${s}px;display:inline-flex;">${svg}</span>`;
}

function initEmojiGrid() {
  document.getElementById('emoji-grid').innerHTML = PIXEL_ICONS.map(p =>
    `<button class="emoji-option${p.id===setup.emoji?' selected':''}" onclick="selEmoji(this,'${p.id}')" title="${p.label}">${getIconSVG(p.id, 22)}</button>`
  ).join('');
}

function selEmoji(el, iconId) {
  SFX.tap();
  document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  setup.emoji = iconId;
}

function selectType(el) {
  SFX.tap();
  document.querySelectorAll('.type-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  setup.type = el.dataset.type;
}

function selectScoring(el) {
  SFX.tap();
  document.querySelectorAll('.scoring-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  setup.scoring = el.dataset.scoring;
}

function changePlayerCount(d) {
  SFX.tap();
  setup.playerCount = Math.max(2, Math.min(10, setup.playerCount + d));
  document.getElementById('player-count-display').textContent = setup.playerCount;
  renderPlayerInputs();
}

function renderPlayerInputs() {
  const c = document.getElementById('player-names');
  const vals = Array.from(c.querySelectorAll('input')).map(i => i.value);
  c.innerHTML = '';
  for (let i = 0; i < setup.playerCount; i++)
    c.innerHTML += `<div class="player-row"><div class="player-badge p-color-${i}">P${i+1}</div><input type="text" class="form-input" placeholder="Jogador ${i+1}" value="${vals[i]||''}"></div>`;
}

function openSetup(gid) {
  state.editingGameId = gid || null;
  if (gid) {
    const g = state.games.find(x => x.id === gid);
    if (g) {
      setup = {
        emoji: g.emoji, type: g.type, scoring: g.scoring,
        playerCount: g.players.length,
        font: g.font || 'playfair',
        wallpaper: g.wallpaper || '',
        wpPosX: g.wpPosX ?? 50, wpPosY: g.wpPosY ?? 50, wpZoom: g.wpZoom ?? 100,
        formulas: JSON.parse(JSON.stringify(g.formulas || []))
      };
      document.getElementById('setup-name').value = g.name;
      document.getElementById('setup-rules').value = g.rules || '';
      document.getElementById('setup-wallpaper').value = g.wallpaper && !g.wallpaper.startsWith('data:') ? g.wallpaper : (g.wallpaper ? '(arquivo local)' : '');
    }
    document.getElementById('setup-modal-title').textContent = 'Editar Jogo';
  } else {
    setup = { emoji:'dice', type:'cartas', scoring:'high', playerCount:2, font:'playfair', wallpaper:'', wpPosX:50, wpPosY:50, wpZoom:100, formulas:[] };
    document.getElementById('setup-name').value = '';
    document.getElementById('setup-rules').value = '';
    document.getElementById('setup-wallpaper').value = '';
    document.getElementById('setup-modal-title').textContent = 'Novo Jogo';
  }
  applyWallpaperPreview(setup.wallpaper);
  initEmojiGrid();
  initFontGrid();
  renderFormulaEditor();
  document.getElementById('player-count-display').textContent = setup.playerCount;
  renderPlayerInputs();
  document.querySelectorAll('.type-option').forEach(el => el.classList.toggle('selected', el.dataset.type === setup.type));
  document.querySelectorAll('.scoring-option').forEach(el => el.classList.toggle('selected', el.dataset.scoring === setup.scoring));
  if (gid) {
    const g = state.games.find(x => x.id === gid);
    if (g) setTimeout(() => {
      const inputs = document.querySelectorAll('#player-names input');
      g.players.forEach((p,i) => { if (inputs[i]) inputs[i].value = p; });
    }, 10);
  }
  SFX.tap();
  document.getElementById('setup-modal').classList.add('active');
}

function closeSetup() {
  document.getElementById('setup-modal').classList.remove('active');
  state.editingGameId = null;
}

function saveGame() {
  const name = document.getElementById('setup-name').value.trim();
  if (!name) { SFX.error(); toast('Dê um nome ao jogo!'); return; }
  const players = Array.from(document.querySelectorAll('#player-names input')).map((inp,i) => inp.value.trim() || `Jogador ${i+1}`);
  const formulaLabels = document.querySelectorAll('.formula-label-input');
  const formulaVals   = document.querySelectorAll('.formula-val-input');
  const formulas = Array.from(formulaLabels).map((el,i) => ({
    label: el.value.trim() || `Regra ${i+1}`,
    value: parseInt(formulaVals[i]?.value) || 0
  })).filter(f => f.label);

  const game = {
    id: state.editingGameId || 'g_'+Date.now(),
    name, emoji: setup.emoji, type: setup.type, scoring: setup.scoring,
    players, rules: document.getElementById('setup-rules').value.trim(),
    font: setup.font,
    wallpaper: setup.wallpaper,
    wpPosX: setup.wpPosX, wpPosY: setup.wpPosY, wpZoom: setup.wpZoom,
    formulas,
    createdAt: new Date().toISOString()
  };

  if (state.editingGameId) {
    const idx = state.games.findIndex(g => g.id === state.editingGameId);
    if (idx !== -1) state.games[idx] = { ...state.games[idx], ...game };
  } else {
    state.games.push(game);
  }
  save(); renderLibrary(); closeSetup(); SFX.confirm();
  toast(state.editingGameId ? 'Jogo atualizado ✓' : 'Jogo criado ✓');
}

// ════════════════════════════════════════
//  LIBRARY
// ════════════════════════════════════════
const TM = { cartas:'Cartas', tabuleiro:'Tabuleiro', dados:'Dados' };

function renderLibrary() {
  const list = document.getElementById('game-list');
  const empty = document.getElementById('empty-library');
  if (!state.games.length) { list.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  list.innerHTML = state.games.map(g => `
    <div class="game-item" onclick="startMatch('${g.id}')">
      <div class="game-item-emoji">${getIconSVG(g.emoji, 28)}</div>
      <div class="game-item-info">
        <div class="game-item-name" style="font-family:${getFontCSS(g.font||'playfair')}">${g.name}</div>
        <div class="game-item-meta">
          <span class="tag">${TM[g.type]}</span>
          <span>${g.players.length} jogadores</span>
          <span>${g.scoring==='high'?'↑ Maior':'↓ Menor'}</span>
          ${g.formulas&&g.formulas.length ? `<span><i class="ph ph-lightning"></i> ${g.formulas.length} regra${g.formulas.length>1?'s':''}</span>` : ''}
        </div>
      </div>
      <div class="game-actions">
        <button class="btn btn-ghost btn-sm" style="padding:6px 9px;" onclick="event.stopPropagation();openSetup('${g.id}')"><i class="ph ph-pencil-simple"></i></button>
        <button class="btn btn-danger btn-sm" style="padding:6px 9px;" onclick="event.stopPropagation();deleteGame('${g.id}')"><i class="ph ph-trash"></i></button>
      </div>
    </div>`).join('');
}

function deleteGame(id) {
  if (!confirm('Excluir este jogo?')) return;
  SFX.remove();
  state.games = state.games.filter(g => g.id !== id);
  save(); renderLibrary();
  toast('Jogo excluído');
}

// ════════════════════════════════════════
//  GAMEPLAY
// ════════════════════════════════════════
function startMatch(gid) {
  const g = state.games.find(x => x.id === gid);
  if (!g) return;
  SFX.confirm();
  state.currentMatch = {
    gameId: g.id, gameName: g.name, emoji: g.emoji, type: g.type,
    scoring: g.scoring, players: [...g.players], rules: g.rules,
    formulas: JSON.parse(JSON.stringify(g.formulas||[])),
    font: g.font || 'playfair',
    wallpaper: g.wallpaper || '',
    wpPosX: g.wpPosX ?? 50, wpPosY: g.wpPosY ?? 50, wpZoom: g.wpZoom ?? 100,
    rounds: [], scores: g.players.map(() => 0),
    startedAt: new Date().toISOString()
  };
  navTo('play');
  renderPlay();
}

function getSorted(m) {
  const arr = m.players.map((name,i) => ({ name, score: m.scores[i], idx: i }));
  arr.sort((a,b) => m.scoring==='high' ? b.score-a.score : a.score-b.score);
  return arr;
}

function renderPlay() {
  const m = state.currentMatch;
  const el = document.getElementById('play-content');
  const empty = document.getElementById('play-empty');
  if (!m) { empty.style.display='block'; el.style.display='none'; return; }
  empty.style.display = 'none';
  el.style.display = 'block';
  const sorted = getSorted(m);
  const fontCSS = getFontCSS(m.font);

  // Smart rules panel
  let smartPanel = '';
  if (m.formulas && m.formulas.length) {
    const playerOpts = m.players.map((p,pi) =>
      `<option value="${pi}">${p.split(' ')[0]}</option>`).join('');
    const chips = m.formulas.map((f,fi) =>
      `<button class="formula-chip" onclick="applyFormula(${fi})">${f.label} <strong>${f.value>0?'+':''}${f.value}</strong></button>`
    ).join('');
    smartPanel = `
      <div class="smart-apply-card">
        <div class="smart-apply-header">
          <div class="smart-apply-dot"></div>
          <span class="smart-apply-title">Regras rápidas</span>
        </div>
        <div style="margin-bottom:10px;">
          <label class="form-label" style="margin-bottom:6px;">Jogador</label>
          <select class="form-input" id="formula-player" style="padding:8px 12px;font-size:0.88rem;">${playerOpts}</select>
        </div>
        <div style="margin: -2px;">${chips}</div>
      </div>`;
  }

  el.innerHTML = `
    <div class="play-hero${m.wallpaper ? ' has-wallpaper' : ''}">
      ${m.wallpaper ? `<div class="play-hero-bg" style="background-image:url('${m.wallpaper}');background-position:${m.wpPosX??50}% ${m.wpPosY??50}%;background-size:${m.wpZoom??100}%;"></div>` : ''}
      <span class="play-emoji">${getIconSVG(m.emoji, 48)}</span>
      <div class="play-name" style="font-family:${fontCSS}">${m.gameName}</div>
      <div class="play-meta">
        <span>${TM[m.type]}</span><span class="dot"></span>
        <span>${m.players.length} jogadores</span><span class="dot"></span>
        <span>${m.scoring==='high'?'↑ Maior':'↓ Menor'}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><i class="ph ph-trophy"></i> Placar</div>
      ${sorted.map((p,rank) => `
        <div class="score-row ${rank===0&&m.rounds.length>0?'leader':''}" id="sr-${p.idx}">
          <span class="score-rank">${rank===0&&m.rounds.length>0?'<i class="ph ph-crown"></i>':rank+1}</span>
          <span class="score-name">${p.name}</span>
          <span class="score-total" id="sv-${p.idx}">${p.score}</span>
        </div>`).join('')}
    </div>

    ${smartPanel}

    <div class="card">
      <div class="round-header">
        <span class="round-title">Nova rodada</span>
        <span class="round-num">R${m.rounds.length+1}</span>
      </div>
      ${m.players.map((name,i) => `
        <div class="round-row" style="flex-wrap:wrap;">
          <div class="player-badge p-color-${i}" style="width:26px;height:26px;font-size:0.6rem;">P${i+1}</div>
          <span class="round-row-name">${name}</span>
          <input type="number" id="ri-${i}" value="0" inputmode="numeric" onfocus="this.select()">
        </div>
        <div style="padding-left:38px;margin-top:-4px;margin-bottom:10px;">
          <input type="text" class="form-input" id="rn-${i}" placeholder="Anotação: ex. trinca de copas, par de reis..." style="font-size:0.75rem;padding:7px 10px;border-radius:8px;">
        </div>`).join('')}
      <button class="btn btn-primary btn-block btn-round mt-12" onclick="confirmRound()"><i class="ph ph-check"></i> Confirmar Rodada</button>
    </div>

    ${m.rounds.length > 0 ? `
      <div class="card">
        <div class="card-title"><i class="ph ph-list-bullets"></i> Histórico de rodadas</div>
        ${m.rounds.map((r,ri) => `
          <div class="history-round" style="flex-direction:column;align-items:stretch;gap:4px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="history-round-label">R${ri+1}</span>
              <div class="history-round-scores">${r.scores.map((s,pi) =>
                `<span class="h-score ${s>0?'pos':s<0?'neg':'zero'}">${m.players[pi].split(' ')[0]}: ${s>0?'+':''}${s}</span>`
              ).join('')}</div>
            </div>
            ${r.notes && r.notes.some(n=>n) ? `<div style="padding-left:30px;font-size:0.68rem;color:var(--text-3);line-height:1.5;">${r.notes.map((n,pi) => n ? `<div><span style="color:var(--text-2);font-weight:600;">${m.players[pi].split(' ')[0]}:</span> ${n}</div>` : '').join('')}</div>` : ''}
          </div>`).join('')}
      </div>` : ''}

    <div class="action-bar">
      ${m.rules||m.formulas?.length ? `<button class="btn btn-ghost btn-sm btn-round" onclick="showRules()"><i class="ph ph-scroll"></i> Regras</button>` : ''}
      <button class="btn btn-danger btn-sm btn-round" style="margin-left:auto;" onclick="endMatch()"><i class="ph ph-stop"></i> Encerrar</button>
    </div>`;
}

function applyFormula(fi) {
  const m = state.currentMatch;
  if (!m) return;
  const f = m.formulas[fi];
  const playerIdx = parseInt(document.getElementById('formula-player')?.value ?? 0);
  m.scores[playerIdx] += f.value;
  const el = document.getElementById(`sv-${playerIdx}`);
  if (el) {
    const p = document.createElement('span');
    p.className = `score-particle ${f.value>=0?'particle-pos':'particle-neg'}`;
    p.textContent = (f.value>0?'+':'')+f.value;
    el.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }
  SFX.score();
  const sorted = getSorted(m);
  const board = document.querySelector('.card');
  if (board) {
    board.innerHTML = `<div class="card-title"><i class="ph ph-trophy"></i> Placar</div>` +
      sorted.map((p,rank) => `
        <div class="score-row ${rank===0&&m.rounds.length>0?'leader':''}" id="sr-${p.idx}">
          <span class="score-rank">${rank===0&&m.rounds.length>0?'<i class="ph ph-crown"></i>':rank+1}</span>
          <span class="score-name">${p.name}</span>
          <span class="score-total" id="sv-${p.idx}">${p.score}</span>
        </div>`).join('');
  }
  toast(`${f.label}: ${f.value>0?'+':''}${f.value} pts → ${m.players[playerIdx].split(' ')[0]}`);
}

function confirmRound() {
  const m = state.currentMatch;
  if (!m) return;
  const scores = m.players.map((_,i) => parseInt(document.getElementById(`ri-${i}`)?.value)||0);
  const notes = m.players.map((_,i) => document.getElementById(`rn-${i}`)?.value?.trim()||'');
  // Store round as object with scores + notes
  m.rounds.push({ scores, notes });
  scores.forEach((s,i) => m.scores[i] += s);
  SFX.score();
  scores.forEach((s,i) => {
    if (s !== 0) {
      const el = document.getElementById(`sv-${i}`);
      if (el) {
        const p = document.createElement('span');
        p.className = `score-particle ${s>0?'particle-pos':'particle-neg'}`;
        p.textContent = (s>0?'+':'')+s;
        el.appendChild(p);
        setTimeout(() => p.remove(), 1100);
      }
    }
  });
  setTimeout(() => { renderPlay(); toast(`Rodada ${m.rounds.length} confirmada`); }, 380);
}

function endMatch() {
  const m = state.currentMatch;
  if (!m) return;
  if (m.rounds.length === 0 && !confirm('Nenhuma rodada registrada. Encerrar assim mesmo?')) return;
  const sorted = getSorted(m);
  const match = {
    id: 'm_'+Date.now(), gameId: m.gameId, gameName: m.gameName, emoji: m.emoji,
    type: m.type, scoring: m.scoring, players: [...m.players],
    rounds: [...m.rounds], finalScores: [...m.scores], winner: sorted[0],
    startedAt: m.startedAt, endedAt: new Date().toISOString(),
    rules: m.rules, formulas: m.formulas||[],
    font: m.font, wallpaper: m.wallpaper
  };
  state.matches.unshift(match);
  state.currentMatch = null;
  save();
  if (match.rounds.length > 0) { SFX.win(); spawnConfetti(); showWinner(match); }
  else { navTo('history'); renderPlay(); renderHistory(); }
}

function showWinner(match) {
  const el = document.getElementById('play-content');
  const sorted = match.players.map((n,i) => ({ name:n, score:match.finalScores[i] }));
  sorted.sort((a,b) => match.scoring==='high' ? b.score-a.score : a.score-b.score);
  const fontCSS = getFontCSS(match.font);
  el.innerHTML = `
    <div class="winner-screen">
      <span class="winner-trophy"><i class="ph ph-trophy" style="font-size:4rem;"></i></span>
      <div class="winner-eyebrow">Vencedor</div>
      <div class="winner-name" style="font-family:${fontCSS}">${match.winner.name}</div>
      <div class="winner-pts">${match.winner.score} pts</div>
    </div>
    <div class="card">
      <div class="card-title">📊 Resultado Final</div>
      ${sorted.map((p,i) => `
        <div class="score-row ${i===0?'leader':''}">
          <span class="score-rank">${i===0?'<i class="ph ph-crown"></i>':i+1}</span>
          <span class="score-name">${p.name}</span>
          <span class="score-total">${p.score}</span>
        </div>`).join('')}
    </div>
    <div class="action-bar" style="justify-content:center;">
      <button class="btn btn-ghost btn-round" onclick="navTo('library');renderPlay();">← Jogos</button>
      <button class="btn btn-primary btn-round" onclick="navTo('history');renderHistory();renderPlay();">Histórico →</button>
    </div>`;
}

function showRules() {
  const m = state.currentMatch;
  if (!m) return;
  const fd = document.getElementById('rules-formula-display');
  if (m.formulas && m.formulas.length) {
    fd.innerHTML = `
      <div class="card" style="margin-bottom:12px;border-color:var(--secondary);">
        <div class="card-title"><i class="ph ph-lightning"></i> Regras de pontuação</div>
        ${m.formulas.map(f => `
          <div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border);">
            <span style="font-size:0.85rem;color:var(--text-2);">${f.label}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${f.value>=0?'var(--secondary)':'var(--accent)'};">${f.value>0?'+':''}${f.value}</span>
          </div>`).join('')}
      </div>`;
  } else {
    fd.innerHTML = '';
  }
  const rc = document.getElementById('rules-modal-content');
  rc.textContent = m.rules || '';
  rc.style.display = m.rules ? '' : 'none';
  document.getElementById('rules-modal').classList.add('active');
}
function closeRulesModal() { document.getElementById('rules-modal').classList.remove('active'); }

// ════════════════════════════════════════
//  HISTORY
// ════════════════════════════════════════
function renderHistory() {
  const list = document.getElementById('history-list');
  const empty = document.getElementById('empty-history');
  if (!state.matches.length) { list.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  list.innerHTML = state.matches.map(m => {
    const dt = new Date(m.endedAt).toLocaleDateString('pt-BR', {
      day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
    const sorted = m.players.map((n,i) => ({ name:n, score:m.finalScores[i] }));
    sorted.sort((a,b) => m.scoring==='high' ? b.score-a.score : a.score-b.score);
    const fontCSS = getFontCSS(m.font||'playfair');
    return `
      <div class="match-card" onclick="showDetail('${m.id}')">
        <div class="match-top">
          <div class="match-icon">${getIconSVG(m.emoji, 22)}</div>
          <div class="match-info">
            <div class="match-name" style="font-family:${fontCSS}">${m.gameName}</div>
            <div class="match-date">${dt} · ${m.rounds.length} rodadas</div>
          </div>
        </div>
        <div class="match-podium">${sorted.map((p,i) =>
          `<span class="podium-chip">${i===0?'<i class="ph ph-crown"></i> ':''}${p.name.split(' ')[0]} <span class="p-score">${p.score}</span></span>`
        ).join('')}</div>
        <div class="match-footer">
          <button class="btn btn-ghost btn-sm btn-round" onclick="event.stopPropagation();replay('${m.id}')"><i class="ph ph-arrow-counter-clockwise"></i> Jogar de novo</button>
          <button class="btn btn-danger btn-sm btn-round" onclick="event.stopPropagation();delMatch('${m.id}')"><i class="ph ph-trash"></i></button>
        </div>
      </div>`;
  }).join('');
}

function showDetail(id) {
  const m = state.matches.find(x => x.id === id);
  if (!m) return;
  SFX.tap();
  const sorted = m.players.map((n,i) => ({ name:n, score:m.finalScores[i] }));
  sorted.sort((a,b) => m.scoring==='high' ? b.score-a.score : a.score-b.score);
  const fontCSS = getFontCSS(m.font||'playfair');
  document.getElementById('detail-content').innerHTML = `
    <div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:2.5rem;margin-bottom:6px;">${getIconSVG(m.emoji, 42)}</div>
      <div style="font-family:${fontCSS};font-size:1.35rem;font-weight:800;color:var(--text);">${m.gameName}</div>
      <div style="font-size:0.7rem;color:var(--text-3);margin-top:4px;">${new Date(m.endedAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})} · ${m.rounds.length} rodadas</div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ph ph-trophy"></i> Classificação</div>
      ${sorted.map((p,i) => `
        <div class="score-row ${i===0?'leader':''}" style="margin-bottom:5px;">
          <span class="score-rank">${i===0?'<i class="ph ph-crown"></i>':i+1}</span>
          <span class="score-name">${p.name}</span>
          <span class="score-total">${p.score}</span>
        </div>`).join('')}
    </div>
    ${m.rounds.length>0 ? `
      <div class="card">
        <div class="card-title"><i class="ph ph-list-bullets"></i> Rodadas</div>
        ${m.rounds.map((r,ri) => {
          const scores = Array.isArray(r) ? r : r.scores;
          const notes = Array.isArray(r) ? null : r.notes;
          return `
          <div class="history-round" style="flex-direction:column;align-items:stretch;gap:3px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <span class="history-round-label">R${ri+1}</span>
              <div class="history-round-scores">${scores.map((s,pi) =>
                `<span class="h-score ${s>0?'pos':s<0?'neg':'zero'}">${m.players[pi].split(' ')[0]}: ${s>0?'+':''}${s}</span>`
              ).join('')}</div>
            </div>
            ${notes && notes.some(n=>n) ? `<div style="padding-left:30px;font-size:0.68rem;color:var(--text-3);line-height:1.5;">${notes.map((n,pi) => n ? `<div><span style="color:var(--text-2);font-weight:600;">${m.players[pi].split(' ')[0]}:</span> ${n}</div>` : '').join('')}</div>` : ''}
          </div>`;
        }).join('')}
      </div>` : ''}
    ${m.formulas&&m.formulas.length ? `
      <div class="card" style="border-color:var(--secondary);">
        <div class="card-title"><i class="ph ph-lightning"></i> Regras usadas</div>
        ${m.formulas.map(f => `
          <div class="flex-between" style="padding:6px 0;border-bottom:1px solid var(--border);font-size:0.82rem;">
            <span style="color:var(--text-2);">${f.label}</span>
            <span style="font-family:'JetBrains Mono',monospace;color:${f.value>=0?'var(--secondary)':'var(--accent)'};">${f.value>0?'+':''}${f.value}</span>
          </div>`).join('')}
      </div>` : ''}
    ${m.rules ? `
      <div class="card">
        <div class="card-title"><i class="ph ph-scroll"></i> Regras</div>
        <div class="rules-box">${m.rules}</div>
      </div>` : ''}`;
  document.getElementById('detail-modal').classList.add('active');
}

function closeDetail() { document.getElementById('detail-modal').classList.remove('active'); }
function delMatch(id) {
  if (!confirm('Excluir partida?')) return;
  SFX.remove();
  state.matches = state.matches.filter(m => m.id !== id);
  save(); renderHistory();
  toast('Partida excluída');
}
function replay(id) {
  const m = state.matches.find(x => x.id === id);
  if (!m) return;
  const g = state.games.find(x => x.id === m.gameId);
  if (g) startMatch(g.id);
  else toast('Jogo não encontrado');
}

// ════════════════════════════════════════
//  MUSIC PLAYER
// ════════════════════════════════════════
let musicPlaying = false;

function openMusicModal() { document.getElementById('music-modal').classList.add('active'); }
function closeMusicModal(e) {
  if (e.target === document.getElementById('music-modal'))
    document.getElementById('music-modal').classList.remove('active');
}

function ytVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0];
    return u.searchParams.get('v') || '';
  } catch { return ''; }
}

function loadMusic() {
  const url = document.getElementById('music-url-input').value.trim();
  if (!url) { toast('Cole uma URL do YouTube'); return; }
  const vid = ytVideoId(url);
  if (!vid) { toast('URL inválida — use youtube.com ou youtu.be'); return; }
  const frame = document.getElementById('yt-frame');
  const container = document.getElementById('yt-container');
  // Lives 24/7 quebram com loop+playlist (o YouTube tenta achar uma "gravação"
  // da live que não existe). Só aplicamos loop em vídeos normais.
  frame.src = `https://www.youtube.com/embed/${vid}?autoplay=1&controls=1&loop=0`;
  container.style.display = 'block';
  musicPlaying = true;
  document.getElementById('music-toggle-btn').classList.add('playing');
  document.getElementById('music-status').textContent = 'Tocando...';
  toast('Música iniciada');
}

function setPreset(url) {
  document.getElementById('music-url-input').value = url;
  loadMusic();
}

function stopMusic() {
  document.getElementById('yt-frame').src = '';
  document.getElementById('yt-container').style.display = 'none';
  musicPlaying = false;
  document.getElementById('music-toggle-btn').classList.remove('playing');
  document.getElementById('music-status').textContent = '';
  document.getElementById('music-modal').classList.remove('active');
  toast('Música pausada');
}

// ════════════════════════════════════════
//  SUPABASE CLIENT
// ════════════════════════════════════════
const SUPABASE_URL = 'https://obnxqnllrrkoznxxnwkh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnhxbmxscnJrb3pueHhud2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzIwMzIsImV4cCI6MjA5OTU0ODAzMn0.Yy94y6YVXnHYMbunney-hCCp5NbYtNTozaLKuCnXUrQ';
let sb = null;
try {
  // CDN v2 exposes window.supabase.createClient
  const mod = window.supabase;
  if (mod && mod.createClient) {
    sb = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase lib not found on window.supabase');
  }
} catch(e) { console.warn('Supabase init failed:', e); }

// ════════════════════════════════════════
//  AUTH: Google OAuth + Email/Password
// ════════════════════════════════════════
async function loginWithGoogle() {
  if (!sb) { toast('Supabase não disponível'); return; }
  try {
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    if (error) { SFX.error(); toast('Erro: ' + error.message); }
  } catch(e) { SFX.error(); toast('Falha na conexão'); }
}

async function authAction(action) {
  const email = document.getElementById('auth-email')?.value?.trim();
  const pass  = document.getElementById('auth-password')?.value?.trim();

  if (!sb) { toast('Supabase não disponível'); return; }

  if (action === 'login') {
    if (!email || !pass) { SFX.error(); toast('Preencha e-mail e senha'); return; }
    const { error } = await sb.auth.signInWithPassword({ email, password: pass });
    if (error) { SFX.error(); toast('Erro: ' + error.message); }
    else { SFX.confirm(); toast('Login realizado!'); updateAuthUI(); }
  }

  if (action === 'signup') {
    if (!email || !pass) { SFX.error(); toast('Preencha e-mail e senha'); return; }
    if (pass.length < 6) { SFX.error(); toast('Senha precisa de pelo menos 6 caracteres'); return; }
    const { error } = await sb.auth.signUp({ email, password: pass });
    if (error) { SFX.error(); toast('Erro: ' + error.message); }
    else { SFX.confirm(); toast('Conta criada! Verifique seu e-mail.'); }
  }

  if (action === 'logout') {
    await sb.auth.signOut();
    SFX.tap(); toast('Desconectado');
    updateAuthUI();
  }
}

async function updateAuthUI() {
  if (!sb) return;
  const { data: { session } } = await sb.auth.getSession();
  const loggedDiv = document.getElementById('auth-logged');
  const contentDiv = document.getElementById('auth-content');
  if (!loggedDiv || !contentDiv) return;

  if (session?.user) {
    contentDiv.style.display = 'none';
    loggedDiv.style.display = '';
    const user = session.user;
    const emailEl = document.getElementById('auth-user-email');
    const avatarEl = document.getElementById('auth-avatar');
    if (emailEl) emailEl.textContent = user.email || user.user_metadata?.full_name || 'Usuário';
    if (avatarEl && user.user_metadata?.avatar_url) {
      avatarEl.innerHTML = `<img src="${user.user_metadata.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`;
    }
  } else {
    contentDiv.style.display = '';
    loggedDiv.style.display = 'none';
  }
}

// Listen for auth state changes (handles redirect from Google OAuth)
if (sb) {
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      updateAuthUI();
      toast('Login realizado!');
    }
    if (event === 'SIGNED_OUT') {
      updateAuthUI();
    }
  });
  // Check session on load
  updateAuthUI();
}

// ════════════════════════════════════════
//  SETTINGS: GRAIN TOGGLE
// ════════════════════════════════════════
let grainEnabled = localStorage.getItem('tt_grain') !== 'off';
function toggleGrain(on) {
  grainEnabled = on;
  localStorage.setItem('tt_grain', on ? 'on' : 'off');
  document.body.classList.toggle('no-grain', !on);
}
// Apply saved grain setting
if (!grainEnabled) {
  document.body.classList.add('no-grain');
  setTimeout(() => { const g = document.getElementById('grain-toggle'); if(g) g.checked = false; }, 0);
}

// ════════════════════════════════════════
//  SETTINGS: DATA EXPORT / CLEAR
// ════════════════════════════════════════
function exportData() {
  const data = JSON.stringify({ games: state.games, matches: state.matches }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `tabletop-backup-${Date.now()}.json`;
  a.click(); URL.revokeObjectURL(url);
  toast('Dados exportados');
}

function clearAllData() {
  if (!confirm('Limpar TODOS os jogos e partidas? Esta ação é irreversível.')) return;
  state.games = []; state.matches = []; state.currentMatch = null;
  save(); renderLibrary(); renderHistory(); renderPlay();
  SFX.remove(); toast('Dados limpos');
}

// ════════════════════════════════════════
//  MATCH TIMER
// ════════════════════════════════════════
let timerInterval = null;
let timerSeconds = 0;
let timerLimit = 0; // 0 = no limit, just count up

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
    if (timerLimit > 0 && timerSeconds >= timerLimit) {
      clearInterval(timerInterval);
      timerInterval = null;
      SFX.win();
      toast('Tempo esgotado!');
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  if (!el) return;
  const h = Math.floor(timerSeconds / 3600);
  const m = Math.floor((timerSeconds % 3600) / 60);
  const s = timerSeconds % 60;
  el.textContent = h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  if (timerLimit > 0) {
    const remaining = timerLimit - timerSeconds;
    const el2 = document.getElementById('timer-remaining');
    if (el2 && remaining > 0) {
      const rm = Math.floor(remaining / 60);
      const rs = remaining % 60;
      el2.textContent = `resta ${rm}:${String(rs).padStart(2,'0')}`;
    }
  }
}

function setTimerLimit() {
  const mins = parseInt(prompt('Tempo limite em minutos (0 = sem limite):'));
  if (isNaN(mins) || mins < 0) return;
  timerLimit = mins * 60;
  timerSeconds = 0;
  updateTimerDisplay();
  toast(mins > 0 ? `Limite: ${mins} minutos` : 'Sem limite de tempo');
}

// ════════════════════════════════════════
//  GAME TEMPLATES (jogos prontos)
// ════════════════════════════════════════
const GAME_TEMPLATES = [
  {
    name: 'Truco',
    emoji: 'cards',
    type: 'cartas',
    scoring: 'high',
    players: ['Dupla 1', 'Dupla 2'],
    font: 'fredoka',
    rules: 'Jogo de truco paulista. Ganha quem fizer 12 pontos primeiro. Truco vale 3, seis vale 6, nove vale 9, doze vale 12. Manilhas: ♦ > ♠ > ♥ > ♣.',
    formulas: [
      { label: 'Rodada normal', value: 1 },
      { label: 'Truco aceito', value: 3 },
      { label: 'Seis aceito', value: 6 },
      { label: 'Nove aceito', value: 9 },
      { label: 'Doze aceito', value: 12 },
    ]
  },
  {
    name: 'UNO',
    emoji: 'cards',
    type: 'cartas',
    scoring: 'low',
    players: ['Jogador 1', 'Jogador 2', 'Jogador 3'],
    font: 'unbounded',
    rules: 'Quem ficar sem cartas primeiro grita UNO e vence a rodada. Pontos são contados pelas cartas restantes na mão dos outros jogadores. Cartas numéricas = valor da face. Bloqueio/Inverter/+2 = 20pts. Coringa/+4 = 50pts.',
    formulas: [
      { label: 'Carta numérica (valor)', value: 1 },
      { label: 'Bloqueio / Inverter / +2', value: 20 },
      { label: 'Coringa / +4', value: 50 },
    ]
  },
  {
    name: 'Catan',
    emoji: 'dice',
    type: 'tabuleiro',
    scoring: 'high',
    players: ['Jogador 1', 'Jogador 2', 'Jogador 3'],
    font: 'playfair',
    rules: 'Primeiro a 10 pontos de vitória vence. Pontos: 1 por cidade pequena, 2 por cidade grande, 2 para estrada mais longa (mín 5), 2 para maior exército (mín 3 cavaleiros), 1 por carta de ponto de vitória.',
    formulas: [
      { label: 'Vila', value: 1 },
      { label: 'Cidade', value: 2 },
      { label: 'Estrada mais longa', value: 2 },
      { label: 'Maior exército', value: 2 },
      { label: 'Carta de PV', value: 1 },
    ]
  },
  {
    name: 'Buraco',
    emoji: 'cards',
    type: 'cartas',
    scoring: 'high',
    players: ['Dupla 1', 'Dupla 2'],
    font: 'playfair',
    rules: 'Jogo de canastra/buraco. Forme sequências e trincas. Ganha quem bater primeiro. Buraco limpo (sem coringa) vale mais. Objetivo: 3000 pontos.',
    formulas: [
      { label: 'Trinca/sequência (mesma cor)', value: 3 },
      { label: 'Trinca/sequência (cores diferentes)', value: 5 },
      { label: 'Sequência de mesma cor', value: 5 },
      { label: 'Buraco limpo', value: 200 },
      { label: 'Buraco sujo', value: 100 },
      { label: 'Batida simples', value: 100 },
      { label: 'Batida direta', value: 200 },
      { label: 'Carta especial (10pts)', value: 10 },
    ]
  },
  {
    name: 'Rummikub',
    emoji: 'puzzle',
    type: 'tabuleiro',
    scoring: 'high',
    players: ['Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4'],
    font: 'fredoka',
    rules: 'Forme grupos (mesma número, cores diferentes) ou sequências (mesma cor, números consecutivos) de no mínimo 3 peças. Quem esvaziar a mão primeiro vence. Pontos das peças restantes dos outros são somados ao vencedor.',
    formulas: [
      { label: 'Mesma cor, números diferentes', value: 3 },
      { label: 'Cores diferentes, mesmo número', value: 8 },
      { label: 'Mesma cor, sequência', value: 5 },
      { label: 'Carta especial (coringa)', value: 10 },
    ]
  },
  {
    name: 'War',
    emoji: 'flag',
    type: 'tabuleiro',
    scoring: 'high',
    players: ['Jogador 1', 'Jogador 2', 'Jogador 3'],
    font: 'syne',
    rules: 'Conquiste territórios e cumpra seu objetivo secreto. Cada turno: receba exércitos, ataque territórios vizinhos e mova tropas.',
    formulas: [
      { label: 'Território conquistado', value: 1 },
      { label: 'Continente completo', value: 5 },
      { label: 'Objetivo cumprido (vitória)', value: 50 },
    ]
  },
  {
    name: 'Dominó',
    emoji: 'dice',
    type: 'tabuleiro',
    scoring: 'low',
    players: ['Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4'],
    font: 'mono',
    rules: 'Distribua 7 pedras para cada. Jogue pedras com pontas iguais. Quem ficar sem pedras primeiro vence. Se trancar, vence quem tiver menor soma.',
    formulas: [
      { label: 'Batida normal', value: -1 },
      { label: 'Batida de carroça', value: -2 },
      { label: 'Lá e cá', value: -3 },
      { label: 'Cruzada', value: -5 },
    ]
  },
  {
    name: 'Jogo Personalizado',
    emoji: 'star',
    type: 'cartas',
    scoring: 'high',
    players: ['Jogador 1', 'Jogador 2'],
    font: 'playfair',
    rules: '',
    formulas: []
  },
];

function openTemplates() {
  const modal = document.getElementById('templates-modal');
  const list = document.getElementById('templates-list');
  list.innerHTML = GAME_TEMPLATES.map((t, i) => `
    <div class="game-item" onclick="useTemplate(${i})" style="cursor:pointer;">
      <div class="game-item-emoji">${getIconSVG(t.emoji, 28)}</div>
      <div class="game-item-info">
        <div class="game-item-name">${t.name}</div>
        <div class="game-item-meta">
          <span class="tag">${TM[t.type]}</span>
          <span>${t.players.length} jogadores</span>
          ${t.formulas.length ? `<span><i class="ph ph-lightning"></i> ${t.formulas.length} regras</span>` : ''}
        </div>
      </div>
      <div style="color:var(--primary);font-size:1rem;"><i class="ph ph-plus-circle"></i></div>
    </div>`).join('');
  modal.classList.add('active');
}

function closeTemplates() {
  document.getElementById('templates-modal').classList.remove('active');
}

function useTemplate(i) {
  const t = GAME_TEMPLATES[i];
  closeTemplates();
  state.editingGameId = null;
  setup = {
    emoji: t.emoji, type: t.type, scoring: t.scoring,
    playerCount: t.players.length,
    font: t.font || 'playfair',
    wallpaper: '', wpPosX:50, wpPosY:50, wpZoom:100,
    formulas: JSON.parse(JSON.stringify(t.formulas || []))
  };
  document.getElementById('setup-name').value = t.name === 'Jogo Personalizado' ? '' : t.name;
  document.getElementById('setup-rules').value = t.rules || '';
  document.getElementById('setup-wallpaper').value = '';
  document.getElementById('setup-modal-title').textContent = 'Novo Jogo';
  applyWallpaperPreview('');
  initEmojiGrid();
  initFontGrid();
  renderFormulaEditor();
  document.getElementById('player-count-display').textContent = setup.playerCount;
  renderPlayerInputs();
  setTimeout(() => {
    const inputs = document.querySelectorAll('#player-names input');
    t.players.forEach((p,idx) => { if (inputs[idx]) inputs[idx].value = p; });
  }, 10);
  document.querySelectorAll('.type-option').forEach(el => el.classList.toggle('selected', el.dataset.type === setup.type));
  document.querySelectorAll('.scoring-option').forEach(el => el.classList.toggle('selected', el.dataset.scoring === setup.scoring));
  SFX.tap();
  document.getElementById('setup-modal').classList.add('active');
}

// ════════════════════════════════════════
//  INIT
// ════════════════════════════════════════
load();
renderLibrary();
renderHistory();
renderPlay();