import { loadPetName } from "@/features/profile/storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type ScreenState =
  | "home"
  | "ready"
  | "running"
  | "paused"
  | "finished";

type GameContextType = {
  isHydrated: boolean;
  hasPetName: boolean;

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
  const [isHydrated, setIsHydrated] = useState(false);
  const [health, setHealth] = useState(50);
  const [money, setMoney] = useState(0);
  const [energy, setEnergy] = useState(80);
  const [screenState, setScreenState] = useState<ScreenState>("home");
  const [petName, setPetName] = useState("");

  useEffect(() => {
    const hydrateGame = async () => {
      const storedName = await loadPetName();

      if (storedName) {
        setPetName(storedName);
      }

      setIsHydrated(true);
    };

    void hydrateGame();
  }, []);

  return (
    <GameContext.Provider
      value={{
        isHydrated,
        hasPetName: petName.trim().length > 0,
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
