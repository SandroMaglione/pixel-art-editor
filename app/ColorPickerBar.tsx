"use client";
import { clamp, lerp } from "@/lib/helpers";
import { ReactElement, useState } from "react";

interface ColorPickerBarProps {
  onValueChange: (percentage: number) => void;
  style: React.CSSProperties;
}

export default function ColorPickerBar({
  onValueChange,
  style,
}: ColorPickerBarProps): ReactElement {
  const [isClicking, setIsClicking] = useState(false);
  const [value, setValue] = useState(0);
  const onUpdateValue = (e: React.TouchEvent<HTMLDivElement>) => {
    const clientX = e.touches[0].clientX;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percentage = clamp(0, 1)((clientX - left) / (width - left));
    setValue(lerp(0, width, percentage));
    onValueChange(percentage);
  };

  return (
    <div
      onTouchEnd={() => setIsClicking(false)}
      onTouchStart={(e) => {
        setIsClicking(true);
        onUpdateValue(e);
      }}
      onTouchMove={(e) => {
        if (isClicking) {
          onUpdateValue(e);
        }
      }}
      className="w-full h-[36px] relative overflow-hidden"
      style={
        {
          "--x": `${value}px`,
          ...style,
        } as React.CSSProperties
      }
    >
      <button className="absolute w-[18px] origin-center rounded-full h-[18px] border-2 border-black left-[-9px] top-[9px] translate-x-[var(--x)]" />
    </div>
  );
}
