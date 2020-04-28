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
                <el-input type="textarea" v-model="form.remarks"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onClickSubmit">提 交</el-button>
        </div>
    </el-dialog>
    <el-table class="ctx_t" v-if="list" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row >
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" label="平台名称" width="250">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="接入时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="editClick(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteClick(scope.row,scope.$index)" type="text" size="small">删除</el-button>
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
      isEdit:false,
      editId:'',//编辑id
      editIndex:0,//编辑index
      dialogFormVisible: false,
      form: {
          name: '',
          remarks:'',
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
      var req = {
        page:1,
        limit:20,
        keyWord:'',
      }
      httpRquest(this.URL.PAGE,'GET',{}).then((res)=>{
        console.log(res)
        this.list = res.data.records;
        this.listLoading = false;
      })

    },
    //删除
    deleteClick(e,index){
      var req = {
        id:e.id
      }
      var delUrl =  `${this.URL.DELETE}?id=${e.id} `;
      httpRquest(delUrl,'GET',).then((res)=>{
        console.log(res)
        if(res.code == 0){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.list.splice(index,1);
        }
      })
    },
    //新增
    onClickForm(){
      this.form = {};
      this.dialogFormVisible = true
    },
    //提交
    onClickSubmit(){
      if(this.isEdit){
        var req = {
          name:this.form.name,
          remarks:this.form.remarks,
          id:this.editId,
        } 
        httpRquest(this.URL.UPDATE,'post',req).then((res)=>{
          console.log(res)
          if(res.code == 0){
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.list[editIndex] = req;
          }
        })
      }else{
        var req = {
          name:this.form.name,
          remarks:this.form.remarks,
        } 
        httpRquest(this.URL.ADD,'post',req).then((res)=>{
          console.log('=>>',res)
          if(res.code == 0){
            this.$message({
              message: '新增成功',
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.list.unshift(res.data);
          }
        })
      }
      
    },
    //编辑
    editClick(e,index){
      this.dialogFormVisible = true;
      this.form = e;
      this.editId = e.id;
      this.isEdit = true;
      this.editIndex = index;
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

