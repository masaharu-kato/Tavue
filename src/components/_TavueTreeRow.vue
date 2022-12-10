<script setup lang="ts">
import { ref } from 'vue';
import { RowType, InternalTableProps, ColumnBinds, slot_node_0 } from '../models/tavue'
import TavueTreeRows from './_TavueTreeRows.vue';
import TavueDataRow from './_TavueDataRow.vue';

const props = defineProps<{
  row: RowType,
  row_i: number,
  depth: number,
  child_rows?: RowType[],
  tprops: InternalTableProps,
}>()

//  Extract variables
const tp = props.tprops
const { cols_slots } = tp;
const { row, row_i, depth } = props;

//  Row nodes
const row_node = slot_node_0(tp.row_slots.data, { row, row_i }, 'div')
const tree_row_node = slot_node_0(tp.row_slots.tree, { row, row_i }, 'div')
const tree_parent_row_node = slot_node_0(tp.row_slots.tree_parent, { row, row_i }, row_node)
const tree_child_row_node = slot_node_0(tp.row_slots.tree_child, { row, row_i }, 'div')

//  Tree table: Children open (visibility) state
const is_open = props.child_rows ? ref(!!tp.children_opened) : undefined;
const set_open = is_open !== undefined ? (f: boolean) => { is_open.value = f } : (f: boolean) => { };

//  Tree table: Width diffs (for the left-most column)
const col0_wdiff = tp.depth_offset ? tp.depth_offset(props.depth) : 0
// const col_binds = tp.column_binds.map((v, i) => ({ ...v, row, row_i, depth, is_open, set_open, width_diff: i == 0 ? width_diff : 0 }))

//  Column bindings
const cols_binds = tp.cols_binds.map((col_binds, i) => ({
  ...col_binds,
  width_diff: i == 0 ? col0_wdiff : 0,
  // is_open,
  // set_open,
} as ColumnBinds))

</script>
<template>

  <!-- Children exists -->
  <component v-if="child_rows" :is="tree_row_node" class="tavue-row-tree"
    :class="{ 'tavue-row-tree-is-open': is_open }">

    <!-- Parent row -->
    <TavueDataRow :row_node="tree_parent_row_node" v-bind="{ cols_binds, cols_slots, row, row_i, is_open, set_open }"
      class="tavue-row-tree-parent">
    </TavueDataRow>

    <!-- Children rows -->
    <component :is="tree_child_row_node" class="tavue-rows tavue-row-tree-children">
      <TavueTreeRows :rows="child_rows" :tprops="tp" :depth="(depth + 1)"></TavueTreeRows>
    </component>

  </component>

  <!-- No children (parent row only) -->
  <TavueDataRow v-else v-bind="{ row_node, cols_binds, cols_slots, row, row_i, is_open, set_open }">
  </TavueDataRow>

</template>
