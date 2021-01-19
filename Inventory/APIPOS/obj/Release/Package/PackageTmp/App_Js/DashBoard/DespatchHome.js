var Controller = "DespatchHome";

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
            }
        },
        error: function (a, b, c) {
            $.pnotify({ text: 'Flat Menu load Error', type: 'error' });
        }
    });
}

function BindMenu(data) {
    $("#dividDespatch").empty();
    var html = '';
    if (data != undefined) {
        html += '<ul class="stats-container" style="margin-top: 20px;">';
        $(data).each(function (i, obj) {
            if ((obj.ControllerName != "BookingStatus") && (obj.ControllerName != "WholeSaleOrderStatus")) {
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

        $("#dividDespatch").append(html);
    }

}