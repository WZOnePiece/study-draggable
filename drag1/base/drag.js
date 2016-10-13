
/*
  creatTime:2016/09/14
  author:NARUTOne
*/

var dragObj = document.getElementById("drag");
dragObj.style.left = "0px";
dragObj.style.top = "0px";

var mouseX, mouseY, objX, objY;
var dragging = false;

dragObj.onmousedown = function (event) {
    event = event || window.event;

    dragging = true;
    dragObj.style.position = "relative";

    mouseX = event.clientX;
    mouseY = event.clientY;
    objX = parseInt(dragObj.style.left);
    objY = parseInt(dragObj.style.top);
}

//选父元素
document.getElementById("dragBox").onmousemove = function (event) {
    event = event || window.event;
    if (dragging) {
        dragObj.style.left = parseInt(event.clientX - mouseX + objX) + "px";
        dragObj.style.top = parseInt(event.clientY - mouseY + objY) + "px";
    }

    // 如果想不出去，需要添加范围限制
}

document.getElementById("dragBox").onmouseup = function () {
    dragging = false;
}
