var count = 0, Controller = "SalesReports", p1 = '', p2 = '', p3 = '', p4 = '', p5 = '', p6 = '', p7 = '', pLast = '', pp1 = '', pp2 = '', pp3 = '', pp4 = '';
var term = '', p11 = '', pLast1 = '';
p1 = '<table width="750" border="0" align="center" cellpadding="0" cellspacing="0">' +
           ' <tr>' +
               ' <td>' +
                   ' <table width="100%" border="0" cellspacing="0" cellpadding="5">' +
                      '  <tr> ' +
                           ' <td width="60%" style="font-size:12px;">' +
                              '  <table width="95%" border="0" cellspacing="0" cellpadding="0">' +
                                 '   <tr>' +
                                      '  <td width="31%"><img src="../App_Theme/assets/images/Reportlogo.png" width="70" height="70" /></td>' +
                                       ' <td width="69%" valign="top">' +
                                          '  <span class="style1" style="font-size: 15px;font-weight: bold;">Melbournians Furniture PTY LTD</span><br />' +
                                          '  A.B.N. 73 149 511 508<br /> ' +
   ' <span style="font-size: 14px;">email: cs@melbourniansfurniture.com.au </span><br /> ' +
   ' <span style="font-size: 14px;">Website: www.melbourniansfurniture.com.au </span>' +
                                      '  </td>' +
                                   ' </tr>' +
                              '  </table>' +
                          '  </td>' +
                           ' <td align="right" valign="middle">' +
                               ' <span class="style1">Tax Invoice<br /></span>' +
	'<table width="80%" border="0" cellspacing="0" cellpadding="2" style="font-size:12px;">';

p11 = '<table width="750" border="0" align="center" cellpadding="0" cellspacing="0">' +
           ' <tr>' +
               ' <td>' +
                   ' <table width="100%" border="0" cellspacing="0" cellpadding="5">' +
                      '  <tr> ' +
                           ' <td width="60%" style="font-size:12px;">' +
                              '  <table width="95%" border="0" cellspacing="0" cellpadding="0">' +
                                 '   <tr>' +
                                      ' <td width="31%"><img src="../App_Theme/assets/images/FrunHouseLogo.png" width="70" height="70" /></td>' +
                                       ' <td width="69%" valign="top">' +
                                          '  <span class="style1" style="font-size: 15px;font-weight: bold;">Melbournians Furniture PTY LTD</span><br />' +
                                          '  A.B.N. 73 149 511 508<br /> ' +
   ' <span style="font-size: 14px;">email: furnhouse2019@gmail.com</span><br /> ' +
   ' <span style="font-size: 14px;">Website: www.furnhouse.com.au </span>' +
                                      '  </td>' +
                                   ' </tr>' +
                              '  </table>' +
                          '  </td>' +
                           ' <td align="right" valign="middle">' +
                               ' <span class="style1">Tax Invoice<br /></span>' +
	'<table width="80%" border="0" cellspacing="0" cellpadding="2" style="font-size:12px;">';



p3 = ' </table>' +
     '</td>' +
                       ' </tr>' +
                   ' </table>' +
               ' </td>' +
           ' </tr>' +
           ' <tr>' +
               ' <td style="padding:0px 0px;">' +
                    '<table width="100%" border="0" cellspacing="0" cellpadding="5">' +
                    '  <tr>';

p6 = ' <table width="100%" border="1" cellpadding="4" cellspacing="0" bordercolor="#808080" style="font-size:12px;">' +
                      '  <tr>' +
                           ' <th width="8%" align="center" valign="middle" bgcolor="#d3d3d3">QTY</td>' +
                           ' <th width="15%" align="center" valign="middle" bgcolor="#d3d3d3">ITEM NO.</td>' +
                           ' <th valign="middle" bgcolor="#d3d3d3">DESCRIPTION</td>' +
                           ' <th width="15%" align="center" valign="middle" bgcolor="#d3d3d3">ITEM LOCATION</td>' +
                           ' <th width="12%" align="center" valign="middle" bgcolor="#d3d3d3">UNIT PRICE</td>' +
                           ' <th width="10%" align="center" valign="middle" bgcolor="#d3d3d3">DISC%</td>' +
                           ' <th width="10%" align="center" valign="middle" bgcolor="#d3d3d3">EXTENDED</td>' +
                           ' </tr>';


