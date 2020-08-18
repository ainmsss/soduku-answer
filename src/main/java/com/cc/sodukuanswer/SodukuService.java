package com.cc.sodukuanswer;

import com.cc.sodukuanswer.utils.Soduku;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SodukuService {
    
    public List<SodukuRow> fillSoduku(List<SodukuRow> data) {
        int[][] ints = formatData(data);
        Soduku soduku = new Soduku(ints, 0);
        int[][] result = soduku.start();
        SodukuRow sodukuRow = null;
        List<SodukuRow> list = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            int[] row = result[i];
            sodukuRow = new SodukuRow(String.valueOf(i), row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
            list.add(sodukuRow);
        }
        return list;
    }
    
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
