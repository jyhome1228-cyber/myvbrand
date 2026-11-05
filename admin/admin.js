const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const REPOSITORY = 'jyhome1228-cyber/myvbrand';
const API = 'https://api.github.com/repos/' + REPOSITORY;
const STORAGE = 'myv-admin-workspace-v1';
const REVIEWS = [
  ['hero', 'P1', '입점제안 첫 화면 이미지', '이미지 크기·텍스트 겹침·아래 잘림과 남아 있는 손 배경을 정리합니다.', '수정 필요'],
  ['news', 'P1', '뉴스 본문·대표 이미지 보완', '본문 없는 기존 8건을 원문과 대조하고, 추가 소식의 제목·날짜·이미지를 확인합니다.', '수정 필요'],
  ['vpoint', 'P1', 'V.Point 안내와 운영 기준', '멘토·프로슈머 용어와 적립률 설명을 검토하고 지급·소멸·취소 기준을 회사 측에서 확정합니다.', '자료 필요'],
  ['navigation', 'P1', '메뉴 연결과 V.Point 노출', 'WITH US 직접 이동 방식, V.Point 상단 노출, 모바일 하위 메뉴 설명을 정리합니다.', '수정 필요'],
  ['inquiry', 'P1', '문의 수신·접수 관리 연결', '실제 메일 수신을 확인하고 인증이 적용된 문의 저장·조회 환경을 연결합니다.', '확인 필요'],
  ['privacy', 'P1', '개인정보 문구 확정', '현재 임시 문안을 실제 수집 항목·보관 기간·처리 서비스 기준으로 확정합니다.', '자료 필요'],
  ['message', 'P2', '메인 메시지와 가치 전달', '메인 제목을 가치소비·상생 중심으로 보강하고 모바일 첫 화면의 정보량을 점검합니다.', '수정 필요'],
  ['translation', 'P2', '영문 콘텐츠 마무리', '뉴스 본문 번역과 버튼·용어를 통일하고 영문 페이지를 검수합니다.', '수정 필요'],
  ['shop-return', 'P2', '쇼핑몰에서 브랜드 사이트로 돌아오기', '쇼핑몰 운영 화면에 브랜드 홈페이지 복귀 링크가 있는지 확인하고 연결 위치를 결정합니다.', '확인 필요'],
  ['calculator', 'P2', '계산 결과 이후 신청 동선 검토', '계산 결과 바로 아래 신청 버튼과 메인 간단 계산기 추가 여부를 검토합니다. AI 참고안의 추가 제안으로 범위 확정이 필요합니다.', '확인 필요'],
  ['mobile', 'P2', '모바일 전체 검수', '메뉴·이미지·계산기·버튼·줄바꿈을 실제 모바일 화면에서 점검합니다.', '확인 필요'],
  ['proof', 'P2', '브랜드·상품·성과 자료', '실제 입점 로고·제품·프로슈머 사례·검증된 성과 수치를 수급합니다. 따뜻한 포인트 색상은 방향 확정 후 반영합니다.', '자료 필요'],
  ['seo', 'P2', '검색·공유 미리보기·분석', '페이지별 검색 정보·공유 이미지·canonical·404 화면과 방문 분석 연결 범위를 확정합니다.', '수정 필요'],
  ['admin', 'P1', '관리자 운영 연결', '뉴스 편집 화면을 제공하고 저장소 권한 연결 및 실제 배포를 검증합니다. 문의 DB·로그인·통계는 별도 연결이 필요합니다.', '확인 필요']
];
const VIEWS = {
  overview: ['대시보드', '브랜드 운영을 한눈에', '뉴스와 홈페이지의 남은 작업을 확인하세요.'],
  news: ['뉴스 관리', '소식을 쌓고, 가치를 전하세요', '기존 뉴스 확인부터 초안 작성, 미리보기, 사이트 반영까지 관리합니다.'],
  inquiries: ['문의 관리', '함께할 기회를 놓치지 않도록', '현재 문의는 이메일로 접수됩니다. 관리자 목록 수집은 아직 연결되지 않았습니다.'],
  review: ['수정 체크리스트', '남은 작업을 명확하게', '확인한 수정사항과 회사 측 확인이 필요한 내용을 함께 관리합니다.'],
  settings: ['연결 및 백업', '운영 환경을 확인하세요', '뉴스 저장소 연결 상태와 브라우저 초안을 관리합니다.']
};
let posts = [], base = [], changed = new Set(), trash = [], review = {}, activity = [], connected = null;
let view = 'overview', search = '', filter = 'all', category = 'ALL', page = 1, language = 'ko', pendingConfirm;
let loaded = false, busy = false, editorDirty = false, editingOriginal = null, toastTimer;
const clone = value => JSON.parse(JSON.stringify(value));
const normalized = value => JSON.stringify(value);
const sorted = values => [...values].sort((a, b) => b.date.localeCompare(a.date));
const isMissing = post => !String(post.body || '').trim() && post.type !== 'external';
const needsBody = post => !String(post.body || '').trim();
function node(tag, text, className) { const n = document.createElement(tag); if (text != null) n.textContent = text; if (className) n.className = className; return n; }
function button(text, action, className = 'button') { const n = node('button', text, className); n.type = 'button'; n.addEventListener('click', action); return n; }
function tag(text, style = '') { return node('span', text, 'tag ' + style); }
function dateLabel(value) { return new Date(value).toLocaleString('ko-KR', {timeZone:'Asia/Seoul', month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'}); }
function toast(message) { $('#toast').textContent = message; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').hidden = true, 5000); }
function save() {
  try { localStorage.setItem(STORAGE, JSON.stringify({version:1, base, posts, changed:[...changed], trash, review, activity})); $('#saveStatus').textContent = '브라우저 저장 · ' + dateLabel(Date.now()); return true; }
  catch { toast('브라우저 저장 공간이 부족합니다. 연결 및 백업에서 파일로 저장해 주세요.'); return false; }
}
function log(message) { activity.unshift({message, at:Date.now()}); activity = activity.slice(0, 30); }
function webUrl(value) { if (!value) return ''; try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password ? u.href : ''; } catch { return ''; } }
function validateData(data) {
  if (!Array.isArray(data) || data.length > 2000) throw Error('뉴스 배열 형식의 JSON 파일을 선택해 주세요.');
  const ids = new Set();
  for (const item of data) {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !/^[a-zA-Z0-9_-]{1,120}$/.test(item.id) || ids.has(item.id)) throw Error('뉴스 ID가 잘못되었거나 중복되었습니다.');
    if (typeof item.title !== 'string' || typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !['MYV','PARTNER','GLOBAL'].includes(item.category)) throw Error('제목·게시일·분류를 확인해 주세요.');
    for (const key of ['body','summary','titleEn','bodyEn','summaryEn','thumbnail','originalUrl','url']) if (item[key] != null && typeof item[key] !== 'string') throw Error('본문과 링크는 텍스트여야 합니다.');
    ids.add(item.id);
  }
  return data;
}
function panel(title, description, content, action) {
  const p = node('section', null, 'panel'); const head = node('div', null, 'panel-header'); const copy = node('div'); copy.append(node('h2', title)); if (description) copy.append(node('p', description)); head.append(copy); if (action) head.append(action); p.append(head, content); return p;
}
function navigate(target, nextFilter) { if (nextFilter) { filter = nextFilter; search = ''; category = 'ALL'; page = 1; } if (location.hash === '#' + target) { view = target; render(); } else location.hash = target; }
function confirmAction(title, message, action) { $('#confirmTitle').textContent = title; $('#confirmMessage').textContent = message; pendingConfirm = action; $('#confirmDialog').showModal(); }
function showConnection() { $('#connectionError').textContent = ''; $('#githubToken').value = ''; $('#connectionDialog').showModal(); }
function render() {
  const params = VIEWS[view]; $('#crumb').textContent = params[0]; $('#pageTitle').textContent = params[1]; $('#pageDescription').textContent = params[2];
  $$('.sidebar [data-view]').forEach(a => { a.classList.toggle('active', a.dataset.view === view); if (a.dataset.view === view) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  $('#newsNavCount').textContent = posts.length; $('#sidebarStatus').textContent = connected ? '저장소 연결됨' : '브라우저 초안 모드'; $('#modeBadge').textContent = changed.size ? '미반영 변경 ' + changed.size + '건' : '사이트 미반영 변경 없음'; $('#connectionButton').textContent = connected ? '연결 상태' : '저장소 연결';
  $('#pageActions').replaceChildren(); $('#viewContent').replaceChildren();
  if (!loaded) return;
  if (view === 'overview') renderOverview();
  if (view === 'news') renderNews();
  if (view === 'inquiries') renderInquiries();
  if (view === 'review') renderReview();
  if (view === 'settings') renderSettings();
}
function renderOverview() {
  $('#pageActions').append(button('+ 뉴스 작성', () => openEditor(), 'button primary'));
  const metrics = node('div', null, 'metrics');
  [[posts.length,'전체 뉴스','현재 불러온 뉴스',()=>navigate('news','all'),''],[posts.filter(needsBody).length,'본문 미등록','원문 안내 포함 · 본문 보완 대상',()=>navigate('news','missing'),'attention'],[changed.size,'미반영 변경','현재 브라우저에서 저장한 초안',()=>navigate('news','changed'),'active'],[REVIEWS.filter(([id,,,,initial])=>(review[id]||initial)!=='완료').length,'남은 확인 항목','화면·콘텐츠·운영 연결',()=>navigate('review'),'']].forEach(([value,label,hint,action,style])=>{ const m = button('',action,'metric '+style); m.append(node('span',label,'label'),node('strong',Number(value).toLocaleString('ko-KR')),node('small',hint)); metrics.append(m); });
  const grid = node('div',null,'dashboard-grid'); const list = node('div',null,'compact-list');
  sorted(posts).slice(0,5).forEach(p=>{const row=node('div',null,'compact-row'); const copy=node('div');copy.append(button(p.title,()=>openEditor(p.id),'title'),node('small',p.date+' · '+p.category));row.append(copy,tag(needsBody(p)?'본문 미등록':changed.has(p.id)?'수정 초안':'본문 등록',needsBody(p)?'warn':''));list.append(row);});
  grid.append(panel('최근 뉴스','현재 뉴스 데이터 기준 · 최신순',list,button('전체보기 →',()=>navigate('news'),'text-button')));
  const status = node('div',null,'panel-body'); [['뉴스 데이터','연결됨','success'],['사이트 반영 권한',connected?'연결됨':'연결 필요',connected?'success':'warn'],['문의 저장·조회','미연결','muted'],['실제 방문 통계','수집 서버 연결 필요','muted']].forEach(([label,value,style])=>{const r=node('div',null,'connection-row');r.append(node('span',label),tag(value,style));status.append(r);});status.append(node('p','문의와 방문 통계는 실제 연결 후 표시합니다. 초안 저장만으로 홈페이지가 바뀌지는 않습니다.','summary-note'));status.append(node('p','방문 통계 전용 화면에서 수집 서버 연결 후 오늘·어제·엊그제 기록을 조회할 수 있습니다.','summary-note'));const visitorsLink=node('a','방문 기록 보기 →','button');visitorsLink.href='./visitors.html';status.append(visitorsLink);grid.append(panel('운영 연결 상태','작동 범위를 확인하세요',status,button('설정 →',()=>navigate('settings'),'text-button')));
  const quick=node('div',null,'compact-list');REVIEWS.filter(([id,,,,initial])=>(review[id]||initial)!=='완료').slice(0,3).forEach(([id,priority,title,,,])=>{const row=node('div',null,'compact-row');row.append(button(title,()=>navigate('review'),'title'),tag(priority,'muted'));quick.append(row);});
  const lower=panel('먼저 확인할 작업','피드백 대조 결과',quick,button('체크리스트 →',()=>navigate('review'),'text-button'));lower.classList.add('section-gap');$('#viewContent').append(metrics,grid,lower);
}
function renderNews() {
  $('#pageActions').append(button('백업 내보내기',downloadBackup),button('사이트 반영'+(changed.size?' · '+changed.size:''),openPublish),button('+ 뉴스 작성',()=>openEditor(),'button primary'));
  const section=node('section',null,'panel');const toolbar=node('div',null,'toolbar');const searchWrap=node('label',null,'search');const input=node('input');input.type='search';input.placeholder='제목, 요약으로 뉴스 검색';input.value=search;input.setAttribute('aria-label','뉴스 검색');input.addEventListener('input',()=>{search=input.value;page=1;renderNewsTable(section);});searchWrap.append(input);
  const cats=node('select');cats.setAttribute('aria-label','뉴스 분류');['ALL','MYV','PARTNER','GLOBAL'].forEach(v=>{const o=node('option',v==='ALL'?'전체 분류':v);o.value=v;cats.append(o);});cats.value=category;cats.addEventListener('change',()=>{category=cats.value;page=1;renderNewsTable(section);});
  const filters=node('select');filters.setAttribute('aria-label','뉴스 상태');[['all','전체 상태'],['missing','본문 미등록'],['changed','미반영 변경'],['translation','영문 본문 미등록'],['trash','보관함']].forEach(([v,l])=>{const o=node('option',l);o.value=v;filters.append(o);});filters.value=filter;filters.addEventListener('change',()=>{filter=filters.value;page=1;renderNewsTable(section);});toolbar.append(searchWrap,cats,filters);section.append(toolbar,node('div',null,'news-table'));$('#viewContent').append(section);renderNewsTable(section);
}
function renderNewsTable(section) {
  const host=$('.news-table',section);host.replaceChildren();const source=filter==='trash'?trash.map(v=>v.post):posts;
  const filtered=sorted(source).filter(p=>(category==='ALL'||p.category===category)&&(!search||(p.title+' '+(p.summary||'')).toLowerCase().includes(search.toLowerCase()))&&(filter!=='missing'||needsBody(p))&&(filter!=='changed'||changed.has(p.id))&&(filter!=='translation'||!p.bodyEn));
  const pages=Math.max(1,Math.ceil(filtered.length/10));page=Math.min(page,pages);const wrap=node('div',null,'table-wrap');const table=node('table');const thead=node('thead');const tr=node('tr');[['뉴스','news-title-col'],['분류','category-col'],['게시일','date-col'],['상태','status-col'],['관리','action-col']].forEach(([l,c])=>{const th=node('th',l,c);th.scope='col';tr.append(th);});thead.append(tr);table.append(thead);const tbody=node('tbody');
  filtered.slice((page-1)*10,page*10).forEach(p=>{const row=node('tr');const titleCell=node('td');const title=node('div',null,'table-title');if(p.thumbnail&&webUrl(p.thumbnail)){const image=node('img',null,'thumbnail');image.src=p.thumbnail;image.alt='';image.loading='lazy';image.referrerPolicy='no-referrer';image.addEventListener('error',()=>image.replaceWith(node('span','MYV','thumbnail')),{once:true});title.append(image);}else title.append(node('span','MYV','thumbnail'));const copy=node('div');copy.append(button(p.title||'제목 없는 초안',()=>openEditor(p.id),'table-title-button'),node('small',p.bodyEn?'한국어 · English':'한국어 · 영문 본문 미등록'));title.append(copy);titleCell.append(title);const cat=node('td');cat.append(tag(p.category));const state=node('td');state.append(tag(filter==='trash'?'보관 중':changed.has(p.id)?'수정 초안':needsBody(p)?'본문 미등록':'본문 등록',needsBody(p)?'warn':filter==='trash'?'muted':''));const actions=node('td');const actionsInner=node('div',null,'table-actions');if(filter==='trash')actionsInner.append(button('복원',()=>restorePost(p.id),''));else actionsInner.append(button('수정',()=>openEditor(p.id),''),button('보관',()=>archivePost(p.id),''));actions.append(actionsInner);row.append(titleCell,cat,node('td',p.date),state,actions);tbody.append(row);});table.append(tbody);wrap.append(table);host.append(wrap);
  if(!filtered.length)host.append(node('div',filter==='trash'?'보관한 뉴스가 없습니다.':'조건에 맞는 뉴스가 없습니다.','empty'));
  const footer=node('div',null,'table-footer');footer.append(node('span',filtered.length.toLocaleString('ko-KR')+'건 · 최신순'));const pagination=node('nav',null,'pagination');pagination.setAttribute('aria-label','뉴스 목록 페이지');for(let i=1;i<=pages;i++){const b=button(String(i),()=>{page=i;renderNewsTable(section);},'');b.setAttribute('aria-label',i+'페이지');if(i===page)b.setAttribute('aria-current','page');pagination.append(b);}footer.append(pagination);host.append(footer);
}
function renderInquiries() {
  const root=$('#viewContent');
  const intro=node('div',null,'panel-body');
  intro.append(tag('접수 서버 연결 필요','warn'),node('h2','프로슈머 · 입점제안 · 일반 문의 통합 관리'),node('p','현재 홈페이지의 문의는 FormSubmit을 통해 info@myv.co.kr 이메일로 전송됩니다. 이 화면은 실제 문의 내역을 조회하지 않으며, 고객 정보는 공개 GitHub 저장소나 브라우저 저장소에 보관하지 않습니다.','note'));
  const mail=node('a','현재 문의 수신 이메일 ↗','button');mail.href='mailto:info@myv.co.kr';intro.append(mail);
  root.append(panel('접수 연결 현황','운영 데이터가 연결되면 아래 유형별로 자동 분류됩니다.',intro));
  const categories=[
    {id:'prosumer',title:'프로슈머 신청',description:'참여 신청자 · 활동 채널 · 신청 목적',status:['신규','확인','검토 중','승인','반려']},
    {id:'partner',title:'사업자 · 브랜드 입점',description:'브랜드명 · 담당자 · 제품 제안 · 제휴 문의',status:['신규','확인','제품 검토','협의 중','완료']},
    {id:'general',title:'일반 문의',description:'서비스 문의 · 제휴 문의 · 기타',status:['신규','확인','답변 준비','답변 완료']}
  ];
  const tabs=node('div',null,'toolbar');
  const content=node('div',null,'panel-body');
  function showCategory(category){
    [...tabs.children].forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.category===category.id)));
    content.replaceChildren();
    content.append(node('h2',category.title),node('p',category.description,'note'));
    const states=node('div',null,'service-grid');
    category.status.forEach(status=>{const item=node('article',null,'service-card');item.append(tag(status,'muted'),node('h3','—'),node('p','실제 데이터 연동 후 표시'));states.append(item);});
    content.append(states);
    const empty=node('div','접수 데이터베이스가 연결되지 않아 표시할 신청 내역이 없습니다.','empty');empty.setAttribute('role','status');content.append(empty);
    const action=node('a','해당 유형 신청 화면 확인 ↗','button');action.href='../contact.html?type='+category.id;action.target='_blank';action.rel='noopener noreferrer';content.append(action);
  }
  categories.forEach((category,i)=>{const btn=button(category.title,()=>showCategory(category),'button');btn.dataset.category=category.id;btn.setAttribute('aria-pressed','false');tabs.append(btn);});
  const wrapper=node('section',null,'panel');wrapper.append(tabs,content);root.append(wrapper);showCategory(categories[0]);
  const workflow=node('div',null,'panel-body');
  [['1. 신청 접수','홈페이지 문의 폼에서 서버 API로 저장하고 유형을 자동 분류'],['2. 담당자 확인','인증된 관리자만 연락처·신청 내용 조회'],['3. 처리 단계','신규 → 검토 → 답변·승인·반려 상태 변경'],['4. 운영 기록','담당자 메모·변경 이력·보관 및 삭제 정책 적용']].forEach(([title,desc])=>{const row=node('div',null,'connection-row');row.append(node('strong',title),node('span',desc));workflow.append(row);});
  root.append(panel('운영 처리 흐름','실제 서버 연결 시 적용할 기준',workflow));
}
function renderReview() {
  $('#pageActions').append(button('체크리스트 내보내기',()=>download('myv-review-checklist.json',REVIEWS.map(([id,priority,title,description,status])=>({id,priority,title,description,status:review[id]||status})))));
  const body=node('div',null,'checklist');REVIEWS.forEach(([id,priority,title,description,initial])=>{const row=node('div',null,'check-item');const copy=node('div');copy.append(node('h3',title),node('p',description));const select=node('select');select.setAttribute('aria-label',title+' 상태');['수정 필요','확인 필요','자료 필요','완료'].forEach(v=>{const o=node('option',v);o.value=v;select.append(o);});select.value=review[id]||initial;select.addEventListener('change',()=>{review[id]=select.value;log(title+' · '+select.value);save();toast('체크리스트 상태를 이 브라우저에 저장했습니다.');});row.append(node('span',priority,'priority'),copy,select);body.append(row);});$('#viewContent').append(panel('홈페이지 수정·확인 목록','완료 표시는 담당자가 실제 반영을 확인한 뒤 선택하세요.',body),node('p','체크리스트 상태는 현재 브라우저에 저장됩니다. 상태 변경 자체가 홈페이지를 수정하지는 않습니다.','note'));
}
function renderSettings() {
  const grid=node('div',null,'settings-grid');const repo=node('div',null,'panel-body');const dl=node('dl',null,'setting-detail');[['저장소',REPOSITORY],['반영 브랜치','main'],['연결 상태',connected?'연결됨 · 뉴스 저장 가능':'미연결 · 편집 및 백업 가능'],['실제 반영','초안 저장 → 저장소 연결 → 사이트 반영 → GitHub Pages 배포']].forEach(([k,v])=>dl.append(node('dt',k),node('dd',v)));repo.append(dl);const actions=node('div',null,'setting-buttons');actions.append(button(connected?'다시 연결':'저장소 연결',showConnection,'button primary'));if(connected)actions.append(button('연결 해제',()=>{connected=null;render();toast('저장소 연결을 해제했습니다.');}));repo.append(actions);grid.append(panel('사이트 연결','GitHub를 통해 공개 뉴스 데이터만 반영합니다.',repo));
  const backup=node('div',null,'panel-body');backup.append(node('p','기존 뉴스와 수정 초안, 보관함, 체크리스트를 한 파일로 저장할 수 있습니다. 복원 전에 현재 작업을 백업해 주세요.','note'));const backupActions=node('div',null,'setting-buttons');backupActions.append(button('백업 내보내기',downloadBackup,'button primary'));const input=node('input');input.type='file';input.accept='.json,application/json';input.hidden=true;input.id='importFile';input.addEventListener('change',importBackup);backupActions.append(button('백업 가져오기',()=>input.click()),input);backup.append(backupActions,node('p','토큰과 고객 문의 정보는 백업에 포함하지 않습니다. 브라우저 데이터를 지우면 저장한 초안이 사라질 수 있습니다.','note'));grid.append(panel('초안 백업·복원','저장 위치: 현재 브라우저',backup));$('#viewContent').append(grid);
  const recent=node('div',null,'compact-list');if(!activity.length)recent.append(node('p','현재 브라우저의 작업 기록이 없습니다.','note'));activity.slice(0,8).forEach(a=>{const row=node('div',null,'compact-row');row.append(node('span',a.message,'title'),node('small',dateLabel(a.at)));recent.append(row);});const logPanel=panel('최근 작업','현재 브라우저에서 수행한 작업',recent);logPanel.classList.add('section-gap');$('#viewContent').append(logPanel);
}
function openEditor(id) {
  const p=posts.find(p=>p.id===id);if(id&&!p)return;editingOriginal=p?clone(p):null;editorDirty=false;$('#editorForm').reset();$('#postId').value=p?.id||'myv-'+Date.now();$('#editorTitle').textContent=p?'뉴스 수정':'새 뉴스 작성';$('#postCategory').value=p?.category||'MYV';$('#postDate').value=p?.date||new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
  const fields={postTitle:'title',postSummary:'summary',postBody:'body',postTitleEn:'titleEn',postSummaryEn:'summaryEn',postBodyEn:'bodyEn',postThumbnail:'thumbnail'};for(const [key,value]of Object.entries(fields))$('#'+key).value=p?.[value]||'';$('#postOriginal').value=p?.originalUrl||(webUrl(p?.url)?p.url:'');$('#externalOnly').checked=p?.type==='external'&&!p?.body;$('#editorError').textContent='';setLanguage('ko');renderPreview();$('#editorDialog').showModal();
}
function setLanguage(locale) { language=locale;$('#koFields').hidden=locale!=='ko';$('#enFields').hidden=locale!=='en';$$('[data-language]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.language===locale)));renderPreview(); }
function formPost() {return {...(editingOriginal||{}),id:$('#postId').value,title:$('#postTitle').value.trim(),date:$('#postDate').value,category:$('#postCategory').value,summary:$('#postSummary').value.trim(),body:$('#postBody').value.trim(),titleEn:$('#postTitleEn').value.trim(),summaryEn:$('#postSummaryEn').value.trim(),bodyEn:$('#postBodyEn').value.trim(),thumbnail:$('#postThumbnail').value.trim(),originalUrl:$('#postOriginal').value.trim(),type:$('#externalOnly').checked?'external':'article',url:$('#externalOnly').checked?$('#postOriginal').value.trim():('./news.html?article='+encodeURIComponent($('#postId').value))};}
function renderRich(parent,text) {
  for(const paragraph of text.split(/\n\s*\n/)){const value=paragraph.trim();if(!value)continue;if(/^https?:\/\/\S+\.(webp|png|jpe?g)(\?\S*)?$/i.test(value)&&webUrl(value)){const image=node('img');image.src=value;image.alt='본문 이미지';image.referrerPolicy='no-referrer';parent.append(image);continue;}const h=value.startsWith('## ');const line=node(h?'h2':'p');const source=h?value.slice(3):value;const pattern=/\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;let end=0;for(const match of source.matchAll(pattern)){line.append(document.createTextNode(source.slice(end,match.index)));if(match[1])line.append(node('strong',match[1]));else {const a=node('a',match[2]);a.href=webUrl(match[3]);a.target='_blank';a.rel='noopener noreferrer';line.append(a);}end=match.index+match[0].length;}line.append(document.createTextNode(source.slice(end)));parent.append(line);}
}
function renderPreview() {const p=formPost();const target=$('#postPreview');target.replaceChildren();const english=language==='en';target.append(node('p',p.category+' · '+p.date,'preview-meta'),node('h1',(english?p.titleEn:p.title)|| (english?'English title':'뉴스 제목')));const summary=english?p.summaryEn:p.summary;if(summary)target.append(node('p',summary,'preview-summary'));if(webUrl(p.thumbnail)){const image=node('img');image.src=p.thumbnail;image.alt='대표 이미지 미리보기';image.referrerPolicy='no-referrer';image.addEventListener('error',()=>image.replaceWith(node('p','대표 이미지를 불러오지 못했습니다. 주소를 확인해 주세요.','note')),{once:true});target.append(image);}const body=english?p.bodyEn:p.body;if(body)renderRich(target,body);else target.append(node('p',p.type==='external'?'원문 링크로 안내합니다.':english?'영문 본문을 입력해 주세요.':'본문을 입력하면 여기에 표시됩니다.','note'));}
function editorErrors(p,forPublish=false) {const errors=[];if(!p.title)errors.push('제목을 입력해 주세요.');if(!p.date||!/^\d{4}-\d{2}-\d{2}$/.test(p.date))errors.push('게시일을 확인해 주세요.');if(p.thumbnail&&!webUrl(p.thumbnail))errors.push('대표 이미지 URL은 http 또는 https 주소로 입력해 주세요.');if(p.originalUrl&&!webUrl(p.originalUrl))errors.push('원문 URL을 확인해 주세요.');if(p.type==='external'&&!webUrl(p.originalUrl||p.url))errors.push('원문 안내를 사용하려면 원문 링크가 필요합니다.');if(forPublish&&p.type!=='external'&&!String(p.body||'').trim())errors.push('사이트 반영 전 본문을 작성하거나 원문 안내를 선택해 주세요.');return errors;}
function archivePost(id) {const p=posts.find(p=>p.id===id);confirmAction('뉴스를 보관함으로 옮길까요?','보관한 뉴스는 복원할 수 있습니다. 사이트 반영을 진행하기 전까지 공개 홈페이지는 유지됩니다.',()=>{posts=posts.filter(p=>p.id!==id);trash.unshift({post:p,at:Date.now()});changed.add(id);log('뉴스 보관 · '+p.title);save();render();toast('보관함으로 이동했습니다. 사이트에는 아직 반영되지 않았습니다.');});}
function restorePost(id) {const item=trash.find(t=>t.post.id===id);if(!item)return;posts.push(item.post);trash=trash.filter(t=>t.post.id!==id);changed.add(id);log('뉴스 복원 · '+item.post.title);save();render();toast('뉴스를 복원했습니다.');}
function download(name,value) {const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function downloadBackup() {download('myv-admin-backup-'+new Date().toISOString().slice(0,10)+'.json',{version:1,exportedAt:new Date().toISOString(),repository:REPOSITORY,base,posts,changed:[...changed],trash,review,activity});toast('백업 파일을 내보냈습니다.');}
async function importBackup(event) {const file=event.target.files[0];if(!file)return;try{if(file.size>10000000)throw Error('10MB 이하 JSON 파일을 선택해 주세요.');const data=JSON.parse(await file.text());const imported=validateData(Array.isArray(data)?data:data.posts);if(data.trash)validateData(data.trash.map(t=>t.post));if(data.base)validateData(data.base);confirmAction('백업 데이터를 가져올까요?','현재 브라우저의 뉴스 초안이 선택한 파일로 바뀝니다. 공개 홈페이지는 사이트 반영 전까지 유지됩니다.',()=>{const original=clone(base);posts=clone(imported);base=data.base?clone(data.base):original;changed=new Set([...posts.map(p=>p.id),...base.map(p=>p.id)]);trash=Array.isArray(data.trash)?data.trash:[];review=data.review&&typeof data.review==='object'?data.review:{};activity=[];connected=null;log('백업 가져오기 · '+file.name);save();render();toast('백업을 가져왔습니다. 사이트 반영 전 내용을 확인해 주세요.');});}catch(error){toast(error.message);}finally{event.target.value='';}}
async function github(path,options={}) {const response=await fetch(API+path,{...options,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10',Authorization:'Bearer '+connected.token,...options.headers},cache:'no-store'});if(!response.ok){if(response.status===409||response.status===422)throw Error('다른 변경이 먼저 반영됐습니다. 백업 후 최신 데이터를 다시 불러와 주세요.');if(response.status===401||response.status===403)throw Error('토큰이 만료되었거나 저장소 권한이 부족합니다. Contents 읽기·쓰기 권한을 확인해 주세요.');throw Error('저장소 요청에 실패했습니다. ('+response.status+')');}return response.json();}
function decodeContent(content) {return new TextDecoder().decode(Uint8Array.from(atob(content.replace(/\s/g,'')),c=>c.charCodeAt(0)));}
function encodeContent(content) {const bytes=new TextEncoder().encode(content);let binary='';for(let start=0;start<bytes.length;start+=32768)binary+=String.fromCharCode(...bytes.subarray(start,start+32768));return btoa(binary);}
function mergeRemote(remote) {const byBase=new Map(base.map(p=>[p.id,p]));const byRemote=new Map(remote.map(p=>[p.id,p]));for(const id of changed){if(normalized(byBase.get(id))!==normalized(byRemote.get(id)))throw Error('수정 중인 뉴스가 저장소에서도 변경됐습니다. 백업을 내보낸 뒤 최신 데이터와 대조해 주세요.');}const local=new Map(posts.map(p=>[p.id,p]));const result=remote.filter(p=>!changed.has(p.id));for(const id of changed){if(local.has(id))result.push(local.get(id));}return sorted(result);}
async function openPublish() {if(!changed.size){toast('사이트에 반영할 변경사항이 없습니다.');return;}if(!connected){showConnection();toast('초안은 저장되어 있습니다. 저장소를 먼저 연결해 주세요.');return;}const items=posts.filter(p=>changed.has(p.id));const errors=items.flatMap(p=>editorErrors(p,true).map(m=>p.title+': '+m));if(errors.length){toast(errors[0]);return;}$('#publishSummary').replaceChildren();const list=node('ul');for(const id of changed){const p=posts.find(p=>p.id===id)||base.find(p=>p.id===id);if(p)list.append(node('li',(posts.some(p=>p.id===id)?'반영 · ':'목록 제외 · ')+p.title));}$('#publishSummary').append(node('strong','변경 '+changed.size+'건'),list);$('#publishError').textContent='';$('#publishDialog').showModal();}
async function publish() {if(busy||!connected)return;busy=true;$('#confirmPublish').disabled=true;try{const current=await github('/contents/news-posts.json?ref=main');const remote=validateData(JSON.parse(decodeContent(current.content)));const merged=mergeRemote(remote);for(const p of merged.filter(p=>changed.has(p.id))){const errors=editorErrors(p,true);if(errors.length)throw Error(errors[0]);}const response=await github('/contents/news-posts.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'content: update MYV news from admin',content:encodeContent(JSON.stringify(merged,null,2)+'\n'),sha:current.sha,branch:'main'})});posts=clone(merged);base=clone(merged);changed.clear();connected.sha=response.content.sha;log('뉴스 저장소 반영 · '+response.commit.sha.slice(0,7));save();$('#publishDialog').close();render();toast('저장소에 반영했습니다. 홈페이지는 GitHub Pages 배포 완료 후 갱신됩니다.');}catch(error){$('#publishError').textContent=error.message;}finally{busy=false;$('#confirmPublish').disabled=false;}}
$('#editorForm').addEventListener('submit',event=>{event.preventDefault();const p=formPost();const errors=editorErrors(p);if(errors.length){$('#editorError').textContent=errors.join('\n');return;}const i=posts.findIndex(item=>item.id===p.id);if(i<0)posts.push(p);else posts[i]=p;changed.add(p.id);log('뉴스 초안 저장 · '+p.title);save();editorDirty=false;$('#editorDialog').close();render();toast('초안을 저장했습니다. 사이트에는 아직 반영되지 않았습니다.');});
$('#editorForm').addEventListener('input',()=>{editorDirty=true;renderPreview();});$('#editorForm').addEventListener('change',()=>{editorDirty=true;renderPreview();});$$('[data-language]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));
function closeDialog(id) {if(id==='editorDialog'&&editorDirty){confirmAction('저장하지 않고 닫을까요?','편집 중인 내용은 초안 저장을 누르기 전까지 보관되지 않습니다.',()=>{editorDirty=false;$('#editorDialog').close();});return;}if(id==='connectionDialog')$('#githubToken').value='';$('#'+id).close();}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.dataset.close)));$('#editorDialog').addEventListener('cancel',e=>{if(editorDirty){e.preventDefault();closeDialog('editorDialog');}});$('#connectionDialog').addEventListener('close',()=>$('#githubToken').value='');
$('#confirmAction').addEventListener('click',()=>{const action=pendingConfirm;pendingConfirm=null;$('#confirmDialog').close();action?.();});$('#confirmPublish').addEventListener('click',publish);$('#connectionButton').addEventListener('click',()=>connected?navigate('settings'):showConnection());
$('#connectForm').addEventListener('submit',async event=>{event.preventDefault();if(busy)return;busy=true;$('#connectSubmit').disabled=true;$('#connectionError').textContent='';const previous=connected;try{connected={token:$('#githubToken').value.trim()};const current=await github('/contents/news-posts.json?ref=main');const remote=validateData(JSON.parse(decodeContent(current.content)));posts=mergeRemote(remote);base=clone(remote);connected.sha=current.sha;$('#githubToken').value='';save();$('#connectionDialog').close();render();toast('저장소에 연결했습니다. 초안을 확인하고 사이트 반영을 진행하세요.');}catch(error){connected=previous;$('#connectionError').textContent=error.message;}finally{busy=false;$('#connectSubmit').disabled=false;}});
function setMobileNav(open) {
  const mobile=window.matchMedia('(max-width:760px)').matches;
  const expanded=mobile&&open;
  $('#sidebar').classList.toggle('open',expanded);
  $('#sidebar').inert=mobile&&!expanded;
  $('.workspace').inert=expanded;
  $('#navBackdrop').hidden=!expanded;
  $('#menuToggle').setAttribute('aria-expanded',String(expanded));
  if(expanded)$('#sidebarClose').focus();
}
$('#menuToggle').addEventListener('click',()=>setMobileNav(!$('#sidebar').classList.contains('open')));
$('#sidebarClose').addEventListener('click',()=>{setMobileNav(false);$('#menuToggle').focus();});
$('#navBackdrop').addEventListener('click',()=>setMobileNav(false));
$$('.sidebar a').forEach(a=>a.addEventListener('click',()=>setMobileNav(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMobileNav(false);}});
window.addEventListener('resize',()=>{if(!window.matchMedia('(max-width:760px)').matches)setMobileNav(false);});
setMobileNav(false);
window.addEventListener('hashchange',()=>{view=VIEWS[location.hash.slice(1)]?location.hash.slice(1):'overview';setMobileNav(false);render();});window.addEventListener('beforeunload',e=>{if(editorDirty){e.preventDefault();e.returnValue='';}});
async function init() {
  view=VIEWS[location.hash.slice(1)]?location.hash.slice(1):'overview';render();
  try{const response=await fetch('../news-posts.json',{cache:'no-store'});if(!response.ok)throw Error('뉴스 데이터를 불러오지 못했습니다.');const current=validateData(await response.json());base=clone(current);posts=clone(current);
    const stored=localStorage.getItem(STORAGE);if(stored){try{const data=JSON.parse(stored);validateData(data.posts);validateData(data.base);if(data.trash)validateData(data.trash.map(t=>t.post));changed=new Set(data.changed||[]);posts=data.posts;base=data.base;trash=data.trash||[];review=data.review||{};activity=data.activity||[];if(!changed.size){posts=clone(current);base=clone(current);}else{try{const merged=mergeRemote(current);posts=merged;base=clone(current);}catch{toast('저장된 초안과 최신 사이트에 겹치는 변경이 있습니다. 백업 후 대조해 주세요.');}}}catch(error){toast('저장된 초안을 복원하지 못했습니다. 현재 사이트 데이터를 표시합니다.');changed.clear();posts=clone(current);base=clone(current);}}
    loaded=true;$('#loadState').hidden=true;render();
  }catch(error){$('#loadState').textContent=error.message+' 새로고침 후 다시 확인해 주세요.';}
}
init();
