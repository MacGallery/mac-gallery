<script>
export default {
    data() {
        return {
            categories: [],
            selectedCategory: null,
            isLoadingCategory: true,
            products: [],
            selectedProduct: null,
            isLoadingProduct: true,
            variants: [],
            selectedVariantId: null,
            isLoadingVariant: true,
            spareParts: [],
            selectedSpareParts: [],
            isLoadingSparePart: true,

            params: {
                q: null,
            }
        }
    },
    created() {
        this.fetchCategories()
    },
    setup() {
        const moneyFormat = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',

            // These options are needed to round to whole numbers if that's what you want.
            minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        return {
            moneyFormat
        }
    },
    methods: {
        back() {
            if (this.selectedProduct) {
                this.variants = [];
                this.spareParts = [];
                this.selectedSpareParts = [];
                this.selectProduct(null)
                return;
            }
            if (this.selectedCategory) {
                this.selectCategory(null)
                this.products = []
                return;
            }
        },
        fetchCategories() {
            this.params.q = null;
            this.isLoadingCategory = true;
            $uFetch('/product-categories')
                .then((response) => {
                    this.categories = response.data
                    this.isLoadingCategory = false
                })
        },
        selectCategory(category) {
            this.selectedCategory = category;
            this.products = []
            if (this.selectedCategory != null) {
                this.fetchProducts()
            }
        },
        fetchProducts() {
            this.isLoadingProduct = true;
            $uFetch(`/products?product_category_id=${this.selectedCategory.id}`, { params: this.params })
                .then((response) => {
                    this.products = response.data
                    this.isLoadingProduct = false;
                })
        },
        selectProduct(product) {
            this.params.q = null
            this.selectedProduct = product;
            if (this.selectedProduct != null) {
                this.fetchSpareParts()
            }
        },
        fetchSpareParts() {
            this.spareParts = [];
            this.isLoadingSparePart = true;
            $uFetch(`/products/${this.selectedProduct.id}/spare-parts`, { params: this.params })
                .then(response => {
                    this.spareParts = response.data
                    this.isLoadingSparePart = false;
                })
        },
        selectSparePart(sparePart) {
            this.selectedSpareParts = useXorBy(this.selectedSpareParts, [sparePart])
            console.log(this.selectedSpareParts)
        },
        getSummaries(param) {
            const { columns, data } = param
            const sums = [];
            sums[0] = 'Total';
            sums[1] = data.map((record) => Number(record.service_price));
            sums[1] = `${this.moneyFormat.format(sums[1].reduce((prev, next) => prev + next, 0))}`;
            return sums
        },
        formatter(row, column, cellValue, index) {
            return this.moneyFormat.format(cellValue);
        }
    },
    watch: {
        'params.q': useDebounce(function (value) {
            if (!this.selectedProduct) {
                this.fetchProducts()
            } else {
                this.fetchSpareParts()
            }
        }, 300)
    }
}

</script>

