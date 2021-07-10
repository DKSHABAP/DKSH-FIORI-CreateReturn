jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([], function () {
	"use strict";
	return {
		concatenateStrings: function (e, t) {
			if (e && t) {
				return e + " (" + t + ") "
			} else if (e && !t) {
				return e
			} else if (!e && t) {
				return t
			} else {
				return ""
			}
		},
		batchconcatenateStrings: function (e, t) {
			if (e && t) {
				var r = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				var n = new Date(t);
				return e + " " + "(" + r.format(n) + ")"
			} else if (e && !t) {
				return e
			} else if (!e && t) {
				var r = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				var n = new Date(t);
				return r.format(n)
			} else {
				return ""
			}
		},
		batchconcatenateStringsPS: function (e, t) {
			if (e && t) {
				var r = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				var n = parseInt(t.split("(")[1].split(")")[0]);
				var a = new Date(n);
				return e + " " + "(" + r.format(a) + ")"
			} else if (e && !t) {
				return e
			} else if (!e && t) {
				var r = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				var a = new Date(t);
				return r.format(a)
			} else {
				return ""
			}
		},
		datePS: function (e) {
			if (e) {
				var t = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				var r = parseInt(e.split("(")[1].split(")")[0]);
				var n = new Date(r);
				return t.format(n)
			} else {
				return ""
			}
		},
		f4ValueBind: function (e, t) {
			if (e && t) {
				return e + " (" + t + ") "
			} else if (e && !t) {
				return e
			} else if (!e && t) {
				return t
			} else {
				return ""
			}
		},
		dateTimeFormatPS: function (e) {
			if (e) {
				var t = parseInt(e.split("(")[1].split(")")[0]);
				e = new Date(t);
				var r = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "dd.MM.yyyyTHH:mm:ss"
				});
				if (e.getDate().toString().length === 1) {
					var n = "0" + e.getDate()
				} else {
					var n = e.getDate()
				}
				if (e.getMonth().toString().length === 1 && e.getMonth() < 9) {
					var a = "0" + (e.getMonth() + 1)
				} else {
					var a = e.getMonth() + 1
				}
				if (e.getHours().toString().length === 1) {
					var o = "0" + e.getHours()
				} else {
					var o = e.getHours()
				}
				if (e.getMinutes().toString().length === 1) {
					var i = "0" + e.getMinutes()
				} else {
					var i = e.getMinutes()
				}
				if (e.getSeconds().toString().length === 1) {
					var s = "0" + e.getSeconds()
				} else {
					var s = e.getSeconds()
				}
				var n = e.getFullYear() + "-" + a + "-" + n + "T" + o + ":" + i + ":" + s;
				return n
			} else {
				return ""
			}
		},
		date: function (e) {
			if (e !== null && e !== "") {
				var t = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				var r = new Date(e);
				return t.format(r)
			} else {
				return ""
			}
		},
		setColor: function (e) {
			if (e === "B" || e === "b") {
				return "Success"
			}
			if (e === "Y" || e === "y") {
				return "Warning"
			}
			if (e === "R" || e === "r") {
				return "Error"
			}
			if (e === "") {
				return "None"
			}
		},
		dateTimeFormatReport: function (e) {
			e = new Date(e);
			if (e) {
				var t = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "dd.MM.yyyy HH:mm:ss"
				});
				if (e.getDate().toString().length === 1) {
					var r = "0" + e.getDate()
				} else {
					var r = e.getDate()
				}
				if (e.getMonth().toString().length === 1 && e.getMonth() < 9) {
					var n = "0" + (e.getMonth() + 1)
				} else {
					var n = e.getMonth() + 1
				}
				if (e.getHours().toString().length === 1) {
					var a = "0" + e.getHours()
				} else {
					var a = e.getHours()
				}
				if (e.getMinutes().toString().length === 1) {
					var o = "0" + e.getMinutes()
				} else {
					var o = e.getMinutes()
				}
				if (e.getSeconds().toString().length === 1) {
					var i = "0" + e.getSeconds()
				} else {
					var i = e.getSeconds()
				}
				var r = e.getFullYear() + "-" + n + "-" + r;
				return t.format(e)
			} else {
				return ""
			}
		},
		enableDownload: function (e) {
			if (e) {
				return true
			} else {
				return false
			}
		},
		dateTimeFormat1: function (e) {
			e = new Date(e);
			if (e) {
				var t = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd-MM-yyyy",
					calendarType: "Gregorian"
				});
				if (e.getDate().toString().length === 1) {
					var r = "0" + e.getDate()
				} else {
					var r = e.getDate()
				}
				if (e.getMonth().toString().length === 1 && e.getMonth() < 9) {
					var n = "0" + (e.getMonth() + 1)
				} else {
					var n = e.getMonth() + 1
				}
				if (e.getHours().toString().length === 1) {
					var a = "0" + e.getHours()
				} else {
					var a = e.getHours()
				}
				if (e.getMinutes().toString().length === 1) {
					var o = "0" + e.getMinutes()
				} else {
					var o = e.getMinutes()
				}
				if (e.getSeconds().toString().length === 1) {
					var i = "0" + e.getSeconds()
				} else {
					var i = e.getSeconds()
				}
				var r = e.getFullYear() + "-" + n + "-" + r;
				return r
			} else {
				return ""
			}
		},
		dateTimeFormat: function (e) {
			if (e) {
				e = new Date(e);
				var t = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyyTHH:mm:ss",
					calendarType: "Gregorian"
				});
				if (e.getDate().toString().length === 1) {
					var r = "0" + e.getDate()
				} else {
					var r = e.getDate()
				}
				if (e.getMonth().toString().length === 1 && e.getMonth() < 9) {
					var n = "0" + (e.getMonth() + 1)
				} else {
					var n = e.getMonth() + 1
				}
				if (e.getHours().toString().length === 1) {
					var a = "0" + e.getHours()
				} else {
					var a = e.getHours()
				}
				if (e.getMinutes().toString().length === 1) {
					var o = "0" + e.getMinutes()
				} else {
					var o = e.getMinutes()
				}
				if (e.getSeconds().toString().length === 1) {
					var i = "0" + e.getSeconds()
				} else {
					var i = e.getSeconds()
				}
				var r = e.getFullYear() + "-" + n + "-" + r + "T" + a + ":" + o + ":" + i;
				return r
			} else {
				return ""
			}
		},
		setBlurVisibility: function (e) {
			if (e === "true") {
				return "BLUR"
			} else {
				return ""
			}
		}
	}
});