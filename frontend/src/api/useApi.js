import { useCallback, useEffect, useState } from "react";
import { apiRequest, DATA_CHANGED } from "./client";
export function useApi(path, { poll = 30000 } = {}) {
  const [state, setState] = useState({ path: null, data: null, loading: true, error: "" });
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(value => value + 1), []);
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    let active = false;
    const run = async () => {
      if (active) return;
      active = true;
      setState(previous => ({ ...previous, loading: previous.path !== path || !previous.data, error: "" }));
      try {
        const data = await apiRequest(path, { signal: controller.signal });
        if (!controller.signal.aborted) setState({ path, data, loading: false, error: "" });
      } catch (error) {
        if (!controller.signal.aborted) setState({ path, data: null, loading: false, error: error.message });
      } finally { active = false; }
    };
    const onVisible = () => { if (!document.hidden) run(); };
    const onStorage = event => { if (event.key === "apiDataChangedAt") run(); };
    run();
    window.addEventListener("focus", onVisible);
    window.addEventListener(DATA_CHANGED, run);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);
    const timer = poll ? setInterval(onVisible, poll) : null;
    return () => {
      controller.abort();
      clearInterval(timer);
      window.removeEventListener("focus", onVisible);
      window.removeEventListener(DATA_CHANGED, run);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [path, poll, version]);
  return { ...(state.path === path ? state : { data: null, loading: Boolean(path), error: "" }), refresh };
}
