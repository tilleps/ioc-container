import _ from "lodash";

export default class Container {
  #registry = {};
  #injects = {};
  #instances = {};

  /**
   *
   */
  constructor() {}

  /**
   *
   * @param {string} path
   * @param {Function|object} value
   */
  set(path, value) {
    _.set(this.#instances, path, value);
    return this;
  }

  /**
   *
   * @param {string} path
   * @return {object}
   */
  get(path) {
    return _.get(this.#instances, path);
  }

  /**
   *
   * @param {string} path
   */
  unregister(path) {
    _.unset(this.#registry, path);
    _.unset(this.#injects, path);
    return this;
  }

  /**
   *
   * @param {string} path
   * @param {Function} fn
   * @param {Array<string>} [injects]
   */
  register(path, fn, injects = []) {
    if (!Array.isArray(injects)) {
      throw new Error(`Injects not an array`);
    }

    _.set(this.#registry, path, fn);
    _.set(this.#injects, path, injects);

    return this;
  }

  /**
   *
   * @param {string} path
   * @param {Function} fn
   * @param {Array<string>} [injects]
   */
  registerClass(path, fn, injects = []) {
    if (!Array.isArray(injects)) {
      throw new Error(`Injects not an array`);
    }

    _.set(this.#injects, path, injects);

    _.set(this.#registry, path, function () {
      /**
       * @type {any} args
       */
      let args = Array.prototype.slice.call(arguments);

      args.unshift(null);

      return new (Function.prototype.bind.apply(fn, args))();
    });

    return this;
  }

  /**
   *
   * @param {string} target
   * @param {string} path
   */
  resolve(target, path) {
    let singleton = this.get(path);

    this.set(target, singleton);

    return this;
  }

  /**
   *
   * @param {string} path
   * @return {any}
   */
  singleton(path) {
    let singleton = _.get(this.#instances, path);

    if (typeof singleton === "undefined") {
      singleton = this.factory(path);
      _.set(this.#instances, path, singleton);
    }

    return singleton;
  }

  /**
   *
   * @this {Container}
   * @param {string} path
   * @return {any}
   */
  factory(path) {
    if (!_.has(this.#registry, path)) {
      throw new Error(`Missing factory path: ${path}`);
    }

    let fn = _.get(this.#registry, path);
    let injects = _.get(this.#injects, path);

    let dependencies = injects.map(
      /**
       * @this {Container}
       * @param {string} inject
       */
      function (inject) {
        let dependency = this.singleton(inject);

        return dependency;
      }.bind(this)
    );

    let dependency =
      typeof fn === "function" ? fn.apply(null, dependencies) : fn;

    return dependency;
  }
}
