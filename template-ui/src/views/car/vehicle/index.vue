<template>
  <div class="app-container">

    <!--<div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-edit">
        添加
      </el-button>
    </div>-->

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" align="center" width="75">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column label="车牌号" align="center" width="250">
        <template slot-scope="scope">
          {{ scope.row.plateNumber | plateNumberFilter }}
        </template>
      </el-table-column>

      <el-table-column label="车辆图片" align="center" width="200">
        <template slot-scope="scope">
          <!--图片预览，支持放大-->
          <el-image
            style="width: 100px;height: 50px"
            :src="IMAGE_PREFIX_URL+scope.row.car.imagePath"
            fit="cover"
            :preview-src-list="[IMAGE_PREFIX_URL+scope.row.car.imagePath]">
          </el-image>
        </template>
      </el-table-column>



      <el-table-column label="车牌类型" align="center" width="150">
        <template slot-scope="scope">
          <el-tag :type=" scope.row.plateType | plateTypeFilter ">
            {{ scope.row.plateType }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="车辆类型" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.vehicleModel }}
        </template>
      </el-table-column>

      <el-table-column label="所属工程用具" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.car.type }}
        </template>
      </el-table-column>

      <el-table-column label="百公里油耗" align="center">
        <template slot-scope="scope">
          7.5（升/百公里）
        </template>
      </el-table-column>

      <el-table-column label="驾驶员姓名" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.driver.driverName }}
        </template>
      </el-table-column>

      <el-table-column label="驾驶员电话号码" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.driver.driverPhone }}
        </template>
      </el-table-column>


      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="medium" @click="handleUpdate(scope.row,scope.$index)">修改</el-button>
          <el-button type="danger" size="medium" @click="handleDelete(scope.row,scope.$index)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--修改车辆信息的对话框-->
    <el-dialog
      title="修改车辆信息"
      :visible.sync="dialogFormVisible"
      width="35%">
      <el-form :model="tempForm" label-width="150px">

        <el-form-item label="车辆编号" >
          <el-input :value="tempForm.vehicleId" disabled></el-input>
        </el-form-item>

        <el-form-item label="车牌号" >
          <el-input v-model="tempForm.plateNumber"></el-input>
        </el-form-item>

        <el-form-item label="车牌类型" >
          <el-radio v-model="tempForm.plateType" label="汽油车" border>汽油车</el-radio>
          <el-radio v-model="tempForm.plateType" label="新能源" border>新能源</el-radio>
        </el-form-item>

        <el-form-item label="车辆类型" >
          <el-select v-model="tempForm.vehicleModel" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.modelName"
              :label="item.modelName"
              :value="item.modelName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属工程用具编号" >
          <el-input :value="tempForm.car.carId" disabled></el-input>
        </el-form-item>

        <el-form-item label="车辆或机械" >
          <el-input :value="tempForm.car.type" disabled></el-input>
        </el-form-item>

        <el-form-item label="芯片编号" >
          <el-input :value="tempForm.car.chipId" disabled></el-input>
        </el-form-item>

        <el-form-item label="驾驶员编号" >
          <el-input :value="tempForm.driver.driverId" disabled></el-input>
        </el-form-item>

        <el-form-item label="驾驶员姓名" >
          <el-input :value="tempForm.driver.driverName"></el-input>
        </el-form-item>

        <el-form-item label="驾驶员联系方式" >
          <el-input :value="tempForm.driver.driverPhone"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateVehicle()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import {
  plateNumberFilter
} from "@/utils/globalFilters";

import {
  deleteVehicle,  //删除车辆信息的网络请求
  getVehicleList, //获得所有车辆的网络请求
  updateVehicle   //修改车辆信息的网络请求
} from "@/api/car";

import {
  IMAGE_BASE_URL  //获取图片url的地址前缀
} from "@/utils/myRequest";

import {
  getModelByBelong  //获取类型的网络请求
} from "@/api/model";

