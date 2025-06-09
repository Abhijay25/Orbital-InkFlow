import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./PlayButton";

import "../styles/Timer.css";
import PauseButton from "./PauseButton";

function Timer() {
    return (
        <div className="timer-content">
            <CircularProgressbar value={60} text={'50%'} />
            <div>
                <PlayButton />
                <PauseButton />
            </div>
        </div>
    )
}

export default Timer