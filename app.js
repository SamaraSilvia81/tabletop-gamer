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
  document.querySelectorAll('.theme-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.themeId === id);
  });
}

function buildThemeGrid(containerId) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = THEMES.map(t => `
    <div class="theme-card ${t.id === currentTheme ? 'selected' : ''}"
         data-theme-id="${t.id}"
         onclick="selectThemeModal('${t.id}', this)">
      <div class="theme-swatches">
        ${t.swatches.map(s => `<div class="theme-swatch" style="background:${s};border:1px solid rgba(0,0,0,0.08);"></div>`).join('')}
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

applyTheme(currentTheme);

function enterApp() {
  SFX.confirm();
  const splash = document.getElementById('splash');
  splash.classList.add('hiding');
  setTimeout(() => { splash.style.display = 'none'; }, 500);
}

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

const AVATAR_COLORS = ['#D9A441','#4A9B7F','#8E3542','#3B62B8','#6846C6','#BB240A','#322470','#EDCC4D','#FD5A46','#552CB7','#00995E','#FFC567'];

function getAvatarColor(name) {
  if (!name) return '#D9A441';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const THEME_COLORS = {
  prateleira: { primary:'#D9A441', secondary:'#4A9B7F', accent:'#8E3542', info:'#3B62B8', purple:'#6846C6', text:'#241A0E' },
  picnic:     { primary:'#BB240A', secondary:'#322470', accent:'#EDCC4D', info:'#5A7A30', purple:'#7A3560', text:'#2A1A08' },
  retrogame:  { primary:'#FD5A46', secondary:'#552CB7', accent:'#FFC567', info:'#00995E', purple:'#552CB7', text:'#1A1208' },
};

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

const save = () => {
  try {
    localStorage.setItem(LS, JSON.stringify({ games: state.games, matches: state.matches }));
    return true;
  } catch (e) {
    console.error('Falha ao salvar:', e);
    toast('Armazenamento cheio! Use imagens menores ou apague partidas antigas.');
    return false;
  }
};

let setup = { emoji:'dice', type:'cartas', scoring:'high', playerCount:2, font:'playfair', wallpaper:'', wpPosX:50, wpPosY:50, wpZoom:100, formulas:[] };

function navTo(v) {
  SFX.click();
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === v));
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById(`view-${v}`).classList.add('active');
  document.getElementById('fab-btn').style.display = v === 'library' ? 'grid' : 'none';
  if (v === 'settings') { buildThemeGrid('settings-theme-grid'); renderProfile(); }
  window.location.hash = v;
}

let _toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  // Cancela timer anterior para evitar conflito de timeouts
  if (_toastTimer) { clearTimeout(_toastTimer); _toastTimer = null; }
  // Remove classe primeiro, espera repaint, depois re-adiciona — garante re-trigger da animação
  el.classList.remove('show');
  el.textContent = msg;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('show');
      _toastTimer = setTimeout(() => {
        el.classList.remove('show');
        _toastTimer = null;
      }, 2200);
    });
  });
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

function previewWallpaper() {
  const url = document.getElementById('setup-wallpaper').value.trim();
  setup.wallpaper = url;
  applyWallpaperPreview(url);
}

function handleWallpaperFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById('wp-preview');
  preview.innerHTML = `<div class="wp-label" style="color:var(--text-2);">⏳ Processando...</div>`;
  const saveBtn = document.querySelector('.modal-save');
  if (saveBtn) saveBtn.disabled = true;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const MAX_W = 1280;
      const scale = Math.min(1, MAX_W / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.82);
      setup.wallpaper = compressed;
      document.getElementById('setup-wallpaper').value = '(arquivo local)';
      applyWallpaperPreview(compressed);
      if (saveBtn) saveBtn.disabled = false;
    };
    img.onerror = () => {
      toast('Erro ao ler imagem.');
      if (saveBtn) saveBtn.disabled = false;
      preview.innerHTML = `<div class="wp-label"><i class="ph ph-image"></i> Erro</div>`;
    };
    img.src = ev.target.result;
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
    // Usa background-image idêntico à tela real (play-hero-bg) para que o preview seja fiel
    prev.style.backgroundImage = `url('${src}')`;
    prev.style.backgroundPosition = `${posX}% ${posY}%`;
    prev.style.backgroundSize = `${zoom}%`;
    prev.style.backgroundRepeat = 'no-repeat';
    prev.innerHTML = `<div class="wp-label" style="color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.8);"><i class='ph ph-check'></i> Fundo definido</div>`;
    // Testa se a imagem é válida; se não, mostra erro
    const testImg = new Image();
    testImg.onerror = () => {
      prev.style.backgroundImage = '';
      prev.innerHTML = `<div class="wp-label">URL inválida</div>`;
    };
    testImg.src = src;
    if (controls) {
      controls.style.display = '';
      document.getElementById('wp-pos-x').value = posX;
      document.getElementById('wp-pos-y').value = posY;
      document.getElementById('wp-zoom').value = zoom;
    }
  } else {
    prev.style.backgroundImage = '';
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

function renderFormulaEditor() {
  const ed = document.getElementById('formula-editor');
  if (setup.formulas.length === 0) { ed.innerHTML = ''; return; }
  ed.innerHTML = setup.formulas.map((f, i) => `
    <div class="formula-row">
      <input type="text" class="formula-label-input" placeholder="Nome da regra" value="${f.label}" oninput="updateFormula(${i},'label',this.value)">
      <input type="number" class="formula-val-input" placeholder="pts" value="${f.value}" oninput="updateFormula(${i},'value',this.value)">
      <button class="del-formula-btn" onclick="removeFormula(${i})">✕</button>
    </div>`).join('');
}

function addFormulaRow() {
  SFX.tap();
  setup.formulas.push({ label: '', value: 0 });
  renderFormulaEditor();
}

function updateFormula(i, key, val) {
  setup.formulas[i][key] = key === 'value' ? (parseInt(val) || 0) : val;
}

function removeFormula(i) {
  SFX.remove();
  setup.formulas.splice(i, 1);
  renderFormulaEditor();
}

function getIconSVG(id, size) {
  const icon = PIXEL_ICONS.find(p => p.id === id);
  if (!icon) return id;
  const s = size || 24;
  const pathFn = ICON_PATHS[id];
  if (!pathFn) return id;
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
  for (let i = 0; i < setup.playerCount; i++) {
    let placeholder = `Jogador ${i+1}`;
    let value = vals[i] || '';
    if (i === 0 && profile.nickname) {
      placeholder = profile.nickname;
      value = profile.nickname;
    }
    const avatarHtml = (i === 0 && profile.avatar)
      ? `<img src="${profile.avatar}" style="width:100%;height:100%;object-fit:cover;">`
      : `<span style="font-weight:700;font-size:0.7rem;">${i+1}</span>`;
    const bgColor = (i === 0 && profile.avatar) ? 'transparent' : AVATAR_COLORS[i % AVATAR_COLORS.length];
    c.innerHTML += `
      <div class="player-row">
        <div class="player-badge" style="background:${bgColor};border:1.5px solid var(--text);overflow:hidden;">
          ${avatarHtml}
        </div>
        <input type="text" class="form-input" placeholder="${placeholder}" value="${value}">
      </div>`;
  }
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
  const saveBtn = document.querySelector('.modal-save');
  if (saveBtn && saveBtn.disabled) {
    toast('Aguarde o processamento da imagem');
    return;
  }
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

const TM = { cartas:'Cartas', tabuleiro:'Tabuleiro', dados:'Dados', palavras:'Palavras' };

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
  SFX.remove();
  state.games = state.games.filter(g => g.id !== id);
  save(); renderLibrary();
  toast('Jogo excluído');
}

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
    log: [],
    startedAt: new Date().toISOString(),
    participants: [],
    isHost: true
  };
  state.currentMatch.participants.push({
    nickname: profile.nickname || 'Anfitrião',
    avatar: profile.avatar || '',
    isHost: true,
    slot: 0
  });
  navTo('play');
  resetTimer(); timerLimit = 0;
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
  const isHost = m.isHost;

  // HERO COM WALLPAPER
  const heroHTML = `
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
  `;

  const timerHTML = `
    <div class="card" id="timer-card">
      <div class="flex-between">
        <div>
          <div class="card-title" style="margin-bottom:2px;"><i class="ph ph-timer"></i> Cronômetro</div>
          <div style="font-size:0.68rem;color:var(--text-3);" id="timer-remaining">${timerLimit>0 ? 'com limite' : 'sem limite — só para contabilizar'}</div>
        </div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:1.6rem;font-weight:700;color:var(--text);" id="timer-display">00:00</div>
      </div>
      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm btn-round" style="flex:1;" onclick="startTimer()"><i class="ph ph-play"></i> Iniciar</button>
        <button class="btn btn-ghost btn-sm btn-round" style="flex:1;" onclick="pauseTimer()"><i class="ph ph-pause"></i> Pausar</button>
        <button class="btn btn-ghost btn-sm btn-round" style="flex:1;" onclick="resetTimer()"><i class="ph ph-arrow-counter-clockwise"></i> Zerar</button>
      </div>
      <div style="display:flex;gap:6px;margin-top:6px;">
        <button class="btn btn-ghost btn-sm btn-round" style="flex:1;font-size:0.72rem;" onclick="timerLimit=0;updateTimerDisplay();document.getElementById('timer-remaining').textContent='sem limite — só para contabilizar';toast('Modo: só contar');"><i class="ph ph-infinity"></i> Só contar</button>
        <button class="btn btn-ghost btn-sm btn-round" style="flex:1;font-size:0.72rem;" onclick="setTimerLimit()"><i class="ph ph-hourglass"></i> Definir limite</button>
      </div>
    </div>
  `;

  const scoreHTML = `
    <div class="card">
      <div class="card-title"><i class="ph ph-trophy"></i> Placar</div>
      ${sorted.map((p,rank) => `
        <div class="score-row ${rank===0&&m.rounds.length>0?'leader':''}" id="sr-${p.idx}">
          <span class="score-rank">${rank===0&&m.rounds.length>0?'<i class="ph ph-crown"></i>':rank+1}</span>
          <span class="score-name">${p.name}</span>
          <span class="score-total" id="sv-${p.idx}">${p.score}</span>
        </div>`).join('')}
    </div>
  `;

  let smartPanel = '';
  if (m.formulas && m.formulas.length) {
    let playerOpts = '';
    if (isHost) {
      playerOpts = m.players.map((p,pi) => `<option value="${pi}">${p}</option>`).join('');
    } else {
      const myPart = m.participants.find(p => p.nickname === profile.nickname);
      if (myPart) {
        playerOpts = `<option value="${myPart.slot}">${m.players[myPart.slot]}</option>`;
      } else {
        playerOpts = `<option value="0">${m.players[0]}</option>`;
      }
    }
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

  let logHTML = '';
  if (m.log && m.log.length) {
    logHTML = `
      <div class="card" id="log-card">
        <div class="card-title"><i class="ph ph-receipt"></i> Registro de pontuação</div>
        ${m.log.map((entry, li) => ({entry, li})).reverse().map(({entry, li}) => `
          <div class="flex-between" style="padding:6px 0;border-bottom:1px solid var(--border);font-size:0.8rem;">
            <span style="color:var(--text-2);"><strong style="color:var(--text);">${m.players[entry.player].split(' ')[0]}</strong> — ${entry.label}</span>
            <span style="display:flex;align-items:center;gap:8px;">
              <span style="font-family:'JetBrains Mono',monospace;color:${entry.value>=0?'var(--secondary)':'var(--accent)'};">${entry.value>0?'+':''}${entry.value}</span>
              ${isHost ? `<button class="btn btn-ghost btn-sm" style="padding:2px 6px;" onclick="removeLogEntry(${li})" title="Desfazer"><i class="ph ph-x"></i></button>` : ''}
            </span>
          </div>`).join('')}
      </div>`;
  }

  // ROUND INPUT – com cores fixas por slot
  const roundHTML = `
    <div class="card">
      <div class="round-header">
        <span class="round-title">Nova rodada</span>
        <span class="round-num">R${m.rounds.length+1}</span>
      </div>
      ${m.players.map((name, i) => {
        const part = m.participants.find(p => p.slot === i);
        // COR FIXA POR SLOT (a menos que tenha avatar)
        const bgColor = (part && part.avatar) ? 'transparent' : AVATAR_COLORS[i % AVATAR_COLORS.length];
        let avatarContent = (part && part.avatar)
          ? `<img src="${part.avatar}" style="width:100%;height:100%;object-fit:cover;">`
          : `<span style="font-weight:700;font-size:0.8rem;color:#fff;">${i+1}</span>`;
        const isMySlot = part && part.nickname === profile.nickname;
        const isDisabled = !isHost && !isMySlot;
        return `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <div style="display:flex;align-items:center;gap:6px;flex:1;">
              <div style="width:26px;height:26px;border-radius:50%;background:${bgColor};border:1.5px solid var(--text);overflow:hidden;flex-shrink:0;display:grid;place-items:center;">
                ${avatarContent}
              </div>
              <span class="round-row-name" style="font-weight:600;">${name}</span>
              ${part ? `<span style="font-size:0.6rem;color:var(--text-3);">(${part.nickname})</span>` : `<span style="font-size:0.6rem;color:var(--text-3);">(vago)</span>`}
              ${part && part.isHost ? `<span style="font-size:0.6rem;color:var(--primary);">👑</span>` : ''}
            </div>
            <input type="number" id="ri-${i}" value="0" inputmode="numeric" onfocus="this.select()" ${isDisabled ? 'disabled' : ''} style="width:70px;text-align:center;padding:6px;border-radius:8px;border:1.5px solid var(--border);background:${isDisabled ? 'var(--surface-3)' : 'var(--surface-2)'};">
          </div>
          <div style="padding-left:38px;margin-top:-4px;margin-bottom:10px;">
            <input type="text" class="form-input" id="rn-${i}" placeholder="Anotação..." style="font-size:0.75rem;padding:7px 10px;border-radius:8px;" ${isDisabled ? 'disabled' : ''}>
          </div>
        `;
      }).join('')}
      <button class="btn btn-primary btn-block btn-round mt-12" onclick="confirmRound()"><i class="ph ph-check"></i> Confirmar Rodada</button>
    </div>
  `;

  let historyRoundsHTML = '';
  if (m.rounds.length > 0) {
    historyRoundsHTML = `
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
      </div>`;
  }

  const actionBar = `
    <div class="action-bar">
      ${m.rules||m.formulas?.length ? `<button class="btn btn-ghost btn-sm btn-round" onclick="showRules()"><i class="ph ph-scroll"></i> Regras</button>` : ''}
      <button class="btn btn-ghost btn-sm btn-round" onclick="openRoomModal()"><i class="ph ph-users-three"></i> ${m.roomCode ? 'Sala '+m.roomCode : 'Compartilhar'}</button>
      ${isHost ? `<button class="btn btn-danger btn-sm btn-round" style="margin-left:auto;" onclick="endMatch()"><i class="ph ph-stop"></i> Encerrar</button>` : ''}
    </div>
  `;

  el.innerHTML = heroHTML + timerHTML + scoreHTML + smartPanel + logHTML + roundHTML + historyRoundsHTML + actionBar;
}

function applyFormula(fi) {
  const m = state.currentMatch;
  if (!m) return;
  const f = m.formulas[fi];
  const playerIdx = parseInt(document.getElementById('formula-player')?.value ?? 0);
  const isHost = m.isHost;
  if (!isHost) {
    const myPart = m.participants.find(p => p.nickname === profile.nickname);
    if (!myPart || myPart.slot !== playerIdx) {
      toast('Você só pode aplicar regras para você mesmo');
      return;
    }
  }
  m.scores[playerIdx] += f.value;
  if (!m.log) m.log = [];
  m.log.push({ player: playerIdx, label: f.label, value: f.value, ts: new Date().toISOString() });
  const el = document.getElementById(`sv-${playerIdx}`);
  if (el) {
    const p = document.createElement('span');
    p.className = `score-particle ${f.value>=0?'particle-pos':'particle-neg'}`;
    p.textContent = (f.value>0?'+':'')+f.value;
    el.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }
  SFX.score();
  renderPlay();
  toast(`${f.label}: ${f.value>0?'+':''}${f.value} pts → ${m.players[playerIdx].split(' ')[0]}`);
  broadcastState();
}

function removeLogEntry(li) {
  const m = state.currentMatch;
  if (!m || !m.log || !m.log[li]) return;
  const entry = m.log[li];
  m.scores[entry.player] -= entry.value;
  m.log.splice(li, 1);
  SFX.remove();
  renderPlay();
  broadcastState();
}

function confirmRound() {
  const m = state.currentMatch;
  if (!m) return;
  const scores = m.players.map((_,i) => parseInt(document.getElementById(`ri-${i}`)?.value)||0);
  const notes = m.players.map((_,i) => document.getElementById(`rn-${i}`)?.value?.trim()||'');
  m.rounds.push({ scores, notes });
  scores.forEach((s,i) => m.scores[i] += s);
  SFX.score();
  setTimeout(() => { renderPlay(); toast(`Rodada ${m.rounds.length} confirmada`); broadcastState(); }, 380);
}

function endMatch() {
  const m = state.currentMatch;
  if (!m) return;
  if (!m.isHost) { toast('Apenas o anfitrião pode encerrar a partida'); return; }
  const hasActivity = m.rounds.length > 0 || (m.log && m.log.length > 0);
  if (!hasActivity && !confirm('Nenhuma rodada registrada. Encerrar assim mesmo?')) return;
  const sorted = getSorted(m);
  const match = {
    id: 'm_'+Date.now(), gameId: m.gameId, gameName: m.gameName, emoji: m.emoji,
    type: m.type, scoring: m.scoring, players: [...m.players],
    rounds: [...m.rounds], finalScores: [...m.scores], winner: sorted[0],
    startedAt: m.startedAt, endedAt: new Date().toISOString(),
    rules: m.rules, formulas: m.formulas||[], log: m.log||[],
    font: m.font, wallpaper: m.wallpaper
  };
  state.matches.unshift(match);
  const wasInRoom = !!m.roomCode;
  if (wasInRoom) { m.ended = true; broadcastState(); }
  if (roomChannel) { sb?.removeChannel(roomChannel); roomChannel = null; }
  state.currentMatch = null;
  save();
  if (hasActivity) { SFX.win(); spawnConfetti(); showWinner(match); }
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
          <button class="btn btn-ghost btn-sm btn-round" style="flex:1;" onclick="event.stopPropagation();replay('${m.id}')"><i class="ph ph-arrow-counter-clockwise"></i> Jogar de novo</button>
          <button class="btn btn-danger btn-sm btn-round" style="flex-shrink:0;" onclick="event.stopPropagation();delMatch('${m.id}')"><i class="ph ph-trash"></i> Excluir</button>
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
    ${m.log&&m.log.length ? `
      <div class="card" style="border-color:var(--secondary);">
        <div class="card-title"><i class="ph ph-receipt"></i> De onde veio cada ponto</div>
        ${m.log.map(entry => `
          <div class="flex-between" style="padding:6px 0;border-bottom:1px solid var(--border);font-size:0.82rem;">
            <span style="color:var(--text-2);"><strong style="color:var(--text);">${m.players[entry.player].split(' ')[0]}</strong> — ${entry.label}</span>
            <span style="font-family:'JetBrains Mono',monospace;color:${entry.value>=0?'var(--secondary)':'var(--accent)'};">${entry.value>0?'+':''}${entry.value}</span>
          </div>`).join('')}
      </div>` : ''}
    ${m.formulas&&m.formulas.length ? `
      <div class="card">
        <div class="card-title"><i class="ph ph-lightning"></i> Regras cadastradas neste jogo</div>
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
      </div>` : ''}
    <button class="btn btn-danger btn-block btn-round mt-12" onclick="if(delMatch('${m.id}'))closeDetail();"><i class="ph ph-trash"></i> Excluir partida</button>`;
  document.getElementById('detail-modal').classList.add('active');
}

