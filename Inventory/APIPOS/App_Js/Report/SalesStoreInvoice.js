var count = 0, Controller = "SalesReports", p1 = '', p2 = '', p3 = '', pLast = '';
var term = '';

$(document).ready(function () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let Invoice = url.searchParams.get("Invoice");
    if (Invoice !== null) {
        GetSaleinvoiceNo(Invoice)
    }

});

function GetSaleinvoiceNo(invoiceNo) {
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: base + Controller + "/GetSaleinvoiceNo",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "invoiceNo": invoiceNo }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Something terrible happened.', type: 'info' });
                return false;
            }
            if (result.Error != null) {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                var DataList = result.listSalesReports;
                settable(DataList);
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}

function settable(DataList) {
    var content = '', quotes = '', duetext = '', storeLogo = '', warehouseAddress = '';
    $("#divSaleReport").empty();
    var mdata = DataList[0];

    if (mdata[0].Due == "0.00") {
        duetext = ' <td>Balance Due</td>' +
        '<td align="right">$ ' + mdata[0].Due + '</td>';
    } else {
        duetext = ' <td><strong>Balance Due</strong></td>' +
               ' <td align="right"><strong>$ ' + mdata[0].Due + '</strong></td>';
    }

    if (mdata[0].DeliveryMethod == "Pick Up Warehouse") {
        warehouseAddress = '<strong>Braeside Warehouse Address: </strong><br>' +
                                       ' 6-12 Crawford St, Braeside VIC 3195<br>' +
                                        '9am-5pm Monday - Friday<br>' +
                                        '7am-3pm Saturday<br>' +
                                       ' Closed Sun &amp; Wed + Public Holidays';
    } else { warehouseAddress = ''; }

    if (mdata[0].SaleOutlateName == "Dandenong Store") {
        storeLogo = '../App_Theme/assets/images/ReportlogoDandenong.png';
    }
    if (mdata[0].SaleOutlateName == "Reservoir Store") {
        storeLogo = '../App_Theme/assets/images/ReportlogoReservoir.png';
    }
    if (mdata[0].SaleOutlateName == "Hoppers Crossing Store") {
        storeLogo = '../App_Theme/assets/images/ReportlogoHoppers.png';
    }

    p1 = '<table width="750" border="0" align="center" cellpadding="0" cellspacing="0">' +
            '<tbody>' +
                '<tr>' +
                    '<td>' +
                        '<table width="100%" border="0" cellspacing="0" cellpadding="5">' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td width="60%" style="font-size:12px;">' +
                                        '<table width="95%" border="0" cellspacing="0" cellpadding="0">' +
                                            '<tbody>' +
                                                '<tr>' +
                                                    '<td width="19%"><img src="' + storeLogo + '" width="70" height="70"></td>' +
                                                    '<td width="81%" valign="top">' +
                                                        '<span class="style1" style="font-size: 15px;font-weight: bold;">' + mdata[0].OutletFullName + '</span><br>' +
                                                        'A.B.N. ' + mdata[0].ABNNo + '<br>  <span style="font-size: 14px;">email: ' + mdata[0].OutletEmail + '</span><br>' +
                                                        '<span style="font-size: 14px;">Website: ' + mdata[0].OutletWebsite + ' </span>' +
                                            ' </td>' +
                                            '</tr>' +
                                            ' </tbody>' +
                                            ' </table>' +
     '</td>' +
         '<td align="right" valign="middle"> <span class="style1">Tax Invoice<br></span><table width="80%" border="0" cellspacing="0" cellpadding="2" style="font-size:12px;"> <tbody><tr> <td><strong>Invoice No </strong></td> <td align="right"><strong>' + mdata[0].InvoiceNo + '</strong></td> </tr> ' +
         '<tr> <td>Date</td> <td align="right">' + mdata[0].SaleDate + '</td> </tr> <tr> <td>Order Place </td> <td align="right">' + mdata[0].SaleOutlateName + '</td> </tr> <tr>  <td>Sales Person</td> <td align="right">' + mdata[0].SalesPersonName + '</td> </tr> </tbody></table></td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</td>' +
    '</tr>' +
    '<tr>' +
    '<td style="padding:0px 0px;">' +
    '<table width="100%" border="0" cellspacing="0" cellpadding="5">' +
    '<tbody>' +
    '<tr>' +
    '<td width="60%" style="font-size:12px;">' +
    ' <span style="font-weight:bold;" class="style2">Customer Details:</span><br>' +
    '' + mdata[0].Name + '<br>' +
    '' + mdata[0].ShipTo + ', ' + mdata[0].City + ', ' + mdata[0].State + ', ' + mdata[0].PostalCode + '<br>' +
    'Phone: ' + mdata[0].MobileNo + ' <br>' +
    '</td>' +
    '<td valign="bottom"><table width="99%" border="0" cellspacing="0" cellpadding="5" style="font-size:12px;"> <tbody><tr>  <td width="47%" align="center" valign="middle">Delivery Via</td>  <td width="6%" align="center" valign="middle">&nbsp;</td> <td width="47%" align="center" valign="middle">Delivery Date</td>' +
    '</tr><tr> <td align="center" valign="middle" style="border:thin solid #000000;"><strong>' + mdata[0].DeliveryMethod + '</strong></td> ' +
    '<td align="center" valign="middle">&nbsp;</td> <td align="center" valign="middle" style="border:thin solid #000000;">' + mdata[0].DateFrom + '</td> </tr> </tbody></table> </td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</td>' +
    '</tr>' +
     '<tr>' +
     '<td>' +
     ' <table width="99%" border="1" cellpadding="4" cellspacing="0" bordercolor="#808080" style="font-size:12px;">' +
                            '<tbody>' +
                               ' <tr>' +
                                    '<th width="8%" align="center" valign="middle" bgcolor="#d3d3d3">QTY </th>' +
                                    '<th width="15%" align="center" valign="middle" bgcolor="#d3d3d3">ITEM NO.</th>' +
                                    '<th valign="middle" bgcolor="#d3d3d3">DESCRIPTION </th>' +
                                    '<th width="15%" align="center" valign="middle" bgcolor="#d3d3d3">ITEM LOCATION </th>' +
                                   ' <th width="15%" align="center" valign="middle" bgcolor="#d3d3d3">UNIT PRICE </th>' +
                                   ' <th width="10%" align="center" valign="middle" bgcolor="#d3d3d3">DISC% </th>' +
                                    '<th width="12%" align="center" valign="middle" bgcolor="#d3d3d3">EXTENDED </th>' +
                        ' </tr>';


    var ln = DataList[1].length - 1;
    var br = '', trstyle='',tdstyle='',dollar='';
    $.each(DataList[1],function (i, row) {
          if (i == ln) {
              br = '<br />';
          }
          if (row.Itemtype == 'combo') {
              trstyle = 'style="font-style: italic;font-size: 9px;"';
              tdstyle = 'style="text-align: right;"';
              dollar = '';
          } else { trstyle = ''; tdstyle = ''; dollar ='$' }
          p2 += ' <tr ' + trstyle + '>' +
                         ' <td align="center" valign="top" ' + tdstyle + '>' + row.SaleQty + '' + br + ' ' +
                                 ' </td>' +
                                 ' <td align="center" valign="top">' + row.IHeadCode + '</td>' +
                                 ' <td align="center" valign="top">' + row.IHeadName + '</td>' +
                                 ' <td align="center" valign="top">' + row.LocName + '</td>' +
                                 ' <td align="center" valign="top">' + row.SalePrice + '</td>' +
                                 ' <td align="center" valign="top">' + row.discount + '</td>' +
                                 ' <td align="center" valign="top">' + dollar + ' ' + row.WithDiscount + '</td>' +
            '</tr>';
      });

    pLast = ' </tbody>' +
                       ' </table>' +
                    '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td style="padding:10px 10px 0 0;">' +
                        '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                            '<tbody>' +
                               ' <tr>' +
                                    '<td width="60%" valign="bottom" style="padding:0px 10px;"> <span class="style2">Comment: <br></span>  <table width="100%" border="0" cellspacing="0" cellpadding="5">  <tbody><tr> <td style="border:thin solid #000; font-size:12px;">  ' + mdata[0].Comments + '  <br> <br> <br> </td>  </tr> </tbody></table> </td>' +
                                    '<td width="3%">&nbsp;</td>' +
                                   ' <td style="border:thin solid #000;" class="style2">' +
                                       ' <table width="90%" border="0" align="center" cellpadding="2" cellspacing="0">' +
                                           ' <tbody>' +
                                               ' <tr>  <td>Subtotal</td>  <td align="right">$ ' + mdata[0].SubTotal + ' </td> </tr>' +
                                               ' <tr>  <td>Freight</td>  <td align="right">$ ' + mdata[0].Freight + ' </td> </tr>' +
                                               ' <tr>  <td>Additional Discount</td>  <td align="right">$ ' + mdata[0].ManagerDiscount + ' </td> </tr>' +
                                                '<tr>  <td>GST</td>  <td align="right">$ ' + mdata[0].Tax + ' </td>  </tr>' +
                                                '<tr>' +
                                                   ' <td>Total</td>' +
                                                   ' <td align="right">$ ' + mdata[0].TotalAmount + ' </td>' +
                                               ' </tr>' +
                                              '  <tr>' +
                                                    '<td>Applied</td>' +
                                                  '  <td align="right">$ ' + mdata[0].PaidToday + '</td>' +
                                               ' </tr>' +
                                               ' <tr>' +
                                               duetext +
                                                   //' <td><strong>Balance Due</strong></td>' +
                                                   //' <td align="right"><strong>$ ' + mdata[0].Due + '</strong></td>' +

                                               ' </tr>' +

                                           ' </tbody>' +
                                       ' </table>' +
                                   ' </td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                   ' </td>' +
                '</tr>' +
                '<tr>' +
                    '<td style="padding:10px; font-size:11px;">' +
                        '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:11px;">' +
                           ' <tbody>' +
                                '<tr>' +
                                   ' <td colspan="2" align="left" valign="top">' + warehouseAddress +
                                    '</td>' +
                                    '<td width="46%" align="left" valign="top">' +
                                      '<strong>Bank Deposit</strong><br>Account Name-' + mdata[0].OutletFullName + '<br>' +
                                      '  BSB Number-' + mdata[0].BSBNumber + '<br>Account Number-' + mdata[0].AccountNumber + '' +
                                    '</td>' +
                                '</tr>' +
                                '<tr> <td width="5%" align="left" valign="top">&nbsp;</td> <td width="49%" align="left" valign="top">&nbsp;</td> <td align="left" valign="top" style="border-bottom:thin solid #000000;">&nbsp;</td>  </tr>' +
                                '<tr>' +
                                    '<td align="left" valign="top">&nbsp;</td>' +
                                    '<td align="left" valign="top">&nbsp;</td>' +
                                    '<td align="left" valign="top" style="padding-top:5px;">' +
                                        '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:11px;">' +
                                            '<tbody>' +
                                                '<tr>' +
                                                    '<td width="33%" align="left" valign="top" style="padding-top:5px;">Invoice No: <strong>' + mdata[0].InvoiceNo + '</strong></td>' +
                                                    '<td width="33%" align="center" valign="top" style="padding-top:5px;">Amount Due: <strong>$ ' + mdata[0].Due + '</strong> </td>' +
                                                    '<td width="33%" align="right" valign="top" style="padding-top:5px;">Due Date: <strong>' + mdata[0].DueDate + '</strong></td>' +
                                               ' </tr>' +
                                            '</tbody>' +
                                       ' </table>' +
                                    '</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</td>' +
                '</tr>' +
                '<tr> <td><span class="style1" style="text-decoration:underline;">Terms &amp; Conditions</span> <br> <table width="100%" border="0" cellspacing="0" cellpadding="1" style="font-size:11px;"> <tbody><tr> <td width="5%" align="left" valign="top">1.</td>  <td align="left" valign="top">Any lay-by deposit is non-refundable. Change of mind or any cancellation of an order will be subject to a 20% cancellation fee.</td>   </tr>  <tr>  <td align="left" valign="top">2.</td> <td align="left" valign="top">   Returns not accepted unless the product is defected by manufacturing standards. Furnhouse can arrange a replacement or repair after the item has been returned or store credit to the equivalent value of the return product in current condition.<br>  a. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Furnhouse only will replace, repair, refund or allow store credit, if: <br>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; i. The goods are not merchantable quality.<br>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ii. The goods do not match the description.<br>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iii. The goods are not fit for the purpose described.<br>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iv. The goods are returned within 7 days of the buyer receiving it.  </td>   </tr> <tr> <td align="left" valign="top">3.</td> <td align="left" valign="top">Returns are not accepted if item is soiled, stained, damaged or tainted in any way or misused.</td> ' +
                '</tr> <tr> <td align="left" valign="top">4.</td><td align="left" valign="top">Floor stock is sold as is. It is the buyer’s responsibility to inspect the items before purchase. No warranty is included on floor stock. </td> </tr> <tr>  <td align="left" valign="top">5.</td> <td align="left" valign="top"> If you have any complaints or issues, please email to ' + mdata[0].OutletEmail + ' – with a description of the alleged fault and include pictures of the area in question. These will be assessed by our complaints department, and forwarded to the manufacturer. You will be contacted approximately 24-48 hours / or after a decision has been made.<br>  <table width="100%" border="0" cellspacing="0" cellpadding="1" style="font-size:11px;"> <tbody><tr> <td width="5%" align="left" valign="top">a.</td> <td align="left" valign="top">Any manufacturing defect, missing parts or damages must be notified within 7 days of delivery or collection. A replacement/repair will be arranged according to clauses 4 and 5.</td>  </tr>  <tr>  <td align="left" valign="top">b.</td>  <td align="left" valign="top">If it is established that the item has been affected by fair wear and tear, misuse, negligence, wilful damage, or accident by you or a third party, Furnhouse reserves the right to take no action.</td> </tr>  </tbody></table> </td> </tr>  <tr> <td align="left" valign="top">6.</td> <td align="left" valign="top">It is the buyer’s responsibility to measure a product to ensure it is a suitable size for their needs, as such a return will not be provided if the product is too big or small.</td> </tr> <tr><td align="left" valign="top">7.</td> <td align="left" valign="top">Furnhouse will not provide a refund if: <br> a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The goods arrived to you later than you’d expect. <br>   b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The buyer changed their mind or their circumstances have changed. </td> </tr>  </tbody></table> <br>  </td> </tr>' +
            '</tbody>' +
       ' </table>';


    content = p1 + p2 + pLast;

    $("#divSaleReport").append(content);
    setTimeout(function () {
        window.print();
    }, 400);
}




