<template>
    <div>
        <div class="text-center py-12 relative">
            <p class="text-green-600 font-bold font-sans tracking-widest uppercase">
                Dịch Vụ Của Titaca
            </p>
            <h1 class="text-3xl md:text-4xl font-bold font-sans text-gray-900 mt-2 dark:text-white">
                Giải Pháp Cho Doanh Nghiệp <br /> Trong Thời Đại 4.0
            </h1>
            <!-- <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-16 bg-gradient-to-t from-white to-transparent"></div> -->
        </div>

      <div v-if="articles.length>0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-5">
        <div v-for="(item, index) in articles" :key="index" class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col hover:-translate-y-4 transition-all duration-500 h-full">
            <!-- Illustration -->
            <img :src="item.thumb" alt="Illustration" class="w-full h-40 object-cover mb-4 rounded-lg" />
            <!-- Content -->
            <div class="flex items-start justify-between gap-3 ">
                <!-- <div class="p-2 bg-green-100 rounded-lg">
                <Icon name="heroicons-outline:globe-alt" class="text-green-600 w-6 h-6" />
                </div> -->
                <h3 class="text-lg font-bold font-sans text-gray-900 dark:text-white uppercase">{{ item.title }}</h3>
                <p class="text-sm text-gray-600">{{ formatDate(new Date(item.published_at), "DD/MM/YYYY HH:mm") }}</p>
            </div>

            <p class="text-gray-700 text-sm mt-3 dark:text-white truncate font-sans">
                {{ item.message }}
            </p>

            <div class="mt-auto flex justify-between items-center pt-4 font-sans">
                <NuxtLink :to="`/bai-viet/${item.slug}/${item.id}`">
                    <UButton variant="solid" class="group rounded-full bg-emerald-400 hover:bg-emerald-600 transition-all duration-500 transform hover:scale-105">
                        Liên hệ tư vấn
                        <UIcon name="heroicons:arrow-right-solid" size="sm" class="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:w-6 transition-opacity" />
                    </UButton>
                </NuxtLink>
                <NuxtLink :to="`/bai-viet/${item.slug}/${item.id}`">
                    <UButton color="gray" variant="ghost">
                        Xem thêm
                        <UIcon name="heroicons:chevron-right-solid"/>
                    </UButton>
                </NuxtLink>
            </div>
        </div>
          <!-- <article v-for="item in articles" class="flex bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">
              <UTooltip text="Bài viết dành riêng" v-if="item.privacy==2" class="absolute right-0 top-0 z-2">
                  <Icon name="twemoji:sports-medal" size="32"></Icon>
              </UTooltip>
              <NuxtLink class="relative block w-24 sm:w-56 xl:sidebar-expanded:w-40 2xl:sidebar-expanded:w-56 shrink-0" :to="`/bai-viet/${item.slug}/${item.id}`">
                  <img v-if="item.thumb" class="absolute object-cover object-center w-full h-full" :src="item.thumb" width="220" height="236" :alt="item.slug" />
              </NuxtLink>
              
              <div class="grow p-5 flex flex-col">
                  <div class="grow">
                  
                  <NuxtLink class="inline-flex mb-2" :to="`/bai-viet/${item.slug}/${item.id}`">
                      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                          <span v-if="item.privacy==2" class="text-green-500">
                              <Icon name="solar:medal-ribbons-star-bold-duotone" size="24"></Icon>
                          </span>
                          {{ item.title }}
                      </h3>
                  </NuxtLink>
                  <div class="text-sm" @click.right.prevent @keydown="keydown" @copy.prevent @paste.prevent>{{ item.message }}</div>
                  </div>
                  <div class="flex justify-between mt-3">
                      <ul class="flex flex-wrap -m-1">
                         
                      </ul>
                      <div class="text-sm pt-1">{{ formatDate(new Date(item.published_at), "DD/MM/YYYY HH:mm") }}</div>
                  
                  </div>
              </div>
          </article> -->
      </div>
      <div v-else>
          Hiện tại chưa có bài viết !
      </div>
    </div>
  </template>
  
  <script setup>
      import { formatDate } from '@vueuse/core'
  
      const props = defineProps({
          articles: Array,
          default: () => {
              return []
          }
      })
      
  </script>
  