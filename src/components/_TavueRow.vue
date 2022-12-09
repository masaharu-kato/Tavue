<script setup lang="ts">
import { ref } from 'vue';
import { RowType, InternalTableProps } from '../models/tavue'
import TavueRows from './_TavueRows.vue';

const props = defineProps<{
  row: RowType,
  row_i: number,
  depth: number,
  child_rows?: RowType[],
  tprops: InternalTableProps,
}>()

const tp = props.tprops
const { row, row_i, depth } = props;
const is_open = props.child_rows ? ref(!!tp.children_opened) : undefined;
const set_open = is_open !== undefined ? (f: boolean) => { is_open.value = f } : undefined;
const comp_row = tp.slot_row ? tp.slot_row({ row, row_i })[0] : 'div'
const comp_row_tree = tp.slot_row_tree ? tp.slot_row_tree({ row, row_i })[0] : 'div'
const comp_row_tree_parent = tp.slot_row_tree_parent ? tp.slot_row_tree_parent({ row, row_i })[0] : comp_row
const comp_row_tree_child = tp.slot_row_tree_child ? tp.slot_row_tree_child({ row, row_i })[0] : 'div'
const col0_wdiff = tp.depth_offset ? tp.depth_offset(props.depth) : 0
const wdiffs = tp.columns.map((_, i) => i == 0 ? col0_wdiff : 0)
// const col_binds = tp.column_binds.map((v, i) => ({ ...v, row, row_i, depth, is_open, set_open, width_diff: i == 0 ? width_diff : 0 }))

</script>
<template>

  <!-- Children exists -->
  <component v-if="child_rows" :is="comp_row_tree" class="tavue-row-tree"
    :class="{ 'tavue-row-tree-is-open': is_open }">
    <!-- Parent row -->
    <component :is="comp_row_tree_parent" class="tavue-row tavue-row-data tavue-row-tree-parent">
      <component v-for="(c, i) in tp.columns" :is="c"
        v-bind="{ ...tp.column_binds[i], row, row_i, depth, is_open, set_open, width_diff: wdiffs[i] }" />
    </component>
    <!-- Children rows -->
    <component :is="comp_row_tree_child" class="tavue-rows tavue-row-tree-children">
      <TavueRows :rows="child_rows" :tprops="tp" :depth="(depth + 1)"></TavueRows>
    </component>
  </component>

  <!-- No children (parent row only) -->
  <component v-else :is="comp_row" class="tavue-row tavue-row-data">
    <component v-for="(c, i) in tp.columns" :is="c"
      v-bind="{ ...tp.column_binds[i], row, row_i, depth, is_open, set_open, width_diff: wdiffs[i] }" />
  </component>

</template>
