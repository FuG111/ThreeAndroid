window.__require = function t(e, r, i) {
function a(l, c) {
if (!r[l]) {
if (!e[l]) {
var s = l.split("/");
s = s[s.length - 1];
if (!e[s]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(s, !0);
if (n) return n(s, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = s;
}
var o = r[l] = {
exports: {}
};
e[l][0].call(o.exports, function(t) {
return a(e[l][1][t] || t);
}, o, o.exports, t, e, r, i);
}
return r[l].exports;
}
for (var n = "function" == typeof __require && __require, l = 0; l < i.length; l++) a(i[l]);
return a;
}({
MultTextures: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "6447a/wdAlJL50HAkjN7DdV", "MultTextures");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.getMultMaterial = r.MultBatch2D = void 0;
var i = t("./MultUtils");
cc.Component.prototype.useMult = !1;
var a = {
texture: null,
defalut: new cc.Texture2D(),
getImpl: function() {
return this.texture;
}
};
cc.gfx.Texture2D.prototype.texID = -1;
var n = 0, l = !1, c = [];
r.MultBatch2D = {
nativeObj: null,
enable: !1,
parent: null,
curID: 0,
incID: 0,
count: 0,
hash: 0,
reset: function() {
this.count > 0 && this.curID++;
this.incID += this.count;
this.count = 0;
},
clear: function() {
for (var t = c, e = 0; e < t.length; e++) {
var r = t[e];
r.destroy();
r.decRef();
}
c.length = 0;
}
};
var s = function() {
r.MultBatch2D.enable = !1;
cc.resources.load("multTextures/Mult-material", cc.Material, function(t, e) {
if (!t) {
var a = cc.Material.getBuiltinMaterial("2d-sprite");
if (a) {
r.MultBatch2D.hash = i.getMaterialHash(a);
r.MultBatch2D.parent = e;
r.MultBatch2D.enable = !0;
e.addRef();
}
}
});
};
r.getMultMaterial = function(t) {
r.MultBatch2D.reset();
l = !1;
if (!r.MultBatch2D.enable || !t || !t.isMultTextures) return t;
if (!r.MultBatch2D.parent || !r.MultBatch2D.parent.isValid) {
s();
return t;
}
var e = c[n++];
if (!e || !e.isValid) {
e = new (0, cc.MaterialVariant)(r.MultBatch2D.parent);
c[n - 1] = e;
for (var i = 0; i < 8; i++) e.setProperty("texture" + i, a.defalut);
e.updateHash(r.MultBatch2D.hash);
e.define("USE_TEXTURE", !0);
e.isMultTextures = !0;
e.cacheTextures = [ -1 ];
e.addRef();
e._effect._nativeObj.updateHash(n + .5);
}
l = !0;
return e;
};
var u = function(t, e) {
var r = t._assembler._renderData;
if (!r) return !1;
var i = 0, a = r.vDatas[0];
if (t.dataDirty) {
t.dataDirty = !1;
for (var n = 0, l = a.length; n < l; n += 5) {
i = ~~(1e5 * a[n + 2]);
a[n + 2] = 10 * i + e;
}
} else if (t.texID != e) for (n = 0, l = a.length; n < l; n += 5) {
i = ~~(.1 * a[n + 2]);
a[n + 2] = 10 * i + e;
}
t.texID = e;
}, o = function(t, e, i) {
if (l && e) {
var n = e.effect.passes[0].getProperty("texture");
if (!n) {
console.warn(t.node.name, " texture lost !!!!!");
e.setProperty("texture", a.defalut);
n = a.defalut;
}
var c = r.MultBatch2D, s = (e.effect, n.texID - c.incID);
if (s < 0) {
if (c.count >= 8) {
i.material = r.getMultMaterial(e);
i.node = e.getDefine("CC_USE_MODEL") ? t.node : i._dummyNode;
}
s = c.count++;
n.texID = s + c.incID;
var o = i.material, f = o.cacheTextures;
if (f[s] !== n._id) {
f[s] = n._id;
a.texture = n;
o.setProperty("texture" + s, a);
o.effect._dirty = !1;
o._dirty = !1;
}
}
var h = t._assembler;
null == h || h.updateMaterial(0, i.material);
u(t, s);
}
}, f = function() {
if (cc.MotionStreak) {
var t = cc.MotionStreak.prototype, e = t.lateUpdate;
t.useMult = !0;
t.lateUpdate = function(t) {
e.call(this, t);
this._assembler && this._points.length >= 2 && (this.dataDirty = !0);
};
}
}, h = function() {
var t = cc.RenderComponent.prototype;
t.texID = -1;
t.vDitry = !0;
t.dataDirty = !0;
Object.defineProperty(t, "_vertsDirty", {
get: function() {
return this.vDitry;
},
set: function(t) {
!t && this.vDitry && (this.dataDirty = !0);
this.vDitry = t;
}
});
var e = t.setMaterial;
t.setMaterial = function(t, r) {
var i = e.call(this, t, r);
this.setVertsDirty();
return i;
};
var a = cc.Material.prototype, l = a.getHash;
a.getHash = function() {
var t = this._effect;
if (r.MultBatch2D.enable && t && t._dirty) {
this.isMultTextures = !1;
var e = this._owner;
if (e && !e.node.is3DNode) {
var a = e instanceof cc.Label, n = e instanceof cc.Sprite;
if (e.useMult || n || a && !e._nativeTTF()) {
var c = i.getMaterialHash(this);
if (c == r.MultBatch2D.hash) {
this.isMultTextures = !0;
t._dirty = !1;
t._hash = c;
return c;
}
}
}
}
return l.call(this);
};
t._checkBacth = function(t, e) {
var i = this._materials[0];
if (i && i.getHash() !== t.material.getHash() || t.cullingMask !== e) {
t.node = i.getDefine("CC_USE_MODEL") ? this.node : t._dummyNode;
t.material = r.getMultMaterial(i);
t.cullingMask = e;
}
o(this, i, t);
};
cc.director.on(cc.Director.EVENT_BEFORE_DRAW, function() {
n = 0;
r.MultBatch2D.reset();
r.MultBatch2D.curID = 0;
});
}, _ = function() {
cc.Material.prototype._hash = -1;
cc.Material.prototype._obj = null;
cc.Component.prototype.isFlush = !1;
if (cc.MeshRenderer) {
var t = cc.MeshRenderer.prototype, e = t.onEnable;
t.onEnable = function() {
e.call(this);
this.isFlush = !0;
};
}
if (cc.ParticleSystem3D) {
var i = cc.ParticleSystem3D.prototype, a = i.onEnable;
i.onEnable = function() {
a.call(this);
this.isFlush = !0;
};
}
var n = cc.RenderFlow;
n.FLAG_REORDER_CHILDREN = 1 << 29;
n.FLAG_WORLD_TRANSFORM_CHANGED = 1 << 30;
n.FLAG_OPACITY_CHANGED = 1 << 31;
var l = [], c = [], s = !1;
cc.director;
n.render = function(t, e, r) {
void 0 === r && (r = null);
s = !0;
n.validateRenderers();
for (var i = 0, a = l.length; i < a; i++) {
var u = l[i];
u._inJsbDirtyList = !1;
var o = u._renderComponent;
if (o) {
var f = o._assembler;
if (f) {
var h = u._dirtyPtr[0];
if (h & n.FLAG_UPDATE_RENDER_DATA) {
u._dirtyPtr[0] &= ~n.FLAG_UPDATE_RENDER_DATA;
f._updateRenderData && f._updateRenderData();
}
if (h & n.FLAG_COLOR) {
u._dirtyPtr[0] &= ~n.FLAG_COLOR;
o._updateColor && o._updateColor();
}
}
}
}
l.length = 0;
this.visitBegin(t);
e = e || 0;
this._nativeFlow.render(t._proxy, e, r);
l = c.slice(0);
c.length = 0;
s = !1;
};
n.renderCamera = function(t, e) {
n.render(e, 0, t);
};
n.init = function(t) {
cc.EventTarget.call(this);
this._nativeFlow = t;
};
n.register = function(t) {
if (!t._inJsbDirtyList) {
s ? c.push(t) : l.push(t);
t._inJsbDirtyList = !0;
}
};
var u = new cc.Node(), o = new cc.Material(), f = {
node: u,
material: o,
cullingMask: 1,
_dummyNode: u,
reset: function() {
this.node = u;
this.empty_material = o;
this.cullingMask = 1;
this.material = r.getMultMaterial(o);
},
flush: function(t) {
this.cullingMask = t._cullingMask;
this.material = r.getMultMaterial(o);
}
};
cc.Node.prototype.realOpacity = 1;
var h = n.FLAG_RENDER, _ = n.FLAG_DONOTHING, d = n.FLAG_POST_RENDER, p = function(t) {
var e = 0, r = t.realOpacity;
if (0 != r && t._activeInHierarchy) {
var i = t._renderComponent;
if (i) {
if (!t._dirtyPtr) return;
if ((e = t._renderFlag) & _) return;
if (e & d) f.flush(t); else if (e & h) {
i._checkBacth(f, t._cullingMask);
i.isFlush && f.flush(t);
}
}
for (var a = t._children, n = 0, l = a.length; n < l; n++) {
var c = a[n];
c.realOpacity = r * (~~c._opacity / 255);
p(c);
}
i && e & d && f.flush(t);
}
};
n.visitBegin = function(t) {
if (r.MultBatch2D.enable) {
t && p(t);
f.reset();
}
};
};
cc.game.once(cc.game.EVENT_GAME_INITED, function() {
var t = cc.ENGINE_VERSION.split(".");
if (!(parseInt(t[2]) < 3 || parseInt(t[1]) < 4 || parseInt(t[0]) < 2)) {
s();
f();
h();
_();
}
});
cc._RF.pop();
}, {
"./MultUtils": "MultUtils"
} ],
MultUtils: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "ee356R1PsZHwb4qYopN4oWi", "MultUtils");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.getMaterialHash = r.murmurhash2 = r.serializeUniforms = r.serializePasses = r.serializePass = r.serializeDefines = void 0;
var i = [];
function a(t, e) {
if (e) {
for (var r = e.length, a = 0; a < r; a++) {
var n = e[a];
i[a] = n + t[n];
}
i.length = r;
} else {
a = 0;
for (var n in t) i[a++] = n + t[n];
i.length = a;
}
return i.join("");
}
r.serializeDefines = a;
function n(t, e) {
void 0 === e && (e = !1);
var r = t._programName + t._cullMode;
t._blend && (r += t._blendEq + t._blendAlphaEq + t._blendSrc + t._blendDst + t._blendSrcAlpha + t._blendDstAlpha + t._blendColor);
t._depthTest && (r += t._depthWrite + t._depthFunc);
t._stencilTest && (r += t._stencilFuncFront + t._stencilRefFront + t._stencilMaskFront + t._stencilFailOpFront + t._stencilZFailOpFront + t._stencilZPassOpFront + t._stencilWriteMaskFront + t._stencilFuncBack + t._stencilRefBack + t._stencilMaskBack + t._stencilFailOpBack + t._stencilZFailOpBack + t._stencilZPassOpBack + t._stencilWriteMaskBack);
r += a(t._defines, t._defineNames);
e || (r += c(t._properties, t._propertyNames));
return r;
}
r.serializePass = n;
function l(t, e) {
void 0 === e && (e = !1);
for (var r = "", i = 0; i < t.length; i++) r += n(t[i], e);
return r;
}
r.serializePasses = l;
function c(t, e) {
var r = 0;
if (e) {
for (var a = 0, n = e.length; a < n; a++) if ((c = t[e[a]].value) && null == c._id) {
i[r] = c.toString();
r++;
}
} else for (var l in t) {
var c;
if ((c = t[l].value) && null == c._id) {
i[r] = c.toString();
r++;
}
}
i.length = r;
return i.join(";");
}
r.serializeUniforms = c;
function s(t, e) {
for (var r, i = t.length, a = e ^ i, n = 0; i >= 4; ) {
r = 1540483477 * (65535 & (r = 255 & t.charCodeAt(n) | (255 & t.charCodeAt(++n)) << 8 | (255 & t.charCodeAt(++n)) << 16 | (255 & t.charCodeAt(++n)) << 24)) + ((1540483477 * (r >>> 16) & 65535) << 16);
a = 1540483477 * (65535 & a) + ((1540483477 * (a >>> 16) & 65535) << 16) ^ (r = 1540483477 * (65535 & (r ^= r >>> 24)) + ((1540483477 * (r >>> 16) & 65535) << 16));
i -= 4;
++n;
}
switch (i) {
case 3:
a ^= (255 & t.charCodeAt(n + 2)) << 16;

case 2:
a ^= (255 & t.charCodeAt(n + 1)) << 8;

case 1:
a = 1540483477 * (65535 & (a ^= 255 & t.charCodeAt(n))) + ((1540483477 * (a >>> 16) & 65535) << 16);
}
a = 1540483477 * (65535 & (a ^= a >>> 13)) + ((1540483477 * (a >>> 16) & 65535) << 16);
return (a ^= a >>> 15) >>> 0;
}
r.murmurhash2 = s;
r.getMaterialHash = function(t) {
var e = "", r = t._effect;
r && (e += l(r.passes, !1));
return s(e, 666);
};
cc._RF.pop();
}, {} ]
}, {}, [ "MultTextures", "MultUtils" ]);