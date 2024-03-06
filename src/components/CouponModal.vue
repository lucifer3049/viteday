<template>
    <!-- 優惠卷MODAL -->
    <!-- Modal -->
    <div class="modal fade" id="CouponModal" tabindex="-1" aria-labelledby="CouponModalLabel" aria-hidden="true" ref="modal"
        role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="CouponModal">
                        <span v-if="isNew">新增優惠卷</span>
                        <span v-else>編輯優惠卷</span>
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="title">標題</label>
                        <input type="text" class="form-control" id="title" placeholder="請輸入標題" v-model="tempCoupon.title">
                    </div>
                    <div class="mb-3">
                        <label for="coupon_code">優惠碼</label>
                        <input type="text" class="form-control" id="coupon_code" placeholder="請輸入優惠碼"
                            v-model="tempCoupon.code">
                    </div>
                    <div class="mb-3">
                        <label for="due_date">到期日</label>
                        <input type="date" class="form-control" id="due_date" placeholder="請輸入日期" v-model="due_date">
                    </div>
                    <div class="mb-3">
                        <label for="price">折扣百分比</label>
                        <input type="number" class="form-control" id="price" min="0" placeholder="請輸入折扣百分比"
                            v-model.number="tempCoupon.percent">
                    </div>
                    <div class="mb-3">
                        <!-- :true-value="1" :false-value="0"是vue的input元素的指令。處理複選框貨單選框的按鈕 -->
                        <!-- :true-value="1" 元素被選定實綁定的值 -->
                        <!-- :false-value="0" 元素未被選定綁定的值 -->
                        <input type="checkbox" for="is_enabled" id="is_enabled" v-model="tempCoupon.is_enabled"
                            :true-value="1" :false-value="0">
                        <label for="is_enabled">是否啟用</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="$emit('update-coupon', tempCoupon)">{{
                        isNew ? '新增優惠卷' : '編輯優惠卷' }}</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal -->
</template>
<script>
import modalMixin from '@/mixins/modalMixin'
export default {
    props: {
        isNew: {
            type: Boolean,
            default: false,
        },
        coupon: {
            type: Object,
            default() { return {}; }
        }
    },
    data() {
        return {
            tempCoupon: {},
            due_date: '',
        }
    },
    emits: ['update-coupon'],
    mixins: [modalMixin],
    // 監視父組件傳來的資料並做出相印的回應
    watch: {
        coupon() {
            this.tempCoupon = this.coupon;
            const dateAndTime = new Date(this.tempCoupon.due_date * 1000)
                .toISOString().split('T');
            [this.due_date] = dateAndTime;
        },
        due_date() {
            this.tempCoupon.due_date = Math.floor(new Date(this.due_date) / 1000);
        }
    }
}
</script>