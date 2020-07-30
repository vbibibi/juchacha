var objUrl = {
    juchacha_search: jcc_url.test+"/juchacha_search_1",
    juchacha_condition: jcc_url.test+"/juchacha_condition_1",
}
var filter;
$(function(){
    wheel();
    getCondition();

})

function getCondition(){
    public_ajax({data:key_md5(),url:objUrl.juchacha_condition,fun:function(res){
        if (res.status==1000) { 
            var data = res.data;    
            filter = data.Filter;        
            // console.log(filter)      
            filter.map(function(m,n){
                var html = '<a href="javascript:;" class="item" data-value='+m.value+'>'+m.name+'</a>';
                $(".correlation").append(html);
            })
        }else{
            bagHintModalFn('warn',res.message);
        }                            
    }});
}

$(".correlation").on("click",".item",function(){
    var name = $(this).attr("data-value");
    var self = $(this);
    var obj= {"from":1,'sort':{"key":"RegistCapi","value":"desc"}};
    if(self.hasClass('active')){
        self.removeClass('active');
        obj.Filter = ''
    }else{
        self.addClass('active').siblings().removeClass('active');
        obj.Filter = name;
    }
    var dataObj = {"fields":JSON.stringify(obj)}
    public_ajax({data:key_md5(dataObj),url:objUrl.juchacha_search,fun:function(res){
        if (res.status==1000) { 
            var data = res.data;                  
            // sessionStorage.setItem("Filter",name);
        }else{
            bagHintModalFn('warn',res.message);
        }                            
    }});
})

function formVerify(){
    var val = $('[name="Name"]').val();
    if (val==""){
        return false
    }
}

// 滚动函数
function wheel(){
    function scroll(len,num,callback){
        $('.scroll_icon li').eq(len).addClass('active').siblings().removeClass('active');
        $('.scroll').animate({
            'marginTop':-(len*h)+'px'
        },num,'swing',function(){
            if(callback)callback();
        })
        setTimeout(function(){
            $('.scroll .scroll-item').eq(len).addClass('active').siblings().removeClass('active');
        },300)
    }

    // 判断内核
    var regStr_chrome = (function(){
        var ua = navigator.userAgent.toLocaleLowerCase();
        if(ua.match(/chrome/)){
            return ua.match(/chrome\/([\d.]+)/)[1].match(/^\d+/)[0] > 53
        }
        return false
    })();

    var len = $('.scroll .scroll-item').length-1,
        h = $(document).height();
        index = 0,
        scroll_bol=false;

    $(window).on('resize',function(){
        h = $(document).height();
        $('.scroll').css('marginTop',-(index*h)+'px')
    })

    $('.scroll .scroll-item').eq(index).addClass('active').siblings().removeClass('active');

    $(document).on('mousewheel DOMMouseScroll', function(e){
        if(!scroll_bol){
            var e = e || window.event;
            if(!regStr_chrome)e.preventDefault();
            var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail,
                delta = Math.max(-1, Math.min(1, wheel) );
            if(delta<0){ //向下滚动
                index++
                if(index>len){
                    index = len
                }
                else{
                    scroll_bol = true
                    scroll(index,800,function(){
                        scroll_bol = false;
                    })
                }
            }else{ //向上滚动
                index--
                if(index<0){
                    index = 0
                }
                else{
                    scroll_bol = true
                    scroll(index,800,function(){
                        scroll_bol = false;
                    })
                }
            }
        }
    });

    $('.scroll_icon li').on('click',function(){
        if(!scroll_bol){
            var i = $(this).index();
            index = i;
            scroll_bol = true
            scroll(index,600,function(){
                scroll_bol = false;
            })
        }
    })


}