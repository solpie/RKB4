<template>
    <div>
        <el-col :span='12'>
            <el-table stripe :data="lastRanking" style="width: 100%" v-bind:key="lastRanking" @row-click='rowClick' :row-style="rowClass">
                <el-table-column prop="ranking" label="#" width="60">
                    <template scope="scope">
                        {{ scope.$index+1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="bestRanking" label="最" width="80"></el-table-column>
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
        </el-col>
        <el-col :span='8'>
            <div>
                第{{lastGameidx+1}}站 {{gameInfo.id}} {{gameInfo.game_start.split(' ')[0]}} :{{gameInfo.title}}
                <br>
                <el-input v-model='inputLimit' style="width:50px"></el-input>
                <el-button @click='_("reMergeRank",inputLimit)'>mergeRank</el-button>
                <br> query:
                <el-input v-model='inputQuery' style="width:250px"></el-input>
                <el-button @click='_("queryPlayer",inputQuery)'>queryPlayer</el-button>
                <el-button @click='_("fixActivity")'>fixActivity</el-button>
                <el-button @click='_("mergeNext")'>next</el-button>
            </div>
            selected:
            <span class="curPlayer">{{curPlayer.name}}</span>
            <br>
            <el-button @click='_("rankMove",-1)'>up</el-button>
            <el-button @click='_("rankMove",1)'>down</el-button>
            <br>
            <el-button @click='_("showRelation",inputQuery)'>交手关系</el-button>
            {{inputRelationPlayerArr[0].name}} x {{inputRelationPlayerArr[1].name}}
            <el-table stripe :data="relationArr" style="width: 100%;height:450px" v-bind:key="lastRanking" @row-click='rowClick'>
            </el-table>
            <el-button @click='_("loadRank","s2")'>load s2</el-button>
            <el-button @click='_("fixRank","s2")'>fix s2</el-button>
            <el-button @click='_("saveRank","s3")'>save s2</el-button>
            <el-button @click='_("saveRank","s3")'>save s3</el-button>
            <div>
            </div>
        </el-col>
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
    },
    methods: {
        _: (e, ...param) => {
            rankingView._(e, param)
        },
        rowClass(row, index) {
            if (rankingView.rowColorMap[row.player_id])
                return { "background-color": rankingView.rowColorMap[row.player_id].color }
            if (row.player_id == rankingView.curPlayer.player_id)
                return { "animation": 'blinker 1s linear infinite' }
        },
        rowClick(row, event, col) {
            this._('setRelation', row)
        }
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


