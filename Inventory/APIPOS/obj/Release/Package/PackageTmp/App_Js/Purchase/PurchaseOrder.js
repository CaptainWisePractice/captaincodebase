var Controller = "PurchaseOrder", CheckController = "ItemCheckOut", addIndex = 22, headList = [], locList = [], ManList = [];
var POMasterId = "", ManufacturerId = "", DocumentList = "", stsval = '', cfAgencyId = '', portOfLoading = '', editcmd = '';
var shipAgentId = "", productionPicList = "", DelStatus ="", editHeadLst=[];

$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {

    $('#txtOrderDate').datepicker({ dateFormat: 'dd-M-yy' });
    // $('#txtProductionTime').datepicker({ dateFormat: 'dd-M-yy'});
    $('#txtProductionEndDate').datepicker({ dateFormat: 'dd-M-yy' });
    $('#txtDateLoading').datepicker({ dateFormat: 'dd-M-yy' });
    $('#txtDepositDate').datepicker({ dateFormat: 'dd-M-yy' });
    $('#txtDueDate').datepicker({ dateFormat: 'dd-M-yy' });
    $('#txtETD').datepicker({ dateFormat: 'dd-M-yy' });
    $('#txtETA').datepicker({ dateFormat: 'dd-M-yy' });
    $('#txtETAWarehouse').datepicker({ dateFormat: 'dd-M-yy' });
    getDate();
    loadManufacturer();
    loadPOStatus();
    LoadPortOfLoading();
    LoadCFAgency();
    LoadShipingAgency();


    var url_string = window.location.href;
    var url = new URL(url_string);
    let Id = url.searchParams.get("POMasterId");
    if (Id != null) {
        POMasterId = Id.trim();
    }
    let ManuId = url.searchParams.get("ManufacturerId");
    if (ManuId != null) {
        ManufacturerId = ManuId.trim();
    }
    let status = url.searchParams.get("Status");
    if (status != null) {
        DelStatus = status.trim();
    }
    $('#ddlManufacturer').select2();
    $('#ddlPortLoading').select2();
    $('#ddlCFAgent').select2();

    if (POMasterId != "") {
        $('#hfId').val(POMasterId);
        $("#Status").show();
        GetPoEditData(POMasterId);
        $("#btnSave").val("Update");
        document.getElementById("txtPINumber").readOnly = true;
    } else {
        loadDocumentList(); loadProductionPic(); $("#Status").hide(); $("#btnSave").val("Save");
        document.getElementById("txtPINumber").readOnly = false;
        document.getElementById('txtDepUSD').readOnly = false;
        document.getElementById('txtDepAUD').readOnly = false;
        document.getElementById('txtDepositDate').readOnly = false;
    }

});

function getDate() {

    var monthsArr = new Array();
    // store month names into our array
    monthsArr[0] = "Jan";
    monthsArr[1] = "Feb";
    monthsArr[2] = "Mar";
    monthsArr[3] = "Apr";
    monthsArr[4] = "May";
    monthsArr[5] = "Jun";
    monthsArr[6] = "Jul";
    monthsArr[7] = "Aug";
    monthsArr[8] = "Sep";
    monthsArr[9] = "Oct";
    monthsArr[10] = "Nov";
    monthsArr[11] = "Dec";

    var todaydate = new Date();
    var day = todaydate.getDate();
    var month = todaydate.getMonth();
    var year = todaydate.getFullYear();
    var date = day + "-" + monthsArr[month] + "-" + year;
    document.getElementById("txtOrderDate").value = date;
}

function loadManufacturer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "ItemEntry/loadManufacturer",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlManufacturer'));
                ManList = [];
                ManList = result.listComboData;

                if (ManufacturerId != "") {
                    $('#ddlManufacturer').val(ManufacturerId).trigger('change');
                }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadPOStatus() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadPOStatus",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlOrderStatus'));

                if (stsval == '') { $('#ddlOrderStatus').val('1').trigger('change'); }
                else { $('#ddlOrderStatus').val(stsval).trigger('change'); }


            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadPortOfLoading() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/LoadPortOfLoading",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlPortLoading'));
                if (portOfLoading !== '') {
                    $('#ddlPortLoading').val(portOfLoading).trigger('change');
                }

            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadCFAgency() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/LoadCFAgency",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlCFAgent'));

                if (cfAgencyId !== '') {
                    $('#ddlCFAgent').val(cfAgencyId).trigger('change');
                }

            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadShipingAgency() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/LoadShipingAgency",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlShipingAgent'));

                if (shipAgentId !== "") {
                    $('#ddlShipingAgent').val(shipAgentId).trigger('change');
                }

            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
