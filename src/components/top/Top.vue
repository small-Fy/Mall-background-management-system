<template>
<div class="head">
    <div class="contain">
        <div class="left">欢迎来到啊哈后台系统</div>
        <div class="right">
            <div class="time">{{currentTime}}</div>
            <img src="../../assets/images/多云.png" alt="" class="weaImg" v-if="weather==='多云'">
            <img src="../../assets/images/冰雹.png" alt="" class="weaImg" v-if="weather==='冰雹'">
            <img src="../../assets/images/雷电.png" alt="" class="weaImg" v-if="weather==='雷电'">
            <img src="../../assets/images/晴.png" alt="" class="weaImg" v-if="weather==='晴'">
            <img src="../../assets/images/沙尘.png" alt="" class="weaImg" v-if="weather==='沙尘'">
            <img src="../../assets/images/雾.png" alt="" class="weaImg" v-if="weather==='雾'">
            <img src="../../assets/images/雪.png" alt="" class="weaImg" v-if="weather==='雪'">
            <img src="../../assets/images/阴.png" alt="" class="weaImg" v-if="weather==='阴'">
            <img src="../../assets/images/雨.png" alt="" class="weaImg" v-if="weather==='雨'">
            <div class="weather">{{weather}}</div>
            <div class="welcome">亲爱的{{username}}</div>
            <div class="quit" @click="loginOut">退出</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            //定义一个定时器的变量
            timer: "",
            //  当前时间
            currentTime: new Date(),
            //  天气
            weather: '',
            //  天气图标
            weaImg: '',
            //  当前登录的用户名
            username: ''
        }
    },
    components: {

    },
    methods: {
        // 退出登录
        loginOut() {
            this.$message({
                message: '欢迎下次光临',
                type: 'success'
            });
            localStorage.clear()
        },
        //  获取用户名
        getUser() {
            this.username = localStorage.getItem('username')
        },
        //  刷新时间
        reTime() {
            if (new Date().getHours() > 12) {
                this.timer = setInterval(() => {
                    let hours = new Date().getHours() > 12 ? `下午${new Date().getHours()-12}` : new Date().getHours()
                    let minutes = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes()
                    let seconds = new Date().getSeconds() < 10 ? `0${new Date().getSeconds()}` : new Date().getSeconds()
                    this.currentTime = new Date().getFullYear() +
                        "/" +
                        (new Date().getMonth() + 1) +
                        "/" +
                        new Date().getDate() +
                        " " +
                        hours +
                        ":" +
                        minutes +
                        ":" +
                        seconds;
                }, 1000);
            }
        },
        getWeather() {
            this.$axios
                .get(
                    "https://tianqiapi.com/api?version=v6&appid=68174643&appsecret=yAc60B54"
                )
                .then(res => {
                    this.weather = res.data.wea
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    mounted() {
        this.reTime()
        this.getWeather()
        this.getUser()
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.head {
    .contain {
        height: 60px;
        border-bottom: 1px solid #eee;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #2e5e85;

        .left {}

        .right {
            display: flex;
            align-items: center;

            .weaImg {
                margin-left: 10px;
                margin-right: 8px;
                width: 20px;
            }

            .weather {
                margin-right: 10px;
            }

            .quit {
                cursor: pointer;
                color: #409eff;
                margin-left: 12px;
            }
        }
    }
}
</style>
