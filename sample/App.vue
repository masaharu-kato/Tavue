<script setup lang="ts">
import { Tavue, TavueColumn } from '../src';
import './app.css'

import _rows from './assets/tree_sample.json';
// const rows = _rows.slice(0, 100);
const rows = _rows;

function row_onclick(row: any, row_i: number) {
  console.log(`Row#${row_i} clicked:`, row);
}

</script>

<template>
  <h1>Sample Data Table</h1>
  <Tavue :rows="rows" :tree_children="(row: any) => (row.child_A || row.child_B)" :depth_offset="(d: number) => d * 12">
    <!-- <template #row_header>
      <div></div>
    </template> -->
    <template #row="{ row, row_i }">
      <div @dblclick="row_onclick(row, row_i)"></div>
    </template>
    <!-- <template #row_footer>
      <div></div>
    </template> -->
    <template #tree_row="{ row }">
      <div :class="{ 'tree-row-A': !!row.child_A, 'tree-row-B': !!row.child_B }"></div>
    </template>
    <template #columns>
      <TavueColumn name="tree">
        <template #header></template>
        <template #row="{ is_open, set_open }">
          <template v-if="(is_open != undefined)">
            <button class="tree-btn" @click="set_open(!is_open)">
              <span v-if="is_open" class="tree_txt_close">－</span>
              <span v-else class="tree_txt_open">＋</span>
            </button>
          </template>
        </template>
        <template #footer></template>
      </TavueColumn>
      <TavueColumn name="id">
        <template #header>#</template>
        <template #row="{ row }">{{ row.id }}</template>
        <template #footer></template>
      </TavueColumn>
      <TavueColumn name="name" :resizeable="true">
        <template #header>Name</template>
        <template #row="{ row }">
          <span class="first_name">{{ row.first_name }}</span>
          <span class="name_space">&nbsp;</span>
          <span class="last_name">{{ row.last_name }}</span>
        </template>
        <template #footer></template>
      </TavueColumn>
      <TavueColumn name="gender" :resizeable="true">
        <template #header>Gender</template>
        <template #row="{ row }">{{ row.gender }}</template>
        <template #footer></template>
      </TavueColumn>
      <TavueColumn name="email" :resizeable="true">
        <template #header>E-Mail</template>
        <template #row="{ row }">{{ row.email }}</template>
        <template #footer></template>
      </TavueColumn>
      <TavueColumn name="ip_address" :resizeable="true">
        <template #header>IP Address</template>
        <template #row="{ row }">{{ row.ip_address }}</template>
        <template #footer></template>
      </TavueColumn>
    </template>
  </Tavue>
</template>
