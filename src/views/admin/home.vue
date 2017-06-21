<template>
    <div>
        <div>Home link</div>  
        <a href="/dev/panel.html?panel=bracket&m=1"> /dev/panel.html?panel=bracket&m=1</a>
        <a href="/dev/panel.html?panel=score&m=1"> /dev/panel.html?panel=score&m=1</a>
        <!--<iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>-->
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