$(document).off('change', '#ddlManufacturer').on('change', '#ddlManufacturer', function () {
    if ($(this).val() !== '-1') {
        $('#txtManufacturerDets').val('');
        var manId = $(this).val();
        var mlst = $.grep(ManList,
          function (x) {
              if ('' + x.Value + '' === manId) {
                  return x;
              }
          });
        $('#txtManufacturerDets').val(mlst[0].ValueStr);
        $('#txtTradingTerms').val(mlst[0].ValueStr1);
        mlst = [];

        LoadTable(0);
    }
});

function LoadTable(ind) {

    var oList = ind; let TOrderValue = 0;
    $("#idtbody").empty();
    let content = '';
    if (ind == 0) {

        content += '<tr>' +
              '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
                     '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
              '</td>' +
          '<td><select id="ddlHead' + ind + '" class="span12 ddlHead">' + loadItemHead(ind) + '</select></td>' +
          '<td><input type="text" id="txtHeadDesc' + ind + '" Value="" class="span12 txtHeadDesc" readonly/></td>' +
          '<td><input type="text" id="txtBox' + ind + '" Value="" class="span12 txtBox" readonly /></td>' +
          '<td><input type="text" id="txtCBM' + ind + '" Value="" class="span12 txtCBM" readonly /><input type="hidden" class="hfCBM" id="hfCBM' + ind + '" value=""/></td>' +
          '<td><input type="text" id="txtOrderQty' + ind + '" Value="" class="span12 txtOrderQty"/></td>' +
          '<td><input type="text" id="txtUPrice' + ind + '"  Value="" class="span12 txtUPrice"/></td>' +
          '<td><input type="text" id="txtTPrice' + ind + '"  Value="" class="span12 txtTPrice" readonly />' +
              '<input type="hidden" class="hfPODetailId" id="hfPODetailId' + ind + '" value="0"/> </td>' +
          '</tr>';

        $('#tbl tbody').append(content);
        $('#ddlHead' + ind + "").select2();
    }
    else {
        let tBox = 0, tCBM = 0, tQty = 0, tUPrice = 0, totPrice = 0;
        $.each(oList,
          function (i, row) {
            debugger
              TOrderValue = TOrderValue + parseFloat(row.TotalPrice);
              tBox = tBox + parseInt(row.Box);
              tCBM = tCBM + parseFloat(row.CBM);
              tQty = tQty + parseInt(row.Quantity);
              tUPrice = tUPrice + parseFloat(row.UnitPrice);
              totPrice = totPrice + parseFloat(row.TotalPrice);
              editcmd = row.ItemHead;
             
              content += '<tr>' +
          '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
           '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
          '</td>' +
         '<td><select id="ddlHead' + (row.IHeadId + i) + '" class="span12 ddlHead"></select></td>' +
         '<td><input type="text" id="txtHeadDesc' + i + '" Value="" class="span12 txtHeadDesc" readonly/></td>' +
         '<td><input type="text" id="txtBox' + i + '" value="' + row.Box + '" class="span12 txtBox" readonly /></td>' +
         '<td><input type="text" id="txtCBM' + i + '" value="' + row.CBM + '"  class="span12 txtCBM" readonly /><input type="hidden" class="hfCBM" id="hfCBM' + i + '" value="' + row.CBM + '"/></td>' +
         '<td><input type="text" id="txtOrderQty' + i + '" value="' + parseInt(row.Quantity) + '" class="span12 txtOrderQty"/></td>' +
         '<td><input type="text" id="txtUPrice' + i + '"  value="' + row.UnitPrice + '" class="span12 txtUPrice"/></td>' +
         '<td><input type="text" id="txtTPrice' + i + '"  value="' + row.TotalPrice + '" class="span12 txtTPrice" readonly />' +
          '<input type="hidden" class="hfPODetailId" id="hfPODetailId' + i + '" value="' + row.PODetailId + '"/> </td>' +
         '</tr>';
          });
        $('#tbl tbody').append(content);

        $.each(oList,
        function (j, r) {
            EditloadItemHead(r.IHeadId, j);
            //$('#txtOrderQty' + j + "").val(parseInt(r.Quantity)).trigger('change');
            //$('#txtUPrice' + j + "").val(r.UnitPrice).trigger('change');
        });

        let bx = $("tfoot tr")[0].cells[2].childNodes[0].id;
        let cm = $("tfoot tr")[0].cells[3].childNodes[0].id;
        let qty = $("tfoot tr")[0].cells[4].childNodes[0].id;
        let price = $("tfoot tr")[0].cells[5].childNodes[0].id;
        let tot = $("tfoot tr")[0].cells[6].childNodes[0].id;
       
        document.getElementById(bx).innerHTML = tBox;
        document.getElementById(cm).innerHTML = tCBM.toFixed(3);
        document.getElementById(qty).innerHTML = tQty;
        document.getElementById(price).innerHTML = tUPrice.toFixed(2);
        document.getElementById(tot).innerHTML = totPrice.toFixed(2);
       
        let Tusd = $("#txtDepUSD").val() == "" ? 0 : $("#txtDepUSD").val();
        $("#txtBOPUSD").val(TOrderValue - Tusd);

    }
}

