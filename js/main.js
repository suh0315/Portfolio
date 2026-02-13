$(document).ready(function(){
	window.onload = function(){
     const elm = document.querySelectorAll('.section');
     const elmCount = elm.length;
     elm.forEach(function(item, index){
       item.addEventListener('mousewheel', function(event){
         event.preventDefault();
         let delta = 0;

         if (!event) event = window.event;
         if (event.wheelDelta) {
             delta = event.wheelDelta / 120;
             if (window.opera) delta = -delta;
         } 
         else if (event.detail)
             delta = -event.detail / 3;

         let moveTop = window.scrollY;
         let elmSelector = elm[index];

         // wheel down : move to next section
         if (delta < 0){
           if (elmSelector !== elmCount-1){
             try{
               moveTop = window.pageYOffset + elmSelector.nextElementSibling.getBoundingClientRect().top;
             }catch(e){}
           }
         }
         
         // wheel up : move to previous section
         else{
           if (elmSelector !== 0){
             try{
               moveTop = window.pageYOffset + elmSelector.previousElementSibling.getBoundingClientRect().top;
             }catch(e){}
           }
         }

         const body = document.querySelector('html');
         window.scrollTo({top:moveTop, left:0, behavior:'smooth'});
       });
     });
   }
   var swiper = new Swiper(".mySwiper", {
      slidesPerView: 1,  //초기값 설정 모바일값이 먼저!!
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
        
          768: {
            slidesPerView: 2,  //브라우저가 768보다 클 때
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,  //브라우저가 1024보다 클 때
            spaceBetween: 50,
          },
        },
     centeredSlides: true,
     watchOverflow : true,
     allowTouchMove : true,
     autoplay: {
       delay: 2500,
       speed: 600,
       disableOnInteraction: false,
     },
     pagination: {
       el: ".swiper-pagination",
       clickable: true,
     },
     navigation: {
       nextEl: ".swiper-button-next",
       prevEl: ".swiper-button-prev",
     },
   });

   const targets = document.querySelectorAll(".fade-class");
   const options = { root: null, threshold: 0.1, rootMargin: "-0px" };
   const observer = new IntersectionObserver(function (entries, observer) {
   entries.forEach((entry) => {
     const container = entry.target;
     if (entry.isIntersecting) {
       container.classList.add("fade-in");
     } else {
       container.classList.remove("fade-in");
     }
   });
   }, options);

   targets.forEach((target) => {
   observer.observe(target);
   });

   $('.tab_head button').on('click', function() {
      let tab = $(this).data('tab');

      $('.tab_head button').removeClass('on');
      $(this).addClass('on');

      $('.tab_item').removeClass('on');
      $(`.tab_item[data-tab="${tab}"`).addClass('on');
   });

   import { useRef, useCallback, useEffect } from 'react'

   // 스크롤하면 페이드인 하는 애니메이션
   export const useScrollFadeIn = (direction, duration, delay) => {
   // 해당 컴포넌트 가져오기
   const element = useRef()
   // direction 선택
   const hanldeDirection = (name) => {
      switch (name) {
         case "up":
            return "translate3d(0, 50%, 0)"
         case "down": return "tranlate3d(0, -50%, 0)"
         case "left": return "translate3d(50%, 0, 0)"
         case "right": return "translate3d(-50%, 0, 0)"
         derault:
         return;
      }
   }

   // 설정해둔 컴포넌트를 만날때마다 함수가 재실행되도록 callback하기
   const onScroll = useCallback(([entry])=>{
      const { current } = element
      if(entry.isIntersecting) {
         current.style.tansitionProperty = 'all'
         current.style.transitionDuration = `${duration}s`
         current.style.transitionTimingFunction = "cubic-bezier(0, 0, 0.2, 1)"
         current.style.opacity = 1;
         current.style.tranform = "translate3d(0, 0, 0)"
      }
   }, [delay, duration])

   // intersection-observer로 컴포넌트 위치 observe하기
   useEffect(()=>{
      let observer
      
      if(element.current) {
         observer = new IntersectionObserver(onScroll, {threshold: 0.7})
         observer.observe(element.current)
         }
         
         return() => observer && observer.disconnect()
   }, [onScroll])

   return{ref: element, style: { opacity: 0, transform: handleDirection(direction) },

})//맨끝