// typeof的完善
// 原理：在任何值上调用Object原生的toString()方法都会返回一个[Object NativeConstructorName]格式的字符串。每个类在内部都会有一个[[Class]]属性，这个属性中就指定了上述字符串中的构造函数名。
function type(target) {
   var ret = typeof (target);
   var template = {
      "[object Array]": "array",
      "[object Object]": "object",
      "[object Number]": "number - object",
      "[object Boolean]": "boolean - object",
      "[object String]": "string - object",
      "[object RegExp]": "regexp - object"
   }
   if (target === null) {
      return "null";
   }
   if (ret == "object") {
      var str = Object.prototype.toString.call(target);
      return template[str];
   } else {
      return ret;
   }
}
// *************************************************************
// 除此之外还可以利用这一点创建如下函数
// 需注意Object.prototype.toString不能检测非原生构造函数的构造函数名，因此自定义的任何构造函数都会返回[object Object]
function isArray(value) {
   return Object.prototype.toString.call(value) == '[object Object]';
}

function isFunction(value) {
   return Object.prototype.toString.call(value) == '[object Function]';
}

function isArray(value) {
   return Object.prototype.toString.call(value) == '[object RegExp]';
}




// 数组去重（6种方法）第六种是完善的
// 1
Array.prototype.unique1 = function () {
   for (var i = 0; i < this.length; i++) {
      for (var j = i + 1; j < this.length; j++) {
         while (this[j] === this[i]) {
            this.splice(j, 1);
         }
      }
   }
}

// 2
function unique2(array) {
   return [...new Set(array)]
}
// var mySet = new Set(arr);
// [...mySet]; // [1, 2, 3, 4]

// 3
function unique3(array) {
   let result = new Array()
   let mapping = new Map()
   for (let item of array) {
      if (!mapping.has(item)) {
         // has返回一个布尔值，表示某个键是否在当前 Set 对象之中。
         mapping.set(item)
         result.push(item) //result本是空数组，利用Map的has函数构建起来
      }
   }
   return result
}

// 4
function unique4(arr) {
   let res = []
   for (let i = 0, arrlen = arr.length; i < arrlen; i++) {
      let isUnique = true
      for (let j = 0, reslen = res.length; j < reslen; j++) {
         if (arr[i] === res[j]) {
            isUnique = false
            break
         }
      }
      if (isUnique) res.push(arr[i])
   }
   return res
}

// 5
function unique5(arr) {
   let res = [];
   for (let ind = 0, len = arr.length; ind < len; ind++) {
      let val = arr[ind];
      if (res.indexOf(val) === -1) res.push(val)
   }
   return res;
}

// 6
Array.prototype.unique6 = function () {
   var temp = {}, // 此处对象就起到了一个判断属性的作用
      arr1 = [],
      len = this.length;
   for (var i = 0; i < len; i++) {
      if (!temp[this[i]]) {
         // 看对象中有没有数组当前的元素
         // 没有，则作为键值加到对象中
         // 然后把当前键值推入新数组中
         temp[this[i]] = "随便是什么，除了this[i]";
         arr1.push(this[i]);
      }
   }
   return arr1;
}

// 对象push键值对
Object.prototype.push = function (key, value) {
   this[key] = value;
}

// https://leetcode-cn.com/problems/sort-an-array/solution/javascriptshi-xian-shu-zu-kuai-su-pai-xu-by-tian-h/
// 数字数组的快速排序实现,返回排序后的数组
function sortArray(nums) {
   function quicksort(left, right) {
      var key = nums[left],
         i = left,
         j = right;
      if (left > right) return;
      while (i != j) {
         while (nums[j] >= key && i < j)
            j--;
         while (nums[i] <= key && i < j)
            i++;
         if (i < j) {
            nums[i] = [nums[j], nums[j] = nums[i]][0];
         }
      }
      nums[left] = [nums[i], nums[i] = nums[left]][0]; //交换基准数与哨兵的值
      quicksort(left, i - 1);
      quicksort(i + 1, right);
   }
   quicksort(0, nums.length - 1);
   return nums;
};

// 寄生组合式继承（圣杯模式）
var inherit = (function () {
   var F = function () {};
   return function (Target, Origin) {
      F.prototype = Origin.prototype;
      Target.prototype = new F();
      Target.prototype.constuctor = Target;
      Target.prototype.uber = Origin.prototype;
   }
}());


// 返回数组最后一个元素
Array.prototype.last = function () {
   if (this.length > 0)
      return this[this.length - 1];
   else
      return null
}

// 针对停止冒泡的函数封装，因为IE使用的是cancelBubble
// 在停止冒泡处调用stopBubble函数传入时间对象即可
// 还可以把下列代码写成三目
function stopBubble(event) {
   if (event.stopPropagation) {
      event.stopPropagation();
   } else {
      event.cancelBubble = true;
   }
}

// 组织一些默认事件，比如 表单提交，a标签跳转，右键菜单等
function cancelHandler(event) {
   if (event.preventDefault) {
      event.preventDefault(); //IE9以下不兼容
   } else {
      event.returnValue = false; //兼容IE
   }
}


// 对JS事件兼容性的解决，IE9以下只兼容attchEvent
// attachEvent这种东西基本没人用了，只有极少数还处在IE9以下的
function addEvent(elem, type, handle) {
   if (elem.addEventListener) {
      elem.addEventListener(type, handle, false);
   } else if (elem.attachEvent) {
      elem.attachEvent('on' + type, function () {
         handle.call(elem);
      })
   } else {
      elem['on' + type] = handle;
   }
}

// 解除监听器，依次传入元素，事件函数，事件类型，handle不存在就传undefined
function removeMonitor(elem, handle, type) {
   if (elem.addEventListener) {
      elem.removeEventListener(type, handle);
   } else if (elem.attachEvent) {
      elem.detachEvent(elem, handle);
   } else {
      elem["on" + type] = null;
   }
}


// 求字符串字节长度
// 比如："hui会".byteLength() //5
String.prototype.byteLength = function () {
   var str = this,
      leg = str.length;
   for (var i in str) {
      if (str.hasOwnProperty(i)) {
         var db = str[i].charCodeAt(0).toString(16).length == 4;
         if (db) leg += 1; //如果是中文字符就+1
      }
   }
   return leg;
}