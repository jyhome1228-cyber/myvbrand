// Public, aggregate-only GitHub visitor dashboard. No login or personal identifiers.
(async()=>{
 const $=id=>document.getElementById(id);
 const status=$('status'),section=$('data');
 const fmt=n=>Number(n||0).toLocaleString('ko-KR');
 const kst=()=>{
   const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
   const a=Object.fromEntries(parts.map(p=>[p.type,p.value]));
   return a.year+'-'+a.month+'-'+a.day;
 };
 const now=kst();
 const [year,month,day]=now.split('-').map(Number);
 const dayOfWeek=new Date(Date.UTC(year,month-1,day)).getUTCDay();
 const mondayDate=new Date(Date.UTC(year,month-1,day-((dayOfWeek+6)%7)));
 const monday=mondayDate.toISOString().slice(0,10);
 const monthStart=now.slice(0,7)+'-01';
 const makeTable=(id,headers,rows)=>{
   const host=$(id);if(!host)return;
   host.replaceChildren();
   if(!rows.length){const p=document.createElement('p');p.className='visit-empty';p.textContent='집계된 데이터가 없습니다.';host.append(p);return;}
   const table=document.createElement('table');table.className='visit-table';
   const head=document.createElement('thead'),tr=document.createElement('tr');
   headers.forEach(h=>{const th=document.createElement('th');th.textContent=h;tr.append(th)});
   head.append(tr);table.append(head);
   const body=document.createElement('tbody');
   rows.forEach(values=>{const tr=document.createElement('tr');values.forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.append(td)});body.append(tr)});
   table.append(body);host.append(table);
 };
 try{
   const r=await fetch('../data/visitor-stats.json?ts='+Date.now(),{cache:'no-store'});
   if(!r.ok)throw Error('stats-not-found');
   const data=await r.json();
   if(!data.asOf || !data.today || data.connected===false){
     status.textContent='집계된 방문 데이터가 없습니다.';
     return;
   }
   const daily=(Array.isArray(data.days)?data.days:[]).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&Number.isFinite(Number(x.views)));
   const sum=minimum=>daily.filter(x=>x.date>=minimum&&x.date<=now).reduce((a,x)=>a+Number(x.views),0);
   const visitorMode=data.metric==='daily_browser_visits';
   const unit=visitorMode?'방문':'페이지 조회';
   const latest=daily.find(x=>x.date===now);
   const today=latest?Number(latest.views):(data.today?.date===now?Number(data.today.views||0):0);
   $('today').textContent=fmt(today);
   $('yesterday').textContent=fmt(sum(monday));
   $('twoDays').textContent=fmt(sum(monthStart));
   $('todayDate').textContent=now;
   $('yesterdayDate').textContent=monday+' ~ '+now;
   $('twoDaysDate').textContent=monthStart+' ~ '+now;
   const labels=document.querySelectorAll('.visit-stat>span');
   ['오늘 '+unit,'이번 주 '+unit,'이번 달 '+unit].forEach((label,i)=>{if(labels[i])labels[i].textContent=label;});
   const week=[];
   for(let i=0;i<7;i++){
     const d=new Date(mondayDate.getTime()+i*86400000).toISOString().slice(0,10);
     if(d>now)break;
     const day=daily.find(x=>x.date===d);
     week.push([d,day?fmt(day.views):'—']);
   }
   makeTable('days',['날짜',unit],week);
   makeTable('sources',['유입경로',unit],(data.sources||[]).map(x=>[x.source||'직접 유입',fmt(x.views)]).slice(0,30));
   makeTable('pages',['방문 페이지',unit],(data.pages||[]).map(x=>[x.path||'/',fmt(x.views)]).slice(0,30));
   makeTable('devices',['기기',unit],(data.devices||[]).map(x=>[x.device||'기타',fmt(x.views)]).slice(0,20));
   $('recent').textContent='방문자 개인 식별정보는 제공하지 않습니다. 이번 주는 '+monday+'부터이며, 수집 이전 기간은 표시되지 않을 수 있습니다.';
   status.textContent=unit+' 기준 · 최근 집계 '+new Date(data.asOf).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});
   section.hidden=false;
 }catch(_){status.textContent='방문 집계 파일을 확인하지 못했습니다.';}
})();