var Controller = "ExportFile", salecontent = '', customercontent = '';
$("span#sidebar-toggle").trigger('click');
$(document).ready(function () {
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

//$("#btnExport").on("click", function ()
$(document).off('click', '#btnExport').on('click', '#btnExport', function () {
    debugger
    let ReportName = $('#ddlExportFileName').val();
    if (ReportName == "-1") {
        $.pnotify({ text: 'Select File Name .!', type: 'error' });
        return false;
    }

    if ($('#txtFromDate').val() == "" || $('#txtToDate').val() == "") {
        $.pnotify({ text: 'Input From or To Date .!', type: 'error' });
            return false;
        }

    var urlpath = base + Controller + "/ExportFileData";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        //async: false,
        url: urlpath,
        salecontentType: "application/json;charset=utf-8",
        dataType: "JSON",
      //  data: JSON.stringify({ "IHeadId": headId }),
        data: JSON.stringify({ "operation": ReportName, "FromDate": $('#txtFromDate').val(), "Todate": $('#txtToDate').val() }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                if (result.listExportFile !=null) {
                    BindTableSale(result.listExportFile);
                } else {
                    $.pnotify({ text: 'No Data Found .!', type: 'info' });
                }
            }
        }
    });

});


function BindTableSale(data) {
    salecontent = '';
    salecontent += TableHeader();
    salecontent += '<tbody>';
    salecontent += SaleTableRow(data);
    salecontent += '</tbody> </table>';
    SaledoExcel();
}

function BindTableCustomer(data) {
    customercontent = '';
    customercontent += TableHeader();
    customercontent += '<tbody>';
    customercontent += CustomerTableRow(data);
    customercontent += '</tbody> </table>';
    customerdoExcel();
}

function TableHeader() {
    let salecontent = '';
    salecontent = '<table id="demo-dtable-04" class="table table-striped">';
       //'<thead>' +
       //       '<tr>' +
       //       '<th >Co./Last Name</th>' +
       //        '<th >First Name</th>' +
       //        '<th >Addr 1 - Line 1</th>' +
       //        '<th >Addr 1 - Line 2</th>' +
       //        '<th >Addr 1 - Line 3</th>' +
       //        '<th >Addr 1 - Line 4</th>' +
       //        '<th >Inclusive</th>' +
       //        '<th >Invoice No.</th>' +
       //        '<th >Date</th>' +
       //        '<th >Customer PO</th>' +
       //        '<th >Ship Via</th>' +
       //        '<th >Delivery Status</th>' +
       //        '<th >Item Number</th>' +
       //        '<th >Quantity</th>' +
       //        '<th >Description</th>' +
       //        '<th >Price</th>' +
       //        '<th >Discount</th>' +
       //        '<th >Total</th>' +
       //        '<th >Job</th>' +
       //        '<th >Comment</th>' +
       //        '<th >Journal Memo</th>' +
       //        '<th >Salesperson Last Name</th>' +
       //        '<th >Salesperson First Name</th>' +
       //        '<th >Shipping Date</th>' +
       //        '<th >Referral Source</th>' +
       //        '<th >Tax Code</th>' +
       //        '<th >Tax Amount</th>' +
       //        '<th >Freight Amount</th>' +
       //        '<th >Freight Tax Code</th>' +
       //        '<th >Freight Tax Amount</th>' +
       //        '<th >Sale Status</th>' +
       //        '<th >Terms - Payment is Due</th>' +
       //        '<th >- Discount Days</th>' +
       //        '<th >- Balance Due Days</th>' +
       //        '<th >- % Discount</th>' +
       //        '<th >- % Monthly Charge</th>' +
       //        '<th >Amount Paid</th>' +
       //        '<th >Payment Method</th>' +
       //        '<th >Payment Notes</th>' +
       //        '<th >Name on Card</th>' +
       //        '<th >Card Number</th>' +
       //        '<th >Authorisation Code</th>' +
       //        '<th >BSB</th>' +
       //        '<th >Account Number</th>' +
       //        '<th >Drawer/Account Name</th>' +
       //        '<th >Cheque Number</th>' +
       //        '<th >Category</th>' +
       //        '<th >Card ID</th>' +
       //        '<th >Record ID</th>' +
       //       '</tr>' +
       //       '</thead>';
    return salecontent;
}

