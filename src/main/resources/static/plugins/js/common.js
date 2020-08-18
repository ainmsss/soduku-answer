$(function(){

    $(".dock_close").bind("click", function(){
        var dom = $(".dock");
        dom.animate({right: -dom.outerWidth()}, 300, function(){
            dom.hide();
        });
    });

    $(document).on("click","div.win_tip_close",function () {
        $(".win_tip_box").animate({top: top, opacity: 0}, 300, function(){
            $(".win_tip_box").remove();
        });
    })

    $.fn.removeCss = function (options) {
        var type = typeof (options);
        if (type === "string") {
            this.each(function () {
                var style = $(this).attr("style");
                var arr = style.split(";");
                style = "";
                for (var i = 0; i < arr.length; i++) {
                    if ($.trim(arr[i]) == "") {
                        continue;
                    }
                    var att = arr[i].split(":");
                    if ($.trim(att[0]) == $.trim(options)) {
                        continue;
                    }
                    style += $.trim(arr[i]) + ";";
                }
                $(this).attr("style", style);
            });
        } else if ($.isArray(options)) {
            this.each(function () {
                var style = $(this).attr("style");
                var arr = style.split(";");
                style = "";
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < options.length; j++) {
                        if ($.trim(arr[i]) == "") {
                            break;
                        }
                        var att = arr[i].split(":");
                        if ($.trim(att[0]) == $.trim(options[j])) {
                            arr[i] = "";
                            continue;
                        }
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    if ($.trim(arr[i]) != "") {
                        style += $.trim(arr[i]) + ";";
                    }
                }
                if ($.trim(style) == "") {
                    $(this).removeAttr("style");
                } else {
                    $(this).attr("style", style);
                }
            });
        }
    }

    /**
     * 输入提示
     * @param msg 提示信息
     * @param type 提示类型 error | info
     */
    $.fn.inputTip = function(msg, type){
        var input = $(this);
        if(msg == "close"){
            //关闭自己的
            input.removeClass("input_errored");
            $("#" + input.attr("tip_id")).remove();
//			if(input.parent().hasClass("input_wrapper")){
//				input.unwrap();
//			}
            return;
        }
        input.inputTip("close");
        if(typeof type == "undefined"){
            type = "error";
        }
        if(type == "error"){
            input.addClass("input_errored");
        }
        var tipType = input.attr("tipType");
        var dom;
        if (!tipType){
            tipType = "bottom"
        }
        var inputType = $(this).attr('type');
        if(tipType == "bottom"){
            //出现在下边
            var dom = $("<div class='input_tip_bottom'>"+msg+"</div>").appendTo(input.parent());
        }else if(tipType == "left"){
            dom = $("<div class='input_tip " + type + "'><div class='input_tip_arrow'></div>"+msg+"</div>").appendTo(input.parent());
            //出现在左边
            dom.css("left", input.position().left - dom.outerWidth());
            dom.css("top", input.position().top + input.outerHeight() / 2 - dom.outerHeight() / 2);
            dom.find(".input_tip_arrow").attr("class", "input_tip_arrow_right").css("top", dom.outerHeight()/2 - 8);
            dom.animate({left: input.position().left - dom.outerWidth() - 12, opacity: 1});
        }else{
            dom = $("<div class='input_tip " + type + "'><div class='input_tip_arrow'></div>"+msg+"</div>").appendTo(input.parent());
            dom.css("left", input.position().left + input.outerWidth());
            dom.css("top", input.position().top + input.outerHeight() / 2 - dom.outerHeight() / 2);
            dom.find(".input_tip_arrow").css("top", dom.outerHeight()/2 - 8);
            dom.animate({left: input.position().left + input.outerWidth() + 12, opacity: 1});
        }
        var random = Math.random();
        var newId = (random + new Date().getTime());
        var id = newId.toString(16).replace(".", "");
        dom.attr("id", id);
        if(msg=="clear"){
            dom.remove();
            input.attr("title", "此行为必填项");
        }
        input.attr("tip_id", id);
        // input.unbind("keydown.tip").bind("keydown.tip", function(){
        //     var input = $(this);
        //     input.inputTip("close");
        // });
        // input.unbind("click.tip").bind("click.tip", function(){
        //     var input = $(this);
        //     input.inputTip("close");
        // });
        return $(this);
    };

    /**
     * 全局的inputTip控制
     */
    $.inputTip = function(method){
        if(method == "close"){
            $(".input_errored").each(function(){
                $(this).inputTip("close");
            });
        }
    }

    var winTipTimer = null;
    /**
     * 输入提示
     * @param msg 提示信息
     * @param type 提示类型 error | info
     */
    $.windowTip = function(msg, type){
        if(msg == "close"){
            //关闭提示
            $(".win_tip_box").remove();
            return;
        }
        if(typeof type == "undefined"){
            type = "success";
        }
        $(".win_tip_box").remove();
        var tipBox = $("<div class='win_tip_box'><div class='win_tip_title'>提示</div></div>").appendTo("body");
        var tip = $("<div class='win_tip'></div>").appendTo(tipBox);
        var tipClose = $("<div class='win_tip_close'>关闭</div>").appendTo(tipBox);
        tip.addClass(type);
        tip.html(msg);
        //构建位置与动画
        var top = 10;
        if($("#header").length > 0){
            top += $("#header").height();
        }
        var h = tip.height();
        top = ($(window).outerHeight() - h)/2 - 200;
        tipBox.css("left", ($(window).width() - tipBox.outerWidth()) / 2);
        tipBox.css("top", top);
        tipBox.css("z-index",9999);
        tipBox.animate({top: top, opacity: 1}, 300);
        //4秒后消失
        if (type=="slow"){
            if(winTipTimer){
                clearTimeout(winTipTimer);
            }
            winTipTimer = setTimeout(function(){
                $(".win_tip_box").animate({top: top, opacity: 1}, 300, function(){
                    $(".win_tip_box").remove();
                });
                winTipTimer = null;
            }, 4000);
        }
    }


    /**
     * 扩展的form提交 post hidden frame形式
     * @param {Object} options
     * @param .url  提交地址
     * @param .onSubmit  提交前事件
     * @param .success  提交成功事件
     * @param {boolean} json 是否是json形式
     */
    $.fn.submitForm = function(opt){
        var defaultOpt = {
            json:true
        };
        var options = $.extend(defaultOpt, opt);
        var form = $(this);
        if(options.onSubmit){
            if (options.onSubmit.call(form) == false) {
                return;
            }
        }
        if (options.url){
            form.attr('action', options.url);
        }
        var frameId = 'submit_frame_' + (new Date().getTime());
        var frame = $('<iframe id='+frameId+' name='+frameId+'></iframe>')
            .attr('src', window.ActiveXObject ? 'javascript:false' : 'about:blank')
            .css({
                position:'absolute',
                top:-1000,
                left:-1000
            });
        form.attr('target', frameId);
        frame.appendTo('body');
        frame.bind('load', submitCallback);
        form.append("<input type='hidden' name='submitFormByHiddenFrame' id='submitFormByHiddenFrameParam' value='hiddenFrame'/>");
        form[0].submit();
        $("#submitFormByHiddenFrameParam").remove();

        var checkCount = 10;
        function submitCallback(){
            frame.unbind();
            var body = $('#'+frameId).contents().find("body");
            var data = body.html();
            if (data == ''){
                if (--checkCount){
                    setTimeout(submitCallback, 200);
                    return;
                }
                return;
            }
            var ta = body.find('>textarea');
            if (ta.length){
                data = ta.val();
            } else {
                var pre = body.find('>pre');
                if (pre.length){
                    data = pre.html();
                }
            }
            eval('data='+data+';');
            if (options.success) {
                options.success(data);
            }
            setTimeout(function(){
                frame.unbind();
                frame.remove();
            }, 100);
        }
    };


    /**
     * 窗口
     */
    $.fn.dlg = function(options){
        var dlg = $(this);
        if(typeof options == "string"){
            if(options == "close"){
                dlg.children(".dlg_close").trigger("click");
            }
            return;
        }
        var defaults = {closable: true};
        options = $.extend(defaults, options);
        var close = dlg.children(".dlg_close");
        if(close.length == 0){
            close = $("<div class='dlg_close'><div class='close_ico'></div></div>").appendTo(dlg);
        }
        if(options.closable == false){
            close.hide();
        }else{
            close.show();
        }
        $(".dlg_mask").remove();
        $("body").append("<div class='dlg_mask'></div>")
        close.unbind().bind("click", function(){
            dlg.hide();
            $(".dlg_mask").remove();
            if(options && options.onClose){
                options.onClose();
            }
            $(document).unbind("keydown.closedlg");
        });
        dlg.css({
            left: ($(window).width() - dlg.outerWidth())/2,
            // top: ($(window).height() - dlg.outerHeight())/2
            top: ($(window).outerHeight() - dlg.outerHeight())/2
        });
        dlg.show();
        if(options.closable){
            $(document).unbind("keydown.closedlg").bind("keydown.closedlg", function(e){
                if(e.keyCode == 27){
                    dlg.children(".dlg_close").trigger("click");
                }
            });
        }
        dlg.children(".dlg_header").unbind("mousedown.drag_dlg").bind("mousedown.drag_dlg", function(e){
            var target = $(this).parent();
            var downX = e.pageX;
            var downY = e.pageY;
            var downLeft = target.offset().left;
            var downTop = target.offset().top;
            $(document).bind("mousemove.drag_dlg", function(e){
                var left = e.pageX - downX + downLeft;
                var top = e.pageY - downY + downTop;
                target.offset({
                    left: left,
                    top: top
                });
            });
            $(document).bind("mouseup.drag_dlg", function(e){
                $(document).unbind("mousemove.drag_dlg");
                $(document).unbind("mouseup.drag_dlg");
            });
        });
    };

    $.confirm = function(msg, callback,dlgType){
        if(!dlgType){
            dlgType="";
        }
        if($("#global_confirm_window")){
            $("#global_confirm_window").remove();
        }
        var confirmWin = $("#global_confirm_window")
        if(!confirmWin.length){
            // if(dlgType=="remove"){
            //     confirmWin = $("<div id='global_confirm_window' class='dlg'><div class='dlg_header remove_header'>请确认</div><div class='dlg_content'><div class='confirm_msg' style=''></div></div><div class='dlg_buttons'><span class='btn okbtn remove_btn'>确认</span><span class='btn light cancelbtn'>取消</span></div></div>").appendTo("body");
            // }else{
            //     confirmWin = $("<div id='global_confirm_window' class='dlg'><div class='dlg_header'>请确认</div><div class='dlg_content'><div class='confirm_msg' style=''></div></div><div class='dlg_buttons'><span class='common-btn okbtn'>确认</span></div></div>").appendTo("body");
            // }
            confirmWin = $("<div id='global_confirm_window' class='dlg'><div class='dlg_header remove_header'>请确认</div><div class='dlg_content'><div class='confirm_msg' style=''></div></div><div class='dlg_buttons'><span class='btn okbtn remove_btn'>确认</span><span class='btn light cancelbtn'>取消</span></div></div>").appendTo("body");

        }
        confirmWin.find(".confirm_msg").html(msg);
        confirmWin.dlg();
        confirmWin.find(".okbtn").unbind().bind("click", function(){
            confirmWin.dlg("close");
            if(callback){
                callback();
            }
        });
        confirmWin.find(".cancelbtn").unbind().bind("click", function(){
            confirmWin.dlg("close");
        });
    };

    /**
     * 验证一个容器中得所有输入控件
     */
    $.fn.validate = function(error_msg){
        var result = true;
        //验证非空
        var focused = null;
        $(this).find(".validate").each(function(){
            var val = $(this).val();
            var type = $(this).attr('type');
            if (type == 'radio') {
                var name = $(this).attr('name');
                if (name){
                    val = $("input[type=radio][name='"+name+"']:checked").val();
                }else{
                    val = "";
                }
            } else if (type == 'checkbox') {
                var name = $(this).attr('name');
                if (name){
                    val = $("input[type=checkbox][name='"+name+"']:checked").val();
                }else{
                    val = "";
                }
            }
            $(this).inputTip("close");
            // if(!$(this).is(":visible")){
            //     //相当于continue
            //     return true;
            // }
            if(typeof $(this).hasClass("required") != "undefined" && $.trim(val) == ""){
                result = false;
                var msg = "此项不能为空";
                if($(this).attr("msg")){
                    msg = $(this).attr("msg");
                }
                if (error_msg){
                    msg = error_msg;
                }
                $(this).inputTip(msg);
                if(focused == null){
                    focused = $(this);
                }
            }else if($(this).attr("validType") == "email" && !val.isEmail()){
                result = false;
                var msg = "请输入正确的邮箱格式";
                if($(this).attr("msg")){
                    msg = $(this).attr("msg");
                }
                $(this).inputTip(msg);
                if(focused == null){
                    focused = $(this);
                }
            }else if($(this).attr("validType") == "phone" && !val.isPhoneNumber()){
                result = false;
                var msg = "请输入正确的手机号码";
                if($(this).attr("msg")){
                    msg = $(this).attr("msg");
                }
                $(this).inputTip(msg);
                if(focused == null){
                    focused = $(this);
                }
            }else if($(this).attr("validType") == "username" && !val.onlyNumAndChar($(this).val())){
                result = false;
                var msg = "由字母、数字、下划线组成";
                if($(this).attr("msg")){
                    msg = $(this).attr("msg");
                }
                $(this).inputTip(msg);
                if(focused == null){
                    focused = $(this);
                }
            }else if($(this).attr("validType") == "number" && "" != $(this).val() && !($(this).val()%1 === 0)){
                result = false;
                var msg = "请输入数字";
                if($(this).attr("msg")){
                    msg = $(this).attr("msg");
                }
                $(this).inputTip(msg);
                if(focused == null){
                    focused = $(this);
                }
            }else if($(this).attr("minLength") && val.length < parseInt($(this).attr("minLength"))){
                result = false;
                var msg = "请输入至少" + $(this).attr("minLength") + "个字符";
                if($(this).attr("msg")){
                    msg = $(this).attr("msg");
                }
                $(this).inputTip(msg);
                if(focused == null){
                    focused = $(this);
                }
            }else if($(this).attr("maxLength") && val.length > parseInt($(this).attr("maxLength"))){
                result = false;
                var msg = "长度超出限制，最多允许" + $(this).attr("maxLength") + "个字符";
                if($(this).attr("msg")){
                    msg = $(this).attr("msg");
                }
                $(this).inputTip(msg);
                if(focused == null){
                    focused = $(this);
                }
            } else if ($(this).attr("validType") == "confirmPassword" &&  $(this).val()!=$("#pwdNew").val()) {
                result = false;
                var msg = "两次密码不一致";
                $(this).inputTip(msg);
                if (focused == null) {
                    focused = $(this);
                }
            }else{
                $(this).inputTip("close");
            }
        });
        if(focused != null){
            focused.focus();
        }
        //长度验证
        return result;

    };

    //Jquery 将表单序列化 为json对象 支持多选
    $.fn.serializeFormJson=function(){
        var serializeObj={};
        var array=this.serializeArray();
        var str=this.serialize();
        $(array).each(function(){
            if(serializeObj[this.name]){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value;
            }
        });
        return serializeObj;
    };

    /**
     * 根据分组样式序列化各自的内容,支持多选{"personId":"218113","id":"0","applyNo":"2017113017545233560","applyer":"代占超",
     * "employeeNumber":"33560","mobile":"18801138831","busineUnit":"亚信软件SW-CIT",
     * "orgName":"SW-CIT BOS_OSC1-BJ","bidTime":"2017-11-30","customerName":"",
     * "projectName":"","applyType":["学历证书","劳动合同","社保证明"],"description":""}
     * @returns {{}}
     */
    $.fn.serializeJson = function () {
        var obj = {};
        this.find("input[type!='button'][name],textarea[name],select[name]").each(function () {
            var name = $(this).attr("name") || "";
            var value = $(this).val() || "";
            if ($.isArray(obj[name])){
                obj[name].push(value);
            }else{
                if (obj[name]){
                    var arr = [];
                    arr.push(obj[name]);
                    arr.push(value)
                    obj[name] = arr;
                }else{
                    if(name){
                        obj[name] = value;
                    }
                }
            }
        });
        return obj;
    }

    $.fn.serializeTableArray=function () {
        var array = [];
        this.find("tbody tr").each(function () {
            var obj = {};
            $(this).find("td").each(function () {
                $(this).find("input[type!='button'][name],textarea[name]").each(function () {
                    var name = $(this).attr("name") || "";
                    var value = $(this).val() || "";
                    if(name){
                        obj[name] = value;
                    }
                })
            })
            array.push(obj);
        })
        return array;
    }


    //控制只能输入数字和两位小数
    $(document).on("keyup","input[number],textarea[number]",function(){
        clearNoNum(this);
    });

    $.fn.setFormData = function (obj) {
        var key, value, tagName, type, arr;
        for (x in obj) {
            key = x;
            value = obj[x];
            $(this).find("[name=" + key + "]").each(function () {
                tagName = $(this)[0].tagName;
                type = $(this).attr('type');
                if (tagName == 'INPUT') {
                    if (type == 'radio') {
                        $(this).attr('checked', $(this).val() == value);
                    } else if (type == 'checkbox') {
                        if ($.isArray(value)) {
                            arr = value;
                        }else{
                            arr = (value+"").split(',');
                        }
                        for (var i = 0; i < arr.length; i++) {
                            if ($(this).val() == arr[i]) {
                                $(this).attr('checked', true);
                                break;
                            }
                        }
                    } else {
                        $(this).val(value);
                    }
                } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                    $(this).val(value);
                }
                else if(tagName == 'SPAN') {
                    $(this).html(value);
                }
            });
        }
    }
});


