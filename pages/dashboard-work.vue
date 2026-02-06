<template>
  <div class="p-4 space-y-2">
    <span class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
      {{ t("Hello") }}, {{ userInfo.display_name }}!
    </span>
    <div class="grid grid-cols-7 gap-4 items-start">
      <div class="col-span-5 flex gap-4">
        <div class="flex-1">
          <WorkTodayTask :todayTasks="todayTasks" />
        </div>
        <div v-if="allTasks" class="flex-1" id="overview-card">
          <UCard
            :ui="{ rounded: 'rounded-xl', divide: '', body: { padding: 'py-0' }, footer: { padding: 'px-0' }, header: { padding: 'pb-0' } }"
            class="w-full h-full">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center justify-center space-x-2">
                  <span class="rounded-full w-10 h-10 justify-center flex items-center bg-slate-100">
                    <UIcon name="ix:doughnutchart-filled" class="w-5 h-5 text-black inline-block shrink-0" />
                  </span>
                  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {{ $t('Overview') }}
                  </h2>
                </div>
              </div>
            </template>
            <ChartDoughnut v-if="DNChartData" :chartData="DNChartData" :chartOptions="DNChartOptions" />
          </UCard>
        </div>
      </div>

      <WorkOverviewCard :allTasks="allTasks" :matchHeight="overviewHeight" class="col-span-2" />
      <!-- <WorkProjectTimeline :tasks="allTasks" /> -->
    </div>

    <div class="py-2">
      <!-- <div>
        <WorkActivityTimeline :tasks="allTasks" />
      </div> -->

      <div>
        <WorkProjectTimeline :tasks="allTasks" />
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  title: 'Dashboard',
})
const { data: userInfo } = useAuth()

import { useI18n } from "vue-i18n";
import pattern from 'patternomaly';
import { useSearchStore } from '@/stores/search';
import { storeToRefs } from 'pinia'
const searchStore = useSearchStore();
const { search } = storeToRefs(searchStore);
const { t } = useI18n();

const reload = ref(false)
const page = ref(1)
const pageSize = ref(10)
const pageTotal = ref(0)
const overviewHeight = ref(0)

const todayTasks = computedAsync(async () => {
  const { data: data } = await useAPI().get('core/works/', {
    reload: reload.value,
    page: page.value,
    search: search.value,
    page_size: pageSize.value,
    // assigned_to_person: userInfo.value.id,
    related_task: userInfo.value.id,
    today_task: true,
  })
  pageTotal.value = data.value.count
  return data.value.results
})
const allTasks = computedAsync(async () => {
  const { data: data } = await useAPI().get('core/works/', {
    reload: reload.value,
    page: page.value,
    search: search.value,
    page_size: pageSize.value,
    // assigned_to_person: userInfo.value.id,
    related_task: userInfo.value.id,
  })
  pageTotal.value = data.value.count
  return data.value.results
})


// Track the height of the overview card
const updateOverviewHeight = () => {
  nextTick(() => {
    const overviewCard = document.getElementById('overview-card')
    if (overviewCard) {
      overviewHeight.value = overviewCard.offsetHeight
    }
  })
}

onMounted(() => {
  const overviewCard = document.getElementById('overview-card')
  if (overviewCard) {
    updateOverviewHeight()

    // Use ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(updateOverviewHeight)
    resizeObserver.observe(overviewCard)

    onUnmounted(() => {
      resizeObserver.disconnect()
    })
  }
})

// Recalculate height when tasks data changes (important for navigation)
watch(allTasks, () => {
  updateOverviewHeight()
})


// Handle Kanban status update
const handleStatusUpdate = async ({ taskId, oldStatus, newStatus }) => {
  try {
    await useAPI().patch(`core/works/${taskId}/`, {
      status: newStatus
    })
    // Reload tasks to reflect the change
    reload.value = !reload.value
  } catch (error) {
    console.error('Failed to update task status:', error)
    // Optionally show error notification to user
  }
}
// const {data: hrmStatistic, refresh} = await useAPI().get(`core/hrm_statistic/`);
const completeWorkData = computed(() => {
  if (!allTasks.value) return [0, 0, 0]
  return [
    allTasks.value.filter(task => task.status === 1).length,
    allTasks.value.filter(task => task.status === 2).length,
    allTasks.value.filter(task => task.status === 3).length,
  ]
})
const DNChartData = ref(null);

// Function to generate chart data
const generateChartData = () => {
  DNChartData.value = {
    labels: [t('Not Started'), t('In Progress'), t('Completed')],
    datasets: [
      {
        data: completeWorkData.value,
        backgroundColor: [
          pattern.draw('dash', '#D8DCE0'), // Light gray
          pattern.draw('diagonal', '#4278ef'), // Orange circles
          pattern.draw('diamond', '#25a752'), // Green diamonds
        ],
        hoverOffset: 10,
      },
    ],
  };
};

// Watch for changes in todayTasks and regenerate chart data
watch(allTasks, (newTasks) => {
  if (newTasks) {
    generateChartData();
  }
});

// Generate chart data on initial mount
onMounted(() => {
  generateChartData();
});

const DNChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: false
    },
    datalabels: {
      display: false
    },
  },
}
</script>