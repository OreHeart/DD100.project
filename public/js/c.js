
var aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
        if (c.get || c.set) throw new TypeError("ES3 does not support getters and setters.");
        a != Array.prototype && a != Object.prototype && (a[b] = c.value)
    },
    ba = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;

function ca(a, b) {
    if (b) {
        for (var c = ba, d = a.split("."), e = 0; e < d.length - 1; e++) {
            var f = d[e];
            f in c || (c[f] = {});
            c = c[f]
        }
        d = d[d.length - 1];
        e = c[d];
        f = b(e);
        f != e && null != f && aa(c, d, {configurable: !0, writable: !0, value: f})
    }
}

ca("Array.prototype.find", function (a) {
    return a ? a : function (a, c) {
        var b;
        a:{
            b = this;
            b instanceof String && (b = String(b));
            for (var e = b.length, f = 0; f < e; f++) {
                var g = b[f];
                if (a.call(c, g, f, b)) {
                    b = g;
                    break a
                }
            }
            b = void 0
        }
        return b
    }
});
ca("Array.prototype.fill", function (a) {
    return a ? a : function (a, c, d) {
        var b = this.length || 0;
        0 > c && (c = Math.max(0, b + c));
        if (null == d || d > b) d = b;
        d = Number(d);
        0 > d && (d = Math.max(0, b + d));
        for (c = Number(c || 0); c < d; c++) this[c] = a;
        return this
    }
});

function h() {
}

function k() {
}

function m() {
}

function n() {
}

function p() {
}

function q() {
}

function r() {
}

function da() {
}

function ea() {
}

var t = 0, u = 0, v, A, ga = !1;

function C() {
}

/**
 * 初始化参数
 * M： 字符串/key数组
 * J： 最后一个模型索引
 */
var D = 0, E = 0, F = "", G = [], H = [], J = -1, ha = !1, ia = {x: 0, y: 0}, K = [], M = [], N = [], O = 0, P = null,
    Q, T, U;
$(function () {
    ja();
    ka();
    la()
});

function ka() {
    if ($("#view_3d").length) {
        ma();
        na();
        oa();
        pa();
        qa();
        ra();
        sa();
        ta();
        h = new THREE.Scene;
        p = new THREE.Raycaster;
        D = window.innerWidth;
        E = window.innerHeight;
        m = new THREE.WebGLRenderer({antialias: !0});
        m.setSize(D, E);
        m.setPixelRatio(window.devicePixelRatio);
        $("#view_3d").html(m.domElement);
        ua();
        window.addEventListener("resize", function () {
            D = window.innerWidth;
            E = window.innerHeight;
            m.setSize(D, E);
            k.aspect = D / E;

            k.updateProjectionMatrix();
        });
        m.setClearColor(0xf1f1f1, 1);
        wa();
        xa();
        ya();
        var a = new THREE.AxisHelper(100);
        h.add(a);
        za();
        Aa();
        n = new THREE.TrackballControls(k, m.domElement);
        n.rotateSpeed = -4;
        n.f = 15;
        n.maxDistance = 1400;
        Ba();
        Ca();
        //Da();
        Ra_dp("plate");
        Ea();
        Fa()
    }
}

/**
 * 注册模型列表上的点击事件
 */
function qa() {
    $(document).on("mouseenter", "#items .item", function () {
        "support" === $(this).data("type") ? Ga($(this).data("key")) : "model" === $(this).data("type") && Ha($(this).data("key"))
    }).on("mouseleave", "#items", function () {
        Ia()
    }).on("click", "#items .copy", function (a) {
        a.preventDefault();
        a = $(this).parent().data("key");
        for (var b = 0; b < H.length; b++) if (H[b] == a) {
            b = G[b].clone();
            b.material = new THREE.MeshLambertMaterial({color: 6534741});
            a = (new Date).getTime();
            b.name = a;
            b.position.set(b.position.x + 10, b.position.y +
                10, b.position.z);
            h.add(b);
            G.push(b);
            H.push(a);
            V();
            break
        }
    }).on("click", "#items .model", function (a) {
        a.preventDefault();
        "support" == F && (Ja(), Ka());
        if ("layout" == F || "support" == F) {
            La();
            a:{
                a = $(this).parent().data("key");
                for (var b = H.length - 1; 0 <= b; b--) if (H[b] === a) {
                    h.add(G[b]);
                    J = b;
                    a = !0;
                    break a
                }
                a = !1
            }
            !1 === a && (J = H.length - 1, h.add(G[J]))
        }
    }).on("click", "#items .remove", function (a) {
        a.preventDefault();
        a = $(this).parent();
        if ("support" === a.data("type")) Ma(a.data("key")), W(); else if ("model" === a.data("type")) {
            a = a.data("key");
            for (var b = H.length - 1; 0 <= b; b--) a == H[b] && (h.remove(G[b]), G.splice(b, 1), H.splice(b, 1));
            J = G.length - 1;
            W()
        }
        V()
    }).on("click", "#items .toggle", function (a) {
        a.preventDefault();
        a = $(this).parent();
        var b = a.data("key");
        if (a.data("hide")) {
            a.data("hide", !1);
            for (var c = M.length - 1; 0 <= c; c--) b == M[c] && h.add(K[c])
        } else {
            for (c = M.length - 1; 0 <= c; c--) b == M[c] && h.remove(K[c]);
            a.data("hide", !0)
        }
    })
}

