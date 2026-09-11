

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  function filterCatalog(category) {
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const categories = cardCategory.split(' ');
      if (category === 'all' || categories.includes(category)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      filterCatalog(filter);
    });
  });

  const promoTrack = document.getElementById('promoSliderTrack');
  const promoSlides = document.querySelectorAll('.promo-slide');
  const promoPrevBtn = document.getElementById('promoPrev');
  const promoNextBtn = document.getElementById('promoNext');
  const promoDotsContainer = document.getElementById('promoDots');

  if (promoTrack && promoSlides.length > 0) {
    let currentSlideIndex = 0;
    let autoplayTimer = null;

    function getSlidesPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      const perView = getSlidesPerView();
      return Math.max(0, promoSlides.length - perView);
    }

    function renderDots() {
      if (!promoDotsContainer) return;
      promoDotsContainer.innerHTML = '';
      const maxIdx = getMaxIndex();
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${i === currentSlideIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Слайд ${i + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(i);
          resetAutoplay();
        });
        promoDotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const maxIdx = getMaxIndex();
      if (currentSlideIndex > maxIdx) currentSlideIndex = maxIdx;
      if (currentSlideIndex < 0) currentSlideIndex = 0;

      const perView = getSlidesPerView();
      const slideWidthPercent = 100 / perView;
      const offsetPercent = currentSlideIndex * slideWidthPercent;

      promoTrack.style.transform = `translateX(-${offsetPercent}%)`;

      if (promoDotsContainer) {
        const dots = promoDotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentSlideIndex);
        });
      }
    }

    function goToSlide(index) {
      currentSlideIndex = index;
      updateSlider();
    }

    function nextSlide() {
      const maxIdx = getMaxIndex();
      if (currentSlideIndex >= maxIdx) {
        currentSlideIndex = 0;
      } else {
        currentSlideIndex++;
      }
      updateSlider();
    }

    function prevSlide() {
      const maxIdx = getMaxIndex();
      if (currentSlideIndex <= 0) {
        currentSlideIndex = maxIdx;
      } else {
        currentSlideIndex--;
      }
      updateSlider();
    }

    if (promoNextBtn) {
      promoNextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (promoPrevBtn) {
      promoPrevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    let startX = 0;
    let endX = 0;
    const container = document.getElementById('promoSliderContainer');
    if (container) {
      container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoplay();
      }, { passive: true });

      container.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
        startAutoplay();
      }, { passive: true });

      container.addEventListener('mouseenter', stopAutoplay);
      container.addEventListener('mouseleave', startAutoplay);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    function resetAutoplay() {
      startAutoplay();
    }

    renderDots();
    updateSlider();
    startAutoplay();

    window.addEventListener('resize', () => {
      renderDots();
      updateSlider();
    }, { passive: true });
  }

  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  const favBadge = document.getElementById('favBadge');
  let favCount = 0;

  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const svg = btn.querySelector('svg');
      const isFilled = btn.classList.toggle('active');
      
      if (isFilled) {
        svg.setAttribute('fill', '#C52222');
        svg.style.color = '#C52222';
        favCount++;
      } else {
        svg.setAttribute('fill', 'none');
        svg.style.color = 'currentColor';
        favCount = Math.max(0, favCount - 1);
      }

      if (favBadge) {
        favBadge.textContent = favCount;
      }
    });
  });

  const salonsData = [
    {
      coords: [53.407421, 58.983790],
      title: "ул. Карла Маркса, 42",
      badge: "Центральный + Мастерская ⚡",
      desc: "Срочное изготовление за 20 минут, проверка зрения, ремонт очков и пайка оправ.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.376820, 58.973412],
      title: "ул. Советская, 137",
      badge: "Салон оптики",
      desc: "Проверка зрения, большой выбор оправ и контактных линз.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.360123, 58.970211],
      title: "ул. Советская, 174",
      badge: "Салон оптики",
      desc: "Детская и взрослая оптика, антивандальные силиконовые оправы.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.359211, 58.988123],
      title: "пр. Ленина, 146",
      badge: "Салон оптики",
      desc: "Подбор очков, солнцезащитные очки с поляризацией, аксессуары.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.401123, 58.983456],
      title: "ул. Карла Маркса, 74",
      badge: "ТРК «Крытый рынок»",
      desc: "Удобно совместить с покупками. Быстрая проверка зрения.",
      hours: "09:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.385210, 58.982145],
      title: "ул. Завенягина, 10а",
      badge: "ТРК «МОСТ-2»",
      desc: "Молодежные и трендовые оправы, линзы, солнцезащитные очки.",
      hours: "10:00 – 20:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.433210, 59.049812],
      title: "ул. Пушкина, 21",
      badge: "ТЦ «Пушкинский»",
      desc: "Филиал в Ленинском районе. Полный спектр услуг оптики.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    }
  ];

  let yandexMap = null;
  const placemarksList = [];

  function initMap() {
    if (typeof ymaps === 'undefined' || !document.getElementById('salonsMap')) return;

    ymaps.ready(() => {
      yandexMap = new ymaps.Map('salonsMap', {
        center: [53.395, 58.995],
        zoom: 12,
        controls: ['zoomControl', 'geolocationControl', 'typeSelector', 'fullscreenControl']
      }, {
        searchControlProvider: 'yandex#search'
      });

      const collection = new ymaps.GeoObjectCollection(null, {});

      salonsData.forEach((salon, idx) => {
        const balloonHtml = `
          <div style="font-family:'Montserrat',sans-serif; padding:6px 4px; max-width:260px;">
            <div style="font-size:11px; font-weight:700; color:#C52222; text-transform:uppercase; margin-bottom:4px;">${salon.badge}</div>
            <div style="font-size:15px; font-weight:800; color:#111; margin-bottom:6px;">${salon.title}</div>
            <div style="font-size:12px; color:#4B5563; line-height:1.4; margin-bottom:8px;">${salon.desc}</div>
            <div style="font-size:12px; color:#111; font-weight:600; margin-bottom:10px;">🕒 Пн–Вс: ${salon.hours}</div>
            <a href="${salon.link}" target="_blank" rel="noopener" style="display:inline-block; background-color:#0077FF; color:#FFF; font-size:12px; font-weight:700; padding:6px 14px; border-radius:4px; text-decoration:none;">Написать в VK →</a>
          </div>
        `;

        const placemark = new ymaps.Placemark(salon.coords, {
          balloonContent: balloonHtml,
          hintContent: `«Урал-Оптика»: ${salon.title}`
        }, {
          preset: idx === 0 ? 'islands#redStarIcon' : 'islands#redDotIcon',
          iconColor: idx === 0 ? '#C52222' : '#C52222'
        });

        placemarksList.push(placemark);
        collection.add(placemark);
      });

      yandexMap.geoObjects.add(collection);
      yandexMap.setBounds(collection.getBounds(), { checkZoomRange: true, zoomMargin: 40 });
      yandexMap.behaviors.disable('scrollZoom');
    });
  }

  initMap();

  const salonCards = document.querySelectorAll('.salon-minimal-card[data-salon-idx]');
  salonCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-salon-idx'), 10);
      if (yandexMap && placemarksList[idx]) {
        const salon = salonsData[idx];
        const mapEl = document.getElementById('salonsMap');
        if (mapEl) {
          mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        yandexMap.panTo(salon.coords, {
          duration: 600,
          timingFunction: 'ease-in-out'
        }).then(() => {
          yandexMap.setZoom(15);
          placemarksList[idx].balloon.open();
        });
      }
    });
  });

});
