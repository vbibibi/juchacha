var tabList = document.querySelectorAll('#top-tab li');
// var relateItem = document.querySelectorAll('.correlation .relate-item .item');
// tabSwitch(relateItem)
tabSwitch(tabList)
function tabSwitch(lists){
	for (var i = 0,len = lists.length; i < len; i++) {
		lists[i].index = i;
		lists[i].onclick = function(){
			for (var i = 0; i < lists.length; i++) {
				lists[i].classList.remove("active");
			}
			this.classList.add("active");
		}
	}
}
// url参数查询
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null){
        return unescape(r[2]); 
    }
    return null; 
}

// 获取加密
function key_md5(obj){
    var n = 'jQuery'+Math.floor(Math.random()*1000000);
    var temp = Date.parse(new Date()).toString();
            tmp = temp.substr(0, 10);//取10位时间戳
            var base64_ = window.btoa(secret_key.appId_base64);//base64编码
            var str = md5(base64_).toUpperCase();//md5加密并且转大写
            var objs = {
                "timestamp": temp,
                "appId": secret_key.appId,
                "appKey": str,
                "function_name":n
            };
            var obj1 = $.extend(true,{},objs,obj)
            var ts = jsonSort(obj1);//按key排序，并且格式化
            var str_t = md5(ts).toUpperCase();
            var json_t = {
                "timestamp": temp,
                "appId": secret_key.appId,
                "sign": str_t,
                "function_name":n
            };
            var json_t1 = $.extend(true,{},json_t,obj);
    return  json_t1     
}
// md5加密 按key排序，并且格式化
function jsonSort(jsonObj) {
    var arr = new Array();
    for (var key in jsonObj) {
        arr.push(key)
    }
    arr.sort();
    var str = '';
    for (var i in arr) {
        str += arr[i] + "=" + jsonObj[arr[i]] + "&"
    }
    return str.substr(0, str.length - 1)
}
// 公共ajax
function public_ajax(objs) {
    
    var obj1 = {
        url:"",
        type:"POST",
        data:{},
        fun:function(){},
        err:function(){},
        // bol:false
    }   
    // console.log('get_json'+n)
    var obj = $.extend(true,{},obj1,objs)//合并
    var n = obj.data.function_name;
    // setTimeout(function(){
        $.ajax({
            url:obj.url,
            type:obj.type,
            dataType: "jsonp",
            data:obj.data,        
            jsonp:"get_json",
            jsonpCallback: n,       
            success:function (res) {
                if (obj.fun) {
                    obj.fun(res);
                }
            },
            error:function (err) {
                obj.err(err)
                // if (bol) return;
                bagHintModalFn('warn',err.msg);
            }
        });  
}

//消息提示
function bagHintModalFn(type,text,open,callback){
    if(!type)console.error('请传入状态','error','warn','success');
    var bag_hint_modal = $('#bag_hint_modal');
    bag_hint_modal.addClass('show-tips');
    var _type = type
    var _text = text
    var _open = open?open:false
    var _callback = typeof callback === 'function'?callback:new Function()
    var use = {
        'error':'custom_modal_img_error',
        'warn':'custom_modal_img_warn',
        'success':'custom_modal_img_success'
    }
    var tipsBol = false
    bag_hint_modal.fadeIn(100)
    init()

    function init(){
        var reg = /\b(custom_modal_img_[a-z]+)\b/g,className = bag_hint_modal.find('.bag_hint_text')[0].className;
        var _class =reg.test(className)?className.replace(reg,use[_type]):className+' '+use[_type]
        bag_hint_modal.find('.bag_hint_text').attr('class',_class).text(_text)
        events()
        if(_open){
            time()
            bag_hint_modal.find('.bag_hint_tips').fadeIn(100)
        }
    }

    function time(){
        var index = 5
        var p  =bag_hint_modal.find('.bag_hint_tips>span').text(index)
        setTime()
        function setTime(){
            p.text(index)
            index--
            if(index <= 0||tipsBol){
                clearTimeout(setTime)
                bag_hint_modal_hide()
            }else{
                setTimeout(setTime,1000)
            }
        }
    }
    function events(){
        bag_hint_modal.click(bag_hint_modal_hide)
        bag_hint_modal.find('.bag_hint_main').click(function(e){
            var e = e || window.event
            e.stopPropagation()
        })
        bag_hint_modal.find('.bag_hint_main>.custom_modal_eas').click(bag_hint_modal_hide)
    }
    function bag_hint_modal_hide(){
        bag_hint_modal.fadeOut(100,function(){
            _callback()
        })
    }
}

