import ReactSlider from "react-slider";
import TimerContext from "./TimerContext";
import { useContext } from "react";

import "../styles/Timer.css"
import SaveButton from "./SaveButton";

function TimerConfig() {
    const timerInfo = useContext(TimerContext);

    if (!timerInfo) {
        console.log("TimerContext.Provider is missing");
        throw new Error("TimerContext.Provider is missing");
    }
    return (
        <div className="timer-sliders">
            <div className="save-align">
                <SaveButton />
            </div>
            <label>Work Time: {timerInfo.workMins} </label>
            <ReactSlider
                className="work-slider"
                thumbClassName="work-thumb"
                trackClassName="work-track"
                value={timerInfo.workMins}
                onChange={newValue => timerInfo.setWorkMins(newValue)}
                min={1}
                max={120}
            />
            <label>Break Time: {timerInfo.breakMins} </label>
            <ReactSlider
                className="break-slider"
                thumbClassName="break-thumb"
                trackClassName="break-track"
                value={timerInfo.breakMins}
                onChange={newValue => timerInfo.setBreakMins(newValue)}
                min={1}
                max={120}
            />
        </div>
    )
}

export default TimerConfig