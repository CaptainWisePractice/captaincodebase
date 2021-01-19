var Controller = 'LocalDeliveryRunSheet';
var content11 = '', content21 = '', content31 = '', content41 = '', content51 = '', content61 = '', content71 = '';
var content1 = '', content2 = '', content3 = '', content4 = '', content5 = '', content6 = '', content7 = '';
$("span#sidebar-toggle").trigger('click');
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

//function getDate() {
//    var monthsArr = new Array();
//    // store month names into our array
//    monthsArr[0] = "Jan";
//    monthsArr[1] = "Feb";
//    monthsArr[2] = "Mar";
//    monthsArr[3] = "Apr";
//    monthsArr[4] = "May";
//    monthsArr[5] = "Jun";
//    monthsArr[6] = "Jul";
//    monthsArr[7] = "Aug";
//    monthsArr[8] = "Sep";
//    monthsArr[9] = "Oct";
//    monthsArr[10] = "Nov";
//    monthsArr[11] = "Dec";
//    var dayf = firstDay.getDate();
//    var dayt = lastDay.getDate();
//    var month = firstDay.getMonth();
//    var year = firstDay.getFullYear();
//    var fdate = dayf + "-" + monthsArr[month] + "-" + year;
//    var tdate = dayt + "-" + monthsArr[month] + "-" + year;
//    document.getElementById("txtFromDate").value = fdate;
//    document.getElementById("txtToDate").value = tdate;
//}

//loadItemHead();

//function loadItemHead() {
//    $.ajax({
//        beforeSend: function () { $.blockUI(); },
//        complete: function () { $.unblockUI(); },
//        type: "POST",
//        url: base + "ItemEntry/loadItemHead",
//        contentType: "application/json;charset=utf-8",
//        dataType: "JSON",
//        success: function (result) {
//            if (result.IsSessionOut != null) {
//                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
//                return false;
//            }
//            if (result.Error != null) {
//                $.pnotify({ text: result.Error, type: 'error' });
//                return false;
//            } else {
//                LoadDropdown(result.listComboData, $('#ddlHead'));
//            }
//        },
//        error: function (a, b, c) {
//            $.pnotify({ text: 'Something Wrong', type: 'error' });
//        }
//    });
//}

//// Dropdown load
function LoadDropdown(result, id) {

    $(id).get(0).options.length = 0;
    var content = '<option  value="-1">-- Select --</option>';
    $.each(result, function (i, obj) {
        content += '<option  value="' + obj.Value + '" >' + obj.DisplayName + '</option>';
    });
    id.append(content);
    id.val('-1').trigger('change');
}


$('#btnSearch').on('click', function () {
    if ($('#txtFromDate').val() != '' && $('#txtToDate').val() != '') {
        LoadItem("Sr");
    }
});

