package com.cc.sodukuanswer.controller;

import com.cc.sodukuanswer.SodukuRow;
import com.cc.sodukuanswer.SodukuService;
import com.cc.sodukuanswer.utils.Soduku;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/table")
public class TableController {

    @Autowired
    SodukuService sodukuService;

    @PostMapping("/fill")
    @ResponseBody
    public Object fillSoduku(@RequestBody List<SodukuRow> dataList) {
        return sodukuService.fillSoduku(dataList);
    }
}
