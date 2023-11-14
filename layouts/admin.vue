<template>
    <el-container direction="horizontal" class="relative">
        <admin-sidebar></admin-sidebar>
        <el-scrollbar style="height: 100vh; z-index: 10;" class="grow">
            <el-container direction="vertical" class="relative">
                <admin-header></admin-header>
                <el-main>
                    <slot />
                </el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-scrollbar>
    </el-container>
</template>