import { useRef, useState } from "react";
import type {
  DragEvent as ReactDragEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";

const DRAG_START_THRESHOLD_PX = 6;
const CLICK_SUPPRESSION_WINDOW_MS = 180;

interface HorizontalDragScrollBindings {
  containerRef: RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerLeave: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onClickCapture: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onDragStart: (event: ReactDragEvent<HTMLDivElement>) => void;
}

export const useHorizontalDragScroll = (): HorizontalDragScrollBindings => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const activePointerIdRef = useRef<number | null>(null);
  const startClientXRef = useRef(0);
  const startClientYRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const suppressClickUntilMsRef = useRef(0);

  const resetPointerSession = (
    event: ReactPointerEvent<HTMLDivElement>,
    suppressClick: boolean
  ): void => {
    if (event.pointerType === "mouse" && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (suppressClick) {
      suppressClickUntilMsRef.current = Date.now() + CLICK_SUPPRESSION_WINDOW_MS;
    }

    activePointerIdRef.current = null;
    hasDraggedRef.current = false;
    setIsDragging(false);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const containerElement = containerRef.current;
    if (!containerElement) {
      return;
    }

    activePointerIdRef.current = event.pointerId;
    startClientXRef.current = event.clientX;
    startClientYRef.current = event.clientY;
    startScrollLeftRef.current = containerElement.scrollLeft;
    hasDraggedRef.current = false;
    suppressClickUntilMsRef.current = 0;
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    const containerElement = containerRef.current;
    if (!containerElement) {
      return;
    }

    const deltaX = event.clientX - startClientXRef.current;
    const deltaY = event.clientY - startClientYRef.current;

    if (!hasDraggedRef.current) {
      const horizontalDistance = Math.abs(deltaX);
      const verticalDistance = Math.abs(deltaY);

      if (horizontalDistance < DRAG_START_THRESHOLD_PX) {
        return;
      }

      if (horizontalDistance <= verticalDistance) {
        return;
      }

      hasDraggedRef.current = true;
      setIsDragging(true);

      // Solo capturamos cuando realmente hay drag para no romper clicks normales en botones hijos.
      if (event.pointerType === "mouse" && !event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    event.preventDefault();
    containerElement.scrollLeft = startScrollLeftRef.current - deltaX;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    resetPointerSession(event, hasDraggedRef.current);
  };

  const onPointerCancel = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    resetPointerSession(event, false);
  };

  const onPointerLeave = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.pointerType !== "mouse") {
      return;
    }

    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      resetPointerSession(event, hasDraggedRef.current);
    }
  };

  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (Date.now() >= suppressClickUntilMsRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const onDragStart = (event: ReactDragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  return {
    containerRef,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onClickCapture,
    onDragStart,
  };
};
