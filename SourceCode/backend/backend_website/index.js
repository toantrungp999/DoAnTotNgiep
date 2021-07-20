const express = require('express');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet')
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

var server = require('http').Server(app);
var io = require('socket.io')(server);

const MessengerSerives = require('./services/messengerServices');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const colorOptionsRoute = require('./routes/colorOptions');
const sizeOptionsRoute = require('./routes/sizeOptions');
const quantityOptionsRoute = require('./routes/quantityOptions');
const brandsRoute = require('./routes/brands');
const categoriesRoute = require('./routes/categories');
const categoryGroupsRoute = require('./routes/categoryGroups');
const uploadRoute = require('./routes/upload');
const uploadsRoute = require('./routes/uploads');
const locationsRoute = require('./routes/location');
const commentsRoute = require('./routes/comments');
const ratesRoute = require('./routes/rates');
const ordersRoute = require('./routes/orders');
const storeAddressRoute = require('./routes/storeAddresses');
const cartsRoute = require('./routes/carts');
const notificationsRoute = require('./routes/notifications');
const refreshTokenRoute = require('./routes/refreshToken');
const messengersRoute = require('./routes/messengers');
const messagesRoute = require('./routes/messages');
const statisticsRoute = require('./routes/statistics');


const cors = require('cors');
const corsOptions = {
    exposedHeaders: 'x-access-token,refreshToken'
};
app.use(cors(corsOptions));

app.use(helmet());
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1800 // limit each IP to 100 requests per windowMs
});


//  apply to all requests
app.use(limiter);
dotenv.config();
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/brands', brandsRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/category-groups', categoryGroupsRoute);
app.use('/api/upload-image', uploadRoute);
app.use('/api/upload-images', uploadsRoute);
app.use('/api/user', userRoute);
app.use('/api/color-options', colorOptionsRoute);
app.use('/api/size-options', sizeOptionsRoute);
app.use('/api/quantity-options', quantityOptionsRoute);
app.use('/api/users', usersRoute);
app.use('/api/location', locationsRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/rates', ratesRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/store-address', storeAddressRoute);
app.use('/api/carts', cartsRoute);
app.use('/api/notifications', notificationsRoute);
app.use('/api/refreshToken', refreshTokenRoute);
app.use('/api/messengers', messengersRoute);//messagesRoute
app.use('/api/messages', messagesRoute);
app.use('/api/statistics', statisticsRoute);

io.on('connection', async (socket) => {
    console.log(socket.id + ': connected');
    //lắng nghe khi người dùng thoát
    socket.on('disconnect', function () {
        console.log(socket.id + ': disconnected');
        MessengerSerives.disconnect(socket.id);
    });

    socket.on('logout', function () {
        console.log(socket.id + ': disconnected')
        MessengerSerives.disconnect(socket.id);
    })

    //lắng nghe khi có người gửi tin nhắn
    socket.on('getMessengers', async (data) => {
        console.log('Get all message start');

        await MessengerSerives.getMessengers(io, socket.id);

        console.log('Get all message end');
    });

    socket.on('updateMessengerCheck', async (data) => {
        console.log('Update messenger start');

        await MessengerSerives.updateMessengerCheck(io, socket.id, data.messengerId);

        console.log('Update messenger end');
    })

    socket.on('sendMessageToUser', async (data) => {
        console.log('Send message to user start');

        await MessengerSerives.sendMessage(io, socket.id, data.to, data.content, data.isCustomerCare);

        console.log('Send message to user end');
    });

    socket.on('sendMessageToBot', async (data) => {
        console.log('Send message to bot start');

        await MessengerSerives.sendMessageToBot(io, socket.id, data.content);

        console.log('Send message to bot end');
    });

    //lắng nghe khi có người login
    socket.on('login', async (data) => {
        console.log('Verify start');

        await MessengerSerives.login(io, socket.id, data);

        console.log('Verify end');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
}, () =>
    console.log('Connected to DB!')
);


const port = process.env.PORT || 3001;
server.listen(port, () => console.log('Server Up and running on ' + port));