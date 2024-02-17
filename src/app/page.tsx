"use client";

import useTimer from "@/hooks/useTimer";
import { useCallback, useEffect, useState } from "react";
import { formatSecondsForDisplay } from "@/utils/timeUtils";

const WARM_UP_TIME = 3;

enum SetType {
  WarmUp = "warm-up",
  Work = "work",
  Rest = "rest",
}

export default function Home() {
  const [isCreating, setIsCreating] = useState(true);

  // Workout configuration
  const [setCount, setSetCount] = useState(3);
  const [workTimeInSeconds, setWorkTimeInSeconds] = useState(2);
  const [restTimeInSeconds, setRestTimeInSeconds] = useState(3);

  // Settings
  const [shouldSkipLastRest, setShouldSkipLastRest] = useState(true);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(true);
  const [shouldKeepScreenOn, setShouldKeepScreenOn] = useState(true);

  // Workout state
  const [isPaused, setIsPaused] = useState(false);
  const [currentSetType, setCurrentSetType] = useState<SetType | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  // Timer state
  const { totalSecondsElapsed, totalSeconds, start, pause, resume, restart } =
    useTimer();

  const finishWorkout = useCallback(() => {
    if (isCreating) return;
    alert("Workout complete!");
    setIsCreating(true);
  }, [isCreating]);

  // Handle timer expiry at different workout stages
  useEffect(() => {
    if (totalSeconds > 0) return;
    switch (currentSetType) {
      case SetType.WarmUp:
        setCurrentSetType(SetType.Work);
        setCurrentSetIndex(0);
        start(workTimeInSeconds);
        break;
      case SetType.Work:
        if (currentSetIndex === setCount - 1 && shouldSkipLastRest) {
          finishWorkout();
          break;
        }
        setCurrentSetType(SetType.Rest);
        start(restTimeInSeconds);
        break;
      case SetType.Rest:
        if (currentSetIndex === setCount - 1) {
          finishWorkout();
          break;
        }
        setCurrentSetType(SetType.Work);
        setCurrentSetIndex(currentSetIndex + 1);
        start(workTimeInSeconds);
        break;
    }
  }, [
    currentSetIndex,
    currentSetType,
    finishWorkout,
    restTimeInSeconds,
    setCount,
    shouldSkipLastRest,
    start,
    totalSeconds,
    workTimeInSeconds,
  ]);

  const totalWorkoutSeconds =
    setCount * (workTimeInSeconds + restTimeInSeconds) -
    (shouldSkipLastRest ? restTimeInSeconds : 0);
  const totalWorkoutElapsedSeconds =
    currentSetType === SetType.WarmUp
      ? 0
      : currentSetIndex * (workTimeInSeconds + restTimeInSeconds) +
        (currentSetType === SetType.Rest ? workTimeInSeconds : 0) +
        totalSecondsElapsed;
  const totalWorkoutRemainingSeconds =
    totalWorkoutSeconds - totalWorkoutElapsedSeconds;

  if (isCreating) {
    return (
      <div>
        <h1>New workout</h1>
        <label className="block">
          Sets
          <input
            type="number"
            value={setCount}
            onChange={(e) => setSetCount(Number(e.target.value))}
          />
        </label>
        <label className="block">
          Work
          <input
            type="number"
            value={workTimeInSeconds}
            onChange={(e) => setWorkTimeInSeconds(Number(e.target.value))}
          />
        </label>
        <label className="block">
          Rest
          <input
            type="number"
            value={restTimeInSeconds}
            onChange={(e) => setRestTimeInSeconds(Number(e.target.value))}
          />
        </label>
        <label className="block">
          Should skip last rest
          <input
            type="checkbox"
            checked={shouldSkipLastRest}
            onChange={(e) => setShouldSkipLastRest(e.target.checked)}
          />
        </label>
        <label className="block">
          Play audio
          <input
            type="checkbox"
            checked={shouldPlayAudio}
            onChange={(e) => setShouldPlayAudio(e.target.checked)}
          />
        </label>
        <label className="block">
          Keep screen on
          <input
            type="checkbox"
            checked={shouldKeepScreenOn}
            onChange={(e) => setShouldKeepScreenOn(e.target.checked)}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setIsCreating(false);
            setCurrentSetIndex(-1);
            setCurrentSetType(SetType.WarmUp);
            start(WARM_UP_TIME);
          }}
        >
          Start workout {formatSecondsForDisplay(totalWorkoutSeconds)}
        </button>
      </div>
    );
  }

  return (
    <div className="w-80">
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            pause();
            setIsCreating(true);
          }}
        >
          X
        </button>
        <div>
          Remaining: {formatSecondsForDisplay(totalWorkoutRemainingSeconds)}
        </div>
        <button
          type="button"
          onClick={() => setShouldPlayAudio(!shouldPlayAudio)}
        >
          {shouldPlayAudio ? "🔊" : "🔇"}
        </button>
      </div>
      <div>
        <p>
          {currentSetType?.toLocaleUpperCase()} {currentSetIndex + 1}/{setCount}
        </p>
        <p>{formatSecondsForDisplay(totalSeconds)}</p>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            if (
              totalSecondsElapsed > 3 ||
              (currentSetIndex === 0 && currentSetType === SetType.Work)
            ) {
              restart();
            } else {
              switch (currentSetType) {
                case SetType.Rest:
                  setCurrentSetType(SetType.Work);
                  start(workTimeInSeconds);
                  break;
                case SetType.Work:
                  setCurrentSetType(SetType.Rest);
                  setCurrentSetIndex(currentSetIndex - 1);
                  start(restTimeInSeconds);
                  break;
              }
            }
          }}
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          onClick={() => {
            if (isPaused) {
              resume();
              setIsPaused(false);
            } else {
              pause();
              setIsPaused(true);
            }
          }}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              currentSetIndex === setCount - 1 &&
              currentSetType ===
                (shouldSkipLastRest ? SetType.Work : SetType.Rest)
            ) {
              finishWorkout();
              return;
            }
            if (currentSetType === SetType.Work) {
              setCurrentSetType(SetType.Rest);
              start(restTimeInSeconds);
            } else {
              setCurrentSetType(SetType.Work);
              setCurrentSetIndex(currentSetIndex + 1);
              start(workTimeInSeconds);
            }
          }}
          disabled={currentSetIndex === setCount - 1}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}
