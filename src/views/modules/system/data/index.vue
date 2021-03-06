<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="字典名称" prop="dictType">
        <el-select v-model="queryParams.dictType" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.dictId"
            :label="item.dictName"
            :value="item.dictType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery('queryForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="字典编码" align="center" prop="dictCode"/>
      <el-table-column label="字典标签" align="center" prop="dictLabel"/>
      <el-table-column label="字典键值" align="center" prop="dictValue"/>
      <el-table-column label="字典排序" align="center" prop="dictSort"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" size="small" type="danger">禁用</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total>0"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="queryParams.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryParams.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>

    <!-- 添加或修改字典数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入字典标签"/>
        </el-form-item>
        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入字典键值"/>
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="form.dictSort" controls-position="right" :min="1" :max="10"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listData,
  getData,
  delData,
  addData,
  updateData,
  findData
} from "@/api/system/dict/data";
import {listType, getType} from "@/api/system/dict/type";

export default {
  name: "Data",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典数据表格数据
      dataList: [],
      // 状态数据字典
      statusOptions: [
        {value: "0", label: "正常"},
        {value: "1", label: "禁用"}
      ],
      // 弹出层标题
      title: "",
      // 类型数据字典
      typeOptions: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictLabel: null,
        dictValue: null,
        dictType: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          {required: true, message: "字典标签不能为空", trigger: "blur"}
        ],
        dictValue: [
          {required: true, message: "字典键值不能为空", trigger: "blur"}
        ],
        dictSort: [
          {required: true, message: "字典排序不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    //this.getList();
    const dictId =
      this.$router.currentRoute.params &&
      this.$router.currentRoute.params.dictId;
    this.getTypeList();
    this.getType(dictId);
  },
  methods: {
    /**
     * 通过dictType查询列表
     */
    getListByDicType(dictType) {
      findData(dictType).then(response => {
        this.dataList = response.data.page;
        this.total = response.data.page.length;
        this.loading = false;
      });
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.dataList = response.data.page.list;
        this.total = response.data.page.totalCount;
        this.form.dictType = this.queryParams.dictType;
        this.loading = false;
      });
    },
    /**查询字典类型详情 */
    getType(dictId) {
      getType(dictId).then(response => {
        this.queryParams.dictType = response.data.info.dictType;
        this.form.dictType = response.data.info.dictType;
        //this.getList();
        this.getListByDicType(response.data.info.dictType);
      });
    },
    /**查询字典类型列表 */
    getTypeList() {
      listType(this.queryParams).then(response => {
        this.typeOptions = response.data.page.list;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.queryParams.pageSize = val;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictCode: null,
        dictSort: null,
        dictLabel: null,
        dictValue: null,
        dictType: null,
        cssClass: null,
        listClass: null,
        isDefault: null,
        status: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery(formName) {
      this.$refs[formName].resetFields();
      // this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      //this.reset();
      this.open = true;
      this.title = "添加字典数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      //this.reset();
      const dictCode = row.dictCode || this.ids;
      getData(dictCode).then(response => {
        this.form = response.data.info;
        this.open = true;
        this.title = "修改字典数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictCode != null) {
            updateData(this.form).then(response => {
              if (response.data.code == 0) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.open = false;
                    this.getList();
                  }
                });
              } else {
                this.$message.error(response.data.msg);
              }
            });
          } else {
            addData(this.form).then(response => {
              if (response.data.code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.open = false;
                    this.getList();
                  }
                });
              } else {
                this.$message.error(response.data.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids;
      this.$confirm(
        '是否确认删除字典数据编号为"' + dictCodes + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function () {
          return delData(dictCodes);
        })
        .then(() => {
          this.getList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有字典数据数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function () {
          return exportData(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        });
    }
  }
};
</script>
