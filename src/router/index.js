import Vue from 'vue'
import vueRouter from 'vue-router'

Vue.use(vueRouter)

let router = new vueRouter({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: () => import('./../views/login.vue')
        },
        {
            path: '/home',
            component: () => import('./../views/Home.vue'),
            children: [{
                    path: '/',
                    // component: () => import('./../components/home/index.vue')
                    redirect:'index'
                },
                {
                    path: 'index',
                    component: () => import('./../components/home/index.vue')
                },
                {
                    path: 'users',
                    component: () => import('./../components/yhgl/users.vue')
                },
                {
                    path: 'roles',
                    component:()=>import('./../components/qxgl/roles1.vue')
                },
                {
                    path: 'rights',
                    component: () => import('./../components/qxgl/rights.vue')
                },
                {
                    path: 'reports',
                    component: () => import('./../components/sjbb/reports.vue')
                },
                {
                    path: 'goods',
                    component: () => import('./../components/spgl/goods.vue')
                },
                {
                    path: 'addgoods',
                    component: () => import('./../components/spgl/addgoods.vue'),
                },
                {
                    path: 'categories',
                    component: () => import('./../components/spgl/categories.vue')
                },
                {
                    path: 'params',
                    component: () => import('./../components/spgl/params.vue')
                },
                {
                    path: 'orders',
                    component: () => import('./../components/ddgl/orders.vue')
                },
            ]
        }
    ]
})

router.beforeEach((to,from,next) => {
    if (to.path == '/home' && !sessionStorage.getItem('token')) {
        next('/login')
    } else {
        next()
        if (to.path == '/home/index') {
            sessionStorage.removeItem('index')
            // router.go(0)
         }
    }
    // else if (to.path == 'index') {
    //     sessionStorage.removeItem('index')
    //  }
    
})

export default router