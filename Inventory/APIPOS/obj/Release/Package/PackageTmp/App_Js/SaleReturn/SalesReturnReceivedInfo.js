var Controller = "SalesReturnReceive", CommonController = "Common", totalRefundAmount = 0, Type='';
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadPaymentMethod();
    $('#ddlPaymentMethod').select2();
    $("#txtReceiveDate").datepicker({
        dateFormat: 'dd-M-yy'
    });
    $('#txtReceiveDate').datepicker('setDate', new Date());
    var url_string = window.location.href;
    var url = new URL(url_string);
    let Invoice = url.searchParams.get("Invoice");
    Type = url.searchParams.get("Type");
    if (Type == 'Sales') {
        GetSaleInvoiceData(Invoice.trim());
    } else { GetRetrunRecvInvoiceData(Invoice.trim()); }
    $('#divIdDeduction').hide();
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

                if (result.list != null) {
                    if (result.list.length > 0) {
                        $('#txtReceiveNo').val(result.list[0].SRReceiveNo);
                        $('#txtInvoice').val(result.list[0].InvoiceNo);
                        $('#hfSaleId').val(result.list[0].SaleId);
                        $('#hfCustomerId').val(result.list[0].CustomerId);
                        $('#txtCustomerName').val(result.list[0].CustomerName);
                        $('#hfTotalInvoiceAmount').val(result.list[0].TotalInvoiceAmount);
                        $('#txtTotalValue').val(result.list[0].TotalInvoiceAmount);
                        $('#txtInvoiceQty').val(result.list[0].TSaleQty);
                        $('#txtPaymentAmount').val(result.list[0].TotalPaymentAmount);
                        $('#ddlPaymentMethod').val(result.list[0].PaymentMethodId).trigger('change');

                            $('#txtReason').val('');
                            document.getElementById('btnPrint').style.display = 'none';
                            document.getElementById('btnBack1').style.display = 'none';
                            $('#txtNotes').val('');
                       
                        if (result.list[0].lstDetails.length > 0) {
                           
                            BindDataTable(result.list[0].lstDetails);
                        }
                    }

                }
            }
        }
    });
}

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
                        $('#txtReceiveNo').val(result.list[0].SRReceiveNo);
                        $('#txtInvoice').val(result.list[0].InvoiceNo);
                        $('#hfSaleId').val(result.list[0].SaleId);
                        $('#hfCustomerId').val(result.list[0].CustomerId);
                        $('#txtCustomerName').val(result.list[0].CustomerName);
                        $('#hfTotalInvoiceAmount').val(result.list[0].TotalInvoiceAmount);
                        $('#txtTotalValue').val(result.list[0].TotalInvoiceAmount);
                        $('#txtInvoiceQty').val(result.list[0].TSaleQty);
                        $('#txtPaymentAmount').val(result.list[0].TotalPaymentAmount);
                        $('#ddlPaymentMethod').val(result.list[0].PaymentMethodId).trigger('change');

                        $("#" + result.list[0].DeductionType + "").trigger("click");

                        if (Type == 'Sales') {
                            $('#txtReason').val('');
                            document.getElementById('btnPrint').style.display = 'none';
                            document.getElementById('btnBack1').style.display = 'none';
                            document.getElementById('btnBack').style.display = '';
                            document.getElementById('btnSave').style.display = '';
                        } else {
                            $('#txtReason').val(result.list[0].Reason);
                            document.getElementById('btnPrint').style.display = '';
                            document.getElementById('btnBack').style.display = 'none';
                            document.getElementById('btnBack1').style.display = '';
                            document.getElementById('btnSave').style.display = 'none';
                        }

                        if (Type == 'Sales') {
                            $('#txtNotes').val('');
                        } else {
                            $('#txtNotes').val(result.list[0].Notes);
                        }

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
        let recvQty = '',deduct ='';

        if (Type == 'Sales') {
            recvQty = '';
            deduct = '';
        } else { recvQty = element.ReceiveQty; deduct = element.LotNo; }
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
                                     '<td><input type="text" class="span12 DeductionAmount" value="' + deduct + ' " /></td>' +
                                     '<td class="SaleQuantity">' + element.SaleQuantity + '</td>' +
                                     '<td><input type="hidden" class="SaleDetailId" value="' + element.SaleDetailId + '"/>' +
                                     '<input type="text" class="span12 ReceiveQty"  value="' + recvQty + ' " /></td>' +

                     '</tr>';
            cnt = counts[element.IHeadId];
            ih = element.IHeadId;
        }
        else {
            content += '<tr>' +
                      '<td  style="vertical-align: middle;text-align: center;" rowspan="' + counts[element.IHeadId] + '"><input type="hidden" class="IHeadId" value="' + element.IHeadId + '" />' + element.IHeadCode + '</td>' +
                      '<td class="ItemCode"><input type="hidden" class="ItemId" value="' + element.ItemId + ' "/>' + element.ItemCode + '</td>' +
                      '<td><input type="text" class="span12 DeductionAmount" value="' + deduct + ' " /></td>' +
                      '<td class="SaleQuantity">' + element.SaleQuantity + '</td>' +
                       '<td ><input type="hidden" class="SaleDetailId" value="' + element.SaleDetailId + '"/>' +
                       '<input type="text" class="span12 ReceiveQty"  value="' + recvQty + ' " /></td>' +
       '</tr>';
            cnt = 1;
            ih = element.IHeadId;
        }

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

