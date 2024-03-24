<template>
    <!-- 前台頁面 -->
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
                <li class="nav-items">
                    <router-link to="/cart" class="nav-link"><i class="bi bi-cart-plus"></i>購物車</router-link>
                </li>
                <li class="nav-items">
                    <router-link to="/admin/products" class="nav-link"><i
                            class="bi bi-person-circle"></i>後臺管理</router-link>
                </li>
            </ul>
        </div>
    </nav>

</template>
