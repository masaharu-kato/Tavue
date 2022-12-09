<script setup lang="ts">
import { onMounted, reactive, Slots, useSlots, VNodeRef } from 'vue';
import { RowType, InternalTableProps, ColumnBinds, ColumnSlots, TableState, ColumnState, BorderState, slot_nodes, slot_node_0, RowSlots, ColumnProps } from '../models/tavue';
import TavueTreeRows from './_TavueTreeRows.vue';
import TavueRow from './_TavueRow.vue';

//  Border width
const DETECT_WIDTH = 5;

// const props = defineProps<{
//   rows: RowType[]
// } & TableProps>()

const props = defineProps<{
  rows: RowType[]
  tree_children?: (row: RowType, row_i: number) => RowType[] | undefined
  children_opened?: boolean
  depth_offset?: (depth: number) => number
}>()

//  Extract variables
const { tree_children, depth_offset } = props;
const children_opened = !!props.children_opened;

const slots = useSlots()
const header_row_node = slot_node_0(slots.row_header, undefined, 'div')
const footer_row_node = slot_node_0(slots.row_footer, undefined, 'div')
const row_slots = {
  data: slots.row,
  tree: slots.tree_row,
  tree_parent: slots.tree_parent_row,
  tree_child: slots.tree_child_row,
} as RowSlots;

//  Columns
if (!slots.columns) throw new Error('Slot `columns` not specified.')

//  Set column indexes
const cols_i = slots.columns().map((_, i) => i)

//  Load slots of columns
const cols_slots = slots.columns().map(c => {
  if (!(c.children instanceof Object) || c.children instanceof Array) {
    throw new Error('Invalid node in `columns` slot.')
  }
  const slots = c.children as Slots
  return {
    header: slot_nodes(slots.header),
    row: slots.row ? props => slots.row!(props) : props => [],
    footer: slot_nodes(slots.footer),
  } as ColumnSlots
})

//  Load props of columns
const cols_props = slots.columns().map(c => {
  const c_props = (c.props ?? {}) as ColumnProps
  if (!c_props.name) throw new Error('Column name is not set.')
  return c_props;
})

//  Header columns values
const cols_header_nodes = cols_slots.map(col_slots => col_slots.header)
const cols_footer_nodes = cols_slots.map(col_slots => col_slots.footer)


//  States
const table_state = reactive({} as TableState)
const col_states = reactive(cols_i.map(_ => ({} as ColumnState)));
const borders = reactive([null, ...cols_i].map(_ => ({} as BorderState)));
const cols_cells = reactive(cols_i.map(_ => [] as HTMLElement[]));

//  Properties for Column
const cols_binds = cols_i.map(i => ({
  index: i,
  table_state,
  state: col_states[i],
  border_L: borders[i],
  border_R: borders[i + 1],
  ref_to: ((el: HTMLElement) => { cols_cells[i].push(el) }) as unknown as VNodeRef
} as ColumnBinds))

//  Table properties for Rows
const tprops = {
  tree_children,
  children_opened,
  depth_offset,
  cols_i,
  cols_props,
  cols_slots,
  cols_binds,
  row_slots,
} as InternalTableProps

onMounted(() => {
  cols_cells.map((col_cells, i) => {
    const widths = col_cells.map(cell => cell.offsetWidth);
    const max_width = widths.reduce((a, b) => a > b ? a : b, 0)
    col_states[i].enough_width = max_width + 1;
    if (col_states[i].width == undefined) col_states[i].width = col_states[i].enough_width;
  })
})

//  Get a target column on the current cursor location
function getTargetColumn(e: MouseEvent) {
  const _t_col_i = (e.target as HTMLElement).dataset.col_i
  if (_t_col_i == undefined) return undefined
  return Number(_t_col_i); //  Hovering column index
}

