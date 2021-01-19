//---------- All Global Variable ----------------//
var count = 0, CurrentController = "StockTransfer", addIndex = 22, headList = [];
var FSite = [], TSite = [], locId = '', tsiteId = '', reqsiteId = '', desId = '', personId = '';
$("span#sidebar-toggle").trigger('click');

$(document).ready(function () {
    // $("#ddlDespatchVia").select2();
    $(".date").datepicker({ dateFormat: 'dd-M-yy' });
    $("#txtBookingDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    LoadFromSite();
    LoadShippingMethod();
    LoadUserPerson();
    var url_string = window.location.href;
    var url = new URL(url_string);
    let invNo = url.searchParams.get("invNo");
    if (invNo != null) {
        let transId = invNo.trim();
        $("#maintrId").show();
        locId = '';
        tsiteId = ''; reqsiteId = ''; desId = ''; personId = '';
        loadDataInvoiceWise(transId)
    } else {
        $("#maintrId").hide(); BindItemGrid(0);
        document.getElementById('btnRemove').style.display = 'none';
        document.getElementById('btnPrint').style.display = 'none';
    }

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
           '<td><input type="text" id="txtHeadDesc' + ind + '" class="span12 txtHeadDesc"/><input type="hidden" id="hfDetId' + ind + '" value="0"/></td>' +
           '<td><input type="text" id="txtInhandQty' + ind + '"  Value="" readonly class="span12 txtInhandQty" /></td>' +
            '<td><input type="text" id="txtQty' + ind + '"  Value="" class="span12 txtQty numeric" /></td>' +
            '<td><input type="text" id="txtNoofBox' + ind + '"  Value="" readonly class="span12 txtNoofBox numeric"/> <input type="hidden" id="hfbox" class="hfbox"/></td>' +
            '<td><input type="text" id="txtDeliveryCost' + ind + '"  Value="" style="width: 80px;" class="span12 txtDeliveryCost numeric" /></td>' +
           '</tr>';
        $('#tbl tbody').append(content);

        loadInisialColumnHeadId(('#ddlHead' + ind));
    } else {
        $.each(ind, function (index, obj) {

            let status = '';
            if (obj.SalePoint == "Despatch") {
                status = 'readonly';
            } else { status = ""; }
            content += '<tr>' +
          '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
             '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
          '</td>' +
          '<td><input type="text" id="ddlHead' + index + '" class="span12 ddlHead" ' + status + ' Value="' + obj.ItemCode + '"  /><input type="hidden" id="hdddlHead" Value="' + obj.IHeadId + '"/></td>' +
          '<td><input type="text" id="txtHeadDesc' + index + '" class="span12 txtHeadDesc" ' + status + ' Value="' + obj.IHeadDescription + '" /><input type="hidden" id="hfDetId' + index + '" value="' + obj.STransferDetsId + '"/></td>' +
          '<td><input type="text" id="txtInhandQty' + index + '"  Value="' + obj.InhandStock + '" readonly class="span12 txtInhandQty" /></td>' +
           '<td><input type="text" id="txtQty' + index + '"  Value="' + obj.SaleQty + '" ' + status + '  class="span12 txtQty numeric" /> </td>' +
           '<td><input type="text" id="txtNoofBox' + index + '"  Value="' + obj.Box + '" class="span12 txtNoofBox numeric" readonly /> <input type="hidden" id="hfbox" class="hfbox"/></td>' +
           '<td><input type="text" id="txtDeliveryCost' + index + '"  Value="' + obj.DeliveryCost + '" ' + status + ' style="width: 80px;" class="span12 txtDeliveryCost numeric" /></td>' +

          '</tr>';
        });
        $('#tbl tbody').append(content);


    }

}

function LoadFromSite() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadFromSite",
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
                FSite = [];
                LoadDropdown(result.listComboData, $('#ddlFromSite'));
                FSite = result.listComboData;
                LoadDropdown(result.listComboData, $('#ddlToSite'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadShippingMethod() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "Sales/GetShippingMethod",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlDespatchVia'));
            if (desId != '') {
                $('#ddlDespatchVia').val(desId).trigger('change');
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadUserPerson() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadUserPerson",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result.listComboData, $('#ddlPerson'));
            if (personId != '') {
                $('#ddlPerson').val(personId).trigger('change');
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

$(document).off('change', '#ddlFromSite').on('change', '#ddlFromSite', function () {
    if ($(this).val() !== "-1") {
        LoadToSite($(this).val());
        let a = $(this).val();
        var newFsite = $.grep(FSite,
           function (o) {
               if ('' + o.Value + '' == a) {
                   return o;
               }
           });
        $('#txtFromAddress').val(newFsite[0].ValueStr);
        $('#txtFromSuburb').val(newFsite[0].ValueStr1);
        $('#txtFromCode').val(newFsite[0].ValueStr2);
        $('#txtFromMobileNo').val(newFsite[0].ValueStr3);
        BindItemGrid(0);

    } else {
        $('#txtFromAddress').val('');
        $('#txtFromSuburb').val('');
        $('#txtFromCode').val('');
        $('#txtFromMobileNo').val('');
    }
});

$(document).off('change', '#ddlToSite').on('change', '#ddlToSite', function () {
    if ($(this).val() !== "-1") {

        if ($("#ddlFromSite").val() == "-1") {
            $.pnotify({ text: 'Plz Select From Site', type: 'error' });
            $("#ddlFromSite").focus();
            $(this).val('-1');
        }
        else {
            let a = $(this).val();
            var newTsite = $.grep(FSite,
               function (o) {
                   if ('' + o.Value + '' == a) {
                       return o;
                   }
               });
            $('#txtToAddress').val(newTsite[0].ValueStr);
            $('#txtToSuburb').val(newTsite[0].ValueStr1);
            $('#txtToCode').val(newTsite[0].ValueStr2);
            $('#txtToMobileNo').val(newTsite[0].ValueStr3);

            loadToSiteLocation($(this).val());
        };
    } else {
        $('#txtToAddress').val('');
        $('#txtToSuburb').val('');
        $('#txtToCode').val('');
        $('#txtToMobileNo').val('');
    }

});

function LoadToSite(siteId) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/LoadToSite",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ "FromSiteId": siteId }),
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
                TSite = [];
                LoadDropdown(result.listComboData, $('#ddlToSite'));
                TSite = result.listComboData;
                LoadDropdown(result.listComboData, $('#ddlReqPoint'));
                $('#txtToAddress').val('');
                $('#txtToSuburb').val('');
                $('#txtToCode').val('');
                $('#txtToMobileNo').val('');

                if (tsiteId != '') {
                    $('#ddlToSite').val(tsiteId).trigger('change');
                }
                if (reqsiteId != '') {
                    $('#ddlReqPoint').val(reqsiteId).trigger('change');
                }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadToSiteLocation(siteId) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/loadToSiteLocation",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ "SiteId": siteId }),
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
                LoadDropdown(result.listComboData, $('#ddlTransactionType'));
                if (locId != '') {
                    $('#ddlTransactionType').val(locId).trigger('change');
                }
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
    // $(id).select2();

}

function addRow(addIndex) {

    var content = '';
    content += '<tr>' +
               '<td><span class="btn btn-medium btnAdd"><i class="icon-plus-sign"></i></span>' +
               '<span class="btn btn-medium btnRemove"><i class="icon-minus-sign"></i></span>' +
               '</td>' +
               '<td><input type="text" id="ddlHead' + addIndex + '" class="span12 ddlHead"/><input type="hidden" id="hdddlHead"/></td>' + //' + loadItem(addIndex) + '
               '<td><input type="text" id="txtHeadDesc' + addIndex + '" class="span12 txtHeadDesc"/><input type="hidden" id="hfDetId' + addIndex + '" value="0"/></td>' +
               '<td><input type="text" id="txtInhandQty' + addIndex + '"  Value="" readonly class="span12 txtInhandQty"/></td>' +
               '<td><input type="text" id="txtQty' + addIndex + '"  Value="" class="span12 txtQty numeric"/> </td>' +
                '<td><input type="text" id="txtNoofBox' + addIndex + '"  Value="" readonly class="span12 txtNoofBox numeric"/> <input type="hidden" id="hfbox" class="hfbox"/></td>' +
                '<td><input type="text" id="txtDeliveryCost' + addIndex + '"  Value="" style="width: 80px;" class="span12 txtDeliveryCost numeric" /></td>' +
        '</tr>';
    return content;


}

$(document).off('change', '.txtQty').on('change', '.txtQty', function () {
    if ($(this).val() !== '' || $(this).val() !== '0') {
        var box = $(this).closest("tr")[0].cells[5].childNodes[2].value;
        var stockqty = $(this).closest("tr")[0].cells[3].childNodes[0].value
        var boxId = $(this).closest("tr")[0].cells[5].childNodes[0].id;
        var vale = $(this)[0].id;
        let b = parseInt($(this).val());
        let a = parseInt(stockqty);
        let abox = parseInt(box);
        if (a < b) {
            $.pnotify({ text: 'Pls Check Inhand Qty !', type: 'info' });
            $(this).val('');
        }
        else {
            let tbox = abox * b;
            $("#" + boxId).val(tbox);
        }
    }
});

function loadMultipleColumnHeadId(tblRow) {

    var coloumLLst = [];
    var colors = [];
    var value = $($($(tblRow).children('td:eq(1)').children())[0]).val();
    var urlpath = base + CurrentController + "/GetItemHeadAutoComplete";
    var myRes = [];
    var aObj = {
        "SearchText": value,
        "FromSiteId": $("#ddlFromSite").val()
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
                return false;
            } else {
                 
                myRes = result.ListAutoCpomplete;
                column = [{ name: 'Code', minWidth: '100px' }, { name: 'Qty', minWidth: '60px' }];
                colors = [];
                $.each(result.ListAutoCpomplete, function (i, obj) {
                    var color = [];
                    color.push(obj.value, obj.label);
                    colors.push(color);
                });

                $($($(tblRow).children('td:eq(1)').children())[0]).mcautocomplete({
                    showHeader: true,
                    columns: column,
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
                        var itmName = $($(tblRow).children('td:eq(2)').find('input')).attr('id');
                        var inQty = $($(tblRow).children('td:eq(3)').find('input')).attr('id');
                        //  var box = $($(tblRow).children('td:eq(3)').find('input[type="hidden"]')).attr('id');
                        $($($(tblRow).children('td:eq(5)')).find('input[type="hidden"]')).val(imlst[0].value1);
                        var addNewIndex = 0;
                        $('#' + itmName).val(imlst[0].Data);
                        $('#' + itmName).attr('title', imlst[0].Data);
                        $('#' + inQty).val(imlst[0].label);


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
            $.pnotify({ text: "Network Error !", type: 'error' });
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
    var DetsId = $(this).closest('tr')[0].cells[2].childNodes[1].value;
    if ($("#tbl")[0].rows.length > 1) {
        if (DetsId == "0") {
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
                    var urlpath = base + CurrentController + "/DetailIdDelete";
                    $.ajax({
                        beforeSend: function () { $.blockUI(); },
                        complete: function () { $.unblockUI(); },
                        type: "POST",
                        url: urlpath,
                        contentType: "application/json;charset=utf-8",
                        dataType: "JSON",
                        data: JSON.stringify({ "STransferDetsId": DetsId }),
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
        loadInisialColumnHeadId(('#ddlHead' + addNewIndex));
        $(".date").datepicker({ dateFormat: 'dd-M-yy' });

    }

});

function getdecimalvalue(val) {
    return parseFloat((Math.floor(100 * val) / 100).toFixed(2));
}

$('body').on("keyup", '.ddlHead', function (e) {

    var tblRow = $(this).closest('tr');
    if ($("#ddlFromSite").val() != "-1") {
        loadMultipleColumnHeadId(tblRow);
    } else {
        $.pnotify({ text: 'Plz Select From Site', type: 'error' });
        $("#ddlFromSite").focus();
        $(".ddlHead").val('');
    }
});

function validationADD() {
    var isresult = true;
    $("#tbl tr:gt(0)").each(function () {

        var headId = $(this).children('td:eq(1)').find('input[type="hidden"]').val();//ddlHead
        var qty = $(this).children('td:eq(4)').find("input").val();
        var box = $(this).children('td:eq(5)').find("input").val();

        if (headId == undefined || headId == "") {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(1)').find(".ddlHead").css({ 'border': '1px solid #aaa' });
        }

        if (qty == undefined || qty == "" || qty == "0") {
            $(this).children('td:eq(4)').find(".span12").css({ 'border': '1px solid red' });
            return isresult = false;
        }
        else {
            $(this).children('td:eq(4)').find(".span12").css({ 'border': '1px solid #aaa' });
        }

        //if (box == undefined || box == "" || box == "0") {
        //    $(this).children('td:eq(5)').find(".span12").css({ 'border': '1px solid red' });
        //    return isresult = false;
        //}
        //else {
        //    $(this).children('td:eq(5)').find(".span12").css({ 'border': '1px solid #aaa' });
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
    var ToSite = $("#ddlToSite").val();
    var OrderNo = $("#txtOrderNo").val();
    var bookingType = $("#ddlTransactionType").val();
    var ShipVia = $("#ddlDespatchVia").val();
    var reqPoint = $("#ddlReqPoint").val();
    var Person = $("#ddlPerson").val();
    var requiredDate = $("#txtRequiredDate").val();
    // var delDate = $("#txtDelDate").val();

    if (ToSite == "undefined" || ToSite == "-1") {
        $("#ddlToSite").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#ddlToSite").css({ 'border': '1px solid #aaa' });
    }

    if (txtBookingDate == "undefined" || txtBookingDate == "") {
        $("#txtBookingDate").css({ 'border': '1px solid red' });
        $("#txtBookingDate").focus();
        isresult = false;
    }
    else {
        $("#txtBookingDate").css({ 'border': '1px solid #aaa' });
    }

    //if (OrderNo == "undefined" || OrderNo == "") {
    //    $("#txtOrderNo").css({ 'border': '1px solid red' });
    //    $("#txtOrderNo").focus();
    //        isresult = false;
    //    }
    //    else {
    //    $("#txtOrderNo").css({ 'border': '1px solid #aaa' });
    //}

    if (bookingType == "undefined" || bookingType == "-1") {
        $("#ddlTransactionType").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#ddlTransactionType").css({ 'border': '1px solid #aaa' });
    }

    if (Person == "undefined" || Person == "-1") {
        $("#ddlPerson").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#ddlPerson").css({ 'border': '1px solid #aaa' });
    }

    if (reqPoint == "undefined" || reqPoint == "-1") {
        $("#ddlReqPoint").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#ddlReqPoint").css({ 'border': '1px solid #aaa' });
    }

    if (ShipVia == "undefined" || ShipVia == "-1") {
        $("#ddlDespatchVia").css({ 'border': '1px solid red' });
        return isresult = false;
    }
    else {
        $("#ddlDespatchVia").css({ 'border': '1px solid #aaa' });
    }

    if (requiredDate == "undefined" || requiredDate == "") {
        $("#txtRequiredDate").css({ 'border': '1px solid red' });
        $("#txtRequiredDate").focus();
        isresult = false;
    }
    else {
        $("#txtRequiredDate").css({ 'border': '1px solid #aaa' });
    }

    //if (delDate == "undefined" || delDate == "") {
    //    $("#txtDelDate").css({ 'border': '1px solid red' });
    //    $("#txtDelDate").focus();
    //    isresult = false;
    //}
    //else {
    //    $("#txtDelDate").css({ 'border': '1px solid #aaa' });
    //}

    if (isresult)
        isresult = true;
    else {
        isresult = false;
    }
    return isresult;
}

function GetSaveObject(parameters) {

    var obj = {
        "StockTransferId": $("#hfId").val(),
        "InvoiceNo": $("#txtOrderNo").val(),
        "InvoiceDate": $("#txtBookingDate").val(),
        "SpecialInstruction": $("#txtInstruction").val(),
        "Notes": $("#txtNotes").val(),
        "DespatchViaId": $("#ddlDespatchVia").val(),
        "LocNo": $("#ddlTransactionType").val(),
        "ReqSiteId": $("#ddlReqPoint").val() == "-1" ? "0" : $("#ddlReqPoint").val(),
        "ReferenceNo": $("#txtReferenceNo").val(),
        "FromSiteId": $("#ddlFromSite").val(),
        "ToSiteId": $("#ddlToSite").val(),
        "RequiredDate": $("#txtRequiredDate").val(),
        // "DeliveryDate": $("#txtDelDate").val(),
        "PersonId": $("#ddlPerson").val()

    }
    return obj;
}

function getChildData() {
    let obj = [];
    $("#tbl tr:gt(0)").each(function () {
        let aobj = {
            "IHeadId": $(this).children('td:eq(1)').find('input[type="hidden"]').val(),
            "STransferDetsId": $(this).children('td:eq(2)').find('input[type="hidden"]').val(),
            "ItemCode": $(this).children('td:eq(1)').find("input").val(),
            "IHeadDescription": $(this).children('td:eq(2)').find("input").val(),
            "InhandStock": $(this).children('td:eq(3)').find("input").val(),
            "SaleQty": $(this).children('td:eq(4)').find("input").val(),
            "Box": $(this).children('td:eq(5)').find("input").val(),
            "DeliveryCost": $(this).children('td:eq(6)').find("input").val() == "" ? 0 : $(this).children('td:eq(6)').find("input").val()
        }
        obj.push(aobj);
    });
    return obj;
}

$("#btnSave").on('click', function () {

    if ($("#hfId").val() == "0" && $("#txtOrderNo").val() != "") {
        $.pnotify({ text: 'Please Click Refresh Button', type: 'info' });
        $('#btnRefresh').focus();
    }
    else {
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
            } else {
                saveUpdate();
                // DuplicateCheck();
            }

        }
    }

});

function DuplicateCheck() {
    var orderNo = $("#txtOrderNo").val();
    var urlpath = base + CurrentController + "/DuplicateCheck";
    $.ajax({
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "orderNo": orderNo }),
        success: function (data) {

            if (data.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            }

            if (data.Save_error === "True") {
                $.pnotify({ text: 'Order No Already Exits..!', type: 'error' });
                return false;
            }
            else { saveUpdate(); }
            return false;
        },
        error: function (a, b, c) {
            window.ShowCustomDialog(a, c, "Error in saving Data");
        }
    });

}

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
                    if ($("#btnSave").val() == "Update") {
                        $('#txtOrderNo').val('');
                    } else {
                        $("#maintrId").show();
                        $('#txtOrderNo').val(result.list[0].InvoiceNo);
                    }
                    let Invoice = result.list[0].InvoiceNo;
                    clearAllField();
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
    var url = base + "StockTransfer/StockTransfer";
    window.location.href = url;

});

$('#btnCancel').on('click', function () {
    window.history.back();
});

function clearAllField() {
    // LoadInvoice();

    $("#txtBookingDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    // $("#txtOrderNo").val('');
    $("#hfId").val("0");
    $("#ddlDespatchVia").val("-1").trigger('change');
    $("#txtInstruction").val("");
    $("#txtNotes").val("");
    $("#ddlFromSite").val("-1").trigger('change');
    $("#ddlToSite").val("-1").trigger('change');
    $("#txtReferenceNo").val("");
    $("#txtFromAddress").val('');
    $("#txtFromSuburb").val('');
    $("#txtFromCode").val('');
    $("#txtFromMobileNo").val('');
    $("#txtToAddress").val('');
    $("#txtToSuburb").val('');
    $("#txtToCode").val('');
    $("#txtToMobileNo").val('');

    $("#txtRequiredDate").val('');
    //$("#txtDelDate").val('');

    $("#ddlTransactionType").val("-1").trigger('change');
    $("#ddlReqPoint").val("-1").trigger('change');
    $('#btnSave').val('Save');
    $("#btnSave").prop("disabled", false);

    BindItemGrid(0);
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
        "FromSiteId": $("#ddlFromSite").val() == "-1" ? 0 : $("#ddlFromSite").val()
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
                return false;
            } else {
                myRes = result.ListAutoCpomplete;
                coloumLLst = [{ name: 'Code', minWidth: '100px' }, { name: 'Qty', minWidth: '60px' }];
                colors = [];
                $.each(result.ListAutoCpomplete, function (i, obj) {
                    var color = [];
                    color.push(obj.value, obj.label);
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
            $.pnotify({ text:"Network Error !", type: 'error' });
        }
    });
}

function loadDataInvoiceWise(inv) {
    var urlpath = base + CurrentController + "/GetTranferDataByInvNo";
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
                MasterData(result.masterList);
                BindItemGrid(result.list)

            }
        }
    });
}

function MasterData(data) {

    $("#hfId").val(data[0].StockTransferId);
    $("#txtBookingDate").val(data[0].InvoiceDate);
    $("#txtOrderNo").val(data[0].InvoiceNo);
    $("#txtReferenceNo").val(data[0].ReferenceNo);
    $("#ddlFromSite").val(data[0].FromSiteId).trigger('change');
    //  $("#ddlDespatchVia").val(data[0].DespatchViaId).trigger('change');
    $("#txtInstruction").val(data[0].SpecialInstruction);
    $("#txtNotes").val(data[0].Notes);
    $("#txtRequiredDate").val(data[0].RequiredDate);
    // $("#txtDelDate").val(data[0].DeliveryDate);
    // $("#ddlPerson").val(data[0].PersonId).trigger('change');
    tsiteId = data[0].ToSiteId;
    locId = data[0].LocNo; reqsiteId = data[0].ReqSiteId;
    personId = data[0].PersonId; desId = data[0].DespatchViaId;
    // document.getElementById('txtOrderNo').readOnly = true;
    LoadShippingMethod();
    LoadUserPerson();
    $('#btnSave').val('Update');
    if (data[0].DispatchStatus == "Dispatch" || data[0].CustomerName == "Dispatch") {
        $("#btnSave").prop("disabled", true); $("#btnRemove").prop("disabled", true);
        document.getElementById('btnRemove').style.display = '';
    }
    else {
        $("#btnSave").prop("disabled", false); $("#btnRemove").prop("disabled", false);
        document.getElementById('btnRemove').style.display = '';
    }

    document.getElementById('btnPrint').style.display = '';
}

$("#btnRemove").on('click', function () {
    $.msgbox("Are you sure that you want to Remove ?", {
        type: "confirm",
        buttons: [
            { type: "submit", value: "Yes" },
            { type: "submit", value: "No" }
        ]
    }, function (result) {
        if (result == "Yes") {
            var urlpath = base + CurrentController + "/DeletedById";
            $.ajax({
                beforeSend: function () { $.blockUI(); },
                complete: function () { $.unblockUI(); },
                type: "POST",
                url: urlpath,
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                data: JSON.stringify({ "STransferId": $("#hfId").val() }),
                success: function (result) {
                    if (result.IsSessionOut != null) {
                        $.pnotify({ text: result.IsSessionOut, type: 'info' });
                        return false;
                    } else if (result.Error != null && result.Error != "") {
                        $.pnotify({ text: result.Error, type: 'error' });
                        return false;
                    } else {
                        $.pnotify({ text: "Remove Completed.", type: 'info' });
                        setTimeout(function () {
                            var url = base + "StockTransferRegister/StockTransferRegister";
                            window.location.href = url;
                        }, 2000);
                    }
                }
            });
        }
        else if (result == "No") {
            $.pnotify({ text: "Cancel Operation", type: 'info' });
        }
    });

});

$('#btnPrint').on('click', function () {
    let invoiceNo = $("#txtOrderNo").val();
    var url = base + "StockTransfer/PrintInvoice?InvoiceNo=" + invoiceNo;
    window.open(url, '_blank');
});
