import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type FreeElementData = {
  id: string;
  type: "text" | "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
  locked?: boolean;
  props?: {
    text?: string;
    fontSize?: number;
    color?: string;
    align?: "left" | "center" | "right";
    bg?: string;
    radius?: number;
    border?: string;
    opacity?: number;
    src?: string;
  };
};

type Props = {
  data: FreeElementData;
  selected: boolean;
  zoom: number;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<FreeElementData>) => void;
  gridSize?: number;
  onDragStateChange?: (state: "start" | "move" | "end", payload: { id: string; x: number; y: number; width: number; height: number }) => void;
};

const snap = (value: number, grid: number) => Math.round(value / grid) * grid;

export default function FreeElement({ data, selected, zoom, onSelect, onChange, gridSize = 8, onDragStateChange }: Props) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<null | string>(null);
  const [rotating, setRotating] = useState(false);
  const startRef = useRef<{ mx: number; my: number; x: number; y: number; w: number; h: number; angle?: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (data.locked) return;
    onSelect(data.id);
    setDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    startRef.current = { mx: e.clientX, my: e.clientY, x: data.x, y: data.y, w: data.width, h: data.height };
    onDragStateChange?.("start", { id: data.id, x: data.x, y: data.y, width: data.width, height: data.height });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const dx = (e.clientX - startRef.current.mx) / zoom;
    const dy = (e.clientY - startRef.current.my) / zoom;
    if (dragging) {
      const nx = snap(startRef.current.x + dx, gridSize);
      const ny = snap(startRef.current.y + dy, gridSize);
      onChange(data.id, { x: nx, y: ny });
      onDragStateChange?.("move", { id: data.id, x: nx, y: ny, width: data.width, height: data.height });
    }
    if (resizing) {
      let w = startRef.current.w;
      let h = startRef.current.h;
      let x = startRef.current.x;
      let y = startRef.current.y;
      if (resizing.includes("e")) w = Math.max(32, snap(startRef.current.w + dx, gridSize));
      if (resizing.includes("s")) h = Math.max(32, snap(startRef.current.h + dy, gridSize));
      if (resizing.includes("w")) {
        const nw = Math.max(32, snap(startRef.current.w - dx, gridSize));
        x = snap(startRef.current.x + (startRef.current.w - nw), gridSize);
        w = nw;
      }
      if (resizing.includes("n")) {
        const nh = Math.max(32, snap(startRef.current.h - dy, gridSize));
        y = snap(startRef.current.y + (startRef.current.h - nh), gridSize);
        h = nh;
      }
      onChange(data.id, { x, y, width: w, height: h });
      onDragStateChange?.("move", { id: data.id, x, y, width: w, height: h });
    }
    if (rotating && nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const raw = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      const base = startRef.current.angle ?? (data.rotation || 0);
      const rotation = Math.round(raw);
      onChange(data.id, { rotation });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    setResizing(null);
    if (rotating) setRotating(false);
    startRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    onDragStateChange?.("end", { id: data.id, x: data.x, y: data.y, width: data.width, height: data.height });
  };

  const startResize = (dir: string) => (e: React.PointerEvent) => {
    if (data.locked) return;
    e.stopPropagation();
    onSelect(data.id);
    setResizing(dir);
    (e.target as Element).setPointerCapture(e.pointerId);
    startRef.current = { mx: e.clientX, my: e.clientY, x: data.x, y: data.y, w: data.width, h: data.height };
  };

  const style: React.CSSProperties = {
    position: "absolute",
    left: data.x,
    top: data.y,
    width: data.width,
    height: data.height,
    transform: `rotate(${data.rotation || 0}deg)`,
    zIndex: data.zIndex || 1,
    opacity: data.props?.opacity ?? 1,
  };

  const content = (() => {
    if (data.type === "text") {
      return (
        <div
          className="w-full h-full flex items-center justify-center px-2"
          style={{
            color: data.props?.color || "hsl(var(--foreground))",
            fontSize: data.props?.fontSize || 24,
            textAlign: data.props?.align || "center",
          }}
        >
          {data.props?.text || "Text"}
        </div>
      );
    }
    if (data.type === "shape") {
      return (
        <div
          className="w-full h-full"
          style={{
            background: data.props?.bg || "hsl(var(--card))",
            borderRadius: (data.props?.radius ?? 8) + "px",
            border: data.props?.border || "1px solid hsl(var(--border))",
          }}
        />
      );
    }
    if (data.type === "image") {
      return (
        <img
          src={data.props?.src || "/placeholder.svg"}
          alt="element"
          className="w-full h-full object-cover rounded"
          draggable={false}
        />
      );
    }
    return null;
  })();

  return (
    <div
      ref={nodeRef}
      className={cn("group", selected ? "ring-2 ring-primary" : "")}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {content}
      {!data.locked && (
        <>
          {/* rotation handle */}
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              setRotating(true);
              (e.target as Element).setPointerCapture?.(e.pointerId);
              startRef.current = { mx: e.clientX, my: e.clientY, x: data.x, y: data.y, w: data.width, h: data.height, angle: data.rotation || 0 };
            }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border border-border opacity-0 group-hover:opacity-100 cursor-crosshair"
            title="Rotate"
          />
          {/* resize handles */}
          {(["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const).map((dir) => (
            <div
              key={dir}
              onPointerDown={startResize(dir)}
              className={cn(
                "absolute w-2.5 h-2.5 bg-background border border-border rounded-sm opacity-0 group-hover:opacity-100",
                dir === "n" && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
                dir === "s" && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
                dir === "e" && "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-e-resize",
                dir === "w" && "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-w-resize",
                dir === "ne" && "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
                dir === "nw" && "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
                dir === "se" && "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-se-resize",
                dir === "sw" && "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
              )}
            />
          ))}
        </>
      )}
    </div>
  );
}


