

var objUrl = {
    juchacha_search:  jcc_url.test+"/juchacha_search_1",
    juchacha_condition: jcc_url.test+"/juchacha_condition_1",
    juchacha_protect: jcc_url.test+"/juchacha_protect"
}
var relatedata1;//搜索时候传的数据
var cityArr = new Array();//点击city创建新的区域选中的数组 多选城市数组
var cityObj = [];
var industryArr = []; //多选行业数组
var radioindustryArr = []; //单选行业数组
var radioCityArr = [];      //单选城市数组
var shortStatus = '';    //营业状态
var contacts = '';       //联系方式
var RegistCapi = '';     //注册资本
var StartDate = '';      //成立年限
var EconKind = '';    //企业类型
var Recruitment = ''; //招聘情况
var OnlineMarket = '';//网络推广
var Domain = '';  //网络域名
var Brand = ''; //商标
var Patent = ''; //专利
var Bid = ''; //招投标
var Tencent = '';//公众号
var Foreign = '';//外贸网站
var Filter = '';
// var Enterprise = '';//企业信息
var allDataArr = []; //所有选择的值
var sort = {"key":"RegistCapi","value":"desc"};
var searchNameCn = '';
var newShaixuan = [];
var lastrelatedata;
var pageListSize = '';
var city_arr = city_arr.sort(function(a,b){
    return a.pinyin.localeCompare(b.pinyin);
})
getCondition();
if( getQueryString("source") == "central") {
    if(sessionStorage.getItem("back_key") == "goback"){      
        $(".search-item-wrapper").show();
        $(".pageListBox").show();
        relateQuery();
    }else{
        $(".search-item-wrapper").hide();
        $(".pageListBox").hide();
        // console.log(getQueryString("Name"))
        if(getQueryString("Name") != "" && getQueryString("Name")) relateQuery();
    }
    
}else{
    $(".search-item-wrapper").show();
    $(".pageListBox").show();
    relateQuery();
}
//筛选项目 
// var urlname = getQueryString("Name");
$('#listForm input[name="Name"]').val(getQueryString("Name"));

if(getQueryString("source") == "central"){
    $(".page-wrapper").addClass('on');
}

function re_repeat(arr,cur){
    arr.indexOf(cur) < 0 ? arr.push(cur) : arr.splice($.inArray(cur,arr),1)
}

$(".retract-list").on("click",function(){
    if(!$(this).hasClass('on')){
        $(this).addClass('on');
        $(this).find("span:first-child").text("展开");
        $(".setup-list,.registered-capital-list,.seach-company-list,.top-search-list").hide();
    }else{
        $(this).removeClass('on');
        $(this).find("span:first-child").text("收起");
        $(".setup-list,.registered-capital-list,.seach-company-list,.top-search-list").show();
    }  
})

// 初始化数据

    
    // 获取基本数据
    function getCondition(){
        public_ajax({data:key_md5(),url:objUrl.juchacha_condition,fun:function(res){
            if (res.status==1000) {  
                var data = res.data;            
                var industryData = data.Industry;
                if(industryData.length > 0){
                    $('#industry_modal .get_industry').html(getIndustry());
                }
                
                function getIndustry(){
                    return  industryData.map(function(list,index){
                        return '<li class="industry_list industry_list'+index+'">'+
                                    '<span class="industry_tit industry_tit'+index+'" data-name="'+list.name+'">'+list.name+'</span>'+
                                    '<div class="industry_main industry">'+
                                        '<ul class="clearfix">'+getIndustrycheck(list.children,index,list.name)+'</ul>'+
                                    '</div>'+
                                '</li>'
                    }).join('');     
                }
                $(".industry_tit0").click();
                // 行业的下拉选择框
                $("#industry1").append(getSelect(industryData));
                $("#industry1").on("change",function(){
                    $("#industry2").find(".industry2_op").remove();
                    var data_id = $('#industry1 option:selected').attr("data-id");
                    var industry1Html = industryData[data_id].children.map(function(list,index){
                        return '<option value="'+list.name+'" data-id="'+list.id+'" data-parent="'+list.parent_id+'" class="industry2_op">'+list.name+'</option>';
                    }).join('');
                    $("#industry2").append(industry1Html);
                })
                data.StartDate.push({name:"自定义",value:""});
                data.RegistCapi.push({name:"自定义",value:""});
                loop($('.contacts-list'),data.Contacts,'Contacts'); 
                loop($('.shortStatus-list'),data.ShortStatus,'ShortStatus');                
                loop($('.registered-capital-list'),data.RegistCapi,'RegistCapi')
                loop($('.setup-list'),data.StartDate,'StartDate');
                // 企业类型
                $("#EconKind").append( getSelect(data.EconKind));
                // 招聘情况
                $("#OnlineMarket").append( getSelect1(data.OnlineMarket));
                $("#Recruitment").append( getSelect1(data.Recruitment));
                $("#Domain").append( getSelect1(data.Domain));
                $("#Brand").append( getSelect1(data.Brand));
                $("#Bid").append( getSelect1(data.Bid));
                $("#Tencent").append( getSelect1(data.Tencent));
                $("#Patent").append( getSelect1(data.Patent));
                $("#Foreign").append( getSelect1(data.Foreign));
                // $("#Enterprise").append( getSelect1(data.Enterprise));
                // 自定义选项
                $(".setup-list ul li:last-child").addClass('zdy');
                $(".registered-capital-list ul li:last-child").addClass('zdy');   
                if(data.Filter.length != 0){
                    data.Filter.map(function(m, n){
                        var html = '<a href="javascript:;" class="item" data-value='+m.value+'>'+m.name+'</a>';
                        $(".correlation").append(html);
                    }) 
                }                           
            }else{
                bagHintModalFn('warn',res.message);
            }                            
        }});
    }
