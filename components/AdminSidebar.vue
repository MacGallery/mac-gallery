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
}
</script>

<template>
    <el-aside class="!w-auto absolute left-0 top-0 md:static z-[100]">
        <ClientOnly>
            <OnClickOutside @trigger="isSmaller('md') && !isCollapsed ? isCollapsed = true : null">
                <el-menu :default-active="`/${$route.fullPath.split('/').filter(String).slice(0, 2).join('/')}`" style="--el-menu-hover-bg-color: var(--el-color-primary-light-9); height: 100vh;
                        --el-menu-bg-color: var(--el-bg-color);" :collapse="isCollapsed" router>
                    <el-menu-item class="gap-4" index="/admin" route="/admin">
                        <Icon name="NuxtIcon" size="24" class="shrink-0"></Icon>
                        <span class="text-lg font-bold">MacGallery</span>
                    </el-menu-item>
                    <el-menu-item index="/admin" route="/admin" class="gap-4">
                        <Icon name="mdi:data" size="24" class="shrink-0"></Icon>
                        <span>Dashboard</span>
                    </el-menu-item>
                    <el-sub-menu index="/admin/products">
                        <template #title>
                            <Icon name="mdi:alpha-p-box" size="24" class="shrink-0"></Icon>
                            <span class="ms-4">Products</span>
                        </template>
                        <el-menu-item index="/admin/products">
                            <span>Product List</span>
                        </el-menu-item>
                        <el-menu-item index="/admin/product-categories">
                            <span>Product Categories</span>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </OnClickOutside>
        </ClientOnly>
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