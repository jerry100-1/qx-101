<template>
  <div class="indicator-pop">
    <el-popover
      :disabled="disabled"
      placement="bottom-start"
      width="700"
      trigger="click"
      :popper-options="{
        preventOverflowOrder: ['right', 'left', 'top', 'bottom'],
      }">

      <div class="indicator">
        <div class="indicator-tip">提示：可同时选择<span>{{ max }}</span>项</div>
        <div class="indicator-container">
          <el-checkbox-group
            @change="handleIndicatorChange"
            v-model="selectedIndicators"
            :min="1">
            <div v-for="group in indicatorGroup" :key="group.groupName" class="group">
              <label class="group-title">{{ group.groupName }}：</label>
              <div class="group-options">
                <el-checkbox v-for="item in group.indicators" :key="item.name" :disabled="item.disabled" :label="item">{{ item.text }}</el-checkbox>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>

      <div slot="reference" class="indicator-input" :class="{'is-disabled': disabled}">
        <div class="indicator-input-info" tabindex="999">
          <span v-if="!hideLabel" class="indicator-input-text">指标：</span>
          <span class="indicator-input-value">{{ selectedIndicators.map(item => item.text).join('，') }}</span>
        </div>
        <div class="indicator-input-button" tabindex="999">
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'indicator-pop',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    indicatorGroup: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    max: {
      type: Number,
      default: 2
    },
    hideLabel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedIndicators: this.value.length <= this.max ? this.value : []
    }
  },
  watch: {
    value: {
      handler: function (val, oldVal) {
        val.length <= this.max && (this.selectedIndicators = val)
      },
      deep: true
    },
    selectedIndicators: {
      handler: function (val, oldVal) {
        val.length <= this.max && this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {
    handleIndicatorChange () {
      if (this.selectedIndicators.length > this.max) {
        this.selectedIndicators.shift()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/indicator.less';

.indicator-pop {
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}

.indicator-input {
  min-width: 150px;
  display: inline-table;
  border-collapse: separate;
  border-spacing: 0;
  white-space: nowrap;
  .indicator-input-info {
    display: table-cell;
    vertical-align: middle;
    font-size: 13px;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    border: 1px solid #dcdfe6;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    background-color: #fff;
    box-sizing: content-box;
    &:hover {
      border-color: #c0c4cc;
    }
    &:focus {
      border-color: #409EFF;
      outline: 0;
    }
  }
  .indicator-input-text {
    color: #787a7d;
  }
  .indicator-input-value {
    color: #606266;
  }
  .indicator-input-button {
    display: table-cell;
    vertical-align: middle;
    width: 1px;
    padding: 0 15px;
    border: 1px solid #dcdfe6;
    border-left: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: #f5f7fa;
    color: #909399;
    cursor: pointer;
  }
  &.is-disabled {
    .indicator-input-info {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
    }
    .indicator-input-text,
    .indicator-input-value {
      color: #c0c4cc;
    }
  }
}
</style>
