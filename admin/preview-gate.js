// Client-side convenience screen lock for public dashboard content only.
// Not an authentication mechanism. Private Firestore records still require Firebase Auth.
(() => {
  const key = 'myv-admin-preview-unlocked';
  const unlock = () => {
    document.body.classList.remove('admin-preview-locked');
    document.querySelector('#adminPreviewGate')?.remove();
  };
  if (sessionStorage.getItem(key) === 'yes') {
    unlock();
    return;
  }
  const gate=document.querySelector('#adminPreviewGate');
  const form=gate?.querySelector('form');
  if(!gate||!form)return;
  const input=form.querySelector('input');
  const message=gate.querySelector('[role="status"]');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    if(input.value === 'myv'){
      sessionStorage.setItem(key,'yes');
      unlock();
    } else {
      message.textContent='비밀번호를 확인해 주세요.';
      input.value='';
      input.focus();
    }
  });
  input.focus();
})();