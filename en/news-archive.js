(() => {
  const newsTitles = {"legacy-171831533":"Vietnamese KOL Xenia Joins Getz-Beauty, Signaling Entry into Korea","legacy-170448224":"V Labs CEO Jangwook Lee on E-Commerce Where Businesses and Consumers Grow Together","legacy-170004786":"Influencer E-Commerce Association and V Labs Join Forces for a Global MYV Prosumer Ecosystem","legacy-169080625":"V Labs CEO Receives Award for Consumer Curation at the 2025 Influencer Awards","legacy-168408090":"Meet Drunken Rose, a Signature Fragrance from Scentwiki","legacy-168310159":"CoffeeTools: Bringing the Aroma of Coffee Into Everyday Life","legacy-168029754":"MYV: Building an E-Commerce Model Where Consumption Creates Value","legacy-167950862":"Gentle Dermocosmetics Brand Dr. Gentle Joins MYV","legacy-167829500":"Pet Brand OnesPapa Expands on MYV with Freeze-Dried Dog Treats","legacy-167537778":"MYV Welcomes Traditional Korean Black Goat Extract and Premium Red Ginseng Gift Sets","legacy-167321731":"Premium Soy Milk Brand Duyubonsaek Joins MYV","legacy-167275727":"MYV: A Platform Where Consumption Becomes Shared Value","weeklypeople-interview":"V Labs CEO Jangwook Lee Featured in Weekly People Interview","myv-patent-registration":"V Labs Announces Three Patents Related to MYV","value-consumption-platform":"V Labs Develops MYV, a Value-Driven Commerce Platform for Shared Growth","dentipromised-blind-test":"Dentipromised Toothpaste: Blind Product Test","myv-renewal-2024":"MYV Marks Its 2024 Online Mall Renewal with a Launch Event","silkyhair-blind-test":"Silkyhair Hair Essence: Blind Product Test","vpoint-friend-event":"MYV Announces 2024 Invite-a-Friend V.Point Campaign","assistfit-collaboration":"V Labs Broadens Consumer Engagement with AssistFit Media","luluan-brand-launch":"Eco-Friendly Portable Bidet Brand Luluan Joins MYV","anti-hairloss-blind-test":"Anti-Hairloss Shampoo: Blind Product Test","pearlcare-launch":"Beauty and Healthcare Brand Pearlcare Joins MYV","black-friday-2024":"MYV Holds a Black Friday Promotion in 2024","jungleon-office":"V Labs Selected to Join Seongnam Startup Center Jungle ON","onk-healthcare-launch":"Three Taijeon Group ONK Health Products Join the MYV Mall","jalpul-house-launch":"Household Essentials Brand Jalpul House Joins MYV","ozon-toothbrush-launch":"Korean Toothbrush Brand Ozon Joins MYV","verymom-launch":"Premium Skincare Brand Verymom Joins MYV","farmerssignature-lovew-launch":"Farmers Signature and Lovew Skincare Join MYV","onespapa-foot-cleanser-launch":"OnesPapa Natural Dog Paw Cleanser Joins MYV","ai-demand-patent":"V Labs Registers Patent for AI-Based Demand Forecasting","taejeon-vitality-launch":"MYV Adds Three Taijeon Group Wellness Products","manticket-launch":"Men's Care Brand Manticket Expands MYV's Portfolio","vastly-launch":"Eco-Friendly Lifestyle Brand Vastly Joins MYV","cuni-launch":"Natural Lifestyle Brand CUNI Joins the MYV Mall","cleanbeauty-startup-seminar":"V Labs Participates in Clean Beauty Startup Seminar","gibunjoeum-launch":"Upcycled Hand Wash Brand Gibunjoeum Joins MYV"};
  const summaryTranslations = {"완스파파가 기존 발 세정제에 이어 후코이단 동결건조 강아지 간식 후코잇 트릿을 선보이며 마이브이의 반려동물 제품 라인업을 넓혔습니다.":"OnesPapa expands its pet-care lineup on MYV with freeze-dried dog treats alongside its existing paw cleanser.","자연 방목 국내산 토종 흑염소진액과 케이 레드 진생 프리미엄 홍삼 스틱 선물세트가 마이브이에 입점했습니다.":"Korean black goat extract and premium red ginseng gift sets are now available through MYV.","프리미엄 두유 브랜드 두유본색이 마이브이에 입점했습니다. 국산콩과 단호박·자색고구마·흑임자 등 원물의 풍미를 담은 무가당 아침두유를 소개합니다.":"Premium soy milk brand Duyubonsaek joins MYV with unsweetened drinks featuring Korean ingredients.","마이브이의 입점 기준, 지속가능한 비즈니스, 브이슈머와 V.Point 리워드, 친환경 브랜드 협업을 통해 가치 소비와 상생의 철학을 소개합니다.":"An introduction to MYV's brand selection, V.Point rewards and approach to collaborative, value-driven commerce.","이장욱 브이랩스 대표가 위클리피플 인터뷰를 통해 마이브이의 탄생 배경과 가치소비, 동반 성장의 철학을 소개했습니다.":"V Labs CEO Jangwook Lee discusses the origins of MYV and the philosophy of shared growth.","브이랩스가 마이브이의 소비자 참여와 가치 공유 구조에 적용한 시스템의 특허 등록 소식을 전했습니다.":"V Labs shares news of patent registrations related to consumer participation and value sharing at MYV.","기업과 소비자가 함께 성장하는 소비자 참여형 플랫폼 마이브이의 사업 철학과 서비스 구조를 소개합니다.":"Explore MYV's vision and service model for a commerce platform built around shared growth.","덴티프라미스드 치약의 리얼 블라인드 테스트 평가 자료를 소개합니다.":"Results of a blind product evaluation of Dentipromised toothpaste.","2024년 마이브이 쇼핑몰 리뉴얼을 통해 간편 회원가입과 V.Point 환급 신청 방식 등 이용 편의를 개선했습니다.":"MYV's 2024 online mall renewal enhanced registration and V.Point redemption accessibility.","실키헤어 에센스의 리얼 블라인드 테스트 평가 자료를 소개합니다.":"Highlights from a blind test evaluation of Silkyhair Essence.","2024년 마이브이 친구 초대 이벤트의 참여 방식과 V.Point 혜택을 소개한 소식입니다.":"A look back at MYV's 2024 referral campaign and V.Point incentives.","브이랩스가 어시스트핏과 함께 피트니스센터 미디어 광고와 제품 체험을 통해 소비자 접점을 넓혔습니다.":"V Labs expands consumer outreach through a partnership with AssistFit media.","무전원 친환경 휴대용 비데 브랜드 루루안의 마이브이 입점 소식을 소개합니다.":"Eco-friendly portable bidet brand Luluan joins MYV.","안티헤어로스 샴푸의 리얼 블라인드 테스트 평가 자료를 소개합니다.":"Highlights from a blind test evaluation of anti-hairloss shampoo.","뷰티·헬스케어 브랜드 펄케어의 뉴소닉, 화이트진 PRO, 전동 헤어 브러쉬 등 뷰티 디바이스 3종이 마이브이에 입점했습니다.":"Pearlcare adds three beauty and wellness devices to the MYV catalog.","2024년 11월 20일부터 12월 8일까지 진행한 마이브이 블랙프라이데이 프로모션 소식입니다. 뷰티 디바이스와 건강기능식품 등을 할인 판매했습니다.":"Highlights from the MYV Black Friday promotion held in late 2024.","브이랩스가 성남창업센터 킨스타워 정글ON 입주기업으로 선정돼 2025년 1월 입주 계획을 발표했습니다.":"V Labs is selected to join the Seongnam Startup Center's Jungle ON program.","태전그룹 오엔케이의 메멘토플러스, 다시 피오니, 맨파워 쏘팔메토 옥타코사놀 등 건강기능식품 3종이 마이브이에 추가 입점했습니다.":"Three ONK wellness products from Taijeon Group join MYV.","미래생활의 잘풀리는집이 마이브이에 입점했습니다. 롤화장지, 키친타월, 미용티슈, 물티슈 등 생활용품 4종을 소개합니다.":"Household essentials brand Jalpul House joins MYV with a range of everyday products.","국내 칫솔 브랜드 오죤의 컴팩트미세모, 와이드미세모, 롱미세모 칫솔 3종이 마이브이에 입점했습니다.":"Korean toothbrush brand Ozon joins MYV with three brush varieties.","프리미엄 스킨케어 브랜드 베리맘이 마이브이에 입점하며 씨드 세라마이드 라인 등 스킨케어 제품 11종을 선보입니다.":"Premium skincare brand Verymom joins MYV with a range of ceramide-based products.","아멍코스메틱의 파머스시그니처와 러뷰가 마이브이에 입점했습니다. 두 브랜드의 스킨케어 제품과 브랜드 철학을 소개합니다.":"Farmers Signature and Lovew skincare brands become MYV partners.","반려동물 케어 브랜드 완스파파의 순비누 풋 클렌저가 마이브이에 입점했습니다. 브랜드와 제품 개발 이야기를 소개합니다.":"OnesPapa introduces its natural pet paw cleanser to MYV.","브이랩스가 AI 기반 수요 예측을 통해 쇼핑몰 입점 제품을 추천하는 방법 및 장치에 대한 특허 등록 소식을 발표했습니다.":"V Labs announces a patent registration covering AI-driven product demand forecasting.","태전그룹의 지금부터 밸런스 비타민B, 지금부터 코큐텐, 지금부터 활력충전 등 건강기능식품 3종이 마이브이에 추가 입점했습니다.":"Three additional Taijeon Group wellness products join MYV.","남성 케어 브랜드 맨티켓이 마이브이에 입점했습니다. 남성 청결제 인티미트 워시와 스칼프 케어 샴푸를 소개합니다.":"Men's care brand Manticket joins MYV with cleansing and scalp-care products.","친환경 라이프 브랜드 바스틀리가 마이브이에 입점했습니다. 밀짚을 원료로 한 화장지, 키친타월, 미용티슈, 리빙티슈 4종을 소개합니다.":"Eco-friendly lifestyle brand Vastly joins MYV with everyday paper products.","자연 유래 원료를 사용하는 생활용품 브랜드 쿠니의 칫솔, 치약, 샴푸 3종이 마이브이에 입점했습니다.":"Natural lifestyle brand CUNI joins MYV with oral-care and hair-care products.","브이랩스가 2025년 7월 18일 코엑스에서 열린 클린뷰티 스타트업 세미나에 참여했습니다. 이장욱 대표는 마이브이의 보상형 커머스 사업 모델을 소개했습니다.":"V Labs shares MYV's rewards-driven commerce concept at a clean beauty startup event.","화장품 원부자재를 업사이클링하는 브랜드 기분좋음이 마이브이에 입점했습니다. 핸드워시와 브랜드의 환경·나눔 철학을 소개합니다.":"Upcycled hand wash brand Gibunjoeum joins MYV with a focus on responsible consumption."};
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
    if (action) action.textContent = 'Read article →';
  });
  cards.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));
  cards.forEach((card) => grid.appendChild(card));

  const detail = document.createElement('section');
  detail.className = 'news-detail-section';
  detail.setAttribute('data-news-detail', '');
  detail.hidden = true;
  detail.innerHTML =
    '<div class="container"><article class="article-shell">' +
    '<a class="article-back" href="./news.html">← Back to News</a>' +
    '<header class="article-heading"><span class="article-category"></span>' +
    '<h1 id="newsArticleTitle"></h1><div class="article-meta"></div></header>' +
    '<p class="article-lead" id="newsArticleLead"></p>' +
    '<div class="article-content" id="newsArticleContent"></div>' +
    '<div class="article-bottom"><a href="./news.html">Back to News</a></div>' +
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
      content.appendChild(element('p', 'article-empty', 'Article content is being prepared.'));
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
      postPromise = fetch('../news-posts.json?v=20261018-parity01', {cache: 'no-store'})
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
    summary.textContent = (category === 'ALL' ? 'ALL' : category) + ' ' +
      filtered.length.toLocaleString('ko-KR') + ' articles · newest first · ' + page + ' / ' + totalPages + ' pages';

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
      addPageButton('Previous', page - 1, page === 1);
      for (let p = 1; p <= totalPages; p++) addPageButton(String(p), p, false, p === page);
      addPageButton('Next', page + 1, page === totalPages);
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
        heading.textContent = 'Article not found.';
        content.appendChild(element('p', '', 'Please select another article from the news list.'));
        return;
      }
      categoryEl.textContent = post.category || 'MYV';
      heading.textContent = newsTitles[post.id] || post.title;
      document.title = (newsTitles[post.id] || post.title) + ' | MYV NEWS';
      const dated = element('span', '', 'Published ' + post.date);
      meta.appendChild(dated);
      if (post.reportedDate) meta.appendChild(element('span', '', 'Original publication ' + post.reportedDate));
      lead.textContent = summaryTranslations[post.summary] || post.summary || '';
      lead.hidden = !post.summary;
      renderBody(post);
    } catch (error) {
      if (serial !== routeVersion) return;
      heading.textContent = 'Could not load the article.';
      content.appendChild(element('p', '', 'Please try again later.'));
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
