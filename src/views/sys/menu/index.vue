<template>
  <div class="app-container">
    <div class="ctx_btn">
      <el-button type="primary" @click="onSubAdd" plain>添加资源</el-button>
    </div>
    <el-dialog title="新建菜单" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="资源类型" :label-width="formLabelWidth">
                <el-select v-model="form.type" style="width:380px">
                    <el-option v-for="item in typeList" :key="item.type" :label="item.name" :value="item.type">{{item.name}}
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="di_input" label="资源名称" :label-width="formLabelWidth">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="权限标识" :label-width="formLabelWidth">
                <el-input v-model="form.permission"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="资源url" :label-width="formLabelWidth">
                <el-input v-model="form.path"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="组件url" :label-width="formLabelWidth">
                <el-input v-model="form.component"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="排序" :label-width="formLabelWidth">
                <el-input v-model="form.sort"></el-input>
            </el-form-item>
            <!-- <el-form-item class="di_input" label="菜单图标" :label-width="formLabelWidth">
                 <el-input v-model="form.name"></el-input>
            </el-form-item>     -->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onClickSubmit">提 交</el-button>
        </div>
    </el-dialog>
     <el-table class="ctx_t" ref="multipleTable" row-key="id" v-if="list && list.length > 0" :data="list" tooltip-effect="dark" :tree-props="{children: 'children', hasChildren: 'children.length>0'}">
        <el-table-column prop="name" label="菜单名称"  show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
        </el-table-column>
        <el-table-column prop="permission" label="权限标识"  show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.permission }}</template> -->
        </el-table-column>
        <el-table-column prop="path" label="菜单url" width="200px"  show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.path }}</template> -->
        </el-table-column>
        <el-table-column prop="sort" label="排序"  show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.sort }}</template> -->
        </el-table-column>
        <el-table-column prop="updateTime" label="更新日期"  show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.updateTime }}</template> -->
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"  show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-button @click="onClickChildren(scope.row,scope.$index)" type="text" size="small">添加子菜单</el-button>
                <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                <el-button type="text" size="small" @click="onClickDelete(scope.row,scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination class="ctx_foot" :page-size="20" :pager-count="5" layout="prev, pager, next" :total="totalNum" @next-click="onClickNext" @prev-click="onClickPre" 
    @current-change="handleCurrentPage" :current-page.sync="currentPage"></el-pagination>
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
      totalNum:0,
      currentPage:1,
      listPage:1, //列表页数
      list: null,
      totalNum:0,
      listLoading: true,
      input:'',
      value:'',
      options:[],
      isEdit:false,//是否编辑
      editIndex:0,//编辑 添加子菜单index
      isAddChildren:false,//是否添加子菜单
      parentId:'',//父菜单id
      value1:'',//最近登录时间
      dialogFormVisible: false,//添加角色
      dialogVisible: false,//批量删除
      checkList:[],//角色
      type:0,//菜单类型 0菜单 1按钮
      typeList:[{'name':'菜单','type':0},{'name':'按钮','type':1}],
      form: {
          type: '',//菜单类型 0菜单 1按钮
          permission:'',//权限标识
          name:'',//资源名称
          path:'',//资源url
          component:'',//组件url
          sort:1,//排序
        },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true
      //MENU
      httpRquest(this.URL.MENU,'GET',{}).then((res)=>{
        this.list = res.data;
        this.listLoading = false;
        console.log(this.list)
      })
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    //dialogFormVisible = true
    onSubAdd(){
      this.dialogFormVisible = true;
      this.form = {
          type: '',
          permission:'',
          name:'',//资源名称
          path:'',//资源url
          component:'',//组件url
          sort:1
        };
    },
    //提交资源
    onClickSubmit(){
      this.listLoading = true;
      let reqUrl = this.URL.MENU_ADD;
      let message = '';
      let reqType = 0;
      let req = {
          name:this.form.name,
          permission:this.form.permission,
          path:this.form.path,
          type:this.form.type,
          component:this.form.component,
          sort:this.form.sort,
        };
      if(this.isAddChildren){ //添加子菜单
        req['parentId'] = this.parentId;
        reqUrl = this.URL.MENU_ADD;
        message = '添加子菜单成功,请重新登录';
      }else if(this.isEdit){  //编辑 
        req['id'] = this.form.id
        reqUrl = this.URL.MENU_UPDATE;
        message = '编辑成功,请重新登录';
        reqType = 1;
      }else{ //新增菜单
        reqUrl = this.URL.MENU_ADD;
        message = '添加成功,请重新登录';
        reqType = 2;
      }
      httpRquest(reqUrl,'POST',req).then((res)=>{
          this.listLoading = false;
          // this.list = res.data.records;
          if(res.code == 0){
            this.$message({
              message:message,
              type:'success'
            })
            switch(reqType){
              case 0 :{
               
              }break;
              case 1 :{

              }break;
              case 2 :{
                this.list.unshift(res.data);
              }break;
            }
          }
        })
        this.dialogFormVisible = false
    },
    addMenu(e,index){
      // console.log(e,index)

    },
    //修改菜单
    handleClick(e,index){
      this.isAddChildren = false;
      this.isEdit = true;
      // this.form = e;
      this.form = JSON.parse(JSON.stringify(e));
      this.editIndex = index;
      this.form.id = e.id;
      this.dialogFormVisible = true;
    },
    //删除菜单
    onClickDelete(e,index){
      //MENU_DELETE
      let req = {
        id:e.id,
      }
       httpRquest(this.URL.MENU_DELETE,'GET',req).then((res)=>{
        console.log(res.data)
        if(res.code == 0){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }
      })
    },
    //打开添加子菜单
    onClickChildren(e,index){
      this.form = {};
      this.isAddChildren = true;
      this.isEdit = false;
      this.parentId = e.id;
      this.editIndex = index;
      this.dialogFormVisible = true;
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
  }
}
</script>

<style lang="scss" scoped>
  .ctx_btn{
    float: right;
    margin-bottom: 20px;
  }
  .ctx_t{
    margin-top: 10px;
    width: 95%;
    margin-left: 20px;
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

