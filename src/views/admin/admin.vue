<template>
    <div id="app">
        <el-tabs type="border-card">
            <el-tab-pane style="width:250px">
                <span slot="label">
                    <i class="el-icon-edit"></i>Admin Home</span>
                <LiveData></LiveData>
            </el-tab-pane>
            <el-tab-pane label="月赛">
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { AdminView } from './adminView';
window['admin'] = new AdminView()

export default {
    created() {
        window['admin'].init(this)
    },
    methods: {
        onClk: (e, ...param) => {
            window['admin'].onClk(e, param)
        }
    }
}
</script>

<style>
body {
    font-family: Helvetica, sans-serif;
}
</style>
