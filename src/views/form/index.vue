<template>
  <div class="app-container">
    <div class="ctx_header">
        <span>平台名称：</span><el-input v-model="platformInput" placeholder="请输入" class="h_input" type="text"></el-input>
        <div class="ctx_icon">
          <el-button type="primary" icon="el-icon-search" circle @click="onSearch"></el-button>
          <el-button type="primary" icon="el-icon-refresh-right" circle @click="onReset"></el-button>
        </div>
    </div>
    <div class="ctx_btn">
      <el-button  icon="el-icon-refresh" circle @click="refresh"></el-button>
      <el-button type="primary"  @click="onClickForm" plain v-if="hasPermission">新增平台</el-button>
    </div>
    <el-dialog :title="tip" :visible.sync="dialogFormVisible" width="600px" @closed="onCancel">
        <el-form :model="form">
            <el-form-item class="di_input" label="平台名称：" :label-width="formLabelWidth" required>
                <el-input v-model="form.name" placeholder="请输入平台名称" maxlength="60"></el-input>
            </el-form-item>
            <el-form-item class="di_input uploadItem" label="对接软件：" :label-width="formLabelWidth" required>
                <!-- <el-input v-model="form.downloadUrl" placeholder="请上传对接该平台的交互软件" :disabled="true"></el-input> -->
                <el-upload class="upload-demo" :action="uploadUrl"  :multiple="false" :limit="1" :file-list="fileList" :on-success="uploadSuccess" :before-upload="uploadBef"  v-loading="listLoading">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item class="di_input" label="版本号：" :label-width="formLabelWidth" required>
                <el-input v-model="form.vcode" placeholder="请输入上传对接软件的版本号"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="备注：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.remarks"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="onCancel">取 消</el-button>
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
          <el-button @click="editClick(scope.row,scope.$index)" type="text" size="small" v-if="hasEditPer">编辑</el-button>
          <el-button @click="deleteClick(scope.row,scope.$index)" type="text" size="small"  v-if="hasDeletePer">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="ctx_foot" :page-size="20" :pager-count="5" layout="prev, pager, next" :total="totalNum" @next-click="onClickNext" @prev-click="onClickPre" 
    @current-change="handleCurrentPage" :current-page.sync="currentPage">
    </el-pagination>
  </div>
  
</template>

<script>
import Vue from 'vue'
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
      tip:'',//对话框标题
      listLoading: true,
      platformInput:'',
      isEdit:false,
      editId:'',//编辑id
      editIndex:0,//编辑index
      fileList:[],
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
      updateLabelWidth: '80px',
      hasPermission:false,//
      hasDeletePer:false,//删除权限
      hasEditPer:false,//编辑权限
      isClick:false,
    }
  },
  created() {
    this.fetchData();
    this.getPermission();
  },
  methods:{
    fetchData() {
      this.listLoading = true
      var req = {
        page:this.listPage,
        limit:20,
        keyWord:this.platformInput,
      }
      httpRquest(this.URL.PAGE,'GET',req).then((res)=>{
        console.log(res)
        this.list = res.data.records;
        this.totalNum = res.data.total;
        this.listLoading = false;
        
      })

    },
    getPermission(){
      let permission = JSON.parse(localStorage.getItem('permission'));
      console.log(permission);
      for(let i in permission){
        if(permission[i].permission == 'platform:add'){
          this.hasPermission = true;
          }
        if(permission[i].permission == 'platform:delete'){
          this.hasDeletePer = true;
        }
        if(permission[i].permission == 'platform:edit'){
          this.hasEditPer = true;
        }
      }
    },
    //取消
    onCancel(){
      this.fileList = [];
      this.form = {};
      this.dialogFormVisible = false;
      this.listLoading = false;
    },
    //刷新
    refresh(){
      this.page = 1;
      this.fetchData();
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
      this.listLoading = false;
    },
    //上传之前
    uploadBef(){
      this.listLoading = true;
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
      this.$confirm('是否删除该平台?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //点击确定的操作(调用接口)
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
                this.totalNum = this.totalNum - 1;
              }
            })
          }).catch(() => {
            //几点取消的提示
          });
      
    },
    //新增
    onClickForm(){
      this.form = {};
      this.tip = '新增平台'
      console.log(6666666,this.tip)
      this.dialogFormVisible = true;
      this.fileList = [];
    },
    //提交
    onClickSubmit(){
      var that = this;
      if(!this.form.name || !this.form.vcode || !this.form.downloadUrl){
        this.$message({
          message: '必选项不能为空',
          type: 'error'
        });
        return;
      }
      if(this.isClick){
        return;
      }
      this.isClick = true;
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
            Vue.set(this.list,this.editIndex,res.data)
            // this.list[this.editIndex] = req;
            this.fileList = [];
            this.dialogFormVisible = false;
          }else{
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
          setTimeout(function(){
            that.isClick = false;
          },1000)
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
            this.totalNum = this.totalNum + 1;
            this.fileList = [];
          }else{
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
          setTimeout(function(){
            that.isClick = false;
          },1000)
        })
      }
      
    },
    //编辑
    editClick(e,index){
      this.tip = '编辑平台';
      // this.form = e;
      this.form = JSON.parse(JSON.stringify(e));
      this.editId = e.id;
      this.isEdit = true;
      this.editIndex = index;
      this.dialogFormVisible = true;
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

