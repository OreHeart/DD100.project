//拖拽窗口函数
$(function () {
    $(".print").Tdrag({scope: "html"});

    $(".z_calib_item").click(function () {
        $(".z_calib_item_active").removeClass("z_calib_item_active");
        $(this).addClass("z_calib_item_active");
    });

    $("#wifi-control").click(function () {
        $("#wifi-password").hide();
    });

    $("#wifi-cancel").click(function () {
        $("#wifi").toggle();
        $("#wifi-password").hide();
    });

    $("#wifi-password-control").click(function () {
        $("#wifi-password").show();
    });

    $("#wifi-password-cancel").click(function () {
        $("#wifi-password").hide();
        return false;
    });

    $("#wifi-password-connect").click(function () {
        $(".WifiSSID-need").val($(".wifi-connect .WifiSSID").val());
        $(".WifiType-need").val($(".wifi-connect .WifiType").val());
        let fd = {
            "WifiSSID": $(".wifi-connect .WifiSSID").val(),
            "WifiType": $(".wifi-connect .WifiType").val(),
            "WifiPass": $(".wifi-pass").val()
        };
        $.ajax({
            url: "/wifi/connect",
            data: fd,
            type: "POST",
            async: false,
            success: (data) => {
                console.log(data);
            }
        });
        $("#wifi-password").hide();
        $("#wifi-break").show();
        return false;
    });

    $("#wifi-break-ok").click(function(){
        $("#wifi-break").hide();
    });

    $(".wifi-items").click(function () {
        $(".wifi-items").removeClass("wifi-connect");
        $("#wifi-password").hide();
        $(this).addClass("wifi-connect");
    });

    $(".plate-type").click(function () {
        $(".plate-type").each(function(){
                $(this).removeClass("btn-info").addClass("btn-default")
        });
        $(this).addClass("btn-info");
    });

    $(".boundaries-button a").click(function(){
        $(".boundaries-button a").each(function(){
            $(this).removeClass('btn-warning');
        });
        $(this).addClass('btn-warning');
    });

    $(".full-white-button a").click(function(){
        $(".full-white-button a").each(function(){
            $(this).removeClass('btn-warning');
        });
        $(this).addClass('btn-warning');
    });

    $(".greater-than-0").blur(function(){
        if(isNaN($(this).val()) || $(this).val() < 0){
            $(this).val('0');
        }
    });
});

//显示Plate页面按钮函数
function show_action_button(id) {
    $(".plate-list-item-button").each(function () {
        if ("plate-action-" + id != $(this).attr('id')) {
            $(this).hide();
        }
    });

    $("#plate-action-" + id).toggle();
}

//显示一级弹出窗口函数
function show_time(id, id_1) {
    var popid = "";
    $(".pop_window").each(function () {
        popid = $(this).attr("id");
        if (id_1) {
            if (popid != id && popid != id_1) {
                $(this).hide();
            }
        } else {
            if (popid != id) {
                $(this).hide();
            }
        }

    });

    $("#" + id).toggle();
    if (id_1) {
        $("#" + id_1).toggle();
    }
}

//显示弹出窗口函数
function close_pop(id, id_1, id_2) {
    $(id).hide();
    if (id_1) {
        $(id_1).hide();
    }
    if (id_2) {
        $(id_2).hide();
    }
}

//打开二级弹出窗口函数
function open_pop(id) {
    $(id).show();
}