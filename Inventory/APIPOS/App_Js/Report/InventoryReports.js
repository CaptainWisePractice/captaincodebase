var Controller = "InventoryReports";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
var LocationController = "Location";
var itemArry = [];
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadReport();
    loadSite();
    $("#divSiteName").show();
    $("#divItemMove").hide();
    $("#divDate").hide();
    loadManufacture();
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
});

function loadReport() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadReport",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "ReportParentId": 6 }),
        success: function (result) {
            LoadDropdown(result, $('#ddlReportName'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}
function loadSite() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + LocationController + "/loadWarehouse",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            LoadDropdown(result.listComboData, $('#ddlSiteName'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadManufacture() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "ItemEntry/loadManufacturer",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            debugger
            LoadDropdown(result.listComboData, $('#ddlManufacture'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function LoadDropdown(result, id) {
    
    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    $(id).append(content);
    $(id).select2();
}

$("#btnCancel").on("click", function () {
    window.history.back();
});

function GetReportFileName() {
    let fileName = "";
    let reportName = $('#ddlReportName  option:selected').text();
    if (reportName == "Available Inventory Location") {
        fileName = "AvailableInventoryLocation";
        return fileName;
    }
    if (reportName == "Landing Warehouse Summary") {
        fileName = "LandingWarehouseSummary";
        return fileName;
    }
    if (reportName == "Landing Warehouse Detail") {
        fileName = "LandingWarehouseDetail";
        return fileName;
    }
    if (reportName == "Item Selling Price") {
        fileName = "ItemSellingPrice";
        return fileName;
    }
    if (reportName == "Available Inventory") {
        fileName = "WarehouseWiseStockList";
        return fileName;
    }
    if (reportName == "Available Inventory Details") {
        fileName = "AvailableInventoryDetails";
        return fileName;
    }
    if (reportName == "Available Inventory Summary") {
        fileName = "AvailableInventorySummary";
        return fileName;
    }

    if (reportName == "Item Moving Report") {
        fileName = "ItemMovingReport";
        return fileName;
    }

    if (reportName == "Price Analysis Report") {
        fileName = "PriceAnalysisReport";
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
        "CustomerId": $('#ddlSiteName').val() == '-1' ? "" : $('#ddlSiteName').val(),
        "SiteName": reportFileName == "ItemMovingReport" ? $('#ddlManufacture').val() == '-1' ? "All Manufacturer" : $('#ddlManufacture option:selected').text() : $('#ddlSiteName option:selected').text() == '-- Select --' ? "All Site" : $('#ddlSiteName option:selected').text(),
        "ManufacturerId": $('#ddlManufacture').val() == '-1' ? "" : $('#ddlManufacture').val(),
        "ItemHeadId": $('#ddlItemHead').val() == '-1' ? "" : $('#ddlItemHead').val(),
        "FromDate": $('#txtFromDate').val(),
        "ToDate": $('#txtToDate').val(),
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
    $('#ddlSiteName').val('-1').trigger('change');
    $('#ddlItemName').val('-1').trigger('change');
    $('#ddlManufacture').val('-1').trigger('change');
    $('#txtFromDate').val('');
    $('#txtToDate').val('');
}

$(document).off('change', '#ddlReportName').on('change', '#ddlReportName', function () {
    let ReportName = $('#ddlReportName  option:selected').text();
    if ($(this).val() !== '-1') {
        if (ReportName != 'Item Moving Report') {
            if (ReportName == 'Price Analysis Report') {
                $("#divSiteName").hide();
                $("#divItemMove").hide();
                $("#divDate").hide();
            }else{
                $("#divSiteName").show();
                $("#divItemMove").hide();
                $("#divDate").hide();
            }
        }
    else {
           
        $("#divItemMove").show(); $("#divDate").show(); $("#divSiteName").hide();
        if (itemArry != null && itemArry.length == 0) {
            loadItemHead();
        } else { LoadDropdown(itemArry, $('#ddlItemHead')); }
    }
    ClearDataMovingField();
}

});

function loadItemHead() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "ItemEntry/loadItemHead",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            itemArry = [];
            LoadDropdown(result.listComboData, $('#ddlItemHead'));
            itemArry = result.listComboData;
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

$(document).off('change', '#ddlManufacture').on('change', '#ddlManufacture', function () {
    if ($(this).val() !== '-1') {
        loadItemHeadManufactWise();
    } else { LoadDropdown(itemArry, $('#ddlItemHead')); }
});

function loadItemHeadManufactWise() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "PurchaseOrder/loadItemHead",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "ManufacturerId": $("#ddlManufacture").val() }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                debugger
                if (result.listComboData != null) {
                    LoadDropdown(result.listComboData, $('#ddlItemHead'));
                }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function ClearDataMovingField() {
    $('#ddlSiteName').val('-1').trigger('change');
    $('#ddlItemHead').val('-1').trigger('change');
    $('#ddlManufacture').val('-1').trigger('change');
    $('#txtFromDate').val('');
    $('#txtToDate').val('');
}
