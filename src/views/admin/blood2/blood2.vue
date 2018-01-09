<template>
    <div style="width:1920px">
        <el-col :span='8'>
            <el-collapse v-model="actPanel" accordion>
                <el-collapse-item title="Player List" name="3">
                    L1 ~ L4
                    <br>
                    <span v-for='(item,idx) in pokerPlayerArrG1' v-bind:key="idx">
                        {{item.name}}
                        <el-button @click='_("showPlayerProcess",true,item.name,item.poker)'>show</el-button>
                        <!-- <el-button @click='_("addPlayerRankData",item.data)'>add</el-button> -->
                        <!-- {{item.hupuID}} {{item.ranking}}    |   {{item.data.player_id}} -->

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
                    <el-table stripe :data="gameInfoTable" style="width: 100%;height:800px;overflow-y: scroll;" @row-click='rowClick'>
                        <el-table-column prop="idx" label="#" width="60"></el-table-column>
                        <el-table-column prop="vs" label="vs" width="110"></el-table-column>
                        <el-table-column prop="lPlayer" label="L" width="120"></el-table-column>
                        <el-table-column prop="score" label="" width="80"></el-table-column>
                        <el-table-column prop="rPlayer" label="R"></el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </el-col>
        <el-col :span='14'>
                    小组赛第{{gameIdx}}场
            [{{lPlayer}}]{{lRealName}} vs [{{rPlayer}}] {{rRealName}}
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
                <el-col :span='6'>
                    <span style="fontSize:40px">
                        Score
                        <br>
                        <span style="color:blue">{{lScore}}</span> :
                        <span style="color:red">{{rScore}}</span>
                        <br> Blood <br>
                         {{lBlood}} :{{rBlood}}
                        <br> Bonus <br>
                         {{lFoul}} :{{rFoul}}
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
                <el-col :span='8'>
                    <el-input v-model='inputRoomId' style="width:100px"></el-input>
                    <el-button @click='_("startGamble",inputRoomId,lHupuID,rHupuID)'>开题</el-button>
                    ----------------<el-button @click='_("cleanGamble")'>清除</el-button>
                    <br>
                    <span v-for='(item,idx) in gambleArr' v-bind:key="idx">
                        <el-button @click='_("gambleAct","fin",item.topicId,1)'>{{item.left}}</el-button>
                        <el-button @click='_("gambleAct","fin",item.topicId,2)'>{{item.right}}</el-button>
                        <el-button @click='_("gambleAct","stop",item.topicId)'>封盘</el-button>
                        <el-button @click='_("gambleAct","cancel",item.topicId)'>流盘</el-button>
                        <br>
                    </span>
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
                    <!-- <el-button @click='_("commit")'>提交比赛</el-button> -->
                    <el-button @click='_("commit")'>提交比赛</el-button>
                    <el-button @click='_("setRoundEnd")'>结算点</el-button>
                    <!-- <el-button @click='_("commit",true)'>提交比赛F</el-button> -->
                    <br>
                    <br>
                </el-col>
                <el-col :span='8'>
                    
                <el-col :span='4'>
                    left KDA
                </el-col>
                <el-col :span='4'>
                    right KDA
                </el-col>
                    
                </el-col>
            </el-row>
            <el-row>
                <hr>
                <!-- <el-button @click='_("clearMaster",1)'>clear Master</el-button>
                                                                                                                                                                                                    <el-button @click='_("clearMaster",0)'>clear All</el-button> -->
                滚动文字：
                <el-input v-model="inputRollText" style="width:250px"></el-input>
                <el-button @click='_("showRollText",inputRollText)'>发送</el-button>
                <el-button @click='_("showRollText",inputRollText,false)'>隐藏</el-button>
                <br>
                <el-button @click='_("showLastPlayerRoute",true)'>上一场球员下一场</el-button>
                <br>
                <el-button @click='_("showGameProcess",true,"lose2")'>败者组 2</el-button>
                <br>
                <el-button @click='_("showImg",true,"bd1")'>媒体1</el-button>
                <el-button @click='_("showImg",true,"bd2")'>媒体2</el-button>
                <el-button @click='_("showImg",false,"bd1")'>隐藏媒体1</el-button>
                <hr>
                <el-button @click='_("setGameInfo",3)'>setGameInfo 3</el-button>
                <el-button @click='_("setGameInfo",5)'>setGameInfo 5</el-button>
                <br>
                <br>
                <el-button @click='_("showGamePlayerInfo",true)'>show Victory</el-button>
                <el-button @click='_("showGamePlayerInfo",false)'>hide Victory</el-button>
                <br>
                <el-button @click='_("initBracket")'>initBracket Data</el-button>
                <br>
                <el-input v-model="inputVS" placeholder="a1 a2" style="width:90px"></el-input>
                <el-button @click='_("setVS",inputVS)'>修改对阵</el-button>
                <el-button @click='_("newGame",inputVS)'>创建比赛</el-button>
                <br>
                <el-input v-model="inputScore" placeholder="3 1" style="width:90px"></el-input>
                <el-button @click='_("setScore",inputScore)'>修改比分</el-button>
                <el-button @click='_("setBlood",inputScore)'>修改初始血</el-button>
            </el-row>
            <el-row>
                <hr>
                       <li v-for='(team,idx) in teamArr' v-bind:key="idx">
                     <span v-for='(p,idx) in team.playerArr' v-bind:key="idx">
                         {{p.name}} 
                        <el-input v-model="p.blood" style="width:35px"></el-input>
                     </span>
                        </li>
                <el-button @click='_("savePlayer")'>更新血量</el-button>
                <el-button @click='_("savePlayer")'>更新血量</el-button>
                <el-button @click='_("savePlayer")'>更新血量</el-button>
                <el-button @click='_("syncPlayer")'>下载球员数据</el-button>
            </el-row>
            <el-row>
                <hr>
                <a href="/panel.html?panel=f2"> /panel.html?panel=f2</a>
                <br>
            </el-row>
            <el-row>
                <el-button @click='_("dumpPlayer",inputRollText)'>dump player</el-button>
            </el-row>
        </el-col>
        <!--<iframe class='preview' id='panelPreview' src='/dev/panel.html'></iframe>-->
    </div>
</template>
<style>
#drop_zone {
  border: 2px dashed #bbb;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  font: 20pt bold "Vollkorn";
  color: #bbb;
}
</style>

<script>
import LiveDataView from "../livedata/livedataView";

let livedataView = new LiveDataView();
let _data;

import Final2TeamView from "./Final2TeamView";
let finalView = new Final2TeamView(livedataView);
livedataView.appendProp(finalView);
_data = finalView;

let hasFileHandle = false;
export default {
  data() {
    return _data;
  },
  created() {
    livedataView.$vm = this;
  },
  methods: {
    _: (e, ...param) => {
      livedataView._(e, param);
    },
    rowClick(row, event, col) {
      this._("getGameInfo", row, event, col);
    }
  }
};
</script>