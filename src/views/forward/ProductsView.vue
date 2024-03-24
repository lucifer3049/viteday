<template>
    <!-- 產品列表 -->
    <div class="container">
        <div class="row">
            <LoadingPlugin :active="isLoading"></LoadingPlugin>
            <div class="col-md-4 mt-4" v-for="item in products" :key="item">
                <div class="card" style="width: 18rem;">
                    <img :src="item.imageUrl" class="card-img-top" :alt="item.category">
                    <div class="card-body">
                        <h5 class="card-title">{{ item.title }}</h5>
                        <p class="text-end">$NT{{ item.origin_price }}</p>
                        <router-link type="button" class="btn btn-outline-primary"
                            :to="`/product/${item.id}`">產品資訊</router-link>
                        <button type="button" class="btn btn-outline-success"
                            @click="addTotheCart(item.id)">加入購車</button>
                    </div>
                </div>
            </div>
            <Pagination :pages="pagination" @emit-pages="gatProducts"></Pagination>

        </div>
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useToastMessageStore } from '@/stores/toastMessage';
import { RouterLink } from 'vue-router';
import Pagination from '@/components/PaginationView.vue';

export default {
    data() {
        return {
            products: [],
            loadingStatus: {
                loadingItem: "",
            },
            isLoading: false,
            pagination: {},

        }
    },
    components: {
        RouterLink,
        Pagination,
    },
    mounted() {
        this.gatProducts();
    },
    methods: {
        // 產品列表
        ...mapActions(useToastMessageStore, ['pushMessage']),
        gatProducts(page = 1) {
            this.isLoading = true;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/products?page=${page}`)
                .then((res) => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination
                    this.isLoading = false;
                    this.pushMessage({
                        style: 'success',
                        title: '成功取的產品資訊',
                    })

                })
                .catch((err) => {
                    this.$httpMessageState(err.response, '錯誤訊息');

                })
        },

        // 加入購物車
        addTotheCart(id, qty = 1) {
            this.isLoading = true;
            this.loadingStatus.loadingItem = id;
            const cart = {
                product_id: id,
                qty,
            };
            this.$http.post(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/cart`, { data: cart })
                .then((res) => {
                    alert(res.data.message);
                    this.loadingStatus.loadingItem = "";
                    this.isLoading = false;
                })
                .catch((err) => {
                    this.$httpMessageState(err.response, '錯誤訊息');
                })
        }
    },
}

</script>