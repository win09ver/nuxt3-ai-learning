<script setup lang="ts">
import type { FilterType } from '~/types/todo'

const { filteredTodos, filter, remainingCount, clearCompleted } = useTodos()

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' }
]
</script>

<template>
  <div class="max-w-lg mx-auto pt-16 px-4">
    <div class="flex items-center justify-center gap-4 mb-8">
      <h1 class="text-4xl font-bold text-blue-600">TODO List</h1>
      <NuxtLink to="/calculator" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">Calculator →</NuxtLink>
    </div>

    <div class="bg-gray-50 rounded-xl p-6 shadow-md">
      <TodoForm />

      <ul class="space-y-2 mb-4">
        <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
        <li v-if="filteredTodos.length === 0" class="text-center text-gray-400 py-6">
          No tasks here.
        </li>
      </ul>

      <div class="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
        <span>{{ remainingCount }} item{{ remainingCount !== 1 ? 's' : '' }} left</span>
        <div>
          <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" @click="filter = 'all'">All</button>
        </div>

        <div class="flex gap-1">
          <button
            v-for="f in filters"
            :key="f.value"
            class="px-3 py-1 rounded-md transition-colors"
            :class="filter === f.value ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-200'"
            @click="filter = f.value"
          >
            {{ f.label }}
          </button>
        </div>

        <button
          class="hover:text-red-500 transition-colors"
          @click="clearCompleted"
        >
          Clear completed
        </button>
      </div>
    </div>
  </div>
</template>
