<script setup lang="ts">
defineProps<{ //  Equals to interface `ColumnProps`
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
