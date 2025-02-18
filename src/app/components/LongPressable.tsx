// src/app/components/LongPressable.tsx
"use client";
import { useRef, useCallback, ReactNode } from "react";

type LongPressableProps = {
  onLongPress: () => void;
  onClick: () => void;
  delay?: number;
  children: ReactNode;
};

export default function LongPressable({
  onLongPress,
  onClick,
  delay = 600,
  children,
}: LongPressableProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);

  const start = useCallback(
    () => {
      // Reset flag at the start.
      longPressTriggered.current = false;
      timeoutRef.current = setTimeout(() => {
        onLongPress();
        longPressTriggered.current = true;
        timeoutRef.current = null;
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Only call onClick if long press didn't trigger.
      if (!longPressTriggered.current) {
        onClick();
      }
    },
    [onClick]
  );

  return (
    <div
      onMouseDown={start}
      onTouchStart={start}
      onMouseUp={clear}
      onTouchEnd={clear}
      onMouseLeave={() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }}
    >
      {children}
    </div>
  );
}