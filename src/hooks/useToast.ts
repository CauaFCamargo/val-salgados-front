import { useState, useRef, useCallback, useEffect } from "react";

// Aviso rápido que some sozinho após `duration` ms.
export function useToast(duration = 1800) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (text: string) => {
      setMessage(text);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(""), duration);
    },
    [duration]
  );

  // Limpa o timer se o componente desmontar.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { message, showToast };
}