$(".correlation").on("click","a",function(){
    var self = $(this);
    if(self.hasClass('active')){
        self.removeClass('active');
    }else{
        self.addClass('active').siblings().removeClass('active');
        Filter = $(this).attr("data-value");
    }
    relateQuery();
})
// 
$("body").click(function(e){
    $(".custom_box").remove();
    $("a[data-name=自定义]").parent().removeClass("on")     
    $(".phone-showbox").hide();
})
 
$(".setup-list,.registered-capital-list").on("click",'.zdy',function(e){                         
    e.stopPropagation();
    $(".custom_box").remove();
    if($(this).hasClass('on')){
        $(this).removeClass('on');        
    }else{  
        getCusBox(this);  
        $(this).addClass('on');
    }
})
$(".list-wrapper").on("click",".custom_box",function(e){
    e.stopPropagation();
})
$(".list-wrapper").on("click",".custom_box .submit_btn",function(){
    var parents = $(this).parents('.custom_box');
    var max = parents.find("#maxN").val();
    var min = parents.find("#minN").val();

    var re = /^[0-9]+(.[0-9]{0,3})?$/;
    if(!re.test(max) || !re.test(min)){
        alert("请输入数字");
        return;
    }
    if(Number(min) > Number(max)){
        alert("请输入正确的数值范围");
        return;
    }
    var dataval = min+'-'+max;
    $(this).parents("li").find("a").attr("data-value",dataval);
    $(this).parents(".custom_box").remove();
    $(this).parents(".list-wrapper").attr("data-tit") == "注册资本" ? RegistCapi = dataval : StartDate = dataval;
    relateQuery();
    
})
$(".list-wrapper").on("click",".custom_box .remove_btn",function(){
    $("#maxN").val('');
    $("#minN").val('');
    $(this).parents("li").find(".checkInput").val(" ");
})
// 获取自定义输入框
function getCusBox(obj){
     var cushtml = '<div class="custom_box clearfix">'+                   
                    '<div class="num_box"><input type="text" id="minN" placeholder="最小"/></div>'+
                     '<span>━</span>'+
                    '<div class="num_box"><input type="text" id="maxN" placeholder="最大"/></div>'+
                    '<div class="custom_btn">'+
                        '<span class="btn btn-default remove_btn">清空</span>'+
                        '<span class="btn btn-default submit_btn">确认</span>'+
                    '</div>'+
                 '</div>';
    $(obj).parent().append(cushtml);
}

var shortStatusArr = [],
    contactsArr = [],
    StartDateArr = [],
    RegistCapiArr = [],
    shaidataArr = [];


// 列表项先关查询
$('.sort-item').on('change', 'li input:checkbox', function() {
    if ($(this).is(':checked')) {
        $('.sort-item').find('input:checkbox').not($(this)).prop('checked',false)
        sort.key =$(this).attr("prop");
        sort.value = "desc";
    }else{
        sort.key =$(this).attr("prop");
        sort.value = "asc";
    }
    if(sessionStorage.getItem("back_key") != "goback"){
        relateQuery();
    } 
});
// 点击close删除筛选
$('.precise-query-wrap').on('click', '.del-selected-item', function() {
    var id = $(this).parent().attr("data-id");
    var len = $(this).closest('.item-inner').find('a').length,
        name = $(this).attr('name');
    $(this).parent().remove();
    var title = $(this).parent().attr("title");
    if(id < 4){
        var inputSelf = $("input[name='"+name+"']");
        var inputParentTxt = inputSelf.parents(".list-wrapper").attr("data-tit");
        inputSelf.parent().removeClass("on");
        inputSelf.prop("checked",false);
        if(len==1) $('.clear-selected').hide();
        inputSelf.parents(".list-wrapper").find(".buxian").prop("checked",true);
        delListItem(inputParentTxt);
    }
    if(id > 4){
        $("#"+title).find('option:first').prop("selected", 'selected');
        if(title == 'EconKind') EconKind = "";
        if(title == 'Recruitment') Recruitment = "";
        if(title == 'OnlineMarket') OnlineMarket = "";
        if(title == 'Domain') Domain = "";
        if(title == 'Brand') Brand = "";
        if(title == 'Patent') Patent = "";
        if(title == 'Tencent') Tencent = "";
        if(title == 'Bid') Bid = "";
        if(title == 'Foreign') Foreign = "";
        // if(title == 'Enterprise') Enterprise = "";
        if(title == "province" || title == "city" || title == "area") {
            radioCityArr.length = 0;
            $(".country-list select").find("option:first").prop("selected", 'selected');
        }
        if(title == "industry1" || title == "industry2") {
            radioindustryArr.length = 0;
            $(".industry-list select").find("option:first").prop("selected", 'selected');
        }
        $("#"+title).parents(".list-wrapper").find(".buxian").prop("checked",true);
    }
    relateQuery() 
});

