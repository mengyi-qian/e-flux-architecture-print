/*
  <PROJECT>
  Copyright (C) 2020 by Systemantics, Bureau for Informatics

  Systemantics GmbH
  Hausbroicher Str. 218
  47877 Willich
  GERMANY

  Web:    www.systemantics.net
  Email:  hello@systemantics.net

  Permission granted to use the files associated with this
  website only on your webserver.

  Changes to these files are PROHIBITED due to license restrictions.
*/

// Detect touch device

const fadeDuration = 200

let overlayerLoaded = false

const isTouch = 'ontouchstart' in document
const noTouch = !isTouch

function isMobile () {
  if (!$('#bp').length) {
    $('<div id="bp"/>').appendTo('body')
  }

  return $('#bp').width() == 1
}

function carouselArticlePreInit () {
  $('.js-carousel').each(function () {
    const carousel = $(this)
    const container = carousel.closest('.block-media')
    const placeholder = container.find('.block-carousel-placeholder')
    const carouselArrows = container.find('.block-carousel-arrows')
    const containerHeight = $(window).height() - 300

    if (isMobile()) {
      let maxRatio = 1
      const maxWidth = placeholder.width()
      const space = parseInt(placeholder.css('padding-right'))

      // get largest image ratio
      carousel.find('.article-carousel__cell').each(function () {
        const el = $(this)

        if (maxRatio < el.data('ratio')) {
          maxRatio = el.data('ratio')
        }
      })

      const newHeight = maxWidth * 1 / maxRatio

      carousel.find('.block-carousel-cell').each(function () {
        const el = $(this)
        const elImage = el.find('.block-carousel-cell-image')

        el.css({
          'margin-right': space,
          width: maxWidth
        })

        elImage.css({
          height: newHeight,
          width: newHeight * el.data('ratio')
        })
      })

      carousel.css({
        left: placeholder.offset().left
      })
    } else {
      const maxHeight = Math.max(450, $(window).height() - 276)
      const maxWidth = placeholder.width(); const // $(window).width() - 384,
        maxRatio = maxWidth / maxHeight
      const space = parseInt(placeholder.css('padding-right'))

      carousel.css({
        left: placeholder.offset().left
      })

      heighestImage = 0
      carousel.find('.block-carousel-cell').each(function () {
        const el = $(this)
        const elImage = el.find('.block-carousel-image')

        if (el.data('ratio') < maxRatio) {
          // fit height
          elWidth = maxHeight * el.data('ratio')
          eheight = maxHeight
        } else {
          // fit width
          elWidth = maxWidth// * 1 / el.data('ratio');
          eheight = maxWidth * 1 / el.data('ratio')
        }

        if (heighestImage < eheight) {
          heighestImage = eheight
        }

        el.css({
          width: elWidth,
          'margin-right': space
        })

        elImage.css({
          height: '',
          width: ''
        })
      })

      carouselArrows.css('top', 'calc(' + heighestImage + 'px + .7rem)')
    }

    if (!carousel.hasClass('flickity-enabled')) {
      setTimeout(function () {
        carouselArticleInit(carousel)
      }, 150)
    };
  })
}

function carouselArticleInit (carousel) {
  carousel.flickity({
    setGallerySize: true,
    pageDots: false,
    prevNextButtons: false,
    cellAlign: 'left',
    wrapAround: false,
    draggable: !!isMobile(),
    on: {
      change: function () {
        const flkty = $(this)[0]
        const container = $(flkty.element).closest('.block-media')

        if (flkty.selectedIndex != 0) {
          container.find('.block-carousel-arrow--prev').removeClass('block-carousel-arrow--hidden')
        } else {
          container.find('.block-carousel-arrow--prev').addClass('block-carousel-arrow--hidden')
        }

        if (flkty.selectedIndex < flkty.cells.length - 1) {
          container.find('.block-carousel-arrow--next').removeClass('block-carousel-arrow--hidden')
        } else {
          container.find('.block-carousel-arrow--next').addClass('block-carousel-arrow--hidden')
        }

        const mobileCaption = container.find('.block-carousel-caption-mobile')
        const currentCaption = $(flkty.selectedElement).find('.block-carousel-caption')

        if (currentCaption.length) {
          mobileCaption.addClass('block-carousel-caption-mobile--visible')
          mobileCaption.html(currentCaption.html())
        } else {
          mobileCaption.removeClass('block-carousel-caption-mobile--visible')
          mobileCaption.html('')
        }
      }
    }
  })
}

function carouselHomepageJournal () {
  const carousels = $('.js-homepage-carousel')

  if (carousels.length) {
    carousels.each(function () {
      const carousel = $(this)
      let autoHeight = true
      let dots = false

      if (carousel.hasClass('homepage-carousel--announcements')) {
        autoHeight = false
        dots = true

        carousel.find('.homepage-carousel__cell').css('width', carousel.width())
      } else {
        carousel.find('.homepage-carousel__cell').css('width', $(window).width())
      }

      if (!carousel.hasClass('flickity-enabled')) {
        carousel.flickity({
          adaptiveHeight: autoHeight,
          setGallerySize: true,
          pageDots: dots,
          prevNextButtons: false,
          cellAlign: 'left',
          wrapAround: false,
          draggable: !!isMobile(),
          on: {
            change: function () {
              const flkty = $(this)[0]
              const container = $(flkty.element).closest('.homepage-section')
              const arrows = container.find('.homepage-arrows')

              if (flkty.selectedIndex == 0) {
                arrows.removeClass('homepage-arrows--arrow-left-show')
              } else {
                arrows.addClass('homepage-arrows--arrow-left-show')
              }

              if (flkty.selectedIndex == flkty.slides.length - 1) {
                arrows.removeClass('homepage-arrows--arrow-right-show')
              } else {
                arrows.addClass('homepage-arrows--arrow-right-show')
              }
            }
          }
        })
      }
    })
  }
}

function fitFeaturedCarouselImages (carousel) {
  carousel.find('.featured-projects__cell--fit').each(function () {
    const cell = $(this)
    const image = cell.find('.js-fit-featured-carousel-image')

    cell.find('.featured-projects__gradient').width(image.find('img').height() * image.data('ratio'))
  })
  // carousel.find('.featured-projects__cell').each(function () {
  //   const cell = $(this)

  //   if (cell.hasClass('featured-projects__cell--fit')) {
  //     const area = cell.find('.featured-projects__cell-area')
  //     const image = cell.find('.js-fit-featured-carousel-image')
  //     const content = cell.find('.featured-projects__cell-content')

  //     const areaHeight = content.offset().top - area.position().top - cell.offset().top
  //     const areaWidth = area.width()

  //     const minRatio = Math.min(1, areaWidth / image.data('width'), areaHeight / image.data('height'))

  //     area.css('height', areaHeight)
  //     image.css({
  //       height: Math.floor(minRatio * image.data('height')),
  //       width: Math.floor(minRatio * image.data('width'))
  //     })
  //   }
  // })
}

function projectsCarouselInit () {
  $('.js-carousel-projects').each(function () {
    const carousel = $(this)
    const slides = carousel.find('.featured-projects__cell')
    let showDots = false

    if (slides.length > 1) {
      showDots = true
    } else {
      carousel.addClass('featured-projects__carousel--single')
    }

    carousel.flickity({
      setGallerySize: false,
      pageDots: showDots,
      prevNextButtons: false,
      cellAlign: 'center',
      wrapAround: false,
      fade: true,
      on: {
        ready: function () {
          flkty = $(this)[0]

          $(flkty.element).addClass('featured-projects__carousel--ready')

          fitFeaturedCarouselImages(carousel)
        }
      }
    })
  })

  $('.js-carousel-videos').each(function () {
    const carousel = $(this)

    carousel.flickity({
      setGallerySize: isMobile(),
      pageDots: carousel.find('.video-featured__item').length,
      prevNextButtons: false,
      cellAlign: 'center',
      wrapAround: false,
      fade: true,
      on: {
        ready: function () {
          const flkty = $(this)[0]
          const currentCell = $(flkty.selectedElement)

          videoSlideColor(currentCell)
        },
        change: function () {
          const flkty = $(this)[0]
          const currentCell = $(flkty.selectedElement)

          videoSlideColor(currentCell)
        }
      }
    })
  })
}
projectsCarouselInit()

function videoSlideColor (currentCell) {
  currentCell.closest('.homepage-section--video').removeClass('homepage-section--video-white homepage-section--video-black')

  if (currentCell.hasClass('video-featured__item--white')) {
    currentCell.closest('.homepage-section--video').addClass('homepage-section--video-white')
  } else if (currentCell.hasClass('video-featured__item--black')) {
    currentCell.closest('.homepage-section--video').addClass('homepage-section--video-black')
  }
}

