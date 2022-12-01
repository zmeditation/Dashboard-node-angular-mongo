const mongoose = require('mongoose');
const Deduction = mongoose.model( 'Deduction' );
const sumBy = require('lodash/sumBy');
const { RevenueModel } = require('../../../database/mongoDB/migrations/RevenueModel');

exports.bulkAddDeductions = async (query) => {
    try {
        const { publisherId, date, deductions } = query;
        const totalDeduction = sumBy(deductions, 'deduction');

        const deductionsItems = deductions.map(({ type, deduction }) => ({
            type,
            date,
            deduction,
        }));

        await Deduction.findOneAndUpdate(
            { refs_to_user: publisherId }, 
            { deductions: deductionsItems }, 
            { upsert: true },
        );

        await RevenueModel.findOneAndUpdate(
            {
                begin: { $lte: date },
                end: { $gte: date },
                publisher: publisherId,
            }, 
            { deduction: totalDeduction },
        );

        return { successMsg: 'The deductions saved' };
    } catch (error) {
        console.log( error )
        return { error: { msg: 'Add deduction error.' } }
    }
}

