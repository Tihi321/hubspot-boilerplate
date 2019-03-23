class GeneralHelper {

  domReady = (callback) => {
    return document.readyState === 'interactive' || document.readyState === 'complete' ? callback() : document.addEventListener('DOMContentLoaded', callback);
  }

  getBodyActiveClass = (isIphone = false) => {
    let activeClass = '';

    // For Iphone and iPad check and add different style
    if (isIphone) {
      activeClass = 'u-no-scroll-ios';
    } else {
      activeClass = 'u-no-scroll';
    }

    return activeClass;
  }

  isValidURL = (str) => {
    return (/^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/).test(str);
  }

  classList = (elt) => {
    return {
      toggle(c) {
        elt.classList.toggle(c); return this;
      },
      add(c) {
        elt.classList.add(c); return this;
      },
      remove(c) {
        elt.classList.remove(c); return this;
      },
    };

  }

  youTubeGetID(url) {
    const urlArray = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (urlArray[2]) {
      const idArray = urlArray[2].split(/[^0-9a-z_-]/i);
      return idArray[0];
    }

    return false;
  }

}

const generalHelper = new GeneralHelper();
Object.freeze(generalHelper);

export default generalHelper;