function closeDetail() { document.getElementById('detail-modal').classList.remove('active'); }
function delMatch(id) {
  SFX.remove();
  state.matches = state.matches.filter(m => m.id !== id);
  save(); renderHistory();
  toast('Partida excluída');
  return true;
}
function replay(id) {
  const m = state.matches.find(x => x.id === id);
  if (!m) return;
  const g = state.games.find(x => x.id === m.gameId);
  if (g) startMatch(g.id);
  else toast('Jogo não encontrado');
}

// ROOM
let roomChannel = null;

function genRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 5; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

function roomLink(code) {
  return `${window.location.origin}${window.location.pathname}?sala=${code}`;
}

function renderRoomParticipants() {
  const m = state.currentMatch;
  const body = document.getElementById('room-modal-body');
  if (!m || !m.participants || !body) return;
  const existing = body.querySelector('.room-participants');
  if (existing) existing.remove();
  const html = `
    <div class="room-participants" style="display:flex;flex-wrap:wrap;gap:10px;margin:12px 0;">
      ${m.participants.map(p => {
        const bgColor = p.avatar ? 'transparent' : getAvatarColor(p.nickname);
        const avatarContent = p.avatar
          ? `<img src="${p.avatar}" style="width:100%;height:100%;object-fit:cover;">`
          : `<i class="ph ph-user" style="font-size:1rem;display:flex;align-items:center;justify-content:center;height:100%;color:#fff;"></i>`;
        return `
          <div style="display:flex;align-items:center;gap:6px;background:var(--surface-2);border-radius:20px;padding:4px 12px 4px 4px;border:1.5px solid ${p.isHost ? 'var(--primary)' : 'var(--border)'};">
            <div style="width:30px;height:30px;border-radius:50%;background:${bgColor};border:1.5px solid var(--text);overflow:hidden;">
              ${avatarContent}
            </div>
            <span style="font-size:0.8rem;font-weight:600;">${p.nickname}</span>
            ${p.isHost ? '<span style="font-size:0.6rem;color:var(--primary);">👑</span>' : ''}
            <span style="font-size:0.6rem;color:var(--text-3);">(Jogador ${p.slot+1})</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
  const btns = body.querySelector('.btn-block');
  if (btns) {
    btns.insertAdjacentHTML('beforebegin', html);
  } else {
    body.insertAdjacentHTML('afterbegin', html);
  }
}

