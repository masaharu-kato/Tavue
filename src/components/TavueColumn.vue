<script setup lang="ts">
import { RowType, ColumnProps } from '../models/tavue';

//  defineProps<ColumnProps>()

defineProps<{
  //  User properties
  name: string,          //  Column name
  width?: number,        //  Initial width 
  min_width?: number,    //  Minimum width
  max_width?: number,    //  Maximum width
  resizeable?: boolean,  //  Is resizeable or not
  // sortable?: boolean,    //  Is sortable or not
  // filtable?: boolean,    //  Is filtable or not
  // auto_expand?: boolean, //  Expand width if the some contents are hidden
  // auto_shrink?: boolean, //  Shrink width if the some cell widths are too large
}>()

</script>
<template>

  <!-- Definition of Slots (for develpments only, not shown) -->
  <slot v-if="null" name="header"></slot>
  <slot v-if="null" name="row" :row="(null as RowType)" :row_i="0" :is_open="false" :set_open="(f: boolean) => { }">
  </slot>
  <slot v-if="null" name="footer"></slot>

</template>
