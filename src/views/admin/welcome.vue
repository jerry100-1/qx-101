<template>
  <b-container fluid>
    <b-row>
      <div class="page-header w-100">
        <h2>
          <img class="logo mr-2" src="../../assets/images/logo.png">
          <small>{{ $config.ADMIN_TITLE }}系统<span class="d-none d-md-inline"> - 感谢您奔腾不息的工作, 我们因你更精彩!</span></small>
        </h2>
      </div>
      <!-- <div class="table-responsive">
        <table class="table table-striped table-bordered text-nowrap" align="center">
          <th colspan="6">
            待处理信息
          </th>
          <tr>
            <td>待审核铺设点</td>
            <td>待审核发货申请</td>
            <td>待处理维修上报记录</td>
            <td>待审核合伙人申请</td>
            <td>待审核运维人员申请</td>
            <td>待核算提现申请</td>
          </tr>
          <tr class="tr_list">
            <td style="text-align: center"><a target="_blank" href="{$modules_root}modules/agent/agentPavePoints.php"><div>{$count['pavePointsCount']}</div></a></td>
            <td style="text-align: center"><a target="_blank" href="{$modules_root}modules/agent/scaleApplication.php"><div>{$count['scaleOrderCount']}</div></a></td>
            <td style="text-align: center"><a target="_blank" href="{$modules_root}modules/agent/maintenance.php"><div>{$count['scaleRepairReportCount']}</div></a></td>
            <td style="text-align: center"><a target="_blank" href="{$modules_root}modules/agent/partner.php"><div>{$count['agentPartnerCount']}</div></a></td>
            <td style="text-align: center"><a target="_blank" href="{$modules_root}modules/employee/employee.php"><div>{$count['employeeCount']}</div></a></td>
            <td style="text-align: center"><a target="_blank" href="{$modules_root}modules/agent/agentWithdraw.php"><div>{$count['agentWithdraw']}</div></a></td>
          </tr>
        </table>
      </div> -->
      <div class="table-responsive">
        <table class="table table-striped table-bordered text-nowrap">
          <thead>
            <tr>
              <th colspan="2">系统信息</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>客户端IP:</td>
              <td>{{info.remote_addr}}</td>
            </tr>
            <tr>
              <td>服务器IP:</td>
              <td>{{info.server_addr}}</td>
            </tr>
            <tr>
              <td>操作系统版本:</td>
              <td>{{info.php_uname}}</td>
            </tr>
            <tr>
              <td>PHP版本:</td>
              <td>{{info.php_version}}</td>
            </tr>
            <tr>
              <td>服务器时间:</td>
              <td>{{info.date}}</td>
            </tr>
            <tr v-if="info.server_addr === '127.0.0.1'">
              <td>服务器文档路径:</td>
              <td>{{info.ddir}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-responsive" v-html="info.glossary"></div>
      <div class="table-responsive">
        <table class="table table-striped table-bordered text-nowrap">
          <thead>
            <tr>
              <th>流程图</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src="../../assets/images/main_explain.png">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import * as WelcomeApi from '@/api/welcome'
import swal from 'sweetalert2'

export default {
  name: 'welcome',
  data () {
    return {
      info: {}
    }
  },
  created () {
    this.fetchWelcomeData()
  },
  methods: {
    fetchWelcomeData () {
      WelcomeApi.fetchWelcomeData().then(res => {
        const data = res.data
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error'
          })
          return
        }
        this.info = data.Result
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.page-header {
  padding-bottom: 9px;
  margin: 40px 0 20px;
  border-bottom: 1px solid #eee;
  .logo {
    width: 64px;
    height: 64px;
  }
  small {
    font-size: 65%;
    font-weight: 400;
    line-height: 1;
    color: #777;
  }
}
// .tr_list td a {
//   color: red;
//   font-size: 30px;
// }
</style>
