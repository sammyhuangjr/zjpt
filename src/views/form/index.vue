<template>
  <div class="app-container">
    <div class="ctx_header">
        <span>平台名称：</span><el-input v-model="input" placeholder="请输入" class="h_input" type="text"></el-input>
        <div class="ctx_icon">
          <el-button type="primary" icon="el-icon-refresh-right" circle></el-button>
          <el-button type="primary" icon="el-icon-search" circle></el-button>
        </div>
    </div>
    <div class="ctx_btn">
      <el-button  icon="el-icon-refresh" circle></el-button>
      <el-button type="primary"  @click="onClickForm" plain>新增平台</el-button>
    </div>
    <el-dialog title="新增平台" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="平台名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入平台名称"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="备注：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onClickSubmit">提 交</el-button>
        </div>
    </el-dialog>
    <el-table class="ctx_t" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row >
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" label="平台名称" width="250">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="接入时间" width="200">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
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
import { httpRquest } from '@/api/URL'
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
      list: null, //平台列表
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
          desc: '',
          author:'',
        },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData();
  },
  methods:{
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })

    },

    //新增
    onClickForm(){
      dialogFormVisible = true
    },
    onClickSubmit(){
      var req = {
        name:'',
        remarks:'',
      }
      // httpRquest(this.URL.ADD,'post',req).then((res)=>{
      //   console.log('=====>',res)
      //   // dialogFormVisible = false
      // })
      this.newPost(this.URL.ADD,req).then((res)=>{
        console.log('=>>',res)
      })  
    },
    //编辑
    editClick(e){
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .ctx_header{
    width: 100%;
    margin-left: 20px;
    display: flex;
    align-items: center;
    .h_input{
      width: 250px;
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
  }
  .ctx_foot{
    text-align: center;
    margin-top: 10px;
  }
  .di_input{
      width: 500px;
  }
</style>

