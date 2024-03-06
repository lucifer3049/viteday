<template>
    <!-- 訂單列表 -->
    <div class="container">
        <LoadingPlugin :active="isLoading"></LoadingPlugin>
        <table class="table">
            <thead>
                <tr>
                    <td>購買時間</td>
                    <td>Email</td>
                    <td>購買款項</td>
                    <td>應付金額</td>
                    <td>是否付款</td>
                    <td>編輯</td>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in orders" :key="item">
                    <!-- v-if="orders.length"判斷說訂單如果沒有訂單就不渲染tr length是JS數組的一個屬性代表訂單的數量 -->
                    <!-- :class="{ 'text-secondary': !item.is_paid }" 判斷如果是true就呈現另一個屬性 -->
                    <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
                        <!--  $filters.date vue表單的時間格式 -->
                        <td>{{ $filters.date(item.create_at) }}</td>
                        <td><span v-text="item.user.email" v-if="item.user"></span></td>
                        <td>
                            <ul class="list-unstyled">
                                <li v-for="(product, i) in item.products" :key="i">
                                    {{ product.product.title }} 數量:{{ product.qty }} |
                                    {{ product.product.unit }}
                                </li>
                            </ul>
                        </td>
                        <td>{{ item.total }}</td>
                        <td>
                            <div class="form-check form-switch">
                                <input type="checkbox" class="form-check-input" :id="`paidSwitch${item.immediate}`"
                                    v-model="item.is_paid" @change="updatePaid(item)">
                                <label :for="`paidSwitch${item.id}`" class="form-check-label">
                                    <span v-if="item.is_paid">已付款</span>
                                    <span v-else>未付款</span>
                                </label>
                            </div>
                        </td>
                        <td>
                            <div class="btn-group">
                                <button type="button" class="btn btn-outline-info" @click="openModal(item)">檢視</button>
                                <button type="button" class="btn btn-outline-danger"
                                    @click="openDelOrdersModal(item)">刪除</button>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination :pages="pagination" @emit-pages="getOrders" />
        <DelModal :item="tempOrder" ref="deleteModal" @del-item="delOrders" />
        <OrdersModal :order="tempOrder" ref="ordersModal" @update-paid="updatePaid" />
    </div>
</template>
<script>
import DelModal from '@/components/DelModal.vue';
import Pagination from '@/components/PaginationView.vue';
import OrdersModal from '@/components/OrdersModal.vue';
export default {
    data() {
        return {
            orders: {},
            isNew: false,
            isLoading: false,
            currentPage: 1,
            tempOrder: {},
            pagination: {},
        }
    },
    components: {
        DelModal,
        Pagination,
        OrdersModal,
    },
    methods: {
        getOrders(page = 1) {
            this.isLoading = true;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/orders?page=${page}`)
                .then((res) => {
                    this.orders = res.data.orders;
                    this.pagination = res.data.pagination;
                    this.isLoading = false;
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '錯誤訊息');
                })
        },
        openModal(item) {
            this.tempOrder = { ...item };
            this.isNew = false;
            const orderComponent = this.$refs.ordersModal;
            orderComponent.openModal();
        },
        updatePaid(item) {
            this.isLoading = true;
            const paid = {
                is_paid: item.is_paid
            }
            this.$http.put(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/order/${item.id}`, { data: paid })
                .then((res) => {
                    this.isLoading = false;
                    const orderComponent = this.$refs.ordersModal;
                    orderComponent.hideModal();
                    this.getOrders(this.currentPage);
                    this.$httpMessageState(res, '更新付款狀態');

                })
                .catch((err) => {
                    this.$httpMessageState(err.res, '更新付款狀態');
                    this.isLoading = false;
                })
        },
        openDelOrdersModal(item) {
            this.tempOrder = { ...item };
            const delComponent = this.$refs.deleteModal;
            delComponent.openModal();
        },
        delOrders() {
            this.isLoading = true;
            this.$http.delete(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/order/${this.tempOrder.id}`)
                .then((response) => {
                    this.isLoading = false;
                    this.$httpMessageState(response, '刪除訂單');
                    const delComponent = this.$refs.deleteModal;
                    delComponent.hideModal();
                    this.getOrders();
                })
                .catch((err) => {
                    this.$httpMessageState(err.response, '刪除訂單')
                })
        }
    },
    created() {
        this.getOrders();
    }
}
</script>