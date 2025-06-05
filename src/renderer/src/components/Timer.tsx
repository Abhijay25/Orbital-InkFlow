import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import "../styles/Timer.css";

function Timer() {
    return (
        <div className="timer-content">
            <CountdownCircleTimer
                isPlaying
                duration={7}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
            >
                {({ remainingTime }) => remainingTime}

            </CountdownCircleTimer>
        </div>
    )
}

export default Timer;