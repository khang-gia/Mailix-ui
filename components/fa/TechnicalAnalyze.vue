<template>
  <div class="px-2">
    <div class="flex justify-start space-x-2 mb-2">
      <UButton
        :color="maEnabled ? 'primary' : 'emerald'"
        size="2xs"
        :variant="maEnabled ? 'outline' : 'link'"
        @click="toggleEMA"
        >
        <Icon name="mdi:chart-line-variant" />
        3MA
      </UButton>
      <UButton
        :color="evaEnabled ? 'primary' : 'emerald'"
        size="2xs"
        :variant="evaEnabled ? 'outline' : 'link'"
        @click="toggleEVA"
        >
        <Icon name="mdi:chart-line-variant" />
        Định giá
      </UButton
      >
      <UButton
        :color="rsEnabled ? 'primary' : 'emerald'"
        size="2xs"
        :variant="rsEnabled ? 'outline' : 'link'"
        @click="toggleRS"
        >
        <Icon name="mdi:chart-line-variant" />
        SMG
      </UButton
      >
    </div>
    <div class="chartFit">
      <ChartTradingView ref="TradingViewChart" :symbol="props.symbol" :showEVA="evaEnabled" :showRS="rsEnabled" :show3MA="maEnabled" />
    </div>
  </div>
</template>
<style scoped>
.chartFit {
  height: calc(100vh - 200px);
}
</style>
<script setup>
const props = defineProps(["symbol"]);
const TradingViewChart = ref(null);

const rsEnabled = ref(true)
const evaEnabled = ref(true)
const maEnabled = ref(true)

const toggleEMA = () => {
  const res = TradingViewChart.value?.toggleEMA();
  maEnabled.value = res
}
const toggleEVA = () => {
  const res = TradingViewChart.value?.toggleEVA();
  evaEnabled.value = res
}
const toggleRS = () => {
  const res = TradingViewChart.value?.toggleRS();
  rsEnabled.value = res
}
</script>
