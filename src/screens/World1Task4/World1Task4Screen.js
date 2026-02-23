import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./World1Task4Screen.module.css";

const MAIN_MENU_ROUTE = "/world-1";

const asset = (p) => `${process.env.PUBLIC_URL}${p}`;

// ✅ Task 4 assets (public/world1/task4)
const BG = asset("/world1/task4/bg.png");
const ICON_POINTS = asset("/world1/task4/points.png");
const ICON_CURIOSITY = asset("/world1/task4/curiositypoints.png");

// Badges
const BADGE_BEGINNER = asset("/world1/task4/beginner.png");
const BADGE_ADVANCED = asset("/world1/task4/advanced.png");
const BADGE_EXPERT = asset("/world1/task4/expert.png");

// ✅ Values pool (random incorrect values come from here)
const VALUE_POOL = [
  "TRANSPARENCY",
  "PARTICIPATION",
  "TRANSPARENCY/PARTICIPATION",
  "FAIRNESS",
  "EQUALITY",
  "FAIRNESS/EQUALITY",
  "DIGNITY",
  "RESPECT",
  "DIGNITY/RESPECT",
  "ACCOUNTABILITY",
  "RULE OF LAW",
  "INCLUSION",
  "SOLIDARITY",
  "NONDISCRIMINATION",
  "PRIVACY",
  "FREE SPEECH",
  "SAFETY",
  "TRUST",
  "OPENNESS",
  "DUE PROCESS",
];

const sampleUnique = (arr, count, excludeSet = new Set()) => {
  const pool = arr.filter((x) => !excludeSet.has(x));
  const out = [];
  const used = new Set(excludeSet);

  while (out.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const val = pool.splice(idx, 1)[0];
    if (!used.has(val)) {
      used.add(val);
      out.push(val);
    }
  }
  return out;
};

const buildValueOptions = (correctValue) => {
  const wrong = sampleUnique(VALUE_POOL, 3, new Set([correctValue]));
  const labels = [correctValue, ...wrong].sort(() => Math.random() - 0.5); // shuffle
  const keys = ["A", "B", "C", "D"];

  return keys.map((k, idx) => ({
    key: k,
    label: labels[idx],
    correct: labels[idx] === correctValue,
  }));
};

// ✅ DATA (scene text + answers)
const SCENES = [
  {
    id: 1,
    title: "SCENE 1",
    statement:
      'STUDENTS PROPOSE A NEW CHILL SPACE. THE PRINCIPAL DECIDES ALONE AND SAYS "STUDENTS DON\'T UNDERSTAND BUDGETS."',
    actionOptions: [
      { key: "A", label: "GIVE UP", correct: false },
      {
        key: "B",
        label: "ASK FOR PARTICIPATION: MEETING, TRANSPARENT BUDGET INFO, STUDENT REPS",
        correct: true,
      },
      { key: "C", label: "START RUMORS", correct: false },
      { key: "D", label: "VANDALIZE THE OFFICE", correct: false },
    ],
    correctValue: "TRANSPARENCY/PARTICIPATION",
  },
  {
    id: 2,
    title: "SCENE 2",
    statement:
      'AN ONLINE CLASS GROUP CHAT STARTS TARGETING A STUDENT WITH MEMES AND INSULTS. SOME PEOPLE SAY IT\'S "JUST A JOKE."',
    actionOptions: [
      { key: "A", label: "JOIN IN SO YOU'RE NOT NEXT", correct: false },
      { key: "B", label: "CHECK IN WITH THE TARGET + REPORT + SET GROUP RULES", correct: true },
      { key: "C", label: "POST MORE MEMES", correct: false },
      { key: "D", label: "DOX THE TARGET", correct: false },
    ],
    correctValue: "DIGNITY/RESPECT",
  },
  {
    id: 3,
    title: "SCENE 3",
    statement:
      'AT WORK, A MANAGER ALWAYS PROMOTES FRIENDS. OTHERS ARE TOLD: "DON\'T ASK QUESTIONS IF YOU WANT TO STAY."',
    actionOptions: [
      { key: "A", label: "SPREAD RUMORS", correct: false },
      {
        key: "B",
        label: "DOCUMENT, USE HR/WHISTLEBLOWING CHANNELS, ASK FOR CLEAR CRITERIA",
        correct: true,
      },
      { key: "C", label: "QUIT WITHOUT SAYING ANYTHING", correct: false },
      { key: "D", label: "SABOTAGE PROJECTS", correct: false },
    ],
    correctValue: "FAIRNESS/EQUALITY",
  },
  {
    id: 4,
    title: "SCENE 4",
    statement:
      "A LOCAL COUNCIL APPROVES A NEW PROJECT WITHOUT PUBLISHING DOCUMENTS. PEOPLE HEAR ABOUT IT ONLY AFTER IT'S DONE.",
    actionOptions: [
      { key: "A", label: "SHOUT AT PEOPLE ONLINE", correct: false },
      { key: "B", label: "REQUEST DOCUMENTS, ATTEND MEETINGS, ASK FOR PUBLIC CONSULTATION", correct: true },
      { key: "C", label: "GIVE UP", correct: false },
      { key: "D", label: "THREATEN COUNCIL MEMBERS", correct: false },
    ],
    correctValue: "TRANSPARENCY",
  },
];