var Util = {};
$.ajaxSetup({cache:false})
/**
 * 封装的ajax，对$.ajax结果进行了过滤
 * @param {Object} options
 */
Util.ajax = function(options){
    if (window.top != null && window.top.layer!=null){
        window.top.layer.load();
    }
    if(options.onSend){
        if(options.onSend() == false){
            return;
        }
    }
    var defaults = {
        type: "POST"
    }
    if (options.dataType && options.dataType=="json"){
        if (options.data) {
            options.data = JSON.stringify(options.data)
        }
        options.contentType = 'application/json'

    }
    options = $.extend(defaults, options);

    return $.ajax({
        url:options.url,
        type:options.type,
        traditional:true,
        data:options.data,
        dataType:options.dataType,
        contentType : options.contentType, //设置请求头信息
        async:options.async,
        // cache:false,
        success:function(data){
            if(typeof data == "string" && data == "{error:'notlogin'}"){
                window.location.href = "/login";
                return;
            }
            if(data.error == "error"){
            }else if (data.error == "notlogin") {
                window.location.href = "/login";
            }else{
                if(options.success){
                    options.success(data);
                }
            }
            if (window.top != null && window.top.layer!=null){
                window.top.layer.closeAll("loading");
            }
        },
        error:function(data){
            if(data.status){
                if(options.error){
                    options.error(data);
                }else{

                }
            }
            if (window.top != null && window.top.layer!=null){
                window.top.layer.closeAll("loading");
            }
        }
    });
};

