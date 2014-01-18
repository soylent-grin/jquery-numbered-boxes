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
                                'padding':'40px'
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
            container.append("<div class='numberedBox'><h1>" + i + "</h1></div>")
        }

        container.find('.numberedBox').css({'margin': options.box_margin/2 + 'px '});
       
        $('body').append(container);

    };

    function calculate() { 
        var tmpContainer = container.clone(true),
            newBoxHeight,
            //newPaddingLR, newPaddingTB,
            containerPaddingLR = parseInt (container.css('padding-left'), 10),
            containerPaddingTB = parseInt (container.css('padding-right'), 10),
            contW = $(window).width() - 2 * 40,
            contH = $(window).height() - 2 * 40,
            containerSquare,
            a,b,c,
            rows, cols;

        tmpContainer.css({
            'width': $(window).width(),
            'height': $(window).height(),
        });

        //calculate primary height and  width of boxes, according to the square of container 

        // n * ((height + box_margin) * (height*ratio + box_margin)) = contW * contH;
        // height^2 * ratio + height * box_margin * ( ratio + 1 ) + box_margin * 2 - (contW * contH) / n = 0;
        // height^2 * a + height * b + c = 0
        containerSquare = contW * contH;
        a = options.ratio;
        b = (options.ratio + 1) * options.box_margin;
        c = (options.box_margin * options.box_margin) - containerSquare / options.number;  
        newBoxHeight =  Math.floor(( b*(-1) + Math.sqrt(b*b - 4*a*c) ) / (2*a));

        //get current number of columns and rows
        cols = 1;
        while ((newBoxHeight * options.ratio + options.box_margin) * cols < contW )
        {
            cols++; 
        }   

        rows = Math.ceil(options.number/--cols);

        //fix if overflow

        if ((newBoxHeight + options.box_margin) * rows > contH)
        {
            newBoxHeight = (contW / ++cols - options.box_margin) / options.ratio;
        }

        /*
        console.log(cols,rows);
        newPaddingTB = ( $(window).height() - rows * (newBoxHeight + options.box_margin)) / 2;        
        newPaddingLR = ( $(window).width() - cols * (newBoxHeight*options.ratio + options.box_margin)) / 2; 
        console.log(rows * (newBoxHeight + options.box_margin));
        container.css({
            'padding-left': newPaddingLR,
            'padding-right': newPaddingLR,
            'padding-top': newPaddingTB,
            'padding-bottom': newPaddingTB,
        });
        */
        tmpContainer.find('.numberedBox').css({
            'height': newBoxHeight,
            'width': newBoxHeight*options.ratio
        });

        $('.container').replaceWith(tmpContainer);
        
    };

})(jQuery);