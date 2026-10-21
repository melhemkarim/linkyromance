'use client'
import { useEffect, useRef, useState } from 'react'

// ---- edit these ----
const C = { to: 'Dana', from: 'Karim', date: '2026-10-21' }

const STAMPS = [
  { img: '/stamps/coffee.jpg', e: '☕', t: 'First coffee', p: 'Postmarked 2023', g: 'linear-gradient(160deg,#b5651d,#5a2a0b)', s: 'You were ten minutes late and I didn’t mind. I knew right then.' },
  { img: '/stamps/trip.jpg', e: '✈️', t: 'First trip', p: 'Postmarked 2024', g: 'linear-gradient(160deg,#2a7fb8,#0b2a5a)', s: 'Lost luggage, wrong train, and still the best weekend of my life.' },
  { img: '/stamps/today.jpg', e: '🍍', t: 'Our inside joke', p: 'Postmarked forever', g: 'linear-gradient(160deg,#e0a21a,#8a4b06)', s: 'I still can’t say “pineapple” without you laughing. Never stop.' },
  { img: '/stamps/today.jpg', e: '🏡', t: 'Today', p: 'Postmarked 2026', g: 'linear-gradient(160deg,#d6336c,#5a0b2a)', s: 'Three years in, and I’d still choose you first.' },
]
const OPEN_WHEN = [
  ['Open when you miss me', 'Look up. Wherever I am, I’m thinking of you. Call me, I’ll pick up on the first ring.'],
  ['Open when you’re sad', 'You are loved more than you know. Take a breath, drink some water, and remember I’m on your side. Always.'],
  ['Open when you need a laugh', 'Remember the pineapple. Yes, that one. You’re smiling now. I win.'],
]
// --------------------

const PETAL = 'M0 0C-26-6-34-34-6-46 4-50 22-44 26-24 28-10 14-2 0 0Z'
const LAYERS = [[7, 1.55, '#7d0c1f', 0], [6, 1.25, '#a50f28', 18], [5, .95, '#c9152f', 10], [4, .68, '#e22a45', 34], [3, .42, '#f04e66', 50]]
const rnd = (a, b) => a + Math.random() * (b - a)

