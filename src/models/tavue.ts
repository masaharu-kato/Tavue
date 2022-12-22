import { Slot, VNode } from "vue"

export interface TableState {
  hovering_col_i?: number
  hovering_border?: number
  moving_border?: number
  moving_init_width?: number
  moving_init_x?: number
}

export interface ColumnState {
  width?: number
  user_width?: number
  enough_width?: number
  hover?: boolean
}

export interface BorderState {
  hover?: boolean
  moving?: boolean
  moving_last_x?: number
}

export interface RowSlotProps<RowType> {
  row: RowType,
  row_i: number,
  is_open?: boolean,
  set_open: (f: boolean) => void,
}

export interface ColumnSlots<RowType> {
  header: VNode[],
  row: (props: RowSlotProps<RowType>) => VNode[],
  footer: VNode[],
}

export interface ColumnBindsOnTable {
  index: number,
  name: string,
  table_state: TableState,
  state: ColumnState,
  border_L?: BorderState,
  border_R?: BorderState,
}

export interface ColumnBinds extends ColumnBindsOnTable {
  width_diff?: number,  //  Width difference from standard (for tree table)
  // is_open?: boolean,    //  (Tree table) Child table is open (visible) or not
  // set_open: (f: boolean) => void,  //  (Tree table) Set child table open state
}

export interface RowSlots {
  header?: Slot
  footer?: Slot
  data?: Slot
  tree?: Slot
  tree_parent?: Slot
  tree_child?: Slot
}

export type TableProps<RowType> = {
  tree_children?: (row: RowType, row_i: number) => RowType[] | undefined
  children_opened?: boolean
  depth_offset?: (depth: number) => number
}

export interface InternalTableProps<RowType> extends TableProps<RowType> {
  table_state: TableState,
  cols_state: ColumnState[],
  borders_state: BorderState[],
  cols_i: number[]
  cols_props: ColumnProps[]
  cols_slots: ColumnSlots<RowType>[]
  cols_binds: ColumnBinds[]
  row_slots: RowSlots
  display_changed: () => void,
}

export interface ColumnOptions {
  min_width?: number, //  Minimum width
  max_width?: number, //  Maximum width
  resizeable?: boolean,  //  Is resizeable or not
  // sortable?: boolean,    //  Is sortable or not
  // filtable?: boolean,    //  Is filtable or not
  // auto_expand?: boolean, //  Expand width if the some contents are hidden
  // auto_shrink?: boolean, //  Shrink width if the some cell widths are too large
}

export interface ColumnProps extends ColumnOptions {
  name: string,          //  Column name
  width?: number,        //  Initial width 
}

export interface TableOptions<RowType> {
  table: TableProps<RowType>
  row: {
    slots: RowSlots
  }
  cols: {
    props: ColumnProps
    slots: ColumnSlots<RowType>
  }[]
}

export function slot_nodes(slot: Slot | undefined, props?: Object) {
  return slot ? slot(props) : []
}

export function slot_node_0(slot: Slot | undefined, props: Object | undefined, def_node: VNode | string): VNode {
  const nodes = slot_nodes(slot, props)
  return nodes.length ? nodes[0] : (def_node as VNode)
}
