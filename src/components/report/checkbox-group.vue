<template>
  <div>
    <el-checkbox-button v-model="checkAll" :disabled="disabled || options.filter(item => item.disabled).length > 0" @change="handleCheckAllChange" class="single-checkbox-button">全部</el-checkbox-button>
    <el-checkbox-group v-model="checkedOptions" :disabled="disabled" :min="min" class="d-inline-block ml-3">
      <el-checkbox v-for="item in options" :disabled="item.disabled" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'checkbox-group',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    options: {
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
    min: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      checkAll: this.value.length === this.options.length,
      checkedOptions: this.value
    }
  },
  watch: {
    options: {
      handler: function (val, oldVal) {
        val.forEach(item => {
          if (item.disabled) {
            const index = this.checkedOptions.findIndex(id => id === item.id)
            index > -1 && this.checkedOptions.splice(index, 1)
          }
        })
        if (this.checkedOptions.length === 0) {
          const options = val.filter(item => !item.disabled)
          if (options.length > 0) {
            this.checkedOptions = [options[0].id]
          } else {
            this.checkedOptions = []
          }
        }
      },
      deep: true
    },
    checkedOptions: {
      handler: function (val, oldVal) {
        this.checkAll = val.length === this.options.length
        this.$emit('input', this.checkedOptions)
      },
      deep: true
    }
  },
  methods: {
    handleCheckAllChange (val) {
      if (val) {
        this.checkedOptions = this.options.filter(item => !item.disabled).map(item => item.id)
      } else {
        const options = this.options.filter(item => !item.disabled)
        if (options.length > 0) {
          this.checkedOptions = [options[0].id]
        } else {
          this.checkedOptions = []
        }
      }
    }
  }
}
</script>

<style lang="less">
.single-checkbox-button {
  .el-checkbox-button__inner {
    border-left: 1px solid #dcdfe6 !important;
    border-radius: 4px !important;
  }
  &.is-focus, &.is-checked {
    .el-checkbox-button__inner {
      border-color: #409EFF !important;
    }
  }
}
</style>
