//---------- All Global Variable ----------------//
var count = 0, CurrentController = "ManualBooking", addIndex = 22, headList = [];
$("span#sidebar-toggle").trigger('click');

$(document).ready(function () {
    $("#ddlDespatchVia").select2();
    $("#ddlBookingType").select2();
    $("#txtBookingDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    loadDeliveryMethod();
    debugger;
    var url_string = window.location.href;
    var url = new URL(url_string);
    let invNo = url.searchParams.get("invNo");
    if (invNo != null) {
        let bookId = invNo.trim();
        loadDataInvoiceWise(bookId)
    } else { $("#dividfreight").hide(); BindItemGrid(0); }

});

function BindItemGrid(ind) {
    $("#idtbody").empty();
    let content = '';
    if (ind == 0) {
        content += '<tr>' +
           '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
              '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
           '</td>' +
           '<td><input type="text" id="ddlHead' + ind + '" class="span12 ddlHead"/><input type="hidden" id="hdddlHead"/></td>' +
           '<td><input type="text" id="txtHeadDesc' + ind + '" class="span12 txtHeadDesc"/><input type="hidden" id="hfSaleDetId' + ind + '" value="0"/></td>' +
            '<td><input type="text" id="txtQty' + ind + '"  Value="" class="span12 txtQty numeric" /></td>' +
            '<td><input type="text" id="txtNoofBox' + ind + '"  Value="" class="span12 txtNoofBox numeric" /></td>' +
            '<td><input type="text" id="txtTrakingNo' + ind + '"  Value="" style="width: 85px;" class="span12 txtTrakingNo" /></td>' +
            '<td><input type="text" id="txtRequiedDate' + ind + '"  Value="" style="width: 90px;" class="span12 txtRequiedDate date" /></td>' +
            '<td><input type="text" id="txtDeliveryDate' + ind + '"  Value="" style="width: 90px;" class="span12 txtDeliveryDate date" /></td>' +
            '<td><input type="text" id="txtDeliveryCost' + ind + '"  Value="" style="width: 65px;" class="span12 txtDeliveryCost numeric" /></td>' +
            '<td><input type="text" id="txtPointSale' + ind + '"  Value="" style="width: 115px;" class="span12 txtPointSale" /></td>' +
           '</tr>';
        $('#tbl tbody').append(content);
        $(".date").datepicker({ dateFormat: 'dd-M-yy' });
    } else {
        $.each(ind,function (index, obj) {
            content += '<tr>' +
          '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
             '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
          '</td>' +
          '<td><input type="text" id="ddlHead' + index + '" class="span12 ddlHead" Value="'+obj.ItemCode+'"/><input type="hidden" id="hdddlHead"/></td>' +
          '<td><input type="text" id="txtHeadDesc' + index + '" class="span12 txtHeadDesc" Value="' + obj.IHeadDescription + '"/><input type="hidden" id="hfSaleDetId' + index + '" value="0"/></td>' +
           '<td><input type="text" id="txtQty' + index + '"  Value="' + obj.SaleQty + '" class="span12 txtQty numeric" /></td>' +
           '<td><input type="text" id="txtNoofBox' + index + '"  Value="' + obj.Box + '" class="span12 txtNoofBox numeric" /></td>' +
           '<td><input type="text" id="txtTrakingNo' + index + '"  Value="' + obj.TrakingNo + '" style="width: 85px;" class="span12 txtTrakingNo" /></td>' +
           '<td><input type="text" id="txtRequiedDate' + index + '"  Value="' + obj.RequiredDate + '" style="width: 90px;" class="span12 txtRequiedDate date" /></td>' +
           '<td><input type="text" id="txtDeliveryDate' + index + '"  Value="' + obj.DeliveryDate + '" style="width: 90px;" class="span12 txtDeliveryDate date" /></td>' +
           '<td><input type="text" id="txtDeliveryCost' + index + '"  Value="' + obj.DeliveryCost + '" style="width: 65px;" class="span12 txtDeliveryCost numeric" /></td>' +
           '<td><input type="text" id="txtPointSale' + index + '"  Value="' + obj.SalePoint + '" style="width: 115px;" class="span12 txtPointSale" /></td>' +
          '</tr>';
        });
        $('#tbl tbody').append(content);
        $(".date").datepicker({ dateFormat: 'dd-M-yy' });
    }
   
}


function loadDeliveryMethod() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadDeliveryMethod",
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
                LoadDropdown(result.listComboData, $('#ddlMethod'));

            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
//// Dropdown load
function LoadDropdown(result, id) {
    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        if (result.length > 1) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        } else {
            content += '<option  selected value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        }

    });
    $(id).append(content);
    //$(id).val('').trigger('change');
    $(id).select2();

}

