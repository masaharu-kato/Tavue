import { Slot, VNode } from "vue"

export type RowType = any

export interface TableState {
  hovering_col_i?: number
  hovering_border?: number
  moving_border?: number
  moving_last_x?: number
}

export interface ColumnState {
  width?: number
  enough_width?: number
  hover?: boolean
}

export interface BorderState {
  hover?: boolean
  moving?: boolean
  moving_last_x?: number
}

export type TableProps = {
  tree_children: (row: RowType, row_i: number) => RowType[] | undefined
  children_opened?: boolean
  depth_offset?: (depth: number) => number
}

export interface InternalTableProps extends TableProps {
  columns: VNode[]
  column_binds: { [k: string]: any }[]
  slot_row?: Slot
  slot_row_tree?: Slot
  slot_row_tree_parent?: Slot
  slot_row_tree_child?: Slot
}
