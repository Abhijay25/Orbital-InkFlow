import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useContext, useState, useEffect } from "react";

import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import TimerSettings from "./TimerSettings";
import TimerContext from "./TimerContext";

import "../styles/Timer.css";

function Timer() {
    const [isPaused, setIsPaused] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [mode, setMode] = useState('work');

    const timerInfo = useContext(TimerContext)!; // '!' to imply values will never be null

    function initTimer() {
        setTimeLeft(timerInfo.workMins * 60);
    }

    function switchMode() {
        const nextMode = mode === 'work' ? 'break' : 'work';
        const secondsLeft = (nextMode === 'work' ? timerInfo.workMins : timerInfo.breakMins) * 60;
        setMode(nextMode);
        setTimeLeft(secondsLeft);
    }

    function tick() {
        setTimeLeft(timeLeft - 1);
    }

    useEffect( () => {
        initTimer();

        setInterval(() => {
            if (isPaused) {
                return;
            }
            if (timeLeft === 0) {
                return switchMode();
            }

            tick();
        },1000)
    }, [timerInfo]);

    if (!timerInfo) {
        console.log("TimerContext.Provider is missing");
        throw new Error("TimerContext.Provider is missing");
    }
    return (
        <div className="timer-content">
            <CircularProgressbar value={timerInfo.workMins} text={'50%'} />
            <div className="play_pause">
                {isPaused ? <PlayButton /> : <PauseButton />}
                <TimerSettings onClick={() => timerInfo.setShowSlider(true)}/>
            </div>
        </div>
    )
}

export default Timer