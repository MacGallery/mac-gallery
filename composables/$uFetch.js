import { defu } from 'defu'

export const $uFetch = (url, options) => {
  const defaultOpts = {
    baseURL: 'http://be-laptop.test/api',
    headers: {
      Accept: 'application/json'
    },
    onResponseError(_ctx) {
      console.log(`ERROR: ${_ctx.response}`)
    },
    onResponse(_ctx) {
      const data = _ctx.response._data
      if (data.status.code != 200) {
        showError({
          statusCode: data.status.code,
          message: data.status.message,
        });
      }
    }
  }

  const params = defu(options, defaultOpts);
  return $fetch(url, params);
}
// import type { UseFetchOptions } from 'nuxt/app'
// import { defu } from 'defu'

// export function $uFetch<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
//   const userAuth = useCookie('token')
//   const config = useRuntimeConfig()

//   const defaults: UseFetchOptions<T> = {
//     baseURL: (config.baseUrl ?? 'http://be-laptop.test/api') as string,
//     // this overrides the default key generation, which includes a hash of
//     // url, method, headers, etc. - this should be used with care as the key
//     // is how Nuxt decides how responses should be deduplicated between
//     // client and server
//     key: url as string,

//     headers: {
//       Accept: 'application/json',
//     },
//     // onResponse(_ctx) {
//     //   // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
//     // },

//     onResponseError(_ctx) {
//       // throw new myBusinessError()
//     },
//     server: false,
//   }

//   // for nice deep defaults, please use unjs/defu
//   const params = defu(options, defaults)
//   const { data, pending, error } = useFetch(() => url as string, params)
//   console.log(data.value)
//   return { response: data.value }
// }