function SaleTableRow(result) {
    let salecontent = '';
    if (result != null) {
        //salecontent += '<tr>' +
        //     '<td >{}</td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '<td ></td>' +
        //     '</tr>';

        salecontent += '<tr>' +
               '<td >Co./Last Name</td>' +
               '<td >First Name</td>' +
               '<td >Addr 1 - Line 1</td>' +
               '<td >Addr 1 - Line 2</td>' +
               '<td >Addr 1 - Line 3</td>' +
               '<td >Addr 1 - Line 4</td>' +
               '<td >Inclusive</td>' +
               '<td >Invoice No.</td>' +
               '<td >Date</td>' +
               '<td >Customer PO</td>' +
               '<td >Ship Via</td>' +
               '<td >Delivery Status</td>' +
               '<td >Item Number</td>' +
               '<td >Quantity</td>' +
               '<td >Description</td>' +
               '<td >Price</td>' +
               '<td >Discount</td>' +
               '<td >Total</td>' +
               '<td >Job</td>' +
               '<td >Comment</td>' +
               '<td >Journal Memo</td>' +
               '<td >Salesperson Last Name</td>' +
               '<td >Salesperson First Name</td>' +
               '<td >Shipping Date</td>' +
               '<td >Referral Source</td>' +
               '<td >Tax Code</td>' +
               '<td >Tax Amount</td>' +
               '<td >Freight Amount</td>' +
               '<td >Freight Tax Code</td>' +
               '<td >Freight Tax Amount</td>' +
               '<td >Sale Status</td>' +
               '<td >Terms - Payment is Due</td>' +
               '<td >- Discount Days</td>' +
               '<td >- Balance Due Days</td>' +
               '<td >- % Discount</td>' +
               '<td >- % Monthly Charge</td>' +
               '<td >Amount Paid</td>' +
               '<td >Payment Method</td>' +
               '<td >Payment Notes</td>' +
               '<td >Name on Card</td>' +
               '<td >Card Number</td>' +
               '<td >Authorisation Code</td>' +
               '<td >BSB</td>' +
               '<td >Account Number</td>' +
               '<td >Drawer/Account Name</td>' +
               '<td >Cheque Number</td>' +
               '<td >Category</td>' +
               '<td >Card ID</td>' +
               '<td >Record ID</td>' +
               '</tr>';

        $(result).each(function (index, element) {

            salecontent += '<tr>' +
                '<td >' + element.LastName + '</td>' + // LastName
               '<td >' + element.FirstName + '</td>' + //First Name
               '<td >' + element.DeliveryAddress + '</td>' + // Addr 1 - Line 1
               '<td >' + element.DeliveryAddress + '</td>' + // Addr 1 - Line 2
               '<td ></td>' + // Addr 1 - Line 3
               '<td ></td>' + // Addr 1 - Line 4
               '<td >' + element.InvoiceType + '</td>' + // Inclusive
               '<td >' + element.InvoiceNo + '</td>' + // Invoice No.
               '<td >' + element.InvoiceDate + '</td>' + // Date
               '<td >' + element.LocName + '</td>' + // Customer PO
               '<td ></td>' + // Ship Via
               '<td ></td>' + // Delivery Status
               '<td >' + element.IHeadCode + '</td>' + // Item Number
               '<td >' + element.SaleQty + '</td>' + // Quantity
               '<td >' + element.IHeadName + '</td>' + // Description
               '<td >$' + element.SalePrice + '</td>' + // Price
               '<td >' + element.discount + '%</td>' + // Discount
               '<td >$' + element.SubTotal + '</td>' + // Total
               '<td ></td>' + // Job
               '<td >' + element.Comments + '</td>' +  // Comment
               '<td >' + element.ReferenceNo + '</td>' + // Journal Memo
               '<td >' + element.SalesPersonName + '</td>' + // Salesperson Last Name
               '<td ></td>' + // Salesperson First Name
               '<td ></td>' + // Shipping Date
               '<td >' + element.RefNo + '</td>' + // Referral Source
               '<td >' + element.TaxType + '</td>' + // Tax Code
               '<td >$' + element.tax + '</td>' + // Tax Amount
               '<td >$' + element.Freight + '</td>' + // Freight Amount
               '<td >' + element.TaxType + '</td>' + // Freight Tax Code
               '<td >$' + element.Freight + '</td>' + // Freight Tax Amount
               '<td >I</td>' + // Sale Status
               '<td >' + element.Email + '</td>' + // Terms - Payment is Due
               '<td >' + element.Website + '</td>' + // - Discount Days
               '<td >' + element.CountryName + '</td>' + // - Balance Due Days
               '<td >0</td>' +  // - % Discount
               '<td >0</td>' +  // - % Monthly Charge
               '<td >$' + element.PaidToday + '</td>' + // Amount Paid
               '<td >' + element.DeliveryMethod + '</td>' + // Payment Method
               '<td ></td>' + // Payment Notes
               '<td ></td>' + // Name on Card
               '<td ></td>' + // Card Number
               '<td ></td>' + // Authorisation Code
               '<td ></td>' + // BSB
               '<td ></td>' + // Account Number
               '<td ></td>' + // Drawer/Account Name
               '<td ></td>' + // Cheque Number
               '<td ></td>' + // Category
               '<td >*None</td>' + // Card ID
               '<td >7001</td>' + //Record ID
        '</tr>';
        });
    }
    return salecontent;
}

