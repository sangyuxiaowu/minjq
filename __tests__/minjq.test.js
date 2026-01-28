const path = require('path');

// Ensure the library is loaded in the jsdom environment
const $ = require(path.resolve(__dirname, '..', 'minjq.js'));

describe('minjq basic behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('chainable methods return the same collection', () => {
    document.body.innerHTML = '<div><span class="a"></span><span class="b"></span></div>';
    const res = $('span').addClass('x').toggleClass('y').css({color: 'red'}).show();
    expect(res).toBeDefined();
    expect(typeof res.forEach).toBe('function');
    // calling another method still works
    res.hide();
    expect(document.querySelector('span').style.display).toBe('none');
  });

  test('delegated on/off works for parent element', () => {
    document.body.innerHTML = '<div class="wrap"><button class="btn">OK</button></div>';

    const handler = jest.fn();
    const parent = $('.wrap');
    parent.on('click', '.btn', handler);

    const btn = document.querySelector('.btn');
    btn.click();
    expect(handler).toHaveBeenCalledTimes(1);

    parent.off('click', '.btn', handler);

    btn.click();
    expect(handler).toHaveBeenCalledTimes(1); // no additional calls
  });

  test('direct event binding and removal works', () => {
    document.body.innerHTML = '<button class="direct">X</button>';
    const handler = jest.fn();
    const el = $('.direct');
    el.on('click', handler);

    const btn = document.querySelector('.direct');
    btn.click();
    expect(handler).toHaveBeenCalledTimes(1);

    el.off('click', handler);
    btn.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
