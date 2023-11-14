export const useSettingStore = defineStore('setting-store', () => {
    const settings = ref({})
    const loaded = ref(false);

    const updateSettings = async function () {
        const response = await $uFetch('settings/general')
        settings.value = response.data;
        loaded.value = true;
    }  

    watch(settings, function () {
        if (process.client) {
            useHead({
                title: settings.value.site_name,
                meta: [
                    {
                        name: 'description',
                        content: settings.value.site_description
                    }
                ]
            })
        }
    })

    return {
        settings,
        loaded,
        updateSettings
    }
})