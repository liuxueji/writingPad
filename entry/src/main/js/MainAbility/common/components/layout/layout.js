export default {
    props:{
        iconBaseUrl:{
            default:"common/images/icon/"
        },
        activeBaseUrl:{
            default:"common/images/icon_active/"
        },
        menu:{
            default:[
                {
                    icon :  "clear.png",
                    active :"clear_active.png",
                    title: "1"
                },
                {
                    icon: "clear.png",
                    active: "clear_active.png",
                    title: "绘画"
                },
                {
                    icon :  "clear.png",
                    active :"clear_active.png",
                    title: "2"
                },
                {
                    icon :  "clear.png",
                    active :"clear_active",
                    title: "3"
                }
            ]
        },
        menuCustomStyle:{
            default:{
                activeColor : "#ffC300",
                backgroundColor : "#fff",
                fontSize : "19px",
                color : "#343434"
            }
        },
        backgroundColor:{
            default : "#f7f5fb"
        }
    },
    data(){
        return {
                imgUrl:[]
          }
    },
    changePage(e){ //发生change事件时，根据当前页数来激活

        for(let i = 0; i < this.imgUrl.length ; i++){
            if( !this.imgUrl[i].show ) continue;
            this.imgUrl[i].show = false;
        }
        this.imgUrl[e.index].show = true;

        this.$emit("childLayoutChange",this.imgUrl[e.index].title);
    },
    onInit(){
        for (let index = 0; index < 4 ; index++) {//初始化导航
            let show = index === 0 ? true : false;
            let temp = {
                ...this.menu[index],
                show
            }
            this.imgUrl.push(temp)

        }
    },
    onReady(){

//        console.log(this.$refs["tes"]);
    }
}
