jQuery(function($) {

    'use strict';

    var _Theme = window._Theme || {};

    _Theme.scroll = function () {
        window.scroll = new SmoothScroll('[data-scroll]', {speed: 300, speedAsDuration: true});
    }

    _Theme.toggleMobileMenu = function () {
        $('#menu-toggle').on('click', () => {
            $('#menu-toggle').toggleClass('active');
            $('#menu-mobile').toggleClass('active');
        });
    };

    _Theme.toggleTheme = function () {
        $('.theme-switch').on('click', () => {
            $('body').toggleClass('dark-theme');
            window.isDark = !window.isDark;
            window.localStorage && window.localStorage.setItem('theme', window.isDark ? 'dark' : 'light');
            this.echarts();
        });
    };

    _Theme.dynamicToTop = function () {
        const min = 300;
        var $toTop = $('#dynamic-to-top');
        $(window).scroll(() => {
            var scrollTop = $(window).scrollTop();
            if (typeof document.body.style.maxHeight === 'undefined') {
                $toTop.css({
                    'position': 'absolute',
                    'top': scrollTop + $(window).height() - 20,
                });
            }
            if (scrollTop > min) {
                (function fadeIn(el, display){
                    display = display || "block";
                    if (el.style.display !== display) {
                        el.style.opacity = 0;
                        el.style.display = display;
                        (function fade() {
                            var val = parseFloat(el.style.opacity);
                            if (!((val += .1) > 1)) {
                                el.style.opacity = val;
                                requestAnimationFrame(fade);
                            }
                        })();
                    }
                })(document.getElementById('dynamic-to-top'));
            } else {
                (function fadeOut(el){
                    if (el.style.display !== "none") {
                        el.style.opacity = 1;
                        (function fade() {
                            if ((el.style.opacity -= .1) < 0) {
                                el.style.display = "none";
                            } else {
                                requestAnimationFrame(fade);
                            }
                        })();
                    }
                })(document.getElementById('dynamic-to-top'));
            }
        });
    };

    _Theme.chroma = function () {
        const blocks = document.querySelectorAll('.highlight > .chroma');
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const codes = block.querySelectorAll('pre.chroma > code');
            const code = codes[codes.length - 1];
            const lang = code ? code.className.toLowerCase() : '';
            block.className += ' ' + lang;
        }

        const nolinenosBlocks = document.querySelectorAll('.highlight > pre.chroma');
        for (let i = 0; i < nolinenosBlocks.length; i++) {
            const block = nolinenosBlocks[i];
            const chroma = document.createElement('div');
            chroma.className = block.className;
            const table = document.createElement('table');
            chroma.appendChild(table);
            const tbody = document.createElement('tbody');
            table.appendChild(tbody);
            const tr = document.createElement('tr');
            tbody.appendChild(tr);
            const td = document.createElement('td');
            tr.appendChild(td);
            block.parentElement.replaceChild(chroma, block);
            td.appendChild(block);
        }
    };

    _Theme.responsiveTable = function () {
        const tables = document.querySelectorAll('.content table');
        for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentElement.replaceChild(wrapper, table);
            wrapper.appendChild(table);
        }
    };

    _Theme._refactorToc = function(toc) {
        // when headings do not start with `h1`
        const oldTocList = toc.children[0];
        let newTocList = oldTocList;
        let temp;
        while (newTocList.children.length === 1
            && (temp = newTocList.children[0].children[0]).tagName === 'UL') {
            newTocList = temp;
        }
        if (newTocList !== oldTocList) toc.replaceChild(newTocList, oldTocList);
    };

    _Theme._linkToc = function () {
        const links = document.querySelectorAll('#TableOfContents a:first-child');
        for (let i = 0; i < links.length; i++) links[i].className += ' toc-link';

        for (let num = 1; num <= 6; num++) {
            const headers = document.querySelectorAll('.content>h' + num);
            for (let i = 0; i < headers.length; i++) {
                const header = headers[i];
                header.innerHTML = `<a href="#${header.id}" class="headerlink"></a>${header.innerHTML}`;
            }
        }
    };

    _Theme._initToc = function () {
        const $toc = $('#post-toc');
        if ($toc.length && $toc.css('display') !== 'none') {
            const SPACING = 80;
            const $footer = $('#post-footer');
            const minTop = $toc.position().top;;
            const mainTop = $('main').position().top;
            const minScrollTop = minTop + mainTop - SPACING;
            const changeTocState = function () {
                const scrollTop = $(window).scrollTop();
                const maxTop = $footer.position().top - $toc.height();
                const maxScrollTop = maxTop + mainTop - SPACING;

                const tocState = {
                    start: {
                        'position': 'absolute',
                        'top': minTop,
                    },
                    process: {
                        'position': 'fixed',
                        'top': SPACING,
                    },
                    end: {
                        'position': 'absolute',
                        'top': maxTop,
                    }
                };

                if (scrollTop < minScrollTop) {
                    $toc.css(tocState.start);
                } else if (scrollTop > maxScrollTop) {
                    $toc.css(tocState.end);
                } else {
                    $toc.css(tocState.process);
                }
            };
            changeTocState();

            const $toclink = $('.toc-link');
            const $headerDummyLink = $('.post-dummy-target');
            const $tocLinkLis = $('.post-toc-content li');
            const activeIndex = function () {
                const scrollTop = $(window).scrollTop();
                const headerlinkTop = $.map($headerDummyLink, function(link) {
                    return $(link).offset().top;
                });
                const searchActiveTocIndex = function(array, target) {
                    for (let i = 0; i < array.length - 1; i++) {
                        if ( target < array[i + 1]) return i;
                    }
                    return array.length - 1;
                };

                const activeTocIndex = searchActiveTocIndex(headerlinkTop, scrollTop);

                $($toclink).removeClass('active');
                $($tocLinkLis).removeClass('has-active');

                if (activeTocIndex !== -1) {
                    $($toclink[activeTocIndex]).addClass('active');
                    let ancestor = $toclink[activeTocIndex].parentNode;
                    while (ancestor.tagName !== 'NAV') {
                        $(ancestor).addClass('has-active');
                        ancestor = ancestor.parentNode.parentNode;
                    }
                }
            };
            activeIndex();
            if (!this._initTocOnce) {
                $(window).scroll(changeTocState);
                $(window).scroll(activeIndex);
                this._initTocOnce = true;
            }
        }
    };

    _Theme.toc = function () {
        const tocContainer = document.getElementById('post-toc');
        if (tocContainer !== null) {
            const toc = document.getElementById('TableOfContents');
            if (toc === null) {
                // toc = true, but there are no headings
                tocContainer.parentNode.removeChild(tocContainer);
            } else {
                this._refactorToc(toc);
                this._linkToc();
                this._initToc();
                // Listen for orientation changes
                window.addEventListener("resize", function () {
                    this.setTimeout(_Theme._initToc, 0);
                }, false);
            }
        }
    };

    _Theme.mermaid = function () {
        if (window.mermaidMap) {
            mermaid.initialize({startOnLoad: false, theme: null});
            const mermaidAPI = mermaid.mermaidAPI
            Object.keys(mermaidMap).forEach((id) => {
                const element = document.getElementById(id);
                mermaidAPI.render("d" + id, mermaidMap[id], (svgCode) => {
                    element.innerHTML = svgCode;
                    const svg = element.firstChild;
                    svg.style.width = "100%"
                }, element);
            });
        }
    }

    _Theme.echarts = function () {
        if (window.echartsMap) {
            for (let i = 0; i < echartsArr.length; i++) {
                echartsArr[i].dispose();
            }
            echartsArr = [];
            Object.keys(echartsMap).forEach((id) => {
                let myChart = echarts.init(document.getElementById(id), window.isDark ? 'dark' : 'macarons', {renderer: 'svg'});
                myChart.setOption(echartsMap[id]);
                echartsArr.push(myChart);
            });
            window.addEventListener("resize", function () {
                this.setTimeout(() => {
                    for (let i = 0; i < echartsArr.length; i++) {
                        echartsArr[i].resize();
                    }
                }, 0);
            }, false);
        }
    }

    _Theme.countdown = function () {
        if (window.countdownMap) {
            Object.keys(countdownMap).forEach(function(id) {
                $(`#${id}`).countdown(countdownMap[id]['date'], {elapse: true})
                    .on('update.countdown', function(event) {
                    $(this).html(event.strftime(countdownMap[id]['pattern']));
                });
            });
        }
    };

    _Theme.typeit = function () {
        if (window.typeitArr) {
            for (let i = 0; i < typeitArr.length; i++) {
                const group = typeitArr[i];
                (function typeone(i) {
                    const content = document.getElementById(`r${group[i]}`).innerHTML;
                    if (i === group.length - 1) {
                        new TypeIt(`#${group[i]}`, {
                            strings: content,
                        }).go();
                        return;
                    }
                    let instance = new TypeIt(`#${group[i]}`, {
                        strings: content,
                        afterComplete: () => {
                            instance.destroy();
                            typeone(i + 1);
                        },
                    }).go();
                })(0);
            }
        }
    };

    $(document).ready(() => {
        _Theme.scroll();
        _Theme.toggleMobileMenu();
        _Theme.toggleTheme();
        _Theme.dynamicToTop();
        _Theme.chroma();
        _Theme.responsiveTable();
        _Theme.mermaid();
        _Theme.echarts();
        _Theme.countdown();
        _Theme.typeit();
        _Theme.toc();
    });
});
