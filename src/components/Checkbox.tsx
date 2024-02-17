interface Props {
  label: string;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}

export default function Checkbox({ label, isChecked, setIsChecked }: Props) {
  return (
    <div className="flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={label}
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={label} className="font-medium text-gray-900">
          {label}
        </label>
      </div>
    </div>
  );
}
