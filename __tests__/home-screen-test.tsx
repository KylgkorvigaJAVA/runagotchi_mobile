import { fireEvent, screen } from "@testing-library/react-native";

import Index from "@/app/index";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

jest.mock("@/features/profile/storage", () => ({
  loadPetName: jest.fn().mockResolvedValue(null),
}));

describe("<Index />", () => {
  it("renders the home screen controls", async () => {
    renderWithProviders(<Index />);

    await screen.findByLabelText("Open stats");

    expect(screen.getByLabelText("Open stats")).toBeTruthy();
    expect(screen.getByLabelText("Start activity")).toBeTruthy();
    expect(screen.getByLabelText("Open shop")).toBeTruthy();
  });

  it("opens and closes the stats panel", async () => {
    renderWithProviders(<Index />);

    await screen.findByLabelText("Open stats");

    fireEvent.press(screen.getByLabelText("Open stats"));
    expect(screen.getByTestId("stats-panel")).toBeTruthy();

    fireEvent.press(screen.getByTestId("close-stats-button"));
    expect(screen.queryByTestId("stats-panel")).toBeNull();
  });

  it("switches from the stats panel to the shop panel", async () => {
    renderWithProviders(<Index />);

    await screen.findByLabelText("Open stats");

    fireEvent.press(screen.getByLabelText("Open stats"));
    expect(screen.getByTestId("stats-panel")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Open shop"));
    expect(screen.queryByTestId("stats-panel")).toBeNull();
    expect(screen.getByTestId("shop-panel")).toBeTruthy();
  });
});
