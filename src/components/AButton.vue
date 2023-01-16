<script setup lang="ts">
const props = defineProps<{
  label: string,
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'clicked'): void
}>()

function handleClick() {
  if (!props.disabled) {
    emit('clicked')
  }
}
</script>

<template>
  <button
    class="AButton nes-btn is-primary"
    :class="{ 'is-disabled': disabled }"
    @click="handleClick"
  >
    <span class="label">
      {{ label }}
    </span>
  </button>
</template>

<style lang="postcss" scoped>
.AButton {
  &:hover {
    .icon::before {
      color: #108de0;
    }
  }

  &:focus {
    box-shadow: none;
  }
}

.AButton.is-disabled {
  &:hover, &:focus {
    color: #ffffff;
    background-color: #209cee;
    box-shadow: inset -4px -4px #adafbc;

    .icon::before {
      color: #209cee;
    }
  }

  &::after {
    box-shadow: inset -6px -6px #006bb3;
  }
}
</style>