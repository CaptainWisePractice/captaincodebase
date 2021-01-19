var Controller = "SaleRelatedRepots";//// Controller Name Declare
var CommonController = "Common";//// Controller Name Declare
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
    loadReport();
    loadAllCustomer();
    loadItemCode();
    loadSalePerson();
    loadWareHouse();
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

    $("#divItemCode").hide();
    $("#divSalePerson").hide();
    $("#divSalesOutlet").hide();

});
function loadReport() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CommonController + "/loadReport",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "ReportParentId": 5 }),
        success: function (result) {
            LoadDropdown(result, $('#ddlReportName'));
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadAllCustomer() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller +"/loadAllCustomer",
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
                LoadDropdown(result.listComboData, $('#ddlCustomer'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadItemCode() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/loadItemHead",
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
                LoadDropdown(result.listComboData, $('#ddlItemCode'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadSalePerson() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "Sales/GetSalesPerason",
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
              
                LoadDropdown(result, $('#ddlSalePerson'));
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function loadWareHouse() {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + "Sales/loadSaleOutlet",
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
                LoadDropdown(result, $('#ddlWarehouse'));
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
    if (reportName == "Sales Customer Detail") {
        fileName = "SalesCustomerDetail";
        return fileName;
    }
    if (reportName == "Sales Customer Summary") {
        fileName = "SalesCustomerSummary";
        return fileName;
    }
    if (reportName == "Sales Item Detail") {
        fileName = "SalesItemDetail";
        return fileName;
   }
    if (reportName == "Sales Item Summary") {
        fileName = "SalesItemSummary";
       return fileName;
    }

    if (reportName == "Sales Register Detail [All Sales]") {
        fileName = "SalesRegisterDetailAllSales";
        return fileName;
    }
    if (reportName == "Sales Salesperson Detail") {
        fileName = "SalesSalespersonDetail";
        return fileName;
    }
    if (reportName == "Sales Salesperson Summary") {
        fileName = "SalesSalespersonSummary";
        return fileName;
    }
    if (reportName == "Aged Receivables Detail") {
        fileName = "AgedReceivablesDetail";
        return fileName;
    }
    if (reportName == "Aged Receivables Summary") {
        fileName = "AgedReceivablesSummary";
        return fileName;
    }
    if (reportName == "Available Inventory (Site)") {
        fileName = "WarehouseWiseStockList";
        return fileName;
    }

    if (reportName == "Gross Profit & Loss Statement") {
        fileName = "GrossProfitLossStatement";
        return fileName;
    }

    if (reportName == "Location Wise Sales Report") {
        fileName = "LocationWiseSalesReport";
        return fileName;
    }
    if (reportName == "Total Sales & Total COGS Details Ex GST") {
        fileName = "TotalSalesandCOGSDetailsIncGST";
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
        "CustomerId": $('#ddlCustomer').val() == '-1' ? "" : $('#ddlCustomer').val(),
        "ItemHeadId": $('#ddlItemCode').val() == '-1' ? "" : $('#ddlItemCode').val(),
        "SalePersonId": $('#ddlSalePerson').val() == '-1' ? "" : $('#ddlSalePerson').val(),
        "SiteName": $('#ddlWarehouse').val() == '-1' ? "" : $('#ddlWarehouse').val(),
        "FromDate": $('#txtFromDate').val(),
        "ToDate": $('#txtToDate').val()
    };
    return obj;
}

$(".ReportType").on("click", function () {
    debugger;
    let ReportName = $('#ddlReportName').val();
    if (ReportName == "-1") {
        $.pnotify({ text: 'Select Report Name .!', type: 'info' });
        return false;
    }

    if ($('#ddlReportName  option:selected').text() == "Gross Profit & Loss Statement") {
        if ($('#txtFromDate').val() == "" || $('#txtToDate').val() == "") {
            $.pnotify({ text: 'Input From or To Date .!', type: 'info' });
            return false;
        }
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
    $('#ddlCustomer').val('-1').trigger('change');
    $('#ddlItemCode').val('-1').trigger('change');
    $('#ddlSalePerson').val('-1').trigger('change');
    $('#ddlWarehouse').val('-1').trigger('change');
}
$(document).off('change', '#ddlReportName').on('change', '#ddlReportName', function () {
 
    if ($(this).val() !== '-1') {

        if ($('#ddlReportName  option:selected').text() == 'Sales Customer Detail' || $('#ddlReportName  option:selected').text() == 'Sales Customer Summary'
            || $('#ddlReportName  option:selected').text() == 'Aged Receivables Detail') {
            $("#divBookmethod").show();
            $("#divItemCode").hide();
            $("#divSalePerson").hide();
            $("#divSalesOutlet").hide();
            $('#ddlCustomer').val('-1').trigger('change');
        }

        if ($('#ddlReportName  option:selected').text() == 'Sales Register Detail [All Sales]'
            || $('#ddlReportName  option:selected').text() == 'Aged Receivables Summary') {
            $("#divBookmethod").hide();
            $("#divItemCode").hide();
            $("#divSalePerson").hide();
        }
        if ($('#ddlReportName  option:selected').text() == 'Sales Item Detail' || $('#ddlReportName  option:selected').text() == 'Sales Item Summary') {
            $("#divBookmethod").hide();
            $("#divItemCode").show();
            $("#divSalePerson").hide();
            $("#divSalesOutlet").hide();
            $('#ddlItemCode').val('-1').trigger('change');
        }
        if ($('#ddlReportName  option:selected').text() == 'Sales Salesperson Detail' || $('#ddlReportName  option:selected').text() == 'Sales Salesperson Summary') {
            $("#divBookmethod").hide();
            $("#divItemCode").hide();
            $("#divSalePerson").show();
            $("#divSalesOutlet").hide();
            $('#ddlSalePerson').val('-1').trigger('change');
        }

        if ($('#ddlReportName  option:selected').text() == 'Gross Profit & Loss Statement'
            || $('#ddlReportName  option:selected').text() == 'Location Wise Sales Report'
            || $('#ddlReportName  option:selected').text() == 'Total Sales & Total COGS Details Ex GST')
        {
            $("#divBookmethod").hide();
            $("#divItemCode").hide();
            $("#divSalePerson").hide();
            $("#divSalesOutlet").show();
            $('#ddlSalePerson').val('-1').trigger('change');
        }
    }
});
