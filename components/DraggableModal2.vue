<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import VueDragResize from 'vue3-drag-resize'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import { useLiveStore } from '@/stores/live'


const modalStore = useModalStore()
const { setDraggableModal } = modalStore
const { draggableModalInfo } = storeToRefs(modalStore)
const liveStore = useLiveStore()
const { top, left, width, height, W, H, headerH, pageWidth, pageHeight, } = storeToRefs(liveStore)
const { setRect } = liveStore
const vdr = ref(null)
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

function setModalSize(size: number) {
  const top = pageHeight.value - vdr.value.bottom - (H.value * size + headerH.value)
  const left = pageWidth.value - vdr.value.right - W.value * size
  const bottom = pageHeight.value - top - (H.value * size + headerH.value)
  const right = pageWidth.value - left - W.value * size
  vdr.value.top = top < 0 ? 0 : top
  vdr.value.left = left < 0 ? 0 : left
  vdr.value.right = right > pageWidth.value ? pageWidth.value : right
  vdr.value.bottom = bottom > pageHeight.value ? pageHeight.value : bottom
}
</script>

<template>
  <VueFinalModal display-directive="show" background="interactive" content-transition="vfm-fade" :hide-overlay="true"
    @update:model-value="val => emit('update:modelValue', val)">
    <ClientOnly>
      <VueDragResize ref="vdr" :is-active="true" :w="width" :h="height" :x="left" :y="top" :stickSize="12"
        :parentW="pageWidth" :parentH="pageHeight" :parentLimitation="true" :aspectRatio="true"
        :sticks="['tl', 'tr', 'br', 'bl']" :minw="W" :minh="H + headerH" @resizing="setRect" @dragging="setRect">
        <div class="flex justify-between items-center p-1 bg-gray-200 dark:bg-gray-800 rounded-t-md">
          <div class="flex items-center">
            <UButton color="gray" variant="ghost" size="2xs" @pointerup="setModalSize(1)" label="1x" />
            <UButton color="gray" variant="ghost" size="2xs" @pointerup="setModalSize(2)" label="2x" />
            <UButton color="gray" variant="ghost" size="2xs" @pointerup="setModalSize(3)" label="3x" />
          </div>
          <UButton color="gray" variant="ghost" size="xs" square
            @pointerup="setDraggableModal(false); emit('update:modelValue', false)"
            icon="i-heroicons-x-mark-20-solid" />
        </div>
        <div>
          <!-- content here -->
          <Player :src="draggableModalInfo.embed_url" :width="`${width}`" :height="`${height - headerH}`" />
        </div>
      </VueDragResize>
    </ClientOnly>
  </VueFinalModal>
</template>

<style>
.vdr-stick {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: absolute;
  font-size: 1px;
  background: transparent !important;
  border: 1px solid transparent !important;
  -webkit-box-shadow: 0 0 2px transparent !important;
  box-shadow: 0 0 2px transparent !important;
}

.vdr.active:before {
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: 1px dashed transparent !important;
}
</style>