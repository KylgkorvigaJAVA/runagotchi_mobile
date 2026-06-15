import { render, type RenderOptions } from "@testing-library/react-native";
import type { PropsWithChildren, ReactElement } from "react";

import { ActivityProvider } from "@/providers/ActivityContext";
import { GameProvider } from "@/providers/GameContext";

function Providers({ children }: PropsWithChildren) {
  return (
    <GameProvider>
      <ActivityProvider>{children}</ActivityProvider>
    </GameProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    wrapper: Providers,
    ...options,
  });
}
