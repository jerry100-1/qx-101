<template>
  <div>
    <div class="table-indicator-button">
      <el-button :disabled="disabled" @click.stop="toggleVisible"><font-awesome-icon :icon="icons.signature" class="mr-1" />自定义指标</el-button>
    </div>
    <div @click.stop="" v-show="visible" class="indicator table-indicator">
      <div class="shortcuts">
        <em class="gray">提示：可同时选择<em class="red">{{ max }}</em>项</em>
        <el-button @click="selectedIndicators = [...shortcuts]" :type="isDefault ? 'primary' : 'text'" size="mini" class="shortcutsButton">系统默认指标</el-button>
      </div>
      <div class="indicator-container">
        <el-checkbox-group
          @change="handleIndicatorChange"
          v-model="selectedIndicators"
          :min="1">
          <div v-for="group in indicatorGroup" :key="group.groupName" class="group">
            <label class="group-title">{{ group.groupName }}：</label>
            <div class="group-options">
              <el-checkbox v-for="item in group.indicators" :key="item.name" :label="item">{{ item.text }}</el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="indicator-confirm">
        <el-button @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { faSignature } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'indicator-panel',
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
    shortcuts: {
      type: Array,
      default: () => {
        return []
      }
    },
    max: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      visible: false,
      icons: {
        signature: faSignature
      },
      selectedIndicators: this.value.length <= this.max ? [...this.value] : []
    }
  },
  computed: {
    isDefault () {
      return this.shortcuts.length === this.selectedIndicators.length && [...this.shortcuts.map(item => item.name)].sort().join(',') === [...this.selectedIndicators.map(item => item.name)].sort().join(',')
    }
  },
  watch: {
    value: {
      handler: function (val, oldVal) {
        val.length <= this.max && (this.selectedIndicators = [...val])
      },
      deep: true
    }
  },
  mounted () {
    this.$parent.$el.addEventListener('click', this.hide, false)
  },
  beforeDestroy () {
    this.$parent.$el.removeEventListener('click', this.hide)
  },
  methods: {
    hide () {
      this.visible = false
      this.selectedIndicators = [...this.value]
    },
    toggleVisible () {
      if (this.visible) {
        this.hide()
      } else {
        this.visible = true
      }
    },
    handleIndicatorChange () {
      if (this.selectedIndicators.length > this.max) {
        this.selectedIndicators.shift()
      }
    },
    confirm () {
      this.$emit('input', this.selectedIndicators)
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/indicator.less';

.table-indicator-button {
  margin-bottom: 5px;
}
.table-indicator {
  border-radius: 2px;
  color: rgb(50, 52, 55);
  background-color: rgb(255, 255, 255);
  box-shadow: 0 1px 5px rgba(0,0,0,.2);
  .shortcuts {
    height: 42px;
    line-height: 42px;
    border-bottom: 1px solid rgb(225, 227, 228);
    em {
      font-style: normal;
    }
    > em {
      margin: 0 10px 0 15px;
    }
    .gray {
      color: rgb(160, 162, 165);
    }
    .red {
      color: rgb(255, 0, 0);
    }
    .shortcutsButton {
      padding: 5px 10px;
    }
  }
  .indicator-container {
    padding: 15px;
  }
  .indicator-confirm {
    padding: 0 125px 20px;
  }
}
</style>
