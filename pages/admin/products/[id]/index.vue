<template>
    <el-card class="box-card" v-loading="!record">
        <template #header>
            <div class="card-header justify-between flex items-center">
                <span>Product Detail <el-text type="info">#{{ $route.params.id }}</el-text></span>
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
                    <el-form-item label="Description">
                        <el-text type="info">{{ record.description }}</el-text>
                    </el-form-item>
                    <el-form-item label="Category">
                        <el-text type="info">{{ record.category.name }}</el-text>
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

    <el-tabs v-model="activeTab" type="border-card" class="mt-4">
        <el-tab-pane label="Variants" name="variants">
            <TestUTable ref="productVariantTable" v-bind="variants">
                <template #column-variant-name="{ record }">
                    <div class="flex items-center gap-3">
                        <el-image class="!flex justify-center items-center shrink-0 rounded-full"
                            style="width: 30px; height: 30px;" fit="cover"
                            :src="record.images?.length ? record.images[0].url : ''"
                            :preview-src-list="record.images?.map(e => e.url)" preview-teleported>
                            <template #error>
                                <Icon name="ic:outline-image-not-supported" class="mx-auto" />
                            </template>
                        </el-image>
                        <span>{{ record.name }}</span>
                        <!-- {{ record.images?.map(e => e.url) }} -->
                    </div>
                </template>
                <template #column-visible="{ record }">
                    <Icon name="line-md:confirm-circle" v-if="record.visible" size="24"
                        style="color: var(--el-color-success);" />
                    <Icon name="line-md:close-circle" size="24" v-else style="color: var(--el-color-danger);" />
                </template>

                <template #append>
                    <el-button class="w-full mt-3" v-if="productVariantTable" @click="productVariantTable.onCreate"
                        type="primary">New
                        Variant
                    </el-button>
                </template>
            </TestUTable>
        </el-tab-pane>
        <el-tab-pane label="Spare Parts" name="spare-parts">
            <TestUTable v-bind="spareParts" ref="productSparePart">
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
                <template #append>
                    <el-button class="w-full mt-3" v-if="productSparePart" @click="productSparePart.onCreate"
                        type="primary">Attach Spare Part
                    </el-button>
                </template>
            </TestUTable>
        </el-tab-pane>
    </el-tabs>
</template>

<style>
.el-tabs__nav {
    @apply !w-full
}

.el-tabs__item {
    @apply w-full
}
</style>

<script>
export default {
    data() {
        return {
            variants: {
                title: "Product Variants",
                baseUrl: '/product-variants',
                columns: [
                    {
                        name: 'variant-name',
                        label: "Name",
                        prop: 'name',
                        sortable: 'custom',
                    },
                    {
                        label: 'Price',
                        prop: 'price',
                        type: 'money'
                    },
                    {
                        label: 'Stock',
                        prop: 'stock',
                        type: 'number'
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
                    // view: true,
                    bulkDelete: true,
                },
                filters: {
                    with: 'media'
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
                            prop: 'price',
                            label: 'Price',
                            labelWidth: 150,
                        },
                        input: {
                            placeholder: 'Price',
                            format: 'money'
                        }
                    },
                    {
                        formItem: {
                            prop: 'stock',
                            label: 'Stock',
                            labelWidth: 150,
                        },
                        input: {
                            placeholder: 'Stock',
                            type: 'number',
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
                            prop: 'images',
                            label: 'Images',
                            labelWidth: 150,
                        },
                        input: {
                            type: 'images',
                        }
                    },
                ],
                additionalFormData: { product_id: this.$route.params.id },
                filters: { product_id: this.$route.params.id, with: 'media' },
                showTable: true,
                showForm: true,
                paginate: false,
            },
            spareParts: {
                title: "Spare Parts",
                baseUrl: `/products/${this.$route.params.id}/spare-parts`,
                columns: [
                    {
                        name: 'spare-part-name',
                        label: "Name",
                        prop: 'name',
                    },
                    {
                        label: "Add. Info",
                        prop: 'additional_info',
                        default: '-'
                    },
                    {
                        label: 'Item Price',
                        prop: 'item_price',
                        type: 'money'
                    },
                    {
                        label: 'Service Price',
                        prop: 'service_price',
                        type: 'money'
                    },
                    {
                        label: 'Stock',
                        prop: 'stock',
                        default: 0,
                        type: 'number'
                    },
                    {
                        name: 'created_at',
                        label: 'Created at',
                        prop: 'created_at',
                        type: 'datetime',
                    }
                ],
                showTable: true,
                paginate: false,
                identifier: 'p_id',
                actions: {
                    store: true,
                    update: true,
                    delete: true,
                    // view: true,
                    // bulkDelete: true,
                },
                formFields: [
                    {
                        formItem: {
                            prop: 'product_spare_part_id',
                            label: 'Product Spare Part',
                            labelWidth: 150,
                        },
                        input: {
                            type: 'select',
                            options: [],
                            placeholder: "Select spare part",
                            filterable: true,
                        }
                    },
                    {
                        formItem: {
                            prop: 'additional_info',
                            label: 'Additional Info',
                            labelWidth: 150,
                        },
                        input: {
                            placeholder: "Additional Info",
                        }
                    },
                    {
                        formItem: {
                            prop: 'item_price',
                            label: 'Item Price',
                            labelWidth: 150,
                        },
                        input: {
                            placeholder: "Item Price",
                            format: 'money',
                        }
                    },
                    {
                        formItem: {
                            prop: 'service_price',
                            label: 'Service Price',
                            labelWidth: 150,
                        },
                        input: {
                            placeholder: "Service Price",
                            format: 'money',
                        }
                    },
                    {
                        formItem: {
                            prop: 'stock',
                            label: 'Stock',
                            labelWidth: 150,
                        },
                        input: {
                            placeholder: "Stock",
                            type: 'number',
                        }
                    },
                ],
                showForm: true,
            },
            activeTab: 'variants',
            record: null,
        }
    },
    async mounted() {
        await $uFetch(`/products/${this.$route.params.id}`, { params: { with: 'category' } })
            .then((response) => {
                this.record = response.data
            });
        await $uFetch(`/product-spare-parts`, { params: { product_category_id: this.record.product_category_id } })
            .then(response => {
                this.spareParts.formFields[0].input.options = response.data.map(value => ({ text: value.name, value: value.id }))
            })
    },
    setup() {
        const productVariantTable = ref();
        const productSparePart = ref();
        return {
            productVariantTable,
            productSparePart
        }
    }
}
</script>