//  Set the border hovering state
function setBorderHover(i: number, hover: boolean) {
  const border = borders[i];
  if (border && i >= 1 && cols_props[i - 1].resizeable) {
    if (hover) {
      if (!border.hover) {
        border.hover = true;
        table_state.hovering_border = i;
      }
    } else {
      if (border.hover) {
        border.hover = false;
        table_state.hovering_border = undefined;
      }
    }
  }
}

//  Start the border moving
function startBorderMove(i: number, e: MouseEvent) {
  const border = borders[i];
  if (border && i >= 1 && cols_props[i - 1].resizeable) {
    if (border.hover && !border.moving && !table_state.moving_border) {
      border.moving = true
      table_state.moving_border = i;
      table_state.moving_last_x = e.screenX;
    }
  }
}

function onMouseDown(e: MouseEvent) {
  const t_col_i = getTargetColumn(e)
  if (t_col_i != undefined) {
    startBorderMove(t_col_i, e)
    startBorderMove(t_col_i + 1, e)
  }
}

function onMousemove(e: MouseEvent) {
  //  Process column border movements
  if (table_state.moving_border != undefined) {
    const i_border = table_state.moving_border;
    if (i_border > 0 && table_state.moving_last_x) {
      col_states[i_border - 1].width! += (e.screenX - table_state.moving_last_x);
    }
    table_state.moving_last_x = e.screenX
    return
  }
  //  Get the current hovering column
  const t_col_i = getTargetColumn(e)
  if (t_col_i != undefined) {
    const width = col_states[t_col_i].width!
    //  Set hover states
    if (table_state.hovering_col_i != t_col_i) {
      col_states.map((cs, i) => { cs.hover = i == t_col_i })
      table_state.hovering_col_i = t_col_i
    }
    setBorderHover(t_col_i, e.offsetX <= DETECT_WIDTH)
    setBorderHover(t_col_i + 1, (width - e.offsetX) <= DETECT_WIDTH)
  }
}

function onMouseUp(e: MouseEvent) {
  if (table_state.moving_border) {
    const border = borders[table_state.moving_border];
    border.moving = false;
    table_state.moving_border = undefined;
    table_state.moving_last_x = undefined;
  }
}

function onDoubleClick(e: MouseEvent) {
  //  If the hovering border exists and not 0 (= most left border),
  //  justify the column width on the left of the border.
  if (table_state.hovering_border) {
    const col = col_states[table_state.hovering_border - 1]
    col.width = col.enough_width;
    e.stopPropagation();
  }
}

</script>
<template>

  <!-- Definition of Slots (for develpments only, not shown) -->
  <slot v-if="null" name="header_row"></slot>
  <slot v-if="null" name="row" :row="(null as RowType)" :row_i="0" :is_open="false"></slot>
  <slot v-if="null" name="footer_row"></slot>
  <slot v-if="null" name="tree_row" :row="(null as RowType)" :row_i="0"></slot>
  <slot v-if="null" name="tree_parent_row" :row="(null as RowType)" :row_i="0"></slot>
  <slot v-if="null" name="tree_child_row" :row="(null as RowType)" :row_i="0"></slot>
  <slot v-if="null" name="columns"></slot>


  <!-- Actual elements -->

  <!-- Tavue table -->
  <div class="tavue-rows tavue-table" :class="{ resizing: !!table_state.moving_border }" @mousedown="onMouseDown"
    @mouseup="onMouseUp" @mousemove="onMousemove" @dblclick="onDoubleClick">

    <!-- row header -->
    <TavueRow :row_node="header_row_node" :cols_binds="cols_binds" :cols_nodes="cols_header_nodes"
      class="tavue-row-header">
    </TavueRow>

    <!-- row data (for each row in rows data) -->
    <TavueTreeRows :rows="rows" :tprops="tprops" :depth="0"></TavueTreeRows>

    <!-- row footer -->
    <TavueRow :row_node="footer_row_node" :cols_binds="cols_binds" :cols_nodes="cols_footer_nodes"
      class="tavue-row-footer">
    </TavueRow>

  </div>

</template>
