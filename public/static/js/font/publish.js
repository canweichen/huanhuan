/**
 * Created by Machenike on 2018/2/5.
 */
$(function(){
    //清空多张商品图片--普通商品
    $(".clear_picture").click(function(){
        $("#more_picture").html("");
    });
    layui.use('upload', function() {
        var $ = layui.jquery ,
            upload = layui.upload;
        //上传商品默认图片--普通商品
        upload.render({
            elem: '#default',
            url: '',
            before: function (obj) {
                //预读本地文件示例，不支持ie8
                console.log(obj);
                obj.preview(function (index, file, result) {
                    $('#default_img').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                //如果上传失败
                console.log(res);
                if (res.code > 0) {
                    return layer.msg('上传失败');
                }
                //上传成功
            }
        });
        //上传详情商品--多张--普通商品
        upload.render({
            elem: '#more_pic_btn',
            url: '',
            multiple: true,
            auto: false ,//选择文件后不自动上传
            bindAction: '#publicNormal',//指向一个按钮触发上传
            choose: function(obj){
                //将每次选择的文件追加到文件队列
                var files = obj.pushFile();
                //获取对象长度
                console.log(Object.keys(obj));
                obj.preview(function(index, file, result){
                    console.log(files[index]);
                    $('#more_picture').append('<img src="'+ result +'" alt="'+ file.name +'" class="layui-upload-img" style="width: 120px;height: 120px">');
                });
            },
            before:function(){

            },
            allDone: function(obj){ //当文件全部被提交后，才触发
                //console.log(obj); //得到总文件数
            }/*,
             done: function(res){
             //上传完毕
             }*/
        });
    });
});
new Vue({
    el:'#app' ,
    data:{
        judge:false,//判断活动商品的时间选项是否显示
        selected:'',//定义select框的默认值
        type:[
            {name:"普通商品",op:1},
            {name:"拍卖商品",op:2}
        ],
        seem:false,
        typeList:type,
        degreeList:degree,
        brandList:brand,
        tradeType:1,
        childType:13,
        degreeTrade:1,
        provinceList:[],
        cityList:[],
        areasList:[],
        province:110000,
        city:110100,
        area:110101
    },
    methods:{
        //拍卖商品和普通商品发布页面切换
        actionType:function(){
            if(this.selected==2){
                this.judge=true;
            }else{
                this.judge=false;
            }
        },
        //联动类型的子品牌
        changeBranch:function(){
            $.ajax({
                type:'post',
                url:get_node_type,
                data:{id:this.tradeType},
                success:function(res){
                    this.brandList=JSON.parse(res);
                    this.childType = JSON.parse(res)[0].ts_id;
                }.bind(this)
            });
        },
        //获取省
        getProvince:function(id){
            $.ajax({
                type:'post',
                url:get_province,
                success:function(res){
                    this.provinceList=JSON.parse(res);
                    if(id[0]==1){
                        this.province = JSON.parse(res)[0].provinceid;
                        this.getCity([1,2,3]);
                    }else{
                        this.province = id[0];
                        this.getCity(id);
                    }
                }.bind(this)
            });
        },
        //获取市区
        getCity:function(id){
            $.ajax({
                type:'post',
                url:get_city,
                data:{"province":this.province},
                success:function(res){
                    this.cityList=JSON.parse(res);
                    if(id[0]==1){
                        this.city = JSON.parse(res)[0].cityid;
                        this.getArea([1,1,3]);
                    }else{
                        this.getArea(id);
                        this.city = id[1];
                    }
                }.bind(this)
            });
        },
        //获取区县
        /*--if判断为识别标志位 有条件按条件进行（用于修改地址 修改商品） 没条件按没条件进行操作（添加地址 添加商品 完善个人资料）--*/
        getArea:function(id){
            if(id[1]!=1){
                this.city = id[1];
            }
            if(this.city!=""){
                $.ajax({
                    type:'post',
                    url:get_areas,
                    data:{"city":this.city},
                    success:function(res){
                        this.areasList=JSON.parse(res);
                        if(id[1]==1){
                            this.area = JSON.parse(res)[0].areaid;
                        }else{
                            this.area = id[2];
                        }
                    }.bind(this)
                });
            }
        }
    },
    created: function () {
        //加载完成后执行内容区
        this.getProvince([1,1,1]);
    }
});