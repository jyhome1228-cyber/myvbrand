// MYV privacy-conscious page view collection. Cloudflare Worker + D1.
// Secrets: ADMIN_TOKEN. Binding: DB (D1). Allowed origins: ALLOWED_ORIGINS.
const HEADERS = {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
function reply(body,status=200,extra={}){return new Response(JSON.stringify(body),{status,headers:{...HEADERS,...extra}})}
function clean(s,max=160){return String(s||'').replace(/[<>\u0000-\u001f]/g,'').slice(0,max)}
function originAllowed(origin,env){const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);return !!origin&&allowed.includes(origin)}
function cors(origin){return {'access-control-allow-origin':origin,'vary':'Origin','access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'Content-Type, Authorization'}}
function dateSeoul(ts){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(ts)).replace(/\//g,'-')}
function sourceHost(raw){try{let u=new URL(raw);if(!['https:','http:'].includes(u.protocol))return 'direct';return clean(u.hostname.toLowerCase(),120)}catch{return 'direct'}}
export default {
 async fetch(request,env){
  const url=new URL(request.url),origin=request.headers.get('origin')||'',allowed=originAllowed(origin,env);
  if(request.method==='OPTIONS')return new Response(null,{status:allowed?204:403,headers:allowed?cors(origin):{}});
  if(!allowed)return reply({error:'Origin not allowed'},403);
  const h=cors(origin);
  if(url.pathname==='/collect'&&request.method==='POST'){
   if(Number(request.headers.get('content-length')||0)>3000)return reply({error:'Too large'},413,h);
   let input;try{input=await request.json()}catch{return reply({error:'Invalid JSON'},400,h)}
   const page=clean(input.page,160);
   if(!page.startsWith('/')||page.startsWith('//')||/[?#]/.test(page)||page.startsWith('/admin'))return reply({error:'Invalid path'},400,h);
   const now=Date.now();
   const source=sourceHost(input.referrer);
   const device=['mobile','tablet','desktop'].includes(input.device)?input.device:'unknown';
   const lang=['ko','en'].includes(input.language)?input.language:'unknown';
   try{
    await env.DB.prepare('INSERT INTO page_views (occurred_at,local_date,path,source,device,language) VALUES (?,?,?,?,?,?)').bind(now,dateSeoul(now),page,source,device,lang).run();
    // Retain raw page view events for 30 days, minimize data collected.
    if(Math.random()<0.02)await env.DB.prepare('DELETE FROM page_views WHERE occurred_at < ?').bind(now-30*86400000).run();
    return new Response(null,{status:204,headers:h});
   }catch{return reply({error:'Storage unavailable'},503,h)}
  }
  if(url.pathname==='/stats'&&request.method==='GET'){
    const token=(request.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
    if(!env.ADMIN_TOKEN||token!==env.ADMIN_TOKEN)return reply({error:'Unauthorized'},401,h);
    const now=Date.now(),today=dateSeoul(now),yesterday=dateSeoul(now-86400000),twoDays=dateSeoul(now-2*86400000);
    const cutoff=now-30*86400000;
    try{
      const [days,pages,sources,recent,devices]=await Promise.all([
        env.DB.prepare('SELECT local_date AS date, COUNT(*) AS views FROM page_views WHERE occurred_at >= ? GROUP BY local_date ORDER BY local_date DESC').bind(cutoff).all(),
        env.DB.prepare('SELECT path, COUNT(*) AS views FROM page_views WHERE occurred_at >= ? GROUP BY path ORDER BY views DESC LIMIT 15').bind(cutoff).all(),
        env.DB.prepare('SELECT source, COUNT(*) AS views FROM page_views WHERE occurred_at >= ? GROUP BY source ORDER BY views DESC LIMIT 15').bind(cutoff).all(),
        env.DB.prepare('SELECT occurred_at AS at,path,source,device,language FROM page_views ORDER BY occurred_at DESC LIMIT 100').all(),
        env.DB.prepare('SELECT device, COUNT(*) AS views FROM page_views WHERE occurred_at >= ? GROUP BY device ORDER BY views DESC').bind(cutoff).all()
      ]);
      const dayCounts=Object.fromEntries(days.results.map(x=>[x.date,x.views]));
      return reply({metric:'page_views_not_unique_visitors',timezone:'Asia/Seoul',retentionDays:30,asOf:new Date(now).toISOString(),today:{date:today,views:dayCounts[today]||0},yesterday:{date:yesterday,views:dayCounts[yesterday]||0},twoDaysAgo:{date:twoDays,views:dayCounts[twoDays]||0},days:days.results,pages:pages.results,sources:sources.results,devices:devices.results,recent:recent.results},200,h);
    }catch{return reply({error:'Storage unavailable'},503,h)}
  }
  return reply({error:'Not found'},404,h);
 }
};
