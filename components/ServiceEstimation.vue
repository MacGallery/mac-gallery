<script>
// import { debounce } from 'nuxt-lodash/dist/runtime/lodash';

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
    methods: {
        back() {
            if (this.selectedProduct) {
                this.variants = [];
                this.spareParts = [];
                this.selectedSpareParts = [];
                this.selectVariant(null);
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
                this.fetchvariants()
            }
        },
        // fetchvariants() {
        //     this.isLoadingVariant = true;
        //     $uFetch(`/products/${this.selectedProduct.id}/variants`)
        //         .then((response) => {
        //             this.variants = response.data
        //             this.isLoadingVariant = false;
        //         })
        // },
        // selectVariant(variantId) {
        //     this.selectedVariantId = variantId
        //     this.fetchSpareParts()
        // },
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
                    </el-card>
                </div>
                <el-scrollbar style="height: calc(100vh - 250px);"
                    :class="!!selectedProduct ? 'col-span-2' : 'col-span-full'">
                    <div class="grid gap-3"
                        :class="selectedProduct ? 'col-span-2 grid-cols-4' : 'col-span-full grid-cols-5'">
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
                                    <!-- <el-card shadow="never"
                                        @click="selectedProduct ? selectSparePart(item) : selectProduct(item)"
                                        class="relative w-full max-w-xl h-[250px]  flex justify-center items-center cursor-pointer"
                                        :body-style="{ padding: 0 }">
                                        <el-image :src="item.image">
                                            <template #error>
                                                <div class="image-slot">
                                                    <Icon name="ic:outline-image-not-supported" size="42" />
                                                </div>
                                            </template>
                                        </el-image>
                                        <div class=" absolute top-0 left-0 flex w-full h-full decoration-none text-[#333]">
                                            <div style="background-image: linear-gradient(
                                                                rgba(0, 0, 0, 0) 0%,
                                                                rgba(0, 0, 0, 0.85) 90%
                                                            );
                                                            " class="flex flex-col mt-auto p-5 w-full">
                                                <el-text tag="h2"
                                                    class="mb-2 !text-white !text-lg w-full">{{ item.name }}</el-text>

                                            </div>
                                        </div>
                                    </el-card> -->
                                </template>
                            </template>
                        </el-skeleton>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>