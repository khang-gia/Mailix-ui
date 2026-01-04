<template>
    <section>
        <div class="min-h-28 border-dotted border-2 border-[#147FE0] text-muted px-3 py-2 block bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            v-bind:class="{ 'border-primary': fileDragOver, 'border-danger': hasError }" @drop.prevent="addFile"
            @dragover.prevent="fileDragOver = true" @dragleave.prevent="fileDragOver = false"
            @dragend.prevent="fileDragOver = false" @click.prevent="!readonly && fileInput.click()" :style="{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }">
            <div v-if="!filesCount && !readonly" class="text-center py-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ $t('Drop file here or click to select') }}
                </p>
                <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">PDF, DOC, DOCX, JPG, PNG</p>
            </div>
            <div v-if="filesCount" class="w-full py-2">
                <div v-for="(selectedFile, $index) in selectedFiles" :key="$index"
                    class="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600 mb-2">
                    <div class="flex items-center space-x-3 flex-1 min-w-0">
                        <div class="flex-shrink-0">
                            <svg v-if="selectedFile.fileType === 'pdf'" class="h-8 w-8 text-red-500" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <svg v-else-if="getFileType(selectedFile).includes('image')" class="h-8 w-8 text-blue-500"
                                fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clip-rule="evenodd" />
                            </svg>
                            <svg v-else class="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{
                                getFileName(selectedFile) }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">{{ selectedFile.info ||
                                getFileSize(selectedFile) }}</p>
                        </div>
                    </div>
                    <button v-if="!readonly" @click.stop.prevent="removeFile($index, $event)"
                        class="flex-shrink-0 ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                <p v-if="!readonly && multiple" class="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">{{
                    $t('Drop file here or click to add another') }}</p>
            </div>
        </div>
        <input class="hidden" type="file" v-bind:multiple="multiple" ref="fileInput" :accept="fileTypes"
            @change="onSelectFiles">
    </section>
</template>

<script setup>
const props = defineProps({
    multiple: { type: Boolean, default: false },
    fileTypes: { type: String, default: '.pdf,.doc,.docx,.jpg,.jpeg,.png' },
    readonly: { type: Boolean, default: false },
    hasError: { type: Boolean, default: false },
})
const selectedFiles = defineModel({ default: () => [] })
const emit = defineEmits(['on-select', 'on-remove'])
const fileDragOver = ref(false)
const filesCount = computed(() => selectedFiles.value.length)
const fileInput = ref(null)

const addFile = (e) => {
    fileDragOver.value = false
    if (props.readonly) return
    if (props.multiple) {
        selectedFiles.value = selectedFiles.value.concat(getDroppedFiles(e.dataTransfer.files))
        emit('on-select', selectedFiles)
    } else {
        selectedFiles.value = getDroppedFiles(e.dataTransfer.files)
        emit('on-select', selectedFiles.value)
    }
}

const onSelectFiles = (event) => {
    if (props.readonly) return
    if (props.multiple) {
        selectedFiles.value = selectedFiles.value.concat(getDroppedFiles(event.target.files))
        emit('on-select', selectedFiles)
        resetInput()
    } else {
        selectedFiles.value = getDroppedFiles(event.target.files)
        emit('on-select', selectedFiles.value)
        resetInput()
    }
}

const removeFile = ($index, e) => {
    e.stopPropagation()
    selectedFiles.value.splice($index, 1)
    emit('on-remove', selectedFiles)
}

const getFileName = (file) => {
    if (file.name) return file.name
    if (file.preview && typeof file.preview === 'string') {
        // Extract filename from URL
        const parts = file.preview.split('/')
        return decodeURIComponent(parts[parts.length - 1])
    }
    return 'Unknown file'
}

const getFileSize = (file) => {
    if (file.size) {
        const map = ['B', 'KB', 'MB', 'GB']
        let step = 0
        let size = file.size
        while (size > 1000 && step < map.length - 1) {
            size = size / 1000
            step++
        }
        return `${size.toFixed(2)} ${map[step]}`
    }
    return ''
}

const getFileInfo = (_file) => {
    const size = getFileSize(_file)
    return `${_file.name}${size ? ' - ' + size : ''}`
}

const resetInput = () => {
    if (fileInput.value) fileInput.value.value = ''
}

const getFileType = (_file) => {
    const _fileType = _file.type || ''
    const fileName = _file.name || ''

    if (_fileType.includes('pdf') || fileName.endsWith('.pdf')) {
        return 'pdf'
    }
    if (_fileType.includes('image') || /\.(jpg|jpeg|png|gif)$/i.test(fileName)) {
        return 'image'
    }
    if (_fileType.includes('word') || _fileType.includes('document') || /\.(doc|docx)$/i.test(fileName)) {
        return 'document'
    }
    return 'file'
}

const getDroppedFiles = (_files) => {
    if (!_files) return []
    let res = []
    for (let _file of _files) {
        _file.info = getFileInfo(_file)
        _file.fileType = getFileType(_file)
        // Only create object URL for actual File objects, not existing file data
        if (_file instanceof File) {
            _file.preview = URL.createObjectURL(_file)
        }
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