function addRow(addIndex) {

    var content = '';
    content += '<tr>' +
               '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
               '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
               '</td>' +
               '<td><input type="text" id="ddlHead' + addIndex + '" class="span12 ddlHead"/><input type="hidden" id="hdddlHead"/></td>' + //' + loadItem(addIndex) + '
               '<td><input type="text" id="txtHeadDesc' + addIndex + '" class="span12 txtHeadDesc"/><input type="hidden" id="hfSaleDetId' + addIndex + '" value="0"/></td>' +
               '<td><input type="text" id="txtQty' + addIndex + '"  Value="" class="span12 txtQty numeric" /></td>' +
                '<td><input type="text" id="txtNoofBox' + addIndex + '"  Value="" class="span12 txtNoofBox numeric" /></td>' +
                '<td><input type="text" id="txtTrakingNo' + addIndex + '"  Value="" style="width: 85px;" class="span12 txtTrakingNo" /></td>' +
                '<td><input type="text" id="txtRequiedDate' + addIndex + '"  Value="" style="width: 90px;" class="span12 txtRequiedDate date" /></td>' +
                '<td><input type="text" id="txtDeliveryDate' + addIndex + '"  Value="" style="width: 90px;" class="span12 txtDeliveryDate date" /></td>' +
                '<td><input type="text" id="txtDeliveryCost' + addIndex + '"  Value="" style="width: 65px;" class="span12 txtDeliveryCost numeric" /></td>' +
                '<td><input type="text" id="txtPointSale' + addIndex + '"  Value="" style="width: 115px;" class="span12 txtPointSale" /></td>' +
        '</tr>';
    return content;

}

function loadMultipleColumnHeadId(tblRow) {
    debugger;
    var coloumLLst = [];
    var colors = [];
    var value = $($($(tblRow).children('td:eq(1)').children())[0]).val();
    var urlpath = base + CurrentController + "/GetItemHeadAutoComplete";
    var myRes = [];
    var aObj = {
        "SearchText": value,
    };
    $.ajax({
        type: "POST",
        url: urlpath,
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ "aObj": aObj }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: "Your Session Is Over,Please Login Again", type: 'error' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                //$.pnotify({ text: "Loading Error", type: 'error' });
                return false;
            } else {
                debugger;
                myRes = result.ListAutoCpomplete;
                coloumLLst = [{ name: 'Code', minWidth: '90px' }];
                colors = [];
                $.each(result.ListAutoCpomplete, function (i, obj) {
                    var color = [];
                    color.push(obj.value);
                    colors.push(color);
                });

                //  automdatacoplete(Id, coloumLLst, colors);
                $($($(tblRow).children('td:eq(1)').children())[0]).mcautocomplete({
                    showHeader: true,
                    columns: coloumLLst,
                    source: colors,
                    select: function (event, ui) {

                        var headCode = (ui.item ? ui.item[0] : '');
                        this.value = headCode;
                        var imlst = $.grep(myRes,
                          function (x) {
                              if (x.value == headCode) {
                                  return x;
                              }
                          });
                        $($($(tblRow).children('td:eq(1)')).find('input[type="hidden"]')).val(imlst[0].id);
                        debugger;
                        var itmName = $($(tblRow).children('td:eq(2)').find('input')).attr('id');
                        var addNewIndex = 0;
                        $('#' + itmName).val(imlst[0].Data);
                        $('#' + itmName).attr('title', imlst[0].Data);
                        var index = $(tblRow).index();
                        if (index > 0) {
                            addNewIndex = addIndex + index;
                        } else {
                            addNewIndex = index;
                        }
                        return false;
                    },
                });

            }
        },
        error: function (errRes) {
            $.pnotify({ text: formatErrorMessage(errRes), type: 'error' });
        }
    });

}