function initMap () {
  if ($('#anchor_map').length) {
    const activeIcon = {
      url: '/elements/EFL03_red-pin.svg'
    }

    const normalIcon = {
      url: '/elements/EFL03_black-pin.svg'
    }

    $('#anchor_map').each(function () {
      const el = $(this)

      // infoWindows = [];
      const markers = []

      const myLatlng = new google.maps.LatLng(28.4387675, 77.5243212)
      const mapOptions = {
        title: 'map',
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        draggable: true,
        fullscreenControl: false,
        clickableIcons: false,
        panControl: true,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.LEFT_CENTER
        },

        gestureHandling: 'greedy'
      }

      const map = new google.maps.Map(document.getElementById('anchor_map'), mapOptions)
      const getMarkers = $('#anchor_map').data('markers')
      var bounds = []
      var bounds = new google.maps.LatLngBounds()

      $.each(getMarkers, function (i, item) {
        const latlng = new google.maps.LatLng(item[1], item[2])

        bounds.extend(latlng)

        const marker = new google.maps.Marker({
          position: latlng,
          map: map,
          title: item[0],
          icon: '/elements/EFL03_black-pin.svg'
        })

        marker.addListener('click', function (e) {
          const pupup = $('.popup[data-id="' + $(this)[0].title + '"]')

          for (let j = 0; j < markers.length; j++) {
            markers[j].setIcon(normalIcon)
          }

          if (pupup.hasClass('popup--active')) {
            pupup.removeClass('popup--active')
          } else {
            const activePopup = $('.popup.popup--active')

            if (activePopup.length) {
              if (activePopup.hasClass('popup--grouped')) {
                activePopup.addClass('popup--active-grouped-close')

                setTimeout(function () {
                  activePopup.removeClass('popup--active popup--grouped popup--active-grouped-close')
                }, 200)
              } else {
                activePopup.removeClass('popup--active')
              }
            }

            $('.clustermarker--selected').css('background', '#000').removeClass('clustermarker--selected')

            pupup.addClass('popup--active')
            this.setIcon(activeIcon)
          }
        })

        markers.push(marker)
      })

      const markerCluster = new MarkerClusterer(map, markers, {
        styles: [{
          textColor: 'white',
          textSize: 15,
          height: 40,
          width: 40
        }]
      })

      map.fitBounds(bounds)

      // set new Zoom after bounds markers
      var listener = google.maps.event.addListener(map, 'idle', function () {
        if (map.getZoom() > 16) map.setZoom(16)
        google.maps.event.removeListener(listener)
      })

      $('.js-popup-close').on('click', function () {
        const popup = $(this).closest('.popup')

        $(this).closest('.popups').find('.popup--grouped').not(popup).removeClass('popup--grouped')

        if (popup.hasClass('popup--grouped')) {
          popup.addClass('popup--active-grouped-close')
        }

        $('.clustermarker--selected').css('background', '#000').removeClass('clustermarker--selected')

        setTimeout(function () {
          if (popup.hasClass('popup--grouped')) {
            setTimeout(function () {
              popup.removeClass('popup--active popup--grouped popup--active-grouped-close')
            }, 200)

            $('.popups').removeClass('popups--is-grouped')
          } else {
            popup.removeClass('popup--active')
          }

          for (let j = 0; j < markers.length; j++) {
            markers[j].setIcon(normalIcon)
          }
        })
      })
    })
  }

  const newMap = $('.js-map')
  if (newMap.length) {

    newMap.each(function(){
        let thisMap = $(this)

        setMapHeight()

        mapboxgl.accessToken = 'pk.eyJ1IjoiZWZsdXgiLCJhIjoiY2tvdWtlYmRrMG0yZDJwbGduc29xYnhmYSJ9._VbyfiocV_cdHHlcMri-Dg'

        marker = thisMap.data('markers')

        const map = new mapboxgl.Map({
          container: thisMap.get(0),
          style: 'mapbox://styles/eflux/ckpx4an1j53vv17n3t5ck4ljz',
          zoom: 15,
          center: [marker[0].lng, marker[0].lat]
        })
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }))
        map.scrollZoom.disable()
        map.dragRotate.disable()
        map.doubleClickZoom.disable()
        map.touchZoomRotate.disableRotation()

        const el = document.createElement('div')
        el.className = 'marker'
        el.style.backgroundImage = 'url("/elements/EFL03_red-pin.svg")'
        el.style.width = '24px'
        el.style.height = '38px'
        el.style.backgroundSize = '100%'

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        })

        el.addEventListener('mouseenter', function (e) {
          $(this)[0].style.backgroundImage = 'url("/elements/EFL03_black-pin.svg")'
        })

        el.addEventListener('mouseleave', function () {
          $(this)[0].style.backgroundImage = 'url("/elements/EFL03_red-pin.svg")'
        })

        let tooltipContent = '<div class="map-tooltip"><div class="map-tooltip__left"><div class="map-tooltip__left-address">' + newMap.data('address') + '</div></div>'

        if (thisMap.data('image')) {
          tooltipContent = tooltipContent + '<div class="map-tooltip__right"><img src="' + thisMap.data('image') + '"></div>'
        }

        tooltipContent = tooltipContent + '</div>'

        new mapboxgl
          .Marker(el)
          .setLngLat(marker[0])
          .setPopup(new mapboxgl.Popup({
            offset: 25,
            closeButton: false
          })
            .setHTML(tooltipContent)
          )
          .addTo(map)


    });
  }
}

function relatedStyle () {
  $('.js-related__items-height').each(function () {
    const related = $(this)

    related.each(function () {
      const related = $(this)
      const container = related.closest('.related__inner')
      const placeholderLandscape = container.find('.related__placeholder-item-landscape')
      const placeholderSquare = container.find('.related__placeholder-item-square')
      const placeholderPortrait = container.find('.related__placeholder-item-portrait')
      const placeholderGutter = container.find('.related__placeholder-item-gutter')
      const items = related.find('.related__item')

      if (!isMobile()) {
        if (items.length <= 4 && related.find('.related__item--portrait').length <= 4) {
          items.each(function (i, s) {
            if (i != 0) {
              $(s).css('padding-left', placeholderGutter.width())
            }
          })
        }
      }

      items.each(function () {
        const el = $(this)

        if (el.hasClass('related__item--landscape')) {
          el.css('width', placeholderLandscape.width())
        } else if (el.hasClass('related__item--square')) {
          el.css('width', placeholderSquare.width())
        } else {
          el.css('width', placeholderPortrait.width())
        }
      })

      // const wWidth = $(window).width()
      // const lastCellSpace = wWidth - ((placeholder.width() * 4) + (30 * 4))

      lastCellSpace = parseInt(container.css('margin-left'))

      related.find('.related__item').last().css('padding-right', Math.floor(lastCellSpace))

      // set related container height
      const cellHeight = related.find('.related__item').eq(0)
      related.css('height', cellHeight.height())
    })
  })
}

function videoCarouselStyle () {
  $('.js-video-carousel__items-height').each(function () {
    const carousel = $(this)

    carousel.each(function () {
      const carousel = $(this)
      const container = carousel.closest('.video-carousel__inner')
      const placeholder = container.find('.video-carousel__placeholder')

      carousel.find('.video-carousel__slider').children().css({
        width: placeholder.width()
      })

      const wWidth = $(window).width()
      const lastCellSpace = wWidth - ((placeholder.width() * 4) + (30 * 4))

      carousel.find('.video-carousel__slider').children().last().css('padding-right', Math.floor(lastCellSpace))

      // set carousel container height
      const cellHeight = carousel.find('.video-carousel__slider').children().eq(0)
      carousel.css('height', cellHeight.outerHeight())

      if (isMobile()) {
        carousel.find('.video-carousel__slider').addClass('video-carousel__slider--snap-active')
      } else {
        carousel.find('.video-carousel__slider').removeClass('video-carousel__slider--snap-active')
      }
    })
  })
}

let fadeoutTimer
const copyToClipboard = function (str) {
  const el = document.createElement('textarea') // Create a <textarea> element
  el.value = str // Set its value to the string that you want copied
  el.setAttribute('readonly', '') // Make it readonly to be tamper-proof
  el.style.position = 'absolute'
  el.style.left = '-9999px' // Move outside the screen to make it invisible
  document.body.appendChild(el) // Append the <textarea> element to the HTML document

  const selected =
  document.getSelection().rangeCount > 0 // Check if there is any content selected previously
    ? document.getSelection().getRangeAt(0) // Store selection if found
    : false // Mark as false to know no selection existed before
  el.select() // Select the <textarea> content
  document.execCommand('copy') // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el) // Remove the <textarea> element

  if (selected) { // If a selection existed before copying
    document.getSelection().removeAllRanges() // Unselect everything on the HTML document
    document.getSelection().addRange(selected) // Restore the original selection
  }

  $('#js-clipboard').addClass('clipboard-button-show')

  fadeoutTimer = setTimeout(function () {
    $('#js-clipboard').removeClass('clipboard-button-show')
  }, 2000)
}

function updateSearchResults () {
  const query = []
  const keywords = $('#search-form-input')

  if (keywords.length) {
    if (keywords.val().length) {
      query.push('q=' + encodeURIComponent(keywords.val()))
    }
  }

  $('.filter-category').each(function () {
    const container = $(this)
    const name = false

    container.find('.filter-item-clickable--selected.js-filter-item').each(function () {
      query.push($(this).data('name') + '[]=' + encodeURIComponent($(this).data('filter')))
    })
  })

  if ($('[name="sort"]').length) {
    query.push('order=' + $('[name="sort"]:checked').val())
  }

  location.href = '?' + query.join('&')
}

function showSelectedFilters (filterlist) {
  const container = filterlist.closest('.filter-category')
  const selectedFilters = container.find('.filter-category__selected')

  container.find('.js-filter-item.filter-item-clickable--selected').each(function () {
    const item = $(this)

    $('<span class="filter-category__selected-item" data-id="' + item.data('id') + '">' + item.find('.filter-item__title').text() + '</span>').appendTo(selectedFilters)

    selectedFilters.addClass('filter-category__selected--visible')
  })
}

function getScrollbarWidth () {
  // Creating invisible container
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer)

  return scrollbarWidth
}

function closemenu () {
  $('.menu')
    .removeClass('menu--open')
    .fadeOut(fadeDuration)

  $('.header--short').removeClass('header--menu-open')
}

function resetMain () {
  const main = $('.main')

  main.removeClass('main--lock fx-scrollbar')
  $(window).scrollTop(main.data('scrollPosition'))

  document.title = $('.main').data('pageTitle')

  window.history.pushState(null, null, main.data('pageUrl'))

  // Track pageview
  if ($.isFunction(ga)) {
    ga('send', 'pageview', main.data('pageUrl'))
  }
}

function relatedGradient () {
  $('.related__carousel').each(function () {
    const relatedCarosuel = $(this)

    relatedCarosuel.each(function () {
      const scroller = $(this)
      const container = scroller.closest('.related__inner')
      const block = scroller.closest('.related__items')
      const scrollerWidth = scroller[0].scrollWidth

      if (scrollerWidth > $(window).width()) {
        block.addClass('related__items--right-gradient')
        container.addClass('related__inner--arrow-right-show')
      } else {
        block.removeClass('related__items--right-gradient')
        container.removeClass('related__inner--arrow-right-show')
      }

      $('.related__carousel').on('scroll', function () {
        const scrollPosition = scroller.scrollLeft()

        if (scrollPosition <= 0) {
          block.removeClass('related__items--left-gradient')
          container.removeClass('related__inner--arrow-left-show')
        } else {
          block.addClass('related__items--left-gradient')
          container.addClass('related__inner--arrow-left-show')
        }

        if (scrollPosition >= scrollerWidth - scroller.width()) {
          block.removeClass('related__items--right-gradient')
          container.removeClass('related__inner--arrow-right-show')
        } else {
          block.addClass('related__items--right-gradient')
          container.addClass('related__inner--arrow-right-show')
        }
      })
    })
  })
}

function videoCarouselGradient () {
  $('.video-carousel__slider').each(function () {
    const carousel = $(this)

    carousel.each(function () {
      const scroller = $(this)
      const container = scroller.closest('.video-carousel__inner')
      const block = scroller.closest('.video-carousel__items')
      const scrollerWidth = scroller[0].scrollWidth

      if (scrollerWidth > $(window).width()) {
        block.addClass('video-carousel__items--right-gradient')
        container.addClass('video-carousel__items--arrow-right-show')
      } else {
        block.removeClass('video-carousel__items--right-gradient')
        container.removeClass('video-carousel__items--arrow-right-show')
      }

      $('.video-carousel__slider').on('scroll', function () {
        const scrollPosition = scroller.scrollLeft()

        if (scrollPosition <= 0) {
          block.removeClass('video-carousel__items--left-gradient')
          container.removeClass('video-carousel__items--arrow-left-show')
        } else {
          block.addClass('video-carousel__items--left-gradient')
          container.addClass('video-carousel__items--arrow-left-show')
        }

        if (scrollPosition >= scrollerWidth - scroller.width()) {
          block.removeClass('video-carousel__items--right-gradient')
          container.removeClass('video-carousel__items--arrow-right-show')
        } else {
          block.addClass('video-carousel__items--right-gradient')
          container.addClass('video-carousel__items--arrow-right-show')
        }
      })
    })
  })
}

function isEmail (email) {
  const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
  return regex.test(email)
}

