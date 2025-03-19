<template>
    <div>
        <UTable :columns :rows="users">

        </UTable>
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const columns = [
    {   
        key: 'code',
        label: t('User Code'),
        sortable: true,
    },
    {
        key: 'name',
        label: t('Name'),
        sortable: true,
    },
    {
        key: 'name',
        label: t('Name'),
        sortable: true,
    },
]
const users = computedAsync(async () => {
  const data = await useAPI().get('core/profile_hrs/', { customer_company_id: userStore.company.id, search: search.value, page: page.value, page_size: pageSize.value })
  total.value = data.count
  return data.results
})
</script>