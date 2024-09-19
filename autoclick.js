// ==UserScript==
// @name         W-Coin Autoclicker
// @version      1.0
// @match        *://alohomora-bucket-fra1-prod-frontend-static.fra1.cdn.digitaloceanspaces.com/*
// @icon         https://img.cryptorank.io/coins/w_coin1718038816897.png
// @run-at       document-start
// @downloadURL  https://github.com/SalDuong/w/blob/main/autoclick.js
// @updateURL    https://github.com/SalDuong/w/blob/main/autoclick.js
// @homepage     https://github.com/SalDuong/w
// @grant        none
// ==/UserScript==

// Настройки задержек
const minDelay = 40;  
const maxDelay = 130; 
const energyThreshold = 25; 
const pauseDuration = 60000; 

function getRandomDelay(min, max) {
  return Math.random() * (max - min) + min;
}

function getCurrentEnergy() {
  const energyElement = document.querySelector('.claim-charger-count-text');
  if (energyElement) {
    const currentEnergy = parseInt(energyElement.textContent, 10);
    return currentEnergy;
  }
  return null;
}

function autoClicker() {
  const currentEnergy = getCurrentEnergy();

  if (currentEnergy !== null && currentEnergy < energyThreshold) {
    console.log(`Энергия ниже ${energyThreshold}, делаем паузу на ${pauseDuration} мс...`);
    setTimeout(autoClicker, pauseDuration);
    return;
  }

  const button = document.querySelector('button.claim-button');

  if (!button) {
    setTimeout(autoClicker, getRandomDelay(minDelay, maxDelay));
    return;
  }

  const rect = button.getBoundingClientRect();

  function getRandomCoordinate(min, max) {
    return Math.random() * (max - min) + min;
  }

  const x = getRandomCoordinate(rect.left, rect.right);
  const y = getRandomCoordinate(rect.top, rect.bottom);

  if (typeof TouchEvent === 'function') {
    try {
      const touchObj = new Touch({
        identifier: Date.now(),
        target: button,
        clientX: x,
        clientY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
      });

      const touchStartEvent = new TouchEvent("touchstart", {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [touchObj],
        changedTouches: [touchObj],
      });

      button.dispatchEvent(touchStartEvent);

      const delay = getRandomDelay(minDelay, maxDelay);
      setTimeout(() => {
        const touchEndEvent = new TouchEvent("touchend", {
          cancelable: true,
          bubbles: true,
          touches: [],
          targetTouches: [],
          changedTouches: [touchObj],
        });
        button.dispatchEvent(touchEndEvent);

        setTimeout(autoClicker, getRandomDelay(minDelay, maxDelay));

      }, delay);

    } catch (error) {
      console.error('Ошибка при создании события Touch:', error);
      setTimeout(autoClicker, getRandomDelay(minDelay, maxDelay));
    }
  } else {
    console.error('TouchEvent не поддерживается в этом браузере.');
    setTimeout(autoClicker, getRandomDelay(minDelay, maxDelay));
  }
}

setTimeout(autoClicker, 5000);
