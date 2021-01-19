// Gloval veriable

var curTabvalue = "All";

$(document).ready(function () {
    $wzd_form = $('#wizard-demo-Register').validate({ onsubmit: false });
    $('#wizard-demo-Register').wizard({
        onStepLeave: function (wizard, step) {
            return $wzd_form.form();
        },
        onBeforeSubmit: function () {
            return $wzd_form.form();
        }
    });
    
    $('#wizard-demo-Register .btn-toolbar').remove();
    //visibleHiddenAddress();

});
$(document).on('click', '.wizard-nav ul li', function (parameters) {
    var currrentTabText = $(this).text().trim();
    debugger;
    if (currrentTabText == 'All Sale') {
        curTabvalue = "All";
    } else if (currrentTabText == 'Quotes')
    {
        curTabvalue = "Quotes";
    }
    else if (currrentTabText == 'Open Invoices') {
        curTabvalue = "Open";
    }
    else if (currrentTabText == 'Return & Credits') {
        curTabvalue = "Return";
    }
    else if (currrentTabText == 'Close Invoices') {
        curTabvalue = "Close";
    }
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val());
    }
   
});

$(document).on('change', '#ddlRegisCustomerType', function (parameters) {
    if ($("#ddlRegisCustomerType").val() == 'AllCustomer') {
        $("#customerNameDiv").hide();
    } else {
        $("#customerNameDiv").show();
    }
    GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
});
$(document).on('change', ".registrationData", function(parameters) {
    if ($("#txtDatedFrom").val() !="" && $("#txtDatedTo").val() !="" ) {
        GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }
});


$(document).on('change', ".txtDatedTo", function (parameters) {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }
});

