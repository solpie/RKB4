<template>
    <div>
        <div>GameId: {{gameId()}}</div>
        手动延时设置<br>
        <el-input v-model="inputDelay"  style="width:90px"></el-input>
        <el-button @click='_("onSetDelay",inputDelay)'>确定</el-button>
    </div>
</template>

<script>
import { DashboardView } from './dashboardView';
let dashboardView = new DashboardView()
dashboardView['gameId'] = () => {
    return window['homeView'].selGameId
}
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
