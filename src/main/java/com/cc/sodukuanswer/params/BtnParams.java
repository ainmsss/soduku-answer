package com.cc.sodukuanswer.params;

import com.cc.sodukuanswer.entity.Coordinate;
import com.cc.sodukuanswer.entity.SodukuRow;
import lombok.Data;

import java.util.List;

@Data
public class BtnParams {
    private List<SodukuRow> dataList;
    private Coordinate coordinate;
}
