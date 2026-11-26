// MYV Firebase administrator read-only dashboard.
// Config contains Firebase web identifiers (not service account credentials).
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc, collection, onSnapshot, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';

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
let visitsError = '';
let lastError = '';
let loginBusy = false;
let inquiriesState = 'idle';
let inquiriesError = '';
const TYPES = {'브이슈머 문의':0,'입점제안':1,'일반 문의':2};
const q = (selector, root=document) => root.querySelector(selector);
const make = (tag, value, cls) => { const el=document.createElement(tag); if(value != null) el.textContent=value; if(cls) el.className=cls; return el; };
// Customer-facing admin screens do not render sign-in forms.
// Existing authenticated sessions remain usable; protected data is never public.
function updateAccountButton() {}
function inquiryStateText(){
  if(permission==='checking')return '조회 권한 확인 중';
  if(permission==='signed-out')return '문의 확인은 운영 계정 인증이 필요합니다.';
  if(permission==='restricted')return lastError||'운영 권한을 확인해 주세요.';
  if(inquiriesState==='error')return '문의 조회 실패. 연결 상태를 확인해 주세요.';
  return '문의 내역을 불러오는 중입니다.';
}
function appendInquiryAccess(host){
  host.append(make('p',inquiryStateText(),'note'));
  if(permission==='signed-out'){
    const details=make('details');details.append(make('summary','운영 계정 연결'));
    const form=make('form',null,'fb-inline-auth');
    const email=make('input');email.type='email';email.placeholder='운영 계정 이메일';email.autocomplete='username';email.required=true;email.setAttribute('aria-label','운영 계정 이메일');
    const password=make('input');password.type='password';password.placeholder='비밀번호';password.autocomplete='current-password';password.required=true;password.setAttribute('aria-label','비밀번호');
    const submit=make('button','연결','button primary');submit.type='submit';
    const error=make('p',null,'form-error');error.setAttribute('role','alert');
    form.append(email,password,submit,error);
    form.addEventListener('submit',async e=>{e.preventDefault();submit.disabled=true;try{await signInWithEmailAndPassword(auth,email.value.trim(),password.value);}catch(_){error.textContent='계정 정보를 확인해 주세요.';}finally{submit.disabled=false;}});
    details.append(form);host.append(details);
  }else if(permission==='restricted'){
    const b=make('button','계정 변경','button');b.type='button';b.onclick=()=>signOut(auth);host.append(b);
  }else if(inquiriesState==='error'){
    const b=make('button','다시 불러오기','button');b.type='button';b.onclick=()=>location.reload();host.append(b);
  }
}


