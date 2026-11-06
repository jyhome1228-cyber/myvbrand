// MYV visitor analytics Cloudflare Worker. Deploy separately from public GitHub Pages.
// Bind D1 as DB; set ADMIN_TOKEN as Worker secret; set ALLOWED_ORIGIN to https://myvbrand.com.
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
const kstDate=(date)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
function source(value){try{const host=new URL(value).hostname.toLowerCase();return host.slice(0,120)}catch{return 'direct'}}
function cors(origin,allowed){return origin===allowed?{'access-control-allow-origin':origin,'vary':'Origin','access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'Content-Type, Authorization'}:{}}
export default {async fetch(request,env){
 const url=new URL(request.url),origin=request.headers.get('origin')||'',allowed=env.ALLOWED_ORIGIN||'https://myvbrand.com',headers=cors(origin,allowed);
 if(request.method==='OPTIONS')return origin===allowed?new Response(null,{status:204,headers}):new Response(null,{status:403});
 if(!env.DB)return json({error:'D1 binding missing'},503,headers);
 if(url.pathname==='/collect'&&request.method==='POST'){
  if(origin!==allowed)return json({error:'origin denied'},403,headers);
  if(Number(request.headers.get('content-length')||0)>2048)return json({error:'too large'},413,headers);
  let input;try{input=await request.json()}catch{return json({error:'invalid JSON'},400,headers)}
  const path=String(input.page||'');if(!/^\/[a-zA-Z0-9/_-]*(?:\.html)?$/.test(path)||path.length>180||path.startsWith('/admin'))return json({error:'invalid path'},400,headers);
  const device=['desktop','mobile','tablet'].includes(input.device)?input.device:'other';
  const ref=source(input.referrer),lang=['ko','en'].includes(input.language)?input.language:'other';
  const now=new Date().toISOString();
  await env.DB.prepare('INSERT INTO page_views(at,day,path,source,device,language) VALUES(?,?,?,?,?,?)').bind(now,kstDate(new Date()),path,ref,device,lang).run();
  return json({ok:true},200,headers);
 }
 if(url.pathname==='/stats'&&request.method==='GET'){
  if(!env.ADMIN_TOKEN||request.headers.get('authorization')!=='Bearer '+env.ADMIN_TOKEN)return json({error:'unauthorized'},401,headers);
  const now=new Date(),day=(n)=>kstDate(new Date(now.getTime()-n*86400000));
  const since=day(29);
  const query=async(sql,...args)=>(await env.DB.prepare(sql).bind(...args).all()).results;
  const [days,sources,pages,devices,recent]=await Promise.all([
   query('SELECT day AS date,COUNT(*) AS views FROM page_views WHERE day>=? GROUP BY day ORDER BY day DESC',since),
   query('SELECT source,COUNT(*) AS views FROM page_views WHERE day>=? GROUP BY source ORDER BY views DESC LIMIT 30',since),
   query('SELECT path,COUNT(*) AS views FROM page_views WHERE day>=? GROUP BY path ORDER BY views DESC LIMIT 50',since),
   query('SELECT device,COUNT(*) AS views FROM page_views WHERE day>=? GROUP BY device ORDER BY views DESC',since),
   query('SELECT at,path,source,device FROM page_views WHERE day>=? ORDER BY at DESC LIMIT 100',since)
  ]);
  const count=(d)=>({date:d,views:Number(days.find(x=>x.date===d)?.views||0)});
  return json({metric:'page_views_not_unique_visitors',asOf:now.toISOString(),today:count(day(0)),yesterday:count(day(1)),twoDaysAgo:count(day(2)),days,sources,pages,devices,recent},200,headers);
 }
 return json({error:'not found'},404,headers);
},async scheduled(event,env){if(env.DB)await env.DB.prepare("DELETE FROM page_views WHERE day < ?").bind(kstDate(new Date(Date.now()-30*86400000))).run()}};
