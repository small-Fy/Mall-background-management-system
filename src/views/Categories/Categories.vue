<template>
<div class="categories">
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="contain">
        <el-card class="box-card">
            <div class="btn">
                <el-button type="primary" @click="clickAdd">添加分类</el-button>
            </div>
            <div class="table">
                <zk-table ref="table" sum-text="sum" index-text="#" :data="catList" :columns="columns" :stripe="props.stripe" :border="props.border" :show-header="props.showHeader" :show-summary="props.showSummary" :show-row-hover="props.showRowHover" :show-index="props.showIndex" :tree-type="props.treeType" :is-fold="props.isFold" :expand-type="props.expandType" :selection-type="props.selectionType">
                    <template slot="sort" slot-scope="scope">
                        <div class="sort">
                            <el-tag type="" v-if="scope.row.cat_level===0">一级</el-tag>
                            <el-tag type="success" v-if="scope.row.cat_level===1">二级</el-tag>
                            <el-tag type="danger" v-if="scope.row.cat_level===2">三级</el-tag>
                        </div>
                    </template>
                    <template slot="effective">
                        <div class="effective">
                            <i class="el-icon-success" style="color:skyblue"></i>
                        </div>
                    </template>
                    <template slot="operation" slot-scope="scope">
                        <div class="operation">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="clickEdit(scope.row)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="clickDel(scope.row)">删除</el-button>
                        </div>
                    </template>
                </zk-table>
            </div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
    <el-dialog title="编辑分类" :visible.sync="editFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="editCat" ref="editCat" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name" :rules="[{ required: true}]">
                    <el-input type="text" v-model="editCat.cat_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="添加分类" :visible.sync="addFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="addCat" ref="addCat" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name" :rules="[{ required: true}]">
                    <el-input type="text" v-model="addCat.cat_name" autocomplete="off" @input="inputMsg"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" prop="cat_name">
                    <el-cascader v-model="value" :disabled="cascaderFlag" :options="catList" :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }" @change="handleChange" style="width:100%;"></el-cascader>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 选择分类返回的数据
            value: [],
            // 页码
            pagenum: 1,
            // 每页多少条
            pagesize: 5,
            // 几层
            type: 3,
            // 分类总数
            total: 0,
            // 分类数据
            catList: [],
            // 被编辑的分类对象
            editCat: {},
            // 被编辑分类的id
            catId: 0,
            // 是否点击编辑
            editFlag: false,
            // 是否点击添加
            addFlag: false,
            // 被添加的分类对象
            addCat: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
            },
            // 是否可点击级联框
            cascaderFlag:true,
            // 表格样式参数
            props: {
                stripe: false,
                border: true,
                showHeader: true,
                showSummary: false,
                showRowHover: true,
                showIndex: true,
                treeType: true,
                isFold: true,
                expandType: false,
                selectionType: false,
            },
            // 表头参数
            columns: [{
                    label: '分类名称',
                    prop: 'cat_name',
                    headerAlign:'center',
                    align:'center'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'effective',
                    headerAlign:'center'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'sort',
                    headerAlign:'center'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'operation',
                    headerAlign:'center'
                }
            ]
        }
    },
    components: {

    },
    methods: {
        // 输入框输入信息时
        inputMsg(){
            if(this.addCat.cat_name.trim()){
                this.cascaderFlag=false
            }else{
                this.cascaderFlag=true
            }
        },
        // 确认添加分类
        confirmAdd(){
             this.addFlag = false
             this.addCategories(this.addCat.cat_pid, this.addCat.cat_name, this.addCat.cat_level)
        },
        // 取消添加分类
        cancelAdd() {
            this.addFlag = false
        },
        // 选择分类
        handleChange(value) {
            this.addCat.cat_pid = Number(value.slice(-1).toString())
            this.addCat.cat_level=value.length
        },
        // 点击添加
        clickAdd() {
            this.addFlag = true
            this.getCat(this.pagenum, this.pagesize, 2)
        },
        // 确认编辑参数
        confirmEdit() {
            this.editFlag = false
            this.editCategories(this.catId, this.editCat.cat_name)
        },
        // 点击编辑
        clickEdit(row) {
            this.catId = row.cat_id
            this.editCat = row
            this.editFlag = true
        },
        // 点击删除
        clickDel(row) {
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: false
            }).then(() => {
                this.delCat(row.cat_id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 切换每页数据数量
        handleSizeChange(val) {
            this.pagesize = val
            this.getCat(this.pagenum, this.pagesize, this.type)
        },
        // 切换页码
        handleCurrentChange(val) {
            this.pagenum = val
            this.getCat(this.pagenum, this.pagesize, this.type)
        },
        // 获取分类列表
        async getCat(pagenum, pagesize, type) {
            try {
                let res = await this.$api.getCat(pagenum, pagesize, type);
                if (res.meta.status === 200) {
                    this.catList = res.data.result,
                        this.total = res.data.total
                }
                console.log(res, 111);
            } catch (e) {
                console.log(e);
            }
        },
        // 删除分类
        async delCat(id) {
            try {
                let res = await this.$api.delCat(id);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getCat(this.pagenum, this.pagesize, this.type)
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 编辑提交分类
        async editCategories(id, cat_name) {
            try {
                let res = await this.$api.editCat(id, cat_name);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getCat(this.pagenum, this.pagesize, this.type)
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 添加分类
        async addCategories(cat_pid, cat_name, cat_level) {
            try {
                let res = await this.$api.addCat(cat_pid, cat_name, cat_level);
                if (res.meta.status === 201) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getCat(this.pagenum, this.pagesize, this.type)
                }
            } catch (e) {
                console.log(e);
            }
        }
    },
    mounted() {
        this.getCat(this.pagenum, this.pagesize, this.type)
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.categories {
    .title {
        margin: 20px 0 30px 0;
    }

    .contain {
        .box-card {
            .table {
                margin: 20px 0;

                .operation,
                .effective,
                .sort {
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }
}
</style>
