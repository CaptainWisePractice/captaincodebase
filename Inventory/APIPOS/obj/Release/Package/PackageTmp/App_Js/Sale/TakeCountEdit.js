var count = 0, Controller = "TakeCountEdit", ControllerOrder = "CountakingPrepaidOrders", CommonController = "Common", locList = [], today = '';
var EmpLst = [];

$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {

    $('#btnRefresh').hide();
    $('#txtFrom').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    $('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
    $('#txtTo').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    getDate();
    loadSaleOutlet();
    loadAllEmployee();

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
    today = day + "-" + monthsArr[month] + "-" + year;
    //  document.getElementById("txtFrom").value = date;
    document.getElementById("txtTo").value = date;
}

function loadSaleOutlet() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "Sales/loadSaleOutlet",
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
                LoadDropdown(result, $('#ddlOutlet'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Sales Outlet Load Problem !', type: 'error' });
        }
    });
}

function loadAllEmployee() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "Common/loadAllEmployee",
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
                LoadDropdown(result, $('#ddlEmployee'));
                EmpLst = result;
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Sales Outlet Load Problem !', type: 'error' });
        }
    });
}

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

$('#btnSearch').on('click', function () {
    if (SearchValidation()) {
        Loaddatatable();
    }
});

$(document).off('change', '#ddlOutlet').on('change', '#ddlOutlet', function () {
    if ($("#ddlOutlet").val() != "-1") {
        $("#divTable").empty();
    }
});


function Loaddatatable() {
    var urlpath = base + Controller + "/GetTakeCountEditData";
    let OutletId = $("#ddlOutlet").val();
    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();

    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "OutletId": OutletId, "FromDate": fromDate, "Todate": toDate }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $("#divTable").empty();
                // $('#tbl tbody').empty();
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $("#divTable").empty();
                // $('#tbl tbody').empty();
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.SalesList);

            }
        }
    });
}

function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableRow(data);
    content += '</tbody></table>';
    $("#divTable").append(content);

}

function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
            '<tr>' +
            '<th>#SL</th>' +
            '<th>Date</th>' +
            '<th>Total Eftpos</th>' +
            '<th>Total Cash</th>' +
            '<th>Till Cash</th>' +
            '<th>Take Count By</th>' +
            '<th></th>' +
             '</tr>' +
        '</thead>';
    return content;
}

function TableRow(result) {
    $("#divTable").empty();
    let content = '', tolEftpos = 0, tolCash = 0, tolTill = 0, tolCollect = 0;
    let til = 0, sCash = 0;
    if (result.length > 0) {
        sCash = result[0].discount;
        var olist = result;
        $(olist).each(function (index, element) {
            let color = '', btn = '';
            let btnColor = '';
            //if (element.CreatedBy != "") {
            //    btn = 'disabled'; btntxt = 'Count Taken';
            //    if (element.TaxType == "Equal") {
            //        btnColor = 'btn-small btn-success'; color = '';
            //    } else { btnColor = 'btn-small btn-success'; color = 'background-color: Red;'; }
            //} else { btn = ''; btnColor = 'btn-small btn-inverse'; btntxt = 'Take Count'; }

            til = parseFloat(til) + parseFloat(element.Due);
            if (til != 0) {
                til = parseFloat(til) + parseFloat(sCash);
                sCash = 0;
            } else {
                til = parseFloat(sCash);
                sCash = 0;
            }
            let tilAmt = 'til';

            content += '<tr>' +
                '<td style="width:35px;">' + (index + 1 )+ '</td>' +
                '<td>' + element.PrepaidDueDate + '</td>' +
                '<td>' + '$ ' + element.SubTotal + '<input type="hidden" value="' + element.Name + '" /></td>' +
                '<td>' + '$ ' + element.TotalAmount + '<input type="hidden" value="' + element.SaleOutletId + '" /></td>' +
                '<td class="Due">' + '$ ' + eval(tilAmt) + '<input type="hidden" value="' + element.Due + '" /></td>' +
                '<td>' + element.CreatedBy + '</td>' +
                '<td><input type="button" ' + btn + ' class="btn btn-small btn-success countaken" id="' + element.PrepaidDueDate + '" style="width: 75px;" value="Take Count" /></td>' +
              '</tr>';
            tolEftpos = parseFloat(tolEftpos) + parseFloat(element.SubTotal);
            tolCash = parseFloat(tolCash) + parseFloat(element.TotalAmount);
            tolTill = parseFloat(til);
            tolCollect = parseFloat(tolCollect) + parseFloat(element.PaidToday);
        });

        content += '<tr>' +
        '<td colspan="2" style="text-align: right;" bgcolor="#CCCCCC"><strong>Total:</strong> </td>' +
        '<td style="text-align: center;"><strong> $ ' + parseFloat(tolEftpos).toFixed(2) + '</strong></td>' +
        '<td style="text-align: center;"><strong> $ ' + parseFloat(tolCash).toFixed(2) + '</strong></td>' +
        '<td style="text-align: center;"><strong> $ ' + parseFloat(tolTill).toFixed(2) + '</strong></td>' +
        '<td colspan="3"></td>' +
        '</tr>';
    }

    return content;
}

