<template>
    <el-header style="--el-header-padding: 0;  border-bottom: solid 1px var(--el-menu-border-color); position: sticky; top: 0;
        background: var(--el-bg-color);
        z-index: 100;">
        <container>
            <el-menu :default-active="$route.fullPath" style="--el-menu-hover-bg-color: var(--el-color-primary-light-9)"
                mode="horizontal" :ellipsis="false" router>
                <el-menu-item index="/" style="--el-menu-active-color: none; --el-menu-hover-bg-color: none;">
                    <!-- <img style="width: 100px" src="/images/element-plus-logo.svg" alt="Element logo" /> -->
                    MacGallery
                </el-menu-item>
                <!-- <div class="flex-grow" /> -->
                <li class="grow"></li>
                <el-menu-item index="/products">Products</el-menu-item>
                <el-menu-item index="/about-us">About Us</el-menu-item>
                <el-menu-item index="/contacts">Contacts</el-menu-item>
                <li v-if="settingStore.settings.site_enable_dark_mode">
                    <dark-mode-toggler />
                </li>
            </el-menu>
        </container>
    </el-header>
</template>

<script>
export default {
    setup() {
        const settingStore = useSettingStore()
        return {
            settingStore
        }
    }
}
</script>