function initFunctions () {
  carouselArticlePreInit()
  initMap()
  hideSidebar()
  hideAd()
  sidebarHeightMobile()
  initTypeahead()
  appLayerSizes()

  if ($('.js-app-animation').length && isMobile()) {
    $('.js-app-animation').find('.page-app__section').each(function () {
      const video = $(this).find('video')

      video.find('source').attr('src', video.find('source').data('src'))
      video[0].load()
    })
  }

  $('.js-related-items').each(function () {
    const related = $(this)
    const url = related.data('url')

    if (url) {
      fetch(url)
        .then(resp => resp.text())
        .then(html => {
          if (html.length == 0) {
            // Keep disabled
            return
          }

          const content = $('<div/>').append(html)
          const relatedItems = $(content).find('.related__items')
          relatedTitle = $(content).find('.related__top-title')

          if (relatedItems.length) {
            related.addClass('related--visible')

            $('.related__inner', related).replaceWith($('.related__inner', content))
            $('.js-sidebar-related').addClass('sidebar__bottom-related--visible')

            relatedStyle()
            relatedGradient()
            sidebarHeightMobile()
            siebarScrollArea()
          }
        })
    }
  })

  relatedStyle()
  videoCarouselStyle()
  relatedGradient()
  videoCarouselGradient()
  siebarScrollArea()
  journalImageHeight()
  sideAd()

  $('.js-player-audio').cbplayer({
    tpf: false,
    overlaySpinner: false,
    overlayButton: false
  })

  // $('.js-player-audio').cbplayer('initSource');

  $('.js-lightbox').cblightbox({
    margin: [0, 150],
    captionPosition: 'inside',
    counter: false,
    closeOutsideClick: false,
    zoom: true,
    zoomSize: 10,
    zoomControlls: true,
    zoomSteps: 5
  })

  $('.js-videoheaderplayer').cbplayer({
    tpl: false,
    autoplay: false,
    overlaySpinner: false,
    overlayButton: false,
    disableClick: true
  })

  $('.js-overlayer-form').ajaxForm({
    success: function (response, status, xhr, form) {
      if (response.ok) {
        if (form.hasClass('js-close-after-submit')) {
          closeOverlayerForm(form.closest('.overlayer-form'))
        } else {
          form.addClass('el-hidden')

          if (form.closest('.overlayer-form--inline').length) {
            form.closest('.overlayer-form--inline').find('.overlayer-form__successful').removeClass('el-hidden')
          } else {
            form.closest('.overlayer-form__content').find('.overlayer-form__successful').removeClass('el-hidden')
          }
        }
      } else {
        if (response.missing) {
          const prefix = form.data('type')

          $.each(response.missing, function (i, fieldName) {
            $('[name="' + prefix + '_' + fieldName + '"]').closest('.form__wrap-input, .form__wrap-checkbox, .form__wrap-textarea').addClass('form__wrap--error')
          })
        }
      }
    }
  })

  $('.js-overlayer-subscribeform').ajaxForm({
    beforeSubmit: function (formData, form, options) {
      let error = false

      const email = form.find('input[name="email"]')
      if (email.val()) {
        if (!isEmail(email.val())) {
          email.closest('.form__wrap-input').addClass('form__wrap--error')
          error = true
        }
      } else {
        email.closest('.form__wrap-input').addClass('form__wrap--error')
        error = true
      }

      const privacy = form.find('input[name="privacy"]')
      if (!privacy.is(':checked')) {
        privacy.closest('.form__wrap-checkbox ').addClass('form__wrap--error')
        error = true
      }

      if (error) {
        return false
      }

      form.find('.button--submit').prop('disabled', true)
    },
    success: function (response, status, xhr, form) {
      if (response.ok) {
        const secondform = form.parent().find('.overlayer-form__successful .overlayer-form__form')

        secondform.find('input[name="email"]').val(form.find('input[name="email"]').val())
        secondform.find('input[name="firstname"]').val(form.find('input[name="firstname"]').val())
        secondform.find('input[name="lastname"]').val(form.find('input[name="lastname"]').val())

        form.addClass('el-hidden')
        form.closest('.overlayer-form__content').find('.overlayer-form__successful').removeClass('el-hidden')
      } else {
        if (response.missing) {
          $.each(response.missing, function (i, fieldName) {
            $('[name="' + fieldName + '"]').closest('.form__wrap-input, .form__wrap-checkbox').addClass('form__wrap--error')
          })
        }

        form.find('.button--submit').prop('disabled', false)
      }
    }
  })

  buyButtonTooltip()
  overlayerBgPosition()
  adArticleHeight()

  const articleBody = $('.article__body--with-ad')
  if (articleBody.length) {
    if (!articleBody.find('.js-article-ad').length) {
      const tags = articleBody.children()
      const selectedTag = tags.eq(5)
      const ad = $('.js-article-ad')

      ad.clone().removeClass('article-ad--hidden').insertAfter(selectedTag)
    } else {
      articleBody.find('.js-article-ad').removeClass('article-ad--hidden')
    }
  }

  // check for chrome - clip-path + fixed bug
  const articleAd = $('.js-article-ad:not(.article-ad--landing)')
  if (articleAd.length) {
    if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
      articleAd.addClass('article-ad--chrome')
    }
  }

  adFitItem()

  $('.js-ad-video').cbplayer({
    tpl: false,
    autoplay: true,
    muted: true,
    loop: true,
    backgroundMode: true,
    mediaIsPlay: function (container) {
      const videoRatio = container.data('videowidth') / container.data('videoheight')
      container.closest('.article-ad__item').data('ratio', videoRatio)

      adFitItem()
    }
  })
}

function adArticleHeight () {
  const ad = $('.js-article-ad')

  if (ad.length) {
    ad.each(function () {
      const ad = $(this)

      if (ad.hasClass('article-ad--landing')) {
        let height = $(window).height() * 0.5
        if (isMobile()) {
          height = $(window).height() * 0.35
        }

        ad.css('height', height)
        ad.find('.article-ad__inner').css('height', height)
      } else {
        ad.css('height', $(window).height())
      }
    })

    adFitItem()
  }
}

function adFitItem () {
  const items = $('.js-ad-fit-item')

  if (items.length) {
    items.each(function () {
      const item = $(this)
      const container = item.closest('.article-ad__area')
      const containerRatio = container.width() / container.height()
      let newWidth, newHeight

      if (containerRatio < item.data('ratio')) {
        newWidth = container.width()
        newHeight = 1 / item.data('ratio') * newWidth
      } else {
        newHeight = container.height()
        newWidth = newHeight * item.data('ratio')
      }

      item.css({
        height: newHeight,
        width: newWidth
      })
    })
  }
}

function buyButtonTooltip () {
  const buyTooltip = $('.js-dropdown-button--auto')
  if (buyTooltip.length) {
    buyTooltip.each(function () {
      const tooltip = $(this)
      const button = tooltip.find('.button')

      tooltip.removeClass('dropdown-button--open-left-top dropdown-button--open-right-top')

      if (button.offset().left + 200 > $(window).width()) {
        tooltip.addClass('dropdown-button--open-left-top')
      } else {
        tooltip.addClass('dropdown-button--open-right-top')
      }
    })
  }
}

function contentTopBorder () {
  const border = $('.js-conent-top-border')

  if (border.length) {
    const container = border.parent()

    border.css({
      left: container.offset().left,
      width: container.width()
    })
  }
}

function hideSidebar () {
  const wScrolltop = $(window).scrollTop()
  const wScrollbottom = wScrolltop + $(window).height()
  let currentContent = $('.main')

  if ($('.overlayer').length) {
    currentContent = $('.overlayer')
  }

  const wideElements = currentContent.find('.js-hide-sidebar')
  const sidebar = currentContent.find('.sidebar')

  if (!isMobile() && wideElements.length && sidebar.length) {
    let isvisible = false
    wideElements.each(function () {
      const el = $(this)
      const elTop = el.offset().top
      const elBottom = elTop + el.height()

      if (wScrollbottom > elTop && wScrolltop < elBottom) {
        isvisible = true
        return false
      }
    })

    if (isvisible) {
      if (!sidebar.hasClass('sidebar--hidden')) {
        sidebar.addClass('sidebar--hidden')
      }
    } else if (sidebar.hasClass('sidebar--hidden')) {
      sidebar.removeClass('sidebar--hidden')
    }
  } else {
    sidebar.removeClass('sidebar--hidden')
  }
}

function hideAd () {
  const wScrolltop = $(window).scrollTop()
  const wScrollbottom = wScrolltop + $(window).height()
  let currentContent = $('.main')

  if ($('.overlayer').length) {
    currentContent = $('.overlayer')
  }

  const wideElements = currentContent.find('.js-hide-side-ad')
  const ad = currentContent.find('.side-ad__item')

  if (!isMobile() && wideElements.length && ad.length) {
    const adTop = ad.position().top
    const adBottom = adTop + ad.height()
    let isTouching = false
    wideElements.each(function () {
      const el = $(this)
      const elTop = el.offset().top - wScrolltop
      const elBottom = elTop + el.height()

      if (adBottom + 50 > elTop && adTop - 50 < elBottom) {
        isTouching = true
        return false
      }
    })

    if (isTouching) {
      if (!ad.hasClass('side-ad__item--hidden')) {
        ad.addClass('side-ad__item--hidden')
      }
    } else if (ad.hasClass('side-ad__item--hidden')) {
      ad.removeClass('side-ad__item--hidden')
    }
  } else {
    ad.removeClass('side-ad__item--hidden')
  }
}

function hideHeader () {
  // if (isMobile()) {
  //  return;
  // }

  // const els = $('.js-hide-header');

  // if (els.length == 0) {
  //  return;
  // }

  // const wScrolltop = $(window).scrollTop(),
  //       wScrollbottom = wScrolltop + $(window).height();
  // let isInViewport = false;
  // els.each(function(){
  //  const el = $(this),
  //        elTop = el.offset().top,
  //        elBottom = elTop + el.height();

  //  if (wScrollbottom > elTop && wScrolltop < elBottom){
  //    isInViewport = true;
  //    return false;
  //  }
  // });
  // if (isInViewport) {
  //  $('.header--fixed').addClass('header--hidden');
  // } else {
  //  $('.header--fixed').removeClass('header--hidden');
  // }
}

function sidebarHeightMobile () {
  const sidebar = $('.sidebar')

  if (sidebar.length && isMobile() && $('.js-sidebar-scroll-area').length) {
    const area = $('.js-sidebar-scroll-area').find('.sidebar__top-scroll')
    const areaScrollHeight = area[0].scrollHeight + parseInt(area.css('padding-top')) + parseInt(area.css('padding-bottom'))
    const screenHeight = window.innerHeight ? window.innerHeight : $(window).height()
    const scrollheight = screenHeight - sidebar.find('.sidebar__toggle').height() - sidebar.find('.sidebar__bottom').outerHeight()

    if (scrollheight > areaScrollHeight) {
      sidebar.find('.sidebar__top-scroll').css('max-height', scrollheight)
    } else {
      sidebar.find('.sidebar__top-scroll').css('max-height', '')
    }
  }
}

function hideTopHeader () {
  const wScrolltop = $(window).scrollTop()
  const el = $('.js-header-hide-on-top')

  if (wScrolltop < 0) {
    el.hide()
  } else {
    el.show()
  }
}

