var Controller = "SearchInvoice", curTabvalue = "Printed", invoiceNo = "", Term = "", email = "",outletId='';

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
    $('#wizard-demo-Register .btn-toolbar').remove();
    $("#txtDatedFrom").datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() }).datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
    $("#txtDatedTo").datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() }).datepicker("setDate", new Date());

    getInialData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#ddlSaleType").val(), $("#hfSearchTypeId").val());

    $('#tblPrinted').DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
});

$(document).on('click', '.wizard-nav ul li ', function (parameters) {
    
    var currrentTabText = $(this).text().trim();

    if (currrentTabText == 'To Be Printed') {
        curTabvalue = "Printed";
    } else if (currrentTabText == 'To Be Emailed') {
        curTabvalue = "Emailed";
    }
    //if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
    //    
    //    GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val());
    //}

});

function getInialData(curTabText, DateFrom, DateTo, ddlText,Id) {
    
    let saleType = $('#ddlSaleType').val();
    var obj = {
        SearchText: curTabText,
        DateFrom: DateFrom,
        DateTo: DateTo,
        Name: ddlText,
        CustomerId: Id == "" ? 0 : Id
    }
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/SearchSaleinvoiceNo",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (result) {
            var DataList = result.listSalesReports;
            var content = '';
            
            if (curTabText == 'Printed') {
                $("#divTblPrintInvoice").empty();
                content = '';
                content += '<table class="table table-striped" id="tblPrinted">' +
                           '<thead style="background-color: #a4b7ca">' +
                                  '<tr>' +
                                  '<th style="width:25px;"></th>' +
                                  '<th>Invoice No</th>' +
                                  '<th>Date</th>' +
                                  '<th>Customer</th>' +
                                  '<th>Reference No</th>' +
                                  '<th>Amount</th>' +
                                  '<th>Status</th>' +
                                  '<th>Mail Status</th>' +
                                  '<th>Send By</th>' +
                                  '</tr>' +
                                  '</thead>';
                content += '<tbody>';
                content += TableInitialRow_Printed(DataList[0]);
                content += '</tbody>';
                $("#divTblPrintInvoice").append(content);
                $('#tblPrinted').dataTable({
                    "iDisplayLength": -1
                });
            }
            else if (curTabText == 'Emailed') {

            }

        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function TableInitialRow_Printed(result) {
    let content = '';
    if (result != undefined) {
        $(result).each(function (index, e) {
            let sts = '';
            if (e.MailStatus == "") {
                sts = "Not Send";
            } else { sts = "Already Send -" + e.MailStatus; }

            content += '<tr>' +
                '<td class="checkbox-column"><input type="checkbox" id="checkList' + index + '" class="uniform checkList" ></td>' +
                '<td> <a href="https://www.captainwise.com.au/Sales/Sales?invNo=' + e.InvoiceNo + '" target="_blank">' + e.InvoiceNo + '<input type="hidden" value="' + e.SalesType + '" /></a></td>' +
                '<td>' + e.InvoiceDate + '<input type="hidden" value="' + e.Email + '" /></td>' +
                '<td>' + e.CustomerName + '<input type="hidden" value="' + e.CustomerId + '" /></td>' +
                '<td>' + e.ReferenceNo + '</td>' +
                '<td> $ ' + e.TotalAmount + '</td>' +
                '<td>' + e.Comments + '</td>' +
                '<td>' + sts + '</td>' +
                '<td>' + e.SendBy + '</td>' +
        '</tr>';
        });
    }
    return content;
}

$('#btnCancel').on('click', function () {
    window.history.back();
    //var baseUrl = base + "Home/Index";
    //window.location.href = baseUrl;
});

$(document).off('click', '.checkList').on('click', '.checkList', function () {
    
    let Id = $(this)[0].id;
    let tblRow = $(this).closest('tr');
    var incoice = tblRow[0].cells[1].textContent;
    Term = tblRow[0].cells[1].childNodes[1].children[0].value;//tblRow[0].cells[1].childNodes[1].value;
    email = tblRow[0].cells[2].childNodes[1].value;
    outletId = tblRow[0].cells[3].childNodes[1].value;
    let ischeck = $('#' + Id).is(":checked")
    if (ischeck === true) {
        $('.checkList').attr("checked", false)
        $('#' + Id).attr("checked", true)
        invoiceNo = incoice.trim();
    } else
    { $('.checkList').attr("checked", false); $('#' + Id).attr("checked", false); invoiceNo = ""; Term = ""; email = ""; outletId = ''; }

});

function SaveValidation() {
    let valid = true;
    var tCheck = $($("#tblPrinted tbody tr").find('.checkList').is(':checked')).length;
    if (tCheck == 0) {
        $.pnotify({ text: 'Please? Checked Sale Invoice ', type: 'error' });
        valid = false;
        return valid;
    }
    return valid;
}

$('#btnPrint').on('click', function () {
    if (SaveValidation() == true) {
       
        if (outletId == "1" || outletId == "2" || outletId == "10") {
            let url = base + "SalesReports/SaleInvoiceStore?Invoice=" + invoiceNo;
            window.open(url, '_blank');
            $('.checkList').attr("checked", false);
        }
        else {
            if (outletId == "12") {
                let url = base + "SalesReports/SaleFBInvoice?Invoice=" + invoiceNo;
                window.open(url, '_blank');
            } else {
                let url = base + "SalesReports/Index?Invoice=" + invoiceNo + "&Term=" + Term;
                window.open(url, '_blank');
                $('.checkList').attr("checked", false);
            }
        }
    }
});

$('#btnMail').on('click', function () {
    if (SaveValidation() == true) {
        // Local = SL-1810281001

        $.msgbox("Are you sure that you want to Mail Invoice ?", {
            type: "confirm",
            buttons: [
                { type: "submit", value: "Yes" },
                { type: "submit", value: "No" }
            ]
        }, function (result) {
            if (result == "Yes") {
               // email = "sayed108cse@gmail.com";  ////rahat@melbourniansfurniture.com.au   //sayed108cse@gmail.com
                if (email != "") {
                    // let invoice = "SL-1810281001";// Server ="SL-1811011001"; SendMail
                    $.ajax({
                        beforeSend: function () { $.blockUI(); },
                        complete: function () { $.unblockUI(); },
                        type: "POST",
                        url: base + "SalesReports/SendMailFromDB",
                        contentType: "application/json;charset=utf-8",
                        dataType: "JSON",
                        data: JSON.stringify({ "saleInvoice": invoiceNo, "term": Term, "email": email.trim(),"outletId":outletId }),
                        success: function (result) {
                            if (result.IsSessionOut != null) {
                                $.pnotify({ text: 'Session Out Please login again', type: 'info' });
                                return false;
                            }
                            if (result.Error != null) {
                                $.pnotify({ text: result.Error, type: 'error' });
                                return false;
                            } else {
                                $.pnotify({ text: result, type: 'info' });
                                $('.checkList').attr("checked", false);
                            }
                        },
                        error: function (a, b, c) {
                            $.pnotify({ text: 'Something Wrong', type: 'error' });
                        }
                    });
                } else { $.pnotify({ text: 'Customer E-mail Do Not Found !.', type: 'error' }); }
            }
            else if (result == "No") {
                $.pnotify({ text: "Cancel Mail Operation", type: 'info' });
                $('.checkList').attr("checked", false);
            }

        }
      );
    }
});

$(document).off('click', '#btnDelete').on('click', '#btnDelete', function () {
    if (SaveValidation() == true) {
        $.msgbox("Are you sure that you want to permanently delete ?", {
            type: "confirm",
            buttons: [
                { type: "submit", value: "Yes" },
                { type: "submit", value: "No" }
            ]
        }, function (result) {
            if (result == "Yes") {
                var urlpath = base + Controller + "/Delete";
                $.ajax({
                    beforeSend: function () { $.blockUI(); },
                    complete: function () { $.unblockUI(); },
                    type: "POST",
                    url: urlpath,
                    contentType: "application/json;charset=utf-8",
                    dataType: "JSON",
                    data: JSON.stringify({ "invoiceNo": invoiceNo }),
                    success: function (result) {
                        if (result.IsSessionOut != null) {
                            $.pnotify({ text: result.IsSessionOut, type: 'info' });
                            return false;
                        } else if (result.Error != null && result.Error != "") {
                            $.pnotify({ text: result.Error, type: 'error' });
                            return false;
                        } else {
                            $.pnotify({ text: 'Delete Successfully', type: 'success' });
                            getInialData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#ddlSaleType").val(), $("#hfSearchTypeId").val());
                        }
                    }
                });
            }
            else if (result == "No") {
                $.pnotify({ text: "Cancel Delete Operation", type: 'info' });
            }

        }
        );
    }
});

$(document).on('change', '#ddlSaleType', function (parameters) {
    
    if ($("#ddlSaleType").val() == 'Invoice') {
        $("#OthersDiv").hide();
        $("#hfSearchTypeId").val("");
        $("#txtSearchType").val("");
        getInialData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#ddlSaleType").val(), $("#hfSearchTypeId").val());
    } else {
        $("#OthersDiv").show();
        $("#hfSearchTypeId").val("");
        $("#txtSearchType").val("");
    }
   
});

$(document).on('change', "#txtDatedTo", function (parameters) {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        let f = $("#txtDatedFrom").val();
        let t = $("#txtDatedTo").val();
        var fdate = new Date(f);
        var tdate = new Date(t);
        var difference = tdate - fdate;
        if (difference >= 0) {
            getInialData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#ddlSaleType").val(), $("#hfSearchTypeId").val());
        } else {
            $.pnotify({ text: "To Date not correct.?", type: 'info' });
            $("#txtDatedTo").val('');
            $("#txtDatedTo").focus();
        }
    }
});

