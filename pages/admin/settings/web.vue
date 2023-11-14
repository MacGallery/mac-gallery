<template>
    <el-card>
        <template #header>
            <div class="flex items-center">
                <span>Web Settings</span>
                <!-- <el-button class="button" text>Operation button</el-button> -->
            </div>
        </template>
        <el-form label-position="top" :model="formData">
            <el-form-item label="Site Name">
                <el-input placeholder="Site Name" v-model="formData.site_name"></el-input>
            </el-form-item>
            <el-form-item label="Site Description">
                <el-input placeholder="Site Description" type="textarea" rows="3"
                    v-model="formData.site_description"></el-input>
            </el-form-item>
            <el-form-item label="Dark Mode">
                <el-switch v-model="formData.site_enable_dark_mode" class="ml-2" inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="Y"
                    inactive-text="N" />
            </el-form-item>
            <el-form-item label="Reviews">
                <el-switch v-model="formData.site_enable_reviews" class="ml-2" inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="Y"
                    inactive-text="N" />
            </el-form-item>
            <el-form-item label="Banners">
                <el-upload v-model:file-list="formData.site_banners" list-type="picture-card" :auto-upload="false"
                    :on-preview="imagesHandleOnPreview">
                    <el-button text>
                        <Icon name="fe:plus" size="24" />
                    </el-button>
                    <Teleport to="body">
                        <el-dialog v-model="imagePreviewShow">
                            <img w-full :src="imagePreviewUrl" alt="Preview Image" />
                        </el-dialog>
                    </Teleport>
                </el-upload>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item>
                <el-button class="ms-auto" type="primary" @click="onSave">Save</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    data() {
        const settingStore = useSettingStore()

        const formData = settingStore.settings
        return {
            fileList: [],
            imagePreviewShow: false,
            imagePreviewUrl: null,
            formData
        }
    },
    setup() {
        const settingStore = useSettingStore()
        return {
            settingStore
        }
    },
    methods: {
        imagesHandleOnPreview(uploadFile) {
            this.imagePreviewUrl = uploadFile.url
            this.imagePreviewShow = true
        },
        onSave() {
            $uFetch('/settings/general', { method: 'POST', body: this.getFormData() })
                .then(response => {
                    console.log(response)
                    ElNotification.success({
                        message: response.status.message,
                        title: 'Success',
                    })
                    this.settingStore.settings = response.data
                    this.formData = response.data
                })
        },
        getFormData(method = null) {
            let formData = new FormData();

            for (let i of Object.keys(this.formData)) {
                if (i.startsWith('site_enable')) {
                    formData.append(i, this.formData[i] ? "1" : "0")
                } else if (i == 'site_banners') {
                    for (let image of this.formData[i]) {
                        if (image.raw) {
                            formData.append(`${i}[upload][]`, image.raw);
                        } else {
                            formData.append(`${i}[update][]`, JSON.stringify(image));
                        }
                    }
                } else {
                    formData.append(i, this.formData[i])
                }
            }
            formData.append('_method', 'PUT');

            // for (let i of this.formData) {
            //     if (typeof (this.formData[i.formItem.prop]) == 'boolean') {
            //         formData.append(i.formItem.prop, this.formData[i.formItem.prop] ? "1" : "0")
            //     } else if (this.formData[i.formItem.prop]?.raw instanceof File) {
            //         formData.append(i.formItem.prop, this.formData[i.formItem.prop].raw)
            //     } else if ((i.input.type == 'image' && typeof (this.formData[i.formItem.prop]) == 'string') || !this.formData[i.formItem.prop]) {
            //         continue;
            //     } else 
            //     console.log(typeof (this.formData[i.formItem.prop]) instanceof File)
            // }
            // if (method == 'POST') {
            //     for (let prop in this.additionalFormData) {
            //         formData.append(prop, this.additionalFormData[prop]);
            //     }
            // }
            // if (method) {
            //     formData.append('_method', method);
            // }
            return formData;
        }
    }
}
</script>