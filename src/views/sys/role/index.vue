<template>
  <div class="app-container">
    <div class="ctx_header">
        <span class="_sp">用户角色：</span>
        <el-select v-model="roleIdSear" placeholder="全部" class="h_arg">
            <el-option v-for="item in list" :key="item.id" :label="item.roleName" :value="item.id" >
            </el-option>
        </el-select>
        <div class="block">
            <span class="_sp">更新时间：</span>
            <el-date-picker v-model="updateTime" type="date" placeholder="选择日期" class="h_arg"></el-date-picker>
        </div>
        <div class="ctx_icon">
          <el-button type="primary" icon="el-icon-search" circle @click="fetchData"></el-button>
          <el-button type="primary" icon="el-icon-refresh-right" circle @click="reset"></el-button>
        </div>
    </div>
    <div class="ctx_header">
        <!-- <span class="_sp">创建人：</span><el-input v-model="input" placeholder="请输入" class="h_arg" type="text"></el-input> -->
        
    </div>
    <div class="ctx_btn">
      <!-- <el-button type="danger" @click="dialogVisible = true" plain>批量删除</el-button> -->
      <el-button type="primary" @click="onOpenAdd" plain>新建角色</el-button>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>删除后,则该用户不可登录管理平台!</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog title="新增角色" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="角色名称：" :label-width="formLabelWidth" required>
                <el-input v-model="form.roleName"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="角色编码：" :label-width="formLabelWidth" required>
                <el-input v-model="form.roleCode" :disabled="isEdit ? true : false"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="角色说明：" :label-width="formLabelWidth">
                <el-input v-model="form.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onClickSubmit">提 交</el-button>
        </div>
    </el-dialog>
     <el-table class="ctx_table" ref="multipleTable" :data="list" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="角色名称" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column prop="name" label="描述" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.roleDesc }}</template>
        </el-table-column>
        <el-table-column prop="address" label="最近更新时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">授权</el-button>
                <el-button @click="onEdit(scope.row,scope.$index)" type="text" size="small">修改</el-button>
                <el-button type="text" size="small" @click="onDelete(scope.row,scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog title="授权" :visible.sync="dialogAuthVisible" width="600px" :before-close="handleClose">
        <el-tree :data="menuList" node-key="id" ref="tree" check-strictly show-checkbox @check-change="handleCheckChange" :default-checked-keys="checkedMenu">
        
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAuthVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSubAuth">保 存</el-button>
        </div>
        
    </el-dialog>
    <el-pagination class="ctx_foot" :page-size="20" :pager-count="5" layout="prev, pager, next" :total="totalNum" @next-click="onClickNext" @prev-click="onClickPre" 
    @current-change="handleCurrentPage" :current-page.sync="currentPage">
    </el-pagination>
  </div>
  
</template>

<script>
import { getList } from '@/api/table'
import { httpRquest } from '@/api/URL'
import Vue from 'vue'
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
      input:'',
      updateTime:'',//最近登录时间
      dialogFormVisible: false,//添加角色
      dialogAuthVisible:false,//授权
      menuList:[], //授权菜单列表
      isEdit:false,
      editId:'',//修改id
      editIndex:'',//修改index
      dialogVisible: false,//批量删除
      checkList:[],//角色
      roleIdSear:'',//角色ID 搜索用
      roleCode:'',//角色编码 授权用
      roleId:'',//角色id 授权用
      menuIds:[],//菜单id 授权用
      checkedMenu:[],//选中的菜单
      isClick:false,
      isAuthClick:false,
      form: {
          roleName:'',//角色名称
          roleCode:'',//角色编码
          roleDesc:'',//角色说明
        },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      let req = {
        id:this.roleIdSear,
        updateTime:this.updateTime,
      }
      httpRquest(this.URL.GET_ROLE,'GET',req).then((res)=>{
        console.log(res)
        this.listLoading = false;
        this.list = res.data.records;
        this.totalNum = res.data.length
      })
    },
    reset(){
      this.roleIdSear = '';
      this.updateTime = '';
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    //打开授权
    handleClick(e,index){
      this.roleCode = e.roleCode;
      this.roleId = e.id;
      this.dialogAuthVisible = true;
      this.loadNode();
    },
    handleCheckChange(data, checked, indeterminate){
      console.log(data, checked, indeterminate);
    },
    loadNode(node,resolve){
      console.log(node)
      let req = {
        roleCode:this.roleCode
      }
      httpRquest(this.URL.AUTH_MENU,'GET',req).then((res)=>{
        console.log(res.data)
        this.menuList = res.data.menuTrees;
        this.checkedMenu = res.data.roleMenuId;
        this.listLoading = false;
      })
    },
    //授权 
    onSubAuth(){
      if(this.isAuthClick){
        return;
      }
      this.isAuthClick = true;
      let temp = this.$refs.tree.getCheckedKeys().join(',');
      let menuIdList = this.$refs.tree.getCheckedNodes();
      for(let i in menuIdList){
        this.menuIds.push(menuIdList[i].id)
      }
      let req = {
        id:this.roleId,
        menuIds:this.menuIds
      }
      console.log(req)
      httpRquest(this.URL.AUTH,'POST',req).then((res)=>{
        console.log(res.data)
        if(res.code == 0){
          this.$message({
            message: '授权成功,请重新登录',
            type: 'success'
          });
        }
        this.listLoading = false;
        this.dialogAuthVisible = false;
        this.isAuthClick = false;
      })
      
    },
    //打开新增角色
    onOpenAdd(){
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.form = {}
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
    //新增角色
    onClickSubmit(){
      var that = this;
      if(this.isClick){
        return;
      }
      this.isClick = true;
      if(this.isEdit){
        let req = {
          id:this.editId,
          roleName:this.form.roleName,
          roleCode:this.form.roleCode,
          roleDesc:this.form.roleDesc
        }
        httpRquest(this.URL.ROLE_UPDATE,'POST',req).then((res)=>{
            console.log(res);
            if(res.code == 0){
              this.$message({
                message: res.msg,
                type: 'success'
              });
              Vue.set(this.list,this.editIndex,res.data)
              this.dialogFormVisible = false
            };
            setTimeout(function(){
              that.isClick = false;
            },1000)
          })
      }else{
        let req = {
        roleName:this.form.roleName,
        roleCode:this.form.roleCode,
        roleDesc:this.form.roleDesc
      }
      httpRquest(this.URL.ROLE_ADD,'POST',req).then((res)=>{
          console.log(res);
          if(res.code == 0){
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.list.unshift(res.data);
              this.totalNum = this.totalNum + 1;
              this.dialogFormVisible = false
          };
          setTimeout(function(){
            that.isClick = false;
          },1000)
        })
      }
      
    },
    handleSelectionChange(){

    },
    //打开角色修改
    onEdit(e,index){
      this.isEdit = true;
      this.editId = e.id;
      this.form = e;
      this.editIndex = index;
      this.dialogFormVisible = true;
    },
    //角色删除
    onDelete(e,index){
      this.$confirm('是否删除该角色?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //点击确定的操作(调用接口)
            let req = {
              id:e.id,
            }
            httpRquest(this.URL.ROLE_DELETE,'GET',req).then((res)=>{
                console.log(res);
                if(res.data){
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.list.splice(index,1);
                  this.totalNum = this.totalNum - 1;
                }
                this.dialogFormVisible = false
              })
          }).catch(() => {
            //几点取消的提示
          });
      
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