function SearchValidation() {
    let valid = true;
    if ($("#ddlOutlet").val() == "-1") {
        $.pnotify({ text: 'Please Select Outlet. !', type: 'info' });
        valid = false;
        return valid;
    }

    if ($("#txtDatedFrom").val() == "") {
        $.pnotify({ text: 'Please Input From Date. !', type: 'info' });
        $("#txtDatedFrom").focus();
        valid = false;
        return valid;
    }

    if ($("#txtDatedTo").val() == "") {
        $.pnotify({ text: 'Please Input From To. !', type: 'info' });
        $("#txtDatedTo").focus();
        valid = false;
        return valid;
    }

    return valid;
}

$(document).off('click', '.countaken').on('click', '.countaken', function () {
    if ($("#ddlOutlet").val() != "-1") {
        $("#txtCountakenDate").val("");
        $("#txtOutlet").val("");
        $("#hfCoOutletId").val("");
        $("#hfCoDate").val("");
        $("#txtCountakenAmount").val("0");
        $("#txtNotes").val("");

        let Id = $(this)[0].id;
        let tblRow = $(this).closest('tr');
        let due = tblRow[0].cells[4].childNodes[1].value;
        let saleOutletId = tblRow[0].cells[3].childNodes[1].value;
        let coDate = tblRow[0].cells[2].childNodes[1].value;
        let outLet = $("#ddlOutlet option:selected").text();

        var PayDate = Id;//$(this).attr('data_ByDate');
        let TakeCount = "TakeCount";
        let fromDate = $("#txtFrom").val();
        let toDate = $("#txtTo").val();

        var urlpath = base + Controller + "/GetTakeCountEditDateWiseData";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "OutletId": saleOutletId, "FromDate": fromDate, "Todate": toDate, "PayDate": PayDate }),
            success: function (result) {
                if (result.IsSessionOut != null) {

                    $("#idTaketbody").empty();
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {

                    $("#idTaketbody").empty();
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $("#txtNotes").val('');
                    BindTakeCountTbl(result.SalesList);
                    $("#myModal").css("display", "block");
                }
            }
        });

        $("#txtCountakenDate").val(Id);
        $("#txtOutlet").val(outLet);
        $("#hfCoOutletId").val(saleOutletId);
        $("#hfCoDate").val(coDate);
    } else { $.pnotify({ text: 'Please Select Outlet. !', type: 'info' }); }

});

