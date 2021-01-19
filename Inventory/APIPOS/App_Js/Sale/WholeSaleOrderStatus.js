var Controller = 'WholeSaleOrderStatus';
var content11 = '', content1 = '';
var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

$('#txtFromDate').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtFromDate').datepicker('setDate', firstDay);
$('#txtToDate').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtToDate').datepicker('setDate', lastDay);

//getDate();
LoadItem("In");
$('#txtFromDate').datepicker({
    dateFormat: 'dd-M-yy',
    // maxDate: new Date(),
    onSelect: function (dateText) {
        $("#txtToDate").val('');
        $("#txtToDate").datepicker("destroy");
        $('#txtToDate').datepicker({
            dateFormat: 'dd-M-yy',
            minDate: new Date(dateText)
        });
    }
});

$('#btnSearch').on('click', function () {
    if ($('#txtFromDate').val() != '' && $('#txtToDate').val() != '') {
        LoadItem("Sr");
    }
});

function LoadItem(type) {

    let FromDate = $('#txtFromDate').val();
    let ToDate = $('#txtToDate').val();

    var urlpath = "../WholeSaleOrderStatus/GetWholeSaleOrderStatus";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": FromDate, "ToDate": ToDate, "Type": type }),
        success: function (result) {

            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                $("#divTable").empty();
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                $("#divTable").empty();
                return false;
            } else {
                BindTable(result.list);
            }
        }
    });

}

function BindTable(data) {
    content11 = '', content1 = ''

    $("#divTable").empty();
    content1 += TableHeader1();
    content1 += '<tbody>';
    content1 += TableRow(data);
    content1 += '</tbody></table>';
    $("#divTable").append(content1);
    //  $("#tbldata").DataTable();
    $("#tbldata").rowspanizer({ vertical_align: 'middle' });


    content11 += TableHeader2();
    content11 += '<tbody>';
    content11 += TableRow1(data);
    content11 += '</tbody></table>';

}

function TableHeader1() {

    let content = '';
    content = '<table id="tbldata" class="table table-bordered table-striped">' +
       '<thead style="background-color: #AFA8FA;">' +
              '<tr>' +
                '<th>Customer</th>' +
                '<th>Order No</th>' +
                '<th>Invoice Number</th>' +
                '<th>Order Status</th>' +
                '<th>Date Added</th>' +
                '<th>Receiver Name</th>' +
                '<th>Delivery Adderess</th>' +
                '<th>City</th>' +
                '<th>Post Code</th>' +
                '<th>State</th>' +
                '<th>Phone</th>' +
                '<th>Item Code</th>' +
                '<th>Item Name</th>' +
                '<th>Quantity</th>' +
                '<th>Price/Unit</th>' +
                '<th>GST</th>' +
                '<th>Shipping Cost</th>' +
                '<th>Total</th>' +
                '<th>Invoice Status</th>' +
                '<th>Payment Option</th>' +
                '<th>Payment Status</th>' +
                '<th>Delivery Method</th>' +
                '<th>Tracking Number</th>' +
                '<th>Dispatch Date</th>' +
                '<th>Actual Freight</th>' +
                '<th>Notify Buyer</th>' +
                '<th>Added By</th>' +
                '<th>Note</th>' +
              '</tr>' +
              '</thead>';
    //'<tfoot>'+
    //'<tr> ' +
    //'<td><input type="hidden" class="InvoiceNo" value=""/></td>' +
    //'<td style="font-weight: bold; text-align: right;"> Sub Total : &nbsp;<input type="hidden" class="InvoiceNo" value=""/></td>' +
    //'<td><input type="hidden" class="InvoiceNo" value=""/></td>' +
    //'</tr>'+
    //'</tfoot>';
    return content;
}

function TableHeader2() {
    let content = '';
    content = '<table id="tbl" class="table table-bordered table-striped">';
    return content;
}

