var count = 0, Controller = "IncomingProductionStockList", part1 = '', part2 = '', part3 = '', part4 = '',
    expart1 = '', expart2 = '', expart3 = '', excelContent = "", piNo = "";

part2 = ' <table id="dataTable" width="1100" border="1" align="center" cellpadding="5" cellspacing="0" style="margin-left: 40px;">' +
           ' <tr>' +
                '<th width="10%" bgcolor="#CCCCCC"><strong>Item Code</strong></th>' +
                '<th bgcolor="#CCCCCC"><strong>Description</strong></th>' +
                '<th bgcolor="#CCCCCC"><strong>Size</strong></th>' +
                '<th align="center" valign="middle" bgcolor="#CCCCCC"><strong> Colour </strong></th>' +
               ' <th align="center" width="6%" valign="middle" bgcolor="#CCCCCC">' + '<strong>Item<br />Qty</strong>' +'</th>' +
               '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 1 </strong></th>' +
               '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></th>' +
               '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 2 </strong></th>' +
    '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></th>' +
    '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 3</strong></th>' +
    '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></th>' +
    '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 4</strong></th>' +
    '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></th>' +
    '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 5</strong></th>' +
    '<th align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></th>' +
    '</tr>';

expart1 = '<table id="dataTable" width="1100" border="1" align="center" cellpadding="5" cellspacing="0" style="margin-left: 40px;">';
expart3 =   '<tr>' +
                '<td width="10%" bgcolor="#CCCCCC"><strong>Item Code</strong></td>' +
                '<td bgcolor="#CCCCCC"><strong>Description</strong></td>' +
                '<td bgcolor="#CCCCCC"><strong>Size</strong></td>' +
                '<td align="center" valign="middle" bgcolor="#CCCCCC"><strong> Colour </strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC">' + '<strong>Item<br />Qty</strong>' + '</td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 1 </strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 2 </strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 3</strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 4</strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Box 5</strong></td>' +
                '<td align="center" width="6%" valign="middle" bgcolor="#CCCCCC"><strong> Count </strong></td>' +
          '</tr>';



$(document).ready(function () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let PINumber = url.searchParams.get("PINumber");
    if (PINumber !== null) {
        piNo = PINumber;
        GetPackingListByPINumber(PINumber)
    }

});

