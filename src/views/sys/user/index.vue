<template>
  <div class="app-container">
    <div class="ctx_header">
      <span class="_sp">用户名：</span><el-input v-model="username" placeholder="请输入" class="h_arg" type="text"></el-input>
        <span class="_sp">联系人电话：</span><el-input v-model="phone" placeholder="请输入" class="h_arg" type="text"></el-input>
        <div class="ctx_icon">
          <el-button type="primary" icon="el-icon-search" circle @click="fetchData"></el-button>
          <el-button type="primary" icon="el-icon-refresh-right" circle @click="reset"></el-button>
        </div>
    </div>
    <div class="ctx_btn">
      <el-button  icon="el-icon-refresh" circle @click="refresh"></el-button>
      <!-- <el-button type="danger" @click="dialogVisible = true" plain>批量删除</el-button> -->
      <el-button type="primary" @click="onClickAdd" plain v-if="addPer">新建用户</el-button>
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
            <el-form-item class="di_input" label="用户名：" :label-width="formLabelWidth" required>
                <el-input placeholder="请输入用户名" v-model="form.username" :disabled="isEdit ? true : false"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="密码：" :label-width="formLabelWidth" required>
                <el-input v-model="form.password"  placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="确认密码："  :label-width="formLabelWidth" required>
                <el-input v-model="form.password1" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="所属代理商：" :label-width="formLabelWidth" required>
                <el-select v-model="form.agentId" placeholder="请选择所属代理商" style="width:380px" :disabled="isEdit ? true : false">
                    <el-option v-for="item in this.agentList" :key="item.id" :label="item.name" :value="item.id" >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="di_input" label="联系人电话："  :label-width="formLabelWidth" required>
                 <el-input v-model="form.phone" placeholder="请输入联系人电话"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="备注：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.remarks"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="角色：" :label-width="formLabelWidth" v-if="isAdmin" required>
                <el-radio-group v-model="form.roleId">
                  <div v-for="(item,index) in roleList" :key="item.id" class="role">
                    <el-radio :label="item.id">{{item.roleName}}</el-radio>
                  </div>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onClickSubmit">提 交</el-button>
        </div>
    </el-dialog>
     <el-table class="ctx_table" ref="multipleTable" :data="list" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column prop="name" label="角色" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column prop="address" label="所属代理商" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.agentName }}</template>
        </el-table-column>
        <el-table-column prop="address" label="联系人电话" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column prop="address" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small" @click="editClick(scope.row,scope.$index)">编辑</el-button>
                <el-button type="text" size="small" @click="delClick(scope.row,scope.$index)">删除</el-button>
                <el-switch :active-value='1' :inactive-value='0' v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="updateStatus(scope.row)" style="margin-left:10px"></el-switch>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog title="查看用户管理详情" :visible.sync="dialogDetailFormVisible" width="600px">
        <el-form :model="detailFrom">
            <el-form-item class="di_input" label="用户名：" :label-width="formLabelWidth">
                {{detailFrom.username}}
            </el-form-item>
            <el-form-item class="di_input" label="所属代理商：" :label-width="formLabelWidth">
                {{detailFrom.agentName}}
            </el-form-item>
            <el-form-item class="di_input" label="联系电话：" :label-width="formLabelWidth">
                {{detailFrom.phone}}
            </el-form-item>
            <el-form-item class="di_input" label="角色：" :label-width="formLabelWidth">
                {{detailFrom.roleName}}
            </el-form-item>
            <el-form-item class="di_input" label="备注：" :label-width="formLabelWidth">
                {{detailFrom.remarks}}
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-pagination class="ctx_foot" :page-size="20" :pager-count="5" layout="prev, pager, next" :total="totalNum" @next-click="onClickNext" @prev-click="onClickPre" 
    @current-change="handleCurrentPage" :current-page.sync="currentPage">
    </el-pagination>
  </div>
  
</template>

