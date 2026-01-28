import { Roles, Permissions } from '../models'

export default (permission) => async (req, res, next) => {
    const access = await Permissions.findOne({
        where: { name: permission },
        include: [{ attributes: ['id', 'name'], model: Roles, as: 'roles', through: { attributes: [] } }]
    });
    if (await req.user.hasPermissionsTo(access)) {
        return next();
    }
    console.error('You do not have the authorization to access this.');
    return res.status(403).send({ message: "You do not have the permission to access this" });
}