function asDate(value) {
  const d = value && typeof value.toDate==='function'?value.toDate():null;
  return d && !Number.isNaN(d.getTime())?d.toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}):'—';
}
function safeCount(type){return records.filter(x=>x.type===type).length;}
function applyOverview() {
  const metrics=q('.metrics'); if(!metrics)return;
  const cards=metrics.querySelectorAll('.metric');
  // Aggregate visitor counts are read from GitHub JSON, never from private
  // Firestore event records in an unauthenticated admin page.
  const values=[
    permission==='ready' && visitsState==='loaded' ? visits.filter(v=>v.date===todayKst()).length : null,
    permission==='ready' && inquiriesState==='loaded' ? safeCount('브이슈머 문의') : null,
    permission==='ready' && inquiriesState==='loaded' ? safeCount('입점제안') : null,
    permission==='ready' && inquiriesState==='loaded' ? safeCount('일반 문의') : null
  ];
  values.forEach((value,i)=>{
    const number=cards[i]?.querySelector('strong');
    if(!number) return;
    // Unauthenticated Firestore must not erase independently loaded GitHub totals.
    if(i === 0) return;
    number.textContent=value==null?'—':value.toLocaleString('ko-KR');
  });
  q('#fb-admin-auth')?.remove();
  const panel=q('#adminRecentInquiries')?.closest('.panel');
  const host=q('#adminRecentInquiries');
  if(!panel || !host)return;
  panel.hidden=false;
  host.replaceChildren();
  if(permission!=='ready' || inquiriesState!=='loaded'){appendInquiryAccess(host);return;}
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
        q('#inquiry-'+category)?.scrollIntoView({block:'start'});
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
  const root=q('#viewContent');
  const slot=q('#allInquiryContent');
  if(!root || !slot)return;
  q('#fb-admin-auth')?.remove();
  slot.replaceChildren();
  const groups=[
    {id:'prosumer',type:'브이슈머 문의',label:'브이슈머 신청'},
    {id:'partner',type:'입점제안',label:'사업자 · 입점제안'},
    {id:'general',type:'일반 문의',label:'일반 문의'}
  ];
  for(const group of groups) {
    const value=q('[data-inquiry-type="'+group.id+'"] strong');
    if(value)value.textContent=permission==='ready' && inquiriesState==='loaded'
      ?records.filter(record=>record.type===group.type).length.toLocaleString('ko-KR')
      :'—';
  }
  if(permission!=='ready'){
    appendInquiryAccess(slot);
    return;
  }
  if(inquiriesState==='loading'){
    slot.append(make('p','문의 내역을 불러오는 중입니다.','note'));
    return;
  }
  if(inquiriesState==='error'){
    slot.append(make('p','문의 내역을 조회하지 못했습니다. 운영 계정 권한 또는 데이터 연결을 확인해 주세요.','note'));
    const retry=make('button','새로고침','button');
    retry.type='button';
    retry.addEventListener('click',()=>location.reload());
    slot.append(retry);
    return;
  }
  for(const group of groups){
    const section=make('section',null,'fb-inquiry-section');
    section.id='inquiry-'+group.id;
    const matching=records.filter(record=>record.type===group.type);
    const heading=make('div',null,'fb-inquiry-section-header');
    heading.append(make('h2',group.label),make('span',matching.length.toLocaleString('ko-KR')+'건'));
    section.append(heading);
    if(!matching.length){
      section.append(make('p','접수된 문의가 없습니다.','fb-inquiry-empty'));
    }
    for(const item of matching){
      const row=make('article',null,'fb-inquiry-row');
      const top=make('div',null,'fb-inquiry-head');
      top.append(make('strong',item.subject||'(제목 없음)'),make('span',asDate(item.createdAt)));
      const details=make('p',[item.name,item.company||'',item.email,item.phone].filter(Boolean).join(' · '),'note');
      const message=make('p',item.message||'');
      const actions=make('div',null,'fb-inquiry-actions');
      const label=make('label','진행 상태');
      const select=make('select');
      select.setAttribute('aria-label',(item.subject||'문의')+' 진행 상태');
      for(const [value,title] of [['new','신규'],['reviewing','확인 중'],['done','완료']]){
        const option=make('option',title);
        option.value=value;
        select.append(option);
      }
      select.value=['new','reviewing','done'].includes(item.status)?item.status:'new';
      select.addEventListener('change',async()=>{
        const previous=item.status||'new';
        const next=select.value;
        select.disabled=true;
        try{
          await updateDoc(doc(db,'inquiries',item.id),{status:next});
        }catch(_){
          select.value=previous;
          const warning=make('span','변경을 저장하지 못했습니다.','fb-save-error');
          actions.append(warning);
        }finally{select.disabled=false;}
      });
      label.append(select);
      actions.append(label);
      row.append(top,details,message,actions);
      section.append(row);
    }
    slot.append(section);
  }
}
function applySettingsDiagnostics(){
  const host=q('#viewContent');if(!host)return;
  q('#firebaseDiagnostics')?.remove();
  const box=make('section',null,'panel fb-auth-panel');
  box.id='firebaseDiagnostics';
  const inner=make('div',null,'panel-body');
  const title=make('h2','운영 데이터 확인');
  inner.append(title);
  const output=make('div',null,'fb-diagnostic-list');
  function row(label,value){
    const item=make('div',null,'connection-row');
    item.append(make('span',label),make('strong',value));
    output.append(item);
  }
  row('운영 계정',permission==='ready'?'연결됨':permission==='checking'?'확인 중':'로그인 필요');
  row('방문 데이터',permission!=='ready'?'—':visitsState==='loaded'?visits.length.toLocaleString('ko-KR')+'건 조회':visitsState==='error'?'조회 오류 ('+visitsError+')':'확인 중');
  row('문의 데이터',permission!=='ready'?'—':inquiriesState==='loaded'?records.length.toLocaleString('ko-KR')+'건 조회':inquiriesState==='error'?'조회 오류 ('+inquiriesError+')':'확인 중');
  inner.append(output);
  const note=make('p','해당 화면은 데이터 조회 상태만 표시합니다. 과거에 저장되지 않은 방문·문의는 집계할 수 없습니다.','note');
  inner.append(note);box.append(inner);host.prepend(box);
}
function refresh() {
  const view=window.location.hash.slice(1)||currentView;
  currentView=view;
  updateAccountButton();
  if(view==='overview')applyOverview();
  else if(view==='inquiries')applyInquiries();
  else if(view==='settings')applySettingsDiagnostics();
}
window.MYVFirebaseAdmin={mount(view){currentView=view;refresh();}};
document.addEventListener('click',event=>{
  if(event.target.closest('.inquiry-tabs button'))queueMicrotask(refresh);
});
function stopListener(){if(unsubscribe){unsubscribe();unsubscribe=null;}if(unsubscribeVisits){unsubscribeVisits();unsubscribeVisits=null;}}
onAuthStateChanged(auth,async user=>{
  stopListener();permission='checking';records=[];visits=[];visitsState='idle';visitsError='';inquiriesState='idle';inquiriesError='';lastError='';loginBusy=false;refresh();
  if(!user){permission='signed-out';refresh();return;}
  try{
    const admin=await getDoc(doc(db,'admins',user.uid));
    if(!admin.exists() || admin.data().active!==true){permission='restricted';lastError='이 계정에는 운영 권한이 없습니다.';refresh();return;}
    permission='ready';inquiriesState='loading';refresh();
    visitsState='loading';
    unsubscribeVisits=onSnapshot(query(collection(db,'visits'),orderBy('date','desc'),limit(5000)),snapshot=>{
      visits=snapshot.docs.map(item=>item.data());visitsState='loaded';visitsError='';
      refresh();
    },error=>{visits=[];visitsState='error';visitsError=String(error?.code||'unknown');console.error('MYV visits query:',visitsError);refresh();});
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
