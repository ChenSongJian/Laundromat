const { defaultWashTypes } = require('../setup/defaultData.js');

const getAllWashTypes = async(req, res) => {
    try {
        res.status(200).json(defaultWashTypes)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

module.exports = getAllWashTypes;
