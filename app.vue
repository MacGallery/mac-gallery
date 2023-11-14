<template>
    <div>
        <NuxtLoadingIndicator :duration="10000" :throttle="0" />
        <NuxtLayout :name="$route.meta.layout" v-if="settingStore.loaded" :key="$route.name">
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script>
export default {
    setup() {
        const settingStore = useSettingStore();
        return {
            settingStore
        }
    }
}
</script>