function BindTakeCountTbl(result) {
    //$("#divTblDetail").empty();
    $("#idTaketbody").empty();
    let content = '';
    let TInvAmount = 0, TChequeAmount = 0, TTransferAmount = 0,
        TCashAmount = 0, TEFTPOSAmount = 0, TPaypalAmount = 0,
        TOtherAmount = 0,TAfterPayAmount = 0,THummAmount = 0;
    if (result.length > 0) {
        
        var olist = result[0];
        $(olist).each(function (index, element) {
            let color = 'background-color: #0000FF;', btn = '';
            content += '<tr>' +
                '<td>Invoice Total</td>' +
                '<td>' + '$ ' + element.PaidToday + '<input type="hidden" class="EFTPOS" value="' + element.PaidToday + '" /></td>' +
                '<td>' + '$ ' + element.SubTotal + '<input type="hidden" class="Cash" value="' + element.SubTotal + '" /></td>' +
                '<td>' + '$ ' + element.Tax + '<input type="hidden" class="Cheque" value="' + element.Tax + '" /></td>' +
                '<td>' + '$ ' + element.Due + '<input type="hidden" class="Paypal" value="' + element.Due + '" /></td>' +
                '<td>' + '$ ' + element.discount + '<input type="hidden" class="Transfer" value="' + element.discount + '" /></td>' +
                '<td>' + '$ ' + element.CustomerId + '<input type="hidden" class="Other" value="' + element.CustomerId + '" /></td>' +
                 '<td>' + '$ ' + element.PrevDue + '<input type="hidden" class="AfterPay" value="' + element.PrevDue + '" /></td>' +
                '<td>' + '$ ' + element.NetBill + '<input type="hidden" class="Humm" value="' + element.NetBill + '" /></td>' +
        '</tr>';
            TEFTPOSAmount = parseFloat(element.PaidToday);
            TCashAmount = parseFloat(element.SubTotal);
            TChequeAmount = parseFloat(element.Tax);
            TPaypalAmount = parseFloat(element.Due);
            TTransferAmount = parseFloat(element.discount);
            TOtherAmount = parseFloat(element.CustomerId);
            TAfterPayAmount = parseFloat(element.PrevDue);
            THumm = parseFloat(element.NetBill);
        });

        let modi = result[1];

        content += '<tr>' +
              '<td>Total Count</td>' +
              '<td><input type="number" id="txtEFTPOS" Value="' + modi.PaidToday + '" placeholder="[Type EFTPOS Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtCash" Value="' + modi.SubTotal + '" placeholder="[Type Cash Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtCheque" Value="' + modi.Tax + '" placeholder="[Type Cheque Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtPaypal" Value="' + modi.Due + '" placeholder="[Type Paypal Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtTransfer" Value="' + modi.discount + '" placeholder="[Type Transfer Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtOther" Value="' + modi.CustomerId + '" placeholder="[Type Other Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtAfterPay" Value="' + modi.PrevDue + '" placeholder="[Type After Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtHumm" Value="' + modi.NetBill + '" placeholder="[Type Humm Amount]" class="span12" /></td>' +
      '</tr>';
        content += '<tr>' +
              '<td>Out Of Balance</td>' +
              '<td><input type="text" id="txtEFTPOSf" Value="' + (parseFloat(olist.PaidToday) - parseFloat(modi.PaidToday)) + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtCashf" Value="' + (parseFloat(olist.SubTotal) - parseFloat(modi.SubTotal)) + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtChequef" Value="' + (parseFloat(olist.Tax) - parseFloat(modi.Tax)) + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtPaypalf" Value="' + (parseFloat(olist.Due) - parseFloat(modi.Due)) + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtTransferf" Value="' + (parseFloat(olist.discount) - parseFloat(modi.discount)) + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtOtherf" Value="' + (parseFloat(olist.CustomerId) - parseFloat(modi.CustomerId)) + '" readonly class="span12" /></td>' +
               '<td><input type="text" id="txtAfterPayf" Value="' + (parseFloat(olist.PrevDue) - parseFloat(modi.PrevDue)) + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtHummf" Value="' + (parseFloat(olist.NetBill) - parseFloat(modi.NetBill)) + '" readonly class="span12" /></td>' +
      '</tr>';
        $('#tblTakeCount tbody').append(content);

        $("#txtNotes").val(modi.Comments);
    }
}

