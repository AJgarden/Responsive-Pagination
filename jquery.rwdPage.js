$.fn.rwdPage = function(options) {
  var $selector = $(this);

  if (options === "destroy") {

    $selector.removeAttr('data-pager-initialize').removeAttr('class').removeAttr('data-bp').empty();

  } else {

    $selector.attr('data-pager-initialize', true);

    var defaults = {
      addClassName: 'rwd-pagination',  // the classname of element(s)
      bound: false, // show the first/last page if true
      fillZero: false,  // add zero in front of page number small than 10
      firstHtml: '<span class="sr-only">第一頁</span>',  // HTML code of the first page button
      prevHtml: '<span class="sr-only">上一頁</span>', // HTML code of the previous page button
      lastHtml: '<span class="sr-only">最後一頁</span>',  // HTML code of the last page button
      nextHtml: '<span class="sr-only">下一頁</span>', // HTML code of the next page button
      responsive: [
        {
          breakpoint: 768,
          showNum: 5
        },
        {
          breakpoint: 480,
          showNum: 3
        },
        {
          breakpoint: 1,
          showNum: 1
        }
      ]
      // responsive options: 'breakpoint' is that above viewport width size(includeing), 'showNum' is that how many number page(s) appearing.
    };
    var settings = $.extend({}, defaults, options);

    $selector.each(function(i,element) {
      var $this = $(element);
      if ($this.attr('data-pager-initialize') === "true") {
        var current = parseInt($this.attr('data-current-page'));
        var total = parseInt($this.attr('data-total-page'));
        var url = $this.attr('data-url');
        var pageKey = $this.attr('data-page-key');
        var parameter = ($this.attr('data-pass-parameter') != null && $this.attr('data-pass-parameter') != "" && $this.attr('data-pass-parameter') != "undefined") ? '&'+$this.attr('data-pass-parameter') : '';
        $this.addClass(settings.addClassName).attr('data-bp','');
        $(window).on('resize', function() {
          var vw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          var nowBp = parseInt($this.attr('data-bp'));
          for (var j=0; j<settings.responsive.length; j++) {
            if (vw >= settings.responsive[j].breakpoint) {
              var showNums = (settings.responsive[j].showNum<1) ? 1 : (Math.floor(settings.responsive[j].showNum));
              var bp = j;
              break;
            }
          }
          if (bp != nowBp) {
            $this.empty();
            var appendHtml = '';
            if (current == 1) {
              if (settings.bound == true)
                appendHtml+= '<a href="javascript:void(0);" title="第一頁" class="first disabled">'+settings.firstHtml+'</a>';
              appendHtml+= '<a href="javascript:void(0);" title="上一頁" class="prev disabled">'+settings.prevHtml+'</a>';
            } else {
              if (settings.bound == true)
                appendHtml+= '<a href="'+url+'?'+pageKey+'='+1+parameter+'" title="第一頁" class="first" data-page="'+1+'">'+settings.firstHtml+'</a>';
              var prevPage = current-1;
              appendHtml+= '<a href="'+url+'?'+pageKey+'='+prevPage+parameter+'" title="上一頁" class="prev" data-page="'+prevPage+'">'+settings.prevHtml+'</a>';
            }
            // 如果總頁數<=顯示頁數: 全顯示
            // 如果目前頁數在前showNum一半內
            if (total <= showNums || current <= Math.floor(showNums/2)) {
              if (total <= showNums) showNums = total;
              for (var k=1; k<(showNums+1); k++) {
                if (settings.fillZero == true)
                  var dk = (k<10) ? ('0'+k) : k;
                else
                  var dk = k;
                if (k == current) {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="第'+dk+'頁" class="num current" data-page="'+k+'">'+dk+'</a>';
                } else {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="第'+dk+'頁" class="num" data-page="'+k+'">'+dk+'</a>';
                }
              }
            }
            // 如果目前頁數在後showNums一半內
            else if (current >= total-Math.floor(showNums/2)) {
              for (var k=(total-showNums+1); k<(total+1); k++) {
                if (settings.fillZero == true)
                  var dk = (k<10) ? ('0'+k) : k;
                else
                  var dk = k;
                if (k == current) {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="第'+dk+'頁" class="num current" data-page="'+k+'">'+dk+'</a>';
                } else {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="第'+dk+'頁" class="num" data-page="'+k+'">'+dk+'</a>';
                }
              }
            }
            // 其他
            else {
              var prevDiff = Math.floor((showNums-1)/2);
              var nextDiff = Math.ceil((showNums-1)/2);
              for (var k=(current-prevDiff); k<(current+nextDiff+1); k++) {
                if (settings.fillZero == true)
                  var dk = (k<10) ? ('0'+k) : k;
                else
                  var dk = k;
                if (k == current) {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="第'+dk+'頁" class="num current" data-page="'+k+'">'+dk+'</a>';
                } else {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="第'+dk+'頁" class="num" data-page="'+k+'">'+dk+'</a>';
                }
              }
            }
            if (current == total) {
              appendHtml+= '<a href="javascript:void(0);" title="下一頁" class="next disabled">'+settings.nextHtml+'</a>';
              if (settings.bound == true)
                appendHtml+= '<a href="javascript:void(0);" title="最後一頁" class="last disabled">'+settings.lastHtml+'</a>';
            } else {
              var nextPage = current+1;
              appendHtml+= '<a href="'+url+'?'+pageKey+'='+nextPage+parameter+'" title="下一頁" class="next" data-page="'+nextPage+'">'+settings.nextHtml+'</a>';
              if (settings.bound == true)
                appendHtml+= '<a href="'+url+'?'+pageKey+'='+total+parameter+'" title="最後一頁" class="last" data-page="'+total+'">'+settings.lastHtml+'</a>';
            }
            $this.append(appendHtml).attr('data-bp', bp);
          }
        }).trigger('resize');
      }
    });
  }
};
