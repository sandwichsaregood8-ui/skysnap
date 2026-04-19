"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DiscoveredDevice {
  id: string;
  name?: string;
  signal: number;
  stability: 'Stable' | 'Fair' | 'Weak';
}

export default function ConnectPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<DiscoveredDevice[]>([]);
  const { toast } = useToast();

  const handleScanClick = async () => {
    if (typeof navigator === 'undefined' || !navigator.bluetooth) {
      toast({
        variant: 'destructive',
        title: 'Bluetooth Not Supported',
        description: 'This feature requires a browser with Bluetooth support.',
      });
      return;
    }

    setIsScanning(true);
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      const signal = -Math.floor(Math.random() * 50 + 40);
      let stability: 'Stable' | 'Fair' | 'Weak';
      if (signal > -65) {
          stability = 'Stable';
      } else if (signal > -80) {
          stability = 'Fair';
      } else {
          stability = 'Weak';
      }

      const newDevice: DiscoveredDevice = {
        id: device.id,
        name: device.name || `SkySnap Node #${discoveredDevices.length + 1}`,
        signal,
        stability,
      };

      setDiscoveredDevices(prevDevices => {
        if (prevDevices.some(d => d.id === device.id)) {
            toast({
                variant: 'default',
                title: 'Device Already Added',
                description: `${newDevice.name} is already in the list.`,
            });
          return prevDevices;
        }
        return [...prevDevices, newDevice];
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'NotFoundError') {
        // User cancelled the device picker
      } else {
        console.error('Bluetooth Error:', error);
        toast({
          variant: 'destructive',
          title: 'Scan Error',
          description: 'Could not find devices. Please ensure Bluetooth is enabled and try again.',
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  const getSignalIcon = (stability: 'Stable' | 'Fair' | 'Weak') => {
    switch (stability) {
      case 'Stable':
        return 'signal_cellular_alt';
      case 'Fair':
        return 'signal_cellular_alt_2_bar';
      case 'Weak':
        return 'signal_cellular_alt_1_bar';
      default:
        return 'signal_cellular_off';
    }
  }

  return (
    <div style={{ minHeight: 'max(884px, 100dvh)' }} className="bg-background text-on-background font-body selection:bg-primary/30 flex flex-col" data-mode="connect">
      <header className="fixed top-0 w-full z-50 bg-[#0B1326]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="hover:bg-[#7C3AED]/10 transition-colors active:scale-95 duration-200 p-2 rounded-full">
              <span className="material-symbols-outlined text-[#7C3AED]">arrow_back</span>
            </button>
          </div>
          <button onClick={() => toast({ title: 'Help', description: 'Click "Scan for Devices" and select your SkySnap device from the browser popup.' })} className="hover:bg-[#7C3AED]/10 transition-colors active:scale-95 duration-200 p-2 rounded-full">
            <span className="material-symbols-outlined text-[#7C3AED]">help</span>
          </button>
        </div>
      </header>

      <main className="void-bg pt-20 flex-grow flex flex-col max-w-md mx-auto relative overflow-hidden w-full">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="px-6 pt-4 flex-shrink-0 z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/80">Discovered Nearby</h3>
                {discoveredDevices.length > 0 && (
                    <span className="text-[11px] font-medium text-primary">{discoveredDevices.length} Found</span>
                )}
            </div>
        </div>

        <div className="px-6 flex-grow overflow-y-auto no-scrollbar relative z-10 space-y-4">
            {isScanning && (
                 <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                    <div className="relative mb-5 flex items-center justify-center w-16 h-16">
                        <div className="absolute inset-[-3px] animate-spin rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-surface-bright/20 to-surface-container-highest/40 flex items-center justify-center border border-outline-variant/20 shadow-[0_0_20px_rgba(49,57,78,0.2)]">
                            <span className="material-symbols-outlined text-on-surface text-3xl" data-weight="fill">bluetooth_searching</span>
                        </div>
                    </div>
                    <p className="text-sm text-on-surface-variant/90 font-medium">Searching for devices...</p>
                    <p className="text-xs text-on-surface-variant/60 mt-2">Please select a device from the popup.</p>
                 </div>
            )}
            {!isScanning && discoveredDevices.length === 0 && (
                <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                     <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">bluetooth_disabled</span>
                    <p className="text-sm text-on-surface-variant/70">No devices found.</p>
                    <p className="text-xs text-on-surface-variant/50 mt-1">Click "Scan for Devices" to start.</p>
                </div>
            )}
            {discoveredDevices.map((device) => (
                <div key={device.id} className="glass-card rounded-2xl p-5 flex items-center justify-between group transition-all duration-300 hover:bg-surface-container-high/60 border border-outline-variant/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/15">
                            <span className="material-symbols-outlined text-primary">router</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-on-surface tracking-tight">{device.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className={`material-symbols-outlined text-[14px] ${device.stability === 'Stable' ? 'text-primary' : 'text-on-surface-variant'}`}>{getSignalIcon(device.stability)}</span>
                                <span className={`text-[12px] font-medium ${device.stability === 'Stable' ? 'text-on-surface-variant' : 'text-on-surface-variant/60'}`}>{device.signal} dBm • {device.stability}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => router.push('/dashboard/connect/configure')} className="px-4 py-2 rounded-lg bg-surface-bright/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary hover:text-on-primary transition-all active:scale-95">
                        Connect
                    </button>
                </div>
            ))}
        </div>
        
        <div className="px-6 pb-6 pt-4 relative z-10 flex-shrink-0 mt-auto">
            <p className="text-center text-[12px] text-on-surface-variant/50 leading-relaxed italic mb-4">
                Not seeing your device? Try resetting the power toggle or check the <a href="#" onClick={(e)=>e.preventDefault()} className="text-primary/70 underline decoration-primary/20">troubleshooting guide</a>.
            </p>
            <button onClick={handleScanClick} disabled={isScanning} className="w-full py-4 px-6 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold text-base tracking-widest uppercase shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] hover:brightness-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {isScanning ? 'Scanning...' : 'Scan for Devices'}
            </button>
        </div>
      </main>
    </div>
  );
}
