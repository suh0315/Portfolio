$(document).ready(function(){

    /* -----------------------------
        1. 디바이스 체크
    ----------------------------- */
    let mobile_size = 1024;
    let device_status = 'pc';

    function device_chk(){
        device_status = ($(window).width() > mobile_size) ? 'pc' : 'mobile';
    }

    device_chk();
    $(window).on('resize', function () {

        let prev_status = device_status; // 변경 전 상태 저장
        device_chk(); // 변경 후 상태 갱신
    
        // PC → 모바일로 변경된 순간
        if (prev_status === 'pc' && device_status === 'mobile') {
            $('header').removeClass('menu_pc');
            $('html').removeClass('no-scroll');
        }
    
        // 모바일 → PC로 변경된 순간
        if (prev_status === 'mobile' && device_status === 'pc') {
            $('header').removeClass('menu_mo');
            $('html').removeClass('no-scroll');
        }
    });
    // 시작 :: family_site 오픈
    $('footer .family_site .family_open').on('click', function(){
        $('footer .family_site').addClass('open')
        $('footer .family_site .family_wrap').slideDown()
    })
    $('footer .family_site .family_close').on('click', function(){
        $('footer .family_site').removeClass('open')
        $('footer .family_site .family_wrap').slideUp()
    })
    // 끝 :: family_site 오픈

    // 시작 :: top 버튼
    $('footer .f_util .top').on('click', function(){
        $('html, body').animate({
            scrollTop : 0
        }, 500)
    })
    // 끝 :: top 버튼

})//맨끝