<template>
    <div style="width:1920px">
        <el-col :span='8'>
            <el-collapse v-model="actPanel" accordion>
                <el-collapse-item title="Group Rank" name="2">
                    <el-table stripe :data="curGroupRank" style="width: 100%" @row-click='rowClick'>
                        <el-table-column prop="name" label="name" width="140" />
                        <el-table-column prop="win" label="胜场" width="80" />
                        <el-table-column prop="dtScore" label="净胜分" width="120" />
                    </el-table>
                </el-collapse-item>
                <el-collapse-item title="Game List" name="1">
                    <el-table stripe :data="gameInfoTable" style="width: 100%" @row-click='rowClick'>
                        <el-table-column prop="idx" label="#" width="60" />
                        <el-table-column prop="vs" label="vs" width="100" />
                        <el-table-column prop="lPlayer" label="L" width="120" />
                        <el-table-column prop="score" label="" width="80" />
                        <el-table-column prop="rPlayer" label="R" />
                    </el-table>
                </el-collapse-item>
    
            </el-collapse>
        </el-col>
        <el-col :span='14'>
            {{lHupuID}} vs {{rHupuID}}
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
                <el-col :span='4'>
                    <div v-if='gameIdx<24'>
                        小组赛第{{gameIdx+1}}场
                    </div>
                    <div v-else>
                        大师赛第{{gameIdx-23}}场
                    </div>
                    Score {{lScore}} :{{rScore}}
                    <br> Foul {{lFoul}} :{{rFoul}}
                </el-col>
    
                <el-col :span='4'>
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
                <el-button @click='_("commit")'>提交比赛</el-button>
                <hr>
                <el-button @click='_("initGameMonth",286)'>init Game Month</el-button>
                <el-button @click='_("buildGroup","a")'>Group A</el-button>
                <el-button @click='_("buildGroup","b")'>Group B</el-button>
                <el-button @click='_("buildGroup","c")'>Group C</el-button>
                <el-button @click='_("buildGroup","d")'>Group D</el-button>
            </el-row>
        </el-col>
        <iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>
    </div>
</template>
<script>
import LiveDataView from './livedataView'
let livedataView = new LiveDataView()
export default {
    data() {
        let g = livedataView.gmv
        return g
    },
    methods: {
        _: (e, ...param) => {
            livedataView._(e, param)
        },
        rowClick(row, event, col) {
            this._('getGameInfo', row, event, col)
        }
    }
}
</script>