pp1 = '<table width="750" border="0" align="center" cellpadding="0" cellspacing="0">' +
    '<tr>' +
    '<td>' +
	'<table width="100%" border="0" cellspacing="0" cellpadding="5">' +
     ' <tr>' +
       ' <td width="70%" valign="top" style="font-size:12px;">' +
		'<table width="95%" border="0" cellspacing="0" cellpadding="5">' +
         ' <tr>' +
           ' <td width="25%" valign="top"><img src="../App_Theme/assets/images/NonPreLogo.png" width="113" height="38" /></td>' +
           ' <td width="75%" valign="top"><span class="style1" style="color:#005a96;font-size: 20px;font-weight: bold;">Melbournians Furniture PTY LTD</span><br />' +
             ' A.B.N. 73 149 511 508<br />' +
             ' <span class="style1 style3" style="color:#005a96;font-size: 15px;font-weight: bold;">6-12 Crawford Street Braeside Vic 3195</span></td>' +
         ' </tr>' +
       ' </table>' +
      '  <span class="style2" style="font-size: 15px;font-weight: bold;">Tax Invoice</span><br /></td>' +
      '  <td align="right" valign="bottom"><br />' +
      ' <table width="90%" border="0" cellspacing="0" cellpadding="5">';




$(document).ready(function () {
    var url_string = window.location.href;
    var url = new URL(url_string);
    let Invoice = url.searchParams.get("Invoice");
    term = url.searchParams.get("Term");
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
                if (term == 'Prepaid') {
                    setPrepaidtable(DataList);
                } else { seNonPrepaidtable(DataList); }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Something Wrong', type: 'error' });
        }
    });
}