function TableRow(result) {
    let content = '', trcolor = '';
    if (result != null) {
        $(result).each(function (index, element) {

            if (element.Comment == "Despatched") {
                trcolor = 'style="background-color:#00800087 !important;"';
            }
            else if ((element.Comment == "Awaiting Despatch") && (element.SaleDetId != "0") && (element.ShipVia != "WS 3rd Party Pick Up")) {

                if ((element.Comment == "Awaiting Despatch") && (element.SaleDetId != "0") && (element.PaymentMode == "Prepaid") && (element.ImageLink == "Due")
                     && (element.ShipVia == "Pick Up Warehouse")) {
                    trcolor = '';
                } else {
                    trcolor = 'style="background-color:#ffff67 !important;"';
                }
            }

            else if (element.DayName == "Canceled") {
                debugger;
                trcolor = 'style="background-color:red !important;"';
                if (element.Comment != "Booked Cancel") {
                    element.Comment = "Canceled";
                }
            }
            else if (element.SaleDetId == "0") {
                trcolor = 'style="background-color:#FF69B4 !important;"';
            }
            else if ((element.ShipVia == "WS 3rd Party Pick Up") && (element.Comment == "Awaiting Despatch")) {
                trcolor = 'style="background-color:#FFA500 !important;"';
            }
            else { trcolor = ''; }

            content += '<tr ' + trcolor + '>' +
                '<td>' + element.CustomerName + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.RefNo + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.InvoiceNo + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.Comment + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.DueDate + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.CustomerId + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.Address + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.City + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.PostalCode + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.Box + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.LocId + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.IHeadCode + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.IHeadName + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.SaleQty + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.SalePrice + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.DeliveryMethod + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.Total + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.TotalAmount + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.SaleType + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.PaymentMode + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.ImageLink + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.ShipVia + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.TrakingNumber + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.RequiedDate + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.ManifestPrice + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.SalePerson + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.CreatedBy + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.SpecialInstruction + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +

        '</tr>';
        });
    }
    return content;
}

function TableRow1(result) {
    let content = '', trcolor = '', preInvoice = '';

    if (result != null) {
        content += '<tr>' +
                '<td>Customer</td>' +
                '<td>Order No</td>' +
                '<td>Invoice Number</td>' +
                '<td>Order Status</td>' +
                '<td>Date Added</td>' +
                '<td>Receiver Name</td>' +
                '<td>Delivery Adderess</td>' +
                '<td>City</td>' +
                '<td>Post Code</td>' +
                '<td>State</td>' +
                '<td>Phone</td>' +
                '<td>Item Code</td>' +
                '<td>Item Name</td>' +
                '<td>Quantity</td>' +
                '<td>Price/Unit</td>' +
                '<td>GST</td>' +
                '<td>Shipping Cost</td>' +
                '<td>Total</td>' +
                '<td>Invoice Status</td>' +
                '<td>Payment Option</td>' +
                '<td>Payment Status</td>' +
                '<td>Delivery Method</td>' +
                '<td>Tracking Number</td>' +
                '<td>Dispatch Date</td>' +
                '<td>Actual Freight</td>' +
                '<td>Notify Buyer</td>' +
                '<td>Added By</td>' +
                '<td>Note</td>' +
       '</tr>';
        $(result).each(function (index, element) {

            if (element.DayName == "Canceled") {
                if (element.Comment != "Booked Cancel") {
                    element.Comment = "Canceled";
                }
            }

            let customerName = '', refNo = '', createBy = '', createDate = '', recvName = '', delAddress = '',
                city = '', postCode = '', state = '', phone = '', gst = '', shipingCost = '', total = '',
                invoiceStatus = '', invoiceNo = '', payOption = '', payStatus = '', delMethod = '',
                bookingStatus = '', buyerNoti = '', comment = '';

            if (preInvoice != element.InvoiceNo) {
                customerName = element.CustomerName;
                refNo = element.RefNo; createBy = element.CreatedBy;
                createDate = element.DueDate; recvName = element.CustomerId;
                delAddress = element.Address; city = element.City;
                postCode = element.PostalCode; state = element.Box;
                phone = element.LocId; gst = element.DeliveryMethod;
                shipingCost = element.Total; total = element.TotalAmount;
                invoiceStatus = element.SaleType; invoiceNo = element.InvoiceNo;
                payOption = element.PaymentMode; payStatus = element.ImageLink;
                delMethod = element.ShipVia; bookingStatus = element.SaleId;
                buyerNoti = element.SalePerson; comment = element.Comment;
                preInvoice = element.InvoiceNo;
            } //else { customerName = ''; refNo = '';}
            debugger;
            content += '<tr>' +
                '<td>' + customerName + '</td>' +
                '<td>' + refNo + '</td>' +
                '<td>' + invoiceNo + '</td>' +
                '<td>' + comment + '</td>' +
                '<td>' + createDate + '</td>' +
                '<td>' + recvName + '</td>' +
                '<td>' + delAddress + '</td>' +
                '<td>' + city + '</td>' +
                '<td>' + postCode + '</td>' +
                '<td>' + state + '</td>' +
                '<td>' + phone + '</td>' +
                '<td>' + element.IHeadCode + '</td>' +
                '<td>' + element.IHeadName + '</td>' +
                '<td>' + element.SaleQty + '</td>' +
                '<td>' + element.SalePrice + '</td>' +
                '<td>' + gst + '</td>' +
                '<td>' + shipingCost + '</td>' +
                '<td>' + total + '</td>' +
                '<td>' + invoiceStatus + '</td>' +
                '<td>' + payOption + '</td>' +
                '<td>' + payStatus + '</td>' +
                '<td>' + delMethod + '</td>' +
                '<td>' + element.TrakingNumber + '</td>' +
                '<td>' + element.RequiedDate + '</td>' +
                '<td>' + element.ManifestPrice + '</td>' +
                '<td>' + buyerNoti + '</td>' +
                 '<td>' + createBy + '</td>' +
                '<td >' + element.SpecialInstruction + '</td>' +
        '</tr>';
        });
    }

    return content;
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function doExcel1() {

    var t1 = '<html>' + content11 + '</html>';

    //var w = XLSX.read(t1, { type: 'array' });
    //var htmlstr = XLSX.write(w, { sheet: "Sheet1", type: 'binary', bookType: 'html' });
    var blob;
    wb = { SheetNames: [], Sheets: {} };
    var ws1 = XLSX.read(t1, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Whole SalesOrder Status");
    wb.Sheets["Whole SalesOrder Status"] = ws1;

    // console.log(ws1); console.log(ws2); console.log(wb);
    blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
        type: "application/octet-stream"
    });

    saveAs(blob, "Whole_SalesOrder_Status_" + $('#txtFromDate').val() + "_To_" + $('#txtToDate').val() + "_.xlsx");
}

