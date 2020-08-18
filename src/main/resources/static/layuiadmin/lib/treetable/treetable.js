layui.define(['layer', 'table'], function (exports) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var table = layui.table;
    var tableIns;
    var treetable = {
        params:{},
        // 渲染树形表格
        render: function (param) {
            // 检查参数
            if (!treetable.checkParam(param)) {
                return;
            }
            // 获取数据
            if (param.data) {
                treetable.params = param;
                treetable.init(param, param.data);
            } else {
                var defaults = {
                    method: "POST"
                }
                param = $.extend(defaults, param);
                treetable.params = param;
                $.ajax({
                        url: param.url,
                        type: param.method,
                        traditional: true,
                        data: param.where,
                        dataType: param.dataType,
                        contentType: param.contentType, //设置请求头信息
                        async: param.async,
                        success: function (res) {
                            if (param.parseData){
                                treetable.init(param, param.parseData(res));
                            } else{
                                treetable.init(param, res);
                            }
                        }
                    }
                )
            }
        },
        // 渲染表格
        init: function (param, data) {
            var mData = [];
            var doneCallback = param.done;
            var tNodes = data.hasOwnProperty("data") ? data.data : data;
            // 补上id和pid字段
            for (var i = 0; i < tNodes.length; i++) {
                var tt = tNodes[i];
                //设置checked
                if (tt.hasOwnProperty("checked")){
                    tt.LAY_CHECKED = tt.checked
                }
                // if (!tt.id) {
                //     if (!param.treeIdName) {
                //         layer.msg('参数treeIdName不能为空', {icon: 5});
                //         return;
                //     }
                //     tt.id = tt[param.treeIdName];
                // }
                if(param.treeIdName){
                    tt.id = tt[param.treeIdName];
                }else {
                    layer.msg('参数treeIdName不能为空', {icon: 5});
                            return;
                }
                if (!tt.pid) {
                    if (!param.treePidName) {
                        layer.msg('参数treePidName不能为空', {icon: 5});
                        return;
                    }
                    tt.pid = tt[param.treePidName];
                }
            }

            // 对数据进行排序
            var sort = function (s_pid, data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].pid == s_pid) {
                        var len = mData.length;
                        if (len > 0 && mData[len - 1].id == s_pid) {
                            mData[len - 1].isParent = true;
                        }
                        mData.push(data[i]);
                        sort(data[i].id, data);
                    }
                }
            };
            sort(param.treeSpid, tNodes);

            // 重写参数
            param.url = undefined;
            param.data = mData;
            if (param.hasOwnProperty("page") && param.page == false){
                param.limit = Number.MAX_VALUE
            } else {
                param.page = {
                    count: param.data.length,
                    limit: param.data.length
                };
            }
            if (param.hasOwnProperty("iconShow") && param.iconShow){
                param.limit = Number.MAX_VALUE
            } else {
                var icon =  {
                    open: 'layui-icon layui-icon-triangle-d',
                    close: 'layui-icon layui-icon-triangle-r'
                }
            }
            var iconColFormat =  param.cols[0][param.treeColIndex].templet;
            param.cols[0][param.treeColIndex].templet = function (d) {
                var mId = d.id;
                var mPid = d.pid;
                var isDir = d.isParent;
                var emptyNum = treetable.getEmptyNum(mPid, mData);
                var iconHtml = '';
                for (var i = 0; i < emptyNum; i++) {
                    iconHtml += '<span class="treeTable-empty"></span>';
                }
                if (isDir) {
                    iconHtml += '<i class="layui-icon layui-icon-triangle-d"></i> <i class="layui-icon layui-icon-layer"></i>';
                } else {
                    iconHtml += '<i class="layui-icon layui-icon-file"></i>';
                }
                iconHtml += '&nbsp;&nbsp;';
                var ttype = isDir ? 'dir' : 'file';
                var vg = '<span class="treeTable-icon open" lay-tid="' + mId + '" lay-tpid="' + mPid + '" lay-ttype="' + ttype + '">';
                var name = d[param.cols[0][param.treeColIndex].field];
                if (iconColFormat){
                    name = iconColFormat(d);
                };
                return vg + iconHtml + name + '</span>'
            };

            param.done = function (res, curr, count) {
                $(param.elem).next().addClass('treeTable');
                $('.treeTable .layui-table-page').css("display","none");
                $(param.elem).next().attr('treeLinkage', param.treeLinkage);
                $(param.elem).next().attr('highlight', param.highlight);
                // 绑定事件换成对body绑定
                // $('.treeTable .treeTable-icon').click(function () {
                //     treetable.toggleRows($(this), param.treeLinkage);
                // });
                if (param.treeDefaultClose) {
                    treetable.foldAll(param.elem);
                }
                if (doneCallback) {
                    doneCallback(res, curr, count);
                }

                //高亮显示
                $(document).on("mouseover","div.treeTable[highlight] tbody td",function () {
                    var field = $(this).attr("data-field") || "";
                    if (field){
                        $(this).addClass("treeTable-highlight");
                    }
                })
                $(document).on("mouseout","div.treeTable[highlight] tbody td",function () {
                    var field = $(this).attr("data-field") || "";
                    if (field){
                        $(this).removeClass("treeTable-highlight");
                    }
                })
            };

            // 渲染表格
            tableIns = table.render(param);
            if ($(".layui-table-fixed").length>0){
                $(".layui-table-fixed table th").each(function () {
                    var field = $(this).attr("data-field");
                    var dataKey = $(this).attr("data-key");
                    var rowspan = $(this).attr("rowspan");
                    if (field!=0 && rowspan){
                        var height = $(".layui-table-header:eq(0) th[data-field="+field+"][data-key="+dataKey+"]").height();
                        if (height<0){
                            $(this).height((39*rowspan-2)-10);
                        }
                    }
                })
            }

            function checkParent(checked,checkId,parentCheckId,checkIds) {
                if (checked){
                    var $pid = $("[lay-tid="+parentCheckId+"]");
                    if ($pid.length>0){
                        var tid = $pid.attr("lay-tid");
                        checkIds.push(tid);
                        parentCheckId = $pid.attr("lay-tpid");
                        if (parentCheckId!=param.treeSpid) {
                            checkParent(checked,tid,parentCheckId,checkIds);
                        }
                    }
                } else{//判断取消时，兄弟节点是否还有选中，没有则把父类取消
                    var $pid = $("[lay-tid="+parentCheckId+"]");
                    var checkCount = 0;
                    $("[lay-tpid="+parentCheckId+"]").each(function () {
                        var id = $(this).attr("lay-tid");
                        if (id!=checkId){
                            var index = $("[lay-tid="+id+"]").parents("tr").attr("data-index");
                            var checked = $('tr[data-index=' + index + '] input[type="checkbox"]').is(":checked");
                            if(checked){
                                checkCount++;
                            }
                        }
                    });
                    if (checkCount==0) {
                        checkIds.push(parentCheckId);
                        checkId = parentCheckId;
                        parentCheckId = $pid.attr("lay-tpid");
                        if ($("[lay-tpid="+parentCheckId+"]").length >0) {
                            checkParent(checked,checkId,parentCheckId,checkIds);
                        }
                    }
                }
                return checkIds;
            }

            function checkChild(checkId,checkIds) {
                //获取所有子节点
                var $cid = $("[lay-tpid="+checkId+"]");
                if ($cid.length>0){
                    $cid.each(function () {
                        var id = $(this).attr("lay-tid");
                        checkIds.push(id);
                        $cid = $("[lay-tpid="+id+"]");
                        if ($cid.length>0){
                            checkChild(id,checkIds);
                        }
                    })
                }
                return checkIds;
            }

            function treeLinkChecked(checked,checkId,tableData,checkIds) {
                var $tid = $("[lay-tid="+checkId+"]");
                var checkParentId = $tid.attr("lay-tpid");
                if (checked){//选中
                    //treeLinkChild 子联动父节点选中  //treeLinkParent 父联动子节点都选中
                    if (param.hasOwnProperty("treeLinkChild") && param.treeLinkChild) {
                        checkParent(checked, checkId, checkParentId, checkIds);
                        checkIds.push(checkId);
                        treetable.checked(tableData,checkIds)
                    }
                    if (param.hasOwnProperty("treeLinkParent") && param.treeLinkParent) {
                        checkChild(checkId, checkIds);
                        checkIds.push(checkId);
                        treetable.checked(tableData,checkIds)
                    }
                }else{
                    if (param.hasOwnProperty("treeLinkChild") && param.treeLinkChild) {
                        checkParent(checked, checkId, checkParentId, checkIds);
                        checkIds.push(checkId);
                        treetable.unchecked(tableData, checkIds);
                    }
                    if (param.hasOwnProperty("treeLinkParent") && param.treeLinkParent) {
                        checkChild(checkId, checkIds);
                        checkIds.push(checkId);
                        treetable.unchecked(tableData, checkIds);
                    }
                }
            }

            //监听表格选中事件
            for(var key in table.cache){
                var filterName = $("#"+key).attr("lay-filter") || "";
                var tableData = table.cache[key];
                // 解决全选后,点击第一行数据无法获取到值的问题
                var checkRow = {};
                layui.table.on('row('+filterName+')', function(obj) {
                    checkRow = obj.data;
                });

                table.on('checkbox('+filterName+')', function(obj){
                    if(obj.type == 'all') {
                        // 复选框全选切换
                        tableData.forEach(function (item) {
                            item.checked = obj.checked;
                            item.LAY_CHECKED = obj.checked;
                        });
                    }
                    var type = obj.type;
                    if (type=='one'){
                        var checked = obj.checked; //当前是否选中状态
                        var checkId = obj.data[param.treeIdName];
                        // 单行复选框切换,解决全选后,点击第一行数据无法获取到值的问题（当单行和全选同时 选中行数据解决采用行监听事件获取 ）
                        if(!obj.data[param.treeIdName]) {
                            tableData.forEach(function(item) {
                                if (item[param.treeIdName] === checkRow[param.treeIdName] && item.pid === checkRow.pid) {
                                    item.checked = obj.checked;
                                    item.LAY_CHECKED = obj.checked;
                                    checkId = item[param.treeIdName];
                                }
                            })
                        }
                        if (param.hasOwnProperty("treeLinkChecked") && param.treeLinkChecked) {//开启联动选中
                            treeLinkChecked(checked, checkId, tableData, []);
                        }
                        //操作结束，判断是否全选
                        if($('tr[data-index] input[type="checkbox"]').not(":checked").length==0){
                            $('[lay-filter=layTableAllChoose]').prop('checked', true);
                            $('[lay-filter=layTableAllChoose]').next().addClass('layui-form-checked');
                        }else{
                            $('[lay-filter=layTableAllChoose]').prop('checked', false);
                            $('[lay-filter=layTableAllChoose]').next().removeClass('layui-form-checked');
                        }
                    }
                });
            }

        },
        // 计算缩进的数量
        getEmptyNum: function (pid, data) {
            var num = 0;
            if (!pid) {
                return num;
            }
            var tPid;
            for (var i = 0; i < data.length; i++) {
                if (pid == data[i].id) {
                    num += 1;
                    tPid = data[i].pid;
                    break;
                }
            }
            return num + treetable.getEmptyNum(tPid, data);
        },
        // 展开/折叠行
        toggleRows: function ($dom, linkage) {
            var type = $dom.attr('lay-ttype');
            if ('file' == type) {
                return;
            }
            var mId = $dom.attr('lay-tid');
            var isOpen = $dom.hasClass('open');
            if (isOpen) {
                $dom.removeClass('open');
            } else {
                $dom.addClass('open');
            }
            $dom.closest('tbody').find('tr').each(function () {
                var $ti = $(this).find('.treeTable-icon');
                var pid = $ti.attr('lay-tpid');
                var ttype = $ti.attr('lay-ttype');
                var tOpen = $ti.hasClass('open');
                var index = $(this).attr("data-index");
                if (mId == pid) {
                    if (isOpen) {
                        $(this).parents("tbody").find("tr[data-index="+index+"]").hide();
                        $(".layui-table-fixed").find("tr[data-index="+index+"]").hide();
                        $(".layui-table-main").find("tr[data-index="+index+"]").hide();
                        if ('dir' == ttype && tOpen == isOpen) {
                            $ti.trigger('click');
                        }
                    } else {
                        $(this).parents("tbody").find("tr[data-index="+index+"]").show();
                        $(".layui-table-fixed").find("tr[data-index="+index+"]").show();
                        $(".layui-table-main").find("tr[data-index="+index+"]").show();
                        if (linkage && 'dir' == ttype && tOpen == isOpen) {
                            $ti.trigger('click');
                        }
                    }
                }
            });
        },
        // 检查参数
        checkParam: function (param) {
            if (!param.treeSpid && param.treeSpid != 0) {
                layer.msg('参数treeSpid不能为空', {icon: 5});
                return false;
            }

            if (!param.treeColIndex && param.treeColIndex != 0) {
                layer.msg('参数treeColIndex不能为空', {icon: 5});
                return false;
            }
            return true;
        },
        // 展开所有
        expandAll: function (dom) {
            $(dom).next('.treeTable').find('.layui-table-body tbody tr').each(function () {
                var $ti = $(this).find('.treeTable-icon');
                var ttype = $ti.attr('lay-ttype');
                var tOpen = $ti.hasClass('open');
                if ('dir' == ttype && !tOpen) {
                    $ti.trigger('click');
                }
            });
        },
        // 展开所有
        expand: function (ids) {
            if (ids && ids.length>0){
                for (var i in ids){
                    var id = ids[i];
                    var $ti = $('.treeTable-icon[lay-tid='+id+']');
                    //获取父类Id
                    var parentId = $ti.attr("lay-tpid");
                    if (parentId!='0'){
                        //展开父节点
                        var parent = $('.treeTable-icon[lay-tid='+parentId+']');
                        var ttype = parent.attr('lay-ttype');
                        var tOpen = parent.hasClass('open');
                        if ('dir' == ttype && !tOpen) {
                            parent.trigger('click');
                        }
                        this.expand([parentId]);
                    }else{
                        //没有父类展开自己
                        var ttype = $ti.attr('lay-ttype');
                        var tOpen = $ti.hasClass('open');
                        if ('dir' == ttype && !tOpen) {
                            $ti.trigger('click');
                        }
                    }
                }
            }
        },
        // 折叠所有
        foldAll: function (dom) {
            $(dom).next('.treeTable').find('.layui-table-body tbody tr').each(function () {
                var $ti = $(this).find('.treeTable-icon');
                var ttype = $ti.attr('lay-ttype');
                var tOpen = $ti.hasClass('open');
                if ('dir' == ttype && tOpen) {
                    $ti.trigger('click');
                }
            });
        },
        reload:function(param){
            var options = $.extend(treetable.params, param);
            treetable.render(options);
        },
        checked:function (data,ids) {
            if (ids && ids.length>0 && data && data.length>0){
                //可以自行添加判断的条件是否选中
                //这句才是真正选中，通过设置关键字LAY_CHECKED为true选中，这里只对第一行选中
                for (var i in data){
                    var treeId = data[i][treetable.params.treeIdName];
                    if (ids.indexOf(treeId)!=-1){
                        if (data[i].hasOwnProperty("LAY_TABLE_INDEX")){
                            data[i]["LAY_CHECKED"]=true;
                            data[i]["checked"]=true;
                            //下面三句是通过更改css来实现选中的效果
                            var index= data[i]['LAY_TABLE_INDEX'];
                            $('tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                            $('tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                        }
                    }
                }
                for(var key in table.cache){
                    layui.$.extend(table.cache[key], data);
                }
            }
        },
        unchecked:function (data,ids) {
            if (ids && ids.length>0 && data && data.length>0){
                //可以自行添加判断的条件是否选中
                //这句才是真正选中，通过设置关键字LAY_CHECKED为true选中，这里只对第一行选中
                for (var i in data){
                    var treeId = data[i][treetable.params.treeIdName];
                    if (ids.indexOf(treeId)!=-1){
                        if (data[i].hasOwnProperty("LAY_TABLE_INDEX")){
                            data[i]["LAY_CHECKED"]=false;
                            data[i]["checked"]=false;
                            //下面三句是通过更改css来实现选中的效果
                            var index= data[i]['LAY_TABLE_INDEX'];
                            $('tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', false);
                            $('tr[data-index=' + index + '] input[type="checkbox"]').next().removeClass('layui-form-checked');
                        }
                    }
                }
                for(var key in table.cache){
                    layui.$.extend(table.cache[key], data);
                }
            }
        },
        checkNodes:function () {
            var result = [];
            for(var key in table.cache){
                for (var i in table.cache[key]){
                    var data = table.cache[key][i];
                    if (data.hasOwnProperty("LAY_CHECKED") && (data.LAY_CHECKED==true || data.LAY_CHECKED=='true')){
                        result.push(data);
                    }
                }
            }
            return result;
        },
        getRowIndexs:function(id,indexs){//获取
            var index = $("[lay-tid="+id+"]").parents("tr").attr("data-index");
            if (typeof indexs==="undefined"){
                return [index];
            }
            if ($("[lay-tpid="+id+"]").length>0) {
                if(!(indexs.indexOf(index)!=-1)){
                    indexs.push(index);
                }
                $("[lay-tpid="+id+"]").each(function () {
                    var tid = $(this).attr("lay-tid");
                    treetable.getRowIndexs(tid,indexs);
                })
            }else{
                if(!(indexs.indexOf(index)!=-1)){
                    indexs.push(index);
                }
            }
            return indexs.sort(function(a, b) { return b - a});
        }
    };

    layui.link('/layuiadmin/lib/treetable/treetable.css');

    // 给图标列绑定事件
    $('body').on('click', '.treeTable .treeTable-icon', function () {
        var treeLinkage = $(this).parents('.treeTable').attr('treeLinkage');
        if ('true' == treeLinkage) {
            treetable.toggleRows($(this), true);
        } else {
            treetable.toggleRows($(this), false);
        }
    });

    exports('treetable', treetable);
});