const resolveSkillBadge = (correctActions) => {
  if (correctActions <= 1) return { id: "beginner", src: BADGE_BEGINNER };
  if (correctActions <= 3) return { id: "advanced", src: BADGE_ADVANCED };
  return { id: "expert", src: BADGE_EXPERT };
};

export default function World1Task4Screen() {
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

  const nameUpper = (player?.name || "PLAYER").toString().toUpperCase();
  const bgStyle = useMemo(() => ({ "--bg": `url(${BG})` }), []);

  // ✅ TOP MESSAGE
  const feedbackMessages = useMemo(
    () => [
      "{NAME} KEEP GOING",
      "{NAME} NICE CHOICE",
      "{NAME} STAY SHARP",
      "{NAME} THINK IT THROUGH",
      "{NAME} TRUST YOUR INSTINCT",
      "{NAME} YOU'VE GOT THIS",
      "{NAME} SOLID MOVE",
    ],
    []
  );
  const [topMessage, setTopMessage] = useState(`${nameUpper} KEEP GOING`);
  useEffect(() => setTopMessage(`${nameUpper} KEEP GOING`), [nameUpper]);

  const pickNewTopMessage = () => {
    const currentMsg = topMessage;
    let next = currentMsg;
    let guard = 0;
    while (next === currentMsg && guard < 10) {
      const raw = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      next = raw.replace("{NAME}", nameUpper);
      guard += 1;
    }
    setTopMessage(next);
  };

  // ✅ SCORE
  const [points, setPoints] = useState(0);
  const [curiosityPoints] = useState(0);
  const [correctActions, setCorrectActions] = useState(0);

  // ✅ Fly-to-UI animation
  const pointsTargetRef = useRef(null);
  const curiosityTargetRef = useRef(null);
  const cardRef = useRef(null);

  const [flyItems, setFlyItems] = useState([]);
  const flyIdRef = useRef(1);
  const [pulsePoints, setPulsePoints] = useState(false);
  const [pulseCuriosity, setPulseCuriosity] = useState(false);

  const makeFly = ({ type, icon, delta }) => {
    const fromRect = cardRef.current?.getBoundingClientRect();
    const toRect =
      type === "points"
        ? pointsTargetRef.current?.getBoundingClientRect()
        : curiosityTargetRef.current?.getBoundingClientRect();

    if (!fromRect || !toRect) return;

    const fromX = fromRect.left + fromRect.width * 0.7;
    const fromY = fromRect.top + fromRect.height * 0.25;
    const toX = toRect.left + toRect.width * 0.45;
    const toY = toRect.top + toRect.height * 0.5;

    const id = flyIdRef.current++;
    setFlyItems((arr) => [...arr, { id, type, icon, delta, fromX, fromY, toX, toY }]);

    window.setTimeout(() => {
      setFlyItems((arr) => arr.filter((x) => x.id !== id));
      if (type === "points") {
        setPulsePoints(true);
        window.setTimeout(() => setPulsePoints(false), 420);
      } else {
        setPulseCuriosity(true);
        window.setTimeout(() => setPulseCuriosity(false), 420);
      }
    }, 820);
  };

  // ✅ CORRECT flash
  const [correctFlash, setCorrectFlash] = useState(false);
  const flashTimerRef = useRef(null);
  const showCorrectFlash = () => {
    setCorrectFlash(true);
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => setCorrectFlash(false), 520);
  };
  useEffect(() => {
    return () => {
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  // ✅ Scene state
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = SCENES[sceneIndex];

  // Generate values for this scene (1 correct + 3 random wrong)
  const valueOptions = useMemo(() => {
    if (!scene?.correctValue) return [];
    return buildValueOptions(scene.correctValue);
  }, [scene?.correctValue]);

  // per-scene locks
  const [actionPicked, setActionPicked] = useState(false); // becomes true after correct OR after wrong-popup-close (we lock it)
  const [actionCorrect, setActionCorrect] = useState(false); // unlock values (true if correct OR after wrong-popup-close)
  const [valuePicked, setValuePicked] = useState(false);
  const [sceneLocked, setSceneLocked] = useState(false);

  // ✅ WRONG ANSWER POPUP (used for Part 1 and Part 2)
  const [wrongOpen, setWrongOpen] = useState(false);
  const [wrongTitle, setWrongTitle] = useState("");
  const [wrongText, setWrongText] = useState("");
  const wrongOnCloseRef = useRef(null);

  const openWrongPopup = ({ title, text, onClose }) => {
    setWrongTitle(title);
    setWrongText(text);
    wrongOnCloseRef.current = onClose || null;
    setWrongOpen(true);
  };

  const closeWrongPopup = () => {
    setWrongOpen(false);
    setWrongTitle("");
    setWrongText("");

    const fn = wrongOnCloseRef.current;
    wrongOnCloseRef.current = null;
    if (typeof fn === "function") {
      window.setTimeout(() => fn(), 80);
    }
  };

  // ✅ end popup
  const [endOpen, setEndOpen] = useState(false);
  const endLockRef = useRef(false);

  const safeRead = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const safeWrite = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const saveResultsForAchievements = ({ taskPoints, taskCuriosity, badges }) => {
    safeWrite("yd_world1_task4", {
      points: taskPoints,
      curiosityPoints: taskCuriosity,
      badges: badges.map((b) => ({ id: b.id, src: b.src })),
      correctActions,
      totalScenes: SCENES.length,
      finishedAt: Date.now(),
    });

    const prev = safeRead("yd_scores") || {
      totalPoints: 0,
      totalCuriosityPoints: 0,
      badges: [],
    };

    const markerKey = "yd_world1_task4_counted";
    const alreadyCounted = safeRead(markerKey);

    if (!alreadyCounted) {
      const mergedBadges = [
        ...(Array.isArray(prev.badges) ? prev.badges : []),
        ...badges.map((b) => ({ id: b.id, src: b.src })),
      ];

      safeWrite("yd_scores", {
        totalPoints: (prev.totalPoints || 0) + taskPoints,
        totalCuriosityPoints: (prev.totalCuriosityPoints || 0) + taskCuriosity,
        badges: mergedBadges,
      });

      safeWrite(markerKey, true);
    }

    safeWrite("yd_world1_task4_done", true);
  };

  const openEndPopup = () => {
    if (endLockRef.current) return;
    endLockRef.current = true;

    const earned = [resolveSkillBadge(correctActions)];
    saveResultsForAchievements({
      taskPoints: points,
      taskCuriosity: curiosityPoints,
      badges: earned,
    });

    setEndOpen(true);
  };

  const goMainMenu = useCallback(() => navigate(MAIN_MENU_ROUTE, { state: player }), [navigate, player]);

  const resetSceneState = () => {
    setActionPicked(false);
    setActionCorrect(false);
    setValuePicked(false);
    setSceneLocked(false);
    setWrongOpen(false);
    setWrongTitle("");
    setWrongText("");
    wrongOnCloseRef.current = null;
  };

  const advanceScene = () => {
    setSceneIndex((i) => {
      const next = i + 1;
      if (next >= SCENES.length) {
        window.setTimeout(() => openEndPopup(), 120);
        return i;
      }
      return next;
    });
  };

  useEffect(() => {
    resetSceneState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex]);

  // Esc closes wrong popup / end
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (wrongOpen) closeWrongPopup();
        if (endOpen) goMainMenu();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [wrongOpen, endOpen, goMainMenu]);

  const awardPoints = (delta) => {
    if (delta <= 0) return;
    showCorrectFlash();
    makeFly({ type: "points", icon: ICON_POINTS, delta: `+${delta}` });
    window.setTimeout(() => setPoints((p) => p + delta), 520);
  };

  // ✅ PART 1 (Action)
  // If wrong -> popup shows correct action, after close: lock left + unlock right
  // If correct -> normal (points)
  const handlePickAction = (opt) => {
    if (!scene || sceneLocked || wrongOpen || endOpen) return;

    pickNewTopMessage();

    if (actionPicked) return;

    if (!opt.correct) {
      const correctOpt = scene.actionOptions.find((x) => x.correct);
      const correctText = correctOpt ? correctOpt.label : "—";

      openWrongPopup({
        title: "CORRECT ANSWER",
        text: correctText,
        onClose: () => {
          // lock part 1, unlock part 2 (no points)
          setActionPicked(true);
          setActionCorrect(true);
        },
      });
      return;
    }

    // correct
    setActionPicked(true);
    setActionCorrect(true);
    awardPoints(4);
    setCorrectActions((c) => c + 1);
  };

  // ✅ PART 2 (Value)
  // If wrong -> popup shows correct value, after close: advance scene
  // If correct -> award points then advance
  const handlePickValue = (opt) => {
    if (!scene || sceneLocked || !actionCorrect || valuePicked || wrongOpen || endOpen) return;

    pickNewTopMessage();
    setValuePicked(true);

    if (opt.correct) {
      awardPoints(1.5);
      window.setTimeout(() => {
        setSceneLocked(true);
        window.setTimeout(() => advanceScene(), 420);
      }, 540);
      return;
    }

    // wrong value
    openWrongPopup({
      title: "CORRECT ANSWER",
      text: scene.correctValue,
      onClose: () => {
        setSceneLocked(true);
        window.setTimeout(() => advanceScene(), 180);
      },
    });
  };

  const fmt = (n) => {
    const s = Number(n || 0).toFixed(1);
    return s.endsWith(".0") ? s.slice(0, -2) : s;
  };

  const earnedBadges = useMemo(() => {
    return [resolveSkillBadge(correctActions)];
  }, [correctActions]);

  return (
    <div className={styles.screen} style={bgStyle}>
      <div className={styles.overlay}>
        {/* TOP BAR */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>{topMessage}</div>
          <div className={styles.topRight}>
            <div className={[styles.stat, pulsePoints ? styles.statPulse : ""].join(" ")}>
              <img ref={pointsTargetRef} src={ICON_POINTS} alt="Points" className={styles.statIcon} />
              <div className={styles.statNum}>{fmt(points)}</div>
            </div>

            <div className={[styles.stat, pulseCuriosity ? styles.statPulse : ""].join(" ")}>
              <img
                ref={curiosityTargetRef}
                src={ICON_CURIOSITY}
                alt="Curiosity points"
                className={styles.statIcon}
              />
              <div className={styles.statNum}>{fmt(curiosityPoints)}</div>
            </div>
          </div>
        </div>

        {/* FLY ITEMS */}
        {flyItems.map((f) => (
          <div
            key={f.id}
            className={styles.flyWrap}
            style={{
              left: f.fromX,
              top: f.fromY,
              "--toX": `${f.toX}px`,
              "--toY": `${f.toY}px`,
            }}
          >
            <div className={styles.flyInner}>
              <img src={f.icon} alt="" className={styles.flyIcon} />
              <div className={styles.flyDelta}>{f.delta}</div>
            </div>
          </div>
        ))}

        {/* CORRECT FLASH */}
        {correctFlash && (
          <div className={styles.correctFlashWrap} aria-hidden="true">
            <div className={styles.correctFlashCard}>CORRECT!</div>
          </div>
        )}

        {/* SCENE CARD */}
        <div className={styles.sceneCard} ref={cardRef}>
          <div className={styles.sceneTitle}>{scene?.title}</div>
          <div className={styles.sceneText}>{scene?.statement}</div>
        </div>

        {/* PANELS */}
        <div className={styles.panels}>
          {/* LEFT — enabled until answered (correct or wrong->popup->close) */}
          <div className={styles.panel} aria-label="Best first step">
            {scene?.actionOptions?.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={styles.optionBtn}
                onClick={() => handlePickAction(opt)}
                disabled={sceneLocked || actionPicked || wrongOpen}
              >
                <span className={styles.optKey}>{opt.key}</span>
                <span className={styles.optLabel}>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* RIGHT — disabled until left is finished */}
          <div className={styles.panel} aria-label="Value involved">
            {valueOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={styles.optionBtn}
                onClick={() => handlePickValue(opt)}
                disabled={!actionCorrect || valuePicked || sceneLocked || wrongOpen}
              >
                <span className={styles.optKey}>{opt.key}</span>
                <span className={styles.optLabel}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ✅ WRONG ANSWER POPUP (Task style) */}
        {wrongOpen && (
          <div className={styles.popupBackdrop} role="presentation">
            <div className={styles.popupCard} role="dialog" aria-modal="true">
              <button type="button" className={styles.popupClose} onClick={closeWrongPopup} aria-label="Close">
                ×
              </button>

              <div className={styles.popupTitle}>{wrongTitle}</div>
              <div className={styles.popupText}>{wrongText}</div>

              <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                <button type="button" className={styles.endActionBtn} onClick={closeWrongPopup}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* END POPUP (same as Task1 style) */}
        {endOpen && (
          <div className={styles.endBackdrop} role="presentation">
            <div className={styles.endCard} role="dialog" aria-modal="true">
              <button type="button" className={styles.endClose} onClick={goMainMenu} aria-label="Close">
                ×
              </button>

              <div className={styles.endTitle}>BRAVO {nameUpper} YOU NAILED IT!</div>

              <div className={styles.endStats}>
                <div className={styles.endStatLine}>POINTS: {fmt(points)}</div>
                <div className={styles.endStatLine}>CURIOSITY POINTS: {fmt(curiosityPoints)}</div>
              </div>

              <div className={styles.endBadges}>
                {earnedBadges.map((b) => (
                  <img key={b.id} src={b.src} alt={b.id} className={styles.endBadgeImg} />
                ))}
              </div>

              <div className={styles.endActions}>
                <button type="button" className={styles.endActionBtn} onClick={goMainMenu}>
                  COLLECT BADGES AND GO TO MAIN MENU
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}