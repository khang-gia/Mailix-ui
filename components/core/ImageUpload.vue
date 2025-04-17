<template>
  <section>
    <div
      class="min-h-28 rounded-md border-dotted border-2 border-[#147FE0] text-muted px-3 py-2 block bg-gray-100"
      v-bind:class="{'border-primary': fileDragOver, 'border-danger': hasError}"
      @drop.prevent="addFile" 
      @dragover.prevent="fileDragOver=true"
      @dragleave.prevent="fileDragOver=false"
      @dragend.prevent="fileDragOver=false"
      @click.prevent="!readonly && fileInput.click()"
      :style="{
        height: height,
        width: width,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }">
      <h4 v-if="!filesCount && !readonly" class="block mt-4 text-center text-muted">Thả ảnh vào đây hoặc bấm để chọn.</h4>
      <div v-if="filesCount" class="block w-full">
        <div v-for="(selectedFile, $index) in selectedFiles" :key="$index" class="flex flex-col items-center mt-3">
          <img :src="selectedFile.preview" alt="Uploaded Image" class="max-w-full max-h-40 object-cover rounded-md" />
          <span v-text="selectedFile.info" class="mx-2 truncate mt-2"></span>
          <span @click.prevent="removeFile($index, $event)" class="text-red-500 pointer mt-2" v-if="!readonly">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zM7 6h10v13H7zm2 2v9h2V8zm4 0v9h2V8z"/></svg>
          </span>
        </div>
        <h4 class="d-block text-center mt-3 text-muted" v-if="!readonly && multiple">Thả ảnh vào đây hoặc bấm để thêm ảnh khác</h4>
      </div>
    </div>
    <input
      class="hidden"
      type="file" 
      v-bind:multiple="multiple" 
      ref="fileInput"
      accept="image/*"
      @change="onSelectFiles">
  </section>
</template>

<script setup>
    const props = defineProps({
        multiple: { type: Boolean, default: false },
        fileTypes: { type: String, default: '' },
        readonly: { type: Boolean, default: false },
        init: { type: Array, default: () => [] },
        hasError: { type: Boolean, default: false },
        width: { type: String, default: '400px' }, // New prop for width
        height: { type: String, default: '200px' } // New prop for height
    })
    const emit = defineEmits(['on-select', 'on-remove'])
    const selectedFiles= ref([])
    const fileDragOver= ref(false)
    const filesCount= computed(() => selectedFiles.value.length)
    const fileInput = ref(null)

    const addFile = (e) => {
      fileDragOver.value = false
      if (props.readonly) return
      if (props.multiple) {
        selectedFiles.value = selectedFiles.value.concat(getDroppedFiles(e.dataTransfer.files))
        emit('on-select', selectedFiles)
      } else {
        if (selectedFiles.value.length > 0) {
            const temporarySelectedFiles = getDroppedFiles(e.dataTransfer.files)
            selectedFiles.value = temporarySelectedFiles;
            emit('on-select', selectedFiles.value);
        } else {
          selectedFiles.value = getDroppedFiles(e.dataTransfer.files)
          emit('on-select', selectedFiles)
        }
      }
    }
    const onSelectFiles = (event) => {
      if (props.readonly) return
      if (props.multiple) {
        selectedFiles.value = selectedFiles.concat(getDroppedFiles(event.target.files))
        emit('on-select', selectedFiles)
        resetInput()
      } else {
        if (selectedFiles.value.length > 0) {
            selectedFiles.value = getDroppedFiles(event.target.files);
            emit('on-select', selectedFiles.value);
            resetInput()
        } else {
          selectedFiles.value = getDroppedFiles(event.target.files)
          emit('on-select', selectedFiles)
          resetInput()
        }
      }
    }
    const removeFile = ($index, e) => {
      e.stopPropagation()
      selectedFiles.value.splice($index, 1)
      emit('on-remove', selectedFiles)
    }
    const getFileInfo = (_file) => {
      const map = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      let step = 0
      let size = _file.size
      while (size > 1000) {
        size = size / 1000
        step++
      }
        return `${_file.name} - ${size.toFixed(2)} ${map[step]}`
    }
    const resetInput = () => {
        fileInput.value.value = ''
    }
    const getFileType = (_file) => {
      const _fileType = _file.type
      if (_fileType.includes('openxmlformats')) {
        return "earmark-spreadsheet"
      }
      if (_fileType.includes('pdf')) {
        return 'pdf'
      }
      if (_fileType.includes('image')) {
        return 'earmark-image'
      }
      if (_fileType.includes('zip') || _fileType.includes('rar') || _fileType.includes('7z')) {
        return 'zip'
      }
      return 'medical'
    }
    const getDroppedFiles = (_files) => {
        if (!_files) return []
      let res = []
      for (let _file of _files) {
        // info will conain file size in human readable
        _file.info = getFileInfo(_file)
        _file.fileType = getFileType(_file)
        _file.preview = URL.createObjectURL(_file) // Generate preview URL
        res.push(_file)
        if (!props.multiple) {
          return res
        }
      }
      return res
    }
    const removeAllFiles = () => {
      selectedFiles.value = []
      emit('on-remove', selectedFiles)
    }
    defineExpose({
      removeAllFiles
    })
</script>