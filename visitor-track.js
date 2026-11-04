// MYV anonymous page views — no cookies, IPs, identifiers or search parameters.
(() => {
  if (/\/admin(?:\/|$)/.test(location.pathname) || navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  const script=document.currentScript;
  const root=script?new URL('.',script.src):new URL('./',location.href);
  fetch(new URL('analytics-config.json',root),{cache:'no-store'})
    .then(r=>r.ok?r.json():null).then(config=>{
      if(!config||!config.endpoint)return;
      const base=new URL(config.endpoint);
      if(base.protocol!=='https:')return;
      const device=/tablet|ipad/i.test(navigator.userAgent)?'tablet':/mobi|android|iphone/i.test(navigator.userAgent)?'mobile':'desktop';
      const referrer=document.referrer?new URL(document.referrer).origin:'';
      const page=location.pathname.replace(/^\/myvbrand(?=\/|$)/,'')||'/';
      fetch(new URL('/collect',base),{method:'POST',mode:'cors',credentials:'omit',keepalive:true,headers:{'content-type':'application/json'},body:JSON.stringify({page,referrer,device,language:document.documentElement.lang.slice(0,2)})}).catch(()=>{});
    }).catch(()=>{});
})();
