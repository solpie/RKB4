<template>
    <div>
        <el-input v-model="inputDelay"  style="width:90px"></el-input>
    </div>
</template>

<script>
export default {
    data() {
        return dashboardView
    },
    created() {
        dashboardView.init(this)
    },
    methods: {
        _: (e, ...param) => {
            dashboardView._(e, param)
        },
        onClk: (e, ...param) => {
            // adminView.onClk(e, param)
        }
    }
}
</script>
