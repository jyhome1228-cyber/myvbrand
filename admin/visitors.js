const $=s=>document.querySelector(s);
let endpoint='',token='';
const status=$('#status'),data=$('#data');
function notice(text){status.textContent=text}
function labelSource(s){if(s==='direct')return '직접 방문 / 출처 없음';if(/google\./.test(s))return 'Google';if(/naver\./.test(s))return '네이버';if(/daum\.|kakao\./.test(s))return '다음 / 카카오';if(/chatgpt\.com|openai\.com/.test(s))return 'ChatGPT';if(/bing\./.test(s))return 'Bing';return s}
function table(host,heads,rows){host.replaceChildren();if(!rows.length){const x=document.createElement('p');x.className='visit-empty';x.textContent='해당 기간의 기록이 없습니다.';host.append(x);return}
 const t=document.createElement('table');t.className='visit-table';const th=document.createElement('thead'),tr=document.createElement('tr');
 heads.forEach(h=>{const a=document.createElement('th');a.textContent=h;a.scope='col';tr.append(a)});th.append(tr);t.append(th);const body=document.createElement('tbody');
 rows.forEach(row=>{const tr=document.createElement('tr');row.forEach(value=>{const td=document.createElement('td');td.textContent=String(value);tr.append(td)});body.append(tr)});t.append(body);host.append(t)}
function count(n){return Number(n||0).toLocaleString('ko-KR')}
function render(d){
 $('#today').textContent=count(d.today.views);$('#todayDate').textContent=d.today.date;
 $('#yesterday').textContent=count(d.yesterday.views);$('#yesterdayDate').textContent=d.yesterday.date;
 $('#twoDays').textContent=count(d.twoDaysAgo.views);$('#twoDaysDate').textContent=d.twoDaysAgo.date;
 table($('#days'),['날짜','페이지 조회'],d.days.map(r=>[r.date,count(r.views)]));
 table($('#sources'),['유입경로','페이지 조회'],d.sources.map(r=>[labelSource(r.source),count(r.views)]));
 table($('#pages'),['페이지','조회'],d.pages.map(r=>[r.path,count(r.views)]));
 table($('#devices'),['기기','조회'],d.devices.map(r=>[r.device,count(r.views)]));
 table($('#recent'),['방문 시간 (KST)','페이지','유입경로','기기'],d.recent.map(r=>[new Date(r.at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}),r.path,labelSource(r.source),r.device]));
 data.hidden=false;notice('연결됨 · 최근 30일 페이지 조회 통계 · 마지막 갱신 '+new Date(d.asOf).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}));
}
async function load(){
 if(!endpoint){notice('수집 API가 연결되지 않았습니다. analytics-config.json에 실제 Worker 주소를 설정해야 방문 기록이 수집됩니다.');return}
 if(!token){notice('통계 조회 권한 키를 입력하면 실제 방문 기록을 확인할 수 있습니다.');return}
 notice('실제 방문 기록을 불러오는 중입니다.');$('#refresh').disabled=true;
 try{const r=await fetch(new URL('/stats',endpoint),{headers:{Authorization:'Bearer '+token},cache:'no-store',credentials:'omit'});
 if(!r.ok)throw Error(r.status===401?'인증키를 확인해 주세요.':'통계 API 오류: '+r.status);
 const d=await r.json();if(d.metric!=='page_views_not_unique_visitors')throw Error('응답 형식을 확인해 주세요.');
 render(d);$('#refresh').disabled=false;
 }catch(e){data.hidden=true;notice('조회 실패: '+e.message)}
}
$('#connect').addEventListener('submit',e=>{e.preventDefault();token=$('#token').value.trim();$('#token').value='';load()});
$('#refresh').addEventListener('click',load);
fetch('../analytics-config.json',{cache:'no-store'}).then(r=>r.json()).then(c=>{if(c.endpoint&&new URL(c.endpoint).protocol==='https:'){endpoint=c.endpoint.replace(/\/$/,'');notice('수집 API 주소 확인됨 · 관리자 조회 키를 입력해 주세요.')}else notice('방문 기록 수집 서버 연결 전입니다. Cloudflare Worker를 배포하고 analytics-config.json의 endpoint를 설정해야 합니다.')}).catch(()=>notice('방문 분석 설정 파일을 확인하지 못했습니다.'));
