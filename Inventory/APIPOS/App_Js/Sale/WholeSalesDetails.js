var count = 0, Controller = "DataAccess";

$("span#sidebar-toggle").trigger('click');
$('#txtFrom').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
$('#txtTo').datepicker({ dateFormat: 'dd-M-yy' });
getDate();
function getDate() {

    var monthsArr = new Array();
    // store month names into our array
    monthsArr[0] = "Jan";
    monthsArr[1] = "Feb";
    monthsArr[2] = "Mar";
    monthsArr[3] = "Apr";
    monthsArr[4] = "May";
    monthsArr[5] = "Jun";
    monthsArr[6] = "Jul";
    monthsArr[7] = "Aug";
    monthsArr[8] = "Sep";
    monthsArr[9] = "Oct";
    monthsArr[10] = "Nov";
    monthsArr[11] = "Dec";

    var todaydate = new Date();
    var day = todaydate.getDate();
    var month = todaydate.getMonth();
    var year = todaydate.getFullYear();
    var date = day + "-" + monthsArr[month] + "-" + year;
    var datefrm = day + "-" + monthsArr[month - 1] + "-" + year;
    document.getElementById("txtFrom").value = datefrm;
    document.getElementById("txtTo").value = date;
}
Loaddatatable('In');

function Loaddatatable(type) {
    var urlpath = base + Controller + "/GetWholeSalesDetails";
    let fromDate = $("#txtFrom").val();
    let toDate = $("#txtTo").val();
    $.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        data: JSON.stringify({ "FromDate": fromDate, "Todate": toDate, "type": type }),
        success: function (result) {
            if (result.IsSessionOut != null) {
                $("#divTable").empty();
                console.log(result);
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $("#divTable").empty();
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                console.log(result.data);
                BindTable(result.data);
            }
        }
    });
}

function BindTable(data) {
    $("#divTable").empty();
    var content = '';
    content += TableHeader();
    content += '<tbody>';
    content += TableRow(data);
    content += '</tbody>';
    $("#divTable").append(content);
    $('#demo-dtable-04').dataTable({
        // "iDisplayLength": -1,
        "bDestroy": true,
        'ajax': 'https://api.myjson.com/bins/qgcu',
        'rowsGroup': [2],
        "aaSorting": [[1, 'asc']],


    });
}

function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped table-bordered">' +
        '<thead>' +
        '<tr>' +
        ' <th>Customer</th>' +
        '<th>Order No</th>' +      
        '<th>Added By</th>' +
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
        '<th>Invoice Number</th>' +
        '<th>Payment Option</th>' +
        '<th>Payment Status</th>' +
        '<th>Delivery Method</th>' +
        '<th>Booking Status</th>' +
        '<th style="width:50px;">Tracking Number</th>' +
        '<th>Dispatch Status</th>' +        
        '<th>Dispatch Date</th>' + 
        '<th>Actual Freight</th>' +
        '<th>Notify Buyer</th>' +
        '<th>Note</th>' +
        '<th></th>' +
        '</tr>' +
        '</thead>';
    return content;
}

