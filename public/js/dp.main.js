let plates;
let profiles;
let machine;
let currentPlateID;
let currentPlateName;
let currentSTLPath;
let currentLayerID = 1;
let currentLayersInfo;
let processingPlateID;
let processed;
let layersCount;
let currentMode = "plate";
let profileId2Idx = {};

$(function () {
    global_init();
    dp_resin_init();
    dp_load_init();
    //dp_plate_init();
    dp_slicing_init();
    dp_operation_init();
    dp_mode_checker_init();
    dp_init();
});

function dp_mode_checker_init() {
    setInterval(function () {
        if (currentMode === "plate") {
            $("#items .copy").css("visibility", "visible");
        } else {
            $("#items .copy").css("visibility", "hidden");
        }
    }, 500);
}

function global_plates_init() {
    $.ajax({
        url: "json/db/plates.json",
        type: "GET",
        dataType: "json",
        async: false,
        timeout: 500
    }).done((data) => {
        plates = data;
    });
}

function global_profiles_init() {
    $.ajax({
        url: "json/db/profiles.json",
        type: "GET",
        dataType: "json",
        async: false,
        timeout: 500
    }).done((data) => {
        profiles = data;
        for (idx in profiles) {
            let profile = profiles[idx];
            profileId2Idx[profile["ProfileID"]] = idx;
        }
    });
}

function global_machines_init() {
    $.ajax({
        url: "json/db/machine.json",
        type: "GET",
        dataType: "json",
        async: false,
        timeout: 500
    }).done((data) => {
        machine = data;
    });
}

function global_init() {
    global_profiles_init();
    global_plates_init();
    global_machines_init();
}

function dp_slicing_init() {
    setInterval(function () {
        slicer_progress();
    }, 1000);
}

function slicer_progress() {
    $.ajax({
        url: '/slicer',
        dataType: 'json',
        type: 'GET',
        timeout: 500
    }).done((data) => {
        if (data["url"] !== "") {
            $.ajax({
                url: data["url"] + '/slicer',
                dataType: 'json',
                type: 'GET',
                timeout: 500
            }).done((d) => {
                data["layerID"] = d["layerID"];
                data["running"] = 1;
                update_slicer_progress(data);
            });
        } else {
            update_slicer_progress(data);
        }
    });
}

function update_slicer_progress(data) {
    processingPlateID = data["plateID"];
    if (currentPlateID === processingPlateID) {
        $(".slicing_task_info").text("File: " + currentPlateName);
        $(".slicing_task_status").text("Status: Processing...(" + data["layerID"] + ' of ' + layersCount + ')');
        $(".progress-bar").css("width", data["layerID"] * 100 / layersCount + "%");
    } else if (data["running"] === "0" && data["layerID"] !== "0") {
        $(".slicing_task_info").text("File: " + currentPlateName);
        $(".slicing_task_status").text("Status: Processed!");
        $("#save_to_dev").removeAttr("disabled");
    }
}

function dp_resin_init() {
    $(".resin-list").empty();
    $(".resin-list").append('<div class="row resin-list-title"><div class="col-md-1">ID</div><div class="col-md-3">Title</div><div class="col-md-2">Layer Thickness</div><div class="col-md-2">Cure Time</div><div class="col-md-1">Default</div><div class="col-md-3">Action</div></div>');
    for (let idx in profiles) {
        let profile = profiles[idx];
        $(".resin-list").append(
            '<div class="row resin-list-content">' +
            '<div class="col-md-1">' + profile["ProfileID"] + '</div>' +
            '<div class="col-md-3">' + profile["Title"] + '</div>' +
            '<div class="col-md-2">' + profile["Depth"] + '</div>' +
            '<div class="col-md-2">' + profile["CureTime"] + '</div>' +
            '<div class="col-md-1">' +
            '<a class="profile_list_button btn btn-success" href="/profile/default/' + profile["ProfileID"] + '">Default</a>' +
            '</div>' +
            '<div class="col-md-3">' +
            '<button class="profile_list_button btn btn-warning resin-edit-control" onclick="open_pop(\'#resin_edit\');">Edit</button>&nbsp;' +
            '<a class="profile_list_button btn btn-danger" href="/profile/delete/' + profile["ProfileID"] + '">Delete</a>&nbsp;' +
            '<a class="profile_list_button btn btn-success" href="/profile/export/' + profile["ProfileID"] + '">Export</a>' +
            '</div>' +
            '</div>'
        )
    }
}

