/* prom-nav.js — shared navigation & ambient effects across all pages */

/* ── Navbar scroll ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
}, {passive:true});

/* ── Scroll-reveal fade-ups ── */
function revealFadeUps() {
  document.querySelectorAll('.fade-up:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('in');
  });
}
window.addEventListener('scroll', revealFadeUps, {passive:true});
setTimeout(revealFadeUps, 200);

/* ── Starfield ── */
function spawnStars() {
  const layer = document.getElementById('stars-layer');
  if (!layer) return;
  for (let i = 0; i < 140; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = 0.8 + Math.random() * 2;
    s.style.cssText = `
      width:${sz}px; height:${sz}px;
      top:${Math.random()*100}%; left:${Math.random()*100}%;
      --op:${0.1 + Math.random()*0.5};
      animation-duration:${2+Math.random()*5}s;
      animation-delay:${-Math.random()*6}s;
    `;
    layer.appendChild(s);
  }
}
spawnStars();

/* ── Ambient orbs ── */
function spawnOrbs() {
  const configs = [
    {w:700,h:700,top:'-15%',left:'-20%',bg:'rgba(29,78,216,0.12)',dur:'18s'},
    {w:500,h:500,top:'40%',right:'-15%',bg:'rgba(6,182,212,0.08)',dur:'22s',delay:'-7s'},
    {w:400,h:400,bottom:'5%',left:'25%',bg:'rgba(59,130,246,0.1)',dur:'16s',delay:'-12s'},
  ];
  configs.forEach(c => {
    const o = document.createElement('div');
    o.className = 'orb';
    o.style.cssText = `width:${c.w}px;height:${c.h}px;background:${c.bg};
      ${c.top?'top:'+c.top:''}; ${c.left?'left:'+c.left:''};
      ${c.right?'right:'+c.right:''}; ${c.bottom?'bottom:'+c.bottom:''};
      animation-duration:${c.dur}; animation-delay:${c.delay||'0s'};`;
    document.body.appendChild(o);
  });
}
spawnOrbs();

