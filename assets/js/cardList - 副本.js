var cardHtml = '<section class="cardList mb10 pb10">'+
                    '<div class="cardTel pl15 f14 ">'+
                        '<span class="cardPhone"></span>'+
                        '<a href="javascript:;" class="go-top tc fr mr10">置顶</a>'+
                    '</div>'+
                    '<div class="pl10 pr10">'+
                        '<form class="form-horizontal" role="form">'+
                            '<div class="form-group f12 mb0 ">'+
                                '<label class="col-sm-3 control-label fc pl0 pr0 ">联系人:</label>'+
                                '<div class="col-sm-9 pl0">'+
                                    '<p class="form-control-static cardName "></p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-group f12 mb0 ">'+
                                '<label class="col-sm-3 control-label fc pl0 pr0 0">QQ号码:</label>'+
                                '<div class="col-sm-9 pl0">'+
                                    '<p class="form-control-static cardQQ"></p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-group f12 mb0 ">'+
                                '<label class="col-sm-3 control-label fc pl0 pr0 ">电子邮箱:</label>'+
                                '<div class="col-sm-9 pl0">'+
                                    '<p class="form-control-static cardMail"></p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-group f12 mb0 ">'+
                                '<label class="col-sm-3 control-label fc pl0 pr0 ">联系地址:</label>'+
                                '<div class="col-sm-9 pl0">'+
                                    '<p class="form-control-static cardAdress"></p>'+
                                '</div>'+
                            '</div>'+                  
                        '</form>'+
                        '<div class="cardSource clearfix mt10">'+
                            '<a href="javascript:;" class="tc fl platName">金安发</a>'+
                            '<a href="javascript:;" class="btn btn-default tc btnPage fr"><span class="prev"><</span><span class="pageCur">1</span>/<span class="pageNum"></span><span class="next">></span></a>'+
                        '</div>'+
                    '</div>'+
                '</section>';
var cardData;
function getCardList (obj){
    var datas = {
        nameCn : obj
    }
    public_ajax({data:key_md5(datas),url:dataUrl.cardList,fun:function(res){
        if(res.status == 1000){
            cardData = res.data;
             // 执行到最后一段
            for(var i = 0; i< cardData.length; i++){
                $(".cardListAll").append(cardHtml);
                $(".cardList").eq(i).addClass('cardList'+i);  
                $(".cardList").eq(i).attr("data-num",i);  
                $(".cardList").eq(i).attr("data-num") < 5 ? $(".cardList").eq(i).addClass('cardTopIcon') : $(".cardList").eq(i).removeClass('cardTopIcon');              
                getData(i,0);
                getTopBtn();
            }
        }else{
            bagHintModalFn('warn',res.message);
        }
    }})
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
    $(self).find(".cardPhone").text(cardData[n].phone);
    $(self).find(".cardName").text(cardValue.contacts);
    $(self).find(".cardQQ").text(cardValue.qq);
    $(self).find(".cardMail").text(cardValue.email);
    $(self).find(".cardAdress").text(cardValue.address);
    $(self).find(".platName").text(cardValue.platName);
    $(self).find(".platName").attr("href",cardValue.url);
    $(self).find(".pageNum").text(cardData[n].values.length);
    $(".cardListNum").text(cardData.length);
    getPageNum();
}

function getPageNum(){
    var m = 1;
    $(".btnPage").on("click",function(){
        var self = $(this).parents(".cardList").index();
        if(cardData[self].values.length>1){
            if(m ==  cardData[self].values.length){
                return;
            }else{
                 m++;
                 getData(self,m-1);
                 $(this).find(".pageCur").text(m)
            }     
        }else{
            return;
        }
    })
}    
    