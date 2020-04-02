var mongoose = require('mongoose');

// mongoDB
mongoose.connect('mongodb+srv://itmd567:'+process.env.MONGODB_PW+'@567websystems-qgpxm.azure.mongodb.net/test?retryWrites=true&w=majority', 
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }  
)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error: ', err));