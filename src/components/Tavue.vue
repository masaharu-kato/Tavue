<script setup lang="ts">
import { onMounted, reactive, useSlots } from 'vue';
import { TableState, ColumnState, BorderState } from '../models/tavue';

defineProps<{
  rows: any[]
}>()

const DETECT_WIDTH = 5;

const slots = useSlots()
const row_header = slots.row_header ? slots.row_header()[0] : 'div'
const slot_row = slots.row
const row_footer = slots.row_footer ? slots.row_footer()[0] : 'div'
const columns = slots.columns ? slots.columns() : []

const table_state = reactive({} as TableState)
const col_states = reactive(columns.map(_ => ({} as ColumnState)));
const border_states = reactive([null, ...columns].map(_ => ({} as BorderState)));
const cols_cells = reactive(columns.map(_ => [] as HTMLElement[]));

const setCellsRef = columns.map((_, i) => (el: HTMLElement) => {
  cols_cells[i].push(el);
})

onMounted(() => {
  cols_cells.map((col_cells, i) => {
    const widths = col_cells.map(cell => cell.offsetWidth);
    const max_width = widths.reduce((a, b) => a > b ? a : b, 0)
    col_states[i].enough_width = max_width;
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
  const border = border_states[i];
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

//  Start the border moving
function startBorderMove(i: number, e: MouseEvent) {
  const border = border_states[i];
  if (border.hover && !border.moving && !table_state.moving_border) {
    border.moving = true
    table_state.moving_border = i;
    table_state.moving_last_x = e.screenX;
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
    const border = border_states[table_state.moving_border];
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

function _states(i: number) {
  return {
    index: i,
    table_state: table_state,
    state: col_states[i],
    border_left: border_states[i],
    border_right: border_states[i + 1],
    ref_to: setCellsRef[i]
  }
}

</script>
<template>

  <!-- Definition of Slots (for develpments only, not shown) -->
  <slot v-if="null" name="row_header"></slot>
  <slot v-if="null" name="row" :row="null" :row_i="0"></slot>
  <slot v-if="null" name="row_footer"></slot>
  <slot v-if="null" name="columns"></slot>


  <!-- Actual elements -->

  <!-- Tavue table -->
  <div class="tavue-table" :class="{ resizing: !!table_state.moving_border }" @mousedown="onMouseDown"
    @mouseup="onMouseUp" @mousemove="onMousemove" @dblclick="onDoubleClick">

    <!-- row header -->
    <component :is="row_header" class="tavue-row tavue-row-header">
      <component v-for="(c, i) in columns" :is="c" v-bind="_states(i)" :is_header="true" />
    </component>

    <!-- row data (for each row in rows data) -->
    <component v-for="(row, row_i) in rows" :is="slot_row ? slot_row({ row, row_i })[0] : 'div'"
      class="tavue-row tavue-row-data">
      <component v-for="(c, i) in columns" :is="c" v-bind="_states(i)" :row="row" :row_i="row_i" />
    </component>

    <!-- row footer -->
    <component :is="row_footer" class="tavue-row tavue-row-footer">
      <component v-for="(c, i) in columns" :is="c" v-bind="_states(i)" :is_footer="true" />
    </component>

  </div>

</template>
