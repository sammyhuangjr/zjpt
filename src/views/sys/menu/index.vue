<template>
  <div class="app-container">
    <div class="ctx_btn">
      <el-button type="primary" @click="dialogFormVisible = true" plain>添加资源</el-button>
    </div>
    <el-dialog title="新建菜单" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="资源类型" :label-width="formLabelWidth">
                <el-select v-model="value" style="width:380px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="di_input" label="资源名称" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="权限标识" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="资源url" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="菜单图标" :label-width="formLabelWidth">
                 <el-input v-model="form.name"></el-input>
            </el-form-item>    
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
        </div>
    </el-dialog>
     <el-table class="ctx_t" ref="multipleTable" :data="list" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column label="菜单名称" width="120">
          <template slot-scope="scope">{{ scope.row.author }}</template>
        </el-table-column>
        <el-table-column prop="name" label="权限标识" width="120">
        </el-table-column>
        <el-table-column prop="address" label="菜单url" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="排序" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="创建时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="更新日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.display_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="ctx_foot" :page-size="20" :pager-count="5" layout="prev, pager, next" :total="1000"></el-pagination>
  </div>
  
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      input:'',
      value1:'',//最近登录时间
      dialogFormVisible: false,//添加角色
      dialogVisible: false,//批量删除
      checkList:[],//角色
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
  }
}
</script>

<style lang="scss" scoped>
  .ctx_btn{
    float: right;
    margin-bottom: 20px;
  }
  .ctx_t{
    margin-top: 10px;
    width: 100%;
    padding: 0 5%;
    .ctx_svg{
        width: 30px;
        height: 30px;
    }
  }
  .ctx_foot{
    text-align: center;
    margin-top: 10px;
  }
  .di_input{
      width: 500px;
  }
 
</style>

