<template>
    <div>
        <el-table stripe :data="lastRanking" style="width: 100%" @row-click='rowClick'>
            <el-table-column prop="ranking" label="#" width="60"></el-table-column>
            <el-table-column prop="name" label="名" width="100"></el-table-column>
            <el-table-column prop="activity" label="活" width="120"></el-table-column>
            <el-table-column prop="champion" label="冠" width="80"></el-table-column>
        </el-table>
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

