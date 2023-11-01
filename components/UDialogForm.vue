<template>
    <Teleport to="body">
        <el-dialog :title="`${useUpperFirst(mode)} Product`" v-model="dialogShow" align-center destroy-on-close>
            <el-form :model="formData" ref="formRef">
                <el-form-item prop="name" label="Name" :label-width="150">
                    <el-input v-model="formData.name" autocomplete="off" placeholder="Product Name" />
                </el-form-item>
                <el-form-item prop="product_category_id" label="Product Category" :label-width="150">
                    <el-select v-model="formData.product_category_id" class="w-full"
                        placeholder="Please select a product category">
                        <el-option v-for="(category, index) in productCategories" :key="index" :label="category.text"
                            :value="category.value" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="description" label="Descriptions" :label-width="150">
                    <el-input v-model="formData.description" :rows="2" type="textarea" placeholder="Please input" />
                </el-form-item>
                <el-form-item prop="visible" label="Visible" :label-width="150">
                    <el-switch v-model="formData.visible" />
                </el-form-item>
                <el-form-item prop="image" label="Image" :label-width="150">
                    <el-upload ref="image" v-model:file-list="formData.image" :auto-upload="false" list-type="picture-card"
                        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="1"
                        :on-exceed="handleExceed">
                        <Icon name="line-md:plus" size="24" />
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogShow = false">Cancel</el-button>
                    <el-button :loading="isOnDialogAction" type="primary" @click="mode == 'edit' ? onUpdate() : onStore()">
                        {{ mode == 'edit' ? 'Update' : 'Submit' }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </Teleport>
</template>

<script>
    
</script>