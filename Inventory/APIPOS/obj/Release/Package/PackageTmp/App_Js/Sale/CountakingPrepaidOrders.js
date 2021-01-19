var count = 0, Controller = "CountakingPrepaidOrders", CommonController = "Common", locList = [], today = '';
var EmpLst = [];

$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {

    $('#btnRefresh').hide();
    $('#txtFrom').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    $('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
    $('#txtTo').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    $('#txtCollDate').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
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
    var urlpath = base + Controller + "/GetCountakingPrepaidOrder";
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
            '<th></th>' +
            '<th>Date</th>' +
            '<th>Total Eftpos</th>' +
            '<th>Total Cash</th>' +
          // '<th>Till Cash1</th>' +
            '<th>Till Cash</th>' +
            '<th>Take Count By</th>' +
            '<th></th>' +
            '<th>Collected Amount</th>' +
            '<th>Collection Date</th>' +
            '<th>Collection By</th>' +
            '<th>Collection Status</th>' +
            '<th></th>' +
             '</tr>' +
        '</thead>';
    return content;
}

function TableRow(result) {
    $("#divTable").empty();
    let content = '', tolEftpos = 0, tolCash = 0, tolTill = 0, tolCollect = 0;
    let til = 0, sCash=0, intTax=0;
    if (result.length > 0) {
        sCash = result[0].Tax;
        var olist = result;
        $(olist).each(function (index, element) {
            let color = '',color1 = '', btn = '', btn1 = '', btntxt = '', btntxt1 = '';
            let btnColor = '', btnColor1 = '';
            if (element.CreatedBy != "") {
                btn = 'disabled'; btntxt = 'Count Taken';
                if (element.TaxType == "Equal") {
                    btnColor = 'btn-small btn-success'; color = '';
                } else { btnColor = 'btn-small btn-success'; color = 'background-color: Red;'; }
            } else { btn = ''; btnColor = 'btn-small btn-inverse'; btntxt = 'Take Count'; }

            if (index != 0 && element.discount != 0) {
                  if (intTax == 0) {
                    intTax = element.Tax;
                }
                // add new  store cash entry 
                til = parseFloat(til) - parseFloat(intTax);

                sCash = element.discount;// add new line
                intTax = element.discount;
            }
            til = parseFloat(til) + parseFloat(element.Due);
            if(til !=0)
            {
                til = parseFloat(til) + parseFloat(sCash);
                sCash = 0;
            } else {
                til = parseFloat(sCash);
                sCash = 0;
            }
            let tilAmt = 'til';

            if (element.LastName != "" && element.State == "Complete") {
                btn1 = 'disabled'; btntxt1 = 'Collected';
                btnColor1 = 'btn-small btn-success';
                color1 = '';
            } else {
                if (til == 0 || element.TotalAmount == 0) {
                   
                    if (til == 0) {
                        btn1 = 'disabled'; btntxt1 = 'Collection'; btnColor1 = 'btn-small btn-warning'; color1 = 'background-color: grey;';
                    } else { btn1 = ''; btntxt1 = 'Collection'; btnColor1 = 'btn-small'; color1 = ''; }

                } else { btn1 = ''; btntxt1 = 'Collection'; btnColor1 = 'btn-small btn-warning'; color1 = ''; }
            }

            content += '<tr>' +
                '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_ByDate="' + element.PrepaidDueDate + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + element.PrepaidDueDate + '</td>' +
                '<td>' + '$ ' + element.SubTotal + '<input type="hidden" value="' + element.Name + '" /></td>' +
                '<td>' + '$ ' + element.TotalAmount + '<input type="hidden" value="' + element.SaleOutletId + '" /></td>' +
              // '<td>' + element.Due + '</td>' +
                '<td class="Due">' + '$ ' + eval(tilAmt).toFixed(2) + '<input type="hidden" value="' + element.Due + '" /></td>' +
                '<td>' + element.CreatedBy + '</td>' +
                '<td><input type="button" ' + btn + ' class="btn ' + btnColor + ' countaken" id="' + element.PrepaidDueDate + '" style="width: 75px; ' + color + '" value="' + btntxt + '" /></td>' +
                '<td>' + '$ ' + element.PaidToday + '</td>' +
                '<td>' + element.FirstName + '</td>' +
                '<td>' + element.LastName + '</td>' +
                '<td>' + element.State + '</td>' +
                '<td><input type="button" ' + btn1 + ' class="btn ' + btnColor1 + ' collection" id="' + element.PrepaidDueDate + '" style="width: 75px; ' + color1 + '" value="' + btntxt1 + '" /></td>' +
              '</tr>';
            tolEftpos = parseFloat(tolEftpos) + parseFloat(element.SubTotal);
            tolCash = parseFloat(tolCash) + parseFloat(element.TotalAmount);
            tolTill = parseFloat(til); //parseFloat(tolTill)+ parseFloat(element.Due);
            tolCollect = parseFloat(tolCollect) + parseFloat(element.PaidToday);
        });

        content += '<tr>' +
        '<td colspan="2" style="text-align: right;" bgcolor="#CCCCCC"><strong>Total:</strong> </td>' +
        '<td style="text-align: center;"><strong> $ ' + parseFloat(tolEftpos).toFixed(2) + '</strong></td>' +
        '<td style="text-align: center;"><strong> $ ' + parseFloat(tolCash).toFixed(2) + '</strong></td>' +
        '<td style="text-align: center;"><strong> $ ' + parseFloat(tolTill).toFixed(2) + '</strong></td>' +
        '<td colspan="2"></td>' +
        '<td style="text-align: center;"><strong> $ ' + parseFloat(tolCollect).toFixed(2) + '</strong></td>' +
        '<td colspan="4"</td>' +
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

        var urlpath = base + Controller + "/GetPrepaidOrderDateWiseCountAndCollData";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "PayDate": PayDate, "OutletId": saleOutletId, "Operation": TakeCount, "FromDate": fromDate, "Todate": toDate }),
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
    let TInvAmount = 0,  TChequeAmount = 0, TTransferAmount = 0,
        TCashAmount = 0, TEFTPOSAmount = 0, TPaypalAmount = 0,
        TOtherAmount = 0, TAfterPayAmount = 0, THummAmount = 0;
    if (result.length > 0) {
        var olist = result;
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
            THummAmount = parseFloat(element.NetBill);
        });

        let pos = TEFTPOSAmount != 0 ? '' : TEFTPOSAmount;
        let cash = TCashAmount != 0 ? '' : TCashAmount;
        let cheque = TChequeAmount != 0 ? '' : TChequeAmount;
        let paypal = TPaypalAmount != 0 ? '' : TPaypalAmount;
        let trns = TTransferAmount != 0 ? '' : TTransferAmount;
        let other = TOtherAmount != 0 ? '' : TOtherAmount; 
        let after = TAfterPayAmount != 0 ? '' : TAfterPayAmount;
        let humm = THummAmount != 0 ? '' : THummAmount;
        content += '<tr>' +
              '<td>Total Count</td>' +
              '<td><input type="number" id="txtEFTPOS" Value="' + pos + '" placeholder="[Type EFTPOS Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtCash" Value="' + cash + '" placeholder="[Type Cash Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtCheque" Value="' + cheque + '" placeholder="[Type Cheque Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtPaypal" Value="' + paypal + '" placeholder="[Type Paypal Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtTransfer" Value="' + trns + '" placeholder="[Type Transfer Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtOther" Value="' + other + '" placeholder="[Type Other Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtAfterPay" Value="' + after + '" placeholder="[Type After Pay Amount]" class="span12" /></td>' +
              '<td><input type="number" id="txtHumm" Value="' + humm + '" placeholder="[Type Humm Amount]" class="span12" /></td>' +
      '</tr>';
        content += '<tr>' +
              '<td>Out Of Balance</td>' +
              '<td><input type="text" id="txtEFTPOSf" Value="' + pos + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtCashf" Value="' + cash + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtChequef" Value="' + cheque + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtPaypalf" Value="' + paypal + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtTransferf" Value="' + trns + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtOtherf" Value="' + other + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtAfterPayf" Value="' + after + '" readonly class="span12" /></td>' +
              '<td><input type="text" id="txtHummf" Value="' + humm + '" readonly class="span12" /></td>' +
      '</tr>';
        $('#tblTakeCount tbody').append(content);
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

