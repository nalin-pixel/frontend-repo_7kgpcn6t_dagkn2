import { useMemo, useState } from 'react'
import Hero from './components/Hero'
import Controls from './components/Controls'
import Player from './components/Player'
import Sidebar from './components/Sidebar'

function App() {
  const backend = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [current, setCurrent] = useState(null)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Hero />
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 -mt-20">
          <div className="space-y-6">
            <Controls backend={backend} onGenerate={(g)=> setCurrent(g)} onMaster={()=>{}} />
            <Player src={current?.audio_url ? `${backend}${current.audio_url}` : ''} />
          </div>
          <Sidebar backend={backend} />
        </div>
      </div>
    </div>
  )
}

export default App