// 选择不限
$(".list-wrapper .item-inner").find(".buxian").on("click",function(){
    var parent_tit = $(this).parents(".list-wrapper").attr("data-tit");
    var text = $(this).parents(".item-inner").find(".active-list li.on span").text();
    if ($(this).find("input").is(':checked')) {
        $(this).find("input").prop("checked",false);
        
    }else{
        if($(this).parents(".item-inner").find(".checkbutton").hasClass("on")){
            $("input[name="+text+"]").prop('checked',false);
            $("input[name="+text+"]").parent(".checkbutton").removeClass("on");
            $(".del-selected-item[name='"+text+"']").parent().remove();
        }
        if(parent_tit == "所在地区"){
            $("#province").find('option:first').prop("selected", 'selected');
            $("#city").find('option:first').prop("selected", 'selected');
            $("#area").find('option:first').prop("selected", 'selected');
            radioCityArr.length = 0;
            $(".additem15").remove();
            
        }
        if(parent_tit == "所属行业"){
            $("#industry1").find('option:first').prop("selected", 'selected');
            $("#industry2").find('option:first').prop("selected", 'selected');
            radioindustryArr.length =0;
            $(".additem16").remove();
            
        }
        $(this).find("input").prop("checked",true);
        delListItem(parent_tit);
        removeAllItemFunc(text);
        if(sessionStorage.getItem("back_key") != "goback"){
            relateQuery() 
        }    
    }
})

// 清空选择单选数据
function delListItem(str){
    switch(str){
        case '营业状态' :
            shortStatus = '';
            break;
        case '注册资本' :
            RegistCapi = "";
            break;
        case "联系方式" :
            contacts = '';
            break;
        case "成立年限" :
            StartDate = '';
            break;
    }
}

// 其他选择事件
otherChoiceFunc(".shortStatus-list",1);
otherChoiceFunc(".contacts-list",2);
otherChoiceFunc(".setup-list",3);
otherChoiceFunc(".registered-capital-list",4);
// 选择点击
function otherChoiceFunc(obj,val){
    $(obj).on("click",".checkbutton",function(){
        var parent = $(this).parents(obj);
        var _thisinput = $(this).find(".checkInput");
        var parentTit  = $(this).parents(obj).attr("data-tit");
        var selfval = _thisinput.val();
        var txt = _thisinput.attr("name");
        if ($(this).hasClass('on')) {
            $(this).removeClass("on")
            _thisinput.prop('checked',false)
            removeAllItemFunc(txt);
            delListItem(parentTit);
            parent.find(".checkAll .checkInput").prop("checked",true) ;
            $(".del-selected-item[name='"+txt+"']").parent().remove();
            // console.log(_thisinput.prop("checked"))
        }else{
            parent.find(".checkAll .checkInput").prop("checked",false);
            _thisinput.prop('checked',true)
            _thisinput.attr('checked',true)
            $(this).addClass("on").siblings().removeClass("on");
            // console.log(_thisinput.prop("checked"))
            switch (val) {
                case 1:
                    shortStatus = selfval;
                    newShaixuan.shortStatus = shortStatus;
                    addAllItemFunc(shortStatus,1)
                    break;
                case 2:
                    contacts = selfval;
                    newShaixuan.contacts = contacts;
                    addAllItemFunc(txt,2)
                    break;
                case 3:
                    StartDate = selfval;
                    newShaixuan.StartDate = StartDate;
                    addAllItemFunc(txt,3)
                    break;
                case 4:
                    RegistCapi = selfval;
                    newShaixuan.RegistCapi = RegistCapi;
                    addAllItemFunc(txt,4);
                    break;
            }
        }

        if(shaidataArr.length == 0){
           $(".clear-selected").hide();
        }else{
            $(".clear-selected").show();
        }
        if(sessionStorage.getItem('back_key') != 'goback'){
            relateQuery();           
        }
        
    })
}
// 高级
$(".top-search-list select").on("change",function(){
    var id = $(this).attr("id");
    var _thistext = $(this).find(".op0").text();
    var curval = $(this).find("option:selected").val();
    var curtext = $(this).find("option:selected").text();
    $(this).find(".op0").attr("disabled",true);
    switch (id){
        case 'EconKind' :
             EconKind = curval;
             addAllItemFunc(_thistext+":"+curtext,5,id);
             break;
        case 'Recruitment' :
             Recruitment = curval;
             newShaixuan.Recruitment = Recruitment;
             addAllItemFunc(_thistext+":"+curtext,6,id)
             break;
        case 'OnlineMarket' :
             OnlineMarket = curval;
             addAllItemFunc(_thistext+":"+curtext,7,id)
             break;
        case 'Domain' :
             Domain = curval;
             addAllItemFunc(_thistext+":"+curtext,8,id)
             break;
        case 'Brand' :
             Brand = curval;
             addAllItemFunc(_thistext+":"+curtext,9,id)
             break;
        case 'Patent' :
             Patent = curval;
             addAllItemFunc(_thistext+":"+curtext,10,id)
             break;
        case 'Tencent' :
             Tencent = curval;
             addAllItemFunc(_thistext+":"+curtext,11,id)
             break;
        case 'Bid' :
             Bid = curval;
             addAllItemFunc(_thistext+":"+curtext,12,id)
             break;
        case 'Foreign' :
             Foreign = curval;
             addAllItemFunc(_thistext+":"+curtext,13,id)
             break;
        // case 'Enterprise' :
        //      Enterprise = curval;
        //      addAllItemFunc(_thistext+":"+curtext,14,id)
        //      break;
    }
    relateQuery()
})
function addItem(txt,index,key){
    var item = '<a class="additem'+index+'" data-id="'+index+'" title="'+key+'"><span>'+txt+'</span><span class="del-selected-item" name="'+txt+'">&times;</span></a>';
    return item;
}
function addAllItemFunc(name,n,id){
    // if()
    var item =  addItem(name,n,id);
    $('.selected-wrap').find(".additem"+n).remove();
    $('.selected-wrap').append(item);
}
function removeAllItemFunc(name){
    $('.selected-wrap a[title="'+name+'"]').remove();
}