/**
 * 注册界面上左键点击事件
 */
function za() {
    $(m.domElement).on("mousedown", function (a) {
        let tdview = document.getElementById("view_3d");
        if ("support" == F) {
            if ($(document.elementFromPoint(a.clientX, a.clientY)).is("canvas")) {
                var b, c = (new Date).getTime();
                a = new THREE.Vector3(a.clientX / D * 2 - 1, 2 * -(a.clientY / E) + 1, .5);
                p.setFromCamera(a.clone(), k);
                a = p.intersectObjects([G[J]]);
                var d = p.intersectObjects(K), e;
                e = $("#support_types tr.selected").data("key");
                "undefined" === typeof e ? e = "" : (e = N[parseInt(e, 10)], e.head_len = parseFloat(e.head_len) || 0, e.penetration = parseFloat(e.penetration) ||
                    0, e.head_dia = parseFloat(e.head_dia) || 0, e.body_dia = parseFloat(e.body_dia) || 0, e.base_len = parseFloat(e.base_len) || 0, e.base_dia = parseFloat(e.base_dia) || 0, e.head_type = parseFloat(e.head_type) || 0, e.type = parseFloat(e.type) || 0);
                if ("" !== e && (0 !== a.length || 0 !== d.length)) {
                    0 < a.length && (b = a[0].point);
                    if (0 === e.type && 0 < e.body_dia && 0 < a.length) {
                        a = e;
                        d = 2 * b.z;
                        d = Na(b.x, b.y, d);
                        d = Na(b.x - a.body_dia / 2, b.y - a.body_dia / 2, d);
                        d = Na(b.x + a.body_dia / 2, b.y + a.body_dia / 2, d);
                        d = Na(b.x + a.body_dia / 2, b.y - a.body_dia / 2, d);
                        d = Na(b.x - a.body_dia /
                            2, b.y + a.body_dia / 2, d);
                        b.z = b.z != d ? d : b.z;
                        d = b.z - a.head_len - a.base_len + a.penetration;
                        e = new THREE.MeshLambertMaterial({color: 6711039});
                        var f;
                        f = 1 === a.head_type ? new THREE.SphereBufferGeometry(a.head_dia, 16, 16) : new THREE.CylinderBufferGeometry(a.head_dia, a.body_dia, a.head_len, 16);
                        f = new THREE.Mesh(f, e);
                        f.position.set(b.x, b.y, b.z - a.head_len / 2 + a.penetration);
                        Oa(f, c);
                        f = new THREE.CylinderBufferGeometry(a.body_dia, a.body_dia, d + .05, 16);
                        f = new THREE.Mesh(f, e);
                        f.position.set(b.x, b.y, b.z - a.head_len - d / 2 + a.penetration);
                        Oa(f, c);
                        f = new THREE.CylinderBufferGeometry(a.base_dia, a.base_dia, a.base_len, 16);
                        e = new THREE.Mesh(f, e);
                        e.position.set(b.x, b.y, b.z - a.head_len - d - a.base_len / 2 + a.penetration);
                        Oa(e, c);
                        T.push({
                            type: "m2f",
                            key: c,
                            dia: a.base_dia,
                            x: b.x,
                            y: b.y,
                            z: d - a.penetration + a.base_len
                        })
                    } else 0 === e.type && 0 < d.length ? (Ia(), 0 < d.length && Ga(d[0].object.name)) : 1 === e.type && 0 < e.body_dia && (0 < d.length && (b = d[0].point), d = e, "" === Y ? ($("body").css("cursor", "copy"), Y = b.clone()) : (e = (new THREE.Vector3).subVectors(Y, b), a = new THREE.Matrix4, a.lookAt(b,
                        Y, (new THREE.Object3D).up), a.multiply((new THREE.Matrix4).set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)), d = new THREE.CylinderGeometry(d.body_dia, d.body_dia, e.length() + 2 * d.penetration, 8, 1), e = new THREE.MeshLambertMaterial({color: 6711039}), d = new THREE.Mesh(d, e), d.applyMatrix(a), d.position.x = (Y.x + b.x) / 2, d.position.y = (Y.y + b.y) / 2, d.position.z = (Y.z + b.z) / 2, d.name = c, h.add(d), K.push(d), M.push(c), W()));
                    V()
                }
            }
        } else {
            "plate" == F ? $(document.elementFromPoint(a.clientX, a.clientY)).is("canvas") && (c = new THREE.Vector3(a.clientX /
                D * 2 - 1, 2 * -(a.clientY / E) + 1, .5), p.setFromCamera(c.clone(), k), c = p.intersectObjects(G), 0 !== c.length && (Pa(a), Qa(), 0 < c.length && Ha(c[0].object.name), V())) : "layout" == F && Pa(a)
        }
    })
}

function Ba() {
    requestAnimationFrame(Ba);
    m.render(h, k);
    n.update()
}

