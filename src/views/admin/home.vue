<template>
    <div>
        <el-select v-model="selGameId" placeholder="比赛选择" @change="onSelGameId">
            <el-option v-for="item in gameArr" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
        </el-select>
        <div v-for="link in links" :key="link.url">
            {{link.title}}
            <br>
            <a target="_blank" :href="link.url" :v-text="link.title"> {{link.url}}</a>
        </div>
    
        <el-input  v-model="playUrl">
            <template slot="prepend">播放地址：</template>
        </el-input>
        <el-input  v-model="rtmpUrl">
            <template slot="prepend">推流地址：</template>
        </el-input>
        <hr>
        <a href="/dev/panel.html?panel=bracket&m=1"> /dev/panel.html?panel=bracket&m=1</a>
        <a href="/dev/panel.html?panel=score&m=1"> /dev/panel.html?panel=score&m=1</a>
        <!--<iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>-->
        <el-button @click='_("test","hhh",3)'>onClk</el-button>
    </div>
</template>
<script>
import { HomeView } from './homeView';
let homeView = new HomeView()
window['homeView'] = homeView
export default {
    data() {
        return homeView
    },
    created() {
        homeView.init(this)
    },
    methods: {
        _: (e, ...param) => {
            homeView._(e, param)
        },
        onSelGameId: homeView.onSelGameId
    }
}
</script>