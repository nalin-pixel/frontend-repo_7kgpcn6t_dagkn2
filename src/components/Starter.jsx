import { useMemo, useState } from 'react';

export default function Starter({ backendBase }) {
  const backend = useMemo(() => backendBase || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [backendBase]);

  const [lyrics, setLyrics] = useState('Write a calm, inspiring song about blue flames and creativity.');
  const [instruments, setInstruments] = useState(['piano','drums']);
  const [tempo, setTempo] = useState(96);
  const [voiceFile, setVoiceFile] = useState(null);
  const [status, setStatus] = useState('Idle');
  const [trackUrl, setTrackUrl] = useState('');

  const toggleInstrument = (inst) => {
    setInstruments((prev) => prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]);
  }

  const uploadVoice = async () => {
    if (!voiceFile) { setStatus('Please choose a voice file first.'); return; }
    try {
      setStatus('Uploading voice...');
      const fd = new FormData();
      fd.append('file', voiceFile);
      const res = await fetch(`${backend}/api/upload/voice`, { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setStatus(`Voice uploaded: ${data.voice_id}`);
      } else {
        setStatus(data.error || 'Upload failed');
      }
    } catch (e) {
      setStatus(`Upload error: ${e.message}`);
    }
  }

  const generate = async () => {
    try {
      setStatus('Generating music...');
      setTrackUrl('');
      const payload = {
        prompt: lyrics,
        style: 'LoFi',
        bpm: Number(tempo) || 96,
        key: 'C Major',
        mood: 'Chill',
        instruments: instruments.map(inst => ({ type: inst, volume: 0.8, pan: 0, eq_low: 0, eq_mid: 0, eq_high: 0, reverb: 0.1, delay: 0 })),
        voice: { voice_id: 'ai_voice_female_01', reverb: 0.1, echo: 0.05, autotune: 0.2, pitch_shift: 0 },
      };
      const res = await fetch(`${backend}/api/generate/music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generate failed');
      const url = `${backend}${data.audio_url}`;
      setTrackUrl(url);
      setStatus('Generation complete');
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  }

  const list = ['piano','guitar','drums','bass','strings','synth'];

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white/5 border border-white/10 rounded-2xl text-white">
      <h2 className="text-2xl font-semibold mb-4">Blue-flame-style Music Studio — Starter</h2>

      <label className="block text-sm text-white/70 mb-1">Lyrics</label>
      <textarea value={lyrics} onChange={e=>setLyrics(e.target.value)} className="w-full h-40 p-3 rounded-lg bg-white/10 outline-none" />

      <div className="mt-4">
        <div className="text-sm text-white/70 mb-2">Choose instruments</div>
        <div className="flex flex-wrap">
          {list.map(inst => (
            <button key={inst} onClick={() => toggleInstrument(inst)} className={`m-1 px-3 py-2 rounded-full border ${instruments.includes(inst) ? 'bg-gray-300 text-black border-gray-300' : 'border-white/20 text-white/80'}`}>
              {inst}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm text-white/70">Tempo</label>
        <input type="number" value={tempo} onChange={e=>setTempo(Number(e.target.value))} className="w-24 rounded bg-white/10 p-2 outline-none" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div>
          <label className="block text-sm text-white/70 mb-1">Upload voice sample (optional)</label>
          <input type="file" accept="audio/*" onChange={e=>setVoiceFile(e.target.files?.[0] || null)} />
        </div>
        <button onClick={uploadVoice} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20">Upload</button>
      </div>

      <div className="mt-6">
        <button onClick={generate} className="px-4 py-3 rounded bg-blue-600 hover:bg-blue-500">Generate Song</button>
      </div>

      <div className="mt-4">
        <strong>Status: </strong> {status}
      </div>

      {trackUrl && (
        <div className="mt-4">
          <p>Track ready — listen below</p>
          <audio controls src={trackUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
