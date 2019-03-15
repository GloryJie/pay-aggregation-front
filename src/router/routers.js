import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/appList',
    name: 'AppList',
    meta: {
      title: '应用列表',
      hideInMenu: true,
      notCache: true
    },
    component: () => import('@/view/app-list/app-list.vue')
  },
  {
    path: '/app/:appId',
    name: '_AppHome',
    component: Main,
    redirect: '/app/:appId/overview',
    children: [
      {
        path: 'overview',
        name: 'AppHome',
        meta: {
          hideInMenu: false,
          notCache: true,
          title: '概览',
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/app/:appId/trade',
    name: 'TradeManage',
    component: Main,
    meta: {
      icon: 'md-menu',
      title: '交易管理'
    },
    children: [
      {
        path: 'charge',
        name: 'ChargeManage',
        meta: {
          icon: 'logo-usd',
          title: '支付管理',
          notCache: true
        },
        component: () => import('@/view/trade-manage/charge.vue')
      },
      {
        path: 'refund',
        name: 'RefundManage',
        meta: {
          icon: 'logo-usd',
          title: '退款单管理',
          notCache: true
        },
        component: () => import('@/view/trade-manage/refund.vue')
      }
    ]
  },
  {
    path: '/app/:appId/channel',
    name: 'Channel',
    component: Main,
    children: [
      {
        path: 'config',
        name: 'ChannelConfig',
        meta: {
          icon: 'md-cog',
          title: '渠道配置',
          notCache: true
        },
        component: () => import('@/view/channel-config/channel-config.vue')
      }
    ]
  },
  {
    path: '/app/:appId/notify',
    name: 'Notify',
    component: Main,
    children: [
      {
        path: 'config',
        name: 'NotifyConfig',
        meta: {
          icon: 'md-construct',
          title: '通知配置',
          notCache: true
        },
        component: () => import('@/view/notify-config/notify-config.vue')
      }
    ]
  },
  {
    path: '/app/:appId/log',
    name: 'Log',
    component: Main,
    children: [
      {
        path: 'record',
        name: 'LogRecord',
        meta: {
          icon: 'md-clipboard',
          title: '日志查看',
          notCache: true
        },
        component: () => import('@/view/log-record/log-record.vue')
      }
    ]
  },
  {
    path: '/app/:appId/expolit',
    name: 'Expolit',
    component: Main,
    children: [
      {
        path: 'config',
        name: 'ExpolitConfig',
        meta: {
          icon: 'md-clipboard',
          title: '开发配置',
          notCache: true
        },
        component: () => import('@/view/exploit-config/exploit-config.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
