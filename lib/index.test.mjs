import Container from "./index.mjs";
import tap from "tap";

let container = new Container();

//*
container.register("randomNumber", function () {
  return Math.random();
});

//
//  Factories
//
let factoryOne = container.factory("randomNumber");
let factoryTwo = container.factory("randomNumber");

//  Factory one and two should be different
tap.not(factoryOne, factoryTwo, "factories should be different");

//
//  Instances
//
let singletonOne = container.singleton("randomNumber");
let singletonTwo = container.singleton("randomNumber");
let factoryThree = container.factory("randomNumber");

//  Instances should be the same value
tap.equal(singletonOne, singletonTwo, "singletons should be the same value");

//  Factory should be different
tap.not(singletonTwo, factoryThree, "factory value should be different");

//
//  Non existing dependency
//
container.register("dependency.check", function () {}, [
  "non.existing.dependency",
]);

try {
  container.singleton("dependency.check");
  tap.fail("missing dependency should throw");
} catch (err) {
  tap.pass("missing dependency should throw");
}
//*/

//
//  Classes
//
/**
 *
 * @param {string} type
 * @prop {string} species
 */
function Animal(type) {
  this.species = type;

  if (new.target === undefined) {
    // Normal function call
  } else {
    // Called using new
  }
}

container.registerClass("dog", Animal, ["config.type"]);

/*
container.register("config", function () {
  return {
    type: "dog",
  };
});
//*/

//*
container.set("config", {
  type: "dog",
});
//*/

let animal = container.singleton("dog");

tap.equal(animal.species, "dog");

/*
container.register("config", function() {
  return {};
});

container.registerClass("logger", Logger, ["config"]);
container.register("app", App, ["config"]);


let logger1 = container.singleton("logger");
let logger2 = container.factory("logger");
//*/
