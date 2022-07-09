exports.get404 = (req, res, next) => {
  var isAuth = req.session.isAuthenticated;
  console.log('session',isAuth);
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' ,    isAuthenticated: isAuth, 
});
};
