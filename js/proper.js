var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate
  this.el = el
  this.loopNum = 0
  this.period = parseInt(period, 10) || 2000
  this.txt = ''
  this.tick()
  this.isDeleting = false
}

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length
  var fullTxt = this.toRotate[i]

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1)
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1)
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>'

  var that = this
  var delta = 300 - Math.random() * 100

  if (this.isDeleting) { delta /= 2 }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period
    this.isDeleting = true
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false
    this.loopNum++
    delta = 500
  }

  setTimeout(function () {
    that.tick()
  }, delta)
}

window.onload = function () {
  var elements = document.getElementsByClassName('txt-rotate')
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate')
    var period = elements[i].getAttribute('data-period')
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period)
    }
  }
  // INJECT CSS
  var css = document.createElement('style')
  css.type = 'text/css'
  css.innerHTML = '.txt-rotate > .wrap { border-right: 0.08em solid #666 }'
  document.body.appendChild(css)
}

// show more/less

function myFunction () {
  var dots = document.getElementById('dots')
  var moreText = document.getElementById('more')
  var btnText = document.getElementById('myBtn')

  if (dots.style.display === 'none') {
    dots.style.display = 'inline'
    btnText.innerHTML = 'Read more'
    moreText.style.display = 'none'
  } else {
    dots.style.display = 'none'
    btnText.innerHTML = 'Read less'
    moreText.style.display = 'inline'
  }
}

// btn1

function myFunction1 () {
  var dots = document.getElementById('dots1')
  var moreText = document.getElementById('more1')
  var btnText = document.getElementById('myBtn1')

  if (dots.style.display === 'none') {
    dots.style.display = 'inline'
    btnText.innerHTML = 'Read more'
    moreText.style.display = 'none'
  } else {
    dots.style.display = 'none'
    btnText.innerHTML = 'Read less'
    moreText.style.display = 'inline'
  }
}

jQuery(document).ready(function(){
	jQuery('.skillbar').each(function(){
		jQuery(this).find('.skillbar-bar').animate({
			width:jQuery(this).attr('data-percent')
		},6000);
	});
});