function loadItemHead(tblRow) {

    var value = $($($(tblRow).children('td:eq(1)').children())[0]).val();// $(tblRow).children('td:eq(1)').children().text();
    $($($(tblRow).children('td:eq(1)').children())[0]).autocomplete({
        source: function (request, response) {
            var aObj = {
                "SearchText": value// ReviseReasonBulk

            };

            var urlpath = base + CurrentController + "/GetItemHeadAutoComplete";
            $.ajax({
                type: "POST",
                url: urlpath,
                dataType: "JSON",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({ "aObj": aObj }),
                success: function (result) {
                    if (result.IsSessionOut != null) {
                        $.pnotify({ text: "Your Session Is Over,Please Login Again", type: 'error' });
                        // notify('danger', "Your Session Is Over,Please Login Again");
                        return false;
                    } else if (result.Error != null && result.Error != "") {
                        // notify('danger', result.Error);
                        return false;
                    } else {

                        response(result.ListAutoCpomplete);
                        loadItemDDl(result.ListAutoCpomplete, tblRow);


                    }
                },
                error: function (errRes) {
                    // notify('danger', formatErrorMessage(errRes));
                    $.pnotify({ text: formatErrorMessage(errRes), type: 'error' });
                }
            });


        },
        minLength: 2,
        select: function (event, ui) {

            $($($(tblRow).children('td:eq(1)')).find('input[type="hidden"]')).val(ui.item.id);
            // $($($(tblRow).children('td:eq(1)').children())[1]).val(ui.item.id);
            var itmName = $($(tblRow).children('td:eq(2)').find('input')).attr('id');
            var r = $($(tblRow).children('td:eq(4)').find('input')).attr('id');
            var headId = ui.item.id;
            //var imlst = $.grep(headList,
            //  function (x) {
            //      if ('' + x.Value + '' === headId) {
            //          return x;
            //      }
            //  });
            var addNewIndex = 0;
            $('#' + itmName).val(ui.item.Data);
            $('#' + itmName).attr('title', ui.item.Data);
            // imlst = [];

            $('#' + r).val('');
            var index = $(tblRow).index();
            if (index > 0) {
                addNewIndex = addIndex + index;
            } else {
                addNewIndex = index;
            }

        }
    });
}

function loadItemDDl(itemlist, tblRow) {

    $($(tblRow).children('td:eq(1)').children()).inputpicker({
        data: itemlist,
        fields: [
            { name: 'value', text: 'Code' },
            { name: 'text', text: 'Qty' }
            //{ name: 'description', text: 'Description' }
        ],
        autoOpen: true,
        headShow: true,
        fieldText: 'value',
        fieldValue: 'text',
        pagination: true,
        pageMode: '',
        pageField: 'p',
        pageLimitField: 'per_page',
        limit: 5,
        pageCurrent: 1
    });
}

$(document).off('click', '.btnRemove').on('click', '.btnRemove', function () {

    var index = $(this).closest('tr').index();
    var finishe = $(this).closest('tr');
    var saleDetsId = $(this).closest('tr')[0].cells[2].childNodes[1].value;
    if ($("#tbl")[0].rows.length > 1) {
        if (saleDetsId == "0") {
            $(this).closest('tr').remove();
        } else {
            $.msgbox("Are you sure that you want to Remove ?", {
                type: "confirm",
                buttons: [
                    { type: "submit", value: "Yes" },
                    { type: "submit", value: "No" }
                ]
            }, function (result) {
                if (result == "Yes") {
                    var urlpath = base + CurrentController + "/SaleDetailIdDelete";
                    $.ajax({
                        beforeSend: function () { $.blockUI(); },
                        complete: function () { $.unblockUI(); },
                        type: "POST",
                        url: urlpath,
                        contentType: "application/json;charset=utf-8",
                        dataType: "JSON",
                        data: JSON.stringify({ "saleDetsId": saleDetsId }),
                        success: function (result) {
                            if (result.IsSessionOut != null) {
                                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                                return false;
                            } else if (result.Error != null && result.Error != "") {
                                $.pnotify({ text: result.Error, type: 'error' });
                                return false;
                            } else {
                                finishe.remove();
                               
                            }
                        }
                    });
                }
                else if (result == "No") {
                    $.pnotify({ text: "Cancel Operation", type: 'info' });
                }
            });

        }
    }
    //var index = $(this).closest('tr').index();
    //var finishe = $(this).closest('tr');
    //if (index !== 0) {
    //    $(this).closest('tr').remove();
    //}
});

