const GRID = document.getElementById('card-grid');
const FILTER_BAR = document.getElementById('filter-bar');

const PLACEHOLDER_ICON = '🎮';

let allGames = [];
let activeTag = 'all';

async function loadGames() {
  try {
    const res = await fetch('games.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allGames = await res.json();
    buildFilterBar(allGames);
    render();
  } catch (err) {
    GRID.innerHTML = `<p id="loading-msg">無法載入遊戲清單：${escapeHtml(err.message)}</p>`;
    console.error('Failed to load games.json', err);
  }
}

function buildFilterBar(games) {
  const tagSet = new Set();
  games.forEach(g => (g.tags || []).forEach(t => tagSet.add(t)));
  if (tagSet.size === 0) return;

  FILTER_BAR.hidden = false;
  [...tagSet].sort().forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn';
    btn.dataset.tag = tag;
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      activeTag = tag;
      document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
    FILTER_BAR.appendChild(btn);
  });

  document.querySelector('.tag-btn[data-tag="all"]').addEventListener('click', (e) => {
    activeTag = 'all';
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    render();
  });
}

function render() {
  const games = activeTag === 'all'
    ? allGames
    : allGames.filter(g => (g.tags || []).includes(activeTag));

  if (games.length === 0) {
    GRID.innerHTML = '<p id="loading-msg">沒有符合的遊戲</p>';
    return;
  }

  GRID.innerHTML = '';
  games.forEach(game => GRID.appendChild(buildCard(game)));
}

function buildCard(game) {
  const isWip = game.status === 'wip';
  const el = document.createElement(isWip ? 'div' : 'a');
  el.className = `game-card${isWip ? ' wip' : ''}`;
  if (!isWip) {
    el.href = game.url;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  }

  const thumbHtml = game.thumbnail
    ? `<img src="${escapeAttr(game.thumbnail)}" alt="${escapeAttr(game.title)}" onerror="this.parentElement.innerHTML='<span class=\\'thumb-fallback\\'>${PLACEHOLDER_ICON}</span>'">`
    : `<span class="thumb-fallback">${PLACEHOLDER_ICON}</span>`;

  const tagsHtml = (game.tags || [])
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join('');

  el.innerHTML = `
    ${isWip ? '<span class="status-badge">開發中</span>' : ''}
    <div class="thumb-wrap">${thumbHtml}</div>
    <h2 class="game-title">${escapeHtml(game.title)}</h2>
    <p class="game-desc">${escapeHtml(game.description || '')}</p>
    <div class="tags">${tagsHtml}</div>
    ${!isWip ? '<div class="enter-btn">▶ 進入遊戲</div>' : ''}
  `;

  return el;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

document.getElementById('year').textContent = new Date().getFullYear();
loadGames();
