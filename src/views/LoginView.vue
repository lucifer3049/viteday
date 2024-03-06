<template>
    <div class="container">
        <LoadingPlugin :active="isLoading" :z-index="1060"></LoadingPlugin>
        <ToastMessages />
        <form class="row col-md-6 mt-5 mx-auto" @submit.prevent="login">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">帳號</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                    v-model="user.username">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">密碼</label>
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="user.password">
            </div>
            <div class="mb-3 text-end">
                <button type="submit" class="btn btn-primary">登入</button>
            </div>
        </form>
    </div>
</template>

<script>
import emitter from '@/methods/eventBus';
import ToastMessages from '@/components/ToastMessages.vue';
export default {
    data() {
        return {
            user: {}
        }
    },
    components: {
        ToastMessages
    },
    provide() {
        return {
            emitter,
        }
    },
    methods: {
        login() {
            this.$http.post(`${import.meta.env.VITE_API_URL}v2/admin/signin`, this.user)
                .then((res) => {
                    const { token, expired } = res.data;
                    document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
                    this.$router.push("/admin/products");
                })
                .catch((err) => {
                    alert(err.res.data.message);
                })
        }
    },
}

</script>