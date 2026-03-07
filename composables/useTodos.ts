import type { Todo, FilterType } from '~/types/todo'

export function useTodos() {
  const todos = useState<Todo[]>('todos', () => [])
  const filter = useState<FilterType>('filter', () => 'all')

  function addTodo(text: string) {
    if (!text.trim()) return
    todos.value.push({
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    })
  }

  function removeTodo(id: string) {
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  function toggleTodo(id: string) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  function clearCompleted() {
    todos.value = todos.value.filter(todo => !todo.completed)
  }

  const filteredTodos = computed(() => {
    if (filter.value === 'active') return todos.value.filter(t => !t.completed)
    if (filter.value === 'completed') return todos.value.filter(t => t.completed)
    return todos.value
  })

  const remainingCount = computed(() => todos.value.filter(t => !t.completed).length)

  return {
    todos,
    filter,
    filteredTodos,
    remainingCount,
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted
  }
}
