<script setup lang="ts">
import { VNodeRef } from 'vue';
import { TableState, BorderState, ColumnState } from '../models/tavue';

const props = defineProps<{
  name: string,
  index?: number,
  table_state?: TableState,
  state?: ColumnState,
  border_left?: BorderState,
  border_right?: BorderState,
  ref_to?: VNodeRef,
  is_header?: boolean,
  is_footer?: boolean,
  row_index?: number,
  row?: any,
}>()

</script>
<template>
  <div :ref="ref_to" class="tavue-cell"
    :class="{ hover: state?.hover, 'border-left-hover': border_left?.hover, 'border-right-hover': border_right?.hover, 'border-left-moving': border_left?.moving, 'border-right-moving': border_right?.moving }"
    :data-col_i="index" :data-col_name="name" :style="{ width: state?.width ? `${state?.width}px` : '' }">
    <slot v-if="is_header" name="header"></slot>
    <slot v-if="row" name="row" :row="row"></slot>
    <slot v-if="is_footer" name="footer"></slot>
  </div>
</template>
