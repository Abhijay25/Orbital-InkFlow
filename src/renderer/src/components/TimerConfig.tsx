import "../styles/Timer.css"
import ReactSlider from "react-slider";

function TimerConfig() {
    return (
        <div className="timer-sliders">
            <label>Work Time:</label>
            <ReactSlider 
                className="work-slider"
                value={45}
                min={1}
                max={120}
            />
            <label>Break Time:</label>
            <ReactSlider 
                className="break-slider"
                value={45}
                min={1}
                max={120}
            />
        </div>
    )
}

export default TimerConfig