function openRoomModal() {
  const m = state.currentMatch;
  const body = document.getElementById('room-modal-body');
  if (!m) { body.innerHTML = `<p style="font-size:0.85rem;color:var(--text-2);">Inicie uma partida primeiro.</p>`; }
  else if (m.roomCode) {
    body.innerHTML = `
      <p style="font-size:0.82rem;color:var(--text-2);margin-bottom:12px;line-height:1.5;">
        ${m.isHost ? 'Compartilhe esse código ou link — quem entrar vê o placar em tempo real, junto com você.' : 'Você está nesta sala como convidado.'}
      </p>
      <div style="text-align:center;font-size:2rem;font-weight:800;letter-spacing:6px;font-family:'JetBrains Mono',monospace;color:var(--primary-dim);margin-bottom:12px;">${m.roomCode}</div>
      <button class="btn btn-primary btn-block btn-round" onclick="copyRoomLink()"><i class="ph ph-link"></i> Copiar link de convite</button>
      <button class="btn btn-ghost btn-block btn-round mt-12" onclick="leaveRoom()"><i class="ph ph-sign-out"></i> Sair da sala</button>`;
    renderRoomParticipants();
  } else {
    body.innerHTML = `
      <p style="font-size:0.82rem;color:var(--text-2);margin-bottom:14px;line-height:1.5;">
        Crie uma sala e mande o código para os outros jogadores. Cada um registra pelo próprio celular e todo mundo vê o placar atualizando ao vivo — tipo Kahoot.
      </p>
      <button class="btn btn-primary btn-block btn-round" onclick="createRoom()"><i class="ph ph-broadcast"></i> Criar sala e compartilhar</button>`;
  }
  document.getElementById('room-modal').classList.add('active');
}

