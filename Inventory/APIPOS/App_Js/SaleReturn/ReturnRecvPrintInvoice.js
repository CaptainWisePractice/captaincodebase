var count = 0, Controller = "SalesReturnReceive", part1 = '', part2 = '', part3 = '', part4 = '', part5 = '';

part5 = '<table width="850" border="0" align="center" cellpadding="0" cellspacing="0">'+
'<tr>'+
'<td style="border:thin solid #CCCCCC; padding:30px;">&nbsp;</td>'+
'<td>&nbsp;</td>'+
'<td style="border:thin solid #CCCCCC; padding:30px;">&nbsp;</td>'+
'</tr>'+
  ' <tr>'+
    '<td width="300" align="center" style="background-color:#CCCCCC; padding:5px;"><span class="bold"><strong>Customer</strong></span><strong> Signature</strong></td>' +
    '<td>&nbsp;</td>'+
    '<td width="300" align="center" style="background-color:#CCCCCC; padding:5px;"><strong>Warehouse </strong><strong> Signature </strong></td>' +
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
   
   let Invoice = inv;
   var urlpath = base + Controller + "/GetRetrunRecvInvoicePrint";
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "InvoiceNo": Invoice }),
        success: function (result) {
            if (result != null) {
                BindDataHtmlTable(result);
            }
        }
    });
}

function BindDataHtmlTable(data) {
    $("#PrintDiv").empty();
    var content = '';
    if (data.list != null) {
        part1 = '<table width="850" border="0" align="center" cellpadding="5" cellspacing="0">'+
  '<tr>'+
    '<td><img src="https://www.captainwise.com.au/App_Theme/assets/images/LL1.png" width="250" /></td>'+
    '<td align="right" valign="middle"><span class="style1">Return Form</span></td>' +
  '</tr>'+
'</table>'+
'<br />'+
'<table width="850" border="0" align="center" cellpadding="5" cellspacing="0">'+
  '<tr>'+
    '<td colspan="4" style="border:thin solid #333333;" scope="row"><table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" >'+
        '<tr>'+
        '<td align="left" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="3">'+
          '<tr>' +
        '<td width="48%" class="bold" style="padding:10px; border:thin solid #CCCCCC; background:#CCCCCC;"><strong>From</strong></td>'+
            '<td align="left" class="bold">&nbsp;</td>'+
            '<td width="48%" align="left" class="bold" style="padding:10px; border:thin solid #CCCCCC; background:#CCCCCC;"><strong>To</strong></td>'+
          '</tr>'+
        '<tr>'+
        '<td align="left" valign="top" class="bold" style="padding:10px; border:thin solid #CCCCCC;">' + data.list[0].CustomerName + '<br />' +
        '' + data.list[0].UpdatedBy + '.<br />' +
            'Contact: ' + data.list[0].SRecvStatus + '</td>' +
        '<td align="left" valign="top" class="bold">&nbsp;</td>'+
        '<td align="left" valign="top" class="bold" style="padding:10px; border:thin solid #CCCCCC;">' + data.list[0].WhouseName + '.<br />' +
        '' + data.list[0].WhouseAddress + '.<br />' +
        'Contact: ' + data.list[0].WhouseMobile + '</td>' +
        '</tr>'+
        '</table></td>'+
       ' <td width="250" align="right" valign="top"><table width="90%" border="0" cellspacing="0" cellpadding="3">'+
       
         '<tr>' +
            '<td><span class="bold"><strong>Return No:</strong></span> <span class="normal">' + 'RT-' + data.list[0].SRReceiveNo + '</span></td>' +
        '</tr>' +
          '<tr>'+
            '<td><strong>Invoice No:</strong> ' + data.list[0].InvoiceNo + '</td>' +
        '</tr>'+
          '<tr>'+
            '<td><strong>Point of Sale:</strong> ' + data.list[0].CreatedBy + ' </td>' +
        '</tr>'+
          '<tr>'+
           ' <td><strong>Return Required Date:</strong> ' + data.list[0].FromDate + ' </td>' +
          '</tr>' +
           '<tr>' +
           ' <td><strong>Return By: </strong> ' + data.list[0].DeletedBy + ' </td>' +
          '</tr>' +
        '</table></td>'+
     ' </tr>'+
    '</table></td>'+
  '</tr>' +
'</table><br />';

        part4='<table width="850" border="0" align="center" cellpadding="5" cellspacing="0">' +
        '<tr>' +
        '<td width="415" align="left" valign="top"><label><strong>Return Reason</strong></label>' +
        '<br /></td>' +
        '<td align="left" valign="top">&nbsp;</td>' +
        '<td width="415" align="left" valign="top"><label><strong>Notes</strong></label></td>' +
        '</tr>' +
        '<tr>' +
        '<td align="left" valign="top" style="border:thin solid #333333;" scope="row">' + data.list[0].Reason + ' </td>' +
        '<td align="left" valign="top" scope="row">&nbsp;</td>' +
        '<td align="left" valign="top" style="border:thin solid #333333;" scope="row">' + data.list[0].Notes + '</td>' +
        '</tr>' +
       '</table><br />';
    }

    debugger;
    part2 = ' <table width="850" border="1" align="center" cellpadding="5" cellspacing="0">' +
       '<tr>' +
       '<th bgcolor="#CCCCCC" scope="row"><strong>Item Code</strong></th>' +
       '<th bgcolor="#CCCCCC" scope="row"><strong>Item Box Wise </strong></th>' +
       '<th bgcolor="#CCCCCC" scope="row"><strong>Item Description</strong></th>' +
       '<th align="center" valign="middle" bgcolor="#CCCCCC" scope="row"><strong>Return Qty</strong></th>' +
       '<th align="center" valign="middle" bgcolor="#CCCCCC" scope="row"><strong>Received Qty</strong></th>' +
       '<th bgcolor="#CCCCCC" scope="row"><strong>Recv. Date </strong></th>' +
       '</tr>';
    if (data.list[0].lstDetails != null) {
        $(data.list[0].lstDetails).each(function (index, element) {
            let Qty = '';
            if (element.ReceiveQty != 0) {
                Qty = element.ReceiveQty;
            } else { Qty = ''; }
            part3 += '<tr>' +
                '<td align="left" valign="top" scope="row">' + element.IHeadCode + '</td>' +
                '<td align="left" valign="top" scope="row">' + element.ItemCode + '</td>' +
                '<td align="left" valign="top" scope="row">' + element.LotNo + '</td>' +
                '<td align="center" valign="middle" scope="row">' + element.SaleQuantity + '</td>' +
                '<td align="center" valign="middle" scope="row">' + Qty + '</td>' +
                '<td align="left" valign="top" scope="row">' + element.CreatedBy + '</td>' +
             ' </tr>';
        });  
    }
    part3 += '</table><br />';

    content += part1 + part2 + part3 + part4 + part5;

    $("#PrintDiv").append(content);
    setTimeout(function () {
        window.print();
    }, 400);
}



