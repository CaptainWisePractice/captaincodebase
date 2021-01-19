var Controller = "InvoiceCancellation", CommonController = "Common", totalRefundAmount = 0;
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadPaymentMethod();
    $('#ddlPaymentMethod').select2();
    $('#divIdHide').hide();
    $("#txtCancelDate").datepicker({
        dateFormat: 'dd-M-yy'
    });
    debugger;
    $('#txtCancelDate').datepicker('setDate', new Date());
    var url_string = window.location.href;
    var url = new URL(url_string);
    let Invoice = url.searchParams.get("Invoice");
    GetSaleInvoiceData(Invoice.trim());
    // $('#hfSaleId').val(RcvId);
});
function GetSaleInvoiceData(Invoice) {
    //let InvoiceNo = Invoice;
    var urlpath = base + Controller + "/GetSaleInvoiceData";
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
                debugger;
                if (result.list != null) {
                    if (result.list.length > 0) {
                        $('#txtInvoice').val(result.list[0].InvoiceNo);
                        $('#hfSaleId').val(result.list[0].SaleId);
                        $('#hfCustomerId').val(result.list[0].CustomerId);
                        $('#txtCustomerName').val(result.list[0].CustomerName);
                        $('#hfTotalInvoiceAmount').val(result.list[0].InvoiceAmount);
                        $('#txtTotalValue').val(result.list[0].InvoiceAmount);
                        $('#txtPaymentAmount').val(result.list[0].RefundAmount);
                        $('#txtInvoiceQty').val(result.list[0].TSaleQty);
                        $('#ddlPaymentMethod').val(result.list[0].PaymentMethodId).trigger('change');
                        if (result.list[0].lstDetails.length > 0) {
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
    $(result).each(function (index, element) {
        content += '<tr>' +
              '<td >' + (index + 1) + '</td>' +
              '<td >' + element.IHeadCode + ' <input type="hidden" id="IHeadId' + index + '" Value="' + element.IHeadId + '" class="span12 IHeadId"/></td>' +
              '<td >' + element.IHeadName + '</td>' +
              '<td >' + element.SaleQuantity + '<input type="hidden" class="SaleDetailId" value="' + element.SaleDetailId + '"/></td>' +
              '<td >' + element.NewPrice + '</td>' +
      '</tr>';
    });
    $('#tblReceive tbody').append(content);

}

function loadPaymentMethod() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        async: false,
        url: base + CommonController + "/loadPaymentMethod",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result, $('#ddlPaymentMethod'));
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
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
        $(id).append(content);
    }
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

$('#btnBack').on('click', function () {
    var baseUrl = base + "InvoiceCancellation/InvoiceCancellation";
    window.location.href = baseUrl;
});
$('#btnSave').on('click', function () {
    if (SaveValidation() == true) {
        $.msgbox("Are you sure that you want to Sale Cencel ?", {
            type: "confirm",
            buttons: [
                { type: "submit", value: "Yes" },
                { type: "submit", value: "No" }
            ]
        }, function (result) {
            if (result == "Yes") {
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
                            $('#btnSave').off();
                            setTimeout(function () {
                                var baseUrl = base + "InvoiceCancellation/InvoiceCancellation";
                                window.location.href = baseUrl;
                            }, 2000);
                        }
                    }
                });
               
            }
            else if (result == "No") {
                $.pnotify({ text: "Cancel Operation", type: 'info' });
            }
        }
       );
    }
});

function SaveValidation() {
    
    let valid = true;
    let radios = document.querySelectorAll('input[type="radio"]:checked');
    if ($('#txtReason').val() == '') {
        $.pnotify({ text: 'Input Reason.', type: 'error' });
        $('#txtReason').focus();
        valid = false;
        return valid;
    }

    if ($('#txtCancelDate').val() == '') {
        $.pnotify({ text: 'Input Date.', type: 'error' });
        $('#txtCancelDate').focus();
        valid = false;
        return valid;
    }
   
    if (radios[0].id != "r1") {
        if ($('#txtPercentage').val() == '' && $('#txtCancelAmount').val() == '') {
            $.pnotify({ text: 'Pls Input Percentage or Amount', type: 'error' });
            valid = false;
            return valid;
        }
    }
   
    return valid;
}

