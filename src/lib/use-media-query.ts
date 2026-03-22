"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    // Sync initial value without triggering the set-state-in-effect rule
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}
