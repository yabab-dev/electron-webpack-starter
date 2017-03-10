// App entry point
import '../scss/index.scss';

document.body.innerHTML = '<h1>Electron Webpack Starter</h1>';

class Test {
  foo = 'bar';
}

const t = new Test();
t.foo = 'baz';