$(document).off('click', '.collection').on('click', '.collection', function () {
    if ($("#ddlOutlet").val() != "-1") {
    $("#hfCollOutletId").val("");
    $("#hfCollDate").val("");
    $("#txtMNotes").val("");
    $("#txtCollDate").val("");
    let Id = $(this)[0].id;
    let tblRow = $(this).closest('tr');
    let due = tblRow[0].cells[4].childNodes[1].value;
    let saleOutletId = tblRow[0].cells[3].childNodes[1].value; 
    let colldate = tblRow[0].cells[2].childNodes[1].value;
    let PayDate = colldate;
    let MoneyCollected = "MoneyCollected";
    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    var urlpath = base + Controller + "/GetPrepaidOrderDateWiseCountAndCollData";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "PayDate": PayDate, "OutletId": saleOutletId, "Operation": MoneyCollected, "FromDate": fromDate, "Todate": toDate }),
        success: function (result) {
            if (result.IsSessionOut != null) {

                $("#idColltbody").empty();
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {

                $("#idColltbody").empty();
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindCollectedTbl(result.SalesList);
                $("#collectionModal").css("display", "block");
                LoadDropdown(EmpLst, $('#ddlEmployee'));
               
            }
        }
    });

    $("#hfCollOutletId").val(saleOutletId);
    $("#txtCollDate").val(today);
    $("#hfCollDate").val(colldate);

    } else { $.pnotify({ text: 'Please Select Outlet. !', type: 'info' }); }

});