function dp_load_init() {
    $("#load_profile_list").empty();
    for (let idx in profiles) {
        let profile = profiles[idx];
        $("#load_profile_list").append('<option value="' + profile["ProfileID"] + '">' + profile["Title"] + '</option>');
    }
}

function dp_plate_init() {
    $("#search_plate").off("keyup").on("keyup", () => {
        let keyword = $("#search_plate").val().toLowerCase();
        $(".plate-list").each(function() {
            if ($(this).find("#plate_name").text().toLowerCase().indexOf(keyword) === -1) {
                $(this).addClass("hide");
            } else {
                $(this).removeClass("hide");
            }
        });
    });

    $(".plate-group").empty();

    for (let idx in plates) {
        let plate = plates[idx];
        let profileInfo;
        if (profileId2Idx[plate["ProfileID"]]) {
            profileInfo = '<p>Profile: ' + profiles[profileId2Idx[plate["ProfileID"]]]["Title"] + '</p>';
        } else {
            profileInfo = '<p>Warning: The profile used by this plate has been removed!</p>';
        }
        $(".plate-group").append(
            '<div class="container-fluid plate-list" id="plate-list-item-' + plate["PlateID"] + '">' +
            '<div class="plate-list-item">' +
            '<div onclick="show_action_button(' + plate["PlateID"] + ')">' +
            '<div class="row plate-list-item-title text-center">' +
            '<div class="col-md-2">' + plate["PlateID"] + '</div>' +
            '<div class="col-md-1">|</div>' +
            '<div id="plate_name" class="col-md-9">' + plate["Path"] + '</div>' +
            '</div>' +
            '<div class="row plate-list-item-content">' +
            '<div class="col-md-12">' +
            '<p>Model Size: ' + (plate["Xmax"] - plate["Xmin"]).toFixed(1) + ' mm  ' + (plate["Ymax"] - plate["Ymin"]).toFixed(1) + ' mm  ' + (plate["Zmax"] - plate["Zmin"]).toFixed(1) + ' mm</p>' +
            profileInfo +
            '<p>Layer CureTime: ' + profiles[profileId2Idx[plate["ProfileID"]]]["CureTime"] + ' s</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row plate-list-item-action">' +
            '<div class="col-md-12 text-right plate-list-item-button" id="plate-action-' + plate["PlateID"] + '">' +
            '<button class="plate_list_item_button btn btn-primary" onclick="on_apply_plate(' + plate["PlateID"] + ', \'' + plate["Path"] + '\', ' + plate["Processed"] + ', ' + plate["LayersCount"] + ');">3D View</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
            '<button class="plate_list_item_button btn btn-warning" onclick="on_edit_plate(' + plate["PlateID"] + ');">Edit</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
            '<button class="plate_list_item_button btn btn-danger ask" data-ask="delete_plate_confirm" onclick="on_delete_plate(' + plate["PlateID"] + ')">Delete</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
            '<a class="plate_list_item_button btn btn-success" href="/plate/download/' + plate["PlateID"] + '">Download</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    }
}

function update_plate_window() {
    global_plates_init();
    //dp_plate_init();
}

function dp_operation_init() {
    $("#send_gcode").on("click", () => {
        $.post("/term-io",{"gcode": $("#gcode").val()});
        $("#gcode").val("").focus();
    });
    $("#z_up").on("click", () => {$.get("/z-axis/move/up/micron/" + $(".z_calib_item_active").attr("value"));});
    $("#home").on("click", () => {$.get("/z-axis/bottom");});
    $("#z_down").on("click", () => {$.get("/z-axis/move/down/micron/" + $(".z_calib_item_active").attr("value"));});
}


function dp_init() {
    let stlPath = get_query_value("src");
    if (stlPath !== null) {
        let plateID = stlPath.split('/')[3];
        currentPlateID = plateID;
        currentPlateName = get_query_value("name");
        currentSTLPath = "/static/plates/" + plateID + "/plate.stl";
        processed = get_query_value("sliced");
        layersCount = get_query_value("layers");

        $(".progress-bar").css("width", "0%");

        $("#menu_item_slicing").on('click', () => {
            if (processingPlateID !== currentPlateID) {
                $.get("/plate/regenerate/" + currentPlateID);
            }
            show_time('slicing');
        });

        $("#menu_item_export").on('click', () => {
            saveAs(Za(), "export.stl");
        });


        $("#display-prev-layer").on("click", () => {
            if (currentLayerID > 1) {
                --currentLayerID;
                update_preview_window();
            }
        });
        $("#display-next-layer").on("click", () => {
            if (currentLayerID < layersCount) {
                ++currentLayerID;
                update_preview_window();
            }
        });

        $.ajax({
            url: "/static/plates/" + currentPlateID + "/info.json",
            type: "GET",
            dataType: "json",
            async: false,
            timeout: 500
        }).done((data) => {
            currentLayersInfo = data;
        });
        $(".preview_slider input").attr("max", layersCount);
        $(".preview_slider input").attr("value", currentLayerID);
        $(".preview_slider input").on("change keypress", () => {
            currentLayerID = $(".preview_slider input").val();
            update_preview_window();
        });
        update_preview_window();
    }
}

function update_preview_window() {
    $(".preview-title").text("Preview Layers of Plate " + currentPlateName);
    $(".preview-panel").html('<img style="width:100%; height:100%;" src="/static/plates/' + currentPlateID + '/' + currentLayerID + '.png">');
    $("#currentLayer").text(currentLayerID);
    $.each(currentLayersInfo[currentLayerID-1],function(k, v){
        $("#"+k).html(v);
    });
}

function on_click_menu_item(itemName) {
    $("#sidebar").hide();
    show_time(itemName);
}

function on_click_sidebar_item(itemName) {
    let targetId = "sidebar_" + itemName + "_img";
    $(".sidebar_img_wrapper").each(function () {
        if ($(this).children("img").attr("id") === targetId && !$(this).children("img").hasClass("selected_sidebar_item")) {
            $(this).children("img").addClass("selected_sidebar_item");
        } else {
            $(this).children("img").removeClass("selected_sidebar_item");
        }
    });

    if (itemName === "support") {
        enter_mode("support");
        show_time('support');
    } else {
        enter_mode("plate");
        show_time(itemName);
    }
}

function on_click_close(modalName) {
    $("#sidebar_" + modalName + "_img").removeClass("selected_sidebar_item");

    if (modalName === "support") {
        close_pop('#support', '#support_add_box');
        enter_mode("plate");
    } else if(modalName === "plate"){
        close_pop('#plate', '#plate_edit');
    }else {
        close_pop('#' + modalName);
    }
}

function enter_mode(modeName) {
    if (currentMode !== modeName) {
        Ra_dp(modeName);
        currentMode = modeName;
    }
}

function on_load_plate() {
    let fd = new FormData($(".support")[0]);
    $.ajax( {
        url: "/plate/add",
        data: fd,
        type: "POST",
        processData: false,
        contentType: false,
        async: false,
        success: (data) => {}
    });
    update_plate_window();

}

function on_edit_plate(PlateID,Path,AutoCenter,StopLayers,LowQualityLayerNumber,ImageRotate,MaskEffect) {
    open_pop("#plate_edit");
    console.log(PlateID,Path,AutoCenter,StopLayers,LowQualityLayerNumber,ImageRotate,MaskEffect);
    $("#Path1").val(Path);
    $("#AutoCenter").val(AutoCenter);
    $("#StopLayers").val(StopLayers);
    $("#LowQualityLayerNumber").val(LowQualityLayerNumber);
    $("#ImageRotate").val(ImageRotate);
    $("#plate_edit_submit").click(function (){
        let fd = new FormData($("#plate_form")[0]);
        /*let fd = {
            "Path": $("#Path"+plateID).val(),
            "ProfileID": $("#ProfileID_"+plateID).val(),
            "AutoCenter": $("#AutoCenter_"+plateID).val(),
            "StopLayers": $("#StopLayers_"+plateID).val(),
            "LowQualityLayerNumber": $("#LowQualityLayerNumber_"+plateID).val(),
            "ImageRotate": $("#ImageRotate_"+plateID).val()
        }*/
        console.log(PlateID);
        $.ajax({
            url: "/plate/edit/"+PlateID,
            data: fd,
            type: "POST",
            async: false,
            success: (data) => {
                console.log(data);
            }
        });
        return false;
    });
}



function on_delete_plate(plateID) {
    $.ajax({
        url: "/plate/delete/" + plateID,
        type: "GET",
        async: false
    });
    update_plate_window();
    if (plateID == currentPlateID) {
        window.location.href = "/";
    }
}

function on_apply_plate(plateID, plateName, processed, layersCount) {
    window.location.href = "?src=/static/plates/" + plateID + "/plate.stl&name=" + plateName + "&sliced=" + processed + "&layers=" + layersCount;
}

function get_query_value(key) {
    let query = window.location.search.substring(1);
    let kvs = query.split("&");
    for (let i = 0; i < kvs.length; ++i) {
        let kv = kvs[i].split("=");
        if (kv[0] === key) return kv[1];
    }
    return null;
}