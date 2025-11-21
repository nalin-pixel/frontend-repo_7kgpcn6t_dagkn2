import { useEffect, useRef, useState } from 'react';

export default function Player({ src }) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.currentTime);
    const onLoaded = () => setDuration(a.duration || 0);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onLoaded);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onLoaded);
    }
  }, []);

  useEffect(() => { setProgress(0); setPlaying(false); }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); } else { a.pause(); setPlaying(false); }
  }

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <audio ref={audioRef} src={src} />
      <div className="flex items-center gap-3">
        <button onClick={toggle} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white">
          {playing ? 'Pause' : 'Play'}
        </button>
        <div className="flex-1 h-2 bg-white/10 rounded overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="w-24 text-right text-white/70 text-sm">
          {Math.floor(progress)}s / {Math.floor(duration)}s
        </div>
        {src && (
          <a download href={src} className="ml-2 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Download</a>
        )}
      </div>
    </div>
  );
}
