// MYV authenticated Firestore analytics (same daily-visit method as previous sites).
// Only Firebase admins/{uid}.active=true may read visit events.
import { initializeApp, getApp, getApps } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js';
import { getFirestore, collection, doc, getDoc, getDocs, orderBy, query, limit } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';
const app=getApps().length?getApp():initializeApp({
  apiKey:'AIzaSyCu-ek497FAXQKwJly2ZS8SMYdy2MarA8',
  authDomain:'myvbrand.firebaseapp.com',
  projectId:'myvbrand',
  appId:'1:88568118294:web:c31000e615086ba1aa0937'
});
const auth=getAuth(app), db=getFirestore(app);
const $=s=>document.querySelector(s);
const el=(tag,value)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=String(value);return n;};
const status=$('#status'), data=$('#data');
const key=n=>{
  const parts=new Intl.DateTimeFormat('en-CA',{
    timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(new Date(n));
  const m=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return m.year+'-'+m.month+'-'+m.day;
};
const today=key(Date.now()),yesterday=key(Date.now()-86400000);
const twoDays=key(Date.now()-2*86400000);
const parts=today.split('-').map(Number);
const monthStart=today.slice(0,7)+'-01';
const weekday=new Date(Date.UTC(parts[0],parts[1]-1,parts[2])).getUTCDay();
const weekStart=key(Date.UTC(parts[0],parts[1]-1,parts[2]-((weekday+6)%7),12)-9*3600000);
const count=n=>Number(n||0).toLocaleString('ko-KR');
let currentUser=null;
function table(id,columns,rows){
  const host=$(id);if(!host)return;
  host.replaceChildren();
  if(!rows.length){host.append(el('p','해당 기간에 집계된 기록이 없습니다.'));return;}
  const t=el('table');t.className='visit-table';const head=el('thead'),headRow=el('tr');
  columns.forEach(v=>{const th=el('th',v);th.scope='col';headRow.append(th)});head.append(headRow);t.append(head);
  const body=el('tbody');
  rows.forEach(row=>{const tr=el('tr');row.forEach(v=>tr.append(el('td',v)));body.append(tr)});
  t.append(body);host.append(t);
}
function aggregate(list,keyName){
  const counts=new Map();
  list.forEach(x=>{const val=String(x[keyName]||'direct');counts.set(val,(counts.get(val)||0)+1)});
  return [...counts].sort((a,b)=>b[1]-a[1]).slice(0,30);
}
function authForm(message='방문 기록을 확인하려면 운영 계정으로 로그인해 주세요.'){
  data.hidden=true;
  status.replaceChildren(el('p',message));
  const form=el('form');form.className='visit-controls';
  const email=el('input');email.type='email';email.placeholder='관리자 이메일';email.autocomplete='username';email.required=true;
  const password=el('input');password.type='password';password.placeholder='비밀번호';password.autocomplete='current-password';password.required=true;
  const button=el('button','로그인');button.type='submit';button.className='button primary';
  form.append(email,password,button);status.append(form);
  form.addEventListener('submit',async e=>{
    e.preventDefault();button.disabled=true;
    try {await signInWithEmailAndPassword(auth,email.value.trim(),password.value)}
    catch(_){authForm('로그인 정보를 확인해 주세요.')}
  });
}
async function refresh(){
  if(!currentUser)return;
  status.textContent='방문 현황을 불러오는 중입니다.';
  try{
    const snap=await getDocs(query(collection(db,'visits'),orderBy('date','desc'),limit(5000)));
    const rows=snap.docs.map(d=>d.data()).filter(x=>typeof x.date==='string'&&x.date>=key(Date.now()-29*86400000)&&x.date<=today);
    const totalOn=date=>rows.filter(x=>x.date===date).length;
    const weekly=rows.filter(x=>x.date>=weekStart).length;
    const monthly=rows.filter(x=>x.date>=monthStart).length;
    $('#today').textContent=count(totalOn(today));
    $('#yesterday').textContent=count(weekly);
    $('#twoDays').textContent=count(monthly);
    $('#todayDate').textContent=today;
    $('#yesterdayDate').textContent=weekStart+' ~ '+today;
    $('#twoDaysDate').textContent=monthStart+' ~ '+today;
    const labels=document.querySelectorAll('.visit-stat>span');
    if(labels[0])labels[0].textContent='오늘 방문';
    if(labels[1])labels[1].textContent='이번 주 방문';
    if(labels[2])labels[2].textContent='이번 달 방문';
    const dates=aggregate(rows,'date').sort((a,b)=>b[0].localeCompare(a[0]));
    table('#days',['날짜','방문'],dates.map(([k,v])=>[k,count(v)]));
    table('#sources',['유입 도메인','방문'],aggregate(rows,'source').map(([k,v])=>[k,count(v)]));
    table('#pages',['첫 방문 페이지','방문'],aggregate(rows,'path').map(([k,v])=>[k,count(v)]));
    table('#devices',['기기','방문'],aggregate(rows,'device').map(([k,v])=>[k,count(v)]));
    const recent=rows.slice(0,100).map(x=>[
      x.createdAt?.toDate?.().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})||x.date,
      x.path||'/',x.source||'direct',x.device||'desktop'
    ]);
    table('#recent',['기록 시각','첫 페이지','유입경로','기기'],recent);
    status.textContent='최근 30일 기록 · 브라우저별 하루 1회 기준';
    data.hidden=false;
  }catch(error){
    status.textContent='방문 현황을 확인할 수 없습니다.';
    data.hidden=true;
  }
}
onAuthStateChanged(auth,async user=>{
  currentUser=null;
  if(!user){authForm();return}
  try{
    const admin=await getDoc(doc(db,'admins',user.uid));
    if(!admin.exists()||admin.data().active!==true){authForm('이 계정에는 방문 통계 조회 권한이 없습니다.');return}
    currentUser=user;refresh();
  }catch(_){authForm('운영 계정 권한을 확인해 주세요.')}
});
