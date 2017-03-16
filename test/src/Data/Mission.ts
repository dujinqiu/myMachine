var missionJson: MissionJsonType[] = [
    {
        id: "00200302", name: "level up!", description: ["请达到二级"],
        acceptCondition: { level: 1 }, finishCondition: { level: 5 }
    },
    {
        id: "00100201", name: "欢迎", description: ["Hello Egret!","并不是很会", "寻路之后一脸懵逼"]
    },
    {
        id: "00200101", name: "小试炼", description: ["村外强盗横行，无恶不作","亲爱的勇士，请为我们教训他们一下！"],
        acceptCondition: { level: 1 }, finishCondition: { kill: { "slime": 5} }
    },
    {
        id: "00100202", name: "再次欢迎", description: ["我只欢迎二级的"],
        acceptCondition: { level: 2 }
    }
]

function createCondition(data: any): MissionCondition {
    if (!data) {
        return null;
    }
    if (data.level) {
        return new LevelMissionCondition(data.level);
    }
    if (data.kill)
        return new KillMonsterMissionCondition(data.kill);
}

function createMissionsFactory(): missionList {
    var result: missionList = {};
    for (let index in missionJson) {
        var current = missionJson[index];
        var acceptCondition = createCondition(current.acceptCondition);
        var finishCondition = createCondition(current.finishCondition);
        result[current.id] = new Mission(current.id, current.name, current.description,
            acceptCondition, finishCondition);
        result[current.id].toAcceptable();
    }
    return result;
}

interface MissionJsonType {
    id: string;
    name: string;
    description: string[];
    acceptCondition?: any;
    finishCondition?: any;
}

