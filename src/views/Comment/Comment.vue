<template>
<div>
    <el-container>
        <el-header>
            <top></top>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <asider></asider>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    components: {

    },
    methods: {},
    mounted() {

    },
    watch: {

    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>

.el-header {
    color: #333;
}

.el-aside {
    color: #333;
    padding-left: 20px;
}

.el-main {
    color: #333;
}
</style>
