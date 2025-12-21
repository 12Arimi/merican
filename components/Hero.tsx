'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from "../lib/useTranslation"; // Import your hook

export default function Hero() {
  const { t } = useTranslation();

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
      if (!activeFill) return;
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

    let startX = 0;
    const touchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const touchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      else if (endX - startX > 50) prevSlide();
    };

    mericanCarousel.addEventListener('touchstart', touchStart as any);
    mericanCarousel.addEventListener('touchend', touchEnd as any);

    (window as any).currentSlide = (n: number) => showSlides(n);

    updateSlidePosition(1, false);
    mericanDots.forEach(dot => dot.classList.remove('active'));
    mericanDots[0].classList.add('active');
    setFills(1);
    setTimeout(startFillAndTimer, 100);

    return () => {
      clearTimeout(timer);
      mericanCarousel.removeEventListener('touchstart', touchStart as any);
      mericanCarousel.removeEventListener('touchend', touchEnd as any);
    };
  }, []);

  return (
    <section className="merican-hero-carousel-container">
      <div className="merican-hero-carousel" id="mericanHeroCarousel">
        
        {/* Clone of slide 3 */}
        <div className="merican-carousel-slide clone">
          <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/hero3.webp" alt="Kitchen Appliances" />
          <div className="merican-carousel-caption">
            <h1><strong>{t("hero.slides.slide3.title")}</strong></h1>
            <p>{t("hero.slides.slide3.description")}</p>
            <Link href="#" className="merican-carousel-btn">{t("hero.slides.slide3.button")}</Link>
          </div>
        </div>

        {/* Slide 1 */}
        <div className="merican-carousel-slide">
          <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/hero1.webp" alt="Kitchen Layout" />
          <div className="merican-carousel-caption">
            <h1><strong>{t("hero.slides.slide1.title")}</strong></h1>
            <p>{t("hero.slides.slide1.description")}</p>
            <Link href="/products" className="merican-carousel-btn">{t("hero.slides.slide1.button")}</Link>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="merican-carousel-slide">
          <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/hero2.webp" alt="Stainless Steel Prep" />
          <div className="merican-carousel-caption">
            <h1><strong>{t("hero.slides.slide2.title")}</strong></h1>
            <p>{t("hero.slides.slide2.description")}</p>
            <Link href="#" className="merican-carousel-btn merican-btn-secondary">{t("hero.slides.slide2.button")}</Link>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="merican-carousel-slide">
          <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/hero3.webp" alt="Kitchen Appliances" />
          <div className="merican-carousel-caption">
            <h1><strong>{t("hero.slides.slide3.title")}</strong></h1>
            <p>{t("hero.slides.slide3.description")}</p>
            <Link href="#" className="merican-carousel-btn">{t("hero.slides.slide3.button")}</Link>
          </div>
        </div>

        {/* Clone of slide 1 */}
        <div className="merican-carousel-slide clone">
          <img src="https://lxvghczvmslyiiyrpzaw.supabase.co/storage/v1/object/public/images/hero1.webp" alt="Kitchen Layout" />
          <div className="merican-carousel-caption">
            <h1><strong>{t("hero.slides.slide1.title")}</strong></h1>
            <p>{t("hero.slides.slide1.description")}</p>
            <Link href="/products" className="merican-carousel-btn">{t("hero.slides.slide1.button")}</Link>
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