import { fireEvent, screen } from "@testing-library/react-native";

import BottomNavigation from "@/components/BottomNavigation";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

jest.mock("@/features/profile/storage", () => ({
  loadPetName: jest.fn().mockResolvedValue(null),
}));

describe("BottomNavigation", () => {
  it("moves between the home and ready states", async () => {
    renderWithProviders(<BottomNavigation />);

    await screen.findByLabelText("Start activity");

    fireEvent.press(screen.getByLabelText("Start activity"));

    expect(screen.queryByLabelText("Open stats")).toBeNull();
    expect(screen.queryByLabelText("Open shop")).toBeNull();
    expect(screen.getByLabelText("Back")).toBeTruthy();
    expect(screen.getByLabelText("Start")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Back"));

    expect(screen.getByLabelText("Open stats")).toBeTruthy();
    expect(screen.getByLabelText("Start activity")).toBeTruthy();
    expect(screen.getByLabelText("Open shop")).toBeTruthy();
  });
});