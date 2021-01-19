var Controller = 'IncomingProductionStockList', IncomingLst = '', ProductionLst = '';
var content11 = '', content21 = '', content31 = '';
var content1 = '', content2 = '', content3 = '';
$("span#sidebar-toggle").trigger('click');
var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

$('#txtFromDate').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtFromDate').datepicker('setDate', firstDay);
$('#txtToDate').datepicker({ dateFormat: 'dd-M-yy' });
$('#txtToDate').datepicker('setDate', lastDay);

LoadItem("In");

$('#btnSearch').on('click', function () {
    if ($('#txtFromDate').val() != '' && $('#txtToDate').val() != '') {
        LoadItem("Sr");
    }
});

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

function LoadItem(type) {

    let FromDate = $('#txtFromDate').val();
    let ToDate = $('#txtToDate').val();
    var urlpath = "../IncomingProductionStockList/GetIncomingProductionList";
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
                // $("#divTable").empty();
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                // $("#divTable").empty();
                return false;
            } else {
                BindTable(result.listPOMaster);
            }
        }
    });

}

function BindTable(data) {
    content11 = '', content21 = '', content31 = '', IncomingLst = '', ProductionLst = '';
    content1 = '', content2 = '', content3 = '';
    var IncomingLst = $.grep(data,
           function (x) {
               if (x.OrderStatusId == "Incoming") {
                   return x;
               }
           });
    var ProductionLst = $.grep(data,
          function (x) {
              if (x.OrderStatusId == "Production") {
                  return x;
              }
          });


    $("#IncomingTable").empty();
    content1 += TableHeader1();
    content1 += '<tbody>';
    content1 += TableRow1(IncomingLst);
    content1 += '</tbody></table>';
    $("#IncomingTable").append(content1);
    $("#tblIncoming").rowspanizer({ vertical_align: 'middle' });
    content11 += TableHeader1();
    content11 += '<tbody>';
    content11 += TableRow11(IncomingLst);
    content11 += '</tbody></table>';

    var ProdLst = ProductionLst.sort(function (a, b) { a = new Date(a.ProductionEndDate); b = new Date(b.ProductionEndDate); return a < b ? -1 : a > b ? 1 : 0; });

    $("#ProductionTable").empty();
    content2 += TableHeader2();
    content2 += '<tbody>';
    content2 += TableRow2(ProdLst);
    content2 += '</tbody></table>';
    $("#ProductionTable").append(content2);
    $("#tblProduction").rowspanizer({ vertical_align: 'middle' });
    content21 += TableHeader2();
    content21 += '<tbody>';
    content21 += TableRow22(ProdLst);
    content21 += '</tbody></table>';

}
//style="background-color: green;"
function TableHeader1() {
    let content = '';
    content = '<table id="tblIncoming" class="table table-bordered table-striped">' +
       '<thead >' +
              '<tr>' +
              '<th style="vertical-align:middle;">PI Number</th>' +
              '<th>Container No </th>' +
              '<th>ITEM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>' +
              '<th>ITEM CODE  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
              '<th>SIZE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
              '<th>COLOUR &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
              '<th>QTY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
              '<th>ETA (warehouse) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th> ' +
              '<th>Delivery Status &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th> ' +
              '<th>Listing Status &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th> ' +
              '</tr>' +
              '</thead>';
    return content;
}
//style="background-color: yellow;"
function TableHeader2() {
    let content = '';
    content = '<table id="tblProduction" class="table table-bordered table-striped">' +
       '<thead >' +
              '<tr>' +
              '<th style="vertical-align:middle;">PI Number</th>' +
              '<th>Container No </th>' +
              '<th>ITEM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>' +
              '<th>ITEM CODE  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
              '<th>SIZE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
              '<th>COLOUR &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
              '<th>QTY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
              '<th>Production Finish Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th> ' +
              '<th>Estimated Instock Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th> ' +
              '<th>Listing Status &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th> ' +
              '</tr>' +
       '</thead>';
    return content;
}

function TableRow1(result) {
    let content = '', trcolor = '',Itemblod = '', piNo = '', piNo1 = '', qty = 0, tlength = 0;
    if (result != null) {
        $(result).each(function (index, element) {
            if (element.FreeDays == "7")
            { trcolor = 'style="background-color:#32CD32 !important;"'; } else { trcolor = ''; }

            if (element.CFAgencyId == "1")
            { Itemblod = 'style="font-weight: 950 !important;"'; } else { Itemblod = ''; }

            content += '<tr  ' + trcolor + '>' +
               '<td>' + element.PINumber + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + element.PONumber + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td><a href="#" class="PINumber">' + element.ContainerNumber + '<br> <span style="color:blue;font-weight: bold;">(Print Packing List)</span> </a><input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td ' + Itemblod + '>' + element.Description + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td ' + Itemblod + '>' + element.ItemHead + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ImportOrLocal + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ManufacturerName + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + parseInt(element.Quantity) + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ETAWarehouse + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.PORecvStatus + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.CurrencyId + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
        '</tr>';

        });
    }
    return content;
}

