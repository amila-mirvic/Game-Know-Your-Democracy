import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./World1TaskSelectorScreen.module.css";

export default function World1TaskSelectorScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ player from router OR localStorage fallback
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

  const safeRead = useCallback((key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // ✅ Achievements panel
  const [achOpen, setAchOpen] = useState(false);
  const achPanelRef = useRef(null);
  const achBtnRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!achOpen) return;
      const panel = achPanelRef.current;
      const btn = achBtnRef.current;
      if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) setAchOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [achOpen]);

  // ✅ scores read
  const scores = useMemo(() => safeRead("yd_scores") || {}, [safeRead]);
  const totalPoints = scores.totalPoints || 0;
  const totalCuriosityPoints = scores.totalCuriosityPoints || 0;
  const badges = Array.isArray(scores.badges) ? scores.badges : [];

  // ✅ assets (PER TVOJIM PUTANJAMA)
  const bgUrl = `${process.env.PUBLIC_URL}/worlds/world1.png`; 
  const task1Img = `${process.env.PUBLIC_URL}/world1/task1.png`;
  const task2Img = `${process.env.PUBLIC_URL}/world1/task2.png`;
  const task3Img = `${process.env.PUBLIC_URL}/world1/task3.png`;
  const task4Img = `${process.env.PUBLIC_URL}/world1/task4.png`;
  const achievementIcon = `${process.env.PUBLIC_URL}/ui/medal.svg`; // ✅ public/ui/medal.svg

  // ✅ CSS var + fallback (da BG sigurno radi)
  const bgStyle = useMemo(() => {
    return {
      "--bg": `url(${bgUrl})`,
      backgroundImage: `url(${bgUrl})`,
    };
  }, [bgUrl]);

  const characterSrc =
    player?.character === "male"
      ? `${process.env.PUBLIC_URL}/world1/taskselector/male.png`
      : `${process.env.PUBLIC_URL}/world1/taskselector/female.png`;

  // ✅ ROUTES (INTRO → INSTRUCTIONS → TASK) — svi taskovi su uvijek enabled
  const handleTask1 = useCallback(() => {
    navigate("/world-1/task-1-intro", { state: player });
  }, [navigate, player]);

  const handleTask2 = useCallback(() => {
    navigate("/world-1/task-2-intro", { state: player });
  }, [navigate, player]);

  const handleTask3 = useCallback(() => {
    navigate("/world-1/task-3-intro", { state: player });
  }, [navigate, player]);

  const handleTask4 = useCallback(() => {
    navigate("/world-1/task-4-intro", { state: player });
  }, [navigate, player]);

  // badge resolver (supports {src} or string)
  const resolveBadgeSrc = useCallback((b) => {
    if (!b) return "";
    if (typeof b === "string") return b;
    if (typeof b?.src === "string") return b.src;
    return "";
  }, []);

  return (
    <div className={styles.screen} style={bgStyle}>
      <div className={styles.overlay}>
        <button
          ref={achBtnRef}
          type="button"
          className={styles.achBtn}
          onClick={() => setAchOpen((v) => !v)}
          aria-label="Achievements"
          aria-expanded={achOpen ? "true" : "false"}
        >
          <img src={achievementIcon} alt="" className={styles.achIcon} />
        </button>

        {achOpen && (
          <div ref={achPanelRef} className={styles.achPanel} role="dialog" aria-modal="false">
            <div className={styles.achRow}>
              <span className={styles.achLabel}>TOTAL POINTS:</span>
              <span className={styles.achValue}>{totalPoints}</span>
            </div>

            <div className={styles.achRow}>
              <span className={styles.achLabel}>TOTAL CURIOSITY POINTS:</span>
              <span className={styles.achValue}>{totalCuriosityPoints}</span>
            </div>

            <div className={styles.achSubTitle}>MY BADGES:</div>

            <div className={styles.badgeRow}>
              {badges && badges.length > 0 ? (
                badges.map((b, idx) => (
                  <img
                    key={(typeof b === "string" ? b : b?.id || b?.src || idx) + "_" + idx}
                    src={resolveBadgeSrc(b)}
                    alt=""
                    className={styles.badgeImg}
                    loading="lazy"
                  />
                ))
              ) : (
                <div className={styles.badgeEmpty}>No badges yet.</div>
              )}
            </div>
          </div>
        )}

        <div className={styles.taskRail}>
          <div className={styles.taskItem}>
            <button type="button" className={styles.taskIconWrap} onClick={handleTask1} aria-label="Task 1">
              <img src={task1Img} alt="Task 1" className={styles.taskIcon} />
            </button>

            <button
              type="button"
              className={[styles.taskBtn, styles.taskBtnEnabled, styles.taskBtnPulse].join(" ")}
              onClick={handleTask1}
            >
              START TASK 1
            </button>
          </div>

          <div className={styles.taskItem}>
            <button type="button" className={styles.taskIconWrap} onClick={handleTask2} aria-label="Task 2">
              <img src={task2Img} alt="Task 2" className={styles.taskIcon} />
            </button>

            <button type="button" className={[styles.taskBtn, styles.taskBtnEnabled].join(" ")} onClick={handleTask2}>
              START TASK 2
            </button>
          </div>

          <div className={styles.taskItem}>
            <button type="button" className={styles.taskIconWrap} onClick={handleTask3} aria-label="Task 3">
              <img src={task3Img} alt="Task 3" className={styles.taskIcon} />
            </button>

            <button type="button" className={[styles.taskBtn, styles.taskBtnEnabled].join(" ")} onClick={handleTask3}>
              START TASK 3
            </button>
          </div>

          <div className={styles.taskItem}>
            <button type="button" className={styles.taskIconWrap} onClick={handleTask4} aria-label="Task 4">
              <img src={task4Img} alt="Task 4" className={styles.taskIcon} />
            </button>

            <button type="button" className={[styles.taskBtn, styles.taskBtnEnabled].join(" ")} onClick={handleTask4}>
              START TASK 4
            </button>
          </div>
        </div>

        <div className={styles.characterWrap} aria-hidden="true">
          <img src={characterSrc} alt="" className={styles.characterImg} />
        </div>
      </div>
    </div>
  );
}