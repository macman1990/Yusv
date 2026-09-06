'use client';

import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/components/providers/app-provider';

export function CustomCursor() {
  const { settings } = useApp();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [videoHover, setVideoHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (settings?.theme?.cursor_enabled === false) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    document.body.classList.add('cursor-none');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement;
      const isLink = target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]');
      const isVideo = target.closest('[data-cursor="video"], .project-card, .video-embed');
      setHovering(!!isLink);
      setVideoHover(!!isVideo);
    };

    const onLeave = () => setVisible(false);

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      setPosition({ x: cursorX, y: cursorY });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('cursor-none');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [settings?.theme?.cursor_enabled]);

  if (settings?.theme?.cursor_enabled === false) return null;

  const size = videoHover ? 80 : hovering ? 48 : 20;

  return (
    <div
      className="pointer-events-none fixed z-[9999] hidden md:flex items-center justify-center transition-[width,height,opacity] duration-300 ease-cinematic"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="rounded-full border transition-all duration-300"
        style={{
          width: '100%',
          height: '100%',
          borderColor: videoHover ? 'hsl(var(--accent))' : 'hsl(var(--foreground) / 0.4)',
          backgroundColor: videoHover ? 'hsl(var(--accent) / 0.1)' : 'transparent',
          backdropFilter: videoHover ? 'blur(2px)' : 'none',
        }}
      >
        {videoHover && (
          <div className="w-full h-full flex items-center justify-center text-[10px] font-mono uppercase tracking-widest text-accent">
            Play
          </div>
        )}
      </div>
    </div>
  );
}
