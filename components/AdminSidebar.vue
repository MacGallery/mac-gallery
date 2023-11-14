<script>
import { OnClickOutside } from '@vueuse/components'
import { breakpointsTailwind } from '@vueuse/core'


export default {
    components: { OnClickOutside },
    setup() {
        const { isCollapsed, toggle } = useSidebar()
        const { isSmaller } = useBreakpoints(breakpointsTailwind);

        return {
            isCollapsed,
            toggle,
            isSmaller,
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        }
    },
    created() {
        console.log(this.$route)
    }
}
</script>

<template>
    <el-aside class="!w-auto absolute left-0 top-0 md:static z-[100]">
        <OnClickOutside @trigger="isSmaller('md') && !isCollapsed ? isCollapsed = true : null">
            <!-- <el-menu :default-active="`/${$route.fullPath.split('/').filter(String).slice(0, 2).join('/')}`" style="--el-menu-hover-bg-color: var(--el-color-primary-light-9); height: 100vh;
                    --el-menu-bg-color: var(--el-bg-color);" :collapse="isCollapsed" router popper-effect="dark"
                :ellipsis="false">
                <el-menu-item class="gap-4" index="/admin" route="/admin">
                    <Icon name="NuxtIcon" size="24" class="shrink-0"></Icon>
                    <template #title class="text-lg font-bold">MacGallery</template>
                </el-menu-item>
                <el-menu-item index="/admin" route="/admin" class="gap-4">
                    <Icon name="mdi:data" size="24" class="shrink-0"></Icon>
                    <template #title>Dashboard</template>
                </el-menu-item>
                <el-sub-menu index="/admin/product">
                    <template #title>
                        <Icon name="mdi:alpha-p-box" size="24" class="shrink-0"></Icon>
                        <span class="ms-4">Products</span>
                    </template>
                    <el-menu-item-group>
                        <template #title v-if="isCollapsed">
                            <span>Products</span>
                        </template>
                        <el-menu-item index="/admin/products">
                            <span>Product List</span>
                        </el-menu-item>
                        <el-menu-item index="/admin/product-categories">
                            <span>Product Categories</span>
                        </el-menu-item> </el-menu-item-group>
                </el-sub-menu>
                <el-menu-item class="!cursor-default" disabled>
                    <el-divider></el-divider>
                </el-menu-item>
                <el-menu-item-group v-if="!isCollapsed">
                    <template #title>
                        <span>Settings</span>
                    </template>
                    <el-menu-item index="/admin/settings/web" class="gap-4">
                        <Icon name="mdi:web" size="24" class="shrink-0"></Icon>
                        <span>Web Settings</span>
                    </el-menu-item>
                </el-menu-item-group>
                <el-sub-menu v-if="isCollapsed" index="/admin/settings">
                    <template #title>
                        <Icon name="mdi:cog" size="24" class="shrink-0"></Icon>
                        <span class="ms-4">Settings</span>
                    </template>
                    <el-menu-item-group>
                        <template #title>
                            <span>Settings</span>
                        </template>
                        <el-menu-item index="/admin/settings/web" class="gap-4">
                            <Icon name="mdi:web" size="24" class="shrink-0"></Icon>
                            <span>Web Settings</span>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
            </el-menu> -->
            <el-menu :default-active="`/${$route.fullPath.split('/').filter(String).slice(0, 2).join('/')}`" style="--el-menu-hover-bg-color: var(--el-color-primary-light-9); height: 100vh;
                    --el-menu-bg-color: var(--el-bg-color);" :collapse="isCollapsed" router popper-effect="dark"
                :ellipsis="false">
                <el-menu-item index="/admin" class="gap-4">
                    <Icon name="mdi:data" size="24" class="shrink-0"></Icon>
                    <template #title>Dashboard</template>
                </el-menu-item>
                <el-sub-menu index="/admin/products">
                    <template #title>
                        <Icon name="mdi:alpha-p-box" size="24" class="shrink-0"></Icon>
                        <span class="ms-4">Products</span>
                    </template>
                    <el-menu-item index="/admin/products">Products</el-menu-item>
                    <el-menu-item index="/admin/product-categories">Product Categories</el-menu-item>
                    <!-- <el-menu-item-group>
                        <template #title><span>Group One</span></template>
                        <el-menu-item index="1-1">item one</el-menu-item>
                        <el-menu-item index="1-2">item two</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="Group Two">
                        <el-menu-item index="1-3">item three</el-menu-item>
                    </el-menu-item-group> -->
                </el-sub-menu>
                <el-menu-item class="!cursor-default" disabled>
                    <el-divider></el-divider>
                </el-menu-item>
                <el-sub-menu index="/admin/settings">
                    <template #title>
                        <Icon name="mdi:cog" size="24" class="shrink-0"></Icon>
                        <span class="ms-4">Settings</span>
                    </template>
                    <el-menu-item index="/admin/settings/web">Web Setting</el-menu-item>
                    <!-- <el-menu-item index="/admin/product-categories">Product Categories</el-menu-item> -->
                    <!-- <el-menu-item-group>
                        <template #title><span>Group One</span></template>
                        <el-menu-item index="1-1">item one</el-menu-item>
                        <el-menu-item index="1-2">item two</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="Group Two">
                        <el-menu-item index="1-3">item three</el-menu-item>
                    </el-menu-item-group> -->
                </el-sub-menu>
            </el-menu>
        </OnClickOutside>
    </el-aside>
</template>

<style scoped>
.el-menu {
    @apply [&:not(.el-menu--collapse)]:w-[300px]
}

.el-menu--collapse {
    @apply w-0 md:w-[calc(var(--el-menu-icon-width)+var(--el-menu-base-level-padding)*2)]
}

.el-sub-menu__title {
    @apply flex items-center gap-4
}
</style>