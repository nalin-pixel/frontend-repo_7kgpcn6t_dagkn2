import { useState } from 'react';

const instrumentsList = [
  'drums','bass','guitar','piano','synth','strings','brass','pads'
];

export default function Controls({ onGenerate, onMaster, backend }) {
  const [prompt, setPrompt] = useState('A chill lofi beat with warm pads and soft drums');
  const [style, setStyle] = useState('LoFi');
  const [bpm, setBpm] = useState(90);
  const [key, setKey] = useState('C Major');
  const [mood, setMood] = useState('Chill');
  const [voice, setVoice] = useState('ai_voice_female_01');
  const [instruments, setInstruments] = useState(['drums','bass','piano','pads']);

  const toggleInstrument = (name) => {
    setInstruments((prev) => prev.includes(name) ? prev.filter(i=>i!==name) : [...prev, name]);
  }

  const generate = async () => {
    const payload = {
      prompt, style, bpm: Number(bpm), key, mood,
      instruments: instruments.map(t => ({ type: t, volume: 0.8, pan: 0, eq_low:0, eq_mid:0, eq_high:0, reverb:0.1, delay:0 })),
      voice: { voice_id: voice, reverb: 0.1, echo: 0.05, autotune: 0.2, pitch_shift: 0 },
    };
    const res = await fetch(`${backend}/api/generate/music`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    onGenerate?.(data);
  }

  const master = async () => {
    onMaster?.(style);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 md:p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm text-white/70">Prompt</label>
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 p-3 outline-none" rows={3} />
        </div>
        <div>
          <label className="text-sm text-white/70">Style</label>
          <select value={style} onChange={e=>setStyle(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 p-2">
            {['LoFi','Trap','EDM','Rock','Bollywood','Romantic','Chillhop'].map(s=> <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/70">Voice</label>
          <select value={voice} onChange={e=>setVoice(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 p-2">
            {['ai_voice_female_01','ai_voice_male_01','ai_voice_neutral_01'].map(v=> <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/70">BPM: {bpm}</label>
          <input type="range" min={40} max={200} value={bpm} onChange={e=>setBpm(e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="text-sm text-white/70">Key</label>
          <select value={key} onChange={e=>setKey(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 p-2">
            {['C Major','A Minor','G Minor','D Major','F# Minor'].map(k=> <option key={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/70">Mood</label>
          <select value={mood} onChange={e=>setMood(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 p-2">
            {['Chill','Dark','Happy','Romantic','Energy'].map(m=> <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-white/70 mb-2">Instruments</p>
        <div className="flex flex-wrap gap-2">
          {instrumentsList.map(i=> (
            <button key={i} onClick={()=>toggleInstrument(i)} className={`px-3 py-1 rounded-full border ${instruments.includes(i) ? 'bg-blue-500/20 border-blue-400 text-blue-200' : 'border-white/20 text-white/70'}`}>{i}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={generate} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition">Generate Music</button>
        <button onClick={master} className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 transition">Master</button>
      </div>
    </div>
  );
}
