const { netlify } = require('../db.json');

const updateQuota = (data, functionType) => {
    let used       = data.capabilities.functions[functionType].used;
    let included   = data.capabilities.functions[functionType].included;
    let unit       = data.capabilities.functions[functionType].unit;

    const percentage = (used / included * 100);

    if (unit === 'seconds') {
        const hours = Math.round(used / 3600);
        const minutes = Math.round(used / 60);
        used = hours >= 1 ? `~ ${hours}` : `${minutes} minutes`;
        included /= 3600;
        unit = 'hours';
    }

    document.querySelector(`.functions .${functionType} .progress > div`).style.setProperty('--percentage', percentage);
    document.querySelector(`.functions .${functionType} small`).textContent = `${used} / ${included} ${unit}`;
}

const isStatsVisible = () => {
    return netlify && (
        netlify.capabilities.functions.runtime.included / 2 <= netlify.capabilities.functions.runtime.used ||
        netlify.capabilities.functions.invocations.included / 2 <= netlify.capabilities.functions.invocations.used
    )
}

export const loadStats = () => {
    if (isStatsVisible()) {
        updateQuota(netlify, 'invocations');
        updateQuota(netlify, 'runtime');
        document.querySelector('.functions').classList.remove('hidden');
    } else {
        document.querySelector('.functions').remove();
    }
}