function clearNoNum(obj){
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj.value= parseFloat(obj.value);
    }
}

//打印时mm转像素px,像素px转mm
function px2pm(d) {
    var iswindow = /windows|win32/i.test(navigator.userAgent);
    if (iswindow) {
        return Math.round(d * 25.4 / 96);//电脑端
    } else {
        return Math.round(d * 25.4 / 72);//手机端
    }
}
function pm2px(d) {
    var iswindow = /windows|win32/i.test(navigator.userAgent);
    if (iswindow) {
        return Math.round(d * 96 / 25.4);
    } else {
        return Math.round(d * 72 / 25.4);
    }
}

function getSrcParams(url) {
    var regexpParam = /\??([\w\d%]+)=([\w\d%]*)&?/g; //分离参数的正则表达式
    var  paramMap=null;//置空
    if(url) {
        var ret;
        paramMap = {};//初始化结果集

        //开始循环查找url中的参数，并以键值对形式放入结果集
        while((ret = regexpParam.exec(url)) != null) {
            //ret[1]是参数名，ret[2]是参数值
            paramMap[ret[1]] = ret[2];
        }
    }
    return paramMap;
}

function getHostIp(){
    /*//获取当前网址，如： http://localhost:8080/Tmall/index.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录如：/Tmall/index.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8080
    var localhostPath=curWwwPath.substring(0,pos);
    //判读是否80（有端口）
    var n = (localhostPath.split(':')).length-1;
    if( n > 1 ){
        var index = localhostPath.lastIndexOf(":");
        var ip = localhostPath.substring(0,index);
        return ip;
    }
    return localhostPath;*/
    return "http://"+window.location.host;
}

