<script setup lang="ts">
import { ColumnBinds } from '../models/tavue';
const props = defineProps<{ col_binds: ColumnBinds }>()
const { col_binds: col } = props;
</script>

<template>
  <div class="tavue-cell"
    :class="{ hover: col.state.hover, 'border-left-hover': col.border_L?.hover, 'border-right-hover': col.border_R?.hover, 'border-left-moving': col.border_L?.moving, 'border-right-moving': col.border_R?.moving }"
    :data-col_i="col.index" :data-col_name="col.name" :data-width_diff="col.width_diff"
    :style="{ width: col.state.width ? `${col.state.width - (col.width_diff ?? 0)}px` : '' }">
    <slot></slot>
  </div>
</template>
