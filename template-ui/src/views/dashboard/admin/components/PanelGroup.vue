<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总工作天数
          </div>
          <h2 class="card-panel-num">{{totalWorkDays}}天</h2>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总里程数
          </div>
          <h2 class="card-panel-num">{{totalMileage | mileageFilter }}</h2>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总耗油量（理想）
          </div>
          <h2 class="card-panel-num">{{totalFuel}}升</h2>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总驾驶员数量
          </div>
          <h2 class="card-panel-num">{{totalDriverNumber}}人</h2>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

import CountTo from 'vue-count-to'
import {getPointListByPlateNumberAndDate, getVehicleList, getWorkListByPlateNumber} from "@/api/car";
import AMapLoader from "@/utils/AMap";
import {mileageFilter} from "@/utils/globalFilters";

export default {
  filters: {
    mileageFilter: function (mileage) {
      return mileageFilter(mileage);
    }
  },
  computed: {
    totalFuel() {
      return ((this.totalMileage/1000/100)*7.5).toFixed(3);
    }
  },
  data() {
    return {
      map: null,
      loading: true,
      totalMileage: undefined,
      totalWorkDays: undefined,
      totalDriverNumber: undefined,
    }
  },
  created() {
    // 异步加载utils里的高德地图官方js
    // 因为这个页面需要利用高德官方组件GeometryUtil.distanceOfLine()来计算里程
    AMapLoader().then(AMap => {
      this.map = AMap; // 加载成功后将异步加载的高德原生js赋给this.map
      console.log('高德地图api加载成功');
      this.fetchData(); //组件初始化完成后取得数据并且填充
    }, e => {
      console.log('高德地图api加载失败',e)
    })
  },
  components: {
    CountTo
  },
  methods: {
    async fetchData() {
      let res = await getVehicleList();
      let vehicleList = res.data;
      let totalDriverNumber = vehicleList.length;
      let totalWorkDays = 0;
      let totalMileage = 0;
      for (let i = 0; i < vehicleList.length; i++) {
        let plateNumber = vehicleList[i].plateNumber;
        let res1 = await getWorkListByPlateNumber(plateNumber)
        let workList = res1.data;
        // console.log(workList)
        let workDays = workList.length
        totalWorkDays+=workDays
        for (let j = 0; j < workList.length; j++) {
          let date = workList[j];
          let res2 = await getPointListByPlateNumberAndDate(plateNumber,date)
          let pointList = res2.data;
          // console.log(pointList)
          let lineArray = []
          for (let k = 0; k < pointList.length; k++) {
            let point = pointList[k]
            lineArray.push([point.longitude_amap,point.latitude_amap])
          }
          let mileage = this.map.GeometryUtil.distanceOfLine(lineArray); // 利用AMap的官方工具计算里程
          totalMileage+=mileage;
        }
      }
      this.loading = false;
      this.totalDriverNumber = totalDriverNumber
      this.totalMileage = totalMileage
      this.totalWorkDays = totalWorkDays
    }
  },
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