export default {
  filters: {
    //车牌类型过滤
    plateTypeFilter(plateType){
      // 如果是汽油车则显示灰色样式，新能源显示success样式
      const plateTypeMap = {
        '汽油车': '',
        '新能源': 'success',
      };
      return plateTypeMap[plateType];
    },

    plateNumberFilter(plateNumber){
      return plateNumberFilter(plateNumber); //执行globalFilters里的过滤器
    }

  },
  data() {
    return {
      dialogFormVisible: false,
      options:[
        {
          modelName: ''
        }
      ],
      tempForm: {
        car:{},
        driver:{}
        /*
        vehicleId: 77,
        plateNumber: '川AS28T4',
        plateType: '汽油车',
        vehicleModel: '越野车',
        carId: 96,
        car: {
          carId: 96,
          type: '车辆',
          driverId: 96,
          chipId: 'C2196C0D',
          imagePath: 'e53a7c40-8536-43b0-b700-a9bc36e4024d',
          driver: null
        },
        driver: {
          driverId: 96,
          driverName: '旦巴顿珠',
          driverPhone: '17308917971'
        }*/
      },
      list: [ //车辆对象数组
        /*{
          "vehicleId": 77,
          "carId": 96,
          "plateNumber": "川AS28T4",
          "plateType": "汽油车",
          "vehicleModel": "越野车",
          "car": {
            "carId": 96,
            "type": "车辆",
            "driverId": 96,
            "chipId": "C2196C0D",
            "imagePath": "e53a7c40-8536-43b0-b700-a9bc36e4024d",
            "driver": null
          },
          "driver": {
            "driverId": 96,
            "driverName": "旦巴顿珠",
            "driverPhone": "17308917971"
          }
        },*/
      ],
      listLoading: true,
      IMAGE_PREFIX_URL: IMAGE_BASE_URL+'/image/car/'
    }
  },
  created() {
    this.fetchData(); //组件初始化完成后取得数据并且填充
  },
  methods: {

    handleUpdate(row){
      /*console.log('handleUpdate',row)
      console.log('handleUpdate',index)*/
      this.dialogFormVisible = true;
      this.tempForm = Object.assign({}, row)
    },

    handleDelete(row,index){
      /*console.log('handleDelete',row)
      console.log('handleDelete',index)*/
      this.$confirm('此操作将永久删除记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteVehicle(row,index)
      }).catch()
    },

    updateVehicle(){
      // console.log('updateVehicle',this.tempForm);
      /*
      array.findIndex(v=> v.id === array1.id);
      这个函数就是查询数组对应的下标：返回值是 如果array.id=array1.id相等的然后该对象在array数组里的下标值
      */
      let index = this.list.findIndex(v=> v.vehicleId === this.tempForm.vehicleId)
      // console.log(index);
      updateVehicle(this.tempForm).then(res=>{
        // console.log(res.status);
        this.dialogFormVisible = false;
        this.list.splice(index,1,this.tempForm); //替换掉原数组的对象
        this.$notify({
          type: 'success',
          message: '修改车辆信息成功！'
        })
      }).catch(error=>{
        console.log(error)
        this.$notify({
          type: 'error',
          message: '修改车辆信息失败请联系管理员'+error
        })
      });
    },

    deleteVehicle(row,index){
      this.$notify({
        type: 'warning',
        message: '暂不支持删除车辆信息！'
      })
      /*deleteVehicle(row).then(res=>{
        // console.log(res);
        this.$notify({
          type: 'success',
          message: '删除车辆信息成功！'
        })
        this.list.splice(index,1);
      }).catch(error=> {
        console.log(error);
        this.$notify({
          type: 'error',
          message: '删除车辆信息失败请联系管理员'+error
        })
      })*/
    },

    async fetchData() {
      this.listLoading = true
      const { data:modelList } = await getModelByBelong('车辆') //同步获取类型列表
      this.options = modelList;
      const { data:vehicleList } = await getVehicleList() //同步获取车辆列表
      this.list = vehicleList;
      this.listLoading = false;
    },
    // 路由前进
    routerAhead(row){
      this.$router.push({
        name: 'Work',
        params: {
          plateNumber: row.plateNumber
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