function GetCustomerSaleData(curTabText, DateFrom, DateTo, customerId) {
    var obj= {
        SearchText: curTabText,
        DateFrom: DateFrom,
        DateTo: DateTo,
        CustomerId: customerId == "" ? 0 : customerId
    }
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + CurrentController + "/GetCustomerSaleData",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (result) {
            var content = '';
            debugger;
            if (curTabText == 'All') {
                $("#divTableAllSale").empty();
                 content = '';
                content += '<table class="table table-striped" id="tblAllSale">' +
                           '<thead>' +
                                  '<tr>' +
                                '<th style="width:35px;"></th>' +
                                  '<th>Date</th>' +
                                  '<th>Invoice No</th>' +
                                  '<th>Reference No</th>' +
                                   '<th>Customer</th>' +
                                  '<th>Amount</th>' +
                                  '<th> Amt Due </th>' +
                                   '<th> Status </th>' +
                                  '</tr>' +
                                  '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Sale(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableAllSale").append(content);
                content = "";
                content = '<input type="button" class="btn btn-primary newSale" value="New Sale" id="btnNewSale" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);
                $("#tblAllSale").dataTable();
            } else if (curTabText == 'Quotes') {
                $("#divTableQuotes").empty();
                 content = '';
                content += '<table class="table table-striped" id="tblQuotes">' +
                           '<thead>' +
                                  '<tr>' +
                                  '<th style="width:35px;"></th>' +
                                  '<th>Date</th>' +
                                  '<th>Invoice No</th>' +
                                  '<th>Reference No</th>' +
                                   '<th>Customer</th>' +
                                  '<th>Amount</th>' +
                                  '<th> Promised </th>' +
                                  '</tr>' +
                                  '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Quotes(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableQuotes").append(content);
                $("#tblQuotes").dataTable();

                content = "";
                content = '<input type="button" class="btn btn-primary" value="New Quote" id="btnNewQuotes" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);
            }
            else if (curTabText == 'Open') {
                $("#divTableOpenInv").empty();
                 content = '';
                content += '<table class="table table-striped" id="tblOpen">' +
                           '<thead>' +
                                  '<tr>' +
                                '<th style="width:35px;"></th>' +
                                  '<th>Date</th>' +
                                  '<th>Invoice No</th>' +
                                  '<th>Reference No</th>' +
                                   '<th>Customer</th>' +
                                  '<th>Amount</th>' +
                                  '<th> Amt Due </th>' +
                                  '<th> Promised </th>' +
                                  '</tr>' +
                                  '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Open(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableOpenInv").append(content);
                content = "";
                content = '<input style="margin-top:15px" type="button" class="btn btn-primary" value="Receive Payment" id="btnReceivePayment" />';
                         
                $("#divTableOpenInv").append(content);
               

                content = "";
                content = '<input type="button" class="btn btn-primary newSale" value="New Invoice" id="btnNewInvoice" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);

                $("#tblOpen").dataTable();
            }
            else if (curTabText == 'Return') {
                $("#divTableReturnCredits").empty();
                 content = '';
                content += '<table class="table table-striped" id="tblReturn">' +
                             '<thead>' +
                                    '<tr>' +
                                   '<th style="width:35px;"></th>' +
                                    '<th>Date</th>' +
                                    '<th>Invoice No</th>' +
                                    '<th>Reference No</th>' +
                                     '<th>Customer</th>' +
                                    '<th>Amount</th>' +
                                    '<th> Amt Due </th>' +
                                    '<th> Promised </th>' +
                                    '</tr>' +
                                    '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Return(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableReturnCredits").append(content);
                content = "";
                content = '<input style="margin-top:15px" type="button" class="btn btn-primary newSale" value="Pay Refund" id="btnNewSale" />' +
                    '<input style="margin-top:15px" type="button" class="btn btn-primary" value="Apply To Sale" id="btnApplyToSale" />';
                $("#divTableReturnCredits").append(content);
                $("#tblReturn").dataTable();


                content = "";
                content = '<input type="button" class="btn btn-primary" value="New Sale" id="btnNewSale" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);
            }
            else if (curTabText == 'Close') {
                $("#divTableCloseInv").empty();
                 content = '';
                content += '<table class="table table-striped" id="tblClose">' +
                             '<thead>' +
                                    '<tr>' +
                                  '<th style="width:35px;"></th>' +
                                    '<th>Date</th>' +
                                    '<th>Invoice No</th>' +
                                    '<th>Reference No</th>' +
                                     '<th>Customer</th>' +
                                    '<th>Amount</th>' +
                                    '<th> Date Closed </th>' +
                                    '</tr>' +
                                    '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Close(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableCloseInv").append(content);
                $("#tblClose").dataTable();
                content = "";
                content = '<input type="button" class="btn btn-primary newSale" value="New Sale" id="btnNewSale" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);
            }
           
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

$(document).on('click', '#btnNewSale', function myfunction() {
    $("#myModalForRegistraton").css("display", "none");
    location.reload();
});
$(document).on('click', '#btnCloseRegis', function myfunction() {
    $("#myModalForRegistraton").css("display", "none");
});
///// Start Table ////


function TableInitialRow_Sale(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, e) {
            var inv = e.InvoiceNo.trim();
            content += '<tr ondblclick=goToEdit("' + inv + '",this,"tblAllSale")>' +
                //'<td style="width:35px;"><button type="button" style="border: none;background: none;" class="btnRedirect" id="btnView" data_InvoiceId="' + e.InvoiceNo + '"><img style="width: 18px;height: 18px;border: none;" src="../Content/Icon/RightArrow.png"></button></td>' +
                '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + e.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + e.InvoiceDate + '</td>' +
                '<td>' + e.InvoiceNo + '</td>' +
                '<td>' + e.customerPONo + '</td>' +
                '<td>' + e.Customer + '</td>' +
                '<td>' + e.Amount + '</td>' +
                '<td>' + e.AmuntDue + '</td>' +
                '<td>' + e.Status + '</td>' +
               
        '</tr>';
        });
    }
    return content;
}
function TableInitialRow_Quotes(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, e) {
            var inv = e.InvoiceNo.trim();
            content += '<tr ondblclick=goToEdit("' + inv + '",this,"tblQuotes")>' +
              '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + e.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + e.InvoiceDate + '</td>' +
                '<td>' + e.InvoiceNo + '</td>' +
                '<td>' + e.customerPONo + '</td>' +
                '<td>' + e.Customer + '</td>' +
                '<td>' + e.Amount + '</td>' +
                '<td>' + e.Promised + '</td>' +

        '</tr>';
        });
    }
    return content;
}
function TableInitialRow_Open(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, e) {
            var inv = e.InvoiceNo.trim();
            content += '<tr ondblclick=goToEdit("' + inv + '",this,"tblOpen")>' +
                 '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + e.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + e.InvoiceDate + '</td>' +
                '<td>' + e.InvoiceNo + '</td>' +
                '<td>' + e.customerPONo + '</td>' +
                '<td>' + e.Customer + '</td>' +
                '<td>' + e.Amount + '</td>' +
                '<td>' + e.AmuntDue + '</td>' +
                '<td>' + e.Promised + '</td>' +

        '</tr>';
        });
    }
    return content;
}
function TableInitialRow_Return(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, e) {
            var inv = e.InvoiceNo.trim();
            content += '<tr ondblclick=goToEdit("' + inv + '",this,"tblReturn")>' +
                '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + e.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + e.InvoiceDate + '</td>' +
                '<td>' + e.InvoiceNo + '</td>' +
                '<td>' + e.customerPONo + '</td>' +
                '<td>' + e.Customer + '</td>' +
                '<td>' + e.Amount + '</td>' +
                '<td>' + e.AmuntDue + '</td>' +
                '<td>' + e.Status + '</td>' +

        '</tr>';
        });
    }
    return content;
}
function TableInitialRow_Close(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, e) {
            var inv = e.InvoiceNo.trim();
            content += '<tr ondblclick=goToEdit("' + inv + '",this,"tblClose")>' +
                '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + e.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + e.InvoiceDate + '</td>' +
                '<td>' + e.InvoiceNo + '</td>' +
                '<td>' + e.customerPONo + '</td>' +
                '<td>' + e.Customer + '</td>' +
                '<td>' + e.Amount + '</td>' +
                '<td>' + e.DateClosed + '</td>' +

        '</tr>';
        });
    }
    return content;
}


