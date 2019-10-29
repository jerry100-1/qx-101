<template>
  <el-popover
    @show="show"
    @hide="hide"
    :disabled="disabled"
    v-model="visible"
    placement="bottom-start"
    width="520"
    trigger="click"
    popper-class="tree-transfer-popper"
    :popper-options="{
      preventOverflowOrder: ['right', 'left', 'top', 'bottom'],
    }">
    <div>
      <div class="tree-transfer">
        <div class="tree-transfer-panel">
          <p class="tree-transfer-panel__header">
            <span>待选</span>
            <span v-if="showShortcut" class="select-shortcut-wrapper">
              <el-button @click="selectAllSource(true)" type="text" class="select-all">全选</el-button>
              <el-button @click="selectInvertSource" :disabled="selectedSourceData.length === 0" type="text" class="select-invert">反选</el-button>
            </span>
          </p>
          <div class="tree-transfer-panel__body">
            <div class="tree-transfer-panel__filter">
              <el-input
                clearable
                prefix-icon="el-icon-search"
                placeholder="请输入搜索内容"
                v-model.trim="sourceFilterText">
              </el-input>
            </div>
            <div class="tree-transfer-panel__list is-filterable">
              <el-tree
                @check="checkSourceNode"
                empty-text="无数据"
                class="filter-tree"
                :data="sourceData"
                :props="sourceDefaultProps"
                node-key="id"
                show-checkbox
                check-on-click-node
                :default-expand-all="false"
                :expand-on-click-node="false"
                :filter-node-method="sourceFilterNode"
                ref="source">
              </el-tree>
            </div>
          </div>
        </div>
        <div class="tree-transfer__buttons">
          <el-button
            @click="targetToSource"
            :disabled="selectedTargetData.length === 0"
            type="primary"
            icon="el-icon-arrow-left"
            class="tree-transfer__button"
            :class="{'is-disabled': selectedTargetData.length === 0}"
            circle>
          </el-button>
          <el-button
            @click="sourceToTarget"
            :disabled="selectedSourceData.length === 0"
            type="primary"
            icon="el-icon-arrow-right"
            class="tree-transfer__button"
            :class="{'is-disabled': selectedSourceData.length === 0}"
            circle>
          </el-button>
        </div>
        <div class="tree-transfer-panel">
          <p class="tree-transfer-panel__header">
            <span>已选</span>
            <span v-if="showShortcut" class="select-shortcut-wrapper">
              <el-button @click="selectAllTarget(true)" type="text" class="select-all">全选</el-button>
              <el-button @click="selectInvertTarget" :disabled="selectedTargetData.length === 0" type="text" class="select-invert">反选</el-button>
            </span>
          </p>
          <div class="tree-transfer-panel__body">
            <div class="tree-transfer-panel__filter">
              <el-input
                clearable
                prefix-icon="el-icon-search"
                placeholder="请输入搜索内容"
                v-model.trim="targetFilterText">
              </el-input>
            </div>
            <div class="tree-transfer-panel__list is-filterable">
              <el-tree
                @check="checkTargetNode"
                empty-text="无数据"
                class="filter-tree"
                :data="targetData"
                :props="targetDefaultProps"
                node-key="id"
                show-checkbox
                check-on-click-node
                :default-expand-all="false"
                :expand-on-click-node="false"
                :filter-node-method="targetFilterNode"
                ref="target">
              </el-tree>
            </div>
          </div>
        </div>
      </div>
      <div class="foot-btn-group">
        <el-button @click="confirm" type="primary">确定</el-button>
        <el-button @click="empty">清空</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </div>
    <template slot="reference">
      <slot>
        <el-input
          :disabled="disabled"
          :value="value.map(item => item.fullLabel || item.label).join('，')"
          :style="width ? { width: isNaN(width) ? width : width + 'px' } : {}"
          class="tree-transfer-select"
          :placeholder="placeholder"
          readonly>
          <i slot="suffix" v-if="!disabled && value.length > 0" @click.stop="clear" class="clear el-input__icon el-icon-circle-close el-input__clear"></i>
          <el-button slot="append" icon="el-icon-arrow-down"></el-button>
        </el-input>
      </slot>
    </template>
  </el-popover>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  name: 'tree-transfer',
  props: {
    // 源数据
    source: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 确定选择的数据
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showShortcut: {
      type: Boolean,
      default: false
    },
    /**
     * 值由什么组成
     * branch: 分支节点
     * leaf: 叶子节点
     */
    valueConsistsOf: {
      type: String,
      default: 'branch',
      validator: function (value) {
        return ['branch', 'leaf'].indexOf(value) !== -1
      }
    },
    width: {
      type: [String, Number],
      default: null
    },
    placeholder: {
      type: String,
      default: '全部'
    }
  },
  data () {
    return {
      visible: false,
      sourceData: deepClone(this.source),
      sourceDefaultProps: {
        children: 'children',
        label: 'label',
        disabled: function (data, node) {
          const childNodes = node.childNodes
          return data.disabled || data.disabledBySelect || (childNodes && childNodes.length > 0 && childNodes.filter(item => !item.disabled).length === 0)
        }
      },
      targetData: deepClone(this.value),
      targetDefaultProps: {
        children: 'childrenData',
        label: function (data, node) {
          return data.fullLabel || data.label
        },
        disabled: false
      },
      sourceFilterText: null,
      targetFilterText: null,
      isAllSourceSelected: false,
      isAllTargetSelected: false,
      selectedSourceData: [],
      selectedTargetData: []
    }
  },
  computed: {
    sourceNodesLength () {
      return this.getNodeLength(this.sourceData)
    }
  },
  watch: {
    source: {
      handler: function (val, oldVal) {
        this.sourceData = deepClone(val)
        this.visible = false
      },
      deep: false
    },
    value: {
      handler: function (val, oldVal) {
        this.targetData = deepClone(val)
      },
      deep: false
    },
    sourceFilterText (val) {
      this.selectAllSource(false)
      this.$refs.source.filter(val)
    },
    targetFilterText (val) {
      this.selectAllTarget(false)
      this.$refs.target.filter(val)
    }
  },
  methods: {
    getNodeLength (arr) {
      let length = 0
      arr.forEach(item => {
        if (!item.disabled) {
          length++
        }
        if (item.children) {
          length += this.getNodeLength(item.children)
        }
      })
      return length
    },
    getNodes (arr) {
      const all = []
      arr.forEach(item => {
        if (!item.disabled && (!this.sourceFilterText || item.label.indexOf(this.sourceFilterText) !== -1)) {
          const node = this.$refs.source.getNode(item.id)
          const parent = this.getTopParent(node)
          if (parent) {
            all.push(parent.data)
          } else {
            all.push(item)
          }
        } else if (item.children) {
          all.push(...this.getNodes(item.children))
        }
      })
      return all
    },
    getTopParent (node) {
      const parent = node.parent
      if (parent && parent.level > 0) {
        return this.getTopParent(parent) || (!parent.data.disabled ? parent : null)
      } else {
        return null
      }
    },
    isParentMatch (node, value) {
      const parent = node.parent
      if (parent && parent.level > 0) {
        const match = parent.data.label.indexOf(value) !== -1
        if (match) {
          return true
        } else {
          return this.isParentMatch(parent, value)
        }
      } else {
        return false
      }
    },
    isParentIn (node, targetData) {
      const parent = node.parent
      if (parent.level === 0) {
        return false
      } else if (parent.level === 1) {
        return targetData.findIndex(item => parent.data.id === item.id) > -1
      } else {
        const index = targetData.findIndex(item => parent.data.id === item.id)
        if (index > -1) {
          return true
        } else {
          return this.isParentIn(parent, targetData)
        }
      }
    },
    selectAllSource (checked) {
      if (checked) {
        const checkedNodes = this.$refs.source.getCheckedNodes()
        this.$refs.source.setCheckedNodes([...checkedNodes, ...this.getNodes(this.sourceData)])
      } else {
        const checkedNodes = this.$refs.source.getCheckedNodes()
        this.$refs.source.setCheckedNodes([...checkedNodes.filter(data => data.disabledBySelect)])
      }
      const checkedNodes = this.$refs.source.getCheckedNodes()
      this.selectedSourceData = checkedNodes.filter(data => {
        const node = this.$refs.source.getNode(data.id)
        return !node.disabled
      })
    },
    selectInvertSource () {
      const selectedSourceData = this.selectedSourceData
      let checkedNodes = this.$refs.source.getCheckedNodes()
      this.$refs.source.setCheckedNodes([...checkedNodes.filter(data => data.disabledBySelect), ...this.getNodes(this.sourceData)])
      selectedSourceData.forEach(data => {
        this.$refs.source.setChecked(data.id, false, true)
      })
      checkedNodes = this.$refs.source.getCheckedNodes()
      this.selectedSourceData = checkedNodes.filter(data => {
        const node = this.$refs.source.getNode(data.id)
        return !node.disabled
      })
    },
    selectAllTarget (checked) {
      if (checked) {
        this.$refs.target.setCheckedNodes(this.targetFilterText ? this.targetData.filter(item => item.label.indexOf(this.targetFilterText) !== -1) : this.targetData)
      } else {
        this.$refs.target.setCheckedNodes([])
      }
      const checkedNodes = this.$refs.target.getCheckedNodes()
      this.selectedTargetData = checkedNodes
    },
    selectInvertTarget () {
      const selectedTargetData = this.selectedTargetData
      const selectedDataMap = new Map()
      selectedTargetData.forEach(item => {
        selectedDataMap.set(item.id, item)
      })
      this.$refs.target.setCheckedNodes(this.targetData.filter(item => (!this.targetFilterText || item.label.indexOf(this.targetFilterText) !== -1) && !selectedDataMap.has(item.id)))
      const checkedNodes = this.$refs.target.getCheckedNodes()
      this.selectedTargetData = checkedNodes
    },
    sourceFilterNode (value, data, node) {
      return !value || data.label.indexOf(value) !== -1 || this.isParentMatch(node, value)
    },
    targetFilterNode (value, data) {
      if (!value) return true
      return (data.fullLabel || data.label).indexOf(value) !== -1
    },
    checkSourceNode (node, { checkedNodes }) {
      this.isAllSourceSelected = this.sourceNodesLength === checkedNodes.length
      this.selectedSourceData = checkedNodes.filter(data => {
        const node = this.$refs.source.getNode(data.id)
        return !node.disabled
      })
    },
    checkTargetNode (node, { checkedNodes }) {
      this.isAllTargetSelected = this.targetData.length === checkedNodes.length
      this.selectedTargetData = checkedNodes
    },
    sourceToTarget () {
      this.isAllSourceSelected = false

      // 禁用已选择的所有节点
      this.selectedSourceData.forEach(data => {
        data.disabledBySelect = true
      })

      const selectedSourceData = this.selectedSourceData.filter(data => {
        if (this.valueConsistsOf === 'leaf') {
          // 返回叶子节点
          return !data.children
        } else {
          // 节点的父节点已经是选中状态则过滤掉该节点
          const parent = this.$refs.source.getNode(data.id).parent
          const isParentInCheckedNodes = parent.level !== 0 && this.selectedSourceData.findIndex(item => parent.data.id === item.id) > -1
          return !isParentInCheckedNodes
        }
      })
      const targetData = [
        ...this.targetData.filter(data => {
          // leaf模式下不过滤；branch模式下，目标节点数据中，节点的父节点已经在已选节点中的，将其过滤掉
          return this.valueConsistsOf === 'leaf' || !this.isParentIn(this.$refs.source.getNode(data.id), selectedSourceData)
        }),
        ...selectedSourceData
      ]
      this.selectedSourceData = []
      this.targetData = targetData
      this.$refs.source.filter(this.sourceFilterText)
      this.$nextTick(() => {
        const checkedNodes = this.$refs.source.getCheckedNodes()
        this.$refs.source.setCheckedNodes([...checkedNodes, ...this.selectedTargetData])
        this.$refs.target.setCheckedNodes(this.selectedTargetData)
        this.$refs.target.filter(this.targetFilterText)
      })
    },
    targetToSource () {
      this.isAllTargetSelected = false
      const targetData = [...this.targetData]

      this.selectedTargetData.forEach(data => {
        const node = this.$refs.source.getNode(data.id)
        node.data.disabledBySelect = false
        this.setParentDisabled(node, false)
        this.setChildrenDisabled(node.data, false)
        const index = targetData.findIndex(target => target.id === data.id)
        targetData.splice(index, 1)
      })

      this.selectedTargetData.forEach(data => {
        this.$refs.source.setChecked(data.id, false, true)
      })

      this.selectedTargetData = []
      this.targetData = targetData
      this.$refs.source.filter(this.sourceFilterText)
      this.$nextTick(() => {
        this.$refs.target.filter(this.targetFilterText)
      })
    },
    setParentDisabled (node, status) {
      const parent = node.parent
      if (parent.level !== 0) {
        parent.data.disabledBySelect = status
        this.setParentDisabled(parent, status)
      }
    },
    setChildrenDisabled (data, status) {
      const children = data.children
      if (children) {
        children.forEach(item => {
          item.disabledBySelect = status
          this.setChildrenDisabled(item, status)
        })
      }
    },
    empty () {
      this.targetFilterText = null
      this.selectAllTarget(true)
      this.targetToSource()
    },
    clear () {
      this.$emit('input', [])
      this.visible = false
    },
    confirm () {
      this.$emit('input', this.targetData)
      this.visible = false
    },
    show () {
      this.targetData.forEach(data => {
        const node = this.$refs.source.getNode(data.id)
        node.data.disabledBySelect = true
        this.$refs.source.setChecked(data.id, true, true)
        this.setChildrenDisabled(node.data, true)
      })
      this.$refs.source.filter()
    },
    hide () {
      this.sourceFilterText = null
      this.targetFilterText = null
      this.isAllSourceSelected = false
      this.isAllTargetSelected = false
      this.selectedSourceData = []
      this.selectedTargetData = []
      this.sourceData = deepClone(this.source)
      this.targetData = deepClone(this.value)
    }
  }
}
</script>

