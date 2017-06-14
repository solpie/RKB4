<style>
.preview {
    width: 1920px;
    height: 1080px;
    transform: scale(0.5);
    left: -480px;
    top: -280px;
    position: fixed;
    overflow: hidden;
    z-index: -1;
}
</style>
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