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
    <div id="app">
        <el-tabs type="border-card">
            <el-tab-pane style="width:250px">
                <span slot="label">
                    <i class="el-icon-edit"></i>Admin Home</span>
                <LiveData></LiveData>
                <!--<Home></Home>-->
            </el-tab-pane>
            <el-tab-pane label="月赛">
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { AdminView } from './adminView';
let adminView = new AdminView()

export default {
    created() {
        adminView.init(this)
    },
    methods: {
        onClk: (e, ...param) => {
            adminView.onClk(e, param)
        }
    }
}
</script>

<style>
body {
    font-family: Helvetica, sans-serif;
}
</style>
