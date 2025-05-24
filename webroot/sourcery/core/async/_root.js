_.ambient.rootmodule("async/")
    .require("sourcery/core/base/")

//some things from chatgpt
    

// var promises = []

// var asyncget = function(i) {
//     var promise = new Promise(function(resolve, reject) {
//         setTimeout(function() {
//             resolve("-" + i)
//         }, 100)
//     })
//     promises.push(promise)
//     return promise
// }

// var wave = function(fn) {
// }

// var test = wave(function(wave) {
//     for (var i = 1; i <= 100; i++) {
//         x = asyncget(i)
//         y = asyncget(100 - i)

//         wave.wait()
//         console.log(x + " " + y)
//     }
// })

// var test = (async () => {
//         var wave = new Wave()

//         for (var i = 1; i <= 5; i++) {
//             x = asyncget(i);
//             y = asyncget(5 - i);

//             await wave.wait(); // Wait for x, y to resolve
//             console.log(x.value + " " + y.value);
//         }
//     })();




// var Wave = function() {
//   var me = this

//   me.promise = new Promise(function(resolve, reject) {
//     me.resolver = resolve
//     me.rejector = reject
//   })
// }

// Wave.prototype = {
//   resolve: function(value) {
//     this.resolver(value)
//   }
//   , reject: function(value) {
//      this.rejector(value)
//   }
//   , then: function(onFulfilled, onRejected) {
// 	return this.promise.then(onFulfilled, onRejected);
//   }
// }
  

// async function myDisplay() {
//   let myPromise = new Wave()
//   setTimeout(function() {myPromise.resolve("I love You !!!");}, 1000);
//   document.getElementById("demo1").innerHTML = await myPromise;
//   document.getElementById("demo2").innerHTML = "XXX";
// }