function wa() {
    var a = new THREE.AmbientLight(6316128);
    h.add(a);
    a = new THREE.PointLight(6316128);
    a.position.set(-300, 300, 100);
    h.add(a);
    a = new THREE.PointLight(6316128);
    a.position.set(-300, 300, -100);
    h.add(a);
    a = new THREE.PointLight(6316128);
    a.position.set(300, -300, 100);
    h.add(a);
    a = new THREE.PointLight(6316128);
    a.position.set(-300, -300, 100);
    h.add(a)
}

/**
 * 将当前模式设置成layout，并注册模式切换事件
 */
function Da() {
    Ra("layout");
    $(".mode").on("click", function (a) {
        a.preventDefault();
        F != $(this).data("mode") && Ra($(this).data("mode"))
    })
}

/**
 * 简化版Ra
 */
function Ra_dp(a) {
    F = a;
    W();
    if ("plate" == a) {
        Ja();
        Ka();
        Ua();
        n.reset();
        Va()
    } else {
        La();
        if (0 < G.length) {
            h.add(G[G.length - 1])
        }
        J = G.length - 1;
        C.enabled = !1;
        Sa();
        Ta();
        n.reset()
    }
    V()
}

/**
 * 切换模式
 */
function Ra(a) {
    F = a;
    W();
    $(".mode").removeClass("selected");
    $(".mode").each(function () {
        $(this).data("mode") === a && $(this).addClass("selected")
    });
    "layout" == a ? (Ja(), La(), C.enabled = !1, Ka(), $("#support_box, #slider, #plate_box").hide(), $("#layout_box").show(), $("#resize").show(), n.reset()) : "support" == a ? (La(), 0 < G.length && (h.add(G[G.length - 1]), J = G.length - 1), C.enabled = !1, $("#layout_box, #plate_box").hide(), $("#support_box, #slider").show(), Sa(), Ta(), n.reset(), $("#resize").hide()) : "plate" == a && (Ja(), Ka(), $("#support_box, #slider, #layout_box").hide(),
        $("#plate_box").show(), Ua(), n.reset(), k.position.x = 0, k.position.y = 0, k.position.z = 300, Va(), $("#resize").show());
    $("body").removeClass();
    $("body").addClass(a + "_mode");
    V()
}

function ua() {
    k = new THREE.PerspectiveCamera(-25, D / E, .1, 2E5);
    k.position.set(0, 400, 300);
    h.add(k);
    $(".cam-reset").on("click", function () {
        n.reset()
    });
    $(".cam-change").on("click", function () {
        var a = $(this), b = a.data("x"), c = a.data("y"), d = a.data("z");
        a.data("reset") && n.reset();
        k.position.x = b;
        k.position.y = c;
        k.position.z = d
    })
}

/**
 * 重置对象的旋转参数
 */
function ta() {
    $("#object-reset").on("click", function () {
        "undefined" !== typeof G[J].rotation && (G[J].rotation.x = 0, G[J].rotation.y = 0, G[J].rotation.z = 0)
    })
}

$(function () {
    Q = {};
    $(document).on("change keyup", "#resize input", function () {
        var a = $(this);
        if ($("#resize_ratio").is(":checked")) {
            var b = $("#resize_width").val();
            "resize_height" === a.attr("id") ? b = a.val() * Q.a : "resize_length" === a.attr("id") && (b = a.val() * Q.c);
            "resize_width" !== a.attr("id") && $("#resize_width").val(b.toString());
            "resize_height" !== a.attr("id") && $("#resize_height").val((b / Q.a).toString());
            "resize_length" !== a.attr("id") && $("#resize_length").val((b / Q.c).toString())
        }
    });
    $(document).on("click", "#resize_button",
        function () {
            var a;
            a:{
                a = U;
                for (var b = 0; b < H.length; b++) if (a === H[b]) {
                    a = b;
                    break a
                }
                a = -1
            }
            b = Wa(a);
            G[a].geometry.scale(($("#resize_width").val() / b.width).toString(), $("#resize_height").val() / b.height, $("#resize_length").val() / b.length);
            b = O;
            "plate" == F && (b = 0);
            G[a].position.set(G[a].position.x, G[a].position.y, b - G[a].geometry.boundingBox.min.z)
        })
});

/**
 * 计算对象边界盒子尺寸
 */
function Wa(a) {
    return {
        width: G[a].geometry.boundingBox.max.x - G[a].geometry.boundingBox.min.x,
        height: G[a].geometry.boundingBox.max.y - G[a].geometry.boundingBox.min.y,
        length: G[a].geometry.boundingBox.max.z - G[a].geometry.boundingBox.min.z
    }
}

function Xa(a, b) {
    var c = Math.floor(b * t + a);
    return v.length < c ? 2 : v[c]
}

