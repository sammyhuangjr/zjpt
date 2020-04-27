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
      <el-button type="primary"  @click="dialogFormVisible = true" plain>新增代理商</el-button>
    </div>
    <el-dialog title="新增代理商" :visible.sync="dialogFormVisible" width="600px">
        <el-form :model="form">
            <el-form-item class="di_input" label="代理商名称：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="联系人：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="联系手机号：" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item class="di_input" label="授权平台：" :label-width="formLabelWidth">
                <el-checkbox-group v-model="form.type">
                  <div v-for="(item,index) in form.platform" :key="item.name">
                    <el-checkbox :label="item.name" name="type"></el-checkbox>
                  </div>
                </el-checkbox-group>
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
      <el-table-column align="center" label="代理商名称" width="95">
        <template slot-scope="scope">
          {{ scope.name }}
        </template>
      </el-table-column>
      <el-table-column label="授权平台" >
        <template slot-scope="scope">
          {{ scope.row.platformNum }}
        </template>
      </el-table-column>
      <el-table-column label="剩余授权额度" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.quota }}</span>
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
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
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
      list: null,
      listLoading: true,
      value1: '',//时间范围选择
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          platform:[]
        },
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
        this.form.platform = res.data;
    
      })
    },
    //提交
    onClickSubmit(){
      this.dialogFormVisible = false;
      var req = {
        name:'皮皮',
        contact:'黄蕾',
        contactPhone:'15622125517',
        platformIds:"221c02133512597ccdd8ad72da10bb22,6ad9c52fff8e2ca1e46844e8a1d24b62"
      }
      // httpRquest(this.URL.AGENT_ADD,'POST',req).then((res)=>{
      //   console.log('11111111111',res)
      // })
      this.newPost(this.URL.AGENT_ADD,req).then((res)=>{
        console.log('=>>',res)
      })  
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