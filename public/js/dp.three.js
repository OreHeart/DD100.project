/* 上次的模型加载状态 */
let lastModelExisted;

/* 当前模型加载状态 */
let modelExisted;

let lastModelPosition = null;

let lastModelRotation = null;

/* 原始缩放比例，默认为1 */
let currentScale = {"x_factor": 1, "y_factor": 1, "z_factor": 1};

let modelActionDetective = null;

$(function() {
    dp_model_checker_init();
    dp_tool_init();
});

/**
 * FUNCTION: dp_model_check_init
 *
 * DESCRIPTION: 启用定时器更新模型加载情况
 */
function dp_model_checker_init() {

    setInterval(() => {
        lastModelExisted = modelExisted;
        if (G[J] !== undefined) {
            modelExisted = true;
        } else {
            modelExisted = false;
        }
        update_tool_window();
    }, 500);
}

/**
 * FUNCTION: apply_model_constrains
 *
 * DESCRIPTION: 对大尺寸模型进行缩小处理
 */
function apply_model_constrains() {
    let box = get_model_size();
    if (box["width"] > 120 || box["height"] > 68 || box["length"] > 150) {
        let targetFactor = Math.min.apply(null, [120.0 / box["width"], 68.0 / box["height"], 150.0 / box["length"]]);
        G[J].geometry.scale(targetFactor, targetFactor, targetFactor);
    }
}

/**
 * FUNCTION: update_tool_window
 *
 * DESCRIPTION: 根据是否已经载入模型来决定Tool的显示
 */
function update_tool_window() {
    if (modelExisted) {
        $("#items").show();
        if (!lastModelExisted) {

            apply_model_constrains();

            reset_model_position();
            reset_model_scale();
            reset_model_rotation();

            set_model_position_view(0, 0, - (G[J].geometry.boundingBox.min.z).toFixed(1));
            set_model_scale_view(1, 1, 1);
            set_model_rotation_view(0, 0, 0);

            $("#menu_item_preview").parent().removeClass("disabled");
            $("#menu_item_slicing").parent().removeClass("disabled");
            $("#menu_item_print").parent().removeClass("disabled");
            $("#menu_item_export").parent().removeClass("disabled");

            enable_tool_view();
        }

        if (!modelActionDetective) {
            modelActionDetective = setInterval(() => {
                if (lastModelPosition !== G[J].position) {
                    set_model_position_view(G[J].position.x.toFixed(1), G[J].position.y.toFixed(1), G[J].position.z.toFixed(1));
                    lastModelPosition = G[J].position;
                }
                if (lastModelRotation !== G[J].rotation) {
                    set_model_rotation_view(G[J].rotation.x, G[J].rotation.y, G[J].rotation.z);
                    lastModelRotation = G[J].rotation;
                }
            }, 500);
        }
    } else {
        if (modelActionDetective) {
            clearInterval(modelActionDetective);
        }

        set_model_position_view(0, 0, 0);
        set_model_scale_view(1, 1, 1);
        set_model_rotation_view(0, 0, 0);

        $("#menu_item_preview").parent().addClass("disabled");
        $("#menu_item_slicing").parent().addClass("disabled");
        $("#menu_item_print").parent().addClass("disabled");
        $("#menu_item_export").parent().addClass("disabled");

        disable_tool_view();

        $("#items").hide();
    }
}

function enable_tool_view() {
    $(".tool-group input").each(function() {
        $(this).removeAttr("disabled");
    });
    $("#tool_move_center").removeAttr("disabled");
    $("#tool_move_reset").removeAttr("disabled");
    $("#tool_scale_reset").removeAttr("disabled");
    $("#tool_rotate_reset").removeAttr("disabled");
    $("#tool_apply").removeAttr("disabled");
}

function disable_tool_view() {
    $(".tool-group input").each(function() {
        $(this).attr("disabled", true);
    });
    $("#tool_move_center").attr("disabled", "disabled");
    $("#tool_move_reset").attr("disabled", "disabled");
    $("#tool_scale_reset").attr("disabled", "disabled");
    $("#tool_rotate_reset").attr("disabled", "disabled");
    $("#tool_apply").attr("disabled", "disabled");
}

/**
 * FUNCTION: dp_tool_init
 *
 * DESCRIPTION: 注册Tool中的控件事件
 */
function dp_tool_init() {

    $(".tool_move_group input").each(function() {
        $(this).on("keyup", function() {
            set_model_position($("#tool_move_x").val(), $("#tool_move_y").val(), $("#tool_move_z").val());
        });
    });
    $(".tool_scale_group input").each(function() {
        $(this).on("keyup", function() {
            if ($("#keep_scale_ratio").prop("checked")) {
            }
            set_model_scale($("#tool_scale_x").val(), $("#tool_scale_y").val(), $("#tool_scale_z").val());
        });
    });
    $(".tool_rotate_group input").each(function() {
        $(this).on("keyup", function() {
            set_model_rotation($("#tool_rotate_x").val(), $("#tool_rotate_y").val(), $("#tool_rotate_z").val());
        });
    });

    $("#tool_move_center").on("click", () => {
        reset_model_position();
        set_model_position_view(0, 0, - (G[J].geometry.boundingBox.min.z).toFixed(1));
    });

    $("#tool_move_reset").on("click", () => {
        reset_model_position();
        set_model_position_view(0, 0, - (G[J].geometry.boundingBox.min.z).toFixed(1));
    });
    $("#tool_scale_reset").on("click", () => {
        reset_model_scale();
        set_model_scale_view(1, 1, 1);
    });
    $("#tool_rotate_reset").on("click", () => {
        reset_model_rotation();
        set_model_rotation_view(0, 0, 0);
    });
}

function reset_model_position() {
    if (modelExisted) {
        G[J].position.set(0, 0, - G[J].geometry.boundingBox.min.z);
    }
}

function reset_model_scale() {
    if (modelExisted) {
        G[J].geometry.scale(1 / currentScale["x_factor"], 1 / currentScale["y_factor"], 1 / currentScale["z_factor"]);
    }
}

function reset_model_rotation() {
    if (modelExisted) {
        G[J].rotation.set(0, 0, 0);
    }
}

function set_model_position_view(x, y, z) {
    $("#tool_move_x").val(x);
    $("#tool_move_y").val(y);
    $("#tool_move_z").val(z);
}

function set_model_scale_view(x_factor, y_factor, z_factor) {
    $("#tool_scale_x").val(x_factor);
    $("#tool_scale_y").val(y_factor);
    $("#tool_scale_z").val(z_factor);
}

function set_model_rotation_view(x, y, z) {
    $("#tool_rotate_x").val(x);
    $("#tool_rotate_y").val(y);
    $("#tool_rotate_z").val(z);
}

function set_model_position(x, y, z) {
    if (modelExisted) {
        G[J].position.set(x, y, z);
    }
}

function set_model_scale(x_factor, y_factor, z_factor) {
    if (modelExisted) {
        G[J].geometry.scale(x_factor / currentScale["x_factor"], y_factor / currentScale["y_factor"], z_factor / currentScale["z_factor"]);
        currentScale["x_factor"] = x_factor;
        currentScale["y_factor"] = y_factor;
        currentScale["z_factor"] = z_factor;
    }
}

function set_model_rotation(x_angle, y_angle, z_angle) {
    if (modelExisted) {
        let unit_radian = Math.PI / 180;
        G[J].rotation.set(x_angle * unit_radian, y_angle * unit_radian, z_angle * unit_radian);
    }
}

function get_model_size() {
    return Wa(J);
}