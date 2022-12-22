import { defineComponent, h, VNode } from 'vue';
import { ExtractComponentProps } from './types';
import TavueColumnComponent from '../components/TavueColumn.vue';
import { RowState } from '../models/tavue';

interface TavueColumnProps<RowType> extends ExtractComponentProps<typeof TavueColumnComponent> {
}

interface TavueColumnSlotProps<RowType> {
  row: RowType
  row_i: number
  state: RowState
}

export function useTavueColumnComponent<RowType = unknown>() {
    const Tavue = defineComponent((props: TavueColumnProps<RowType>, { slots }) => {
        return () => h(TavueColumnComponent, props, slots)
    })
    return Tavue as typeof Tavue & {
        new(): {
            $slots: {
                header: () => VNode[]
                row: (arg: TavueColumnSlotProps<RowType>) => VNode[]
                footer: () => VNode[]
            }
        }
    }
}
