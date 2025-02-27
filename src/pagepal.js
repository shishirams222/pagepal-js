class TooltipModal {
  closeBtn;

  tooltipBody;

  tooltipContent;

  nextBtn;

  footer;

  createBtnElement(btnClass = [], callback) {
    const btnElement = document.createElement('button');
    btnElement.type = 'button';

    btnElement.classList.add(...btnClass);
    btnElement.addEventListener('click', (event) => {
      event.stopPropagation();
      callback();
    });
    return btnElement;
  };

  constructor(onNextCallback, onCloseCallback, onSkipCallback) {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.classList.add('tooltip-modal');
    this.tooltipElement.setAttribute('role', 'alertdialog');
    this.tooltipElement.ariaLabel = 'Spender onboarding tooltips';
    this.tooltipElement.ariaModal = true;
  
    this.closeBtnIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.closeBtnIcon.setAttribute('width', '40');
    this.closeBtnIcon.setAttribute('height', '40');
    this.closeBtnIcon.setAttribute('viewBox', '0 0 40 40');
    this.closeBtnIcon.classList.add('icon-close');
    this.closeBtnIcon.innerHTML = `<path d='M22.3505 20.0008L32.8338 9.51756C33.4838 8.86756 33.4838 7.81756 32.8338 7.16756C32.1838 6.51756 31.1338 6.51756 30.4838 7.16756L20.0005 17.6508L9.51719 7.15089C8.86719 6.50089 7.81719 6.50089 7.16719 7.15089C6.51719 7.80089 6.51719 8.85089 7.16719 9.50089L17.6505 20.0008L7.16719 30.4841C6.51719 31.1341 6.51719 32.1841 7.16719 32.8341C7.48385 33.1675 7.90052 33.3341 8.33385 33.3341C8.76719 33.3341 9.18385 33.1675 9.51719 32.8508L20.0005 22.3508L30.4838 32.8341C30.8172 33.1675 31.2338 33.3341 31.6672 33.3341C32.1005 33.3341 32.5172 33.1675 32.8505 32.8508C33.5005 32.2008 33.5005 31.1508 32.8505 30.5008L22.3505 20.0008Z'/>`;

    this.closeBtn = this.createBtnElement(['close-btn'], onCloseCallback);
    this.closeBtn.ariaLabel = 'Close';
    this.closeBtn.append(this.closeBtnIcon);

    this.tooltipBody = document.createElement('div');
    this.tooltipBody.classList.add('tooltip-body');

    this.tooltipContent = document.createElement('div');
    this.tooltipContent.classList.add('tooltip-content');
    // Adding role document to inform screen readers that this is the content of the tooltip
    this.tooltipContent.setAttribute('role', 'document');
    // Adding tab index so that the screen reader can focus on the content to read it
    this.tooltipContent.tabIndex = 0;

    this.tooltipBody.append(this.tooltipContent);
    this.tooltipBody.append(this.closeBtn);
    this.tooltipElement.append(this.tooltipBody);

    // CTAs
    this.ctaBlock = document.createElement('div');
    this.skipBtn = this.createBtnElement(['btn-skip'], onSkipCallback);
    this.skipBtn.textContent = 'Skip';
    this.ctaBlock.append(this.skipBtn);
    this.nextBtn = this.createBtnElement(['btn', 'btn-primary'], onNextCallback);
    this.ctaBlock.append(this.nextBtn);

    // For showing `3 of 5`
    this.progressIndicator = document.createElement('span');
    this.progressIndicator.classList.add('progress-indicator');
    // Marking the progress indicator as a live region for announcing the tour progress to the screen reader
    this.progressIndicator.ariaLive = 'polite';

    this.footer = document.createElement('div');
    this.footer.classList.add('footer');
    this.footer.append(this.progressIndicator);
    this.footer.append(this.ctaBlock);

    this.tooltipArrow = document.createElement('div');
    this.tooltipArrow.classList.add('walkthrough-arrow');

    this.tooltipElement.append(this.footer);
    this.tooltipElement.append(this.tooltipArrow);
    document.body.append(this.tooltipElement);
  };

  setTooltipContent (value) {
    this.tooltipContent.innerHTML = value;
  };

  setNextBtnContent (value) {
    this.nextBtn.textContent = value;
  };

  setProgressIndicator (value) {
    this.progressIndicator.innerText = value;
  };

  setSkipVisibility (showSkip) {
    if (!showSkip) {
      this.skipBtn.classList.add('hide');
    }
  };

  show(value = true) {
    this.tooltipElement.classList.toggle('show', value);
  };

  remove() {
    this.tooltipElement.remove();
  };

  position(tooltipPosition = 'bottom', elementRect) {
    const offset = 24;
    const tooltipWidth = this.tooltipElement.clientWidth;
    const tooltipHeight = this.tooltipElement.clientHeight;

    let top, left;
    let arrowClass = '';
    let alignClass = '';

    const setPosition = (topValue, leftValue, arrow, align) => {
      top = topValue;
      left = leftValue;
      arrowClass = arrow;
      alignClass = align;
    };

    const setClasses = (arrow, align) => {
      this.tooltipArrow.className = '';
      this.tooltipArrow.classList.add('walkthrough-arrow', `walkthrough-arrow-side-${arrow}`, `walkthrough-arrow-align-${align}`);
    };

    // TODO: check if there is enough space to show tooltip on all the sides
    const isAvailableSpaceSufficient = (space) => space >= tooltipHeight + offset;

    switch (tooltipPosition) {
      case 'top':
        if (isAvailableSpaceSufficient(elementRect.top)) {
          setPosition(elementRect.top - tooltipHeight - offset, elementRect.left + (elementRect.width - tooltipWidth) / 2, 'top', 'center');
        } else if (isAvailableSpaceSufficient(window.innerHeight - elementRect.bottom)) {
          setPosition(elementRect.bottom + offset, elementRect.left + (elementRect.width - tooltipWidth) / 2, 'bottom', 'center');
        } else if (isAvailableSpaceSufficient(window.innerWidth - elementRect.right)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.right + offset, 'right', 'center');
        } else if (isAvailableSpaceSufficient(elementRect.left)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.left - tooltipWidth - offset, 'left', 'center');
        }
        break;
      case 'bottom':
        if (isAvailableSpaceSufficient(window.innerHeight - elementRect.bottom)) {
          setPosition(elementRect.bottom + offset, elementRect.left + (elementRect.width - tooltipWidth) / 2, 'bottom', 'center');
        } else if (isAvailableSpaceSufficient(elementRect.top)) {
          setPosition(elementRect.top - tooltipHeight - offset, elementRect.left + (elementRect.width - tooltipWidth) / 2, 'top', 'center');
        } else if (isAvailableSpaceSufficient(window.innerWidth - elementRect.right)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.right + offset, 'right', 'center');
        } else if (isAvailableSpaceSufficient(elementRect.left)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.left - tooltipWidth - offset, 'left', 'center');
        }
        break;
      case 'right':
        if (isAvailableSpaceSufficient(window.innerWidth - elementRect.right)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.right + offset, 'right', 'center');
        } else if (isAvailableSpaceSufficient(elementRect.left)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.left - tooltipWidth - offset, 'left', 'center');
        } else if (isAvailableSpaceSufficient(window.innerHeight - elementRect.bottom)) {
          setPosition(elementRect.bottom + offset, elementRect.left + (elementRect.width - tooltipWidth) / 2, 'bottom', 'center');
        } else if (isAvailableSpaceSufficient(elementRect.top)) {
          setPosition(elementRect.top - tooltipHeight - offset, elementRect.left + (elementRect.width - tooltipWidth) / 2, 'top', 'center');
        }
        break;
      case 'left':
        if (isAvailableSpaceSufficient(elementRect.left)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.left - tooltipWidth - offset, 'left', 'center');
        } else if (isAvailableSpaceSufficient(window.innerWidth - elementRect.right)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.right + offset, 'right', 'center');
        } else if (isAvailableSpaceSufficient(window.innerHeight - elementRect.bottom)) {
          setPosition(elementRect.bottom + offset, elementRect.left + (elementRect.width - tooltipWidth) / 2, 'bottom', 'center');
        } else if (isAvailableSpaceSufficient(elementRect.top)) {
          setPosition(elementRect.top - tooltipHeight - offset, elementRect.left + (elementRect.width - tooltipWidth) / 2, 'top', 'center');
        }
        break;
      case 'bottom-left':
        if (isAvailableSpaceSufficient(window.innerHeight - elementRect.bottom)) {
          setPosition(elementRect.bottom + offset, elementRect.left - offset / 2, 'bottom', 'start');
        } else if (isAvailableSpaceSufficient(elementRect.top)) {
          setPosition(elementRect.top - tooltipHeight - offset, elementRect.left - offset / 2, 'top', 'start');
        } else if (isAvailableSpaceSufficient(elementRect.left)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.left - tooltipWidth - offset, 'left', 'center');
        } else if (isAvailableSpaceSufficient(window.innerWidth - elementRect.right)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.right + offset, 'right', 'center');
        }
        break;
      case 'bottom-right':
        if (isAvailableSpaceSufficient(window.innerHeight - elementRect.bottom)) {
          setPosition(elementRect.bottom + offset, elementRect.right - tooltipWidth + offset / 2, 'bottom', 'end');
        } else if (isAvailableSpaceSufficient(elementRect.top)) {
          setPosition(elementRect.top - tooltipHeight - offset, elementRect.right - tooltipWidth + offset / 2, 'top', 'end');
        } else if (isAvailableSpaceSufficient(elementRect.left)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.left - tooltipWidth - offset, 'left', 'center');
        } else if (isAvailableSpaceSufficient(window.innerWidth - elementRect.right)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.right + offset, 'right', 'center');
        }
        break;
      case 'top-left':
        if (isAvailableSpaceSufficient(elementRect.top)) {
          setPosition(elementRect.top - tooltipHeight - offset, elementRect.left - offset / 2, 'top', 'start');
        } else if (isAvailableSpaceSufficient(window.innerHeight - elementRect.bottom)) {
          setPosition(elementRect.bottom + offset, elementRect.left - offset / 2, 'bottom', 'start');
        } else if (isAvailableSpaceSufficient(elementRect.left)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.left - tooltipWidth - offset, 'left', 'center');
        } else if (isAvailableSpaceSufficient(window.innerWidth - elementRect.right)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.right + offset, 'right', 'center');
        }
        break;
      case 'top-right':
        if (isAvailableSpaceSufficient(elementRect.top)) {
          setPosition(elementRect.top - tooltipHeight - offset, elementRect.right - tooltipWidth + offset / 2, 'top', 'end');
        } else if (isAvailableSpaceSufficient(window.innerHeight - elementRect.bottom)) {
          setPosition(elementRect.bottom + offset, elementRect.right - tooltipWidth + offset / 2, 'bottom', 'end');
        } else if (isAvailableSpaceSufficient(elementRect.left)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.left - tooltipWidth - offset, 'left', 'center');
        } else if (isAvailableSpaceSufficient(window.innerWidth - elementRect.right)) {
          setPosition(elementRect.top + (elementRect.height - tooltipHeight) / 2, elementRect.right + offset, 'right', 'center');
        }
        break;
    }

    setClasses(arrowClass, alignClass);
    this.tooltipElement.style.setProperty('top', `${top}px`);
    this.tooltipElement.style.setProperty('left', `${left}px`);
  };

}