function loop(target,data,name){
    var html = "";              
    for (var i in data) {
        html+=  '<li class="checkedli checkbutton">'+
                    '<input type="checkbox" data-level="1" class="checkInput" value="'+data[i].value+'" name="'+data[i].name+'">'+
                    '<i></i>'+
                    '<span>'+data[i].name+'</span>'+
                '</li>'
    }
    var wrap = $('<ul class="active-list fl clearfix"></ul>').append(html)
    target.find('.item-inner').append(wrap);
}



// 更多与收起
$('.list-wrapper').on('click', '.expend-all', function() {
    $(this).text()=='多选'? $(this).text('收起').prev().find('.item-inner').addClass('expend') : 
                            $(this).text('多选').prev().find('.item-inner').removeClass('expend');
});
    // 自定义时间
    // $('.date-select').datePicker({
//           format: 'YYYY',
//           show:function(){
//           	var that = this.$input;
//           		h = $('.content-wrapper').width(),
//                   dateH = $('.c-datepicker-picker').not(':hidden').innerWidth(),
//                   loc = h - that.offset().left,
//                   span = that.offset().left - (dateH-that.width())
//               if (loc<=dateH) $('.c-datepicker-picker').not(':hidden').css('left',span);
//           },
//           hide:function(){
//           	var val = this.$input.val();
//           	if (val!='') {
//           		if ($('.selected-wrap').find('a[class="StartDate"]').length<=0) {
//           			$('.selected-wrap').append(addItem(val,'StartDate'))
//           		}else{
//           			$('.selected-wrap').find('a[class="StartDate"]').remove();
//           			$('.item-inner').find('input:radio[name="StartDate"]:checked').prop('checked',false)
//           			$('.selected-wrap').append(addItem(val,'StartDate'))
//           		}
//           	}
//           }
//       });
// })
// search 搜索接口
function relateQuery(pages){
    var loading = $('<div class="loading_bgimg_animation"><span></span></div>');
    $(".loadingBox").show();
    var obj = {'from': 1};
    $('.search-result-container').html(loading);
    if(getQueryString("Name") != null){
       searchNameCn = getQueryString("Name");      
       if($("#searchInput").val().length>0){  
            searchNameCn = $("#searchInput").val();
       }
    }else{
        searchNameCn = "";
    }

    if(cityArr.length == 0 && radioCityArr.length == 0){
        if(obj.region != undefined)  delete obj.region;
    }
    if(industryArr.length == 0 && radioindustryArr.length == 0){
        if(obj.industry != undefined) delete obj.industry;
    }
    if(shortStatus.length == 0){
        if(obj.ShortStatus != undefined) delete obj.ShortStatus;
    }
    if(contacts.length == 0){
        if(obj.Contacts != undefined) delete obj.Contacts;
    }
    // 成立年限没选
    if(StartDate.length == 0){
        if(obj.StartDate != undefined) delete obj.StartDate;
    }
    // 注册资本没选
    if(RegistCapi.length == 0){
        if(obj.RegistCapi != undefined) delete obj.RegistCapi;
    }
    // 企业类型，没选
    if(EconKind.length == 0){
        if(obj.EconKind != undefined) delete obj.EconKind;
    }
    if(searchNameCn.length > 0){
         if(obj.nameCn != undefined) delete obj.nameCn;
    }
    if(Recruitment.length == 0){
        if(obj.Recruitment != undefined) delete obj.Recruitment;
    }
    if(OnlineMarket.length > 0){
         if(obj.OnlineMarket != undefined) delete obj.OnlineMarket;
    }
    if(Domain.length == 0){
        if(obj.Domain != undefined) delete obj.Domain;
    }
    if(Brand.length > 0){
         if(obj.Brand != undefined) delete obj.Brand;
    }
    if(Patent.length == 0){
        if(obj.Patent != undefined) delete obj.Patent;
    }
    if(Bid.length > 0){
         if(obj.Bid != undefined) delete obj.Bid;
    }
    if(Tencent.length == 0){
        if(obj.Tencent != undefined) delete obj.Tencent;
    }
    if(Filter.length == 0){
        if(obj.Filter != undefined) delete obj.Filter;
    }
    if(pageListSize.length == 0){
        if(obj.size != undefined) delete obj.size;
    }
    // 省份多选
    if(cityArr.length >0 ) obj.region = cityArr;
    // 行业多选
    if(industryArr.length > 0) obj.industry = industryArr;
    // 行业单选
    if(radioindustryArr.length > 0) obj.industry = radioindustryArr;     
    // // 省份单选
    if(radioCityArr.length>0) obj.region = radioCityArr;
    // 营业状态
    if(shortStatus.length>0) obj.ShortStatus = shortStatus;
    // 联系方式
    if(contacts.length>0) obj.Contacts = contacts;
    // 成立年限
    if(StartDate.length>0) obj.StartDate = StartDate;
    // 注册资本
    if(RegistCapi.length>0) obj.RegistCapi = RegistCapi;
    // 企业类型
    if(EconKind.length>0) obj.EconKind = EconKind;
    if(Recruitment.length>0) obj.Recruitment = Recruitment;
    if(OnlineMarket.length>0) obj.OnlineMarket = OnlineMarket;
    if(Domain.length>0) obj.Domain = Domain;
    if(Brand.length>0) obj.Brand = Brand;
    if(Patent.length>0) obj.Patent = Patent;
    if(Bid.length>0) obj.Bid = Bid;
    if(Tencent.length>0) obj.Tencent = Tencent;
    if(searchNameCn.length > 0) obj.nameCn = searchNameCn;
    if(Foreign.length>0) obj.Foreign = Foreign;
    if(Filter.length >0) obj.Filter = Filter;
    if(pageListSize.length > 0) obj.size = pageListSize;
    // if(Enterprise.length > 0) obj.Enterprise = Enterprise;
    if(pages != undefined) obj.from = pages;

    if(getQueryString("source") == "central"){
         obj.source = "central"
         obj.admin_id = getQueryString("token");
         sessionStorage.setItem('token_key',obj.admin_id)
        //  console.log(sessionStorage.getItem("token_key"))
    }
    obj.sort = sort;
    if(sessionStorage.getItem("back_key") == "goback"){
        lastrelatedata = sessionStorage.getItem("search-data");   
        relatedata1 = {"fields":lastrelatedata};
        setTimeout(function(){
            chushihuaData();
            
        }, 500)        
        sessionStorage.setItem("search-data", lastrelatedata);
        setTimeout(function(){
            sessionStorage.removeItem('back_key');
        }, 1000)
    }else{
        sessionStorage.removeItem('search-data');
        relatedata1 = {"fields":JSON.stringify(obj)};
        sessionStorage.setItem("search-data", JSON.stringify(obj));
    }
    // console.log(relatedata1);
    public_ajax({data:key_md5(relatedata1),url:objUrl.juchacha_search,type:"POST",fun:function(res){
            if (res.status=1000) {
                loading.remove();
                $(".loadingBox").hide();
                $(".search-item-wrapper").show();
                $(".pageListBox").show();
                var data = res.data;
                var temp = template('lists',{data:data});
                $('.search-result-container').html(temp);
                $("#pageList li:last-child").addClass(".total-num");
                var allpage = Math.ceil(res.page);
                $('.total-num').text(allpage);
                $('.company-num').text(res.total);                
                $('.current').text(res.from);
                pageList.init(res.from,res.total,data.length,function(num){
                    relateQuery(num)
                })
                pageNate({
                    total:allpage*10,
                    pageSize:10,
                    pageNumber:res.from,
                    name:$('#pageList'),
                    callback:function(pageNumber,pageSize){
                        relateQuery(pageNumber)
                    }
                })
                setTimeout(function(){
                    sessionStorage.removeItem("issearch");
                },1000)
            }else{
                loading.remove();
                bagHintModalFn('warn',res.message);
            }
        },err:function(err){
            loading.remove();
    }})
}

