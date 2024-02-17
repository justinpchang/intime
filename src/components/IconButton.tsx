interface Props {
  icon: string; // TODO: (justinpchang) Update to react-icons
  onClick: () => void;
}

export default function IconButton({ icon, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="border border-gray-300 rounded px-4 py-2 text-2xl"
    >
      {icon}
    </button>
  );
}
