const fs = require('fs').promises;
const path = require('path')
const mime = require('mime-types');
const {ERRORS} = require('../../constants/errors');
const {InvoiceModel} = require('../../database/mongoDB/migrations/InvoiceModel');
const User = require('../../database/mongoDB/migrations/UserModel');
const {ServerError} = require('../../handlers/errorHandlers');
const {invoicesInformerService, groupInvoiceInformerService} = require('../../services/invoices/index');

const notFound = (id) => {
    throw new ServerError(`Invoice with id ${id} not found.`, ERRORS.NOT_FOUND);
}

module.exports = {
    example: async (request, response) => {
        const filePath = path.join(__dirname, '../../public/invoice/Invoice_template.xlsx');

        /** If file does not exist, fs throw error */
        const file = await fs.readFile(filePath);
        response.send(file);
    },
    create: async (request, response) => {
        const {file} = request;
        const {begin, end, publisher, additional: {id, role}} = request.body;
        const invoice = new InvoiceModel({
            publisher: publisher ? publisher : id,
            name: file.originalname,
            valid: begin ? {begin, end} : {begin: undefined, end: undefined}
        });
        await invoice.save();
        await fs.writeFile(invoice.fileDestination(), file.buffer);
        await invoice.populate({path: 'publisher', select: '_id name'}).execPopulate();
        if (publisher) {
            await invoicesInformerService([`${publisher}`, `${id}`], {
                event: 'invoices',
                action: 'upload',
                file: file.originalname,
                success: true
            });
        } else {
            await invoicesInformerService([`${id}`], {
                event: 'invoices',
                action: 'upload',
                file: file.originalname,
                success: true
            });
        }

        const message = {
            event: 'invoices',
            action: 'new_invoice',
            file: file.originalname,
            success: true,
            pub: (invoice.publisher && invoice.publisher.name) ? invoice.publisher.name : ""
        }

        // notification for account manager
        User.findById(publisher ? publisher : id).lean().then(async (user) => {
                if (user && user.am) {
                    await invoicesInformerService([user.am], message);
                }
            }
        ).catch(e => console.log(e));

        // notification for finance manager
        if (role !== 'FINANCE MANAGER') {
            await groupInvoiceInformerService('FINANCE MANAGER', message);
        }
        response.send({result: invoice.toObject({transform: true})});
    },
    remove: async (request, response) => {
        const {id} = request.params;
        /**
         * @type {object} invoice
         */
        const invoice = await InvoiceModel.findById(id);
        if (!invoice) {
            notFound(id);
        }
        try {
            await fs.unlink(invoice.fileDestination());
        } catch (e) {
            console.log(e);
        }
        await InvoiceModel.findOneAndRemove({_id: id});
        response.send(invoice);
    },
    get: async (request, response) => {
        let {period, publishers, managers} = request.body;
        /**
         * @type {object} user - user object from MongoDb
         * @property {string} role - user role
         * @property {object} connected_users - connected pubs and/or account managers
         *
         */
        let user = await User.findById(request.body.additional.id).lean(); // check user role and connected users
        if (user) {
            const role = user.role,
                connected_pubs = user.connected_users ? user.connected_users.p : [],
                connected_accs = user.connected_users ? user.connected_users.am : [];
            switch (role) {
                case 'ACCOUNT MANAGER': {
                    if (!publishers.length) {
                        if (connected_pubs && connected_pubs.length) { // if account has pubs, push them into request
                            connected_pubs.forEach(pubId => publishers.push(pubId));
                        }
                    }
                }
                    break;
                case 'SENIOR ACCOUNT MANAGER': {
                    if (!publishers.length && !managers.length) {
                        if (connected_pubs && connected_pubs.length) {
                            connected_pubs.forEach(pubId => publishers.push(pubId));
                        }

                        if (!managers.length) {
                            if (connected_accs && connected_accs.length) { // if senior has connected accs, push their publishers into request
                                for (const acc of connected_accs) {
                                    /**
                                     * @type {object} a - account manager
                                     * @property {object} connected_users
                                     *
                                     */
                                    const a = await User.findById(acc).lean();
                                    const p = a.connected_users.p;
                                    if (p && p.length) {
                                        p.forEach(pubId => publishers.push(pubId));
                                    }
                                }
                            }
                        }
                    }
                }
                    break;
                case 'PUBLISHER': { // publisher should get only his own invoices
                    publishers = [user._id];
                    managers = [];
                }
                    break;
            }
        }
        // get users of each manager, if needed
        if (managers && managers.length) {
            for (const manager of managers) {
                if (manager !== null) {
                    let {connected_users} = await User.findOne({_id: manager}, {'connected_users.p': 1}).lean();
                    if (connected_users['p'].length) {
                        connected_users['p'].forEach(pubId => {
                            publishers.push(pubId);
                        })
                    }
                }
            }
        }

        /**
         * @type {Array} invoices - array of invoices
         */
        let invoices = await InvoiceModel.find({
            'valid.begin': {$gte: new Date(period.begin)},
            'valid.end': {$lte: new Date(period.end)},
            ...publishers.length ? {publisher: {$in: publishers}} : {}
        })
            .lean()
            .populate({path: 'publisher', select: '_id name am enabled'});
        if (invoices.length === 0) {
           return response.status(204).send();
        }
        managers[0] === null && invoices.length
            ? response.send(invoices.filter(invoice => invoice.publisher.am === null))
            : response.send(invoices)
    },
    edit: async (request, response) => {
        const {id} = request.params;
        const {status, publisher, cancelReason} = request.body;
        const invoice = cancelReason
            ? await InvoiceModel.findOneAndUpdate({_id: id}, {status, cancelReason}).lean()
            : await InvoiceModel.findOneAndUpdate({_id: id}, {status}).lean()
        if (!invoice) {
            notFound(id);
        }
        // notification to publisher if its invoice was declined
        if (status === 'declined' && cancelReason) {
            const i = await InvoiceModel.findById(id);
            await invoicesInformerService([publisher],
                {
                    event: 'invoices',
                    action: 'invoice_declined',
                    file: i['name'],
                    success: true,
                    cancelReason
                })
        }
        // notification to publisher if its invoice was paid
        if (status === 'paid') {
            const i = await InvoiceModel.findById(id);
            await invoicesInformerService([publisher],
                {
                    event: 'invoices',
                    action: 'invoice_paid',
                    file: i['name'],
                    success: true
                })
        }
        // notification to accountant if invoice approved, disabled for now
        /*        if (status === 'approved') {
                    const i = await InvoiceModel.findById(id);
                    const pub = await User.findById(publisher);
                    await invoicesInformerService(["5dee5431db996e537c8ebf46"], // заменить на id бухгалтера
                        {
                            event: 'invoices',
                            action: 'invoice_approved',
                            file: i['name'],
                            publisher: pub['name'],
                            success: true
                        })
                }*/
        response.send(invoice);
    },
    download: async (request, response) => {
        const {id} = request.params;
        /**
         * @type {object} invoice - array of invoices
         * @property {string} fileName - file name
         */
        const invoice = await InvoiceModel.findById(id).lean();
        if (!invoice) {
            notFound(id);
        }
        const filePath = path.join(__dirname, `../../dist/invoices/${invoice.fileName}`);
        const file = await fs.readFile(filePath);
        response.setHeader("Content-Type", mime.lookup(filePath));
        response.send(file);
    }
}