// 分页
var pageList = {
    prev:$('.paginate .prev'),
    next:$('.paginate .next'),
    pages:1,
    total:0,
    len:0,
    init:function(pages,total,len,callback){
        this.pages = pages
        this.total = Math.ceil(total/10);
        this.len = len
        if (total<10) {
            this.prev.addClass('disabled')
            this.next.addClass('disabled')
        }else{
            this.prev.removeClass('disabled')
            this.next.removeClass('disabled')
        }
        if (Math.ceil(total/10)==pages) this.next.addClass('disabled')
        if (pages==1) {this.prev.addClass('disabled')}
        if (callback) {
            this.prevBtn(callback)
            this.nextBtn(callback)
        }
    },
    prevBtn:function(callback){
        this.prev[0].onclick = function(){
            if (this.pages>0 && this.pages !=1) {
                this.pages -=1;
                callback(this.pages)
            }
        }.bind(this)
    },
    nextBtn:function(callback){
        this.next[0].onclick = function(){
            if (this.pages>0) {
                this.pages +=1;
                callback(this.pages)
            }
        }.bind(this)
    }
}
function chushihuaData(){
    var obj = JSON.parse(lastrelatedata);
    // searchNameCn = $("#searchInput").val();
    // console.log(obj)
    // console.log(obj.nameCn)
    if(obj.nameCn != null ){
        $("#searchInput").val(obj.nameCn)
        searchNameCn = obj.nameCn;
    }
    if(obj.Contacts != null ){
        $("input[value='"+obj.Contacts+"']").parents(".checkbutton").click();
        contacts = obj.Contacts;
    }
    if(obj.RegistCapi != null){
        $("input[value='"+obj.RegistCapi+"']").parents(".checkbutton").click();
        RegistCapi = obj.RegistCapi;
    }
    if(obj.ShortStatus != null ){
        $("input[value='"+obj.ShortStatus+"']").parents(".checkbutton").click();
        shortStatus = obj.ShortStatus;
    }
    if(obj.StartDate != null){
        $("input[value='"+obj.StartDate+"']").parents(".checkbutton").click();
        StartDate = obj.StartDate;
    }
    
    if(obj.EconKind != null){
        addAllItemFunc("企业类型:"+obj.EconKind,5,"EconKind");
        $("#EconKind option[value='"+obj.EconKind+"']").attr("selected","selected");
        EconKind = obj.EconKind;
    }
    if(obj.Recruitment != null){
        topSearchData(obj.Recruitment,6,"招聘情况","Recruitment");
        Recruitment = obj.Recruitment;
    }
    if(obj.OnlineMarket != null){
        topSearchData(obj.OnlineMarket,7,"网络推广","OnlineMarket");
        OnlineMarket = obj.OnlineMarket;
    }
    if(obj.Domain != null){
        topSearchData(obj.Domain,8,"网络域名","Domain");
        Domain = obj.Domain;
    }
    if(obj.Brand != null){
        topSearchData(obj.Brand,7,"商标","Brand");
        Brand = obj.Brand
    }
    if(obj.Patent != null){
        topSearchData(obj.Patent,7,"专利","Patent");
        Patent = obj.Patent;
    }
    if(obj.Bid != null){
        topSearchData(obj.Bid,7,"招投标","Bid");
        Bid = obj.Bid;
    }
    if(obj.Tencent != null){
        topSearchData(obj.Tencent,12,"公众号","Tencent");
        Tencent = obj.Tencent;
    }
    if(obj.Foreign != null){
        var text = $("#Foreign option[value='"+obj.Foreign+"']").text();
        addAllItemFunc("外贸网站:"+text,13,"Foreign");
        $("#Foreign option[value='"+obj.Foreign+"']").attr("selected","selected");
        Foreign = obj.Foreign;
    }
    if(obj.Filter != null){
        $(".correlation").find("a[data-value='"+obj.Filter+"']").addClass('active');
        Filter = obj.Filter;
    }

    if(obj.sort.key == 'RegistCapi'){
        if(obj.sort.value == 'asc'){
            $(".sort-item").find("input[prop='RegistCapi']").prop("checked",false)
        }else{
            $(".sort-item").find("input[prop='RegistCapi']").prop("checked",true)
            $(".sort-item").find("input[prop='StartDate']").prop("checked",false)     
        }  
        sort = obj.sort;     
    }
    if(obj.sort.key == 'StartDate'){
        if(obj.sort.value == 'asc'){
            $(".sort-item").find("input[prop='StartDate']").prop("checked",false) 
            $(".sort-item").find("input[prop='RegistCapi']").prop("checked",false)       
        }else{
            $(".sort-item").find("input[prop='StartDate']").click();
            $(".sort-item").find("input[prop='RegistCapi']").prop("checked",false)  
        }
        sort = obj.sort;
    }

    // 省市区单多选判断
    if(obj.region != null){
        if(obj.region.length == 1){
            var region = obj.region[0];
            var start = region.indexOf("-");
            var end = region.lastIndexOf("-");
            var provincestr = region.substr(0,start);
            var citystr ,areastr;
            $(".country-list").find(".buxian").click();
            if(start == -1){
                provincestr = region.substr(0);
                addAllItemFunc(provincestr,15,'province');
                setTimeout(function(){
                     $("#province option[value='"+provincestr+"']").attr("selected","selected");
                     $("#province").change();
                 },100)
                // return false;
            }else if(end == start){
                citystr = region.substr(start+1);
                addAllItemFunc(provincestr+'-'+citystr,15,'city');
                setTimeout(function(){
                     $("#province option[value='"+provincestr+"']").attr("selected","selected");
                     $("#province").change();
                     $("#city option[value='"+citystr+"']").attr("selected","selected");
                     $("#city").change();
                 },100)
            }else{
                areastr = region.substr(end+1); 
                citystr = region.substr(start+1,(end - start)-1);
                if(areastr == '全部'){
                    addAllItemFunc(provincestr+'-'+citystr,15,'area');
                }else{
                    addAllItemFunc(provincestr+'-'+citystr+'-'+areastr,15,'area');
                }           
                setTimeout(function(){
                     $("#province option[value='"+provincestr+"']").attr("selected","selected");
                     $("#province").change();
                     $("#city option[value='"+citystr+"']").attr("selected","selected");
                     $("#city").change();
                     $("#area option[value='"+areastr+"']").attr("selected","selected");
                 },100)
            }
            radioCityArr = obj.region;
        }else{
            var start,end,provincestr,citystr;
            var areaData = [];
            var cityData = [];
            for(var i = 0;i<obj.region.length;i++){
                start = obj.region[i].indexOf("-");
                end = obj.region[i].lastIndexOf("-");   
                provincestr = obj.region[i].substr(0,start);      
                citystr = obj.region[i].substr(start+1,(end - start)-1);
                areastr = obj.region[i].substr(end+1);
                if(cityData.indexOf(citystr) == -1){
                    cityData.push(citystr)
                }        
                areaData.push({
                    c:citystr,
                    area:areastr
                });                
            }
            cityData.map(function(m,n){
                setTimeout(function(){                   
                    $(".check[data-name='"+m+"']").click();                   
                    for(var j = 0;j<areaData.length;j++){                  
                        if(areaData[j].c == m){
                            $(".check input[value='"+areaData[j].area+"']").click()
                        }
                    }
                },100)    
            })
            cityArr = obj.region;
        }

    }
    // 行业单多选判断
    if(obj.industry != null){
        if(obj.industry.length == 1){
            var industry = obj.industry[0];
            var start1 = industry.indexOf("-");
            var industrystr1,industrystr2;
            $(".industry-list").find(".buxian").click();
            if(start1 == -1){
                industrystr1 = industry.substr(0);
                addAllItemFunc(industrystr1,16,'industry1');
                setTimeout(function(){
                    $("#industry1 option[value='"+industrystr1+"']").attr("selected","selected");   
                    $("#industry1").change();       
                 },100)
            }else{
                industrystr2 = industry.substr(start1+1);
                industrystr1 = industry.substr(0,start1);
                addAllItemFunc(industrystr1+'-'+industrystr2,16,'industry2');
                setTimeout(function(){
                     $("#industry1 option[value='"+industrystr1+"']").attr("selected","selected");  
                     $("#industry1").change();        
                     $("#industry2 option[value='"+industrystr2+"']").attr("selected","selected");  
                 },100)
            }
            radioindustryArr = obj.industry
        }else{
            var start;       
            var industry2Data = [];
            var industry1Data = [];
            for(var i = 0;i<obj.industry.length;i++){
                start = obj.industry[i].indexOf("-");
                var industrystr2 = obj.industry[i].substr(start+1);
                var industrystr1 = obj.industry[i].substr(0,start);
                industry2Data.push({name:industrystr1+'-'+industrystr2,value:industrystr1})
                if(industry1Data.indexOf(industrystr1) == -1){
                    industry1Data.push(industrystr1);   
                }                
            }
            industry1Data.map(function(m,n){
                setTimeout(function(){                   
                    $(".industry_tit[data-name='"+m+"']").click();                   
                    for(var j = 0;j<industry2Data.length;j++){                  
                        if(industry2Data[j].value == m){
                            $(".check input[name='"+industry2Data[j].name+"']").click()
                        }
                    }
                },100)    
            })
            industryArr = obj.industry;
        }
    }
}

