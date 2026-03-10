<script setup lang="ts">
const display = ref('0')
const expression = ref('')
const justCalculated = ref(false)
const history = ref<Array<{ expr: string; result: string }>>([])
const memory = ref(0)
const showHistory = ref(false)
const isScientific = ref(false)

// 表达式解析和计算
function parseExpression(expr: string): number {
  try {
    // 替换显示符号为计算符号
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**')
    // 移除多余的空格
    expr = expr.replace(/\s+/g, ' ').trim()
    // 使用 Function 构造函数安全地计算表达式
    const result = new Function('return ' + expr)()
    return typeof result === 'number' ? result : NaN
  } catch {
    return NaN
  }
}

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
    expression.value = ''
    justCalculated.value = false
    return
  }
  if (!display.value.includes('.')) {
    display.value += '.'
  }
}

function inputOperator(op: string) {
  if (expression.value && !justCalculated.value) {
    // 如果已有表达式，先计算结果
    const currentExpr = expression.value + ' ' + display.value
    const result = parseExpression(currentExpr.replace(/×/g, '*').replace(/÷/g, '/'))
    if (!isNaN(result)) {
      display.value = String(parseFloat(result.toFixed(10)))
    }
  }
  expression.value = display.value + ' ' + op
  justCalculated.value = false
}

function inputLeftParen() {
  if (justCalculated.value || display.value === '0') {
    expression.value = '('
    display.value = '0'
  } else {
    expression.value = expression.value ? expression.value + ' ' + display.value + ' * (' : display.value + ' * ('
    display.value = '0'
  }
  justCalculated.value = false
}

function inputRightParen() {
  if (expression.value.includes('(')) {
    expression.value = expression.value + ' ' + display.value + ')'
    // 计算括号内的表达式
    const openParenIndex = expression.value.lastIndexOf('(')
    const closeParenIndex = expression.value.lastIndexOf(')')
    if (openParenIndex < closeParenIndex) {
      const innerExpr = expression.value.substring(openParenIndex + 1, closeParenIndex).trim()
      const result = parseExpression(innerExpr)
      if (!isNaN(result)) {
        display.value = String(parseFloat(result.toFixed(10)))
        // 替换括号表达式为结果
        expression.value = expression.value.substring(0, openParenIndex).trim() + ' ' + display.value
        justCalculated.value = true
      }
    }
  }
}

