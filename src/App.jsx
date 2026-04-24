import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, ADMIN_USER, ADMIN_PASS } from './supabase'

// ─── Constants ────────────────────────────────────────────────────
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const TC={
  interview:{bg:'rgba(194,105,42,.12)',color:'#c2692a',border:'rgba(194,105,42,.4)'},
  meeting:  {bg:'rgba(30,160,120,.12)', color:'#1a9070',border:'rgba(30,160,120,.4)'},
  other:    {bg:'rgba(196,88,48,.12)',  color:'#c45830',border:'rgba(196,88,48,.4)'},
}
// ─── Themes ───────────────────────────────────────────────────────
const THEMES={
  default:{
    name:'Warm Sand',icon:'🌾',
    '--t-accent':'#c2692a','--t-accent2':'#1a9070',
    '--t-bg':'#f5f4f0','--t-surface':'rgba(255,255,255,.92)',
    '--t-border':'rgba(200,192,178,.35)','--t-text':'#1a1714',
    '--t-muted':'rgba(90,82,72,.55)',
    '--t-today-bg':'#1a1714','--t-today-color':'#fff',
    '--t-header':'rgba(245,244,240,.92)','--t-sidebar':'rgba(245,244,240,.75)',
    '--orb1-a':'#fbd5b8','--orb1-b':'#fde8d5','--orb2-a':'#d8f2e8','--orb2-b':'#c5e8f8',
  },
  ocean:{
    name:'Deep Ocean',icon:'🌊',
    '--t-accent':'#0077cc','--t-accent2':'#00b4d8',
    '--t-bg':'#f0f6ff','--t-surface':'rgba(255,255,255,.95)',
    '--t-border':'rgba(0,119,204,.18)','--t-text':'#0a1628',
    '--t-muted':'rgba(30,60,100,.52)',
    '--t-today-bg':'#0077cc','--t-today-color':'#fff',
    '--t-header':'rgba(240,246,255,.94)','--t-sidebar':'rgba(232,244,255,.8)',
    '--orb1-a':'#b3d9ff','--orb1-b':'#cce8ff','--orb2-a':'#a8edea','--orb2-b':'#c8f4f9',
  },
  forest:{
    name:'Forest',icon:'🌿',
    '--t-accent':'#2d7a4f','--t-accent2':'#56a07a',
    '--t-bg':'#f2f7f4','--t-surface':'rgba(255,255,255,.94)',
    '--t-border':'rgba(45,122,79,.18)','--t-text':'#0e1f15',
    '--t-muted':'rgba(30,70,45,.52)',
    '--t-today-bg':'#2d7a4f','--t-today-color':'#fff',
    '--t-header':'rgba(242,247,244,.94)','--t-sidebar':'rgba(232,245,238,.8)',
    '--orb1-a':'#b7e4c7','--orb1-b':'#d8f3e3','--orb2-a':'#c7f2e0','--orb2-b':'#e8fdf0',
  },
  lavender:{
    name:'Lavender',icon:'💜',
    '--t-accent':'#7c4dcc','--t-accent2':'#b388ff',
    '--t-bg':'#f7f4ff','--t-surface':'rgba(255,255,255,.95)',
    '--t-border':'rgba(124,77,204,.18)','--t-text':'#1a0f30',
    '--t-muted':'rgba(70,40,110,.5)',
    '--t-today-bg':'#7c4dcc','--t-today-color':'#fff',
    '--t-header':'rgba(247,244,255,.94)','--t-sidebar':'rgba(238,232,255,.8)',
    '--orb1-a':'#e0d0ff','--orb1-b':'#ede8ff','--orb2-a':'#d4bbff','--orb2-b':'#ead5ff',
  },
  sunrise:{
    name:'Sunrise',icon:'🌅',
    '--t-accent':'#e05c2e','--t-accent2':'#f4a03a',
    '--t-bg':'#fff8f3','--t-surface':'rgba(255,255,255,.96)',
    '--t-border':'rgba(224,92,46,.18)','--t-text':'#2a0e00',
    '--t-muted':'rgba(100,50,20,.5)',
    '--t-today-bg':'#e05c2e','--t-today-color':'#fff',
    '--t-header':'rgba(255,248,243,.94)','--t-sidebar':'rgba(255,243,234,.8)',
    '--orb1-a':'#ffd4b2','--orb1-b':'#ffe8d0','--orb2-a':'#ffecd2','--orb2-b':'#fff4e8',
  },
  ruby:{
    name:'Ruby Light',icon:'💎',
    '--t-accent':'#be123c','--t-accent2':'#fb7185',
    '--t-bg':'#fff8f9','--t-surface':'rgba(255,255,255,.97)',
    '--t-border':'rgba(190,18,60,.14)','--t-text':'#2d0614',
    '--t-muted':'rgba(110,20,48,.45)',
    '--t-today-bg':'#be123c','--t-today-color':'#fff',
    '--t-header':'rgba(255,248,249,.97)','--t-sidebar':'rgba(255,235,240,.86)',
    '--orb1-a':'#fecdd3','--orb1-b':'#ffe4e8','--orb2-a':'#fda4af','--orb2-b':'#fecdd3',
  },
  cherry:{
    name:'Cherry Blossom',icon:'🌸',
    '--t-accent':'#d6336c','--t-accent2':'#f783ac',
    '--t-bg':'#fff5f8','--t-surface':'rgba(255,255,255,.96)',
    '--t-border':'rgba(214,51,108,.18)','--t-text':'#2d0a1a',
    '--t-muted':'rgba(110,40,70,.48)',
    '--t-today-bg':'#d6336c','--t-today-color':'#fff',
    '--t-header':'rgba(255,245,248,.95)','--t-sidebar':'rgba(255,235,245,.82)',
    '--orb1-a':'#ffcce0','--orb1-b':'#ffe4ef','--orb2-a':'#ffd6e8','--orb2-b':'#fce8f3',
  },
  arctic:{
    name:'Arctic Ice',icon:'❄️',
    '--t-accent':'#0ea5c9','--t-accent2':'#22d3ee',
    '--t-bg':'#f0fbff','--t-surface':'rgba(255,255,255,.97)',
    '--t-border':'rgba(14,165,201,.16)','--t-text':'#042a36',
    '--t-muted':'rgba(20,80,100,.45)',
    '--t-today-bg':'#0ea5c9','--t-today-color':'#fff',
    '--t-header':'rgba(240,251,255,.96)','--t-sidebar':'rgba(224,247,255,.85)',
    '--orb1-a':'#b0ecff','--orb1-b':'#d0f5ff','--orb2-a':'#9deeff','--orb2-b':'#c8f8ff',
  },
  pearl:{
    name:'Pearl Blush',icon:'🤍',
    '--t-accent':'#c084fc','--t-accent2':'#e879f9',
    '--t-bg':'#fdf8ff','--t-surface':'rgba(255,255,255,.97)',
    '--t-border':'rgba(192,132,252,.16)','--t-text':'#1e0a2e',
    '--t-muted':'rgba(100,60,140,.42)',
    '--t-today-bg':'#c084fc','--t-today-color':'#fff',
    '--t-header':'rgba(253,248,255,.97)','--t-sidebar':'rgba(250,240,255,.88)',
    '--orb1-a':'#f3e8ff','--orb1-b':'#fae8ff','--orb2-a':'#e9d5ff','--orb2-b':'#f5d0fe',
  },
  mint:{
    name:'Mint Fresh',icon:'🍃',
    '--t-accent':'#059669','--t-accent2':'#34d399',
    '--t-bg':'#f0fdf8','--t-surface':'rgba(255,255,255,.96)',
    '--t-border':'rgba(5,150,105,.16)','--t-text':'#022c1e',
    '--t-muted':'rgba(10,80,55,.45)',
    '--t-today-bg':'#059669','--t-today-color':'#fff',
    '--t-header':'rgba(240,253,248,.95)','--t-sidebar':'rgba(220,252,240,.82)',
    '--orb1-a':'#a7f3d0','--orb1-b':'#c9fce5','--orb2-a':'#6ee7b7','--orb2-b':'#a7f3d8',
  },
}

// ─── Admin Themes ─────────────────────────────────────────────────
const ADMIN_THEMES={
  peach:{
    name:'Peach Cream',
    bg:'#fff8f4',surface:'rgba(255,255,255,.97)',header:'rgba(255,248,244,.98)',
    border:'rgba(220,140,100,.18)',text:'#2a1208',muted:'rgba(140,80,40,.45)',
    accent:'#d97741',accent2:'#f4a96a',todayBg:'#d97741',todayColor:'#fff',
    btn:'linear-gradient(135deg,#d97741,#f4a96a)',
  },
  blush:{
    name:'Rose Blush',
    bg:'#fff5f7',surface:'rgba(255,255,255,.97)',header:'rgba(255,245,247,.98)',
    border:'rgba(210,100,130,.16)',text:'#2a0a14',muted:'rgba(160,60,90,.42)',
    accent:'#e05a82',accent2:'#f9a8bf',todayBg:'#e05a82',todayColor:'#fff',
    btn:'linear-gradient(135deg,#e05a82,#f9a8bf)',
  },
  sky:{
    name:'Sky Mist',
    bg:'#f5f9ff',surface:'rgba(255,255,255,.97)',header:'rgba(245,249,255,.98)',
    border:'rgba(80,140,220,.16)',text:'#08203a',muted:'rgba(40,90,160,.42)',
    accent:'#3b82f6',accent2:'#93c5fd',todayBg:'#2563eb',todayColor:'#fff',
    btn:'linear-gradient(135deg,#3b82f6,#93c5fd)',
  },
}

const DEFAULT_PROFILES=[
  {id:'p3',name:'Data Engineer', role:'Data Engineering'},
  {id:'p4',name:'Data Analytics',role:'Analytics'},
  {id:'p5',name:'Data Science',  role:'Data Science'},
  {id:'p6',name:'Other',         role:'General'},
]
const HOURS=Array.from({length:24},(_,i)=>i)

const TIMEZONES=[
  {label:'India (IST)',       tz:'Asia/Kolkata'},
  {label:'UAE (GST)',         tz:'Asia/Dubai'},
  {label:'Saudi Arabia (AST)',tz:'Asia/Riyadh'},
  {label:'Qatar (AST)',       tz:'Asia/Qatar'},
  {label:'UK (GMT/BST)',      tz:'Europe/London'},
  {label:'USA Eastern (ET)',  tz:'America/New_York'},
  {label:'USA Central (CT)',  tz:'America/Chicago'},
  {label:'USA Pacific (PT)',  tz:'America/Los_Angeles'},
  {label:'Canada (ET)',       tz:'America/Toronto'},
  {label:'Australia (AEST)',  tz:'Australia/Sydney'},
  {label:'New Zealand (NZST)',tz:'Pacific/Auckland'},
]

// ─── Helpers ──────────────────────────────────────────────────────
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function padZ(n){return String(n).padStart(2,'0')}
function fmtDate(d){return`${d.getFullYear()}-${padZ(d.getMonth()+1)}-${padZ(d.getDate())}`}
function parseDate(s){const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)}
function to24(h,m,ap){let hh=Number(h);if(ap==='PM'&&hh!==12)hh+=12;if(ap==='AM'&&hh===12)hh=0;return`${padZ(hh)}:${padZ(m)}`}
function to12(t){if(!t)return{h:'12',m:'00',ap:'AM'};const[H,M]=t.split(':').map(Number);return{h:String(H%12||12),m:padZ(M),ap:H>=12?'PM':'AM'}}
function dTime(t){const{h,m,ap}=to12(t);return`${h}:${m} ${ap}`}
function dDate(s){const d=parseDate(s);return`${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`}
function tmins(t){const[h,m]=t.split(':').map(Number);return h*60+m}
function olap(s1,e1,s2,e2){return tmins(s1)<tmins(e2)&&tmins(e1)>tmins(s2)}
function initials(n){return(n||'?').split(' ').map(x=>x[0]).join('').toUpperCase().slice(0,2)}
function avatarColor(name){
  const c=[['#fde8d5','#c2692a'],['#d5f0e8','#1a9070'],['#fde8d5','#c45830'],['#fef3e2','#1878c8'],['#f8e8d5','#c87818'],['#e8d5f0','#9018c8']]
  let i=0;for(const ch of(name||''))i=(i+ch.charCodeAt(0))%c.length;return c[i]
}
function addDays(date,n){const d=new Date(date);d.setDate(d.getDate()+n);return d}
function startOfWeek(date){const d=new Date(date);d.setDate(d.getDate()-d.getDay());return d}
function getTZOffsetMins(tz){
  const d=new Date()
  const utc=new Date(d.toLocaleString('en-US',{timeZone:'UTC'}))
  const local=new Date(d.toLocaleString('en-US',{timeZone:tz}))
  return(local-utc)/60000
}
function convertTimeTZ(time24,fromTZ,toTZ){
  if(!time24)return''
  try{
    const[h,m]=time24.split(':').map(Number)
    const fromOff=getTZOffsetMins(fromTZ)
    const toOff=getTZOffsetMins(toTZ)
    const totalMins=((h*60+m-fromOff+toOff)%1440+1440)%1440
    return`${padZ(Math.floor(totalMins/60))}:${padZ(totalMins%60)}`
  }catch{return''}
}