function Ya() {
    v = new Uint8Array(Math.ceil(t * u));
    A = parseInt($("#gap").val(), 10) / 2;
    0 < A || (A = 0);
    for (var a = [], b = 0; b < H.length; b++) {
        var c = Wa(b);
        a.push([c.width * c.height, b])
    }
    a.sort(function (a, b) {
        return b[0] - a[0]
    });
    a.forEach(function (a) {
        var b, c;
        a = a[1];
        b = Wa(a);
        a:{
            for (c = 0; c < t; c++) for (var d = 0; d < u; d++) {
                var l;
                if (l = !(0 < Xa(c, d))) b:{
                    for (l = c; l < c + (b.width + A); l++) for (var w = d; w < d + (b.height + A); w++) if (0 < Xa(l, w)) {
                        l = !1;
                        break b
                    }
                    l = !0
                }
                if (l) {
                    b = c;
                    c = d;
                    break a
                }
            }
            c = b = 0
        }
        d = b;
        b = c;
        c = Wa(a);
        l = c.width + A;
        for (var w = c.height + A, R = d; R <= d + l; R++) for (var L =
            b; L <= b + w; L++) v[Math.floor(L * t + R)] = 1;
        res = {x: d - t / 2, y: b - u / 2};
        G[a].position.set(res.x + c.width / 2, res.y + c.height / 2, G[a].position.z)
    })
}

function Ca() {
    v = new Uint8Array(Math.ceil(t * u));
    v = new Uint8Array(Math.ceil(t * u));
    $("#pack_btn").on("click", function () {
        Ya()
    })
}

/**
 * 如果URL地址中包含dst参数，处理之
 */
function la() {
    "" === Z("dst") && ($("#save").hide(), $("#exit").hide());
    $("body").delegate("#export", "click", function (a) {
        a.preventDefault();
        saveAs(Za(), "export.stl")
    }).delegate("#save", "click", function (a) {
        $("#save").hide();
        a.preventDefault();
        var b = Z("dst");
        $.ajax({
            url: b,
            type: "POST",
            contentType: "application/octet-stream",
            data: Za(),
            processData: !1
        }).done(function () {
            $("#save").show();
            window.location = b
        })
    }).delegate("#exit", "click", function (a) {
        a.preventDefault();
        a = Z("exit");
        "" === a && (a = Z("dst"));
        window.location =
            a
    })
}

function Za() {
    $a();
    h.remove(P);
    var a = (new THREE.STLBinaryExporter).parse(h), a = new Blob([a], {type: "binary/stl"});
    ya();
    Ta();
    return a
}

var Y = "";

/**
 * 改变指针
 */
function W() {
    Y = "";
    $("body").css("cursor", "auto")
}

function Na(a, b, c) {
    var d = new THREE.Vector3(0, 0, 1);
    a = new THREE.Vector3(a, b, 0);
    p.set(a.clone(), d);
    d = p.intersectObjects([G[J]]);
    for (a = d.length - 1; 0 <= a; a--) d[a].point.z < c && (c = d[a].point.z);
    return c
}

function Oa(a, b) {
    a.rotation.set(90 * Math.PI / 180, 0, 0);
    a.name = b;
    h.add(a);
    K.push(a);
    M.push(b)
}

function Ja() {
    if (K.length) {
        $a();
        h.remove(P);
        var a = (new THREE.STLBinaryExporter).parse(h);
        ya();
        h.remove(G[J]);
        G.splice(J, 1);
        H.splice(J, 1);
        ab(a.buffer)
    }
}

/**
 * 初始化全局变量数组
 */
function Ka() {
    $.each(K, function (a, b) {
        h.remove(b)
    });
    K = [];
    M = [];
    T = [];
    V()
}

function oa() {
    $(document).keyup(function (a) {
        if (46 == a.keyCode) {
            if ($(":focus").is("input")) return;
            U ? Ma(U) : 0 < M.length && Ma(M[M.length - 1]);
            W()
        }
        27 == a.keyCode && W()
    });
    $("#unify_base").on("click", function () {
        var a, b, c, d, e, f, g;
        Ma("unified_base");
        if (K.length) {
            for (var l = 0; l < K.length; l++) g = (new THREE.Box3).setFromObject(K[l]), l || (a = g.min.x, b = g.max.x, c = g.min.y, d = g.max.y, e = g.min.z, f = g.max.z), e > g.min.z && (e = g.min.z), f > g.max.z && (f = g.max.z), a > g.min.x && (a = g.min.x), b < g.max.x && (b = g.max.x), c > g.min.y && (c = g.min.y), d < g.max.y &&
            (d = g.max.y);
            g = new THREE.BoxBufferGeometry(b - a, d - c, f - e);
            l = new THREE.MeshLambertMaterial({color: 6711039});
            g = new THREE.Mesh(g, l);
            g.position.set((b + a) / 2, (d + c) / 2, (f + e) / 2);
            g.name = "unified_base";
            h.add(g);
            K.push(g);
            M.push("unified_base");
            V()
        }
    })
}

function Ma(a) {
    for (var b = M.length - 1; 0 <= b; b--) a == M[b] && (h.remove(K[b]), K.splice(b, 1), M.splice(b, 1));
    for (b = T.length - 1; 0 <= b; b--) a == T[b].key && T.splice(b, 1);
    V()
}

/**
 * 将Model（support）a渲染成淡红色（#FF6666/16737894）
 * @param a
 * @constructor
 */