function topSearchData(obj,num,txt,idTxt){
    var value = (obj == 'yes') ? '有' : '无';
    addAllItemFunc(txt+":"+value,num,idTxt);
    $("#"+idTxt).find("option[value='"+obj+"']").attr("selected","selected");
}

// 省市区的下拉选择框
function getSelect(selectArr){
    return selectArr.map(function(list,index){
        return '<option value="'+list.name+'" data-id="'+index+'" class="province_op">'+list.name+'</option>';
    }).join('');
}
// getSelect1 所有单选
function getSelect1(selectArr){
    return selectArr.map(function(list,index){
        return '<option value="'+list.value+'"  class="province_op">'+list.name+'</option>';
    }).join('');
}


$("#province").on("change",function(){
        var id = $(this).attr("id");
        $("#city").find(".city_op").remove();
        $("#area").find(".area_op").remove();
        $(this).parents(".list-wrapper").find(".buxian").prop("checked",false);
        var data_id = $('#province option:selected').attr("data-id");
        city_arr[data_id].city.splice(0, 1);
        var cityHtml = city_arr[data_id].city.map(function(list,index){
            return '<option value="'+list.name+'" data-id="'+index+'" class="city_op">'+list.name+'</option>';
        }).join('');
        $("#city").append(cityHtml);
        var radioval = $('#province option:selected').val();
        if($('#province option:selected').index() == 0){
            radioval.length = 0;
        }else{
            changeSelectRadio(radioval,15,id,'city')
        }

    
})
$("#city").on("change",function(){
    var id = $(this).attr("id");
    $("#area").find(".area_op").remove();
    var city_data_id = $('#province option:selected').attr("data-id");
    var radioval = $('#province option:selected').val()+'-'+$('#city option:selected').val();
    if($('#city option:selected').index() == 0){
        radioval = $('#province option:selected').val();
    }else{
        var area_data_id = $('#city option:selected').attr("data-id");
        var areaHtml = city_arr[city_data_id].city[area_data_id].area.map(function(list,index){
            return '<option value="'+list+'" data-id="'+index+'" class="area_op">'+list+'</option>';
        }).join('');
        $("#area").append(areaHtml);
    }
    changeSelectRadio(radioval,15,id,'city')
    
})
// 单选刷新
$("#area").on("change",function(){
    var id = $(this).attr("id");
    var radioval = $('#province option:selected').val()+'-'+$('#city option:selected').val()+'-'+$('#area option:selected').val();
    if($('#area option:selected').index() == 0){
        radioval = $('#province option:selected').val()+'-'+$('#city option:selected').val();
    }
    changeSelectRadio(radioval,15,id,'city')
})
// 判断是否返回调用
function changeSelectRadio(val,num,id,idTxt){
    console.log("s")
    if(sessionStorage.getItem("back_key") == null){
        if(idTxt == 'city'){
            radioCityGetFunc(val);
        }else{
            radioIndustryGetFunc(val)
        }        
        addAllItemFunc(val,num,id);
    }
}

