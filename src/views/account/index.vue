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
            <svg-icon icon-class="refresh" class="h_icon" />
            <svg-icon icon-class="search"  class="h_icon" />
        </div>
    </div>
    <el-table class="ctx_table"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column
        label="用户名"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
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
      input:''
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
<style lang="scss">
    .ctx_header{
        width: 65%;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .ctx_input{
            overflow: hidden;
            .el-input{
                width: 200px;
            }
        }
        .ctx_icon{
            width: 100px;
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
        width: 90%;
        margin: 0 auto;
    }
</style>