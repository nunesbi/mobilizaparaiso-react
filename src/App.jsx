import { useState, useEffect } from 'react'

export default function App(){
  const [started,setStarted]=useState(false)
  const [showList,setShowList]=useState(false)
  const [time,setTime]=useState('--:--')

  useEffect(()=>{
    const i=setInterval(()=>{
        fetch('http://localhost:3000/location')
        .then(r=>r.json())
        .then(d=>d.time && setTime(d.time))
    },2000)
    return ()=>clearInterval(i)
  },[])

  return (
    <>
      <section className={`screen start ${!started?'active':''}`}>
        <div className="center">
          <div className="bus-icon"><img src="/bus.svg" /></div>
          <h1>Mobiliza Paraíso</h1>
          <button className="enter" onClick={()=>setStarted(true)}>→</button>
        </div>
      </section>

      <section className={`screen app ${started?'active':''}`}>
        <header className="header">
          <div><img src="/bus.svg" className="header-icon"/> Mobiliza Paraíso</div>
          <span className="status online"><span className="dot"></span>Online</span>
        </header>

        <div className="bus-status">Ônibus em rota</div>

        <iframe src="https://thingsboard.cloud/dashboard/33dec660-224d-11f1-9cdc-43ca8fc8dcc9?publicId=73820a50-31e5-11f1-bbfc-9dee6dc65253" id="map"></iframe>

        <div className="info-cards">
          <div className="card"><p>PRÓXIMO PONTO</p><h3>UFLA Paraíso</h3></div>
          <div className="card"><p>TEMPO ESTIMADO</p><h3 className="green">2 min</h3></div>
          <div className="card"><p>ÚLTIMA ATUALIZAÇÃO</p><h3 id="time">{time}</h3></div>
          <div className="card"><p>VALOR DA TARIFA</p><h3>R$ 3,45</h3></div>
        </div>

        <div className="list">
          <button className="toggle-btn" onClick={()=>setShowList(!showList)}>Ver próximos pontos</button>
          <ul id="points" className={showList?'show':''}>
            <li><span>UFLA Paraíso</span><span>2 min</span></li>
            <li><span>Centro</span><span>5 min</span></li>
            <li><span>Rodoviária</span><span>10 min</span></li>
          </ul>
        </div>
      </section>
    </>
  )
}
