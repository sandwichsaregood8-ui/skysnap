"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function SetupButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/connect');
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full h-[200px] rounded-[28px] text-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 border-outline-variant/30 bg-surface-container-low"
    >
      <Plus className="h-10 w-10" />
      <span>Set up or add new device</span>
    </Button>
  );
}
