const User = require("../models/user");
const Mensaje = require("../models/mensaje");

const userConected = async (uid) => {
    const user = await User.findById(uid);

    user.online = true;
    await user.save();

    return user;
}
const userDisconect = async (uid) => {
    const user = await User.findById(uid);

    user.online = false;
    await user.save();

    return user;
}

const userList = async () => {
    const userList = await User.find().sort('-online');

    return userList;
}

const saveConversation = async (payload) => {
    try {
        const mensaje = new Mensaje(payload);
        await mensaje.save()

        return mensaje

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    userConected,
    userDisconect,
    userList,
    saveConversation
}