class PagePal {
  // Variable to hold the timeout ID
  scrollTimeout;

  constructor(config) {
    this.config = config;
    this.steps = config.steps;
    this.scrollParent = config.scrollParent || window;
    this.showBackdrop = config.showBackdrop;
    // callbacks for Next, Skip, Close and Finish (Got it)
    this.onNext = config.onNext;
    this.onSkip = config.onSkip;
    this.onClose = config.onClose;
    this.onFinish = config.onFinish;
    this.onWalkthroughShown = config.onWalkthroughShown;
  }

  generateStageSvgPathString(stage) {
    const windowX = window.innerWidth;
    const windowY = window.innerHeight;
  
    const stagePadding = 12;
    const stageRadius = 4;
  
    const stageWidth = stage.width + stagePadding * 2;
    const stageHeight = stage.height + stagePadding * 2;
  
    // prevent glitches when stage is too small for radius
    const limitedRadius = Math.min(stageRadius, stageWidth / 2, stageHeight / 2);
  
    // no value below 0 allowed + round down
    const normalizedRadius = Math.floor(Math.max(limitedRadius, 0));
  
    const highlightBoxX = stage.x - stagePadding + normalizedRadius;
    const highlightBoxY = stage.y - stagePadding;
    const highlightBoxWidth = stageWidth - normalizedRadius * 2;
    const highlightBoxHeight = stageHeight - normalizedRadius * 2;

    this.highlightContainer.setAttribute('viewBox', `0 0 ${windowX} ${windowY}`);
    const pathValue = `M${windowX},0L0,0L0,${windowY}L${windowX},${windowY}L${windowX},0Z 
    M${highlightBoxX},${highlightBoxY} h${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},${normalizedRadius} v${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},${normalizedRadius} h-${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},-${normalizedRadius} v-${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},-${normalizedRadius} z`;
    return pathValue;
  }