$(document).on('change', "#txtDatedFrom", function (parameters) {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        let f = $("#txtDatedFrom").val();
        let t = $("#txtDatedTo").val();
        var fdate = new Date(f);
        var tdate = new Date(t);
        var difference = tdate - fdate;
        if (difference >= 0) {
            getInialData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#ddlSaleType").val(), $("#hfSearchTypeId").val());
        } else {
            $.pnotify({ text: "From Date not correct.?", type: 'info' });
            $("#txtDatedFrom").val('');
            $("#txtDatedFrom").focus();
        }
    }
});

$(document).off('keyup', '#txtSearchType').on("keyup", "#txtSearchType", function (event) {
    if ($("#txtSearchType").val() != "") {
        $("#txtSearchType").autocomplete({
            source: function (request, response) {
                
                var obj = {
                    InvoiceNo: $("#txtSearchType").val(),
                    Name: $("#ddlSaleType").val()
                }

                $.ajax({
                    type: "POST",
                    url: base + Controller + "/LoadInvoiceTypeAutoComplete",
                    contentType: "application/json;charset=utf-8",
                    dataType: "JSON",
                    data: JSON.stringify({ "obj": obj }),
                    success: function (result) {
                        if (result.IsSessionOut != null) {
                            notify('danger', "Your Session Is Over,Please Login Again");
                            return false;
                        } else if (result.Error != null && result.Error != "") {
                            return false;
                        } else {
                            $("#hfSearchTypeId").val("");
                            response(result.ListAutoCpomplete);

                        }
                    }
                });

            },
            minLength: 2,
            select: function (event, ui) {
                
                $("#hfSearchTypeId").val(ui.item.id);
                let ss = ui.item.label;
                $this = $(this);
                setTimeout(function () {
                    $('#txtSearchType').val(ss);
                }, 1);
            }
        });
    } else {
        $("#hfSearchTypeId").val("");
      //  GetCustomerSaleData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#hdInvoiceCustomerId").val());
    }


});

$(document).off('change', '#txtSearchType').on("change", "#txtSearchType", function (event)
{
    if ($("#hfSearchTypeId").val() != "") {
        if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
            getInialData(curTabvalue, $("#txtDatedFrom").val(), $("#txtDatedTo").val(), $("#ddlSaleType").val(), $("#hfSearchTypeId").val());
        }
    }
});

