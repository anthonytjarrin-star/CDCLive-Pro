'use client'
import React, { useState } from 'react'

const PRICE_MONTHLY = process.env.NEXT_PUBLIC_PRICE_MONTHLY_ID || ''
const PRICE_YEARLY  = process.env.NEXT_PUBLIC_PRICE_YEARLY_ID  || ''

export default function Home(){
  const [place,setPlace]=useState('Quito, Ecuador')
  const [lang,setLang]=useState('en')
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(false)

  async function load(){
    setLoading(true)
    const r=await fetch(`/api/aggregate?place=${encodeURIComponent(place)}&lang=${lang}`)
    const j=await r.json()
    setData(j); setLoading(false)
  }

  async function subscribe(priceId){
    const r=await fetch('/api/stripe/create-checkout-session',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({priceId})
    })
    const j=await r.json()
    if(j.url) window.location.href=j.url; else alert(j.error||'Failed to start checkout')
  }

  return (
    <div style={{maxWidth:980,margin:'20px auto',fontFamily:'Inter,system-ui,Arial'}}>
      <h1>CDCLive</h1>
      <div style={{opacity:.8,marginBottom:16}}>
        © {new Date().getFullYear()} CDC Live — Owners: Cecilia Drouet Contreras & Anthony Jarrin. All rights reserved.
      </div>

      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
        <select value={lang} onChange={e=>setLang(e.target.value)}>
          <option value='en'>EN</option>
          <option value='es'>ES</option>
        </select>
        <input value={place} onChange={e=>setPlace(e.target.value)} placeholder='City or Country' style={{flex:'1 1 260px',padding:8}} />
        <button onClick={load} style={{padding:'8px 12px'}}>Load</button>
      </div>

      {loading && <div>Loading…</div>}

      {data && (
        <div>
          <h2>Headlines</h2>
          <ul>
            {(data.headlines||[]).map((h,i)=>(
              <li key={i}><a href={h.link} target='_blank' rel='noreferrer'>{h.title}</a> — {h.source}</li>
            ))}
          </ul>

          <h2 style={{marginTop:16}}>World Bank Stats</h2>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(data.stats,null,2)}</pre>

          <h2 style={{marginTop:16}}>Wikipedia</h2>
          <div>{data.wiki?.extract}</div>
        </div>
      )}

      <hr style={{margin:'20px 0'}}/>
      <h3>Subscribe</h3>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <button onClick={()=>subscribe(PRICE_MONTHLY)} style={{padding:'8px 12px'}}>$5 / month</button>
        <button onClick={()=>subscribe(PRICE_YEARLY)} style={{padding:'8px 12px'}}>$30 / year</button>
      </div>
    </div>
  )
}
