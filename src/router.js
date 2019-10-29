import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'
import Login from './views/login.vue'

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          // 趋势分析
          path: '/trend',
          name: 'trend',
          component: () => import(/* webpackChunkName: "trend" */ './views/report/trend.vue')
        },
        {
          // 指标对比分析
          path: '/contrast',
          name: 'contrast',
          component: () => import(/* webpackChunkName: "contrast" */ './views/report/contrast.vue')
        },
        {
          // 对比概览
          path: '/contrast-overview',
          name: 'contrast-overview',
          component: () => import(/* webpackChunkName: "contrast-overview" */ './views/report/contrast-overview.vue')
        },
        {
          // 优质异常设备管理
          path: '/quality-abnormal-equipment',
          name: 'quality-abnormal-equipment',
          component: () => import(/* webpackChunkName: "quality-abnormal-equipment" */ './views/report/quality-abnormal-equipment.vue')
        },
        {
          // 对比分析
          path: '/compare-analysis',
          name: 'compare-analysis',
          component: () => import(/* webpackChunkName: "compare-analysis" */ './views/report/compare-analysis.vue')
        }, {
          // 今日实时
          path: '/today-real-time',
          name: 'today-real-time',
          component: () => import(/* webpackChunkName: "today-real-time" */ './views/report/today-real-time.vue')
        },
        {
          // 设备分析
          path: '/scale-analysis',
          name: 'scale-analysis',
          component: () => import(/* webpackChunkName: "scale-analysis" */ './views/report/scale-analysis.vue')
        },
        {
          // 设备详情
          path: '/scale-detail',
          name: 'scale-detail',
          component: () => import(/* webpackChunkName: "scale-detail" */ './views/report/scale-detail.vue')
        },
        {
          // 渠道收益分析
          path: '/gzh-channel-income',
          name: 'gzh-channel-income',
          component: () => import(/* webpackChunkName: "gzh-channel-income" */ './views/gzh/gzh-channel-income.vue')
        },
        {
          // 图文数据
          path: '/gzh-img-data',
          name: 'gzh-img-data',
          component: () => import(/* webpackChunkName: "gzh-img-data" */ './views/gzh/gzh-img-data.vue')
        },
        {
          // 公众号管理
          path: '/gzh-manage',
          name: 'gzh-manage',
          component: () => import(/* webpackChunkName: "gzh-manage" */ './views/gzh/gzh-manage.vue')
        },
        {
          // 数据录入
          path: '/gzh-data-entry',
          name: 'gzh-data-entry',
          component: () => import(/* webpackChunkName: "gzh-data-entry" */ './views/gzh/gzh-data-entry.vue')
        },
        {
          // 数据汇总
          path: '/gzh-data-summary',
          name: 'gzh-data-summary',
          component: () => import(/* webpackChunkName: "gzh-data-summary" */ './views/gzh/gzh-data-summary.vue')
        },
        {
          // 付费导粉收益
          path: '/gzh-paid-income',
          name: 'gzh-paid-income',
          component: () => import(/* webpackChunkName: "gzh-paid-income" */ './views/gzh/gzh-paid-income.vue')
        },
        {
          // 导粉流向分析
          path: '/follow-flow-analysis',
          name: 'follow-flow-analysis',
          component: () => import(/* webpackChunkName: "follow-flow-analysis" */ './views/ad/follow-flow-analysis.vue')
        },
        {
          // 导粉来源分析
          path: '/follow-source-analysis',
          name: 'follow-source-analysis',
          component: () => import(/* webpackChunkName: "follow-flow-analysis" */ './views/ad/follow-source-analysis.vue')
        },
        {
          // 城市经理-数据指标统计
          path: '/cm-data-stats',
          name: 'cm-data-stats',
          component: () => import(/* webpackChunkName: "cm-data-stats" */ './views/cm/cm-data-stats.vue')
        },
        {
          // 收益结算模式管理  新增/修改收益结算模式
          path: '/newModification',
          name: 'newModification',
          component: () => import(/* webpackChunkName: "newModification" */ './views/admin/newModification.vue')
        },
        {
          // 健康大使 健康大使管理 订单管理
          path: '/orderManagement',
          name: 'orderManagement',
          component: () => import(/* webpackChunkName: "orderManagement" */ './views/healthAmbassador/orderManagement.vue')
        },
        {
          // 健康大使 健康大使管理 账号管理
          path: '/accountManagement',
          name: 'accountManagement',
          component: () => import(/* webpackChunkName: "accountManagement" */ './views/healthAmbassador/accountManagement.vue')
        },
        {
          // 健康大使 健康大使管理 添加账号
          path: '/addAccount',
          name: 'addAccount',
          component: () => import(/* webpackChunkName: "addAccount" */ './views/healthAmbassador/addAccount.vue')
        },
        {
          // 健康大使 健康大使管理 查看账号信息
          path: '/showAccount',
          name: 'showAccount',
          component: () => import(/* webpackChunkName: "showAccount" */ './views/healthAmbassador/showAccount.vue')
        },
        {
          // 健康大使 相关配置 商品配置
          path: '/commodityAllocation',
          name: 'commodityAllocation',
          component: () => import(/* webpackChunkName: "commodityAllocation" */ './views/healthAmbassador/commodityAllocation.vue')
        },
        {
          // 健康大使 收益数据统计 收益汇总统计
          path: '/earningsSummaryStatistics',
          name: 'earningsSummaryStatistics',
          component: () => import(/* webpackChunkName: "earningsSummaryStatistics" */ './views/healthAmbassador/earningsSummaryStatistics.vue')
        },
        {
          // 健康大使 收益数据统计 收益提现管理
          path: '/earningsManagement',
          name: 'earningsManagement',
          component: () => import(/* webpackChunkName: "earningsManagement" */ './views/healthAmbassador/earningsManagement.vue')
        },
        {
          // 健康大使 收益数据统计 设备销售提成明细
          path: '/salesCommissionDetails',
          name: 'salesCommissionDetails',
          component: () => import(/* webpackChunkName: "salesCommissionDetails" */ './views/healthAmbassador/salesCommissionDetails.vue')
        },
        {
          // 健康大使 收益数据统计 广告佣金及分润统计
          path: '/commissionDistributionStatistics',
          name: 'commissionDistributionStatistics',
          component: () => import(/* webpackChunkName: "commissionDistributionStatistics" */ './views/healthAmbassador/commissionDistributionStatistics.vue')
        },
        {
          // 健康大使 相关配置 首页配置
          path: '/homePageConfiguration',
          name: 'homePageConfiguration',
          component: () => import(/* webpackChunkName: "homePageConfiguration" */ './views/healthAmbassador/homePageConfiguration.vue')
        },
        {
          // 健康大使 相关配置 其他配置
          path: '/otherConfiguration',
          name: 'otherConfiguration',
          component: () => import(/* webpackChunkName: "otherConfiguration" */ './views/healthAmbassador/otherConfiguration.vue')
        },
        {
          // 健康大使 相关配置 设备激活配置
          path: '/activeDeviceConfiguration',
          name: 'activeDeviceConfiguration',
          component: () => import(/* webpackChunkName: "activeDeviceConfiguration" */ './views/healthAmbassador/activeDeviceConfiguration.vue')
        },
        {
          // 导粉流程H5配置
          path: '/adConfigList',
          name: 'adConfigList',
          component: () => import(/* webpackChunkName: "adConfigList" */ './views/h5AD/adConfigList.vue')
        },
        {
          // 我的体重  图片广告链接列表页
          path: '/adPicContentList',
          name: 'adPicContentList',
          component: () => import(/* webpackChunkName: "adPicContentList" */ './views/h5AD/adPicContentList.vue')
        },
        {
          // 我的体重H5 添加广告
          path: '/addAD',
          name: 'addAD',
          component: () => import(/* webpackChunkName: "addAD" */ './views/h5AD/addAD.vue')
        },
        {
          // 导粉流程H5配置列表
          path: '/h5ConfigList',
          name: 'h5ConfigList',
          component: () => import(/* webpackChunkName: "h5ConfigList" */ './views/h5AD/h5ConfigList.vue')
        },
        {
          // 我的体重H5 添加广告配置
          path: '/addH5Config',
          name: 'addH5Config',
          component: () => import(/* webpackChunkName: "addH5Config" */ './views/h5AD/addH5Config.vue')
        },
        {
          // 每日H5广告
          path: '/daily-h5-adv',
          name: 'daily-h5-adv',
          component: () => import(/* webpackChunkName: "daily-h5-adv" */ './views/h5AD/daily-h5-adv.vue')
        },
        {
          // 导粉广告  推送规则
          path: '/pushRuleManager',
          name: 'pushRuleManager',
          component: () => import(/* webpackChunkName: "pushRuleManager" */ './views/guideAdv/pushRuleManager.vue')
        },
        {
          // 导粉广告
          path: '/advManager',
          name: 'advManager',
          component: () => import(/* webpackChunkName: "advManager" */ './views/guideAdv/advManager.vue')
        },
        {
          // 编辑导粉广告
          path: '/editAdv',
          name: 'editAdv',
          component: () => import(/* webpackChunkName: "editAdv" */ './views/guideAdv/editAdv.vue')
        },
        {
          // 导粉广告-分组配置
          path: '/groupManager',
          name: 'groupManager',
          component: () => import(/* webpackChunkName: "groupManager" */ './views/guideAdv/groupManager.vue')
        }, {
          // H5后退链接配置
          path: '/h5-links',
          name: 'h5-links',
          component: () => import(/* webpackChunkName: "h5-links" */ './views/h5AD/h5-links.vue')
        }, {
          // H5跳转链接配置
          path: '/h5-url',
          name: 'h5-url',
          component: () => import(/* webpackChunkName: "h5-url" */ './views/h5AD/h5-url.vue')
        }, {
          // 48小时主动推送
          path: '/push-customer-service',
          name: 'push-customer-service',
          component: () => import(/* webpackChunkName: "push-customer-service" */ './views/customerservice/push-customer-service.vue')
        }, {
          // 新增/修改推送规则
          path: '/edit-push-rule',
          name: 'edit-push-rule',
          component: () => import(/* webpackChunkName: "edit-push-rule" */ './views/customerservice/edit-push-rule.vue')
        }, {
          // 第三方链接获取
          path: '/copyLinks',
          name: 'copyLinks',
          component: () => import(/* webpackChunkName: "copyLinks" */ './views/tools/copyLinks.vue')
        },
        {
          // 百度广告统计
          path: '/baiduAdStat',
          name: 'baiduAdStat',
          component: () => import(/* webpackChunkName: "baiduAdStat" */ './views/h5AD/baiduAdStat.vue')
        },
        {
          // 删除导粉广告的每日日期
          path: '/advConfig',
          name: 'advConfig',
          component: () => import(/* webpackChunkName: "advConfig" */ './views/tools/advConfig.vue')
        },
        {
          // 数据字典管理
          path: '/dataZDManger',
          name: 'dataZDManger',
          component: () => import(/* webpackChunkName: "dataZDManager" */ './views/guideAdv/dataZDManger.vue')
        },
        {
          // 新增和编辑数据字典
          path: '/addDataZD',
          name: 'addDataZD',
          component: () => import(/* webpackChunkName: "addDataZD" */ './views/guideAdv/addDataZD.vue')
        },
        {
          // 幸运大转盘 抽奖设置
          path: '/turntable-setting',
          name: 'turntable-setting',
          component: () => import(/* webpackChunkName: "turntable-accept" */ './views/turntable/turntable-setting.vue')
        },
        {
          // 幸运大转盘 奖项列表
          path: '/turntable-prize',
          name: 'turntable-prize',
          component: () => import(/* webpackChunkName: "turntable-accept" */ './views/turntable/turntable-prize.vue')
        },
        {
          // 幸运大转盘 广告列表
          path: '/turntable-adv',
          name: 'turntable-adv',
          component: () => import(/* webpackChunkName: "turntable-accept" */ './views/turntable/turntable-adv.vue')
        },
        {
          // 幸运大转盘 领奖列表
          path: '/turntable-accept',
          name: 'turntable-accept',
          component: () => import(/* webpackChunkName: "turntable-accept" */ './views/turntable/turntable-accept.vue')
        },
        {
          // 积分商城-文章管理
          path: '/article-list',
          name: 'article-list',
          component: () => import(/* webpackChunkName: "article-list" */ './views/shoppingMall/article-list.vue')
        },
        {
          // 积分商城-添加文章
          path: '/edit-article',
          name: 'edit-article',
          component: () => import(/* webpackChunkName: "edit-article" */ './views/shoppingMall/edit-article.vue')
        },
        {
          // 推手-推手列表
          path: '/user-list',
          name: 'user-list',
          component: () => import(/* webpackChunkName: "user-list" */ './views/recommend/user-list.vue')
        },
        {
          // 推手-推手统计列表
          path: '/pushinger-day-stat',
          name: 'pushinger-day-stat',
          component: () => import(/* webpackChunkName: "user-list" */ './views/recommend/pushinger-day-stat.vue')
        },
        {
          // 推手-推手统计列表
          path: '/pushinger-income-list',
          name: 'pushinger-income-list',
          component: () => import(/* webpackChunkName: "user-list" */ './views/recommend/pushinger-income-list.vue')
        },
        {
          // 推手-推手统计列表
          path: '/global-day-stat',
          name: 'global-day-stat',
          component: () => import(/* webpackChunkName: "user-list" */ './views/recommend/global-day-stat.vue')
        },
        {
          // 提现管理
          path: '/withdraw-list',
          name: 'withdraw-list',
          component: () => import(/* webpackChunkName: "withdraw-list" */ './views/recommend/withdraw-list.vue')
        },
        {
          // 产品端用户列表
          path: '/product-user-list',
          name: 'product-user-list',
          component: () => import(/* webpackChunkName: "product-user-list" */ './views/productManager/product-user-list.vue')
        },
        {
          // 产品端订单列表
          path: '/product-order-list',
          name: 'product-order-list',
          component: () => import(/* webpackChunkName: "product-order-list" */ './views/productManager/product-order-list.vue')
        },
        {
          // 产品端商品列表
          path: '/product-goods-list',
          name: 'product-goods-list',
          component: () => import(/* webpackChunkName: "product-goods-list" */ './views/productManager/product-goods-list.vue')
        },
        {
          // 产品端编辑商品
          path: '/product-edit-goods',
          name: 'product-edit-goods',
          component: () => import(/* webpackChunkName: "product-edit-goods" */ './views/productManager/product-edit-goods.vue')
        },
        {
          // 产品端分享配置
          path: '/product-share-list',
          name: 'product-share-list',
          component: () => import(/* webpackChunkName: "product-edit-goods" */ './views/productManager/product-share-list.vue')
        },
        {
          // 产品端大师列表
          path: '/product-master-list',
          name: 'product-master-list',
          component: () => import(/* webpackChunkName: "product-goods-list" */ './views/productManager/product-master-list.vue')
        },
        {
          // 产品端虚拟用户列表
          path: '/product-fictitious-user-list',
          name: 'product-fictitious-user-list',
          component: () => import(/* webpackChunkName: "product-goods-list" */ './views/productManager/product-fictitious-user-list.vue')
        },
        {
          // 产品端首页图片管理列表
          path: '/product-home-pic-list',
          name: 'product-home-pic-list',
          component: () => import(/* webpackChunkName: "product-goods-list" */ './views/productManager/product-home-pic-list.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
