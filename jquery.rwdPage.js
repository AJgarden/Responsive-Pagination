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
      firstHtml: '<span class="sr-only">First</span>',  // HTML code of the first page button
      prevHtml: '<span class="sr-only">Previous</span>', // HTML code of the previous page button
      lastHtml: '<span class="sr-only">Last</span>',  // HTML code of the last page button
      nextHtml: '<span class="sr-only">Next</span>', // HTML code of the next page button
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
                appendHtml+= '<a href="javascript:void(0);" title="First Page" class="first disabled">'+settings.firstHtml+'</a>';
              appendHtml+= '<a href="javascript:void(0);" title="Previous Page" class="prev disabled">'+settings.prevHtml+'</a>';
            } else {
              if (settings.bound == true)
                appendHtml+= '<a href="'+url+'?'+pageKey+'='+1+parameter+'" title="First Page" class="first" data-page="'+1+'">'+settings.firstHtml+'</a>';
              var prevPage = current-1;
              appendHtml+= '<a href="'+url+'?'+pageKey+'='+prevPage+parameter+'" title="Previous Page" class="prev" data-page="'+prevPage+'">'+settings.prevHtml+'</a>';
            }
            // if total pages less than showing pages: show all pages
            // if current page is smaller than half of 'showNum'
            if (total <= showNums || current <= Math.floor(showNums/2)) {
              if (total <= showNums) showNums = total;
              for (var k=1; k<(showNums+1); k++) {
                if (settings.fillZero == true)
                  var dk = (k<10) ? ('0'+k) : k;
                else
                  var dk = k;
                if (k == current) {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="Page '+dk+'" class="num current" data-page="'+k+'">'+dk+'</a>';
                } else {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="Page '+dk+'" class="num" data-page="'+k+'">'+dk+'</a>';
                }
              }
            }
            // if current page is larger than half of 'showNums' counting from last
            else if (current >= total-Math.floor(showNums/2)) {
              for (var k=(total-showNums+1); k<(total+1); k++) {
                if (settings.fillZero == true)
                  var dk = (k<10) ? ('0'+k) : k;
                else
                  var dk = k;
                if (k == current) {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="Page '+dk+'" class="num current" data-page="'+k+'">'+dk+'</a>';
                } else {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="Page '+dk+'" class="num" data-page="'+k+'">'+dk+'</a>';
                }
              }
            }
            // other conditions
            else {
              var prevDiff = Math.floor((showNums-1)/2);
              var nextDiff = Math.ceil((showNums-1)/2);
              for (var k=(current-prevDiff); k<(current+nextDiff+1); k++) {
                if (settings.fillZero == true)
                  var dk = (k<10) ? ('0'+k) : k;
                else
                  var dk = k;
                if (k == current) {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="Page '+dk+'" class="num current" data-page="'+k+'">'+dk+'</a>';
                } else {
                  appendHtml+= '<a href="'+url+'?'+pageKey+'='+k+parameter+'" title="Page '+dk+'" class="num" data-page="'+k+'">'+dk+'</a>';
                }
              }
            }
            if (current == total) {
              appendHtml+= '<a href="javascript:void(0);" title="Next Page" class="next disabled">'+settings.nextHtml+'</a>';
              if (settings.bound == true)
                appendHtml+= '<a href="javascript:void(0);" title="Last Page" class="last disabled">'+settings.lastHtml+'</a>';
            } else {
              var nextPage = current+1;
              appendHtml+= '<a href="'+url+'?'+pageKey+'='+nextPage+parameter+'" title="Next Page" class="next" data-page="'+nextPage+'">'+settings.nextHtml+'</a>';
              if (settings.bound == true)
                appendHtml+= '<a href="'+url+'?'+pageKey+'='+total+parameter+'" title="Last P" class="last" data-page="'+total+'">'+settings.lastHtml+'</a>';
            }
            $this.append(appendHtml).attr('data-bp', bp);
          }
        }).trigger('resize');
      }
    });
  }
};