$331(document).off('change', '#txtEFTPOS').on('change', '#txtEFTPOS', function () {
    if ($(this).val() != '') {
        let paidamount = $(this).val();
        let tAmount = $("#tblTakeCount tbody tr").find('.EFTPOS').val();
        let Qty = parseFloat(tAmount) - parseFloat(paidamount);
        $("#tblTakeCount tbody tr").find('#txtEFTPOSf').val(Qty);
    } else { $(this).val(''); $("#tblTakeCount tbody tr").find('#txtEFTPOSf').val(''); }
});

$331(document).off('change', '#txtCash').on('change', '#txtCash', function () {
    if ($(this).val() != '') {
        let paidamount = $(this).val();
        let tAmount = $("#tblTakeCount tbody tr").find('.Cash').val();
        let Qty = parseFloat(tAmount) - parseFloat(paidamount);
        $("#tblTakeCount tbody tr").find('#txtCashf').val(Qty);
    } else { $(this).val(''); $("#tblTakeCount tbody tr").find('#txtCashf').val(''); }
});

$331(document).off('change', '#txtCheque').on('change', '#txtCheque', function () {
    if ($(this).val() != '') {
        let paidamount = $(this).val();
        let tAmount = $("#tblTakeCount tbody tr").find('.Cheque').val();
        let Qty = parseFloat(tAmount) - parseFloat(paidamount);
        $("#tblTakeCount tbody tr").find('#txtChequef').val(Qty);
    } else { $(this).val(''); $("#tblTakeCount tbody tr").find('#txtChequef').val(''); }
});

$331(document).off('change', '#txtPaypal').on('change', '#txtPaypal', function () {
    if ($(this).val() != '') {
        let paidamount = $(this).val();
        let tAmount = $("#tblTakeCount tbody tr").find('.Paypal').val();
        let Qty = parseFloat(tAmount) - parseFloat(paidamount);
        $("#tblTakeCount tbody tr").find('#txtPaypalf').val(Qty);
    } else { $(this).val(''); $("#tblTakeCount tbody tr").find('#txtPaypalf').val(''); }
});

$331(document).off('change', '#txtTransfer').on('change', '#txtTransfer', function () {
    if ($(this).val() != '') {
        let paidamount = $(this).val();
        let tAmount = $("#tblTakeCount tbody tr").find('.Transfer').val();
        let Qty = parseFloat(tAmount) - parseFloat(paidamount);
        $("#tblTakeCount tbody tr").find('#txtTransferf').val(Qty);
    } else { $(this).val(''); $("#tblTakeCount tbody tr").find('#txtTransferf').val(''); }
});

$331(document).off('change', '#txtOther').on('change', '#txtOther', function () {
    if ($(this).val() != '') {
        let paidamount = $(this).val();
        let tAmount = $("#tblTakeCount tbody tr").find('.Other').val();
        let Qty = parseFloat(tAmount) - parseFloat(paidamount);
        $("#tblTakeCount tbody tr").find('#txtOtherf').val(Qty);
    } else { $(this).val(''); $("#tblTakeCount tbody tr").find('#txtOtherf').val(''); }
});

$331(document).off('change', '#txtAfterPay').on('change', '#txtAfterPay', function () {
    if ($(this).val() != '') {
        let paidamount = $(this).val();
        let tAmount = $("#tblTakeCount tbody tr").find('.AfterPay').val();
        let Qty = parseFloat(tAmount) - parseFloat(paidamount);
        $("#tblTakeCount tbody tr").find('#txtAfterPayf').val(Qty);
    } else { $(this).val(''); $("#tblTakeCount tbody tr").find('#txtAfterPayf').val(''); }
});

