<template>
    <el-card>
        <template #header>
            <div class="card-header flex justify-between">
                <span>Products</span>
                <el-button class="button" type="primary" @click="productTable.onCreate" v-if="productTable">New
                    Product</el-button>
            </div>
        </template>
        <TestUTable selectable ref="productTable" base-url="/products" :columns="columns" identifier="id" show-table
            show-form default-sort="created_at" default-direction="desc" :form-fields="formFields" :actions="actions">
            <template #column-product-name="{ record }">
                <div class="flex items-center gap-3">
                    <el-image class="!flex justify-center items-center shrink-0 rounded-full" :src="record.image"
                        style="width: 30px; height: 30px;" fit="cover" :preview-src-list="[record.image]"
                        preview-teleported>
                        <template #error>
                            <Icon name="ic:outline-image-not-supported" class="mx-auto" />
                        </template>
                    </el-image>
                    <span>{{ record.name }}</span>
                </div>
            </template>
            <template #column-visible="{ record }">
                <Icon name="line-md:confirm-circle" v-if="record.visible" size="24"
                    style="color: var(--el-color-success);" />
                <Icon name="line-md:close-circle" size="24" v-else style="color: var(--el-color-danger);" />
            </template>
        </TestUTable>
    </el-card>
</template>

<script>
export default {
    props: {
        columns: String | [String],
    },
    data() {
        return {
            columns: [
                {
                    name: 'product-name',
                    label: "Name",
                    prop: 'name',
                    sortable: 'custom',
                },
                {
                    name: 'category-id',
                    label: "Category",
                    prop: 'category.name',
                    filters: [],
                    filterMultiple: false,
                    columnKey: 'product_category_id'
                },
                {
                    name: 'visible',
                    label: 'Visible',
                    prop: 'visible',
                    columnKey: 'visible',
                    filters: [
                        {
                            text: 'Visible',
                            value: 1
                        },
                        {
                            text: 'Hidden',
                            value: 0,
                        }
                    ],
                    filterMultiple: false,
                },
                {
                    name: 'created_at',
                    label: 'Created at',
                    prop: 'created_at',
                    sortable: 'custom',
                    type: 'datetime',
                }
            ],
            actions: {
                store: true,
                update: true,
                delete: true,
                view: true,
                bulkDelete: true,
            },
            formFields: [
                {
                    formItem: {
                        prop: 'name',
                        label: 'Name',
                        labelWidth: 150,
                    },
                    input: {
                        placeholder: 'Product Name',
                    }
                },
                {
                    formItem: {
                        prop: 'product_category_id',
                        label: 'Category',
                        labelWidth: 150,
                    },
                    input: {
                        placeholder: 'Select category',
                        type: 'select',
                        options: []
                    }
                },
                {
                    formItem: {
                        prop: 'description',
                        label: 'Description',
                        labelWidth: 150,
                    },
                    input: {
                        placeholder: 'Description',
                        type: 'textarea',
                        rows: 2
                    }
                },
                {
                    formItem: {
                        prop: 'visible',
                        label: 'Visible',
                        labelWidth: 150,
                    },
                    input: {
                        type: 'switch',
                        default: true,
                    }
                },
                {
                    formItem: {
                        prop: 'image',
                        label: 'Image',
                        labelWidth: 150,
                    },
                    input: {
                        type: 'image',
                        listType: 'picture-card',
                        multiple: false,
                        autoUpload: false,
                        limit: 1,
                    }
                },
            ]
        }
    }
}
</script>