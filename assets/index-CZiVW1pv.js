(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(e){if(e.ep)return;e.ep=!0;const s=o(e);fetch(e.href,s)}})();class O{constructor(t){this.routes=t,this.rootElem=document.getElementById("app"),window.addEventListener("hashchange",()=>this.handeleRouteChange()),this.handeleRouteChange()}handeleRouteChange(){const t=window.location.hash.slice(1)||"/",o=this.routes[t]||this.route["/404"];this.rootElem.innerHTML="",o(this.rootElem)}}function $(n){let t=document.getElementById("searchError");t||(t=document.createElement("div"),t.id="searchError",t.classList.add("searchError"),t.style.display="none",document.body.insertBefore(t,document.body.firstChild)),t.textContent=n,t.style.display="block",setTimeout(()=>{t.style.display="none"},3e3)}function M(){console.log("succesfully exported and loaded function/script");const n=document.getElementById("loadingOverlay"),t=document.getElementById("burgerNav"),o=document.getElementById("burgerIcon"),r=document.getElementById("closeIcon"),e=document.getElementById("menuContainer");(!e||!o||!t||!r)&&$("Een of meerdere menu-elementen zijn niet gevonden."),n.style.display="flex",o.addEventListener("click",function(){t.classList.add("active"),e.classList.add("open"),o.classList.add("menu-open")}),r.addEventListener("click",function(){t.classList.remove("active"),e.classList.remove("open"),o.classList.remove("menu-open")}),n.style.display="none",console.log("hid overlay"),t.classList.remove("active"),e.classList.remove("open")}function j(){const n=document.getElementById("searchInput"),t=document.getElementById("zoekLiedjes"),o=document.getElementById("results"),r=document.getElementById("loadingOverlay");let e=document.getElementById("searchError");e||(e=document.createElement("div"),e.id="searchError",e.classList.add("searchError"),e.style.display="none",document.body.insertBefore(e,document.body.firstChild));const s=document.getElementById("burgerNav"),i=document.getElementById("burgerIcon"),E=document.getElementById("closeIcon"),m=document.getElementById("menuContainer"),v={},B=()=>r.style.display="flex",I=()=>r.style.display="none",w=c=>{e.textContent=c,e.style.display="block",setTimeout(h,3e3)},h=()=>{e.style.display="none"};n&&t&&n.addEventListener("keydown",c=>{c.key==="Enter"&&t.click()}),i&&E&&s&&m&&(i.addEventListener("click",()=>{s.classList.add("active"),m.classList.add("open"),i.classList.add("menu-open")}),E.addEventListener("click",()=>{s.classList.remove("active"),m.classList.remove("open"),i.classList.remove("menu-open")})),I(),s&&s.classList.remove("active"),m&&m.classList.remove("open"),i&&i.classList.remove("menu-open"),h();const T=async()=>{if(!n||!o)return;const c=n.value.trim();if(!c){w("Typ eerst iets in…");return}h(),o.innerHTML="",B();try{const u=await(await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(c)}&entity=song&limit=20`)).json();if(!u.results.length)throw new Error("Geen resultaten gevonden.");u.results.forEach(l=>o.appendChild(k(l)));const p=Array.from(o.querySelectorAll("img"));await Promise.all(p.map(l=>new Promise(y=>{if(l.complete)return y();l.onload=l.onerror=y})))}catch(d){w(d.message)}finally{I()}};t&&t.addEventListener("click",T);function k({artworkUrl100:c,trackName:d,artistName:u,collectionName:p,primaryGenreName:l,releaseDate:y,previewUrl:S}){const g=document.createElement("div");g.className="song";const x=new Date(y).toLocaleDateString("nl-BE");g.innerHTML=`
      <img src="${c}" alt="Album art">
      <h3>${d}</h3>
      <p><strong>Artiest:</strong> ${u}</p>
      <p><strong>Album:</strong> ${p}</p>
      <p><strong>Genre:</strong> ${l}</p>
      <p><strong>Releasedatum:</strong> ${x}</p>
      <audio class="preview" controls src="${S}"></audio>
      <button class="toon-lyrics">Toon lyrics</button>
      <div class="lyrics" style="display:none;"></div>
    `;const f=g.querySelector(".toon-lyrics"),a=g.querySelector(".lyrics");return f.addEventListener("click",async()=>{const L=`${u}|${d}`;if(a.style.display==="block"){a.style.display="none",f.textContent="Toon lyrics";return}if(a.style.display="block",f.textContent="Verstop lyrics",v[L])a.textContent=v[L];else{a.textContent="Loading…";try{const b=await(await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(u)}/${encodeURIComponent(d)}`)).json();if(!b.lyrics)throw new Error("Lyrics niet gevonden.");v[L]=b.lyrics,a.textContent=b.lyrics}catch(C){a.textContent=C.message}}}),g}}const H=n=>{n.innerHTML=`
  <div>
    <nav class="navbar">
      <div class="logo-container">
        <img src="./public/images/logo.png" alt="Logo" class="logo" size="100" width="100" height="100">
      </div>
      <ul>
        <li><a href="#/" class="active">Home</a></li>
        <li><a href="#/findlyrics">Zoek Liedjes</a></li>
        <li>
          <div id="menuContainer">
            <img id="burgerIcon" class="menu" src="./public/images/menu-burger-lightmode.svg" alt="Open menu">
            <div id="burgerNav">
              <img id="closeIcon" src="./public/images/close-button-white.svg" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a class="settings"><img src="./public/images/gear-icon.svg"> Settings</a></li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
  `,M()},P=n=>{n.innerHTML=`
  <div>
    <nav class="navbar">
      <div class="logo-container"><img src="./public/images/logo.png" alt="Logo" class="logo" size="100" width="100" height="100"></div>
      <ul>
        <li><a href="#/">Home</a></li>
        <li><a href="#" class="active">Zoek Liedjes</a></li>
        <li>
          <div id="menuContainer" class="">
            <img id="burgerIcon" class="menu" src="./public/images/menu-burger-lightmode.svg" alt="Open menu">
            <div id="burgerNav" class="">
              <img id="closeIcon" src="./public/images/close-button-white.svg" alt="Sluit menu">
              <h1>Menu</h1>
              <ul class="burgernav">
                <li><a href="#/savedsongs">Saved Songs</a></li>
                <li id="settings"><a class="settings"><img id="gear-icon" src="./public/images/gear-icon.svg"> Settings</a></li>
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
  `,j()},R=n=>{n.innerHTML=`
  <h1>Test</h1>
  `},z=n=>{n.innerHTML=`
  <h1>404 - Pagina niet gevonden</h1>
  <p>Sorry, de pagina die je zoekt bestaat niet.</p>
  <nav>
    <a href="#/">Terug naar home</a>
  `};new O({"/":H,"/findlyrics":P,"/savedsongs":R,"/404":z});