function Ga(a) {
    Ia();
    U = a;
    for (var b = 0; b < M.length; b++) a == M[b] && K[b].material.color.setHex(16737894)
}

/**
 * 将Model（Support）渲染成蓝紫色（#6666FF/6711039）
 */
function Ia() {
    for (var a = 0; a < M.length; a++) U == M[a] && K[a].material.color.setHex(6711039);
    U = ""
}

/**
 * 创建格子平面
 */
function xa() {
    var a = Z("width"), b = Z("height");
    a || (a = 120);
    b || (b = 68);
    t = a;
    u = b;
    var c = new THREE.PlaneGeometry(a, b, 10, 10), d = [];
    d.push(new THREE.MeshBasicMaterial({color: 6710886, transparent: !0, opacity: .1}));
    d.push(new THREE.MeshBasicMaterial({color: 0, transparent: !0, opacity: .1}));
    for (var e = c.faces.length / 2, f = 0; f < e; f++) j = 2 * f, c.faces[j].materialIndex = (f + Math.floor(f / 10)) % 2, c.faces[j + 1].materialIndex = (f + Math.floor(f / 10)) % 2;
    q = new THREE.Mesh(c, new THREE.MultiMaterial(d));
    r = new THREE.GridHelper(a / 2, a, 6316128, 6316128);
    r.geometry.rotateX(Math.PI / 2);
    r.position.z = -.2;
    da = new THREE.GridHelper(a / 2, a / 10, 9474192, 9474192);
    da.geometry.rotateX(Math.PI / 2);
    da.position.z = -.1;
    c = new THREE.Geometry;
    d = new THREE.LineBasicMaterial({color: 0});
    c.vertices.push(new THREE.Vector3(0 - a / 2, 0 - b / 2, 0));
    c.vertices.push(new THREE.Vector3(0 - a / 2, 0 + b / 2, 0));
    c.vertices.push(new THREE.Vector3(0 + a / 2, 0 + b / 2, 0));
    c.vertices.push(new THREE.Vector3(0 + a / 2, 0 - b / 2, 0));
    c.vertices.push(new THREE.Vector3(0 - a / 2, 0 - b / 2, 0));
    ea = new THREE.Line(c, d);
    $(document).on("click",
        "#toggle_grid", bb)
}

function ya() {
    h.add(q);
    h.add(ea)
}

function $a() {
    h.remove(ea);
    h.remove(q);
    cb()
}

function bb() {
    if (ga) return h.add(q), cb();
    h.remove(q);
    h.add(r);
    h.add(da);
    ga = !0
}

function cb() {
    h.remove(r);
    h.remove(da);
    ga = !1
}

function Pa(a) {
    if (G.length) {
        var b = new THREE.Vector2;
        b.x = a.clientX / D * 2 - 1;
        b.y = 2 * -(a.clientY / E) + 1;
        1 == a.which && (p.setFromCamera(b, k), 0 < p.intersectObjects([G[J]]).length && (ha = !0, n.enabled = !1))
    }
}

/**
 * 注册layout模式下左键旋转模型事件
 */
function Aa() {
    $(m.domElement).on("mousemove", function (a) {
        if (a.ctrlKey && "support" !== F) C.enabled = !1, db(), C.enabled = !0; else if ("layout" === F) {
            if (ha && 0 < G.length) {

                var b = a.offsetX - ia.x, c = a.offsetY - ia.y,
                    b = (new THREE.Quaternion).setFromEuler(new THREE.Euler(Math.PI / 180 * c * 1, Math.PI / 180 * b * 1, 0, "XYZ"));
                G[J].quaternion.multiplyQuaternions(b, G[J].quaternion)

            }
            ia = {x: a.offsetX, y: a.offsetY}
        }
    });
    $("#rotate_btn").on("click", function () {
        db()
    });
    $(m.domElement).on("mouseup", function (a) {
        if ("layout" == F || a.ctrlKey) ha = !1, n.enabled =
            !0
    })
}

function db() {
    "undefined" !== typeof G[J].rotation && (G[J].rotation.order = "YXZ", G[J].rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 60))
}

function Ha(a) {
    U = a;
    for (var b = 0; b < H.length; b++) a == H[b] && (J = b);
    /*
    b = Wa(J);
    $("#resize_width").val(b.width);
    $("#resize_height").val(b.height);
    $("#resize_length").val(b.length);
    Q.a = $("#resize_width").val() / $("#resize_height").val();
    Q.c = $("#resize_width").val() / $("#resize_length").val();
    */
    "plate" === F && (Qa(), U = a, G[J].material.color.setHex(6663382))
}

/**
 * 改变Model颜色为绿色（#63B655/6534741）
 * @constructor
 */
function Qa() {
    for (var a = 0; a < H.length; a++) G[a].material.color.setHex(6534741);
    U = ""
}

/**
 * 注册plate模式下左键移动模型事件
 */
function Ua() {
    C = new THREE.DragControls(G, k, m.domElement);
    C.addEventListener("dragstart", function () {
        n.enabled = !1
    });
    C.addEventListener("dragend", function () {
        n.enabled = !0
    })
}

/**
 * 给侧边栏的模型列表插入模型项
 */
