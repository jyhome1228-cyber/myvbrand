// GitHub Actions generated GA4 aggregates; public totals only, no visitor identifiers.
(async()=>{
 const status=document.getElementById('status'),data=document.getElementById('data');
 try{
  const response=await fetch('../data/visitor-stats.json',{cache:'no-store'});
  if(!response.ok)throw Error('통계 파일 없음');
  const d=await response.json();
  if(!d.asOf||!d.today||d.metric!=='page_views_not_unique_visitors')return;
  const count=n=>Number(n||0).toLocaleString('ko-KR');
  for(const [id,item] of [['today',d.today],['yesterday',d.yesterday],['twoDays',d.twoDaysAgo]]){
    document.getElementById(id).textContent=count(item.views);
    document.getElementById(id+'Date').textContent=item.date;
  }
  const table=(id,headers,rows)=>{
   const host=document.getElementById(id);host.replaceChildren();
   const t=document.createElement('table');t.className='visit-table';
   const thead=document.createElement('thead'),tr=document.createElement('tr');
   headers.forEach(h=>{const th=document.createElement('th');th.textContent=h;tr.append(th)});thead.append(tr);t.append(thead);
   const tbody=document.createElement('tbody');rows.forEach(row=>{const tr=document.createElement('tr');row.forEach(value=>{const td=document.createElement('td');td.textContent=String(value);tr.append(td)});tbody.append(tr)});t.append(tbody);host.append(t);
  };
  table('days',['날짜','조회'],d.days.map(x=>[x.date,count(x.views)]));
  table('sources',['유입경로','조회'],d.sources.map(x=>[x.source,count(x.views)]));
  table('pages',['페이지','조회'],d.pages.map(x=>[x.path,count(x.views)]));
  table('devices',['기기','조회'],d.devices.map(x=>[x.device,count(x.views)]));
  document.getElementById('recent').textContent='GitHub 기반 통계는 개인별 방문 기록을 저장하거나 공개하지 않습니다.';
  data.hidden=false;
  status.textContent='GitHub Actions · GA4 집계 연결됨 · 마지막 갱신 '+new Date(d.asOf).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});
  document.getElementById('githubAnalyticsNote')?.remove();
 }catch(error){console.warn('Aggregate analytics not yet available:',error.message)}
})();
