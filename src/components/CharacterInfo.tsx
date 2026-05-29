import { screenConfig } from "@/config/ScreenConfig";
import { useGame } from "../providers/GameContext";
import ActiveInfo from "./characterInfoContent/ActiveInfo";
import FinishedInfo from "./characterInfoContent/FinishedInfo";
import IdleInfo from "./characterInfoContent/IdleInfo";

export default function CharacterInfo() {
  const { screenState } = useGame();
  const config = screenConfig[screenState];

  if (config.text === "active") { return <ActiveInfo /> }
  if (config.text === "finished") { return <FinishedInfo /> }
  return <IdleInfo />
}
