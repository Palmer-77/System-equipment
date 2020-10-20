const {Equipment} = require('../models')

module.exports = {
    // indx with serach Equipment
    async index (req, res) {
        try {
            let equipments = null
            const search = req.query.search
            // console.log('search key: ' + search)
            if (search) {
                equipments = await Equipment.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                equipments = await Equipment.findAll({
                    order: [['createdAt', 'DESC']]
                })
            }
                res.send(equipments)
            } catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the equipments'
            })
        }
    },
    // create Equipment
    async create (req, res) {
        // res.send(JSON.stringify(req.body))
        try {
            const equipment = await Equipment.create(req.body)
            res.send(equipment.toJSON())
        } catch (err) {
            res.status(500).send({
                error: 'Create Equipment incorrect'
            })
        }
    },
    // edit Equipment, suspend, active
    async put (req, res) {
        try {
            await Equipment.update(req.body, {
                where: {
                    id: req.params.equipmentId
                }
            })
        res.send(req.body)
        } catch (err) {
            req.status(500).send({
                error: 'Update Equipment incorrect'
            })
        }
    },
        // delete Equipment
    async remove (req, res) {
        try {
            const equipment = await Equipment.findOne({
                where: {
                id: req.params.equipmentId
                }
            })
            if(!equipment){
                return res.status(403).send({
                    error: 'The Equipment information was incorrect'
                })
            }
            await equipment.destroy()
            res.send(equipment)
        } catch (err) {
            req.status(500).send({
                error: 'The Equipment information was incorrect'
            })
        }
    },
        // get Equipment by id
    async show (req, res) {
        try {
            const equipment = await Equipment.findById(req.params.equipmentId)
            res.send(equipment)
        } catch (err) {
            req.status(500).send({
                error: 'The Equipment information was incorrect'
            })
        }
    },
    async frontIndex (req, res) {
        try {
            let equipments = null
            const search = req.query.search
            console.log('----------> search key: ' + search)
            if (search) {
                equipments = await Equipment.findAll({
                    where: {
                        $or: [
                            'title', 'content', 'category'
                        ].map(key => ({
                            [key]: {
                                $like: `%${search}%`,
                            }
                        })),
                        $and: [
                            {
                                status:
                                {
                                    $eq: "published"
                                }
                            },
                        ]
                    },
                    order: [['createdAt', 'DESC']]
                })
            } else {
                equipments = await Equipment.findAll({
                where: {
                    'status': 'published'
                },
                    order: [['createdAt', 'DESC']]
                })
            }
            res.send(equipments)
        }catch (err) {
            res.status(500).send({
                error: 'an error has occured trying to fetch the equipments'
            })
        }
    },

}