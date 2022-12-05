<script setup lang="ts">
import { VNodeRef } from 'vue';
import { TableState, BorderState, ColumnState } from '../models/tavue';

const DETECT_WIDTH = 5;

const props = defineProps<{
  name: string,
  index?: number,
  table_state?: TableState,
  state?: ColumnState,
  border_left?: BorderState,
  border_right?: BorderState,
  is_header?: boolean,
  is_footer?: boolean,
  row_index?: number,
  row?: any,
  ref_to?: VNodeRef,
}>()

function onMouseEnter(e: MouseEvent) {
  props.state!.hover = true;
}

function onMouseLeave(e: MouseEvent) {
  props.state!.hover = false;
  // props.border_left!.hover = false;
  // props.border_right!.hover = false;
  // props.border_left!.moving = false;
  // props.border_right!.moving = false;
}

function onMouseMove(e: MouseEvent) {
  if (!props.border_left?.moving) {
    props.border_left!.hover = e.offsetX <= DETECT_WIDTH;
  }
  if (!props.border_right?.moving) {
    props.border_right!.hover = (props.state!.width! - e.offsetX) <= DETECT_WIDTH;
  }
}

function onMouseDown(e: MouseEvent) {
  if (props.border_left?.hover) {
    props.border_left.moving = true;
    props.table_state!.moving_border = props.index!;
    props.table_state!.moving_last_x = e.screenX;
    return;
  }
  if (props.border_right?.hover) {
    props.border_right.moving = true;
    props.table_state!.moving_border = props.index! + 1;
    props.table_state!.moving_last_x = e.screenX;
    return;
  }
}

function onMouseUp(e: MouseEvent) {
  props.border_left!.moving = false;
  props.border_right!.moving = false;
  props.table_state!.moving_border = undefined;
  props.table_state!.moving_last_x = undefined;
}

function onDoubleClick(e: MouseEvent) {
  if (props.border_right?.hover) {
    props.state!.width = props.state?.enough_width;
  }
}

// onMounted(() => {
//   // console.log(`col[${props.row_index}].${props.name}: mounted.`)
// })

</script>
<template>
  <div :ref="ref_to" class="tavue-cell"
    :class="{ hover: state?.hover, 'border-left-hover': border_left?.hover, 'border-right-hover': border_right?.hover, 'border-left-moving': border_left?.moving, 'border-right-moving': border_right?.moving }"
    :data-index="index" :data-name="name" :style="{ width: state?.width ? `${state?.width}px` : '' }"
    @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @mousemove="onMouseMove" @mousedown="onMouseDown"
    @mouseup="onMouseUp" @dblclick="onDoubleClick">
    <slot v-if="is_header" name="header"></slot>
    <slot v-if="row" name="row" :row="row"></slot>
    <slot v-if="is_footer" name="footer"></slot>
  </div>
</template>