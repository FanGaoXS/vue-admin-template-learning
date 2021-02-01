import {
  blctekRequest
} from "@/utils/myRequest";

export function uploadSpeedTest(formData) {
  // console.log(formData.get('text'));
  let config = {
    url: '/car/uploadSpeedTest',
    method: 'POST',
    data: formData
  }
  return blctekRequest(config);
}
