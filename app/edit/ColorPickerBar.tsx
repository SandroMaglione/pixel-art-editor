"use client";

import { clamp, lerp } from "@/lib/helpers";
import { ReactElement, useCallback, useState } from "react";

interface ColorPickerBarProps {
  /** 0-100 */
  value: number;
  onValueChange: (value: number) => void;
  style: React.CSSProperties;
}

export default function ColorPickerBar({
  onValueChange,
  style,
  value,
}: ColorPickerBarProps): ReactElement {
  const [isClicking, setIsClicking] = useState(false);
  const [width, setWidth] = useState(0);

  const barValue = lerp(0, width, value);

  const measuredRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  const onUpdateValue = (e: React.TouchEvent<HTMLDivElement>) => {
    const clientX = e.touches[0]?.clientX ?? 0;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percentage = clamp(0, 1)((clientX - left) / (width - left));
    onValueChange(percentage);
  };

  return (
    <div
      ref={measuredRef}
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
          "--x": `${barValue}px`,
          ...style,
        } as React.CSSProperties
      }
    >
      <button className="absolute w-[18px] origin-center rounded-full h-[18px] border-2 border-black left-[-9px] top-[9px] translate-x-[var(--x)]" />
    </div>
  );
}
