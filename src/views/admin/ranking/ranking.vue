<template>
    <div>
        <el-col :span='12'>
            <el-collapse>
                <el-collapse-item title="实力榜" name="1">
                    <el-table stripe :data="lastRanking" style="width: 100%" v-bind:key="lastRanking" @row-click='rowClick' :row-style="rowClass">
                        <el-table-column prop="ranking" label="#" width="120">
                            <template scope="scope">
                                {{ scope.$index+1 +curPage*100 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名" width="150"></el-table-column>
                        <el-table-column prop="activity" label="活" width="60"></el-table-column>
                        <el-table-column prop="runnerUp" label="亚" width="60"></el-table-column>
                        <el-table-column prop="champion" label="冠" width="60">
                            <template scope="scope">
                                <span v-bind:class="{isChampion: (scope.row.champion > 0)}">{{ scope.row.champion }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="reward" label="金" width="80"></el-table-column>
                        <el-table-column prop="beatCount" label="斩" width="80"></el-table-column>
                        <el-table-column label="斩%" width="80">
                            <template scope="scope">
                                {{Math.floor(scope.row.avgZen * 100)}}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="winRaito" label="胜%" width="85">
                            <template scope="scope">
                                {{Math.floor(scope.row.winRaito * 100)}}%
                            </template>
                        </el-table-column>
                        <el-table-column label="RW" width="80">
                            <template scope="scope">
                                {{Math.floor(scope.row.realWeight * 100)}}%
                            </template>
                        </el-table-column>
                        <el-table-column label="zenRW%" width="120">
                            <template scope="scope">
                                {{Math.floor(scope.row.zenRealWeight * 10000)}}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="player_id" label="pid" width="80"></el-table-column>
                    </el-table>
                </el-collapse-item>
                <el-collapse-item title="统帅榜" name="2">
                    <el-table stripe :data="lastTongzhiRanking" style="width: 100%" @row-click='rowClick'>
                        <el-table-column prop="ranking" label="#" width="60">
                            <template scope="scope">
                                {{ scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名" width="150"></el-table-column>
                        <el-table-column prop="lastRanking" label="ranking" width="150"></el-table-column>
                        <el-table-column label="奖" width="150">
                            <template scope="scope">
                                {{ scope.row.rewardFactor*(500-10*scope.$index) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="rewardFactor" label="foc" width="80"></el-table-column>
                        <el-table-column label="rankReward" width="150">
                            <template scope="scope">
                                {{ 500-10*scope.$index }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="vHeima" label="黑马" width="150"></el-table-column>
                        <el-table-column prop="vTuLong" label="屠龙" width="150"></el-table-column>
                        <el-table-column prop="masterCon" label="控场" width="150"></el-table-column>
                        <el-table-column prop="vTongZhiLi" label="统治力" width="150">
                            <!-- <template scope="scope">
                                                                    {{ scope.row.vTongZhiLi }}
                                                                </template> -->
                        </el-table-column>
                        <el-table-column prop="activity" label="活" width="60"></el-table-column>
                        <el-table-column prop="age" label="年龄" width="60"></el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </el-col>
        <el-col :span='8'>
            <div>
                第{{lastGameidx+1}}站 {{gameInfo.id}} {{gameInfo.game_start?gameInfo.game_start.split(' ')[0]:''}} :{{gameInfo.title}}
                <br>
                <el-input v-model='inputLimit' style="width:50px"></el-input>
                <el-button @click='_("reMergeRank",inputLimit)'>mergeRank</el-button>
                <el-button @click='_("mergeNext")'>next</el-button>
                <br> query:
                <el-input v-model='inputQuery' style="width:250px"></el-input>
                <el-button @click='_("queryPlayer",inputQuery)'>queryPlayer</el-button>
                <el-button @click='_("fixActivity",-1)'>layer</el-button>
                <el-button @click='_("fixActivity",3)'>fixActivity 3</el-button>
                <el-button @click='_("fixActivity",2)'>fixActivity 2</el-button>
            </div>
            selected:
            <span class="curPlayer">{{curPlayer.name}}</span>
            <br>
            <el-button @click='_("fixRelation","fixed",inputQuery)'>fix rank</el-button>
            <el-button @click='_("rankMove",-1)'>up</el-button>
            <el-button @click='_("rankMove",1)'>down</el-button>
            <el-button @click='_("page",-1)'>pre page</el-button>
            <el-button @click='_("page",1)'>next page</el-button>
            <br>
            <el-button @click='_("showRelation",inputQuery)'>交手关系</el-button>
            {{inputRelationPlayerArr[0].name}} x {{inputRelationPlayerArr[1].name}}
            <el-table stripe :data="relationArr" style="width: 100%;height:450px" v-bind:key="lastRanking" @row-click='rowClick'>
            </el-table>
            <el-button @click='_("loadRank","s2")'>load s2</el-button>
            <el-button @click='_("fixRank","s3")'>fix by s3</el-button>
            <!-- <el-button @click='_("saveRank","s2")'>save s2</el-button> -->
            <el-button @click='_("loadRank","s3")'>load s3</el-button>
            <el-button @click='_("mergeRank","s3")'>merge s3</el-button>
            <el-button @click='_("mergeRank","s2")'>merge s2</el-button>
            <el-button @click='_("saveRank","s3")'>save s3</el-button>
            <div>
                <hr>
                <el-button @click='_("genBattle",inputQuery)'>battle</el-button>
                <el-button @click='_("nextBattle")'>next</el-button>
                <el-button @click='_("showCollectionRanking","tongzhili")'>统治力榜</el-button>
                <el-button @click='_("showCollectionRanking","heima")'>黑马榜</el-button>
                <el-button @click='_("showCollectionRanking","tulong")'>屠龙榜</el-button>
                <el-button @click='_("showCollectionRanking","masterCon")'>控场</el-button>
                <br> {{cview.curDate}}
                <br> 激活球员数:{{activePlayerCount}}
                <br> 产生收益球员数:{{rewardPlayerCount}}
                <br> 橙卡:{{cview.m.sectionCountArr[4]}} /{{cview.m.qualityCountArr[4]}}
                <br> 紫卡:{{cview.m.sectionCountArr[3]}} /{{cview.m.qualityCountArr[3]}}
                <br> 蓝卡:{{cview.m.sectionCountArr[2]}} /{{cview.m.qualityCountArr[2]}}
                <br> 绿卡:{{cview.m.sectionCountArr[1]}} /{{cview.m.qualityCountArr[1]}}
                <br> 白卡:{{cview.m.sectionCountArr[0]}} /{{cview.m.qualityCountArr[0]}}
                <br> 黑马榜收益球员：{{cview.m.heimaRanking.length}}
                <br> 屠龙收益球员：{{cview.m.tuLongRanking.length}}
    
            </div>
        </el-col>
        <el-dialog title="Tips" size="tiny">
            <span>This is a message</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { RankingView } from './rankingView';
let rankingView = new RankingView()

export default {
    data() {
        return rankingView
    },
    created() {
        rankingView.$vm = this
    },
    methods: {
        _: (e, ...param) => {
            rankingView._(e, param)
        },
        rowClass(row, index) {
            let pid = row.player_id
            let sum;
            let color;
            if (rankingView.rowColorMap[pid]) {
                sum = rankingView.rowColorMap[pid]
                if (sum > 0.4) {
                    color = 'green' //绝对赢
                }
                else if (sum > -0.4) {
                    color = 'yellow'
                }
                else {
                    color = 'red'
                }
                return { "background-color": color }
            }
            if (row.player_id == rankingView.curPlayer.player_id)
                return { "animation": 'blinker 1s linear infinite' }
        },
        rowClick(row, event, col) {
            this._('setRelation', row)
        },
    }
}
</script>
<style>
.isChampion {
    color: blue;
    font-weight: bold;
}

.curPlayer {
    animation: blinker 1s linear infinite;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
}
</style>