function calculate() {
  let expr = expression.value
  if (expr) {
    expr = expr + ' ' + display.value
  } else {
    expr = display.value
  }

  const result = parseExpression(expr.replace(/×/g, '*').replace(/÷/g, '/'))
  
  if (isNaN(result)) {
    display.value = 'Error'
  } else {
    const resultStr = String(parseFloat(result.toFixed(10)))
    // 添加到历史记录
    history.value.unshift({ expr: expr.replace(/×/g, '×').replace(/\//g, '÷'), result: resultStr })
    if (history.value.length > 10) history.value.pop()
    
    display.value = resultStr
  }
  expression.value = ''
  justCalculated.value = true
}

function clear() {
  display.value = '0'
  expression.value = ''
  justCalculated.value = false
}

function clearEntry() {
  display.value = '0'
}

function deleteLast() {
  if (justCalculated.value) {
    clear()
    return
  }
  display.value = display.value.length > 1 ? display.value.slice(0, -1) : '0'
}

// 科学计算函数
function scientificFunction(func: string) {
  const num = parseFloat(display.value)
  if (isNaN(num)) return
  
  let result: number
  switch (func) {
    case 'sin': result = Math.sin(num * Math.PI / 180); break
    case 'cos': result = Math.cos(num * Math.PI / 180); break
    case 'tan': result = Math.tan(num * Math.PI / 180); break
    case 'asin': result = Math.asin(num) * 180 / Math.PI; break
    case 'acos': result = Math.acos(num) * 180 / Math.PI; break
    case 'atan': result = Math.atan(num) * 180 / Math.PI; break
    case 'log': result = Math.log10(num); break
    case 'ln': result = Math.log(num); break
    case 'sqrt': result = Math.sqrt(num); break
    case 'square': result = num * num; break
    case 'cube': result = num * num * num; break
    case 'exp': result = Math.exp(num); break
    case 'pow10': result = Math.pow(10, num); break
    case 'factorial': 
      if (num < 0 || num !== Math.floor(num)) {
        display.value = 'Error'
        return
      }
      result = factorial(num)
      break
    case 'percent': result = num / 100; break
    case 'reciprocal': result = num !== 0 ? 1 / num : NaN; break
    default: return
  }
  
  if (isNaN(result) || !isFinite(result)) {
    display.value = 'Error'
  } else {
    display.value = String(parseFloat(result.toFixed(10)))
    justCalculated.value = true
  }
}

function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

function inputPower() {
  if (justCalculated.value) {
    expression.value = display.value + ' ^'
  } else {
    expression.value = expression.value ? expression.value + ' ' + display.value + ' ^' : display.value + ' ^'
  }
  display.value = '0'
  justCalculated.value = false
}

// 内存功能
function memoryAdd() {
  memory.value += parseFloat(display.value) || 0
}

function memorySubtract() {
  memory.value -= parseFloat(display.value) || 0
}

function memoryRecall() {
  display.value = String(memory.value)
  justCalculated.value = false
}

function memoryClear() {
  memory.value = 0
}

function toggleSign() {
  if (display.value !== '0' && display.value !== 'Error') {
    display.value = display.value.startsWith('-') 
      ? display.value.slice(1) 
      : '-' + display.value
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto pt-8 px-4 pb-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-blue-600">高级计算器</h1>
      <NuxtLink to="/" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">← TODO</NuxtLink>
    </div>

    <div class="flex gap-4 flex-col lg:flex-row">
      <!-- 主计算器 -->
      <div class="bg-gray-50 rounded-xl shadow-md overflow-hidden flex-1">
        <!-- Display -->
        <div class="bg-gray-800 px-4 py-4 text-right">
          <div class="flex items-center justify-between mb-2">
            <div class="text-gray-400 text-xs">
              <span v-if="memory !== 0" class="mr-2">M: {{ memory }}</span>
              <button 
                @click="showHistory = !showHistory" 
                class="text-blue-400 hover:text-blue-300"
              >
                {{ showHistory ? '隐藏' : '显示' }}历史
              </button>
            </div>
            <button 
              @click="isScientific = !isScientific"
              class="text-xs px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              {{ isScientific ? '标准' : '科学' }}
            </button>
          </div>
          <div class="text-gray-400 text-sm h-5 mb-1">{{ expression }}</div>
          <div class="text-white text-4xl font-light truncate">{{ display }}</div>
        </div>

        <!-- 科学计算按钮 (当启用时) -->
        <div v-if="isScientific" class="grid grid-cols-5 gap-px bg-gray-200 border-b border-gray-300">
          <button class="btn btn-sci" @click="scientificFunction('sin')">sin</button>
          <button class="btn btn-sci" @click="scientificFunction('cos')">cos</button>
          <button class="btn btn-sci" @click="scientificFunction('tan')">tan</button>
          <button class="btn btn-sci" @click="scientificFunction('log')">log</button>
          <button class="btn btn-sci" @click="scientificFunction('ln')">ln</button>
          
          <button class="btn btn-sci" @click="scientificFunction('asin')">asin</button>
          <button class="btn btn-sci" @click="scientificFunction('acos')">acos</button>
          <button class="btn btn-sci" @click="scientificFunction('atan')">atan</button>
          <button class="btn btn-sci" @click="scientificFunction('sqrt')">√</button>
          <button class="btn btn-sci" @click="scientificFunction('square')">x²</button>
          
          <button class="btn btn-sci" @click="scientificFunction('exp')">eˣ</button>
          <button class="btn btn-sci" @click="scientificFunction('pow10')">10ˣ</button>
          <button class="btn btn-sci" @click="scientificFunction('factorial')">n!</button>
          <button class="btn btn-sci" @click="scientificFunction('reciprocal')">1/x</button>
          <button class="btn btn-sci" @click="inputPower">xʸ</button>
        </div>

        <!-- 内存和括号按钮 -->
        <div class="grid grid-cols-5 gap-px bg-gray-200 border-b border-gray-300">
          <button class="btn btn-mem" @click="memoryAdd">M+</button>
          <button class="btn btn-mem" @click="memorySubtract">M-</button>
          <button class="btn btn-mem" @click="memoryRecall">MR</button>
          <button class="btn btn-mem" @click="memoryClear">MC</button>
          <button class="btn btn-gray" @click="toggleSign">±</button>
        </div>

        <!-- 主要按钮 -->
        <div class="grid grid-cols-5 gap-px bg-gray-200">
          <button class="btn btn-gray col-span-2" @click="clear">AC</button>
          <button class="btn btn-gray" @click="clearEntry">CE</button>
          <button class="btn btn-gray" @click="deleteLast">⌫</button>
          <button class="btn btn-orange" @click="inputOperator('÷')">÷</button>

          <button v-if="isScientific" class="btn btn-gray" @click="inputLeftParen">(</button>
          <button class="btn btn-white" @click="inputDigit('7')">7</button>
          <button class="btn btn-white" @click="inputDigit('8')">8</button>
          <button class="btn btn-white" @click="inputDigit('9')">9</button>
          <button class="btn btn-orange" @click="inputOperator('×')">×</button>
          <button v-if="isScientific" class="btn btn-gray" @click="inputRightParen">)</button>

          <button v-if="isScientific" class="btn btn-gray" @click="scientificFunction('percent')">%</button>
          <button class="btn btn-white" @click="inputDigit('4')">4</button>
          <button class="btn btn-white" @click="inputDigit('5')">5</button>
          <button class="btn btn-white" @click="inputDigit('6')">6</button>
          <button class="btn btn-orange" @click="inputOperator('-')">−</button>
          <button v-if="!isScientific" class="btn btn-gray" @click="scientificFunction('percent')">%</button>

          <button v-if="isScientific" class="btn btn-gray" @click="scientificFunction('sqrt')">√</button>
          <button class="btn btn-white" @click="inputDigit('1')">1</button>
          <button class="btn btn-white" @click="inputDigit('2')">2</button>
          <button class="btn btn-white" @click="inputDigit('3')">3</button>
          <button class="btn btn-orange" @click="inputOperator('+')">+</button>
          <button v-if="!isScientific" class="btn btn-gray" @click="scientificFunction('sqrt')">√</button>

          <button v-if="isScientific" class="btn btn-gray" @click="scientificFunction('square')">x²</button>
          <button class="btn btn-white col-span-2" @click="inputDigit('0')">0</button>
          <button class="btn btn-white" @click="inputDot">.</button>
          <button class="btn btn-blue" @click="calculate">=</button>
          <button v-if="!isScientific" class="btn btn-gray" @click="scientificFunction('square')">x²</button>
        </div>
      </div>

      <!-- 历史记录面板 -->
      <div v-if="showHistory" class="bg-gray-50 rounded-xl shadow-md overflow-hidden w-full lg:w-64">
        <div class="bg-gray-700 px-4 py-3 text-white font-semibold">计算历史</div>
        <div class="max-h-96 overflow-y-auto">
          <div 
            v-for="(item, index) in history" 
            :key="index"
            class="px-4 py-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
            @click="display = item.result; justCalculated = true"
          >
            <div class="text-gray-600 text-sm mb-1">{{ item.expr }}</div>
            <div class="text-gray-800 font-semibold">= {{ item.result }}</div>
          </div>
          <div v-if="history.length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
            暂无历史记录
          </div>
        </div>
        <div v-if="history.length > 0" class="px-4 py-2 border-t border-gray-200">
          <button 
            @click="history = []"
            class="text-sm text-red-500 hover:text-red-700 w-full text-center"
          >
            清空历史
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply py-4 text-base font-medium text-center cursor-pointer select-none transition-opacity active:opacity-70;
}
.btn-white { @apply bg-white text-gray-800 hover:bg-gray-50; }
.btn-gray  { @apply bg-gray-300 text-gray-800 hover:bg-gray-200; }
.btn-orange { @apply bg-orange-400 text-white hover:bg-orange-300; }
.btn-blue  { @apply bg-blue-500 text-white hover:bg-blue-400; }
.btn-sci { @apply bg-purple-200 text-purple-800 hover:bg-purple-300 text-sm py-3; }
.btn-mem { @apply bg-cyan-200 text-cyan-800 hover:bg-cyan-300 text-sm py-3; }
</style>