/**
 * 获取流程状态
 * @param obj
 * @returns {*}
 */
function getHistoryList(procInstId) {
    var html = $("<div id=\"historyContent\"" +
        "    <div class=\"ibox\">\n" +
        "        <div class=\"ibox-body\" style=\"overflow: hidden\">\n" +
        "            <div class=\"hovertree-trackrcol\">\n" +
        "                <div class=\"hovertree-tracklist\">\n" +
        "                    <ul id=\"historyData\">\n" +
        "\n" +
        "                    </ul>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>");
    var script=$("<script id=\"historyTemplate\" type=\"text/x-jquery-tmpl\">\n" +
        "<li>\n" +
        "<i class=\"node-icon\"></i>\n" +
        "<span class=\"time\">{{= startTime}}</span>\n" +
        "<span class=\"txt\">{{= actName}}</span>\n" +
        "<span class=\"txt\">{{= assignee}}</span>\n" +
        "<br/>\n" +
        "      <span>操作时间:{{= endTime}}</span>\n" +
        "<br/>\n" +
        "<span>备注:<span class=\"remark\">{{= message}}</span></span>\n" +
        "</li>\n" +
        "\n" +
        "</script>")
    // $("#historyContent").html(html);
    // $("#historyContentScript").html(script);
    $.ajax({
        url: "/system/workflowConfig/historyList",
        data: {
            procInsId: procInstId
        },
        type: 'POST',
        async: false,
        success: function (data) {
            $("#historyData").empty();
            if (data) {
                if (data.data.length > 0) {
                    script.tmpl(data.data).appendTo(html.find("#historyData"));
                    if($('#right').length >0){
                        $('#right').hide();
                    }

                    layer.open({
                        type: 1,
                        title: '流程流转记录',
                        maxmin: true,
                        scrollbar: false,
                        shadeClose: false, // 点击遮罩关闭层
                        area: ['600px', '450px'],
                        content: html.html(),
                        yes: function () {
                        },
                        cancel: function () {
                        },
                        end: function () {
                            if($('#right').length >0){
                                $('#right').show();
                            }
                        }
                    });
                    $(".layui-layer-content").css("overflow", "hidden");
                }
            }
        }
    })
}
function getFlowStatus(obj) {
    var result = "";
    if (obj && obj.hasOwnProperty("taskName") && obj.taskName){
        result = obj.taskName;
    } else if (obj && obj.hasOwnProperty("status")) {
        switch (obj.status){
            case 'SAVE': result = "保存";
                break;
            case 'APPROVAL': result = "审批中";
                break;
            case 'REJECT': result = "退回";
                break;
            case 'COMPLETE': result = "完成";
                break;
        }
    }else if (obj && obj.hasOwnProperty("projectStatus")) {
        switch (obj.projectStatus){
            case '1': result = "注册";
                break;
            case '2': result = "计划";
                break;
            case '3': result = "过程监督";
                break;
            case '4': result = "验收监督";
                break;
            case '5': result = "监督报告";
                break;
            case '6': result = "监督认证";
                break;
            case '7': result = "监督档案";
                break;
        }
    } else {
        if (obj && obj.hasOwnProperty("status")) {
            switch (obj.status){
                case 'SAVE': result = "保存";
                    break;
                case 'APPROVAL': result = "审批中";
                    break;
                case 'REJECT': result = "退回";
                    break;
                case 'COMPLETE': result = "完成";
                    break;
            }
        }
    }
    return "<span style='cursor: pointer' onclick='getHistoryList(\""+obj.procInstId+"\")'>"+result+"</span>"
}

