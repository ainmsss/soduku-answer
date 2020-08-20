package com.cc.sodukuanswer.utils;

import com.cc.sodukuanswer.entity.Coordinate;
import lombok.Data;

import java.util.*;

@Data
public class Soduku {

    private int[][] soduku;
    private int times;

    private int[][] block = {{0 ,1, 2}, {3, 4, 5}, {6, 7, 8}};

    public boolean check(Coordinate coordinate) {
        int x = coordinate.getX();
        int y = coordinate.getY();
        int value = coordinate.getValue();
        // 校验行内重复
        for (int row_number : soduku[x]) {
            if (row_number == value)
                return false;
        }
        // 校验列内重复
        for (int[] row : soduku) {
            if (row[y] == value)
                return false;
        }
        /*
        *   0   1   2
        *   3   4   5
        *   6   7   8
        *  计算当前九宫格位置
        * */
        int block_index = block[x/3][y/3];
        /*
        * 计算行阈值
        * 前三个九宫格为0，中间三个为1，最后三个为2
        * 既需要便利的行数为0-2,3-5,6-8
        * */
        int row_threshold = block_index/3;
        /*
         * 计算列阈值
         * 前三个九宫格为0，中间三个为1，最后三个为2
         * 既需要便利的列数为0-2,3-5,6-8
         * */
        int col_threshold = block_index%3;
        List<Integer> block_numbers = new ArrayList<>();
        for (int row_index = 3 * row_threshold; row_index < 3 * row_threshold + 3; row_index ++) {
            for (int col_index = 3 * col_threshold; col_index < 3 * col_threshold + 3; col_index ++) {
                block_numbers.add(soduku[row_index][col_index]);
            }
        }
        return !block_numbers.contains(value);
    }

    private Coordinate getNext(int x, int y, boolean recursion) {
        Coordinate coordinate = new Coordinate(-1, -1);
        Map<String, Integer> resMap = new HashMap<>();
        resMap.put("x", -1);
        resMap.put("y", -1);
        if (!recursion)
            y += 1;
        for (int next_y = y; next_y < 9; next_y ++) {
            if (soduku[x][next_y] == 0) {
                coordinate.setX(x);
                coordinate.setY(next_y);
                return coordinate;
            }
        }
        if (x < 8) {
            return getNext(x + 1, 0, true);
        }

        return coordinate;
    }

    private boolean trySoduku(int x, int y) {
        if (soduku[x][y] == 0) {
            for (int i = 1; i < 10; i++) {
                this.times += 1;
                if (this.check(new Coordinate(x, y, i))) {
                    soduku[x][y] = i;
                    Coordinate next = this.getNext(x, y, false);
                    int next_x = next.getX();
                    int next_y = next.getY();
                    if (next_x == -1)
                        return true;
                    else {
                        boolean end = this.trySoduku(next_x, next_y);
                        if (!end) {
                            soduku[x][y] = 0;
                        } else {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    public int[][] start() {
        long start = System.currentTimeMillis();
        if (soduku[0][0] == 0) {
            this.trySoduku(0, 0);
        } else {
            Coordinate next = this.getNext(0, 0, false);
            this.trySoduku(next.getX(), next.getY());
        }
        for (int[] ints : soduku) {
            System.out.println(Arrays.toString(ints));
        }
        long end = System.currentTimeMillis();
        System.out.println("Cost time:" + (end - start) + "ms");
        System.out.println("Try times:" + this.times);
        return soduku;
    }

    public Soduku(int[][] soduku, int times) {
        this.soduku = soduku;
        this.times = times;
    }

}
