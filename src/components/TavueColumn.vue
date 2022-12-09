<script setup lang="ts">
import { VNodeRef } from 'vue';
import { RowType, TableState, BorderState, ColumnState } from '../models/tavue';

const props = defineProps<{
  //  User properties
  name: string,          //  Column name
  resizeable?: boolean,  //  Is resizeable or not
  sortable?: boolean,    //  Is sortable or not
  filtable?: boolean,    //  Is filtable or not
  auto_expand?: boolean, //  Expand width if the some contents are hidden
  auto_shrink?: boolean, //  Shrink width if the some cell widths are too large

  //  Auto-set properties
  index?: number,
  table_state?: TableState,
  state?: ColumnState,
  border_left?: BorderState,
  border_right?: BorderState,
  ref_to?: VNodeRef,
  is_header?: boolean,  //  Is in a header row or not
  is_footer?: boolean,  //  Is in a footer row or not
  row?: RowType,        //  Row data
  row_i?: number,       //  Row index (from 0)
  width_diff?: number,  //  Width difference from standard (for tree table)
  is_open?: boolean,    //  (Tree table) Child table is open (visible) or not
  set_open?: (f: boolean) => void,  //  (Tree table) Set child table open state
}>()

</script>
<template>
  <div :ref="ref_to" class="tavue-cell"
    :class="{ hover: state?.hover, 'border-left-hover': border_left?.hover, 'border-right-hover': border_right?.hover, 'border-left-moving': border_left?.moving, 'border-right-moving': border_right?.moving }"
    :data-col_i="index" :data-col_name="name"
    :style="{ width: state?.width ? `${state?.width - (width_diff ?? 0)}px` : '' }">
    <slot v-if="is_header" name="header"></slot>
    <slot v-if="row" name="row" :row="row" :row_i="row_i" :is_open="is_open" :set_open="set_open"></slot>
    <slot v-if="is_footer" name="footer"></slot>
  </div>
</template>
