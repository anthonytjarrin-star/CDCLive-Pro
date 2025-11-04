const Parser = require('rss-parser')
const parser = new Parser()

const FEEDS = [
  { name:'BBC', url:'http://feeds.bbci.co.uk/news/world/rss.xml', weight:3 },
  { name:'The Guardian', url:'https://www.theguardian.com/world/rss', weight:2 },
  { name:'NPR World', url:'https://feeds.npr.org/1004/rss.xml', weight:2 },
  { name:'Reuters World', url:'https://feeds.reuters.com/reuters/worldNews', weight:3 },
  { name:'Al Jazeera', url:'https://www.aljazeera.com/xml/rss/all.xml', weight:2 }
]

function norm(t=''){ return t.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim() }

async function fetchFeeds(){
  let items=[];
  for (const f of FEEDS){
    try{
      const feed = await parser.parseURL(f.url);
      const take = (feed.items||[]).slice(0,12).map(it=>({
        title: it.title, link: it.link, source: f.name, pubDate: it.isoDate||it.pubDate, weight: f.weight
      }));
      items = items.concat(take);
    }catch(e){}
  }
  const seen=new Map();
  for (const it of items){
    const k = norm(it.title);
    const prev = seen.get(k);
    if (!prev) seen.set(k,it);
    else {
      const newer = (!prev.pubDate || (it.pubDate && new Date(it.pubDate)>new Date(prev.pubDate)));
      if (it.weight > prev.weight || newer) seen.set(k,it);
    }
  }
  const ranked = Array.from(seen.values()).sort((a,b)=>{
    const at=a.pubDate?new Date(a.pubDate).getTime():0;
    const bt=b.pubDate?new Date(b.pubDate).getTime():0;
    if (bt!==at) return bt-at;
    return (b.weight||0)-(a.weight||0);
  });
  return ranked.slice(0,40);
}

async function restIso2(countryName){
  try{
    const r = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=cca2,name`);
    const j = await r.json();
    if (Array.isArray(j) && j[0] && j[0].cca2) return j[0].cca2.toLowerCase();
  }catch(e){}
  return null;
}

async function worldBank(iso2){
  const out = {};
  const IND = ['NY.GDP.MKTP.CD','SP.POP.TOTL','FP.CPI.TOTL.ZG'];
  for (const code of IND){
    try{
      const r = await fetch(`https://api.worldbank.org/v2/country/${iso2}/indicator/${code}?format=json&per_page=1`);
      const j = await r.json();
      out[code] = j && j[1] && j[1][0] ? j[1][0].value : null;
    }catch(e){ out[code]=null; }
  }
  return out;
}

async function wiki(place, lang='en'){
  try{
    const q = encodeURIComponent(place.split(',')[0]);
    const r = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${q}`);
    if (!r.ok) return null;
    const j = await r.json();
    return j;
  }catch(e){ return null; }
}

module.exports = async function handler(req, res){
  const { place='Quito, Ecuador', lang='en' } = req.query;
  const headlines = await fetchFeeds();
  const country = place.includes(',') ? place.split(',').slice(-1)[0].trim() : place.trim();
  const iso2 = await restIso2(country) || country.slice(0,2).toLowerCase();
  const stats = await worldBank(iso2);
  const wikiData = await wiki(place, lang);
  const mostRead = headlines.slice(0,8);
  res.status(200).json({ headlines, mostRead, stats, wiki: wikiData, iso2 });
}
