package com.cc.sodukuanswer;

import lombok.Data;

@Data
public class SodukuRow {

    private String index;
    private int number1;
    private int number2;
    private int number3;
    private int number4;
    private int number5;
    private int number6;
    private int number7;
    private int number8;
    private int number9;

    public SodukuRow(String index, int number1, int number2, int number3, int number4, int number5, int number6, int number7, int number8, int number9) {
        this.index = index;
        this.number1 = number1;
        this.number2 = number2;
        this.number3 = number3;
        this.number4 = number4;
        this.number5 = number5;
        this.number6 = number6;
        this.number7 = number7;
        this.number8 = number8;
        this.number9 = number9;
    }
}
