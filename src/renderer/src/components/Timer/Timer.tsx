import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useContext, useState, useEffect, useRef } from "react";

import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import TimerSettings from "./TimerSettings";
import TimerContext from "./TimerContext";

import "../../styles/Timer.css";
import ModeContext from "../ModeContext";

function Timer() {
  const timerInfo = useContext(TimerContext)!; // '!' to imply values will never be null
  const modeInfo = useContext(ModeContext);

  if (!timerInfo) {
    console.log("TimerContext.Provider is missing");
    throw new Error("TimerContext.Provider is missing");
  }

  const [isPaused, setIsPaused] = useState(true); // Status for Timer
  const [timeLeft, setTimeLeft] = useState(0); // Time Left on the Timer for Work or Break
  const [mode, setMode] = useState("work"); // Changes between 'work' and 'break' in switchMode

  // References for States that are Changing
  const timeLeftRef = useRef(timeLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  // For Timer to Count Down
  function tick() {
    timeLeftRef.current--;
    setTimeLeft(timeLeftRef.current);
  }

  useEffect(() => {
    // If already in Work, Set Mode to Break and Add Time
    function switchMode() {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const secondsLeft =
        (nextMode === "work" ? timerInfo.workMins : timerInfo.breakMins) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setTimeLeft(secondsLeft);
      timeLeftRef.current = secondsLeft;
    }

    timeLeftRef.current = timerInfo.workMins * 60;
    setTimeLeft(timeLeftRef.current);

    const interval = setInterval(() => {
      // If Timer Is Paused, Do Nothing
      if (isPausedRef.current) {
        return;
      }
      // If Timer has Reached 0, Switch Modes
      if (timeLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [timerInfo]);

  const totalTime =
    mode === "work" ? timerInfo.workMins * 60 : timerInfo.breakMins * 60;

  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let secondsString = ""; // String to be Displayed in the Timer
  if (seconds < 10) {
    secondsString = "0" + seconds;
  } else {
    secondsString = secondsString + seconds;
  }

  return (
    <div className="timer-content">
      <CircularProgressbar
        value={Math.round((timeLeft / totalTime) * 100)}
        text={minutes + ":" + secondsString}
        styles={buildStyles({
          pathColor: mode === "work" ? "#f54e4e" : "#4aec8c",
          textColor: modeInfo?.darkTheme ? "white" : "black",
        })}
      />
      <div className="play_pause">
        {isPaused ? (
          <PlayButton
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
        <TimerSettings onClick={() => timerInfo.setShowSlider(true)} />
      </div>
    </div>
  );
}

export default Timer;