function TableRow11(result) {
    let content = '', trcolor = '', piNo = '', piNo1 = '', qty = 0, tlength = 0;
    if (result != null) {
        content += '<tr>' +
            '<td>PI Number</td>' +
             '<td>Container No</td>' +
             '<td>ITEM</td>' +
             '<td>ITEM CODE</td>' +
             '<td>SIZE</td>' +
             '<td>COLOR</td>' +
             '<td>QTY</td>' +
             '<td>ETA (warehouse)</td> ' +
             '<td>Delivery Status</td> ' +
             '<td>Listing Status</td> ' +
     '</tr>';

        $(result).each(function (index, element) {
            content += '<tr>' +
                '<td ><a href="#" class="PINumber">' + element.PINumber + '  ' + element.PONumber + '</a><input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ContainerNumber + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.Description + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ItemHead + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ImportOrLocal + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ManufacturerName + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + parseInt(element.Quantity) + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ETAWarehouse + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.PORecvStatus + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                 '<td>' + element.CurrencyId + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
        '</tr>';

        });
    }
    return content;
}

function TableRow2(result) {
    let content = '', trcolor = '',Itemblod='', piNo = '', piNo1 = '', qty = 0, tlength = 0, ind = 0;
    if (result != null) {
        $(result).each(function (index, element) {

            if (element.CFAgencyId == "1")
            { Itemblod = 'style="font-weight: 950 !important;"'; } else { Itemblod = ''; }

            content += '<tr>' +
               '<td>' + element.PINumber + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + element.PONumber + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td><a href="#" class="PINumber">' + element.ContainerNumber + '<br> <span style="color:blue;font-weight: bold;">(Print Packing List)</span> </a><input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td ' + Itemblod + '>' + element.Description + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td ' + Itemblod + '>' + element.ItemHead + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ImportOrLocal + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ManufacturerName + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + parseInt(element.Quantity) + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ProductionEndDate + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td><input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.CurrencyId + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
               '</tr>';
        });
    }
    return content;
}

function TableRow22(result) {
    let content = '', trcolor = '', piNo = '', piNo1 = '', qty = 0, tlength = 0, ind = 0;
    if (result != null) {
        content += '<tr>' +
             '<td>PI Number</td>' +
              '<td>Container No</td>' +
              '<td>ITEM</td>' +
              '<td>ITEM CODE</td>' +
              '<td>SIZE</td>' +
              '<td>COLOR</td>' +
              '<td>QTY</td>' +
              '<td>Production Finish Date</td> ' +
              '<td>Estimated Instock date</td> ' +
              '<td>Listing Status</td> ' +
      '</tr>';
        $(result).each(function (index, element) {
            content += '<tr>' +
                '<td><a href="#" class="PINumber">' + element.PINumber + '  ' + element.PONumber + '</a><input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ContainerNumber + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.Description + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ItemHead + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ImportOrLocal + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ManufacturerName + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + parseInt(element.Quantity) + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.ProductionEndDate + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td><input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
                '<td>' + element.CurrencyId + '<input type="hidden" class="InvoiceNo" value="' + element.POMasterId + '"/></td>' +
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

function doExcel() {

    var t1 = '<html>' + content11 + '</html>';
    var t2 = '<html>' + content21 + '</html>';

    //var w = XLSX.read(t1, { type: 'array' });
    //var htmlstr = XLSX.write(w, { sheet: "Sheet1", type: 'binary', bookType: 'html' });
    var blob;
    wb = { SheetNames: [], Sheets: {} };
    var ws1 = XLSX.read(t1, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("INCOMING ORDERS"); wb.Sheets["INCOMING ORDERS"] = ws1;

    var ws2 = XLSX.read(t2, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("PRODUCTION ORDERS"); wb.Sheets["PRODUCTION ORDERS"] = ws2;

    // console.log(ws1); console.log(ws2); console.log(wb);
    blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
        type: "application/octet-stream"
    });

    saveAs(blob, "IncomingProductionStockList_" + $('#txtFromDate').val() + "_To_" + $('#txtToDate').val() + "_.xlsx");
}

$(document).off('click', '.PINumber').on('click', '.PINumber', function () {
   
    let tblRow = $(this).closest('tr');
    let PINumber = tblRow[0].childNodes[0].childNodes[1].defaultValue;  //$(tblRow).find('.InvoiceNo input[type=hidden]').val();
    // let headname = $(tblRow).find('.InvoiceNo').text();
    // setTimeout(function () {
    var url = base + "IncomingProductionStockList/IndexPackingList?PINumber=" + PINumber;
    // window.open(url, '_blank');
    var win = window.open(url, '_blank');
    win.focus();
    // }, 2000);
});
