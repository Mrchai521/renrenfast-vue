<template>
  <el-dialog
    :title="!dataForm.id ? '添加角色' : '修改角色'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px"
    append-to-body
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input v-model="dataForm.roleKey" placeholder="请输入权限字符"/>
      </el-form-item>
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="dataForm.roleSort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.value"
          >{{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
        <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
        <el-checkbox v-model="dataForm.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动
        </el-checkbox>
        <el-tree
          class="tree-border"
          :data="menuList"
          show-checkbox
          ref="menuListTree"
          node-key="id"
          :check-strictly="!dataForm.menuCheckStrictly"
          empty-text="加载中，请稍后"
          :props="menuListTreeProps"
        ></el-tree>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
      <!-- <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox
        ></el-tree>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {treeDataTranslate} from "@/utils";

export default {
  data() {
    return {
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      },
      menuExpand: false,
      menuNodeAll: false,
      // 字典状态
      statusOptions: [
        {value: "0", label: "正常"},
        {value: "1", label: "禁用"}
      ],
      dataForm: {
        id: 0,
        roleKey: "",
        roleSort: "",
        menuCheckStrictly: '',
        roleName: "",
        status: "",
        remark: ""

      },
      dataRule: {
        roleName: [
          {required: true, message: "角色名称不能为空", trigger: "blur"}
        ],
        roleKey: [
          {required: true, message: "权限字符不能为空", trigger: "blur"}
        ],
        roleSort: [
          {required: true, message: "角色顺序不能为空", trigger: "blur"}
        ]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.$http({
        url: this.$http.adornUrl("/sys/menu/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({data}) => {
          this.menuList = treeDataTranslate(data, "menuId");
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
            this.$refs.menuListTree.setCheckedKeys([]);
          });
        })
        .then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: "get",
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleName = data.role.roleName;
                this.dataForm.roleKey = data.role.roleKey;
                this.dataForm.roleSort = data.role.roleSort;
                this.dataForm.status = data.role.status;
                this.dataForm.remark = data.role.remark;
                var idx = data.role.menuIdList.indexOf(this.tempKey);
                if (idx !== -1) {
                  data.role.menuIdList.splice(
                    idx,
                    data.role.menuIdList.length - idx
                  );
                }
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList);
              }
            });
          }
        });
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      let treeList = this.menuList;
      for (let i = 0; i < treeList.length; i++) {
        console.log("展开：", value);
        console.log("menuListTree == = ", this.$refs.menuListTree.store.nodesMap[treeList[i].menuId])
        console.log("展开id：", treeList[i]);
        this.$refs.menuListTree.store.nodesMap[treeList[i].menuId].expanded = value;
        this.$refs.menuListTree.root.expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      this.$refs.menuListTree.setCheckedNodes(value ? this.menuList : []);
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      this.form.menuCheckStrictly = value ? true : false;
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/role/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              roleId: this.dataForm.id || undefined,
              roleName: this.dataForm.roleName,
              remark: this.dataForm.remark,
              status: this.dataForm.status,
              roleKey: this.dataForm.roleKey,
              menuIdList: [].concat(
                this.$refs.menuListTree.getCheckedKeys(),
                [this.tempKey],
                this.$refs.menuListTree.getHalfCheckedKeys()
              )
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
