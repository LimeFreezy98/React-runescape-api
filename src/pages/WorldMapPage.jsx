import { useState, useRef } from "react";

export default function WorldMapPage() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: -1931, y: 305 });
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 4));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.6));

  const reset = () => {
    setScale(1);
    setPosition({ x: -1931, y: 305 });
  };

  const fullmap = () => {
    setScale(0.1);
    setPosition({ x: 0, y: 0 });
  };

  const onMouseDown = (e) => {
    setDragging(true);
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y
    });
  };

  const onMouseUp = () => setDragging(false);

  return (
    <div style={{ padding: 20 }}>
      <h1>OSRS World Map</h1>

      {/* CONTROLS */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut} style={{ marginLeft: 6 }}>-</button>
        <button onClick={reset} style={{ marginLeft: 6 }}>Reset</button>
        <button onClick={fullmap} style={{ marginLeft: 6 }}>Full map detail</button>
      </div>

      {/* VIEWPORT */}
      <div
        style={{
          width: 900,
          height: 600,
          overflow: "hidden",
          border: "1px solid #444",
          cursor: dragging ? "grabbing" : "grab",
          position: "relative",
          background: "#000"
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* MAP LAYER */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `
              translate(-50%, -50%)
              translate(${position.x}px, ${position.y}px)
              scale(${scale})
            `,
            transformOrigin: "center center",
            userSelect: "none",
          }}
        >
          <img
            src="https://oldschool.runescape.wiki/images/Old_School_RuneScape_world_map.png"
            alt="OSRS World Map"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}