$(document).off('click', '.btnAdd').on('click', '.btnAdd', function () {

    if (validationADD() === true) {

        var rowindex = $('#tbl tbody tr').length;
        var addNewIndex = addIndex + rowindex;
        var content = addRow(addNewIndex);
        $("#tbl").append(content);
        $(".date").datepicker({ dateFormat: 'dd-M-yy' });
       // loadInisialColumnHeadId(('#ddlHead' + addNewIndex));

    }

});

function getdecimalvalue(val) {
    return parseFloat((Math.floor(100 * val) / 100).toFixed(2));
}

$('body').on("keyup", '.ddlHead', function (e) {
    var tblRow = $(this).closest('tr');
   // loadMultipleColumnHeadId(tblRow);
});


function validationADD() {
    var isresult = true;
    $("#tbl tr:gt(0)").each(function () {
        debugger;
        var headId = $(this).children('td:eq(1)').find("input").val();//ddlHead
        var qty = $(this).children('td:eq(3)').find("input").val();
        var box = $(this).children('td:eq(4)').find("input").val();
        var salePoint = $(this).children('td:eq(9)').find("input").val();
        if (headId == undefined || headId == "") {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid #aaa' });
        }

        if (qty == undefined || qty == "" || qty == "0") {
            $(this).children('td:eq(3)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(3)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

        if (box == undefined || box == "" || box == "0") {
            $(this).children('td:eq(4)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(4)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

        //if (salePoint == undefined || salePoint == "") {
        //    $(this).children('td:eq(9)').find(".span12").css({ 'border': '1px solid red' });
        //    return isresult = false;
        //}
        //else {
        //    $(this).children('td:eq(9)').find(".span12").css({ 'border': '1px solid #aaa' });
        //}
    });
    if (isresult)
        isresult = true;
    else {
        return isresult = false;
    }
    return isresult;

}

function ValidateForSave() {
    var isresult = true;
    // if (validationADD() == true) {
    var txtBookingDate = $("#txtBookingDate").val();
    var CustomerName = $("#txtRecvName").val();
    var invoiceNo = $("#txtInvoiceSl").val();
    var bookingType = $("#ddlBookingType").val();
    var ShipVia = $("#ddlDespatchVia").val();

    if (CustomerName == "undefined" || CustomerName == "") {
        $("#txtRecvName").css({ 'border': '1px solid red' });
        $("#txtRecvName").focus();
        isresult = false;
    }
    else {
        $("#txtRecvName").css({ 'border': '1px solid #aaa' });
    }

    if (txtBookingDate == "undefined" || txtBookingDate == "") {
        $("#txtBookingDate").css({ 'border': '1px solid red' });
        $("#txtBookingDate").focus();
        isresult = false;
    }
    else {
        $("#txtBookingDate").css({ 'border': '1px solid #aaa' });
    }
    if (invoiceNo == "undefined" || invoiceNo == "") {
          $("#txtInvoiceSl").css({ 'border': '1px solid red' });
          $("#txtInvoiceSl").focus();
            isresult = false;
        }
        else {
          $("#txtInvoiceSl").css({ 'border': '1px solid #aaa' });
    }

    if (bookingType == "undefined" || bookingType == "-1") {
        $("#s2id_ddlBookingType").find(".select2-choice").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#s2id_ddlBookingType").find(".select2-choice").css({ 'border': '1px solid #aaa' });
    }
   
    if (ShipVia == "undefined" || ShipVia == "-1") {
        $("#s2id_ddlDespatchVia").find(".select2-choice").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#s2id_ddlDespatchVia").find(".select2-choice").css({ 'border': '1px solid #aaa' });
    }

    if (ShipVia == "2") {
        if ($("#ddlMethod").val() == "-1") {
            $("#s2id_ddlMethod").find(".select2-choice").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $("#s2id_ddlMethod").find(".select2-choice").css({ 'border': '1px solid #aaa' });
        }
    }

    if (isresult)
        isresult = true;
    else {
        isresult = false;
    }
    return isresult;
}

function GetSaveObject(parameters) {
    var isNewAddress, Address = "";
    var obj = {
        //  "Address": $("#NewAddressEntry").val(),
        "InvoiceNo": $("#txtInvoiceSl").val(),
        "InvoiceDate": $("#txtBookingDate").val(),
        "BookingType": $("#ddlBookingType").val(),
        "SpecialInstruction": $("#txtInstruction").val(),
        "Notes": $("#txtNotes").val(),
        "DespatchViaId": $("#ddlDespatchVia").val(),
        "DespatchMethodId": $("#ddlMethod").val() == "-1" ? "0" : $("#ddlMethod").val(),
        "ReferenceNo": $("#txtReferenceNo").val(),
        "CustomerName": $("#txtRecvName").val(),
        "CustomerAddress": $("#txtRecvAddress").val(),
        "City": $("#txtRecvSuburb").val(),
        "PostalCode": $("#txtPostalCode").val(),
        "MobileNo": $("#txtRecvMobileNo").val()
    }
    return obj;
}

function getChildData() {
    let obj = [];
    $("#tbl tr:gt(0)").each(function () {

        let aobj = {
           // "IHeadId": $(this).children('td:eq(1)').find('input[type="hidden"]').val(),
            "ItemCode": $(this).children('td:eq(1)').find("input").val(),
            "IHeadDescription": $(this).children('td:eq(2)').find("input").val(),
            "SaleQty": $(this).children('td:eq(3)').find("input").val(),
            "Box": $(this).children('td:eq(4)').find("input").val(),
            "TrakingNo": $(this).children('td:eq(5)').find("input").val(),
            "RequiredDate": $(this).children('td:eq(6)').find("input").val(),
            "DeliveryDate": $(this).children('td:eq(7)').find("input").val(),
            "DeliveryCost": $(this).children('td:eq(8)').find("input").val() == "" ? 0 : $(this).children('td:eq(8)').find("input").val(),
            "SalePoint": $(this).children('td:eq(9)').find("input").val()
        }
        obj.push(aobj);
    });
    return obj;
}

$("#btnSave").on('click', function () {
    debugger;
    if ((ValidateForSave() == true) && (validationADD() == true)) {

        if ($("#btnSave").val() == "Update") {
            $.msgbox("Are you sure that you want to Update Invoice ?", {
                type: "confirm",
                buttons: [
                    { type: "submit", value: "Yes" },
                    { type: "submit", value: "No" }
                ]
            }, function (result) {
                if (result == "Yes") {
                    saveUpdate();
                }
                else if (result == "No") {
                    $.pnotify({ text: "Cancel Operation", type: 'info' });
                }
            }
          );
        } else { saveUpdate(); }

    }

});

function saveUpdate() {

    var obj = GetSaveObject();
    var lstOfChildData = getChildData();
    var urlpath = base + CurrentController + "/Save";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj, "lstOfChildData": lstOfChildData }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                if (result.list.length > 0) {
                    $.pnotify({ text: 'Save Success', type: 'info' });
                    clearAllField();
                    $('#btnSave').val('Save');
                    //   $('#txtInvoiceSl').val(result.lstsalesReturnObj[0].InvoiceNo);
                    let Invoice = result.list[0].InvoiceNo;
                    //setTimeout(function () {
                    //    var url = base + "SalesReports/Index?Invoice=" + Invoice + "&Term=" + term;
                    //    window.open(url, '_blank');
                    //}, 2000);

                }
            }
        }
    });
}

