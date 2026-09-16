window.IntersectionObserver || (window.IntersectionObserver = class { constructor(){ } observe(){} unobserve(){} });
(typeof Element !== 'undefined') && (Element.prototype.scrollIntoView || (Element.prototype.scrollIntoView = function(){}));

if(typeof document !== 'undefined' && document.addEventListener){
document.addEventListener("DOMContentLoaded", ()=>{
  initNav();
  initScrollBar();
  initToTop();
  if(typeof initPage === "function") initPage();
});
}

/* 滚动进度条 */
function initScrollBar(){
  const bar = document.getElementById('scrollBar');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h>0 ? (window.scrollY/h*100) : 0) + '%';
  });
}

/* 回到顶部 */
function initToTop(){
  const btn = document.getElementById('toTop');
  if(!btn) return;
  window.addEventListener('scroll', ()=> btn.classList.toggle('show', window.scrollY > 400));
}

/* 数字滚动动画 */
function animateNum(el){
  const target = +el.dataset.n, dur = 1200, st = performance.now();
  function step(now){const p=Math.min((now-st)/dur,1);el.textContent=Math.floor(p*target);if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
function observeNums(scope){
  if(typeof document === 'undefined') return;
  const root = scope || document;
  if(!root.querySelectorAll) return;
  const nums = root.querySelectorAll('.num[data-n]');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ animateNum(en.target); io.unobserve(en.target);} });
  },{threshold:.5});
  nums.forEach(n=>io.observe(n));
}

/* 全局搜索（基于所有数据） */
function buildSearchIndex(){
  const list = [
    ...chars.map(c=>({title:c.name,type:"人物",cat:"chars",desc:c.desc})),
    ...factions.map(f=>({title:f.name,type:"势力",cat:"factions",desc:f.desc})),
    ...yanzai.map(y=>({title:y.name,type:"魇灾",cat:"yanzai",desc:y.desc})),
    ...places.map(p=>({title:p.name,type:"地点",cat:"places",desc:p.desc})),
    ...items.map(i=>({title:i.name,type:"物件",cat:"items",desc:i.desc})),
    ...Object.entries(terms).map(([k,v])=>({title:k,type:"名词",cat:"terms",desc:v})),
    ...timeline.map(t=>({title:t.t,type:"时间线",cat:"timeline",desc:t.text})),
  ];
  return list;
}
let _idx = null;
function getIdx(){ if(!_idx) _idx = buildSearchIndex(); return _idx; }

function doSearch(){
  const inp = document.getElementById('q');
  const q = inp.value.trim().toLowerCase();
  const box = document.getElementById('results');
  if(!q){box.classList.remove('show');return;}
  const hits = getIdx().filter(x=>x.title.toLowerCase().includes(q)||x.desc.includes(q)).slice(0,8);
  box.innerHTML = hits.length? hits.map(h=>`<a href="${pageFor(h.cat)}"><b>${h.title}</b> <small>${h.type} · ${strip(h.desc,48)}</small></a>`).join("")
    : `<a>无匹配结果</a>`;
  box.classList.add('show');
}

function pageFor(cat){
  const map = {chars:"chars.html",factions:"factions.html",yanzai:"yanzai.html",places:"places.html",items:"items.html",terms:"world.html",timeline:"world.html"};
  return map[cat] || "index.html";
}
function strip(s,n){ return (s||"").replace(/<[^>]+>/g,"").slice(0,n); }

document.addEventListener('click', e=>{ if(!e.target.closest('.search')){ const r=document.getElementById('results'); r&&r.classList.remove('show');} });

/* 通用卡片渲染：人物/地点/物件 复用 */
function renderChars(filter, scope){
  const grid = (scope||document).getElementById('charGrid');
  if(!grid) return;
  const list = (filter? chars.filter(c=>c.name.includes(filter)||c.desc.includes(filter)) : chars);
  grid.innerHTML = list.length? list.map(c=>`
    <div class="char" data-id="${c.id}">
      <div class="thumb" style="--g1:${c.g1};--g2:${c.g2}">${c.icon}</div>
      <div class="info"><h3>${c.name}</h3><div class="role">${c.role}</div><div class="aff">${c.aff}</div><p>${c.desc}</p></div>
    </div>`).join("")
    : `<div class="empty">无匹配人物</div>`;
  // 点击卡片 → 详情弹窗
  grid.querySelectorAll('.char').forEach(el=>{
    el.style.cursor="pointer";
    el.addEventListener('click', ()=> openChar(el.dataset.id));
  });
}

function renderSimple(gridId, list, icon, key){
  const grid = document.getElementById(gridId);
  if(!grid) return;
  grid.innerHTML = list.map((it,idx)=>`
    <div class="card">
      <div class="icon">${icon}</div>
      <span class="top">${it.tag||''}</span>
      <h3>${it.name||it}</h3>
      <p>${it.desc||''}</p>
    </div>`).join("");
}

/* 人物详情弹窗 */
function openChar(id){
  const c = chars.find(x=>x.id===id);
  if(!c) return;
  const fields = c.fields? Object.entries(c.fields).map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join("") : "";
  const html = `
    <div class="m-head"><button class="m-close" onclick="closeModal()">×</button></div>
    <div class="m-body">
      <div class="m-thumb" style="--g1:${c.g1};--g2:${c.g2}">${c.icon}</div>
      <h2>${c.name}</h2>
      <div class="m-role">${c.role}</div>
      <div class="m-aff">${c.aff}</div>
      <p class="m-desc">${c.desc}</p>
      ${fields? `<h4>资料</h4><dl>${fields}</dl>` : ""}
    </div>`;
  let modal = document.getElementById('modal');
  if(!modal){
    modal = document.createElement('div'); modal.id="modal"; modal.className="modal";
    modal.innerHTML = `<div class="modal-box">${html}</div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
  } else {
    modal.querySelector('.modal-box').innerHTML = html;
  }
  modal.classList.add('show');
  document.body.style.overflow="hidden";
}
function closeModal(){
  const modal = document.getElementById('modal');
  if(modal){ modal.classList.remove('show'); document.body.style.overflow=""; }
}

/* 分类筛选 chips */
function renderChips(hostId, groups, onChange){
  const box = document.getElementById(hostId);
  if(!box) return;
  box.innerHTML = groups.map((g,i)=>`<span class="chip ${i===0?'active':''}" data-g="${g}">${g}</span>`).join("");
  box.querySelectorAll('.chip').forEach(c=>{
    c.addEventListener('click', ()=>{
      box.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
      onChange(c.dataset.g);
    });
  });
}

observeNums();

// 暴露给测试环境（生产环境无影响）
if(typeof window !== 'undefined'){ window.__wiki = {questions, PATH_RESULTS, chars, factions, places, items, terms, timeline, chapters, paths}; }
