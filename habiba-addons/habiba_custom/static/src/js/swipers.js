$(document).ready(function() {
    odoo.define('habiba_custom.swipers', function(require) {
        // "use strict";
        var homeCarousel = new Swiper('#carouselHome.swiper-container', {
            loop: true,
            pagination: {
                el: '#carouselHome .swiper-pagination',
            },
            autoplay: {
                delay: 3000,
            },
        });

        const homeSwiper = new Swiper('#homeSwiper', {
            direction: 'horizontal',
            // pagination: '.pagination',
            //     loop: true,
            //     autoplay: 1000,
            //     paginationClickable: true
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            // centeredSlidesBounds: true,
            // centerInsufficientSlides: true,
            breakpoints: {
                1400: {
                    slidesPerView: 3,
                },
                1200: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 3,
                },
                576: {
                    centeredSlides: false,
                    slidesPerView: 2,
                },
                0: {
                    centeredSlides: true,
                    slidesPerView: 1,
                }
            }
        });

        const shopCategSwiper = new Swiper('#shopCategSwiper', {
            direction: 'horizontal',
            // pagination: '.pagination',
            //     loop: true,
            //     autoplay: 1000,
            //     paginationClickable: true
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            centeredSlidesBounds: true,
            centerInsufficientSlides: true,
            breakpoints: {
                768: {
                    slidesPerView: 5,
                },
                576: {
                    slidesPerView: 4,
                },
                0: {
                    centeredSlides: true,
                    slidesPerView: 3,
                }
            }
        });

    });

});