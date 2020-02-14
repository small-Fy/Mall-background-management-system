<template>
<div class="addGoods">
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="contain">
        <el-card class="box-card">
            <div class="top">
                <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
                </el-alert>
                <div class="step">
                    <el-steps :active="stepIndex" finish-status="success">
                        <el-step :title="item" v-for="(item,index) in stepList" :key="index"></el-step>
                    </el-steps>
                </div>
            </div>
            <div class="inner">
                <el-tabs tab-position="left" style="height:100%" v-model="tabsName" @tab-click="clickTab">
                    <el-tab-pane label="基本信息" name="基本信息">
                        <el-form :model="goodsMsg" ref="goodsMsg" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="商品名称" prop="goods_name" :rules="[{ required: true }]">
                                <el-input type="text" v-model="goodsMsg.goods_name" autocomplete="off" @input="inputMsg" @focus="getIndex(0)"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price" :rules="[{ required: true }]">
                                <el-input type="number" v-model="goodsMsg.goods_price" autocomplete="off" :disabled="fromList[0]" @input="inputMsg" @focus="getIndex(1)"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight" :rules="[{ required: true }]">
                                <el-input type="number" v-model="goodsMsg.goods_weight" autocomplete="off" :disabled="fromList[1]" @input="inputMsg" @focus="getIndex(2)"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number" :rules="[{ required: true }]">
                                <el-input type="number" v-model="goodsMsg.goods_number" autocomplete="off" :disabled="fromList[2]" @input="inputMsg" @focus="getIndex(3)"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类" prop="goods_cat">
                                <el-cascader v-model="value" :options="catList" :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }" :disabled="fromList[3]" @change="handleChange"></el-cascader>
                            </el-form-item>
                        </el-form>
                        <el-button style="margin-left: 98px;" type="success" size="mini" @click="nextStep" v-if="stepFlag">下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="商品参数" :disabled="disabledList[0]">
                        <div class="params" v-if="mParList.length===0">
                            <div class="price big-font">价格</div>
                            <div class="disc">暂无属性</div>
                            <div class="count big-font">数量</div>
                            <div class="disc">暂无属性</div>
                        </div>
                        <div class="params" v-else>
                            <div class="params-item" v-for="(item,index) in mParList" :key="index">
                                <div class="big-font">{{item.attr_name}}</div>
                                <el-tag style="dispay:block;margin:10px 0;">{{item.attr_vals}}</el-tag>
                            </div>
                        </div>
                        <el-button style="margin:10px 0 0 20px;" type="success" size="mini" @click="nextStep" v-if="stepFlag">下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="商品属性" :disabled="disabledList[1]">
                        <div class="attribute" v-if="oParList.length===0">
                            <div class="disc">暂无属性</div>
                        </div>
                        <div class="attribute" v-else>
                            <div class="attribute-item" v-for="(item,index) in oParList" :key="index">
                                <div class="big-font">{{item.attr_name}}</div>
                                <el-input v-model="item.attr_vals" placeholder="" style="margin:10px 0;"></el-input>
                            </div>
                        </div>
                        <el-button style="margin:10px 0 0 20px;" type="success" size="mini" @click="nextStep" v-if="stepFlag">下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="商品图片" :disabled="disabledList[2]">
                        <el-upload class="upload-demo" style="margin: 0 0 20px 20px;" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                        <el-button style="margin-left: 20px;" type="success" size="mini" @click="nextStep" v-if="stepFlag">下一步</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="商品内容" :disabled="disabledList[3]">
                        <mavon-editor v-model="goodsMsg.goods_introduce" ref="md" style="min-height: 300px;margin-left:20px;" />
                        <el-button style="margin:10px 0 0 20px;" type="success" size="mini" @click="confirmAdd" v-if="stepFlag">完成</el-button>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
</div>
</template>

