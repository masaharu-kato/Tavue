<script setup lang="ts">
import { VNode } from 'vue';
import { ColumnBinds } from '../models/tavue';
import TavueCell from './_TavueCell.vue';

defineProps<{
  row_node: VNode,
  cols_binds: ColumnBinds[],
  cols_nodes: VNode[][],
}>()
</script>

<template>
  <component :is="row_node" class="tavue-row">
    <TavueCell v-for="(bind, i) in cols_binds" :is="bind" :col="bind" v-bind="cols_binds[i]">
      <component v-for="node in cols_nodes[i]" :is="node" />
    </TavueCell>
  </component>
</template>
