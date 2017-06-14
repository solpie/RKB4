<template>
    <div style="width:1920px">
    
        <el-row>
            <el-col :span='4'>
                <el-row>
                    <el-button @click='_("setLScore",lScore+1)'>L score +1</el-button>
                    <el-button @click='_("setLScore",lScore-1)'>L score -1</el-button>
                </el-row>
                <el-row>
                    <el-button @click='_("setLFoul",lFoul+1)'>L foul +1</el-button>
                    <el-button @click='_("setLFoul",lFoul-1)'>L foul -1</el-button>
                </el-row>
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
                <el-button @click='_("setRScore",rScore+1)'>R score +1</el-button>
                <el-button @click='_("setRScore",rScore-1)'>R score -1</el-button>
                <el-row>
                    <el-button @click='_("setRFoul",rFoul+1)'>R foul +1</el-button>
                    <el-button @click='_("setRFoul",rFoul-1)'>R foul -1</el-button>
                </el-row>
            </el-col>
        </el-row>
    
        <iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>
    </div>
</template>
<script>
import LiveDataView from './livedataView'
let livedataView = new LiveDataView()
export default {
    data() {
        return livedataView.gameInfo
    },
    methods: {
        _: (e, ...param) => {
            livedataView._(e, param)
        }
    }
}
</script>