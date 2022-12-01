const sendReport = async(report) => {
    try {
        const { message } = report;

        process.send({
            message,
            eventHandler: 'reports',
          });

        return { error: null };
    } catch (error) {
        return { error };
    }
}

module.exports = sendReport;

//      message example
// { 
//     event: 'reports', 
//     trigger: programmatic, 
//     typeMsg: 'success',
//     text: ( 21-01-2021)
// }