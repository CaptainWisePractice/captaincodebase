var Controller = "PurchaseReceive";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    $("#txtReceiveDate").datepicker({
        dateFormat: 'dd-M-yy'
    });
    $('#txtReceiveDate').datepicker('setDate', new Date());
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    let RcvId = vars.Id;
    GetPurchaseOrderDataByPOMasterId(RcvId);
    $('#hdPOMasterId').val(RcvId);
});
function GetPurchaseOrderDataByPOMasterId(Id) {
    let obj = {
        "POMasterId": Id
    }
    var urlpath = base + Controller + "/GetPurchaseOrderDataByPOMasterId";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {               
                if (result.list != null) {
                    if (result.list.length >0) {
                        $('#txtReceiveNo').val(result.list[0].POReceiveNo);
                        $('#txtPONo').val(result.list[0].PONumber);
                        $('#txtPINo').val(result.list[0].PINumber);
                        $('#hdManufacturerId').val(result.list[0].ManufacturerId);
                        $('#txtManufacturerName').val(result.list[0].ManufacturerName);

                        $('#txtPOQty').val(result.list[0].POQuantity);
                        if (result.list[0].lstDetails.length > 0) {
                            var dropdown = '<option value="-1"> Select ----- </option>';
                            $.each(result.listComboData, function (i, obj) {
                                dropdown += '<option value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                            });
                            BindDataTable(result.list[0].lstDetails, dropdown);
                        }
                    }
                    
                }
            }
        }
    });
}
function BindDataTable(result, location) {
    let content = '';
    $('#tblReceive tbody').empty();   
    var basketItems = result,counts = {};
    jQuery.each(basketItems, function (key, value) {      
        if (!counts.hasOwnProperty(value.IHeadId)) {
            counts[value.IHeadId] = 1;
        } else {
            counts[value.IHeadId]++;
        }
    });
    let cnt = 1;
    let ih = '';
    $(result).each(function (index, element) {
        let AvailableQty = 0;
        AvailableQty = element.POQuantity - element.POReceiveQty;
        if (counts[element.IHeadId] > 1) {
            content += '<tr>';
            if (element.IHeadId == ih) {

                //content += '<td rowspan="' + counts[element.IHeadId] + '"><input type="hidden" class="PODetailId" value="' + element.PODetailId + '" data-IHeadId="' + element.IHeadId + '"/>' + element.IHeadCode + '</td>';
                ih = element.IHeadId;
            }
            else
            {
                content += '<td style="vertical-align: middle;text-align: center;" rowspan="' + counts[element.IHeadId] + '">'+element.IHeadCode + '</td>'+
                    '<td style="vertical-align: middle;text-align: center;" rowspan="' + counts[element.IHeadId] + '"><input type="text"  class="span12 numeric NewPrice" /></td>';
            }
            content += '<td class="ItemCode"><input type="hidden" class="IHeadId" value="' + element.IHeadId + '" />' +
                //'<td><input type="text"  class="span12 NewPrice" /></td>' +
                '<input type="hidden" class="ItemId" value="' + element.ItemId + ' "/>' + element.ItemCode + '</td>' +
                                    
                                    '<td > <select class="span12 select2 location">' + location + '</select></td>' +
                                    '<td class="POQuantity">' + element.POQuantity + '</td>' +
                                    '<td class="AvailableQty">' + AvailableQty + '</td>' +
                                     '<td ><input type="hidden" class="PODetailId" value="' + element.PODetailId + '"/>'+
                                     '<input type="text" class="span12 POReceiveQty" /></td>' +

                     '</tr>';
            cnt = counts[element.IHeadId];
            ih = element.IHeadId;
        }
        else {
            content += '<tr>' +
                      '<td  style="vertical-align: middle;text-align: center;" rowspan="' + counts[element.IHeadId] + '"><input type="hidden" class="IHeadId" value="' + element.IHeadId + '" />' + element.IHeadCode + '</td>' +
                      '<td  style="vertical-align: middle;text-align: center;" rowspan="' + counts[element.IHeadId] + '"><input type="text"  class="span12 numeric NewPrice" /></td>' +
                      '<td class="ItemCode"><input type="hidden" class="ItemId" value="' + element.ItemId + ' "/>' + element.ItemCode + '</td>' +
                      
                      '<td > <select class="span12 select2 location">' + location + '</select></td>' +
                      '<td class="POQuantity">' + element.POQuantity + '</td>' +
                      '<td class="AvailableQty">' + AvailableQty + '</td>' +
                       '<td ><input type="hidden" class="PODetailId" value="' + element.PODetailId + '"/>'+
                       '<input type="text" class="span12 POReceiveQty" /></td>' +

       '</tr>';
            cnt = 1;
            ih = element.IHeadId;
        }
        
    });
    $('#tblReceive tbody').append(content);
    $('.select2').select2();
}
$(document).off('keyup', '.numeric').on("keyup", ".numeric", function (event) {
    var Value = $(this).val();
    if ($.isNumeric(Value)) {
    }
    else {
        if (Value.length > 0) {
            $(this).val('');
            $.pnotify({ text: 'Only Numeric Value', type: 'info' });
        }
        return;
    }
});

