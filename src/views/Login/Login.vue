<template>
 <div class="login">
     <div class="contain">
         <el-card class="box-card">
             <div class="title">啊哈后台管理系统</div>
             <el-form :model="ruleForm" status-icon :rules="rules"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <div class="prompt">特别提醒: 如果您是管理员,请使用管理员账号登录,如果不知道账号,请联系公司人事。</div>
                <div class="btn">
                    <el-button type="primary" @click="login">立即登录</el-button>
                </div>
            </el-form>
        </el-card>
     </div>
 </div>
</template>

<script>
 export default {
   data () {
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
          if(value.length<6){
            callback(new Error('密码不能低于6位'));
          }
        }, 1000);
      };
     return {
         ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { validator: checkUsername, trigger: 'blur',required:true }
          ],
          password: [
            { validator: checkPass, trigger: 'blur',required:true }
          ]
        }
     }
   },
   components: {

   },
   methods: {
    async login() {
      try {
        let res = await this.$api.login(
          this.ruleForm.username,
          this.ruleForm.password
        );
        if(res.data){
            let adminToken=res.data.token.slice(res.data.token.indexOf(' ')+1)
            localStorage.setItem('adminToken',adminToken)
            localStorage.setItem('username',res.data.username)
            this.$message({
                message: '登录成功',
                type: 'success'
            });
            this.$router.push('/home')
        }else{
            this.$message({
                message: res.meta.msg,
                type: 'warning'
            });
        }
      } catch (e) {
        console.log('error submit!!');
      }
    }  
   },
   mounted() {

   },
   watch: {

   },
   computed: {

   }
 }
</script>

<style scoped lang='scss'>
    .login{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: url('../../assets/images/login-bg.jpg') no-repeat;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        .contain{
            width: 650px;
            .title{
                height: 60px;
                line-height: 60px;
                text-align: center;
                color: #303133;
                font-size: 2em;
                font-weight: bold;
                border-bottom: 1px solid #ebeef5;
                margin-bottom: 30px;
                padding-bottom: 16px;
            }
            .prompt{
                padding-left: 10px;
                margin: 20px 0;
            }
            .btn{
                display: flex;
                justify-content: center;
            }
        }
    }
</style>