import Vue from 'vue'
import Router from 'vue-router'
// Users
import UserIndex from '@/components/Users/Index'
import UserCreate from '@/components/Users/CreateUser'
import UserEdit from '@/components/Users/EditUser'
import UserShow from '@/components/Users/ShowUser'
// Authen
import Login from '@/components/Login'
// Blogs
import BlogIndex from '@/components/Blogs/Index'
import BlogCreate from '@/components/Blogs/CreateBlog'
import BlogEdit from '@/components/Blogs/EditBlog'
import BlogShow from '@/components/Blogs/ShowBlog'
import CommentIndex from '@/components/Comments/Index'
// Upload Testing
import Upload from '@/components/Utils/Upload'
// Front
import FrontIndex from '@/components/Fronts/Index'
import FrontShow from '@/components/Fronts/ShowBlog'
import FrontEquipments from '@/components/Fronts/Equipments'
import FrontshowEquipments from '@/components/Fronts/showEquipment'
import FrontCartlist from '@/components/Fronts/Cartlist'

// Equipments
import EquipmentIndex from '@/components/Equipments/Index'
import EquipmentCreate from '@/components/Equipments/CreateEquipment'
import EquipmentEdit from '@/components/Equipments/EditEquipment'
import EquipmentShow from '@/components/Equipments/ShowEquipment'
import Cartlist from '@/components/Equipments/Cartlist'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/users',
      name: 'users',
      component: UserIndex
    },
    {
      path: '/user/create',
      name: 'users-create',
      component: UserCreate
    },
    {
      path: '/user/edit/:userId',
      name: 'user-edit',
      component: UserEdit
    },
    {
      path: '/user/:userId',
      name: 'user',
      component: UserShow
    },
    // authen
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // blogs
    {
    path: '/blogs',
    name: 'blogs',
    component: BlogIndex
    },
    {
      path: '/blog/create',
      name: 'blogs-create',
      component: BlogCreate
    },
    {
      path: '/blog/edit/:blogId',
      name: 'blog-edit',
      component: BlogEdit
    },
    {
      path: '/blog/:blogId',
      name: 'blog',
      component: BlogShow
    },
    // comments
    {
      path: '/comments',
      name: 'comments',
      component: CommentIndex
    },
    // upload testing
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    // front
    {
      path: '/front',
      name: 'front',
      component: FrontIndex
    },
    {
      path: '/front-equipments',
      name: 'front-equipments',
      component: FrontEquipments
    },
    {
      path: '/front-cartlist',
      name: 'cartlist',
      component: FrontCartlist
    },
    {
      path: '/front-view-equipment/:equipmentId',
      name: 'front-view-equipment',
      component: FrontshowEquipments
    },
    {
      path: '/front/read/:blogId',
      name: 'front-read',
      component: FrontShow
    },
    // Equipments
    {
      path: '/equipments',
      name: 'equipments',
      component: EquipmentIndex
    },
    {
      path: '/equipment/create',
      name: 'equipments-edit',
      component: EquipmentCreate
    },
    {
      path: '/equipment/edit/:equipmentId',
      name: 'equipment-edit',
      component: EquipmentEdit
    },
    {
      path: '/equipment/:equipmentId',
      name: 'equipment',
      component: EquipmentShow
    },
    {
      path: '/Cartlist',
      name: 'Cartlist',
      component: Cartlist
    },
  ]
})