<template>
  <div class="py-2 px-4 grid grid-flow-col bg-white dark:bg-[#1E1E2E] space-x-2 w-full">
    <div class="flex items-center">
      <div class="flex items-center gap-3 pr-3">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          <span class="text-primary-500">{{ workInfo.name }}</span>
        </h1>
      </div>
    </div>
    <div class="flex justify-end">
      <!-- <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-up-tray" :label="$t('Import')" size="xs" :to="{name: 'works-upload'}"/> -->
      <!-- <UButton icon="i-heroicons-pencil-square" label="Cập nhật" @click="editworkInfo" /> -->
      <UDropdown :items="actionDropdown" :popper="{ placement: 'bottom-start' }">
        <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-chevron-double-down" class="border" />
        <template #item="{ item }">
          <span class="truncate" :class="{ 'text-mailix-primary dark:text-white': viewMode === item.selectedName }">{{
            item.label }}
          </span>
          <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
            :class="{ 'text-mailix-primary dark:text-white': viewMode === item.selectedName }" />
        </template>
      </UDropdown>
    </div>
  </div>
  <div class="p-4 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">

      <div class="lg:col-span-3 md:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {{$t('General Information')}}
              </h2>
              
            </div>
            </template>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">

            <WorkDetailItem label="Work Name" :value="workInfo.name" class="md:col-span-1" />
            <WorkDetailItem label="Work Code" :value="workInfo.code" class="md:col-span-1" />

            <WorkDetailItem label="Progress" :value="progress" >

              <template #value>
                <UProgress :value="workInfo.progress" indicator class="w-32" />
              </template>
            </WorkDetailItem>

            <WorkDetailItem label="Start date" :value="dayjs(workInfo.start_date).format('YYYY-MM-DD HH:mm')" />
            <WorkDetailItem label="End date" :value="dayjs(workInfo.end_date).format('YYYY-MM-DD HH:mm')" />
            <WorkDetailItem label="Actual start date" :value="dayjs(workInfo.actual_start_date).format('YYYY-MM-DD')" />
            <WorkDetailItem v-if="workInfo.status" label="Status" :value="workInfo.status_display" class="md:col-span-1">
              <template #value>
                <UBadge  :color="statusMapping[workInfo.status]"
                 variant="subtle" class="font-semibold">{{ $t(workInfo.status_display)}}</UBadge>
              </template>
            </WorkDetailItem>
            <WorkDetailItem v-if="workInfo.priority" label="Priority" :value="workInfo.priority" class="md:col-span-1" >
                <template #value>
                  <UBadge  :color="statusMapping[workInfo.priority]"
                   variant="subtle" class="font-semibold">{{ $t(workInfo.priority_display)}}</UBadge>
                </template>
              </WorkDetailItem>
            <!-- <WorkDetailItem label="Priority" :value="workInfo.priority" /> -->

            <!-- <UDivider class="md:col-span-2 lg:col-span-3 my-4" /> -->

            <WorkDetailItem label="Assigned to" :value="workInfo.assigned_to_list" />
            <WorkDetailItem label="Assigned by" :value="workInfo.assigned_by_list" />
            <WorkDetailItem label="Work manage by" :value="workInfo.managers_list" />


          </div>

          <UDivider class="my-6" />

          <h2 class="text-xl font-semibold border-b pb-3 mb-4 text-gray-800 dark:text-gray-100">
            Mô tả
          </h2>
          <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            <span v-if="workInfo.description" v-html="workInfo.description"></span>
            <span v-else>{{ 'Không có mô tả chi tiết cho công việc này.' }}</span>
          </div>

        </UCard>
      </div>

      <div class="lg:col-span-1 md:col-span-2">
        <UCard :ui="{
          footer: { base: 'border-none', padding:'px-4 py-4 sm:px-6'
        }
        }">
          <UTabs :items="tabs" class="w-full"  @change="updateTab">
            <template #item="{ item }">
              <div class="mt-4">
                <div v-if="item.key === 'discussions'" class="h-full overflow-x-hidden">
                  <CommentsSection comment-type="works"/>
                </div>
                <div v-else-if="item.key === 'activity_log'" class="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                  <div v-for="history in workHistory" :key="history.id" class="border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                    <ActivityLogItem :history="history" history-type="work" />
                  </div>
                </div>
              </div>
              
            </template>
          </UTabs>
          <!-- <template #footer>
            <div v-if="activeTab===0" class="mb-4">
               <UInput
                  type="text"
                  :placeholder="$t('Write a discussion...')"
                  size="sm"
                  class="w-full"
                  :ui="{ 
                    icon: { 
                      trailing: { 
                        pointer: '' 
                      },
                      leading:{
                        wrapper: 'flex items-center justify-center',
                        pointer:''
                      }
                    } 
                  }"
                >
                <template #trailing>
                  <UButton :padded="false" color="blue" variant="link" icon="i-heroicons-paper-airplane-20-solid" />
                </template>
              </UInput>
            </div>
          </template> -->
        </UCard>
      </div>

    </div>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs()

definePageMeta({
  title: 'Chi tiết công việc',
})

const discussions = ref([
    { user: 'Gia Khang', message: 'Đã nhắc bạn hỗ trợ giới thiệu đối tác nhé!', time: '10:00 04/02/2024' },
    { user: 'Thanh Thanh', message: 'em đã gửi đính kèm file tiến độ lên đây nhé', time: '10:47 22/07/2024' },
])
const statusMapping = [
  "none",
  "gray",
  "blue",
  "green",
  "amber",
  "slate",
  "indigo",
  "cyan",
  "emerald",
  "red",
  "yellow",
  "rose",
  "lime",
  "gray",
  "red",
  "purple"
];
const activeTab = ref(0)
const updateTab = (val) => {
  activeTab.value = val
}
const tabs = [{
  label: t('Discussion'),
  key: 'discussions',
}, {
  label: t('Activity Log'),
  key: 'activity_log',
}]
const workInfo = ref({})
const workHistory = ref([])

const fetchHistory = async () => {
    try {
        const {data: response} = await useAPI().get(`core/works/${useRoute().params.id}/history/`);
        workHistory.value = response.value
    } catch (error) {
        console.error('Error loading history data:', error);
    }
}
const fetchWorkInfo = async () => {
    try {
        const {data: response} = await useAPI().get(`core/works/${useRoute().params.id}/`);
        workInfo.value = response.value
        workInfo.value.start_date = workInfo.value.start_date ? new Date(workInfo.value.start_date) : null
        workInfo.value.end_date = workInfo.value.end_date ? new Date(workInfo.value.end_date) : null
        workInfo.value.actual_start_date = workInfo.value.actual_start_date ? new Date(workInfo.value.actual_start_date) : null
        workInfo.value.related_work = workInfo.value.related_work ? workInfo.value.related_work.id : '',
        console.log('response', workInfo.value)
    } catch (error) {
        console.error('Error loading data:', error);
    }
};
const fetchData = async () => {
    try {
        await fetchWorkInfo();
        await new Promise((resolve) => setTimeout(resolve, 300));
        await fetchHistory();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
fetchData();

const viewMode=ref('default')

const actionDropdown = ref([
    [{
      label: t('Update'),
      icon: 'i-heroicons-pencil-square',
      click: () => {
        useRouter().push({ name: 'works-id-update', params: { id: useRoute().params.id } })
      }
    },
    {
      label: t('Add document'),
      icon: 'i-heroicons-arrow-up-on-square',
      click: () => {
        viewMode.value = 'new_tab'
      }
    }]
])
</script>