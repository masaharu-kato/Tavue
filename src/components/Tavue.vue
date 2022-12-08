<script setup lang="ts">
import { onMounted, reactive, useSlots } from 'vue';
import { TableState, ColumnState, BorderState } from '../models/tavue';

defineProps<{
  rows: any[]
}>()

const slots = useSlots()
const row_header = slots.row_header!()[0]
const slot_row = slots.row!
const row_footer = slots.row_footer!()[0]
const columns = slots.columns!()

const table_state = reactive({} as TableState)
const col_states = reactive(columns.map(_ => ({} as ColumnState)));
const border_states = reactive([null, ...columns].map(_ => ({} as BorderState)));
const cols_cells = reactive(columns.map(_ => [] as HTMLElement[]));

const setCellsRef = columns.map((_, i) => (el: HTMLElement) => {
  cols_cells[i].push(el);
})

onMounted(() => {
  // console.log(`table: mounted`)
  // console.log(cells)
  cols_cells.map((col_cells, i) => {
    const widths = col_cells.map(cell => cell.offsetWidth);
    const max_width = widths.reduce((a, b) => a > b ? a : b, 0)
    col_states[i].enough_width = max_width;
    if (col_states[i].width == undefined) col_states[i].width = col_states[i].enough_width;
  })
})

function onMousemove(e: MouseEvent) {
  if (table_state.moving_border != undefined) {
    const i_border = table_state.moving_border;
    if (i_border > 0 && table_state.moving_last_x) {
      col_states[i_border - 1].width! += (e.screenX - table_state.moving_last_x);
    }
    table_state.moving_last_x = e.screenX;
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
  <div class="tavue-table" :class="{ resizing: !!table_state.moving_border }" @mousemove="onMousemove">

    <!-- row header -->
    <component :is="row_header" class="tavue-row tavue-row-header">
      <component v-for="(c, i) in columns" :is="c" v-bind="_states(i)" :is_header="true" />
    </component>

    <!-- row data (for each row in rows data) -->
    <component v-for="(row, row_i) in rows" :is="slot_row({row, row_i})[0]" class="tavue-row tavue-row-data">
      <component v-for="(c, i) in columns" :is="c" v-bind="_states(i)" :row="row" :row_i="row_i" />
    </component>

    <!-- row footer -->
    <component :is="row_footer" class="tavue-row tavue-row-footer">
      <component v-for="(c, i) in columns" :is="c" v-bind="_states(i)" :is_footer="true" />
    </component>

  </div>

</template>