/**
 * 展示业务关联附件列表
 * @param data
 */
function showBusinessFiles(data) {
    layui.use("layer",function () {
        if (!data.hasOwnProperty("businessId")) {
            layer.alert("业务主键参数缺失");
            return false;
        }
        if (!data.hasOwnProperty("fileCode")) {
            layer.alert("模版编码参数缺失");
            return false;
        }
        var width = ($(window).width() - 200)+"px";
        var height = ($(window).height()-200)+"px";
        var dialog = layer.open({
            type: 2 //此处以iframe举例
            ,area:[width,height]
            ,title: "附件列表"
            ,shade: 0.2
            ,maxmin: true
            ,content: "/relation/businessFile?businessId="+data.businessId+"&fileCode="+data.fileCode+"&taskKey="+(data.taskKey || "")
            ,zIndex: layer.zIndex //重点1
            ,success: function(layero,index){
                $('#right').hide();
                layer.setTop(layero); //重点2
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                if (iframeWin.hasOwnProperty("setData")){
                    iframeWin.setData(data);
                }
            },
            cancel: function(index, layero){
                $('#right').show();
            }
        });
    })
}

/**
 * 单元格编辑
 * @param that
 * @param obj
 * @param callMethod
 * @returns {boolean}
 * @constructor
 */
