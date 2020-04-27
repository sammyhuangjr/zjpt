<template>
  <div class="app-container">
    <div class="ctx_header">
        <div class="ctx_input">
            <span>用户名：</span><el-input v-model="input" placeholder="请输入" class="h_input" type="text"></el-input>
        </div>
        <div class="ctx_input">
            <span>所属代理：</span><el-input v-model="input" placeholder="请输入" class="h_input" type="text"></el-input>
        </div>
        <div class="ctx_icon">
          <el-button type="primary" icon="el-icon-refresh-right" circle></el-button>
          <el-button type="primary" icon="el-icon-search" circle></el-button>
            <!-- <svg-icon icon-class="refresh" class="h_icon" />
            <svg-icon icon-class="search"  class="h_icon" /> -->
        </div>
    </div>
     <div class="ctx_btn">
      <el-button  icon="el-icon-refresh" circle></el-button>
      <el-button type="primary" @click="dialogFormVisible = true" plain>新建账号</el-button>
    </div>
    <el-dialog title="新建账号" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="用户名：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="所属代理：" :label-width="formLabelWidth">
                <el-select v-model="value" placeholder="请选择所属代理" style="width:380px">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                 </el-select>
            </el-form-item>
            <el-form-item class="di_input" label="密码：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="确认密码：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="联系电话：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请再次手机号"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="备注：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
        </div>
    </el-dialog>
    <el-table class="ctx_table"
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
        label="用户名"
        width="120">
          <template slot-scope="scope">{{ scope.row.author }}</template>
        </el-table-column>
        <el-table-column
        prop="name"
        label="所属代理"
        width="120">
        </el-table-column>
        <el-table-column
        prop="address"
        label="联系电话"
        show-overflow-tooltip>
        </el-table-column>
         <el-table-column
        prop="address"
        label="创建时间"
        show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.display_time }}</span>
          </template>
        </el-table-column>
         <el-table-column
        prop="address"
        label="备注"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="address"
        label="操作"
        show-overflow-tooltip>
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="ctx_foot"
      :page-size="20"
      :pager-count="5"
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
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
      dialogFormVisible: false,
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
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .ctx_header{
        width: 100%;
        height: 150px;
        display: flex;
        align-items: center;
        span{
          margin-left: 20px;
        }
        .ctx_input{
            overflow: hidden;
            .el-input{
                width: 250px;
            }
        }
        .ctx_icon{
            width: 150px;
            margin-left: 20px;
            .h_icon{
                width: 40px;
                height: 40px;
                padding: 8px;
                background-color: #2C8CF9;
                border-radius: 8px;
            }
        }
    }
    .ctx_table{
      width: 100%;
      margin-left: 20px;
    }
    .ctx_foot{
      text-align: center;
      margin-top: 10px;
    }
    .ctx_btn{
      float: right;
      margin-bottom: 20px;
    }
</style>