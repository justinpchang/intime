"use client";

import useTimer from "@/hooks/useTimer";
import { useCallback, useEffect, useState } from "react";
import { formatSecondsForDisplay } from "@/utils/timeUtils";
import NumberInput from "@/components/NumberInput";
import Checkbox from "@/components/Checkbox";
import { Metadata } from "next";

const WARM_UP_TIME = 3;
const DEFAULT_SET_COUNT = 10;
const DEFAULT_WORK_TIME = 10;
const DEFAULT_REST_TIME = 50;

enum SetType {
  WarmUp = "warm-up",
  Work = "work",
  Rest = "rest",
}

export default function Home() {
  const [isCreating, setIsCreating] = useState(true);

  // Workout configuration
  const [setCount, setSetCount] = useState(DEFAULT_SET_COUNT);
  const [workTimeInSeconds, setWorkTimeInSeconds] = useState(DEFAULT_WORK_TIME);
  const [restTimeInSeconds, setRestTimeInSeconds] = useState(DEFAULT_REST_TIME);

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
      <div className="container h-100 w-96 mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">New workout</h1>
        <NumberInput label="Sets" value={setCount} setValue={setSetCount} />
        <NumberInput
          label="Work"
          value={workTimeInSeconds}
          setValue={setWorkTimeInSeconds}
          type="time"
        />
        <NumberInput
          label="Rest"
          value={restTimeInSeconds}
          setValue={setRestTimeInSeconds}
          type="time"
        />
        <div className="space-y-4 m-2 mb-4">
          <Checkbox
            label="Skip last rest"
            isChecked={shouldSkipLastRest}
            setIsChecked={setShouldSkipLastRest}
          />
          <Checkbox
            label="Play audio"
            isChecked={shouldPlayAudio}
            setIsChecked={setShouldPlayAudio}
          />
          <Checkbox
            label="Keep screen on"
            isChecked={shouldKeepScreenOn}
            setIsChecked={setShouldKeepScreenOn}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setIsCreating(false);
            setCurrentSetIndex(-1);
            setCurrentSetType(SetType.WarmUp);
            start(WARM_UP_TIME);
          }}
          className="w-full flex justify-between bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-4 rounded-2xl"
        >
          <div>Start workout</div>
          <div className="opacity-70">
            {formatSecondsForDisplay(totalWorkoutSeconds)}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="container h-screen flex flex-col justify-between mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => {
            pause();
            setIsCreating(true);
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          X
        </button>
        <div className="flex flex-col justify-center items-center">
          <div className="font-bold opacity-70">REMAINING</div>
          <div>{formatSecondsForDisplay(totalWorkoutRemainingSeconds)}</div>
        </div>
        <button
          type="button"
          onClick={() => setShouldPlayAudio(!shouldPlayAudio)}
          className="bg-gray-200 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded"
        >
          {shouldPlayAudio ? "🔊" : "🔇"}
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-lg font-bold">
          {currentSetType?.toLocaleUpperCase()} {currentSetIndex + 1}/{setCount}
        </p>
        <p className="text-8xl">{formatSecondsForDisplay(totalSeconds)}</p>
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
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
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
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
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
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}
