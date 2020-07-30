
function getpinyin(){
    var pinyinArr = [];
    for(var i = 0; i<city_arr.length;i++){
        if(pinyinArr.indexOf(city_arr[i].pinyin) < 0 ) pinyinArr.push(city_arr[i].pinyin) ;
    }
    pinyinArr.map(function(m,n){
        $(".pinyin").append('<a href="#'+m+'">'+m+'</a>');
    })

    $(".pinyin a,.cityquery").on("click",function(){
        $(this).addClass("on").siblings().removeClass("on");
    })
    $(".city_search_btn").on("click",function(){
        var value = $(this).siblings("input").val();
        $(this).attr("href","#"+value);
    })    
}
// city数据
function getCity(){
    $('#province').append(getSelect(city_arr));
    function getcheck(arr,n,pname){
        var arr2 = arr;
        if(arr2[0].name != "全部") arr2.unshift({name:'全部'});
        return arr2.map(function(list,index){
            var name = list.name ? list.name:list;
            return '<li>'+
                        '<a href="javascript:;" class="check" all-name="'+pname+"-"+name+'" data-name="'+name+'" data-id="'+index+'" data-n="'+n+'"><span class="checkSpan">'+name+'</span></a>'+
                    '</li>'
        }).join('')
    }
    function getAreacheck(arr,cityname,pname){
        var arr1 = arr;
        if(arr1[0].name != "全部") arr1.unshift({name:'全部'});
        return arr1.map(function(list,index){
            var name = list.name ? list.name:list;
            return '<li class="areali">'+
                        '<label class="check"><input type="checkbox" name="'+pname+'-'+cityname+'-'+name+'" value="'+name+'" data-id="'+index+'" ><span class="checkSpan">'+name+'</span></label>'+
                    '</li>'
        }).join('')
    }
    function getlist(){
        return  city_arr.map(function(list,index){
            return '<li class="city_list city_list'+index+'" id='+list.name+'>'+
                        '<div class="city_title" id='+list.pinyin+'>'+list.pinyin+'</div>'+
                        '<div class="city_main">'+
                            '<span class="city_name" data-name="'+index+'">'+list.name+':</span>'+
                            '<div class="city_main city">'+
                                '<ul class="clearfix">'+getcheck(list.city,index,list.name)+'</ul>'+
                            '</div>'+
                            '<div class="city_main area">'+
                                '<ul class="clearfix"></ul>'+
                            '</div>'+
                        '</div>'+
                    '</li>'
        }).join('');     
    }
    getpinyin();
    var checkedAreaArr = [];
    $('#city_modal .getcity').html( getlist() );
    var checkedcityArr = [];
    $(".check[data-name=全部]").parent().addClass("quanbu");
    $(".city .check").on("click",function(){
        var $checkbox = $(this).parent();
        var cur = $(this).attr("data-id");
        var cur_box =  $(this).attr("data-n");
        var cur_city_id =  $(this).parents(".city_main").siblings('.city_name').attr("data-name");
        var areaData = city_arr[cur_city_id].city[cur].area;
        var cur_name  = $(this).attr("data-name");
        $(".city_list").find(".area ul").html("");
        $(".city li").removeClass("on");
        if(!$checkbox.hasClass("on")){
            // checkedcityArr.splice($.inArray(cur_name,checkedcityArr),1)
            if(cur_name == '全部'){                
                $checkbox.addClass("on").siblings().removeClass("on");
                var $parent = $(this).parents(".city_list");
                var newcityArr = []
                var c = $(this).attr("all-name").substr(0,2);
                // console.log(c)
                cityArr.map(function(m,n){
                    if(m.substr(0,2) != c){
                        newcityArr.push(m);
                    }
                })
                // console.log(checkedcityArr);
                for(var i = 0;i<city_arr[cur_box].city.length;i++){
                    var  c_value = city_arr[cur_box].city[i].name;
                    checkedcityArr.map(function(m,n){
                        if(m === c_value){
                            checkedcityArr.splice($.inArray(c_value,checkedcityArr),1);
                        }
                    })    
                }           
                cityArr = newcityArr;
                cityArr.push($(this).attr("all-name"));
            }else{
                $(".city_list"+cur_box).find(".area ul").html(getAreacheck(areaData,cur_name,city_arr[cur_box].name));
                $("input[value=全部]").parent().addClass("quanbu");
                cityArr.map(function(a,b){
                    $("input[name="+a+"]").attr("checked",true);
                })
                $checkbox.addClass("on");
                // 切换时记录已选择城市
                
            }
            checkedcityArr.map(function(a,b){
                var ed = document.querySelector(".check[data-name='"+a+"']");
                $(ed).parent().addClass("on")
            })
            
        }
        $(".area :checkbox").on("click",function(){ 
            var area_name = $(this).val();
            var p_name = city_arr[cur_city_id].name;
            var city_name = city_arr[cur_city_id].city[cur].name;
            var all_name = p_name+'-'+city_name+'-'+area_name;
            //根据checked == true
            // console.log($(this).val())
            if($(this).val() == "全部"){
                if($(this).attr("checked")){
                    $(this).attr("checked",false);
                    $(this).prop("checked",false);
                }else{
                    $(this).parents(".area").find(".areali input").prop("checked",false);
                    $(this).parents(".area").find(".areali input").attr("checked",false);
                    $(this).prop("checked",true);
                    cityArr.length = 0;
                    cityArr.push($(this).attr("name"))
                    for(var i = 0;i<$('.areali').length;i++){
                        if(!$('.areali').find("input").attr("checked") || !$('.areali').find("input").prop("checked")){
                            // cityArr.splice($.inArray($('.areali').eq(i).find("input").attr("name"),cityArr),1);
                            $(".checked-list[data-id='"+$('.areali').eq(i).find("input").attr("name")+"']").remove();
                        }
                    }
                    $("#city_modal .checkedBoxlist").append('<div class="checked-list fl" data-id="'+p_name+"-"+city_name+'-'+area_name+'" data-name="'+area_name+'"><span>'+all_name+'</span><span class="checked-close">×</span></div>');
                    // console.log(cityArr)
                }
            }else{
                if($(this).attr("checked")){
                    $(this).attr("checked",false);  
                    // console.log("0")
                    cityArr.splice($.inArray($(this).attr("name"),cityArr),1)
                    $(".checked-list[data-id='"+p_name+"-"+city_name+'-'+area_name+"']").remove();
                }else{
                    // console.log("1")
                    $(this).attr("checked",true);
                    cityArr.push($(this).attr("name"))
                    $("#city_modal .checkedBoxlist").append('<div class="checked-list fl" data-id="'+p_name+"-"+city_name+'-'+area_name+'" data-name="'+area_name+'"><span>'+all_name+'</span><span class="checked-close">×</span></div>');
                }
                
            }
            // console.log(cityArr)  
            // if($(this).attr("checked")){
            //     $(this).attr("checked",false);
                
            //     if($(this).val() == "全部"){
            //         $(this).parents(".area").find(".areali input").prop("checked",false);
            //         cityArr = $(this).attr("name");
            //         console.log(cityArr)
            //         // for(var i = 0;i<$('.areali').length;i++){
            //         //     if(!$('.areali').find("input").attr("checked")){
            //         //         console.log(i)
            //         //         cityArr.splice($.inArray($('.areali').eq(i).find("input").attr("name"),cityArr),1);
            //         //         $(".checked-list[data-id='"+$('.areali').eq(i).find("input").attr("name")+"']").remove();
            //         //         console.log(cityArr);
            //         //     }
            //         // }
            //         // $(this).prop("checked",true);
            //     }else{
            //         cityArr.splice($.inArray($(this).attr("name"),cityArr),1)
            //         console.log(cityArr);
            //         $(".checked-list[data-id='"+p_name+"-"+city_name+'-'+area_name+"']").remove();
            //     }
            // }

            
            // $(this).attr("checked",true);
            // cityArr.push($(this).attr("name"));      
            
            
            if(checkedcityArr.indexOf(cur_name) < 0){
                checkedcityArr.push(cur_name);
            }
            re_repeat(checkedAreaArr,area_name);
        })
        cityArr.map(function(m,n){
            var checkedArea = document.querySelector(".check input[value='"+m+"']");
            $(checkedArea).attr("checked",true);
            
            
        })
         // 切换时记录已选择区域
        checkedAreaArr.map(function(m,n){
            var checkedArea = document.querySelector(".check input[value='"+m+"']");
            $(checkedArea).attr("checked",true);
        })
    });
    // 删除筛选
    $(".checkedBox").on("click",'.checked-close',function(){
        var selfval = $(this).siblings().text();
        var id = $(this).parent().attr("data-id");
        var name = $(this).parent().attr("data-name");
        if($(this).parents('.checkedBox').attr("data-name") == '国家'){
            re_repeat(cityArr,selfval);
            $('input[name="'+id+'"]').prop('checked',false);
            re_repeat(checkedAreaArr,name); 
            // 切换时记录
            var checkedArea = document.querySelector(".check input[name='"+id+"']");
            $(checkedArea).attr("checked",false)
        }else{
            
            re_repeat(industryArr,selfval);
            $('input[name="'+id+'"]').prop('checked',false);
        }
        $(this).parent().remove();
    })
}

