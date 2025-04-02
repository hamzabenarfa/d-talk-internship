const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authenticationToken');

const authRouter = require("./auth");
const userRouter = require("./user");
const sujetRouter = require("./sujet");
const candidatureRouter = require("./candidature");
const taskRouter = require("./task");
const commentaireRouter = require('./commentaire')
const kpiRouter = require('./kpi');
const categoryRouter = require('./category')
router.use("/auth",authRouter);
router.use("/user",  authenticateToken, userRouter);
router.use("/sujet",   sujetRouter);
router.use("/candidature",  authenticateToken, candidatureRouter);
router.use('/task', authenticateToken, taskRouter);
router.use('/commentaire',authenticateToken, commentaireRouter);
router.use('/category', categoryRouter );
router.use('/kpi', authenticateToken, kpiRouter);


module.exports = router;
