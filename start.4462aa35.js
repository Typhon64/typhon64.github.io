import{o as _e,t as me}from"../chunks/index.cb658010.js";import{S as qe,a as He,I as D,g as je,f as Te,b as we,c as le,s as ee,i as ye,d as H,e as M,o as $e,P as Ce,h as We}from"../chunks/singletons.cee61337.js";import{R as De,H as te,N as Ye}from"../chunks/control.c2cf8273.js";function Xe(n,s){return n==="/"||s==="ignore"?n:s==="never"?n.endsWith("/")?n.slice(0,-1):n:s==="always"&&!n.endsWith("/")?n+"/":n}function Ze(n){return n.split("%25").map(decodeURI).join("%25")}function Qe(n){for(const s in n)n[s]=decodeURIComponent(n[s]);return n}const et=["href","pathname","search","searchParams","toString","toJSON"];function tt(n,s){const d=new URL(n);for(const o of et)Object.defineProperty(d,o,{get(){return s(),n[o]},enumerable:!0,configurable:!0});return nt(d),d}function nt(n){Object.defineProperty(n,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}const at="/__data.json";function rt(n){return n.replace(/\/$/,"")+at}function ot(...n){let s=5381;for(const d of n)if(typeof d=="string"){let o=d.length;for(;o;)s=s*33^d.charCodeAt(--o)}else if(ArrayBuffer.isView(d)){const o=new Uint8Array(d.buffer,d.byteOffset,d.byteLength);let u=o.length;for(;u;)s=s*33^o[--u]}else throw new TypeError("value must be a string or TypedArray");return(s>>>0).toString(36)}const Be=window.fetch;window.fetch=(n,s)=>((n instanceof Request?n.method:s?.method||"GET")!=="GET"&&ne.delete(ke(n)),Be(n,s));const ne=new Map;function st(n){const s=atob(n),d=new Uint8Array(s.length);for(let o=0;o<s.length;o++)d[o]=s.charCodeAt(o);return d.buffer}function it(n,s){const d=ke(n,s),o=document.querySelector(d);if(o?.textContent){let{body:u,...f}=JSON.parse(o.textContent);const E=o.getAttribute("data-ttl");return E&&ne.set(d,{body:u,init:f,ttl:1e3*Number(E)}),o.getAttribute("data-b64")!==null&&(u=st(u)),Promise.resolve(new Response(u,f))}return window.fetch(n,s)}function ct(n,s,d){if(ne.size>0){const o=ke(n,d),u=ne.get(o);if(u){if(performance.now()<u.ttl&&["default","force-cache","only-if-cached",void 0].includes(d?.cache))return new Response(u.body,u.init);ne.delete(o)}}return window.fetch(s,d)}function ke(n,s){let o=`script[data-sveltekit-fetched][data-url=${JSON.stringify(n instanceof Request?n.url:n)}]`;if(s?.headers||s?.body){const u=[];s.headers&&u.push([...new Headers(s.headers)].join(",")),s.body&&(typeof s.body=="string"||ArrayBuffer.isView(s.body))&&u.push(s.body),o+=`[data-hash="${ot(...u)}"]`}return o}const lt=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function ft(n){const s=[];return{pattern:n==="/"?/^\/$/:new RegExp(`^${dt(n).map(o=>{const u=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(o);if(u)return s.push({name:u[1],matcher:u[2],optional:!1,rest:!0,chained:!0}),"(?:/(.*))?";const f=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(o);if(f)return s.push({name:f[1],matcher:f[2],optional:!0,rest:!1,chained:!0}),"(?:/([^/]+))?";if(!o)return;const E=o.split(/\[(.+?)\](?!\])/);return"/"+E.map((g,h)=>{if(h%2){if(g.startsWith("x+"))return ve(String.fromCharCode(parseInt(g.slice(2),16)));if(g.startsWith("u+"))return ve(String.fromCharCode(...g.slice(2).split("-").map(C=>parseInt(C,16))));const p=lt.exec(g);if(!p)throw new Error(`Invalid param: ${g}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,P,I,b,O]=p;return s.push({name:b,matcher:O,optional:!!P,rest:!!I,chained:I?h===1&&E[0]==="":!1}),I?"(.*?)":P?"([^/]*)?":"([^/]+?)"}return ve(g)}).join("")}).join("")}/?$`),params:s}}function ut(n){return!/^\([^)]+\)$/.test(n)}function dt(n){return n.slice(1).split("/").filter(ut)}function pt(n,s,d){const o={},u=n.slice(1),f=u.filter(i=>i!==void 0);let E=0;for(let i=0;i<s.length;i+=1){const g=s[i];let h=u[i-E];if(g.chained&&g.rest&&E&&(h=u.slice(i-E,i+1).filter(p=>p).join("/"),E=0),h===void 0){g.rest&&(o[g.name]="");continue}if(!g.matcher||d[g.matcher](h)){o[g.name]=h;const p=s[i+1],P=u[i+1];p&&!p.rest&&p.optional&&P&&g.chained&&(E=0),!p&&!P&&Object.keys(o).length===f.length&&(E=0);continue}if(g.optional&&g.chained){E++;continue}return}if(!E)return o}function ve(n){return n.normalize().replace(/[[\]]/g,"\\$&").replace(/%/g,"%25").replace(/\//g,"%2[Ff]").replace(/\?/g,"%3[Ff]").replace(/#/g,"%23").replace(/[.*+?^${}()|\\]/g,"\\$&")}function ht({nodes:n,server_loads:s,dictionary:d,matchers:o}){const u=new Set(s);return Object.entries(d).map(([i,[g,h,p]])=>{const{pattern:P,params:I}=ft(i),b={id:i,exec:O=>{const C=P.exec(O);if(C)return pt(C,I,o)},errors:[1,...p||[]].map(O=>n[O]),layouts:[0,...h||[]].map(E),leaf:f(g)};return b.errors.length=b.layouts.length=Math.max(b.errors.length,b.layouts.length),b});function f(i){const g=i<0;return g&&(i=~i),[g,n[i]]}function E(i){return i===void 0?i:[u.has(i),n[i]]}}function Ge(n){try{return JSON.parse(sessionStorage[n])}catch{}}function Fe(n,s){const d=JSON.stringify(s);try{sessionStorage[n]=d}catch{}}const gt=-1,_t=-2,mt=-3,wt=-4,yt=-5,vt=-6;function bt(n,s){if(typeof n=="number")return u(n,!0);if(!Array.isArray(n)||n.length===0)throw new Error("Invalid input");const d=n,o=Array(d.length);function u(f,E=!1){if(f===gt)return;if(f===mt)return NaN;if(f===wt)return 1/0;if(f===yt)return-1/0;if(f===vt)return-0;if(E)throw new Error("Invalid input");if(f in o)return o[f];const i=d[f];if(!i||typeof i!="object")o[f]=i;else if(Array.isArray(i))if(typeof i[0]=="string"){const g=i[0],h=s?.[g];if(h)return o[f]=h(u(i[1]));switch(g){case"Date":o[f]=new Date(i[1]);break;case"Set":const p=new Set;o[f]=p;for(let b=1;b<i.length;b+=1)p.add(u(i[b]));break;case"Map":const P=new Map;o[f]=P;for(let b=1;b<i.length;b+=2)P.set(u(i[b]),u(i[b+1]));break;case"RegExp":o[f]=new RegExp(i[1],i[2]);break;case"Object":o[f]=Object(i[1]);break;case"BigInt":o[f]=BigInt(i[1]);break;case"null":const I=Object.create(null);o[f]=I;for(let b=1;b<i.length;b+=2)I[i[b]]=u(i[b+1]);break;default:throw new Error(`Unknown type ${g}`)}}else{const g=new Array(i.length);o[f]=g;for(let h=0;h<i.length;h+=1){const p=i[h];p!==_t&&(g[h]=u(p))}}else{const g={};o[f]=g;for(const h in i){const p=i[h];g[h]=u(p)}}return o[f]}return u(0)}function Et(n){return n.filter(s=>s!=null)}const Ke=new Set(["load","prerender","csr","ssr","trailingSlash","config"]);[...Ke];const kt=new Set([...Ke]);[...kt];async function St(n,s){for(const d in n)if(typeof n[d]?.then=="function")return Object.fromEntries(await Promise.all(Object.entries(n).map(async([o,u])=>[o,await u])));return n}const Rt="x-sveltekit-invalidated",At="x-sveltekit-trailing-slash",G=Ge(qe)??{},Q=Ge(He)??{};function be(n){G[n]=ee()}function K(n){return location.href=n.href,new Promise(()=>{})}function It(n,s){const d=ht(n),o=n.nodes[0],u=n.nodes[1];o(),u();const f=document.documentElement,E=[],i=[];let g=null;const h={before_navigate:[],on_navigate:[],after_navigate:[]};let p={branch:[],error:null,url:null},P=!1,I=!1,b=!0,O=!1,C=!1,V=!1,B=!1,z,U=history.state?.[D];U||(U=Date.now(),history.replaceState({...history.state,[D]:U},"",location.href));const fe=G[U];fe&&(history.scrollRestoration="manual",scrollTo(fe.x,fe.y));let q,J,W;async function Se(){if(W=W||Promise.resolve(),await W,!W)return;W=null;const e=new URL(location.href),t=X(e,!0);g=null;const a=J={},r=t&&await pe(t);if(a===J&&r){if(r.type==="redirect")return ae(new URL(r.location,e).href,{},1,a);r.props.page!==void 0&&(q=r.props.page),z.$set(r.props)}}function Re(e){i.some(t=>t?.snapshot)&&(Q[e]=i.map(t=>t?.snapshot?.capture()))}function Ae(e){Q[e]?.forEach((t,a)=>{i[a]?.snapshot?.restore(t)})}function Ie(){be(U),Fe(qe,G),Re(U),Fe(He,Q)}async function ae(e,{noScroll:t=!1,replaceState:a=!1,keepFocus:r=!1,state:c={},invalidateAll:l=!1},w,y){return typeof e=="string"&&(e=new URL(e,je(document))),ie({url:e,scroll:t?ee():null,keepfocus:r,redirect_count:w,details:{state:c,replaceState:a},nav_token:y,accepted:()=>{l&&(B=!0)},blocked:()=>{},type:"goto"})}async function Le(e){return g={id:e.id,promise:pe(e).then(t=>(t.type==="loaded"&&t.state.error&&(g=null),t))},g.promise}async function re(...e){const a=d.filter(r=>e.some(c=>r.exec(c))).map(r=>Promise.all([...r.layouts,r.leaf].map(c=>c?.[1]())));await Promise.all(a)}function Pe(e){p=e.state;const t=document.querySelector("style[data-sveltekit]");t&&t.remove(),q=e.props.page,z=new n.root({target:s,props:{...e.props,stores:H,components:i},hydrate:!0}),Ae(U);const a={from:null,to:{params:p.params,route:{id:p.route?.id??null},url:new URL(location.href)},willUnload:!1,type:"enter",complete:Promise.resolve()};h.after_navigate.forEach(r=>r(a)),I=!0}async function Y({url:e,params:t,branch:a,status:r,error:c,route:l,form:w}){let y="never";for(const m of a)m?.slash!==void 0&&(y=m.slash);e.pathname=Xe(e.pathname,y),e.search=e.search;const k={type:"loaded",state:{url:e,params:t,branch:a,error:c,route:l},props:{constructors:Et(a).map(m=>m.node.component)}};w!==void 0&&(k.props.form=w);let v={},A=!q,_=0;for(let m=0;m<Math.max(a.length,p.branch.length);m+=1){const x=a[m],F=p.branch[m];x?.data!==F?.data&&(A=!0),x&&(v={...v,...x.data},A&&(k.props[`data_${_}`]=v),_+=1)}return(!p.url||e.href!==p.url.href||p.error!==c||w!==void 0&&w!==q.form||A)&&(k.props.page={error:c,params:t,route:{id:l?.id??null},status:r,url:new URL(e),form:w??null,data:A?v:q.data}),k}async function ue({loader:e,parent:t,url:a,params:r,route:c,server_data_node:l}){let w=null;const y={dependencies:new Set,params:new Set,parent:!1,route:!1,url:!1},k=await e();if(k.universal?.load){let v=function(..._){for(const S of _){const{href:m}=new URL(S,a);y.dependencies.add(m)}};const A={route:new Proxy(c,{get:(_,S)=>(y.route=!0,_[S])}),params:new Proxy(r,{get:(_,S)=>(y.params.add(S),_[S])}),data:l?.data??null,url:tt(a,()=>{y.url=!0}),async fetch(_,S){let m;_ instanceof Request?(m=_.url,S={body:_.method==="GET"||_.method==="HEAD"?void 0:await _.blob(),cache:_.cache,credentials:_.credentials,headers:_.headers,integrity:_.integrity,keepalive:_.keepalive,method:_.method,mode:_.mode,redirect:_.redirect,referrer:_.referrer,referrerPolicy:_.referrerPolicy,signal:_.signal,...S}):m=_;const x=new URL(m,a);return v(x.href),x.origin===a.origin&&(m=x.href.slice(a.origin.length)),I?ct(m,x.href,S):it(m,S)},setHeaders:()=>{},depends:v,parent(){return y.parent=!0,t()}};w=await k.universal.load.call(null,A)??null,w=w?await St(w,c.id):null}return{node:k,loader:e,server:l,universal:k.universal?.load?{type:"data",data:w,uses:y}:null,data:w??l?.data??null,slash:a.pathname===M||a.pathname===M+"/"?"always":k.universal?.trailingSlash??l?.slash}}function Oe(e,t,a,r,c){if(B)return!0;if(!r)return!1;if(r.parent&&e||r.route&&t||r.url&&a)return!0;for(const l of r.params)if(c[l]!==p.params[l])return!0;for(const l of r.dependencies)if(E.some(w=>w(new URL(l))))return!0;return!1}function de(e,t){return e?.type==="data"?e:e?.type==="skip"?t??null:null}async function pe({id:e,invalidating:t,url:a,params:r,route:c}){if(g?.id===e)return g.promise;const{errors:l,layouts:w,leaf:y}=c,k=[...w,y];l.forEach(R=>R?.().catch(()=>{})),k.forEach(R=>R?.[1]().catch(()=>{}));let v=null;const A=p.url?e!==p.url.pathname+p.url.search:!1,_=p.route?c.id!==p.route.id:!1;let S=!1;const m=k.map((R,j)=>{const $=p.branch[j],T=!!R?.[0]&&($?.loader!==R[1]||Oe(S,_,A,$.server?.uses,r));return T&&(S=!0),T});if(m.some(Boolean)){try{v=await Me(a,m)}catch(R){return oe({status:R instanceof te?R.status:500,error:await Z(R,{url:a,params:r,route:{id:c.id}}),url:a,route:c})}if(v.type==="redirect")return v}const x=v?.nodes;let F=!1;const L=k.map(async(R,j)=>{if(!R)return;const $=p.branch[j],T=x?.[j];if((!T||T.type==="skip")&&R[1]===$?.loader&&!Oe(F,_,A,$.universal?.uses,r))return $;if(F=!0,T?.type==="error")throw T;return ue({loader:R[1],url:a,params:r,route:c,parent:async()=>{const he={};for(let ge=0;ge<j;ge+=1)Object.assign(he,(await L[ge])?.data);return he},server_data_node:de(T===void 0&&R[0]?{type:"skip"}:T??null,R[0]?$?.server:void 0)})});for(const R of L)R.catch(()=>{});const N=[];for(let R=0;R<k.length;R+=1)if(k[R])try{N.push(await L[R])}catch(j){if(j instanceof De)return{type:"redirect",location:j.location};let $=500,T;if(x?.includes(j))$=j.status??$,T=j.error;else if(j instanceof te)$=j.status,T=j.body;else{if(await H.updated.check())return await K(a);T=await Z(j,{params:r,url:a,route:{id:c.id}})}const ce=await Ue(R,N,l);return ce?await Y({url:a,params:r,branch:N.slice(0,ce.idx).concat(ce.node),status:$,error:T,route:c}):await Ne(a,{id:c.id},T,$)}else N.push(void 0);return await Y({url:a,params:r,branch:N,status:200,error:null,route:c,form:t?void 0:null})}async function Ue(e,t,a){for(;e--;)if(a[e]){let r=e;for(;!t[r];)r-=1;try{return{idx:r+1,node:{node:await a[e](),loader:a[e],data:{},server:null,universal:null}}}catch{continue}}}async function oe({status:e,error:t,url:a,route:r}){const c={};let l=null;if(n.server_loads[0]===0)try{const v=await Me(a,[!0]);if(v.type!=="data"||v.nodes[0]&&v.nodes[0].type!=="data")throw 0;l=v.nodes[0]??null}catch{(a.origin!==$e||a.pathname!==location.pathname||P)&&await K(a)}const y=await ue({loader:o,url:a,params:c,route:r,parent:()=>Promise.resolve({}),server_data_node:de(l)}),k={node:await u(),loader:u,universal:null,server:null,data:null};return await Y({url:a,params:c,branch:[y,k],status:e,error:t,route:null})}function X(e,t){if(ye(e,M))return;const a=se(e);for(const r of d){const c=r.exec(a);if(c)return{id:e.pathname+e.search,invalidating:t,route:r,params:Qe(c),url:e}}}function se(e){return Ze(e.pathname.slice(M.length)||"/")}function xe({url:e,type:t,intent:a,delta:r}){let c=!1;const l=Ve(p,a,e,t);r!==void 0&&(l.navigation.delta=r);const w={...l.navigation,cancel:()=>{c=!0,l.reject(new Error("navigation was cancelled"))}};return C||h.before_navigate.forEach(y=>y(w)),c?null:l}async function ie({url:e,scroll:t,keepfocus:a,redirect_count:r,details:c,type:l,delta:w,nav_token:y={},accepted:k,blocked:v}){const A=X(e,!1),_=xe({url:e,type:l,delta:w,intent:A});if(!_){v();return}const S=U;k(),C=!0,I&&H.navigating.set(_.navigation),J=y;let m=A&&await pe(A);if(!m){if(ye(e,M))return await K(e);m=await Ne(e,{id:null},await Z(new Error(`Not found: ${e.pathname}`),{url:e,params:{},route:{id:null}}),404)}if(e=A?.url||e,J!==y)return _.reject(new Error("navigation was aborted")),!1;if(m.type==="redirect")if(r>=20)m=await oe({status:500,error:await Z(new Error("Redirect loop"),{url:e,params:{},route:{id:null}}),url:e,route:{id:null}});else return ae(new URL(m.location,e).href,{},r+1,y),!1;else m.props.page?.status>=400&&await H.updated.check()&&await K(e);if(E.length=0,B=!1,O=!0,be(S),Re(S),m.props.page?.url&&m.props.page.url.pathname!==e.pathname&&(e.pathname=m.props.page?.url.pathname),c){const L=c.replaceState?0:1;if(c.state[D]=U+=L,history[c.replaceState?"replaceState":"pushState"](c.state,"",e),!c.replaceState){let N=U+1;for(;Q[N]||G[N];)delete Q[N],delete G[N],N+=1}}if(g=null,I){p=m.state,m.props.page&&(m.props.page.url=e);const L=(await Promise.all(h.on_navigate.map(N=>N(_.navigation)))).filter(N=>typeof N=="function");if(L.length>0){let N=function(){h.after_navigate=h.after_navigate.filter(R=>!L.includes(R))};L.push(N),h.after_navigate.push(...L)}z.$set(m.props)}else Pe(m);const{activeElement:x}=document;if(await me(),b){const L=e.hash&&document.getElementById(decodeURIComponent(e.hash.slice(1)));t?scrollTo(t.x,t.y):L?L.scrollIntoView():scrollTo(0,0)}const F=document.activeElement!==x&&document.activeElement!==document.body;!a&&!F&&Ee(),b=!0,m.props.page&&(q=m.props.page),C=!1,l==="popstate"&&Ae(U),_.fulfil(void 0),h.after_navigate.forEach(L=>L(_.navigation)),H.navigating.set(null),O=!1}async function Ne(e,t,a,r){return e.origin===$e&&e.pathname===location.pathname&&!P?await oe({status:r,error:a,url:e,route:t}):await K(e)}function Je(){let e;f.addEventListener("mousemove",l=>{const w=l.target;clearTimeout(e),e=setTimeout(()=>{r(w,2)},20)});function t(l){r(l.composedPath()[0],1)}f.addEventListener("mousedown",t),f.addEventListener("touchstart",t,{passive:!0});const a=new IntersectionObserver(l=>{for(const w of l)w.isIntersecting&&(re(se(new URL(w.target.href))),a.unobserve(w.target))},{threshold:0});function r(l,w){const y=Te(l,f);if(!y)return;const{url:k,external:v,download:A}=we(y,M);if(v||A)return;const _=le(y);if(!_.reload)if(w<=_.preload_data){const S=X(k,!1);S&&Le(S)}else w<=_.preload_code&&re(se(k))}function c(){a.disconnect();for(const l of f.querySelectorAll("a")){const{url:w,external:y,download:k}=we(l,M);if(y||k)continue;const v=le(l);v.reload||(v.preload_code===Ce.viewport&&a.observe(l),v.preload_code===Ce.eager&&re(se(w)))}}h.after_navigate.push(c),c()}function Z(e,t){return e instanceof te?e.body:n.hooks.handleError({error:e,event:t})??{message:t.route.id===null&&e instanceof Ye?"Not Found":"Internal Error"}}return{after_navigate:e=>{_e(()=>(h.after_navigate.push(e),()=>{const t=h.after_navigate.indexOf(e);h.after_navigate.splice(t,1)}))},before_navigate:e=>{_e(()=>(h.before_navigate.push(e),()=>{const t=h.before_navigate.indexOf(e);h.before_navigate.splice(t,1)}))},on_navigate:e=>{_e(()=>(h.on_navigate.push(e),()=>{const t=h.on_navigate.indexOf(e);h.on_navigate.splice(t,1)}))},disable_scroll_handling:()=>{(O||!I)&&(b=!1)},goto:(e,t={})=>ae(e,t,0),invalidate:e=>{if(typeof e=="function")E.push(e);else{const{href:t}=new URL(e,location.href);E.push(a=>a.href===t)}return Se()},invalidate_all:()=>(B=!0,Se()),preload_data:async e=>{const t=new URL(e,je(document)),a=X(t,!1);if(!a)throw new Error(`Attempted to preload a URL that does not belong to this app: ${t}`);await Le(a)},preload_code:re,apply_action:async e=>{if(e.type==="error"){const t=new URL(location.href),{branch:a,route:r}=p;if(!r)return;const c=await Ue(p.branch.length,a,r.errors);if(c){const l=await Y({url:t,params:p.params,branch:a.slice(0,c.idx).concat(c.node),status:e.status??500,error:e.error,route:r});p=l.state,z.$set(l.props),me().then(Ee)}}else e.type==="redirect"?ae(e.location,{invalidateAll:!0},0):(z.$set({form:null,page:{...q,form:e.data,status:e.status}}),await me(),z.$set({form:e.data}),e.type==="success"&&Ee())},_start_router:()=>{history.scrollRestoration="manual",addEventListener("beforeunload",t=>{let a=!1;if(Ie(),!C){const r=Ve(p,void 0,null,"leave"),c={...r.navigation,cancel:()=>{a=!0,r.reject(new Error("navigation was cancelled"))}};h.before_navigate.forEach(l=>l(c))}a?(t.preventDefault(),t.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&Ie()}),navigator.connection?.saveData||Je(),f.addEventListener("click",t=>{if(t.button||t.which!==1||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.defaultPrevented)return;const a=Te(t.composedPath()[0],f);if(!a)return;const{url:r,external:c,target:l,download:w}=we(a,M);if(!r)return;if(l==="_parent"||l==="_top"){if(window.parent!==window)return}else if(l&&l!=="_self")return;const y=le(a);if(!(a instanceof SVGAElement)&&r.protocol!==location.protocol&&!(r.protocol==="https:"||r.protocol==="http:")||w)return;if(c||y.reload){xe({url:r,type:"link"})?C=!0:t.preventDefault();return}const[v,A]=r.href.split("#");if(A!==void 0&&v===location.href.split("#")[0]){if(p.url.hash===r.hash){t.preventDefault(),a.ownerDocument.getElementById(A)?.scrollIntoView();return}if(V=!0,be(U),e(r),!y.replace_state)return;V=!1,t.preventDefault()}ie({url:r,scroll:y.noscroll?ee():null,keepfocus:y.keep_focus??!1,redirect_count:0,details:{state:{},replaceState:y.replace_state??r.href===location.href},accepted:()=>t.preventDefault(),blocked:()=>t.preventDefault(),type:"link"})}),f.addEventListener("submit",t=>{if(t.defaultPrevented)return;const a=HTMLFormElement.prototype.cloneNode.call(t.target),r=t.submitter;if((r?.formMethod||a.method)!=="get")return;const l=new URL(r?.hasAttribute("formaction")&&r?.formAction||a.action);if(ye(l,M))return;const w=t.target,{keep_focus:y,noscroll:k,reload:v,replace_state:A}=le(w);if(v)return;t.preventDefault(),t.stopPropagation();const _=new FormData(w),S=r?.getAttribute("name");S&&_.append(S,r?.getAttribute("value")??""),l.search=new URLSearchParams(_).toString(),ie({url:l,scroll:k?ee():null,keepfocus:y??!1,redirect_count:0,details:{state:{},replaceState:A??l.href===location.href},nav_token:{},accepted:()=>{},blocked:()=>{},type:"form"})}),addEventListener("popstate",async t=>{if(J={},t.state?.[D]){if(t.state[D]===U)return;const a=G[t.state[D]],r=new URL(location.href);if(p.url?.href.split("#")[0]===location.href.split("#")[0]){e(r),G[U]=ee(),U=t.state[D],scrollTo(a.x,a.y);return}const c=t.state[D]-U;await ie({url:r,scroll:a,keepfocus:!1,redirect_count:0,details:null,accepted:()=>{U=t.state[D]},blocked:()=>{history.go(-c)},type:"popstate",delta:c,nav_token:J})}else if(!V){const a=new URL(location.href);e(a)}}),addEventListener("hashchange",()=>{V&&(V=!1,history.replaceState({...history.state,[D]:++U},"",location.href))});for(const t of document.querySelectorAll("link"))t.rel==="icon"&&(t.href=t.href);addEventListener("pageshow",t=>{t.persisted&&H.navigating.set(null)});function e(t){p.url=t,H.page.set({...q,url:t}),H.page.notify()}},_hydrate:async({status:e=200,error:t,node_ids:a,params:r,route:c,data:l,form:w})=>{P=!0;const y=new URL(location.href);({params:r={},route:c={id:null}}=X(y,!1)||{});let k;try{const v=a.map(async(S,m)=>{const x=l[m];return x?.uses&&(x.uses=ze(x.uses)),ue({loader:n.nodes[S],url:y,params:r,route:c,parent:async()=>{const F={};for(let L=0;L<m;L+=1)Object.assign(F,(await v[L]).data);return F},server_data_node:de(x)})}),A=await Promise.all(v),_=d.find(({id:S})=>S===c.id);if(_){const S=_.layouts;for(let m=0;m<S.length;m++)S[m]||A.splice(m,0,void 0)}k=await Y({url:y,params:r,branch:A,status:e,error:t,form:w,route:_??null})}catch(v){if(v instanceof De){await K(new URL(v.location,location.href));return}k=await oe({status:v instanceof te?v.status:500,error:await Z(v,{url:y,params:r,route:c}),url:y,route:c})}Pe(k)}}}async function Me(n,s){const d=new URL(n);d.pathname=rt(n.pathname),n.pathname.endsWith("/")&&d.searchParams.append(At,"1"),d.searchParams.append(Rt,s.map(u=>u?"1":"0").join(""));const o=await Be(d.href);if(o.headers.get("content-type")?.includes("text/html")&&await K(n),!o.ok)throw new te(o.status,await o.json());return new Promise(async u=>{const f=new Map,E=o.body.getReader(),i=new TextDecoder;function g(p){return bt(p,{Promise:P=>new Promise((I,b)=>{f.set(P,{fulfil:I,reject:b})})})}let h="";for(;;){const{done:p,value:P}=await E.read();if(p&&!h)break;for(h+=!P&&h?`
`:i.decode(P);;){const I=h.indexOf(`
`);if(I===-1)break;const b=JSON.parse(h.slice(0,I));if(h=h.slice(I+1),b.type==="redirect")return u(b);if(b.type==="data")b.nodes?.forEach(O=>{O?.type==="data"&&(O.uses=ze(O.uses),O.data=g(O.data))}),u(b);else if(b.type==="chunk"){const{id:O,data:C,error:V}=b,B=f.get(O);f.delete(O),V?B.reject(g(V)):B.fulfil(g(C))}}}})}function ze(n){return{dependencies:new Set(n?.dependencies??[]),params:new Set(n?.params??[]),parent:!!n?.parent,route:!!n?.route,url:!!n?.url}}function Ee(){const n=document.querySelector("[autofocus]");if(n)n.focus();else{const s=document.body,d=s.getAttribute("tabindex");s.tabIndex=-1,s.focus({preventScroll:!0,focusVisible:!1}),d!==null?s.setAttribute("tabindex",d):s.removeAttribute("tabindex");const o=getSelection();if(o&&o.type!=="None"){const u=[];for(let f=0;f<o.rangeCount;f+=1)u.push(o.getRangeAt(f));setTimeout(()=>{if(o.rangeCount===u.length){for(let f=0;f<o.rangeCount;f+=1){const E=u[f],i=o.getRangeAt(f);if(E.commonAncestorContainer!==i.commonAncestorContainer||E.startContainer!==i.startContainer||E.endContainer!==i.endContainer||E.startOffset!==i.startOffset||E.endOffset!==i.endOffset)return}o.removeAllRanges()}})}}}function Ve(n,s,d,o){let u,f;const E=new Promise((g,h)=>{u=g,f=h});return E.catch(()=>{}),{navigation:{from:{params:n.params,route:{id:n.route?.id??null},url:n.url},to:d&&{params:s?.params??null,route:{id:s?.route?.id??null},url:d},willUnload:!s,type:o,complete:E},fulfil:u,reject:f}}async function Ut(n,s,d){const o=It(n,s);We({client:o}),d?await o._hydrate(d):o.goto(location.href,{replaceState:!0}),o._start_router()}export{Ut as start};
