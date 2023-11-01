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
            <TestUTable selectable title="Product Variant" ref="productVariantTable"
                :base-url="`/product-variants?product_id=${$route.params.id}`" :columns="columns" identifier="id" show-table
                show-form default-sort="created_at" default-direction="desc" :form-fields="formFields" :actions="actions">
                <template #column-variant-name="{ record }">
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
            <!-- <el-card v-loading="!record">
                <template #header>
                    <div class="flex justify-between items-center">
                        <span>Product Variants</span>
                        <el-button class="button" type="primary" plain @click="onCreate">New Product Variant</el-button>
                    </div>
                </template>
                <u-table v-if="record" :url-path="`/products/${record.id}/variants`" ref="productVariantTable"
                    default-sort="created_at" default-direction="desc">
                    <template #columns>
                        <el-table-column label="Variant" prop="name" sortable="custom">
                            <template #default="scope">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="rounded-full overflow-hidden max-w-[32px] max-h-[32px] w-full h-full shadow-xl flex justify-center items-center">
                                        <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]"
                                            preview-teleported>
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
                        <el-table-column label="Price" prop="price" column-key="price" />
                        <el-table-column label="Stock" prop="stock" column-key="stock" />
                        <el-table-column label="Visible" prop="visible" column-key="visible">
                            <template #default="scope">
                                <Icon name="line-md:confirm-circle" v-if="scope.row.visible" size="24"
                                    style="color: var(--el-color-success);" />
                                <Icon name="line-md:close-circle" size="24" v-else style="color: var(--el-color-danger);" />
                            </template>
                        </el-table-column>
                        <el-table-column label="Created at" prop="created_at" :formatter="dateFormatter"></el-table-column>

                        <el-table-column align="right">
                            <template #default="scope">
                                <el-dropdown trigger="click">
                                    <span class="el-dropdown-link">
                                        <Icon name="fe:elipsis-v" size="24" />
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="onToggleVisible(scope.row)">Toggle
                                                Visible</el-dropdown-item>
                                            <el-dropdown-item @click="onDelete(scope.row)">Delete</el-dropdown-item>
                                            <el-dropdown-item @click="onEdit(scope.row)">Edit</el-dropdown-item>
                                            <el-dropdown-item @click="onView(scope.row)">View</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </template>
                </u-table>
            </el-card> -->
        </el-tab-pane>
        <el-tab-pane label="Spare Parts" name="spare-parts">
            Spare Parts
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
            columns: [
                {
                    name: 'variant-name',
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
            ],
            activeTab: 'variants',
            record: null,
        }
    },
    mounted() {
        $uFetch(`/products/${this.$route.params.id}`, { params: { with: 'category' } })
            .then((response) => {
                this.record = response.data
            });
    },
    setup() {
        const productVariantTable = ref();
        return {
            productVariantTable
        }
    }
}
</script>