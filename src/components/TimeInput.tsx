import {
  formatSecondsForDisplay,
  getSecondsFromHHMMSS,
} from "@/utils/timeUtils";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";

interface Props {
  value: number;
  setValue: (value: number) => void;
  className?: string;
}

export default function TimeInput({ value, setValue, className }: Props) {
  const [timeStringValue, setTimeStringValue] = useState<string>(
    formatSecondsForDisplay(value)
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(getSecondsFromHHMMSS(timeStringValue));
  }, [setValue, timeStringValue]);

  useEffect(() => {
    if (isFocused) return;
    setTimeStringValue(formatSecondsForDisplay(value));
  }, [isFocused, value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeStringValue(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const seconds = Math.max(0, getSecondsFromHHMMSS(value));
    const time = formatSecondsForDisplay(seconds);
    setTimeStringValue(time);
    setIsFocused(false);
  };

  return (
    <input
      type="text"
      value={timeStringValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
}
