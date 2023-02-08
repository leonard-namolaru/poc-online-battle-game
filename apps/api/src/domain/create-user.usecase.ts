import { Pokemon, User} from "./entities";
import { IUserRepository } from "./interfaces";
import nodemailer from "nodemailer";

export class CreateUserUsecase {
    private userRepository: IUserRepository;

    constructor(trainerRepository: IUserRepository) {
        this.userRepository = trainerRepository;
    }


    async execute(command: {name: string, pwd: string, email: string,
        inscriptionDate: Date, myTrainer: number , AllMyPokemon: Pokemon[]}): Promise<User> {
        // create a new trainer in db
        const newUser = await this.userRepository.create({
            name: command.name,
            pwd: command.pwd,
            email: command.email,
            inscriptionDate: command.inscriptionDate,
            myTrainer: command.myTrainer,
            AllMyPokemon: [],
        });
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
            text: 'MeRci PoUr vOtRe InScRiPtIoN 👍🏻'
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

