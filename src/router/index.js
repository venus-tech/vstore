import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/dbmanager',
    name: 'DatabaseManager',
    component: ()=>import(/* webpackChunkName: "DBTEST" */ '../views/DBTest.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path : '/products' ,
    name : 'Products' ,
    // route level code-splitting
    // this generates a separate chunk (products.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component : () => import(/* webpackChunkName: "products" */ '../views/Products.vue')
  },
  {
    path : '/products/:id' ,
    name : 'Product' ,
    component : () => import(/* webpackChunkName: "products" */ '../views/Product.vue')
  },
  {
    path : '/categories/:id' ,
    name : 'Catogory' ,
    component : () => import(/* webpackChunkName: "categories" */ '../views/Catogory.vue')
  },
  {
    path : '/agents' ,
    name : 'Agents' ,
    component : () => import(/* webpackChunkName: "agents" */ '../views/Agents.vue')
  },
  {
    path : '/agents/:id' ,
    name : 'Agent' ,
    component : () => import(/* webpackChunkName: "agent" */ '../views/Agent.vue')
  },
  {
    path : '/employees' ,
    name : 'Employees' ,
    component : () => import(/* webpackChunkName: "employees" */ '../views/Employees.vue')
  },
  {
    path : '/employees/:id' ,
    name : 'Employee' ,
    component : () => import(/* webpackChunkName: "employee" */ '../views/Employee.vue')
  },
  {
    path : '/orders' ,
    name : 'Orders' ,
    component : () => import(/* webpackChunkName: "orders" */ '../views/Orders.vue')
  },
  {
    path : '/orders/:id' ,
    name : 'Order' ,
    component : () => import(/* webpackChunkName: "order" */ '../views/Order.vue')
  },
  {
    path : '/transactions' ,
    name : 'Transactions' ,
    component : () => import(/* webpackChunkName: "transactions" */ '../views/Transactions.vue')
  },
  {
    path : '/transactions/:id' ,
    name : 'Transaction' ,
    component : () => import(/* webpackChunkName: "transaction" */ '../views/Transaction.vue')
  },
  {
    path : '/cheques' ,
    name : 'Cheques' ,
    component : () => import(/* webpackChunkName: "cheques" */ '../views/Cheques.vue')
  },
  {
    path : '/cheques/:id' ,
    name : 'Cheque' ,
    component : () => import(/* webpackChunkName: "cheque" */ '../views/Cheque.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component : () => import(/* webpackChunkName: "Statistics" */ '../views/Statistics.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component : () => import(/* webpackChunkName: "Statistics" */ '../views/Settings.vue')
  },
  {
    path : '/makeOrder' ,
    name : 'MakeOrder' ,
    component : () => import(/* webpackChunkName: "makeOrder" */ '../views/MakeOrder.vue')
  },
  {
    path : '/print/transactions/:id' ,
    name : 'printTransaction' ,
    component : () => import(/* webpackChunkName: "printTransaction" */ '../views/print/transaction.vue')
  },
  {
    path : '/print/products' ,
    name : 'printProducts' ,
    component : () => import(/* webpackChunkName: "printTransaction" */ '../views/print/products.vue')
  },
  {
    path : '/print/orders/:id' ,
    name : 'printOrders' ,
    component : () => import(/* webpackChunkName: "printOrders" */ '../views/print/order.vue')
  },
  {
    path : '/print/orders/:id/products' ,
    name : 'printOrderProducts' ,
    component : () => import(/* webpackChunkName: "printOrderProducts" */ '../views/print/orderProducts.vue')
  },
  {
    path : '/print/orders/:id/payements' ,
    name : 'printOrderPayments' ,
    component : () => import(/* webpackChunkName: "printOrderPayments" */ '../views/print/orderPayments.vue')
  },
  {
    path : '/print/payements/:id' ,
    name : 'printPayment' ,
    component : () => import(/* webpackChunkName: "printPayment" */ '../views/print/payment.vue')
  },
  {
    path : '/print/cart' ,
    name : 'printCart' ,
    component : () => import(/* webpackChunkName: "printCart" */ '../views/print/cart.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
