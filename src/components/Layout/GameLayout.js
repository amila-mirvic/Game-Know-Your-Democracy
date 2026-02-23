import React, { useState, useEffect } from "react";
import styles from "./GameLayout.module.css";

const BASE_W = 1920;
const BASE_H = 1080;

export default function GameLayout({ backgroundImage, children }) {
  const [scale, setScale] = useState(1);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // We only use the "scaled stage" for desktop-like devices
      // Tablets and phones get the fluid mobile-first layout
      // Refined: only if both dimensions are large enough
      const isLarge = w >= 1025 && h >= 700;
      setIsLargeScreen(isLarge);

      if (isLarge) {
        setScale(Math.min(w / BASE_W, h / BASE_H));
      } else {
        setScale(1);
      }

      // vh fix for mobile browsers
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stageStyle = isLargeScreen
    ? {
        width: BASE_W,
        height: BASE_H,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }
    : {
        width: "100%",
        height: "100%",
        transform: "none",
      };

  return (
    <div
      className={styles.viewport}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      }}
    >
      <div className={styles.stage} style={stageStyle}>
        {children}
      </div>
    </div>
  );
}
