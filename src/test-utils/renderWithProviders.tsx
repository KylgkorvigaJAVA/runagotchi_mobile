import { render, type RenderOptions } from "@testing-library/react-native";
import type { PropsWithChildren, ReactElement } from "react";

import { GameProvider } from "@/components/GameContext";

function Providers({ children }: PropsWithChildren) {
  return <GameProvider>{children}</GameProvider>;
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
