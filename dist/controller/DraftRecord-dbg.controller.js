sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/ui/core/Fragment", "sap/m/MessageToast", "../model/formatter",
	"sap/ui/model/Sorter", "sap/m/Token"
], function (e, t, s, r, a, o, i) {
	"use strict";
	return e.extend("dksh.connectclient.CreateReturn.controller.DraftRecord", {
		formatter: a,
		onInit: function () {
			this.users = [];
			var e = this;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(function (e) {
				if (e.getParameter("name") === "DraftRecord") {}
			});
			var t = sap.ui.core.UIComponent.getRouterFor(this);
			t.getRoute("DraftRecord").attachMatched(this._onObjectMatched, this);
			var s = new sap.ui.model.json.JSONModel;
			this.getView().setModel(s, "draftSearchModel");
			var r = new sap.ui.model.json.JSONModel;
			this.getView().setModel(r, "baseModel");
			this.getView().getModel("baseModel").setProperty("/languageID", "E");
			this._getUser();
			if (sap.ui.getCore().getConfiguration().getLanguage() === "en-US") {
				this.getView().getModel("baseModel").setProperty("/language", "TH");
			} else {
				this.getView().getModel("baseModel").setProperty("/language", sap.ui.getCore().getConfiguration().getLanguage());
			}
			var a = new sap.ui.model.json.JSONModel;
			this.getView().setModel(a, "actionModel");
			this.getView().getModel("actionModel").setProperty("/editVisible", false);
			this.getView().getModel("actionModel").setProperty("/cancelVisible", true);
			e.salesOrgDataAccess = "No Access";
			e.SLOCDataAccess = "No Access";
			e.distrChannelDataAccess = "No Access";
			e.divisionDataAccess = "No Access";
			e.materialGroupDataAccess = "No Access";
			e.materialGroup4DataAccess = "No Access";
			e.plantDataAccess = "No Access";
			e.orderTypeDataAccess = "No Access";
			this.getView().getModel("baseModel").setProperty("/openVisiblity", false);
			this.getView().getModel("baseModel").setProperty("/CollapseVisiblity", true);
			this.getView().getModel("baseModel").setProperty("/SearchVisiblity", true);
		},
		liveSearchUsers: function (e) {
			if (e.getParameters().newValue === undefined) {
				var t = e.getParameters().query;
			} else {
				var t = e.getParameters().newValue;
			}
			var s = new Array;
			var r = new sap.ui.model.Filter([new sap.ui.model.Filter("userId", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter(
				"email", sap.ui.model.FilterOperator.Contains, t)]);
			s.push(r);
			var a = sap.ui.getCore().byId("userListTableId").getBinding("items");
			a.filter(s);
		},
		valueHelpRequestUserList: function () {
			var e = this;
			if (!e.userList) {
				e.userList = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.UserList", e);
				e.getView().addDependent(e.userList);
				var t = new sap.ui.model.json.JSONModel;
				var e = this;
				var s, r;
				var a = [];
				var o = new sap.m.BusyDialog;
				o.open();
				var sURL = "/UserManagement/scim/Users" + '?filter=groups.display co "DKSH_CC"';
				this.getOwnerComponent().getApiModel("CCUsers", sURL, false).then(
					function (oData) {
						var i = {
							resources: oData.Resources ? oData.Resources : []
						};
						if (i.resources) {
							var l = [];
							for (var n = 0; n < i.resources.length; n++) {
								var d = i.resources[n].groups;
								if (d) {
									for (var u = 0; u < d.length; u++) {
										if (d[u].display === "DKSH_CC_RETURN_CREATOR") {
											l.push({
												userId: i.resources[n]["urn:ietf:params:scim:schemas:extension:sap:2.0:User"].userId,
												email: i.resources[n].emails[0].value
											});
										}
									}
								}
							}
							for (var g = 0; g < l.length; g++) {
								a.push(l[g]);
							}
							var c = new sap.ui.model.json.JSONModel({
								results: a
							});
							c.setSizeLimit(a.length);
							e.userList.setModel(c, "UsetTableSet");
							o.close();
							e.userList.open();
						} else {
							sap.m.MessageToast.show(e.resourceBundle.getText("userListError"));
							o.close();
						}
					},
					function (oError) {
						sap.m.MessageToast.show(e.resourceBundle.getText("userListError"));
						o.close();
					});

			} else {
				this.getView().getModel("baseModel").setProperty("/searchValue", "");
				sap.ui.getCore().byId("userListTableId").getBinding("items").filter([]);
				e.userList.open();
			}
		},
		onCancelUsers: function () {
			sap.ui.getCore().byId("userListTableId").removeSelections();
			this.userList.close();
		},
		onOKUsers: function () {
			var e = this.byId("userListId");
			e.destroyTokens();
			var t = sap.ui.getCore().byId("userListTableId").getSelectedContexts("UsetTableSet");
			var s = this.userList.getModel("UsetTableSet").getData().results;
			for (var r = 0; r < t.length; r++) {
				var a = parseInt(t[r].sPath.split("/")[2]);
				if (this.users.includes(s[a].userId) === false) {
					this.users.push(s[a].userId);
				}
			}
			for (var r = 0; r < this.users.length; r++) {
				e.addToken(new i({
					text: this.users[r]
				}));
			}
			sap.ui.getCore().byId("userListTableId").removeSelections();
			this.userList.close();
		},
		onDeleteUsers: function (e) {
			var t = this.byId("userListId");
			t.destroyTokens();
			if (e.getParameters().type === "removed") {
				var s = e.getParameters().removedTokens[0].getProperty("text");
				for (var r = this.users.length; r >= 0; r--) {
					if (s === this.users[r]) {
						this.users.splice(r, 1);
					}
				}
				for (var a = 0; a < this.users.length; a++) {
					t.addToken(new i({
						text: this.users[a]
					}));
				}
			} else {
				var t = this.byId("userListId");
				t.destroyTokens();
				this.users.push(e.getParameters().addedTokens[0].getText());
				for (var a = 0; a < this.users.length; a++) {
					t.addToken(new i({
						text: this.users[a]
					}));
				}
			}
		},
		_onObjectMatched: function () {
			if (sap.ui.getCore().getModel("draftItemModel")) {
				sap.ui.getCore().getModel("draftItemModel").setData("");
			}
			if (sap.ui.getCore().getModel("saveDraft") && sap.ui.getCore().getModel("saveDraft").getData() !== "") {
				this.onFilterDrafts(undefined, sap.ui.getCore().getModel("saveDraft").getData().orderNO);
			} else if (sap.ui.getCore().getModel("submitRequest") && sap.ui.getCore().getModel("submitRequest").getData() !== "") {
				this.onFilterDrafts(undefined, sap.ui.getCore().getModel("submitRequest").getData().orderNO);
			} else {
				this.ongetDrafts();
			}
			var sURL = "/UserManagement/scim/Users" + '?filter=groups.display co "DKSH_CC"';
			this.getOwnerComponent().getApiModel("CCUsers", sURL, true);
		},
		onSearchDraft: function (e) {
			if (e.getParameters().newValue === undefined) {
				var t = e.getParameters().query;
			} else {
				var t = e.getParameters().newValue;
			}
			var s = new Array;
			var r = new sap.ui.model.Filter([new sap.ui.model.Filter("returnReqNum", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model
				.Filter("roType", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter("roTypeText", sap.ui.model.FilterOperator.Contains,
					t), new sap.ui.model.Filter("soldToParty", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter("createdAt", sap.ui
					.model.FilterOperator.Contains, t), new sap.ui.model.Filter("orderReason", sap.ui.model.FilterOperator.Contains, t), new sap.ui
				.model.Filter("docVersion", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter("totalRoAmount", sap.ui.model.FilterOperator
					.Contains, t)
			]);
			s.push(r);
			var a = this.getView().byId("draftTableID").getBinding("items");
			a.filter(s);
		},
		onSortPress: function () {
			if (!this.SortFrag) {
				this.SortFrag = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.sort", this);
				this.getView().addDependent(this.SortFrag);
			}
			this.SortFrag.open();
		},
		handleSortDialogConfirm: function (e) {
			var t = sap.ui.getCore().byId("idSoldtoPartyTableDraft"),
				s = e.getParameters(),
				r = t.getBinding("items"),
				a, i, l = [];
			a = s.sortItem.getKey();
			i = s.sortDescending;
			l.push(new o(a, i));
			r.sort(l);
		},
		onPressCreateRequest: function () {
			var e = this;
			if (e.allAccess === false) {
				r.show(this.resourceBundle.getText("NoDataAccess"));
			} else {
				if (sap.ui.getCore().getModel("saveDraft")) {
					sap.ui.getCore().getModel("saveDraft").setData("");
				}
				if (sap.ui.getCore().getModel("submitRequest")) {
					sap.ui.getCore().getModel("submitRequest").setData("");
				}
				var t = this.byId("userListId");
				if (t !== undefined) {
					t.destroyTokens();
				}
				var s = sap.ui.core.UIComponent.getRouterFor(this);
				s.navTo("Selection");
			}
		},
		onFilterDrafts: function (e, s) {
			var a = this;
			if (a.allAccess === false) {
				r.show(a.resourceBundle.getText("NoDataAccess"));
				return;
			}
			var o = this.getView().getModel("baseModel");
			var a = this;
			if (s !== undefined) {
				o.setProperty("/draftNo", s);
				o.refresh();
			}
			if (this.getView().getModel("baseModel").getProperty("/userListVisiblity") === true) {
				if ((o.getData().draftNo === undefined || o.getData().draftNo === "") && (o.getData().selectedOrderType === undefined || o.getData()
						.selectedOrderType === "") && (o.getData().selectedSalesOrg === undefined || o.getData().selectedSalesOrg === "") && (o.getData()
						.selectedSoldtoParty === undefined || o.getData().selectedSoldtoParty === "") && (o.getData().selectedDistChnl === undefined ||
						o.getData().selectedDistChnl === "") && (o.getData().selectedDivision === undefined || o.getData().selectedDivision === "") && (
						o.getData().shipTo === undefined || o.getData().shipTo === "") && (o.getData().selectedReasonCode === undefined || o.getData().selectedReasonCode ===
						"") && (this.users === undefined || this.users.length === 0)) {
					t.information(this.resourceBundle.getText("Selectatleastoneinputcriteria"));
				} else {
					var i = [];
					if (this.users === undefined || this.users.length === 0) {
						i.push(a.getView().getModel("oUserDetailModel").getData().name);
					} else {
						i = this.users;
					}
					var l = new sap.ui.model.json.JSONModel;
					var n = {
						returnReqNum: o.getData().draftNo,
						orderType: o.getData().selectedOrderType,
						salesOrg: o.getData().selectedSalesOrg,
						soldToParty: o.getData().selectedSoldtoParty,
						distributionChannel: o.getData().selectedDistChnl,
						division: o.getData().selectedDivision,
						shipTo: o.getData().shipTo,
						returnReason: o.getData().selectedReasonCode,
						createdAt: "",
						userId: i,
						loggedInUserId: a.getView().getModel("oUserDetailModel").getData().name,
						projectCode: "cc"
					};
					var d = {
						"Content-Type": "application/json;charset=utf-8"
					};
					var u = new sap.m.BusyDialog();
					u.open();
					l.loadData("/DKSHJavaService/returnRequest/getReturnOrder/Filter", JSON.stringify(n), true, "POST", false, false, d);
					l.attachRequestCompleted(function (e) {
						u.close();
						var t = e.getSource().getData();
						var s = new sap.ui.model.json.JSONModel({
							results: t
						});
						a.getView().setModel(s, "draftDataModel");
						a.getView().getModel("draftDataModel").setProperty("/totalRequest", a.resourceBundle.getText("ReturnRequest") + "(" + e.getSource()
							.getData().length + ")");
						a.getView().getModel("draftDataModel").refresh();
					});
					l.attachRequestFailed(function (e) {
						u.close();
						t.error(e.getParameters().responseText);
					});
				}
			} else if ((o.getData().draftNo === undefined || o.getData().draftNo === "") && (o.getData().selectedOrderType === undefined || o.getData()
					.selectedOrderType === "") && (o.getData().selectedSalesOrg === undefined || o.getData().selectedSalesOrg === "") && (o.getData()
					.selectedSoldtoParty === undefined || o.getData().selectedSoldtoParty === "") && (o.getData().selectedDistChnl === undefined || o
					.getData().selectedDistChnl === "") && (o.getData().selectedDivision === undefined || o.getData().selectedDivision === "") && (o.getData()
					.shipTo === undefined || o.getData().shipTo === "") && (o.getData().selectedReasonCode === undefined || o.getData().selectedReasonCode ===
					"")) {
				t.information(this.resourceBundle.getText("Selectatleastoneinputcriteria"));
			} else {
				var i = [];
				i.push(a.getView().getModel("oUserDetailModel").getData().name);
				var l = new sap.ui.model.json.JSONModel();
				var n = {
					returnReqNum: o.getData().draftNo,
					orderType: o.getData().selectedOrderType,
					salesOrg: o.getData().selectedSalesOrg,
					soldToParty: o.getData().selectedSoldtoParty,
					distributionChannel: o.getData().selectedDistChnl,
					division: o.getData().selectedDivision,
					shipTo: o.getData().shipTo,
					returnReason: o.getData().selectedReasonCode,
					createdAt: "",
					userId: i,
					loggedInUserId: a.getView().getModel("oUserDetailModel").getData().name,
					projectCode: "cc"
				};
				var d = {
					"Content-Type": "application/json;charset=utf-8"
				};
				var u = new sap.m.BusyDialog;
				u.open();
				l.loadData("/DKSHJavaService/returnRequest/getReturnOrder/Filter", JSON.stringify(n), true, "POST", false, false, d);
				l.attachRequestCompleted(function (e) {
					u.close();
					var t = new sap.ui.model.json.JSONModel({
						results: e.getSource().getData()
					});
					a.getView().setModel(t, "draftDataModel");
					if (e.getSource().getData()) {
						a.getView().getModel("draftDataModel").setProperty("/totalRequest", "Return Request (" + e.getSource().getData().length + ")");
					} else {
						a.getView().getModel("draftDataModel").setProperty("/totalRequest", "Return Request (" + "0" + ")");
					}
					a.getView().getModel("draftDataModel").refresh();
				});
				l.attachRequestFailed(function (e) {
					if (e.getParameters().statusCode === 409) {
						r.show(a.resourceBundle.getText("NoDataAccess"));
					} else {
						t.error(e.getParameters().responseText);
					}
				});
			}
		},
		onPressCollapse: function () {
			this.getView().getModel("baseModel").setProperty("/openVisiblity", true);
			this.getView().getModel("baseModel").setProperty("/CollapseVisiblity", false);
			this.getView().getModel("baseModel").setProperty("/SearchVisiblity", false);
		},
		onPressOpen: function () {
			this.getView().getModel("baseModel").setProperty("/openVisiblity", false);
			this.getView().getModel("baseModel").setProperty("/CollapseVisiblity", true);
			this.getView().getModel("baseModel").setProperty("/SearchVisiblity", true);
		},
		ongetDrafts: function () {
			var e = this;
			if (e.allAccess === false) {
				r.show(e.resourceBundle.getText("NoDataAccess"));
				return;
			}
			this.getView().getModel("baseModel").setProperty("/draftNo", "");
			this.getView().getModel("baseModel").setProperty("/selectedSoldtoParty", "");
			this.getView().getModel("baseModel").setProperty("/selectedSoldtoPartyDesc", "");
			this.getView().getModel("baseModel").setProperty("/selectedSalesOrg", "");
			this.getView().getModel("baseModel").setProperty("/selectedSalesOrgDesc", "");
			this.getView().getModel("baseModel").setProperty("/selectedDistChnl", "");
			this.getView().getModel("baseModel").setProperty("/selectedDistChlDesc", "");
			this.getView().getModel("baseModel").setProperty("/selectedDivision", "");
			this.getView().getModel("baseModel").setProperty("/selectedDivisionDesc", "");
			this.getView().getModel("baseModel").setProperty("/selectedOrderType", "");
			this.getView().getModel("baseModel").setProperty("/selectedOrderTypeDesc", "");
			this.getView().getModel("baseModel").setProperty("/shipTo", "");
			this.getView().getModel("baseModel").setProperty("/selectedReasonCode", "");
			this.getView().getModel("baseModel").setProperty("/selectedReasonDesc", "");
			this.getView().getModel("baseModel").setProperty("/users", "");
			this.users = [];
			var s = this.byId("userListId");
			if (s !== undefined) {
				s.destroyTokens();
			}
			this.getView().getModel("baseModel").setProperty("/users", "");
			var e = this;
			if (e.getView().getModel("oUserDetailModel").getData().name !== undefined) {
				var a = new sap.ui.model.json.JSONModel();
				var o = {
					"Content-Type": "application/json;charset=utf-8"
				};
				var i = new sap.m.BusyDialog();
				i.open();
				a.loadData("/DKSHJavaService/returnRequest/getAllReturnOrder/" + e.getView().getModel("oUserDetailModel").getData().name + "&cc",
					true, "GET", false, false, o);
				a.attachRequestCompleted(function (t) {
					i.close();
					var s = t.getSource().getData();
					var r = new sap.ui.model.json.JSONModel({
						results: s
					});
					e.getView().setModel(r, "draftDataModel");
					if (s.length) {
						e.getView().getModel("draftDataModel").setProperty("/totalRequest", "Return Request (" + s.length + ")");
						r.setSizeLimit(s.length);
					} else {
						e.getView().getModel("draftDataModel").setProperty("/totalRequest", "Return Request (" + "0" + ")");
					}
					e.getView().getModel("draftDataModel").refresh();
				});
				a.attachRequestFailed(function (s) {
					i.close();
					if (s.getParameters().statusCode === 409) {
						r.show(e.resourceBundle.getText("NoDataAccess"));
					} else {
						t.error(s.getParameters().responseText);
					}
				});
			}
		},
		_getUser: function () {
			var e = this;
			var s = new sap.ui.model.json.JSONModel();
			e.getView().setModel(s, "oUserDetailModel");
			s.loadData("/services/userapi/attributes", null, true);
			s.attachRequestCompleted(function (t) {
				var s = e.getView().getModel("oUserDetailModel").getData().name;
				e._getLoggedInUserDetails(s);
				e._getLoggedInUserDetails1(s);
			});
			s.attachRequestFailed(function (e) {
				t.error(e.getSource().getData().message);
			});
		},
		_getLoggedInUserDetails1: function (e) {
			var t = this;
			var s = new sap.ui.model.json.JSONModel();
			t.getView().setModel(s, "oModel");
			var r = new sap.m.BusyDialog();
			r.open();
			s.loadData("/DKSHJavaService/userDetails/findAllRightsForUserInDomain/" + e + "&cc", null, true);
			s.attachRequestCompleted(function (e) {
				r.close();
				if (!e.getParameters().errorobject) {
					var s = e.getSource().getData();
					if (s.message) t.allAccess = false;
					if (s.ATR01 !== null) {
						t.salesOrgDataAccess = s.ATR01;
					}
					if (s.ATR02 !== null) {
						t.distrChannelDataAccess = s.ATR02;
					}
					if (s.ATR03 !== null) {
						t.divisionDataAccess = s.ATR03;
					}
					if (s.ATR04 !== null) {
						t.materialGroupDataAccess = s.ATR04;
					}
					if (s.ATR05 !== null) {
						t.materialGroup4DataAccess = s.ATR05;
					}
					if (s.ATR10 !== null) {
						t.SLOCDataAccess = s.ATR10;
					}
					if (s.ATR09 !== null) {
						t.plantDataAccess = s.ATR09;
					}
					if (s.ATR07 !== null) {
						t.materialDataAccess = s.ATR07;
					}
					if (s.ATR08 !== null) {
						t.orderTypeDataAccess = s.ATR08;
					}
					if (s.ATR06 !== null) {
						t.custCodeDataAccess = s.ATR06;
					}
				}
				t.ongetDrafts();
			});
			s.attachRequestFailed(function (e) {
				r.close();
				t.allAccess = false;
			});
		},
		_getLoggedInUserDetails: function (e) {
			var t = this;
			var s = new sap.ui.model.json.JSONModel();
			t.getView().setModel(s, "oLoggedInUserDetailModel");
			s.loadData("/UserManagement/service/scim/Users/" + e, null, true);
			s.attachRequestCompleted(function (e) {
				sap.ui.getCore().setModel(t.getOwnerComponent().getModel("globalModel"), "globalModel");
				sap.ui.getCore().getModel("globalModel").setProperty("/userId", e.getSource().getData().id);
				sap.ui.getCore().getModel("globalModel").setProperty("/userName", e.getSource().getData().displayName);
				t.getView().getModel("baseModel").setProperty("/userId", e.getSource().getData().id);
				t.getView().getModel("baseModel").setProperty("/userName", e.getSource().getData().displayName);
				if (e.getSource().getData().phoneNumbers !== undefined) {
					t.getView().getModel("baseModel").setProperty("/phone", e.getSource().getData().phoneNumbers[0].value);
					sap.ui.getCore().getModel("globalModel").setProperty("/phone", e.getSource().getData().phoneNumbers[0].value);
				}
				if (e.getSource().getData().groups) {
					var s = e.getSource().getData().groups;
					var r = 0;
					for (var a = 0; a < s.length; a++) {
						if (s[a].value === "DKSH_IT") {
							++r;
						}
					}
					if (r > 0) {
						t.getView().getModel("baseModel").setProperty("/userListVisiblity", true);
					} else {
						t.getView().getModel("baseModel").setProperty("/userListVisiblity", false);
					}
				}
			});
			s.attachRequestFailed(function (e) {
				t.allAccess = false;
			});
		},
		onAfterRendering: function () {
			this.resourceBundle = this.getView().getModel("i18n").getResourceBundle();
		},
		onSelectDoc: function (e) {
			var t = this;
			var s = e.getSource().getSelectedContexts()[0].getObject();
			if (this.getView().getModel("baseModel").getProperty("/phone") && this.getView().getModel("baseModel").getProperty("/userId") === s
				.requestedBy) {
				s.phone = this.getView().getModel("baseModel").getProperty("/phone");
			} else {
				s.phone = "";
			}
			var r = new sap.ui.model.json.JSONModel(s);
			sap.ui.getCore().setModel(r, "draftItemModel");
			var a = sap.ui.core.UIComponent.getRouterFor(this);
			a.navTo("Selection", true);
		},
		onPressAllDownload: function (e) {
			var s = this;
			var r = e.getSource().getBindingContext("draftDataModel").getObject();
			var a = new sap.ui.model.json.JSONModel;
			s.getView().setModel(a, "oModel");
			var o = new sap.m.BusyDialog;
			o.open();
			a.loadData("/DKSHJavaService/Attachment/downloadFileByReturnReqNum/" + r.returnReqNum + "&" + r.salesOrg.slice(0, 2), null, true);
			a.attachRequestCompleted(function (e) {
				o.close();
			});
			a.attachRequestFailed(function (e) {
				o.close();
				t.error(e.getSource().getData().message);
			});
		},
		onPressMoreDetails: function (e) {
			if (this._oPopover) {
				this._oPopover = undefined;
			}
			if (sap.ui.getCore().getModel("saveDraft")) {
				sap.ui.getCore().getModel("saveDraft").setData("");
			}
			if (sap.ui.getCore().getModel("submitRequest")) {
				sap.ui.getCore().getModel("submitRequest").setData("");
			}
			this.oButton = e.getSource();
			var t = this;
			var s = e.getSource().getBindingContext("draftDataModel").getObject();
			if (s.docVersion === "DRAFT") {
				var r = new sap.ui.model.json.JSONModel(s);
				sap.ui.getCore().setModel(r, "draftItemModel");
				var a = sap.ui.core.UIComponent.getRouterFor(this);
				a.navTo("Selection", true);
			} else if (s.docVersion === "ERROR") {
				this.selectedObj = e.getSource().getBindingContext("draftDataModel").getObject();
				this.getView().getModel("actionModel").setProperty("/editVisible", true);
				this._moreDetails(this.selectedObj);
			} else {
				this.selectedObj = e.getSource().getBindingContext("draftDataModel").getObject();
				this.getView().getModel("actionModel").setProperty("/editVisible", false);
				var o = s.returnReqNum;
				this._moreDetails(this.selectedObj);
			}
		},
		_actionPopover: function (e) {
			var t = this.getView().getModel("actionModel");
			var s = this.oButton;
			var r = this;
			if (!r.ActionPopover) {
				r.ActionPopover = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.ActionPopover", this);
				r.getView().addDependent(r.ActionPopover);
				r.ActionPopover.addStyleClass("sapUiSizeCompact");
			}
			r.ActionPopover.open();
		},
		_moreDetails: function (e) {
			var e = e;
			var s = this;
			var r = new sap.ui.model.json.JSONModel;
			s.getView().setModel(r, "oModel");
			var a = new sap.m.BusyDialog;
			a.open();
			r.loadData("/DKSHJavaService/returnRequest/getReturnOrder/Message/" + e.returnReqNum, null, true);
			r.attachRequestCompleted(function (t) {
				a.close();
				var r = t.getSource().getData();
				s.getView().getModel("actionModel").setProperty("/returnReqNum", r.returnReqNum);
				if (r.sapReturnOrderNum !== undefined && r.sapReturnOrderNum !== null) {
					var o = [];
					for (var i = 0; i < r.sapReturnOrderNum.length; i++) {
						var l = {
							OrderNo: r.sapReturnOrderNum[i]
						};
						o.push(l);
					}
					s.getView().getModel("actionModel").setProperty("/sapReturnOrderNum", o);
					s.getView().getModel("actionModel").setProperty("/sapReturnVisiblity", true);
					s.getView().getModel("actionModel").setProperty("/sapExchangeVisiblity", false);
					s.getView().getModel("actionModel").setProperty("/message", false);
				}
				if (r.sapExchangeOrderNum !== undefined && r.sapExchangeOrderNum !== null) {
					var n = [];
					for (var i = 0; i < r.sapExchangeOrderNum.length; i++) {
						var l = {
							OrderNo: r.sapExchangeOrderNum[i]
						};
						n.push(l);
					}
					s.getView().getModel("actionModel").setProperty("/sapExchangeOrderNum", n);
					s.getView().getModel("actionModel").setProperty("/sapReturnVisiblity", false);
					s.getView().getModel("actionModel").setProperty("/sapExchangeVisiblity", true);
					s.getView().getModel("actionModel").setProperty("/message", false);
				}
				if (r.sapExchangeOrderNum !== undefined && r.sapExchangeOrderNum !== null && (r.sapReturnOrderNum !== undefined && r.sapReturnOrderNum !==
						null)) {
					s.getView().getModel("actionModel").setProperty("/sapReturnVisiblity", true);
					s.getView().getModel("actionModel").setProperty("/sapExchangeVisiblity", true);
				}
				if (e.docVersion === "ERROR") {
					s.getView().getModel("actionModel").setProperty("/errorMessage", r.message);
					s.getView().getModel("actionModel").setProperty("/sapReturnVisiblity", false);
					s.getView().getModel("actionModel").setProperty("/sapExchangeVisiblity", false);
					s.getView().getModel("actionModel").setProperty("/message", true);
				}
				s._actionPopover();
			});
			r.attachRequestFailed(function (e) {
				a.close();
				t.error(e.getSource().getData().message);
			});
		},
		onCloseAction: function () {
			this.ActionPopover.close();
		},
		onEditErrorDraft: function () {
			var e = new sap.ui.model.json.JSONModel(this.selectedObj);
			sap.ui.getCore().setModel(e, "draftItemModel");
			var t = sap.ui.core.UIComponent.getRouterFor(this);
			t.navTo("Selection", true);
		},
		valueHelpRequestSoldtoParty: function () {
			var e = this;
			if (!e.SoldtoParty) {
				e.SoldtoParty = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.DraftSoldTo", this);
				e.getView().addDependent(e.SoldtoParty);
				e.SoldtoParty.addStyleClass("sapUiSizeCompact");
			}
			e.SoldtoParty.open();
		},
		onSubmitSoldtoParty: function (e) {
			var s = sap.ui.getCore().byId("idSoldtoPartyTableDraft");
			if (s.getItems().length > 0 && s.getSelectedContextPaths().length > 0) {
				var r = s.getSelectedItem().getBindingContext("SoldToPartyListSet");
				var a = this.getView().getModel("baseModel").getData();
				a.selectedSoldtoParty = r.getProperty("CustCode");
				a.selectedSoldtoPartyDesc = r.getProperty("Name1");
				a.selectedDistChnl = r.getProperty("Distchl");
				a.selectedSalesOrg = r.getProperty("SalesOrg");
				a.selectedDistChlDesc = r.getProperty("DCName");
				a.selectedSalesOrg = r.getProperty("SalesOrg");
				a.selectedSalesOrgDesc = r.getProperty("SOrgName");
				a.selectedDivision = r.getProperty("Division");
				a.selectedDivisionDesc = r.getProperty("DName");
				this.getView().getModel("baseModel").refresh();
				this.onResetSoldToParty();
				this.SoldtoParty.close();
			} else {
				t.information(this.resourceBundle.getText("Selectatleastoneitem"));
			}
		},
		onSearchSoldToParty: function (e) {
			var s = this,
				a = this.getView().getModel("baseModel").getData(),
				o = [];
			if (s.allAccess === false) {
				r.show(this.resourceBundle.getText("NoDataAccess"));
				return;
			}
			if ((a.SoldtoParty === "" || a.SoldtoParty === undefined) && (a.SoldTopartyName === "" || a.SoldTopartyName === undefined) && (a.Division ===
					"" || a.Division === undefined) && (a.SalesOrg === "" || a.SalesOrg === undefined) && (a.DistChan === "" || a.DistChan ===
					undefined)) {
				t.information(this.resourceBundle.getText("Selectatleastoneinputcriteria"));
				return;
			}
			if (a.SoldtoParty !== "" && a.SoldtoParty !== undefined) {
				o.push(new sap.ui.model.Filter("CustCode", sap.ui.model.FilterOperator.EQ, a.SoldtoParty));
			}
			if (s.custCodeDataAccess !== "*" && s.custCodeDataAccess !== undefined) {
				o.push(new sap.ui.model.Filter("custNumEx", sap.ui.model.FilterOperator.EQ, s.custCodeDataAccess));
			}
			if (a.DistChan !== "" && a.DistChan !== undefined) {
				o.push(new sap.ui.model.Filter("Distchl", sap.ui.model.FilterOperator.EQ, a.DistChan));
			} else {
				o.push(new sap.ui.model.Filter("Distchl", sap.ui.model.FilterOperator.EQ, s.distrChannelDataAccess));
			}
			if (a.Division !== "" && a.Division !== undefined) {
				o.push(new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.EQ, a.Division));
			} else {
				o.push(new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.EQ, s.divisionDataAccess));
			}
			if (a.SalesOrg !== "" && a.SalesOrg !== undefined) {
				o.push(new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.EQ, a.SalesOrg));
			} else {
				o.push(new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.EQ, s.salesOrgDataAccess));
			}
			if (this.getView().getModel("baseModel").getProperty("/languageID") === "E") {
				if (a.SoldTopartyName !== "" && a.SoldTopartyName !== undefined) {
					o.push(new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.EQ, "*" + a.SoldTopartyName + "*"));
				}
			} else {
				if (a.SoldTopartyName !== "" && a.SoldTopartyName !== undefined) {
					o.push(new sap.ui.model.Filter("Name2", sap.ui.model.FilterOperator.EQ, "*" + a.SoldTopartyName + "*"));
				}
			}
			o.push(new sap.ui.model.Filter("languageID", sap.ui.model.FilterOperator.EQ, this.getView().getModel("baseModel").getProperty(
				"/languageID")));
			var i = this.getView().getModel("ZDKSH_CC_DAC_SOLDTOPARTY_SRV");
			var l = new sap.m.BusyDialog();
			l.open();
			i.read("/ZSoldToPartySH", {
				async: false,
				filters: o,
				success: function (e, t) {
					l.close();
					var r = new sap.ui.model.json.JSONModel({
						results: e.results
					});
					s.SoldtoParty.setModel(r, "SoldToPartyListSet");
					s.SoldtoParty.getModel("SoldToPartyListSet").setProperty("/length", "Sold to (" + e.results.length + ")");
				},
				error: function (e) {
					l.close();
					var t = "";
					if (e.statusCode === 504) {
						t = s.resourceBundle.getText("timeOut");
						s.errorMsg(t);
					} else {
						t = JSON.parse(e.responseText);
						t = t.error.message.value;
						s.errorMsg(t);
					}
				}
			});
		},
		errorMsg: function (e) {
			sap.m.MessageBox.show(e, {
				styleClass: "sapUiSizeCompact",
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Error",
				actions: [sap.m.MessageBox.Action.OK],
				onClose: function (e) {}
			});
		},
		onResetSoldToParty: function () {
			var e = this.getView().getModel("baseModel");
			e.setProperty("/SoldtoParty", "");
			e.setProperty("/SoldTopartyName", "");
			e.setProperty("/Division", "");
			e.setProperty("/DistChan", "");
			e.setProperty("/SalesOrg", "");
			if (this.SoldtoParty) {
				if (this.SoldtoParty.getModel("SoldToPartyListSet") !== undefined) {
					this.SoldtoParty.getModel("SoldToPartyListSet").setData("");
				}
			}
			e.refresh();
		},
		onCancelSoldtoParty: function () {
			var e = this.getView().getModel("baseModel");
			e.setProperty("/SoldtoParty", "");
			e.setProperty("/SoldTopartyName", "");
			e.setProperty("/Division", "");
			e.setProperty("/DistChan", "");
			e.setProperty("/SalesOrg", "");
			if (this.SoldtoParty.getModel("SoldToPartyListSet") !== undefined) {
				this.SoldtoParty.getModel("SoldToPartyListSet").setData("");
			}
			e.refresh();
			this.SoldtoParty.close();
		},
		onLiveChangeSoldToParty: function (e) {
			var t = e.getParameters().newValue;
			var s = new Array;
			var r = new sap.ui.model.Filter([new sap.ui.model.Filter("CustCode", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter(
					"Name1", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter("Distchl", sap.ui.model.FilterOperator.Contains, t),
				new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator
					.Contains, t), new sap.ui.model.Filter("DName", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter("DCName", sap
					.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter("SOrgName", sap.ui.model.FilterOperator.Contains, t)
			]);
			s.push(r);
			var a = e.getSource().getParent().getParent().getBinding("items");
			a.filter(s);
		},
		valueHelpReturnReason: function () {
			var e = this;
			if (!e.returnReason) {
				e.returnReason = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.ReturnReason", this);
				e.getView().addDependent(e.returnReason);
				e.returnReason.addStyleClass("sapUiSizeCompact");
				var e = this;
				var t = e.getView().getModel("ZDKSH_CC_ORDER_REASONS_SRV");
				var s = new sap.m.BusyDialog;
				s.open();
				t.read("/OrderReasonSet", {
					async: false,
					success: function (t, r) {
						s.close();
						e.reasonModel = new sap.ui.model.json.JSONModel({
							results: t.results
						});
						e.getView().setModel(e.reasonModel, "OrderReasonSet");
						e.returnReason.open();
					},
					error: function (t) {
						s.close();
						var r = JSON.parse(t.responseText);
						r = r.error.message.value;
						e.errorMsg(r);
					}
				});
			} else {
				e.returnReason.open();
			}
		},
		valueHelpRequestSalesOrg: function (e) {
			var t = this;
			if (t.salesOrgDataAccess === "No Access") {
				r.show(this.resourceBundle.getText("NoDataAccess"));
			} else {
				if (!t.salesOrg) {
					t.salesOrg = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.SalesOrg", t);
					t.getView().addDependent(t.salesOrg);
					var s = this.getView().getModel("ZDKSH_CC_INVENTORY_HDRLOOKUP_SRV");
					var a = [];
					var o = "";
					if (sap.ushell) {
						if (sap.ui.getCore().getConfiguration().getLanguage() === "th") {
							o = "2";
						} else {
							o = "EN";
						}
					} else {
						o = "EN";
					}
					o = o.toUpperCase();
					var i = new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.EQ, o), new sap.ui.model.Filter("Salesorg", sap.ui.model
							.FilterOperator.EQ, t.salesOrgDataAccess)],
						and: true
					});
					a.push(i);
					var l = new sap.m.BusyDialog;
					l.open();
					s.read("/ZSearchHelp_SalesOrgSet", {
						async: false,
						filters: a,
						success: function (e, s) {
							l.close();
							var r = new sap.ui.model.json.JSONModel({
								results: e.results
							});
							t.salesOrg.setModel(r, "salesOrgModel");
							t.salesOrg.open();
						},
						error: function (e) {
							l.close();
							var s = "";
							if (e.statusCode === 504) {
								s = t.resourceBundle.getText("timeOut");
								t.errorMsg(s);
							} else {
								s = JSON.parse(e.responseText);
								s = s.error.message.value;
								t.errorMsg(s);
							}
						}
					});
				} else {
					t.salesOrg.open();
				}
			}
		},
		valueHelpdistChannel: function () {
			var e = this;
			if (e.distrChannelDataAccess === "No Access") {
				r.show(this.resourceBundle.getText("NoDataAccess"));
			} else {
				if (!e.DistChnl) {
					e.DistChnl = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.DistChnl", e);
					e.getView().addDependent(e.DistChnl);
					var t = this.getView().getModel("ZDKSH_CC_HDR_LOOKUP_SRV");
					var s = [];
					var a = "";
					a = a.toUpperCase();
					var o = new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.EQ, "EN"), new sap.ui.model.Filter("DistChl", sap.ui
							.model.FilterOperator.EQ, e.distrChannelDataAccess)],
						and: true
					});
					s.push(o);
					var i = new sap.m.BusyDialog;
					i.open();
					t.read("/ZDISTCHLLOOKUPSet", {
						async: false,
						filters: s,
						success: function (t, s) {
							i.close();
							var r = new sap.ui.model.json.JSONModel({
								results: t.results
							});
							e.getView().setModel(r, "DistChanSet");
							var a = new sap.ui.model.json.JSONModel({
								results: t.results
							});
							e.DistChnl.setModel(a, "DistChanSet");
							e.DistChnl.open();
						},
						error: function (t) {
							i.close();
							var s = "";
							if (t.statusCode === 504) {
								s = "Request timed-out. Please try again!";
								e.errorMsg(s);
							} else {
								s = JSON.parse(t.responseText);
								s = s.error.message.value;
								e.errorMsg(s);
							}
						}
					});
				} else {
					e.DistChnl.open();
				}
			}
		},
		valueHelpRequestDivision: function () {
			var e = this;
			if (e.divisionDataAccess === "No Access") {
				r.show(this.resourceBundle.getText("NoDataAccess"));
			} else {
				if (!e.Division) {
					e.Division = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.Division", e);
					e.getView().addDependent(e.Division);
					var t = this.getView().getModel("ZDKSH_CC_HDR_LOOKUP_SRV");
					var s = [];
					var a = new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.EQ, "EN"), new sap.ui.model.Filter("Division", sap.ui
							.model.FilterOperator.EQ, e.divisionDataAccess)],
						and: true
					});
					s.push(a);
					var o = new sap.m.BusyDialog;
					o.open();
					t.read("/ZDIVISIONLOOKUPSet", {
						async: false,
						filters: s,
						success: function (t, s) {
							o.close();
							var r = new sap.ui.model.json.JSONModel({
								results: t.results
							});
							e.Division.setModel(r, "DivisionSet");
							e.Division.open();
						},
						error: function (t) {
							o.close();
							var s = "";
							if (t.statusCode === 504) {
								s = "Request timed-out. Please try again!";
								e.errorMsg(s);
							} else {
								s = JSON.parse(t.responseText);
								s = s.error.message.value;
								e.errorMsg(s);
							}
						}
					});
				} else {
					e.Division.open();
				}
			}
		},
		valueHelpOrderType: function (e) {
			var t = this;
			if (t.orderTypeDataAccess === "No Access") {
				r.show(this.resourceBundle.getText("NoDataAccess"));
			} else {
				var t = this;
				if (!t.orderType) {
					t.orderType = sap.ui.xmlfragment("dksh.connectclient.CreateReturn.Fragments.OrderType", t);
					t.getView().addDependent(t.orderType);
					var s = this.getView().getModel("ZDKSH_CC_DAC_LOOKUP_SRV");
					var a = [];
					var o = new sap.ui.model.Filter({
						filters: [new sap.ui.model.Filter("languageKey", sap.ui.model.FilterOperator.EQ, "EN"), new sap.ui.model.Filter("orderType",
							sap.ui.model.FilterOperator.EQ, t.orderTypeDataAccess)],
						and: true
					});
					a.push(o);
					var i = new sap.m.BusyDialog;
					i.open();
					s.read("/orderTypeLookupSet", {
						async: false,
						filters: a,
						success: function (e, s) {
							i.close();
							var r = new sap.ui.model.json.JSONModel({
								results: e.results
							});
							t.orderType.setModel(r, "orderTypeSet");
							t.orderType.open();
						},
						error: function (e) {
							i.close();
							var s = "";
							if (e.statusCode === 504) {
								s = "Request timed-out. Please try again!";
								t.errorMsg(s);
							} else {
								s = JSON.parse(e.responseText);
								s = s.error.message.value;
								t.errorMsg(s);
							}
						}
					});
				} else {
					t.orderType.open();
				}
			}
		},
		onConfirmChangeSalesOrg: function (e) {
			e.getSource().getBinding("items").filter([]);
			this.getView().getModel("baseModel").setProperty("/SalesOrg", e.getParameters().selectedContexts[0].getObject().Salesorg);
			this.getView().getModel("baseModel").setProperty("/selectedSalesOrg", e.getParameters().selectedContexts[0].getObject().Salesorg);
			this.getView().getModel("baseModel").setProperty("/selectedSalesOrgDesc", e.getParameters().selectedContexts[0].getObject().SalesorgDesc);
			this.getView().getModel("baseModel").refresh();
		},
		onLiveChangeSalesOrg: function (e) {
			var t = e.getParameters().value;
			var s = new Array;
			var r = new sap.ui.model.Filter([new sap.ui.model.Filter("SalesorgDesc", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model
				.Filter("Salesorg", sap.ui.model.FilterOperator.Contains, t)
			]);
			s.push(r);
			var a = e.getSource().getBinding("items");
			a.filter(s);
		},
		handleorderTypeSet: function (e) {
			e.getSource().getBinding("items").filter([]);
			this.getView().getModel("baseModel").setProperty("/selectedOrderType", e.getParameters().selectedContexts[0].getObject().orderType);
			this.getView().getModel("baseModel").setProperty("/selectedOrderTypeDesc", e.getParameters().selectedContexts[0].getObject().orderTypeDesc);
			this.getView().getModel("baseModel").refresh();
		},
		onLiveChangeorderTypeSet: function (e) {
			var t = e.getParameters().value;
			var s = new Array;
			var r = new sap.ui.model.Filter([new sap.ui.model.Filter("orderTypeDesc", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model
				.Filter("orderType", sap.ui.model.FilterOperator.Contains, t)
			]);
			s.push(r);
			var a = e.getSource().getBinding("items");
			a.filter(s);
		},
		handleReturnReason: function (e) {
			e.getSource().getBinding("items").filter([]);
			this.getView().getModel("baseModel").setProperty("/selectedReasonCode", e.getParameters().selectedContexts[0].getObject().Reason);
			this.getView().getModel("baseModel").setProperty("/selectedReasonDesc", e.getParameters().selectedContexts[0].getObject().Description);
			this.getView().getModel("baseModel").refresh();
		},
		onLiveChangeReturnReason: function (e) {
			var t = e.getParameters().value;
			var s = new Array;
			var r = new sap.ui.model.Filter([new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter(
				"Reason", sap.ui.model.FilterOperator.Contains, t)]);
			s.push(r);
			var a = e.getSource().getBinding("items");
			a.filter(s);
		},
		handleAddDivision: function (e) {
			e.getSource().getBinding("items").filter([]);
			this.getView().getModel("baseModel").setProperty("/Division", e.getParameters().selectedContexts[0].getObject().Division);
			this.getView().getModel("baseModel").setProperty("/selectedDivision", e.getParameters().selectedContexts[0].getObject().Division);
			this.getView().getModel("baseModel").setProperty("/selectedDivisionDesc", e.getParameters().selectedContexts[0].getObject().Name);
			this.getView().getModel("baseModel").refresh();
		},
		onLiveChangeDivision: function (e) {
			var t = e.getParameters().value;
			var s = new Array;
			var r = new sap.ui.model.Filter([new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter(
				"Division", sap.ui.model.FilterOperator.Contains, t)]);
			s.push(r);
			var a = e.getSource().getBinding("items");
			a.filter(s);
		},
		handleAddDistChan: function (e) {
			e.getSource().getBinding("items").filter([]);
			var t = this.getView().getModel("baseModel");
			t.setProperty("/selectedDistChnl", e.getParameters().selectedContexts[0].getObject().DistChl);
			t.setProperty("/DistChan", e.getParameters().selectedContexts[0].getObject().DistChl);
			t.setProperty("/selectedDistChlDesc", e.getParameters().selectedContexts[0].getObject().Name);
			t.refresh();
		},
		onLiveChangeDistChan: function (e) {
			var t = e.getParameters().value;
			var s = new Array;
			var r = new sap.ui.model.Filter([new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, t), new sap.ui.model.Filter(
				"DistChl", sap.ui.model.FilterOperator.Contains, t)]);
			s.push(r);
			var a = e.getSource().getBinding("items");
			a.filter(s);
		},
		onExit: function () {
			if (this.SoldtoParty) {
				this.SoldtoParty.destroy();
			}
			if (this.SoldtoParty) {}
		}
	});
});