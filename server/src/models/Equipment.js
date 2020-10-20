module.exports = (sequelize, DataTypes) => {
    const Equipment = sequelize.define('Equipment', {
        title: DataTypes.STRING,
        thumbnail: DataTypes.STRING,
        pictures: DataTypes.STRING,
        content: DataTypes.TEXT,
        category: DataTypes.STRING,
        status: DataTypes.STRING,
        prices: DataTypes.STRING
    })
    return Equipment
}