$(document).off('keyup', '.ReceiveQty').on('keyup', '.ReceiveQty', function () {
    var Value = $(this).val();
    if ($.isNumeric(Value)) {
        let tblRow = $(this).closest('tr');
        let indexNo = $(tblRow).index();
        let AmountAppliedValue = parseFloat($(this).val() == "" ? "0" : $(this).val());
        let AvailableQty = parseFloat($(tblRow).find('.SaleQuantity').text());
        let SaleDetailId = $(tblRow).find('.SaleDetailId').val();
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

//$('#btnCancel').on('click', function () {
//    window.history.back();
//});


$('#btnBack').on('click', function () {
    var baseUrl = base + "SalesReturnReceive/SalesReturnReceive";
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
                    $('#txtReason').val('');
                    $('#btnSave').off();
                    setTimeout(function () {
                        var baseUrl = base + 'SalesReturnReceive/SalesReturnReceive';
                        window.location.href = baseUrl;
                    }, 2000);
                }
            }
        });
    }
});
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    let radios = document.querySelectorAll('input[type="radio"]:checked');
    if ($('#txtReceiveNo').val() == '') {
        $.pnotify({ text: 'Please Refresh or Back Previous Page', type: 'error' });
        valid = false;
        return valid;
    }
    if ($('#txtReason').val() == '') {
        $.pnotify({ text: 'Input Reason.', type: 'error' });
        $('#txtReason').focus();
        valid = false;
        return valid;
    }
    let rcvQty = 0;
    if (radios[0].value != 'NoItemReturn') {
        $("#tblReceive tbody tr").each(function () {
            let location = $(this).find('.location option:selected').val();
            let deductionAmount = $(this).find('.DeductionAmount').val();
            let ReceiveQty = $(this).find('.ReceiveQty').val() == "" ? 0 : $(this).find('.ReceiveQty').val();
            rcvQty += ReceiveQty;
            if (deductionAmount == "" && ReceiveQty > 0) {
                $(this).find('.DeductionAmount').focus();
                $.pnotify({ text: 'Please Input DeductionAmount !', type: 'error' });
                valid = false;
                return valid;
            }
        });
        if (rcvQty == 0) {
            $.pnotify({ text: 'Receive Qty. Empty', type: 'error' });
            valid = false;
            return valid;
        }
    } else {
        if ($('#txtDedAmount').val() == '') {
            $.pnotify({ text: 'Input Deduction Amount.', type: 'error' });
            $('#txtDedAmount').focus();
            valid = false;
            return valid;
        }
    }
    return valid;
}
///// Create Object ////
function GetSaveObject() {

    let radios = document.querySelectorAll('input[type="radio"]:checked');
    let storeNote = $('#chkStoreCredit').is(":checked") == true ? "(Store Credit)" : "";
    let amount = $('#txtDedAmount').val() == "" ? 0 : parseFloat($('#txtDedAmount').val());
    let StoreCredit = $('#chkStoreCredit').is(":checked") == true ? parseFloat($('#txtPaymentAmount').val()) - amount : 0;

    let obj = [];
    let objDtl = [];
    obj = {
        "SRReceiveNo": $('#txtReceiveNo').val(),
        "SRReceiveDate": $('#txtReceiveDate').val(),
        "InvoiceNo": $('#txtInvoice').val(),
        "TSaleQty": $('#txtInvoiceQty').val(),
        "SaleId": $('#hfSaleId').val(),
        "CustomerId": $('#hfCustomerId').val(),
        "Reason": $('#txtReason').val() + storeNote,
        "Notes": $('#txtNotes').val() + storeNote,
        "PaymentMethodId": $('#ddlPaymentMethod').val(),
        "TotalDeductionAmount": totalRefundAmount,
        "TotalInvoiceAmount": $('#hfTotalInvoiceAmount').val(),
        "TotalPaymentAmount": $('#txtPaymentAmount').val(),
        "NoItemReturnAmt": $('#txtDedAmount').val(),
        "DeductionType": radios[0].value,
        "StoreCredit": StoreCredit,
        "lstDetails": null
    }
    if (radios[0].value != 'NoItemReturn') {
        $("#tblReceive tbody tr").each(function () {
            let ReceiveQty = parseFloat($(this).find('.ReceiveQty').val() == '' ? "0" : $(this).find('.ReceiveQty').val());
            if (ReceiveQty > 0) {
                let aobj = {
                    "SaleDetailId": $(this).find('.SaleDetailId').val(),
                    "ItemId": $(this).find('.ItemId').val(),
                    "IHeadId": $(this).find('.IHeadId').val(),
                    "DeductionAmount": $(this).find('.DeductionAmount').val(),
                    "SaleQuantity": $(this).find('.SaleQuantity').text(),
                    "ReceiveQty": $(this).find('.ReceiveQty').val()
                    //  "LocId": $(this).find('.location option:selected').val()
                }
                objDtl.push(aobj);
            }
        });
        obj.lstDetails = objDtl;
    }
    return obj;
}
///// End Object ////

