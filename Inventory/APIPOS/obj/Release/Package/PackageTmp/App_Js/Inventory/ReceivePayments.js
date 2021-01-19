var Controller = "ReceivePayments", custId='';//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
   // $('.select2').select2();
    $("#txtDate").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    loadCustomer();
    loadPaymentMethod();
    var url_string = window.location.href;
    var url = new URL(url_string);
    let customerId = url.searchParams.get("customerId");
    if (customerId != null) {
        custId = customerId.trim();
        $("#ddlCustomer").val(custId);
        $("#ddlCustomer").trigger('change');
        LoadPaymentData(custId);
    }

});
function loadCustomer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        async: false,
        url: base + Controller + "/loadCustomer",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result.listComboData, $('#ddlCustomer'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
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
//$(document).on('change', '#ddlCustomer', function ()
$('#ddlCustomer').on('change', function (){
    
    ClearData();
    let Value = $(this).val();
    if (Value != '-1') {
        LoadPaymentData(Value);
    }
});

function LoadPaymentData(Value) {

    $('#txtMemo').val('Payment; ' + $(this).find('option:selected').text());
    var urlpath = base + Controller + "/GetDataByCustomerId";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        async: false,
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "CustomerId": Value }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                if (result.list[0] != undefined) {
                    if (result.list[0].AdvanceAmount > 0) {
                        $('#txtAdvanceBalance').val(result.list[0].AdvanceAmount);
                    }
                    $('#ddlPaymentMethod').val(result.list[0].PaymentMethodId).trigger('change');

                    if (result.list[0].lstDetails.length > 0) {
                        TableRowBind(result.list[0].lstDetails);
                    }
                }

                //loadtableDropdown();
            }
        }
    });
}
$('#txtAmountReceived').on('change', function () {    
    let value =parseFloat($(this).val() == "" ? 0 : $(this).val());
    let advAmt = parseFloat($('#txtAdvanceBalance').val());
    if ($('#chkAdvance').is(':checked')) {
        //if (advAmt >= value) {
        //    $(this).val(value);
        //}
        //else {
        //    $(this).val(value);
        //}
        
    }
    else {

    }
    $('#txtTotalReceived').val(value);
    $('#txtTotalReceived').trigger('change');
});

$('#txtFinanceCharge').on('change', function () {
    AmountCalculation();
});
$('#chkReceiveAll').on('change', function () {
    let AmountAppliedValue = 0;
    if ($(this).is(':checked')) {
        $("#tbl tbody tr").each(function () {
            let dueAmount = $(this).find('.TotalDue').text();
            $(this).find('.AmountApplied').val(dueAmount);
            AmountAppliedValue += parseFloat($(this).find('.AmountApplied').val() == "" ? "0" : $(this).find('.AmountApplied').val());
        });
    }
    else {
        $("#tbl tbody tr").each(function () {
            let dueAmount = $(this).find('.TotalDue').text();
            $(this).find('.AmountApplied').val('');
            AmountAppliedValue += parseFloat($(this).find('.AmountApplied').val() == "" ? "0" : $(this).find('.AmountApplied').val());
        });
    }
    
    $('#txtTotalApplied').val(AmountAppliedValue.toFixed(2));
    $('#txtAmountReceived').val(AmountAppliedValue).trigger('change');
    $('#txtTotalApplied').trigger('change');
});
$('#chkAdvance').on('change', function () {
    let AmountAppliedValue = 0;
    let advAmt = parseFloat($('#txtAdvanceBalance').val() == "" ? 0 : $('#txtAdvanceBalance').val());
    if (advAmt>0) {
        let rcvAmt = parseFloat($('#txtAmountReceived').val() == "" ? 0 : $('#txtAmountReceived').val());
        if ($(this).is(':checked')) {
            let balance = advAmt + rcvAmt;
            $('#txtAmountReceived').val(advAmt).trigger('change');
        }
        else {
            let balance = rcvAmt - advAmt;
            if (parseFloat(balance) > 0) {
                $('#txtAmountReceived').val(balance).trigger('change');
            }
            else {
                $('#txtAmountReceived').val('').trigger('change');
            }
        }
    }
    else {
        $('#chkAdvance').parent().removeClass('uniform-checked');
    }
});
//// Dropdown load
function LoadDropdown(result, id) {
    if (result != null) {
        $(id).get(0).options.length = 0;
        var content = '<option  value="-1">-- Select --</option>';
        $.each(result, function (i, obj) {
            content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
        });
        $(id).append(content);
        $(id).select2();
    } 
}

