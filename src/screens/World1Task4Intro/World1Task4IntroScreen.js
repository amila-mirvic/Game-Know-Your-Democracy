import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./World1Task4IntroScreen.module.css";

/**
 * WORLD 1 — TASK 4
 * Intro screen (typing effect) — matches Task 1 intro behavior.
 * After the quote fades out, it auto-navigates to instructions.
 */
export default function World1Task4IntroScreen() {
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

  const introFull =
    "DEMOCRACY LIVES OR DIES IN EVERYDAY CHOICES — IN\n" +
    "SCHOOLS, WORKPLACES, ONLINE SPACES, AND LOCAL\n" +
    "COUNCILS.";

  const [introText, setIntroText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [fading, setFading] = useState(false);

  const typingRef = useRef(null);
  const holdRef = useRef(null);
  const fadeRef = useRef(null);

  const TYPE_MS = 64;
  const HOLD_MS = 1300;
  const FADE_MS = 650;

  useEffect(() => {
    let i = 0;
    setIntroText("");
    setTypingDone(false);
    setFading(false);

    typingRef.current = window.setInterval(() => {
      i += 1;
      setIntroText(introFull.slice(0, i));

      if (i >= introFull.length) {
        window.clearInterval(typingRef.current);
        typingRef.current = null;
        setTypingDone(true);

        holdRef.current = window.setTimeout(() => {
          setFading(true);

          fadeRef.current = window.setTimeout(() => {
            navigate("/world-1/task-4-instructions", { state: player });
          }, FADE_MS);
        }, HOLD_MS);
      }
    }, TYPE_MS);

    return () => {
      if (typingRef.current) window.clearInterval(typingRef.current);
      if (holdRef.current) window.clearTimeout(holdRef.current);
      if (fadeRef.current) window.clearTimeout(fadeRef.current);
    };
  }, [navigate, player, introFull]);

  return (
    <div className={styles.screen} style={bgStyle}>
      <div className={styles.overlay}>
        <div className={[styles.quoteWrap, fading ? styles.fadeOut : ""].join(" ")}>
          <div className={styles.quoteText}>
            {introText}
            {!typingDone && <span className={styles.caret} aria-hidden="true" />}
          </div>
        </div>
      </div>
    </div>
  );
}