// 选择行业新数组
$(".get_industry").on("click",".industry_tit",function(e){
    e.preventDefault()
    var self = $(this);
    $(".industry_tit").removeClass('on');
    self.addClass('on');
    $(".industry_main").hide();
    self.siblings(".industry_main").show();  
})

$(".get_industry").on("click","input",function(){
    var data_name_li = $(this).attr("name");
    if(industryArr.indexOf(data_name_li) < 0){
        $("#industry_modal .checkedBoxlist").append('<div class="checked-list fl" data-id="'+data_name_li+'" ><span>'+data_name_li+'</span><span class="checked-close">×</span></div>');
    }else{
        var d = document.querySelector(".checked-list[data-id='"+data_name_li+"']");
        $(d).remove();
    }
    re_repeat(industryArr,data_name_li);
})


function getIndustrycheck (arr,index,cityname){
    var arr1 = arr;
    arr1.unshift({name:'全部'});
    return arr1.map(function(list,index){
        var name = list.name ? list.name:list;
        return '<li class="col-md-6 industryLi" data-id="'+index+'">'+
                    '<lable class="check">'+
                        '<input type="checkbox" name="'+cityname+'-'+name+'" data-id="'+list.id+'" data-parent="'+list.parent_id+'"><span class="checkSpan">'+name+'</span></input>'+
                    '</lable>'+
                '</li>'
    }).join('')
}

// 省份城市多选提交
$(".cityBtn").on("click",function(){
    if(cityArr.length == 0){
        $(".city_list .checkSpan ").removeClass('on')
    }
    radioCityArr.length = 0;
    $("#province").find(".option1").prop("selected", 'selected');
    $("#city").find(".city_op").remove();
    $("#area").find(".area_op").remove();
    relateQuery();
    $(".country-list .expend-all").click();
})

$(".industryBtn").on("click",function(){
    radioindustryArr.length = 0;
    $("#industry1").find(".option1").prop("selected", 'selected');
    $("#industry2").find(".industry2_op").remove();
    relateQuery();
    $(".industry-list .expend-all").click();
})

$("#city_modal .dismissBtn,#city_modal .dialog_eas").on("click",function(){
    $(".country-list .expend-all").click();
})
$("#industry_modal .dismissBtn,#industry_modal .dialog_eas").on("click",function(){
    $(".industry-list .expend-all").click();
})

setTimeout(function(){
    getCity();
}, 500)
