<script setup lang="ts">
import { InternalTableProps } from '../models/tavue'
import TavueTreeRow from './TavueTreeRow.vue';

const props = defineProps<{
  rows: unknown[],
  tprops: InternalTableProps<unknown>,
  depth: number,
}>()

const rp = props.tprops

function _children(row: unknown, row_i: number) {
  if (!rp.tree_children) return undefined
  return rp.tree_children(row, row_i)
}

</script>
<template>
  <template v-for="(row, row_i) in rows">
    <TavueTreeRow v-bind="{ row, row_i, tprops, depth, child_rows: _children(row, row_i) }"></TavueTreeRow>
  </template>
</template>
