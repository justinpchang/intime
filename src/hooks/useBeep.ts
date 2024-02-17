// @ts-ignore
import useSound from "use-sound";

interface UseBeepReturn {
  beepUp: () => void;
  beepDown: () => void;
}

export default function useBeep(): UseBeepReturn {
  const soundUp = useSound("/beep-up.wav");
  const soundDown = useSound("/beep-down.wav");

  return {
    beepUp: soundUp[0],
    beepDown: soundDown[0],
  };
}
