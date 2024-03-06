<template>
    <!-- MODAL 刪除 -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" ref="modal"
        role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h1 class="modal-title">
                        <span>刪除{{ item.title }}</span>
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    是否刪除<strong class="text-danger">{{ item.title }}</strong> (刪除後將無法恢復)
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="$emit('del-item')">確認</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL 刪除 -->
</template>
<script>
import modalMixin from '@/mixins/modalMixin'
export default {
    props: {
        item: {},
    },
    data() {
        return {
        }
    },
    emits: ['del-item'],
    mixins: [modalMixin],
}
</script>