function V() {
    var a = 0, b = 0;
    $("#items").html("");
    $.each(G, function (b) {
        a++;
        $("#items").append('<div class="item" data-type="model" data-key="' + H[parseInt(b, 10)] + '"><a data-ask="delete_model_confirm" href="#" class="ask remove">X</a> <a href="#" class="model">Model ' + a + '</a> <a href="#" class="copy">C</a></div>')
    });
    b = a = 0;
    $.each(K, function (c) {
        M[parseInt(c, 10)] != b && (a++, $("#items").append('<div class="item" data-type="support" data-key="' + M[parseInt(c, 10)] + '"><a href="#" class="remove">X</a>Support ' + a + ' <a href="#" class="toggle">T</a></div>'));
        b = M[parseInt(c, 10)]
    })
}

function Va() {
    La();
    $.each(G, function (a, b) {
        h.add(b)
    });
    J = G.length - 1
}

function La() {
    ha = !1;
    h.remove(P);
    $.each(G, function (a, b) {
        h.remove(b)
    })
}

/**
 * 注册支撑面板的点击事件
 */
function pa() {
    $(document).on("click", "#support_types a", function (a) {
        a.preventDefault();
        eb($(this).data("key"))
    }).on("click", "#new_support", function () {
        eb(-1)
    }).on("click", "#support_close", function (a) {
        a.preventDefault();
        $("#support_add_box").fadeOut()
    }).on("click", "#support_types tr", function () {
        $("#support_types tr").removeClass("selected");
        $(this).addClass("selected");
        W()
    }).on("change keyup", "#support_add", function () {
        fb("support_preview", gb($("#support_add")))
    }).on("submit", "#support_add", function (a) {
        a.preventDefault();
        a = $(this).find("input[type=submit]:focus").val();
        "Add" === a && hb(this);
        "Remove" === a && ib();
        "Save" === a && (ib(), hb(this));
        Sa();
        W();
        $("#support_add_box").fadeOut()
    })
}

function eb(a) {
    $("#support_add_box").fadeIn().data("key", a);
    -1 !== a ? ($(".only_new").show(), $.each(N[a], function (a, c) {
        $("*[name=" + a + "]").val(c)
    })) : $(".only_new").hide();
    fb("support_preview", gb($("#support_add")))
}

function ib() {
    var a = $("#support_add_box").data("key");
    N.splice(a, 1);
    localStorage.setItem("support_types", JSON.stringify(N))
}

function fb(a, b) {
    var c = document.getElementById(a), d = c.getContext("2d");
    d.strokeStyle = "#FFFFFF";
    d.fillStyle = "#FFFFFF";
    d.clearRect(0, 0, c.width, c.height);
    if (0 == b.type) {
        var e;
        e = b.head_dia;
        var f = b.body_dia;
        e = e > f ? e : f;
        f = b.base_dia;
        e = e > f ? e : f;
        f = 10 + b.head_len + b.base_len;
        c = c.width / f < c.height / e ? c.width / f : c.height / e;
        f = (e - b.base_dia) / 2;
        d.fillRect(0, f * c, b.base_len * c, b.base_dia * c);
        var g = b.base_len, f = (e - b.body_dia) / 2;
        d.fillRect(g * c, f * c, 10 * c, b.body_dia * c);
        g += 10;
        0 === b.head_type && (d.beginPath(), d.moveTo(g * c, (f + b.body_dia) *
            c), d.lineTo(g * c, f * c), f = (e - b.head_dia) / 2, d.lineTo((g + b.head_len) * c, f * c), d.lineTo((g + b.head_len) * c, (f + b.head_dia) * c), d.closePath(), d.fill(), g = g + b.head_len - b.penetration);
        1 === b.head_type && (f = e / 2, d.beginPath(), d.arc((g + b.head_len / 2) * c, f * c, b.head_dia / 2 * c, 0, 2 * Math.PI), d.stroke(), d.fill(), g = g + b.head_len / 2 - b.penetration);
        d.fillStyle = "#FF0000";
        d.strokeStyle = "#FF0000";
        d.beginPath();
        d.moveTo(g * c, 0);
        d.lineTo(g * c, e * c);
        d.stroke()
    }
}

function hb(a) {
    a = gb(a);
    N.push(a);
    localStorage.setItem("support_types", JSON.stringify(N));
    Sa();
    W()
}

function gb(a) {
    var b = {};
    $.each($(a).serializeArray(), function () {
        b[this.name] = "name" == this.name ? this.value : parseFloat(this.value)
    });
    return b
}

/**
 * 从localStorage中初始化预设支撑类型
 */
function Sa() {
    var a = "", b = "", c = {};
    N = JSON.parse(localStorage.getItem("support_types"));
    for (var d = 0; d < N.length; d++) {
        var e = N[d];
        N.length == d + 1 && (b = "selected");
        0 == e.type ? (a += '<tr data-key="' + d + '" class="' + b + '"><td>' + e.name + '<td><canvas id="c' + d + '" width="100%" height="25"></canvas><td><a href="#" onclick="open_pop(\'#support_add_box\')" data-key="' + d + '">Edit</a></tr>', c[d] = ["c" + d, e]) : a += '<tr data-key="' + d + '" class="' + b + '"><td>' + e.name + "<td>" + e.body_dia + " / " + e.penetration + '<td><a href="#" data-key="' + d + '">Edit</a></tr>'
    }
    $("#support_types").html("</div><table><tr><td><td>Pattern</tr>" +
        a + "</table>");
    $.each(c, function (a, b) {
        fb(b[0], b[1])
    })
}