function TableRowBind(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, element) {
            let amount = (element.TotalDue - element.Discount).toFixed(2);

            content += '<tr>' +
                '<td class="InvoiceNo">' + element.InvoiceNo + '</td>' +
                                            '<td class="InvoiceDate">' + element.InvoiceDate + '</td>' +
                                            '<td class="InvoiceAmount">' + element.InvoiceAmount + '</td>' +
                                            '<td class="Due">' + element.TotalDue + '</td>' +
                                            '<td><input type="text" class="span12 Discount numeric" value="' + parseFloat(element.Discount).toFixed(2) + '"/></td>' +
                                            '<td class="TotalDue">' + amount + '</td>' +
                                            '<td><input type="text" class="span12 AmountApplied numeric" /></td>' +
        '</tr>';
        });

    }
    $('#tbl tbody').append(content);
}
$(document).off('change', '.Discount').on('change', '.Discount', function () {
    
    let tblRow = $(this).closest('tr');
    let DiscountValue = parseFloat($(this).val() == "" ? "0" : $(this).val());
    let Due = parseFloat($(tblRow).find('.Due').text());
    let totDue = Due - DiscountValue;
    $(tblRow).find('.TotalDue').text(totDue.toFixed(2));
});
//var keyupTimeoutID = 0;
$(document).off('change', '.AmountApplied').on('change', '.AmountApplied', function () {
   
    let tblRow = $(this).closest('tr');
    let indexNo = $(tblRow).index();
    let AmountAppliedValue = parseFloat($(this).val() == "" ? 0 : $(this).val());
    let totalDue = $(tblRow).find('.TotalDue').text();
    if (AmountAppliedValue > totalDue) {
        $(this).val('');
        return;
    }
    $("#tbl tbody tr").each(function () {
        let rowIndex = $(this).index();
        if (rowIndex != indexNo) {
            AmountAppliedValue += parseFloat($(this).find('.AmountApplied').val() == "" ? 0 : $(this).find('.AmountApplied').val());
        }
    });
    $('#txtTotalApplied').val(AmountAppliedValue.toFixed(2)).trigger('change');
    //clearTimeout(keyupTimeoutID);
    //keyupTimeoutID = setTimeout(function () {
    //    $('#txtTotalApplied').trigger('change');
    //}, 1000);
    
});
function AmountCalculation() {
    let financeCharge = parseFloat($('#txtFinanceCharge').val() == "" ? 0 : $('#txtFinanceCharge').val())
    let totalApplied = parseFloat($('#txtTotalApplied').val() == "" ? 0 : $('#txtTotalApplied').val());
    let totalRcv = parseFloat($('#txtTotalReceived').val() == "" ? 0 : $('#txtTotalReceived').val());
    let result = totalRcv - (totalApplied + financeCharge);
    $('#txtOutofBalance').val(result.toFixed(2));
}
$(document).off('change', '#txtTotalReceived').on("change", "#txtTotalReceived", function (event) {
    AmountCalculation();    
});
$(document).off('change', '#txtTotalApplied').on("change", "#txtTotalApplied", function (event) {
    AmountCalculation();
});

