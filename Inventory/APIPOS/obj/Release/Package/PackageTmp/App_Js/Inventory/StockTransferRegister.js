var count = 0, Controller = "StockTransferRegister", FreightController = "FreightDespatch";
$("span#sidebar-toggle").trigger('click');


$(document).ready(function () {

    LoadTransferItem();
    LoadFromSite();
  

    $('#txtFromDate').datepicker({
        dateFormat: 'dd-M-yy',
        maxDate: new Date(),
        onSelect: function (dateText) {
            $("#txtToDate").val('');
            $("#txtToDate").datepicker("destroy");
            $('#txtToDate').datepicker({
                dateFormat: 'dd-M-yy',
                minDate: new Date(dateText)
            });
        }
    });

    //$('#txtFromDate').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    //$('#txtFromDate').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
    //$('#txtToDate').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
    //getDate();


  Loaddatatable("In");

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
    //  document.getElementById("txtFrom").value = date;
    document.getElementById("txtToDate").value = date;
}


function LoadTransferItem() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/LoadTransferItem",
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
                debugger;
                LoadDropdown(result, $('#ddlHead'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadFromSite() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "StockTransfer/LoadFromSite",
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
                LoadDropdown(result.listComboData, $('#ddlFromSite'));
                LoadDropdown(result.listComboData, $('#ddlToSite'));
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
    $(id).select2();
   

}

function Loaddatatable(type) {

   
    let IheadId = $("#ddlHead").val() == "-1" ? 0 : $("#ddlHead").val();
    let fromSite = $("#ddlFromSite").val() == "-1" ? 0 : $("#ddlFromSite").val();
    let toSite = $("#ddlToSite").val() == "-1" ? 0 : $("#ddlToSite").val();

    let hid = IheadId == null ? 0 : IheadId;
    let fsite = fromSite == null ? 0 : fromSite;
    let tsite = toSite == null ? 0 : toSite;
    let fromDate = $("#txtFromDate").val();
    let toDate = $("#txtToDate").val();
    var urlpath = base + Controller + "/GetStockTransferRegisterData";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "IheadId": hid, "fromSite": fsite, "toSite": tsite, "FromDate": fromDate, "Todate": toDate, "type": type }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $("#divTable").empty();
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $("#divTable").empty();
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.list);
            }
        }
    });
}

$('#btnSearch').on('click', function () {
    Loaddatatable("Sr");
});

function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableRow(data);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#demo-dtable-04').dataTable({
        "iDisplayLength": -1,
        "bDestroy": true
    });
}

function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
            '<tr>' +
            '<th ></th>' +
            '<th >Booking Date</th>' +
            '<th >Order No</th>' +
            '<th >Ref. No</th>' +
            '<th >From</th>' +
            '<th >To</th>' +
            '<th >Transaction Type</th>' +
            '<th >Required Delivery Date</th>' +
           // '<th >Delivery Date</th>' +
            '<th >Desp. By</th>' +
            '<th >Status</th>' +
             '</tr>' +
        '</thead>';
    return content;
}

function TableRow(result) {
    $("#divTable").empty();
    let content = '';
    if (result != null) {
        if (result.length > 0) {
            var olist = result;
            $(olist).each(function (index, element) {
                let color = '', btn = '', podlink = '', trcolor = '';
                if (element.Comment == "Awating Booking")
                {
                    element.Comment = "Awaiting Booking";
                    color = 'background-color: yellow;';
                }
                if (element.Comment == "Waiting Despatch")
                { color = 'background-color: red;'; }
                if (element.Comment == "Despatched")
                { color = 'background-color: green;'; btn = 'disabled'; }
                //else { color = 'background-color: red;'; }

                content += '<tr ' + trcolor + '>' +
                   '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + element.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                    '<td>' + element.DueDate + '</td>' +
                    '<td>' + element.InvoiceNo + '</td>' +
                    '<td>' + element.RefNo + '</td>' +
                    '<td>' + element.CustomerName + '</td>' +
                    '<td>' + element.City + '</td>' +
                    '<td>' + element.IHeadCode + '</td>' +
                    '<td>' + element.RequiedDate + '</td>' +
                  //  '<td>' + element.TrakingNumber + '</td>' +
                    '<td>' + element.LocId + '</a></td>' +
                    '<td style="' + color + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Comment + '</td>' +

            '</tr>';
            });
        }
    }
    return content;

}

//$(document).on('change', ".ftDate", function () {
//    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
//        Loaddatatable('From');
//    }
//});


$(document).on('click', '.btnRedirect', function (parameters) {
    var invno = $(this).attr('data_InvoiceId');
    var url = base + "StockTransfer/StockTransfer?invNo=" + invno;
    window.open(url, '_blank');
});

