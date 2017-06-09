<template>
    <div id="app">
        <el-tabs type="border-card">
            <el-tab-pane style="width:250px">
                <span slot="label"><i class="el-icon-edit"></i> Home</span>
            </el-tab-pane>
            <el-tab-pane label="page1">
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    created() {
        window['app'].init(this)
    }
}
</script>

<style>
body {
    font-family: Helvetica, sans-serif;
}
</style>
