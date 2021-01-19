var count = 0, CheckOutController = "ItemCheckOut", Controller = "DespatchCenter", ControllerDes = "ItemDispatch", CommonController = "Common", locList = [];
var content11 = "";

$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
$('#btnRefresh').hide();
$('#txtFrom').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
$('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
$('#txtTo').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
getDate();
Loaddatatable();

setInterval(function () {
    cache_clear()
}, 900000);

});

function cache_clear() {
    Loaddatatable();
   // window.location.reload(true);
   //  window.location.reload();// use this if you do not remove cache
}

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
  //  document.getElementById("txtFrom").value = date;
    document.getElementById("txtTo").value = date;
}

function Loaddatatable() {
    var urlpath = base + Controller + "/GetDespatchData";

    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": fromDate, "Todate": toDate }),
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
                // BindTable(result.list);
                if (result.list.length > 0) {
                    var dropdown = '<option value="-1"> Select ----- </option>';
                    $.each(result.listComboData, function (i, obj) {
                        dropdown += '<option value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
                    });
                    dropdown += '<option value="-1"> ----------------- </option> <option value="1014"> Store Pickup </option> <option value="1023"> Warehouse Pickup </option> <option value="1013"> Special Delivery </option>';

                    BindTable(result.list, dropdown);
                }
            }
        }
    });
}

function BindTable(data, dropdown) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableRow(data, dropdown);
    content += '</tbody>';
    $("#divTable").append(content);
  //  $.fn.dataTable.moment('DD/MM/YY');
    $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1,
        "aaSorting": [[ 1, "desc" ]],
        "bDestroy": true
    });
   // $('.txtRequiedDate').datepicker({ dateFormat: 'dd-M-yy' });
    $(function () {
        $(".txtRequiedDate").datepicker(
        {
            beforeShowDay: function (d) {
              var  dmy = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
               // var day = d.getDay();
              return [(dmy != "23-12-2019" && dmy != "24-12-2019" && dmy != "25-12-2019" && dmy != "26-12-2019" && dmy != "30-12-2019" && dmy != "31-12-2019" && dmy != "1-1-2020")];
            }
        });
    });

    content11 += TableHeader1();
    content11 += '<tbody>';
    content11 += TableRow1(data);
    content11 += '</tbody></table>';
}

function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
            '<tr>' +
            '<th></th>' +
            '<th>Date</th>' +
            '<th>Invoice No</th>' +
            '<th>Ref. No</th>' +
            '<th>Customer Name</th>' +
            '<th>Suburb</th>' +
            '<th>POSTCODE</th>' +
            '<th>Item Code</th>' +
            '<th>Qty</th>' +
            '<th>Box</th>' +
            '<th>Delivery</th>' +
            '<th>Required Date</th>' +
            '<th>Tracking</th>' +
            '<th>Manifest Price</th>' +
            '<th>Special Instruction</th>' +
             '</tr>' +
        '</thead>';
    return content;
}

function TableRow(result, DeliveryMethod) {
    $("#divTable").empty();
    let content = '', trcolor ='';
    if (result.length > 0) {
        var olist = result;
        $(olist).each(function (index, element) {
            let btn = '';
            if (element.Comment == "Yes") {
                trcolor = 'style="background-color:#FF69B4 !important;"';
                btn = 'disabled';
            } else { trcolor = ''; btn = '';}
            content += '<tr ' + trcolor + '>' +
                '<td class="checkbox-column"><input type="checkbox" ' + btn + ' class="uniform checkList"><input type="hidden" value="' + element.SaleDetId + '" /></td>' +
                '<td class="SaleId">' + element.DueDate + '<input type="hidden" value="' + element.SaleId + '" /></td>' +
                '<td class="IHeadId">' + element.InvoiceNo + '<input type="hidden" value="' + element.IHeadId + '" /></td>' +
                '<td>' + element.RefNo +  '</td>' +
                '<td class="CustomerId">' + element.CustomerName + '<input type="hidden" value="' + element.CustomerId + '" /></td>' +
                '<td>' + element.City + '</td>' +
                '<td>' + element.PostalCode + '</td>' +
                '<td class="ShipVia">' + element.IHeadCode + '<input type="hidden" value="' + element.ShipVia + '" /></td>' +
                '<td class="SaleQty">' + element.SaleQty + '</td>' +
                '<td class="Box">' + element.Box + '</td>' +
                '<td><select id="ddlDeliveryMethod' + index + '" class="span12 ddlDeliveryMethod">' + DeliveryMethod + '</select></td>' +
                '<td><input type="text" id="txtRequiedDate' + index + '"  Value="' + element.RequiedDate + '" style="width: 90px;" class="span12 txtRequiedDate" /></td>' +
                '<td><input type="text" id="txtTrakingNo' + index + '"  Value="" style="width: 85px;" class="span12 txtTrakingNo" /></td>' +
                '<td><input type="number" id="txtManifestPrice' + index + '"  Value="" style="width: 65px;" class="span12 txtManifestPrice" /></td>' +
                '<td><input type="text" id="txtSpecialInstruction' + index + '"  Value="" class="span12 txtSpecialInstruction" /></td>' +
                //'<td><input type="button" class="btn btn-primary despatch" id="' + element.SaleId + '" style="width: 65px;" value="Booking" /></td>' +
               
        '</tr>';
        });
    }

    return content;
}


