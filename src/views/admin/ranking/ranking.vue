<template>
    <div>
        <el-col :span='12'>
            <el-table stripe :data="lastRanking" style="width: 100%" v-bind:key="lastRanking" @row-click='rowClick'>
                <el-table-column prop="ranking" label="#" width="60">
                    <template scope="scope">
                        {{ scope.$index+1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名" width="150"></el-table-column>
                <el-table-column prop="activity" label="活" width="60"></el-table-column>
                <el-table-column prop="champion" label="冠" width="60">
                    <template scope="scope">
                        <span v-bind:class="{isChampion: (scope.row.champion > 0)}">{{ scope.row.champion }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="beatCount" label="斩" width="80"></el-table-column>
                <el-table-column label="斩%" width="80">
                    <template scope="scope">
                        {{Math.floor(scope.row.avgZen * 100)}}%
                    </template>
                </el-table-column>
                <el-table-column label="RW" width="80">
                    <template scope="scope">
                        {{Math.floor(scope.row.realWeight * 100)}}
                    </template>
                </el-table-column>
                <el-table-column prop="winRaito" label="胜%" width="85">
                    <template scope="scope">
                        {{Math.floor(scope.row.winRaito * 100)}}%
                    </template>
                </el-table-column>
                <el-table-column prop="player_id" label="pid" width="80"></el-table-column>
            </el-table>
        </el-col>
        <el-col :span='8'>
            <div>
                <el-input v-model='inputLimit' style="width:50px"></el-input>
                <el-button @click='_("reMergeRank",inputLimit)'>mergeRank</el-button>
                <br> query:
                <el-input v-model='inputQuery' style="width:250px"></el-input>
                <el-button @click='_("queryPlayer",inputQuery)'>queryPlayer</el-button>
                <el-button @click='_("fixActivity")'>fixActivity</el-button>
                <el-button @click='_("showRelation",inputQuery)'>交手关系</el-button>
                <el-button @click='_("mergeNext")'>next</el-button>
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
        rowClick(row, event, col) {
            // this._('getGameInfo', row, event, col)
        }
    }
}
</script>
<style>
.isChampion {
    color: blue;
    font-weight: bold;
}
</style>


