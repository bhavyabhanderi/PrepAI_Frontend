import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

/**
 * useAuth - Access auth state from Redux
 */
export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  return auth;
};

/**
 * useDebounce - Debounce a value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useMediaQuery - Responsive breakpoint hook
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

/**
 * useLocalStorage - State persisted in localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
};

/**
 * useClickOutside - Detect clicks outside an element
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

/**
 * useTimer - Countdown/count-up timer
 */
export const useTimer = (initialTime = 0, countDown = false) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (countDown && prev <= 0) {
            // Stop the timer on the next tick so it never undershoots zero.
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return countDown ? prev - 1 : prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, countDown]);

  return { time, isRunning, start, stop, reset };
};

/**
 * useCopyGuard - Refuse clipboard access while a test or interview is running.
 *
 * Blocks copy/cut/paste, right-click and text drags, and marks <html> so the
 * lockdown CSS can suppress selection. Editable fields keep their caret, so a
 * candidate can still type and revise answers -- what stops is text crossing
 * the clipboard boundary in either direction.
 *
 * Client-side only: it deters casual copying, it is not a security boundary.
 */
export const useCopyGuard = (enabled) => {
  useEffect(() => {
    if (!enabled) return;

    // A held-down Ctrl+C repeats keydown; warn once per burst, not per event.
    let lastWarnedAt = 0;
    const warn = () => {
      const now = Date.now();
      if (now - lastWarnedAt < 2000) return;
      lastWarnedAt = now;
      toast.error('Copying and pasting are disabled during the interview.');
    };

    const block = (event) => {
      event.preventDefault();
      warn();
    };

    const blockShortcut = (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      if (!event.key) return;
      if (['c', 'x', 'v'].includes(event.key.toLowerCase())) block(event);
    };

    // Capture phase: Monaco and other editors handle these on their own nodes,
    // so we have to win before the event reaches them.
    const opts = { capture: true };
    const events = ['copy', 'cut', 'paste', 'contextmenu', 'dragstart'];
    events.forEach((name) => document.addEventListener(name, block, opts));
    document.addEventListener('keydown', blockShortcut, opts);
    document.documentElement.classList.add('interview-lockdown');

    return () => {
      events.forEach((name) => document.removeEventListener(name, block, opts));
      document.removeEventListener('keydown', blockShortcut, opts);
      document.documentElement.classList.remove('interview-lockdown');
    };
  }, [enabled]);
};

/**
 * useTabSwitchGuard - End a test or interview when the candidate leaves the tab.
 *
 * Fires `onLeave` once, the first time the document becomes hidden -- switching
 * tabs, minimising the window, or locking the screen. It deliberately ignores
 * window `blur`, which also fires for autofill dropdowns, file pickers and
 * devtools, and would end an interview a candidate never actually left.
 *
 * Client-side only: a determined candidate can disable it, so treat it as a
 * deterrent and record the outcome server-side.
 */
export const useTabSwitchGuard = (enabled, onLeave) => {
  const onLeaveRef = useRef(onLeave);
  const hasFiredRef = useRef(false);

  // Track the latest callback without resubscribing on every render.
  useEffect(() => {
    onLeaveRef.current = onLeave;
  }, [onLeave]);

  useEffect(() => {
    if (!enabled) {
      hasFiredRef.current = false;
      return;
    }

    const handleVisibilityChange = () => {
      // Ending is destructive and async, so never let a second event re-enter it.
      if (!document.hidden || hasFiredRef.current) return;
      hasFiredRef.current = true;
      onLeaveRef.current?.();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled]);
};

/**
 * Breakpoint hooks. These mirror Tailwind's default breakpoints exactly, so
 * `useIsDesktop()` flipping and a `lg:` class applying always happen together.
 * Anything that gates layout on JS must use these, never an ad-hoc query.
 */

/** Phones: below Tailwind `md` (768px) */
export const useIsMobile = () => useMediaQuery('(max-width: 767.98px)');

/** Tablets: `md` up to just below `lg` (768px - 1023px) */
export const useIsTablet = () =>
  useMediaQuery('(min-width: 768px) and (max-width: 1023.98px)');

/** Docked-sidebar territory: Tailwind `lg` and up (1024px+) */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

/** True whenever the sidebar behaves as an overlay drawer (below `lg`) */
export const useIsDrawerLayout = () => useMediaQuery('(max-width: 1023.98px)');

/** Respect the user's reduced-motion preference */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
