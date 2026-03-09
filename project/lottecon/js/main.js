$(document).ready(function(){
    //시작 :: visual_swiper
    const visual_swiper = new Swiper('.visual .swiper', { /* 팝업을 감싸는 요소의 class명 */

	autoplay: {  /* 팝업 자동 실행 */
		delay: 5000,
		disableOnInteraction: true,
	},

	effect: "fade", /* fade 효과 */

	loop: true,  /* 마지막 팝업에서 첫번째 팝업으로 자연스럽게 넘기기 */

	pagination: {
        el: '.visual .paging',
        clickable: true,
        renderBullet: function (i, className) {
        return '<button class="' + className + '"><svg viewBox="0 0 73 73" xmlns="http://www.w3.org/2000/svg"><circle cx="36.5" cy="36.5" r="35.5" class="circle"></circle></svg></button>';
        /* svg에는 넓이높이 삭제, svg안에 circle이든 path든 fill/storke 삭제, 그리고 반드시 circle 클래스 추가 */
        }
    },
	

	navigation: {  /* 이전, 다음 버튼 */
		nextEl: '.visual .swiper .ctrl_btn .btn_next',  /* 다음 버튼의 클래스명 */
		prevEl: '.visual .swiper .ctrl_btn .btn_prev',  
	},

    });

    /* -------------------------
       🔵 SVG stroke 애니메이션 제어용 변수
    ------------------------- */
    let savedOffset = 270;  // stroke-dashoffset 초기값
    const duration = 4800;  // 애니메이션 총 시간 (4.8s)
    let startTime = null;   // 재생 시작 시간 저장
    let paused = false;     // 현재 pause 상태인지 여부

    function pauseProgress() {
        paused = true;

        const activeCircle = $('.visual .paging .swiper-pagination-bullet-active .circle');

        // 현재 dashoffset 값을 가져온다
        const matrix = window.getComputedStyle(activeCircle[0]).getPropertyValue("stroke-dashoffset");
        savedOffset = parseFloat(matrix);

        // 애니메이션 제거 (정지)
        activeCircle.css("animation", "none");
    }

    function resumeProgress() {
        paused = false;

        const activeCircle = $('.visual .paging .swiper-pagination-bullet-active .circle');

        // 남은 stroke 길이에 맞춰 duration 계산
        const percent = savedOffset / 270;   
        const remainTime = duration * percent;

        activeCircle.css({
            "animation": `progress ${remainTime / 1000}s linear forwards`,
            "stroke-dashoffset": savedOffset
        });
    }

    $('.visual .ctrl_btn .btn_pause').on('click', function(){
        visual_swiper.autoplay.stop();  /* 일시정지 기능 */
        $(this).hide()
        $('.visual .ctrl_btn .btn_play').show()
        pauseProgress(); // SVG progress 멈춤
    })

    $('.visual .ctrl_btn .btn_play').on('click', function(){
        visual_swiper.autoplay.start();  /* 재생 기능 */
        $(this).hide()
        $('.visual .ctrl_btn .btn_pause').show()
        resumeProgress(); // SVG progress 다시 시작
    })

    /* -------------------------
       슬라이드 변경 시 progress 정상 초기화
    ------------------------- */
    visual_swiper.on('slideChangeTransitionStart', function () {

            // 1) 모든 bullet progress 초기화
        $('.visual .paging .circle').each(function(){
            $(this).css({
                "animation": "none",
                "stroke-dashoffset": 270
            });
        });

        // 2) active bullet만 animation 재시작
        if (!paused) {
            $('.visual .paging .swiper-pagination-bullet-active .circle')
                .css("animation", "progress 4.8s linear forwards");
        }
    });
    //끝 :: visual_swiper

    //시작 :: biz 이미지 변경
    $('.biz .list ul li').each(function () {
        let bg = $(this).css('background-image');
        $(this).attr('data-original-bg', bg);
    });
    
    
    // mouseenter (hover)
    $('.biz .list ul li').on('mouseenter focusin', function () {
        let bgClass = $(this).data('bg');
    
        // 모든 bgLayer 비활성화
        $('.biz .bgBox .bgLayer').removeClass('active');
    
        // 해당 bgLayer 활성화
        $('.biz .bgBox .' + bgClass).addClass('active');
    
        // li 배경 제거 (문법 고침)
        $('.biz .list ul li').css('background-image', 'none');
    });
    
    
    // mouseleave (전체 ul 벗어날 때)
    $('.biz .list ul').on('mouseleave', function () {
    
        // bgLayer fade-out
        $('.biz .bgBox .bgLayer').removeClass('active');
    
        // fade-out 끝난 뒤 복구
        setTimeout(function () {
    
            $('.biz .list ul li').each(function () {
                let original = $(this).attr('data-original-bg');
                $(this).css('background-image', original);
            });
    
        }, 300); // CSS transition 시간과 동일하게
    });
    //끝 :: biz 이미지 변경

    //시작 :: biz 스크롤
    $(function(){

        if ($(window).width() < 769) return;
    
        let lastProgress = 0;
    
        $(window).on("scroll", function(){
    
            let winH = $(window).height();
            let scrollTop = $(window).scrollTop();
    
            const $ul = $(".biz .list ul");
            const ulTop = $ul.offset().top;
            const ulH = $ul.outerHeight();
            const ulCenter = ulTop + ulH / 2;
    
            // 화면 중앙 기준
            const screenCenter = scrollTop + winH / 2;
    
            // 시작점: ul이 화면 아래에서 진입할 때
            const startTrigger = scrollTop + winH > ulTop;
    
            // 종료점: ul이 화면 위로 모두 사라졌을 때
            const endTrigger = scrollTop > ulTop + ulH;
    
            // --- 종료: 화면에서 벗어나면 progress 초기화 ---
            if (!startTrigger || endTrigger) {
    
                lastProgress = 0;
    
                $(".biz .list ul li").each(function(i){
                    if ((i + 1) % 2 === 1) {
                        $(this).css("transform","translateY(0px)");        // odd
                    } else {
                        $(this).css("transform","translateY(-70px)");      // even
                    }
                });
    
                return;
            }
    
            // --- progress 계산 ---
            const distance = Math.abs(ulCenter - screenCenter);
            const maxDistance = winH * 0.85;
    
            let progress = 1 - (distance / maxDistance);
            progress = Math.max(0, Math.min(1, progress));
    
            // ===== 핵심: progress가 감소하면 업데이트하지 않음 =====
            if (progress < lastProgress) {
                progress = lastProgress;
            }
            lastProgress = progress;
    
            // 이제 translate에 반영
            let maxY = 70;
            let oddY = -maxY * progress;
            let evenY = -maxY + (maxY * progress);
    
            $(".biz .list ul li").each(function(i){
                if ((i + 1) % 2 === 1) {
                    $(this).css("transform","translateY(" + oddY + "px)");
                } else {
                    $(this).css("transform","translateY(" + evenY + "px)");
                }
            });
    
        });
    });
    //끝 :: biz 스크롤

    //시작 :: tech tab
    $(function(){

        // 초기값 - 첫 번째 탭 활성화
        $('.tech .tab_list ul li:first-child').addClass('active');
        $('.tech .tab_content .tab_item:first-child')
            .addClass('active')
            .attr('title','선택됨')
            .show();
    
        // 클릭 이벤트
        $('.tech .tab_list ul li button').on('click', function(){
    
            const $li = $(this).parent();
    
            // 이미 활성화된 탭이면 실행 중단
            if ($li.hasClass('active')) return;
    
            const className = $li.attr('class'); // item01 등
    
            // li active 갱신
            $li.addClass('active').siblings().removeClass('active');
    
            // tab_item 활성화
            $('.tech .tab_content .tab_item')
                .removeClass('active')
                .attr('title','')
                .hide();
    
            $('.tech .tab_content .tab_item.' + className)
                .addClass('active')
                .attr('title','선택됨')
                .fadeIn(500);
    
        });
    
    });
    //끝 :: tech tab

    //시작 :: youtube 영상
    $('.youtube-play').on('click', function () {
    const wrap = $(this).closest('.youtube-wrap');
    const videoId = 'UZPg-HP6Z0o';

    const iframe = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen>
        </iframe>
    `;

    wrap.html(iframe);
    });


    //끝 :: youtube 영상

	
})//맨끝