$('#btnRefresh').on('click', function () {
    // clearAllField();
    var url = base + "ManualBooking/ManualBooking";
    window.location.href = url;

});
$('#btnCancel').on('click', function () {
    window.history.back();
});

function clearAllField() {
    // LoadInvoice();

    $("#txtBookingDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    $("#txtInvoiceSl").val('');
    $("#ddlBookingType").val("-1").trigger('change');
    $("#ddlDespatchVia").val("-1").trigger('change');
    $("#txtInstruction").val("");
    $("#txtNotes").val("");
    $("#ddlMethod").val("-1").trigger('change');
    $("#txtReferenceNo").val("");
    $("#txtRecvName").val('');
    $("#txtRecvAddress").val('');
    $("#txtRecvSuburb").val('');
    $("#txtPostalCode").val('');
    $("#txtRecvMobileNo").val('');
    $('#btnSave').val('Save');
    $("#btnSave").prop("disabled", false);
    BindItemGrid(0);
}

function loadAllSaleData(inv) {
    var urlpath = base + CurrentController + "/GetAllSale";
    var obj = {
        SearchText: inv
    }
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (result) {
            if (result != null) {
                document.getElementById('btnPayment').style.display = '';
                document.getElementById('btnHistory').style.display = '';
                document.getElementById('btnPrint').style.display = '';
                document.getElementById('btnMail').style.display = '';
                document.getElementById('btnSaleReturn').style.display = '';
                BindMasterSalesData(result.SalesDaoMasterEdit);
                BindGridSalesData(result.SalesDaoChildEdit);


            }

        }

    });
}

