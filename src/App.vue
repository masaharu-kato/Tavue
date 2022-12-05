<script setup lang="ts">
import Tavue from './components/Tavue.vue';
import TavueColumn from './components/TavueColumn.vue';

import _rows from './assets/sample.json';
const rows = _rows.slice(0, 100);
// const rows = _rows;

</script>

<template>
  <Tavue :rows="rows">
    <TavueColumn name="id">
      <template #header>#</template>
      <template #row="{ row }">{{ row.id }}</template>
      <template #footer></template>
    </TavueColumn>
    <TavueColumn name="first_name">
      <template #header>First Name</template>
      <template #row="{ row }">{{ row.first_name }}</template>
      <template #footer></template>
    </TavueColumn>
    <TavueColumn name="last_name">
      <template #header>Last Name</template>
      <template #row="{ row }">{{ row.last_name }}</template>
      <template #footer></template>
    </TavueColumn>
    <TavueColumn name="email">
      <template #header>E-Mail</template>
      <template #row="{ row }">{{ row.email }}</template>
      <template #footer></template>
    </TavueColumn>
    <TavueColumn name="gender">
      <template #header>Gender</template>
      <template #row="{ row }">{{ row.gender }}</template>
      <template #footer></template>
    </TavueColumn>
    <TavueColumn name="ip_address">
      <template #header>IP Address</template>
      <template #row="{ row }">{{ row.ip_address }}</template>
      <template #footer></template>
    </TavueColumn>
  </Tavue>
</template>
