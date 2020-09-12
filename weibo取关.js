function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(time)
        }, time);
    })
}

function getNeverFloowBtn() {
    return document.querySelector("#Pl_Official_RelationMyfollow__95 > div > div > div > div.member_box > ul > li:nth-child(1) > div.member_wrap.clearfix > div.mod_info > div.opt > div:nth-child(3) > ul > li:nth-child(3) > a");
}

function getConfirmBtn() {
    return document.querySelector("#layer_15838145292421 > div.content > div.W_layer_btn.S_bg1 > a.W_btn_a.btn_34px");
}

(async () => {
    let neverFollowBtn = getNeverFloowBtn();
    while (neverFollowBtn !== null) {
        neverFollowBtn.click();
        await sleep(500);
        getConfirmBtn().click();
        await sleep(1000);
        neverFollowBtn = getNeverFloowBtn();
    }
})();