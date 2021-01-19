var Controller = "PurchaseReports";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadReport();
    loadManufacturer();
    $('#txtFromDate').datepicker({
        dateFormat: 'dd-M-yy',
        maxDate: new Date(),
        onSelect: function (dateText) {
            $("#txtToDate").val('');
            $("#txtToDate").datepicker("destroy");
            $('#txtToDate').datepicker({
                dateFormat: 'dd-M-yy',
              //  maxDate: new Date(),
                minDate: new Date(dateText)
            });
        }
    });
});
function loadReport() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadReport",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "ReportParentId": 4 }),
        success: function (result) {
            LoadDropdown(result, $('#ddlReportName'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadManufacturer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "ItemEntry/loadManufacturer",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'error' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                LoadDropdown(result.listComboData, $('#ddlManufacturer'));
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
        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    $(id).append(content);
    //$(id).val('').trigger('change');
    $(id).select2();
}


//// Report Button ////
$("#btnCancel").on("click", function () {
    window.history.back();
});

function GetReportFileName() {
    let fileName = "";
    let reportName = $('#ddlReportName  option:selected').text();
    if (reportName == "Purchase Register") {
        fileName = "PurchaseRegister";
        return fileName;
    }
    if (reportName == "Item FOB Price") {
        fileName = "ItemFOBPrice";
        return fileName;
    }
    if (reportName == "Purchase Receive Status") {
        fileName = "PurchaseReceiveStatus";
        return fileName;
   }
   if (reportName == "Shipping Status") {
       fileName = "ShippingStatus";
       return fileName;
   }

    return fileName;
}
function getReportObject(printType, extension) {
    let reportFileName = GetReportFileName();
    var obj = {
        "ReportId": $('#ddlReportName').val(),
        "ReportName": $('#ddlReportName  option:selected').text(),
        "ReportFileName": reportFileName,//"CustomerByIDReport"
        "PrintType": printType,// "Excel",//"PDF",//"Excel",//"PDF",EXCELOPENXML,WORDOPENXML,CSV
        "FileExtention": extension,// ".pdf",// ".xls",
        "ManufacturerId": $('#ddlManufacturer').val() == '-1' ? "" : $('#ddlManufacturer').val(),
        "FromDate": $('#txtFromDate').val(),
        "ToDate": $('#txtToDate').val()
    };
    return obj;
}

$(".ReportType").on("click", function () {
    let ReportName = $('#ddlReportName').val();
    if (ReportName == "-1") {
        $.pnotify({ text: 'Select Report Name .!', type: 'info' });
        return false;
    }
    let printType = $(this).val();
    let extension = $(this).attr('data-extension');
    let obj = getReportObject(printType, extension);
    $.ajax({
        type: 'POST',
        url: base + Controller + "/SetReportSessionData",
        data: JSON.stringify(obj),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        // cache: false,
        success: function (result) {
            debugger;
            window.open(result, '_blank');
        },
        error: function () { console.log("error") }
    });

});

$("#btnRefresh").on("click", function () {
    ClearData();
});
///// Clear Data Start ////
function ClearData() {
    $('#ddlReportName').val('-1').trigger('change');
    $('#ddlManufacturer').val('-1').trigger('change');
}
$(document).off('change', '#ddlReportName').on('change', '#ddlReportName', function () {
    debugger;
    if ($(this).val() !== '-1') {
        //if ($('#ddlReportName').val() != 13) {
        //    $("#divBookmethod").hide();
        //} else { $("#divBookmethod").show(); }
    }
});