function closeRoomModal(e) {
  if (!e || e.target === document.getElementById('room-modal'))
    document.getElementById('room-modal').classList.remove('active');
}

function subscribeRoom(code, isHost) {
  if (!sb) { toast('Supabase não disponível'); return; }
  if (roomChannel) { sb.removeChannel(roomChannel); roomChannel = null; }
  roomChannel = sb.channel(`tt-sala-${code}`, { config: { broadcast: { self: false } } });

  roomChannel.on('broadcast', { event: 'sync' }, ({ payload }) => {
    const wasEnded = payload.ended;
    state.currentMatch = wasEnded ? null : { ...payload, isHost };
    if (payload.participants) {
      state.currentMatch.participants = payload.participants;
    }
    if (!wasEnded && payload.participants) {
      const myProfile = {
        nickname: profile.nickname || `Anônimo${payload.participants.length+1}`,
        avatar: profile.avatar || '',
        isHost: isHost,
        slot: -1
      };
      if (!payload.participants.some(p => p.nickname === myProfile.nickname)) {
        roomChannel.send({
          type: 'broadcast',
          event: 'join-request',
          payload: myProfile
        });
      }
    }
    if (wasEnded) { toast('O anfitrião encerrou a partida'); navTo('history'); renderHistory(); }
    else if (document.getElementById('view-play').classList.contains('active') || !isHost) {
      navTo('play'); renderPlay();
    }
    if (document.getElementById('room-modal').classList.contains('active')) {
      renderRoomParticipants();
    }
  });

  roomChannel.on('broadcast', { event: 'join-request' }, ({ payload }) => {
    if (state.currentMatch && state.currentMatch.isHost) {
      const m = state.currentMatch;
      if (m.participants.some(p => p.nickname === payload.nickname)) return;
      const usedSlots = m.participants.map(p => p.slot);
      let freeSlot = -1;
      for (let i = 0; i < m.players.length; i++) {
        if (!usedSlots.includes(i)) { freeSlot = i; break; }
      }
      if (freeSlot === -1) {
        toast('Sala lotada!');
        return;
      }
      const newPart = { ...payload, slot: freeSlot, isHost: false };
      m.participants.push(newPart);
      broadcastState();
      toast(`${payload.nickname} entrou na sala!`);
      renderPlay();
      renderRoomParticipants();
    }
  });

  roomChannel.on('broadcast', { event: 'add-participant' }, ({ payload }) => {
    if (state.currentMatch) {
      if (!state.currentMatch.participants) state.currentMatch.participants = [];
      if (!state.currentMatch.participants.some(p => p.nickname === payload.nickname)) {
        state.currentMatch.participants.push(payload);
        if (document.getElementById('room-modal').classList.contains('active')) {
          renderRoomParticipants();
        }
        if (document.getElementById('view-play').classList.contains('active')) {
          renderPlay();
        }
        toast(`${payload.nickname} entrou na sala!`);
      }
    }
  });

  roomChannel.on('broadcast', { event: 'request-sync' }, () => {
    if (isHost) broadcastState();
  });

  roomChannel.subscribe();
}

