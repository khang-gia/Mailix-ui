<template>
  <BaseModal
    v-if="articleTypeModal"
    :modalOpen="articleTypeModal"
    :closeOnClick="true"
    :closeOnEsc="true"
    @close-modal="closeModal"
    :noHeader="true"
  >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup>
        <label for="title">Title</label>
        <input id="title" v-model="form.title" type="text" required />
      </UFormGroup>
      <UFormGroup>
        <label for="slug">Slug</label>
        <input id="slug" v-model="form.slug" type="text" required />
      </UFormGroup>
      <UFormGroup>
        <label for="thumb">Thumbnail</label>
        <input id="thumb" v-model="form.thumb" type="text" required />
      </UFormGroup>
      <UFormGroup>
        <label for="message">Message</label>
        <input id="message" v-model="form.message" type="text" required />
      </UFormGroup>
      <UFormGroup>
        <label for="content">Content</label>
        <textarea id="content" v-model="form.content" required></textarea>
      </UFormGroup>
      <UFormGroup>
        <label for="privacy">Privacy</label>
        <select id="privacy" v-model="form.privacy" required>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </UFormGroup>
      <UFormGroup>
        <label for="status">Status</label>
        <select id="status" v-model="form.status" required>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </UFormGroup>
      <UFormGroup>
        <label for="created_by">Created By</label>
        <input id="created_by" v-model="form.created_by" type="text" required />
      </UFormGroup>
      <UFormGroup>
        <label for="has_notify">Has Notify</label>
        <input id="has_notify" v-model="form.has_notify" type="checkbox" />
      </UFormGroup>
      <UFormGroup>
        <label for="source_name">Source Name</label>
        <input
          id="source_name"
          v-model="form.source_name"
          type="text"
          required
        />
      </UFormGroup>
      <UFormGroup>
        <label for="source_link">Source Link</label>
        <input
          id="source_link"
          v-model="form.source_link"
          type="url"
          required
        />
      </UFormGroup>
      <button type="submit">Create Article</button>
    </UForm>
  </BaseModal>
</template>

<script setup>
import _ from "lodash";
import * as yup from 'yup'
import { useModalStore } from "@/stores/modal";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const modalStore = useModalStore();
const { setCreateArticleTypeModal } = modalStore;
const { articleTypeModal } = storeToRefs(modalStore);

const props = defineProps(["modalOpen"]);
const emit = defineEmits(["close-modal"]);

const closeModal = () => {
  resetModal();
  setCreateArticleTypeModal(false);
  emit("close-modal");
};
const resetModal = () => {
  dataStock.value = searchStocks.value;
};
const route = useRoute();
const schema = yup.object({
  name: yup.string().required(t('Type article name')).min(3, 'Article name need at least 3 characters')
})
onUnmounted(() => {
  resetModal();
});
defineExpose({
  resetModal,
});
</script>