function BindCollectedTbl(result) {
    $("#idColltbody").empty();
    let content = '';
    let TInvAmount = 0, TChequeAmount = 0, TTransferAmount = 0,
        TCashAmount = 0, TEFTPOSAmount = 0, TPaypalAmount = 0, TOtherAmount = 0;
    if (result.length > 0) {
        var olist = result;
        $(olist).each(function (index, element) {
            let color = 'background-color: #0000FF;', btn = '';
            content += '<tr>' +
                '<td>' + element.PrepaidDueDate + '<input type="hidden" class="date" value="' + element.Name + '" /></td>' +
                '<td>' + '$ ' + element.TotalAmount + '<input type="hidden" class="tolAmount" value="' + element.TotalAmount + '" /></td>' +
                '<td><input type="number" id="txtCash" Value="" placeholder="[Type Collected Amount]" class="span12 CollectedAmount" /></td>' +
        '</tr>';

            TCashAmount = parseFloat(TCashAmount) + parseFloat(element.TotalAmount);
        });

        content += '<tr>' +
            '<td style="font-weight: bold;">Total :</td>' +
            '<td class="txtTotCash">' + '$ ' + TCashAmount.toFixed(2) + '</td>' +
            '<td> $  <input type="text" id="txtTotCollection" Value="" style="width: 160px;" readonly class="span12" /></td>' +
    '</tr>';

        $('#tblCollection tbody').append(content);
    }

}

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

$331('#btnMCancel').on('click', function () {
    $("#collectionModal").css("display", "none");
});

$331('#btnDetClose').on('click', function () {
    $("#detailsModal").css("display", "none");
});

