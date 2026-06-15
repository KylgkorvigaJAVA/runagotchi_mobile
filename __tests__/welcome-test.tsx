import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import Welcome from "@/app/welcome";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

jest.mock("@/features/profile/storage", () => ({
  loadPetName: jest.fn().mockResolvedValue(null),
  savePetName: jest.fn(),
}));

const { savePetName } = jest.requireMock("@/features/profile/storage") as {
  savePetName: jest.Mock;
};

describe("<Welcome />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ignores blank names", async () => {
    renderWithProviders(<Welcome />);

    const input = screen.getByPlaceholderText("Name");
    fireEvent.changeText(input, "   ");
    fireEvent(input, "submitEditing");

    await waitFor(() => expect(savePetName).not.toHaveBeenCalled());
  });

  it("accepts a trimmed minimum name", async () => {
    renderWithProviders(<Welcome />);

    const input = screen.getByPlaceholderText("Name");
    fireEvent.changeText(input, "  A  ");
    fireEvent(input, "submitEditing");

    await waitFor(() => expect(savePetName).toHaveBeenCalledWith("A"));
  });
});