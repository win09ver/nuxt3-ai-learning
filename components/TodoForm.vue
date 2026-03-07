<script setup lang="ts">
const { addTodo } = useTodos()
const inputText = ref('')

function handleSubmit() {
  addTodo(inputText.value)
  inputText.value = ''
}
</script>

<template>
  <form class="flex gap-2 mb-6" @submit.prevent="handleSubmit">
    <input
      v-model="inputText"
      type="text"
      placeholder="What needs to be done?"
      class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      type="submit"
      class="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Add
    </button>
  </form>
</template>
