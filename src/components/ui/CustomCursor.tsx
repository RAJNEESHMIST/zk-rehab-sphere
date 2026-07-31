import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

export const CustomCursor: React.FC = () => {
  const { cursorMode, cursorText } = useCursor();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on devices with fine pointer (desktop/laptop)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  const isSpecialMode = cursorMode !== 'default' || Boolean(cursorText);

  return (
    <>
      {/* Outer Follower Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-cyan-400/40 bg-cyan-500/10 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        animate={{
          x: mousePosition.x - (isSpecialMode ? 40 : isHovered ? 28 : 18),
          y: mousePosition.y - (isSpecialMode ? 40 : isHovered ? 28 : 18),
          width: isSpecialMode ? 80 : isHovered ? 56 : 36,
          height: isSpecialMode ? 80 : isHovered ? 56 : 36,
          scale: isHovered ? 1.15 : 1,
          borderColor: isSpecialMode ? 'rgba(56, 189, 248, 0.8)' : isHovered ? 'rgba(6, 182, 212, 0.8)' : 'rgba(6, 182, 212, 0.3)',
          backgroundColor: isSpecialMode ? 'rgba(3, 105, 161, 0.45)' : isHovered ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.05)',
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.5 }}
      >
        {isSpecialMode && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-extrabold uppercase tracking-wider text-white px-2 text-center leading-tight drop-shadow-md"
          >
            {cursorText || cursorMode}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovered ? 0.5 : 1,
          opacity: isSpecialMode ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 900, damping: 40 }}
      />
    </>
  );
};