function createRoom() {
  const m = state.currentMatch;
  if (!m) return;
  const code = genRoomCode();
  m.roomCode = code;
  m.isHost = true;
  subscribeRoom(code, true);
  SFX.confirm();
  setTimeout(broadcastState, 400);
  openRoomModal();
}

function leaveRoom() {
  const m = state.currentMatch;
  if (roomChannel) { sb?.removeChannel(roomChannel); roomChannel = null; }
  if (m) { m.roomCode = null; m.isHost = false; m.participants = []; }
  closeRoomModal();
  toast('Você saiu da sala');
  renderPlay();
}

function copyRoomLink() {
  const m = state.currentMatch;
  if (!m?.roomCode) return;
  navigator.clipboard?.writeText(roomLink(m.roomCode)).then(() => toast('Link copiado!'))
    .catch(() => toast(`Código: ${m.roomCode}`));
}

function broadcastState() {
  const m = state.currentMatch;
  if (!m?.roomCode || !roomChannel) return;
  roomChannel.send({ type: 'broadcast', event: 'sync', payload: m });
}

function openJoinModal() { document.getElementById('join-modal').classList.add('active'); }
function closeJoinModal(e) {
  if (!e || e.target === document.getElementById('join-modal'))
    document.getElementById('join-modal').classList.remove('active');
}

