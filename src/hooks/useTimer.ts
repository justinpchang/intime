import { useState } from "react";
import { useTimer as useTimerBase } from "react-timer-hook";

interface UseTimerReturn {
  totalSecondsElapsed: number;
  totalSeconds: number;
  start: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
}

export default function useTimer(): UseTimerReturn {
  const [durationInSeconds, setDurationInSeconds] = useState(0);

  const {
    totalSeconds,
    isRunning,
    pause,
    resume,
    restart: restartBase,
  } = useTimerBase({
    autoStart: true,
    expiryTimestamp: new Date(),
  });

  const start = (seconds: number) => {
    // Save seconds so that we can restart this timer
    setDurationInSeconds(seconds);

    const now = new Date();
    now.setSeconds(now.getSeconds() + seconds);

    restartBase(now, true);
  };

  const restart = () => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + durationInSeconds);

    restartBase(now, true);
  };

  return {
    totalSecondsElapsed: durationInSeconds - totalSeconds,
    totalSeconds,
    start,
    pause,
    resume,
    restart,
  };
}
