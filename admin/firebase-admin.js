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
let visitsState = 'idle';
let lastError = '';
let loginBusy = false;
let inquiriesState = 'idle';
let inquiriesError = '';
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
// One compact sign-in action gives access to private operational metrics.
// The shared 'myv' preview gate never grants Firestore permissions.
let accountDialog=null;
function ensureAccountDialog(){
  if(accountDialog)return accountDialog;
  accountDialog=document.createElement('dialog');
  accountDialog.className='fb-account-dialog';
  accountDialog.setAttribute('aria-label','운영 계정 로그인');
  document.body.append(accountDialog);
  accountDialog.addEventListener('click',e=>{
    if(e.target===accountDialog)accountDialog.close();
  });
  return accountDialog;
}
function drawAccountDialog(){
  if(!accountDialog?.open)return;
  accountDialog.replaceChildren();
  const content=statusBox();
  content.classList.add('fb-account-content');
  accountDialog.append(content);
  const close=make('button','닫기','button');
  close.type='button';
  close.addEventListener('click',()=>accountDialog.close());
  accountDialog.append(close);
}
function updateAccountButton(){
  const button=q('#firebaseAccountButton');
  if(!button)return;
  button.textContent=permission==='ready'?'운영 계정 연결됨':'운영 로그인';
  button.setAttribute('aria-label',permission==='ready'?'운영 계정 설정':'운영 계정 로그인');
  if(accountDialog?.open)drawAccountDialog();
}
const accountButton=q('#firebaseAccountButton');
accountButton?.addEventListener('click',()=>{
  ensureAccountDialog();
  accountDialog.showModal();
  drawAccountDialog();
});

function asDate(value) {
  const d = value && typeof value.toDate==='function'?value.toDate():null;
  return d && !Number.isNaN(d.getTime())?d.toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}):'—';
}
function safeCount(type){return records.filter(x=>x.type===type).length;}
function applyOverview() {
  const metrics=q('.metrics'); if(!metrics)return;
  const cards=metrics.querySelectorAll('.metric');
  const values=[
    permission==='ready' && visitsState==='loaded'
      ? visits.filter(x=>x.date===todayKst()).length : null,
    permission==='ready' && inquiriesState==='loaded' ? safeCount('브이슈머 문의') : null,
    permission==='ready' && inquiriesState==='loaded' ? safeCount('입점제안') : null,
    permission==='ready' && inquiriesState==='loaded' ? safeCount('일반 문의') : null
  ];
  values.forEach((value,i)=>{
    const number=cards[i]?.querySelector('strong');
    if(number)number.textContent=value==null?'—':value.toLocaleString('ko-KR');
  });
  q('#fb-admin-auth')?.remove();
  const panel=q('#adminRecentInquiries')?.closest('.panel');
  const host=q('#adminRecentInquiries');
  if(!panel || !host)return;
  panel.hidden=permission!=='ready' || inquiriesState!=='loaded';
  host.replaceChildren();
  if(panel.hidden)return;
  const latest=records.slice(0,5);
  if(!latest.length){host.append(make('p','접수된 문의가 없습니다.','note'));return;}
  for(const item of latest){
    const row=make('div',null,'compact-row');
    const copy=make('div');
    const typeLabel=make('span',item.type||'일반 문의','fb-recent-type');
    const title=make('strong',item.subject||'(제목 없음)');
    const meta=make('small',[item.name||'',asDate(item.createdAt)].filter(Boolean).join(' · '));
    copy.append(typeLabel,title,meta);
    const link=make('button','문의 보기 →','text-button');
    link.type='button';
    link.addEventListener('click',()=>{
      location.hash='inquiries';
      setTimeout(()=>{
        const category=item.type==='브이슈머 문의'?'prosumer':item.type==='입점제안'?'partner':'general';
        q('.inquiry-tabs button[data-category="'+category+'"]')?.click();
      },0);
    });
    row.append(copy,link);host.append(row);
  }
}
function todayKst(){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const map=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return map.year+'-'+map.month+'-'+map.day;
}
function applyInquiries() {
  const root=q('#viewContent');if(!root)return;
  q('#fb-admin-auth')?.remove();
  const slot=q('.inquiry-content');
  if(!slot)return;
  const empty=q('.inquiry-empty');
  if(empty)empty.hidden=true;
  q('#fb-inquiries-list')?.remove();
  if(permission!=='ready'){
    const b=statusBox();b.id='fb-admin-auth';root.prepend(b);
    return;
  }
  const list=make('div',null,'fb-inquiries-list');
  list.id='fb-inquiries-list';
  slot.append(list);
  if(inquiriesState==='loading'){
    list.append(make('p','문의 내역을 불러오는 중입니다.','note'));return;
  }
  if(inquiriesState==='error'){
    list.append(make('p','문의 내역을 조회하지 못했습니다. 운영 계정 권한 또는 데이터 연결을 확인해 주세요.','note'));
    const retry=make('button','새로고침','button');retry.type='button';
    retry.addEventListener('click',()=>location.reload());list.append(retry);
    return;
  }
  const active=q('.inquiry-tabs button[aria-pressed="true"]')?.dataset.category;
  const type=active==='prosumer'?'브이슈머 문의':active==='partner'?'입점제안':'일반 문의';
  const matching=records.filter(r=>r.type===type);
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
  updateAccountButton();
  if(view==='overview')applyOverview();
  else if(view==='inquiries')applyInquiries();
}
window.MYVFirebaseAdmin={mount(view){currentView=view;refresh();}};
document.addEventListener('click',event=>{
  if(event.target.closest('.inquiry-tabs button'))queueMicrotask(refresh);
});
function stopListener(){if(unsubscribe){unsubscribe();unsubscribe=null;}if(unsubscribeVisits){unsubscribeVisits();unsubscribeVisits=null;}}
onAuthStateChanged(auth,async user=>{
  stopListener();permission='checking';records=[];visits=[];visitsState='idle';inquiriesState='idle';inquiriesError='';lastError='';loginBusy=false;refresh();
  if(!user){permission='signed-out';refresh();return;}
  try{
    const admin=await getDoc(doc(db,'admins',user.uid));
    if(!admin.exists() || admin.data().active!==true){permission='restricted';lastError='이 계정에는 운영 권한이 없습니다.';refresh();return;}
    permission='ready';inquiriesState='loading';if(accountDialog?.open)accountDialog.close();refresh();
    visitsState='loading';
    unsubscribeVisits=onSnapshot(query(collection(db,'visits'),orderBy('date','desc'),limit(5000)),snapshot=>{
      visits=snapshot.docs.map(item=>item.data());visitsState='loaded';
      refresh();
    },error=>{visits=[];visitsState='error';console.error('MYV visits query:',error?.code);refresh();});
    // Query the full collection so legacy documents without createdAt are not silently excluded.
    unsubscribe=onSnapshot(collection(db,'inquiries'),snapshot=>{
      records=snapshot.docs.map(item=>({id:item.id,...item.data()}))
        .sort((a,b)=>(b.createdAt?.toMillis?.()||0)-(a.createdAt?.toMillis?.()||0));
      inquiriesState='loaded';inquiriesError='';refresh();
    },error=>{
      inquiriesError=error?.code||'unknown';
      inquiriesState='error';records=[];
      console.error('MYV inquiries query failed:',inquiriesError);
      refresh();
    });
  }catch(_){permission='restricted';lastError='계정 권한을 확인해 주세요.';refresh();}
});
refresh();
