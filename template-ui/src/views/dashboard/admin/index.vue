<template>
  <div class="dashboard-editor-container">

    <panel-group ref="panelGroup"/>

    <el-row :gutter="32">

      <!--<el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="16"
        :xl="16"
        style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>-->

      <el-col
        :xs="24"
        :sm="24"
        :lg="12">
        <div class="chart-wrapper" >
          <bar-chart ref="barChart1"/>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :lg="12">
        <div class="chart-wrapper" >
          <bar-chart ref="barChart2"/>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :lg="12">
        <div class="chart-wrapper" >
          <bar-chart ref="barChart3"/>
        </div>
      </el-col>

    </el-row>

  </div>
</template>

<script>

  import PanelGroup from "./components/PanelGroup";
  import BarChart from "./components/BarChart";
  import TransactionTable from "./components/TransactionTable";
  import AMapLoader from "@/utils/AMap";
  import {getPointListByPlateNumberAndDate, getVehicleList, getWorkListByPlateNumber} from "@/api/car";

  export default {
    name: "index",
    created() {
      AMapLoader().then(AMap => {
        this.map = AMap; // 加载成功后将异步加载的高德原生js赋给this.map
        this.fetchData();
      }, e => {
        console.log('高德地图api加载失败',e)
      })
    },
    methods: {
      async fetchData() {
        let plateNumber;
        let workDays;
        let mileage = 0;
        let fuel;
        let carList = []
        const res = await getVehicleList()
        for (const vehicle of res.data) {
          plateNumber = vehicle.plateNumber;
          const res2 = await getWorkListByPlateNumber(plateNumber)
          workDays = res2.data.length
          for (const date of res2.data) {
            const res3 = await getPointListByPlateNumberAndDate(plateNumber,date)
            let lineArray = [];
            for (const point of res3.data) {
              lineArray.push([point.longitude_amap,point.latitude_amap])
            }
            mileage += this.map.GeometryUtil.distanceOfLine(lineArray);
          }
          mileage = mileage/1000 //单位米->公里
          fuel = (mileage/100)*7.5 //单位升/百公里
          // console.log(plateNumber,workDays,mileage.toFixed(2),fuel.toFixed(2))
          carList.push({
            plateNumber,
            workDays,
            mileage,
            fuel
          })
        }
        let mileageMap = [];
        let workDaysMap = [];
        let fuelMap = [];
        for (const car of carList) {
          mileageMap.push({
            xAxis:car.plateNumber,
            series:(car.mileage).toFixed(2)
          })
          workDaysMap.push({
            xAxis:car.plateNumber,
            series:car.workDays
          })
          fuelMap.push({
            xAxis:car.plateNumber,
            series:(car.fuel).toFixed(2)
          })
        }
        // 将carList传递给panelGroup和barChart两个子组件（调用两个组件的fetchData方法）
        this.$refs.panelGroup.fetchData(carList);
        this.$refs.barChart1.fetchData(mileageMap,'里程（单位：公里）');
        this.$refs.barChart2.fetchData(workDaysMap,'总工作天数（单位：天）');
        this.$refs.barChart3.fetchData(fuelMap,'理想油耗（单位：升）');
      }
    },
    data() {
      return {
        map: null,
      }
    },
    components:{
      PanelGroup,
      BarChart,
      TransactionTable
    },
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }

  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }

</style>