$331(document).off('change', '.CollectedAmount').on('change', '.CollectedAmount', function () {
    let paidamount = $(this).val();
    let tblRow = $(this).closest('tr');
    let indexNo = $(tblRow).index();
    let AvailableQty = parseFloat($(tblRow).find('.tolAmount').val());
    if (AvailableQty < paidamount) {
        $(this).val('');
        $.pnotify({
            text: "<span style='font-weight:bold; color:#FF0000;'>Available Quantity</span> = " + AvailableQty, type: 'info', nonblock: true,
            history: false, delay: 3000
        });
    }
   
    var qty=0;
    $("#tblCollection tbody tr").each(function () {
        if ($(this).find('.CollectedAmount').val() != undefined) {
            qty += parseFloat($(this).find('.CollectedAmount').val() == '' ? "0" : $(this).find('.CollectedAmount').val());
        }
    });
    $("#tblCollection tbody tr").find('#txtTotCollection').val(qty);

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
        var urlpath = base + Controller + "/SaveCountaken";
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

$331('#btnMSave').on('click', function () {
  
    if (CollectionValidation()) {
      var  lstDetails = [];
        $("#tblCollection tbody tr").each(function () {
            let ReceiveQty = parseFloat($(this).find('.CollectedAmount').val() == '' ? "0" : $(this).find('.CollectedAmount').val());
            if (ReceiveQty > 0) {
                let aobj = {
                    "InvoiceDate": $(this).find('.date').val(),
                    "TotalAmount": $(this).find('.tolAmount').val(),
                    "PaidToday": $(this).find('.CollectedAmount').val(),
                    "SaleOutletId": $("#hfCollOutletId").val(),
                    "Comments": $("#txtMNotes").val(),
                    "PrepaidDueDate": $("#txtCollDate").val(),
                    "CreatedBy": $("#ddlEmployee option:selected").text()
                }
                lstDetails.push(aobj);
            }
        });
       
        var urlpath = base + Controller + "/SaveMoneyCollection";
        $331.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "lstDetails": lstDetails }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $("#collectionModal").css("display", "none");
                    Loaddatatable();
                    $.pnotify({ text: 'Collection Completed', type: 'success' });
                }
            }
        });

    }

});

function CollectionValidation() {
    let valid = true;
    let qty = 0;
    $("#tblCollection tbody tr").each(function () {
        if ($(this).find('.CollectedAmount').val() != undefined) {
            qty += parseFloat($(this).find('.CollectedAmount').val() == '' ? "0" : $(this).find('.CollectedAmount').val());
        }
    });

    if (qty == 0) {
        $.pnotify({
            text: 'Your Collected Amount Required', type: 'error',
            nonblock: true,
            history: false,
            delay: 3000
        });
        valid = false;
        return valid;
    }

    if ($("#ddlEmployee").val() == "-1") {
        $.pnotify({
            text: 'Plese select Employee Name.', type: 'error',
            nonblock: true,
            history: false,
            delay: 3000
        });
        valid = false;
        return valid;
    }

    if ($("#txtCollDate").val() == "") {
        $("#txtCollDate").focus();
        valid = false;
        return valid;
    }

    return valid;
}

$(document).on('change', ".ftDate", function () {
    if ($("#txtFrom").val() != "" && $("#txtTo").val() != "") {
      //  Loaddatatable();
    }
});

$(document).off('click', '.btnRedirect').on('click', '.btnRedirect', function () {
   
    var PayDate = $(this).attr('data_ByDate');
    let tblRow = $(this).closest('tr');
    let saleOutletId = tblRow[0].cells[3].childNodes[1].value;

    var urlpath = base + Controller + "/GetDateWiseDetailsInvoice";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "PayDate": PayDate, "OutletId": saleOutletId }),
        success: function (result) {
            if (result.IsSessionOut != null) {
               // $("#divTblDetail").empty();
                $("#idtbody").empty();
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
              //  $("#divTblDetail").empty();
                $("#idtbody").empty();
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                
                BindDetTbl(result[0]);
                if (result[1] != undefined) {
                    BindTakeCountTblHistory(result[1]);
                }
                if (result[2] != undefined) {
                    BindCollectedTblHistory(result[2]);
                } else {
                    $("#idColltbodyHistory").empty();
                    $("#txtCollDateHistory").val('')
                    $("#txtEmployeeHistory").val('')
                    $("#txtMNotesHistory").val('')
                }
                $("#txtDate").val("");
                $("#txtDate").val(PayDate);
                $("#detailsModal").css("display", "block");
            }
        }
    });
   

});

