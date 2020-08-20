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

    @PostMapping("/fill")
    @ResponseBody
    public Object fillSoduku(@RequestBody List<SodukuRow> dataList) {
        return sodukuService.fillSoduku(dataList);
    }

    @PostMapping("/btns")
    @ResponseBody
    public Object fillSoduku(@RequestBody BtnParams params) {
        return sodukuService.getBtns(params);
    }
}