$331(document).off('change', '#txtHumm').on('change', '#txtHumm', function () {
    if ($(this).val() != '') {
        let paidamount = $(this).val();
        let tAmount = $("#tblTakeCount tbody tr").find('.Humm').val();
        let Qty = parseFloat(tAmount) - parseFloat(paidamount);
        $("#tblTakeCount tbody tr").find('#txtHummf').val(Qty);
    } else { $(this).val(''); $("#tblTakeCount tbody tr").find('#txtHummf').val(''); }
});

$331(".numeric").keydown(function (e) {
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

$331('#btnCCancel').on('click', function () {
    $("#myModal").css("display", "none");
});

$331('#btnCSave').on('click', function () {

    var objectData = {
        "ClosingDate": $("#hfCoDate").val(),
        "SaleOutletId": $("#hfCoOutletId").val(),
        "ClosingEFTPOSAmt": $("#tblTakeCount tbody tr").find('.EFTPOS').val(),
        "ClosingModEFTPOSAmt": $("#tblTakeCount tbody tr").find('#txtEFTPOS').val() == '' ? '0' : $("#tblTakeCount tbody tr").find('#txtEFTPOS').val(),
        "ClosingCashAmt": $("#tblTakeCount tbody tr").find('.Cash').val(),
        "ClosingModCashAmt": $("#tblTakeCount tbody tr").find('#txtCash').val() == '' ? '0' : $("#tblTakeCount tbody tr").find('#txtCash').val(),
        "ClosingChequeAmt": $("#tblTakeCount tbody tr").find('.Cheque').val(),
        "ClosingModChequeAmt": $("#tblTakeCount tbody tr").find('#txtCheque').val() == '' ? '0' : $("#tblTakeCount tbody tr").find('#txtCheque').val(),
        "ClosingPaypalAmt": $("#tblTakeCount tbody tr").find('.Paypal').val(),
        "ClosingModPaypalAmt": $("#tblTakeCount tbody tr").find('#txtPaypal').val() == '' ? '0' : $("#tblTakeCount tbody tr").find('#txtPaypal').val(),
        "ClosingTransferAmt": $("#tblTakeCount tbody tr").find('.Transfer').val(),
        "ClosingModTransferAmt": $("#tblTakeCount tbody tr").find('#txtTransfer').val() == '' ? '0' : $("#tblTakeCount tbody tr").find('#txtTransfer').val(),
        "ClosingOtherAmt": $("#tblTakeCount tbody tr").find('.Other').val(),
        "ClosingModOtherAmt": $("#tblTakeCount tbody tr").find('#txtOther').val() == '' ? '0' : $("#tblTakeCount tbody tr").find('#txtOther').val(),
        "ClosingAfterPayAmt": $("#tblTakeCount tbody tr").find('.AfterPay').val(),
        "ClosingModAfterPayAmt": $("#tblTakeCount tbody tr").find('#txtAfterPay').val() == '' ? '0' : $("#tblTakeCount tbody tr").find('#txtAfterPay').val(),
        "ClosingHummAmt": $("#tblTakeCount tbody tr").find('.Humm').val(),
        "ClosingModHummAmt": $("#tblTakeCount tbody tr").find('#txtHumm').val() == '' ? '0' : $("#tblTakeCount tbody tr").find('#txtHumm').val(),
        "Notes": $("#txtNotes").val()
    }
    var urlpath = base + ControllerOrder + "/SaveCountaken";
    $331.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": objectData }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                $("#myModal").css("display", "none");
                Loaddatatable();
                $.pnotify({ text: 'Countaking Completed', type: 'success' });

            }
        }
    });
});

$(document).on('change', ".ftDate", function () {
    if ($("#txtFrom").val() != "" && $("#txtTo").val() != "") {
        //  Loaddatatable();
    }
});

