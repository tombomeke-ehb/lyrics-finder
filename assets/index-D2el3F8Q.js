(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(e){if(e.ep)return;e.ep=!0;const s=o(e);fetch(e.href,s)}})();class H{constructor(t){this.routes=t,this.rootElem=document.getElementById("app"),window.addEventListener("hashchange",()=>this.handeleRouteChange()),this.handeleRouteChange()}handeleRouteChange(){const t=window.location.hash.slice(1)||"/",o=this.routes[t]||this.route["/404"];this.rootElem.innerHTML="",o(this.rootElem)}}function P(n){let t=document.getElementById("searchError");t||(t=document.createElement("div"),t.id="searchError",t.classList.add("searchError"),t.style.display="none",document.body.insertBefore(t,document.body.firstChild)),t.textContent=n,t.style.display="block",setTimeout(()=>{t.style.display="none"},3e3)}function R(){console.log("succesfully exported and loaded function/script");const n=document.getElementById("loadingOverlay"),t=document.getElementById("burgerNav"),o=document.getElementById("burgerIcon"),r=document.getElementById("closeIcon"),e=document.getElementById("menuContainer");(!e||!o||!t||!r)&&P("Een of meerdere menu-elementen zijn niet gevonden."),n.style.display="flex",o.addEventListener("click",function(){t.classList.add("active"),e.classList.add("open"),o.classList.add("menu-open")}),r.addEventListener("click",function(){t.classList.remove("active"),e.classList.remove("open"),o.classList.remove("menu-open")}),n.style.display="none",console.log("hid overlay"),t.classList.remove("active"),e.classList.remove("open")}function z(){const n=document.getElementById("searchInput"),t=document.getElementById("zoekLiedjes"),o=document.getElementById("results"),r=document.getElementById("loadingOverlay");let e=document.getElementById("searchError");e||(e=document.createElement("div"),e.id="searchError",e.classList.add("searchError"),e.style.display="none",document.body.insertBefore(e,document.body.firstChild));const s=document.getElementById("burgerNav"),i=document.getElementById("burgerIcon"),b=document.getElementById("closeIcon"),g=document.getElementById("menuContainer"),v={},S=()=>r.style.display="flex",I=()=>r.style.display="none",w=c=>{e.textContent=c,e.style.display="block",setTimeout(h,3e3)},h=()=>{e.style.display="none"};n&&t&&n.addEventListener("keydown",c=>{c.key==="Enter"&&t.click()}),i&&b&&s&&g&&(i.addEventListener("click",()=>{s.classList.add("active"),g.classList.add("open"),i.classList.add("menu-open")}),b.addEventListener("click",()=>{s.classList.remove("active"),g.classList.remove("open"),i.classList.remove("menu-open")})),I(),s&&s.classList.remove("active"),g&&g.classList.remove("open"),i&&i.classList.remove("menu-open"),h();const x=async()=>{if(!n||!o)return;const c=n.value.trim();if(!c){w("Typ eerst iets in…");return}h(),o.innerHTML="",S();try{const u=await(await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(c)}&entity=song&limit=20`)).json();if(!u.results.length)throw new Error("Geen resultaten gevonden.");u.results.forEach(l=>o.appendChild(M(l)));const p=Array.from(o.querySelectorAll("img"));await Promise.all(p.map(l=>new Promise(y=>{if(l.complete)return y();l.onload=l.onerror=y})))}catch(d){w(d.message)}finally{I()}};t&&t.addEventListener("click",x);function M({artworkUrl100:c,trackName:d,artistName:u,collectionName:p,primaryGenreName:l,releaseDate:y,previewUrl:O}){const m=document.createElement("div");m.className="song";const j=new Date(y).toLocaleDateString("nl-BE");m.innerHTML=`
      <img src="${c}" alt="Album art">
      <h3>${d}</h3>
      <p><strong>Artiest:</strong> ${u}</p>
      <p><strong>Album:</strong> ${p}</p>
      <p><strong>Genre:</strong> ${l}</p>
      <p><strong>Releasedatum:</strong> ${j}</p>
      <audio class="preview" controls src="${O}"></audio>
      <button class="toon-lyrics">Toon lyrics</button>
      <div class="lyrics" style="display:none;"></div>
    `;const f=m.querySelector(".toon-lyrics"),a=m.querySelector(".lyrics");return f.addEventListener("click",async()=>{const L=`${u}|${d}`;if(a.style.display==="block"){a.style.display="none",f.textContent="Toon lyrics";return}if(a.style.display="block",f.textContent="Verstop lyrics",v[L])a.textContent=v[L];else{a.textContent="Loading…";try{const E=await(await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(u)}/${encodeURIComponent(d)}`)).json();if(!E.lyrics)throw new Error("Lyrics niet gevonden.");v[L]=E.lyrics,a.textContent=E.lyrics}catch(C){a.textContent=C.message}}}),m}}const B="./images/logo.png",N="./images/favicon1.png",$="./images/menu-burger-lightmode.svg",k="./images/close-button-white.svg",T="./images/gear-icon-light-mode.svg",A=n=>{n.innerHTML=`
  <link rel="icon" type="image/png" href="${N}" />
  <div>
    <nav class="navbar">
      <div class="logo-container">
        <img src="${B}" alt="Logo" class="logo" size="100" width="100" height="100">
      </div>
      <ul>
        <li><a href="#/" class="active">Home</a></li>
        <li><a href="#/findlyrics">Zoek Liedjes</a></li>
        <li>
          <div id="menuContainer">
            <img id="burgerIcon" class="menu" src="${$}" alt="Open menu">
            <div id="burgerNav">
              <img id="closeIcon" src="${k}" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a class="settings"><img src="${T}"> Settings</a>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
  `,R()},q=n=>{n.innerHTML=`
  <div>
    <nav class="navbar">
      <div class="logo-container"><img src="${B}" alt="Logo" class="logo" size="100" width="100" height="100"></div>
      <ul>
        <li><a href="#/">Home</a></li>
        <li><a href="#" class="active">Zoek Liedjes</a></li>
        <li>
          <div id="menuContainer" class="">
            <img id="burgerIcon" class="menu" src="${$}" alt="Open menu">
            <div id="burgerNav">
              <img id="closeIcon" src="${k}" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a class="settings"><img id='gear-icon' src="${T}"> Settings</a>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>

  <div class="input-container">
    <h1>🎵 Lyrics Finder</h1>

    <input type="text" id="searchInput" placeholder="Typ artiest of liedtitel..." />
    <button id="zoekLiedjes">Zoek liedjes</button>

    <div id="results"></div>

  </div>

  <div id="burgerNav">
    <h1>Menu</h1>
  </div>
  `,z()},D=n=>{n.innerHTML=`
  <h1>Test</h1>
  `},F=n=>{n.innerHTML=`
  <h1>404 - Pagina niet gevonden</h1>
  <p>Sorry, de pagina die je zoekt bestaat niet.</p>
  <nav>
    <a href="#/">Terug naar home</a>
  `};new H({"/":A,"/findlyrics":q,"/savedsongs":D,"/404":F});
