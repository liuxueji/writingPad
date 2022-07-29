// @ts-nocheck
// @ts-nocheck
export default {
    data: {
        ctx:'',
        startX:0,
        startY:0,
    //        开始时间
        startTime:0,
        lineWidth:20
    },
// 偏移很多
    touchstart(e){
        this.startX = e.touches[0].localX
        this.startY = e.touches[0].localY
        //        console.log(JSON.stringify(e.touches[0]))
    },
//    计算最后两点的速度
//    speed(x1,y1,x2,y2,s){
//        const x = Math.abs(x1-x2)*Math.abs(x1-x2)
//        const y = Math.abs(y1-y2)*Math.abs(y1-y2)
//        return Math.sqrt(x+y)/s
//    },
    touchmove(e){
        // 计算线条粗细
//        const currTime = Date.now()
//        if(this.startTime !== 0){
//            const duration = currTime - this.startTime
//            //            传入倒数第二个点和最后一个点，和持续时间，会返回加速度
//            const v = this.speed(this.ArrX[this.ArrX.length-2],this.ArrY[this.ArrY.length-2],this.ArrX[this.ArrX.length-1],this.ArrY[this.ArrY.length-1],duration)
//            this.lineWidth =   this.lineWidth/v
//            if(this.lineWidth>25){
//                this.lineWidth = 25
//            }
//            if(this.lineWidth<1){
//                this.lineWidth = 1
//            }
//            console.log(this.lineWidth)
//            //            console.log(v)
//        }
//        this.startTime = currTime

        const el = this.$refs.canvas;
        this.ctx = el.getContext('2d')
        this.ctx.lineWidth =this.lineWidth
        this.ctx.beginPath()
        // 向线条的每个末端添加圆形线帽。
        this.ctx.lineCap = 'round'
        // 每次将数组中最后一个值取出，作为起始点
        this.ctx.moveTo(this.startX,this.startY)
        this.ctx.lineTo(e.touches[0].localX,e.touches[0].localY)
        this.ctx.stroke()
        this.startX = e.touches[0].localX
        this.startY = e.touches[0].localY
//        console.log()
    },
    touchend(e){
//        this.startTime = 0
    }
}