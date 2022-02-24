import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

import WorkFlow from '../Pages/WorkFlow.vue'
import SetMenu from '../Pages/setMenu/setMenu.vue'

const routes = [
    {path:'/',name:"WorkFlow",component:WorkFlow},
    {path:'/setMenu',name:"setMenu",component:SetMenu},
]

const router =  new VueRouter({
    routes,
    // mode: process.env.IS_ELECTRON ? 'hash':'history',
})

// const router = VueRouter.createRouter({
//     routes
// })
export default router
