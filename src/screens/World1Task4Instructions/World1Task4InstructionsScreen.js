import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./World1Task4InstructionsScreen.module.css";

/**
 * WORLD 1 — TASK 4
 * Instructions screen (same layout style as Task 1 intro instructions).
 */
export default function World1Task4InstructionsScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ get player from router state OR localStorage fallback
  const player = useMemo(() => {
    const fromState = location.state && location.state.name ? location.state : null;
    if (fromState) return fromState;

    try {
      const raw = localStorage.getItem("yd_player");
      return raw ? JSON.parse(raw) : { name: "Player", character: "female" };
    } catch {
      return { name: "Player", character: "female" };
    }
  }, [location.state]);

  const bgUrl = `${process.env.PUBLIC_URL}/world1/task4/bg.png`;
  const bgStyle = useMemo(() => ({ "--bg": `url(${bgUrl})` }), [bgUrl]);

  const femaleSrc = `${process.env.PUBLIC_URL}/characters/female.png`;
  const maleSrc = `${process.env.PUBLIC_URL}/characters/male.png`;
  const characterSrc = player.character === "male" ? maleSrc : femaleSrc;

  const handleStart = () => navigate("/world-1/task-4", { state: player });

  return (
    <div className={styles.screen} style={bgStyle}>
      <div className={styles.overlay}>
        {/* Character */}
        <div className={styles.characterWrap} aria-hidden="true">
          <img src={characterSrc} alt="" className={styles.characterImg} />
        </div>

        {/* Instructions card */}
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>INSTRUCTIONS</div>

          <div className={styles.rows}>
            <div className={styles.row}>
              <div className={styles.rowText}>1. WHAT’S THE DEMOCRATIC PROBLEM?</div>
            </div>
            <div className={styles.row}>
              <div className={styles.rowText}>2. WHAT’S THE BEST FIRST STEP?</div>
            </div>
            <div className={styles.row}>
              <div className={styles.rowText}>3. WHICH VALUE IS INVOLVED? (CHOOSE 1 OF 4)</div>
            </div>
          </div>

          <button type="button" className={styles.actionBtn} onClick={handleStart}>
            START
          </button>
        </div>
      </div>
    </div>
  );
}
