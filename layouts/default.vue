<template>
    <el-scrollbar height="100vh" class="overflow-x-hidden">
        <el-container class="min-h-screen" direction="vertical">
            <default-header />
            <el-main style="padding: 0; overflow: hidden;">
                <slot />
            </el-main>
            <default-footer />
        </el-container>
    </el-scrollbar>
</template>