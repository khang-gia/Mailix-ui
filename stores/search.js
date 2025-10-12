import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const search = ref('');
  const route = useRoute();

  watch(() => route.fullPath, () => {
    search.value = '';
  });

  function setSearch(value) {
    search.value = value;
  }

  return {
    search,
    setSearch,
  };
});
