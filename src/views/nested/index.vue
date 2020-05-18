<template>
  <div class="app-container">
    <div class="ctx_header">
        <span>设备sn：</span><el-input v-model="snInput" placeholder="请输入" class="h_input" type="text"></el-input>
        <span>接入平台：</span>
        <el-select v-model="platId" placeholder="请选择">
          <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <div class="ctx_icon">
          <el-button type="primary" icon="el-icon-search" circle @click="onSearch"></el-button>
          <el-button type="primary" icon="el-icon-refresh-right" circle @click="onReset"></el-button>
        </div>
    </div>
    <el-dialog title="查看设备授权详情" :visible.sync="dialogDetailFormVisible" width="600px">
        <el-form :model="detailFrom">
            <el-form-item class="di_input" label="所属代理：" :label-width="formLabelWidth">
                {{detailFrom.agentName}}
            </el-form-item>
            <el-form-item class="di_input" label="设备sn：" :label-width="formLabelWidth">
                {{detailFrom.sn}}
            </el-form-item>
            <el-form-item class="di_input" label="接入平台：" :label-width="formLabelWidth">
                {{detailFrom.platformName}}
            </el-form-item>
            <el-form-item class="di_input" label="接入状态：" :label-width="formLabelWidth">
                {{detailFrom.statusStr}}
            </el-form-item>
            <el-form-item class="di_input" label="接入时间：" :label-width="formLabelWidth">
                {{detailFrom.createTime}}
            </el-form-item>
            <el-form-item class="di_input" label="备注：" :label-width="formLabelWidth">
                {{detailFrom.remarks}}
            </el-form-item>
        </el-form>
    </el-dialog>
    <div class="ctx_btn">
      <el-button  icon="el-icon-refresh" circle @click="refresh"></el-button>
      <el-button type="primary" @click="onClickAuth" plain v-if="hasPermission">设备授权</el-button>
    </div>
    <el-dialog title="设备授权" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="所属代理：" :label-width="formLabelWidth">
                <el-select v-model="form.agentId" placeholder="请选择所属代理商" style="width:380px" @change="getPlatById">
                    <el-option v-for="item in agentList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="di_input" label="设备sn：" :label-width="formLabelWidth">
                <el-input v-model="form.sn" placeholder="请输入设备sn号"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="接入平台：" :label-width="formLabelWidth">
                <el-select v-model="form.platformId" placeholder="请选择接入的平台" style="width:380px">
                    <el-option v-for="item in platformListById" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
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
    <el-table class="ctx_t" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" label="所属代理商" width="120">
        <template slot-scope="scope">
          {{ scope.row.agentName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备sn" width="120">
        <template slot-scope="scope">
          {{ scope.row.sn }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="接入平台" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.platformName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="接入状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.statusStr }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="在线状态" show-overflow-tooltip>
          <svg-icon icon-class="online" class="ctx_svg"/>   
      </el-table-column>
      <el-table-column align="center" label="接入时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="onClickDelete(scope.row,scope.$index)" v-if="hasDeletePer">删除</el-button>
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
      list: null, //设备授权列表
      totalNum:0,
      listLoading: true,
      snInput:'',
      platformInput:'',
      dialogFormVisible: false,
      dialogDetailFormVisible:false,
      listPage:1,//当前页数
      currentPage:1,
      platformList:[],//平台列表
      platformListById:[],//平台列表 根据代理商查询
      platId:null,//平台选择id
      agentList:[],//代理商列表
      sn:'',//设备sn
      form: {
          name: '',
          sn:'',
          remarks: '',
          agentId:'',
          platformId:'',
        },
      detailFrom:{
          agentName: '',
          sn:'',
          platformName:'',
          remarks: '',
          statusStr:'',
          createTime:'',
          agentId:'',
          platformId:'',
      },
      formLabelWidth: '120px',
      hasPermission:false,//
      hasDeletePer:false,//删除权限
    }
  },
  created() {
    this.fetchData();
    this.getPlatformList(); //获取平台列表
    this.getAgentList();  //获取代理商列表
    this.getPermission();
  },
  methods: {
    fetchData() {
      this.listLoading = true
      let req = {
        sn:this.snInput,
        platformId:this.platId,
        page:this.listPage,
        limit:20
      }
      httpRquest(this.URL.DEVICE_LIST,'GET',req).then((res)=>{
        console.log(res)
        this.list = res.data.records;
        this.listLoading = false;
      })
    },
    //根据代理商查询平台
    getPlatById(){
      let req = {
        agentId:this.form.agentId
      }
      httpRquest(this.URL.PLATFORM_NEW,'GET',req).then((res)=>{
        console.log(res)
        this.platformListById = res.data;
      })
    },
    getPermission(){
      let permission = JSON.parse(localStorage.getItem('permission'));
      console.log(permission);
      for(let i in permission){
        if(permission[i].permission == 'device:add'){
          this.hasPermission = true;
          }
        if(permission[i].permission == 'device:delete'){
          this.hasDeletePer = true;
        }

        
      }
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
    //删除
    onClickDelete(e,index){
      var req = {
        id:e.id,
        sn:e.sn,
      }
      httpRquest(this.URL.DEVICE_DELETE,'GET',req).then((res)=>{
        console.log(res)
        this.listLoading = false;
        if(res.code == 0){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.list.splice(index,1);
        }
        
      })
    },
    //设备授权
    onClickAuth(){
      this.dialogFormVisible = true;
    },
    //获取平台
    getPlatformList(){
      var req = {
        page:1,
        limit:1000,
        keyWord:'',
      }
      httpRquest(this.URL.PAGE,'GET',req).then((res)=>{
        console.log(res)
        this.platformList = res.data.records;
      })
    },
    //校验设备sn
    checkSn(){
      return new Promise((resolve,reject) => {
        let req = {
          sn:this.form.sn
        }
        httpRquest(this.URL.CHECK_SN,'GET',req).then((res)=>{
          console.log(res);
          if(res.data){
            this.$message({
              message: '该设备已授权',
              type: 'warning'
            });
            reject();
          }else{
            resolve();
          }
        })
      })
      
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
    //查看
    handleClick(e){
      console.log(e)
      this.dialogDetailFormVisible = true;
      this.detailFrom = e;
    },
    //获取代理商
    getAgentList(){
      var req = {
        keyword:this.nameInput,
        platformId:this.platId,
        startSearchTime:this.startSearchTime,
        endSearchTime:this.endSearchTime,
        page:1,
        limit:1000
      }
      console.log(req)
      httpRquest(this.URL.AGENT_LIST,'GET',req).then((res)=>{
        console.log(res);
        this.agentList = res.data.records;
      })
    },
    //设备授权
    async onClickSubmit(){
      await this.checkSn();
      this.form.sn = this.form.sn.replace(/\s+/g,"");
      if(!this.form.agentId || !this.form.platformId || !this.form.sn){{
        this.$message({
            message: '必选项不能为空',
            type: 'error'
          });
          return;
      }}
      let req = {
        agentId:this.form.agentId,
        platformId:this.form.platformId,
        sn:this.form.sn,
        remarks:this.form.remarks,
      }
      httpRquest(this.URL.DEVICE_ADD,'POST',req).then((res)=>{
        console.log(res)
        this.listLoading = false;
        if(res.code == 0){
          this.$message({
            message: '授权成功',
            type: 'success'
          });
          this.list.unshift(res.data);
          this.dialogFormVisible = false;
        }else{
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .ctx_header{
    width: 100%;
    display: flex;
    align-items: center;
    span{
          margin-left: 20px;
    }
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
    width: 95%;
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