/* ── Falling Wisteria + Quills + Diamonds ── */
function wisteriaSVG(size) {
  const gc = 'rgba(212,175,55,0.3)';
  const hue = 260 + Math.random()*20;
  const c1 = `hsla(${hue},40%,65%,0.6)`;
  const c2 = `hsla(${hue},50%,75%,0.5)`;
  return `<svg width="${size}" height="${size*1.5}" viewBox="0 0 40 60" fill="none">
    <circle cx="20" cy="10" r="8" fill="${c1}"/>
    <circle cx="14" cy="20" r="6" fill="${c2}"/>
    <circle cx="26" cy="22" r="7" fill="${c1}"/>
    <circle cx="18" cy="32" r="5" fill="${c2}"/>
    <circle cx="24" cy="40" r="4" fill="${c1}"/>
    <circle cx="20" cy="50" r="3" fill="${c2}"/>
    <path d="M20 0 Q22 30 20 60" stroke="${gc}" stroke-width="1.5" fill="none" opacity="0.5"/>
  </svg>`;
}
function quillSVG(size) {
  const gc = 'rgba(212,175,55,0.7)';
  return `<svg width="${size}" height="${size*1.2}" viewBox="0 0 30 50" fill="none">
    <path d="M15 50 Q18 30 28 10 Q22 15 15 20 Q10 25 2 15 Q12 35 15 50" fill="rgba(255,255,255,0.8)" stroke="${gc}" stroke-width="1"/>
    <path d="M15 50 Q18 30 28 10" stroke="${gc}" stroke-width="1.5" fill="none"/>
  </svg>`;
}
function diamondSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="rgba(212,175,55,${0.4+Math.random()*0.4})">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
  </svg>`;
}

function spawnFalling() {
  for (let i=0;i<15;i++) spawn(wisteriaSVG, 20+Math.random()*20);
  for (let i=0;i<8;i++)  spawn(quillSVG,  30+Math.random()*20);
  for (let i=0;i<15;i++) spawn(diamondSVG, 10+Math.random()*12);
}
function spawn(fn, size) {
  const el = document.createElement('div');
  el.className = 'fp';
  const r0=Math.random()*360, r1=r0+(Math.random()>0.5?150:-150);
  el.style.cssText = `left:${Math.random()*105-2}%;
    --r0:${r0}deg;--r1:${r1}deg;--op:${0.1+Math.random()*0.2};
    animation-duration:${10+Math.random()*14}s;
    animation-delay:${-Math.random()*18}s;`;
  el.innerHTML = fn(size);
  document.getElementById('stars-layer')?.parentElement?.appendChild(el);
}
spawnFalling();

/* ── Bridgerton Audio Player ── */
function initAudio() {
  if (document.getElementById('bg-music')) return;
  const audio = document.createElement('audio');
  audio.id = 'bg-music';
  audio.loop = true;
  audio.innerHTML = `<source src="theme.mp3" type="audio/mpeg">`;
  document.body.appendChild(audio);

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'music-toggle';
  toggleBtn.innerHTML = '🎵 Play';
  toggleBtn.style.cssText = `
    position: fixed; bottom: 20px; left: 20px; z-index: 1000;
    background: rgba(255,255,255,0.9); border: 1px solid rgba(212,175,55,0.5);
    color: var(--t1); font-family: 'Cinzel', serif; font-size: 0.6rem;
    padding: 10px 16px; border-radius: 30px; cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: all 0.3s;
    text-transform: uppercase; letter-spacing: 0.1em; display: none;
  `;
  document.body.appendChild(toggleBtn);

  let isPlaying = false;
  
  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      toggleBtn.innerHTML = '🎵 Play';
      isPlaying = false;
      sessionStorage.setItem('bridgerton_music', 'no');
    } else {
      audio.play().then(() => {
        toggleBtn.innerHTML = '🎵 Mute';
        isPlaying = true;
        sessionStorage.setItem('bridgerton_music', 'yes');
      }).catch(e => console.log('Audio blocked', e));
    }
  });

  const pref = sessionStorage.getItem('bridgerton_music');
  
  if (pref) {
    toggleBtn.style.display = 'block';
    if (pref === 'yes') {
      audio.play().then(() => {
        isPlaying = true;
        toggleBtn.innerHTML = '🎵 Mute';
      }).catch(() => {
        // Autoplay blocked on new page, fallback to play button
        isPlaying = false;
        toggleBtn.innerHTML = '🎵 Play';
      });
    }
    return; // Don't show overlay again
  }

  const overlay = document.createElement('div');
  overlay.id = 'welcome-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: var(--navy); display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    transition: opacity 1s ease;
  `;
  overlay.innerHTML = `
    <h1 style="font-family: 'Playfair Display', serif; font-style: italic; color: var(--t1); font-size: 2.5rem; margin-bottom: 1rem;">Welcome to the Season</h1>
    <p style="font-family: 'Inter', sans-serif; color: var(--t2); margin-bottom: 2.5rem;">Would you like to hear the music of the ball?</p>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
      <button class="btn-gold" id="btn-play">Play Theme</button>
      <button class="btn-ghost" id="btn-noplay">Don't Play Theme</button>
    </div>
  `;
  document.body.appendChild(overlay);

  function closeOverlay() {
    toggleBtn.style.display = 'block';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 1000);
  }

  document.getElementById('btn-play').addEventListener('click', () => {
    sessionStorage.setItem('bridgerton_music', 'yes');
    audio.play().then(() => {
      isPlaying = true;
      toggleBtn.innerHTML = '🎵 Mute';
    }).catch(e => console.log('Audio blocked', e));
    closeOverlay();
  });

  document.getElementById('btn-noplay').addEventListener('click', () => {
    sessionStorage.setItem('bridgerton_music', 'no');
    closeOverlay();
  });
}
window.addEventListener('DOMContentLoaded', initAudio);

/* ── Mobile menu close on link click ── */
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    const cb = document.getElementById('mcheck');
    if (cb) cb.checked = false;
  });
});
