<script setup lang="ts">
import { computed } from 'vue'
import TwitterIcon from './icons/TwitterIcon.vue'

const props = defineProps<{
  label: string,
  text?: string,
  url?: string,
  hashtags?: string
  disabled?: boolean
}>()

const href = computed(() => {
  return `https://twitter.com/intent/tweet?text=${props.text}&url=%0a${props.url}%0a&hashtags=${props.hashtags}`
})

function handleClick() {
  if (!props.disabled) {
    window.open(href.value, '_blank')
  }
}
</script>

<template>
  <button
    class="TwitterShareButton nes-btn is-primary"
    :class="{ 'is-disabled': disabled }"
    @click="handleClick"
  >
    <span class="label">
      <i class="icon nes-icon twitter is-small" />
      {{ label }}
    </span>
  </button>
</template>

<style lang="postcss" scoped>
.TwitterShareButton {
  &:hover {
    .icon::before {
      color: #108de0;
    }
  }

  &:focus {
    box-shadow: none;
  }
}

.TwitterShareButton.is-disabled {
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

.icon {
  width: 14px;
  height: 14px;
}
</style>