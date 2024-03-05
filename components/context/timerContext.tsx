"use client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

// Define the type for the context value
type TimerContextType = {
  counter: number;
  setCounter: Dispatch<SetStateAction<number>>;
};

// Create the Timer Context
export const TimerContext = createContext<TimerContextType>({
  counter: 0,
  setCounter: () => {},
});

// Define the props interface for TimerProvider
interface TimerProviderProps {
  children: React.ReactNode; // Define children prop
}

// Create the Timer Context Provider Component
export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <TimerContext.Provider value={{ counter, setCounter }}>
      {children} {/* Render children */}
    </TimerContext.Provider>
  );
};
