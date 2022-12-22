import { defineComponent, h, VNode } from 'vue';
import { ExtractComponentProps } from './types';
import TavueComponent from '../components/Tavue.vue';
import { RowState } from '../models/tavue';

interface TavueProps<RowType> extends Omit<ExtractComponentProps<typeof TavueComponent>, 'rows' | 'tree_children'> {
  rows: RowType[]
  tree_children?: (row: RowType, row_i: number) => RowType[] | undefined
}

interface TavueSlotProps<RowType> {
  row: RowType
  row_i: number
  state: RowState,
}

export function useTavueComponent<RowType = unknown>() {
    const Tavue = defineComponent((props: TavueProps<RowType>, { slots }) => {
        return () => h(TavueComponent, props, slots)
    })
    return Tavue as typeof Tavue & {
        new(): {
            $slots: {
                header_row: () => VNode[]
                row: (arg: TavueSlotProps<RowType>) => VNode[]
                footer_row: () => VNode[]
                tree_row: (arg: TavueSlotProps<RowType>) => VNode[]
                tree_parent_row: (arg: TavueSlotProps<RowType>) => VNode[]
                tree_child_row: (arg: TavueSlotProps<RowType>) => VNode[]
                columns: () => VNode[]
            }
        }
    }
}