function loadItemHead(index) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadItemHead",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "ManufacturerId": $("#ddlManufacturer").val() }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlHead' + index));
                headList = [];
                headList = result.listComboData;
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

//// Dropdown load
function LoadDropdown(result, id) {
    //$(id)[0].options.length = 0;

    var content = '';
    content = '<option  value="-1">-- Select --</option>';
    if (result != null) {
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
    }
    id.append(content);
    id.val('-1').trigger('change');
    //if (result.length == 1) {
    //    id.val(result[0].Value).trigger('change');
    //}
}

$(document).off('click', '.btnAdd').on('click', '.btnAdd', function () {
    if (validationADD() === true) {
        var rowindex = $('#tbl tbody tr').length;
        addIndex = addIndex + rowindex;
        var content = addRow(addIndex);
        $("#tbl").append(content);
        LoadDropdown(headList, $('#ddlHead' + addIndex));
        $('#ddlHead' + addIndex + "").select2();

    }

});

$(document).off('click', '.btnRemove').on('click', '.btnRemove', function () {
   
    var index = $(this).closest('tr').index();
    var finishe = $(this).closest('tr');
    var poDetsId = $(this).closest('tr')[0].cells[7].childNodes[1].value;
    if ($("#tbl")[0].rows.length > 1) {
        //  if (index !== 0) {
       
        if (poDetsId == "0") {
            $(this).closest('tr').remove();
            footerBoxCBMCalculation();
            FooterQtyCalculation();
            FooterPriceCalculation();
            FooterToCalculation();
        } else {
            $.msgbox("Are you sure that you want to Remove ?", {
                type: "confirm",
                buttons: [
                    { type: "submit", value: "Yes" },
                    { type: "submit", value: "No" }
                ]
            }, function (result) {
                if (result == "Yes") {
                    let PODetailId = poDetsId
                    var urlpath = base + Controller + "/PODetailIdDelete";
                    $.ajax({
                        beforeSend: function () { $.blockUI(); },
                        complete: function () { $.unblockUI(); },
                        type: "POST",
                        url: urlpath,
                        contentType: "application/json;charset=utf-8",
                        dataType: "JSON",
                        data: JSON.stringify({ "PODetailId": PODetailId }),
                        success: function (result) {
                            if (result.IsSessionOut != null) {
                                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                                return false;
                            } else if (result.Error != null && result.Error != "") {
                                $.pnotify({ text: result.Error, type: 'error' });
                                return false;
                            } else {
                                finishe.remove();
                                footerBoxCBMCalculation();
                                FooterQtyCalculation();
                                FooterPriceCalculation();
                                FooterToCalculation();
                            }
                        }
                    });
                }
                else if (result == "No") {
                    $.pnotify({ text: "Cancel Operation", type: 'info' });
                }
            });
           
        }
       // }
    }
});

function addRow(addIndex) {
    var content = '';
    content += '<tr>' +
                 '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
                     '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
                  '</td>' +
               //'<td><button type="button" class="btn btn-mini icol-add btnAdd"></button> &nbsp &nbsp ' +
               //'<button type="button" class="btn btn-mini icol-cancel btnRemove"></button>' +
               //'</td>' +
               '<td><select id="ddlHead' + addIndex + '" class="span12 ddlHead"></select></td>' +
               '<td><input type="text" id="txtHeadDesc' + addIndex + '" Value="" class="span12 txtHeadDesc" readonly/></td>' +
              '<td><input type="text" id="txtBox' + addIndex + '" Value="" class="span12 txtBox" readonly /></td>' +
              '<td><input type="text" id="txtCBM' + addIndex + '" Value="" class="span12 txtCBM" readonly /><input type="hidden" class="hfCBM" id="hfCBM' + addIndex + '" value=""/></td>' +
              '<td><input type="text" id="txtOrderQty' + addIndex + '" Value="" class="span12 txtOrderQty"/></td>' +
              '<td><input type="text" id="txtUPrice' + addIndex + '"  Value="" class="span12 txtUPrice"/></td>' +
              '<td><input type="text" id="txtTPrice' + addIndex + '"  Value="" class="span12 txtTPrice" readonly />' +
              '<input type="hidden" class="hfPODetailId" id="hfPODetailId' + addIndex + '" value="0"/></td>' +
        '</tr>';
    return content;
}

$(document).off('keyup', '.txtOrderQty').on("keyup", ".txtOrderQty", function (event) {
    let a = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(a);
});

