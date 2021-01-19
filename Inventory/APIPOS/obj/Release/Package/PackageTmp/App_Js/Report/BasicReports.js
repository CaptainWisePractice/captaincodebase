var Controller = "BasicReports";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadReport();
    $("#divTable").hide();
});
function loadReport() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadReport",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "ReportParentId": 1 }),
        success: function (result) {
            LoadDropdown(result, $('#ddlReportName'));
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
    if (reportName == 1) {
        fileName = "ItemCategory";
        return fileName;
    }
    if (reportName == 2) {
        fileName = "Site";
        return fileName;
    }
    else if (reportName == 3) {
        fileName = "Location";
        return fileName;
    }
    else if (reportName == 4) {
        fileName = "AddressType";
        return fileName;
    }
    else if (reportName == 5) {
        fileName = "Customer";
        return fileName;
    }
    else if (reportName == 6) {
        fileName = "Supplier";
        return fileName;
    }
    else if (reportName == 7) {
        fileName = "ItemHead";
        return fileName;
    }
    else if (reportName == 8) {
        fileName = "Item";
        return fileName;
    }
    else if (reportName == 9) {
        fileName = "Manufacturer";
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
        "ItemHeadId": $('#ddlItemHead option:selected').val() == '-1' ? "" : $('#ddlItemHead option:selected').val(),
        "ItemId": $('#ddlItemName option:selected').val() == '-1' ? "" : $('#ddlItemName option:selected').val()
    };
    return obj;
}
$(".ReportType").on("click", function () {
    debugger;
    let ReportName = $('#ddlReportName  option:selected').text();
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
    $('#ddlItemName').val('-1').trigger('change');
    //$('#ddlItemName').get(0).options.length = 0;
}
///// Clear Data Start ////

/*  Add for pdf */

//$(document).off('change', '#ddlReportName').on('change', '#ddlReportName', function () {

//    if ($(this).val() !== "-1") {
//        loadData();
//    }
   
//});

function loadData() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/getLocation",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Session Out Please login again', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.list);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}



function ExportPdf() {
    debugger;
    var pdf = new jsPDF('p', 'pt', 'letter');

    pdf.cellInitialize();
    pdf.setFontSize(10);
    $.each($('#tbl tr'), function (i, row) {
        $.each($(row).find("td, th"), function (j, cell) {

            var txt = $(cell).text().trim() || " ";
            var width = (j == 4) ? 40 : 70; //make 4th column smaller
            pdf.cell(10, 50, width, 30, txt, i);
        });
    });

    pdf.save('sample-file.pdf');
}


$('#btnExcel').on('click', function () {
    debugger;
    if ($('#ddlReportName').val() !== "-1") {
        let printType = $(this).val();
        let extension = $(this).attr('data-extension');
        let obj = getReportObject(printType, extension);
        window.open(base + Controller + "/OpenFile?objParam=" + JSON.stringify(obj) + "&FileType=" + "Excel");
    }
    else { $.pnotify({ text: 'Select Report Name.!!', type: 'error' }); }
});

function getReportObject(printType, extension) {
    var obj = {
        "ReportId": $('#ddlReportName').val(),
        "ReportName": $('#ddlReportName  option:selected').text(),
        "PrintType": printType,// "Excel",//"PDF",//"Excel",//"PDF",EXCELOPENXML,WORDOPENXML,CSV
        "FileExtention": extension // ".pdf",// ".xls",
    };
    return obj;
}


