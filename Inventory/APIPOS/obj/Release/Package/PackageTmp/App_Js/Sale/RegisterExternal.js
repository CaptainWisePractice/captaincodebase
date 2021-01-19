// Gloval veriable
var count = 0, Controller = "ItemCheckOut", CurrentController = "Sales", CommonController = "Common", addIndex = 22, headList = [], locList = [], TaxList = [], SiteLocation = [], ReceivePayment = "ReceivePayments";
var curTabvalue = "All";
$("span#sidebar-toggle").trigger('click');
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
    //txtDatedFrom
   // $('.date').datepicker({ dateFormat: 'dd-M-yy' });
    $("#txtDatedFrom").datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() }).datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
    $("#txtDatedTo").datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() }).datepicker("setDate", new Date());
    GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
  
    $('#wizard-demo-Register .btn-toolbar').remove();
   // visibleHiddenAddress();

});
$(document).on('click', '.wizard-nav ul li', function (parameters) {
    var currrentTabText = $(this).text().trim();

    if (currrentTabText == 'All Sale') {
        curTabvalue = "All";
       // $(this).addClass('current');
    } else if (currrentTabText == 'Quotes') {
        curTabvalue = "Quotes";
       // $(this).addClass('current');
    }
    else if (currrentTabText == 'Open Invoices') {
        curTabvalue = "Open";
       // $(this).addClass('current');
    }
    else if (currrentTabText == 'Return & Credits') {
        curTabvalue = "Return";
      //  $(this).addClass('current');
    }
    else if (currrentTabText == 'Close Invoices') {
        curTabvalue = "Close";
       // $(this).addClass('current');
    }

    else if (currrentTabText == 'Canceled Invoices') {
        curTabvalue = "Cancel";
       // $(this).addClass('current');
    }
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
       
        GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }

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
    GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
});
$(document).on('change', ".registrationData", function (parameters) {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }
});

$(document).on('change', ".txtDatedTo", function (parameters) {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }
});


$(document).on('click', '.btnRedirect', function (parameters) {
   
    $("#btnSaveSale").text("Update");
    $("#addCust").prop("disabled", true);
    var invno = $(this).attr('data_InvoiceId');
    var trRow = $(this).closest('tr');
  //  var url = base + CurrentController + "/Sales?invNo=" + invno;
    var url = "";
    if (invno.length == 8) {
        url = base + "Sales/Sales?invNo=" + invno;
    }
    else {
        url = base + "SalesReturn/SalesReturn?invNo=" + invno;
    }
     window.open(url, '_blank');
   
   // location.href = url; //"@Url.Action('Sales', 'Sales', new {invNo= '125345' })"; //.replace("123456",s.toString());
});
function goToEdit(inv, trRow, tableId) {
  
    //$("#btnSaveSale").text("Update");
    //$("#addCust").prop("disabled", true);
   
    // var trRow = $(this);
    $("#" + tableId + " tr").css({ "background-color": "white" });
    $(trRow).css({ "background-color": "#cdcdcd" });
    $(trRow).css({ "color": "white" });
    var url = base + CurrentController + "/Sales?invNo=" + inv;
    location.href = url;

    //loadAllSaleData(inv);

}
function GetCustomerSaleData(curTabText, DateFrom, DateTo, customerId) {
    debugger;
    var obj = {
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
                                  '<th>Sale Outlet</th>' +
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
                $("#tblAllSale").dataTable({
                    "iDisplayLength": 100
                });
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
                                  '<th>Sale Outlet</th>' +
                                  '<th>Amount</th>' +
                                  '<th>Promised </th>' +
                                  '</tr>' +
                                  '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Quotes(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableQuotes").append(content);
                $("#tblQuotes").dataTable({
                    "iDisplayLength": 100
                });

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
                                  '<th>Sale Outlet</th>' +
                                  '<th>Amount</th>' +
                                  '<th>Amt Due </th>' +
                                  '<th>Promised </th>' +
                                  '</tr>' +
                                  '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Open(result.RegistrationSaleCustomer);
                debugger;
                content += '</tbody>';
                $("#divTableOpenInv").append(content);
                content = "";
                content = '<div><input style="margin-top:15px" type="button" class="btn btn-primary" value="Receive Payment" id="btnReceivePayment" />' +
               '<input type="text" id="txtDue"  Value="' + result.RegistrationSaleCustomer[0].TotalDue + '" style="float: right;width: 100px;margin-top: 8px;margin-right: 90px;" class="span12 txtDue" />' +
               '<input type="text" id="txtAmount"  Value="' + result.RegistrationSaleCustomer[0].TotalAmout + '" style="width: 100px;margin-top: 8px;float: right;" class="span12 txtAmount" /> </div>';
                $("#divTableOpenInv").append(content);
                content = "";
                content = '<input type="button" class="btn btn-primary newSale" value="New Invoice" id="btnNewInvoice" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);

                $("#tblOpen").dataTable({
                    "iDisplayLength": 100
                });
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
                                    '<th>Sale Outlet</th>' +
                                    '<th>Amount</th>' +
                                    '<th> Date Closed </th>' +
                                    '</tr>' +
                                    '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Close(result.RegistrationSaleCustomer);
                debugger;
                content += '</tbody>';
                $("#divTableCloseInv").append(content);
                content = "";
                content = '<div><input type="text" id="txtAmount"  Value="' + result.RegistrationSaleCustomer[0].TotalDue + '" style="float: right;width: 100px;margin-top: 8px;margin-right: 135px;" class="span12 txtAmount" />' +
                '</div>';
                $("#divTableCloseInv").append(content);

                $("#tblClose").dataTable({
                    "iDisplayLength": 100
                });
                content = "";
                content = '<input type="button" class="btn btn-primary newSale" value="New Sale" id="btnNewSale" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);
            }

            else if (curTabText == 'Cancel') {
                $("#divTableCancelInv").empty();
                content = '';
                content += '<table class="table table-striped" id="tblCancel">' +
                             '<thead>' +
                                    '<tr>' +
                                   '<th style="width:35px;"></th>' +
                                    '<th>Date</th>' +
                                    '<th>Invoice No</th>' +
                                    '<th>Reference No</th>' +
                                    '<th>Customer</th>' +
                                    '<th>Sale Outlet</th>' +
                                    '<th>Amount</th>' +
                                    '<th> Due Amount </th>' +
                                    '<th> Cancel Date</th>' +
                                    '</tr>' +
                                    '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Cancel(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableCancelInv").append(content);
                //content = "";
                //content = '<input style="margin-top:15px" type="button" class="btn btn-primary newSale" value="Pay Refund" id="btnNewSale" />' +
                //    '<input style="margin-top:15px" type="button" class="btn btn-primary" value="Apply To Sale" id="btnApplyToSale" />';
                //$("#divTableReturnCredits").append(content);
                $("#tblCancel").dataTable({
                    "iDisplayLength": 100
                    
                });


                content = "";
                content = '<input type="button" class="btn btn-primary" value="New Sale" id="btnNewSale" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);
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
                                    '<th>Sale Outlet</th>' +
                                    '<th>Amount</th>' +
                                    '<th> Amt Due </th>' +
                                    '<th> Promised </th>' +
                                    '</tr>' +
                                    '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Return(result.RegistrationSaleCustomer);
                content += '</tbody>';
                $("#divTableReturnCredits").append(content);
                //content = "";
                //content = '<input style="margin-top:15px" type="button" class="btn btn-primary newSale" value="Pay Refund" id="btnNewSale" />' +
                //    '<input style="margin-top:15px" type="button" class="btn btn-primary" value="Apply To Sale" id="btnApplyToSale" />';
                //$("#divTableReturnCredits").append(content);
                $("#tblReturn").dataTable({
                    "iDisplayLength": 100
                    
                });


                content = "";
                content = '<input type="button" class="btn btn-primary" value="New Sale" id="btnNewSale" />' +
                          '<input type="button" class="btn btn-danger" value="Close" id="btnCloseRegis" />';
                $("#btnGrid").empty();
                $("#btnGrid").append(content);
            }

        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Data Load Wrong', type: 'error' });
        }
    });
}

