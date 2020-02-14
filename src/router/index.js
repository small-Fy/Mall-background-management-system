import Vue from 'vue'
import VueRouter from 'vue-router'
import Comment from '../views/Comment/Comment.vue'
// import User from '../views/User/Comment.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/home'
    },
    // 登录
    {
        path: "/login",
        name: "login",
        component: () =>
            import ("../views/Login/Login.vue")
    },
    // 系统首页
    {
        path: "/home",
        component: Comment,
        meta: {
            title: "首页",
            icon: "el-icon-s-home"
        },
        children: [{
            path: "",
            name: "home",
            component: () =>
                import ("../views/Home.vue")
        }]
    },
    // 用户列表
    {
        path: "/users/users",
        component: Comment,
        meta: {
            title: "用户管理",
            icon: "el-icon-user"
        },
        children: [{
            path: "",
            name: "user",
            meta: {
                title: "用户列表",
                icon: "el-icon-folder-opened"
            },
            component: () =>
                import ("../views/User/User.vue")
        }]
    },
    // 权限列表
    {
        path: "/rights/rights",
        component: Comment,
        meta: {
            title: "权限管理",
            icon: "el-icon-folder"
        },
        children: [{
            path: "",
            name: "permissions",
            meta: {
                title: "权限列表",
                icon: "el-icon-toilet-paper"
            },
            component: () =>
                import ("../views/Permissions/Permissions.vue")
        }]
    },
    // 角色列表
    {
        path: "/rights/roles",
        component: Comment,
        meta: {
            title: "权限管理",
            icon: "el-icon-folder"
        },
        children: [{
            path: "",
            name: "roles",
            meta: {
                title: "角色列表",
                icon: "el-icon-coin"
            },
            component: () =>
                import ("../views/Roles/Roles.vue")
        }]
    },
    // 商品列表
    {
        path: "/goods/goods",
        component: Comment,
        meta: {
            title: "商品管理",
            icon: "el-icon-shopping-bag-1"
        },
        children: [{
            path: "",
            name: "goods",
            meta: {
                title: "商品列表",
                icon: "el-icon-box"
            },
            component: () =>
                import ("../views/Goods/Goods.vue")
        }]
    },
    // 添加商品
    {
        path: "/addGoods",
        component: Comment,
        children: [{
            path: "",
            name: "addGoods",
            component: () =>
                import ("../views/AddGoods/AddGoods.vue")
        }]
    },
    // 分类参数
    {
        path: "/goods/params",
        component: Comment,
        meta: {
            title: "商品管理",
            icon: "el-icon-shopping-bag-1"
        },
        children: [{
            path: "",
            name: "params",
            meta: {
                title: "分类参数",
                icon: "el-icon-coin"
            },
            component: () =>
                import ("../views/Params/Params.vue")
        }]
    },
    // 商品分类
    {
        path: "/goods/categories",
        component: Comment,
        meta: {
            title: "商品管理",
            icon: "el-icon-shopping-bag-1"
        },
        children: [{
            path: "",
            name: "categories",
            meta: {
                title: "商品分类",
                icon: "el-icon-present"
            },
            component: () =>
                import ("../views/Categories/Categories.vue")
        }]
    },
    // 订单管理
    {
        path: "/orders/orders",
        component: Comment,
        meta: {
            title: "订单管理",
            icon: "el-icon-s-order"
        },
        children: [{
            path: "",
            name: "orders",
            meta: {
                title: "订单列表",
                icon: "el-icon-tickets"
            },
            component: () =>
                import ("../views/Orders/Orders.vue")
        }]
    },
    // 数据报表
    {
        path: "/reports/reports",
        component: Comment,
        meta: {
            title: "数据统计",
            icon: "el-icon-pie-chart"
        },
        children: [{
            path: "",
            name: "reports",
            meta: {
                title: "数据报表",
                icon: "el-icon-position"
            },
            component: () =>
                import ("../views/Reports/Reports.vue")
        }]
    }
]

const isPro = process.env.NODE_ENV === 'production'


const router = new VueRouter({
    mode: isPro ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name === "login") {
        next()
    } else {
        if (localStorage.getItem('adminToken')) {
            next()
        } else {
            next('/login')
        }
    }
})

export default router