const { defaultCoinTypes } = require('../setup/defaultData.js');

const getAllCoinTypes = async(req, res) => {
    try {
        res.status(200).json(defaultCoinTypes)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

module.exports = getAllCoinTypes;
