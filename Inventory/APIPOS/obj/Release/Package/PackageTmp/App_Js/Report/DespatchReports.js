var Controller = "DespatchReports", DespController = "DespatchCenter";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadReport();
    loadDeleveryMethod();
    $('#txtFromDate').datepicker({
        dateFormat: 'dd-M-yy',
      //  maxDate: new Date(),
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
        data: JSON.stringify({ "ReportParentId": 3 }),
        success: function (result) {
            LoadDropdown(result, $('#ddlReportName'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function loadDeleveryMethod() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + DespController + "/LoadDeliveryMethod",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result.listComboData, $('#ddlBookingMethod'));
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
    let reportName = $('#ddlReportName').val();
    if (reportName == 13) {
        fileName = "BookingList";
        return fileName;
    }
    if (reportName == 14) {
        fileName = "BookingStatus";
        return fileName;
    }
   if (reportName == 15) {
       fileName = "ItemPickingList";
        return fileName;
   }
   if (reportName == 16) {
       fileName = "LocalPickingList";
       return fileName;
   }
   if (reportName == 17) {
       fileName = "DeliveryRunSheet";
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
        "DeliveryMethodId": $('#ddlBookingMethod').val() == '-1' ? "" : $('#ddlBookingMethod').val(),
        "FromDate": $('#txtFromDate').val(),
        "ToDate": $('#txtToDate').val()
    };
    return obj;
}

$(".ReportType").on("click", function () {
    let ReportName = $('#ddlReportName').val();
    if (ReportName == "-1") {
        $.pnotify({ text: 'Select Report Name', type: 'error' });
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
    $('#ddlBookingMethod').val('-1').trigger('change');
}
$(document).off('change', '#ddlReportName').on('change', '#ddlReportName', function () {
    debugger;
    if ($(this).val() !== '-1') {
        if ($('#ddlReportName').val() != 13) {
            $("#divBookmethod").hide();
        } else { $("#divBookmethod").show(); }
    }
});
