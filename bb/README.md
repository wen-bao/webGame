

# 游戏介绍

​	小球撞击带有能量方块，撞击一次方块能量减一分数加一，小球吃到小绿球小球数加一，每次方块整体下降一格，同时出现新的方块。按照最终分数排名（只记录前一百名）

​	支持PC端和移动端

# 游戏环境介绍

​	php

# 游戏部分界面展示

![开始界面](bb.JPG)

![结束界面](bb2.JPG)

# 主要功能实现

## 1、排名实现

​	利用js读取json加载排名，php更新json数据

​	具体实现可以查看代码

## 2、轨迹线的实现

​	小球的位置固定，可以根据鼠标的坐标（移动端根据触控点的坐标）确定一条线段，然后利用反射原理依次画出反射线。

## 3、碰撞检测

​	根据小球的半径和方块及小绿球的长度判定是否发生碰撞

