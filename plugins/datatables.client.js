import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import 'datatables.net-fixedcolumns-dt';
import 'datatables.net-fixedheader-dt';

export default defineNuxtPlugin(nuxtApp => {
    DataTable.use(DataTablesCore);
    nuxtApp.vueApp.component('DataTable', DataTable)
})