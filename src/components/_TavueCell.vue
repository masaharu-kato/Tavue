<script setup lang="ts">
import { ColumnBinds } from '../models/tavue';
defineProps<{ col: ColumnBinds }>()
</script>

<template>
  <div :ref="col.ref_to" class="tavue-cell"
    :class="{ hover: col.state.hover, 'border-left-hover': col.border_L?.hover, 'border-right-hover': col.border_R?.hover, 'border-left-moving': col.border_L?.moving, 'border-right-moving': col.border_R?.moving }"
    :data-col_i="col.index" :data-col_name="col.name"
    :style="{ width: col.state.width ? `${col.state.width - (col.width_diff ?? 0)}px` : '' }">
    <slot></slot>
  </div>
</template>
