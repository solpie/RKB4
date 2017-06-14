
<template>
    <div>
        Home link
        <iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>
        <el-button @click='_("test","hhh",3)'>onClk</el-button>
    </div>
</template>
<script>
export default {
    created() {
        // window['app'].init(this)
    },
    methods: {
        _: (e, ...param) => {
            admin._(e, param)
        }
    }
}
</script>