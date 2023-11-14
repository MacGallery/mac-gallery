<script>
export default {
    setup() {
        const { isCollapsed, toggle } = useSidebar();
        const settingStore = useSettingStore()
        return {
            isCollapsed,
            toggle,
            settingStore
        }
    }
}
</script>

<template>
    <el-header class="flex items-center justify-between sticky top-0 z-50">
        <ClientOnly>
            <el-button link @click="toggle()">
                <Icon name="line-md:close-to-menu-transition" size="24" v-if="isCollapsed" />
                <Icon name="line-md:menu-to-close-transition" size="24" v-else />
            </el-button>
        </ClientOnly>
        <dark-mode-toggler v-if="settingStore.settings.site_enable_dark_mode"></dark-mode-toggler>
    </el-header>
</template>