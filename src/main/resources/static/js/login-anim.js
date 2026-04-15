// Animated Login Form Logic
window.addEventListener("DOMContentLoaded", function () {
  var usernameLabel =
      document.querySelector("#loginUsernameLabel") ||
      document.querySelector("#forgotEmailLabel"),
    username =
      document.querySelector("#loginUsername") ||
      document.querySelector("#forgotEmail"),
    passwordLabel = document.querySelector("#loginPasswordLabel"),
    password = document.querySelector("#loginPassword"),
    showPasswordCheck = document.querySelector("#showPasswordCheck"),
    showPasswordToggle = document.querySelector("#showPasswordToggle"),
    svgContainer = document.querySelector(".svgContainer"),
    svgRoot = document.querySelector(".mySVG"),
    twoFingers = svgRoot
      ? svgRoot.querySelector(".twoFingers")
      : document.querySelector(".twoFingers"),
    armL = svgRoot
      ? svgRoot.querySelector(".armL")
      : document.querySelector(".armL"),
    armR = svgRoot
      ? svgRoot.querySelector(".armR")
      : document.querySelector(".armR"),
    eyeL = svgRoot
      ? svgRoot.querySelector(".eyeL")
      : document.querySelector(".eyeL"),
    eyeR = svgRoot
      ? svgRoot.querySelector(".eyeR")
      : document.querySelector(".eyeR"),
    nose = svgRoot
      ? svgRoot.querySelector(".nose")
      : document.querySelector(".nose"),
    mouth = svgRoot
      ? svgRoot.querySelector(".mouth")
      : document.querySelector(".mouth"),
    mouthBG = svgRoot
      ? svgRoot.querySelector(".mouthBG")
      : document.querySelector(".mouthBG"),
    mouthSmallBG = svgRoot
      ? svgRoot.querySelector(".mouthSmallBG")
      : document.querySelector(".mouthSmallBG"),
    mouthMediumBG = svgRoot
      ? svgRoot.querySelector(".mouthMediumBG")
      : document.querySelector(".mouthMediumBG"),
    mouthLargeBG = svgRoot
      ? svgRoot.querySelector(".mouthLargeBG")
      : document.querySelector(".mouthLargeBG"),
    mouthMaskPath = svgRoot
      ? svgRoot.querySelector("#mouthMaskPath")
      : document.querySelector("#mouthMaskPath"),
    mouthOutline = svgRoot
      ? svgRoot.querySelector(".mouthOutline")
      : document.querySelector(".mouthOutline"),
    tooth = svgRoot
      ? svgRoot.querySelector(".tooth")
      : document.querySelector(".tooth"),
    tongue = svgRoot
      ? svgRoot.querySelector(".tongue")
      : document.querySelector(".tongue"),
    chin = svgRoot
      ? svgRoot.querySelector(".chin")
      : document.querySelector(".chin"),
    face = svgRoot
      ? svgRoot.querySelector(".face")
      : document.querySelector(".face"),
    eyebrow = svgRoot
      ? svgRoot.querySelector(".eyebrow")
      : document.querySelector(".eyebrow"),
    outerEarL = svgRoot
      ? svgRoot.querySelector(".earL .outerEar")
      : document.querySelector(".earL .outerEar"),
    outerEarR = svgRoot
      ? svgRoot.querySelector(".earR .outerEar")
      : document.querySelector(".earR .outerEar"),
    earHairL = svgRoot
      ? svgRoot.querySelector(".earL .earHair")
      : document.querySelector(".earL .earHair"),
    earHairR = svgRoot
      ? svgRoot.querySelector(".earR .earHair")
      : document.querySelector(".earR .earHair"),
    hair = svgRoot
      ? svgRoot.querySelector(".hair")
      : document.querySelector(".hair"),
    bodyBG = svgRoot
      ? svgRoot.querySelector(".bodyBGnormal")
      : document.querySelector(".bodyBGnormal"),
    bodyBGchanged = svgRoot
      ? svgRoot.querySelector(".bodyBGchanged")
      : document.querySelector(".bodyBGchanged");
  var activeElement,
    curUsernameIndex,
    screenCenter,
    svgCoords,
    usernameCoords,
    usernameScrollMax,
    chinMin = 0.5,
    dFromC = 0,
    mouthStatus = "small",
    blinking,
    eyeScale = 1,
    eyesCovered = false,
    showPasswordClicked = false;
  var eyeLCoords,
    eyeRCoords,
    noseCoords,
    mouthCoords,
    eyeLAngle,
    eyeLX,
    eyeLY,
    eyeRAngle,
    eyeRX,
    eyeRY,
    noseAngle,
    noseX,
    noseY,
    mouthAngle,
    mouthX,
    mouthY,
    mouthR,
    chinX,
    chinY,
    chinS,
    faceX,
    faceY,
    faceSkew,
    eyebrowSkew,
    outerEarX,
    outerEarY,
    hairX,
    hairS;

  function refreshFaceTrackingMetrics() {
    if (!svgContainer || !username) {
      return;
    }
    svgCoords = getPosition(svgContainer);
    usernameCoords = getPosition(username);
    screenCenter = svgCoords.x + svgContainer.offsetWidth / 2;

    var scaleX = svgContainer.offsetWidth / 200;
    var scaleY = svgContainer.offsetHeight / 200;
    eyeLCoords = { x: svgCoords.x + 84 * scaleX, y: svgCoords.y + 76 * scaleY };
    eyeRCoords = {
      x: svgCoords.x + 113 * scaleX,
      y: svgCoords.y + 76 * scaleY,
    };
    noseCoords = { x: svgCoords.x + 97 * scaleX, y: svgCoords.y + 81 * scaleY };
    mouthCoords = {
      x: svgCoords.x + 100 * scaleX,
      y: svgCoords.y + 100 * scaleY,
    };
    usernameScrollMax = username.clientWidth;
  }

  function calculateFaceMove(e) {
    if (!username) {
      return;
    }
    refreshFaceTrackingMetrics();
    var carPos = username.selectionEnd,
      div = document.createElement("div"),
      span = document.createElement("span"),
      copyStyle = getComputedStyle(username),
      caretCoords = {};
    if (carPos == null || carPos == 0) {
      carPos = username.value.length;
    }
    [].forEach.call(copyStyle, function (prop) {
      div.style[prop] = copyStyle[prop];
    });
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.pointerEvents = "none";
    div.style.whiteSpace = "pre";
    div.style.left = "0";
    div.style.top = "0";
    document.body.appendChild(div);
    div.textContent = username.value.substr(0, carPos);
    span.textContent = username.value.substr(carPos) || ".";
    div.appendChild(span);

    if (username.scrollWidth <= usernameScrollMax) {
      caretCoords = getPosition(span);
      dFromC = screenCenter - (caretCoords.x + usernameCoords.x);
      eyeLAngle = getAngle(
        eyeLCoords.x,
        eyeLCoords.y,
        usernameCoords.x + caretCoords.x,
        usernameCoords.y + 25,
      );
      eyeRAngle = getAngle(
        eyeRCoords.x,
        eyeRCoords.y,
        usernameCoords.x + caretCoords.x,
        usernameCoords.y + 25,
      );
      noseAngle = getAngle(
        noseCoords.x,
        noseCoords.y,
        usernameCoords.x + caretCoords.x,
        usernameCoords.y + 25,
      );
      mouthAngle = getAngle(
        mouthCoords.x,
        mouthCoords.y,
        usernameCoords.x + caretCoords.x,
        usernameCoords.y + 25,
      );
    } else {
      eyeLAngle = getAngle(
        eyeLCoords.x,
        eyeLCoords.y,
        usernameCoords.x + usernameScrollMax,
        usernameCoords.y + 25,
      );
      eyeRAngle = getAngle(
        eyeRCoords.x,
        eyeRCoords.y,
        usernameCoords.x + usernameScrollMax,
        usernameCoords.y + 25,
      );
      noseAngle = getAngle(
        noseCoords.x,
        noseCoords.y,
        usernameCoords.x + usernameScrollMax,
        usernameCoords.y + 25,
      );
      mouthAngle = getAngle(
        mouthCoords.x,
        mouthCoords.y,
        usernameCoords.x + usernameScrollMax,
        usernameCoords.y + 25,
      );
    }

    eyeLX = Math.cos(eyeLAngle) * 20;
    eyeLY = Math.sin(eyeLAngle) * 10;
    eyeRX = Math.cos(eyeRAngle) * 20;
    eyeRY = Math.sin(eyeRAngle) * 10;
    noseX = Math.cos(noseAngle) * 23;
    noseY = Math.sin(noseAngle) * 10;
    mouthX = Math.cos(mouthAngle) * 23;
    mouthY = Math.sin(mouthAngle) * 10;
    mouthR = Math.cos(mouthAngle) * 6;
    chinX = mouthX * 0.8;
    chinY = mouthY * 0.5;
    chinS = 1 - (dFromC * 0.15) / 100;
    if (chinS > 1) {
      chinS = 1 - (chinS - 1);
      if (chinS < chinMin) {
        chinS = chinMin;
      }
    }
    faceX = mouthX * 0.3;
    faceY = mouthY * 0.4;
    faceSkew = Math.cos(mouthAngle) * 5;
    eyebrowSkew = Math.cos(mouthAngle) * 25;
    outerEarX = Math.cos(mouthAngle) * 4;
    outerEarY = Math.cos(mouthAngle) * 5;
    hairX = Math.cos(mouthAngle) * 6;
    hairS = 1.2;

    TweenMax.to(eyeL, 1, { x: -eyeLX, y: -eyeLY, ease: Expo.easeOut });
    TweenMax.to(eyeR, 1, { x: -eyeRX, y: -eyeRY, ease: Expo.easeOut });
    TweenMax.to(nose, 1, {
      x: -noseX,
      y: -noseY,
      rotation: mouthR,
      transformOrigin: "center center",
      ease: Expo.easeOut,
    });
    TweenMax.to(mouth, 1, {
      x: -mouthX,
      y: -mouthY,
      rotation: mouthR,
      transformOrigin: "center center",
      ease: Expo.easeOut,
    });
    TweenMax.to(chin, 1, {
      x: -chinX,
      y: -chinY,
      scaleY: chinS,
      ease: Expo.easeOut,
    });
    TweenMax.to(face, 1, {
      x: -faceX,
      y: -faceY,
      skewX: -faceSkew,
      transformOrigin: "center top",
      ease: Expo.easeOut,
    });
    TweenMax.to(eyebrow, 1, {
      x: -faceX,
      y: -faceY,
      skewX: -eyebrowSkew,
      transformOrigin: "center top",
      ease: Expo.easeOut,
    });
    TweenMax.to(outerEarL, 1, {
      x: outerEarX,
      y: -outerEarY,
      ease: Expo.easeOut,
    });
    TweenMax.to(outerEarR, 1, {
      x: outerEarX,
      y: outerEarY,
      ease: Expo.easeOut,
    });
    TweenMax.to(earHairL, 1, {
      x: -outerEarX,
      y: -outerEarY,
      ease: Expo.easeOut,
    });
    TweenMax.to(earHairR, 1, {
      x: -outerEarX,
      y: outerEarY,
      ease: Expo.easeOut,
    });
    TweenMax.to(hair, 1, {
      x: hairX,
      scaleY: hairS,
      transformOrigin: "center bottom",
      ease: Expo.easeOut,
    });

    document.body.removeChild(div);
  }

  function onUsernameInput(e) {
    calculateFaceMove(e);
    var value = username.value;
    curUsernameIndex = value.length;

    if (curUsernameIndex > 0) {
      if (mouthStatus == "small") {
        mouthStatus = "medium";
        TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, {
          morphSVG: mouthMediumBG,
          shapeIndex: 8,
          ease: Expo.easeOut,
        });
        TweenMax.to(tooth, 1, { x: 0, y: 0, ease: Expo.easeOut });
        TweenMax.to(tongue, 1, { x: 0, y: 1, ease: Expo.easeOut });
        TweenMax.to([eyeL, eyeR], 1, {
          scaleX: 0.85,
          scaleY: 0.85,
          ease: Expo.easeOut,
        });
        eyeScale = 0.85;
      }
      mouthStatus = "medium";
      TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, {
        morphSVG: mouthMediumBG,
        ease: Expo.easeOut,
      });
      TweenMax.to(tooth, 1, { x: 0, y: 0, ease: Expo.easeOut });
      TweenMax.to(tongue, 1, { x: 0, y: 1, ease: Expo.easeOut });
      TweenMax.to([eyeL, eyeR], 1, {
        scaleX: 0.85,
        scaleY: 0.85,
        ease: Expo.easeOut,
      });
      eyeScale = 0.85;
    } else {
      mouthStatus = "small";
      TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, {
        morphSVG: mouthSmallBG,
        shapeIndex: 9,
        ease: Expo.easeOut,
      });
      TweenMax.to(tooth, 1, { x: 0, y: 0, ease: Expo.easeOut });
      TweenMax.to(tongue, 1, { y: 0, ease: Expo.easeOut });
      TweenMax.to([eyeL, eyeR], 1, {
        scaleX: 1,
        scaleY: 1,
        ease: Expo.easeOut,
      });
      eyeScale = 1;
    }
  }

  function onUsernameFocus(e) {
    activeElement = "username";
    e.target.parentElement.classList.add("focusWithText");
    onUsernameInput();
  }

  function onUsernameBlur(e) {
    activeElement = null;
    setTimeout(function () {
      if (activeElement == "username") {
      } else {
        if (e.target.value == "") {
          e.target.parentElement.classList.remove("focusWithText");
        }
        resetFace();
      }
    }, 100);
  }

  function onUsernameLabelClick(e) {
    activeElement = "username";
  }

  function onPasswordFocus(e) {
    activeElement = "password";
    if (!eyesCovered) {
      coverEyes();
    }
  }

  function onPasswordBlur(e) {
    activeElement = null;
    setTimeout(function () {
      if (activeElement == "toggle" || activeElement == "password") {
      } else {
        uncoverEyes();
      }
    }, 100);
  }

  function onPasswordToggleFocus(e) {
    activeElement = "toggle";
    if (!eyesCovered) {
      coverEyes();
    }
  }

  function onPasswordToggleBlur(e) {
    activeElement = null;
    if (!showPasswordClicked) {
      setTimeout(function () {
        if (activeElement == "password" || activeElement == "toggle") {
        } else {
          uncoverEyes();
        }
      }, 100);
    }
  }

  function onPasswordToggleMouseDown(e) {
    showPasswordClicked = true;
  }

  function onPasswordToggleMouseUp(e) {
    showPasswordClicked = false;
  }

  function onPasswordToggleChange(e) {
    setTimeout(function () {
      if (e.target.checked) {
        password.type = "text";
        spreadFingers();
      } else {
        password.type = "password";
        closeFingers();
      }
    }, 100);
  }

  function onPasswordToggleClick(e) {
    e.target.focus();
  }

  function spreadFingers() {
    TweenMax.to(twoFingers, 0.35, {
      transformOrigin: "bottom left",
      rotation: 30,
      x: -9,
      y: -2,
      ease: Power2.easeInOut,
    });
  }

  function closeFingers() {
    TweenMax.to(twoFingers, 0.35, {
      transformOrigin: "bottom left",
      rotation: 0,
      x: 0,
      y: 0,
      ease: Power2.easeInOut,
    });
  }

  function coverEyes() {
    TweenMax.killTweensOf([armL, armR]);
    TweenMax.set([armL, armR], { visibility: "visible" });
    TweenMax.to(armL, 0.45, { x: -93, y: 10, rotation: 0, ease: Quad.easeOut });
    TweenMax.to(armR, 0.45, {
      x: -93,
      y: 10,
      rotation: 0,
      ease: Quad.easeOut,
      delay: 0.1,
    });
    TweenMax.to(bodyBG, 0.45, { morphSVG: bodyBGchanged, ease: Quad.easeOut });
    eyesCovered = true;
  }

  function uncoverEyes() {
    TweenMax.killTweensOf([armL, armR]);
    TweenMax.to(armL, 1.35, { y: 220, ease: Quad.easeOut });
    TweenMax.to(armL, 1.35, { rotation: 105, ease: Quad.easeOut, delay: 0.1 });
    TweenMax.to(armR, 1.35, { y: 220, ease: Quad.easeOut });
    TweenMax.to(armR, 1.35, {
      rotation: -105,
      ease: Quad.easeOut,
      delay: 0.1,
      onComplete: function () {
        TweenMax.set([armL, armR], { visibility: "hidden" });
      },
    });
    TweenMax.to(bodyBG, 0.45, { morphSVG: bodyBG, ease: Quad.easeOut });
    eyesCovered = false;
  }

  function resetFace() {
    TweenMax.to([eyeL, eyeR], 1, { x: 0, y: 0, ease: Expo.easeOut });
    TweenMax.to(nose, 1, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      ease: Expo.easeOut,
    });
    TweenMax.to(mouth, 1, { x: 0, y: 0, rotation: 0, ease: Expo.easeOut });
    TweenMax.to(chin, 1, { x: 0, y: 0, scaleY: 1, ease: Expo.easeOut });
    TweenMax.to([face, eyebrow], 1, {
      x: 0,
      y: 0,
      skewX: 0,
      ease: Expo.easeOut,
    });
    TweenMax.to([outerEarL, outerEarR, earHairL, earHairR, hair], 1, {
      x: 0,
      y: 0,
      scaleY: 1,
      ease: Expo.easeOut,
    });
  }

  function startBlinking(delay) {
    if (delay) {
      delay = getRandomInt(delay);
    } else {
      delay = 1;
    }
    blinking = TweenMax.to([eyeL, eyeR], 0.1, {
      delay: delay,
      scaleY: 0,
      yoyo: true,
      repeat: 1,
      transformOrigin: "center center",
      onComplete: function () {
        startBlinking(12);
      },
    });
  }

  function stopBlinking() {
    blinking.kill();
    blinking = null;
    TweenMax.set([eyeL, eyeR], { scaleY: eyeScale });
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function getAngle(x1, y1, x2, y2) {
    var angle = Math.atan2(y1 - y2, x1 - x2);
    return angle;
  }

  function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
      if (el.tagName == "BODY") {
        var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
        var yScroll = el.scrollTop || document.documentElement.scrollTop;

        xPos += el.offsetLeft - xScroll + el.clientLeft;
        yPos += el.offsetTop - yScroll + el.clientLeft;
      } else {
        xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
        yPos += el.offsetTop - el.scrollTop + el.clientTop;
      }

      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos,
    };
  }

  function isMobileDevice() {
    var check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a,
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4),
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  function initLoginForm() {
    refreshFaceTrackingMetrics();

    if (username) {
      username.addEventListener("focus", onUsernameFocus);
      username.addEventListener("blur", onUsernameBlur);
      username.addEventListener("input", onUsernameInput);
    }
    if (usernameLabel) {
      usernameLabel.addEventListener("click", onUsernameLabelClick);
    }
    if (password) {
      password.addEventListener("focus", onPasswordFocus);
      password.addEventListener("blur", onPasswordBlur);
    }
    if (showPasswordCheck) {
      showPasswordCheck.addEventListener("change", onPasswordToggleChange);
      showPasswordCheck.addEventListener("focus", onPasswordToggleFocus);
      showPasswordCheck.addEventListener("blur", onPasswordToggleBlur);
      showPasswordCheck.addEventListener("click", onPasswordToggleClick);
    }
    if (showPasswordToggle) {
      showPasswordToggle.addEventListener("mouseup", onPasswordToggleMouseUp);
      showPasswordToggle.addEventListener(
        "mousedown",
        onPasswordToggleMouseDown,
      );
    }
    TweenMax.set(armL, {
      x: -93,
      y: 220,
      rotation: 105,
      transformOrigin: "top left",
    });
    TweenMax.set(armR, {
      x: -93,
      y: 220,
      rotation: -105,
      transformOrigin: "top right",
    });
    TweenMax.set(mouth, { transformOrigin: "center center" });
    startBlinking(5);
    if (username) {
      usernameScrollMax = username.clientWidth;
    }
    if (isMobileDevice()) {
      if (password) {
        password.type = "text";
      }
      if (showPasswordCheck) {
        showPasswordCheck.checked = true;
      }
      TweenMax.set(twoFingers, {
        transformOrigin: "bottom left",
        rotation: 30,
        x: -9,
        y: -2,
        ease: Power2.easeInOut,
      });
    }
    window.addEventListener("resize", refreshFaceTrackingMetrics);
    console.clear();
  }

  initLoginForm();
});
