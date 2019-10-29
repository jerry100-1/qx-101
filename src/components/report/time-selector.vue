<template>
  <div class="filter-container">
    <label>时间：</label>
    <div v-if="showDateType" class="filter-item mr-2">
      <el-radio-group :disabled="disabled" @change="handleDateTypeChange" v-model="proxyDateType">
        <el-radio-button v-for="item in dateTypeOptions" :key="item.id" :label="item.id">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="filter-item mr-1">
      <el-date-picker
        :disabled="disabled"
        @change="handleDateRangeChange"
        class="align-middle"
        :class="{'hide-same-date': isSingleDate}"
        v-model="proxyDateRange"
        type="daterange"
        format="yyyy/MM/dd"
        value-format="yyyy-MM-dd"
        :editable="false"
        :clearable="false"
        :picker-options="{
          disabledDate
        }"
        style="width: 230px"
        range-separator="-">
      </el-date-picker>
    </div>
    <div v-if="showCompare" class="filter-item mr-4">
      <el-checkbox v-if="compareCheckable" :disabled="disabled" @change="handleCompareStateChange" v-model="proxyIsCompareSelected">{{proxyIsCompareSelected ? '对比' : '对比时间段'}}</el-checkbox>
      <span v-else>对比</span>
      <el-radio-group v-if="showCompareShortcut && isSingleDate" :disabled="disabled" @change="handleCompareShortcutChange" v-model="proxyCompareShortcut" class="ml-1">
        <el-radio-button :label="1">前一日</el-radio-button>
        <el-radio-button :label="2">上周同期</el-radio-button>
      </el-radio-group>
      <el-date-picker
        :disabled="disabled"
        @change="handleCompareDateRangeChange"
        @blur="handleCompareDatePickerBlur"
        @focus="handleCompareDatePickerFocus"
        v-show="proxyIsCompareSelected"
        ref="compareDateRangePicker"
        class="align-middle ml-1"
        :class="{'hide-same-date': isSingleCompareDate}"
        v-model="proxyCompareDateRange"
        type="daterange"
        format="yyyy/MM/dd"
        value-format="yyyy-MM-dd"
        :editable="false"
        :clearable="false"
        :picker-options="{
          disabledDate
        }"
        style="width: 230px"
        range-separator="-">
      </el-date-picker>
    </div>
    <slot name="after-compare"></slot>
    <div v-if="showGranularity" class="filter-item">
      <el-radio-group v-model="proxyGranularity" :disabled="disabled">
        <el-radio-button v-if="enabledGranularity.includes(1)" :label="1">按时</el-radio-button>
        <el-radio-button v-if="enabledGranularity.includes(2)" :label="2">按日</el-radio-button>
        <el-radio-button v-if="enabledGranularity.includes(3)" :disabled="intervalDays < 8" :label="3">按周</el-radio-button>
        <el-radio-button v-if="enabledGranularity.includes(4)" :disabled="intervalDays < 32" :label="4">按月</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

const today = moment().format('YYYY-MM-DD')

