interface Props {
  icon: string; // TODO: (justinpchang) Update to react-icons
  onClick: () => void;
}

export default function IconButton({ icon, onClick }: Props) {
  return (
    <button onClick={onClick} className="rounded px-4 py-2 text-3xl">
      {icon}
    </button>
  );
}