function setPrepaidtable(DataList) {
    var content = '', quotes = '', quotext = ''; $("#divSaleReport").empty();
    var mdata = DataList[0];

    if (mdata[0].InvoiceType == "Invoice") {
        quotes = '';
    } else {
        var today = new Date();
        var entryDate = new Date(mdata[0].SaleDate);
        var diffDays = entryDate.getDate() - today.getDate();
        if (diffDays > 15 || diffDays < 0) {
            quotext = 'THIS QUOTES WAS EXPIRED';
        } else { quotext = 'Quotes' }

        quotes = ' <tr style="text-align: center;"><td style="padding:5px; background:#ff0000;><div style="font-size:15px; font-weight:bold; text-align:center;"><b>' + quotext + '</b></div></td></tr>';
    }
    var p2 = ' <tr>' +
                //'<td colspan="2"><strong>Invoice No : &nbsp; ' + mdata[0].InvoiceNo + '</strong></td>' +
                 ' <td><strong>Invoice No </strong></td>' +
                 ' <td align="right"><strong>' + mdata[0].InvoiceNo + '</strong></td>' +
                 ' </tr>' +
                 ' <tr>' +
                 ' <td>Date</td>' +
                 ' <td align="right">' + mdata[0].SaleDate + '</td>' +
                  ' </tr>' +
                  ' <tr>' +
                   ' <td>Order Place </td>' +
                   ' <td align="right">' + mdata[0].SaleOutlateName + '</td>' +
                   ' </tr>' +
                  ' <tr>' +
            '  <td>Sales Person</td>' +
         ' <td align="right">' + mdata[0].SalesPersonName + '</td>' +
      ' </tr>';


    p4 = '<td width="60%" style="font-size:12px;">' +
                              '  <span style="font-weight:bold;" class="style2">Customer Details:</span><br />' +
                             '' + mdata[0].Name + '<br/>' +
                              '' + mdata[0].ShipTo + ' <br/>' +
                              '' + mdata[0].City + ' <br />' +
                               'Phone:' + mdata[0].MobileNo + ' <br/>' +
                           ' </td>' +
                           ' <td valign="bottom">' +
                             '   <table width="100%" border="0" cellspacing="0" cellpadding="5" style="font-size:12px;">' +
                                   ' <tr>' +
                                      '  <td width="47%" align="center" valign="middle">Delivery Via</td>' +
                                      '  <td width="6%" align="center" valign="middle">&nbsp;</td>' +
                                       ' <td width="47%" align="center" valign="middle">Delivery Date</td>' +
                                       '   </tr>';


    p5 = '<tr>' +
                 ' <td align="center" valign="middle" style="border:thin solid #000000;"><strong>' + mdata[0].DeliveryMethod + '</strong></td>' +
                                 ' <td align="center" valign="middle">&nbsp;</td>' +
                                 ' <td align="center" valign="middle" style="border:thin solid #000000;">' + mdata[0].DateFrom + '</td>' +
                            '  </tr>' +
                        '  </table>' +
                     ' </td>' +
                 ' </tr>' +
            '  </table>' +
         ' </td>' +
    '  </tr>' + quotes +
	//' <tr style="text-align: center;">' +
    //          ' <td style="padding:10px; background:#ff0000;><div style="font-size:15px; font-weight:bold; text-align:center;"><b>Quotes</b></div></td>' +
    // '</tr>' +
     ' <tr>' +
     ' <td>';
    var ln = DataList[1].length - 1;
    var br = '', trstyle = '', tdstyle = '', dollar = '';
    $.each(DataList[1], function (i, row) {
          if (i == ln) {
              br = '<br />';
          }
          if (row.Itemtype == 'combo') {
              trstyle = 'style="font-style: italic;font-size: 9px;"';
              tdstyle = 'style="text-align: right;"';
              dollar = '';
          } else { trstyle = ''; tdstyle = ''; dollar = '$' }

          p7 += ' <tr ' + trstyle + '>' +
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

    pLast = '   </table>  </td>' +
         '  </tr>' +
         '  <tr>' +
             '  <td style="padding:10px 10px 0 0;">' +
                 '  <table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                      ' <tr>' +
                          ' <td width="60%" valign="bottom" style="padding:0px 10px;">' +
                              ' <span class="style2">Comment: <br /></span>' +
                             '  <table width="100%" border="0" cellspacing="0" cellpadding="5">' +
                                 '  <tr>' +
                                      ' <td style="border:thin solid #000; font-size:12px;">' +
                                         '  ' + mdata[0].Comments + '<br /> <br /> <br />' +
                                      ' </td>' +
                                 '  </tr>' +
                              ' </table>' +
                         '  </td>' +
                         '  <td width="3%">&nbsp;</td>' +
                         '  <td style="border:thin solid #000;" class="style2">' +
                              ' <table width="90%" border="0" align="center" cellpadding="2" cellspacing="0">' +
                                  ' <tr>' +
                                     '  <td>Subtotal</td>' +
                                     '  <td align="right">$ ' + mdata[0].SubTotal + ' </td>' +
                                  ' </tr>' +
                                 '<tr>' +
                                     '  <td>Freight</td>' +
                                     '  <td align="right">$ ' + mdata[0].Freight + ' </td>' +
                                  ' </tr>' +
                                  '<tr>' +
                                     '  <td>Additional Discount</td>' +
                                     '  <td align="right">$ ' + mdata[0].ManagerDiscount + ' </td>' +
                                  ' </tr>' +
                                  ' <tr>' +
                                     '  <td>GST</td>' +
                                     '  <td align="right">$ ' + mdata[0].Tax + ' </td>' +
                                  ' </tr>' +
                                  ' <tr>' +
                                     '  <td>Total</td>' +
                                     '  <td align="right">$ ' + mdata[0].TotalAmount + ' </td>' +
                                 '  </tr>' +
                                  ' <tr>' +
                                      ' <td>Applied</td>' +
                                      ' <td align="right">$ ' + mdata[0].PaidToday + '</td>' +
                                  ' </tr>' +
                                   ' <tr>' +
                                      ' <td>Balance Due</td>' +
                                      ' <td align="right">$ ' + mdata[0].Due + '</td>' +
                                  ' </tr>' +

                             '  </table>' +
                        '  </td>' +
                      ' </tr>' +
                  ' </table>' +
              ' </td>' +
         '  </tr>' +
          ' <tr>' +
              ' <td style="padding:5px;"><div style="padding:2px; border:thin solid #666666; font-size:12px; text-align:center;">Warehouse Address: 6-12 Crawford Street, Braeside VIC 3195. Open: 9am-5pm (Monday-Friday), 7am-3pm (Saturday), (PH: 04 31499687). <br /><b>Closed Sun & Wed + Public Holidays</b></div></td>' +
         '  </tr>' +


		 '  <tr>' +
    		' <td style="padding:10px; font-size:11px;">' +
				' <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:11px;">' +
      			' <tr>' +
        			' <td width="5%" align="left" valign="top"><img src="../App_Theme/assets/images/visa-logo.png" width="23" height="25" /></td>' +
        			' <td width="55%" align="left" valign="top"><strong>How to Pay</strong><br />by credit card<br />To pay via MasterCard or VISA<br />Minimum payment $10.00. Maximum payment $10,000.<br /><br />2% surcharge will be applied in case of credit card  payment </td>' +
        			' <td colspan="2" align="left" valign="top"><strong>Bank Deposit</strong><br />Account Name-Melbournians Furniture Pty Ltd<br />BSB Number-033090<br />Account Number-395341 </td>' +
		'  </tr>' +
      	' <tr>' +
        	' <td align="left" valign="top">&nbsp;</td>' +
        	' <td align="left" valign="top">&nbsp;</td>' +
        	' <td colspan="2" align="left" valign="top" style="border-bottom:thin solid #000000;">&nbsp;</td>' +
      	'  </tr>' +
      	' <tr>' +
        	' <td align="left" valign="top">&nbsp;</td>' +
        	' <td align="left" valign="top">&nbsp;</td>' +
        	' <td align="left" valign="top">Invoice No: <strong>' + mdata[0].InvoiceNo + '</strong></td>' +
        	' <td align="left" valign="top">Amount Due: <strong>$ ' + mdata[0].Due + '</strong> </td>' +
      '  </tr>' +
    '  </table>' +
	'  </td>' +
  '  </tr>' +
  ' <tr>' +
              ' <td>' +
                   '<span class="style1" style="text-decoration:underline;">Terms &amp; Conditions</span>' +
                  ' <br />' +
                  ' <table width="100%" border="0" cellspacing="0" cellpadding="1" style="font-size:11px;">' +
                      ' <tr>' +
                          ' <td width="5%" align="left" valign="top">1.</td>' +
                         '  <td align="left" valign="top">Any lay-by deposit is non-refundable. Change of mind or any cancellation of an order will be subject to a 20% cancellation fee.</td>' +
                    '   </tr>' +
                     '  <tr>' +
                         '  <td align="left" valign="top">2.</td>' +
                          ' <td align="left" valign="top">' +
                            '   Returns not accepted unless the product is defected by manufacturing standards. Melbournians Furniture can arrange a replacement or repair after the item has been returned or store credit to the equivalent value of the return product in current condition.<br />' +
                             '  a. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Melbournian&rsquo;s Furniture only will replace, repair, refund or allow store credit, if: <br />' +
                            '   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; i. The goods are not merchantable quality.<br />' +
                            '   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ii. The goods do not match the description.<br />' +
                            '   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iii. The goods are not fit for the purpose described.<br />' +
                            '   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iv. The goods are returned within 7 days of the buyer receiving it.' +
                         '  </td>' +
                    '   </tr>' +
                      ' <tr>' +
                          ' <td align="left" valign="top">3.</td>' +
                          ' <td align="left" valign="top">Returns are not accepted if item is soiled, stained, damaged or tainted in any way or misused.</td>' +
                      ' </tr>' +
                      ' <tr>' +
                          ' <td align="left" valign="top">4.</td>' +
                           '<td align="left" valign="top">Floor stock is sold as is. It is the buyer’s responsibility to inspect the items before purchase. No warranty is included on floor stock. </td>' +
                       ' </tr>' +
                      ' <tr>' +
                         '  <td align="left" valign="top">5.</td>' +
                          ' <td align="left" valign="top">' +
                              ' If you have any complaints or issues, please email to cs@melbourniansfurniture.com.au &ndash; with a description of the alleged fault and include pictures of the area in question. These will be assessed by our complaints department, and forwarded to the manufacturer. You will be contacted approximately 24-48 hours / or after a decision has been made.<br />' +
                             '  <table width="100%" border="0" cellspacing="0" cellpadding="1" style="font-size:11px;">' +
                                  ' <tr>' +
                                      ' <td width="5%" align="left" valign="top">a.</td>' +
                                      ' <td align="left" valign="top">Any manufacturing defect, missing parts or damages must be notified within 7 days of delivery or collection. A replacement/repair will be arranged according to clauses 4 and 5.</td>' +
                                 '  </tr>' +
                                 '  <tr>' +
                                     '  <td align="left" valign="top">b.</td>' +
                                     '  <td align="left" valign="top">If it is established that the item has been affected by fair wear and tear, misuse, negligence, wilful damage, or accident by you or a third party, Melbournians Furniture reserves the right to take no action.</td>' +
                                  ' </tr>' +
                             '  </table>' +
                          ' </td>' +
                      ' </tr>' +
                     '  <tr>' +
                          ' <td align="left" valign="top">6.</td>' +
                          ' <td align="left" valign="top">It is the buyer’s responsibility to measure a product to ensure it is a suitable size for their needs, as such a return will not be provided if the product is too big or small.</td>' +
                      ' </tr>' +
                      ' <tr>' +
                           '<td align="left" valign="top">7.</td>' +
                          ' <td align="left" valign="top">' +
                             'Melbournians Furniture will not provide a refund if: <br />' +
                              ' a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The goods arrived to you later than you’d expect. <br />' +
                            '   b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The buyer changed their mind or their circumstances have changed.' +
                          ' </td>' +
                      ' </tr>' +
                 '  </table>' +
                  ' <br />' +
             '  </td>' +
          ' </tr>' +
          '  </table>';


    pLast1 = '   </table>  </td>' +
        '  </tr>' +
        '  <tr>' +
            '  <td style="padding:10px 10px 0 0;">' +
                '  <table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                     ' <tr>' +
                         ' <td width="60%" valign="bottom" style="padding:0px 10px;">' +
                             ' <span class="style2">Comment: <br /></span>' +
                            '  <table width="100%" border="0" cellspacing="0" cellpadding="5">' +
                                '  <tr>' +
                                     ' <td style="border:thin solid #000; font-size:12px;">' +
                                        '  ' + mdata[0].Comments + '<br /> <br /> <br />' +
                                     ' </td>' +
                                '  </tr>' +
                             ' </table>' +
                        '  </td>' +
                        '  <td width="3%">&nbsp;</td>' +
                        '  <td style="border:thin solid #000;" class="style2">' +
                             ' <table width="90%" border="0" align="center" cellpadding="2" cellspacing="0">' +
                                 ' <tr>' +
                                    '  <td>Subtotal</td>' +
                                    '  <td align="right">$ ' + mdata[0].SubTotal + ' </td>' +
                                 ' </tr>' +
                                '  <tr>' +
                                    '  <td>Freight</td>' +
                                    '  <td align="right">$ ' + mdata[0].Freight + ' </td>' +
                                 ' </tr>' +
                                  '<tr>' +
                                     '  <td>Additional Discount</td>' +
                                     '  <td align="right">$ ' + mdata[0].ManagerDiscount + ' </td>' +
                                  ' </tr>' +
                                 ' <tr>' +
                                    '  <td>GST</td>' +
                                    '  <td align="right">$ ' + mdata[0].Tax + ' </td>' +
                                 ' </tr>' +
                                 ' <tr>' +
                                    '  <td>Total</td>' +
                                    '  <td align="right">$ ' + mdata[0].TotalAmount + ' </td>' +
                                '  </tr>' +
                                 ' <tr>' +
                                     ' <td>Applied</td>' +
                                     ' <td align="right">$ ' + mdata[0].PaidToday + '</td>' +
                                 ' </tr>' +
                                  ' <tr>' +
                                     ' <td>Balance Due</td>' +
                                     ' <td align="right">$ ' + mdata[0].Due + '</td>' +
                                 ' </tr>' +

                            '  </table>' +
                       '  </td>' +
                     ' </tr>' +
                 ' </table>' +
             ' </td>' +
        '  </tr>' +
         ' <tr>' +
             ' <td style="padding:5px;"><div style="padding:2px; border:thin solid #666666; font-size:12px; text-align:center;">Warehouse Address: 6-12 Crawford Street, Braeside VIC 3195. Open: 9am-5pm (Monday-Friday), 7am-3pm (Saturday), (PH: 04 31499687).<br /><b>Closed Sun & Wed + Public Holidays</b></div></td>' +
        '  </tr>' +


        '  <tr>' +
           ' <td style="padding:10px; font-size:11px;">' +
               ' <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:11px;">' +
               ' <tr>' +
                   ' <td width="5%" align="left" valign="top"><img src="../App_Theme/assets/images/visa-logo.png" width="23" height="25" /></td>' +
                   ' <td width="55%" align="left" valign="top"><strong>How to Pay</strong><br />by credit card<br />To pay via MasterCard or VISA<!--br />By Phone-04 3149 9710 --><br />Minimum payment $10.00. Maximum payment $10,000.<br /><br />2% surcharge will be applied in case of credit card  payment </td>' +
                   ' <td colspan="2" align="left" valign="top"><strong>Bank Deposit</strong><br />Account Name-Melbournians Furniture Pty Ltd<br />BSB Number-033090<br />Account Number-395341 </td>' +
       '  </tr>' +
       ' <tr>' +
           ' <td align="left" valign="top">&nbsp;</td>' +
           ' <td align="left" valign="top">&nbsp;</td>' +
           ' <td colspan="2" align="left" valign="top" style="border-bottom:thin solid #000000;">&nbsp;</td>' +
       '  </tr>' +
       ' <tr>' +
           ' <td align="left" valign="top">&nbsp;</td>' +
           ' <td align="left" valign="top">&nbsp;</td>' +
           ' <td align="left" valign="top">Invoice No: <strong>' + mdata[0].InvoiceNo + '</strong></td>' +
           ' <td align="left" valign="top">Amount Due: <strong>$ ' + mdata[0].Due + '</strong> </td>' +
     '  </tr>' +
   '  </table>' +
   '  </td>' +
 '  </tr>' +
 ' <tr>' +
             ' <td>' +
                  '<span class="style1" style="text-decoration:underline;">Terms &amp; Conditions</span>' +
                 ' <br />' +
                 ' <table width="100%" border="0" cellspacing="0" cellpadding="1" style="font-size:11px;">' +
                     ' <tr>' +
                         ' <td width="5%" align="left" valign="top">1.</td>' +
                        '  <td align="left" valign="top">Any lay-by deposit is non-refundable. Change of mind or any cancellation of an order will be subject to a 20% cancellation fee.</td>' +
                   '   </tr>' +
                    '  <tr>' +
                        '  <td align="left" valign="top">2.</td>' +
                         ' <td align="left" valign="top">' +
                           '   Returns not accepted unless the product is defected by manufacturing standards. Furn House can arrange a replacement or repair after the item has been returned or store credit to the equivalent value of the return product in current condition.<br />' +
                            '  a. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Furn House only will replace, repair, refund or allow store credit, if: <br />' +
                           '   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; i. The goods are not merchantable quality.<br />' +
                           '   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ii. The goods do not match the description.<br />' +
                           '   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iii. The goods are not fit for the purpose described.<br />' +
                           '   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; iv. The goods are returned within 7 days of the buyer receiving it.' +
                        '  </td>' +
                   '   </tr>' +
                     ' <tr>' +
                         ' <td align="left" valign="top">3.</td>' +
                         ' <td align="left" valign="top">Returns are not accepted if item is soiled, stained, damaged or tainted in any way or misused.</td>' +
                     ' </tr>' +
                     ' <tr>' +
                         ' <td align="left" valign="top">4.</td>' +
                          '<td align="left" valign="top">Floor stock is sold as is. It is the buyer’s responsibility to inspect the items before purchase. No warranty is included on floor stock. </td>' +
                      ' </tr>' +
                     ' <tr>' +
                        '  <td align="left" valign="top">5.</td>' +
                         ' <td align="left" valign="top">' +
                             ' If you have any complaints or issues, please email to cs@melbourniansfurniture.com.au &ndash; with a description of the alleged fault and include pictures of the area in question. These will be assessed by our complaints department, and forwarded to the manufacturer. You will be contacted approximately 24-48 hours / or after a decision has been made.<br />' +
                            '  <table width="100%" border="0" cellspacing="0" cellpadding="1" style="font-size:11px;">' +
                                 ' <tr>' +
                                     ' <td width="5%" align="left" valign="top">a.</td>' +
                                     ' <td align="left" valign="top">Any manufacturing defect, missing parts or damages must be notified within 7 days of delivery or collection. A replacement/repair will be arranged according to clauses 4 and 5.</td>' +
                                '  </tr>' +
                                '  <tr>' +
                                    '  <td align="left" valign="top">b.</td>' +
                                    '  <td align="left" valign="top">If it is established that the item has been affected by fair wear and tear, misuse, negligence, wilful damage, or accident by you or a third party, Furn House reserves the right to take no action.</td>' +
                                 ' </tr>' +
                            '  </table>' +
                         ' </td>' +
                     ' </tr>' +
                    '  <tr>' +
                         ' <td align="left" valign="top">6.</td>' +
                         ' <td align="left" valign="top">It is the buyer’s responsibility to measure a product to ensure it is a suitable size for their needs, as such a return will not be provided if the product is too big or small.</td>' +
                     ' </tr>' +
                     ' <tr>' +
                          '<td align="left" valign="top">7.</td>' +
                         ' <td align="left" valign="top">' +
                            'Furn House will not provide a refund if: <br />' +
                             ' a.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The goods arrived to you later than you’d expect. <br />' +
                           '   b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The buyer changed their mind or their circumstances have changed.' +
                         ' </td>' +
                     ' </tr>' +
                '  </table>' +
                 ' <br />' +
            '  </td>' +
         ' </tr>' +
         '  </table>';


    if (mdata[0].SaleOutlateName == "Hoppers Crossing Store") {
        content = p11 + p2 + p3 + p4 + p5 + p6 + p7 + pLast1;
    } else { content = p1 + p2 + p3 + p4 + p5 + p6 + p7 + pLast; }

    $("#divSaleReport").append(content);
    setTimeout(function () {
        window.print();
    }, 400);
}


function seNonPrepaidtable(DataList) {
    var content = ''; $("#divSaleReport").empty();
    var mdata = DataList[0];

    pp2 = ' <tr> ' +
           '<td style="border:thin solid #000;"><table width="100%" border="0" cellspacing="3" cellpadding="2" style="font-size:12px;">' +
          ' <tr>' +
           '  <td align="right"><strong>Invoice No.</strong></td>' +
            ' <td><strong>:</strong></td>' +
             '<td align="right">' + mdata[0].InvoiceNo + '</td>' +
          ' </tr>' +
          ' <tr>' +
           '  <td align="right"><strong>Date</strong></td>' +
            ' <td><strong>:</strong></td>' +
            ' <td align="right">' + mdata[0].SaleDate + ' </td>' +
         '  </tr>' +
          ' <tr>' +
            ' <td align="right"><strong>Your Ref</strong></td>' +
            ' <td><strong>:</strong></td>' +
           '  <td align="right">' + mdata[0].ReferenceNo + '</td>' +
         '  </tr>' +
          ' <tr>' +
            ' <td align="right"><strong>Terms</strong></td>' +
           '  <td><strong>:</strong></td>' +
            ' <td align="right">' + mdata[0].SalesType + '</td>' +
         '  </tr>' +
        ' </table></td>' +
        ' </tr>' +
      ' </table>' +
      ' </td>' +
    ' </tr>' +
  ' </table>' +
  ' </td>' +
 '</tr>' +
  ' <tr>' +
 '  <td style="padding:10px 0px;"><table width="100%" border="0" cellspacing="0" cellpadding="5">' +
    ' <tr>' +
      ' <td width="60%" style="font-size:12px; border:thin solid #000;">' + mdata[0].Website + '<br />' +
       ' ' + mdata[0].Name + '<br />' +
       ' ' + mdata[0].ShipTo + '<br />' +
        '' + mdata[0].City + '<br /></td>' +
     '  <td width="3%" style="font-size:12px;">&nbsp;</td>' +
     '  <td width="37%" valign="top" style="border:thin solid #000;"><table width="100%" border="1" cellpadding="2" cellspacing="0" bordercolor="#bfbfbf" style="font-size:12px;">' +
        ' <tr>' +
        '   <td width="10%" align="left" valign="middle" bgcolor="#ededed"><strong>Delivery Address:</strong></td>' +
        '   </tr>' +
       '  <tr>' +
         '  <td align="left" valign="top">' + mdata[0].FirstName + '<br />' +
          '' + mdata[0].LastName + '<br /> ' +
          '' + mdata[0].Phone2 + '<br /> ' +
          '' + mdata[0].MobileNo + '</td>' +
          ' </tr>' +
      ' </table></td>' +
    ' </tr>' +
  ' </table></td>' +
' </tr>' +
' <tr>' +
 '  <td>' +
 '  <table width="100%" border="1" cellpadding="2" cellspacing="0" bordercolor="#808080" style="font-size:12px;">' +
  '  <tr>' +
     '  <td width="10%" align="center" valign="middle" bgcolor="#d3d3d3">QUANTITY </td>' +
     '  <td width="13%" align="center" valign="middle" bgcolor="#d3d3d3">ITEM CODE</td>' +
     '  <td valign="middle" bgcolor="#d3d3d3">DESCRIPTION</td>' +
     '  <td width="15%" align="center" valign="middle" bgcolor="#d3d3d3">ITEM LOCATION</td>' +
     '  <td width="17%" align="center" valign="middle" bgcolor="#d3d3d3">UNIT PRICE(' + mdata[0].TaxType + ')</td>' +
     '  <td width="7%" align="center" valign="middle" bgcolor="#d3d3d3">DISC%</td>' +
      ' <td width="18%" align="center" valign="middle" bgcolor="#d3d3d3">TOTAL PRICE(' + mdata[0].TaxType + ')</td>' +
    ' </tr>'


    pp4 = '</table>' +
	'</td>' +
    ' </tr>' +
     ' <tr>' +
   ' <td style="padding-top:15px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">' +
     ' <tr>' +
       ' <td width="60%" valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="5">' +
          '  <tr>' +
            '  <td valign="top" style="border:thin solid #000; font-size:12px;">' +
              '  <span class="style4"><strong>Delivery via:   </strong>' + mdata[0].DeliveryMethod + '<br />' +
              '  <strong>Despatch Date: </strong>' + mdata[0].DateFrom + ' <br />' +
               ' <strong>Salesperson:   </strong>' + mdata[0].SalesPersonName + '</span><br />' +
               ' <br /></td>' +
         '   </tr>' +
         ' </table>' +
         ' <br />' +
         ' <br />' +
        '  <span style="font-family:Times New Roman, Times, serif; font-size:15px; color:#666666;">We appreciate your business.</span></td>' +
      '  <td width="3%">&nbsp;</td>' +
     '   <td valign="top" style="font-size:12px; line-height:18px;"><table width="100%" border="0" cellspacing="0" cellpadding="5">' +
        '  <tr>' +
          '<td style="border-top:thin solid #000; border-left:thin solid #000; border-right:thin solid #000; padding-left:25px; font-size: 15px;">Subtotal:<br />' +
          'Freight (' + mdata[0].TaxType + '):<br />' +
          'Additional Discount:<br />' +
          'GST:<br /></td>' +
          '  <td align="right" valign="top" style="border-top:thin solid #000; border-right:thin solid #000; font-size: 15px;">$ ' + mdata[0].SubTotal + '<br />' +
          '  $ ' + mdata[0].Freight + '<br />' +
          '  $ ' + mdata[0].ManagerDiscount + '<br />' +
          '  $ ' + mdata[0].Tax + '</td>' +
         ' </tr>' +
        '  <tr>' +
           ' <td style="border-top:thin solid #000; border-left:thin solid #000; border-right:thin solid #000; padding-left:25px; font-size: 15px;">Total (inc-GST):<br />' +
            '  Paid to Date</td>' +
           ' <td align="right" valign="top" style="border-top:thin solid #000; border-right:thin solid #000; font-size: 15px;">$ ' + mdata[0].TotalAmount + '<br /> $ ' + mdata[0].PaidToday + '</td>' +
        '  </tr>' +
		 ' <tr>' +
          '  <td align="right" bgcolor="#ededed" style="border-top:thin solid #000; border-bottom:thin solid #000; border-left:thin solid #000; border-right:thin solid #000;"><strong>Balance Due:<br />' +
           ' </strong></td>' +
          '  <td align="right" bgcolor="#ededed" style="border-top:thin solid #000; border-bottom:thin solid #000; border-right:thin solid #000;"><strong>$ ' + mdata[0].Due + '</strong></td>' +
         ' </tr>' +
      '  </table></td>' +
     ' </tr>' +

   ' </table></td>' +
 ' </tr>' +
 ' <tr>' +
   ' <td style="padding:10px;">&nbsp;</td>' +
 ' </tr>' +
 ' <tr>' +
   ' <td><br />' +
    '  <br />' +
   ' <br />  </td>' +
  '</tr>' +

  ' <tr>' +
' <td style="padding:10px; font-size:11px;">' +
' <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:11px;">' +
' <tr>' +
' <td width="5%" align="left" valign="top"><img src="../App_Theme/assets/images/visa-logo.png" width="23" height="25" /></td>' +
' <td width="55%" align="left" valign="top"><strong>How to Pay</strong><br />by credit card<br />To pay via MasterCard or VISA<br />Minimum payment $10.00. Maximum payment $10,000.<br /><br />2% surcharge will be applied in case of credit card payment </td>' +
' <td colspan="2" align="left" valign="top"><strong>Bank Deposit</strong><br />Account Name-Melbournians Furniture Pty Ltd<br />BSB Number-033090<br />Account Number-395341 </td>' +
' </tr>' +
' <tr>' +
' <td align="left" valign="top">&nbsp;</td>' +
' <td align="left" valign="top">&nbsp;</td>' +
' <td colspan="2" align="left" valign="top" style="border-bottom:thin solid #000000;">&nbsp;</td>' +
' </tr>' +
' <tr>' +
' <td align="left" valign="top">&nbsp;</td>' +
' <td align="left" valign="top">&nbsp;</td>' +
' <td align="left" valign="top">Invoice No: <strong>' + mdata[0].InvoiceNo + '</strong></td>' +
' <td align="left" valign="top">Amount Due: <strong>$ ' + mdata[0].Due + '</strong> </td>' +
' </tr>' +
' </table>' +
' </td>' +
' </tr>' +







'</table>';

    var ln = DataList[1].length - 1;
    var br = '', trstyle = '', tdstyle = '', dollar = '';
    $.each(DataList[1],function (i, row) {
          if (i == ln) {
              br = '<br /><br /><br /><br /><br /><br /><br />';
          }
          if (row.Itemtype == 'combo') {
              trstyle = 'style="font-style: italic;font-size: 9px;"';
              tdstyle = 'style="text-align: right;"';
              dollar = '';
          } else { trstyle = ''; tdstyle = ''; dollar = '$' }
          pp3 += ' <tr ' + trstyle + '>' +
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


    content = pp1 + pp2 + pp3 + pp4;
    $("#divSaleReport").append(content);
    setTimeout(function () {
        window.print();
    }, 400);

}


