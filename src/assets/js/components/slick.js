$(".portfolio").slick({
    arrows: false, // не показывать стрелки
    dots: true, // показывать точки индикаторы
    dotsClass: 'slick-dots', // название класса для точек
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay:true, // автоматическое проигрывание слайдов




//Добавляем адаптив

responsive: [{
    breakpoint: 1025, // максимальная ширина экрана
    settings: {
        slidesToShow: 2, // показывать по 2 слайда
        slidesToScroll: 2, // скроллить по 2 слайда
    }
}, {
    breakpoint: 688,
    settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
    }
}]
});      