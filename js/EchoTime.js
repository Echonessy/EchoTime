/**
 * Created by Echonessy on 2018/3/9.
 */
var SetTimer = null;
var EchoProTime = function () {};
EchoProTime.prototype = {
    Init:function () {
        this.StartEvt();
        this.SideEvt();
        this.AllEvt();
        this.CreatHour(24,'#Hour');
        this.CreatHour(60,'#SecTime');
        this.ChoiceHour();
        this.ChoiceSecHour();
        this.CanvasTime();
    },
    StartEvt:function () {
        var that = this;
        $('#Start').on('click',function () {
            clearInterval(SetTimer);
            $('.TimeSelect ul').css('display','none');
            this.HourTxt = $('#HourTxt').html();
            this.SecTimeTxt = $('#SecTimeTxt').html();
            this.Time = (this.HourTxt.toString()+':'+this.SecTimeTxt.toString()).toString();
            if(this.HourTxt==='小时') {
                $('#TimeBox').html('请选择小时');
            } else if(this.SecTimeTxt==='分钟') {
                $('#TimeBox').html('请选择分钟');
            } else {
                that.TimeIng(this.Time)
            }
        });
    },
//      全局事件
    AllEvt:function () {
        $(document).on('click',function () {
            $('.TimeSelect ul').slideUp(150)
        });
    },
//      下拉事件
    SideEvt:function () {
        var that =this;
        $('.TimeSelect').on('click',function (e) {
            that.stopBubble(e)
            $('.TimeSelect ul').css('display','none');
            $(this).find('ul').slideToggle(150)
        });
    },
//        创建小时分钟
    CreatHour:function (value,ele) {
        var Html = '';
        for(var i=0;i<value;i++){
            if(i<10) {
                Html+='<li>0'+i+'</li>';
            } else {
                Html+='<li>'+i+'</li>';
            }
        }
        $(ele).html(Html)
    },
//        选择小时
    ChoiceHour:function () {
        var that=this;
        $("#Hour li").on('click',function (e) {
            that.stopBubble(e);
            $('#HourTxt').html($(this).html());
            $('#Hour').slideUp(150);
        })
    },
//        选择分钟
    ChoiceSecHour:function () {
        var that=this;
        $("#SecTime li").on('click',function (e) {
            that.stopBubble(e);
            $('#SecTimeTxt').html($(this).html());
            $('#SecTime').slideUp(150);
        })
    },
//        阻止冒泡
    stopBubble:function(evt) {
        var evt = evt||window.event;
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        else {
            window.event.cancelBubble = true;
        }
    },
//        计算前
    TimeIng:function (pramas) {
        this.Time = pramas;
        this.Ele = document.querySelector('#TimeBox');
        var Rex =  /^(([0][0-9]|[1][0-9]|[2][0-4]):([0-5][0-9])|([1][0-9]|[2][0-4]):([0-5][0-9]):([0-5][0-9]))$/;
        if(!this.Time) {
            this.Ele.innerHTML = '请输入时间';
            clearInterval(SetTimer);
        } else {
            if(!Rex.test(this.Time)) {
                this.Ele.innerHTML = '时间格式不正确 参考 xx:xx 或者xx:xx:xx';
                clearInterval(SetTimer);
            }
            else {
                this.FullYear = new Date().getFullYear();
                this.Month = new Date().getMonth()+1;
                this.Day = new Date().getDate();
                this.EndTimeStr = this.FullYear+'/' + this.Month + '/' + this.Day+ ',' + this.Time.toString();
                this.EndTime = new Date(this.EndTimeStr).getTime();
                this.ComputTime(this.EndTime)
            }
        }
    },
//        开始计算时间
    ComputTime:function (value) {
        var that = this;
        SetTimer = setInterval(function () {
            var Time = new Date().getTime();
            var Deviation = value - Time;
            if (Deviation <= 0) {
                clearInterval(SetTimer);
                that.Ele.innerHTML = '下班啦！！！！！！！！';
            }
            else {
                var hour=parseInt(Deviation%86400000/3600000);
                var min=parseInt(Deviation%86400000%3600000/60000);
                var second=parseInt(Deviation%86400000%3600000%60000/1000);
                var ms=parseInt(Deviation%86400000%3600000%60000%1000);
                var Html = '距离下班还有---'+that.ToTwo(hour)+'时'+that.ToTwo(min)+'分'+that.ToTwo(second)+'秒'+that.ToThree(ms)+'毫秒';
                that.Ele.innerHTML = Html;
            }
        },1)
    },
//        转换
    ToTwo:function (t) {
        return t < 10 ? '0'+ t:t;
    },
//        转换
    ToThree:function (t) {
        if(t<100&&t>9){
            t = '0'+t
        } else if (t<10) {
            t = '00'+t
        } else {
            t = t;
        }
        return t;
    },
//        时钟
    CanvasTime:function () {
        var canvas=document.getElementById("canvas");
        if(canvas.getContext("2d"))
        {
            var context=canvas.getContext("2d");
            function clock(){
                context.font="bold 30px  微软雅黑";
                context.clearRect(0,0,400,400)
                /*圆盘*/
                context.beginPath();
                context.strokeStyle='#14C5B9';
                context.lineWidth=10;
                context.arc(200,200,150,0,2*Math.PI,false);
                context.clip();
                context.closePath();
                context.stroke();
                // 时刻度线 360/12=30
                for(var i=0; i<12; i++)
                {
                    context.save();//保存当前绘制状态
                    context.beginPath();
                    context.translate(200,200);//把原点移动到中心
                    context.rotate(i*30*Math.PI/180);//旋转弧度
                    context.moveTo(0,-125);
                    context.lineTo(0,-145);
                    context.lineWidth=6;
                    context.strokeStyle='white';
                    context.stroke();
                    context.closePath();
                    context.restore();//恢复到上面保存的绘制状态
                }
                context.globalCompositeOperation="source-over";
                //分刻度线 360/60=6
                for(var i=0;i<60;i++)
                {
                    context.save();//保存当前绘制状态
                    context.beginPath();
                    context.translate(200,200);//把原点移动到中心
                    context.rotate(i*6*Math.PI/180);//旋转弧度
                    context.moveTo(0,-135);
                    context.lineTo(0,-145);
                    context.lineWidth=3;
                    context.strokeStyle='white';
                    context.stroke();
                    context.closePath();
                    context.restore();//恢复到上面保存的绘制状态
                }
                // 获取时间
                var dates=new Date();
                var h=dates.getHours();
                var m=dates.getMinutes();
                var s=dates.getSeconds();
                function totwo(a){ return a<10? "0"+a:a;}
                h=totwo(Math.floor(h+(m/60),0));
                m=totwo(Math.floor(m+(s/60),0));
                s=totwo(Math.floor(s,0));
                //显示时间
                context.fillStyle ="#fff";
                context.fillText(h+"："+m+": "+s,120,280);
                context.font="30px 微软雅黑";
                context.globalCompositeOperation="source-over";
                //秒针
                context.save();//保存当前绘制状态
                context.beginPath();
                context.translate(200,200);//把原点移动到中心
                context.rotate(s*6*Math.PI/180);//旋转弧度
                context.moveTo(0,10);
                context.lineTo(0,-135);
                context.lineWidth=3;
                context.strokeStyle='#F6001D';
                context.stroke();
                context.closePath();
                context.restore();//恢复到上面保存的绘制状态
                context.globalCompositeOperation="source-over";
                //分针
                context.save();//保存当前绘制状态
                context.beginPath();
                context.translate(200,200);//把原点移动到中心
                context.rotate(m*6*Math.PI/180);//旋转弧度
                context.moveTo(0,10);
                context.lineTo(0,-130);
                context.lineWidth=3;
                context.strokeStyle='#494949';
                context.stroke();
                context.closePath();
                context.restore();//恢复到上面保存的绘制状态
                context.globalCompositeOperation="source-over";
                //时针
                context.save();//保存当前绘制状态
                context.beginPath();
                context.translate(200,200);//把原点移动到中心
                context.rotate(h*30*Math.PI/180);//旋转弧度
                context.moveTo(0,10);
                context.lineTo(0,-115);
                context.lineWidth=3;
                context.strokeStyle='#494949';
                context.stroke();
                context.closePath();
                context.restore();//恢复到上面保存的绘制状态
                // 圆心
                context.globalCompositeOperation="source-over";
                context.save();//保存当前绘制状态
                context.beginPath();
                context.translate(200,200);//把原点移动到中心
                context.arc(0,0,5,0,2*Math.PI,false);
                context.fillStyle='#F6C400';
                context.fill();
                context.closePath();
                context.restore();//恢复到上面保存的绘制状态
            }
            clock();
            setInterval(clock,1000);
        }
        else {
            alert("您的浏览器不支持")
        }
    }
}