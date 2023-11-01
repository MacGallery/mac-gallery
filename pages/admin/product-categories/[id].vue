<template>
    <div>

        <el-tabs v-model="activeName" type="border-card" class="demo-tabs">
            <el-tab-pane label="Products" name="products" class="w-full" lazy>
                <u-table :url-path="`/products?product_category_id=${$route.params.id}`" ref="productTable">
                    <template #columns>
                        <el-table-column label="Product" prop="name" sortable="custom">
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
                        <el-table-column label="Visible" prop="visible" column-key="visible">
                            <template #default="scope">
                                <Icon name="line-md:confirm-circle" v-if="scope.row.visible" size="24"
                                    style="color: var(--el-color-success);" />
                                <Icon name="line-md:close-circle" size="24" v-else style="color: var(--el-color-danger);" />
                            </template>
                        </el-table-column>
                        <el-table-column label="Created at" sortable prop="created_at"></el-table-column>
                        <el-table-column align="right">
                            <template #default="scope">
                                <el-dropdown trigger="click">
                                    <span class="el-dropdown-link">
                                        <Icon name="fe:elipsis-v" size="24" />
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="onView(scope.row)">View</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </template>
                </u-table>
            </el-tab-pane>
            <el-tab-pane label="Spare Parts" name="spare-parts">
                <u-table :paginate="false" :url-path="`/product-spare-parts?product_category_id=${$route.params.id}`"
                    ref="sparePartTable">
                    <template #columns>
                        <el-table-column label="Product" prop="name" sortable="custom">
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
                        <!-- <el-table-column label="Item Price" sortable prop="item_price"></el-table-column>
                        <el-table-column label="Service Price" sortable prop="service_price"></el-table-column>
                        <el-table-column label="Stock" sortable prop="stock"></el-table-column> -->
                        <el-table-column label="Created at" sortable prop="created_at"></el-table-column>
                        <el-table-column align="right">
                            <template #default="scope">
                                <el-dropdown trigger="click">
                                    <span class="el-dropdown-link">
                                        <Icon name="fe:elipsis-v" size="24" />
                                    </span>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="onView(scope.row)">View</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </template>
                </u-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeName: "products",
            formData: {
                name: null,
            }
        }
    },
    setup() {
        const productTable = ref()
        const sparePartTable = ref()
        return {
            productTable,
            sparePartTable
        }
    },
    methods: {
        onView(record) {
            this.$router.push(`/admin/products/${record.id}`)
        }
    }
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