var dataUrl = {
    qichacha:jcc_url.test+'/juchacha_qichacha',
    alibaba:jcc_url.test+"/juchacha_alibaba",
    china_made:jcc_url.test+"/juchacha_made",
    juchacha_gs:jcc_url.test+ "/juchacha_gs",        
    cardList:jcc_url.test+"/juchacha_contacts",
    invite:jcc_url.test+"/juchacha_invite",
    others:jcc_url.test+"/juchacha_base",
    report:jcc_url.test+"/juchacha_report",
    assets:jcc_url.test+"/juchacha_assets",
    run:jcc_url.test+"/juchacha_run",
    susong:jcc_url.test+"/juchacha_susong",
    changelist:jcc_url.test+"/juchacha_changelist",
    juchacha_call:jcc_url.test+"/juchacha_call",
    juchacha_protect:jcc_url.test+"/juchacha_protect"
}
var is_call = false;
// var cNum = 1;//变更记录的初始化值
$(function(){   
    var dataList;
    var otherList;
    var token_key;
    if(getQueryString("token") != null || getQueryString("token") != undefined){
        token_key = getQueryString("token")
    }else{
        token_key = sessionStorage.getItem("token_key")
    }
    if(getQueryString("source") == "central"){
        var datas = {
            ParentID:pId,
            source:"central",
            admin_id:token_key
        }
    }else{
        var datas = {
            ParentID:pId
        }
    }
    public_ajax({data:key_md5(datas),url:dataUrl.qichacha,fun:function(res){
        if(res.status == 1000){
            var data = res.data;            
            dataList = data;
            // console.log(dataList.KeyNo)
            $('.companyName').text(data.Name)
            $('.company_country').text(data.Country)
            $('.company_industry').text(data.Industry)
            $('.company_scale').text(data.staffSize)
            $('.company_capital').text(data.RegistCapi)
            $('.company_website').text(data.WebSite)
            $('.company_update_time').text(data.update_time)
            // 法定代表人
            $('.operName').text(data.OperName)
            $('#Ali').attr('EgName',data.nameEg)
            var temp = template('relat-info',data);
            $('.company-info tbody').html(temp);

            rotateCircle(data.total_score);

            // 获取详情信息
            is_call = data.is_call;           
            // console.log(data.is_call);
            getCardList(data.Name);  
            var flagName = getQueryString("flag");
            if(getQueryString("source") == "central"){
                if(data.is_protect == 1){
                    $(".protectBtn").addClass('cur');
                    $(".protectBtn").removeClass('glyphicon-plus')
                    $(".protectBtn").removeClass('glyphicon')
                    $(".protectBtn").text("已保护");                   
                }
                $(".phone-record h4 span").text(data.call_month_total);
                $(".phone-record .phone-showbox h4 span").text(data.call_total);
                if(data.call.length > 0){
                    data.call.map(function(m,n){
                        $(".phone-record .phone-showbox ul").append("<li class='call_li'>"+m+"</li>")
                    })                       
                }else{
                    $(".phone-record .phone-showbox ul").append("<li class='call_li'>没有数据</li>")
                }
            }
            // setTimeout(function(){
                if(flagName){
                    if(flagName=='alibaba'){
                        Ali();
                    }else if(flagName=='made'){
                        ch_made();
                    }else if(flagName=='gs'){
                        globalSourse();
                    }
                    $('.tab-content div[role=tabpanel]').removeClass('in').removeClass('active')
                    // $(`.tab-content div[name=${flagName}]`).addClass('in').addClass('active')
                    $('.tab-content div[name=flagName]').addClass('in').addClass('active')                   
                    $('ul[role=tablist] li[role=presentation]').removeClass('active')
                    $('ul[role=tablist] li[name=flagName]').addClass('active')                   
                    // $(`ul[role=tablist] li[name=${flagName}]`).addClass('active')
                }else{
                    getOther(dataList.KeyNo);                    
                }
            // }, 300)
            
        }else{
            bagHintModalFn('warn',res.message);
        }
    }})
    
    $(".phone-record").on("click",function(e){
        e.stopPropagation();
        $(".phone-record .phone-showbox").show();
    })
    $("body").on("click",function(e){
        $(".phone-record .phone-showbox").hide();
    })

    function getOther(keyNo){
        var datas = {
            KeyNo:keyNo
        }
        // other
        public_ajax({data:key_md5(datas),url:dataUrl.others,fun:function(res){
            if(res.status == 1000){
                var data = res.data;
                getnavLi("#basicMsgInfo");
                if(JSON.stringify(data) != "{}"){
                    getTemplate("key_personnel_tpl",data.mainmember,".key-personnel tbody");
                    // getTemplate("shareholder_info_tpl",data.partners,".shareholder-info tbody");
                    // getTemplate("alteration_record_tpl",data.changelist,".alteration-record tbody");
                    getTemplate("touzi_tpl",data.touzi,".touzi-info tbody");
                    getTemplate("subcom_tpl",data.subcom,".subcom-info tbody");
                    //变更 
                    otherList = data;
                    getChangeList(1,otherList.changelist,"pageList","alteration_record_tpl",".alteration-record tbody");
                    getChangeList(1,otherList.partners,"pageList1","shareholder_info_tpl",".shareholder-info tbody")
                    getPageH();
                }
            }else{
                bagHintModalFn('warn',res.message);
            }
        }})
    }
    // function getChangelist(pnum){
    //     var datas = {
    //         KeyNo:dataList.KeyNo,
    //         page:pnum
    //     }
    //     public_ajax({data:key_md5(datas),url:dataUrl.changelist,fun:function(res){
    //         if(res.status == 1000){
    //             var data = res.data;
    //             if(JSON.stringify(data) != "{}"){
    //                 getTemplate("alteration_record_tpl",data,".alteration-record tbody");  
    //                 pageNate({
    //                     total:res.total,
    //                     pageSize:10,
    //                     pageNumber:pnum,
    //                     name:$('#pageList'),
    //                     callback:function(pageNumber,pageSize){
    //                         getChangelist(pageNumber)
    //                     }
    //                 })
    //             }
    //         }else{
    //             bagHintModalFn('warn',res.message);
    //         }
    //     }})
    // }
    function getChangeList(pnum,list,id,module,module_table){    
        if(list.length > 10){      
            var totalnum = Math.ceil(list.length / 10);
            var afterLen = list.length - (pnum-1)*10;
            var star = (pnum-1)*10;
            if(afterLen < 10 ){
               var showList = list.slice(star);
            }else{
               var showList = list.slice(star,star+10);
            }
            pageNate({
                total:list.length,
                pageSize:10,
                pageNumber:pnum,
                name:$("#"+id),
                callback:function(pageNumber,pageSize){
                    getChangeList(pageNumber,list,id,module,module_table)
                }
            })               
        }else{
            var showList = list;
        }
        getTemplate(module,showList,module_table);
        getPageH();
    }

    function getreport(keyNo){
        var datas = {
            KeyNo:keyNo
        }
        public_ajax({data:key_md5(datas),url:dataUrl.report,fun:function(res){
            if(res.status == 1000){
                var data = res.data;
                getnavLi("#development");
                if(JSON.stringify(data) != "{}"){                   
                    getTemplate("financing_tpl",data.financing,".financing tbody");
                    getTemplate("investAgency_tpl",data.investAgency,".investAgency tbody");
                    getTemplate("product_tpl",data.product,".product tbody");
                    getTemplate("compatProduct_tpl",data.compatProduct,".compatProduct tbody");
                    getTemplate("member_tpl",data.member,".member tbody");
                    getPageH(); 
                }
            }else{
                bagHintModalFn('warn',res.message);
            }
        }})
    }
    function getassets(keyNo){
        var datas = {
            KeyNo:keyNo
        }
        public_ajax({data:key_md5(datas),url:dataUrl.assets,fun:function(res){
            if(res.status == 1000){
                var data = res.data;
                getnavLi("#property");
                if(JSON.stringify(data) != "{}"){                   
                    getTemplate("shangbiao_tpl",data.shangbiao,".shangbiao tbody");
                    getTemplate("zhuanli_tpl",data.zhuanli,".zhuanli tbody");
                    getTemplate("zhengshu_tpl",data.zhengshu,".zhengshu tbody");
                    getTemplate("zpzzq_tpl",data.zpzzq,".zpzzq tbody");
                    getTemplate("rjzzq_tpl",data.rjzzq,".rjzzq tbody");
                    getTemplate("website_tpl",data.website,".website tbody");
                    getPageH(); 
                }  
            }else{
                bagHintModalFn('warn',res.message);
            }
        }})
    }
     function getRun(keyNo){
        var datas = {
            KeyNo:keyNo
        }
        public_ajax({data:key_md5(datas),url:dataUrl.run,fun:function(res){
            if(res.status == 1000){
                var data = res.data;
                getnavLi("#managementStatu");
                if(JSON.stringify(data) != "{}"){          
                    getTemplate("tender_tpl",data.tender,".m_tender tbody");
                    getTemplate("job_tpl",data.job,".m_job tbody");
                    getTemplate("wechat_tpl",data.wechat,".m_wechat tbody");
                    getTemplate("weibo_tpl",data.weibo,".m_weibo tbody");
                    getTemplate("yanbao_tpl",data.yanbao,".m_yanbao tbody");
                    getTemplate("supplier_tpl",data.supplier,".m_supplier tbody");
                    getTemplate("customer_tpl",data.customer,".m_customer tbody"); 
                    getPageH(); 
                }
            }else{
                bagHintModalFn('warn',res.message);
            }
        }})
    }
    function getSusong(keyNo){
        var datas = {
            KeyNo:keyNo
        }
        public_ajax({data:key_md5(datas),url:dataUrl.susong,fun:function(res){
            if(res.status == 1000){
                var data = res.data;
                getnavLi("#lawStatu");
                if(JSON.stringify(data) != "{}"){                  
                    getTemplate("wenshu_tpl",data.wenshu,".l_wenshu tbody");
                    getTemplate("gonggao_tpl",data.gonggao,".l_gonggao tbody");
                    getTemplate("notice_tpl",data.notice,".l_notice tbody");
                    getTemplate("zhixing_tpl",data.zhixing,".l_zhixing tbody");
                    getTemplate("lian_tpl",data.lian,".l_lian tbody");
                    getPageH(); 
                }
                // getTemplate("supplier_tpl",data.supplier,".m_supplier tbody");
                // getTemplate("customer_tpl",data.customer,".m_customer tbody");                
            }else{
                bagHintModalFn('warn',res.message);
            }
        }})
    }
    function getnavLi(id){
        $(id).find(".nav_li").removeClass('active');
        $(id).find(".nav_li:first-child").addClass('active');
    }
    function getTemplate(id,data,parent1){
        var temp = template(id,{data:data});
        $(parent1).html(temp);
    }
    // 获取通讯信息资料
    // public_ajax({data:key_md5(datas),url:dataUrl.cardList,fun:function(res){
    //     if(res.status== 1000){
    //     }else{
    //         bagHintModalFn('warn',res.message);
    //     }
    // }})
    // 从中控跳过来切换到指点的tab
    

    if(getQueryString("source") == "central"){
        // $(".navbar").hide();
        // $(".footer-fix").hide();
        $(".page-wrapper").addClass('on');
        setInterval(function(){
           getPageH();          
        }, 300)
    }

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var tar = $(e.target).attr("id");
        getPageH();
        switch(tar){
            case 'basicMsg':
                getnavLi("#basicMsgInfo");
                getOther(dataList.KeyNo);
                break;
            case 'Ali':
                Ali();
                break;
            case 'ch_made': 
                ch_made()
                break;
            case 'global':
                globalSourse()
                break;
            case 'zhaopin':
                zhaopin("1")
                break;
            case 'fz':
                getreport(dataList.KeyNo);
                break;
            case 'cq':
                getassets(dataList.KeyNo);
                break;
            case 'ms':
                getRun(dataList.KeyNo);
                break;
            case 'lawss':
                getSusong(dataList.KeyNo);
                break;
        }
        // getPageH(); 
    })
    // 阿里巴巴
    function Ali(){
        var data = {
            ParentID:pId
        }
        public_ajax({data:key_md5(data),url:dataUrl.alibaba,fun:function(res){
            if(res.status==1000){
                var data = res.data;
                if(JSON.stringify(data) != "{}"){
                    // console.log(data)
                    var temp = template('Alibaba',data);
                    $('.alibaba-info tbody').html(temp);
                    getPageH();
                }
            }else{
                bagHintModalFn('warn',res.message);
            }
        }})
    }
    // 招聘信息
    var zhaopinData;
    function zhaopin(num){ 
        var datas = {
            nameCn:dataList.Name,
            offset:num
        }
        public_ajax({data:key_md5(datas),url:dataUrl.invite,fun:function(res){
            if(res.status == 1000){
                var data = res.data;
                if(JSON.stringify(data) != "{}"){
                    var temp = template('zhaopin_tpl',{data:data});
                    console.log(temp)
                    $(".zhaopin-info tbody").html(temp);
                    if(res.total > 9){
                        pageNate({
                        total:res.total,
                            pageSize:10,
                            pageNumber:res.offset,
                            name:$("#pageList2"),
                            callback:function(pageNumber,pageSize){                          
                                zhaopin(pageNumber)
                            }
                        }) 
                    }                 
                    getPageH();
                }
            }
        }})
    }
    // 中国制造
    function ch_made(){ 
        var datas = {
             ParentID:pId
        }
        public_ajax({data:key_md5(datas),url:dataUrl.china_made,fun:function(res){
            if(res.status == 1000){
                var data = res.data;
                if(JSON.stringify(data) != "{}"){
                    var temp = template('made_china_tpl',data);                
                    $('.made-china-info tbody').html(temp)
                    getPageH();
                    var img = new Image()   
                    img.onload = function (){
                        $('.made-china-info tbody tr').each(function(i,dom){
                            $(dom).find('td img').attr('src',$(dom).find('td img').attr('data-src'))       
                        })
                    }
                }
            }
        }})
    }

    // 环球资源  
    function globalSourse(){
        var datas = {
            ParentID:pId
        }
        public_ajax({data:key_md5(datas),url:dataUrl.juchacha_gs,fun:function(res){
            if(res.status == 1000) {
                var data = res.data;
                if(JSON.stringify(data) != "{}"){
                    var temp = template('global_sourse_tpl',data);
                    $('.global-sourse-info tbody').html(temp)
                    var img = new Image()   
                    img.onload = function (){
                        $('.global-sourse-info tbody tr').each(function(i,dom){
                            $(dom).find('td img').attr('src',$(dom).find('td img').attr('data-src'))       
                        })
                    }
                    getPageH();
                }
            }else{
                bagHintModalFn('warn',res.message);
            }
            
        }})
    }

    $('.precise-query-wrap').on('click', '.clear-selected', function() {
        $(this).siblings('.item-inner').find('a').remove();
        $(this).remove()
    });
    $('.precise-query-wrap').on('click', '.del-selected-item', function() {
        var len = $(this).closest('.item-inner').find('a').length;
        $(this).parent().remove();
        if(len==1) $('.clear-selected').hide();
    });

    $(".nav_li").on("click",function(){
        $(this).addClass('active').siblings().removeClass('active');
        var id =  $(this).attr("attr-id");
        var th = $(id).offset().top;
        $(window).scrollTop(th-80);
    })

    // 拨打电话
    $(".cardBox").on("click",".go-call",function(){
        var tel = $(this).siblings('.cardPhone').text();
        var datas = {
            mobile:tel,
            admin_id:token_key,
            ParentID:pId
        }
        public_ajax({data:key_md5(datas),url:dataUrl.juchacha_call,fun:function(res){
            if(res.status == 1000){
                bagHintModalFn('success',res.message);
            }else{
                bagHintModalFn('warn',res.message);
            }
        }})
    })
    // 点击保护
    $(".protectBtn").on("click",function(){
        var self = $(this);
        if(self.hasClass('cur')){
            bagHintModalFn('success','该用户已经添加过，无需再添加。');
        }else{
            var datas = {
                ParentID:pId,
                admin_id:token_key
            }
            public_ajax({data:key_md5(datas),url:dataUrl.juchacha_protect,fun:function(res){
                if(res.status == 1000){
                    bagHintModalFn('success',res.message);
                    self.addClass('cur');
                    self.removeClass('glyphicon');
                    self.removeClass('glyphicon-plus');               
                    self.text("已保护");
                }else{
                    bagHintModalFn('warn',res.message);
                }
            }})
        }
    })

    $(".backBtn").on("click",function(){
        sessionStorage.setItem("back_key", "goback");
        window.history.go(-1);
    })

    function rotateCircle(val){
        $(".circle_box").show();
        var circleId =  document.querySelector("#circleId");
        var circleLength = Math.floor(2 * Math.PI * circleId.getAttribute("r"))
        var newval = parseFloat(val).toFixed(2)
        newval = Math.max(0,val)
        newval = Math.min(100,val)
        $(".circle_text").text(newval)
        setTimeout(function(){
            circleId.setAttribute("stroke-dasharray","" + circleLength * newval / 100 + ",10000")
        },200)
    }      
})