function BindDetTbl(result) {

    $("#idtbody").empty();
    let content = '';
    let TInvAmount = 0, TBankAmount = 0, TVisaAmount = 0, TMasterAmount = 0, TChequeAmount = 0, TTransferAmount =0,
        TCashAmount = 0, TEFTPOSAmount = 0, TPaypalAmount = 0, TOtherAmount = 0, TAfterPayAmount = 0, THummAmount = 0;
    if (result.length > 0) {
        var olist = result;
       
        $(olist).each(function (index, element) {
            let color = 'background-color: #0000FF;', btn = '', btn1 = '';

            content += '<tr>' +
                '<td>' + element.PrepaidDueDate + '</td>' +
                '<td>' + element.DateFrom + '</td>' +
                '<td>' + element.InvoiceNo + '</td>' +
                '<td>' + '$ ' + element.TotalAmount + '</td>' +
                '<td>' + '$ ' + element.PaidToday + '</td>' +
                '<td>' + '$ ' + element.SubTotal + '</td>' +
                '<td>' + '$ ' + element.Tax + '</td>' +
                '<td>' + '$ ' + element.Due + '</td>' +
                '<td>' + '$ ' + element.discount + '</td>' +
                '<td>' + '$ ' + element.CustomerId + '</td>' +
                '<td>' + '$ ' + element.PrevDue + '</td>' +
                '<td>' + '$ ' + element.NetBill + '</td>' +
               

        '</tr>';

            TInvAmount = parseFloat(TInvAmount) + parseFloat(element.TotalAmount);
            TEFTPOSAmount = parseFloat(TEFTPOSAmount) + parseFloat(element.PaidToday);
            TCashAmount = parseFloat(TCashAmount) + parseFloat(element.SubTotal);
            TChequeAmount = parseFloat(TChequeAmount) + parseFloat(element.Tax);
            TPaypalAmount = parseFloat(TPaypalAmount) + parseFloat(element.Due);
            TTransferAmount = parseFloat(TTransferAmount) + parseFloat(element.discount);
            TOtherAmount = parseFloat(TOtherAmount) + parseFloat(element.CustomerId);
            TAfterPayAmount = parseFloat(TAfterPayAmount) + parseFloat(element.PrevDue);
            THummAmount = parseFloat(THummAmount) + parseFloat(element.NetBill);
           
        });
        $('#tbl tbody').append(content);
    }

    let TInvoice = $("tfoot tr")[0].cells[2].childNodes[0].id;
    let TEFTPOS = $("tfoot tr")[0].cells[3].childNodes[0].id;
    let TCash = $("tfoot tr")[0].cells[4].childNodes[0].id;
    let TCheque = $("tfoot tr")[0].cells[5].childNodes[0].id;
    let TPaypal = $("tfoot tr")[0].cells[6].childNodes[0].id;
    let TTransfer = $("tfoot tr")[0].cells[7].childNodes[0].id;
    let TOther = $("tfoot tr")[0].cells[8].childNodes[0].id;
    let TAfterPay = $("tfoot tr")[0].cells[9].childNodes[0].id;
    let THumm = $("tfoot tr")[0].cells[10].childNodes[0].id;

    document.getElementById(TInvoice).innerHTML = '$ ' + TInvAmount.toFixed(2);
    document.getElementById(TEFTPOS).innerHTML = '$ ' + TEFTPOSAmount.toFixed(2);
    document.getElementById(TCash).innerHTML = '$ ' + TCashAmount.toFixed(2);
    document.getElementById(TCheque).innerHTML = '$ ' + TChequeAmount.toFixed(2);
    document.getElementById(TPaypal).innerHTML = '$ ' + TPaypalAmount.toFixed(2);
    document.getElementById(TTransfer).innerHTML = '$ ' + TTransferAmount.toFixed(2);
    document.getElementById(TOther).innerHTML = '$ ' + TOtherAmount.toFixed(2);
    document.getElementById(TAfterPay).innerHTML = '$ ' + TAfterPayAmount.toFixed(2);
    document.getElementById(THumm).innerHTML = '$ ' + THummAmount.toFixed(2);


   
}

