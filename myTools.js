//                          .::::.
//                        .::::::::.
//                       :::::::::::
//                    ..:::::::::::'
//                 '::::::::::::'
//                   .::::::::::
//              '::::::::::::::..
//                   ..::::::::::::.
//                 ``::::::::::::::::
//                  ::::``:::::::::'        .:::.
//                 ::::'   ':::::'       .::::::::.
//               .::::'      ::::     .:::::::'::::.
//              .:::'       :::::  .:::::::::' ':::::.
//             .::'        :::::.:::::::::'      ':::::.
//            .::'         ::::::::::::::'         ``::::.
//        ...:::           ::::::::::::'              ``::.
//       ````':.          ':::::::::'                  ::::..
//                          '.:::::'                    ':'````..
// *********************************************************
// *********************************************************
// *****************typeof的完善****************************
// *********************************************************
// *********************************************************
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
// ************************************
// 除此之外还可以利用这一点创建如下函数
// 需注意Object.prototype.toString不能检测非原生构造函数的构造函数名，因此自定义的任何构造函数构造的对象调用如上方法都会返回[object Object]
function isArray(value) {
    return Object.prototype.toString.call(value) == '[object Object]';
}

function isFunction(value) {
    return Object.prototype.toString.call(value) == '[object Function]';
}

function isRegExp(value) {
    return Object.prototype.toString.call(value) == '[object RegExp]';
}
// 某些库中包含类似下面的JS代码
// var isNativeJSON = window.JSON && Object.prototype.toString.call(JSON) == "[object JSON]"



// **************************************************************
// **************************************************************
// *********************数组去重*********************************
// **************************************************************
// **************************************************************
// 数组去重，应当考虑数组元素的数据类型，但是也要注意各个方法的原理，在进行运算时可能会存在隐式类型转换，比如某个方法在对 [0, 0, "0"] 进行去重时会只留下一个0，比如方法（1），因为方括号传入的都是字符串参数，所以系统会认为"0"和前面的0是一样的会被去掉。其他方法也是如此，需要注意总结。

