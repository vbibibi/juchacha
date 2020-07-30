var cardData = new Array();
var cardHtml = '<section class="cardList mb10 pb10">'+
                    '<div class="cardTel pl15 f14 ">'+
                        '<span class="cardPhone"></span>'+
                        '<a href="javascript:;" class="go-top tc mr10">置顶</a>'+
                        '<a href="javascript:;" class="go-call tc" ></a>'+
                    '</div>'+
                    '<div class="pl10 pr10 carouselBox">'+
                        '<div class="carousel slide">'+
                            '<div class="carousel-inner">'+
                            '</div>'+
                        '</div>'+                        
                        '<div class="abtn">'+                            
                            '<a href="javascript:;" class="btn btn-default tc btnPage fr"><span class="prevBtn"> < </span><span class="pageCur">1</span>/<span class="pageNum"></span><span class="nextBtn"> > </span></a>'+
                        '</div>'+
                    '</div>'+
                '</section>';
function getCardList (obj){
    var datas = {
        nameCn : obj
    }
    public_ajax({data:key_md5(datas),url:dataUrl.cardList,fun:function(res){
        if(res.status == 1000){
            cardData = res.data;
            if(cardData.length == 0){
                $(".cardListNum").text("0");
                $(".cardListAll").append('<div class="nodata"><img src="assets/images/nodata.png"/><p>暂无数据</p></div>');
                return false;
            }
             // 执行到最后一段
            for(var i = 0; i< cardData.length; i++){
                var cardData_values = cardData[i].values;
                $(".cardListAll").append(cardHtml);
                $(".cardList").eq(i).addClass('cardList'+i);  
                $(".cardList").eq(i).find(".carousel").addClass('carousel'+i);
                $(".cardList").eq(i).attr("data-num",i);  
                $(".cardList").eq(i).attr("data-num") < 5 ? $(".cardList").eq(i).addClass('cardTopIcon') : $(".cardList").eq(i).removeClass('cardTopIcon');
                getData(i,0);
                getTopBtn();
                getFormList(cardData_values,i);
            }
            // 初始化轮播图
            $(".item1").eq(0).addClass('active');
        }else{
            bagHintModalFn('warn',res.message);
        }
    }})
}

function getFormList(datas,n){
    for(var j = 0;j<datas.length;j++){
        html = '<div class="item" data-id="'+j+'">'+
                        '<form class="form-horizontal" role="form">'+
                            '<div class="form-group f12 mb0 ">'+
                                '<label class="col-sm-3 control-label fc pl0 pr0 ">联系人:</label>'+
                                '<div class="col-sm-9 pl0">'+
                                    '<p class="form-control-static cardName ">'+datas[j].contacts+'</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-group f12 mb0 ">'+
                                '<label class="col-sm-3 control-label fc pl0 pr0 0">QQ号码:</label>'+
                                '<div class="col-sm-9 pl0">'+
                                    '<p class="form-control-static cardQQ">'+datas[j].qq+'</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-group f12 mb0 ">'+
                                '<label class="col-sm-3 control-label fc pl0 pr0 ">电子邮箱:</label>'+
                                '<div class="col-sm-9 pl0">'+
                                    '<p class="form-control-static cardMail">'+datas[j].email+'</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-group f12 mb0 ">'+
                                '<label class="col-sm-3 control-label fc pl0 pr0 ">联系地址:</label>'+
                                '<div class="col-sm-9 pl0">'+
                                    '<p class="form-control-static cardAdress">'+datas[j].address+'</p>'+
                                '</div>'+
                            '</div>'+                  
                        '</form>'+
                        '<div class="cardSource clearfix mt10">'+
                            '<a href="'+datas[j].url+'" class="tc fl platName" target="_blank">'+datas[j].platName+'</a>'+
                        '</div>'
                        
                    '</div>';
            $(".cardList"+n).find(".carousel-inner").append(html);
            $(".cardList"+n).find(".carousel-inner").children(":first").addClass('active');
            carouselBtn(n,datas.length);
    } 
}
function carouselBtn(n,j){
    var len = cardData[n].values.length;
    $(".cardBox").find(".cardList"+n).on("click", ".prevBtn", function() {
        var cur = $(".carousel"+n).find(".item.active").index()+1;
        var curBtn = $(this).siblings('.pageCur');
        $(".carousel"+n).carousel('prev');
        cur == 1 ? curBtn.text(len) : curBtn.text(cur - 1);
    });
    // 循环轮播到下一个项目
    $(".cardBox").find(".cardList"+n).on("click", ".nextBtn", function() {
        var cur = $(".carousel"+n).find(".item.active").index() + 1;
        var curBtn = $(this).siblings('.pageCur');
        $(".carousel"+n).carousel('next');
        cur == len ? curBtn.text(1) : curBtn.text(cur + 1);
    });
    $(".carousel").carousel('pause');
}

function getTopBtn(){
    $(".cardBox").on("click", ".go-top", function() {
        var parentDiv = $(this).parents(".cardList");
        var len = $(".cardList").length;
        var parentDataNum = parentDiv.attr("data-num");
        var prev = parentDiv.prev()
        if(prev.html() !== undefined){
             // prev.fadeOut('500',function () {
                 prev.before(parentDiv);
                 for(var i = 0;i<len;i++){
                    var cardCur = $(".cardList"+i);
                    var indexList = parseInt($(".cardList"+i).attr("data-num"));
                    if(indexList < parentDataNum) cardCur.attr("data-num",indexList + 1) ;
                    if(indexList == parentDataNum) cardCur.attr("data-num",0);
                    indexList < 5 ? cardCur.addClass('cardTopIcon') : cardCur.removeClass('cardTopIcon');
                 }
             // }).fadeIn();
        } 
    })
}


function getData(n,m){
    var self = $(".cardList").eq(n);
    var cardValue = cardData[n].values[m];
    if(!is_call){
        self.addClass('no-phone')
    }else{
        if(cardData[n].phone.length == 0){
            self.addClass('no-phone')
        }
    }    
    $(self).find(".cardPhone").text(cardData[n].phone);
    $(self).find(".pageNum").text(cardData[n].values.length);
    $(".cardListNum").text(cardData.length);
    
}

 
    