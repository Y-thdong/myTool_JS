function getNeverFollowBtn() {
    return document.querySelector("#Pl_Official_RelationMyfollow__95 > div > div > div > div.member_box > ul > li:nth-child(1) > div.member_wrap.clearfix > div.mod_info > div.opt > div:nth-child(3) > ul > li:nth-child(3) > a");
}
function getConfirmBtn() {
    return document.querySelector("div.content > div.W_layer_btn.S_bg1 > a.W_btn_a.btn_34px > span");
}

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(time)
        }, time);
    })
}

(async () => {
    let neverFollowBtn = getNeverFollowBtn();
    while (neverFollowBtn !== null) {
        neverFollowBtn.click();
        await sleep(90);
        getConfirmBtn().click();
        await sleep(1800);
        neverFollowBtn = getNeverFollowBtn();//获取新的Btn
    }
})();

// async function 用来定义一个返回 AsyncFunction 对象的异步函数。上面是一个匿名函数
// 异步函数是指通过事件循环异步执行的函数，它会通过一个隐式的 Promise 返回其结果。
// 如果你在代码中使用了异步函数，就会发现它的语法和结构会更像是标准的同步函数。

// => 箭头函数表达式的语法比函数表达式更简洁，并且没有自己的this，arguments，
// super或new.target。箭头函数表达式更适用于那些本来需要匿名函数的地方，
// 并且它不能用作构造函数。
// x => x * x相当于function (x) {return x * x;}
// 箭头函数看上去是匿名函数的一种简写，但实际上，
// 箭头函数和匿名函数有个明显的区别：箭头函数内部的this是词法作用域，由上下文确定

// 异步函数可以包含await指令，该指令会暂停异步函数的执行，并等待Promise执行，然后继续执行异步函数，并返回结果。
// 记住，await 关键字只在异步函数内有效。如果你在异步函数外使用它，会抛出语法错误。
// 注意，当异步函数暂停时，它调用的函数会继续执行(收到异步函数返回的隐式Promise)