(() => {
  const archive = document.querySelector('[data-news-archive]');
  if (!archive) return;
  const grid = archive.querySelector('.news-data-grid');
  const cards = Array.from(grid.querySelectorAll('.news-data-card'));
  cards.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));
  cards.forEach(card => grid.appendChild(card));
  const buttons = Array.from(archive.querySelectorAll('[data-filter]'));
  const pagination = archive.querySelector('.news-pagination');
  const summary = archive.querySelector('#newsResults');
  const pageSize = 12;
  const params = new URLSearchParams(location.search);
  let category = buttons.some(button => button.dataset.filter === params.get('category')) ? params.get('category') : 'ALL';
  let page = Math.max(1, Number.parseInt(params.get('page'), 10) || 1);

  function render(moveFocus = false) {
    const filtered = cards.filter(card => category === 'ALL' || card.dataset.category === category);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, totalPages);
    const visible = new Set(filtered.slice((page - 1) * pageSize, page * pageSize));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    buttons.forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    summary.textContent = `${category === 'ALL' ? '전체' : category} ${filtered.length.toLocaleString('ko-KR')}건 · 최신순 · ${page} / ${totalPages}페이지`;
    pagination.replaceChildren();
    function addButton(label, target, disabled, current = false) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = disabled;
      if (current) button.setAttribute('aria-current', 'page');
      if (/^\d+$/.test(label)) button.setAttribute('aria-label', `${label}페이지`);
      button.addEventListener('click', () => { page = target; render(true); });
      pagination.appendChild(button);
    }
    if (totalPages > 1) {
      addButton('이전', page - 1, page === 1);
      for (let p = 1; p <= totalPages; p++) addButton(String(p), p, false, p === page);
      addButton('다음', page + 1, page === totalPages);
    }
    const url = new URL(location.href);
    if (category === 'ALL') url.searchParams.delete('category'); else url.searchParams.set('category', category);
    if (page === 1) url.searchParams.delete('page'); else url.searchParams.set('page', String(page));
    history.replaceState(null, '', url);
    if (moveFocus) {
      summary.focus({ preventScroll: true });
      summary.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    page = 1;
    render();
  }));
  window.addEventListener('popstate', () => {
    const next = new URLSearchParams(location.search);
    category = buttons.some(button => button.dataset.filter === next.get('category')) ? next.get('category') : 'ALL';
    page = Math.max(1, Number.parseInt(next.get('page'), 10) || 1);
    render();
  });
  render();
})();
