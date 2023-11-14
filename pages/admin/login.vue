<script>
export default defineNuxtComponent({
    data() {
        return {
            checked: false
        };
    },
    setup(props) {
        definePageMeta({
            layout: 'empty'
        })
    }
})
</script>

<template>
    <div class="h-screen flex items-center  ">
        <el-card shadow="never" class="w-full max-w-md m-auto" :body-style="{ padding: 20 }">
            <div class="m-8 text-center">
                <el-link href="https://element-plus.org/en-US/" :underline="false" class="m-0">
                    <img src="https://element-plus.org/images/element-plus-logo.svg" class="block" alt="Element Plus"
                        width="120" height="28" />
                </el-link>
                <el-text tag="h2" class="my-3">Log in</el-text>
                <el-text tag="p" class="text-[#868e96]">
                    Don't have an account?
                    <el-link type="primary">Sign up</el-link>
                </el-text>
            </div>
            <el-form label-position="top">
                <el-form-item label="Email">
                    <el-input size="large" />
                </el-form-item>
                <el-form-item label="Password">
                    <el-input size="large" />
                </el-form-item>
                <div class="flex justify-between mb-2">
                    <el-checkbox v-model="checked" label="Remember me" size="large" />
                    <el-link type="primary">Forgot password?</el-link>
                </div>
                <el-button type="primary" size="large" class="w-full">Sign in</el-button>
            </el-form>
        </el-card>
    </div>
</template>