function siebarScrollArea () {
  const sidebarArea = $('.js-sidebar-scroll-area')

  if (sidebarArea.length) {
    const sidebar = sidebarArea.closest('.sidebar')
    const sidebarBottom = $('.sidebar__bottom')
    let sidebarHeight = sidebar.height() - $('.header').height() - sidebarBottom.height() - parseInt(sidebarBottom.css('bottom')) - 10

    if (isMobile()) {
      sidebarArea.css('height', '')

      sidebarHeight = sidebar - $('.header').height() - sidebarBottom.outerHeight()

      const area = $('.js-sidebar-scroll-area').find('.sidebar__top-scroll')
      const areaScrollHeight = area[0].scrollHeight + parseInt(area.css('padding-top')) + parseInt(area.css('padding-bottom'))

      if (sidebarHeight > areaScrollHeight) {
        sidebarArea.css('height', '')
      } else {
        sidebarArea.css('height', sidebarHeight)
      }
    } else {
      sidebarArea.css('height', sidebarHeight)
    }
  }
}

function journalImageHeight () {
  // const image = $('.article__header-media-image')

  // if (image.length && isMobile()) {
  //   const header = $('.article__header-top')

  //   image.css('height', header.outerHeight())
  // } else if (image.length && !isMobile()) {
  //   image.css('height', '')
  // }
}

function scaleIssueTop () {
  const el = $('.js-issue-scale')

  if (el.length) {
    el.each(function () {
      const container = $(this)
      const wrapper = container.find('.current-issue__number-wrap')
      let largestWrapperWidth = 0
      let largestWrapper
      const startFontSize = 200

      container.removeClass('current-issue__number--ready')

      wrapper.each(function () {
        const thisWrapper = $(this)

        if (largestWrapperWidth < thisWrapper.width()) {
          largestWrapperWidth = thisWrapper.width()
          largestWrapper = thisWrapper
        }
      })

      for (let i = startFontSize; i >= 0; i--) {
        container.css('font-size', i)

        if (largestWrapper.width() <= largestWrapper.parent().width()) {
          container.addClass('current-issue__number--ready')
          return true
        }
      }
    })
  }
}
scaleIssueTop()

function setMapHeight () {
  const maps = $('.js-map')
  if (maps.length) {
    maps.each(function () {
      const map = $(this)
      const container = map.closest('.announcement__map-content')
      const block = map.closest('.announcement__map')

      if (isMobile()) {
        mapHeight = container.width() * 0.5625
        map.css('height', mapHeight)
      } else {
        map.css('height', '')
      }

      if (block.hasClass('announcement__map--open')) {
        container.css('height', mapHeight)
      }
    })
  }
}

function overlayerBgPosition () {
  const topBg = $('.js-overlayer__bgimage-top')

  if (topBg.length) {
    const imageWidth = topBg.data('width')
    const imageHeight = topBg.data('height')
    const imageRatio = imageWidth / imageHeight
    const windowHeight = $(window).height()
    const windowWidth = $(window).width()

    if (imageRatio < windowWidth / windowHeight) {
      let topPosition = windowWidth * (1 / imageRatio)
      topPosition = (topPosition - windowHeight) / 2
      topPosition = -1 * topPosition

      topBg.css({
        'background-position': 'center ' + topPosition + 'px',
        'background-size': 'cover'
      })
    } else {
      const size = windowHeight * imageRatio

      topBg.css({
        'background-position': 'center 0px',
        'background-size': size
      })
    }
  }
}
overlayerBgPosition()

function initTypeahead () {
  $('.js-overlayer-search__input').each(function () {
    const thisInput = $(this)

    // constructs the suggestion engine
    const suggestions = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      limit: 5,
      remote: {
        url: '../v2/api/searchsuggestions?q=%QUERY',
        wildcard: '%QUERY'
      }
    })

    // kicks off the loading/processing of `local` and `prefetch`
    suggestions.initialize()

    thisInput.typeahead({
      hint: false,
      highlight: true,
      minLength: 1
    },
    {
      name: 'suggestions',
      display: 'title',
      source: suggestions.ttAdapter(),
      limit: 4,
      templates: {
        suggestion: Handlebars.compile('<div>{{title}}</div>')
        // suggestion: function (tag) {
        //  return tag.title.replace(tag._query, '<span class="tt-hightlight">' + tag._query + '</span>') + ' <div class="type">' + tag.type + '</div>';
        // }
      }
    })
  })

  $(document).on('typeahead:selected', function (e, value, name) {
    // on select trigger submit
    // typeaheadSubmit(value.value);
    const input = $(e.target)

    input.typeahead('close')
  })
}

function appLayerSizes () {
  const layer = $('.page-app__layer')
  const phone = $('.page-app__phone')
  const sections = $('.page-app__section')

  if (layer.length) {
    const screenHeight = $(window).height() - 128
    const screenWidth = screenHeight * 0.561058

    layer.css('width', screenWidth / 1.2492)

    phone.css('width', screenWidth)

    const columnWidth = ($(window).width() / 2) - (screenWidth / 2)

    sections.find('.page-app__section-column').css('width', columnWidth)
  }
}

function appAnimation () {
  const windowY = $(window).scrollTop()
  const windowBottom = windowY + $(window).height()
  const layercontainer = $('.page-app__layer')
  const el = $('.js-app-animation')

  if (!isMobile() && el.length) {
    if (el.length) {
      // 22 = pin position - .page-app__sections padding-top
      if (el.offset().top - 22 + el.outerHeight() < windowBottom) {
        el.addClass('page-app__sections--uppin-phone')
      } else if (el.offset().top < windowY) {
        el.removeClass('page-app__sections--uppin-phone')
        el.addClass('page-app__sections--pin-phone')
      } else {
        el.removeClass('page-app__sections--uppin-phone')
        el.removeClass('page-app__sections--pin-phone')
      }
    }

    $('.page-app__section').each(function () {
      const section = $(this)
      const sectionBottom = (section.offset().top + section.height()) - windowY
      const layerPosition = layercontainer.position().top + layercontainer.height()
      const layer = layercontainer.find('.page-app__layer-item').eq(section.data('number') - 1)

      if (sectionBottom < layerPosition && sectionBottom > layercontainer.position().top) {
        const layerHeight = sectionBottom - layercontainer.position().top + 2

        layer.removeClass('page-app__layer-item--hidden')
        layer.css('height', layerHeight)

        layernext = layercontainer.find('.page-app__layer-item').eq(section.data('number'))

        if (!layernext.hasClass('page-app__layer-item--init')) {
          layernext.find('video source').attr('src', layernext.find('video source').data('src'))
          layernext.find('video')[0].load()

          layernext.addClass('page-app__layer-item--init')
        }
      } else if (sectionBottom < layerPosition && section.data('number') != layercontainer.find('.page-app__layer-item').length) {
        layer.addClass('page-app__layer-item--hidden')
      } else {
        layer.css('height', '')
      }
    })
  }
}

// Add Shopify buy buttons
const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
let scriptIsLoaded = false

function loadScript () {
  if (scriptIsLoaded) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = scriptURL;
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script)

  if ($('.js-shop-button').length) {
    const items = $('.js-shop-button')

    script.onload = function () {
      ShopifyBuyInit(items)
      scriptIsLoaded = true
    }
  }
}

function ShopifyBuyInit (items) {
  const client = ShopifyBuy.buildClient({
    domain: 'efluxshop.myshopify.com',
    storefrontAccessToken: '0d57cc764de8d73f6236bbf33b6e8e49'
  })

  if ($('.shop-item:not(.shopify-buy-frame)').length && ShopifyBuyInit == false) {
    loadScript($('.js-shop-button:not(.shopify-buy-frame)'))
    return
  }

  var items = items

  if ($('.js-shop-button:not(.shopify-buy-frame)').length) {
    items = $('.js-shop-button:not(.shopify-buy-frame)')
  }

  items.each(function () {
    const item = $(this)

    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('product', {
        id: [item.data('shopify-id')],
        node: item[0],
        moneyFormat: '%E2%82%AC%7B%7Bamount%7D%7D',
        options: {
          product: {
            iframe: false,
            variantId: 'all',
            width: '100%',
            contents: {
              img: false,
              imgWithCarousel: false,
              title: false,
              variantTitle: false,
              price: false,
              description: false,
              buttonWithQuantity: false,
              quantity: false
              // "margin-top": "0",

            },
            text: {
              button: 'Purchase',
              outOfStock: 'Sold Out',
              unavailable: 'Sold Out'
            }
          },
          cart: {
            styles: {
              button: {
                'font-size': '21px',
                // "padding-top": "14.5px",
                'padding-bottom': '14.5px',
                ':hover': {
                  'background-color': '#232323'
                },
                'background-color': '#232323',
                ':focus': {
                  'background-color': '#232323'
                },
                'border-radius': '0px'
              }
            }
          },
          toggle: {
            styles: {
              toggle: {
                'font-family': "'Neue Haas Unica',Arial",
                'background-color': '#232323',
                ':hover': {
                  'background-color': '#232323'
                },
                ':focus': {
                  'background-color': '#232323'
                }
              },
              count: {
                'font-size': '21px'
              }
            }
          }
        }
      })
    })
  })
}

// mapshow
function intersectRect (r1, r2) {
  return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top)
}

function getVisibleMarkers (map) {
  const cc = map.getContainer()
  const els = cc.getElementsByClassName('map__marker')
  const ccRect = cc.getBoundingClientRect()
  const visibles = []

  for (let i = 0; i < els.length; i++) {
    const el = els.item(i)
    const elRect = el.getBoundingClientRect()
    intersectRect(ccRect, elRect) && visibles.push(el)
  }

  return visibles
}