  createHighlightContainer(showBackdrop) {
    const windowX = window.innerWidth;
    const windowY = window.innerHeight;
    // highlight element
    const highlightSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    highlightSvg.classList.add('highlight-container');
    highlightSvg.setAttribute('viewBox', `0 0 ${windowX} ${windowY}`);
    highlightSvg.setAttribute('xmlSpace', 'preserve');
    highlightSvg.setAttribute('xmlnsXlink', 'http://www.w3.org/1999/xlink');
    highlightSvg.setAttribute('version', '1.1');
    highlightSvg.setAttribute('preserveAspectRatio', 'xMinYMin slice');
    highlightSvg.style.fillRule = 'evenodd';
    highlightSvg.style.clipRule = 'evenodd';
    highlightSvg.style.strokeLinejoin = 'round';
    highlightSvg.style.strokeMiterlimit = '2';
    highlightSvg.style.zIndex = '9000';
    highlightSvg.style.position = 'fixed';
    highlightSvg.style.top = '0';
    highlightSvg.style.left = '0';
    highlightSvg.style.width = '100%';
    highlightSvg.style.height = '100%';

    // svg's path element
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const backDropBg = showBackdrop ? 'rgba(1, 23, 40, 0.6)' : 'rgba(0, 0, 0, 0)';
    pathElement.style.fill = backDropBg;
    pathElement.style.pointerEvents = 'auto';
    pathElement.style.cursor = 'auto';

    // skip the walkthrough clicking anywhere on backdrop
    highlightSvg.addEventListener('click', this.onSkipCallback);
    highlightSvg.appendChild(pathElement);
    document.body.append(highlightSvg);

    return highlightSvg;
  };

