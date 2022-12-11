<script setup lang="ts">
import { reactive, Slots, useSlots } from 'vue';
import { RowType, InternalTableProps, ColumnBinds, ColumnSlots, TableState, ColumnState, BorderState, slot_nodes, RowSlots, ColumnProps, TableOptions } from '../models/tavue';
import TavueTable from './TavueTable.vue';

const props = defineProps<{
  rows: RowType[]
  tree_children?: (row: RowType, row_i: number) => RowType[] | undefined
  children_opened?: boolean
  depth_offset?: (depth: number) => number
}>()

const slots = useSlots()

//  Columns
if (!slots.columns) throw new Error('Slot `columns` not specified.')

const opts: TableOptions = {
  table: {
    tree_children: props.tree_children,
    depth_offset: props.depth_offset,
    children_opened: props.children_opened,
  },
  row: {
    slots: {
      header: slots.row_header,
      footer: slots.row_footer,
      data: slots.row,
      tree: slots.tree_row,
      tree_parent: slots.tree_parent_row,
      tree_child: slots.tree_child_row,
    },
  },
  cols: slots.columns().map(c => {

    const props = (c.props ?? {}) as ColumnProps
    if (!props.name) throw new Error('Column name is not set.')

    if (!(c.children instanceof Object) || c.children instanceof Array) {
      throw new Error('Invalid node in `columns` slot.')
    }
    const slots = c.children as Slots

    return {
      props,
      slots: {
        header: slot_nodes(slots.header),
        row: slots.row ? props => slots.row!(props) : props => [],
        footer: slot_nodes(slots.footer),
      }
    }
  })
}

</script>
<template>

  <!-- Definition of Slots (for develpments only, not shown) -->
  <slot v-if="null" name="header_row"></slot>
  <slot v-if="null" name="row" :row="(null as RowType)" :row_i="0" :is_open="false" :set_open="(f: boolean) => { }">
  </slot>
  <slot v-if="null" name="footer_row"></slot>
  <slot v-if="null" name="tree_row" :row="(null as RowType)" :row_i="0" :is_open="false"
    :set_open="(f: boolean) => { }"></slot>
  <slot v-if="null" name="tree_parent_row" :row="(null as RowType)" :row_i="0" :is_open="false"
    :set_open="(f: boolean) => { }"></slot>
  <slot v-if="null" name="tree_child_row" :row="(null as RowType)" :row_i="0" :is_open="false"
    :set_open="(f: boolean) => { }"></slot>
  <slot v-if="null" name="columns"></slot>

  <!-- Tavue table (actual element) -->
  <TavueTable :rows="rows" :opts="opts"></TavueTable>

</template>
