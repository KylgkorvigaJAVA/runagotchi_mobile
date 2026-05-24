import { createInitialHomeScreenData } from "./mockHomeScreenData";
import { HomeScreenData } from "./types";

export interface HomeScreenRepository {
  getHomeScreenData(): Promise<HomeScreenData>;
}

class MockHomeScreenRepository implements HomeScreenRepository {
  async getHomeScreenData(): Promise<HomeScreenData> {
    return createInitialHomeScreenData();
  }
}

export const homeScreenRepository: HomeScreenRepository = new MockHomeScreenRepository();
