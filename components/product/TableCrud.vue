<template>
    <div>
        <u-table selectable url-path="/products" ref="productTable" default-sort="created_at" default-direction="desc">
            <template #columns>
                <el-table-column label="Product" prop="name" sortable="custom">
                    <template #default="scope">
                        <div class="flex items-center gap-3">
                            <div
                                class="rounded-full overflow-hidden max-w-[32px] max-h-[32px] w-full h-full shadow-xl flex justify-center items-center">
                                <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" preview-teleported>
                                    <template #error>
                                        <div class="image-slot">
                                            <Icon name="ic:outline-image-not-supported" />
                                        </div>
                                    </template>
                                </el-image>
                            </div>
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="Category" prop="category.name" column-key="product_category_id"
                    :filter-multiple="false" :filters="productCategories" />
                <el-table-column label="Visible" prop="visible" column-key="visible">
                    <template #default="scope">
                        <Icon name="line-md:confirm-circle" v-if="scope.row.visible" size="24"
                            style="color: var(--el-color-success);" />
                        <Icon name="line-md:close-circle" size="24" v-else style="color: var(--el-color-danger);" />
                    </template>
                </el-table-column>
                <el-table-column label="Created at" prop="created_at" sortable :formatter="dateFormatter"></el-table-column>

                <el-table-column align="right">
                    <template #default="scope">
                        <el-dropdown trigger="click">
                            <span class="el-dropdown-link">
                                <Icon name="fe:elipsis-v" size="24" />
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="onToggleVisible(scope.row)">Toggle Visible</el-dropdown-item>
                                    <el-dropdown-item @click="onDelete(scope.row)">Delete</el-dropdown-item>
                                    <el-dropdown-item @click="onEdit(scope.row)">Edit</el-dropdown-item>
                                    <el-dropdown-item @click="onView(scope.row)">View</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </template>

            <template #bulkActions>
                <el-dropdown-item @click="bulkDelete">Bulk Delete</el-dropdown-item>
                <el-dropdown-item @click="bulkUpdate(true)">Show Products</el-dropdown-item>
                <el-dropdown-item @click="bulkUpdate(false)">Hide Products</el-dropdown-item>
            </template>
        </u-table>

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
                        <el-upload ref="image" v-model:file-list="formData.image" :auto-upload="false"
                            list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                            :limit="1" :on-exceed="handleExceed">
                            <Icon name="line-md:plus" size="24" />
                        </el-upload>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogShow = false">Cancel</el-button>
                        <el-button :loading="isOnDialogAction" type="primary"
                            @click="mode == 'edit' ? onUpdate() : onStore()">
                            {{ mode == 'edit' ? 'Update' : 'Submit' }}
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </Teleport>
    </div>
</template>

<script >
import { genFileId } from 'element-plus'