// #column3_search is a <input type="text"> element
//$('#txtSearch').on('keyup', function () {
//    var search = $(this).val();
//   
//    // Hide all table tbody rows
//    $('#tbldata tbody tr').hide();

//    // Count total search result
//    var len = $('#tbldata tbody td:contains("'+search+'")').length;
//    if(len > 0){
//        // Searching text in columns and show match row
//        $('#tbldata tbody td:contains("' + search + '")').each(function () {
//            // tr[i].style.display = "";
//            $(this).closest('tr').show();
//        });
//    }else{
//       // $('.notfound').show();
//    }
//});

$('#txtSearch').on('keyup', function () {
    // Declare variables
    var input, filter, table, tr, td, td1, td2, td3, td4, i, txtValue, txtValue1, txtValue2, txtValue3, txtValue4;
    input = document.getElementById("txtSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("tbldata");
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {

        td = tr[i].getElementsByTagName("td")[0];
        td1 = tr[i].getElementsByTagName("td")[1];
        td2 = tr[i].getElementsByTagName("td")[2];
        //td3 = tr[i].getElementsByTagName("td")[18];
        //td4 = tr[i].getElementsByTagName("td")[22];
        if (td != undefined && td1 != undefined && td2 != undefined) {
            debugger;
            txtValue = td.textContent || td.innerText;
            txtValue1 = td1.textContent || td1.innerText;
            txtValue2 = td2.textContent || td2.innerText;
            //txtValue3 = td3.textContent || td3.innerText;
            //txtValue4 = td4.textContent || td4.innerText;
            if ((txtValue.toUpperCase().indexOf(filter) > -1) || (txtValue1.toUpperCase().indexOf(filter) > -1)
             || (txtValue2.toUpperCase().indexOf(filter) > -1)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
});

