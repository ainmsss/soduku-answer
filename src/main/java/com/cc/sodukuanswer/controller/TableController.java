package com.cc.sodukuanswer.controller;

import com.cc.sodukuanswer.entity.Coordinate;
import com.cc.sodukuanswer.entity.SodukuRow;
import com.cc.sodukuanswer.params.BtnParams;
import com.cc.sodukuanswer.service.SodukuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/soduku")
public class TableController {

    @Autowired
    SodukuService sodukuService;

    /**
     * 解决数独问题
     * @param dataList 页面所填谜题参数
     * @return 返回解出后的数独结果
     * */
    @PostMapping("/fill")
    @ResponseBody
    public Object fillSoduku(@RequestBody List<SodukuRow> dataList) {
        return sodukuService.fillSoduku(dataList);
    }

    /**
     * 获取当前位置可填数字
     * @param params BtnParams对象：
     *               dataList为当前谜题状态
     *               coordinate为当前单元格坐标
     * @return 返回当前位置可填数字
     * */
    @PostMapping("/btns")
    @ResponseBody
    public Object fillSoduku(@RequestBody BtnParams params) {
        return sodukuService.getBtns(params);
    }
}