export default {
    data() {
        return {
            productCategories: [],
            mode: null,
            dialogShow: false,
            isOnDialogAction: false,

            dialogImageUrl: '',

            formData: {
                name: null,
                product_category_id: null,
                description: null,
                visible: true,
                image: null,
            },
            currentRecordId: null,
        }
    },
    mounted() {
        this.fetchCategory()
    },
    setup() {
        const productTable = ref()
        const formRef = ref()
        const image = ref()
        return {
            productTable,
            formRef,
            image
        }
    },
    methods: {
        fetchCategory() {
            $uFetch('/product-categories')
                .then((response) => {
                    this.productCategories = response.data.map(({ id, name }) => { return { text: name, value: id } })
                })
        },
        onToggleVisible(record) {
            console.log({ ...record, visible: !record.visible })
            $uFetch(`/products/${record.id}`, { method: 'PUT', body: { ...record, visible: !record.visible } })
                .then((response) => {
                    ElNotification.success({
                        title: 'Success',
                        message: response.status.message
                    })
                    this.productTable.fetchRecords()
                })

        },
        onDelete(record) {
            ElMessageBox.confirm('Are you sure want to delete this record?', 'Delete Product')
                .then((response) => {
                    if (response == 'confirm') {
                        $uFetch(`/products/${record.id}`, { method: 'DELETE' })
                            .then((response) => {
                                ElNotification.success({
                                    title: 'Success',
                                    message: response.status.message
                                })
                                this.productTable.fetchRecords()
                            })
                    }
                });
        },
        onEdit(record) {
            this.clearFormData()

            this.formData.name = record.name
            this.formData.product_category_id = record.category.id
            this.formData.description = record.description
            this.formData.visible = record.visible

            this.currentRecordId = record.id

            this.mode = 'edit'
            this.dialogShow = true;
        },
        onUpdate() {
            this.isOnDialogAction = true;

            $uFetch(`/products/${this.currentRecordId}`, { body: this.formData, method: 'PUT' })
                .then((response) => {
                    ElNotification.success({
                        title: 'Success',
                        message: response.status.message
                    })
                    this.productTable.fetchRecords()
                    this.isOnDialogAction = false;
                    this.dialogShow = false;
                    this.formRef.resetFields()
                })
        },
        onCreate() {
            this.clearFormData()
            this.mode = 'create';
            this.dialogShow = true;
        },
        onStore() {
            this.isOnDialogAction = true;

            $uFetch(`/products`, { body: this.getFormData(), method: 'POST' })
                .then((response) => {
                    ElNotification.success({
                        title: 'Success',
                        message: response.status.message
                    })
                    this.productTable.fetchRecords()
                    this.isOnDialogAction = false;
                    this.dialogShow = false;
                    this.formRef.resetFields()
                })
        },
        bulkDelete() {
            const selectedData = this.productTable.getSelectedIds();
            ElMessageBox.confirm(`Are you sure want do delete ${selectedData.length} products permanently?`, 'Bulk Delete')
                .then(response => {
                    if (response == 'confirm') {
                        $uFetch(`/products/bulk-delete`, { method: 'DELETE', body: { ids: selectedData } })
                            .then((response) => {
                                ElNotification.success({
                                    title: 'Success',
                                    message: response.status.message
                                })
                                this.productTable.fetchRecords()
                                this.productTable.table.selectedData = [];
                            })
                    }
                }).catch()
        },
        bulkUpdate(visible) {
            const selectedData = this.productTable.getSelectedIds();
            ElMessageBox.confirm(`Are you sure want to update this ${selectedData.length} products?`, 'Bulk Update')
                .then(response => {
                    if (response == 'confirm') {
                        $uFetch(`/products/bulk-update`, { method: 'PUT', body: { ids: selectedData, data: { visible } } })
                            .then((response) => {
                                ElNotification.success({
                                    title: 'Success',
                                    message: response.status.message
                                })
                                this.productTable.fetchRecords()
                                this.productTable.table.selectedData = [];
                            })
                    }
                }).catch()
        },
        getFormData() {
            const formData = new FormData()

            for (let i in this.formData) {
                if (Array.isArray(this.formData[i]) && this.formData[i].length) {
                    for (let j of this.formData[i]) {
                        formData.append(`${i}`, j.raw);
                    }
                } else if (typeof (this.formData[i]) == 'boolean') {
                    formData.append(i, this.formData[i] == true ? "1" : "0");
                } else {
                    formData.append(i, this.formData[i]);
                }
            }
            return formData
        },
        clearFormData() {
            this.formData = {};
            this.formData.visible = true;
        },
        dateFormatter(row, column) {
            return row.created_at;
        },
        handleRemove(uploadFile, uploadFiles) {
            console.log(uploadFile, uploadFiles)
        },
        handlePictureCardPreview(uploadFile) {
            this.dialogImageUrl = uploadFile.url
            this.dialogShow = true
        },
        handleExceed(files) {
            this.image.clearFiles()
            const file = files[0]
            file.uid = genFileId()
            // this.formData.image = file;
            this.image.handleStart(file)
        },
        onView(record) {
            this.$router.push(`/admin/products/${record.id}`)
        }
    },
}
</script>

<style>
.btn-prev {
    @apply ms-auto
}
</style>