function CellClick(that,obj,callMethod){
    var td = $(that)[0];
    var fieldType = $(td).find("[fieldType]").attr("fieldType") || "";
    var dataType = $(td).find("[dataType]").attr("dataType") || "";
    var dataLength = $(td).find("[dataLength]").attr("dataLength") || "";
    if (!fieldType) return false;
    //当前点击字段
    var field = $(that).data("field");
    //当前行数据
    var data = obj.data;
    //当前单元格的值
    var value = data[field];


    //当前点击td的宽高
    var height = $(that)[0].offsetHeight,width = $(that)[0].offsetWidth;
    //当前点击td的坐标
    var top = $(that).offset().top,left = $(that).offset().left+1;

    //输入框 这里可以自定义表单内容
    var content;
    if (fieldType==="input"){
        var input = '<input type="text" class="layui-input cell-edit-input" name="'+field+'_'+fieldType+'" data-field="'+field+'" style="width:99%;height:100%"></input>';
        content = input;
    } else if (fieldType==="textarea") {
        var textarea = '<textarea class="layui-input cell-edit-input" name="'+field+'_'+fieldType+'" data-field="'+field+'" style="width:99%;height:100%"></textarea>';
        content = textarea;
    }else if (fieldType==="select") {
        var select = $('<select class="cell-edit-select" name="'+field+'_'+fieldType+'" data-field="'+field+'" style="width:'+(width-1)+'px;height:'+height+'px"></select>');
        var selectOptions = [];
        var dictField = $(that).find("[fieldType='select']").attr("dictField") || "";
        if (dictField){
            var dictKey = $(that).find("[fieldType='select']").attr("dictKey") || "keyy";
            var dictVal = $(that).find("[fieldType='select']").attr("dictKey") || "valuee";
            Util.ajax({
                url: "/system/dict/listByField",
                data: {
                    fieldName:dictField
                },
                async: false,
                success: function (data) {
                    if (data.hasOwnProperty("resultCode") && data.resultCode!=200){
                        var option = $("<option value=''>未分配数据字典</option>");
                        option.appendTo(select);
                    }else{
                        if (data.data && data.data.length >0){
                            var optionData = {};
                            for (var i in data.data){
                                optionData = data.data[i];
                                var option = $("<option value='"+optionData[dictKey]+"'>"+optionData[dictVal]+"</option>");
                                option.appendTo(select);
                            }
                        }
                    }
                }
            })
        }else{
            selectOptions = $(that).find("[fieldType='select']").attr("data") || "";
            if(selectOptions){
                selectOptions = selectOptions.split(",");
                for (var i in selectOptions){
                    var option = $("<option value='"+selectOptions[i]+"'>"+selectOptions[i]+"</option>");
                    option.appendTo(select);
                }
            }
        }
        content = select[0].outerHTML;
    }else if(fieldType==="date") {
        var date = $('<input onClick="WdatePicker({el:this,dateFmt:\'yyyy-MM-dd\',readOnly:true})" type="text" class="layui-input Wdate cell-edit-input" name="'+field+'_'+fieldType+'" data-field="'+field+'" style="width:99%;height:100%"></input>');
        content = date[0].outerHTML;
    }
    //弹出层
    layer.open({
        type: 1,
        anim: 5
        ,title:false
        ,page:true
        ,limit:1
        ,closeBtn:0
        ,area: [width+"px", height+"px"]
        ,shade: [0.02,'#fff']
        ,shadeClose:true
        ,content: content //这里content是一个普通的String
        ,offset:[top,left]
        ,success:function(layero,index){
            //使弹出层相对浮动
            //$(".layui-layer-page").css("position","absolute")
            //设置输入框的值
            layero.find("[name="+field+"_"+fieldType+"]").val(value);
            if (fieldType==="select" || fieldType==="radio" || fieldType==="checkbox"){
                $("[name="+field+"_"+fieldType+"]").change(function(){
                    //同步更新缓存对应的值
                    data[field] = $(this).val()||"";
                    obj.update(data);
                    if (callMethod){
                        callMethod(obj,$(this));
                    }
                });
            }else{
                layero.find("[name="+field+"_"+fieldType+"]").focus();
                $("[name="+field+"_"+fieldType+"]").blur(function(){
                    //同步更新缓存对应的值
                    var resValue = $(this).val()||"";
                    if(resValue && dataType ==="number"){
                        resValue = resValue.replace(/[^\d.]/g, '').replace(/^\./g,"").replace(/\.{2,}/g,".").replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                        if(resValue&&resValue !=0){
                            parseFloat(resValue);
                        }
                    }
                    if(resValue && dataLength !=""&&resValue.length>dataLength){
                        resValue = resValue.substr(0,dataLength);
                    }
                    data[field] = resValue;
                    obj.update(data);
                    if (callMethod){//date 不执行回调方法
                        callMethod(obj,that,fieldType);
                    }
                });
            }
        }
    });
}