<script>
import Vue from 'vue'
import { getList } from '@/api/table'
import { httpRquest } from '@/api/URL'
import { checkBuyerno } from '@/utils/index'
import { checkPhone } from '@/utils/index'
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
      totalNum:0,
      currentPage:1,
      listPage:1, //列表页数
      list: null,
      listLoading: true,
      isEdit:false,
      editId:'',//编辑id
      phone:'',//联系电话
      editIndex:0,//编辑index
      lastTime:'',//最近登录时间
      dialogDetailFormVisible:false,//用户管理详情
      dialogFormVisible: false,//添加角色
      dialogVisible: false,//批量删除
      checkList:[],//角色
      page:1,//当前页数
      username:'',//用户名
      status:0,//0冻结 1正常
      form: {
          username: null,
          password: null,
          password1: null,
          id: '',
          phone: null,
          remarks:'',
          agent:[],
          agentId:'',
          roleId:'',
        },
      detailFrom:{
          username: '',
          password:'',
          phone:'',
          remarks: '',
          agentName:'',
          roleName:'',
        },
      agentList:[],
      formLabelWidth: '120px',
      roleList:[],//角色列表
      isAdmin:false,//是否超级管理员
      addPer:false,//新建用户权限
      isClick:false,
    }
  },
  created() {
    this.fetchData();
    this.getAgentList(); //获取组织
    this.getRole();//获取角色
    this.isAdminCheck(); //是否超级管理员
    this.hasAddPer();//是否有新建用户权限
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      let req = {
        page:this.listPage,
        limit:20,
        username:this.username,
        phone:this.phone
      }
      httpRquest(this.URL.USER_LIST,'GET',req).then((res)=>{
        console.log(res)
        this.listLoading = false;
        this.list = res.data.records;
        this.totalNum = res.data.total
      })
    },
    isAdminCheck(){
      let role = localStorage.getItem('roleCode');
      if(role == 'ROLE_ADMIN'){
        this.isAdmin = true;
      }
    },
    //是否有新建用户权限
    hasAddPer(){
      let permission = JSON.parse(localStorage.getItem('permission'));
      for(let i in permission){
        if(permission[i].permission == 'user:add'){
          this.addPer = true;
          }
      }
    },
    //修改用户状态
    updateStatus(e){
      console.log(e);
      // this.status = !this.status;
      let req = {
        id:e.id,
        status:Number(e.status)
      }
      let msg = e.status ? '该用户已启用' :'该用户已停用';
      let type = e.status ? 'success' : 'error';
      httpRquest(this.URL.USER_STATUS,'GET',req).then((res)=>{
        if(res.code == 0){
          this.$message({
            message: msg,
            type: type
          });
        }
      })
    },
    //重置
    reset(){
      this.username = '';
      this.phone = '';
    },
    //删除用户
    delClick(e,index){
      this.$confirm('是否删除该用户?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //点击确定的操作(调用接口)
            let req = {
              id:e.id,
            }
            this.editIndex = index;
            httpRquest(this.URL.USER_DELETE,'GET',req).then((res)=>{
              console.log(res);
              if(res.code == 0){
                this.list.splice(this.editIndex,1);
                this.totalNum = this.totalNum - 1;
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
              }
              
            })
          }).catch(() => {
            //几点取消的提示
          });
      
    },
    //刷新
    refresh(){
      this.page = 1;
      this.fetchData();
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    //多选
    handleSelectionChange(){
      //TODO
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
    //勾选角色
    platformIsCheck(e){
      console.log(e.id)
      let curid = e.id;
      for(let i = 0;i<this.form.roleList.length;i++){
        if(this.form.roleList[i].id == e.id){
          return true;
        }
      }
      return false;
    },
    //新建用户提交
    onClickSubmit(){
      var that = this;
      if(!this.form.username || !this.form.password || !this.form.agentId || !this.form.phone){
        this.$message({
          message: '必选项不能为空',
          type: 'error'
        });
        return;
      }
      if(!checkBuyerno(this.form.username) || !checkBuyerno(this.form.password)){
        this.$message({
          message: '用户名或密码只能输入字母和数字',
          type: 'error'
        });
        return;
      }
      if(this.isAdmin && !this.form.roleId){
        this.$message({
          message: '请选择角色',
          type: 'error'
        });
        return;
      }
      if(this.form.password != this.form.password1){
        this.$message({
          message: '两次输入密码必须一致',
          type: 'error'
        });
        return;
      }
      console.log(this.isClick);
      if(this.isClick){
        return;
      }
      this.isClick = true;
      if(this.isEdit){
        var req = {
          id:this.editId,
          agentId:this.form.agentId,
          username:this.form.username,
          password:this.form.password,
          phone:this.form.phone,
          remarks:this.form.remarks,
        }
        if(this.isAdmin){
          req['roleId'] = this.form.roleId
        }
        httpRquest(this.URL.USER_EDIT,'POST',req,'form').then((res)=>{
          console.log(res);
          Vue.set(this.list,this.editIndex,res.data)
          this.dialogFormVisible = false;
          setTimeout(function(){
            that.isClick = false;
          },1000)
        })

        // var formdata = new FormData();// 创建form对象
        // formdata.append('id',this.editId);
        // formdata.append('agentId',this.form.agentId);
        // formdata.append('username',this.form.username);
        // formdata.append('password',this.form.password);
        // formdata.append('phone',this.form.phone);
        // formdata.append('remarks',this.form.remarks);
        // let config = {
        //     headers:{
        //       'Content-Type':'multipart/form-data',
        //       'token':this.$store.getters.token
        //     }
        // };  //添加请求头
        // this.axios.post(`${this.URL.USER_EDIT}`,formdata,config).then(response=>{ 
        //     console.log('==============>',response)
        // })

      }else{
        var req = {
          agentId:this.form.agentId,
          username:this.form.username,
          password:this.form.password,
          phone:this.form.phone,
          remarks:this.form.remarks,
        }
        if(this.isAdmin){
          req['roleId'] = this.form.roleId
        }
        httpRquest(this.URL.USER_ADD,'POST',req).then((res)=>{
          console.log(res);
          if(res.code != 0){
            this.$message({
              message: res.msg,
              type: 'error'
            });
            setTimeout(function(){
              that.isClick = false;
            },1000)
            return;
          }
          this.list.unshift(res.data);
          this.totalNum = this.totalNum + 1;
          this.dialogFormVisible = false;
          setTimeout(function(){
            that.isClick = false;
            console.log(this.isClick);
            // Vue.set(this.isClick,false)
          },1000);
          // console.log(this.isClick);
        })
      }
      
    },
    //打开编辑
    editClick(e,index){
      this.isEdit = true;
      this.dialogFormVisible = true
      // this.form = e;
      this.form = JSON.parse(JSON.stringify(e));
      this.editId = e.id;
      this.editIndex = index;
    },
    //打开查看
    handleClick(e){
      this.dialogDetailFormVisible = true
      this.detailFrom = e;
    },
    //打开新建用户
    onClickAdd(){
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.form = {};
    },
    //获取角色(多选框)
    getRole(){
      //GET_ROLE
      httpRquest(this.URL.GET_ROLE,'GET',{}).then((res)=>{
        console.log('=========>>>>>>>',res);
        // this.form.roleList = res.data;
        this.roleList = res.data.records;
        // let temp = {
        //   id:'2222222',
        //   roleName:'666'
        // }
        // this.roleList.push(temp);
      })
    },
    //获取代理商列表(组织)
    getAgentList(){
      var req = {
        keyword:'',
        platformId:'',
        startSearchTime:'',
        endSearchTime:'',
        page:1,
        limit:1000
      }
      httpRquest(this.URL.AGENT_LIST,'GET',req).then((res)=>{
        console.log(res);
        this.form.agent = res.data.records;
        this.agentList = res.data.records;
        this.listLoading = false;
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
      .role{
        margin-top: 20px;
      }
  }
 
</style>

