<template>
  <div class="app-container">
    <div class="ctx_header">
        <span class="_sp">组织：</span>
        <el-select v-model="value" placeholder="全部" class="h_arg">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <span class="_sp">角色：</span>
        <el-select v-model="value" placeholder="全部" class="h_arg">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <span class="_sp">用户名：</span><el-input v-model="input" placeholder="请输入" class="h_arg" type="text"></el-input>
    </div>
    <div class="ctx_header">
      
        <span class="_sp">最近登录：</span>
        <el-date-picker v-model="value1" type="date" placeholder="选择日期" class="h_arg"></el-date-picker>
     
        <span class="_sp">联系人电话：</span><el-input v-model="input" placeholder="请输入" class="h_arg" type="text"></el-input>
        <div class="ctx_icon">
          <el-button type="primary" icon="el-icon-refresh-right" circle></el-button>
          <el-button type="primary" icon="el-icon-search" circle></el-button>
        </div>
    </div>
    <div class="ctx_btn">
      <el-button  icon="el-icon-refresh" circle></el-button>
      <el-button type="danger" @click="dialogVisible = true" plain>批量删除</el-button>
      <el-button type="primary" @click="dialogFormVisible = true" plain>新建用户</el-button>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>删除后,则该用户不可登录管理平台!</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="管理员添加" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="用户名：" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="密码：" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="确认密码：" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="组织：" :label-width="formLabelWidth">
                <el-select v-model="value" placeholder="请选择组织" style="width:380px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="di_input" label="联系人电话：" :label-width="formLabelWidth">
                 <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="状态：" :label-width="formLabelWidth">
                <el-select v-model="value" placeholder="请选择状态" style="width:380px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="di_input" label="账号类型：" :label-width="formLabelWidth">
                <el-select v-model="value" placeholder="请选择账号类型" style="width:380px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="di_input" label="备注：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="角色：" :label-width="formLabelWidth">
                 <el-checkbox-group v-model="checkList">
                    <el-checkbox label="济公网平台"></el-checkbox>
                    <el-checkbox label="马丁洛克网络柯基"></el-checkbox>
                    <el-checkbox label="第三方公司"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
        </div>
    </el-dialog>
     <el-table class="ctx_table" ref="multipleTable" :data="list" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名" width="120">
          <template slot-scope="scope">{{ scope.row.author }}</template>
        </el-table-column>
        <el-table-column prop="name" label="角色" width="120">
        </el-table-column>
        <el-table-column prop="address" label="组织" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="联系人电话" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="账号类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="状态" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.display_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="最近登录时间时间" show-overflow-tooltip>
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
      formLabelWidth: '120px'
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
  .ctx_header{
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-left: 20px;
    overflow: hidden;
    ._sp{
        width: 100px;
    }
    .h_arg{
        width: 250px;
        margin-right: 20px;
    }
    .ctx_icon{
      margin-left: 20px;
    }
  }
  .ctx_btn{
    float: right;
    margin-bottom: 20px;
  }
  .ctx_t{
    margin-left: 20px;
    margin-top: 10px;
    width: 100%;
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