//定义一个加法函数
function add(){
    var args = arguments,//获取所有的参数
        lens = args.length,//获取参数的长度
        d = 0,//定义小数位的初始长度，默认为整数，即小数位为0
        sum = 0;//定义sum来接收所有数据的和
        //循环所有的参数
        for(var key in args){//遍历所有的参数
        //把数字转为字符串
        var str = ""+args[key];
        if(str.indexOf(".")!=-1){//判断数字是否为小数
            //获取小数位的长度
            var temp = str.split(".")[1].length;
            //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
            d = d < temp ? temp : d;
        }
    }
    //计算需要乘的数值
    var m = Math.pow(10,d);
    //遍历所有参数并相加
    for(var key in args){
        sum += args[key]*m;
    }
    //返回结果
    return sum/m;
}

function getDecimalMaxLength(val,indexs) {
    var d = 0;
    if(val.indexOf(".")!=-1){//判断数字是否为小数
        //获取小数位的长度
        var temp = val.split(".")[1].length;
        //比较此数的小数位与原小数位的长度，取小数位较长的存储到d中
        d = d < temp ? temp : d;
    }
    indexs.push(d);
    indexs = indexs.sort(function(a, b) { return b - a});
    return indexs[0];
}

/**
 * 截取小数位
 * 判断结果集小数位长度和最大小数位长度
 * 截取结果集
 * @param result
 * @param maxLength
 */
function formatResultDecimal(result,maxLength) {
    result = result+"";
    result = math.round(result,maxLength)+"";
    if(result.indexOf(".")!=-1) {//判断数字是否为小数
        //获取小数位的长度
        var length = result.split(".")[1].length;
        if (length>maxLength){
            result = result.substr(0,result.indexOf(".")+1+maxLength);
        }
    }
    return result;
}

/**
 *
 * @param projectId
 * @param parentId
 * @param sumField
 * @param field
 * @param index
 * @param tableId
 * @param table
 * @param floatMethod 格式化小数方法
 * @returns {boolean}
 */