function CustomerTableRow(result) {
    let salecontent = '';
    if (result != null) {
        salecontent += '<tr>' +
             '<td >{}</td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '<td ></td>' +
             '</tr>';


        salecontent += '<tr>' +
               '<td >Co./Last Name</td>' +
               '<td >First Name</td>' +
               '<td >Addr 1 - Line 1</td>' +
               '<td >Addr 1 - Line 2</td>' +
               '<td >Addr 1 - Line 3</td>' +
               '<td >Addr 1 - Line 4</td>' +
               '<td >Inclusive</td>' +
               '<td >Invoice No.</td>' +
               '<td >Date</td>' +
               '<td >Customer PO</td>' +
               '<td >Ship Via</td>' +
               '<td >Delivery Status</td>' +
               '<td >Item Number</td>' +
               '<td >Quantity</td>' +
               '<td >Description</td>' +
               '<td >Price</td>' +
               '<td >Discount</td>' +
               '<td >Total</td>' +
               '<td >Job</td>' +
               '<td >Comment</td>' +
               '<td >Journal Memo</td>' +
               '<td >Salesperson Last Name</td>' +
               '<td >Salesperson First Name</td>' +
               '<td >Shipping Date</td>' +
               '<td >Referral Source</td>' +
               '<td >Tax Code</td>' +
               '<td >Tax Amount</td>' +
               '<td >Freight Amount</td>' +
               '<td >Freight Tax Code</td>' +
               '<td >Freight Tax Amount</td>' +
               '<td >Sale Status</td>' +
               '<td >Terms - Payment is Due</td>' +
               '<td >- Discount Days</td>' +
               '<td >- Balance Due Days</td>' +
               '<td >- % Discount</td>' +
               '<td >- % Monthly Charge</td>' +
               '<td >Amount Paid</td>' +
               '<td >Payment Method</td>' +
               '<td >Payment Notes</td>' +
               '<td >Name on Card</td>' +
               '<td >Card Number</td>' +
               '<td >Authorisation Code</td>' +
               '<td >BSB</td>' +
               '<td >Account Number</td>' +
               '<td >Drawer/Account Name</td>' +
               '<td >Cheque Number</td>' +
               '<td >Category</td>' +
               '<td >Card ID</td>' +
               '<td >Record ID</td>' +
               '</tr>';

        $(result).each(function (index, element) {

            salecontent += '<tr>' +
                '<td >' + element.LastName + '</td>' + // LastName
               '<td >' + element.FirstName + '</td>' + //First Name
               '<td >' + element.DeliveryAddress + '</td>' + // Addr 1 - Line 1
               '<td >' + element.DeliveryAddress + '</td>' + // Addr 1 - Line 2
               '<td ></td>' + // Addr 1 - Line 3
               '<td ></td>' + // Addr 1 - Line 4
               '<td >' + element.InvoiceType + '</td>' + // Inclusive
               '<td >' + element.InvoiceNo + '</td>' + // Invoice No.
               '<td >' + element.InvoiceDate + '</td>' + // Date
               '<td >' + element.LocName + '</td>' + // Customer PO
               '<td ></td>' + // Ship Via
               '<td ></td>' + // Delivery Status
               '<td >' + element.IHeadCode + '</td>' + // Item Number
               '<td >' + element.SaleQty + '</td>' + // Quantity
               '<td >' + element.IHeadName + '</td>' + // Description
               '<td >$' + element.SalePrice + '</td>' + // Price
               '<td >' + element.discount + '%</td>' + // Discount
               '<td >$' + element.SubTotal + '</td>' + // Total
               '<td ></td>' + // Job
               '<td >' + element.Comments + '</td>' +  // Comment
               '<td >' + element.ReferenceNo + '</td>' + // Journal Memo
               '<td >' + element.SalesPersonName + '</td>' + // Salesperson Last Name
               '<td ></td>' + // Salesperson First Name
               '<td ></td>' + // Shipping Date
               '<td >' + element.RefNo + '</td>' + // Referral Source
               '<td >' + element.TaxType + '</td>' + // Tax Code
               '<td >$' + element.tax + '</td>' + // Tax Amount
               '<td >$' + element.Freight + '</td>' + // Freight Amount
               '<td >' + element.TaxType + '</td>' + // Freight Tax Code
               '<td >$' + element.Freight + '</td>' + // Freight Tax Amount
               '<td >I</td>' + // Sale Status
               '<td >' + element.Email + '</td>' + // Terms - Payment is Due
               '<td >' + element.Website + '</td>' + // - Discount Days
               '<td >' + element.CountryName + '</td>' + // - Balance Due Days
               '<td >0</td>' +  // - % Discount
               '<td >0</td>' +  // - % Monthly Charge
               '<td >$' + element.PaidToday + '</td>' + // Amount Paid
               '<td >' + element.DeliveryMethod + '</td>' + // Payment Method
               '<td ></td>' + // Payment Notes
               '<td ></td>' + // Name on Card
               '<td ></td>' + // Card Number
               '<td ></td>' + // Authorisation Code
               '<td ></td>' + // BSB
               '<td ></td>' + // Account Number
               '<td ></td>' + // Drawer/Account Name
               '<td ></td>' + // Cheque Number
               '<td ></td>' + // Category
               '<td >*None</td>' + // Card ID
               '<td >7001</td>' + //Record ID
        '</tr>';
        });
    }
    return salecontent;
}

