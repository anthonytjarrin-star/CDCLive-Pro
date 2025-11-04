Absolutely, Tony — here’s the full, updated pages/index.js with everything we’ve built so far, including:
✅ Bilingual EN/ES toggle
✅ Auto-load on open
✅ “Formulate” generator
✅ Clean, NYT-style design
✅ Ownership line updated to “Cecilia Drouet Contreras & A.T.J.”


---

📄 Full replacement for pages/index.js

1. Go to your GitHub repo → pages/index.js → ✏️ Edit.


2. Delete everything there.


3. Paste this full code and Commit changes.



'use client'
import React, { useEffect, useState } from 'react'

export default function Home(){
  const [lang,setLang]=useState('en')
  const [place,setPlace]=useState('Quito, Ecuador')
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(false)
  const t = (en,es)=> lang==='en'? en: es
  const [topic,setTopic]=useState('')
  const [angles,setAngles]=useState(null)

  async function load(p=place){
    setLoading(true)
    try{
      const r=await fetch(`/api/aggregate?place=${encodeURIComponent(p)}&lang=${lang}`)
      const j=await r.json()
      setData(j)
    } finally { setLoading(false) }
  }

  // Simple local "Formulate" ideas
  function runFormulate(){
    const loc = place
    const top = topic?.trim() || (lang==='en'?'this issue':'este tema')
    const ideas = [
      t(`Political context in ${loc}: stakeholders and coalitions.`,
        `Contexto político en ${loc}: actores y coaliciones.`),
      t('Economic impact: effects on prices, jobs, trade.',
        'Impacto económico: efectos en precios, empleo y comercio.'),
      t('Institutional/legal angles: checks, jurisprudence.',
        'Ángulos institucionales/legales: controles y jurisprudencia.'),
      t(`Regional comparison: how neighbors handled ${top}.`,
        `Comparación regional: cómo los vecinos abordaron ${top}.`),
      t('Human dimension: equity and vulnerable groups.',
        'Dimensión humana: equidad y grupos vulnerables.')
    ]
    const questions = [
      t(`Which institutions in ${loc} gain/lose authority if ${top} proceeds?`,
        `¿Qué instituciones en ${loc} ganan/pierden atribuciones si ${top} avanza?`),
      t('Which indicators will you track at 30/90/180 days?',
        '¿Qué indicadores seguirá a 30/90/180 días?'),
      t('How do rural vs. urban constituencies respond—and why?',
        '¿Cómo responden áreas rurales vs. urbanas y por qué?'),
      t('Who funds advocacy on both sides? What disclosures exist?',
        '¿Quién financia a los actores de ambos lados? ¿Qué revelaciones existen?'),
      t('What safeguards are planned to avoid unintended effects?',
        '¿Qué salvaguardas se prevén para evitar efectos no deseados?')
    ]
    const comments = [
      t(`Watch turnout patterns in ${loc}.`,
        `Observe los patrones de participación en ${loc}.`),
      t('Time coverage using the data-release calendar.',
        'Cronometre su cobertura con el calendario de datos.'),
      t('Compare wording changes across official drafts.',
        'Compare cambios de redacción en borradores oficiales.')
    ]
    setAngles({ideas,questions,comments})
  }

  useEffect(()=>{ load(place) },[])             // auto-load on first open
  useEffect(()=>{ if(data) load(place) },[lang])// reload when language changes

  return (
    <div style={{maxWidth:1080,margin:'24px auto',fontFamily:'Inter, system-ui, Arial',padding:'0 14px',lineHeight:1.45}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <h1 style={{fontSize:38,fontWeight:800,letterSpacing:-0.5}}>CDCLive</h1>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:'8px 10px',borderRadius:8}}>
            <option value='en'>EN</option>
            <option value='es'>ES</option>
          </select>
        </div>
      </header>

      <div style={{opacity:.75,marginBottom:16,fontStyle:'italic'}}>
        © {new Date().getFullYear()} CDC Live — <b>Cecilia Drouet Contreras</b> & <b>A.T.J.</b>
      </div>

      {/* Search ribbon */}
      <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,margin:'10px 0 18px'}}>
        <input
          value={place}
          onChange={e=>setPlace(e.target.value)}
          placeholder={t('City or Country','Ciudad o País')}
          style={{padding:'10px 12px',borderRadius:10,border:'1px solid #ddd'}}
        />
        <button onClick={()=>load(place)} style={{padding:'10px 14px',borderRadius:10,border:'1px solid #222',background:'#111',color:'#fff'}}>
          {t('Load','Cargar')}
        </button>
      </div>

      {/* Content grid */}
      <div style={{display:'grid',gap:16,gridTemplateColumns:'2fr 1fr'}}>
        <section style={{background:'#fafafa',border:'1px solid #eee',borderRadius:14,padding:16}}>
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:8}}>{t('Headlines','Titulares')}</h2>
          {loading && <div>{t('Loading…','Cargando…')}</div>}
          {data && (
            <ul style={{paddingLeft:18}}>
              {(data.headlines||[]).map((h,i)=>(
                <li key={i} style={{marginBottom:8}}>
                  <a href={h.link||'#'} target="_blank" rel="noreferrer" style={{fontWeight:600,textDecoration:'underline'}}>{h.title}</a>
                  <span> — {h.source}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside style={{display:'grid',gap:16}}>
          <div style={{background:'#fafafa',border:'1px solid #eee',borderRadius:14,padding:16}}>
            <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>World Bank</h3>
            <pre style={{whiteSpace:'pre-wrap',margin:0}}>
{data ? JSON.stringify(data.stats,null,2) : t('Loading…','Cargando…')}
            </pre>
          </div>
          <div style={{background:'#fafafa',border:'1px solid #eee',borderRadius:14,padding:16}}>
            <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>Wikipedia</h3>
            <div>{data?.wiki?.extract || t('Loading…','Cargando…')}</div>
          </div>
        </aside>
      </div>

      {/* Formulate */}
      <section style={{marginTop:20,background:'#fff',border:'1px solid #eee',borderRadius:14,padding:16}}>
        <h2 style={{fontSize:22,fontWeight:800,marginBottom:8}}>{t('Formulate','Formular')}</h2>
        <p style={{opacity:.75,marginBottom:8}}>
          {t('Angles, questions, and talking points tailored to your location and topic.',
             'Enfoques, preguntas y puntos de conversación según lugar y tema.')}
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,marginBottom:12}}>
          <input value={topic} onChange={e=>setTopic(e.target.value)}
                 placeholder={t('Enter a topic… e.g., Ecuador Consulta Popular','Ingresa un tema… ej.: Consulta Popular en Ecuador')}
                 style={{padding:'10px 12px',borderRadius:10,border:'1px solid #ddd'}}/>
          <button onClick={runFormulate}
                  style={{padding:'10px 14px',borderRadius:10,border:'1px solid #222',background:'#111',color:'#fff'}}>
            {t('Generate','Generar')}
          </button>
        </div>

        {angles && (
          <div style={{display:'grid',gap:16,gridTemplateColumns:'1fr 1fr 1fr'}}>
            <div>
              <h4 style={{fontWeight:700,marginBottom:6}}>{t('Ideas & Angles','Enfoques e Ideas')}</h4>
              <ul style={{paddingLeft:18}}>{angles.ideas.map((x,i)=><li key={i}>{x}</li>)}</ul>
            </div>
            <div>
              <h4 style={{fontWeight:700,marginBottom:6}}>{t('Questions to Ask','Preguntas para Hacer')}</h4>
              <ol style={{paddingLeft:18}}>{angles.questions.map((x,i)=><li key={i}>{x}</li>)}</ol>
            </div>
            <div>
              <h4 style={{fontWeight:700,marginBottom:6}}>{t('Quick Comments','Comentarios Breves')}</h4>
              <ul style={{paddingLeft:18}}>{angles.comments.map((x,i)=><li key={i}>{x}</li>)}</ul>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}


---

✅ After committing, Vercel will redeploy automatically.
Then reload your app at https://cdc-live-pro.vercel.app — you’ll see the new line:

> © 2025 CDC Live — Cecilia Drouet Contreras & A.T.J.




---

Would you like me to also polish the visual theme next (fonts, layout spacing, muted palette — similar to Bloomberg/NYT)?
That can be done entirely free, just by styling updates inside this same file.