  updateTooltipPosition(defaultPosition, elementRect) {
    this.modal.position(defaultPosition, elementRect);
  }

  updateHighlightContainerPosition(elementRect) {
    const pathElement = this.highlightContainer.firstElementChild;
    if (pathElement?.tagName !== 'path') {
      console.error('no path element found in stage svg');
    }

    pathElement.setAttribute('d', this.generateStageSvgPathString(elementRect));
  }

  showCurrentStep() {
    if (!this.currentStep.element) {
      console.error('Element not provided to show tooltip');
      this.finish();
      return;
    }

    if (!document.body.contains(this.currentStep.element)) {
      console.error('Element is not present in current page');
      this.finish();
      return;
    }

    // set info and contents that needs to be shown in tooltip
    this.modal.setTooltipContent(this.currentStep.tooltipContent);
    this.modal.setNextBtnContent(this.currentStepIndex < this.steps.length - 1 ? 'Next' : 'Got It');
    if (this.steps.length > 1) {
      // show progress count only if there are multiple steps
      this.modal.setProgressIndicator(`${this.currentStepIndex + 1} of ${this.steps.length}`);
    }
    this.modal.setSkipVisibility(this.currentStep.showSkip);
    this.modal.tooltipContent.setAttribute('aria-labelledby', this.currentStep.element.id);

    this.modal.show();
    this.focusModal();

    // Once the first step is actually shown, inform parent that tour tip was shown successfully
    if (this.currentStepIndex === 0) {
      this.onWalkthroughShownCallBack();
    }
    // get current element's position
    const rect = this.currentStep.element.getBoundingClientRect();
    // update tooltip's position wrt the element's position
    this.updateTooltipPosition(this.currentStep.defaultPosition, rect);
    this.highlightContainer.classList.remove('hide');
    this.highlightContainer.classList.add('show');
    this.updateHighlightContainerPosition(rect);

    // scroll to the element
    this.currentStep.element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });

  }

  onNextCallback = () => {
    this.highlightContainer.classList.remove('show');
    this.modal.show(false);
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.steps.length) {
      this.finish();
      // if parent has skip callback specified
      if (this.onFinish) {
        this.onFinish();
      }
    } else {
      this.listenToScrollEvent();
      this.showCurrentStep();
      // if parent has next callback specified
      if (this.onNext) {
        this.onNext(this.currentStepIndex);
      }
    }
  };

  onCloseCallback = () => {
    this.finish();
    // if parent has close callback specified
    if (this.onClose) {
      this.onClose();
    }
  };

  onSkipCallback = () => {
    this.finish();
    // if parent has skip callback specified
    if (this.onSkip) {
      this.onSkip();
    }
  };

  onWalkthroughShownCallBack = () => {
    if (this.onWalkthroughShown) {
      this.onWalkthroughShown();
    }
  };

  handleOnWindowClick = (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.parentElement.tagName === 'BUTTON') {
      // If user clicks on any button, that is present inside the highlighted area, then finish the walkthrough.
      // This won't work if the button click handler stops the event propagation
      this.finish();
    }
  };

  handlePositionChange = (event) => {
    const rect = this.currentStep.element.getBoundingClientRect();
    this.updateTooltipPosition(this.currentStep.defaultPosition, rect);
    this.updateHighlightContainerPosition(rect);
  };

  debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
  };

  handlePositionChangeWithDebounce = this.debounce(() => {
    this.handlePositionChange();
    /**
     * Please do not remove 300 from here. Reason: The sidenav takes 200ms to show/hide based on window resize
     * So if there is a tooltip that is shown and at that time window resize happens in such a way where sidenav is shown or hidden
     * then after that event, positioning should happen.
     */
  }, 300);

  listenToScrollEvent = () => {

    if (this.currentStep.scrollParent) {
      this.scrollParent = this.currentStep.scrollParent;
    } else {
      const fallbackScrollParent = this.config.scrollParent || window;
      if (this.scrollParent !== fallbackScrollParent) {
        this.scrollParent = fallbackScrollParent;
      }
    }

    // TODO: handlePositionChange is getting called multiple times on scroll. Need to optimize
    this.scrollParent.addEventListener('scroll', this.handlePositionChange)
  }

  /**
  * @returns A list of all the focusable elements in the tooltip modal
  */
  getFocusableElements = () => {
    return this.modal.tooltipElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  };

  /**
  * Focuses the first element in the tooltip modal.
  * If no focusable elements are found in the modal, then the modal itself is focused.
  */
  focusModal = () => {
    const focusableElements = this.getFocusableElements();
    const firstFocusableElement = focusableElements[0];

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    } else {
      this.modal.tooltipElement.focus();
    }
  };

  /**
  * @param {KeyboardEvent} event
  * Traps the focus inside the tooltip modal
  */
  trapFocusInsideModal = (event) => {
    const focusableElements = this.getFocusableElements();

    if (event.key === 'Tab' && focusableElements.length === 0) {
      // In case there are no focusable elements in the modal, prevent the default behaviour of tab to trap focus
      event.preventDefault();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
  
    if (event.key === 'Tab' && !event.shiftKey) {
      // If the last focusable element is focused, move focus to the first one
      if (document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    } else if (event.key === 'Tab' && event.shiftKey) {
      // If the first focusable element is focused, move focus to the last one
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
    } else if (event.key === 'Escape') {
      // On escape user can close and escape focus trap
      this.onCloseCallback();
    }
  };

  start(currentStepIndex) {
    this.currentStepIndex = currentStepIndex || 0;
    // initialize tooltip modal
    this.modal = new TooltipModal(
      this.onNextCallback,
      this.onCloseCallback,
      this.onSkipCallback,
      this.currentStep.showSkip
    );

    
    this.listenToScrollEvent();
    this.highlightContainer = this.createHighlightContainer(this.showBackdrop);

    // Add keydown event listener to trap focus inside the tooltip modal
    window.addEventListener('keydown', this.trapFocusInsideModal);

    window.addEventListener('click', this.handleOnWindowClick);

    // on window resize, re-position the tooltip and backdrop elements
    // TODO: handlePositionChange is getting called multiple times on resize. Need to optimize
    window.addEventListener('resize', this.handlePositionChangeWithDebounce);

    /*
     * TODO shishi: to handle item scroll out of the page
     * const observer = new IntersectionObserver(entries => {
     *   entries.forEach(entry => {
     *     if (entry.isIntersecting) {
     *       console.log('Element is in view!');
     *     } else {
     *       console.log('Element is out of view!');
     *     }
     *   });
     * });
     */

    /*
     * const targetElement = this.currentStep.element;
     * observer.observe(targetElement, observerOptions);
     */

    // show tooltip for current step
    this.showCurrentStep();
  }

  finish() {
    if (this.modal) {
      this.modal.remove();
    }
    
    if (this.highlightContainer) {
      this.highlightContainer.remove();
    }

    this.scrollParent.removeEventListener('scroll', this.handlePositionChange);

    const scrollElements = this.steps.filter(step => step.scrollParent);
    for (const element of scrollElements) {
      element.scrollParent.removeEventListener('scroll', this.handlePositionChange);
    }


    window.removeEventListener('keydown', this.trapFocusInsideModal);
    window.removeEventListener('resize', this.handlePositionChangeWithDebounce);
    window.removeEventListener('click', this.handleOnWindowClick);
  }

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }
}

window.PagePal = PagePal

/*
 * In case we want this to end this automatically after a few seconds when user keeps page inactive
 * setTimeout(() => {
 *   intro.finish()
 * }, 10000)
 */