var Controller = "ReturnReceiveAmountAdjustment", CommonController = "Common", totalRefundAmount = 0, Type = '';
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadReturnInvoiceNo();
});


function loadReturnInvoiceNo() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        async: false,
        url: base + Controller + "/loadReturnInvoiceNo",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlInvoiceNo'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadDropdown(result, id) {
    if (result != null) {
        $(id).get(0).options.length = 0;
        var content = '<option  value="-1">-- Select --</option>';
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" data-id="' + obj.label + '" data-mr="' + obj.ValueStr + '"  >' + obj.DisplayName + '</option>';
        });
        $(id).append(content);
        $(id).select2();
    }
}

$(document).off('change', '#ddlInvoiceNo').on("change", "#ddlInvoiceNo", function (event) {
    var Value = $(this).val();
    debugger
    if (Value != "-1") {
        let srNo = $(this).find('option:selected').attr("data-id");
        let mrNo = $(this).find('option:selected').attr("data-mr");
        $("#txtRReceiveNo").val(srNo);
        $("#hfMRNo").val(mrNo);
        GetRetrunRecvInvoiceData(srNo);
    } else { $("#txtRReceiveNo").val(""); $("#hfMRNo").val(""); }
});

function GetRetrunRecvInvoiceData(Invoice) {
    //let InvoiceNo = Invoice;
    var urlpath = base + Controller + "/GetRetrunRecvInvoiceData";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "InvoiceNo": Invoice }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {

                if (result.list != null) {
                    if (result.list.length > 0) {
                        $('#hfSaleId').val(result.list[0].SaleId);
                        $('#hfTotalInvoiceAmount').val(result.list[0].TotalInvoiceAmount);
                        $('#txtTotalValue').val(result.list[0].TotalInvoiceAmount);
                        $('#txtInvoiceQty').val(result.list[0].TSaleQty);
                        $('#txtPaidAmount').val(result.list[0].TotalPaymentAmount);
                        // $('#txtNotes').val(result.list[0].Notes);
                        $('#txtNotes').val('');

                        if (result.list[0].lstDetails != null) {
                            BindDataTable(result.list[0].lstDetails);
                        }
                    }

                }
            }
        }
    });
}

function BindDataTable(result) {
    let content = '';
    $('#tblReceive tbody').empty();
    var basketItems = result, counts = {};
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
        let recvQty = '', deduct = '';
        debugger
        //if (Type == 'Sales') {
        //    recvQty = '';
        //    deduct = '';
        //} else { recvQty = element.ReceiveQty; deduct = element.LotNo; }

        if (counts[element.IHeadId] > 1) {
            content += '<tr>';
            if (element.IHeadId == ih) {
                ih = element.IHeadId;
            }
            else {
                content += '<td style="vertical-align: middle;text-align: center;" rowspan="' + counts[element.IHeadId] + '">' + element.IHeadCode + '</td>';
            }
            content += '<td class="ItemCode"><input type="hidden" class="IHeadId" value="' + element.IHeadId + '" />' +
                                     '<input type="hidden" class="ItemId" value="' + element.ItemId + ' "/>' + element.ItemCode + '</td>' +
                                     '<td class="DeductionAmount">' + element.DeductionAmount + '</td>' +
                                     '<td class="SaleQuantity">' + element.SaleQuantity + '</td>' +
                                     '<td><input type="hidden" class="SaleDetailId" value="' + element.SaleDetailId + '"/>' + element.ReceiveQty + '</td>' +

                     '</tr>';
            cnt = counts[element.IHeadId];
            ih = element.IHeadId;
        }
        else {
            content +='<tr>' +
                      '<td style="vertical-align: middle;text-align: center;" rowspan="' + counts[element.IHeadId] + '"><input type="hidden" class="IHeadId" value="' + element.IHeadId + '" />' + element.IHeadCode + '</td>' +
                      '<td class="ItemCode"><input type="hidden" class="ItemId" value="' + element.ItemId + ' "/>' + element.ItemCode + '</td>' +
                      '<td class="DeductionAmount">' + element.DeductionAmount + '</td>' +
                      '<td class="SaleQuantity">' + element.SaleQuantity + '</td>' +
                      '<td><input type="hidden" class="SaleDetailId" value="' + element.SaleDetailId + '"/>' + element.ReceiveQty + '</td>' +
                      '</tr>';
            cnt = 1;
            ih = element.IHeadId;
        }

    });
    $('#tblReceive tbody').append(content);

}

$(document).off('keyup', '#txtAdjustmentAmount').on('keyup', '#txtAdjustmentAmount', function () {
    var Value = $(this).val();
    if (Value !="" && Value !=0) {
        let AmountValue = parseFloat($(this).val() == "" ? "0" : $(this).val());
        let AvailableValue = parseFloat($("#txtTotalValue").val());
        if (AmountValue > AvailableValue) {
            $(this).val('');
            $.pnotify({ text: 'Available Amount: ' + AvailableValue, type: 'info' });
            return;
        }
    }
    
});

$('#btnCancel').on('click', function () {
    window.history.back();
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
                    //$('#txtReason').val('');
                    // $('#btnSave').off();
                    cleardata();
                   
                }
            }
        });
    }
});

function cleardata() {

    $('#ddlInvoiceNo').val('-1').trigger('change');
    $('#hfSaleId').val('');
    $('#hfTotalInvoiceAmount').val('');
    $('#txtTotalValue').val('');
    $('#txtInvoiceQty').val('');
    $('#txtPaidAmount').val('');
    $('#txtAdjustmentAmount').val('');
     $('#txtNotes').val('');
    $('#tblReceive tbody').empty();
}


///// Validation Start ////
function SaveValidation() {
    let valid = true;

    if ($('#ddlInvoiceNo').val() == '-1' || $('#ddlInvoiceNo').val() == "") {
        $.pnotify({ text: 'Select Invoice No', type: 'error' });
        valid = false;
        return valid;
    }
    if ($('#txtAdjustmentAmount').val() == '' || $('#txtAdjustmentAmount').val() == 0) {
        $.pnotify({ text: 'Input Adjustment Amount.', type: 'error' });
        $('#txtAdjustmentAmount').focus();
        valid = false;
        return valid;
    }

    if ($('#txtNotes').val() == '' || $('#txtNotes').val() == null) {
        $.pnotify({ text: 'Input Notes.', type: 'error' });
        $('#txtNotes').focus();
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
        "SRReceiveId": $('#ddlInvoiceNo').val(),
        "InvoiceNo": $("#ddlInvoiceNo option:selected").text(),
        "WhouseName": $('#hfMRNo').val(),
        "TotalInvoiceAmount": $('#hfTotalInvoiceAmount').val(),
        "TotalPaymentAmount": $('#txtPaidAmount').val(),
        "TotalDeductionAmount": $('#txtAdjustmentAmount').val(),
        "Notes": $('#txtNotes').val(),
        "lstDetails": null
    }
  
    return obj;
}
///// End Object ////