function burst(x, y, n) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div')
    p.className = 'pt'
    p.style.cssText = `left:${x}px;top:${y}px;animation:none;z-index:9;opacity:1`
    document.body.appendChild(p)
    const a = Math.random() * Math.PI * 2, r = rnd(120, 380)
    p.animate(
      [{ transform: 'translate(0,0) rotate(0)', opacity: 1 },
       { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r - 80}px) rotate(${rnd(0, 720)}deg)`, opacity: 0 }],
      { duration: rnd(1800, 3200), easing: 'cubic-bezier(.2,.7,.3,1)' }
    ).onfinish = () => p.remove()
  }
}

function Rose({ r }) {
  return (
    <svg className="rose" ref={r} viewBox="0 0 200 330" aria-label="A glowing red rose">
      <path d="M100 120C96 190 104 250 100 322" stroke="#2b6a3c" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M100 240C70 230 58 205 62 192 88 196 104 214 100 240Z" fill="#2b6a3c" />
      <path d="M100 272C130 264 144 242 140 228 114 232 98 250 100 272Z" fill="#2f7a45" />
      <g transform="translate(100,112)">
        {LAYERS.map(([n, sc, f, o], k) => (
          <g key={k} className="ly" style={{ '--i': 4 - k }}>
            {Array.from({ length: n }, (_, i) => (
              <path key={i} d={PETAL} transform={`rotate(${o + (i * 360) / n}) scale(${sc})`} fill={f} stroke="#4a0510" strokeOpacity=".35" strokeWidth=".8" />
            ))}
          </g>
        ))}
        <ellipse cx="-14" cy="-20" rx="26" ry="15" fill="#fff" opacity=".12" transform="rotate(-30 -14 -20)" />
      </g>
    </svg>
  )
}

function Stamp({ s }) {
  const [flip, setFlip] = useState(false)
  const [bad, setBad] = useState(false) // photo missing -> fall back to emoji
  const photo = s.img && !bad
  return (
    <button className={'stamp' + (flip ? ' flip' : '')} onClick={() => setFlip(!flip)}>
      <div className="card">
        <div className="f">
          <div className={'pic' + (photo ? ' has-photo' : '')} style={{ '--g': s.g }}>
            {photo ? <img className="photo" src={s.img} alt={s.t} onError={() => setBad(true)} /> : <b>{s.e}</b>}
            <span>{s.t}</span><em>{s.p}</em>
          </div>
        </div>
        <div className="b"><div className="back-s">{s.s}</div></div>
      </div>
    </button>
  )
}

function OpenWhen({ title, msg }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={open ? 'open' : ''}>
      <button onClick={() => setOpen(!open)}>💌 {title}</button>
      <div className="m">{msg}</div>
    </div>
  )
}

function Counter() {
  const [t, setT] = useState('')
  useEffect(() => {
    const k = () => {
      const s = Math.max(0, Math.floor((Date.now() - new Date(C.date + 'T00:00:00')) / 1000))
      setT(`Blooming for ${Math.floor(s / 86400).toLocaleString('en-US')} days, ${Math.floor((s % 86400) / 3600)} hours, ${Math.floor((s % 3600) / 60)} minutes, ${s % 60} seconds`)
    }
    k()
    const i = setInterval(k, 1000)
    return () => clearInterval(i)
  }, [])
  return <p className="cnt">{t}</p>
}

export default function Page() {
  // 0 closed · 1 opening · 2 envelope exits · 3 letter shown · 4 intro removed
  const [stage, setStage] = useState(0)
  const [pts, setPts] = useState([])
  const [dps, setDps] = useState([])
  const [bloomed, setBloomed] = useState(false)
  const [hid, setHid] = useState(false)
  const timers = useRef([])
  const mainRef = useRef(null)
  const rwRef = useRef(null)
  const roseRef = useRef(null)
  const shown = stage >= 3

  // random petals (client only, avoids hydration mismatch)
  useEffect(() => {
    setPts(Array.from({ length: 16 }, () => ({ l: rnd(0, 100), d: rnd(9, 18), w: rnd(0, 14), dx: rnd(-60, 60), s: rnd(.6, 1.4) })))
    setDps(Array.from({ length: 6 }, () => ({ l: rnd(10, 90), t: rnd(5, 55), du: rnd(3, 6), x: rnd(-25, 25), y: rnd(-70, -30), r: rnd(-120, 120) })))
    return () => timers.current.forEach(clearTimeout)
  }, [])

  useEffect(() => { document.body.classList.toggle('lock', !shown) }, [shown])

  // reveal on scroll + bloom the rose
  useEffect(() => {
    if (!shown) return
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: .3 })
    mainRef.current.querySelectorAll('.rv').forEach(el => io.observe(el))
    const bo = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setBloomed(true); bo.disconnect() } }, { threshold: .6 })
    bo.observe(rwRef.current)
    return () => { io.disconnect(); bo.disconnect() }
  }, [shown])

  // tilt the rose
  useEffect(() => {
    const m = e => {
      if (!roseRef.current) return
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5
      roseRef.current.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 12}deg)`
    }
    addEventListener('pointermove', m)
    return () => removeEventListener('pointermove', m)
  }, [])

  const openLetter = e => {
    if (stage) return
    const r = e.currentTarget.getBoundingClientRect()
    setStage(1)
    navigator.vibrate?.(40)
    const t = (f, ms) => timers.current.push(setTimeout(f, ms))
    t(() => burst(r.left + 33, r.top + 33, 38), 250)
    t(() => burst(innerWidth / 2, innerHeight * .4, 30), 1700)
    t(() => setStage(2), 3000)
    t(() => { setStage(3); scrollTo(0, 0) }, 3500)
    t(() => setStage(4), 4700)
  }

  const ini = C.from[0] + '·' + C.to[0]

  return (
    <>
      {pts.map((p, i) => (
        <div key={i} className="pt" style={{ left: `${p.l}vw`, '--d': `${p.d}s`, '--w': `-${p.w}s`, '--dx': `${p.dx}px`, transform: `scale(${p.s})` }} />
      ))}

      {stage < 4 && (
        <section className={'intro' + (stage >= 1 ? ' go' : '') + (stage >= 3 ? ' gone' : '')}>
          <h1 className="hello">A letter for you, {C.to}.</h1>
          <div className={'env' + (stage >= 1 ? ' open' : '') + (stage >= 2 ? ' exit' : '')}>
            <div className="back" />
            <div className="letter">For <span style={{ marginLeft: '.25em' }}>{C.to}</span></div>
            <div className="front" />
            <div className="flap" />
            <button className="seal" onClick={openLetter} aria-label="Break the seal to open the letter"><i>{ini}</i><i>{ini}</i></button>
          </div>
          <p className="hint">Tap the seal to open</p>
        </section>
      )}

      <main ref={mainRef} className={'main' + (shown ? ' show' : '')}>
        <article className="paper">
          <p className="to">To {C.to},</p>
          <p className="rv" style={{ transitionDelay: '.2s' }}>Flowers fade and cards end up in a drawer. So I wrote you something that can’t.</p>
          <p className="rv" style={{ transitionDelay: '.5s' }}>Three years ago you walked into my life ten minutes late and rearranged all of it. Every good day since has had you in it.</p>
          <p className="rv" style={{ transitionDelay: '.8s' }}>Thank you for the quiet mornings, the loud laughs, and for choosing me again and again.</p>
          <p className="rv" style={{ transitionDelay: '1.1s' }}>Happy anniversary, my love. Keep scrolling, there’s more waiting for you.</p>
          <p className="sig rv" style={{ transitionDelay: '1.4s' }}>Forever yours, {C.from}</p>
        </article>

        <h2>Our little stamps</h2>
        <p className="sub">Tap a stamp to turn it over</p>
        <div className="stamps">{STAMPS.map(s => <Stamp key={s.t} s={s} />)}</div>

        <h2>Open when…</h2>
        <p className="sub">Little envelopes for later</p>
        <div className="ow">{OPEN_WHEN.map(([t, m]) => <OpenWhen key={t} title={t} msg={m} />)}</div>

        <section className="finale">
          <h2 style={{ marginTop: 0 }}>The eternal rose</h2>
          <div
            ref={rwRef}
            className={'rw' + (bloomed ? ' bloomed' : '')}
            onClick={e => {
              setHid(true)
              navigator.vibrate?.([30, 60, 30])
              const r = e.currentTarget.getBoundingClientRect()
              burst(r.left + r.width / 2, r.top + r.height * .35, 22)
            }}
          >
            <div className="halo" />
            <Rose r={roseRef} />
            {dps.map((d, i) => (
              <div key={i} className="dp" style={{ left: `${d.l}%`, top: `${d.t}%`, '--t': `${d.du}s`, '--x': `${d.x}px`, '--y': `${d.y}px`, '--r': `${d.r}deg` }} />
            ))}
          </div>
          <p className="fl rv">This rose will never die.</p>
          <p className="fl rv" style={{ transitionDelay: '.6s' }}>It will bloom for as long as this link exists.</p>
          <p className="fl rv" style={{ transitionDelay: '1.2s' }}>Just like what I feel for you.</p>
          <Counter />
          <p className={'hid' + (hid ? ' on' : '')}>Happy anniversary, my love 🌹</p>
        </section>

        <p className="foot">Made with Linky · gift a website</p>
      </main>
    </>
  )
}