function LoadItem(type) {

   let FromDate = $('#txtFromDate').val();
   let ToDate = $('#txtToDate').val();
   var urlpath ="../LocalDeliveryRunSheet/GetLocalDeliveryRunSheetData";
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
    content11 = '', content21 = '', content31 = '', content41 = '', content51 = '', content61 = '', content71 = '';
    content1 = '', content2 = '', content3 = '', content4 = '', content5 = '', content6 = '', content7 = '';
    var mondaylst = $.grep(data,
           function (x) {
               if (x.DayName == "Monday") {
                   return x;
               }
           });
    var tuesdaylst = $.grep(data,
          function (x) {
              if (x.DayName == "Tuesday") {
                  return x;
              }
          });
    var wednesdaylst = $.grep(data,
         function (x) {
             if (x.DayName == "Wednesday") {
                 return x;
             }
         });
    var thursdaylst = $.grep(data,
         function (x) {
             if (x.DayName == "Thursday") {
                 return x;
             }
         });
    var fridaylst = $.grep(data,
         function (x) {
             if (x.DayName == "Friday") {
                 return x;
             }
         });
    var saturdaylst = $.grep(data,
         function (x) {
             if (x.DayName == "Saturday") {
                 return x;
             }
         });
    var sundaylst = $.grep(data,
         function (x) {
             if (x.DayName == "Sunday") {
                 return x;
             }
         });

    $("#MondayTable").empty();
    content1 += TableHeader1();
    content1 += '<tbody>';
    content1 += TableRow(mondaylst);
    content1 += '</tbody></table>';
    $("#MondayTable").append(content1);
    $("#tblMonday").rowspanizer({ vertical_align: 'middle' });
    content11 += TableHeader1();
    content11 += '<tbody>';
    content11 += TableRow1(mondaylst);
    content11 += '</tbody></table>';

    $("#TuesdayTable").empty();
    content2 += TableHeader2();
    content2 += '<tbody>';
    content2 += TableRow(tuesdaylst);
    content2 += '</tbody></table>';
    $("#TuesdayTable").append(content2);
    $("#tblTuesday").rowspanizer({ vertical_align: 'middle' });
    content21 += TableHeader2();
    content21 += '<tbody>';
    content21 += TableRow1(tuesdaylst);
    content21 += '</tbody></table>';

    $("#WednesdayTable").empty();
    content3 += TableHeader3();
    content3 += '<tbody>';
    content3 += TableRow(wednesdaylst);
    content3 += '</tbody</table>';
    $("#WednesdayTable").append(content3);
    $("#tblWednesday").rowspanizer({ vertical_align: 'middle' });
    content31 += TableHeader3();
    content31 += '<tbody>';
    content31 += TableRow1(wednesdaylst);
    content31 += '</tbody</table>';

    $("#ThursdayTable").empty();
    content4 += TableHeader4();
    content4 += '<tbody>';
    content4 += TableRow(thursdaylst);
    content4 += '</tbody></table>';
    $("#ThursdayTable").append(content4);
    $("#tblThursday").rowspanizer({ vertical_align: 'middle' });
    content41 += TableHeader4();
    content41 += '<tbody>';
    content41 += TableRow1(thursdaylst);
    content41 += '</tbody></table>';

    $("#FridayTable").empty();
    content5 += TableHeader5();
    content5 += '<tbody>';
    content5 += TableRow(fridaylst);
    content5 += '</tbody></table>';
    $("#FridayTable").append(content5);
    $("#tblFriday").rowspanizer({ vertical_align: 'middle' });
    content51 += TableHeader5();
    content51 += '<tbody>';
    content51 += TableRow1(fridaylst);
    content51 += '</tbody></table>';

    $("#SaturdayTable").empty();
    content6 += TableHeader6();
    content6 += '<tbody>';
    content6 += TableRow(saturdaylst);
    content6 += '</tbody></table>';
    $("#SaturdayTable").append(content6);
    $("#tblSaturday").rowspanizer({ vertical_align: 'middle' });
    content61 += TableHeader6();
    content61 += '<tbody>';
    content61 += TableRow1(saturdaylst);
    content61 += '</tbody></table>';

    $("#SundayTable").empty();
    content7 += TableHeader7();
    content7 += '<tbody>';
    content7 += TableRow(sundaylst);
    content7 += '</tbody></table>';
    $("#SundayTable").append(content7);
    $("#tblSunday").rowspanizer({ vertical_align: 'middle' });
    content71 += TableHeader7();
    content71 += '<tbody>';
    content71 += TableRow1(sundaylst);
    content71 += '</tbody></table>';


    //$("#DeliveryZoneTable").empty();
    //content7 += TableHeader7();
    //content7 += '<tbody>';
    //content7 += TableRow(sundaylst);
    //content7 += '</tbody></table>';
    //$("#DeliveryZoneTable").append(content7);


    //var tbl = $('#tbl').dataTable({
    //    "iDisplayLength": -1,
    //    "bDestroy": true
    //});
  //  new FixedHeader(tbl);
    //  $('#demo-dtable-04').dataTable();
}

