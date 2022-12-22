<script setup lang="ts">
import { VNode } from 'vue';
import { ColumnBinds, ColumnSlots, RowState } from '../models/tavue';
import TavueRow from './TavueRow.vue';

const props = defineProps<{
  row_node: VNode,
  cols_binds: ColumnBinds[],
  cols_slots: ColumnSlots<unknown>[],
  row: unknown,
  row_i: number,
  state: RowState,
}>()

</script>

<template>
  <TavueRow :row_node="row_node" :cols_binds="cols_binds"
    :cols_nodes="cols_slots.map(col_slots => col_slots.row({ row, row_i, state }))" class="tavue-data-row">
  </TavueRow>
</template>
