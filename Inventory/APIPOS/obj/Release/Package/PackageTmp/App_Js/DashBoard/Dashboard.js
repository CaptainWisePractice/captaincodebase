var Controller = "Home";

loadModel();
LoadHome();
function LoadHome() {
    $.ajax({
        type: "POST",
        url: base + Controller + "/loadFlatmenu",
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (result) {
            if (result.IsSessionOut != null) {
                $.pnotify({ text: 'Session Out Please login again', type: 'info' });
                return false;
            }
            else {
                debugger;
                BindMenu(result.ListMenu);
                if (result.LstPreSale != null) {
                    $("#header-modal").css("display", "block");
                    PreSaleBindTbl(result.LstPreSale);
                }
                if (result.LstLayby != null) {
                    $("#header-modal2").css("display", "block");
                    LaybyBindTbl(result.LstLayby);
                }
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Flat Menu load Error', type: 'error' });
        }
    });
}

function BindMenu(data) {
    $("#dividHome").empty();
    var html = '';
    if (data != undefined) {
        html += '<ul class="stats-container" style="margin-top: 20px;">';
        $(data).each(function (i, obj) {
            if ((obj.ControllerName != "LocalDeliveryRunSheet")) {
                html += ' <li>' +
                   ' <a href="/' + obj.ControllerName + '/' + obj.ViewName + '" class="stat summary">' +
                    ' <i><img src="../App_Theme/assets/images/' + obj.IconClass + '" style="width: 250px; height: 75px;" /> </i>' +
                    '</a>' +
               ' </li>';
            } else {
                html += ' <li>' +
                 ' <a href="/' + obj.ControllerName + '/' + obj.ViewName + '" class="stat summary" target="_blank">' +
                  ' <i><img src="../App_Theme/assets/images/' + obj.IconClass + '" style="width: 250px; height: 75px;" /> </i>' +
                  '</a>' +
             ' </li>';
            }

        });

        html += ' </ul>';

        $("#dividHome").append(html);
    }

}

function PreSaleBindTbl(result) {

    $("#idNotifytbody").empty();
    let content = '';
    if (result.length > 0) {
        var olist = result;
        $("#spnOutlet").text(olist[0].SaleOutlet);
        $(olist).each(function (index, element) {
            let color = 'background-color: #0000FF;', btn = '', btn1 = '';

            content += '<tr>' +
               '<td style="width:25px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceNo="' + element.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + element.CustomerName + '<input type="hidden" value="' + element.CustomerId + '" /></td>' +
                '<td>' + element.InvoiceNo + '</td>' +
                '<td>' + element.DespatchDate + ' </td>' +
                '<td>' + '$ ' + element.BalanceDue + '</td>' +
                '<td>' + element.IHeadCode + '</td>' +
                '<td>' + element.Status + '</td>' +
                '<td><a href="#" style="font-size: 11px;" class="btn btn-warning btnTakeAction">TakeAction</a></td>' +
        '</tr>';
        });
        $('#tblPresaleNotify tbody').append(content);
    }

}

function LaybyBindTbl(result) {

    $("#idLaybytbody").empty();
    let content = '';
    if (result.length > 0) {
        var olist = result;
        $("#spnOutletLayby").text(olist[0].SaleOutlet);
        $(olist).each(function (index, element) {
            let color = 'background-color: #0000FF;', btn = '', btn1 = '';

            content += '<tr>' +
               '<td style="width:25px;"><img style="width: 18px;height: 18px;border: none;" id="btnView" data_InvoiceNo="' + element.InvoiceNo + '" class="btnRedirect" src="../Content/Icon/RightArrow.png"></td>' +
                '<td>' + element.CustomerName + '<input type="hidden" value="' + element.CustomerId + '" /></td>' +
                '<td>' + element.InvoiceNo + '</td>' +
                '<td>' + element.DespatchDate + ' </td>' +
                '<td>' + '$ ' + element.BalanceDue + '</td>' +
                '<td><a href="#" style="font-size: 11px;" class="btn btn-warning btnLaybyAction">TakeAction</a></td>' +
        '</tr>';
        });
        $('#tblLaybyNotify tbody').append(content);
    }

}

function loadModel(parameters) {
    $("#header-modal").css("display", "none");
    $("#header-modal2").css("display", "none");
    // When the user clicks on <span> (x), close the modal
    $(document).on('click', '.btnClose', function (parameters) {
        $("#header-modal").css("display", "none");
    });
    $(document).on('click', '.btnCloseLayby', function (parameters) {
        $("#header-modal2").css("display", "none");
    });
}

$(document).off('click', '.btnRedirect').on('click', '.btnRedirect', function () {

    var invno = $(this).attr('data_InvoiceNo');
    let tblRow = $(this).closest('tr');
    // let saleOutletId = tblRow[0].cells[3].childNodes[1].value;

    var url = "";
    if (invno.length == 8) {
        url = base + "Sales/Sales?invNo=" + invno;
    }
    else {
        url = base + "SalesReturn/SalesReturn?invNo=" + invno;
    }
    window.open(url, '_blank');

});

$(document).off('click', '.btnTakeAction').on('click', '.btnTakeAction', function () {
    let tblRow = $(this).closest('tr');
    let invno = tblRow[0].cells[2].textContent;
    let customerId = tblRow[0].cells[1].childNodes[1].value;
    let status = tblRow[0].cells[6].textContent;
    var url = "";
    if (status == "Awating Booking") {
        url = base + "DespatchCenter/DespatchCenter";
    }
    else {
        // url = base + 'ReceivePayments/ReceivePayments?customerId=' + customerId;
        if (invno.length == 8) {
            url = base + "Sales/Sales?invNo=" + invno;
        }
        else {
            url = base + "SalesReturn/SalesReturn?invNo=" + invno;
        }
    }
    window.open(url, '_blank');

});

$(document).off('click', '.btnLaybyAction').on('click', '.btnLaybyAction', function () {
    let tblRow = $(this).closest('tr');
    //  let invno = tblRow[0].cells[2].textContent;
    let customerId = tblRow[0].cells[1].childNodes[1].value;
    var url = "";
    url = base + 'ReceivePayments/ReceivePayments?customerId=' + customerId;
    window.open(url, '_blank');

});