$(document).on('change', '.DeductionAmount', function () {
  
    totalRefundAmount = 0;

    $('#tblReceive tbody tr').each(function () {

        var amount = $(this).find(".DeductionAmount").val() == "" ? 0 : parseFloat($(this).find(".DeductionAmount").val());
            if (amount > 0) {
                 totalRefundAmount += parseFloat(amount);
                }
        });
});


$(document).on('change', '#txtDedAmount', function () {

    let dedAmount = $("#txtDedAmount").val() == "" ? 0 : $("#txtDedAmount").val();
    let paidAmount = $("#txtPaymentAmount").val() == "" ? 0 : $("#txtPaymentAmount").val();

    if (parseFloat(paidAmount) < parseFloat(dedAmount)) {
        $.pnotify({ text: 'Over Deduction Amount.', type: 'error' });
        $('#txtDedAmount').val("");
    }
   
});


$('input[type="radio"]').on('click', function (e) {

    let rdid = $(this)[0].id;
    switch (rdid) {
        case 'r1':
            document.getElementById('r1').checked = true;
            document.getElementById('r2').checked = false;
            document.getElementById('r3').checked = false;
            document.getElementById('r4').checked = false;
            document.getElementById('r5').checked = false;
            $("#divtabledata").show();
            $('#divIdDeduction').hide();
            $.uniform.update(
                $('#chkStoreCredit').attr("checked", false)
            );

            break;
        case 'r2':
            document.getElementById('r1').checked = false;
            document.getElementById('r2').checked = true;
            document.getElementById('r3').checked = false;
            document.getElementById('r4').checked = false;
            document.getElementById('r5').checked = false;
            $("#divtabledata").show();
            $('#divIdDeduction').hide();
            $.uniform.update(
                $('#chkStoreCredit').attr("checked", false)
            );
            break;
        case 'r3':
            document.getElementById('r1').checked = false;
            document.getElementById('r2').checked = false;
            document.getElementById('r3').checked = true;
            document.getElementById('r4').checked = false;
            document.getElementById('r5').checked = false;
            $("#divtabledata").show();
            $('#divIdDeduction').hide();
            $.uniform.update(
                $('#chkStoreCredit').attr("checked", false)
            );
            break;
        case 'r4':
            document.getElementById('r1').checked = false;
            document.getElementById('r2').checked = false;
            document.getElementById('r3').checked = false;
            document.getElementById('r4').checked = true;
            document.getElementById('r5').checked = false;
            $("#divtabledata").show();
            $('#divIdDeduction').hide();
            $.uniform.update(
                $('#chkStoreCredit').attr("checked", false)
            );
            break;
        case 'r5':
            document.getElementById('r1').checked = false;
            document.getElementById('r2').checked = false;
            document.getElementById('r3').checked = false;
            document.getElementById('r4').checked = false;
            document.getElementById('r5').checked = true;
            $('#divIdDeduction').show();
            $("#divtabledata").hide();
            $.uniform.update(
                $('#chkStoreCredit').attr("checked", false)
            );
          
            break;
    }

});

$('#btnBack1').on('click', function () {
    var baseUrl = base + "ReturnRecvRegister/Index";
    window.location.href = baseUrl;
});

$('#btnPrint').on('click', function () {
    let invoiceNo = $("#txtReceiveNo").val();
    var url = base + "SalesReturnReceive/ReturnRecPrintInvoice?InvoiceNo=" + invoiceNo;
    window.open(url, '_blank');
});
