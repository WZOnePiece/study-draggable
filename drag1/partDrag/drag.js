/*
  author: NARUTOne,wz;
  creatTime: 2016/9/20;
  developing: 可以扩展：添加父元素限制；多个同级元素拖拽顺序排列等。
*/

; (function(window, undefined) {
  // 拖拽对象的事件绑定；样式获取、设置
  var dom = {
    on: function(node, eventName, handler) {
      if(node.addEventListener) {
        console.log(node);
        node.addEventListener(eventName, handler, false);
      }
      else {//IE
        node.attachEvent("on" + eventName, handler);
      }
    },
    getStyle: function(node, styleName) {
      var realStyle = null;
      if(window.getComputedStyle) {
        realStyle = window.getComputedStyle(node,null)[styleName];
      }
      else if(node.currentStyle) {//IE
        realStyle = node.currentStyle[styleName];
      }
      else if(node.style) {
        realStyle = node.style[styleName];
      }
      return realStyle;
    },
    setCss: function(node, css) {
      for(var key in css) {
        node.style[key] = css[key];
      }
    }
  };

// 拖拽对象定义
  function DragElement(node) {
    this.node = node;
    this.x = 0;
    this.y = 0;
  }

  DragElement.prototype = {
    constructor: DragElement,
    init: function() {
      this.setEleCss({
        "left": dom.getStyle(node, "left"),
        "top": dom.getStyle(node, "top")
      })
      .setXY(node.style.left, node.style.top)
    },
    // 设置当前坐标
    setXY: function(x, y) {
      this.x = parseInt(x) || 0;
      this.y = parseInt(y) || 0;
      return this;
    },
    // 设置元素节点的样式
    setEleCss: function(css) {
      dom.setCss(this.node, css);
      return this;
    }
  }

  // 鼠标对象
  function Mouse() {
    this.x = 0;
    this.y = 0;
  }
  Mouse.prototype.setXY = function(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }

  // 拖拽配置
  var draggableConfig = {
    zIndex: 1,
    draggingObj: null,
    mouse: new Mouse(),
    parent:document,
    dragEle:null
  }

  // 拖拽实现
  function Drag(ele,parent) {
    this.ele = ele;
    var drag = ele.getElementsByClassName('drag-title')[0] || ele
    function mouseDown(event) {
      var elem = this ;
      draggableConfig.mouse.setXY(event.clientX, event.clientY);
      draggableConfig.draggingObj = new DragElement(ele);
      draggableConfig.draggingObj
        .setXY(ele.style.left, ele.style.top)
        .setEleCss({
          "zIndex": draggableConfig.zIndex ++,
          "position": "absolute"
        });
    }
    draggableConfig.parent = parent;
    draggableConfig.dragEle = ele;
    ele.onselectstart = function() {
      // 防止拖拽对象内文字被选中
      return false;
    }
    dom.on(drag, "mousedown", mouseDown);
  }

  dom.on(draggableConfig.parent, "mousemove", function(e) {
    if(draggableConfig.draggingObj) {
      var mouse = draggableConfig.mouse,
        draggingObj = draggableConfig.draggingObj;
        // 这里可以添加限制，拖拽不脱离父元素
      var p_height = draggableConfig.parent.offsetHeight;
      var p_width = draggableConfig.parent.offsetWidth;
      var c_height = draggableConfig.dragEle.offsetHeight;
      var c_width = draggableConfig.dragEle.offsetWidth;
      var left, top = 0;

      if(event.clientX - mouse.x + draggingObj.x < 0) {
        left = 0;
      }
      else if((event.clientX - mouse.x + draggingObj.x) > (p_width - c_width)) {
        left = p_width - c_width;
      }
      else {
        left = event.clientX - mouse.x + draggingObj.x;
      }

      if(event.clientY - mouse.y + draggingObj.y < 0) {
        top = 0;
      }
      else if((event.clientY - mouse.y + draggingObj.y) > (p_height - c_height)) {
        top = p_height - c_height;
      }
      else {
        top = event.clientY - mouse.y + draggingObj.y;
      }

      draggingObj.setEleCss({
        "left": parseInt(left) + "px",
        "top": parseInt(top) + "px"
      })
    }
  })

  dom.on(draggableConfig.parent, "mouseup", function(event) {
    draggableConfig.draggingObj = null;
  })

  window.Drag = Drag;

})(window,undefined);