function cellSum(projectId,parentId,sumField,field,index,tableId,table,floatMethod) {
    var maxLength = 0;
    var indexs = [];
    var expression = $("tr[data-index="+index+"] td[data-field="+sumField+"] span").attr("expression") || "";
    var method = $("tr[data-index="+index+"] td[data-field="+sumField+"] span").attr("method") || "";
    if (expression){
        var length = $("tr[data-index="+index+"] span[projectId="+projectId+"][sumField="+sumField+"]").length;
        if(length > 0){
            var exp = {};
            //判断是否所有字段都为空，设置结果集也为空
            var i = 0;
            $("tr[data-index="+index+"] span[projectId="+projectId+"][sumField="+sumField+"]").each(function () {
                var fieldName = $(this).parents("td").attr("data-field");
                if ($.trim($(this).text())=="") {
                    i++;
                }
                var val = $(this).text()||"0";
                //精度问题，向下取整数
                exp[fieldName] = val;
                maxLength = getDecimalMaxLength(val,indexs);
            });
            if (!$.isEmptyObject(exp)){
                for (var key in exp){
                    expression = expression.replace("exp."+key,exp[key]);
                }
                var result = "";
                if (method){
                    result = eval(method+expression)
                }else{
                    result = math.eval(expression);
                }
                result = formatResultDecimal(result,maxLength);
                var data = {}
                if (length==i){
                    result = "";
                }
                if (floatMethod && typeof floatMethod === "function") {
                    result = floatMethod(result);
                }
                data[sumField] = result;
                //更新本行合计
                $("tr[data-index="+index+"] td[data-field="+sumField+"] span").text(result);
                layui.$.extend(table.cache[tableId][index], data);
            }
        }
    }else{
        //是否计算本行合计
        var nosum = typeof($("tr[data-index="+index+"] td[data-field="+sumField+"] span[projectId="+projectId+"]").attr("nosum")) != "undefined" ? true : false;
        if (!nosum){
            var sum="";
            indexs = [];
            $("span[projectId="+projectId+"][sumField="+sumField+"]").each(function () {
                var val = $(this).text() || "0";
                sum+=val+"+";
                maxLength = getDecimalMaxLength(val,indexs);
            });
            if (sum.indexOf("+")!=-1){
                sum = math.eval(sum.substr(0,sum.length-1))
            } else{
                sum = math.eval(sum)
            }
            sum = formatResultDecimal(sum,maxLength);
            if (floatMethod && typeof floatMethod === "function") {
                sum = floatMethod(sum);
            }
            if (sum==0){
                sum = "";
            }
            var data = {}
            data[sumField] = sum;
            //更新本行合计
            $("tr[data-index="+index+"] td[data-field="+sumField+"] span").text(sum);
            layui.$.extend(table.cache[tableId][index], data);
        }
    }
    if($("span[projectId="+parentId+"]").length==0) return false;
    //获取本列同名称单项属性，进行合计
    var parentIndex = $("span[projectId="+parentId+"]").parents("tr").attr("data-index");
    var parentSum = "";
    indexs = [];
    $("td[data-field="+field+"] span[parentId="+parentId+"]").each(function () {
        var val = $(this).text() || "0";
        parentSum+=val+"+";
        maxLength = getDecimalMaxLength(val,indexs);
    });

    if (parentSum.indexOf("+")!=-1){
        parentSum = math.eval(parentSum.substr(0,parentSum.length-1))
    } else{
        parentSum = math.eval(parentSum)
    }
    if (floatMethod && typeof floatMethod === "function") {
        parentSum = floatMethod(parentSum);
    }
    parentSum = formatResultDecimal(parentSum,maxLength);
    if (parentSum==0){
        parentSum = "";
    }
    //是否计算本行合计
    var nosum = typeof($("tr[data-index="+parentIndex+"] td[data-field="+field+"] span[projectId="+parentId+"]").attr("nosum")) != "undefined" ? true : false;
    if(!nosum){
        //更新父类同名列进行合计
        $("tr[data-index="+parentIndex+"] td[data-field="+field+"] span").text(parentSum);
        var parentData = {}
        parentData[field] = parentSum;
        layui.$.extend(table.cache[tableId][parentIndex], parentData);
    }
    //合并列是否需要竖向合并
    var $parentSumField = $("td[data-field="+sumField+"] span[projectId="+parentId+"]");
    var colsum = typeof($parentSumField.attr("colsum")) != "undefined" ? true : false;
    if (colsum){
        var colSum="";
        indexs = [];
        $("td[data-field="+sumField+"] span[parentId="+parentId+"]").each(function () {
            var val = $(this).text() || "0";
            colSum+=val+"+";
            maxLength = getDecimalMaxLength(val,indexs);
        })
        if (colSum.indexOf("+")!=-1){
            colSum = math.eval(colSum.substr(0,colSum.length-1))
        } else{
            colSum = math.eval(colSum)
        }
        colSum = formatResultDecimal(colSum,maxLength);
        if (floatMethod && typeof floatMethod === "function") {
            colSum = floatMethod(colSum);
        }
        if (colSum==0){
            colSum = "";
        }
        $parentSumField.text(colSum);
        var colSumData = {}
        colSumData[sumField] = colSum;
        layui.$.extend(table.cache[tableId][parentIndex], colSumData);
    }

    //更新完毕，获取父类是否还有上级，进行递归操作
    var $parent = $("td[data-field="+field+"] span[projectId="+parentId+"]");
    if($parent.length==0) return false;
    projectId = $parent.attr("projectId");
    parentId = $parent.attr("parentId");
    var parentSumField = typeof($parent.attr("sumField"))!="undefined" ? true : false;
    parentIndex = $("span[projectId="+projectId+"]").parents("tr").attr("data-index");
    if(parentSumField){
        cellSum(projectId,parentId,sumField,field,parentIndex,tableId,table);
    }
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
}
