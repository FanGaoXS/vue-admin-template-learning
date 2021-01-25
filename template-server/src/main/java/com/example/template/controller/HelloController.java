package com.example.template.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Auther: 吴青珂
 * @Date: 2021/01/25/10:42
 * @Description:
 */
@RestController
@RequestMapping("/")
public class HelloController {

    @RequestMapping("/")
    public Map<String,Object> hello(){
        HashMap<String, Object> resMap = new HashMap<>();
        resMap.put("status",true);
        resMap.put("msg","这是template-server服务器");
        return resMap;
    }

}