<script>
import {
    mavonEditor
} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    data() {
        return {
            // 标签页名字，用于跳转标签页
            tabsName: "基本信息",
            // 分类级联框
            value: [],
            // 商品分类数据列表
            catList: [],
            // 分类id
            catId: 0,
            // 参数列表(many)
            mParList: [],
            // 参数列表(only)
            oParList: [],
            // 当前步骤索引
            stepIndex: 0,
            // 下一步按钮显示标志
            stepFlag: false,
            // 步骤内容
            stepList: ["基本信息", "商品参数", "商品属性", "商品图片", "商品内容", "完成"],
            // 侧边导航栏是否可选中标志数组
            disabledList: [true, true, true, true],
            // 表单是否可输入标志数组
            fromList: [true, true, true, true],
            // 当前表单索引号
            currentFromIndex: null,
            // 添加商品的各项信息
            goodsMsg: {
                goods_name: "",
                goods_cat: "",
                goods_price: "",
                goods_number: "",
                goods_weight: "",
                goods_introduce: "",
                pics: [],
                attrs: []
            }
        }
    },
    components: {
        mavonEditor
    },
    methods: {
        // 确认添加商品
        confirmAdd() {
            this.goodsMsg.attrs = this.goodsMsg.attrs.concat(this.mParList, this.oParList)
            this.addGoods(this.goodsMsg.goods_name, this.goodsMsg.goods_cat, this.goodsMsg.goods_price, this.goodsMsg.goods_number, this.goodsMsg.goods_weight, this.goodsMsg.goods_introduce, this.goodsMsg.pics, this.goodsMsg.attrs)
        },
        // 点击选项卡时
        clickTab(value) {
            this.stepIndex = Number(value.index)
        },
        // 点击下一步
        nextStep() {
            this.disabledList[this.stepIndex] = false
            this.stepIndex++
            this.tabsName = this.stepList[this.stepIndex]
            if (this.stepIndex === 1) {
                this.getParameter(this.catId, 'many')
            } else if (this.stepIndex === 2) {
                this.getParameter(this.catId, 'only')
            }
            if (this.stepIndex > 4) {
                this.stepIndex = 0
            }
        },
        // 获取当前表单的索引
        getIndex(index) {
            this.currentFromIndex = index
        },
        // 输入商品信息
        inputMsg(value) {
            if (value) {
                this.fromList[this.currentFromIndex] = false
            }else{
                this.fromList[this.currentFromIndex] = true
            }
        },
        // 选择分类
        handleChange(value) {
            this.value = value
            this.catId = Number(value.slice(-1).toString())
            this.goodsMsg.goods_cat = this.value.toString()
            if (this.goodsMsg.goods_cat) {
                this.stepFlag = true
            }
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
        async getParameter(catId, sel) {
            try {
                let res = await this.$api.getParameter(catId, sel);
                if (res.meta.status === 200) {
                    if (sel === 'many') {
                        this.mParList = res.data
                    } else {
                        this.oParList = res.data
                    }
                }
                console.log(res, 123456);
            } catch (e) {
                console.log(e);
            }
        },
        // 添加商品
        async addGoods(goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs) {
            try {
                let res = await this.$api.addGoods(goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs);
                if (res.meta.status === 201) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.$router.push("/goods")
                } else {
                    this.$message({
                        message: res.meta.msg,
                        type: 'warning'
                    });
                }
                console.log(res, 789);
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
.addGoods {
    .title {
        margin: 20px 0 30px 0;
    }

    .contain {
        .top {
            margin: 0 0 20px 120px;

            .step {
                margin-top: 30px;
            }
        }

        .inner {
            .params {
                margin: 10px 0 0 20px;

                .big-font {

                    font-size: 18px;
                    font-weight: 700;
                }

                .disc {
                    font-size: 14px;
                    margin: 20px 0;
                }
            }

            .attribute {
                margin: 10px 0 0 20px;

                .disc {
                    font-size: 14px;
                    margin-bottom: 20px;
                }
            }
        }
    }
}
</style>
