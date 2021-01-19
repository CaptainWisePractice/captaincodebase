var count = 0, Controller = "InvoiceCancellation", CurrentController = "Sales", CommonController = "Common", addIndex = 22, headList = [], locList = [], TaxList = [], SiteLocation = [], ReceivePayment = "ReceivePayments";
$("span#sidebar-toggle").trigger('click');

$(document).ready(function () {
  
    $("#txtDatedFrom").datepicker({ dateFormat: 'dd-M-yy' }).datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
    $("#txtDatedTo").datepicker({ dateFormat: 'dd-M-yy' }).datepicker("setDate", new Date());
    GetInvoiceCancellationData($("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());

});



$(document).on('change', '#ddlRegisCustomerType', function (parameters) {
    if ($("#ddlRegisCustomerType").val() == 'AllCustomer') {
        $("#customerNameDiv").hide();
        $("#hdInvoiceCustomerId").val("");
        $("#txtRegistrationCustomerName").val("");
    } else {
        $("#customerNameDiv").show();
        $("#hdInvoiceCustomerId").val("");
        $("#txtRegistrationCustomerName").val("");
    }
    GetInvoiceCancellationData($("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
});

$(document).on('change', ".txtDated", function (parameters) {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        GetInvoiceCancellationData($("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }
});

$(document).off('keyup', '#txtRegistrationCustomerName').on("keyup", "#txtRegistrationCustomerName", function (event) {
   
    if ($("#txtRegistrationCustomerName").val() != "") {
        $("#txtRegistrationCustomerName").autocomplete({
            source: function (request, response) {
                var aObj = {
                    "SearchText": $("#txtRegistrationCustomerName").val()// ReviseReasonBulk
                };
                $.ajax({
                    type: "POST",
                    url: base + CurrentController + "/LoadInvoiceCustomerAutoComplete",
                    contentType: "application/json;charset=utf-8",
                    dataType: "JSON",
                    data: JSON.stringify({ "aObj": aObj }),
                    success: function (result) {
                        if (result.IsSessionOut != null) {
                            notify('danger', "Your Session Is Over,Please Login Again");
                            return false;
                        } else if (result.Error != null && result.Error != "") {
                            return false;
                        } else {
                            $("#hdInvoiceCustomerId").val("");
                            response(result.CustomerLoadAutoComplete);

                        }
                    }
                });

            },
            minLength: 2,
            select: function (event, ui) {
                $("#hdInvoiceCustomerId").val(ui.item.id);
                $("#txtRegistrationCustomerName").val(ui.item.label);
            }
        });
    } else {
        $("#hdInvoiceCustomerId").val("");
        GetInvoiceCancellationData($("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }


});


$(document).off('change', '#txtRegistrationCustomerName').on("change", "#txtRegistrationCustomerName", function (event) {
    if ($("#hdInvoiceCustomerId").val() != "") {
        if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
            GetInvoiceCancellationData($("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
        }
    }
});


function GetInvoiceCancellationData(DateFrom, DateTo, customerId) {
    debugger;
    var obj = {
        DateFrom: DateFrom,
        DateTo: DateTo,
        CustomerId: customerId == "" ? 0 : customerId
    }
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetInvoiceCancellationData",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (result) {
            var content = '';
            debugger;
                $("#divTableSale").empty();
                content = '';
                content += '<table class="table table-striped" id="tblDespatchSale">' +
                           '<thead>' +
                                  '<tr>' +
                                  '<th>Invoice Date</th>' +
                                  '<th>Invoice No</th>' +
                                  '<th>Reference No</th>' +
                                  '<th>Customer</th>' +
                                  '<th>Invoice Amount</th>' +
                                  '<th>Due Amount </th>' +
                                  '<th style="width:45px;"></th>' +
                                  '</tr>' +
                                  '</thead>';
                content += '<tbody>';
                content += TableInit_Sale(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableSale").append(content);
                $("#tblDespatchSale").dataTable({
                    "iDisplayLength": 100
                   
                });
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Data Load Problem.', type: 'error' });
        }
    });
}

function TableInit_Sale(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, e) {
            var inv = e.InvoiceNo.trim();
            content += '<tr>' +
                '<td>' + e.InvoiceDate + '</td>' +
                '<td>' + e.InvoiceNo + '</td>' +
                '<td>' + e.customerPONo + '</td>' +
                '<td>' + e.Customer + '</td>' +
                '<td>' + e.Amount + '</td>' +
                '<td>' + e.AmuntDue + '</td>' +
                '<td><input type="button" class="btn btn-danger Invoicecancellation" id="' + e.InvoiceNo + '" style="width:100px;" value="Cancellation" /></td>' +
               // '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + e.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +

        '</tr>';
        });
    }
    return content;
}


$(document).off('click', '.Invoicecancellation').on('click', '.Invoicecancellation', function () {

    var Invoice = $(this)[0].id;
    var baseUrl = base + 'InvoiceCancellation/InvoiceCancel?Invoice=' + Invoice;
   // window.location.href = baseUrl;
    window.open(baseUrl, '_blank');

});