function na() {
    $(".toggle_master").each(function () {
        jb($(this))
    });
    $("html").delegate(".toggle_master", "change", function () {
        jb($(this))
    })
}

function jb(a) {
    var b = a.attr("name"), c = a.val();
    a.find("option").each(function () {
        var a = "." + b + "_" + $(this).val();
        $(this).val() == c ? $(a).show() : $(a).hide()
    })
}

function ra() {
    O = localStorage.getItem("model_height");
    $("#start_height").val(O);
    $("#helpModal").modal({show: !1});
    $("#model_elevate").on("click", function () {
        O = $("#start_height").val();
        localStorage.setItem("model_height", O);
        var a = (new THREE.Box3).setFromObject(G[J]);
        G[J].position.set(0, 0, O - a.min.sub(G[J].position).z)
    });
    $(".guide").on("click", function () {
        $("#helpModal").modal("show")
    })
}

function ma() {
    $("#reset").on("click", function () {
        kb()
    });
    localStorage.getItem("model_height") || kb()
}

/**
 * 本地存储预设参数
 */
function kb() {
    localStorage.setItem("model_height", 5);
    localStorage.setItem("support_types", '[{"name":"Basic","type":0,"head_len":1.5,"penetration":0.5,"head_type":0,"head_dia":0.5,"body_dia":1.5,"base_len":0.5,"base_dia":3}]');
}

/**
 * 解析STL ASCII数据
 */
var lb = function () {
    function a(a) {
        function e(a) {
            a = l(a);
            if (!a) throw Error("Error on STL ASCII File");
            I++;
            return a
        }

        function l(a) {
            for (; L[I].match(/^\s*$/);) I++;
            return L[I].match(a)
        }

        f = [];
        g = [];
        var L = b(new Uint8Array(a)), I = 0;
        a = /^\s*facet\s+normal\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/;
        var y = /^\s*vertex\s+([^s]+)\s+([^\s]+)\s+([^\s]+)/, z = new THREE.BufferGeometry;
        for (e(/^\s*solid\s(.*)/); !l(/^\s*endsolid/);) {
            var x = e(a);
            e(/^\s*outer\s+loop/);
            var B = e(y), fa = e(y), X = e(y);
            e(/\s*endloop/);
            e(/\s*endfacet/);
            d(B);
            d(fa);
            d(X);
            c(x)
        }
        z.addAttribute("position", new THREE.BufferAttribute(new Float32Array(f), 3));
        z.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(g), 3));
        return z
    }

    function b(a) {
        for (var b = [], c = 0, d = 0; d < a.length; d++) 10 === a[d] && (b.push(String.fromCharCode.apply(null, a.subarray(c, d))), c = d + 1);
        b.push(String.fromCharCode.apply(null, a.subarray(c)));
        return b
    }

    function c(a) {
        var b = parseFloat(a[1]), c = parseFloat(a[2]);
        a = parseFloat(a[3]);
        g.push(b, c, a, b, c, a, b, c, a)
    }

    function d(a) {
        f.push(parseFloat(a[1]), parseFloat(a[2]),
            parseFloat(a[3]))
    }

    function e(a, b) {
        f.push(a.getFloat32(b + 0, !0), a.getFloat32(b + 4, !0), a.getFloat32(b + 8, !0))
    }

    var f = [], g = [];
    return function (b) {
        try {
            return a(b)
        } catch (fa) {
            f = [];
            g = [];
            b = new DataView(b);
            for (var c = b.getUint32(80, !0), d = new THREE.BufferGeometry, l = 84, I = 0; I < c; I++) {
                var y = b, z = l, x = y.getFloat32(z + 0, !0), B = y.getFloat32(z + 4, !0), y = y.getFloat32(z + 8, !0);
                g.push(x, B, y, x, B, y, x, B, y);
                e(b, l + 12);
                e(b, l + 24);
                e(b, l + 36);
                l += 50
            }
            d.addAttribute("position", new THREE.BufferAttribute(new Float32Array(f), 3));
            d.addAttribute("normal",
                new THREE.BufferAttribute(new Float32Array(g), 3));
            return d
        }
    }
}();

