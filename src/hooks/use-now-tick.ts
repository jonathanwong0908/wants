import { useEffect, useState } from "react";
import { AppState } from "react-native";

/** Keeps `now` fresh for countdown copy and notifyAt section splits. */
export function useNowTick(intervalMs = 60_000) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), intervalMs);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setNowMs(Date.now());
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [intervalMs]);

  return nowMs;
}
