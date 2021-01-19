var count = 0, Controller = "WSPartyPickup", FreightController = "FreightDespatch";

//var liveLink = 'http://207.180.218.24:81/';
 var liveLink = 'https://www.captainwise.com.au/';
$("span#sidebar-toggle").trigger('click');
$('#txtFrom').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
$('#txtFrom').datepicker('setDate', new Date(new Date().setDate(new Date().getDate() - 30)));
$('#txtTo').datepicker({ dateFormat: 'dd-M-yy', maxDate: new Date() });
getDate();
loadModel();
$('#btnSave').val('Despatch');
$('#btnRefresh').val('Cancel Booking');

$(document).ready(function () {
    setInterval(function () {
        cache_clear()
    }, 900000);
});

function cache_clear() {
    Loaddatatable('In');
}

function getDate() {

    var monthsArr = new Array();
    // store month names Srto our array
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
   // document.getElementById("txtFrom").value = date;
    document.getElementById("txtTo").value = date;
}
Loaddatatable('In');

function Loaddatatable(type) {
    var urlpath = base + Controller + "/GetWSPartyPickupData";

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
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $("#divTable").empty();
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                BindTable(result.list);
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
        "iDisplayLength": -1,
        "bDestroy": true
    });
}

function TableHeader() {
    let content = '';
    content = '<table id="demo-dtable-04" class="table table-striped">' +
       '<thead>' +
            '<tr>' +
              '<th >#</th>' +
              '<th >Booking Date</th>' +
              '<th >Invoice No</th>' +
              '<th >Ref. No</th>' +
              '<th >Customer Name</th>' +
              '<th >Suburb</th>' +
              '<th >POSTCODE</th>' +
              '<th >Item Code</th>' +
              '<th >Qty</th>' +
              '<th >Box</th>' +
              '<th >Delivery</th>' +
              '<th >Tracking</th>' +
              '<th >Pickup Date</th>' +
              '<th >Desp. By</th>' +
              '<th >Status</th>' +
             '</tr>' +
        '</thead>';
    return content;
}

function TableRow(result) {
    $("#divTable").empty();
    let content = '';
    if (result.length > 0) {
        var olist = result;
        $(olist).each(function (index, element) {
            let color = '', btn = '', podlink = '', trcolor='';
            if (element.Comment == "Awating")
            {
                element.Comment = "Awaiting";
                color = 'background-color: red;'; btn = '';
            }
            if (element.Comment == "Despatched")
            { color = 'background-color: green;'; btn = 'disabled'; }

            if (element.ImageLink == '') {
                podlink = element.LocId;
            } else {
                let plink = liveLink + element.ImageLink;
                podlink = '<a href="' + plink + '" target="_blank">' + element.LocId + '</a>';
            }

            if (element.CustomerId == 'Collection') {
                trcolor = 'style="background-color:yellow !important;"';
                element.CustomerId = '0';
            } else { trcolor = ''; }

            content += '<tr ' + trcolor + '>' +
                //'<td >' + (index + 1) + '<input type="hidden" value="' + element.IHeadId + '" /></td>' +
                '<td class="checkbox-column"><input type="checkbox" ' + btn + ' class="uniform checkList" ></td>' +
                '<td class="SaleDetId">' + element.DueDate + '<input type="hidden" value="' + element.SaleDetId + '" /></td>' +
                '<td class="IHeadId">' + element.InvoiceNo + '<input type="hidden" value="' + element.IHeadId + '" /></td>' +
                '<td class="SaleId">' + element.RefNo + '<input type="hidden" value="' + element.SaleId + '" /></td>' +
                '<td class="CustomerId">' + element.CustomerName + '<input type="hidden" value="' + element.CustomerId + '" /></td>' +
                '<td>' + element.City + '</td>' +
                '<td>' + element.PostalCode + '</td>' +
                '<td>' + element.IHeadCode + '<input type="hidden" value="' + element.Total + '" /></td>' +
                '<td class="SaleQty">' + element.SaleQty + '</td>' +
                '<td>' + element.Box + '<input type="hidden" value="' + element.SaleType + '" /></td>' +
                '<td>' + element.DeliveryMethod + '</td>' +
                '<td>' + element.TrakingNumber + '</td>' +
                '<td>' + element.RequiedDate + '</td>' +
                '<td>' + podlink + '</td>' +
                '<td style="' + color + ' text-align: center;font-size: 13px;font-weight: bold;">' + element.Comment + '</td>' +
               // '<td><input type="button" ' + btn + ' class="despatch" id="' + element.SaleId + '" style="width: 90px; ' + color + '" value="' + element.Comment + '" /></td>' +

        '</tr>';
        });
    }
    return content;
  
}

$(document).off('click', '.checkList').on('click', '.checkList', function () {
    // let Id = $(this)[0].id;

    let tblRow = $(this).closest('tr');
    let qty = tblRow[0].cells[8].textContent;
    let stock = tblRow[0].cells[7].childNodes[1].value;  //tblRow[0].cells[1].childNodes[1].children[0].value;
    let type = tblRow[0].cells[9].childNodes[1].value;
    let ischeck = $(this).is(":checked")
    if (ischeck == true) {
        if (parseInt(stock) < parseInt(qty) && (type == "Sale" || type == "Transfer")) {
            $(this).attr("checked", false);
            $.pnotify({ text: 'Please Add Stock Qty ?', type: 'error' });
        }
    }
    //else {
    //    $('#' + Id).attr("checked", false);
    //}

});


