<template>
    <!-- 後台導覽 -->
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="/"><img class="img-icon" src="../assets/imag/首頁icon3.png"
                        alt=""></router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" aria-current="page" to="/admin/products">後台產品列表</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/cart" class="nav-link"><i class="bi bi-cart-plus"></i>購物車</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/coupon" class="nav-link">優惠卷</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/orders" class="nav-link">訂單列表</router-link>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link" @click.prevent="signout">登出</a>
                    </li>
                </ul>
            </div>
        </nav>
        <ToastMessages />
        <router-view v-if="checkSuccess"></router-view>
    </div>
</template>

<script>
import emitter from '@/methods/eventBus';
import ToastMessages from '@/components/ToastMessages.vue';

export default {
    components: {
        ToastMessages,

    },
    data() {
        return {
            checkSuccess: false
        }
    },
    provide() {
        return {
            emitter,
        }
    },
    mounted() {
        this.checkLogin();
    },
    methods: {
        //     // 登入驗證
        checkLogin() {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
                "$1"
            );
            if (token) {
                this.$http.defaults.headers.common.Authorization = `${token}`;
                this.$http.post(`${import.meta.env.VITE_API_URL}v2/api/user/check`, { api_token: this.token })
                    .then((response) => {
                        this.$httpMessageState(response, '登入');
                        this.checkSuccess = true;
                    })
                    .catch((err) => {
                        alert(err.res.data.message);
                        this.$router.push('/login');
                    })
            } else {
                alert("還沒登入!!");
                this.$router.push('/login');
            }
        },
        signout() {
            document.cookie = "hexToken=;expires=;";
            alert("token 已清除");
            this.$router.push('/login');
        }
    },
}

</script>