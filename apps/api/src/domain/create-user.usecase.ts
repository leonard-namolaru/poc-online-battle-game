import { Pokemon, User} from "./entities";
import { IUserRepository } from "./interfaces";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export class CreateUserUsecase {
    private userRepository: IUserRepository;

    constructor(trainerRepository: IUserRepository) {
        this.userRepository = trainerRepository;
    }

    async execute(command: {name: string, pwd: string, email: string,
        inscriptionDate: Date, myTrainer: number , AllMyPokemon: Pokemon[]}): Promise<User> {
        //hash password
        const salt = await bcrypt.genSalt(10);
        let pwdhash = await bcrypt.hash(command.pwd, salt);
        //generateToken
        let randToken =''
        for (let i=0; i<8; i++){
            const ch = Math.floor((Math.random()*10)+1)
            randToken +=ch
        }
        console.log("rand token",randToken)
         // create a new trainer in db
        const newUser = await this.userRepository.create({
            name: command.name,
            pwd: pwdhash,
            email: command.email,
            inscriptionDate: command.inscriptionDate,
            myTrainer: command.myTrainer,
            AllMyPokemon: [],
            uniqueToken: randToken,
            isValid: false
        
        });
        console.log("rand token",randToken)
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pocamonteam@gmail.com',
                pass: 'yofrtbppyhtmzmtd'
            }
        });
        const mailOptions = {
            from: 'pocamonteam@gmail.com',
            to: command.email,
            subject: 'Inscription pocamon',
            html:`MeRci PoUr vOtRe InScRiPtIoN 👍🏻 \n Verifier votre compte  <a href=http://localhost:3000/verify/${randToken}> ici </a>`
        };
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });


        return newUser;
    }
}