function loadModel(parameters) {

    // When the user clicks the button, open the modal 
    $("#btnSave").click(function (parameters) {
        if (SaveValidation() == true) {
            $("#PODModal").css("display", "block");
        }
    });


    // When the user clicks on <span> (x), close the modal
    $(document).on('click', '#btnPopCancel', function (parameters) {
        document.getElementById('file').value = "";
        $('#divImgPreview').empty();
        $("#PODModal").css("display", "none");
    });
}

// File Show for Upload ///

function fileSelected() {
    let prevImg = '';
    let src = $($('#divImgPreview').children()).attr('src');
    if (src != undefined) {
        if ($($('#divImgPreview').children()).attr('src').split('/')[1] == 'Uploads') {
            prevImg = src;
        }
        else {
            prevImg = $($('#divImgPreview').children()).attr('data-previmg');
        }
    }

    var file = document.getElementById('file').files[0];
    if (file) {
        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    document.getElementById('divImgPreview').innerHTML = ['<img src="', e.target.result, '" data-prevImg="' + prevImg + '" class="clsMyImage" alt="', theFile.name, '" title="', theFile.name, '" style="width:100px; height:100px;"/>'].join('');
                };
            })(file);
            reader.readAsDataURL(file);
        } else {
            alert('Pls upgrade your browser,HTML5 is not supported');
        };
    }
}

$331('#btnPopSave').on('click', function () {

    var obj = GetSaveObject();
    var data = new FormData();
    $("#PODModal").css("display", "none");
    data.append('dataList', JSON.stringify(obj));
    var $file = document.getElementById('file');

    if ($file.files.length > 0) {
        for (var i = 0; i < $file.files.length; i++) {
            data.append('files', $file.files[i]);
        }
    }
    var urlpath = base + Controller + "/SaveWSPartyPickup";
    $331.ajax({
        beforeSend: function () { $.blockUI(); },
        complete: function () { $.unblockUI(); },
        type: "POST",
        url: urlpath,
        contentType: false, // Not to set any content header  
        processData: false, // Not to process data  
        data: data,
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: result.IsSessionOut, type: 'info' });
                return false;
            } else if (result.Error != null && result.Error != "") {
                $.pnotify({ text: result.Error, type: 'error' });
                return false;
            } else {
                $.pnotify({ text: 'Save Successfully', type: 'success' });
                ClearData();
            }
        }
    });
});

function SaveValidation() {
    let valid = true;
    var tCheck = $($("#demo-dtable-04 tbody tr").find('.checkList').is(':checked')).length;
    if (tCheck == 0) {
        $.pnotify({ text: 'Please? Check One Sale Invoice ', type: 'info' });
        valid = false;
        return valid;
    }
    return valid;
}

function GetSaveObject() {
    let obj = [];
    $("#demo-dtable-04 tbody tr").each(function () {
        let checkItem = $(this).find('.checkList').is(':checked');
        if (checkItem) {

            let aobj = {
                "SaleId": $(this).find('.SaleId input[type=hidden]').val(),
                "SaleDetId": $(this).find('.SaleDetId input[type=hidden]').val(),
                "CustomerId": $(this).find('.CustomerId input[type=hidden]').val(),
                "IHeadId": $(this).find('.IHeadId input[type=hidden]').val(),
                "SaleQty": $(this).find('.SaleQty').text(),
                "InvoiceNo": $(this).find('.IHeadId').text()
            }
            obj.push(aobj);
        }
    });
    return obj;
}

function ClearData() {
    Loaddatatable('In');
    document.getElementById('file').value = "";
}

$('#btnRefresh').on('click', function () {
    if (SaveValidation() == true) {
        //Are you sure that you want to Cancel Booking
        $.msgbox("<span style='font-weight:bold; color:#FF0000;'>WARNING!!!</span> Are you sure that you want to Booked Cancel.!", {
            type: "confirm",
            buttons: [
                { type: "submit", value: "Yes" },
                { type: "submit", value: "No" }
            ]
        }, function (result) {
            if (result == "Yes") {
                var obj = GetSaveObject();
                var urlpath = base + FreightController + "/AwatingBookedCancel";
                $.ajax({
                    beforeSend: function () { $.blockUI(); },
                    complete: function () { $.unblockUI(); },
                    type: "POST",
                    url: urlpath,
                    contentType: "application/json;charset=utf-8",
                    dataType: "JSON",
                    data: JSON.stringify({ "objList": obj }),
                    success: function (result) {
                        if (result.IsSessionOut != null) {
                            $.pnotify({ text: result.IsSessionOut, type: 'info' });
                            return false;
                        } else if (result.Error != null && result.Error != "") {
                            $.pnotify({ text: result.Error, type: 'error' });
                            return false;
                        } else {
                            $.pnotify({ text: 'Booked Cancel Successfully', type: 'success' });
                            ClearData();
                        }
                    }
                });
            }
            else if (result == "No") {
                $.pnotify({ text: "Cancel Operation", type: 'info' });
            }
        });
    }
});

$331('#btnCancel').on('click', function () {
    window.history.back();
    //var baseUrl = base + "Home/Index";
    //window.location.href = baseUrl;
});

$(document).on('change', ".ftDate", function () {
    if ($("#txtDatedFrom").val() != "" && $("#txtDatedTo").val() != "") {
        Loaddatatable('From');
    }
});
