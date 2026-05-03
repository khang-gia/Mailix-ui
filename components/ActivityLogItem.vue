<template>
  <div class="pt-2 space-y-1">
    
        <p class="font-semibold text-gray-900 dark:text-gray-100 text-sm md:truncate">{{ historyUser(history.history_user) }} 
            <span class="text-gray-500 text-sm font-medium">{{historyAction(history.history_type_display)}}</span>
        </p>
      <span class="text-xs text-gray-500 dark:text-gray-400 items-center flex">
        <UIcon name="i-heroicons-clock" class="w-3 h-3 inline-block mr-1 shrink-0" />
        {{ dayjs(history.history_date).format('HH:mm DD/MM/YYYY') }}
      </span>

    <div v-if="history.history_type !== '+'" v-for="change in history.field_changes" :key="change.field" class="ml-2 text-sm flex">
        <p v-if="ignoreFields.includes(change.field)" class="text-gray-700 dark:text-gray-300">
            <span class="test-sm font-semibold text-primary-600">{{  parseChangeField(change.field) +' '+ $t('has changed')  }}</span>
        </p>
        <p v-else class="text-gray-700 dark:text-gray-300">
            <span class="test-sm font-semibold text-primary-600">{{ parseChangeField(change.field) }}:</span>
        </p>
        
        <div v-if="translateField.includes(change.field)" class="flex gap-2 text-xs ml-2">
            <p class="flex items-center text-red-600 dark:text-red-400">
                <!-- <UIcon name="i-heroicons-minus" class="w-3 h-3 mr-1 shrink-0" /> -->
                <span class="truncate">{{ change.old_value?$t(change.old_value):'Null' }}</span>
            </p>
            
            <p v-if="change.new_value" class="flex items-center">
                <UIcon name="i-heroicons-arrow-long-right" class="w-3 h-3 mr-1 shrink-0" />
                <span class="truncate text-green-600 dark:text-green-400">{{ $t(change.new_value) }}</span>
            </p>
        </div>
        <div v-else-if="ignoreFields.includes(change.field)" class="flex gap-2 text-xs ml-2">

        </div>
        <div v-else-if="textFields.includes(change.field)" class="flex gap-4 text-xs ml-2">
            <p class="flex items-center text-red-600 dark:text-red-400">
                <span v-if="change.old_value" class="truncate"  v-html="change.old_value"></span>
                <span v-else class="truncate"> Null</span>
            </p> 
            <p v-if="change.new_value" class="flex items-center">
                <UIcon name="i-heroicons-arrow-long-right" class="w-3 h-3 mr-1 shrink-0" />
                <span class="truncate text-green-600 dark:text-green-400" v-html="change.new_value"></span>
            </p>
        </div>
        <div v-else class="flex gap-2 test-xs ml-2">
            <p class="flex items-center text-red-600 dark:text-red-400">
                <!-- <UIcon name="i-heroicons-minus" class="w-3 h-3 mr-1 shrink-0" /> -->
                <span class="truncate">{{ change.old_value?change.old_value:'Null' }}</span>
                <span v-if="change.field === 'progress' || change.field === 'budget'">
                  {{ change.field === 'progress' ? '%' : '$' }}
                </span>
            </p>
            <p v-if="change.new_value" class="flex items-center ">
                <UIcon name="i-heroicons-arrow-long-right" class="w-3 h-3 mr-1 shrink-0" />
                <span class="truncate text-green-600 dark:text-green-400"> {{ change.new_value }}</span>
                <span v-if="change.field === 'progress' || change.field === 'budget'" class=" text-green-600 dark:text-green-400">
                  {{ change.field === 'progress' ? '%' : '$' }}
                </span>
            </p>
        </div>

        <!-- <div v-if="history.history_type === 'Created' && history.change_message" class="text-gray-700 dark:text-gray-300 text-sm mt-1">
            {{ history.change_message }}
        </div> -->
    </div>
    
    <!-- <p v-if="history.change_message && history.history_type !== 'Created'" class="text-gray-700 dark:text-gray-300 text-sm mt-1">
      {{ history.change_message }}
    </p> -->

  </div>
  <UDivider orientation="horizontal" class="my-2" />
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const dayjs = useDayjs()
const props = defineProps({
  history: {
    type: Object,
    required: true,
  },
  historyType: {
    type: String,
    required: false,
    default: 'work'
  }
})
const translateField = ['status', 'priority', 'type_of_customer', 'assigned_to', 'assigned_by', 'managers', 'assigned_groups', 'full_name', 'name', 'code', 'title','stage']
const ignoreFields = ['avatar']
const textFields = ['note', 'description']
const historyAction = (type) => {
    const historyTypeMapping = {
        contact: t('contact information'),
        customer: t('customer information'),
        company: t('company information'),
        work: t('work information'),
    };

    const statement = historyTypeMapping[props.historyType] || t('work information');

    switch (type) {
        case 'Created':
            return `${t('created')} ${t(props.historyType)}`;
        case 'Changed':
            return `${t('changed')} ${statement}`;
        default:
            return t('changed');
    }
}
const historyUser = (userinfo) => {
    if (!userinfo) return t('System')
    return userinfo.full_name? userinfo.full_name : userinfo.username
}
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};
const parseChangeField = (field) => {
    const fieldWithSpaces = field.replace(/_/g, ' ');
    return t(capitalizeFirstLetter(fieldWithSpaces))
};
</script>