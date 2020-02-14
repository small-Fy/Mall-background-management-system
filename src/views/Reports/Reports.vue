<template>
<div class="reports">
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="contain">
        <el-card class="box-card">
            <div id="box" style="width:700px;height:400px;"></div>
        </el-card>
    </div>
</div>
</template>

<script>
var echarts = require('echarts');
export default {
    data() {
        return {

        }
    },
    components: {

    },
    methods: {
        async showChart() {
            try {
                let res = await this.$api.showChart();
                let myChart = echarts.init(document.getElementById("box"));
                let option = {
                    legend: res.data.legend,
                    //x轴
                    xAxis: res.data.xAxis,
                    //y轴没有显式设置，根据值自动生成y轴
                    yAxis: res.data.yAxis,
                    //数据-data是最终要显示的数据
                    series: res.data.series
                }
                myChart.setOption(option);
            } catch (e) {
                console.log(e);
            }
        },
    },
    mounted() {
        this.showChart()
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.reports {
    .title {
        margin: 20px 0 30px 0;
    }

    .contain {
        height: 400px;
    }
}
</style>
