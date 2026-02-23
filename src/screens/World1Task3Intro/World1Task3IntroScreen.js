import React, { useMemo, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./World1Task3IntroScreen.module.css";

export default function World1Task3IntroScreen() {
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

  // ✅ background
  const bgUrl = `${process.env.PUBLIC_URL}/world1/task3/bg.png`;
  const bgStyle = useMemo(() => ({ "--bg": `url(${bgUrl})` }), [bgUrl]);

  // ✅ character
  const femaleSrc = `${process.env.PUBLIC_URL}/characters/female.png`;
  const maleSrc = `${process.env.PUBLIC_URL}/characters/male.png`;
  const characterSrc = player.character === "male" ? maleSrc : femaleSrc;

  // ✅ icons
  const icon0 = `${process.env.PUBLIC_URL}/world1/task3/correct.png`;
  const icon1 = `${process.env.PUBLIC_URL}/world1/task3/middle.png`;
  const icon2 = `${process.env.PUBLIC_URL}/world1/task3/wrong.png`;

  /* --------------------------------------- */
  /* INTRO OVERLAY: typing -> HOLD -> FADE -> REVEAL UI */
  const introFull =
    "A friendly voice echoes through the hall:\n" +
    "“In democracy, power has limits.\n" +
    "Your job is to test decisions: are they fair, legal, and respectful of rights?”";

  const [introText, setIntroText] = useState("");
  const [introTypingDone, setIntroTypingDone] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);

  // ✅ show instructions + character only after intro is gone
  const [showUI, setShowUI] = useState(false);
  const [uiTextIn, setUiTextIn] = useState(false);

  const typingRef = useRef(null);
  const holdRef = useRef(null);
  const fadeRef = useRef(null);
  const revealRefs = useRef([]);

  const TYPE_MS = 84; // matches Task 1
  const HOLD_MS = 2500; // matches Task 1
  const FADE_MS = 700; // matches Task 1
  const REVEAL_DELAY = 120; // matches Task 1

  useEffect(() => {
    let i = 0;

    setIntroText("");
    setIntroTypingDone(false);
    setIntroFading(false);
    setIntroHidden(false);

    setShowUI(false);
    setUiTextIn(false);

    typingRef.current = setInterval(() => {
      i += 1;
      setIntroText(introFull.slice(0, i));

      if (i >= introFull.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        setIntroTypingDone(true);

        holdRef.current = setTimeout(() => {
          setIntroFading(true);

          fadeRef.current = setTimeout(() => {
            setIntroHidden(true);

            // ✅ reveal: first the box, then the text
            revealRefs.current.push(setTimeout(() => setShowUI(true), REVEAL_DELAY));
            revealRefs.current.push(setTimeout(() => setUiTextIn(true), REVEVEAL_DELAY_SAFE(REVEAL_DELAY) + 240));
          }, FADE_MS);
        }, HOLD_MS);
      }
    }, TYPE_MS);

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (holdRef.current) clearTimeout(holdRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
      revealRefs.current.forEach((t) => clearTimeout(t));
      revealRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    navigate("/world-1/task-3", { state: player });
  };

  return (
    <div className={styles.screen} style={bgStyle}>
      <div className={styles.overlay}>
        {/* INTRO LAYER */}
        {!introHidden && (
          <div className={[styles.introLayer, introFading ? styles.introFadeOut : ""].join(" ")}>
            <div className={styles.introText}>
              {introText}
              {!introTypingDone && <span className={styles.introCaret} aria-hidden="true" />}
            </div>
          </div>
        )}

        {/* MAIN UI */}
        {showUI && (
          <>
            {/* CHARACTER */}
            <div
              className={[styles.characterWrap, styles.uiReveal, uiTextIn ? styles.uiTextIn : ""].join(" ")}
              aria-hidden="true"
            >
              <img src={characterSrc} alt="" className={styles.characterImg} />
            </div>

            {/* INFO CARD */}
            <div className={[styles.infoCard, styles.uiReveal, uiTextIn ? styles.uiTextIn : ""].join(" ")}>
              <div className={styles.cardTitle}>INSTRUCTIONS</div>

              <div className={styles.rows}>
                <div className={styles.row}>
                  <img className={styles.icon} src={icon0} alt="" />
                  <div className={styles.rowText}>YES — THIS RESPECTS DEMOCRATIC LIMITS / RIGHTS</div>
                </div>

                <div className={styles.row}>
                  <img className={styles.icon} src={icon1} alt="" />
                  <div className={styles.rowText}>NOT SURE — IT DEPENDS / NEEDS MORE CONTEXT</div>
                </div>

                <div className={styles.row}>
                  <img className={styles.icon} src={icon2} alt="" />
                  <div className={styles.rowText}>NO — THIS VIOLATES RIGHTS / ABUSES POWER</div>
                </div>
              </div>

              <button type="button" className={styles.actionBtn} onClick={handleStart}>
                START
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function REVEVEAL_DELAY_SAFE(n) {
  return n;
}