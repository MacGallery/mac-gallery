<template>
    <div>
        <el-card class="box-card" v-loading="!record">
            <template #header>
                <div class="card-header justify-between flex items-center">
                    <span>Product Category <el-text type="info">#{{ $route.params.id }}</el-text></span>
                </div>
            </template>
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4" v-if="record">
                <div class="col-span-2 flex justify-center">
                    <el-image :src="record.image" class="aspect-square" />
                </div>
                <div class="col-span-2">
                    <el-form label-position="top" class="grid grid-cols-1 sm:grid-cols-2">
                        <el-form-item label="Name">
                            <el-text type="info">{{ record.name }}</el-text>
                        </el-form-item>
                        <el-form-item label="Visible">
                            <el-text>
                                <Icon name="line-md:confirm-circle" v-if="record.visible" size="24"
                                    style="color: var(--el-color-success);" />
                                <Icon name="line-md:close-circle" size="24" v-else style="color: var(--el-color-danger);" />
                            </el-text>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <el-divider />
            <span class="flex justify-end">
                <el-button @click="$router.back()">Back</el-button>
                <!-- <el-button :loading="isOnDialogAction" type="primary" @click="mode == 'edit' ? onUpdate() : onStore()">
                {{ mode == 'edit' ? 'Update' : 'Submit' }}
            </el-button> -->
            </span>
        </el-card>
        <el-tabs v-model="activeName" type="border-card" class="mt-4">
            <el-tab-pane label="Products" name="products" class="w-full">
                <TestUTable v-bind="products" ref="productTable">
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
                    <template v-slot:append>
                        <el-button class="w-full mt-3" v-if="productTable" @click="productTable.onCreate" type="primary">New
                            Product</el-button>
                    </template>
                </TestUTable>
            </el-tab-pane>

            <el-tab-pane label="Spare Parts" name="sparesParts" class="w-full">
                <TestUTable v-bind="spareParts" ref="sparePartTable">
                    <template #column-spare-part-name="{ record }">
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
                    <template v-slot:append>
                        <el-button class="w-full mt-3" v-if="sparePartTable" @click="sparePartTable.onCreate"
                            type="primary">New
                            Spare Part</el-button>
                    </template>
                </TestUTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            products: {
                title: "Products",
                baseUrl: '/products',
                additionalFormData: {
                    product_category_id: this.$route.params.id
                },
                filters: {
                    product_category_id: this.$route.params.id,
                },
                columns: [
                    {
                        name: 'product-name',
                        label: "Name",
                        prop: 'name',
                        sortable: 'custom',
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
                defaultSort: 'created_at',
                defaultDirection: 'desc',
                actions: {
                    store: true,
                    update: true,
                    delete: true,
                    view: true,
                    bulkDelete: true,
                },
                actionsUrl: {
                    view: '/admin/products'
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
                ],
                paginate: false,
                showTable: true,
                selectable: true,
                showForm: true
            },
            spareParts: {
                title: "Products Spare Parts",
                baseUrl: '/product-spare-parts',
                additionalFormData: {
                    product_category_id: this.$route.params.id
                },
                filters: {
                    product_category_id: this.$route.params.id,
                },
                columns: [
                    {
                        name: 'spare-part-name',
                        label: "Name",
                        prop: 'name',
                        sortable: 'custom',
                    },
                    {
                        name: 'created_at',
                        label: 'Created at',
                        prop: 'created_at',
                        sortable: 'custom',
                        type: 'datetime',
                    }
                ],
                defaultSort: 'created_at',
                defaultDirection: 'desc',
                actions: {
                    store: true,
                    update: true,
                    delete: true,
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
                            placeholder: 'Spare Part Name',
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
                        }
                    },
                ],
                paginate: false,
                showTable: true,
                selectable: true,
                showForm: true
            },
            activeName: "products",
            record: null,
        }
    },
    async mounted() {
        $uFetch(`/product-categories/${this.$route.params.id}`)
            .then((response) => {
                this.record = response.data
            })
    },
    setup() {
        const productTable = ref()
        const sparePartTable = ref()
        return {
            productTable,
            sparePartTable
        }
    },
}
</script>

<style>
.el-tabs__nav {
    @apply !w-full
}

.el-tabs__item {
    @apply w-full
}
</style>