function Fa() {
    $("body").delegate("#weaver", "click", function () {
        var a = parseFloat($("#weaver_dia").val()), b = parseFloat($("#max_dist").val());
        b || (b = 9999999);
        for (var c = 0; c < T.length; c++) if ("weave" === T[c].type) {
            Ma(T[c].key);
            break
        }
        for (var c = b, d = T.length, b = {}, e, f, g, l = 0; l < d; l++) {
            f = 0;
            g = "";
            for (var w = l + 1; w < d; w++) l === w || b[l + "_" + w] || (e = mb(l, w, c), f < e && (f = e, g = w));
            0 < f && (b[l + "_" + g] = [l, g])
        }
        var c = (new Date).getTime(), R;
        for (R in b) {
            d = b[R][0];
            e = b[R][1];
            f = c;
            g = a;
            for (var l = nb(d, e), w = T[d].x, L = T[d].y, I = T[e].x, y = T[e].y, z = 0; z <
            mb(d, e, 9999); z++) {
                var x = z * l + g, B = new THREE.Vector3(w, L, !(z % 2) * (l + 2 * g) + x),
                    x = new THREE.Vector3(I, y, (1 === z % 2) * (l + 2 * g) + x), fa = f, X = g,
                    S = new THREE.MeshLambertMaterial({color: 6711039}), qb = (new THREE.Vector3).subVectors(x, B),
                    va = new THREE.Matrix4;
                va.lookAt(B, x, (new THREE.Object3D).up);
                va.multiply((new THREE.Matrix4).set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1));
                X = new THREE.CylinderGeometry(X, X, qb.length(), 8, 1);
                S = new THREE.Mesh(X, S);
                S.applyMatrix(va);
                S.position.set((x.x + B.x) / 2, (x.y + B.y) / 2, (x.z + B.z) / 2);
                S.name = fa;
                h.add(S);
                K.push(S);
                M.push(fa)
            }
        }
        T.push({type: "weave", key: c, dia: a, x: 0, y: 0, z: 0});
        V()
    })
}

function nb(a, b) {
    return Math.pow(Math.pow(T[b].y - T[a].y, 2) + Math.pow(T[b].x - T[a].x, 2), .5) - T[a].dia / 2 - T[b].dia / 2
}

function mb(a, b, c) {
    if ("m2f" !== T[a].type || "m2f" !== T[b].type) return 0;
    var d = nb(a, b);
    b = T[b].z;
    if (0 >= d || c < d) return 0;
    a = T[a].z;
    b < a && (a = b);
    return Math.floor(a / d)
}

function ja() {
    $("#support_file").on("change", function (a) {
        La();
        ob(a.target.files[0])
    });
    $("#plate_file").on("change", function (a) {
        for (var b = 0; b < a.target.files.length; b++) ob(a.target.files[b])
    });
    pb();
    var a = document.body;
    a.addEventListener("dragover", function (a) {
        a.stopPropagation();
        a.preventDefault();
        a.dataTransfer.dropEffect = "copy"
    });
    a.addEventListener("drop", function (a) {
        a.stopPropagation();
        a.preventDefault();
        ob(a.dataTransfer.files[0])
    })
}

function ob(a) {
    var b = new FileReader;
    b.addEventListener("load", function (a) {
        ab(a.target.result)
    });
    b.readAsArrayBuffer(a)
}

/**
 * 从所提供的数据中加载模型
 */
function ab(a) {
    var b = (new Date).getTime() + Math.random();
    a = lb(a);
    var c = new THREE.MeshLambertMaterial({color: 0x65ACD6}), c = new THREE.Mesh(a, c), d = O;
    if ("plate" == F || "support" == F) d = 0;
    a.center();
    c.position.set(0, 0, d - c.geometry.boundingBox.min.z);
    c.name = b;
    h.add(c);
    G.push(c);
    H.push(b);
    "support" !== F && (J = G.length - 1);
    V();
    Ha(b)
}

/**
 * 解析URL中附带的参数项
 */
function Z(a) {
    var b = decodeURIComponent(window.location.search.substring(1)).split("&"), c, d;
    for (d = 0; d < b.length; d++) if (c = b[d].split("="), c[0] === a) return "undefined" === typeof c[1] ? "" : c[1];
    return ""
}

/**
 * 加载URL中src参数所在的模型
 */
function pb() {
    var a = Z("src");
    "" !== a && rb(a)
}

/**
 * 从参数地址中获取模型buffer数据并加载该模型
 */
function rb(a) {
    var b = new XMLHttpRequest;
    b.open("GET", a, !0);
    b.responseType = "arraybuffer";
    b.onload = function () {
        200 == b.status && ab(b.response)
    };
    b.send()
}

function Ea() {
    var a = Z("models");
    "" !== a && (a = a.split(","), Ra("plate"), a.forEach(function (a) {
        rb(a)
    }))
}

function Ta() {
    if (G.length) {
        h.remove(P);
        var a = (new THREE.Box3).setFromObject(G[G.length - 1]), b = a.max.x - a.min.x + 10, c = a.max.y - a.min.y + 10,
            d = new THREE.PlaneBufferGeometry(b, c);
        P = new THREE.Mesh(d, new THREE.MeshBasicMaterial({
            color: 16777215,
            transparent: !0,
            opacity: .8,
            side: THREE.DoubleSide
        }));
        P.position.set(a.min.x + b / 2 - 5, a.min.y + c / 2 - 5, 0);
        $("#slider").prop("max", a.max.z)
    }
}

function sa() {
    $("#slider").on("change mousemove", function () {
        var a = $(this).val();
        h.remove(P);
        P.position.z = a;
        h.add(P)
    })
};