// ─── Avatar ───────────────────────────────────────────────────────
function Avatar({name,size=28,style={}}){
  const[bg,fg]=avatarColor(name)
  return<div style={{width:size,height:size,borderRadius:'50%',background:bg,border:`1.5px solid ${fg}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.34,fontWeight:800,color:fg,fontFamily:'Syne,sans-serif',flexShrink:0,...style}}>{initials(name)}</div>
}

// ─── Status Badge ─────────────────────────────────────────────────
function StatusBadge({status,small=false}){
  const cfg={
    pending: {bg:'rgba(230,168,0,.12)',color:'#a07000',border:'rgba(230,168,0,.4)',label:'⏳ Pending'},
    approved:{bg:'rgba(30,160,120,.1)', color:'#1a9070',border:'rgba(30,160,120,.3)',label:'✓ Approved'},
    rejected:{bg:'#d63030',             color:'#fff',   border:'#b82828',           label:'✕ Declined',glow:true},
  }
  const s=cfg[status]||cfg.pending
  return<span style={{fontSize:small?9:10,padding:small?'2px 7px':'4px 10px',borderRadius:20,background:s.bg,color:s.color,border:`1px solid ${s.border}`,fontFamily:'Syne,sans-serif',fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',whiteSpace:'nowrap',boxShadow:s.glow?'0 2px 8px rgba(214,48,48,.35)':'none'}}>{s.label}</span>
}

// ─── Drag Profile Switcher ────────────────────────────────────────
function DragProfileSwitcher({profiles,selected,onSelect}){
  const[open,setOpen]=useState(false)
  const[dragIdx,setDragIdx]=useState(null)
  const[dragOver,setDragOver]=useState(null)
  const[order,setOrder]=useState(null)
  const ref=useRef()
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)}
    document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)
  },[])
  const sorted=order?order.map(id=>profiles.find(p=>p.id===id)).filter(Boolean).concat(profiles.filter(p=>!order.includes(p.id))):profiles
  const cur=profiles.find(p=>p.id===selected)||profiles[0]
  function onDragStart(e,i){setDragIdx(i);e.dataTransfer.effectAllowed='move'}
  function onDrop(e,i){
    e.preventDefault()
    if(dragIdx===null||dragIdx===i){setDragIdx(null);setDragOver(null);return}
    const arr=[...sorted];const[m]=arr.splice(dragIdx,1);arr.splice(i,0,m)
    setOrder(arr.map(p=>p.id));setDragIdx(null);setDragOver(null)
  }
  return<div ref={ref} style={{position:'relative'}}>
    <button onClick={()=>setOpen(o=>!o)} style={{display:'flex',alignItems:'center',gap:7,padding:'6px 11px',background:'rgba(255,255,255,.85)',border:'1px solid rgba(200,192,178,.45)',borderRadius:8,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:11,color:'#1a1714',fontWeight:600,transition:'all .2s',whiteSpace:'nowrap'}}>
      <span style={{display:'flex',flexDirection:'column',gap:2.5}}>
        {[14,10,12].map((w,i)=><span key={i} style={{display:'block',width:w,height:1.5,background:'#1a1714',borderRadius:2,opacity:.6}}/>)}
      </span>
      <span style={{fontSize:11}}>{cur?.name||'Profile'}</span>
      <span style={{fontSize:9,opacity:.5}}>{open?'▲':'▼'}</span>
    </button>
    {open&&<div style={{position:'absolute',top:'calc(100% + 8px)',right:0,background:'#fff',border:'1px solid rgba(200,192,178,.35)',borderRadius:14,boxShadow:'0 16px 48px rgba(80,60,40,.18)',zIndex:9999,minWidth:220,overflow:'hidden',animation:'scaleIn .18s ease both'}}>
      <div style={{padding:'7px 12px',borderBottom:'1px solid rgba(200,192,178,.2)',fontSize:9,color:'rgba(90,82,72,.45)',textTransform:'uppercase',letterSpacing:'1px',fontFamily:'Syne,sans-serif',fontWeight:700,display:'flex',alignItems:'center',gap:4}}>
        Switch Profile<span style={{marginLeft:'auto',opacity:.4,fontWeight:400,fontStyle:'italic',fontSize:9}}>drag to reorder</span>
      </div>
      {sorted.map((p,i)=>{
        const isSel=p.id===selected;const accent='#c2692a'
        return<div key={p.id} draggable onDragStart={e=>onDragStart(e,i)} onDragEnter={()=>setDragOver(i)} onDragOver={e=>e.preventDefault()} onDrop={e=>onDrop(e,i)} onDragEnd={()=>{setDragIdx(null);setDragOver(null)}} onClick={()=>{onSelect(p.id);setOpen(false)}}
          style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',cursor:'grab',background:isSel?`${accent}14`:dragOver===i&&dragIdx!==i?`${accent}08`:'transparent',borderLeft:`3px solid ${isSel?accent:'transparent'}`,borderTop:`2px solid ${dragOver===i&&dragIdx!==i?`${accent}60`:'transparent'}`,transition:'background .1s',opacity:dragIdx===i?.4:1}}>
          <span style={{display:'flex',flexDirection:'column',gap:2,opacity:.3,flexShrink:0}}>
            {[0,1,2].map(r=><span key={r} style={{display:'block',width:12,height:1.5,background:'#1a1714',borderRadius:1}}/>)}
          </span>
          <Avatar name={p.name} size={28}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{p.name}</div>
            <div style={{fontSize:10,color:'rgba(90,82,72,.45)',marginTop:1}}>{p.role}</div>
          </div>
          {isSel&&<span style={{color:accent,fontSize:13,fontWeight:800,marginLeft:'auto'}}>✓</span>}
        </div>
      })}
    </div>}
  </div>
}

// ─── Description Modal ────────────────────────────────────────────
function DescModal({booking,profiles,onClose}){
  if(!booking)return null
  const prof=profiles.find(p=>p.id===booking.profileId)
  const m=TC[booking.type]||TC.other
  return<div className="overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="card" style={{width:'100%',maxWidth:480,animation:'scaleIn .22s ease both'}}>
      <div style={{padding:'1.4rem 1.7rem',borderBottom:'1px solid rgba(200,192,178,.22)',background:`linear-gradient(135deg,${m.bg},transparent)`}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span className="tag" style={{background:m.bg,color:m.color,border:`1px solid ${m.border}`}}>{booking.type}</span>
            {prof&&<div style={{display:'flex',alignItems:'center',gap:6}}><Avatar name={prof.name} size={20}/><span style={{fontSize:11,color:'rgba(90,82,72,.6)',fontWeight:600}}>{prof.name}</span></div>}
          </div>
          <button className="btn-soft" onClick={onClose} style={{width:30,height:30,borderRadius:8,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>✕</button>
        </div>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.2rem',fontWeight:800,color:'#1a1714',marginTop:10,letterSpacing:'-.3px'}}>{booking.title}</h2>
        <p style={{fontSize:11,color:'rgba(90,82,72,.45)',marginTop:4}}>{dDate(booking.date)} · {dTime(booking.startTime)} – {dTime(booking.endTime)} IST</p>
      </div>
      <div style={{padding:'1.5rem 1.7rem'}}>
        <label className="lbl">Full Description</label>
        <p style={{fontSize:14,color:'rgba(90,82,72,.85)',lineHeight:1.75,whiteSpace:'pre-wrap',background:'rgba(245,244,240,.6)',border:'1px solid rgba(200,192,178,.25)',borderRadius:10,padding:'12px 14px',minHeight:80}}>{booking.desc||<span style={{opacity:.35,fontStyle:'italic'}}>No description provided.</span>}</p>
        <div style={{marginTop:14,display:'flex',gap:8,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:120,background:'rgba(245,244,240,.7)',borderRadius:8,padding:'8px 12px'}}>
            <div style={{fontSize:9,color:'rgba(90,82,72,.4)',textTransform:'uppercase',letterSpacing:1,fontWeight:700,marginBottom:3}}>Booked By</div>
            <div style={{fontSize:12,fontWeight:700,color:'#1a1714'}}>{booking.bookedBy}</div>
            {booking.userPhone&&<div style={{fontSize:11,color:'rgba(90,82,72,.5)',marginTop:1}}>{booking.userPhone}</div>}
          </div>
        </div>
      </div>
      <div style={{padding:'1rem 1.7rem',borderTop:'1px solid rgba(200,192,178,.18)',display:'flex',justifyContent:'flex-end'}}>
        <button className="btn-dark" onClick={onClose} style={{padding:'9px 22px',borderRadius:10,fontSize:13}}>Close</button>
      </div>
    </div>
  </div>
}

// ─── Theme Picker ─────────────────────────────────────────────────
function ThemePicker({theme,setTheme}){
  const[open,setOpen]=useState(false)
  const ref=useRef()
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)}
    document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)
  },[])
  const cur=THEMES[theme]||THEMES.default
  return<div ref={ref} style={{position:'relative'}}>
    <button onClick={()=>setOpen(o=>!o)} title="Change Theme" style={{display:'flex',alignItems:'center',gap:6,padding:'6px 11px',background:'rgba(255,255,255,.85)',border:'1px solid rgba(200,192,178,.45)',borderRadius:8,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:11,color:'#1a1714',fontWeight:600,transition:'all .2s',whiteSpace:'nowrap'}}>
      <span style={{fontSize:14}}>{cur.icon}</span>
      <span style={{fontSize:9,opacity:.5,marginLeft:1}}>{open?'▲':'▼'}</span>
    </button>
    {open&&<div style={{position:'absolute',top:'calc(100% + 8px)',right:0,background:'#fff',border:'1px solid rgba(200,192,178,.35)',borderRadius:14,boxShadow:'0 16px 48px rgba(80,60,40,.18)',zIndex:9999,minWidth:190,overflow:'hidden',animation:'scaleIn .18s ease both'}}>
      <div style={{padding:'7px 12px',borderBottom:'1px solid rgba(200,192,178,.2)',fontSize:9,color:'rgba(90,82,72,.45)',textTransform:'uppercase',letterSpacing:'1px',fontFamily:'Syne,sans-serif',fontWeight:700}}>Choose Theme</div>
      {Object.entries(THEMES).map(([key,t])=>{
        const accent=t['--t-accent']
        return<div key={key} onClick={()=>{setTheme(key);setOpen(false)}} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',cursor:'pointer',background:key===theme?`${accent}14`:'transparent',transition:'background .12s',borderLeft:`3px solid ${key===theme?accent:'transparent'}`}} onMouseOver={e=>e.currentTarget.style.background=`${accent}0e`} onMouseOut={e=>e.currentTarget.style.background=key===theme?`${accent}14`:'transparent'}>
          <span style={{fontSize:18}}>{t.icon}</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{t.name}</div>
            <div style={{display:'flex',gap:4,marginTop:4}}>
              {[t['--t-accent'],t['--t-accent2']].map((c,i)=><div key={i} style={{width:12,height:12,borderRadius:3,background:c,border:'1px solid rgba(0,0,0,.08)'}}/>)}
            </div>
          </div>
          {key===theme&&<span style={{marginLeft:'auto',color:accent,fontSize:13,fontWeight:800}}>✓</span>}
        </div>
      })}
    </div>}
  </div>
}

// ─── Toast ────────────────────────────────────────────────────────
function Toast({msg,type='success',onClose}){
  useEffect(()=>{const t=setTimeout(onClose,5000);return()=>clearTimeout(t)},[])
  return<div className="toast-wrap card">
    <div style={{padding:'14px 16px',display:'flex',alignItems:'flex-start',gap:12}}>
      <div style={{width:36,height:36,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,background:'#1a1714',color:'#f5f4f0',animation:'pulseRing 2s infinite'}}>{type==='success'?'✓':'📋'}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:700,color:'#1a1714',marginBottom:3,fontFamily:'Syne,sans-serif'}}>{type==='success'?'Done!':'Submitted'}</div>
        <div style={{fontSize:11,color:'rgba(90,82,72,.68)',lineHeight:1.6}}>{msg}</div>
      </div>
      <button onClick={onClose} style={{background:'transparent',border:'none',color:'rgba(90,82,72,.38)',cursor:'pointer',fontSize:16}}>✕</button>
    </div>
  </div>
}

// ─── Scrolling Notice Banner ──────────────────────────────────────
function NoticeBanner({notices,onClickNotice}){
  const active=notices.filter(n=>n.active!==false)
  if(!active.length)return null
  const items=[...active,...active,...active].map(n=>`📢  ${n.title}  —  ${n.message.slice(0,90)}${n.message.length>90?'…':''}`)
  const fullText=items.join('     ✦     ')
  return<div style={{background:'linear-gradient(90deg,rgba(194,105,42,.13),rgba(30,160,120,.09) 50%,rgba(194,105,42,.08))',borderBottom:'1px solid rgba(194,105,42,.2)',height:38,display:'flex',alignItems:'center',overflow:'hidden',cursor:'pointer'}} onClick={()=>onClickNotice(active[0])}>
    <div style={{flexShrink:0,display:'flex',alignItems:'center',zIndex:2}}>
      <div style={{width:12}}/>
      <span style={{fontSize:9,fontWeight:800,color:'#c2692a',fontFamily:'Syne,sans-serif',textTransform:'uppercase',letterSpacing:'1.2px',background:'rgba(194,105,42,.15)',border:'1px solid rgba(194,105,42,.3)',borderRadius:10,padding:'3px 10px',whiteSpace:'nowrap',flexShrink:0}}>LIVE</span>
      <div style={{width:1,height:22,background:'rgba(194,105,42,.2)',margin:'0 10px'}}/>
    </div>
    <div style={{flex:1,overflow:'hidden'}}>
      <div style={{display:'inline-block',whiteSpace:'nowrap',animation:'tickerScroll 42s linear infinite',fontSize:11.5,color:'#1a1714',fontWeight:500,letterSpacing:'.1px',lineHeight:'38px'}}>{fullText}</div>
    </div>
    <div style={{flexShrink:0,display:'flex',alignItems:'center',zIndex:2}}>
      <div style={{width:60,background:'linear-gradient(to right,transparent,rgba(245,243,238,.95))',pointerEvents:'none',height:38}}/>
      <div style={{background:'rgba(194,105,42,.12)',borderLeft:'1px solid rgba(194,105,42,.2)',padding:'0 14px',height:38,display:'flex',alignItems:'center'}}>
        <span style={{fontSize:10,color:'#c2692a',fontFamily:'Syne,sans-serif',fontWeight:700,whiteSpace:'nowrap'}}>Read →</span>
      </div>
    </div>
  </div>
}

// ─── Notice Detail Modal ──────────────────────────────────────────
function NoticeModal({notice,onClose}){
  if(!notice)return null
  return<div className="overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="card" style={{width:'100%',maxWidth:480,animation:'scaleIn .28s ease both'}}>
      <div style={{padding:'1.5rem 1.7rem',borderBottom:'1px solid rgba(200,192,178,.25)',background:'linear-gradient(135deg,rgba(194,105,42,.08),rgba(30,160,120,.04))'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:18}}>📢</span>
            <span style={{fontSize:10,fontWeight:800,color:'#c2692a',fontFamily:'Syne,sans-serif',textTransform:'uppercase',letterSpacing:'1px'}}>Notice from Admin</span>
          </div>
          <button className="btn-soft" onClick={onClose} style={{width:30,height:30,borderRadius:8,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>✕</button>
        </div>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.3rem',fontWeight:800,color:'#1a1714',marginTop:10,letterSpacing:'-.3px'}}>{notice.title}</h2>
        {notice.createdAt&&<p style={{fontSize:10,color:'rgba(90,82,72,.45)',marginTop:4}}>{new Date(notice.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>}
      </div>
      <div style={{padding:'1.5rem 1.7rem'}}>
        <p style={{fontSize:14,color:'rgba(90,82,72,.85)',lineHeight:1.75,whiteSpace:'pre-wrap'}}>{notice.message}</p>
      </div>
      <div style={{padding:'1rem 1.7rem',borderTop:'1px solid rgba(200,192,178,.2)',display:'flex',justifyContent:'flex-end'}}>
        <button className="btn-dark" onClick={onClose} style={{padding:'9px 22px',borderRadius:10,fontSize:13}}>Got it ✓</button>
      </div>
    </div>
  </div>
}

// ─── Time Field ───────────────────────────────────────────────────
function TimeField({label,value,onChange}){
  const{h,m,ap}=to12(value||'09:00')
  const[hour,setHour]=useState(h)
  const[min,setMin]=useState(m)
  const[ampm,setAmpm]=useState(ap)
  useEffect(()=>{
    const hh=hour.replace(/\D/g,'').slice(0,2)||'12'
    const mm=min.replace(/\D/g,'').slice(0,2)||'00'
    onChange(to24(hh,mm,ampm))
  },[hour,min,ampm])
  const cH=v=>String(Math.max(1,Math.min(12,parseInt(v)||12)))
  const cM=v=>padZ(Math.max(0,Math.min(59,parseInt(v)||0)))
  return<div>
    <label className="lbl">{label}</label>
    <div style={{display:'flex',alignItems:'center',gap:6}}>
      <input className="t-box" value={hour} maxLength={2} placeholder="9" onChange={e=>setHour(e.target.value)} onBlur={e=>setHour(cH(e.target.value))}/>
      <span style={{color:'rgba(90,82,72,.3)',fontSize:20,fontWeight:200}}>:</span>
      <input className="t-box" value={min} maxLength={2} placeholder="00" onChange={e=>setMin(e.target.value)} onBlur={e=>setMin(cM(e.target.value))}/>
      <div className="ampm-wrap" style={{marginLeft:2}}>
        <button className={`ampm-btn${ampm==='AM'?' on':''}`} onClick={()=>setAmpm('AM')}>AM</button>
        <button className={`ampm-btn${ampm==='PM'?' on':''}`} onClick={()=>setAmpm('PM')}>PM</button>
      </div>
    </div>
  </div>
}

// ─── Search Bar ───────────────────────────────────────────────────
function SearchBar({bookings,profiles,onResult,onClear}){
  const[q,setQ]=useState('')
  const[open,setOpen]=useState(false)
  const ref=useRef()
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target)){setOpen(false)}}
    document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)
  },[])
  const results=q.trim().length>1?bookings.filter(b=>(b.bookedBy||'').toLowerCase().includes(q.toLowerCase())||(b.title||'').toLowerCase().includes(q.toLowerCase())):[]
  function pick(b){setQ(b.bookedBy);setOpen(false);onResult(b)}
  function clear(){setQ('');setOpen(false);onClear()}
  return<div ref={ref} style={{position:'relative',flex:1,maxWidth:280}}>
    <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,.85)',border:'1px solid rgba(200,192,178,.45)',borderRadius:9,overflow:'hidden',transition:'all .2s'}}>
      <span style={{padding:'0 10px',fontSize:13,color:'rgba(90,82,72,.4)'}}>🔍</span>
      <input value={q} onChange={e=>{setQ(e.target.value);setOpen(true);if(!e.target.value)onClear()}} onFocus={()=>setOpen(true)} placeholder="Search bookings by name…" style={{flex:1,padding:'7px 0',background:'transparent',border:'none',outline:'none',fontSize:12,color:'#1a1714',fontFamily:'DM Sans,sans-serif'}}/>
      {q&&<button onClick={clear} style={{padding:'0 10px',background:'transparent',border:'none',color:'rgba(90,82,72,.4)',cursor:'pointer',fontSize:14}}>✕</button>}
    </div>
    {open&&results.length>0&&<div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,background:'#fff',border:'1px solid rgba(200,192,178,.35)',borderRadius:10,boxShadow:'0 8px 32px rgba(80,60,40,.12)',zIndex:9999,maxHeight:220,overflowY:'auto'}}>
      {results.slice(0,8).map(b=>{
        const prof=profiles.find(p=>p.id===b.profileId)
        return<div key={b.id} onClick={()=>pick(b)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',cursor:'pointer',borderBottom:'1px solid rgba(200,192,178,.1)',transition:'background .12s'}} onMouseOver={e=>e.currentTarget.style.background='rgba(194,105,42,.04)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
          <Avatar name={b.bookedBy} size={26}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:'#1a1714',fontFamily:'Syne,sans-serif',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.title}</div>
            <div style={{fontSize:10,color:'rgba(90,82,72,.55)'}}>{b.bookedBy} · {prof?.name||''} · {dDate(b.date)}</div>
          </div>
          <StatusBadge status={b.status||'pending'} small/>
        </div>
      })}
    </div>}
  </div>
}

// ─── Name Modal ───────────────────────────────────────────────────
function NameModal({onSave,onClose}){
  const[name,setName]=useState('')
  const[phone,setPhone]=useState('')
  const ref=useRef()
  useEffect(()=>ref.current?.focus(),[])
  const ok=name.trim().length>0
  return<div className="overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="card" style={{padding:'2.5rem',width:'100%',maxWidth:420,animation:'scaleIn .28s ease both',position:'relative'}}>
      <button onClick={onClose} style={{position:'absolute',top:16,right:16,width:32,height:32,borderRadius:8,background:'rgba(200,192,178,.15)',border:'1px solid rgba(200,192,178,.3)',color:'rgba(90,82,72,.5)',cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.background='rgba(200,60,60,.1)';e.currentTarget.style.color='#c03838'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(200,192,178,.15)';e.currentTarget.style.color='rgba(90,82,72,.5)'}}>✕</button>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:20}}>
          <div style={{width:36,height:36,borderRadius:11,background:'linear-gradient(135deg,#fde8d5,#fef3e2)',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(194,105,42,.22)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(194,105,42,.12)" stroke="#c2692a" strokeWidth="1.6"/><line x1="12" y1="12" x2="12" y2="5.5" stroke="#c2692a" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="12" x2="16.2" y2="14.5" stroke="#c2692a" strokeWidth="1.4" strokeLinecap="round"/><circle cx="12" cy="12" r="1.6" fill="#c2692a"/></svg>
          </div>
          <span style={{fontFamily:'Syne,sans-serif',fontSize:'1.2rem',fontWeight:800,color:'#1a1714',letterSpacing:'-.4px'}}>SlotBook</span>
        </div>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.7rem',fontWeight:800,color:'#1a1714',letterSpacing:'-.5px',marginBottom:8}}>What's your name?</h2>
        <p style={{fontSize:13,color:'rgba(90,82,72,.55)',lineHeight:1.65}}>Your name will be recorded and visible to the admin.</p>
      </div>
      <label className="lbl">Full Name</label>
      <input ref={ref} className="f-in" placeholder="e.g. Priya Sharma" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ok&&onSave(name.trim(),phone.trim())} style={{marginBottom:'1rem'}}/>
      <label className="lbl">Phone Number <span style={{fontStyle:'italic',textTransform:'none',letterSpacing:0,color:'rgba(90,82,72,.3)',fontWeight:400}}>(optional)</span></label>
      <input className="f-in" placeholder="e.g. +91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ok&&onSave(name.trim(),phone.trim())} style={{marginBottom:'1.25rem'}}/>
      <button className="btn-dark" onClick={()=>ok&&onSave(name.trim(),phone.trim())} style={{width:'100%',padding:13,borderRadius:12,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:ok?1:.4,cursor:ok?'pointer':'not-allowed'}}>
        Continue <span style={{animation:'arrBounce 1.3s ease infinite',display:'inline-block'}}>→</span>
      </button>
    </div>
  </div>
}

// ─── Book Modal ───────────────────────────────────────────────────
function BookModal({prefillDate,prefillHour,bookings,userName,userPhone,profileId,profiles,onBook,onClose,saving,selectedTZ}){
  const[date,setDate]=useState(prefillDate||fmtDate(new Date()))
  const initH=prefillHour!=null?String(prefillHour>12?prefillHour-12:prefillHour||12):'12'
  const initAP=prefillHour!=null?(prefillHour>=12?'PM':'AM'):'AM'
  const[start,setStart]=useState(prefillHour!=null?to24(initH,'00',initAP):'00:00')
  const[end,setEnd]=useState(prefillHour!=null?to24(String(prefillHour>11?prefillHour-11:prefillHour+1),'00',prefillHour>=11?'PM':'AM'):'00:00')
  const[type,setType]=useState('interview')
  const[title,setTitle]=useState('')
  const[desc,setDesc]=useState('')
  const profile=profiles.find(p=>p.id===profileId)
  const profB=bookings.filter(b=>b.profileId===profileId&&(b.status||'pending')!=='rejected')
  const isIST=selectedTZ==='Asia/Kolkata'
  const tzInfo=TIMEZONES.find(z=>z.tz===selectedTZ)||TIMEZONES[0]
  const istStart=isIST?start:convertTimeTZ(start,selectedTZ,'Asia/Kolkata')
  const istEnd=isIST?end:convertTimeTZ(end,selectedTZ,'Asia/Kolkata')
  const endErr=end&&start&&tmins(end)<=tmins(start)
  const clash=!endErr&&istStart&&istEnd&&profB.some(b=>b.date===date&&olap(istStart,istEnd,b.startTime,b.endTime))
  const canBook=!!date&&!!title.trim()&&!endErr&&!clash
  const m=TC[type]
  function submit(){
    if(!canBook||saving)return
    onBook({id:uid(),date,startTime:istStart,endTime:istEnd,type,title:title.trim(),desc:desc.trim(),bookedBy:userName,userPhone:userPhone||'',profileId,status:'pending'})
  }
  return<div className="overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="card" style={{width:'100%',maxWidth:520,overflow:'hidden',display:'flex',flexDirection:'column',maxHeight:'92vh',animation:'scaleIn .28s ease both'}}>
      <div style={{padding:'1.5rem 1.8rem 1.2rem',borderBottom:'1px solid rgba(200,192,178,.28)',flexShrink:0,background:'linear-gradient(135deg,rgba(194,105,42,.08),rgba(210,240,230,.16))'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
          <div>
            <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.45rem',fontWeight:800,color:'#1a1714',letterSpacing:'-.4px',marginBottom:4}}>Reserve a Slot</h2>
            {profile&&<div style={{display:'flex',alignItems:'center',gap:7,marginTop:4}}><Avatar name={profile.name} size={20}/><span style={{fontSize:12,color:'rgba(90,82,72,.6)',fontWeight:500}}>For <strong style={{color:'#1a1714'}}>{profile.name}</strong></span></div>}
          </div>
          <button className="btn-soft" onClick={onClose} style={{width:32,height:32,borderRadius:8,fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>✕</button>
        </div>
      </div>
      <div style={{overflowY:'auto',flex:1,padding:'1.5rem 1.8rem',display:'flex',flexDirection:'column',gap:16,background:'rgba(255,255,255,.35)'}}>
        <div style={{background:'rgba(200,140,30,.08)',border:'1px solid rgba(200,140,30,.25)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#8a5e12'}}>ℹ️ Booking shows as <strong>Pending</strong> until admin approves.</div>
        {clash&&!endErr&&<div className="alert-red show">⚠ This time overlaps an existing booking for this profile.</div>}
        {endErr&&<div className="alert-amber show">⚠ End time must be after start time.</div>}
        <div>
          <label className="lbl">Date</label>
          <input type="date" className="f-in" value={date} onChange={e=>setDate(e.target.value)}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <TimeField label={isIST?'Start Time':`Start (${tzInfo.label.split(' ')[1]||'Your TZ'})`} value={start} onChange={setStart}/>
          <TimeField label={isIST?'End Time':`End (${tzInfo.label.split(' ')[1]||'Your TZ'})`} value={end} onChange={setEnd}/>
        </div>
        {date&&start&&end&&!endErr&&<div style={{display:'flex',flexDirection:'column',gap:6}}>
          {!isIST&&<div style={{background:'rgba(194,105,42,.06)',border:'1px solid rgba(194,105,42,.2)',borderRadius:9,padding:'9px 13px',fontSize:11,display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:13}}>🕐</span>
            <span><strong style={{color:'#c2692a'}}>{tzInfo.label}:</strong> <span style={{color:'#1a1714',fontWeight:600}}>{dTime(start)} – {dTime(end)}</span></span>
          </div>}
          <div style={{background:'rgba(30,160,120,.06)',border:'1px solid rgba(30,160,120,.2)',borderRadius:9,padding:'9px 13px',fontSize:11,display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:13}}>🌍</span>
            <span><strong style={{color:'#1a1714'}}>IST (India):</strong> <span style={{color:'#1a9070',fontWeight:600}}>{dTime(istStart)} – {dTime(istEnd)}</span></span>
            {!isIST&&<span style={{fontSize:10,color:'rgba(90,82,72,.4)',marginLeft:'auto'}}>Booking stored in IST</span>}
          </div>
        </div>}
        <div>
          <label className="lbl">Booking Type</label>
          <div style={{display:'flex',gap:8}}>
            {Object.entries(TC).map(([k,v])=><button key={k} className="tchip" onClick={()=>setType(k)} style={type===k?{background:v.bg,borderColor:v.border,color:v.color}:{}}>{k.charAt(0).toUpperCase()+k.slice(1)}</button>)}
          </div>
        </div>
        <div>
          <label className="lbl">Title</label>
          <input className="f-in" placeholder="Company (specify rounds 1, 2, Client, etc.)" value={title} onChange={e=>setTitle(e.target.value)}/>
        </div>
        <div>
          <label className="lbl">Description <span style={{fontStyle:'italic',textTransform:'none',letterSpacing:0,color:'rgba(90,82,72,.3)',fontWeight:400}}>(optional)</span></label>
          <textarea className="f-in" rows={3} style={{resize:'vertical'}} placeholder="Agenda, notes…" value={desc} onChange={e=>setDesc(e.target.value)}/>
        </div>
        <div style={{borderRadius:12,padding:'14px 16px',background:m.bg,border:`1px solid ${m.border}`}}>
          <div style={{fontSize:10,color:'rgba(90,82,72,.4)',textTransform:'uppercase',letterSpacing:1,fontWeight:700,marginBottom:6,fontFamily:'Syne,sans-serif'}}>Summary</div>
          <div style={{fontSize:15,fontWeight:800,color:'#1a1714',fontFamily:'Syne,sans-serif',marginBottom:4,opacity:title?1:.28,fontStyle:title?'normal':'italic'}}>{title||'No title yet…'}</div>
          <div style={{fontSize:11,color:'rgba(90,82,72,.55)',display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
            <span>{date?dDate(date):'—'}</span><span style={{opacity:.35}}>·</span><span>{dTime(istStart)} – {dTime(istEnd)} IST</span><StatusBadge status="pending" small/>
          </div>
        </div>
      </div>
      <div style={{padding:'1.2rem 1.8rem',borderTop:'1px solid rgba(200,192,178,.28)',flexShrink:0,background:'rgba(255,255,255,.58)'}}>
        <div style={{display:'flex',gap:10}}>
          <button className="btn-soft" onClick={onClose} style={{flex:1,padding:13,borderRadius:12,fontSize:13}}>Cancel</button>
          <button className="btn-dark" onClick={submit} style={{flex:2,padding:13,borderRadius:12,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:canBook&&!saving?1:.3,cursor:canBook&&!saving?'pointer':'not-allowed'}}>
            {saving?<><span className="spinner"></span> Submitting…</>:<>Submit for Approval →</>}
          </button>
        </div>
      </div>
    </div>
  </div>
}

// ─── Cancel Booking Modal ─────────────────────────────────────────
function CancelModal({booking,userName,profiles,onCancel,onClose}){
  const[conf,setConf]=useState('')
  const prof=profiles.find(p=>p.id===booking.profileId)
  const match=conf.trim().toLowerCase()===booking.bookedBy.toLowerCase()
  return<div className="overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="card" style={{width:'100%',maxWidth:440,animation:'scaleIn .28s ease both'}}>
      <div style={{padding:'1.5rem 1.7rem',borderBottom:'1px solid rgba(200,192,178,.25)',background:'linear-gradient(135deg,rgba(220,60,60,.06),transparent)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.25rem',fontWeight:800,color:'#1a1714'}}>Cancel Booking</h2>
          <button className="btn-soft" onClick={onClose} style={{width:30,height:30,borderRadius:8,fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>✕</button>
        </div>
      </div>
      <div style={{padding:'1.5rem 1.7rem',display:'flex',flexDirection:'column',gap:14}}>
        <div style={{background:'rgba(200,60,60,.06)',border:'1px solid rgba(200,60,60,.2)',borderRadius:10,padding:'12px 14px'}}>
          <div style={{fontSize:13,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif',marginBottom:4}}>{booking.title}</div>
          <div style={{fontSize:11,color:'rgba(90,82,72,.6)'}}>{prof?.name} · {dDate(booking.date)} · {dTime(booking.startTime)} – {dTime(booking.endTime)}</div>
          <div style={{marginTop:6}}><StatusBadge status={booking.status||'pending'} small/></div>
        </div>
        <div style={{background:'rgba(200,140,30,.08)',border:'1px solid rgba(200,140,30,.25)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#8a5e12'}}>
          ⚠ To confirm cancellation, type your name exactly as you entered it.
        </div>
        <div>
          <label className="lbl">Type your name to confirm</label>
          <input className="f-in" placeholder={booking.bookedBy} value={conf} onChange={e=>setConf(e.target.value)}/>
          {conf&&!match&&<p style={{fontSize:11,color:'#c03838',marginTop:4}}>Name doesn't match. Type: <strong>{booking.bookedBy}</strong></p>}
        </div>
      </div>
      <div style={{padding:'1rem 1.7rem',borderTop:'1px solid rgba(200,192,178,.2)',display:'flex',gap:10}}>
        <button className="btn-soft" onClick={onClose} style={{flex:1,padding:11,borderRadius:11,fontSize:13}}>Keep Booking</button>
        <button onClick={()=>match&&onCancel(booking.id)} style={{flex:1,padding:11,borderRadius:11,fontSize:13,fontFamily:'Syne,sans-serif',fontWeight:700,background:match?'rgba(200,60,60,.9)':'rgba(200,60,60,.2)',color:match?'#fff':'rgba(200,60,60,.5)',border:'none',cursor:match?'pointer':'not-allowed',transition:'all .2s'}}>
          Yes, Cancel It
        </button>
      </div>
    </div>
  </div>
}

// ─── Day Modal ────────────────────────────────────────────────────
function DayModal({dateStr,bookings,profileId,userName,onBookHere,onClose,onCancelRequest}){
  const d=parseDate(dateStr)
  const dayB=bookings.filter(b=>b.date===dateStr&&b.profileId===profileId).sort((a,b)=>a.startTime.localeCompare(b.startTime))
  return<div className="overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="card" style={{width:'100%',maxWidth:480,maxHeight:'85vh',display:'flex',flexDirection:'column',animation:'scaleIn .28s ease both'}}>
      <div style={{padding:'1.5rem 1.7rem',borderBottom:'1px solid rgba(200,192,178,.24)',flexShrink:0,background:'linear-gradient(135deg,rgba(220,210,255,.2),rgba(210,240,230,.12))'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:800,color:'#1a1714',letterSpacing:'-.3px'}}>{MONTHS[d.getMonth()]} {d.getDate()}<span style={{fontWeight:300,color:'rgba(90,82,72,.4)'}}>, {d.getFullYear()}</span></h2>
            <p style={{fontSize:11,color:'rgba(90,82,72,.48)',marginTop:3}}>{dayB.length} booking{dayB.length!==1?'s':''} · times in IST</p>
          </div>
          <button className="btn-soft" onClick={onClose} style={{width:32,height:32,borderRadius:8,fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>✕</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'1.25rem 1.7rem',display:'flex',flexDirection:'column',gap:10,background:'rgba(255,255,255,.26)'}}>
        {dayB.length===0?<div style={{textAlign:'center',padding:'2.5rem 0'}}><div style={{fontSize:36,marginBottom:12,opacity:.12}}>◇</div><p style={{color:'rgba(90,82,72,.38)',fontSize:13}}>No bookings yet — be the first!</p></div>
        :dayB.map((b,i)=>{
          const m=TC[b.type]||TC.other
          const isOwn=userName&&b.bookedBy.toLowerCase()===userName.toLowerCase()
          const canCancel=isOwn&&(b.status==='pending')
          return<div key={b.id} className="animate-fadeUp" style={{animationDelay:`${i*.07}s`,background:b.status==='rejected'?'rgba(214,48,48,.1)':b.status==='pending'?'rgba(255,255,255,.95)':m.bg,border:b.status==='rejected'?'1px solid rgba(214,48,48,.4)':b.status==='pending'?'2px dashed #e6a800':`1px solid ${m.border}`,borderLeft:b.status==='rejected'?'4px solid #d63030':b.status==='pending'?'4px solid #e6a800':`3px solid ${m.color}`,borderRadius:'0 12px 12px 0',padding:'12px 14px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:700,color:b.status==='rejected'?'#d63030':b.status==='pending'?'#a07000':m.color,fontFamily:'Syne,sans-serif'}}>{dTime(b.startTime)} — {dTime(b.endTime)} <span style={{fontSize:9,fontWeight:500,opacity:.7}}>IST</span></span>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <span className="tag" style={{background:'rgba(255,255,255,.65)',color:m.color,border:`1px solid ${m.border}`}}>{b.type}</span>
                <StatusBadge status={b.status||'pending'} small/>
              </div>
            </div>
            <div style={{fontSize:11,color:'rgba(90,82,72,.4)',marginTop:3}}>
              {b.status==='approved'?'✓ Confirmed':b.status==='rejected'?'✕ Slot declined by admin':'⏳ Awaiting admin approval'}
            </div>
            {canCancel&&<button onClick={()=>onCancelRequest(b)} style={{marginTop:8,fontSize:10,fontWeight:600,color:'#c03838',background:'rgba(200,60,60,.08)',border:'1px solid rgba(200,60,60,.2)',borderRadius:6,padding:'3px 10px',cursor:'pointer',fontFamily:'Syne,sans-serif'}}>Cancel my booking</button>}
          </div>
        })}
      </div>
      <div style={{padding:'1rem 1.7rem',borderTop:'1px solid rgba(200,192,178,.22)',display:'flex',gap:10,flexShrink:0,background:'rgba(255,255,255,.5)'}}>
        <button className="btn-soft" onClick={onClose} style={{flex:1,padding:11,borderRadius:11,fontSize:13}}>Close</button>
        <button className="btn-dark" onClick={()=>{onClose();onBookHere(dateStr)}} style={{flex:2,padding:11,borderRadius:11,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>+ Book This Day <span style={{animation:'arrBounce 1.4s ease infinite',display:'inline-block'}}>→</span></button>
      </div>
    </div>
  </div>
}

// ─── Admin Login ──────────────────────────────────────────────────
function AdminLogin({onLogin,onBack}){
  const[u,setU]=useState('');const[p,setP]=useState('');const[err,setErr]=useState(false)
  function attempt(){if(u===ADMIN_USER&&p===ADMIN_PASS)onLogin();else{setErr(true);setP('')}}
  return<div className="overlay open" onClick={e=>e.target===e.currentTarget&&onBack()}>
    <div className="card" style={{padding:'2.5rem',width:'100%',maxWidth:380,animation:'scaleIn .28s ease both'}}>
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <div style={{fontSize:10,color:'rgba(90,82,72,.38)',textTransform:'uppercase',letterSpacing:2,marginBottom:8,fontFamily:'Syne,sans-serif'}}>Admin Portal</div>
        <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.8rem',fontWeight:800,color:'#1a1714',letterSpacing:'-.4px'}}>Secure Access</h2>
      </div>
      {err&&<div className="alert-red show" style={{marginBottom:14}}>Incorrect credentials.</div>}
      <div style={{marginBottom:12}}>
        <label className="lbl">Username</label>
        <input className="f-in" placeholder="admin" value={u} onChange={e=>{setU(e.target.value);setErr(false)}} autoComplete="username"/>
      </div>
      <div style={{marginBottom:'1.5rem'}}>
        <label className="lbl">Password</label>
        <input type="password" className="f-in" placeholder="••••••••" value={p} onChange={e=>{setP(e.target.value);setErr(false)}} onKeyDown={e=>e.key==='Enter'&&attempt()} autoComplete="current-password"/>
      </div>
      <button className="btn-dark" onClick={attempt} style={{width:'100%',padding:13,borderRadius:12,fontSize:14,marginBottom:10}}>Sign In →</button>
      <button onClick={onBack} style={{width:'100%',background:'transparent',border:'none',color:'rgba(90,82,72,.38)',fontSize:12,cursor:'pointer',padding:8,fontFamily:'DM Sans,sans-serif'}}>← Back to Calendar</button>
    </div>
  </div>
}

// ─── Links Vault Modal ────────────────────────────────────────────
// ─── Links Page (Full Page, replaces modal) ───────────────────────
function LinksPage({vaults,onClose,isAdmin,onAddVault,onDeleteVault,onAddLink,onEditLink,onDeleteLink}){
  const[unlockedVaults,setUnlockedVaults]=useState({})
  const[pinInputs,setPinInputs]=useState({})
  const[pinError,setPinError]=useState({})
  const[expandedVault,setExpandedVault]=useState(null)
  const[addingLinkFor,setAddingLinkFor]=useState(null)
  const[newLinkName,setNewLinkName]=useState('')
  const[newLinkName2,setNewLinkName2]=useState('')
  const[newLinkUrl,setNewLinkUrl]=useState('')
  const[newLinkUrl2,setNewLinkUrl2]=useState('')
  const[newLinkMsg,setNewLinkMsg]=useState('')
  const[editingLink,setEditingLink]=useState(null)
  const[editName,setEditName]=useState('')
  const[editName2,setEditName2]=useState('')
  const[editUrl,setEditUrl]=useState('')
  const[editUrl2,setEditUrl2]=useState('')
  const[editMsg,setEditMsg]=useState('')
  const[newVaultName,setNewVaultName]=useState('')
  const[newVaultPin,setNewVaultPin]=useState('')
  const[newVaultColor,setNewVaultColor]=useState('interview')
  const[showAddVault,setShowAddVault]=useState(false)
  const[copied,setCopied]=useState({})

  function copyText(text,key){
    navigator.clipboard.writeText(text).then(()=>{
      setCopied(prev=>({...prev,[key]:true}))
      setTimeout(()=>setCopied(prev=>({...prev,[key]:false})),2000)
    })
  }

  function attemptUnlock(vaultId,pin){
    const vault=vaults.find(v=>v.id===vaultId)
    if(!vault)return
    if(pin===vault.passcode){
      setUnlockedVaults(prev=>({...prev,[vaultId]:true}))
      setPinError(prev=>({...prev,[vaultId]:false}))
      setExpandedVault(vaultId)
    }else{
      setPinError(prev=>({...prev,[vaultId]:true}))
    }
  }

  function saveEdit(){
    if(!editName.trim())return
    onEditLink(editingLink.vaultId,editingLink.index,{name:editName.trim(),name2:editName2.trim(),url:editUrl.trim(),url2:editUrl2.trim(),message:editMsg.trim()})
    setEditingLink(null)
  }

  return(
    <div style={{position:'fixed',inset:0,zIndex:500,display:'flex',flexDirection:'column',background:'var(--t-bg,#f5f4f0)',overflow:'hidden'}}>

      {/* ── Top bar ── */}
      <div style={{height:58,background:'rgba(255,255,255,.96)',borderBottom:'1px solid rgba(200,192,178,.32)',padding:'0 2rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,backdropFilter:'blur(14px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#1a1714,#3a3330)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🔗</div>
          <div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.2rem',fontWeight:800,color:'#1a1714',letterSpacing:'-.3px',margin:0}}>Link Vaults</h1>
            <p style={{fontSize:10,color:'rgba(90,82,72,.45)',margin:0}}>
              PIN-protected ·{isAdmin&&<span style={{color:'#c2692a',fontWeight:700}}> Admin Mode</span>}
              {!isAdmin&&' Enter PIN to unlock'}
            </p>
          </div>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          {isAdmin&&<button onClick={()=>setShowAddVault(o=>!o)}
            style={{padding:'8px 18px',borderRadius:9,border:'1.5px dashed rgba(194,105,42,.5)',background:showAddVault?'rgba(194,105,42,.1)':'transparent',color:'#c2692a',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif'}}>
            {showAddVault?'✕ Cancel':'+ New Vault'}
          </button>}
          <button onClick={onClose}
            style={{padding:'8px 20px',borderRadius:9,background:'#1a1714',border:'none',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif'}}>
            ← Back
          </button>
        </div>
      </div>

      {/* ── Page body ── */}
      <div style={{flex:1,overflowY:'auto',padding:'2rem 2.5rem'}}>

        {/* Create Vault form — admin only */}
        {isAdmin&&showAddVault&&<div style={{background:'rgba(255,255,255,.92)',border:'1px solid rgba(194,105,42,.25)',borderRadius:16,padding:'1.5rem',marginBottom:'2rem',maxWidth:720,boxShadow:'0 4px 24px rgba(80,60,40,.08)'}}>
          <div style={{fontSize:11,fontWeight:700,color:'rgba(90,82,72,.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:16,fontFamily:'Syne,sans-serif'}}>🔒 Create New Vault</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            <div><label className="lbl">Vault Name</label><input className="f-in" placeholder="e.g. Interview Links" value={newVaultName} onChange={e=>setNewVaultName(e.target.value)}/></div>
            <div><label className="lbl">4-Digit PIN</label><input className="f-in" placeholder="••••" maxLength={4} value={newVaultPin} onChange={e=>setNewVaultPin(e.target.value.replace(/\D/g,'').slice(0,4))} style={{fontFamily:'DM Mono,monospace',letterSpacing:6,fontSize:18,textAlign:'center'}}/></div>
          </div>
          <div style={{marginBottom:14}}>
            <label className="lbl">Color Tag</label>
            <div style={{display:'flex',gap:8}}>
              {Object.entries(TC).map(([k,v])=><button key={k} onClick={()=>setNewVaultColor(k)}
                style={{padding:'6px 16px',borderRadius:8,border:`1.5px solid ${newVaultColor===k?v.border:'rgba(200,192,178,.35)'}`,background:newVaultColor===k?v.bg:'transparent',color:v.color,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif',transition:'all .15s'}}>
                {k.charAt(0).toUpperCase()+k.slice(1)}
              </button>)}
            </div>
          </div>
          <button className="btn-dark"
            onClick={()=>{if(!newVaultName.trim()||newVaultPin.length!==4)return;onAddVault({id:uid(),name:newVaultName.trim(),passcode:newVaultPin,color:newVaultColor,links:[]});setNewVaultName('');setNewVaultPin('');setNewVaultColor('interview');setShowAddVault(false)}}
            style={{padding:'10px 24px',borderRadius:10,fontSize:13,opacity:newVaultName&&newVaultPin.length===4?1:.35,cursor:newVaultName&&newVaultPin.length===4?'pointer':'not-allowed'}}>
            🔒 Create Vault
          </button>
        </div>}

        {vaults.length===0&&<div style={{textAlign:'center',padding:'6rem 0',color:'rgba(90,82,72,.3)',fontSize:14}}>
          <div style={{fontSize:52,marginBottom:16,opacity:.12}}>🔒</div>
          {isAdmin?'Click "+ New Vault" to create your first vault.':'No vaults available yet.'}
        </div>}

        {/* ── Vault cards grid ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(500px,1fr))',gap:22}}>
          {vaults.map(vault=>{
            const isUnlocked=isAdmin||unlockedVaults[vault.id]
            const isExpanded=isUnlocked||expandedVault===vault.id
            const pin=pinInputs[vault.id]||''
            const hasError=pinError[vault.id]
            const m=TC[vault.color]||TC.other

            return(
              <div key={vault.id} style={{background:'rgba(255,255,255,.94)',border:`2px solid ${isUnlocked?m.border:'rgba(200,192,178,.3)'}`,borderRadius:20,overflow:'hidden',boxShadow:isUnlocked?`0 8px 36px ${m.border}28`:'0 2px 14px rgba(80,60,40,.05)',transition:'all .25s',display:'flex',flexDirection:'column'}}>

                {/* Card header */}
                <div style={{padding:'18px 22px',display:'flex',alignItems:'center',gap:14,background:isUnlocked?m.bg:'rgba(250,248,244,.85)',borderBottom:`1px solid ${isUnlocked?m.border:'rgba(200,192,178,.18)'}`,cursor:!isAdmin&&!isUnlocked?'pointer':'default'}}
                  onClick={()=>!isAdmin&&!isUnlocked&&setExpandedVault(isExpanded?null:vault.id)}>
                  <div style={{width:46,height:46,borderRadius:14,background:isUnlocked?m.color:'rgba(200,192,178,.22)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0,transition:'all .2s'}}>
                    {isUnlocked?'🔓':'🔒'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:17,fontWeight:800,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{vault.name}</div>
                    <div style={{fontSize:11,color:'rgba(90,82,72,.5)',marginTop:3,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                      <span>{(vault.links||[]).length} item{(vault.links||[]).length!==1?'s':''}</span>
                      {isAdmin&&<span style={{fontFamily:'DM Mono,monospace',fontWeight:700,color:m.color,background:'rgba(255,255,255,.85)',border:`1px solid ${m.border}`,padding:'2px 8px',borderRadius:5,letterSpacing:2,fontSize:11}}>PIN: {vault.passcode}</span>}
                      <span className="tag" style={{background:m.bg,color:m.color,border:`1px solid ${m.border}`,fontSize:9}}>{vault.color}</span>
                      {!isAdmin&&<span style={{fontWeight:600,color:isUnlocked?'#1a9070':'rgba(90,82,72,.4)'}}>{isUnlocked?'✓ Unlocked':'Click to unlock'}</span>}
                    </div>
                  </div>
                  {!isAdmin&&!isUnlocked&&<span style={{fontSize:12,color:'rgba(90,82,72,.35)'}}>{isExpanded?'▲':'▼'}</span>}
                  {isAdmin&&<button onClick={()=>{if(window.confirm(`Delete vault "${vault.name}"?`))onDeleteVault(vault.id)}}
                    style={{background:'rgba(200,60,60,.09)',border:'1px solid rgba(200,60,60,.22)',color:'#c03838',cursor:'pointer',fontSize:11,padding:'5px 12px',borderRadius:8,fontFamily:'Syne,sans-serif',fontWeight:600,flexShrink:0,transition:'all .15s'}}
                    onMouseOver={e=>e.currentTarget.style.background='rgba(200,60,60,.18)'}
                    onMouseOut={e=>e.currentTarget.style.background='rgba(200,60,60,.09)'}>
                    🗑 Delete
                  </button>}
                </div>

                {/* PIN entry */}
                {!isAdmin&&!isUnlocked&&isExpanded&&<div style={{padding:'16px 22px',background:'rgba(255,255,255,.7)',borderBottom:'1px solid rgba(200,192,178,.15)'}}>
                  <div style={{fontSize:12,color:'rgba(90,82,72,.6)',marginBottom:12,fontWeight:600}}>Enter 4-digit PIN to unlock this vault</div>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <input type="password" maxLength={4} placeholder="••••" value={pin}
                      onChange={e=>{setPinInputs(prev=>({...prev,[vault.id]:e.target.value.replace(/\D/g,'').slice(0,4)}));setPinError(prev=>({...prev,[vault.id]:false}))}}
                      onKeyDown={e=>e.key==='Enter'&&pin.length===4&&attemptUnlock(vault.id,pin)}
                      style={{width:110,padding:'10px 14px',border:`2px solid ${hasError?'#d63030':'rgba(200,192,178,.5)'}`,borderRadius:10,fontSize:22,fontFamily:'DM Mono,monospace',letterSpacing:8,textAlign:'center',outline:'none',background:hasError?'rgba(214,48,48,.04)':'#fff',color:'#1a1714',transition:'border .15s'}}
                      autoFocus/>
                    <button onClick={()=>attemptUnlock(vault.id,pin)} disabled={pin.length!==4}
                      style={{padding:'10px 20px',borderRadius:10,border:'none',background:pin.length===4?'#1a1714':'rgba(200,192,178,.3)',color:pin.length===4?'#fff':'rgba(90,82,72,.4)',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,cursor:pin.length===4?'pointer':'not-allowed',transition:'all .15s'}}>
                      Unlock →
                    </button>
                    {hasError&&<span style={{fontSize:12,color:'#d63030',fontWeight:700}}>⚠ Wrong PIN</span>}
                  </div>
                </div>}

                {/* ── Unlocked content ── */}
                {isUnlocked&&<div style={{padding:'16px 22px',flex:1,display:'flex',flexDirection:'column',gap:12}}>
                  {(vault.links||[]).length===0&&<div style={{fontSize:12,color:'rgba(90,82,72,.35)',fontStyle:'italic',padding:'4px 0 8px'}}>No items yet.</div>}

                  {/* Link items */}
                  {(vault.links||[]).map((link,li)=>{
                    const isEditing=editingLink?.vaultId===vault.id&&editingLink?.index===li
                    const hasUrl=link.url&&link.url.trim()
                    const hasUrl2=link.url2&&link.url2.trim()
                    const hasMsg=link.message&&link.message.trim()
                    const copyKey1=`${vault.id}-${li}-1`
                    const copyKey2=`${vault.id}-${li}-2`

                    if(isEditing)return(
                      <div key={li} style={{padding:16,background:'rgba(255,255,255,.97)',borderRadius:14,border:'2px solid #c2692a',display:'flex',flexDirection:'column',gap:10}}>
                        <div style={{fontSize:10,fontWeight:700,color:'#c2692a',fontFamily:'Syne,sans-serif',textTransform:'uppercase',letterSpacing:1}}>✏ Editing Item</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                          <div>
                            <label className="lbl">Name 1 *</label>
                            <input className="f-in" placeholder="e.g. Interview Room" value={editName} onChange={e=>setEditName(e.target.value)}/>
                          </div>
                          <div>
                            <label className="lbl">Name 2 <span style={{fontStyle:'italic',textTransform:'none',letterSpacing:0,color:'rgba(90,82,72,.3)',fontWeight:400}}>(optional)</span></label>
                            <input className="f-in" placeholder="e.g. Chat Room" value={editName2} onChange={e=>setEditName2(e.target.value)}/>
                          </div>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                          <div>
                            <label className="lbl">Link 1 (optional)</label>
                            <input className="f-in" placeholder="https://..." value={editUrl} onChange={e=>setEditUrl(e.target.value)}/>
                          </div>
                          <div>
                            <label className="lbl">Link 2 (optional)</label>
                            <input className="f-in" placeholder="https://..." value={editUrl2} onChange={e=>setEditUrl2(e.target.value)}/>
                          </div>
                        </div>
                        <div>
                          <label className="lbl">Message / Note (optional)</label>
                          <textarea className="f-in" rows={2} placeholder="Any message to show users…" value={editMsg} onChange={e=>setEditMsg(e.target.value)} style={{resize:'vertical'}}/>
                        </div>
                        <div style={{display:'flex',gap:8}}>
                          <button onClick={()=>setEditingLink(null)} style={{flex:1,padding:'9px',borderRadius:9,border:'1px solid rgba(200,192,178,.4)',background:'transparent',color:'rgba(90,82,72,.6)',fontSize:12,cursor:'pointer'}}>Cancel</button>
                          <button onClick={saveEdit} style={{flex:2,padding:'9px',borderRadius:9,border:'none',background:'#1a1714',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif'}}>Save Changes ✓</button>
                        </div>
                      </div>
                    )

                    return(
                      <div key={li} style={{background:'rgba(255,255,255,.9)',borderRadius:14,border:'1px solid rgba(200,192,178,.22)',overflow:'hidden'}}>
                        {/* Item name row */}
                        <div style={{padding:'12px 16px 10px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:(hasUrl||hasUrl2||hasMsg)?'1px solid rgba(200,192,178,.15)':'none'}}>
                          <div style={{display:'flex',gap:16,alignItems:'center',flex:1}}>
                            <div style={{display:'flex',flexDirection:'column',gap:2}}>
                              <div style={{fontSize:9,fontWeight:700,color:'rgba(90,82,72,.38)',textTransform:'uppercase',letterSpacing:1,fontFamily:'Syne,sans-serif'}}>Name 1</div>
                              <div style={{fontSize:13,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{link.name}</div>
                            </div>
                            {link.name2&&link.name2.trim()&&<>
                              <div style={{width:1,height:32,background:'rgba(200,192,178,.3)'}}/>
                              <div style={{display:'flex',flexDirection:'column',gap:2}}>
                                <div style={{fontSize:9,fontWeight:700,color:'rgba(90,82,72,.38)',textTransform:'uppercase',letterSpacing:1,fontFamily:'Syne,sans-serif'}}>Name 2</div>
                                <div style={{fontSize:13,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{link.name2}</div>
                              </div>
                            </>}
                          </div>
                          {isAdmin&&<div style={{display:'flex',gap:6}}>
                            <button onClick={()=>{setEditingLink({vaultId:vault.id,index:li});setEditName(link.name);setEditName2(link.name2||'');setEditUrl(link.url||'');setEditUrl2(link.url2||'');setEditMsg(link.message||'')}}
                              style={{fontSize:11,padding:'4px 10px',borderRadius:7,border:'1px solid rgba(194,105,42,.3)',background:'rgba(194,105,42,.07)',color:'#c2692a',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600}}>Edit</button>
                            <button onClick={()=>{if(window.confirm(`Delete "${link.name}"?`))onDeleteLink(vault.id,li)}}
                              style={{fontSize:11,padding:'4px 10px',borderRadius:7,border:'1px solid rgba(200,60,60,.2)',background:'rgba(200,60,60,.06)',color:'#c03838',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600}}>Delete</button>
                          </div>}
                        </div>

                        {/* Two URL columns */}
                        {(hasUrl||hasUrl2)&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,borderBottom:hasMsg?'1px solid rgba(200,192,178,.15)':'none'}}>
                          {/* URL 1 */}
                          <div style={{padding:'10px 16px',borderRight:'1px solid rgba(200,192,178,.15)',display:'flex',flexDirection:'column',gap:6}}>
                            <div style={{fontSize:9,fontWeight:700,color:'rgba(90,82,72,.4)',textTransform:'uppercase',letterSpacing:1,fontFamily:'Syne,sans-serif'}}>Link 1</div>
                            {hasUrl
                              ?<>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:'#1878c8',textDecoration:'none',wordBreak:'break-all',lineHeight:1.5,flex:1}}>{link.url}</a>
                                <div style={{display:'flex',gap:6,marginTop:4}}>
                                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                                    style={{fontSize:11,padding:'5px 12px',borderRadius:7,background:'rgba(24,120,200,.1)',color:'#1878c8',border:'1px solid rgba(24,120,200,.2)',textDecoration:'none',fontWeight:600,whiteSpace:'nowrap'}}>Open →</a>
                                  <button onClick={()=>copyText(link.url,copyKey1)}
                                    style={{fontSize:11,padding:'5px 12px',borderRadius:7,background:copied[copyKey1]?'rgba(30,160,120,.12)':'rgba(200,192,178,.12)',color:copied[copyKey1]?'#1a9070':'rgba(90,82,72,.6)',border:`1px solid ${copied[copyKey1]?'rgba(30,160,120,.3)':'rgba(200,192,178,.3)'}`,cursor:'pointer',fontWeight:600,fontFamily:'Syne,sans-serif',transition:'all .2s',whiteSpace:'nowrap'}}>
                                    {copied[copyKey1]?'✓ Copied':'📋 Copy'}
                                  </button>
                                </div>
                              </>
                              :<div style={{fontSize:11,color:'rgba(90,82,72,.25)',fontStyle:'italic'}}>—</div>
                            }
                          </div>

                          {/* URL 2 */}
                          <div style={{padding:'10px 16px',display:'flex',flexDirection:'column',gap:6}}>
                            <div style={{fontSize:9,fontWeight:700,color:'rgba(90,82,72,.4)',textTransform:'uppercase',letterSpacing:1,fontFamily:'Syne,sans-serif'}}>Link 2</div>
                            {hasUrl2
                              ?<>
                                <a href={link.url2} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:'#1878c8',textDecoration:'none',wordBreak:'break-all',lineHeight:1.5,flex:1}}>{link.url2}</a>
                                <div style={{display:'flex',gap:6,marginTop:4}}>
                                  <a href={link.url2} target="_blank" rel="noopener noreferrer"
                                    style={{fontSize:11,padding:'5px 12px',borderRadius:7,background:'rgba(24,120,200,.1)',color:'#1878c8',border:'1px solid rgba(24,120,200,.2)',textDecoration:'none',fontWeight:600,whiteSpace:'nowrap'}}>Open →</a>
                                  <button onClick={()=>copyText(link.url2,copyKey2)}
                                    style={{fontSize:11,padding:'5px 12px',borderRadius:7,background:copied[copyKey2]?'rgba(30,160,120,.12)':'rgba(200,192,178,.12)',color:copied[copyKey2]?'#1a9070':'rgba(90,82,72,.6)',border:`1px solid ${copied[copyKey2]?'rgba(30,160,120,.3)':'rgba(200,192,178,.3)'}`,cursor:'pointer',fontWeight:600,fontFamily:'Syne,sans-serif',transition:'all .2s',whiteSpace:'nowrap'}}>
                                    {copied[copyKey2]?'✓ Copied':'📋 Copy'}
                                  </button>
                                </div>
                              </>
                              :<div style={{fontSize:11,color:'rgba(90,82,72,.25)',fontStyle:'italic'}}>—</div>
                            }
                          </div>
                        </div>}

                        {/* Message */}
                        {hasMsg&&<div style={{padding:'10px 16px',fontSize:11,color:'rgba(90,82,72,.72)',lineHeight:1.65,background:'rgba(194,105,42,.04)',whiteSpace:'pre-wrap'}}>💬 {link.message}</div>}
                      </div>
                    )
                  })}

                  {/* Add item — admin only */}
                  {isAdmin&&<div style={{marginTop:4}}>
                    {addingLinkFor!==vault.id
                      ?<button onClick={()=>{setAddingLinkFor(vault.id);setNewLinkName('');setNewLinkUrl('');setNewLinkUrl2('');setNewLinkMsg('')}}
                        style={{fontSize:12,padding:'8px 18px',borderRadius:9,border:'1.5px dashed rgba(194,105,42,.5)',background:'transparent',color:'#c2692a',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700}}>
                        + Add Link / Message
                      </button>
                      :<div style={{padding:16,background:'rgba(194,105,42,.04)',borderRadius:14,border:'1px solid rgba(194,105,42,.2)',display:'flex',flexDirection:'column',gap:12}}>
                        <div style={{fontSize:10,fontWeight:700,color:'#c2692a',fontFamily:'Syne,sans-serif',textTransform:'uppercase',letterSpacing:1}}>New Item</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                          <div>
                            <label className="lbl">Name 1 *</label>
                            <input className="f-in" placeholder="e.g. Interview Room" value={newLinkName} onChange={e=>setNewLinkName(e.target.value)}/>
                          </div>
                          <div>
                            <label className="lbl">Name 2 <span style={{fontStyle:'italic',textTransform:'none',letterSpacing:0,color:'rgba(90,82,72,.3)',fontWeight:400}}>(optional)</span></label>
                            <input className="f-in" placeholder="e.g. Chat Room" value={newLinkName2} onChange={e=>setNewLinkName2(e.target.value)}/>
                          </div>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                          <div>
                            <label className="lbl">Link 1 (optional)</label>
                            <input className="f-in" placeholder="https://..." value={newLinkUrl} onChange={e=>setNewLinkUrl(e.target.value)}/>
                          </div>
                          <div>
                            <label className="lbl">Link 2 (optional)</label>
                            <input className="f-in" placeholder="https://..." value={newLinkUrl2} onChange={e=>setNewLinkUrl2(e.target.value)}/>
                          </div>
                        </div>
                        <div>
                          <label className="lbl">Message / Note (optional)</label>
                          <textarea className="f-in" rows={2} placeholder="Any message or instructions for users…" value={newLinkMsg} onChange={e=>setNewLinkMsg(e.target.value)} style={{resize:'vertical'}}/>
                        </div>
                        <div style={{display:'flex',gap:8}}>
                          <button onClick={()=>setAddingLinkFor(null)} style={{flex:1,padding:'9px',borderRadius:9,border:'1px solid rgba(200,192,178,.4)',background:'transparent',color:'rgba(90,82,72,.6)',fontSize:12,cursor:'pointer'}}>Cancel</button>
                          <button onClick={()=>{if(!newLinkName.trim())return;onAddLink(vault.id,{name:newLinkName.trim(),name2:newLinkName2.trim(),url:newLinkUrl.trim(),url2:newLinkUrl2.trim(),message:newLinkMsg.trim()});setNewLinkName('');setNewLinkName2('');setNewLinkUrl('');setNewLinkUrl2('');setNewLinkMsg('');setAddingLinkFor(null)}}
                            style={{flex:2,padding:'9px',borderRadius:9,border:'none',background:newLinkName?'#1a1714':'rgba(200,192,178,.3)',color:newLinkName?'#fff':'rgba(90,82,72,.4)',fontSize:12,fontWeight:700,cursor:newLinkName?'pointer':'not-allowed',fontFamily:'Syne,sans-serif',transition:'all .15s'}}>
                            Save Item ✓
                          </button>
                        </div>
                      </div>
                    }
                  </div>}
                </div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AdminPanel({bookings,profiles,notices,onDelete,onApprove,onReject,onClose,deleting,onAddProfile,onDeleteProfile,onSaveNotice,onDeleteNotice,vaults,onAddVault,onDeleteVault,onAddLink,onEditLink,onDeleteLink}){
  const[tab,setTab]=useState('bookings')
  const[search,setSearch]=useState('');const[dateF,setDateF]=useState('');const[typeF,setTypeF]=useState('');const[profF,setProfF]=useState('');const[statusF,setStatusF]=useState('')
  const[newName,setNewName]=useState('');const[newRole,setNewRole]=useState('')
  const[noticeTitle,setNoticeTitle]=useState('');const[noticeMsg,setNoticeMsg]=useState('');const[noticeSaving,setNoticeSaving]=useState(false)
  const[adminTheme,setAdminTheme]=useState(()=>localStorage.getItem('slotbook-admin-theme')||'default')
  const[descModal,setDescModal]=useState(null)
  // Vault form state
  const[newVaultName,setNewVaultName]=useState('')
  const[newVaultPin,setNewVaultPin]=useState('')
  const[newVaultColor,setNewVaultColor]=useState('interview')
  // Link form state
  const[addingLinkFor,setAddingLinkFor]=useState(null)
  const[newLinkName,setNewLinkName]=useState('')
  const[newLinkName2,setNewLinkName2]=useState('')
  const[newLinkUrl,setNewLinkUrl]=useState('')
  const[newLinkUrl2,setNewLinkUrl2]=useState('')
  const[newLinkMsg,setNewLinkMsg]=useState('')
  // Edit link state
  const[editingLink,setEditingLink]=useState(null)
  const[editName,setEditName]=useState('')
  const[editName2,setEditName2]=useState('')
  const[editUrl,setEditUrl]=useState('')
  const[editUrl2,setEditUrl2]=useState('')
  const[editMsg,setEditMsg]=useState('')
  const[copied,setCopied]=useState({})

  const at=ADMIN_THEMES[adminTheme]
  const today=fmtDate(new Date())
  const filtered=bookings.filter(b=>{
    const ms=!search||(b.title+' '+(b.desc||'')+' '+b.bookedBy).toLowerCase().includes(search.toLowerCase())
    return ms&&(!dateF||b.date===dateF)&&(!typeF||b.type===typeF)&&(!profF||b.profileId===profF)&&(!statusF||b.status===statusF)
  }).sort((a,b)=>dateF?a.startTime.localeCompare(b.startTime):new Date(b.createdAt||0)-new Date(a.createdAt||0))
  const pending=bookings.filter(b=>b.status==='pending').length
  const approved=bookings.filter(b=>b.status==='approved').length

  async function postNotice(){
    if(!noticeTitle.trim()||!noticeMsg.trim())return
    setNoticeSaving(true)
    await onSaveNotice({id:uid(),title:noticeTitle.trim(),message:noticeMsg.trim(),active:true,createdAt:new Date().toISOString()})
    setNoticeTitle('');setNoticeMsg('');setNoticeSaving(false)
  }

  function saveEditLink(){
    if(!editName.trim())return
    onEditLink(editingLink.vaultId,editingLink.index,{name:editName.trim(),name2:editName2.trim(),url:editUrl.trim(),url2:editUrl2.trim(),message:editMsg.trim()})
    setEditingLink(null)
  }

  return<div style={{background:at?at.bg:'#f5f4f0',minHeight:'100%',display:'flex',flexDirection:'column',position:'relative',zIndex:1,color:at?at.text:'#1a1714',transition:'background .3s'}}>
    {descModal&&<DescModal booking={descModal} profiles={profiles} onClose={()=>setDescModal(null)}/>}

    {/* Top bar */}
    <div style={{height:58,background:at?at.header:'rgba(245,244,240,.95)',borderBottom:`1px solid ${at?at.border:'rgba(200,192,178,.32)'}`,padding:'0 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,backdropFilter:'blur(14px)',position:'sticky',top:0,zIndex:40}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#fde8d5,#fef3e2)',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(194,105,42,.2)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(194,105,42,.12)" stroke="#c2692a" strokeWidth="1.6"/><line x1="12" y1="12" x2="12" y2="5.5" stroke="#c2692a" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="12" x2="16.2" y2="14.5" stroke="#c2692a" strokeWidth="1.4" strokeLinecap="round"/><circle cx="12" cy="12" r="1.6" fill="#c2692a"/></svg>
        </div>
        <span style={{fontFamily:'Syne,sans-serif',fontSize:'1.3rem',fontWeight:800,color:at?at.text:'#1a1714',letterSpacing:'-.3px'}}>SlotBook</span>
        <span className="tag" style={{background:'rgba(194,105,42,.1)',color:'#c2692a',border:'1px solid rgba(194,105,42,.22)'}}>Admin</span>
        {pending>0&&<span style={{background:'rgba(200,60,60,.12)',color:'#c03838',border:'1px solid rgba(200,60,60,.3)',borderRadius:20,padding:'2px 10px',fontSize:11,fontWeight:700,fontFamily:'Syne,sans-serif'}}>{pending} pending</span>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6}}>
        {Object.entries(ADMIN_THEMES).map(([key,t])=>{
          const isActive=adminTheme===key
          return<button key={key} onClick={()=>{setAdminTheme(key);localStorage.setItem('slotbook-admin-theme',key)}}
            title={t.name}
            style={{padding:'7px 14px',borderRadius:8,fontSize:11,fontWeight:700,fontFamily:'Syne,sans-serif',cursor:'pointer',border:`1px solid ${isActive?t.accent:'rgba(200,192,178,.45)'}`,background:isActive?t.btn:'rgba(255,255,255,.85)',color:isActive?'#fff':t.accent,transition:'all .22s',boxShadow:isActive?`0 2px 12px ${t.accent}40`:'none',transform:isActive?'translateY(-1px)':'none'}}>
            {t.name}
          </button>
        })}
        <button className="btn-soft" onClick={onClose} style={{padding:'7px 16px',borderRadius:8,fontSize:12,marginLeft:4}}>← Exit Admin</button>
      </div>
    </div>

    {/* Tabs */}
    <div style={{display:'flex',gap:0,borderBottom:`1px solid ${at?at.border:'rgba(200,192,178,.3)'}`,background:at?'rgba(255,255,255,.06)':'rgba(255,255,255,.6)',flexShrink:0}}>
      {[['bookings','📅 Bookings'],['profiles','👤 Profiles'],['notices','📢 Notices'],['links','🔗 Link Vaults']].map(([k,lbl])=><button key={k} onClick={()=>setTab(k)}
        style={{padding:'12px 24px',background:'transparent',border:'none',borderBottom:`2px solid ${tab===k?'#c2692a':'transparent'}`,color:tab===k?'#c2692a':at?at.muted:'rgba(90,82,72,.6)',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,cursor:'pointer',transition:'all .2s'}}>
        {lbl}{k==='notices'&&notices.length>0&&<span style={{marginLeft:5,background:'rgba(194,105,42,.15)',color:'#c2692a',borderRadius:10,padding:'1px 7px',fontSize:10,fontWeight:800}}>{notices.filter(n=>n.active!==false).length}</span>}
        {k==='links'&&(vaults||[]).length>0&&<span style={{marginLeft:5,background:'rgba(194,105,42,.15)',color:'#c2692a',borderRadius:10,padding:'1px 7px',fontSize:10,fontWeight:800}}>{(vaults||[]).length}</span>}
      </button>)}
    </div>

    <div style={{flex:1,overflowY:'auto',padding:'1.5rem',position:'relative',zIndex:1}}>

      {/* ── BOOKINGS TAB ── */}
      {tab==='bookings'&&<>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:12,marginBottom:'1.5rem'}}>
          {[{l:'Total',v:bookings.length,c:'#c2692a',bg:'rgba(194,105,42,.07)'},{l:'Today',v:bookings.filter(b=>b.date===today).length,c:'#1a9070',bg:'rgba(30,160,120,.07)'},{l:'Pending ⚠',v:pending,c:'#c03838',bg:'rgba(200,60,60,.07)'},{l:'Approved ✓',v:approved,c:'#1a9070',bg:'rgba(30,160,120,.07)'}].map(s=><div key={s.l} className="stat-card card" style={{background:s.bg}}>
            <div style={{fontSize:9,color:'rgba(90,82,72,.42)',textTransform:'uppercase',letterSpacing:1,fontWeight:700,marginBottom:6,fontFamily:'Syne,sans-serif'}}>{s.l}</div>
            <div style={{fontSize:'2.2rem',fontWeight:800,fontFamily:'Syne,sans-serif',color:s.c,letterSpacing:'-2px',lineHeight:1}}>{s.v}</div>
          </div>)}
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1.25rem'}}>
          <input className="f-in" placeholder="Search…" style={{flex:1,minWidth:150}} value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            {[['Today',today],['Tomorrow',fmtDate(addDays(new Date(),1))]].map(([lbl,d])=>{
              const isActive=dateF===d
              return<button key={lbl} onClick={()=>setDateF(isActive?'':d)}
                style={{padding:'10px 16px',borderRadius:10,border:`1.5px solid ${isActive?'#c2692a':'rgba(200,192,178,.46)'}`,background:isActive?'rgba(194,105,42,.1)':'rgba(255,255,255,.9)',color:isActive?'#c2692a':'rgba(90,82,72,.7)',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,cursor:'pointer',whiteSpace:'nowrap',transition:'all .18s',boxShadow:isActive?'0 0 0 3px rgba(194,105,42,.12)':'none'}}>
                {lbl==='Today'?'📅':'🌅'} {lbl}
                {isActive&&<span style={{marginLeft:6,fontSize:10,opacity:.6}}>✕</span>}
              </button>
            })}
          </div>
          <input type="date" className="f-in" style={{width:150}} value={dateF} onChange={e=>setDateF(e.target.value)}/>
          <select className="f-in" style={{width:140}} value={profF} onChange={e=>setProfF(e.target.value)}>
            <option value="">All Profiles</option>{profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="f-in" style={{width:130}} value={statusF} onChange={e=>setStatusF(e.target.value)}>
            <option value="">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
          <select className="f-in" style={{width:130}} value={typeF} onChange={e=>setTypeF(e.target.value)}>
            <option value="">All Types</option><option value="interview">Interview</option><option value="meeting">Meeting</option><option value="other">Other</option>
          </select>
        </div>
        <div className="card" style={{overflow:'hidden',padding:0}}>
          <div style={{overflowX:'auto'}}>
            <table className="adm-tbl">
              <thead><tr><th>Status</th><th>Profile</th><th>Booked By</th><th>Phone</th><th>Title</th><th>Date</th><th>Day</th><th>Start (IST)</th><th>End (IST)</th><th>Type</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length===0?<tr><td colSpan={12} style={{textAlign:'center',padding:'3rem',color:'rgba(90,82,72,.28)'}}><div style={{fontSize:28,marginBottom:8,opacity:.2}}>◇</div><p style={{fontSize:13}}>No bookings found.</p></td></tr>
                :filtered.map((b,i)=>{
                  const m=TC[b.type]||TC.other;const prof=profiles.find(p=>p.id===b.profileId)
                  const isPending=(b.status||'pending')==='pending';const isApproved=b.status==='approved'
                  return<tr key={b.id} className="animate-fadeUp" style={{animationDelay:`${Math.min(i,6)*.04}s`,background:isPending?'rgba(200,60,60,.03)':isApproved?'rgba(30,160,120,.03)':'transparent'}}>
                    <td><StatusBadge status={b.status||'pending'}/></td>
                    <td>{prof?<div style={{display:'flex',alignItems:'center',gap:7}}><Avatar name={prof.name} size={26}/><div><div style={{fontSize:12,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{prof.name}</div><div style={{fontSize:10,color:'rgba(90,82,72,.5)'}}>{prof.role}</div></div></div>:'—'}</td>
                    <td><div style={{display:'flex',alignItems:'center',gap:7}}><Avatar name={b.bookedBy} size={26}/><span style={{fontSize:12,fontWeight:600,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{b.bookedBy}</span></div></td>
                    <td style={{fontSize:12,color:'rgba(90,82,72,.6)'}}>{b.userPhone||'—'}</td>
                    <td style={{fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{b.title}</td>
                    <td style={{fontSize:12,color:'rgba(90,82,72,.7)'}}>{dDate(b.date)}</td>
                    <td><span style={{fontSize:11,fontWeight:700,color:'rgba(90,82,72,.6)',background:'rgba(200,192,178,.15)',padding:'3px 9px',borderRadius:20,whiteSpace:'nowrap',fontFamily:'Syne,sans-serif'}}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][parseDate(b.date).getDay()]}</span></td>
                    <td style={{fontWeight:700,color:m.color,fontFamily:'Syne,sans-serif',whiteSpace:'nowrap'}}>{dTime(b.startTime)}</td>
                    <td style={{fontWeight:700,color:m.color,fontFamily:'Syne,sans-serif',whiteSpace:'nowrap'}}>{dTime(b.endTime)}</td>
                    <td><span className="tag" style={{background:m.bg,color:m.color,border:`1px solid ${m.border}`}}>{b.type}</span></td>
                    <td style={{maxWidth:130,cursor:b.desc?'pointer':'default'}} onClick={()=>b.desc&&setDescModal(b)} title={b.desc?'Click to read full description':''}>
                      {b.desc?<span style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#1878c8',fontWeight:500}}>
                        <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:100}}>{b.desc.slice(0,30)}{b.desc.length>30?'…':''}</span>
                        <span style={{fontSize:10,opacity:.7,flexShrink:0}}>↗</span>
                      </span>:<span style={{color:'rgba(90,82,72,.35)',fontSize:12}}>—</span>}
                    </td>
                    <td><div style={{display:'flex',gap:5,alignItems:'center'}}>
                      {isPending&&<>
                        <button onClick={()=>onApprove(b.id)} style={{background:'rgba(30,160,120,.1)',border:'1px solid rgba(30,160,120,.3)',color:'#1a9070',borderRadius:7,padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif',whiteSpace:'nowrap'}} onMouseOver={e=>e.currentTarget.style.background='rgba(30,160,120,.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(30,160,120,.1)'}>✓ Approve</button>
                        <button onClick={()=>onReject(b.id)} style={{background:'rgba(150,150,150,.08)',border:'1px solid rgba(150,150,150,.25)',color:'#777',borderRadius:7,padding:'4px 10px',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif',whiteSpace:'nowrap'}} onMouseOver={e=>e.currentTarget.style.background='rgba(150,150,150,.15)'} onMouseOut={e=>e.currentTarget.style.background='rgba(150,150,150,.08)'}>✕ Decline</button>
                      </>}
                      <button className="btn-del" onClick={()=>onDelete(b.id)} disabled={deleting===b.id} style={{opacity:deleting===b.id?.5:1}}>{deleting===b.id?'…':'Delete'}</button>
                    </div></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>}

      {/* ── PROFILES TAB ── */}
      {tab==='profiles'&&<>
        <div className="card" style={{padding:'1.25rem',marginBottom:'1.25rem'}}>
          <div style={{fontSize:11,fontWeight:700,color:'rgba(90,82,72,.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:12,fontFamily:'Syne,sans-serif'}}>Add New Profile</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
            <div style={{flex:1,minWidth:140}}><label className="lbl">Name</label><input className="f-in" placeholder="e.g. React Developer" value={newName} onChange={e=>setNewName(e.target.value)}/></div>
            <div style={{flex:1,minWidth:140}}><label className="lbl">Role</label><input className="f-in" placeholder="e.g. Frontend" value={newRole} onChange={e=>setNewRole(e.target.value)}/></div>
            <button className="btn-dark" onClick={()=>{if(!newName.trim())return;onAddProfile({id:uid(),name:newName.trim(),role:newRole.trim()||newName.trim()});setNewName('');setNewRole('')}} style={{padding:'11px 20px',borderRadius:10,fontSize:13,whiteSpace:'nowrap'}}>+ Add Profile</button>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
          {profiles.map(p=>{
            const pb=bookings.filter(b=>b.profileId===p.id);const pp=pb.filter(b=>b.status==='pending').length
            return<div key={p.id} className="card" style={{padding:'1.1rem 1.2rem',display:'flex',alignItems:'center',gap:12,position:'relative'}}>
              <Avatar name={p.name} size={44}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{p.name}</div>
                <div style={{fontSize:11,color:'rgba(90,82,72,.55)',marginTop:2}}>{p.role}</div>
                <div style={{display:'flex',gap:6,marginTop:6,flexWrap:'wrap'}}>
                  <span style={{fontSize:10,background:'rgba(194,105,42,.08)',color:'#c2692a',padding:'2px 8px',borderRadius:10,fontWeight:600}}>{pb.length} bookings</span>
                  {pp>0&&<span style={{fontSize:10,background:'rgba(200,60,60,.08)',color:'#c03838',padding:'2px 8px',borderRadius:10,fontWeight:600}}>{pp} pending</span>}
                </div>
              </div>
              <button onClick={()=>{if(!window.confirm(`Are you sure you want to delete "${p.name}"?`))return;if(!window.confirm(`This will permanently remove "${p.name}" and cannot be undone. Delete anyway?`))return;onDeleteProfile(p.id)}} style={{position:'absolute',top:8,right:8,background:'transparent',border:'none',color:'rgba(90,82,72,.3)',fontSize:14,cursor:'pointer',borderRadius:4,padding:'2px 5px',transition:'all .15s'}} onMouseOver={e=>e.currentTarget.style.color='#c03838'} onMouseOut={e=>e.currentTarget.style.color='rgba(90,82,72,.3)'}>✕</button>
            </div>
          })}
        </div>
      </>}

      {/* ── NOTICES TAB ── */}
      {tab==='notices'&&<>
        <div className="card" style={{padding:'1.5rem',marginBottom:'1.25rem'}}>
          <div style={{fontSize:11,fontWeight:700,color:'rgba(90,82,72,.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:14,fontFamily:'Syne,sans-serif'}}>Post a New Notice</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div><label className="lbl">Notice Title</label><input className="f-in" placeholder="e.g. Office closed on Friday" value={noticeTitle} onChange={e=>setNoticeTitle(e.target.value)}/></div>
            <div><label className="lbl">Full Message</label><textarea className="f-in" rows={4} style={{resize:'vertical'}} placeholder="Write the full notice here…" value={noticeMsg} onChange={e=>setNoticeMsg(e.target.value)}/></div>
            <button className="btn-dark" onClick={postNotice} style={{alignSelf:'flex-start',padding:'11px 24px',borderRadius:10,fontSize:13,opacity:noticeTitle&&noticeMsg?1:.4,cursor:noticeTitle&&noticeMsg?'pointer':'not-allowed'}}>
              {noticeSaving?'Posting…':'📢 Post Notice'}
            </button>
          </div>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:'rgba(90,82,72,.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:10,fontFamily:'Syne,sans-serif'}}>Active Notices ({notices.filter(n=>n.active!==false).length})</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {notices.length===0&&<div style={{textAlign:'center',padding:'2rem',color:'rgba(90,82,72,.3)',fontSize:13}}>No notices posted yet.</div>}
          {notices.map(n=><div key={n.id} className="card animate-fadeUp" style={{padding:'1rem 1.2rem',opacity:n.active===false?.5:1}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span style={{fontSize:14}}>📢</span>
                  <span style={{fontSize:14,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{n.title}</span>
                  <span style={{fontSize:9,padding:'2px 7px',borderRadius:10,background:n.active!==false?'rgba(30,160,120,.1)':'rgba(150,150,150,.1)',color:n.active!==false?'#1a9070':'#777',border:`1px solid ${n.active!==false?'rgba(30,160,120,.25)':'rgba(150,150,150,.25)'}`,fontWeight:700,fontFamily:'Syne,sans-serif',textTransform:'uppercase'}}>{n.active!==false?'Active':'Inactive'}</span>
                </div>
                <p style={{fontSize:12,color:'rgba(90,82,72,.65)',lineHeight:1.6,marginLeft:22}}>{n.message}</p>
                {n.createdAt&&<p style={{fontSize:10,color:'rgba(90,82,72,.35)',marginTop:6,marginLeft:22}}>{new Date(n.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p>}
              </div>
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                <button onClick={()=>onSaveNotice({...n,active:n.active===false})} style={{fontSize:10,padding:'4px 10px',borderRadius:7,border:'1px solid rgba(200,192,178,.4)',background:'transparent',color:'rgba(90,82,72,.6)',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600}}>{n.active===false?'Activate':'Deactivate'}</button>
                <button onClick={()=>onDeleteNotice(n.id)} style={{fontSize:10,padding:'4px 10px',borderRadius:7,border:'1px solid rgba(200,60,60,.2)',background:'rgba(200,60,60,.06)',color:'#c03838',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600}}>Delete</button>
              </div>
            </div>
          </div>)}
        </div>
      </>}

      {/* ── LINK VAULTS TAB ── */}
      {tab==='links'&&<>
        {/* Create Vault Form */}
        <div className="card" style={{padding:'1.5rem',marginBottom:'1.5rem'}}>
          <div style={{fontSize:11,fontWeight:700,color:'rgba(90,82,72,.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:16,fontFamily:'Syne,sans-serif',display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:16}}>🔒</span> Create New Link Vault
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label className="lbl">Vault Name</label><input className="f-in" placeholder="e.g. Zoom Links, Docs, Resources" value={newVaultName} onChange={e=>setNewVaultName(e.target.value)}/></div>
              <div><label className="lbl">4-Digit PIN</label><input className="f-in" placeholder="e.g. 1234" maxLength={4} value={newVaultPin} onChange={e=>setNewVaultPin(e.target.value.replace(/\D/g,'').slice(0,4))} style={{fontFamily:'DM Mono,monospace',letterSpacing:6,fontSize:18,textAlign:'center'}}/></div>
            </div>
            <div>
              <label className="lbl">Color Tag</label>
              <div style={{display:'flex',gap:8}}>
                {Object.entries(TC).map(([k,v])=><button key={k} onClick={()=>setNewVaultColor(k)}
                  style={{padding:'6px 16px',borderRadius:8,border:`1.5px solid ${newVaultColor===k?v.border:'rgba(200,192,178,.35)'}`,background:newVaultColor===k?v.bg:'transparent',color:v.color,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif',transition:'all .15s',boxShadow:newVaultColor===k?`0 2px 8px ${v.border}`:'none'}}>
                  {k.charAt(0).toUpperCase()+k.slice(1)}
                </button>)}
              </div>
            </div>
            <button className="btn-dark"
              onClick={()=>{if(!newVaultName.trim()||newVaultPin.length!==4)return;onAddVault({id:uid(),name:newVaultName.trim(),passcode:newVaultPin,color:newVaultColor,links:[]});setNewVaultName('');setNewVaultPin('');setNewVaultColor('interview')}}
              style={{alignSelf:'flex-start',padding:'11px 28px',borderRadius:10,fontSize:13,opacity:newVaultName&&newVaultPin.length===4?1:.35,cursor:newVaultName&&newVaultPin.length===4?'pointer':'not-allowed'}}>
              🔒 Create Vault
            </button>
          </div>
        </div>

        <div style={{fontSize:11,fontWeight:700,color:'rgba(90,82,72,.5)',textTransform:'uppercase',letterSpacing:1,marginBottom:12,fontFamily:'Syne,sans-serif'}}>
          Your Vaults ({(vaults||[]).length})
        </div>

        {(vaults||[]).length===0&&<div className="card" style={{padding:'3rem',textAlign:'center',color:'rgba(90,82,72,.3)',fontSize:13}}>
          <div style={{fontSize:40,marginBottom:12,opacity:.15}}>🔒</div>
          No vaults yet. Create one above.
        </div>}

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {(vaults||[]).map(vault=>{
            const m=TC[vault.color]||TC.other
            return<div key={vault.id} className="card animate-fadeUp" style={{padding:0,overflow:'hidden',border:`1.5px solid ${m.border}`,background:m.bg}}>
              {/* Vault header */}
              <div style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:12,borderBottom:`1px solid ${m.border}`,background:'rgba(255,255,255,.5)'}}>
                <div style={{width:40,height:40,borderRadius:11,background:m.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>🔓</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:800,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{vault.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginTop:3}}>
                    <span style={{fontSize:11,color:'rgba(90,82,72,.5)'}}>{(vault.links||[]).length} item{(vault.links||[]).length!==1?'s':''}</span>
                    <span style={{fontSize:11,fontFamily:'DM Mono,monospace',fontWeight:700,color:m.color,background:'rgba(255,255,255,.7)',border:`1px solid ${m.border}`,padding:'2px 10px',borderRadius:6,letterSpacing:3}}>PIN: {vault.passcode}</span>
                    <span className="tag" style={{background:m.bg,color:m.color,border:`1px solid ${m.border}`,fontSize:10}}>{vault.color}</span>
                  </div>
                </div>
                <button onClick={()=>{if(!window.confirm(`Delete vault "${vault.name}" and all its contents?`))return;onDeleteVault(vault.id)}}
                  style={{background:'rgba(200,60,60,.1)',border:'1px solid rgba(200,60,60,.25)',color:'#c03838',cursor:'pointer',fontSize:11,padding:'6px 14px',borderRadius:8,fontFamily:'Syne,sans-serif',fontWeight:700,transition:'all .15s'}}
                  onMouseOver={e=>e.currentTarget.style.background='rgba(200,60,60,.2)'}
                  onMouseOut={e=>e.currentTarget.style.background='rgba(200,60,60,.1)'}>
                  🗑 Delete Vault
                </button>
              </div>

              {/* Links inside vault */}
              <div style={{padding:'14px 18px'}}>
                {(vault.links||[]).length===0&&<div style={{fontSize:12,color:'rgba(90,82,72,.35)',fontStyle:'italic',padding:'6px 0 10px'}}>No items yet. Add a link or message below.</div>}
                <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:12}}>
                  {(vault.links||[]).map((link,li)=>{
                    const isEditing=editingLink?.vaultId===vault.id&&editingLink?.index===li
                    const hasUrl=link.url&&link.url.trim()
                    const hasUrl2=link.url2&&link.url2.trim()
                    const hasMsg=link.message&&link.message.trim()

                    if(isEditing)return<div key={li} style={{padding:14,background:'rgba(255,255,255,.95)',borderRadius:11,border:'2px solid #c2692a',display:'flex',flexDirection:'column',gap:9}}>
                      <div style={{fontSize:10,fontWeight:700,color:'#c2692a',fontFamily:'Syne,sans-serif',textTransform:'uppercase',letterSpacing:1}}>✏ Editing Item</div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                        <div><label className="lbl">Name 1 *</label><input className="f-in" value={editName} onChange={e=>setEditName(e.target.value)} placeholder="e.g. Interview Room"/></div>
                        <div><label className="lbl">Name 2 (optional)</label><input className="f-in" value={editName2} onChange={e=>setEditName2(e.target.value)} placeholder="e.g. Chat Room"/></div>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                        <div><label className="lbl">Link 1 (optional)</label><input className="f-in" value={editUrl} onChange={e=>setEditUrl(e.target.value)} placeholder="https://..."/></div>
                        <div><label className="lbl">Link 2 (optional)</label><input className="f-in" value={editUrl2} onChange={e=>setEditUrl2(e.target.value)} placeholder="https://..."/></div>
                      </div>
                      <div><label className="lbl">Message / Note (optional)</label><textarea className="f-in" rows={2} value={editMsg} onChange={e=>setEditMsg(e.target.value)} placeholder="Any message to show users…" style={{resize:'vertical'}}/></div>
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={()=>setEditingLink(null)} style={{flex:1,padding:'9px',borderRadius:8,border:'1px solid rgba(200,192,178,.4)',background:'transparent',color:'rgba(90,82,72,.6)',fontSize:12,cursor:'pointer'}}>Cancel</button>
                        <button onClick={saveEditLink} style={{flex:2,padding:'9px',borderRadius:8,border:'none',background:'#1a1714',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif'}}>Save Changes ✓</button>
                      </div>
                    </div>

                    return<div key={li} style={{background:'rgba(255,255,255,.88)',borderRadius:11,border:'1px solid rgba(200,192,178,.22)',overflow:'hidden'}}>
                      {/* Item name + actions */}
                      <div style={{padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:(hasUrl||hasUrl2||hasMsg)?'1px solid rgba(200,192,178,.15)':'none'}}>
                        <div style={{display:'flex',gap:14,alignItems:'center'}}>
                          <div style={{display:'flex',flexDirection:'column',gap:1}}>
                            <div style={{fontSize:8,fontWeight:700,color:'rgba(90,82,72,.35)',textTransform:'uppercase',letterSpacing:1,fontFamily:'Syne,sans-serif'}}>Name 1</div>
                            <div style={{fontSize:13,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{link.name}</div>
                          </div>
                          {link.name2&&link.name2.trim()&&<><div style={{width:1,height:28,background:'rgba(200,192,178,.3)'}}/>
                          <div style={{display:'flex',flexDirection:'column',gap:1}}>
                            <div style={{fontSize:8,fontWeight:700,color:'rgba(90,82,72,.35)',textTransform:'uppercase',letterSpacing:1,fontFamily:'Syne,sans-serif'}}>Name 2</div>
                            <div style={{fontSize:13,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{link.name2}</div>
                          </div></>}
                        </div>
                        <div style={{display:'flex',gap:6}}>
                          <button onClick={()=>{setEditingLink({vaultId:vault.id,index:li});setEditName(link.name);setEditName2(link.name2||'');setEditUrl(link.url||'');setEditUrl2(link.url2||'');setEditMsg(link.message||'')}}
                            style={{fontSize:11,padding:'4px 10px',borderRadius:7,border:'1px solid rgba(194,105,42,.3)',background:'rgba(194,105,42,.07)',color:'#c2692a',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600}}>Edit</button>
                          <button onClick={()=>{if(!window.confirm(`Delete "${link.name}"?`))return;onDeleteLink(vault.id,li)}}
                            style={{fontSize:11,padding:'4px 10px',borderRadius:7,border:'1px solid rgba(200,60,60,.25)',background:'rgba(200,60,60,.07)',color:'#c03838',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:600}}>Delete</button>
                        </div>
                      </div>
                      {/* Two URL columns */}
                      {(hasUrl||hasUrl2)&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',borderBottom:hasMsg?'1px solid rgba(200,192,178,.15)':'none'}}>
                        <div style={{padding:'10px 14px',borderRight:'1px solid rgba(200,192,178,.15)'}}>
                          <div style={{fontSize:9,fontWeight:700,color:'rgba(90,82,72,.4)',textTransform:'uppercase',letterSpacing:1,fontFamily:'Syne,sans-serif',marginBottom:5}}>Link 1</div>
                          {hasUrl
                            ?<><a href={link.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:'#1878c8',textDecoration:'none',display:'block',marginBottom:6,wordBreak:'break-all',lineHeight:1.5}}>{link.url}</a>
                              <div style={{display:'flex',gap:5}}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,padding:'4px 10px',borderRadius:6,background:'rgba(24,120,200,.1)',color:'#1878c8',border:'1px solid rgba(24,120,200,.2)',textDecoration:'none',fontWeight:600}}>Open →</a>
                                <button onClick={()=>navigator.clipboard.writeText(link.url).then(()=>{setCopied(prev=>({...prev,[`${vault.id}-${li}-1`]:true}));setTimeout(()=>setCopied(prev=>({...prev,[`${vault.id}-${li}-1`]:false})),2000)})}
                                  style={{fontSize:10,padding:'4px 10px',borderRadius:6,background:copied[`${vault.id}-${li}-1`]?'rgba(30,160,120,.12)':'rgba(200,192,178,.15)',color:copied[`${vault.id}-${li}-1`]?'#1a9070':'rgba(90,82,72,.6)',border:'1px solid rgba(200,192,178,.3)',cursor:'pointer',fontWeight:600,fontFamily:'Syne,sans-serif',transition:'all .2s'}}>
                                  {copied[`${vault.id}-${li}-1`]?'✓ Copied':'📋 Copy'}
                                </button>
                              </div>
                            </>
                            :<span style={{fontSize:11,color:'rgba(90,82,72,.25)',fontStyle:'italic'}}>—</span>
                          }
                        </div>
                        <div style={{padding:'10px 14px'}}>
                          <div style={{fontSize:9,fontWeight:700,color:'rgba(90,82,72,.4)',textTransform:'uppercase',letterSpacing:1,fontFamily:'Syne,sans-serif',marginBottom:5}}>Link 2</div>
                          {hasUrl2
                            ?<><a href={link.url2} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:'#1878c8',textDecoration:'none',display:'block',marginBottom:6,wordBreak:'break-all',lineHeight:1.5}}>{link.url2}</a>
                              <div style={{display:'flex',gap:5}}>
                                <a href={link.url2} target="_blank" rel="noopener noreferrer" style={{fontSize:10,padding:'4px 10px',borderRadius:6,background:'rgba(24,120,200,.1)',color:'#1878c8',border:'1px solid rgba(24,120,200,.2)',textDecoration:'none',fontWeight:600}}>Open →</a>
                                <button onClick={()=>navigator.clipboard.writeText(link.url2).then(()=>{setCopied(prev=>({...prev,[`${vault.id}-${li}-2`]:true}));setTimeout(()=>setCopied(prev=>({...prev,[`${vault.id}-${li}-2`]:false})),2000)})}
                                  style={{fontSize:10,padding:'4px 10px',borderRadius:6,background:copied[`${vault.id}-${li}-2`]?'rgba(30,160,120,.12)':'rgba(200,192,178,.15)',color:copied[`${vault.id}-${li}-2`]?'#1a9070':'rgba(90,82,72,.6)',border:'1px solid rgba(200,192,178,.3)',cursor:'pointer',fontWeight:600,fontFamily:'Syne,sans-serif',transition:'all .2s'}}>
                                  {copied[`${vault.id}-${li}-2`]?'✓ Copied':'📋 Copy'}
                                </button>
                              </div>
                            </>
                            :<span style={{fontSize:11,color:'rgba(90,82,72,.25)',fontStyle:'italic'}}>—</span>
                          }
                        </div>
                      </div>}
                      {hasMsg&&<div style={{padding:'8px 14px',fontSize:11,color:'rgba(90,82,72,.7)',background:'rgba(194,105,42,.04)',lineHeight:1.6}}>💬 {link.message}</div>}
                    </div>
                  })}
                </div>

                {/* Add item */}
                {addingLinkFor!==vault.id
                  ?<button onClick={()=>{setAddingLinkFor(vault.id);setNewLinkName('');setNewLinkUrl('');setNewLinkUrl2('');setNewLinkMsg('')}}
                    style={{fontSize:12,padding:'8px 18px',borderRadius:9,border:'1.5px dashed rgba(194,105,42,.5)',background:'transparent',color:'#c2692a',cursor:'pointer',fontFamily:'Syne,sans-serif',fontWeight:700}}>
                    + Add Link / Message
                  </button>
                  :<div style={{padding:14,background:'rgba(194,105,42,.04)',borderRadius:11,border:'1px solid rgba(194,105,42,.2)',display:'flex',flexDirection:'column',gap:10}}>
                    <div style={{fontSize:10,fontWeight:700,color:'#c2692a',fontFamily:'Syne,sans-serif',textTransform:'uppercase',letterSpacing:1}}>New Item</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                      <div><label className="lbl">Name 1 *</label><input className="f-in" placeholder="e.g. Zoom Room" value={newLinkName} onChange={e=>setNewLinkName(e.target.value)}/></div>
                      <div><label className="lbl">Name 2 (optional)</label><input className="f-in" placeholder="e.g. Chat Room" value={newLinkName2} onChange={e=>setNewLinkName2(e.target.value)}/></div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                      <div><label className="lbl">Link 1 (optional)</label><input className="f-in" placeholder="https://..." value={newLinkUrl} onChange={e=>setNewLinkUrl(e.target.value)}/></div>
                      <div><label className="lbl">Link 2 (optional)</label><input className="f-in" placeholder="https://..." value={newLinkUrl2} onChange={e=>setNewLinkUrl2(e.target.value)}/></div>
                    </div>
                    <div><label className="lbl">Message / Note (optional)</label><textarea className="f-in" rows={2} placeholder="Any message or instructions for users…" value={newLinkMsg} onChange={e=>setNewLinkMsg(e.target.value)} style={{resize:'vertical'}}/></div>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>setAddingLinkFor(null)} style={{flex:1,padding:'9px',borderRadius:9,border:'1px solid rgba(200,192,178,.4)',background:'transparent',color:'rgba(90,82,72,.6)',fontSize:12,cursor:'pointer'}}>Cancel</button>
                      <button onClick={()=>{if(!newLinkName.trim())return;onAddLink(vault.id,{name:newLinkName.trim(),name2:newLinkName2.trim(),url:newLinkUrl.trim(),url2:newLinkUrl2.trim(),message:newLinkMsg.trim()});setNewLinkName('');setNewLinkName2('');setNewLinkUrl('');setNewLinkUrl2('');setNewLinkMsg('');setAddingLinkFor(null)}}
                        style={{flex:2,padding:'9px',borderRadius:9,border:'none',background:newLinkName?'#1a1714':'rgba(200,192,178,.3)',color:newLinkName?'#fff':'rgba(90,82,72,.4)',fontSize:12,fontWeight:700,cursor:newLinkName?'pointer':'not-allowed',fontFamily:'Syne,sans-serif',transition:'all .15s'}}>
                        Save Item ✓
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          })}
        </div>
      </>}

    </div>
  </div>
}

function MiniCal({year,month,bookings,profileId,onNav,onSelect,selectedDate}){
  const first=new Date(year,month,1),last=new Date(year,month+1,0),today=new Date()
  const cells=[];for(let i=0;i<first.getDay();i++)cells.push(null)
  for(let d=1;d<=last.getDate();d++)cells.push(new Date(year,month,d))
  return<div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
      <span style={{fontSize:12,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{MONTHS[month].slice(0,3)} {year}</span>
      <div style={{display:'flex',gap:3}}>
        <button className="btn-soft" onClick={()=>onNav(-1)} style={{width:22,height:22,borderRadius:5,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>‹</button>
        <button className="btn-soft" onClick={()=>onNav(1)} style={{width:22,height:22,borderRadius:5,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>›</button>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:1}}>
      {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{textAlign:'center',fontSize:9,color:'rgba(90,82,72,.32)',padding:'2px 0',fontFamily:'Syne,sans-serif',fontWeight:700}}>{d}</div>)}
      {cells.map((date,i)=>{
        if(!date)return<div key={i}/>
        const isT=date.toDateString()===today.toDateString()
        const ds=fmtDate(date);const hasB=bookings.some(b=>b.date===ds&&b.profileId===profileId)
        const isSel=selectedDate===ds
        return<div key={i} className={`mini-day${isT?' mini-today':''}`} style={{background:isSel&&!isT?'rgba(194,105,42,.15)':undefined,color:isSel&&!isT?'#c2692a':undefined,fontWeight:isSel?700:undefined}} onClick={()=>onSelect(date)}>
          {date.getDate()}
          {hasB&&!isT&&<div style={{position:'absolute',bottom:2,left:'50%',transform:'translateX(-50%)',width:3,height:3,borderRadius:'50%',background:'rgba(194,105,42,.55)'}}/>}
        </div>
      })}
    </div>
  </div>
}

// ─── Month View ───────────────────────────────────────────────────
function MonthView({year,month,bookings,profileId,onDayClick,searchHighlight}){
  const first=new Date(year,month,1),last=new Date(year,month+1,0)
  const todayStr=fmtDate(new Date()),prevEnd=new Date(year,month,0).getDate()
  const cells=[]
  for(let i=first.getDay()-1;i>=0;i--)cells.push({date:new Date(year,month-1,prevEnd-i),other:true})
  for(let d=1;d<=last.getDate();d++)cells.push({date:new Date(year,month,d),other:false})
  const rem=(7-cells.length%7)%7;for(let d=1;d<=rem;d++)cells.push({date:new Date(year,month+1,d),other:true})
  return<div className="cal-container">
    <div className="cal-header-row">{DAYS.map(d=><div key={d} className="cal-dow">{d}</div>)}</div>
    <div className="cal-body">
      {cells.map(({date,other},idx)=>{
        const ds=fmtDate(date),isT=ds===todayStr
        const dayB=bookings.filter(b=>b.date===ds&&b.profileId===profileId)
        const hasHighlight=searchHighlight&&dayB.some(b=>b.id===searchHighlight||b.bookedBy.toLowerCase().includes(searchHighlight.toLowerCase()))
        return<div key={idx} className={`cal-cell${other?' other-m':''}${isT?' today':''}`}
          style={{outline:hasHighlight?'2px solid #c2692a':undefined,outlineOffset:-2}}
          onClick={!other?()=>onDayClick(ds,date):undefined}>
          <div className="cell-date">
            <div className={`cell-num${other?' other-num':''}${isT?' is-today':''}`}>{date.getDate()}</div>
            {dayB.length>0&&!other&&<span style={{fontSize:10,color:'#9b9590',fontWeight:500}}>{dayB.length} slot{dayB.length>1?'s':''}</span>}
          </div>
          <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
            {dayB.slice(0,3).map(b=>{
              const m=TC[b.type]||TC.other;const isPending=(b.status||'pending')==='pending';const isRej=b.status==='rejected'
              return<div key={b.id} className="ev-pill" style={{background:isRej?'rgba(214,48,48,.08)':isPending?'rgba(255,255,255,.95)':m.bg,color:isRej?'#c02020':isPending?'#a07000':m.color,borderLeftColor:isRej?'#d63030':isPending?'#e6a800':m.color,border:isPending?'1.5px dashed #e6a800':undefined,textDecoration:isRej?'line-through':'none',opacity:isRej?.82:1}}>
                <span className="ev-time">{dTime(b.startTime)}</span><span style={{opacity:.5,fontSize:10}}>–</span><span className="ev-time">{dTime(b.endTime)}</span>
                <span style={{marginLeft:'auto',fontSize:8,fontWeight:700,color:isRej?'#d63030':isPending?'#e6a800':'#1a9070'}}>{isRej?'✕':isPending?'⏳':'✓'}</span>
              </div>
            })}
            {dayB.length>3&&<div className="more-link">+{dayB.length-3} more</div>}
          </div>
        </div>
      })}
    </div>
  </div>
}

// ─── Time Grid ────────────────────────────────────────────────────
function TimeGrid({dates,bookings,profileId,onHourClick}){
  const scrollRef=useRef()
  const sidebarRef=useRef()
  const todayStr=fmtDate(new Date()),now=new Date(),nowMins=now.getHours()*60+now.getMinutes()
  const ROW_H=64
  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=8*ROW_H},[])
  useEffect(()=>{
    const el=scrollRef.current
    if(!el)return
    const onScroll=()=>{if(sidebarRef.current)sidebarRef.current.scrollTop=el.scrollTop}
    el.addEventListener('scroll',onScroll)
    return()=>el.removeEventListener('scroll',onScroll)
  },[])
  return<div style={{display:'flex',flex:1,overflow:'hidden',borderRadius:12,border:'1px solid #e1ddd8',background:'#fff',boxShadow:'0 2px 16px rgba(80,60,40,.06)'}}>
    <div style={{width:56,flexShrink:0,borderRight:'1px solid #eee',background:'#faf9f7',display:'flex',flexDirection:'column'}}>
      <div style={{height:48,flexShrink:0,borderBottom:'1px solid #eee'}}/>
      <div ref={sidebarRef} style={{overflowY:'hidden',flex:1}}>
        {HOURS.map(h=><div key={h} style={{height:ROW_H,borderBottom:'1px solid #f0ede8',display:'flex',alignItems:'flex-start',padding:'4px 6px 0'}}>
          <span style={{fontSize:10,color:'#aaa',fontFamily:'DM Mono,monospace',whiteSpace:'nowrap'}}>{h===0?'12 AM':h<12?`${h} AM`:h===12?'12 PM':`${h-12} PM`}</span>
        </div>)}
      </div>
    </div>
    <div ref={scrollRef} style={{flex:1,overflowY:'auto',overflowX:'hidden'}}>
      <div style={{display:'grid',gridTemplateColumns:`repeat(${dates.length},1fr)`,position:'relative'}}>
        {dates.map((date,di)=>{
          const ds=fmtDate(date),isT=ds===todayStr
          return<div key={di} style={{height:48,borderBottom:'1px solid #eee',borderRight:di<dates.length-1?'1px solid #eee':'none',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:isT?'rgba(194,105,42,.04)':'#faf9f7',position:'sticky',top:0,zIndex:10}}>
            <div style={{fontSize:11,color:isT?'#c2692a':'#9b9590',fontWeight:600,textTransform:'uppercase',letterSpacing:.5}}>{DAYS[date.getDay()]}</div>
            <div style={{width:30,height:30,borderRadius:8,background:isT?'#1a1714':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:isT?800:500,color:isT?'#fff':'#1a1714',fontFamily:'Syne,sans-serif',marginTop:1}}>{date.getDate()}</div>
          </div>
        })}
        {dates.map((date,di)=>{
          const ds=fmtDate(date),isT=ds===todayStr
          const dayB=bookings.filter(b=>b.date===ds&&b.profileId===profileId)
          return<div key={`col-${di}`} style={{position:'relative',borderRight:di<dates.length-1?'1px solid #eee':'none'}}>
            {HOURS.map(h=><div key={h} onClick={()=>onHourClick(ds,h,date)} style={{height:ROW_H,borderBottom:'1px dashed #f0ede8',cursor:'pointer',transition:'background .12s',position:'relative'}} onMouseOver={e=>e.currentTarget.style.background='rgba(194,105,42,.04)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <div style={{position:'absolute',top:'50%',left:0,right:0,borderBottom:'1px dashed #f5f2ee'}}/>
            </div>)}
            {isT&&<div style={{position:'absolute',left:0,right:0,top:nowMins*(ROW_H/60),zIndex:5,pointerEvents:'none'}}>
              <div style={{height:2,background:'#c2692a',position:'relative'}}><div style={{width:10,height:10,borderRadius:'50%',background:'#c2692a',position:'absolute',left:-5,top:-4}}/></div>
            </div>}
            {dayB.map(b=>{
              const startM=tmins(b.startTime),endM=tmins(b.endTime)
              const top=startM*(ROW_H/60),height=Math.max((endM-startM)*(ROW_H/60),24)
              const m=TC[b.type]||TC.other
              const isPending=(b.status||'pending')==='pending';const isRej=b.status==='rejected'
              return<div key={b.id} style={{position:'absolute',left:3,right:3,top,height,background:isRej?'rgba(214,48,48,.08)':isPending?'rgba(255,255,255,.95)':m.bg,border:isRej?'1.5px solid #d63030':isPending?'2px dashed #e6a800':`1.5px solid ${m.border}`,borderLeft:isRej?'4px solid #d63030':isPending?'4px solid #e6a800':`4px solid ${m.color}`,borderRadius:'0 8px 8px 0',padding:'5px 8px',overflow:'hidden',zIndex:4,cursor:'default',boxShadow:isPending?'0 2px 12px rgba(230,168,0,.2)':'0 1px 6px rgba(0,0,0,.07)'}}>
                <div style={{fontSize:10,fontWeight:700,color:isRej?'#c02020':isPending?'#a07000':m.color,fontFamily:'Syne,sans-serif',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{dTime(b.startTime)} – {dTime(b.endTime)}</div>
                {height>28&&<div style={{fontSize:9.5,fontWeight:600,marginTop:2,color:isRej?'#fff':isPending?'#b08000':'#fff',background:isRej?'rgba(214,48,48,.7)':isPending?'rgba(230,168,0,.15)':m.color,display:'inline-flex',alignItems:'center',gap:3,padding:'1px 7px',borderRadius:10,whiteSpace:'nowrap'}}>
                  {isRej?<>✕ Slot Declined</>:isPending?<>⏳ Slot Booked · Pending</>:<>✓ Slot Booked</>}
                </div>}
              </div>
            })}
          </div>
        })}
      </div>
    </div>
  </div>
}

// ─── Main App ─────────────────────────────────────────────────────
export default function App(){
  const today=new Date()
  const[bookings,setBookings]=useState([])
  const[profiles,setProfiles]=useState(DEFAULT_PROFILES)
  const[notices,setNotices]=useState([])
  const[vaults,setVaults]=useState([])
  const[profilesLoaded,setProfilesLoaded]=useState(false)
  const[loading,setLoading]=useState(true)
  const[saving,setSaving]=useState(false)
  const[deleting,setDeleting]=useState(null)
  const[calYear,setCalYear]=useState(today.getFullYear())
  const[calMonth,setCalMonth]=useState(today.getMonth())
  const[miniYear,setMiniYear]=useState(today.getFullYear())
  const[miniMonth,setMiniMonth]=useState(today.getMonth())
  const[viewMode,setViewMode]=useState('month')
  const[viewDate,setViewDate]=useState(today)
  const[theme,setTheme]=useState(()=>localStorage.getItem('slotbook-theme')||'default')
  const[userName,setUserName]=useState(null)
  const[userPhone,setUserPhone]=useState('')
  const[profileId,setProfileId]=useState('p3')
  const[screen,setScreen]=useState('user')
  const[showName,setShowName]=useState(false)
  const[bookMod,setBookMod]=useState(null)
  const[dayMod,setDayMod]=useState(null)
  const[cancelMod,setCancelMod]=useState(null)
  const[noticeDetail,setNoticeDetail]=useState(null)
  const[adminLogin,setAdminLogin]=useState(false)
  const[toast,setToast]=useState(null)
  const[searchQ,setSearchQ]=useState('')
  const[selectedTZ,setSelectedTZ]=useState('Asia/Kolkata')
  const[showLinks,setShowLinks]=useState(false)
  const pendingDay=useRef(null);const pendingHour=useRef(null);const pendingProf=useRef(null)

  useEffect(()=>{if(!profileId&&profiles.length)setProfileId(profiles[0].id)},[profiles])

  useEffect(()=>{
    doFetchAll()
    const bookSub=supabase.channel('bookings-live').on('postgres_changes',{event:'*',schema:'public',table:'bookings'},()=>doFetchAll()).subscribe()
    const noticeSub=supabase.channel('notices-live').on('postgres_changes',{event:'*',schema:'public',table:'notices'},()=>fetchNotices()).subscribe()
    const profSub=supabase.channel('profiles-live').on('postgres_changes',{event:'*',schema:'public',table:'profiles'},()=>fetchProfiles()).subscribe()
    const vaultSub=supabase.channel('vaults-live').on('postgres_changes',{event:'*',schema:'public',table:'link_vaults'},()=>fetchVaults()).subscribe()
    return()=>{bookSub.unsubscribe();noticeSub.unsubscribe();profSub.unsubscribe();vaultSub.unsubscribe()}
  },[])

  async function doFetchAll(){setLoading(true);await Promise.all([fetchProfiles(),fetchBookings(),fetchNotices(),fetchVaults()]);setLoading(false)}

  async function fetchProfiles(){
    const{data,error}=await supabase.from('profiles').select('*').order('created_at',{ascending:true})
    if(!error&&data&&data.length>0){setProfiles(data.map(r=>({id:r.id,name:r.name,role:r.role||r.name})));setProfilesLoaded(true)}
    else if(!profilesLoaded){const seeds=DEFAULT_PROFILES.map(p=>({id:p.id,name:p.name,role:p.role}));await supabase.from('profiles').upsert(seeds);setProfilesLoaded(true)}
  }
  async function fetchBookings(){
    const{data,error}=await supabase.from('bookings').select('*').order('created_at',{ascending:false})
    if(!error)setBookings((data||[]).map(r=>({id:r.id,date:r.date,startTime:r.start_time,endTime:r.end_time,type:r.type,title:r.title,desc:r.description,bookedBy:r.booked_by,userPhone:r.user_phone||'',profileId:r.profile_id,status:r.status||'pending',createdAt:r.created_at})))
  }
  async function fetchNotices(){
    const{data,error}=await supabase.from('notices').select('*').order('created_at',{ascending:false})
    if(!error)setNotices(data||[])
  }
  async function fetchVaults(){
    const{data,error}=await supabase.from('link_vaults').select('*').order('created_at',{ascending:true})
    if(!error)setVaults((data||[]).map(r=>({...r,links:typeof r.links==='string'?JSON.parse(r.links||'[]'):r.links||[]})))
  }

  async function saveBooking(b){
    setSaving(true)
    setBookings(prev=>[{...b,createdAt:new Date().toISOString()},...prev])
    const{error}=await supabase.from('bookings').insert([{id:b.id,date:b.date,start_time:b.startTime,end_time:b.endTime,type:b.type,title:b.title,description:b.desc,booked_by:b.bookedBy,user_phone:b.userPhone||'',profile_id:b.profileId,status:'pending'}])
    setSaving(false)
    if(error){setBookings(prev=>prev.filter(x=>x.id!==b.id));setToast({msg:'Error saving booking.',type:'pending'})}
    else setToast({msg:`Booking submitted for ${profiles.find(p=>p.id===b.profileId)?.name||''}. Awaiting admin approval.`,type:'pending'})
  }
  async function approveBooking(id){setBookings(prev=>prev.map(b=>b.id===id?{...b,status:'approved'}:b));await supabase.from('bookings').update({status:'approved'}).eq('id',id)}
  async function rejectBooking(id){setBookings(prev=>prev.map(b=>b.id===id?{...b,status:'rejected'}:b));await supabase.from('bookings').update({status:'rejected'}).eq('id',id)}
  async function deleteBooking(id){if(!window.confirm('Delete?'))return;setDeleting(id);setBookings(prev=>prev.filter(b=>b.id!==id));await supabase.from('bookings').delete().eq('id',id);setDeleting(null)}
  async function cancelBooking(id){setBookings(prev=>prev.filter(b=>b.id!==id));await supabase.from('bookings').delete().eq('id',id);setCancelMod(null);setToast({msg:'Your booking has been cancelled.',type:'success'})}

  async function addProfile(p){
    setProfiles(prev=>[...prev,p])
    const{error}=await supabase.from('profiles').upsert([{id:p.id,name:p.name,role:p.role}])
    if(error){setProfiles(prev=>prev.filter(x=>x.id!==p.id));setToast({msg:`Error: ${error.message}`,type:'pending'})}
    else setToast({msg:`Profile "${p.name}" added.`,type:'success'})
  }
  async function deleteProfile(id){
    const prof=profiles.find(p=>p.id===id)
    setProfiles(prev=>prev.filter(p=>p.id!==id))
    const{error}=await supabase.from('profiles').delete().eq('id',id)
    if(error){setProfiles(prev=>[...prev,prof]);setToast({msg:`Error: ${error.message}`,type:'pending'})}
    else setToast({msg:`Profile "${prof?.name}" permanently deleted.`,type:'success'})
  }
  async function saveNotice(n){
    if(n.createdAt&&notices.find(x=>x.id===n.id)){
      setNotices(prev=>prev.map(x=>x.id===n.id?{...x,active:n.active}:x))
      await supabase.from('notices').update({active:n.active}).eq('id',n.id)
    }else{
      setNotices(prev=>[n,...prev])
      await supabase.from('notices').insert([{id:n.id,title:n.title,message:n.message,active:n.active!==false}])
    }
  }
  async function deleteNotice(id){setNotices(prev=>prev.filter(n=>n.id!==id));await supabase.from('notices').delete().eq('id',id)}

  async function addVault(v){
    setVaults(prev=>[...prev,v])
    await supabase.from('link_vaults').insert([{id:v.id,name:v.name,passcode:v.passcode,color:v.color,links:[]}])
  }
  async function deleteVault(id){setVaults(prev=>prev.filter(v=>v.id!==id));await supabase.from('link_vaults').delete().eq('id',id)}
  async function addLink(vaultId,link){
    const vault=vaults.find(v=>v.id===vaultId);if(!vault)return
    const newLinks=[...(vault.links||[]),link]
    setVaults(prev=>prev.map(v=>v.id===vaultId?{...v,links:newLinks}:v))
    await supabase.from('link_vaults').update({links:newLinks}).eq('id',vaultId)
  }
  async function editLink(vaultId,linkIdx,updatedLink){
    const vault=vaults.find(v=>v.id===vaultId);if(!vault)return
    const newLinks=(vault.links||[]).map((l,i)=>i===linkIdx?updatedLink:l)
    setVaults(prev=>prev.map(v=>v.id===vaultId?{...v,links:newLinks}:v))
    await supabase.from('link_vaults').update({links:newLinks}).eq('id',vaultId)
  }
  async function deleteLink(vaultId,linkIdx){
    const vault=vaults.find(v=>v.id===vaultId);if(!vault)return
    const newLinks=(vault.links||[]).filter((_,i)=>i!==linkIdx)
    setVaults(prev=>prev.map(v=>v.id===vaultId?{...v,links:newLinks}:v))
    await supabase.from('link_vaults').update({links:newLinks}).eq('id',vaultId)
  }

  function handleBook(ds,hour){
    if(!userName){pendingDay.current=ds;pendingHour.current=hour;pendingProf.current=profileId;setShowName(true)}
    else setBookMod({prefillDate:ds,prefillHour:hour,profileId})
  }
  function onNameSaved(n,ph){
    setUserName(n);setUserPhone(ph||'');setShowName(false)
    setBookMod({prefillDate:pendingDay.current,prefillHour:pendingHour.current,profileId:pendingProf.current||profileId})
    pendingDay.current=null;pendingHour.current=null;pendingProf.current=null
  }
  function onDayClick(ds,date){setDayMod({ds,date})}
  function bookFromDay(ds){setDayMod(null);if(!userName){pendingDay.current=ds;pendingProf.current=profileId;setShowName(true)}else setBookMod({prefillDate:ds,profileId})}
  function changeMonth(d){let m=calMonth+d,y=calYear;if(m>11){m=0;y++}else if(m<0){m=11;y--};setCalMonth(m);setCalYear(y);setMiniMonth(m);setMiniYear(y);setViewDate(new Date(y,m,1))}
  function changeWeek(d){const nd=addDays(viewDate,d*7);setViewDate(nd);setCalYear(nd.getFullYear());setCalMonth(nd.getMonth())}
  function changeDay(d){const nd=addDays(viewDate,d);setViewDate(nd);setCalYear(nd.getFullYear());setCalMonth(nd.getMonth())}
  function goToday(){setViewDate(today);setCalYear(today.getFullYear());setCalMonth(today.getMonth());setMiniYear(today.getFullYear());setMiniMonth(today.getMonth())}

  useEffect(()=>{localStorage.setItem('slotbook-theme',theme)},[theme])
  const themeVars=THEMES[theme]||THEMES.default
  const curProfile=profiles.find(p=>p.id===profileId)
  const weekStart=startOfWeek(viewDate)
  const weekDates=Array.from({length:7},(_,i)=>addDays(weekStart,i))
  const dayDates=[viewDate]
  let navTitle='',navSub=''
  if(viewMode==='month'){navTitle=`${MONTHS[calMonth]}`;navSub=`${calYear}`}
  else if(viewMode==='week'){const ws=weekDates[0],we=weekDates[6];navTitle=`${MONTHS[ws.getMonth()].slice(0,3)} ${ws.getDate()} – ${ws.getMonth()!==we.getMonth()?MONTHS[we.getMonth()].slice(0,3)+' ':''}`;navSub=`${we.getDate()}, ${we.getFullYear()}`}
  else{navTitle=`${MONTHS[viewDate.getMonth()]} ${viewDate.getDate()}`;navSub=`${viewDate.getFullYear()}`}

  if(screen==='admin')return<>
    <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
    {toast&&<Toast {...toast} onClose={()=>setToast(null)}/>}
    <AdminPanel
      bookings={bookings} profiles={profiles} notices={notices}
      onDelete={deleteBooking} onApprove={approveBooking} onReject={rejectBooking}
      onClose={()=>setScreen('user')} deleting={deleting}
      onAddProfile={addProfile} onDeleteProfile={deleteProfile}
      onSaveNotice={saveNotice} onDeleteNotice={deleteNotice}
      vaults={vaults} onAddVault={addVault} onDeleteVault={deleteVault}
      onAddLink={addLink} onEditLink={editLink} onDeleteLink={deleteLink}
    />
  </>

  return<>
    <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
    {toast&&<Toast {...toast} onClose={()=>setToast(null)}/>}
    {showName&&<NameModal onSave={onNameSaved} onClose={()=>{setShowName(false);pendingDay.current=null;pendingHour.current=null;pendingProf.current=null}}/>}
    {bookMod&&<BookModal prefillDate={bookMod.prefillDate} prefillHour={bookMod.prefillHour} profileId={bookMod.profileId||profileId} profiles={profiles} bookings={bookings} userName={userName} userPhone={userPhone} onBook={async b=>{await saveBooking(b);setBookMod(null)}} onClose={()=>setBookMod(null)} saving={saving} selectedTZ={selectedTZ}/>}
    {dayMod&&<DayModal dateStr={dayMod.ds} bookings={bookings} profileId={profileId} userName={userName} onBookHere={bookFromDay} onClose={()=>setDayMod(null)} onCancelRequest={b=>setCancelMod(b)}/>}
    {cancelMod&&<CancelModal booking={cancelMod} userName={userName} profiles={profiles} onCancel={cancelBooking} onClose={()=>setCancelMod(null)}/>}
    {noticeDetail&&<NoticeModal notice={noticeDetail} onClose={()=>setNoticeDetail(null)}/>}
    {adminLogin&&<AdminLogin onLogin={()=>{setAdminLogin(false);setScreen('admin')}} onBack={()=>setAdminLogin(false)}/>}
    {showLinks&&<LinksPage
      vaults={vaults} onClose={()=>setShowLinks(false)} isAdmin={screen==='admin'}
      onAddVault={addVault} onDeleteVault={deleteVault}
      onAddLink={addLink} onEditLink={editLink} onDeleteLink={deleteLink}
    />}

    <div style={{display:'flex',flexDirection:'column',minHeight:'100%',background:themeVars['--t-bg'],position:'relative',zIndex:1,...Object.fromEntries(Object.entries(themeVars).filter(([k])=>k.startsWith('--')))}}>
      {/* Header */}
      <header className="main-header">
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#fde8d5,#fef3e2)',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(194,105,42,.2)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(194,105,42,.12)" stroke="#c2692a" strokeWidth="1.6"/><circle cx="12" cy="3.2" r="0.8" fill="#c2692a" opacity="0.5"/><circle cx="12" cy="20.8" r="0.8" fill="#c2692a" opacity="0.5"/><circle cx="3.2" cy="12" r="0.8" fill="#c2692a" opacity="0.5"/><circle cx="20.8" cy="12" r="0.8" fill="#c2692a" opacity="0.5"/><circle cx="6.1" cy="6.1" r="0.5" fill="#c2692a" opacity="0.3"/><circle cx="17.9" cy="6.1" r="0.5" fill="#c2692a" opacity="0.3"/><circle cx="6.1" cy="17.9" r="0.5" fill="#c2692a" opacity="0.3"/><circle cx="17.9" cy="17.9" r="0.5" fill="#c2692a" opacity="0.3"/><line x1="12" y1="12" x2="12" y2="5.5" stroke="#c2692a" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="12" x2="16.2" y2="14.5" stroke="#c2692a" strokeWidth="1.4" strokeLinecap="round"/><circle cx="12" cy="12" r="1.6" fill="#c2692a"/></svg>
          </div>
          <span style={{fontFamily:'Syne,sans-serif',fontSize:'1.35rem',fontWeight:800,color:'#1a1714',letterSpacing:'-.4px'}}>SlotBook</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:9,flex:1,justifyContent:'center',maxWidth:320}}>
          <SearchBar bookings={bookings} profiles={profiles} onResult={b=>{setSearchQ(b.bookedBy);setProfileId(b.profileId);const d=parseDate(b.date);setCalYear(d.getFullYear());setCalMonth(d.getMonth());setViewDate(d);setViewMode('month')}} onClear={()=>setSearchQ('')}/>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <ThemePicker theme={theme} setTheme={setTheme}/>
          <DragProfileSwitcher profiles={profiles} selected={profileId} onSelect={pid=>setProfileId(pid)}/>
          {userName&&<div style={{display:'flex',background:'rgba(255,255,255,.72)',border:'1px solid rgba(200,192,178,.4)',borderRadius:20,padding:'4px 10px 4px 6px',fontSize:12,color:'rgba(90,82,72,.78)',alignItems:'center',gap:6}}>
            <Avatar name={userName} size={20}/>
          </div>}
          <button className="btn-dark" onClick={()=>handleBook(fmtDate(viewDate),null)} style={{padding:'9px 18px',borderRadius:11,fontSize:13,display:'flex',alignItems:'center',gap:7}}>
            + Book Slot <span style={{animation:'arrBounce 1.4s ease infinite',display:'inline-block'}}>→</span>
          </button>
          <button onClick={()=>setShowLinks(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:'rgba(255,255,255,.85)',border:'1px solid rgba(200,192,178,.45)',borderRadius:9,cursor:'pointer',fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,color:'#1a1714',transition:'all .2s'}} onMouseOver={e=>e.currentTarget.style.background='rgba(194,105,42,.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,.85)'}>
            🔗 Links
          </button>
          <button className="btn-soft" onClick={()=>setAdminLogin(true)} style={{padding:'8px 14px',borderRadius:9,fontSize:11}}>Admin</button>
        </div>
      </header>

      <NoticeBanner notices={notices} onClickNotice={n=>setNoticeDetail(n)}/>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Sidebar */}
        <aside className="sidebar">
          {curProfile&&<div style={{background:'linear-gradient(135deg,rgba(194,105,42,.08),rgba(30,160,120,.05))',border:'1px solid rgba(194,105,42,.18)',borderRadius:12,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
            <Avatar name={curProfile.name} size={38}/>
            <div><div style={{fontSize:13,fontWeight:700,color:'#1a1714',fontFamily:'Syne,sans-serif'}}>{curProfile.name}</div><div style={{fontSize:11,color:'rgba(90,82,72,.55)',marginTop:1}}>{curProfile.role}</div></div>
          </div>}
          <button className="btn-dark" onClick={()=>handleBook(fmtDate(viewDate),null)} style={{width:'100%',padding:11,borderRadius:10,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>+ Book a Slot →</button>
          <MiniCal year={miniYear} month={miniMonth} bookings={bookings} profileId={profileId} selectedDate={fmtDate(viewDate)}
            onNav={d=>{let m=miniMonth+d,y=miniYear;if(m>11){m=0;y++}else if(m<0){m=11;y--}setMiniMonth(m);setMiniYear(y)}}
            onSelect={d=>{setViewDate(d);setCalYear(d.getFullYear());setCalMonth(d.getMonth())}}/>
          <div>
            <div style={{fontSize:9,color:'rgba(90,82,72,.38)',textTransform:'uppercase',letterSpacing:1,marginBottom:8,fontWeight:700,fontFamily:'Syne,sans-serif'}}>Your Timezone</div>
            <select value={selectedTZ} onChange={e=>setSelectedTZ(e.target.value)} className="f-in" style={{fontSize:11,padding:'7px 10px'}}>
              {TIMEZONES.map(z=><option key={z.tz} value={z.tz}>{z.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:9,color:'rgba(90,82,72,.38)',textTransform:'uppercase',letterSpacing:1,marginBottom:8,fontWeight:700,fontFamily:'Syne,sans-serif'}}>Status</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[['rgba(230,168,0,.15)','#e6a800','Pending'],['rgba(30,160,120,.12)','rgba(30,160,120,.35)','Approved'],['rgba(214,48,48,.8)','#d63030','Declined']].map(([bg,br,lbl])=>
                <div key={lbl} style={{display:'flex',alignItems:'center',gap:7}}><div style={{width:10,height:10,borderRadius:3,background:bg,border:`1px solid ${br}`,flexShrink:0}}/><span style={{fontSize:11,color:'rgba(90,82,72,.62)'}}>{lbl}</span></div>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:9,color:'rgba(90,82,72,.38)',textTransform:'uppercase',letterSpacing:1,marginBottom:6,fontWeight:700,fontFamily:'Syne,sans-serif'}}>This Month</div>
            <div style={{fontSize:'2.2rem',fontWeight:800,fontFamily:'Syne,sans-serif',color:'#1a1714',letterSpacing:'-2px',lineHeight:1}}>{bookings.filter(b=>b.profileId===profileId&&b.date.startsWith(`${calYear}-${padZ(calMonth+1)}`)).length}</div>
            <div style={{fontSize:10,color:'rgba(90,82,72,.38)',marginTop:4}}>{MONTHS[calMonth]} bookings</div>
          </div>
        </aside>

        {/* Main */}
        <main style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',padding:'1.25rem 1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem',flexWrap:'wrap',flexShrink:0}}>
            <button className="btn-soft" onClick={goToday} style={{padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:600}}>Today</button>
            <div style={{display:'flex',gap:5}}>
              <button className="btn-soft" onClick={()=>viewMode==='month'?changeMonth(-1):viewMode==='week'?changeWeek(-1):changeDay(-1)} style={{width:34,height:34,borderRadius:8,fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>‹</button>
              <button className="btn-soft" onClick={()=>viewMode==='month'?changeMonth(1):viewMode==='week'?changeWeek(1):changeDay(1)} style={{width:34,height:34,borderRadius:8,fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>›</button>
            </div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800,color:'#1a1714',letterSpacing:'-.5px',flex:1,display:'flex',alignItems:'baseline',gap:8}}>
              {navTitle}<span style={{color:'rgba(90,82,72,.35)',fontWeight:300,fontSize:'1.2rem'}}>{navSub}</span>
            </h1>
            <div style={{display:'flex',border:'1px solid rgba(200,192,178,.45)',borderRadius:9,overflow:'hidden',background:'rgba(255,255,255,.75)'}}>
              {[['day','Day'],['week','Week'],['month','Month']].map(([k,lbl])=><button key={k} onClick={()=>setViewMode(k)} style={{padding:'7px 14px',border:'none',fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:600,cursor:'pointer',transition:'all .2s',background:viewMode===k?'#1a1714':'transparent',color:viewMode===k?'#f5f4f0':'rgba(90,82,72,.7)'}}>{lbl}</button>)}
            </div>
          </div>
          <div style={{display:'flex',gap:6,marginBottom:'1rem',flexShrink:0,overflowX:'auto',paddingBottom:4}}>
            {profiles.map(p=><button key={p.id} onClick={()=>setProfileId(p.id)} title={p.name} style={{display:'flex',alignItems:'center',gap:6,padding:'5px 10px 5px 6px',borderRadius:20,cursor:'pointer',border:p.id===profileId?'2px solid #c2692a':'2px solid transparent',background:p.id===profileId?'rgba(194,105,42,.08)':'rgba(255,255,255,.7)',transition:'all .15s',whiteSpace:'nowrap',flexShrink:0}}>
              <Avatar name={p.name} size={22}/>
              <span style={{fontSize:11,fontWeight:600,color:p.id===profileId?'#c2692a':'rgba(90,82,72,.7)',fontFamily:'Syne,sans-serif'}}>{p.name}</span>
            </button>)}
          </div>
          {loading?<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:300,gap:12,color:'rgba(90,82,72,.5)',fontSize:14}}><span className="spinner"/> Loading…</div>
          :viewMode==='month'?<div style={{flex:1,overflowY:'auto'}}><MonthView year={calYear} month={calMonth} bookings={bookings} profileId={profileId} onDayClick={onDayClick} searchHighlight={searchQ}/></div>
          :<div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}><TimeGrid dates={viewMode==='week'?weekDates:dayDates} bookings={bookings} profileId={profileId} onHourClick={(ds,h,d)=>handleBook(ds,h)}/></div>}
        </main>
      </div>
    </div>
  </>
}