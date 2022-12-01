
const Base = require( '../../Base' );
const { ServerError } = require('../../../handlers/errorHandlers');
const { editPermissions } = require( './editPermissionsSmaller' );
const buildErrorObj = require('../../helperFunctions/buildErrorObj');

class EditPermissions extends Base {
    constructor(args) {
        super(args);
    }

    async execute ( { body: { additional: { permission, id }, query } } ) {
        try {
            if (permission) {
                let error, userEdited, usersExist, editedPerm;

                switch (permission) {

                    case "canEditAllUsers":
                        ({ error, userEdited, usersExist, editedPerm } = await editPermissions(query));
                        break;
                    
                    case "canEditOwnPermissions":

                        if (id.toString() === query.publisherId) {
                            ({ error, userEdited, usersExist, editedPerm } = await editPermissions(query));
                            break;

                        } else { throw buildErrorObj('FORBIDDEN_EDIT_USER_PERMISSION') }
                        
                    default:
                        throw buildErrorObj('FORBIDDEN_EDIT_USER_PERMISSION');
                }

                if (error !== null) { throw error }
                if(usersExist === 0) { throw buildErrorObj('NOT FOUND ANY USER') }

                return {
                    success: true,
                    userEdited,
                    editedPerm
                }
            }
        } catch (error) {
            console.log(error.message && error.message);
            throw new ServerError(`${error && error.msg ? error.msg : 'ERROR_TO_EDIT_PERMISSIONS'}`, 'BAD_REQUEST');
        }
    }
}

module.exports = EditPermissions;
