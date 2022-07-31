// @ts-nocheck
import animator from '@ohos.animator';
import prompt from '@system.prompt';
import router from '@system.router';
export default {
    data: {
        ctx:'',
        width:0,
        height:0,
        ArrX:[],
        ArrY:[],
        //        开始时间
        startTime:0,
        lineWidth:14,
        oldLineWidth:3,
        oldoldLineWidth:3,
        isEraser:false,//是否开启橡皮擦功能
        saveImg:'',//保存的图片
        canvasHistory:[],
        step:-1,
        pathX:[120,40,208,85,310,390], // 文字的书写顺序
        pathIndex:0,
        isRedo:false,//判断是否需要回退
        foldB: true,
        foldT: true,
        divWidth: 200,//动画
        animator: null,
        isAnimator:true, // 动画开始与结束
        isStepper:false, // 帮助
        rating:5, // 评分等级
        lastRating:null, // 旧评分
        showRatingTip:'', // 评分提示语
        isRating:false, // 评分显示与隐藏
        saveScale:0.5 //存储缩放
    },
    onLayoutReady(){
        this.getBgcImage()
        this.formLine()
        //        this.saveBtn()
        const el = this.$refs.canvas;
        this.ctx = el.getContext('2d')
        this.width = el.getBoundingClientRect().width;
        this.height = el.getBoundingClientRect().height;
        //        获取完文字后先获取最初状态
        this.step++;
        this.canvasHistory.push(el.toDataURL()); // 添加新的绘制到历史记录
//        动画
        var options = {
            duration: 1500,
            easing: 'friction',
            fill: 'forwards',
            iterations: 2,
            begin: 200.0,
            end: 400.0
        };
        this.animator = animator.createAnimator(options);
    },
    // 偏移很多
    touchstart(e){
        //        开始时间清空
        this.startTime = Date.now()-1
        this.ArrX.push(e.touches[0].localX)
        this.ArrY.push(e.touches[0].localY)
        if(e.touches[0].localX>this.pathX[this.pathIndex]+20 || e.touches[0].localX<this.pathX[this.pathIndex]-20){
            this.isRedo = true
            this.rating-- // 如果写错一步，星星减一
        }else{
            this.pathIndex++
        }
    },
    //    计算最后两点的速度
    speed(x1,y1,x2,y2,s){
        const x = Math.abs(x1-x2)*Math.abs(x1-x2)
        const y = Math.abs(y1-y2)*Math.abs(y1-y2)
        return Math.sqrt(x+y)/s
    },
    touchmove(e){
        // 计算线条粗细
        const currTime = Date.now()
        if(this.startTime !== 0){
            const duration = currTime - this.startTime
            // 传入倒数第二个点和最后一个点，和持续时间，会返回加速度
            const v = this.speed(this.ArrX[this.ArrX.length-2],this.ArrY[this.ArrY.length-2],this.ArrX[this.ArrX.length-1],this.ArrY[this.ArrY.length-1],duration)
            if(v>30||v!=v){
                this.lineWidth = 3
            }
            else if(v<1){
                this.lineWidth = 30
            }else{
                this.lineWidth = 30 - v * 3
            }
            this.lineWidth = this.oldLineWidth/3+this.oldoldLineWidth/3+(this.lineWidth)/3
        }
        this.startTime = currTime

        const el = this.$refs.canvas;
        this.ctx = el.getContext('2d')
        this.ctx.lineWidth =this.lineWidth
        this.ctx.beginPath()
        // 向线条的每个末端添加圆形线帽。
        this.ctx.lineCap ='round'
        // 每次将数组中最后一个值取出，作为起始点
        this.ctx.moveTo(this.ArrX[this.ArrX.length-1],this.ArrY[this.ArrY.length-1])
        this.ctx.lineTo(e.touches[0].localX,e.touches[0].localY)
        this.ctx.stroke()
        this.ArrX.push(e.touches[0].localX)
        this.ArrY.push(e.touches[0].localY)
        this.oldoldLineWidth = this.oldLineWidth
        this.oldLineWidth = this.lineWidth
    },
    touchend(e){
        this.startTime = 0,
        this.lineWidth = 14,
        this.oldLineWidth = 1,
        this.oldoldLineWidth = 1

        if(this.isRedo){
            this.openDialog()
            this.ctx.clearRect(0, 0, this.width, this.height);
            let canvasPic = new Image();
            canvasPic.src = this.canvasHistory[this.step];
            let that = this
            canvasPic.onload = function() {
                // 画上图片
                that.ctx.drawImage(canvasPic, 0, 0);
            };
            this.isRedo = false
        }else{
            const el = this.$refs.canvas;
            this.step++;
            this.canvasHistory.push(el.toDataURL()); // 添加新的绘制到历史记录
        }
    },
    formLine() {
        //        ctx.save();
        this.ctx.strokeStyle = "red";

        //画外层边框
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.width - 0, 0);
        this.ctx.lineTo(this.width - 0, this.height - 0);
        this.ctx.lineTo(3, this.height - 0);
        this.ctx.closePath();
        this.ctx.lineWidth = 6;

        this.ctx.stroke();

        //画米字格
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.width, this.height);

        this.ctx.moveTo(this.width, 0);
        this.ctx.lineTo(0, this.height);

        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);

        this.ctx.moveTo(0, this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2);

        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.restore();

    },
    saveBtn(){
        const el = this.$refs.canvas2;
        const ctx = el.getContext('2d')
        let width = el.getBoundingClientRect().width;
        let height = el.getBoundingClientRect().height;
        ctx.clearRect(0, 0, width, height);
        let index = this.canvasHistory.length - 1
        this.saveImg = el.toDataURL();
        let canvasPic = new Image();
        canvasPic.src = this.canvasHistory[index];
        ctx.scale(this.saveScale,this.saveScale);
        this.saveScale = 1
        canvasPic.onload = function() {
            ctx.drawImage(canvasPic, 0, 0);
        };
//        ctx.scale(2,2);
        this.showRating()
    },
    withdraw(){
        this.ArrX.pop()
        this.ArrY.pop()
    },
    clearBtn(e){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.formLine()
        this.getBgcImage()
        this.pathIndex = 0
//        this.canvasHistory=[]
        this.isRating = false
    },
    getBgcImage(){
        const el = this.$refs.canvas;
        this.ctx = el.getContext('2d')
        this.width = el.getBoundingClientRect().width;
        this.height = el.getBoundingClientRect().height;
        // 创建图片对象
        let img = new Image();
        // 设置图片路径
        img.src = 'common/images/liu5.png';
        let that = this
        img.onload = function() {
            // 画上图片
            that.ctx.drawImage(img, 0,0, this.width, this.height);
        };
    },
    showEditor(){
    },
    undo(){
        if (this.step >= 1) {
            this.step--;
            this.ctx.clearRect(0, 0, this.width, this.height);
            let canvasPic = new Image();
            canvasPic.src = this.canvasHistory[this.step];
            let that = this
            canvasPic.onload = function() {
                that.ctx.drawImage(canvasPic, 0, 0);
            };
            this.pathIndex--
        } else {
            this.$element('dialogId').show()
            prompt.showToast({
                message: '不能再继续撤销了'
            })
        }
    },
    redo(){
        if (this.step < this.canvasHistory.length - 1) {
            this.step++;
            let canvasPic = new Image();
            canvasPic.src = this.canvasHistory[this.step];
            let that = this
            canvasPic.onload = function() {
                that.ctx.clearRect(0, 0, this.width, this.height);
                that.ctx.drawImage(canvasPic, 0, 0);
            };
            this.pathIndex++
        } else {
            this.$element('dialogId').show()
            prompt.showToast({
                message: '已经是最新的记录了'
            })
        }
    },