$(document).off('click', '#btnSave').on('click', '#btnSave', function () {

    if (SaveValidation() == true) {

        var objList = GetSaveObject();
        var urlpath = base + Controller + "/SaveAwating";
        $.ajax({
            beforeSend: function () { $.blockUI(); },
            complete: function () { $.unblockUI(); },
            type: "POST",
            url: urlpath,
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            data: JSON.stringify({ "objList": objList }),
            success: function (result) {
                if (result.IsSessionOut != null) {
                    $.pnotify({ text: result.IsSessionOut, type: 'info' });
                    return false;
                } else if (result.Error != null && result.Error != "") {
                    $.pnotify({ text: result.Error, type: 'error' });
                    return false;
                } else {
                    $.pnotify({ text: 'Booking Completed', type: 'success' });
                    Loaddatatable();
                }
            }
        });

    }

});

function SaveValidation() {
    let valid = true;
    var tCheck = $($("#demo-dtable-04 tbody tr").find('.checkList').is(':checked')).length;
    if (tCheck == 0) {
        $.pnotify({ text: 'Please Checked Sale Invoice. !', type: 'info' });
        valid = false;
        return valid;
    }

    $("#demo-dtable-04 tbody tr").each(function () {
        let checkItem = $(this).find('.checkList').is(':checked');
        if (checkItem) {
            
            let DeliveryMethod = $(this).find('.ddlDeliveryMethod').val();
            let shipVia = $(this).find('.ShipVia input[type=hidden]').val();
            let requiedDate = $(this).find('.txtRequiedDate').val(); 
            let traking = $(this).find('.txtTrakingNo').val();

            if (DeliveryMethod == "-1" || DeliveryMethod == undefined) {
                $.pnotify({ text: 'Select Carrier Name. ! ', type: 'info' });
                valid = false
                return valid;

            }
            if ((DeliveryMethod != "1013") && (DeliveryMethod != "1014")) {

                if ((DeliveryMethod == "5" || (shipVia == "1002")) && requiedDate == "") {
                    $.pnotify({ text: "Required Date Requried !", type: 'error' });
                    $(this).find('.txtRequiedDate').focus();
                    valid = false;
                    return valid;
                }

                if ((DeliveryMethod != "5") && (shipVia != "1002")) {
                    if (traking == '') {
                        $(this).find('.txtTrakingNo').css({ 'border': '1px solid red' });
                        $.pnotify({ text: 'Tracking No Requried !', type: 'error' });
                        $(this).find('.txtTrakingNo').focus();
                        valid = false;
                        return valid;
                    } else { $(this).find('.txtTrakingNo').css({ 'border': '1px solid #aaa' }); }
                }
            }
        }
    });
    return valid;
}

function GetSaveObject() {
    let obj = [];
    $("#demo-dtable-04 tbody tr").each(function () {
        let checkItem = $(this).find('.checkList').is(':checked');
        if (checkItem) {
            let aobj = {
                "SaleDetId": $(this).find('.checkbox-column input[type=hidden]').val(),
                "SaleId": $(this).find('.SaleId input[type=hidden]').val(),
                "CustomerId": $(this).find('.CustomerId input[type=hidden]').val(),
                "IHeadId": $(this).find('.IHeadId input[type=hidden]').val(),
                "ShipVia": $(this).find('.ShipVia input[type=hidden]').val(),
                "SaleQty": $(this).find('.SaleQty').text(),
                "Box": $(this).find('.Box').text(),
                "InvoiceNo": $(this).find('.IHeadId').text(),
                "DeliveryMethod": $(this).find('.ddlDeliveryMethod').val(),
                "RequiedDate": $(this).find('.txtRequiedDate').val(),
                "TrakingNumber": $(this).find('.txtTrakingNo').val(),
                "ManifestPrice": $(this).find('.txtManifestPrice').val(),
                "SpecialInstruction": $(this).find('.txtSpecialInstruction').val()
            }
            obj.push(aobj);
        }
    });
    return obj;
}


