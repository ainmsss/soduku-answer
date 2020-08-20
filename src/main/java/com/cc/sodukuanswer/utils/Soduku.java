package com.cc.sodukuanswer.utils;

import com.cc.sodukuanswer.entity.Coordinate;
import lombok.Data;

import java.util.*;

/*
* 谜题对象
* */
@Data
public class Soduku {

    // 当前谜题二维数组
    private int[][] soduku;

    // 尝试次数
    private int times;

    // 初始化9宫格坐标位置
    private final int[][] block = {{0 ,1, 2}, {3, 4, 5}, {6, 7, 8}};

    /**
    * 校验数字重复性
    * 从行、列、九宫格三个维度校验
    * @param coordinate 位置信息
    * @return 若校验通过返回true，否则返回false
    * */
    public boolean check(Coordinate coordinate) {
        // 获取当前位置坐标
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

        /*
        * row_threshold和col_threshold既为当前位置所在九宫格的坐标
        * 填充数据并校验九宫格内重复
        * */
        List<Integer> block_numbers = new ArrayList<>();
        for (int row_index = 3 * row_threshold; row_index < 3 * row_threshold + 3; row_index ++) {
            for (int col_index = 3 * col_threshold; col_index < 3 * col_threshold + 3; col_index ++) {
                block_numbers.add(soduku[row_index][col_index]);
            }
        }
        return !block_numbers.contains(value);
    }

    /**
    * 递归获取下一个值为0的位置
    * @param x 当前位置纵坐标，既dataList中的第几行
    * @param y 当前位置横坐标，既每行中的第几个数字
    * @param recursion 当前进入方法时是否为递归，如果递归进入则检查下一个数字，否则检查当前数字
    * @return 返回下一个值为0的数字位置信息
    * */
    private Coordinate getNext(int x, int y, boolean recursion) {
        // 初始化坐标对象，x,y均为-1
        Coordinate coordinate = new Coordinate(-1, -1);
        // 判断是否敌对，既是否需要校验当前数字
        if (!recursion)
            y += 1;
        // 检查当前行，如果存在为0的数字则返回坐标
        for (int next_y = y; next_y < 9; next_y ++) {
            if (soduku[x][next_y] == 0) {
                coordinate.setX(x);
                coordinate.setY(next_y);
                return coordinate;
            }
        }
        // 如果当前行没有为0的数字则进行递归检查下一行
        if (x < 8) {
            return getNext(x + 1, 0, true);
        }

        return coordinate;
    }

    /*
    * 主循环，填充数字
    * @param x 当前位置纵坐标，既dataList中的第几行
    * @param y 当前位置横坐标，既每行中的第几个数字
    * @return 当前位置数字填写完成，如果正确返回true，否则返回false
    * */
    private boolean trySoduku(int x, int y) {
        if (soduku[x][y] == 0) {
            for (int i = 1; i < 10; i++) {
                // 执行次数统计，每次+1
                this.times += 1;
                // 校验当前位置填入i后是否发生重复，如果重复则进行下一次循环
                if (this.check(new Coordinate(x, y, i))) {
                    // 如果当前位置的i不会发生重复则填写到结果中
                    soduku[x][y] = i;
                    // 获取下一步所需位置坐标
                    Coordinate next = this.getNext(x, y, false);
                    int next_x = next.getX();
                    int next_y = next.getY();
                    // 如果x=-1则9行循环完成，跳出方法
                    if (next_x == -1)
                        return true;
                    // 否则继续循环调谐下一个位置的数字
                    else {
                        // 递归填写，如果下一位置数字填写正确则继续递归，否则回退至上一步，用下一个i进行递归尝试
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
        // 如果初始位置数字为0则直接开始主循环
        // 否则查找下一个数字为0的位置开始主循环
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
