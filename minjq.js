/**
 * 简易版jQuery实现
 * 提供基本的DOM选择和操作功能
 * 参考资料:
 * https://github.com/finom/tsimmes/blob/master/es5/src.js
 */
$ = (function(document, s_addEventListener, s_querySelectorAll) {

    // 添加基础工具方法
    const utils = {
        isString(obj) {
            return typeof obj === 'string';
        },
        isFunction(obj) {
            return typeof obj === 'function';
        },
        isObject(obj) {
            return obj !== null && typeof obj === 'object';
        }
    };

    $.prototype = [];

    function $(s, context, tsimmes) {

        tsimmes = Object.create($.prototype);

        try {
            s && tsimmes.push.apply(tsimmes, // if s is truly then push the following
                s[s_addEventListener] // if arg is node or window,
                    ? [s] // then pass [s]
                    : "" + s === s // else if arg is a string
                        ? /</.test(s) // if the string contains "<" (if HTML code is passed)
                            // then parse it and return node.children
                            // use 'addEventListener' (HTMLUnknownElement) if context is not presented
                            ? ((context = document.createElement(context)).innerHTML = s
                                , context.children)
                            : context // else if context is truly
                                ? ((context = $(context)[0]) // if context element is found
                                    ? context[s_querySelectorAll](s) // then select element from context
                                    : tsimmes) // else pass [] (context isn't found)
                                : document[s_querySelectorAll](s) // else select elements globally
                        : s); // else guessing that s variable is array-like Object

        } catch (e) {
            console.error('Selector error:', e);
            return tsimmes;
        }

        return tsimmes;
    }

    /**
     * 获取单个DOM元素
     * @param {string|object} s 选择器或DOM元素
     * @param {object} context 上下文对象,默认为document
     * @returns {object|null} 返回找到的第一个DOM元素,未找到返回null
     * @example
     * $.one('#id');  // 返回id对应的DOM元素
     * $.one('.class', parentEl);  // 在父元素中查找class对应的第一个DOM元素
     */
    $.one = function(s, context) {
        return $(s, context)[0] || null;
    };

    /**
     * DOM加载完成后执行回调
     * @param {Function} callback DOM加载完成后需要执行的回调函数
     * @returns {void}
     * @example
     * $.ready(function() {
     *     console.log('DOM已加载完成');
     * });
     */
    $.ready = function(callback, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('DOM ready timeout'));
            }, timeout);

            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                clearTimeout(timer);
                setTimeout(() => {
                    callback();
                    resolve();
                }, 0);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    clearTimeout(timer);
                    callback();
                    resolve();
                });
            }
        });
    };

    /**
	 *  添加click方法
	 * @param {Function} callback 回调函数
	 * @returns {Object} 返回当前对象
	 * @example
	 * $('button').click(function() {
	 *    console.log('clicked');
	 * });
	 */
	$.prototype.click = function(callback) {
        this.forEach(function(el) {
            el.addEventListener('click', callback);
        });
        return this;
	};
    
    /**
     * 将新元素追加为子元素
     * @param {HTMLElement|Object} $child 要追加的子元素或jQuery对象
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('#parent').append($('<div>新元素</div>'));
     */
    $.prototype.append = function($child) {
        if (!($child instanceof HTMLElement)) {
            $child = $child[0];
        }
        this.forEach(el => el.appendChild($child));
        return this;
    };

    /**
     * 从DOM中移除选中的元素
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('#toRemove').remove();
     */
    $.prototype.remove = function() {
        this.forEach(el => el.parentNode.removeChild(el));
        return this;
    };

    /**
     * 在当前元素中查找匹配选择器的后代元素
     * @param {string} selector CSS选择器
     * @returns {Object} 返回新的jQuery对象实例
     * @example
     * $('.container').find('.item');
     */
    $.prototype.find = function(selector) {
        return $(selector, this);
    };

    //toggleClass

    /**
     * 切换选中元素的CSS类名
     * @param {string} className 要切换的类名
     * @returns {Object} 返回当前jQuery对象实例
     */
    $.prototype.toggleClass = function(className) {
        this.forEach(el => el.classList.toggle(className));
        return this;
    };

    
    /**
     * 检查选中的元素是否包含指定的CSS类名
     * @param {string} className 要检查的类名
     * @returns {boolean} 如果包含则返回true,否则返回false
     * @example
     * if ($('#myElement').hasClass('active')) {
     *     console.log('元素包含active类名');
     * }
     */
    $.prototype.hasClass = function(className) {
        const el = this[0];
        return el.classList.contains(className);
    }

    /**
     * 为选中的元素添加CSS类名
     * @param {string} className 要添加的类名
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('.item').addClass('active');
     */
    $.prototype.addClass = function(className) {
        this.forEach(el => el.classList.add(className));
        return this;
    };

    /**
     * 移除选中元素的指定CSS类名
     * @param {string} className 要移除的类名
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('.item').removeClass('active');
     */
    $.prototype.removeClass = function(className) {
        this.forEach(el => el.classList.remove(className));
        return this;
    };

    /**
     * 获取jQuery对象中指定索引的元素
     * @param {number} index 索引值
     * @returns {Object} 返回新的jQuery对象实例
     * @example
     * $('.item').eq(2); // 获取第3个元素
     */
    $.prototype.eq = function(index) {
        return $(this[index]);
    };

    /**
     * 显示选中的元素(设置display为block)
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('.hidden').show();
     */
    $.prototype.show = function() {
        this.forEach(el => el.style.display = 'block');
        return this;
    };

    /**
     * 隐藏选中的元素(设置display为none)
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('.visible').hide();
     */
    $.prototype.hide = function() {
        this.forEach(el => el.style.display = 'none');
        return this;
    };

    /**
     * 设置或获取元素的innerHTML
     * @param {string} [html] 要设置的HTML内容
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('.content').html('<p>新内容</p>');
     */
    $.prototype.html = function(html) {
        this.forEach(el => el.innerHTML = html);
        return this;
    };

    /**
     * 设置元素的CSS样式
     * @param {Object} obj CSS属性对象
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('.item').css({color: 'red', fontSize: '14px'});
     */
    $.prototype.css = function(obj) {
        this.forEach(el => {
            Object.keys(obj).forEach(key => el.style[key] = obj[key]);
        });
        return this;
    };

    /**
     * 为元素绑定事件监听器,支持事件委托
     * @param {string} eventType 事件类型,多个事件用空格分隔(如 'click keyup')
     * @param {string|Function} selector 选择器(用于事件委托)或事件处理函数
     * @param {Function} [handler] 事件处理函数(当使用事件委托时必传)
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * // 直接绑定事件
     * $('.button').on('click', function(e) {
     *     console.log('clicked');
     * });
     * 
     * // 事件委托
     * $('.container').on('click', '.button', function(e) {
     *     console.log('delegated click');
     * });
     * 
     * // 绑定多个事件
     * $('.input').on('keyup keydown', function(e) {
     *     console.log('key event');
     * });
     */
    $.prototype.on = function(eventType, selector, handler) {
        const isDelegate = utils.isString(selector) && utils.isFunction(handler);
        if (!isDelegate) handler = selector;

        this.forEach(el => {
            eventType.split(' ').forEach(event => {
                const [type, namespace] = event.split('.');

                const eventHandler = function(evt) {
                    if (isDelegate) {
                        const target = evt.target.closest(selector);
                        if (target && el.contains(target)) {
                            handler.call(target, evt);
                        }
                    } else {
                        handler.call(this, evt);
                    }
                };

                // 存储事件处理函数信息
                if (!el._events) el._events = {};
                if (!el._events[type]) el._events[type] = [];
                el._events[type].push({
                    handler: eventHandler,
                    namespace: namespace,
                    original: handler,
                    selector: isDelegate ? selector : null,
                    delegate: !!isDelegate
                });

                el.addEventListener(type, eventHandler);
            });
        });

        return this;
    };

    /**
     * 移除元素上绑定的事件监听器
     * @param {string} eventType 事件类型,多个事件用空格分隔
     * @param {string|Function} [selector] 选择器(用于移除委托事件)或事件处理函数
     * @param {Function} [handler] 要移除的事件处理函数
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * // 移除直接绑定的事件
     * $('.button').off('click', handler);
     * 
     * // 移除委托事件
     * $('.container').off('click', '.button', handler);
     * 
     * // 移除多个事件
     * $('.input').off('keyup keydown', handler);
     */
    $.prototype.off = function(eventType, selector, handler) {
        if (utils.isFunction(selector)) {
            handler = selector;
            selector = null;
        }

        this.forEach(el => {
            if (!el._events) return;

            eventType.split(' ').forEach(event => {
                const [type, namespace] = event.split('.');
                if (!el._events[type]) return;

                const remaining = [];

                el._events[type].forEach(eventData => {
                    // namespace filter
                    if (namespace && eventData.namespace !== namespace) {
                        remaining.push(eventData);
                        return;
                    }

                    // selector (delegated) handling: match delegate entries on the element
                    if (selector) {
                        if (!eventData.delegate || eventData.selector !== selector) {
                            remaining.push(eventData);
                            return;
                        }
                    }

                    // handler filter
                    if (handler && eventData.original !== handler) {
                        remaining.push(eventData);
                        return;
                    }

                    // remove listener
                    el.removeEventListener(type, eventData.handler);
                });

                if (remaining.length) {
                    el._events[type] = remaining;
                } else {
                    delete el._events[type];
                }
            });
        });

        return this;
    };

    /**
     * 获取元素在父元素中的索引位置
     * @returns {number} 返回索引值
     * @example
     * $('.item').index();
     */
    $.prototype.index = function() {
        const el = this[0];
        return Array.prototype.indexOf.call(el.parentNode.children, el);
    };

    /**
     * 移除元素上的所有事件监听器
     * @returns {Object} 返回当前jQuery对象实例
     * @example
     * $('.button').offAll();
     */
    $.prototype.offAll = function() {
        this.forEach((el, i) => {
            const clone = el.cloneNode(true);
            el.parentNode.replaceChild(clone, el);
            this[i] = clone;
        });
        return this;
    };

    /**
     * 获取或设置表单元素的值
     * @param {string} [value] 要设置的值
     * @returns {string|Object} 无参数时返回值,有参数时返回jQuery对象实例
     * @example
     * $('input').val(); // 获取值
     * $('input').val('新值'); // 设置值
     */
    $.prototype.val = function() {
        if (arguments.length) {
            this.forEach(el => el.value = arguments[0]);
            return this;
        }
        return this[0].value;
    };

    /**
     * 获取或设置元素的属性
     * @param {string|Object} attr 属性名或属性对象
     * @param {string} [value] 属性值
     * @returns {string|Object} 获取时返回属性值,设置时返回jQuery对象实例
     * @example
     * $('.img').attr('src'); // 获取src属性
     * $('.img').attr('src', 'image.jpg'); // 设置src属性
     * $('.img').attr({src: 'image.jpg', alt: '图片'}); // 设置多个属性
     */
    $.prototype.attr = function() {
        if (typeof arguments[0] === 'object') {
            this.forEach(el => {
                Object.entries(arguments[0]).forEach(([attr, value]) => {
                    el.setAttribute(attr, value);
                });
            });
            return this;
        }
        if (typeof arguments[0] === 'string' && arguments.length < 2) {
            return this[0].getAttribute(arguments[0]);
        }
        this.forEach(el => el.setAttribute(arguments[0], arguments[1]));
        return this;
    };

    $.prototype.data = function(key, value) {
        if (arguments.length === 1) {
            return this[0].dataset[key];
        }
        this.forEach(el => el.dataset[key] = value);
        return this;
    }

    // 添加节流方法
    $.prototype.throttle = function(eventType, handler, delay = 250) {
        let last = 0;
        return this.on(eventType, function(e) {
            const now = Date.now();
            if (now - last >= delay) {
                handler.call(this, e);
                last = now;
            }
        });
    };

    // 添加防抖方法
    $.prototype.debounce = function(eventType, handler, delay = 250) {
        let timer;
        return this.on(eventType, function(e) {
            clearTimeout(timer);
            timer = setTimeout(() => handler.call(this, e), delay);
        });
    };
    // UMD / CommonJS / AMD 兼容导出
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = $;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return $; });
    } else if (typeof window !== 'undefined') {
        window.$ = $;
    }

    return $;
})(document, 'addEventListener', 'querySelectorAll');