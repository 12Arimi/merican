'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  useEffect(() => {
    const mericanCarousel = document.getElementById('mericanHeroCarousel')!;
    const mericanDots = document.querySelectorAll('.merican-carousel-dots .dot');
    const totalSlides = 3;
    let slideIndex = 1;
    let timer: NodeJS.Timeout;
    const totalTime = 5;
    const slideDuration = 0.8;
    const slidePercent = 20;

    const setFills = (n: number) => {
      mericanDots.forEach((dot, i) => {
        const fill = dot.querySelector('.progress-fill') as HTMLElement;
        fill.style.transition = 'none';
        fill.style.width = i < n - 1 ? '100%' : '0%';
      });
      void (mericanDots[0] as HTMLElement).offsetWidth;
    };

    const updateSlidePosition = (physicalIndex: number, withTransition = true) => {
      if (withTransition) {
        (mericanCarousel as HTMLElement).style.transition = `transform ${slideDuration}s ease-in-out`;
      } else {
        (mericanCarousel as HTMLElement).style.transition = 'none';
      }
      const offset = -slidePercent * physicalIndex;
      (mericanCarousel as HTMLElement).style.transform = `translateX(${offset}%)`;
      if (!withTransition) {
        void (mericanCarousel as HTMLElement).offsetWidth;
        (mericanCarousel as HTMLElement).style.transition = `transform ${slideDuration}s ease-in-out`;
      }
    };

    const startFillAndTimer = () => {
      const activeFill = mericanDots[slideIndex - 1].querySelector('.progress-fill') as HTMLElement;
      activeFill.style.transition = 'none';
      activeFill.style.width = '0%';
      void activeFill.offsetWidth;
      setTimeout(() => {
        activeFill.style.transition = `width ${totalTime}s linear`;
        activeFill.style.width = '100%';
      }, 50);
      timer = setTimeout(() => nextSlide(), totalTime * 1000);
    };

    const handleTransitionEnd = (callback: () => void) => {
      const onEnd = () => {
        mericanCarousel.removeEventListener('transitionend', onEnd);
        callback();
      };
      mericanCarousel.addEventListener('transitionend', onEnd);
    };

    const nextSlide = () => {
      clearTimeout(timer);
      let nextIndex = slideIndex + 1;
      if (nextIndex > totalSlides) {
        slideIndex = 1;
        mericanDots.forEach(dot => dot.classList.remove('active'));
        mericanDots[0].classList.add('active');
        setFills(1);
        updateSlidePosition(4, true);
        handleTransitionEnd(() => {
          updateSlidePosition(1, false);
          startFillAndTimer();
        });
      } else {
        slideIndex = nextIndex;
        mericanDots.forEach(dot => dot.classList.remove('active'));
        mericanDots[slideIndex - 1].classList.add('active');
        setFills(slideIndex);
        updateSlidePosition(slideIndex, true);
        handleTransitionEnd(startFillAndTimer);
      }
    };

    const prevSlide = () => {
      clearTimeout(timer);
      let prevIndex = slideIndex - 1;
      if (prevIndex < 1) {
        slideIndex = totalSlides;
        mericanDots.forEach(dot => dot.classList.remove('active'));
        mericanDots[2].classList.add('active');
        setFills(slideIndex);
        updateSlidePosition(0, true);
        handleTransitionEnd(() => {
          updateSlidePosition(3, false);
          startFillAndTimer();
        });
      } else {
        slideIndex = prevIndex;
        mericanDots.forEach(dot => dot.classList.remove('active'));
        mericanDots[slideIndex - 1].classList.add('active');
        setFills(slideIndex);
        updateSlidePosition(slideIndex, true);
        handleTransitionEnd(startFillAndTimer);
      }
    };

    const showSlides = (n: number) => {
      clearTimeout(timer);
      if (n === slideIndex) {
        setFills(n);
        startFillAndTimer();
        return;
      }
      slideIndex = n;
      mericanDots.forEach(dot => dot.classList.remove('active'));
      mericanDots[slideIndex - 1].classList.add('active');
      setFills(slideIndex);
      updateSlidePosition(slideIndex, true);
      handleTransitionEnd(startFillAndTimer);
    };

    // Swipe gestures
    let startX = 0;
    mericanCarousel.addEventListener('touchstart', e => (startX = e.touches[0].clientX));
    mericanCarousel.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      else if (endX - startX > 50) prevSlide();
    });

    // Dot click handler
    (window as any).currentSlide = (n: number) => {
      showSlides(n);
    };

    // Initialize
    updateSlidePosition(1, false);
    mericanDots.forEach(dot => dot.classList.remove('active'));
    mericanDots[0].classList.add('active');
    setFills(1);
    setTimeout(startFillAndTimer, 100);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  return (
    <section className="merican-hero-carousel-container">
      <div className="merican-hero-carousel" id="mericanHeroCarousel">
        {/* Slides here */}
        {/* Clone of slide 3 */}
        <div className="merican-carousel-slide clone">
          <img src="/images/hero3.webp" alt="Chef working with professional-grade cooking appliances" />
          <div className="merican-carousel-caption">
            <h1><strong>Built for Durability & Performance</strong></h1>
            <p>Equipment that stands up to the demands of a high-volume professional environment.</p>
            <Link href="#" className="merican-carousel-btn">Get in Touch</Link>
          </div>
        </div>

        {/* Slide 1 */}
        <div className="merican-carousel-slide">
          <img src="/images/hero1.webp" alt="Modern kitchen equipment layout" />
          <div className="merican-carousel-caption">
            <h1><strong>Innovating Commercial Kitchens</strong></h1>
            <p>High-quality, durable equipment for every stage of your culinary process.</p>
            <Link href="/products" className="merican-carousel-btn">View Products</Link>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="merican-carousel-slide">
          <img src="/images/hero2.webp" alt="A sleek stainless steel food prep area" />
          <div className="merican-carousel-caption">
            <h1><strong>Design, Supply, & Installation</strong></h1>
            <p>From concept to completion, we handle your entire kitchen project.</p>
            <Link href="#" className="merican-carousel-btn merican-btn-secondary">Explore Projects</Link>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="merican-carousel-slide">
          <img src="/images/hero3.webp" alt="Chef working with professional-grade cooking appliances" />
          <div className="merican-carousel-caption">
            <h1><strong>Built for Durability & Performance</strong></h1>
            <p>Equipment that stands up to the demands of a high-volume professional environment.</p>
            <Link href="#" className="merican-carousel-btn">Get in Touch</Link>
          </div>
        </div>

        {/* Clone of slide 1 */}
        <div className="merican-carousel-slide clone">
          <img src="/images/hero1.webp" alt="Modern kitchen equipment layout" />
          <div className="merican-carousel-caption">
            <h1><strong>Innovating Commercial Kitchens</strong></h1>
            <p>High-quality, durable equipment for every stage of your culinary process.</p>
            <Link href="/products" className="merican-carousel-btn">View Products</Link>
          </div>
        </div>
      </div>

      <div className="merican-carousel-dots">
        <span className="dot active"><div className="progress-fill"></div></span>
        <span className="dot"><div className="progress-fill"></div></span>
        <span className="dot"><div className="progress-fill"></div></span>
      </div>
    </section>
  );
}
