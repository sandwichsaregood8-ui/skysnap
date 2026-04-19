"use client"
import { useRouter } from 'next/navigation';

export default function ConnectPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: 'max(884px, 100dvh)' }} className="bg-background text-on-background font-body selection:bg-primary/30" data-mode="connect">
      <header className="fixed top-0 w-full z-50 bg-[#0B1326]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="hover:bg-[#7C3AED]/10 transition-colors active:scale-95 duration-200 p-2 rounded-full">
              <span className="material-symbols-outlined text-[#7C3AED]">arrow_back</span>
            </button>
            <h1 className="text-xl font-extrabold tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-br from-[#D2BBFF] to-[#7C3AED] font-['Plus_Jakarta_Sans']"><br /></h1>
          </div>
          <button className="hover:bg-[#7C3AED]/10 transition-colors active:scale-95 duration-200 p-2 rounded-full">
            <span className="material-symbols-outlined text-[#7C3AED]">help</span>
          </button>
        </div>
      </header>

      <main className="void-bg pt-24 pb-32 px-6 flex flex-col max-w-md mx-auto relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-[120px]"></div>
        <section className="relative z-10 mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-[10px] uppercase tracking-[0.08em] font-bold text-primary">Step 1 of 2</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3 leading-tight">Add a New SkySnap Device</h2>
          <p className="text-on-surface-variant body-md leading-relaxed">
            Make sure your SkySnap device is powered on and nearby.
          </p>
        </section>
        <section className="relative z-10 mb-12">
          <div className="neon-border group">
            <div className="bg-surface-container-lowest rounded-[1.4rem] flex flex-col items-center justify-center text-center p-6">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-surface-bright/10 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-surface-bright/20 to-surface-container-highest/40 flex items-center justify-center border border-outline-variant/20 shadow-[0_0_20px_rgba(49,57,78,0.2)]">
                  <span className="material-symbols-outlined text-on-surface text-3xl" data-weight="fill">bluetooth</span>
                </div>
              </div>
              <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-br from-surface-container-high to-surface-container-highest text-on-surface font-bold text-base tracking-tight border border-outline-variant/20 shadow-lg hover:brightness-110 active:scale-95 transition-all duration-300">
                Scan for Devices
              </button>
            </div>
          </div>
        </section>
        <section className="relative z-10 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/80">Discovered Nearby</h3>
            <span className="text-[11px] font-medium text-primary">2 Found</span>
          </div>
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between group transition-all duration-300 hover:bg-surface-container-high/60 border border-outline-variant/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/15">
                <span className="material-symbols-outlined text-primary">router</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface tracking-tight">SkySnap Node v.4</h4>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">signal_cellular_alt</span>
                  <span className="text-[12px] text-on-surface-variant font-medium">-42 dBm • Stable</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-surface-bright/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary hover:text-on-primary transition-all active:scale-95">
              Connect
            </button>
          </div>
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between group transition-all duration-300 hover:bg-surface-container-high/60 border border-outline-variant/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/15">
                <span className="material-symbols-outlined text-on-surface-variant">router</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface tracking-tight">SkySnap Node v.2</h4>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">signal_cellular_alt_2_bar</span>
                  <span className="text-[12px] text-on-surface-variant/60 font-medium">-78 dBm • Weak</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-surface-bright/10 text-on-surface-variant/80 text-sm font-bold border border-outline-variant/20 hover:bg-surface-container-highest transition-all active:scale-95">
              Connect
            </button>
          </div>
          <div className="pt-4 text-center">
            <p className="text-[12px] text-on-surface-variant/50 leading-relaxed italic">
              Not seeing your device? Try resetting the power toggle or check the <span className="text-primary/70 underline decoration-primary/20">troubleshooting guide</span>.
            </p>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 w-full z-50 bg-[#0B1326]/90 backdrop-blur-2xl rounded-t-2xl border-t border-[#4A4455]/15 shadow-[0_-10px_40px_rgba(124,58,237,0.08)]">
        <div className="flex justify-around items-center h-20 px-4 pb-safe w-full max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center text-[#D2BBFF] bg-[#7C3AED]/20 rounded-xl px-4 py-1 transition-all">
            <span className="material-symbols-outlined" data-weight="fill">settings_input_antenna</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.08em] font-medium mt-1">Setup</span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#CCC3D8]/60 hover:text-[#D2BBFF] transition-all active:scale-90 duration-300 cursor-pointer">
            <span className="material-symbols-outlined">router</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.08em] font-medium mt-1">Devices</span>
          </div>
          <div className="flex flex-col items-center justify-center text-[#CCC3D8]/60 hover:text-[#D2BBFF] transition-all active:scale-90 duration-300 cursor-pointer">
            <span className="material-symbols-outlined">cloud_done</span>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.08em] font-medium mt-1">Cloud</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
