const formatTimeForDisplay = (num: number) =>
  num.toLocaleString("en-US", { minimumIntegerDigits: 2 });

export const formatSecondsForDisplay = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${formatTimeForDisplay(minutes)}:${formatTimeForDisplay(
    remainingSeconds
  )}`;
};