function radioCityGetFunc(val){
    radioCityArr[0] = val;
    relateQuery();
}
function radioIndustryGetFunc(val){
    radioindustryArr[0] = val;
    relateQuery();
}

$("#industry1").on("change",function(){
    $(this).parents(".list-wrapper").find(".buxian").prop("checked",false);
    var radioindustry = $('#industry1 option:selected').val();
    var id = $(this).attr("id");
    if($('#industry1 option:selected').index() == 0){
        radioindustryArr.length = 0;
        removeAllItemFunc(radioindustry)
    }else{
        changeSelectRadio(radioindustry,16,id,"industry")        
    }
   
})
$("#industry2").on("change",function(){
    var id = $(this).attr("id");
    var radioindustry = $('#industry1 option:selected').val()+'-'+$('#industry2 option:selected').val();
    if($('#industry2 option:selected').index() == 0){
      radioindustry = $('#industry1 option:selected').val();
    }
    changeSelectRadio(radioindustry,16,id,"industry")
})

// 中控
document.getElementById("searchInput").onkeydown = function(){
    var e = event || window.event || arguments.callee.caller.arguments[0];
   if (e && e.keyCode == 13) {
       $(".search-button").click();
   }
    
}

$(".search-button").on("click",function(){
    // sessionStorage.setItem("issearch", "search");
    var curInputVal = $(this).siblings('input').val();
    searchNameCn = curInputVal;
    var url =  window.location.href;
    var search = window.location.search;
    var cur_url;
    var stateObject = {};
    var title = "修改地址";
    if(getQueryString("Name") == null){
        if(getQueryString("source") == "central"){
            cur_url = curInputVal.length > 0 ? url+'&Name='+curInputVal : url;
        }else{
            cur_url = url+'?Name='+curInputVal
        }
    }else{
        if(getQueryString("source") == "central"){
            cur_url = url.substr(0,url.indexOf("?"))+'?Name='+curInputVal +'&source=central'+'&token='+sessionStorage.getItem("token_key")
        }else{
            cur_url = url.substr(0,url.indexOf("?"))+'?Name='+curInputVal;
        }
    }
    history.pushState(stateObject, title, cur_url);
    relateQuery();
})
function loadPageVar (sVar) {
  return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}



$(".search-result-container").on("click",".phone-record",function(e){
    e.stopPropagation();
    $(".phone-showbox").hide();
    $(this).find(".phone-showbox").show();
})

$(".search-result-container").on("click",".portect_icon",function(){
    var self = $(this);
    var pId = self.attr("data-id");
    if(self.hasClass('cur')){
        bagHintModalFn('success','该用户已经添加过，无需再添加。');
    }else{
        var datas = {
            ParentID:pId,
            admin_id:sessionStorage.getItem("token_key")
        }
        public_ajax({data:key_md5(datas),url:objUrl.juchacha_protect,fun:function(res){
            if(res.status == 1000){
                bagHintModalFn('success',res.message);
                self.addClass('cur');
                self.text("已保护");
                self.removeClass('glyphicon-plus');
                self.removeClass('glyphicon');
            }else{
                bagHintModalFn('warn',res.message);
            }
        }})
    } 
})

$("#pageListSize").change(function(){
   pageListSize =  $(this).find('option:selected').val();
   relateQuery();
})
    
// }



