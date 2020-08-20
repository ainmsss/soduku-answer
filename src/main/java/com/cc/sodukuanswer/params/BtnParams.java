package com.cc.sodukuanswer.params;

import com.cc.sodukuanswer.entity.Coordinate;
import com.cc.sodukuanswer.entity.SodukuRow;
import lombok.Data;

import java.util.List;
/*
* 获取按钮参数类
* */
@Data
public class BtnParams {

    // 当前谜题状态
    private List<SodukuRow> dataList;

    // 当前位置坐标
    private Coordinate coordinate;
}
