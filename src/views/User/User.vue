<template>
<div class="user">
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
                <div class="add-user">
                    <el-button type="primary" size="medium" @click="clickAdd">添加用户</el-button>
                </div>
            </div>
            <div class="userList">
                <el-table :data="users" border style="width: 100%">
                    <el-table-column label="#" type="index" align="center">
                    </el-table-column>
                    <el-table-column prop="username" label="姓名" align="center">
                    </el-table-column>
                    <el-table-column prop="role_name" label="角色" align="center">
                    </el-table-column>
                    <el-table-column prop="mobile" label="电话" align="center">
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱" align="center">
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="clickTab(scope.$index)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200" align="center">
                        <template slot-scope="scope">
                            <div class="btns">
                                <el-tooltip class="item" effect="dark" content="编辑角色" placement="top">
                                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="clickEdit(scope.$index)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
                                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="clickDel(scope.$index)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                                    <el-button type="danger" icon="el-icon-setting" size="mini" @click="clickDis(scope.$index)"></el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 15, 20, 30]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
    <el-dialog title="添加用户" :visible.sync="addFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input type="text" v-model="ruleForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="disFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <div class="roles">
                <div class="currentUser" v-if="users[rIndex]">当前用户：{{users[rIndex].username}}</div>
                <div class="currentRole" v-if="users[rIndex]">当前角色：{{users[rIndex].role_name}}</div>
                <div class="select">
                    <el-select v-model="rid" placeholder="请选择">
                        <el-option v-for="(item,index) in roleList" :key="index" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="disFlag = false">取 消</el-button>
            <el-button type="primary" @click="confirmDis">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editFlag" width="30%" :show-close="false" :modal="false">
        <span>
            <el-form :model="editUser" ref="editUser" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="editUser.username" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :rules="[{ required: true}]">
                    <el-input type="text" v-model="editUser.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile" :rules="[{ required: true}]">
                    <el-input type="text" v-model="editUser.mobile" autocomplete="off"></el-input>
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
        let checkUsername = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入用户名'));
            }
        };
        let checkPass = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入密码'));
            }
            setTimeout(() => {
                if (value.length < 6) {
                    callback(new Error('密码不能低于6位'));
                }
            }, 1000);
        };
        let checkEmail = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入邮箱'));
            }
            setTimeout(() => {
                let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if (!reg.test(value)) {
                    callback(new Error('邮箱格式不正确'));
                }
            }, 1000);
        };
        let checkMobile = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入手机号码'));
            }
            setTimeout(() => {
                let reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
                if (!reg.test(value)) {
                    callback(new Error('手机格式不正确'));
                }
            }, 1000);
        };
        return {
            // 角色id(用于分配用户角色时)
            rid: "",
            // 搜索关键词
            query: '',
            // 页码
            pagenum: 1,
            // 每页多少条
            pagesize: 5,
            // 用户总数
            total: 0,
            // 用户
            users: [],
            // 被编辑的用户
            editUser:{},
            // 角色列表
            roleList: [],
            // 是否添加用户
            addFlag: false,
            // 是否分配角色
            disFlag: false,
            // 是否编辑用户
            editFlag: false,
            // 用于分配角色的索引
            rIndex: 0,
            // 添加用户的表单
            ruleForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 验证规则
            rules: {
                username: [{
                    validator: checkUsername,
                    trigger: 'blur',
                    required: true
                }],
                password: [{
                    validator: checkPass,
                    trigger: 'blur',
                    required: true
                }],
                email: [{
                    validator: checkEmail,
                    trigger: 'blur',
                    required: true
                }],
                mobile: [{
                    validator: checkMobile,
                    trigger: 'blur',
                    required: true
                }]
            }
        }
    },
    components: {

    },
    methods: {
        // 点击添加用户
        clickAdd() {
            this.addFlag = true
        },
        // 切换每页数据数量
        handleSizeChange(val) {
            this.pagesize = val
            this.getUser(this.pagenum, this.pagesize, this.query)
        },
        // 切换页码
        handleCurrentChange(val) {
            this.pagenum = val
            this.getUser(this.pagenum, this.pagesize, this.query)
        },
        // 点击开关
        clickTab(index) {
            this.changeState(this.users[index].id, !this.users[index].mg_state)
        },
        // 点击搜索按钮
        btnSearch() {
            this.getUser(this.pagenum, this.pagesize, this.query)
        },
        // 回车搜索
        enterSearch() {
            this.getUser(this.pagenum, this.pagesize, this.query)
        },
        // 确认分配角色
        confirmDis() {
            this.disFlag = false
            this.allotUser(this.users[this.rIndex].id, this.rid)
        },
        // 确认编辑用户
        confirmEdit() {
            this.editFlag = false
            this.editUserMsg(this.editUser.id, this.editUser.email, this.editUser.mobile)
        },
        // 确认添加用户
        confirmAdd() {
            this.addFlag = false
            if (this.ruleForm.username && this.ruleForm.password && this.ruleForm.email && this.ruleForm.mobile) {
                this.addUser(this.ruleForm.username, this.ruleForm.password, this.ruleForm.email, this.ruleForm.mobile)
            } else {
                this.$message({
                    message: '请按要求填写信息',
                    type: 'warning'
                });
            }
        },
        // 点击分配角色
        clickDis(index) {
            this.disFlag = true
            this.rIndex = index
        },
        // 点击编辑
        clickEdit(index) {
            this.editFlag = true
            this.editUser=this.users[index]
        },
        // 点击删除
        clickDel(index) {
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: false
            }).then(() => {
                this.delUser(this.users[index].id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 添加用户
        async addUser(username, password, email, mobile) {
            try {
                let res = await this.$api.addUser(username, password, email, mobile);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.ruleForm.username = this.ruleForm.password = this.ruleForm.email = this.ruleForm.mobile = ''
                    this.getUser(this.pagenum, this.pagesize, this.query)
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 编辑用户
        async editUserMsg(id, email, mobile) {
            try {
                let res = await this.$api.editUserMsg(id, email, mobile);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getUser(this.pagenum, this.pagesize, this.query)
                }
                 console.log(res);
            } catch (e) {
                console.log(e);
            }
        },
        // 分配角色
        async allotUser(id, rid) {
            try {
                let res = await this.$api.allotUser(id, rid);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getUser(this.pagenum, this.pagesize, this.query)
                } else {
                    this.$message.error(res.meta.msg)
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 删除用户
        async delUser(id) {
            try {
                let res = await this.$api.delUser(id);
                if (res.meta.status === 200) {
                    this.$message({
                        message: res.meta.msg,
                        type: 'success'
                    });
                    this.getUser(this.pagenum, this.pagesize, this.query)
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 修改用户状态
        async changeState(uId, type) {
            try {
                let res = await this.$api.updateUser(uId, type);
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
        // 获取用户列表
        async getUser(pagenum, pagesize, query) {
            try {
                let res = await this.$api.getUser(pagenum, pagesize, query);
                if (res.meta.status === 200) {
                    this.users = res.data.users
                    this.total = res.data.total
                }
                console.log(res, 777);
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
                console.log(res, 222);
            } catch (e) {
                console.log(e);
            }
        }
    },
    mounted() {
        this.getUser(this.pagenum, this.pagesize, this.query)
        this.getRoles()
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

    .roles {
        font-size: 16px;

        .currentRole {
            margin: 20px 0;
        }
    }
}
</style>
