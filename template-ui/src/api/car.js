import {
  localRequest
} from "@/utils/localRequest";

export function getVehicleList() {
  let config = {
    url: '/car/allVehicle',
    type: 'GET'
  }
  return localRequest(config);
}
