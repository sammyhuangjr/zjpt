<template>
  <div class="app-container">
    <div class="ctx">
      <span>代理商名称：</span><el-input v-model="input" placeholder="请输入" class="h_input" type="text"></el-input>
      <span>授权平台：</span>
      <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span>创建时间：</span>
      <div class="block">
        <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <div class="ctx_btn">
      <el-button type="primary"  @click="onClickAdd" plain>新增代理商</el-button>
    </div>
    <el-dialog title="新增代理商" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="代理商名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="联系人：" :label-width="formLabelWidth">
                <el-input v-model="form.contact" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="联系手机号：" :label-width="formLabelWidth">
                <el-input v-model="form.contactPhone" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="授权平台：" :label-width="formLabelWidth">
                <el-checkbox-group v-model="checkList" v-if="dialogFormVisible">
                  <div v-for="(item,index) in platformList" :key="item.id">
                    <el-checkbox :label="item.id" name="type" :checked="platformIsCheck(item)">{{item.name}}</el-checkbox>
                  </div>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="onClickSubmit">提 交</el-button>
        </div>
    </el-dialog>
    <el-table class="ctx_t" v-if="list" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" label="代理商名称" width="95">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="授权平台" >
        <template slot-scope="scope">
          {{ scope.row.platformNum }}
        </template>
      </el-table-column>
      <el-table-column label="剩余授权额度" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.surplusQuata }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.contact }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="联系手机号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.contactPhone }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="editClick(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
          <el-button type="text" @click="onClickRecord(scope.row)" size="small">充值记录</el-button>
          <el-button type="text" @click="onClickRecharge(scope.row,scope.$index)" size="small">充值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="充值" :visible.sync="dialogRechargeVisible" width="600px">
        <el-form :model="rechargeForm">
            <el-form-item class="di_input" label="代理商名称：" :label-width="formLabelWidth">
                <el-input v-model="rechargeForm.name"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="充值数量：" :label-width="formLabelWidth">
                <el-input v-model="rechargeForm.num" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="备注：" :label-width="formLabelWidth">
                <el-input v-model="rechargeForm.remarks" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogRechargeVisible = false">取 消</el-button>
            <el-button type="primary" @click="rechargeSub">提 交</el-button>
        </div>
    </el-dialog>
    <el-dialog title="充值记录" :visible.sync="dialogRecordVisible" width="600px">
        <el-table class="ctx_table" ref="recordTable" :data="record" tooltip-effect="dark">
          <!-- <el-table-column label="序号" width="120">
            <template slot-scope="scope">{{ scope.row.$index }}</template>
          </el-table-column>
          <el-table-column prop="address" label="代理商名称" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column prop="address" label="充值数量" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.num }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="充值时间" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column prop="address" label="备注" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.remarks }}</template>
          </el-table-column> -->
      </el-table>
    </el-dialog>
    <el-pagination class="ctx_foot"
      :page-size="20"
      :pager-count="5"
      layout="prev, pager, next"
      :total="1000">
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
      list: null,
      listLoading: true,
      value1: '',//时间范围选择
      dialogFormVisible: false,
      dialogRechargeVisible:false,
      dialogRecordVisible:false,
      isEdit:false,
      editId:'',//编辑id
      editIndex:0,//编辑index
      rechargeId:'',//充值id
      formLabelWidth: '120px',
      record:null,//充值记录
      form: {
          name: '',
          contact:'',
          contactPhone:'',
          platform:[],
      },
      rechargeForm: {
        name:'',
        num:0,
        remarks:''
      },
      totalPlat:[],
      input:'',
      options:[],
      value:'',
      checkList:[],
      platformList:[]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var req = {
        keyword:'',
        platformId:'',
        startSearchTime:'',
        endSearchTime:'',
        page:1,
        limit:10
      }
      httpRquest(this.URL.AGENT_LIST,'GET',req).then((res)=>{
        console.log(res);
        this.list = res.data.records;
        this.listLoading = false;
      })
      httpRquest(this.URL.PLATFORM,'GET',{}).then((res)=>{
        //获取授权平台
        console.log('=====>',res);
        this.platformList = res.data;
        this.form.totalPlat = res.data;
      })
    },
    //新增代理商
    onClickAdd(){
      // this.form.platform = this.totalPlat;
      this.dialogFormVisible = true;
    },
    //充值记录
    onClickRecord(e){
      this.dialogRecordVisible = true;
      let req = {
        id:e.id
      }
      httpRquest(this.URL.AGENT_RECORD,'GET',req).then((res)=>{
        console.log(res);
        if(res.code == 0){
          this.record = res.data;
          this.dialogRechargeVisible = false;
        }
      })
    },
    //充值
    onClickRecharge(e,index){
      console.log(e);
      this.dialogRechargeVisible = true;
      this.rechargeForm = e;
      this.rechargeId = e.id;
    },
    //充值提交
    rechargeSub(){
      let req = {
        agentId:this.rechargeId,
        num:this.rechargeForm.num,
        remarks:this.rechargeForm.remarks,
      }
      httpRquest(this.URL.AGENT_RECHARGE,'post',req).then((res)=>{
        console.log(res);
        if(res.code == 0){
          this.list
          this.dialogRechargeVisible = false;
        }
      })
    },
    //编辑代理商
    editClick(e,index){ 
      this.checkList = [];
      this.dialogFormVisible = true;
      this.form = e;
      this.editId = e.id;
      this.isEdit = true;
      this.editIndex = index;
      console.log(this.form.platform,index)
      console.log(this.list[0],index)
    },
    //选中
    onSelect(e){
      console.log(this.checkList)
    },
    //提交
    onClickSubmit(){
      let ids = this.checkList.join(',');
      let that = this;
      if(this.isEdit){ //编辑
        var req = {
          contact:this.form.contact,
          id:this.editId,
          contactPhone:this.form.contactPhone,
          platformIds:ids
        }
        httpRquest(this.URL.AGENT_UPDATE,'post',req).then((res)=>{
          console.log(res);
          if(res.code == 0){ 
            // this.$nextTick(()=>{
            //   that.list[that.editIndex] = res.data;
            // });
            Vue.set(this.list,this.editIndex,res.data)
            this.dialogFormVisible = false;
          }
          console.log(this.list)
        })
      }else{  //新增
        var req = {
          name:this.form.name,
          contact:this.form.contact,
          contactPhone:this.form.contactPhone,
          platformIds:ids
        }
        httpRquest(this.URL.AGENT_ADD,'post',req).then((res)=>{
          console.log(res);
          if(res.code == 0){
            this.list.unshift(res.data);
            this.dialogFormVisible = false;
          }
        })
      }
    },

    platformIsCheck(e){
      let curid = e.id;
      for(let i = 0;i<this.form.platform.length;i++){
        if(this.form.platform[i].id == e.id){
          return true;
        }
      }
      return false;
    }
  }
}
</script>
<style lang="scss" scoped>
  .ctx{
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    .h_input{
      width: 150px;
    }
    span{
      margin-left: 20px;
    }
    // span:nth-child(1){
    //   margin-left: 0px;
    // }
  }
  .ctx_t{
    width: 100%;
    margin-left: 20px;
  }
  .ctx_btn{
    float: right;
    margin-bottom: 20px;
  }
  .ctx_foot{
    text-align: center;
    margin-top: 10px;
  }
  .di_input{
      width: 500px;
  }
</style>