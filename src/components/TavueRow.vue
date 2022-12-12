<script setup lang="ts">
import { VNode } from 'vue';
import { ColumnBinds } from '../models/tavue';
import TavueCell from './TavueCell.vue';

defineProps<{
  row_node: VNode,
  cols_binds: ColumnBinds[],
  cols_nodes: VNode[][],
}>()
</script>

<template>
  <component :is="row_node" class="tavue-row">
    <TavueCell v-for="(col_binds, col_i) in cols_binds" :col_binds="col_binds">
      <component v-for="node in cols_nodes[col_i]" :is="node" />
    </TavueCell>
  </component>
</template>
