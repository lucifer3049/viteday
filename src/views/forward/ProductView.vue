<template>
    <!-- 單一產品細節 -->
    <div class="container">
        <div class="row mt-4">
            <div class="card mb-3" style="max-width: 540px;">
                <LoadingPlugin :active="isLoading"></LoadingPlugin>
                <div class="row g-0">
                    <div class="col-md-4">
                        <img :src="product.imageUrl" class="img-fluid rounded-start" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">{{ product.title }}</h5>
                            <p class="card-text">{{ product.description }}</p>
                            <p class="card-text"><small class="text-body-secondary">{{ product.origin_price }}</small>
                                <button type="button" class="btn btn-outline-success float-end"
                                    @click="addTotheCart(product.id)">加入購物車</button>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useToastMessageStore } from '@/stores/toastMessage.js';
export default {
    data() {
        return {
            product: {},
            loadingStatus: {
                loadingItem: "",
            },
        }
    },
    created() {
        this.gehProduct();
    },
    methods: {
        ...mapActions(useToastMessageStore, ['pushMessage']),
        gehProduct() {
            const { id } = this.$route.params;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/product/${id}`)
                .then((res) => {
                    this.product = res.data.product;
                    this.pushMessage({
                        style: 'success',
                        title: '成功取的產品資訊'
                    })
                })
                .catch((err) => {
                    this.$httpMessageState(err.res, '錯誤訊息')
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
                    this.$httpMessageState(res, '加入購物車')
                    this.loadingStatus.loadingItem = "";
                    this.isLoading = false;
                })
                .catch((err) => {
                    this.$httpMessageState(err.res, '錯誤訊息')
                })
        }
    },
}
</script>