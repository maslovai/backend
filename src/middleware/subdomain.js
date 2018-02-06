
//this checks the subdomain. If there is none it skips this bit of the middleware.
//If we find a subdomain we attach it to req.subdomain and pass it down the chain.


//this module not currently required or in use by any other apps.
//the front end will check for the existence of req.subdomains to determine
//what to render. 

export default (req, res, next) =>{
  if (!req.subdomains.length || req.subdomains.slice(-1)[0] === 'www') return next();
  // otherwise we have subdomain here
  var subdomain = req.subdomains.slice(-1)[0];
  // keep it
  req.subdomain = subdomain;
  next();
}
