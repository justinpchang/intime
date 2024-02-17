// @ts-ignore
import useSound from "use-sound";

interface UseBeepReturn {
  beepUp: () => void;
  beepDown: () => void;
}

export default function useBeep(enabled: boolean): UseBeepReturn {
  const soundUp = useSound("/beep-up.wav");
  const soundDown = useSound("/beep-down.wav");

  return {
    beepUp: enabled ? soundUp[0] : () => {},
    beepDown: enabled ? soundDown[0] : () => {},
  };
}
