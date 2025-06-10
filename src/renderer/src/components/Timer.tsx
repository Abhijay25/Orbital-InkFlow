import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import TimerSettings from "./TimerSettings";

import "../styles/Timer.css";


function Timer() {
    return (
        <div className="timer-content">
            <CircularProgressbar value={60} text={'50%'} />
            <div className="play_pause">
                <PlayButton />
                <PauseButton />
                <TimerSettings />
            </div>
        </div>
    )
}

export default Timer