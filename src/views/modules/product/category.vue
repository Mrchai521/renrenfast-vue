<template>
  <el-tree :data="menus" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
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