function GetPackingListByPINumber(PINumber) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetPackingListByPINumber",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "PINumber": PINumber }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.listPOMaster);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function BindTable(data) {
    $("#DivPackingList").empty();
    var content = '', tolQty = 0, toWeight = 0, tolCMB = 0, Box1tolQty = 0, Box2tolQty = 0, Box3tolQty = 0, Box4tolQty = 0, Box5tolQty=0;
    if (data != null) {
        part1 = ' <table width="1100" border="0" align="center" cellpadding="5" cellspacing="0" style="margin-left: 10px;">' +
           ' <tr>' +
               ' <td align="center" valign="top" style="padding-top:15px;">' +

                   ' <div class="title1" style="">Packing List</div>' +
                   ' <div class="title2">Container No: ' + data[0].ContainerNumber + '</div>' +
                   ' <div class="title2">Supplier Name: ' + data[0].ManufacturerName + '</div>' +
                   ' <div class="title2">Product: ' + data[0].Description + ' </div>' +
                   ' <div class="title2">ETA Port: ' + data[0].TransitTimeETA + '</div>' +
                   ' <div class="title2">ETA Warehouse: ' + data[0].ETAWarehouse + ' </div>' +
                   ' <div id="printButton" style="text-align:right;" class="title2 .d-print-none">'+
                   '<button onclick="window.print();" style="height: 45px; width: 100px; background-color: royalblue; margin-right: 800px;" class="btn btn-primary">Print Report</button>' +
                   '<button onclick="doExcel();" style="height: 45px; width: 120px; background-color: #8db8ee" class="btn btn-primary">Download Excel</button>' +
                   '</div>' +
               ' </td>' +
           ' </tr>' +
       ' </table>' +
       ' <br />';

        expart2 = '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
               '</tr>' +
               '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td>Container No:</td>' +
                '<td> ' + data[0].ContainerNumber + '</td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
               '</tr>' +
               '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td>Supplier Name:</td>' +
                '<td> ' + data[0].ManufacturerName + '</td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
               '</tr>' +
               '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td>Product:</td>' +
                '<td> ' + data[0].Description + '</td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
               '</tr>' +
               '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td>ETA Port:</td>' +
                '<td> ' + data[0].TransitTimeETA + '</td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
               '</tr>' +
               '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td>ETA Warehouse:</td>' +
                '<td> ' + data[0].ETAWarehouse + '</td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
               '</tr>' +
                '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
               '</tr>';

        $(data).each(function (index, element) {

            var boxcount = parseInt(element.Box);
            var box1 = "", box2 = "", box3 = "", box4 = "", box5 = "";
            if (boxcount >= 1) {
                box1 = parseInt(element.Quantity);
            }
            if (boxcount >= 2) {
                box2 = parseInt(element.Quantity);
            }
            if (boxcount >= 3) {
                box3 = parseInt(element.Quantity);
            }
            if (boxcount >= 4) {
                box4 = parseInt(element.Quantity);
            }
            if (boxcount >= 5) {
                box5 = parseInt(element.Quantity);
            }


            part3 += '<tr>' +
                ' <td align="left" valign="top">' + element.ItemHead + '</td>' +
                 '<td align="left" valign="top">' + element.PortOfLoading + '</td>' +
                 '<td align="center" valign="top">' + element.ImportOrLocal + '</td>' +
                 '<td align="center" valign="top">' + element.PONumber + '</td>' +
                '<td align="center" valign="top">' + parseInt(element.Quantity) + '</td>' +

                ' <td align="center" valign="top">' + box1 + '</td>' +
                '<td align="left" valign="top">' + '' + '</td>' +
                '<td align="center" valign="top">' + box2 + '</td>' +
                '<td align="center" valign="top">' + '' + '</td>' +
                '<td align="center" valign="top">' + box3 + '</td>' +
                ' <td align="left" valign="top">' + '' + '</td>' +
                '<td align="center" valign="top">' + box4 + '</td>' +
                '<td align="center" valign="top">' + '' + '</td>' +
                '<td align="center" valign="top">' + box5 + '</td>' +
                '<td align="center" valign="top">' + '' + '</td>' +
            ' </tr>';
            tolQty = tolQty + parseInt(element.Quantity);

            Box1tolQty = Box1tolQty + box1;
            Box2tolQty = Box2tolQty + box2;
            Box3tolQty = Box3tolQty + box3;
            Box4tolQty = Box4tolQty + box4;
            Box5tolQty = Box5tolQty + box5;
        });

        part4 = ' <tr>' +
    '<td colspan="4" align="right" valign="top" bgcolor="#CCCCCC"><strong>Total:</strong></td>' +
            '<td align="center" valign="middle"><strong>' + tolQty + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + Box1tolQty + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + '' + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + Box2tolQty + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + '' + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + Box3tolQty + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + '' + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + Box4tolQty + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + '' + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + Box5tolQty + '</strong></td>' +
            '<td align="center" valign="middle"><strong>' + '' + '</strong></td>' +
            '</tr><tr><td colspan="2" align="left" valign="top" bgcolor="#CCCCCC"><strong>Uploading Date:</strong></td>' +'<td colspan="13"></td>'+
            '</tr><tr><td colspan="2" align="left" valign="top" bgcolor="#CCCCCC"><strong>Checked By:</strong></td>' +'<td colspan="13"></td>' +

    '</tr></table>';

        content += part1 + part2 + part3 + part4;
        excelContent = "";
        excelContent = expart1 + expart2 + expart3 + part3 + part4;

        $("#DivPackingList").append(content);
        setTimeout(function () {
            window.print();
        }, 400);
    }


}



function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function doExcel() {
    debugger
    var t1 = '<html>' + excelContent + '</html>';

    //var w = XLSX.read(t1, { type: 'array' });
    //var htmlstr = XLSX.write(w, { sheet: "Sheet1", type: 'binary', bookType: 'html' });
    var blob;
    wb = { SheetNames: [], Sheets: {} };
    var ws1 = XLSX.read(t1, { type: "binary" }).Sheets.Sheet1;
    wb.SheetNames.push("Packing List");
    wb.Sheets["Packing List"] = ws1;

    // console.log(ws1); console.log(ws2); console.log(wb);
    blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
        type: "application/octet-stream"
    });

    saveAs(blob, "Packing_List_" + piNo + "_.xlsx");
}




