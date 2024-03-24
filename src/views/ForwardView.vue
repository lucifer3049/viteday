<template>
    <Navbar></Navbar>
    <div class="container">
        <!-- <div class="row"> -->
            <div class="col-md-3">
                <!-- <LeftNavbar></LeftNavbar> -->
            </div>
            <div class="col-md-9">
                <router-view></router-view>
            </div>
        <!-- </div> -->
    </div>
</template>

<script>
import Navbar from '@/components/NavbarForward.vue'
// import LeftNavbar from '@/components/LeftNavbar.vue'

export default {
    components: {
        Navbar,
        // LeftNavbar
    }
}
</script>
