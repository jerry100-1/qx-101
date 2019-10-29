<template>
  <div class="summary">
    <ul class="summary-list">
      <li v-for="item in indicators" :key="item.name" class="summary-item">
        <span class="text">
          {{ item.text }}
          <el-tooltip v-if="item.desc" placement="bottom-start" effect="light">
            <div slot="content" v-html="item.desc"></div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </span>
        <div class="value summary-ellipsis" >
          <span v-if="item.unit" :title="getValueWithUnit(value[item.name], item.unit)">{{ getValueWithUnit(value[item.name], item.unit) }}</span>
          <span v-else :title="getFormatNumber(value[item.name])">{{ getFormatNumber(value[item.name]) }}</span>
          <template v-if="value.Compare">
            <font-awesome-icon v-if="compare(value[item.name], value.Compare[item.name]) > 0" :icon="icons.faAngleDoubleUp" class="ml-1 text-danger" />
            <font-awesome-icon v-else-if="compare(value[item.name], value.Compare[item.name]) < 0" :icon="icons.faAngleDoubleDown" class="ml-1 text-success" />
          </template>
        </div>
        <template v-if="value.Compare">
          <div v-if="item.unit" class="compare-value summary-ellipsis" :title="getValueWithUnit(value.Compare[item.name], item.unit)">{{ getValueWithUnit(value.Compare[item.name], item.unit) }}</div>
          <div v-else class="compare-value summary-ellipsis" :title="getFormatNumber(value.Compare[item.name])">{{ getFormatNumber(value.Compare[item.name]) }}</div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import { toPercent, formatNumber } from '@/utils'

export default {
  name: 'indicator-summary',
  props: {
    // 指标
    indicators: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 数据
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      icons: {
        faAngleDoubleUp,
        faAngleDoubleDown
      }
    }
  },
  methods: {
    getValueWithUnit (value, unit) {
      return unit === '%' ? toPercent(value) : value + unit
    },
    getFormatNumber (value) {
      return formatNumber(value) || '--'
    },
    compare (a, b) {
      const numA = parseFloat(a)
      const numB = parseFloat(b)
      if (isNaN(numA) || isNaN(numB)) return 0
      return numA - numB
    }
  }
}
</script>

<style lang="less" scoped>
.summary {
  padding: 30px 0;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
  .summary-list {
    display: flex;
    width: 100%;
    margin-bottom: 0;
    .summary-item {
      flex-grow: 1;
      flex-shrink: 0;
      padding: 0 20px;
      border-right: 1px solid #f0f0f0;
      line-height: 1;
      .text {
        font-size: 12px;
        color: #787a7d;
        i {
          margin-left: 5px;
          color: #99C3F2;
          cursor: pointer;
        }
      }
      .value {
        margin-top: 12px;
        font-size: 20px;
        color: #121315;
      }
      .compare-value {
        margin-top: 12px;
        font-size: 14px;
        color: #5b5d61;
      }
    }
  }
}
</style>
