import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { loadEnergy, loadHealth, loadLastEnergyDecayDate, loadLastHealthDecayDate, loadPetName, saveEnergy, saveHealth, saveLastEnergyDecayDate, saveLastHealthDecayDate } from "@/features/profile/storage";

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

  rewardHealthFromActivity: (distanceMeters: number, averageSpeedKmh: number) => Promise<void>;
  restoreEnergy: () => Promise<void>;
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

  const rewardHealthFromActivity = async (distanceMeters: number, averageSpeedKmh: number) => {
    const distanceKm = distanceMeters / 1000;
    const gain = distanceKm * (averageSpeedKmh / 5) * (1.667 - 0.00834 * health);
    const newHealth = Math.min(100, health + Math.max(0, gain));
    setHealth(newHealth);
    await saveHealth(newHealth);
  };
  
  const restoreEnergy = async () => {
    setEnergy(100);
    await saveEnergy(100);
  };

  const applyDailyHealthDecay = async (currentHealth: number) => {
    const now = Date.now();
    const lastDecay = await loadLastHealthDecayDate();

    const DAY = 24 * 60 * 60 * 1000;
    const decayCount = Math.floor((now - lastDecay) / DAY);

    if (decayCount <= 0) return;

    let newHealth = currentHealth;

    for (let i = 0; i < decayCount; i++) {
      if (newHealth <= 0) break;
      newHealth = Math.max(0, newHealth - (0.05 * newHealth + 5));
    }

    setHealth(newHealth);
    await saveHealth(newHealth);

    await saveLastHealthDecayDate(lastDecay + decayCount * DAY);
  };

  const applyHourlyEnergyDecay = async (currentEnergy: number) => {
    const now = Date.now();
    const lastDecay = await loadLastEnergyDecayDate();

    const HOUR = 60 * 60 * 1000;
    const decayCount = Math.floor((now - lastDecay) / HOUR);

    if (decayCount <= 0) return;

    const newEnergy = Math.max(0, currentEnergy - decayCount * 4);

    setEnergy(newEnergy);
    await saveEnergy(newEnergy);

    await saveLastEnergyDecayDate(lastDecay + decayCount * HOUR);
  };

  useEffect(() => {
    const hydrateGame = async () => {
      const storedName = await loadPetName();

      if (storedName) {
        setPetName(storedName);
      }

      const storedHealth = await loadHealth();
      const storedEnergy = await loadEnergy();

      setHealth(storedHealth);
      setEnergy(storedEnergy);

      await applyDailyHealthDecay(storedHealth);
      await applyHourlyEnergyDecay(storedEnergy);

      setIsHydrated(true);
    };

    void hydrateGame();
  }, []);
  
  useEffect(() => {
    if (!isHydrated) return;
    void saveHealth(health);
  }, [health, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    void saveEnergy(energy);
  }, [energy, isHydrated]);

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
        rewardHealthFromActivity,
        restoreEnergy,
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
