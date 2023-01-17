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
  (e: 'update:model-value' , value: any): void
}>()

function emitChange(e: any) {
  const input = e.target.value

  emit('update:model-value', input === 'true')
}

function isCheckedOption(option: Option) {
  return option.value === props.modelValue
}


</script>

<template>
  <div class="ARadio">
    <label v-for="option in options" :key="option.value">
      <input
        type="radio"
        class="nes-radio"
        :value="option.value"
        :checked="isCheckedOption(option)"
        @change="emitChange"
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>