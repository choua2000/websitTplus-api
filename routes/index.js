import express from 'express'
import userRoute from './user.Route'
import authRoute from './auth.Route'
import roleRoute from './role.Route'
import permissRoute from './permission.Route'
import cateProductRoute from './cateProduct.Route'
import chatRoute from './chat.Route'
import chatQuestion from './chatQuestions.Route'
import nice from "./test.Route"
// import catePackageRoute from './catePackage.Route'
import postTypeRoute from './postType.Route'
import packageRoute from './package.Route'
import productionRoute from './production.Route'
import postRoute from './post.Route'
import positionRoute from './position.Route'
import contactRoute from './contact.Route'
import jobRecuitRoute from './jobRecuit.Route'
import languageRoute from './language.Route'
import banRoute from './banner.Route'
import siteInfoRoute from './siteInfo.Route'
import top from './topping.Route';
import tplusBookRoute from './tplusBook.Route';
import newCateRoute from './newCategory.Route';
import homeRoute from './home.Route';
import simTypeRoute from './simType.Route';
import sendSMS from './sendOTP.Route'
import titleContactsRoute from './titleContact.Route';
import internationalCallsRoute from './internationCall.Route';
import typeRoute from './typePackage.Route';
import categoryPackage from './categoryPackage.Route';
import report from './reportRoute';
import jobRoute from './job.Route';
import typeJobRoute from './type_job.Route';
import adminChatRoute from './admin/chat.Route'
import jobApplicationRoute from './job_application.Route'
import bannerFindjobRoute from './bannerfindjob.Route'

const app = express();
//app.use("/v1",nice);
app.use('/v1', userRoute);

app.use('/v1', authRoute);

app.use('/v1', roleRoute);

app.use('/v1', permissRoute);

app.use('/v1', cateProductRoute);

app.use('/v1', chatRoute);

app.use('/v1', chatQuestion);


// app.use('/v1', catePackageRoute);

app.use('/v1', postTypeRoute);

app.use('/v1', packageRoute);

app.use('/v1', productionRoute);

app.use('/v1', postRoute);

app.use('/v1', positionRoute);

app.use('/v1', contactRoute);

app.use('/v1', jobRecuitRoute);

app.use('/v1', languageRoute);

app.use('/v1', banRoute);

app.use('/v1', siteInfoRoute);

app.use('/v1', top);

app.use('/v1', tplusBookRoute);

app.use('/v1', newCateRoute);

app.use('/v1', simTypeRoute);

app.use('/v1', homeRoute);

app.use('/v1', sendSMS);

app.use('/v1', titleContactsRoute);

app.use('/v1', internationalCallsRoute);

app.use('/v1', typeRoute);

app.use('/v1', categoryPackage);

app.use('/v1/admin', adminChatRoute)

app.use('/v1', report);

app.use('/v1', jobRoute);

app.use('/v1', typeJobRoute);

app.use('/v1', jobApplicationRoute);

app.use('/v1', bannerFindjobRoute);

module.exports = app;
