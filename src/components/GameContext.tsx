import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type ScreenState =
  | "home"
  | "ready"
  | "running"
  | "paused"
  | "finished";

type GameContextType = {
  health: number;
  setHealth: (v: number) => void;

  money: number;
  setMoney: (v: number) => void;

  energy: number;
  setEnergy: (v: number) => void;

  screenState: ScreenState ;
  setScreenState: (v: ScreenState ) => void;

  petName: string;
  setPetName: (v: string) => void;
};

const GameContext =
  createContext<GameContextType | null>(null);

export function GameProvider({
  children,
}: PropsWithChildren) {
  const [health, setHealth] = useState(50);
  const [money, setMoney] = useState(0);
  const [energy, setEnergy] = useState(80);
  const [screenState, setScreenState] = useState<ScreenState>("home");
  const [petName, setPetName] = useState("Bella");

  return (
    <GameContext.Provider
      value={{
        health,
        setHealth,
        money,
        setMoney,
        energy,
        setEnergy,
        screenState,
        setScreenState,
        petName,
        setPetName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);

  if (!ctx) {
    throw new Error(
      "useGame must be inside GameProvider"
    );
  }

  return ctx;
}
