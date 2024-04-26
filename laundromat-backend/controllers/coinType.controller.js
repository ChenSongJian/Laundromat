const { defaultCoinTypes } = require('../setup/defaultData.js');

// Using hard-coded data for simplicity given the small size and static nature of the data
const getAllCoinTypes = async(req, res) => {
    try {
        res.status(200).json(defaultCoinTypes)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

module.exports = getAllCoinTypes;
