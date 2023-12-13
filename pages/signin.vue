<template>
  <div class="flex h-[100dvh] w-screen items-center justify-center bg-[url('~/assets/shapes.svg')] p-4">
    <div class="flex flex-col items-center rounded-2xl border-2 border-gray-700 bg-gray-800 px-4 py-12 md:px-8 md:py-16">
      <logo class="mb-4" />
      <h1 class="mb-2 text-center text-3xl font-bold text-gray-50">
        Witamy!
      </h1>
      <p class="mb-6 text-center text-gray-100 [text-wrap:balance]">
        Zaloguj się za pomocą swojego maila uczelnianego.
      </p>
      <form>
        <div class="mb-8 space-y-5">
          <base-input type="email" placeholder="pXXXXXX@sggw.edu.pl" label="Adres e-mail" autocomplete="false" />
          <base-input type="password" placeholder="********" label="Hasło" autocomplete="false" caption="Zapomniałeś hasła?" />
        </div>
        <button class="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-gray-50 transition-colors duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 active:ring-2 active:ring-blue-600">
          Zaloguj się
        </button>
        <small class="text-left text-gray-100">
          Nie masz jeszcze konta? <a class="text-blue-400" href="#">Zarejestruj się!</a>
        </small>
      </form>
    </div>
  </div>
</template>
