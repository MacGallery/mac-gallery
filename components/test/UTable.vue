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
                <el-input v-if="searchable" v-model="table.params.q" class="max-w-xs m-2" type="search"
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
                <el-table-column v-bind="column" :formatter="getFormatter(column.type)" v-for="(column, index) in columns"
                    :key="index">
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
                <template #append v-if="$slots['append']">
                    <slot name="append" />
                </template>
            </el-table>
            <el-divider></el-divider>
            <el-pagination v-if="paginate" v-model:current-page="table.params.page"
                v-model:page-size="table.params.per_page" :page-sizes="[10, 25, 50, 100]" background
                layout="total, sizes, slot, prev, pager, next" :total="table.paging.total" @current-change="fetchRecords"
                @size-change="fetchRecords">
                <div class="w-full"></div>
            </el-pagination>
        </div>
        <ClientOnly>
            <Teleport to="body" v-if="showForm">
                <el-dialog :title="`${useUpperFirst(form.mode)} ${useUpperFirst(title) ?? ''}`" v-model="form.show"
                    align-center destroy-on-close>
                    <el-form :model="formData" ref="formRef">
                        <el-form-item v-bind="formField.formItem" v-for="(formField, index) in formFields" :key="index">
                            <el-select class="w-full" v-if="formField.input.type == 'select'"
                                v-model="formData[formField.formItem.prop]" v-bind="formField.input">
                                <el-option :label="option.text" :value="option.value"
                                    v-for="(option, index) in formField.input.options" :key="option.value"></el-option>
                            </el-select>
                            <el-switch v-else-if="formField.input.type == 'switch'" v-bind="formField.input"
                                v-model="formData[formField.formItem.prop]"></el-switch>

                            <el-upload v-else-if="formField.input.type == 'image'" class="overflow-hidden"
                                ref="imageUploadRef" v-bind="formField.input" :show-file-list="false" :auto-upload="false"
                                :limit="1"
                                :on-change="(file, uploadFiles) => imageHandleOnChange(file, uploadFiles, formField)"
                                :on-exceed="(files, uploadFiles) => imageHandleOnExceed(files, uploadFiles, formField)">
                                <img v-if="formData[formField.formItem.prop]"
                                    :src="typeof (formData[formField.formItem.prop]) == 'string' ? formData[formField.formItem.prop] : formData[formField.formItem.prop].url"
                                    class="avatar" />
                                <!-- {{ formData[formField.formItem.prop] }} -->
                                <Icon name="line-md:plus" size="24" v-if="!formData[formField.formItem.prop]" />
                            </el-upload>

                            <el-upload v-model:file-list="formData[formField.formItem.prop]"
                                v-else-if="formField.input.type == 'images'" list-type="picture-card" :auto-upload="false"
                                :on-preview="imagesHandleOnPreview">
                                <el-button text>
                                    <Icon name="fe:plus" size="24" />
                                </el-button>
                                <Teleport to="body">
                                    <el-dialog v-model="form.imagePreviewShow">
                                        <img w-full :src="form.imagePreviewUrl" alt="Preview Image" />
                                    </el-dialog>
                                </Teleport>
                            </el-upload>
                            <el-input-number v-else-if="formField.input.type == 'number'"
                                v-model="formData[formField.formItem.prop]" controls-position="right" class="!w-full">
                            </el-input-number>
                            <el-input v-else v-bind="formField.input" v-model="formData[formField.formItem.prop]"
                                :formatter="formField.input.format == 'money' ? moneyInputFormatter : null"
                                :parser="formField.input.format == 'money' ? moneyInputParser : null" />
                        </el-form-item>
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
        </ClientOnly>
    </div>
</template>

<script>
import { genFileId } from 'element-plus'
import moment from 'moment';
import { serialize } from 'object-to-formdata'

