var userdata = {
    dataversion: "UpSword 0.10",
    swordLevel: new Decimal(1),
    currency: {
        coin: new Decimal(0),
        up: new Decimal(0),
        shard: new Decimal(0),
        core: new Decimal(0),
        pticket: new Decimal(0),
        tp: new Decimal(0),
        is: new Decimal(0)
    },
    upgrade: {
        coinUpgrade: [0, 0, 0, 0],
        upUpgrade:[0, 0, 0, 0, 0, 0],
        dsUpgrade: [0, 0, 0, 0, 0],
        bcUpgrade: [0, 0, 0, 0, 0],
        tpUpgrade: [0, 0, 0, 0, 0, 0, 0, 0],
        tpSeqUpgrade: [0, 0]
    },
    upgradeChange: [new Decimal(5), new Decimal(3), new Decimal(1), new Decimal(2), new Decimal(5), new Decimal(20)],
    dungeonData: {
        currentDungeon: "none",
        leafDungeon : {
            currentFloor: new Decimal(0),
            maxFloor: new Decimal(0),
            checkpoint: new Decimal(0),
            monsterHP: new Decimal(0),
        },
        waterDungeon : {
            currentFloor: new Decimal(0),
            maxFloor: new Decimal(0),
            checkpoint: new Decimal(0),
            monsterHP: new Decimal(0),
        },
        fireDungeon : {
            currentFloor: new Decimal(0),
            maxFloor: new Decimal(0),
            checkpoint: new Decimal(0),
            monsterHP: new Decimal(0),
        }
    },
    statistics: {
        currency: { 
            totalCoin: new Decimal(0),
            totalUP: new Decimal(0),
            totalDS: new Decimal(0),
            totalBC: new Decimal(0),
            totalTP: new Decimal(0),
            totalIS: new Decimal(0)
        },
        dungeon: {
            /*
            [0] : totalDamage
            [1] : totalHit
            */
            leafDungeon: [new Decimal(0), new Decimal(0)],
            waterDungeon: [new Decimal(0), new Decimal(0)],
            fireDungeon: [new Decimal(0), new Decimal(0)]
        },
        best: {
            bestLevel: new Decimal(0)
        },
        total: {
            totalLevel: new Decimal(0),
            totalHit: new Decimal(0),
            totalDamage: new Decimal(0)
        }
    }
}

function updateCoin() {

}

function formatNumber(value, places) {
    if (value instanceof Decimal) {
        var power = value.e
        var matissa = value.mantissa
     } else {
         var matissa = value / Math.pow(10, Math.floor(Math.log10(value)));
         var power = Math.floor(Math.log10(value));
     }
}