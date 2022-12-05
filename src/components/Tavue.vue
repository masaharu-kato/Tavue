<script setup lang="ts">
import { onMounted, reactive, useSlots } from 'vue';
import { TableState, ColumnState, BorderState } from '../models/tavue';

defineProps<{
  rows: any[]
}>()

const slots = useSlots()
const columns = slots.default ? slots.default() : []

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

</script>
<template>
  <div class="tavue-table" :class="{ resizing: !!table_state.moving_border }" @mousemove="onMousemove">
    <div class="tavue-row tavue-header-row">
      <template v-for="(c, i) in columns">
        <component :is="c"
          v-bind="{ index: i, table_state: table_state, state: col_states[i], border_left: border_states[i], border_right: border_states[i + 1], is_header: true, ref_to: setCellsRef[i] }">
        </component>
      </template>
    </div>
    <div v-for="(row, row_i) in rows" class="tavue-row tavue-rows-row">
      <template v-for="(c, i) in columns">
        <component :is="c"
          v-bind="{ index: i, table_state: table_state, state: col_states[i], border_left: border_states[i], border_right: border_states[i + 1], row_index: row_i, row: row, ref_to: setCellsRef[i] }">
        </component>
      </template>
    </div>
    <div class="tavue-row tavue-footer-row">
      <template v-for="(c, i) in columns">
        <component :is="c"
          v-bind="{ index: i, table_state: table_state, state: col_states[i], border_left: border_states[i], border_right: border_states[i + 1], is_footer: true, ref_to: setCellsRef[i] }">
        </component>
      </template>
    </div>
  </div>
</template>
