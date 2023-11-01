import {defu} from 'defu'

export const $uFetch = (url, options) => {
    const defaultOpts = {
        baseURL: 'http://be-laptop.test/api',
        headers: {
            Accept: 'application/json'
        },
        onResponseError(_ctx) {
            console.log(_ctx)
        }
    }

    const params = defu(options, defaultOpts);

    return $fetch(url, params);
}
