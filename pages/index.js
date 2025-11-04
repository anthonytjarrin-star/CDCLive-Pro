'use client'
import React, { useState } from 'react'

export default function Home() {
  const [place, setPlace] = useState('Quito, Ecuador')
  const [data, setData] = useState(null)

  async function load() {
    const r = await fetch(`/api/aggregate?place=${encodeURIComponent(place)}&lang=en`)
    const j = await r.json()
    setData(j)
  }

  return (
    <div style={{maxWidth:980,margin:'20px auto',fontFamily:'Inter,system-ui,Arial'}}>
      <h1>CDCLive</h1>
      <p>© {new Date().getFullYear()} CDC Live — Cecilia Drouet Contreras & Anthony Jarrin</p>

      <input
        value={place}
        onChange={e => setPlace(e.target.value)}
        placeholder="City or Country"
        style={{padding:8,marginRight:8}}
      />
      <button onClick={load}>Load</button>

      {data && (
        <>
          <h2>Headlines</h2>
          <ul>
            {(data.headlines||[]).map((h,i)=>(
              <li key={i}><a href={h.link} target="_blank" rel="noreferrer">{h.title}</a> — {h.source}</li>
            ))}
          </ul>

          <h2>World Bank Stats</h2>
          <pre>{JSON.stringify(data.stats,null,2)}</pre>

          <h2>Wikipedia</h2>
          <div>{data.wiki?.extract}</div>
        </>
      )}
    </div>
  )
}
