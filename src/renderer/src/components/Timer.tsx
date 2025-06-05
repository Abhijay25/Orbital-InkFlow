import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useState } from "react";

import "../styles/Timer.css";

// const [time, setTime] = useState(10); // State to track remaining time 
let time = 10;

function Timer() {
    return (
        <div className="timer-content">
            <CountdownCircleTimer
                isPlaying
                duration={time} // Time used will be set up as a state
                initialRemainingTime={time}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[time, 0.5 * time, 0.25 * time, 0]} // Every quarter of the given time, it will change
            >
                {({ remainingTime }) => remainingTime}

            </CountdownCircleTimer>
        </div>
    )
}

export default Timer;