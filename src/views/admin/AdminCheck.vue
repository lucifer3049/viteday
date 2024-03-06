<template>
    <div class="my-5 row justify-content-center">
        <LoadingPlugin :active="isLoading"></LoadingPlugin>
        <form class="col-md-6" @submit.prevent="payOrder">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th scope="col">品名</th>
                        <th scope="col">數量</th>
                        <th scope="col">單價</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in order.products" :key="item.id">
                        <th>{{ item.product.title }}</th>
                        <td>{{ item.qty }}/{{ item.product.unit }}</td>
                        <td class="text-end">{{ item.final_total }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" class="text-end">總計</td>
                        <td class="text-end">{{ order.total }}</td>
                    </tr>
                </tfoot>
            </table>
            <table class="table">
                <tbody>
                    <tr>
                        <th width="100">Email</th>
                        <td>{{ order.user.email }}</td>
                    </tr>
                    <tr>
                        <th>姓名</th>
                        <td>{{ order.user.name }}</td>
                    </tr>
                    <tr>
                        <th>收件人電話</th>
                        <td>{{ order.user.tel }}</td>
                    </tr>
                    <tr>
                        <th>收件人地址</th>
                        <td>{{ order.user.address }}</td>
                    </tr>
                    <tr>
                        <th>付款狀態</th>
                        <td>
                            <span v-if="!order.is_paid">未付款</span>
                            <span v-else class="text-success">付款完成</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="text-end" v-if="order.is_paid === false">
                <button class="btn btn-success">確認付款去</button>
            </div>
        </form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            order: {
                user: {},
            },
            orderId: {},
        }
    },
    methods: {
        getOrder() {
            this.isLoading = true;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/order/${this.orderId}`)
                .then((response) => {
                    this.order = response.data.order;
                    this.isLoading = false;
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '錯誤訊息');
                })
        },
        payOrder() {
            this.isLoading = true;
            this.$http.post(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/pay/${this.orderId}`)
                .then(() => {
                    this.isLoading = false;
                    this.getOrder();
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '錯誤訊息');
                })
        }
    },
    created() {
        this.orderId = this.$route.params.orderId;
        this.getOrder();

    },
}
</script>
