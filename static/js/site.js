// Copyright 2019 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

(() => {
  'use strict';

  function registerHeaderListeners() {
    // Desktop menu hover state
    const menuItemHovers = document.querySelectorAll('.js-desktop-menu-hover');
    menuItemHovers.forEach(menuItemHover => {
      // when user clicks on the dropdown menu item on desktop or mobile,
      // force the menu to stay open until the user clicks off of it.
      menuItemHover.addEventListener('mouseenter', e => {
        const forced = document.querySelector('.forced-open');
        if (forced && forced !== menuItemHover) {
          forced.blur();
          forced.classList.remove('forced-open');
        }
        // prevents menus that have been tabbed into from staying open
        // when you hover over another menu
        e.target.classList.remove('forced-closed');
        e.target.classList.add('forced-open');
      });
      const toggleForcedOpen = e => {
        const isForced = e.target.classList.contains('forced-open');
        const target = e.currentTarget;
        if (isForced) {
          target.removeEventListener('blur', e =>
            target.classList.remove('forced-open')
          );
          target.classList.remove('forced-open');
          target.classList.add('forced-closed');
          target.blur();
          target.parentNode.addEventListener('mouseout', () => {
            target.classList.remove('forced-closed');
          });
        } else {
          target.classList.remove('forced-closed');
          target.classList.add('forced-open');
          target.parentNode.removeEventListener('mouseout', () => {
            target.classList.remove('forced-closed');
          });
        }
        e.target.focus();
      };
      menuItemHover.addEventListener('click', toggleForcedOpen);
      menuItemHover.addEventListener('focus', e => {
        e.target.classList.add('forced-closed');
        e.target.classList.remove('forced-open');
      });
      
      // ensure focus is removed when esc is pressed
      const focusOutOnEsc = e => {
        if (e.key === 'Escape') {
          const textarea = document.getElementById('code');
          if (e.target == textarea) {
            e.preventDefault();
            textarea.blur();
          }
          else {
            const forcedOpenItem = document.querySelector('.forced-open');
            const target = e.currentTarget;
            if (forcedOpenItem) {
              forcedOpenItem.classList.remove('forced-open');
              forcedOpenItem.blur();
              forcedOpenItem.classList.add('forced-closed');
              e.target.focus();
            }
          }
        }
      };
      document.addEventListener('keydown', focusOutOnEsc);
    });

    // Mobile menu subnav menus
    const header = document.querySelector('.js-header');
    const headerbuttons = document.querySelectorAll('.js-headerMenuButton');
    headerbuttons.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        const isActive = header.classList.contains('is-active');
        if (isActive) {
          handleNavigationDrawerInactive(header);
        } else {
          handleNavigationDrawerActive(header);
        }
        button.setAttribute('aria-expanded', isActive);
      });
    });

    const scrim = document.querySelector('.js-scrim');
    scrim.addEventListener('click', e => {
      e.preventDefault();

      // find any active submenus and close them
      const activeSubnavs = document.querySelectorAll(
        '.NavigationDrawer-submenuItem.is-active'
      );
      activeSubnavs.forEach(subnav => handleNavigationDrawerInactive(subnav));

      handleNavigationDrawerInactive(header);

      headerbuttons.forEach(button => {
        button.setAttribute(
          'aria-expanded',
          header.classList.contains('is-active')
        );
      });
    });

    const getNavigationDrawerMenuItems = navigationDrawer => [
      navigationDrawer.querySelector('.NavigationDrawer-header > a'),
      ...navigationDrawer.querySelectorAll(
        ':scope > .NavigationDrawer-nav > .NavigationDrawer-list > .NavigationDrawer-listItem > a, :scope > .NavigationDrawer-nav > .NavigationDrawer-list > .NavigationDrawer-listItem > .Header-socialIcons > a'
      ),
    ];

    const getNavigationDrawerIsSubnav = navigationDrawer =>
      navigationDrawer.classList.contains('NavigationDrawer-submenuItem');

    const handleNavigationDrawerInactive = navigationDrawer => {
      const menuItems = getNavigationDrawerMenuItems(navigationDrawer);
      navigationDrawer.classList.remove('is-active');
      const parentMenuItem = navigationDrawer
        .closest('.NavigationDrawer-listItem')
        ?.querySelector(':scope > a');
      parentMenuItem?.focus();

      menuItems.forEach(item => item.setAttribute('tabindex', '-1'));

      menuItems[0].removeEventListener(
        'keydown',
        handleMenuItemTabLeft.bind(navigationDrawer)
      );
      menuItems[menuItems.length - 1].removeEventListener(
        'keydown',
        handleMenuItemTabRight.bind(navigationDrawer)
      );

      if (navigationDrawer === header) {
        headerbuttons[0]?.focus();
      }
    };

    const handleNavigationDrawerActive = navigationDrawer => {
      const menuItems = getNavigationDrawerMenuItems(navigationDrawer);

      navigationDrawer.classList.add('is-active');
      menuItems.forEach(item => item.setAttribute('tabindex', '0'));
      menuItems[0].focus();

      menuItems[0].addEventListener(
        'keydown',
        handleMenuItemTabLeft.bind(this, navigationDrawer)
      );
      menuItems[menuItems.length - 1].addEventListener(
        'keydown',
        handleMenuItemTabRight.bind(this, navigationDrawer)
      );
    };

    const handleMenuItemTabLeft = (navigationDrawer, e) => {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        handleNavigationDrawerInactive(navigationDrawer);
      }
    };

    const handleMenuItemTabRight = (navigationDrawer, e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        handleNavigationDrawerInactive(navigationDrawer);
      }
    };

    const prepMobileNavigationDrawer = navigationDrawer => {
      const isSubnav = getNavigationDrawerIsSubnav(navigationDrawer);
      const menuItems = getNavigationDrawerMenuItems(navigationDrawer);

      navigationDrawer.addEventListener('keyup', e => {
        if (e.key === 'Escape') {
          handleNavigationDrawerInactive(navigationDrawer);
        }
      });

      menuItems.forEach(item => {
        const parentLi = item.closest('li');
        if (
          parentLi &&
          parentLi.classList.contains('js-mobile-subnav-trigger')
        ) {
          const submenu = parentLi.querySelector(
            '.NavigationDrawer-submenuItem'
          );
          item.addEventListener('click', () => {
            handleNavigationDrawerActive(submenu);
          });
        }
      });
      if (isSubnav) {
        handleNavigationDrawerInactive(navigationDrawer);
        navigationDrawer
          .querySelector('.NavigationDrawer-header')
          .addEventListener('click', e => {
            e.preventDefault();
            handleNavigationDrawerInactive(navigationDrawer);
          });
      }
    };

    document
      .querySelectorAll('.NavigationDrawer')
      .forEach(drawer => prepMobileNavigationDrawer(drawer));
    handleNavigationDrawerInactive(header);
  }

  const onPageLoad = () => {
    registerHeaderListeners();
  };

  // DOM might be already loaded when we try to setup the callback, hence the check.
  if (document.readyState !== 'loading') {
    onPageLoad();
  } else {
    document.addEventListener('DOMContentLoaded', onPageLoad);
  }
})();
