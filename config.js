exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://mjtamayo:milanka@ds155737.mlab.com:55737/foodtrack' :
                            'mongodb://mjtamayo:milanka@ds155737.mlab.com:55737/foodtrack');
exports.PORT = process.env.PORT || 3000;