function showMarkersInSidebar (map) {
  const container = $('.js-map-sidebar-items')
  const newItem = $('.mapshow-preview-item .mapshow-sidebar-item')

  container.addClass('mapshow-sidebar__items--hide')
  container.empty()

  const visibileMarkers = getVisibleMarkers(map)

  $.each(visibileMarkers, function (i, e) {
    const el = $(this)

    if (el.hasClass('map__marker--cluster')) {
      const clusterSource = map.getSource('points')

      clusterSource.getClusterLeaves(el.data('id'), el.data('size'), 0, function (error, features) {
        $.each(features, function (i, e) {
          const clusterEl = $(this)
          const values = clusterEl[0].properties

          const item = newItem.clone()

          item.attr('data-id', el.data('id'))
          item.attr('data-order', values.order)
          item.find('.mapshow-sidebar-item__date').html(values.date)
          item.find('.mapshow-sidebar-item__client').html(values.client)
          item.find('.mapshow-sidebar-item__title').html(values.title)

          if (values.url) {
            let addClass = ''
            if (values.overlay) {
              addClass = ' js-open-overlayer'
            }

            const buttonInformation = $('<a href="' + values.url + '" class="button button--map' + addClass + '">More Information</a>')
            buttonInformation.appendTo(item.find('.mapshow-sidebar-item__buttons'))
          }

          const buttonDirection = $('<a href="' + values.directionUrl + '" class="button button--map">Get Directions</a>')
          buttonDirection.appendTo(item.find('.mapshow-sidebar-item__buttons'))

          item.find('.mapshow-sidebar-item__bullet').attr('href', values.directionUrl)

          const img = $('<img>').attr('src', values.image)
          item.find('.mapshow-sidebar-item__image').append(img)

          item.appendTo(container)
        })
      })
    } else {
      const item = newItem.clone()

      item.attr('data-id', el.data('id'))
      item.attr('data-order', el.data('order'))
      item.find('.mapshow-sidebar-item__date').html(el.data('date'))
      item.find('.mapshow-sidebar-item__client').html(el.data('client'))
      item.find('.mapshow-sidebar-item__title').html(el.data('title'))

      if (el.data('url')) {
        let addClass = ''
        if (el.data('overlay')) {
          addClass = ' js-open-overlayer'
        }

        const buttonInformation = $('<a href="' + el.data('url') + '" class="button button--map' + addClass + '">More Informations</a>')
        buttonInformation.appendTo(item.find('.mapshow-sidebar-item__buttons'))
      }

      const buttonDirection = $('<a href="' + el.data('directionUrl') + '" class="button button--map">Get Direction</a>')
      buttonDirection.appendTo(item.find('.mapshow-sidebar-item__buttons'))

      item.find('.mapshow-sidebar-item__bullet').attr('href', el.data('directionUrl'))

      const img = $('<img>').attr('src', el.data('image'))
      item.find('.mapshow-sidebar-item__image').append(img)

      item.appendTo(container)
    }
  })

  setTimeout(function () {
    container.children()
      .sort(function (a, b) {
        return $(a).data('order') - $(b).data('order')
      })
      .appendTo(container)

    container.removeClass('mapshow-sidebar__items--hide')
    $('.mapshow__sidebar').removeClass('mapshow__sidebar--visibile')

    $('.map__marker').removeClass('map__marker--hover')

    if (isMobile()) {
      container.scrollLeft(0)
    }
  })
}

function closeSubscribeInfo (item) {
  item.closest('.landing-subscribe').fadeOut()
  document.cookie = 'hidesubscribeform=1; path=/'
}

function closeOverlayerForm (overlayer) {
  // hide form
  overlayer.fadeOut(fadeDuration)

  window.history.pushState(null, null, overlayer.data('baseurl'))

  // Track pageview
  if ($.isFunction(ga)) {
    ga('send', 'pageview', overlayer.data('baseurl'))
  }

  // reset from
  setTimeout(function () {
    overlayer.find('.overlayer-form__form').removeClass('el-hidden')
    overlayer.find('.overlayer-form__successful').addClass('el-hidden')

    overlayer.find('input[type="text"]').val('')
    overlayer.find('input[type="email"]').val('')
    overlayer.find('input[type="checkbox"]').prop('checked', false)
  }, fadeDuration)
}

function fadeHeader () {
  $('.header--fadable').each(function () {
    const header = $(this)
    const container = header.closest('.overlayer, .main')
    const trigger = container.find('.js-header-fade-trigger')
    const sTop = $(window).scrollTop()

    if (container.hasClass('main--lock')) {
      return
    }

    if (header.length && trigger.length) {
      if (sTop > trigger.offset().top) {
        header.addClass('header--visible')
      } else {
        header.removeClass('header--visible')
      }
    }
  })
}

function topicBottomheight () {
  const topics = $('.js-topic-bottom-height')
  if (topics.length) {
    topics.each(function () {
      const container = $(this).closest('.preview-topic')
      const topicBottom = $(this)
      const topicTop = container.find('.preview-topic__content-top')
      const topicImage = container.find('.preview-topic__image .lazyimage-container')

      if (isMobile()) {
        const tipicSCrollHeight = container.find('.preview-topic__content-articles').outerHeight()
        if (tipicSCrollHeight > 220) {
          container.addClass('preview-topic--arrow')
        } else {
          container.removeClass('preview-topic--arrow')
        }
      } else {
        const topicScrollHeight = topicImage.outerHeight() - topicTop.height()
        topicBottom.css({
          height: topicScrollHeight,
          width: 'calc(100% + ' + getScrollbarWidth() + 'px)'
        })
      }
    })
  }
}

function sideAd () {
  const sidead = $('.side-ad')

  if (sidead.length) {
    const sideadItem = sidead.find('.side-ad__item')

    sideadItem.css('width', sidead.width())
  }
}
sideAd()

let activeAfterPageLoad
$(window).on('load', function () {
  activeAfterPageLoad = true
  topicBottomheight()
})

