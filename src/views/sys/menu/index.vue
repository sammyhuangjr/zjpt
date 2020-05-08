<template>
  <div class="app-container">
    <div class="ctx_btn">
      <el-button type="primary" @click="dialogFormVisible = true" plain>添加资源</el-button>
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
        <el-table-column prop="name" label="菜单名称" width="150px" show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.name }}</template> -->
        </el-table-column>
        <el-table-column prop="permission" label="权限标识" width="150px" show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.permission }}</template> -->
        </el-table-column>
        <el-table-column prop="path" label="菜单url" width="150px" show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.path }}</template> -->
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100px" show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.sort }}</template> -->
        </el-table-column>
        <el-table-column prop="updateTime" label="更新日期" width="150px" show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.updateTime }}</template> -->
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150px" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-button @click="onClickChildren(scope.row,scope.$index)" type="text" size="small">添加子菜单</el-button>
                <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                <el-button type="text" size="small">删除</el-button>
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
    //提交资源
    onClickSubmit(){
      this.listLoading = true;
      let req = {};
      if(this.isAddChildren){
        req = {
          parentId:this.parentId,
          name:this.form.name,
          permission:this.form.permission,
          path:this.form.path,
          type:this.form.type,
        }
      }else if(this.isEdit){

      }else{
        req = {
          name:this.form.name,
          permission:this.form.permission,
          path:this.form.path,
          type:this.form.type,
        }
      }
      httpRquest(this.URL.MENU_ADD,'POST',req).then((res)=>{
          this.listLoading = false;
          // this.list = res.data.records;
        })
        this.dialogFormVisible = false
    },
    addMenu(){

    },
    onClickChildren(e,index){
      this.isAddChildren = true;
      this.parentId = e.id;
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
    width: 100%;
    padding: 0 5%;
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

