var count = 0, Controller = "StockTransfer", part1 = '', part2 = '', part3 = '', part4 = '', part5='';

part5 = '<table width="850" border="0" align="center" cellpadding="0" cellspacing="0">'+
'<tr>'+
'<td style="border:thin solid #CCCCCC; padding:30px;">&nbsp;</td>'+
'<td>&nbsp;</td>'+
'<td style="border:thin solid #CCCCCC; padding:30px;">&nbsp;</td>'+
'</tr>'+
  ' <tr>'+
    '<td width="300" align="center" style="background-color:#CCCCCC; padding:5px;"><span class="bold"><strong>Warehouse</strong></span><strong> Signature</strong></td>'+
    '<td>&nbsp;</td>'+
    '<td width="300" align="center" style="background-color:#CCCCCC; padding:5px;"><strong>Dandenong Store</strong><strong> Signature </strong></td>' +
    '</tr>'+
'</table>';

$(document).ready(function () {

    var url_string = window.location.href;
    var url = new URL(url_string);
    let InvoiceNo = url.searchParams.get("InvoiceNo");
    if (InvoiceNo !== null) {
        loadDataInvoiceWise(InvoiceNo)
    }

});

function loadDataInvoiceWise(inv) {
    var urlpath = base + Controller + "/GetTranferDataByInvNoPrint";
    var obj = {
        InvoiceNo: inv
    }
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "obj": obj }),
        success: function (result) {
            if (result != null) {
                BindDataHtmlTable(result);
                //MasterData(result.masterList);
                //BindItemGrid(result.list)

            }
        }
    });
}

function BindDataHtmlTable(data) {
    $("#PrintDiv").empty();
    var content = '';
    if (data.masterList != null) {
        part1 = '<table width="850" border="0" align="center" cellpadding="5" cellspacing="0">'+
  '<tr>'+
    '<td><img src="https://www.captainwise.com.au/App_Theme/assets/images/LL1.png" width="250" /></td>'+
    '<td align="right" valign="middle"><span class="style1">Stock Transfer</span></td>' +
  '</tr>'+
'</table>'+
'<br />'+
'<table width="850" border="0" align="center" cellpadding="5" cellspacing="0">'+
  '<tr>'+
    '<td colspan="4" style="border:thin solid #333333;" scope="row"><table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" >'+
        '<tr>'+
        '<td align="left" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="3">'+
          '<tr>'+
            '<td width="48%" class="bold" style="padding:10px; border:thin solid #CCCCCC; background:#CCCCCC;"><strong>From</strong></td>'+
        '<td align="left" class="bold">&nbsp;</td>'+
            '<td width="48%" align="left" class="bold" style="padding:10px; border:thin solid #CCCCCC; background:#CCCCCC;"><strong>To</strong></td>'+
        '</tr>'+
          '<tr>'+
            '<td align="left" valign="top" class="bold" style="padding:10px; border:thin solid #CCCCCC;">' + data.masterList[0].DispatchStatus + '<br />' +
        ' ' + data.masterList[0].RequiredDate + '.<br />' +
           ' Contact: ' + data.masterList[0].DeliveryDate + '<br /></td>' +
            '<td align="left" valign="top" class="bold">&nbsp;</td>'+
            '<td align="left" valign="top" class="bold" style="padding:10px; border:thin solid #CCCCCC;">' + data.masterList[0].CustomerName + '<br />' +
            '' + data.masterList[0].City + ' ,<br />' +
            '' + data.masterList[0].SearchText + '.<br />' +
            'Contact: ' + data.masterList[0].MobileNo + '</td>' +
          '</tr>'+
        '</table></td>'+
       ' <td width="250" align="right" valign="top"><table width="90%" border="0" cellspacing="0" cellpadding="3">'+
        '<tr>'+
            '<td><span class="bold"><strong>Order No:</strong></span> <span class="normal">' + data.masterList[0].InvoiceNo + '</span></td>' +
        '</tr>'+
          '<tr>'+
            '<td><strong>Booking Date:</strong> ' + data.masterList[0].InvoiceDate + '.</td>' +
        '</tr>'+
          '<tr>'+
            '<td><strong>Reference No:</strong> ' + data.masterList[0].ReferenceNo + ' </td>' +
        '</tr>'+
          '<tr>'+
           ' <td><strong>Transaction Type:</strong> ' + data.masterList[0].CustomerName + ' </td>' +
          '</tr>'+
          '<tr>'+
            '<td><strong>Point Of Req.:</strong> ' + data.masterList[0].CustomerName + ' </td>' +
          '</tr>'+
          '<tr>'+
            '<td><strong>Order Person: </strong>' + data.masterList[0].PostalCode + ' </td>' +
          '</tr>'+
        '</table></td>'+
     ' </tr>'+
    '</table></td>'+
  '</tr>' +
'</table><br />';

        part4='<table width="850" border="0" align="center" cellpadding="5" cellspacing="0">' +
        '<tr>' +
        '<td width="415" align="left" valign="top"><label><strong>Delivery Instruction</strong></label>' +
        '<br /></td>' +
        '<td align="left" valign="top">&nbsp;</td>' +
        '<td width="415" align="left" valign="top"><label><strong>Notes</strong></label></td>' +
        '</tr>' +
        '<tr>' +
        '<td align="left" valign="top" style="border:thin solid #333333;" scope="row">' + data.masterList[0].SpecialInstruction + ' </td>' +
        '<td align="left" valign="top" scope="row">&nbsp;</td>' +
        '<td align="left" valign="top" style="border:thin solid #333333;" scope="row">' + data.masterList[0].Notes + '</td>' +
        '</tr>' +
       '</table><br />';
    }


    if (data.list != null) {
        part2 = ' <table width="850" border="1" align="center" cellpadding="5" cellspacing="0">' +
        '<tr>' +
        '<th bgcolor="#CCCCCC" scope="row"><strong>Item Code</strong></th>' +
        '<th bgcolor="#CCCCCC" scope="row"><strong>Item Description</strong></th>' +
        ' <th bgcolor="#CCCCCC" scope="row"><strong>In Hand Qty</strong></th>' +
        '<th align="center" valign="middle" bgcolor="#CCCCCC" scope="row"><strong>Qty</strong></th>' +
        ' <th align="center" valign="middle" bgcolor="#CCCCCC" scope="row"><strong>No of Box</strong></th>' +
        '<th bgcolor="#CCCCCC" scope="row"><strong>Delivery Cost</strong></th>' +
        '</tr>';
        $(data.list).each(function (index, element) {
            part3 += '<tr>' +
               '<td align="left" valign="top" scope="row">' + element.ItemCode + '</td>' +
               '<td align="left" valign="top" scope="row">' + element.IHeadDescription + '</td>' +
               '<td align="left" valign="top" bgcolor="#CCCCCC" scope="row">' + element.InhandStock + '</td>' +
               '<td align="center" valign="middle" scope="row">' + element.SaleQty + '</td>' +
               '<td align="center" valign="middle" scope="row">' + element.Box + '</td>' +
               '<td align="left" valign="top" scope="row">' + element.DeliveryCost + '</td>' +
             ' </tr>';
        });
        part3 += '</table><br />';

        content += part1 + part2 + part3 + part4 + part5;

        $("#PrintDiv").append(content);
        setTimeout(function () {
            window.print();
        }, 400);
    }
}



