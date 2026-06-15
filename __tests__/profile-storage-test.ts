import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearPetProfile, loadPetName, savePetName } from "@/features/profile/storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe("profile storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("trims pet names before saving them", async () => {
    await savePetName("  Bella  ");

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith("petName", "Bella");
  });

  it("loads the stored pet name", async () => {
    mockedAsyncStorage.getItem.mockResolvedValueOnce("Bella");

    await expect(loadPetName()).resolves.toBe("Bella");
    expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith("petName");
  });

  it("clears the stored pet profile", async () => {
    await clearPetProfile();

    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith("petName");
  });
});