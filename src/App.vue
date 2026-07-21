<template>
  <div>
    <p>{{ count }}</p>
    <button class="bg-green-300 px-1 mx-1 rounded hover:cursor-pointer" @click="increment">
      increment
    </button>
    <button class="bg-red-500 px-1 mx-1 rounded hover:cursor-pointer" @click="decrement">
      decrement
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
function increment() {
  count.value++;
}
function decrement() {
  count.value++;
}
</script>
