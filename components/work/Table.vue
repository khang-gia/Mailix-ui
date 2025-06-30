<template>
    <div class="bg-white dark:bg-[#1E1E2E] rounded-md">
        <UTable v-model="_selected" v-model:sort="sort" sort-mode="manual" @update:sort="page = 1" :columns :rows="works" 
        :sortButton="{icon:'none',type:'string', color: 'none', variant: 'ghost', size: '2xs', square: true } "
        :ui="{
            base: 'w-max',
            th: {
                base: 'text-center rtl:text-right border whitespace-nowrap items-center',
                padding: 'px-4 py-3.5',
                color: 'text-black dark:text-white',
                font: 'font-bold',
                size: 'text-sm'
            },
            td: {
                base: 'whitespace-nowrap border',
                padding: 'px-4 py-4',
                color: 'text-gray-800 dark:text-gray-300',
                font: '',
                size: 'text-sm'
            },
        }"
        >
        <template #name-data="{ row }">
            <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer" @click="selectWork(row)">{{ row.name }}</span>
            </div>
        </template>
        <template #progress-data="{ row }">
            <UProgress :value=row.progress indicator/>
        </template>
        <template #start_date-data="{row}">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ dayjs(row.start_date).format('YYYY-MM-DD') }}</span>
        </template >
        <template #end_date-data="{row}">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ dayjs(row.end_date).format('YYYY-MM-DD') }}</span>
        </template >
        <template #actual_start_date-data="{row}">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ dayjs(row.actual_start_date).format('YYYY-MM-DD') }}</span>
        </template >
        <template #assigned_to-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.assigned_to && row.assigned_to.length">
                <div v-for="user in row.assigned_to" :key="user.id">
                    <NuxtLink v-if="user.profile_hr" :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                        <UTooltip :text="user.display_name">
                            <UAvatar :src="user.avatar" :alt="user.display_name" />
                        </UTooltip>
                    </NuxtLink>
                </div>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{$t('No user assigned')}}</span>
            </div>
        </template>
        <template #assigned_by-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.assigned_by && row.assigned_by.length">
                <div v-for="user in row.assigned_by" :key="user.id">
                    <NuxtLink v-if="user.profile_hr" :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                        <UTooltip :text="user.display_name">
                            <UAvatar :src="user.avatar" :alt="user.display_name" />
                        </UTooltip>
                    </NuxtLink>
                </div>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{$t('No user')}}</span>
            </div>
        </template>
        <template #managers-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.managers && row.managers.length">
                <div v-for="user in row.managers" :key="user.id">
                    <NuxtLink v-if="user.profile_hr" :to="{ name: 'hr-id', params: { id: user.profile_hr.id } }">
                        <UTooltip :text="user.display_name">
                            <UAvatar :src="user.avatar" :alt="user.display_name" />
                        </UTooltip>
                    </NuxtLink>
                </div>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{$t('No user assigned')}}</span>
            </div>
        </template>
        <template #created_by-data="{row}">
            <UAvatarGroup size="xs" :max="4" v-if="row.created_by">
                <NuxtLink v-if="row.created_by.profile_hr" :to="{ name: 'hr-id', params: { id: row.created_by.profile_hr.id } }">
                    <UTooltip :text="row.created_by.display_name">
                        <UAvatar :src="row.created_by.avatar" :alt="row.created_by.display_name" />
                    </UTooltip>
                </NuxtLink>
            </UAvatarGroup>
            <div v-else>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{$t('No user assigned')}}</span>
            </div>
        </template>
        </UTable>
    </div>

</template>
<style scoped>

</style>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(['update:page', 'update:selected'])
const dayjs = useDayjs()
 
const props = defineProps({
  works: {
    type: Array,
    default: []
  },
  pageTotal:{
    type: Number,
    required: true
  },
  page:{
    type: Number,
    required: true
  }
})
const _page = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
  }
})
const columns = [
    {   
        key: 'name',
        label: t('Work Name'),
        sortable: true,
    },
    {
        key: 'code',
        label: t('Work Code'),
        sortable: true,
    },
    {
        key: 'progress',
        label: t('Progress'),
        sortable: true,
    },
    {
        key: 'assigned_to',
        label: t('Work assigned to'),
        sortable: true,
    },
    {
        key: 'assigned_by',
        label: t('Work assigned by'),
        sortable: true,
    },
    {
        key: 'managers',
        label: t('Work manage by'),
        sortable: true,
    },
    {
        key: 'start_date',
        label: t('Start date'),
        sortable: true,
    },
    {
        key: 'end_date',
        label: t('End date'),
        sortable: true,
    },
    {
        key: 'actual_start_date',
        label: t('Actual start date'),
        sortable: true,
    },
    {
        key: 'created_by',
        label: t('Created By'),
        sortable: true,
    },
]

const selected = ref([])
const _selected = computed({
  get: () => selected.value,
  set: (val) => {
    selected.value = val; 
    emit('update:selected', val); 
  }
});
const selectWork =  (row) => {
  const userId = row.id
  useRouter().push({ name: 'works-id', params: { id:userId } });
}
</script>