$(document).off('keyup', '.POReceiveQty').on('keyup', '.POReceiveQty', function () {
    var Value = $(this).val();
    if ($.isNumeric(Value)) {
        let tblRow = $(this).closest('tr');
        let indexNo = $(tblRow).index();
        let AmountAppliedValue = parseFloat($(this).val() == "" ? "0" : $(this).val());
        let AvailableQty = parseFloat($(tblRow).find('.AvailableQty').text());
        let PODetailId = $(tblRow).find('.PODetailId').val();
        if (AmountAppliedValue > AvailableQty) {
            $(this).val('');
            $.pnotify({ text: 'Available Quantity ' + AvailableQty, type: 'info' });
            return;
        }
    }
    else {
        if (Value.length > 0) {
            $(this).val('');
            notify('danger', 'Only Numeric Value');
        }
        return;
    }
});
$('#btnRefresh').on('click', function () {
    window.location.reload();
});
$('#btnCancel').on('click', function () {
    window.history.back();
});
$('#btnBack').on('click', function () {
    var baseUrl = base + Controller + "/PurchaseReceive";
    window.location.href = baseUrl;
});
$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        var obj = GetSaveObject();
        var urlpath = base + Controller + "/Save";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "obj": obj }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $.pnotify({ text: 'Save Successfully', type: 'success' });
                    $('#txtReceiveNo').val('');
                    $('#btnSave').off();
                    setTimeout(function () {
                        var baseUrl = base + 'PurchaseReceive/PurchaseReceive';
                        window.location.href = baseUrl;
                    }, 2000);
                    //loadCustomer();
                    //ClearData();
                }
            }
        });
    }
});
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    if ($('#txtReceiveNo').val() == '') {
        $.pnotify({ text: 'Please Refresh or Back Previous Page', type: 'info' });
        valid = false;
        return valid;
    }

    if ($('#txtLotNo').val() == '') {
        $.pnotify({ text: 'Input Lot No. !', type: 'info' });
        $('#txtLotNo').focus();
        valid = false;
        return valid;
    }
    
    let rcvQty = 0;
    $("#tblReceive tbody tr").each(function () {
        let location = $(this).find('.location option:selected').val();
        let POReceiveQty = $(this).find('.POReceiveQty').val() == "" ? 0 : $(this).find('.POReceiveQty').val();
        let unitPrice = $(this).find('.NewPrice').val() == "" ? 0 : $(this).find('.NewPrice').val();
        rcvQty += POReceiveQty;
        if (location == "-1" && POReceiveQty > 0) {
            $(this).find('.location').focus();
            $.pnotify({ text: 'Please Select Location', type: 'info' });
            valid = false;
            return valid;
        }
        if (unitPrice == 0) {
            $.pnotify({ text: 'Input New Price', type: 'info' });
            valid = false;
            return valid;
        }
    });
    if (rcvQty == 0) {
        $.pnotify({ text: 'Receive Qty. Empty', type: 'info' });
        valid = false;
        return valid;
    }
    return valid;
}
///// Create Object ////
function GetSaveObject() {
    let obj = [];
    let objDtl = [];
    obj = {
        "POReceiveNo": $('#txtReceiveNo').val(),
        "POReceiveDate": $('#txtReceiveDate').val(),
        "POQuantity": $('#txtPOQty').val(),
        "POMasterId": $('#hdPOMasterId').val(),
        "ManufacturerId": $('#hdManufacturerId').val(),
        "lstDetails": null
    }
    $("#tblReceive tbody tr").each(function () {
        let ReceiveQty = parseFloat($(this).find('.POReceiveQty').val() == '' ? "0" : $(this).find('.POReceiveQty').val());
        if (ReceiveQty > 0) {
            let aobj = {                
                "PODetailId": $(this).find('.PODetailId').val(),
                "ItemId": $(this).find('.ItemId').val(),
                "IHeadId": $(this).find('.IHeadId').val(),
                "POQuantity": $(this).find('.POQuantity').text(),
                "POReceiveQty": $(this).find('.POReceiveQty').val(),
                "NewPrice": parseFloat($(this).find('.NewPrice').val() == '' ? "0" : $(this).find('.NewPrice').val()),//$(this).find('.NewPrice').val(),
                "LotNo": $('#txtLotNo').val(),
                "LocId": $(this).find('.location option:selected').val()
            }
            objDtl.push(aobj);
        }
    });
    obj.lstDetails = objDtl;
    return obj;
}
///// End Object ////
