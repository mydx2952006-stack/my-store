let products = [
  {id:1,name:"Oversized Essential Tee",category:"T-Shirts",price:650,oldPrice:800,badge:"BEST SELLER",meta:"Heavy Cotton / Black",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L","XL"],desc:"A heavyweight everyday tee with a relaxed oversized cut. Built to become the piece you reach for most."},
  {id:2,name:"Midnight Boxy Tee",category:"T-Shirts",price:590,oldPrice:null,badge:"NEW",meta:"Premium Cotton / Black",image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L","XL"],desc:"Clean lines, relaxed proportions and a premium hand-feel. Minimal by design."},
  {id:3,name:"Classic Straight Denim",category:"Pants",price:1250,oldPrice:1450,badge:"-14%",meta:"Denim / Washed Black",image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",sizes:["30","32","34","36"],desc:"Straight-leg denim with an easy everyday silhouette and a deep washed finish."},
  {id:4,name:"Urban Cargo Pants",category:"Pants",price:1100,oldPrice:null,badge:"NEW",meta:"Cargo / Graphite",image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",sizes:["30","32","34","36"],desc:"Functional cargo pockets, clean taper and a street-ready profile."},
  {id:5,name:"Gold Accent Cap",category:"Accessories",price:450,oldPrice:520,badge:"LIMITED",meta:"Cotton Twill / Black",image:"https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85",sizes:["ONE SIZE"],desc:"A structured black cap finished with a subtle gold accent."},
  {id:6,name:"Signature Crossbody",category:"Accessories",price:750,oldPrice:null,badge:"NEW",meta:"Technical Fabric / Black",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",sizes:["ONE SIZE"],desc:"Compact, practical and designed to finish a modern everyday fit."},
  {id:7,name:"Melton Relaxed Pants",category:"Pants",price:1350,oldPrice:1550,badge:"SALE",meta:"Melton / Black",image:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85",sizes:["30","32","34","36"],desc:"Relaxed melton trousers with a premium drape and versatile black finish."},
  {id:8,name:"Essential Hoodie",category:"T-Shirts",price:1150,oldPrice:null,badge:"COMING SOON",meta:"Fleece / Black",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",sizes:["M","L","XL"],desc:"Soft heavyweight fleece and a relaxed silhouette for cooler days."}
];

let currentFilter = "All";
let cart = JSON.parse(localStorage.getItem("elmahdy_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("elmahdy_wishlist") || "[]");
let currentLang = localStorage.getItem("elmahdy_lang") || "en";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function money(n){ return `EGP ${n.toLocaleString("en-US")}`; }
function save(){ localStorage.setItem("elmahdy_cart",JSON.stringify(cart));localStorage.setItem("elmahdy_wishlist",JSON.stringify(wishlist)); }
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2200)}

function renderProducts(){
  const sort=$("#sortSelect").value;
  let list=products.filter(p=>currentFilter==="All"||p.category===currentFilter);
  if(sort==="low") list.sort((a,b)=>a.price-b.price);
  if(sort==="high") list.sort((a,b)=>b.price-a.price);
  if(sort==="newest") list.sort((a,b)=>b.id-a.id);
  $("#productsGrid").innerHTML=list.map(p=>`
    <article class="product-card reveal visible">
      <div class="product-image">
        <img loading="lazy" src="${p.image}" alt="${p.name}">
        ${p.badge?`<span class="product-badge">${p.badge}</span>`:""}
        <button class="heart ${wishlist.includes(p.id)?"active":""}" data-wish="${p.id}">${wishlist.includes(p.id)?"♥":"♡"}</button>
        <button class="quick-view" data-quick="${p.id}">QUICK VIEW + ADD TO CART</button>
      </div>
      <div class="product-info">
        <div class="meta">${p.category.toUpperCase()} / ${p.meta}</div>
        <h3>${p.name}</h3>
        <div class="price"><span>${money(p.price)}</span>${p.oldPrice?`<span class="old">${money(p.oldPrice)}</span>`:""}</div>
      </div>
    </article>`).join("");
}

function updateBadges(){
  $("#cartCount").textContent=cart.reduce((sum,x)=>sum+x.qty,0);
  $("#wishCount").textContent=wishlist.length;
}

function addToCart(id,size="M"){
  const p=products.find(x=>x.id===id); if(!p)return;
  const key=`${id}-${size}`;
  const found=cart.find(x=>x.key===key);
  if(found)found.qty++;
  else cart.push({key,id,size,qty:1});
  save();updateBadges();renderCart();toast(`${p.name} added to cart`);
}

function renderCart(){
  const box=$("#cartItems");
  if(!cart.length){box.innerHTML="";$("#cartEmpty").style.display="flex";$("#cartTotal").textContent=money(0);return}
  $("#cartEmpty").style.display="none";
  box.innerHTML=cart.map(x=>{
    const p=products.find(y=>y.id===x.id);
    return `<div class="cart-line">
      <img src="${p.image}" alt="">
      <div><h4>${p.name}</h4><p>${money(p.price)} · ${x.size}</p>
        <div class="qty"><button data-dec="${x.key}">−</button><span>${x.qty}</span><button data-inc="${x.key}">+</button></div>
      </div>
      <button class="remove" data-remove="${x.key}">REMOVE</button>
    </div>`
  }).join("");
  $("#cartTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}

function openProduct(id){
  const p=products.find(x=>x.id===id);
  $("#productModal").innerHTML=`<div class="product-modal-inner">
    <div class="product-modal-image"><img src="${p.image}" alt="${p.name}"></div>
    <div class="product-modal-info">
      <p class="eyebrow">${p.category.toUpperCase()}</p><h2>${p.name}</h2>
      <div class="modal-price">${money(p.price)} ${p.oldPrice?`<s style="color:#555;font-size:12px;margin-left:8px">${money(p.oldPrice)}</s>`:""}</div>
      <p>${p.desc}</p>
      <p style="margin-top:25px;color:#c9a35b;font-size:9px;letter-spacing:2px">SELECT SIZE</p>
      <div class="size-list">${p.sizes.map((s,i)=>`<button class="${i===0?"selected":""}" data-size="${s}">${s}</button>`).join("")}</div>
      <button class="btn btn-gold full" id="modalAdd">ADD TO CART — ${money(p.price)}</button>
      <p style="font-size:9px;margin-top:14px;color:#555">Free shipping over EGP 1,500 · Easy exchange.</p>
    </div></div>`;
  $("#productOverlay").classList.add("open");
  let selected=p.sizes[0];
  $$("#productModal [data-size]").forEach(b=>b.onclick=()=>{$$("#productModal [data-size]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=b.dataset.size});
  $("#modalAdd").onclick=()=>{addToCart(p.id,selected);$("#productOverlay").classList.remove("open");$("#cartOverlay").classList.add("open")};
}

function toggleWish(id){
  wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
  save();updateBadges();renderProducts();toast(wishlist.includes(id)?"Added to wishlist":"Removed from wishlist");
}

function runSearch(q){
  const result=products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.category.toLowerCase().includes(q.toLowerCase()));
  $("#searchResults").innerHTML=q.trim()?result.map(p=>`<button class="search-result" data-search-product="${p.id}"><img src="${p.image}"><div><h4>${p.name}</h4><span>${money(p.price)}</span></div></button>`).join(""):`<p style="color:#555;font-size:11px;margin-top:30px">Type to search products.</p>`;
}

const translations={
  ar:{announcement:"شحن مجاني للطلبات فوق 1,500 جنيه",navHome:"الرئيسية",navShop:"المتجر",navNew:"وصل حديثًا",navOffers:"العروض",navAccessories:"الإكسسوارات",heroEyebrow:"إل مهدي / مجموعة 2026",heroTitle:"اتعملت عشان<br><span>تعيش ستايلك.</span>",heroCopy:"ملابس رجالي بجودة عالية لشباب الجيل الجديد — قصّات نظيفة وتفاصيل جريئة.",shopNow:"تسوق الآن",exploreNew:"وصل حديثًا",categoriesTitle:"اختار <span>الستايل.</span>",categoriesCopy:"أساسيات، قطع مميزة وإكسسوارات تقدر تركبهم مع بعض.",shopTitle:"الأكثر <span>مبيعًا.</span>",viewAll:"عرض الكل ←",footerCopy:"ملابس رجالي عصرية للجيل الجديد."},
  en:{announcement:"FREE SHIPPING ON ORDERS OVER EGP 1,500",navHome:"Home",navShop:"Shop",navNew:"New Arrivals",navOffers:"Offers",navAccessories:"Accessories",heroEyebrow:"EL MAHDY / 2026 COLLECTION",heroTitle:"BUILT FOR<br><span>YOUR ERA.</span>",heroCopy:"Premium menswear made for everyday confidence — clean cuts, bold details, no compromise.",shopNow:"SHOP NOW",exploreNew:"EXPLORE NEW",categoriesTitle:"Find your <span>fit.</span>",categoriesCopy:"Essentials, statement pieces and accessories designed to work together.",shopTitle:"Best <span>sellers.</span>",viewAll:"VIEW ALL →",footerCopy:"Premium menswear for the next generation."}
};

function applyLang(){
  const t=translations[currentLang];
  document.documentElement.lang=currentLang;
  document.documentElement.dir=currentLang==="ar"?"rtl":"ltr";
  $$("[data-i18n]").forEach(el=>el.innerHTML=t[el.dataset.i18n]||el.innerHTML);
  $("#langBtn").textContent=currentLang==="en"?"عربي":"English";
  localStorage.setItem("elmahdy_lang",currentLang);
}

function revealOnScroll(){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
  $$(".reveal").forEach(el=>obs.observe(el));
}

document.addEventListener("click",e=>{
  const f=e.target.closest(".filter"); if(f){currentFilter=f.dataset.filter;$$(".filter").forEach(x=>x.classList.remove("active"));f.classList.add("active");renderProducts()}
  const c=e.target.closest(".category-card"); if(c){currentFilter=c.dataset.category;$$(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===currentFilter));$("#shop").scrollIntoView({behavior:"smooth"});renderProducts()}
  const q=e.target.closest("[data-quick]"); if(q)openProduct(+q.dataset.quick);
  const w=e.target.closest("[data-wish]"); if(w)toggleWish(+w.dataset.wish);
  const inc=e.target.closest("[data-inc]"); if(inc){const x=cart.find(y=>y.key===inc.dataset.inc);x.qty++;save();renderCart();updateBadges()}
  const dec=e.target.closest("[data-dec]"); if(dec){const x=cart.find(y=>y.key===dec.dataset.dec);x.qty--;if(x.qty<=0)cart=cart.filter(y=>y.key!==dec.dataset.dec);save();renderCart();updateBadges()}
  const rem=e.target.closest("[data-remove]"); if(rem){cart=cart.filter(y=>y.key!==rem.dataset.remove);save();renderCart();updateBadges()}
  const sp=e.target.closest("[data-search-product]"); if(sp){$("#searchOverlay").classList.remove("open");openProduct(+sp.dataset.searchProduct)}
  const close=e.target.closest("[data-close]"); if(close)$("#"+close.dataset.close).classList.remove("open");
});

$("#cartBtn").onclick=()=>{$("#cartOverlay").classList.add("open");renderCart()};
$("#searchBtn").onclick=()=>{$("#searchOverlay").classList.add("open");$("#searchInput").focus();runSearch("")};
$("#searchInput").oninput=e=>runSearch(e.target.value);
$("#sortSelect").onchange=renderProducts;
$("#clearFilters").onclick=()=>{currentFilter="All";$$(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="All"));renderProducts()};
$("#langBtn").onclick=()=>{currentLang=currentLang==="en"?"ar":"en";applyLang()};
$("#mobileMenuBtn").onclick=()=>$("#mobileNav").classList.toggle("open");
$$(".mobile-nav a").forEach(a=>a.onclick=()=>$("#mobileNav").classList.remove("open"));
$("#filterBtn").onclick=()=>{$$(".filter").forEach(x=>x.style.display=x.style.display==="block"?"":"block")};
$("#checkoutBtn").onclick=()=>{if(!cart.length){toast("Your cart is empty");return}$("#checkoutTotal").textContent=$("#cartTotal").textContent;$("#cartOverlay").classList.remove("open");$("#checkoutOverlay").classList.add("open")};
$("#placeOrderBtn").onclick=async ()=>{
  const name=$("#checkoutName").value.trim(),phone=$("#checkoutPhone").value.trim(),address=$("#checkoutAddress").value.trim();
  if(!name||!phone||!address){toast("Please fill the required fields");return}
  const items = cart.map(x => ({ productId:x.id, size:x.size, quantity:x.qty }));
  const total = cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  try {
    const response = await fetch("/api/orders", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name, phone, address, city:$("#checkoutCity").value, items, total})
    });
    if(!response.ok) throw new Error("Order failed");
    cart=[];save();renderCart();updateBadges();$("#checkoutOverlay").classList.remove("open");toast("Order placed successfully");
  } catch(error) { toast("Could not submit order. Try again."); console.error(error); }
};
document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".overlay.open").forEach(x=>x.classList.remove("open"))});

async function loadProducts(){
  try {
    const response = await fetch("/api/products");
    if(response.ok){ products = await response.json(); }
  } catch(error) { console.warn("Using local demo products", error); }
}
(async()=>{ await loadProducts(); applyLang(); renderProducts(); renderCart(); updateBadges(); revealOnScroll(); })();
