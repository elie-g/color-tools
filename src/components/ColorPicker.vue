<template>
  <div class="cp-container">
    <div class="cp-wrapper">
      <div ref="square" class="cp-gradient-square"
           @mousedown="onMouseDown"
           @mousemove="onMouseMove"
           @touchstart="onMouseDown"
           @touchmove="onMouseMove"
           @touchend="onMoudeUp">
        <div ref="handle" class="cp-square-handle" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { Color, IColorAlpha } from '@/modules/color'

export default defineComponent({
  name: "ColorPicker",
  emits: ['update:modelValue'],

  setup() {
    return {
      square: ref<HTMLDivElement>(),
      handle: ref<HTMLDivElement>(),
    }
  },

  props: {
    modelValue: {
      type: String as PropType<string>,
      validator:(clr: string | null) => clr == null || Color.isValid(clr)
    },
    format: {
      type: String as PropType<'rgb' | 'hex' | 'hsl' | 'hwb' | 'cmyk'>,
      default: 'rgb',
      validator: (fmt: string) => ['rgb', 'hex', 'hsl', 'hwb', 'cmyk'].includes(fmt)
    },
    alpha: Boolean as PropType<boolean | undefined>
  },

  data() {
    return {
      color: Color(this.modelValue) as IColorAlpha,
      movingHandle: false
    }
  },

  mounted() { document.addEventListener('mouseup', this.onMoudeUp as any) },
  unmounted(): void { document.removeEventListener('mouseup', this.onMoudeUp as any) },

  methods: {
    updateSquare(): void {
      const sq = this.square as HTMLElement
      sq.style.backgroundColor = this.color.toString('rgb', false)
    },

    onMouseDown(ev: PointerEvent): void { this.movingHandle = true },
    onMoudeUp(ev: PointerEvent): void { this.movingHandle = false },
    onMouseMove(ev: PointerEvent): void {
      if (!this.movingHandle) return
      const sq = this.square as HTMLElement
      const handle = this.handle as HTMLElement

      console.log(ev.offsetX, sq.offsetWidth, ev.offsetX / sq.offsetWidth)
      this.color.hwb.w = ev.offsetX / sq.offsetWidth
      this.color.hwb.b = ev.offsetY / sq.offsetHeight

      this.setHandlePos({
        x: ev.offsetX,
        y: ev.offsetY
      })
    },

    setHandlePos({ x, y }: { x?: number, y?: number }): void {
      const handle = this.handle as HTMLElement
      x ??= handle.offsetLeft
      y ??= handle.offsetTop
      handle.style.left = `${x}px`
      handle.style.top = `${y}px`
    }
  },

  watch: {
    color: {
      deep: true,
      handler() {
        this.updateSquare()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.cp-container {
  width: fit-content;
  height: fit-content;

  > .cp-wrapper {
    display: flex;
    box-sizing: border-box;


    > .cp-gradient-square {
      $size: 10rem;
      $handle-radius: .02 * $size;
      position: relative;
      margin: $handle-radius;
      width: $size;
      height: $size;
      overflow: visible;

      > .cp-square-handle {
        position: absolute;
        width: $handle-radius * 2;
        height: $handle-radius * 2;
        margin: -$handle-radius;
        border: 1px solid currentColor;
        background-color: currentColor;
        border-radius: 50%;
        will-change: top, left;
        pointer-events: none;
      }
    }
  }
}
</style>