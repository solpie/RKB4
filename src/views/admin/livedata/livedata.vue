<template>
    <div style="width:1920px">
    
        <el-row>
            <el-col :span='4'>
                L Score
                <el-button @click='_("setLScore",lScore+1)'>+1</el-button>
                <el-button @click='_("setLScore",lScore-1)'>-1</el-button>
                <br>
                <br> L Foul
                <el-button @click='_("setLFoul",lFoul+1)'>+1</el-button>
                <el-button @click='_("setLFoul",lFoul-1)'>-1</el-button>
            </el-col>
            <el-col :span='3'>
                <div v-if='gameIdx<24'>
                    小组赛第{{gameIdx+1}}场
                </div>
                <div v-else>
                    大师赛第{{gameIdx-23}}场
                </div>
                Score {{lScore}} :{{rScore}}
                <br> Foul {{lFoul}} :{{rFoul}}
            </el-col>
    
            <el-col :span='12'>
                R Score
                <el-button @click='_("setRScore",rScore+1)'>+1</el-button>
                <el-button @click='_("setRScore",rScore-1)'>-1</el-button>
                <br>
                <br> R Foul
                <el-button @click='_("setRFoul",rFoul+1)'>+1</el-button>
                <el-button @click='_("setRFoul",rFoul-1)'>-1</el-button>
            </el-col>
        </el-row>
        <br>
        <el-row>
            <el-button @click='_("setGameInfo")'>setGameInfo</el-button>
            <el-button @click='_("setTimer",1)'>开始计时</el-button>
            <el-button @click='_("setTimer",0)'>暂停计时</el-button>
            <el-button @click='_("setTimer",-1)'>reset计时</el-button>
            <br>
            <br>
            <el-input v-model='timeInput' style="width:50px">reset计时</el-input>
            <el-button @click='_("setTimer",-2,timeInput)'>设置时间</el-button>
            <br>
            <br>
            <el-button @click='_("initGameMonth",286)'>init Game Month</el-button>
            
        </el-row>
        <iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>
    </div>
</template>
<script>
import LiveDataView from './livedataView'
let livedataView = new LiveDataView()
export default {
    data() {
        let g = livedataView.gameInfo
        g['timeInput'] = 0
        return g
    },
    methods: {
        _: (e, ...param) => {
            livedataView._(e, param)
        }
    }
}
</script>