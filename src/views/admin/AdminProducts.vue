<template>
    <!-- 後臺產品列表 -->
    <div class="container">
        <LoadingPlugin :active="isLoading" :z-index="1060"></LoadingPlugin>
        <div class="row col-md-9 mx-auto">
            <div class="text-end">
                <button type="button" class="btn btn-outline-primary" @click="openModal(true)">建立產品</button>
            </div>
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th scope="col">分類</th>
                        <th scope="col">圖片</th>
                        <th scope="col">品名</th>
                        <th scope="col">價格</th>
                        <th>編輯</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in products" :key="item.id">
                        <td>{{ item.category }}</td>
                        <td scope="row"><img :src="item.imageUrl" alt="" style="width: 150px; "></td>
                        <td>{{ item.title }}</td>
                        <td>
                            {{ item.origin_price }}
                        </td>
                        <td>
                            <button type="button" class="btn btn-outline-secondary"
                                @click="openModal(false, item)">編輯</button>
                            <button type="button" class="btn btn-outline-danger" @click="openDelProduct(item)">刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :pages="pagination" @emit-pages="getProducts"></Pagination>
            <AdimnModal ref="productModal" :product="tempProduct" @update-product="updateProduct" :isNew="isNew">
            </AdimnModal>
            <DelModal :item="tempProduct" @del-item="deleteProductItems" ref="deleteModal" />
        </div>
    </div>
</template>

<style lang="scss">
th,
td {
    text-align: center;
}
</style>

<script>
import { mapActions } from 'pinia';
import { useToastMessageStore } from '@/stores/toastMessage';
import Pagination from '@/components/PaginationView.vue';
import AdimnModal from '@/components/AdimnModal.vue';
import DelModal from '@/components/DelModal.vue';
export default {
    data() {
        return {
            products: [],
            pagination: {},
            loadingStatus: {
                loadingItem: "",
            },

            isLoading: false,
            modal: {
                editModal: '',
                delModal: '',
            },
            isNew: false,
            tempProduct: {},
            status: {
                fileUploading: false,
            },
            currentPage: 1,
        }
    },
    components: {
        Pagination,
        AdimnModal,
        DelModal
    },
    mounted() {
        this.getProducts();
    },
    methods: {
        ...mapActions(useToastMessageStore, ['pushMessage']),
        // 查詢品項
        getProducts(page = 1) {
            this.isLoading = true;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/products?page=${page}`)
                .then((res) => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;//分頁模組 
                    this.isLoading = false;
                    this.pushMessage({
                        style: 'success',
                        title: '成功取得產品資訊',
                    })
                })
                .catch((err) => {
                    this.$httpMessageState(err.response, '錯誤訊息');
                })
        },
        openDelProduct(item) {
            this.tempProduct = { ...item };
            const delComponent = this.$refs.deleteModal;
            delComponent.openModal();
        },
        // 刪除品項
        deleteProductItems() {
            this.isLoading = true;
            // this.loadingStatus.loadingItem = id;
            this.$http.delete(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/product/${this.tempProduct.id}`)
                .then((response) => {
                    this.isLoading = false;
                    this.$httpMessageState(response, '刪除品項');
                    const delComponent = this.$refs.deleteModal;
                    delComponent.hideModal();
                    this.getProducts(this.currentPage);
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '刪除品項');
                })
        },
        // MODAL開關
        openModal(isNew, item) {
            if (isNew) {
                this.tempProduct = {};
                this.isNew = true;
            } else {
                this.tempProduct = { ...item };
                this.isNew = false;
            }
            const productComponent = this.$refs.productModal;
            productComponent.openModal();
        },
        // 新增編輯商品
        updateProduct(item) {
            this.tempProduct = item;
            let api = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/product`;
            this.isLoading = true;
            let httpMethod = 'post';
            let status = '新增產品';
            if (!this.isNew) {
                api = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put';
                status = '更新產品';
            }
            const productComponent = this.$refs.productModal;
            this.$http[httpMethod](api, { data: this.tempProduct })
                .then((response) => {
                    this.isLoading = false;
                    this.$httpMessageState(response, status);
                    productComponent.hideModal();
                    this.getProducts(this.currentPage);
                }).catch((err) => {
                    console.log(api);
                    this.isLoading = false;
                    this.$httpMessageState(err.response, status);
                })
        },
        created() {
            this.getProducts();
        },
    },
}

</script>