$(document).off('keyup', '.numeric').on("keyup", ".numeric", function (event) {
    var Value = $(this).val();
    if ($.isNumeric(Value)) {
    }
    else {
        if (Value.length > 0) {
            $(this).val('');
            $.pnotify({ text: 'Only Numeric Value ', type: 'error' });
        }
        return;
    }
});
$('#btnRefresh').on('click', function () {
    $('#ddlCustomer').val('-1').trigger('change');
    ClearData();
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
                    loadCustomer();
                    ClearData();
                }
            }
        });
    }
});
///// Validation Start ////
function SaveValidation() {
    let valid = true;
    if ($('#ddlCustomer').val() == '-1') {
        $.pnotify({ text: 'Customer Requried', type: 'error' });
        valid = false;
        return valid;
    }

    if ($('#txtDate').val() == '') {
        $.pnotify({ text: 'Date Requried', type: 'error' });
        $('#txtDate').focus();
        valid = false;
        return valid;
    }

    if ($('#ddlPaymentMethod').val() == '-1') {
        $('#s2id_ddlPaymentMethod').find(".select2-choice").css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Payment Method Requried', type: 'error' });
        valid = false;
        return valid;
    } else { $('#s2id_ddlPaymentMethod').find(".select2-choice").css({ 'border': '1px solid #aaa' }); }
    if ($('#txtAmountReceived').val() == '' || $('#txtAmountReceived').val() == '0') {
        $('#txtAmountReceived').css({ 'border': '1px solid red' });
        $.pnotify({ text: 'Amount Received Requried', type: 'error' });
        $('#txtAmountReceived').focus();
        valid = false;
        return valid;
    } else { $('#txtAmountReceived').css({ 'border': '1px solid #aaa' }); }
    let qty = 0;
    $("#tbl tbody tr").each(function () {
        qty += parseFloat($(this).find('.AmountApplied').val() == '' ? "0" : $(this).find('.AmountApplied').val());
    });

    if (qty == 0) {
        $.pnotify({ text: 'Your Invoice Amount Applied Required', type: 'error' });
        valid = false;
        return valid;
    }
    if (parseFloat($('#txtAmountReceived').val()) < parseFloat($('#txtTotalApplied').val())) {
        $.pnotify({ text: 'Your total Applied is greater than Receive amount', type: 'error' });
        valid = false;
        return valid;
    }
    return valid;
}
///// Create Object ////
function GetSaveObject() {
    let obj = [];
    let objDtl = [];
    let rcvAmt = parseFloat($('#txtAmountReceived').val() == "" ? 0 : $('#txtAmountReceived').val());
    let advAmt = parseFloat($('#txtAdvanceBalance').val() == "" ? 0 : $('#txtAdvanceBalance').val());
    if ($('#chkAdvance').is(':checked')) {
        rcvAmt = rcvAmt - advAmt;
    }
    obj = {
        "AmountReceive": rcvAmt,
        "CustomerId": $('#ddlCustomer').val(),
        "PaymentMethodId": $('#ddlPaymentMethod').val(),
        "PaymentMemo": $('#txtMemo').val(),
        "PaymentDate": $('#txtDate').val(),
        "TotalApplied": $('#txtTotalApplied').val(),
        "FinanceCharge": $('#txtFinanceCharge').val(),
        "ChkAdvance":$('#chkAdvance').is(':checked'),
        "lstDetails": null
    }
    $("#tbl tbody tr").each(function () {
        let AmountApplied = parseFloat($(this).find('.AmountApplied').val() == '' ? "0" : $(this).find('.AmountApplied').val());
        if (AmountApplied > 0) {
            let aobj = {
                "InvoiceNo": $(this).find('.InvoiceNo').text(),
                "InvoiceDate": $("#txtDate").val() == "" ? $(this).find('.InvoiceDate').text() : $("#txtDate").val(),
                "InvoiceAmount": $(this).find('.InvoiceAmount').text(),
                "Discount": $(this).find('.Discount').val(),
                "TotalDue": $(this).find('.TotalDue').text(),
                "AmountApplied": $(this).find('.AmountApplied').val(),
                "PaymentMethodId": $('#ddlPaymentMethod').val(),
                "InvoiceCustomerId": $('#ddlCustomer').val()
            }
            objDtl.push(aobj);
        }
    });
    obj.lstDetails = objDtl;
    return obj;
}
///// End Object ////

///// Clear Data Start ////
function ClearData() {
    $("#tbl tbody").empty();
    $('#txtAmountReceived').val('');
    $('#txtMemo').val('');
    $('#chkReceiveAll').parent().removeClass('uniform-checked');
    $('#chkAdvance').parent().removeClass('uniform-checked');
    $('#txtTotalApplied').val('');
    $('#txtFinanceCharge').val('');
    $('#txtTotalReceived').val('');
    $('#txtOutofBalance').val('');
    $('#tbl tbody tr').empty();
    $('#ddlPaymentMethod').val('-1').trigger('change');
    $('#txtAdvanceBalance').val('');
    //$('#ddlCustomer').val('-1').trigger('change');
}
///// Clear Data Start ////