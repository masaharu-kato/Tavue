<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, Slots, useSlots, VNodeRef } from 'vue';
import { RowType, InternalTableProps, ColumnBinds, TableOptions, TableState, ColumnState, BorderState, slot_node_0 } from '../models/tavue';
import TavueTreeRows from './TavueTreeRows.vue';
import TavueRow from './TavueRow.vue';

//  Border width
const DETECT_WIDTH = 5;

const props = defineProps<{
  rows: RowType[]
  opts: TableOptions
}>()

const { opts } = props;

const cols_i = opts.cols.map((_, i) => i)
const cols_props = opts.cols.map(c => c.props)
const cols_slots = opts.cols.map(c => c.slots)
const row_slots = opts.row.slots

//  States
const table_state = reactive({} as TableState)
const cols_state = reactive(cols_i.map(_ => ({} as ColumnState)));
const borders_state = reactive([null, ...cols_i].map(_ => ({} as BorderState)));

//  Properties for Column
const cols_binds = cols_i.map(i => ({
  index: i,
  name: cols_props[i].name,
  table_state,
  state: cols_state[i],
  border_L: borders_state[i],
  border_R: borders_state[i + 1],
} as ColumnBinds))

//  Set default column width
cols_i.map(col_i => {
  cols_state[col_i].width = cols_props[col_i].width
  cols_state[col_i].user_width = cols_state[col_i].width
})

function display_changed() {
  nextTick(() => {
    refreshAndJustifyColumnsWidth()
  })
}

const { tree_children, children_opened, depth_offset } = opts.table

//  Table properties for Rows
const tprops: InternalTableProps = {
  table_state,
  cols_state,
  borders_state,
  tree_children,
  children_opened,
  depth_offset,
  cols_i,
  cols_props,
  cols_slots,
  cols_binds,
  row_slots,
  display_changed,
}

onMounted(() => {
  refreshAndJustifyColumnsWidth()
})

//  Table HTML Element
const table_elm_ref = ref<HTMLElement>()

function getTableElement() {
  if (!table_elm_ref.value) throw new Error('Table element is not set.')
  return table_elm_ref.value
}

function getElement<ET extends Element>(elm: ET, query: string) {
  const res_elm = elm.querySelector(query) as ET | null
  return res_elm
}

function getElements<ET extends Element>(elm: ET, query: string) {
  const res_elms = [] as ET[]
  elm.querySelectorAll(query).forEach(elm => res_elms.push(elm as ET))
  return res_elms
}

//  Refresh enough width values of columns
function refreshColumnWidth(col_i: number) {
  cols_state[col_i].width = undefined;
  const table_elm = getTableElement();
  const rows = getElements(table_elm, '.tavue-row')
  const cells = rows.map(row => getElement(row, `.tavue-cell[data-col_i="${col_i}"]`)).filter(elm => elm) as HTMLElement[]
  nextTick(() => {
    const widths = cells.map(cell =>
      cell.offsetParent !== null
        ? (cell.offsetWidth + (Number(cell.dataset.width_diff) || 0) + 1)
        : null)
    cols_state[col_i].enough_width = (widths.filter(w => w !== null) as number[]).reduce((a, b) => a > b ? a : b, 0)
    cols_state[col_i].width = cols_state[col_i].enough_width
    cols_state[col_i].user_width = undefined
  })
}

function refreshAndJustifyColumnsWidth() {
  cols_i.map(col_i => {
    const state = cols_state[col_i]
    if (!state.user_width) refreshColumnWidth(col_i)
  })
}

//  Get a target column on the current cursor location
function getTargetColumn(e: MouseEvent) {
  const _t_col_i = (e.target as HTMLElement).dataset.col_i
  if (_t_col_i == undefined) return undefined
  return Number(_t_col_i); //  Hovering column index
}

//  Set the border hovering state
function setBorderHover(i: number, hover: boolean) {
  const border = borders_state[i];
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
  const border = borders_state[i];
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

function onMouseMove(e: MouseEvent) {

  //  Process column border movements
  if (table_state.moving_border != undefined) {
    const i_border = table_state.moving_border;
    if (i_border > 0 && table_state.moving_last_x) {
      const state = cols_state[i_border - 1];
      state.width! += (e.screenX - table_state.moving_last_x);
      state.user_width = state.width;
    }
    table_state.moving_last_x = e.screenX
    return
  }

  //  Get the current hovering column
  const t_col_i = getTargetColumn(e)
  if (t_col_i != undefined) {
    const width = cols_state[t_col_i].width!
    //  Set hover states
    if (table_state.hovering_col_i != t_col_i) {
      cols_state.map((cs, i) => { cs.hover = i == t_col_i })
      table_state.hovering_col_i = t_col_i
    }
    setBorderHover(t_col_i, e.offsetX <= DETECT_WIDTH)
    setBorderHover(t_col_i + 1, (width - e.offsetX) <= DETECT_WIDTH)
  }
}

function onMouseUp(e: MouseEvent) {
  if (table_state.moving_border) {
    const border = borders_state[table_state.moving_border];
    border.moving = false;
    table_state.moving_border = undefined;
    table_state.moving_last_x = undefined;
  }
}

function onDoubleClick(e: MouseEvent) {
  //  If the hovering border exists and not 0 (= most left border),
  //  justify the column width on the left of the border.
  if (table_state.hovering_border) {
    const col_i = table_state.hovering_border - 1
    refreshColumnWidth(col_i)
  }
}

</script>
<template>

  <!-- Tavue table -->
  <div ref="table_elm_ref" class="tavue-rows tavue-table" :class="{ resizing: !!table_state.moving_border }"
    @mousedown="onMouseDown" @mouseup="onMouseUp" @mousemove="onMouseMove" @dblclick="onDoubleClick">

    <!-- row header -->
    <TavueRow :row_node="slot_node_0(opts.row.slots.header, {}, 'div')" :cols_binds="cols_binds"
      :cols_nodes="cols_slots.map(col_slots => col_slots.header)" class="tavue-header-row">
    </TavueRow>

    <!-- row data (for each row in rows data) -->
    <TavueTreeRows :rows="rows" :tprops="tprops" :depth="0"></TavueTreeRows>

    <!-- row footer -->
    <TavueRow :row_node="slot_node_0(opts.row.slots.footer, {}, 'div')" :cols_binds="cols_binds"
      :cols_nodes="cols_slots.map(col_slots => col_slots.footer)" class="tavue-footer-row">
    </TavueRow>

  </div>

</template>