$(document).off('keyup', '.txtUPrice').on("keyup", ".txtUPrice", function (event) {
    let a = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(a);
});

$(document).off('change', '.ddlHead').on('change', '.ddlHead', function () {
    if ($(this).val() !== '-1') {
       
        var index = this.id.slice(7); //$(this).closest('tr').index();
        var itmName = $(this).closest("tr")[0].cells[2].childNodes[0].id;
        var box = $(this).closest("tr")[0].cells[3].childNodes[0].id;
        var cbm = $(this).closest("tr")[0].cells[4].childNodes[0].id;
        var hfcbm = $(this).closest("tr")[0].cells[4].childNodes[1].id
        var unitPrc = $(this).closest("tr")[0].cells[6].childNodes[0].id;
        var poDetsId = $(this).closest("tr")[0].cells[7].childNodes[1].value;

        var headId = $(this).val();
        var imlst = $.grep(headList,
          function (x) {
              if ('' + x.Value + '' === headId) {
                  return x;
              }
          });

        $('#' + itmName).val(imlst[0].ValueStr);
        $('#' + box).val(imlst[0].ValueStr2);
      
        if (editcmd == "" || poDetsId == "0") {
            $('#' + unitPrc).val(imlst[0].ValueStr3);
            $('#' + cbm).val(imlst[0].ValueStr1);
            $('#' + hfcbm).val(imlst[0].ValueStr1);
            footerBoxCBMCalculation();
            FooterPriceCalculation();
        }
        imlst = [];

       
    }
});

$(document).off('change', '.txtOrderQty').on('change', '.txtOrderQty', function () {
    var tcbm = $(this).closest("tr")[0].cells[4].childNodes[0].id;
    var hfcbm = $(this).closest("tr")[0].cells[4].childNodes[1].value;
    if ($(this).val() !== "" && $(this).val() !== "0") {

        var unitprice = $(this).closest("tr")[0].cells[6].childNodes[0].id;
        var totalprice = $(this).closest("tr")[0].cells[7].childNodes[0].id;
        let b = parseFloat($(this).val());
        let unitP = $('#' + unitprice).val();
        if (unitP !== "" && unitP !== "0") {
            let totalp = parseFloat(unitP) * parseFloat(b);
            $("#" + totalprice).val(totalp);
            FooterToCalculation();
        }
        let ccbbm = parseFloat(hfcbm) * parseFloat(b);
        $("#" + tcbm).val(ccbbm.toFixed(3));
        footerBoxCBMCalculation();
        FooterQtyCalculation();
    } else { $("#" + tcbm).val(hfcbm); footerBoxCBMCalculation(); FooterQtyCalculation(); }

});

$(document).off('change', '.txtUPrice').on('change', '.txtUPrice', function () {
    if ($(this).val() !== "" && $(this).val() !== "0") {
        var orderqty = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        var totalprice = $(this).closest("tr")[0].cells[7].childNodes[0].id;
        let b = parseFloat($(this).val());
        let aa = $('#' + orderqty).val();
        if (aa !== "" && aa !== "0") {
            let totalp = parseFloat(b) * parseFloat(aa);
            $("#" + totalprice).val(totalp.toFixed(2));
            FooterToCalculation();
        }
        FooterPriceCalculation();
    }
});

$('#btnSave').on('click', function () {
    if (validationADD() == true && OtherValidation() == true) {
        let save = $('#btnSave').val();
        if (save == 'Save') {
            DuplicateCheck();
        }
        else { SaveandUpdate(); }
    }

});

