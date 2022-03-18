import { BaseUser } from "../models/BaseUser.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const loginHandler = async (req, res) => {
    try {
        const user = await BaseUser.findOne({email: req.body.email});
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)){
                const token = jwt.sign({_id: user._id, email: user.email, acc_type: user.__t}, process.env.JWT_SECRET, {expiresIn: '30d'});
                const options = {
                    httpOnly: true,
                    expires: new Date(Date.now() + parseInt(process.env.EXPIRE_TOKEN)) 
                };
                res.status(200).cookie('token', token, options).json({
                        email: user.email, 
                        acc_type: user.__t, 
                        first_name: user.first_name, 
                        last_name: user.last_name
                    });
            }
            else throw "Password incorrect";
        }
        else throw "User not found";
    } catch (error) {
        res.status(400).json({error});
    }
};

export { loginHandler };