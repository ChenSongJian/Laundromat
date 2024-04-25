const defaultWashingMachine = [
    {
        'washingMachineId': 1,
        'state': 0,
        'lastResetTime': new Date(),
        'doorClosed': true
    }
]

const defaultCoinTypes = [
    { value: 10, label: '10 cent' },
    { value: 20, label: '20 cent' },
    { value: 50, label: '50 cent' },
    { value: 100, label: '1 dollar' },
]

const defaultWashTypes = [
    { type: 'Quick Wash', durationSecond: 10 * 60, priceCent: 200 },
    { type: 'Mild Wash', durationSecond: 30 * 60, priceCent: 250 },
    { type: 'Medium Wash', durationSecond: 45 * 60, priceCent: 420 },
    { type: 'Heavy Wash', durationSecond: 60 * 60, priceCent: 600 }
]

const defaultCollections = [
    'washing_machine'
]

const defaultCollectionData = {
    'washing_machine': defaultWashingMachine
}

module.exports = { defaultCollections, defaultCollectionData, defaultCoinTypes, defaultWashTypes };
