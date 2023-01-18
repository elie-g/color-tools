<template>
  <ColorPicker v-model="color" :format="format" class="colorpicker-root" />
</template>
<script lang="ts">
import ColorPicker from '@/components/ColorPicker.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { ColorPicker },

  data() {
    return {
      color: 'rgba(200, 0, 0, 0.5)',
      format: 'rgb'
    }
  }
})
</script>

<style lang="scss">
html, body {
  background-color: #222;
}

.colorpicker-root {
  position: fixed;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  outline: 1px solid red;
}
</style>