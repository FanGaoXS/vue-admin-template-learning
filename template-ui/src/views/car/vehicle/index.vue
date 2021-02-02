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
            :src="IMAGE_BASE_URL+scope.row.car.imagePath"
            fit="cover"
            :preview-src-list="[IMAGE_BASE_URL+scope.row.car.imagePath]">
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
          <el-button type="primary" size="medium">修改</el-button>
          <el-button type="danger" size="medium">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
<!--    <router-view></router-view>-->
  </div>
</template>

<script>
import { getList } from '@/api/table'

import {
  plateNumberFilter
} from "@/utils/globalFilters";

import {
  getVehicleList
} from "@/api/car";

import {
  IMAGE_BASE_URL
} from "@/utils/myRequest";

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
      IMAGE_BASE_URL: IMAGE_BASE_URL+'/image/car/'
    }
  },
  created() {
    this.fetchData(); //组件初始化完成后取得数据并且填充
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getVehicleList().then(res => { //利用axios从后端获取数据然后填充
        this.list = res.data;
        this.listLoading = false;
      })
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
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
