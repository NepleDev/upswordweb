let userdata = {
    dataversion: 0,
    sword: {
        level: new Decimal(0),
        exp: new Decimal(0),
        count: new Decimal(10),
    },

    currency: {
        coin: new Decimal(0),
    },

    upgrade: {

    },

    statistics: {
        currency: {
            totalCoin: new Decimal(0),
        },
        best: {
            level: new Decimal(0)
        },
        total: {
            upgrade: new Decimal(0),
        }
    },

    option: {
        ui:{
            updateRate: 60,
        }
    }
}

function init() {
    setInterval(update, 50);
}
function update() {
    document.getElementById("coinAmount").innerText = formatNumber(userdata.currency.coin, "scientific");
    document.getElementById("swordLevel").innerText = formatNumber(userdata.sword.level, "scientific");

    // upgradeCount
    document.getElementById("upgradeCount").innerText = formatNumber(userdata.sword.count, "scientific")
    console.log("rgb(" + 255 - userdata.sword.count.div(getMaxUpgradeCount()).mul(255).mag + "," + userdata.sword.count.div(getMaxUpgradeCount()).mul(255).mag + ", 0)")
    document.getElementById("upgradeCount").style.color =
        "rgb(" + new Decimal(255).sub(userdata.sword.count.div(getMaxUpgradeCount()).mul(205)).mag + "," + userdata.sword.count.div(getMaxUpgradeCount()).mul(205).mag + "," + new Decimal(100).sub(userdata.sword.count.div(getMaxUpgradeCount()).mul(100)).mag + ")"

    document.getElementById("expProgressBar").style.width = userdata.sword.exp.div(getMaxExpByLevel(new Decimal(100))).mul(100).mag.toFixed(2) + "%"
    document.getElementById("expProgressValue").innerText = (userdata.sword.exp.div(getMaxExpByLevel(new Decimal(100))).mul(100)).mag.toFixed(2) + "%"

    document.getElementById("levelExpProgressBar").style.width =
        userdata.sword.exp
            .sub(getMaxExpByLevel(userdata.sword.level.sub(1)))
            .div(getMaxExpByLevel(userdata.sword.level).sub(getMaxExpByLevel(userdata.sword.level.sub(1))))
            .mul(100)
            .mag
            .toFixed(2) + "%"

    document.getElementById("levelExpProgressValue").innerText =
        userdata.sword.exp
            .sub(getMaxExpByLevel(userdata.sword.level.sub(1)))
            .div(getMaxExpByLevel(userdata.sword.level).sub(getMaxExpByLevel(userdata.sword.level.sub(1))))
            .mul(100)
            .mag
            .toFixed(2) + "%"
}

function updateExp(startExp, endExp, startLevel, endLevel, startTime, duration) {
    let currentExp = lerp(startExp, endExp, (Date.now() - startTime) / duration);
    let currentLevelExp = lerp(getMaxExpByLevel(startLevel), getMaxExpByLevel(endLevel), (Date.now() - startTime) / duration);
    document.getElementById("swordExp").innerText = currentExp.toFixed(0) + " / " + currentLevelExp.toFixed(0);

    if(Date.now() - startTime <= duration) {
        setTimeout(updateExp, 1 / userdata.option.ui.updateRate * 1000, startExp, endExp, startLevel, endLevel, startTime, duration)
    } else {
        document.getElementById("swordExp").innerText = endExp.toFixed(0) + " / " + getMaxExpByLevel(endLevel);
    }
}

function updateCoin() {

}

function upgradeButton() {

    // 강화 횟수가 남아있는지 체크
    if(userdata.sword.count <= 0) {
        return;
    }

    // 강화 횟수 차감
    userdata.sword.count = userdata.sword.count.sub(1)

    // random 함수로 성공 / 실패 결정
    let rand = new Decimal(Math.random());

    // smooth change animation을 위한 이전 값 저장
    let prevLevel = userdata.sword.level;
    let prevExp = userdata.sword.exp;

    // 성공 / 실패 시 처리
    if(rand <= getSuccessChance(userdata.sword.level)) {
        userdata.sword.exp = userdata.sword.exp.add(getExpIncreaseValue())
        while(userdata.sword.exp.compare(getMaxExpByLevel(userdata.sword.level)) >= 0) {
            userdata.sword.level = userdata.sword.level.add(1)
        }
    } else {
        userdata.sword.exp = userdata.sword.exp.sub(getExpDecreaseValue())
        console.log(userdata.sword.exp.compare(getMaxExpByLevel(userdata.sword.level - 1)))
        if(userdata.sword.exp.compare(getMaxExpByLevel(userdata.sword.level.sub(1))) < 0) {
            userdata.sword.exp = getMaxExpByLevel(userdata.sword.level.sub(1))
        }
    }

    // UI Update
    updateExp(prevExp, userdata.sword.exp, prevLevel, userdata.sword.level, Date.now(), 500)
}

function getMaxExpByLevel(level) {
    if(level instanceof Decimal) {
        if(level.compare(new Decimal(0)) < 0) {
            return new Decimal(0)
        }
        level = level.floor().add(1)
        return level.pow(new Decimal(2.5)).div(new Decimal(level).add(1).log(3)).add(2).floor()
    } else {
        if(level < 0) {
            return 0;
        }
        level = Math.floor(level) + 1
        return Math.floor(Math.pow(level, 2.5) / logN(level + 1, 3) + 2)
    }

}

function getSuccessChance(level) {
    return new Decimal(100).sub(level).div(100)
}

function getExpIncreaseValue() {
    return new Decimal(2);
}

function getExpDecreaseValue() {
    return new Decimal(1) ;
}

function getMaxUpgradeCount() {
    return new Decimal(10);
}

function formatNumber(value, format, fix=2) {
    let power, matissa, formatString;
    if (value instanceof Decimal) {
        power = value.e;
        matissa = value.mantissa;
    } else {
         matissa = value / Math.pow(10, Math.floor(Math.log10(value)));
         power = Math.floor(Math.log10(value));
    }

    if (format === "scientific") {
        if(power < 3) {
            formatString = (matissa * Math.pow(10, power)).toFixed(0)
        } else {
            formatString = matissa.toFixed(fix) + "e" + power;
        }
    } else if(format == "logarithm") {
        formatString = "e" + value.log10().toFixed(fix)
    } else if (format === "alphabet") {
        formatString = getUnitString(matissa, power, fix, "abcdefghijklmnopqrstuvwxyz")
    }

    return formatString;
}

function getUnitString(matissa, power, fix, unitBase){
    let unitString = ""
    matissa *= Math.pow(10, power % 3)
    power = Math.floor(power / 3)

    while (power > 0) {
        unitString = unitBase[(power - 1) % unitBase.length] + unitString;
        power = Math.floor((power - 1) / unitBase.length)
    }

    return matissa.toFixed(fix) + unitString;
}

function animateProgressBar(start, end, startTime, duration) {
    let timeDiff = Date.now() - startTime;
     document.getElementById("expProgressBar").style.width = ((start + (end - start) * ease((timeDiff) / duration)) % 100).toFixed(2) + "%";

     if(timeDiff <= duration) {
         setTimeout(animateProgressBar, 1/144*1000, start, end, startTime, duration);
     }
}

function lerp(a, b, t) {
    return a * (1 - ease(t)) + b * ease(t);
}

function ease(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function logN(x, n) {
    return Math.log(x) / Math.log(n);
}