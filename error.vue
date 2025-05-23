<template>
    <NuxtLayout>
      <div class="flex flex-col items-center justify-center pt-16 text-center dark:text-indigo-600">
        <template v-if="error.statusCode === 404">
          <span class="pb-4">
            <img src="/images/404-illustration-dark.svg" alt="Error 404" width="186" height="186" />
          </span>
          <h1 class="text-lg text-gray-300"> 
            Trang này có thể không tồn tại, vui lòng thử lại hoặc liên hệ với TITACA!
          </h1>
        </template>
        <template v-else-if="error.statusCode === 500">
          <span class="pb-4">
            <img src="/images/404-illustration-dark.svg" alt="Error 500" width="186" height="186" />
          </span>
          <h1 class="text-lg text-gray-300">Đã có lỗi xảy, yêu cầu của bạn không thể thực hiện thành công.</h1>
          <h1 class="text-lg text-gray-300">Hãy thử lại lần nữa, nếu lỗi vẫn xuất hiện vui lòng<UButton variant="link" @click.stop="handleError">gửi thông báo lỗi</UButton> cho TITTACA nhé!</h1>
        </template>
        <template v-else>
          <h1 class="text-4xl text-gray-700 dark:text-indigo-600 pb-4">Lỗi không xác định</h1>
          <h1 class="text-lg text-gray-300">Đã có lỗi xảy, yêu cầu của bạn không thể thực hiện thành công.</h1>
          <h1 class="text-lg text-gray-300">Hãy thử lại lần nữa, nếu lỗi vẫn xuất hiện hãy liên hệ với TITACA nhé!</h1>
        </template>
        <p class="mt-8 space-x-2">
          <UButton to="/me" color="primary" variant="outline">Trở lại trang chủ</UButton>
          <UButton to="https://t.me/+pU3YBdP7MRhlMDI1" target="_blank" color="blue" variant="outline">Nhóm Telegram</UButton>
        </p>
      </div>
    </NuxtLayout>
    <NuxtSnackbar />
</template>
  
<script setup>

  const snackbar = useMySnackBar()
  const error = useError()
  let isSent = false

  async function handleError() {
    if (isSent) {
      snackbar.error('Yêu cầu của bạn đã được gửi trước đó.')
      return
    }
      try{
        const res = await sendError({
          error_message: error.value.message,
          error_detail: error.value.stack,
          error_url: error.value.url,
        })
        snackbar.success('Cảm ơn bạn đã gửi báo cáo lỗi!','Gửi thành công')
        isSent = true
      }
      catch(err){
        snackbar.error('Có lỗi xảy ra, vui lòng thử lại sau!','Gửi thất bại')
      }
  }

  const sendError = async (message) => {
    const { data, error:err} = await useAPI().post(
      '/core/report_error/',
      message
    )
    if (err.value) {
      throw err.value
    }
    return data
  }

</script>