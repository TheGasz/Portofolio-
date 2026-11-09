import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { createSfxEngine } from "./sfxEngine.js";

const defaultFallbackEngine = createSfxEngine();

const SfxContext = createContext({
  play: (name, opts) => defaultFallbackEngine.play(name, opts),
  isSfxEnabled: true,
  toggleSfx: () => defaultFallbackEngine.setEnabled(!defaultFallbackEngine.isEnabled),
  setSfxVolume: (v) => defaultFallbackEngine.setVolume(v),
  unlockSfx: () => defaultFallbackEngine.unlock(),
  sfxVolume: 0.75,
  sfxEngine: defaultFallbackEngine,
});

const STORAGE_KEY_ENABLED = "bagas.sfx.enabled";
const STORAGE_KEY_VOLUME = "bagas.sfx.volume";

const readStorage = (key, fallback) => {
  if (typeof window === "undefined" || !window.localStorage) return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, val) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore quota/private mode errors
  }
};

export const SfxProvider = ({ children, onDuckAmbient }) => {
  const [isSfxEnabled, setIsSfxEnabled] = useState(true);
  const [sfxVolume, setSfxVolumeState] = useState(() => {
    const stored = readStorage(STORAGE_KEY_VOLUME, 0.75);
    return stored <= 0.25 ? 0.75 : stored;
  });

  const engineRef = useRef(null);

  if (!engineRef.current) {
    engineRef.current = createSfxEngine({ onDuckAmbient });
    engineRef.current.setEnabled(isSfxEnabled);
    engineRef.current.setVolume(sfxVolume);
  }

  const unlockSfx = useCallback(async () => {
    if (engineRef.current) {
      return engineRef.current.unlock();
    }
    return true;
  }, []);

  const play = useCallback((name, opts) => {
    if (!engineRef.current) return false;
    return engineRef.current.play(name, opts);
  }, []);

  const toggleSfx = useCallback(() => {
    setIsSfxEnabled((prev) => {
      const next = !prev;
      writeStorage(STORAGE_KEY_ENABLED, next);
      if (engineRef.current) {
        engineRef.current.setEnabled(next);
      }
      return next;
    });
  }, []);

  const setSfxVolume = useCallback((val) => {
    const next = Math.max(0, Math.min(1, Number(val) || 0));
    setSfxVolumeState(next);
    writeStorage(STORAGE_KEY_VOLUME, next);
    if (engineRef.current) {
      engineRef.current.setVolume(next);
    }
  }, []);

  useEffect(() => {
    // Autoplay policy: unlock on first user gesture or mouse movement
    const handleGesture = () => {
      unlockSfx();
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("pointermove", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      window.removeEventListener("click", handleGesture);
    };

    window.addEventListener("pointerdown", handleGesture, { passive: true });
    window.addEventListener("pointermove", handleGesture, { passive: true, once: true });
    window.addEventListener("keydown", handleGesture, { passive: true });
    window.addEventListener("click", handleGesture, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("pointermove", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      window.removeEventListener("click", handleGesture);
    };
  }, [unlockSfx]);

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
        engineRef.current = null;
      }
    };
  }, []);

  const contextValue = {
    play,
    isSfxEnabled,
    toggleSfx,
    setSfxVolume,
    unlockSfx,
    sfxVolume,
    sfxEngine: engineRef.current,
  };

  return (
    <SfxContext.Provider value={contextValue}>{children}</SfxContext.Provider>
  );
};

export const useSfx = () => {
  return useContext(SfxContext);
};
