; (function($, window, undefined) {
  //拖拽元素
  function DragElement(node) {
    this.target = node;
    node.onselectstart = function() {
      return false;//防止文字选中
    }
  }
  DragElement.prototype = {
    constructor: DragElement,
    setXY: function(x, y) {
      this.x = parseInt(x) || 0;
      this.y = parseInt(y) || 0;
      return this;
    },
    setTargetCss: function(css) {
      $(this.target).css(css);
      return this;
    }
  }

  //鼠标
  function Mouse() {
    this.x = 0;
    this.y = 0;
  }
  Mouse.prototype.setXY = function(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }

  //拖拽配置
  var draggableConfig = {
    zIndex:10,
    dragElement: null,
    mouse: new Mouse()
  };

  var draggableStyle = {
    dragging: {
      cursor: 'move'
    },
    defaults: {
      cursor: 'auto'
    }
  }

  var $document = $(document);

  function drag($ele) {
    var $dragNode = $ele;

    $dragNode.on({
      'mousedown': function(event) {
        var dragElement = draggableConfig.dragElement = new DragElement($ele.get(0));

        draggableConfig.mouse.setXY(event.clientX, event.clientY);
        draggableConfig.dragElement.setXY(dragElement.target.style.left, dragElement.target.style.top)
          .setTargetCss({
            'zIndex': draggableConfig.zIndex ++,
            'position': 'relative'
          });
      },
      'mouseover': function() {
        $(this).css(draggableStyle.dragging);
      },
      'mouseout':function() {
        $(this).css(draggableStyle.defaults);
      }
    })
  }

  function move(event) {
    if(draggableConfig.dragElement) {
      var mouse = draggableConfig.mouse,
        dragElement = draggableConfig.dragElement;
      dragElement.setTargetCss({
        'left': parseInt(event.clientX - mouse.x + dragElement.x) + 'px',
        'top': parseInt(event.clientY - mouse.y + dragElement.y) + 'px'
      });

      $document.off('mousemove', move);
      setTimeout(function() {
        $document.on('mousemove', move);
      }, 25);
    }
  }

  $document.on({
    "mousemove": move,
    'mouseup': function() {
      draggableConfig.dragElement = null;
    }
  });

  $.fn.drag  = function(options) {
    drag(this)
  }

})(jQuery, window, undefined);
