import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { useGame } from "@/components/GameContext";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

function GameStateProbe() {
  const { energy, health, money, petName, screenState } = useGame();

  return (
    <>
      <Text>health:{health}</Text>
      <Text>money:{money}</Text>
      <Text>energy:{energy}</Text>
      <Text>screen:{screenState}</Text>
      <Text>pet:{petName}</Text>
    </>
  );
}

describe("GameProvider", () => {
  it("provides the default game state", () => {
    renderWithProviders(<GameStateProbe />);

    expect(screen.getByText("health:50")).toBeTruthy();
    expect(screen.getByText("money:0")).toBeTruthy();
    expect(screen.getByText("energy:80")).toBeTruthy();
    expect(screen.getByText("screen:home")).toBeTruthy();
    expect(screen.getByText("pet:Bella")).toBeTruthy();
  });
});
