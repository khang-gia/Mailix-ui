<template>
  <div class="bg-white h-64 flex justify-between items-center px-5">
    <div class="flex space-x-5 items-start">
      <div>
        <img class="h-24 rounded-full" src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1688552673~exp=1688553273~hmac=6f8eba38d2946ce95805135f07f072ab95b7768f2b6fccb5d6d9e7bdbaac222a" />
      </div>
      <div class="text-slate-500 font-medium text-lg pt-2">
        <p class="text-3xl mb-1 text-slate-700">Huy Do</p>
        <p> 
          <Icon name="ic:outline-mail" size="20" />
          thehuyvd@gmail.com
        </p>
        <p>
          <Icon name="ic:outline-message" size="20" />
          Chat count: 0/10
        </p>
        <p>
          <Icon name="humbleicons:ban" size="20" />
          Expire date: 10-07-2023
        </p>
      </div>
    </div>
    <div>
      <NuxtLink to="/chat" class="flex space-x-2 py-2 px-5 font-medium border-2 border-primary-500 text-primary-500 rounded hover:bg-primary-500 hover:text-white">
        <div>
          <Icon name="ic:outline-message" size="24" />
        </div>
        <p>Chat Now</p>
      </NuxtLink>
    </div>
  </div>
</template>