// ***************（1）普通用法*****************
// 问题：[0, 0, "0", NaN, NaN, "NaN"]去重得到 [0, NaN]
Array.prototype.unique1 = function () {
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

// *****************（2）ES6常用方法*****************
// 问题：[{}, {},[1, 2, 3],[1, 2, 3]]得到  [{…}, {…}, Array(3), Array(3)]
// 本身字面量相同的引用类型值该不该去重就值得思考。
Array.prototype.unique2 = function () {
    // 二者选其一
    // ****************(①)**********************
    // return Array.from(new Set(this));
    // ****************(②)**********************
    return [...new Set(this)];
}
// 使用Set对象，它允许你存储任何类型的唯一值，无论是原始值或者是对象引用,此处应该明白Set已经完成了去重的工作，而使用Array.from或者 ... 扩展运算符取出参数对象中的所有可遍历属性，拷贝到当前对象之中

// ***************（3）indexOf()************
// 问题：对于NaN和字面量相同的引用类型值
// 类似的还可以使用数组的includes方法，检测数组是否有某个值
// 此处的indexOf支持传入引用数据类型，而且判断准确，所以无需担心
Array.prototype.unique3 = function () {
    var n = []; //临时数组
    for (var i = 0; i < this.length; i++) {
        if (n.indexOf(this[i]) == -1) { //==-1表示没有
            n.push(this[i]);
        }
    }
    return n;
}

// *****************（4）jQuery************
// 这个方法有局限，本来它是用于对DOMElement 的 array，所以请注意当这个函数报错的时候八成是因为数组的数据类型不支持，还要注意它输出的结果是经过排序的
// Description: Sorts an array of DOM elements, in place, with the duplicates removed. Note that this only works on arrays of DOM elements, not strings or numbers.
// 参考：https://api.jquery.com/jQuery.unique/
// 记得先  <script src="https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js"></script>
Array.prototype.unique4 = function () {
    return jQuery.unique(this);
}

// *******************filter + indexOf
// 问题：对于NaN和字面量相同的引用类型值
// 通过indexOf匹配字符首次出现的位置和它的下标索引来确定它是否已经出现过了
Array.prototype.unique5 = function () {
    return arr.filter((current, index, self) => {
        return self.indexOf(current) === index //如果不等于表示current之前出现过了
    })
}

// ********************Object.hasOwnProperty******
Array.prototype.unique6 = function () {
    let obj = {};
    return this.filter(function (item, index) {
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}


// **************************************************************
// **************************************************************
// *********************数组元素倒序*********************************
// **************************************************************
// **************************************************************
// 一般来讲我们可以使用内置的reverse函数，但是其性能极差，所以对性能有要求建议手写
// 参考：https://stackoverflow.com/questions/5276953/what-is-the-most-efficient-way-to-reverse-an-array-in-javascript

// 下面两种方法思想相同

function temporarySwap(array) {
    var left = null;
    var right = null;
    var length = array.length;
    for (left = 0, right = length - 1; left < right; left += 1, right -= 1) {
        var temporary = array[left];
        array[left] = array[right];
        array[right] = temporary;
    }
    return array;
}

// 此方法性能极好
function temporarySwapHalf(array) {
    var left = null;
    var right = null;
    var length = array.length;
    for (left = 0; left < length / 2; left += 1) {
        right = length - 1 - left;
        var temporary = array[left];
        array[left] = array[right];
        array[right] = temporary;
    }
    return array;
}

// 使用XOR来交换两个数据的值，第一次见
function xorSwap(array) {
    var i = null;
    var r = null;
    var length = array.length;
    for (i = 0, r = length - 1; i < r; i += 1, r -= 1) {
        var left = array[i];
        var right = array[r];
        // 以下是交换两个值的几种方法
        // ①
        left ^= right;
        right ^= left;
        left ^= right;
        // 还可以压缩为一句
        // right = (left ^= right ^= left) ^ right;
        // ②
        // right = [left, left = right][0];
        // ③
        // 数组解构
        // [right, left] = [left, right];

        array[i] = left;
        array[r] = right;
    }
    return array;
}

function xorSwapHalf(array) {
    var i = null;
    var r = null;
    var length = array.length;
    for (i = 0; i < length / 2; i += 1) {
        r = length - 1 - i;
        //这里新定义了变量是不是多余的，为什么不直接交换array[i]和array[r]呢？
        // var left = array[i];
        // var right = array[r];
        // left ^= right;
        // right ^= left;
        // left ^= right;
        // array[i] = left;
        // array[r] = right;

        // 直接交换array[i]和array[r]就和上面写的3种方法一样
        // ①
        // [array[i], array[r]] = [array[r], array[i]];
        // ②
        // 这种情况之所以这么写是为了提防数组长度为奇数
        // r != i ? (array[i] = (array[r] ^= array[i] ^= array[r]) ^ array[i]) : null;
        // ③
        array[i] = [array[r], array[r] = array[i]][0];
    }
    return array;
}


// **************************************************************
// **************************************************************
// *********************对象push键值对****************************
// **************************************************************
// **************************************************************
Object.prototype.push = function (key, value) {
    this[key] = value;
}





// **************************************************************
// **************************************************************
// ***************JavaScript数组快速排序*************************
// **************************************************************
// **************************************************************
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
}
// 对于数组排序大都时候不需要使用冒泡排序，使用sort再传入一个比较函数即可，如下是两个比较函数
// compare1适用于大多数数据类型，而compare2只适用于数值类型或者其valueOf方法会返回数值类型的对象类型  红宝书P93
function compare1(value1, value2) {
    if (value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
}

function compare2(value1, value2) {
    return value2 - value1;
}




// **************************************************************
// **************************************************************
// ***********************JavaScript继承*************************
// **************************************************************
// **************************************************************
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



// **************************************************************
// **************************************************************
// ************忽略大小写查找字符串中最长的相同连续子串*************
// **************************************************************
// **************************************************************
function getLongest(str) {
    let leg = str.length;
    if (leg <= 1) return str;
    let start = 0;
    let count = 1;
    let max = 1;
    let flag = str[0].toLowerCase();

    for (let i = 1; i < leg; i++) {
        if (str[i].toLowerCase() == flag) {
            ++count; //记录当前相同的长度
        } else {
            if (max < count) {
                max = count; //把当前最大相同长度给max
                start = i - max;
            }
            count = 1;
            flag = str[i].toLowerCase();
        }
    }

    if (max < count) {
        max = count;
        start = leg - max;
    }
    return str.substring(start, start + max);
}
