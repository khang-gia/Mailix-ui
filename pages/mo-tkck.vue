<template>
    <div class="p-2 space-y-2 w-full">
        <BaseCard title="Mở tài khoản chứng khoán" widthClass="w-full min-h-[200px] relative" bodyClass="p-2">
            <p>Đội ngũ SIEUCOPHIEU.VN rất tâm huyết khi xây dựng và chia sẻ công cụ này với mong muốn giúp nhà đầu tư dễ dàng phân tích, 
                ra quyết định đầu tư bằng lý tính và số liệu. Nếu thấy công cụ này hữu ích, hãy ủng hộ team bằng cách mở tài khoản chứng khoán hoặc chuyển ID về team SCP nhé!</p>
            <p class="mt-2 pl-2">Quyền lợi khi mở tài khoản giao dịch cùng SIEUCOPHIEU:</p>
            <ul class="ml-2">
                <li>
                    <Icon name="heroicons:check-badge" class="text-green-500"></Icon>
                    Room hỗ trợ & chia sẻ chuyên biệt.
                </li>
                <li>
                    <Icon name="heroicons:check-badge" class="text-green-500"></Icon>
                    Ưu tiên sử dụng các tính năng độc quyền đang phát triển trên SIEUCOPHIEU.VN.</li>
                <li>
                    <Icon name="heroicons:check-badge" class="text-green-500"></Icon>
                    Được miễn phí tham gia các buổi chia kiến thức đầu tư từ admin SIEUCOPHIEU.</li>
                <li>
                    <Icon name="heroicons:check-badge" class="text-green-500"></Icon>
                    Miễn phí Khoá học đọc hiểu BCTC - PTKT ứng dụng.</li>
            </ul>
         
            <UButton
                to="tel:0935350356"
                class="ml-2 mt-2"
                icon="i-heroicons-phone"
                size="sm"
                color="primary"
                variant="outline"
                label="SĐT Hỗ trợ: 093 535 0356"
            ></UButton>
           
            <div class="mt-4">
                <UTabs :items="tabs" orientation="vertical" :ui="{ 
                    wrapper: 'flex items-start gap-4', 
                    list: { 
                        width: 'w-64',
                        tab: {
                            base: 'items-start justify-start', 
                            height: 'h-auto', 
                            padding: 'p-3'
                        },
                    }
                }">
                    <template #default="{ item, index, selected }">
                        <div v-if="item.recommend" class="flex flex-row grayscale hover:grayscale-0" :class="{'grayscale-0': selected}">
                            <UChip text="Đề xuất" size="2xl">
                                <UAvatar :src="`/images/ctck/${item.key}.png`" class="bg-white" />
                                <span class="truncate ml-2 leading-7">{{ item.label }}</span>
                            </UChip>
                        </div>
                        <div v-else class="flex flex-row grayscale hover:grayscale-0" :class="{'grayscale-0': selected}">
                            <UAvatar :src="`/images/ctck/${item.key}.png`" class="bg-white" />
                            <span class="truncate ml-2 leading-7">{{ item.label }}</span>
                        </div>
                    </template>
                    <template #item="{ item }">
                        <div v-if="item.link" class="ml-4 flex-none md:flex">
                            <div class="flex-none w-64 mx-auto">
                                <img :src="`/images/ctck/${item.key}-qrcode.png`" class="w-64">
                            </div>
                            
                            <div class="flex-1 px-2 mt-3 md:mt-0">
                                <div class="pl-2">
                                    <div v-if="item.intro" v-html="item.intro"></div>
                                    <div v-else>
                                        Quét QR bên cạnh bằng điện thoại để đăng ký hoặc nhấp vào link bên dưới
                                    </div>
                                </div>

                                
                                <div v-if="item.code" class="flex flex-row mt-2">
                                    <div class="w-32 mx-2 mt-3">ID</div>
                                    <div class="flex-1 flex flex-row">
                                        <span class="text-blue-500 hover:text-blue-400 border border-slate-500 px-2 pt-1 rounded">
                                            <span>{{ item.code }}</span>
                                            <a href="#" class="ml-2" v-if="isSupported" @click.stop="copyToClipboard(item.code)">
                                                <Icon name="heroicons:document-duplicate" size="16"></Icon>
                                            </a>
                                        </span>
                                    </div>
                                </div>
                                <div class="flex flex-row mt-2">
                                    <div class="w-32 mx-2 mt-3">Link đăng ký</div>
                                    <div class="flex-1 flex flex-row">
                                        <a :href="item.link" target="_blank" class="text-blue-500 hover:text-blue-400 border border-slate-500 px-2 pt-1 rounded">{{ item.link }}</a>
                                    </div>
                                </div>
                                <div v-if="item.more" class="flex flex-row mt-4 ml-2">
                                    <UAlert
                                        icon="i-heroicons-light-bulb"
                                        color="teal"
                                        :description="item.more"
                                        title="Bạn có biết?"
                                    />
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center">
                            Vui lòng liên hệ SĐT 
                            <UButton
                                to="tel:0935350356"
                                class="ml-2 mt-2"
                                icon="i-heroicons-phone"
                                size="sm"
                                color="primary"
                                variant="outline"
                                label="093 535 0356"
                            ></UButton> để được hỗ trợ
                        </div>
                    </template>
                </UTabs>
            </div>
        </BaseCard>
        
    </div>
  
      
  </template>
  <script setup>
    import { useClipboard } from '@vueuse/core'
    const snackbar = useMySnackBar()
    const toast = useToast()
    definePageMeta({
        title: 'Mở tài khoản chứng khoán'
    })
  
    useSeoMeta({
        title: `Mở tài khoán chứng khoán trực tuyến`,
        ogTitle: `Mở tài khoán chứng khoán trực tuyến`,
        description: `Nếu thấy SIEUCOPHIEU.VN hữu hãy ủng hộ team bằng cách mở tài khoản chứng khoán hoặc chuyển ID về team nhé.`,
        ogDescription: `Nếu thấy SIEUCOPHIEU.VN hữu hãy ủng hộ team bằng cách mở tài khoản chứng khoán hoặc chuyển ID về team nhé.`,
    })
      
    const tabs = ref([{
        id: 0,
        label: 'Chứng khoán LPBank',
        key: 'lpbs',
        code: '168888',
        link: 'https://taikhoan.lpbs.com.vn/?traderId=168888', 
        // intro: 'Quét QR code để tải ứng dụng LPTrade+. Nhập ID nhân viên tư vấn <b class="text-purple-500">168888</b>',
        more: 'LPBS là công ty chứng khoán thuộc LPBank - là nơi đội ngũ SCP đang làm việc và xây dựng. LPBS có nhiều chính sách ưu việt, lãi suất thấp và hỗ trợ tốt cho nhà đầu tư cá nhân.',
        recommend: true
    }, {
        id: 1,
        label: 'Chứng khoán TechCom',
        key: 'tcbs',
        code: '105CTHEHUY',
        link: 'https://iwp.tcbs.com.vn/105CTHEHUY',
        more: 'Tài khoản TCBS có thể mở ONLINE hoàn toàn mà không cần ký hợp đồng cứng. TCBS đi đầu trong xu hướng zero fee.'
    }, {
        id: 2,
        label: 'Chứng khoán VPS',
        key: 'vps',
        code: 'BL9N',
        link: 'https://openaccount.vps.com.vn/open-account?MKTID=BL9N',
        more: 'Tài khoản VPS có thể mở ONLINE hoàn toàn mà không cần ký hợp đồng cứng. App giao dịch của VPS tách biệt giữa cơ sở và phái sinh nên tiện thao tác.'
    }, {
        id: 3,
        label: 'Chứng khoán SSI',
        key: 'ssi',
        code: 'I680020114',
        link: 'https://ssi.com.vn/khach-hang-ca-nhan/mo-tai-khoan?mgm=I680020114'
    }, {
        id: 4,
        label: 'Chứng khoán VPBank',
        key: 'vpbs',
        code: '116C071287',
        link: 'https://vpbanks.onelink.me/XNEk/mbhxfxi5'
    }, {
        id: 5,
        label: 'Chứng khoán DNSE',
        key: 'dnse',
        code: 'SIEUCP',
        link: 'https://s.dnse.vn/yqxeho',
        more: 'Tài khoản DNSE có thể mở và giao dịch trong vài phút, tiên phong ứng dụng công nghệ giúp đơn giản hóa quá trình đầu tư.'
    }, /*{
        id: 5,
        label: 'Chứng khoán SBB',
        key: 'sbbs',
        code: '',
        link: ''
    }*/])
    const selected=ref(0)

    const { text, copy, copied, isSupported } = useClipboard()
    
    const copyToClipboard = (text) => {
        copy(text)
        // snackbar.success('Đã sao chép')
        toast.add({ 
            title: 'Đã sao chép vào clipboard',
            icon: 'i-heroicons-document-duplicate',
            timeout: 2000
        })
    }
  </script>