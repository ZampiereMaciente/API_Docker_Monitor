type Props = {
  title: string;
  value: number;
  color: "emerald" | "amber" | "red";
};

const colorMap = {
  emerald: {
    border: "border-emerald-500/20",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    glow: "shadow-emerald-500/10",
  },

  amber: {
    border: "border-amber-500/20",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/10",
  },

  red: {
    border: "border-red-500/20",
    text: "text-red-300",
    bg: "bg-red-500/10",
    glow: "shadow-red-500/10",
  },
};

export default function DashboardCard({
  title,
  value,
  color,
}: Props) {

  const styles = colorMap[color];

  return (
    <div
      className={`
        bg-white/5
        backdrop-blur-xl
        border
        ${styles.border}
        rounded-3xl
        p-6
        shadow-2xl
        ${styles.glow}
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:bg-white/[0.07]
      `}
    >

      <div
        className={`
          inline-flex
          px-3
          py-1
          rounded-full
          text-sm
          font-medium
          ${styles.bg}
          ${styles.text}
        `}
      >
        {title}
      </div>

      <p
        className={`
          text-5xl
          font-bold
          mt-6
          tracking-tight
          ${styles.text}
        `}
      >
        {value}
      </p>

    </div>
  );
}