function TableRow(result) {
    $("#divTable").empty();
    let content = '';
    //if (result.length > 0) {
    console.log(result);


    // Create Array  ...

    var ar = [];
    var olist = result;
    $(olist).each(function (index, element) {

        ar.push(element.Order_No);

    });
    console.log(ar);
    // End Create Array ...

    var counter = 0;
    var prevsalesrecord;

    $(olist).each(function (index, element) {
        let color = '';
        let colors = '';
        if (element.Comment == 'Despatched') {
            colors = 'background-color: green;';
            color = 'background-color: green;';
        }
        else {
            // element.Comment = "Awaiting";
            colors = 'background-color: red;';
            color = 'background-color: white;';
        }




        var findvalue = 0;
        for (var i = 0; i < ar.length; i++) {
            if (ar[i] == element.Order_No) {

                findvalue++;
            }
        }
        console.log(findvalue);






        if (prevsalesrecord != element.Order_No) {

            content += '<tr style="' + color + ' ">' +
                '<td style="' + color + ' ">' + element.Customer + '</td>' +
                '<td style="' + color + ' ">' + element.Order_No + '</td>' +
                '<td style="' + color + ' " rowspan=' + findvalue + '>' + element.Added_By + '</td>' +
                '<td style="' + color + ' " rowspan=' + findvalue + '>' + element.Added_Date + '</td>' +
                '<td style="' + color + ' " rowspan=' + findvalue + '>' + element.Receiver_Name + '</td>' +
                '<td style="' + color + ' " rowspan=' + findvalue + '>' + element.Delivery_Address + '</td>' +
                '<td style="' + color + ' ">' + element.City + '</td>' +
                '<td style="' + color + ' ">' + element.Post_Code + '</td>' +
                '<td style="' + color + ' ">' + element.State + '</td>' +
                '<td style="' + color + ' ">' + element.Phone + '</td>' +
                '<td style="' + color + ' ">' + element.Item_Code + '</td>' +
                '<td style="' + color + ' ">' + element.Item_Name + '</td>' +
                '<td style="' + color + ' ">' + element.Quantity + '</td>' +
                '<td style="' + color + ' ">' + element.Unit_Price + '</td>' +
                '<td style="' + color + ' ">' + element.GST + '</td>' +
                '<td style="' + color + ' ">' + element.Shipping_Cost + '</td>' +
                '<td style="' + color + ' ">' + element.Total + '</td>' +
                '<td style="' + color + ' ">' + element.Invoice_Status + '</td>' +
                '<td style="' + color + ' ">' + element.Invoice_Number + '</td>' +
                '<td style="' + color + ' ">' + element.Payment_Option + '</td>' +
                '<td style="' + color + ' ">' + element.Payment_Status + '</td>' +
                '<td style="' + color + ' ">' + element.Delivery_Method + '</td>' +
                '<td style="' + color + ' ">' + element.Booking_Status + '</td>' +
                '<td style="' + color + ' width:50px;" >' + element.Tracking_Number + '</td>' +
                '<td style="' + color + ' ">' + element.Despatch_Status + '</td>' +
                '<td style="' + color + ' ">' + element.Despatch_Date + '</td>' +
                '<td style="' + color + ' ">' + element.Actual_Freight + '</td>' +
                '<td style="' + color + ' ">' + element.Notify_Buyer + '</td>' +
                '<td style="' + colors + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Note + '</td>' +
                '<td></td>'+
                '</tr>';



        }
        else {

            content += '<tr style="' + color + ' ">' +
                '<td style="' + color + ' ">' + element.Customer + '</td>' +
                '<td style="' + color + ' ">' + element.Order_No + '</td>' +
                '<td style="' + color + ' ">' + element.Added_By + '</td>' +
                '<td style="' + color + ' ">' + element.Added_Date + '</td>' +
                '<td style="' + color + ' ">' + element.Receiver_Name + '</td>' +
                '<td style="' + color + ' ">' + element.Delivery_Address + '</td>' +
                '<td style="' + color + ' ">' + element.City + '</td>' +
                '<td style="' + color + ' ">' + element.Post_Code + '</td>' +
                '<td style="' + color + ' ">' + element.State + '</td>' +
                '<td style="' + color + ' ">' + element.Phone + '</td>' +
                '<td style="' + color + ' ">' + element.Item_Code + '</td>' +
                '<td style="' + color + ' ">' + element.Item_Name + '</td>' +
                '<td style="' + color + ' ">' + element.Quantity + '</td>' +
                '<td style="' + color + ' ">' + element.Unit_Price + '</td>' +
                '<td style="' + color + ' ">' + element.GST + '</td>' +
                '<td style="' + color + ' ">' + element.Shipping_Cost + '</td>' +
                '<td style="' + color + ' ">' + element.Total + '</td>' +
                '<td style="' + color + ' ">' + element.Invoice_Status + '</td>' +
                '<td style="' + color + ' ">' + element.Invoice_Number + '</td>' +
                '<td style="' + color + ' ">' + element.Payment_Option + '</td>' +
                '<td style="' + color + ' ">' + element.Payment_Status + '</td>' +
                '<td style="' + color + ' ">' + element.Delivery_Method + '</td>' +
                '<td style="' + color + ' ">' + element.Booking_Status + '</td>' +
                '<td style="' + color + ' width:50px;" >' + element.Tracking_Number + '</td>' +
                '<td style="' + color + ' ">' + element.Despatch_Status + '</td>' +
                '<td style="' + color + ' ">' + element.Despatch_Date + '</td>' +
                '<td style="' + color + ' ">' + element.Actual_Freight + '</td>' +
                '<td style="' + color + ' ">' + element.Notify_Buyer + '</td>' +
                '<td style="' + colors + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Note + '</td>' +
                '<td></td>'+
                '</tr>';
        }


        prevsalesrecord = element.Order_No;


    });
    // }
    return content;

}

$('#btnCancel').on('click', function () {
    window.history.back();
});


$(document).on('change', ".ftDate", function () {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        Loaddatatable('From');
    }
});