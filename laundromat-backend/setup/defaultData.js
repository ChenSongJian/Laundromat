// set last reset time to the initialisation time for easier computation of stats
const defaultWashingMachine = [
    {
        'washingMachineId': 1,
        'state': 0,
        'lastResetTime': new Date(),
        'doorClosed': true
    }
]

// using cent as unit of coin to avoid floating point error
const defaultCoinTypes = [
    { value: 10, label: '10 cent' },
    { value: 20, label: '20 cent' },
    { value: 50, label: '50 cent' },
    { value: 100, label: '1 dollar' },
]

// using cent as unit of coin to avoid floating point error
const defaultWashTypes = [
    { type: 'Quick Wash', durationSecond: 10 * 60, priceCent: 200 },
    { type: 'Mild Wash', durationSecond: 30 * 60, priceCent: 250 },
    { type: 'Medium Wash', durationSecond: 45 * 60, priceCent: 420 },
    { type: 'Heavy Wash', durationSecond: 60 * 60, priceCent: 600 }
]

// used to create the default collections when the collections are not present in database
// did not include coin_type and wash_type given the small size and static nature of the data
const defaultCollections = [
    'washing_machine'
]

const defaultCollectionData = {
    'washing_machine': defaultWashingMachine
}

module.exports = { defaultCollections, defaultCollectionData, defaultCoinTypes, defaultWashTypes };