function joinRoomFromInput() {
  const code = document.getElementById('join-code-input').value.trim().toUpperCase();
  if (code.length < 4) { toast('Digite um código válido'); return; }
  joinRoom(code);
}

function joinRoom(code) {
  code = code.trim().toUpperCase();
  document.getElementById('join-status').textContent = 'Entrando na sala...';
  subscribeRoom(code, false);
  setTimeout(() => {
    roomChannel?.send({ type: 'broadcast', event: 'request-sync', payload: {} });
  }, 500);
  setTimeout(() => {
    if (!state.currentMatch || state.currentMatch.roomCode !== code) {
      toast('Sala não encontrada. Confira o código e tente de novo.');
      const st = document.getElementById('join-status'); if (st) st.textContent = '';
    } else {
      closeJoinModal();
    }
  }, 2500);
}

(function checkRoomFromURL() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('sala');
  if (code) {
    setTimeout(() => {
      enterApp();
      joinRoom(code);
    }, 600);
  }
})();

// PERFIL
let profile = { nickname: '', avatar: '' };
function loadProfile() {
  try { profile = { ...profile, ...JSON.parse(localStorage.getItem('tt_profile') || '{}') }; } catch(e) {}
}
function saveProfile() {
  profile.nickname = document.getElementById('profile-nickname')?.value.trim() || '';
  localStorage.setItem('tt_profile', JSON.stringify(profile));
  renderProfile();
}
function handleProfileAvatar(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const S = 240;
      const canvas = document.createElement('canvas');
      canvas.width = S; canvas.height = S;
      const ctx = canvas.getContext('2d');
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width-side)/2, (img.height-side)/2, side, side, 0, 0, S, S);
      profile.avatar = canvas.toDataURL('image/jpeg', 0.85);
      saveProfile();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function renderProfile() {
  const nickInput = document.getElementById('profile-nickname');
  if (nickInput && document.activeElement !== nickInput) nickInput.value = profile.nickname;
  const av = document.getElementById('profile-avatar');
  if (av) {
    av.innerHTML = profile.avatar
      ? `<img src="${profile.avatar}" style="width:100%;height:100%;object-fit:cover;">`
      : `<i class="ph ph-camera" style="font-size:1.4rem;color:var(--text);"></i>`;
  }
  const gEl = document.getElementById('stat-games'); if (gEl) gEl.textContent = state.games.length;
  const mEl = document.getElementById('stat-matches'); if (mEl) mEl.textContent = state.matches.length;
  const wins = profile.nickname
    ? state.matches.filter(m => m.winner?.name?.trim().toLowerCase() === profile.nickname.trim().toLowerCase()).length
    : 0;
  const wEl = document.getElementById('stat-wins'); if (wEl) wEl.textContent = wins;
}

