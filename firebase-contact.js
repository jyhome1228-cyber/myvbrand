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
if (form) {
  let sending = false;
  let databaseRecorded = false;
  const button = form.querySelector('[type="submit"]');
  const notice = document.createElement('p');
  notice.className = 'contact-storage-notice';
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  notice.style.cssText = 'font-size:13px;line-height:1.65;color:#566987;margin:12px 0 0;';
  button?.insertAdjacentElement('afterend', notice);

  function emailOnlyButton(){
    const fallback = document.createElement('button');
    fallback.type = 'button';
    fallback.textContent = document.documentElement.lang === 'en' ? 'Send via email only' : '이메일로만 접수하기';
    fallback.className = 'contact-submit';
    fallback.style.marginTop = '10px';
    fallback.addEventListener('click', () => {
      fallback.disabled = true;
      // Explicit action: retain existing FormSubmit workflow, do not claim DB storage.
      HTMLFormElement.prototype.submit.call(form);
    });
    return fallback;
  }

  form.addEventListener('submit', async event => {
    if(!form.checkValidity()) return;
    event.preventDefault();
    if(sending) return;
    if(databaseRecorded) {
      HTMLFormElement.prototype.submit.call(form);
      return;
    }
    const type = form.querySelector('[name="문의유형"]:checked')?.value;
    const consent = form.querySelector('[name="개인정보수집동의"]')?.checked;
    if(!type || !consent) return;
    const get = name => (form.elements.namedItem(name)?.value || '').trim();
    const item = {
      type,
      name: get('이름'),
      company: get('회사_브랜드명'),
      email: get('email'),
      phone: get('연락처'),
      subject: get('문의제목'),
      message: get('문의내용'),
      privacyConsent: true,
      status: 'new',
      createdAt: serverTimestamp()
    };
    sending = true;
    if(button) button.disabled = true;
    notice.replaceChildren();
    try {
      await Promise.race([
        addDoc(collection(db, 'inquiries'), item),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('storage-timeout')),12000))
      ]);
      databaseRecorded = true;
      HTMLFormElement.prototype.submit.call(form);
    } catch(error) {
      const isEn = document.documentElement.lang === 'en';
      notice.textContent = isEn
        ? 'Your inquiry could not be confirmed in the management system. You can retry or send it by email only.'
        : '관리 시스템 접수를 확인하지 못했습니다. 다시 시도하거나 이메일로만 접수할 수 있습니다.';
      notice.append(document.createElement('br'),emailOnlyButton());
      // Diagnostic remains browser-local; no personal message or contact details logged.
      console.warn('MYV inquiry storage:',error?.code || error?.message || 'unknown');
    } finally {
      sending = false;
      if(button) button.disabled = false;
    }
  });
}
