'use client';

import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/components/providers/app-provider';

export function CustomCursor() {
  const { settings } = useApp();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [videoHover, setVideoHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const enabled = settings?.theme?.cursor_enabled !== false;
    const supportsHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!enabled || !supportsHover) {
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
      document.body.classList.remove('cursor-none');
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setVisible(false);
      return;
    }

    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
    document.body.classList.add('cursor-none');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setVisible(true);

      const target = event.target as HTMLElement | null;
      const isLink = !!target?.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]');
      const isVideo = !!target?.closest('[data-cursor="video"], .project-card, .video-embed');
      setHovering(isLink);
      setVideoHover(isVideo);
    };

    const onLeave = () => setVisible(false);
    const onBlur = () => setVisible(false);

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      setPosition({ x: cursorX, y: cursorY });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onBlur);
    document.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
      document.body.classList.remove('cursor-none');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [settings?.theme?.cursor_enabled]);

  if (settings?.theme?.cursor_enabled === false) return null;

  const size = videoHover ? 72 : hovering ? 42 : 18;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999] hidden md:flex items-center justify-center transition-[width,height,opacity] duration-300 ease-cinematic"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        opacity: visible ? 1 : 0,
        filter: 'drop-shadow(0 0 18px rgba(var(--accent-rgb), 0.28))',
      }}
    >
      <div
        className="rounded-full border transition-all duration-300"
        style={{
          width: '100%',
          height: '100%',
          borderColor: videoHover ? 'hsl(var(--accent))' : 'hsl(var(--foreground) / 0.5)',
          backgroundColor: videoHover ? 'hsl(var(--accent) / 0.12)' : 'rgba(255,255,255,0.06)',
          borderWidth: videoHover ? 1.5 : 1,
          boxShadow: hovering ? '0 0 0 1px hsl(var(--accent) / 0.28)' : 'none',
          backdropFilter: 'blur(2px)',
        }}
      >
        {videoHover && (
          <div className="w-full h-full flex items-center justify-center text-[8px] font-medium uppercase tracking-[0.2em] text-accent">
            {settings?.theme?.default_theme === 'ar' ? 'مشاهدة' : 'Play'}
          </div>
        )}
      </div>
    </div>
  );
}
