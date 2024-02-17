import IconButton from "./IconButton";
import TimeInput from "./TimeInput";

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

  const inputClassName =
    "text-center outline-none font-bold text-4xl min-w-0 flex-grow-1";
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
    <label className="flex flex-col items-center mb-4 pt-2 rounded-xl border border-grey-50 font-semibold text-xs text-center text-gray-500">
      {label.toUpperCase()}
      <div className="mt-[-4px] w-full flex items-center text-black">
        <IconButton
          icon="&ndash;"
          onClick={() => setValue(Math.max(min, value - increment))}
        />
        {input}
        <IconButton icon="+" onClick={() => setValue(value + increment)} />
      </div>
    </label>
  );
}
