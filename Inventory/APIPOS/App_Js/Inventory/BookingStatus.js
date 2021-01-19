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
    var datefrm = day + "-" + monthsArr[month-1] + "-" + year;
    document.getElementById("txtFrom").value = datefrm;
    document.getElementById("txtTo").value = date;
}
Loaddatatable('In');

function Loaddatatable(type) {
    var urlpath = base + Controller + "/GetBookingStatus";
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
       // 'ajax': 'https://api.myjson.com/bins/qgcu',
        'rowsGroup': [2],
        "aaSorting": [[1, 'asc']],
        
       
    });
}

function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped table-bordered">' +
        '<thead>' +
        '<tr>' +
        ' <th>Added By</th>' +
        '<th>Booking Date</th>' +
        '<th>Sales Record No</th>' +
        '<th>Buyer Name</th>' +
        '<th>Suburb</th>' +
        '<th>Post Code</th>' +
        '<th>Item Code</th>' +
        '<th>Item Name</th>' +
        '<th>Quantity</th>' +
        '<th>Box</th>' +
        '<th style="width:50px;">Tracking Number</th>' +
        '<th>Manifest Price</th>' +
        '<th>Dispatch Date</th>' +
        '<th>Dispatch By</th>' +
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

        ar.push(element.Sales_Record);

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
                if (ar[i] == element.Sales_Record) {

                    findvalue++;
                }
            }
            console.log(findvalue);

            if (prevsalesrecord != element.Sales_Record) {

                content += '<tr style="' + color + ' ">' +
                    '<td style="' + color + ' ">' + element.Added_By + '</td>' +
                    '<td style="' + color + ' ">' + element.Added_Date + '</td>' +
                    '<td style="' + color + ' " rowspan=' + findvalue + '>' + element.Sales_Record + '</td>' +
                    '<td style="' + color + ' " rowspan=' + findvalue + '>' + element.Buyer_Name + '</td>' +
                    '<td style="' + color + ' " rowspan=' + findvalue + '>' + element.Suburb + '</td>' +
                    '<td style="' + color + ' " rowspan=' + findvalue + '>' + element.Post_Code + '</td>' +
                    '<td style="' + color + ' ">' + element.Item_Code + '</td>' +
                    '<td style="' + color + ' ">' + element.Item_Name + '</td>' +
                    '<td style="' + color + ' ">' + element.SaleQty + '</td>' +
                    '<td style="' + color + ' ">' + element.BoxQty + '</td>' +
                    '<td style="' + color + ' width:50px;" >' + element.Tracking_Number + '</td>' +
                    '<td style="' + color + ' ">' + element.Maniftest_Price + '</td>' +
                    '<td style="' + color + ' ">' + element.Despatch_Date + '</td>' +
                    '<td style="' + color + ' ">' + element.Despatch_By + '</td>' +
                    '<td style="' + color + ' ">' + element.Note + '</td>' +
                    '<td style="' + colors + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Comment + '</td>' +
                    '</tr>';
                }
                else {

                content += '<tr style="' + color + ' ">' +
                    '<td style="' + color + ' ">' + element.Added_By + '</td>' +
                    '<td style="' + color + ' ">' + element.Added_Date + '</td>' +
                    '<td style="display:none;">' + element.Sales_Record + '</td>' +
                    '<td style="display:none;">' + element.Buyer_Name + '</td>' +
                    '<td style="display:none;">' + element.Suburb + '</td>' +
                    '<td style="display:none;">' + element.Post_Code + '</td>' +
                    '<td style="' + color + ' ">' + element.Item_Code + '</td>' +
                    '<td style="' + color + ' ">' + element.Item_Name + '</td>' +
                    '<td style="' + color + ' ">' + element.SaleQty + '</td>' +
                    '<td style="' + color + ' ">' + element.BoxQty + '</td>' +
                    '<td style="' + color + ' width:50px;" >' + element.Tracking_Number + '</td>' +
                    '<td style="' + color + ' ">' + element.Maniftest_Price + '</td>' +
                    '<td style="' + color + ' ">' + element.Despatch_Date + '</td>' +
                    '<td style="' + color + ' ">' + element.Despatch_By + '</td>' +
                    '<td style="' + color + ' ">' + element.Note + '</td>' +
                    '<td style="' + colors + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Comment + '</td>' +
                    '</tr>';
                }


                prevsalesrecord = element.Sales_Record;

            
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