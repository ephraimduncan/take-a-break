import React from "react";
import Head from "next/head";
import useCountDown from "react-countdown-hook";
import styles from "../styles/Home.module.css";
import { formatTime } from "../lib/util";
import Image from "next/image";

export default function Home() {
  const [session, setSession] = React.useState("inactive");
  const [mouseMoved, setMouseMoved] = React.useState(false);
  const [tabHasFocus, setTabHasFocus] = React.useState(true);
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const [initialTime, setInitialTime] = React.useState(2 * 60 * 1000);
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, 1000);

  const restart = React.useCallback((newTime) => start(newTime), []);
  const timerIsActive = timeLeft > 0;

  const handleMouseMove = () => {
    if (timerIsActive) {
      let timer;

      restart(initialTime);
      setMouseMoved(true);

      if (!tabHasFocus) setTabHasFocus(true);

      clearTimeout(timer);
      timer = setTimeout(() => {
        setMouseMoved(false);
      }, 1000);
    }
  };

  React.useEffect(() => {
    const handleFocus = () => {
      console.log("Tab has focus");

      if (timerIsActive) {
        setTabHasFocus(true);
      }
    };

    const handleBlur = () => {
      console.log("Tab lost focus");
      if (timerIsActive) {
        restart(initialTime);
        setTabHasFocus(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [timerIsActive]);

  return (
    <div className={styles.container} onMouseMove={handleMouseMove}>
      <Head>
        <title>Take a Break</title>
        <meta name="description" content="Take A Break from your daily routine." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {session === "inactive" && (
          <>
            <Image src="/mug.svg" width={100} height={100} />
            <h2>Take a break from all the noise and appreciate the beauty of silence</h2>
            <div className="btn-group">
              <button
                className={initialTime === 2 * 60 * 1000 ? "" : "btn-inactive"}
                onClick={() => setInitialTime(2 * 60 * 1000)}
              >
                2 minutes
              </button>
              <button
                className={initialTime === 3 * 60 * 1000 ? "" : "btn-inactive"}
                onClick={() => setInitialTime(3 * 60 * 1000)}
              >
                3 minutes
              </button>
              <button
                className={initialTime === 5 * 60 * 1000 ? "" : "btn-inactive"}
                onClick={() => setInitialTime(5 * 60 * 1000)}
              >
                5 minutes
              </button>
            </div>
            <button
              className="main-btn"
              onClick={() => {
                setSession("active");
                start(initialTime);
              }}
            >
              Start Session
            </button>
          </>
        )}

        {session === "active" && (
          <>
            {timerIsActive ? (
              <div>
                <h1>{formatTime(timeLeft / 1000)}</h1>
                <div className="timer_detail">
                  <p onClick={pause}>Don’t move your cursor. Just sit back, relax & breathe.</p>

                  {(mouseMoved || !tabHasFocus) && <p className="oops">Oops! Try Again</p>}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="h2-main">You did it!</h2>
                <h2>You've done a good job today.</h2>
                <h2>Remember, it’s okay to take a break.</h2>
                <button
                  className="main-btn done-btn"
                  onClick={() => {
                    console.log(timeLeft);
                    console.log(timerIsActive);
                    setSession("inactive");
                  }}
                >
                  Take another break?
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