// MUSIC
function ytVideoId(url) {
  try {
    const u = new URL(url);
    if (u.pathname.startsWith('/live/')) {
      return u.pathname.split('/')[2]?.split('?')[0] || '';
    }
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1).split('?')[0];
    }
    return u.searchParams.get('v') || '';
  } catch {
    return '';
  }
}

let musicPlaying = false;

function openMusicModal() { document.getElementById('music-modal').classList.add('active'); }
function closeMusicModal(e) {
  if (e.target === document.getElementById('music-modal'))
    document.getElementById('music-modal').classList.remove('active');
}

function loadMusic() {
  const url = document.getElementById('music-url-input').value.trim();
  if (!url) { toast('Cole uma URL do YouTube'); return; }
  const vid = ytVideoId(url);
  if (!vid) { toast('URL inválida — use youtube.com ou youtu.be'); return; }
  const frame = document.getElementById('yt-frame');
  const container = document.getElementById('yt-container');
  frame.src = `https://www.youtube.com/embed/${vid}?autoplay=1&controls=1&loop=0`;
  container.style.display = 'block';
  musicPlaying = true;
  document.getElementById('music-toggle-btn').classList.add('playing');
  document.getElementById('music-status').innerHTML = `Tocando... <a href="https://www.youtube.com/watch?v=${vid}" target="_blank" rel="noopener" style="color:var(--info);text-decoration:underline;">Não toca? Abrir no YouTube</a>`;
  toast('Música iniciada — se não tocar, toque no play dentro do vídeo (alguns navegadores bloqueiam som automático)');
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

// SUPABASE
const SUPABASE_URL = 'https://obnxqnllrrkoznxxnwkh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibnhxbmxscnJrb3pueHhud2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NzIwMzIsImV4cCI6MjA5OTU0ODAzMn0.Yy94y6YVXnHYMbunney-hCCp5NbYtNTozaLKuCnXUrQ';
let sb = null;
try {
  const mod = window.supabase;
  if (mod && mod.createClient) {
    sb = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase lib not found on window.supabase');
  }
} catch(e) { console.warn('Supabase init failed:', e); }

// AUTH
async function loginWithGoogle() {
  if (!sb) { toast('Supabase não disponível'); return; }
  try {
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
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

async function deleteAccount() {
  if (!sb) { toast('Supabase não disponível'); return; }
  const { data: { user } } = await sb.auth.getUser();
  if (!user) { toast('Nenhum usuário logado'); return; }
  try {
    const { error } = await sb.auth.admin.deleteUser(user.id);
    if (error) { toast('Erro ao apagar conta: ' + error.message); }
    else { toast('Conta apagada'); await sb.auth.signOut(); updateAuthUI(); }
  } catch(e) { toast('Erro ao apagar conta'); }
}

async function updateAuthUI() {
  if (!sb) return;
  const { data: { session } } = await sb.auth.getSession();
  const authCard = document.getElementById('auth-card');
  const loggedDiv = document.getElementById('auth-logged');

  if (session?.user) {
    if (authCard) authCard.style.display = 'none';
    if (loggedDiv) loggedDiv.style.display = '';
    const user = session.user;
    const emailEl = document.getElementById('auth-user-email');
    const avatarEl = document.getElementById('auth-avatar');
    if (emailEl) emailEl.textContent = user.email || user.user_metadata?.full_name || 'Usuário';
    if (avatarEl && user.user_metadata?.avatar_url) {
      avatarEl.innerHTML = `<img src="${user.user_metadata.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`;
    }
  } else {
    if (authCard) authCard.style.display = '';
    if (loggedDiv) loggedDiv.style.display = 'none';
  }
}

if (sb) {
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      updateAuthUI();
      toast('Login realizado!');
      const splash = document.getElementById('splash');
      if (splash && splash.style.display !== 'none') enterApp();
    }
    if (event === 'SIGNED_OUT') {
      updateAuthUI();
    }
  });
  updateAuthUI();
}

// GRAIN
let grainEnabled = localStorage.getItem('tt_grain') !== 'off';
function toggleGrain(on) {
  grainEnabled = on;
  localStorage.setItem('tt_grain', on ? 'on' : 'off');
  document.body.classList.toggle('no-grain', !on);
}
if (!grainEnabled) {
  document.body.classList.add('no-grain');
  setTimeout(() => { const g = document.getElementById('grain-toggle'); if(g) g.checked = false; }, 0);
}

// DATA EXPORT / CLEAR
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
  state.games = []; state.matches = []; state.currentMatch = null;
  save(); renderLibrary(); renderHistory(); renderPlay();
  SFX.remove(); toast('Dados limpos');
}

// TIMER
let timerInterval = null;
let timerSeconds = 0;
let timerLimit = 0;

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

// ROUTING
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || 'library';
  if (['library','play','history','settings'].includes(hash)) {
    navTo(hash);
  }
});

// INIT
load();
loadProfile();
renderLibrary();
renderHistory();
renderPlay();
const initHash = window.location.hash.slice(1) || 'library';
if (['library','play','history','settings'].includes(initHash)) {
  navTo(initHash);
} else {
  navTo('library');
}