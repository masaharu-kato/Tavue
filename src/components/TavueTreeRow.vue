<script setup lang="ts">
import { ref } from 'vue';
import { InternalTableProps, ColumnBinds, slot_node_0 } from '../models/tavue'
import TavueTreeRows from './TavueTreeRows.vue';
import TavueDataRow from './TavueDataRow.vue';

const props = defineProps<{
  row: unknown,
  row_i: number,
  depth: number,
  child_rows?: unknown[],
  tprops: InternalTableProps<unknown>,
}>()

//  Extract variables
const tp = props.tprops
const { cols_slots } = tp;
const { row, row_i, depth } = props;

//  Tree table: Children open (visibility) state
const is_open = ref(props.child_rows ? !!tp.children_opened : undefined)
const set_open = is_open !== undefined ? (f: boolean) => { is_open.value = f; tp.display_changed(); } : (f: boolean) => { };

//  Tree table: Width diffs (for the left-most column)
const col0_wdiff = tp.depth_offset ? tp.depth_offset(props.depth) : 0

//  Column bindings
const cols_binds = tp.cols_binds.map((col_binds, i) => ({
  ...col_binds,
  width_diff: i == 0 ? col0_wdiff : undefined,
  // is_open,
  // set_open,
} as ColumnBinds))

</script>
<template>

  <!-- Children exists -->
  <component v-if="child_rows" :is="slot_node_0(tp.row_slots.tree, { row, row_i, is_open, set_open }, 'div')"
    class="tavue-tree-row" :class="{ 'tavue-tree-row-opened': is_open }">

    <!-- Parent row -->
    <TavueDataRow
      :row_node="slot_node_0(tp.row_slots.tree_parent || tp.row_slots.data, { row, row_i, is_open, set_open }, 'div')"
      v-bind="{ cols_binds, cols_slots, row, row_i, is_open, set_open }" class="tavue-tree-row-parent">
    </TavueDataRow>

    <!-- Children rows -->
    <component :is="slot_node_0(tp.row_slots.tree_child, { row, row_i, is_open, set_open }, 'div')"
      class="tavue-rows tavue-tree-row-children">
      <TavueTreeRows :rows="child_rows" :tprops="tp" :depth="(depth + 1)"></TavueTreeRows>
    </component>

  </component>

  <!-- No children (parent row only) -->
  <TavueDataRow v-else :row_node="slot_node_0(tp.row_slots.data, { row, row_i, is_open, set_open }, 'div')"
    v-bind="{ cols_binds, cols_slots, row, row_i, is_open, set_open }">
  </TavueDataRow>

</template>
