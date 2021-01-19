var Controller = 'BookingStatus';
var content11 = '',content1 = '';
var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

$('#txtFromDate').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtFromDate').datepicker('setDate', firstDay);
$('#txtToDate').datepicker({ dateFormat: 'dd-M-yy'});
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
   var urlpath = "../BookingStatus/GetBookingStatusDetails";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": FromDate, "ToDate": ToDate, "Type": type }),
        success: function (result) {
            debugger;
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
                '<th>Added By</th>' +
                '<th>Booking Date</th>' +
                '<th>Sales Record No</th>' +
                '<th>Buyer Name</th>' +
                '<th>Suburb</th>' +
                '<th>Post Code</th>' +
                '<th>Carrier</th>' +
                '<th>Tracking Number</th>' +
                '<th>Item Code</th>' +
                '<th>Item Name</th>' +
                '<th>Quantity</th>' +
                '<th>Box</th>' +
                '<th>Manifest Price</th>' +
                '<th>Dispatch Date</th>' +
                '<th>Dispatch By</th>' +
                '<th>Note</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableHeader2() {
    let content = '';
    content = '<table id="tbl" class="table table-bordered table-striped">';
    return content;
}


function TableRow(result) {
    let content = '', trcolor='';
    if (result != null) {
        $(result).each(function (index, element) {
            if (element.Comment == "Despatched") {
                trcolor = 'style="background-color:#00800087 !important;"';
            } else if (element.Comment == "Cancel") {
                trcolor = 'style="background-color:red !important;"';
            }
            else { trcolor = ''; }

            content += '<tr ' + trcolor + '>' +
                '<td>' + element.CreatedBy + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.DueDate + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.RefNo + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.CustomerName + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.City + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.PostalCode + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.LocId + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.TrakingNumber + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.IHeadCode + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.IHeadName + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' + 
                '<td>' + element.SaleQty + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.Box + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.DeliveryMethod + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.RequiedDate + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td >' + element.UpdatedBy + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
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
                '<td>Added By</td>' +
                '<td>Booking Date</td>' +
                '<td>Sales Record No</td>' +
                '<td>Buyer Name</td>' +
                '<td>Suburb</td>' +
                '<td>Post Code</td>' +
                '<td>Carrier</td>' +
                '<td>Tracking Number</td>' +
                '<td>Item Code</td>' +
                '<td>Item Name</td>' +
                '<td>Quantity</td>' +
                '<td>Box</td>' +
                '<td>Manifest Price</td>' +
                '<td>Dispatch Date</td>' +
                '<td>Dispatch By</td>' +
                '<td>Note</td>' +
       '</tr>';
        $(result).each(function (index, element) {
            let saleRecord = '',buyerName='', surburb ='',postCode='';
            if (preInvoice != element.InvoiceNo) {
                saleRecord = element.RefNo;
                buyerName = element.CustomerName; surburb = element.City;
                postCode = element.PostalCode;
                preInvoice = element.InvoiceNo;
            }
           
            content += '<tr>' +
                '<td>' + element.CreatedBy + '</td>' +
                '<td>' + element.DueDate + '</td>' +
                '<td>' + saleRecord + '</td>' +
                '<td>' + buyerName + '</td>' +
                '<td>' + surburb + '</td>' +
                '<td>' + postCode + '</td>' +
                '<td>' + element.LocId + '</td>' +
                '<td>' + element.TrakingNumber + '</td>' +
                '<td>' + element.IHeadCode + '</td>' +
                '<td>' + element.IHeadName + '</td>' +
                '<td>' + element.SaleQty + '</td>' +
                '<td>' + element.Box + '</td>' +
                '<td>' + element.DeliveryMethod + '</td>' +
                '<td>' + element.RequiedDate + '</td>' +
                '<td>' + element.UpdatedBy + '</td>' +
                '<td>' + element.SpecialInstruction + '</td>' +
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
    wb.SheetNames.push("Booking Status Details");
    wb.Sheets["Booking Status Details"] = ws1;

   // console.log(ws1); console.log(ws2); console.log(wb);
    blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
        type: "application/octet-stream"
    });

    saveAs(blob, "Booking_Status_Details_" + $('#txtFromDate').val() + "_To_" + $('#txtToDate').val() + "_.xlsx");
}

// #column3_search is a <input type="text"> element
//$('#txtSearch').on('keyup', function () {
//    var search = $(this).val();
//    debugger;
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
    var input, filter, table, tr, td, td1, td2, td3, i, txtValue, txtValue1, txtValue2, txtValue3;
    input = document.getElementById("txtSearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("tbldata");
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2]
        td1 = tr[i].getElementsByTagName("td")[3]
        td2 = tr[i].getElementsByTagName("td")[6]
        td3 = tr[i].getElementsByTagName("td")[7]
        if (td || td1 || td2) {
            txtValue = td.textContent || td.innerText;
            txtValue1 = td1.textContent || td1.innerText;
            txtValue2 = td2.textContent || td2.innerText;
            txtValue3 = td3.textContent || td3.innerText;
            if ((txtValue.toUpperCase().indexOf(filter) > -1) || (txtValue1.toUpperCase().indexOf(filter) > -1)
                || (txtValue2.toUpperCase().indexOf(filter) > -1) || (txtValue3.toUpperCase().indexOf(filter) > -1)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
});