function SaveandUpdate() {

    var obj = {
        "POMasterId": $("#hfId").val(),
        "ManufacturerId": $("#ddlManufacturer").val(),
        "PONumber": $("#txtPONumber").val(),
        "PINumber": $("#txtPINumber").val(),
        "PODate": $("#txtOrderDate").val(),
        "Description": $("#txtDescription").val(),
        "PortOfLoading": $("#ddlPortLoading").val() == '-1' ? '' : $("#ddlPortLoading").val(),
        "ProductionTime": $("#txtProductionTime").val(),
        "DateOfLoading": $("#txtDateLoading").val(),
        "OrderStatusId": $("#ddlOrderStatus").val() == '-1' ? '' : $("#ddlOrderStatus").val(),
        "ProductionEndDate": $("#txtProductionEndDate").val(),
        "DepAmountUSD": $("#txtDepUSD").val(),
        "ShipRateUSD": $("#txtShipUSD").val(),
        "DepAmountAUD": $("#txtDepAUD").val(),
        "ShipRateAUD": $("#txtShipAUD").val(),
        "DepositDate": $("#txtDepositDate").val(),
        "DueDate": $("#txtDueDate").val(),
        "TransitTimeETD": $("#txtETD").val(),
        "TransitTimeETA": $("#txtETA").val(),
        "FreeDays": $("#txtFreeDays").val(),
        "ContainerNumber": $("#txtContainerNumber").val(),
        "CurrencyId": $("#ddlCurrency").val(),
        "ImportOrLocal": $('input[name="r1"]:checked').val(),
        "DocumentId": $("#ddlDocument").multipleSelect('getSelects').join(','),
        "ConversionRate": $("#txtConversionRate").val(),
        "TransitTime": $("#txtTransitTime").val(),
        "CFAgencyId": $("#ddlCFAgent").val() == '-1' ? '' : $("#ddlCFAgent").val(),
        "CFAgencyRate": $("#txtCFAgentRate").val(),
        "ShipingAgentId": $("#ddlShipingAgent").val() == '-1' ? '' : $("#ddlShipingAgent").val(),
        "BillofLading": $("#txtBillofLading").val(),
        "ETAWarehouse": $("#txtETAWarehouse").val(),
        "Notes": $("#txtNotes").val(),
        "ProdPicId": $("#ddlProductionPic").multipleSelect('getSelects').join(',')
    };

    var objList = GetSaveObject();
    var urlpath = base + Controller + "/Save";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj, "objList": objList }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                if ($('#hfId').val() == "") {
                    LoadTable(0);
                    ClearData();
                    $.pnotify({ text: 'Save Successfully', type: 'success' });
                }
                else {
                    $.pnotify({ text: 'Update Successfully', type: 'success' });
                    setTimeout(function () {
                        var baseUrl = base + 'PurchaseOrderEdit/PurchaseOrderEdit';
                        window.location.href = baseUrl;
                    }, 2000);

                }
            }
        }
    });
}
function DuplicateCheck() {
    let PINumber = $("#txtPINumber").val().trim();
    var urlpath = base + Controller + "/DuplicateCheck";
    $.ajax({
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "PINumber": PINumber }),
        success: function (data) {

            if (data.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }
            if (data.Save_error === "True") {
                $.pnotify({ text: 'PI No already exits.!', type: 'error' });
                $("#txtPINumber").focus();
                return false;
            }
            else { SaveandUpdate(); }
            return false;
        },
        error: function (a, b, c) {
            window.ShowCustomDialog(a, c, "Error in Data");
        }
    });

}