function ExportTable() {
    $("table").tableExport({
        headings: true,                    // (Boolean), display table headings (th/td elements) in the <thead>
        footers: true,                     // (Boolean), display table footers (th/td elements) in the <tfoot>
        formats: ["xls", "csv", "txt"],    // (String[]), filetypes for the export
        fileName: "id",                    // (id, String), filename for the downloaded file
        bootstrap: true,                   // (Boolean), style buttons using bootstrap
        position: "well",                // (top, bottom), position of the caption element relative to table
        ignoreRows: null,                  // (Number, Number[]), row indices to exclude from the exported file
        ignoreCols: null,                 // (Number, Number[]), column indices to exclude from the exported file
        ignoreCSS: ".tableexport-ignore"   // (selector, selector[]), selector(s) to exclude from the exported file
    });
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function SaledoExcel() {
   
    var t1 = '<html>' + salecontent + '</html>';
    var blob;
    wb = { SheetNames: [], Sheets: {} };
    var ws1 = XLSX.read(t1, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Sheet1");
    wb.Sheets["Sheet1"] = ws1;

    blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
        type: "application/octet-stream"
    });

    saveAs(blob, "SERVSALE_" + $('#txtFromDate').val() + "_" + $('#txtToDate').val() + ".xlsx");
}

function customerdoExcel() {

    var t1 = '<html>' + customercontent + '</html>';
    var blob;
    wb = { SheetNames: [], Sheets: {} };
    var ws1 = XLSX.read(t1, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Sheet1");
    wb.Sheets["Sheet1"] = ws1;

    blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
        type: "application/octet-stream"
    });

    saveAs(blob, "CUSTOMER_" + $('#txtFromDate').val() + "_" + $('#txtToDate').val() + ".xlsx");
}


$("#btnRefresh").on("click", function () {
    ClearData();
});
///// Clear Data Start ////
function ClearData() {
    $('#ddlExportFileName').val('-1').trigger('change');
    $('#txtFromDate').val('');
    $('#txtToDate').val('');
}

$(document).off('change', '#ddlExportFileName').on('change', '#ddlExportFileName', function () {

    if ($(this).val() !== '-1') {
  
    }
});
