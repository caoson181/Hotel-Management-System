// Animated Verify OTP Form Logic
window.addEventListener('DOMContentLoaded', function() {
  var otpLabel = document.querySelector('#otpLabel'),
      otpInput = document.querySelector('#otp'),
      mySVG = document.querySelector('.svgContainer'),
      eyeL = document.querySelector('.eyeL'),
      eyeR = document.querySelector('.eyeR'),
      nose = document.querySelector('.nose'),
      mouth = document.querySelector('.mouth'),
      mouthBG = document.querySelector('.mouthBG'),
      mouthSmallBG = document.querySelector('.mouthSmallBG'),
      mouthMediumBG = document.querySelector('.mouthMediumBG'),
      mouthMaskPath = document.querySelector('#mouthMaskPath'),
      mouthOutline = document.querySelector('.mouthOutline'),
      tooth = document.querySelector('.tooth'),
      tongue = document.querySelector('.tongue'),
      chin = document.querySelector('.chin'),
      face = document.querySelector('.face'),
      eyebrow = document.querySelector('.eyebrow'),
      outerEarL = document.querySelector('.earL .outerEar'),
      outerEarR = document.querySelector('.earR .outerEar'),
      earHairL = document.querySelector('.earL .earHair'),
      earHairR = document.querySelector('.earR .earHair'),
      hair = document.querySelector('.hair');

  var svgCoords, inputCoords, screenCenter, mouthStatus = "small", eyeScale = 1;
  var eyeLCoords, eyeRCoords, noseCoords, mouthCoords;
  var activeElement = null;

  function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
      if (el.tagName == "BODY") {
        var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
        var yScroll = el.scrollTop || document.documentElement.scrollTop;
        xPos += (el.offsetLeft - xScroll + el.clientLeft);
        yPos += (el.offsetTop - yScroll + el.clientLeft);
      } else {
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      }
      el = el.offsetParent;
    }
    return { x: xPos, y: yPos };
  }

  function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y1 - y2, x1 - x2);
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function calculateFaceMove() {
    var inputCenterX = inputCoords.x + (otpInput.offsetWidth / 2);
    var inputCenterY = inputCoords.y + 25;

    var eyeLAngle = getAngle(eyeLCoords.x, eyeLCoords.y, inputCenterX, inputCenterY);
    var eyeRAngle = getAngle(eyeRCoords.x, eyeRCoords.y, inputCenterX, inputCenterY);
    var noseAngle = getAngle(noseCoords.x, noseCoords.y, inputCenterX, inputCenterY);
    var mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, inputCenterX, inputCenterY);

    var eyeLX = Math.cos(eyeLAngle) * 20;
    var eyeLY = Math.sin(eyeLAngle) * 10;
    var eyeRX = Math.cos(eyeRAngle) * 20;
    var eyeRY = Math.sin(eyeRAngle) * 10;
    var noseX = Math.cos(noseAngle) * 23;
    var noseY = Math.sin(noseAngle) * 10;
    var mouthX = Math.cos(mouthAngle) * 23;
    var mouthY = Math.sin(mouthAngle) * 10;
    var mouthR = Math.cos(mouthAngle) * 6;
    var chinX = mouthX * 0.8;
    var chinY = mouthY * 0.5;
    var faceX = mouthX * 0.3;
    var faceY = mouthY * 0.4;
    var faceSkew = Math.cos(mouthAngle) * 5;
    var eyebrowSkew = Math.cos(mouthAngle) * 25;
    var outerEarX = Math.cos(mouthAngle) * 4;
    var outerEarY = Math.cos(mouthAngle) * 5;
    var hairX = Math.cos(mouthAngle) * 6;

    TweenMax.to(eyeL, 1, { x: -eyeLX, y: -eyeLY, ease: Expo.easeOut });
    TweenMax.to(eyeR, 1, { x: -eyeRX, y: -eyeRY, ease: Expo.easeOut });
    TweenMax.to(nose, 1, { x: -noseX, y: -noseY, rotation: mouthR, transformOrigin: "center center", ease: Expo.easeOut });
    TweenMax.to(mouth, 1, { x: -mouthX, y: -mouthY, rotation: mouthR, transformOrigin: "center center", ease: Expo.easeOut });
    TweenMax.to(chin, 1, { x: -chinX, y: -chinY, scaleY: 1, ease: Expo.easeOut });
    TweenMax.to(face, 1, { x: -faceX, y: -faceY, skewX: -faceSkew, transformOrigin: "center top", ease: Expo.easeOut });
    TweenMax.to(eyebrow, 1, { x: -faceX, y: -faceY, skewX: -eyebrowSkew, transformOrigin: "center top", ease: Expo.easeOut });
    TweenMax.to(outerEarL, 1, { x: outerEarX, y: -outerEarY, ease: Expo.easeOut });
    TweenMax.to(outerEarR, 1, { x: outerEarX, y: outerEarY, ease: Expo.easeOut });
    TweenMax.to(earHairL, 1, { x: -outerEarX, y: -outerEarY, ease: Expo.easeOut });
    TweenMax.to(earHairR, 1, { x: -outerEarX, y: outerEarY, ease: Expo.easeOut });
    TweenMax.to(hair, 1, { x: hairX, scaleY: 1.2, transformOrigin: "center bottom", ease: Expo.easeOut });
  }

  function onOtpInput(e) {
    calculateFaceMove();
    var value = otpInput.value;

    if (value.length > 0) {
      if (mouthStatus == "small") {
        mouthStatus = "medium";
        TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, { morphSVG: mouthMediumBG, ease: Expo.easeOut });
        TweenMax.to(tooth, 1, { x: 0, y: 0, ease: Expo.easeOut });
        TweenMax.to(tongue, 1, { x: 0, y: 1, ease: Expo.easeOut });
        TweenMax.to([eyeL, eyeR], 1, { scaleX: 0.85, scaleY: 0.85, ease: Expo.easeOut });
        eyeScale = 0.85;
      }
    } else {
      mouthStatus = "small";
      TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, { morphSVG: mouthSmallBG, ease: Expo.easeOut });
      TweenMax.to(tooth, 1, { x: 0, y: 0, ease: Expo.easeOut });
      TweenMax.to(tongue, 1, { y: 0, ease: Expo.easeOut });
      TweenMax.to([eyeL, eyeR], 1, { scaleX: 1, scaleY: 1, ease: Expo.easeOut });
      eyeScale = 1;
    }
  }

  function onOtpFocus(e) {
    activeElement = "otp";
    e.target.parentElement.classList.add("focusWithText");
    calculateFaceMove();
    if (otpInput.value.length > 0) {
      TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 0.5, { morphSVG: mouthMediumBG, ease: Expo.easeOut });
      TweenMax.to([eyeL, eyeR], 0.5, { scaleX: 0.85, scaleY: 0.85, ease: Expo.easeOut });
    }
  }

  function onOtpBlur(e) {
    activeElement = null;
    setTimeout(function() {
      if (activeElement == "otp") {
        return;
      } else {
        if (e.target.value == "") {
          e.target.parentElement.classList.remove("focusWithText");
        }
        resetFace();
      }
    }, 100);
  }

  function onOtpLabelClick(e) {
    activeElement = "otp";
  }

  function resetFace() {
    TweenMax.to([eyeL, eyeR], 1, { x: 0, y: 0, ease: Expo.easeOut });
    TweenMax.to(nose, 1, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Expo.easeOut });
    TweenMax.to(mouth, 1, { x: 0, y: 0, rotation: 0, ease: Expo.easeOut });
    TweenMax.to(chin, 1, { x: 0, y: 0, scaleY: 1, ease: Expo.easeOut });
    TweenMax.to([face, eyebrow], 1, { x: 0, y: 0, skewX: 0, ease: Expo.easeOut });
    TweenMax.to([outerEarL, outerEarR, earHairL, earHairR, hair], 1, { x: 0, y: 0, scaleY: 1, ease: Expo.easeOut });
    mouthStatus = "small";
    TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, { morphSVG: mouthSmallBG, ease: Expo.easeOut });
    TweenMax.to([eyeL, eyeR], 1, { scaleX: 1, scaleY: 1, ease: Expo.easeOut });
    eyeScale = 1;
  }

  function startBlinking(delay) {
    if (delay) {
      delay = getRandomInt(delay);
    } else {
      delay = 1;
    }
    TweenMax.to([eyeL, eyeR], 0.1, {
      delay: delay,
      scaleY: 0,
      yoyo: true,
      repeat: 1,
      transformOrigin: "center center",
      onComplete: function() {
        startBlinking(12);
      }
    });
  }

  function initOtpForm() {
    if (!otpInput || !mySVG) {
      console.error("OTP input or SVG container not found");
      return;
    }

    svgCoords = getPosition(mySVG);
    inputCoords = getPosition(otpInput);
    screenCenter = svgCoords.x + (mySVG.offsetWidth / 2);
    
    eyeLCoords = { x: svgCoords.x + 84, y: svgCoords.y + 76 };
    eyeRCoords = { x: svgCoords.x + 113, y: svgCoords.y + 76 };
    noseCoords = { x: svgCoords.x + 97, y: svgCoords.y + 81 };
    mouthCoords = { x: svgCoords.x + 100, y: svgCoords.y + 100 };

    otpInput.addEventListener('focus', onOtpFocus);
    otpInput.addEventListener('blur', onOtpBlur);
    otpInput.addEventListener('input', onOtpInput);
    otpLabel.addEventListener('click', onOtpLabelClick);

    TweenMax.set(mouth, { transformOrigin: "center center" });
    startBlinking(5);
  }

  initOtpForm();
});