$(".numeric").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

function loadInisialColumnHeadId(tblRow) {
    let coloumLLst = [];
    let colors = [];
    let value = $(tblRow).val();
    var urlpath = base + CurrentController + "/GetInialAutoComplete";
    let myRes = [];
    let aObj = {
        "SearchText": value,
    };
    $.ajax({
        type: "POST",
        url: urlpath,
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ "aObj": aObj }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: "Your Session Is Over,Please Login Again", type: 'error' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                //$.pnotify({ text: "Loading Error", type: 'error' });
                return false;
            } else {
                debugger;
                myRes = result.ListAutoCpomplete;
                coloumLLst = [{ name: 'Code', minWidth: '90px' }];
                colors = [];
                $.each(result.ListAutoCpomplete, function (i, obj) {
                    var color = [];
                    color.push(obj.value);
                    colors.push(color);
                });
                $(tblRow).mcautocomplete({
                    showHeader: true,
                    columns: coloumLLst,
                    source: colors,
                    select: function (event, ui) {
                        var headCode = (ui.item ? ui.item[0] : '');
                        this.value = headCode;
                        var imlst = $.grep(myRes,
                          function (x) {
                              if (x.value == headCode) {
                                  return x;
                              }
                          });
                        return false;
                    },
                });

            }
        },
        error: function (errRes) {
            $.pnotify({ text: formatErrorMessage(errRes), type: 'error' });
        }
    });
}

$(document).off('change', '#ddlDespatchVia').on('change', '#ddlDespatchVia', function () {
    debugger;
    if ($(this).val() == "2") {
        $("#dividfreight").show();
    } else { $("#dividfreight").hide(); }

});

function loadDataInvoiceWise(inv) {
    var urlpath = base + CurrentController + "/GetSalesDataByInvNo";
    var obj = {
        InvoiceNo: inv
    }
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (result) {
            if (result != null) {
                MasterSalesData(result.masterList);
                debugger;
                // BindGridSalesData(result.list);
                BindItemGrid(result.list)

            }

        }

    });
}

function MasterSalesData(data) {

    $("#txtBookingDate").val(data[0].InvoiceDate);
    $("#txtInvoiceSl").val(data[0].InvoiceNo);
    $("#ddlBookingType").val(data[0].BookingType).trigger('change');
    $("#ddlDespatchVia").val(data[0].DespatchViaId).trigger('change');
    $("#txtInstruction").val(data[0].SpecialInstruction);
    $("#txtNotes").val(data[0].Notes);
    if (data[0].DespatchViaId == 2) { $("#ddlMethod").val(data[0].DespatchMethodId).trigger('change'); $("#dividfreight").show(); }
    else {
        $("#ddlMethod").val("-1").trigger('change'); $("#dividfreight").hide();
    }
    $("#txtReferenceNo").val(data[0].ReferenceNo);
    $("#txtRecvName").val(data[0].CustomerName);
    $("#txtRecvAddress").val(data[0].CustomerAddress);
    $("#txtRecvSuburb").val(data[0].City);
    $("#txtPostalCode").val(data[0].PostalCode);
    $("#txtRecvMobileNo").val(data[0].MobileNo);
   // $('#btnSave').val('Save');
    $("#btnSave").prop("disabled", true);
}
