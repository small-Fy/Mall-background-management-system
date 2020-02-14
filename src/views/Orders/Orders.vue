<template>
<div class="orders">
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="contain">
        <el-card class="box-card">
            <div class="top">
                <div class="search">
                    <el-input placeholder="请输入搜索内容" v-model="query" class="input-with-select" @change="enterSearch" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="btnSearch"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="userList">
                <el-table :data="orderList" border style="width: 100%">
                    <el-table-column label="#" type="index" align="center">
                    </el-table-column>
                    <el-table-column prop="order_number" label="订单编号" align="center">
                    </el-table-column>
                    <el-table-column prop="order_price" label="订单价格" align="center">
                    </el-table-column>
                    <el-table-column label="是否付款" align="center">
                        <template slot-scope="scope">
                            <div class="tag">
                                <el-tag type="danger" v-if="orderList[scope.$index].pay_status==='0'">已支付</el-tag>
                                <el-tag type="danger" v-else>未支付</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="is_send" label="是否发货" align="center">
                    </el-table-column>
                    <el-table-column prop="create_time" label="下单时间" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template>
                            <div class="btns">
                                <el-tooltip class="item" effect="dark" content="编辑地址" placement="top">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="clickEdit"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="查询物流" placement="top">
                                    <el-button type="success" icon="el-icon-location-outline" size="mini" @click="clickOdd"></el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
    <el-dialog title="物流信息" :visible.sync="logisticsFlag" width="30%" :show-close="true" :modal="false">
        <span>
            <el-timeline :reverse="true">
                <el-timeline-item v-for="(item, index) in logisticsList" :key="index" :timestamp="item.ftime">
                    {{item.context}}
                </el-timeline-item>
            </el-timeline>
        </span>
    </el-dialog>
    <el-dialog title="编辑地址" :visible.sync="editFlag" width="38%" :show-close="true" :modal="false">
        <span>
            <el-cascader v-model="value" :options="arrList" style="width:100%"></el-cascader>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {regionData, CodeToText, TextToCode} from 'element-china-area-data'
export default {
    data() {
        return {
            // 搜索关键词
            query: '',
            // 页码
            pagenum: 1,
            // 每页多少条
            pagesize: 10,
            // 用户总数
            total: 0,
            // 是否显示编辑
            editFlag: false,
            // 是否显示物流
            logisticsFlag: false,
            // 中国城市列表
            arrList: regionData,
            // 订单
            orderList: [],
            // 物流信息
            logisticsList: [],
            // 供测试的物流单号
            oddNum: [1106975712662, 804909574412544600],
            value: [],
        }
    },
    components: {

    },
    methods: {
        // 点击编辑
        clickEdit() {
            this.editFlag = true
        },
        // 点击物流查询
        clickOdd() {
            this.logisticsFlag = true
            // 先清空上一次的物流信息，避免对话框刚加载完时会有一瞬间显示的信息是上一次的
            this.logisticsList = []
            let index = parseInt(Math.random());
            // diolog加载完成后再获取物流信息
            this.$nextTick(() => {
                this.showLogistics(this.oddNum[index])
            })
        },
        // 回车搜索
        enterSearch() {
            this.getOrders(this.query, this.pagenum, this.pagesize)
        },
        // 点击搜索按钮
        btnSearch() {
            this.getOrders(this.query, this.pagenum, this.pagesize)
        },
        // 切换每页数据数量
        handleSizeChange(val) {
            this.pagesize = val
            this.getOrders(this.query, this.pagenum, this.pagesize)
        },
        // 切换页码
        handleCurrentChange(val) {
            this.pagenum = val
            this.getOrders(this.query, this.pagenum, this.pagesize)
        },
        changeState(index) {
            console.log(index)
        },
        // 获取订单列表
        async getOrders(query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr) {
            try {
                let res = await this.$api.getOrders(query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr);
                if (res.meta.status === 200) {
                    res.data.goods.map(item => {
                        item.create_time = this.$dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.orderList = res.data.goods
                    this.total = res.data.total
                }
                console.log(res, 666);
            } catch (e) {
                console.log(e);
            }
        },
        // 物流详情
        async showLogistics(id) {
            try {
                let res = await this.$api.showLogistics(id);
                if (res.meta.status === 200) {
                    this.logisticsList = res.data
                }
            } catch (e) {
                console.log(e);
            }
        }
    },
    mounted() {
        this.getOrders(this.query, this.pagenum, this.pagesize)
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.orders {
    .title {
        margin: 20px 0 30px 0;
    }

    .contain {
        .top {
            display: flex;
            align-items: center;
            margin-bottom: 30px;

            .search {
                width: 30%;
                height: 40px;
                margin-right: 20px;
            }
        }

        .userList {
            .btns {
                display: flex;
                justify-content: space-around;
            }
        }

        .pagination {
            margin-top: 30px;
        }
    }
}
</style>