//    dialog
    openDialog(){
        this.$element('dialogId').show()
        prompt.showToast({
            message: '笔画不对，再来一次！'
        })
    },
    foldBottom(){
        this.foldB = !this.foldB
    },
    showhintDialog(e) {
        this.$element('hintDialog').show()
    },
    sethintDialog(e) {
        this.$element('hintDialog').close()
    },
//    动画
    Show() {
        this.isAnimator = !this.isAnimator
        var options1 = {
            duration: 2000,
            easing: 'friction',
            fill: 'forwards',
            iterations: 1,
            begin: 200.0,
            end: 800.0
        };
        this.animator.update(options1);
        var _this = this;
        this.animator.onframe = function(value) {
            _this.divWidth = value;
        };
        if(this.isAnimator){
            this.animator.reverse();
        }else{
            this.animator.play();
        }
    },
    stepperFinish(){
        this.isStepper = false
    },
    showStepper(){
        this.isStepper = true
    },
//    搜索功能
    search(e){
        prompt.showToast({
            message:  e.value,
            duration: 3000,
        });
    },
    translate(e){
        prompt.showToast({
            message:  e.value,
            duration: 3000,
        });
    },
    share(e){
        prompt.showToast({
            message:  e.value,
            duration: 3000,
        });
    },
    change(e){
        prompt.showToast({
            message:  e.value,
            duration: 3000,
        });
    },
    submit(e){
        router.push ({
            uri: 'pages/serch/serch',
        });
    },
    showRating(){
        this.isRating = true
        if(this.lastRating !== null){
            if(this.rating >= lastRating){
                this.showRatingTip = '太棒了！再接再厉！'
            }else{
                this.showRatingTip = '加油你能做的更好！'
            }
        }
    }
}