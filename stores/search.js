import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const search = ref('');

  function setSearch(value) {
    search.value = value;
  }

  return {
    search,
    setSearch,
  };
});