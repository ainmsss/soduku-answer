package com.cc.sodukuanswer.service;

import com.cc.sodukuanswer.entity.Coordinate;
import com.cc.sodukuanswer.params.BtnParams;
import com.cc.sodukuanswer.utils.Soduku;
import com.cc.sodukuanswer.entity.SodukuRow;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SodukuService {

    /**
    * 解决数独问题
    * @param data 传入的原始谜题
    * @return 返回解出的谜题结果
    * */
    public List<SodukuRow> fillSoduku(List<SodukuRow> data) {
        // 格式化参数，构建soduku对象，并调用解答函数
        int[][] ints = formatData(data);
        Soduku soduku = new Soduku(ints, 0);
        int[][] result = soduku.start();

        // 格式化返回值
        SodukuRow sodukuRow = null;
        List<SodukuRow> list = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            int[] row = result[i];
            sodukuRow = new SodukuRow(String.valueOf(i), row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
            list.add(sodukuRow);
        }
        return list;
    }

    /**
     * 获取当前单元格可用的按钮
     * @param params 计算按钮所需参数
     * @return 返回当前单元格可用的按钮
     * */
    public List<Integer> getBtns(BtnParams params) {
        // 声明结果list并获取参数
        List<Integer> allowBtns = new ArrayList<>();
        Coordinate coordinate = params.getCoordinate();
        int[][] ints = formatData(params.getDataList());

        // 构建soduku对象，校验当前位置可以填入的数字
        Soduku soduku = new Soduku(ints, 0);
        for (int i = 1; i < 10; i++) {
            coordinate.setValue(i);
            if (soduku.check(coordinate)) {
                allowBtns.add(i);
            }
        }
        return allowBtns;
    }

    /**
     * 格式化数据
     * @param data 页面传入参数
     * @return 返回计算所需二维数组
     * */
    private int[][] formatData(List<SodukuRow> data) {
        return new int[][]{
                {data.get(0).getNumber1(), data.get(0).getNumber2(), data.get(0).getNumber3(), data.get(0).getNumber4(), data.get(0).getNumber5(), data.get(0).getNumber6(), data.get(0).getNumber7(), data.get(0).getNumber8(), data.get(0).getNumber9()},
                {data.get(1).getNumber1(), data.get(1).getNumber2(), data.get(1).getNumber3(), data.get(1).getNumber4(), data.get(1).getNumber5(), data.get(1).getNumber6(), data.get(1).getNumber7(), data.get(1).getNumber8(), data.get(1).getNumber9()},
                {data.get(2).getNumber1(), data.get(2).getNumber2(), data.get(2).getNumber3(), data.get(2).getNumber4(), data.get(2).getNumber5(), data.get(2).getNumber6(), data.get(2).getNumber7(), data.get(2).getNumber8(), data.get(2).getNumber9()},
                {data.get(3).getNumber1(), data.get(3).getNumber2(), data.get(3).getNumber3(), data.get(3).getNumber4(), data.get(3).getNumber5(), data.get(3).getNumber6(), data.get(3).getNumber7(), data.get(3).getNumber8(), data.get(3).getNumber9()},
                {data.get(4).getNumber1(), data.get(4).getNumber2(), data.get(4).getNumber3(), data.get(4).getNumber4(), data.get(4).getNumber5(), data.get(4).getNumber6(), data.get(4).getNumber7(), data.get(4).getNumber8(), data.get(4).getNumber9()},
                {data.get(5).getNumber1(), data.get(5).getNumber2(), data.get(5).getNumber3(), data.get(5).getNumber4(), data.get(5).getNumber5(), data.get(5).getNumber6(), data.get(5).getNumber7(), data.get(5).getNumber8(), data.get(5).getNumber9()},
                {data.get(6).getNumber1(), data.get(6).getNumber2(), data.get(6).getNumber3(), data.get(6).getNumber4(), data.get(6).getNumber5(), data.get(6).getNumber6(), data.get(6).getNumber7(), data.get(6).getNumber8(), data.get(6).getNumber9()},
                {data.get(7).getNumber1(), data.get(7).getNumber2(), data.get(7).getNumber3(), data.get(7).getNumber4(), data.get(7).getNumber5(), data.get(7).getNumber6(), data.get(7).getNumber7(), data.get(7).getNumber8(), data.get(7).getNumber9()},
                {data.get(8).getNumber1(), data.get(8).getNumber2(), data.get(8).getNumber3(), data.get(8).getNumber4(), data.get(8).getNumber5(), data.get(8).getNumber6(), data.get(8).getNumber7(), data.get(8).getNumber8(), data.get(8).getNumber9()},
        };
    }
}
