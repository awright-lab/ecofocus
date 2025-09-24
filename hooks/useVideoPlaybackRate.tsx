import { useEffect, RefObject } from "react";

export function useVideoPlaybackRate(ref: RefObject<HTMLVideoElement>, rate: number) {
  useEffect(() => {
    const el = ref.current;                  // capture once
    if (!el) return;

    const apply = () => { el.playbackRate = rate; };

    apply();
    el.addEventListener("loadedmetadata", apply);
    el.addEventListener("canplay", apply);   // helps Safari/iOS

    return () => {
      el.removeEventListener("loadedmetadata", apply);
      el.removeEventListener("canplay", apply);
    };
  }, [ref, rate]);
}
