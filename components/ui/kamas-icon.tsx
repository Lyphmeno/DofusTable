import { cn } from "@/lib/utils/cn";

type KamasIconProps = {
  className?: string;
};

export const KamasIcon = ({ className }: KamasIconProps) => {
  return (
    <img
      alt="Kamas"
      className={cn(
        "inline-block h-4 w-4 shrink-0 object-contain",
        className
      )}
      src="/assets/kama.png"
    />
  );
};