function GetSaveObject() {
    debugger;
    let obj = [], Payamount = 0;
    let radios = document.querySelectorAll('input[type="radio"]:checked');
    if (radios[0].value == 'FullRefund') {
        Payamount = parseFloat($('#txtPaymentAmount').val());
    } else {
        if ($('#txtPercentage').val() != '') {
            let tval = $('#txtPaymentAmount').val();
            let per = $('#txtPercentage').val();
            let total = (parseFloat(tval) * parseFloat(per)) / 100;
            Payamount = (parseFloat(tval) - parseFloat(total))
            $('#txtCancelAmount').val(total.toFixed(2));
        }
        else {
            Payamount = (parseFloat($('#txtPaymentAmount').val()) - parseFloat($('#txtCancelAmount').val()))
        }
    }

    obj = {
        "CancelDate": $('#txtCancelDate').val(),
        "InvoiceNo": $('#txtInvoice').val(),
        "TSaleQty": $('#txtInvoiceQty').val(),
        "SaleId": $('#hfSaleId').val(),
        "CustomerId": $('#hfCustomerId').val(),
        "Reason": $('#txtReason').val(),
        "Notes": $('#txtNotes').val(),
        "CancelType": radios[0].value,
        "PaymentMethodId": $('#ddlPaymentMethod').val(),
        "InvoiceAmount": $('#txtPaymentAmount').val(),//$('#hfTotalInvoiceAmount').val(),
        "Percentage": $('#txtPercentage').val() == '' ? 0 : $('#txtPercentage').val(),
        "RefundAmount": Payamount.toFixed(2)
    }
   
    return obj;
}


$('input[type="radio"]').on('click', function (e) {
   let rdid =  $(this)[0].id;
   switch (rdid) {
       case 'r1':
           document.getElementById('r1').checked = true;
           document.getElementById('r2').checked = false;
           document.getElementById('r3').checked = false;
           document.getElementById('r4').checked = false;
           $('#divIdHide').hide();
            break;
       case 'r2':
           document.getElementById('r1').checked = false;
           document.getElementById('r2').checked = true;
           document.getElementById('r3').checked = false;
           document.getElementById('r4').checked = false;
           $('#divIdHide').show();
           break;
       case 'r3':
           document.getElementById('r1').checked = false;
           document.getElementById('r2').checked = false;
           document.getElementById('r3').checked = true;
           document.getElementById('r4').checked = false;
           $('#divIdHide').show();
           break;
       case 'r4':
           document.getElementById('r1').checked = false;
           document.getElementById('r2').checked = false;
           document.getElementById('r3').checked = false;
           document.getElementById('r4').checked = true;
           $('#divIdHide').show();
           break;
    }

});

$(document).off('keyup', '#txtPercentage').on("keyup", "#txtPercentage", function (event) {
    var Value = $(this).val();
    if (Value != '') {
        $("#txtCancelAmount").attr("readonly", true);
        $("#txtPercentage").attr("readonly", false);
    } else {
        $("#txtPercentage").attr("readonly", false);
        $("#txtCancelAmount").attr("readonly", false);
       
    }
   
});

$(document).off('keyup', '#txtCancelAmount').on("keyup", "#txtCancelAmount", function (event) {
    var Value = $(this).val();
    if (Value != '') {
        $("#txtPercentage").attr("readonly", true);
        $("#txtCancelAmount").attr("readonly", false);
    } else {
        $("#txtPercentage").attr("readonly", false);
        $("#txtCancelAmount").attr("readonly", false);
       
    }
});

