<script setup lang="ts">
import type { Todo } from '~/types/todo'

const props = defineProps<{ todo: Todo }>()
const { toggleTodo, removeTodo } = useTodos()
</script>

<template>
  <li class="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm group">
    <input
      type="checkbox"
      :checked="todo.completed"
      class="w-5 h-5 cursor-pointer accent-blue-500"
      @change="toggleTodo(todo.id)"
    />
    <span
      class="flex-1 text-gray-800"
      :class="{ 'line-through text-gray-400': todo.completed }"
    >
      {{ todo.text }}
    </span>
    <button
      class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity text-sm"
      @click="removeTodo(todo.id)"
    >
      Delete
    </button>
  </li>
</template>