function TableHeader1() {
    let content = '';
    content = '<table id="tblMonday" class="table table-bordered table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Booked By</th>' +
              '<th>Date</th>' +
              '<th>Invoice</th>' +
              '<th>Ref No</th>' +
              '<th>Point of Sale</th>' +
              '<th>Customer Name</th>' +
              '<th>Address</th>' +
              '<th>Suburb</th> ' +
              '<th>Phone</th> ' +
              '<th>ITEM</th>' +
              '<th>Item Name</th>' +
              '<th>Item Location</th>' +
              '<th>QTY</th>' +
              '<th>No Of Boxes</th>' +
              '<th>Total Box Qty</th>' +
              '<th>Special Instruction</th>' +
              '<th>Required Delivery Date</th>' +
              '<th>Delivery Cost</th>' +
              '<th>Tracking number</th>' +
              '<th>Notes</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableHeader2() {
    let content = '';
    content = '<table id="tblTuesday" class="table table-bordered table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Booked By</th>' +
              '<th>Date</th>' +
              '<th>Invoice</th>' +
              '<th>Ref No</th>' +
              '<th>Point of Sale</th>' +
              '<th>Customer Name</th>' +
              '<th>Address</th>' +
              '<th>Suburb</th> ' +
              '<th>Phone</th> ' +
              '<th>ITEM</th>' +
              '<th>Item Name</th>' +
              '<th>Item Location</th>' +
              '<th>QTY</th>' +
              '<th>No Of Boxes</th>' +
              '<th>Total Box Qty</th>' +
              '<th>Special Instruction</th>' +
              '<th>Required Delivery Date</th>' +
              '<th>Delivery Cost</th>' +
              '<th>Tracking number</th>' +
              '<th>Notes</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableHeader3() {
    let content = '';
    content = '<table id="tblWednesday" class="table table-bordered table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Booked By</th>' +
              '<th>Date</th>' +
              '<th>Invoice</th>' +
              '<th>Ref No</th>' +
              '<th>Point of Sale</th>' +
              '<th>Customer Name</th>' +
              '<th>Address</th>' +
              '<th>Suburb</th> ' +
              '<th>Phone</th> ' +
              '<th>ITEM</th>' +
              '<th>Item Name</th>' +
              '<th>Item Location</th>' +
              '<th>QTY</th>' +
              '<th>No Of Boxes</th>' +
              '<th>Total Box Qty</th>' +
              '<th>Special Instruction</th>' +
              '<th>Required Delivery Date</th>' +
              '<th>Delivery Cost</th>' +
              '<th>Tracking number</th>' +
              '<th>Notes</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableHeader4() {
    let content = '';
    content = '<table id="tblThursday" class="table table-bordered table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Booked By</th>' +
              '<th>Date</th>' +
              '<th>Invoice</th>' +
              '<th>Ref No</th>' +
              '<th>Point of Sale</th>' +
              '<th>Customer Name</th>' +
              '<th>Address</th>' +
              '<th>Suburb</th> ' +
              '<th>Phone</th> ' +
              '<th>ITEM</th>' +
              '<th>Item Name</th>' +
              '<th>Item Location</th>' +
              '<th>QTY</th>' +
              '<th>No Of Boxes</th>' +
              '<th>Total Box Qty</th>' +
              '<th>Special Instruction</th>' +
              '<th>Required Delivery Date</th>' +
              '<th>Delivery Cost</th>' +
              '<th>Tracking number</th>' +
              '<th>Notes</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableHeader5() {
    let content = '';
    content = '<table id="tblFriday" class="table table-bordered table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Booked By</th>' +
              '<th>Date</th>' +
              '<th>Invoice</th>' +
              '<th>Ref No</th>' +
              '<th>Point of Sale</th>' +
              '<th>Customer Name</th>' +
              '<th>Address</th>' +
              '<th>Suburb</th> ' +
              '<th>Phone</th> ' +
              '<th>ITEM</th>' +
              '<th>Item Name</th>' +
              '<th>Item Location</th>' +
              '<th>QTY</th>' +
              '<th>No Of Boxes</th>' +
              '<th>Total Box Qty</th>' +
              '<th>Special Instruction</th>' +
              '<th>Required Delivery Date</th>' +
              '<th>Delivery Cost</th>' +
              '<th>Tracking number</th>' +
              '<th>Notes</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableHeader6() {
    let content = '';
    content = '<table id="tblSaturday" class="table table-bordered table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Booked By</th>' +
              '<th>Date</th>' +
              '<th>Invoice</th>' +
              '<th>Ref No</th>' +
              '<th>Point of Sale</th>' +
              '<th>Customer Name</th>' +
              '<th>Address</th>' +
              '<th>Suburb</th> ' +
              '<th>Phone</th> ' +
              '<th>ITEM</th>' +
              '<th>Item Name</th>' +
              '<th>Item Location</th>' +
              '<th>QTY</th>' +
              '<th>No Of Boxes</th>' +
              '<th>Total Box Qty</th>' +
              '<th>Special Instruction</th>' +
              '<th>Required Delivery Date</th>' +
              '<th>Delivery Cost</th>' +
              '<th>Tracking number</th>' +
              '<th>Notes</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableHeader7() {
    let content = '';
    content = '<table id="tblSunday" class="table table-bordered table-striped">' +
       '<thead>' +
              '<tr>' +
              '<th>Booked By</th>' +
              '<th>Date</th>' +
              '<th>Invoice</th>' +
              '<th>Ref No</th>' +
              '<th>Point of Sale</th>' +
              '<th>Customer Name</th>' +
              '<th>Address</th>' +
              '<th>Suburb</th> ' +
              '<th>Phone</th> ' +
              '<th>ITEM</th>' +
              '<th>Item Name</th>' +
              '<th>Item Location</th>' +
              '<th>QTY</th>' +
              '<th>No Of Boxes</th>' +
              '<th>Total Box Qty</th>' +
              '<th>Special Instruction</th>' +
              '<th>Required Delivery Date</th>' +
              '<th>Delivery Cost</th>' +
              '<th>Tracking number</th>' +
              '<th>Notes</th>' +
              '</tr>' +
              '</thead>';
    return content;
}

