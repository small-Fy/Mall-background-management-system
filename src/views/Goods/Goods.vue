<template>
<div class="user">
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
                <div class="add-user">
                    <el-button type="primary" size="medium" @click="clickAdd">添加商品</el-button>
                </div>
            </div>
            <div class="userList">
                <el-table :data="goods" style="width: 100%">
                    <el-table-column label="#" type="index" align="center">
                    </el-table-column>
                    <el-table-column prop="goods_name" label="商品名称" align="center">
                    </el-table-column>
                    <el-table-column prop="goods_price" label="商品价格(元)" align="center">
                    </el-table-column>
                    <el-table-column prop="goods_weight" label="商品重量" align="center">
                    </el-table-column>
                    <el-table-column prop="add_time" label="创建时间" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <div class="btns">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="clickEdit(scope.$index)"></el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="clickDel(scope.$index)"></el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 30, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
    <el-dialog title="编辑商品" :visible.sync="editFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="editGoods" ref="editGoods" label-width="100px" class="demo-ruleForm">
                <el-form-item label="商品名称" prop="goods_name" :rules="[{ required: true}]">
                    <el-input type="text" v-model="editGoods.goods_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price" :rules="[{ required: true}]">
                    <el-input type="number" v-model="editGoods.goods_price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number" :rules="[{ required: true}]">
                    <el-input type="number" v-model="editGoods.goods_number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight" :rules="[{ required: true}]">
                    <el-input type="number" v-model="editGoods.goods_weight" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 搜索关键词
            query: '',
            // 页码
            pagenum: 1,
            // 每页多少条
            pagesize: 10,
            // 商品总数
            total: 0,
            // 商品
            goods: [],
            // 是否编辑商品
            editFlag: false,
            // 被编辑的商品
            editGoods: {},
        }
    },
    components: {

    },
    methods: {
        // 点击编辑
        clickEdit(index) {
            this.editFlag = true
            this.editGoods = this.goods[index]
        },
        // 确认编辑商品
        confirmEdit() {
            this.editFlag = false
            this.goods.map(item => {
                if (item.goods_id === this.editGoods.goods_id) {
                    item = this.editGoods
                    this.$message({
                        message: '编辑商品成功',
                        type: 'success'
                    });
                }
            })
        },
        // 点击删除
        clickDel(index) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: false
            }).then(() => {
                this.delGoods(this.goods[index].goods_id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 点击添加用户
        clickAdd() {
            this.$router.push("/addGoods")
        },
        // 切换每页数据数量
        handleSizeChange(val) {
            this.pagesize = val
            this.getGoods(this.query, this.pagenum, this.pagesize)
        },
        // 切换页码
        handleCurrentChange(val) {
            this.pagenum = val
            this.getGoods(this.query, this.pagenum, this.pagesize)
        },
        // 点击搜索按钮
        btnSearch() {
            this.getUser(this.pagenum, this.pagesize, this.query)
        },
        // 回车搜索
        enterSearch() {
            this.getUser(this.pagenum, this.pagesize, this.query)
        },
        // 获取商品列表
        async getGoods(query, pagenum, pagesize) {
            try {
                let res = await this.$api.getGoods(query, pagenum, pagesize);
                if (res.meta.status === 200) {
                    res.data.goods.map(item => {
                        item.add_time = this.$dayjs(item.add_time).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.goods = res.data.goods
                    this.total = res.data.total
                }
                console.log(res, 666);
            } catch (e) {
                console.log(e);
            }
        },
        // 删除商品
        async delGoods(id) {
            try {
                let res = await this.$api.delGoods(id);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getGoods(this.query, this.pagenum, this.pagesize)
                }
            } catch (e) {
                console.log(e);
            }
        },
    },
    mounted() {
        this.getGoods(this.query, this.pagenum, this.pagesize)
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.user {
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
