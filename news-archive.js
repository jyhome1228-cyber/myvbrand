(() => {
  const archive = document.querySelector('[data-news-archive]');
  if (!archive) return;

  const grid = archive.querySelector('.news-data-grid');
  const hero = document.querySelector('.page-hero');
  const cards = Array.from(grid.querySelectorAll('.news-data-card'));
  const buttons = Array.from(archive.querySelectorAll('[data-filter]'));
  const pagination = archive.querySelector('.news-pagination');
  const summary = archive.querySelector('#newsResults');
  const originalTitle = document.title;
  const pageSize = 12;
  let category = 'ALL';
  let page = 1;
  let listingScroll = 0;
  let routeVersion = 0;
  let postPromise;

  // Every news item has its own shareable address, on this SAME page.
  cards.forEach((card) => {
    card.href = './news.html?article=' + encodeURIComponent(card.dataset.postId);
    card.removeAttribute('target');
    card.removeAttribute('rel');
    const action = card.querySelector('.news-data-meta span');
    if (action) action.textContent = '자세히 보기 →';
  });
  cards.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));
  cards.forEach((card) => grid.appendChild(card));

  const detail = document.createElement('section');
  detail.className = 'news-detail-section';
  detail.setAttribute('data-news-detail', '');
  detail.hidden = true;
  detail.innerHTML =
    '<div class="container"><article class="article-shell">' +
    '<a class="article-back" href="./news.html">← 뉴스 목록으로</a>' +
    '<header class="article-heading"><span class="article-category"></span>' +
    '<h1 id="newsArticleTitle"></h1><div class="article-meta"></div></header>' +
    '<p class="article-lead" id="newsArticleLead"></p>' +
    '<div class="article-content" id="newsArticleContent"></div>' +
    '<div class="article-bottom"><a href="./news.html">뉴스 목록으로 돌아가기</a></div>' +
    '</article></div>';
  archive.insertAdjacentElement('afterend', detail);
  const heading = detail.querySelector('#newsArticleTitle');
  const categoryEl = detail.querySelector('.article-category');
  const lead = detail.querySelector('#newsArticleLead');
  const content = detail.querySelector('#newsArticleContent');
  const meta = detail.querySelector('.article-meta');

  const knownHeadings = new Set([
    '상생 이커머스 플랫폼 ‘마이브이’',
    '가치 소비를 통해 풍요로운 세상을 꿈꾸다',
    '사칙 연산으로 소개하는 ‘마이브이(MyV)’',
    '소비자가 수익을 얻는 가치 소비',
    '마이브이에서만 가능한 특별한 만남',
    '순기능 비즈니스 모델, 상생을 추구하는 마이브이',
    '브이랩스 개요', '브이랩스 소개', '강점', 'profile', '유투브 영상',
    '[마이브이의 지속가능한 철학]', '[함께 나누는 상생 구조]',
    '[친환경 브랜드와의 협업]', '꼼꼼한 입점 기준',
    '지속가능 특허 비즈니스', '브이슈머(V‑sumer)', 'V.Point 리워드'
  ]);

  function element(tag, className, textValue) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textValue !== undefined) node.textContent = textValue;
    return node;
  }

  function addRichText(node, textValue) {
    const source = String(textValue || '');
    const pattern = /(\*\*[^*\n]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>()]+)/g;
    let last = 0;
    for (const match of source.matchAll(pattern)) {
      node.appendChild(document.createTextNode(source.slice(last, match.index)));
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        node.appendChild(element('strong', '', token.slice(2, -2)));
      } else {
        const markdown = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
        const url = markdown ? markdown[2] : token;
        try {
          const parsed = new URL(url);
          if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('Unsafe link');
          const link = element('a', '', markdown ? markdown[1] : token);
          link.href = parsed.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          node.appendChild(link);
        } catch {
          node.appendChild(document.createTextNode(token));
        }
      }
      last = match.index + token.length;
    }
    node.appendChild(document.createTextNode(source.slice(last)));
  }

  function renderBody(post) {
    content.replaceChildren();
    if (!post.body) {
      content.appendChild(element('p', 'article-empty', '기사 본문 준비 중입니다.'));
      return;
    }
    if (post.intro) content.appendChild(element('p', '', post.intro));
    let imageNumber = 0;
    const paragraphs = String(post.body).split(/\n\s*\n/);
    paragraphs.forEach((item) => {
      const paragraph = item.trim();
      if (!paragraph) return;
      // Imported source material can contain an extra quote before an image URL.
      const normalized = paragraph.replace(/^["'](?=https?:\/\/)/, '').replace(/["']$/, '');
      if (/^https?:\/\/\S+\.(?:webp|png|jpe?g)(?:\?\S*)?$/i.test(normalized)) {
        const figure = element('figure');
        const picture = element('img');
        picture.src = normalized;
        picture.alt = post.title + ' — 자료 이미지 ' + (++imageNumber);
        picture.loading = 'lazy';
        picture.decoding = 'async';
        figure.appendChild(picture);
        content.appendChild(figure);
        return;
      }
      if (knownHeadings.has(paragraph) || paragraph === '제품 보러 가기') {
        const title = paragraph === 'profile' ? '대표 프로필' :
          paragraph === '유투브 영상' ? '관련 영상' :
          paragraph === '제품 보러 가기' ? '제품 살펴보기' : paragraph;
        content.appendChild(element('h2', '', title));
        return;
      }
      if (paragraph.includes('https://') || paragraph.includes('http://')) {
        const group = element('div', 'article-links');
        addRichText(group, paragraph);
        content.appendChild(group);
        return;
      }
      if (paragraph.startsWith('“') && paragraph.endsWith('”')) {
        const quote = element('blockquote');
        const p = element('p');
        addRichText(p, paragraph);
        quote.appendChild(p);
        content.appendChild(quote);
        return;
      }
      const p = element('p');
      addRichText(p, paragraph);
      content.appendChild(p);
    });
  }

  function loadPosts() {
    if (!postPromise) {
      postPromise = fetch('./news-posts.json?v=20261018-newsdetail', {cache: 'no-store'})
        .then((response) => {
          if (!response.ok) throw new Error('Article data could not be loaded');
          return response.json();
        });
    }
    return postPromise;
  }

  function readListState() {
    const params = new URLSearchParams(location.search);
    const requested = params.get('category');
    category = buttons.some((button) => button.dataset.filter === requested) ? requested : 'ALL';
    page = Math.max(1, Number.parseInt(params.get('page'), 10) || 1);
  }

  function renderList(moveFocus = false) {
    const filtered = cards.filter((card) => category === 'ALL' || card.dataset.category === category);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, totalPages);
    const visible = new Set(filtered.slice((page - 1) * pageSize, page * pageSize));
    cards.forEach((card) => { card.hidden = !visible.has(card); });
    buttons.forEach((button) => {
      const active = button.dataset.filter === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    summary.textContent = (category === 'ALL' ? '전체' : category) + ' ' +
      filtered.length.toLocaleString('ko-KR') + '건 · 최신순 · ' + page + ' / ' + totalPages + '페이지';

    pagination.replaceChildren();
    function addPageButton(label, target, disabled, current = false) {
      const button = element('button', '', label);
      button.type = 'button';
      button.disabled = disabled;
      if (current) button.setAttribute('aria-current', 'page');
      if (/^\d+$/.test(label)) button.setAttribute('aria-label', label + '페이지');
      button.addEventListener('click', () => {
        page = target;
        renderList(true);
      });
      pagination.appendChild(button);
    }
    if (totalPages > 1) {
      addPageButton('이전', page - 1, page === 1);
      for (let p = 1; p <= totalPages; p++) addPageButton(String(p), p, false, p === page);
      addPageButton('다음', page + 1, page === totalPages);
    }

    const url = new URL(location.href);
    url.searchParams.delete('article');
    if (category === 'ALL') url.searchParams.delete('category');
    else url.searchParams.set('category', category);
    if (page === 1) url.searchParams.delete('page');
    else url.searchParams.set('page', String(page));
    history.replaceState(history.state, '', url);

    if (moveFocus) {
      summary.focus({preventScroll: true});
      summary.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  }

  async function renderRoute(scrollToTop = false) {
    const serial = ++routeVersion;
    const id = new URLSearchParams(location.search).get('article');
    if (!id) {
      detail.hidden = true;
      archive.hidden = false;
      if (hero) hero.hidden = false;
      document.body.classList.remove('news-article-page');
      document.title = originalTitle;
      readListState();
      renderList();
      if (scrollToTop) window.scrollTo({top: listingScroll, behavior: 'instant'});
      return;
    }

    listingScroll = document.body.classList.contains('news-article-page')
      ? listingScroll : window.scrollY;
    archive.hidden = true;
    if (hero) hero.hidden = true;
    detail.hidden = false;
    document.body.classList.add('news-article-page');
    categoryEl.textContent = '';
    heading.textContent = '뉴스를 불러오는 중입니다.';
    lead.hidden = true;
    meta.replaceChildren();
    content.replaceChildren();
    if (scrollToTop) window.scrollTo({top: 0, behavior: 'instant'});

    try {
      const posts = await loadPosts();
      if (serial !== routeVersion) return;
      const post = posts.find((item) => item.id === id);
      if (!post) {
        heading.textContent = '요청하신 뉴스를 찾을 수 없습니다.';
        content.appendChild(element('p', '', '뉴스 목록에서 다른 기사를 선택해 주세요.'));
        return;
      }
      categoryEl.textContent = post.category || 'MYV';
      heading.textContent = post.title;
      document.title = post.title + ' | MYV NEWS';
      const dated = element('span', '', '게시일 ' + post.date);
      meta.appendChild(dated);
      if (post.reportedDate) meta.appendChild(element('span', '', '원문 보도일 ' + post.reportedDate));
      lead.textContent = post.summary || '';
      lead.hidden = !post.summary;
      renderBody(post);
    } catch (error) {
      if (serial !== routeVersion) return;
      heading.textContent = '뉴스를 불러오지 못했습니다.';
      content.appendChild(element('p', '', '잠시 후 다시 접속해 주세요.'));
      postPromise = null;
    }
  }

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.news-data-card');
    if (!card || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    listingScroll = window.scrollY;
    history.pushState({newsDetail: true}, '', card.href);
    renderRoute(true);
  });

  detail.querySelectorAll('.article-back, .article-bottom a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const url = new URL('./news.html', location.href);
      if (category !== 'ALL') url.searchParams.set('category', category);
      if (page > 1) url.searchParams.set('page', String(page));
      history.pushState(null, '', url);
      renderRoute(true);
    });
  });

  buttons.forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.filter;
    page = 1;
    renderList();
  }));

  window.addEventListener('popstate', () => renderRoute(true));
  renderRoute();
})();
