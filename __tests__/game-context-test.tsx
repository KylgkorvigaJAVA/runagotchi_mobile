import { screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

import { useGame } from "@/providers/GameContext";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

jest.mock("@/features/profile/storage", () => ({
  loadPetName: jest.fn(),
}));

const { loadPetName } = jest.requireMock("@/features/profile/storage") as {
  loadPetName: jest.Mock;
};

function GameStateProbe() {
  const { energy, health, hasPetName, isHydrated, money, petName, screenState } = useGame();

  return (
    <>
      <Text>hydrated:{String(isHydrated)}</Text>
      <Text>hasPetName:{String(hasPetName)}</Text>
      <Text>health:{health}</Text>
      <Text>money:{money}</Text>
      <Text>energy:{energy}</Text>
      <Text>screen:{screenState}</Text>
      <Text>pet:{petName}</Text>
    </>
  );
}

describe("GameProvider", () => {
  beforeEach(() => {
    loadPetName.mockReset();
    loadPetName.mockResolvedValue(null);
  });

  it("provides the default game state", async () => {
    renderWithProviders(<GameStateProbe />);

    await waitFor(() => expect(screen.getByText("hydrated:true")).toBeTruthy());

    expect(screen.getByText("hasPetName:false")).toBeTruthy();
    expect(screen.getByText("health:50")).toBeTruthy();
    expect(screen.getByText("money:0")).toBeTruthy();
    expect(screen.getByText("energy:80")).toBeTruthy();
    expect(screen.getByText("screen:home")).toBeTruthy();
    expect(screen.getByText("pet:")).toBeTruthy();
  });

  it("hydrates a stored pet name", async () => {
    loadPetName.mockResolvedValueOnce("Bella");

    renderWithProviders(<GameStateProbe />);

    await waitFor(() => expect(screen.getByText("pet:Bella")).toBeTruthy());
    expect(screen.getByText("hasPetName:true")).toBeTruthy();
  });
});
