<template>
<div class="asider">
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router>
        <template v-for="item in menus">
            <el-submenu :index="item.key" :key="item.path" v-if="item.children.length>0">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{item.authName}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item :index="el.key" v-for="(el,idx) in item.children" :key="idx">
                        <template slot="title">
                            <i :class="el.icon"></i>
                            <span>{{el.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item :index="item.key" :key="item.path" v-else>
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{item.authName}}</span>
                </template>
            </el-menu-item>
        </template>
    </el-menu>
</div>
</template>

<script>
import router from '../../router'
export default {
    data() {
        return {
            menus: []
        }
    },
    components: {

    },
    methods: {
        // 获取左侧菜单权限
        async menuPer() {
            try {
                let res = await this.$api.menuPer();
                res.data.unshift({
                    id: 1,
                    authName: "首页",
                    children: [],
                    order: 0,
                    path: "home"
                })
                res.data.map(item => {
                    if (item.children.length === 0) {
                        this.$set(item, "key", `/${item.path}`)
                    } else {
                        this.$set(item, "key", `/${item.path}`)
                        item.children.map(el => {
                            this.$set(el, "key", `/${item.path}/${el.path}`)
                        })
                    }
                })
                router.options.routes.map(item => {
                    if (item.meta) {
                        res.data.map(item1 => {
                            if (item.meta.title === item1.authName) {
                                this.$set(item1, "icon", item.meta.icon)
                            }
                            if (item.children &&
                                item.children.length > 0 &&
                                item1.children.length > 0
                            ) {
                                item.children.map(item2 => {
                                    if (item2.meta) {
                                        item1.children.map(item3 => {
                                            if (item2.meta.title === item3.authName) {
                                                this.$set(item3, "icon", item2.meta.icon)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                this.menus = res.data
                console.log(this.menus,789)
            } catch (e) {
                console.log(e);
            }
        },
        // 点击左侧菜单
        selectMenu(indexPath){
            console.log(indexPath)
        }
    },
    mounted() {
        this.menuPer()
    },
    watch: {

    },
    computed: {

    }
}
</script>

<style scoped lang='scss'>

</style>
