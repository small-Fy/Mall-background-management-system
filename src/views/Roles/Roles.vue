<template>
<div class="roles">
    <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="contain">
        <el-card class="box-card">
            <div class="btn">
                <el-button type="primary" @click="clickAdd">添加角色</el-button>
            </div>
            <div class="rolesList">
                <el-table :data="roleList" border style="width: 100%" @expand-change="expandRow" class="change-width">
                    <el-table-column type="expand" align="center">
                        <template>
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item style="margin-bottom:0;width: 100%;">
                                    <div class="box" v-for="(item,index) in rolPerList" :key="index">
                                        <div class="f-box">
                                            <el-tag :key="perList.authName" closable type="" @close="delTag(item)">
                                                {{item.authName}}
                                            </el-tag>
                                            <i class="el-icon-caret-right" v-if="item.children.length>0"></i>
                                        </div>
                                        <div class="s-box">
                                            <div class="inner-box" v-for="(item1,index1) in item.children" :key="index1">
                                                <div class="left">
                                                    <el-tag :key="item1.authName" closable type="success" @close="delTag(item1)">
                                                        {{item1.authName}}
                                                    </el-tag>
                                                    <i class="el-icon-caret-right" v-if="item1.children.length>0"></i>

                                                </div>
                                                <div class="t-box">
                                                    <div class="i-box" v-for="(item2,index2) in item1.children" :key="index2">
                                                        <el-tag :key="item2.authName" closable type="warning" @close="delTag(item2)">
                                                            {{item2.authName}}
                                                        </el-tag>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="#" type="index" align="center">
                    </el-table-column>
                    <el-table-column prop="roleName" label="职位" align="center">
                    </el-table-column>
                    <el-table-column prop="roleDesc" label="描述" align="center">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <div class="btns">
                                <el-tooltip class="item" effect="dark" content="编辑角色" placement="top">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="clickEdit(scope.$index)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
                                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="clickDel(scope.$index)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
                                    <el-button type="danger" icon="el-icon-setting" size="mini" @click="clickPer(scope.$index)"></el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
    <el-dialog title="分配权限" :visible.sync="disFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-tree :data="perList" ref="tree" show-checkbox node-key="id" default-expand-all :default-checked-keys="perIds" :props="defaultProps" @check="changePer">
            </el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="disFlag = false">取 消</el-button>
            <el-button type="primary" @click="disPer">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="editFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="editRole" ref="editRole" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名" prop="roleName" :rules="[{ required: true}]">
                    <el-input type="text" v-model="editRole.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input type="text" v-model="editRole.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="添加角色" :visible.sync="addFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="editRole" ref="editRole" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名" prop="roleName" :rules="[{ required: true}]">
                    <el-input type="text" v-model="editRole.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input type="text" v-model="editRole.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 当前被点击的角色id，用于分配权限
            roleId: 0,
            // 角色列表
            roleList: [],
            // 权限列表
            perList: [],
            // 某个角色的权限列表
            rolPerList: [],
            // 分配权限
            disFlag: false,
            // 角色的权限id
            perIds: [],
            ids: [],
            // 用于删除角色指定权限时的上传对象
            rolePer: {
                roleId: 0,
                rightId: 0
            },
            // 被编辑或被添加的角色
            editRole: {},
            // 是否编辑角色
            editFlag: false,
            // 是否添加角色
            addFlag: false,
            defaultProps: {
                children: 'children',
                label: 'authName'
            }
        }
    },
    components: {

    },
    methods: {
        // 确认分配权限
        disPer() {
            this.disFlag = false
            let ids = this.ids.toString()
            this.autRoles(this.roleId, ids)
        },
        // 点击标签删除
        delTag(item) {
            this.rolePer.rightId = item.id
            this.delAutRoles(this.rolePer.roleId, this.rolePer.rightId)
        },
        // 确认添加用户
        confirmAdd() {
            this.addFlag = false
            this.addRoles(this.editRole.roleName, this.editRole.roleDesc)
        },
        // 确认编辑用户
        confirmEdit() {
            this.editFlag = false
            this.editRoles(this.editRole.id, this.editRole.roleName, this.editRole.roleDesc)
        },
        // 点击编辑
        clickEdit(index) {
            this.editFlag = true
            this.editRole = this.roleList[index]
        },
        // 点击添加角色
        clickAdd() {
            this.addFlag = true
        },
        // 点击删除
        clickDel(index) {
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: false
            }).then(() => {
                this.delRoles(this.roleList[index].id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 点击展开行时，获取当前行角色的权限列表
        expandRow(row) {
            this.rolePer.roleId = row.id
            this.rolPerList = row.children
        },
        // 单个权限状态发生改变时
        changePer(ev) {
            if (this.ids.indexOf(ev.id) < 0) {
                this.ids.push(ev.id)
                if (ev.children) {
                    if (ev.children.length > 0 && ev.children) {
                        ev.children.map(item => {
                            this.ids.push(item.id)
                            if (item.children) {
                                if (item.children.length > 0 && item.children) {
                                    item.children.map(item1 => {
                                        this.ids.push(item1.id)
                                    })
                                }
                            }
                        })
                    }
                }
            } else {
                this.ids.splice(this.ids.indexOf(ev.id), 1)
                if (ev.children) {
                    ev.children.map(item => {
                        this.ids.splice(this.ids.indexOf(item.id), 1)
                        if (item.children) {
                            item.children.map(item1 => {
                                this.ids.splice(this.ids.indexOf(item1.id), 1)
                            })
                        }
                    })
                }
            }
        },
        // 点击分配权限
        clickPer(index) {
            this.disFlag = true
            this.roleId = this.roleList[index].id
            this.ids = []
            this.perIds = []
            this.roleList[index].children.map(item1 => {
                if (this.ids.indexOf(item1.id) < 0) {
                    this.ids.push(item1.id)
                }
                if (item1.children.length > 0) {
                    item1.children.map(item2 => {
                        if (this.ids.indexOf(item2.id) < 0) {
                            this.ids.push(item2.id)
                        }
                        if (item2.children.length > 0) {
                            item2.children.map(item3 => {
                                if (this.ids.indexOf(item3.id) < 0) {
                                    this.ids.push(item3.id)
                                }
                                if (this.perIds.indexOf(item3.id) < 0) {
                                    this.perIds.push(item3.id)
                                }

                            })
                        }
                    })
                }
            })
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(this.perIds)
            })
        },
        // 获取权限列表
        async allPer() {
            try {
                let res = await this.$api.allPer('tree');
                if (res.meta.status === 200) {
                    this.perList = res.data
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 获取角色列表
        async getRoles() {
            try {
                let res = await this.$api.getRoles();
                if (res.meta.status === 200) {
                    this.roleList = res.data
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 删除角色
        async delRoles(id) {
            try {
                let res = await this.$api.delRoles(id);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getRoles()
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 编辑角色
        async editRoles(id, roleName, roleDesc) {
            try {
                let res = await this.$api.editRoles(id, roleName, roleDesc);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getRoles()
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 添加角色
        async addRoles(roleName, roleDesc) {
            try {
                let res = await this.$api.addRoles(roleName, roleDesc);
                if (res.meta.status === 201) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getRoles()
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 删除角色指定权限
        async delAutRoles(roleId, rightId) {
            try {
                let res = await this.$api.delAutRoles(roleId, rightId);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getRoles()
                    this.allPer()
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 角色授权
        async autRoles(roleId, rids) {
            try {
                let res = await this.$api.autRoles(roleId, rids);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getRoles()
                    this.allPer()
                }
            } catch (e) {
                console.log(e);
            }
        }
    },
    mounted() {
        this.getRoles()
        this.allPer()
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.roles {
    .title {
        margin: 20px 0 30px 0;
    }

    .btn {
        margin-bottom: 20px;
    }

    .box {
        display: flex;
        border-top: 1px solid #eee;
        margin-top: 10px;

        .f-box {
            display: flex;
            flex: 1;
            align-items: center;
            margin: 10px 20px 10px 0;
        }

        .s-box {
            flex: 4;

            .inner-box {
                display: flex;
                margin: 0 0 10px 0;
                align-items: center;

                .left {
                    width: 104px;
                    flex: 1;
                }

                .t-box {
                    display: flex;
                    flex: 4;
                    flex-wrap: wrap;

                    .i-box {
                        margin: 5px 0 5px 20px;
                    }
                }
            }

        }

    }
}
</style>
