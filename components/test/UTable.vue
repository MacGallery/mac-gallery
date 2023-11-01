<template>
    <div>
        <div class="flex flex-col" v-if="showTable">
            <div class="flex justify-between items-center">
                <div class="">
                    <el-dropdown v-if="table.selectedData.length && selectable && (actions.bulkDelete)">
                        <el-button>
                            Actions
                            <Icon name="fe:arrow-down" class="ms-3" />
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-if="actions.bulkDelete" @click="bulkDelete">Bulk
                                    Delete</el-dropdown-item>

                                <slot name="bulkActions" />
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <el-input v-model="table.params.q" class="max-w-xs m-2" type="search"
                    :placeholder="`Search ${useUpperFirst(title) ?? ''}`">
                    <template #prefix>
                        <Icon name="fe:search" />
                    </template>
                </el-input>
            </div>
            <el-divider></el-divider>
            <el-table :data="table.data" ref="tableRef" @sort-change="sortChange" @filter-change="filterChange"
                @selection-change="selectChange" stripe
                :default-sort="{ prop: defaultSort, order: defaultDirection == 'asc' ? 'ascending' : 'descending' }"
                v-loading="table.loading">
                <el-table-column type="selection" v-if="selectable && (actions.bulkDelete)" />
                <el-table-column v-bind="column" :formatter="column.type == 'datetime' ? dateTimeFormatter : null"
                    v-for="(column, index) in columns" :key="index">
                    <template #default="scope" v-if="$slots[`column-${column.name}`]">
                        <slot :name="`column-${column.name}`" :record="scope.row" />
                    </template>
                </el-table-column>
                <el-table-column align="right" v-if="actions.view || actions.update || actions.delete">
                    <template #default="scope">
                        <el-dropdown trigger="click">
                            <span class="el-dropdown-link">
                                <Icon name="fe:elipsis-v" size="24" />
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-if="actions.update"
                                        @click="onEdit(scope.row)">Edit</el-dropdown-item>
                                    <el-dropdown-item v-if="actions.delete"
                                        @click="onDelete(scope.row)">Delete</el-dropdown-item>
                                    <el-dropdown-item v-if="actions.view" @click="onView(scope.row)">View</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <el-divider></el-divider>
            <el-pagination v-if="paginate" v-model:current-page="table.params.page"
                v-model:page-size="table.params.per_page" :page-sizes="[10, 25, 50, 100]" background
                layout="total, sizes, slot, prev, pager, next" :total="table.paging.total" @current-change="fetchRecords"
                @size-change="fetchRecords">
                <div class="w-full"></div>
            </el-pagination>
        </div>
        <Teleport to="body" v-if="showForm">
            <el-dialog :title="`${useUpperFirst(form.mode)} ${useUpperFirst(title) ?? ''}`" v-model="form.show" align-center
                destroy-on-close>
                <el-form :model="formData" ref="formRef">
                    <el-form-item v-bind="formField.formItem" v-for="(formField, index) in formFields" :key="index">
                        <el-select class="w-full" v-if="formField.input.type == 'select'"
                            v-model="formData[formField.formItem.prop]" v-bind="formField.input">
                            <el-option :label="option.text" :value="option.value"
                                v-for="(option, index) in formField.input.options" :key="index"></el-option>
                        </el-select>
                        <el-switch v-else-if="formField.input.type == 'switch'" v-bind="formField.input"
                            v-model="formData[formField.formItem.prop]"></el-switch>

                        <el-upload v-else-if="formField.input.type == 'image' && !formField.input.multiple"
                            class="overflow-hidden" ref="singleUploadRef" v-bind="formField.input" :show-file-list="false"
                            :auto-upload="false"
                            :on-change="(file, uploadFiles) => handleOnPreview(file, uploadFiles, formField)"
                            :on-exceed="(files, uploadFiles) => handleOnExceed(files, uploadFiles, formField)">
                            <img v-if="formData[formField.formItem.prop]"
                                :src="typeof (formData[formField.formItem.prop]) == 'string' ? formData[formField.formItem.prop] : formData[formField.formItem.prop].url"
                                class="avatar" />
                            <!-- {{ formData[formField.formItem.prop] }} -->
                            <Icon name="line-md:plus" siz e="24" />
                        </el-upload>

                        <el-input v-else v-bind="formField.input" v-model="formData[formField.formItem.prop]" />
                    </el-form-item>
                    <!-- <el-form-item prop="name" label="Name" :label-width="150">
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
                    </el-form-item> -->
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="closeDialog">Cancel</el-button>
                        <el-button :loading="form.loading" type="primary"
                            @click="form.mode == 'edit' ? onUpdate() : onStore()">
                            {{ form.mode == 'edit' ? 'Update' : 'Submit' }}
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </Teleport>
    </div>
