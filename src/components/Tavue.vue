<script setup lang="ts">
import { Slots, useSlots } from 'vue';
import { slot_nodes, ColumnProps, ColumnOptions, TableOptions } from '../models/tavue';
import TavueTable from './TavueTable.vue';

const props = defineProps<{
  rows: any[]   //  Rows data
  tree_children?: (row: any, row_i: number) => (typeof row)[] | undefined
  column?: ColumnOptions   //  Column options default values
  children_opened?: boolean
  depth_offset?: (depth: number) => number
}>()

const slots = useSlots()

//  Columns
if (!slots.columns) throw new Error('Slot `columns` not specified.')

const opts: TableOptions<unknown> = {
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

    //  Load column props
    const col_props = (c.props ?? {}) as ColumnProps
    if (!col_props.name) throw new Error('Column name is not set.')

    //  Set default prop values
    col_props.min_width = col_props.min_width ?? props.column?.min_width ?? 1;
    col_props.max_width = col_props.max_width ?? props.column?.max_width ?? undefined;
    col_props.resizeable = col_props.resizeable ?? props.column?.resizeable ?? undefined;

    //  Load column slots
    if (!(c.children instanceof Object) || c.children instanceof Array) {
      throw new Error('Invalid node in `columns` slot.')
    }
    const slots = c.children as Slots

    return {
      props: col_props,
      slots: {
        header: slot_nodes(slots.header),
        row: slots.row ? row_props => slots.row!(row_props) : row_props => [],
        footer: slot_nodes(slots.footer),
      }
    }
  })
}

</script>

<template>
  <TavueTable :rows="rows" :opts="opts"></TavueTable>
</template>
