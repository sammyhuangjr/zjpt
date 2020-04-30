<template>
  <div class="app-container">
    <div class="ctx_header">
        <span>平台名称：</span><el-input v-model="platformInput" placeholder="请输入" class="h_input" type="text"></el-input>
        <div class="ctx_icon">
          <el-button type="primary" icon="el-icon-refresh-right" circle @click="onReset"></el-button>
          <el-button type="primary" icon="el-icon-search" circle @click="onSearch"></el-button>
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
            <el-form-item class="di_input uploadItem" label="对接软件：" :label-width="formLabelWidth">
                <!-- <el-input v-model="form.downloadUrl" placeholder="请上传对接该平台的交互软件" :disabled="true"></el-input> -->
                <el-upload class="upload-demo" :action="uploadUrl"  :multiple="false" :limit="1" :file-list="fileList" :on-success="uploadSuccess">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item class="di_input" label="版本号：" :label-width="formLabelWidth">
                <el-input v-model="form.vcode" placeholder="请输入上传对接软件的版本号"></el-input>
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
      <el-table-column align="center" label="平台名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="接入时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="软件版本" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.vcode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="下载" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.downloadUrl" target="_blank">{{ scope.row.downloadUrl }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button @click="editClick(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteClick(scope.row,scope.$index)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="ctx_foot" :page-size="20" :pager-count="5" layout="prev, pager, next" :total="totalNum" @next-click="onClickNext" @prev-click="onClickPre" 
    @current-change="handleCurrentPage" :current-page.sync="currentPage">
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
      totalNum:0,
      listLoading: true,
      platformInput:'',
      isEdit:false,
      editId:'',//编辑id
      editIndex:0,//编辑index
      fileList:[{name:'',url:''}],
      dialogFormVisible: false,
      listPage:1,//当前页数
      currentPage:1,
      uploadUrl:process.env.VUE_APP_BASE_API + this.URL.UPLOAD,//上传地址
      form: {
          name: '',
          remarks:'',
          downloadUrl:'',
          vcode:'',
        },
      formLabelWidth: '120px',
      updateLabelWidth: '80px'
    }
  },
  created() {
    this.fetchData();
  },
  methods:{
    fetchData() {
      console.log(666666666)
      this.listLoading = true
      var req = {
        page:this.listPage,
        limit:20,
        keyWord:this.platformInput,
      }
      httpRquest(this.URL.AGENT_RECORD,'GET',req).then((res)=>{
        console.log(res)
        this.list = res.data.records;
        this.listLoading = false;
      })

    },
    //上一页
    onClickPre(){
      this.listPage = this.listPage - 1;
      this.fetchData();
    },
    //下一页
    onClickNext(){
      this.listPage = this.listPage + 1;
      this.fetchData();
    },
    //选择页面
    handleCurrentPage(){
      this.listPage = this.currentPage;
      this.fetchData();
    },
    uploadSuccess(file, fileList){
      console.log(file,fileList);
      this.form.downloadUrl = file.data;
    },
    //搜索
    onSearch(){
      this.listPage = 1;
      this.fetchData();
    },
    onReset(){
      this.snInput = '';
      this.platformInput = '';
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
      this.dialogFormVisible = true;
      this.fileList = [];
    },
    //提交
    onClickSubmit(){
      if(this.isEdit){
        var req = {
          name:this.form.name,
          remarks:this.form.remarks,
          id:this.editId,
          vcode:this.form.vcode,
          downloadUrl:this.form.downloadUrl
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
          vcode:this.form.vcode,
          downloadUrl:this.form.downloadUrl
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
    margin-right: 20px;
  }
  .ctx_t{
    margin-left: 20px;
    margin-top: 10px;
    width: 100%;
    margin-right: 20px;
  }
  .ctx_foot{
    text-align: center;
    margin-top: 10px;
  }
  .di_input{
    width: 400px;
  }
  .uploadInput{
    width: 350px;;
  }
  // .uploadItem .el-form-item__content{
  //   display: flex !important;
  // }
</style>