$(function () {
  $('html').addClass(isTouch ? 'is-touch' : 'no-touch')

  FastClick.attach(document.body)

  initFunctions()
  contentTopBorder()

  $("<style type='text/css'>.fx-scrollbar-fixed-el{margin-right:" + getScrollbarWidth() + 'px;}</style>').appendTo($('head'))
  $("<style type='text/css'>.fx-scrollbar{padding-right:" + getScrollbarWidth() + 'px;}</style>').appendTo($('head'))

  const mapSidebar = $('.mapshow__sidebar-scroller')
  if (mapSidebar.length) {
    mapSidebar.css('right', '-' + getScrollbarWidth() + 'px')
  }

  $(document).on('lazyloaded', function (el) {
    if ($(el.target).hasClass('js-lazyimage-loaded')) {
      if ($(el.target).closest('.preview-video__media').length) {
        $(el.target).closest('.preview-video__media').addClass('preview-video__media--ready')
      } else if ($(el.target).closest('.preview-note__video').length) {
        $(el.target).closest('.preview-note__video').addClass('preview-note__video--ready')
      }else if($(el.target).closest('.preview-liveitem__media').length){
        $(el.target).closest('.preview-liveitem__media').addClass('preview-liveitem__media--ready')
      }
    }
  })

  $(document).on('click', '.js-filter-item', function () {
    const item = $(this)

    if (item.hasClass('filter-item-clickable--selected')) {
      return
    }

    item.addClass('filter-item-clickable--selected')

    updateSearchResults()
  })

  $(document).on('change', '.js-search-order-changed', function () {
    updateSearchResults()
  })

  $(document).on('click', '.filter-category__selected-item', function () {
    const item = $(this)
    const group = item.closest('.filter-category')
    const selectedFilters = item.closest('.filter-category__selected')

    group.find('.js-filter-item[data-id="' + item.data('id') + '"]').removeClass('filter-item-clickable--selected')

    item.remove()

    if (!selectedFilters.children().length) {
      selectedFilters.removeClass('filter-category__selected--visible')
    }

    updateSearchResults()
  })

  $(document).on('click', '.block-carousel-cell', function () {
    const cell = $(this)
    let cellNext = cell.index()

    if (cell.hasClass('is-selected')) {
      cellNext = cell.index() + 1
    }

    cell.closest('.flickity-enabled').flickity('select', cellNext)
  })

  $(document).on('click', '.js-announcement-sound-toggle', function () {
    const button = $(this)
    const video = button.closest('.announcement__header-image').find('.announcement__header-media-video')

    if (button.hasClass('announcement__header-sound-on')) {
      button
        .removeClass('announcement__header-sound-on')
        .addClass('announcement__header-sound-off')

      video.prop('muted', true)
    } else {
      button
        .removeClass('announcement__header-sound-off')
        .addClass('announcement__header-sound-on')

      video.prop('muted', false)
    }
  })

  const filterlists = $('.js-filterlist')
  if (filterlists.length) {
    filterlists.each(function () {
      const thisFilterlist = $(this)

      const url = thisFilterlist.data('filterlist')

      fetch(url)
        .then(resp => resp.json())
        .then(data => {
          $(data).appendTo(thisFilterlist)

          showSelectedFilters(thisFilterlist)
        })
    })
  }

  let timeoutKeyup
  $(document).on('keyup', '.js-filter-input', function () {
    const el = $(this)
    const container = el.closest('.filter-category__dropdown')
    const list = container.find('.filter-items')
    const value = el.val()

    clearTimeout(timeoutKeyup)

    timeoutKeyup = setTimeout(function () {
      if (list.hasClass('js-filterlist')) {
        // filter by ajax request
        const url = list.data('filterlist') + '&' + el.attr('name') + '=' + value

        fetch(url)
          .then(resp => resp.json())
          .then(data => {
            list.empty()

            $(data).appendTo(list)
          })
      } else {
        // filter by jquery filter
        list.children().filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        })
      }
    }, 300)
  })

  //

  $(document).on('click', '.js-filter-category-toggle', function () {
    const container = $(this).closest('.filter-category')
    const dropdown = container.find('.filter-category__dropdown')
    const title = container.find('.filter-category__title')
    const selectedItems = container.find('.filter-category__selected--visible')
    let minContainerHeight = title.outerHeight()

    if (selectedItems.length) {
      minContainerHeight = minContainerHeight + selectedItems.outerHeight(true) + 1
    }

    container.css('min-height', minContainerHeight)

    if (container.hasClass('filter-category--open')) {
      container.removeClass('filter-category--open')
      dropdown.slideUp(fadeDuration, function () {
        container.removeClass('filter-category--fix-selected')
      })
    } else {
      other = $('.filter-category.filter-category--open')
      if (other.length) {
        other.removeClass('filter-category--open')
        other.find('.filter-category__dropdown').slideUp(fadeDuration, function () {
          container.removeClass('filter-category--fix-selected')
        })
      }

      container.addClass('filter-category--open filter-category--fix-selected')
      dropdown.slideDown(fadeDuration)
    }
  })

  $(document).on('click', '.sidebar-list__button', function () {
    const button = $(this)
    const container = button.closest('.sidebar-list')

    if (button.hasClass('sidebar-list__button--more')) {
      container.addClass('sidebar-list--expand')
    } else {
      container.removeClass('sidebar-list--expand')
    }
  })

  $(document).on('click', '.js-toggle-dropdown', function () {
    const container = $(this).closest('.dropdown-button')

    const other = $('.dropdown-button.dropdown-button--open')
    if (other.length) {
      other.removeClass('dropdown-button--open')
    }

    container.addClass('dropdown-button--open')
  })

  $(document).on('click', '#js-clipboard', function () {
    copyToClipboard(window.location.href)
  })

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.dropdown-button').length) {
      $('.dropdown-button').removeClass('dropdown-button--open')
    }

    if (!$(e.target).closest('.js-menu-open').length && !$(e.target).closest('.menu').length) {
      closemenu()
    }
  })

  $(document).on('click', '.js-sidebar-related', function () {
    const related = $('.related')
    const header = $(this).closest('.overlayer').find('.header')
    const position = related.offset().top - header.height() + 2

    $('.sidebar').removeClass('sidebar--open')

    $('html, body').animate({
      scrollTop: position
    }, 500)
  })

  $(document).on('click', '.menu__item-accordion-title', function () {
    const container = $(this).closest('.menu__item-accordion')

    if (container.hasClass('menu__item-accordion--active')) {
      container.removeClass('menu__item-accordion--active')
      container.find('.menu__item-accordion-items').slideUp(200)
    } else {
      container.addClass('menu__item-accordion--active')
      container.find('.menu__item-accordion-items').slideDown(200)
    }
  })

  $(document).on('click', '.js-menu-open', function () {
    $('.menu')
      .addClass('menu--open')
      .fadeIn(fadeDuration)

    $('.header--short').addClass('header--menu-open')
  })

  $(document).on('click', '.js-menu-close', function () {
    closemenu()
  })

  $(document).on('click', '.js-related-slide-arrow', function () {
    const button = $(this)
    const slider = button.closest('.related__inner').find('.related__carousel')
    const cellWidth = slider.find('.related__item').outerWidth()
    let scrollSize
    const slideCells = Math.floor($(window).width() / cellWidth)

    jumpPosition = cellWidth * slideCells

    slider.removeClass('related__carousel-snap-active')

    const wWidth = $(window).width()
    let currentLeftItem

    if (button.hasClass('related__top-arrow--next')) {
      slider.find('.related__item').each(function () {
        const cell = $(this)

        if (cell.offset().left <= wWidth) {
          currentLeftItem = cell
        }
      })
    } else {
      slider.find('.related__item').each(function () {
        const cell = $(this)

        if (cell.offset().left + wWidth >= 0) {
          currentLeftItem = cell
          return false
        }
      })
    }

    scrollSize = slider.scrollLeft() + currentLeftItem.offset().left

    slider.animate({
      scrollLeft: scrollSize + 'px'
    }, 250, () => slider.addClass('related__carousel-snap-active'))
  })

  $(document).on('click', '.js-block-carousel-arrow', function () {
    const button = $(this)
    const carousel = button.closest('.block-media').find('.js-carousel')

    if (button.hasClass('block-carousel-arrow--prev')) {
      carousel.flickity('previous')
    } else {
      carousel.flickity('next')
    }
  })

  $(document).on('click', '.js-video-carousel-arrow', function () {
    const button = $(this)
    const slider = button.closest('.video-carousel__inner').find('.video-carousel__slider')
    const cellWidth = slider.children().eq(0).outerWidth()
    let scrollSize
    const slideCells = Math.floor($(window).width() / cellWidth)

    jumpPosition = cellWidth * slideCells

    slider.removeClass('video-carousel__slider--snap-active')

    if (button.hasClass('video-carousel__arrow--next')) {
      scrollSize = slider.scrollLeft() + jumpPosition
    } else {
      scrollSize = slider.scrollLeft() - jumpPosition
    }

    slider.animate({
      scrollLeft: scrollSize + 'px'
    }, 250, () => slider.addClass('video-carousel__slider--snap-active'))
  })

  $(document).on('click', '.js-load-more', function () {
    const button = $(this)
    const buttonContainer = button.parent()

    if (button.hasClass('button--loaded')) {
      return false
    }

    if (button.data('href')) {
      button.addClass('button--loaded')
      button.text(button.data('label'))

      const url = button.data('href')

      fetch(url)
        .then(resp => resp.text())
        .then(data => {
          const content = $('<div/>').append(data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''))

          button.closest('.button-wrap').remove()

          const newItems = content.find('.js-loadmore-container').children()

          $('.js-loadmore-container').append(newItems)

          const newButton = content.find('.js-load-more')
          if (newButton.length) {
            newButton.closest('.button-wrap').appendTo($('.js-loadmore-container').parent())
          }
        })
    } else if (button.closest('.announcements__group').find('[data-load-more-url]').length) {
      loadMore(button.closest('.announcements__group').find('[data-load-more-url]')).then((hasMore) => {
        if (!hasMore) {
          button.closest('.button-wrap').remove()
        }
      })
    } else {
      // Reveal 10 more
      buttonContainer.parent().find('.preview-item--hidden').slice(0, 10).removeClass('preview-item--hidden')
      if (buttonContainer.parent().find('.preview-item--hidden').length == 0) {
        buttonContainer.remove()
      }
    }
  })

  $(document).on('click', '.js-open-overlayer', function (e) {
    if (overlayerLoaded) {
      return
    }

    const el = $(this)
    const main = $('.main')
    let url = el.data('href')

    if (el.is('a')) {
      url = el.attr('href')
    }

    if ($('<a href="' + url + '"></a>').get(0).hostname != location.hostname) {
      this.blur()
      window.open(url)
      return
    }

    overlayerLoaded = true

    const saveScrollPosition = $(window).scrollTop()

    main.data({
      scrollPosition: saveScrollPosition,
      pageTitle: $('title').text(),
      pageUrl: location.href
    })

    main.addClass('main--lock fx-scrollbar')
    main.scrollTop(saveScrollPosition)

    $('.js-for-scrollbar').addClass('fx-scrollbar-fixed-el')

    fetch(url)
      .then(resp => resp.text())
      .then(data => {
        main.removeClass('fx-scrollbar')
        $('.js-for-scrollbar').removeClass('fx-scrollbar-fixed-el')

        const content = $('<div/>').append(data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''))

        const overlayer = content.find('.overlayer')

        overlayer.hide().appendTo($('body'))

        overlayer.fadeIn(fadeDuration, function () {
          main.addClass('main--hide')
        })

        window.history.pushState(null, null, url)

        // Track pageview
        if ($.isFunction(ga)) {
          ga('send', 'pageview', url)
        }

        document.title = content.find('title').text()

        overlayerLoaded = false

        const buyButtons = overlayer.find('.js-shop-button:not(.shopify-buy-frame)')
        if (buyButtons.length) {
          ShopifyBuyInit(buyButtons)
        }

        initFunctions()
      })
  })

  $(document).on('click', '.js-close-overlayer', function () {
    const main = $('.main')
    const button = $(this)
    const overlayer = button.closest('.overlayer')

    if (!main.length) {
      location.href = button.data('href')
    } else {
      main.removeClass('main--hide')

      overlayer.fadeOut(fadeDuration, function () {
        overlayer.remove()
        resetMain()
      })
    }
  })

  $(document).on('click', '.js-client-character', function () {
    const item = $(this)
    const section = $('.client__group[data-char="' + item.data('char') + '"]')
    const charsList = $('.clients-characters')
    const header = $('.header').eq(0)

    if (!item.hasClass('client-character--selected')) {
      // let scrollPosition = section.offset().top - charsList.outerHeight() - header.height() + 3
      $('.js-client-character').removeClass('client-character--selected')
      item.addClass('client-character--selected')

      if (item.data('char') == 'all') {
        $('.client__groups').removeClass('client__groups--filtered')
        $('.client__group').removeClass('client__group--active')
      } else {
        $('.client__groups').addClass('client__groups--filtered')
        $('.client__group').removeClass('client__group--active')
        section.addClass('client__group--active')
      }
    }

    $('html, body').animate({
      scrollTop: 0
    }, 0)
  })

  $(document).on('click', '.js-issue-year', function () {
    const item = $(this)
    const filterItems = item.closest('.journal-filter__items')
    const issues = $('.preview-issue[data-year="' + item.data('year') + '"]')
    const previewItems = $('.preview-issues')

    if (!item.hasClass('journal-year--selected')) {
      filterItems.addClass('journal-filter__items--filtered')
      item.addClass('journal-year--selected')

      previewItems.addClass('preview-issues--filtered')
      $('.preview-issue').removeClass('preview-issue--active')
      issues.addClass('preview-issue--active')
    }
  })

  $(document).on('click', '.js-journal-filter-open', function () {
    const filter = $(this).closest('.journal-filter')

    filter.addClass('journal-filter--open')
  })

  $(document).on('click', '.js-journal-filter-close', function () {
    const filter = $(this).closest('.journal-filter')
    const previewItems = $('.preview-issues')

    filter.removeClass('journal-filter--open')

    filter.find('.journal-filter__items').removeClass('journal-filter__items--filtered')
    filter.find('.journal-year').removeClass('journal-year--selected')

    previewItems.removeClass('preview-issues--filtered')
    $('.preview-issue').removeClass('preview-issue--active')
  })

  $(document).on('click', '.js-sidebar__toggle', function () {
    const sidebar = $(this).closest('.sidebar')

    if (sidebar.hasClass('sidebar--open')) {
      sidebar.removeClass('sidebar--open')
    } else {
      sidebar.addClass('sidebar--open')
    }
  })

  $(document).on('click', '.js-filter__toggle', function () {
    const filter = $('.filter')
    const filterButton = $('.filter__toggle')

    if (filter.hasClass('filter--open')) {
      filter.removeClass('filter--open')
      filterButton.removeClass('filter__toggle--open')
    } else {
      filter.addClass('filter--open')
      filterButton.addClass('filter__toggle--open')
    }
  })

  $(document).on('click', '.footnote-reference', function () {
    const footnoteRef = $(this)
    footnote = $('.js-article__footnote-number[data-footnoteindex="' + footnoteRef.data('index') + '"]')

    if (footnote.length) {
      const position = footnote.offset().top - $('.overlayer__inner > .header').height()

      $('html,body').animate({
        scrollTop: position
      }, 300)
    }
  })

  $(document).on('click', '.js-article__footnote-number', function () {
    const footnote = $(this)
    const footnoteRef = $('#footnote-' + footnote.data('footnoteindex') + '-reference')

    if (footnoteRef.length) {
      const position = footnoteRef.offset().top - $('.overlayer__inner > .header').height()

      $('html,body').animate({
        scrollTop: position
      }, 300)
    }
  })

  $(document).on('click', '.js-journalshow__top-style', function () {
    const el = $(this)
    let articles = $('.preview-journalarticles')

    if (el.data('container')) {
      articles = $('.' + el.data('container'))

      if (!el.hasClass('journalshow__top-style--selected')) {
        $('.js-journalshow__top-style').removeClass('journalshow__top-style--selected')
        el.addClass('journalshow__top-style--selected')

        articles.removeClass('preview-videos--images preview-videos--list')
        articles.addClass('preview-videos--' + el.data('style'))

        lazySizes.autoSizer.checkElems()
      }
    } else {
      if (!el.hasClass('journalshow__top-style--selected')) {
        $('.js-journalshow__top-style').removeClass('journalshow__top-style--selected')
        el.addClass('journalshow__top-style--selected')

        articles.removeClass('preview-journalarticles--images preview-journalarticles--list')
        articles.addClass('preview-journalarticles--' + el.data('style'))

        lazySizes.autoSizer.checkElems()
      }
    }
  })

  // $(document).on('click', '.js-overlay-player-start', function(){
  //  let overlayer = $(this).closest('.overlayer');

  //  overlayer.addClass('overlayer--player-active');

  //  overlayer.find('.inline-audio--overlay').addClass('inline-audio--overlay-active');
  //  overlayer.find('.inline-audio--overlay .js-player-audio').cbplayer('mediaPlay');
  // });

  $(document).on('click', '.js-announcement-map-toggle', function () {
    const button = $(this)
    const block = button.closest('.announcement__map')
    const container = block.find('.announcement__map-content')
    const map = block.find('.announcement__map-item')

    if (block.hasClass('announcement__map--open')) {
      block.removeClass('announcement__map--open')

      if (isMobile()) {
        container.css('height', '')
      }
    } else {
      block.addClass('announcement__map--open')

      if (isMobile()) {
        container.css('height', parseInt(map.css('height')) + 'px')
      }
    }
  })

  $(document).on('click', '.js-form-open', function () {
    $('.overlayer-form[data-overlayer="institutions"]').fadeIn(fadeDuration)
  })

  $(document).on('click', '.js-overlayer-form__close', function () {
    closeOverlayerForm($(this).closest('.overlayer-form'))
  })

  $(document).on('click', '.js-selected-toggle', function () {
    const container = $(this).closest('.form__wrap-select')

    if (container.hasClass('form__wrap-select--open')) {
      container.removeClass('form__wrap-select--open')
    } else {
      container.addClass('form__wrap-select--open')
    }
  })

  $(document).on('click', '.js-select-option', function () {
    const option = $(this)
    const container = option.closest('.form__wrap-select')
    const dropdown = option.closest('.form__select-dropdown')

    dropdown.find('.form__select-dropdown-wrap').removeClass('form__select-dropdown-wrap--selected')
    option.closest('.form__select-dropdown-wrap').addClass('form__select-dropdown-wrap--selected')

    container.find('.js-selected-toggle').html(option.html())
    container.find('.js-selected-value').val(option.data('value'))

    container.removeClass('form__wrap-select--open')
  })

  $(document).on('click', '.js-landing-subscribe-close', function () {
    closeSubscribeInfo($(this))
  })

  let timeoutReaderImageHover
  $(document).on('mouseenter', '.js-reader__images', function () {
    const el = $(this)

    el.addClass('reader__images--hover')

    timeoutReaderImageHover = setTimeout(function () {
      el.addClass('reader__images--change-postion')
    }, 200)
  })

  $(document).on('mouseleave', '.js-reader__images', function () {
    const el = $(this)

    el.removeClass('reader__images--hover')

    clearTimeout(timeoutReaderImageHover)

    timeoutReaderImageHover = setTimeout(function () {
      el.removeClass('reader__images--change-postion')
    }, 200)
  })

  $(document).on('click', '.js-accordion-more', function () {
    $(this).closest('.article-accordion').addClass('article-accordion--open')
  })

  $(document).on('click', '.js-accordion-less', function () {
    $(this).closest('.article-accordion').removeClass('article-accordion--open')
  })

  $(document).on('change', '.form__checkbox-input', function () {
    $(this).closest('.form__wrap--error').removeClass('form__wrap--error')
  })

  $(document).on('focus', '.form__input, .form__textarea', function () {
    $(this).closest('.form__wrap--error').removeClass('form__wrap--error')
  })

  $(document).on('click', '.js-get-player', function (e) {
    e.preventDefault()

    const el = $(this)
    const player = $('.inline-audio--overlay[data-id="' + el.data('id') + '"]')

    // if player exist, play
    if (player.length) {
      player.addClass('inline-audio--overlay-active')
      if (el.find('.podcast__play').hasClass('podcast__play--is-playing')) {
        player.find('.js-player-audio').cbplayer('mediaPause')
        $('.podcast__play--is-playing').removeClass('podcast__play--is-playing')
        el.find('.podcast__play').removeClass('podcast__play--is-playing')
      } else {
        player.find('.js-player-audio').cbplayer('mediaPlay')
        $('.podcast__play--is-playing').removeClass('podcast__play--is-playing')
        el.find('.podcast__play').addClass('podcast__play--is-playing')
      }
    } else {
      $('.podcast__play--is-playing').removeClass('podcast__play--is-playing')
      fetch($(this).attr('href'))
        .then(resp => resp.json())
        .then(data => {
          const other = $('.inline-audio--overlay')

          if (other.length) {
            other.remove()
          }

          const player = $(data.html).appendTo($('body'))

          player.addClass('inline-audio--overlay-active')

          player.find('.js-player-audio').cbplayer({
            tpf: false,
            overlaySpinner: false,
            overlayButton: false,
            disableClick: true,
            mediaIsPlay: () => {
              el.find('.podcast__play').addClass('podcast__play--is-playing')
            },
            mediaIsPause: () => {
              el.find('.podcast__play').removeClass('podcast__play--is-playing')
            }
          })

          player.find('.js-player-audio').cbplayer('mediaPlay')
        })
    }
  })

  $(document).on('click', '.js-inline-audio__close', function () {
    const button = $(this)

    button.closest('.overlayer').removeClass('overlayer--player-active')
    button.closest('.inline-audio').removeClass('inline-audio--overlay-active')
    button.closest('.cb-player').cbplayer('mediaStop')
  })

  $(document).on('click', '.js-inline-accordion-toggle', function () {
    const el = $(this)
    const container = el.closest('.inline-accordion')
    const content = container.find('.inline-accordion__content')

    if (container.hasClass('inline-accordion--open')) {
      container.removeClass('inline-accordion--open')
      content.slideUp(fadeDuration)
    } else {
      container.addClass('inline-accordion--open')
      content.slideDown(fadeDuration)
    }
  })

  $(document).on('click', '.js-description-more', function () {
    $(this).closest('.overview__description').addClass('overview__description--show-long')
  })

  $(document).on('click', '.js-description-less', function () {
    $(this).closest('.overview__description').removeClass('overview__description--show-long')
  })

  $(document).on('click', '.js-overlayer-search-close', function () {
    $('.overlayer-search').removeClass('overlayer-search--open')
  })

  $(document).on('click', '.js-menu-search', function () {
    const el = $(this)
    const container = el.closest('.main, .overlayer')
    searchInput = container.find('.js-overlayer-search__input')

    container.find('.overlayer-search').addClass('overlayer-search--open')
    $('.menu').removeClass('.menu--open')

    searchInput.focus()

    const tempValue = searchInput.val()
    searchInput.val('')
    searchInput.val(tempValue)
  })

  $(document).on('click', '.js-overlayer-search-submit', function () {
    $(this).closest('.overlayer-search__form').submit()
  })

  $(document).on('click', '.js-show-video-overlayer', function () {
    const overlayer = $(this).closest('.overlayer')
    const videoOverlayer = overlayer.find('.video-overlayer')
    const player = videoOverlayer.find('.js-videoplayer')

    videoOverlayer.fadeIn(fadeDuration)

    if (player.hasClass('cb-media-is-ready')) {
      player.cbplayer('mediaPlay')
    } else {
      player.cbplayer({
        tpl: false,
        autoplay: true,
        overlaySpinner: false,
        overlayButton: false,
        disableClick: true
      })
    }
  })

  $(document).on('click', '.js-close-video-overlayer', function () {
    const overlayer = $(this).closest('.overlayer')
    const videoOverlayer = overlayer.find('.video-overlayer')

    videoOverlayer.find('.js-videoplayer').cbplayer('mediaPauseAll')

    videoOverlayer.fadeOut(fadeDuration)
  })

  let mapReady = false
  if ($('#map').length) {
    const el = $('#map')

    mapboxgl.accessToken = 'pk.eyJ1IjoiZWZsdXgiLCJhIjoiY2tvdWtlYmRrMG0yZDJwbGduc29xYnhmYSJ9._VbyfiocV_cdHHlcMri-Dg'
    const mapBounds = sessionStorage.getItem('mapBounds')
    const map = new mapboxgl.Map({
      container: el.get(0),
      style: 'mapbox://styles/eflux/ckpx4an1j53vv17n3t5ck4ljz',
      center: [6.125833, 51.795556],
      zoom: 2,
      bounds: mapBounds ? JSON.parse(mapBounds) : false
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    // map.scrollZoom.disable();
    map.dragRotate.disable()
    map.doubleClickZoom.disable()
    map.touchZoomRotate.disableRotation()

    const bounds = [
      [999, 999],
      [-999, -999]
    ]

    const saveMapState = function () {
      sessionStorage.setItem('mapBounds', JSON.stringify(map.getBounds().toArray()))
    }

    map.on('moveend', saveMapState)
    map.on('zoomend', saveMapState)

    const markers = {}
    let markersOnScreen = {}

    map.on('load', function () {
      map.addSource('points', {
        type: 'geojson',
        data: '/v2/api/map/' + el.data('id'),
        cluster: true,
        clusterRadius: 50
      })

      // Add a circle layer
      map.addLayer({
        id: 'circle',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-color': 'transparent',
          'circle-radius': 12,
          'circle-stroke-width': 0
        }
      })

      if (!mapBounds) {
        window.fetch('/v2/api/map/' + el.data('id'))
          .then(response => response.json())
          .then(geojson => {
            geojson.features.forEach(function (feature) {
              if (feature.geometry.coordinates[0] < bounds[0][0]) {
                bounds[0][0] = feature.geometry.coordinates[0]
              }

              if (feature.geometry.coordinates[1] < bounds[0][1]) {
                bounds[0][1] = feature.geometry.coordinates[1]
              }

              if (feature.geometry.coordinates[0] > bounds[1][0]) {
                bounds[1][0] = feature.geometry.coordinates[0]
              }

              if (feature.geometry.coordinates[1] > bounds[1][1]) {
                bounds[1][1] = feature.geometry.coordinates[1]
              }
            })

            map.fitBounds(bounds, {
              duration: 0,
              padding: 50
            })
          })
      }

      map.on('dragend', function () {
        showMarkersInSidebar(map)
      })

      map.on('zoomend', function () {
        showMarkersInSidebar(map)
      })

      map.on('render', function () {
        if (!map.isSourceLoaded('points')) {
          return
        }

        const newMarkers = {}
        const features = map.querySourceFeatures('points')
        features.forEach(function (feature) {
          let marker = markers[feature.id]

          if (!marker) {
            const el = $('<div class="map__marker"></div>')

            if (feature.properties.cluster) {
              const clusterId = feature.properties.cluster_id

              el.addClass('map__marker--cluster js-map-cluster-zoom')
              el.append('<div class="map__marker-label">' + feature.properties.point_count + '</div>')
              el.attr({
                'data-id': clusterId,
                'data-size': feature.properties.point_count,
                'data-center': JSON.stringify(feature.geometry.coordinates)
              })
            } else {
              el.addClass('clickable-block')
                .data({
                  order: feature.properties.order,
                  title: feature.properties.title,
                  date: feature.properties.date,
                  client: feature.properties.client,
                  directionUrl: feature.properties.directionUrl,
                  overlay: feature.properties.overlay,
                  url: feature.properties.url
                })
                .attr('data-id', feature.id)

              if (feature.properties.overlay) {
                el.addClass('js-open-overlayer').data('href', feature.properties.url)
              }
            }

            marker = new mapboxgl.Marker(el[0])
              .setLngLat(feature.geometry.coordinates)
            markers[feature.id] = marker
          }

          newMarkers[feature.id] = marker

          if (!markersOnScreen[feature.id]) {
            marker.addTo(map)
          }
        })

        for (id in markersOnScreen) {
          if (!newMarkers[id]) {
            markersOnScreen[id].remove()
          }
        }

        markersOnScreen = newMarkers

        if (!mapReady) {
          showMarkersInSidebar(map)
          mapReady = true
        }
      })

      $(document).on('click', '.js-map-cluster-zoom', function () {
        const center = $(this).data('center')
        map.getSource('points').getClusterExpansionZoom(

          $(this).data('id'),
          function (err, zoom) {
            if (err) return
            map.easeTo({
              center,
              zoom
            })
          }
        )
      })
    })
  }

  $(document).on('mouseenter', '.js-map-sidebar-item', function () {
    const item = $(this)

    item.addClass('mapshow-sidebar-item--hover')

    $('.map__marker[data-id="' + item.attr('data-id') + '"]').addClass('map__marker--hover')
  })

  $(document).on('mouseleave', '.js-map-sidebar-item', function () {
    const item = $(this)

    item.removeClass('mapshow-sidebar-item--hover')

    $('.map__marker').removeClass('map__marker--hover')
  })

  $(document).on(isTouch ? 'click' : 'mouseenter', '.map__marker', function (e) {
    const item = $(this)

    if (item.hasClass('map__marker--hover')) {
      $('.map__marker').removeClass('map__marker--hover')
      $('.js-map-sidebar-item').removeClass('mapshow-sidebar-item--hover')

      $('.mapshow__sidebar').removeClass('mapshow__sidebar--visibile')
    } else {
      $('.map__marker').removeClass('map__marker--hover')
      $('.js-map-sidebar-item').removeClass('mapshow-sidebar-item--hover')

      item.addClass('map__marker--hover')

      $('.js-map-sidebar-item[data-id="' + item.data('id') + '"]').addClass('mapshow-sidebar-item--hover')

      if (isMobile()) {
        const container = $('.js-map-sidebar-items')
        const selectedItems = container.find('.mapshow-sidebar-item--hover')

        $('.mapshow__sidebar').addClass('mapshow__sidebar--visibile')

        container.addClass('mapshow-sidebar__items--disable-snap')

        container.scrollLeft(0)

        setTimeout(function () {
          container.removeClass('mapshow-sidebar__items--disable-snap')
        })
      }
    }
  })

  $(document).on('mouseleave', '.map__marker', function () {
    const item = $(this)

    if (isMobile()) {
      return
    }

    item.removeClass('map__marker--hover')

    $('.js-map-sidebar-item').removeClass('mapshow-sidebar-item--hover')
  })

  $(document).on('mouseenter', '.inline-media__groupimage', function () {
    const container = $(this)
    const tracker = container.find('.inline-media__tracker')

    tracker.show()
  })

  $(document).on('mousemove', '.inline-media__groupimage', function (e) {
    const container = $(this)
    const tracker = container.find('.inline-media__tracker')

    tracker.css({
      top: e.offsetY,
      left: e.offsetX
    })
  })

  $(document).on('mouseleave', '.inline-media__groupimage', function () {
    const container = $(this)
    const tracker = container.find('.inline-media__tracker')

    tracker.hide()
  })

  $(document).on('click', '.js-search-toggle-bio', function () {
    const button = $(this)
    const bio = $('.search-results__bio')

    if (button.hasClass('header__inner-search-bio--open')) {
      $('.js-search-toggle-bio').removeClass('header__inner-search-bio--open')
      bio.slideUp(fadeDuration)
    } else {
      $('.js-search-toggle-bio').addClass('header__inner-search-bio--open')
      bio.slideDown(fadeDuration)

      $('html, body').animate({
        scrollTop: 0
      }, 200)
    }
  })

  $(document).on('click', '.js-preview-topic__arrow', function () {
    $(this).closest('.preview-topic').toggleClass('preview-topic--open')
  })

  $(document).on('click', '.js-homepage-arrow', function () {
    const button = $(this)
    const carousel = button.closest('.homepage-section').find('.js-homepage-carousel')

    if (button.hasClass('homepage-arrow--prev')) {
      carousel.flickity('previous')
    } else {
      carousel.flickity('next')
    }
  })

  $(document).on('click', '.js-journalinfo-more', function () {
    $('.journal__info').addClass('journal__info--open')
  })

  $(document).on('click', '.js-journalinfo-less', function () {
    $('.journal__info').removeClass('journal__info--open')
  })

  $(document).on('click', '.js-header__dropdown', function () {
    const container = $(this).closest('.header__dropdown')

    if (container.hasClass('header__dropdown--open')) {
      $('.header__dropdown').removeClass('header__dropdown--open')
    } else {
      $('.header__dropdown').addClass('header__dropdown--open')
    }
  })

  $(window).on('hashchange', function (e) {
    if (location.hash) {
      hash = location.hash.substr(1)

      if (hash == 'rsvp') {
        const form = $('.overlayer-form[data-overlayer="rsvp"]')

        form.fadeIn(fadeDuration)
        form.find('.form__input').eq(0).focus()
      } else if (hash == 'subscribe') {
        const form = $('.overlayer-form[data-overlayer="subscribe"]')

        form.fadeIn(fadeDuration)
        form.find('.form__input').eq(0).focus()
      } else if (hash == 'issues') {
        e.preventDefault()
        $(window).scrollTop($('#issues').offset().top - 65)
      } else if (hash == 'upcoming' || hash == 'archive') {
        e.preventDefault()
        setTimeout(() => $(`.js-header-jumplink[data-jump="${hash}"]`).trigger('click'))
      }
    }
  })
  $(window).trigger('hashchange')

  $(document).on('click', '.js-anchor-click', (e) => {
    location.hash = '#issues'
    $(window).trigger('hashchange')
    e.preventDefault()
  })

  $(document).on('click', '.js-article-ad-sound', function () {
    const button = $(this)
    const player = button.closest('.article-ad__inner').find('.cb-player')

    if (button.hasClass('article-ad__sound--off')) {
      button.removeClass('article-ad__sound--off')
      player.cbplayer('mediaSetVolume', 100)
    } else {
      button.addClass('article-ad__sound--off')
      player.cbplayer('mediaSetVolume', 0)
    }
  })

  // Keep up to date with history changes
  window.addEventListener('popstate', function (e) {
    if (location.hash) {
      return false
    }

    if (activeAfterPageLoad != false) {
      location.reload()
    }
  }, false)

  function loadMore (panel) {
    panel.addClass('is-loading')

    const pageUrl = panel.data('load-more-url')
    let currentPage = panel.data('current-page')

    return new Promise(function (resolve, reject) {
      if (pageUrl != undefined && pageUrl != null) {
        panel.addClass('is-loading')
        if (currentPage == undefined) {
          currentPage = 0
        }
        currentPage = currentPage + 1
        panel.data('current-page', currentPage)
        fetch(pageUrl.replace('%d', currentPage))
          .then(res => res.text())
          .then(html => {
            html = $(html)
            const hasMore = html.children().length > 0
            if (hasMore) {
              // Show more items
              html.children().appendTo(panel)
            } else {
              // No more items, don’t try to load more items
              panel.data('load-more-url', null)
            }
            panel.removeClass('is-loading')
            resolve(hasMore)
          })
      }
    })
  }

  $(document).on('click', '.js-header-jumplink', function () {
    const el = $(this)
    const section = $('.announcements__group[data-section="' + el.data('jump') + '"]')

    if (section.length) {
      const position = section.offset().top - $('.header').height() + 1

      if (el.closest('.header__dropdown').length) {
        el.closest('.header__dropdown').removeClass('header__dropdown--open')
      }

      $('html, body').animate({
        scrollTop: position
      }, 300)
    }
  })

  $(window).on('scroll', function () {
    const wScrolltop = $(window).scrollTop()
    const wScrollbottom = wScrolltop + $(window).height()

    // Load more on scroll
    $('.js-load-more-on-scroll:not(.is-loading)').each(function () {
      const panel = $(this)

      if (wScrolltop + $(window).height() * 2 >= panel.offset().top + panel.height()) {
        loadMore(panel)
      }
    })

    const container = $('.js-infinite-container')
    if (container.length) {
      const trigger = container.find('.js-search-results-trigger')
      const pageUrl = container.data('page-url')
      let currentPage = container.data('current-page')

      if (trigger.hasClass('infinite-loading__spinner--active')) {
        return
      }

      if (wScrollbottom > trigger.offset().top + trigger.outerHeight()) {
        if (pageUrl != undefined && pageUrl != null) {
          if (currentPage == undefined) {
            currentPage = 0
          }

          trigger.addClass('infinite-loading__spinner--active')

          currentPage = currentPage + 1
          container.data('current-page', currentPage)

          fetch(pageUrl.replace('%d', currentPage))
            .then(res => res.text())
            .then(html => {
              html = $(html)
              if (html.children().length > 0) {
                // Show more items
                html.children().appendTo(container)

                trigger.appendTo(container)
              } else {
                // No more items, don’t try to load more items
                container.data('page-url', null)
              }
              trigger.removeClass('infinite-loading__spinner--active')
            })
        }
      }
    }

    const autoHeaderBorder = $('.js-header--border')
    if (autoHeaderBorder.length) {
      if (wScrolltop > 1) {
        autoHeaderBorder.addClass('header--border')
      } else {
        autoHeaderBorder.removeClass('header--border')
      }
    }

    const homeAd = $('.js-article-ad-hide-on-scroll')
    if (homeAd.length) {
      const trigger = $('.js-ad-trigger')

      if (trigger.offset().top < wScrolltop) {
        homeAd.addClass('article-ad--hidden')
      } else {
        homeAd.removeClass('article-ad--hidden')
      }
    }

    hideSidebar()
    hideAd()
    hideTopHeader()
    hideHeader()
    appAnimation()
    fadeHeader()
  })

  carouselHomepageJournal()

  $(window).on('resize', function () {
    carouselArticlePreInit()
    relatedStyle()
    videoCarouselStyle()
    contentTopBorder()
    relatedGradient()
    videoCarouselGradient()
    hideSidebar()
    hideAd()
    hideHeader()
    sidebarHeightMobile()
    siebarScrollArea()
    journalImageHeight()
    scaleIssueTop()
    setMapHeight()
    buyButtonTooltip()
    overlayerBgPosition()
    appLayerSizes()
    topicBottomheight()
    sideAd()
    carouselHomepageJournal()
    adArticleHeight()

    fitFeaturedCarouselImages($('.featured-projects__carousel'))
  })

  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit()
    } else {
      loadScript()
    }
  } else {
    loadScript()
  }

  $(document)
    .on('click', '.clickable-block', function (e) {
      if ($(this).hasClass('js-open-overlayer')) {
        return
      }

      if ($(e.target).is('a')) {
        return
      }
      const href = $(this).data('href')
      if (!href) {
        return
      }

      const a = document.createElement('a')
      a.href = href
      if (a.hostname != location.hostname) {
        window.open(href)
        return false
      }

      location.href = href
      return false
    })

  $(document)
    .on('click', 'a', function (e) {
      if ($(this).closest('.js-open-overlayer').length || $(this).hasClass('.js-get-player')) {
        e.preventDefault()
        return
      }

      if ($(this).hasClass('js-subscribe-close')) {
        closeSubscribeInfo($(this))
      }

      if ((this.hostname != location.hostname || $(this).hasClass('open-in-new-tab') || $(this).attr('href').substr(0, 7) == '/files/') && $(this).attr('href').substr(0, 7) != 'mailto:') {
        this.blur()
        window.open(this.href)
        e.preventDefault()
      }
    })

  // $(window).on('keydown', function (e) {
  //   if (e.which == 71) {
  //     $('#grid').toggleClass('grid--hidden')
  //   }
  // })
})
