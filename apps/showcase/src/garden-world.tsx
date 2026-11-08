import { useEffect, useId, useState } from "react";

/** Original architectural illustration. No sacred text is used as ornament. */
export function GardenWorld({ compact = false }: { compact?: boolean }) {
  const id = useId().replace(/:/g, "");
  return <div className={`garden-world${compact ? " garden-world--compact" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 700 800" fill="none" focusable="false">
      <defs>
        <linearGradient id={`${id}sky`} x2="0" y2="1"><stop stopColor="#33306c"/><stop offset="1" stopColor="#d7a7b4"/></linearGradient>
        <linearGradient id={`${id}water`} x2="0" y2="1"><stop stopColor="#a8dce7"/><stop offset="1" stopColor="#4754a2"/></linearGradient>
        <radialGradient id={`${id}light`}><stop stopColor="#fcebc1" stopOpacity=".55"/><stop offset="1" stopColor="#fcebc1" stopOpacity="0"/></radialGradient>
        <pattern id={`${id}tile`} width="48" height="48" patternUnits="userSpaceOnUse"><path d="M24 0 31 17 48 24 31 31 24 48 17 31 0 24 17 17Z" stroke="#d8bd7b" strokeWidth=".7"/><circle cx="24" cy="24" r="5" stroke="#d8bd7b" strokeWidth=".6"/></pattern>
        <clipPath id={`${id}arch`}><path d="M65 800V325Q65 130 350 40Q635 130 635 325V800Z"/></clipPath>
        <g id={`${id}tree`}><path d="M0 0Q-65-65 0-220Q65-65 0 0Z" fill="#43627e"/><path d="M0 0V-178M0-55-24-88M0-90 22-120M0-130-15-153" stroke="#c5b8df" strokeWidth="1.4"/></g>
        <g id={`${id}branch`}><path d="M0 0Q55-110 20-235" stroke="#a7b47b" strokeWidth="3"/>{Array.from({length:7},(_,i)=><g key={i} transform={`translate(${22+Math.sin(i*.5)*10} ${-25-i*27})`}><path d="M0 0Q-65 0-55-35Q-15-38 0 0" fill={i%2 ? '#d397a9':'#6267a5'}/><path d="M0-8Q55-52 58-10Q25 8 0-8" fill={i%2 ? '#edbb83':'#819eb6'}/></g>)}</g>
      </defs>
      <path d="M25 800V320Q25 100 350 12Q675 100 675 320V800" stroke="#d5b576" strokeWidth="1"/>
      <g clipPath={`url(#${id}arch)`}>
        <path fill={`url(#${id}sky)`} d="M0 0H700V800H0Z"/>
        <circle className="garden-glow" cx="350" cy="280" r="260" fill={`url(#${id}light)`}/>
        <circle cx="350" cy="230" r="46" fill="#f4deb0"/><circle cx="350" cy="230" r="60" stroke="#f4deb0" opacity=".3"/>
        {[0,1,2].map(i=><path key={i} d={`M${115+i*65} 610V${350+i*22}Q${115+i*65} ${210+i*35} 350 ${133+i*75}Q${585-i*65} ${210+i*35} ${585-i*65} ${350+i*22}V610`} stroke="#ead6a7" strokeWidth={i===0?20:10} opacity={.75-i*.16}/>)}
        <path d="M0 570Q160 490 350 570Q540 490 700 570V800H0Z" fill="#595785"/>
        {[125,205,495,575].map((x,i)=><use key={x} href={`#${id}tree`} transform={`translate(${x} ${615-i%2*35}) scale(${i%2?.65:1})`}/>)}
        <path d="M315 565H385L585 800H115Z" fill="#d6c59b"/>
        <path d="M329 570H371L520 800H180Z" fill={`url(#${id}water)`}/>
        {Array.from({length:9},(_,i)=><ellipse className="garden-ripple" key={i} cx="350" cy={595+i*25} rx={15+i*13} ry={2+i*.55} stroke="#e6e4bb" opacity=".45" style={{animationDelay:`${i*-.7}s`}}/>)}
        <path d="M0 700 150 665 205 800H0ZM700 700 550 665 495 800H700Z" fill={`url(#${id}tile)`}/>
        <g className="garden-leaves"><use href={`#${id}branch`} transform="translate(90 790) scale(1.6)"/><use href={`#${id}branch`} transform="translate(625 790) scale(-1.5 1.5)"/></g>
        {Array.from({length:14},(_,i)=><circle className="garden-firefly" key={i} cx={100+(i*83)%500} cy={170+(i*113)%510} r={i%3===0?2.5:1.5} fill="#f6d995" style={{animationDelay:`${i*-.6}s`}}/>)}
      </g>
      <path d="M65 800V325Q65 130 350 40Q635 130 635 325V800" stroke="#ddc18c" strokeWidth="3"/>
    </svg>
  </div>;
}

export function GardenAtmosphere() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.gardenMotion = paused ? "paused" : "playing";
    return () => { delete document.documentElement.dataset.gardenMotion; };
  }, [paused]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("garden-arrived");
    }), { threshold: .08 });
    const elements = document.querySelectorAll(".section-heading, .philosophy-principle, .geometry-card, .philosophy-convictions article, .philosophy-method, .reference-card");
    elements.forEach(element => { element.classList.add("garden-reveal"); observer.observe(element); });
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove("garden-reveal", "garden-arrived")); };
  }, []);
  return <button className="garden-motion-control" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "▷ Resume atmosphere" : "Ⅱ Pause atmosphere"}</button>;
}

export function GardenInvitation() {
  return <div className="garden-invitation"><div><p className="eyebrow">An invitation to slow down</p><h2>Enter with curiosity.<br/>Leave with a little more peace.</h2></div><div className="garden-paths">{[
    ["01", "The meaning", "A philosophy of care, made tangible.", "principles"],
    ["02", "The rhythm", "Discover the geometry of belonging.", "geometry"],
    ["03", "The making", "Compose a pattern of your own.", "studio"],
  ].map(([n,title,copy,href])=><a href={`#${href}`} key={n}><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div><b aria-hidden="true">↗</b></a>)}</div></div>;
}

export function GardenPatternPrelude() {
  return <div className="garden-pattern-prelude"><div><p className="eyebrow">The garden, expressed in geometry</p><h3>One seed. Infinite rhythm.</h3><p>Stars open into petals. Lines become pathways. Explore the relationships that turn a single form into a living field.</p></div><svg fill="none" viewBox="0 0 600 260" aria-hidden="true" focusable="false"><g className="garden-rosette" transform="translate(300 130)">{Array.from({length:12},(_,i)=><g key={i} transform={`rotate(${i*30})`}><ellipse cx="0" cy="-55" rx="25" ry="60" fill={i%2?'#bdd0a00b':'#bdd0a018'} stroke="#d9bc80" strokeWidth=".8"/><path d="M0 0 24-88 0-118-24-88Z" stroke="#a8c0a1" strokeWidth=".5"/></g>)}<circle r="32" stroke="#e4cc95"/><circle r="120" stroke="#d9bc80" strokeWidth=".5"/></g>{[80,520].map(x=><g key={x} transform={`translate(${x} 130)`}><path d="M0-50 15-15 50 0 15 15 0 50-15 15-50 0-15-15Z" stroke="#d9bc80"/><circle r="65" stroke="#d9bc80" strokeWidth=".5" strokeDasharray="2 9"/></g>)}</svg></div>;
}
