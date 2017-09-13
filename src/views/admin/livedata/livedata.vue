<template>
    <div style="width:1920px">
        <el-col :span='8'>
            <el-collapse v-model="actPanel" accordion>
                <!-- <el-collapse-item title="Group Rank" name="2"> -->
                <!-- <el-table stripe :data="curGroupRank" style="width: 100%" @row-click='rowClick'>
                                                                                                <el-table-column prop="name" label="name" width="140"></el-table-column>
                                                                                                <el-table-column prop="win" label="胜场" width="80"></el-table-column>
                                                                                                <el-table-column prop="dtScore" label="净胜分" width="120"></el-table-column>
                                                                                            </el-table> -->
                <!-- </el-collapse-item> -->
                <el-collapse-item title="Player List" name="3">
                    L1 ~ L4
                    <br>
                    <span v-for='(item,idx) in pokerPlayerArrG1' v-bind:key="idx">
                        {{item.name}}
                        <el-input v-model='item.poker' style="width:50px"></el-input>
                        <el-button @click='_("showPoker",true,item.name,item.poker)'>show</el-button>
                        <el-button @click='_("showPoker",false,item.name,item.poker)'>hide</el-button>
                        {{item.hupuID}}
                        <br>
                    </span>
                    <hr> L5 ~ L10
                    <br>
                    <span v-for='(item,idx) in pokerPlayerArrG2' v-bind:key="idx">
                        {{item.name}}
                        <el-input v-model='item.poker' style="width:50px"></el-input>
                        <el-button @click='_("showPoker",true,item.name,item.poker)'>show</el-button>
                        <el-button @click='_("showPoker",false,item.name,item.poker)'>hide</el-button> {{item.hupuID}}
                        <br>
                    </span>
                </el-collapse-item>
                <el-collapse-item title="Game List" name="1">
                    <el-table stripe :data="gameInfoTable" style="width: 100%" @row-click='rowClick'>
                        <el-table-column prop="idx" label="#" width="60"></el-table-column>
                        <el-table-column prop="vs" label="vs" width="100"></el-table-column>
                        <el-table-column prop="lPlayer" label="L" width="120"></el-table-column>
                        <el-table-column prop="score" label="" width="80"></el-table-column>
                        <el-table-column prop="rPlayer" label="R"></el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </el-col>
        <el-col :span='14'>
            [{{lPlayer}}]{{lHupuID}} vs [{{rPlayer}}] {{rHupuID}}
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
                    小组赛第{{gameIdx}}场
                    <span  style="fontSize:40px">
                        Score
                    <br>
                        <span style="color:blue">{{lScore}}</span> :
                        <span style="color:red">{{rScore}}</span>
                        <br> Foul {{lFoul}} :{{rFoul}}
                    </span>
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
                <el-col :span='8'>
                    <el-button @click='_("setTimer",1)'>开始计时</el-button>
                    <el-button @click='_("setTimer",0)'>暂停计时</el-button>
                    <el-button @click='_("setTimer",-1)'>reset计时</el-button>
                    <br>
                    <br>
                    <el-input v-model='timeInput' style="width:50px">reset计时</el-input>
                    <el-button @click='_("setTimer",-2,timeInput)'>设置时间</el-button>
                    <el-button @click='_("commit")'>提交比赛</el-button>
                    <!-- <el-button @click='_("commit",true)'>提交比赛F</el-button> -->
                </el-col>
                <el-col :span='8'>
                    冠军：
                    <el-button @click='_("showChampion","hide")'>Hide Champion</el-button>
                    <el-input v-model="inputChampion" style="width:450px"></el-input>
                    <br>
                    <el-button @click='_("showChampion",lPlayer,inputChampion)'>{{lHupuID}}</el-button>
                    <el-button @click='_("showChampion",rPlayer,inputChampion)'>{{rHupuID}}</el-button>
                    <br>
                    <el-input v-model="inputPlayerArr" style="width:250px"></el-input>
                    <el-button @click='_("setPlayerArr",inputPlayerArr)'>set Player Arr</el-button>
                </el-col>
            </el-row>
            <el-row>
                <hr>
                <el-button @click='_("initDoubleElimation")'>initDoubleElimation</el-button>
                <el-button @click='_("initGameMonth",380)'>init Game Month</el-button>
                <el-button @click='_("setGameInfo")'>setGameInfo</el-button>
                <br>
                <!-- <el-button @click='_("showGroup","a")'>Group A</el-button>
                                <el-button @click='_("showGroup","b")'>Group B</el-button>
                                <el-button @click='_("showGroup","c")'>Group C</el-button>
                                <el-button @click='_("showGroup","d")'>Group D</el-button>
                                <el-button @click='_("hideGroup")'>Hide Group Rank</el-button> -->
                <br>
                <el-button @click='_("showGamePlayerInfo",true)'>show GamePlayerInfo</el-button>
                <el-button @click='_("showGamePlayerInfo",false)'>hide GamePlayerInfo</el-button>
                <br>
                <el-button @click='_("initBracket")'>initBracket Data</el-button>
                <br>
                <el-input v-model="inputVS" placeholder="a1 a2" style="width:90px"></el-input>
                <el-button @click='_("setVS",inputVS)'>修改对阵</el-button>

                <br>
                <el-input v-model="inputScore" placeholder="3 1" style="width:90px"></el-input>
                <el-button @click='_("setScore",inputScore)'>修改比分</el-button>
                <hr>
                <!-- <el-button @click='_("clearMaster",1)'>clear Master</el-button>
                                <el-button @click='_("clearMaster",0)'>clear All</el-button> -->
                滚动文字：
                <el-input v-model="inputRollText" style="width:250px"></el-input>
                <el-button @click='_("showRollText",inputRollText)'>发送</el-button>
                <el-button @click='_("showRollText",inputRollText,false)'>隐藏</el-button>
                <br>
                <el-button @click='_("showGameProcess",true)'>比赛进程</el-button>
                <el-button @click='_("showGameProcess",true,"pre1")'>分组赛 1</el-button>
                <el-button @click='_("showGameProcess",true,"pre2")'>分组赛 2</el-button>
                <el-button @click='_("showGameProcess",true,"lose1")'>败者组 1</el-button>
                <el-button @click='_("showGameProcess",true,"win1")'>胜者组 1</el-button>
                <el-button @click='_("showGameProcess",true,"lose2")'>败者组 2</el-button>
                <el-button @click='_("showGameProcess",true,"win2")'>胜者组 2</el-button>
                <el-button @click='_("showGameProcess",true,"lose3")'>败者组 3</el-button>
                <el-button @click='_("showGameProcess",true,"lose4")'>败者组 4</el-button>
                <el-button @click='_("showGameProcess",true,"final8")'>8强</el-button>
                <el-button @click='_("showGameProcess",false)'>隐藏</el-button>
            </el-row>
            <el-row>
                <hr>
                <el-button @click='_("reMapBracket")'>reMapBracket</el-button>
                <!-- <el-button @click='_("showPokerPanel",true,8)'>show Poker 8</el-button> -->
                <!-- <el-button @click='_("showPokerPanel",true,12)'>show Poker 12</el-button> -->
                <!-- <el-button @click='_("showPokerPanel",false)'>hide</el-button> -->
                翻完hide
                <el-button @click='_("showPokerPanel",true,0)'>reset</el-button>
                <el-button @click='_("resetPokerPicker")'>resetPokerPicker</el-button>
                <!-- <el-button @click='_("")'>resetPokerPicker</el-button> -->
            </el-row>
            <el-row>
                <hr>
                <a href="/panel.html?panel=backend"> /panel.html?panel=backend</a>
                <br>
                <a href="/panel.html?panel=score&m=1">/panel.html?panel=score&m=1</a>
                <br>
                <el-button @click='_("testRandomGame")'>testRandomGame</el-button>
                <br>
                <a href="/panel.html?panel=poker"> /panel.html?panel=poker</a>
                <br>
                <a href="/panel.html?panel=bracket20&m2=1">/panel.html?panel=bracket20&m2=1</a>
                <br>
                <a href="/panel.html?panel=bracket20&m2=1&score=1">/panel.html?panel=bracket20&m2=1&score=1</a>
            </el-row>
        </el-col>
        <!--<iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>-->
    </div>
</template>
<script>
import LiveDataView from './livedataView'
import DoubleEliminationView from './DoubleElimationView';
import DoubleElimination24View from './DoubleElimation24View';

let livedataView = new LiveDataView()
let doubleElimination24 = new DoubleElimination24View(livedataView)
// let doubleElimination = new DoubleEliminationView(livedataView)
livedataView.appendProp(doubleElimination24)
export default {
    data() {
        let g = doubleElimination24
        return g
    },
    created() {
        livedataView.$vm = this
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