// MYV Firebase administrator read-only dashboard.
// Config contains Firebase web identifiers (not service account credentials).
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, onSnapshot, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';

const config = {
  apiKey: "AIzaSyCu-ek497FAXQKwJly2ZS8SMYdy2MarA8",
  authDomain: "myvbrand.firebaseapp.com",
  projectId: "myvbrand",
  storageBucket: "myvbrand.firebasestorage.app",
  messagingSenderId: "88568118294",
  appId: "1:88568118294:web:c31000e615086ba1aa0937"
};
const app = getApps().length ? getApp() : initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);
let permission = 'checking';
let records = [];
let currentView = 'overview';
let unsubscribe = null;
let unsubscribeVisits = null;
let visits = [];
let lastError = '';
let loginBusy = false;
const TYPES = {'브이슈머 문의':0,'입점제안':1,'일반 문의':2};
const q = (selector, root=document) => root.querySelector(selector);
const make = (tag, value, cls) => { const el=document.createElement(tag); if(value != null) el.textContent=value; if(cls) el.className=cls; return el; };
function statusBox() {
  const shell=make('section',null,'panel fb-auth-panel');
  const container=make('div',null,'panel-body');
  if(permission==='checking') {
    container.append(make('p','운영 계정을 확인하고 있습니다.','note'));
  } else if(permission!=='ready') {
    const title=make('h2','운영 계정 로그인');
    container.append(title);
    const form=make('form',null,'fb-login-form');
    const email=make('input'); email.type='email';email.autocomplete='username';email.placeholder='관리자 이메일';email.required=true;email.setAttribute('aria-label','관리자 이메일');
    const password=make('input');password.type='password';password.autocomplete='current-password';password.placeholder='비밀번호';password.required=true;password.setAttribute('aria-label','비밀번호');
    const submit=make('button','로그인','button primary');submit.type='submit';submit.disabled=loginBusy;
    form.append(email,password,submit);
    form.addEventListener('submit',async e=>{
      e.preventDefault(); if(loginBusy) return;
      loginBusy=true; submit.disabled=true;lastError='';
      try { await signInWithEmailAndPassword(auth,email.value.trim(),password.value); }
      catch (_) { lastError='로그인 정보를 확인해 주세요.';loginBusy=false;refresh(); }
    });
    container.append(form);
    if(lastError)container.append(make('p',lastError,'note'));
  } else {
    const bar=make('div',null,'fb-connected');
    bar.append(make('span','문의 현황'));
    const logout=make('button','로그아웃','button');logout.type='button';logout.addEventListener('click',()=>signOut(auth));bar.append(logout);
    container.append(bar);
  }
  shell.append(container);
  return shell;
}
function asDate(value) {
  const d = value && typeof value.toDate==='function'?value.toDate():null;
  return d && !Number.isNaN(d.getTime())?d.toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}):'—';
}
function safeCount(type){return records.filter(x=>x.type===type).length;}
function applyOverview() {
  // Keep the dashboard free of account sign-in panels.
  // Private inquiry totals are shown only after authenticated admin access.
  const metrics=q('.metrics'); if(!metrics)return;
  const cards=metrics.querySelectorAll('.metric');
  for(const [i,type] of ['브이슈머 문의','입점제안','일반 문의'].entries()){
    const value=cards[i]?.querySelector('strong');
    if(value)value.textContent=permission==='ready'?safeCount(type).toLocaleString('ko-KR'):'—';
  }
  q('#fb-admin-auth')?.remove();
  const panel=q('.visitor-summary')?.closest('.panel');
  const host=q('.visitor-summary');
  if(panel && host && permission==='ready'){
    const kst=ts=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(ts));
    const today=kst(Date.now()), month=today.slice(0,7)+'-01';
    const [year,mon,day]=today.split('-').map(Number);
    const weekday=new Date(Date.UTC(year,mon-1,day)).getUTCDay();
    const monday=kst(Date.UTC(year,mon-1,day-((weekday+6)%7),12)-9*3600000);
    const valid=visits.filter(v=>v.date>=kst(Date.now()-29*86400000)&&v.date<=today);
    const counts=[[valid.filter(v=>v.date===today).length,'오늘 방문'],[valid.filter(v=>v.date>=monday).length,'이번 주 방문'],[valid.filter(v=>v.date>=month).length,'이번 달 방문']];
    const grid=make('div',null,'visitor-mini-grid');
    for(const [value,label] of counts){const card=make('div',null,'visitor-mini-stat');card.append(make('strong',value.toLocaleString('ko-KR')),make('span',label));grid.append(card);}
    host.replaceChildren(grid);
    panel.hidden=false;
  }
}
function applyInquiries() {
  const root=q('#viewContent');if(!root)return;
  const old=q('#fb-admin-auth');
  if(old)old.remove();
  if(permission!=='ready') {
    const b=statusBox();b.id='fb-admin-auth';root.prepend(b);
    const empty=q('.inquiry-empty');if(empty)empty.hidden=true;
    return;
  }
  const empty=q('.inquiry-empty');
  if(empty)empty.hidden=true;
  const slot=q('.inquiry-content');if(!slot)return;
  let list=q('#fb-inquiries-list');
  if(!list){list=make('div');list.id='fb-inquiries-list';slot.append(list);}
  const active=q('.inquiry-tabs button[aria-pressed="true"]')?.dataset.category;
  const type=active==='prosumer'?'브이슈머 문의':active==='partner'?'입점제안':'일반 문의';
  const matching=records.filter(r=>r.type===type);
  list.replaceChildren();
  if(!matching.length){list.append(make('p','접수된 문의가 없습니다.','note'));return;}
  for(const item of matching){
    const row=make('article',null,'fb-inquiry-row');
    const heading=make('div',null,'fb-inquiry-head');
    heading.append(make('strong',item.subject||'(제목 없음)'),make('span',asDate(item.createdAt)));
    const details=make('p',[item.name,item.company||'',item.email,item.phone].filter(Boolean).join(' · '),'note');
    const message=make('p',item.message||'');
    row.append(heading,details,message,make('small','상태: '+(item.status==='new'?'신규':item.status||'—')));
    list.append(row);
  }
}
function refresh() {
  const view=window.location.hash.slice(1)||currentView;
  currentView=view;
  if(view==='overview')applyOverview();
  else if(view==='inquiries')applyInquiries();
}
window.MYVFirebaseAdmin={mount(view){currentView=view;refresh();}};
document.addEventListener('click',event=>{
  if(event.target.closest('.inquiry-tabs button'))queueMicrotask(refresh);
});
function stopListener(){if(unsubscribe){unsubscribe();unsubscribe=null;}if(unsubscribeVisits){unsubscribeVisits();unsubscribeVisits=null;}}
onAuthStateChanged(auth,async user=>{
  stopListener();permission='checking';records=[];visits=[];lastError='';loginBusy=false;refresh();
  if(!user){permission='signed-out';refresh();return;}
  try{
    const admin=await getDoc(doc(db,'admins',user.uid));
    if(!admin.exists() || admin.data().active!==true){permission='restricted';lastError='이 계정에는 운영 권한이 없습니다.';refresh();return;}
    permission='ready';refresh();
    unsubscribeVisits=onSnapshot(query(collection(db,'visits'),orderBy('date','desc'),limit(5000)),snapshot=>{
      visits=snapshot.docs.map(item=>item.data());
      refresh();
    },()=>{visits=[];refresh();});
    unsubscribe=onSnapshot(query(collection(db,'inquiries'),orderBy('createdAt','desc'),limit(200)),snapshot=>{
      records=snapshot.docs.map(item=>({id:item.id,...item.data()}));
      refresh();
    },()=>{lastError='문의 데이터를 불러오지 못했습니다.';records=[];refresh();});
  }catch(_){permission='restricted';lastError='계정 권한을 확인해 주세요.';refresh();}
});
refresh();
