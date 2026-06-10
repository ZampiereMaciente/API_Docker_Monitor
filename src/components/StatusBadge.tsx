type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const isRunning = status === "running";

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium
        ${
          isRunning
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
      `}
    >
      {status}
    </span>
  );
}