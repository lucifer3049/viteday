<template>
    <!-- 建立優惠卷 -->
    <div class="container">
        <LoadingPlugin :active="isLoading"></LoadingPlugin>
        <div class="text-end mt-4">
            <button type="button" class="btn btn-outline-primary" @click="openCouponsModal(true)">建立優惠卷</button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">名稱</th>
                    <th scope="col">折扣百分比</th>
                    <th scope="col">到期日</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, key) in coupons" :key="key">
                    <td>{{ item.title }}</td>
                    <td>{{ item.percent }}%</td>
                    <td>{{ $filters.date(item.due_date) }}</td>
                    <td>
                        <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
                        <span v-else class="text-success">未啟用</span>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button class="btn btn-outline-secondary btn-sm"
                                @click="openCouponsModal(false, item)">編輯</button>
                            <button class="btn btn-outline-danger btn-sm" @click="openDelCouponModal(item)">刪除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <PaginationView :pages="pagination" @emit-pages="getCoupons" />
        <CouponModal :coupon="tempCoupon" :is-new="isNew" ref="CouponModal" @update-coupon="updateCoupon" />
        <DelModal :item="tempCoupon" ref="deleteModal" @del-item="delCoupon" />
    </div>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue';
import DelModal from '@/components/DelModal.vue';
import PaginationView from '@/components/PaginationView.vue';
export default {
    props: {
        config: Object,
    },
    data() {
        return {
            coupons: {},
            tempCoupon: {
                title: '',
                is_enabled: 0,
                percent: 100,
                code: '',
            },
            isNew: false,
            isLoading: false,
            pagination: {},
        }
    },
    components: {
        CouponModal,
        DelModal,
        PaginationView,
    },
    methods: {
        getCoupons(page = 1) {
            this.isLoading = true;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/coupons?page=${page}`, this.tempCoupon)
                .then((response) => {
                    this.coupons = response.data.coupons;
                    this.pagination = response.data.pagination;
                    this.isLoading = false;
                }).catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '錯誤訊息');
                })
        },
        // 判斷isNew為true時是新增為false的話為編輯，打開MODAL模組
        openCouponsModal(isNew, item) {
            this.isNew = isNew;
            if (this.isNew) {
                this.tempCoupon = {
                    due_date: new Date().getTime() / 1000,
                };
            } else {
                this.tempCoupon = { ...item };
            }
            this.$refs.CouponModal.openModal();
        },
        updateCoupon(tempCoupon) {
            this.isLoading = true;
            let url = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/coupon`;
            let httpMethods = 'post';
            let data = tempCoupon;

            if (!this.isNew) {
                url = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/coupon/${this.tempCoupon.id}`;
                httpMethods = 'put';
                data = tempCoupon;
            }

            this.$http[httpMethods](url, { data })
                .then((response) => {
                    this.isLoading = false;
                    this.$httpMessageState(response, '新增優惠卷');
                    this.getCoupons();
                    this.$refs.CouponModal.hideModal();
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '錯誤訊息');
                })
        },
        openDelCouponModal(item) {
            this.tempCoupon = { ...item };
            const delComponent = this.$refs.deleteModal;
            delComponent.openModal();
        },
        delCoupon() {
            this.isLoading = true;
            this.$http.delete(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/coupon/${this.tempCoupon.id}`)
                .then((response) => {
                    this.isLoading = false;
                    this.$httpMessageState(response, '刪除優惠卷');
                    const delComponent = this.$refs.deleteModal;
                    delComponent.hideModal();
                    this.getCoupons();
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '刪除優惠卷');
                })
        }

    },
    created() {
        this.getCoupons();
    },
}
</script>