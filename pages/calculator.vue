<script setup lang="ts">
const display = ref('0')
const expression = ref('')
const justCalculated = ref(false)

function inputDigit(digit: string) {
  if (justCalculated.value) {
    display.value = digit
    expression.value = ''
    justCalculated.value = false
  } else {
    display.value = display.value === '0' ? digit : display.value + digit
  }
}

function inputDot() {
  if (justCalculated.value) {
    display.value = '0.'
    justCalculated.value = false
    return
  }
  if (!display.value.includes('.')) {
    display.value += '.'
  }
}

function inputOperator(op: string) {
  justCalculated.value = false
  expression.value = display.value + ' ' + op
  display.value = '0'
}

function calculate() {
  if (!expression.value) return
  const parts = expression.value.trim().split(' ')
  const left = parseFloat(parts[0])
  const op = parts[1]
  const right = parseFloat(display.value)

  let result: number
  switch (op) {
    case '+': result = left + right; break
    case '-': result = left - right; break
    case '×': result = left * right; break
    case '÷': result = right !== 0 ? left / right : NaN; break
    default: return
  }

  display.value = isNaN(result) ? 'Error' : String(parseFloat(result.toFixed(10)))
  expression.value = ''
  justCalculated.value = true
}

function clear() {
  display.value = '0'
  expression.value = ''
  justCalculated.value = false
}

function deleteLast() {
  if (justCalculated.value) {
    clear()
    return
  }
  display.value = display.value.length > 1 ? display.value.slice(0, -1) : '0'
}
</script>

<template>
  <div class="max-w-xs mx-auto pt-16 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-blue-600">Calculator</h1>
      <NuxtLink to="/" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">← TODO</NuxtLink>
    </div>

    <div class="bg-gray-50 rounded-xl shadow-md overflow-hidden">
      <!-- Display -->
      <div class="bg-gray-800 px-4 py-4 text-right">
        <div class="text-gray-400 text-sm h-5">{{ expression }}</div>
        <div class="text-white text-4xl font-light truncate">{{ display }}</div>
      </div>

      <!-- Buttons -->
      <div class="grid grid-cols-4 gap-px bg-gray-200">
        <button class="btn btn-gray col-span-2" @click="clear">AC</button>
        <button class="btn btn-gray" @click="deleteLast">⌫</button>
        <button class="btn btn-orange" @click="inputOperator('÷')">÷</button>

        <button class="btn btn-white" @click="inputDigit('7')">7</button>
        <button class="btn btn-white" @click="inputDigit('8')">8</button>
        <button class="btn btn-white" @click="inputDigit('9')">9</button>
        <button class="btn btn-orange" @click="inputOperator('×')">×</button>

        <button class="btn btn-white" @click="inputDigit('4')">4</button>
        <button class="btn btn-white" @click="inputDigit('5')">5</button>
        <button class="btn btn-white" @click="inputDigit('6')">6</button>
        <button class="btn btn-orange" @click="inputOperator('-')">−</button>

        <button class="btn btn-white" @click="inputDigit('1')">1</button>
        <button class="btn btn-white" @click="inputDigit('2')">2</button>
        <button class="btn btn-white" @click="inputDigit('3')">3</button>
        <button class="btn btn-orange" @click="inputOperator('+')">+</button>

        <button class="btn btn-white col-span-2" @click="inputDigit('0')">0</button>
        <button class="btn btn-white" @click="inputDot">.</button>
        <button class="btn btn-blue" @click="calculate">=</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply py-5 text-xl font-medium text-center cursor-pointer select-none transition-opacity active:opacity-70;
}
.btn-white { @apply bg-white text-gray-800 hover:bg-gray-50; }
.btn-gray  { @apply bg-gray-300 text-gray-800 hover:bg-gray-200; }
.btn-orange { @apply bg-orange-400 text-white hover:bg-orange-300; }
.btn-blue  { @apply bg-blue-500 text-white hover:bg-blue-400; }
</style>