export default {
    props: {
        baseUrl: {
            type: String,
            required: true,
        },
        showTable: {
            type: Boolean,
            default: () => false,
        },
        selectable: {
            type: Boolean,
            default: () => false,
        },
        searchable: {
            type: Boolean,
            default: () => true,
        },
        title: {
            type: String,
            default: () => ""
        },
        columns: {
            type: [Object],
            default: () => [],
        },
        defaultSort: {
            type: String,
            default: () => 'created_at',
        },
        defaultDirection: {
            type: String,
            default: () => 'desc'
        },
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
        additionalFormData: {
            type: Object,
            default: () => ({})
        },
        identifier: {
            type: String,
            default: () => 'id'
        },
        filters: {
            type: [Object],
            default: () => ({})
        }
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
                imagePreviewShow: false,
                imagePreviewUrl: "",
            },
        }
    },
    setup(props) {
        const formRef = ref()
        const formData = ref({});
        const tableRef = ref();
        const imageUploadRef = ref()

        for (let i of props.formFields) {
            formData.value[i.formItem.prop] = i.input.default ?? (i.input.type == 'images' ? [] : null);
        }

        const moneyFormat = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',

            // These options are needed to round to whole numbers if that's what you want.
            minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        return {
            formRef,
            tableRef,
            formData,
            imageUploadRef,
            moneyFormat,
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
            this.table.params = useDefaults(this.table.params, { sort: this.defaultSort, direction: this.defaultDirection }, { ...this.$props.filters })

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

            console.log(record)

            this.clearFormData()
            this.form.mode = 'edit'
            this.form.show = true;
            this.formData = { ...record };
        },
        onUpdate() {
            if (!this.actions.update)
                return;

            // this.form.loading = true;
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
            console.log(record)
            console.log(this.actionsUrl.view)
            console.log(this.actionsUrl.view ? `${this.actionsUrl.view}/${record.id}` : `${this.$route.fullPath}/${record.id}`)
            this.$router.push(this.actionsUrl.view ? `${this.actionsUrl.view}/${record.id}` : `${this.$route.fullPath}/${record.id}`);
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
                this.formData[i.formItem.prop] = i.input.default ?? (i.input.type == 'images' ? [] : null)
            }
        },
        getFormData(method = null) {
            let formData = new FormData();

            for (let i of this.formFields) {
                if (typeof (this.formData[i.formItem.prop]) == 'boolean') {
                    formData.append(i.formItem.prop, this.formData[i.formItem.prop] ? "1" : "0")
                } else if (this.formData[i.formItem.prop]?.raw instanceof File) {
                    formData.append(i.formItem.prop, this.formData[i.formItem.prop].raw)
                } else if ((i.input.type == 'image' && typeof (this.formData[i.formItem.prop]) == 'string') || !this.formData[i.formItem.prop]) {
                    continue;
                } else if ((i.input.type == 'images')) {
                    for (let image of this.formData[i.formItem.prop]) {
                        if (image.raw) {
                            formData.append(`${i.formItem.prop}[upload][]`, image.raw);
                        } else {
                            formData.append(`${i.formItem.prop}[update][]`, JSON.stringify(image));
                        }
                    }
                } else {
                    formData.append(i.formItem.prop, this.formData[i.formItem.prop])
                }
                console.log(typeof (this.formData[i.formItem.prop]) instanceof File)
            }
            if (method == 'POST') {
                for (let prop in this.additionalFormData) {
                    formData.append(prop, this.additionalFormData[prop]);
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
        imagesHandleOnRemove(uploadFile, uploadFiles) {
            console.log(uploadFile, uploadFiles)
        },
        imagesHandleOnPreview(uploadFile) {
            console.log(uploadFile)
            this.form.imagePreviewUrl = uploadFile.url
            this.form.imagePreviewShow = true
        },

        imageHandleOnChange(file, uploadFiles, formField) {
            // console.log(files.url)
            this.formData[formField.formItem.prop] = file
            console.log(this.formData[formField.formItem.prop])
        },
        imageHandleOnExceed(files, uploadFiles, formField) {
            this.imageUploadRef[0].clearFiles()
            const file = files[0]
            file.uid = genFileId()
            this.imageUploadRef[0].handleStart(file)
        },
        selectChange(value) {
            this.table.selectedData = value;
        },
        getSelectedIds() {
            return this.table.selectedData.map((d) => d.id);
        },

        // formatter
        getFormatter(type) {
            switch (type) {
                case 'datetime':
                    return this.dateTimeFormatter
                case 'number':
                    return this.numberFormatter
                case 'money':
                    return this.moneyFormatter
                default:
                    return (row, column, cellValue, index) => {
                        const defaultValue = this.columns[column.no + (this.selectable ? -1 : 0)].default;
                        return cellValue || defaultValue;
                    }
            }
        },
        dateTimeFormatter(row, column, cellValue, index) {
            const momentFormat = this.columns[column.no + (this.selectable ? -1 : 0)].momentFormat;
            return moment(cellValue).format(momentFormat ?? 'DD MMM YYYY - HH:mm:ss');
        },
        numberFormatter(row, column, cellValue, index) {
            const num = parseInt(cellValue)
            return Number.isInteger(num) ? num : this.columns[column.no + (this.selectable ? -1 : 0)].default;
        },
        moneyFormatter(row, column, cellValue, index) {
            return this.moneyFormat.format(typeof (cellValue) == 'number' ? cellValue : parseInt(cellValue) || 0);
        },
        moneyInputFormatter(value) {
            const num = parseInt(value || 0);
            return `Rp. ${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
        moneyInputParser(value) {
            return value.replace(/\R\p\.\s?|(,*)/g, '')
        },
    },
    watch: {
        'table.params.q': useDebounce(function (value) {
            this.fetchRecords()
        }, 300)
    }
}
</script>