$(document).off('keyup', '#txtRegistrationCustomerName').on("keyup", "#txtRegistrationCustomerName", function (event) {
   
    var input, filter, table, tr, td, i;
    input = document.getElementById("txtRegistrationCustomerName");
    filter = input.value.toUpperCase();
    table = document.getElementById("tblAllSale");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[4];
        if (td) {
            debugger;
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    //if ($("#txtRegistrationCustomerName").val() != "") {
    //$("#txtRegistrationCustomerName").autocomplete({
    //    source: function (request, response) {
    //        var aObj = {
    //            "SearchText": $("#txtRegistrationCustomerName").val()// ReviseReasonBulk
    //        };
    //        $.ajax({
    //            type: "POST",
    //            url: base + CurrentController + "/LoadInvoiceCustomerAutoComplete",
    //            contentType: "application/json;charset=utf-8",
    //            dataType: "JSON",
    //            data: JSON.stringify({ "aObj": aObj }),
    //            success: function (result) {
    //                if (result.IsSessionOut != null) {
    //                    notify('danger', "Your Session Is Over,Please Login Again");
    //                    return false;
    //                } else if (result.Error != null && result.Error != "") {
    //                    return false;
    //                } else {
    //                    debugger;
    //                    $("#hdInvoiceCustomerId").val("");
    //                    response(result.CustomerLoadAutoComplete);

    //                }
    //            }
    //        });

    //    },
    //    minLength: 2,
    //    select: function (event, ui) {
    //        $("#hdInvoiceCustomerId").val(ui.item.id);
    //        $("#txtRegistrationCustomerName").val(ui.item.label);
    //    }
    //});
    //} else {
    //    $("#hdInvoiceCustomerId").val("");
    //    GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    //}
});

//$(document).off('change', '#txtRegistrationCustomerName').on("change", "#txtRegistrationCustomerName", function (event) {
   
//    if ($("#hdInvoiceCustomerId").val() != "") {
//        if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
//            GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
//        }
//    }
//});
