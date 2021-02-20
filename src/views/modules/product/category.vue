<template>
  <el-tree :data="menus" :props="defaultProps" @node-click="handleNodeClick" show-checkbox node-key="catId">
     <span class="custom-tree-node" slot-scope="{ node, data }">
      <!-- 显示节点的名称  -->
      <span>{{ node.label }}</span>
      <span>
        <!-- 两个按钮    => 箭头函数 调用指定的方法 -->
        <el-button v-if="node.level<=2" type="text" size="mini" @click="() => append(data)">展开</el-button>
        <el-button v-if="node.childNodes.length==0" type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
      </span>
    </span>
  </el-tree>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      menus: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    getMenus() {
      this.$http({
        url: this.$http.adornUrl("/product/pmscategory/list/tree"),
        method: "get"
      }).then(({data}) => {
        console.log("成功获取到菜单数据 .... " , data.data);
        this.menus = data.data
      });
    },
    append(data) {
      console.log("append " , data);
    },
    remove(node, data) {
      console.log("remove" , node, data);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）  组件创建完成就发送请求
  created() {
      this.getMenus();

  },
};
</script>

<style>
</style>