function TableRow(result) {
    let content = '', trcolor='';
    if (result != null) {
        $(result).each(function (index, element) {

            var str = element.InvoiceNo;
            var res = str.charAt(0);
            if (element.Comment == "Despatched") {
                if (res == "M") {
                    trcolor = 'style="background-color:#b0ee6d !important;"';
                } else {
                    trcolor = 'style="background-color:#92d050 !important;"';
                }
            } else {
                if (res == "M") {
                    trcolor = 'style="background-color:#e0affe !important;"';
                } else {
                    trcolor = '';
                }
            }

           

            content += '<tr ' + trcolor + '>' +
                '<td>' + element.CreatedBy + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.DueDate + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.InvoiceNo + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.RefNo + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.SalePerson + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.CustomerName + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.Address + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.City + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.PostalCode + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.IHeadCode + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.IHeadName + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                 '<td>' + element.ImageLink + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.SaleQty + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.Box + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.LocId + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.SpecialInstruction + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.RequiedDate + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td>' + element.DeliveryMethod + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td >' + element.TrakingNumber + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
                '<td >' + element.CustomerId + '<input type="hidden" class="InvoiceNo" value="' + element.InvoiceNo + '"/></td>' +
        '</tr>';
        });
    }
    return content;
}

function TableRow1(result) {
    let content = '', trcolor = '';
    if (result != null) {
        content += '<tr>' +
              '<td>Booked By</td>' +
              '<td>Date</td>' +
              '<td>Invoice</td>' +
              '<td>Ref No</td>' +
              '<td>Point of Sale</td>' +
              '<td>Customer Name</td>' +
              '<td>Address</td>' +
              '<td>Suburb</td> ' +
              '<td>Phone</td> ' +
              '<td>ITEM</td>' +
              '<td>Item Name</td>' +
              '<td>Item Location</td>' +
              '<td>QTY</td>' +
              '<td>No Of Boxes</td>' +
              '<td>Total Box Qty</td>' +
              '<td>Special Instruction</td>' +
              '<td>Required Delivery Date</td>' +
              '<td>Delivery Cost</td>' +
              '<td>Tracking number</td>' +
              '<td>Notes</td>' +
       '</tr>';
        $(result).each(function (index, element) {

            content += '<tr>' +
                '<td>' + element.CreatedBy + '</td>' +
                '<td>' + element.DueDate + '</td>' +
                '<td>' + element.InvoiceNo + '</td>' +
                '<td>' + element.RefNo + '</td>' +
                '<td>' + element.SalePerson + '</td>' +
                '<td>' + element.CustomerName + '</td>' +
                '<td>' + element.Address + '</td>' +
                '<td>' + element.City + '</td>' +
                '<td>' + element.PostalCode + '</td>' +
                '<td>' + element.IHeadCode + '</td>' +
                '<td>' + element.IHeadName + '</td>' +
                '<td>' + element.ImageLink + '</td>' +
                '<td>' + element.SaleQty + '</td>' +
                '<td>' + element.Box + '</td>' +
                '<td>' + element.LocId + '</td>' +
                '<td>' + element.SpecialInstruction + '</td>' +
                '<td>' + element.RequiedDate + '</td>' +
                '<td>' + element.DeliveryMethod + '</td>' +
                '<td>' + element.TrakingNumber + '</td>' +
                '<td>' + element.CustomerId + '</td>' +
        '</tr>';
        });
    }

    return content;
}

function s2ab(s) {
    debugger;
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function doExcel1() {

    var t1 = '<html>' + content11 + '</html>';
    var t2 = '<html>' + content21 + '</html>';
    var t3 = '<html>' + content31 + '</html>';
    var t4 = '<html>' + content41 + '</html>';
    var t5 = '<html>' + content51 + '</html>';
    var t6 = '<html>' + content61 + '</html>';
    var t7 = '<html>' + content71 + '</html>';

    //var w = XLSX.read(t1, { type: 'array' });
    //var htmlstr = XLSX.write(w, { sheet: "Sheet1", type: 'binary', bookType: 'html' });
    var blob;
  	wb = { SheetNames: [], Sheets: {} };
    var ws1 = XLSX.read(t1, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Monday"); wb.Sheets["Monday"] = ws1;

    var ws2 = XLSX.read(t2, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Tuesday"); wb.Sheets["Tuesday"] = ws2;

    var ws3 = XLSX.read(t3, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Wednesday"); wb.Sheets["Wednesday"] = ws3;

    var ws4 = XLSX.read(t4, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Thursday"); wb.Sheets["Thursday"] = ws4;

    var ws5 = XLSX.read(t5, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Friday"); wb.Sheets["Friday"] = ws5;

    var ws6 = XLSX.read(t6, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Saturday"); wb.Sheets["Saturday"] = ws6;

    var ws7 = XLSX.read(t7, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Sunday"); wb.Sheets["Sunday"] = ws7;


   // console.log(ws1); console.log(ws2); console.log(wb);
    blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
        type: "application/octet-stream"
    });

    saveAs(blob, "Local_Delivery_RunSheet_" + $('#txtFromDate').val() + "_To_" + $('#txtToDate').val() + "_.xlsx");
}

