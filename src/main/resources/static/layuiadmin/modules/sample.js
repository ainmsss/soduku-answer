/**

 @Name：layuiAdmin 主页示例
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：GPL-2

 */

layui.define(function (exports) {
    var admin = layui.admin;
    //回复留言
    admin.events.replyNote = function(othis){
        var nid = othis.data('id');
        var nindex = othis.data('index');

        var notifyData = notifyList[nindex];

        var dialog=layer.open({
            type: 2 //此处以iframe举例
            ,title: '查 看'
            ,area:['1200px','550px']
            ,shade: 0.5
            ,maxmin: true
            ,content: ['/oa/notify/read/'+ nid]
            ,zIndex: layer.zIndex //重点1
            ,btn: ['取 消'] //只是为了演示
            ,yes: function (index, layero) {
                layer.closeAll();
            }
            ,success: function(layero,index){
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                iframeWin.setData(notifyData);
                layer.setTop(layero); //重点2
            }
        });
        layer.full(dialog);
    };

    exports('sample', {})
});