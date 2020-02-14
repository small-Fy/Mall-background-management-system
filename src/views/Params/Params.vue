<template>
<div class="params">
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="contain">
        <el-card class="box-card">
            <div class="notice">
                <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false">
                </el-alert>
            </div>
            <div class="select">
                <div class="text">选择商品分类:</div>
                <div class="select-box">
                    <el-cascader v-model="value" :options="catList" :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }" @change="handleChange"></el-cascader>
                </div>
            </div>
            <div class="tabs">
                <el-tabs v-model="sel" @tab-click="handleClick">
                    <el-tab-pane label="动态参数" name="many">
                        <el-button type="primary" size="mini" @click="clickAdd('many')">添加参数</el-button>
                        <el-table :data="parList" style="width: 100%;margin-top:15px;">
                            <el-table-column label="#" width="40" type="index" align="center">
                            </el-table-column>
                            <el-table-column prop="attr_name" label="参数名称" width="600" align="center">
                            </el-table-column>
                            <el-table-column label="操作" width="560" align="center">
                                <template slot-scope="scope">
                                    <div class="btns">
                                        <el-tooltip class="item" effect="dark" content="编辑参数" placement="top">
                                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="clickEdit(scope.$index)">编辑</el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="删除参数" placement="top">
                                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="clickDel(scope.$index)">删除</el-button>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="静态属性" name="only">
                        <el-button type="primary" size="mini" @click="clickAdd('only')">添加属性</el-button>
                        <el-table :data="parList" border style="width: 100%;margin-top:15px;">
                            <el-table-column label="#" type="index" align="center">
                            </el-table-column>
                            <el-table-column prop="attr_name" label="参数名称" align="center">
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <div class="btns">
                                        <el-tooltip class="item" effect="dark" content="编辑属性" placement="top">
                                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="clickEdit(scope.$index)">编辑</el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content="删除属性" placement="top">
                                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="clickDel(scope.$index)">删除</el-button>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
    <el-dialog title="修改动态参数" :visible.sync="editManyFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="editPar" ref="editPar" label-width="100px" class="demo-ruleForm">
                <el-form-item label="动态参数" prop="attr_name" :rules="[{ required: true}]">
                    <el-input type="text" v-model="editPar.attr_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editManyFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="修改静态属性" :visible.sync="editOnlyFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="editPar" ref="editPar" label-width="100px" class="demo-ruleForm">
                <el-form-item label="静态属性" prop="attr_name" :rules="[{ required: true}]">
                    <el-input type="text" v-model="editPar.attr_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editOnlyFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="添加动态参数" :visible.sync="addManyFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="addPar" ref="addPar" label-width="100px" class="demo-ruleForm">
                <el-form-item label="动态参数" prop="attr_name" :rules="[{ required: true}]">
                    <el-input type="text" v-model="addPar.attr_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addManyFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="添加静态属性" :visible.sync="addOnlyFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="addPar" ref="addPar" label-width="100px" class="demo-ruleForm">
                <el-form-item label="静态属性" prop="attr_name" :rules="[{ required: true}]">
                    <el-input type="text" v-model="addPar.attr_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addOnlyFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 动态属性或者静态属性
            sel: "many",
            // 分类id
            catId: 0,
            // 选择分类返回的数据
            value: [],
            // 商品分类数据列表
            catList: [],
            // 参数列表
            parList: [],
            // 用于修改的对象
            editPar: {},
            // 用于增加的对象
            addPar: {
                id:0,
                attr_name:'',
                attr_sel:'',
                attr_vals:""
            },
            // 是否显示动态参数框
            editManyFlag: false,
            // 是否显示静态属性框
            editOnlyFlag: false,
            // 是否显示动态参数框
            addManyFlag: false,
            // 是否显示静态属性框
            addOnlyFlag: false,
        }
    },
    components: {

    },
    methods: {
        // 确认添加属性或参数
        confirmAdd(){
            if(this.sel==='many'){
                this.addManyFlag=false
                this.addParameter(this.addPar.id, this.addPar.attr_name, this.addPar.attr_sel, this.addPar.attr_vals)
            }else{
                this.addOnlyFlag=false
                this.addParameter(this.addPar.id, this.addPar.attr_name, this.addPar.attr_sel, this.addPar.attr_vals)
            }
        },
        // 点击添加
        clickAdd(sel){
            if (sel === 'many') {
                this.addManyFlag = true
            } else {
                this.addOnlyFlag = true
            }
            this.addPar.attr_sel=sel
            this.addPar.id=this.catId
        },
        // 点击删除
        clickDel(index) {
            this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: false
            }).then(() => {
                this.delParameter(this.parList[index].cat_id, this.parList[index].attr_id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 点击编辑
        clickEdit(index) {
            this.editPar = this.parList[index]
            if (this.editPar.attr_sel === 'many') {
                this.editManyFlag = true
            } else {
                this.editOnlyFlag = true
            }
        },
        // 确认编辑参数
        confirmEdit() {
            if (this.editPar.attr_sel === 'many') {
                this.editManyFlag = false
                console.log(111)
            } else {
                this.editOnlyFlag = false
            }
            this.geteditParameterCat(this.editPar.cat_id, this.editPar.attr_id, this.editPar.attr_name, this.editPar.attr_sel, this.editPar.attr_vals)
        },
        // 选择分类
        handleChange(value) {
            this.catId = Number(value.slice(-1).toString())
            this.addPar.attr_vals = this.value.toString()
            this.getParameter()
        },
        // 选择动态参数或者静态参数
        handleClick(event) {
            this.sel = event.name
            this.getParameter()
        },
        // 获取商品分类数据列表
        async getCat() {
            try {
                let res = await this.$api.getCat();
                if (res.meta.status === 200) {
                    this.catList = res.data
                }
                console.log(res, 777);
            } catch (e) {
                console.log(e);
            }
        },
        // 获取参数列表
        async getParameter() {
            try {
                let res = await this.$api.getParameter(
                    this.catId,
                    this.sel
                );
                if (res.meta.status === 200) {
                    this.parList = res.data
                }
                console.log(res, 222);
            } catch (e) {
                console.log(e);
            }
        },
        // 编辑参数
        async geteditParameterCat(id, attrid, attr_name, attr_sel, attr_vals) {
            try {
                let res = await this.$api.editParameter(id, attrid, attr_name, attr_sel, attr_vals);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 删除参数
        async delParameter(id, attrid) {
            try {
                let res = await this.$api.delParameter(id, attrid);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getParameter()
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 添加参数
        async addParameter(id, attr_name, attr_sel, attr_vals) {
            try {
                let res = await this.$api.addParameter(id, attr_name, attr_sel, attr_vals);
                if (res.meta.status === 201) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getParameter()
                }
            } catch (e) {
                console.log(e);
            }
        }
    },
    mounted() {
        this.getCat()
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.params {
    .title {
        margin: 20px 0 30px 0;
    }

    .notice {
        margin-bottom: 20px;
    }

    .select {
        display: flex;
        align-items: center;

        .text {
            font-size: 18px;
            font-weight: 500;
            margin-right: 20px;
        }
    }
}
</style>
