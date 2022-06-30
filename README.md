# 手写板

### 本项目用于参加HarmonyOS开发者大赛

功能还在完善中

### V1.0

预览

![writingPad_V1.0](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/writingPad_V1.0.gif)

### V2.0

> 说明：
>
> 第二代画板新增：线条粗细会跟随移动速度变化，速度快，线条细，速度慢线条粗
>
> 原理：首先需要通过数组将所有经过的点记录下来（第一代没有用数组），然后通过时间戳，获取两点之间的时间，再计算两点之间的距离（平方和再开根号），通过 `路程/时间 = 速度`计算出两点之间的速度，从而可以动态生成线条粗细

预览

![writingPad_V2.0](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/writingPad_V2.0.gif)