<template>
    <div class="">
        <el-skeleton v-if="selectedCategory == null" class="grid grid-cols-4 gap-4" :count="4" :loading="isLoadingCategory"
            animated>
            <template #template>
                <div class="flex flex-col">
                    <el-skeleton-item variant="image" style="height: 150px;" />
                </div>
            </template>
            <template #default>
                <div class="grid grid-cols-4 gap-4">
                    <el-card v-for="(category, index) in categories" :key="index" @click="selectCategory(category)"
                        class="flex justify-center items-center flex-col text-center cursor-pointer">
                        <NuxtImg :src="category.image" />
                        <h3 class="mt-3">{{ category.name }}</h3>
                    </el-card>
                </div>
            </template>
        </el-skeleton>

        <div class="flex flex-col" v-if="selectedCategory != null">
            <el-page-header @back="back()">
                <template #icon>
                    <Icon name="fe:arrow-left" />
                </template>
                <template #content>
                    <span class="text-large font-600 mr-3"> Select {{ selectedProduct ? 'Spare Parts' : 'Products' }}
                    </span>
                    <el-tag>{{ selectedCategory.name }}</el-tag>
                </template>
                <template #extra>
                    <el-input class="w-50 m-2" v-model="params.q"
                        :placeholder="`Search ${selectedProduct ? 'Spare Parts' : 'Products'}`">
                        <template #prefix>
                            <Icon name="fe:search" />
                        </template>
                    </el-input>
                </template>
            </el-page-header>
            <el-divider />

            <div class="grid grid-cols-3 gap-3">
                <div class="col col-span-1 sticky top-0 left-0" v-if="selectedProduct">
                    <el-card shadow="never" class="relative w-full max-w-xl flex justify-center items-center cursor-pointer"
                        :body-style="{ padding: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }">
                        <el-image :src="selectedProduct.image">
                            <template #error>
                                <div class="image-slot">
                                    <Icon name="ic:outline-image-not-supported" size="42" />
                                </div>
                            </template>
                        </el-image>
                        <div class=" p-4 top-0 left-0 flex flex-col w-full h-full decoration-none text-[#333]">
                            <el-text tag="h2" class="mb-2  !text-lg w-full">{{ selectedProduct.name }}</el-text>
                            <!-- <el-select @change="selectVariant" v-model="selectedVariantId" :loading="!variants.length"
                                class="w-full" placeholder="Select" size="default">
                                <el-option v-for="item in variants" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select> -->
                        </div>
                        <el-table :data="selectedSpareParts" v-if="selectedSpareParts.length" show-summary sum-text="Total"
                            :summary-method="getSummaries">
                            <el-table-column label="Name" prop="name"></el-table-column>
                            <el-table-column label="Price" prop="service_price" :formatter="formatter"></el-table-column>
                        </el-table>
                    </el-card>
                </div>
                <el-scrollbar style="height: calc(100vh - 250px);"
                    :class="selectedProduct ? 'col-span-2' : 'col-span-full'">
                    <div class="grid gap-3" :class="selectedProduct ? 'grid-cols-5' : 'grid-cols-5'">
                        <div class="flex justify-center col-span-full"
                            v-if="!selectedProduct ? (!isLoadingProduct && !products.length) : (!isLoadingSparePart && !spareParts.length)">
                            <el-empty />
                        </div>
                        <el-skeleton :count="4" class="grid grid-cols-4 gap-3 col-span-full" animated
                            v-if="selectedCategory || selectedProduct"
                            :loading="selectedProduct ? isLoadingSparePart : isLoadingProduct"
                            :class="selectedProduct ? 'col-span-full' : ' col-span-full'">
                            <template #template>
                                <div class="flex flex-col">
                                    <el-skeleton-item variant="image" style="height: 250px" />
                                </div>
                            </template>
                            <template #default>
                                <template v-for="(item, index) in (selectedProduct ? spareParts : products)" :key="index">
                                    <div @click="selectedProduct ? selectSparePart(item) : selectProduct(item)"
                                        class="cursor-pointer relative flex flex-col justify-center overflow-hidden ">
                                        <div class="absolute inset-0 bg-center dark:bg-black rounded-xl "></div>
                                        <div
                                            class="group relative m-0 flex h-72 w-full rounded-xl shadow-xl ring-gray-900/5 sm:mx-auto sm:max-w-lg overflow-hidden">
                                            <div class="z-10 h-full w-full overflow-hidden rounded-xl border relative border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70
                                                flex justify-center items-center">
                                                <NuxtImg :src="item.image" v-if="item.image"
                                                    class="animate-fade-in block scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                                                    alt="" />
                                            </div>
                                            <div
                                                class="absolute bottom-0 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                                                <h1 class="font-serif text-2xl font-bold ">
                                                    {{ item.name }} {{ item.additional_info ?? "" }}
                                                    <span
                                                        v-if="useIncludes(selectedSpareParts.map(sp => sp.p_id), item.p_id)">
                                                        <Icon name="fe:check" size="24" color="green" />
                                                    </span>
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </el-skeleton>
                    </div>
                </el-scrollbar>
                <!-- <el-scrollbar style="height: calc(100vh - 250px);"
                    :class="!!selectedProduct ? 'col-span-2' : 'col-span-full'">
                    <div class="grid gap-3"
                        :class="selectedProduct ? 'col-span-2 grid-cols-4' : 'col-span-full grid-cols-5'">
                        <div class="flex justify-center col-span-full" v-if="(selectedProduct && !selectedVariantId)">
                            Select variant
                        </div>
                        <div class="flex justify-center col-span-full" v-if="(!isLoadingProduct && !products.length)">
                            <el-empty />
                        </div>
                        <el-skeleton :count="4" class="grid grid-cols-4 gap-3 col-span-full" animated
                            v-if="selectedCategory || selectedVariantId"
                            :loading="selectedProduct ? isLoadingSparePart : isLoadingProduct"
                            :class="selectedProduct ? 'col-span-full' : ' col-span-full'">
                            <template #template>
                                <div class="flex flex-col">
                                    <el-skeleton-item variant="image" style="height: 250px" />
                                </div>
                            </template>
                            <template #default>
                                <template v-for="(item, index) in (selectedProduct ? spareParts : products)" :key="index">
                                    <div @click="selectedProduct ? selectSparePart(item) : selectProduct(item)"
                                        class="cursor-pointer relative flex flex-col justify-center overflow-hidden ">
                                        <div class="absolute inset-0 bg-center dark:bg-black rounded-xl "></div>
                                        <div
                                            class="group relative m-0 flex h-72 w-full rounded-xl shadow-xl ring-gray-900/5 sm:mx-auto sm:max-w-lg overflow-hidden">
                                            <div class="z-10 h-full w-full overflow-hidden rounded-xl border relative border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70
                                                flex justify-center items-center">
                                                <NuxtImg :src="item.image"
                                                    class="animate-fade-in block scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                                                    alt="" />
                                            </div>
                                            <div
                                                class="absolute bottom-0 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                                                <h1 class="font-serif text-2xl font-bold ">
                                                    {{ item.name }}</h1>
                                                <h1 class="text-sm font-light">A Little Paradise in Portugal</h1>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </el-skeleton>
                    </div>
                </el-scrollbar> -->
            </div>
        </div>
    </div>
</template>