import {
  formatSecondsForDisplay,
  getSecondsFromHHMMSS,
} from "@/utils/timeUtils";
import IconButton from "./IconButton";
import TimeInput from "./TimeInput";
import { useEffect, useState } from "react";

interface Props {
  label: string;
  value: number;
  setValue: (value: number) => void;
  type?: "number" | "time";
}

export default function NumberInput({
  label,
  value,
  setValue,
  type = "number",
}: Props) {
  const increment = type === "number" ? 1 : 10;
  const min = type === "number" ? 1 : 0;

  const inputClassName = "text-center outline-none font-bold text-2xl w-40";
  const input =
    type === "number" ? (
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className={inputClassName}
        style={{ MozAppearance: "textfield" }}
      />
    ) : (
      <TimeInput value={value} setValue={setValue} className={inputClassName} />
    );

  return (
    <label className="flex flex-col w-fit items-center font-semibold text-sm text-center text-gray-500">
      {label.toUpperCase()}
      <div className="mb-4 flex items-center text-black">
        <IconButton
          icon="-"
          onClick={() => setValue(Math.max(min, value - increment))}
        />
        {input}
        <IconButton icon="+" onClick={() => setValue(value + increment)} />
      </div>
    </label>
  );
}
