import { fireEvent, screen } from "@testing-library/react-native";

import Index from "@/app/index";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("<Index />", () => {
  it("renders the home screen controls", () => {
    renderWithProviders(<Index />);

    expect(screen.getByTestId("home-screen")).toBeTruthy();
    expect(screen.getByTestId("stats-button")).toBeTruthy();
    expect(screen.getByTestId("activity-button")).toBeTruthy();
    expect(screen.getByTestId("shop-button")).toBeTruthy();
  });

  it("opens and closes the stats panel", () => {
    renderWithProviders(<Index />);

    fireEvent.press(screen.getByTestId("stats-button"));
    expect(screen.getByTestId("stats-panel")).toBeTruthy();

    fireEvent.press(screen.getByTestId("close-stats-button"));
    expect(screen.queryByTestId("stats-panel")).toBeNull();
  });

  it("switches from the stats panel to the shop panel", () => {
    renderWithProviders(<Index />);

    fireEvent.press(screen.getByTestId("stats-button"));
    expect(screen.getByTestId("stats-panel")).toBeTruthy();

    fireEvent.press(screen.getByTestId("shop-button"));
    expect(screen.queryByTestId("stats-panel")).toBeNull();
    expect(screen.getByTestId("shop-panel")).toBeTruthy();
  });
});