//function validation(ddldelvery, requiedDate, traking, shipVia) {
//    debugger;
//    let valid = true;
//    if ($("#" + ddldelvery).val() == "-1") {
//        $.pnotify({ text: "Delivery Method Requried !", type: 'error' });
//        valid = false;
//        return valid;
//    }
//    if (($("#" + ddldelvery).val() == "5" || (shipVia == "1002")) && $("#" + requiedDate).val() == "") {
//        $.pnotify({ text: "Required Date Requried !", type: 'error' });
//        $("#" + requiedDate).focus();
//        valid = false;
//        return valid;
//    }
//    if (($("#" + ddldelvery).val() != "5") && (shipVia != "1002")) {
//        if ($("#" + traking).val() == '') {
//            $("#" + traking).css({ 'border': '1px solid red' });
//            $.pnotify({ text: 'Tracking No Requried !', type: 'error' });
//            $("#" + traking).focus();
//            valid = false;
//            return valid;
//        } else { $("#" + traking).css({ 'border': '1px solid #aaa' }); }
//    }
//    return valid;
//}

$(document).off('change', '.txtRequiedDate').on('change', '.txtRequiedDate', function () {
    
    if ($(this).val() !== '') {
        var ddlDel = $(this).closest("tr")[0].cells[10].childNodes[0].id;
        var shipVia = $(this).closest("tr")[0].cells[7].childNodes[1].value;
        let dd = $("#" + ddlDel).val();
        //if ((dd != '5' || dd == 'undefined') && (shipVia != "1002")) {
        //    $(this).val('');
        //}
       
    }
});

$(document).off('change', '.ddlDeliveryMethod').on('change', '.ddlDeliveryMethod', function () {
   
    if ($(this).val() !== '-1') {
        if ($(this).val() != '5') {
            var reqdate = $(this).closest("tr")[0].cells[11].childNodes[0].id;
            let req = $("#" + reqdate).val();
            if (req !== '' || req == 'undefined') {
                $("#" + reqdate).val('');
            }
        }

    }
});

$(document).on('change', ".ftDate", function () {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        Loaddatatable();
    }
});

$331('#btnCancel').on('click', function () {
    window.history.back();
});

// For Excel File download //

function TableHeader1() {
    let content = '';
    content = '<table id="tbldata" class="table table-bordered table-striped">';
    return content;
}

function TableRow1(result) {
    let content = '', trcolor = '', preInvoice = '';
    if (result != null) {
        content += '<tr>' +
            '<td>Date</td>' +
            '<td>Invoice No</td>' +
            '<td>Ref. No</td>' +
            '<td>Customer Name</td>' +
            '<td>Suburb</td>' +
            '<td>POSTCODE</td>' +
            '<td>Item Code</td>' +
            '<td>Qty</td>' +
            '<td>Box</td>' +
            '<td>Delivery</td>' +
            '<td>Required Date</td>' +
            '<td>Tracking</td>' +
            '<td>Manifest Price</td>' +
            '<td>Special Instruction</td>' +
       '</tr>';
        $(result).each(function (index, element) {
            let saleRecord = '', buyerName = '', surburb = '', postCode = '';
            let specialInstruction = '';
            if (element.Comment == "1") {
                specialInstruction = 'Pre-Sale Item';
            } else { specialInstruction=''; }
            content += '<tr>' +
                '<td>' + element.DueDate + '</td>' +
                '<td>' + element.InvoiceNo + '</td>' +
                '<td>' + element.RefNo + '</td>' +
                '<td>' + element.CustomerName + '</td>' +
                '<td>' + element.City + '</td>' +
                '<td>' + element.PostalCode + '</td>' +
                '<td>' + element.IHeadCode + '</td>' +
                '<td>' + element.SaleQty + '</td>' +
                '<td>' + element.Box + '</td>' +
                '<td></td>' +
                '<td>' + element.RequiedDate + '</td>' +
                '<td></td>' +
                '<td></td>' +
                '<td>' + specialInstruction + '</td>' +
        '</tr>';
        });
    }

    return content;
}


function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function doExcel1() {

    var t1 = '<html>' + content11 + '</html>';

    //var w = XLSX.read(t1, { type: 'array' });
    //var htmlstr = XLSX.write(w, { sheet: "Sheet1", type: 'binary', bookType: 'html' });
    var blob;
    wb = { SheetNames: [], Sheets: {} };
    var ws1 = XLSX.read(t1, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Awaiting Booking");
    wb.Sheets["Awaiting Booking"] = ws1;

    // console.log(ws1); console.log(ws2); console.log(wb);
    blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
        type: "application/octet-stream"
    });

    saveAs(blob, "Awaiting_Booking_" + $('#txtFrom').val() + "_To_" + $('#txtTo').val() + "_.xlsx");
}
