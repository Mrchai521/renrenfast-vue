<template>
<div>
  <el-tree :data="menus" :props="defaultProps"  @node-click="handleNodeClick" show-checkbox node-key="catId"  :default-expanded-keys="expandedkey">
     <span class="custom-tree-node" slot-scope="{ node, data }">
      <!-- 显示节点的名称  -->
      <span>{{ node.label }}</span>
      <span>
        <!-- 两个按钮    => 箭头函数 调用指定的方法 -->
        <el-button v-if="node.level<=2" type="text" size="mini" @click="() => append(data)">新增</el-button>
        <el-button type="text" size="mini" @click="()=>update(data)">修改</el-button>
        <el-button v-if="node.childNodes.length==0" type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
      </span>
    </span>
  </el-tree>
  <el-dialog title="添加分类" :visible.sync="dialogVisible" width="30%">
  <el-form :model="category">
      <el-form-item label="分类名称">
        <el-input v-model="category.name" auto-complete="off"> </el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitData">确 定</el-button>
  </span>
</el-dialog>
</div>

</template>

<script>
export default {
  components: {},
  data() {
    return {
      //弹窗的标题
      title:"",
      category: { 
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 0,
        sort: 0,
        catId: null,
        productUnit: "",
        icon: "",
        },
      dialogVisible: false,
      // 操作类型 是修改还是新增
      dialogType:"",
      expandedkey:[],
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
    submitData(){
      if(this.dialogType=="add"){
        //新增操作
        this.addCategory();
      }
      if(this.dialogType=="update"){
        //修改操作
        this.updateCategory();
      }
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
     //展开
    append(data) {
     console.log("展开的数据",data);
      this.dialogType = "add";
      this.title = "添加分类"
      //点击 append 弹出添加分类的对话框
      this.dialogVisible = true;
      //父级的id
      this.category.parentCid = data.catId;
      //分类的层级, 当前层级, 加一
      this.category.catLevel = data.catLevel * 1 + 1;
    },
    //添加分类
    addCategory(){
       //点击添加分类，关闭表单
      this.dialogVisable=false;
      console.log("提交的表单数据 " , this.category);
      this.$http({
        url: this.$http.adornUrl("/product/pmscategory/save"),
        method: "post",
        data: this.$http.adornData(this.category,false),
      }).then(({data})=>{
        //添加成功
        this.$message({
          type:"success",
          message:"分类添加成功！"
        });
        this.dialogVisible = false;
        this.getMenus();
        this.expandedkey = [this.category.parentCid];
        this.category.name="";
      });
    },
    //修改分类
    update(data){
      this.dialogType = "update";
      this.title = "修改分类";
      this.dialogVisible=true;
      //从后端接口查询需要修改的数据
      this.$http({
        url:this.$http.adornUrl(`/product/pmscategory/info/${data.catId}`),
        method:"get",
      }).then(({data})=>{
        this.category.name = data.data.name;
        this.category.catId = data.data.catId;
        this.category.icon = data.data.icon; 
        this.category.parentCid = data.data.parentCid;
        this.category.productUnit = data.data.productUnit;
      });
    },
    //点击确定按钮修改分类
    updateCategory(){
      //修改发送的数据.  注意只提交要修改的数据和id , 不能提交其他数据, 否则数据库中会修改其他数据为默认值,导致数据丢失.
      var { catId, name, icon, productUnit } = this.category;
      this.$http({
        url:this.$http.adornUrl("/product/pmscategory/update"),
        method:"post",
        data:this.$http.adornData({catId, name, icon, productUnit},false),
      }).then(({data})=>{
        //修改成功操作
        this.$message({
          type:"success",
          message:"商品分类修改成功！"
        })
        
        this.getMenus();
        this.expandedkey = [this.category.parentCid];
        this.category.name = "";
        this.category.productUnit = "";
        this.category.icon = "";
        this.dialogVisible = false;
      });
    },
    //删除分类
    remove(node, data) {
      this.$confirm(`是否删除[${data.name}]菜单?`,"提示",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(()=>{
        //点击确定出发then
      var idArr= [data.catId];
      //调用删除接口
      this.$http({
        url: this.$http.adornUrl("/product/pmscategory/delete"),
        method:"post",
        data:this.$http.adornData(idArr, false),
      }).then(({data})=>{
        console.log("成功删除remove" , node, data);
        this.$message({
          type:"success",
          message:"分类删除成功！",
        });
        this.getMenus();
        this.expandedkey = [node.parent.data.catId];
      });
      }).catch(()=>{});
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