<template>
    <el-card>
        <template #header>
            <div class="flex items-center">
                <span>Settings</span>
                <!-- <el-button class="button" text>Operation button</el-button> -->
            </div>
        </template>
        <el-upload v-model:file-list="fileList" list-type="picture-card" :auto-upload="false"
            :on-preview="imagesHandleOnPreview">
            <el-button text>
                <Icon name="fe:plus" size="24" />
            </el-button>
        </el-upload>
        <el-divider />
        <div class="flex items-center justify-end">
            <el-button type="primary">Save</el-button>
        </div>
    </el-card>
    <Teleport to="body">
        <el-dialog v-model="imagePreviewShow">
            <img w-full :src="imagePreviewUrl" alt="Preview Image" />
        </el-dialog>
    </Teleport>
</template>

<script>
export default {
    data() {
        return {
            fileList: [],
            imagePreviewShow: false,
            imagePreviewUrl: null,
        }
    },
    setup() {

    },
    methods: {
        imagesHandleOnPreview(uploadFile) {
            this.form.imagePreviewUrl = uploadFile.url
            this.form.imagePreviewShow = true
        },
    }
}
</script>