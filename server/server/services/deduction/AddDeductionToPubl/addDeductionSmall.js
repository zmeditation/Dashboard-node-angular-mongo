const mongoose = require('mongoose');
const Deduction = mongoose.model( 'Deduction' );
const { RevenueModel } = require('../../../database/mongoDB/migrations/RevenueModel');
const { upsertDeduction, createDeductionSchema, getTotalDeductionByDate } = require('../deductionsHelper/helper');


exports.addDeductionToPubl = async ( query ) => {
    try {
        const { publisherId, type, date, sumOfDeduction } = query;

        const deductionTable = await Deduction.findOne( { refs_to_user: publisherId });

        const dateTime = new Date(date).getTime();
        if(!dateTime) throw {error: { msg:'INVALIDE_DATE'} };
        
        if(deductionTable === null) {  
            const { successMsg, errorCrDedSchema } = await createDeductionSchema( 
                publisherId,
                type,
                date,
                sumOfDeduction,
            );
            if(errorCrDedSchema !== null) throw { error: errorCrDedSchema };
            
            return successMsg;
        }

        const { newDeductions, successMsg, errorChangeDed } = await upsertDeduction(
            deductionTable.deductions,
            type,
            date,
            sumOfDeduction,
        );
        
        if(errorChangeDed !== null) throw { error: errorChangeDed };
        
        deductionTable.deductions = newDeductions;

        const totalDeduction = getTotalDeductionByDate(newDeductions, date);

        await deductionTable.save();
        await RevenueModel.findOneAndUpdate(
            {
                begin: { $lte: dateTime },
                end: { $gte: dateTime },
                publisher: publisherId,
            }, 
            { deduction: totalDeduction },
        );

        return {
            successMsg,
            error: null
        };
    } catch ( error ) {
        console.log( error )
        return { error: { msg: 'Add deduction error.' } }
    }
}

