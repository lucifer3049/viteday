<template>
    <!-- 訂單詳細MODAL -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="productModalLabel"
        aria-hidden="true" ref="modal">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="productModalLabel">
                        <span>訂單細節</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4">
                            <h3>用戶資料</h3>
                            <table class="table">
                                <tbody v-if="tempOrder.user">
                                    <tr>
                                        <th>姓名</th>
                                        <td>{{ tempOrder.user.name }}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{{ tempOrder.user.email }}</td>
                                    </tr>
                                    <tr>
                                        <th>電話</th>
                                        <td>{{ tempOrder.user.tel }}</td>
                                    </tr>
                                    <tr>
                                        <th>地址</th>
                                        <td>{{ tempOrder.user.address }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-md-8">
                            <h3>訂單細節</h3>
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <th style="width: 100px;">訂單編號</th>
                                        <td>{{ tempOrder.id }}</td>
                                    </tr>
                                    <tr>
                                        <th>下單時間</th>
                                        <td>{{ $filters.date(tempOrder.create_at) }}</td>
                                    </tr>
                                    <tr>
                                        <th>付款時間</th>
                                        <td>
                                            <span v-if="tempOrder.paid_date">
                                                {{ $filters.date(tempOrder.paid_date) }}
                                            </span>
                                            <span v-else>時間不正確</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>付款狀態</th>
                                        <td>
                                            <strong v-if="tempOrder.is_paid" class="text-success">已付款</strong>
                                            <span v-else class="text-success">尚未付款</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>總金額</th>
                                        <td>
                                            {{ $filters.currency(tempOrder.total) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h3>選購商品</h3>
                            <table class="table">
                                <tbody>
                                    <tr v-for="item in tempOrder.products" :key="item.id">
                                        <th>{{ item.product.title }}</th>
                                        <td>{{ item.qty }} / {{ item.product.unit }}</td>
                                        <td class="text-end">
                                            {{ $filters.currency(item.final_total) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="d-flex justify-content-end">
                                <div class="form-check">
                                    <input type="checkbox" id="flexCheckDefault" class="form-check-input"
                                        v-model="tempOrder.is_paid">
                                    <label for="flexCheckDefault" class="form-check-label">
                                        <span v-if="tempOrder.is_paid">已付款</span>
                                        <span v-else>未付款</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                    <button type="button" class="btn btn-primary" @click="$emit('update-paid', tempOrder)">確定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin'
export default {
    props: {
        order: {
            type: Object,
            default() { return {}; },
        }
    },
    data() {
        return {
            tempOrder: {},
            status: {},
            modal: '',
            isPaid: false,
        }
    },
    mixins: [modalMixin], //將modalMixin的定義合併到當前組件
    emits: ['update-paid'], //聲明自定義是薦選項，讓父組件或其他組件可以監聽並響應這個事件
    inject: ['emitter'],  //讀取父組件的依賴
    watch: {  //當父組件的資料傳到子組件時監聽，並將資料複製給子組件
        order() {
            this.tempOrder = this.order;
        }
    }
}
</script>