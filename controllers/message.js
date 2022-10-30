const Message = require('../models/mensaje');

const obtenerChat = async (req, res) => {
    const miId = req.uid
    const messageFrom = req.params.de
    const last100 = await Message.find({
        $or: [
            { from: miId, to: messageFrom },
            { from: messageFrom, to: miId }
        ]
    }).sort({ createdAt: 'asc' }).limit(100);

    res.json({
        ok: true,
        msg: last100
    });
}

module.exports = {
    obtenerChat
}