// MYV anonymous daily-visit tracker (KST). Runs on public brand pages only.
// Identifiers are random per browser, not emails, IPs, or person-level accounts.
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';

if (!/\/admin(?:\/|$)/.test(location.pathname) &&
    navigator.doNotTrack !== '1' && navigator.globalPrivacyControl !== true) {
  const app = getApps().length ? getApp() : initializeApp({
    apiKey:'AIzaSyCu-ek497FAXQKwJly2ZS8SMYdy2MarA8',
    authDomain:'myvbrand.firebaseapp.com',
    projectId:'myvbrand',
    appId:'1:88568118294:web:c31000e615086ba1aa0937'
  });
  const db = getFirestore(app);
  const dateParts=new Intl.DateTimeFormat('en-CA',{
    timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(new Date());
  const parts=Object.fromEntries(dateParts.map(p=>[p.type,p.value]));
  const date=parts.year+'-'+parts.month+'-'+parts.day;
  let visitorId;
  try {
    visitorId=localStorage.getItem('myv_anon_visitor_v1');
    if(!visitorId || !/^[a-f0-9-]{36}$/.test(visitorId)) {
      visitorId=crypto.randomUUID();
      localStorage.setItem('myv_anon_visitor_v1',visitorId);
    }
  } catch(_) { visitorId=crypto.randomUUID(); }
  let source='direct';
  try {
    const r=new URL(document.referrer);
    if(r.hostname!==location.hostname)source=r.hostname.toLowerCase().slice(0,100);
  } catch(_) {}
  const path=location.pathname.replace(/^\/myvbrand(?=\/|$)/,'')||'/';
  const device=/tablet|ipad/i.test(navigator.userAgent)?'tablet':/mobi|android|iphone/i.test(navigator.userAgent)?'mobile':'desktop';
  // Deterministic ID provides at most one visit per browser and KST day.
  // Firestore create-only security rules prevent overwrites.
  setDoc(doc(db,'visits',date+'_'+visitorId),{
    visitorId,date,path:path.slice(0,160),source,device,createdAt:serverTimestamp()
  }).catch(()=>{ /* Analytics must never block public pages. */ });
}
