import { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Snowfall({ count = 50 }) {

  const { isDark } = useTheme();

  const snowflakes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`, // 10s to 20s for slower, gentle fall
      animationDelay: `-${Math.random() * 20}s`, // Negative delay so they are already falling when loaded
      opacity: Math.random() * 0.4 + 0.2, // 0.2 to 0.6
      size: `${Math.random() * 5 + 3}px`, // 3px to 8px
      horizontalDrift: Math.random() > 0.5 ? 1 : -1,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            backgroundColor: isDark ? '#FFFFFF' : '#4A4DC9', // white in dark mode, primary blue in light mode
            animation: `snowfall-${flake.horizontalDrift > 0 ? 'right' : 'left'} ${flake.animationDuration} linear infinite`,
            animationDelay: flake.animationDelay,
            top: '-20px',
          }}
        />
      ))}
    </div>
  );
}