</template>

<script>
import { genFileId } from 'element-plus'
import moment from 'moment';

export default {
    props: {
        baseUrl: String,
        showTable: {
            type: Boolean,
            default: () => false,
        },
        selectable: Boolean,
        title: String,
        columns: {
            type: [Object],
            default: () => [],
        },
        defaultSort: String,
        defaultDirection: String,
        paginate: {
            type: Boolean,
            default: () => true
        },
        actions: {
            type: Object,
            default: () => ({
                store: false,
                delete: false,
                bulkDelete: false,
                update: false,
                view: false,
            }),
        },
        actionsUrl: {
            type: Object,
            default: () => ({
                store: null,
                delete: null,
                bulkDelete: null,
                update: null,
                view: null,
                viewUrl: null,
            }),
        },

        showForm: {
            type: Boolean,
            default: () => false
        },
        formFields: {
            type: [Object],
            default: () => [],
        },
        identifier: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            table: {
                data: [],
                loading: false,
                selectedData: [],
                params: {
                    per_page: 10,
                    page: 1,
                    q: null,
                    sort: undefined,
                    direction: undefined,
                },
                paging: {
                    current_page: 1,
                    from: 0,
                    to: 0,
                    per_page: 10,
                    total: 0,
                }
            },
            form: {
                show: false,
                mode: null,
                loading: null,
            }
        }
    },
    setup(props) {
        const formRef = ref()
        const formData = ref({});
        const tableRef = ref();
        const singleUploadRef = ref()
        for (let i of props.formFields) {
            formData.value[i.formItem.prop] = i.input.default ?? null;
        }

        return {
            formRef,
            tableRef,
            formData,
            singleUploadRef
        }
    },
    mounted() {
        this.fetchRecords()
    },
    methods: {
        fetchRecords() {
            if (!this.paginate) {
                this.table.params.per_page = null
                this.table.params.page = null
            }
            this.table.loading = true;
            this.table.params = useDefaults(this.table.params, { sort: this.defaultSort, direction: this.defaultDirection })

            $uFetch(this.baseUrl, { params: this.table.params })
                .then(response => {
                    if (this.paginate) {
                        this.table.data = response.data.data
                        this.table.paging = response.data.meta
                    } else {
                        this.table.data = response.data;
                        this.table.paging = null;
                    }
                    this.table.loading = false;
                })
        },
        onCreate() {
            if (!this.actions.store)
                return;

            this.clearFormData()
            this.form.mode = 'create'

            this.form.show = true;
        },
        onStore() {
            if (!this.actions.store)
                return;
            this.form.loading = true;
            const url = this.getRouteUrl('store')
            $uFetch(url, { method: "POST", body: this.getFormData("POST") }).then((response) => {
                ElNotification.success({
                    title: 'Success',
                    message: response.status.message
                })
                this.fetchRecords()
                this.formRef.resetFields()
                this.form.loading = false;

                this.form.show = false;
            })
        },
        onEdit(record) {
            if (!this.actions.update)
                return;

            this.clearFormData()
            this.form.mode = 'edit'
            this.form.show = true;
            this.formData = { ...record };
        },
        onUpdate() {
            if (!this.actions.update)
                return;

            this.form.loading = true;
            const url = this.getRouteUrl('update', this.formData)

            $uFetch(url, { method: "POST", body: this.getFormData('PUT') }).then((response) => {
                ElNotification.success({
                    title: 'Success',
                    message: response.status.message
                })
                this.fetchRecords()
                this.formRef.resetFields()
                this.form.loading = false;

                this.form.show = false;
            })
        },
        onView(record) {
            this.$router.push(this.actionsUrl.viewUrl ?? `${this.$route.fullPath}/${record.id}`);
        },
        onDelete(record) {
            const url = this.getRouteUrl('delete', record)
            ElMessageBox.confirm('Are you sure want to delete this record?', 'Confirm Delete', { type: 'danger' })
                .then((response) => {
                    if (response == 'confirm') {
                        $uFetch(url, { method: 'DELETE' })
                            .then((response) => {
                                ElNotification.success({
                                    title: 'Success',
                                    message: response.status.message
                                })
                                this.fetchRecords()
                            })
                    }
                }).catch(response => { });
        },
        bulkDelete() {
            const selectedData = this.getSelectedIds();
            const url = this.getRouteUrl('bulkDelete');
            ElMessageBox.confirm(`Are you sure want do delete ${selectedData.length} record(s) permanently?`, 'Bulk Delete')
                .then(response => {
                    if (response == 'confirm') {
                        $uFetch(url, { method: 'DELETE', body: { ids: selectedData } })
                            .then((response) => {
                                ElNotification.success({
                                    title: 'Success',
                                    message: response.status.message
                                })
                                this.fetchRecords()
                                this.table.selectedData = [];
                            })
                    }
                }).catch()
        },

        sortChange(props) {
            const { column, prop, order } = props;
            console.log(props)
            this.table.params.sort = prop;
            this.table.params.direction = order == 'ascending' ? 'asc' : 'desc';
            this.fetchRecords()
        },
        filterChange(filters) {
            if (filters) {
                for (let filter in filters) {
                    if (Array.isArray(filters[filter]) && filters[filter].length) {
                        this.table.params[filter] = filters[filter][0];
                    } else {
                        this.table.params[filter] = filters[filter];
                    }
                }
                this.fetchRecords()
            }
        },
        getRouteUrl(action, record = null) {
            const id = useGet(record, this.identifier);
            let endPoint = "";

            if (action == "store")
                endPoint = this.baseUrl;
            else if (action == 'bulkDelete')
                endPoint = `${this.baseUrl}/bulk-delete`;
            else
                endPoint = `${this.baseUrl}/${id}`;

            const url = useDefaultTo(useGet(this.actionsUrl, action), endPoint)
            return url;
        },
        clearFormData() {
            for (let i of this.formFields) {
                this.formData[i.formItem.prop] = i.input.default ?? null
            }
        },
        getFormData(method = null) {
            const formData = new FormData()
            for (let i of this.formFields) {
                if (typeof (this.formData[i.formItem.prop]) == 'boolean') {
                    formData.append(i.formItem.prop, this.formData[i.formItem.prop] ? "1" : "0")
                } else if (this.formData[i.formItem.prop]?.raw instanceof File) {
                    formData.append(i.formItem.prop, this.formData[i.formItem.prop].raw)
                } else if ((i.input.type == 'image' && typeof (this.formData[i.formItem.prop]) == 'string') || !this.formData[i.formItem.prop]) {
                    continue;
                } else {
                    formData.append(i.formItem.prop, this.formData[i.formItem.prop])
                }
            }
            if (method) {
                formData.append('_method', method);
            }
            return formData;
        },
        closeDialog() {
            this.form.show = false;
        },

        handleOnPreview(file, uploadFiles, formField) {
            // console.log(files.url)
            this.formData[formField.formItem.prop] = file
            console.log(this.formData[formField.formItem.prop])
        },
        handleOnExceed(files, uploadFiles, formField) {
            this.singleUploadRef[0].clearFiles()
            console.log(files)
            console.log(uploadFiles)
            const file = files[0]
            file.uid = genFileId()
            console.log(file)
            console.log(this.singleUploadRef[0].handleStart(file))
        },
        selectChange(value) {
            this.table.selectedData = value;
        },
        getSelectedIds() {
            return this.table.selectedData.map((d) => d.id);
        },

        // formatter
        dateTimeFormatter(row, column, cellValue, index) {
            const momentFormat = this.columns[column.no + (this.selectable ? -1 : 0)].momentFormat;
            return moment(cellValue).format(momentFormat ?? 'DD MMM YYYY - HH:mm:ss');
        }
    },
    watch: {
        'table.params.q': useDebounce(function (value) {
            this.fetchRecords()
        }, 300)
    }
}
</script>