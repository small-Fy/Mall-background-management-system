<template>
<div class="permissions">
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="contain">
        <el-card class="box-card">
            <div class="permissionsList">
                <el-table :data="perList" border stripe style="width: 100%">
                    <el-table-column label="#" type="index" align="center">
                    </el-table-column>
                    <el-table-column prop="authName" label="权限名称" align="center">
                    </el-table-column>
                    <el-table-column label="权限等级" align="center">
                        <template slot-scope="scope">
                            <div class="tags">
                                <el-tag type="success" v-if="perList[scope.$index].level==='0'">一级</el-tag>
                                <el-tag type="info" v-if="perList[scope.$index].level==='1'">二级</el-tag>
                                <el-tag type="danger" v-if="perList[scope.$index].level==='2'">三级</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 权限列表
            perList: []
        }
    },
    components: {

    },
    methods: {
        // 获取权限列表
        async allPer() {
            try {
                let res = await this.$api.allPer('list');
                if (res.meta.status === 200) {
                    this.perList = res.data
                }
                console.log(res, 777);
            } catch (e) {
                console.log(e);
            }
        }
    },
    mounted() {
        this.allPer()
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.permissions {
    .title {
        margin: 20px 0 30px 0;
    }

    .contain {

        .permissionsList {
          .tags{
            display: flex;
            justify-content: center;
          }
        }
    }
}
</style>
