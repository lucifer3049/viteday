<template>
    <!-- 購物車 -->
    <div class="container">
        <LoadingPlugin :active="isLoading"></LoadingPlugin>
        <div class="text-end">
            <button type="button" class="btn btn-outline-danger" @click="deleteAllCarts"><i
                    class="bi bi-trash"></i>清除購物車</button>
        </div>
        <table class="table align-middle">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">圖片</th>
                    <th scope="col">名稱</th>
                    <th scope="col">數量</th>
                    <th scope="col">價格</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="cart.carts">
                    <tr v-for="item in cart.carts" :key="item">
                        <td><button type="button" class="btn btn-outline-danger" @click="removeCartItem(item.id)"><i
                                    class="bi bi-trash"></i></button></td>
                        <td><img :src="item.product.imageUrl" alt="" style="width: 150px; height: 150px;"></td>
                        <td>
                            {{ item.product.title }}
                            <div class="text-success" v-if="item.coupon">已套用優惠眷</div>
                        </td>
                        <td>
                            <div class="input-group input-group-sm">
                                <input type="number" class="form-control" v-model.number="item.qty" min="1" max="20"
                                    @blur="updateCart(item)">
                                <div class="input-group-text">/ {{ item.product.unit }}</div>
                            </div>
                        </td>
                        <td>
                            <small class="text-success" v-if="cart.final_total !== cart.total">折扣價:</small>
                            {{ $filters.currency(item.final_total) }}
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="text-end text-success">總計</td>
                    <td class="text-end text-success">{{ $filters.currency(cart.total) }}</td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                    <td colspan="3" class="text-end text-success">折扣價</td>
                    <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
                </tr>
            </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" v-model="coupon_code" placeholder="套用優惠眷">
            <button class="btn btn-outline-secondary" @click="addCoupon()">套用優惠眷</button>
        </div>
        <hr>
        <!-- 驗證表單 -->
        <div class="my-5 row justify-content-center">
            <FormVee ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <FieldVee id="email" name="email" type="email" class="form-control"
                        :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email" rules="email|required"
                        v-model="form.user.email">
                    </FieldVee>
                    <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
                </div>
                <div class="mb-3">
                    <label for="name" class="form-label">姓名</label>
                    <FieldVee id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
                        placeholder="請輸入姓名" rules="required" v-model="form.user.name">
                    </FieldVee>
                    <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
                </div>
                <div class="mb-3">
                    <label for="tel" class="form-label">電話</label>
                    <FieldVee id="tel" name="電話" type="tel" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
                        placeholder="請輸入電話" rules="required|min:8|max:10" v-model="form.user.tel">
                    </FieldVee>
                    <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
                </div>
                <div class="mb-3">
                    <label for="address" class="form-label">地址</label>
                    <FieldVee id="address" name="地址" type="text" class="form-control"
                        :class="{ 'is-invalid': errors['地址'] }" placeholder="請輸入地址" rules="required"
                        v-model="form.user.address">
                    </FieldVee>
                    <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
                </div>
                <div class="mb-3">
                    <label for="message" class="form-label">留言</label>
                    <textarea name="" id="message" class="form-control" cols="30" rows="10"
                        v-model="form.message"></textarea>
                </div>
                <div class="text-end">
                    <button type="submit" class="btn btn-primary">送出訂單</button>
                </div>
            </FormVee>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            cart: {},
            loadingStatus: {
                loadingItem: "",
            },
            isLoading: false,
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            }
        }
    },
    methods: {
        getCart() {
            this.isLoading = true;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/cart`)
                .then((res) => {
                    this.cart = res.data.data;
                    this.isLoading = false;
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.res, '錯誤訊息')
                })
        },
        // 刪除購物車
        removeCartItem(id) {
            this.isLoading = true;
            this.loadingStatus.loadingItem = id;
            this.$http.delete(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/cart/${id}`)
                .then((res) => {
                    this.$httpMessageState(res, "刪除購物車");
                    this.getCart();
                })
                .catch((err) => {

                    this.$httpMessageState(err.response, "刪除購物車");
                })
            this.loadingStatus.loadingItem = "";
            this.isLoading = false;
        },
        // 清除購物車
        deleteAllCarts() {
            this.isLoading = true;
            this.$http.delete(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/carts`)
                .then((response) => {
                    this.$httpMessageState(response, '刪除購物車');
                    this.getCart();
                    this.isLoading = false;
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '刪除購物車');
                })
        },
        // 更新購物車
        updateCart(data) {
            this.isLoading = true;
            const url = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/cart/${data.id}`;
            const cart = {
                product_id: data.product_id,
                qty: data.qty,
            };
            this.$http.put(url, { data: cart })
                .then((response) => {
                    this.$httpMessageState(response, "更新購物車");
                    this.isLoading = false;
                    this.getCart();
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, "更新購物車")
                })
        },
        // 新增優惠卷
        addCoupon() {
            this.isLoading = true;
            const url = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/coupon`;
            const coupon = {
                code: this.coupon_code,
            };
            this.isLoading = true;
            this.$http.post(url, { data: coupon })
                .then((response) => {
                    this.$httpMessageState(response, "加入優惠卷");
                    this.getCart();
                    this.isLoading = false;

                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, "加入優惠卷");
                })
        },
        // 建立訂單
        createOrder() {
            this.isLoading = true;
            const order = this.form;
            this.$http.post(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/order`, { data: order })
                .then((response) => {
                    this.$httpMessageState(response, '建立訂單');
                    this.$router.push(`admin/check/${response.data.orderId}`)
                    this.$refs.form.resetForm();
                    this.isLoading = false;
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '錯誤訊息')
                })
        },
    },
    created() {
        this.getCart();
    }
}

</script>