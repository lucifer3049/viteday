<template>
    <!-- 新增修改MODAL -->
    <!-- Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true"
        ref="modal">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="productModalLabel">
                        <span v-if="isNew">新增產品</span>
                        <span v-else>編輯產品</span>
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <!-- 圖片新增 -->
                            <div class="mb-3">
                                <label for="imageUrl" class="form-label">主要圖片</label>
                                <input type="text" class="form-control mb-2" placeholder="請輸入圖片連結"
                                    v-model="tempProduct.imageUrl">
                                <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                            </div>
                            <!-- 上傳圖片 -->
                            <div class="mb-3">
                                <label for="customFile" class="form-label">或上傳圖片
                                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                                </label>
                                <input type="file" id="customFile" class="form-control" ref="fileInput"
                                    @change="uploadFile">
                                <img :src="tempProduct.imagesUrl" alt="">
                            </div>
                            <!-- 多圖新增 -->
                            <div class="mb-3">多圖新增</div>
                            <div v-if="tempProduct.imagesUrl">
                                <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                                    <div class="mb-3">
                                        <label for="imageUrl" class="form-label">圖片網址</label>
                                        <input v-model="tempProduct.imagesUrl[key]" type="text" class="form-control mb-2"
                                            placeholder="請輸入圖片連結">
                                    </div>
                                    <img class="img-fluid" :src="image" alt="">
                                </div>

                                <div v-if="tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] ||
                                    !tempProduct.imagesUrl.length">
                                    <button type="button" class="btn btn-outline-primary w-100"
                                        @click="tempProduct.imagesUrl.push('')">新增圖片</button>
                                </div>
                                <div v-else>
                                    <button type="button" class="btn btn-outline-danger w-100"
                                        @click="tempProduct.imagesUrl.splice(key, 1)">刪除圖片</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <!-- 商品內容新增 -->
                            <div class="mb-3">
                                <label for="title" class="form-label">標題</label>
                                <input type="text" v-model="tempProduct.title" id="title" class="form-control"
                                    placeholder="請輸入標題">
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="category" class="form-label">分類</label>
                                    <input type="text" v-model="tempProduct.category" id="category" class="form-control"
                                        placeholder="請輸入分類">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="unit" class="form-label">單位</label>
                                    <input type="text" v-model="tempProduct.unit" id="unit" class="form-control"
                                        placeholder="請輸入單位">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="origin_price" class="form-label">原價</label>
                                    <input type="number" class="form-control" id="origin_price" min="0"
                                        v-model.number="tempProduct.origin_price" placeholder="請輸入原價" />
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="price" class="form-label">售價</label>
                                    <input type="number" class="form-control" id="price" v-model.number="tempProduct.price"
                                        min="0" placeholder="請輸入售價" />
                                </div>
                            </div>
                            <hr>
                            <div class="mb-3">
                                <label for="description" class="form-label">產品描述</label>
                                <textarea id="description" v-model="tempProduct.description" type="text"
                                    class="form-control" placeholder="請輸入產品描述"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="content" class="form-label">內容說明</label>
                                <textarea id="content" v-model="tempProduct.content" type="text" class="form-control"
                                    placeholder="請輸入內容說明"></textarea>
                            </div>
                            <div class="mb-3">
                                <div class="form-check ">
                                    <input type="checkbox" v-model="tempProduct.is_enabled" :true-value="1" :false-value="0"
                                        id="is_enabled" class="form-check-input">
                                    <label for="is_enabled" class="form-check-label">是否啟用</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                    <button type="button" class="btn btn-primary" @click="$emit('update-product', tempProduct)">確認</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin';

export default {
    props: {
        isNew: {
            type: Boolean,
            default: false,
        },
        product: {
            type: Object,
            default() { return {}; },
        },
    },
    data() {
        return {
            status: {},
            modal: '',
            tempProduct: {},
        }
    },
    emits: ['update-product'],
    mixins: [modalMixin],
    inject: ['emitter'],
    // 監控product是否同步tempProduct
    // 如果不存在就將imagesUrl初始化為空陣列或空字串
    watch: {
        product() {
            this.tempProduct = this.product;
            if (!this.tempProduct.imagesUrl) {
                this.tempProduct.imagesUrl = [];
            }
            if (!this.tempProduct.imagesUrl) {
                this.tempProduct.imagesUrl = '';
            }
        }
    },
    methods: {
        uploadFile() {
            const uploadFile = this.$refs.fileInput.files[0];
            const formData = new FormData();
            formData.append('file-to-upload', uploadFile);
            const url = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/upload`;
            this.status.fileUploading = true;
            this.$http.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                this.status.fileUploading = false;
                if (res.data.success) {
                    this.tempProduct.imagesUrl = res.data.imagesUrl;
                    this.$refs.fileInput.value = '';
                    this.emitter.emit('push-message', {
                        style: 'success',
                        title: '圖片上傳結果',
                        content: res.data.message,
                    });
                } else {
                    this.$refs.fileInput.value = '';
                    this.emitter.emit('push-message', {
                        style: 'danger',
                        title: '圖片上傳結果',
                        continue: res.data.message,
                    });
                }
            })
                .catch((err) => {
                    this.status.fileUploading = false;
                    this.$httpMessageState(err.res, '圖片失敗');
                })
        }
    },
}

</script>