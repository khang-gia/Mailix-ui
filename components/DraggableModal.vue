<!-- <template>
    <UModal
      :modelValue="draggableModal"
      :overlay=false
      :ui=" {
              wrapper: 'z-50',
              container: 'flex justify-end',
              inner: 'relative w-full max-h-full',
              base: `fixed draggable-modal-${modal.uid}`,
              width: 'w-full',
              overlay: {
                base: 'fixed inset-0'
              }
            }
      "
    >
      <UCard 
          :ui=" {
              base: `absolute bottom-5 right-0 ${modelSize === '1x' ? 'w-2/3' : modelSize === '2x' ? 'w-3/4' : 'w-full'} overflow-hidden`,
            }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="text-base font-semibold leading-6 text-white">
               My Modal 
            </div>
            <div class="flex space-x-2">
              <UButton color="gray" variant="ghost" @click="setModalSize('1x')">1x</UButton>
              <UButton color="gray" variant="ghost" @click="setModalSize('2x')">2x</UButton>
              <UButton color="gray" variant="ghost" @click="setModalSize('3x')">3x</UButton>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
          </div>
        </template>
  
        <slot name="content" />
  
        <template #footer>
          <div class="flex flex-wrap justify-end gap-4">
            <slot name="actions" />
          </div>
        </template>
      </UCard>
    </UModal>
  </template>
  
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { draggableModal, draggableModalInfo } = storeToRefs(modalStore)
const { toggleDraggableModal, setDraggableModalInfo } = modalStore

interface DraggableContainer {
  container: HTMLElement | null;
  uid: number | undefined;
  width: number;
  height: number;
}

defineOptions({
  inheritAttrs: false,
});

const closeModal = () => {
  toggleDraggableModal(false);
};

const instance = getCurrentInstance();
const modal = reactive<DraggableContainer>({
  container: null,
  uid: instance?.uid,
  width: 0,
  height: 0,
});
const modelSize = ref('3x')
const setModalSize = (size: '1x' | '2x' | '3x') => {
  modelSize.value = size
}

watch(
  () => draggableModal.value,
  async (isOpen) => {
    if (isOpen) {
      await nextTick();
      modal.container = document.querySelector(
        `.draggable-modal-${modal.uid}`
      ) as HTMLElement;

      const { width, height } = useElementSize(modal.container);
      modal.width = width.value;
      modal.height = height.value;
    }
  },
  { immediate: true }
);

const { width: windowWidth, height: windowHeight } = useWindowSize();
const { x, y } = useDraggable(toRef(modal, 'container'), {
  preventDefault: true,
});


watch(
  () => [x.value, y.value],
  () => {
    if (modal.container) {
      let newX = x.value;
      let newY = y.value;

      if (newX < 0) {
        newX = 0;
      } else if (newX + modal.width > windowWidth.value) {
        newX = windowWidth.value - modal.width;
      }

      if (newY < 0) {
        newY = 0;
      } else if (newY + modal.height > windowHeight.value) {
        newY = windowHeight.value - modal.height;
      }

      modal.container.style.left = `${newX}px`;
      modal.container.style.top = `${newY}px`;
    }
  }
);
</script> -->

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { draggableModal, draggableModalInfo } = storeToRefs(modalStore)
const { toggleDraggableModal, setDraggableModalInfo } = modalStore
defineOptions({
  inheritAttrs: false,
});
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()
const modelSize = ref('3x')
const setModalSize = (size: '1x' | '2x' | '3x') => {
  modelSize.value = size
}
const closeModal = () => {
  toggleDraggableModal();
};
interface DraggableContainer {
  container: HTMLElement | null;
  uid: number | undefined;
  width: number;
  height: number;
}
const instance = getCurrentInstance();
const modal = reactive<DraggableContainer>({
  container: null,
  uid: instance?.uid,
  width: 0,
  height: 0,
});


watch(
  () => draggableModal.value,
  async (isOpen) => {
    if (isOpen) {
      await nextTick();
      modal.container = document.querySelector(
        `.draggable-modal-${modal.uid}`
      ) as HTMLElement;

      const { width, height } = useElementSize(modal.container);
      console.log('height', height.value)
      modal.width = width.value;
      modal.height = height.value;
    }
  },
  { immediate: true }
);
const { width: windowWidth, height: windowHeight } = useWindowSize();
const { x, y } = useDraggable(toRef(modal, 'container'), {
  preventDefault: true,
});

watch(
  () => [x.value, y.value],
  () => {
    if (modal.container) {
      let newX = x.value;
      let newY = y.value;

      if (newX < 0) {
        newX = 0;
      } else if (newX + modal.width > windowWidth.value) {
        newX = windowWidth.value - modal.width;
      }

      if (newY < 0) {
        newY = 0;
      } else if (newY + modal.height > windowHeight.value) {
        newY = windowHeight.value - modal.height;
      }

      modal.container.style.left = `${newX}px`;
      modal.container.style.top = `${newY}px`;
    }
  }
);
</script>

<template>
  <VueFinalModal
    v-model="draggableModal"
    display-directive="show"
    background="interactive"
    content-transition="vfm-fade"
    :hide-overlay="true"
  >
    <ClientOnly>
      <UCard 
        :ui=" {
            base: `absolute bottom-5 right-0 ${modelSize === '2x' ? 'w-2/3 h-2/3 ' : modelSize === '3x' ? 'w-3/4 h-3/4' : 'w-1/2 h-1/2'} overflow-hidden draggable-modal-${modal.uid}`,
          }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="text-base font-semibold leading-6 text-white">
               My Modal 
            </div>
            <div class="flex space-x-2">
              <UButton color="gray" variant="ghost" @click="setModalSize('1x')">1x</UButton>
              <UButton color="gray" variant="ghost" @click="setModalSize('2x')">2x</UButton>
              <UButton color="gray" variant="ghost" @click="setModalSize('3x')">3x</UButton>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeModal" />
          </div>
        </template>
  
        <slot name="content" />
  
        <template #footer>
          <div class="flex flex-wrap justify-end gap-4">
            <slot name="actions" />
          </div>
        </template>
      </UCard>
    </ClientOnly>
  </VueFinalModal>
</template>
