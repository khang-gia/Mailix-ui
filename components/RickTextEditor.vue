<template>
    <div v-if="editor" class="flex flex-col h-full dark:bg-gray-800 bg-white rounded-t-md shadow-md">
        <div class="flex gap-2 items-center p-2 rounded-t-md border border-gray-300">
            <UButton
                @click="buttons[0].action"
                variant="ghost"
                color="gray"
                :class="{ 'is-active': editor.isActive('bold') }"
            >
                <UIcon v-if="buttons[0].icon" :name="buttons[0].icon" class="inline-block ml-1 text-gray-500" />
            </UButton>
            <UButton
                @click="buttons[1].action"
                variant="ghost"
                color="gray"
            >
                <UIcon v-if="buttons[1].icon" :name="buttons[1].icon" class="inline-block ml-1 text-gray-500" />
            </UButton>
            <UButton
                @click="buttons[2].action"
                variant="ghost"
                color="gray"
            >
                <UIcon v-if="buttons[2].icon" :name="buttons[2].icon" class="inline-block ml-1 text-gray-500" />
            </UButton>
            <UDivider class="h-6" orientation="vertical" />
            <UButton
                @click="buttons[3].action"
                variant="ghost"
                color="gray"
            >
                <UIcon v-if="buttons[3].icon" :name="buttons[3].icon" class="inline-block ml-1 text-gray-500" />
            </UButton>
            <UButton
                @click="buttons[4].action"
                variant="ghost"
                color="gray"
            >
                <UIcon v-if="buttons[4].icon" :name="buttons[4].icon" class="inline-block ml-1 text-gray-500" />
            </UButton>
            <UDivider class="h-6" orientation="vertical" />

            <UButton
                @click="buttons[5].action"
                variant="ghost"
                color="gray"
            >
                <UIcon v-if="buttons[5].icon" :name="buttons[5].icon" class="inline-block ml-1 text-gray-500" />
            </UButton>
        </div>
        <EditorContent class="p-4 border border-gray-300 rounded-b-md min-h-[100px] text-gray-800" :editor="editor" />
    </div>
    
  </template>
<style lang="scss">
/* Basic editor styles */
.ProseMirror:focus {
    outline: none;
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #acb0b4;
  pointer-events: none;
  height: 0;
}
.tiptap {
  :first-child {
    margin-top: 2;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }
}
</style>
<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { ListItem, OrderedList, BulletList } from '@tiptap/extension-list'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Document from '@tiptap/extension-document'
import { Placeholder } from '@tiptap/extensions'

const content = defineModel({default:''})

const editor = computed(() => 
    new Editor({
        extensions: [StarterKit, Underline, 
        , ListItem, Paragraph, Text, 
        OrderedList.configure({
            HTMLAttributes: {
                keepAttributes: true,
                class: 'list-decimal pl-5',
            },
        }),
        BulletList.configure({
                HTMLAttributes: {
                    keepAttributes: true,
                    class: 'list-disc pl-5',
                },
            }), Document,
        Placeholder.configure({
            placeholder: 'Thêm nội dung mô tả...',
            showOnlyCurrent: false,
            showOnlyWhenEditable: false,
        }),
    ],
        content: '',
        onUpdate: ({ editor }) => {
            content.value = editor.getHTML();
            // console.log('Content updated:', editor.getJSON());
            // const isEmptyContent = !editor.getJSON().content || editor.getJSON().content.every(node => node.type === 'paragraph' && (!node.content || node.content.length === 0));
            // if (isEmptyContent) {
            //     editor.commands.setContent('<p>Thêm nội dung mô tả</p>')
            // }
        },
        
    })
)
const buttons = [
    {
        label: 'Bold',
        icon: 'mdi-format-bold', // Iconify: Material Design Icons
        action: () => editor.value.chain().focus().toggleBold().run(),
        },
        {
        label: 'Italic',
        icon: 'mdi-format-italic', // Iconify: Material Design Icons
        action: () => editor.value.chain().focus().toggleItalic().run(),
        },
        {
        label: 'Underline',
        icon: 'mdi-format-underline', // Iconify: Material Design Icons
        action: () => editor.value.chain().focus().toggleUnderline().run(),
        },
        {
        label: 'Ordered List',
        icon: 'heroicons:numbered-list', // Heroicons Outline
        action: () => editor.value.chain().focus().toggleOrderedList().run(),
        },
        {
        label: 'Bullet List',
        icon: 'heroicons-outline:list-bullet', // Heroicons Outline
        action: () => editor.value.chain().focus().toggleBulletList().run(),
        },
        {
        label: 'Clear Formatting',
        icon: 'mdi-format-clear', // Iconify: Material Design Icons
        action: () => editor.value.chain().focus().unsetAllMarks().clearNodes().run(),
    },
]
watch(content, (newValue) => {
    const isSame = editor.value.getHTML() === newValue

    if (isSame) {
        return
    }

    editor.value.commands.setContent(newValue, false)
})
onUnmounted(() => {
    console.log('Editor destroyed')
    editor.value.destroy()
})
onMounted(() => {
    // editor.value.commands.setContent(content.value, false)
    // editor.value.on('update', () => {
    //     content.value = editor.value.getHTML()
    // })
    // editor.value.on('selectionUpdate', () => {
    //     content.value = editor.value.getHTML()
    // })
    // editor.value.on('transaction', () => {
    //     content.value = editor.value.getHTML()
    // })
    // editor.value.on('blur', () => {
    //     content.value = editor.value.getHTML()
    // })
    editor.value = new Editor({
        extensions: [StarterKit, Underline, 
        , ListItem, Paragraph, Text, 
        OrderedList.configure({
            HTMLAttributes: {
                keepAttributes: true,
                class: 'list-decimal pl-5',
            },
        }),
        BulletList.configure({
                HTMLAttributes: {
                    keepAttributes: true,
                    class: 'list-disc pl-5',
                },
            }), Document],
        content: '',
        onUpdate: ({ editor }) => {
            content.value = editor.getHTML()
        },
    })
})
  </script>
  