$(document).on('click', '#btnNewSale', function myfunction() {
    var baseUrl = base + 'Sales/Sales';
    window.location.href = baseUrl;
});
$(document).on('click', '#btnCloseRegis', function myfunction() {
    window.history.back();
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
                '<td>' + e.SaleOutlateName + '</td>' +
                '<td> $ ' + e.Amount + '</td>' +
                '<td> $ ' + e.AmuntDue + '</td>' +
                '<td>' + e.Status + '</td>' +

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
                '<td>' + e.SaleOutlateName + '</td>' +
                '<td> $ ' + e.Amount + '</td>' +
                '<td> $ ' + e.AmuntDue + '</td>' +
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
                '<td>' + e.SaleOutlateName + '</td>' +
                '<td> $ ' + e.Amount + '</td>' +
                '<td> $ ' + e.AmuntDue + '</td>' +
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
                '<td>' + e.SaleOutlateName + '</td>' +
                '<td> $ ' + e.Amount + '</td>' +
                '<td>' + e.DateClosed + '</td>' +

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
                '<td>' + e.SaleOutlateName + '</td>' +
                '<td> $ ' + e.Amount + '</td>' +
                '<td>' + e.Promised + '</td>' +

        '</tr>';
        });
    }
    return content;
}
function TableInitialRow_Cancel(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, e) {
            var inv = e.InvoiceNo.trim();
            content += '<tr ondblclick=goToEdit("' + inv + '",this,"tblCancel")>' +
                '<td style="width:35px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceId="' + e.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + e.InvoiceDate + '</td>' +
                '<td>' + e.InvoiceNo + '</td>' +
                '<td>' + e.customerPONo + '</td>' +
                '<td>' + e.Customer + '</td>' +
                '<td>' + e.SaleOutlateName + '</td>' +
                '<td> $ ' + e.Amount + '</td>' +
                '<td> $ ' + e.AmuntDue + '</td>' +
                '<td>' + e.DateClosed + '</td>' +

        '</tr>';
        });
    }
    return content;
}

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
        GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }

});


$(document).off('change', '#txtRegistrationCustomerName').on("change", "#txtRegistrationCustomerName", function (event) {
    if ($("#hdInvoiceCustomerId").val() != "") {
        if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
            GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
        }
    }
});