//创建分页
function pageNate(objdata){
    var total = objdata.total,//数据总条数
        pageNumber = objdata.pageNumber,//当前页
        pageSize = objdata.pageSize, //每页显示的条数
        edges = 1,//两侧显示的页码数 大于1
        playes = 7,//主页码区显示的页码数 大于3
        pages = Math.ceil(total / pageSize),//总页数;
        callback = objdata.callback,
        name=objdata.name;
        renderPageItem()
    function renderPageItem() {
        var $ul = $('<ul class="pagination pr10"></ul>');
        var start = 1;
        var end = pages;
        //页数是否大于5
        if(pages<=5){
            for (var i = start; i <= end; i++) {
                $ul.append(renderItem(i));
                // $ul.append(renderItem(i,{pageNumber,pageSize}));
            }
        }else{
            if (playes % 2) {
                //playes是奇数
                start = pageNumber - Math.floor(playes / 2);
                end = pageNumber + Math.floor(playes / 2);
            } else {
                //playes是偶数
                start = pageNumber - (playes / 2 - 1);
                end = pageNumber + playes / 2;
            }
            if (start <= edges + 1) {
                start = 1;
                if (end < playes && playes<pages) {
                    end = playes;
                }
            } else {
                for (var i = 1; i <= edges; i++) {
                    $ul.append(renderItem(i));
                }
                $ul.append('<li><span>...</span></li>')
            }
            if (end < pages - edges) {
                for (var i = start; i <= end; i++) {
                    $ul.append(renderItem(i));
                }
                $ul.append('<li><span>...</span></li>');
                for (var i = pages - edges + 1; i <= pages; i++) {
                    $ul.append(renderItem(i));
                }
            } else {
                end = pages;
                if(start>pages-playes+1){
                    start = pages-playes+1
                }
                for (var i = start; i <= end; i++) {
                    $ul.append(renderItem(i));
                }
            }
        }
        name.html('');
        $ul.prepend(renderPrevItem());
        $ul.append(renderNextItem());
        // name.prepend(renderOption(pageSize));
        // name.append(renderSkip())
        name.append($ul);
        // name.find('.pageNumer').find("select").val(pageSize);
    }

    function renderItem(i) {
        $item = $('<li><span href="#">' + i + '</span></li>');
            if (i == pageNumber) {
                $item.addClass('active');
            } 
        $item.on('click', (function (num) {
            return function () {
                pageNumber = num;
                callback(pageNumber,pageSize)
            }
        })(i));
        return $item
    }
    // function renderSkip(){
    //     var $Skip = $('<div class="pull-right input_box" style="font-size:13px;margin-left:8px"><div style="display:inline-block;color: #475669;font-size:13px;">前往<input name="page" value='+ pageNumber +' type="text" class="form-control" style="display:inline-block;width:50px;margin:0 8px; height:32px;" autocomplete="off">页</div><span class="btn btn-default pl15 pr15" style="margin-left:8px;display:inline-block;height:32px;" id="SkipClick">GO</span></div>')
    //     $Skip.on('click','#SkipClick',function (e) {
    //           var input = $Skip.find('input')[0]
    //           pageNumber = input.value;
    //           callback(pageNumber,pageSize)
              
    //     })
    //     return $Skip
    // }
    // function renderOption(){
    //     $option = $('<div class="pull-left pageNumer">显示页数：<select class="form-control" style="display:inline-block;width: auto;height: 35px;margin-right: 5px;height:32px;"><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="40">40</option><option value="50">50</option></select><span>'+parseInt(pageSize*pageNumber-pageSize+1)+'-'+parseInt(pageSize*pageNumber)+'条 / 共'+total+'条</span></div>')
    //     $option.on('change',function(e){
    //         var e=e||event;
    //         num = $(this).find("select").prop("selected",true).val();
    //         pageNumber = 1;
    //         callback(pageNumber,num)
    //     })
    //     return $option;
    // }
    function renderPrevItem() {
        var $prev = $(' <li class="prev"><span>上一页</span></li>');
        if (pageNumber == 1) {
            $prev.addClass('disabled');
        } else {
            $prev.on('click', function () {
                pageNumber = pageNumber - 1;
                callback(pageNumber,pageSize)
            })
        }
        return $prev;
    }
    function renderNextItem() {
        var $next = $('<li class="next"><span>下一页</span></li>');
        if (pageNumber == pages) {
            $next.addClass('disabled');
        } else {
            $next.on('click', function () {
                pageNumber = pageNumber + 1;
                callback(pageNumber,pageSize)
            })
        }
        return $next;
    }
};
