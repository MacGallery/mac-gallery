<script>
export default {
    props: {
        urlPath: String,
        additionalParams: Object,
        defaultSort: String,
        defaultDirection: {
            type: String,
            default: 'asc'
        },
        selectable: Boolean,
        paginate: {
            type: Boolean,
            default: () => true
        },
        searchLabel: String
    },
    data() {
        return {
            table: {
                data: [],
                selectedData: [],
                paging: {
                    current_page: 1,
                    from: 0,
                    to: 0,
                    per_page: 10,
                    total: 0,
                },
                params: {
                    per_page: 10,
                    page: 1,
                    q: null,
                    sort: undefined,
                    direction: undefined,
                },
                isLoading: true,
            },
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
            this.table.isLoading = true;
            this.table.params = useDefaults(this.table.params, { sort: this.defaultSort, direction: this.defaultDirection })
            $uFetch(this.$props.urlPath, { params: this.table.params })
                .then((response) => {
                    if (this.paginate) {
                        this.table.data = response.data.data
                        this.table.paging = response.data.meta
                    } else {
                        this.table.data = response.data;
                        this.table.paging = null;
                    }
                    this.table.isLoading = false;
                })
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
        sortChange(props) {
            const { column, prop, order } = props;
            this.table.params.sort = prop;
            this.table.params.direction = order == 'ascending' ? 'asc' : 'desc';
            this.fetchRecords()
        },
        selectChange(value) {
            this.table.selectedData = value;
        },
        getSelectedIds() {
            return this.table.selectedData.map((d) => d.id);
        },


        // CRUD
    },
    watch: {
        'table.params.q': useDebounce(function (value) {
            this.fetchRecords()
        }, 300)
    },
}
</script>
<template>
    <div class="flex flex-col">
        <div class="flex justify-between items-center">
            <div class="">
                <el-dropdown v-if="table.selectedData.length">
                    <el-button>
                        Actions
                        <Icon name="fe:arrow-down" class="ms-3" />
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <slot name="bulkActions" />
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <el-input v-model="table.params.q" class="max-w-xs m-2" type="search"
                :placeholder="`Search ${searchLabel ?? ''}`">
                <template #prefix>
                    <Icon name="fe:search" />
                </template>
            </el-input>
        </div>
        <el-divider></el-divider>
        <el-table @filter-change="filterChange" @selection-change="selectChange"
            :default-sort="{ prop: table.params.sort, order: table.params.direction == 'asc' ? 'ascending' : 'descending' }"
            @sort-change="sortChange" :data="table.data" fixed stripe row-key="id"
            :header-cell-style="{ fontWeight: 'bolder' }" v-loading="table.isLoading">
            <el-table-column type="selection" v-if="selectable"></el-table-column>
            <slot name="columns" />

        </el-table>
        <el-divider></el-divider>
        <el-pagination v-if="paginate" v-model:current-page="table.params.page" v-model:page-size="table.params.per_page"
            :page-sizes="[10, 25, 50, 100]" background layout="total, sizes, slot, prev, pager, next"
            :total="table.paging.total" @current-change="fetchRecords" @size-change="fetchRecords">
            <div class="w-full"></div>
        </el-pagination>
    </div>
</template>