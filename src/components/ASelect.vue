<script setup lang="ts">
export interface Option {
  label: string
  value: any
}

const props = defineProps<{
  modelValue: any
  options: Option[]
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: any): void
}>()

function emitChange(e: any) {
  const input = e.target.value

  emit('update:model-value', input)
}

function isSelectedOption(option: Option) {
  return option.value === props.modelValue
}
</script>

<template>
  <div class="nes-select">
    <select @change="emitChange">
      <option
        v-for="option in options"
        :key="option.value"
        :selected="isSelectedOption(option)"
        :value="option.value"
        @change="emitChange"
      >
      {{ option.label }}
      </option>
    </select>
  </div>
</template>