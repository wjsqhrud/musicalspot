import { useInterval } from "hooks/useIntervalHook";
import { useState } from "react";

export const MuteCountDown = (muteDuration: number) => {
    const CONUNT_NUM = muteDuration / 1000;
    let [timer, setTimer] = useState<number>(CONUNT_NUM);  
    
    useInterval(()=>{
      setTimer(timer - 1);
    }, 1000);
    
    return timer;
  }