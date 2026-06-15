import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useEffect } from "react";
import { Text } from "react-native";

import SettingsContent from "@/components/SettingsContent";
import { useGame } from "@/providers/GameContext";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

jest.mock("@/features/profile/storage", () => ({
  loadPetName: jest.fn().mockResolvedValue(null),
  savePetName: jest.fn(),
  clearPetProfile: jest.fn(),
}));

const { clearPetProfile, savePetName } = jest.requireMock("@/features/profile/storage") as {
  clearPetProfile: jest.Mock;
  savePetName: jest.Mock;
};

function SettingsHarness({ onClose }: { onClose: jest.Mock }) {
  const { petName, setPetName } = useGame();

  useEffect(() => {
    if (!petName) {
      setPetName("Bella");
    }
  }, [petName, setPetName]);

  if (!petName) {
    return <Text>loading</Text>;
  }

  return <SettingsContent onClose={onClose} />;
}

describe("<SettingsContent />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saves a trimmed pet name", async () => {
    const onClose = jest.fn();

    renderWithProviders(<SettingsHarness onClose={onClose} />);

    const input = await screen.findByPlaceholderText("Name");
    fireEvent.changeText(input, "  Bella Jr  ");
    fireEvent.press(screen.getByText("SAVE NAME"));

    await waitFor(() => expect(savePetName).toHaveBeenCalledWith("Bella Jr"));
    expect(onClose).toHaveBeenCalled();
  });

  it("clears the stored profile", async () => {
    const onClose = jest.fn();

    renderWithProviders(<SettingsHarness onClose={onClose} />);

    await screen.findByPlaceholderText("Name");
    fireEvent.press(screen.getByText("CLEAR PROFILE"));

    await waitFor(() => expect(clearPetProfile).toHaveBeenCalled());
    expect(onClose).toHaveBeenCalled();
  });
});