function BindTakeCountTblHistory(result) {
    //$("#divTblDetail").empty();
    $("#idTaketbodyHistory").empty();
    let content = '';
    let TInvAmount = 0, TChequeAmount = 0, TTransferAmount = 0,
        TCashAmount = 0, TEFTPOSAmount = 0, TPaypalAmount = 0,
        TOtherAmount = 0, TAfterPayAmount = 0, THummAmount = 0;
    if (result.length > 0) {
        $("#txtTakeDateHistory").val('');
        $("#txtTakeByHistory").val('');
        $("#txtNotesHistory").val('');
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
        let PaidToday = modi != undefined ? modi.PaidToday : 0;
        let SubTotal = modi != undefined ? modi.SubTotal : 0;
        let Tax = modi != undefined ? modi.Tax : 0;
        let Due = modi != undefined ? modi.Due : 0;
        let discount = modi != undefined ? modi.discount : 0;
        let CustomerId = modi != undefined ? modi.CustomerId : 0;
        let PrevDue = modi != undefined ? modi.PrevDue : 0;
        let NetBill = modi != undefined ? modi.NetBill : 0;
        let Comments = modi != undefined ? modi.Comments : ""; 
        let Name = modi != undefined ? modi.Name : ""; 
        let date = modi != undefined ? modi.DateFrom : "";

        content += '<tr>' +
              '<td>Total Count</td>' +
              '<td>' + '$ ' + PaidToday+ '</td>' +
              '<td>' + '$ ' + SubTotal + '</td>' +
              '<td>' + '$ ' + Tax + '</td>' +
              '<td>' + '$ ' + Due + '</td>' +
              '<td>' + '$ ' + discount + '</td>' +
              '<td>' + '$ ' + CustomerId + '</td>' +
              '<td>' + '$ ' + PrevDue + '</td>' +
              '<td>' + '$ ' + NetBill + '</td>' +
             
      '</tr>';
        content += '<tr style="font-weight: bold;">' +
              '<td>Out Of Balance</td>' +
               '<td>' + '$ ' + (parseFloat(olist.PaidToday) - parseFloat(PaidToday)) + '</td>' +
              '<td>' + '$ ' + (parseFloat(olist.SubTotal) - parseFloat(SubTotal)) + '</td>' +
              '<td>' + '$ ' + (parseFloat(olist.Tax) - parseFloat(Tax)) + '</td>' +
              '<td>' + '$ ' + (parseFloat(olist.Due) - parseFloat(Due)) + '</td>' +
              '<td>' + '$ ' + (parseFloat(olist.discount) - parseFloat(discount)) + '</td>' +
              '<td>' + '$ ' + (parseFloat(olist.CustomerId) - parseFloat(CustomerId)) + '</td>' +
              '<td>' + '$ ' + (parseFloat(olist.PrevDue) - parseFloat(PrevDue)) + '</td>' +
              '<td>' + '$ ' + (parseFloat(olist.NetBill) - parseFloat(NetBill)) + '</td>' +

      '</tr>';
        $('#tblTakeCountHistory tbody').append(content);
       
        $("#txtTakeDateHistory").val(date);
        $("#txtTakeByHistory").val(Name);
        $("#txtNotesHistory").val(Comments);
    }
}

function BindCollectedTblHistory(result) {
    $("#idColltbodyHistory").empty();
    let content = '';
    let TInvAmount = 0, TChequeAmount = 0, TTransferAmount = 0,
        TCashAmount = 0, TEFTPOSAmount = 0, TPaypalAmount = 0, TOtherAmount = 0;
    if (result.length > 0) {
        var olist = result;
        $(olist).each(function (index, element) {
            let color = 'background-color: #0000FF;', btn = '';
            content += '<tr>' +
                '<td>' + element.PrepaidDueDate + '</td>' +
                '<td>' + '$ ' + element.TotalAmount + '</td>' +
                '<td>' + '$ ' + element.SubTotal + '</td>' +
        '</tr>';

        });

    '</tr>';

    $('#tblCollectionHistory tbody').append(content);
    $("#txtCollDateHistory").val(result[0].DateFrom)
    $("#txtEmployeeHistory").val(result[0].Name)
    $("#txtMNotesHistory").val(result[0].Comments)
    }

}
