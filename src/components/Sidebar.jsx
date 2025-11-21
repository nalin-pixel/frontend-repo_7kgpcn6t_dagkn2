import { useEffect, useState } from 'react';

export default function Sidebar({ backend, onLoadPreset, onPickHistory }) {
  const [presets, setPresets] = useState([]);
  const [history, setHistory] = useState([]);

  const load = async () => {
    const p = await fetch(`${backend}/api/presets`).then(r=>r.json());
    const h = await fetch(`${backend}/api/history`).then(r=>r.json());
    setPresets(p.items || []);
    setHistory(h.items || []);
  }

  useEffect(() => { load(); }, [backend]);

  return (
    <aside className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
        <h3 className="text-sm uppercase tracking-wider text-white/60">Presets</h3>
        <div className="mt-3 space-y-2 max-h-64 overflow-auto">
          {presets.map(p => (
            <button key={p._id} onClick={()=>onLoadPreset?.(p)} className="block w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10">
              {p.title}
            </button>
          ))}
          {!presets.length && <p className="text-white/50 text-sm">No presets yet</p>}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
        <h3 className="text-sm uppercase tracking-wider text-white/60">History</h3>
        <div className="mt-3 space-y-2 max-h-64 overflow-auto">
          {history.map(h => (
            <button key={h._id} onClick={()=>onPickHistory?.(h)} className="block w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10">
              {h.prompt?.slice(0, 40) || 'Untitled'}
            </button>
          ))}
          {!history.length && <p className="text-white/50 text-sm">No history yet</p>}
        </div>
      </div>
    </aside>
  );
}
