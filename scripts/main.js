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
    document.getElementById("swordLevel").innerText = formatNumber(userdata.sword.level, "scientific");;

    document.getElementById("expProgressBar").style.width = userdata.sword.exp.div(getMaxExpByLevel(userdata.sword.level)).mul(100).mag.toFixed(2) + "%"
    document.getElementById("expProgressValue").innerText = (userdata.sword.exp / getMaxExpByLevel(userdata.sword.level) * 100).toFixed(2) + "%"
}

function updateExp(startExp, endExp, startLevel, endLevel, startTime, duration) {
    let currentExp = lerp(startExp, endExp, (Date.now() - startTime) / duration);
    let currentLevelExp = lerp(getMaxExpByLevel(startLevel), getMaxExpByLevel(endLevel), (Date.now() - startTime) / duration);
    console.log(startLevel, endLevel, getMaxExpByLevel(startLevel), getMaxExpByLevel(endLevel), currentLevelExp)
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
    let rand = new Decimal(Math.random());
    let prevLevel = userdata.sword.level;
    let prevExp = userdata.sword.exp;
    if(rand <= getSuccessChance(userdata.sword.level)) {
        userdata.sword.exp = userdata.sword.exp.add(getExpIncreaseValue())
        while(userdata.sword.exp.compare(getMaxExpByLevel(userdata.sword.level)) >= 0) {
            userdata.sword.level = userdata.sword.level.add(1)
        }
    } else {
        userdata.sword.exp = userdata.sword.exp.sub(getExpDecreaseValue())
        if(userdata.sword.exp.compare(0) < 0) {
            userdata.sword.exp = new Decimal(0) 
        }
    }

    updateExp(prevExp, userdata.sword.exp, prevLevel, userdata.sword.level, Date.now(), 500)
}

function getMaxExpByLevel(level) {
    if(level instanceof Decimal) {
        level = level.floor().add(1)
        return level.pow(new Decimal(2.5)).div(new Decimal(level).add(1).log(3)).add(2).floor()
    } else {
        level = Math.floor(level) + 1
        return Math.floor(Math.pow(level, 2.5) / Math.logN(level + 1, 3) + 2)
    }

}

function getSuccessChance(level) {
    return new Decimal(100).sub(level).div(100)
}

function getExpIncreaseValue() {
    return new Decimal(100);
}

function getExpDecreaseValue() {
    return new Decimal(1) ;
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