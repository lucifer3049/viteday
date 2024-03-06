<template>
    <!-- 貼文 -->
    <div class="container">
        <LoadingPlugin :active="isLoading"></LoadingPlugin>
        <div class="text-end mt-4">
            <button type="button" class="btn btn-outline-primary" @click="openModal(true)">
                建立新頁面
            </button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 200px;">標題</th>
                    <th style="width: 200px;">作者</th>
                    <th>描述</th>
                    <th style="width: 200px;">建立時間</th>
                    <th style="width: 200px;">是否公開</th>
                    <th style="width: 200px;">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in articles" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.author }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ $filters.date(item.create_at) }}</td>
                    <td>
                        <span v-if="item.isPublic">已上架</span>
                        <span v-else>未上架</span>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-outline-primary btn-sm"
                                @click="getArticle(item.id)">編輯</button>
                            <button type="button" class="btn btn-outline-danger btn-sm"
                                @click="openDelArticleModal(item)">刪除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <ArticleModal ref="articleModal" :article="tempArticle" :is-new="isNew" @update-article="updateArticle">
        </ArticleModal>
        <DelModal :item="tempArticle" @del-item="delArticle" ref="delModal"></DelModal>
    </div>
</template>

<script>
import ArticleModal from '@/components/ArticleModal.vue';
import DelModal from '@/components/DelModal.vue';
export default {
    data() {
        return {
            articles: [],
            isNew: false,
            tempArticle: {},
            isLoading: false,
            currentPage: 1,
        }
    },
    components: {
        ArticleModal,
        DelModal
    },
    inject: ['emitter'],
    methods: {
        // 查詢貼文資料
        getArticles(page = 1) {
            this.currentPage = page;
            this.isLoading = true;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/articles?page=${page}`)
                .then((response) => {
                    this.isLoading = false;
                    if (response.data.success) {
                        this.articles = response.data.articles;
                        this.pagination = response.data.pagination;
                    }
                })
                .catch((err) => {
                    console.log('err', err.response, err.request, err.message);
                    this.isLoading = false;
                    this.emitter.emit('push-message', {
                        title: '連線錯誤',
                        style: 'danger',
                        content: err.message,
                    })
                })
        },
        getArticle(id) {
            this.isLoading = true;
            this.$http.get(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/article/${id}`)
                .then((response) => {
                    this.isLoading = false;
                    if (response.data.success) {
                        this.openModal(false, response.data.article);
                        this.isNew = false;
                    }
                })
                .catch((err) => {
                    console.log('err', err.request, err.request, err.message);
                    this.isLoading = false;
                    this.emitter.emit('push-message', {
                        title: '連線錯誤',
                        style: 'danger',
                        content: err.message,
                    })
                })
        },
        openModal(isNew, item) {
            if (isNew) {
                this.tempArticle = {
                    isPublic: false,
                    create_at: new Date().getTime() / 1000,
                    tag: [],
                };
                this.isNew = true;
            } else {
                this.tempArticle = { ...item };
                this.isNew = false;
            }
            this.$refs.articleModal.openModal();
        },
        updateArticle(item) {
            this.tempArticle = item;
            let api = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/article`;
            let httpMethod = 'post';
            let status = '新增貼文';
            this.isLoading = true;
            if (!this.isNew) {
                api = `${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/article/${this.tempArticle.id}`;
                httpMethod = 'put';
                status = '編輯貼文';
            }
            const articleComponent = this.$refs.articleModal;
            this.$http[httpMethod](api, { data: this.tempArticle })
                .then((response) => {
                    this.isLoading = false;
                    this.$httpMessageState(response, status);
                    articleComponent.hideModal();
                    this.getArticles(this.currentPage);
                }).catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '錯誤訊息');
                })
        },
        openDelArticleModal(item) {
            this.tempArticle = { ...item };
            const delComponent = this.$refs.delModal;
            delComponent.openModal();
        },
        delArticle() {
            this.isLoading = true;
            this.$http.delete(`${import.meta.env.VITE_API_URL}v2/api/${import.meta.env.VITE_API_PATH}/admin/article/${this.tempArticle.id}`)
                .then((response) => {
                    this.isLoading = false;
                    this.$httpMessageState(response, '刪除貼文');
                    const delComponent = this.$refs.delModal;
                    delComponent.hideModal();
                    this.getArticles(this.currentPage);
                }).catch((err) => {
                    this.isLoading = false;
                    this.$httpMessageState(err.response, '刪除貼文');
                })
        }
    },
    created() {
        this.getArticles();
    }
}
</script>