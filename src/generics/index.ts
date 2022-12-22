import { useTavueComponent } from "./useTavue";
import { useTavueColumnComponent } from "./useTavueColumn";

export function useTavue<RowType = unknown>() {
  return {
    Tavue: useTavueComponent<RowType>(),
    TavueColumn: useTavueColumnComponent<RowType>(),
  }
}
