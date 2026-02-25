(function(e) {
"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = e();
})(function() {
return function e(t, r, i) {
function n(a, o) {
if (!r[a]) {
if (!t[a]) {
var h = "function" == typeof require && require;
if (!o && h) return h(a, !0);
if (s) return s(a, !0);
var u = new Error("Cannot find module '" + a + "'");
throw u.code = "MODULE_NOT_FOUND", u;
}
var f = r[a] = {
exports: {}
};
t[a][0].call(f.exports, function(e) {
return n(t[a][1][e] || e);
}, f, f.exports, e, t, r, i);
}
return r[a].exports;
}
for (var s = "function" == typeof require && require, a = 0; a < i.length; a++) n(i[a]);
return n;
}({
1: [ function(e, t, r) {
"use strict";
var i = e("./utils"), n = e("./support"), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
r.encode = function(e) {
for (var t, r, n, a, o, h, u, f = [], l = 0, d = e.length, c = d, p = "string" !== i.getTypeOf(e); l < e.length; ) {
c = d - l;
if (p) {
t = e[l++];
r = l < d ? e[l++] : 0;
n = l < d ? e[l++] : 0;
} else {
t = e.charCodeAt(l++);
r = l < d ? e.charCodeAt(l++) : 0;
n = l < d ? e.charCodeAt(l++) : 0;
}
a = t >> 2;
o = (3 & t) << 4 | r >> 4;
h = c > 1 ? (15 & r) << 2 | n >> 6 : 64;
u = c > 2 ? 63 & n : 64;
f.push(s.charAt(a) + s.charAt(o) + s.charAt(h) + s.charAt(u));
}
return f.join("");
};
r.decode = function(e) {
var t, r, i, a, o, h, u = 0, f = 0;
if ("data:" === e.substr(0, "data:".length)) throw new Error("Invalid base64 input, it looks like a data url.");
var l, d = 3 * (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4;
e.charAt(e.length - 1) === s.charAt(64) && d--;
e.charAt(e.length - 2) === s.charAt(64) && d--;
if (d % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
l = n.uint8array ? new Uint8Array(0 | d) : new Array(0 | d);
for (;u < e.length; ) {
t = s.indexOf(e.charAt(u++)) << 2 | (a = s.indexOf(e.charAt(u++))) >> 4;
r = (15 & a) << 4 | (o = s.indexOf(e.charAt(u++))) >> 2;
i = (3 & o) << 6 | (h = s.indexOf(e.charAt(u++)));
l[f++] = t;
64 !== o && (l[f++] = r);
64 !== h && (l[f++] = i);
}
return l;
};
}, {
"./support": 30,
"./utils": 32
} ],
2: [ function(e, t) {
"use strict";
var r = e("./external"), i = e("./stream/DataWorker"), n = e("./stream/DataLengthProbe"), s = e("./stream/Crc32Probe");
n = e("./stream/DataLengthProbe");
function a(e, t, r, i, n) {
this.compressedSize = e;
this.uncompressedSize = t;
this.crc32 = r;
this.compression = i;
this.compressedContent = n;
}
a.prototype = {
getContentWorker: function() {
var e = new i(r.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new n("data_length")), t = this;
e.on("end", function() {
if (this.streamInfo.data_length !== t.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
});
return e;
},
getCompressedWorker: function() {
return new i(r.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
}
};
a.createWorkerFrom = function(e, t, r) {
return e.pipe(new s()).pipe(new n("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new n("compressedSize")).withStreamInfo("compression", t);
};
t.exports = a;
}, {
"./external": 6,
"./stream/Crc32Probe": 25,
"./stream/DataLengthProbe": 26,
"./stream/DataWorker": 27
} ],
3: [ function(e, t, r) {
"use strict";
var i = e("./stream/GenericWorker");
r.STORE = {
magic: "\0\0",
compressWorker: function() {
return new i("STORE compression");
},
uncompressWorker: function() {
return new i("STORE decompression");
}
};
r.DEFLATE = e("./flate");
}, {
"./flate": 7,
"./stream/GenericWorker": 28
} ],
4: [ function(e, t) {
"use strict";
var r = e("./utils"), i = function() {
for (var e, t = [], r = 0; r < 256; r++) {
e = r;
for (var i = 0; i < 8; i++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
t[r] = e;
}
return t;
}();
function n(e, t, r, n) {
var s = i, a = n + r;
e ^= -1;
for (var o = n; o < a; o++) e = e >>> 8 ^ s[255 & (e ^ t[o])];
return -1 ^ e;
}
function s(e, t, r, n) {
var s = i, a = n + r;
e ^= -1;
for (var o = n; o < a; o++) e = e >>> 8 ^ s[255 & (e ^ t.charCodeAt(o))];
return -1 ^ e;
}
t.exports = function(e, t) {
return "undefined" != typeof e && e.length ? "string" !== r.getTypeOf(e) ? n(0 | t, e, e.length, 0) : s(0 | t, e, e.length, 0) : 0;
};
}, {
"./utils": 32
} ],
5: [ function(e, t, r) {
"use strict";
r.base64 = !1;
r.binary = !1;
r.dir = !1;
r.createFolders = !0;
r.date = null;
r.compression = null;
r.compressionOptions = null;
r.comment = null;
r.unixPermissions = null;
r.dosPermissions = null;
}, {} ],
6: [ function(e, t) {
"use strict";
var r;
r = "undefined" != typeof Promise ? Promise : e("lie");
t.exports = {
Promise: r
};
}, {
lie: 37
} ],
7: [ function(e, t, r) {
"use strict";
var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, n = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = i ? "uint8array" : "array";
r.magic = "\b\0";
function h(e, t) {
a.call(this, "FlateWorker/" + e);
this._pako = null;
this._pakoAction = e;
this._pakoOptions = t;
this.meta = {};
}
s.inherits(h, a);
h.prototype.processChunk = function(e) {
this.meta = e.meta;
null === this._pako && this._createPako();
this._pako.push(s.transformTo(o, e.data), !1);
};
h.prototype.flush = function() {
a.prototype.flush.call(this);
null === this._pako && this._createPako();
this._pako.push([], !0);
};
h.prototype.cleanUp = function() {
a.prototype.cleanUp.call(this);
this._pako = null;
};
h.prototype._createPako = function() {
this._pako = new n[this._pakoAction]({
raw: !0,
level: this._pakoOptions.level || -1
});
var e = this;
this._pako.onData = function(t) {
e.push({
data: t,
meta: e.meta
});
};
};
r.compressWorker = function(e) {
return new h("Deflate", e);
};
r.uncompressWorker = function() {
return new h("Inflate", {});
};
}, {
"./stream/GenericWorker": 28,
"./utils": 32,
pako: 38
} ],
8: [ function(e, t) {
"use strict";
var r = e("../utils"), i = e("../stream/GenericWorker"), n = e("../utf8"), s = e("../crc32"), a = e("../signature"), o = function(e, t) {
var r, i = "";
for (r = 0; r < t; r++) {
i += String.fromCharCode(255 & e);
e >>>= 8;
}
return i;
}, h = function(e, t) {
var r = e;
e || (r = t ? 16893 : 33204);
return (65535 & r) << 16;
}, u = function(e, t, i, u, f, l) {
var d, c, p = e.file, m = e.compression, _ = l !== n.utf8encode, g = r.transformTo("string", l(p.name)), b = r.transformTo("string", n.utf8encode(p.name)), v = p.comment, w = r.transformTo("string", l(v)), y = r.transformTo("string", n.utf8encode(v)), k = b.length !== p.name.length, x = y.length !== v.length, S = "", z = "", C = "", E = p.dir, A = p.date, I = {
crc32: 0,
compressedSize: 0,
uncompressedSize: 0
};
if (!t || i) {
I.crc32 = e.crc32;
I.compressedSize = e.compressedSize;
I.uncompressedSize = e.uncompressedSize;
}
var O = 0;
t && (O |= 8);
_ || !k && !x || (O |= 2048);
var B = 0, R = 0;
E && (B |= 16);
if ("UNIX" === f) {
R = 798;
B |= h(p.unixPermissions, E);
} else {
R = 20;
B |= 63 & (p.dosPermissions || 0);
}
d = A.getUTCHours();
d <<= 6;
d |= A.getUTCMinutes();
d <<= 5;
d |= A.getUTCSeconds() / 2;
c = A.getUTCFullYear() - 1980;
c <<= 4;
c |= A.getUTCMonth() + 1;
c <<= 5;
c |= A.getUTCDate();
if (k) {
z = o(1, 1) + o(s(g), 4) + b;
S += "up" + o(z.length, 2) + z;
}
if (x) {
C = o(1, 1) + o(s(w), 4) + y;
S += "uc" + o(C.length, 2) + C;
}
var T = "";
T += "\n\0";
T += o(O, 2);
T += m.magic;
T += o(d, 2);
T += o(c, 2);
T += o(I.crc32, 4);
T += o(I.compressedSize, 4);
T += o(I.uncompressedSize, 4);
T += o(g.length, 2);
T += o(S.length, 2);
return {
fileRecord: a.LOCAL_FILE_HEADER + T + g + S,
dirRecord: a.CENTRAL_FILE_HEADER + o(R, 2) + T + o(w.length, 2) + "\0\0\0\0" + o(B, 4) + o(u, 4) + g + S + w
};
}, f = function(e, t, i, n, s) {
var h = r.transformTo("string", s(n));
return a.CENTRAL_DIRECTORY_END + "\0\0\0\0" + o(e, 2) + o(e, 2) + o(t, 4) + o(i, 4) + o(h.length, 2) + h;
}, l = function(e) {
return a.DATA_DESCRIPTOR + o(e.crc32, 4) + o(e.compressedSize, 4) + o(e.uncompressedSize, 4);
};
function d(e, t, r, n) {
i.call(this, "ZipFileWorker");
this.bytesWritten = 0;
this.zipComment = t;
this.zipPlatform = r;
this.encodeFileName = n;
this.streamFiles = e;
this.accumulate = !1;
this.contentBuffer = [];
this.dirRecords = [];
this.currentSourceOffset = 0;
this.entriesCount = 0;
this.currentFile = null;
this._sources = [];
}
r.inherits(d, i);
d.prototype.push = function(e) {
var t = e.meta.percent || 0, r = this.entriesCount, n = this._sources.length;
if (this.accumulate) this.contentBuffer.push(e); else {
this.bytesWritten += e.data.length;
i.prototype.push.call(this, {
data: e.data,
meta: {
currentFile: this.currentFile,
percent: r ? (t + 100 * (r - n - 1)) / r : 100
}
});
}
};
d.prototype.openedSource = function(e) {
this.currentSourceOffset = this.bytesWritten;
this.currentFile = e.file.name;
var t = this.streamFiles && !e.file.dir;
if (t) {
var r = u(e, t, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
this.push({
data: r.fileRecord,
meta: {
percent: 0
}
});
} else this.accumulate = !0;
};
d.prototype.closedSource = function(e) {
this.accumulate = !1;
var t = this.streamFiles && !e.file.dir, r = u(e, t, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
this.dirRecords.push(r.dirRecord);
if (t) this.push({
data: l(e),
meta: {
percent: 100
}
}); else {
this.push({
data: r.fileRecord,
meta: {
percent: 0
}
});
for (;this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
}
this.currentFile = null;
};
d.prototype.flush = function() {
for (var e = this.bytesWritten, t = 0; t < this.dirRecords.length; t++) this.push({
data: this.dirRecords[t],
meta: {
percent: 100
}
});
var r = this.bytesWritten - e, i = f(this.dirRecords.length, r, e, this.zipComment, this.encodeFileName);
this.push({
data: i,
meta: {
percent: 100
}
});
};
d.prototype.prepareNextSource = function() {
this.previous = this._sources.shift();
this.openedSource(this.previous.streamInfo);
this.isPaused ? this.previous.pause() : this.previous.resume();
};
d.prototype.registerPrevious = function(e) {
this._sources.push(e);
var t = this;
e.on("data", function(e) {
t.processChunk(e);
});
e.on("end", function() {
t.closedSource(t.previous.streamInfo);
t._sources.length ? t.prepareNextSource() : t.end();
});
e.on("error", function(e) {
t.error(e);
});
return this;
};
d.prototype.resume = function() {
if (!i.prototype.resume.call(this)) return !1;
if (!this.previous && this._sources.length) {
this.prepareNextSource();
return !0;
}
if (!this.previous && !this._sources.length && !this.generatedError) {
this.end();
return !0;
}
};
d.prototype.error = function(e) {
var t = this._sources;
if (!i.prototype.error.call(this, e)) return !1;
for (var r = 0; r < t.length; r++) try {
t[r].error(e);
} catch (e) {}
return !0;
};
d.prototype.lock = function() {
i.prototype.lock.call(this);
for (var e = this._sources, t = 0; t < e.length; t++) e[t].lock();
};
t.exports = d;
}, {
"../crc32": 4,
"../signature": 23,
"../stream/GenericWorker": 28,
"../utf8": 31,
"../utils": 32
} ],
9: [ function(e, t, r) {
"use strict";
var i = e("../compressions"), n = e("./ZipFileWorker"), s = function(e, t) {
var r = e || t, n = i[r];
if (!n) throw new Error(r + " is not a valid compression method !");
return n;
};
r.generateWorker = function(e, t, r) {
var i = new n(t.streamFiles, r, t.platform, t.encodeFileName), a = 0;
try {
e.forEach(function(e, r) {
a++;
var n = s(r.options.compression, t.compression), o = r.options.compressionOptions || t.compressionOptions || {}, h = r.dir, u = r.date;
r._compressWorker(n, o).withStreamInfo("file", {
name: e,
dir: h,
date: u,
comment: r.comment || "",
unixPermissions: r.unixPermissions,
dosPermissions: r.dosPermissions
}).pipe(i);
});
i.entriesCount = a;
} catch (e) {
i.error(e);
}
return i;
};
}, {
"../compressions": 3,
"./ZipFileWorker": 8
} ],
10: [ function(e, t) {
"use strict";
function r() {
if (!(this instanceof r)) return new r();
if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
this.files = {};
this.comment = null;
this.root = "";
this.clone = function() {
var e = new r();
for (var t in this) "function" != typeof this[t] && (e[t] = this[t]);
return e;
};
}
r.prototype = e("./object");
r.prototype.loadAsync = e("./load");
r.support = e("./support");
r.defaults = e("./defaults");
r.version = "3.2.0";
r.loadAsync = function(e, t) {
return new r().loadAsync(e, t);
};
r.external = e("./external");
t.exports = r;
}, {
"./defaults": 5,
"./external": 6,
"./load": 11,
"./object": 15,
"./support": 30
} ],
11: [ function(e, t) {
"use strict";
var r = e("./utils"), i = e("./external"), n = e("./utf8"), s = (r = e("./utils"), 
e("./zipEntries")), a = e("./stream/Crc32Probe"), o = e("./nodejsUtils");
function h(e) {
return new i.Promise(function(t, r) {
var i = e.decompressed.getContentWorker().pipe(new a());
i.on("error", function(e) {
r(e);
}).on("end", function() {
i.streamInfo.crc32 !== e.decompressed.crc32 ? r(new Error("Corrupted zip : CRC32 mismatch")) : t();
}).resume();
});
}
t.exports = function(e, t) {
var a = this;
t = r.extend(t || {}, {
base64: !1,
checkCRC32: !1,
optimizedBinaryString: !1,
createFolders: !1,
decodeFileName: n.utf8decode
});
return o.isNode && o.isStream(e) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : r.prepareContent("the loaded zip file", e, !0, t.optimizedBinaryString, t.base64).then(function(e) {
var r = new s(t);
r.load(e);
return r;
}).then(function(e) {
var r = [ i.Promise.resolve(e) ], n = e.files;
if (t.checkCRC32) for (var s = 0; s < n.length; s++) r.push(h(n[s]));
return i.Promise.all(r);
}).then(function(e) {
for (var r = e.shift(), i = r.files, n = 0; n < i.length; n++) {
var s = i[n];
a.file(s.fileNameStr, s.decompressed, {
binary: !0,
optimizedBinaryString: !0,
date: s.date,
dir: s.dir,
comment: s.fileCommentStr.length ? s.fileCommentStr : null,
unixPermissions: s.unixPermissions,
dosPermissions: s.dosPermissions,
createFolders: t.createFolders
});
}
r.zipComment.length && (a.comment = r.zipComment);
return a;
});
};
}, {
"./external": 6,
"./nodejsUtils": 14,
"./stream/Crc32Probe": 25,
"./utf8": 31,
"./utils": 32,
"./zipEntries": 33
} ],
12: [ function(e, t) {
"use strict";
var r = e("../utils"), i = e("../stream/GenericWorker");
function n(e, t) {
i.call(this, "Nodejs stream input adapter for " + e);
this._upstreamEnded = !1;
this._bindStream(t);
}
r.inherits(n, i);
n.prototype._bindStream = function(e) {
var t = this;
this._stream = e;
e.pause();
e.on("data", function(e) {
t.push({
data: e,
meta: {
percent: 0
}
});
}).on("error", function(e) {
t.isPaused ? this.generatedError = e : t.error(e);
}).on("end", function() {
t.isPaused ? t._upstreamEnded = !0 : t.end();
});
};
n.prototype.pause = function() {
if (!i.prototype.pause.call(this)) return !1;
this._stream.pause();
return !0;
};
n.prototype.resume = function() {
if (!i.prototype.resume.call(this)) return !1;
this._upstreamEnded ? this.end() : this._stream.resume();
return !0;
};
t.exports = n;
}, {
"../stream/GenericWorker": 28,
"../utils": 32
} ],
13: [ function(e, t) {
"use strict";
var r = e("readable-stream").Readable;
e("../utils").inherits(i, r);
function i(e, t, i) {
r.call(this, t);
this._helper = e;
var n = this;
e.on("data", function(e, t) {
n.push(e) || n._helper.pause();
i && i(t);
}).on("error", function(e) {
n.emit("error", e);
}).on("end", function() {
n.push(null);
});
}
i.prototype._read = function() {
this._helper.resume();
};
t.exports = i;
}, {
"../utils": 32,
"readable-stream": 16
} ],
14: [ function(e, t) {
"use strict";
t.exports = {
isNode: "undefined" != typeof Buffer,
newBufferFrom: function(e, t) {
if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e, t);
if ("number" == typeof e) throw new Error('The "data" argument must not be a number');
return new Buffer(e, t);
},
allocBuffer: function(e) {
if (Buffer.alloc) return Buffer.alloc(e);
var t = new Buffer(e);
t.fill(0);
return t;
},
isBuffer: function(e) {
return Buffer.isBuffer(e);
},
isStream: function(e) {
return e && "function" == typeof e.on && "function" == typeof e.pause && "function" == typeof e.resume;
}
};
}, {} ],
15: [ function(e, t) {
"use strict";
var r = e("./utf8"), i = e("./utils"), n = e("./stream/GenericWorker"), s = e("./stream/StreamHelper"), a = e("./defaults"), o = e("./compressedObject"), h = e("./zipObject"), u = e("./generate"), f = e("./nodejsUtils"), l = e("./nodejs/NodejsStreamInputAdapter"), d = function(e, t, r) {
var s, u = i.getTypeOf(t), d = i.extend(r || {}, a);
d.date = d.date || new Date();
null !== d.compression && (d.compression = d.compression.toUpperCase());
"string" == typeof d.unixPermissions && (d.unixPermissions = parseInt(d.unixPermissions, 8));
d.unixPermissions && 16384 & d.unixPermissions && (d.dir = !0);
d.dosPermissions && 16 & d.dosPermissions && (d.dir = !0);
d.dir && (e = p(e));
d.createFolders && (s = c(e)) && m.call(this, s, !0);
var _ = "string" === u && !1 === d.binary && !1 === d.base64;
r && "undefined" != typeof r.binary || (d.binary = !_);
if (t instanceof o && 0 === t.uncompressedSize || d.dir || !t || 0 === t.length) {
d.base64 = !1;
d.binary = !0;
t = "";
d.compression = "STORE";
u = "string";
}
var g;
g = t instanceof o || t instanceof n ? t : f.isNode && f.isStream(t) ? new l(e, t) : i.prepareContent(e, t, d.binary, d.optimizedBinaryString, d.base64);
var b = new h(e, g, d);
this.files[e] = b;
}, c = function(e) {
"/" === e.slice(-1) && (e = e.substring(0, e.length - 1));
var t = e.lastIndexOf("/");
return t > 0 ? e.substring(0, t) : "";
}, p = function(e) {
"/" !== e.slice(-1) && (e += "/");
return e;
}, m = function(e, t) {
t = "undefined" != typeof t ? t : a.createFolders;
e = p(e);
this.files[e] || d.call(this, e, null, {
dir: !0,
createFolders: t
});
return this.files[e];
};
function _(e) {
return "[object RegExp]" === Object.prototype.toString.call(e);
}
var g = {
load: function() {
throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
},
forEach: function(e) {
var t, r, i;
for (t in this.files) if (this.files.hasOwnProperty(t)) {
i = this.files[t];
(r = t.slice(this.root.length, t.length)) && t.slice(0, this.root.length) === this.root && e(r, i);
}
},
filter: function(e) {
var t = [];
this.forEach(function(r, i) {
e(r, i) && t.push(i);
});
return t;
},
file: function(e, t, r) {
if (1 === arguments.length) {
if (_(e)) {
var i = e;
return this.filter(function(e, t) {
return !t.dir && i.test(e);
});
}
var n = this.files[this.root + e];
return n && !n.dir ? n : null;
}
e = this.root + e;
d.call(this, e, t, r);
return this;
},
folder: function(e) {
if (!e) return this;
if (_(e)) return this.filter(function(t, r) {
return r.dir && e.test(t);
});
var t = this.root + e, r = m.call(this, t), i = this.clone();
i.root = r.name;
return i;
},
remove: function(e) {
e = this.root + e;
var t = this.files[e];
if (!t) {
"/" !== e.slice(-1) && (e += "/");
t = this.files[e];
}
if (t && !t.dir) delete this.files[e]; else for (var r = this.filter(function(t, r) {
return r.name.slice(0, e.length) === e;
}), i = 0; i < r.length; i++) delete this.files[r[i].name];
return this;
},
generate: function() {
throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
},
generateInternalStream: function(e) {
var t, a = {};
try {
(a = i.extend(e || {}, {
streamFiles: !1,
compression: "STORE",
compressionOptions: null,
type: "",
platform: "DOS",
comment: null,
mimeType: "application/zip",
encodeFileName: r.utf8encode
})).type = a.type.toLowerCase();
a.compression = a.compression.toUpperCase();
"binarystring" === a.type && (a.type = "string");
if (!a.type) throw new Error("No output type specified.");
i.checkSupport(a.type);
"darwin" !== a.platform && "freebsd" !== a.platform && "linux" !== a.platform && "sunos" !== a.platform || (a.platform = "UNIX");
"win32" === a.platform && (a.platform = "DOS");
var o = a.comment || this.comment || "";
t = u.generateWorker(this, a, o);
} catch (e) {
(t = new n("error")).error(e);
}
return new s(t, a.type || "string", a.mimeType);
},
generateAsync: function(e, t) {
return this.generateInternalStream(e).accumulate(t);
},
generateNodeStream: function(e, t) {
(e = e || {}).type || (e.type = "nodebuffer");
return this.generateInternalStream(e).toNodejsStream(t);
}
};
t.exports = g;
}, {
"./compressedObject": 2,
"./defaults": 5,
"./generate": 9,
"./nodejs/NodejsStreamInputAdapter": 12,
"./nodejsUtils": 14,
"./stream/GenericWorker": 28,
"./stream/StreamHelper": 29,
"./utf8": 31,
"./utils": 32,
"./zipObject": 35
} ],
16: [ function() {}, {
stream: void 0
} ],
17: [ function(e, t) {
"use strict";
var r = e("./DataReader");
function i(e) {
r.call(this, e);
for (var t = 0; t < this.data.length; t++) e[t] = 255 & e[t];
}
e("../utils").inherits(i, r);
i.prototype.byteAt = function(e) {
return this.data[this.zero + e];
};
i.prototype.lastIndexOfSignature = function(e) {
for (var t = e.charCodeAt(0), r = e.charCodeAt(1), i = e.charCodeAt(2), n = e.charCodeAt(3), s = this.length - 4; s >= 0; --s) if (this.data[s] === t && this.data[s + 1] === r && this.data[s + 2] === i && this.data[s + 3] === n) return s - this.zero;
return -1;
};
i.prototype.readAndCheckSignature = function(e) {
var t = e.charCodeAt(0), r = e.charCodeAt(1), i = e.charCodeAt(2), n = e.charCodeAt(3), s = this.readData(4);
return t === s[0] && r === s[1] && i === s[2] && n === s[3];
};
i.prototype.readData = function(e) {
this.checkOffset(e);
if (0 === e) return [];
var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
this.index += e;
return t;
};
t.exports = i;
}, {
"../utils": 32,
"./DataReader": 18
} ],
18: [ function(e, t) {
"use strict";
var r = e("../utils");
function i(e) {
this.data = e;
this.length = e.length;
this.index = 0;
this.zero = 0;
}
i.prototype = {
checkOffset: function(e) {
this.checkIndex(this.index + e);
},
checkIndex: function(e) {
if (this.length < this.zero + e || e < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e + "). Corrupted zip ?");
},
setIndex: function(e) {
this.checkIndex(e);
this.index = e;
},
skip: function(e) {
this.setIndex(this.index + e);
},
byteAt: function() {},
readInt: function(e) {
var t, r = 0;
this.checkOffset(e);
for (t = this.index + e - 1; t >= this.index; t--) r = (r << 8) + this.byteAt(t);
this.index += e;
return r;
},
readString: function(e) {
return r.transformTo("string", this.readData(e));
},
readData: function() {},
lastIndexOfSignature: function() {},
readAndCheckSignature: function() {},
readDate: function() {
var e = this.readInt(4);
return new Date(Date.UTC(1980 + (e >> 25 & 127), (e >> 21 & 15) - 1, e >> 16 & 31, e >> 11 & 31, e >> 5 & 63, (31 & e) << 1));
}
};
t.exports = i;
}, {
"../utils": 32
} ],
19: [ function(e, t) {
"use strict";
var r = e("./Uint8ArrayReader");
function i(e) {
r.call(this, e);
}
e("../utils").inherits(i, r);
i.prototype.readData = function(e) {
this.checkOffset(e);
var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
this.index += e;
return t;
};
t.exports = i;
}, {
"../utils": 32,
"./Uint8ArrayReader": 21
} ],
20: [ function(e, t) {
"use strict";
var r = e("./DataReader");
function i(e) {
r.call(this, e);
}
e("../utils").inherits(i, r);
i.prototype.byteAt = function(e) {
return this.data.charCodeAt(this.zero + e);
};
i.prototype.lastIndexOfSignature = function(e) {
return this.data.lastIndexOf(e) - this.zero;
};
i.prototype.readAndCheckSignature = function(e) {
return e === this.readData(4);
};
i.prototype.readData = function(e) {
this.checkOffset(e);
var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
this.index += e;
return t;
};
t.exports = i;
}, {
"../utils": 32,
"./DataReader": 18
} ],
21: [ function(e, t) {
"use strict";
var r = e("./ArrayReader");
function i(e) {
r.call(this, e);
}
e("../utils").inherits(i, r);
i.prototype.readData = function(e) {
this.checkOffset(e);
if (0 === e) return new Uint8Array(0);
var t = this.data.subarray(this.zero + this.index, this.zero + this.index + e);
this.index += e;
return t;
};
t.exports = i;
}, {
"../utils": 32,
"./ArrayReader": 17
} ],
22: [ function(e, t) {
"use strict";
var r = e("../utils"), i = e("../support"), n = e("./ArrayReader"), s = e("./StringReader"), a = e("./NodeBufferReader"), o = e("./Uint8ArrayReader");
t.exports = function(e) {
var t = r.getTypeOf(e);
r.checkSupport(t);
return "string" !== t || i.uint8array ? "nodebuffer" === t ? new a(e) : i.uint8array ? new o(r.transformTo("uint8array", e)) : new n(r.transformTo("array", e)) : new s(e);
};
}, {
"../support": 30,
"../utils": 32,
"./ArrayReader": 17,
"./NodeBufferReader": 19,
"./StringReader": 20,
"./Uint8ArrayReader": 21
} ],
23: [ function(e, t, r) {
"use strict";
r.LOCAL_FILE_HEADER = "PK";
r.CENTRAL_FILE_HEADER = "PK";
r.CENTRAL_DIRECTORY_END = "PK";
r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK";
r.ZIP64_CENTRAL_DIRECTORY_END = "PK";
r.DATA_DESCRIPTOR = "PK\b";
}, {} ],
24: [ function(e, t) {
"use strict";
var r = e("./GenericWorker"), i = e("../utils");
function n(e) {
r.call(this, "ConvertWorker to " + e);
this.destType = e;
}
i.inherits(n, r);
n.prototype.processChunk = function(e) {
this.push({
data: i.transformTo(this.destType, e.data),
meta: e.meta
});
};
t.exports = n;
}, {
"../utils": 32,
"./GenericWorker": 28
} ],
25: [ function(e, t) {
"use strict";
var r = e("./GenericWorker"), i = e("../crc32");
function n() {
r.call(this, "Crc32Probe");
this.withStreamInfo("crc32", 0);
}
e("../utils").inherits(n, r);
n.prototype.processChunk = function(e) {
this.streamInfo.crc32 = i(e.data, this.streamInfo.crc32 || 0);
this.push(e);
};
t.exports = n;
}, {
"../crc32": 4,
"../utils": 32,
"./GenericWorker": 28
} ],
26: [ function(e, t) {
"use strict";
var r = e("../utils"), i = e("./GenericWorker");
function n(e) {
i.call(this, "DataLengthProbe for " + e);
this.propName = e;
this.withStreamInfo(e, 0);
}
r.inherits(n, i);
n.prototype.processChunk = function(e) {
if (e) {
var t = this.streamInfo[this.propName] || 0;
this.streamInfo[this.propName] = t + e.data.length;
}
i.prototype.processChunk.call(this, e);
};
t.exports = n;
}, {
"../utils": 32,
"./GenericWorker": 28
} ],
27: [ function(e, t) {
"use strict";
var r = e("../utils"), i = e("./GenericWorker");
function n(e) {
i.call(this, "DataWorker");
var t = this;
this.dataIsReady = !1;
this.index = 0;
this.max = 0;
this.data = null;
this.type = "";
this._tickScheduled = !1;
e.then(function(e) {
t.dataIsReady = !0;
t.data = e;
t.max = e && e.length || 0;
t.type = r.getTypeOf(e);
t.isPaused || t._tickAndRepeat();
}, function(e) {
t.error(e);
});
}
r.inherits(n, i);
n.prototype.cleanUp = function() {
i.prototype.cleanUp.call(this);
this.data = null;
};
n.prototype.resume = function() {
if (!i.prototype.resume.call(this)) return !1;
if (!this._tickScheduled && this.dataIsReady) {
this._tickScheduled = !0;
r.delay(this._tickAndRepeat, [], this);
}
return !0;
};
n.prototype._tickAndRepeat = function() {
this._tickScheduled = !1;
if (!this.isPaused && !this.isFinished) {
this._tick();
if (!this.isFinished) {
r.delay(this._tickAndRepeat, [], this);
this._tickScheduled = !0;
}
}
};
n.prototype._tick = function() {
if (this.isPaused || this.isFinished) return !1;
var e = null, t = Math.min(this.max, this.index + 16384);
if (this.index >= this.max) return this.end();
switch (this.type) {
case "string":
e = this.data.substring(this.index, t);
break;

case "uint8array":
e = this.data.subarray(this.index, t);
break;

case "array":
case "nodebuffer":
e = this.data.slice(this.index, t);
}
this.index = t;
return this.push({
data: e,
meta: {
percent: this.max ? this.index / this.max * 100 : 0
}
});
};
t.exports = n;
}, {
"../utils": 32,
"./GenericWorker": 28
} ],
28: [ function(e, t) {
"use strict";
function r(e) {
this.name = e || "default";
this.streamInfo = {};
this.generatedError = null;
this.extraStreamInfo = {};
this.isPaused = !0;
this.isFinished = !1;
this.isLocked = !1;
this._listeners = {
data: [],
end: [],
error: []
};
this.previous = null;
}
r.prototype = {
push: function(e) {
this.emit("data", e);
},
end: function() {
if (this.isFinished) return !1;
this.flush();
try {
this.emit("end");
this.cleanUp();
this.isFinished = !0;
} catch (e) {
this.emit("error", e);
}
return !0;
},
error: function(e) {
if (this.isFinished) return !1;
if (this.isPaused) this.generatedError = e; else {
this.isFinished = !0;
this.emit("error", e);
this.previous && this.previous.error(e);
this.cleanUp();
}
return !0;
},
on: function(e, t) {
this._listeners[e].push(t);
return this;
},
cleanUp: function() {
this.streamInfo = this.generatedError = this.extraStreamInfo = null;
this._listeners = [];
},
emit: function(e, t) {
if (this._listeners[e]) for (var r = 0; r < this._listeners[e].length; r++) this._listeners[e][r].call(this, t);
},
pipe: function(e) {
return e.registerPrevious(this);
},
registerPrevious: function(e) {
if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
this.streamInfo = e.streamInfo;
this.mergeStreamInfo();
this.previous = e;
var t = this;
e.on("data", function(e) {
t.processChunk(e);
});
e.on("end", function() {
t.end();
});
e.on("error", function(e) {
t.error(e);
});
return this;
},
pause: function() {
if (this.isPaused || this.isFinished) return !1;
this.isPaused = !0;
this.previous && this.previous.pause();
return !0;
},
resume: function() {
if (!this.isPaused || this.isFinished) return !1;
this.isPaused = !1;
var e = !1;
if (this.generatedError) {
this.error(this.generatedError);
e = !0;
}
this.previous && this.previous.resume();
return !e;
},
flush: function() {},
processChunk: function(e) {
this.push(e);
},
withStreamInfo: function(e, t) {
this.extraStreamInfo[e] = t;
this.mergeStreamInfo();
return this;
},
mergeStreamInfo: function() {
for (var e in this.extraStreamInfo) this.extraStreamInfo.hasOwnProperty(e) && (this.streamInfo[e] = this.extraStreamInfo[e]);
},
lock: function() {
if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
this.isLocked = !0;
this.previous && this.previous.lock();
},
toString: function() {
var e = "Worker " + this.name;
return this.previous ? this.previous + " -> " + e : e;
}
};
t.exports = r;
}, {} ],
29: [ function(e, t) {
"use strict";
var r = e("../utils"), i = e("./ConvertWorker"), n = e("./GenericWorker"), s = e("../base64"), a = e("../support"), o = e("../external"), h = null;
if (a.nodestream) try {
h = e("../nodejs/NodejsStreamOutputAdapter");
} catch (e) {}
function u(e, t, i) {
switch (e) {
case "blob":
return r.newBlob(r.transformTo("arraybuffer", t), i);

case "base64":
return s.encode(t);

default:
return r.transformTo(e, t);
}
}
function f(e, t) {
var r, i = 0, n = null, s = 0;
for (r = 0; r < t.length; r++) s += t[r].length;
switch (e) {
case "string":
return t.join("");

case "array":
return Array.prototype.concat.apply([], t);

case "uint8array":
n = new Uint8Array(s);
for (r = 0; r < t.length; r++) {
n.set(t[r], i);
i += t[r].length;
}
return n;

case "nodebuffer":
return Buffer.concat(t);

default:
throw new Error("concat : unsupported type '" + e + "'");
}
}
function l(e, t, s) {
var a = t;
switch (t) {
case "blob":
case "arraybuffer":
a = "uint8array";
break;

case "base64":
a = "string";
}
try {
this._internalType = a;
this._outputType = t;
this._mimeType = s;
r.checkSupport(a);
this._worker = e.pipe(new i(a));
e.lock();
} catch (e) {
this._worker = new n("error");
this._worker.error(e);
}
}
l.prototype = {
accumulate: function(e) {
return t = this, r = e, new o.Promise(function(e, i) {
var n = [], s = t._internalType, a = t._outputType, o = t._mimeType;
t.on("data", function(e, t) {
n.push(e);
r && r(t);
}).on("error", function(e) {
n = [];
i(e);
}).on("end", function() {
try {
var t = u(a, f(s, n), o);
e(t);
} catch (e) {
i(e);
}
n = [];
}).resume();
});
var t, r;
},
on: function(e, t) {
var i = this;
"data" === e ? this._worker.on(e, function(e) {
t.call(i, e.data, e.meta);
}) : this._worker.on(e, function() {
r.delay(t, arguments, i);
});
return this;
},
resume: function() {
r.delay(this._worker.resume, [], this._worker);
return this;
},
pause: function() {
this._worker.pause();
return this;
},
toNodejsStream: function(e) {
r.checkSupport("nodestream");
if ("nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
return new h(this, {
objectMode: "nodebuffer" !== this._outputType
}, e);
}
};
t.exports = l;
}, {
"../base64": 1,
"../external": 6,
"../nodejs/NodejsStreamOutputAdapter": 13,
"../support": 30,
"../utils": 32,
"./ConvertWorker": 24,
"./GenericWorker": 28
} ],
30: [ function(e, t, r) {
"use strict";
r.base64 = !0;
r.array = !0;
r.string = !0;
r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array;
r.nodebuffer = "undefined" != typeof Buffer;
r.uint8array = "undefined" != typeof Uint8Array;
if ("undefined" == typeof ArrayBuffer) r.blob = !1; else {
var i = new ArrayBuffer(0);
try {
r.blob = 0 === new Blob([ i ], {
type: "application/zip"
}).size;
} catch (e) {
try {
var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
n.append(i);
r.blob = 0 === n.getBlob("application/zip").size;
} catch (e) {
r.blob = !1;
}
}
}
try {
r.nodestream = !!e("readable-stream").Readable;
} catch (e) {
r.nodestream = !1;
}
}, {
"readable-stream": 16
} ],
31: [ function(e, t, r) {
"use strict";
for (var i = e("./utils"), n = e("./support"), s = e("./nodejsUtils"), a = e("./stream/GenericWorker"), o = new Array(256), h = 0; h < 256; h++) o[h] = h >= 252 ? 6 : h >= 248 ? 5 : h >= 240 ? 4 : h >= 224 ? 3 : h >= 192 ? 2 : 1;
o[254] = o[254] = 1;
var u = function(e) {
var t, r, i, s, a, o = e.length, h = 0;
for (s = 0; s < o; s++) {
if (55296 == (64512 & (r = e.charCodeAt(s))) && s + 1 < o && 56320 == (64512 & (i = e.charCodeAt(s + 1)))) {
r = 65536 + (r - 55296 << 10) + (i - 56320);
s++;
}
h += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
}
t = n.uint8array ? new Uint8Array(h) : new Array(h);
for (a = 0, s = 0; a < h; s++) {
if (55296 == (64512 & (r = e.charCodeAt(s))) && s + 1 < o && 56320 == (64512 & (i = e.charCodeAt(s + 1)))) {
r = 65536 + (r - 55296 << 10) + (i - 56320);
s++;
}
if (r < 128) t[a++] = r; else if (r < 2048) {
t[a++] = 192 | r >>> 6;
t[a++] = 128 | 63 & r;
} else if (r < 65536) {
t[a++] = 224 | r >>> 12;
t[a++] = 128 | r >>> 6 & 63;
t[a++] = 128 | 63 & r;
} else {
t[a++] = 240 | r >>> 18;
t[a++] = 128 | r >>> 12 & 63;
t[a++] = 128 | r >>> 6 & 63;
t[a++] = 128 | 63 & r;
}
}
return t;
}, f = function(e, t) {
var r;
(t = t || e.length) > e.length && (t = e.length);
r = t - 1;
for (;r >= 0 && 128 == (192 & e[r]); ) r--;
return r < 0 ? t : 0 === r ? t : r + o[e[r]] > t ? r : t;
}, l = function(e) {
var t, r, n, s, a = e.length, h = new Array(2 * a);
for (r = 0, t = 0; t < a; ) if ((n = e[t++]) < 128) h[r++] = n; else if ((s = o[n]) > 4) {
h[r++] = 65533;
t += s - 1;
} else {
n &= 2 === s ? 31 : 3 === s ? 15 : 7;
for (;s > 1 && t < a; ) {
n = n << 6 | 63 & e[t++];
s--;
}
if (s > 1) h[r++] = 65533; else if (n < 65536) h[r++] = n; else {
n -= 65536;
h[r++] = 55296 | n >> 10 & 1023;
h[r++] = 56320 | 1023 & n;
}
}
h.length !== r && (h.subarray ? h = h.subarray(0, r) : h.length = r);
return i.applyFromCharCode(h);
};
r.utf8encode = function(e) {
return n.nodebuffer ? s.newBufferFrom(e, "utf-8") : u(e);
};
r.utf8decode = function(e) {
if (n.nodebuffer) return i.transformTo("nodebuffer", e).toString("utf-8");
e = i.transformTo(n.uint8array ? "uint8array" : "array", e);
return l(e);
};
function d() {
a.call(this, "utf-8 decode");
this.leftOver = null;
}
i.inherits(d, a);
d.prototype.processChunk = function(e) {
var t = i.transformTo(n.uint8array ? "uint8array" : "array", e.data);
if (this.leftOver && this.leftOver.length) {
if (n.uint8array) {
var s = t;
(t = new Uint8Array(s.length + this.leftOver.length)).set(this.leftOver, 0);
t.set(s, this.leftOver.length);
} else t = this.leftOver.concat(t);
this.leftOver = null;
}
var a = f(t), o = t;
if (a !== t.length) if (n.uint8array) {
o = t.subarray(0, a);
this.leftOver = t.subarray(a, t.length);
} else {
o = t.slice(0, a);
this.leftOver = t.slice(a, t.length);
}
this.push({
data: r.utf8decode(o),
meta: e.meta
});
};
d.prototype.flush = function() {
if (this.leftOver && this.leftOver.length) {
this.push({
data: r.utf8decode(this.leftOver),
meta: {}
});
this.leftOver = null;
}
};
r.Utf8DecodeWorker = d;
function c() {
a.call(this, "utf-8 encode");
}
i.inherits(c, a);
c.prototype.processChunk = function(e) {
this.push({
data: r.utf8encode(e.data),
meta: e.meta
});
};
r.Utf8EncodeWorker = c;
}, {
"./nodejsUtils": 14,
"./stream/GenericWorker": 28,
"./support": 30,
"./utils": 32
} ],
32: [ function(e, t, r) {
"use strict";
var i = e("./support"), n = e("./base64"), s = e("./nodejsUtils"), a = e("set-immediate-shim"), o = e("./external");
r.newBlob = function(e, t) {
r.checkSupport("blob");
try {
return new Blob([ e ], {
type: t
});
} catch (r) {
try {
var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
i.append(e);
return i.getBlob(t);
} catch (e) {
throw new Error("Bug : can't construct the Blob.");
}
}
};
function h(e) {
return e;
}
function u(e, t) {
for (var r = 0; r < e.length; ++r) t[r] = 255 & e.charCodeAt(r);
return t;
}
var f = {
stringifyByChunk: function(e, t, r) {
var i = [], n = 0, s = e.length;
if (s <= r) return String.fromCharCode.apply(null, e);
for (;n < s; ) {
"array" === t || "nodebuffer" === t ? i.push(String.fromCharCode.apply(null, e.slice(n, Math.min(n + r, s)))) : i.push(String.fromCharCode.apply(null, e.subarray(n, Math.min(n + r, s))));
n += r;
}
return i.join("");
},
stringifyByChar: function(e) {
for (var t = "", r = 0; r < e.length; r++) t += String.fromCharCode(e[r]);
return t;
},
applyCanBeUsed: {
uint8array: function() {
try {
return i.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
} catch (e) {
return !1;
}
}(),
nodebuffer: function() {
try {
return i.nodebuffer && 1 === String.fromCharCode.apply(null, s.allocBuffer(1)).length;
} catch (e) {
return !1;
}
}()
}
};
function l(e) {
var t = 65536, i = r.getTypeOf(e), n = !0;
"uint8array" === i ? n = f.applyCanBeUsed.uint8array : "nodebuffer" === i && (n = f.applyCanBeUsed.nodebuffer);
if (n) for (;t > 1; ) try {
return f.stringifyByChunk(e, i, t);
} catch (e) {
t = Math.floor(t / 2);
}
return f.stringifyByChar(e);
}
r.applyFromCharCode = l;
function d(e, t) {
for (var r = 0; r < e.length; r++) t[r] = e[r];
return t;
}
var c = {};
c.string = {
string: h,
array: function(e) {
return u(e, new Array(e.length));
},
arraybuffer: function(e) {
return c.string.uint8array(e).buffer;
},
uint8array: function(e) {
return u(e, new Uint8Array(e.length));
},
nodebuffer: function(e) {
return u(e, s.allocBuffer(e.length));
}
};
c.array = {
string: l,
array: h,
arraybuffer: function(e) {
return new Uint8Array(e).buffer;
},
uint8array: function(e) {
return new Uint8Array(e);
},
nodebuffer: function(e) {
return s.newBufferFrom(e);
}
};
c.arraybuffer = {
string: function(e) {
return l(new Uint8Array(e));
},
array: function(e) {
return d(new Uint8Array(e), new Array(e.byteLength));
},
arraybuffer: h,
uint8array: function(e) {
return new Uint8Array(e);
},
nodebuffer: function(e) {
return s.newBufferFrom(new Uint8Array(e));
}
};
c.uint8array = {
string: l,
array: function(e) {
return d(e, new Array(e.length));
},
arraybuffer: function(e) {
return e.buffer;
},
uint8array: h,
nodebuffer: function(e) {
return s.newBufferFrom(e);
}
};
c.nodebuffer = {
string: l,
array: function(e) {
return d(e, new Array(e.length));
},
arraybuffer: function(e) {
return c.nodebuffer.uint8array(e).buffer;
},
uint8array: function(e) {
return d(e, new Uint8Array(e.length));
},
nodebuffer: h
};
r.transformTo = function(e, t) {
t || (t = "");
if (!e) return t;
r.checkSupport(e);
var i = r.getTypeOf(t);
return c[i][e](t);
};
r.getTypeOf = function(e) {
return "string" == typeof e ? "string" : "[object Array]" === Object.prototype.toString.call(e) ? "array" : i.nodebuffer && s.isBuffer(e) ? "nodebuffer" : i.uint8array && e instanceof Uint8Array ? "uint8array" : i.arraybuffer && e instanceof ArrayBuffer ? "arraybuffer" : void 0;
};
r.checkSupport = function(e) {
if (!i[e.toLowerCase()]) throw new Error(e + " is not supported by this platform");
};
r.MAX_VALUE_16BITS = 65535;
r.MAX_VALUE_32BITS = -1;
r.pretty = function(e) {
var t, r, i = "";
for (r = 0; r < (e || "").length; r++) i += "\\x" + ((t = e.charCodeAt(r)) < 16 ? "0" : "") + t.toString(16).toUpperCase();
return i;
};
r.delay = function(e, t, r) {
a(function() {
e.apply(r || null, t || []);
});
};
r.inherits = function(e, t) {
var r = function() {};
r.prototype = t.prototype;
e.prototype = new r();
};
r.extend = function() {
var e, t, r = {};
for (e = 0; e < arguments.length; e++) for (t in arguments[e]) arguments[e].hasOwnProperty(t) && "undefined" == typeof r[t] && (r[t] = arguments[e][t]);
return r;
};
r.prepareContent = function(e, t, s, a, h) {
return o.Promise.resolve(t).then(function(e) {
return i.blob && (e instanceof Blob || -1 !== [ "[object File]", "[object Blob]" ].indexOf(Object.prototype.toString.call(e))) && "undefined" != typeof FileReader ? new o.Promise(function(t, r) {
var i = new FileReader();
i.onload = function(e) {
t(e.target.result);
};
i.onerror = function(e) {
r(e.target.error);
};
i.readAsArrayBuffer(e);
}) : e;
}).then(function(t) {
var f, l = r.getTypeOf(t);
if (!l) return o.Promise.reject(new Error("Can't read the data of '" + e + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
"arraybuffer" === l ? t = r.transformTo("uint8array", t) : "string" === l && (h ? t = n.decode(t) : s && !0 !== a && (t = u(f = t, i.uint8array ? new Uint8Array(f.length) : new Array(f.length))));
return t;
});
};
}, {
"./base64": 1,
"./external": 6,
"./nodejsUtils": 14,
"./support": 30,
"set-immediate-shim": 54
} ],
33: [ function(e, t) {
"use strict";
var r = e("./reader/readerFor"), i = e("./utils"), n = e("./signature"), s = e("./zipEntry"), a = (e("./utf8"), 
e("./support"));
function o(e) {
this.files = [];
this.loadOptions = e;
}
o.prototype = {
checkSignature: function(e) {
if (!this.reader.readAndCheckSignature(e)) {
this.reader.index -= 4;
var t = this.reader.readString(4);
throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t) + ", expected " + i.pretty(e) + ")");
}
},
isSignature: function(e, t) {
var r = this.reader.index;
this.reader.setIndex(e);
var i = this.reader.readString(4) === t;
this.reader.setIndex(r);
return i;
},
readBlockEndOfCentral: function() {
this.diskNumber = this.reader.readInt(2);
this.diskWithCentralDirStart = this.reader.readInt(2);
this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
this.centralDirRecords = this.reader.readInt(2);
this.centralDirSize = this.reader.readInt(4);
this.centralDirOffset = this.reader.readInt(4);
this.zipCommentLength = this.reader.readInt(2);
var e = this.reader.readData(this.zipCommentLength), t = a.uint8array ? "uint8array" : "array", r = i.transformTo(t, e);
this.zipComment = this.loadOptions.decodeFileName(r);
},
readBlockZip64EndOfCentral: function() {
this.zip64EndOfCentralSize = this.reader.readInt(8);
this.reader.skip(4);
this.diskNumber = this.reader.readInt(4);
this.diskWithCentralDirStart = this.reader.readInt(4);
this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
this.centralDirRecords = this.reader.readInt(8);
this.centralDirSize = this.reader.readInt(8);
this.centralDirOffset = this.reader.readInt(8);
this.zip64ExtensibleData = {};
for (var e, t, r, i = this.zip64EndOfCentralSize - 44; 0 < i; ) {
e = this.reader.readInt(2);
t = this.reader.readInt(4);
r = this.reader.readData(t);
this.zip64ExtensibleData[e] = {
id: e,
length: t,
value: r
};
}
},
readBlockZip64EndOfCentralLocator: function() {
this.diskWithZip64CentralDirStart = this.reader.readInt(4);
this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
this.disksCount = this.reader.readInt(4);
if (this.disksCount > 1) throw new Error("Multi-volumes zip are not supported");
},
readLocalFiles: function() {
var e, t;
for (e = 0; e < this.files.length; e++) {
t = this.files[e];
this.reader.setIndex(t.localHeaderOffset);
this.checkSignature(n.LOCAL_FILE_HEADER);
t.readLocalPart(this.reader);
t.handleUTF8();
t.processAttributes();
}
},
readCentralDir: function() {
var e;
this.reader.setIndex(this.centralDirOffset);
for (;this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER); ) {
(e = new s({
zip64: this.zip64
}, this.loadOptions)).readCentralPart(this.reader);
this.files.push(e);
}
if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
},
readEndOfCentral: function() {
var e = this.reader.lastIndexOfSignature(n.CENTRAL_DIRECTORY_END);
if (e < 0) throw this.isSignature(0, n.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
this.reader.setIndex(e);
var t = e;
this.checkSignature(n.CENTRAL_DIRECTORY_END);
this.readBlockEndOfCentral();
if (this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
this.zip64 = !0;
if ((e = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
this.reader.setIndex(e);
this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
this.readBlockZip64EndOfCentralLocator();
if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, n.ZIP64_CENTRAL_DIRECTORY_END)) {
this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(n.ZIP64_CENTRAL_DIRECTORY_END);
if (this.relativeOffsetEndOfZip64CentralDir < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
}
this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END);
this.readBlockZip64EndOfCentral();
}
var r = this.centralDirOffset + this.centralDirSize;
if (this.zip64) {
r += 20;
r += 12 + this.zip64EndOfCentralSize;
}
var s = t - r;
if (s > 0) this.isSignature(t, n.CENTRAL_FILE_HEADER) || (this.reader.zero = s); else if (s < 0) throw new Error("Corrupted zip: missing " + Math.abs(s) + " bytes.");
},
prepareReader: function(e) {
this.reader = r(e);
},
load: function(e) {
this.prepareReader(e);
this.readEndOfCentral();
this.readCentralDir();
this.readLocalFiles();
}
};
t.exports = o;
}, {
"./reader/readerFor": 22,
"./signature": 23,
"./support": 30,
"./utf8": 31,
"./utils": 32,
"./zipEntry": 34
} ],
34: [ function(e, t) {
"use strict";
var r = e("./reader/readerFor"), i = e("./utils"), n = e("./compressedObject"), s = e("./crc32"), a = e("./utf8"), o = e("./compressions"), h = e("./support"), u = function(e) {
for (var t in o) if (o.hasOwnProperty(t) && o[t].magic === e) return o[t];
return null;
};
function f(e, t) {
this.options = e;
this.loadOptions = t;
}
f.prototype = {
isEncrypted: function() {
return 1 == (1 & this.bitFlag);
},
useUTF8: function() {
return 2048 == (2048 & this.bitFlag);
},
readLocalPart: function(e) {
var t, r;
e.skip(22);
this.fileNameLength = e.readInt(2);
r = e.readInt(2);
this.fileName = e.readData(this.fileNameLength);
e.skip(r);
if (-1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
if (null === (t = u(this.compressionMethod))) throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, t, e.readData(this.compressedSize));
},
readCentralPart: function(e) {
this.versionMadeBy = e.readInt(2);
e.skip(2);
this.bitFlag = e.readInt(2);
this.compressionMethod = e.readString(2);
this.date = e.readDate();
this.crc32 = e.readInt(4);
this.compressedSize = e.readInt(4);
this.uncompressedSize = e.readInt(4);
var t = e.readInt(2);
this.extraFieldsLength = e.readInt(2);
this.fileCommentLength = e.readInt(2);
this.diskNumberStart = e.readInt(2);
this.internalFileAttributes = e.readInt(2);
this.externalFileAttributes = e.readInt(4);
this.localHeaderOffset = e.readInt(4);
if (this.isEncrypted()) throw new Error("Encrypted zip are not supported");
e.skip(t);
this.readExtraFields(e);
this.parseZIP64ExtraField(e);
this.fileComment = e.readData(this.fileCommentLength);
},
processAttributes: function() {
this.unixPermissions = null;
this.dosPermissions = null;
var e = this.versionMadeBy >> 8;
this.dir = !!(16 & this.externalFileAttributes);
0 === e && (this.dosPermissions = 63 & this.externalFileAttributes);
3 === e && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535);
this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0);
},
parseZIP64ExtraField: function() {
if (this.extraFields[1]) {
var e = r(this.extraFields[1].value);
this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8));
this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8));
this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8));
this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4));
}
},
readExtraFields: function(e) {
var t, r, i, n = e.index + this.extraFieldsLength;
this.extraFields || (this.extraFields = {});
for (;e.index < n; ) {
t = e.readInt(2);
r = e.readInt(2);
i = e.readData(r);
this.extraFields[t] = {
id: t,
length: r,
value: i
};
}
},
handleUTF8: function() {
var e = h.uint8array ? "uint8array" : "array";
if (this.useUTF8()) {
this.fileNameStr = a.utf8decode(this.fileName);
this.fileCommentStr = a.utf8decode(this.fileComment);
} else {
var t = this.findExtraFieldUnicodePath();
if (null !== t) this.fileNameStr = t; else {
var r = i.transformTo(e, this.fileName);
this.fileNameStr = this.loadOptions.decodeFileName(r);
}
var n = this.findExtraFieldUnicodeComment();
if (null !== n) this.fileCommentStr = n; else {
var s = i.transformTo(e, this.fileComment);
this.fileCommentStr = this.loadOptions.decodeFileName(s);
}
}
},
findExtraFieldUnicodePath: function() {
var e = this.extraFields[28789];
if (e) {
var t = r(e.value);
return 1 !== t.readInt(1) ? null : s(this.fileName) !== t.readInt(4) ? null : a.utf8decode(t.readData(e.length - 5));
}
return null;
},
findExtraFieldUnicodeComment: function() {
var e = this.extraFields[25461];
if (e) {
var t = r(e.value);
return 1 !== t.readInt(1) ? null : s(this.fileComment) !== t.readInt(4) ? null : a.utf8decode(t.readData(e.length - 5));
}
return null;
}
};
t.exports = f;
}, {
"./compressedObject": 2,
"./compressions": 3,
"./crc32": 4,
"./reader/readerFor": 22,
"./support": 30,
"./utf8": 31,
"./utils": 32
} ],
35: [ function(e, t) {
"use strict";
var r = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), n = e("./utf8"), s = e("./compressedObject"), a = e("./stream/GenericWorker"), o = function(e, t, r) {
this.name = e;
this.dir = r.dir;
this.date = r.date;
this.comment = r.comment;
this.unixPermissions = r.unixPermissions;
this.dosPermissions = r.dosPermissions;
this._data = t;
this._dataBinary = r.binary;
this.options = {
compression: r.compression,
compressionOptions: r.compressionOptions
};
};
o.prototype = {
internalStream: function(e) {
var t = null, i = "string";
try {
if (!e) throw new Error("No output type specified.");
var s = "string" === (i = e.toLowerCase()) || "text" === i;
"binarystring" !== i && "text" !== i || (i = "string");
t = this._decompressWorker();
var o = !this._dataBinary;
o && !s && (t = t.pipe(new n.Utf8EncodeWorker()));
!o && s && (t = t.pipe(new n.Utf8DecodeWorker()));
} catch (e) {
(t = new a("error")).error(e);
}
return new r(t, i, "");
},
async: function(e, t) {
return this.internalStream(e).accumulate(t);
},
nodeStream: function(e, t) {
return this.internalStream(e || "nodebuffer").toNodejsStream(t);
},
_compressWorker: function(e, t) {
if (this._data instanceof s && this._data.compression.magic === e.magic) return this._data.getCompressedWorker();
var r = this._decompressWorker();
this._dataBinary || (r = r.pipe(new n.Utf8EncodeWorker()));
return s.createWorkerFrom(r, e, t);
},
_decompressWorker: function() {
return this._data instanceof s ? this._data.getContentWorker() : this._data instanceof a ? this._data : new i(this._data);
}
};
for (var h = [ "asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer" ], u = function() {
throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
}, f = 0; f < h.length; f++) o.prototype[h[f]] = u;
t.exports = o;
}, {
"./compressedObject": 2,
"./stream/DataWorker": 27,
"./stream/GenericWorker": 28,
"./stream/StreamHelper": 29,
"./utf8": 31
} ],
36: [ function(e, t) {
(function(e) {
"use strict";
var r, i, n = e.MutationObserver || e.WebKitMutationObserver;
if (n) {
var s = 0, a = new n(f), o = e.document.createTextNode("");
a.observe(o, {
characterData: !0
});
r = function() {
o.data = s = ++s % 2;
};
} else if (e.setImmediate || "undefined" == typeof e.MessageChannel) r = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function() {
var t = e.document.createElement("script");
t.onreadystatechange = function() {
f();
t.onreadystatechange = null;
t.parentNode.removeChild(t);
t = null;
};
e.document.documentElement.appendChild(t);
} : function() {
setTimeout(f, 0);
}; else {
var h = new e.MessageChannel();
h.port1.onmessage = f;
r = function() {
h.port2.postMessage(0);
};
}
var u = [];
function f() {
i = !0;
for (var e, t, r = u.length; r; ) {
t = u;
u = [];
e = -1;
for (;++e < r; ) t[e]();
r = u.length;
}
i = !1;
}
t.exports = function(e) {
1 !== u.push(e) || i || r();
};
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {} ],
37: [ function(e, t) {
"use strict";
var r = e("immediate");
function i() {}
var n = {}, s = [ "REJECTED" ], a = [ "FULFILLED" ], o = [ "PENDING" ];
t.exports = h;
function h(e) {
if ("function" != typeof e) throw new TypeError("resolver must be a function");
this.state = o;
this.queue = [];
this.outcome = void 0;
e !== i && d(this, e);
}
h.prototype.finally = function(e) {
if ("function" != typeof e) return this;
var t = this.constructor;
return this.then(function(r) {
return t.resolve(e()).then(function() {
return r;
});
}, function(r) {
return t.resolve(e()).then(function() {
throw r;
});
});
};
h.prototype.catch = function(e) {
return this.then(null, e);
};
h.prototype.then = function(e, t) {
if ("function" != typeof e && this.state === a || "function" != typeof t && this.state === s) return this;
var r = new this.constructor(i);
this.state !== o ? f(r, this.state === a ? e : t, this.outcome) : this.queue.push(new u(r, e, t));
return r;
};
function u(e, t, r) {
this.promise = e;
if ("function" == typeof t) {
this.onFulfilled = t;
this.callFulfilled = this.otherCallFulfilled;
}
if ("function" == typeof r) {
this.onRejected = r;
this.callRejected = this.otherCallRejected;
}
}
u.prototype.callFulfilled = function(e) {
n.resolve(this.promise, e);
};
u.prototype.otherCallFulfilled = function(e) {
f(this.promise, this.onFulfilled, e);
};
u.prototype.callRejected = function(e) {
n.reject(this.promise, e);
};
u.prototype.otherCallRejected = function(e) {
f(this.promise, this.onRejected, e);
};
function f(e, t, i) {
r(function() {
var r;
try {
r = t(i);
} catch (t) {
return n.reject(e, t);
}
r === e ? n.reject(e, new TypeError("Cannot resolve promise with itself")) : n.resolve(e, r);
});
}
n.resolve = function(e, t) {
var r = c(l, t);
if ("error" === r.status) return n.reject(e, r.value);
var i = r.value;
if (i) d(e, i); else {
e.state = a;
e.outcome = t;
for (var s = -1, o = e.queue.length; ++s < o; ) e.queue[s].callFulfilled(t);
}
return e;
};
n.reject = function(e, t) {
e.state = s;
e.outcome = t;
for (var r = -1, i = e.queue.length; ++r < i; ) e.queue[r].callRejected(t);
return e;
};
function l(e) {
var t = e && e.then;
if (e && ("object" == typeof e || "function" == typeof e) && "function" == typeof t) return function() {
t.apply(e, arguments);
};
}
function d(e, t) {
var r = !1;
function i(t) {
if (!r) {
r = !0;
n.reject(e, t);
}
}
function s(t) {
if (!r) {
r = !0;
n.resolve(e, t);
}
}
var a = c(function() {
t(s, i);
});
"error" === a.status && i(a.value);
}
function c(e, t) {
var r = {};
try {
r.value = e(t);
r.status = "success";
} catch (e) {
r.status = "error";
r.value = e;
}
return r;
}
h.resolve = function(e) {
return e instanceof this ? e : n.resolve(new this(i), e);
};
h.reject = function(e) {
var t = new this(i);
return n.reject(t, e);
};
h.all = function(e) {
var t = this;
if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
var r = e.length, s = !1;
if (!r) return this.resolve([]);
for (var a = new Array(r), o = 0, h = -1, u = new this(i); ++h < r; ) f(e[h], h);
return u;
function f(e, i) {
t.resolve(e).then(function(e) {
a[i] = e;
if (++o === r && !s) {
s = !0;
n.resolve(u, a);
}
}, function(e) {
if (!s) {
s = !0;
n.reject(u, e);
}
});
}
};
h.race = function(e) {
if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
var t = e.length, r = !1;
if (!t) return this.resolve([]);
for (var s, a = -1, o = new this(i); ++a < t; ) s = e[a], this.resolve(s).then(function(e) {
if (!r) {
r = !0;
n.resolve(o, e);
}
}, function(e) {
if (!r) {
r = !0;
n.reject(o, e);
}
});
return o;
};
}, {
immediate: 36
} ],
38: [ function(e, t) {
"use strict";
var r = {};
(0, e("./lib/utils/common").assign)(r, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants"));
t.exports = r;
}, {
"./lib/deflate": 39,
"./lib/inflate": 40,
"./lib/utils/common": 41,
"./lib/zlib/constants": 44
} ],
39: [ function(e, t, r) {
"use strict";
var i = e("./zlib/deflate"), n = e("./utils/common"), s = e("./utils/strings"), a = e("./zlib/messages"), o = e("./zlib/zstream"), h = Object.prototype.toString, u = 0, f = -1, l = 0, d = 8;
function c(e) {
if (!(this instanceof c)) return new c(e);
this.options = n.assign({
level: f,
method: d,
chunkSize: 16384,
windowBits: 15,
memLevel: 8,
strategy: l,
to: ""
}, e || {});
var t = this.options;
t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16);
this.err = 0;
this.msg = "";
this.ended = !1;
this.chunks = [];
this.strm = new o();
this.strm.avail_out = 0;
var r = i.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
if (r !== u) throw new Error(a[r]);
t.header && i.deflateSetHeader(this.strm, t.header);
if (t.dictionary) {
var p;
p = "string" == typeof t.dictionary ? s.string2buf(t.dictionary) : "[object ArrayBuffer]" === h.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary;
if ((r = i.deflateSetDictionary(this.strm, p)) !== u) throw new Error(a[r]);
this._dict_set = !0;
}
}
c.prototype.push = function(e, t) {
var r, a, o = this.strm, f = this.options.chunkSize;
if (this.ended) return !1;
a = t === ~~t ? t : !0 === t ? 4 : 0;
"string" == typeof e ? o.input = s.string2buf(e) : "[object ArrayBuffer]" === h.call(e) ? o.input = new Uint8Array(e) : o.input = e;
o.next_in = 0;
o.avail_in = o.input.length;
do {
if (0 === o.avail_out) {
o.output = new n.Buf8(f);
o.next_out = 0;
o.avail_out = f;
}
if (1 !== (r = i.deflate(o, a)) && r !== u) {
this.onEnd(r);
this.ended = !0;
return !1;
}
0 !== o.avail_out && (0 !== o.avail_in || 4 !== a && 2 !== a) || ("string" === this.options.to ? this.onData(s.buf2binstring(n.shrinkBuf(o.output, o.next_out))) : this.onData(n.shrinkBuf(o.output, o.next_out)));
} while ((o.avail_in > 0 || 0 === o.avail_out) && 1 !== r);
if (4 === a) {
r = i.deflateEnd(this.strm);
this.onEnd(r);
this.ended = !0;
return r === u;
}
if (2 === a) {
this.onEnd(u);
o.avail_out = 0;
return !0;
}
return !0;
};
c.prototype.onData = function(e) {
this.chunks.push(e);
};
c.prototype.onEnd = function(e) {
e === u && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks));
this.chunks = [];
this.err = e;
this.msg = this.strm.msg;
};
function p(e, t) {
var r = new c(t);
r.push(e, !0);
if (r.err) throw r.msg || a[r.err];
return r.result;
}
r.Deflate = c;
r.deflate = p;
r.deflateRaw = function(e, t) {
(t = t || {}).raw = !0;
return p(e, t);
};
r.gzip = function(e, t) {
(t = t || {}).gzip = !0;
return p(e, t);
};
}, {
"./utils/common": 41,
"./utils/strings": 42,
"./zlib/deflate": 46,
"./zlib/messages": 51,
"./zlib/zstream": 53
} ],
40: [ function(e, t, r) {
"use strict";
var i = e("./zlib/inflate"), n = e("./utils/common"), s = e("./utils/strings"), a = e("./zlib/constants"), o = e("./zlib/messages"), h = e("./zlib/zstream"), u = e("./zlib/gzheader"), f = Object.prototype.toString;
function l(e) {
if (!(this instanceof l)) return new l(e);
this.options = n.assign({
chunkSize: 16384,
windowBits: 0,
to: ""
}, e || {});
var t = this.options;
if (t.raw && t.windowBits >= 0 && t.windowBits < 16) {
t.windowBits = -t.windowBits;
0 === t.windowBits && (t.windowBits = -15);
}
!(t.windowBits >= 0 && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32);
t.windowBits > 15 && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15);
this.err = 0;
this.msg = "";
this.ended = !1;
this.chunks = [];
this.strm = new h();
this.strm.avail_out = 0;
var r = i.inflateInit2(this.strm, t.windowBits);
if (r !== a.Z_OK) throw new Error(o[r]);
this.header = new u();
i.inflateGetHeader(this.strm, this.header);
}
l.prototype.push = function(e, t) {
var r, o, h, u, l, d, c = this.strm, p = this.options.chunkSize, m = this.options.dictionary, _ = !1;
if (this.ended) return !1;
o = t === ~~t ? t : !0 === t ? a.Z_FINISH : a.Z_NO_FLUSH;
"string" == typeof e ? c.input = s.binstring2buf(e) : "[object ArrayBuffer]" === f.call(e) ? c.input = new Uint8Array(e) : c.input = e;
c.next_in = 0;
c.avail_in = c.input.length;
do {
if (0 === c.avail_out) {
c.output = new n.Buf8(p);
c.next_out = 0;
c.avail_out = p;
}
if ((r = i.inflate(c, a.Z_NO_FLUSH)) === a.Z_NEED_DICT && m) {
d = "string" == typeof m ? s.string2buf(m) : "[object ArrayBuffer]" === f.call(m) ? new Uint8Array(m) : m;
r = i.inflateSetDictionary(this.strm, d);
}
if (r === a.Z_BUF_ERROR && !0 === _) {
r = a.Z_OK;
_ = !1;
}
if (r !== a.Z_STREAM_END && r !== a.Z_OK) {
this.onEnd(r);
this.ended = !0;
return !1;
}
if (c.next_out && (0 === c.avail_out || r === a.Z_STREAM_END || 0 === c.avail_in && (o === a.Z_FINISH || o === a.Z_SYNC_FLUSH))) if ("string" === this.options.to) {
h = s.utf8border(c.output, c.next_out);
u = c.next_out - h;
l = s.buf2string(c.output, h);
c.next_out = u;
c.avail_out = p - u;
u && n.arraySet(c.output, c.output, h, u, 0);
this.onData(l);
} else this.onData(n.shrinkBuf(c.output, c.next_out));
0 === c.avail_in && 0 === c.avail_out && (_ = !0);
} while ((c.avail_in > 0 || 0 === c.avail_out) && r !== a.Z_STREAM_END);
r === a.Z_STREAM_END && (o = a.Z_FINISH);
if (o === a.Z_FINISH) {
r = i.inflateEnd(this.strm);
this.onEnd(r);
this.ended = !0;
return r === a.Z_OK;
}
if (o === a.Z_SYNC_FLUSH) {
this.onEnd(a.Z_OK);
c.avail_out = 0;
return !0;
}
return !0;
};
l.prototype.onData = function(e) {
this.chunks.push(e);
};
l.prototype.onEnd = function(e) {
e === a.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks));
this.chunks = [];
this.err = e;
this.msg = this.strm.msg;
};
function d(e, t) {
var r = new l(t);
r.push(e, !0);
if (r.err) throw r.msg || o[r.err];
return r.result;
}
r.Inflate = l;
r.inflate = d;
r.inflateRaw = function(e, t) {
(t = t || {}).raw = !0;
return d(e, t);
};
r.ungzip = d;
}, {
"./utils/common": 41,
"./utils/strings": 42,
"./zlib/constants": 44,
"./zlib/gzheader": 47,
"./zlib/inflate": 49,
"./zlib/messages": 51,
"./zlib/zstream": 53
} ],
41: [ function(e, t, r) {
"use strict";
var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
r.assign = function(e) {
for (var t = Array.prototype.slice.call(arguments, 1); t.length; ) {
var r = t.shift();
if (r) {
if ("object" != typeof r) throw new TypeError(r + "must be non-object");
for (var i in r) r.hasOwnProperty(i) && (e[i] = r[i]);
}
}
return e;
};
r.shrinkBuf = function(e, t) {
if (e.length === t) return e;
if (e.subarray) return e.subarray(0, t);
e.length = t;
return e;
};
var n = {
arraySet: function(e, t, r, i, n) {
if (t.subarray && e.subarray) e.set(t.subarray(r, r + i), n); else for (var s = 0; s < i; s++) e[n + s] = t[r + s];
},
flattenChunks: function(e) {
var t, r, i, n, s, a;
i = 0;
for (t = 0, r = e.length; t < r; t++) i += e[t].length;
a = new Uint8Array(i);
n = 0;
for (t = 0, r = e.length; t < r; t++) {
s = e[t];
a.set(s, n);
n += s.length;
}
return a;
}
}, s = {
arraySet: function(e, t, r, i, n) {
for (var s = 0; s < i; s++) e[n + s] = t[r + s];
},
flattenChunks: function(e) {
return [].concat.apply([], e);
}
};
r.setTyped = function(e) {
if (e) {
r.Buf8 = Uint8Array;
r.Buf16 = Uint16Array;
r.Buf32 = Int32Array;
r.assign(r, n);
} else {
r.Buf8 = Array;
r.Buf16 = Array;
r.Buf32 = Array;
r.assign(r, s);
}
};
r.setTyped(i);
}, {} ],
42: [ function(e, t, r) {
"use strict";
var i = e("./common"), n = !0, s = !0;
try {
String.fromCharCode.apply(null, [ 0 ]);
} catch (e) {
n = !1;
}
try {
String.fromCharCode.apply(null, new Uint8Array(1));
} catch (e) {
s = !1;
}
for (var a = new i.Buf8(256), o = 0; o < 256; o++) a[o] = o >= 252 ? 6 : o >= 248 ? 5 : o >= 240 ? 4 : o >= 224 ? 3 : o >= 192 ? 2 : 1;
a[254] = a[254] = 1;
r.string2buf = function(e) {
var t, r, n, s, a, o = e.length, h = 0;
for (s = 0; s < o; s++) {
if (55296 == (64512 & (r = e.charCodeAt(s))) && s + 1 < o && 56320 == (64512 & (n = e.charCodeAt(s + 1)))) {
r = 65536 + (r - 55296 << 10) + (n - 56320);
s++;
}
h += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
}
t = new i.Buf8(h);
for (a = 0, s = 0; a < h; s++) {
if (55296 == (64512 & (r = e.charCodeAt(s))) && s + 1 < o && 56320 == (64512 & (n = e.charCodeAt(s + 1)))) {
r = 65536 + (r - 55296 << 10) + (n - 56320);
s++;
}
if (r < 128) t[a++] = r; else if (r < 2048) {
t[a++] = 192 | r >>> 6;
t[a++] = 128 | 63 & r;
} else if (r < 65536) {
t[a++] = 224 | r >>> 12;
t[a++] = 128 | r >>> 6 & 63;
t[a++] = 128 | 63 & r;
} else {
t[a++] = 240 | r >>> 18;
t[a++] = 128 | r >>> 12 & 63;
t[a++] = 128 | r >>> 6 & 63;
t[a++] = 128 | 63 & r;
}
}
return t;
};
function h(e, t) {
if (t < 65537 && (e.subarray && s || !e.subarray && n)) return String.fromCharCode.apply(null, i.shrinkBuf(e, t));
for (var r = "", a = 0; a < t; a++) r += String.fromCharCode(e[a]);
return r;
}
r.buf2binstring = function(e) {
return h(e, e.length);
};
r.binstring2buf = function(e) {
for (var t = new i.Buf8(e.length), r = 0, n = t.length; r < n; r++) t[r] = e.charCodeAt(r);
return t;
};
r.buf2string = function(e, t) {
var r, i, n, s, o = t || e.length, u = new Array(2 * o);
for (i = 0, r = 0; r < o; ) if ((n = e[r++]) < 128) u[i++] = n; else if ((s = a[n]) > 4) {
u[i++] = 65533;
r += s - 1;
} else {
n &= 2 === s ? 31 : 3 === s ? 15 : 7;
for (;s > 1 && r < o; ) {
n = n << 6 | 63 & e[r++];
s--;
}
if (s > 1) u[i++] = 65533; else if (n < 65536) u[i++] = n; else {
n -= 65536;
u[i++] = 55296 | n >> 10 & 1023;
u[i++] = 56320 | 1023 & n;
}
}
return h(u, i);
};
r.utf8border = function(e, t) {
var r;
(t = t || e.length) > e.length && (t = e.length);
r = t - 1;
for (;r >= 0 && 128 == (192 & e[r]); ) r--;
return r < 0 ? t : 0 === r ? t : r + a[e[r]] > t ? r : t;
};
}, {
"./common": 41
} ],
43: [ function(e, t) {
"use strict";
t.exports = function(e, t, r, i) {
for (var n = 65535 & e | 0, s = e >>> 16 & 65535 | 0, a = 0; 0 !== r; ) {
r -= a = r > 2e3 ? 2e3 : r;
do {
s = s + (n = n + t[i++] | 0) | 0;
} while (--a);
n %= 65521;
s %= 65521;
}
return n | s << 16 | 0;
};
}, {} ],
44: [ function(e, t) {
"use strict";
t.exports = {
Z_NO_FLUSH: 0,
Z_PARTIAL_FLUSH: 1,
Z_SYNC_FLUSH: 2,
Z_FULL_FLUSH: 3,
Z_FINISH: 4,
Z_BLOCK: 5,
Z_TREES: 6,
Z_OK: 0,
Z_STREAM_END: 1,
Z_NEED_DICT: 2,
Z_ERRNO: -1,
Z_STREAM_ERROR: -2,
Z_DATA_ERROR: -3,
Z_BUF_ERROR: -5,
Z_NO_COMPRESSION: 0,
Z_BEST_SPEED: 1,
Z_BEST_COMPRESSION: 9,
Z_DEFAULT_COMPRESSION: -1,
Z_FILTERED: 1,
Z_HUFFMAN_ONLY: 2,
Z_RLE: 3,
Z_FIXED: 4,
Z_DEFAULT_STRATEGY: 0,
Z_BINARY: 0,
Z_TEXT: 1,
Z_UNKNOWN: 2,
Z_DEFLATED: 8
};
}, {} ],
45: [ function(e, t) {
"use strict";
var r = function() {
for (var e, t = [], r = 0; r < 256; r++) {
e = r;
for (var i = 0; i < 8; i++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
t[r] = e;
}
return t;
}();
t.exports = function(e, t, i, n) {
var s = r, a = n + i;
e ^= -1;
for (var o = n; o < a; o++) e = e >>> 8 ^ s[255 & (e ^ t[o])];
return -1 ^ e;
};
}, {} ],
46: [ function(e, t, r) {
"use strict";
var i, n = e("../utils/common"), s = e("./trees"), a = e("./adler32"), o = e("./crc32"), h = e("./messages"), u = 0, f = 4, l = 0, d = -2, c = -1, p = 1, m = 4, _ = 2, g = 8, b = 9, v = 286, w = 30, y = 19, k = 2 * v + 1, x = 15, S = 3, z = 258, C = z + S + 1, E = 42, A = 113, I = 1, O = 2, B = 3, R = 4;
function T(e, t) {
e.msg = h[t];
return t;
}
function D(e) {
return (e << 1) - (e > 4 ? 9 : 0);
}
function F(e) {
for (var t = e.length; --t >= 0; ) e[t] = 0;
}
function N(e) {
var t = e.state, r = t.pending;
r > e.avail_out && (r = e.avail_out);
if (0 !== r) {
n.arraySet(e.output, t.pending_buf, t.pending_out, r, e.next_out);
e.next_out += r;
t.pending_out += r;
e.total_out += r;
e.avail_out -= r;
t.pending -= r;
0 === t.pending && (t.pending_out = 0);
}
}
function U(e, t) {
s._tr_flush_block(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t);
e.block_start = e.strstart;
N(e.strm);
}
function P(e, t) {
e.pending_buf[e.pending++] = t;
}
function L(e, t) {
e.pending_buf[e.pending++] = t >>> 8 & 255;
e.pending_buf[e.pending++] = 255 & t;
}
function j(e, t, r, i) {
var s = e.avail_in;
s > i && (s = i);
if (0 === s) return 0;
e.avail_in -= s;
n.arraySet(t, e.input, e.next_in, s, r);
1 === e.state.wrap ? e.adler = a(e.adler, t, s, r) : 2 === e.state.wrap && (e.adler = o(e.adler, t, s, r));
e.next_in += s;
e.total_in += s;
return s;
}
function Z(e, t) {
var r, i, n = e.max_chain_length, s = e.strstart, a = e.prev_length, o = e.nice_match, h = e.strstart > e.w_size - C ? e.strstart - (e.w_size - C) : 0, u = e.window, f = e.w_mask, l = e.prev, d = e.strstart + z, c = u[s + a - 1], p = u[s + a];
e.prev_length >= e.good_match && (n >>= 2);
o > e.lookahead && (o = e.lookahead);
do {
if (u[(r = t) + a] === p && u[r + a - 1] === c && u[r] === u[s] && u[++r] === u[s + 1]) {
s += 2;
r++;
do {} while (u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && s < d);
i = z - (d - s);
s = d - z;
if (i > a) {
e.match_start = t;
a = i;
if (i >= o) break;
c = u[s + a - 1];
p = u[s + a];
}
}
} while ((t = l[t & f]) > h && 0 != --n);
return a <= e.lookahead ? a : e.lookahead;
}
function W(e) {
var t, r, i, s, a, o = e.w_size;
do {
s = e.window_size - e.lookahead - e.strstart;
if (e.strstart >= o + (o - C)) {
n.arraySet(e.window, e.window, o, o, 0);
e.match_start -= o;
e.strstart -= o;
e.block_start -= o;
t = r = e.hash_size;
do {
i = e.head[--t];
e.head[t] = i >= o ? i - o : 0;
} while (--r);
t = r = o;
do {
i = e.prev[--t];
e.prev[t] = i >= o ? i - o : 0;
} while (--r);
s += o;
}
if (0 === e.strm.avail_in) break;
r = j(e.strm, e.window, e.strstart + e.lookahead, s);
e.lookahead += r;
if (e.lookahead + e.insert >= S) {
a = e.strstart - e.insert;
e.ins_h = e.window[a];
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[a + 1]) & e.hash_mask;
for (;e.insert; ) {
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[a + S - 1]) & e.hash_mask;
e.prev[a & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = a;
a++;
e.insert--;
if (e.lookahead + e.insert < S) break;
}
}
} while (e.lookahead < C && 0 !== e.strm.avail_in);
}
function M(e, t) {
for (var r, i; ;) {
if (e.lookahead < C) {
W(e);
if (e.lookahead < C && t === u) return I;
if (0 === e.lookahead) break;
}
r = 0;
if (e.lookahead >= S) {
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + S - 1]) & e.hash_mask;
r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = e.strstart;
}
0 !== r && e.strstart - r <= e.w_size - C && (e.match_length = Z(e, r));
if (e.match_length >= S) {
i = s._tr_tally(e, e.strstart - e.match_start, e.match_length - S);
e.lookahead -= e.match_length;
if (e.match_length <= e.max_lazy_match && e.lookahead >= S) {
e.match_length--;
do {
e.strstart++;
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + S - 1]) & e.hash_mask;
r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = e.strstart;
} while (0 != --e.match_length);
e.strstart++;
} else {
e.strstart += e.match_length;
e.match_length = 0;
e.ins_h = e.window[e.strstart];
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
}
} else {
i = s._tr_tally(e, 0, e.window[e.strstart]);
e.lookahead--;
e.strstart++;
}
if (i) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
}
e.insert = e.strstart < S - 1 ? e.strstart : S - 1;
if (t === f) {
U(e, !0);
return 0 === e.strm.avail_out ? B : R;
}
if (e.last_lit) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
return O;
}
function H(e, t) {
for (var r, i, n; ;) {
if (e.lookahead < C) {
W(e);
if (e.lookahead < C && t === u) return I;
if (0 === e.lookahead) break;
}
r = 0;
if (e.lookahead >= S) {
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + S - 1]) & e.hash_mask;
r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = e.strstart;
}
e.prev_length = e.match_length;
e.prev_match = e.match_start;
e.match_length = S - 1;
if (0 !== r && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - C) {
e.match_length = Z(e, r);
e.match_length <= 5 && (e.strategy === p || e.match_length === S && e.strstart - e.match_start > 4096) && (e.match_length = S - 1);
}
if (e.prev_length >= S && e.match_length <= e.prev_length) {
n = e.strstart + e.lookahead - S;
i = s._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - S);
e.lookahead -= e.prev_length - 1;
e.prev_length -= 2;
do {
if (++e.strstart <= n) {
e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + S - 1]) & e.hash_mask;
r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h];
e.head[e.ins_h] = e.strstart;
}
} while (0 != --e.prev_length);
e.match_available = 0;
e.match_length = S - 1;
e.strstart++;
if (i) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
} else if (e.match_available) {
(i = s._tr_tally(e, 0, e.window[e.strstart - 1])) && U(e, !1);
e.strstart++;
e.lookahead--;
if (0 === e.strm.avail_out) return I;
} else {
e.match_available = 1;
e.strstart++;
e.lookahead--;
}
}
if (e.match_available) {
i = s._tr_tally(e, 0, e.window[e.strstart - 1]);
e.match_available = 0;
}
e.insert = e.strstart < S - 1 ? e.strstart : S - 1;
if (t === f) {
U(e, !0);
return 0 === e.strm.avail_out ? B : R;
}
if (e.last_lit) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
return O;
}
function G(e, t) {
for (var r, i, n, a, o = e.window; ;) {
if (e.lookahead <= z) {
W(e);
if (e.lookahead <= z && t === u) return I;
if (0 === e.lookahead) break;
}
e.match_length = 0;
if (e.lookahead >= S && e.strstart > 0 && (i = o[n = e.strstart - 1]) === o[++n] && i === o[++n] && i === o[++n]) {
a = e.strstart + z;
do {} while (i === o[++n] && i === o[++n] && i === o[++n] && i === o[++n] && i === o[++n] && i === o[++n] && i === o[++n] && i === o[++n] && n < a);
e.match_length = z - (a - n);
e.match_length > e.lookahead && (e.match_length = e.lookahead);
}
if (e.match_length >= S) {
r = s._tr_tally(e, 1, e.match_length - S);
e.lookahead -= e.match_length;
e.strstart += e.match_length;
e.match_length = 0;
} else {
r = s._tr_tally(e, 0, e.window[e.strstart]);
e.lookahead--;
e.strstart++;
}
if (r) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
}
e.insert = 0;
if (t === f) {
U(e, !0);
return 0 === e.strm.avail_out ? B : R;
}
if (e.last_lit) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
return O;
}
function K(e, t) {
for (var r; ;) {
if (0 === e.lookahead) {
W(e);
if (0 === e.lookahead) {
if (t === u) return I;
break;
}
}
e.match_length = 0;
r = s._tr_tally(e, 0, e.window[e.strstart]);
e.lookahead--;
e.strstart++;
if (r) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
}
e.insert = 0;
if (t === f) {
U(e, !0);
return 0 === e.strm.avail_out ? B : R;
}
if (e.last_lit) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
return O;
}
function Y(e, t, r, i, n) {
this.good_length = e;
this.max_lazy = t;
this.nice_length = r;
this.max_chain = i;
this.func = n;
}
i = [ new Y(0, 0, 0, 0, function(e, t) {
var r = 65535;
r > e.pending_buf_size - 5 && (r = e.pending_buf_size - 5);
for (;;) {
if (e.lookahead <= 1) {
W(e);
if (0 === e.lookahead && t === u) return I;
if (0 === e.lookahead) break;
}
e.strstart += e.lookahead;
e.lookahead = 0;
var i = e.block_start + r;
if (0 === e.strstart || e.strstart >= i) {
e.lookahead = e.strstart - i;
e.strstart = i;
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
if (e.strstart - e.block_start >= e.w_size - C) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
}
e.insert = 0;
if (t === f) {
U(e, !0);
return 0 === e.strm.avail_out ? B : R;
}
if (e.strstart > e.block_start) {
U(e, !1);
if (0 === e.strm.avail_out) return I;
}
return I;
}), new Y(4, 4, 8, 4, M), new Y(4, 5, 16, 8, M), new Y(4, 6, 32, 32, M), new Y(4, 4, 16, 16, H), new Y(8, 16, 32, 32, H), new Y(8, 16, 128, 128, H), new Y(8, 32, 128, 256, H), new Y(32, 128, 258, 1024, H), new Y(32, 258, 258, 4096, H) ];
function X(e) {
e.window_size = 2 * e.w_size;
F(e.head);
e.max_lazy_match = i[e.level].max_lazy;
e.good_match = i[e.level].good_length;
e.nice_match = i[e.level].nice_length;
e.max_chain_length = i[e.level].max_chain;
e.strstart = 0;
e.block_start = 0;
e.lookahead = 0;
e.insert = 0;
e.match_length = e.prev_length = S - 1;
e.match_available = 0;
e.ins_h = 0;
}
function V() {
this.strm = null;
this.status = 0;
this.pending_buf = null;
this.pending_buf_size = 0;
this.pending_out = 0;
this.pending = 0;
this.wrap = 0;
this.gzhead = null;
this.gzindex = 0;
this.method = g;
this.last_flush = -1;
this.w_size = 0;
this.w_bits = 0;
this.w_mask = 0;
this.window = null;
this.window_size = 0;
this.prev = null;
this.head = null;
this.ins_h = 0;
this.hash_size = 0;
this.hash_bits = 0;
this.hash_mask = 0;
this.hash_shift = 0;
this.block_start = 0;
this.match_length = 0;
this.prev_match = 0;
this.match_available = 0;
this.strstart = 0;
this.match_start = 0;
this.lookahead = 0;
this.prev_length = 0;
this.max_chain_length = 0;
this.max_lazy_match = 0;
this.level = 0;
this.strategy = 0;
this.good_match = 0;
this.nice_match = 0;
this.dyn_ltree = new n.Buf16(2 * k);
this.dyn_dtree = new n.Buf16(2 * (2 * w + 1));
this.bl_tree = new n.Buf16(2 * (2 * y + 1));
F(this.dyn_ltree);
F(this.dyn_dtree);
F(this.bl_tree);
this.l_desc = null;
this.d_desc = null;
this.bl_desc = null;
this.bl_count = new n.Buf16(x + 1);
this.heap = new n.Buf16(2 * v + 1);
F(this.heap);
this.heap_len = 0;
this.heap_max = 0;
this.depth = new n.Buf16(2 * v + 1);
F(this.depth);
this.l_buf = 0;
this.lit_bufsize = 0;
this.last_lit = 0;
this.d_buf = 0;
this.opt_len = 0;
this.static_len = 0;
this.matches = 0;
this.insert = 0;
this.bi_buf = 0;
this.bi_valid = 0;
}
function q(e) {
var t;
if (!e || !e.state) return T(e, d);
e.total_in = e.total_out = 0;
e.data_type = _;
(t = e.state).pending = 0;
t.pending_out = 0;
t.wrap < 0 && (t.wrap = -t.wrap);
t.status = t.wrap ? E : A;
e.adler = 2 === t.wrap ? 0 : 1;
t.last_flush = u;
s._tr_init(t);
return l;
}
function J(e) {
var t = q(e);
t === l && X(e.state);
return t;
}
function Q(e, t, r, i, s, a) {
if (!e) return d;
var o = 1;
t === c && (t = 6);
if (i < 0) {
o = 0;
i = -i;
} else if (i > 15) {
o = 2;
i -= 16;
}
if (s < 1 || s > b || r !== g || i < 8 || i > 15 || t < 0 || t > 9 || a < 0 || a > m) return T(e, d);
8 === i && (i = 9);
var h = new V();
e.state = h;
h.strm = e;
h.wrap = o;
h.gzhead = null;
h.w_bits = i;
h.w_size = 1 << h.w_bits;
h.w_mask = h.w_size - 1;
h.hash_bits = s + 7;
h.hash_size = 1 << h.hash_bits;
h.hash_mask = h.hash_size - 1;
h.hash_shift = ~~((h.hash_bits + S - 1) / S);
h.window = new n.Buf8(2 * h.w_size);
h.head = new n.Buf16(h.hash_size);
h.prev = new n.Buf16(h.w_size);
h.lit_bufsize = 1 << s + 6;
h.pending_buf_size = 4 * h.lit_bufsize;
h.pending_buf = new n.Buf8(h.pending_buf_size);
h.d_buf = 1 * h.lit_bufsize;
h.l_buf = 3 * h.lit_bufsize;
h.level = t;
h.strategy = a;
h.method = r;
return J(e);
}
r.deflateInit = function(e, t) {
return Q(e, t, g, 15, 8, 0);
};
r.deflateInit2 = Q;
r.deflateReset = J;
r.deflateResetKeep = q;
r.deflateSetHeader = function(e, t) {
if (!e || !e.state) return d;
if (2 !== e.state.wrap) return d;
e.state.gzhead = t;
return l;
};
r.deflate = function(e, t) {
var r, n, a, h;
if (!e || !e.state || t > 5 || t < 0) return e ? T(e, d) : d;
n = e.state;
if (!e.output || !e.input && 0 !== e.avail_in || 666 === n.status && t !== f) return T(e, 0 === e.avail_out ? -5 : d);
n.strm = e;
r = n.last_flush;
n.last_flush = t;
if (n.status === E) if (2 === n.wrap) {
e.adler = 0;
P(n, 31);
P(n, 139);
P(n, 8);
if (n.gzhead) {
P(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0));
P(n, 255 & n.gzhead.time);
P(n, n.gzhead.time >> 8 & 255);
P(n, n.gzhead.time >> 16 & 255);
P(n, n.gzhead.time >> 24 & 255);
P(n, 9 === n.level ? 2 : n.strategy >= 2 || n.level < 2 ? 4 : 0);
P(n, 255 & n.gzhead.os);
if (n.gzhead.extra && n.gzhead.extra.length) {
P(n, 255 & n.gzhead.extra.length);
P(n, n.gzhead.extra.length >> 8 & 255);
}
n.gzhead.hcrc && (e.adler = o(e.adler, n.pending_buf, n.pending, 0));
n.gzindex = 0;
n.status = 69;
} else {
P(n, 0);
P(n, 0);
P(n, 0);
P(n, 0);
P(n, 0);
P(n, 9 === n.level ? 2 : n.strategy >= 2 || n.level < 2 ? 4 : 0);
P(n, 3);
n.status = A;
}
} else {
var c = g + (n.w_bits - 8 << 4) << 8;
c |= (n.strategy >= 2 || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6;
0 !== n.strstart && (c |= 32);
c += 31 - c % 31;
n.status = A;
L(n, c);
if (0 !== n.strstart) {
L(n, e.adler >>> 16);
L(n, 65535 & e.adler);
}
e.adler = 1;
}
if (69 === n.status) if (n.gzhead.extra) {
a = n.pending;
for (;n.gzindex < (65535 & n.gzhead.extra.length); ) {
if (n.pending === n.pending_buf_size) {
n.gzhead.hcrc && n.pending > a && (e.adler = o(e.adler, n.pending_buf, n.pending - a, a));
N(e);
a = n.pending;
if (n.pending === n.pending_buf_size) break;
}
P(n, 255 & n.gzhead.extra[n.gzindex]);
n.gzindex++;
}
n.gzhead.hcrc && n.pending > a && (e.adler = o(e.adler, n.pending_buf, n.pending - a, a));
if (n.gzindex === n.gzhead.extra.length) {
n.gzindex = 0;
n.status = 73;
}
} else n.status = 73;
if (73 === n.status) if (n.gzhead.name) {
a = n.pending;
do {
if (n.pending === n.pending_buf_size) {
n.gzhead.hcrc && n.pending > a && (e.adler = o(e.adler, n.pending_buf, n.pending - a, a));
N(e);
a = n.pending;
if (n.pending === n.pending_buf_size) {
h = 1;
break;
}
}
h = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0;
P(n, h);
} while (0 !== h);
n.gzhead.hcrc && n.pending > a && (e.adler = o(e.adler, n.pending_buf, n.pending - a, a));
if (0 === h) {
n.gzindex = 0;
n.status = 91;
}
} else n.status = 91;
if (91 === n.status) if (n.gzhead.comment) {
a = n.pending;
do {
if (n.pending === n.pending_buf_size) {
n.gzhead.hcrc && n.pending > a && (e.adler = o(e.adler, n.pending_buf, n.pending - a, a));
N(e);
a = n.pending;
if (n.pending === n.pending_buf_size) {
h = 1;
break;
}
}
h = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0;
P(n, h);
} while (0 !== h);
n.gzhead.hcrc && n.pending > a && (e.adler = o(e.adler, n.pending_buf, n.pending - a, a));
0 === h && (n.status = 103);
} else n.status = 103;
if (103 === n.status) if (n.gzhead.hcrc) {
n.pending + 2 > n.pending_buf_size && N(e);
if (n.pending + 2 <= n.pending_buf_size) {
P(n, 255 & e.adler);
P(n, e.adler >> 8 & 255);
e.adler = 0;
n.status = A;
}
} else n.status = A;
if (0 !== n.pending) {
N(e);
if (0 === e.avail_out) {
n.last_flush = -1;
return l;
}
} else if (0 === e.avail_in && D(t) <= D(r) && t !== f) return T(e, -5);
if (666 === n.status && 0 !== e.avail_in) return T(e, -5);
if (0 !== e.avail_in || 0 !== n.lookahead || t !== u && 666 !== n.status) {
var p = 2 === n.strategy ? K(n, t) : 3 === n.strategy ? G(n, t) : i[n.level].func(n, t);
p !== B && p !== R || (n.status = 666);
if (p === I || p === B) {
0 === e.avail_out && (n.last_flush = -1);
return l;
}
if (p === O) {
if (1 === t) s._tr_align(n); else if (5 !== t) {
s._tr_stored_block(n, 0, 0, !1);
if (3 === t) {
F(n.head);
if (0 === n.lookahead) {
n.strstart = 0;
n.block_start = 0;
n.insert = 0;
}
}
}
N(e);
if (0 === e.avail_out) {
n.last_flush = -1;
return l;
}
}
}
if (t !== f) return l;
if (n.wrap <= 0) return 1;
if (2 === n.wrap) {
P(n, 255 & e.adler);
P(n, e.adler >> 8 & 255);
P(n, e.adler >> 16 & 255);
P(n, e.adler >> 24 & 255);
P(n, 255 & e.total_in);
P(n, e.total_in >> 8 & 255);
P(n, e.total_in >> 16 & 255);
P(n, e.total_in >> 24 & 255);
} else {
L(n, e.adler >>> 16);
L(n, 65535 & e.adler);
}
N(e);
n.wrap > 0 && (n.wrap = -n.wrap);
return 0 !== n.pending ? l : 1;
};
r.deflateEnd = function(e) {
var t;
if (!e || !e.state) return d;
if ((t = e.state.status) !== E && 69 !== t && 73 !== t && 91 !== t && 103 !== t && t !== A && 666 !== t) return T(e, d);
e.state = null;
return t === A ? T(e, -3) : l;
};
r.deflateSetDictionary = function(e, t) {
var r, i, s, o, h, u, f, c, p = t.length;
if (!e || !e.state) return d;
if (2 === (o = (r = e.state).wrap) || 1 === o && r.status !== E || r.lookahead) return d;
1 === o && (e.adler = a(e.adler, t, p, 0));
r.wrap = 0;
if (p >= r.w_size) {
if (0 === o) {
F(r.head);
r.strstart = 0;
r.block_start = 0;
r.insert = 0;
}
c = new n.Buf8(r.w_size);
n.arraySet(c, t, p - r.w_size, r.w_size, 0);
t = c;
p = r.w_size;
}
h = e.avail_in;
u = e.next_in;
f = e.input;
e.avail_in = p;
e.next_in = 0;
e.input = t;
W(r);
for (;r.lookahead >= S; ) {
i = r.strstart;
s = r.lookahead - (S - 1);
do {
r.ins_h = (r.ins_h << r.hash_shift ^ r.window[i + S - 1]) & r.hash_mask;
r.prev[i & r.w_mask] = r.head[r.ins_h];
r.head[r.ins_h] = i;
i++;
} while (--s);
r.strstart = i;
r.lookahead = S - 1;
W(r);
}
r.strstart += r.lookahead;
r.block_start = r.strstart;
r.insert = r.lookahead;
r.lookahead = 0;
r.match_length = r.prev_length = S - 1;
r.match_available = 0;
e.next_in = u;
e.input = f;
e.avail_in = h;
r.wrap = o;
return l;
};
r.deflateInfo = "pako deflate (from Nodeca project)";
}, {
"../utils/common": 41,
"./adler32": 43,
"./crc32": 45,
"./messages": 51,
"./trees": 52
} ],
47: [ function(e, t) {
"use strict";
t.exports = function() {
this.text = 0;
this.time = 0;
this.xflags = 0;
this.os = 0;
this.extra = null;
this.extra_len = 0;
this.name = "";
this.comment = "";
this.hcrc = 0;
this.done = !1;
};
}, {} ],
48: [ function(e, t) {
"use strict";
t.exports = function(e, t) {
var r, i, n, s, a, o, h, u, f, l, d, c, p, m, _, g, b, v, w, y, k, x, S, z, C;
r = e.state;
i = e.next_in;
z = e.input;
n = i + (e.avail_in - 5);
s = e.next_out;
C = e.output;
a = s - (t - e.avail_out);
o = s + (e.avail_out - 257);
h = r.dmax;
u = r.wsize;
f = r.whave;
l = r.wnext;
d = r.window;
c = r.hold;
p = r.bits;
m = r.lencode;
_ = r.distcode;
g = (1 << r.lenbits) - 1;
b = (1 << r.distbits) - 1;
e: do {
if (p < 15) {
c += z[i++] << p;
p += 8;
c += z[i++] << p;
p += 8;
}
v = m[c & g];
t: for (;;) {
c >>>= w = v >>> 24;
p -= w;
if (0 == (w = v >>> 16 & 255)) C[s++] = 65535 & v; else {
if (!(16 & w)) {
if (0 == (64 & w)) {
v = m[(65535 & v) + (c & (1 << w) - 1)];
continue t;
}
if (32 & w) {
r.mode = 12;
break e;
}
e.msg = "invalid literal/length code";
r.mode = 30;
break e;
}
y = 65535 & v;
if (w &= 15) {
if (p < w) {
c += z[i++] << p;
p += 8;
}
y += c & (1 << w) - 1;
c >>>= w;
p -= w;
}
if (p < 15) {
c += z[i++] << p;
p += 8;
c += z[i++] << p;
p += 8;
}
v = _[c & b];
r: for (;;) {
c >>>= w = v >>> 24;
p -= w;
if (!(16 & (w = v >>> 16 & 255))) {
if (0 == (64 & w)) {
v = _[(65535 & v) + (c & (1 << w) - 1)];
continue r;
}
e.msg = "invalid distance code";
r.mode = 30;
break e;
}
k = 65535 & v;
if (p < (w &= 15)) {
c += z[i++] << p;
if ((p += 8) < w) {
c += z[i++] << p;
p += 8;
}
}
if ((k += c & (1 << w) - 1) > h) {
e.msg = "invalid distance too far back";
r.mode = 30;
break e;
}
c >>>= w;
p -= w;
if (k > (w = s - a)) {
if ((w = k - w) > f && r.sane) {
e.msg = "invalid distance too far back";
r.mode = 30;
break e;
}
x = 0;
S = d;
if (0 === l) {
x += u - w;
if (w < y) {
y -= w;
do {
C[s++] = d[x++];
} while (--w);
x = s - k;
S = C;
}
} else if (l < w) {
x += u + l - w;
if ((w -= l) < y) {
y -= w;
do {
C[s++] = d[x++];
} while (--w);
x = 0;
if (l < y) {
y -= w = l;
do {
C[s++] = d[x++];
} while (--w);
x = s - k;
S = C;
}
}
} else {
x += l - w;
if (w < y) {
y -= w;
do {
C[s++] = d[x++];
} while (--w);
x = s - k;
S = C;
}
}
for (;y > 2; ) {
C[s++] = S[x++];
C[s++] = S[x++];
C[s++] = S[x++];
y -= 3;
}
if (y) {
C[s++] = S[x++];
y > 1 && (C[s++] = S[x++]);
}
} else {
x = s - k;
do {
C[s++] = C[x++];
C[s++] = C[x++];
C[s++] = C[x++];
y -= 3;
} while (y > 2);
if (y) {
C[s++] = C[x++];
y > 1 && (C[s++] = C[x++]);
}
}
break;
}
}
break;
}
} while (i < n && s < o);
i -= y = p >> 3;
c &= (1 << (p -= y << 3)) - 1;
e.next_in = i;
e.next_out = s;
e.avail_in = i < n ? n - i + 5 : 5 - (i - n);
e.avail_out = s < o ? o - s + 257 : 257 - (s - o);
r.hold = c;
r.bits = p;
};
}, {} ],
49: [ function(e, t, r) {
"use strict";
var i = e("../utils/common"), n = e("./adler32"), s = e("./crc32"), a = e("./inffast"), o = e("./inftrees"), h = 1, u = 2, f = 0, l = -2, d = 1, c = 852, p = 592;
function m(e) {
return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
}
function _() {
this.mode = 0;
this.last = !1;
this.wrap = 0;
this.havedict = !1;
this.flags = 0;
this.dmax = 0;
this.check = 0;
this.total = 0;
this.head = null;
this.wbits = 0;
this.wsize = 0;
this.whave = 0;
this.wnext = 0;
this.window = null;
this.hold = 0;
this.bits = 0;
this.length = 0;
this.offset = 0;
this.extra = 0;
this.lencode = null;
this.distcode = null;
this.lenbits = 0;
this.distbits = 0;
this.ncode = 0;
this.nlen = 0;
this.ndist = 0;
this.have = 0;
this.next = null;
this.lens = new i.Buf16(320);
this.work = new i.Buf16(288);
this.lendyn = null;
this.distdyn = null;
this.sane = 0;
this.back = 0;
this.was = 0;
}
function g(e) {
var t;
if (!e || !e.state) return l;
t = e.state;
e.total_in = e.total_out = t.total = 0;
e.msg = "";
t.wrap && (e.adler = 1 & t.wrap);
t.mode = d;
t.last = 0;
t.havedict = 0;
t.dmax = 32768;
t.head = null;
t.hold = 0;
t.bits = 0;
t.lencode = t.lendyn = new i.Buf32(c);
t.distcode = t.distdyn = new i.Buf32(p);
t.sane = 1;
t.back = -1;
return f;
}
function b(e) {
var t;
if (!e || !e.state) return l;
(t = e.state).wsize = 0;
t.whave = 0;
t.wnext = 0;
return g(e);
}
function v(e, t) {
var r, i;
if (!e || !e.state) return l;
i = e.state;
if (t < 0) {
r = 0;
t = -t;
} else {
r = 1 + (t >> 4);
t < 48 && (t &= 15);
}
if (t && (t < 8 || t > 15)) return l;
null !== i.window && i.wbits !== t && (i.window = null);
i.wrap = r;
i.wbits = t;
return b(e);
}
function w(e, t) {
var r, i;
if (!e) return l;
i = new _();
e.state = i;
i.window = null;
(r = v(e, t)) !== f && (e.state = null);
return r;
}
var y, k, x = !0;
function S(e) {
if (x) {
var t;
y = new i.Buf32(512);
k = new i.Buf32(32);
t = 0;
for (;t < 144; ) e.lens[t++] = 8;
for (;t < 256; ) e.lens[t++] = 9;
for (;t < 280; ) e.lens[t++] = 7;
for (;t < 288; ) e.lens[t++] = 8;
o(h, e.lens, 0, 288, y, 0, e.work, {
bits: 9
});
t = 0;
for (;t < 32; ) e.lens[t++] = 5;
o(u, e.lens, 0, 32, k, 0, e.work, {
bits: 5
});
x = !1;
}
e.lencode = y;
e.lenbits = 9;
e.distcode = k;
e.distbits = 5;
}
function z(e, t, r, n) {
var s, a = e.state;
if (null === a.window) {
a.wsize = 1 << a.wbits;
a.wnext = 0;
a.whave = 0;
a.window = new i.Buf8(a.wsize);
}
if (n >= a.wsize) {
i.arraySet(a.window, t, r - a.wsize, a.wsize, 0);
a.wnext = 0;
a.whave = a.wsize;
} else {
(s = a.wsize - a.wnext) > n && (s = n);
i.arraySet(a.window, t, r - n, s, a.wnext);
if (n -= s) {
i.arraySet(a.window, t, r - n, n, 0);
a.wnext = n;
a.whave = a.wsize;
} else {
a.wnext += s;
a.wnext === a.wsize && (a.wnext = 0);
a.whave < a.wsize && (a.whave += s);
}
}
return 0;
}
r.inflateReset = b;
r.inflateReset2 = v;
r.inflateResetKeep = g;
r.inflateInit = function(e) {
return w(e, 15);
};
r.inflateInit2 = w;
r.inflate = function(e, t) {
var r, c, p, _, g, b, v, w, y, k, x, C, E, A, I, O, B, R, T, D, F, N, U, P, L = 0, j = new i.Buf8(4), Z = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];
if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return l;
12 === (r = e.state).mode && (r.mode = 13);
g = e.next_out;
p = e.output;
v = e.avail_out;
_ = e.next_in;
c = e.input;
b = e.avail_in;
w = r.hold;
y = r.bits;
k = b;
x = v;
N = f;
e: for (;;) switch (r.mode) {
case d:
if (0 === r.wrap) {
r.mode = 13;
break;
}
for (;y < 16; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
if (2 & r.wrap && 35615 === w) {
r.check = 0;
j[0] = 255 & w;
j[1] = w >>> 8 & 255;
r.check = s(r.check, j, 2, 0);
w = 0;
y = 0;
r.mode = 2;
break;
}
r.flags = 0;
r.head && (r.head.done = !1);
if (!(1 & r.wrap) || (((255 & w) << 8) + (w >> 8)) % 31) {
e.msg = "incorrect header check";
r.mode = 30;
break;
}
if (8 != (15 & w)) {
e.msg = "unknown compression method";
r.mode = 30;
break;
}
y -= 4;
F = 8 + (15 & (w >>>= 4));
if (0 === r.wbits) r.wbits = F; else if (F > r.wbits) {
e.msg = "invalid window size";
r.mode = 30;
break;
}
r.dmax = 1 << F;
e.adler = r.check = 1;
r.mode = 512 & w ? 10 : 12;
w = 0;
y = 0;
break;

case 2:
for (;y < 16; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
r.flags = w;
if (8 != (255 & r.flags)) {
e.msg = "unknown compression method";
r.mode = 30;
break;
}
if (57344 & r.flags) {
e.msg = "unknown header flags set";
r.mode = 30;
break;
}
r.head && (r.head.text = w >> 8 & 1);
if (512 & r.flags) {
j[0] = 255 & w;
j[1] = w >>> 8 & 255;
r.check = s(r.check, j, 2, 0);
}
w = 0;
y = 0;
r.mode = 3;

case 3:
for (;y < 32; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
r.head && (r.head.time = w);
if (512 & r.flags) {
j[0] = 255 & w;
j[1] = w >>> 8 & 255;
j[2] = w >>> 16 & 255;
j[3] = w >>> 24 & 255;
r.check = s(r.check, j, 4, 0);
}
w = 0;
y = 0;
r.mode = 4;

case 4:
for (;y < 16; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
if (r.head) {
r.head.xflags = 255 & w;
r.head.os = w >> 8;
}
if (512 & r.flags) {
j[0] = 255 & w;
j[1] = w >>> 8 & 255;
r.check = s(r.check, j, 2, 0);
}
w = 0;
y = 0;
r.mode = 5;

case 5:
if (1024 & r.flags) {
for (;y < 16; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
r.length = w;
r.head && (r.head.extra_len = w);
if (512 & r.flags) {
j[0] = 255 & w;
j[1] = w >>> 8 & 255;
r.check = s(r.check, j, 2, 0);
}
w = 0;
y = 0;
} else r.head && (r.head.extra = null);
r.mode = 6;

case 6:
if (1024 & r.flags) {
(C = r.length) > b && (C = b);
if (C) {
if (r.head) {
F = r.head.extra_len - r.length;
r.head.extra || (r.head.extra = new Array(r.head.extra_len));
i.arraySet(r.head.extra, c, _, C, F);
}
512 & r.flags && (r.check = s(r.check, c, C, _));
b -= C;
_ += C;
r.length -= C;
}
if (r.length) break e;
}
r.length = 0;
r.mode = 7;

case 7:
if (2048 & r.flags) {
if (0 === b) break e;
C = 0;
do {
F = c[_ + C++];
r.head && F && r.length < 65536 && (r.head.name += String.fromCharCode(F));
} while (F && C < b);
512 & r.flags && (r.check = s(r.check, c, C, _));
b -= C;
_ += C;
if (F) break e;
} else r.head && (r.head.name = null);
r.length = 0;
r.mode = 8;

case 8:
if (4096 & r.flags) {
if (0 === b) break e;
C = 0;
do {
F = c[_ + C++];
r.head && F && r.length < 65536 && (r.head.comment += String.fromCharCode(F));
} while (F && C < b);
512 & r.flags && (r.check = s(r.check, c, C, _));
b -= C;
_ += C;
if (F) break e;
} else r.head && (r.head.comment = null);
r.mode = 9;

case 9:
if (512 & r.flags) {
for (;y < 16; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
if (w !== (65535 & r.check)) {
e.msg = "header crc mismatch";
r.mode = 30;
break;
}
w = 0;
y = 0;
}
if (r.head) {
r.head.hcrc = r.flags >> 9 & 1;
r.head.done = !0;
}
e.adler = r.check = 0;
r.mode = 12;
break;

case 10:
for (;y < 32; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
e.adler = r.check = m(w);
w = 0;
y = 0;
r.mode = 11;

case 11:
if (0 === r.havedict) {
e.next_out = g;
e.avail_out = v;
e.next_in = _;
e.avail_in = b;
r.hold = w;
r.bits = y;
return 2;
}
e.adler = r.check = 1;
r.mode = 12;

case 12:
if (5 === t || 6 === t) break e;

case 13:
if (r.last) {
w >>>= 7 & y;
y -= 7 & y;
r.mode = 27;
break;
}
for (;y < 3; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
r.last = 1 & w;
y -= 1;
switch (3 & (w >>>= 1)) {
case 0:
r.mode = 14;
break;

case 1:
S(r);
r.mode = 20;
if (6 === t) {
w >>>= 2;
y -= 2;
break e;
}
break;

case 2:
r.mode = 17;
break;

case 3:
e.msg = "invalid block type";
r.mode = 30;
}
w >>>= 2;
y -= 2;
break;

case 14:
w >>>= 7 & y;
y -= 7 & y;
for (;y < 32; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
if ((65535 & w) != (w >>> 16 ^ 65535)) {
e.msg = "invalid stored block lengths";
r.mode = 30;
break;
}
r.length = 65535 & w;
w = 0;
y = 0;
r.mode = 15;
if (6 === t) break e;

case 15:
r.mode = 16;

case 16:
if (C = r.length) {
C > b && (C = b);
C > v && (C = v);
if (0 === C) break e;
i.arraySet(p, c, _, C, g);
b -= C;
_ += C;
v -= C;
g += C;
r.length -= C;
break;
}
r.mode = 12;
break;

case 17:
for (;y < 14; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
r.nlen = 257 + (31 & w);
w >>>= 5;
y -= 5;
r.ndist = 1 + (31 & w);
w >>>= 5;
y -= 5;
r.ncode = 4 + (15 & w);
w >>>= 4;
y -= 4;
if (r.nlen > 286 || r.ndist > 30) {
e.msg = "too many length or distance symbols";
r.mode = 30;
break;
}
r.have = 0;
r.mode = 18;

case 18:
for (;r.have < r.ncode; ) {
for (;y < 3; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
r.lens[Z[r.have++]] = 7 & w;
w >>>= 3;
y -= 3;
}
for (;r.have < 19; ) r.lens[Z[r.have++]] = 0;
r.lencode = r.lendyn;
r.lenbits = 7;
U = {
bits: r.lenbits
};
N = o(0, r.lens, 0, 19, r.lencode, 0, r.work, U);
r.lenbits = U.bits;
if (N) {
e.msg = "invalid code lengths set";
r.mode = 30;
break;
}
r.have = 0;
r.mode = 19;

case 19:
for (;r.have < r.nlen + r.ndist; ) {
for (;;) {
O = (L = r.lencode[w & (1 << r.lenbits) - 1]) >>> 16 & 255;
B = 65535 & L;
if ((I = L >>> 24) <= y) break;
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
if (B < 16) {
w >>>= I;
y -= I;
r.lens[r.have++] = B;
} else {
if (16 === B) {
P = I + 2;
for (;y < P; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
w >>>= I;
y -= I;
if (0 === r.have) {
e.msg = "invalid bit length repeat";
r.mode = 30;
break;
}
F = r.lens[r.have - 1];
C = 3 + (3 & w);
w >>>= 2;
y -= 2;
} else if (17 === B) {
P = I + 3;
for (;y < P; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
y -= I;
F = 0;
C = 3 + (7 & (w >>>= I));
w >>>= 3;
y -= 3;
} else {
P = I + 7;
for (;y < P; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
y -= I;
F = 0;
C = 11 + (127 & (w >>>= I));
w >>>= 7;
y -= 7;
}
if (r.have + C > r.nlen + r.ndist) {
e.msg = "invalid bit length repeat";
r.mode = 30;
break;
}
for (;C--; ) r.lens[r.have++] = F;
}
}
if (30 === r.mode) break;
if (0 === r.lens[256]) {
e.msg = "invalid code -- missing end-of-block";
r.mode = 30;
break;
}
r.lenbits = 9;
U = {
bits: r.lenbits
};
N = o(h, r.lens, 0, r.nlen, r.lencode, 0, r.work, U);
r.lenbits = U.bits;
if (N) {
e.msg = "invalid literal/lengths set";
r.mode = 30;
break;
}
r.distbits = 6;
r.distcode = r.distdyn;
U = {
bits: r.distbits
};
N = o(u, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, U);
r.distbits = U.bits;
if (N) {
e.msg = "invalid distances set";
r.mode = 30;
break;
}
r.mode = 20;
if (6 === t) break e;

case 20:
r.mode = 21;

case 21:
if (b >= 6 && v >= 258) {
e.next_out = g;
e.avail_out = v;
e.next_in = _;
e.avail_in = b;
r.hold = w;
r.bits = y;
a(e, x);
g = e.next_out;
p = e.output;
v = e.avail_out;
_ = e.next_in;
c = e.input;
b = e.avail_in;
w = r.hold;
y = r.bits;
12 === r.mode && (r.back = -1);
break;
}
r.back = 0;
for (;;) {
O = (L = r.lencode[w & (1 << r.lenbits) - 1]) >>> 16 & 255;
B = 65535 & L;
if ((I = L >>> 24) <= y) break;
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
if (O && 0 == (240 & O)) {
R = I;
T = O;
D = B;
for (;;) {
O = (L = r.lencode[D + ((w & (1 << R + T) - 1) >> R)]) >>> 16 & 255;
B = 65535 & L;
if (R + (I = L >>> 24) <= y) break;
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
w >>>= R;
y -= R;
r.back += R;
}
w >>>= I;
y -= I;
r.back += I;
r.length = B;
if (0 === O) {
r.mode = 26;
break;
}
if (32 & O) {
r.back = -1;
r.mode = 12;
break;
}
if (64 & O) {
e.msg = "invalid literal/length code";
r.mode = 30;
break;
}
r.extra = 15 & O;
r.mode = 22;

case 22:
if (r.extra) {
P = r.extra;
for (;y < P; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
r.length += w & (1 << r.extra) - 1;
w >>>= r.extra;
y -= r.extra;
r.back += r.extra;
}
r.was = r.length;
r.mode = 23;

case 23:
for (;;) {
O = (L = r.distcode[w & (1 << r.distbits) - 1]) >>> 16 & 255;
B = 65535 & L;
if ((I = L >>> 24) <= y) break;
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
if (0 == (240 & O)) {
R = I;
T = O;
D = B;
for (;;) {
O = (L = r.distcode[D + ((w & (1 << R + T) - 1) >> R)]) >>> 16 & 255;
B = 65535 & L;
if (R + (I = L >>> 24) <= y) break;
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
w >>>= R;
y -= R;
r.back += R;
}
w >>>= I;
y -= I;
r.back += I;
if (64 & O) {
e.msg = "invalid distance code";
r.mode = 30;
break;
}
r.offset = B;
r.extra = 15 & O;
r.mode = 24;

case 24:
if (r.extra) {
P = r.extra;
for (;y < P; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
r.offset += w & (1 << r.extra) - 1;
w >>>= r.extra;
y -= r.extra;
r.back += r.extra;
}
if (r.offset > r.dmax) {
e.msg = "invalid distance too far back";
r.mode = 30;
break;
}
r.mode = 25;

case 25:
if (0 === v) break e;
C = x - v;
if (r.offset > C) {
if ((C = r.offset - C) > r.whave && r.sane) {
e.msg = "invalid distance too far back";
r.mode = 30;
break;
}
if (C > r.wnext) {
C -= r.wnext;
E = r.wsize - C;
} else E = r.wnext - C;
C > r.length && (C = r.length);
A = r.window;
} else {
A = p;
E = g - r.offset;
C = r.length;
}
C > v && (C = v);
v -= C;
r.length -= C;
do {
p[g++] = A[E++];
} while (--C);
0 === r.length && (r.mode = 21);
break;

case 26:
if (0 === v) break e;
p[g++] = r.length;
v--;
r.mode = 21;
break;

case 27:
if (r.wrap) {
for (;y < 32; ) {
if (0 === b) break e;
b--;
w |= c[_++] << y;
y += 8;
}
x -= v;
e.total_out += x;
r.total += x;
x && (e.adler = r.check = r.flags ? s(r.check, p, x, g - x) : n(r.check, p, x, g - x));
x = v;
if ((r.flags ? w : m(w)) !== r.check) {
e.msg = "incorrect data check";
r.mode = 30;
break;
}
w = 0;
y = 0;
}
r.mode = 28;

case 28:
if (r.wrap && r.flags) {
for (;y < 32; ) {
if (0 === b) break e;
b--;
w += c[_++] << y;
y += 8;
}
if (w !== (4294967295 & r.total)) {
e.msg = "incorrect length check";
r.mode = 30;
break;
}
w = 0;
y = 0;
}
r.mode = 29;

case 29:
N = 1;
break e;

case 30:
N = -3;
break e;

case 31:
return -4;

case 32:
default:
return l;
}
e.next_out = g;
e.avail_out = v;
e.next_in = _;
e.avail_in = b;
r.hold = w;
r.bits = y;
if ((r.wsize || x !== e.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== t)) && z(e, e.output, e.next_out, x - e.avail_out)) {
r.mode = 31;
return -4;
}
k -= e.avail_in;
x -= e.avail_out;
e.total_in += k;
e.total_out += x;
r.total += x;
r.wrap && x && (e.adler = r.check = r.flags ? s(r.check, p, x, e.next_out - x) : n(r.check, p, x, e.next_out - x));
e.data_type = r.bits + (r.last ? 64 : 0) + (12 === r.mode ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0);
(0 === k && 0 === x || 4 === t) && N === f && (N = -5);
return N;
};
r.inflateEnd = function(e) {
if (!e || !e.state) return l;
var t = e.state;
t.window && (t.window = null);
e.state = null;
return f;
};
r.inflateGetHeader = function(e, t) {
var r;
if (!e || !e.state) return l;
if (0 == (2 & (r = e.state).wrap)) return l;
r.head = t;
t.done = !1;
return f;
};
r.inflateSetDictionary = function(e, t) {
var r, i = t.length;
if (!e || !e.state) return l;
if (0 !== (r = e.state).wrap && 11 !== r.mode) return l;
if (11 === r.mode && n(1, t, i, 0) !== r.check) return -3;
if (z(e, t, i, i)) {
r.mode = 31;
return -4;
}
r.havedict = 1;
return f;
};
r.inflateInfo = "pako inflate (from Nodeca project)";
}, {
"../utils/common": 41,
"./adler32": 43,
"./crc32": 45,
"./inffast": 48,
"./inftrees": 50
} ],
50: [ function(e, t) {
"use strict";
var r = e("../utils/common"), i = [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0 ], n = [ 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78 ], s = [ 1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0 ], a = [ 16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64 ];
t.exports = function(e, t, o, h, u, f, l, d) {
var c, p, m, _, g, b, v, w, y, k = d.bits, x = 0, S = 0, z = 0, C = 0, E = 0, A = 0, I = 0, O = 0, B = 0, R = 0, T = null, D = 0, F = new r.Buf16(16), N = new r.Buf16(16), U = null, P = 0;
for (x = 0; x <= 15; x++) F[x] = 0;
for (S = 0; S < h; S++) F[t[o + S]]++;
E = k;
for (C = 15; C >= 1 && 0 === F[C]; C--) ;
E > C && (E = C);
if (0 === C) {
u[f++] = 20971520;
u[f++] = 20971520;
d.bits = 1;
return 0;
}
for (z = 1; z < C && 0 === F[z]; z++) ;
E < z && (E = z);
O = 1;
for (x = 1; x <= 15; x++) {
O <<= 1;
if ((O -= F[x]) < 0) return -1;
}
if (O > 0 && (0 === e || 1 !== C)) return -1;
N[1] = 0;
for (x = 1; x < 15; x++) N[x + 1] = N[x] + F[x];
for (S = 0; S < h; S++) 0 !== t[o + S] && (l[N[t[o + S]]++] = S);
if (0 === e) {
T = U = l;
b = 19;
} else if (1 === e) {
T = i;
D -= 257;
U = n;
P -= 257;
b = 256;
} else {
T = s;
U = a;
b = -1;
}
R = 0;
S = 0;
x = z;
g = f;
A = E;
I = 0;
m = -1;
_ = (B = 1 << E) - 1;
if (1 === e && B > 852 || 2 === e && B > 592) return 1;
for (;;) {
v = x - I;
if (l[S] < b) {
w = 0;
y = l[S];
} else if (l[S] > b) {
w = U[P + l[S]];
y = T[D + l[S]];
} else {
w = 96;
y = 0;
}
c = 1 << x - I;
z = p = 1 << A;
do {
u[g + (R >> I) + (p -= c)] = v << 24 | w << 16 | y | 0;
} while (0 !== p);
c = 1 << x - 1;
for (;R & c; ) c >>= 1;
if (0 !== c) {
R &= c - 1;
R += c;
} else R = 0;
S++;
if (0 == --F[x]) {
if (x === C) break;
x = t[o + l[S]];
}
if (x > E && (R & _) !== m) {
0 === I && (I = E);
g += z;
O = 1 << (A = x - I);
for (;A + I < C && !((O -= F[A + I]) <= 0); ) {
A++;
O <<= 1;
}
B += 1 << A;
if (1 === e && B > 852 || 2 === e && B > 592) return 1;
u[m = R & _] = E << 24 | A << 16 | g - f | 0;
}
}
0 !== R && (u[g + R] = x - I << 24 | 64 << 16 | 0);
d.bits = E;
return 0;
};
}, {
"../utils/common": 41
} ],
51: [ function(e, t) {
"use strict";
t.exports = {
2: "need dictionary",
1: "stream end",
0: "",
"-1": "file error",
"-2": "stream error",
"-3": "data error",
"-4": "insufficient memory",
"-5": "buffer error",
"-6": "incompatible version"
};
}, {} ],
52: [ function(e, t, r) {
"use strict";
var i = e("../utils/common"), n = 0, s = 1;
function a(e) {
for (var t = e.length; --t >= 0; ) e[t] = 0;
}
var o = 0, h = 29, u = 256, f = u + 1 + h, l = 30, d = 19, c = 2 * f + 1, p = 15, m = 16, _ = 7, g = 256, b = 16, v = 17, w = 18, y = [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0 ], k = [ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 ], x = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7 ], S = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ], z = new Array(2 * (f + 2));
a(z);
var C = new Array(2 * l);
a(C);
var E = new Array(512);
a(E);
var A = new Array(256);
a(A);
var I = new Array(h);
a(I);
var O, B, R, T = new Array(l);
a(T);
function D(e, t, r, i, n) {
this.static_tree = e;
this.extra_bits = t;
this.extra_base = r;
this.elems = i;
this.max_length = n;
this.has_stree = e && e.length;
}
function F(e, t) {
this.dyn_tree = e;
this.max_code = 0;
this.stat_desc = t;
}
function N(e) {
return e < 256 ? E[e] : E[256 + (e >>> 7)];
}
function U(e, t) {
e.pending_buf[e.pending++] = 255 & t;
e.pending_buf[e.pending++] = t >>> 8 & 255;
}
function P(e, t, r) {
if (e.bi_valid > m - r) {
e.bi_buf |= t << e.bi_valid & 65535;
U(e, e.bi_buf);
e.bi_buf = t >> m - e.bi_valid;
e.bi_valid += r - m;
} else {
e.bi_buf |= t << e.bi_valid & 65535;
e.bi_valid += r;
}
}
function L(e, t, r) {
P(e, r[2 * t], r[2 * t + 1]);
}
function j(e, t) {
var r = 0;
do {
r |= 1 & e;
e >>>= 1;
r <<= 1;
} while (--t > 0);
return r >>> 1;
}
function Z(e) {
if (16 === e.bi_valid) {
U(e, e.bi_buf);
e.bi_buf = 0;
e.bi_valid = 0;
} else if (e.bi_valid >= 8) {
e.pending_buf[e.pending++] = 255 & e.bi_buf;
e.bi_buf >>= 8;
e.bi_valid -= 8;
}
}
function W(e, t) {
var r, i, n, s, a, o, h = t.dyn_tree, u = t.max_code, f = t.stat_desc.static_tree, l = t.stat_desc.has_stree, d = t.stat_desc.extra_bits, m = t.stat_desc.extra_base, _ = t.stat_desc.max_length, g = 0;
for (s = 0; s <= p; s++) e.bl_count[s] = 0;
h[2 * e.heap[e.heap_max] + 1] = 0;
for (r = e.heap_max + 1; r < c; r++) {
if ((s = h[2 * h[2 * (i = e.heap[r]) + 1] + 1] + 1) > _) {
s = _;
g++;
}
h[2 * i + 1] = s;
if (!(i > u)) {
e.bl_count[s]++;
a = 0;
i >= m && (a = d[i - m]);
o = h[2 * i];
e.opt_len += o * (s + a);
l && (e.static_len += o * (f[2 * i + 1] + a));
}
}
if (0 !== g) {
do {
s = _ - 1;
for (;0 === e.bl_count[s]; ) s--;
e.bl_count[s]--;
e.bl_count[s + 1] += 2;
e.bl_count[_]--;
g -= 2;
} while (g > 0);
for (s = _; 0 !== s; s--) {
i = e.bl_count[s];
for (;0 !== i; ) if (!((n = e.heap[--r]) > u)) {
if (h[2 * n + 1] !== s) {
e.opt_len += (s - h[2 * n + 1]) * h[2 * n];
h[2 * n + 1] = s;
}
i--;
}
}
}
}
function M(e, t, r) {
var i, n, s = new Array(p + 1), a = 0;
for (i = 1; i <= p; i++) s[i] = a = a + r[i - 1] << 1;
for (n = 0; n <= t; n++) {
var o = e[2 * n + 1];
0 !== o && (e[2 * n] = j(s[o]++, o));
}
}
function H() {
var e, t, r, i, n, s = new Array(p + 1);
r = 0;
for (i = 0; i < h - 1; i++) {
I[i] = r;
for (e = 0; e < 1 << y[i]; e++) A[r++] = i;
}
A[r - 1] = i;
n = 0;
for (i = 0; i < 16; i++) {
T[i] = n;
for (e = 0; e < 1 << k[i]; e++) E[n++] = i;
}
n >>= 7;
for (;i < l; i++) {
T[i] = n << 7;
for (e = 0; e < 1 << k[i] - 7; e++) E[256 + n++] = i;
}
for (t = 0; t <= p; t++) s[t] = 0;
e = 0;
for (;e <= 143; ) {
z[2 * e + 1] = 8;
e++;
s[8]++;
}
for (;e <= 255; ) {
z[2 * e + 1] = 9;
e++;
s[9]++;
}
for (;e <= 279; ) {
z[2 * e + 1] = 7;
e++;
s[7]++;
}
for (;e <= 287; ) {
z[2 * e + 1] = 8;
e++;
s[8]++;
}
M(z, f + 1, s);
for (e = 0; e < l; e++) {
C[2 * e + 1] = 5;
C[2 * e] = j(e, 5);
}
O = new D(z, y, u + 1, f, p);
B = new D(C, k, 0, l, p);
R = new D(new Array(0), x, 0, d, _);
}
function G(e) {
var t;
for (t = 0; t < f; t++) e.dyn_ltree[2 * t] = 0;
for (t = 0; t < l; t++) e.dyn_dtree[2 * t] = 0;
for (t = 0; t < d; t++) e.bl_tree[2 * t] = 0;
e.dyn_ltree[2 * g] = 1;
e.opt_len = e.static_len = 0;
e.last_lit = e.matches = 0;
}
function K(e) {
e.bi_valid > 8 ? U(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf);
e.bi_buf = 0;
e.bi_valid = 0;
}
function Y(e, t, r, n) {
K(e);
if (n) {
U(e, r);
U(e, ~r);
}
i.arraySet(e.pending_buf, e.window, t, r, e.pending);
e.pending += r;
}
function X(e, t, r, i) {
var n = 2 * t, s = 2 * r;
return e[n] < e[s] || e[n] === e[s] && i[t] <= i[r];
}
function V(e, t, r) {
for (var i = e.heap[r], n = r << 1; n <= e.heap_len; ) {
n < e.heap_len && X(t, e.heap[n + 1], e.heap[n], e.depth) && n++;
if (X(t, i, e.heap[n], e.depth)) break;
e.heap[r] = e.heap[n];
r = n;
n <<= 1;
}
e.heap[r] = i;
}
function q(e, t, r) {
var i, n, s, a, o = 0;
if (0 !== e.last_lit) do {
i = e.pending_buf[e.d_buf + 2 * o] << 8 | e.pending_buf[e.d_buf + 2 * o + 1];
n = e.pending_buf[e.l_buf + o];
o++;
if (0 === i) L(e, n, t); else {
L(e, (s = A[n]) + u + 1, t);
0 !== (a = y[s]) && P(e, n -= I[s], a);
L(e, s = N(--i), r);
0 !== (a = k[s]) && P(e, i -= T[s], a);
}
} while (o < e.last_lit);
L(e, g, t);
}
function J(e, t) {
var r, i, n, s = t.dyn_tree, a = t.stat_desc.static_tree, o = t.stat_desc.has_stree, h = t.stat_desc.elems, u = -1;
e.heap_len = 0;
e.heap_max = c;
for (r = 0; r < h; r++) if (0 !== s[2 * r]) {
e.heap[++e.heap_len] = u = r;
e.depth[r] = 0;
} else s[2 * r + 1] = 0;
for (;e.heap_len < 2; ) {
s[2 * (n = e.heap[++e.heap_len] = u < 2 ? ++u : 0)] = 1;
e.depth[n] = 0;
e.opt_len--;
o && (e.static_len -= a[2 * n + 1]);
}
t.max_code = u;
for (r = e.heap_len >> 1; r >= 1; r--) V(e, s, r);
n = h;
do {
r = e.heap[1];
e.heap[1] = e.heap[e.heap_len--];
V(e, s, 1);
i = e.heap[1];
e.heap[--e.heap_max] = r;
e.heap[--e.heap_max] = i;
s[2 * n] = s[2 * r] + s[2 * i];
e.depth[n] = (e.depth[r] >= e.depth[i] ? e.depth[r] : e.depth[i]) + 1;
s[2 * r + 1] = s[2 * i + 1] = n;
e.heap[1] = n++;
V(e, s, 1);
} while (e.heap_len >= 2);
e.heap[--e.heap_max] = e.heap[1];
W(e, t);
M(s, u, e.bl_count);
}
function Q(e, t, r) {
var i, n, s = -1, a = t[1], o = 0, h = 7, u = 4;
if (0 === a) {
h = 138;
u = 3;
}
t[2 * (r + 1) + 1] = 65535;
for (i = 0; i <= r; i++) {
n = a;
a = t[2 * (i + 1) + 1];
if (!(++o < h && n === a)) {
if (o < u) e.bl_tree[2 * n] += o; else if (0 !== n) {
n !== s && e.bl_tree[2 * n]++;
e.bl_tree[2 * b]++;
} else o <= 10 ? e.bl_tree[2 * v]++ : e.bl_tree[2 * w]++;
o = 0;
s = n;
if (0 === a) {
h = 138;
u = 3;
} else if (n === a) {
h = 6;
u = 3;
} else {
h = 7;
u = 4;
}
}
}
}
function $(e, t, r) {
var i, n, s = -1, a = t[1], o = 0, h = 7, u = 4;
if (0 === a) {
h = 138;
u = 3;
}
for (i = 0; i <= r; i++) {
n = a;
a = t[2 * (i + 1) + 1];
if (!(++o < h && n === a)) {
if (o < u) do {
L(e, n, e.bl_tree);
} while (0 != --o); else if (0 !== n) {
if (n !== s) {
L(e, n, e.bl_tree);
o--;
}
L(e, b, e.bl_tree);
P(e, o - 3, 2);
} else if (o <= 10) {
L(e, v, e.bl_tree);
P(e, o - 3, 3);
} else {
L(e, w, e.bl_tree);
P(e, o - 11, 7);
}
o = 0;
s = n;
if (0 === a) {
h = 138;
u = 3;
} else if (n === a) {
h = 6;
u = 3;
} else {
h = 7;
u = 4;
}
}
}
}
function ee(e) {
var t;
Q(e, e.dyn_ltree, e.l_desc.max_code);
Q(e, e.dyn_dtree, e.d_desc.max_code);
J(e, e.bl_desc);
for (t = d - 1; t >= 3 && 0 === e.bl_tree[2 * S[t] + 1]; t--) ;
e.opt_len += 14 + 3 * (t + 1);
return t;
}
function te(e, t, r, i) {
var n;
P(e, t - 257, 5);
P(e, r - 1, 5);
P(e, i - 4, 4);
for (n = 0; n < i; n++) P(e, e.bl_tree[2 * S[n] + 1], 3);
$(e, e.dyn_ltree, t - 1);
$(e, e.dyn_dtree, r - 1);
}
function re(e) {
var t, r = 4093624447;
for (t = 0; t <= 31; t++, r >>>= 1) if (1 & r && 0 !== e.dyn_ltree[2 * t]) return n;
if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return s;
for (t = 32; t < u; t++) if (0 !== e.dyn_ltree[2 * t]) return s;
return n;
}
var ie = !1;
function ne(e, t, r, i) {
P(e, (o << 1) + (i ? 1 : 0), 3);
Y(e, t, r, !0);
}
r._tr_init = function(e) {
if (!ie) {
H();
ie = !0;
}
e.l_desc = new F(e.dyn_ltree, O);
e.d_desc = new F(e.dyn_dtree, B);
e.bl_desc = new F(e.bl_tree, R);
e.bi_buf = 0;
e.bi_valid = 0;
G(e);
};
r._tr_stored_block = ne;
r._tr_flush_block = function(e, t, r, i) {
var n, s, a = 0;
if (e.level > 0) {
2 === e.strm.data_type && (e.strm.data_type = re(e));
J(e, e.l_desc);
J(e, e.d_desc);
a = ee(e);
n = e.opt_len + 3 + 7 >>> 3;
(s = e.static_len + 3 + 7 >>> 3) <= n && (n = s);
} else n = s = r + 5;
if (r + 4 <= n && -1 !== t) ne(e, t, r, i); else if (4 === e.strategy || s === n) {
P(e, 2 + (i ? 1 : 0), 3);
q(e, z, C);
} else {
P(e, 4 + (i ? 1 : 0), 3);
te(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, a + 1);
q(e, e.dyn_ltree, e.dyn_dtree);
}
G(e);
i && K(e);
};
r._tr_tally = function(e, t, r) {
e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255;
e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t;
e.pending_buf[e.l_buf + e.last_lit] = 255 & r;
e.last_lit++;
if (0 === t) e.dyn_ltree[2 * r]++; else {
e.matches++;
t--;
e.dyn_ltree[2 * (A[r] + u + 1)]++;
e.dyn_dtree[2 * N(t)]++;
}
return e.last_lit === e.lit_bufsize - 1;
};
r._tr_align = function(e) {
P(e, 2, 3);
L(e, g, z);
Z(e);
};
}, {
"../utils/common": 41
} ],
53: [ function(e, t) {
"use strict";
t.exports = function() {
this.input = null;
this.next_in = 0;
this.avail_in = 0;
this.total_in = 0;
this.output = null;
this.next_out = 0;
this.avail_out = 0;
this.total_out = 0;
this.msg = "";
this.state = null;
this.data_type = 2;
this.adler = 0;
};
}, {} ],
54: [ function(e, t) {
"use strict";
t.exports = "function" == typeof setImmediate ? setImmediate : function() {
var e = [].slice.apply(arguments);
e.splice(1, 0, 0);
setTimeout.apply(null, e);
};
}, {} ]
}, {}, [ 10 ])(10);
});