function validationADD() {
    var isresult = true;
    $("#tbl tr:gt(1)").each(function () {
        var headId = $(this).children('td:eq(1)').find("select").val();
        var orderQty = $(this).children('td:eq(5)').find("Input").val();
        var unitPrice = $(this).children('td:eq(6)').find("Input").val();

        if (headId == "undefined" || headId == "-1") {
            $(this).children('td:eq(1)').find(".select2-choice").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(1)').find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }

        if (orderQty == "undefined" || orderQty == "" || orderQty == "0") {
            $(this).children('td:eq(5)').find(".span12").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(5)').find(".span12").css({ 'border': '1px solid #aaa' });
        }


        if (unitPrice == "undefined" || unitPrice == "" || unitPrice == "0" || unitPrice == "0.00") {
            $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid red' });
            isresult = false;
        }
        else {
            $(this).children('td:eq(6)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

    });
    if (isresult)
        isresult = true;
    else {
        isresult = false;

    }
    return isresult;

}

function OtherValidation() {
    let valid = true;

    if ($('#ddlManufacturer').val() == '-1') {
        $('#s2id_ddlManufacturer').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Manufacturer Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlManufacturer').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }

    //if ($('#txtPONumber').val() == '') {
    //    $('#txtPONumber').css({ 'border': '1px solid red' });
    //    $.pnotify({ text: 'PO Number Requried', type: 'error' });
    //    $('#txtPONumber').focus();
    //    valid = false;
    //    return valid;
    //} else { $('#txtPONumber').css({ 'border': '1px solid #aaa' }); }

    if ($('#txtPINumber').val() == '') {
        $('#txtPINumber').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'PI No Requried', type: 'error' });
        $('#txtPINumber').focus();
        valid = false;
        return valid;
    } else { $('#txtPINumber').css({ 'border': '1px solid #aaa' }); }

    return valid;
}

function GetSaveObject() {
    let obj = [];
    $("#tbl tr:gt(1)").each(function () {

        let aobj = {
            "IHeadId": $(this).children('td:eq(1)').find("select").val(),
            "Box": $(this).children('td:eq(3)').find("input").val(),
            "CBM": $(this).children('td:eq(4)').find("input").val(),
            "Quantity": $(this).children('td:eq(5)').find("input").val(),
            "UnitPrice": $(this).children('td:eq(6)').find("input").val(),
            "TotalPrice": $(this).children('td:eq(7)').find("input").val(),
            "PODetailId": $(this).children('td:eq(7)').find("input[type=hidden]").val()
        }
        obj.push(aobj);
    });
    return obj;
}

function ClearData() {
    $("#ddlManufacturer").val('-1').trigger('change');
    $("#ddlOrderStatus").val('-1').trigger('change');
    $("#txtManufacturerDets").val('');
    $("#ddlPortLoading").val('-1').trigger('change');
    $("#ddlShipingAgent").val('-1').trigger('change');
    $("#txtConversionRate").val('');
    $("#txtPONumber").val('');
    $("#txtPINumber").val('');
    $("#txtDescription").val('');
    $("#txtProductionTime").val('');
    $("#txtProductionEndDate").val('');
    $("#txtTradingTerms").val('');
    $("#txtDateLoading").val('');
    $("#txtDepUSD").val('');
    $("#txtShipUSD").val('');
    $("#txtDepAUD").val('');
    $("#txtShipAUD").val('');
    $("#txtDepositDate").val('');
    $("#txtDueDate").val('');
    $("#txtETD").val('');
    $("#txtETA").val('');
    $("#txtFreeDays").val('');
    $("#txtContainerNumber").val('');
    $('#ddlDocument').multipleSelect("uncheckAll");
    $('#ddlProductionPic').multipleSelect("uncheckAll");
    $('#txtBillofLading').val('');
    $('#txtETAWarehouse').val('');
    $('#txtNotes').val('');
    $('#hfId').val('');
    let qty = $("tfoot tr")[0].cells[4].childNodes[0].id;
    document.getElementById(qty).innerHTML = '';
    let prce = $("tfoot tr")[0].cells[5].childNodes[0].id;
    document.getElementById(prce).innerHTML = '';
    let tot = $("tfoot tr")[0].cells[6].childNodes[0].id;
    document.getElementById(tot).innerHTML = '';
    let bx = $("tfoot tr")[0].cells[2].childNodes[0].id;
    let cm = $("tfoot tr")[0].cells[3].childNodes[0].id;
    document.getElementById(bx).innerHTML = '';
    document.getElementById(cm).innerHTML = '';
    document.getElementById("txtPINumber").readOnly = false;
    $("#btnSave").val("Save");
}

$('#btnRefresh').on('click', function () {
    var baseUrl = base + 'PurchaseOrder/PurchaseOrder';
    window.location.href = baseUrl;
    //ClearData();
    //LoadTable(0);
});
$('#btnCancel').on('click', function () {
    window.history.back();
});

//$(document).off('change', '#txtMail').on('change', '#txtMail', function () {
//    if ($(this).val() !== '') {
//        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//        if ($(this).val().match(mailformat)) {
//            return true;
//        }
//        else {
//            alert("You have entered an invalid email address.!");
//            $(this).val('');
//            return false;
//        }
//    }
//});


function FooterQtyCalculation() {

    var torderQty = '0';
    $("#tbl tr:gt(1)").each(function () {
        let orderQty = $(this).children('td:eq(5)').find("Input").val();
        torderQty = parseFloat(torderQty) + parseFloat(orderQty);
    });
    let qty = $("tfoot tr")[0].cells[4].childNodes[0].id;
    document.getElementById(qty).innerHTML = torderQty;

};

function FooterPriceCalculation() {

    var price = '0';
    $("#tbl tr:gt(1)").each(function () {
        let tprice = $(this).children('td:eq(6)').find("Input").val();
        price = (parseFloat(price) + parseFloat(tprice)).toFixed(2);
    });
    let prce = $("tfoot tr")[0].cells[5].childNodes[0].id;
    document.getElementById(prce).innerHTML = price;
}

function FooterToCalculation() {

    var tvalue = '0';
    $("#tbl tr:gt(1)").each(function () {
        let tval = $(this).children('td:eq(7)').find("Input").val();
        tvalue = (parseFloat(tvalue) + parseFloat(tval)).toFixed(2);
    });
    let tot = $("tfoot tr")[0].cells[6].childNodes[0].id;
    document.getElementById(tot).innerHTML = tvalue;
}

function footerBoxCBMCalculation() {
    var tobox = '0', tocbm = '0';
    $("#tbl tr:gt(1)").each(function () {
        let box = $(this).children('td:eq(3)').find("Input").val();
        let cbm = $(this).children('td:eq(4)').find("Input").val();
        tobox = parseInt(tobox) + parseInt(box);
        tocbm = (parseFloat(tocbm) + parseFloat(cbm)).toFixed(3);
    });
    let bx = $("tfoot tr")[0].cells[2].childNodes[0].id;
    let cm = $("tfoot tr")[0].cells[3].childNodes[0].id;
    document.getElementById(bx).innerHTML = tobox;
    document.getElementById(cm).innerHTML = tocbm;
}


function loadDocumentList() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadPODocumentList",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        //  data: JSON.stringify({ "headId": headId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                var content = '';
                //  LoadDropdown(result.listComboData, $('#ddlItem' + index));
                $("#ddlDocument")[0].options.length = 0;
                $('#ddlDocument option').remove();
                $.each(result.listComboData, function (i, obj) {
                    content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                });
                $('#ddlDocument').append(content);
                $('#ddlDocument').multipleSelect({
                    filter: true,
                    includeSelectAllOption: true,
                    placeholder: 'Document List'
                });
                $('.ms-parent button').addClass('btn2');
                $('.ms-parent button').show();
                if (DocumentList == "" || DocumentList == undefined) {
                    $('#ddlDocument').multipleSelect("uncheckAll");
                } else {
                    //var selectedOptions = DocumentList.split(",");
                    //for (var i in selectedOptions) {
                    //    var optionVal = selectedOptions[i];
                    //    
                    //    $("#ddlDocument").find("option[value=" + optionVal + "]").prop("selected",true);
                    //}
                    $("#ddlDocument").multipleSelect('setSelects', DocumentList);
                }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadProductionPic() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadProductionPic",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        //  data: JSON.stringify({ "headId": headId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                var content = '';
                //  LoadDropdown(result.listComboData, $('#ddlItem' + index));
                $("#ddlProductionPic")[0].options.length = 0;
                $('#ddlProductionPic option').remove();
                $.each(result.listComboData, function (i, obj) {
                    content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                });
                $('#ddlProductionPic').append(content);
                $('#ddlProductionPic').multipleSelect({
                    filter: true,
                    includeSelectAllOption: true,
                    placeholder: 'Production Picture'
                });
                $('.ms-parent button').addClass('btn2');
                $('.ms-parent button').show();
                if (productionPicList == "" || productionPicList == undefined) {
                    $('#ddlProductionPic').multipleSelect("uncheckAll");
                } else {

                    $("#ddlProductionPic").multipleSelect('setSelects', productionPicList);
                }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

$(document).off('keyup', '.number').on("keyup", ".number", function (event) {
    let w = $(this).val().replace(/[^0-9\.]/g, '');
    $(this).val(w);
});

$(document).off('click', '#btnFind').on('click', '#btnFind', function () {
    var baseUrl = base + 'PurchaseOrderEdit/PurchaseOrderEdit';
    window.location.href = baseUrl;
});

$(document).off('change', '#txtDepUSD').on('change', '#txtDepUSD', function () {
    if ($(this).val() !== '' && $(this).val() !== '0') {
        if ($("#txtDepAUD").val() !== '' && $("#txtDepAUD").val() !== '0') {

            let depUsd = $(this).val();
            let depUad = $("#txtDepAUD").val();
            var avg = (parseFloat(depUsd) / parseFloat(depUad));
            $("#txtConversionRate").val(avg.toFixed(3));
        } else { $("#txtConversionRate").val(''); }

    } else { $("#txtConversionRate").val(''); }
});

$(document).off('change', '#txtDepAUD').on('change', '#txtDepAUD', function () {
    if ($(this).val() !== '' && $(this).val() !== '0') {
        if ($("#txtDepUSD").val() !== '' && $("#txtDepUSD").val() !== '0') {
            let depUad = $(this).val();
            let depUsd = $("#txtDepUSD").val();
            var avg = parseFloat(depUsd) / parseFloat(depUad);
            $("#txtConversionRate").val(avg.toFixed(3));
        } else { $("#txtConversionRate").val(''); }
    } else { $("#txtConversionRate").val(''); }
});

$(document).off('change', '#txtOrderDate').on('change', '#txtOrderDate', function () {
    if ($(this).val() !== "") {
        if ($("#txtProductionEndDate").val() !== "") {
            let productionTime = $(this).val();
            let productionEndDate = $("#txtProductionEndDate").val();
            var date1 = new Date(productionTime);
            var date2 = new Date(productionEndDate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            $("#txtProductionTime").val(diffDays);
        } else { $("#txtProductionTime").val(''); }
    } else { $("#txtProductionTime").val(''); }
});

$(document).off('change', '#txtProductionEndDate').on('change', '#txtProductionEndDate', function () {
    if ($(this).val() !== "") {
        if ($("#txtOrderDate").val() !== "") {

            let productionEndDate = $(this).val();
            let productionTime = $("#txtOrderDate").val();
            var date1 = new Date(productionTime);
            var date2 = new Date(productionEndDate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            $("#txtProductionTime").val(diffDays);
        } else { $("#txtProductionTime").val(''); }
    }
    else { $("#txtProductionTime").val(''); }
});


$(document).off('change', '#txtETD').on('change', '#txtETD', function () {
    if ($(this).val() !== "") {
        if ($("#txtETA").val() !== "") {
            let eTD = $(this).val();
            let eTA = $("#txtETA").val();
            var date1 = new Date(eTD);
            var date2 = new Date(eTA);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            $("#txtTransitTime").val(diffDays);
        } else { $("#txtTransitTime").val(''); }
    } else { $("#txtTransitTime").val(''); }
});

$(document).off('change', '#txtETA').on('change', '#txtETA', function () {
    if ($(this).val() !== "") {
        if ($("#txtETD").val() !== "") {

            let eTA = $(this).val();
            let eTD = $("#txtETD").val();
            var date1 = new Date(eTD);
            var date2 = new Date(eTA);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            $("#txtTransitTime").val(diffDays);
        } else { $("#txtTransitTime").val(''); }
    }
    else { $("#txtTransitTime").val(''); }
});


function GetPoEditData(POMasterId) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetPoEditData",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "POMasterId": POMasterId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {

                var DataList = result.listPO;
                var mList = DataList[0];

                $("#txtOrderDate").val(mList[0].PODate);
                stsval = mList[0].OrderStatusId;
                $("#ddlOrderStatus").val(mList[0].OrderStatusId).trigger('change');
                portOfLoading = mList[0].PortOfLoading;
                LoadPortOfLoading();
                $("#txtPONumber").val(mList[0].PONumber);
                $("#txtPINumber").val(mList[0].PINumber);
                $("#txtDescription").val(mList[0].Description);
                $("#txtProductionTime").val(mList[0].ProductionTime).trigger('change');
                $("#txtProductionEndDate").val(mList[0].ProductionEndDate).trigger('change');
                $("#txtDateLoading").val(mList[0].DateOfLoading);
                $("#txtDepUSD").val(mList[0].DepAmountUSD).trigger('change');
                $("#txtShipUSD").val(mList[0].ShipRateUSD);
                $("#txtDepAUD").val(mList[0].DepAmountAUD).trigger('change');
                $("#txtShipAUD").val(mList[0].ShipRateAUD);
                $("#txtDepositDate").val(mList[0].DepositDate);
                $("#txtDueDate").val(mList[0].DueDate);
                $("#txtETD").val(mList[0].TransitTimeETD).trigger('change');
                $("#txtETA").val(mList[0].TransitTimeETA).trigger('change');
                $("#txtFreeDays").val(mList[0].FreeDays);
                $("#txtCFAgentRate").val(mList[0].CFAgencyRate);
                $("#txtContainerNumber").val(mList[0].ContainerNumber);
                $("#txtBillofLading").val(mList[0].BillofLading);
                $("#txtETAWarehouse").val(mList[0].ETAWarehouse);
                $("#txtNotes").val(mList[0].Notes);
                document.getElementById('txtDepUSD').readOnly = true;
                document.getElementById('txtDepAUD').readOnly = true;
                document.getElementById('txtDepositDate').readOnly = true;

                cfAgencyId = mList[0].CFAgencyId;
                LoadCFAgency();
                shipAgentId = mList[0].ShipingAgentId;
                LoadShipingAgency();

                DocumentList = mList[0].DocumentId;
                loadDocumentList();

                productionPicList = mList[0].ProdPicId;
                loadProductionPic();

                var dList = DataList[1];
                LoadTable(dList);

                if (DelStatus == "Delivered") {
                    $("#btnSave").prop("disabled", true);
                } else { $("#btnSave").prop("disabled", false); }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function EditloadItemHead(ddl, i) {
   
    if (editHeadLst.length == 0) {
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: base + Controller + "/loadItemHead",
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            async: false,
            data: JSON.stringify({ "ManufacturerId": ManufacturerId }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                    return false;
                }
                if (result.Error != null) {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    headList = [];
                    headList = result.listComboData;
                    editHeadLst = [];
                    editHeadLst = result.listComboData;
                    EditLoadDropdown(result.listComboData, $('#ddlHead' + ddl + i), ddl);
                }
            },
            error: function (a, b, c) {
                $.pnotify({ text: 'Something Wrong', type: 'error' });
            }
        });
    } else {
        EditLoadDropdown(editHeadLst, $('#ddlHead' + ddl + i), ddl);
    }
}

function EditLoadDropdown(result, ddl, Id) {
  //  $(ddl)[0].options.length = 0;
    var content = '';
    content = '<option  value="-1">-- Select --</option>';
    if (result != null) {
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
    }
    ddl.append(content);
    $(ddl).select2();
    if (Id !== 0 && Id !== 23 && Id !== 25 && Id !== 27 && Id !== 29 && Id !== '') {
        if ($('#hfId').val() !== '') {
            $(ddl).val(Id).trigger('change');
        }
    }
}