<style lang="less">
.tree-transfer-popper {
  .tree-transfer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .tree-transfer-panel {
      border: 1px solid #ebeef5;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      width: 200px;
      max-height: 100%;
      box-sizing: border-box;
      position: relative;
      .el-checkbox__label {
        padding-left: 8px;
      }
      .tree-transfer-panel__header {
        display: flex;
        height: 40px;
        line-height: 40px;
        background: #f5f7fa;
        margin: 0;
        padding-left: 15px;
        border-bottom: 1px solid #ebeef5;
        box-sizing: border-box;
        color: #000;
        .el-checkbox .el-checkbox__label {
          font-size: 16px;
          color: #303133 !important;
          font-weight: 400;
        }
        .select-shortcut-wrapper {
          flex-grow: 1;
          text-align: right;
          .select-all {
            margin: 0 10px 0 0;
            padding: 0;
            outline: none;
          }
          .select-invert {
            margin: 0 15px 0 0;
            padding: 0;
            outline: none;
          }
        }
      }
      .tree-transfer-panel__body {
        height: 246px;
      }
      .tree-transfer-panel__filter {
        text-align: center;
        margin: 15px;
        box-sizing: border-box;
        display: block;
        width: auto;
        .el-input__inner {
          height: 32px;
          width: 100%;
          font-size: 12px;
          display: inline-block;
          box-sizing: border-box;
          border-radius: 16px;
          padding-right: 10px;
          padding-left: 30px;
        }
      }
      .tree-transfer-panel__list {
        margin: 0;
        padding: 6px 0;
        list-style: none;
        height: 246px;
        overflow: auto;
        box-sizing: border-box;
        &.is-filterable {
          height: 194px;
          padding-top: 0;
        }
        .el-tree-node {
          .el-tree-node__children {
            overflow: visible !important;
          }
        }
      }
    }
    .tree-transfer__buttons {
      .tree-transfer__button {
        display: block;
        margin: 0 auto;
        padding: 10px;
        border-radius: 50%;
        color: #fff;
        background-color: #409EFF;
        font-size: 0;
        &:focus {
          outline: none;
        }
        &:first-child {
          margin-bottom: 10px;
        }
        &:nth-child(2) {
          margin: 0;
        }
        &.is-disabled, &.is-disabled:hover, &.is-disabled:focus {
          border: 1px solid #dcdfe6;
          background-color: #f5f7fa;
          color: #c0c4cc;
        }
        i, span {
          font-size: 14px;
        }
      }
    }
  }
  .foot-btn-group {
    margin-top: 10px;
    text-align: right;
  }
}
</style>

<style lang="less" scoped>
.tree-transfer-select {
  width: 200px;
  vertical-align: middle;
  .clear {
    display: none;
  }
  &:hover {
    .clear {
      display: block;
    }
  }
}
</style>
