package com.cc.sodukuanswer.entity;

import lombok.Data;
/*
* 坐标类
* */
@Data
public class Coordinate {

    private Integer x;
    private Integer y;
    private Integer value;

    public Coordinate() {
    }

    public Coordinate(Integer x, Integer y) {
        this.x = x;
        this.y = y;
    }

    public Coordinate(Integer x, Integer y, Integer value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }
}
