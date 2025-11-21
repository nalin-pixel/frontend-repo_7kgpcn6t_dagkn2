import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow">AI Music Studio</h1>
        <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl mx-auto">
          Suno-inspired interface for text-to-music, video generation, stems, MIDI, mastering, and more.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/40 to-slate-900" />
    </section>
  );
}
