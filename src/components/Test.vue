<script setup>
const data = [1, 2, 3, 4];
</script>

<template>
  <div>
    <div v-for="(d, index) in data" :key="index">{{ d }}</div>
  </div>
</template>

<style scoped></style>
