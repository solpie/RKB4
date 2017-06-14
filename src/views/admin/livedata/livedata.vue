<template>
    <div>
        <div v-if='gameIdx<24'>
            小组赛第{{gameIdx+1}}场
        </div>
        <div v-else>
            大师赛第{{gameIdx-23}}场
        </div>
        Score {{lScore}} :{{rScore}}
        <iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>
        <el-button @click='_("test","hhh",3)'>onClk</el-button>
        <el-button @click='_("setLScore",lScore+1)'>left score +1</el-button>
        <el-button @click='_("setLScore",lScore-1)'>left score</el-button>
        <el-button @click='_("setRScore",rScore+1)'>right score +1</el-button>
        <el-button @click='_("setRScore",rScore-1)'>right score</el-button>
    </div>
</template>
<script>
import LiveDataView from './livedataView'
let livedataView = new LiveDataView()
export default {
    data() {
        return livedataView.gameInfo
    },
    created() {
        // window['app'].init(this)
    },
    methods: {
        _: (e, ...param) => {
            livedataView._(e, param)
        }
    }
}
</script>