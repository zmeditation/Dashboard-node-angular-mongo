module.exports = {
  validateAuthentication(req, res, next) {
    req.checkBody('email').notEmpty();
    req.sanitizeBody('email');
    req.checkBody('email').isEmail();
    req.sanitizeBody('email').normalizeEmail({
      remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false
    });

    req.checkBody('password').notEmpty();
    req.sanitizeBody('password');

    const errors = req.validationErrors();
    if (errors) {
      const errArray = errors.map((err) => err.msg);
      res.status(400).json({ success: false, msg: errArray.join('. ') });
      return; // stop the function from running
    }
    next(); //there were no errors
  }
};