export default {
  name: 'time-selector',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    dateTypeOptions: {
      type: Array,
      default: () => {
        return [
          {
            id: 1,
            interval: 0,
            offset: 0,
            name: '今天'
          }, {
            id: 2,
            interval: 0,
            offset: -1,
            name: '昨天'
          }, {
            id: 3,
            interval: 6,
            offset: -1,
            name: '最近7天'
          }, {
            id: 4,
            interval: 29,
            offset: -1,
            name: '最近30天'
          }
        ]
      }
    },
    // 启用的粒度选项
    enabledGranularity: {
      type: Array,
      default: () => [1, 2, 3, 4]
    },
    showDateType: {
      type: Boolean,
      default: true
    },
    // 时间 今天：1, 昨天：2, 最近7天：3，最近30天：4
    dateType: {
      type: Number,
      default: 1
    },
    // 日期范围，今天/昨天传两个日期相同的数组
    dateRange: {
      type: Array,
      default: () => {
        return [today, today]
      }
    },
    // 禁止选择的日期
    disabledDate: {
      type: Function,
      default: () => false
    },
    // 对比选项是否可点击
    compareCheckable: {
      type: Boolean,
      default: true
    },
    // 对比日期范围
    compareDateRange: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否显示对比
    showCompare: {
      type: Boolean,
      default: true
    },
    // 是否显示对比快捷选项
    showCompareShortcut: {
      type: Boolean,
      default: false
    },
    // 是否显示时间粒度
    showGranularity: {
      type: Boolean,
      default: true
    },
    // 时间粒度
    granularity: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      proxyDateType: this.dateType,
      proxyDateRange: this.dateRange,
      proxyIsCompareSelected: this.compareDateRange && this.compareDateRange.length === 2,
      proxyCompareDateRange: this.compareDateRange,
      proxyGranularity: this.granularity,
      proxyCompareShortcut: null
    }
  },
  computed: {
    isSingleDate () {
      return !(this.proxyDateRange.length === 2 && this.proxyDateRange[0] !== this.proxyDateRange[1])
    },
    isSingleCompareDate () {
      return !(this.proxyCompareDateRange.length === 2 && this.proxyCompareDateRange[0] !== this.proxyCompareDateRange[1])
    },
    intervalDays () {
      return moment(this.proxyDateRange[1]).diff(this.proxyDateRange[0], 'days')
    }
  },
  watch: {
    dateType: {
      handler: function (val, oldVal) {
        if (this.proxyDateType !== val) {
          this.proxyDateType = val
          this.handleDateTypeChange(val)
        }
      },
      deep: true
    },
    dateRange: {
      handler: function (val, oldVal) {
        this.proxyDateRange = val
      },
      deep: true
    },
    compareDateRange: {
      handler: function (val, oldVal) {
        this.proxyIsCompareSelected = val && val.length === 2
        this.proxyCompareDateRange = val
      },
      deep: true
    },
    granularity: {
      handler: function (val, oldVal) {
        this.proxyGranularity = val
      },
      deep: true
    },
    proxyDateType: {
      handler: function (val, oldVal) {
        this.$emit('update:dateType', val)
      },
      deep: true
    },
    proxyDateRange: {
      handler: function (val, oldVal) {
        if ((this.intervalDays < 8 && this.proxyGranularity === 3) || (this.intervalDays < 32 && this.proxyGranularity === 4)) {
          this.proxyGranularity = 1
        }
        this.$emit('update:dateRange', val)
      },
      deep: true
    },
    proxyCompareDateRange: {
      handler: function (val, oldVal) {
        let proxyCompareShortcut = null
        if (this.isSingleDate) {
          const diff = moment(this.proxyDateRange[0]).diff(val[0], 'days')
          if (diff === 1) {
            proxyCompareShortcut = 1
          } else if (diff === 7) {
            proxyCompareShortcut = 2
          }
        }
        this.proxyCompareShortcut = proxyCompareShortcut
        this.$emit('update:compareDateRange', val)
      },
      deep: true
    },
    proxyGranularity: {
      handler: function (val, oldVal) {
        this.$emit('update:granularity', val)
      },
      deep: true
    }
  },
  mounted () {
    this.handleDateTypeChange(this.proxyDateType)
  },
  methods: {
    getDateRange (dateType) {
      if (!dateType) return this.proxyDateRange
      if (typeof dateType.dateRange === 'function') {
        return dateType.dateRange()
      }
      const endDate = moment().add(dateType.offset, 'days').format('YYYY-MM-DD')
      const startDate = moment(endDate).subtract(dateType.interval, 'days').format('YYYY-MM-DD')
      return [startDate, endDate]
    },
    handleDateTypeChange (cbVal) {
      const dateType = this.dateTypeOptions.find(item => item.id === cbVal)
      if (dateType) {
        if (dateType.interval > 0) {
          this.proxyGranularity = 2
        } else {
          this.proxyGranularity = 1
        }
      }
      this.proxyDateRange = this.getDateRange(dateType)
      this.proxyIsCompareSelected && this.setCompareDateRange(true, true)
    },
    handleDateRangeChange (dateRange) {
      let dateTypeVal = null
      for (let i = 0; i < this.dateTypeOptions.length; i++) {
        const dateType = this.dateTypeOptions[i]
        const dr = this.getDateRange(dateType)
        if (dr[0] === dateRange[0] && dr[1] === dateRange[1]) {
          dateTypeVal = dateType.id
          break
        }
      }
      this.proxyDateType = dateTypeVal
      this.proxyIsCompareSelected && this.setCompareDateRange(true, true)
    },
    setCompareDateRange (isAllowAjustment = false, isDateTypeClicked = false) {
      if (this.proxyDateRange[0] === this.proxyDateRange[1]) {
        if (!isDateTypeClicked && this.proxyCompareDateRange.length === 2 && (!isAllowAjustment || this.proxyCompareDateRange[0] !== this.proxyDateRange[0])) {
          this.proxyCompareDateRange = [this.proxyCompareDateRange[0], this.proxyCompareDateRange[0]]
        } else {
          const date = moment(this.proxyDateRange[0]).subtract(1, 'days').format('YYYY-MM-DD')
          this.proxyCompareDateRange = [date, date]
        }
      } else {
        const diffDays = this.intervalDays
        if (!isDateTypeClicked && this.proxyCompareDateRange.length === 2 && (!isAllowAjustment || this.proxyCompareDateRange[0] !== this.proxyDateRange[0])) {
          const startDate = this.proxyCompareDateRange[0]
          const endDate = moment(startDate).add(diffDays, 'days').format('YYYY-MM-DD')
          this.proxyCompareDateRange = [startDate, endDate]
        } else {
          const endDate = moment(this.proxyDateRange[0]).subtract(1, 'days').format('YYYY-MM-DD')
          const startDate = moment(endDate).subtract(diffDays, 'days').format('YYYY-MM-DD')
          this.proxyCompareDateRange = [startDate, endDate]
        }
      }
    },
    handleCompareStateChange (cbVal) {
      if (cbVal === true) {
        this.setCompareDateRange()
        this.$refs.compareDateRangePicker.focus()
      } else {
        this.proxyCompareDateRange = []
      }
    },
    handleCompareDateRangeChange (compareDateRange) {
      this.setCompareDateRange()
    },
    handleCompareDatePickerFocus () {
      this.proxyCompareDateRange = [...this.proxyCompareDateRange]
    },
    handleCompareDatePickerBlur () {
      if (this.proxyCompareDateRange.length === 0) {
        this.proxyIsCompareSelected = false
      }
    },
    handleCompareShortcutChange (val) {
      const date = moment(this.proxyDateRange[0]).subtract(val === 1 ? 1 : 7, 'days').format('YYYY-MM-DD')
      this.proxyCompareDateRange = [date, date]
    }
  }
}
</script>

<style lang="less">
.hide-same-date {
  .el-range-input:last-of-type, .el-range-separator {
    visibility: hidden;
  }
}
</style>

<style lang="less" scoped>
.filter-container {
  .filter-item {
    display: inline-block;
    white-space: nowrap;
    margin-bottom: 15px;
  }
}
</style>
