import DefaultTheme from 'vitepress/theme'
import './custom.css'
import IndexLayout from './indexLayout.vue'

export default {
  ...DefaultTheme,
  Layout: IndexLayout
}