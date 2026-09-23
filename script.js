document.addEventListener('DOMContentLoaded', () => {
  'use strict';

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
    if (mobileMenu) mobileMenu.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  /* ==========================================================================
     CATALOG PAGINATION & CATEGORY FILTER
     ========================================================================== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = Array.from(document.querySelectorAll('#productsGrid .product-card'));
  const loadMoreBtn = document.getElementById('catalogLoadMoreBtn');
  const loadMoreText = document.getElementById('loadMoreBtnText');
  const countInfo = document.getElementById('catalogCountInfo');

  const pageSize = window.innerWidth <= 640 ? 8 : 12;
  let currentCategory = 'all';
  let visibleCount = pageSize;

  function updateCatalog() {
    const matchingCards = productCards.filter(card => {
      const cardCat = card.getAttribute('data-category') || '';
      const cats = cardCat.split(' ');
      return currentCategory === 'all' || cats.includes(currentCategory);
    });

    const totalMatching = matchingCards.length;

    productCards.forEach(card => card.classList.add('hidden'));

    matchingCards.slice(0, visibleCount).forEach(card => {
      card.classList.remove('hidden');
    });

    if (loadMoreBtn && countInfo) {
      if (visibleCount < totalMatching) {
        loadMoreBtn.classList.remove('hidden');
        const remaining = totalMatching - visibleCount;
        const nextBatch = Math.min(pageSize, remaining);
        if (loadMoreText) {
          loadMoreText.textContent = `Показать ещё товары (+${nextBatch})`;
        }
        countInfo.textContent = `Показано ${Math.min(visibleCount, totalMatching)} из ${totalMatching} позиций`;
      } else {
        loadMoreBtn.classList.add('hidden');
        countInfo.textContent = `Показано все ${totalMatching} позиций категории`;
      }
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      visibleCount = pageSize;
      updateCatalog();
    });
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += pageSize;
      updateCatalog();
    });
  }

  // Initial render
  updateCatalog();

  /* ==========================================================================
     ИНТЕРАКТИВНОЕ МОДАЛЬНОЕ ОКНО ТОВАРА («ПРОВАЛИТЬСЯ И НАПИСАТЬ»)
     ========================================================================== */
  const productModal = document.getElementById('productModal');
  const modalClose = document.getElementById('productModalClose');
  const modalMainImg = document.getElementById('modalMainImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalBrand = document.getElementById('modalBrand');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalOldPrice = document.getElementById('modalOldPrice');
  const modalTags = document.getElementById('modalTags');
  const modalDesc = document.getElementById('modalDesc');
  const modalThumbs = document.getElementById('modalThumbs');
  const modalPrevBtn = document.getElementById('modalGalleryPrev');
  const modalNextBtn = document.getElementById('modalGalleryNext');
  const modalCounter = document.getElementById('modalPhotoCounter');
  const modalWaBtn = document.getElementById('modalWaBtn');
  const modalVkBtn = document.getElementById('modalVkBtn');
  const modalMaxBtn = document.getElementById('modalMaxBtn');

  let currentModalImages = [];
  let currentModalImageIndex = 0;

  function setModalImage(index) {
    if (!currentModalImages.length) return;
    currentModalImageIndex = (index + currentModalImages.length) % currentModalImages.length;
    
    if (modalMainImg) {
      modalMainImg.src = currentModalImages[currentModalImageIndex];
    }

    if (modalCounter) {
      modalCounter.textContent = `${currentModalImageIndex + 1} / ${currentModalImages.length}`;
    }

    if (modalThumbs) {
      const thumbs = modalThumbs.querySelectorAll('.modal-thumb');
      thumbs.forEach((t, i) => {
        if (i === currentModalImageIndex) {
          t.classList.add('is-active');
        } else {
          t.classList.remove('is-active');
        }
      });
    }
  }

  function openProductModal(card) {
    if (!productModal) return;

    const brandEl = card.querySelector('.product-brand');
    const titleEl = card.querySelector('.product-title-item');
    const descEl = card.querySelector('.product-model');
    const priceEl = card.querySelector('.product-price');
    const oldPriceEl = card.querySelector('.product-old-price, .old-price');
    const tagEls = card.querySelectorAll('.product-feature-tag');
    const badgeEl = card.querySelector('.hit-tag, .discount-tag');
    const mainImgEl = card.querySelector('.product-image');

    const brandText = brandEl ? brandEl.textContent.trim() : 'УРАЛ-ОПТИКА';
    const titleText = titleEl ? titleEl.textContent.trim() : 'Оправа / Очки';
    const priceHtml = priceEl ? priceEl.innerHTML : 'от 2 500 ₽';
    const cleanPrice = priceEl ? priceEl.textContent.replace(/\s+/g, ' ').trim() : 'от 2 500 ₽';
    const oldPriceText = oldPriceEl ? oldPriceEl.textContent.trim() : '';
    const descText = descEl ? descEl.textContent.trim() : 'Стильная качественная оправа в наличии в салонах сети.';
    const badgeText = badgeEl ? badgeEl.textContent.trim() : 'В НАЛИЧИИ';

    const dataImages = card.getAttribute('data-images');
    if (dataImages) {
      try {
        currentModalImages = JSON.parse(dataImages);
      } catch (e) {
        currentModalImages = mainImgEl ? [mainImgEl.getAttribute('src')] : [];
      }
    } else if (mainImgEl) {
      currentModalImages = [mainImgEl.getAttribute('src')];
    } else {
      currentModalImages = [];
    }

    if (modalBrand) modalBrand.textContent = brandText;
    if (modalTitle) modalTitle.textContent = titleText;
    if (modalDesc) modalDesc.textContent = descText;
    if (modalPrice) modalPrice.innerHTML = priceHtml;
    if (modalOldPrice) modalOldPrice.textContent = oldPriceText;
    if (modalBadge) modalBadge.textContent = badgeText;

    if (modalTags) {
      modalTags.innerHTML = '';
      tagEls.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'modal-tag';
        span.textContent = tag.textContent.trim();
        modalTags.appendChild(span);
      });
    }

    if (modalThumbs) {
      modalThumbs.innerHTML = '';
      if (currentModalImages.length > 1) {
        currentModalImages.forEach((imgSrc, idx) => {
          const thumb = document.createElement('div');
          thumb.className = `modal-thumb ${idx === 0 ? 'is-active' : ''}`;
          thumb.innerHTML = `<img src="${imgSrc}" alt="" loading="lazy">`;
          thumb.addEventListener('click', () => setModalImage(idx));
          modalThumbs.appendChild(thumb);
        });
        modalThumbs.style.display = 'flex';
      } else {
        modalThumbs.style.display = 'none';
      }
    }

    if (currentModalImages.length > 1) {
      if (modalPrevBtn) modalPrevBtn.style.display = 'flex';
      if (modalNextBtn) modalNextBtn.style.display = 'flex';
      if (modalCounter) modalCounter.style.display = 'block';
    } else {
      if (modalPrevBtn) modalPrevBtn.style.display = 'none';
      if (modalNextBtn) modalNextBtn.style.display = 'none';
      if (modalCounter) modalCounter.style.display = 'none';
    }

    // Pre-filled messenger links for maximum conversion
    const inquiryText = `Здравствуйте! Меня интересует: "${titleText}" (${cleanPrice}). Подскажите точную стоимость очков с линзами по моим диоптриям и в каком салоне оправа в наличии на примерку?`;

    if (modalWaBtn) {
      modalWaBtn.href = `https://wa.me/79090997774?text=${encodeURIComponent(inquiryText)}`;
    }
    if (modalVkBtn) {
      modalVkBtn.href = 'https://vk.me/uraloptikm';
    }
    if (modalMaxBtn) {
      modalMaxBtn.href = 'https://max.ru/join/PMF1tS2N4imBxetGMkp3HiLltOjBB8AHs0RBKVmGBi0';
    }

    setModalImage(0);

    productModal.classList.add('is-open', 'active');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('is-open', 'active');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Delegated click on all product cards and view buttons
  document.addEventListener('click', (e) => {
    if (typeof isDraggingLiveSlider !== 'undefined' && isDraggingLiveSlider) return;
    const btn = e.target.closest('.btn-view-product, .btn-check-stock, .live-card-action, .live-zoom-btn');
    if (btn) {
      e.preventDefault();
      const card = btn.closest('.product-card, .live-photo-card');
      if (card) {
        openProductModal(card);
        return;
      }
    }

    const card = e.target.closest('.product-card, .live-photo-card');
    if (card && !e.target.closest('a')) {
      openProductModal(card);
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeProductModal);

  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setModalImage(currentModalImageIndex - 1);
    });
  }

  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setModalImage(currentModalImageIndex + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!productModal || (!productModal.classList.contains('active') && !productModal.classList.contains('is-open'))) return;
    if (e.key === 'Escape') {
      closeProductModal();
    } else if (e.key === 'ArrowLeft') {
      setModalImage(currentModalImageIndex - 1);
    } else if (e.key === 'ArrowRight') {
      setModalImage(currentModalImageIndex + 1);
    }
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
      badge: "⭐ Главный офис + Мастерская",
      desc: "Здесь находится мастерская и главный офис оптики. Диагностика зрения оптометристами, приём детского и взрослого офтальмолога, срочное изготовление очков. Ремонт очков любой сложности (пайка шарниров, замена носовых упоров, установка болтиков). Большой выбор оправ и солнцезащитных очков, очковые линзы мировых брендов: Essilor, Shamir, Carl Zeiss, BBGR, Neolook, Завод ОДВ.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.376820, 58.973412],
      title: "ул. Советская, 137",
      badge: "Салон оптики",
      desc: "Диагностика зрения оптометристами, приём детского и взрослого офтальмолога, срочное изготовление очков. Ремонт очков любой сложности (пайка шарниров, замена носовых упоров, установка болтиков). Большой выбор оправ и солнцезащитных очков, очковые линзы мировых брендов: Essilor, Shamir, Carl Zeiss, BBGR, Neolook, Завод ОДВ.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.360123, 58.970211],
      title: "ул. Советская, 174",
      badge: "Салон оптики",
      desc: "Диагностика зрения оптометристами, приём детского и взрослого офтальмолога, срочное изготовление очков. Ремонт очков любой сложности (пайка шарниров, замена носовых упоров, установка болтиков). Большой выбор оправ и солнцезащитных очков, очковые линзы мировых брендов: Essilor, Shamir, Carl Zeiss, BBGR, Neolook, Завод ОДВ.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.359211, 58.988123],
      title: "пр. Ленина, 146",
      badge: "Салон оптики",
      desc: "Диагностика зрения оптометристами, приём детского и взрослого офтальмолога, срочное изготовление очков. Ремонт очков любой сложности (пайка шарниров, замена носовых упоров, установка болтиков). Большой выбор оправ и солнцезащитных очков, очковые линзы мировых брендов: Essilor, Shamir, Carl Zeiss, BBGR, Neolook, Завод ОДВ.",
      hours: "10:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.401123, 58.983456],
      title: "ул. Карла Маркса, 74",
      badge: "ТРК «Крытый рынок»",
      desc: "Диагностика зрения оптометристами, приём детского и взрослого офтальмолога, срочное изготовление очков. Ремонт очков любой сложности (пайка шарниров, замена носовых упоров, установка болтиков). Большой выбор оправ и солнцезащитных очков, очковые линзы мировых брендов: Essilor, Shamir, Carl Zeiss, BBGR, Neolook, Завод ОДВ.",
      hours: "09:00 – 19:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.385210, 58.982145],
      title: "ул. Завенягина, 10а",
      badge: "ТРК «МОСТ-2»",
      desc: "Диагностика зрения оптометристами, приём детского и взрослого офтальмолога, срочное изготовление очков. Ремонт очков любой сложности (пайка шарниров, замена носовых упоров, установка болтиков). Большой выбор оправ и солнцезащитных очков, очковые линзы мировых брендов: Essilor, Shamir, Carl Zeiss, BBGR, Neolook, Завод ОДВ.",
      hours: "10:00 – 20:00",
      link: "https://vk.me/uraloptikm"
    },
    {
      coords: [53.433210, 59.049812],
      title: "ул. Пушкина, 21",
      badge: "ТРК «Техникум»",
      desc: "Диагностика зрения оптометристами, приём детского и взрослого офтальмолога, срочное изготовление очков. Ремонт очков любой сложности (пайка шарниров, замена носовых упоров, установка болтиков). Большой выбор оправ и солнцезащитных очков, очковые линзы мировых брендов: Essilor, Shamir, Carl Zeiss, BBGR, Neolook, Завод ОДВ.",
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
      
      salonCards.forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');

      if (yandexMap && placemarksList[idx]) {
        const salon = salonsData[idx];
        const mapEl = document.getElementById('salonsMap');
        
        // On mobile scroll smoothly to map
        if (window.innerWidth < 1024 && mapEl) {
          mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        yandexMap.panTo(salon.coords, {
          duration: 500,
          timingFunction: 'ease-in-out'
        }).then(() => {
          yandexMap.setZoom(15);
          placemarksList[idx].balloon.open();
        });
      }
    });
  });

  // === REVIEWS SLIDER INITIALIZATION ===
  const reviewsTrack = document.getElementById('reviewsSliderTrack');
  const reviewsSlides = document.querySelectorAll('.review-slide');
  const reviewsPrevBtn = document.getElementById('reviewsPrev');
  const reviewsNextBtn = document.getElementById('reviewsNext');
  const reviewsDotsContainer = document.getElementById('reviewsDots');

  if (reviewsTrack && reviewsSlides.length > 0) {
    let currentReviewSlide = 0;

    function getReviewsPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxReviewIndex() {
      const perView = getReviewsPerView();
      return Math.max(0, reviewsSlides.length - perView);
    }

    function renderReviewDots() {
      if (!reviewsDotsContainer) return;
      reviewsDotsContainer.innerHTML = '';
      const maxIdx = getMaxReviewIndex();
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === currentReviewSlide ? ' active' : '');
        dot.setAttribute('aria-label', 'Отзыв ' + (i + 1));
        dot.addEventListener('click', () => {
          goToReviewSlide(i);
        });
        reviewsDotsContainer.appendChild(dot);
      }
    }

    function updateReviewsSlider() {
      const maxIdx = getMaxReviewIndex();
      if (currentReviewSlide > maxIdx) currentReviewSlide = maxIdx;
      if (currentReviewSlide < 0) currentReviewSlide = 0;

      const perView = getReviewsPerView();
      const slideWidthPercent = 100 / perView;
      const offsetPercent = currentReviewSlide * slideWidthPercent;

      reviewsTrack.style.transform = 'translateX(-' + offsetPercent + '%)';

      if (reviewsDotsContainer) {
        const dots = reviewsDotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentReviewSlide);
        });
      }
    }

    function goToReviewSlide(index) {
      currentReviewSlide = index;
      updateReviewsSlider();
    }

    function nextReviewSlide() {
      const maxIdx = getMaxReviewIndex();
      if (currentReviewSlide >= maxIdx) {
        currentReviewSlide = 0;
      } else {
        currentReviewSlide++;
      }
      updateReviewsSlider();
    }

    function prevReviewSlide() {
      const maxIdx = getMaxReviewIndex();
      if (currentReviewSlide <= 0) {
        currentReviewSlide = maxIdx;
      } else {
        currentReviewSlide--;
      }
      updateReviewsSlider();
    }

    if (reviewsNextBtn) {
      reviewsNextBtn.addEventListener('click', nextReviewSlide);
    }

    if (reviewsPrevBtn) {
      reviewsPrevBtn.addEventListener('click', prevReviewSlide);
    }

    // Touch swipe for reviews slider
    let rStartX = 0;
    let rEndX = 0;
    const rContainer = document.getElementById('reviewsSliderContainer');
    if (rContainer) {
      rContainer.addEventListener('touchstart', (e) => {
        rStartX = e.touches[0].clientX;
      }, { passive: true });

      rContainer.addEventListener('touchend', (e) => {
        rEndX = e.changedTouches[0].clientX;
        const diff = rStartX - rEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) nextReviewSlide();
          else prevReviewSlide();
        }
      }, { passive: true });
    }

    renderReviewDots();
    updateReviewsSlider();

    window.addEventListener('resize', () => {
      renderReviewDots();
      updateReviewsSlider();
    });
  }


  // === SMOOTH SCROLL REVEAL ===
  function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-stagger');
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  initScrollAnimations();


  // Live photos slider controls
  let isDraggingLiveSlider = false;
  const liveSlider = document.getElementById('liveSliderContainer');
  const livePrev = document.getElementById('livePrev');
  const liveNext = document.getElementById('liveNext');

  if (liveSlider) {
    if (livePrev) {
      livePrev.addEventListener('click', () => {
        liveSlider.scrollBy({ left: -320, behavior: 'smooth' });
      });
    }
    if (liveNext) {
      liveNext.addEventListener('click', () => {
        liveSlider.scrollBy({ left: 320, behavior: 'smooth' });
      });
    }

    // Drag to scroll on desktop
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    liveSlider.addEventListener('mousedown', (e) => {
      isDown = true;
      isDraggingLiveSlider = false;
      startX = e.pageX - liveSlider.offsetLeft;
      scrollStart = liveSlider.scrollLeft;
      liveSlider.style.cursor = 'grabbing';
      liveSlider.style.userSelect = 'none';
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        liveSlider.style.cursor = '';
        liveSlider.style.removeProperty('user-select');
        setTimeout(() => { isDraggingLiveSlider = false; }, 60);
      }
    });

    liveSlider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - liveSlider.offsetLeft;
      const walk = (x - startX);
      if (Math.abs(walk) > 6) {
        isDraggingLiveSlider = true;
      }
      liveSlider.scrollLeft = scrollStart - walk;
    });
  }

  /* ==========================================================================
     VIBRANT TRENDS CAROUSEL INTERACTION
     ========================================================================== */
  const vibrantGrid = document.getElementById('vibrantGrid');
  const vibrantPrev = document.getElementById('vibrantPrev');
  const vibrantNext = document.getElementById('vibrantNext');
  const vibrantHint = document.getElementById('vibrantScrollHint');
  const vibrantDots = document.querySelectorAll('.vibrant-dot');

  if (vibrantGrid) {
    const getScrollStep = () => {
      const firstCard = vibrantGrid.querySelector('.vibrant-card');
      return firstCard ? (firstCard.offsetWidth + 14) : 234;
    };

    const updateArrowsAndDots = () => {
      const step = getScrollStep();
      const currentScroll = vibrantGrid.scrollLeft;
      const maxScroll = vibrantGrid.scrollWidth - vibrantGrid.clientWidth;

      if (vibrantPrev) {
        vibrantPrev.style.opacity = currentScroll <= 12 ? '0.3' : '1';
        vibrantPrev.style.pointerEvents = currentScroll <= 12 ? 'none' : 'auto';
      }
      if (vibrantNext) {
        vibrantNext.style.opacity = currentScroll >= maxScroll - 12 ? '0.3' : '1';
        vibrantNext.style.pointerEvents = currentScroll >= maxScroll - 12 ? 'none' : 'auto';
      }

      if (vibrantDots.length > 0) {
        const activeIdx = Math.min(vibrantDots.length - 1, Math.max(0, Math.round(currentScroll / step)));
        vibrantDots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIdx);
        });
      }
    };

    if (vibrantPrev) {
      vibrantPrev.addEventListener('click', (e) => {
        e.preventDefault();
        vibrantGrid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      });
    }

    if (vibrantNext) {
      vibrantNext.addEventListener('click', (e) => {
        e.preventDefault();
        vibrantGrid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      });
    }

    if (vibrantHint) {
      vibrantHint.addEventListener('click', (e) => {
        e.preventDefault();
        const maxScroll = vibrantGrid.scrollWidth - vibrantGrid.clientWidth;
        if (vibrantGrid.scrollLeft >= maxScroll - 20) {
          vibrantGrid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          vibrantGrid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        }
      });
    }

    vibrantDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const cards = vibrantGrid.querySelectorAll('.vibrant-card');
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      });
    });

    vibrantGrid.addEventListener('scroll', updateArrowsAndDots, { passive: true });
    // Initial check after DOM settles
    setTimeout(updateArrowsAndDots, 150);
  }

});

