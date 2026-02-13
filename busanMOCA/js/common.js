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


    /* -----------------------------
        2. 메뉴 열기 (PC & MOBILE 공통)
    ----------------------------- */
    $('header .gnb_open').on('click focusin', function(){

        if(device_status === 'pc'){
            $('header').addClass('menu_pc');
        } else {
            $('header').addClass('menu_mo');
        }

        $('html').addClass('no-scroll');
    });


    /* -----------------------------
        3. 메뉴 닫기 (PC & MOBILE 공통)
    ----------------------------- */
    function closeMenu(){
        $('header').removeClass('menu_pc menu_mo');
        $('html').removeClass('no-scroll');
    }

    $('header .gnb_close, header .gnb_bg').on('click', closeMenu);
    $('header .gnb_bg').on('mouseenter', closeMenu);


        /* -----------------------------
        4. PC 전용: 포커스 벗어날 때 닫기
    ----------------------------- */
    $('header .gnb .gnb_close').on('focusout', closeMenu);


      /* -----------------------------
        모바일: depth2 아코디언
    ----------------------------- */
    $('header .depth1 > li > a').on('click', function(e){

        if(device_status !== 'mobile') return; // PC면 작동 X

        e.preventDefault(); // 링크 이동 방지

        let li = $(this).parent('li');

        if(li.hasClass('active')){
            li.removeClass('active');
        } else {
            $('header .depth1 > li').removeClass('active');
            li.addClass('active');
        }
    });


    //시작 :: header fixed

     //스크롤을 내리면 header fixed 
    let scrolling = $(window).scrollTop() //현재 스크롤 된값
    let prev_scroll //이전에 스크롤된값
    let diff_scroll //차이값
    function scroll_chk(){
        prev_scroll = scrolling
        scrolling = $(window).scrollTop()
        diff_scroll = prev_scroll - scrolling
        //console.log(diff_scroll)
        if(diff_scroll < 0){ //위로 스크롤 
            $('header').addClass('up')
            //console.log('if')
        }else{ //아래로 스크롤
            $('header').removeClass('up')
            //console.log('else')
        }
        if(scrolling > 0){ //스크롤 내림
            $('header').addClass('fixed')
        }else{ //0이거나 0보다 작은경우 (fixed제거)
            $('header').removeClass('fixed')
        }
    }
    scroll_chk() //문서가 로딩되고 1번 실행
    $(window).scroll(function(){
        scroll_chk() //스크롤 할때마다 실행
    })

    //끝 :: header fixed

    
	// 시작 :: TOP 버튼
	$('footer .top').on('click', function(){
		// $(window).scrollTop(0)
		$('html, body').animate({
			scrollTop : 0
		}, 300)
	})

	//끝 :: TOP 버튼


})//맨끝