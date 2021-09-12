import { totp } from 'otplib';
import { createDigest } from '@otplib/plugin-crypto';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

export class OTPServico {

    readonly masterKey: string

    constructor(){
        dotenv.config()
        this.masterKey = process.env.OTP_MASTER_KEY;
        totp.options = {
            digits: 6,
            createDigest,
            step: 300

        }
    }

    gerarOTP(identificador: string): string {  
        return totp.generate(this.getSecret(identificador));
    }

    verificarOTP(otp: string, identificador: string): boolean {
        return totp.check(otp, this.getSecret(identificador))
    }

    getNanoTime(): number {
        var hrTime = process.hrtime();
        return hrTime[0] * 1000000000 + hrTime[1];
    }

    private getSecret(identificador: string): string {
        var hash = crypto.createHash('sha256')
        hash.update(this.masterKey + identificador)  
        return hash.digest('hex')
    }
    
}