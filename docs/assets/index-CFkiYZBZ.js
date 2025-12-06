(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function r(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=r(o);fetch(o.href,i)}})();document.querySelector("#app").innerHTML=`
  <header>
    <h1>TIME SINCE</h1>
  </header>
  <div class="durations-container">
    <h2>On average, you log every </h2>
    <div class="card" id="average-duration">
      ${u(0)}
    </div>
    <h2>Since your last log it's been </h2>
      <div class="card" id="running-duration">
        ${u(0)}
      </div>
    <button id="log-button" type="button">
      LOG
    </button>
  </div>
  <footer>
    <button id="reset-button" type="button">Reset logs.</button>
  </footer>
`;let m;const h=()=>{const e=M(),t=I(),r=document.getElementById("running-duration");document.getElementById("average-duration").innerHTML=u(e),r.innerHTML=u(t,e),document.getElementById("log-button")?.addEventListener("click",w),document.getElementById("reset-button")?.addEventListener("click",v),m||(m=setInterval(h,500))};h();function a(){if(!d("localStorage"))return[];const e=window.localStorage.getItem("logs")??"";return S(e)}function p(e){if(!d("localStorage"))return;const t=b(e);window.localStorage.setItem("logs",t)}function v(){d("localStorage")&&window.localStorage.setItem("logs","")}function S(e){return!e||!e.length?[]:e.split(",").map(t=>Number(t))}function b(e){return!e||!e.length?"":e.map(t=>String(t)).join(",")}function w(){const e=a(),r=[Date.now(),...e];p(r)}function u(e,t){const r=!isNaN(e)&&e>=0,n=document.createElement("span");return r?(n.innerText=L(e),t&&n.classList.add(e>t?"good":"bad"),n.outerHTML):(n.innerText="-- sec",n.outerHTML)}function L(e){let t=e;const r=1e3,n=r*60,o=n*60,i=o*24;let c,l,f;if(t>=i){const s=Math.floor(t/i);t=e%i,c=s?s>1?`${s} days`:`${s} day`:""}if(t>=o){const s=Math.floor(t/o);t=t%o,l=s?s>1?`${s} hours`:`${s} hour`:""}if(t>=n){const s=Math.floor(t/n);t=t%n,f=s?s>1?`${s} minutes`:`${s} minute`:""}const g=Math.round(t/r),y=g?`${g} seconds`:"0 seconds";return E([c,l,f,y])}function E(e){if(!e.length||e.every(n=>!n))return"";let t=e.filter(n=>n);if(t.length===1)return t[0];if(t.length===2)return`${t[0]} and ${t[1]}`;const r=n=>n===t.length-1;return t.map((n,o)=>r(o)?`and ${n}`:`${n},`).join(" ")}function I(){const e=Date.now(),t=a()[0];return e-t}function M(){const e=a(),t=e.slice(0,-1),r=e.slice(1),n=t.map((i,c)=>i-r[c]);return n.reduce((i,c)=>i+c,0)/n.length}function d(e){let t;try{t=window[e];const r="__storage_test__";return t.setItem(r,r),t.removeItem(r),!0}catch(r){return r instanceof DOMException&&r.name==="QuotaExceededError"&&t&&t.length!==0}}
