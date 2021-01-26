import {
  localRequest,
  blctekRequest
} from "@/utils/myRequest";

/**
 *  获取车辆列表
 * @returns {AxiosPromise}
 */
export function getVehicleList() {
  let config = {
    url: '/car/allVehicle',
    type: 'GET'
  }
  return localRequest(config);
}

/**
 * 根据车牌号获取工时（有哪些日期）
 * @param plateNumber
 * @returns {AxiosPromise}
 */
export function getWorkListByPlateNumber(plateNumber) {
  // console.log(plateNumber);
  let config = {
    url: '/v0/loc/'+plateNumber,
    type: 'GET'
  }
  return blctekRequest(config);
}

/**
 * 根据车牌号和日期获得坐标点集合
 * @param plateNumber
 * @param Date
 * @returns {AxiosPromise}
 */
export function getPointListByPlateNumberAndDate(plateNumber,date) {
  /*console.log(plateNumber);
  console.log(date);*/
  let config = {
    url: '/v0/loc/'+plateNumber+'/'+date,
    type: 'GET'
  }
  return blctekRequest(config);
}

