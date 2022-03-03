<template>
  <Layout>
    <template #home-hero></template>
  </Layout>
</template>

<script setup>
import confetti from 'canvas-confetti'
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
const { Layout } = DefaultTheme

const end = Date.now() + (1.2 * 1000)
const colors = ['#6470ff', '#75ffc0']

// 彩带特效
const frame = () => {
  confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors
  })
  confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors
  })

  if (Date.now() < end) {
    requestAnimationFrame(frame)
  }
}

onMounted(() => {
  frame()
})
</script>