// @ts-nocheck
export default {
    data: {
        ctx:'',
        width:0,
        height:0,
        ArrX:[],
        ArrY:[],
        lineWidth:14,
        isEraser:false,//是否开启橡皮擦功能
        eraserValue:30,//橡皮擦大小
        strokeStyle:'black',
        canvasHistory:[],
        step:-1,
        showClear:true,
        showEraser:true,
        showSave:true,
        showUndo:true,
        showRedo:true,
        foldB: true,
        foldT: true,
        value: 0,
        WidthVal: 5,
        HeightVal: 250

    },
    onLayoutReady(){
        const el = this.$refs.canvas;
        this.ctx = el.getContext('2d')
        this.width = el.getBoundingClientRect().width;
        this.height = el.getBoundingClientRect().height;
        this.getFontSize()
    },
    // 偏移很多
    touchstart(e){
        this.ArrX.push(e.touches[0].localX)
        this.ArrY.push(e.touches[0].localY)
        if(this.isEraser){
            this.ctx.clearRect(e.touches[0].localX-this.eraserValue,e.touches[0].localY-this.eraserValue,this.eraserValue,this.eraserValue)
        }
    },
    touchmove(e){
        if(this.isEraser){
            this.ctx.clearRect(this.ArrX[this.ArrX.length-1]-this.eraserValue,this.ArrY[this.ArrY.length-1]-this.eraserValue,this.eraserValue,this.eraserValue)
        }else{
            this.lineDraw(e)
        }
        this.ArrX.push(e.touches[0].localX)
        this.ArrY.push(e.touches[0].localY)
    },
    lineDraw(e){
        this.ctx.lineWidth = this.lineWidth
        this.ctx.strokeStyle = this.strokeStyle
        this.ctx.beginPath()
        // 向线条的每个末端添加圆形线帽。
        this.ctx.lineCap ='round'
        // 每次将数组中最后一个值取出，作为起始点
        this.ctx.moveTo(this.ArrX[this.ArrX.length-1],this.ArrY[this.ArrY.length-1])
        this.ctx.lineTo(e.touches[0].localX,e.touches[0].localY)
        this.ctx.stroke()
    },
    touchend(e){
        const el = this.$refs.canvas;
        this.step++;
        this.canvasHistory.push(el.toDataURL()); // 添加新的绘制到历史记录
        console.log(this.step)
    },
    saveBtn(){
        const el = this.$refs.canvas;
        const dataURL = el.toDataURL();
        console.log(dataURL);
    },
    withdraw(){
        this.ArrX.pop()
        this.ArrY.pop()
    },
    clearBtn(e){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.showClear = false
        this.showEraser=true
        this.showSave=true
        this.showUndo=true
        this.showRedo=true
    },
    clearBtnEnd(){
        this.canvasHistory = []
        this.step = -1
        this.showClear = true
    },
    EraserBtn(){
        this.isEraser = !this.isEraser
        this.showClear = true
        this.showEraser=!this.showEraser
        this.showSave=true
        this.showUndo=true
        this.showRedo=true
    },
    saveBtn(){
        this.showClear = true
        this.showEraser=true
        this.showSave=false
        this.showUndo=true
        this.showRedo=true
    },
    saveBtnEnd(){
        this.showClear = true
        this.showEraser=true
        this.showSave=true
        this.showUndo=true
        this.showRedo=true
    },
    red(){
        this.strokeStyle = 'red'
        this.getFontSize()
    },
    blue(){
        this.strokeStyle = 'blue'
        this.getFontSize()
    },
    white(){
        this.strokeStyle = 'white'
        this.getFontSize()
    },
    black(){
        this.strokeStyle = 'black'
        this.getFontSize()
    },
    undo(){
        if (this.step >= 0) {
            this.step--;
            this.ctx.clearRect(0, 0, this.width, this.height);
            let img = new Image();
            img.src = this.canvasHistory[this.step];
            let that = this
            img.onload = function() {
                // 画上图片
                that.ctx.drawImage(img, 0, 0);
            };
        } else {
            console.log('不能再继续撤销了');
        }

        this.showClear = true
        this.showEraser=true
        this.showSave=true
        this.showUndo=false
        this.showRedo=true
    },
    undoEnd(){
        this.showClear = true
        this.showEraser=true
        this.showSave=true
        this.showUndo=true
        this.showRedo=true
    },
    redo(){
        if (this.step < this.canvasHistory.length - 1) {
            this.step++;
            let img = new Image();
            img.src = this.canvasHistory[this.step];
            let that = this
            img.onload = function() {
                that.ctx.clearRect(0, 0, this.width, this.height);
                that.ctx.drawImage(img, 0, 0);
            };
        } else {
            console.log('已经是最新的记录了');
        }

        this.showClear = true
        this.showEraser=true
        this.showSave=true
        this.showUndo=true
        this.showRedo=false
    },
    redoEnd(){
        this.showClear = true
        this.showEraser=true
        this.showSave=true
        this.showUndo=true
        this.showRedo=true
    },
//    控制展开与收缩
    foldTop() {
        this.foldT=!this.foldT
    },
    foldBottom(){
        this.foldB = !this.foldB
    },
    setvalue(e) {
        this.lineWidth = e.value;
        this.getFontSize()
    },
    getFontSize(){
        const el = this.$refs.canvasFont;
        const ctxFont = el.getContext('2d')
        ctxFont.beginPath();
        ctxFont.clearRect(0, 0, 300, 100);
        ctxFont.lineWidth = this.lineWidth
        ctxFont.strokeStyle = this.strokeStyle
        console.log(this.lineWidth)
        ctxFont.moveTo(50, 50);
        // 三次贝赛尔曲线的路径
        ctxFont.lineTo(300, 50);
        ctxFont.stroke();
    }
}