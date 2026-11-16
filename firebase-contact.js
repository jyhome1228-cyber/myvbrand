// MYV inquiry capture. Preserve the existing FormSubmit email delivery.
// New inquiries are also stored in Firestore when the service is reachable.
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js';

const config = {
  apiKey: "AIzaSyCu-ek497FAXQKwJly2ZS8SMYdy2MarA8",
  authDomain: "myvbrand.firebaseapp.com",
  projectId: "myvbrand",
  storageBucket: "myvbrand.firebasestorage.app",
  messagingSenderId: "88568118294",
  appId: "1:88568118294:web:c31000e615086ba1aa0937"
};
const app = getApps().length ? getApp() : initializeApp(config);
const db = getFirestore(app);
const form = document.querySelector('.contact-form');
if(form) {
  let sending = false;
  form.addEventListener('submit', async event => {
    if(sending || !form.checkValidity()) return;
    const type = form.querySelector('[name="문의유형"]:checked')?.value;
    const consent = form.querySelector('[name="개인정보수집동의"]')?.checked;
    if(!type || !consent) return;
    event.preventDefault();
    sending = true;
    const button = form.querySelector('[type="submit"]');
    if(button)button.disabled = true;
    const get = name => (form.elements.namedItem(name)?.value || '').trim();
    const item = {
      type,
      name:get('이름'),
      company:get('회사_브랜드명'),
      email:get('email'),
      phone:get('연락처'),
      subject:get('문의제목'),
      message:get('문의내용'),
      privacyConsent:true,
      status:'new',
      createdAt:serverTimestamp()
    };
    try {
      await Promise.race([
        addDoc(collection(db,'inquiries'),item),
        new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),8000))
      ]);
    } catch(error) {
      // Keep the preexisting email submission operational if Firestore is unavailable.
      console.warn('Inquiry database delivery unavailable; continuing with email delivery.');
    } finally {
      // Native submit retains existing email notification and configured thank-you page.
      form.submit();
    }
  });
}
