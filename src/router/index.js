import Vue from 'vue'
import vueRouter from 'vue-router'

Vue.use(vueRouter)

let router = new vueRouter({
    routes: [
        {
            path: '/',
            redirect:'/login'
        },
        {
            path: '/login',
            component:()=>import('./../views/login.vue')
        },
        {
            path: '/home',
            component: () => import('./../views/home.vue'),
            children: [
                {
                    path: 'userList',
                    component:()=>import('./../components/user_management/userList.vue')
                }
            ]
        }   
    ]
})

export default router