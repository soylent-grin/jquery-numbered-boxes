/**********************/
//
//  Параметры
//  1. Соотношение сторон прямоугольника (на примере — соотношение сторон 1 к 1 — квадрат).
//  2. Отступ между прямоугольниками по сетке (в px).
//  3. Количество чисел — N (числа от 1 до N).
//
/**********************/

(function($) {
    //default      
    var options = {
        ratio : 10,
        box_margin: 14,
        number: 29
    },
    container = $('<div />').addClass('container')
                            .css({
                                'padding':'40px',
                            });
     
    $.fn.numberedBoxes = function( params ) {   

        options = $.extend(options, params);

        init();
        calculate();

        var resizeTimer;
        $(window).resize(function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(calculate, 100);
        });

        return container;

    };

    function init() {      

        for (var i = 1; i <= options.number; i++)
        {
            container.append("<div class='numberedBox'><span>" + i + "</span></div>")
        }

        container.find('.numberedBox').css({'margin-left': options.box_margin + 'px ',
                                            'margin-bottom': options.box_margin + 'px '});
       
        $('body').append(container);

    };

    function calculate() {
        //detach DOM element 
        var tmpContainer = container.clone(true),
            newBoxHeight, newBoxWidth,
            containerPaddingLR = parseInt (container.css('padding-left'), 10),
            containerPaddingTB = parseInt (container.css('padding-bottom'), 10),
            contW = $(window).width() - 2 * containerPaddingLR,
            contH = $(window).height() - 2 * containerPaddingTB,
            rows, cols;

        tmpContainer.css({
            'width': $(window).width(),
            'height': $(window).height(),
        });

        // get current number of columns and rows
        // boxes are always fit in width
        // h = w / ratio
        // columns * w = contw
        // rows * h <= contH

        cols = 1;
        while ((contW/(cols*options.ratio)) * Math.ceil(options.number/cols) >= contH )
        {
            cols++; 
        }  
        rows = Math.ceil(options.number/cols);

        // additional box margin

        newBoxHeight = ((contW / cols)) / options.ratio - options.box_margin;
        newBoxWidth =  ((contW / cols)) - options.box_margin;

        tmpContainer.find('.numberedBox').css({
            'height': newBoxHeight,
            'width': newBoxWidth
        });

        // set new top and bottom padding of the container, according to unused space

        containerPaddingTB = containerPaddingTB + (contH - rows*(newBoxHeight + options.box_margin))/2;
        tmpContainer.css({
            'padding-top': containerPaddingTB,
            'padding-bottom': containerPaddingTB
        });

        $('.container').replaceWith(tmpContainer);
        
    };

})(jQuery);